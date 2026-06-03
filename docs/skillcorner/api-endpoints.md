---
source_url: https://skillcorner.com/api/docs/
source_type: crawled
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner API Endpoints

52 `GET` endpoints under base `https://skillcorner.com/api`. All require auth (Basic or `?token=`; see [api-access.md](api-access.md)). Paths below are relative to `/api`.

## Master data

| Endpoint | Returns |
|---|---|
| `GET /competitions/` | Competitions |
| `GET /competitions/{competition_id}/editions/` | Editions of a competition |
| `GET /competitions/{competition_id}/rounds/` | Rounds of a competition |
| `GET /competition_editions/` | Competition editions (`{id, competition, season, name}`) |
| `GET /seasons/` | Seasons (`{id, start_year, end_year, name}`) |
| `GET /teams/` · `GET /teams/{team_id}/` | Teams (`{id, name, coach, stadium, players}`) |
| `GET /players/` · `GET /players/{player_id}/` | Players (`{id, first_name, last_name, short_name, birthday, trackable_object, gender}`) |
| `GET /roles/` | Player roles (`{id, position_group, name, acronym}`) |
| `GET /matches/` | Matches (rich filters incl. per-product `*_last_modified__gte`) |
| `GET /matches/custom/` | Customer-specific match list |
| `GET /data_collections/` · `GET /data_collections/custom/` | Which data products exist per match |

## Match metadata & tracking

| Endpoint | Returns |
|---|---|
| `GET /match/{match_id}/` | Match metadata (teams, score, lineups, `pitch_length`/`pitch_width`, `home_team_side`, periods, referees) |
| `GET /match/{match_id}/data_collection/` | Data products available for the match |
| `GET /match/{match_id}/tracking/` | **Tracking file** (`file_format` ∈ jsonl/fifa-xml/fifa-data; `data_version=3`) |

## Dynamic events (per match, CSV downloads)

`file_format`, `data_version`, `period_starts`, `ignore_dynamic_events_check`.

| Endpoint | Event stream |
|---|---|
| `GET /match/{match_id}/dynamic_events/` | All dynamic events |
| `GET /match/{match_id}/dynamic_events/off_ball_runs/` | Off-ball runs |
| `GET /match/{match_id}/dynamic_events/on_ball_engagements/` | On-ball engagements (pressures/defensive actions) |
| `GET /match/{match_id}/dynamic_events/passing_options/` | Passing options |
| `GET /match/{match_id}/dynamic_events/phases_of_play/` | Phases of play |
| `GET /match/{match_id}/dynamic_events/player_possessions/` | Player possessions |

## Game Intelligence metrics (aggregated JSON)

Aggregated with `group_by`, `average_per`, `order_by`, `variants`, plus the standard entity/date/age filters. Available globally and per-match.

| Endpoint | Metric set |
|---|---|
| `GET /metrics/game_intelligence/in_possession/off_ball_runs/` | Off-ball run metrics |
| `GET /metrics/game_intelligence/in_possession/passes/` | Passing metrics |
| `GET /metrics/game_intelligence/in_possession/passing_options/` | Passing-option metrics |
| `GET /metrics/game_intelligence/in_possession/player_possessions/` | Player-possession metrics |
| `GET /metrics/game_intelligence/out_of_possession/on_ball_engagements/` | On-ball-engagement metrics |
| `GET /match/{match_id}/metrics/game_intelligence/in_possession/off_ball_runs/` | …per match (off_ball_runs) |
| `GET /match/{match_id}/metrics/game_intelligence/in_possession/passes/` | …per match (passes) |
| `GET /match/{match_id}/metrics/game_intelligence/in_possession/passing_options/` | …per match (passing_options) |
| `GET /match/{match_id}/metrics/game_intelligence/in_possession/player_possessions/` | …per match (player_possessions) |
| `GET /match/{match_id}/metrics/game_intelligence/out_of_possession/on_ball_engagements/` | …per match (on_ball_engagements) |

## Physical data

| Endpoint | Returns |
|---|---|
| `GET /physical/` | Aggregated physical metrics (see [physical-data.md](physical-data.md)) |
| `GET /match/{match_id}/custom/physical/` | Customer physical feed for a match |

## Custom (per-match, customer-specific)

`GET /match/{match_id}/custom/` and beneath it: `data_collection/`, `tracking/`, `physical/`, `in_possession/{off_ball_runs,on_ball_pressures,passes}/`, `out_of_possession/`, and `dynamic_events/{off_ball_runs,on_ball_engagements,passing_options,phases_of_play,player_possessions}/`.

## Deprecated (Game Intelligence V1)

`GET /beta/out_of_possession/`, `GET /in_possession/off_ball_runs/`, `GET /in_possession/on_ball_pressures/`, `GET /in_possession/passes/` — superseded by the V2 `dynamic_events` / `metrics/game_intelligence` endpoints above.
