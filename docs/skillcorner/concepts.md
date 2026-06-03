---
source_url: https://skillcorner.com/api/docs/
source_type: crawled
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner Concepts

SkillCorner's products share a vocabulary of possession phases, physical bands and Game Intelligence event types. Definitions below are grounded in the API's enums and field names; canonical formulas/thresholds live in the glossary (<https://skillcorner.crunch.help/en>).

## Possession phases: TIP / OTIP / BIP

Physical and Game Intelligence metrics are split by who has the ball:

- **TIP** — *Team In Possession*: the player's team has the ball.
- **OTIP** — *Opponent Team In Possession*: the opponent has the ball.
- **BIP** — *Ball In Play*: the ball is in play (excludes stoppages).
- **all** — every phase combined.

These appear as the `possession` filter (`all`/`tip`/`otip`) and as suffixes on physical fields (`_tip`, `_otip`, `_bip`, `_all`). Splitting physical output by TIP/OTIP separates attacking from defending workload — a SkillCorner signature.

## Normalisation

Counting raw totals is misleading across different minutes/possession shares, so metrics can be normalised per fixed time:

- **p90** — per 90 minutes
- **p60bip** — per 60 minutes ball-in-play
- **p30tip** — per 30 minutes team-in-possession
- **p30otip** — per 30 minutes opponent-in-possession

`average_per` selects the normalisation for `/physical/` and GI-metric endpoints.

## Physical speed bands

Physical metrics bucket movement by intensity: **running**, **HSR** (High Speed Running), **sprint**, and **HI** (High Intensity = HSR + sprint). Acceleration/deceleration efforts are split into **medium** and **high**, with **explosive** accelerations that lead into HSR or a sprint tracked separately. **PSV-99** (Peak Sprint Velocity, 99th percentile) is an outlier-robust top-speed proxy. Exact km/h thresholds are in the glossary. See [physical-data.md](physical-data.md).

## Game Intelligence event types

SkillCorner's Game Intelligence (V2) models tactical, positional behaviour from tracking. The streams:

| Concept | Phase | What it captures |
|---|---|---|
| **Off-ball runs** | in possession | Runs made *without* the ball — their type, timing, direction and threat created |
| **Passing options** | in possession | The passing options available to the ball carrier at each moment (and whether they were found) |
| **Player possessions** | in possession | Individual on-ball possession spells |
| **Passes** | in possession | Pass actions with GI context |
| **On-ball engagements** | out of possession | Pressing/defensive engagements on the opponent ball carrier |
| **Phases of play** | — | Segmentation of the match into possession phases / game states |

Each is available as a per-match **dynamic-events** stream (CSV, row-level) and as **aggregated GI metrics** (JSON, with `group_by`/`average_per`). The V1 equivalents (`/in_possession/...`, `/beta/out_of_possession/`) are deprecated.

## Data quality gates

- **`physical_check_passed`** — per-row boolean; SkillCorner's automated physical-data QC. Filter `physical_check_passed=true` for analysis-grade physical data.
- **`dynamic_events_check`** — quality gate on dynamic-event downloads; a failing match returns `403 Bad data quality` unless `ignore_dynamic_events_check` is set.
- **`count_match` / `count_match_failed`** — how many matches contributed to (or were excluded from) an aggregate.
- **Extrapolated tracking** — positions inferred when players are off-camera; distinct product from measured tracking (see [coordinate-system.md](coordinate-system.md)).
