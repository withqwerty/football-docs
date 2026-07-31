---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
## Providers

fast-forward supports 12 tracking data providers. Each provider has a `load_tracking()` function that returns a [`TrackingDataset`](https://fast-forward.readthedocs.io/en/latest/concepts/dataset/).

## Comparison Table

| Provider | Files | Format | Native Coords | Layouts | Special Parameters |
| --- | --- | --- | --- | --- | --- |
| CDF | 2 | JSONL + JSON | CDF | long, long_ball, wide | `exclude_missing_ball_frames` |
| GradientSports | 3 | JSONL + JSON | CDF | long, long_ball, wide | `include_incomplete_frames`, `roster_data` |
| HawkEye | Multi | Text + JSON/XML | CDF | long | `pitch_length`, `pitch_width`, `object_id`, `include_officials`, `parallel` |
| OptaVision | 2 | Text + XML | CDF | long, long_ball, wide | `include_ball_owning_player` |
| Respovision | 1 | JSONL | Sportec Event | long, long_ball, wide | `pitch_length`, `pitch_width`, `include_joint_angles`, `include_officials` |
| SciSports | 2 | EPTS XML + Text | SportVU | long, long_ball, wide | none |
| SecondSpectrum | 2 | JSONL + JSON | CDF | long, long_ball, wide | `exclude_missing_ball_frames` |
| Signality | 3+ | JSON | CDF | long, long_ball, wide | `include_officials`, `parallel`, `venue_information` |
| SkillCorner | 2 | JSONL + JSON | CDF | long, long_ball, wide | `include_empty_frames` |
| Sportec | 2 | XML | CDF | long, long_ball, wide | `include_officials` |
| StatsPerform | 2 | MA25 + MA1 | SportVU | long, long_ball, wide | `pitch_length`, `pitch_width`, `include_officials` |
| Tracab | 2 | DAT/JSON + XML/JSON | Tracab (cm) | long, long_ball, wide | none |

## Common Parameters

All providers share these parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | str | `"long"` | DataFrame layout: `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `include_game_id` | bool \| str | `True` | Add `game_id` column (`True` uses provider default, or pass a custom string) |
| `engine` | str | `"polars"` | DataFrame engine: `"polars"`, `"pyspark"`, `"arrow"`, or `"arrow[spark]"` |
| `spark_session` | SparkSession | `None` | PySpark session (only needed if `engine="pyspark"`) |

## Usage Pattern

```
from fastforward import secondspectrum  # or any provider

dataset = secondspectrum.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="metadata.json",
    layout="long",
    coordinates="cdf",
    orientation="static_home_away",
    only_alive=True,
)

# All providers return a TrackingDataset
dataset.tracking    # pl.DataFrame
dataset.metadata    # pl.DataFrame
dataset.teams       # pl.DataFrame
dataset.players     # pl.DataFrame
dataset.periods     # pl.DataFrame
```