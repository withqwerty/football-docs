#!/usr/bin/env python3
"""Check the Reep docs against the live register. Run by hand, never in CI.

  python3 scripts/check_reep_live.py            # report only
  python3 scripts/check_reep_live.py --update   # also refresh the snapshots

Two jobs:

1. Links. Every stable download link must redirect to the file the current
   manifest names, and every reep.football / data.reep.football URL cited in
   docs/reep must answer.
2. Drift. The live manifest, column schema and OpenAPI spec are compared with
   the snapshots in specs/reep/. A difference is a list of doc sections to
   reread, not an error in itself: review it, update docs/reep, then rerun with
   --update and run the tests.

Exit status: 1 if a link is broken, 2 if anything drifted, 0 if all is current.
Standard library only. No keys are used; nothing here needs API access.
"""

import argparse
import hashlib
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / "specs" / "reep"
DOCS = ROOT / "docs" / "reep"
LATEST = "https://data.reep.football/releases/latest.json"
SPEC_URL = "https://reep.football/openapi.yaml"
SITE = "https://reep.football"
# Cloudflare refuses urllib's default User-Agent (error 1010).
HEADERS = {"User-Agent": "football-docs-reep-check/1.0 (+https://github.com/withqwerty/football-docs)"}
PAUSE = 0.5


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url, follow=True):
    """Return (status, headers, body). HTTP errors come back as a status, not an exception."""
    time.sleep(PAUSE)
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    request = urllib.request.Request(url, headers=HEADERS)
    try:
        with opener.open(request, timeout=60) as response:
            return response.status, response.headers, response.read()
    except urllib.error.HTTPError as error:
        return error.code, error.headers, b""


def table_of(key):
    return key.removeprefix("csv/").removesuffix(".csv.gz")


def check_links(manifest):
    broken = []
    files = manifest["files"]
    csv = {table_of(k): v for k, v in files.items() if re.fullmatch(r"csv/[a-z_]+\.csv\.gz", k)}
    duckdb = next((v for k, v in files.items() if k.endswith(".duckdb")), None)
    targets = [(f"{SITE}/downloads/csv/{t}", v.get("url")) for t, v in sorted(csv.items())]
    if duckdb:
        targets.append((f"{SITE}/downloads/duckdb", duckdb.get("url")))
    for link, expected in targets:
        status, headers, _ = fetch(link, follow=False)
        location = headers.get("Location") if headers else None
        ok = status in (301, 302, 307, 308) and (expected is None or location == expected)
        print(f"  {'ok ' if ok else 'BAD'} {status} {link}")
        if not ok:
            broken.append(f"{link} -> {status} {location or ''} (manifest: {expected})")

    cited = set()
    for doc in sorted(DOCS.glob("*.md")):
        for url in re.findall(r"https://(?:data\.)?reep\.football[^\s)`\"']*", doc.read_text()):
            url = url.rstrip(".,;:")
            if "{" in url or "<" in url or "/api/v1" in url:
                continue  # templates and keyed API calls are not plain links
            cited.add(url.split("#")[0])
    for url in sorted(cited):
        # A download link must not be followed: it would pull the whole file just
        # to check it. Pages are small, so follow them and require a real 200.
        download = re.search(r"/downloads/(csv/|duckdb)", url) is not None
        status, _, _ = fetch(url, follow=not download)
        ok = status in (301, 302, 307, 308) if download else status == 200
        print(f"  {'ok ' if ok else 'BAD'} {status} {url}")
        if not ok:
            broken.append(f"{url} -> {status}")
    return broken


def diff_release(live_manifest, live_schema):
    drift = []
    old_manifest = json.loads((SPECS / "release.json").read_text())
    old_schema = json.loads((SPECS / "schema.json").read_text())

    if live_manifest["stamp"] != old_manifest["stamp"]:
        print(f"  new release: {old_manifest['stamp']} -> {live_manifest['stamp']}")

    old_files = {k: v.get("role") for k, v in old_manifest["files"].items() if k.startswith("csv/")}
    new_files = {k: v.get("role") for k, v in live_manifest["files"].items() if k.startswith("csv/")}
    for key in sorted(set(old_files) | set(new_files)):
        if old_files.get(key) != new_files.get(key):
            drift.append(f"CSV file {key}: {old_files.get(key)} -> {new_files.get(key)} "
                         "(download doc: table list, four-table summary)")

    old_cols = {table_of(k): v["columns"] for k, v in old_schema["files"].items()}
    new_cols = {table_of(k): v["columns"] for k, v in live_schema["files"].items()}
    for table in sorted(set(old_cols) | set(new_cols)):
        before, after = old_cols.get(table), new_cols.get(table)
        if before != after:
            drift.append(f"columns of {table}: {before} -> {after} (SQL examples, table summary)")

    for field in ("licence", "redaction", "schema_version", "tier"):
        if old_manifest.get(field) != live_manifest.get(field):
            drift.append(f"manifest {field} changed (overview: licence and scope)")
    return drift


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--update", action="store_true", help="write the live manifest, schema and spec into specs/reep/")
    args = parser.parse_args()

    status, _, body = fetch(LATEST)
    if status != 200:
        sys.exit(f"cannot read {LATEST}: HTTP {status}")
    latest = json.loads(body)
    status, _, manifest_body = fetch(latest["manifest_url"])
    if status != 200:
        sys.exit(f"cannot read the manifest: HTTP {status}")
    if hashlib.sha256(manifest_body).hexdigest() != latest.get("manifest_sha256"):
        sys.exit("manifest checksum does not match latest.json; retry later")
    manifest = json.loads(manifest_body)
    base = latest["manifest_url"].rsplit("/", 1)[0]
    status, _, schema_body = fetch(f"{base}/schema.json")
    if status != 200:
        sys.exit(f"cannot read schema.json: HTTP {status}")
    status, _, spec_body = fetch(SPEC_URL)
    if status != 200:
        sys.exit(f"cannot read {SPEC_URL}: HTTP {status}")

    print(f"Release {manifest['stamp']}")
    print("Links:")
    broken = check_links(manifest)

    print("Drift against specs/reep/:")
    drift = diff_release(manifest, json.loads(schema_body))
    if spec_body != (SPECS / "openapi.yaml").read_bytes():
        drift.append("openapi.yaml changed: diff it, regenerate truth "
                     "(bash scripts/gen_all_openapi_truth.sh), reread docs/reep/api.md")
    for line in drift:
        print(f"  DRIFT {line}")
    if not drift:
        print("  none")

    if args.update:
        (SPECS / "release.json").write_bytes(manifest_body)
        (SPECS / "schema.json").write_bytes(schema_body)
        (SPECS / "openapi.yaml").write_bytes(spec_body)
        print("Snapshots updated. Regenerate truth, run the tests, and update dates in specs/README.md.")

    if broken:
        print("Broken links:")
        for line in broken:
            print(f"  {line}")
        return 1
    return 2 if drift and not args.update else 0


if __name__ == "__main__":
    sys.exit(main())
