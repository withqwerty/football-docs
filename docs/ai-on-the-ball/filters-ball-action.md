---
source_url: https://docs.aiontheball.nl/versions/v1/filters/ball-action/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Ball Action Filter

Legacy filter for pass, carry and shot events; on analyses with data version 3 or later the [Event Property](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md) filter reaches the same events with access to all of their metadata.

Intervals of ball action events, optionally restricted to players or teams.

```
{
  "type": "ball_action",
  "actions": ["pass", "shot"],
  "players": ["0-10"]
}
```

| Parameter | Type   | Required | Description                                                                                                                                                                                                                        |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | string | Yes      | `"ball_action"`                                                                                                                                                                                                                    |
| `actions` | array  | No       | Action types: `pass`, `carry`, `drive`, `shot`. A [`drive`](https://docs.aiontheball.nl/versions/v1/events/drive/index.md) is a carry of at least 3 m, so every `drive` row is also a `carry` row. All except `drive` when omitted |
| `players` | array  | No       | [Player IDs](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md), e.g. `["0-5", "1-13"]`                                                                                                                         |
| `teams`   | array  | No       | `team_0`, `team_1`                                                                                                                                                                                                                 |

Requires analysis version `0.5.10` or later. Earlier analyses hold no ball action events and the filter returns nothing.

When both `players` and `teams` are given, `players` takes precedence and `teams` is ignored. Filtering by team keeps events with a known team and an unidentified player, and drops events with no team attribution.

## Response fields

Ball action intervals carry the actor alongside the standard interval fields.

```
{
  "start": 125.5,
  "end": 135.5,
  "label": "shot",
  "type": "ball_action",
  "player_id": "0-10",
  "team_id": "team_0",
  "team_name": "Home Team"
}
```

| Field       | Type   | Unit | Description                                                                        |
| ----------- | ------ | ---- | ---------------------------------------------------------------------------------- |
| `start`     | float  | s    | Start time, padding included                                                       |
| `end`       | float  | s    | End time, padding included. Clamped to the video length                            |
| `label`     | string |      | Action type, one of the `actions` values. Joined with `" + "` on a merged interval |
| `type`      | string |      | Always `ball_action`                                                               |
| `player_id` | string | null |                                                                                    |
| `team_id`   | string | null |                                                                                    |
| `team_name` | string | null |                                                                                    |

With `merge_results: true` (default), events that overlap after padding become one interval. Its `label` joins their distinct labels with `" + "`, e.g. `"pass + shot"`, and it carries the `player_id`, `team_id` and `team_name` of the first of them. Set `merge_results: false` to keep one interval per event with its own attribution.

## Player Pixel Coordinates

`include_pixel_coords: true` adds the actor's position in the video frame to each interval, sampled at 4 FPS. Combine it with `merge_results: false` to keep the samples tied to a single event. A merged interval follows the player of its first event.

The samples follow the player only while the tracking stays continuous around the event. They stop where the player leaves the camera view, or where the tracking jumps to another person. They can therefore start after the interval `start` and end before its `end`. When the player is not tracked at the event, or `player_id` is unknown, the samples hold the player's position at the event for 0.5 s either side of it.

```
{
  "start": 125.5,
  "end": 135.5,
  "label": "shot",
  "type": "ball_action",
  "player_id": "0-10",
  "team_id": "team_0",
  "team_name": "Home Team",
  "pixel_coords": {
    "t0": 125.5,
    "dt": 0.25,
    "x": [0.4521, 0.4535, 0.4562],
    "y": [0.6234, 0.6198, 0.6145]
  }
}
```

| Field             | Type   | Unit | Description                                                |
| ----------------- | ------ | ---- | ---------------------------------------------------------- |
| `pixel_coords`    | object | null |                                                            |
| `pixel_coords.t0` | float  | s    | Time of the first sample, at or after the interval `start` |
| `pixel_coords.dt` | float  | s    | Time between samples, `0.25` at 4 FPS                      |
| `pixel_coords.x`  | array  |      | Normalised x per sample, 0-1, left to right                |
| `pixel_coords.y`  | array  |      | Normalised y per sample, 0-1, top to bottom                |

Coordinates are relative to the video frame with the origin at its top-left corner, and mark the bottom centre of the player's bounding box. Multiply by the video dimensions for pixels: `pixel_x = x * video_width`. Sample `i` is at time `t0 + i * dt`.
