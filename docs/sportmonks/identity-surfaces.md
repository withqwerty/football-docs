---
source_type: curated
source_url: https://docs.sportmonks.com/v3
upstream_version: null
crawled_at: null
---

# SportMonks Identity Surfaces

SportMonks exposes a broad REST API with numeric IDs for leagues, seasons,
stages, fixtures, participants, players, coaches, venues, and related
entities.

## Access surface

Primary access is the documented SportMonks football API. Includes can make
identity, relationship, and event data available from the same request;
coverage depends on subscription tier.

## Entity ID fields

| Entity | Common surface |
|---|---|
| Competition | league ID |
| Season | season ID |
| Stage or round | stage ID, round ID, group ID |
| Match | fixture ID |
| Team | participant ID |
| Player | player ID |
| Coach or staff | coach ID |

IDs are numeric and provider-scoped. Participant IDs can represent clubs or
national teams, distinguished by a participant type field.

## Other fields

- Fixture: `fixture.id`, league, season, stage, round, participants, start
  time, scores, state, venue, and lineups.
- Participant: ID, name, short code, country, gender or type where present,
  and fixture participation.
- Player: ID, display name, common name, date of birth, nationality,
  position, height, weight, image URL, and team/lineup relationships.
