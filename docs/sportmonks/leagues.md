---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.854Z
---
# Leagues

Access comprehensive league data through the Sportmonks Football API. The Leagues endpoints provide information about domestic and international football competitions.

Overview

Every continent has countries, every country has one or multiple leagues, and every league has one or more seasons. For most applications, the leagues endpoint serves as the starting point for accessing football data. Use these endpoints to gather complete overviews of all available leagues within your subscription, retrieve basic league information, or enrich your response with season and fixture data.

### Available Endpoints

There are 6 league endpoints available, each serving specific use cases:

* [**GET All Leagues**](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-all-leagues): Returns all leagues accessible within your subscription
* [**GET League by ID**](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-league-by-id): Returns a single league by its unique identifier
* [**GET Leagues by Live**](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-leagues-by-live): Returns leagues currently with live fixtures
* [**GET Leagues by Fixture Date**](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-leagues-by-fixture-date): Returns leagues with fixtures on a specific date
* [**GET Leagues by Country ID**](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-leagues-by-country-id): Returns all leagues from a specific country
* [**GET Leagues Search by Name**](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/leagues/get-leagues-search-by-name): Returns leagues matching your search query

<figure><img src="/files/MrRwTCH4Jp5tPBZVko8Y" alt=""><figcaption></figcaption></figure>

### Understanding league structures

Football leagues have fundamentally different organisational structures depending on the competition type. Understanding these structures is crucial for correctly requesting and displaying data such as standings, fixtures, and statistics.

#### The hierarchy

Every league follows a hierarchical structure:

```
League
  └── Season (e.g., "2025/2026")
      └── Stage(s) (e.g., "Regular Season", "Group Stage", "Quarter-finals")
          └── Round(s) (e.g., "Round 1", "Round 2", "Matchweek 15")
              └── Group(s) (optional - e.g., "Group A", "Group B")
                  └── Fixtures (individual matches)
```

**Key components:**

* **League**: The competition itself (e.g., Premier League, Champions League)
* **Season**: A specific edition of the league (e.g., 2024/2025, 2023/2024)
* **Stage**: A distinct phase within a season (e.g., "Regular Season", "Playoffs", "Group Stage", "Semi-finals")
* **Round**: A specific matchday or game week within a stage
* **Group**: Optional groupings within stages (used in tournaments with group phases)
* **Fixture**: An individual match between two teams

### League classification by structure

Different leagues are organized in distinct ways. Here's how to identify and work with each structure type:

#### 1. Simple domestic leagues

**Characteristics:**

* Single "Regular Season" stage
* Round-robin format where every team plays every other team twice (home and away)
* Sequential rounds representing match weeks
* One unified standings table

**Stage type:** Group stage (type\_id: 223)

**Examples:** English Premier League, La Liga, Serie A, Bundesliga

**Structure:**

```
League: English Premier League (league_id: 8)
  └── Season: 2025/2026
      └── Stage: "Regular Season" (Group Stage)
          └── Rounds: 1, 2, 3... up to 38
```

**API request example:**

```http
GET /v3/football/leagues/8?api_token=YOUR_TOKEN&include=currentSeason.stages
```

**Response example:**

```json
{
  "data": {
    "id": 8,
    "sport_id": 1,
    "country_id": 462,
    "name": "Premier League",
    "active": true,
    "short_code": "UK PL",
    "image_path": "https:\/\/cdn.sportmonks.com\/images\/soccer\/leagues\/8\/8.png",
    "type": "league",
    "sub_type": "domestic",
    "last_played_at": "2025-11-24 20:00:00",
    "category": 1,
    "has_jerseys": false,
    "currentseason": {
      "id": 25583,
      "sport_id": 1,
      "league_id": 8,
      "tie_breaker_rule_id": 1526,
      "name": "2025\/2026",
      "finished": false,
      "pending": false,
      "is_current": true,
      "starting_at": "2025-08-15",
      "ending_at": "2026-05-24",
      "standings_recalculated_at": "2025-11-24 22:00:53",
      "games_in_current_week": true,
      "stages": [
        {
          "id": 77476879,
          "sport_id": 1,
          "league_id": 8,
          "season_id": 25583,
          "type_id": 223,
          "name": "Regular Season",
          "sort_order": 1,
          "finished": false,
          "is_current": true,
          "starting_at": "2025-08-15",
          "ending_at": "2026-05-24",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        }
      ]
    }
  },
}
```

**Key observations:**

* Only one stage for the entire season (typical for simple domestic leagues)
* The stage type is Group Stage (type\_id: 223), which indicates a round-robin format with standings
* 38 rounds represent the complete double round-robin schedule (20 teams × 2 = 38 matches per team)
* To access the league table, use the standings endpoint with the season\_id: `/v3/football/standings/seasons/25583`

#### 2. Multi-phase domestic leagues

**Characteristics:**

* Multiple sequential stages within a single season
* Each phase may have different structures or participant configurations
* Common in leagues that split into championship and relegation groups

**Stage types:** Multiple Group Stages (type\_id: 223)

**Example:** Liga Profesional de Fútbol (Argentina)

**Structure:**

```
League: Argentine Liga Profesional (league_id: 636)
  └── Season: 2025 (season_id: 24969)
      ├── Stage: "1st Phase" (Group Stage - type_id: 223)
      │   └── Group rounds with all teams
      ├── Stage: "1st Phase - 8th Finals" (Knock Out - type_id: 224)
      ├── Stage: "1st Phase - Quarter-finals" (Knock Out - type_id: 224)
      ├── Stage: "1st Phase - Semi-finals" (Knock Out - type_id: 224)
      ├── Stage: "1st Phase - Final" (Knock Out - type_id: 224)
      ├── Stage: "2nd Phase" (Group Stage - type_id: 223)
      │   └── Group rounds with all teams
      ├── Stage: "2nd Phase - 8th Finals" (Knock Out - type_id: 224)
      ├── Stage: "2nd Phase - Quarter-finals" (Knock Out - type_id: 224)
      ├── Stage: "2nd Phase - Semi-finals" (Knock Out - type_id: 224)
      └── Stage: "2nd Phase - Final" (Knock Out - type_id: 224)
```

**API request example:**

```http
GET /v3/football/leagues/636?api_token=YOUR_TOKEN&include=currentSeason.stages
```

**Response example:**

```json
{
  "data": {
    "id": 636,
    "name": "Liga Profesional de Fútbol",
    "type": "league",
    "sub_type": "domestic",
    "currentSeason": {
      "data": {
        "id": 24969,
        "name": "2025",
        "stages": {
          "data": [
            {
              "id": 77475076,
              "name": "1st Phase",
              "type_id": 223,
              "sort_order": 1,
              "finished": true,
              "is_current": false
            },
            {
              "id": 77475075,
              "name": "1st Phase - 8th Finals",
              "type_id": 224,
              "sort_order": 2,
              "finished": true,
              "is_current": false
            },
            {
              "id": 77475074,
              "name": "1st Phase - Quarter-finals",
              "type_id": 224,
              "sort_order": 3,
              "finished": true,
              "is_current": false
            },
            {
              "id": 77475073,
              "name": "1st Phase - Semi-finals",
              "type_id": 224,
              "sort_order": 4,
              "finished": true,
              "is_current": false
            },
            {
              "id": 77475072,
              "name": "1st Phase - Final",
              "type_id": 224,
              "sort_order": 5,
              "finished": true,
              "is_current": false
            },
            {
              "id": 77475071,
              "name": "2nd Phase",
              "type_id": 223,
              "sort_order": 6,
              "finished": true,
              "is_current": false
            },
            {
              "id": 77475070,
              "name": "2nd Phase - 8th Finals",
              "type_id": 224,
              "sort_order": 7,
              "finished": false,
              "is_current": true
            },
            {
              "id": 77475069,
              "name": "2nd Phase - Quarter-finals",
              "type_id": 224,
              "sort_order": 8,
              "finished": false,
              "is_current": false
            },
            {
              "id": 77475068,
              "name": "2nd Phase - Semi-finals",
              "type_id": 224,
              "sort_order": 9,
              "finished": false,
              "is_current": false
            },
            {
              "id": 77475067,
              "name": "2nd Phase - Final",
              "type_id": 224,
              "sort_order": 10,
              "finished": false,
              "is_current": false
            }
          ]
        }
      }
    }
  }
}
```

**Key observations:**

* Multiple stages exist within one season
* `sort_order` indicates the sequence of stages
* `is_current: true` shows which stage is actively being played
* After the 1st Phase concludes, teams progress to different groups based on their standings

#### 3. International cup tournaments

**Characteristics:**

* Multiple stages with different types (Qualifying, Group Stage, Knockout)
* Groups within the Group Stage
* Progressive elimination format
* Complex structure spanning multiple competition phases

**Stage types:** Qualifying (type\_id: 225), Group Stage (type\_id: 223), Knock Out (type\_id: 224)

**Examples:** UEFA Champions League, FIFA World Cup, Copa Libertadores, UEFA Europa League

**Structure:**

```
League: UEFA Champions League (league_id: 2)
  └── Season: 2025/2026 (season_id: 25580)
      ├── Stage: "Qualification Round 1" (Qualifying - type_id: 225)
      ├── Stage: "Qualification Round 2" (Qualifying - type_id: 225)
      ├── Stage: "Qualification Round 3" (Qualifying - type_id: 225)
      ├── Stage: "Play-offs" (Qualifying - type_id: 225)
      ├── Stage: "League Stage" (Group Stage - type_id: 223)
      │   └── Rounds: 1, 2, 3, 4, 5, 6, 7, 8
      ├── Stage: "Knockout Round Play-offs" (Knock Out - type_id: 224)
      ├── Stage: "8th Finals" (Knock Out - type_id: 224)
      ├── Stage: "Quarter-finals" (Knock Out - type_id: 224)
      ├── Stage: "Semi-finals" (Knock Out - type_id: 224)
      └── Stage: "Final" (Knock Out - type_id: 224)
```

**API request example:**

```http
GET /v3/football/leagues/2?api_token=YOUR_TOKEN&include=currentSeason.stages
```

**Response example:**

```json
{
  "data": {
    "id": 2,
    "sport_id": 1,
    "country_id": 41,
    "name": "Champions League",
    "active": true,
    "short_code": "UEFA CL",
    "image_path": "https:\/\/cdn.sportmonks.com\/images\/soccer\/leagues\/2.png",
    "type": "league",
    "sub_type": "cup_international",
    "last_played_at": "2025-11-25 20:00:00",
    "category": 1,
    "has_jerseys": false,
    "currentseason": {
      "id": 25580,
      "sport_id": 1,
      "league_id": 2,
      "tie_breaker_rule_id": 33094,
      "name": "2025\/2026",
      "finished": false,
      "pending": false,
      "is_current": true,
      "starting_at": "2025-07-08",
      "ending_at": "2026-01-28",
      "standings_recalculated_at": "2025-11-25 22:05:19",
      "games_in_current_week": true,
      "stages": [
        {
          "id": 77477731,
          "sport_id": 1,
          "league_id": 2,
          "season_id": 25580,
          "type_id": 225,
          "name": "Play-offs",
          "sort_order": 4,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-19",
          "ending_at": "2025-08-27",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77478049,
          "sport_id": 1,
          "league_id": 2,
          "season_id": 25580,
          "type_id": 223,
          "name": "League Stage",
          "sort_order": 5,
          "finished": false,
          "is_current": true,
          "starting_at": "2025-09-16",
          "ending_at": "2026-01-28",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77476876,
          "sport_id": 1,
          "league_id": 2,
          "season_id": 25580,
          "type_id": 225,
          "name": "Qualification Round 1",
          "sort_order": 1,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-07-08",
          "ending_at": "2025-07-16",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77476881,
          "sport_id": 1,
          "league_id": 2,
          "season_id": 25580,
          "type_id": 225,
          "name": "Qualification Round 2",
          "sort_order": 2,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-07-22",
          "ending_at": "2025-07-30",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77477369,
          "sport_id": 1,
          "league_id": 2,
          "season_id": 25580,
          "type_id": 225,
          "name": "Qualification Round 3",
          "sort_order": 3,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-05",
          "ending_at": "2025-08-12",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        }
      ]
    }
  }
}
```

***

#### 4. Domestic cup competitions

**Characteristics:**

* Knockout-only format (no league table)
* Progressive rounds of elimination
* Single or two-legged ties

**Stage type:** Knock Out (type\_id: 224)

**Examples:** FA Cup, Copa del Rey, DFB Pokal, Coppa Italia

**Structure:**

```
League: FA Cup (league_id: 24)
  └── Season: 2025/2026 (season_id: 25567)
      ├── Stage: "1st Round Qualifying" (Knock Out - type_id: 224)
      ├── Stage: "2nd Round Qualifying" (Knock Out - type_id: 224)
      ├── Stage: "3rd Round Qualifying" (Knock Out - type_id: 224)
      ├── Stage: "4th Round Qualifying" (Knock Out - type_id: 224)
      ├── Stage: "1st Round" (Knock Out - type_id: 224)
      ├── Stage: "2nd Round" (Knock Out - type_id: 224)
      ├── Stage: "3rd Round" (Knock Out - type_id: 224)
      ├── Stage: "4th Round" (Knock Out - type_id: 224)
      ├── Stage: "5th Round" (Knock Out - type_id: 224)
      ├── Stage: "Quarter-finals" (Knock Out - type_id: 224)
      ├── Stage: "Semi-finals" (Knock Out - type_id: 224)
      └── Stage: "Final" (Knock Out - type_id: 224)
```

```http
GET /v3/football/leagues/24?api_token=YOUR_TOKEN&include=currentSeason.stages
```

**Response example:**

```json
{
 "data": {
    "id": 24,
    "sport_id": 1,
    "country_id": 462,
    "name": "FA Cup",
    "active": true,
    "short_code": "UK FA Cup",
    "image_path": "https:\/\/cdn.sportmonks.com\/images\/soccer\/leagues\/24\/24.png",
    "type": "league",
    "sub_type": "domestic_cup",
    "last_played_at": "2025-11-03 19:30:00",
    "category": 2,
    "has_jerseys": false,
    "currentseason": {
      "id": 25919,
      "sport_id": 1,
      "league_id": 24,
      "tie_breaker_rule_id": 171,
      "name": "2025\/2026",
      "finished": false,
      "pending": false,
      "is_current": true,
      "starting_at": "2025-08-01",
      "ending_at": "2025-09-30",
      "standings_recalculated_at": null,
      "games_in_current_week": true,
      "stages": [
        {
          "id": 77477926,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 225,
          "name": "1st Round Qualifying",
          "sort_order": 5,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-29",
          "ending_at": "2025-09-03",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77477864,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 225,
          "name": "Preliminary Round Replays",
          "sort_order": 4,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-18",
          "ending_at": "2025-08-26",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77478105,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 224,
          "name": "2nd Round Qualifying",
          "sort_order": 6,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-09-12",
          "ending_at": "2025-09-23",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77478660,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 224,
          "name": "Round 1",
          "sort_order": 4,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-10-31",
          "ending_at": "2025-11-03",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77478863,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 224,
          "name": "Round 2",
          "sort_order": 7,
          "finished": false,
          "is_current": false,
          "starting_at": "2025-12-05",
          "ending_at": "2025-12-08",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77478288,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 225,
          "name": "3rd Round Qualifying",
          "sort_order": 7,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-09-27",
          "ending_at": "2025-09-30",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77477212,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 225,
          "name": "Extra Preliminary Round",
          "sort_order": 1,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-01",
          "ending_at": "2025-08-03",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77477213,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 225,
          "name": "Preliminary Round",
          "sort_order": 3,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-15",
          "ending_at": "2025-08-19",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77477536,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 224,
          "name": "Extra Preliminary Round Replays",
          "sort_order": 2,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-08-04",
          "ending_at": "2025-08-12",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        },
        {
          "id": 77478393,
          "sport_id": 1,
          "league_id": 24,
          "season_id": 25919,
          "type_id": 225,
          "name": "Qualification Round 4",
          "sort_order": 4,
          "finished": true,
          "is_current": false,
          "starting_at": "2025-10-11",
          "ending_at": "2025-10-14",
          "games_in_current_week": false,
          "tie_breaker_rule_id": null
        }
      ]
    }
  },
}
```

***

#### 5. Play-off competitions

**Characteristics:**

* Post-season tournaments
* Determine promotion, relegation, or championship
* Often part of a larger league system

**Stage types:** Qualifying (type\_id: 225) or Knock Out (type\_id: 224)

**Examples:** Various promotion/relegation playoffs, championship playoffs

**Structure:**

```
League: Playoff Competition
  └── Season: 2025/2026
      ├── Stage: "Semi-finals" (Knock Out)
      └── Stage: "Final" (Knock Out)
```

***

### Stage Types Reference

The API uses three main stage types to classify different phases of competitions:

| Type ID | Type Name       | Description                                                            | Typical Use                                               |
| ------- | --------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| **223** | **Group Stage** | Round-robin format where teams play within a group or league structure | Regular seasons, group phases in tournaments              |
| **224** | **Knock Out**   | Elimination format where losing teams are eliminated                   | Cup rounds, tournament knockout phases                    |
| **225** | **Qualifying**  | Preliminary rounds to determine tournament participants                | Qualification rounds, playoffs for main competition entry |

***

### League types and Sub-types

Leagues are classified by type and sub-type to help identify their nature:

#### League Types

* **League**: A standard league competition
* **Phase**: A specific phase within a league structure

#### League Sub-types

| Sub-type               | Description                          | Examples                                                     |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------ |
| D**omestic**           | A league within one country          | English Premier League, Serie A, La Liga, Bundesliga         |
| D**omestic\_cup**      | A cup competition within one country | FA Cup, DFB Pokal, Coppa Italia, Copa del Rey                |
| I**nternational**      | A league for international teams     | FIFA World Cup, European Championship, Copa America          |
| C**up\_international** | An international cup competition     | UEFA Champions League, Copa Libertadores, UEFA Europa League |
| P**lay-offs**          | A playoff competition                | Various promotion/relegation playoffs                        |
| F**riendly**           | Friendly matches                     | Club Friendlies, International Friendlies                    |

***

### Practical use cases

Understanding league structures is essential for:

#### 1. Requesting standings correctly

**Simple league:**

```http
GET /v3/football/standings/seasons/23690?api_token=YOUR_TOKEN
# Returns one unified league table
```

**Tournament with groups:**

```http
GET /v3/football/standings/seasons/23456?api_token=YOUR_TOKEN
# Returns multiple group tables (Group A, B, C, etc.)
```

#### 2. Determining current competition phase

Check the `is_current` field on stages to identify which phase is active:

```http
GET /v3/football/seasons/8?api_token=YOUR_TOKEN&include=stages
```

Look for `"is_current": true` to find the active stage.

#### 3. Understanding round structure

Different leagues have different round structures based on their format:

**Simple domestic leagues:**

* **Premier League** (league\_id: 8): 38 rounds (20 teams playing home and away)
* **La Liga** (league\_id: 564): 38 rounds (20 teams playing home and away)
* **Bundesliga** (league\_id: 82): 34 rounds (18 teams playing home and away)

**Multi-phase domestic leagues:**

* **Argentine Liga Profesional** (league\_id: 636):
  * 1st Phase: 27 rounds (group stage)
  * 1st Phase Playoffs: Multiple knockout rounds (8th Finals → Quarter-finals → Semi-finals → Final)
  * 2nd Phase: 27 rounds (group stage)
  * 2nd Phase Playoffs: Multiple knockout rounds (8th Finals → Quarter-finals → Semi-finals → Final)

**International cup tournaments:**

* **Champions League** (league\_id: 2):
  * Qualification Rounds: 2-leg ties per round
  * League Stage: 8 rounds (single round-robin format, new in 2024/25)
  * Knockout stages: Typically 2-leg ties per round (except Final which is single match)

**Domestic cup competitions:**

* **FA Cup** (league\_id: 20): Each stage is a single elimination round (single match with potential replays in early rounds)
* **Copa del Rey**: Earlier rounds single-leg, later rounds typically two-leg ties

**Play-off competitions:**

* **Championship Playoff** (league\_id: 1371):
  * Semi-finals: 2-leg ties
  * Final: Single match at neutral venue

#### 4. Filtering fixtures by stage

When requesting fixtures, you can filter by specific stages using the `stage_id`:

**Example 1: Get fixtures from a specific stage**

```http
GET /v3/football/fixtures/between/{start_date}/{end_date}
?api_token=YOUR_TOKEN&filters=fixtureStages:77478049
```

Returns only fixtures from Champions League "League Stage" (stage\_id: 77478049)

**Example 2: Get current stage fixtures for a league**

```http
GET /v3/football/leagues/636?api_token=YOUR_TOKEN&include=currentSeason.stages
```

First, identify the current stage (where `is_current: true`), then use that `stage_id` to filter fixtures.

**Example 3: Get fixtures from multiple stages**

```bash
GET /v3/football/fixtures/between/2025-11-01/2025-11-30
?api_token=YOUR_TOKEN&filters=fixtureStages:77475070,77475069
```

Returns fixtures from both "2nd Phase - 8th Finals" and "2nd Phase - Quarter-finals" stages of Argentine Liga Profesional.

**Example 4: Get all fixtures for a specific season**

```http
GET /v3/football/fixtures/seasons/25583?api_token=YOUR_TOKEN
```

Returns all fixtures across all stages for Premier League 2025/2026 season.

**Practical workflow:**

1. Query the league to get current season and stages
2. Identify the stage\_id you need (using `is_current`, `finished`, or `name`)
3. Use that stage\_id in your fixtures filter
4. Combine with date ranges for more precise results

#### 5. Checking if standings are available

Not all stages have standings tables. To determine if standings data exists for a stage:

**Check stage type\_id**

* **Group Stage** (type\_id: 223) → Usually has standings tables
* **Knock Out** (type\_id: 224) → No standings tables
* **Qualifying** (type\_id: 225) → May or may not have standings (verify with API)

***

### Tips for working with different structures

#### Always check stages first

Before requesting data, understand the league structure:

```bash
GET /v3/football/leagues/{league_id}?api_token=YOUR_TOKEN&include=currentSeason.stages
```

This reveals:

* How many stages exist
* What type each stage is (type\_id: 223, 224, or 225)
* Which stage is currently active (`is_current: true`)
* Stage progression order (`sort_order`)

#### Use `sort_order` for stage progression

The `sort_order` field indicates the sequence of stages. Lower numbers occur first, higher numbers occur later in the season.

#### Groups within stages

Some tournaments have groups within stages. Check for `group_id` in fixtures to identify group memberships:

```bash
GET /v3/football/fixtures/18535517?api_token=YOUR_TOKEN
```

If `"group_id": 244365`, this fixture belongs to a specific group (e.g., Group A).

#### Monitor `is_current` for active stages

The `is_current` field tells you which stage is actively being played. This is crucial for displaying current standings and fixtures.

### Common include options

Enrich your league requests with additional data:

| Include         | Description                          |
| --------------- | ------------------------------------ |
| `sport`         | Sport information                    |
| `country`       | Country details                      |
| `stages`        | All stages within the current season |
| `currentSeason` | Active season information            |
| `seasons`       | Historical seasons                   |
| `latest`        | Most recent fixture                  |
| `upcoming`      | Next scheduled fixture               |
| `inplay`        | Currently live fixtures              |
| `today`         | Today's fixtures                     |

**Example:**

```http
GET /v3/football/leagues/501?api_token=YOUR_TOKEN&include=currentSeason.stages
```

This returns the league with its current season and all stages.

**To get rounds, make a separate request:**

```http
GET /v3/football/stages/{stage_id}?api_token=YOUR_TOKEN&include=rounds
```

Or retrieve rounds for all stages in a season:

```http
GET /v3/football/seasons/25598?api_token=YOUR_TOKEN&include=stages.rounds
```

**Note:** The API limits nested includes to 2 levels maximum. You cannot use `currentSeason.stages.rounds` in a single request. Instead, use separate requests or structure your includes to stay within the 2-level limit (e.g., `stages.rounds` when querying a season directly).

### Related entities

For complete field descriptions and available includes, see:

* League, Season, Schedule, Stage and Round Entity Documentation
* Stages Endpoint Documentation
* Rounds Endpoint Documentation
* Standings Documentation

### Need Help?

If you have questions about league structures or need assistance implementing league data in your application, contact our support team at <support@sportmonks.com>.