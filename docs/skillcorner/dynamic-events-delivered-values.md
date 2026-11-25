---
source_url: https://github.com/SkillCorner/opendata/tree/4340d274572876239c154c90bc507a9b3250a656
archived_url: https://github.com/SkillCorner/opendata/tree/4340d274572876239c154c90bc507a9b3250a656
source_type: curated
upstream_version: SkillCorner/opendata 4340d27
crawled_at: 2026-11-24
---

# SkillCorner Dynamic Events: Delivered Values

## Values in the delivered CSV

Observed across the 20 `*_dynamic_events.csv` files of the [SkillCorner open data](https://github.com/SkillCorner/opendata) at commit `4340d27`. These are not part of SkillCorner's *Dynamic Events CSV Specifications* (2025/02/16), whose column definitions are in [dynamic-events.md](dynamic-events.md). Where the delivered files spell a value differently from the specification, the files use the spelling below. A `None` in the specification is an empty cell in the CSV. Empty cells also occur where the Values cell lists no `None`: 95 of the 294 specified fields are empty in some rows of the event types they apply to. For many of these the description says when the value is None, for example `in_to_out` and `n_defensive_lines`.

| Columns | Specification | Delivered CSV |
|---|---|---|
| `event_type` | `defensive_engagement` | `on_ball_engagement` |
| `game_state` | `Winning` / `Losing` / `Drawing` | `winning` / `losing` / `drawing` |
| `furthest_line_break`, `affected_line_break` | `first_line` / `second_last_line` / `last_line` | `first` / `second_last` / `last` |
| `first_line_break_type`, `second_last_line_break_type`, `last_line_break_type`, `furthest_line_break_type` | `Through` / `Around` | `through` / `around` |
| `pass_direction`, `pass_direction_received`, `trajectory_direction`, `interplayer_direction` | `sideway left` / `sideway right` | `sideway_left` / `sideway_right` |
| `pass_range`, `pass_range_received`, `interplayer_distance_range` | `short (between 0 to 15 m)` / `medium (between 15 to 30m)` / `long (over 30m)` | `short` / `medium` / `long` |
| `speed_avg_band`, `player_targeted_speed_avg_band` | `jogging (if speed_avg below 15 km/h)` / `running (if speed_avg between 15 km/h and 20km/h)` / `hsr (if speed_avg between 20 km/h and 25km/h)` / `sprinting (if speed_avg above 25 km/h)` | `jogging` / `running` / `hsr` / `sprinting` |
| `team_out_of_possession_phase_type` | not listed | `defending_direct` |
| Every column listed as `TRUE` / `FALSE`, except `xloss_player_possession_start` | `TRUE` / `FALSE` | `True` / `False` |

The specification's own ID list for `event_type_id` already uses the delivered spelling: `9 (on_ball_engagement)`.

## Types in the delivered CSV

In the SkillCorner open data at commit `4340d27`, these dynamic-events columns disagree with the type, the example or the values that the *Dynamic Events CSV Specifications* (2025/02/16) give. The Delivered CSV column starts with the type the files hold: number, bool (`True` / `False`) or text.

| Columns | Specification | Delivered CSV |
|---|---|---|
| `xloss_player_possession_start` | `float`, listed with the values `TRUE` / `FALSE` | number, a probability |
| `player_targeted_difficult_pass_target` | `float` | bool |
| `simultaneous_defensive_engagement_same_target` | `bool`, with the example value `2` | bool |
| `time_start`, `time_end` | `timestamp`, with the example `00:00:06.293` | text in the form `MM:SS.s`, for example `45:03.2`; minutes count on from 45 in the second period |

## Columns the specification does not define

At commit `4340d27` ("Refresh four matches to dynamic events v3"), the dynamic-events CSVs in the SkillCorner open data carry 28 columns that the *Dynamic Events CSV Specifications* (2025/02/16) do not define: the EPV columns (`possession_epv_*`, `pass_epv_*`, `pass_reception_epv_*`), `overall_pressure_*`, `passing_option_ease_*`, `reception_difficulty_*`, `space_constraint_*` and `time_to_impact_*`. The specification does not define the columns of the `phases_of_play` CSV either; the open-data README links a separate [Phases of Play CSV Specifications](https://26560301.fs1.hubspotusercontent-eu1.net/hubfs/26560301/Guides/Phases%20of%20Play/20250216%20-%20Phases%20of%20Play%20CSV%20Specifications.pdf) document for those.
