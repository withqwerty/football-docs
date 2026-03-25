# Wyscout API Access

## Overview

Wyscout is a **commercial football data provider** owned by Hudl. Access requires a paid license. There is no free tier, but academic research licenses are sometimes available.

## Authentication

API key-based authentication. The key is passed as a Basic Auth header:

```bash
curl -u "username:password" "https://apirest.wyscout.com/v3/matches/5012345"
```

Or as a header:

```
Authorization: Basic base64(username:password)
```

Python example:

```python
import requests
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth("your_username", "your_password")
response = requests.get(
    "https://apirest.wyscout.com/v3/matches/5012345",
    auth=auth
)
```

## Base URLs

| Version | Base URL | Status |
|---|---|---|
| v3 (current) | `https://apirest.wyscout.com/v3/` | Active |
| v2 (legacy) | `https://apirest.wyscout.com/v2/` | Deprecated |

## Key Endpoints

### Competitions & Seasons

```
GET /v3/competitions
GET /v3/competitions/{competitionId}
GET /v3/competitions/{competitionId}/seasons
GET /v3/seasons/{seasonId}
```

### Matches

```
GET /v3/seasons/{seasonId}/matches
GET /v3/matches/{matchId}
GET /v3/matches/{matchId}/formations
GET /v3/matches/{matchId}/players
GET /v3/matches/{matchId}/advancedstats
```

### Events

```
GET /v3/matches/{matchId}/events
```

Returns all events for a match. This is the primary endpoint for event-level analysis.

### Teams

```
GET /v3/teams/{teamId}
GET /v3/teams/{teamId}/squad
GET /v3/teams/{teamId}/transfers
GET /v3/seasons/{seasonId}/teams
```

### Players

```
GET /v3/players/{playerId}
GET /v3/players/{playerId}/advancedstats
GET /v3/players/{playerId}/matches
GET /v3/players/{playerId}/career
```

### Advanced Stats

```
GET /v3/matches/{matchId}/advancedstats
GET /v3/players/{playerId}/advancedstats?seasonId={seasonId}&competitionId={competitionId}
GET /v3/teams/{teamId}/advancedstats?seasonId={seasonId}&competitionId={competitionId}
```

Advanced stats include xG, xA, PPDA, deep completions, progressive passes/runs, and more.

### Search

```
GET /v3/search?query=Salah&type=player
GET /v3/search?query=Liverpool&type=team
```

## Rate Limits

- Rate limits depend on your license tier
- Typical limit: **12 requests per second** for standard licenses
- Bulk data export endpoints may have separate limits
- 429 responses include `Retry-After` header

## Response Format

All responses are JSON. Paginated endpoints use:

```json
{
  "data": [...],
  "meta": {
    "page_count": 5,
    "total_count": 100,
    "page": 1
  }
}
```

Use `?page=2` to paginate.

## Competition IDs (Common)

| Competition | ID |
|---|---|
| Premier League | 524 |
| La Liga | 795 |
| Serie A | 524 |
| Bundesliga | 528 |
| Ligue 1 | 412 |
| Champions League | 5 |
| Europa League | 6 |
| World Cup | 28 |

Note: IDs may vary by season for some cup competitions.

## Data Availability

- **Event data**: Available for top leagues, usually from 2014/15 onwards (coverage varies)
- **Advanced stats**: xG, xA available from ~2017/18 onwards
- **Video**: Match video may be available depending on license (separate from data API)
- **Tracking data**: Not available through the standard API (Wyscout is primarily an event data provider)

## Academic / Research Access

Wyscout has historically offered discounted or free access for academic research:

- Contact Wyscout/Hudl directly for research licenses
- Some universities have institutional access
- The publicly available "Wyscout open data" (used in academic papers like Pappalardo et al.) covers World Cup 2018, Euro 2016, and top-5 league seasons in v2 format
- This open dataset is available at: https://figshare.com/collections/Soccer_match_event_dataset/4415000

## Python Client Libraries

No official Python SDK. Common approaches:

```python
# Direct requests
import requests
from requests.auth import HTTPBasicAuth

class WyscoutClient:
    BASE_URL = "https://apirest.wyscout.com/v3"

    def __init__(self, username, password):
        self.auth = HTTPBasicAuth(username, password)

    def get_match_events(self, match_id):
        r = requests.get(f"{self.BASE_URL}/matches/{match_id}/events", auth=self.auth)
        r.raise_for_status()
        return r.json()
```

For loading Wyscout data into analysis tools, use **kloppy**:

```python
from kloppy import wyscout

# Load from file (v2 or v3 format)
dataset = wyscout.load(event_data="events.json", data_version="V3")

# Convert to pandas
df = dataset.to_df()
```
