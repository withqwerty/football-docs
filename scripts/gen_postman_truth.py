#!/usr/bin/env python3
"""Derive documentation ground truth from a published Postman collection.

Third sibling of gen_python_truth.py and gen_openapi_truth.py, for providers whose
public documentation is a Postman collection rather than a spec or a package.

Deliberately derives rather than mirrors. A published collection is mostly saved
*response bodies* - in BeSoccer's case 86% of 9.7MB, full of real competition and
match data. Those are the vendor's data, not their API documentation, and this
repository has no business republishing them. What a doc set can be checked
against is the request surface: base URL, the request vocabulary and the query
parameters each request accepts. That is what this extracts, and it is small.

Usage:
    python3 scripts/gen_postman_truth.py collection.json --provider besoccer \\
        --dispatch-param req --group-prefix EN
"""

from __future__ import annotations

import argparse
import datetime
import json
import urllib.parse as urlparse
from pathlib import Path
from typing import Any

REPO = Path(__file__).resolve().parent.parent
OUT_DIR = REPO / "data" / "provider-truth"


def walk(items: list[dict[str, Any]] | None, path: str = "") -> list[tuple[str, dict[str, Any]]]:
    """Flatten a Postman folder tree into (folder path, request item) pairs."""
    out: list[tuple[str, dict[str, Any]]] = []
    for item in items or []:
        name = str(item.get("name", ""))
        if "request" in item:
            out.append((path, item))
        out.extend(walk(item.get("item"), f"{path}/{name}" if path else name))
    return out


def raw_url(request: dict[str, Any]) -> str:
    url = request.get("url")
    if isinstance(url, dict):
        return str(url.get("raw") or "")
    return str(url or "")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("collection", type=Path)
    ap.add_argument("--provider", required=True)
    ap.add_argument(
        "--dispatch-param",
        help="query parameter that selects the resource on a single-endpoint API (e.g. req)",
    )
    ap.add_argument(
        "--group-prefix",
        help="only read folders under this top-level group (e.g. EN, to skip a translated duplicate)",
    )
    args = ap.parse_args()

    collection = json.loads(args.collection.read_text())
    entries = walk(collection.get("item"))
    if args.group_prefix:
        entries = [(p, i) for p, i in entries if p.startswith(args.group_prefix)]

    bases: set[str] = set()
    params: set[str] = set()
    operations: dict[str, dict[str, Any]] = {}

    for folder, item in entries:
        request = item.get("request") or {}
        url = raw_url(request)
        if not url:
            continue
        parsed = urlparse.urlparse(url)
        if parsed.scheme and parsed.netloc:
            bases.add(f"https://{parsed.netloc}{parsed.path}")

        query = urlparse.parse_qs(parsed.query)
        params |= set(query)

        key = None
        if args.dispatch_param:
            values = query.get(args.dispatch_param) or []
            key = values[0] if values else None
        if key is None:
            key = str(item.get("name", "")) or url

        entry = operations.setdefault(
            key,
            {"names": set(), "group": folder.split("/")[-1], "params": set(), "methods": set()},
        )
        entry["names"].add(str(item.get("name", "")))
        entry["params"] |= set(query)
        if request.get("method"):
            entry["methods"].add(str(request["method"]))

    common = {args.dispatch_param, "key", "format", "tz"} - {None}
    truth = {
        "provider": args.provider,
        "kind": "postman",
        "source": {
            "collection": str(args.collection.name),
            "name": str((collection.get("info") or {}).get("name", "")),
            "dispatch_param": args.dispatch_param,
            "generated_at": datetime.date.today().isoformat(),
        },
        "baseUrls": sorted(bases),
        "parameters": sorted(params),
        "operations": {
            k: {
                "group": v["group"],
                "methods": sorted(v["methods"]),
                "names": sorted(v["names"]),
                "params": sorted(v["params"] - common),
            }
            for k, v in sorted(operations.items())
        },
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = OUT_DIR / f"{args.provider}.postman.json"
    out_path.write_text(json.dumps(truth, indent=2) + "\n")

    print(
        f"{args.provider}: {args.collection.name} -> {out_path.name} "
        f"({len(operations)} operations, {len(params)} params, {len(bases)} base URL(s)); "
        f"response bodies not retained"
    )


if __name__ == "__main__":
    main()
