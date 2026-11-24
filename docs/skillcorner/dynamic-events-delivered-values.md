---
source_url: https://github.com/SkillCorner/opendata/tree/4340d274572876239c154c90bc507a9b3250a656
source_type: curated
upstream_version: SkillCorner/opendata 4340d27
crawled_at: 2026-11-24
---

# SkillCorner Dynamic Events: Delivered Values

## Values in the delivered CSV

Observed in every `*_dynamic_events.csv` of the [SkillCorner open data](https://github.com/SkillCorner/opendata) at commit `4340d27` (20 matches). These are not part of SkillCorner's *Dynamic Events CSV Specifications* (2025/02/16), whose column definitions are in [dynamic-events.md](dynamic-events.md). Where the delivered files spell a value differently from the specification, the files use the spelling below. A `None` in the specification is an empty cell in the CSV.

| Columns | Specification | Delivered CSV |
|---|---|---|
| `event_type` | `defensive_engagement` | `on_ball_engagement` |
| `game_state` | `Winning` / `Losing` / `Drawing` | `winning` / `losing` / `drawing` |
| `furthest_line_break`, `affected_line_break` | `first_line` / `second_last_line` / `last_line` | `first` / `second_last` / `last` |
| `first_line_break_type`, `second_last_line_break_type`, `last_line_break_type`, `furthest_line_break_type` | `Through` / `Around` | `through` / `around` |
| `pass_direction`, `pass_direction_received`, `trajectory_direction`, `interplayer_direction` | `sideway left` / `sideway right` | `sideway_left` / `sideway_right` |
| `pass_range`, `pass_range_received`, `interplayer_distance_range` | `short (between 0 to 15 m)` / `medium (between 15 to 30m)` / `long (over 30m)` | `short` / `medium` / `long` |
| `speed_avg_band`, `player_targeted_speed_avg_band` | `jogging (if speed_avg below 15 km/h)` / `running (if speed_avg between 15 km/h and 20km/h)` / `hsr (if speed_avg between 20 km/h and 25km/h)` / `sprinting (if speed_avg above 25 km/h)` | `jogging` / `running` / `hsr` / `sprinting` |
| `team_out_of_possession_phase_type` | not listed (team_out_of_possession_phase_type_id lists 15 (defending_direct)) | `defending_direct` |
| Every column listed as `TRUE` / `FALSE`, except `xloss_player_possession_start` | `TRUE` / `FALSE` | `True` / `False` |

## Types in the delivered CSV

In the SkillCorner open data at commit `4340d27`, two dynamic-events columns hold a different type from the one the *Dynamic Events CSV Specifications* (2025/02/16) give:

- `xloss_player_possession_start` is listed with the values `TRUE` / `FALSE`, but the CSV holds numbers (a probability).
- `player_targeted_difficult_pass_target` is typed `float`, but the CSV holds `True` / `False`.
