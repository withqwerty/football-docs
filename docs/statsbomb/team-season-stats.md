---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: "2.0.0"
crawled_at: null
---

# StatsBomb Team Season Stats

Pre-computed per-team, per-competition-season metrics as found in
StatsBomb-IQ. **Commercial API only** — not available in Open Data.

- Endpoint: `GET https://data.statsbombservices.com/api/v2/competitions/{competition_id}/seasons/{season_id}/team-stats` (v2)
- Response: JSON array, one object per team in the competition-season.

This is the season analogue of `team-match-stats.md`. Most counting metrics
carry a **`_pg` (per-game)** suffix and most have a `_conceded` mirror. See
`iq-metrics-glossary.md` for concept and suffix definitions.

## Identity & totals

| Column | Type | Description |
|---|---|---|
| `team_id` / `team_name` | integer / string | The team |
| `competition_id` / `competition` | integer / string | Competition id / title |
| `season_id` / `season_name` | integer / string | Season id / description |
| `team_female` | boolean | Female team? |
| `team_season_matches` | integer | Matches for the team this season |
| `team_season_minutes` | double | Total minutes this season |

## Goals & expected goals

| Column | Type | Description |
|---|---|---|
| `team_season_goals_pg` | double | Goals scored (incl. penalties) + opponent own goals, per game |
| `team_season_goals_conceded_pg` | double | Goals conceded (incl. penalties) + own goals, per game |
| `team_season_gd` / `team_season_gd_pg` | double | Goal difference (total / per game, incl. penalties) |
| `team_season_np_gd_pg` | double | Non-penalty goal difference per game |
| `team_season_own_goals_pg` | double | Own goals per game |
| `team_season_opposition_own_goals_pg` | double | Opposition own goals per game |
| `team_season_penalty_goals_pg` | double | Penalties scored per game |
| `team_season_penalty_goals_conceded_pg` | double | Penalty goals conceded per game |
| `team_season_np_xg_pg` | double | npxG per game |
| `team_season_op_xg_pg` | double | Open-play xG per game |
| `team_season_sp_xg_pg` | double | Set-piece xG per game |
| `team_season_np_xg_conceded_pg` | double | npxG conceded per game |
| `team_season_op_xg_conceded_pg` | double | Open-play xG conceded per game |
| `team_season_sp_xg_conceded_pg` | double | Set-piece xG conceded per game |
| `team_season_xgd` / `team_season_xgd_pg` | double | xG minus xG conceded (total / per game, incl. penalties) |
| `team_season_np_xgd_pg` | double | Non-penalty xGD per game |
| `team_season_np_xg_per_shot` | double | npxG per shot |
| `team_season_np_xg_per_shot_conceded` | double | npxG per shot conceded |

## Shots

| Column | Type | Description |
|---|---|---|
| `team_season_np_shots_pg` | double | Non-penalty shots per game |
| `team_season_op_shots_pg` | double | Open-play shots per game |
| `team_season_op_shots_outside_box_pg` | double | Open-play shots from outside the box per game |
| `team_season_sp_shots_pg` | double | Set-piece shots per game |
| `team_season_np_shots_conceded_pg` | double | Non-penalty shots conceded per game |
| `team_season_op_shots_conceded_pg` | double | Open-play shots conceded per game |
| `team_season_op_shots_conceded_outside_box_pg` | double | Open-play shots conceded from outside the box per game |
| `team_season_np_shot_distance` | double | Avg distance of non-penalty shots |
| `team_season_op_shot_distance` | double | Avg distance (open play) |
| `team_season_sp_shot_distance` | double | Avg distance (set piece) |
| `team_season_np_shot_distance_conceded` | double | Avg distance of opponent non-penalty shots |
| `team_season_op_shot_distance_conceded` | double | …open play |
| `team_season_sp_shot_distance_conceded` | double | …set piece |
| `team_season_counter_attacking_shots_pg` | double | Counter-attacking shots per game (possession from own half, <15 s) |
| `team_season_counter_attacking_shots_conceded_pg` | double | Same, conceded |
| `team_season_high_press_shots_pg` | double | High-press shots per game |
| `team_season_high_press_shots_conceded_pg` | double | Same, conceded |
| `team_season_shots_in_clear_pg` | double | Shots with only opponent GK between shooter and goal, per game |
| `team_season_shots_in_clear_conceded_pg` | double | Same, conceded |

## Possession, tempo & build-up

| Column | Type | Description |
|---|---|---|
| `team_season_possession` | percentage | Average possession per match |
| `team_season_possessions` | double | Number of possessions |
| `team_season_directness` | double | Distance towards goal ÷ total build-up distance (shot-ending possessions) |
| `team_season_pace_towards_goal` | double | Avg build-up speed to shot (m/s) |
| `team_season_ball_in_play_time` | double | Avg clock time the ball is in play |
| `team_season_deep_progressions_pg` | double | Passes/dribbles/carries into opposition final third per game |
| `team_season_deep_progressions_conceded_pg` | double | Same, conceded |
| `team_season_deep_completions_pg` | double | Successful passes within ~20 m of opposition goal per game |
| `team_season_deep_completions_conceded_pg` | double | Same, conceded |

## Passing

| Column | Type | Description |
|---|---|---|
| `team_season_passes_pg` | double | Attempted passes per game |
| `team_season_successful_passes_pg` | double | Successful passes per game |
| `team_season_passes_conceded_pg` | double | Opponent attempted passes per game |
| `team_season_successful_passes_conceded_pg` | double | Opponent successful passes per game |
| `team_season_op_passes_pg` | double | Open-play passes attempted per game |
| `team_season_op_passes_conceded_pg` | double | Opponent open-play passes per game |
| `team_season_passing_ratio` | percentage | Passing completion rate |
| `team_season_opp_passing_ratio` | percentage | Opposition passing completion rate |
| `team_season_opp_final_third_pass_ratio` | percentage | Opposition final-third completion rate |
| `team_season_passes_inside_box_pg` | double | Passes completed inside the box per game |
| `team_season_passes_inside_box_conceded_pg` | double | Opponent passes inside the box per game |
| `team_season_crosses_into_box_pg` | double | Crosses into the box per game |
| `team_season_successful_crosses_into_box_pg` | double | Successful crosses into the box per game |
| `team_season_box_cross_ratio` | percentage | % of passes into the box that are crosses |
| `team_season_successful_box_cross_ratio` | percentage | % of completed passes into the box that are crosses |
| `team_season_gk_pass_distance` | double | Avg GK pass length playing out from the back |
| `team_season_gk_long_pass_ratio` | percentage | % of GK long passes completed |

## Dribbling

| Column | Type | Description |
|---|---|---|
| `team_season_completed_dribbles_pg` | double | Dribbles completed by the team per game |
| `team_season_failed_dribbles_pg` | double | Failed dribbles per game |
| `team_season_total_dribbles_pg` | double | Total dribble attempts per game |
| `team_season_dribble_ratio` | percentage | % of dribbles completed |
| `team_season_completed_dribbles_conceded_pg` | double | Opposition dribbles completed per game |
| `team_season_failed_dribbles_conceded_pg` | double | Opposition failed dribbles per game |
| `team_season_total_dribbles_conceded_pg` | double | Total opposition dribble attempts per game |
| `team_season_opposition_dribble_ratio` | percentage | % of opposition dribbles completed |

## Defending & pressing

| Column | Type | Description |
|---|---|---|
| `team_season_ppda` | double | Passes per defensive action (pressing intensity) |
| `team_season_defensive_distance` | double | Avg distance from own goal of defensive actions |
| `team_season_defensive_distance_ppda` | double | Same, restricted to the PPDA definition area |
| `team_season_pressures_pg` | double | Pressures per game |
| `team_season_counterpressures_pg` | double | Counterpressures per game |
| `team_season_pressure_regains_pg` | double | Ball regained within 5 s of a pressure, per game |
| `team_season_counterpressure_regains_pg` | double | Ball won back within 5 s of a counterpressure, per game |
| `team_season_defensive_action_regains_pg` | double | Ball won back within 5 s of any defensive action, per game |
| `team_season_fhalf_pressures_pg` | double | Opposition-half pressures per game |
| `team_season_fhalf_counterpressures_pg` | double | Opposition-half counterpressures per game |
| `team_season_fhalf_pressures_ratio` | percentage | Opposition-half pressures as % of total |
| `team_season_fhalf_counterpressures_ratio` | percentage | Opposition-half counterpressures as % of total |
| `team_season_aggressive_actions_pg` | double | Tackles/pressures/fouls within 2 s of opposition ball receipt, per game |
| `team_season_aggression` | double | Proportion of opponent pass receipts contested within 2 s |

## Set pieces

For `corner`, `free_kick` (indirect), `direct_free_kick`, `throw_in`, and
aggregate `sp`, each per game with a `_conceded` mirror:

| Column pattern | Type | Description |
|---|---|---|
| `team_season_corners_pg` / `_conceded_pg` | double | Corners per game |
| `team_season_corner_xg_pg` / `_conceded_pg` | double | xG from corners per game |
| `team_season_xg_per_corner` / `_conceded` | double | xG per corner |
| `team_season_shots_from_corners_pg` / `_conceded_pg` | double | Shots from corners per game |
| `team_season_goals_from_corners_pg` / `_conceded_pg` | double | Goals from corners per game |
| `team_season_corner_shot_ratio` / `_conceded` | double | Shots per corner |
| `team_season_corner_goal_ratio` / `_conceded` | double | Goals per corner |
| `team_season_free_kicks_pg` / `_conceded_pg` | double | Indirect free kicks per game |
| `team_season_free_kick_xg_pg` / `_conceded_pg` | double | xG from indirect FKs per game |
| `team_season_xg_per_free_kick` / `_conceded` | double | xG per indirect FK |
| `team_season_shots_from_free_kicks_pg` / `_conceded_pg` | double | Shots from indirect FKs per game |
| `team_season_goals_from_free_kicks_pg` / `_conceded_pg` | double | Goals from indirect FKs per game |
| `team_season_free_kick_shot_ratio` / `_conceded` | double | Shots per indirect FK |
| `team_season_free_kick_goal_ratio` / `_conceded` | double | Goals per indirect FK |
| `team_season_direct_free_kicks_pg` / `_conceded_pg` | double | Direct FK shots & situations per game |
| `team_season_direct_free_kick_xg_pg` / `_conceded_pg` | double | xG from direct FK situations per game |
| `team_season_xg_per_direct_free_kick` / `_conceded` | double | xG per direct FK |
| `team_season_shots_from_direct_free_kicks_pg` / `_conceded_pg` | double | Shots from direct FKs per game |
| `team_season_direct_free_kick_goals_pg` / `_conceded_pg` | double | Goals from direct FKs per game |
| `team_season_direct_free_kick_shot_ratio` / `_conceded` | double | Shots per direct FK |
| `team_season_direct_free_kick_goal_ratio` / `_conceded` | double | Goals per direct FK |
| `team_season_throw_ins_pg` / `_conceded_pg` | double | Throw-ins per game |
| `team_season_throw_in_xg_pg` / `_conceded_pg` | double | xG from throw-ins per game |
| `team_season_xg_per_throw_in` / `_conceded` | double | xG per throw-in |
| `team_season_shots_from_throw_ins_pg` / `_conceded_pg` | double | Shots from throw-ins per game |
| `team_season_goals_from_throw_ins_pg` / `_conceded_pg` | double | Goals from throw-ins per game |
| `team_season_throw_in_shot_ratio` / `_conceded` | double | Shots per throw-in |
| `team_season_throw_in_goal_ratio` / `_conceded` | double | Goals per throw-in |
| `team_season_sp_pg` / `_pg_conceded` | double | Set pieces per game |
| `team_season_sp_shots_pg` / `_conceded_pg` | double | Set-piece shots per game |
| `team_season_xg_per_sp` / `_conceded` | double | xG per set piece |
| `team_season_sp_shot_ratio` / `_conceded` | double | Shots per set piece |
| `team_season_sp_goals_pg` / `_pg_conceded` | double | Set-piece goals per game |
| `team_season_sp_goal_ratio` / `_conceded` | double | Goals per set piece |

## Penalties & discipline

| Column | Type | Description |
|---|---|---|
| `team_season_penalties_won_pg` | double | Penalties won per game |
| `team_season_penalties_conceded_pg` | double | Penalties conceded per game |
| `team_season_yellow_cards_pg` | double | Yellow cards per game |
| `team_season_second_yellow_cards_pg` | double | Second yellow cards per game |
| `team_season_red_cards_pg` | double | Red cards per game |

## On-Ball Value (for & conceded), per game

| Column | Type | Description |
|---|---|---|
| `team_season_obv_pg` | double | OBV (net) total per game |
| `team_season_obv_pass_pg` | double | OBV from passes per game |
| `team_season_obv_shot_pg` | double | OBV from shots per game |
| `team_season_obv_defensive_action_pg` | double | OBV from defensive actions per game |
| `team_season_obv_dribble_carry_pg` | double | OBV from dribbles and carries per game |
| `team_season_obv_gk_pg` | double | OBV from goalkeeper actions per game |
| `team_season_obv_conceded_pg` | double | Opposition OBV total per game |
| `team_season_obv_pass_conceded_pg` | double | Opposition OBV from passes per game |
| `team_season_obv_shot_conceded_pg` | double | Opposition OBV from shots per game |
| `team_season_obv_defensive_action_conceded_pg` | double | Opposition OBV from defensive actions per game |
| `team_season_obv_dribble_carry_conceded_pg` | double | Opposition OBV from dribbles and carries per game |
| `team_season_obv_gk_conceded_pg` | double | Opposition OBV from goalkeeper actions per game |
