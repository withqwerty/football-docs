---
source_url: https://api.impect.com
source_type: crawled
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect API Endpoints (Customer API v5)

44 `GET` endpoints under base `https://api.impect.com`, all prefixed `/v5/customerapi/`. Paths below omit that prefix. All require `Authorization: Bearer <token>` (see [api-access.md](api-access.md)); responses use the `{data, status, message}` envelope. Common path params: `{iterationId}`, `{matchId}`, `{squadId}`, `{positions}` (comma-separated `Position` values).

## Master Data

| Endpoint | Returns |
|---|---|
| `GET /countries` | All countries |
| `GET /iterations` | All iterations (season × competition) |
| `GET /iterations/{iterationId}/matches` | Matches in an iteration |
| `GET /iterations/{iterationId}/squads` | Squads in an iteration |
| `GET /iterations/{iterationId}/players` | Players in an iteration |
| `GET /iterations/{iterationId}/coaches` | Coaches in an iteration |
| `GET /iterations/{iterationId}/stadiums` | Stadiums in an iteration |
| `GET /matches/{matchId}` | Match line-ups, formations & substitutions (`data` is a `MatchDto`, wrapped in `ResponseObject_MatchInfoDto`) |

## Match Level Data

| Endpoint | Returns |
|---|---|
| `GET /matches/{matchId}/events` | Full event feed (`EventDto`) — packing zones, lanes, pxT, phases |
| `GET /matches/{matchId}/event-kpis` | Per-event KPI values (`ScoringDto`: position, playerId, eventId, kpiId, value) |
| `GET /matches/{matchId}/player-kpis` | Per-player KPI sums for the match |
| `GET /matches/{matchId}/squad-kpis` | Per-squad KPI sums for the match |
| `GET /matches/{matchId}/player-scores` | Per-player standardised scores |
| `GET /matches/{matchId}/positions/{positions}/player-scores` | Per-player scores for given positions |
| `GET /matches/{matchId}/squad-scores` | Per-squad scores |
| `GET /matches/{matchId}/set-pieces` | Set-piece sub-phases (`SetPieceDto`) |
| `GET /matches/{matchId}/skillcorner-frame-mappings` | SkillCorner frame ↔ event-index mappings |

## Iteration Level Data (aggregates)

| Endpoint | Returns |
|---|---|
| `GET /iterations/{iterationId}/squad-kpis` | Squad average KPIs across the iteration |
| `GET /iterations/{iterationId}/squad-scores` | Squad scores across the iteration |
| `GET /iterations/{iterationId}/squads/{squadId}/player-kpis` | Player average KPIs (one squad) |
| `GET /iterations/{iterationId}/squads/{squadId}/player-scores` | Player scores (one squad) |
| `GET /iterations/{iterationId}/squads/{squadId}/positions/{positions}/player-scores` | Player scores by position |
| `GET /iterations/{iterationId}/squads/{squadId}/positions/{positions}/player-profile-scores` | Player profile scores by position |

## Definitions

| Endpoint | Returns |
|---|---|
| `GET /kpis` | All KPI definitions |
| `GET /kpis/event` | Event-level KPI definitions |
| `GET /player-scores` | All player score definitions (`ScoreDto`: id, name, details{label, definition, meaning}, inverted) |
| `GET /squad-scores` | All squad score definitions |
| `GET /player-profiles` | All profile definitions (`ProfileDto`: name, weighted factors, positions) |

Definitions endpoints accept an optional **`language`** query param for translated labels/definitions.

## Squad Ratings & Predictions

| Endpoint | Returns |
|---|---|
| `GET /iterations/{iterationId}/squads/ratings` | Squad ratings over the iteration (`SquadRatingsForIterationDto` → dated entries) |
| `GET /iterations/{iterationId}/predictions/model-coefficients` | Prediction model coefficients |

## Update Feed (incremental sync)

All take a required **`since`** (ISO 8601) query param; return records changed after it.

| Endpoint | Entity |
|---|---|
| `GET /update/iterations` | Iterations |
| `GET /update/matches` | Matches |
| `GET /update/matchdata` | Match data (events/KPIs/scores recalculated) |
| `GET /update/squads` | Squads |
| `GET /update/players` | Players |
| `GET /update/coaches` | Coaches |
| `GET /update/stadiums` | Stadiums |
| `GET /update/skillcorner-frame-mappings` | SkillCorner frame mappings |

## Delete Feed (incremental sync)

All take a required **`since`** (ISO 8601) query param; return `DeletedDto` records (with `DeleteType` = `DELETED` or `MERGED`).

| Endpoint | Entity |
|---|---|
| `GET /delete/iterations` | Iterations |
| `GET /delete/matches` | Matches |
| `GET /delete/squads` | Squads |
| `GET /delete/players` | Players |
| `GET /delete/coaches` | Coaches |
| `GET /delete/stadiums` | Stadiums |

Note: a `MERGED` delete means the entity was merged into another (follow up via the update feed to find the survivor).
