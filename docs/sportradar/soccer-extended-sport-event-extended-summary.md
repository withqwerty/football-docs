---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-extended-summary
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.197Z
---
# Sport Event Extended Summary

**Soccer Extended Sport Event Summary** provides real-time match-level statistics for a given match. "Extended" data includes player and team stats by period and **100+** unique data points.<br><br>Data will only be returned for matches covered with "Extended" data. A match will have `extended_player_stats="true"` if this is available.

  ### Update Frequency

  1s Time To Live / Cache

> 📘 Tracking a Single Match
>
> Learn how to use the Sport Event Extended Summary for deeper match statistics in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

***

## Data Points

### Period Stats (Player)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `number` | `period` | Integer | Period number |
| `assists` | `period` - `player` - `statistics` | Integer | Player assists for a period |
| `braces` | `period` - `player` - `statistics` | Integer | Player braces for a period<br /><br />_braces_ - a player has scored 2 goals in the same match |
| `cards_given` | `period` - `player` - `statistics` | Integer | Player cards given for a period |
| `chances_created` | `period` - `player` - `statistics` | Integer | Player chances created for a period |
| `clearances` | `period` - `player` - `statistics` | Integer | Player clearances for a period |
| `corner_kicks` | `period` - `player` - `statistics` | Integer | Player corner kicks for a period |
| `crosses_claimed` | `period` - `player` - `statistics` | Integer | Number of crosses a goalkeeper claimed for a period<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i> |
| `crosses_excluding_corners` | `period` - `player` - `statistics` | Integer | Number of crosses for a player in a period, excluding corner kicks |
| `crosses_successful` | `period` - `player` - `statistics` | Integer | Number of successful crosses for a player in a period |
| `crosses_successful_excluding_corners` | `period` - `player` - `statistics` | Integer | Number of successful crosses for a player in a period, excluding corner kicks |
| `crosses_total` | `period` - `player` - `statistics` | Integer | Number of total crosses for a player in a period |
| `crosses_unsuccessful` | `period` - `player` - `statistics` | Integer | Number of unsuccessful crosses for a player in a period |
| `defensive_blocks` | `period` - `player` - `statistics` | Integer | Player defensive blocks for a period |
| `diving_saves` | `period` - `player` - `statistics` | Integer | Player diving saves for a period |
| `dribbles` | `period` - `player` - `statistics` | Integer | Total number of player dribbles in a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_completed` | `period` - `player` - `statistics` | Integer | Player dribbles completed for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful` | `period` - `player` - `statistics` | Integer | Player dribbles completed for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful_percentage` | `period` - `player` - `statistics` | Double | Player successful dribbles percentage for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_unsuccessful` | `period` - `player` - `statistics` | Integer | Player unsuccessful dribbles for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `fouls_committed` | `period` - `player` - `statistics` | Integer | Player fouls committed for a period |
| `fouls_suffered_final_third` | `period` - `player` - `statistics` | Integer | Total number of fouls a player received in a period in the attacking third, resulting in a dangerous set piece |
| `four_goals_or_more` | `period` - `player` - `statistics` | Integer | A player has scored 4 goals or more in a single match |
| `free_kicks_scored` | `period` - `player` - `statistics` | Integer | Player free kicks scored for a period |
| `goal_involvements` | `period` - `player` - `statistics` | Integer | Player goal involvements (goals + assists) for a period |
| `goals_by_head` | `period` - `player` - `statistics` | Integer | Player goals by head for a period |
| `goals_by_penalty` | `period` - `player` - `statistics` | Integer | Player goals by penalty for a period |
| `goals_conceded` | `period` - `player` - `statistics` | Integer | Player goals conceded for a period |
| `goals_counter_attack` | `period` - `player` - `statistics` | Integer | Player goals scored as a result of a counter attack in a period |
| `goals_excluding_penalties` | `period` - `player` - `statistics` | Integer | Player goals scored from methods other than penalty kicks in a period |
| `goals_expected` | `period` - `player` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots taken |
| `goals_expected_created` | `period` - `player` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots created (assisted chances) |
| `goals_inside_box` | `period` - `player` - `statistics` | Integer | Player goals scored from inside the penalty area in a period |
| `goals_left_footed` | `period` - `player` - `statistics` | Integer | Player goals scored with the left foot in a period |
| `goals_lower_center` | `period` - `player` - `statistics` | Integer | Player goals scored in the lower center of the goalface in a period |
| `goals_lower_left` | `period` - `player` - `statistics` | Integer | Player goals scored in the lower left corner of the goalface in a period |
| `goals_lower_right` | `period` - `player` - `statistics` | Integer | Player goals scored in the lower right corner of the goalface in a period |
| `goals_open_play` | `period` - `player` - `statistics` | Integer | Player goals scored in open play in a period |
| `goals_outside_box` | `period` - `player` - `statistics` | Integer | Player goals scored from outside the penalty area in a period |
| `goals_right_footed` | `period` - `player` - `statistics` | Integer | Player goals scored with the right foot in a period |
| `goals_scored` | `period` - `player` - `statistics` | Integer | Player goals scored for a period |
| `goals_set_piece` | `period` - `player` - `statistics` | Integer | Player goals scored as a result of a set piece in a period |
| `goals_top_center` | `period` - `player` - `statistics` | Integer | Player goals scored in the top center of the goalface in a period |
| `goals_top_left` | `period` - `player` - `statistics` | Integer | Player goals scored in the top left corner of the goalface in a period |
| `goals_top_right` | `period` - `player` - `statistics` | Integer | Player goals scored in the top right corner of the goalface in a period |
| `grade` | `period` - `player` - `statistics` | String | A score calculated on a player's actions during a match |
| `hat_tricks` | `period` - `player` - `statistics` | Integer | A player has scored 3 goals in a single match |
| `injuries` | `period` - `player` - `statistics` | Integer | Player injuries for a period |
| `interceptions` | `period` - `player` - `statistics` | Integer | Player interceptions for a period |
| `interceptions_defensive_third` | `period` - `player` - `statistics` | Integer | Player interceptions in the defensive third in a period |
| `interceptions_final_third` | `period` - `player` - `statistics` | Integer | Player interceptions in the final third in a period |
| `interceptions_inside_box` | `period` - `player` - `statistics` | Integer | Player interceptions in their own penalty area in a period |
| `interceptions_middle_third` | `period` - `player` - `statistics` | Integer | Player interceptions in the middle third in a period |
| `interceptions_opposition_half` | `period` - `player` - `statistics` | Integer | Player interceptions in the attacking team's half in a period |
| `interceptions_own_half` | `period` - `player` - `statistics` | Integer | Player interceptions in the defending team's half in a period |
| `involvements_in_shots_off_target` | `period` - `player` - `statistics` | Integer | Player actions that resulted in a shot off target in a period. The player may have assisted or taken the shot. |
| `involvements_in_shots_off_target_goals_expected` | `period` - `player` - `statistics` | Double | The xG of a player's involvement in shots off target in a period. The player may have assisted or taken the shot. |
| `involvements_in_shots_on_target` | `period` - `player` - `statistics` | Integer | Player actions that resulted in a shot on target in a period. The player may have assisted or taken the shot. |
| `involvements_in_shots_on_target_goals_expected` | `period` - `player` - `statistics` | Double | The xG of a player's involvement in shots on target in a period. The player may have assisted or taken the shot. |
| `long_passes_successful` | `period` - `player` - `statistics` | Integer | Player successful long passes for a period |
| `long_passes_total` | `period` - `player` - `statistics` | Integer | Player total long passes for a period |
| `long_passes_unsuccessful` | `period` - `player` - `statistics` | Integer | Player unsuccessful long passes for a period |
| `loss_of_possession` | `period` - `player` - `statistics` | Integer | Player possession losses for a period |
| `minutes_played` | `period` - `player` - `statistics` | Integer | Player minutes played for a period |
| `offsides` | `period` - `player` - `statistics` | Integer | Player offsides for a period |
| `own_goals` | `period` - `player` - `statistics` | Integer | Player own goals for a period |
| `passes_backward_successful` | `period` - `player` - `statistics` | Integer | Player passes in a period that were successful after the ball was moved backwards |
| `passes_center` | `period` - `player` - `statistics` | Integer | Player passes in a period taken from the center of the pitch |
| `passes_forward_successful` | `period` - `player` - `statistics` | Integer | Player successful passes in a period after the ball was moved forwards |
| `passes_in_final_third` | `period` - `player` - `statistics` | Integer | Player passes in a period taken from the opposition territory |
| `passes_in_final_third_successful` | `period` - `player` - `statistics` | Integer | Player successful passes in a period taken from the opposition territory |
| `passes_into_box` | `period` - `player` - `statistics` | Integer | Player passes in a period where the receiving player was positioned inside the opponent's box |
| `passes_left` | `period` - `player` - `statistics` | Integer | Player passes in a period taken from the left-hand side of the pitch |
| `passes_opponent_half` | `period` - `player` - `statistics` | Integer | Player passes in a period taken in the opposition half |
| `passes_opponent_half_successful` | `period` - `player` - `statistics` | Integer | Player successful passes in a period taken in the opposition half |
| `passes_own_half` | `period` - `player` - `statistics` | Integer | Player passes in a period taken in their own half |
| `passes_own_half_successful` | `period` - `player` - `statistics` | Integer | Player successful passes in a period taken in their own half |
| `passes_right` | `period` - `player` - `statistics` | Integer | Player passes in a period taken from the right-hand side of the pitch |
| `passes_successful` | `period` - `player` - `statistics` | Integer | Player successful passes for a period |
| `passes_successful_percentage` | `period` - `player` - `statistics` | Double | Player successful pass percentage for a period |
| `passes_total` | `period` - `player` - `statistics` | Integer | Player total passes for a period |
| `passes_unsuccessful` | `period` - `player` - `statistics` | Integer | Player unsuccessful passes for a period |
| `penalties_conceded` | `period` - `player` - `statistics` | Integer | Player penalty shots conceded for a period |
| `penalties_faced` | `period` - `player` - `statistics` | Integer | Player penalty shots faced for a period |
| `penalties_missed` | `period` - `player` - `statistics` | Integer | Player penalty shots missed for a period |
| `penalties_saved` | `period` - `player` - `statistics` | Integer | Player penalty shots saved for a period |
| `possessions_regained_in_defensive_third` | `period` - `player` - `statistics` | Integer | Player tackles or interceptions in their defensive third of the pitch for a period |
| `possessions_regained_in_final_third` | `period` - `player` - `statistics` | Integer | Player tackles or interceptions in the opposition's territory of the pitch for a period |
| `possessions_regained_in_middle_third` | `period` - `player` - `statistics` | Integer | Player tackles or interceptions in the middle third of the pitch for a period |
| `possessions_regained_in_opponent_half` | `period` - `player` - `statistics` | Integer | Player tackles or interceptions in the opponent's half for a period |
| `possessions_regained_in_own_half` | `period` - `player` - `statistics` | Integer | Player tackles or interceptions in the player's own half for a period |
| `red_cards` | `period` - `player` - `statistics` | Integer | Player red cards for a period |
| `saves_inside_box` | `period` - `player` - `statistics` | Integer | Player shots saved that were taken from inside the box for a period |
| `saves_lower_center` | `period` - `player` - `statistics` | Integer | Player shots saved in the lower center of the goal for a period |
| `saves_lower_left` | `period` - `player` - `statistics` | Integer | Player shots saved in the lower left corner of the goal for a period |
| `saves_lower_right` | `period` - `player` - `statistics` | Integer | Player shots saved in the lower right corner of the goal for a period |
| `saves_outside_box` | `period` - `player` - `statistics` | Integer | Player shots saved that were taken from outside the box for a period |
| `saves_top_center` | `period` - `player` - `statistics` | Integer | Player shots saved in the upper center of the goal for a period |
| `saves_top_left` | `period` - `player` - `statistics` | Integer | Player shots saved in the upper left corner of the goal for a period |
| `saves_top_right` | `period` - `player` - `statistics` | Integer | Player shots saved in the upper right corner of the goal for a period |
| `shootout_penalties_faced` | `period` - `player` - `statistics` | Integer | Penalties faced during a penalty shootout in a period |
| `shootout_penalties_missed` | `period` - `player` - `statistics` | Integer | Penalties missed during a penalty shootout in a period |
| `shootout_penalties_saved` | `period` - `player` - `statistics` | Integer | Penalties saved during a penalty shootout in a period |
| `shootout_penalties_scored` | `period` - `player` - `statistics` | Integer | Penalties scored during a penalty shootout in a period |
| `shots` | `period` - `player` - `statistics` | Integer | Player total shots taken for a period |
| `shots_blocked` | `period` - `player` - `statistics` | Integer | Player shots blocked for a period |
| `shots_center` | `period` - `player` - `statistics` | Integer | Player shots taken from the centre of the pitch for a period |
| `shots_counter_attack` | `period` - `player` - `statistics` | Integer | Player shots that came from a counter attack for a period |
| `shots_direct_free_kicks` | `period` - `player` - `statistics` | Integer | Player shots taken directly from a free kick for a period |
| `shots_excluding_blocks` | `period` - `player` - `statistics` | Double | Player shots for a period, excluding blocked shots |
| `shots_faced_saved` | `period` - `player` - `statistics` | Integer | Player shots saved for a period |
| `shots_faced_total` | `period` - `player` - `statistics` | Integer | Total number of shots that a goalkeeper faced for a period |
| `shots_headed` | `period` - `player` - `statistics` | Integer | Player shots taken by header for a period |
| `shots_headed_off_target` | `period` - `player` - `statistics` | Integer | Player header shots that missed the target for a period |
| `shots_headed_on_target` | `period` - `player` - `statistics` | Integer | Player header shots that hit the target for a period |
| `shots_headed_woodwork` | `period` - `player` - `statistics` | Integer | Player header shots that hit the bar or post for a period |
| `shots_hit_woodwork` | `period` - `player` - `statistics` | Integer | Player shots that hit the bar or post for a period |
| `shots_inside_box` | `period` - `player` - `statistics` | Integer | Player shots taken from inside the box for a period |
| `shots_inside_box_center` | `period` - `player` - `statistics` | Integer | Player shots taken from the centre of the pitch, inside the box for a period |
| `shots_inside_box_left` | `period` - `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch, inside the box for a period |
| `shots_inside_box_on_target` | `period` - `player` - `statistics` | Integer | Player on-target shots taken from inside the box for a period |
| `shots_inside_box_on_target_percentage` | `period` - `player` - `statistics` | Double | Player on-target shot percentage from inside the box for a period |
| `shots_inside_box_right` | `period` - `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch, inside the box for a period |
| `shots_left` | `period` - `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch for a period |
| `shots_left_footed` | `period` - `player` - `statistics` | Integer | Player shots taken with the left foot for a period |
| `shots_left_footed_off_target` | `period` - `player` - `statistics` | Integer | Player shots off target taken with the left foot for a period |
| `shots_left_footed_on_target` | `period` - `player` - `statistics` | Integer | Player shots on target taken with the left foot for a period |
| `shots_missed_high` | `period` - `player` - `statistics` | Integer | Player shots that missed the target above the crossbar for a period |
| `shots_missed_left` | `period` - `player` - `statistics` | Integer | Player shots that missed the target to the left for a period |
| `shots_missed_right` | `period` - `player` - `statistics` | Integer | Player shots that missed the target to the right for a period |
| `shots_off_target` | `period` - `player` - `statistics` | Integer | Player shots off target for a period |
| `shots_off_target_inside_box` | `period` - `player` - `statistics` | Integer | Player shots off target taken from inside the box for a period |
| `shots_off_target_outside_box` | `period` - `player` - `statistics` | Integer | Player shots off target taken from outside the box for a period |
| `shots_on_target` | `period` - `player` - `statistics` | Integer | Player shots on target for a period |
| `shots_on_target_lower_center` | `period` - `player` - `statistics` | Integer | Player shots that hit the target in the lower center of the goal for a period |
| `shots_on_target_lower_left` | `period` - `player` - `statistics` | Integer | Player shots that hit the target in the lower left corner of the goal for a period |
| `shots_on_target_low_right` | `period` - `player` - `statistics` | Integer | Player shots that hit the target in the lower right corner of the goal for a period |
| `shots_on_target_percentage` | `period` - `player` - `statistics` | Double | Player shots on target percentage for a period |
| `shots_on_target_top_center` | `period` - `player` - `statistics` | Integer | Player shots that hit the target in the upper center of the goal for a period |
| `shots_on_target_top_left` | `period` - `player` - `statistics` | Integer | Player shots that hit the target in the upper left corner of the goal for a period |
| `shots_on_target_top_right` | `period` - `player` - `statistics` | Integer | Player shots that hit the target in the upper right corner of the goal for a period |
| `shots_open_play` | `period` - `player` - `statistics` | Integer | Player shots from open play for a period |
| `shots_outside_box` | `period` - `player` - `statistics` | Integer | Player shots taken from outside of the box for a period |
| `shots_outside_box_center` | `period` - `player` - `statistics` | Integer | Player shots taken from the centre of the pitch, outside of the box for a period |
| `shots_outside_box_left` | `period` - `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch, outside the box for a period |
| `shots_outside_box_on_target` | `period` - `player` - `statistics` | Integer | Player on-target shots taken outside the box for a period |
| `shots_outside_box_on_target_percentage` | `period` - `player` - `statistics` | Double | Player on-target shot percentage from outside the box for a period |
| `shots_outside_box_right` | `period` - `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch, outside the box for a period |
| `shots_right` | `period` - `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch for a period |
| `shots_right_footed` | `period` - `player` - `statistics` | Integer | Player shots taken with the right foot for a period |
| `shots_right_footed_off_target` | `period` - `player` - `statistics` | Integer | Player shots off target taken with the right foot for a period |
| `shots_right_footed_on_target` | `period` - `player` - `statistics` | Integer | Player shots on target taken with the right foot for a period |
| `shots_set_piece` | `period` - `player` - `statistics` | Integer | Player shots that came from a set piece for a period |
| `substituted_in` | `period` - `player` - `statistics` | Integer | Signifies a player was substituted in during a period when `1` |
| `substituted_out` | `period` - `player` - `statistics` | Integer | Signifies a player was substituted out during a period when `1` |
| `tackles_defensive_third_successful` | `period` - `player` - `statistics` | Integer | Player tackles completed in the defensive third of the pitch for a period |
| `tackles_final_third_successful` | `period` - `player` - `statistics` | Integer | Player tackles completed in the final third of the pitch for a period |
| `tackles_middle_third_successful` | `period` - `player` - `statistics` | Integer | Player tackles completed in the middle third of the pitch for a period |
| `tackles_opponent_half` | `period` - `player` - `statistics` | Integer | Total player tackles attempted in the opponent's half of the pitch for a period |
| `tackles_opponent_half_successful` | `period` - `player` - `statistics` | Integer | Player tackles completed in the opponent's half of the pitch for a period |
| `tackles_own_half` | `period` - `player` - `statistics` | Integer | Total player tackles attempted in the player's own half of the pitch for a period |
| `tackles_own_half_successful` | `period` - `player` - `statistics` | Integer | Player tackles completed in the player's own half of the pitch for a period |
| `tackles_successful` | `period` - `player` - `statistics` | Integer | Player successful tackles for a period |
| `tackles_total` | `period` - `player` - `statistics` | Integer | Player total attempted tackles for a period |
| `tackles_unsuccessful` | `period` - `player` - `statistics` | Integer | Player unsuccessful tackles for a period |
| `was_fouled` | `period` - `player` - `statistics` | Integer | Number of fouls against a player in a period |
| `yellow_cards` | `period` - `player` - `statistics` | Integer | Player yellow cards for a period |
| `yellow_red_cards` | `period` - `player` - `statistics` | Integer | Player red cards for a period resulting from two yellow cards |

### Period Stats (Team)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `number` | `period` | Integer | Period number |
| `assists` | `period` - `competitor` - `statistics` | Integer | Team assists for a period |
| `ball_possession` | `period` - `competitor` - `statistics` | Integer | Percentage of team ball possession for a period.<br /><br />ex. `43` |
| `cards_given` | `period` - `competitor` - `statistics` | Integer | Total cards given to a team in a period |
| `chances_created` | `period` - `competitor` - `statistics` | Integer | Total chances created for a team in a period |
| `clearances` | `period` - `competitor` - `statistics` | Integer | Total clearances for a team in a period |
| `corner_kicks` | `period` - `competitor` - `statistics` | Integer | Total team corner kicks for a period |
| `crosses_claimed` | `period` - `competitor` - `statistics` | Integer | Number of crosses a team's goalkeeper(s) claimed for a period<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i> |
| `crosses_excluding_corners` | `period` - `competitor` - `statistics` | Integer | Total number of crosses for a team in a period, excluding corner kicks |
| `crosses_successful` | `period` - `competitor` - `statistics` | Integer | Total successful crosses for a team in a period |
| `crosses_successful_excluding_corners` | `period` - `competitor` - `statistics` | Integer | Number of successful crosses for a team in a period, excluding corner kicks |
| `crosses_total` | `period` - `competitor` - `statistics` | Integer | Total crosses for a team in a period |
| `crosses_unsuccessful` | `period` - `competitor` - `statistics` | Integer | Total unsuccessful crosses for a team in a period |
| `defensive_blocks` | `period` - `competitor` - `statistics` | Integer | Total team defensive blocks for a period |
| `diving_saves` | `period` - `competitor` - `statistics` | Integer | Total team diving saves for a period |
| `dribbles` | `period` - `competitor` - `statistics` | Integer | Total number of team dribbles in a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_completed` | `period` - `competitor` - `statistics` | Integer | Team dribbles completed for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful` | `period` - `competitor` - `statistics` | Integer | Team dribbles completed for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful_percentage` | `period` - `competitor` - `statistics` | Double | Team successful dribbles percentage for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_unsuccessful` | `period` - `competitor` - `statistics` | Integer | Team unsuccessful dribbles for a period<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `fouls` | `period` - `competitor` - `statistics` | Integer | Total number of fouls awarded against a team (including those which draw cards) |
| `fouls_suffered_final_third` | `period` - `competitor` - `statistics` | Integer | Total number of fouls a team received in a period in the attacking third, resulting in a dangerous set piece |
| `free_kicks` | `period` - `competitor` - `statistics` | Integer | Team free kicks for a period. In accordance with the rules, a free kick stat counted for the team who executes a free kick. Direct or indirect free kicks are all counted as free kicks. |
| `free_kicks_scored` | `period` - `competitor` - `statistics` | Integer | Team free kicks scored for a period |
| `goal_kicks` | `period` - `competitor` - `statistics` | Integer | Team goal kicks for a period. Total number of kicks awarded to the team as a result of the ball traveling out of bounds over the goal line of the defending team. |
| `goals` | `period` - `competitor` - `statistics` | Integer | Team goals for a period |
| `goals_by_head` | `period` - `competitor` - `statistics` | Integer | Team goals by head for a period |
| `goals_conceded` | `period` - `competitor` - `statistics` | Integer | Team goals conceded for a period |
| `goals_counter_attack` | `period` - `competitor` - `statistics` | Integer | Team goals scored as a result of a counter attack in a period |
| `goals_excluding_penalties` | `period` - `competitor` - `statistics` | Integer | Team goals scored from methods other than penalty kicks in a period |
| `goals_expected` | `period` - `competitor` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots taken |
| `goals_expected_created` | `period` - `competitor` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots created (assisted chances) |
| `goals_inside_box` | `period` - `competitor` - `statistics` | Integer | Team goals scored from inside the penalty area in a period |
| `goals_left_footed` | `period` - `competitor` - `statistics` | Integer | Team goals scored with the left foot in a period |
| `goals_lower_center` | `period` - `competitor` - `statistics` | Integer | Team goals scored in the lower center of the goalface in a period |
| `goals_lower_left` | `period` - `competitor` - `statistics` | Integer | Team goals scored in the lower left corner of the goalface in a period |
| `goals_lower_right` | `period` - `competitor` - `statistics` | Integer | Team goals scored in the lower right corner of the goalface in a period |
| `goals_open_play` | `period` - `competitor` - `statistics` | Integer | Team goals scored in open play in a period |
| `goals_outside_box` | `period` - `competitor` - `statistics` | Integer | Team goals scored from outside the penalty area in a period |
| `goals_per_minute` | `period` - `competitor` - `statistics` | Double | The average time in minutes it takes a team to score a goal |
| `goals_right_footed` | `period` - `competitor` - `statistics` | Integer | Team goals scored with the right foot in a period |
| `goals_set_piece` | `period` - `competitor` - `statistics` | Integer | Team goals scored as a result of a set piece in a period |
| `goals_top_center` | `period` - `competitor` - `statistics` | Integer | Team goals scored in the top center of the goalface in a period |
| `goals_top_left` | `period` - `competitor` - `statistics` | Integer | Team goals scored in the top left corner of the goalface in a period |
| `goals_top_right` | `period` - `competitor` - `statistics` | Integer | Team goals scored in the top right corner of the goalface in a period |
| `injuries` | `period` - `competitor` - `statistics` | Integer | Total team injuries for a period |
| `interceptions` | `period` - `competitor` - `statistics` | Integer | Total team interceptions for a period |
| `interceptions_defensive_third` | `period` - `competitor` - `statistics` | Integer | Total team interceptions in the defensive third of the pitch for a period |
| `interceptions_final_third` | `period` - `competitor` - `statistics` | Integer | Total team interceptions in the final third of the pitch for a period |
| `interceptions_inside_box` | `period` - `competitor` - `statistics` | Integer | Team interceptions in their own penalty area in a period |
| `interceptions_middle_third` | `period` - `competitor` - `statistics` | Integer | Total team interceptions in the middle third of the pitch for a period |
| `interceptions_opposition_half` | `period` - `competitor` - `statistics` | Integer | Team interceptions in the attacking team's half in a period |
| `interceptions_own_half` | `period` - `competitor` - `statistics` | Integer | Team interceptions in the defending team's half in a period |
| `long_passes_successful` | `period` - `competitor` - `statistics` | Integer | Total successful long passes for a team in a period |
| `long_passes_total` | `period` - `competitor` - `statistics` | Integer | Total long passes for a team in a period |
| `long_passes_unsuccessful` | `period` - `competitor` - `statistics` | Integer | Total unsuccessful long passes for a team in a period |
| `loss_of_possession` | `period` - `competitor` - `statistics` | Integer | Team possession losses for a period |
| `offsides` | `period` - `competitor` - `statistics` | Integer | Total team offside infringements for a period |
| `own_goals` | `period` - `competitor` - `statistics` | Integer | Team own goals for a period |
| `passes_backward_successful` | `period` - `competitor` - `statistics` | Integer | Team passes in a period that were completed after the ball was moved backwards |
| `passes_center` | `period` - `competitor` - `statistics` | Integer | Team passes in a period taken from the center of the pitch |
| `passes_forward_successful` | `period` - `competitor` - `statistics` | Integer | Team successful passes in a period after the ball was moved forwards |
| `passes_in_final_third` | `period` - `competitor` - `statistics` | Integer | Team passes in a period taken from the opposition territory |
| `passes_in_final_third_successful` | `period` - `competitor` - `statistics` | Integer | Team successful passes in a period taken from the opposition territory |
| `passes_into_box` | `period` - `competitor` - `statistics` | Integer | Team passes in a period where the receiving player was positioned inside the opponent's box |
| `passes_left` | `period` - `competitor` - `statistics` | Integer | Team passes in a period taken from the left-hand side of the pitch |
| `passes_opponent_half` | `period` - `competitor` - `statistics` | Integer | Team passes in a period taken in the opposition half |
| `passes_opponent_half_successful` | `period` - `competitor` - `statistics` | Integer | Team successful passes in a period taken in the opposition half |
| `passes_own_half` | `period` - `competitor` - `statistics` | Integer | Team passes in a period taken in their own half |
| `passes_own_half_successful` | `period` - `competitor` - `statistics` | Integer | Team successful passes in a period taken in their own half |
| `passes_right` | `period` - `competitor` - `statistics` | Integer | Team passes in a period taken from the right-hand side of the pitch |
| `passes_successful` | `period` - `competitor` - `statistics` | Integer | Total successful passes for a team in a period |
| `passes_successful_percentage` | `period` - `competitor` - `statistics` | Double | Team successful pass percentage for a period |
| `passes_total` | `period` - `competitor` - `statistics` | Integer | Total passes for a team in a period |
| `passes_unsuccessful` | `period` - `competitor` - `statistics` | Integer | Total unsuccessful passes for a team in a period |
| `penalties_conceded` | `period` - `competitor` - `statistics` | Integer | Team penalty shots conceded for a period |
| `penalties_faced` | `period` - `competitor` - `statistics` | Integer | Team penalty shots faced for a period |
| `penalties_missed` | `period` - `competitor` - `statistics` | Integer | Team penalty shots missed for a period |
| `penalties_saved` | `period` - `competitor` - `statistics` | Integer | Team penalty shots saved for a period |
| `penalties_scored` | `period` - `competitor` - `statistics` | Integer | Team penalty shots scored for a period |
| `possessions_regained_in_defensive_third` | `period` - `competitor` - `statistics` | Integer | Team tackles or interceptions in their defensive third of the pitch for a period |
| `possessions_regained_in_final_third` | `period` - `competitor` - `statistics` | Integer | Team tackles or interceptions in the opposition's territory of the pitch for a period |
| `possessions_regained_in_middle_third` | `period` - `competitor` - `statistics` | Integer | Team tackles or interceptions in the middle third of the pitch for a period |
| `possessions_regained_in_opponent_half` | `period` - `competitor` - `statistics` | Integer | Team tackles or interceptions in the opponent's half for a period |
| `possessions_regained_in_own_half` | `period` - `competitor` - `statistics` | Integer | Team tackles or interceptions in the team's own half for a period |
| `red_cards` | `period` - `competitor` - `statistics` | Integer | Total team red cards for a period |
| `saves_inside_box` | `period` - `competitor` - `statistics` | Integer | Shots saved that were taken from inside the box for a period |
| `saves_lower_center` | `period` - `competitor` - `statistics` | Integer | Shots saved in the lower center of the goal for a period |
| `saves_lower_left` | `period` - `competitor` - `statistics` | Integer | Shots saved in the lower left corner of the goal for a period |
| `saves_lower_right` | `period` - `competitor` - `statistics` | Integer | Shots saved in the lower right corner of the goal for a period |
| `saves_outside_box` | `period` - `competitor` - `statistics` | Integer | Shots saved that were taken from outside the box for a period |
| `saves_percentage` | `period` - `competitor` - `statistics` | Double | Team save percentage for a period |
| `saves_top_center` | `period` - `competitor` - `statistics` | Integer | Shots saved in the upper center of the goal for a period |
| `saves_top_left` | `period` - `competitor` - `statistics` | Integer | Shots saved in the upper left corner of the goal for a period |
| `saves_top_right` | `period` - `competitor` - `statistics` | Integer | Shots saved in the upper right corner of the goal for a period |
| `shootout_penalties_faced` | `period` - `competitor` - `statistics` | Integer | Penalties faced during a penalty shootout in a period |
| `shootout_penalties_missed` | `period` - `competitor` - `statistics` | Integer | Penalties missed during a penalty shootout in a period |
| `shootout_penalties_saved` | `period` - `competitor` - `statistics` | Integer | Penalties saved during a penalty shootout in a period |
| `shootout_penalties_scored` | `period` - `competitor` - `statistics` | Integer | Penalties scored during a penalty shootout in a period |
| `shots_blocked` | `period` - `competitor` - `statistics` | Integer | Total team shots blocked for a period |
| `shots_center` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch for a period |
| `shots_counter_attack` | `period` - `competitor` - `statistics` | Integer | Team shots that came from a counter attack for a period |
| `shots_direct_free_kicks` | `period` - `competitor` - `statistics` | Integer | Team shots taken directly from a free kick for a period |
| `shots_excluding_blocks` | `period` - `competitor` - `statistics` | Double | Team shots for a period, excluding blocked shots |
| `shots_faced` | `period` - `competitor` - `statistics` | Integer | Total number of shots that a team's goalkeeper faced for a period |
| `shots_headed` | `period` - `competitor` - `statistics` | Integer | Team shots taken by header for a period |
| `shots_headed_off_target` | `period` - `competitor` - `statistics` | Integer | Team header shots that missed the target for a period |
| `shots_headed_on_target` | `period` - `competitor` - `statistics` | Integer | Team header shots that hit the target for a period |
| `shots_headed_woodwork` | `period` - `competitor` - `statistics` | Integer | Team header shots that hit the bar or post for a period |
| `shots_hit_woodwork` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the bar or post for a period |
| `shots_inside_box` | `period` - `competitor` - `statistics` | Integer | Team shots taken from inside the box for a period |
| `shots_inside_box_center` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch, inside the box for a period |
| `shots_inside_box_left` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch, inside the box for a period |
| `shots_inside_box_on_target` | `period` - `competitor` - `statistics` | Integer | Team on-target shots taken from inside the box for a period |
| `shots_inside_box_on_target_percentage` | `period` - `competitor` - `statistics` | Double | Team on-target shot percentage from inside the box for a period |
| `shots_inside_box_right` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch, inside the box for a period |
| `shots_left` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch for a period |
| `shots_left_footed` | `period` - `competitor` - `statistics` | Integer | Team shots taken with the left foot for a period |
| `shots_left_footed_off_target` | `period` - `competitor` - `statistics` | Integer | Team shots off target taken with the left foot for a period |
| `shots_left_footed_on_target` | `period` - `competitor` - `statistics` | Integer | Team shots on target taken with the left foot for a period |
| `shots_missed_high` | `period` - `competitor` - `statistics` | Integer | Team shots that missed the target above the crossbar for a period |
| `shots_missed_left` | `period` - `competitor` - `statistics` | Integer | Team shots that missed the target to the left for a period |
| `shots_missed_right` | `period` - `competitor` - `statistics` | Integer | Team shots that missed the target to the right for a period |
| `shots_off_target` | `period` - `competitor` - `statistics` | Integer | Total team off-target shots for a period |
| `shots_off_target_inside_box` | `period` - `competitor` - `statistics` | Integer | Team shots off target taken from inside the box for a period |
| `shots_off_target_outside_box` | `period` - `competitor` - `statistics` | Integer | Team shots off target taken from outside the box for a period |
| `shots_on_target` | `period` - `competitor` - `statistics` | Integer | Total team on-target shots for a period |
| `shots_on_target_lower_center` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the target in the lower center of the goal for a period |
| `shots_on_target_lower_left` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the target in the lower left corner of the goal for a period |
| `shots_on_target_lower_right` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the target in the lower right corner of the goal for a period |
| `shots_on_target_percentage` | `period` - `competitor` - `statistics` | Double | Team shots on target percentage for a period |
| `shots_on_target_top_center` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the target in the upper center of the goal for a period |
| `shots_on_target_top_left` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the target in the upper left corner of the goal for a period |
| `shots_on_target_top_right` | `period` - `competitor` - `statistics` | Integer | Team shots that hit the target in the upper right corner of the goal for a period |
| `shots_open_play` | `period` - `competitor` - `statistics` | Integer | Team shots from open play for a period |
| `shots_outside_box` | `period` - `competitor` - `statistics` | Integer | Team shots taken from outside of the box for a period |
| `shots_outside_box_center` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch, outside of the box for a period |
| `shots_outside_box_left` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch, outside the box for a period |
| `shots_outside_box_on_target` | `period` - `competitor` - `statistics` | Integer | Team on-target shots taken outside the box for a period |
| `shots_outside_box_on_target_percentage` | `period` - `competitor` - `statistics` | Double | Team on-target shot percentage from outside the box for a period |
| `shots_outside_box_right` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch, outside the box for a period |
| `shots_right` | `period` - `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch for a period |
| `shots_right_footed` | `period` - `competitor` - `statistics` | Integer | Team shots taken with the right foot for a period |
| `shots_right_footed_off_target` | `period` - `competitor` - `statistics` | Integer | Team shots off target taken with the right foot for a period |
| `shots_right_footed_on_target` | `period` - `competitor` - `statistics` | Integer | Team shots on target taken with the right foot for a period |
| `shots_saved` | `period` - `competitor` - `statistics` | Integer | Total number of goal keeper saves attributed to a team for a period |
| `shots_set_piece` | `period` - `competitor` - `statistics` | Integer | Team shots that came from a set piece for a period |
| `shots_total` | `period` - `competitor` - `statistics` | Integer | Total number of shots attributed to a team for a period |
| `substitutions` | `period` - `competitor` - `statistics` | Integer | Total number of player substitutions in a period for a team |
| `tackles_defensive_third_successful` | `period` - `competitor` - `statistics` | Integer | Total tackles completed in the defensive third of the pitch for a team in a period |
| `tackles_final_third_successful` | `period` - `competitor` - `statistics` | Integer | Total tackles completed in the final third of the pitch for a team in a period |
| `tackles_middle_third_successful` | `period` - `competitor` - `statistics` | Integer | Total tackles completed in the middle third of the pitch for a team in a period |
| `tackles_opponent_half` | `period` - `competitor` - `statistics` | Integer | Total team tackles attempted in the opponent's half of the pitch for a period |
| `tackles_opponent_half_successful` | `period` - `competitor` - `statistics` | Integer | Team tackles completed in the opponent's half of the pitch for a period |
| `tackles_own_half` | `period` - `competitor` - `statistics` | Integer | Total team tackles attempted in the team's own half of the pitch for a period |
| `tackles_own_half_successful` | `period` - `competitor` - `statistics` | Integer | Team tackles completed in the team's own half of the pitch for a period |
| `tackles_successful` | `period` - `competitor` - `statistics` | Integer | Total successful tackles for a team in a period |
| `tackles_total` | `period` - `competitor` - `statistics` | Integer | Total tackles for a team in a period |
| `tackles_unsuccessful` | `period` - `competitor` - `statistics` | Integer | Total unsuccessful tackles for a team in a period |
| `throw_ins` | `period` - `competitor` - `statistics` | Integer | Total number of throw-in events for a team during a period |
| `was_fouled` | `period` - `competitor` - `statistics` | Integer | Number of fouls against a team in a period |
| `yellow_cards` | `period` - `competitor` - `statistics` | Integer | Total team yellow cards for a period |
| `yellow_red_cards` | `period` - `competitor` - `statistics` | Integer | Total team red cards for a period which resulted from two yellow cards |

### Match Stats (Player)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `player` - `statistics` | Integer | Player assists for a match |
| `braces` | `player` - `statistics` | Integer | Player braces for a match<br /><br />_braces_ - a player has scored 2 goals in the same match |
| `cards_given` | `player` - `statistics` | Integer | Player cards given for a match |
| `chances_created` | `player` - `statistics` | Integer | Player chances created for a match |
| `clean_sheet` | `player` - `statistics` | Boolean | Signifies a clean sheet for a player when `true` |
| `clearances` | `player` - `statistics` | Integer | Player clearances for a match |
| `corner_kicks` | `player` - `statistics` | Integer | Player corner kicks for a match |
| `crosses_claimed` | `player` - `statistics` | Integer | Number of crosses a goalkeeper claimed for a match<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i> |
| `crosses_excluding_corners` | `player` - `statistics` | Integer | Number of crosses for a player in a match, excluding corner kicks |
| `crosses_successful` | `player` - `statistics` | Integer | Number of successful crosses for a player in a match |
| `crosses_successful_excluding_corners` | `player` - `statistics` | Integer | Number of successful crosses for a player in a match, excluding corner kicks |
| `crosses_total` | `player` - `statistics` | Integer | Number of total crosses for a player in a match |
| `crosses_unsuccessful` | `player` - `statistics` | Integer | Number of unsuccessful crosses for a player in a match |
| `defensive_blocks` | `player` - `statistics` | Integer | Player defensive blocks for a match |
| `diving_saves` | `player` - `statistics` | Integer | Player diving saves for a match |
| `dribbles` | `player` - `statistics` | Integer | Total number of player dribbles in a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_completed` | `player` - `statistics` | Integer | Player dribbles completed for a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful_percentage` | `player` - `statistics` | Double | Player successful dribbles percentage for a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful dribbles for a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `fouls_committed` | `player` - `statistics` | Integer | Player fouls committed for a match |
| `fouls_suffered_final_third` | `player` - `statistics` | Integer | Total number of fouls a player received in a match in the attacking third, resulting in a dangerous set piece |
| `four_goals_or_more` | `player` - `statistics` | Integer | A player has scored 4 goals or more in a single match |
| `free_kicks_scored` | `player` - `statistics` | Integer | Player free kicks scored for a match |
| `goal_involvements` | `player` - `statistics` | Integer | Player goal involvements (goals + assists) for a match |
| `goals_by_head` | `player` - `statistics` | Integer | Player goals by head for a match |
| `goals_by_penalty` | `player` - `statistics` | Integer | Player goals by penalty for a match |
| `goals_conceded` | `player` - `statistics` | Integer | Player goals conceded for a match |
| `goals_counter_attack` | `player` - `statistics` | Integer | Player goals scored as a result of a counter attack in a match |
| `goals_excluding_penalties` | `player` - `statistics` | Integer | Player goals scored from methods other than penalty kicks in a match |
| `goals_expected` | `player` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots taken |
| `goals_expected_created` | `player` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots created (assisted chances) |
| `goals_inside_box` | `player` - `statistics` | Integer | Player goals scored from inside the penalty area in a match |
| `goals_left_footed` | `player` - `statistics` | Integer | Player goals scored with the left foot in a match |
| `goals_lower_center` | `player` - `statistics` | Integer | Player goals scored in the lower center of the goalface in a match |
| `goals_lower_left` | `player` - `statistics` | Integer | Player goals scored in the lower left corner of the goalface in a match |
| `goals_lower_right` | `player` - `statistics` | Integer | Player goals scored in the lower right corner of the goalface in a match |
| `goals_open_play` | `player` - `statistics` | Integer | Player goals scored in open play in a match |
| `goals_outside_box` | `player` - `statistics` | Integer | Player goals scored from outside the penalty area in a match |
| `goals_right_footed` | `player` - `statistics` | Integer | Player goals scored with the right foot in a match |
| `goals_scored` | `player` - `statistics` | Integer | Player goals scored for a match |
| `goals_set_piece` | `player` - `statistics` | Integer | Player goals scored as a result of a set piece in a match |
| `goals_top_center` | `player` - `statistics` | Integer | Player goals scored in the top center of the goalface in a match |
| `goals_top_left` | `player` - `statistics` | Integer | Player goals scored in the top left corner of the goalface in a match |
| `goals_top_right` | `player` - `statistics` | Integer | Player goals scored in the top right corner of the goalface in a match |
| `grade` | `player` - `statistics` | String | A score calculated on a player's actions during a match |
| `hat_tricks` | `player` - `statistics` | Integer | A player has scored 3 goals in a single match |
| `injuries` | `player` - `statistics` | Integer | Player injuries for a match |
| `interceptions` | `player` - `statistics` | Integer | Player interceptions for a match |
| `interceptions_defensive_third` | `player` - `statistics` | Integer | Player interceptions in the defensive third in a match |
| `interceptions_final_third` | `player` - `statistics` | Integer | Player interceptions in the final third in a match |
| `interceptions_inside_box` | `player` - `statistics` | Integer | Player interceptions in their own penalty area in a match |
| `interceptions_middle_third` | `player` - `statistics` | Integer | Player interceptions in the middle third in a match |
| `interceptions_opposition_half` | `player` - `statistics` | Integer | Player interceptions in the attacking team's half in a match |
| `interceptions_own_half` | `player` - `statistics` | Integer | Player interceptions in the defending team's half in a match |
| `involvements_in_shots_off_target` | `player` - `statistics` | Integer | Player actions that resulted in a shot off target in a match. The player may have assisted or taken the shot. |
| `involvements_in_shots_off_target_goals_expected` | `player` - `statistics` | Double | The xG of a player's involvement in shots off target in a match. The player may have assisted or taken the shot. |
| `involvements_in_shots_on_target` | `player` - `statistics` | Integer | Player actions that resulted in a shot on target in a match. The player may have assisted or taken the shot. |
| `involvements_in_shots_on_target_goals_expected` | `player` - `statistics` | Double | The xG of a player's involvement in shots on target in a match. The player may have assisted or taken the shot. |
| `long_passes_successful` | `player` - `statistics` | Integer | Player successful long passes for a match |
| `long_passes_total` | `player` - `statistics` | Integer | Player total long passes for a match |
| `long_passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful long passes for a match |
| `loss_of_possession` | `player` - `statistics` | Integer | Player possession losses for a match |
| `minutes_played` | `player` - `statistics` | Integer | Player minutes played for a match |
| `offsides` | `player` - `statistics` | Integer | Player offsides for a match |
| `own_goals` | `player` - `statistics` | Integer | Player own goals for a match |
| `passes_backward_successful` | `player` - `statistics` | Integer | Player passes in a match that were successful after the ball was moved backwards |
| `passes_center` | `player` - `statistics` | Integer | Player passes in a match taken from the center of the pitch |
| `passes_forward_successful` | `player` - `statistics` | Integer | Player successful passes in a match after the ball was moved forwards |
| `passes_in_final_third` | `player` - `statistics` | Integer | Player passes in a match taken from the opposition territory |
| `passes_in_final_third_successful` | `player` - `statistics` | Integer | Player successful passes in a match taken from the opposition territory |
| `passes_into_box` | `player` - `statistics` | Integer | Player passes in a match where the receiving player was positioned inside the opponent's box |
| `passes_left` | `player` - `statistics` | Integer | Player passes in a match taken from the left-hand side of the pitch |
| `passes_opponent_half` | `player` - `statistics` | Integer | Player passes in a match taken in the opposition half |
| `passes_opponent_half_successful` | `player` - `statistics` | Integer | Player successful passes in a match taken in the opposition half |
| `passes_own_half` | `player` - `statistics` | Integer | Player passes in a match taken in their own half |
| `passes_own_half_successful` | `player` - `statistics` | Integer | Player successful passes in a match taken in their own half |
| `passes_right` | `player` - `statistics` | Integer | Player passes in a match taken from the right-hand side of the pitch |
| `passes_successful` | `player` - `statistics` | Integer | Player successful passes for a match |
| `passes_successful_percentage` | `player` - `statistics` | Double | Player successful pass percentage for a match |
| `passes_total` | `player` - `statistics` | Integer | Player total passes for a match |
| `passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful passes for a match |
| `penalties_conceded` | `player` - `statistics` | Integer | Player penalty shots conceded for a match |
| `penalties_faced` | `player` - `statistics` | Integer | Player penalty shots faced for a match |
| `penalties_missed` | `player` - `statistics` | Integer | Player penalty shots missed for a match |
| `penalties_saved` | `player` - `statistics` | Integer | Player penalty shots saved for a match |
| `possessions_regained_in_defensive_third` | `player` - `statistics` | Integer | Player tackles or interceptions in their defensive third of the pitch for a match |
| `possessions_regained_in_final_third` | `player` - `statistics` | Integer | Player tackles or interceptions in the opposition's territory of the pitch for a match |
| `possessions_regained_in_middle_third` | `player` - `statistics` | Integer | Player tackles or interceptions in the middle third of the pitch for a match |
| `possessions_regained_in_opponent_half` | `player` - `statistics` | Integer | Player tackles or interceptions in the opponent's half for a match |
| `possessions_regained_in_own_half` | `player` - `statistics` | Integer | Player tackles or interceptions in the player's own half for a match |
| `red_cards` | `player` - `statistics` | Integer | Player red cards for a match |
| `saves_inside_box` | `player` - `statistics` | Integer | Player shots saved that were taken from inside the box for a match |
| `saves_lower_center` | `player` - `statistics` | Integer | Player shots saved in the lower center of the goal for a match |
| `saves_lower_left` | `player` - `statistics` | Integer | Player shots saved in the lower left corner of the goal for a match |
| `saves_lower_right` | `player` - `statistics` | Integer | Player shots saved in the lower right corner of the goal for a match |
| `saves_outside_box` | `player` - `statistics` | Integer | Player shots saved that were taken from outside the box for a match |
| `saves_top_center` | `player` - `statistics` | Integer | Player shots saved in the upper center of the goal for a match |
| `saves_top_left` | `player` - `statistics` | Integer | Player shots saved in the upper left corner of the goal for a match |
| `saves_top_right` | `player` - `statistics` | Integer | Player shots saved in the upper right corner of the goal for a match |
| `shootout_penalties_faced` | `player` - `statistics` | Integer | Penalties faced during a penalty shootout in a match |
| `shootout_penalties_missed` | `player` - `statistics` | Integer | Penalties missed during a penalty shootout in a match |
| `shootout_penalties_saved` | `player` - `statistics` | Integer | Penalties saved during a penalty shootout in a match |
| `shootout_penalties_scored` | `player` - `statistics` | Integer | Penalties scored during a penalty shootout in a match |
| `shots` | `player` - `statistics` | Integer | Player total shots taken for a match |
| `shots_blocked` | `player` - `statistics` | Integer | Player shots blocked for a match |
| `shots_center` | `player` - `statistics` | Integer | Player shots taken from the centre of the pitch for a match |
| `shots_counter_attack` | `player` - `statistics` | Integer | Player shots that came from a counter attack for a match |
| `shots_direct_free_kicks` | `player` - `statistics` | Integer | Player shots taken directly from a free kick for a match |
| `shots_excluding_blocks` | `player` - `statistics` | Double | Player shots for a match, excluding blocked shots |
| `shots_faced_saved` | `player` - `statistics` | Integer | Player shots saved for a match |
| `shots_faced_total` | `player` - `statistics` | Integer | Total number of shots that a goalkeeper faced for a match |
| `shots_headed` | `player` - `statistics` | Integer | Player shots taken by header for a match |
| `shots_headed_off_target` | `player` - `statistics` | Integer | Player header shots that missed the target for a match |
| `shots_headed_on_target` | `player` - `statistics` | Integer | Player header shots that hit the target for a match |
| `shots_headed_woodwork` | `player` - `statistics` | Integer | Player header shots that hit the bar or post for a match |
| `shots_hit_woodwork` | `player` - `statistics` | Integer | Player shots that hit the bar or post for a match |
| `shots_inside_box` | `player` - `statistics` | Integer | Player shots taken from inside the box for a match |
| `shots_inside_box_center` | `player` - `statistics` | Integer | Player shots taken from the centre of the pitch, inside the box for a match |
| `shots_inside_box_left` | `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch, inside the box for a match |
| `shots_inside_box_on_target` | `player` - `statistics` | Integer | Player on-target shots taken from inside the box for a match |
| `shots_inside_box_on_target_percentage` | `player` - `statistics` | Double | Player on-target shot percentage from inside the box for a match |
| `shots_inside_box_right` | `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch, inside the box for a match |
| `shots_left` | `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch for a match |
| `shots_left_footed` | `player` - `statistics` | Integer | Player shots taken with the left foot for a match |
| `shots_left_footed_off_target` | `player` - `statistics` | Integer | Player shots off target taken with the left foot for a match |
| `shots_left_footed_on_target` | `player` - `statistics` | Integer | Player shots on target taken with the left foot for a match |
| `shots_missed_high` | `player` - `statistics` | Integer | Player shots that missed the target above the crossbar for a match |
| `shots_missed_left` | `player` - `statistics` | Integer | Player shots that missed the target to the left for a match |
| `shots_missed_right` | `player` - `statistics` | Integer | Player shots that missed the target to the right for a match |
| `shots_off_target` | `player` - `statistics` | Integer | Player shots off target for a match |
| `shots_off_target_inside_box` | `player` - `statistics` | Integer | Player shots off target taken from inside the box for a match |
| `shots_off_target_outside_box` | `player` - `statistics` | Integer | Player shots off target taken from outside the box for a match |
| `shots_on_target` | `player` - `statistics` | Integer | Player shots on target for a match |
| `shots_on_target_lower_center` | `player` - `statistics` | Integer | Player shots that hit the target in the lower center of the goal for a match |
| `shots_on_target_lower_left` | `player` - `statistics` | Integer | Player shots that hit the target in the lower left corner of the goal for a match |
| `shots_on_target_low_right` | `player` - `statistics` | Integer | Player shots that hit the target in the lower right corner of the goal for a match |
| `shots_on_target_percentage` | `player` - `statistics` | Double | Player shots on target percentage for a match |
| `shots_on_target_top_center` | `player` - `statistics` | Integer | Player shots that hit the target in the upper center of the goal for a match |
| `shots_on_target_top_left` | `player` - `statistics` | Integer | Player shots that hit the target in the upper left corner of the goal for a match |
| `shots_on_target_top_right` | `player` - `statistics` | Integer | Player shots that hit the target in the upper right corner of the goal for a match |
| `shots_open_play` | `player` - `statistics` | Integer | Player shots from open play for a match |
| `shots_outside_box` | `player` - `statistics` | Integer | Player shots taken from outside of the box for a match |
| `shots_outside_box_center` | `player` - `statistics` | Integer | Player shots taken from the centre of the pitch, outside of the box for a match |
| `shots_outside_box_left` | `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch, outside the box for a match |
| `shots_outside_box_on_target` | `player` - `statistics` | Integer | Player on-target shots taken outside the box for a match |
| `shots_outside_box_on_target_percentage` | `player` - `statistics` | Double | Player on-target shot percentage from outside the box for a match |
| `shots_outside_box_right` | `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch, outside the box for a match |
| `shots_right` | `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch for a match |
| `shots_right_footed` | `player` - `statistics` | Integer | Player shots taken with the right foot for a match |
| `shots_right_footed_off_target` | `player` - `statistics` | Integer | Player shots off target taken with the right foot for a match |
| `shots_right_footed_on_target` | `player` - `statistics` | Integer | Player shots on target taken with the right foot for a match |
| `shots_set_piece` | `player` - `statistics` | Integer | Player shots that came from a set piece for a match |
| `substituted_in` | `player` - `statistics` | Integer | Signifies a player was substituted in during a period when `1` |
| `substituted_out` | `player` - `statistics` | Integer | Signifies a player was substituted out during a period when `1` |
| `tackles_defensive_third_successful` | `player` - `statistics` | Integer | Player tackles completed in the defensive third of the pitch for a match |
| `tackles_final_third_successful` | `player` - `statistics` | Integer | Player tackles completed in the final third of the pitch for a match |
| `tackles_middle_third_successful` | `player` - `statistics` | Integer | Player tackles completed in the middle third of the pitch for a match |
| `tackles_opponent_half` | `player` - `statistics` | Integer | Total player tackles attempted in the opponent's half of the pitch for a match |
| `tackles_opponent_half_successful` | `player` - `statistics` | Integer | Player tackles completed in the opponent's half of the pitch for a match |
| `tackles_own_half` | `player` - `statistics` | Integer | Total player tackles attempted in the player's own half of the pitch for a match |
| `tackles_own_half_successful` | `player` - `statistics` | Integer | Player tackles completed in the player's own half of the pitch for a match |
| `tackles_successful` | `player` - `statistics` | Integer | Player successful tackles for a match |
| `tackles_total` | `player` - `statistics` | Integer | Player total attempted tackles for a match |
| `tackles_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful tackles for a match |
| `was_fouled` | `player` - `statistics` | Integer | Number of fouls against a player in a match |
| `yellow_cards` | `player` - `statistics` | Integer | Player yellow cards for a match |
| `yellow_red_cards` | `player` - `statistics` | Integer | Player red cards for a match resulting from two yellow cards |

### Match Stats (Team)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `competitor` - `statistics` | Integer | Team assists for a match |
| `ball_possession` | `competitor` - `statistics` | Integer | Percentage of team ball possession for a match.<br /><br />ex. `43` |
| `braces` | `competitor` - `statistics` | Integer | Team braces for a match<br /><br />_braces_ - a player has scored 2 goals in the same match |
| `cards_given` | `competitor` - `statistics` | Integer | Total cards given to a team in a match |
| `chances_created` | `competitor` - `statistics` | Integer | Total chances created for a team in a match |
| `clean_sheet` | `competitor` - `statistics` | Integer | Signifies a clean sheet for a match when `true` |
| `clearances` | `competitor` - `statistics` | Integer | Total clearances for a team in a match |
| `corner_kicks` | `competitor` - `statistics` | Integer | Total team corner kicks for a match |
| `crosses_claimed` | `competitor` - `statistics` | Integer | Number of crosses a team's goalkeeper(s) claimed for a match<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i> |
| `crosses_excluding_corners` | `competitor` - `statistics` | Integer | Total number of crosses for a team in a match, excluding corner kicks |
| `crosses_successful` | `competitor` - `statistics` | Integer | Total successful crosses for a team in a match |
| `crosses_successful_excluding_corners` | `competitor` - `statistics` | Integer | Number of successful crosses for a team in a match, excluding corner kicks |
| `crosses_total` | `competitor` - `statistics` | Integer | Total crosses for a team in a match |
| `crosses_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful crosses for a team in a match |
| `defensive_blocks` | `competitor` - `statistics` | Integer | Total team defensive blocks for a match |
| `diving_saves` | `competitor` - `statistics` | Integer | Total team diving saves for a match |
| `dribbles` | `competitor` - `statistics` | Integer | Total number of team dribbles in a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_completed` | `competitor` - `statistics` | Integer | Team dribbles completed for a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful_percentage` | `competitor` - `statistics` | Double | Team successful dribbles percentage for a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_unsuccessful` | `competitor` - `statistics` | Integer | Team unsuccessful dribbles for a match<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `fouls` | `competitor` - `statistics` | Integer | Total number of fouls awarded against a team (including those which draw cards) |
| `fouls_suffered_final_third` | `competitor` - `statistics` | Integer | Total number of fouls a team received in a match in the attacking third, resulting in a dangerous set piece |
| `free_kicks` | `competitor` - `statistics` | Integer | Team free kicks for a match. In accordance with the rules, a free kick stat counted for the team who executes a free kick. Direct or indirect free kicks are all counted as free kicks. |
| `free_kicks_scored` | `competitor` - `statistics` | Integer | Team free kicks scored for a match |
| `goal_kicks` | `competitor` - `statistics` | Integer | Team goal kicks for a match. Total number of kicks awarded to the team as a result of the ball traveling out of bounds over the goal line of the defending team. |
| `goals` | `competitor` - `statistics` | Integer | Team goals for a match |
| `goals_conceded` | `competitor` - `statistics` | Integer | Team goals conceded for a match |
| `goals_counter_attack` | `competitor` - `statistics` | Integer | Team goals scored as a result of a counter attack in a match |
| `goals_excluding_penalties` | `competitor` - `statistics` | Integer | Team goals scored from methods other than penalty kicks in a match |
| `goals_expected` | `competitor` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots taken |
| `goals_expected_created` | `competitor` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots created (assisted chances) |
| `goals_from_header` | `competitor` - `statistics` | Integer | Team goals by head for a match |
| `goals_inside_box` | `competitor` - `statistics` | Integer | Team goals scored from inside the penalty area in a match |
| `goals_left_footed` | `competitor` - `statistics` | Integer | Team goals scored with the left foot in a match |
| `goals_lower_center` | `competitor` - `statistics` | Integer | Team goals scored in the lower center of the goalface in a match |
| `goals_lower_left` | `competitor` - `statistics` | Integer | Team goals scored in the lower left corner of the goalface in a match |
| `goals_lower_right` | `competitor` - `statistics` | Integer | Team goals scored in the lower right corner of the goalface in a match |
| `goals_open_play` | `competitor` - `statistics` | Integer | Team goals scored in open play in a match |
| `goals_outside_box` | `competitor` - `statistics` | Integer | Team goals scored from outside the penalty area in a match |
| `goals_per_minute` | `competitor` - `statistics` | Double | The average time in minutes it takes a player to score a goal |
| `goals_right_footed` | `competitor` - `statistics` | Integer | Team goals scored with the right foot in a match |
| `goals_set_piece` | `competitor` - `statistics` | Integer | Team goals scored as a result of a set piece in a match |
| `goals_top_center` | `competitor` - `statistics` | Integer | Team goals scored in the top center of the goalface in a match |
| `goals_top_left` | `competitor` - `statistics` | Integer | Team goals scored in the top left corner of the goalface in a match |
| `goals_top_right` | `competitor` - `statistics` | Integer | Team goals scored in the top right corner of the goalface in a match |
| `injuries` | `competitor` - `statistics` | Integer | Total team injuries for a match |
| `interceptions` | `competitor` - `statistics` | Integer | Total team interceptions for a match |
| `interceptions_defensive_third` | `competitor` - `statistics` | Integer | Total team interceptions in the defensive third of the pitch for a match |
| `interceptions_final_third` | `competitor` - `statistics` | Integer | Total team interceptions in the final third of the pitch for a match |
| `interceptions_inside_box` | `competitor` - `statistics` | Integer | Team interceptions in their own penalty area in a match |
| `interceptions_middle_third` | `competitor` - `statistics` | Integer | Total team interceptions in the middle third of the pitch for a match |
| `interceptions_opposition_half` | `competitor` - `statistics` | Integer | Team interceptions in the attacking team's half in a match |
| `interceptions_own_half` | `competitor` - `statistics` | Integer | Team interceptions in the defending team's half in a match |
| `long_passes_successful` | `competitor` - `statistics` | Integer | Total successful long passes for a team in a match |
| `long_passes_total` | `competitor` - `statistics` | Integer | Total long passes for a team in a match |
| `long_passes_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful long passes for a team in a match |
| `loss_of_possession` | `competitor` - `statistics` | Integer | Team possession losses for a match |
| `offsides` | `competitor` - `statistics` | Integer | Total team offside infringements for a match |
| `own_goals` | `competitor` - `statistics` | Integer | Team own goals for a match |
| `passes_backward_successful` | `competitor` - `statistics` | Integer | Team passes in a match that were completed after the ball was moved backwards |
| `passes_center` | `competitor` - `statistics` | Integer | Team passes in a match taken from the center of the pitch |
| `passes_forward_unsuccessful` | `competitor` - `statistics` | Integer | Team unsuccessful passes in a match after the ball was moved forwards |
| `passes_in_final_third` | `competitor` - `statistics` | Integer | Team passes in a match taken from the opposition territory |
| `passes_in_final_third_successful` | `competitor` - `statistics` | Integer | Team successful passes in a match taken from the opposition territory |
| `passes_into_box` | `competitor` - `statistics` | Integer | Team passes in a match where the receiving player was positioned inside the opponent's box |
| `passes_left` | `competitor` - `statistics` | Integer | Team passes in a match taken from the left-hand side of the pitch |
| `passes_opponent_half` | `competitor` - `statistics` | Integer | Team passes in a match taken in the opposition half |
| `passes_opponent_half_successful` | `competitor` - `statistics` | Integer | Team successful passes in a match taken in the opposition half |
| `passes_own_half` | `competitor` - `statistics` | Integer | Team passes in a match taken in their own half |
| `passes_own_half_successful` | `competitor` - `statistics` | Integer | Team successful passes in a match taken in their own half |
| `passes_right` | `competitor` - `statistics` | Integer | Team passes in a match taken from the right-hand side of the pitch |
| `passes_successful` | `competitor` - `statistics` | Integer | Total successful passes for a team in a match |
| `passes_successful_percentage` | `competitor` - `statistics` | Double | Team successful pass percentage for a match |
| `passes_total` | `competitor` - `statistics` | Integer | Total passes for a team in a match |
| `passes_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful passes for a team in a match |
| `penalties_conceded` | `competitor` - `statistics` | Integer | Team penalty shots conceded for a match |
| `penalties_faced` | `competitor` - `statistics` | Integer | Team penalty shots faced for a match |
| `penalties_missed` | `competitor` - `statistics` | Integer | Team penalty shots missed for a match |
| `penalties_saved` | `competitor` - `statistics` | Integer | Team penalty shots saved for a match |
| `penalties_scored` | `competitor` - `statistics` | Integer | Team penalty shots scored for a match |
| `possessions_regained_in_defensive_third` | `competitor` - `statistics` | Integer | Team tackles or interceptions in their defensive third of the pitch for a match |
| `possessions_regained_in_final_third` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the opposition's territory of the pitch for a match |
| `possessions_regained_in_middle_third` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the middle third of the pitch for a match |
| `possessions_regained_in_opponent_half` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the opponent's half for a match |
| `possessions_regained_in_own_half` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the team's own half for a match |
| `red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a match |
| `saves_inside_box` | `competitor` - `statistics` | Integer | Shots saved that were taken from inside the box for a match |
| `saves_lower_center` | `competitor` - `statistics` | Integer | Shots saved in the lower center of the goal for a match |
| `saves_lower_left` | `competitor` - `statistics` | Integer | Shots saved in the lower left corner of the goal for a match |
| `saves_lower_right` | `competitor` - `statistics` | Integer | Shots saved in the lower right corner of the goal for a match |
| `saves_outside_box` | `competitor` - `statistics` | Integer | Shots saved that were taken from outside the box for a match |
| `saves_percentage` | `competitor` - `statistics` | Double | Team save percentage for a match |
| `saves_top_center` | `competitor` - `statistics` | Integer | Shots saved in the upper center of the goal for a match |
| `saves_top_left` | `competitor` - `statistics` | Integer | Shots saved in the upper left corner of the goal for a match |
| `saves_top_right` | `competitor` - `statistics` | Integer | Shots saved in the upper right corner of the goal for a match |
| `shootout_penalties_faced` | `competitor` - `statistics` | Integer | Penalties faced during a penalty shootout in a match |
| `shootout_penalties_missed` | `competitor` - `statistics` | Integer | Penalties missed during a penalty shootout in a match |
| `shootout_penalties_saved` | `competitor` - `statistics` | Integer | Penalties saved during a penalty shootout in a match |
| `shootout_penalties_scored` | `competitor` - `statistics` | Integer | Penalties scored during a penalty shootout in a match |
| `shots_blocked` | `competitor` - `statistics` | Integer | Total team shots blocked for a match |
| `shots_center` | `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch for a match |
| `shots_counter_attack` | `competitor` - `statistics` | Integer | Team shots that came from a counter attack for a match |
| `shots_direct_free_kicks` | `competitor` - `statistics` | Integer | Team shots taken directly from a free kick for a match |
| `shots_excluding_blocks` | `competitor` - `statistics` | Double | Team shots for a match, excluding blocked shots |
| `shots_faced` | `competitor` - `statistics` | Integer | Total number of shots that a team's goalkeeper faced for a match |
| `shots_headed` | `competitor` - `statistics` | Integer | Team shots taken by header for a match |
| `shots_headed_off_target` | `competitor` - `statistics` | Integer | Team header shots that missed the target for a match |
| `shots_headed_on_target` | `competitor` - `statistics` | Integer | Team header shots that hit the target for a match |
| `shots_headed_woodwork` | `competitor` - `statistics` | Integer | Team header shots that hit the bar or post for a match |
| `shots_hit_woodwork` | `competitor` - `statistics` | Integer | Team shots that hit the bar or post for a match |
| `shots_inside_box` | `competitor` - `statistics` | Integer | Team shots taken from inside the box for a match |
| `shots_inside_box_center` | `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch, inside the box for a match |
| `shots_inside_box_left` | `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch, inside the box for a match |
| `shots_inside_box_on_target` | `competitor` - `statistics` | Integer | Team on-target shots taken from inside the box for a match |
| `shots_inside_box_on_target_percentage` | `competitor` - `statistics` | Double | Team on-target shot percentage from inside the box for a match |
| `shots_inside_box_right` | `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch, inside the box for a match |
| `shots_left` | `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch for a match |
| `shots_left_footed` | `competitor` - `statistics` | Integer | Team shots taken with the left foot for a match |
| `shots_left_footed_off_target` | `competitor` - `statistics` | Integer | Team shots off target taken with the left foot for a match |
| `shots_left_footed_on_target` | `competitor` - `statistics` | Integer | Team shots on target taken with the left foot for a match |
| `shots_missed_high` | `competitor` - `statistics` | Integer | Team shots that missed the target above the crossbar for a match |
| `shots_missed_left` | `competitor` - `statistics` | Integer | Team shots that missed the target to the left for a match |
| `shots_missed_right` | `competitor` - `statistics` | Integer | Team shots that missed the target to the right for a match |
| `shots_off_target` | `competitor` - `statistics` | Integer | Total team off-target shots for a match |
| `shots_off_target_inside_box` | `competitor` - `statistics` | Integer | Team shots off target taken from inside the box for a match |
| `shots_off_target_outside_box` | `competitor` - `statistics` | Integer | Team shots off target taken from outside the box for a match |
| `shots_on_target` | `competitor` - `statistics` | Integer | Total team on-target shots for a match |
| `shots_on_target_lower_center` | `competitor` - `statistics` | Integer | Team shots that hit the target in the lower center of the goal for a match |
| `shots_on_target_lower_left` | `competitor` - `statistics` | Integer | Team shots that hit the target in the lower left corner of the goal for a match |
| `shots_on_target_lower_right` | `competitor` - `statistics` | Integer | Team shots that hit the target in the lower right corner of the goal for a match |
| `shots_on_target_percentage` | `competitor` - `statistics` | Double | Team shots on target percentage for a match |
| `shots_on_target_top_center` | `competitor` - `statistics` | Integer | Team shots that hit the target in the upper center of the goal for a match |
| `shots_on_target_top_left` | `competitor` - `statistics` | Integer | Team shots that hit the target in the upper left corner of the goal for a match |
| `shots_on_target_top_right` | `competitor` - `statistics` | Integer | Team shots that hit the target in the upper right corner of the goal for a match |
| `shots_open_play` | `competitor` - `statistics` | Integer | Team shots from open play for a match |
| `shots_outside_box` | `competitor` - `statistics` | Integer | Team shots taken from outside of the box for a match |
| `shots_outside_box_center` | `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch, outside of the box for a match |
| `shots_outside_box_left` | `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch, outside the box for a match |
| `shots_outside_box_on_target` | `competitor` - `statistics` | Integer | Team on-target shots taken outside the box for a match |
| `shots_outside_box_on_target_percentage` | `competitor` - `statistics` | Double | Team on-target shot percentage from outside the box for a match |
| `shots_outside_box_right` | `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch, outside the box for a match |
| `shots_right` | `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch for a match |
| `shots_right_footed` | `competitor` - `statistics` | Integer | Team shots taken with the right foot for a match |
| `shots_right_footed_off_target` | `competitor` - `statistics` | Integer | Team shots off target taken with the right foot for a match |
| `shots_right_footed_on_target` | `competitor` - `statistics` | Integer | Team shots on target taken with the right foot for a match |
| `shots_saved` | `competitor` - `statistics` | Integer | Total number of goal keeper saves attributed to a team for a match |
| `shots_set_piece` | `competitor` - `statistics` | Integer | Team shots that came from a set piece for a match |
| `shots_total` | `competitor` - `statistics` | Integer | Total number of shots attributed to a team for a match |
| `substitutions` | `competitor` - `statistics` | Integer | Total number of player substitutions in a match for a team |
| `tackles_defensive_third_successful` | `competitor` - `statistics` | Integer | Total tackles completed in the defensive third of the pitch for a team in a match |
| `tackles_final_third_successful` | `competitor` - `statistics` | Integer | Total tackles completed in the final third of the pitch for a team in a match |
| `tackles_middle_third_successful` | `competitor` - `statistics` | Integer | Total tackles completed in the middle third of the pitch for a team in a match |
| `tackles_opponent_half` | `competitor` - `statistics` | Integer | Total team tackles attempted in the opponent's half of the pitch for a match |
| `tackles_opponent_half_successful` | `competitor` - `statistics` | Integer | Team tackles completed in the opponent's half of the pitch for a match |
| `tackles_own_half` | `competitor` - `statistics` | Integer | Total team tackles attempted in the team's own half of the pitch for a match |
| `tackles_own_half_successful` | `competitor` - `statistics` | Integer | Team tackles completed in the team's own half of the pitch for a match |
| `tackles_successful` | `competitor` - `statistics` | Integer | Total successful tackles for a team in a match |
| `tackles_total` | `competitor` - `statistics` | Integer | Total tackles for a team in a match |
| `tackles_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful tackles for a team in a match |
| `throw_ins` | `competitor` - `statistics` | Integer | Total number of throw-in events for a team during a match |
| `was_fouled` | `competitor` - `statistics` | Integer | Number of fouls against a team in a match |
| `yellow_cards` | `competitor` - `statistics` | Integer | Total team yellow cards for a match |
| `yellow_red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a match which resulted from two yellow cards |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Player (`soccer-extended-competitor-summaries`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Situation (`soccer-extended-competitor-schedules`), Sport Event Status (`soccer-extended-competitor-schedules`), Ball Location (`soccer-extended-competitor-schedules`), Venue (`soccer-extended-competitor-schedules`).
