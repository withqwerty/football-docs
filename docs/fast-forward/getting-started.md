---
source_url: https://fast-forward.readthedocs.io/en/latest/getting-started/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.331Z
---
## Installation

```
pip install fast-forward-football
```

For PySpark support:

```
pip install fast-forward-football[pyspark]
```

Requirements

-   Python >= 3.11
-   Polars >= 1.0.0

## Loading Tracking Data

Every provider has a `load_tracking()` function that returns a `TrackingDataset`:

```
from fastforward import secondspectrum

dataset = secondspectrum.load_tracking(
    raw_data="path/to/tracking.jsonl",
    meta_data="path/to/metadata.json",
)
```

## Accessing Data

The `TrackingDataset` contains five Polars DataFrames:

```
# Tracking data - the main DataFrame with all positional data
df = dataset.tracking
print(df.head())

# Match metadata - single row with match-level info
print(dataset.metadata)

# Teams - home and away team info (2 rows)
print(dataset.teams)

# Players - full player roster
print(dataset.players)

# Periods - period boundaries with start/end frame IDs
print(dataset.periods)
```

## Common Parameters

All providers share these parameters:

```
dataset = secondspectrum.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="metadata.json",
    layout="long",                    # "long", "long_ball", or "wide"
    coordinates="cdf",                # Target coordinate system
    orientation="static_home_away",   # Target orientation
    only_alive=True,                  # Only include frames where ball is in play
    include_game_id=True,             # Add game_id column to tracking data
    engine="polars",                  # "polars", "pyspark", "arrow", or "arrow[spark]"
)
```

See [Layouts](https://fast-forward.readthedocs.io/en/latest/concepts/layouts/), [Coordinate Systems](https://fast-forward.readthedocs.io/en/latest/concepts/coordinate-systems/), and [Orientations](https://fast-forward.readthedocs.io/en/latest/concepts/orientations/) for details on each parameter.

## Transforming Data

Transform coordinates, orientation, or pitch dimensions after loading:

```
# Transform to Opta coordinates with alternating orientation
transformed = dataset.transform(
    to_coordinates="opta",
    to_orientation="home_away",
    to_dimensions=(100, 100),
)

# Check current state
print(transformed.coordinate_system)  # "opta"
print(transformed.orientation)        # "home_away"
print(transformed.pitch_dimensions)   # (100.0, 100.0)
```

Transforms can be chained:

```
result = (
    dataset
    .transform(to_orientation="home_away")
    .transform(to_coordinates="opta")
)
```

See [Transformations](https://fast-forward.readthedocs.io/en/latest/concepts/transformations/) for the full guide.

## File Inputs

All `load_tracking()` functions accept file paths, bytes, URLs, S3 paths, and more via kloppy's `FileLike` type. See [FileLike (IO)](https://fast-forward.readthedocs.io/en/latest/concepts/filelike/) for the full list of accepted input types.

## PySpark Engine

For distributed processing with PySpark:

```
dataset = secondspectrum.load_tracking(
    "tracking.jsonl", "metadata.json",
    engine="pyspark",
)

# All DataFrames are PySpark DataFrames
spark_df = dataset.tracking  # pyspark.sql.DataFrame

# Convert between engines
polars_dataset = dataset.to_polars()
spark_dataset = dataset.to_pyspark()
```

For Spark `mapInArrow`, Ray `map_batches`, or Dask `map_partitions` patterns, see [Distributed Compute](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/).