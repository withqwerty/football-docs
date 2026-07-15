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

| Entity | Common surface |
|---|---|
| Competition | `competitionId` |
| Season | `seasonId` |
| Match | `matchId` |
| Team | `teamId` |
| Player | `playerId` |
| Coach or referee | profile IDs in match/team metadata |

`competitionId`, `seasonId`, `matchId`, `teamId`, and `playerId` are
provider-scoped keys. `teamId` can represent clubs, national teams, youth, or
other sides, distinguished by type/category/gender fields.

## Other fields

- Match: `matchId`, `competitionId`, `seasonId`, `roundId`, date, home/away
  teams, score, winner, venue, status, and duration.
- Team: `teamId`, official name, short name, area, type, category, gender,
  city, child teams, and image/profile URL.
- Player: `playerId`, name fields, birth date, birth area, passport area,
  role, foot, height, gender, current team, and status.

`currentTeamId` on a player profile is a point-in-time field, not a
historical membership record.
