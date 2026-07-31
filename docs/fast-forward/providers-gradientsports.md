---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/gradientsports/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
Load tracking data from **GradientSports (PFF)** format.

## Function Signature

```
from fastforward import gradientsports

dataset = gradientsports.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="metadata.json",
    roster_data="roster.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to JSONL tracking file |
| `meta_data` | FileLike | required | Path to JSON metadata file |
| `roster_data` | FileLike | required | Path to JSON roster file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"gradientsports"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_incomplete_frames` | bool | `False` | Include frames with null ball or player data |
| `include_game_id` | bool \| str | `True` | Add game_id column |

Three Files Required

GradientSports is the only provider that requires **three** input files: tracking data, metadata, and a separate roster file.

## File Format

-   **Tracking data** (JSONL): Per-frame positional data
-   **Metadata** (JSON): Match information and team details
-   **Roster data** (JSON): Player roster with positions and jersey numbers

## Example

```
from fastforward import gradientsports

dataset = gradientsports.load_tracking(
    raw_data="pff_tracking.jsonl",
    meta_data="pff_metadata.json",
    roster_data="pff_rosters.json",
    include_incomplete_frames=False,
)

print(dataset.tracking.shape)
print(dataset.players)
```

## Notes

-   GradientSports uses CDF-compatible coordinates natively (center origin, meters)
-   The `"gradientsports"` coordinate system name is an alias for CDF
-   Incomplete frames (where ball or player arrays are null) are excluded by default