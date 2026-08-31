---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.855Z
---
# Seasons

Gather an overview of all the historical and current seasons available within your subscription. Responses provide you details like the Season ID, Name, League ID, Year and if the Season is Active Yes or No.&#x20;

{% hint style="info" %}
Are you interested in a complete schedule? Then maybe our schedule endpoints are what you’re looking for: [Schedule endpoint](/v3/endpoints-and-entities/endpoints/schedules).
{% endhint %}

Use one of our 3 season endpoints. Per endpoint, you can find the details, including base URL, parameters, includes and more.&#x20;

* **GET All Seasons:** returns all the historical and active seasons that are available within your subscription.&#x20;
* **GET Season by ID:** returns the single-season you’ve requested by ID.
* **GET Seasons by Search by Name:** returns all seasons that match your search query.

<figure><img src="/files/lfO0MTVg521145ey9aD4" alt=""><figcaption></figcaption></figure>

### Include options

[`sport`](https://docs.sportmonks.com/v3/core-api/) [`league`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#league) [`teams`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#team) [`stages`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`currentStage`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`fixtures`](/v3/endpoints-and-entities/entities/fixture#fixture) [`groups`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#group) [`statistics`](/v3/endpoints-and-entities/entities/statistic#seasonstatistic) [`topscorers`](/v3/endpoints-and-entities/entities/standing-and-topscorer#topscorers)

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the seasons endpoints are:

* [Season](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season)

{% hint style="info" %}
Remember, our historical data will be integrated into the new version of our API gradually. So, the historical data is not yet complete. However, we will be loading more historical data continuously.
{% endhint %}