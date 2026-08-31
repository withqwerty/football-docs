---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.845Z
---
# New endpoints and data features

Thanks to our new back-end structure, we can offer more data features and new endpoints. (i.e. ball coordinates, referee and coach statistics)

### New Endpoints

* [Transfer endpoints](/v3/endpoints-and-entities/endpoints/transfers)
  * [All Transfers](/v3/endpoints-and-entities/endpoints/transfers/get-all-transfers)
  * [Latest Transfers](/v3/endpoints-and-entities/endpoints/transfers/get-latest-transfers)
  * [Transfer By ID](/v3/endpoints-and-entities/endpoints/transfers/get-transfer-by-id)
  * [Transfers By Team ID](/v3/endpoints-and-entities/endpoints/transfers/get-transfers-by-team-id)
  * [Transfers By Player ID](/v3/endpoints-and-entities/endpoints/transfers/get-transfers-by-player-id)
* [Referees endpoints](/v3/endpoints-and-entities/endpoints/referees)
  * [All Referees](/v3/endpoints-and-entities/endpoints/referees/get-all-referees)
  * [Referee By ID](/v3/endpoints-and-entities/endpoints/referees/get-referee-by-id)
  * [Referees By Country ID](/v3/endpoints-and-entities/endpoints/referees/get-referees-by-country-id)
  * [Search Referee By Name](/v3/endpoints-and-entities/endpoints/referees/get-referees-search-by-name)
* [Schedules endpoints](/v3/endpoints-and-entities/endpoints/schedules)
  * [Schedules By Season ID](/v3/endpoints-and-entities/endpoints/schedules/get-schedules-by-season-id)
  * [Schedules By Season and Team ID](/v3/endpoints-and-entities/endpoints/schedules/get-schedules-by-season-id-and-team-id)
* Search endpoints for all entities with a name field
* Extra endpoints for each entity
  * All endpoints for most entities

**Available in core:**

* Base entities;
  * Continents
  * Regions
  * Countries
  * Cities
  * Filters
* Types endpoint
  * All Types
  * Type By ID
* My endpoints (to check your own data features)
  * Data Features endpoint
    * My Data Features
  * Endpoints
    * My Endpoints
  * Leagues
    * My Leagues
* Search endpoints for all entities with a name field
* Extra endpoints for each entity

### League priority

You can now prioritize the leagues you want to view. In [MySportmonks](https://my.sportmonks.com/api/leagues/priority) you can change the priority of all leagues in your subscription. You can simply sort them according to your liking, and the API will show leagues in this specific order when requesting leagues.

### New Data Features

* Offsides events for major leagues&#x20;
* Detailed player positions
* Shots on/off target events for major leagues&#x20;
* Placeholder games available (finals, etc)&#x20;
* Ball coordinates (semi-live)&#x20;
* Forecast weather report&#x20;
* Expanded predictions&#x20;
* Predictive lineups
* Coach statistics&#x20;
* Referee statistics
* Period statistics
* More statistics in general&#x20;
* League priority configuration