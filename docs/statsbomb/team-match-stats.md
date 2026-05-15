---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: "1.0.0"
crawled_at: null
---

# StatsBomb Team Match Stats

Pre-computed per-team, per-match metrics as found in StatsBomb-IQ.
**Commercial API only** — not available in Open Data.

- Endpoint: `GET https://data.statsbomb.com/api/v1/matches/{match_id}/team-stats` (v1)
  — some StatsBomb documentation gives the host as `data.statsbom.com`, a
  typo; use `data.statsbomb.com` (see `api-endpoints.md`).
- Response: JSON array, one object per team in the match (includes the
  opposition's id/name on each row).

Most metrics have a `_conceded` mirror = the same quantity allowed to the
opponent. See `iq-metrics-glossary.md` for concept and suffix definitions.

## Identity

| Column | Type | Description |
|---|---|---|
| `account_id` | integer | Account id |
| `match_id` | integer | Match id |
| `team_id` / `team_name` | integer / text | The team |
| `opposition_id` / `opposition_name` | integer / text | The opponent |
| `competition_id` / `competition_name` | integer / string | Competition |
| `season_id` / `season_name` | integer / string | Season |
| `team_female` | boolean | Female team? |

## Goals & expected goals

| Column | Type | Description |
|---|---|---|
| `team_match_goals` | integer | Goals scored |
| `team_match_goals_conceded` | integer | Goals conceded |
| `team_match_np_gd` | integer | Non-penalty goal difference |
| `team_match_gd` | integer | Goal difference (scored − conceded) |
| `team_match_own_goals` | integer | Own goals |
| `team_match_opposition_own_goals` | integer | Opposition own goals |
| `team_match_penalty_goals` | integer | Penalty goals scored |
| `team_match_penalty_goals_conceded` | integer | Penalty goals conceded |
| `team_match_np_xg` | double | Total xG of non-penalty shots |
| `team_match_op_xg` | double | xG of open-play shots |
| `team_match_sp_xg` | double | xG from set pieces |
| `team_match_np_xg_conceded` | double | npxG of shots conceded |
| `team_match_op_xg_conceded` | double | Open-play xG conceded |
| `team_match_sp_xg_conceded` | double | Set-piece xG conceded |
| `team_match_xgd` | double | Team xG minus team xG conceded |
| `team_match_np_xgd` | double | Same, excluding penalties |
| `team_match_np_xg_per_shot` | double | npxG per shot |
| `team_match_np_xg_per_shot_conceded` | double | npxG per shot conceded |

## Shots

| Column | Type | Description |
|---|---|---|
| `team_match_np_shots` | integer | Non-penalty shots |
| `team_match_op_shots` | integer | Open-play shots |
| `team_match_op_shots_outside_box` | integer | Open-play shots from outside the box |
| `team_match_sp_shots` | integer | Shots from set pieces |
| `team_match_np_shots_conceded` | integer | Non-penalty shots conceded |
| `team_match_op_shots_conceded` | integer | Open-play shots conceded |
| `team_match_op_shots_conceded_outside_box` | integer | Open-play shots conceded from outside the box |
| `team_match_sp_shots_conceded` | integer | Set-piece shots conceded |
| `team_match_np_shot_distance` | double | Avg distance from goal of non-penalty shots |
| `team_match_op_shot_distance` | double | Avg distance (open play) |
| `team_match_sp_shot_distance` | double | Avg distance (set piece) |
| `team_match_np_shot_distance_conceded` | double | Avg distance of opponent non-penalty shots |
| `team_match_op_shot_distance_conceded` | double | …open play |
| `team_match_sp_shot_distance_conceded` | double | …set piece |
| `team_match_counter_attacking_shots` | integer | Shots within 15 s of a possession starting in own half |
| `team_match_counter_attacking_shots_conceded` | integer | Same, conceded (possession from opponent's own half) |
| `team_match_high_press_shots` | integer | Shots from possessions won within 5 s of a defensive action in the opposition half |
| `team_match_high_press_shots_conceded` | integer | Same, conceded |
| `team_match_shots_in_clear` | integer | Shots with only the opponent GK between shooter and goal |
| `team_match_shots_in_clear_conceded` | integer | Same, conceded |

## Possession, tempo & build-up

| Column | Type | Description |
|---|---|---|
| `team_match_possession` | double | Possession average |
| `team_match_possessions` | smallint | Number of possessions |
| `team_match_directness` | double | Distance towards goal ÷ total build-up distance for shot-ending possessions |
| `team_match_pace_towards_goal` | double | Avg build-up speed to shot (m/s) |
| `team_match_ball_in_play_time` | double | Actual clock time the ball is in play |
| `team_match_deep_progressions` | integer | Passes/dribbles/carries into opposition final third |
| `team_match_deep_progressions_conceded` | integer | Same, conceded |
| `team_match_deep_completions` | integer | Successful passes within ~20 m of opposition goal |
| `team_match_deep_completions_conceded` | integer | Same, conceded |

## Passing

| Column | Type | Description |
|---|---|---|
| `team_match_passes` | integer | Attempted passes |
| `team_match_successful_passes` | integer | Successful passes |
| `team_match_passes_conceded` | integer | Opponent attempted passes |
| `team_match_successful_passes_conceded` | integer | Opponent successful passes |
| `team_match_op_passes` | integer | Open-play passes attempted |
| `team_match_op_passes_conceded` | integer | Opponent open-play passes attempted |
| `team_match_passing_ratio` | double | Passing completion rate |
| `team_match_opp_passing_ratio` | double | Opposition passing completion rate |
| `team_match_opp_final_third_pass_ratio` | double | Opposition final-third completion rate |
| `team_match_passes_inside_box` | integer | Passes completed inside the box |
| `team_match_passes_inside_box_conceded` | integer | Opponent passes completed inside the box |
| `team_match_crosses_into_box` | integer | Crosses into the box |
| `team_match_successful_crosses_into_box` | integer | Successful crosses into the box |
| `team_match_box_cross_ratio` | double | % of passes into the box that are crosses |
| `team_match_successful_box_cross_ratio` | double | % of completed passes into the box that are crosses |
| `team_match_gk_pass_distance` | double | Avg GK pass length when playing out from the back |
| `team_match_gk_long_pass_ratio` | double | % of GK long passes completed |

## Dribbling

| Column | Type | Description |
|---|---|---|
| `team_match_completed_dribbles` | integer | Dribbles completed by the team |
| `team_match_failed_dribbles` | integer | Dribbles attempted unsuccessfully |
| `team_match_total_dribbles` | integer | Total attempts to beat an opponent |
| `team_match_dribble_ratio` | double | % of dribbles completed |
| `team_match_completed_dribbles_conceded` | integer | Dribbles completed by the opposition |
| `team_match_failed_dribbles_conceded` | integer | Opposition failed dribbles |
| `team_match_total_dribbles_conceded` | integer | Total opposition dribble attempts |
| `team_match_opposition_dribble_ratio` | double | % of opposition dribbles completed |

## Defending & pressing

| Column | Type | Description |
|---|---|---|
| `team_match_ppda` | double | Passes per defensive action (pressing intensity; defined from 40% of pitch length forward) |
| `team_match_defensive_distance` | double | Avg distance from own goal of defensive actions |
| `team_match_defensive_distance_ppda` | double | Same, restricted to the PPDA definition area |
| `team_match_pressures` | integer | Times the team pressures the opponent |
| `team_match_counterpressures` | integer | Pressures within 5 s of a turnover |
| `team_match_pressure_regains` | integer | Ball regained within 5 s of a pressure |
| `team_match_counterpressure_regains` | integer | Ball won back within 5 s of a counterpressure |
| `team_match_defensive_action_regains` | integer | Ball won back within 5 s of any defensive action |
| `team_match_fhalf_pressures` | integer | Pressures in the opposition half |
| `team_match_fhalf_counterpressures` | integer | Counterpressures in the opposition half |
| `team_match_fhalf_pressures_ratio` | double | Opposition-half pressures as % of total |
| `team_match_fhalf_counterpressures_ratio` | double | Opposition-half counterpressures as % of total |
| `team_match_aggressive_actions` | integer | Tackles/pressures/fouls within 2 s of an opposition ball receipt |
| `team_match_aggression` | double | Proportion of opponent pass receipts tackled/fouled/pressured within 2 s |

## Set pieces

For each of `corner`, `free_kick` (indirect), `direct_free_kick`, `throw_in`,
and aggregate `sp`, the team gets counts, xG, per-event xG, shot/goal ratios and
a `_conceded` mirror:

| Column pattern | Type | Description |
|---|---|---|
| `team_match_corners` / `_conceded` | integer | Corners (taken / conceded) |
| `team_match_corner_xg` / `_conceded` | double | xG of shots from corners |
| `team_match_xg_per_corner` / `_conceded` | double | xG per corner |
| `team_match_shots_from_corners` / `_conceded` | integer | Shots from corners |
| `team_match_goals_from_corners` / `_conceded` | integer | Goals from corners |
| `team_match_corner_shot_ratio` / `_conceded` | double | Shots per corner |
| `team_match_corner_goal_ratio` / `_conceded` | double | Goals per corner |
| `team_match_free_kicks` / `_conceded` | integer | Indirect free kicks |
| `team_match_free_kick_xg` / `_conceded` | double | xG from indirect free kicks |
| `team_match_xg_per_free_kick` / `_conceded` | double | xG per indirect free kick |
| `team_match_shots_from_free_kicks` / `_conceded` | integer | Shots from indirect FKs |
| `team_match_goals_from_free_kicks` / `_conceded` | integer | Goals from indirect FKs |
| `team_match_free_kick_shot_ratio` / `_conceded` | double | Shots per indirect FK |
| `team_match_free_kick_goal_ratio` / `_conceded` | double | Goals per indirect FK |
| `team_match_direct_free_kicks` / `_conceded` | integer | Direct FK shots & situations (incl. quick rebounds) |
| `team_match_direct_free_kick_xg` / `_conceded` | double | xG from direct FK situations |
| `team_match_xg_per_direct_free_kick` / `_conceded` | double | xG per direct FK |
| `team_match_shots_from_direct_free_kicks` / `_conceded` | integer | Shots from direct FKs |
| `team_match_direct_free_kick_goals` / `_conceded` | integer | Goals from direct FKs |
| `team_match_direct_free_kick_shot_ratio` / `_conceded` | double | Shots per direct FK |
| `team_match_direct_free_kick_goal_ratio` / `_conceded` | double | Goals per direct FK |
| `team_match_throw_ins` / `_conceded` | integer | Throw-ins |
| `team_match_throw_in_xg` / `_conceded` | double | xG from throw-ins |
| `team_match_xg_per_throw_in` / `_conceded` | double | xG per throw-in |
| `team_match_shots_from_throw_ins` / `_conceded` | integer | Shots from throw-ins |
| `team_match_goals_from_throw_ins` / `_conceded` | integer | Goals from throw-ins |
| `team_match_throw_in_shot_ratio` / `_conceded` | double | Shots per throw-in |
| `team_match_throw_in_goal_ratio` / `_conceded` | double | Goals per throw-in |
| `team_match_sp` / `_conceded` | integer | Set pieces |
| `team_match_xg_per_sp` / `_conceded` | double | xG per set piece |
| `team_match_sp_shot_ratio` / `_conceded` | double | Shots per set piece |
| `team_match_sp_goals` / `_conceded` | integer | Goals from set pieces |
| `team_match_sp_goal_ratio` / `_conceded` | double | Goals per set piece |

## Penalties & discipline

| Column | Type | Description |
|---|---|---|
| `team_match_penalties_won` | integer | Penalties won |
| `team_match_penalties_conceded` | integer | Penalties conceded |
| `team_match_yellow_cards` | integer | Yellow cards (NB: spec description text duplicates the second-yellow wording) |
| `team_match_second_yellow_cards` | integer | Second yellow cards |
| `team_match_red_cards` | integer | Red cards |

## On-Ball Value (for & conceded)

| Column | Type | Description |
|---|---|---|
| `team_match_obv` | double | OBV (net) total, all event types |
| `team_match_obv_pass` | double | OBV from passes |
| `team_match_obv_shot` | double | OBV from shots |
| `team_match_obv_defensive_action` | double | OBV from defensive actions |
| `team_match_obv_dribble_carry` | double | OBV from dribbles and carries |
| `team_match_obv_gk` | double | OBV from goalkeeper actions |
| `team_match_obv_conceded` | double | Opposition OBV total |
| `team_match_obv_pass_conceded` | double | Opposition OBV from passes |
| `team_match_obv_shot_nconceded` | double | Opposition OBV from shots (spec spells it `_nconceded` — documentation typo) |
| `team_match_obv_defensive_action_conceded` | double | Opposition OBV from defensive actions |
| `team_match_obv_dribble_carry_conceded` | double | Opposition OBV from dribbles and carries |
| `team_match_obv_gk_conceded` | double | Opposition OBV from goalkeeper actions |
