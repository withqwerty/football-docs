---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: curated
---

# SportMonks API Access

## Overview

SportMonks provides a REST API (v3) for football data. It offers a **free tier** (Danish Superliga and Scottish Premiership only), making it accessible for side projects and prototyping. Paid plans differ by the number of leagues you can select and by API call capacity; xG, odds and older historical data are sold as add-ons.

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

| Plan | API calls per entity per hour |
|---|---|
| Free | 3,000 |
| Starter | 2,000 |
| Growth | 2,500 |
| Pro | 3,000 |
| Enterprise | 5,000 |

API call add-ons increase the hourly limit accordingly.

**Limits are per entity, not per account.** Each entity type (Fixture, Team, Player
and so on) has its own quota, shared across every endpoint that returns that entity.
On a plan allowing 3,000 requests per hour you could therefore make 3,000 Fixture
requests *and* 3,000 Team requests in the same hour, rather than 3,000 in total.

Rate limit state is returned in a `rate_limit` object in the JSON response body:

```json
{
  "rate_limit": {
    "resets_in_seconds": 3600,
    "remaining": 2999,
    "requested_entity": "Team"
  }
}
```

`requested_entity` tells you which quota the call was counted against.
`x-ratelimit-limit` and `x-ratelimit-remaining` can also be available in response
headers. Not every error includes a `rate_limit` object, and cached responses need not
expose matching header values.

## Plans & Coverage

### Free Plan

- Danish Superliga and Scottish Premiership only
- No credit card required, no expiry
- 3,000 API calls per entity per hour

### Paid Plans

| Plan | Leagues | API calls per entity per hour | Price |
|---|---|---|---|
| Starter | Pick any 5 leagues | 2,000 | €29/month |
| Growth | Pick any 30 leagues | 2,500 | €99/month |
| Pro | Pick any 120 leagues | 3,000 | €249/month |
| Enterprise | All leagues | 5,000 | Custom |

- All plans include the same core data features; the only difference is the number
  of leagues and the API call capacity.
- xG (the "xG & Pressure Index" bundle) and odds (the "Odds & Predictions" bundle) are
  add-ons, as are extra API calls and extra leagues.
- Historical data older than three seasons is a one-time add-on on Starter, Growth and
  Pro. Enterprise includes full historical access.
- Paid plans come with a 14-day free trial; yearly billing is discounted 20%.

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

Default: 25 per page. The maximum `per_page` is 50. Add `filters=populate` to raise
the page size to 1,000; includes are disabled when this filter is used.

Offset pagination is rejected with a `4xx` error when `(page - 1) × per_page` exceeds
20,000 rows. Every paginated response includes a `next_cursor` field; pass it as
`cursor` to page beyond that cap.

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

The SportMonks Football API does not support webhooks. Poll for changes and refresh
caches on a schedule or when a polled response changes.

## Tips for Efficient Usage

1. **Use includes aggressively** -- one request with includes is better than multiple requests
2. **Use select** to reduce payload size when you only need specific fields
3. **Cache season/league/team data** -- these change infrequently
4. **Use date-range endpoints** for batch fetching fixtures
5. **Paginate fully** -- always check `has_more` in pagination response
6. **Store fixture IDs** -- they're stable and can be used for subsequent lookups
