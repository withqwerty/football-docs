---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-league-timeline
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# League Timeline

**Soccer Extended League Timeline** provides an alternate set of statistics for an event which match official league sites.<br><br>Official stats are provided for: England Premier League, Germany Bundesliga, Italy Serie A, Spain La Liga, UEFA Champions League, USA MLS, Austria Bundesliga.p

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Tracking a Single Match
>
> Learn how match statistics aligned with official league sites fit into match coverage in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

***

## Data Points

### Sport Event Situation

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `played` | `sport_event_status` - `clock` | String | Match clock time in minutes<br /><br />`90:00` |
| `stoppage_time_played` | `sport_event_status` - `clock` | String | Stoppage time played in minutes<br /><br />`5:49` |
| `stoppage_time_announced` | `sport_event_status` - `clock` | String | Stoppage time announced in minutes<br /><br />`5:00` |
| `status` | `sport_event_status` - `match_situation` | String | Current situation status of a match<br /><br />`safe`, `dangerous`, `attack` |
| `qualifier` | `sport_event_status` - `match_situation` | String | Defines the team in the current situation status<br /><br />`home`, `away` |
| `updated_at` | `sport_event_status` - `match_situation` | Date-Time | Timestamp of the most recent match situation update<br /><br />ex. `2024-04-14T14:57:28+00:00` |
| `away_score` | `sport_event_status` - `period_scores` - `period_score` | Integer | Away team period score |
| `home_score` | `sport_event_status` - `period_scores` - `period_score` | Integer | Home team period score |
| `number` | `sport_event_status` - `period_scores` - `period_score` | Integer | Period number |
| `type` | `sport_event_status` - `period_scores` - `period_score` | String | Period type<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |

### Ball Location

> Visit our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#ball-location) for additional information on ball location data.

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `order` | `sport_event_status` - `ball_locations` - `ball_location` | Integer | Sequential order of a ball location event. The most recent location is `4` and the oldest location is `1`. |
| `qualifier` | `sport_event_status` - `ball_locations` - `ball_location` | String | Designation of a competitor for a ball location entry<br /><br />`home`, `away` |
| `x` | `sport_event_status` - `ball_locations` - `ball_location` | String | Horizontal X coordinate of the pitch. `x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. |
| `y` | `sport_event_status` - `ball_locations` - `ball_location` | String | Vertical Y coordinate of the pitch. `y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. |

### Match Timeline

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `away_score` | `league_timeline` - `event` | Integer | Score for the away team after a timeline event |
| `break_name` | `league_timeline` - `event` | String | Brief description of a break event<br /><br />ex. `pause` |
| `card_description` | `league_timeline` - `event` | String | Description of the scenario during a card event<br /><br />ex. `pre_match`, `half_time`, `post_match`, `player_on_bench`, `first_half`, `second_half`, `during_penalty_shootout` |
| `text` | `league_timeline` - `event` - `commentary` | String | Description of the scenario during a card event<br /><br />Commentary text description of a timeline event<br /><br />ex. `Mario Hermoso (Atletico) has received a yellow card from Slavko Vincic.` or `It's a goal kick for the home team in Dortmund.` |
| `competitor` | `league_timeline` - `event` | String | Designation of a competitor for a timeline event<br /><br />`home`, `away` |
| `description` | `league_timeline` - `event` | String | Description of an event.<br /><br />*This data point is not currently in use* |
| `home_score` | `league_timeline` - `event` | Integer | Score for the home team after a timeline event |
| `id` | `league_timeline` - `event` | Integer | Unique ID for a timeline event<br /><br />ex. `1721786685` |
| `injury_time_announced` | `league_timeline` - `event` | Integer | Amount of injury time announced in minutes |
| `late` | `league_timeline` - `event` | Boolean | Indicates the incoming substitute was temporarily prevented from entering the field because the replaced player did not leave the field within the time allowed. When `true`, the team briefly plays with one fewer player before the substitution is completed. |
| `match_clock` | `league_timeline` - `event` | String | Match clock value for a timeline event, in minutes and seconds<br /><br />ex. `89:37` |
| `match_time` | `league_timeline` - `event` | Integer | Match clock value of a timeline event, in minutes<br /><br />ex. `89` |
| `method` | `league_timeline` - `event` | String | Method of a scored goal<br /><br />`penalty`, `own_goal`, `header`, `shot`, `free_kick`, `corner` |
| `outcome` | `league_timeline` - `event` | String | Outcome of a missed goal<br /><br />`miss`, `post`, `bar` |
| `period` | `league_timeline` - `event` | Integer | Period number of a timeline event |
| `period_name` | `league_timeline` - `event` | String | Period name of a timeline event, appearing at the beginning of a period<br /><br />ex. `regular_period` |
| `period_type` | `league_timeline` - `event` | String | Period type of a timeline event<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |
| `shootout_away_score` | `league_timeline` - `event` | Integer | Away team shootout score after a timeline event |
| `shootout_home_score` | `league_timeline` - `event` | Integer | Home team shootout score after a timeline event |
| `status` | `league_timeline` - `event` | String | Status available during penalty shootouts (`period_type="penalties"`)<br /><br />ex. `missed`, `scored`, `not_taken_yet` |
| `stoppage_time` | `league_timeline` - `event` | Integer | Stoppage time value for a timeline event<br /><br /> ex. `3` |
| `stoppage_time_clock` | `league_timeline` - `event` | String | Stoppage time clock value for a timeline event<br /><br />ex. `2:03` |
| `type` | `league_timeline` - `event` | String | Type of timeline event. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#event--period-types) for a complete list of event types<br /><br />ex. `goal_kick`, `period_start`, `yellow_card` |
| `time` | `league_timeline` - `event` | Date-time | UTC timestamp indicating when the timeline event was created or most recently updated in our system. This reflects system processing time, not the time the event occurred on the pitch. The timestamp may lag behind the actual event—typically by a short interval during live play, or by minutes to hours for later additions and corrections.<br /><br />When the record is first created, this value reflects its creation time. If the record is later updated, the value is replaced with the latest update time and no longer preserves the original creation time.<br /><br />ex. `2024-04-16T20:49:49+00:00` |
| `x` | `league_timeline` - `event` | Integer | Horizontal X coordinate of a timeline event. `x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. |
| `y` | `league_timeline` - `event` | Integer | Vertical Y coordinate of a timeline event. `y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. |

### Player Event Details

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `event` - `player` | String | Unique player Id associated with a timeline event<br /><br />ex. `sr:player:2367105` |
| `name` | `event` - `player` | String | Player name associated with a timeline event<br /><br />ex. `Luna, Diego` |
| `type` | `event` - `player` | String | Player activity type associated with a timeline event. Signifies if a player scored a goal, recorded an assist, or participated in a substitution.<br /><br />ex. `scorer`, `assist`, `substituted_in`, `substituted_out` |

### Match Stats (Player)

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `player` - `statistics` | Integer | Player assists for a match |
| `corner_kicks` | `player` - `statistics` | Integer | Player corner kicks for a match |
| `goals` | `player` - `statistics` | Integer | Player goals scored for a match |
| `offsides` | `player` - `statistics` | Integer | Player offsides for a match |
| `own_goals` | `player` - `statistics` | Integer | Player own goals for a match |
| `red_cards` | `player` - `statistics` | Integer | Player red cards for a match |
| `substituted_in` | `player` - `statistics` | Integer | Signifies a player was substituted in during a match when `1` |
| `substituted_out` | `player` - `statistics` | Integer | Signifies a player was substituted out during a match when `1` |
| `yellow_cards` | `player` - `statistics` | Integer | Player yellow cards for a match |
| `yellow_red_cards` | `player` - `statistics` | Integer | Player red cards for a match resulting from two yellow cards |

### Match Stats (Team)

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `competitor` - `statistics` | Integer | Total team assists for a match |
| `corner_kicks` | `competitor` - `statistics` | Integer | Total team corner kicks for a match |
| `goals` | `competitor` - `statistics` | Integer | Team goals for a match |
| `red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a match |
| `shots_on_goal` | `competitor` - `statistics` | Integer | Total team shots on goal for a match |
| `substitutions` | `competitor` - `statistics` | Integer | Total number player substitutions in a match |
| `yellow_cards` | `competitor` - `statistics` | Integer | Total team yellow cards for a match |
| `yellow_red_cards` | `competitor` - `statistics` | Integer | Total team red cards for a match which resulted from two yellow cards |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Player (`soccer-extended-competitor-summaries`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Status (`soccer-extended-competitor-schedules`), Venue (`soccer-extended-competitor-schedules`).
