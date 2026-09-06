#!/usr/bin/env python3
"""Record dated ESPN soccer response structure, not a published API contract.

Run manually: python3 scripts/observe_espn.py --scheduled-date YYYYMMDD
Uses only the Python standard library. No response bodies are written to disk.
Review the diff and docs after refreshing; CI reads the saved observations offline.
"""

import argparse
import datetime as dt
import json
from pathlib import Path
import urllib.request


SITE = "https://site.api.espn.com/apis/site/v2/sports/soccer"
TABLES = "https://site.api.espn.com/apis/v2/sports/soccer"
CORE = "https://sports.core.api.espn.com/v2/sports/soccer/leagues"
OUTPUT = Path(__file__).resolve().parents[1] / "data" / "espn-observations.json"

# Select the integration fields the docs cover. A requested path is recorded
# only if it actually occurs; these lists do not assert that fields exist.
SELECTED_FIELDS = {
    "scoreboard": """
        leagues[].id leagues[].slug leagues[].name leagues[].season.year
        events events[].id events[].uid events[].date events[].season.year
        events[].status.type.state events[].status.type.completed
        events[].status.type.name events[].status.type.detail
        events[].competitions[].id events[].competitions[].date
        events[].competitions[].competitors[].homeAway
        events[].competitions[].competitors[].score
        events[].competitions[].competitors[].winner
        events[].competitions[].competitors[].team.id
        events[].competitions[].competitors[].team.uid
        events[].competitions[].competitors[].team.displayName
    """.split(),
    "summary": """
        header.id header.competitions[].id header.competitions[].date
        header.competitions[].status.type.state
        header.competitions[].status.type.completed
        boxscore.teams[].team.id boxscore.teams[].statistics
        boxscore.teams[].statistics[].name boxscore.teams[].statistics[].label
        boxscore.teams[].statistics[].displayValue
        rosters rosters[].team.id rosters[].homeAway rosters[].formation
        rosters[].roster[].athlete.id rosters[].roster[].athlete.uid
        rosters[].roster[].athlete.displayName rosters[].roster[].starter
        rosters[].roster[].jersey rosters[].roster[].position.abbreviation
        rosters[].roster[].formationPlace rosters[].roster[].subbedIn
        rosters[].roster[].subbedOut rosters[].roster[].stats[].name
        rosters[].roster[].stats[].value rosters[].roster[].stats[].displayValue
        keyEvents keyEvents[].id keyEvents[].type.id keyEvents[].type.text
        keyEvents[].text keyEvents[].clock.displayValue keyEvents[].team.id
        keyEvents[].participants[].athlete.id keyEvents[].scoringPlay
        commentary commentary[].text commentary[].time.displayValue
    """.split(),
    "teams": """
        sports[].leagues[].id sports[].leagues[].slug
        sports[].leagues[].teams[].team.id sports[].leagues[].teams[].team.uid
        sports[].leagues[].teams[].team.slug
        sports[].leagues[].teams[].team.displayName
        sports[].leagues[].teams[].team.abbreviation
        sports[].leagues[].teams[].team.logos[].href
    """.split(),
    "standings": """
        season.year season.displayName children[].name
        children[].standings.entries[].team.id
        children[].standings.entries[].team.displayName
        children[].standings.entries[].stats[].name
        children[].standings.entries[].stats[].type
        children[].standings.entries[].stats[].value
        children[].standings.entries[].stats[].displayValue
    """.split(),
    "leagues": "count pageIndex pageSize pageCount items[].$ref".split(),
}


def json_type(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "boolean"
    if isinstance(value, dict):
        return "object"
    if isinstance(value, list):
        return "array"
    if isinstance(value, str):
        return "string"
    return "number"


def field_types(value):
    """Union types across array elements, retaining no scalar content."""
    found = {}

    def walk(node, path):
        if path:
            found.setdefault(path, set()).add(json_type(node))
        if isinstance(node, dict):
            for key, child in node.items():
                walk(child, f"{path}.{key}" if path else key)
        elif isinstance(node, list):
            for child in node:
                walk(child, f"{path}[]")

    walk(value, "")
    return {path: sorted(types) for path, types in sorted(found.items())}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--scheduled-date",
        default=(dt.date.today() + dt.timedelta(days=14)).strftime("%Y%m%d"),
        help="Date to probe for scheduled matches; recorded in each request URL.",
    )
    args = parser.parse_args()
    dt.datetime.strptime(args.scheduled_date, "%Y%m%d")
    observations = []

    def observe(name, family, url):
        # No keys, cookies, credentials, retries, or response-body persistence.
        request = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = json.load(response)
            record = {
                "name": name,
                "family": family,
                "url": url,
                "observed_at": dt.datetime.now(dt.timezone.utc).isoformat(),
                "http_status": response.status,
                "top_level_fields": sorted(payload),
                "fields": {
                    path: types for path, types in field_types(payload).items()
                    if path in SELECTED_FIELDS[family]
                },
            }
        if family == "scoreboard":
            events = payload.get("events", [])
            record["event_count"] = len(events)
            record["event_dates"] = sorted({e["date"] for e in events})
            record["states"] = sorted({e["status"]["type"]["state"] for e in events})
        elif family == "standings":
            record["season_year"] = payload.get("season", {}).get("year")
        elif family == "leagues":
            record["pagination"] = {
                k: payload[k] for k in ("count", "pageIndex", "pageSize", "pageCount")
            }
            # These are public resource addresses, not copies of league data.
            record["league_refs"] = [item["$ref"] for item in payload["items"]]
        elif family == "summary":
            record["states"] = sorted({
                c["status"]["type"]["state"]
                for c in payload.get("header", {}).get("competitions", [])
            })
        observations.append(record)
        print(f"{name}: HTTP {record['http_status']}, {len(record['fields'])} field paths")
        return payload

    for league in ("eng.1", "esp.1"):
        finished = observe(
            f"{league}-completed", "scoreboard", f"{SITE}/{league}/scoreboard?dates=20250817"
        )
        event = finished["events"][0]["id"]
        observe(f"{league}-summary-completed", "summary", f"{SITE}/{league}/summary?event={event}")
        scheduled = observe(
            f"{league}-scheduled", "scoreboard",
            f"{SITE}/{league}/scoreboard?dates={args.scheduled_date}",
        )
        upcoming = [e for e in scheduled.get("events", []) if e["status"]["type"]["state"] == "pre"]
        if upcoming:
            event = upcoming[0]["id"]
            observe(f"{league}-summary-scheduled", "summary", f"{SITE}/{league}/summary?event={event}")
        observe(f"{league}-teams", "teams", f"{SITE}/{league}/teams")
        for season in (2024, 2025):
            observe(
                f"{league}-standings-{season}", "standings",
                f"{TABLES}/{league}/standings?season={season}",
            )

    observe("eng.1-date-range", "scoreboard", f"{SITE}/eng.1/scoreboard?dates=20250816-20250817")
    observe("eng.1-empty-date", "scoreboard", f"{SITE}/eng.1/scoreboard?dates=20250701")
    for page in (1, 2):
        observe(f"leagues-page-{page}", "leagues", f"{CORE}?limit=5&page={page}")

    # A failed request raises before replacing the previous complete snapshot.
    result = {
        "provider": "espn",
        "kind": "public-endpoint-observations",
        "scope": "Dated response structure only; no official schema, completeness or stability guarantee.",
        "observations": observations,
    }
    OUTPUT.write_text(json.dumps(result, indent=2) + "\n")
    print(f"Wrote {len(observations)} observations to {OUTPUT.name}")


if __name__ == "__main__":
    main()
