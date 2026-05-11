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

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | `competition_id` | Stable inside StatsBomb. Pair with `competition_name` and country/region for human review. |
| Season | `season_id` under a competition | Stable inside StatsBomb. Not globally unique without competition context in some workflows. |
| Match | `match_id` | Strong match bridge for covered matches. |
| Team | `team_id` | Strong team bridge inside StatsBomb data. Check whether a single ID is being used across provider-side historical segmentation. |
| Player | `player_id` | Strong player bridge inside lineups/events. Corroborate with names, DOB from another authority, and relationship evidence. |
| Coach or manager | lineup or match metadata surfaces where present | Treat as role evidence. Coverage is less central than player/event data. |

## Useful Matching Fields

- Competitions and seasons: IDs, names, country, gender, and season label.
- Matches: match ID, date, home and away team IDs, score, competition, season,
  match status, and lineup availability.
- Teams: team IDs and names from matches, lineups, and events.
- Players: player IDs, names, team membership in lineups/events, shirt number,
  position, and event participation.

## Quirks

- Open Data coverage is selective. Absence from open data is not evidence that
  an entity or match does not exist.
- StatsBomb lineups are strong match-grain relationship evidence but not the
  same as club or national-team contract membership.
- Public Open Data may include rich international matches but not full
  tournament squad or call-up semantics.
- Names can be display names. Use another attribute authority for DOB where a
  person bridge requires it.

## Reep-Derived Provenance Rules

When using Reep-derived notes about StatsBomb, distinguish Open Data facts from
commercial API expectations. Public examples should prefer Open Data IDs and
avoid implying entitlement to private feeds.
