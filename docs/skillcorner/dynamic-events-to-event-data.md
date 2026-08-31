---
source_url: https://26560301.fs1.hubspotusercontent-eu1.net/hubfs/26560301/Guides/Dynamic%20Events/20260703-%20Dynamic%20Events%20CSV%20Specifications.pdf
source_type: curated
upstream_version: SkillCorner Dynamic Events CSV Specifications 2026/07/03
crawled_at: 2026-08-31
---

# Extracting Common Event Data from SkillCorner Dynamic Events

SkillCorner Dynamic Events record continuous, tracking-derived match actions in row-level CSV format. While traditional event data providers (such as StatsBomb or Opta) record discrete, point-in-time manually tagged events, SkillCorner's tracking stream captures full-pitch context for both on-ball actions and off-ball movement.

This guide explains how analysts and AI coding agents can extract standard match event data types (passes, carries, shots, pressures, regains, clearances) from SkillCorner Dynamic Events.

---

## Cross-Provider Event Mapping Summary

The table below summarizes how standard event types from StatsBomb and Opta map to queries over SkillCorner Dynamic Events:

| Standard Event Type | StatsBomb ID | Opta Type | SkillCorner Dynamic Event Query |
|--------------------|--------------|-----------|---------------------------------|
| **Pass** | 30 (`Pass`) | 1 (`Pass`) | `player_possession` where `end_type = 'pass'` (or `pass_outcome` is not null) |
| **Pass Reception** | 42 (`Ball Receipt*`) | — | `player_possession` where `start_type = 'pass_reception'` |
| **Carry** | 43 (`Carry`) | — | `player_possession` where `carry = true` (distance >= 2m) |
| **Shot** | 16 (`Shot`) | 13/14/15/16 | `player_possession` where `end_type = 'shot'` |
| **Pressure** | 17 (`Pressure`) | Qualifier 326 | `on_ball_engagement` where `event_subtype` in `['pressure', 'pressing', 'counter_press', 'recovery_press']` |
| **Interception** | 10 (`Interception`) | 8 (`Interception`) | `player_possession` where `start_type` in `['pass_interception', 'throw_in_interception', 'corner_interception', 'free_kick_interception', 'goal_kick_interception']` |
| **Ball Recovery** | 2 (`Ball Recovery`) | 49 (`Recovery`) | `player_possession` where `start_type = 'recovery'` |
| **Clearance** | 9 (`Clearance`) | 12 (`Clearance`) | `player_possession` where `end_type = 'clearance'` |
| **Off-Ball Run** | — | — | `off_ball_run` events (type ID 1) |
| **Passing Option** | — | — | `passing_option` events (type ID 7) |

---

## Extracting Pass Events

In SkillCorner Dynamic Events, pass attempts are recorded on the `player_possession` event of the passer, while pass receptions are recorded on the subsequent `player_possession` event of the receiver.

### Passer Side: Attempted & Completed Passes

Filter `event_type = 'player_possession'` where `end_type = 'pass'`:

- **Pass Start Location**: `x_end`, `y_end` of the passer's `player_possession` event (the location where the ball was released).
- **Pass End Location (Reception Point)**: `player_targeted_x_reception`, `player_targeted_y_reception`.
- **Pass Target Player**: `player_targeted_id`, `player_targeted_name`, `player_targeted_position`.
- **Pass Outcome**: `pass_outcome` (`successful`, `unsuccessful`, `offside`).
- **Pass Distance**: `pass_distance` (meters between release and reception).
- **Pass Angle**: `pass_angle` (degrees relative to attack direction).
- **Pass Direction**: `pass_direction` (`forward`, `backward`, `sideway left`, `sideway right`).
- **Pass Range**: `pass_range` (`short` < 15m, `medium` 15–30m, `long` > 30m).
- **Pass Height**: `high_pass` (`true` if max ball height >= 1.8m, `false` for ground/low pass).
- **Targeted Option ID**: `targeted_passing_option_event_id` (links directly to the `passing_option` event row).

### Receiver Side: Pass Receptions

Filter `event_type = 'player_possession'` where `start_type = 'pass_reception'`:

- **Reception Location**: `x_start`, `y_start` of the receiver's `player_possession` event.
- **Received Pass Trajectory**: `pass_angle_received`, `pass_direction_received`, `pass_distance_received`, `pass_range_received`.
- **Received in Space**: `received_in_space` (`true` if nearest defender was >= 3m away at reception).

---

## Extracting Carry & Dribble Events

Carries represent a player moving with the ball at their feet during a possession spell.

Filter `event_type = 'player_possession'` where `carry = true`:

- **Carry Start Location**: `x_start`, `y_start`.
- **Carry End Location**: `x_end`, `y_end`.
- **Distance Covered**: `distance_covered` (meters).
- **Average Speed**: `speed_avg` (km/h) and `speed_avg_band` (`jogging`, `running`, `hsr`, `sprinting`).
- **Direction & Trajectory**: `trajectory_angle`, `trajectory_direction` (`forward`, `backward`, `sideway left`, `sideway right`).
- **Channel Progression**: `in_to_out` (moved from central/half-space to wide channel) or `out_to_in` (moved from wide/half-space to central channel).
- **Forward Momentum**: `forward_momentum = true` (player controlled pass from side/back with defender < 6m away and immediately turned/progressed forward in central/half-space channel).

---

## Extracting Shot Events

Filter `event_type = 'player_possession'` where `end_type = 'shot'`:

- **Shot Location**: `x_end`, `y_end` of the player possession event.
- **Lead to Shot**: `lead_to_shot = true` (present on any prior event occurring within 10 seconds of a shot).
- **Lead to Goal**: `lead_to_goal = true` (present on any prior event occurring within 10 seconds of a goal).
- **Pre-Shot Probability**: `xshot_player_possession_start`, `xshot_player_possession_end`, `xshot_player_possession_max` (GNN model probability of possession ending in a shot).

---

## Extracting Pressure & Defensive Actions

Defensive pressure in SkillCorner is captured both as explicit out-of-possession `on_ball_engagement` rows and as synthesized pressure metrics on `player_possession` rows.

### Out-of-Possession Defensive Engagements

Filter `event_type = 'on_ball_engagement'`:

- **Individual Pressure**: `event_subtype = 'pressure'` (direct pressure applied by an individual defender).
- **Collective Pressing**: `event_subtype = 'pressing'` (pressure applied as part of a `pressing_chain`).
- **Counter Pressing**: `event_subtype = 'counter_press'` (pressure within 3–5s of open-play turnover).
- **Recovery Pressing**: `event_subtype = 'recovery_press'` (defender running backwards to pressure ball carrier).
- **Defender Distance**: `interplayer_distance_start`, `interplayer_distance_min`, `interplayer_distance_end`.
- **Goalside Position**: `goal_side_start`, `goal_side_end` (`true` if defender is closer to their own goal than the ball carrier).
- **Suppressed Line Break**: `affected_line_breaking_passing_option_id`, `affected_line_break` (`first_line`, `second_last_line`, `last_line`).

### On-Ball Pressure Context (Player Possession View)

Every `player_possession` row includes overall pressure ratings assessed at possession start and end:

- **Overall Pressure**: `overall_pressure_start`, `overall_pressure_end` (`No pressure`, `Low pressure`, `Medium pressure`, `High pressure`, `Very high pressure`).
- **Time to Impact**: `time_to_impact_start`, `time_to_impact_end` (estimated time in seconds until nearest defender makes contact).
- **Space Constraint**: `space_constraint_start` (available operational space around ball carrier).

---

## Extracting Regains, Interceptions, & Clearances

### Interceptions

Filter `event_type = 'player_possession'` where `start_type` is one of:
- `pass_interception` (intercepted open-play pass)
- `throw_in_interception` (intercepted throw-in)
- `corner_interception` (intercepted corner)
- `free_kick_interception` (intercepted free-kick)
- `goal_kick_interception` (intercepted goal-kick)

### Ball Recoveries

Filter `event_type = 'player_possession'` where `start_type = 'recovery'` (regaining possession from a loose ball).

### Clearances

Filter `event_type = 'player_possession'` where `end_type = 'clearance'` (defensive action to clear the ball under pressure).

---

## Extracting Off-Ball Movement & Passing Options

SkillCorner uniquely provides dedicated event streams for off-ball runs and passing options that do not exist in standard event feeds.

### Off-Ball Runs

Filter `event_type = 'off_ball_run'` (type ID 1):
- Subtypes: `behind`, `coming_short`, `cross_receiver`, `dropping_off`, `overlap`, `pulling_half_space`, `pulling_wide`, `run_ahead_of_the_ball`, `support`, `underlap`.
- Key metrics: `n_opponents_overtaken`, `break_defensive_line`, `push_defensive_line`, `give_and_go`.

### Passing Options

Filter `event_type = 'passing_option'` (type ID 7):
- Target metrics: `passing_option_score` (likelihood of receiving pass), `xthreat` (expected threat created), `xpass_completion` (pass completion probability).
- Potential Line Breaks: `first_line_break`, `second_last_line_break`, `last_line_break` (`true` if completing a pass to this option would break the line).
