---
source_type: crawled
source_url: https://skillcorner.com/api/docs/
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner Identity Surfaces

SkillCorner is mainly a tracking and physical-data provider. Its identity
surfaces are most useful for linking delivered match, team, and player rows back
to an existing register rather than minting a full football ontology. The first
section is **spec-confirmed** from the public API; the rest is curated guidance.

## ID fields (confirmed, public API)

Integer SkillCorner IDs key every entity, queryable as comma-separated multi-value
filters across endpoints:

| Entity | ID field | Other identity fields |
|---|---|---|
| Competition | `competition` (id) | name; editions & rounds are sub-resources |
| Competition edition | `id` | `{competition, season, name}` — the season×competition unit |
| Season | `id` | `start_year`, `end_year`, `name` |
| Match | `match` / `id` | `date_time`, home/away team, score, stadium, competition_edition |
| Team | `team` / `id` | `name`, `coach`, `stadium`, `players` |
| Player | `player` / `id` | `first_name`, `last_name`, `short_name`, `birthday`, `gender` |
| Role/position | role `id` | `position_group`, `name`, `acronym` |

**Key cross-reference: `trackable_object`.** Each `Player` carries a
`trackable_object` id that links the player to their positions inside tracking
frames. It is the bridge between SkillCorner's identity layer and its tracking
payloads — match a track to a person via `Player.trackable_object`.

Filterable identity context on most data endpoints: `season`, `competition`,
`competition_edition`, `match`, `team`, `player`, `position`, `position_group`.

## Access Surface

Access is through licensed SkillCorner APIs or delivered tracking/physical-data
files. Public guidance should use synthetic examples or high-level field names,
not proprietary tracking payloads. Record delivery date, match scope, and data
product when using SkillCorner identity evidence.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | provider competition key where present | Often secondary to match delivery scope. Audit before treating as canonical. |
| Season | provider season or delivery context | Keep provider-scoped unless a stable season key is documented in the extract. |
| Match | provider match key | Strong bridge when fixture fields and delivery metadata agree. |
| Team | provider team key | Corroborate with match participation and team names. |
| Player | provider player key | Corroborate with tracking roster, shirt number, position, and external person attributes. |

## ID Scheme Notes

SkillCorner IDs should be treated as opaque and provider-scoped. Match delivery
IDs, team IDs, and player IDs are strongest when paired with the delivery
snapshot and fixture context. A tracking roster key is not automatically a
season membership or person identity without corroborating attributes.

## Useful Matching Fields

- Match: provider match key, date, competition, season, home and away teams,
  score where present, and data delivery snapshot.
- Team: provider team key, name, side in match, and relationship to match.
- Player: provider player key, name, team in match, shirt number, position,
  starter/substitute status where supplied, and tracking samples.

## Known Quirks

- Tracking feeds can expose matchday rosters without enough biographical detail
  for safe person minting. Use them as relationship evidence unless another
  source supplies the identity attributes.
- Delivery metadata may be more reliable than display names for reproducible
  matching.
- A match-level tracking file is not proof of a season-long membership edge.

## Implementation Notes

Use this page as the public provider-fact reference for SkillCorner identity
surfaces in tracking and physical-data deliveries: field families and matching
cautions. Keep raw tracking payloads, non-public delivery examples, and register
review outputs outside football-docs.
