---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.846Z
---
# Changelog

Since the release of API3 and onwards, we will list any additions and changes made in the API on this page, in chronological order (YYYY-MM-DD format)

### 2026-06-23

**Offset pagination depth limit**

Requests that page beyond 20,000 rows using offset-based pagination will now be rejected with a `4xx` error. This limit applies when `(page - 1) × per_page` exceeds 20,000.

At the default `per_page` of 25, the cap is reached at page 801. At the maximum `per_page` of 50, the cap is reached at page 401.

{% hint style="warning" %}
If your integration hits this limit, switch to cursor-based pagination. Every paginated response already includes a `next_cursor` field - follow it to traverse results beyond the cap. Cursor pagination has no depth limit and is faster under load.

For full documentation and code examples, see [Pagination](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/introduction/pagination).&#x20;
{% endhint %}

Cursor-based pagination was introduced on [2026-06-05](https://docs.sportmonks.com/v3/changelog/changelog#id-2026-06-05). The `next_cursor` field is present in all paginated responses. Pass it as a `cursor` parameter in your next request and repeat until `has_more` is `false`.

```json
"pagination": {
  "count": 25,
  "per_page": 25,
  "current_page": 1,
  "next_cursor": "WzEsMixbMTk3MTAxMDBdLFtbInNwb3J0cy5maXh0dXJlcy5pZCIsMV1dXQ",
  "has_more": true
}
```

### 2026-06-05

**Cursor-based pagination**

Pagination now uses a cursor-based approach. The old page-number method remains supported for existing integrations, but cursor-based pagination is recommended for all new customers and will eventually replace the old method.

The response `pagination` object now includes a `next_cursor` field instead of `next_page`. Pass the `next_cursor` value as a `cursor` parameter in your next request and repeat until `has_more` is `false`.

json

```json
"pagination": {
  "count": 25,
  "per_page": 25,
  "current_page": 1,
  "next_cursor": "WzEsMixbMTk3MTAxMDBdLFtbInNwb3J0cy5maXh0dXJlcy5pZCIsMV1dXQ",
  "has_more": true
}
```

For full documentation and code examples, see [Pagination](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/introduction/pagination).

### 2026-05-27

**Delay and break timeline events**

Two new timeline event types have been added to track match delays and scheduled breaks, such as hydration breaks and cooling breaks.

| Type          | `type_id` | Description                              |
| ------------- | --------- | ---------------------------------------- |
| `DELAY_START` | `132791`  | Recorded when a delay or break begins    |
| `DELAY_END`   | `132792`  | Recorded when play resumes after a break |

Both types appear on the `timeline` include and follow the same structure as other event records. The `info` field on a `DELAY_START` record describes the reason for the break where available (e.g. `"Hydration break"`). `DELAY_END` records always return `null` for `info`.

Each delay produces one record per participant, so expect two `DELAY_START` records and two `DELAY_END` records per break - one for each team's `participant_id`.

{% hint style="info" %}
This feature is currently being rolled out to select competitions.

Initial 'Hydration break' coverage includes the FIFA Club World Cup and FIFA World Cup 2026. For full documentation, see [Hydration Breaks](https://docs.sportmonks.com/v3/world-cup-2026/hydration-breaks).

Additionally, delay events are being rolled out to our Free Plan leagues (Danish Superliga and Scottish Premiership), with more leagues following later on.
{% endhint %}

### 2026-05-21

**Improved API error messages**

Four improvements have been made to API error responses to make debugging faster and more precise.

**Selecting a field that is a relationship now returns a specific error**

Previously, passing a relationship name to `select` returned a generic error. The response now clearly indicates that the field is a relationship and should be used with `include` instead.

```
GET /v3/football/teams/3468?include=coaches&select=coaches
```

```json
// Before
"message": "You made an incorrect request, please check your includes and filters, they probably contain invalid arguments or syntax."

// After
"message": "The select field 'coaches' is a relationship, not a column. Use the 'include' parameter to load related data.",
"link": "https://docs.sportmonks.com/football/api/response-codes/filtering-and-complexity-exceptions"
```

**Combining a locale with an include no longer returns an error**

Using `locale` alongside `include` on endpoints such as `/v3/football/players/latest` was incorrectly returning an error. This has been resolved and both parameters now work together as expected.

```
GET /v3/football/players/latest?include=nationality&locale=es
```

**Including a non-existent field now returns a specific error**

Previously, requesting a field that does not exist on an included resource returned a generic error. The response now names the offending field directly.

```
GET /v3/football/fixtures/between/2024-01-01/2026-05-20/14?include=participants:name,short_code,meta
```

```json
// Before
"message": "You made an incorrect request, please check your includes and filters, they probably contain invalid arguments or syntax."

// After
"message": "The field 'meta' does not exist on the included resource.",
"link": "https://docs.sportmonks.com/football/api/response-codes/filtering-and-complexity-exceptions"
```

**Selecting a non-existent field now returns an error**

Previously, passing an unknown field name to `select` returned a normal response silently ignoring the field. It now returns an explicit error.

```
GET /v3/football/fixtures/19172201?select=detailed_state_id
```

```json
// Before
{....normal response....}

// After
"message": "The select field 'detailed_state_id' does not exist on this resource.",
"link": "https://docs.sportmonks.com/football/api/response-codes/filtering-and-complexity-exceptions"
```

### 2026-04-22

A new fixture lineup statistic type is available: `CUMULATIVE_MINUTES_PLAYED`. This is a statistic similar to `MINUTES_PLAYED`, however, there are a few key differences:

* Cumulative minutes played always include the period added/injury time
* Cumulative minutes played always include the time played in extra time periods
* Cumulative minutes played have an improved live update speed over the regular minutes played

### 2026-03-26

For API performance reasons, we have removed the `odds` and `premiumOdds` includes from our [Livescores endpoints](/v3/endpoints-and-entities/endpoints/livescores). These includes made the Livescores endpoints large and slow, and caused timeout issues during peak hours due to the amount of fixtures returned, including their odds. As these includes return pre-match odds specifically, no updates are made to the returned odds after kick-off.

{% hint style="success" %}
Endpoints other than the Livescores endpoints are **not** affected by this change.\
The `inplayOdds` include is also **not** affected by this change.
{% endhint %}

We recommend to use alternative endpoints or includes instead, for example:

* [GET Last Updated Odds](/v3/endpoints-and-entities/endpoints/standard-odds-feed/pre-match-odds/get-last-updated-odds) (Standard Odds)
* [GET Updated Premium Odds Between Time Range](/v3/endpoints-and-entities/endpoints/premium-odds-feed/premium-pre-match-odds/get-updated-premium-odds-between-time-range) (Premium Odds)
* Using same include on [GET Fixture by ID](/v3/endpoints-and-entities/endpoints/fixtures/get-fixture-by-id) or [GET Fixtures by Multiple IDs](/v3/endpoints-and-entities/endpoints/fixtures/get-fixtures-by-multiple-ids)

### 2026-03-09

We’ve launched a new pricing structure for designed to make our platform easier to use, more flexible, and better aligned with how developers actually build sports applications.

This update is based on extensive feedback from customer interviews and conversations with our community. The goal is simple: give you more control over what you pay for while keeping access to our full data platform straightforward.

Below is an overview of what has changed.

#### The new setup

We now offer four core plans:

<table><thead><tr><th width="187">Plan</th><th>Leagues</th><th>API Calls</th><th>Price</th></tr></thead><tbody><tr><td>Starter</td><td>5 leagues</td><td>2,000/hour</td><td>€29/month</td></tr><tr><td>Growth</td><td>30 leagues</td><td>2,500/hour</td><td>€99/month</td></tr><tr><td>Pro</td><td>120 leagues</td><td>3,000/hour</td><td>€249/month</td></tr><tr><td>Enterprise</td><td>All leagues</td><td>5,000/hour</td><td>Custom</td></tr></tbody></table>

The key difference between plans is **scale**, not feature access. Plans determine:

* The number of leagues you can include
* Your API call capacity
* Support level and flexibility

All plans come with a **14-day free trial**, and yearly billing includes a **20% discount**. For more information please refer to our [blog](https://www.sportmonks.com/blogs/introducing-our-new-pricing-setup/).&#x20;

### 2026-01-28

We’ve added support for [**Knockout Tournament Brackets**](/v3/endpoints-and-entities/endpoints/seasons/get-brackets-by-season-id).\
This new feature allows competitions such as cups and playoff stages to be represented as a true bracket structure, where matches are linked to each other based on progression (for example: *Winner of Match A vs Winner of Match B*).\
With this update:

* Knockout stages (Round of 16, Quarter-finals, Semi-finals, Final, Third-place playoff) can be followed end-to-end
* For each match, you can determine on what earlier matches it depends on, and whether the winner or loser progresses
* Brackets can be visualised clearly in front-end applications
* Placeholder fixtures automatically resolve as results become available

This makes it easier to build accurate bracket views, follow tournament progression, and react to results in real time.&#x20;

{% hint style="info" %}
Note that this functionality is only available for eligible leagues. It is not available for every domestic or international cup at this moment.
{% endhint %}

{% code expandable="true" %}

```javascript
{
  "data": {
    "stages": [
      {
        "stage_id": 77479086,
        "stage_name": "16th Finals",
        "fixtures": [
          {
            "id": 19606960,
            "sport_id": 1,
            "league_id": 732,
            "season_id": 26618,
            "stage_id": 77479086,
            "group_id": null,
            "aggregate_id": null,
            "round_id": null,
            "state_id": 1,
            "venue_id": 343444,
            "name": "2nd position Group A vs 2nd position Group B",
            "starting_at": "2026-06-28 19:00:00",
            "result_info": null,
            "leg": "1/1",
            "details": "Match 73",
            "length": 90,
            "placeholder": true,
            "has_odds": false,
            "has_premium_odds": false,
            "starting_at_timestamp": 1782673200
          },
          // More fixtures...
        ]
      },
      // More knockout stages...
    ],
    "edges": [
      {
        "id": 13,
        "season_id": 26618,
        "child_fixture_id": 19606961,
        "child_slot": "home",
        "parent_fixture_id": 19606950,
        "parent_outcome": "winner"
      },
      {
        "id": 14,
        "season_id": 26618,
        "child_fixture_id": 19606961,
        "child_slot": "away",
        "parent_fixture_id": 19606947,
        "parent_outcome": "winner"
      },
      // More edges...
```

{% endcode %}

### 2025-11-19

We've introduced a new metadata type, *Pressure Status*, to the Fixture entity. This metadata provides an indicator named *computable* to indicate if the Pressure Index could accurately be computed.

If there are too few statistics available in the trends to generate an accurate Pressure Index, the value of *computable* will be *false*, and there will be no Pressure Index available for that fixture.

```json
// https://api.sportmonks.com/v3/football/fixtures/<fixture_id>?include=metadata.type

"metadata": [
    // ...
    {
        "id": 8754935,
        "metadatable_id": 19600130,
        "type_id": 97352,
        "value_type": "object",
        "values": {
            "computable": true
        },
        "type": {
            "id": 97352,
            "name": "Pressure Status",
            "code": "pressure-status",
            "developer_name": "PRESSURE_STATUS",
            "model_type": "metadata",
            "stat_group": null
        }
    }
]
```

### 2025-11-10

We've made a change that adds the `player_id` and `type_id` fields, as well as `sidelined.player` and `sidelined.type` includes to the fixture `sidelined` include.

This change makes it possible for per-fixture injury data to appear and to improve the base coverage, as the data `sidelined.sideline` represents a more detailed injury dataset.

For example, if the start and end dates of the injury are not available (which is visible in the sidelined.sideline include), the available sidelined data will be shown directly under the `sidelined` include, and the `sidelined.sideline` include will not show data for that item.

<pre class="language-json"><code class="lang-json">{
    "data": {
    "id": 12345678,
    "name": "Team A Name vs Team B Name",
    "starting_at": "2025-11-10 12:00:00",
    "sidelined": [ // sidelined include
        {
            "id": 123456,
            "fixture_id": 12345678,
<strong>            "sideline_id": null, // will be null for this item
</strong>            "participant_id": 12345,
<strong>            "player_id": 67890, // new field
</strong><strong>            "type_id": 339, // new field
</strong><strong>            "sideline": null, // sidelined.sideline include: not available for this item
</strong>            "participant": {
                "id": 12345,
                "name": "Team A Name",
                // ...
            },
<strong>            "player": { // new player include
</strong><strong>                "id": 67890,
</strong><strong>                "common_name": "F. Lastname",
</strong><strong>                "firstname": "Firstname",
</strong><strong>                // ...
</strong><strong>            },
</strong><strong>            "type": { // new type include
</strong><strong>                "id": 339,
</strong><strong>                "name": "Groin Injury",
</strong><strong>                "code": "groin-injury",
</strong><strong>                "developer_name": "GROIN_INJURY",
</strong><strong>                "model_type": "injury_suspension",
</strong><strong>                "stat_group": null
</strong><strong>            }
</strong>        }
        // ...
    ],
</code></pre>

### 2025-08-19

We’ve expanded match facts to include more granular statistics and standardised naming across categories. Since we are still in the beta phase, this change only applies to the upcoming matches. \
Category `h2h`

* **Added:** `MATCH_FACT_LAST_5_{STAT}`, `MATCH_FACT_LAST_10_{STAT}`, `MATCH_FACT_LAST_15_{STAT}`, `MATCH_FACT_LAST_25_{STAT}`
* **Unchanged:** existing `MATCH_FACT_{STAT}` types (which still refer to *all* historical H2H matches between the teams)

Category `overall`

* **Previously:** facts for the last 10 matches were supplied as `MATCH_FACT_{STAT}` (e.g. `MATCH_FACT_GOALS`)
* **Now:** supplied as `MATCH_FACT_LAST_10_{STAT}` (e.g. `MATCH_FACT_LAST_10_GOALS`)

{% hint style="danger" %}
Breaking change: the old `MATCH_FACT_{STAT}` is no longer supported in the `overall` category
{% endhint %}

**Affected stats**\
The following `{STAT}` values are affected in both categories:

* `WIN`
* `DRAW`
* `LOSS`
* `CLEANSHEET`
* `GOALS`
* `GOALS_CONCEDED`
* `CORNERS`
* `REDCARDS`
* `YELLOWCARDS`
* `YELLOWRED_CARDS`
* `SHOTS_TOTAL`
* `SHOTS_ON_TARGET`
* `FIRST_TO_SCORE`
* `GOAL_LINE`
* `BTTS`
* `WINNING_MARGIN`
* `CARDS_COUNT`
* `GOAL_TIMINGS`
* `CARDS_COUNT_IN_MATCH`

### 2025-06-30

We've introduced a new field, *rescinded*, to the [Event](/v3/definitions/types/events) entity. This field provides a boolean indicator for card events: *true* if the referee has rescinded the card or *false* if the card still counts. For other events (or historical card events where this information is not available yet), the field will be *null*.

```json
{
    "id": 149899270,
    "fixture_id": 19134999,
    "period_id": 6007175,
    "participant_id": 52,
    "type_id": 20,
    "section": "event",
    "player_id": 11298616,
    "related_player_id": null,
    "player_name": "Evanilson",
    "related_player_name": null,
    "result": null,
    "info": "Foul",
    "addition": "1st Redcard",
    "minute": 70,
    "extra_minute": null,
    "injured": null,
    "on_bench": false,
    "coach_id": null,
    "sub_type_id": null,
    "detailed_period_id": 6007175,
    "rescinded": true, <- Rescinded card
    "sort_order": 1
}
```

### 2025-03-10

Two new filters have been added to the API for enhanced flexibility and customization:&#x20;

* **HavingPremiumOdds** filter\
  Allows users to filter out any fixtures not having premium odds available. Similar to the *havingOdds* filter for out default odds field. The filter can be applied on fixture entities.

```
api.sportmonks.com/v3/football/fixtures/date/2025-03-10?filters=havingPremiumOdds&api_token=TOKEN
```

* **Gender** filter\
  Enables users to filter **teams** or **players** based on a specific gender (`male`, `female`, or `null`). If a player's gender is (yet) unknown, it is assigned a default value of `null`.

```
api.sportmonks.com/v3/football/teams?filters=genders:female&api_token=TOKEN
```

### 2025-01-22

With the release of our new data-processing logic, we’ve introduced new types to better distinguish between extra time periods and their individual halves.

Previously, there was only a single period type for extra time: ET (type\_id: 3). Now, extra time has been separated into two distinct types:

* **ET\_1ST\_HALF** (type\_id: 5314)
* **ET\_2ND\_HALF** (type\_id: 39).

To take advantage of these improvements, a new API include called **`detailedPeriods`** has been added. This include provides detailed information about periods, including the separation of extra time into its two halves.

In addition, **events** now include a `detailed_period_id`, which points to the corresponding `detailedPeriod`.

We strongly encourage all users to adopt this new structure to ensure greater consistency and accuracy in your applications.\
\
In the near future, we will make every effort to back populate historical fixtures with these detailed periods, to provide a more seamless experience with periods.

{% tabs %}
{% tab title="DetailedPeriods" %}

```json
"detailedperiods": [
    {
        "id": 5811911,
        "fixture_id": 19353646,
        "type_id": 1,
        "started": 1736884878,
        "ended": 1736887852,
        "counts_from": 0,
        "ticking": false,
        "sort_order": 1,
        "description": "1st-half",
        "time_added": 2,
        "period_length": 45,
        "minutes": 49,
        "seconds": 34,
        "has_timer": false
    },
    {
        "id": 5812022,
        "fixture_id": 19353646,
        "type_id": 2,
        "started": 1736888773,
        "ended": 1736891833,
        "counts_from": 45,
        "ticking": false,
        "sort_order": 2,
        "description": "2nd-half",
        "time_added": 6,
        "period_length": 45,
        "minutes": 96,
        "seconds": 0,
        "has_timer": false
    },
    {
        "id": 5813446,
        "fixture_id": 19353646,
        "type_id": 39,
        "started": 1736893340,
        "ended": 1736894412,
        "counts_from": 105,
        "ticking": false,
        "sort_order": 4,
        "description": "extra-time-2nd-half",
        "time_added": 1,
        "period_length": 15,
        "minutes": 122,
        "seconds": 52,
        "has_timer": false
    },
    {
        "id": 5813445,
        "fixture_id": 19353646,
        "type_id": 5314,
        "started": 1736888773,
        "ended": 1736889673,
        "counts_from": 90,
        "ticking": false,
        "sort_order": 3,
        "description": "extra-time-1st-half",
        "time_added": null,
        "period_length": 15,
        "minutes": 105,
        "seconds": 0,
        "has_timer": false
    }
],
```

{% endtab %}

{% tab title="Periods (legacy)" %}

```json
"periods": [
    {
        "id": 5811911,
        "fixture_id": 19353646,
        "type_id": 1,
        "started": 1736884878,
        "ended": 1736887852,
        "counts_from": 0,
        "ticking": false,
        "sort_order": 1,
        "description": "1st-half",
        "time_added": 2,
        "period_length": 45,
        "minutes": 49,
        "seconds": 34,
        "has_timer": false
    },
    {
        "id": 5812022,
        "fixture_id": 19353646,
        "type_id": 2,
        "started": 1736888773,
        "ended": 1736891833,
        "counts_from": 45,
        "ticking": false,
        "sort_order": 2,
        "description": "2nd-half",
        "time_added": 6,
        "period_length": 45,
        "minutes": 96,
        "seconds": 0,
        "has_timer": false
    },
    {
        "id": 5813447,
        "fixture_id": 19353646,
        "type_id": 3,
        "started": 1736893340,
        "ended": 1736894412,
        "counts_from": 105,
        "ticking": false,
        "sort_order": 4,
        "description": "extra-time",
        "time_added": 1,
        "period_length": 15,
        "minutes": 122,
        "seconds": 52,
        "has_timer": false
    }
]
```

{% endtab %}

{% tab title="Updated Event Object" %}

```json
{
    "id": 148734119,
    "fixture_id": 19353646,
    "period_id": 5813447, <- Legacy field, refers to legacy period
    "participant_id": 1652,
    "type_id": 16,
    "section": "event",
    "player_id": 37583848,
    "related_player_id": null,
    "player_name": "Richie Omorowa",
    "related_player_name": null,
    "result": "5-4",
    "info": "Penalty",
    "addition": "9th Penalty",
    "minute": 117,
    "extra_minute": null,
    "injured": null,
    "on_bench": false,
    "coach_id": null,
    "sub_type_id": 16,
    "detailed_period_id": 5813446, <- Added field, refers to detailedPeriod
    "sort_order": 9
}
```

{% endtab %}
{% endtabs %}

### 2024-11-04

We've introduced a new metadata type, *Prediction Status*, to the Fixture entity. This metadata provides an indicator named *predictable* to indicate if the prediction model could accurately make fixture predictions.

If the model can't make accurate fixture predictions, the value of *predictable* will be *false*, and there will be no predictions available for that fixture.

```json
// https://api.sportmonks.com/v3/football/fixtures/19134873?include=metadata.type

"metadata": [
    // ...
    {
        "id": 6882438,
        "metadatable_id": 19134873,
        "type_id": 37072,
        "value_type": "object",
        "values": {
            "predictable": true
        },
        "type": {
            "id": 37072,
            "name": "Prediction Status",
            "code": "prediction-status",
            "developer_name": "PREDICTION_STATUS",
            "model_type": "metadata",
            "stat_group": null
        }
    }
]
```

### 2024-09-30

A new include call ***rankings*** has been added to the API. You may use this include on a Team to get information about the coefficient rankings for the desired team. We continue to expand our coverage regarding these rankings.&#x20;

<pre class="language-json"><code class="lang-json"><strong>// https://api.sportmonks.com/v3/football/teams/8?include=rankings
</strong>
<strong>"rankings": [
</strong>    {
        "id": 10,
        "position": 4,
        "participant_id": 8,
        "points": 98000,
        "sport_id": 1,
        "type": "UEFA"
    }
]
</code></pre>

### 2024-09-10

We've introduced a new field, *sort\_order*, to the [Event](/v3/definitions/types/events) entity. This field provides a numerical ranking system to determine the chronological order of events within a specific type.&#x20;

{% tabs %}
{% tab title="Updated response" %}

```json
{
  id: 120221102,
  fixture_id: 19296203,
  period_id: 5606524,
  participant_id: 8,
  type_id: 14,
  section: "event",
  player_id: 1743,
  related_player_id: 84627,
  player_name: "Virgil van Dijk",
  related_player_name: "Konstantinos Tsimikas",
  result: "1-2",
  info: "Header",
  addition: "3rd Goal",
  minute: 41,
  extra_minute: null,
  injured: null,
  on_bench: false,
  coach_id: null,
  sub_type_id: null
  sort_order: 3 <- Assigned per type_id
},
```

{% endtab %}

{% tab title="Previous response" %}

```json
{
  id: 120221102,
  fixture_id: 19296203,
  period_id: 5606524,
  participant_id: 8,
  type_id: 14,
  section: "event",
  player_id: 1743,
  related_player_id: 84627,
  player_name: "Virgil van Dijk",
  related_player_name: "Konstantinos Tsimikas",
  result: "1-2",
  info: "Header",
  addition: "3rd Goal",
  minute: 41,
  extra_minute: null,
  injured: null,
  on_bench: false,
  coach_id: null,
  sub_type_id: null
},
```

{% endtab %}
{% endtabs %}

By assigning a unique sort order to each event within a type, users can more easily organize and display events in a sequential manner based on their occurrence. This feature allows for a more intuitive and efficient way to identify, browse and filter events.

### 2024-08-11

We're excited to announce new enhancements to our xG statistics, now available at the season level!

For both [players](/v3/tutorials-and-guides/tutorials/statistics/players-statistics) and [teams](/v3/tutorials-and-guides/tutorials/statistics/team-statistics), you can now track their xG Over/Under performance throughout the entire season. This feature reveals how teams and players are actually performing compared to their expected goals (xG) :bar\_chart:

Additionally, we've introduced the Expected Points table to our [standings details](/v3/tutorials-and-guides/tutorials/standings/season-standings). This new feature lets you compare a team's overall performance against their expected points, offering deeper insights into their season  :eyes:\
\
These new features are available for all of our customers having an xG standard or advanced package in their subscription :fire::soccer:

### 2024-05-12

We're excited to announce the launch of Expected Goals (xG) metrics in the Sportmonks API! With the addition of xG data, users can now access valuable insights into goal-scoring probabilities, enhancing their football analysis and decision-making processes.

**What's New?**

* [**xG Types**](/v3/definitions/types/expected#expected-types): Explore detailed Expected Goals (xG) metrics, including Expected Goals (xG) and Expected Goals on Target (xGoT), for teams and players participating in football matches.
* [**New Endpoints**](/v3/endpoints-and-entities/endpoints/expected-xg): Discover new endpoints, such as `v3/football/expected/fixtures` and `v3/football/expected/lineups`, specifically designed to retrieve xG data per team or player lineup.

### 2024-04-05

* Added new [statistics types](/v3/definitions/types/statistics) for teams on seasonal level: Card Per Foul, Shot On Target Percentage, Shot Conversion Rate, Penalty Conversion Rate, Most Injured Players, Most Substituted Players, Appearing Players, Average Points Per Game, Players Footing, Amount Of Foreigners, Average Player Age, and Average Player Height.

### 2024-03-21

* Periods now show the elapsed *minute* and *seconds* even though a period is no longer *ticking*.&#x20;

### 2024-02-26

* Introducing the ability to perform custom sorting on Sportmonks API3 endpoints! With this enhancement, users can now include the `sortBy` parameter to sort base entities in ascending or descending order. The feature supports sorting on fields like `starting_at` and `name` for fixtures, providing users with greater flexibility in organising and retrieving data.

  You can find more information on the dedicated [sorting](/v3/api/request-options/ordering-and-sorting#custom-sorting) page.&#x20;

### 2023-11-27

* An endpoint to retrieve [extended squad details](/v3/endpoints-and-entities/endpoints/team-squads/get-extended-team-squad-by-team-id) has been added. This endpoint shows all players  that were active in the current seasons for the team. If a player is no longer part of the squad or is currently a youth team player, the *in\_squad* field is marked false.
* Periods now contain a *has\_timer* attribute. It marks whether we have detailed timer information for *minutes* and *seconds* attributes available.&#x20;
* Minor updates and optimisations to our back-end infrastructure.&#x20;

### 2023-11-13

* Historical records and value changes are now available for the Premium Odds Feed. They are available via the *history* include (updates since 5 minutes ago) on PremiumOdd records, or via the respective [All](/v3/endpoints-and-entities/endpoints/premium-odds-feed/premium-pre-match-odds/get-all-historical-odds) and [Updated](/v3/endpoints-and-entities/endpoints/premium-odds-feed/premium-pre-match-odds/get-updated-historical-odds-between-time-range) endpoints (all updates).&#x20;
* An endpoint that lists all the [supported timezones](/v3/core-api/endpoints/timezones/get-all-supported-time-zones) has been added.
* Passing your preferred time zone now also has direct effect on the query results on the [League By Date](/v3/endpoints-and-entities/endpoints/leagues/get-leagues-by-fixture-date) endpoint.

### 2023-10-30

* Due to a deviation in the aggregation of API3 request logs, we have cleared the tables records and added a fix for the behaviour. The [API usage](/v3/core-api/my-sportmonks/get-my-usage) endpoint now returns the correct results again.

### 2023-09-21

* A new event type has been implemented which tracks VAR checks related to cards. From today onwards all VAR events that are related to cards are covered under the VAR\_CARD event type.

<details>

<summary>Example</summary>

```javascript
      {
        "id": 90673921,
        "fixture_id": 18867346,
        "period_id": 4993000,
        "participant_id": 7790,
        "type_id": 1697,
        "section": "event",
        "player_id": 435939,
        "related_player_id": null,
        "player_name": "Federico Baschirotto",
        "related_player_name": null,
        "result": null,
        "info": null,
        "addition": "Redcard confirmed",
        "minute": 56,
        "extra_minute": null,
        "injured": null,
        "on_bench": false,
        "coach_id": null,
        "sub_type_id": null,
        "type": {
          "id": 1697,
          "name": "VAR_CARD",
          "code": "VAR_CARD",
          "developer_name": "VAR_CARD",
          "model_type": "event",
          "stat_group": null
        }
      },
```

</details>

### 2023-09-13

* An endpoint for insights into your [API usage](/v3/core-api/my-sportmonks/get-my-usage) has been added. This endpoint will return your usage aggregated per endpoint per 5 minutes. \
  \
  You may for example use this endpoint to build your own monitoring dashboards, or to gain insights into how you can optimize your traffic to our API by spreading your usage. 📊💻

### 2023-09-06

* Both Referee and Coach entities now offer the possibility to add the *latest* include. The include providers their latest fixtures records from the past 6 months.

### 2023-09-04

* When available, a *code* field has been added to the API error response, these errors include a link to our documentation pages where the errors are explained more briefly. The *code* corresponds to one of the entries in the listed table.      &#x20;

<div align="center"><figure><img src="/files/ZUqAFqJ2rH054YJKYIkZ" alt="" width="563"><figcaption><p>Errors now contain a <em>code</em> attribute when available.</p></figcaption></figure></div>

* When using the *statistics* include on a Season, using the nested Type include caused the original *type* field for the object to be overridden. To prevent this behaviour from happening, the relational Type object will now be available under the *statistic\_type* attribute. <br>

  <figure><img src="/files/rIq4AzRMSaCefoBf9sNT" alt=""><figcaption><p>Type object now available under <em>statistic_type</em> attribute.</p></figcaption></figure>

### 2023-08-15

* TV station BT Sport has been renamed to TNT Sports due to rebranding. (affecting ID 46 and 860). TNT Sports 2, 3, 4 are newly added under ID 928, 929, 930.

### 2023-07-18

* Filtering on id's on "All Endpoints" has now been added. You can use it to only request the entities of which the id is one of the given values. You need pass the name of the desired entity to apply the filters on. See the examples below for reference:\
  <https://api.sportmonks.com/v3/football/players?api_token=TOKEN&filters=playerIds:1,2,3,4,5>\
  <https://api.sportmonks.com/v3/football/leagues?api_token=TOKEN&filters=leagueIds:2,5,8><br>
* We have added the possibility to filter on active seasons when requesting statistics. You can pass the *currentSeasons* filter to leverage this functionality, make sure to pass the desired Entity to apply the filter on as well, check the example below for reference, this will only return. you statistics for current / active seasons that belong to players in the response:\
  <https://api.sportmonks.com/v3/football/players?api_token=TOKEN&include=statistics&filters=currentSeasons:playerStatistic><br>
* An *is\_captain* indicator has been added for Squads. Showing *true* if the player is currently the default captain for the regarding squad.
* Using filters that allow you to pass id's, now support a maximum of 50 records. This reflects the maximums (*per\_page)* we allow on default paginated endpoints.&#x20;

### 2023-06-08

* Endpoints for retrieving [statistics](/v3/endpoints-and-entities/endpoints/statistics) have been added. These allow you to easily retrieve statistics for specific seasons, stages, or rounds, instead of having to propagate through includes to retrieve them.
* A new include called '*currentPeriod'* has been added. It allows for retrieval of the inplay period in a more convenient way compared to using the *periods* include. Please note the include may return *NULL.* For example when the match has not yet started, is in half-time, or has ended.
* The PlayerStatistic entity now contains a *has\_values* field, indicating whether a Player has any statistics available for the given season.
* We have renamed the BEATS type to SUCCESSFUL\_DRIBBLES to better reflect the type of statistic.

{% embed url="<https://youtu.be/3QPqu_bj7ag>" %}
A tutorial which covers all the new features added with this release
{% endembed %}

### 2023-05-31

* Two new endpoints have been added, one for retrieving [upcoming Fixtures by tv-station id](/v3/endpoints-and-entities/endpoints/fixtures/get-upcoming-fixtures-by-tv-station-id), and one for retrieving [past Fixtures by tv-station id](/v3/endpoints-and-entities/endpoints/fixtures/get-past-fixtures-by-tv-station-id). If you have tv-stations available in your subscription, you automatically have access to these endpoints.

### 2023-05-30

* We have added the *currentPeriod* include. You can use this as a more convenient way to get the current inplay period for a fixture. Note that the result can be *null,* for example when the fixture itself is not inplay or the fixture is currently in half-time break.

### 2023-05-17

* The [Multiple Fixtures by Id](/v3/endpoints-and-entities/endpoints/fixtures/get-fixtures-by-multiple-ids) endpoint now allows a maximum of 50 unique id's, this reflects the maximums (*per\_page)* we allow on default paginated endpoints.&#x20;

### 2023-04-28

* The developer name of Type "Screwsnails Removal" (id: 830) has been renamed to SCREWS\_NAILS\_REMOVAL for naming convention.

### 2023-04-18

As per an earlier announcement, we have released some changes to the API on this date.

#### Removed fields:

* **State**: *is\_live, is\_pending, is\_period\_end, is\_final\_state, is\_cancelled, is\_final\_standing\_state, is\_completed, type\_id, is\_deleted, is\_notstarted, period\_length\_setting, deactivate\_inplay*
* **Period*****:** period\_length\_internal, final\_minute, home\_score, away\_score*
* **Fixture:** *last\_processed\_at*

#### Renamed fields:

* **Squad:** *yersey\_number was* renamed to *jersey\_number*

**Added fields:**

* **League:** *category (*&#x62;asic tier like indicator for the size / popularity of the league. Ranges from 1-4, where 1 are the most 'popular' leagues.

**Ordering on endpoints:**

* Paginated endpoints now support [ordering](/v3/api/request-options/ordering-and-sorting), you can pass a query parameter *order* with your request to indicate the desired order. Currently *order=desc* and *order=asc* are supported. Visit the documentation of the endpoint you are wishing to use ordering on to obtain the field that the ordering applies on.

```url
https://api.sportmonks.com/v3/football/fixtures?api_token=YOUR_TOKEN&page=2&order=desc
```

**Threshold adjustments:**

* The threshold of the [Latest Updated Fixtures ](/v3/endpoints-and-entities/endpoints/fixtures/get-latest-updated-fixtures)endpoint was lowered from 5 minutes, to 10 seconds. The previous threshold of 5 minutes fetched too much results at times, causing requests to time out.&#x20;