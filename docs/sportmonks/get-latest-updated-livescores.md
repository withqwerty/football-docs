---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.850Z
---
# GET Latest Updated Livescores

Returns you all livescores that have received updates within 10 seconds.

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/livescores/latest
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": {
        "id": 19146701,
        "sport_id": 1,
        "league_id": 501,
        "season_id": 23690,
        "stage_id": 77471570,
        "group_id": null,
        "aggregate_id": null,
        "round_id": 340573,
        "state_id": 5,
        "venue_id": 8909,
        "name": "Celtic vs Kilmarnock",
        "starting_at": "2024-08-04 15:30:00",
        "result_info": "Celtic won after full-time.",
        "leg": "1/1",
        "details": null,
        "length": 90,
        "placeholder": false,
        "has_odds": true,
        "has_premium_odds": true,
        "starting_at_timestamp": 1722785400
    },
```

{% endtab %}

{% tab title="Field Description" %}

| Field         | Description                                      | Type           |
| ------------- | ------------------------------------------------ | -------------- |
| id            | Refers the unique id of the fixture              | integer        |
| sport\_id     | Refers to the sport the fixture is played at     | integer        |
| league\_id    | Refers to the league the fixture is played in    | integer        |
| season\_id    | Refers to the seasons the fixture is played in   | integer        |
| stage\_id     | Refers to the stage the fixture is played in     | integer        |
| group\_id     | Refers to the group the fixture is played in     | integer / null |
| aggregate\_id | Refers to the aggregate the fixture is played at | integer / null |
| state\_id     | Refers to the state the fixture is played at     | integer        |
| round\_id     | Refers to the round the fixture is played at     | integer / null |
| state\_id     | Refers to the state the fixture is played at     | integer        |
| venue\_id     | Refers to the venue the fixture is played at     | integer / null |
| name          | Represents the name of the participants          | string / null  |
| starting\_at  | Datetime object representing the start time      | date / null    |
| result\_info  | Represents the final result info                 | string / null  |
| leg           | Represents the leg of the fixture                | string         |
| details       | Represents details about the fixture             | string / null  |
| length        | Length of the fixture (minutes)                  | integer / null |

####

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Query Parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>sortBy</code></td><td>NO</td><td>Order by specific fields on the <a href="/pages/ZEorjqmnwsNQNSMhOMdX">base entity</a>. For more information check out <a href="/pages/8cSk6PiDzZuXbCgh8pnv">this</a> page.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="/pages/IAfEN1RMb8ia2qKBsVkk">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static Filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](/v3/api/request-options/filtering).

<table><thead><tr><th width="165">Static Filters</th><th width="114">Available on Entity</th><th width="197">Description</th><th width="274">Example</th></tr></thead><tbody><tr><td><code>ParticipantSearch</code></td><td>Fixture</td><td>Filter on the matches of specific participants.</td><td><code>&#x26;include=participants&#x26;filters=participantSearch:Celtic</code></td></tr><tr><td><code>TodayDate</code></td><td>Fixture</td><td>Filter all fixtures to find only the fixtures of today.</td><td><code>&#x26;filters=todayDate</code></td></tr><tr><td><code>venues</code></td><td>Fixture</td><td>Find all fixtures that are played in a specific venue.</td><td><code>&#x26;include=venue&#x26;filters=venues:venueIDs</code><br><br><code>&#x26;include=venue&#x26;filters=venues:10,12</code></td></tr><tr><td><code>IsDeleted</code></td><td>Fixture</td><td>Filter on deleted fixtures only. This filter helps to keep your database in sync.</td><td><code>&#x26;filters=IsDeleted</code></td></tr><tr><td><code>markets</code></td><td>Odds</td><td>Filter the odds on a selection of markets separated by a comma. </td><td><code>&#x26;include=odds&#x26;filters=markets:marketIDs</code><br><br><code>&#x26;include=odds&#x26;filters=markets:12,14</code></td></tr><tr><td><code>bookmakers</code></td><td>Odds</td><td>Filter the odds on a selection of bookmakers separated by a comma. (e.g: 2,14). </td><td><code>&#x26;include=odds&#x26;filters=bookmakers:bookmakerIDs</code><br><br><code>&#x26;include=odds&#x26;filters=bookmakers:2,14</code></td></tr><tr><td><code>WinningOdds</code></td><td>Odds</td><td>Filter all winning odds.</td><td><code>&#x26;include=odds&#x26;filters=WinningOdds</code></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic Filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our [Filters page.](/v3/api/request-options/filtering)

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=participants` you can apply [team-related filters](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#team).&#x20;
{% endhint %}

<table><thead><tr><th width="143">Dynamic Filters</th><th>Available on Entity</th><th>Description</th><th width="191">Examples</th></tr></thead><tbody><tr><td><code>types</code></td><td>Statistics, Events, Lineup, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the Types on a selection of Fixture statistics separated by a comma. <br><br><br><br>Filter on the specific events you want to show.</td><td><code>&#x26;include=statistics&#x26;filters=statisticTypes:TypeIDs</code><br><br><code>&#x26;include=statistics&#x26;filters=statisticTypes:42,49</code><br><br><code>&#x26;include=events&#x26;filters=eventTypes:14</code></td></tr><tr><td><code>states</code></td><td>Fixtures<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the states of fixtures separated by a comma. <br></td><td><code>&#x26;include=state&#x26;filters=fixtureStates:StateIDs</code><br><br><code>&#x26;include=state&#x26;filters=fixtureStates:1</code></td></tr><tr><td><code>leagues</code></td><td>Fixtures, Seasons, Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the fixtures based on leagues and their rounds.</td><td><p><code>&#x26;filters=fixtureLeagues:leagueIDs</code></p><p></p><p><code>&#x26;filters=fixtureLeagues:501,271</code></p></td></tr><tr><td><code>groups</code></td><td>Fixtures, Standing, and more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the fixtures based on groups. Get their fixtures and standings.</td><td><code>&#x26;include=group&#x26;filters=fixtureGroups:groupIDs</code><br><br><code>&#x26;include=group&#x26;filters=fixtureGroups:246691</code></td></tr><tr><td><code>countries</code></td><td>Coaches, Leagues, Players, Teams, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the coaches, leagues, players and more based on countries.</td><td><code>&#x26;include=coaches&#x26;filters=coachCountries:CountryIDs</code><br><br><code>&#x26;include=coaches&#x26;filters=coachCountries:1161</code></td></tr><tr><td><code>seasons</code></td><td>Statistics (players, team, coaches, referees), Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter statistics, standings and topscorers based on seasons.</td><td><code>&#x26;include=season.statistics&#x26;filters=seasonStatisticTypes:TypeIDs</code><br><br><code>&#x26;include=season.statistics&#x26;filters=seasonStatisticTypes:52</code></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Definition of "Latest Updated"&#x20;

The Latest Updated endpoint returns all fixtures whose livescore data has changed within the last 10 seconds. Specifically, it tracks changes to these eight fields: state\_id, venue\_id, name, starting\_at, starting\_at\_timestamp, result\_info, leg, and length. The update window is fixed at 10 seconds and cannot be altered.

Changes to each core field mean the following:

* State\_id – the match phase progressed (for example, from 1 to 2 at kick-off or from 2 to 3 at half-time)
* Venue\_id – the assigned venue was updated (for example, moved from stadium A to stadium B)
* Name – the fixture name text was modified (for example, team abbreviations or formatting changed)
* Starting\_at – the kick-off time string was rescheduled (for example, “2024-08-04 15:30:00” to “2024-08-04 16:00:00”)
* Starting\_at\_timestamp – the UNIX timestamp for kick-off was rescheduled (for example, 1722785400 to 1722787200)
* Result\_info – the score summary text was updated (for example, “0-0” to “1-0”)
* Leg – the leg designation changed (for example, “1/2” to “2/2”)
* Length – the fixture duration changed (for example, 90 to 120 when extra time is added)

> <mark style="color:$warning;">**Note**</mark>**:** Only these eight fields are monitored. Changes in other data (e.g. events, lineups, odds, statistics) do **not** count toward triggering this endpoint. The 10-second window is **fixed and non-configurable**.

### Update behaviour & edge cases

* On each request, the system checks the previous 10 seconds to see which fixtures had one or more of those eight fields changed.
* If **no fixtures** experienced changes during that interval, the response is `200 OK` with `"data": []`.
* Because of the short window, updates usually arrive in small batches.
* If multiple changes occur to the same fixture within the 10-second span, you may only see the *final* post-change state, not every intermediate step.
* Pay attention to **clock skew** (between your system and the API’s time) and **network jitter**, as they may cause missing updates or duplicate detections.

### Polling strategy & best practices

* Recommended polling interval: **5–8 seconds**, as long as rate limits permit.
* If you detect many consecutive empty responses, consider backing off (e.g. increasing the interval) to reduce unnecessary calls.
* Always dedupe via your cache: ignore fixtures whose tracked fields haven’t changed.
* Use exponential backoff or pauses when encountering errors, and safely resume polling without flooding.

### Caching & diff logic

Your local cache should store for each fixture the current values of the eight tracked fields (state\_id, venue\_id, name, starting\_at, starting\_at\_timestamp, result\_info, leg, length).

**Polling workflow:**

1. Call `GET /v3/football/livescores/latest?[params]`
2. For each fixture in the `data` array:
   * Compare each of the eight fields with your cached version
   * If **no differences** → skip/discard fixtures&#x20;
   * If **any difference** → process this as an update and overwrite your cache
3. If you need more context (events, lineups, odds), fetch via other endpoints (e.g. Fixture by ID, Inplay Livescores)
4. Separately, maintain cached metadata (teams, leagues, venues) since they rarely change.

```
Let polling interval = 6 seconds

T = now  
 → GET latest → returns fixtures A, B  
 → Compare with cache → apply updates for changed ones  
 → Update cache  

T + 6s  
 → GET latest → returns fixtures B, C  
 → Process B (if changed), process C  
 → Update cache  

T + 12s  
 → GET latest → returns []  
 → No changes, skip processing  
 → Optional: if many empties, slow poll rate  
```

### Filters

More information on how to use filters can be found in our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use, you can check out the following [endpoint](/v3/core-api/endpoints/filters/get-all-entity-filters):

{% hint style="info" %}

```javascript
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

NO

### Include depth

You can use a total of `3` nested includes on this endpoint

### Include options

[`sport`](https://docs.sportmonks.com/v3/core-api/) [`round`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#round) [`stage`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`group`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#group) [`aggregate`](/v3/endpoints-and-entities/entities/fixture#aggregate) [`league`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#league) [`season`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season) [`coaches`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#coach) [`tvStations`](/v3/endpoints-and-entities/entities/other#tvstation) [`venue`](/v3/endpoints-and-entities/entities/other#venue) [`state`](/v3/endpoints-and-entities/entities/other#state)  [`weatherReport`](/v3/endpoints-and-entities/entities/other#weatherreport) [`lineups`](/v3/endpoints-and-entities/entities/fixture#lineup) [`events`](/v3/endpoints-and-entities/entities/fixture#event) [`timeline`](/v3/endpoints-and-entities/entities/fixture#event) [`comments`](/v3/endpoints-and-entities/entities/other#commentary) [`trends`](/v3/endpoints-and-entities/entities/statistic#trend) [`statistics`](/v3/endpoints-and-entities/entities/statistic#fixturestatistic) [`periods`](/v3/endpoints-and-entities/entities/fixture#period) [`participants`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#team)[`inplayOdds`](/v3/endpoints-and-entities/entities/odd-and-prediction#inplayodd) [`prematchNews`](/v3/endpoints-and-entities/entities/other#news) [`metadata`](/v3/endpoints-and-entities/entities/other#metadata) [`sidelined`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#sidelined) [`predictions`](/v3/endpoints-and-entities/entities/odd-and-prediction#prediction-valuebet) [`referees`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#referees) [`formations`](/v3/endpoints-and-entities/entities/fixture#formation) [`ballCoordinates`](/v3/endpoints-and-entities/entities/fixture#ballcoordinate) [`scores`](/v3/endpoints-and-entities/entities/fixture#score) [`xGFixture`](/v3/endpoints-and-entities/entities/expected) [`pressure`](/v3/tutorials-and-guides/tutorials/includes/pressure-index) [`expectedLineups`](/v3/endpoints-and-entities/endpoints/premium-expected-lineups) [`matchfacts`](/v3/endpoints-and-entities/endpoints/match-facts) `AIOverviews`&#x20;

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the livescores endpoints are:

* [Fixture](/v3/endpoints-and-entities/entities/fixture#fixture)

### Postman

We also offer detailed postman documentation with examples and a complete up-to-date version of all our endpoints. Below is a button that lets your fork the collection or import it.

\
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork\&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)

### Code Example

{% tabs %}
{% tab title="Ruby" %}

```ruby
require "uri"
require "net/http"

url = URI("https://api.sportmonks.com/v3/football/livescores/latest?api_token=YOUR_TOKEN")

https = Net::HTTP.new(url.host, url.port)
https.use_ssl = true

request = Net::HTTP::Get.new(url)

response = https.request(request)
puts response.read_body

```

{% endtab %}

{% tab title="Python" %}

```python
import http.client

conn = http.client.HTTPSConnection("api.sportmonks.com")
payload = ''
headers = {}
conn.request("GET", "/v3/football/livescores/latest?api_token=YOUR_TOKEN", payload, headers)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```

{% endtab %}

{% tab title="PHP" %}

```php
<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.sportmonks.com/v3/football/livescores/latest?api_token=YOUR_TOKEN',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);

curl_close($curl);
echo $respons
```

{% endtab %}

{% tab title="Java" %}

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url("https://api.sportmonks.com/v3/football/livescores/latest?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/football/livescores/latest?api_token=YOUR_TOKEN')
  .end(function (res) { 
    if (res.error) throw new Error(res.error); 
    console.log(res.raw_body);
  });
```

{% endtab %}

{% tab title="Go" %}

```go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {

  url := "https://api.sportmonks.com/v3/football/livescores/latest?api_token=YOUR_TOKEN"
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

{% endtab %}
{% endtabs %}