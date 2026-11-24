---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/skillcorner/
source_type: crawled
upstream_version: 0.4.0
crawled_at: 2026-11-24T20:04:36.010Z
---
Load tracking data from **SkillCorner** format: v3 JSON Lines, and Tracking v4 as JSON Lines or parquet at 10 or 25 frames per second.

## Function Signature

```
from fastforward import skillcorner

dataset = skillcorner.load_tracking(
    raw_data="tracking_v4_10fps.jsonl.gz",
    meta_data="match_data.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to the tracking file: JSON Lines (gzipped or not) or parquet |
| `meta_data` | FileLike | required | Path to JSON match file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_empty_frames` | bool | `False` | Include frames with no players (censored frames included) |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `include_ball_owning_player` | bool | `True` | Add the `ball_owning_player_id` column |
| `include_is_detected` | bool | `True` | Add the `is_detected` column (long / long_ball only) |
| `include_velocity` | bool | `False` | Add `vx`, `vy`, `vz` (Tracking v4) |
| `include_acceleration` | bool | `False` | Add `ax`, `ay`, `az` (Tracking v4) |
| `include_prediction_error` | bool | `False` | Add `dist_pred_error` and `speed_pred_error` (Tracking v4, long / long_ball only) |
| `include_officials` | bool | `False` | Add the referees as rows of team `officials` and to `players` (Tracking v4) |
| `engine` | str | `"polars"` | `"polars"`, `"pyspark"`, `"arrow"`, or `"arrow[spark]"` |

All four engines are supported. For distributed compute (Spark, Ray, Dask), see [Distributed Compute](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/).

## File Format

**Tracking data**: one of SkillCorner's deliveries. The loader reads the format, the version and the frame rate from the file; there is no parameter for them.

| Delivery | File | Frame rate |
| --- | --- | --- |
| v3 | `tracking_extrapolated.jsonl` | 10 fps |
| Tracking v4, JSON Lines | `tracking_v4_10fps.jsonl`, `tracking_v4_25fps.jsonl` | 10 or 25 fps |
| Tracking v4, parquet | `tracking_v4_10fps.parquet`, `tracking_v4_25fps.parquet` | 10 or 25 fps |

`dataset.metadata["version"]` is `"3"` or `"4"` and `dataset.metadata["fps"]` reports the measured rate. SkillCorner numbers the period frame bounds in the match file at 10 fps; for a 25 fps file `dataset.periods` carries them rescaled onto the file's own frame ids, so they match `frame_id` in the tracking table.

**Metadata** (JSON): the match file (`match_data.json`). Contains match info, teams, players and periods.

## Example

```
from fastforward import skillcorner

dataset = skillcorner.load_tracking(
    raw_data="tracking_v4_25fps.parquet",
    meta_data="match_data.json",
    include_velocity=True,
    include_prediction_error=True,
)

print(dataset.metadata["version"][0])   # "4"
print(dataset.metadata["fps"][0])       # 25.0
print(dataset.tracking.columns)
```

## Ball-Owning Player

SkillCorner exports include the player in possession on each frame. With `include_ball_owning_player=True`, an extra column is attached:

| Column | Type | Description |
| --- | --- | --- |
| `ball_owning_player_id` | Utf8 | Player id in possession; null when not recorded or attributed to a non-roster entity (e.g. referee) |

Values match `dataset.players["player_id"]`. Set `include_ball_owning_player=False` to exclude this column.

## Detection Flag

With `include_is_detected=True`, every player row gets a boolean flag:

| Column | Type | Description |
| --- | --- | --- |
| `is_detected` | Bool | True = camera-detected, False = extrapolated |

In long layout the ball row carries the ball's own flag, which both v3 and v4 files deliver. The flag is only added for the `long` and `long_ball` layouts; `wide` is not supported.

## Velocity and Acceleration (Tracking v4)

Tracking v4 delivers a velocity and an acceleration for the ball and every player on each frame. `include_velocity=True` adds `vx`, `vy`, `vz` and `include_acceleration=True` adds `ax`, `ay`, `az`, placed next to the entity's `x`, `y`, `z`:

| Layout | Ball | Players |
| --- | --- | --- |
| `long` | `vx`, `vy`, `vz` on the ball row | `vx`, `vy`, `vz` on each player row |
| `long_ball` | `ball_vx`, `ball_vy`, `ball_vz` | `vx`, `vy`, `vz` |
| `wide` | `ball_vx`, `ball_vy`, `ball_vz` | `<player_id>_vx`, `<player_id>_vy`, `<player_id>_vz` |

Acceleration follows the same naming with `a`. Players have no vertical component, so their `vz` and `az` are 0, as their `z` is. SkillCorner computes the speed over a 0.2 s window and the acceleration over a 0.8 s window.

The values follow the orientation and the coordinate system you ask for: a flipped half negates `vx` and `vy` with `x` and `y`, and a coordinate system that scales or mirrors an axis does the same to the velocity, so `vx` stays the rate of change of `x`. With the default `coordinates="cdf"` they are metres per second and metres per second squared. `dataset.transform()` moves them the same way, including the local scale of a pitch-dimension change.

On a v3 file the columns are present and null.

## Predicted Errors (Tracking v4)

Every ball and player position in Tracking v4 comes with SkillCorner's estimate of its own error. `include_prediction_error=True` adds them to the `long` and `long_ball` layouts:

| Column | Type | Description |
| --- | --- | --- |
| `dist_pred_error` | Float32 | Expected distance in metres between the delivered and the true position |
| `speed_pred_error` | Float32 | Expected absolute difference in m/s between the delivered and the true speed |

In `long_ball`, which has no ball row, the ball's come as `ball_dist_pred_error` and `ball_speed_pred_error`. Both grow during stretches without camera detection. Filter on them instead of dropping extrapolated points wholesale.

## Officials (Tracking v4)

Tracking v4 tracks the main referee (assistants are not delivered yet). With `include_officials=True` the referee is a row on every frame where SkillCorner tracks it, with `team_id="officials"`, and an entry in `dataset.players` with position `REF`. The `player_id` is SkillCorner's referee id when the file gives one; the files seen so far give none, and the row is then named `main_referee`, the label the parquet delivery uses. The referee carries the same velocity, acceleration, predicted-error and `is_detected` columns as the players.

## Notes

-   SkillCorner uses CDF-compatible coordinates natively (center origin, meters)
-   Tracking v4 censors some out-of-play stretches: the frame is delivered with no players and no ball. Those are empty frames, excluded by default; `include_empty_frames=True` keeps them, with null ball coordinates. Shortly before and after the ball goes out, v4 also cuts the ball alone while the players stay; the ball coordinates are null on those frames, which are all dead-ball frames, so `only_alive=True` drops them
-   `ball_state` is read from the possession object: the ball is in play whenever a team is in possession (`possession.team_id` in v4, `possession.group` in v3)