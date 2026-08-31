---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.845Z
---
# Making your first request

Now that all prerequisites have been fulfilled, we’re ready to send our first request to the API!

{% hint style="info" %}
Before being able to make a request, you need to create your account in [MySportmonks](https://docs.sportmonks.com/v3/welcome/www.my.sportmonks.com). Here you can create your personal API token, which you need to [authenticate](/v3/welcome/authentication) your requests. You can use the free plan or choose one of the various plans and data features of Sportmonks.&#x20;
{% endhint %}

## Build the request&#x20;

The request consists of the following components:&#x20;

* The base URL&#x20;
* A path parameter, in this example, we use *fixtures*
* Optional: Query string parameters, to filter on enrich your requests.
* And finally, your API token

### The base URL

In this example we're using the [fixtures endpoint](/v3/endpoints-and-entities/endpoints/fixtures). The base URL of the fixtures endpoint is:

<pre class="language-javascript"><code class="lang-javascript"><strong>https://api.sportmonks.com/v3/football
</strong></code></pre>

### Your API token

We offer two different options for passing your API token. You are free to choose between the authentication methods. You can also use both of them at the same time. Please note that both methods count towards the same [rate-limiting.](/v3/api/rate-limit)

**Authenticate using a query parameter:**\
You can pass your API token by passing 'api\_token' in your request parameters, like so: \
`https://api.sportmonks.com/v3/football?api_token=YOUR_TOKEN`

**Authenticate using a request header:**\
You can also pass your token via an 'Authorization' header, like so:

<table><thead><tr><th>Header</th><th>Value</th></tr></thead><tbody><tr><td>Authorization</td><td><pre><code>YOUR_TOKEN
</code></pre></td></tr></tbody></table>

For example, this can results in the below request and response:

```javascript
https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN
```

<details>

<summary>Basic response</summary>

```javascript
{
  "data": [
    {
      "id": 17948776,
      "sport_id": 1,
      "league_id": 271,
      "season_id": 17328,
      "stage_id": 77448541,
      "group_id": null,
      "aggregate_id": null,
      "round_id": 240936,
      "state_id": 5,
      "venue_id": 339977,
      "name": "AGF vs Randers",
      "starting_at": "2021-04-22 15:45:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "last_processed_at": "2023-01-13 14:16:47",
      "starting_at_timestamp": 1619106300
    },
    {
      "id": 217802,
      "sport_id": 1,
      "league_id": 271,
      "season_id": 1282,
      "stage_id": 1095,
      "group_id": null,
      "aggregate_id": null,
      "round_id": 23491,
      "state_id": 5,
      "venue_id": 5599,
      "name": "Vestsjaelland vs AaB",
      "starting_at": "2014-09-22 17:00:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "last_processed_at": "2023-01-13 13:21:22",
      "starting_at_timestamp": 1411405200
    },
    // and more
```

</details>

The example above was the most basic request you can create, while our highly flexible football API 3.0 can handle way more advanced requests. Our API's data will enable you to create excellent and specialized applications.

Let’s make another request, and add an include to get more information. The includes can be found on the specific endpoint page. In our case, [fixtures](/v3/endpoints-and-entities/endpoints/fixtures).&#x20;

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN&include=statistics
```

{% endcode %}

You are getting the hang of it now. Let’s make one more request with multiple includes.

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures?apitoken=YOUR_TOKEN&include=statistics;events
```

{% endcode %}

{% hint style="info" %}
Are you interested in seeing the difference in response when you use includes vs when you don't? Check the below response examples.&#x20;

<details>

<summary>Response without includes</summary>

```javascript
{
  "data": [
    {
      "id": 17948776,
      "sport_id": 1,
      "league_id": 271,
      "season_id": 17328,
      "stage_id": 77448541,
      "group_id": null,
      "aggregate_id": null,
      "round_id": 240936,
      "state_id": 5,
      "venue_id": 339977,
      "name": "AGF vs Randers",
      "starting_at": "2021-04-22 15:45:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "last_processed_at": "2023-01-13 14:16:47",
      "starting_at_timestamp": 1619106300
    },
    {
      "id": 217802,
      "sport_id": 1,
      "league_id": 271,
      "season_id": 1282,
      "stage_id": 1095,
      "group_id": null,
      "aggregate_id": null,
      "round_id": 23491,
      "state_id": 5,
      "venue_id": 5599,
      "name": "Vestsjaelland vs AaB",
      "starting_at": "2014-09-22 17:00:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "last_processed_at": "2023-01-13 13:21:22",
      "starting_at_timestamp": 1411405200
    },

        // and more
```

</details>

<details>

<summary>Response with includes</summary>

```javascript
{
  "data": [
    {
      "id": 17948776,
      "sport_id": 1,
      "league_id": 271,
      "season_id": 17328,
      "stage_id": 77448541,
      "group_id": null,
      "aggregate_id": null,
      "round_id": 240936,
      "state_id": 5,
      "venue_id": 339977,
      "name": "AGF vs Randers",
      "starting_at": "2021-04-22 15:45:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "last_processed_at": "2023-01-13 14:16:47",
      "starting_at_timestamp": 1619106300,
      "statistics": [
        {
          "id": 297194,
          "fixture_id": 17948776,
          "type_id": 43,
          "participant_id": 2905,
          "data": {
            "value": 108
          },
          "location": "home"
        },
        {
          "id": 297195,
          "fixture_id": 17948776,
          "type_id": 43,
          "participant_id": 2356,
          "data": {
            "value": 112
          },
          "location": "away"
        },
        {
          "id": 297196,
          "fixture_id": 17948776,
          "type_id": 44,
          "participant_id": 2905,
          "data": {
            "value": 57
          },
          "location": "home"
        },
        {
          "id": 297197,
          "fixture_id": 17948776,
          "type_id": 44,
          "participant_id": 2356,
          "data": {
            "value": 42
          },
          "location": "away"
        },
// and more!        
```

</details>
{% endhint %}

## API Syntax

Great, now you have used the first part of API 3.0’s [syntax.](/v3/api/syntax) A quick overview of the new syntax:

<table><thead><tr><th>Syntax</th><th width="211">Usage</th><th>Example</th></tr></thead><tbody><tr><td><code>&#x26;select=</code></td><td>Select specific fields on the base entity</td><td><code>&#x26;select=name</code></td></tr><tr><td><code>&#x26;include=</code></td><td>Include relations</td><td><code>&#x26;include=lineups</code></td></tr><tr><td><code>&#x26;filters=</code></td><td>Filter your request</td><td><code>&#x26;filters=eventTypes:15</code></td></tr><tr><td><code>;</code></td><td>Mark end of (nested) relation. You can start including other relations from here</td><td><code>&#x26;include=lineups;events;participants</code></td></tr><tr><td><code>:</code></td><td>Mark field selection</td><td><code>&#x26;include=lineups:player_name;events:player_name,related_player_name,minute</code></td></tr><tr><td><code>,</code></td><td>Used as separation to select or filter on more ids</td><td><code>&#x26;include=events:player_name,related_player_name,minute&#x26;filters=eventTypes:15</code></td></tr></tbody></table>

### **Request: use multiple include**

For example, you want the teams and events of a certain fixture. In this case, you would use `participants;events`

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN&include=participants;events
```

{% endcode %}

<details>

<summary>Response</summary>

```javascript
{
  "data": [
    {
      "id": 17948776,
      "sport_id": 1,
      "league_id": 271,
      "season_id": 17328,
      "stage_id": 77448541,
      "group_id": null,
      "aggregate_id": null,
      "round_id": 240936,
      "state_id": 5,
      "venue_id": 339977,
      "name": "AGF vs Randers",
      "starting_at": "2021-04-22 15:45:00",
      "result_info": null,
      "leg": "1/1",
      "details": null,
      "length": 90,
      "placeholder": false,
      "last_processed_at": "2023-01-13 14:16:47",
      "starting_at_timestamp": 1619106300,
      "participants": [
        {
          "id": 2905,
          "sport_id": 1,
          "country_id": 320,
          "venue_id": 1708,
          "gender": "male",
          "name": "AGF",
          "short_code": "AGF",
          "image_path": "https://cdn.sportmonks.com/images/soccer/teams/25/2905.png",
          "founded": 1902,
          "type": "domestic",
          "placeholder": false,
          "last_played_at": "2023-01-19 14:00:00",
          "meta": {
            "location": "home"
          }
        },
        {
          "id": 2356,
          "sport_id": 1,
          "country_id": 320,
          "venue_id": 318820,
          "gender": "male",
          "name": "Randers",
          "short_code": "RDF",
          "image_path": "https://cdn.sportmonks.com/images/soccer/teams/20/2356.png",
          "founded": 2003,
          "type": "domestic",
          "placeholder": false,
          "last_played_at": "2022-11-13 19:00:00",
          "meta": {
            "location": "away"
          }
        }
      ],
      "events": [
        {
          "id": 2255893,
          "fixture_id": 17948776,
          "period_id": 20128,
          "participant_id": 2905,
          "type_id": 18,
          "section": "event",
          "player_id": 84471,
          "related_player_id": 151549,
          "player_name": "Alexander Munksgaard",
          "related_player_name": "Alex Gersbach",
          "result": null,
          "info": null,
          "addition": null,
          "minute": 32,
          "extra_minute": null,
          "injured": true,
          "on_bench": false,
          "coach_id": null,
          "sub_type_id": null
        },
  //and more!      
```

</details>

### Request: only select a specific field

One of our new additions to API 3.0 is a name field on the fixtures. The name field contains a textual representation of the participants playing the fixture. Without selecting a specific field, the API request and response would look like this:

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN
```

<details>

<summary>Response</summary>

```javascript
{
  "data": {
    "id": 18535517,
    "sport_id": 1,
    "league_id": 501,
    "season_id": 19735,
    "stage_id": 77457866,
    "group_id": null,
    "aggregate_id": null,
    "round_id": 274719,
    "state_id": 5,
    "venue_id": 8909,
    "name": "Celtic vs Rangers",
    "home_score": 4,
    "away_score": 0,
    "starting_at": "2022-09-03 11:30:00",
    "result_info": "Celtic won after full-time.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "starting_at_timestamp": 1662204600
  },
```

</details>

As you can see, the API response is rather large if you're only interested in the fixture's name. Let's select that API field to reduce the response length and size.&#x20;

We're using the [fixtures endpoint](/v3/endpoints-and-entities/endpoints/fixtures). This means we can select on all the fields of the [fixtures entity.](/v3/endpoints-and-entities/entities/fixture#fixture) You can do this by adding `&select=`{specific fields on the base [entity](/v3/endpoints-and-entities/entities)}.&#x20;

In our example, this would result in the below API request and response:

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&select=name
```

{% endcode %}

<details>

<summary>Response</summary>

```javascript
{
  "data": {
    "name": "Celtic vs Rangers",
    "id": 18535517,
    "sport_id": 1,
    "round_id": 274719,
    "stage_id": 77457866,
    "group_id": null,
    "aggregate_id": null,
    "league_id": 501,
    "season_id": 19735,
    "venue_id": 8909,
    "state_id": 5,
    "starting_at_timestamp": null
  },
```

</details>

As you can see in the example response above, the 'name' field is only returned for the fixture.

{% hint style="info" %}
Please note that the fields that have relations are also automatically included for technical reasons.
{% endhint %}

### Request: filter your request

Next to selecting specific fields on the base entity or includes, it’s possible to filter your request.

Let’s say you want to request all the events of a specific fixture, like Celtic vs Rangers. Your request would look like this:

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events
```

{% endcode %}

<details>

<summary>Response</summary>

```javascript
{
  "data": {
    "id": 18535517,
    "sport_id": 1,
    "league_id": 501,
    "season_id": 19735,
    "stage_id": 77457866,
    "group_id": null,
    "aggregate_id": null,
    "round_id": 274719,
    "state_id": 5,
    "venue_id": 8909,
    "name": "Celtic vs Rangers",
    "home_score": 4,
    "away_score": 0,
    "starting_at": "2022-09-03 11:30:00",
    "result_info": "Celtic won after full-time.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "starting_at_timestamp": 1662204600,
    "events": [
      {
        "id": 42645216,
        "fixture_id": 18535517,
        "period_id": 4295921,
        "participant_id": 53,
        "type_id": 18,
        "section": "event",
        "player_id": 108471,
        "related_player_id": 460810,
        "player_name": "Georgios Giakoumakis",
        "related_player_name": "Kyogo Furuhashi",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 5,
        "extra_minute": null,
        "injured": true,
        "on_bench": false
      },
      {
        "id": 42666547,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 18,
        "section": "event",
        "player_id": 172985,
        "related_player_id": 10504,
        "player_name": "Scott Wright",
        "related_player_name": "Glen Kamara",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 46,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42646477,
        "fixture_id": 18535517,
        "period_id": 4295921,
        "participant_id": 53,
        "type_id": 14,
        "section": "event",
        "player_id": 9939171,
        "related_player_id": null,
        "player_name": "Liel Abada",
        "related_player_name": null,
        "result": "1-0",
        "info": "Shot",
        "addition": "1st Goal",
        "minute": 8,
        "extra_minute": null,
        "injured": null,
        "on_bench": false
      },
      {
        "id": 42657121,
        "fixture_id": 18535517,
        "period_id": 4295921,
        "participant_id": 53,
        "type_id": 19,
        "section": "event",
        "player_id": 1712,
        "related_player_id": null,
        "player_name": "Cameron Carter-Vickers",
        "related_player_name": null,
        "result": null,
        "info": "Foul",
        "addition": "3rd Yellow Card",
        "minute": 44,
        "extra_minute": null,
        "injured": null,
        "on_bench": false
      },
      {
        "id": 42656106,
        "fixture_id": 18535517,
        "period_id": 4295921,
        "participant_id": 53,
        "type_id": 14,
        "section": "event",
        "player_id": 9939171,
        "related_player_id": 1494712,
        "player_name": "Liel Abada",
        "related_player_name": "Matt O'Riley",
        "result": "3-0",
        "info": "Shot",
        "addition": "3rd Goal",
        "minute": 40,
        "extra_minute": null,
        "injured": null,
        "on_bench": false
      },
  },
```

</details>

As you can see in the response, you will receive all match events. But what if you’re only interested in a specific event like goals, cards or substitutions? **You can filter on the specific data you're interested in:**&#x20;

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events&filters=eventTypes:18
```

{% endcode %}

<details>

<summary>Response</summary>

```javascript
{
  "data": {
    "id": 18535517,
    "sport_id": 1,
    "league_id": 501,
    "season_id": 19735,
    "stage_id": 77457866,
    "group_id": null,
    "aggregate_id": null,
    "round_id": 274719,
    "state_id": 5,
    "venue_id": 8909,
    "name": "Celtic vs Rangers",
    "home_score": 4,
    "away_score": 0,
    "starting_at": "2022-09-03 11:30:00",
    "result_info": "Celtic won after full-time.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "starting_at_timestamp": 1662204600,
    "events": [
      {
        "id": 42645216,
        "fixture_id": 18535517,
        "period_id": 4295921,
        "participant_id": 53,
        "type_id": 18,
        "section": "event",
        "player_id": 108471,
        "related_player_id": 460810,
        "player_name": "Georgios Giakoumakis",
        "related_player_name": "Kyogo Furuhashi",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 5,
        "extra_minute": null,
        "injured": true,
        "on_bench": false
      },
      {
        "id": 42666547,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 18,
        "section": "event",
        "player_id": 172985,
        "related_player_id": 10504,
        "player_name": "Scott Wright",
        "related_player_name": "Glen Kamara",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 46,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42687449,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 18,
        "section": "event",
        "player_id": 172394,
        "related_player_id": 3262,
        "player_name": "Ryan Jack",
        "related_player_name": "John Lundstram",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 78,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42688034,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 18,
        "section": "event",
        "player_id": 1452870,
        "related_player_id": 3387,
        "player_name": "Fashion Sakala",
        "related_player_name": "Ryan Kent",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 78,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42675143,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 18,
        "section": "event",
        "player_id": 92276,
        "related_player_id": 32026,
        "player_name": "Alfredo Morelos",
        "related_player_name": "Antonio Colak",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 60,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42675290,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 18,
        "section": "event",
        "player_id": 1442,
        "related_player_id": 23277869,
        "player_name": "Scott Arfield",
        "related_player_name": "Malik Tillman",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 60,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42682889,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 53,
        "type_id": 18,
        "section": "event",
        "player_id": 173160,
        "related_player_id": 1494712,
        "player_name": "David Turnbull",
        "related_player_name": "Matt O'Riley",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 72,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42683195,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 53,
        "type_id": 18,
        "section": "event",
        "player_id": 319282,
        "related_player_id": 9939171,
        "player_name": "Daizen Maeda",
        "related_player_name": "Liel Abada",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 73,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42683644,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 53,
        "type_id": 18,
        "section": "event",
        "player_id": 3298,
        "related_player_id": 10966261,
        "player_name": "Aaron Mooy",
        "related_player_name": "Reo Hatate",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 73,
        "extra_minute": null,
        "injured": false,
        "on_bench": false
      },
      {
        "id": 42673138,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 53,
        "type_id": 18,
        "section": "event",
        "player_id": 1494701,
        "related_player_id": 190919,
        "player_name": "Moritz Jenz",
        "related_player_name": "Carl Starfelt",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 56,
        "extra_minute": null,
        "injured": true,
        "on_bench": false
      }
    ]
  },
```

</details>

### Next steps: Optimise your requests

You've made your first API request, great start! But there's much more you can do to make your requests more powerful and efficient.

Right now, you're getting all the data available for that endpoint. In the real world, you'll often want to:

* **Get only the data you need** (reduce response size and speed)
* **Filter results** (only matches from a specific league, date range, etc.)
* **Include related data** (player info, match events, statistics, all in one request)
* **Sort and organise** results exactly how your app needs them

Learn how to do all of this and more with our comprehensive **Request Options** guide. It shows you exactly how to fine-tune every API call to retrieve precisely what your application needs.

[Explore Request Options →](https://docs.sportmonks.com/football/api/request-options)