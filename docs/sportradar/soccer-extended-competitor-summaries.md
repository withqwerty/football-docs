---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitor-summaries
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Competitor Summaries

**Soccer Extended Competitor Summaries** provides scheduling information for upcoming matches and statistics for the 30 most recent completed matches of a specified competitor.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Retrieving Seasonal Statistics
>
> Learn how to use Competitor Summaries for a team's recent results and statistics in our [Seasonal Statistics](https://developer.sportradar.com/soccer/docs/soccer-ig-seasonal-stats) integration scenario.

***

## Data Points

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `statistics` - `competitor` - `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `name` | `statistics` - `competitor` - `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `starter` | `statistics` - `competitor` - `player` | Boolean | Signifies a player is in the starting lineup for a sport event when `true` |

### Sport Event - Coverage Properties

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `type` | `sport_event` - `coverage` | String | Type of coverage<br /><br />`sport_event`, `group`, `competition` |
| `ballspotting` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies ballspotting is available for a sport event when `true` |
| `basic_play_by_play` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies basic play-by-play is available for a sport event when `true` |
| `basic_player_stats` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies basic player stats is available for a sport event when `true` |
| `basic_team_stats` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies basic team stats is available for a sport event when `true` |
| `commentary` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies commentary is available for a sport event when `true` |
| `deeper_play_by_play` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies deeper play-by-play is available for a sport event when `true` |
| `deeper_player_stats` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies deeper player stats is available for a sport event when `true` |
| `deeper_team_stats` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies deeper team stats is available for a sport event when `true` |
| `extended_play_by_play` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies extended play-by-play data is available for a sport event when `true`. Access this data in the [Sport Event Extended Timeline](https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-extended-timeline) endpoint. |
| `extended_player_stats` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies extended player stats is available for a sport event when `true` |
| `extended_team_stats` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies extended team stats is available for a sport event when `true` |
| `formations` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies team formations are available for a sport event when `true` |
| `fun_facts` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies fun facts are available for a sport event when `true` |
| `game_clock` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies the game clock is available for a sport event when `true` |
| `goal_scorers` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies goal scorers are available for a sport event when `true` |
| `goal_scorers_live` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies goal scorers are available live for a sport event when `true` |
| `lineups` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies goal lineups are available for a sport event when `true` |
| `lineups_availability` | `sport_event` - `coverage` - `sport_event_properties` | String | Describes the availability of lineups as pre-match or post-match<br /><br />`pre`, `post` |
| `probabilities` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies probabilities are available for a sport event when `true`<br /><br /><i><b>Note:</b> Attribute is not currently supported</i> |
| `scores` | `sport_event` - `coverage` - `sport_event_properties` | String | Describes the availability of scores as live or post-match<br /><br />`live`, `post` |
| `venue` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies venue info is available for a sport event when `true` |

### Match Stats (Player)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `player` - `statistics` | Integer | Player assists for a match |
| `chances_created` | `player` - `statistics` | Integer | Player chances created for a match |
| `clearances` | `player` - `statistics` | Integer | Player clearances for a match |
| `corner_kicks` | `player` - `statistics` | Integer | Player corner kicks for a match |
| `crosses_successful` | `player` - `statistics` | Integer | Player successful crosses for a match |
| `crosses_total` | `player` - `statistics` | Integer | Player total crosses for a match |
| `defensive_blocks` | `player` - `statistics` | Integer | Player defensive blocks for a match |
| `diving_saves` | `player` - `statistics` | Integer | Player diving saves for a match |
| `dribbles_completed` | `player` - `statistics` | Integer | Player dribbles completed for a match |
| `fouls_committed` | `player` - `statistics` | Integer | Player fouls committed for a match |
| `goals_by_head` | `player` - `statistics` | Integer | Player goals by head for a match |
| `goals_by_penalty` | `player` - `statistics` | Integer | Player goals by penalty for a match |
| `goals_conceded` | `player` - `statistics` | Integer | Player goals conceded for a match |
| `goals_scored` | `player` - `statistics` | Integer | Player goals scored for a match |
| `interceptions` | `player` - `statistics` | Integer | Player interceptions for a match |
| `long_passes_successful` | `player` - `statistics` | Integer | Player successful long passes for a match |
| `long_passes_total` | `player` - `statistics` | Integer | Player total long passes for a match |
| `long_passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful long passes for a match |
| `loss_of_possession` | `player` - `statistics` | Integer | Player possession losses for a match |
| `minutes_played` | `player` - `statistics` | Integer | Player minutes played for a match |
| `offsides` | `player` - `statistics` | Integer | Player offsides for a match |
| `own_goals` | `player` - `statistics` | Integer | Player own goals for a match |
| `passes_successful` | `player` - `statistics` | Integer | Player successful passes for a match |
| `passes_total` | `player` - `statistics` | Integer | Player total passes for a match |
| `passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful passes for a match |
| `penalties_faced` | `player` - `statistics` | Integer | Player penalty shots faced for a match |
| `penalties_missed` | `player` - `statistics` | Integer | Player penalty shots missed for a match |
| `penalties_saved` | `player` - `statistics` | Integer | Player penalty shots saved for a match |
| `red_cards` | `player` - `statistics` | Integer | Player red cards for a match |
| `shots_blocked` | `player` - `statistics` | Integer | Player shots blocked for a match |
| `shots_faced_saved` | `player` - `statistics` | Integer | Player shots saved for a match |
| `shots_faced_total` | `player` - `statistics` | Integer | Player total shots faced for a match |
| `shots_off_target` | `player` - `statistics` | Integer | Player shots off target for a match |
| `shots_on_target` | `player` - `statistics` | Integer | Player shots on target for a match |
| `substituted_in` | `player` - `statistics` | Integer | Signifies a player was substituted in during a match when `1` |
| `substituted_out` | `player` - `statistics` | Integer | Signifies a player was substituted out during a match when `1` |
| `tackles_successful` | `player` - `statistics` | Integer | Player successful tackles for a match |
| `tackles_total` | `player` - `statistics` | Integer | Player total tackles for a match |
| `was_fouled` | `player` - `statistics` | Integer | Number of fouls against a player in a match |
| `yellow_cards` | `player` - `statistics` | Integer | Player yellow cards for a match |
| `yellow_red_cards` | `player` - `statistics` | Integer | Player red cards for a match resulting from two yellow cards |

### Match Stats (Team)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `ball_possession` | `competitor` - `statistics` | Integer | Percentage of team ball possession for a match.<br /><br />ex. `43` |
| `cards_given` | `competitor` - `statistics` | Integer | Total cards given to a team in a match |
| `chances_created` | `competitor` - `statistics` | Integer | Total chances created for a team in a match |
| `clearances` | `competitor` - `statistics` | Integer | Total clearances for a team in a match |
| `corner_kicks` | `competitor` - `statistics` | Integer | Total team corner kicks for a match |
| `crosses_successful` | `competitor` - `statistics` | Integer | Total successful crosses for a team in a match |
| `crosses_total` | `competitor` - `statistics` | Integer | Total crosses for a team in a match |
| `crosses_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful crosses for a team in a match |
| `defensive_blocks` | `competitor` - `statistics` | Integer | Total team defensive blocks for a match |
| `diving_saves` | `competitor` - `statistics` | Integer | Total team diving saves for a match |
| `fouls` | `competitor` - `statistics` | Integer | Total number of fouls awarded against a team (including those which draw cards) |
| `free_kicks` | `competitor` - `statistics` | Integer | Team free kicks for a match. In accordance with the rules, a free kick stat counted for the team who executes a free kick. Direct or indirect free kicks are all counted as free kicks. |
| `goal_kicks` | `competitor` - `statistics` | Integer | Team goal kicks for a match. Total number of kicks awarded to the team as a result of the ball traveling out of bounds over the goal line of the defending team. |
| `injuries` | `competitor` - `statistics` | Integer | Total team injuries for a match |
| `interceptions` | `competitor` - `statistics` | Integer | Total team interceptions for a match |
| `long_passes_successful` | `competitor` - `statistics` | Integer | Total successful long passes for a team in a match |
| `long_passes_total` | `competitor` - `statistics` | Integer | Total long passes for a team in a match |
| `long_passes_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful long passes for a team in a match |
| `offsides` | `competitor` - `statistics` | Integer | Total team offside infringements for a match |
| `passes_successful` | `competitor` - `statistics` | Integer | Total successful passes for a team in a match |
| `passes_total` | `competitor` - `statistics` | Integer | Total passes for a team in a match |
| `passes_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful passes for a team in a match |
| `penalties_missed` | `competitor` - `statistics` | Integer | Total team penalty shots missed for a match |
| `red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a match |
| `shots_blocked` | `competitor` - `statistics` | Integer | Total team shots blocked for a match |
| `shots_off_target` | `competitor` - `statistics` | Integer | Total team off-target shots for a match |
| `shots_on_target` | `competitor` - `statistics` | Integer | Total team on-target shots for a match |
| `shots_saved` | `competitor` - `statistics` | Integer | Total number of goal keeper saves attributed to a team for a match |
| `shots_total` | `competitor` - `statistics` | Integer | Total number of shots attributed to a team for a match |
| `substitutions` | `competitor` - `statistics` | Integer | Total number player substitutions in a match |
| `tackles_successful` | `competitor` - `statistics` | Integer | Total successful tackles for a team in a match |
| `tackles_total` | `competitor` - `statistics` | Integer | Total tackles for a team in a match |
| `tackles_unsuccessful` | `competitor` - `statistics` | Integer | Total unsuccessful tackles for a team in a match |
| `throw_ins` | `competitor` - `statistics` | Integer | Total number of throw-in events for a team during a match |
| `was_fouled` | `competitor` - `statistics` | Integer | Number of fouls against a team in a match |
| `yellow_cards` | `competitor` - `statistics` | Integer | Total team yellow cards for a match |
| `yellow_red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a match which resulted from two yellow cards |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event Situation (`soccer-extended-competitor-schedules`), Sport Event Status (`soccer-extended-competitor-schedules`), Ball Location (`soccer-extended-competitor-schedules`), Venue (`soccer-extended-competitor-schedules`).
