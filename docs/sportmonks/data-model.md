# SportMonks Data Model

## Core Entities

SportMonks organises football data around **fixtures** as the central entity. Related data is accessed through an **includes** system that lets you nest related entities in a single API call.

### Entity Hierarchy

```
Sport
 └── League (e.g., Premier League)
      └── Season (e.g., 2024/2025)
           ├── Rounds (gameweeks)
           │    └── Fixtures
           │         ├── Events (goals, cards, subs)
           │         ├── Lineups
           │         ├── Statistics
           │         ├── Scores
           │         ├── Periods
           │         └── Formations
           ├── Standings
           └── Stages (group/knockout for cups)
```

### Fixture

The central entity. A single match.

```json
{
  "id": 19145782,
  "sport_id": 1,
  "league_id": 8,
  "season_id": 23614,
  "stage_id": 77471372,
  "round_id": 339295,
  "group_id": null,
  "aggregate_id": null,
  "state_id": 5,
  "venue_id": 214,
  "name": "Liverpool vs Manchester City",
  "starting_at": "2024-12-01 16:30:00",
  "result_info": "Liverpool won after full-time.",
  "leg": "1/1",
  "length": 90,
  "placeholder": false,
  "has_odds": true
}
```

### State IDs

| State ID | Name | Description |
|---|---|---|
| 1 | Not Started | Match not yet started |
| 2 | Inplay | Match in progress |
| 3 | Finished | Full time (90 min) |
| 4 | After Extra Time | Finished after extra time |
| 5 | Finished | Final result confirmed |
| 6 | Penalties | Finished after penalty shootout |
| 7 | Cancelled | Match cancelled |
| 8 | Postponed | Match postponed |
| 13 | Half Time | Currently at half time |
| 14 | Extra Time | Currently in extra time |
| 22 | Awarded | Match awarded |

### Scores

Fixture scores are nested under `scores`, each with a `description` and `score` object:

```json
{
  "scores": [
    {
      "id": 1,
      "fixture_id": 19145782,
      "type_id": 1,
      "description": "CURRENT",
      "score": { "goals": 2, "participant": "home" }
    },
    {
      "id": 2,
      "fixture_id": 19145782,
      "type_id": 1,
      "description": "CURRENT",
      "score": { "goals": 1, "participant": "away" }
    }
  ]
}
```

Score type descriptions: `CURRENT`, `HT` (half-time), `FT` (full-time), `ET` (extra time), `PS` (penalties).

### Team (Participant)

```json
{
  "id": 9,
  "sport_id": 1,
  "country_id": 462,
  "venue_id": 214,
  "name": "Liverpool",
  "short_code": "LIV",
  "image_path": "https://cdn.sportmonks.com/images/soccer/teams/9/9.png",
  "founded": 1892,
  "type": "domestic",
  "gender": "male"
}
```

### Player

```json
{
  "id": 456,
  "sport_id": 1,
  "country_id": 48,
  "nationality_id": 48,
  "city_id": null,
  "position_id": 27,
  "detailed_position_id": 156,
  "type_id": 24,
  "common_name": "M. Salah",
  "firstname": "Mohamed",
  "lastname": "Salah",
  "name": "Mohamed Salah",
  "display_name": "M. Salah",
  "image_path": "https://cdn.sportmonks.com/images/soccer/players/...",
  "height": 175,
  "weight": 71,
  "date_of_birth": "1992-06-15",
  "gender": "male"
}
```

### Lineup

```json
{
  "id": 789,
  "sport_id": 1,
  "fixture_id": 19145782,
  "player_id": 456,
  "team_id": 9,
  "position_id": 27,
  "formation_position": 11,
  "player_name": "M. Salah",
  "jersey_number": 11,
  "type_id": 11,
  "captain": false
}
```

Lineup `type_id`: `11` = starting XI, `12` = substitute.

### Standing

```json
{
  "id": 1234,
  "participant_id": 9,
  "sport_id": 1,
  "league_id": 8,
  "season_id": 23614,
  "stage_id": 77471372,
  "round_id": 339295,
  "position": 1,
  "points": 45,
  "result": "equal",
  "details": [
    { "type_id": 129, "value": 15, "type": { "name": "Matches Played" } },
    { "type_id": 130, "value": 14, "type": { "name": "Won" } },
    { "type_id": 131, "value": 1, "type": { "name": "Draw" } },
    { "type_id": 132, "value": 0, "type": { "name": "Lost" } },
    { "type_id": 133, "value": 40, "type": { "name": "Goals For" } },
    { "type_id": 134, "value": 12, "type": { "name": "Goals Against" } },
    { "type_id": 179, "value": 28, "type": { "name": "Goal Difference" } }
  ]
}
```

### Season

```json
{
  "id": 23614,
  "sport_id": 1,
  "league_id": 8,
  "tier_id": 1,
  "name": "2024/2025",
  "is_current": true,
  "starting_at": "2024-08-17",
  "ending_at": "2025-05-25",
  "standings_recalculated_at": "2024-12-10 16:30:00"
}
```

## The Includes System

SportMonks' most powerful feature is the **includes** system. Instead of making multiple API calls, you nest related data using semicolon-separated include parameters.

### Basic Includes

```
GET /v3/football/fixtures/19145782?include=events;lineups;statistics
```

Returns the fixture with events, lineups, and statistics nested in the response.

### Nested Includes

Use dot notation for nested relationships:

```
GET /v3/football/fixtures/19145782?include=lineups.player;events.player
```

Returns lineups with full player objects nested inside each lineup entry.

### Common Include Combinations

| Use Case | Includes |
|---|---|
| Match summary | `events;scores;lineups` |
| Full match data | `events;lineups;statistics;scores;formations` |
| Match with players | `lineups.player;events.player` |
| Season standings | `standings.details` |
| Team squad | `players` |
| Player career | `teams;statistics` |

### Include Depth

You can nest up to 3 levels deep on most plans:

```
fixtures?include=lineups.player.nationality
```

## Filters

Use `filters` parameter to narrow results:

```
GET /v3/football/fixtures?filters=fixtureSeasonId:23614;fixtureBookmakerId:1
GET /v3/football/fixtures?filters=fixtureTeamId:9
GET /v3/football/seasons/23614/fixtures?filters=fixtureRoundId:339295
```

### Common Filters

| Filter | Example | Description |
|---|---|---|
| `fixtureSeasonId` | `23614` | Filter by season |
| `fixtureTeamId` | `9` | Filter by team |
| `fixtureRoundId` | `339295` | Filter by round/gameweek |
| `fixtureLeagueId` | `8` | Filter by league |
| `fixtureDateBefore` | `2024-12-31` | Fixtures before date |
| `fixtureDateAfter` | `2024-08-01` | Fixtures after date |

## Pagination

All list endpoints are paginated:

```json
{
  "data": [...],
  "pagination": {
    "count": 25,
    "per_page": 25,
    "current_page": 1,
    "next_page": "https://api.sportmonks.com/v3/...?page=2",
    "has_more": true
  }
}
```

Default page size is 25. Use `per_page` parameter to adjust (max depends on plan).

## Relationships Diagram

```
League ──── Season ──── Round ──── Fixture
                │                     │
                ├── Stage             ├── Events (goals, cards, subs)
                │                     ├── Lineups
                ├── Standings         ├── Statistics
                │                     ├── Scores
                └── Squads            ├── Formations
                     │                └── Periods
                     └── Player
                          ├── Statistics
                          ├── Sidelineds (injuries)
                          └── Transfers
```

## Key League IDs

| League | ID |
|---|---|
| Premier League | 8 |
| La Liga | 564 |
| Serie A | 384 |
| Bundesliga | 82 |
| Ligue 1 | 301 |
| Champions League | 2 |
| Europa League | 5 |
| FA Cup | 24 |
| EFL Cup (League Cup) | 27 |

## Sidelined (Injury/Absence) Data

```json
{
  "id": 12345,
  "player_id": 456,
  "team_id": 9,
  "type_id": 1,
  "category": "injury",
  "start_date": "2024-11-15",
  "end_date": "2024-12-20",
  "games_missed": 5,
  "completed": true
}
```

This is particularly useful for season story absence detection (see the myTeam season-story pipeline which uses this as its primary data source).
