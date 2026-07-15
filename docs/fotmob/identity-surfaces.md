---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# FotMob Identity Surfaces

FotMob identity data usually comes from public web pages or undocumented
consumer-facing endpoints.

## Entity ID fields

| Entity | Common surface |
|---|---|
| Competition | league or tournament ID |
| Season | season ID or season path parameter where exposed |
| Match | match ID |
| Team | team ID |
| Player | player ID |
| Coach or staff | manager profile where exposed |

IDs are provider-scoped numeric IDs. URL slugs and display labels are handles,
not IDs, and can change independently of the underlying ID.

## Other fields

- Match: FotMob match ID, date/time, home and away teams, score, league,
  season, venue, status, lineups, and player stats.
- Team: team ID, official/display name, country, league participation, squad,
  and fixtures.
- Player: player ID, full name, date of birth where present, nationality,
  position, current team, shirt number, and match participation.
