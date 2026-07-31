---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/hawkeye/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **HawkEye** per-minute file format.

## Function Signature

```
from fastforward import hawkeye

dataset = hawkeye.load_tracking(
    ball_data=["period1_minute1.ball", "period1_minute2.ball"],
    player_data=["period1_minute1.centroids", "period1_minute2.centroids"],
    meta_data="metadata.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ball_data` | FileLike \| list[FileLike] | required | Ball tracking file(s) |
| `player_data` | FileLike \| list[FileLike] | required | Player centroid file(s) |
| `meta_data` | FileLike | required | JSON or XML metadata file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where play field is "In" |
| `pitch_length` | float | `105.0` | Fallback pitch length in meters |
| `pitch_width` | float | `68.0` | Fallback pitch width in meters |
| `object_id` | str | `"auto"` | ID preference: `"fifa"`, `"uefa"`, `"he"`, or `"auto"` |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `include_officials` | bool | `False` | Include referees in tracking data |
| `parallel` | bool | `True` | Process files in parallel (rayon) |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

HawkEye uses **per-minute files**: separate files for each minute of each period:

-   **Ball files**: `hawkeye_{period}_{minute}.football.samples.ball`
-   **Player files**: `hawkeye_{period}_{minute}.football.samples.centroids`
-   **Metadata**: JSON or XML with match info and pitch dimensions

## Directory Loading

Instead of listing individual files, you can pass a directory path. fast-forward will discover and sort files automatically:

```
dataset = hawkeye.load_tracking(
    ball_data="/path/to/hawkeye_data/",   # Discovers *.ball files
    player_data="/path/to/hawkeye_data/", # Discovers *.centroids files
    meta_data="/path/to/hawkeye_meta.json",
)
```

## Object ID System

HawkEye data may contain multiple ID systems for teams and players (FIFA, UEFA, HawkEye internal). The `object_id` parameter controls which IDs are preferred:

| Value | Behavior |
| --- | --- |
| `"auto"` | Prefer FIFA > UEFA > HawkEye (default) |
| `"fifa"` | Use FIFA IDs |
| `"uefa"` | Use UEFA IDs |
| `"he"` | Use HawkEye internal IDs |

Load metadata without parsing tracking data:

```
metadata = hawkeye.load_metadata_only(
    meta_data="metadata.json",
    player_data="first_minute.centroids",  # Optional, for player info
    pitch_length=105.0,
    pitch_width=68.0,
    object_id="auto",
)
```

## Example

```
from fastforward import hawkeye

dataset = hawkeye.load_tracking(
    ball_data="/data/match/",
    player_data="/data/match/",
    meta_data="/data/match/metadata.json",
    include_officials=False,
    parallel=True,
)

print(dataset.tracking.shape)
print(dataset.periods)
```

## Notes

-   HawkEye uses CDF-compatible coordinates natively (center origin, meters)
-   Pitch dimensions are read from metadata when available; `pitch_length`/`pitch_width` parameters are fallbacks
-   The `parallel=True` default uses Rayon for concurrent file processing