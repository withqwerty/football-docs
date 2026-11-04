---
source_url: https://docs.aiontheball.nl/versions/v1/filters/spatial/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Spatial Filters

Filter by where the ball is on the pitch and by how close a player is to it.

## Ball Location

Time the ball spends inside a rectangle on the pitch.

```
{
  "type": "ball_location",
  "x_min": 70,
  "x_max": 105,
  "y_min": 0,
  "y_max": 68,
  "team_side_perspective": "team_0"
}
```

| Parameter               | Type   | Required | Description                                                                        |
| ----------------------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| `type`                  | string | Yes      | `"ball_location"`                                                                  |
| `x_min`                 | float  | No       | Zone edge along the pitch length, in metres. Default `0`. Above -5 and below 110   |
| `x_max`                 | float  | No       | Zone edge along the pitch length, in metres. Default `105`. Above -5 and below 110 |
| `y_min`                 | float  | No       | Zone edge across the pitch width, in metres. Default `0`. Above -5 and below 75    |
| `y_max`                 | float  | No       | Zone edge across the pitch width, in metres. Default `68`. Above -5 and below 75   |
| `team_side_perspective` | string | null     | No                                                                                 |

Both bounds are inclusive. Coordinates are metres from the pitch corner, `0-105` along the length by `0-68` across, in the camera frame. See [Pitch Coordinates](https://docs.aiontheball.nl/versions/v1/concepts/pitch-coordinates/index.md).

The filter reads detected ball positions only, so the ball is never in the zone while it is off camera. Matching samples less than 3 seconds apart form one interval, before `pad_sec` is applied.

Warning

`team_side_perspective` has no effect on an analysis whose attacking directions could not be resolved, the runs that report `coordinate_frame: "camera"`. The zone is evaluated as given rather than mirrored against a guessed side.

### Common zones

| Zone               | `x_min` | `x_max` | `y_min` | `y_max` |
| ------------------ | ------- | ------- | ------- | ------- |
| Left third         | 0       | 35      | 0       | 68      |
| Middle third       | 35      | 70      | 0       | 68      |
| Right third        | 70      | 105     | 0       | 68      |
| Left penalty area  | 0       | 16.5    | 13.85   | 54.15   |
| Right penalty area | 88.5    | 105     | 13.85   | 54.15   |
| Left 6-yard box    | 0       | 5.5     | 24.85   | 43.15   |
| Right 6-yard box   | 99.5    | 105     | 24.85   | 43.15   |
| Centre circle      | 42.5    | 62.5    | 24.15   | 43.85   |
| Left wing          | 0       | 105     | 0       | 15      |
| Right wing         | 0       | 105     | 53      | 68      |

## Player Ball Proximity

Time one of the listed players is within a distance of the ball.

```
{
  "type": "player_ball_proximity",
  "players": ["0-10", "0-7"],
  "threshold": 5
}
```

| Parameter   | Type   | Required | Description                                                                                                                      |
| ----------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `type`      | string | Yes      | `"player_ball_proximity"`                                                                                                        |
| `players`   | array  | Yes      | [Player IDs](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md), e.g. `["0-10", "1-7"]`. Goalkeepers included |
| `threshold` | float  | No       | Distance in metres. Default `5`. Above 0.1 and below 100                                                                         |

The listed players combine as OR: an interval is returned whenever any of them is within `threshold`, and each interval is labelled with that player's id. Two players near the ball at once produce two overlapping intervals. A distance equal to `threshold` matches.

Distances use detected positions only, with a player position matched to a ball sample at most 0.5 seconds older. A player off camera is never near the ball. Matching samples less than 3 seconds apart form one interval, before `pad_sec` is applied.

This filter tests distance alone. [Player Possession](https://docs.aiontheball.nl/versions/v1/filters/temporal/#player-possession) tests identified control of the ball.
