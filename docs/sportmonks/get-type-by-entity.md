---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.854Z
---
# GET Type by Entity

Returns types which are available per entity.

{% tabs %}
{% tab title="Base URL" %}

```javascript
https://api.sportmonks.com/v3/core/types/entities
```

{% endtab %}

{% tab title="Example Response" %}

```json
{
  "data": {
    "CoachStatisticDetail": {
      "updated_at": "2023-06-30T12:00:31.000000Z",
      "types": [
        {
          "id": 59,
          "name": "Substitutions",
          "code": "substitutions",
          "developer_name": "SUBSTITUTIONS",
          "model_type": "statistic",
          "stat_group": "overall"
        },
        {
          "id": 83,
          "name": "Redcards",
          "code": "redcards",
          "developer_name": "REDCARDS",
          "model_type": "statistic",
          "stat_group": "overall"
        },
        {
          "id": 84,
          "name": "Yellowcards",
          "code": "yellowcards",
          "developer_name": "YELLOWCARDS",
          "model_type": "statistic",
          "stat_group": "overall"
        },
```

{% endtab %}

{% tab title="Field Description" %}

| Field           | Description                                  | Type    |
| --------------- | -------------------------------------------- | ------- |
| updated\_at     | Refers to the time the type was last updated | string  |
| id              | Refers to the id of the type                 | integer |
| name            | Displays the name of the type                | string  |
| code            | Displays the code of the type                | string  |
| developer\_name | Displays the developer name of the type      | string  |
| model\_type     | Displays the model\_type of the type         | string  |
| stat\_group     | Displays the stat group of the type          | string  |
| {% endtab %}    |                                              |         |
| {% endtabs %}   |                                              |         |

#### Parameters &#x20;

<table><thead><tr><th>Name</th><th width="232.66666666666666">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>api_token</code></td><td><p>YES </p><p>Another option is to provide the API token in the header.</p></td><td>Your unique API token. Ex. ?api_token=YOUR_TOKEN</td></tr><tr><td><code>include</code></td><td>NO</td><td>Enrich the API response with more data by using includes. Ex. &#x26;include=participants;events</td></tr><tr><td><code>select</code></td><td>NO</td><td>Select specific fields on the<a href="https://docs.sportmonks.com/football2/endpoints-and-entities/entities/fixtures"> base entity</a>. Read how to select fields in our <a href="https://docs.sportmonks.com/football2/api/request-options/selecting-fields">tutorial</a>.</td></tr><tr><td><code>filters</code></td><td>NO</td><td>Filter the API response on multiple related entities. There are static filters and dynamic filters.​<br><br>Please find the possibilities in the Static and Dynamic Filter tab.</td></tr><tr><td><code>locale</code></td><td>NO</td><td>Translate name fields of the API Response in your selected language. Find more information and which languages are available on our <a href="/pages/IAfEN1RMb8ia2qKBsVkk">translations page</a>.</td></tr></tbody></table>

#### Pagination

No

#### Include options

Using includes is **disabled** for this endpoint.

**Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the cities' endpoints are:

* [Type](https://docs.sportmonks.com/football/v/core-api/entities/core#type)

#### Code Example

{% tabs %}
{% tab title="Ruby" %}

```ruby
require "uri"
require "net/http"

url = URI("https://api.sportmonks.com/v3/core/types/1?api_token={your_token}")

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
conn.request("GET", "/v3/core/types/1?api_token={your_token}", payload, headers)
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
  CURLOPT_URL => 'https://api.sportmonks.com/v3/core/types/1?api_token={your_token}',
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
  .url("https://api.sportmonks.com/v3/core/types/1?api_token={your_token}")
  .method("GET", null)
  .build();
Response response = client.newCall(request).execute();
```

{% endtab %}

{% tab title="Node.js" %}

```
var unirest = require('unirest');
var req = unirest('GET', 'https://api.sportmonks.com/v3/core/types/1?api_token={your_token}')
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

  url := "https://api.sportmonks.com/v3/core/types/1?api_token={your_token}"
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