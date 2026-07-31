---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/sportec/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **Sportec** XML format (used in the Bundesliga).

## Function Signature

```
from fastforward import sportec

dataset = sportec.load_tracking(
    raw_data="tracking.xml",
    meta_data="match_info.xml",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to tracking XML file |
| `meta_data` | FileLike | required | Path to match info XML file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_officials` | bool | `False` | Include match officials (referees) |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

**Tracking data** (XML): Positional data, typically named `*_tracking.xml` or `*_positional.xml`.

**Metadata** (XML): Match information, typically named `*_match_info.xml`.

## Example

```
from fastforward import sportec

dataset = sportec.load_tracking(
    raw_data="sportec_positional.xml",
    meta_data="sportec_meta.xml",
    include_officials=True,
)

print(dataset.tracking.head())
print(dataset.teams)
```

## Notes

-   Sportec uses CDF-compatible coordinates natively (center origin, meters)
-   When `include_officials=True`, officials are included with `team_id="officials"` and position codes: `REF`, `AREF`, `VAR`, `AVAR`, `4TH`