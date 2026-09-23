#!/usr/bin/env python3
"""Check that the documented free-source access paths still return data. Run by hand, never in CI.

  python3 scripts/check_free_sources_live.py

Free sources change without notice, and many fail quietly: the page still
answers 200, but the data is gone. Each check below requests the path a doc in
docs/free-sources/ tells readers to use, and asserts that the response carries
the data the doc describes, not just a status code.

When a doc's access recipe changes, change its check here in the same commit.

Not checked: FBref, Transfermarkt and WhoScored. The docs send readers through
soccerdata, a headed browser or a scraper with its own User-Agent handling, and
a bare request here would only measure bot protection, not the docs.

Exit status: 1 if any check fails, 0 if all pass.
Standard library only. No keys are used.
"""

import json
import re
import sys
import time
import urllib.error
import urllib.request

HEADERS = {"User-Agent": "football-docs-free-sources-check/1.0 (+https://github.com/withqwerty/football-docs)"}
PAUSE = 1.0


def fetch(url, headers=None):
    """Return (status, body). HTTP errors come back as a status, not an exception."""
    time.sleep(PAUSE)
    request = urllib.request.Request(url, headers={**HEADERS, **(headers or {})})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as error:
        return error.code, b""
    except (urllib.error.URLError, TimeoutError) as error:
        return f"no response ({error})", b""


def statsbomb_open_data(body):
    competitions = json.loads(body)
    return bool(competitions) and "competition_id" in competitions[0]


def understat_inline_json(body):
    return re.search(rb"var shotsData\s*=\s*JSON\.parse\(", body) is not None


def clubelo_chart(fields):
    def check(body):
        match = re.search(rb"var vegaJson = (\{.*?\});\s*\n", body, re.S)
        rows = next(iter(json.loads(match.group(1))["datasets"].values()))
        return bool(rows) and fields <= set(rows[0])

    return check


def football_data_csv(body):
    header = body.decode("utf-8-sig", "replace").splitlines()[0].split(",")
    return {"Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR"} <= set(header)


def github_repo(body):
    return json.loads(body).get("archived") is False


def html_page(body):
    return b"<html" in body[:2000].lower()


# (doc, what the doc promises, url, extra headers, check)
CHECKS = [
    (
        "overview.md#statsbomb-open-data",
        "competitions.json lists competitions",
        "https://raw.githubusercontent.com/hudl/open-data/master/data/competitions.json",
        None,
        statsbomb_open_data,
    ),
    (
        "understat.md#access-methods",
        "match page embeds shotsData as JSON.parse",
        "https://understat.com/match/28000",
        None,
        understat_inline_json,
    ),
    (
        "overview.md#clubelo",
        "ranking page embeds the top-50 chart dataset",
        "https://clubelo.com/",
        None,
        clubelo_chart({"Name", "Elo", "Golo", "Level", "Federation"}),
    ),
    (
        "overview.md#clubelo",
        "club page embeds the rating history chart dataset",
        "https://clubelo.com/Bayern",
        None,
        clubelo_chart({"Date", "Elo", "Golo"}),
    ),
    (
        "overview.md#football-datacouk",
        "season CSV has the documented result columns",
        "https://www.football-data.co.uk/mmz4281/2425/E0.csv",
        None,
        football_data_csv,
    ),
    (
        "overview.md#engsoccerdata",
        "GitHub repository exists and is not archived",
        "https://api.github.com/repos/jalapic/engsoccerdata",
        None,
        github_repo,
    ),
    (
        "overview.md#european-football-statistics",
        "site answers with a page",
        "https://www.european-football-statistics.co.uk/",
        None,
        html_page,
    ),
]


def main():
    failed = []
    for doc, promise, url, headers, check in CHECKS:
        status, body = fetch(url, headers)
        try:
            ok = status == 200 and check(body)
        except (AttributeError, ValueError, IndexError, KeyError, StopIteration):
            ok = False
        print(f"  {'ok ' if ok else 'BAD'} {status} {url}")
        if not ok:
            failed.append(f"docs/free-sources/{doc}: {promise} ({url} -> {status})")

    if failed:
        print("\nThese documented access paths no longer return what the docs say:")
        for line in failed:
            print(f"  - {line}")
        return 1
    print("\nAll documented access paths return data.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
