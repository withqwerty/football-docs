---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.847Z
---
# Selecting fields

## Field selection

API 3.0 introduces the possibility to request specific fields on entities. This possibility comes in handy when you only use particular fields in an API response. The advantage of selecting specific fields is that it reduces the response speed in mainly large responses. In addition to reducing response time, the response size can also be drastically reduced. Let's take a look together at an example.&#x20;

### Only select a specific field

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
    "starting_at": "2022-09-03 11:30:00",
    "result_info": "Celtic won after full-time.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "last_processed_at": "2023-03-02 17:47:38",
    "has_odds": true,
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

### Select a specific field on an include

You can also use field selection based on includes. Imagine you want to access fixture lineup information from Celtic vs Ranger (fixture id: 18535517). Additional to the lineups, you also wish to receive the display names, player images and country details.

{% hint style="warning" %}
Please note that we only copied the first player in the lineup in the below examples
{% endhint %}

Without selecting specific fields, you will receive a lot of information you don't need. The API request and partial API response would look like this:

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=lineups.player;lineups.player.country
```

{% endcode %}

<details>

<summary><strong>Response</strong></summary>

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
    "starting_at": "2022-09-03 11:30:00",
    "result_info": "Celtic won after full-time.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "last_processed_at": "2023-03-02 17:47:38",
    "has_odds": true,
    "starting_at_timestamp": 1662204600,
    "lineups": [
      {
        "id": 296138906,
        "sport_id": 1,
        "fixture_id": 18535517,
        "player_id": 275,
        "team_id": 53,
        "position_id": 24,
        "formation_field": "1:1",
        "type_id": 11,
        "formation_position": 1,
        "player_name": "Joe Hart",
        "jersey_number": 1,
        "player": {
          "id": 275,
          "sport_id": 1,
          "country_id": 462,
          "nationality_id": 462,
          "city_id": null,
          "position_id": 24,
          "detailed_position_id": 24,
          "type_id": 24,
          "common_name": "J. Hart",
          "firstname": "Joe",
          "lastname": "Hart",
          "name": "Joe Hart",
          "display_name": "Joe Hart",
          "image_path": "https://cdn.sportmonks.com/images/soccer/players/19/275.png",
          "height": 196,
          "weight": 91,
          "date_of_birth": "1987-04-19",
          "gender": "male",
          "country": {
            "id": 462,
            "continent_id": 1,
            "name": "United Kingdom",
            "official_name": "United Kingdom of Great Britain and Northern Ireland",
            "fifa_name": "ENG,NIR,SCO,WAL",
            "iso2": "GB",
            "iso3": "GBR",
            "latitude": "54.56088638305664",
            "longitude": "-2.2125117778778076",
            "borders": [
              "IRL"
            ],
            "image_path": "https://cdn.sportmonks.com/images/countries/png/short/gb.png"
          }
        }
      },
      //And more
```

</details>

Now, let's select specific fields on the base entities used.&#x20;

Since we're using the `lineups.player` include, the first base entity is [players](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#players). We can select on all the fields of that entity. In our example, you need to select `display_name` and `image_path.`

The second base entity is [countries](https://docs.sportmonks.com/v3/core-api/). Just like on the player entity, we can select on all the fields of the [countries](https://docs.sportmonks.com/v3/core-api/) entity. In our example, you need to select `name` and `image_path.`

The new API request and partial API response would look like this:

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=lineups.player:display_name,image_path;lineups.player.country:name,image_path
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
    "starting_at": "2022-09-03 11:30:00",
    "result_info": "Celtic won after full-time.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "last_processed_at": "2023-03-02 17:47:38",
    "has_odds": true,
    "starting_at_timestamp": 1662204600,
    "lineups": [
      {
        "id": 296138906,
        "sport_id": 1,
        "fixture_id": 18535517,
        "player_id": 275,
        "team_id": 53,
        "position_id": 24,
        "formation_field": "1:1",
        "type_id": 11,
        "formation_position": 1,
        "player_name": "Joe Hart",
        "jersey_number": 1,
        "player": {
          "id": 275,
          "country_id": 462,
          "sport_id": 1,
          "city_id": null,
          "position_id": 24,
          "detailed_position_id": 24,
          "nationality_id": 462,
          "display_name": "Joe Hart",
          "image_path": "https://cdn.sportmonks.com/images/soccer/players/19/275.png",
          "country": {
            "id": 462,
            "continent_id": 1,
            "name": "United Kingdom",
            "image_path": "https://cdn.sportmonks.com/images/countries/png/short/gb.png"
          }
        }
      },
      // And more
```

</details>

See how the size of the response is reduced? Next to selecting specific fields on the base entity or includes, it’s possible to filter your request. Check the next section for more info.&#x20;