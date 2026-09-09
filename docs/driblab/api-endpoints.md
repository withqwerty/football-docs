---
source_url: https://driblab.notion.site/Driblab-API-1-0-Guide-EN-65ce257f83b5451fb79896b01d41aede
source_type: curated
upstream_version: Driblab API 1.0 Guide [EN]
crawled_at: 2026-09-09
---

# Driblab API Endpoints

59 documented operations across 58 paths, all relative to `https://apidriblab.com`.
"Paged" means the endpoint accepts `page`, `size` and `sort`; see
[api-access.md](api-access.md).

Every path below is validated in CI against the vocabulary derived from
Driblab's own guide, so a path that is not in these tables does not exist.

## Reference lists

Small, fixed vocabularies. Fetch once and cache — they are the lookup tables the
ID fields on other resources point into.

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /countries` | All countries, with `code` (2-letter) and `alpha3code` | yes |
| `GET /country/{id}` | One country | no |
| `GET /competition-types` | Competition types, e.g. regular league vs cup | no |
| `GET /game-status` | Game processing statuses | no |
| `GET /player-positions` | Position vocabulary | no |
| `GET /player-transfers` | Transfer type vocabulary | no |
| `GET /game/tracking/status` | Tracking pipeline statuses | no |
| `GET /file-types/video` | Video and match-sheet file types, for uploads | no |

## Countries and competitions

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /country/{id}/competitions` | Competitions played in a country | yes |
| `GET /competitions` | All competitions | yes |
| `GET /competition/{id}` | One competition | no |
| `GET /competition/{id}/seasons` | Seasons of a competition | yes |
| `GET /competition/available` | Competitions your token can read | no |

`GET /competition/available` is a literal path, not `/competition/{id}` with
`id="available"`. The same shape applies to `GET /season/available`. Both shadow
the detail endpoint, so a client that builds paths by interpolation will produce
a valid-looking URL that means something else.

## Season

The season is the main aggregation unit. A season is a distinct entity with its
own ID, not a year attribute on a competition.

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /season/{id}` | Season detail, including matchday counts and dates | no |
| `GET /season/available` | Seasons your token can read | no |
| `GET /season/{id}/teams` | Teams in the season | yes |
| `GET /season/{id}/teams/stats` | Aggregated stats for every team | no |
| `GET /season/{id}/players` | Players in the season, with market value | yes |
| `GET /season/{id}/players/stats` | Aggregated stats for every player | no |
| `GET /season/{id}/arrigo-metrics` | Arrigo metrics for every player | no |
| `GET /season/{id}/coaches` | Coaches in the season | yes |
| `GET /season/{id}/games` | Games in the season | yes |
| `GET /season/{id}/matchday/{matchday}/games` | Games of one matchday | yes |
| `GET /season/{id}/league-table` | League table | no |

**Season-scoped stats are plural, team-scoped stats are singular.** The season
endpoint is `GET /season/{id}/players/stats`; the team equivalent is
`GET /team/{id}/season/{seasonId}/player-stats`. The two differ in both the
hyphen and the plural, and neither spelling works on the other resource.

## Team

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /team/{id}` | Team detail | no |
| `GET /team/{id}/roster` | Squad | yes |
| `GET /team/{id}/loans` | Players out on loan | yes |
| `GET /team/{id}/games` | Games played | yes |
| `GET /team/{id}/transfers` | Transfers in and out | yes |
| `GET /team/{id}/season/{seasonId}/stats` | Team stats for one season | no |
| `GET /team/{id}/season/{seasonId}/player-stats` | Per-player stats for one season | yes |
| `GET /team/{id}/game-stats` | Per-game stats for the team | no |

## Player

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /player/{id}` | Player detail: biography, contract, market value | no |
| `GET /player/{id}/seasons` | Seasons played, with simple stats | yes |
| `GET /player/{id}/games` | Games played | no |
| `GET /player/{id}/transfers` | Transfer history | yes |
| `GET /player/{id}/injuries` | Injury history | yes |
| `GET /player/{id}/national-team` | National teams, including youth levels | yes |
| `GET /player/{id}/season/{seasonId}/team/{teamId}/stats` | Season stats at one club | yes |
| `GET /player/{id}/season/{seasonId}/team/{teamId}/physical-stats` | Season physical stats at one club | no |
| `GET /player/{id}/season/{seasonId}/stats` | Per-game stats across the season | no |
| `GET /player/{id}/season/{seasonId}/physical-stats` | Per-game physical stats across the season | no |
| `DELETE /player/{id}` | Deletes the player | no |

The four-segment `.../team/{teamId}/...` forms aggregate a season **at one club**;
the three-segment forms without `team` return the same season broken down **per
game**. A mid-season transfer is why the club-scoped pair exists — a player who
moved has two rows for one season.

Note the guide writes five of these player endpoints without a space after the
verb (`GET/player/{id}/injuries`). That is a typographical slip in the guide, not
a different route.

## Coach

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /coach/{id}` | Coach detail | no |
| `GET /coach/{id}/history` | Clubs and seasons the coach has worked in | yes |

## Game

| Endpoint | Returns | Paged |
|---|---|---|
| `GET /game/{id}` | Match detail: teams, score, formations, possession, venue | no |
| `GET /game/{id}/lineup` | Per-player positional and timing information | no |
| `GET /game/{id}/timeline` | Main match events | no |
| `GET /game/{id}/stats` | Team stats for the match | no |
| `GET /game/{id}/player-stats` | Player stats for the match | no |
| `GET /game/{id}/physical-stats` | Team physical stats | no |
| `GET /game/{id}/player-physical-stats` | Player physical stats | no |
| `GET /game/{id}/arrigo-metrics` | Team Arrigo metrics | no |
| `GET /game/{id}/player-arrigo-metrics` | Player Arrigo metrics | no |
| `GET /game/{id}/tracking` | A link to the game's tracking file | no |
| `GET /game/{id}/ts` | When the game was last updated | no |

Lineups are singular: `GET /game/{id}/lineup`, not `/lineups`.

`GET /game/{id}/ts` returns a last-updated timestamp, so it is the cheap way to
decide whether a cached game needs refetching. Use it before re-pulling stats, and
the daily request budget stretches much further.

`GET /game/{id}/tracking` does not return tracking frames. It returns a
short-lived presigned link to a `.jsonl` tracking file on S3. Download it
promptly; the link expires.

## Video and upload

| Endpoint | Purpose | Paged |
|---|---|---|
| `GET /game/{id}/video-type/{fileTypeId}/download-link` | Presigned download link for a file | no |
| `GET /game/{id}/video-type/{fileTypeId}/stream-link` | Stream link for a file | no |
| `POST /game` | Requests game creation and returns upload URLs | no |

`fileTypeId` comes from `GET /file-types/video`. The published values are 1
MatchVideoFull, 2 MatchVideoH1, 3 MatchVideoH2, 4 MatchVideoH3, 5 MatchVideoH4,
6 MatchVideoPK, 7 MatchSheetHomeAway, 8 MatchSheetHome, 9 MatchSheetAway.

`POST /game` takes a JSON body with `homeTeamId`, `awayTeamId`, `seasonId`,
`matchDate` (`DD/MM/YYYY`), `matchDay`, optional `matchGroupId` and
`roundTypeId`, and a `files` array. It responds with a `gameId` and a `urls`
array of presigned links — one per file — which you then `PUT` the files to. The
upload is a two-step handshake, not a multipart post.

`matchDate` is day-first (`15/12/2011`), matching the `dob` and `match_date`
fields elsewhere in the API. It is not ISO 8601, unlike the season `start_date`
and `end_date` fields, which are. Both formats appear in the same API.

`roundTypeId` runs 0 Winner, 1 Final, 2 Semi-Finals, 3 Quarter-Finals, 4 Round of
16, 5 Round of 32, 6 Group Stage, 7 Fourth Round, 8 Third Round, 9 Second Round,
10 First Round, 11 Preliminary Round, 12 Third Place Play-Off, 13 Fifth Place
Play-Off, 14 Next Round via Play-Off. `matchGroupId` runs 1 to 12 for Group A to
Group L.
