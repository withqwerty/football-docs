---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/signality/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **Signality** per-period JSON format.

## Function Signature

```
from fastforward import signality

dataset = signality.load_tracking(
    meta_data="metadata.json",
    raw_data_feeds=["signality_p1_raw_data.json", "signality_p2_raw_data.json"],
    venue_information="venue_information.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `meta_data` | FileLike | required | JSON metadata file (teams, players, lineups) |
| `raw_data_feeds` | FileLike \| list[FileLike] | required | Per-period raw data JSON file(s) |
| `venue_information` | FileLike | required | JSON venue file with pitch dimensions |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames with "running" state |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `include_officials` | bool | `False` | Include match officials |
| `parallel` | bool | `True` | Process files in parallel (rayon) |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

Signality requires **three types of files**:

-   **Metadata** (JSON): Teams, players, lineups, match timestamp
-   **Raw data feeds** (JSON): Per-period tracking data, named `signality_p{period}_raw_data.json`
-   **Venue information** (JSON): Pitch dimensions and venue details

Load metadata without parsing tracking data:

```
metadata = signality.load_metadata_only(
    meta_data="metadata.json",
    venue_information="venue_information.json",
)
```

## Example

```
from fastforward import signality

dataset = signality.load_tracking(
    meta_data="signality_meta_data.json",
    raw_data_feeds=[
        "signality_p1_raw_data.json",
        "signality_p2_raw_data.json",
    ],
    venue_information="signality_venue_information.json",
    include_officials=True,
    parallel=True,
)

print(dataset.tracking.shape)
print(dataset.players)
```

## Notes

-   Signality uses CDF-compatible coordinates natively (center origin, meters)
-   Period IDs are extracted from filename patterns (`p1`, `p2`, etc.)
-   The `parallel=True` default enables concurrent processing of per-period files