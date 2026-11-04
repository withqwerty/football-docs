---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/player-report/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Player Report

Match report for one player: coverage, physical output, positioning, on-ball actions and interactions with other players.

## Request

```
GET /analyses/{id}/player-report/{player_id}
```

| Parameter   | Type    | Required | Description                                                                                              |
| ----------- | ------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `id`        | integer | Yes      | Analysis ID                                                                                              |
| `player_id` | string  | Yes      | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md), e.g. `0-10` or `1-GK` |

`404` when the player was never detected, when the id is not `<team>-<jersey>`, or when the team is not `0` or `1`:

```
{ "detail": "No report data for player 0-7" }
```

[Summary](https://docs.aiontheball.nl/versions/v1/endpoints/summary/index.md) and [Team Report](https://docs.aiontheball.nl/versions/v1/endpoints/team-report/index.md) list the players an analysis has.

The first request computes the report and caches it server-side; later requests are fast. The response is deterministic per `(analysis_id, player_id, schema_version)`, except that confirming sides after the analysis finished can change `orientation_source` and the coordinates. Refresh a client-side cache when sides are confirmed. Measured detection coverage and `interactions.link_up` need engine version 0.5.44 or later; older analyses return the fallbacks described per field.

## Response

```
{
  "schema_version": 5,
  "engine_version": "0.5.44",
  "player_id": "0-10",
  "team": 0,
  "jersey": 10,
  "label": "10",
  "role": "player",
  "coordinate_frame": "attacking",
  "orientation_source": "game_meta",

  "params": {
    "sample_interval_ms": 40,
    "sprint_min_kmh": 25.2,
    "sprint_exit_kmh": 19.8,
    "sprint_min_s": 1.0,
    "top_speed_percentile": 0.99,
    "top_speed_ceiling_kmh": 36.0,
    "reliable_seconds_floor": 600.0,
    "est_seconds_floor": 300.0,
    "sprint_m_per_high_speed_m": 0.39,
    "sprints_per_high_speed_m": 0.019,
    "hull_central_fraction": 0.8,
    "max_sample_gap_ms": 400,
    "sequence_gap_ms": 5000,
    "sequence_shot_slack_ms": 1000,
    "drive_min_length_m": 3.0,
    "take_on_max_opp_dist_m": 1.5,
    "pitch": { "length_m": 105.0, "width_m": 68.0 }
  },

  "coverage": {
    "seconds_detected": 4980.4,
    "seconds_projected": 512.0,
    "seconds_in_halves": 5490.0,
    "overlap_share": 0.081,
    "first_ms": 40,
    "last_ms": 5687240,
    "reliable": true,
    "source": "coverage_artifact"
  },

  "card": {
    "hero_crop_index": 0,
    "kit": {
      "primary": "red",
      "primary_rgb": [200, 16, 46],
      "secondary": "white",
      "secondary_rgb": [255, 255, 255],
      "pattern": "solid"
    }
  },

  "physical": {
    "source": "engine",
    "distance_m": 10542.5,
    "distance_per_min": 127.0,
    "distance_per90_m": 11430.0,
    "distance_m_est": 11630.0,
    "minutes_measured": 83.0,
    "minutes_covered": 91.5,
    "top_speed_kmh": 26.81,
    "speed_zones": [
      { "name": "walking",        "min_kmh": 0.0,  "max_kmh": 7.0,  "seconds": 2922.6, "distance_m": 3110.9 },
      { "name": "jogging",        "min_kmh": 7.0,  "max_kmh": 14.0, "seconds": 1425.3, "distance_m": 4038.0 },
      { "name": "running",        "min_kmh": 14.0, "max_kmh": 21.0, "seconds": 452.1,  "distance_m": 2172.8 },
      { "name": "high_intensity", "min_kmh": 21.0, "max_kmh": 25.2, "seconds": 110.3,  "distance_m": 704.8 },
      { "name": "sprinting",      "min_kmh": 25.2, "max_kmh": null, "seconds": 70.1,   "distance_m": 516.0 }
    ],
    "distance_bands": [
      { "name": "walking",    "min_kmh": 0.0,  "max_kmh": 7.0,  "distance_m": 3110.9, "distance_per_min": 37.5, "distance_m_est": 3430.0 },
      { "name": "jogging",    "min_kmh": 7.0,  "max_kmh": 14.0, "distance_m": 4038.0, "distance_per_min": 48.6, "distance_m_est": 4450.0 },
      { "name": "running",    "min_kmh": 14.0, "max_kmh": 21.0, "distance_m": 2172.8, "distance_per_min": 26.2, "distance_m_est": 2400.0 },
      { "name": "high_speed", "min_kmh": 21.0, "max_kmh": null, "distance_m": 1220.8, "distance_per_min": 14.7, "distance_m_est": 1350.0 }
    ],
    "distance_per_bucket": [
      { "start_min": 0,  "end_min": 15,  "distance_m": 1822.1 },
      { "start_min": 15, "end_min": 30,  "distance_m": 1749.5 },
      { "start_min": 30, "end_min": 45,  "distance_m": 1669.4 },
      { "start_min": 45, "end_min": 60,  "distance_m": 1744.2 },
      { "star
... (example cut here; 9 KB in the source page)
```

## Top level

| Field                | Type    | Description                                                                                                                                              |
| -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema_version`     | integer | Version of this response shape. See [Schema version](#schema-version)                                                                                    |
| `engine_version`     | string  | Pipeline version the analysis was produced with                                                                                                          |
| `player_id`          | string  | Requested [player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md)                                                              |
| `team`               | integer | `0` or `1`, the shirt-cluster label. Resolve to home/away via [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) |
| `jersey`             | int     | null                                                                                                                                                     |
| `label`              | string  | Id suffix, e.g. `"10"` or `"GK"`                                                                                                                         |
| `role`               | string  | `goalkeeper` or `player`                                                                                                                                 |
| `coordinate_frame`   | string  | `attacking`, `attacking_first_half` or `camera`. See [Coordinates](#coordinates)                                                                         |
| `orientation_source` | string  | null                                                                                                                                                     |

## params

Thresholds the report was computed with. Read zone edges, bucket widths and the reliability floor from here rather than hardcoding them.

| Field                       | Type    | Unit | Description                                                                                                                                                                                                                             |
| --------------------------- | ------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sample_interval_ms`        | integer | ms   | Time one detected sample represents (40 at 25 FPS)                                                                                                                                                                                      |
| `sprint_min_kmh`            | float   | km/h | Speed a run must reach to start a sprint                                                                                                                                                                                                |
| `sprint_exit_kmh`           | float   | km/h | Speed below which a sprint ends                                                                                                                                                                                                         |
| `sprint_min_s`              | float   | s    | Minimum sprint length, from reaching `sprint_min_kmh` to dropping below `sprint_exit_kmh`                                                                                                                                               |
| `top_speed_percentile`      | float   |      | Percentile of a sprint run's samples reported as its `sprints[].peak_kmh`. `physical.top_speed_kmh` uses a rolling-mean peak, not this                                                                                                  |
| `top_speed_ceiling_kmh`     | float   | km/h | Samples faster than this are dropped from `physical.top_speed_kmh` as tracking artifacts (an identity swap or calibration jump, not running). Dropped from every physical number: top speed, distance, zones, measured time and sprints |
| `reliable_seconds_floor`    | float   | s    | Detected time required for `coverage.reliable`                                                                                                                                                                                          |
| `est_seconds_floor`         | float   | s    | Measured time (`minutes_measured` times 60) required before `distance_per_min` and the `*_est` distances are produced; below it they are null                                                                                           |
| `sprint_m_per_high_speed_m` | float   |      | Sprint metres per metre of the `high_speed` band's `distance_m_est`; the factor behind `physical.sprint_distance_m_est`. Depends on the analysis' footage class (broadcast or non-broadcast)                                            |
| `sprints_per_high_speed_m`  | float   |      | Sprints per metre of the `high_speed` band's `distance_m_est`; the factor behind `physical.sprints_est`. Depends on the analysis' footage class (broadcast or non-broadcast)                                                            |
| `hull_central_fraction`     | float   |      | Fraction of positions kept when building `position.zone_hull`                                                                                                                                                                           |
| `max_sample_gap_ms`         | integer | ms   | A larger gap between samples is a detection break, not play                                                                                                                                                                             |
| `sequence_gap_ms`           | integer | ms   | Maximum gap between two possessions in one `on_ball.best_sequence`                                                                                                                                                                      |
| `sequence_shot_slack_ms`    | integer | ms   | Maximum time a possession may close after a shot and still precede it in `on_ball.best_sequence`                                                                                                                                        |
| `drive_min_length_m`        | float   | m    | Minimum straight-line length of a carry listed in `on_ball.drives`                                                                                                                                                                      |
| `take_on_max_opp_dist_m`    | float   | m    | Distance to the nearest opponent at or below which a drive is flagged `take_on`                                                                                                                                                         |
| `pitch`                     | object  | m    | `{length_m, width_m}` of the pitch model                                                                                                                                                                                                |

## coverage

How much of the match the player was observed for. Every other section is computed over detected time only.

| Field               | Type    | Unit | Description                                                                                                                               |
| ------------------- | ------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `seconds_detected`  | float   | s    | Time the player was seen on camera                                                                                                        |
| `seconds_projected` | float   | s    | Additional time the position was estimated while off camera. `0.0` when the analysis carries no projection                                |
| `seconds_in_halves` | float   | null | s                                                                                                                                         |
| `overlap_share`     | float   | null |                                                                                                                                           |
| `first_ms`          | int     | null | ms                                                                                                                                        |
| `last_ms`           | int     | null | ms                                                                                                                                        |
| `reliable`          | boolean |      | `seconds_detected >= params.reliable_seconds_floor`. **False means grey the stats out.**                                                  |
| `source`            | string  |      | `coverage_artifact` (measured) or `tracking_fallback` (counted from detected tracking rows, on analyses without the coverage measurement) |

Warning

Physical totals are sums over detected time. A substitute or a player far from the camera has a lower `distance_m` for that reason alone. Show `seconds_detected` next to any total.

## card

| Field             | Type   | Description |
| ----------------- | ------ | ----------- |
| `hero_crop_index` | int    | null        |
| `kit`             | object | null        |

### Kit object

| Field           | Type            | Description                                                                                                                                   |
| --------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `primary`       | string          | Primary shirt colour name, from the same palette as [Preview Teams](https://docs.aiontheball.nl/versions/v1/endpoints/preview-teams/index.md) |
| `primary_rgb`   | [int, int, int] | null                                                                                                                                          |
| `secondary`     | string          | null                                                                                                                                          |
| `secondary_rgb` | [int, int, int] | null                                                                                                                                          |
| `pattern`       | string          | null                                                                                                                                          |

## physical

Measured distance and speed use detected samples only. Distance is `sum(speed) * sample_interval`, so a detection gap contributes nothing. The rate and estimate project the measured distance over the minutes the player is accounted for; see [Speed & Distance](https://docs.aiontheball.nl/versions/v1/concepts/speed-distance/index.md).

| Field                   | Type   | Unit | Description                                                                                                                                                                                                                                                                                                           |
| ----------------------- | ------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `source`                | string |      | `engine` (pipeline `frame_state` speed) or `tracking_fallback` (a smoother over tracking positions, on analyses without `frame_state`; treat as indicative). Independent of `coverage.source`                                                                                                                         |
| `distance_m`            | float  | m    | Total distance, detected samples only. A lower bound. See `distance_m_est` for the projected estimate                                                                                                                                                                                                                 |
| `distance_per_min`      | float  | null | m                                                                                                                                                                                                                                                                                                                     |
| `distance_per90_m`      | float  | null | m                                                                                                                                                                                                                                                                                                                     |
| `distance_m_est`        | float  | null | m                                                                                                                                                                                                                                                                                                                     |
| `minutes_measured`      | float  | min  | Minutes a speed was measured (the denominator of `distance_per_min`). Lower than `minutes_covered`                                                                                                                                                                                                                    |
| `minutes_covered`       | float  | min  | Minutes the player is accounted for inside the match halves: `coverage.seconds_in_halves` in minutes, or `coverage.seconds_detected` plus `coverage.seconds_projected` when the analysis has no detected halves. The window `distance_m_est` and the other estimates project over. `0.0` when the run has no coverage |
| `top_speed_kmh`         | float  | km/h | Peak speed, the highest 1-second rolling mean over contiguous measured windows rather than a single-sample maximum. Samples above `params.top_speed_ceiling_kmh` are dropped first as tracking artifacts. Lower than the fastest `sprints[].peak_kmh`. `0.0` when no speed data exists                                |
| `speed_zones`           | array  |      | Measured time and distance, always 5 entries, low to high                                                                                                                                                                                                                                                             |
| `distance_bands`        | array  |      | The 5 zones merged to 4 bands with per-minute rate and estimate                                                                                                                                                                                                                                                       |
| `distance_per_bucket`   | array  |      | Distance per 15-minute bucket, contiguous from minute 0, gaps as `0.0`. `[]` when no speed data exists                                                                                                                                                                                                                |
| `sprints`               | array  |      | Runs that reach `params.sprint_min_kmh` and last at least `params.sprint_min_s` before dropping below `params.sprint_exit_kmh`. `[]` when none qualify                                                                                                                                                                |
| `sprint_distance_m`     | float  | m    | Distance covered inside `sprints`, the sum of their `distance_m`. `0.0` when there are none. Use this next to the sprint count, not the `sprinting` speed zone                                                                                                                                                        |
| `sprint_distance_m_est` | float  | null | m                                                                                                                                                                                                                                                                                                                     |
| `sprints_est`           | int    | null |                                                                                                                                                                                                                                                                                                                       |
| `physical_withheld`     | string | null |                                                                                                                                                                                                                                                                                                                       |

### Speed zone object

Measured, detected samples only.

| Field        | Type   | Unit | Description                                                    |
| ------------ | ------ | ---- | -------------------------------------------------------------- |
| `name`       | string |      | `walking`, `jogging`, `running`, `high_intensity`, `sprinting` |
| `min_kmh`    | float  | km/h | Lower bound, inclusive                                         |
| `max_kmh`    | float  | null | km/h                                                           |
| `seconds`    | float  | s    | Time in the zone                                               |
| `distance_m` | float  | m    | Distance in the zone, detected samples only                    |

The zones partition the speed series: `distance_m` over the five zones sums to `physical.distance_m`, and `seconds` sums to `coverage.seconds_detected` minus samples without a speed reading.

### Distance band object

The five speed zones merged to four bands, `high_intensity` and `sprinting` combined into one `high_speed` band. `distance_m` is measured; the rate and estimate carry the projection.

| Field              | Type   | Unit | Description                                   |
| ------------------ | ------ | ---- | --------------------------------------------- |
| `name`             | string |      | `walking`, `jogging`, `running`, `high_speed` |
| `min_kmh`          | float  | km/h | Lower bound, inclusive                        |
| `max_kmh`          | float  | null | km/h                                          |
| `distance_m`       | float  | m    | Distance in the band, detected samples only   |
| `distance_per_min` | float  | null | m                                             |
| `distance_m_est`   | float  | null | m                                             |

### Fatigue bucket object

| Field        | Type    | Unit | Description                |
| ------------ | ------- | ---- | -------------------------- |
| `start_min`  | integer | min  | Bucket start               |
| `end_min`    | integer | min  | Bucket end                 |
| `distance_m` | float   | m    | Distance inside the bucket |

### Sprint object

| Field        | Type    | Unit | Description                              |
| ------------ | ------- | ---- | ---------------------------------------- |
| `t0_ms`      | integer | ms   | Start                                    |
| `t1_ms`      | integer | ms   | End                                      |
| `start`      | {x, y}  | null | m                                        |
| `end`        | {x, y}  | null | m                                        |
| `peak_kmh`   | float   | km/h | Fastest speed in the run                 |
| `distance_m` | float   | m    | Distance covered from `t0_ms` to `t1_ms` |

## position

| Field                   | Type     | Description                                                                                                                                                        |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `heatmap`               | Grid     | Position over all detected frames. All-zero when there are none                                                                                                    |
| `heatmap_with_ball`     | Grid     | null                                                                                                                                                               |
| `avg_position`          | array    | Mean position per half. `[]` when there are no frames                                                                                                              |
| `zone_hull`             | [{x, y}] | Convex hull of the central `params.hull_central_fraction` of positions, as an ordered polygon in metres. `[]` or fewer than 3 points when there is too little data |
| `third_timeline`        | array    | Pitch third the player spent most of each minute in. Minutes without detections are omitted                                                                        |
| `ball_relative_heatmap` | Grid     | null                                                                                                                                                               |

### Average position object

| Field      | Type    | Unit | Description                                                                                                     |
| ---------- | ------- | ---- | --------------------------------------------------------------------------------------------------------------- |
| `period`   | integer |      | `1` or `2`. A single `period: 1` entry covers the whole match when `coordinate_frame` is `attacking_first_half` |
| `position` | {x, y}  | m    | Mean position over the period                                                                                   |
| `n_frames` | integer |      | Frames behind the mean                                                                                          |

### Third timeline object

| Field    | Type    | Description                                                                        |
| -------- | ------- | ---------------------------------------------------------------------------------- |
| `minute` | integer | Match minute, from 0                                                               |
| `third`  | string  | `defensive`, `middle` or `attacking`, relative to the player's attacking direction |

## on_ball

Actions where this player was the identified actor. Arrays are sorted by time and `[]` when nothing was detected. Every action row carries `t_ms` and the `event_id` of the underlying event.

| Field           | Type    | Description                                                                                                                                                                                                                                                                                                               |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `passes`        | array   | Pass objects                                                                                                                                                                                                                                                                                                              |
| `shots`         | array   | Shot objects                                                                                                                                                                                                                                                                                                              |
| `carries`       | array   | Carry objects                                                                                                                                                                                                                                                                                                             |
| `drives`        | array   | Drive objects: the carries of at least `params.drive_min_length_m`, the same rows as the [`drive`](https://docs.aiontheball.nl/versions/v1/events/drive/index.md) event. Each is also listed in `carries`                                                                                                                 |
| `network`       | array   | `{player_id, n}` pass counts per receiver, most first. The receiver is the next player on the ball: on broadcast footage the right player for about 7 in 10 passes and the right team for 9 in 10, measured against optical tracking; about half right on other measured matches. `[]` when no receiver could be resolved |
| `touches`       | integer | Times the player had the ball. Equal to `involvement.n_spans`                                                                                                                                                                                                                                                             |
| `touch_grid`    | Grid    | 3x3 count of touches. Sums to at most `touches`; a touch positioned outside the pitch is dropped                                                                                                                                                                                                                          |
| `involvement`   | object  | Touch rate and spans                                                                                                                                                                                                                                                                                                      |
| `best_sequence` | object  | null                                                                                                                                                                                                                                                                                                                      |

### Pass object

| Field                  | Type    | Unit | Description      |
| ---------------------- | ------- | ---- | ---------------- |
| `event_id`             | string  | null |                  |
| `t_ms`                 | integer | ms   | Time of the pass |
| `x`, `y`               | float   | null | m                |
| `x_target`, `y_target` | float   | null | m                |
| `length_m`             | float   | null | m                |
| `receiver_player_id`   | string  | null |                  |
| `receiver_team`        | int     | null |                  |
| `set_piece`            | string  | null |                  |
| `pass_type`            | string  | null |                  |
| `body_part`            | string  | null |                  |

Warning

`receiver_player_id` is an observation from the possession stream, not an adjudicated outcome. Do not derive a pass completion percentage from it.

### Shot object

| Field                | Type    | Unit | Description      |
| -------------------- | ------- | ---- | ---------------- |
| `event_id`           | string  | null |                  |
| `t_ms`               | integer | ms   | Time of the shot |
| `x`, `y`             | float   | null | m                |
| `distance_to_goal_m` | float   | null | m                |
| `body_part`          | string  | null |                  |

### Carry object

| Field                  | Type    | Unit | Description        |
| ---------------------- | ------- | ---- | ------------------ |
| `event_id`             | string  | null |                    |
| `t_ms`                 | integer | ms   | Start of the carry |
| `x`, `y`               | float   | null | m                  |
| `x_target`, `y_target` | float   | null | m                  |
| `length_m`             | float   | null | m                  |

### Drive object

The carry object fields, plus two flags.

| Field                  | Type    | Unit | Description                          |
| ---------------------- | ------- | ---- | ------------------------------------ |
| `event_id`             | string  | null |                                      |
| `t_ms`                 | integer | ms   | Start of the drive                   |
| `x`, `y`               | float   | null | m                                    |
| `x_target`, `y_target` | float   | null | m                                    |
| `length_m`             | float   | m    | At least `params.drive_min_length_m` |
| `progressive`          | boolean | null |                                      |
| `take_on`              | boolean | null |                                      |

### Involvement object

| Field           | Type    | Unit | Description                                                                                                      |
| --------------- | ------- | ---- | ---------------------------------------------------------------------------------------------------------------- |
| `n_spans`       | integer |      | Times the player had the ball                                                                                    |
| `spans_per_min` | float   | null |                                                                                                                  |
| `spans`         | array   |      | `{t0_ms, t1_ms}` per touch, in time order, half-open `[t0_ms, t1_ms)`. A single-frame touch has `t0_ms == t1_ms` |

### Best sequence object

| Field           | Type    | Description                                                                          |
| --------------- | ------- | ------------------------------------------------------------------------------------ |
| `spans`         | array   | `{player_id, t0_ms, t1_ms}` per touch in the move, in time order, teammates included |
| `shot_event_id` | string  | null                                                                                 |
| `shot_t_ms`     | integer | Time of the shot. `spans[0].t0_ms` to `shot_t_ms` is the clip window                 |

## interactions

Nearest-player relationships, computed per frame from the players visible on camera. Off-camera players cannot be nearest to anyone, so these numbers lean toward the camera's half of the pitch and are better compared within one match than across matches.

**Accuracy:** measured on broadcast matches against the same numbers computed from optical tracking of both teams. The top `direct_opponent` is the right player for about 5 in 6 players and the top `link_up` partner for about 2 in 3; `pressure_received.mean_m` reads about 0.3 m wide; `pressure_applied.n_possessions` counts about a quarter too many possessions, because opponents off camera cannot be the nearest. Not measured on club-camera footage.

| Field               | Type   | Description                                                                                                                 |
| ------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `pressure_received` | object | null                                                                                                                        |
| `pressure_applied`  | object | null                                                                                                                        |
| `direct_opponent`   | array  | Up to 3 `{player_id, share}`, opponents the player was nearest to most often. `[]` when there is no per-frame distance data |
| `link_up`           | array  | Up to 3 `{player_id, share}`, teammates the player was nearest to most often. `[]` before engine 0.5.44                     |

`share` is a fraction (0-1) of frames. The entries are the top of a longer distribution and do not sum to 1.

### Pressure received object

| Field      | Type    | Unit | Description                                                                                                   |
| ---------- | ------- | ---- | ------------------------------------------------------------------------------------------------------------- |
| `mean_m`   | float   | m    | Mean distance to the nearest opponent over frames where the player had the ball                               |
| `p10_m`    | float   | m    | 10th percentile of that distance                                                                              |
| `n_frames` | integer |      | Frames behind the numbers                                                                                     |
| `by_third` | array   |      | Always 3 entries `{third, mean_m, n}` for `defensive`, `middle`, `attacking`. `mean_m` is null where `n` is 0 |

### Pressure applied object

| Field           | Type    | Description                                                                          |
| --------------- | ------- | ------------------------------------------------------------------------------------ |
| `n_possessions` | integer | Opponent possessions during which this player was the ball holder's nearest opponent |
| `heatmap`       | Grid    | null                                                                                 |

## Coordinates

Coordinates are metres in `x` / `y` fields, points are `{x, y}`, polygons are lists of points, and span destinations are `x_target` / `y_target`. They are rotated so that the player's team attacks from `x = 0` towards `x = 105` in both halves. `coordinate_frame` states how far that rotation could be resolved:

| Value                  | Meaning                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attacking`            | Both halves oriented for the player's team                                                                                                                  |
| `attacking_first_half` | The first-half direction applied to the whole match because the moment the teams changed ends could not be located. Second-half coordinates are mirrored    |
| `camera`               | No attacking direction. Raw camera-frame coordinates as in [Pitch Coordinates](https://docs.aiontheball.nl/versions/v1/concepts/pitch-coordinates/index.md) |

Warning

Only `attacking` is safe to render as-is. In `camera`, thirds and `distance_to_goal_m` do not refer to the attacked goal. [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md) returns the camera frame by default; request `coordinate_frame: "attacking"` there to compare positions with this report. See [Coordinate frames](https://docs.aiontheball.nl/versions/v1/concepts/pitch-coordinates/#coordinate-frames).

## Time

Timestamps are milliseconds from video start in fields ending `_ms`. Divide by 1000 to align with the `start` / `end` seconds of [Events](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) and [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md). `event_id` is the join key to the Events response.

## Grid object

Every heatmap (`position.*`, `on_ball.touch_grid`, `interactions.pressure_applied.heatmap`) has this shape.

| Field    | Type                               | Description                                                             |
| -------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `bins`   | [int, int]                         | `[nx, ny]`                                                              |
| `extent` | \[[float, float], [float, float]\] | `[[x_min, x_max], [y_min, y_max]]` in metres                            |
| `counts` | int[nx][ny]                        | Frame counts. Row index is the x bin, column index the y bin, low first |

Bin width is `(x_max - x_min) / nx`; height is `(y_max - y_min) / ny`. Multiply a count by `params.sample_interval_ms` for dwell time.

## Schema version

`schema_version` covers the response shape and the thresholds in `params`; it is bumped when a field is added, removed or renamed, or a threshold changes. Currently `5`. Key caches on `(analysis_id, player_id, schema_version)`.

Warning

Actions are attributed only when the actor was identified, so `passes`, `shots` and `carries` are lower bounds. Present them as detected counts alongside `coverage`.
