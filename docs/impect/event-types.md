---
source_url: https://api.impect.com
source_type: crawled
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect Event Types & Enums

Impect's `EventDto` does not use a free-form type string — it uses a small set of controlled enums. The two that classify an event are **`actionType`** (the broad category) and **`action`** (the specific action). These are the exact enum values from the v5 spec. See [data-model.md](data-model.md) for the full event payload.

## `actionType` (9)

The broad event category:

`SHOT`, `PASS`, `DRIBBLE`, `TACKLE`, `INTERCEPTION`, `CLEARANCE`, `CROSS`, `FOUL`, `OFFSIDE`

## `action` (11)

The specific action (note passes split by height, and duels are first-class):

`LOW_PASS`, `HIGH_PASS`, `GROUND_DUEL`, `AIR_DUEL`, `SHOT`, `CROSS`, `CLEARANCE`, `INTERCEPTION`, `TACKLE`, `FOUL`, `OFFSIDE`

## `result`

`SUCCESS`, `FAIL`

## `phase` — possession phase

`SECOND_BALL`, `BUILD_UP`, `COUNTER_ATTACK`, `SET_PIECE`

## Contextual enums

| Enum | Values |
|---|---|
| `BodyPart` | `FOOT`, `HEAD`, `OTHER` |
| `PassHeight` | `LOW`, `MEDIUM`, `HIGH` |
| `ReceiverType` | `TEAMMATE`, `OPPONENT` |
| `DuelType` | `GROUND_DUEL`, `AIR_DUEL` |
| `DribbleType` | `ONE_VS_ONE`, `ONE_VS_MANY` |
| `DribbleResult` | `WINNER`, `LOSER` |
| `DistanceToOpponent` | `LESS_THAN_ONE_METER`, `ONE_TO_THREE_METERS`, `MORE_THAN_THREE_METERS` |
| `Woodwork` | `LEFT_POST`, `RIGHT_POST`, `CROSSBAR` |
| `Leg` | `LEFT`, `RIGHT`, `BOTH` |

## Position enums

| Enum | Values |
|---|---|
| `Position` | `BANK` (bench), `GOALKEEPER`, `LEFT_BACK`, `RIGHT_BACK`, `CENTER_BACK`, `LEFT_MIDFIELD`, `RIGHT_MIDFIELD`, `CENTER_MIDFIELD`, `LEFT_WING`, `RIGHT_WING`, `CENTER_FORWARD` |
| `PositionSide` | `LEFT`, `RIGHT`, `CENTER` |

`{positions}` path params (e.g. on player-scores endpoints) take a comma-separated list of `Position` values.

## Set-piece enums

| Enum | Values |
|---|---|
| `SetPieceCategory` | `FREE_KICK`, `CORNER`, `GOAL_KICK`, `THROW_IN`, `PENALTY` |
| `SetPieceExecutionType` | `DIRECT`, `INDIRECT` |

## Other enums

| Enum | Values |
|---|---|
| `Gender` | `MALE`, `FEMALE` |
| `SquadType` | `NATIONAL_TEAM`, `CLUB` |
| `SubstitutionType` | `SUB_ON`, `SUB_OFF`, `TACTICAL_CHANGE` |
| `DeleteType` | `DELETED`, `MERGED` |
| `DataVersion` | `V1` |
| `ProfileFactorType` | `KPI`, `SCORE` |

Spatial enums (`PackingZone`, `Lane`, `PitchPosition`, `EndZone`) are documented in [coordinate-system.md](coordinate-system.md).
