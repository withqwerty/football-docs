---
source_url: https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=1
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer identity and coverage

Observed on 2026-09-06. The detailed samples cover eng.1 and esp.1 only; a league
listed by discovery may not support every endpoint.

## League discovery and pagination

On sports.core.api.espn.com, `GET /v2/sports/soccer/leagues` pages with limit and
page (tested: limit=5&page=1 and limit=5&page=2). Page through using the returned
pageCount rather than a hard-coded league count.

| JSON path | Observed type | Use |
|---|---|---|
| `count` | number | Reported total resource count at request time |
| `pageIndex` | number | Returned page number |
| `pageSize` | number | Returned page size |
| `pageCount` | number | Reported number of pages |
| `items[].$ref` | string | League resource URL, not an expanded league record |

The references use http:// URLs even though discovery was requested over HTTPS.
The site endpoints take a league slug such as eng.1, which differs from both the
reference URL and the numeric league ID.

Sources: [first page](https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=1),
[second page](https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=2).

## Event, team, and player identity

ESPN has separate event, team, player and league identifiers. Store IDs as strings,
together with the entity type. A league slug, a numeric league ID, an event's
competition ID and a team slug are different things.

| JSON path | Observed type | Meaning |
|---|---|---|
| `leagues[].id` | string | League ID in scoreboard metadata |
| `leagues[].slug` | string | League slug in scoreboard metadata |
| `events[].id` | string | Event ID used to request a summary |
| `events[].uid` | string | Separate event identifier |
| `events[].competitions[].competitors[].team.id` | string | Team ID in a scoreboard |
| `rosters[].roster[].athlete.id` | string | Player ID in a completed summary |
| `rosters[].roster[].athlete.uid` | string | Separate player identifier |

Keep id and uid separately; no rule converts one into the other. ESPN gives no
IDs from other providers, and a same-name player elsewhere is not a verified match.
To map ESPN player, team or coach IDs to other providers, use the `resolve_entity`
tool, which queries the Reep register.

Sources: [scoreboard IDs](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[summary IDs](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603).

## Verified coverage and refresh procedure

The observations cover, for eng.1 and esp.1: completed fixtures on 2025-08-17,
fixtures scheduled for 2026-09-12 (as of 2026-09-06), one completed and one
scheduled summary per league, team lists, and standings for seasons 2024 and 2025.
Further checks cover an eng.1 two-day range, an empty eng.1 date and two
league-discovery pages. Live matches and historical depth were not tested.

Maintain the evidence with `python3 scripts/observe_espn.py --scheduled-date YYYYMMDD`,
choosing a future fixture date and using access permitted by the applicable terms.
The script saves selected field paths and observed JSON types, request URLs,
timestamps, match states and date-filter observations, season values, and league
pagination metadata to data/espn-observations.json. It does not save raw responses.
The selected fields are not a complete schema, so a field missing from the
selection may still exist. Top-level keys are recorded separately.

Review the evidence diff, then update these docs, their dates and the registry
metadata together, and rebuild the search index. Offline tests check the endpoint
paths and field tables against the saved observations. CI makes no live ESPN
requests.
