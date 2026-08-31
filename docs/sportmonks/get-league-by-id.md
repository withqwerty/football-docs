---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.854Z
---
# GET League by ID

Returns the league you've requested by ID.

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/football/leagues/{ID}
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
    "data": {
        "id": 501,
        "sport_id": 1,
        "country_id": 1161,
        "name": "Premiership",
        "active": true,
        "short_code": "SCO P",
        "image_path": "https://cdn.sportmonks.com/images/soccer/leagues/501.png",
        "type": "league",
        "sub_type": "domestic",
        "last_played_at": "2024-08-05 19:00:00",
        "category": 2,
        "has_jerseys": false
    },
```

{% endtab %}

{% tab title="Field Description" %}

<table><thead><tr><th width="235.8403990024938">Field</th><th width="268.3333333333333">Description</th><th>Type</th></tr></thead><tbody><tr><td>id</td><td>Refers to the unique id of th league</td><td>integer</td></tr><tr><td>sport_id</td><td>Refers to the sport of the league</td><td>integer</td></tr><tr><td>country_id</td><td>Refers to the country of the league</td><td>integer</td></tr><tr><td>name</td><td>The name of the league</td><td>string</td></tr><tr><td>active</td><td>Indicates if the league is active or inactive</td><td>integer</td></tr><tr><td>short_code</td><td>The short code of the league</td><td>string / null</td></tr><tr><td>image_path</td><td>Image path to the league logo</td><td>string</td></tr><tr><td>type</td><td>Indicates the type of the league</td><td>string</td></tr><tr><td>sub_type</td><td>Indicates the subtype of the league</td><td>string</td></tr><tr><td>last_played_at</td><td>The date of when the last fixture was played in the league</td><td>string</td></tr><tr><td>category</td><td>Indicates the category of the league</td><td>integer</td></tr></tbody></table>
{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Query parameters" %}

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="/pages/IAfEN1RMb8ia2qKBsVkk">translations page</a>.</td></tr></tbody></table>
{% endtab %}

{% tab title="Static filters" %}
**Static filters** are always the same and filter in one specific way without any custom options. Each static filter is listed below and has a description of how it filters. For more information, please look at our[ Filters page](/v3/api/request-options/filtering).<br>

<table><thead><tr><th>Static filters</th><th>Available on Entity</th><th width="154">Description</th><th>Example</th></tr></thead><tbody><tr><td>N/A</td><td>N/A</td><td>Not available for this endpoint.</td><td><code>N/A</code></td></tr></tbody></table>
{% endtab %}

{% tab title="Dynamic filters" %}
The **dynamic filters** are based on entities and includes. Each dynamic filter uses an entity to filter on and one entity to apply the filter on. Below are examples with explanations of how filters are set up. For more information, please look at our[ Filters page](/v3/api/request-options/filtering).

{% hint style="info" %}
Using an include? Check their respective filters on their entity page. For example if you use `&include=fixtures`, you can apply [fixture-related filters](/v3/endpoints-and-entities/entities/fixture#fixture-entity-filters).&#x20;
{% endhint %}

<table><thead><tr><th>Dynamic filters</th><th>Available on Entity</th><th width="154">Description</th><th>Example</th></tr></thead><tbody><tr><td><code>seasons</code></td><td>Statistics (players, team, coaches, referees), Standings, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter statistics, standings and topscorers based on seasons.</td><td><code>&#x26;include=seasons.statistics&#x26;filters=seasonStatisticTypes:TypeIDs</code><br><br><code>&#x26;include=seasons.statistics&#x26;filters=seasonStatisticTypes:52</code></td></tr><tr><td><code>types</code></td><td>Statistics, Events, Lineup, and way more.<br><br>Check this <a href="https://docs.sportmonks.com/football2/v/core/endpoints/filters/get-all-entity-filters">endpoint</a> for all possibilities.</td><td>Filter the league stages on a selection of type ID's separated by a comma. </td><td><code>&#x26;include=stages.type&#x26;filters=stageTypes:TypeIDs</code><br><br><code>&#x26;include=stages.type&#x26;filters=stageTypes:224</code></td></tr></tbody></table>
{% endtab %}
{% endtabs %}

### Filters

More information on how to use filters can be found on our tutorials on how to [filter](https://docs.sportmonks.com/football2/api/request-options/filtering). If you want more information on which filters to use you can check out the following [endpoint](/v3/core-api/endpoints/filters/get-all-entity-filters):

{% hint style="info" %}

```javascript
https://api.sportmonks.com/v3/my/filters/entity?api_token=YOUR_TOKEN
```

{% endhint %}

### Pagination

NO

### Include depth

You can use a total of `2` nested includes on this endpoint

### Include options

[`sport`](https://docs.sportmonks.com/v3/core-api/)  [`country`](https://docs.sportmonks.com/v3/core-api/)  [`stages`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`latest`](/v3/endpoints-and-entities/entities/fixture#fixture) [`upcoming`](/v3/endpoints-and-entities/entities/fixture#fixture) [`inplay`](/v3/endpoints-and-entities/entities/fixture#fixture) [`today`](/v3/endpoints-and-entities/entities/fixture#fixture) [`currentSeason`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season) [`seasons`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season)

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the leagues endpoints are:

* [League](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#league)

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

url = URI("https://api.sportmonks.com/v3/football/leagues/{ID}?api_token=YOUR_TOKEN")

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
conn.request("GET", "/api/v3/football/leagues/{ID}?api_token=YOUR_TOKEN", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/api/v3/football/leagues/{ID}?api_token=YOUR_TOKEN',
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
  .url("https://api.sportmonks.com/api/v3/football/leagues/{ID}?api_token=YOUR_TOKEN")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/api/v3/football/leagues/{ID}?api_token=YOUR_TOKEN')
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

  url := "https://api.sportmonks.com/api/v3/football/leagues/{ID}?api_token=YOUR_TOKEN"
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