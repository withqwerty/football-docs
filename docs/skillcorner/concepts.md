---
source_url: https://26560301.fs1.hubspotusercontent-eu1.net/hubfs/26560301/Guides/Dynamic%20Events/20260703-%20Dynamic%20Events%20CSV%20Specifications.pdf
source_type: curated
upstream_version: SkillCorner Dynamic Events CSV Specifications 2026/07/03
crawled_at: 2026-08-31
---

# SkillCorner Concepts

SkillCorner's products share a vocabulary of possession phases, physical bands, and Game Intelligence event types. Definitions below are grounded in SkillCorner's API enums, tracking models, and official Dynamic Events CSV specifications.

---

## Possession phases: TIP / OTIP / BIP

Physical and Game Intelligence metrics are split by who has the ball:

- **TIP** — *Team In Possession*: the player's team has the ball.
- **OTIP** — *Opponent Team In Possession*: the opponent has the ball.
- **BIP** — *Ball In Play*: the ball is in play (excludes stoppages).
- **all** — every phase combined.

These appear as the `possession` filter (`all`/`tip`/`otip`) and as suffixes on physical fields (`_tip`, `_otip`, `_bip`, `_all`). Splitting physical output by TIP/OTIP separates attacking from defending workload — a SkillCorner signature.

---

## Normalisation

Counting raw totals is misleading across different minutes/possession shares, so metrics can be normalised per fixed time:

- **p90** — per 90 minutes
- **p60bip** — per 60 minutes ball-in-play
- **p30tip** — per 30 minutes team-in-possession
- **p30otip** — per 30 minutes opponent-in-possession

`average_per` selects the normalisation for `/physical/` and GI-metric endpoints.

---

## Physical speed bands

Physical metrics bucket movement by intensity: **running**, **HSR** (High Speed Running), **sprint**, and **HI** (High Intensity = HSR + sprint). Acceleration/deceleration efforts are split into **medium** and **high**, with **explosive** accelerations that lead into HSR or a sprint tracked separately. **PSV-99** (Peak Sprint Velocity, 99th percentile) is an outlier-robust top-speed proxy. See [physical-data.md](physical-data.md).

Speed bands in Dynamic Events CSV files are bucketed as follows:

| Band Name (`speed_avg_band`) | Speed ID (`speed_avg_band_id`) | Threshold / Condition |
|-----------------------------|-------------------------------|-----------------------|
| `None` | `null` | Speed unavailable or player off-camera |
| `jogging` | 1 | `speed_avg` < 15 km/h |
| `running` | 2 | `speed_avg` between 15 km/h and 20 km/h |
| `hsr` | 3 | `speed_avg` between 20 km/h and 25 km/h |
| `sprinting` | 4 | `speed_avg` > 25 km/h |

---

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

Each is available as a per-match **dynamic-events** stream (CSV, row-level) and as **aggregated GI metrics** (JSON, with `group_by`/`average_per`).

---

## Line Breaking Passes & Defensive Structure Templates

SkillCorner detects line-breaking pass opportunities and completed line breaks by fitting defending team player positions to dynamic **defensive structure templates**.

### Organised Defense (`organised_defense`)

Line breaks and defensive structure fields are only populated when the defending team is in an **organised defense** (`organised_defense = true`). If the defense is in a counter-attack recovery or chaotic phase, `organised_defense` is `false` and line break values are `null`.

### Structure Templates

SkillCorner fits 17 predefined templates for 11-player teams (e.g. 4-5-1, 4-4-2, 4-3-3, 4-2-4, 5-4-1, 5-3-2, 5-2-3, 3-5-2, 3-4-3, 4-2-3-1, 4-1-4-1, 4-1-3-2, 5-1-3-1, 4-3-1-2, 4-3-2-1, 4-1-2-3, 4-4-1-1) and 15 templates for 10-player teams (red card scenarios). In case of 2 or more missing players, no defensive structure is detected.

### Defensive Lines Naming Convention

Defensive lines are formed by blocks of 2 or more defending players:

- **`last_line`** — Line closest to the defending team's goal.
- **`second_last_line`** — Line second closest to the defending team's goal.
- **`first_line`** — Line furthest from the defending team's goal (present when there are at least 3 lines).

A defensive line is represented as a set of connected segments between players, rather than a rigid horizontal line.

### Line Break Detection & Filtering

A line break occurs when the ball crosses from the left side of a defensive line segment at pass release to the right side at reception (in direction of attack).

A Machine Learning model filters non-relevant line breaks using geometric features (pass distance, pass angle, distance from passer to line, distance from receiver to line).

- **`first_line_break_type`** / **`second_last_line_break_type`** / **`last_line_break_type`** — `Through` (pass passed between defenders in the line) or `Around` (pass bypassed the outer edge of the line).
- **`high_pass`** (bool) — `true` if the ball trajectory reached a height of at least **1.8 meters** during the pass.

---

## Phases of Play

SkillCorner segments match play into concurrent in-possession and out-of-possession phases based on ball tracking, player tracking, and pressure states:

| In Possession Phase | Out of Possession Phase | Description |
|---------------------|--------------------------|-------------|
| **Build up** | **High Block** | Ball in team's own third; ball carrier under pressure or opposing unit positioned high. |
| **Create** | **Medium Block** | Default phase near middle third; also occurs in own third if unpressured or attacking third if defender line is high. |
| **Finish** | **Low Block** | Ball in final or middle third with defending line close to penalty box (established possession >= 1s). |
| **Quick Break** | **Defending Quick Break** | Regaining possession in opponent's half followed by rapid progression up the pitch. |
| **Transition** | **Defending Transition** | Regaining possession in own half followed by rapid progression up the pitch. |
| **Direct** | **Defending Direct** | Long ball pass (>= 32m along x-axis, non-switch) from own half targeting a player near reception. |
| **Set Play** | **Defending Set Play** | Corners, free-kicks, and long throw-ins into the penalty box (lasts until clear possession, clearance, out of play, or 20s). |
| **Chaotic** | **Chaotic** | Short contested possession (< 3 passes without header, or < 5s possession). Clearances under pressure are always chaotic. |
| **Disruption** | **Disruption** | Temporary short interruption (e.g., defender blocks shot without full regain, attacking team immediately resumes Finish phase). |

---

## Pressure Types & Sub-Models

SkillCorner evaluates pressure on the ball carrier across 4 specialized sub-models synthesized into a global **Overall Pressure** rating.

### Pressure Sub-Models

1. **Pass Reception Difficulty** (`reception_difficulty_start`) — Technical difficulty to control the ball and time needed before distributing. Evaluated at possession start.
2. **Time to Impact** (`time_to_impact_start` / `time_to_impact_end`) — Defensive engagement proximity: how fast the nearest defender is closing in and estimated time until contact. Evaluated at start and end of possession.
3. **Space Constraint** (`space_constraint_start`) — Operational space around ball carrier and ability to turn away from engagement. Evaluated at possession start.
4. **Passing Option Ease** (`passing_option_ease_start` / `passing_option_ease_end`) — Availability and technical execution difficulty of passing options. Evaluated at start and end of possession.

Sub-models use a 5-point scale: `Very Easy` (1), `Easy` (2), `Medium` (3), `Hard` (4), `Very Hard` (5).

### Global Overall Pressure

`overall_pressure_start` and `overall_pressure_end` synthesize all pressure elements into a 5-point global classification scale:

| ID | Rating (`overall_pressure`) | Description |
|----|----------------------------|-------------|
| 1 | `No pressure` | Uncontested space; no defender closing in |
| 2 | `Low pressure` | Mild defensive presence; clear passing options |
| 3 | `Medium pressure` | Moderate closing speed or space restriction |
| 4 | `High pressure` | Tight defender proximity, high difficulty to distribute |
| 5 | `Very high pressure` | Severe constraint, immediate contact or tackle threat |

Pressure events are **omitted** (`null`) if tracking data cannot be matched (`is_matched_start = false`), for headers, fully extrapolated players, kickoffs, GK hand possessions, or when ball is off-camera.

---

## Expected Possession Value (EPV) & Progression Models

SkillCorner applies Expected Possession Value (EPV) and Progression Graph Neural Networks (GNN-LSTM) to quantify threat created or suppressed during player possessions and passes.

### Possession EPV Attributes

- `possession_epv_for_start` / `possession_epv_for_end` (float) — Probability of team in possession scoring within the next 30 seconds (or before ball goes out of play), evaluated at possession start/end.
- `possession_epv_delta_for` (float) — Change in scoring probability over the possession (`possession_epv_for_end - possession_epv_for_start`).
- `possession_epv_against_start` / `possession_epv_against_end` (float) — Probability of opponent scoring within the next 30 seconds.
- `possession_epv_delta_against` (float) — Change in conceding probability over the possession.
- `possession_epv_total` (float) — Net swing in scoring probability (`possession_epv_delta_for - possession_epv_delta_against`).

### Pass EPV Attributes

- `pass_reception_epv_for` / `pass_reception_epv_against` (float) — EPV evaluated at pass reception frame.
- `pass_epv_total` (float) — Net swing in scoring probability attributable specifically to the pass segment.
- `pass_epv_delta_for` (float) — Change in scoring probability attributable specifically to the pass segment.

### Progression Model Attributes

- `force_backward` (bool) — `true` if defender engagement forced ball carrier into a regressive/backward pass (+30% regression probability).
- `xloss_player_possession_start` / `end` / `max` (float) — Probability that ball carrier will lose possession (excluding shots).
- `xshot_player_possession_start` / `end` / `max` (float) — Probability that possession will result in a shot attempt.

---

## Forward Momentum

**Forward Momentum (`forward_momentum = true`)** captures player possessions centered around a progressive first touch.

### Criteria

1. Player receives a pass coming from the back or side.
2. An opponent defender is within **6.0 meters** at the moment of the first touch.
3. Player is located in the **central channel** or **half-space channel**.
4. Player successfully turns forward and moves forward immediately from their first touch.

---

## Data quality gates

- **`physical_check_passed`** — per-row boolean; SkillCorner's automated physical-data QC. Filter `physical_check_passed=true` for analysis-grade physical data.
- **`dynamic_events_check`** — quality gate on dynamic-event downloads; a failing match returns `403 Bad data quality` unless `ignore_dynamic_events_check` is set.
- **`count_match` / `count_match_failed`** — how many matches contributed to (or were excluded from) an aggregate.
- **Extrapolated tracking** — positions inferred when players are off-camera; distinct product from measured tracking (see [coordinate-system.md](coordinate-system.md)).
