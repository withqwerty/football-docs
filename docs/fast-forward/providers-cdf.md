---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/cdf/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
The **Common Data Format (CDF)** is fast-forward's internal standardized format. Use this provider to load data that is already in CDF format.

## Function Signature

```
from fastforward import cdf

dataset = cdf.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="metadata.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to JSONL tracking file |
| `meta_data` | FileLike | required | Path to JSON metadata file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `exclude_missing_ball_frames` | bool | `True` | Exclude frames where ball position is missing |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

**Tracking data** (JSONL): One JSON object per frame with ball and player positions.

**Metadata** (JSON): Match information including teams, players, pitch dimensions, and frame rate.

## Example

```
from fastforward import cdf

dataset = cdf.load_tracking(
    raw_data="cdf_tracking.jsonl",
    meta_data="cdf_metadata.json",
    layout="long",
    coordinates="cdf",
    only_alive=True,
    exclude_missing_ball_frames=True,
)

print(dataset.tracking.head())
```

## Notes

-   CDF is the intermediate format used for all coordinate transformations
-   Coordinates are in meters with center origin