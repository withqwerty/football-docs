---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-push-events
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.201Z
---
# Push Events

**Soccer Extended Push Events** provides real-time event updates for all live matches.

> 📘 Streaming with Push
>
> Learn how to subscribe, filter the stream, and recover from disconnections in our [Push Feeds](https://developer.sportradar.com/soccer/docs/soccer-ig-push) integration guide.

## Syntax

https://api.sportradar.com/soccer-extended/{access_level}/{version}/stream/events/subscribe

<br />

### Parameters

| Parameter      | Description                                                               |
| -------------- | ------------------------------------------------------------------------- |
| `access_level` | Defines the access level of your API key<br /><br />`production`, `trial` |
| `version`      | Version number of the API<br /><br />`v4`                                 |

> 🔐 Authorization
>
> Place your API key in the header for each request (`x-api-key`)

<br />

### Optional Query String Parameters

By default, a Push feed will provide all data available for all in progress games. If needed, you can filter the data returned by including query strings.

Each query string parameter can be added with a preceding ampersand (`&`).

| URL Parameters   | Description                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| `competition_id` | Competition id<br /><br />Example: `competition_id=sr:competition:204`         |
| `event_id`       | Event type<br /><br />Example: `event_id=free_kick`                            |
| `format`         | Format type<br /><br />Example: `format=json`                                  |
| `season_id`      | Season id<br /><br />Example: `season_id=sr:season:50039`                      |
| `sport_event_id` | Sport event id<br /><br />Example: `sport_event_id=sr:sport_event_id:13644241` |

<br />

***

## Code Samples

```ruby
require 'uri'
require 'net/http'
require 'openssl'

url = URI("https://api.sportradar.com/soccer-extended/trial/v4/stream/events/subscribe")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Get.new(url)
request["x-api-key"] = "{your_api_key}"  # Replace with your actual key

response = http.request(request)
puts response.read_body
```
```python
import requests
import json

headers = {
    'x-api-key': 'your_api_key'  # Replace with your actual key
}

r = requests.get(
    "https://api.sportradar.com/soccer-extended/trial/v4/stream/events/subscribe",
    headers=headers,
    allow_redirects=False
)

redirect_url = r.headers['Location']
r = requests.get(redirect_url, stream=True, headers=headers)

for line in r.iter_lines():
    # filter out keep-alive new lines
    if line:
        decoded_line = line.decode('utf-8')
        print(json.loads(decoded_line))
```
```shell
curl -L -X GET 'https://api.sportradar.com/soccer-extended/trial/v4/stream/events/subscribe' \
  -H 'x-api-key: {your_api_key}'
```

<br />

### Samples with Query String Params

```ruby Ruby with Query String Params
require 'uri'
require 'net/http'
require 'openssl'

url = URI("https://api.sportradar.com/soccer-extended/trial/v4/stream/events/subscribe?&format=json&sport_event_id=sr:sport_event:13468929")

http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_NONE

request = Net::HTTP::Get.new(url)
request["x-api-key"] = "{your_api_key}"  # Replace with your actual key

response = http.request(request)
puts response.read_body
```
```python Python with Query String Params
import requests
import json

headers = {
    'x-api-key': 'your_api_key'  # Replace with your actual key
}

r = requests.get("https://api.sportradar.com/soccer-extended/trial/v4/stream/events/subscribe",
    params = {'format': 'json', 'sport_event_id': 'sr:sport_event:13468929'},
    allow_redirects=False)

redirect_url = r.headers['Location']
r = requests.get(redirect_url, stream=True)

for line in r.iter_lines():
    # filter out keep-alive new lines
    if line:
        decoded_line = line.decode('utf-8')
        print(json.loads(decoded_line))
```
```shell Shell with Query String Params
curl -L -X GET 'api.sportradar.com/soccer-extended/trial/v4/stream/events/subscribe?&format=json&sport_event_id=sr:sport_event:13468929'
  -H 'x-api-key: {your_api_key}'
```

<br />

***

## Response Sample

The above commands return json like [this](https://api-docs.sportradar.us/soccer/Soccer_v4_Push_Events_Example.json).

<br />

***

## Data Points

### Metadata

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `channel` | `metadata` | String | Sport of the stream connection<br /><br />ex. `soccer-extended` |
| `competition_id` | `metadata` | String | Unique Id of a competition<br /><br />ex. `sr:competition:23` |
| `event_id` | `metadata` | String | Description of a push timeline event<br /><br />`match_started`, `match_ended`, `period_start`, `period_score`, `score_change`, `yellow_card`, `yellow_red_card`, `red_card`, `substitution`, `injury_time_shown`, `free_kick`, `goal_kick`, `throw_in`, `offside`, `corner_kick`, `shot_on_target`, `shot_off_target`, `save`, `injury`, `penalty_kick`, `player_back_from_injury`, `penalty_missed`, `penalty_shootout`, `decision_to_var`, `decision_to_var_over`, `possible_decision_to_var`, `canceled_decision_to_var`, `break_start`, `injury_return`, `video_assistant_referee`, `video_assistant_referee_over`, `penalty_awarded`, `shot_saved, possible_goal` |
| `format` | `metadata` | String | Format type of the response<br /><br />`json`, `xml` |
| `season_id` | `metadata` | String | Unique Id of a season<br /><br />ex. `sr:season:106499` |
| `sport_event_id` | `metadata` | String | Unique Id of a sport event<br /><br />ex. `sr:sport_event_id:42134765` |
| `sport_id` | `metadata` | String | Unique Id of a sport<br /><br />ex. `sr:sport:1` |
| `from` | `heartbeat` | Integer | Unix timestamp of the beginning of a heartbeat message<br /><br />ex. `1713804799` |
| `to` | `heartbeat` | Integer | Unix timestamp of the end of a heartbeat message<br /><br />ex. `1713804804` |
| `interval` | `heartbeat` | Integer | Interval of a heartbeat message in seconds |
| `type` | `heartbeat` | String | Type of heartbeat message<br /><br />ex. `events`, `statistics` |
| `package` | `heartbeat` | String | Package of a heartbeat message<br /><br />ex. `soccer-extended-v4` |

### Match Timeline

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `away_score` | `event` | Integer | Score for the away team after a timeline event |
| `break_name` | `event` | String | Brief description of a break event<br /><br />ex. `pause` |
| `card_description` | `event` | String | Description of the scenario during a card event<br /><br />ex. `pre_match`, `half_time`, `post_match`, `player_on_bench`, `first_half`, `second_half`, `during_penalty_shootout` |
| `competitor` | `event` | String | Designation of a competitor for a timeline event<br /><br />`home`, `away` |
| `decision` | `timeline` - `event` | String | Decision of a VAR timeline event<br /><br />`pending`, `cancelled`, `upheld`, `overturned`<br /><br /><i>**Not currently supported**</i> |
| `description` | `timeline` - `event` | String | Result of a VAR timeline event<br /><br />`goal`, `penalty`, `red_card`, `no_goal`, `no_penalty`, `no_red_card`, `corner`, `no_corner`, `mistaken_identity`, `no_mistaken_identity` |
| `home_score` | `event` | Integer | Score for the home team after a timeline event |
| `id` | `event` | Integer | Unique ID for a timeline event<br /><br />ex. `1721786685` |
| `injury_time_announced` | `event` | Integer | Amount of injury time announced in minutes |
| `late` | `league_timeline` - `event` | Boolean | Indicates the incoming substitute was temporarily prevented from entering the field because the replaced player did not leave the field within the time allowed. When `true`, the team briefly plays with one fewer player before the substitution is completed. |
| `match_clock` | `event` | String | Match clock value for a timeline event, in minutes and seconds<br /><br />ex. `89:37` |
| `match_time` | `event` | Integer | Match clock value of a timeline event, in minutes<br /><br />ex. `89` |
| `method` | `event` | String | Method of a scored goal<br /><br />`penalty`, `own_goal`, `header`, `shot`, `free_kick`, `corner` |
| `outcome` | `event` | String | Outcome of a missed goal<br /><br />`miss`, `post`, `bar` |
| `period` | `event` | Integer | Period number of a timeline event |
| `period_name` | `event` | String | Period name of a timeline event, appearing at the beginning of a period<br /><br />ex. `regular_period` |
| `period_type` | `event` | String | Period type of a timeline event<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |
| `shootout_away_score` | `event` | Integer | Away team shootout score after a timeline event |
| `shootout_home_score` | `event` | Integer | Home team shootout score after a timeline event |
| `status` | `event` | String | Status available during penalty shootouts (`period_type="penalties"`)<br /><br />ex. `missed`, `scored`, `not_taken_yet` |
| `stoppage_time` | `event` | Integer | Stoppage time value for a timeline event<br /><br />ex. `3` |
| `stoppage_time_clock` | `event` | String | Stoppage time clock value for a timeline event<br /><br />ex. `2:03` |
| `type` | `event` | String | Type of timeline event. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#event--period-types) for a complete list of event types<br /><br />ex. `goal_kick`, `period_start`, `yellow_card` |
| `time` | `event` | Date-time | UTC timestamp indicating when the timeline event was created or most recently updated in our system. This reflects system processing time, not the time the event occurred on the pitch. The timestamp may lag behind the actual event—typically by a short interval during live play, or by minutes to hours for later additions and corrections.<br /><br />When the record is first created, this value reflects its creation time. If the record is later updated, the value is replaced with the latest update time and no longer preserves the original creation time.<br /><br />ex. `2024-04-16T20:49:49+00:00` |
| `updated` | `event` | Boolean | Signifies this event has been updated since its original entry when `true` |
| `updated_time` | `event` | Date-time | Timestamp of an updated time entry<br /><br />ex. `2024-04-22T17:17:24+00:00` |
| `x` | `event` | Integer | Horizontal X coordinate of a timeline event. `x` is a number between `0` and `100`. The reference point `0` is at the home team’s goal. |
| `y` | `event` | Integer | Vertical Y coordinate of a timeline event. `y` is a number between `0` and `100`. The reference point `0` is on the top of the pitch where the home team’s goal is on the left hand side. |

### Player Event Details

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `event` - `players` | String | Unique player Id associated with a timeline event<br /><br />ex. `sr:player:2367105` |
| `name` | `event` - `players` | String | Player name associated with a timeline event<br /><br />ex. `Luna, Diego` |
| `type` | `event` - `players` | String | Player activity type associated with a timeline event. Signifies if a player scored a goal, recorded an assist, or participated in a substitution.<br /><br />ex. `scorer`, `assist`, `substituted_in`, `substituted_out` |

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
| `match_status` | `sport_event_status` | String | Status within a match. Provides more detail on the state of a match when live than `status`<br /><br />ex. `not_started`, `2nd_half`, `ended`, `awaiting_penalties`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#sport-statuses) for a complete list of statuses and their definitions. |
| `match_tie` | `sport_event_status` | Boolean | Signifies a match ended in a tie when `true` |
| `scout_abandoned` | `sport_event_status` | Boolean | Signifies a match was abandoned by a scout when `true` |
| `status` | `sport_event_status` | String | Status of a match<br /><br />ex. `not_started`, `live`, `ended`, `awaiting_penalties`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#sport-statuses) for a complete list of statuses and their definitions. |
| `winner_id` | `sport_event_status` | String | Unique ID of the match winner<br /><br />ex. `sr:competitor:44` |

### Sport Event Situation

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `played` | `sport_event_status` - `clock` | String | Match clock time in minutes<br /><br />`90:00` |
| `stoppage_time_played` | `sport_event_status` - `clock` | String | Stoppage time played in minutes<br /><br />`5:49` |
| `stoppage_time_announced` | `sport_event_status` - `clock` | String | Stoppage time announced in minutes<br /><br />`5:00` |
| `status` | `sport_event_status` - `match_situation` | String | Current situation status of a match<br /><br />`safe`, `dangerous`, `attack` |
| `qualifier` | `sport_event_status` - `match_situation` | String | Defines the team in the current situation status<br /><br />`home`, `away` |
| `updated_at` | `sport_event_status` - `match_situation` | Date-Time | Timestamp of the most recent match situation update<br /><br />ex. `2024-04-14T14:57:28+00:00` |
| `away_score` | `sport_event_status` - `period_scores` | Integer | Away team period score |
| `home_score` | `sport_event_status` - `period_scores` | Integer | Home team period score |
| `number` | `sport_event_status` - `period_scores` | Integer | Period number |
| `type` | `sport_event_status` - `period_scores` | String | Period type<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |

Also returns these data points, documented on the page named in brackets: Ball Location (`soccer-extended-league-timeline`).
