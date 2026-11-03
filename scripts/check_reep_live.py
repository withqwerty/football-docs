#!/usr/bin/env python3
"""Check the Reep docs against the live register. Run by hand, never in CI.

  python3 scripts/check_reep_live.py            # report only
  python3 scripts/check_reep_live.py --update   # also refresh the snapshots

Two jobs:

1. Links. Every stable download link (DuckDB, and the CSV and Parquet file of
   every table) must redirect to the file the current release names, and every
   reep.football / data.reep.football URL cited in docs/reep must answer.
2. Drift. The live release file list, manifest, table columns and OpenAPI spec
   are compared with the snapshots in specs/reep/. A difference is a list of doc
   sections to reread, not an error in itself: review it, update docs/reep, then
   rerun with --update and run the tests.

The release no longer publishes a schema file, so the columns come from the
header line of each table's CSV, read with a ranged request (the first 64 KiB
of the gzip stream), never the whole file. specs/reep/columns.json holds them.

Exit status: 1 if a link is broken, 2 if anything drifted, 0 if all is current.
Standard library only. No keys are used; nothing here needs API access.
"""

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import time
import urllib.error
import urllib.request
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / "specs" / "reep"
DOCS = ROOT / "docs" / "reep"
DATA = "https://data.reep.football"
LATEST = f"{DATA}/releases/latest.json"
SPEC_URL = "https://reep.football/openapi.yaml"
SITE = "https://reep.football"
DUCKDB = "reep-register.duckdb"
# Cloudflare refuses urllib's default User-Agent (error 1010).
HEADERS = {"User-Agent": "football-docs-reep-check/1.0 (+https://github.com/withqwerty/football-docs)"}
PAUSE = 0.5


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(url, follow=True, extra_headers=None):
    """Return (status, headers, body). HTTP errors come back as a status, not an exception."""
    time.sleep(PAUSE)
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(NoRedirect)
    request = urllib.request.Request(url, headers={**HEADERS, **(extra_headers or {})})
    try:
        with opener.open(request, timeout=60) as response:
            return response.status, response.headers, response.read()
    except urllib.error.HTTPError as error:
        return error.code, error.headers, b""


def fetch_verified(url, sha256):
    status, _, body = fetch(url)
    if status != 200:
        sys.exit(f"cannot read {url}: HTTP {status}")
    if hashlib.sha256(body).hexdigest() != sha256:
        sys.exit(f"{url} does not match its published checksum; retry later")
    return body


def tables_of(files):
    """Table name -> {"csv": file, "parquet": file}, for every table that ships as CSV."""
    tables = {}
    for name, entry in files.items():
        match = re.fullmatch(r"([a-z_]+)\.(csv\.gz|parquet)", name)
        if match:
            kind = "csv" if match.group(2) == "csv.gz" else "parquet"
            tables.setdefault(match.group(1), {})[kind] = entry
    return {table: kinds for table, kinds in tables.items() if "csv" in kinds}


def csv_columns(url):
    """The header line of a gzipped CSV, from the first 64 KiB only."""
    status, _, head = fetch(url, extra_headers={"Range": "bytes=0-65535"})
    if status not in (200, 206):
        sys.exit(f"cannot read the start of {url}: HTTP {status}")
    first_line = zlib.decompressobj(31).decompress(head).split(b"\n", 1)[0]
    return next(csv.reader(io.StringIO(first_line.decode("utf-8"))))


def check_links(files):
    broken = []
    targets = []
    for table, kinds in sorted(tables_of(files).items()):
        for kind, entry in sorted(kinds.items()):
            targets.append((f"{SITE}/downloads/{kind}/{table}", f"{DATA}/{entry['key']}"))
    if DUCKDB in files:
        targets.append((f"{SITE}/downloads/duckdb", f"{DATA}/{files[DUCKDB]['key']}"))
    else:
        broken.append(f"the release lists no {DUCKDB}")
    for link, expected in targets:
        status, headers, _ = fetch(link, follow=False)
        location = headers.get("Location") if headers else None
        ok = status in (301, 302, 307, 308) and location == expected
        print(f"  {'ok ' if ok else 'BAD'} {status} {link}")
        if not ok:
            broken.append(f"{link} -> {status} {location or ''} (release: {expected})")

    cited = set()
    for doc in sorted(DOCS.glob("*.md")):
        for url in re.findall(r"https://(?:data\.)?reep\.football[^\s)`\"']*", doc.read_text(encoding="utf-8")):
            url = url.rstrip(".,;:")
            if "{" in url or "<" in url or "/api/v1" in url:
                continue  # templates and keyed API calls are not plain links
            cited.add(url.split("#")[0])
    for url in sorted(cited):
        # A download link must not be followed: it would pull the whole file just
        # to check it. Pages are small, so follow them and require a real 200.
        download = re.search(r"/downloads/(csv/|parquet/|duckdb)", url) is not None
        status, _, _ = fetch(url, follow=not download)
        ok = status in (301, 302, 307, 308) if download else status == 200
        print(f"  {'ok ' if ok else 'BAD'} {status} {url}")
        if not ok:
            broken.append(f"{url} -> {status}")
    return broken


def snapshot(name, missing):
    """A snapshot in specs/reep/, or `missing` before the first --update writes it."""
    path = SPECS / name
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else missing


def diff_release(release, manifest, columns):
    drift = []
    old_release = snapshot("release.json", {"stamp": None, "files": {}})
    old_manifest = snapshot("manifest.json", {})
    old_columns = snapshot("columns.json", {})

    if release["stamp"] != old_release["stamp"]:
        print(f"  new release: {old_release['stamp']} -> {release['stamp']}")
    if release.get("schema") != old_release.get("schema"):
        drift.append(f"release.json schema {old_release.get('schema')} -> {release.get('schema')} "
                     "(this script, download doc: release layout)")

    old_names, new_names = set(old_release["files"]), set(release["files"])
    for name in sorted(old_names ^ new_names):
        where = "added" if name in new_names else "removed"
        drift.append(f"release file {name} {where} (download doc: table list and table summary)")

    for table in sorted(set(old_columns) | set(columns)):
        before, after = old_columns.get(table), columns.get(table)
        if before != after:
            drift.append(f"columns of {table}: {before} -> {after} (SQL examples, table summary)")

    for field in ("identity_rider_boundaries",):
        if old_manifest.get(field) != manifest.get(field):
            drift.append(f"manifest {field} changed (overview: licence and scope)")
    old_types, new_types = set(old_manifest.get("entity_counts_by_type", {})), set(manifest.get("entity_counts_by_type", {}))
    if old_types != new_types:
        drift.append(f"entity types {sorted(old_types)} -> {sorted(new_types)} "
                     "(ENTITY_TYPES in src/reep.ts, overview)")
    return drift


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--update", action="store_true",
                        help="write the live release, manifest, columns and spec into specs/reep/")
    args = parser.parse_args()

    status, _, body = fetch(LATEST)
    if status != 200:
        sys.exit(f"cannot read {LATEST}: HTTP {status}")
    pointer = json.loads(body)["release"]
    release_body = fetch_verified(f"{DATA}/{pointer['key']}", pointer["sha256"])
    release = json.loads(release_body)
    files = release["files"]
    manifest_body = fetch_verified(f"{DATA}/{files['manifest.json']['key']}", files["manifest.json"]["sha256"])
    manifest = json.loads(manifest_body)
    columns = {table: csv_columns(f"{DATA}/{kinds['csv']['key']}") for table, kinds in sorted(tables_of(files).items())}
    status, _, spec_body = fetch(SPEC_URL)
    if status != 200:
        sys.exit(f"cannot read {SPEC_URL}: HTTP {status}")

    print(f"Release {release['stamp']}")
    print("Links:")
    broken = check_links(files)

    print("Drift against specs/reep/:")
    drift = diff_release(release, manifest, columns)
    if spec_body != (SPECS / "openapi.yaml").read_bytes():
        drift.append("openapi.yaml changed: diff it, regenerate truth "
                     "(bash scripts/gen_all_openapi_truth.sh), reread docs/reep/api.md")
    for line in drift:
        print(f"  DRIFT {line}")
    if not drift:
        print("  none")

    if args.update:
        (SPECS / "release.json").write_bytes(release_body)
        (SPECS / "manifest.json").write_bytes(manifest_body)
        (SPECS / "columns.json").write_text(json.dumps(columns, indent=2) + "\n", encoding="utf-8", newline="\n")
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
