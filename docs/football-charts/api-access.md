---
source_url: https://www.football-charts.com/developers
source_type: curated
upstream_version: "v1"
crawled_at: 2026-09-24
---

# Football Charts API Access

## Overview

Football Charts (football-charts.com) is a JSON API and dataset covering 93
football leagues in 42 countries, including lower divisions (for example
Segunda RFEF groups, Czech third tier, the National League, Nordic, Baltic and
Asian second tiers) and women's leagues. It serves results with half-time
scores, fixtures, league tables, goal-timing distributions, per-team match
statistics and Monte Carlo season projections. It has no player-level or
event-level data.

Written by the provider's maintainer (affiliation disclosed); every endpoint
and field below was checked against live responses on 2026-09-24.

## Base URL And Authentication

```text
https://footballcharts-backend.onrender.com/api/v1/
```

`GET /api/v1/` returns a self-describing JSON index (auth rules, tier limits,
endpoint list). All read endpoints are `GET` and answer without a key.

A key is optional. Send it in either header:

```http
GET /api/v1/leagues/premier/table/ HTTP/1.1
Host: footballcharts-backend.onrender.com
Authorization: Bearer fc_xxxxxxxxxxxxxxxx
```

```http
X-API-Key: fc_xxxxxxxxxxxxxxxx
```

An unknown or disabled key is rejected; it does not fall back to keyless
access.

## Getting A Free Key

```bash
curl -X POST https://footballcharts-backend.onrender.com/api/v1/keys/register/ \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

The key is returned once in the response. Registration is limited to 3 per
day per IP. The same flow is available on
https://www.football-charts.com/developers.

## Access Tiers And Rate Limits

Checked 2026-09-24.

| Tier | Auth | Daily limit | Per minute | Seasons |
|---|---|---:|---:|---|
| Keyless | none | 300 per IP | 20 | current + previous season per league |
| Free key | `Authorization: Bearer` | 5,000 | 60 | current + previous season per league |
| Full history (paid, EUR 99 / year) | same key, upgraded | 5,000 | 60 | every season back to 2020 |

Keyless responses carry `X-RateLimit-Limit`, `X-RateLimit-Remaining` and an
`X-FC-Hint` header pointing at key registration. Over the limit the API
returns HTTP `429` with `Retry-After` (`60` for the per-minute limit, `86400`
for the daily limit). Academic use at a university or research institute is
granted full history free with citation.

Attribution is required: responses include `"attribution": "Data by
football-charts.com"`.

## Error Responses

Errors share one JSON shape:

```json
{"error": {"code": "season_gated", "message": "The free tier covers the current + previous season ..."}}
```

| HTTP | `code` | Meaning |
|---|---|---|
| 403 | `season_gated` | `?season=` is older than the tier allows |
| 429 | `anon_daily_limit` | keyless daily limit reached |
| 429 | `anon_rate_limited` | keyless per-minute limit reached |
| 429 | `daily_limit` | key daily limit reached |
| 429 | `rate_limited` | key per-minute limit reached |
| 400 | `bad_json` / `bad_email` | key registration body invalid |

## Endpoint List

| Method | Path | Parameters | Returns |
|---|---|---|---|
| GET | `/api/v1/` | none | API index: auth, tiers, endpoints |
| GET | `/api/v1/leagues/` | none | all 93 league keys with names, countries, available seasons |
| GET | `/api/v1/leagues/{league}/table/` | `season`, `view=classic\|luck\|goals` | league table with per-team aggregates |
| GET | `/api/v1/leagues/{league}/results/` | `season`, `team` (substring) | finished matches: FT and HT score, first-goal minute |
| GET | `/api/v1/leagues/{league}/fixtures/` | none | upcoming matches with baseline-model outputs |
| GET | `/api/v1/leagues/{league}/goal-timing/` | `season`, `team` (substring) | goals per team in 15-minute bins |
| GET | `/api/v1/leagues/{league}/teams/` | `season` | teams with slug, position, points |
| GET | `/api/v1/leagues/{league}/teams/{team}/` | `season` | one team: table row, match log, goal bins, match-statistic averages |
| GET | `/api/v1/leagues/{league}/projection/` | none | Monte Carlo season projection (10,000 simulations) |
| GET | `/api/v1/matches/{slug}/` | none | one match: teams, date, score, status, model outputs, API-Football ids |
| POST | `/api/v1/keys/register/` | JSON `{"email"}` | a free key |

`{league}` is a league key from `/api/v1/leagues/` (for example `premier`,
`segunda1`, `wsweden`). `{team}` is a team slug from the teams endpoint (for
example `manchester-city`). `{slug}` is a match slug such as
`england/premier-league/2026-08-23-manchester-city-vs-bournemouth`.

## Season String Conventions

Seasons are strings in one of two formats, fixed per league:

| League calendar | Format | Example |
|---|---|---|
| Autumn to spring (most of Europe) | `YYYY-YYYY` | `2026-2027` |
| Calendar year (Nordic, Brazil, Japan until 2026, ...) | `YYYY` | `2026` |

Each league's valid strings are listed in `seasons` on `/api/v1/leagues/`.
Omitting `?season=` returns the league's current season. A league can change
format: J1 League (`japan1`) ran calendar-year seasons through `2026` and then
`2026-2027`.

## League Keys

`GET /api/v1/leagues/` returns 93 rows like:

```json
{"league": "segunda1", "name": "Segunda RFEF - Group 1", "country": "Spain",
 "seasons": ["2026-2027", "2025-2026"],
 "url": "https://www.football-charts.com/leagues/..."}
```

`seasons` lists what the caller's tier can read (current + previous on free
tiers). Keys are short lowercase codes (`premier`, `eng1` = League One,
`czech3a` = 3. CFL Group A, `wsweden` = Allsvenskan Women). Always read the
key from this endpoint rather than guessing it.

## MCP Server And Packages

| Access | Where | Notes |
|---|---|---|
| Hosted MCP (streamable HTTP) | `https://mcp.football-charts.com/mcp` | keyless; with a key use `https://mcp.football-charts.com/{key}/mcp` or `Authorization: Bearer` |
| npm (stdio MCP) | `footballcharts-mcp` (v0.5.0) | `npx -y footballcharts-mcp`; optional key in env `FC_API_KEY` |
| LangChain toolkit | PyPI `langchain-footballcharts` (v0.1.0) | wraps the REST API |

MCP tools: `about_football_charts`, `list_leagues`, `get_league_table`,
`get_results`, `get_fixtures`, `get_match`, `get_team`, `get_goal_timing`,
`get_season_projection`, `get_track_record`. Each maps to the REST endpoint of
the same name.

## Quick Start (Python)

```python
import requests

BASE = "https://footballcharts-backend.onrender.com/api/v1"
HEADERS = {}  # or {"Authorization": "Bearer fc_..."}

leagues = requests.get(f"{BASE}/leagues/", headers=HEADERS).json()["leagues"]
czech = [l for l in leagues if l["country"] == "Czech Republic"]

results = requests.get(
    f"{BASE}/leagues/czech3a/results/", params={"season": "2025-2026"}, headers=HEADERS
).json()
for m in results["matches"][:5]:
    print(m["date"], m["homeTeam"], m["score"], m["awayTeam"], "HT", m["ht_result"])
```

## Data Sources

| Data | Category | Source |
|---|---|---|
| Results, half-time scores, goal minutes | Aggregated | collected from BetExplorer's public results pages; cross-checked against API-Football (published at https://www.football-charts.com/data/quality) |
| Fixtures and match status | Licensed | API-Football |
| Match statistics (47 leagues) | Licensed | API-Football: counts, plus API-Football's own expected-goals value where it supplies one (served as team averages `xg_avg`, `xg_against_avg`) |
| Match statistics (27 leagues) | Aggregated | SofaScore public match pages; counts only, no expected-goals values |
| Tables, goal-timing bins, form | Derived | computed by Football Charts from the results above |
| Season projections, match model outputs | Derived | Dixon-Coles baseline model (`dc_v2.0`) fitted on the results above |

Checked 2026-09-24. Team logos in responses are hosted by Football Charts or
by API-Football (`media.api-sports.io`).

## What Is Not Available

Checked 2026-09-24.

| Not available | Notes |
|---|---|
| Player-level data | no players, lineups or player statistics |
| Lineups and referees | being added in autumn 2026 (planned) |
| Match events | no cards, substitutions or goal scorers per event |
| Per-match statistics via the API | statistics are exposed as per-team season averages on the team endpoint only |
| All goal minutes per match via the API | results carry the first-goal minute; every goal minute is in the goal-timing bins and in the Zenodo dataset (DOI 10.5281/zenodo.22295583) |
| Seasons before 2020 | not held |
| Live in-play feed | not part of the API |
| Match statistics for 19 leagues | no statistics source mapped yet |
