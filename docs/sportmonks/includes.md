---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.847Z
---
# Includes

The `includes` parameter in the Sportmonks Football API allows you to enrich your API responses by including related resources in a single request. By using includes, you can avoid making multiple API calls to gather related data, making your integrations more efficient and performant.

### Overview

When querying an endpoint, you can include additional related data by specifying the `include` parameter in your request. This allows you to receive related entities, such as team details, player statistics, and more, all within the same response. The available includes depend on the specific endpoint you're accessing.

<table><thead><tr><th width="147">Parameter</th><th width="113">Required</th><th>Description</th></tr></thead><tbody><tr><td><code>include</code></td><td>No</td><td>Enrich the API response with more data by using includes.</td></tr></tbody></table>

### Example

Let's say you want to retrieve fixture alongside with the associated teams for that fixture. You can do this by adding the `include` parameter to your request:

{% tabs %}
{% tab title="Request" %}

```
https://api.sportmonks.com/v3/football/fixtures/{ID}&include=participants
```

{% endtab %}

{% tab title="Response" %}

```
{
    "data": {
        "id": 19032598,
        "sport_id": 1,
        "league_id": 1326,
        "season_id": 22842,
        "stage_id": 77468270,
        "group_id": null,
        "aggregate_id": null,
        "round_id": null,
        "state_id": 5,
        "venue_id": 1944,
        "name": "Spain vs England",
        "starting_at": "2024-07-14 19:00:00",
        "result_info": "Spain won after full-time.",
        "leg": "1/1",
        "details": "Match 51",
        "length": 90,
        "placeholder": false,
        "has_odds": true,
        "has_premium_odds": true,
        "starting_at_timestamp": 1720983600,
        "participants": [
            {
                "id": 18645,
                "sport_id": 1,
                "country_id": 462,
                "venue_id": 1315,
                "gender": "male",
                "name": "England",
                "short_code": "ENG",
                "image_path": "https://cdn.sportmonks.com/images/soccer/teams/21/18645.png",
                "founded": 1863,
                "type": "national",
                "placeholder": false,
                "last_played_at": "2024-07-14 19:00:00",
                "meta": {
                    "location": "away",
                    "winner": false,
                    "position": 2
                }
            },
            {
                "id": 18710,
                "sport_id": 1,
                "country_id": 32,
                "venue_id": 2020,
                "gender": "male",
                "name": "Spain",
                "short_code": "ESP",
                "image_path": "https://cdn.sportmonks.com/images/soccer/teams/22/18710.png",
                "founded": 1913,
                "type": "national",
                "placeholder": false,
                "last_played_at": "2024-07-14 19:00:00",
                "meta": {
                    "location": "home",
                    "winner": true,
                    "position": 1
                }
            }
        ]
    },
```

{% endtab %}
{% endtabs %}

### Nested Includes

Some includes allow you to drill down even further into related data by using nested includes.You can read more on that on this page:

{% content-ref url="/pages/2m6obvxTccNxE5VC0zWS" %}
[Nested includes](/v3/api/request-options/includes/nested-includes)
{% endcontent-ref %}