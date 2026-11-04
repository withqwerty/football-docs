---
source_url: https://docs.aiontheball.nl/versions/v1/filters/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Filters Overview

Filters select the moments a [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md) request returns as time intervals.

## Available filters

| Filter                                                                                          | Type value                                                                 | Description                                                                                                     |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [Event Property](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md)       | `event_property`                                                           | Event metadata: event type, set piece, body part, length                                                        |
| [Frame State](https://docs.aiontheball.nl/versions/v1/filters/frame-state/index.md)             | `frame_state`                                                              | Per-frame player state: speed, pressing distance                                                                |
| [Spatial](https://docs.aiontheball.nl/versions/v1/filters/spatial/index.md)                     | `ball_location`, `player_ball_proximity`                                   | Ball position on the pitch, player distance to the ball                                                         |
| [Temporal & State](https://docs.aiontheball.nl/versions/v1/filters/temporal/index.md)           | `match_timeline`, `scene`, `team_possession`, `player_possession`          | Match period, analysable footage, possession                                                                    |
| [Ball Action](https://docs.aiontheball.nl/versions/v1/filters/ball-action/index.md)             | `ball_action`                                                              | Passes, carries and shots (legacy)                                                                              |
| [Derived Pass & Carry](https://docs.aiontheball.nl/versions/v1/filters/derived-carry/index.md)  | `progressive_carry`, `take_on_candidate`, `progressive_pass`, `zone_entry` | Carries and passes progressed toward goal, carries that engaged a defender, entries into the final third or box |
| [Possession Change](https://docs.aiontheball.nl/versions/v1/filters/possession-change/index.md) | `possession_change`                                                        | Moments a team won or lost the ball                                                                             |

## Filter object

Each entry in `filters` is an object with a `type` and the parameters of that type.

```
{
  "type": "ball_location",
  "x_min": 70,
  "x_max": 105
}
```

## Combining filters

`operator` decides how the filters in one request combine.

| Operator        | Result                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `AND` (default) | The time ranges where every filter is active at the same time. Two filters of the same type are intersected, not unioned |
| `OR`            | The union of every filter's time ranges                                                                                  |

```
{
  "operator": "OR",
  "filters": [
    { "type": "player_possession", "players": ["0-10"] },
    { "type": "ball_location", "x_min": 70, "x_max": 105 }
  ]
}
```

`AND` discards which filter produced each interval and drops the actor fields. When every filter has the same `type`, results keep that `type`, and its `label` when all matched labels agree, else `"filter"`. Mixed types give `"label": "filter", "type": "combined"`. Set [`preserve_labels`](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/#preserve-labels) to one of the filter types to keep that filter's labels and actor fields.

## Padding and merging

Padding and merging run on the combined result, after the operator is applied.

`pad_sec` (default `5`) extends every interval by that many seconds at each end, clamped to 0 and to the video length. `merge_results` (default `true`) then merges intervals of the same `type` that overlap or lie within `gap_fill_sec` (default `5`) of each other. A merged interval joins the distinct labels of its events with `" + "`, e.g. `"pass + shot"`, and keeps the `player_id`, `team_id` and `team_name` of its first event. `merge_results: false` returns one interval per matched event, overlapping or not.

## Actor fields

`ball_action`, `event_property`, `player_possession`, `team_possession`, `progressive_carry`, `take_on_candidate`, `progressive_pass`, `zone_entry` and `possession_change` intervals carry `player_id`, `team_id` and `team_name`. `player_id` is null on events without a player, such as `team_possession`, `goal` and `possession_change`. The other filters do not carry these fields.

Two request options add coordinates to those intervals. `include_pixel_coords` adds the player's normalised position in the video frame at 4 FPS, described under [Player pixel coordinates](https://docs.aiontheball.nl/versions/v1/filters/ball-action/#player-pixel-coordinates). `include_pitch_coords` adds the event's pitch position in metres as `x` / `y`, and `x_target` / `y_target` for span events such as a pass or a carry. Both are documented with the rest of the request body on [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).
