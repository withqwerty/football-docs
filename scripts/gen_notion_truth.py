#!/usr/bin/env python3
"""
Derive a provider's API surface from a public Notion guide.

Some vendors publish neither an OpenAPI specification nor a Postman collection -
their API contract lives in a Notion page. Driblab is the first of these. This
script reads the page through Notion's own public `loadPageChunk` endpoint, walks
the block tree, and writes data/provider-truth/<provider>.notion.json holding the
request surface only: endpoint paths and methods, parameter names, response field
names and metric keys.

The page is not mirrored into this repository. It is the vendor's document, and
its response samples carry real player, team and season data plus presigned S3
URLs. Only names are kept - never a value from a sample body.

Usage:
  python3 scripts/gen_notion_truth.py <notion-page-url-or-id> --provider driblab
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.request
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TRUTH_DIR = REPO / "data" / "provider-truth"

# Section markers Notion pages of this shape use. They are emoji rather than
# headings, so the parser keys off them rather than off block type.
MARK_METHOD = "⚙"  # gear, precedes "GET /countries"
MARK_URL = "\U0001f517"  # link, the callable URL
MARK_PARAMS = "✉"  # envelope, precedes a parameter table
MARK_FIELDS = "\U0001f4e9"  # inbox, precedes a response-field table
MARK_SAMPLE = "\U0001f4ca"  # chart, precedes a response sample
MARK_DESC = "\U0001f4dd"  # memo, the one-line description
PAGINATED = "✅"  # white check mark
NOT_PAGINATED = "❌"  # cross mark

METHODS = ("GET", "POST", "PUT", "PATCH", "DELETE")
# The guide is inconsistent about the space after the verb: five player
# endpoints read "GET/player/{id}/injuries". Both spellings name the same route.
ENDPOINT_RE = re.compile(rf"^({'|'.join(METHODS)})\s*(/\S*)")
HEADING_RE = re.compile(r"^\s*([\d.]+)\.?\s*(.+?)\s*$")

# Keys that appear in every sample envelope rather than in a resource.
ENVELOPE_KEYS = {"statusCode", "body", "message"}


def page_id_from(arg: str) -> str:
    raw = arg.strip().rstrip("/").split("/")[-1].split("#")[0].split("?")[0]
    hexes = re.findall(r"[0-9a-fA-F]{32}", raw) or re.findall(
        r"[0-9a-fA-F]{32}", raw.replace("-", "")
    )
    if not hexes:
        sys.exit(f"could not find a Notion page id in {arg!r}")
    h = hexes[-1].lower()
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def load_blocks(host: str, page_id: str) -> dict:
    """Walk every chunk of the page through Notion's public read endpoint."""
    blocks: dict[str, dict] = {}
    cursor: dict = {"stack": []}
    for chunk in range(200):
        payload = json.dumps(
            {
                "pageId": page_id,
                "limit": 100,
                "cursor": cursor,
                "chunkNumber": chunk,
                "verticalColumns": False,
            }
        ).encode()
        req = urllib.request.Request(
            f"https://{host}/api/v3/loadPageChunk",
            data=payload,
            headers={
                "content-type": "application/json",
                # Notion's public read endpoint 403s a request with no agent.
                "user-agent": "football-docs/gen_notion_truth (+https://github.com/withqwerty/football-docs)",
            },
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.load(resp)
        for bid, rec in data.get("recordMap", {}).get("block", {}).items():
            value = rec.get("value", {})
            blocks[bid] = value.get("value", value)
        cursor = data.get("cursor", {})
        if not cursor.get("stack"):
            break
        time.sleep(0.2)
    if not blocks:
        sys.exit("Notion returned no blocks - is the page public?")
    return blocks


def text_of(prop) -> str:
    if not prop:
        return ""
    return "".join(seg[0] if seg else "" for seg in prop)


def flatten(blocks: dict, root: str) -> list[dict]:
    """Document-order list of {type, text, rows} items, tables folded into rows."""
    items: list[dict] = []

    def visit(bid: str):
        block = blocks.get(bid)
        if not block:
            return
        btype = block.get("type")
        props = block.get("properties") or {}
        children = block.get("content") or []

        if btype in ("table", "collection_view"):
            rows = []
            for cid in children:
                child = blocks.get(cid) or {}
                if child.get("type") != "table_row":
                    continue
                cells = (child.get("properties") or {}).items()
                rows.append([text_of(v) for _, v in sorted(cells)])
            items.append({"type": "table", "text": "", "rows": rows})
            return

        items.append({"type": btype, "text": text_of(props.get("title")), "rows": []})
        for cid in children:
            visit(cid)

    visit(root)
    return items


def table_column(rows: list[list[str]], header_word: str) -> list[str]:
    """Values under the column whose header contains header_word."""
    if len(rows) < 2:
        return []
    header = [c.lower() for c in rows[0]]
    idx = next((i for i, h in enumerate(header) if header_word in h), None)
    if idx is None:
        return []
    out = []
    for row in rows[1:]:
        if idx >= len(row):
            continue
        # Field cells occasionally carry a footnote marker: "stats (*)".
        name = re.sub(r"\(\*+\)", "", row[idx]).strip()
        if name and re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", name):
            out.append(name)
    return out


def sample_keys(code: str) -> list[str]:
    """Key names from a JSON sample - names only, never a value.

    The samples are elided with `...` and are not valid JSON, so this reads keys
    lexically rather than parsing. That is deliberate: a lexical read cannot
    accidentally carry a value across.
    """
    return [m.group(1) for m in re.finditer(r'"([A-Za-z_][A-Za-z0-9_]*)"\s*:', code)]


def parse(items: list[dict]) -> dict:
    """Group the flat item list into one record per documented endpoint."""
    endpoints: list[dict] = []
    section = ""
    current: dict | None = None
    pending: str | None = None  # which table the next table block belongs to
    heading = ""

    for item in items:
        text = item["text"].strip()
        btype = item["type"]

        if btype == "sub_header":
            section = HEADING_RE.sub(r"\2", text)
            continue
        if btype == "sub_sub_header":
            heading = HEADING_RE.sub(r"\2", text)
            continue

        if text.startswith(MARK_METHOD):
            match = ENDPOINT_RE.match(text[len(MARK_METHOD) :].strip())
            if not match:
                continue
            current = {
                "name": heading,
                "group": section,
                "method": match.group(1),
                "path": match.group(2).rstrip("."),
                "description": "",
                "paginated": False,
                "parameters": [],
                "fields": [],
                "sampleKeys": [],
            }
            endpoints.append(current)
            pending = None
            continue

        if current is None:
            continue

        if text.startswith(MARK_DESC):
            # The description precedes the gear line, so it lands on the record
            # only when it repeats; the pre-gear one is picked up below instead.
            continue
        if text.startswith(MARK_PARAMS):
            pending = "parameters"
            continue
        if text.startswith(MARK_FIELDS):
            pending = "fields"
            continue
        if text.startswith(MARK_SAMPLE):
            pending = "sample"
            continue

        if btype == "table" and pending in ("parameters", "fields"):
            # A "(*)" footnote table expands a nested object, so its names are
            # fields too; both land in the same bucket.
            current[pending].extend(table_column(item["rows"], "field"))
            continue

        if btype == "code" and pending == "sample":
            current["sampleKeys"].extend(sample_keys(text))
            pending = None
            continue

    return {"endpoints": endpoints}


def attach_prose(items: list[dict], parsed: dict) -> None:
    """Pair each endpoint with the description and pagination flag above it."""
    desc = ""
    paginated = False
    index = 0
    endpoints = parsed["endpoints"]
    for item in items:
        text = item["text"].strip()
        if text.startswith(MARK_DESC):
            desc = text[len(MARK_DESC) :].strip()
        elif text.startswith(PAGINATED):
            paginated = True
        elif text.startswith(NOT_PAGINATED):
            paginated = False
        elif text.startswith(MARK_METHOD) and index < len(endpoints):
            endpoints[index]["description"] = desc
            endpoints[index]["paginated"] = paginated
            index += 1
            desc, paginated = "", False


def build(provider: str, url: str, page_id: str, title: str, parsed: dict) -> dict:
    paths: dict[str, list[str]] = {}
    parameters: set[str] = set()
    fields: set[str] = set()
    operations: dict[str, dict] = {}

    for ep in parsed["endpoints"]:
        methods = paths.setdefault(ep["path"], [])
        if ep["method"] not in methods:
            methods.append(ep["method"])
        parameters.update(ep["parameters"])
        parameters.update(re.findall(r"\{(\w+)\}", ep["path"]))
        keys = [k for k in ep["sampleKeys"] if k not in ENVELOPE_KEYS]
        fields.update(ep["fields"])
        fields.update(keys)
        operations[f"{ep['method']} {ep['path']}"] = {
            "name": ep["name"],
            "group": ep["group"],
            "description": ep["description"],
            "paginated": ep["paginated"],
            "parameters": sorted(set(ep["parameters"])),
            "fields": sorted(set(ep["fields"]) | set(keys)),
        }

    return {
        "provider": provider,
        "kind": "notion-guide",
        "source": {
            "page": url,
            "page_id": page_id,
            "title": title,
            "generated_at": date.today().isoformat(),
        },
        "basePaths": [],
        "paths": {p: sorted(m) for p, m in sorted(paths.items())},
        "parameters": sorted(parameters),
        "fields": sorted(fields),
        "operations": dict(sorted(operations.items())),
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("page", help="public Notion page URL or id")
    ap.add_argument("--provider", required=True)
    ap.add_argument("--host", default=None, help="Notion site host (default: from the URL)")
    args = ap.parse_args()

    page_id = page_id_from(args.page)
    host = args.host or (
        args.page.split("//", 1)[-1].split("/", 1)[0] if "//" in args.page else "www.notion.so"
    )

    blocks = load_blocks(host, page_id)
    root = blocks.get(page_id) or {}
    title = text_of((root.get("properties") or {}).get("title"))

    items = flatten(blocks, page_id)
    parsed = parse(items)
    attach_prose(items, parsed)
    if not parsed["endpoints"]:
        sys.exit("no endpoints found - the page layout changed, check the markers")

    truth = build(args.provider, args.page, page_id, title, parsed)

    TRUTH_DIR.mkdir(parents=True, exist_ok=True)
    out = TRUTH_DIR / f"{args.provider}.notion.json"
    out.write_text(json.dumps(truth, indent=2, ensure_ascii=False) + "\n")
    print(
        f"{out.relative_to(REPO)}: {len(truth['paths'])} paths, "
        f"{len(truth['parameters'])} parameters, {len(truth['fields'])} fields"
    )


if __name__ == "__main__":
    main()
