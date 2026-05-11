---
source_type: curated
source_url: https://docs.sportmonks.com/football
upstream_version: null
crawled_at: null
---

# SportMonks Identity Surfaces

SportMonks exposes a broad REST API with stable numeric IDs for leagues,
seasons, stages, fixtures, participants, players, coaches, venues, and related
entities. It is a useful bridge and corroborator, especially where public API
access is available.

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

## Useful Matching Fields

- Fixture: `fixture.id`, league, season, stage, round, participants, start time,
  scores, state, venue, and lineups.
- Participant: ID, name, short code, country, gender or type where present, and
  fixture participation.
- Player: ID, display name, common name, date of birth, nationality, position,
  height, weight, image URL, and team/lineup relationships.

## Quirks

- Broad APIs can carry legacy or contaminated bridges if a downstream register
  previously joined the wrong person. Validate same-provider ID uniqueness.
- Include-based responses can make relationship evidence easy to retrieve, but
  consumers must still distinguish lineup, squad, current team, and historical
  membership semantics.
- Stages and rounds are provider shape. Keep the canonical ontology decision
  separate from the SportMonks response nesting.

## Reep-Derived Provenance Rules

When Reep notes mention SportMonks bridge issues, record the provider ID,
affected entity type, and the validation rule that caught it. Avoid publishing
private API keys or paid-tier payloads.
