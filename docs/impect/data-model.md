---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
---

# Impect Data Model

Payload structures for each file in the
[open-data repository](https://github.com/ImpectAPI/open-data), grounded in the
repository's `Documentation.pdf` and verified against the published JSON.

Enum member lists live in [event-types.md](event-types.md); spatial enums in
[coordinate-system.md](coordinate-system.md).

**Version marker.** The snapshot is `dataVersion: "V3"`. Attributes Impect
documents as dataV4+ only are marked **dataV4+** below, with a note on whether
they actually appear in the snapshot.

## Events — `data/events/events_{matchId}.json`

A JSON array of event objects, ordered by `index`.

### Top-level fields

| Field | Type | Notes |
|---|---|---|
| `index` | integer | Event number within the match, starting at 0 |
| `id` | integer | Globally unique event ID |
| `gameTime` | object | `{gameTime, gameTimeInSec}` — see below |
| `squadId` | integer | Squad of the player touching the ball |
| `player` | object | `{id, position, positionSide}` — live position, updated per event |
| `pressure` | number | Pressure on the ball carrier, 0 (none) to 100 (no ball control). Derived from distance to nearest opponent and body part used, including the incoming pass trajectory |
| `actionType` | enum | Broad event category — see [event-types.md](event-types.md) |
| `action` | enum | Specific action; a finer form of `actionType` |
| `periodId` | integer | 1 = first half, 2 = second half, 3 = first half ET, 4 = second half ET. Snapshot contains only 1 and 2 |
| `start` | object | Start location — see *Event position* below |
| `end` | object \| null | End location. **Null for ~42% of snapshot events** (those without a distinct end location) |
| `phase` | enum | Phase of play for the tagged team, computed algorithmically |
| `duel` | object \| null | `{duelType, playerId}` — `playerId` is the opponent faced (duel loser) |
| `shot` | object \| null | Present on shots — see below |
| `pass` | object \| null | Present on passes — see below |
| `currentAttackingSquadId` | integer | Squad in ball control. High-pressure/low-control events are ignored, so this reads as a possession sequence |
| `bodyPart` | enum | Body part used, including incoming pass height |
| `bodyPartExtended` | enum | **dataV4+** — splits `FOOT_LEFT`/`FOOT_RIGHT`, adds `HAND` for goalkeeper actions. *Populated in the snapshot* (923,698 events) |
| `previousPassHeight` | enum | For receptions and `actionType: OUT` — whether the previous pass or shot was flat or high (above chest height) |
| `duration` | number | Seconds between this event and the next |
| `opponents` | integer | Opponents able to defend their own goal — those whose radial distance to their own goal is less than the ball's |
| `pxT` | object | `{team, opponent}` — Packing Expected Threat, see [concepts.md](concepts.md) |
| `distanceToGoal` | number | Radial distance in metres from ball to centre of opponent goal |
| `result` | enum \| null | `SUCCESS` / `FAIL` / `NEUTRAL` — see below |
| `pressingPlayerId` | integer \| null | Opponent pressing the ball carrier (attacking to win the ball, or within one metre) |
| `fouledPlayerId` | integer \| null | On a `FOUL`, the player fouled. Absent often means handball or another foul type |
| `distanceToOpponent` | enum \| null | Banded distance to nearest opponent at ball receipt/release in open play |
| `formation` | object | `{team, opponent}` — live formation strings, e.g. `"4-2-3-1"` |
| `opponent` | object \| null | **dataV4+** — nearest opponent's `{coordinates, adjCoordinates}` when within 4 m. *Not populated in the snapshot* |
| `setPiece` | object \| null | `{id, subPhaseId, mainEvent}` — links the event to a set-piece phase. *Populated in the snapshot* (32,377 events) |
| `dribble` | object \| null | **dataV4+** — `{distance, type, result, playerId}`. *Not populated in the snapshot* |
| `sequenceIndex` | integer | Sequence counter; increments when a team gains ball control (`currentAttackingSquadId` changes) or a set piece is taken |
| `inferredSetPiece` | boolean | True when a set piece was not visible in footage and was inserted automatically from the preceding `FOUL`, `OFFSIDE` or `OUT` |

### `gameTime`

| Field | Type | Notes |
|---|---|---|
| `gameTime` | string | `"MM:SS.MSMS"`, with added time appended as `(+AddedTime)` |
| `gameTimeInSec` | number | First half starts at 0; **second half starts at 10,000**; extra-time halves start at 20,000 and 30,000 |

The per-period offset is a deliberate encoding, not elapsed time — do not treat
`gameTimeInSec` as a continuous match clock without subtracting the period base.

### Event position (`start` / `end`)

| Field | Type | Notes |
|---|---|---|
| `coordinates` | `{x, y}` | Raw pitch coordinates, from the TV-footage viewpoint |
| `adjCoordinates` | `{x, y}` | Adjusted so both teams play left to right |
| `packingZone` | enum | Fluid zone oriented to opposition players — see [coordinate-system.md](coordinate-system.md) |
| `pitchPosition` | enum | Static vertical fifth of the pitch |
| `lane` | enum | Static horizontal fifth of the pitch |

### `pass`

| Field | Type | Notes |
|---|---|---|
| `distance` | number | Metres between ball release and reception |
| `angle` | number | Polar, 0–360°. 0° = straight towards opponent goal, 90° = left, 180° = backwards, 270° = right |
| `receiver` | object \| null | `{playerId, type}` where `type` is `TEAMMATE` or `OPPONENT` |

Note that `opponents`, `pxT`, `bodyPart`, `duration` and `distanceToGoal` are
**top-level event fields**, not nested inside `pass`.

### `shot`

| Field | Type | Notes |
|---|---|---|
| `distance` | number | Radial metres from shot location to centre of goal |
| `angle` | number | 0°–90° towards the centre of the opponent goal |
| `targetPoint` | `{y, z}` | Where the shot would have crossed the goal mouth — see the goal map in [coordinate-system.md](coordinate-system.md) |
| `gk` | object | **dataV4+** — `{coordinates, adjCoordinates, divePoint}` at the moment of the shot. *Not populated in the snapshot* |
| `woodwork` | enum | **dataV4+** — `LEFT_POST`, `RIGHT_POST`, `CROSSBAR`, `CROSSBAR_LEFT_POST`, `CROSSBAR_RIGHT_POST`. *Not populated in the snapshot* |

### `result` semantics

- **Passes**: `SUCCESS` when the pass reaches a teammate with pressure below 80.
  `NEUTRAL` when the receiver is under high pressure or a foul follows.
  `FAIL` for passes to an opponent with pressure below 80, and passes going out
  of play or offside.
- **Dribbles and shots**: only `SUCCESS` or `FAIL`.

## Event KPIs — `data/events_kpis/events_kpis_{matchId}.json`

A JSON array. Each row is one KPI value attached to one event.

| Field | Type | Notes |
|---|---|---|
| `position` | enum | Position the player held when the value was recorded |
| `playerId` | integer | Player credited with the value |
| `eventId` | integer | Joins to `events[].id` |
| `kpiId` | integer | Joins to `kpi_definitions[].id` |
| `value` | number | The KPI value |

Both `parentKpi` and `context` are always null for event-level KPIs.

## Player KPIs — `data/player_kpis/player_kpis_{matchId}.json`

A single JSON **object** (not an array), holding per-player aggregates split by
position.

```
{
  "matchId": 0,
  "squadHome": { "id": 0, "players": [ ... ] },
  "squadAway": { "id": 0, "players": [ ... ] }
}
```

Each entry in `players`:

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Player ID |
| `position` | enum | Position these aggregates apply to |
| `playDuration` | number | Seconds played **at that position** |
| `matchShare` | number | Share of the match played at that position; 1 = full match including injury time |
| `kpis` | array | `[{kpiId, value}]` |

A player who changed position appears once per position, so aggregating to match
level means summing across their rows.

## Lineups — `data/lineups/lineups_{matchId}.json`

A single JSON **object**.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Match ID |
| `dateTime` | string | Kick-off timestamp |
| `lastCalculationDate` | string | Last time the match data changed |
| `iterationId` | integer | Iteration the match belongs to |
| `squadHome` / `squadAway` | object | See below |

Each squad object:

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Squad ID |
| `players` | array | `[{id, shirtNumber}]` — full match-day squad |
| `startingPositions` | array | `[{playerId, position, positionSide}]` — the starting eleven |
| `substitutions` | array | All substitutions, tactical changes, position-side changes and send-offs |
| `startingFormation` | string | Formation at kick-off, e.g. `"5-1-2-2"` |
| `formations` | array | `[{gameTime, gameTimeInSec, formation}]` — formation changes through the match |
| `coachId` | integer \| null | Null throughout the snapshot |

Each substitution entry:

| Field | Type | Notes |
|---|---|---|
| `gameTime` | object | `{gameTime, gameTimeInSec}` |
| `playerId` | integer | Player changing |
| `fromPosition` / `fromPositionSide` | enum | Position before the change |
| `toPosition` / `positionSide` | enum | Position after the change. `toPosition: "BANK"` means leaving the pitch; `positionSide` is then `"UNKNOWN"` |
| `exchangedPlayerId` | integer \| null | **dataV4+** — null throughout the snapshot |
| `substitutionType` | enum \| null | **dataV4+** — null throughout the snapshot |

Because `substitutionType` is unavailable here, a substitution must be read from
the `fromPosition` → `toPosition` transition: a move to `BANK` is a player coming
off, a move from `BANK` is a player coming on, and any other transition is a
tactical or positional change.

## Matches — `data/matches/matches_{iterationId}.json`

A JSON array of match metadata for the iteration.

| Field | Type | Notes |
|---|---|---|
| `iterationId` | integer | |
| `id` | integer | Match ID — the key used in event and lineup filenames |
| `homeSquadId` / `awaySquadId` | integer | |
| `scheduledDate` | string | Kick-off date and time |
| `lastCalculationDate` | string | Last time the match data changed |
| `matchDay` | object | `{index, name}` — `index` starts at 0; `name` is German, e.g. `"1. Spieltag"` |
| `available` | boolean | Whether data for the match is available |
| `idMappings` | array | Cross-provider IDs — see [identity-surfaces.md](identity-surfaces.md) |

Match metadata carries no score field; results must be derived from `GOAL` and
`OWN_GOAL` events.

## Squads — `data/squads/squads_{iterationId}.json`

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Squad ID |
| `name` | string | e.g. `"1. FC Köln"` |
| `countryId` | integer | Joins to `countries[].id` |
| `type` | enum | `CLUB` or `NATIONAL_TEAM` |
| `gender` | enum | `MALE` / `FEMALE` |
| `imageUrl` | string | Club crest |
| `idMappings` | array | Cross-provider IDs |
| `access` | boolean | Relevant to Impect API customers only |

## Players — `data/players/players_{iterationId}.json`

Every player who appeared in an iteration squad at least once.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Player ID |
| `firstname` / `lastname` / `commonname` | string | `commonname` is the full display name |
| `birthdate` | string | `YYYY-MM-DD` |
| `birthplace` | string | |
| `leg` | enum | `LEFT`, `RIGHT`, `BOTH` — strong foot |
| `countryIds` | integer[] | A player may hold several |
| `gender` | enum | |
| `currentSquadId` | integer | Squad at snapshot time, which may differ from the squad in a given match |
| `idMappings` | array | Cross-provider IDs |

## Countries — `data/countries.json`

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Country ID |
| `name` | string | |
| `isoName` / `isoCode` | string \| null | ISO 3166-1 alpha-3 |
| `fifaName` / `fifaCode` | string \| null | |

ISO and FIFA codes diverge for the UK home nations — Scotland is ISO `GBR`
("United Kingdom") but FIFA `SCO` ("Scotland"). Use the FIFA code where national
teams matter. An `id: 346` "unknown" row exists with all codes null.

## Iterations — `data/iterations.json`

An iteration is one season of one competition.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Iteration ID — 743 for Bundesliga 23/24 |
| `season` | string | e.g. `"23/24"` |
| `competition` | object | `{name, id, type, countryId, gender}` |
| `dataVersion` | string | `"V3"` in the snapshot |
| `lastChangeTimestamp` | string | Last time a match in the iteration changed |
| `idMappings` | array | Cross-provider IDs |

## KPI definitions — `data/kpi_definitions.json`

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Joins to any `kpiId` |
| `name` | string | Stable machine name, e.g. `BYPASSED_OPPONENTS` |
| `details` | object | `{label, definition, meaning}` — `label` is null for a few KPIs |
| `parentKpi` | object \| null | For aggregated data, the KPI this is a sub-KPI of |
| `context` | object \| null | For aggregated data, the context used to compute it (action, packing zone, etc.) |

103 definitions in the snapshot. See [kpi-definitions.md](kpi-definitions.md) for
the full ID index.
