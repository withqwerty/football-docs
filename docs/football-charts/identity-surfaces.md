---
source_url: https://www.football-charts.com/developers
source_type: curated
upstream_version: "v1"
crawled_at: 2026-09-24
---

# Football Charts Identity Surfaces

## League Identity

Football Charts identifies a competition by a lowercase league key (`premier`,
`eng1`, `segunda1`, `czech3a`, `wsweden`). The key is stable and is the path
segment in every league endpoint. `GET /api/v1/leagues/` maps each key to a
display `name` (for example `Segunda RFEF - Group 1`) and `country`.
Competitions split into groups are separate keys (`segunda1` to `segunda5`,
`czech3a` / `czech3b`). There is no numeric league id in the v1 API; the match
endpoint exposes the corresponding `api_football_league_id`.

| Surface | Example | Stable |
|---|---|---|
| League key | `segunda1` | yes |
| Display name | `Segunda RFEF - Group 1` | may change with sponsorship (`Serie A Betano`) |
| API-Football league id | `39` (Premier League) | on the match endpoint only |

## Season Identity

A season is a string, either `YYYY-YYYY` (autumn-to-spring leagues) or `YYYY`
(calendar-year leagues), fixed per league at any one time. The same league can
switch format when its calendar changes: `japan1` has `2026` (spring 2026) and
then `2026-2027`. Sort a league's seasons as strings; do not compare season
strings across leagues.

## Team Identity

Teams are identified by display name within a league, for example
`Manchester City`, `Motorlet Prague`, `Dukla Prague B`. Names are Football
Charts' canonical spellings, which often differ from other providers
(`Hillerod` vs `Hillerød Fodbold`, `Aalborg` vs `AaB`). Reserve and youth sides
carry suffixes such as `B`. There is no numeric team id in the v1 API.

| Surface | Example | Where |
|---|---|---|
| Display name | `Manchester City` | every endpoint (`team`, `home_team`, `homeTeam`) |
| Team slug | `manchester-city` | teams endpoint; path of `/teams/{team}/` |
| API-Football team name | `Manchester City` | `api_team_name` on the team endpoint |
| API-Football team id | `50` | `api_football_home_team_id` / `api_football_away_team_id` on the match endpoint |

A team name is unique within a league-season, not globally: the same name can
appear in two leagues (for example after promotion). Join on
(league key, team name) or on the API-Football team id.

## Match Identity

A match has a slug built from country, league display name, date and team
names:

```text
england/premier-league/2026-08-23-manchester-city-vs-bournemouth
```

The slug is the key for `GET /api/v1/matches/{slug}/` and appears on fixtures
(`slug`) and on the team match log (`match_slug`). It is not in the results
endpoint.

| Surface | Example | Where | Notes |
|---|---|---|---|
| Match slug | `england/premier-league/2026-08-23-...` | fixtures, team log, match endpoint | the match endpoint key |
| Results `id` | `216791` | results, team log (`matches[].id`) | internal; results space |
| Match `id` | `19333` | match endpoint | internal; fixture space, different from results `id` |
| API-Football fixture id | `1557374` | match endpoint (`api_football_fixture_id`) | best key for joining to other providers |
| (league, date, home, away) | `premier, 2026-08-23, Manchester City, Bournemouth` | all endpoints | natural key across endpoints |

The two internal ids are not interchangeable. To join a result to its match
page, use the natural key (league, date, home team, away team).

## Mapping To Other Providers

The API-Football ids on the match endpoint (`api_football_fixture_id`,
`api_football_league_id`, home/away team ids) are the most direct bridge to
other providers; Reep (reep.football) maps API-Football ids to SofaScore,
Transfermarkt, FBref and others. For leagues and seasons where only names are
available, match on (date +/- 1 day, score) before names: kick-off dates and
final scores agree across providers far more often than club spellings do.
