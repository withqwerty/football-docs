---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: "4.0.0"
crawled_at: null
---

# StatsBomb Player Season Stats

Pre-computed per-player, per-competition-season metrics as found in
StatsBomb-IQ. **Commercial API only** — not available in Open Data.

- Endpoint: `GET https://data.statsbombservices.com/api/v4/competitions/{competition_id}/seasons/{season_id}/player-stats` (v4)
- Response: JSON array, one object per player in the competition-season.

See `iq-metrics-glossary.md` for concept definitions. This is the season analogue
of `player-match-stats.md`; most metrics carry a **`_90` (per-90)** suffix.

## Per-90 and the 360-minutes gotcha

`player_season_minutes` is the total minutes played, used to convert every
standard `_90` metric to/from a season total. **360-derived metrics
(space/LBP/`*_360`) must instead be scaled with `player_season_360_minutes`**,
which counts only minutes in matches that have 360 data. Using
`player_season_minutes` for 360 metrics will under/over-state them whenever the
competition has partial 360 coverage.

## Identity, profile & appearances

| Column | Type | Description |
|---|---|---|
| `player_id` | integer | Player id |
| `player_name` | string | Full name |
| `team_id` / `team_name` | integer / string | Team id / name |
| `competition_id` / `competition_name` | integer / string | Competition id / title |
| `season_id` / `season_name` | integer / string | Season id / description (e.g. "2020/2021") |
| `country_id` | integer | Country the competition-season was in |
| `birth_date` | date | Player date of birth |
| `player_female` | boolean | Whether the player plays in a female team |
| `player_weight` | double | Weight (kg) |
| `player_height` | integer | Height (cm) |
| `primary_position` | integer | Primary position id |
| `secondary_position` | integer | Secondary position id |
| `player_season_minutes` | integer | Total minutes this season (scales standard `_90`) |
| `player_season_360_minutes` | float | Minutes in matches with 360 data (scales 360-derived `_90`) |
| `player_season_90s_played` | integer | Number of 90s played |
| `player_season_appearances` | double | Matches participated in on-pitch (starts + sub appearances) |
| `player_season_starting_appearances` | double | Number of starts |
| `player_season_average_minutes` | double | Average minutes per match |
| `player_season_most_recent_match` | integer | Id of the most recent match |

## Attacking output (per 90 unless noted)

| Column | Type | Description |
|---|---|---|
| `player_season_goals_90` | double | All goals (incl. penalties) |
| `player_season_npg_90` | double | Goals excluding penalties |
| `player_season_np_shots_90` | double | Non-penalty shots |
| `player_season_np_xg_90` | double | Non-penalty xG produced |
| `player_season_np_xg_per_shot` | double | Average npxG per shot (shot quality) |
| `player_season_np_psxg_90` | double | Post-shot xG earned from on-target shots |
| `player_season_npxgxa_90` | double | Non-penalty xG + xA combined |
| `player_season_npga_90` | double | Non-penalty goals + assists |
| `player_season_assists_90` | double | Assists |
| `player_season_op_assists_90` | double | Open-play assists |
| `player_season_xa_90` | double | xG assisted (from the assisted shot's xG) |
| `player_season_op_xa_90` | double | xA from open play |
| `player_season_sp_xa_90` | double | xA from set pieces |
| `player_season_key_passes_90` | double | Shot-creating passes |
| `player_season_op_key_passes_90` | double | Open-play key passes |
| `player_season_sp_key_passes_90` | double | Set-piece key passes |
| `player_season_sp_assists_90` | double | Set-piece assists |
| `player_season_shots_key_passes_90` | double | Non-penalty shots + key passes |
| `player_season_conversion_ratio` | percentage | % of non-penalty shots converted |
| `player_season_penalty_conversion_ratio` | percentage | % of penalty shots converted |
| `player_season_shot_on_target_ratio` | percentage | % of total shots on target (incl. goals, saved, cleared off line) |
| `player_season_shot_touch_ratio` | percentage | Shots as a proportion of touches |
| `player_season_over_under_performance_90` | double | Actual goal contribution minus xG+xA |
| `player_season_positive_outcome_90` | double | Possessions through the player ending in shot/attacking-half FK/corner |
| `player_season_positive_outcome_score` | percentage | Frequency of involvement in positive-outcome sequences |

## Passing

| Column | Type | Description |
|---|---|---|
| `player_season_op_passes_90` | double | Attempted open-play passes |
| `player_season_passing_ratio` | percentage | % of all passes completed |
| `player_season_pressured_passing_ratio` | percentage | % of pressured passes completed |
| `player_season_passes_pressed_ratio` | percentage | Proportion of passes made under opponent pressure |
| `player_season_change_in_passing_ratio` | percentage | Pressured pass % minus pass % |
| `player_season_forward_pass_proportion` | percentage | Proportion of passes angled forwards (arc 11π/6→π/6) |
| `player_season_backward_pass_proportion` | percentage | Proportion angled backwards (arc 5π/6→7π/6) |
| `player_season_sideways_pass_proportion` | percentage | Proportion angled sideways (remaining arcs) |
| `player_season_op_f3_forward_pass_proportion` | percentage | Final-third forward-pass proportion |
| `player_season_op_f3_backward_pass_proportion` | percentage | Final-third backward-pass proportion |
| `player_season_op_f3_sideways_pass_proportion` | percentage | Final-third sideways-pass proportion |
| `player_season_op_f3_passes_90` | double | Successful open-play final-third passes |
| `player_season_passes_into_box_90` | double | Successful passes into the box from outside |
| `player_season_op_passes_into_box_90` | double | Open-play passes into the box |
| `player_season_op_passes_into_and_touches_inside_box_90` | double | Open-play passes into box + touches inside box |
| `player_season_passes_inside_box_90` | double | Passes completed inside the box |
| `player_season_sp_passes_into_box_90` | double | Passes into the box from a set piece |
| `player_season_through_balls_90` | double | Defence-splitting passes |
| `player_season_long_balls_90` | double | Completed long balls |
| `player_season_long_ball_ratio` | percentage | % of attempted long balls completed |
| `player_season_pressured_long_balls_90` | double | Clearances/long balls under pressure |
| `player_season_unpressured_long_balls_90` | double | Long balls not under pressure |
| `player_season_crosses_90` | double | Completed crosses |
| `player_season_crossing_ratio` | percentage | % of crosses successful & received |
| `player_season_box_cross_ratio` | percentage | % of completed passes into box that are crosses |
| `player_season_deep_progressions_90` | double | Passes/dribbles/carries into opposition final third |
| `player_season_deep_completions_90` | double | Successful passes within ~20 m of opposition goal |
| `player_season_touches_inside_box_90` | double | Footed touches inside the box (incl. shots) |
| `player_season_pass_length` | double | Average pass length |
| `player_season_s_pass_length` | double | Average length of completed passes |
| `player_season_p_pass_length` | double | Average pass length under pressure |
| `player_season_ps_pass_length` | double | Length of successful passes under pressure |
| `player_season_pass_length_ratio` | double | Completed pass length ÷ pass length |
| `player_season_pressured_pass_length_ratio` | percentage | Same ratio for pressured passes |
| `player_season_pressured_change_in_pass_length` | double | Pressured pass length minus pass length |
| `player_season_pass_into_pressure_ratio` | percentage | % of passes whose recipient was under pressure |
| `player_season_pass_into_danger_ratio` | percentage | % of passes whose recipient was pressured or next engaged in a defensive action |
| `player_season_left_foot_ratio` | percentage | Proportion of footed passes with left foot (>60% ≈ left-footed, <40% ≈ right-footed) |

## Carrying & dribbling

| Column | Type | Description |
|---|---|---|
| `player_season_carries_90` | double | Carries (moving with the ball) |
| `player_season_carry_length` | double | Average carry length |
| `player_season_carry_ratio` | percentage | % of carries successful |
| `player_season_dribbles_90` | double | Successful dribbles past an opponent |
| `player_season_total_dribbles_90` | double | All attempts to beat an opponent |
| `player_season_failed_dribbles_90` | double | Unsuccessful dribbles |
| `player_season_dribble_ratio` | percentage | % of dribbles successful |
| `player_season_dribbled_past_90` | double | Times the player is dribbled past |
| `player_season_dribble_faced_ratio` | percentage | % of faced dribbles stopped |
| `player_season_turnovers_90` | double | Ball lost via miscontrol or failed dribble |
| `player_season_dispossessions_90` | double | Ball lost by getting tackled |

## Defending

| Column | Type | Description |
|---|---|---|
| `player_season_tackles_90` | double | Successful challenges |
| `player_season_challenge_ratio` | percentage | % of duels where a tackle is made vs being dribbled past |
| `player_season_interceptions_90` | double | Interceptions |
| `player_season_tackles_and_interceptions_90` | double | Tackles + interceptions |
| `player_season_ball_recoveries_90` | double | Ball recoveries |
| `player_season_fhalf_ball_recoveries_90` | double | Ball recoveries in opposition half |
| `player_season_clearance_90` | double | Clearances |
| `player_season_aerial_wins_90` | double | Aerial duels won |
| `player_season_aerial_ratio` | percentage | % of aerial duels won |
| `player_season_blocks_per_shot` | double | Blocks per shot faced |
| `player_season_aggressive_actions_90` | double | Tackles/pressures/fouls within 2 s of opposition ball receipt |
| `player_season_defensive_action_90` | float | Tackles, pressure events and fouls per 90 |
| `player_season_defensive_action_regains_90` | double | Team won ball back within 5 s of the player's defensive action |
| `player_season_errors_90` | double | On-ball mistakes leading to a shot |
| `player_season_fouls_90` | double | Fouls committed |
| `player_season_fouls_won_90` | double | Times fouled |
| `player_season_penalty_wins_90` | double | Penalties won |
| `player_season_padj_clearances_90` | double | Possession-adjusted clearances |
| `player_season_padj_interceptions_90` | double | Possession-adjusted interceptions |
| `player_season_padj_pressures_90` | double | Possession-adjusted pressures |
| `player_season_padj_tackles_90` | double | Possession-adjusted tackles |
| `player_season_padj_tackles_and_interceptions_90` | double | Possession-adjusted tackles + interceptions |
| `player_season_average_x_defensive_action` | double | Avg distance from goal line of successful defensive actions (x-axis 0–100) |
| `player_season_average_x_pass` | double | Avg distance from goal line of successful passes (0–100) |
| `player_season_average_x_pressure` | double | Avg distance from goal line of pressures (0–100) |

## Pressing

| Column | Type | Description |
|---|---|---|
| `player_season_pressures_90` | double | Pressures applied |
| `player_season_pressure_regains_90` | double | Ball won back within 5 s of pressuring |
| `player_season_counterpressures_90` | double | Counterpressures (within 5 s of a turnover) |
| `player_season_counterpressure_regains_90` | double | Ball won back within 5 s of counterpressuring |
| `player_season_fhalf_pressures_90` | double | Pressures in the opposition half |
| `player_season_fhalf_pressures_ratio` | percentage | Opposition-half pressures as % of total |
| `player_season_fhalf_counterpressures_90` | double | Counterpressures in the opposition half |
| `player_season_fhalf_counterpressures_ratio` | percentage | Opposition-half counterpressures as % of total |

## Goalkeeping

| Column | Type | Description |
|---|---|---|
| `player_season_goals_faced_90` | double | Goals conceded by the keeper |
| `player_season_gsaa_90` | double | Goals saved/conceded vs expectation (season prevention) |
| `player_season_gsaa_ratio` | percentage | Goals saved above average as % of shots faced |
| `player_season_save_ratio` | percentage | % of on-target shots saved |
| `player_season_shots_faced_90` | double | All shots faced (incl. off-target) |
| `player_season_ot_shots_faced_90` | double | On-target shots faced |
| `player_season_ot_shots_faced_ratio` | percentage | % of shots faced that were on target |
| `player_season_np_psxg_faced_90` | double | Post-shot xG faced |
| `player_season_np_xg_faced_90` | double | Total npxG from all non-penalty shots faced (incl. off target) |
| `player_season_npot_psxg_faced_90` | double | Non-penalty on-target PSxG faced |
| `player_season_xs_ratio` | percentage | Expected save % given PSxG of shots faced |
| `player_season_clcaa` | percentage | Claimable Collection Attempts over Average |
| `player_season_da_aggressive_distance` | double | Avg distance from goal of keeper defensive actions |
| `player_season_np_optimal_gk_dlength` | double | Avg distance from the modelled optimal shot-facing position |
| `player_season_penalties_faced_90` | double | Penalties faced |
| `player_season_penalties_conceded_90` | double | Penalties faced that resulted in goals |

## On-Ball Value, xGChain / xGBuildup

| Column | Type | Description |
|---|---|---|
| `player_season_obv_90` | double | OBV (net) total, all event types |
| `player_season_obv_pass_90` | double | OBV from passes |
| `player_season_obv_shot_90` | double | OBV from shots |
| `player_season_obv_defensive_action_90` | double | OBV from defensive actions |
| `player_season_obv_dribble_carry_90` | double | OBV from dribbles and carries |
| `player_season_obv_gk_90` | double | OBV from goalkeeper actions |
| `player_season_xgchain` / `_90` | double | xGChain (season total / per 90) |
| `player_season_op_xgchain` / `_90` | double | Open-play xGChain |
| `player_season_xgchain_per_possession` | double | xGChain per possession |
| `player_season_op_xgchain_per_possession` | double | Open-play xGChain per possession |
| `player_season_xgbuildup` / `_90` | double | xGBuildup (excludes shot + key pass) |
| `player_season_op_xgbuildup` / `_90` | double | Open-play xGBuildup |
| `player_season_xgbuildup_per_possession` | double | xGBuildup per possession |
| `player_season_op_xgbuildup_per_possession` | double | Open-play xGBuildup per possession |

## Discipline

| Column | Type | Description |
|---|---|---|
| `player_season_yellow_cards_90` | double | Yellow cards |
| `player_season_second_yellow_cards_90` | double | Second yellows |
| `player_season_red_cards_90` | double | Red cards |

## 360-derived: space & Line-Breaking Passes

Scale these with `player_season_360_minutes`, not `player_season_minutes`.

| Column | Type | Description |
|---|---|---|
| `player_season_average_space_received_in` | float | Average space for all ball receipts |
| `player_season_average_fhalf_space_received_in` | float | …opposition half |
| `player_season_average_f3_space_received_in` | float | …final third |
| `player_season_ball_receipts_in_space_2_ratio` | float | % of ball receipts in >2 m of space |
| `player_season_ball_receipts_in_space_5_ratio` | float | …>5 m (subset of 2 m) |
| `player_season_ball_receipts_in_space_10_ratio` | float | …>10 m (subset of 2 m & 5 m) |
| `player_season_fhalf_ball_receipts_in_space_{2,5,10}_ratio` | float | As above, opposition half |
| `player_season_f3_ball_receipts_in_space_{2,5,10}_ratio` | float | As above, final third |
| `player_season_lbp_90` | float | LBP attempted (open play) |
| `player_season_lbp_completed_90` | float | LBP completed (open play) |
| `player_season_lbp_ratio` | float | % of LBPs successful |
| `player_season_lbp_pass_ratio` | float | % of passes that were line-breaking |
| `player_season_fhalf_lbp_90` / `_completed_90` / `_ratio` / `_pass_ratio` | float | LBP suite, opposition half |
| `player_season_f3_lbp_90` / `_completed_90` / `_ratio` / `_pass_ratio` | float | LBP suite, final third |
| `player_season_obv_lbp_90` | float | Pass-OBV from LBPs |
| `player_season_fhalf_obv_lbp_90` / `player_season_f3_obv_lbp_90` | float | …opposition half / final third |
| `player_season_lbp_received_90` | float | LBPs received (open play) |
| `player_season_fhalf_lbp_received_90` / `player_season_f3_lbp_received_90` | float | …opposition half / final third |
| `player_season_lbp_to_space_{2,5,10}_90` | float | Completed LBP received in >2/5/10 m of space |
| `player_season_fhalf_lbp_to_space_{2,5,10}_90` | float | As above, opposition half |
| `player_season_f3_lbp_to_space_{2,5,10}_90` | float | As above, final third |
| `player_season_lbp_to_space_{2,5,10}_received_90` | float | Received LBP in >2/5/10 m of space |
| `player_season_fhalf_lbp_to_space_{2,5,10}_received_90` | float | As above, opposition half |
| `player_season_f3_lbp_to_space_{2,5,10}_received_90` | float | As above, final third |
| `player_season_average_lbp_to_space_distance` | float | Avg recipient space, completed LBPs |
| `player_season_fhalf_average_lbp_to_space_distance` / `_f3_*` | float | …opposition half / final third |
| `player_season_average_lbp_to_space_received_distance` | float | Avg recipient space, received LBPs |
| `player_season_fhalf_average_lbp_to_space_received_distance` / `_f3_*` | float | …opposition half / final third |

The 360 space/LBP suite is only populated for matches that have 360 data;
scale it with `player_season_360_minutes` as described above. Older
competition-seasons may omit the 360 suite entirely.
