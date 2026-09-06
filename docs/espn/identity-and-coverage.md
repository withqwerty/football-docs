---
source_url: https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=1
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer identity and coverage

Curated public-endpoint observations checked on 2026-09-06. League discovery
does not establish that every resource supports every endpoint or statistic.
The detailed samples cover eng.1 and esp.1 only.

## League discovery and pagination

On sports.core.api.espn.com, the observed request
`GET /v2/sports/soccer/leagues` accepts the tested query combinations limit=5&page=1
and limit=5&page=2. The responses reported pageIndex 1 and 2, pageSize 5, and
different resource references. This establishes those pagination examples, not a
maximum supported page size. Use returned pagination metadata instead of a
hard-coded league count.

| JSON path | Observed type | Use |
|---|---|---|
| `count` | number | Reported total resource count at request time |
| `pageIndex` | number | Returned page number |
| `pageSize` | number | Returned page size |
| `pageCount` | number | Reported number of pages |
| `items[].$ref` | string | League resource URL, not an expanded league record |

The observed references used HTTP URLs even though discovery was requested over
HTTPS. This corpus does not follow or verify every referenced resource. Keep
reference URLs distinct from league display names and numeric IDs. The eng.1
and esp.1 strings used in the tested site endpoints are league slugs.

Sources: [first page](https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=1),
[second page](https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=2).

## Event, team, and player identity

The checked ESPN soccer responses exposed distinct event, team, player, and league
identifiers. Preserve returned IDs as strings and retain entity type and provider
when storing them. Do not treat a league slug, a numeric league ID, an event's
competition ID, and a team slug as interchangeable values.

| JSON path | Observed type | Meaning |
|---|---|---|
| `leagues[].id` | string | League ID in scoreboard metadata |
| `leagues[].slug` | string | League slug in scoreboard metadata |
| `events[].id` | string | Event ID used to request a summary |
| `events[].uid` | string | Separate event identifier |
| `events[].competitions[].competitors[].team.id` | string | Team ID in a scoreboard |
| `rosters[].roster[].athlete.id` | string | Player ID in a completed summary |
| `rosters[].roster[].athlete.uid` | string | Separate player identifier |

Keep id and uid separately; no conversion rule was established. The observations
do not establish global uniqueness across sports, permanence, or cross-provider
ID mappings. A same-name player in another provider is not a verified ID match.

Sources: [scoreboard IDs](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[summary IDs](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603).

## Verified coverage and refresh procedure

The ESPN observations cover completed fixtures on 2025-08-17, scheduled fixtures
on 2026-09-12 as observed on 2026-09-06, one completed and one scheduled summary
per league, unparameterized team lists, and standings with season values 2024
and 2025 for eng.1 and esp.1. Additional checks cover an eng.1 two-day range,
an empty eng.1 date, and two small league-discovery pages. These samples establish
neither all-season completeness nor live behavior or historical retention limits.

Maintain the evidence with `python3 scripts/observe_espn.py --scheduled-date YYYYMMDD`,
choosing a future fixture date and using access permitted by the applicable terms.
The script saves selected field paths and observed JSON types, request URLs,
timestamps, match states and date-filter observations, season values, and league
pagination metadata to data/espn-observations.json. It does not save raw responses.
The selected fields are not a complete schema; absence from that selection is not
proof that a field does not exist. Top-level keys are recorded separately.

Review the evidence diff and update these curated docs, their observation dates,
and the registry metadata together. Offline tests check endpoint paths and field
tables against the saved observations. They cannot prove semantic correctness,
current availability, or coverage beyond the samples. Rebuild the search index
after reviewing changes. No automatic ESPN crawl or live CI request is configured.
