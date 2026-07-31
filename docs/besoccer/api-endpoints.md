---
source_url: https://documenter.getpostman.com/view/6414020/2s93JwM1t4
source_type: curated
upstream_version: Postman collection "Apiclient"
crawled_at: 2026-07-31
---

# BeSoccer API Endpoints

BeSoccer exposes a **single endpoint**. Every call goes to the same URL and the
`req` query parameter selects the resource — there are no REST paths.

```
GET https://apiclient.besoccerapps.com/scripts/api/api.php?key={key}&req={resource}&format=json
```

Getting `req` wrong is the main failure mode, so the full vocabulary is listed
below. These 57 values are the complete set published in BeSoccer's Postman
collection; anything not listed here should be treated as not existing until you
have checked the collection yourself.

## Common parameters

| Parameter | Notes |
|---|---|
| `key` | **Required.** Unique key that allows users to connect to the API |
| `req` | **Required.** Name of the request to be consulted — see the tables below |
| `format` | Response format: `json`, `xml`, `text`, `js` |
| `tz` | Time zone, e.g. `Europe/Madrid` |
| `lang` | Output language, where the request supports it |

Pagination, where supported, uses `page`; some requests instead take an index and
count. Season is selected with `year`.

> **Coverage window.** BeSoccer states you can consult **the current season plus
> the two previous years**. Older seasons are outside the API's range.

## Access levels

Requests are grouped into three levels, which correspond to access tiers. A key
that is not entitled to a level cannot call the requests in it.


## Level 1 (15 requests)

| `req` value | Purpose | Additional parameters |
|---|---|---|
| `categories` | Competitions | `filter` |
| `competition` | Complete competition detail | `id`, `year` |
| `competition_info` | Detail of competition phases | `competitions`, `year` |
| `competition_playoffs` | Table of matches | `id`, `lang`, `year` |
| `competitions` | Top competitions | — |
| `countries_competitions` | Competitions by continent | `filter`, `lang` |
| `data_competitions` | Competition detail | `competitions` |
| `league_status` | Competition status | `id`, `year` |
| `live_matches` | Live matches | — |
| `matchs` | Matches per day | `league` |
| `matchsday` | Matches of the day | — |
| `seasons` | Seasons | `id` |
| `tables` | Classification | `league` |
| `teams` | Teams | `league` |
| `verify_datetime` | Modified timetables | `competitions` |

## Level 2 (24 requests)

| `req` value | Purpose | Additional parameters |
|---|---|---|
| `agenda` | Calendar | `page` |
| `competition_referees` | Competition referees | `id` |
| `competition_summary` | Competition summary | `id`, `year` |
| `crosses` | Crosses | `id`, `lang`, `year` |
| `get_players_club` | Obtain player equipment | `players` |
| `get_teams` | Get equipment | — |
| `league_stats` | Statistics competition | `league` |
| `live` | Live match | `id`, `lang`, `year` |
| `live_results_today` | Consult matches of the day | `competitions` |
| `match` | Match detail | `id`, `lang`, `year` |
| `match_lineups` | Match lineups | `match`, `year` |
| `matches_team` | Matches by team | `id` |
| `matchs_month` | Matches of the month | `category`, `extra`, `year` |
| `matchsday_watch` | Matches of the day | — |
| `player_transfers_history` | Player transfers complete | `id`, `lang` |
| `quiniela` | Quiniela | — |
| `quinigol` | Quinigol | — |
| `team` | Team detail | `id`, `year` |
| `team_competitions` | Team Core Competition | `id` |
| `team_info` | Equipment information | `id` |
| `team_players` | Squad competition | `team`, `year` |
| `team_squad` | Team squad | `category`, `team`, `year` |
| `transfer_market` | Transfers | `league` |
| `tv_channel_matches` | TV and matches | `date` |

## Level 3 (18 requests)

| `req` value | Purpose | Additional parameters |
|---|---|---|
| `all_stats_team` | Team statistics in match | `id`, `year` |
| `historical_players_team` | Team player history | `id` |
| `match_history` | Historic match detail | `id`, `year` |
| `player` | Player detail | `id`, `lang`, `year` |
| `player_detail_info` | Detailed player information | `id`, `lang` |
| `player_injuries` | Player injury information | `id`, `lang` |
| `player_matches` | Player games in season | `id`, `year` |
| `player_matches_st` | Detail of player matches | `category`, `id`, `year` |
| `player_palmares_st` | Player's achievements extended | `id` |
| `player_seasons` | Player seasons | `id` |
| `player_teams_seasons` | Player team information | `id` |
| `player_trajectory` | Player's trajectory | `id` |
| `players_compare` | Players compare | `competition`, `p1`, `p2`, `year` |
| `players_status` | Player status | `id`, `lang`, `year` |
| `team_complete_stats` | Team statistics in seasons | `id` |
| `team_players_stats` | Advanced equipment statistics | `category`, `team`, `year` |
| `teams_history` | Team history | `id`, `teams`, `year` |
| `transfer_leagues` | Transfers by competition | `id`, `isocode`, `team`, `year` |

## Notes on the vocabulary

A few `req` values are easy to confuse:

- `matchs` (matches per day for a league), `matchsday` (matches of the day) and
  `matchs_month` (matches of the month) are three different requests. Note the
  missing "e" in `matchs` — it is not `matches`.
- `competitions` returns top competitions with no parameters, while
  `data_competitions` takes a comma-separated `competitions` list and
  `countries_competitions` filters by continent.
- `team` and `team_info` are distinct, as are `player` and `player_detail_info`.
- `live` returns a single live match by `id`; `live_matches` returns all of them.

Spanish and English variants of the collection document the same request
vocabulary; only the descriptions differ.

