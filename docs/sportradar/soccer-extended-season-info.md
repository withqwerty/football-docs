---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-info
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Info

**Soccer Extended Season Info** provides detailed information for a given season, including participating teams and coverage level.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Loading Season Details
>
> Learn how to use Season Info to read a season's structure and coverage in our [Fixtures (Schedules)](https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures) integration scenario.

***

## Data Points

### Category & Sport

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `season` - `category` | String | Country code for a season's category<br /><br />ex. `ENG` (England) |
| `id` | `season` - `category` | String | Unique category ID for a season<br /><br />ex. `sr:category:1` |
| `name` | `season` - `category` | String | Name for a season's category<br /><br />ex. `England` (Premier League) |
| `id` | `season` - `sport` | String | Unique sport ID for a season<br /><br />ex. `sr:sport:1` |
| `name` | `season` - `sport` | String | Name for a season's sport<br /><br />ex. `Soccer` |

### Competition

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `alternative_name` | `competition` | String | Alternate name of a competition<br /><br />ex. `English Premier League` (instead of `Premier League`) |
| `gender` | `season` - `competition` | String | Gender for a competition<br /><br />ex. `men` |
| `id` | `season` - `competition` | String | Unique ID for a competition<br /><br />ex. `sr:competition:17` (Premier League) |
| `name` | `season` - `competition` | String | Name of a competition<br /><br />ex. `Premier League` |
| `parent_id` | `season` - `competition` | String | Unique parent ID for a competition. Typically present for group stage or playoff competitions <br /><br />ex. `sr:competition:945` used to link competitions together, like the World Cup and the various qualifiers. |

### Competition - Coverage Properties

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `brackets` | `coverage` - `competition_properties` | Boolean | Signifies brackets in the [Season Links](https://developer.sportradar.com/soccer/reference/soccer-extended-season-links) endpoint are available for this season when `true` |
| `is_friendly` | `coverage` - `competition_properties` | Boolean | Signifies the competition is a friendly (exhibition) match when `true` |
| `missing_players` | `coverage` - `competition_properties` | Boolean | Signifies [missing players](https://developer.sportradar.com/soccer/reference/soccer-extended-season-missing-players) are available for this season when `true` |
| `player_transfer_history` | `coverage` - `competition_properties` | Boolean | Signifies player transfer history is available for this season when `true` |
| `schedules` | `coverage` - `competition_properties` | Boolean | Signifies a schedule of fixtures is available for this season when `true` |
| `season_player_statistics` | `coverage` - `competition_properties` | Boolean | Signifies seasonal player statistics are available for this season when `true` |
| `season_probabilities` | `coverage` - `competition_properties` | Boolean | Signifies [season probabilities](https://developer.sportradar.com/soccer/reference/soccer-extended-season-probabilities) are available for this season when `true` |
| `season_stat_leaders` | `coverage` - `competition_properties` | Boolean | Signifies [seasonal stat leaders](https://developer.sportradar.com/soccer/reference/soccer-extended-season-leaders) are available for this season when `true` |
| `season_team_statistics` | `coverage` - `competition_properties` | Boolean | Signifies [season team stats](https://developer.sportradar.com/soccer/reference/soccer-extended-seasonal-competitor-statistics) are available for this season when `true` |
| `standings` | `coverage` - `competition_properties` | String | Defines whether a season's standings are available live or post-match<br /><br />`live`, `post` |
| `team_squads` | `coverage` - `competition_properties` | Boolean | Signifies team squads are available for competitors within this season when `true` |

### Group

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `group_name` | `stage` - `groups` - `group` | String | Abbreviated name of a stage or season's group<br /><br />ex. `D` |
| `id` | `stage` - `groups` - `group` | String | Unique ID for a stage or season's group<br /><br />ex. `sr:league:80253` (UEFA Euro 2024, Group D) |
| `max_rounds` | `stage` - `groups` - `group` | Integer | Maximum number of rounds for a stage or season |
| `name` | `stage` - `groups` - `group` | String | Name of a stage or season's group<br /><br />ex. `UEFA Euro 2024, Group D` |
| `parent_group_id` | `stage` - `groups` - `group` | String | Unique parent ID for a stage or season's group |

### Season

| Attribute                    | Parent Element      | Type    | Description |
|-------------------------------|-------------------|---------|-------------|
| `competition_status`          | `season` - `info`  | String  | Status of a competition<br /><br />*Data point not currently in use* |
| `venue_reduced_capacity`      | `season` - `info`  | Boolean | Signifies venues within this competition have a reduced capacity when `true` |
| `venue_reduced_capacity_max`  | `season` - `info`  | Integer | Maximum capacity for a venue |
| `competition_id`              | `season`           | String  | Unique ID for the competition a sport event belongs to<br /><br />ex. `sr:competition:17` (Premier League) |
| `disabled`                    | `season`           | Boolean | Signifies a season has been disabled when `true` |
| `end_date`                    | `season`           | Date    | End date of a season<br /><br />ex. `2024-05-19` |
| `id`                          | `season`           | String  | Unique ID for a season<br /><br />ex. `sr:season:105353` (Premier League 23/24) |
| `name`                        | `season`           | String  | Name of a season<br /><br />ex. `Premier League 23/24` |
| `start_date`                  | `season`           | Date    | Start date of a season<br /><br />ex. `2023-08-11` |
| `year`                        | `season`           | String  | Year of a season<br /><br />ex. `23/24` |

### Stage

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `end_date` | `stage` | Date | End date of a season or stage<br /><br />ex. `2024-05-19`  |
| `order` | `stage` | Integer | Order of a stage within a season |
| `phase` | `stage` | String | Name of a season or stage<br /><br />ex. `regular season`, `preliminary_round`, `qualification` |
| `start_date` | `stage` | Date | Start date of a season or stage<br /><br />ex. `2023-08-11` |
| `type` | `stage` | String | Type of a season or stage<br /><br />`cup`, `league` |
| `year` | `stage` | String | Year of a season or stage<br /><br />ex. `23/24` |

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitors` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `competitors` - `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `competitors` - `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `competitors` - `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `competitors` - `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitors` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitors` - `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `other_season_id` | `competitors` - `competitor` | String | Present when a competitor is a part of a separate season. For example, Bundesliga Relegation Playoffs may include a team from Bundesliga.2<br /><br />ex. `sr:season:105937` |
| `qualifier` | `competitors` - `competitor` | String | Designation of a competitor for a season<br /><br />`home`, `away` |
| `virtual` | `competitors` - `competitor` | Boolean | Signifies a competitor is a virtual team when `true`. Used for placeholder teams in TBD vs TBD matchups. |

### Sport Event & Group - Coverage Properties

> Coverage information is available at the season level (`season_info.coverage`) and group level (`group.coverage`). Each are also distinguished by `coverage.type`

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `type` | `season_info` / `group` - `coverage` | String | Type of coverage<br /><br />`sport_event`, `group`, `competition` |
| `brackets` | `group` - `coverage` - `group_properties` | Boolean | Signifies brackets in the [Season Links](https://developer.sportradar.com/soccer/reference/soccer-extended-season-links) endpoint are available for this group when `true` |
| `cup` | `group` - `coverage` - `group_properties` | Boolean | Signifies the group is a cup style stage when `true` e.g. knockout format |
| `group_stage` | `group` - `coverage` - `group_properties` | Boolean | Signifies the group is a multi-group style stage when `true` e.g. 8 groups with standings |
| `league` | `group` - `coverage` - `group_properties` | Boolean | Signifies the group is a league style stage when `true` e.g. table with standings |
| `missing_players` | `group` - `coverage` - `group_properties` | Boolean | Signifies [missing players](https://developer.sportradar.com/soccer/reference/soccer-extended-season-missing-players) are available for this group when `true` |
| `qualification` | `group` - `coverage` - `group_properties` | Boolean | Signifies the group is a qualification stage when `true` |
| `results` | `group` - `coverage` - `group_properties` | Boolean | Signifies results for the schedule of fixtures will be available for this group when `true` |
| `schedules` | `group` - `coverage` - `group_properties` | Boolean | Signifies a schedule of fixtures is available for this group when `true` |
| `standings` | `group` - `coverage` - `group_properties` | Boolean | Defines whether a group's standings are available live or post-match<br /><br />`live`, `post` |
| `assists` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies assists are available for a group when `true` |
| `ballspotting` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies ballspotting is available for a group when `true` |
| `basic_play_by_play` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies basic play-by-play is available for a group when `true` |
| `basic_player_stats` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies basic player stats is available for a group when `true` |
| `basic_team_stats` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies basic team stats is available for a group when `true` |
| `commentary` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies commentary is available for a group when `true` |
| `deeper_play_by_play` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies deeper play-by-play is available for a group when `true` |
| `deeper_player_stats` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies deeper player stats is available for a group when `true` |
| `deeper_team_stats` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies deeper team stats is available for a group when `true` |
| `extended_player_stats` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies extended player stats is available for a group when `true` |
| `extended_team_stats` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies extended team stats is available for a group when `true` |
| `formations` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies team formations are available for a sport event when `true` |
| `fun_facts` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies fun facts are available for a group when `true` |
| `game_clock` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies the game clock is available for a group when `true` |
| `goal_scorers` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies goal scorers are available for a group when `true` |
| `goal_scorers_live` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies goal scorers are available live for a sport event when `true` |
| `lineups` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies goal lineups are available for a group when `true` |
| `lineups_availability` | `group` - `coverage` - `sport_event_properties` | String | Describes the availability of lineups as pre-match or post-match<br /><br />`pre`, `post` |
| `probabilities` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies probabilities are available for a group when `true` |
| `scores` | `group` - `coverage` - `sport_event_properties` | String | Describes the availability of scores as live or post-match<br /><br />`live`, `post` |
| `venue` | `group` - `coverage` - `sport_event_properties` | Boolean | Signifies venue info is available for a group when `true` |
