---
source_type: crawled
source_url: https://skillcorner.com/api/docs/
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner Identity Surfaces

Integer SkillCorner IDs key every entity, queryable as comma-separated
multi-value filters across endpoints.

## Entity ID fields

| Entity | ID field | Other identity fields |
|---|---|---|
| Competition | `competition` (id) | name; editions & rounds are sub-resources |
| Competition edition | `id` | `{competition, season, name}` — the season × competition unit |
| Season | `id` | `start_year`, `end_year`, `name` |
| Match | `match` / `id` | `date_time`, home/away team, score, stadium, competition_edition |
| Team | `team` / `id` | `name`, `coach`, `stadium`, `players` |
| Player | `player` / `id` | `first_name`, `last_name`, `short_name`, `birthday`, `gender` |
| Role/position | role `id` | `position_group`, `name`, `acronym` |

**`trackable_object`.** Each `Player` carries a `trackable_object` id that
links the player to their positions inside tracking frames — it connects
SkillCorner's entity records to its tracking payloads.

Filterable identity context on most data endpoints: `season`, `competition`,
`competition_edition`, `match`, `team`, `player`, `position`, `position_group`.

## Access surface

Access is through licensed SkillCorner APIs or delivered tracking/physical-data
files.

## Other fields

- Match: provider match key, date, competition, season, home and away teams,
  score where present, and data delivery snapshot.
- Team: provider team key, name, side in match.
- Player: provider player key, name, team in match, shirt number, position,
  starter/substitute status where supplied, and tracking samples.
