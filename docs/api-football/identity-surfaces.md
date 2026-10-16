---
source_url: https://www.api-football.com/documentation-v3
source_type: curated
upstream_version: 3.9.3
crawled_at: 2026-10-15
---

# API-Football identity surfaces

Original notes on API-Football v3.9.3 identifiers, checked on 2026-10-15.
Numeric ID fields were observed in selected direct-access responses; identity
stability statements below come from the provider's public documentation,
not a longitudinal identity audit.

## API-Football competition and season identity

The `/leagues` documentation says a competition keeps its league ID across
seasons. Responses put that ID in `league.id`, with season years in
`seasons[].year`; fixture responses carry `league.id` and `league.season`.
A season year is not a globally unique season ID. Preserve the competition
and year together when joining standings or statistics.

Source: [leagues](https://www.api-football.com/documentation-v3#tag/Leagues/operation/get-leagues).

## API-Football team and player identity

The `/teams` documentation says team IDs are retained across the competitions
in which a team participates. The `/players` documentation says a player
retains their player ID across teams. Do not key a player by display name or
by current club.

The ID location depends on resource shape: `/players` uses `player.id`,
`/fixtures/players` uses `players[].player.id` within each response team, and
`/players/squads` uses `players[].id`. These paths are relative to a response
array item. Keep the team, league and season context of each `/players`
statistics block when handling a transfer.

Sources: [teams](https://www.api-football.com/documentation-v3#tag/Teams/operation/get-teams),
[players](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players),
[squads](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players-squads).

## API-Football fixture identity and rescheduling

The `/fixtures` documentation states that fixture IDs are unique and do not
change. The response field is `fixture.id`; related events, lineups and match
statistics accept the `fixture` query parameter. A provisional date, a
rescheduling or a different response time zone is not a new identity key.

Round labels such as `league.round` describe competition context; they do not
replace `fixture.id`. The direct sample checked a completed league context,
not every rescheduling or cup structure.
Source: [fixtures](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures).

## API-Football IDs across providers

An API-Football numeric ID is not automatically an Opta, StatsBomb or
Transfermarkt ID. An external mapping needs evidence for the same entity and
entity type; equality of numbers or names is not sufficient.

Reep's documented namespace for API-Football players is `api_football/player`
and for teams is `api_football/team`. Those are Reep bridge keys, not
API-Football endpoint paths. Matching requires a configured register or Reep
API access, and coverage is not complete. A missing mapping should remain
unmatched rather than being guessed from a name.
Source: [Reep provider namespaces and crosswalk](https://reep.football/get-started/).
