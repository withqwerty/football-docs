---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-timeline
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.199Z
---
# Sport Event Timeline

**Soccer Extended Sport Event Timeline** provides real-time match-level statistics and a play-by-play event timeline for a given match. This includes player and team stats, scoring info, channel availability, x/y event coordinates, and human-readable event descriptions. Please note that data returned is determined by coverage level.

  ### Update Frequency

  1s Time To Live / Cache

> 📘 Tracking a Single Match
>
> Learn how to use the Sport Event Timeline to reconstruct a match's full event history in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

***

## Data Points

### Competitor

> Competitor information appears in the `competitors` node under both `sport_event` and `statistics`

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

### Match Timeline

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `away_score` | `timeline` - `event` | Integer | Score for the away team after a timeline event |
| `break_name` | `timeline` - `event` | String | Brief description of a break event<br /><br />ex. `pause` |
| `card_description` | `timeline` - `event` | String | Description of the scenario during a card event<br /><br />ex. `pre_match`, `half_time`, `post_match`, `player_on_bench`, `first_half`, `second_half`, `during_penalty_shootout` |
| `text` | `timeline` - `event` - `commentary` | String | Description of the scenario during a card event<br /><br />Commentary text description of a timeline event<br /><br />ex. `Mario Hermoso (Atletico) has received a yellow card from Slavko Vincic.` or `It's a goal kick for the home team in Dortmund.` |
| `competitor` | `timeline` - `event` | String | Designation of a competitor for a timeline event<br /><br />`home`, `away` |
| `decision` | `timeline` - `event` | String | Decision of a VAR timeline event<br /><br />`pending`, `cancelled`, `upheld`, `overturned`<br /><br /><i>**Not currently supported**</i> |
| `description` | `timeline` - `event` | String | Result of a VAR timeline event<br /><br />`goal`, `penalty`, `red_card`, `no_goal`, `no_penalty`, `no_red_card`, `corner`, `no_corner`, `mistaken_identity`, `no_mistaken_identity` |
| `home_score` | `timeline` - `event` | Integer | Score for the home team after a timeline event |
| `id` | `timeline` - `event` | Integer | Unique ID for a timeline event<br /><br />ex. `1721786685` |
| `injury_time_announced` | `timeline` - `event` | Integer | Amount of injury time announced in minutes |
| `late` | `league_timeline` - `event` | Boolean | Indicates the incoming substitute was temporarily prevented from entering the field because the replaced player did not leave the field within the time allowed. When `true`, the team briefly plays with one fewer player before the substitution is completed. |
| `match_clock` | `timeline` - `event` | String | Match clock value for a timeline event, in minutes and seconds<br /><br />ex. `89:37` |
| `match_time` | `timeline` - `event` | Integer | Match clock value of a timeline event, in minutes<br /><br />ex. `89` |
| `method` | `timeline` - `event` | String | Method of a scored goal<br /><br />`penalty`, `own_goal`, `header`, `shot`, `free_kick`, `corner` |
| `outcome` | `timeline` - `event` | String | Outcome of a missed goal<br /><br />`miss`, `post`, `bar` |
| `period` | `timeline` - `event` | Integer | Period number of a timeline event |
| `period_name` | `timeline` - `event` | String | Period name of a timeline event, appearing at the beginning of a period<br /><br />ex. `regular_period` |
| `period_type` | `timeline` - `event` | String | Period type of a timeline event<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |
| `shootout_away_score` | `timeline` - `event` | Integer | Away team shootout score after a timeline event |
| `shootout_home_score` | `timeline` - `event` | Integer | Home team shootout score after a timeline event |
| `status` | `timeline` - `event` | String | Status available during penalty shootouts (`period_type="penalties"`)<br /><br />`missed`, `scored`, `not_taken_yet` |
| `stoppage_time` | `timeline` - `event` | Integer | Stoppage time value for a timeline event<br /><br /> ex. `3` |
| `stoppage_time_clock` | `timeline` - `event` | String | Stoppage time clock value for a timeline event<br /><br />ex. `2:03` |
| `time` | `timeline` - `event` | Date-time | UTC timestamp indicating when the timeline event was created or most recently updated in our system. This reflects system processing time, not the time the event occurred on the pitch. The timestamp may lag behind the actual event—typically by a short interval during live play, or by minutes to hours for later additions and corrections.<br /><br />When the record is first created, this value reflects its creation time. If the record is later updated, the value is replaced with the latest update time and no longer preserves the original creation time.<br /><br />ex. `2024-04-16T20:49:49+00:00` |
| `type` | `timeline` - `event` | String | Type of timeline event. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#event-types) for a complete list of event types<br /><br />ex. `goal_kick`, `period_start`, `yellow_card` |
| `x` | `timeline` - `event` | Integer | Horizontal X coordinate of a timeline event. `x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location. |
| `y` | `timeline` - `event` | Integer | Vertical Y coordinate of a timeline event. `y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#ball-location) for additional information on ball location. |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Player (`soccer-extended-competitor-summaries`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Situation (`soccer-extended-league-timeline`), Sport Event Status (`soccer-extended-competitor-schedules`), Ball Location (`soccer-extended-competitor-schedules`), Player Event Details (`soccer-extended-league-timeline`), Match Stats (Player) (`soccer-extended-competitor-summaries`), Match Stats (Team) (`soccer-extended-competitor-summaries`), Venue (`soccer-extended-competitor-schedules`).
