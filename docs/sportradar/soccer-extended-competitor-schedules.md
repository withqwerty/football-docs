---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitor-schedules
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Competitor Schedules

**Soccer Extended Competitor Schedules** provides all upcoming scheduled matches and results for the past 30 matches for a given team.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Loading Fixtures
>
> Learn how to use Competitor Schedules to display a team's upcoming and past matches in our [Fixtures (Schedules)](https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures) integration scenario.

***

## Data Points

### Category & Sport

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `sport_event_context` - `category` | String | Country code for a sport event's category<br /><br />ex. `ENG` (England) |
| `id` | `sport_event_context` - `category` | String | Unique category ID for a sport event<br /><br />ex. `sr:category:1` |
| `name` | `sport_event_context` - `category` | String | Name for a sport event's category<br /><br />ex. `England` (Premier League) |
| `id` | `sport_event_context` - `sport` | String | Unique sport ID for a sport event<br /><br />ex. `sr:sport:1` |
| `name` | `sport_event_context` - `sport` | String | Name for a sport event's sport<br /><br />ex. `Soccer` |

### Competition

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `alternative_name` | `sport_event_context` - `competition` | String | Alternate name of a competition<br /><br />ex. `English Premier League` (instead of `Premier League`) |
| `gender` | `sport_event_context` - `competition` | String | Gender for a competition<br /><br />ex. `men` |
| `id` | `sport_event_context` - `competition` | String | Unique ID for a competition<br /><br />ex. `sr:competition:17` (Premier League) |
| `name` | `sport_event_context` - `competition` | String | Name of a competition<br /><br />ex. `Premier League` |
| `parent_id` | `sport_event_context` - `competition` | String | Unique parent ID for a competition. Typically present for group stage or playoff competitions <br /><br />ex. `sr:competition:945` used to link competitions together, like the World Cup and the various qualifiers. |

### Group

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `sport_event_context` - `groups` - `group` | String | Unique ID for a sport event's group<br /><br />ex. `sr:league:80253` (UEFA Euro 2024, Group D) |
| `name` | `sport_event_context` - `groups` - `group` | String | Name of a sport event's group<br /><br />ex. `UEFA Euro 2024, Group D` |
| `group_name` | `sport_event_context` - `groups` - `group` | String | Abbreviated name of a sport event's group<br /><br />ex. `D` |

### Round

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `competition_sport_event_number` | `sport_event_context` - `round` | Integer | Sport event number within a competition. Used for competitions that have fixed match numbers (World Cup) |
| `cup_round_id` | `sport_event_context` - `round` | String | Unique ID for a sport event's cup round<br /><br />ex. `sr:cup_round:1988995` |
| `cup_round_number_of_sport_events` | `sport_event_context` - `round` | Integer | Number of events in a sport event's round |
| `cup_round_sport_event_number` | `sport_event_context` - `round` | Integer | Number within the `cup_round` of a match ID. For example, 1st leg of 2 |
| `name` | `sport_event_context` - `round` | String | Name of a sport event's round<br /><br />ex. `round_3` or `round_of_16` |
| `number` | `sport_event_context` - `round` | Integer | Number of a sport event's round |
| `other_sport_event_id` | `sport_event_context` - `round` | String | A linked sport event ID, typically in a two-legged tie<br /><br />ex. `sr:sport_event:47395897` |

### Season

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `competition_id` | `sport_event_context` - `season` | String | Unique ID for the competition a sport event belongs to<br /><br />ex. `sr:competition:17` (Premier League) |
| `disabled` | `sport_event_context` - `season` | Boolean | Signifies a season has been disabled when `true` |
| `end_date` | `sport_event_context` - `season` | Date | End date of a sport event's season<br /><br />ex. `2024-05-19` |
| `id` | `sport_event_context` - `season` | String | Unique ID for a sport event's season<br /><br />ex. `sr:season:105353` (Premier League 23/24) |
| `name` | `sport_event_context` - `season` | String | Name of a sport event's season<br /><br />ex. `Premier League 23/24` |
| `start_date` | `sport_event_context` - `season` | Date | Start date of a sport event's season<br /><br />ex. `2023-08-11` |
| `year` | `sport_event_context` - `season` | String | Year of a sport event's season<br /><br />ex. `23/24` |

### Stage

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `end_date` | `sport_event_context` - `stage` | Date | End date of a sport event's stage<br /><br />ex. `2024-05-19` |
| `order` | `sport_event_context` - `stage` | Integer | Order of a stage within a season |
| `phase` | `sport_event_context` - `stage` | String | Name of a sport event's stage<br /><br />ex. `regular season`, `preliminary_round`, `qualification` |
| `start_date` | `sport_event_context` - `stage` | Date | Start date of a sport event's stage<br /><br />ex. `2023-08-11` |
| `type` | `sport_event_context` - `stage` | String | Type of a sport event's stage<br /><br />`cup`, `league` |
| `year` | `sport_event_context` - `stage` | String | Year of a sport event's stage<br /><br />ex. `23/24` |

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
| `qualifier` | `competitors` - `competitor` | String | Designation of a competitor for a sport event<br /><br />`home`, `away` |
| `virtual` | `competitors` - `competitor` | Boolean | Signifies a competitor is a virtual team when `true`. Used for placeholder teams in TBD vs TBD matchups. |

### Sport Event

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `count` | `sport_event_conditions` - `attendance` | Integer | Attendance for a sport event<br /><br />ex. `25078` |
| `neutral` | `sport_event_conditions` - `ground` | Boolean | Signifies a neutral ground sport event when `true` |
| `confirmed` | `sport_event_conditions` - `lineups` | Boolean | Signifies lineups for a sport event have been confirmed when `true` |
| `id` | `sport_event` | String | Unique ID of a sport event<br /><br />ex. `sr:sport_event:47395897` |
| `replaced_by` | `sport_event` | String | An alternative sport event ID if the match is postponed and played at a later date<br /><br />ex. `sr:sport_event:47395897` |
| `resume_time` | `sport_event` | Date | An updated timestamp if there is a delay at the start or interruption during a match<br /><br />ex. `2024-03-26T20:00:00+00:00` |
| `start_time` | `sport_event` | Date | Start time of a sport event<br /><br />ex. `2024-03-26T20:00:00+00:00` |
| `start_time_confirmed` | `sport_event` | Boolean | Signifies the start time of a sport event is confirmed when `true` |
| `date_confirmed` | `sport_event` | Boolean | Indicates whether the event date is confirmed (`true`). This applies when the calendar day is finalized, but the exact start time has not yet been determined. |
| `overall_conditions` | `sport_event_conditions` - `weather` | String | Weather conditions for a sport event<br /><br />`good`, `medium`, `bad`, `indoor`, `extreme` |
| `pitch_conditions` | `sport_event_conditions` - `weather` | String | Pitch conditions for a sport event<br /><br />`good`, `medium`, `bad` |

### Sport Event - Channel

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country` | `sport_event` - `channels` - `channel` | String | Country of a broadcast channel<br /><br />ex. `United States` |
| `country_code` | `sport_event` - `channels` - `channel` | String | Country code of a broadcast channel<br /><br />ex. `USA` |
| `name` | `sport_event` - `channels` - `channel` | String | Name of a broadcast channel<br /><br />ex. `Fox Soccer Plus` |
| `url` | `sport_event` - `channels` - `channel` | String | URL of a broadcast channel |

### Sport Event - Referee

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `sport_event_conditions` - `referees` - `referee` | String | Unique ID for a referee<br /><br />ex. `sr:referee:229470` |
| `name` | `sport_event_conditions` - `referees` - `referee` | String | Name of a referee<br /><br />ex. `Brooks, John` |
| `nationality` | `sport_event_conditions` - `referees` - `referee` | String | Nationality of a referee<br /><br />ex. `England` |
| `country_code` | `sport_event_conditions` - `referees` - `referee` | String | Country code of a referee<br /><br />ex. `ENG` |
| `type` | `sport_event_conditions` - `referees` - `referee` | String | Type of a referee<br /><br />ex. `first_assistant_referee`, `second_assistant_referee`, `fourth_official`, `video_assistant_referee`, `first_additional_assistant`, `second_additional_assistant`, `main_referee` |

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
| `lineups` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies goal lineups are available for a sport event when `true` |
| `lineups_availability` | `sport_event` - `coverage` - `sport_event_properties` | String | Describes the availability of lineups as pre-match or post-match<br /><br />`pre`, `post` |
| `probabilities` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies probabilities are available for a sport event when `true`<br /><br /><i><b>Note:</b> Attribute is not currently supported</i> |
| `scores` | `sport_event` - `coverage` - `sport_event_properties` | String | Describes the availability of scores as live or post-match<br /><br />`live`, `post` |
| `venue` | `sport_event` - `coverage` - `sport_event_properties` | Boolean | Signifies venue info is available for a sport event when `true` |

### Sport Event Situation

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `status` | `sport_event_status` - `match_situation` | String | Current situation status of a match<br /><br />`safe`, `dangerous`, `attack` |
| `qualifier` | `sport_event_status` - `match_situation` | String | Defines the team in the current situation status<br /><br />`home`, `away` |
| `updated_at` | `sport_event_status` - `match_situation` | Date-Time | Timestamp of the most recent match situation update<br /><br />ex. `2024-04-14T14:57:28+00:00` |
| `away_score` | `sport_event_status` - `period_scores` - `period_score` | Integer | Away team period score |
| `home_score` | `sport_event_status` - `period_scores` - `period_score` | Integer | Home team period score |
| `number` | `sport_event_status` - `period_scores` - `period_score` | Integer | Period number |
| `type` | `sport_event_status` - `period_scores` - `period_score` | String | Period type<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |

### Sport Event Status

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `aggregate_away_score` | `sport_event_status` | Integer | Aggregate score (of multiple sport events) for the away team |
| `aggregate_home_score` | `sport_event_status` | Integer | Aggregate score (of multiple sport events) for the home team |
| `aggregate_winner_id` | `sport_event_status` | String | Unique ID of the aggregate score winner<br /><br />ex. `sr:competitor:44` |
| `away_normaltime_score` | `sport_event_status` | Integer | Score for the away team in normal time |
| `away_overtime_score` | `sport_event_status` | Integer | Score for the away team in overtime |
| `away_score` | `sport_event_status` | Integer | Total score for the away team in the match |
| `home_normaltime_score` | `sport_event_status` | Integer | Score for the home team in normal time |
| `home_overtime_score` | `sport_event_status` | Integer | Score for the home team in overtime |
| `home_score` | `sport_event_status` | Integer | Total score for the home team in the match |
| `decided_by_fed` | `sport_event_status` | Boolean | Signifies a match result was decided by the federation when `true`. For example, incomplete due to crowd disruption |
| `match_status` | `sport_event_status` | String | Status within a match. Provides more detail on the state of a match when live than `status`<br /><br />ex. `not_started`, `2nd_half`, `ended`, `awaiting_penalties`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#sport-statuses) for a complete list of statuses and their definitions. |
| `match_tie` | `sport_event_status` | Boolean | Signifies a match ended in a tie when `true` |
| `scout_abandoned` | `sport_event_status` | Boolean | Signifies a match was abandoned by a scout when `true` |
| `status` | `sport_event_status` | String | Status of a match<br /><br />ex. `not_started`, `live`, `ended`, `awaiting_penalties`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#sport-statuses) for a complete list of statuses and their definitions. |
| `winner_id` | `sport_event_status` | String | Unique ID of the match winner<br /><br />ex. `sr:competitor:44` |

### Ball Location

> Visit our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location data.

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `order` | `sport_event_status` - `ball_locations` - `ball_location` | Integer | Sequential order of a ball location event. The most recent location is `4` and the oldest location is `1`. |
| `qualifier` | `sport_event_status` - `ball_locations` - `ball_location` | String | Designation of a competitor for a ball location entry<br /><br />`home`, `away` |
| `x` | `sport_event_status` - `ball_locations` - `ball_location` | String | Horizontal X coordinate of the pitch. `x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. |
| `y` | `sport_event_status` - `ball_locations` - `ball_location` | String | Vertical Y coordinate of the pitch. `y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. |

### Venue

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `capacity` | `venue` | Integer | Capacity of a venue<br /><br />ex. `60000` |
| `changed` | `venue` | Boolean | Signifies a venue has been changed when `true` |
| `city_id` | `venue` | String | Unique ID of a city<br /><br />ex. `sr:city:59` |
| `city_name` | `venue` | String | City name of a venue<br /><br />ex. `Liverpool` |
| `country_code` | `venue` | String | Country code of a venue<br /><br />ex. `ENG` (England) |
| `country_name` | `venue` | String | Country name of a venue<br /><br />ex. `England` |
| `id` | `venue` | String | Unique ID of a venue<br /><br />ex. `sr:venue:579` |
| `map_coordinates` | `venue` | String | Coordinates of a venue<br /><br />ex. `53.430622,-2.960919` |
| `name` | `venue` | String | Name of a venue<br /><br />ex. `Anfield` |
| `reduced_capacity` | `venue` | Boolean | Optional attribute signifying a venue has a restricted capacity when `true` |
| `reduced_capacity_max` | `venue` | Integer | Value of a venue's restricted capacity |
| `timezone` | `venue` | String | Timezone of a venue<br /><br />ex. `Europe/London` |
