---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# FotMob Identity Surfaces

FotMob is useful as a public consumer-facing corroborator for fixtures, teams,
players, and competition pages. It should generally be treated as a bridge and
lookup surface rather than as the canonical ontology source.

## Access Surface

FotMob identity evidence usually comes from public web pages or undocumented
consumer-facing endpoints. Treat access and response shape as mutable, record
the public URL or endpoint family and snapshot date, and avoid publishing
scraping bypass or rate-limit evasion details.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | league or tournament ID | Useful public bridge. Check country, gender, season, and competition type. |
| Season | season ID or season path parameter where exposed | Treat as provider-scoped and audit URL/API stability. |
| Match | match ID | Strong public match corroborator when fixture fields align. |
| Team | team ID | Useful for clubs and national teams. Check side type and country. |
| Player | player ID | Useful public profile bridge. Corroborate with DOB, nationality, team, and position from stronger sources. |
| Coach or staff | manager profile where exposed | Treat as role evidence unless profile attributes are strong enough. |

## ID Scheme Notes

FotMob IDs are provider-scoped numeric IDs. Match, team, player, league, and
season IDs are useful bridges, while URL slugs and display labels are handles.
Because the public endpoint contract is undocumented, store source URL,
endpoint family, and snapshot date alongside any bridge evidence.

## Useful Matching Fields

- Match: FotMob match ID, date/time, home and away teams, score, league, season,
  venue, status, lineups, and player stats.
- Team: team ID, official/display name, country, league participation, squad,
  and fixtures.
- Player: player ID, full name, date of birth where present, nationality,
  position, current team, shirt number, and match participation.

## Known Quirks

- FotMob is optimised for product display. Display names, slugs, and grouping
  labels may change.
- Profile and current-team surfaces are point-in-time facts. Keep a snapshot
  date when using them.
- Public endpoints may be undocumented. Treat access and response shape as
  mutable unless the provider documents the contract.

## Reep Next Usage

Use this page as the public provider-fact reference for FotMob identity
surfaces, public URL families, and matching cautions. Reep Next can cite those
facts, but private endpoint handling, scrape internals, rate-limit tactics,
review outcomes, and register decisions belong outside football-docs.
