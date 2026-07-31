---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/statsperform/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **StatsPerform** (SportVU) format using MA25 tracking data and MA1 metadata.

## Function Signature

```
from fastforward import statsperform

dataset = statsperform.load_tracking(
    ma25_data="tracking_ma25.txt",
    ma1_data="metadata_ma1.json",
    pitch_length=105.0,
    pitch_width=68.0,
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `ma25_data` | FileLike | required | Path to MA25 tracking data file |
| `ma1_data` | FileLike | required | Path to MA1 metadata file (JSON or XML, auto-detected) |
| `pitch_length` | float | `105.0` | Pitch length in meters |
| `pitch_width` | float | `68.0` | Pitch width in meters |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `include_officials` | bool | `False` | Include match officials |

Pitch Dimensions Required

StatsPerform data does **not** include pitch dimensions. You should provide `pitch_length` and `pitch_width` for accurate coordinate transformations. The defaults (105.0 x 68.0) are used if not specified.

## File Format

**MA25 tracking data**: Text format with positional data.

**MA1 metadata**: JSON or XML (format is auto-detected). Contains teams, players, and match information.

Load metadata without parsing tracking data:

```
metadata = statsperform.load_metadata_only(
    ma1_data="metadata_ma1.json",
    pitch_length=105.0,
    pitch_width=68.0,
)
```

## Example

```
from fastforward import statsperform

dataset = statsperform.load_tracking(
    ma25_data="statsperform_tracking_ma25.txt",
    ma1_data="statsperform_tracking_ma1.json",
    pitch_length=105.0,
    pitch_width=68.0,
    include_officials=True,
)

print(dataset.tracking.head())
print(dataset.metadata)
```

## Notes

-   StatsPerform/SportVU native coordinates have **origin at top-left** with **Y-axis inverted** (top to bottom). fast-forward converts to the target coordinate system automatically
-   MA1 metadata format (JSON vs XML) is auto-detected based on file content