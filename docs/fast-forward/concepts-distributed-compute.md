---
source_url: https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
Engine choice depends on the consumer:

-   **Spark** (`mapInArrow`, `createDataFrame`) and **Ray** (`map_batches`): `engine="arrow[spark]"`. Both reject Polars's `string_view` and `duration[ms]`; `arrow[spark]` pre-casts them to `string` and `int64`.
-   **Dask** (`.to_pandas()` in the worker) or bare pyarrow: `engine="arrow"`. Pandas absorbs Polars-style Arrow types directly.

Both engines return identical data with different Arrow dtypes. Both accept raw `bytes`, `bytearray`, `memoryview`, or `io.BytesIO` for the tracking and metadata inputs. Neither accepts file paths or URLs. Neither imports kloppy on executors, so workers stay small.

## Spark

The example is provider-agnostic. `{provider}` stands for any [single-file provider](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/#per-provider-input-shape). Multi-file providers (`hawkeye`, `signality`) do not fit this shape; see [Multi-file providers](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/#multi-file-providers).

One row per match on the driver, carrying `match_id` and the file URIs as strings. The worker fetches bytes inside the UDF, parses one match, and yields Arrow batches back.

```
from pyspark.sql import SparkSession

from fastforward import {provider}   # e.g. skillcorner, secondspectrum, tracab

spark = SparkSession.builder.getOrCreate()

# Define every load kwarg once. Schema declaration and worker load unpack the
# same dict; the two must agree.
LOAD_KWARGS = dict(
    engine="arrow[spark]",
    layout="long",
    include_game_id=True,
)

# 1. Build a Spark DataFrame with one row per match.
#    Required columns:
#      match_id:       string
#      raw_data_uri:   string  (e.g. "s3://bucket/matches/123/tracking.jsonl")
#      meta_data_uri:  string  (e.g. "s3://bucket/matches/123/match.json")
#    Column names track the provider's `load_tracking` argument names.
matches_df = ...   # your source of matches

# 2. Declare the output schema upfront. Same kwargs as the per-worker load.
out_schema = {provider}.schemas(**LOAD_KWARGS).tracking_spark

# 3. Per-worker UDF. One task per match.
def parse_match_udf(iterator):
    for batch in iterator:
        raw_uris  = batch.column("raw_data_uri").to_pylist()
        meta_uris = batch.column("meta_data_uri").to_pylist()
        for r_uri, m_uri in zip(raw_uris, meta_uris):
            raw  = read_bytes(r_uri)   # bring your own S3 / GCS / Azure client
            meta = read_bytes(m_uri)
            dataset = {provider}.load_tracking(raw, meta, **LOAD_KWARGS)
            for record_batch in dataset.tracking.to_batches():
                yield record_batch

# 4. One task per match. Without this, upstream partitioning is uncorrelated
#    with per-match cost and produces long-tail skew on matches with more frames.
matches_df = matches_df.repartition(matches_df.count(), "match_id")

# 5. Distribute one match per task.
tracking_df = matches_df.mapInArrow(parse_match_udf, schema=out_schema)

# 6. Partition the write by game_id so re-runs replace matches idempotently.
#    Iceberg or Delta MERGE work equivalently.
tracking_df.write.partitionBy("game_id").parquet("s3a://my-bucket/tracking/")
```

`mapInArrow` requires PySpark 3.3 or newer. `read_bytes(uri)` is a placeholder for the object-store client of choice.

## Ray `map_batches`

Same URI shape. Ray's pyarrow path also rejects `string_view`, so `engine="arrow[spark]"` is required. The batch is a dict of columns rather than a `RecordBatch` iterator, and Ray infers the output schema from the returned table.

```
import ray
import pyarrow as pa

from fastforward import {provider}

matches_ds = ...   # ray.data.Dataset with match_id, raw_data_uri, meta_data_uri

def parse_batch(batch):
    out = []
    for r_uri, m_uri in zip(batch["raw_data_uri"], batch["meta_data_uri"]):
        raw  = read_bytes(r_uri)
        meta = read_bytes(m_uri)
        ds = {provider}.load_tracking(raw, meta, engine="arrow[spark]")
        out.append(ds.tracking)
    return pa.concat_tables(out)

tracking_ds = matches_ds.map_batches(parse_batch, batch_format="pyarrow")
```

## Dask `map_partitions`

Same URI shape. Dask goes through pandas via `.to_pandas()`, so `engine="arrow"` fits (no Spark-compat pre-casts needed). `map_partitions` needs a `meta` pandas frame describing the output columns.

```
import pandas as pd
import dask.dataframe as dd

from fastforward import {provider}

matches_ddf = ...   # dask DataFrame with match_id, raw_data_uri, meta_data_uri

def parse_partition(df):
    out = []
    for _, row in df.iterrows():
        raw  = read_bytes(row["raw_data_uri"])
        meta = read_bytes(row["meta_data_uri"])
        ds = {provider}.load_tracking(raw, meta, engine="arrow")
        out.append(ds.tracking.to_pandas())
    return pd.concat(out, ignore_index=True)

tracking_meta = (
    {provider}.schemas(engine="arrow").tracking.empty_table().to_pandas()
)
tracking_ddf = matches_ddf.map_partitions(parse_partition, meta=tracking_meta)
```

## Per-provider input shape

Providers take different input names; two (`hawkeye`, `signality`) split a match across multiple files.

| Provider | Required inputs | Multi-file | Extra kwargs |
| --- | --- | --- | --- |
| `cdf` | `raw_data`, `meta_data` | no |  |
| `gradientsports` | `raw_data`, `meta_data`, `roster_data` | no |  |
| `hawkeye` | `ball_data`, `player_data`, `meta_data` | yes (per period + minute) | `period=`, `minute=`, see Multi-file providers |
| `optavision` | `raw_data`, `meta_data` | no |  |
| `respovision` | `raw_data` | no | `filename=` (parses team names from the filename) |
| `scisports` | `raw_data`, `meta_data` | no |  |
| `secondspectrum` | `raw_data`, `meta_data` | no |  |
| `signality` | `meta_data`, `raw_data_feeds`, `venue_information` | yes (per period) | `period=`, see Multi-file providers |
| `skillcorner` | `raw_data`, `meta_data` | no |  |
| `sportec` | `raw_data`, `meta_data` | no |  |
| `statsperform` | `ma25_data`, `ma1_data` | no | `pitch_length=`, `pitch_width=` (no defaults in feed) |
| `tracab` | `raw_data`, `meta_data` | no |  |

For single-file providers, name the URI columns after the provider's argument names (e.g. `raw_data_uri`, `meta_data_uri` for SkillCorner; `ma25_data_uri`, `ma1_data_uri` for StatsPerform).

### Multi-file providers

`hawkeye` and `signality` split a match across multiple files. The upstream DataFrame carries one row per **slice**, not per match, and the worker forwards the slice-identifying kwargs from the row into `load_tracking`. Otherwise the worker body is the same shape as the Spark example above: fetch bytes, call `provider.load_tracking(...)`, yield Arrow batches.

-   `hawkeye`: one row per `(match_id, period, minute)` slice with `ball_data_uri`, `player_data_uri`, `meta_data_uri`. Worker forwards `period=`, `minute=`, and `include_game_id=match_id`.
-   `signality`: one row per `(match_id, period)` with `meta_data_uri`, `raw_data_feeds_uri`, `venue_information_uri`. Worker forwards `period=` and `include_game_id=match_id`.

## Schema helpers

`provider.schemas(**LOAD_KWARGS)` returns a `Schemas` namespace with 10 lazy properties (5 tables x {Arrow, PySpark}):

| Table | Arrow (`pyarrow.Schema`) | PySpark (`StructType`) |
| --- | --- | --- |
| `tracking` | `s.tracking` | `s.tracking_spark` |
| `metadata` | `s.metadata` | `s.metadata_spark` |
| `teams` | `s.teams` | `s.teams_spark` |
| `players` | `s.players` | `s.players_spark` |
| `periods` | `s.periods` | `s.periods_spark` |

Two entry points:

-   `provider.schemas(**LOAD_KWARGS)` when the schema is needed before any data is loaded, for example the `mapInArrow` output schema. Accepts the same kwargs as `load_tracking`.
-   `dataset.schemas` on a loaded dataset, with the load's kwargs already bound.

`engine=` on `schemas()` mirrors `load_tracking`: `polars` / `arrow` produce Polars-style Arrow (`string_view`, `duration[ms]`); `pyspark` / `arrow[spark]` produce Spark-compat Arrow (`string`, `int64`). `*_spark` properties are always Spark-compatible regardless of `engine`.

`layout="wide"` has per-game column names, so `s.tracking` and `s.tracking_spark` raise `NotImplementedError`. The other four schemas still work.

## Produced schema

See [TrackingDataset - Per-engine schema](https://fast-forward.readthedocs.io/en/latest/concepts/dataset/#per-engine-schema).

## Common mistakes

-   **`engine="arrow"` on Ray.** Ray's pyarrow path does not support `string_view`; `arrow[spark]` is required.
-   **`layout="wide"` under the arrow engines.** `mapInArrow` needs a static output schema, and wide has per-game column names (player IDs become columns). `load_tracking` and `schemas().tracking` both raise `NotImplementedError`. `long` and `long_ball` are supported.
-   **Hand-written `StructType`.** Call `provider.schemas(...).tracking_spark`. Hand-written schemas drift from the parser and misdeclare `frame_id` as `IntegerType` (parser emits `LongType`, since PySpark's Arrow path cannot represent unsigned ints) or `timestamp` as `float` seconds (parser emits `int64` milliseconds).
-   **Per-match rows for `hawkeye` or `signality`.** Both are multi-file: build the upstream frame with one row per slice and forward `period=` (and `minute=` for HawkEye) from the row. See [Multi-file providers](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/#multi-file-providers).

## Databricks Runtime compatibility

`engine="arrow"` and `engine="arrow[spark]"` require pyarrow >= 14. Databricks Runtime 15+ ships pyarrow 14; DBR 14 LTS and older ship pyarrow 8-12. On DBR <= 14, install a newer pyarrow on the cluster:

```
%pip install pyarrow>=14
```