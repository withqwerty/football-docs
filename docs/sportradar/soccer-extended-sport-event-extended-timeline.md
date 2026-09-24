---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-extended-timeline
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.197Z
---
# Sport Event Extended Timeline

**Soccer Extended Sport Event Extended Timeline** provides a real-time event timeline for a given match. "Extended" data includes passes, tackles, dribbles, interceptions, x/y coordinates, and event metadata.<br><br>Data will only be returned for matches covered with "Extended" data. A match will have `extended_play_by_play="true"` if this is available.

  ### Update Frequency

  1s Time To Live / Cache

> 📘 Tracking a Single Match
>
> Learn how to use the Sport Event Extended Timeline for deeper event detail in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

***

## Data Points

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

### Sport Event Status

| Attribute                | Parent Element          | Type    | Description |
|--------------------------|------------------------|---------|-------------|
| `aggregate_away_score`    | `sport_event_status`    | Integer | Aggregate score (of multiple sport events) for the away team |
| `aggregate_home_score`    | `sport_event_status`    | Integer | Aggregate score (of multiple sport events) for the home team |
| `aggregate_winner_id`     | `sport_event_status`    | String  | Unique ID of the aggregate score winner<br /><br />ex. `sr:competitor:44` |
| `away_normaltime_score`   | `sport_event_status`    | Integer | Score for the away team in normal time |
| `away_overtime_score`     | `sport_event_status`    | Integer | Score for the away team in overtime |
| `away_score`              | `sport_event_status`    | Integer | Total score for the away team in the match |
| `home_normaltime_score`   | `sport_event_status`    | Integer | Score for the home team in normal time |
| `home_overtime_score`     | `sport_event_status`    | Integer | Score for the home team in overtime |
| `home_score`              | `sport_event_status`    | Integer | Total score for the home team in the match |
| `decided_by_fed`          | `sport_event_status`    | Boolean | Signifies a match result was decided by the federation when `true`. For example, incomplete due to crowd disruption |
| `match_status`            | `sport_event_status`    | String  | Status within a match. Provides more detail on the state of a match when live than `status`<br /><br />ex. `not_started`, `2nd_half`, `ended`, `awaiting_penalties`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#sport-statuses) for a complete list of statuses and their definitions. |
| `match_tie`               | `sport_event_status`    | Boolean | Signifies a match ended in a tie when `true` |
| `scout_abandoned`         | `sport_event_status`    | Boolean | Signifies a match was abandoned by a scout when `true` |
| `status`                  | `sport_event_status`    | String  | Status of a match<br /><br />ex. `not_started`, `live`, `ended`, `awaiting_penalties`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#sport-statuses) for a complete list of statuses and their definitions. |
| `winner_id`               | `sport_event_status`    | String  | Unique ID of the match winner<br /><br />ex. `sr:competitor:44` |

### Match Timeline

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `action_type` | `timeline` - `event` | String | The length or type of a `pass` event<br /><br />`regular`, `side`, `long`, `ground`, `aerial`, `collapse`, `diving`, `kneeling`, `overhead`, `standing` |
| `additional_outcome` | `timeline` - `event` | String | Additional outcome detail of a shot event<br /><br />`hit_woodwork`, `goal`, `saved`, `goal_prevented` |
| `away_score` | `timeline` - `event` | Integer | Score for the away team after a timeline event |
| `body_type` | `timeline` - `event` | String | Part of the body used for a shot event<br /><br />`left_foot`, `right_foot`, `head`, `upper_body`, `lower_body`, `other` |
| `break_name` | `timeline` - `event` | String | Brief description of a break event<br /><br />ex. `pause`, `first_half_break` |
| `card_description` | `timeline` - `event` | String | Description of the scenario during a card event<br /><br />ex. `pre_match`, `half_time`, `post_match`, `player_on_bench`, `first_half`, `second_half`, `during_penalty_shootout` |
| `text` | `timeline` - `event` - `commentary` | String | Commentary description of a timeline event<br /><br />ex. `New England Revolution continues to press, having just had a goal attempt in the 21st minute but was unable to extend their lead beyond the current 2-0 scoreline against Nashville SC.` |
| `competitor` | `timeline` - `event` | String | Designation of a competitor for a timeline event<br /><br />`home`, `away` |
| `corner_type` | `timeline` - `event` | String | Type of corner shot<br /><br />`short`, `direct_into_penalty_area`, `edge_of_penalty_area` |
| `counterattack` | `timeline` - `event` | Boolean | Signifies an event was a counter-attack when `true` |
| `decision` | `timeline` - `event` | String | Decision of a VAR timeline event<br /><br />`pending`, `cancelled`, `upheld`, `overturned`<br /><br /><i>**Not currently supported**</i> |
| `description` | `timeline` - `event` | String | Result of a VAR timeline event<br /><br />`goal`, `penalty`, `red_card`, `no_goal`, `no_penalty`, `no_red_card`, `corner`, `no_corner`, `mistaken_identity`, `no_mistaken_identity` |
| `destination_x` | `timeline` - `event` | Integer | Ending horizontal X coordinate of a completed pass timeline event.<br /><br />`x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location. |
| `destination_y` | `timeline` - `event` | Integer | Ending vertical Y coordinate of a completed pass timeline event.<br /><br />`y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location. |
| `direction` | `timeline` - `event` | String | Direction of a pass<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i><br /><br />`forward`, `diagonal`, `sideways_left`, `sideways_right`, `backward` |
| `goalface_x` | `timeline` - `event` | Integer | Goalface x coordinate of a shot attempt |
| `goalface_y` | `timeline` - `event` | Integer | Goalface y coordinate of a shot attempt |
| `home_score` | `timeline` - `event` | Integer | Score for the home team after a timeline event |
| `id` | `timeline` - `event` | Integer | Unique ID for a timeline event<br /><br />ex. `1721786685` |
| `in_penalty_area` | `timeline` - `event` | Boolean | Signifies a shot was taken inside the penalty area when `true` |
| `injury_time_announced` | `timeline` - `event` | Integer | Amount of injury time announced in minutes |
| `late` | `league_timeline` - `event` | Boolean | Indicates the incoming substitute was temporarily prevented from entering the field because the replaced player did not leave the field within the time allowed. When `true`, the team briefly plays with one fewer player before the substitution is completed. |
| `match_clock` | `timeline` - `event` | String | Match clock value for a timeline event, in minutes and seconds<br /><br />ex. `89:37` |
| `match_time` | `timeline` - `event` | Integer | Match clock value of a timeline event, in minutes<br /><br />ex. `89` |
| `method` | `timeline` - `event` | String | Method of a scored goal<br /><br />`penalty`, `own_goal`, `header`, `shot`, `free_kick`, `corner` |
| `outcome` | `timeline` - `event` | String | Outcome of a missed goal<br /><br />`bar`, `complete`, `deflected_on_target`, `deflected_off_target`, `incomplete`, `interrupted`, `miss`, `out_of_play_interrupted`, `out_of_play_lost`, `on_target`, `off_target`, `own_goal`, `post`, `successful`, `unsuccessful` |
| `passing_range` | `timeline` - `event` | String | Range of a pass<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i><br /><br />`short`, `medium`, `long` |
| `period` | `timeline` - `event` | Integer | Period number of a timeline event |
| `period_name` | `timeline` - `event` | String | Period name of a timeline event, appearing at the beginning of a period<br /><br />ex. `regular_period` |
| `period_type` | `timeline` - `event` | String | Period type of a timeline event<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |
| `reason` | `timeline` - `event` | String | The offence committed for a card. See the `enum_reason_type` entry in the [Soccer OAS](https://api.sportradar.com/soccer-extended/trial/v4/openapi/swagger/index.html) for a complete list of reasons.<br /><br />ex. `serious_foul_play`, `tackle`, `handball` |
| `shootout_away_score` | `timeline` - `event` | Integer | Away team shootout score after a timeline event |
| `shootout_home_score` | `timeline` - `event` | Integer | Home team shootout score after a timeline event |
| `status` | `timeline` - `event` | String | Status available during penalty shootouts (`period_type="penalties"`)<br /><br />`missed`, `scored`, `not_taken_yet` |
| `stoppage_time` | `timeline` - `event` | Integer | Stoppage time value for a timeline event<br /><br /> ex. `3` |
| `stoppage_time_clock` | `timeline` - `event` | String | Stoppage time clock value for a timeline event<br /><br />ex. `2:03` |
| `time` | `timeline` - `event` | Date-time | UTC timestamp indicating when the timeline event was created or most recently updated in our system. This reflects system processing time, not the time the event occurred on the pitch. The timestamp may lag behind the actual event—typically by a short interval during live play, or by minutes to hours for later additions and corrections.<br /><br />When the record is first created, this value reflects its creation time. If the record is later updated, the value is replaced with the latest update time and no longer preserves the original creation time.<br /><br />ex. `2024-04-16T20:49:49+00:00` |
| `trajectory` | `timeline` - `event` | String | Trajectory of a pass<br /><br /><i>Currently only available in Bundesliga 2 (sr:competition:44) competitions</i><br /><br />`flat`, `high` |
| `type` | `timeline` - `event` | String | Type of timeline event. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#event-types) for a complete list of event types<br /><br />ex. `goal_kick`, `period_start`, `yellow_card` |
| `type_of_play` | `timeline` - `event` | String | Type of shot on goal<br /><br />`set_piece` (corners, free kicks, penalties), `open_play` (team passing sequences and transitions), `individual` (solo efforts) |
| `x` | `timeline` - `event` | Integer | Horizontal X coordinate of a timeline event. `x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location. |
| `xg_value` | `timeline` - `event` | Float | xG value of a shot on goal<br /><br />ex. `0.05` (low probability of a score) or `0.70` (higher probability of a score) |
| `y` | `timeline` - `event` | Integer | Vertical Y coordinate of a timeline event. `y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location. |

### Player Event Details

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `competitor_id` | `event` - `player` | String | Unique competitor (team) Id of a player associated with a timeline event<br /><br />ex. `sr:competitor:3138` |
| `id` | `event` - `player` | String | Unique player Id associated with a timeline event<br /><br />ex. `sr:player:2367105` |
| `name` | `event` - `player` | String | Player name associated with a timeline event<br /><br />ex. `Luna, Diego` |
| `type` | `event` - `player` | String | Player activity type associated with a timeline event. Activity types may signify a player scored a goal, recorded an assist, participated in a substitution, and more.<br /><br />`shot_taker`, `scorer`, `assist`, `substituted_in`, `substituted_out`, `fouler`, `fouled`, `passer`, `receiver`, `tackler`, `won_by`, `lost_by` |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event Situation (`soccer-extended-league-timeline`), Ball Location (`soccer-extended-competitor-schedules`), Venue (`soccer-extended-competitor-schedules`).
