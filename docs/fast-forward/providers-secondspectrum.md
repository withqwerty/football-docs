---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/secondspectrum/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **SecondSpectrum** JSONL format.

## Function Signature

```
from fastforward import secondspectrum

dataset = secondspectrum.load_tracking(
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
| `exclude_missing_ball_frames` | bool | `True` | Exclude frames where ball tracking failed |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

**Tracking data** (JSONL): One JSON object per frame.

**Metadata** (JSON): Match information with teams, players, and pitch dimensions.

## Example

```
from fastforward import secondspectrum

dataset = secondspectrum.load_tracking(
    raw_data="secondspectrum_tracking.jsonl",
    meta_data="secondspectrum_meta.json",
    layout="long_ball",
    coordinates="cdf",
    only_alive=True,
    exclude_missing_ball_frames=True,
)

print(dataset.tracking.shape)
print(dataset.metadata)
```

## Notes

-   SecondSpectrum uses CDF-compatible coordinates natively (center origin, meters)
-   Failed ball tracking is indicated by `ball_z == -10`. The `exclude_missing_ball_frames` parameter filters these frames out by default