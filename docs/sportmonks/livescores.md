---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.849Z
---
# Livescores

You can obtain all the fixtures that are currently in-play via our livescores endpoints.

Responses of the livescore endpoint are highly customizable because many includes are available to extend the response. You can find a list of available includes below, listed per endpoint option.&#x20;

The three options to retrieve livescores are:

* **GET All Inplay Livescores:** returns all the inplay fixtures.
* **GET All Livescores:** returns the fixtures 15 minutes before the game starts. It will also disappear 15 minutes after the game is finished.
* **GET Latest Updated Livescores:** returns all livescores that have received updates within 10 seconds.

<figure><img src="/files/P744WsXKE2sEXA3g63Zf" alt=""><figcaption></figcaption></figure>

#### Include options

[`sport`](https://docs.sportmonks.com/v3/core-api/) [`round`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#round) [`stage`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#stage) [`group`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#group) [`aggregate`](/v3/endpoints-and-entities/entities/fixture#aggregate) [`league`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#league) [`season`](/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round#season)[`coaches`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#coach) [`tvStations`](/v3/endpoints-and-entities/entities/other#tvstation) [`venue`](/v3/endpoints-and-entities/entities/other#venue) [`state`](/v3/endpoints-and-entities/entities/other#state)  [`weatherReport`](/v3/endpoints-and-entities/entities/other#weatherreport) [`lineups`](/v3/endpoints-and-entities/entities/fixture#lineup) [`events`](/v3/endpoints-and-entities/entities/fixture#event) [`timeline`](/v3/endpoints-and-entities/entities/fixture#event) [`comments`](/v3/endpoints-and-entities/entities/other#commentary) [`trends`](/v3/endpoints-and-entities/entities/statistic#trend) [`statistics`](/v3/endpoints-and-entities/entities/statistic#fixturestatistic) [`periods`](/v3/endpoints-and-entities/entities/fixture#period) [`participants`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#team) [`inplayOdds`](/v3/endpoints-and-entities/entities/odd-and-prediction#inplayodd) [`prematchNews`](/v3/endpoints-and-entities/entities/other#news)  [`postmatchNews`](/v3/endpoints-and-entities/entities/other#news) [`metadata`](/v3/endpoints-and-entities/entities/other#metadata) [`sidelined`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#sidelined)[`predictions`](/v3/endpoints-and-entities/entities/odd-and-prediction#prediction-valuebet) [`referees`](/v3/endpoints-and-entities/entities/team-player-squad-coach-and-referee#referees) [`formations`](/v3/endpoints-and-entities/entities/fixture#formation) [`ballCoordinates`](/v3/endpoints-and-entities/entities/fixture#ballcoordinate) [`scores`](/v3/endpoints-and-entities/entities/fixture#score)  [`xGFixture`](/v3/endpoints-and-entities/entities/expected) `expectedLineups` `predictedLineups`

#### **Related Entities:**

Get an overview and explanation of all the fields returned in the API response. The related entities for the livescores endpoints are:

* [Fixture](/v3/endpoints-and-entities/entities/fixture#fixture)