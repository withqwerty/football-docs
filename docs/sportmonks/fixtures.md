---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.850Z
---
# Fixtures

There are multiple options to retrieve the fixtures within your subscription. The fixtures’ endpoints are divided into 10 categories. Per endpoint, you can find the details, including base URL, parameters, include options and more.&#x20;

* **GET All Fixtures:** returns all the fixtures accessible within your subscription.
* **GET Fixture by ID:** returns the single fixture you’ve requested by ID.
* **GET Fixtures by Multiple IDs:** returns the fixtures you’ve requested by IDs.
* **GET Fixture by Date Range:** returns the fixtures you’ve requested by date range.&#x20;
* **GET Fixture by Date:** returns the fixtures you’ve requested by a single date.
* **GET Fixture by Date Range for Team:** returns the fixtures you’ve requested by date range for a specific team.&#x20;
* **GET Fixture by Head To Head:** returns the head to head fixtures of two teams you’ve requested.&#x20;
* **GET Fixture by Search by Name:** returns all fixtures that match your search query.
* **GET Upcoming Fixtures by Market ID:** returns upcoming fixtures you've requested by Market ID.
* **GET Fixture by Last Updated Fixtures:** returns you all the games that have received updates within 10 seconds.

<figure><img src="/files/wo8RnqHvsNTP1RfXqq9V" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
**Please note** that you need to use one of our livescores endpoints for in-play fixtures.
{% endhint %}

### Include options

[`sport`](https://docs.sportmonks.com/v3/core-api/) [`round`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#round) [`stage`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`group`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#group) [`aggregate`](/v3/endpoints-and-entities/entities/fixture#aggregate) [`league`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#league) [`season`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season)[`coaches`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#coach) [`tvStations`](/v3/endpoints-and-entities/entities/other#tvstation) [`venue`](/v3/endpoints-and-entities/entities/other#venue) [`state`](/v3/endpoints-and-entities/entities/other#state)  [`weatherReport`](/v3/endpoints-and-entities/entities/other#weatherreport) [`lineups`](/v3/endpoints-and-entities/entities/fixture#lineup) [`events`](/v3/endpoints-and-entities/entities/fixture#event) [`timeline`](/v3/endpoints-and-entities/entities/fixture#event) [`comments`](/v3/endpoints-and-entities/entities/other#commentary) [`trends`](/v3/endpoints-and-entities/entities/statistic#trend) [`statistics`](/v3/endpoints-and-entities/entities/statistic#fixturestatistic) [`periods`](/v3/endpoints-and-entities/entities/fixture#period) [`participants`  ](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#team)[`odds`](/v3/endpoints-and-entities/entities/odd-and-prediction#odd)[`premiumOdds`](https://docs.sportmonks.com/football/endpoints-and-entities/entities/odd-and-prediction#premium-odd) [`inplayOdds`](/v3/endpoints-and-entities/entities/odd-and-prediction#inplayodd) [`prematchNews`](/v3/endpoints-and-entities/entities/other#news) [`postmatchNews`](/v3/endpoints-and-entities/entities/other#news) [`metadata`](/v3/endpoints-and-entities/entities/other#metadata) [`sidelined`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#sidelined)[`predictions`](/v3/endpoints-and-entities/entities/odd-and-prediction#prediction-valuebet) [`referees`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#referees) [`formations`](/v3/endpoints-and-entities/entities/fixture#formation) [`ballCoordinates`](/v3/endpoints-and-entities/entities/fixture#ballcoordinate) [`scores`](/v3/endpoints-and-entities/entities/fixture#score) [`xGFixture`](/v3/endpoints-and-entities/entities/expected) [`pressure`](/v3/tutorials-and-guides/tutorials/includes/pressure-index) `expectedLineups`&#x20;

### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the fixtures endpoints are:

* [Fixture](/v3/endpoints-and-entities/entities/fixture#fixture)