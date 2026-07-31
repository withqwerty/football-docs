---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/tracab/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **Tracab** format. Supports multiple file format variants.

## Function Signature

```
from fastforward import tracab

dataset = tracab.load_tracking(
    raw_data="tracking.dat",
    meta_data="metadata.xml",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to tracking data file (`.dat` or `.json`) |
| `meta_data` | FileLike | required | Path to metadata file (`.xml` or `.json`) |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

**Tracking data**: Supported formats are auto-detected:

-   `.dat`: Tracab DAT text format (or binary DAT)
-   `.json`: JSON format

**Metadata**: Supported formats are auto-detected:

-   `.xml`: XML (hierarchical or flat structure)
-   `.json`: JSON

## Example

```
from fastforward import tracab

# DAT + XML (most common)
dataset = tracab.load_tracking(
    raw_data="tracab_raw.dat",
    meta_data="tracab_meta.xml",
)

# JSON + JSON (alternative)
dataset = tracab.load_tracking(
    raw_data="tracab_raw.json",
    meta_data="tracab_meta.json",
)

print(dataset.tracking.head())
```

## Notes

-   Tracab natively uses **centimeters** with center origin. fast-forward automatically converts to the target coordinate system (CDF meters by default)
-   Player information may not be fully available in the metadata file. Players are automatically extracted from the tracking data during loading
-   Multiple metadata XML structures are supported (hierarchical and flat) and auto-detected