---
source_url: https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings?season=2025
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer teams and standings

Curated observations checked on 2026-09-06 for eng.1 and esp.1. Team lists were
requested without season selection. Standings were checked with season=2024
and season=2025. No official schema or exhaustive historical coverage is claimed.

## Team discovery and metadata

On site.api.espn.com, the observed request
`GET /apis/site/v2/sports/soccer/{league}/teams` returns nested sport and league
objects, with team records below the league. Do not assume a top-level teams array.

| JSON path | Observed type | Use |
|---|---|---|
| `sports[].leagues[].teams[].team.id` | string | ESPN team ID |
| `sports[].leagues[].teams[].team.uid` | string | Separate identifier |
| `sports[].leagues[].teams[].team.slug` | string | Team slug |
| `sports[].leagues[].teams[].team.displayName` | string | Display label |
| `sports[].leagues[].teams[].team.abbreviation` | string | Abbreviation |
| `sports[].leagues[].teams[].team.logos[].href` | string | Image reference; reuse rights are separate |

Join on the returned team ID rather than a name or abbreviation. The unparameterized
team-list checks do not establish historical league membership or that the list
contains every team ever associated with the league.

Sources: [eng.1 teams](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams),
[esp.1 teams](https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/teams).

## League standings and season selection

On site.api.espn.com, the observed request is
`GET /apis/v2/sports/soccer/{league}/standings`. Notice the prefix apis/v2 here,
compared with apis/site/v2 for the teams and scoreboard requests.

For both eng.1 and esp.1, requests with season=2024 and season=2025 returned
matching season.year values. Use the response's season metadata to confirm the
requested table. These two examples do not establish a season convention for
every competition or a way to retrieve standings as of an arbitrary matchday.

| JSON path | Observed type | Use |
|---|---|---|
| `season.year` | number | Returned season value |
| `season.displayName` | string | Display season label |
| `children[].name` | string | Standings group label |
| `children[].standings.entries[].team.id` | string | ESPN team ID |
| `children[].standings.entries[].team.displayName` | string | Team display label |
| `children[].standings.entries[].stats[].name` | string | Statistic key |
| `children[].standings.entries[].stats[].type` | string | Statistic type label |
| `children[].standings.entries[].stats[].value` | number | Numeric value |
| `children[].standings.entries[].stats[].displayValue` | string | Display representation |

Traverse the returned groups and select statistics by name. Do not infer points,
rank, or another statistic from a fixed array position. Retain the source's group
and season context instead of flattening every table into one global league table.
Missing entries or statistics do not imply zero values.

Sources: [eng.1 season 2024](https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings?season=2024),
[eng.1 season 2025](https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings?season=2025),
[esp.1 season 2024](https://site.api.espn.com/apis/v2/sports/soccer/esp.1/standings?season=2024),
[esp.1 season 2025](https://site.api.espn.com/apis/v2/sports/soccer/esp.1/standings?season=2025).
