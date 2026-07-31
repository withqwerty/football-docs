---
source_url: https://fast-forward.readthedocs.io/en/latest
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.331Z
---
![fast-forward](https://fast-forward.readthedocs.io/en/assets/logos/fastforward-gradient-logo.png)

**Fast, Rust-powered tracking data loader for soccer analytics.**

fast-forward loads tracking data from all major providers into [Polars](https://pola.rs/) DataFrames with a unified API. Built on a Rust core for speed, it handles parsing, coordinate transformations, and orientation normalization out of the box.

`pip install fast-forward-football`

## Key Features

-   **12 providers** supported with a consistent `load_tracking()` interface
-   **Polars DataFrame** and **PySpark DataFrame** support for fast, memory-efficient data processing
-   **Coordinate transformations** between all major coordinate systems
-   **Orientation normalization** to ensure consistent attacking directions
-   **3 layouts** (long, long_ball, wide) for different analysis workflows

## Benchmarks

fast-forward's Rust core is significantly faster than pure-Python alternatives. See the full [Benchmarks](https://fast-forward.readthedocs.io/en/benchmarks/) page for details.

![Load Time Benchmark](https://fast-forward.readthedocs.io/en/assets/images/benchmark_load_time.png)

## Quick Example

```
from fastforward import secondspectrum

dataset = secondspectrum.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="metadata.json",
)

# Access data via properties
dataset.tracking    # Polars DataFrame with tracking data
dataset.metadata    # Match-level metadata (1 row)
dataset.teams       # Team info (2 rows)
dataset.players     # Player roster
dataset.periods     # Period boundaries

# Transform coordinates
transformed = dataset.transform(
    to_coordinates="opta",
    to_orientation="home_away",
)
```

## Supported Providers

| Provider | Format | Files Required |
| --- | --- | --- |
| CDF | JSONL + JSON | 2 |
| GradientSports | JSONL + JSON | 3 |
| HawkEye | Per-minute text + JSON/XML | Multiple |
| OptaVision | Text + XML | 2 |
| Respovision | JSONL (embedded metadata) | 1 |
| SciSports | EPTS XML + Text | 2 |
| SecondSpectrum | JSONL + JSON | 2 |
| Signality | JSON (per-period) | 3+ |
| SkillCorner | JSONL + JSON | 2 |
| Sportec | XML | 2 |
| StatsPerform | MA25 text + MA1 JSON/XML | 2 |
| Tracab | DAT/JSON + XML/JSON | 2 |

## Next Steps

-   [Getting Started](https://fast-forward.readthedocs.io/en/getting-started/) - Installation and first steps
-   [TrackingDataset](https://fast-forward.readthedocs.io/en/concepts/dataset/) - Understand the data structure
-   [Coordinate Systems](https://fast-forward.readthedocs.io/en/concepts/coordinate-systems/) - How coordinates work
-   [Providers](https://fast-forward.readthedocs.io/en/providers/) - Detailed provider documentation

## Credit

This project owes a depth of gratitude to [Kloppy](https://kloppy.pysport.org/) and the hard work put into that project by all its contributors. Without their dedication and commitment this project would not exist. 💙

## Providers

### [CDF](https://fast-forward.readthedocs.io/en/providers/cdf/)

Common Data Format. JSONL tracking plus JSON metadata.

### [GradientSports](https://fast-forward.readthedocs.io/en/providers/gradientsports/)

JSONL tracking plus JSON metadata and roster.

### [HawkEye](https://fast-forward.readthedocs.io/en/providers/hawkeye/)

Per-minute ball and centroid files plus JSON or XML metadata.

### [OptaVision](https://fast-forward.readthedocs.io/en/providers/optavision/)

Colon-delimited text plus XML metadata.

### [Respovision](https://fast-forward.readthedocs.io/en/providers/respovision/)

JSONL with metadata embedded in the same file.

### [SciSports](https://fast-forward.readthedocs.io/en/providers/scisports/)

FIFA EPTS XML metadata plus colon-delimited positions text.

### [SecondSpectrum](https://fast-forward.readthedocs.io/en/providers/secondspectrum/)

JSONL tracking plus JSON metadata.

### [Signality](https://fast-forward.readthedocs.io/en/providers/signality/)

Per-period JSON tracking files plus JSON metadata and venue files.

### [SkillCorner](https://fast-forward.readthedocs.io/en/providers/skillcorner/)

JSONL tracking plus JSON metadata.

### [Sportec](https://fast-forward.readthedocs.io/en/providers/sportec/)

XML tracking plus XML metadata.

### [StatsPerform](https://fast-forward.readthedocs.io/en/providers/statsperform/)

MA25 text tracking plus MA1 JSON or XML metadata.

### [Tracab](https://fast-forward.readthedocs.io/en/providers/tracab/)

DAT or JSON tracking plus XML or JSON metadata.