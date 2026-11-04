---
source_url: https://docs.aiontheball.nl/versions/v1/filters/frame-state/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Frame State Filter

Filter intervals by a per-frame player state column crossing a threshold.

Requires analysis data version 3 with frame_state data. The [Schema endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/schema/index.md) reports whether an analysis carries it.

```
{
  "filters": [
    {
      "type": "frame_state",
      "players": ["0-10"],
      "column": "speed_mps",
      "gte": 7.0,
      "lte": 9.0,
      "min_duration_ms": 1000
    }
  ]
}
```

Consecutive frames meeting the threshold are grouped into one interval, and intervals shorter than `min_duration_ms` are dropped.

## Parameters

| Parameter         | Type    | Required | Description                                              |
| ----------------- | ------- | -------- | -------------------------------------------------------- |
| `type`            | string  | Yes      | Must be `"frame_state"`                                  |
| `players`         | array   | Yes      | Player IDs to check, e.g. `["0-5", "1-13"]`              |
| `column`          | string  | Yes      | State column to threshold on                             |
| `gte`             | number  | No       | Minimum value, inclusive                                 |
| `lte`             | number  | No       | Maximum value, inclusive                                 |
| `min_duration_ms` | integer | No       | Minimum interval duration in milliseconds. Default `500` |

## Available Columns

| Column               | Type      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timestamp`          | `int32`   | Milliseconds from video start; join key. Same format as tracking.parquet (= frame / fps * 1000).                                                                                                                                                                                                                                                                                                                                                                     |
| `player_id`          | `str`     | Identity-resolved 'team-jersey' id; join key.                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `speed_mps`          | `float32` | Smoothed speed in m/s, positions de-jittered (lone outliers replaced by the 5-frame median, pieces split at jumps over 0.5 m/frame), low-passed at 1 Hz, then differentiated over one contiguous piece of one tracker track: never across two tracks sharing a player_id, a detection gap over 5 frames, or a position jump. Null above 12 m/s (no reliable measurement at this frame). Values-only definition; the column shape is pinned by data_version_external. |
| `nearest_opp_id`     | `str`     | player_id of the closest opposite-team player at this frame. Null when no opponent is on-frame.                                                                                                                                                                                                                                                                                                                                                                      |
| `nearest_opp_dist_m` | `float32` | Distance to nearest_opp_id in metres.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `nearest_tm_id`      | `str`     | player_id of the closest same-team player at this frame. Null when no teammate is on-frame.                                                                                                                                                                                                                                                                                                                                                                          |
| `nearest_tm_dist_m`  | `float32` | Distance to nearest_tm_id in metres.                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Response

```
{
  "start": 340.2,
  "end": 343.8,
  "label": "speed_mps >=7.0",
  "type": "frame_state"
}
```

| Field   | Type   | Description                    |
| ------- | ------ | ------------------------------ |
| `start` | float  | Start time in seconds          |
| `end`   | float  | End time in seconds            |
| `label` | string | Column name and threshold used |
| `type`  | string | Always `"frame_state"`         |
