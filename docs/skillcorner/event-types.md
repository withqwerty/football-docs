---
source_url: https://26560301.fs1.hubspotusercontent-eu1.net/hubfs/26560301/Guides/Dynamic%20Events/20260703-%20Dynamic%20Events%20CSV%20Specifications.pdf
source_type: curated
upstream_version: SkillCorner Dynamic Events CSV Specifications 2026/07/03
crawled_at: 2026-08-31
---

# SkillCorner Event Types

SkillCorner Dynamic Events capture full-pitch, tracking-derived match events at 10 frames per second using SkillCorner Tracking v3. Unlike traditional event data that only records on-ball actions (passes, shots, tackles), Dynamic Events track both on-ball actions and off-ball contextual events—such as player possessions, off-ball runs, passing options, and defensive on-ball engagements.

Every row in a SkillCorner Dynamic Events CSV file represents an event performed by an active player.

---

## Dynamic Event Types

SkillCorner defines 4 primary dynamic event types:

| ID | Name (`event_type`) | Description |
|----|--------------------|-------------|
| 1 | `off_ball_run` | Off-ball movement made by an attacking player in possession |
| 7 | `passing_option` | Target availability for a potential or executed pass |
| 8 | `player_possession` | Individual on-ball possession spell by a player |
| 9 | `on_ball_engagement` | Defensive engagement applied to the opponent ball carrier |

---

## Dynamic Event Subtypes

Subtypes refine specific off-ball runs (event type 1) and on-ball defensive engagements (event type 9). Player possessions (event type 8) and passing options (event type 7) carry no subtype (`event_subtype = None`).

| ID | Subtype (`event_subtype`) | Applicable Events | Description |
|----|--------------------------|-------------------|-------------|
| 1 | `behind` | `off_ball_run`, `on_ball_engagement` | Run targeted behind the last defensive line |
| 2 | `coming_short` | `off_ball_run`, `on_ball_engagement` | Run toward the ball carrier to shorten pass distance |
| 3 | `cross_receiver` | `off_ball_run`, `on_ball_engagement` | Run into the box to receive a cross |
| 4 | `dropping_off` | `off_ball_run`, `on_ball_engagement` | Run dropping deeper into midfield space |
| 5 | `overlap` | `off_ball_run`, `on_ball_engagement` | Run passing outside the ball carrier on the flank |
| 6 | `pulling_half_space` | `off_ball_run`, `on_ball_engagement` | Movement outward into the half-space channel |
| 7 | `pulling_wide` | `off_ball_run`, `on_ball_engagement` | Movement outward into the wide channel |
| 8 | `run_ahead_of_the_ball` | `off_ball_run`, `on_ball_engagement` | Forward run progressing past the ball carrier |
| 9 | `support` | `off_ball_run`, `on_ball_engagement` | Supporting movement to provide a clean passing outlet |
| 10 | `underlap` | `off_ball_run`, `on_ball_engagement` | Run passing inside the ball carrier toward the central channel |
| 11 | `pressing` | `on_ball_engagement` | Active defensive pressure part of a collective pressing chain |
| 12 | `pressure` | `on_ball_engagement` | Direct individual pressure applied outside a pressing chain |
| 13 | `counter_press` | `on_ball_engagement` | Immediate defensive pressure applied within 3–5s of turnover |
| 14 | `recovery_press` | `on_ball_engagement` | Defender running backwards to apply pressure to the ball carrier |
| 15 | `other` | `on_ball_engagement` | Non-pressing engagement (jockeying, standing ground, contested duel) |

---

## Common Event Schema

Every dynamic event in SkillCorner carries a set of core identification, timing, positioning, and context attributes:

```json
{
  "event_id": "32839_104",
  "index": 104,
  "match_id": 32839,
  "frame_start": 304,
  "frame_end": 350,
  "time_start": "00:00:06.293",
  "time_end": "00:00:10.331",
  "minute_start": 0,
  "second_start": 6,
  "duration": 4.038,
  "period": 1,
  "attacking_side_id": 1,
  "attacking_side": "left_to_right",
  "event_type_id": 8,
  "event_type": "player_possession",
  "event_subtype_id": null,
  "event_subtype": null,
  "player_id": 11746,
  "player_name": "T. Alexander-Arnold",
  "player_position_id": 8,
  "player_position": "RB",
  "team_id": 2,
  "team_shortname": "Liverpool",
  "x_start": -5.2,
  "y_start": 10.8,
  "x_end": 12.4,
  "y_end": 15.1,
  "channel_id_start": 4,
  "channel_start": "half_space_right",
  "third_id_start": 1,
  "third_start": "defensive_third",
  "penalty_area_start": false,
  "channel_id_end": 5,
  "channel_end": "wide_right",
  "third_id_end": 2,
  "third_end": "middle_third",
  "penalty_area_end": false
}
```

### Identification and Timing Fields

- `event_id` (str) — Match-specific unique identifier for the event.
- `index` (int) — 1-based sequential ordering index within the match.
- `match_id` (int) — Unique match ID.
- `frame_start` / `frame_end` (int) — SkillCorner extrapolated tracking frame indices at event start and end.
- `time_start` / `time_end` (timestamp) — Match clock timestamp formatted as `HH:MM:SS.mmm`.
- `minute_start` / `second_start` (int) — Minutes and seconds part of the clock timestamp.
- `duration` (float) — Event duration in seconds (`(frame_end - frame_start) / 10`).
- `period` (int) — Period identifier: 1 = 1st half, 2 = 2nd half, 3 = 1st extra time, 4 = 2nd extra time, 5 = penalty shootout.
- `attacking_side_id` / `attacking_side` — Direction of play identifier: `1` / `left_to_right` or `2` / `right_to_left`.

### Spatial and Pitch Location Fields

SkillCorner normalizes pitch coordinates to meters centered at `(0, 0)` with the team in possession attacking left-to-right (`x` from -52.5m to +52.5m, `y` from -34m to +34m).

- `x_start`, `y_start` (float) — Player coordinates at event start.
- `x_end`, `y_end` (float) — Player coordinates at event end.
- `channel_id_start` / `channel_start` — Pitch channel at event start (`1`: `wide_left`, `2`: `half_space_left`, `3`: `center`, `4`: `half_space_right`, `5`: `wide_right`).
- `third_id_start` / `third_start` — Pitch third at event start (`1`: `defensive_third`, `2`: `middle_third`, `3`: `attacking_third`).
- `penalty_area_start` / `penalty_area_end` (bool) — Whether player is inside the penalty box at start/end.

### Position Enums

SkillCorner encodes player positions (`player_position_id` and `player_position`) across all dynamic event types using 20 standard role IDs:

| ID | Code | Position Name |
|----|------|---------------|
| 1 | GK | Goalkeeper |
| 2 | LB | Left Back |
| 3 | LWB | Left Wing Back |
| 4 | LCB | Left Center Back |
| 5 | CB | Center Back |
| 6 | RCB | Right Center Back |
| 7 | RWB | Right Wing Back |
| 8 | RB | Right Back |
| 9 | LDM | Left Defensive Midfield |
| 10 | DM | Center Defensive Midfield |
| 11 | RDM | Right Defensive Midfield |
| 12 | LM | Left Midfield |
| 13 | CM | Center Midfield |
| 14 | RM | Right Midfield |
| 15 | AM | Attacking Midfield |
| 16 | LW | Left Wing |
| 17 | RW | Right Wing |
| 18 | LF | Left Forward |
| 19 | CF | Center Forward (Striker) |
| 20 | RF | Right Forward |

---

## Player Possession (event_type_id: 8)

A **Player Possession (PP)** event is recorded whenever a player controls the ball—defined as being able to attempt a pass, shot, or carry.

### Key Rules and Thresholds

- Starts on the player's **first touch** and ends on their **last touch**.
- **One-touch possessions** (`one_touch = true`) last exactly 1 frame.
- Interceptions without established control (e.g. shot blocks, deflections) do **not** count as player possessions.

### Start Types (`start_type_id` / `start_type`)

| ID | Name | Description |
|----|------|-------------|
| 1 | `pass_reception` | Possession started from a completed pass by a teammate |
| 2 | `pass_interception` | Possession started by intercepting an opponent pass |
| 3 | `keep_possession` | Possession retained by team after a deflection, save, or post hit without opponent regain |
| 4 | `recovery` | Player regains possession from a loose ball |
| 5 | `free_kick_reception` | Possession started from a free-kick pass |
| 6 | `free_kick_interception` | Intercepted opponent free-kick |
| 7 | `throw_in_reception` | Possession started from a throw-in |
| 8 | `throw_in_interception` | Intercepted opponent throw-in |
| 9 | `goal_kick_reception` | Possession started from a goal-kick |
| 10 | `goal_kick_interception` | Intercepted opponent goal-kick |
| 11 | `corner_reception` | Possession started from a corner kick |
| 12 | `corner_interception` | Intercepted opponent corner kick |
| 13 | `unknown` | Unclassified start method |

### End Types (`end_type_id` / `end_type`)

| ID | Name | Description |
|----|------|-------------|
| 1 | `pass` | Possession ended with a pass attempt |
| 2 | `shot` | Possession ended with a shot attempt |
| 3 | `clearance` | Possession ended with a clearance |
| 4 | `foul_suffered` | Possession ended when the player was fouled |
| 5 | `possession_loss` | Player lost possession to an opponent |
| 6 | `unknown` | Unclassified end method |
| 7 | `direct_regain` | Opponent directly regained the ball |
| 8 | `indirect_regain` | Opponent indirectly regained the ball after a stoppage |
| 9 | `direct_disruption` | Defensive action disrupted play directly |
| 10 | `indirect_disruption` | Defensive action caused an indirect stoppage |
| 11 | `foul_committed` | Possession ended when the player committed a foul |

### Specific Player Possession Attributes

- `one_touch` (bool) — `true` if possession lasted exactly 1 frame.
- `quick_pass` (bool) — `true` if possession lasted < 1.0s and ended with a pass (not one-touch).
- `carry` (bool) — `true` if the player covered >= 2.0 meters during possession.
- `forward_momentum` (bool) — `true` if player received ball with opponent < 6m away in central/half-space channel and turned/progressed forward from first touch.
- `is_header` (bool) — `true` if possession was executed with the head.
- `hand_pass` (bool) — `true` if Goalkeeper threw the ball by hand (`null` for field players).
- `initiate_give_and_go` (bool) — `true` if player passed and initiated an off-ball run within 2.0 seconds.

---

## Off-Ball Run (event_type_id: 1)

An **Off-Ball Run (OBR)** is an off-ball movement made by an attacking player while their team has control of the ball.

### Detection Criteria

1. **Duration**: Lasts at least **0.7 seconds**.
2. **Speed**: Player speed exceeds **15 km/h** (4.2 m/s).
3. **Visibility**: Player must be visible on screen for at least **0.5 seconds** during the run.
4. **Passing Connection**: Player must be identified as a **passing option** during or within **8 frames** of completing the run, or receive a pass.

Off-ball runs are **not** detected during set-piece restarts (corners, throw-ins, free-kicks).

### Key Off-Ball Run Attributes

- `give_and_go` (bool) — `true` if run started within 2.0s of passing the ball. Restricted to run subtypes: `behind`, `cross_receiver`, `overlap`, `pulling_half_space`, `pulling_wide`, `run_ahead_of_the_ball`, `underlap`, and `support` (att 3rd central/half-space).
- `intended_run_behind` (bool) — `true` if run subtype is `behind` and player explicitly demonstrated intent to run behind the defensive line (held run or tracked by defender).
- `push_defensive_line` (bool) — `true` if last defender dropped back >= 10m during the run.
- `break_defensive_line` (bool) — `true` if player was positioned >= 1m behind the last defender between `end_time - 1s` and `end_time + 1s`.
- `passing_option_at_start` (bool) — `true` if player was a valid passing option during the first 0.5s of the run.
- `n_opponents_overtaken` (int) — Number of field opponents bypassed along the x-axis (`n_opponents_ahead_start - n_opponents_ahead_end`).

---

## Passing Option (event_type_id: 7)

A **Passing Option (PO)** event represents a viable passing target available to the ball carrier during a player possession.

### Detection Criteria

- Identified by SkillCorner's **Receiver Model** when `passing_option_score > 0.6` for at least **0.3 seconds**.
- Automatically created whenever a player is **targeted by a pass**, regardless of score. If untargeted score was < 0.6, the generated event lasts 0.3s ending at the frame of the pass.
- For 1-touch passes (1 frame duration), the model extends the evaluation window by **2 frames before and 2 frames after** the first touch.

### Passing Moment Frame Selection

For every passing option, metrics are evaluated at the **peak passing moment frame** (`peak_passing_option_frame`):
- If pass was attempted: evaluated at the actual frame of the pass.
- If untargeted: evaluated at the frame (where `passing_option_score > 0.6`) that maximizes:

$$\text{passing\_option\_score} \times \text{xthreat} \times \text{xpass\_completion}$$

### Key Passing Option Attributes

- `predicted_passing_option` (bool) — `true` if Receiver Model score `xreceiver >= 0.6`.
- `peak_passing_option_frame` (int) — Frame index where option metrics are evaluated.
- `n_simultaneous_passing_options` (int) — Count of passing options overlapping within +/- 5 frames.
- `passing_option_score` (float) — Likelihood of receiving the pass (0.0 to 1.0).
- `xthreat` (float) — Expected threat / probability of scoring within 10s if pass completes.
- `xpass_completion` (float) — Pass completion probability predicted by Graph Neural Network.
- `difficult_pass_target` (bool) — `true` if completion probability `xpass_completion < 0.65`.
- `dangerous` (bool) — `true` if `xthreat > 0.02`.

---

## On-Ball Engagement (event_type_id: 9)

An **On-Ball Engagement (OBE)** event records an out-of-possession defensive player interacting with or pressuring the ball carrier.

### Detection Criteria

1. Performed by a player from the team **out of possession**.
2. Defender actively influences the ball carrier's actions by pressing, challenging, containing, or jockeying.
3. Detected and classified using a **GNN-LSTM** machine learning model trained on sequential expert annotations.
4. Carries a `frame_physical_start` attribute capturing when defender speed exceeded 15 km/h before making contact/engagement.

### Pressing vs Pressure Distinction

- **Pressure (`event_subtype = pressure`)** — Singular defensive action applied by an individual defender outside a collective chain.
- **Pressing (`event_subtype = pressing`)** — Defensive pressure applied as part of a **Pressing Chain**.

#### Pressing Chain Rules

A **Pressing Chain** consists of at least two player possessions subjected to pressing or recovery pressing:
- Possessions must occur within **4.0 seconds** of each other.
- Attacking team must be in **Build Up**, **Direct**, or **Create** phases.
- Chains do not apply in Finish, Transition, Chaotic, or Set Play phases.
- Broken if ball carrier performs a fast break carry (carries forward >= 15m with < 8 defenders ahead by end of carry).

#### Counter Press (`event_subtype = counter_press`)

Defensive pressure applied within **3.0 to 5.0 seconds** immediately following an open-play turnover.

#### Recovery Press (`event_subtype = recovery_press`)

Defender running backwards toward their own goal to apply pressure to a advancing ball carrier.

### Key On-Ball Engagement Attributes

- `affected_line_breaking_passing_option_id` (str) — ID of the highest `xreceiver_score` line-breaking passing option available to the ball carrier that was suppressed by this defensive engagement.
- `affected_line_break` (str) — Furthest line (`first_line`, `second_last_line`, `last_line`) that would have been broken by the suppressed option.
- `force_backward` (bool) — `true` if engagement forced ball carrier to make a backward pass (+30% regression probability).
- `beaten_by_possession` (bool) — `true` if ball carrier significantly increased scoring chances while on-ball despite defender being goalside.
- `beaten_by_movement` (bool) — `true` if receiver beat defender through off-ball movement prior to reception.
- `stop_possession_danger` (bool) — `true` if defender stopped a high-danger scoring situation via interception or regain.
- `reduce_possession_danger` (bool) — `true` if defender reduced scoring danger significantly without conceding a shot.
