---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-push-statistics
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.201Z
---
# Push Statistics

**Soccer Extended Push Statistics** provides real-time team and player match-level statistics for all live matches.

> 📘 Streaming with Push
>
> Learn how to subscribe, filter the stream, and recover from disconnections in our [Push Feeds](https://developer.sportradar.com/soccer/docs/soccer-ig-push) integration guide.

## Syntax

https://api.sportradar.com/soccer-extended/{access_level}/{version}/stream/statistics/subscribe

<br />

## Code Samples

```ruby
require 'uri'
require 'net/http'
require 'openssl'

url = URI("https://api.sportradar.com/soccer-extended/trial/v4/stream/statistics/subscribe")

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
    "https://api.sportradar.com/soccer-extended/trial/v4/stream/statistics/subscribe",
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
curl -L -X GET 'https://api.sportradar.com/soccer-extended/trial/v4/stream/statistics/subscribe' \
  -H 'x-api-key: {your_api_key}'
```

<br />

### Samples with Query String Params

```ruby Ruby with Query String Params
require 'uri'
require 'net/http'
require 'openssl'

url = URI("https://api.sportradar.com/soccer-extended/trial/v4/stream/statistics/subscribe?&format=json&sport_event_id=sr:sport_event:13468929")

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

r = requests.get("https://api.sportradar.com/soccer-extended/trial/v4/stream/statistics/subscribe",
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
curl -L -X GET 'api.sportradar.com/soccer-extended/trial/v4/stream/statistics/subscribe?&format=json&sport_event_id=sr:sport_event:13468929'
  -H 'x-api-key: {your_api_key}'
```

<br />

***

## Response Sample

The above commands return json like [this](https://api-docs.sportradar.us/soccer/Soccer_v4_Push_Statistics_Example.json).

<br />

***

## Data Points

### Metadata

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `channel` | `metadata` | String | Sport of the stream connection<br /><br />ex. `soccer-extended` |
| `competition_id` | `metadata` | String | Unique Id of a competition<br /><br />ex. `sr:competition:23` |
| `event_id` | `metadata` | String | Description of a push statistic event<br /><br />`match_started`, `match_ended`, `period_start`, `period_score`, `score_change`, `yellow_card`, `yellow_red_card`, `red_card`, `substitution`, `injury_time_shown`, `free_kick`, `goal_kick`, `throw_in`, `offside`, `corner_kick`, `shot_on_target`, `shot_off_target`, `save`, `injury`, `penalty_kick`, `player_back_from_injury`, `penalty_missed`, `penalty_shootout`, `decision_to_var`, `decision_to_var_over`, `possible_decision_to_var`, `canceled_decision_to_var`, `break_start`, `injury_return`, `video_assistant_referee`, `video_assistant_referee_over`, `penalty_awarded`, `shot_saved, possible_goal` |
| `format` | `metadata` | String | Format type of the response<br /><br />`json`, `xml` |
| `season_id` | `metadata` | String | Unique Id of a season<br /><br />ex. `sr:season:106499` |
| `sport_event_id` | `metadata` | String | Unique Id of a sport event<br /><br />ex. `sr:sport_event_id:42134765` |
| `sport_id` | `metadata` | String | Unique Id of a sport<br /><br />ex. `sr:sport:1` |
| `from` | `heartbeat` | Integer | Unix timestamp of the beginning of a heartbeat message<br /><br />ex. `1713804799` |
| `to` | `heartbeat` | Integer | Unix timestamp of the end of a heartbeat message<br /><br />ex. `1713804804` |
| `interval` | `heartbeat` | Integer | Interval of a heartbeat message in seconds |
| `type` | `heartbeat` | String | Type of heartbeat message<br /><br />ex. `events`, `statistics` |
| `package` | `heartbeat` | String | Package of a heartbeat message<br /><br />ex. `soccer-extended-v4` |

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `statistics` - `competitors` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `statistics` - `competitors` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `statistics` - `competitors` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `statistics` - `competitors` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `statistics` - `competitors` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `statistics` - `competitors` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `statistics` - `competitors` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `qualifier` | `statistics` - `competitors` | String | Designation of a competitor for a sport event<br /><br />`home`, `away` |

### Match Stats (Team)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `ball_possession` | `competitors` - `statistics` | Integer | Percentage of team ball possession for a match.<br /><br />ex. `43` |
| `cards_given` | `competitors` - `statistics` | Integer | Total cards given to a team in a match |
| `chances_created` | `competitors` - `statistics` | Integer | Total chances created for a team in a match |
| `clearances` | `competitors` - `statistics` | Integer | Total clearances for a team in a match |
| `corner_kicks` | `competitors` - `statistics` | Integer | Total team corner kicks for a match |
| `crosses_successful` | `competitors` - `statistics` | Integer | Total successful crosses for a team in a match |
| `crosses_total` | `competitors` - `statistics` | Integer | Total crosses for a team in a match |
| `crosses_unsuccessful` | `competitors` - `statistics` | Integer | Total unsuccessful crosses for a team in a match |
| `defensive_blocks` | `competitors` - `statistics` | Integer | Total team defensive blocks for a match |
| `diving_saves` | `competitors` - `statistics` | Integer | Total team diving saves for a match |
| `fouls` | `competitors` - `statistics` | Integer | Total number of fouls awarded against a team (including those which draw cards) |
| `free_kicks` | `competitors` - `statistics` | Integer | Team free kicks for a match. In accordance with the rules, a free kick stat counted for the team who executes a free kick. Direct or indirect free kicks are all counted as free kicks. |
| `goal_kicks` | `competitors` - `statistics` | Integer | Team goal kicks for a match. Total number of kicks awarded to the team as a result of the ball traveling out of bounds over the goal line of the defending team. |
| `injuries` | `competitors` - `statistics` | Integer | Total team injuries for a match |
| `interceptions` | `competitors` - `statistics` | Integer | Total team interceptions for a match |
| `long_passes_successful` | `competitors` - `statistics` | Integer | Total successful long passes for a team in a match |
| `long_passes_total` | `competitors` - `statistics` | Integer | Total long passes for a team in a match |
| `long_passes_unsuccessful` | `competitors` - `statistics` | Integer | Total unsuccessful long passes for a team in a match |
| `offsides` | `competitors` - `statistics` | Integer | Total team offside infringements for a match |
| `passes_successful` | `competitors` - `statistics` | Integer | Total successful passes for a team in a match |
| `passes_total` | `competitors` - `statistics` | Integer | Total passes for a team in a match |
| `passes_unsuccessful` | `competitors` - `statistics` | Integer | Total unsuccessful passes for a team in a match |
| `penalties_missed` | `competitors` - `statistics` | Integer | Total team penalty shots missed for a match |
| `red_cards` | `competitors` - `statistics` | Integer | Total team red cards for a match |
| `shots_blocked` | `competitors` - `statistics` | Integer | Total team shots blocked for a match |
| `shots_off_target` | `competitors` - `statistics` | Integer | Total team off-target shots for a match |
| `shots_on_target` | `competitors` - `statistics` | Integer | Total team on-target shots for a match |
| `shots_saved` | `competitors` - `statistics` | Integer | Total number of goal keeper saves attributed to a team for a match |
| `shots_total` | `competitors` - `statistics` | Integer | Total number of shots attributed to a team for a match |
| `substitutions` | `competitors` - `statistics` | Integer | Total number player substitutions in a match |
| `tackles_successful` | `competitors` - `statistics` | Integer | Total successful tackles for a team in a match |
| `tackles_total` | `competitors` - `statistics` | Integer | Total tackles for a team in a match |
| `tackles_unsuccessful` | `competitors` - `statistics` | Integer | Total unsuccessful tackles for a team in a match |
| `throw_ins` | `competitors` - `statistics` | Integer | Total number of throw-in events for a team during a match |
| `was_fouled` | `competitors` - `statistics` | Integer | Number of fouls against a team in a match |
| `yellow_cards` | `competitors` - `statistics` | Integer | Total team yellow cards for a match |
| `yellow_red_cards` | `competitors` - `statistics` | Integer | Total team red cards for a match which resulted from two yellow cards |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `statistics` - `competitor` - `players` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `name` | `statistics` - `competitor` - `players` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |

### Match Stats (Player)

> See our [Extended Statistics FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#extended-statistics) for in-depth definitions of key data points

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `assists` | `players` - `statistics` | Integer | Player assists for a match |
| `chances_created` | `players` - `statistics` | Integer | Player chances created for a match |
| `clearances` | `players` - `statistics` | Integer | Player clearances for a match |
| `corner_kicks` | `players` - `statistics` | Integer | Player corner kicks for a match |
| `crosses_successful` | `players` - `statistics` | Integer | Player successful crosses for a match |
| `crosses_total` | `players` - `statistics` | Integer | Player total crosses for a match |
| `defensive_blocks` | `players` - `statistics` | Integer | Player defensive blocks for a match |
| `diving_saves` | `players` - `statistics` | Integer | Player diving saves for a match |
| `dribbles_completed` | `players` - `statistics` | Integer | Player dribbles completed for a match |
| `fouls_committed` | `players` - `statistics` | Integer | Player fouls committed for a match |
| `goals_by_head` | `players` - `statistics` | Integer | Player goals by head for a match |
| `goals_by_penalty` | `players` - `statistics` | Integer | Player goals by penalty for a match |
| `goals_conceded` | `players` - `statistics` | Integer | Player goals conceded for a match |
| `goals_scored` | `players` - `statistics` | Integer | Player goals scored for a match |
| `interceptions` | `players` - `statistics` | Integer | Player interceptions for a match |
| `long_passes_successful` | `players` - `statistics` | Integer | Player successful long passes for a match |
| `long_passes_total` | `players` - `statistics` | Integer | Player total long passes for a match |
| `long_passes_unsuccessful` | `players` - `statistics` | Integer | Player unsuccessful long passes for a match |
| `loss_of_possession` | `players` - `statistics` | Integer | Player possession losses for a match |
| `minutes_played` | `players` - `statistics` | Integer | Player minutes played for a match |
| `offsides` | `players` - `statistics` | Integer | Player offsides for a match |
| `own_goals` | `players` - `statistics` | Integer | Player own goals for a match |
| `passes_successful` | `players` - `statistics` | Integer | Player successful passes for a match |
| `passes_total` | `players` - `statistics` | Integer | Player total passes for a match |
| `passes_unsuccessful` | `players` - `statistics` | Integer | Player unsuccessful passes for a match |
| `penalties_faced` | `players` - `statistics` | Integer | Player penalty shots faced for a match |
| `penalties_missed` | `players` - `statistics` | Integer | Player penalty shots missed for a match |
| `penalties_saved` | `players` - `statistics` | Integer | Player penalty shots saved for a match |
| `red_cards` | `players` - `statistics` | Integer | Player red cards for a match |
| `shots_blocked` | `players` - `statistics` | Integer | Player shots blocked for a match |
| `shots_faced_saved` | `players` - `statistics` | Integer | Player shots saved for a match |
| `shots_faced_total` | `players` - `statistics` | Integer | Player total shots faced for a match |
| `shots_off_target` | `players` - `statistics` | Integer | Player shots off target for a match |
| `shots_on_target` | `players` - `statistics` | Integer | Player shots on target for a match |
| `substituted_in` | `players` - `statistics` | Integer | Signifies a player was substituted in during a match when `1` |
| `substituted_out` | `players` - `statistics` | Integer | Signifies a player was substituted out during a match when `1` |
| `tackles_successful` | `players` - `statistics` | Integer | Player successful tackles for a match |
| `tackles_total` | `players` - `statistics` | Integer | Player total tackles for a match |
| `was_fouled` | `players` - `statistics` | Integer | Number of fouls against a player in a match |
| `yellow_cards` | `players` - `statistics` | Integer | Player yellow cards for a match |
| `yellow_red_cards` | `players` - `statistics` | Integer | Player red cards for a match resulting from two yellow cards |

Also returns these data points, documented on the page named in brackets: Parameters (`soccer-extended-push-events`), Optional Query String Parameters (`soccer-extended-push-events`), Sport Event Status (`soccer-extended-push-events`), Ball Location (`soccer-extended-league-timeline`), Sport Event Situation (`soccer-extended-push-events`).
