---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/scisports/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **SciSports EPTS** format (FIFA EPTS XML metadata plus colon-delimited positions text).

## Function Signature

```
from fastforward import scisports

dataset = scisports.load_tracking(
    raw_data="positions.txt",
    meta_data="metadata.xml",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to positions text file |
| `meta_data` | FileLike | required | Path to EPTS XML metadata file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `engine` | str | `"polars"` | `"polars"`, `"pyspark"`, `"arrow"`, or `"arrow[spark]"` |

All four engines are supported. For distributed compute (Spark, Ray, Dask), see [Distributed Compute](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/).

## File Format

**Metadata** (XML): FIFA EPTS standard. Contains `FrameRate`, `FieldSize`, `Sessions` (Full Match and per-period frame ranges), `Teams`, `Players`, and a `DataFormatSpecification` that describes how the positions file is laid out.

**Tracking data** (TXT): One line per frame. Each line is `frame_id:home_block:away_block:ball`, where the player blocks use `;` between players and `,` between channels per player, and the ball block uses `,` between channels (`x, y, z-estimate, air, alive`).

## Example

```
from fastforward import scisports

dataset = scisports.load_tracking(
    raw_data="scisports_epts_positions.txt",
    meta_data="scisports_epts_metadata.xml",
)

print(dataset.tracking.head())
print(dataset.players)
```

## Notes

-   Attacking direction is detected from data on the first frame of each period, since SciSports metadata does not carry a side hint.
-   Frames outside any period's `[Start Frame, End Frame]` range (pre-kickoff, half-time intermission, post-game) are dropped at parse time.