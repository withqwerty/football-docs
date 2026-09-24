---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-seasonal-competitor-extended-statistics
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.197Z
---
# Seasonal Competitor Extended Statistics

**Soccer Extended Seasonal Competitor Extended Statistics** provides extended team and player seasonal statistics for a given season.<br><br><i>Only available for Soccer Extended package.</i>

  ### Update Frequency

  30s Time To Live / Cache

> 📘 Retrieving Seasonal Statistics
>
> Learn how to use Seasonal Competitor Extended Statistics for deeper team season metrics in our [Seasonal Statistics](https://developer.sportradar.com/soccer/docs/soccer-ig-seasonal-stats) integration scenario.

***

## Data Points

### Competition

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `season` - `competition` | String | Unique ID for a competition<br /><br />ex. `sr:competition:17` (Premier League) |
| `name` | `season` - `competition` | String | Name of a competition<br /><br />ex. `Premier League` |
| `parent_id` | `season` - `competition` | String | Unique parent ID for a competition. Typically present for group stage or playoff competitions <br /><br />ex. `sr:competition:945` used to link competitions together, like the World Cup and the various qualifiers. |

### Season

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `competition_id` | `season_competitor_statistics` - `season` | String | Unique ID for the competition a season belongs to<br /><br />ex. `sr:competition:17` (Premier League) |
| `disabled` | `season_competitor_statistics` - `season` | Boolean | Signifies a season has been disabled when `true` |
| `end_date` | `season_competitor_statistics` - `season` | Date | End date of a season<br /><br />ex. `2024-05-19` |
| `id` | `season_competitor_statistics` - `season` | String | Unique ID for a season<br /><br />ex. `sr:season:105353` (Premier League 23/24) |
| `name` | `season_competitor_statistics` - `season` | String | Name of a  season<br /><br />ex. `Premier League 23/24` |
| `start_date` | `season_competitor_statistics` - `season` | Date | Start date of a season<br /><br />ex. `2023-08-11` |
| `year` | `season_competitor_statistics` - `season` | String | Year of a  season<br /><br />ex. `23/24` |

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `country` | `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |

### Season Stats (Player)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `player` - `statistics` | Integer | Player assists for a season |
| `braces` | `player` - `statistics` | Integer | Player braces for a season<br /><br />_braces_ - a player has scored 2 goals in the same match |
| `cards_given` | `player` - `statistics` | Integer | Player cards given for a season |
| `chances_created` | `player` - `statistics` | Integer | Player chances created for a season |
| `clean_sheets` | `player` - `statistics` | Integer | Player clean sheets for a season |
| `clearances` | `player` - `statistics` | Integer | Player clearances for a season |
| `corner_kicks` | `player` - `statistics` | Integer | Player corner kicks for a season |
| `crosses_claimed` | `player` - `statistics` | Integer | Number of crosses a goalkeeper claimed for a season<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i> |
| `crosses_excluding_corners` | `player` - `statistics` | Integer | Number of crosses for a player in a season, excluding corner kicks |
| `crosses_successful` | `player` - `statistics` | Integer | Number of successful crosses for a player in a season |
| `crosses_successful_excluding_corners` | `player` - `statistics` | Integer | Number of successful crosses for a player in a season, excluding corner kicks |
| `crosses_total` | `player` - `statistics` | Integer | Number of total crosses for a player in a season |
| `crosses_unsuccessful` | `player` - `statistics` | Integer | Number of unsuccessful crosses for a player in a season |
| `defensive_blocks` | `player` - `statistics` | Integer | Player defensive blocks for a season |
| `diving_saves` | `player` - `statistics` | Integer | Player diving saves for a season |
| `dribbles` | `player` - `statistics` | Integer | Total number of player dribbles in a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_completed` | `player` - `statistics` | Integer | Player dribbles completed for a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful_percentage` | `player` - `statistics` | Double | Player successful dribbles percentage for a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful dribbles for a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `fouls_committed` | `player` - `statistics` | Integer | Player fouls committed for a season |
| `fouls_suffered_final_third` | `player` - `statistics` | Integer | Total number of fouls a player received in a season in the attacking third, resulting in a dangerous set piece |
| `fouls_won` | `player` - `statistics` | Integer | Total number of fouls won for a player in a season |
| `four_goals_or_more` | `player` - `statistics` | Integer | Number of matches a player scored 4 goals or more in a season |
| `free_kicks_scored` | `player` - `statistics` | Integer | Player free kicks scored for a season |
| `goal_involvements` | `player` - `statistics` | Integer | Player goal involvements (goals + assists) for a season |
| `goal_kicks` | `player` - `statistics` | Integer | Player goal kicks for a season |
| `goals_by_head` | `player` - `statistics` | Integer | Player goals by head for a season |
| `goals_by_penalty` | `player` - `statistics` | Integer | Player goals by penalty for a season |
| `goals_conceded` | `player` - `statistics` | Integer | Player goals conceded for a season |
| `goals_counter_attack` | `player` - `statistics` | Integer | Player goals scored as a result of a counter attack in a season |
| `goals_excluding_penalties` | `player` - `statistics` | Integer | Player goals scored from methods other than penalty kicks in a season |
| `goals_expected` | `player` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots taken |
| `goals_expected_created` | `player` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots created (assisted chances) |
| `goals_inside_box` | `player` - `statistics` | Integer | Player goals scored from inside the penalty area in a season |
| `goals_left_footed` | `player` - `statistics` | Integer | Player goals scored with the left foot in a season |
| `goals_lower_center` | `player` - `statistics` | Integer | Player goals scored in the lower center of the goalface in a season |
| `goals_lower_left` | `player` - `statistics` | Integer | Player goals scored in the lower left corner of the goalface in a season |
| `goals_lower_right` | `player` - `statistics` | Integer | Player goals scored in the lower right corner of the goalface in a season |
| `goals_open_play` | `player` - `statistics` | Integer | Player goals scored in open play in a season |
| `goals_outside_box` | `player` - `statistics` | Integer | Player goals scored from outside the penalty area in a season |
| `goals_right_footed` | `player` - `statistics` | Integer | Player goals scored with the right foot in a season |
| `goals_scored` | `player` - `statistics` | Integer | Player goals scored for a season |
| `goals_set_piece` | `player` - `statistics` | Integer | Player goals scored as a result of a set piece in a season |
| `goals_top_center` | `player` - `statistics` | Integer | Player goals scored in the top center of the goalface in a season |
| `goals_top_left` | `player` - `statistics` | Integer | Player goals scored in the top left corner of the goalface in a season |
| `goals_top_right` | `player` - `statistics` | Integer | Player goals scored in the top right corner of the goalface in a season |
| `hat_tricks` | `player` - `statistics` | Integer | Number of matches a player scored 3 goals or more in a season |
| `injuries` | `player` - `statistics` | Integer | Player injuries for a season |
| `interceptions` | `player` - `statistics` | Integer | Player interceptions for a season |
| `interceptions_defensive_third` | `player` - `statistics` | Integer | Player interceptions in the defensive third in a season |
| `interceptions_final_third` | `player` - `statistics` | Integer | Player interceptions in the final third in a season |
| `interceptions_inside_box` | `player` - `statistics` | Integer | Player interceptions in their own penalty area in a season |
| `interceptions_middle_third` | `player` - `statistics` | Integer | Player interceptions in the middle third in a season |
| `interceptions_opposition_half` | `player` - `statistics` | Integer | Player interceptions in the attacking team's half in a season |
| `interceptions_own_half` | `player` - `statistics` | Integer | Player interceptions in the defending team's half in a season |
| `involvements_in_shots_off_target` | `player` - `statistics` | Integer | Player actions that resulted in a shot off target in a season. The player may have assisted or taken the shot. |
| `involvements_in_shots_off_target_goals_expected` | `player` - `statistics` | Double | The xG of a player's involvement in shots off target in a season. The player may have assisted or taken the shot. |
| `involvements_in_shots_on_target` | `player` - `statistics` | Integer | Player actions that resulted in a shot on target in a season. The player may have assisted or taken the shot. |
| `involvements_in_shots_on_target_goals_expected` | `player` - `statistics` | Double | The xG of a player's involvement in shots on target in a season. The player may have assisted or taken the shot. |
| `long_passes_successful` | `player` - `statistics` | Integer | Player successful long passes for a season |
| `long_passes_total` | `player` - `statistics` | Integer | Player total long passes for a season |
| `long_passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful long passes for a season |
| `loss_of_possession` | `player` - `statistics` | Integer | Player possession losses for a season |
| `minutes_played` | `player` - `statistics` | Integer | Player minutes played for a season |
| `offsides` | `player` - `statistics` | Integer | Player offsides for a season |
| `own_goals` | `player` - `statistics` | Integer | Player own goals for a season |
| `passes_backward_successful` | `player` - `statistics` | Integer | Player passes in a season that were successful after the ball was moved backwards |
| `passes_center` | `player` - `statistics` | Integer | Player passes in a season taken from the center of the pitch |
| `passes_forward_successful` | `player` - `statistics` | Integer | Player successful passes in a season after the ball was moved forwards |
| `passes_in_final_third` | `player` - `statistics` | Integer | Player passes in a season taken from the opposition territory |
| `passes_in_final_third_successful` | `player` - `statistics` | Integer | Player successful passes in a season taken from the opposition territory |
| `passes_into_box` | `player` - `statistics` | Integer | Player passes in a season where the receiving player was positioned inside the opponent's box |
| `passes_left` | `player` - `statistics` | Integer | Player passes in a season taken from the left-hand side of the pitch |
| `passes_opponent_half` | `player` - `statistics` | Integer | Player passes in a season taken in the opposition half |
| `passes_opponent_half_successful` | `player` - `statistics` | Integer | Player successful passes in a season taken in the opposition half |
| `passes_own_half` | `player` - `statistics` | Integer | Player passes in a season taken in their own half |
| `passes_own_half_successful` | `player` - `statistics` | Integer | Player successful passes in a season taken in their own half |
| `passes_right` | `player` - `statistics` | Integer | Player passes in a season taken from the right-hand side of the pitch |
| `passes_successful` | `player` - `statistics` | Integer | Player successful passes for a season |
| `passes_successful_percentage` | `player` - `statistics` | Double | Player successful pass percentage for a season |
| `passes_total` | `player` - `statistics` | Integer | Player total passes for a season |
| `passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful passes for a season |
| `penalties_conceded` | `player` - `statistics` | Integer | Player penalty shots conceded for a season |
| `penalties_faced` | `player` - `statistics` | Integer | Player penalty shots faced for a season |
| `penalties_missed` | `player` - `statistics` | Integer | Player penalty shots missed for a season |
| `penalties_saved` | `player` - `statistics` | Integer | Player penalty shots saved for a season |
| `possessions_regained_in_defensive_third` | `player` - `statistics` | Integer | Player tackles or interceptions in their defensive third of the pitch for a season |
| `possessions_regained_in_final_third` | `player` - `statistics` | Integer | Player tackles or interceptions in the opposition's territory of the pitch for a season |
| `possessions_regained_in_middle_third` | `player` - `statistics` | Integer | Player tackles or interceptions in the middle third of the pitch for a season |
| `possessions_regained_in_opponent_half` | `player` - `statistics` | Integer | Player tackles or interceptions in the opponent's half for a season |
| `possessions_regained_in_own_half` | `player` - `statistics` | Integer | Player tackles or interceptions in the player's own half for a season |
| `red_cards` | `player` - `statistics` | Integer | Player red cards for a season |
| `saves_inside_box` | `player` - `statistics` | Integer | Player shots saved that were taken from inside the box for a season |
| `saves_lower_center` | `player` - `statistics` | Integer | Player shots saved in the lower center of the goal for a season |
| `saves_lower_left` | `player` - `statistics` | Integer | Player shots saved in the lower left corner of the goal for a season |
| `saves_lower_right` | `player` - `statistics` | Integer | Player shots saved in the lower right corner of the goal for a season |
| `saves_outside_box` | `player` - `statistics` | Integer | Player shots saved that were taken from outside the box for a season |
| `saves_top_center` | `player` - `statistics` | Integer | Player shots saved in the upper center of the goal for a season |
| `saves_top_left` | `player` - `statistics` | Integer | Player shots saved in the upper left corner of the goal for a season |
| `saves_top_right` | `player` - `statistics` | Integer | Player shots saved in the upper right corner of the goal for a season |
| `shootout_penalties_faced` | `player` - `statistics` | Integer | Penalties faced during a penalty shootout in a season |
| `shootout_penalties_missed` | `player` - `statistics` | Integer | Penalties missed during a penalty shootout in a season |
| `shootout_penalties_saved` | `player` - `statistics` | Integer | Penalties saved during a penalty shootout in a season |
| `shootout_penalties_scored` | `player` - `statistics` | Integer | Penalties scored during a penalty shootout in a season |
| `shots_blocked` | `player` - `statistics` | Integer | Player shots blocked for a season |
| `shots_center` | `player` - `statistics` | Integer | Player shots taken from the centre of the pitch for a season |
| `shots_counter_attack` | `player` - `statistics` | Integer | Player shots that came from a counter attack for a season |
| `shots_direct_free_kicks` | `player` - `statistics` | Integer | Player shots taken directly from a free kick for a season |
| `shots_excluding_blocks` | `player` - `statistics` | Double | Player shots for a season, excluding blocked shots |
| `shots_faced_saved` | `player` - `statistics` | Integer | Player shots saved for a season |
| `shots_faced_total` | `player` - `statistics` | Integer | Total number of shots that a goalkeeper faced for a season |
| `shots_headed` | `player` - `statistics` | Integer | Player shots taken by header for a season |
| `shots_headed_off_target` | `player` - `statistics` | Integer | Player header shots that missed the target for a season |
| `shots_headed_on_target` | `player` - `statistics` | Integer | Player header shots that hit the target for a season |
| `shots_headed_woodwork` | `player` - `statistics` | Integer | Player header shots that hit the bar or post for a season |
| `shots_hit_woodwork` | `player` - `statistics` | Integer | Player shots that hit the bar or post for a season |
| `shots_inside_box` | `player` - `statistics` | Integer | Player shots taken from inside the box for a season |
| `shots_inside_box_center` | `player` - `statistics` | Integer | Player shots taken from the centre of the pitch, inside the box for a season |
| `shots_inside_box_left` | `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch, inside the box for a season |
| `shots_inside_box_on_target` | `player` - `statistics` | Integer | Player on-target shots taken from inside the box for a season |
| `shots_inside_box_on_target_percentage` | `player` - `statistics` | Double | Player on-target shot percentage from inside the box for a season |
| `shots_inside_box_right` | `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch, inside the box for a season |
| `shots_left` | `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch for a season |
| `shots_left_footed` | `player` - `statistics` | Integer | Player shots taken with the left foot for a season |
| `shots_left_footed_off_target` | `player` - `statistics` | Integer | Player shots off target taken with the left foot for a season |
| `shots_left_footed_on_target` | `player` - `statistics` | Integer | Player shots on target taken with the left foot for a season |
| `shots_missed_high` | `player` - `statistics` | Integer | Player shots that missed the target above the crossbar for a season |
| `shots_missed_left` | `player` - `statistics` | Integer | Player shots that missed the target to the left for a season |
| `shots_missed_right` | `player` - `statistics` | Integer | Player shots that missed the target to the right for a season |
| `shots_off_target` | `player` - `statistics` | Integer | Player shots off target for a season |
| `shots_off_target_inside_box` | `player` - `statistics` | Integer | Player shots off target taken from inside the box for a season |
| `shots_off_target_outside_box` | `player` - `statistics` | Integer | Player shots off target taken from outside the box for a season |
| `shots_on_target` | `player` - `statistics` | Integer | Player shots on target for a season |
| `shots_on_target_lower_center` | `player` - `statistics` | Integer | Player shots that hit the target in the lower center of the goal for a season |
| `shots_on_target_lower_left` | `player` - `statistics` | Integer | Player shots that hit the target in the lower left corner of the goal for a season |
| `shots_on_target_low_right` | `player` - `statistics` | Integer | Player shots that hit the target in the lower right corner of the goal for a season |
| `shots_on_target_percentage` | `player` - `statistics` | Double | Player shots on target percentage for a season |
| `shots_on_target_top_center` | `player` - `statistics` | Integer | Player shots that hit the target in the upper center of the goal for a season |
| `shots_on_target_top_left` | `player` - `statistics` | Integer | Player shots that hit the target in the upper left corner of the goal for a season |
| `shots_on_target_top_right` | `player` - `statistics` | Integer | Player shots that hit the target in the upper right corner of the goal for a season |
| `shots_open_play` | `player` - `statistics` | Integer | Player shots from open play for a season |
| `shots_outside_box` | `player` - `statistics` | Integer | Player shots taken from outside of the box for a season |
| `shots_outside_box_center` | `player` - `statistics` | Integer | Player shots taken from the centre of the pitch, outside of the box for a season |
| `shots_outside_box_left` | `player` - `statistics` | Integer | Player shots taken from the left-hand side of the pitch, outside the box for a season |
| `shots_outside_box_on_target` | `player` - `statistics` | Integer | Player on-target shots taken outside the box for a season |
| `shots_outside_box_on_target_percentage` | `player` - `statistics` | Double | Player on-target shot percentage from outside the box for a season |
| `shots_outside_box_right` | `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch, outside the box for a season |
| `shots_right` | `player` - `statistics` | Integer | Player shots taken from the right-hand side of the pitch for a season |
| `shots_right_footed` | `player` - `statistics` | Integer | Player shots taken with the right foot for a season |
| `shots_right_footed_off_target` | `player` - `statistics` | Integer | Player shots off target taken with the right foot for a season |
| `shots_right_footed_on_target` | `player` - `statistics` | Integer | Player shots on target taken with the right foot for a season |
| `shots_set_piece` | `player` - `statistics` | Integer | Player shots that came from a set piece for a season |
| `shots_total` | `player` - `statistics` | Integer | Total player shots for a season |
| `substituted_in` | `player` - `statistics` | Integer | Number of times a player was substituted into a match for a season |
| `substituted_out` | `player` - `statistics` | Integer | Number of times a player was substituted out of a match for a season |
| `tackles_defensive_third_successful` | `player` - `statistics` | Integer | Player tackles completed in the defensive third of the pitch for a season |
| `tackles_final_third_successful` | `player` - `statistics` | Integer | Player tackles completed in the final third of the pitch for a season |
| `tackles_middle_third_successful` | `player` - `statistics` | Integer | Player tackles completed in the middle third of the pitch for a season |
| `tackles_opponent_half` | `player` - `statistics` | Integer | Total player tackles attempted in the opponent's half of the pitch for a season |
| `tackles_opponent_half_successful` | `player` - `statistics` | Integer | Player tackles completed in the opponent's half of the pitch for a season |
| `tackles_own_half` | `player` - `statistics` | Integer | Total player tackles attempted in the player's own half of the pitch for a season |
| `tackles_own_half_successful` | `player` - `statistics` | Integer | Player tackles completed in the player's own half of the pitch for a season |
| `tackles_successful` | `player` - `statistics` | Integer | Player successful tackles for a season |
| `tackles_total` | `player` - `statistics` | Integer | Player total attempted tackles for a season |
| `tackles_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful tackles for a season |
| `throw_ins` | `player` - `statistics` | Integer | Player throw-ins for a season |
| `was_fouled` | `player` - `statistics` | Integer | Number of fouls against a player in a season |
| `yellow_cards` | `player` - `statistics` | Integer | Player yellow cards for a season |
| `yellow_red_cards` | `player` - `statistics` | Integer | Player red cards for a season resulting from two yellow cards |

### Season Stats (Team)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `competitor` - `statistics` | Integer | Team assists for a season |
| `ball_possession` | `competitor` - `statistics` | Double | Percentage of team ball possession for a season.<br /><br />ex. `51.64` |
| `cards_given` | `competitor` - `statistics` | Integer | Total cards given to a team in a season |
| `chances_created` | `competitor` - `statistics` | Integer | Total chances created for a team in a season |
| `clean_sheets` | `competitor` - `statistics` | Integer | Total clean sheets for a season |
| `clearances` | `competitor` - `statistics` | Integer | Total clearances for a team in a season |
| `corner_kicks` | `competitor` - `statistics` | Integer | Total team corner kicks for a season |
| `crosses_claimed` | `competitor` - `statistics` | Integer | Number of crosses a team's goalkeeper(s) claimed for a season<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i> |
| `crosses_excluding_corners` | `competitor` - `statistics` | Integer | Total number of crosses for a team in a season, excluding corner kicks |
| `crosses_successful` | `competitor` - `statistics` | Integer | Total successful crosses for a team in a season |
| `crosses_successful_excluding_corners` | `competitor` - `statistics` | Integer | Number of successful crosses for a team in a season, excluding corner kicks |
| `crosses_total` | `competitor` - `statistics` | Integer | Total crosses for a team in a season |
| `crosses_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful crosses for a team in a season |
| `defensive_blocks` | `competitor` - `statistics` | Integer | Total team defensive blocks for a season |
| `diving_saves` | `competitor` - `statistics` | Integer | Total team diving saves for a season |
| `dribbles` | `competitor` - `statistics` | Integer | Total number of team dribbles in a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_completed` | `competitor` - `statistics` | Integer | Team dribbles completed for a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_successful_percentage` | `competitor` - `statistics` | Double | Team successful dribbles percentage for a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `dribbles_unsuccessful` | `competitor` - `statistics` | Integer | Team unsuccessful dribbles for a season<br /><br />_dribble_ - an action to beat an opponent where the player with the ball advances into opposition territory |
| `fouls` | `competitor` - `statistics` | Integer | Total number of fouls awarded against a team (including those which draw cards) |
| `fouls_suffered_final_third` | `competitor` - `statistics` | Integer | Total number of fouls a team received in a season in the attacking third, resulting in a dangerous set piece |
| `free_kicks` | `competitor` - `statistics` | Integer | Team free kicks for a season. In accordance with the rules, a free kick stat counted for the team who executes a free kick. Direct or indirect free kicks are all counted as free kicks. |
| `free_kicks_scored` | `competitor` - `statistics` | Integer | Team free kicks scored for a season |
| `goal_kicks` | `competitor` - `statistics` | Integer | Team goal kicks for a season. Total number of kicks awarded to the team as a result of the ball traveling out of bounds over the goal line of the defending team. |
| `goals` | `competitor` - `statistics` | Integer | Team goals for a season |
| `goals_conceded` | `competitor` - `statistics` | Integer | Team goals conceded for a season |
| `goals_counter_attack` | `competitor` - `statistics` | Integer | Team goals scored as a result of a counter attack in a season |
| `goals_excluding_penalties` | `competitor` - `statistics` | Integer | Team goals scored from methods other than penalty kicks in a season |
| `goals_expected` | `competitor` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots taken |
| `goals_expected_created` | `competitor` - `statistics` | Double | The cumulative expected goals (xG) value generated from all shots created (assisted chances) |
| `goals_from_header` | `competitor` - `statistics` | Integer | Team goals by head for a season |
| `goals_inside_box` | `competitor` - `statistics` | Integer | Team goals scored from inside the penalty area in a season |
| `goals_left_footed` | `competitor` - `statistics` | Integer | Team goals scored with the left foot in a season |
| `goals_lower_center` | `competitor` - `statistics` | Integer | Team goals scored in the lower center of the goalface in a season |
| `goals_lower_left` | `competitor` - `statistics` | Integer | Team goals scored in the lower left corner of the goalface in a season |
| `goals_lower_right` | `competitor` - `statistics` | Integer | Team goals scored in the lower right corner of the goalface in a season |
| `goals_open_play` | `competitor` - `statistics` | Integer | Team goals scored in open play in a season |
| `goals_outside_box` | `competitor` - `statistics` | Integer | Team goals scored from outside the penalty area in a season |
| `goals_right_footed` | `competitor` - `statistics` | Integer | Team goals scored with the right foot in a season |
| `goals_set_piece` | `competitor` - `statistics` | Integer | Team goals scored as a result of a set piece in a season |
| `goals_top_center` | `competitor` - `statistics` | Integer | Team goals scored in the top center of the goalface in a season |
| `goals_top_left` | `competitor` - `statistics` | Integer | Team goals scored in the top left corner of the goalface in a season |
| `goals_top_right` | `competitor` - `statistics` | Integer | Team goals scored in the top right corner of the goalface in a season |
| `injuries` | `competitor` - `statistics` | Integer | Total team injuries for a season |
| `interceptions` | `competitor` - `statistics` | Integer | Total team interceptions for a season |
| `interceptions_defensive_third` | `competitor` - `statistics` | Integer | Total team interceptions in the defensive third of the pitch for a season |
| `interceptions_final_third` | `competitor` - `statistics` | Integer | Total team interceptions in the final third of the pitch for a season |
| `interceptions_inside_box` | `competitor` - `statistics` | Integer | Team interceptions in their own penalty area in a season |
| `interceptions_middle_third` | `competitor` - `statistics` | Integer | Total team interceptions in the middle third of the pitch for a season |
| `interceptions_opposition_half` | `competitor` - `statistics` | Integer | Team interceptions in the attacking team's half in a season |
| `interceptions_own_half` | `competitor` - `statistics` | Integer | Team interceptions in the defending team's half in a season |
| `long_passes_successful` | `competitor` - `statistics` | Integer | Total successful long passes for a team in a season |
| `long_passes_total` | `competitor` - `statistics` | Integer | Total long passes for a team in a season |
| `long_passes_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful long passes for a team in a season |
| `loss_of_possession` | `competitor` - `statistics` | Integer | Team possession losses for a season |
| `offsides` | `competitor` - `statistics` | Integer | Total team offside infringements for a season |
| `own_goals` | `competitor` - `statistics` | Integer | Team own goals for a season |
| `passes_backward_successful` | `competitor` - `statistics` | Integer | Team passes in a season that were completed after the ball was moved backwards |
| `passes_center` | `competitor` - `statistics` | Integer | Team passes in a season taken from the center of the pitch |
| `passes_forward_successful` | `competitor` - `statistics` | Integer | Team successful passes in a season after the ball was moved forwards |
| `passes_in_final_third` | `competitor` - `statistics` | Integer | Team passes in a season taken from the opposition territory |
| `passes_in_final_third_successful` | `competitor` - `statistics` | Integer | Team successful passes in a season taken from the opposition territory |
| `passes_into_box` | `competitor` - `statistics` | Integer | Team passes in a season where the receiving player was positioned inside the opponent's box |
| `passes_left` | `competitor` - `statistics` | Integer | Team passes in a season taken from the left-hand side of the pitch |
| `passes_opponent_half` | `competitor` - `statistics` | Integer | Team passes in a season taken in the opposition half |
| `passes_opponent_half_successful` | `competitor` - `statistics` | Integer | Team successful passes in a season taken in the opposition half |
| `passes_own_half` | `competitor` - `statistics` | Integer | Team passes in a season taken in their own half |
| `passes_own_half_successful` | `competitor` - `statistics` | Integer | Team successful passes in a season taken in their own half |
| `passes_right` | `competitor` - `statistics` | Integer | Team passes in a season taken from the right-hand side of the pitch |
| `passes_successful` | `competitor` - `statistics` | Integer | Total successful passes for a team in a season |
| `passes_successful_percentage` | `competitor` - `statistics` | Double | Team successful pass percentage for a season |
| `passes_total` | `competitor` - `statistics` | Integer | Total passes for a team in a season |
| `passes_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful passes for a team in a season |
| `penalties_conceded` | `competitor` - `statistics` | Integer | Team penalty shots conceded for a season |
| `penalties_faced` | `competitor` - `statistics` | Integer | Team penalty shots faced for a season |
| `penalties_missed` | `competitor` - `statistics` | Integer | Team penalty shots missed for a season |
| `penalties_saved` | `competitor` - `statistics` | Integer | Team penalty shots saved for a season |
| `penalties_scored` | `competitor` - `statistics` | Integer | Team penalty shots scored for a season |
| `possessions_regained_in_defensive_third` | `competitor` - `statistics` | Integer | Team tackles or interceptions in their defensive third of the pitch for a season |
| `possessions_regained_in_final_third` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the opposition's territory of the pitch for a season |
| `possessions_regained_in_middle_third` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the middle third of the pitch for a season |
| `possessions_regained_in_opponent_half` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the opponent's half for a season |
| `possessions_regained_in_own_half` | `competitor` - `statistics` | Integer | Team tackles or interceptions in the team's own half for a season |
| `red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a season |
| `saves_inside_box` | `competitor` - `statistics` | Integer | Shots saved that were taken from inside the box for a season |
| `saves_lower_center` | `competitor` - `statistics` | Integer | Shots saved in the lower center of the goal for a season |
| `saves_lower_left` | `competitor` - `statistics` | Integer | Shots saved in the lower left corner of the goal for a season |
| `saves_lower_right` | `competitor` - `statistics` | Integer | Shots saved in the lower right corner of the goal for a season |
| `saves_outside_box` | `competitor` - `statistics` | Integer | Shots saved that were taken from outside the box for a season |
| `saves_percentage` | `competitor` - `statistics` | Double | Team save percentage for a season |
| `saves_top_center` | `competitor` - `statistics` | Integer | Shots saved in the upper center of the goal for a season |
| `saves_top_left` | `competitor` - `statistics` | Integer | Shots saved in the upper left corner of the goal for a season |
| `saves_top_right` | `competitor` - `statistics` | Integer | Shots saved in the upper right corner of the goal for a season |
| `shootout_penalties_faced` | `competitor` - `statistics` | Integer | Penalties faced during a penalty shootout in a season |
| `shootout_penalties_missed` | `competitor` - `statistics` | Integer | Penalties missed during a penalty shootout in a season |
| `shootout_penalties_saved` | `competitor` - `statistics` | Integer | Penalties saved during a penalty shootout in a season |
| `shootout_penalties_scored` | `competitor` - `statistics` | Integer | Penalties scored during a penalty shootout in a season |
| `shots_blocked` | `competitor` - `statistics` | Integer | Total team shots blocked for a season |
| `shots_center` | `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch for a season |
| `shots_counter_attack` | `competitor` - `statistics` | Integer | Team shots that came from a counter attack for a season |
| `shots_direct_free_kicks` | `competitor` - `statistics` | Integer | Team shots taken directly from a free kick for a season |
| `shots_excluding_blocks` | `competitor` - `statistics` | Double | Team shots for a season, excluding blocked shots |
| `shots_faced` | `competitor` - `statistics` | Integer | Total number of shots that a team's goalkeeper faced for a season |
| `shots_headed` | `competitor` - `statistics` | Integer | Team shots taken by header for a season |
| `shots_headed_off_target` | `competitor` - `statistics` | Integer | Team header shots that missed the target for a season |
| `shots_headed_on_target` | `competitor` - `statistics` | Integer | Team header shots that hit the target for a season |
| `shots_headed_woodwork` | `competitor` - `statistics` | Integer | Team header shots that hit the bar or post for a season |
| `shots_hit_woodwork` | `competitor` - `statistics` | Integer | Team shots that hit the bar or post for a season |
| `shots_inside_box` | `competitor` - `statistics` | Integer | Team shots taken from inside the box for a season |
| `shots_inside_box_center` | `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch, inside the box for a season |
| `shots_inside_box_left` | `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch, inside the box for a season |
| `shots_inside_box_on_target` | `competitor` - `statistics` | Integer | Team on-target shots taken from inside the box for a season |
| `shots_inside_box_on_target_percentage` | `competitor` - `statistics` | Double | Team on-target shot percentage from inside the box for a season |
| `shots_inside_box_right` | `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch, inside the box for a season |
| `shots_left` | `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch for a season |
| `shots_left_footed` | `competitor` - `statistics` | Integer | Team shots taken with the left foot for a season |
| `shots_left_footed_off_target` | `competitor` - `statistics` | Integer | Team shots off target taken with the left foot for a season |
| `shots_left_footed_on_target` | `competitor` - `statistics` | Integer | Team shots on target taken with the left foot for a season |
| `shots_missed_high` | `competitor` - `statistics` | Integer | Team shots that missed the target above the crossbar for a season |
| `shots_missed_left` | `competitor` - `statistics` | Integer | Team shots that missed the target to the left for a season |
| `shots_missed_right` | `competitor` - `statistics` | Integer | Team shots that missed the target to the right for a season |
| `shots_off_target` | `competitor` - `statistics` | Integer | Total team off-target shots for a season |
| `shots_off_target_inside_box` | `competitor` - `statistics` | Integer | Team shots off target taken from inside the box for a season |
| `shots_off_target_outside_box` | `competitor` - `statistics` | Integer | Team shots off target taken from outside the box for a season |
| `shots_on_target` | `competitor` - `statistics` | Integer | Total team on-target shots for a season |
| `shots_on_target_lower_center` | `competitor` - `statistics` | Integer | Team shots that hit the target in the lower center of the goal for a season |
| `shots_on_target_lower_left` | `competitor` - `statistics` | Integer | Team shots that hit the target in the lower left corner of the goal for a season |
| `shots_on_target_lower_right` | `competitor` - `statistics` | Integer | Team shots that hit the target in the lower right corner of the goal for a season |
| `shots_on_target_percentage` | `competitor` - `statistics` | Double | Team shots on target percentage for a season |
| `shots_on_target_top_center` | `competitor` - `statistics` | Integer | Team shots that hit the target in the upper center of the goal for a season |
| `shots_on_target_top_left` | `competitor` - `statistics` | Integer | Team shots that hit the target in the upper left corner of the goal for a season |
| `shots_on_target_top_right` | `competitor` - `statistics` | Integer | Team shots that hit the target in the upper right corner of the goal for a season |
| `shots_open_play` | `competitor` - `statistics` | Integer | Team shots from open play for a season |
| `shots_outside_box` | `competitor` - `statistics` | Integer | Team shots taken from outside of the box for a season |
| `shots_outside_box_center` | `competitor` - `statistics` | Integer | Team shots taken from the centre of the pitch, outside of the box for a season |
| `shots_outside_box_left` | `competitor` - `statistics` | Integer | Team shots taken from the left-hand side of the pitch, outside the box for a season |
| `shots_outside_box_on_target` | `competitor` - `statistics` | Integer | Team on-target shots taken outside the box for a season |
| `shots_outside_box_on_target_percentage` | `competitor` - `statistics` | Double | Team on-target shot percentage from outside the box for a season |
| `shots_outside_box_right` | `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch, outside the box for a season |
| `shots_right` | `competitor` - `statistics` | Integer | Team shots taken from the right-hand side of the pitch for a season |
| `shots_right_footed` | `competitor` - `statistics` | Integer | Team shots taken with the right foot for a season |
| `shots_right_footed_off_target` | `competitor` - `statistics` | Integer | Team shots off target taken with the right foot for a season |
| `shots_right_footed_on_target` | `competitor` - `statistics` | Integer | Team shots on target taken with the right foot for a season |
| `shots_saved` | `competitor` - `statistics` | Integer | Total number of goal keeper saves attributed to a team for a season |
| `shots_set_piece` | `competitor` - `statistics` | Integer | Team shots that came from a set piece for a season |
| `shots_total` | `competitor` - `statistics` | Integer | Total number of shots attributed to a team for a season |
| `substitutions` | `competitor` - `statistics` | Integer | Total number of player substitutions in a season for a team |
| `tackles_defensive_third_successful` | `competitor` - `statistics` | Integer | Total tackles completed in the defensive third of the pitch for a team in a season |
| `tackles_final_third_successful` | `competitor` - `statistics` | Integer | Total tackles completed in the final third of the pitch for a team in a season |
| `tackles_middle_third_successful` | `competitor` - `statistics` | Integer | Total tackles completed in the middle third of the pitch for a team in a season |
| `tackles_opponent_half` | `competitor` - `statistics` | Integer | Total team tackles attempted in the opponent's half of the pitch for a season |
| `tackles_opponent_half_successful` | `competitor` - `statistics` | Integer | Team tackles completed in the opponent's half of the pitch for a season |
| `tackles_own_half` | `competitor` - `statistics` | Integer | Total team tackles attempted in the team's own half of the pitch for a season |
| `tackles_own_half_successful` | `competitor` - `statistics` | Integer | Team tackles completed in the team's own half of the pitch for a season |
| `tackles_successful` | `competitor` - `statistics` | Integer | Total successful tackles for a team in a season |
| `tackles_total` | `competitor` - `statistics` | Integer | Total tackles for a team in a season |
| `tackles_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful tackles for a team in a season |
| `throw_ins` | `competitor` - `statistics` | Integer | Total number of throw-in events for a team over a season |
| `was_fouled` | `competitor` - `statistics` | Integer | Number of fouls against a team in a season |
| `yellow_cards` | `competitor` - `statistics` | Integer | Total team yellow cards for a season |
| `yellow_red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a season which resulted from two yellow cards |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-season-info`), Player (`soccer-extended-live-timelines`).
