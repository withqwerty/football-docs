---
source_type: curated
source_url: https://docs.sportmonks.com/v3
upstream_version: null
crawled_at: null
---

# SportMonks Identity Surfaces

SportMonks exposes a broad REST API with stable numeric IDs for leagues,
seasons, stages, fixtures, participants, players, coaches, venues, and related
entities. It is a useful bridge and corroborator, especially where public API
access is available.

## Access Surface

Primary access is the documented SportMonks football API. Include expansions can
make identity, relationship, and event evidence available from the same request,
but callers should still record the endpoint, include set, plan scope, and
request date because coverage depends on subscription tier.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | league ID | Strong provider key. League names and display categories should be normalised. |
| Season | season ID | Strong provider key under a league. Use start/end years and league relationship for review. |
| Stage or round | stage ID, round ID, group ID | Useful provider structure, but may differ from a canonical schedule feed. |
| Match | fixture ID | Strong match bridge when date, participants, score, and competition align. |
| Team | participant ID | Can represent clubs or national teams. Check participant type and country. |
| Player | player ID | Strong provider key only if not reused or contaminated by previous bridge errors. Corroborate with attributes. |
| Coach or staff | coach ID | Treat as person identity with role-specific evidence. |

## ID Scheme Notes

SportMonks IDs are numeric provider IDs. Keep them provider-scoped and do not
merge by bare number across providers. League, season, stage, round, fixture,
participant, player, coach, and venue IDs should be stored with the source
endpoint and include path that supplied them.

## Useful Matching Fields

- Fixture: `fixture.id`, league, season, stage, round, participants, start time,
  scores, state, venue, and lineups.
- Participant: ID, name, short code, country, gender or type where present, and
  fixture participation.
- Player: ID, display name, common name, date of birth, nationality, position,
  height, weight, image URL, and team/lineup relationships.

## Known Quirks

- Broad APIs can carry legacy or contaminated bridges if a downstream register
  previously joined the wrong person. Validate same-provider ID uniqueness.
- Include-based responses can make relationship evidence easy to retrieve, but
  consumers must still distinguish lineup, squad, current team, and historical
  membership semantics.
- Stages and rounds are provider shape. Keep the canonical ontology decision
  separate from the SportMonks response nesting.

## Reep Next Usage

Use this page as the public provider-fact reference for SportMonks ID families,
API identity surfaces, include paths, and matching cautions. Reep Next can cite
those facts, but contaminated-bridge review, private validation output, API
keys, paid-tier payloads, and register decisions belong outside football-docs.
