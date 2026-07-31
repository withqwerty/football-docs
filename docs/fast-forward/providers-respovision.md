---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/respovision/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **Respovision** JSONL format. Unique among providers: metadata is embedded in the tracking file.

## Function Signature

```
from fastforward import respovision

dataset = respovision.load_tracking(
    raw_data="20240714-HomeTeam-AwayTeam-tracking.jsonl",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to JSONL tracking file (metadata embedded) |
| `pitch_length` | float | `105.0` | Fallback pitch length in meters |
| `pitch_width` | float | `68.0` | Fallback pitch width in meters |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_game_id` | bool \| str | `True` | Add game_id column (auto-generated from filename) |
| `include_joint_angles` | bool | `True` | Include head, shoulders, and hips angle columns |
| `include_officials` | bool | `False` | Include match officials |

## File Format

**Single JSONL file** with embedded metadata. The filename typically follows the pattern: `YYYYMMDD-HomeTeam-AwayTeam-*.jsonl`

The game_id is automatically generated from the filename pattern.

## Joint Angles

Respovision can include body orientation data as additional columns:

| Column | Type | Description |
| --- | --- | --- |
| `head_angle` | Float32 | Head orientation angle |
| `shoulders_angle` | Float32 | Shoulders orientation angle |
| `hips_angle` | Float32 | Hips orientation angle |

Set `include_joint_angles=False` to exclude these columns.

## Example

```
from fastforward import respovision

dataset = respovision.load_tracking(
    raw_data="20240714-HomeTeam-AwayTeam-tracking.jsonl",
    pitch_length=105.0,
    pitch_width=68.0,
    include_joint_angles=True,
    include_officials=False,
)

print(dataset.tracking.head())
print(dataset.metadata)
```

## Notes

-   **Single file provider**: no separate metadata file needed
-   Native coordinates use bottom-left origin in meters (`sportec:event`/`respovision` coordinate system)
-   The `"respovision"` coordinate system name is an alias for `sportec:event`
-   Game ID is auto-generated from the filename pattern (`YYYYMMDD-xxx-xxx`)