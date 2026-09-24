---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-seasonal-competitor-statistics
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.197Z
---
# Seasonal Competitor Statistics

**Soccer Extended Seasonal Competitor Statistics** provides team and player seasonal statistics for a given season.

  ### Update Frequency

  30s Time To Live / Cache

> 📘 Retrieving Seasonal Statistics
>
> Learn how to use Seasonal Competitor Statistics for team and player season totals in our [Seasonal Statistics](https://developer.sportradar.com/soccer/docs/soccer-ig-seasonal-stats) integration scenario.

***

## Data Points

### Competition

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `gender` | `season` - `competition` | String | Gender for a competition<br /><br />ex. `men` |
| `id` | `season` - `competition` | String | Unique ID for a competition<br /><br />ex. `sr:competition:17` (Premier League) |
| `name` | `season` - `competition` | String | Name of a competition<br /><br />ex. `Premier League` |
| `parent_id` | `season` - `competition` | String | Unique parent ID for a competition. Typically present for group stage or playoff competitions <br /><br />ex. `sr:competition:945` used to link competitions together, like the World Cup and the various qualifiers. |

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `virtual` | `competitor` | Boolean | Signifies a competitor is a virtual team when `true`. Used for placeholder teams in TBD vs TBD matchups. |

### Season Stats (Player)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `player` - `statistics` | Integer | Player assists for a season |
| `cards_given` | `player` - `statistics` | Integer | Player cards received for a season |
| `chances_created` | `player` - `statistics` | Integer | Player chances created for a season |
| `clean_sheets` | `player` - `statistics` | Integer | Player clean sheets for a season |
| `clearances` | `player` - `statistics` | Integer | Player clearances for a season |
| `corner_kicks` | `player` - `statistics` | Integer | Player corner kicks for a season |
| `crosses_successful` | `player` - `statistics` | Integer | Player successful crosses for a season |
| `crosses_total` | `player` - `statistics` | Integer | Player total crosses for a season |
| `defensive_blocks` | `player` - `statistics` | Integer | Player defensive blocks for a season |
| `dribbles_completed` | `player` - `statistics` | Integer | Player dribbles completed for a season |
| `fouls_committed` | `player` - `statistics` | Integer | Player fouls committed for a season |
| `fouls_won` | `player` - `statistics` | Integer | Player fouls committed for a season |
| `goals_by_head` | `player` - `statistics` | Integer | Player goals by head scored for a season |
| `goals_by_penalty` | `player` - `statistics` | Integer | Player goals by penalty scored for a season |
| `goals_conceded` | `player` - `statistics` | Integer | Player goals conceded for a season |
| `goals_scored` | `player` - `statistics` | Integer | Player goals scored for a season |
| `interceptions` | `player` - `statistics` | Integer | Player interceptions for a season |
| `long_passes_successful` | `player` - `statistics` | Integer | Player successful long passes for a season |
| `long_passes_total` | `player` - `statistics` | Integer | Player total long passes for a season |
| `long_passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful long passes for a season |
| `loss_of_possession` | `player` - `statistics` | Integer | Player possession losses for a season |
| `matches_played` | `player` - `statistics` | Integer | Number of matches played by a player for a season |
| `minutes_played` | `player` - `statistics` | Integer | Number of minutes played by a player for a season |
| `offsides` | `player` - `statistics` | Integer | Player offsides for a season |
| `own_goals` | `player` - `statistics` | Integer | Player own goals for a season |
| `passes_successful` | `player` - `statistics` | Integer | Player successful passes for a season |
| `passes_total` | `player` - `statistics` | Integer | Player total passes for a season |
| `passes_unsuccessful` | `player` - `statistics` | Integer | Player unsuccessful passes for a season |
| `penalties_missed` | `player` - `statistics` | Integer | Player penalty shots missed for a season |
| `penalties_saved` | `player` - `statistics` | Integer | Player penalty shots saved for a season |
| `red_cards` | `player` - `statistics` | Integer | Player red cards for a season |
| `shots_blocked` | `player` - `statistics` | Integer | Player shots blocked for a season |
| `shots_off_target` | `player` - `statistics` | Integer | Player shots off target for a season |
| `shots_on_target` | `player` - `statistics` | Integer | Player shots on target for a season |
| `substituted_in` | `player` - `statistics` | Integer | Number of times a player is substituted in for a season |
| `substituted_out` | `player` - `statistics` | Integer | Number of times a player is substituted out for a season |
| `tackles_successful` | `player` - `statistics` | Integer | Player successful tackles for a season |
| `tackles_total` | `player` - `statistics` | Integer | Player total tackles for a season |
| `yellow_cards` | `player` - `statistics` | Integer | Player yellow cards for a season |
| `yellow_red_cards` | `player` - `statistics` | Integer | Player red cards for a match resulting from two yellow cards |

### Season Stats (Team)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `average_ball_possession` | `competitor` - `statistics` | Float | Percentage of team ball possession for a season<br /><br />ex. `65.53` |
| `cards_given` | `competitor` - `statistics` | Integer | Total cards given to a team in a season |
| `chances_created` | `competitor` - `statistics` | Integer | Total chances created for a team in a season |
| `clearances` | `competitor` - `statistics` | Integer | Total clearances for a team in a season |
| `corner_kicks` | `competitor` - `statistics` | Integer | Total team corner kicks for a season |
| `crosses_successful` | `competitor` - `statistics` | Integer | Total team successful crosses for a season |
| `crosses_total` | `competitor` - `statistics` | Integer | Total team crosses for a season |
| `crosses_unsuccessful` | `competitor` - `statistics` | Integer | Total team unsuccessful crosses for a season |
| `defensive_blocks` | `competitor` - `statistics` | Integer | Total defensive blocks for a team in a season |
| `diving_saves` | `competitor` - `statistics` | Integer | Total diving saves for a team in a season |
| `dribbles` | `competitor` - `statistics` | Integer | Total dribbles for a team in a season |
| `free_kicks` | `competitor` - `statistics` | Integer | Team free kicks for a season. In accordance with the rules, a free kick stat is counted for the team who executes a free kick. Direct or indirect free kicks are all counted as free kicks. |
| `goals_by_foot` | `competitor` - `statistics` | Integer | Team goals scored by foot for a season |
| `goals_by_head` | `competitor` - `statistics` | Integer | Team goals scored by head for a season |
| `goals_conceded` | `competitor` - `statistics` | Integer | Team goals conceded for a season |
| `goals_conceded_first_half` | `competitor` - `statistics` | Integer | Team goals conceded in the first half for a season |
| `goals_conceded_second_half` | `competitor` - `statistics` | Integer | Team goals conceded in the second half for a season |
| `goals_scored` | `competitor` - `statistics` | Integer | Total team goals scored for a season |
| `goals_scored_first_half` | `competitor` - `statistics` | Integer | Total team goals scored in the first half for a season |
| `goals_scored_second_half` | `competitor` - `statistics` | Integer | Total team goals scored in the second half for a season |
| `interceptions` | `competitor` - `statistics` | Integer | Total interceptions for a team in a season |
| `long_passes_successful` | `competitor` - `statistics` | Integer | Total team successful long passes for a season |
| `long_passes_total` | `competitor` - `statistics` | Integer | Total team long passes for a season |
| `long_passes_unsuccessful` | `competitor` - `statistics` | Integer | Total team unsuccessful long passes for a season |
| `loss_of_possession` | `competitor` - `statistics` | Integer | Total team possession losses for a season |
| `matches_played` | `competitor` - `statistics` | Integer | Number of matches played for a team in a season |
| `offsides` | `competitor` - `statistics` | Integer | Total team offside infringements for a season |
| `passes_successful` | `competitor` - `statistics` | Integer | Total team successful passes for a season |
| `passes_total` | `competitor` - `statistics` | Integer | Total team passes for a season |
| `passes_unsuccessful` | `competitor` - `statistics` | Integer | Total team unsuccessful passes for a season |
| `penalties_missed` | `competitor` - `statistics` | Integer | Total team penalty shots missed for a season |
| `red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a season |
| `shots_blocked` | `competitor` - `statistics` | Integer | Total team shots blocked for a season |
| `shots_off_target` | `competitor` - `statistics` | Integer | Total team off-target shots for a season |
| `shots_on_bar` | `competitor` - `statistics` | Integer | Total team on-bar shots for a season |
| `shots_on_post` | `competitor` - `statistics` | Integer | Total team on-post shots for a season |
| `shots_on_target` | `competitor` - `statistics` | Integer | Total team on-target shots for a season |
| `shots_total` | `competitor` - `statistics` | Integer | Total number of shots attributed to a team for a season |
| `tackles_successful` | `competitor` - `statistics` | Integer | Total team successful tackles for a season |
| `tackles_total` | `competitor` - `statistics` | Integer | Total team tackles for a season |
| `tackles_unsuccessful` | `competitor` - `statistics` | Integer | Total team unsuccessful tackles for a season |
| `was_fouled` | `competitor` - `statistics` | Integer | Total number of fouls against a team in a season |
| `yellow_cards` | `competitor` - `statistics` | Integer | Total team yellow cards for a season |
| `yellow_red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a season which resulted from two yellow cards |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-season-info`), Season (`soccer-extended-seasonal-competitor-extended-stati`), Player (`soccer-extended-live-timelines`).
