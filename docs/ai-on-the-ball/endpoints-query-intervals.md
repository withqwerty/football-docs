---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Query Intervals

Time intervals matching a filter query, for building clip lists.

## Request

```
POST /analyses/{id}/query-intervals
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Analysis ID |

### Request Body

```
{
  "operator": "AND",
  "pad_sec": 5,
  "gap_fill_sec": 5,
  "merge_results": true,
  "preserve_labels": "ball_action",
  "include_pitch_coords": true,
  "coordinate_frame": "attacking",
  "filters": [
    { "type": "ball_action", "actions": ["pass", "shot"], "teams": ["team_0"] },
    { "type": "ball_location", "x_min": 70, "x_max": 105 }
  ],
  "existing_filters": [
    { "start": 0, "end": 600, "name": "First 10 minutes" }
  ]
}
```

| Parameter              | Type    | Default    | Description                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `operator`             | string  | `"AND"`    | How to combine `filters`: `"AND"` keeps time where every filter matches, `"OR"` time where any does                                                                                                                                                                                                  |
| `filters`              | array   | required   | Filter conditions. Required, `[]` allowed. One object per filter, each with a `type`. See [Filters](https://docs.aiontheball.nl/versions/v1/filters/index.md) for the types and their parameters                                                                                                     |
| `existing_filters`     | array   | `[]`       | Time windows to constrain results to, each `{start, end, name}` in seconds                                                                                                                                                                                                                           |
| `pad_sec`              | integer | `5`        | Seconds added before and after each interval. The start is clamped at 0                                                                                                                                                                                                                              |
| `gap_fill_sec`         | integer | `5`        | Intervals separated by less than this gap are merged                                                                                                                                                                                                                                                 |
| `merge_results`        | boolean | `true`     | Merge overlapping intervals of the same filter type, applied after padding. A merged interval keeps the actor and coordinates of its first event. `false` keeps one interval per matched event                                                                                                       |
| `preserve_labels`      | string  | `null`     | Filter type whose labels and metadata to keep when combining with `AND`. See [Preserve Labels](#preserve-labels)                                                                                                                                                                                     |
| `include_pixel_coords` | boolean | `false`    | Add normalised player positions in the video frame, sampled at 4 FPS, for filters that carry [actor fields](https://docs.aiontheball.nl/versions/v1/filters/#actor-fields). See [Player pixel coordinates](https://docs.aiontheball.nl/versions/v1/filters/ball-action/#player-pixel-coordinates)    |
| `include_pitch_coords` | boolean | `false`    | Add `x`, `y`, `x_target` and `y_target` for filters that carry [actor fields](https://docs.aiontheball.nl/versions/v1/filters/#actor-fields)                                                                                                                                                         |
| `coordinate_frame`     | string  | `"camera"` | Frame the pitch coordinates are expressed in: `"camera"` as filmed, or `"attacking"` rotated so the actor's team attacks towards +x, using the team sides the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) uses. Ignored without `include_pitch_coords` |

## Response

```
[
  {
    "start": 125.5,
    "end": 142.3,
    "label": "pass",
    "type": "ball_action",
    "player_id": "0-7",
    "team_id": "team_0",
    "team_name": "Team A",
    "x": 44.8,
    "y": 9.7,
    "x_target": 61.2,
    "y_target": 24.5,
    "coordinate_frame": "attacking"
  },
  {
    "start": 380.2,
    "end": 395.8,
    "label": "shot",
    "type": "ball_action",
    "player_id": "0-9",
    "team_id": "team_0",
    "team_name": "Team A",
    "x": 92.4,
    "y": 31.8,
    "x_target": null,
    "y_target": null,
    "coordinate_frame": "attacking"
  }
]
```

### Response Fields

| Field                  | Type   | Unit | Description                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `start`                | float  | s    | Start time from video start, padding included                                                                                                                                                                                                                                                                                        |
| `end`                  | float  | s    | End time, padding included. Clamped to the video length                                                                                                                                                                                                                                                                              |
| `label`                | string |      | Label of the matched event. When `merge_results` joins intervals of one type, their distinct labels joined with `" + "`, e.g. `"pass + shot"`. `"filter"` when several filters were combined with `AND` and `preserve_labels` was not set                                                                                            |
| `type`                 | string |      | Filter type the interval came from. `"combined"` when several filters were combined with `AND` and `preserve_labels` was not set                                                                                                                                                                                                     |
| `player_id`            | string |      | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md) of the actor. Only on rows from a filter that identifies one                                                                                                                                                                                       |
| `team_id`              | string |      | `team_0` or `team_1` of the actor, or of the credited team on `team_possession` and `goal`, or of the team asked about on `possession_change`. Only on rows from a filter that identifies one                                                                                                                                        |
| `team_name`            | string |      | Display name of that team. Present with `team_id`. May change when team identity resolves, so key on `team_id`                                                                                                                                                                                                                       |
| `x`, `y`               | float  | null | m                                                                                                                                                                                                                                                                                                                                    |
| `x_target`, `y_target` | float  | null | m                                                                                                                                                                                                                                                                                                                                    |
| `coordinate_frame`     | string |      | Frame `x`, `y`, `x_target` and `y_target` are in: `camera`, `attacking` or `attacking_first_half`. Present only when `coordinate_frame: "attacking"` was requested, and reports the frame resolved for the whole run. See [Coordinate frames](https://docs.aiontheball.nl/versions/v1/concepts/pitch-coordinates/#coordinate-frames) |

Warning

Rotation to the attacking frame is per team. A row with no `team_id`, or one outside `team_0` / `team_1`, keeps camera-frame coordinates while the row-level `coordinate_frame` still reports `attacking`. Check `team_id` before trusting a row's `x`. A run whose sides could not be resolved returns `camera` in every row.

## Preserve Labels

Combining filters with `AND` intersects their time ranges and discards the filter identity, so every interval comes back as `"label": "filter", "type": "combined"`. Setting `preserve_labels` to one of the filter types in the request keeps that filter's label, `player_id` and `team_id` on each interval.

Only one filter type can be named. With `operator: "OR"` labels are kept anyway and the parameter has no effect.
