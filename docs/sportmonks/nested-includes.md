---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.847Z
---
# Nested includes

The nested include allows you to further enrich your data by requesting more information from a standard include. Might sound difficult, but we assure you, it’s anything but hard. This is how we use nested includes.

### Create your request&#x20;

For example, in our [includes tutorial ](/v3/tutorials-and-guides/tutorials/includes)you’ve enriched your [GET Fixture by Date](/v3/endpoints-and-entities/endpoints/fixtures/get-fixtures-by-date) request with the `participant`, and `events` includes:

```javascript
https://api.sportmonks.com/v3/football/fixtures/date/2022-09-03?api_token=YOUR_TOKEN&include=participants;events
```

The include event shows you the data about players who received a card, scored a goal, or were substituted. A snippet of the response:&#x20;

<details>

<summary>Response</summary>

```javascript
{
  "data": [
    {
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
      "last_processed_at": "2023-02-17 10:19:55",
      "has_odds": true,
      "starting_at_timestamp": 1662204600,
      "participants": [
        {
          "id": 53,
          "sport_id": 1,
          "country_id": 1161,
          "venue_id": 8909,
          "gender": "male",
          "name": "Celtic",
          "short_code": "CEL",
          "image_path": "https://cdn.sportmonks.com/images/soccer/teams/21/53.png",
          "founded": 1888,
          "type": "domestic",
          "placeholder": false,
          "last_played_at": "2023-02-26 15:00:00",
          "meta": {
            "location": "home",
            "winner": true,
            "position": 1
          }
        },
        {
          "id": 62,
          "sport_id": 1,
          "country_id": 1161,
          "venue_id": 8914,
          "gender": "male",
          "name": "Rangers",
          "short_code": "RAN",
          "image_path": "https://cdn.sportmonks.com/images/soccer/teams/30/62.png",
          "founded": 1873,
          "type": "domestic",
          "placeholder": false,
          "last_played_at": "2023-02-26 15:00:00",
          "meta": {
            "location": "away",
            "winner": false,
            "position": 2
          }
        }
      ],
      "events": [
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
          "related_player_name": "R. Hatate",
          "result": null,
          "info": null,
          "addition": null,
          "minute": 73,
          "extra_minute": null,
          "injured": false,
          "on_bench": false,
          "coach_id": null,
          "sub_type_id": null
        },
     //And more
```

</details>

But what if we want to know more about the players, who scored a goal, like their country of origin, height, weight, age, image, etc? This is where the nested include comes into play!

### Using nested includes&#x20;

The nested includes are represented in the form of dots (.), which are then linked to a standard include. This shows their relationship.&#x20;

{% hint style="info" %}
Check our [syntax section](/v3/api/syntax) for a complete syntax overview.
{% endhint %}

Because the include event is related to a player. You can add `.player` to the include, which will result in the nested include: `events.player`

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/date/2022-09-03?api_token=YOUR_TOKEN&include=participants;events.player
```

{% endcode %}

<details>

<summary>Response</summary>

```javascript
{
  "data": [
    {
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
      "last_processed_at": "2023-02-17 10:19:55",
      "has_odds": true,
      "starting_at_timestamp": 1662204600,
      "participants": [
        {
          "id": 53,
          "sport_id": 1,
          "country_id": 1161,
          "venue_id": 8909,
          "gender": "male",
          "name": "Celtic",
          "short_code": "CEL",
          "image_path": "https://cdn.sportmonks.com/images/soccer/teams/21/53.png",
          "founded": 1888,
          "type": "domestic",
          "placeholder": false,
          "last_played_at": "2023-02-26 15:00:00",
          "meta": {
            "location": "home",
            "winner": true,
            "position": 1
          }
        },
        {
          "id": 62,
          "sport_id": 1,
          "country_id": 1161,
          "venue_id": 8914,
          "gender": "male",
          "name": "Rangers",
          "short_code": "RAN",
          "image_path": "https://cdn.sportmonks.com/images/soccer/teams/30/62.png",
          "founded": 1873,
          "type": "domestic",
          "placeholder": false,
          "last_played_at": "2023-02-26 15:00:00",
          "meta": {
            "location": "away",
            "winner": false,
            "position": 2
          }
        }
      ],
      "events": [
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
          "related_player_name": "R. Hatate",
          "result": null,
          "info": null,
          "addition": null,
          "minute": 73,
          "extra_minute": null,
          "injured": false,
          "on_bench": false,
          "coach_id": null,
          "sub_type_id": null,
          "player": {
            "id": 3298,
            "sport_id": 1,
            "country_id": 98,
            "nationality_id": 98,
            "city_id": null,
            "position_id": 26,
            "detailed_position_id": 153,
            "type_id": 26,
            "common_name": "A. Mooy",
            "firstname": "Aaron",
            "lastname": "Mooy",
            "name": "Aaron Mooy",
            "display_name": "Aaron Mooy",
            "image_path": "https://cdn.sportmonks.com/images/soccer/players/2/3298.png",
            "height": 174,
            "weight": 68,
            "date_of_birth": "1990-09-15",
            "gender": "male"
          }
        },
```

</details>