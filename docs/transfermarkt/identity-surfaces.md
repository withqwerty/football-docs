---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Transfermarkt Identity Surfaces

Transfermarkt is primarily a public website, not an official public API.
Identity data comes from public entity pages, match reports, or licence-safe
community exports.

## Entity ID fields

| Entity | Common surface |
|---|---|
| Competition | `wettbewerb` code |
| Season | competition code plus season year |
| Match | match or game ID |
| Team | `verein` ID |
| Player | `spieler` ID |
| Coach | staff or manager profile ID |

The numeric IDs embedded in public URLs are the identity keys. URL slugs are
handles and can change without changing the underlying ID. Common URL
families include `spieler` for players, `verein` for teams, `wettbewerb` for
competitions, and match or game IDs for fixtures.

## Other fields

- Player: name variants, date of birth, birth place, citizenship, height,
  position, foot, profile aliases, current club, historical clubs, and
  national-team profile surfaces where available.
- Team: official name, historical names, country, city, gender where
  inferable, competition participation, and successor or predecessor context.
- Match: date, home and away teams, score, attendance, competition, season,
  and round label.
- Season: competition code, season year, display label, and match membership.
