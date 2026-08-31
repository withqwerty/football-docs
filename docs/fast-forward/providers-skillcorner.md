---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/skillcorner/
source_type: crawled
upstream_version: 0.3.0
crawled_at: 2026-08-31T00:11:18.553Z
---
Load tracking data from **SkillCorner** format.

## Function Signature

```
from fastforward import skillcorner

dataset = skillcorner.load_tracking(
    raw_data="tracking_extrapolated.jsonl",
    meta_data="match.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to JSONL tracking file |
| `meta_data` | FileLike | required | Path to JSON match file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_empty_frames` | bool | `False` | Include frames with no detected players |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `include_ball_owning_player` | bool | `True` | Add the `ball_owning_player_id` column |
| `include_is_detected` | bool | `True` | Add the `is_detected` column (long / long_ball only) |
| `engine` | str | `"polars"` | `"polars"`, `"pyspark"`, `"arrow"`, or `"arrow[spark]"` |

All four engines are supported. For distributed compute (Spark, Ray, Dask), see [Distributed Compute](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/).

## File Format

**Tracking data** (JSONL): Typically named `tracking_extrapolated.jsonl`. One JSON object per frame.

**Metadata** (JSON): Typically named `match.json`. Contains match info, teams, and players.

## Example

```
from fastforward import skillcorner

dataset = skillcorner.load_tracking(
    raw_data="tracking_extrapolated.jsonl",
    meta_data="match.json",
    include_empty_frames=False,
)

print(dataset.tracking.shape)
print(dataset.players)
```

## Ball-Owning Player

SkillCorner exports include the player UUID currently in possession on each frame. With `include_ball_owning_player=True`, an extra column is attached:

| Column | Type | Description |
| --- | --- | --- |
| `ball_owning_player_id` | Utf8 | Player UUID in possession; null when not recorded or attributed to a non-roster entity (e.g. referee) |

Values match `dataset.players["player_id"]`. Set `include_ball_owning_player=False` to exclude this column.

## Detection Flag

With `include_is_detected=True`, every player row gets a boolean flag:

| Column | Type | Description |
| --- | --- | --- |
| `is_detected` | Bool | True = camera-detected, False = extrapolated |

In long layout, the ball row's `is_detected` is null (the concept does not apply to the ball). The flag is only added for the `long` and `long_ball` layouts; `wide` is not supported.

## Notes

-   SkillCorner uses CDF-compatible coordinates natively (center origin, meters)
-   Empty frames (frames with no detected players) are excluded by default. Set `include_empty_frames=True` to include them