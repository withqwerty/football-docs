---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Hudl Wyscout Identity Surfaces

Hudl Wyscout exposes structured football entities through competitions,
seasons, matches, teams, players, coaches, lineups, events, and career-like
profile fields. Treat its IDs as strong provider bridges, not as proof that its
ontology is the register ontology.

## Access Surface

Primary access is through licensed Hudl Wyscout APIs or delivered exports.
Public examples should stay at field-name and shape level unless Hudl has
published equivalent documentation. Record entitlement scope, export date, and
whether a fact came from match, event, profile, or career metadata.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | `competitionId` | Strong provider key. Check format, gender, country, and competition type. |
| Season | `seasonId` | Strong provider key under competition context. |
| Match | `matchId` | Strong match bridge when date, teams, score, and competition align. |
| Team | `teamId` | Can represent clubs, national teams, youth, or other sides. Use type/category/gender fields. |
| Player | `playerId` | Strong person bridge when profile attributes and relationship evidence agree. |
| Coach or referee | profile IDs in match/team metadata | Treat role-specific IDs as person or official surfaces only after attribute checks. |

## ID Scheme Notes

Wyscout IDs are provider-scoped keys. Store `competitionId`, `seasonId`,
`matchId`, `teamId`, `playerId`, and profile IDs with provider and snapshot
metadata, and treat round or stage IDs as provider structure until mapped into a
target-register stage model.

## Useful Matching Fields

- Match: `matchId`, `competitionId`, `seasonId`, `roundId`, date, home/away
  teams, score, winner, venue, status, and duration.
- Team: `teamId`, official name, short name, area, type, category, gender, city,
  child teams, and image/profile URL.
- Player: `playerId`, name fields, birth date, birth area, passport area, role,
  foot, height, gender, current team, and status.

## Known Quirks

- Wyscout's `currentTeamId` is point-in-time profile data. Do not use it as a
  historical membership edge without a snapshot date.
- Team `type`, `category`, and `gender` are useful gates, but still require
  normalisation into the target register vocabulary.
- Match lineup and event participation can corroborate identity, but does not
  replace attribute evidence for person bridging.
- Round and stage IDs are provider structure, not necessarily public ontology.

## Reep Next Usage

Use this page as the public provider-fact reference for Hudl Wyscout identity
surfaces and field families. Reep Next can cite those facts, but entitlement
coverage, canonical-source policy, private examples, review outputs, and
provider-specific bridge decisions belong outside football-docs.
