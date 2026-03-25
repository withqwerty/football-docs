# SportMonks API Access

## Overview

SportMonks provides a REST API (v3) for football data. It offers a **free tier** with limited data, making it accessible for side projects and prototyping. Paid plans unlock more leagues, historical data, and advanced stats.

## Base URL

```
https://api.sportmonks.com/v3/football
```

All endpoints are under the `/v3/football` prefix.

## Authentication

Token-based authentication. Pass your API token as a query parameter or header.

### Query Parameter (simplest)

```bash
curl "https://api.sportmonks.com/v3/football/fixtures/19145782?api_token=YOUR_TOKEN"
```

### Header

```bash
curl -H "Authorization: YOUR_TOKEN" "https://api.sportmonks.com/v3/football/fixtures/19145782"
```

### Python

```python
import requests

BASE_URL = "https://api.sportmonks.com/v3/football"
API_TOKEN = "your_token_here"

def get_fixture(fixture_id, includes=None):
    params = {"api_token": API_TOKEN}
    if includes:
        params["include"] = ";".join(includes)
    r = requests.get(f"{BASE_URL}/fixtures/{fixture_id}", params=params)
    r.raise_for_status()
    return r.json()["data"]

# Get fixture with events and lineups
fixture = get_fixture(19145782, includes=["events", "lineups", "statistics"])
```

## Rate Limits

| Plan | Requests/Minute | Requests/Hour |
|---|---|---|
| Free | 180 | 3,000 |
| Básico | 1,000 | 10,000 |
| Standard | 1,500 | 20,000 |
| Advanced | 3,000 | 50,000 |
| Enterprise | Custom | Custom |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 180
X-RateLimit-Remaining: 175
X-RateLimit-Reset: 1702300800
```

## Plans & Coverage

### Free Plan ("Básico Gratis")

- 1 league (usually the league you select during signup)
- Current season only
- Basic fixture data, events, lineups
- No historical data
- No advanced statistics (xG, etc.)
- 180 requests/minute

### Paid Plans

| Feature | Básico | Standard | Advanced |
|---|---|---|---|
| Leagues | 5 | 20+ | All (1,400+) |
| Historical seasons | 2 | 5 | All |
| Events & lineups | Yes | Yes | Yes |
| Player stats | Basic | Full | Full |
| xG / advanced stats | No | Yes | Yes |
| Odds data | No | Yes | Yes |
| Sidelined/injuries | Yes | Yes | Yes |
| Live scores | No | Yes | Yes |
| Transfers | Yes | Yes | Yes |

## Key Endpoints

### Fixtures

```
GET /fixtures                              # All fixtures (paginated)
GET /fixtures/{id}                         # Single fixture
GET /fixtures/date/{date}                  # Fixtures by date (YYYY-MM-DD)
GET /fixtures/between/{from}/{to}          # Fixtures between dates
GET /fixtures/between/{from}/{to}/{teamId} # Team fixtures between dates
GET /fixtures/head-to-head/{team1}/{team2} # Head-to-head fixtures
```

### Leagues & Seasons

```
GET /leagues                               # All leagues
GET /leagues/{id}                          # Single league
GET /seasons/{id}                          # Single season
GET /leagues/{id}/seasons                  # Seasons for a league (via include)
```

### Teams

```
GET /teams/{id}                            # Single team
GET /teams/search/{name}                   # Search teams
GET /teams/countries/{countryId}           # Teams by country
GET /seasons/{id}/teams                    # Teams in a season
```

### Players

```
GET /players/{id}                          # Single player
GET /players/search/{name}                 # Search players
GET /squads/teams/{teamId}                 # Current squad
GET /squads/seasons/{seasonId}/teams/{teamId} # Season squad
```

### Standings

```
GET /standings/seasons/{seasonId}          # Season standings
GET /standings/live/leagues/{leagueId}     # Live standings
```

### Transfers & Sidelined

```
GET /transfers/teams/{teamId}              # Team transfers
GET /transfers/players/{playerId}          # Player transfers
GET /sidelineds/teams/{teamId}             # Team sidelined players
GET /sidelineds/players/{playerId}         # Player sidelined history
GET /sidelineds/seasons/{seasonId}/teams/{teamId} # Season sidelineds
```

### Topscorers

```
GET /topscorers/seasons/{seasonId}         # Season top scorers
```

### Coaches

```
GET /coaches/{id}                          # Single coach
GET /coaches/search/{name}                 # Search coaches
GET /coaches/teams/{teamId}                # Team coaches (current & history)
```

### Rounds

```
GET /rounds/seasons/{seasonId}             # All rounds in a season
GET /rounds/{id}                           # Single round
```

## Include System

The includes system is SportMonks' most distinctive feature. It lets you fetch related data in a single request, avoiding N+1 query patterns.

```
GET /fixtures/19145782?include=events;lineups;statistics;scores;formations
```

Nested includes use dot notation:

```
GET /fixtures/19145782?include=lineups.player;events.player
```

See `data-model.md` for detailed include combinations.

## Select System

Reduce response payload by selecting only the fields you need:

```
GET /fixtures?select=id,name,starting_at&include=scores:select(id,score)
```

## Pagination

```
GET /fixtures?per_page=50&page=2
```

Default: 25 per page. Maximum depends on plan (typically 150).

Response includes pagination metadata:

```json
{
  "pagination": {
    "count": 50,
    "per_page": 50,
    "current_page": 2,
    "next_page": "https://api.sportmonks.com/...?page=3",
    "has_more": true
  }
}
```

## Timezone

All dates default to UTC. Specify timezone with:

```
GET /fixtures?timezone=Europe/London
```

## Error Responses

```json
{
  "message": "Unauthenticated.",
  "error_code": 403
}
```

| Status | Meaning |
|---|---|
| 401 | Invalid or missing API token |
| 403 | Insufficient plan (endpoint not available) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

## Webhooks

SportMonks supports webhooks for real-time updates (paid plans):

- Match state changes (kick-off, goals, cards, FT)
- Odds changes
- Lineup confirmations

Configure via the SportMonks dashboard.

## Tips for Efficient Usage

1. **Use includes aggressively** -- one request with includes is better than multiple requests
2. **Use select** to reduce payload size when you only need specific fields
3. **Cache season/league/team data** -- these change infrequently
4. **Use date-range endpoints** for batch fetching fixtures
5. **Paginate fully** -- always check `has_more` in pagination response
6. **Store fixture IDs** -- they're stable and can be used for subsequent lookups
