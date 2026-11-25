---
source_type: curated
source_url: https://www.fotmob.com/teams/8456/overview/manchester-city
archived_url: https://web.archive.org/web/20260731092613/https://www.fotmob.com/teams/8456/overview/manchester-city
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
| Season | expressed as a parameter value on competition and team surfaces; no standalone season entity observed |
| Match | match ID |
| Team | team ID |
| Player | player ID |
| Coach or staff | manager profile where exposed |

IDs are provider-scoped numeric IDs. URL slugs and display labels are handles,
not IDs, and can change independently of the underlying ID.

In a match link such as `/matches/arsenal-vs-newcastle-united/3c42by#5795523`, the
match ID is the number after `#`. The short code before it (`3c42by`) is not the
match ID: the match page for that link carries `"matchId":5795523`.

## Other fields

- Match: FotMob match ID, date/time, home and away teams, score, league,
  season, venue, status, lineups, and player stats.
- Team: team ID, official/display name, country, league participation, squad,
  and fixtures.
- Player: player ID, full name, date of birth where present, nationality,
  position, current team, shirt number, and match participation.
