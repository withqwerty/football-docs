---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.847Z
---
# Selecting and filtering

Thanks to the API flexibility, you can select specific fields and filter simultaneously!

Let’s continue with our events example from the last section: we want all the goal and substitution events:

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events.type&filters=eventTypes:18,14
```

{% endcode %}

{% hint style="info" %}
This time we’ve used the include events.type to have the name of the event type included in the response. More information about this can be found in our [nested include tutorial.](/v3/tutorials-and-guides/tutorials/enrich-your-response/nested-includes)
{% endhint %}

Now, the events include contains a lot of information we’re not interested in. Frankly, we’re only interested in the name of the players related to the event and the minute the event occurred. As you’ve learnt, we can select all the fields on the base entity.&#x20;

In our example, the events entity. We need the `player_name,` `related_player_name` and `minute` field. This results in the following steps:

1. Add the include: `&include=events`&#x20;
2. Determine the fields you’re interested in: `“player_name”,` `“related_player_name”` and `“minute”` field.&#x20;
3. Select the fields: `&include=events:player_name,related_player_name,minute`

The above steps result in the following request:

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events:player_name,related_player_name,minute
```

{% endcode %}

Now, add the filter from the previous filter request: `&filters=eventTypes:18,14`

{% code overflow="wrap" %}

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events:player_name,related_player_name,minute&filters=eventTypes:18,14
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
    "events": [
      {
        "id": 42683644,
        "type_id": 18,
        "sub_type_id": null,
        "fixture_id": 18535517,
        "player_id": 3298,
        "related_player_id": 10966261,
        "period_id": 4296154,
        "participant_id": 53,
        "player_name": "Aaron Mooy",
        "related_player_name": "R. Hatate",
        "minute": 73
      },
      {
        "id": 42683195,
        "type_id": 18,
        "sub_type_id": null,
        "fixture_id": 18535517,
        "player_id": 319282,
        "related_player_id": 9939171,
        "period_id": 4296154,
        "participant_id": 53,
        "player_name": "Daizen Maeda",
        "related_player_name": "L. Abada",
        "minute": 73
      },
      {
        "id": 42688034,
        "type_id": 18,
        "sub_type_id": null,
        "fixture_id": 18535517,
        "player_id": 1452870,
        "related_player_id": 3387,
        "period_id": 4296154,
        "participant_id": 62,
        "player_name": "F. Sakala",
        "related_player_name": "Ryan Kent",
        "minute": 78
      },
      {
        "id": 42688040,
        "type_id": 14,
        "sub_type_id": null,
        "fixture_id": 18535517,
        "player_id": 173160,
        "related_player_id": null,
        "period_id": 4296154,
        "participant_id": 53,
        "player_name": "David Turnbull",
        "related_player_name": null,
        "minute": 78
      },
      {
        "id": 42675290,
        "type_id": 18,
        "sub_type_id": null,
        "fixture_id": 18535517,
        "player_id": 92276,
        "related_player_id": 32026,
        "period_id": 4296154,
        "participant_id": 62,
        "player_name": "Alfredo Morelos",
        "related_player_name": "Antonio Colak",
        "minute": 60
      },
      {
        "id": 42675143,
        "type_id": 18,
        "sub_type_id": null,
        "fixture_id": 18535517,
        "player_id": 1442,
        "related_player_id": 23277869,
        "period_id": 4296154,
        "participant_id": 62,
        "player_name": "Scott Arfield",
        "related_player_name": "Malik Tillman",
        "minute": 60
      },
      
      // And more
```

</details>

{% hint style="info" %}
Please note that if you also want the name of the event type you need to add the `events.type` include as well.

`https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events:player_name,related_player_name,minute;event.type&filters=eventTypes:18,14`
{% endhint %}