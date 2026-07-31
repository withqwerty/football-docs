---
source_url: https://fast-forward.readthedocs.io/en/latest/concepts/dataset/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.331Z
---
The `TrackingDataset` is the central object returned by every provider's `load_tracking()` function. It contains all tracking data and metadata. The underlying type of each table (Polars, PySpark, or pyarrow) is determined by the `engine` kwarg passed to `load_tracking`.

## Properties

| Property | Type | Description |
| --- | --- | --- |
| `tracking` | `pl.DataFrame` / `SparkDataFrame` / `pyarrow.Table` | Positional data for all players and the ball |
| `metadata` | `pl.DataFrame` / `SparkDataFrame` / `pyarrow.Table` | Match-level information (1 row) |
| `teams` | `pl.DataFrame` / `SparkDataFrame` / `pyarrow.Table` | Team information (2 rows: home and away) |
| `players` | `pl.DataFrame` / `SparkDataFrame` / `pyarrow.Table` | Player roster with positions and starter status |
| `periods` | `pl.DataFrame` / `SparkDataFrame` / `pyarrow.Table` | Period boundaries with start/end frame IDs |
| `engine` | `str` | One of `"polars"`, `"pyspark"`, `"arrow"`, `"arrow[spark]"` |
| `schemas` | `Schemas` | Namespace exposing Arrow + PySpark schemas for all 5 tables (kwargs auto-bound from the load). See Obtaining schemas. |
| `coordinate_system` | `str` | Current coordinate system name |
| `orientation` | `str` | Current orientation name |
| `pitch_dimensions` | `tuple[float, float]` | `(pitch_length, pitch_width)` in meters |

## DataFrame Schemas

The dtypes below are for `engine="polars"`. Arrow engines emit different physical types for some columns. See [Per-engine schema](https://fast-forward.readthedocs.io/en/latest/concepts/dataset/#per-engine-schema) for the full comparison.

### tracking

The main DataFrame containing positional data. Schema depends on the [layout](https://fast-forward.readthedocs.io/en/latest/concepts/layouts/).

**Long layout** (default):

| Column | Type | Description |
| --- | --- | --- |
| `game_id` | String | Match identifier (if `include_game_id=True`) |
| `frame_id` | UInt32 | Frame index |
| `period_id` | Int32 | Period number (1, 2, 3, ...) |
| `timestamp` | Duration(ms) | Time since period start |
| `ball_state` | String | `"alive"` or `"dead"` |
| `ball_owning_team_id` | String | Team ID with possession |
| `team_id` | String | Team ID (`"ball"` for ball rows) |
| `player_id` | String | Player ID (`"ball"` for ball rows) |
| `x` | Float32 | X coordinate |
| `y` | Float32 | Y coordinate |
| `z` | Float32 | Z coordinate (height) |

### metadata

Single-row DataFrame with match-level information.

| Column | Type | Description |
| --- | --- | --- |
| `game_id` | String | Match identifier |
| `provider` | String | Provider name (e.g., `"secondspectrum"`) |
| `game_date` | Date | Match date |
| `home_team` | String | Home team name |
| `home_team_id` | String | Home team ID |
| `away_team` | String | Away team name |
| `away_team_id` | String | Away team ID |
| `pitch_length` | Float32 | Pitch length in meters |
| `pitch_width` | Float32 | Pitch width in meters |
| `fps` | Float32 | Frames per second |
| `coordinate_system` | String | Current coordinate system |
| `orientation` | String | Current orientation |

### teams

Two rows: one for home, one for away.

| Column | Type | Description |
| --- | --- | --- |
| `game_id` | String | Match identifier |
| `team_id` | String | Team identifier |
| `name` | String | Team name |
| `ground` | String | `"home"` or `"away"` |

### players

One row per player.

| Column | Type | Description |
| --- | --- | --- |
| `game_id` | String | Match identifier |
| `team_id` | String | Team identifier |
| `player_id` | String | Player identifier |
| `name` | String | Full name (nullable) |
| `first_name` | String | First name (nullable) |
| `last_name` | String | Last name (nullable) |
| `jersey_number` | Int32 | Shirt number |
| `position` | String | Standardized position code |
| `is_starter` | Boolean | Whether player started the match |

**Position codes:**

| Code | Position | Code | Position |
| --- | --- | --- | --- |
| GK | Goalkeeper | CM, LCM, RCM | Central Midfield |
| LB, RB | Left/Right Back | CAM, LAM, RAM | Attacking Midfield |
| CB, LCB, RCB | Center Back | LM, RM | Left/Right Midfield |
| LWB, RWB | Wing Back | LW, RW | Left/Right Wing |
| CDM, LDM, RDM | Defensive Midfield | ST, LF, RF, CF | Strikers/Forwards |
| SUB | Substitute | UNK | Unknown |
| REF | Main Referee | AREF | Assistant Referee |
| VAR | VAR Official | AVAR | Assistant VAR |
| FOURTH | Fourth Official |  |  |

For a full reference on position codes, see the [kloppy positions documentation](https://kloppy.pysport.org/user-guide/concepts/positions/).

### periods

One row per period found in the data.

| Column | Type | Description |
| --- | --- | --- |
| `game_id` | String | Match identifier |
| `period_id` | Int32 | Period number |
| `start_frame_id` | UInt32 | First frame of the period |
| `end_frame_id` | UInt32 | Last frame of the period |

## Per-engine schema

The tracking schema dtypes for SkillCorner (long layout, all include flags on), shown across the four engine values:

| Column | `engine="polars"` (default) | `engine="arrow"` (Polars-style Arrow) | `engine="arrow[spark]"` (Spark-compat) | `engine="pyspark"` |
| --- | --- | --- | --- | --- |
| `game_id` | `String` | `string_view` | `string` | `StringType` |
| `frame_id` | `UInt32` | `int64` | `int64` | `LongType` |
| `period_id` | `Int32` | `int32` | `int32` | `IntegerType` |
| `timestamp` | `Duration(ms)` | `duration[ms]` | `int64` (ms) | `LongType` |
| `ball_state` | `String` | `string_view` | `string` | `StringType` |
| `ball_owning_team_id` | `String` | `string_view` | `string` | `StringType` |
| `team_id` | `String` | `string_view` | `string` | `StringType` |
| `player_id` | `String` | `string_view` | `string` | `StringType` |
| `x`, `y`, `z` | `Float32` | `float` (float32) | `float` (float32) | `FloatType` |
| `ball_owning_player_id` | `String` | `string_view` | `string` | `StringType` |
| `is_detected` | `Boolean` | `bool` | `bool` | `BooleanType` |

Two columns differ between the two arrow dialects: `string_view` vs `string`, and `duration[ms]` vs `int64`. The other arrow columns are identical between `engine="arrow"` and `engine="arrow[spark]"`. The choice between them is dictated by what your downstream framework accepts, not by which one is more correct. See the [Distributed Compute](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/) page for guidance.

The non-tracking tables (`metadata`, `teams`, `players`, `periods`) follow the same dialect convention. The dtype list above applies to their string and integer columns equivalently.

## Obtaining schemas

Two ways to get the Arrow + PySpark schemas. Both produce the same `Schemas` namespace with 10 lazy properties: `tracking`, `metadata`, `teams`, `players`, `periods` (Arrow), and `tracking_spark`, `metadata_spark`, `teams_spark`, `players_spark`, `periods_spark` (PySpark `StructType`).

**`dataset.schemas`** is available on any loaded dataset, with the load's kwargs already bound.

```
dataset = skillcorner.load_tracking(raw, meta, engine="arrow[spark]")
dataset.schemas.tracking_spark   # StructType you'd pass to mapInArrow
```

**`skillcorner.schemas(...)`** is for when you don't have data loaded yet (for example, declaring a Spark `mapInArrow` output schema before any worker runs). It accepts the same kwargs as `load_tracking`, so unpack a single config dict into both:

```
LOAD_KWARGS = dict(
    engine="arrow[spark]",
    layout="long",
    include_game_id=True,
    include_ball_owning_player=True,
    include_is_detected=True,
)
out_schema = skillcorner.schemas(**LOAD_KWARGS).tracking_spark
```

See the [Distributed Compute](https://fast-forward.readthedocs.io/en/latest/concepts/distributed-compute/#schema-helpers) page for the deeper explanation of when `tracking` vs `tracking_spark` matters and how the engine value controls the Arrow dialect.

## Engine converters

Every `TrackingDataset` can be converted between engines. Polars ↔ Arrow is zero-copy via the Arrow C Data Interface capsule.

```
ds_pl = skillcorner.load_tracking(raw, meta, engine="polars")

ds_arr = ds_pl.to_arrow()                       # engine="arrow"
ds_arr_spark = ds_pl.to_arrow(engine="arrow[spark]")
ds_back = ds_arr.to_polars()                    # back to engine="polars"
ds_spark = ds_pl.to_pyspark(spark_session)      # engine="pyspark"
```

Round-trip preserves values exactly. `arrow` to `polars` to `arrow` produces a tracking table with the same column names, row count, and column values as the original.

## Methods

### transform()

Transform coordinates, orientation, or pitch dimensions:

```
transformed = dataset.transform(
    to_coordinates="opta",           # Target coordinate system
    to_orientation="home_away",      # Target orientation
    to_dimensions=(100, 100),        # Target (length, width) in meters
)
```

All three parameters are optional. Transforms are applied in a fixed order: orientation, then dimensions, then coordinates. See [Transformations](https://fast-forward.readthedocs.io/en/latest/concepts/transformations/) for details.

### to_polars() / to_pyspark() / to_arrow()

Convert between DataFrame engines. See [Engine converters](https://fast-forward.readthedocs.io/en/latest/concepts/dataset/#engine-converters) above for the full table; brief examples:

```
spark_dataset = dataset.to_pyspark()             # engine="pyspark"
polars_dataset = spark_dataset.to_polars()       # engine="polars"

arrow_dataset = dataset.to_arrow()               # engine="arrow"
arrow_spark_dataset = dataset.to_arrow(engine="arrow[spark]")
```