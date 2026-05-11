---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: null
crawled_at: null
---

# StatsBomb Identity Surfaces

StatsBomb provides strong match, lineup, event, and tactical context for covered
competitions. Open Data is excellent for public examples and corroboration, but
its coverage is selective and should not be treated as a full canonical register
source unless the exact scope has been audited.

## Access Surface

StatsBomb identity examples can come from the public Open Data repository, the
`statsbombpy` wrapper, or licensed commercial APIs. Public docs should prefer
Open Data IDs and explicitly say when guidance is inferred from Open Data rather
than a commercial entitlement.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | `competition_id` | Stable inside StatsBomb. Pair with `competition_name` and country/region for human review. |
| Season | `season_id` under a competition | Stable inside StatsBomb. Not globally unique without competition context in some workflows. |
| Match | `match_id` | Strong match bridge for covered matches. |
| Team | `team_id` | Strong team bridge inside StatsBomb data. Check whether a single ID is being used across provider-side historical segmentation. |
| Player | `player_id` | Strong player bridge inside lineups/events. Corroborate with names, DOB from another authority, and relationship evidence. |
| Coach or manager | lineup or match metadata surfaces where present | Treat as role evidence. Coverage is less central than player/event data. |

## ID Scheme Notes

StatsBomb Open Data exposes numeric `competition_id`, `season_id`, `match_id`,
`team_id`, and `player_id` fields, plus event UUIDs. The numeric IDs are stable
inside the provider dataset but should stay provider-scoped. Do not infer global
identity from a bare number without provider and dataset context.

## Useful Matching Fields

- Competitions and seasons: IDs, names, country, gender, and season label.
- Matches: match ID, date, home and away team IDs, score, competition, season,
  match status, and lineup availability.
- Teams: team IDs and names from matches, lineups, and events.
- Players: player IDs, names, team membership in lineups/events, shirt number,
  position, and event participation.

## Known Quirks

- Open Data coverage is selective. Absence from open data is not evidence that
  an entity or match does not exist.
- StatsBomb lineups are strong match-grain relationship evidence but not the
  same as club or national-team contract membership.
- Public Open Data may include rich international matches but not full
  tournament squad or call-up semantics.
- Names can be display names. Use another attribute authority for DOB where a
  person bridge requires it.

## Reep Next Usage

Use this page as the public provider-fact reference for StatsBomb identity
surfaces. Reep Next can cite Open Data ID families and matching cautions, while
commercial entitlement assumptions, register acceptance policy, private review
evidence, and derived bridge decisions belong outside football-docs.
