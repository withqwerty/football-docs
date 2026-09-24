---
source_url: https://footystats.org/api/documentations/
source_type: curated
upstream_version: null
crawled_at: 2026-09-24
---

# FootyStats API access

Curated notes on the FootyStats football API, verified against live responses from a
paid key on 2026-09-24. The key covered 39 chosen competitions, mostly in Southeast
Asia (Thai League 1, 2 and 3, Laos, Cambodia, AFC club competitions and
internationals). Behaviour for other competitions may differ. Field-level detail is in
[data-model.md](data-model.md) and identifiers are in
[identity-surfaces.md](identity-surfaces.md).

## FootyStats API overview

FootyStats (footystats.org) sells a JSON REST API of match results, team, player,
manager and league statistics, covering more than 1,700 league entries worldwide.

| Item | Value |
|---|---|
| Base URL | `https://api.football-data-api.com/` |
| Format | JSON over HTTPS, `GET` only |
| Documentation | https://footystats.org/api/documentations/ (per-endpoint pages) |
| Tutorials | https://footystats.org/api/tutorials |
| Terms | https://footystats.org/api/documentations/terms-of-use-and-legal |
| Pricing (checked 2026-09-24) | Tutorials page: "packages starting at £29.99 per month". Tier names and per-tier league counts were not verified. |
| Support | The terms describe the service as self-serve with no technical support. Email questions to the admin address were answered in practice. |

The endpoint path is the first path segment, for example
`https://api.football-data-api.com/league-matches?key=...&season_id=...`.

## Authentication with the key query parameter

Every request passes the API key as the `key` query parameter. No header is used.

```python
import os, requests

BASE = "https://api.football-data-api.com/"
params = {"key": os.environ["FOOTYSTATS_API_KEY"], "season_id": 17367}
resp = requests.get(BASE + "league-matches", params=params, timeout=30)
body = resp.json()
if resp.status_code != 200 or not body.get("success"):
    raise RuntimeError(f"{resp.status_code}: {body.get('message') or body.get('error')}")
matches = body["data"]
```

A wrong key returns HTTP 401 with `success: false`, empty `data` and the message
`"Unauthorized - Your API Key may not be correct"`.

## The example key (free test access)

The literal key `example` works without an account. The tutorials page says it is
limited to "the English Premier League 2018/2019 season". Checked 2026-09-24:

- `league-list?key=example` returned the full list of 1,737 league entries.
- `league-season?key=example&season_id=2012` returned Premier League data.
- `league-season?key=example&season_id=17367` (a Thai League 1 season) returned HTTP
  417, "League is not chosen by the user".

Use the example key to check response shapes. It cannot test coverage of any other
competition.

## Chosen leagues and HTTP 417

A paid account only returns data for competitions the user has selected ("chosen") in
the FootyStats dashboard. The plan sets how many can be chosen. Asking for any other
season returns HTTP 417 with `success: false`, empty `data` and this message:

> League is not chosen by the user (this might be delayed by cache if you chose the
> league recently, wait 1 hour). League may not exist, or is not available to this user.

The same 417 is returned for a season ID that does not exist, so a 417 does not prove
the competition is missing from FootyStats. In practice newly chosen leagues took about
an hour to become available. `league-list?chosen_leagues_only=true` lists the
competitions the key can currently read.

## Rate limits and the metadata block

Successful responses carry a `metadata` object with the key's quota:

| Field | Type | Observed value |
|---|---|---|
| `request_limit` | string | `"1800"` |
| `request_remaining` | string | counts down per request |
| `request_reset_message` | string | `"Request limit is refreshed every hour."` |
| `request_limit_refresh_next` | integer | Unix timestamp of the next reset |

The observed quota was 1,800 requests per hour on the paid plan tested. It may differ
by plan. The window resets at `request_limit_refresh_next`, which is not necessarily
on the hour. Past the limit the API returns HTTP 429 with
`{"error": "Rate limit exceeded. Too Many Requests.", "metadata": {...}}`, with
`request_remaining` set to `"0"`. Error responses (401, 417) returned `null` in every
metadata field.

## Response envelope

Every endpoint returns the same top-level object:

| Field | Type | Notes |
|---|---|---|
| `success` | boolean | `false` on 401 and 417 |
| `pager` | object | `current_page`, `max_page`, `results_per_page`, `total_results` |
| `metadata` | object | Quota fields (see the rate limits section) |
| `data` | array or object | An array for list endpoints. An object for `league-season`, `match` and `league-tables` |
| `message` | string | Usually a pointer to the terms of use. Holds the error text on 401 and 417 |

HTTP 429 responses instead return only `error` and `metadata`.

## Pagination with page and max_per_page

List endpoints are paged with `page` (1-based). Check `pager.max_page` and loop until
`current_page == max_page`. Default page sizes observed on 2026-09-24:

| Endpoint | Default `results_per_page` |
|---|---|
| `league-list` | 2000 |
| `league-matches` | 600 |
| `league-players`, `league-referees` | 200 |
| `league-teams` | 100 |
| `country-list` | 500 |
| `team` | 25 (one row per competition-season, so long histories span pages) |
| `player-stats`, `manager`, `league-season`, `lastx` | 50 |

`max_per_page` changes the page size: `league-matches?max_per_page=50&page=2` returned
50 rows with `max_page: 5` for a 240-match season.

## Endpoint list (tested)

Every endpoint below returned HTTP 200 for a chosen league on 2026-09-24.

| Endpoint | Required parameter | Returns |
|---|---|---|
| `league-list` | none (optional `chosen_leagues_only=true`) | Every league with its seasons and season IDs |
| `country-list` | none | Country IDs, ISO codes and translated names |
| `league-season` | `season_id` | One season: metadata, league-wide aggregates, top scorer, assist and clean-sheet lists |
| `league-matches` | `season_id` | Every match in the season, played and unplayed |
| `league-teams` | `season_id` (optional `include=stats`) | Teams in the season. `include=stats` adds a per-team `stats` object |
| `league-tables` | `season_id` | League table, home and away tables, and round tables |
| `league-players` | `season_id` | One row per player for that competition-season (paged) |
| `league-referees` | `season_id` | Referee season stats (empty for the Thai competitions tested) |
| `match` | `match_id` | One match, including lineups, bench, goal and card details |
| `team` | `team_id` | One row per competition-season the team has played, each with `stats` |
| `lastx` | `team_id` | Form over the team's last 5, 6 and 10 matches (3 rows), each with `stats` |
| `player-stats` | `player_id` | One row per competition-season for the player, with an optional `detailed` object |
| `manager` | `manager_id` | One row per competition-season managed |
| `todays-matches` | none (optional `date=YYYY-MM-DD`) | Matches on that date in the key's chosen leagues |

`season_id` and `league_id` are interchangeable on the season endpoints:
`league-tables?league_id=17367` returned the same table as `season_id=17367`. Both
take a season ID, not a competition ID (see identity-surfaces.md).

## Data sources

**Provenance category: not publicly documented.**

FootyStats does not say publicly where its match and player data comes from. Its
[About page](https://footystats.org/about) (checked 2026-09-24) covers infrastructure
only ("We update our database once a minute"), not collection or licensing. The API
terms allow using the data in websites and apps but prohibit "resale or
redistribution of the API and its data to other parties". Images and logos stay
copyright of their owners; the API only supplies image paths.

xG, npxG and xA values in the API come from **FootyStats' own xG model**. The
method is not publicly documented. Do not treat them as Opta, StatsBomb or any other
provider's xG, and do not mix them with those values.

## What is not available

- **No live or in-play data.** Matches have only two `status` values, `incomplete`
  and `complete`, and in-match stats stay at `-1` until the match is marked complete.
  FootyStats support confirmed in September 2026: "we don't have live data for the
  API. We are a stats service, not a live service."
- **No event coordinates.** There are no x/y locations for shots or passes, so shot
  maps, pass maps, heatmaps and passing networks cannot be built from this API.
- **No shot-level xG.** xG is per team per match (`team_a_xg`) and per player per
  competition-season (`detailed.xg_total_overall`). There is no per-shot value.
- **Referee data can be absent.** For every Thai League 1 2026/27 match checked,
  `refereeID` was `null` and `league-referees` returned an empty array.
- **Stadiums are sparse on matches.** `stadium_name` was empty on 228 of 240
  `league-matches` rows for Thai League 1 2026/27. `team` did return a
  `stadium_name` and `stadium_address` for the clubs checked.
- **Player detail is patchy.** `player-stats` rows only carry a `detailed` object for
  some competition-seasons (11 of 34 rows for one Thai international). It was
  present for Thai League 1 from 2025/26 onwards.

## Fields left out of these docs

Following the football-docs inclusion policy, these docs leave out the betting side
of the API:

- `odds_*` fields on match rows (68 fields such as `odds_ft_1`, `odds_btts_yes`)
- `odds_comparison` on `match`
- `*_potential` pre-match percentage fields (`btts_potential`, `o25_potential`,
  `corners_o95_potential` and similar)
- `h2h.betting_stats` on `match`

The generated preview text fields `gpt_en` and `gpt_int` (machine-written match
previews in several languages) are also left out. They are prose, not data.
