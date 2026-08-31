---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.845Z
---
# Syntax and filters

## Syntax

The syntax for filtering and including works differently from API V2. The syntax is used across all endpoints: the documentation for each endpoint describes the exceptions regarding exclusions of some fields/relations. Find out everything about the new [syntax](/v3/api/syntax).

### Filters&#x20;

The filter system changed compared to the previous version. You can now select specific fields on the base entity or includes, and it’s possible to filter your request. Below is a fixture shown with events.

<details>

<summary>Example Fixture with Events</summary>

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events
```

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
        "related_player_name": "L. Abada",
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
      {
        "id": 42703418,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 62,
        "type_id": 19,
        "section": "event",
        "player_id": 2927,
        "related_player_id": null,
        "player_name": "Connor Goldson",
        "related_player_name": null,
        "result": null,
        "info": "Foul",
        "addition": "6th Yellow Card",
        "minute": 90,
        "extra_minute": null,
        "injured": null,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": null
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
        "player_name": "F. Sakala",
        "related_player_name": "Ryan Kent",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 78,
        "extra_minute": null,
        "injured": false,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": null
      },
//And more      
```

</details>

As you can see in the response, you will receive all match events. But what if you’re only interested in a specific event like goals, cards or substitutions? You can filter on the specific data you're interested in. The URL now includes a `&filters` query parameter that shows the entity you want to filter on and the IDs you want to see in your results.

<details>

<summary>Example Fixture with Filtered Goal Events</summary>

```javascript
https://api.sportmonks.com/v3/football/fixtures/18535517?api_token=YOUR_TOKEN&include=events&filters=eventTypes:14
```

```json
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
        "id": 42688040,
        "fixture_id": 18535517,
        "period_id": 4296154,
        "participant_id": 53,
        "type_id": 14,
        "section": "event",
        "player_id": 173160,
        "related_player_id": null,
        "player_name": "David Turnbull",
        "related_player_name": null,
        "result": "4-0",
        "info": "Shot",
        "addition": "4th Goal",
        "minute": 78,
        "extra_minute": null,
        "injured": null,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": null
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
        "player_name": "L. Abada",
        "related_player_name": null,
        "result": "1-0",
        "info": "Shot",
        "addition": "1st Goal",
        "minute": 8,
        "extra_minute": null,
        "injured": null,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": null
      },
      //And more
```

</details>

So, we already explained how to use filters and how to filter on one particular ID. But what if you're interested in filtering on multiple IDs? That is also possible! You can use filters on multiple IDs.&#x20;

<details>

<summary>Example Fixture with Filtered Events on multiple IDs</summary>

```javascript
https://api.sportmonks.com/v3/football/fixtures/18842556?api_token=YOUR_TOKEN&include=events.type&filters=eventTypes:14,18
```

{% code fullWidth="false" %}

```json
{
  "data": {
    "id": 18842556,
    "sport_id": 1,
    "league_id": 8,
    "season_id": 21646,
    "stage_id": 77464011,
    "group_id": null,
    "aggregate_id": null,
    "round_id": 307169,
    "state_id": 5,
    "venue_id": 230,
    "name": "Liverpool vs Manchester City",
    "starting_at": "2024-03-10 15:45:00",
    "result_info": "Game ended in draw.",
    "leg": "1/1",
    "details": null,
    "length": 90,
    "placeholder": false,
    "has_odds": true,
    "starting_at_timestamp": 1710085500,
    "events": [
      {
        "id": 108388309,
        "fixture_id": 18842556,
        "period_id": 5277498,
        "participant_id": 9,
        "type_id": 14,
        "section": "event",
        "player_id": 982,
        "related_player_id": 1371,
        "player_name": "John Stones",
        "related_player_name": "Kevin De Bruyne",
        "result": "0-1",
        "info": "Shot",
        "addition": "1st Goal",
        "minute": 23,
        "extra_minute": null,
        "injured": null,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": 1522,
        "type": {
          "id": 14,
          "name": "Goal",
          "code": "goal",
          "developer_name": "GOAL",
          "model_type": "event",
          "stat_group": null
        }
      },
      {
        "id": 108406572,
        "fixture_id": 18842556,
        "period_id": 5277705,
        "participant_id": 8,
        "type_id": 18,
        "section": "event",
        "player_id": 30062,
        "related_player_id": 6013424,
        "player_name": "Cody Gakpo",
        "related_player_name": "Darwin Núñez",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 76,
        "extra_minute": null,
        "injured": false,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": 1523,
        "type": {
          "id": 18,
          "name": "Substitution",
          "code": "substitution",
          "developer_name": "SUBSTITUTION",
          "model_type": "event",
          "stat_group": null
        }
      },
      {
        "id": 108400368,
        "fixture_id": 18842556,
        "period_id": 5277705,
        "participant_id": 9,
        "type_id": 18,
        "section": "event",
        "player_id": 34594,
        "related_player_id": 159142,
        "player_name": "Stefan Ortega",
        "related_player_name": "Ederson",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 56,
        "extra_minute": null,
        "injured": true,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": 1524,
        "type": {
          "id": 18,
          "name": "Substitution",
          "code": "substitution",
          "developer_name": "SUBSTITUTION",
          "model_type": "event",
          "stat_group": null
        }
      },
      {
        "id": 108405790,
        "fixture_id": 18842556,
        "period_id": 5277705,
        "participant_id": 8,
        "type_id": 18,
        "section": "event",
        "player_id": 1078,
        "related_player_id": 37316835,
        "player_name": "Andrew Robertson",
        "related_player_name": "Conor Bradley",
        "result": null,
        "info": null,
        "addition": null,
        "minute": 61,
        "extra_minute": null,
        "injured": false,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": 1523,
        "type": {
          "id": 18,
          "name": "Substitution",
          "code": "substitution",
          "developer_name": "SUBSTITUTION",
          "model_type": "event",
          "stat_group": null
        }
      },
```

{% endcode %}

</details>

More information and a more detailed explanation are covered on our [request options page.](/v3/api/request-options)

### Select the fields you need

You can request only the fields you need by using the new [syntax](/v3/api/syntax). Filters can filter the data based on the fields you would like to display in your application.

`:` can be used for filtering the fields you want to see in the response. For example, you only want the name of a certain team. In this case you need to use `participants:name`.

## Custom Sorting

You can use custom sorts on endpoints; this enables the sorting of base entities returned in the endpoint responses. This feature is designed to enhance flexibility and customisation for users interacting with the API.

### Usage

This provides users with the ability to customise sorting of returned data through the use of the `sortBy` and `order` parameters. This functionality is particularly useful when retrieving lists of fixtures in football, as it allows users to organise the data based on specific criteria.

**Sorting Fixtures**

When querying fixtures, users can specify the field to sort by and the desired order using the following parameters:

* **sortBy**: Specifies the field by which the data will be sorted. Currently supported fields include `starting_at` and `name`.
* **order**: Determines the order in which the data will be sorted. Users can choose between ascending (`asc`) and descending (`desc`) orders.

### Examples

**Sort by `starting_at`**: This option sorts the fixtures based on their starting date and time.

```bash
https://api.sportmonks.com/v3/football/fixtures&sortBy=starting_at&order=desc
```

This URL sorts the fixtures in descending order of their starting date and time.

**Sort by `name`**: This option sorts the fixtures alphabetically based on their names.

```bash
https://api.sportmonks.com/v3/football/fixtures&sortBy=name&order=asc
```

This URL sorts the fixtures alphabetically by their names in ascending order.

{% hint style="info" %}
Sorting on the `name` field currently works for all entities with a `"name"` field. For Fixtures, sorting also works on the `starting_at` field.
{% endhint %}

{% hint style="danger" %}
If an unsupported field is passed to sort on, an error is thrown, and the request returns a 400 Bad Request HTTP code.
{% endhint %}

A more detailed explanation is covered on our [request options page](/v3/api/request-options)