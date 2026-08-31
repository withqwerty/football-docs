---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.845Z
---
# API Changes

## States and Types

We introduced states and types to ensure data quality and consistency for specific fields.&#x20;

### States

A fixture moves between several statuses. It has an initial status (NS), can be delayed (DELA), has been finished (FT) or any of the statuses described on the [states page](/v3/definitions/states). You could also use the [states endpoint](/v3/endpoints-and-entities/endpoints/states) to retrieve all possible states.&#x20;

### Types

Something has a type, when there are multiple variants of a certain variant.

For example, types for referees. Referees can be the head referee, the assistant referee or the fourth official. Due to types we qualify which variant of the belonging entity the specific referee is.

This was introduced to ensure all sports will follow the exact same structure in API 3.0.

**New types:** Position ID and detailed position ID are new types. Also, periods, sidelined, referees, events, standings, metadata, formations, colors, injuries, suspensions, predictions, and stats contain fields that belong to a type.

## Strict typing

Strictly typed languages enforce typing on all data being interacted with. All data types strictly conform to standard JSON notations. In addition to data types being stricter, we also added types to various entities to ensure higher data consistency.&#x20;

## Scores

In API 2.0 the scores of a fixture are in the default API response. In API 3.0 this is not the case. For API 3 we've introduced the *`scores`* include. This has been added to retrieve a score for fixtures more conveniently. The include returns the scores per period and the current score for the regarding fixture.&#x20;

## Participants vs localTeam & visitorTeam include&#x20;

This might be one of the most important model changes in API 3.0. Previously, `localTeam` and `visitorTeam` were the includes to use to get all team data. The previous includes are replaced by our new include: `participants.`From now on, this is the way to get information about the teams participating in a match.&#x20;

Both teams that play in the fixture are present in the participants array and their location is located in the meta section of a team. Below is an example of how a fixture with this new include can look.

<details>

<summary>Example</summary>

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
    "scores": [
      {
        "id": 11316768,
        "fixture_id": 18535517,
        "type_id": 1,
        "participant_id": 53,
        "score": {
          "goals": 3,
          "participant": "home"
        },
        "description": "1ST_HALF"
      },
      {
        "id": 11316769,
        "fixture_id": 18535517,
        "type_id": 1,
        "participant_id": 62,
        "score": {
          "goals": 0,
          "participant": "away"
        },
        "description": "1ST_HALF"
      },
      {
        "id": 11316770,
        "fixture_id": 18535517,
        "type_id": 2,
        "participant_id": 53,
        "score": {
          "goals": 4,
          "participant": "home"
        },
        "description": "2ND_HALF"
      },
      {
        "id": 11316771,
        "fixture_id": 18535517,
        "type_id": 2,
        "participant_id": 62,
        "score": {
          "goals": 0,
          "participant": "away"
        },
        "description": "2ND_HALF"
      },
      {
        "id": 11316772,
        "fixture_id": 18535517,
        "type_id": 1525,
        "participant_id": 53,
        "score": {
          "goals": 4,
          "participant": "home"
        },
        "description": "CURRENT"
      },
      {
        "id": 11316773,
        "fixture_id": 18535517,
        "type_id": 1525,
        "participant_id": 62,
        "score": {
          "goals": 0,
          "participant": "away"
        },
        "description": "CURRENT"
      }
    ],
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
    "periods": [
      {
        "id": 4295921,
        "fixture_id": 18535517,
        "type_id": 1,
        "started": 1662204680,
        "ended": 1662207533,
        "counts_from": 0,
        "ticking": false,
        "sort_order": 1,
        "description": "1st-half",
        "time_added": 2,
        "period_length": 45,
        "minutes": null,
        "seconds": null
      },
      {
        "id": 4296154,
        "fixture_id": 18535517,
        "type_id": 2,
        "started": 1662208498,
        "ended": 1662211318,
        "counts_from": 45,
        "ticking": false,
        "sort_order": 2,
        "description": "2nd-half",
        "time_added": 2,
        "period_length": 45,
        "minutes": null,
        "seconds": null
      }
    ]
  },
```

</details>

## Rate limit per entity

The rate limit will now be based on requests per entity instead of being based on a single endpoint. For example, the Team entity is used in Teams endpoints. You can find out more about the rate limit [here](/v3/api/rate-limit).

### Pagination

A new pagination system has been implemented. In API 3.0, we will no longer provide a `count` and `total_pages` property in the meta of the response. Instead, you can paginate using the `has_more` parameter to determine if you can still propagate through results. This change decreases the load on our databases and massively increases API response speed and reliability.

In addition to that it is now possible to add the *filters=populate* to your query parameter. This parameter allows for a higher pagination limit (max 1000), so you can populate your database more conveniently instead of using the default pagination limit of 50. To prevent our services from overloading, using includes is disabled when this filter is added to the request.&#x20;

Please check our [pagination tutorial ](/v3/tutorials-and-guides/tutorials/introduction/pagination)for more info.

### Livescores endpoints

For API 2.0, we only had two live score endpoints. The “GET All Livescores” and “GET All In play Livescores”. The GET All Livescores endpoint gave all matches that would take place on that specific day, while the GET All In play Livescores endpoint would return all fixtures 15 minutes before they started. It will also disappear 15 minutes after the game is finished.

For API 3.0, there are three live score endpoints available. The “GET Inplay Livescores”, “GET All Livescores”, and the “GET Latest Updated Livescores”.

**The GET Inplay Livescores:** GET All Inplay Livescores: returns all the inplay fixtures.

**GET All Livescores:** Returns the fixtures 15 minutes before the game starts. It will also disappear 15 minutes after the game is finished.

**GET Latest Updated Livescores:** Returns all livescores that have received updates within 10 seconds.

{% hint style="info" %}
When you need the fixtures that will take place on a specific date, you can use the “GET Fixtures by Date” endpoint. This returns the fixtures from your requested date.
{% endhint %}

## Core and odds

[Core](https://docs.sportmonks.com/football2/v/core/) and [odds](https://docs.sportmonks.com/football2/v/odds/getting-started/welcome) are no longer sport specific. Both have their own documentation related to all sports released on API 3.0. Odds contain bookmakers and markets which are not sport specific but Odds are still available on a per sport basis.

Bookmakers in API 3.0 have a different ID compared to API 2.0. To make migration easier, bookmakers that were also available in API 2.0 have a legacy\_id field, which contains the ID of this bookmaker in API 2.0. Please check our [tutorial on bookmakers](/v3/tutorials-and-guides/tutorials/odds-and-predictions/bookmakers#get-all-bookmakers) for more info.

## Statistics

In API version 3 (V3), only recorded statistical values are returned in the response payload. This is a deliberate change from version 2 (V2), where unrecorded statistics were represented with a default value of zero.

**What’s different in V3?**

In V3, if an event or stat, such as a red card, has been recorded during a match, the corresponding value will be included in the API response. However, if no red card was issued in the match, that field will simply be **absent** from the response instead of returning `"redcards": 0` as was the case in V2.

**Why was this change made?**

This update is aimed at improving data integrity and clarity. By excluding fields for events that did not occur, the API avoids implying that a value of zero was definitively recorded. This is particularly relevant in cases where certain data might not have been tracked or confirmed, which could previously lead to misleading assumptions.

## Trends

In API version 2, values in trends were for each team identifiable using only the minute of the recorded value, without a clear separation between periods, which could result in trends during injury time of the first half overlapping with the start of the second half. In version 3, all trend entities are listed within the same list and identifiable using the period, minute and participant (team). When a value is recorded during injury time, the minute and extra minute are added together.

**Why was this change made?**

This update is aimed at improving clarity and consistency through the API. Separation of the periods also prevents overlapping of values, which could show abnormal lines when showing trend graphs using version 2 data directly.

For a deeper, tutorial-style explanation and examples of how to work with trend data in your integration, see the [Trends](/v3/tutorials-and-guides/tutorials/trends) page.