---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: null
crawled_at: null
---

# StatsBomb Identity Surfaces

StatsBomb data is keyed by numeric IDs that are stable within the StatsBomb
dataset but not guaranteed to be unique or stable outside it.

## Access surface

StatsBomb data is available through the public Open Data repository, the
`statsbombpy` wrapper, or licensed commercial APIs. Open Data coverage is
selective and does not include every competition available commercially.

## Entity ID fields

| Entity | Field |
|---|---|
| Competition | `competition_id` |
| Season | `season_id` (scoped to a competition) |
| Match | `match_id` |
| Team | `team_id` |
| Player | `player_id` |

`competition_id`, `season_id`, `match_id`, `team_id`, and `player_id` are all
numeric and provider-scoped; events additionally carry UUIDs.

### Two internal ID systems: live vs offline

StatsBomb does **not** have a single ID space. Internally there is a *live*
system and an *offline* system, each with its own IDs for players, teams,
country-of-birth, and matches (`live_player_id` vs `offline_player_id`,
`live_team_id` vs `offline_team_id`, `live_match_id` vs `offline_match_id`,
etc.). The same person or team has different integers in each system. Which
system's IDs appear in a given feed depends on which system produced it, so a
StatsBomb ID is a `(system, id)` pair rather than a bare integer.

The commercial **Player Mapping** endpoint (`/api/v1/player-mapping`) returns
paired `live_*`/`offline_*` IDs — see `player-mapping.md`. Open Data does not
expose this duality or the mapping endpoint.

## Other fields

- Competitions and seasons: names, country, gender, and season label.
- Matches: date, home and away team IDs, score, competition, season, match
  status, and lineup availability.
- Teams: names as they appear in matches, lineups, and events.
- Players: names, team membership in lineups/events, shirt number, position,
  and event participation.
