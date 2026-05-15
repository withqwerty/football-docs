---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: "5.0.0"
crawled_at: null
---

# StatsBomb Player Match Stats

Pre-computed per-player, per-match metrics as found in StatsBomb-IQ.
**Commercial API only** — not available in Open Data.

- Endpoint: `GET https://data.statsbombservices.com/api/v5/matches/{match_id}/player-stats` (v5)
- Response: JSON array, one object per player who featured in the match.
- Wrappers: `statsbombpy`, `StatsBombR`.

Every metric is for that single match. Counting types are mostly `double`; ratio
types are percentages. See `iq-metrics-glossary.md` for concept definitions and
suffix conventions (`op_`, `np_`, `fhalf_`, `f3_`, `_360`).

## Identity columns

| Column | Type | Description |
|---|---|---|
| `player_id` | integer | The id of the player |
| `player_name` | string | Full name of the player |
| `team_id` | integer | The id of the team |
| `team_name` | string | Full name of the player's team |
| `match_id` | integer | The id of the match |

## Playing time

| Column | Type | Description |
|---|---|---|
| `player_match_minutes` | integer | Minutes played this match |
| `player_match_360_minutes` | float | Minutes played in this match, or 0 if the match has no 360 data (use to scale 360-derived metrics) |
| `player_match_possession` | percentage | How much possession the player has per match |

## Attacking output

| Column | Type | Description |
|---|---|---|
| `player_match_goals` | double | All goals scored (including penalties) |
| `player_match_np_goals` | double | All goals scored, excluding penalties |
| `player_match_np_shots` | double | Number of shots not from penalties |
| `player_match_op_shots` | double | Number of shots from open play |
| `player_match_shots_blocked` | double | Number of shots blocked |
| `player_match_np_shots_on_target` | double | Non-penalty shots on target |
| `player_match_np_xg` | double | Non-penalty xG |
| `player_match_np_xg_per_shot` | double | Non-penalty xG per shot |
| `player_match_np_psxg` | double | Post-shot xG earned from on-target shots |
| `player_match_assists` | double | Number of assists |
| `player_match_op_assists` | double | Open-play assists |
| `player_match_xa` | double | xG assisted |
| `player_match_op_xa` | double | xG assisted from open play |
| `player_match_sp_xa` | double | xG assisted from set pieces |
| `player_match_key_passes` | double | Passes that create shots for teammates ("shot assists"/"chances created") |
| `player_match_op_key_passes` | double | Open-play key passes |
| `player_match_shot_touch_ratio` | percentage | Shots taken as a proportion of touches |
| `player_match_positive_outcome_score` | percentage | How often the player is involved, while on pitch, in sequences resolving with a positive outcome (shot, attacking-half free kick, or corner) |

## Passing

| Column | Type | Description |
|---|---|---|
| `player_match_passes` | double | Attempted passes |
| `player_match_op_passes` | double | Attempted passes in open play |
| `player_match_successful_passes` | double | Successful passes |
| `player_match_passing_ratio` | percentage | % of all passes attempted that were completed |
| `player_match_forward_passes` | double | Forward passes |
| `player_match_backward_passes` | double | Backward passes |
| `player_match_sideways_passes` | double | Sideways passes |
| `player_match_op_f3_passes` | double | Open-play final-third passes |
| `player_match_op_f3_forward_passes` | double | Open-play final-third forward passes |
| `player_match_op_f3_backward_passes` | double | Open-play final-third backward passes |
| `player_match_op_f3_sideways_passes` | double | Open-play final-third sideways passes |
| `player_match_passes_into_box` | double | Successful passes into the box from outside it |
| `player_match_op_passes_into_box` | double | Open-play passes into the box from outside it |
| `player_match_passes_inside_box` | double | Passes completed starting and ending inside the box |
| `player_match_through_balls` | double | Completed passes splitting the defence for a teammate to run onto |
| `player_match_long_balls` | double | Completed long balls |
| `player_match_successful_long_balls` | double | Successful long balls |
| `player_match_long_ball_ratio` | percentage | % of attempted long balls completed |
| `player_match_pressured_long_balls` | double | Clearances/long balls attempted under pressure |
| `player_match_unpressured_long_balls` | double | Long balls played while not under pressure |
| `player_match_crosses` | double | Completed crosses |
| `player_match_successful_crosses` | double | Successful crosses |
| `player_match_crosses_into_box` | double | Crosses into the box |
| `player_match_crossing_ratio` | percentage | % of attempted crosses successful and received by a teammate |
| `player_match_box_cross_ratio` | percentage | % of completed passes into the box that are crosses |
| `player_match_deep_progressions` | double | Passes and dribbles/carries into the opposition final third |
| `player_match_deep_completions` | integer | Successful passes within ~20 m of the opposition goal |
| `player_match_touches` | double | Successful footed touches |
| `player_match_touches_inside_box` | double | Successful footed touches inside the box (including shots) |

## Carrying & dribbling

| Column | Type | Description |
|---|---|---|
| `player_match_dribbles` | double | Successful dribbles past an opponent |
| `player_match_dribbles_faced` | double | Dribbles the player faces |
| `player_match_dribbled_past` | double | Times the player fails a challenge and is dribbled past |
| `player_match_turnovers` | double | Times the player loses the ball via miscontrol or failed dribble |
| `player_match_dispossessions` | double | Times the player loses the ball by getting tackled |

## Defending

| Column | Type | Description |
|---|---|---|
| `player_match_tackles` | double | Successful challenges made |
| `player_match_challenge_ratio` | percentage | % of duels where the player makes a tackle vs getting dribbled past |
| `player_match_interceptions` | double | Interceptions |
| `player_match_ball_recoveries` | integer | Ball recoveries |
| `player_match_fhalf_ball_recoveries` | integer | Ball recoveries in the opposition (final) half |
| `player_match_clearances` | double | Clearances |
| `player_match_aerials` | double | Aerial duels |
| `player_match_successful_aerials` | double | Successful aerials |
| `player_match_aerial_ratio` | percentage | % of aerial duels entered that are won |
| `player_match_blocks_per_shot` | double | Blocks made per shot faced |
| `player_match_aggressive_actions` | double | Tackles, pressures and fouls within 2 s of an opposition ball receipt |
| `player_match_defensive_actions` | integer | Tackles, pressure events and fouls recorded |
| `player_match_fouls` | double | Fouls committed |
| `player_match_fouls_won` | double | Times the player is fouled |
| `player_match_penalties_won` | double | Penalties won |

## Pressing

| Column | Type | Description |
|---|---|---|
| `player_match_pressures` | double | Times the player pressures an opposition player |
| `player_match_pressure_regains` | double | Ball won back within 5 s of the player pressuring |
| `player_match_pressured_action_fails` | double | Opponent actions failed within 5 s of being pressured |
| `player_match_pressure_duration_avg` | double | Average pressure duration |
| `player_match_pressure_duration_total` | double | Total pressure duration |
| `player_match_counterpressures` | double | Counterpressures (pressures within 5 s of a turnover) |
| `player_match_counterpressured_action_fails` | double | Counterpressures attempted that failed |
| `player_match_counterpressure_duration_avg` | double | Average counterpressure duration |
| `player_match_counterpressure_duration_total` | double | Total counterpressure duration |

## Goalkeeping

| Column | Type | Description |
|---|---|---|
| `player_match_goals_conceded` | integer | Goals conceded (excludes penalties and own goals) |
| `player_match_gsaa` | double | Goals saved/conceded vs expectation (post-shot xG faced) |
| `player_match_gsaa_ratio` | percentage | Goals saved above average as a % of shots faced |
| `player_match_save_ratio` | percentage | % of on-target shots saved |
| `player_match_npot_psxg_faced` | double | Non-penalty on-target post-shot xG faced |
| `player_match_npot_shots_faced` | double | Non-penalty on-target shots faced |
| `player_match_penalties_faced` | integer | Penalties faced |
| `player_match_penalties_conceded` | integer | Penalties faced that resulted in goals |
| `player_match_ccaa` | percentage | Claimable Collection Attempts over Average — claim-attempt rate vs average keeper |
| `player_match_claim_success` | percentage | % of claim attempts that succeed |
| `player_match_da_aggressive_distance` | double | Average distance from goal at which the keeper performs defensive actions |
| `player_match_gk_positioning_error` | double | Average distance from the optimal position for facing a shot |

## On-Ball Value

| Column | Type | Description |
|---|---|---|
| `player_match_obv` | double | OBV added (net) total, all event types |
| `player_match_obv_pass` | double | OBV from passes |
| `player_match_obv_shot` | double | OBV from shots |
| `player_match_obv_defensive_action` | double | OBV from defensive actions |
| `player_match_obv_dribble_carry` | double | OBV from dribbles and carries |
| `player_match_obv_gk` | double | OBV from goalkeeper actions |

## xGChain / xGBuildup

| Column | Type | Description |
|---|---|---|
| `player_match_xgchain` | double | xG of the final shot attributed to all players in the possession |
| `player_match_op_xgchain` | double | xGChain in open play |
| `player_match_xgchain_per_possession` | double | xGChain per possession |
| `player_match_op_xgchain_per_possession` | double | Open-play xGChain per possession |
| `player_match_xgbuildup` | double | xGChain excluding the shot and the key pass (build-up only) |
| `player_match_op_xgbuildup` | double | xGBuildup in open play |
| `player_match_xgbuildup_per_possession` | double | xGBuildup per possession |
| `player_match_op_xgbuildup_per_possession` | double | Open-play xGBuildup per possession |

## 360-derived: space received

Only populated for matches with 360 data (`player_match_360_minutes > 0`).

| Column | Type | Description |
|---|---|---|
| `player_match_average_space_received_in` | float | Average value of space for all ball receipts |
| `player_match_average_fhalf_space_received_in` | float | …in the opposition half |
| `player_match_average_f3_space_received_in` | float | …in the final third |
| `player_match_ball_receipts_in_space_2` | integer | % of ball receipts made in >2 m of space |
| `player_match_ball_receipts_in_space_5` | integer | …>5 m (subset of 2 m) |
| `player_match_ball_receipts_in_space_10` | integer | …>10 m (subset of 2 m & 5 m) |
| `player_match_fhalf_ball_receipts_in_space_2` | integer | Opposition-half ball receipts in >2 m |
| `player_match_fhalf_ball_receipts_in_space_5` | integer | …>5 m |
| `player_match_fhalf_ball_receipts_in_space_10` | integer | …>10 m |
| `player_match_f3_ball_receipts_in_space_2` | integer | Final-third ball receipts in >2 m |
| `player_match_f3_ball_receipts_in_space_5` | integer | …>5 m |
| `player_match_f3_ball_receipts_in_space_10` | integer | …>10 m |
| `player_match_ball_receipts_360` | integer | Ball receipts with 360 data |
| `player_match_fhalf_ball_receipts_360` | integer | …in the opposition half |
| `player_match_f3_ball_receipts_360` | integer | …in the final third |
| `player_match_passes_360` | integer | Passes with 360 data |
| `player_match_obv_passes_360` | float | Pass-OBV with 360 data |
| `player_match_fhalf_passes_360` | integer | Opposition-half passes with 360 data |
| `player_match_fhalf_obv_passes_360` | float | Opposition-half pass-OBV with 360 data |
| `player_match_f3_passes_360` | integer | Final-third passes with 360 data |
| `player_match_f3_obv_passes_360` | float | Final-third pass-OBV with 360 data |

## 360-derived: Line-Breaking Passes (LBP)

| Column | Type | Description |
|---|---|---|
| `player_match_lbp` | integer | LBP attempted in open play |
| `player_match_lbp_completed` | integer | LBP completed in open play |
| `player_match_fhalf_lbp` | integer | LBP attempted in the opposition half (open play) |
| `player_match_fhalf_lbp_completed` | integer | LBP completed in the opposition half |
| `player_match_f3_lbp` | integer | LBP attempted in the final third |
| `player_match_f3_lbp_completed` | integer | LBP completed in the final third |
| `player_match_obv_lbp` | float | Pass-OBV from LBPs |
| `player_match_fhalf_obv_lbp` | float | Pass-OBV from LBPs in the opposition half |
| `player_match_f3_obv_lbp` | float | Pass-OBV from LBPs in the final third |
| `player_match_lbp_received` | integer | LBPs received in open play |
| `player_match_fhalf_lbp_received` | integer | LBPs received in the opposition half (some feeds misspell this key as `layer_match_fhalf_lbp_received`) |
| `player_match_f3_lbp_received` | integer | LBPs received in the final third |
| `player_match_lbp_to_space_2` | integer | Completed LBP received in >2 m of space |
| `player_match_lbp_to_space_5` | integer | …>5 m (subset of 2 m) |
| `player_match_lbp_to_space_10` | integer | …>10 m (subset of 2 m & 5 m) |
| `player_match_fhalf_lbp_to_space_2` / `_5` / `_10` | integer | As above, opposition half |
| `player_match_f3_lbp_to_space_2` / `_5` / `_10` | integer | As above, final third |
| `player_match_lbp_to_space_2_received` / `_5_received` / `_10_received` | integer | Received LBP in >2/5/10 m of space |
| `player_match_fhalf_lbp_to_space_{2,5,10}_received` | integer | As above, opposition half |
| `player_match_f3_lbp_to_space_{2,5,10}_received` | integer | As above, final third |
| `player_match_average_lbp_to_space_distance` | float | Average recipient space for all completed LBPs |
| `player_match_fhalf_average_lbp_to_space_distance` | float | …opposition half |
| `player_match_f3_average_lbp_to_space_distance` | float | …final third |
| `player_match_average_lbp_to_space_received_distance` | float | Average recipient space for all received LBPs |
| `player_match_fhalf_average_lbp_to_space_received_distance` | float | …opposition half |
| `player_match_f3_average_lbp_to_space_received_distance` | float | …final third |

The GK suite (`ccaa`, `claim_success`, `da_aggressive_distance`,
`goals_conceded`, `gsaa`, `gsaa_ratio`, `gk_positioning_error`,
`npot_psxg_faced`, `npot_shots_faced`, `save_ratio`,
`positive_outcome_score`) and the 360 space/LBP suite are only present on
feeds collected at the data versions that include them; older matches may omit
them.
