---
source_url: https://skillcorner.com/api/docs/
source_type: crawled
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner Data Model

Payload shapes from the API. Field lists below are from the OpenAPI spec's inline response schemas; where a product is delivered as a downloadable file (tracking, dynamic events) the per-row schema is documented in SkillCorner's glossary (<https://skillcorner.crunch.help/en>) rather than the OpenAPI spec. See [physical-data.md](physical-data.md) for physical metrics and [coordinate-system.md](coordinate-system.md) for tracking geometry.

## Master data

| Object | Fields |
|---|---|
| `Season` | `id`, `start_year`, `end_year`, `name` |
| `Competition edition` | `id`, `competition`, `season`, `name` |
| `Role` | `id`, `position_group`, `name`, `acronym` |
| `Player` | `id`, `first_name`, `last_name`, `short_name`, `birthday`, `gender`, **`trackable_object`** (the id linking the player to tracking frames) |
| `Team` | `id`, `name`, `coach`, `stadium`, `players` |

## Match (`GET /match/{match_id}/`)

| Field | Notes |
|---|---|
| `id` | Match id |
| `date_time` | Kickoff |
| `home_team` / `away_team` | Team refs (+ `_kit`, `_coach`) |
| `home_team_score` / `away_team_score` | |
| `home_team_playing_time` / `away_team_playing_time` | Playing-time objects |
| `home_team_side` | Which side (array) the home team attacks — needed to orient tracking |
| `competition_edition` / `competition_round` | Context |
| `stadium` | |
| `pitch_length` / `pitch_width` | Pitch dimensions (metres) — the tracking coordinate frame |
| `match_periods` | Period boundaries |
| `players` / `referees` | Participants |
| `ball` | Ball metadata |
| `status` | Match/data status |

## Tracking (`GET /match/{match_id}/tracking/`)

Returned as a **file download**, not inline JSON:

- `file_format=jsonl` — newline-delimited JSON; each line is one frame of player + ball positions in pitch coordinates. Players are keyed by their `trackable_object` id (join to `Player.trackable_object`).
- `file_format=fifa-xml` / `fifa-data` — the **FIFA EPTS** standard format (a `.xml` metadata file + a `.txt` data file). See the [FIFA EPTS standard](https://www.fifa.com/technical/football-technology/standards/epts/research-development-epts-standard-data-format).
- `data_version=3` is current.

Frame geometry (pitch dimensions, attacking side) comes from the match metadata above; the exact per-frame field layout is defined in the SkillCorner glossary / EPTS spec.

## Dynamic events (`GET /match/{match_id}/dynamic_events/...`)

Returned as **CSV files** (`file_format`, `data_version`, `period_starts`). One file per stream:

| Stream | Description |
|---|---|
| `off_ball_runs` | Off-ball runs — runs made without the ball (type, timing, target, threat) |
| `on_ball_engagements` | On-ball engagements — pressing/defensive engagements on the ball carrier |
| `passing_options` | Available passing options at each moment |
| `player_possessions` | Individual player ball-possession spells |
| `phases_of_play` | Possession phases / game state segmentation |

These are SkillCorner's **Game Intelligence** event streams; column definitions are in the glossary. The `dynamic_events_check` (skippable via `ignore_dynamic_events_check`) is a data-quality gate that can return `403 Bad data quality`.

## Game Intelligence metrics (`GET /metrics/game_intelligence/...`)

Aggregated JSON (arrays). Same families as the dynamic events but **pre-aggregated** with `group_by` (`player`/`match`/`team`/`position`/`position_group`/`season`/`competition_edition`), `order_by` and `variants`. `average_per` here is phase-restricted: `match` plus `p30tip` for in-possession families and `p30otip` for out-of-possession (the full `p90`/`p60bip`/… set belongs to `/physical/`, not GI metrics). Two families:

- **in_possession** — `off_ball_runs`, `passes`, `passing_options`, `player_possessions`
- **out_of_possession** — `on_ball_engagements`

Available globally (`/metrics/...`) and per match (`/match/{id}/metrics/...`).

## Physical (`GET /physical/`)

Aggregated physical metrics per match-player with the `{metric}_{period}_{possession}[_norm]` naming convention — see [physical-data.md](physical-data.md).

## Envelopes

List endpoints generally return a paginated envelope (`count`/`next`/`previous`/`results`) or a plain array (`/physical/`). Files (tracking, dynamic events) stream the raw file body. Error responses include `400` (bad request/format), `401` (unauthorized), `403` (bad data quality), `404`, `429` (rate limited), `500`.
