---
source_url: https://api.impect.com
source_type: crawled
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect Concepts: Packing, pxT, KPIs, Scores

Impect's analytics are built on a few signature concepts. The API exposes them as fields and as queryable definitions; the framing below is grounded in the v5 schema (exact field names in [data-model.md](data-model.md)). For canonical formulas, consult the Definitions endpoints (which return each KPI/score's `label`, `definition`, `meaning`) and Impect's own glossary.

## Packing

**Packing** counts the opponents a pass or dribble *bypasses* (outplays) — i.e. how many defenders are taken out of the game by moving the ball past them. In the event model this surfaces as `PassDto.opponents` (opponents bypassed) together with the start/end `packingZone`. Bypassing defenders closer to goal is worth more, which is why the longitudinal `PackingZone` bands (`FIRST_THIRD` → `BOX`) matter. Impect popularised Packing as an alternative to possession/pass-count metrics.

## pxT — packing expected threat

**pxT** assigns a *threat value* to ball progression rather than just counting bypassed opponents. On each pass, `PassDto.pxT` is `{team, opponent}`:

- **`team`** — expected threat added *for* the attacking team by the action.
- **`opponent`** — expected threat conceded *to* the opponent (the risk/cost component, e.g. if the ball is lost).

Net value is the team gain weighed against the opponent risk. pxT is Impect's possession-value layer over the Packing/zone framework.

## KPIs

A **KPI** is a single valued metric computed at event, player or squad level. In data, a KPI value is `{kpiId, value}` (`KpiDto`); at event level it is `{position, playerId, eventId, kpiId, value}` (`ScoringDto`). Resolve `kpiId` to its meaning via:

- `GET /kpis` — all KPI definitions
- `GET /kpis/event` — event-level KPI definitions

Each definition (`KpiDetailsDto`) carries `label`, `definition`, `meaning`, an optional `parentKpi`, a `context`, and an `inverted` flag (true where a lower raw value is better). Pass `language` for translated text.

## Scores

A **score** is a standardised rating derived from KPIs (so different metrics are comparable on a common scale; `inverted` marks lower-is-better inputs). Scores are exposed at several granularities:

| Level | Endpoints |
|---|---|
| Player (match) | `/matches/{matchId}/player-scores`, `.../positions/{positions}/player-scores` |
| Player (iteration avg) | `/iterations/{id}/squads/{squadId}/player-scores`, `.../positions/{positions}/player-scores` |
| Squad | `/matches/{matchId}/squad-scores`, `/iterations/{id}/squad-scores` |
| Profile | `/iterations/{id}/squads/{squadId}/positions/{positions}/player-profile-scores` |

Definitions: `GET /player-scores`, `GET /squad-scores` (`ScoreDto = {id, name, details{label, definition, meaning}, inverted}`).

## Profiles

A **profile** (`ProfileDto`) is a weighted bundle defining a player archetype, scoped to positions: `{name, factors:[{name, type(KPI|SCORE), weight, inverted}], positions:[{name}]}`. Profile scores rate how well a player fits an archetype in given positions. Definitions: `GET /player-profiles`.

## Squad ratings & predictions

- **Squad ratings** — a time series of squad strength across an iteration (`GET /iterations/{id}/squads/ratings` → dated `{squadId, value}` entries).
- **Prediction model coefficients** — the coefficients behind Impect's match-outcome predictions (`GET /iterations/{id}/predictions/model-coefficients`).

## Set-piece sub-phases

Impect breaks each set-piece into ordered **sub-phases** (delivery → first touch → second touch …), each with its own end zone, delivery type, touch players/outcomes and aggregates. This makes set-pieces analysable as structured sequences rather than single events. See `SetPieceDto` in [data-model.md](data-model.md).
