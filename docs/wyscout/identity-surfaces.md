---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Hudl Wyscout Identity Surfaces

Hudl Wyscout exposes structured football entities through competitions,
seasons, matches, teams, players, coaches, lineups, events, and career-like
profile fields.

## Access surface

Primary access is through licensed Hudl Wyscout APIs or delivered exports.

## Entity ID fields

| Entity | Own ID field |
|---|---|
| Competition | `wyId` |
| Season | `wyId` |
| Match | `wyId` |
| Team | `wyId` |
| Player | `wyId` |
| Coach or referee | `wyId` |

Every entity's own primary identifier is the single field `wyId`, a
provider-scoped key. `competitionId`, `seasonId`, `matchId`, `teamId`, and
`playerId` also appear in the schema, but only as foreign-key reference
fields inside *other* objects (e.g. `Match.competitionId`, `Match.seasonId`,
`MatchEvent.matchId`) -- never as an entity's own ID. `teamId` as a foreign
key can represent clubs, national teams, youth, or other sides,
distinguished by type/category/gender fields.

## Other fields

- Match: `wyId`, `competitionId`, `seasonId`, `roundId`, date, home/away
  teams, score, winner, venue, status, and duration.
- Team: `wyId`, official name, short name, area, type, category, gender,
  city, child teams, and image/profile URL.
- Player: `wyId`, name fields, birth date, birth area, passport area,
  role, foot, height, gender, current team, and status.

`currentTeamId` on a player profile is a point-in-time field, not a
historical membership record.
