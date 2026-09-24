#!/usr/bin/env python3
"""Check every provider's upstream for changes the docs may need. Run by hand, never in CI.

  pnpm check:upstream          # or: python3 scripts/check_upstream.py

One report from the checks that otherwise live in separate places:

1. Package versions. Each registry entry with a `package` is compared with the
   latest release on PyPI or npm, or, for a GitHub repository, with its latest
   release or last commit. The pin is the one scripts/gen_all_truth.sh installs,
   since that is the version the truth files describe; failing that, the entry's
   `version` when it is a version number (some describe an API, not a package).
2. Spec snapshots. Every file listed in specs/README.md is fetched again from its
   public URL and compared with the copy in specs/. Reep's snapshots are left to
   check_reep_live.py, which knows how its release stamps work.
3. Live checks. scripts/check_free_sources_live.py and scripts/check_reep_live.py.

A finding is a list of things to review, not an error in itself: bump the pin,
refresh the snapshot or fix the doc, then run the tests.

Exit status: 1 if anything needs review, 0 if everything is current.
Standard library only. No keys are used.
"""

import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HEADERS = {"User-Agent": "football-docs-upstream-check/1.0 (+https://github.com/withqwerty/football-docs)"}


def fetch(url):
    request = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def latest_release(package):
    kind = package.get("type")
    name = package.get("name") or package.get("repo")
    if kind == "pypi":
        return json.loads(fetch(f"https://pypi.org/pypi/{name}/json"))["info"]["version"]
    if kind == "npm":
        return json.loads(fetch(f"https://registry.npmjs.org/{name}/latest"))["version"]
    if kind in ("github", "github_release"):
        try:
            return json.loads(fetch(f"https://api.github.com/repos/{name}/releases/latest"))["tag_name"]
        except urllib.error.HTTPError as error:
            if error.code != 404:
                raise
            commit = json.loads(fetch(f"https://api.github.com/repos/{name}/commits?per_page=1"))[0]
            return f"no releases; last commit {commit['commit']['committer']['date'][:10]}"
    return None


def truth_pins():
    """The exact versions scripts/gen_all_truth.sh installs, by package name."""
    script = (ROOT / "scripts" / "gen_all_truth.sh").read_text()
    return dict(re.findall(r'^\s*"([A-Za-z0-9_.-]+)==([^"]+)"', script, re.M))


def check_packages():
    providers = json.loads((ROOT / "providers.json").read_text())["providers"]
    pins = truth_pins()
    findings = []
    print("Package versions")
    for name, entry in providers.items():
        package = entry.get("package")
        if not package:
            continue
        pinned = pins.get(package.get("name") or "")
        if pinned is None and re.fullmatch(r"v?\d+(\.\d+)*", str(entry.get("version") or "")):
            pinned = entry["version"]
        try:
            latest = latest_release(package)
        except Exception as error:  # noqa: BLE001 - report and carry on
            print(f"  ??? {name}: could not check ({error})")
            findings.append(f"{name}: package check failed ({error})")
            continue
        if latest is None:
            print(f"  ??? {name}: unknown package type {package.get('type')!r}")
            continue
        comparable = package.get("type") in ("pypi", "npm") and pinned
        current = not comparable or latest.lstrip("v") == str(pinned).lstrip("v")
        print(f"  {'ok ' if current else 'NEW'} {name}: pinned {pinned}, latest {latest}")
        if not current:
            findings.append(f"{name}: {pinned} -> {latest} (bump providers.json and scripts/gen_all_truth.sh)")
    return findings


def check_specs():
    table = (ROOT / "specs" / "README.md").read_text()
    findings = []
    print("\nSpec snapshots")
    for path, url in re.findall(r"^\| `([^`]+)` \| (https?://\S+)", table, re.M):
        if path.startswith("reep/"):
            continue
        local = ROOT / "specs" / path
        try:
            remote = fetch(url)
        except Exception as error:  # noqa: BLE001
            print(f"  ??? {path}: could not fetch ({error})")
            findings.append(f"specs/{path}: fetch failed ({error})")
            continue
        same = local.exists() and local.read_bytes() == remote
        print(f"  {'ok ' if same else 'NEW'} {path}")
        if not same:
            findings.append(f"specs/{path}: upstream changed (refresh it, then pnpm openapi:truth)")
    return findings


def run_live_check(script):
    print(f"\n{script}")
    result = subprocess.run([sys.executable, str(ROOT / "scripts" / script)], capture_output=True, text=True)
    for line in (result.stdout + result.stderr).splitlines():
        print(f"  {line}")
    return [] if result.returncode == 0 else [f"{script} exited {result.returncode}"]


def main():
    findings = check_packages() + check_specs()
    findings += run_live_check("check_free_sources_live.py")
    findings += run_live_check("check_reep_live.py")
    if findings:
        print("\nTo review:")
        for line in findings:
            print(f"  - {line}")
        return 1
    print("\nEverything upstream matches the docs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
