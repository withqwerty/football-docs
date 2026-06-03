---
source_url: https://api.impect.com
source_type: crawled
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect Data Model

Payload structures returned by the Customer API v5, from the OpenAPI spec. Every response is wrapped in `{data, status, message}` (see [api-access.md](api-access.md)). For the spatial/categorical enums see [coordinate-system.md](coordinate-system.md) and [event-types.md](event-types.md); for KPI/score semantics see [concepts.md](concepts.md).

## Event (`EventDto`)

`GET /matches/{matchId}/events` returns a list of `EventDto`. Each event is heavily annotated with Impect's spatial framework (packing zone, lane, pitch position) and metric payloads.

| Field | Type | Notes |
|---|---|---|
| `index` | integer | Event order within the match |
| `id` | integer | Event id |
| `sequenceIndex` | integer | Index within the possession sequence |
| `gameTime` | `GameTimeDto` | `{gameTime (mm:ss), gameTimeInSec}` |
| `periodId` | integer | Match period |
| `squadId` | integer | Acting squad |
| `player` | `EventPlayerDto` | `{id, position, positionSide}` |
| `actionType` | `ActionType` | SHOT, PASS, DRIBBLE, TACKLE, INTERCEPTION, CLEARANCE, CROSS, FOUL, OFFSIDE |
| `action` | `Action` | LOW_PASS, HIGH_PASS, GROUND_DUEL, AIR_DUEL, SHOT, CROSS, CLEARANCE, INTERCEPTION, TACKLE, FOUL, OFFSIDE |
| `result` | `EventResult` | SUCCESS / FAIL |
| `phase` | `Phase` | SECOND_BALL, BUILD_UP, COUNTER_ATTACK, SET_PIECE |
| `pressure` | number | Pressure on the acting player |
| `distanceToOpponent` | `DistanceToOpponent` | LESS_THAN_ONE_METER, ONE_TO_THREE_METERS, MORE_THAN_THREE_METERS |
| `start` / `end` | `EventPositionDto` | Location + zone/lane/pitch-position at start and end (see below) |
| `opponent` | `EventOpponentPositionDto` | Nearest opponent's `coordinates` / `adjCoordinates` |
| `formation` | `FormationsDto` | `{team, opponent}` formation strings |
| `pass` | `PassDto` | Present for passes (see below) |
| `shot` | `ShotDto` | Present for shots |
| `dribble` | `DribbleDto` | `{distance, type, result, playerId}` |
| `duel` | `DuelDto` | `{duelType, playerId}` |
| `setPiece` | `EventSetPieceDto` | `{id, subPhaseId, mainEvent}` — links event to a set-piece sub-phase |
| `inferredSetPiece` | boolean | Set-piece inferred rather than tagged |
| `pressingPlayerId` | integer | |
| `fouledPlayerId` | integer | |

### `EventPositionDto` (start / end)

| Field | Type | Notes |
|---|---|---|
| `coordinates` | `CoordinateDto` | `{x, y}` raw pitch coordinates |
| `adjCoordinates` | `CoordinateDto` | Direction-adjusted coordinates (attack normalised one way) |
| `packingZone` | `PackingZone` | GKR, FIRST_THIRD, SECOND_THIRD, FINAL_THIRD, BOX |
| `pitchPosition` | `PitchPosition` | OWN_BOX, OWN_HALF, OPPONENT_HALF, OPPONENT_BOX |
| `lane` | `Lane` | LEFT_WING, LEFT_HALF_SPACE, CENTER, RIGHT_HALF_SPACE, RIGHT_WING |

### `PassDto`

| Field | Type | Notes |
|---|---|---|
| `distance` | number | |
| `angle` | number | |
| `distanceToGoal` | number | |
| `duration` | number | |
| `opponents` | integer | Opponents bypassed (packing count) |
| `receiver` | `PassReceiverDto` | `{playerId, type}` — `type` = TEAMMATE / OPPONENT |
| `currentAttackingSquadId` | integer | |
| `bodyPart` | `BodyPart` | FOOT / HEAD / OTHER (+ `bodyPartExtended` string) |
| `previousPassHeight` | `PassHeight` | LOW / MEDIUM / HIGH |
| `pxT` | `PxTDto` | `{team, opponent}` — packing expected threat added for/against (see [concepts.md](concepts.md)) |

### `ShotDto`

| Field | Type | Notes |
|---|---|---|
| `distance` | number | |
| `angle` | number | |
| `targetPoint` | `TargetPointDto` | `{y, z}` — aim point in the goal plane |
| `gk` | `ShotGoalkeeperDto` | `{coordinates, adjCoordinates, divePoint, woodwork}` — `woodwork` = LEFT_POST / RIGHT_POST / CROSSBAR |

## KPIs and scoring

KPIs are valued metrics referenced by `kpiId`; their human definitions come from the Definitions endpoints.

| Schema | Shape | From |
|---|---|---|
| `KpiDto` | `{kpiId, value}` | player/squad/iteration KPI endpoints |
| `ScoringDto` | `{position, playerId, eventId, kpiId, value}` | `GET /matches/{matchId}/event-kpis` |
| `KpiDetailsDto` | `{id, name, details, parentKpi, context, inverted}` | KPI definitions |
| `KpiBasicDetailsDto` | `{label, definition, meaning}` | nested in definitions/scores |

`ScoreDto` (score definitions): `{id, name, details:{label, definition, meaning}, inverted}`. Player/squad scores are standardised ratings derived from KPIs (player-scores, squad-scores, profile-scores endpoints). `ProfileDto`: `{name, factors:[{name, type(KPI|SCORE), weight, inverted}], positions:[{name}]}`.

## Set-pieces (`SetPieceDto`)

Impect models set-pieces as a sequence of **sub-phases**:

| Field | Type | Notes |
|---|---|---|
| `id`, `matchId`, `squadId` | integer | |
| `startTime`/`endTime` (+ `*InSec`) | string/number | |
| `phaseIndex` | integer | |
| `setPieceCategory` / `adjSetPieceCategory` | `SetPieceCategory` | FREE_KICK, CORNER, GOAL_KICK, THROW_IN, PENALTY |
| `setPieceExecutionType` | `SetPieceExecutionType` | DIRECT / INDIRECT |
| `setPieceSubPhase` | `[SetPieceSubPhaseDto]` | per-category end zones (`cornerEndZone`, `freeKickEndZone`, …), delivery types, first/second-touch players & outcomes, `passReceiverId`, `ballTrajectory`, `aggregates` |

End zones use the `EndZone` enum (NEAR_POST, FAR_POST, SIX_YARD_BOX, etc. — see [coordinate-system.md](coordinate-system.md)).

## Squad ratings & predictions

- `GET /iterations/{iterationId}/squads/ratings` → `SquadRatingsForIterationDto` = `{iterationId, squadRatingsEntries:[SquadRatingsForDateDto]}`; each dated entry holds `SquadRatingDto` = `{squadId, value}`. Ratings are a time series across the iteration.
- `GET /iterations/{iterationId}/predictions/model-coefficients` → model coefficients (`ModelCoefficientDto`) used in Impect's match-prediction model.

## Master data

| Schema | Key fields |
|---|---|
| `IterationDto` | `id`, `season`, `competition{name, id, type, countryId, gender}`, `dataVersion`, `lastChangeTimestamp`, `idMappings` |
| `MatchDto` (single match, from `GET /matches/{matchId}`) | `id`, `dateTime`, `lastCalculationDate`, `iterationId`, `stadiumId`, `squadHome`/`squadAway` (`MatchSquadInfoDto`: `id` (squadId), players, startingPositions, substitutions, startingFormation, formations, coachId). **No `idMappings`.** |
| `MatchInfoDto` (list item, from `GET /iterations/{id}/matches`) | `iterationId`, `id`, `homeSquadId`, `awaySquadId`, `scheduledDate`, `lastCalculationDate`, `matchDay`, `available`, `idMappings` |
| `PlayerDto` | `id`, `firstname`, `lastname`, `commonname`, `birthdate`, `birthplace`, `leg` (LEFT/RIGHT/BOTH), `countryIds`, `gender`, `currentSquadId`, `idMappings` |
| `SquadDto` | `id`, `name`, `countryId`, `type` (NATIONAL_TEAM/CLUB), `gender`, `imageUrl`, `idMappings`, `access` |
| `CoachDto` (has `idMappings`) / `StadiumDto` (has `idMappings`) / `CountryDetailDto` | reference data |

> Note: `GET /matches/{matchId}` is wrapped in `ResponseObject_MatchInfoDto`, but its `data` payload is actually a **`MatchDto`** (with nested line-ups). The flat `MatchInfoDto` — the one that carries `idMappings` — is what the `/iterations/{id}/matches` list returns.

`idMappings` (`IdMappingDto`) is an **array of `{external provider name → string[]}` maps** and is present on `IterationDto`, `SquadDto`, `PlayerDto`, `MatchInfoDto`, `CoachDto` and `StadiumDto` — see [identity-surfaces.md](identity-surfaces.md).
