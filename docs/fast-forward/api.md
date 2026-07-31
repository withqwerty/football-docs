---
source_url: https://fast-forward.readthedocs.io/en/latest/api/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
## TrackingDataset

Container for tracking data and associated metadata.

Supports multiple DataFrame backends: - Polars (default): pl.DataFrame - PySpark: pyspark.sql.DataFrame

Attributes:

| Name | Type | Description |
| --- | --- | --- |
| `tracking` | `DataFrame or DataFrame` | Tracking data. DataFrame type depends on engine parameter. |
| `metadata` | `DataFrame or DataFrame` | Single-row DataFrame with match-level metadata. |
| `teams` | `DataFrame or DataFrame` | Team information (2 rows: home and away). |
| `players` | `DataFrame or DataFrame` | Player information with team associations. |
| `periods` | `DataFrame or DataFrame` | Period information with period_id, start_frame_id, end_frame_id. |
| `engine` | `str` | The DataFrame engine being used ('polars' or 'pyspark'). |

Examples:

```
>>> from fastforward import secondspectrum
>>> dataset = secondspectrum.load_tracking("tracking.jsonl", "meta.json")
>>> dataset.tracking  # pl.DataFrame
>>> dataset.metadata  # pl.DataFrame (1 row)
>>> dataset.periods   # pl.DataFrame (2+ rows)
```

### tracking `property` 

```
tracking
```

Get tracking data as a DataFrame.

### metadata `property` 

```
metadata
```

Get metadata DataFrame (single row).

### teams `property` 

```
teams
```

Get teams DataFrame.

### players `property` 

```
players
```

Get players DataFrame.

### periods `property` 

```
periods
```

Get periods DataFrame with period_id, start_frame_id, end_frame_id.

### engine `property` 

```
engine
```

Get the DataFrame engine ('polars', 'pyspark', or 'arrow').

### coordinate_system `property` 

```
coordinate_system
```

Get the current coordinate system.

### orientation `property` 

```
orientation
```

Get the current orientation.

### pitch_dimensions `property` 

```
pitch_dimensions
```

Get current pitch dimensions (length, width) in meters.

### to_polars 

```
to_polars()
```

Convert all DataFrames to Polars.

If already using Polars engine, returns self unchanged. Arrow tables are converted zero-copy via `pl.from_arrow` (Arrow C Data Interface capsule). PySpark DataFrames go via pandas (the round trip the JVM side wants).

### to_pyspark 

```
to_pyspark(spark=None)
```

Convert all DataFrames to PySpark.

If already using PySpark engine, returns self unchanged. Arrow tables go straight via `spark.createDataFrame(arrow_table)` (Spark 3.4+). Polars DataFrames convert through the Arrow capsule, skipping pandas.

### transform 

```
transform(to_orientation=None, to_dimensions=None, to_coordinates=None)
```

Transform tracking data to different orientation, dimensions, and/or coordinates.

Transformations are applied in the correct order internally: 1. Orientation (flip) - while in CDF/meters 2. Dimensions (zone-based scaling) - while in CDF/meters 3. Coordinates (unit/origin conversion) - last step

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `to_orientation` | `str` | Target orientation. Options include: - "static_home_away": Home team attacks left-to-right in both halves - "static_away_home": Away team attacks left-to-right in both halves Note: Orientation transforms flip x and y around the center. | `None` |
| `to_dimensions` | `tuple of (float, float)` | Target pitch dimensions (length, width) in meters. Uses zone-based scaling to preserve IFAB pitch feature proportions. | `None` |
| `to_coordinates` | `str` | Target coordinate system. Options include: - "cdf": Center origin, meters (default) - "tracab": Center origin, centimeters - "opta": Bottom-left origin, 0-100 scale - "kloppy": Top-left origin, 0-1 scale - "sportvu": Top-left origin, meters | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | New dataset with transformed data, or self if no changes needed. |

Examples:

```
>>> dataset = secondspectrum.load_tracking("tracking.jsonl", "meta.json")
>>> # Single transformation
>>> tracab = dataset.transform(to_coordinates="tracab")
>>> # Multiple transformations (order handled internally)
>>> result = dataset.transform(
...     to_orientation="static_away_home",
...     to_dimensions=(105.0, 68.0),
...     to_coordinates="tracab",
... )
```

## Providers

Each provider module exposes a `load_tracking()` function that returns a `TrackingDataset`.

### CDF

Load CDF (Common Data Format) tracking data.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to JSONL tracking file, or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `meta_data` | `FileLike` | Path to JSON metadata file, or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names | `"long"` |
| `coordinates` | `'cdf'` | Coordinate system: - "cdf": Common Data Format (origin at center) | `"cdf"` |
| `orientation` | `str` | Coordinate orientation: - "static_home_away": Home attacks right (+x) entire match - "static_away_home": Away attacks right (+x) entire match - "home_away": Home attacks right 1st half, left 2nd half - "away_home": Away attacks right 1st half, left 2nd half - "attack_right": Attacking team always attacks right - "attack_left": Attacking team always attacks left | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play (ball_state == "alive") | `True` |
| `exclude_missing_ball_frames` | `bool` | If True, exclude frames where ball coordinates are missing (null). | `True` |
| `include_game_id` | `bool or str` | If True, add game_id column to tracking_df, team_df, and player_df from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. If engine="polars", .tracking returns pl.DataFrame. If engine="pyspark", all DataFrames are PySpark DataFrames. |

### SecondSpectrum

Load SecondSpectrum tracking data.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to JSONL tracking file, or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `meta_data` | `FileLike` | Path to JSON metadata file, or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names | `"long"` |
| `coordinates` | `'cdf'` | Coordinate system: - "cdf": Common Data Format (origin at center) | `"cdf"` |
| `orientation` | `str` | Coordinate orientation: - "static_home_away": Home attacks right (+x) entire match - "static_away_home": Away attacks right (+x) entire match - "home_away": Home attacks right 1st half, left 2nd half - "away_home": Away attacks right 1st half, left 2nd half - "attack_right": Attacking team always attacks right - "attack_left": Attacking team always attacks left | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play (ball_state == "alive") | `True` |
| `exclude_missing_ball_frames` | `bool` | If True, exclude frames where ball coordinates are missing (ball_z == -10). SecondSpectrum uses ball_z = -10 as a sentinel value for failed ball tracking. | `True` |
| `include_game_id` | `bool or str` | If True, add game_id column to tracking_df, team_df, and player_df from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. If engine="polars", .tracking returns pl.DataFrame. If engine="pyspark", all DataFrames are PySpark DataFrames. |

### SkillCorner

Load SkillCorner tracking data.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to JSONL tracking file (e.g., tracking_extrapolated.jsonl), or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `meta_data` | `FileLike` | Path to JSON match file (e.g., match.json), or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names | `"long"` |
| `coordinates` | `'cdf'` | Coordinate system: - "cdf": Common Data Format (origin at center) | `"cdf"` |
| `orientation` | `str` | Coordinate orientation: - "static_home_away": Home attacks right (+x) entire match - "static_away_home": Away attacks right (+x) entire match - "home_away": Home attacks right 1st half, left 2nd half - "away_home": Away attacks right 1st half, left 2nd half - "attack_right": Attacking team always attacks right - "attack_left": Attacking team always attacks left | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play (matches kloppy default) | `True` |
| `include_empty_frames` | `bool` | If True, include frames with no detected players | `False` |
| `include_game_id` | `bool or str` | If True, add game_id column to tracking_df, team_df, and player_df from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `include_ball_owning_player` | `bool` | If True, attach a `ball_owning_player_id` column to the tracking DataFrame carrying the player UUID currently in possession on each frame (null when SkillCorner did not record one). Omitting the kwarg currently behaves as False but emits a `FutureWarning`; pass an explicit value to silence the warning. | `False (will become True in fastforward 0.2.0)` |
| `include_is_detected` | `bool` | If True, attach an `is_detected` column to the tracking DataFrame (long / long_ball layouts) indicating whether each player position was camera-detected (True) or imputed/extrapolated (False). Ball rows in long layout receive null since the concept doesn't apply. Wide layout doesn't surface the flag yet; long or long_ball is recommended for detection-aware analyses. Omitting the kwarg currently behaves as False but emits a `FutureWarning`; pass an explicit value to silence the warning. | `False (will become True in fastforward 0.2.0)` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. If engine="polars", .tracking returns pl.DataFrame. If engine="pyspark", all DataFrames are PySpark DataFrames. |

### Sportec

Load Sportec tracking data from XML files.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to tracking XML file (e.g., *_tracking.xml), or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `meta_data` | `FileLike` | Path to match info XML file (e.g., *_match_info.xml), or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names | `"long"` |
| `coordinates` | `'cdf'` | Coordinate system: - "cdf": Common Data Format (origin at center) | `"cdf"` |
| `orientation` | `str` | Coordinate orientation: - "static_home_away": Home attacks right (+x) entire match - "static_away_home": Away attacks right (+x) entire match - "home_away": Home attacks right 1st half, left 2nd half - "away_home": Away attacks right 1st half, left 2nd half - "attack_right": Attacking team always attacks right - "attack_left": Attacking team always attacks left | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play (matches kloppy default) | `True` |
| `include_game_id` | `bool or str` | If True, add game_id column to tracking_df, team_df, and player_df from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `include_officials` | `bool` | If True, include officials in player_df with team_id="officials" and position codes: REF (Main Referee), AREF (Assistant Referee), VAR (Video Assistant Referee), AVAR (Assistant VAR), 4TH (Fourth Official) | `False` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. If engine="polars", .tracking returns pl.DataFrame. If engine="pyspark", all DataFrames are PySpark DataFrames. |

### Tracab

Load Tracab tracking data.

Supports multiple file formats: - Metadata: XML (hierarchical or flat format), JSON - Raw data: DAT (text/binary), JSON

The native Tracab coordinate system uses centimeters with origin at center. Coordinates are automatically converted to CDF (meters) internally and then transformed to the target coordinate system.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to tracking data file (.dat or .json), bytes, or file-like object. | required |
| `meta_data` | `FileLike` | Path to metadata file (.xml or .json), bytes, or file-like object. | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as separate rows with team_id="ball" - "long_ball": Ball in separate columns (ball_x, ball_y, ball_z) - "wide": One row per frame, player columns as {player_id}_x, _y, _z | `"long"` |
| `coordinates` | `str` | Target coordinate system. | `"cdf"` |
| `orientation` | `str` | Target orientation. | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play. | `True` |
| `include_game_id` | `bool or str` | If True, add game_id column from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. If engine="polars", .tracking returns pl.DataFrame. If engine="pyspark", all DataFrames are PySpark DataFrames. |

Examples:

```
>>> from fastforward import tracab
>>> dataset = tracab.load_tracking("tracking.dat", "meta.xml")
```

```
>>> # Using different formats
>>> dataset = tracab.load_tracking("tracking.json", "meta.json")
```

```
>>> # Get tracab coordinates (centimeters)
>>> dataset = tracab.load_tracking("tracking.dat", "meta.xml", coordinates="tracab")
```

```
>>> # PySpark engine
>>> dataset = tracab.load_tracking("tracking.dat", "meta.xml", engine="pyspark")
>>> dataset.tracking.show(5)
```

### HawkEye

Load HawkEye tracking data.

Supports two modes, distinguished by whether `period` and `minute` are provided:

-   **Multi-file mode** (no `period`/`minute`): load a full match. `ball_data` and `player_data` are lists — either `List[FileLike]` (polars/pyspark only; kloppy resolves) or `List[(period, minute, bytes)]` triples (any engine; no kloppy).
-   **Single-file mode** (`period` AND `minute` provided): load one minute of one match. `ball_data` and `player_data` are single-shaped: bytes-like (any engine) or single `FileLike` (polars/pyspark only). `include_game_id` should be a string match_id when used for distributed compute (so rows from different matches don't collide after union).

Arrow engines (`"arrow"` / `"arrow[spark]"`) require bytes-only inputs — same kloppy-free contract as the other 8 providers. FileLike inputs on arrow engines raise `TypeError`.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `ball_data` | `FileLike, List[FileLike], bytes-like, or List[(period, minute, bytes)]` | Ball tracking file input. See mode descriptions above. | required |
| `player_data` | `same shape as ball_data` | Player tracking file input. | required |
| `meta_data` | `FileLike or bytes - like` | Metadata file (JSON or XML). | required |
| `layout` | `('long', 'long_ball', 'wide')` | Layout. `wide` rejected on arrow engines. | `"long"` |
| `only_alive` | `bool` | Standard kwargs (see source). | `True` |
| `pitch_length` | `bool` | Standard kwargs (see source). | `True` |
| `pitch_width` | `bool` | Standard kwargs (see source). | `True` |
| `object_id` | `bool` | Standard kwargs (see source). | `True` |
| `include_officials` | `bool` | Standard kwargs (see source). | `True` |
| `period` | `int` | Single-file mode toggle. When both provided, single-file mode activates. When both absent, multi-file mode. Providing one without the other raises `ValueError`. | `None` |
| `minute` | `int` | Single-file mode toggle. When both provided, single-file mode activates. When both absent, multi-file mode. Providing one without the other raises `ValueError`. | `None` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine. Output type matches: - "polars" → `pl.DataFrame` tables - "pyspark" → `spark.DataFrame` tables - "arrow" → `pyarrow.Table` tables with Polars-style Arrow types - "arrow[spark]" → `pyarrow.Table` tables with Spark-compat types | `"polars"` |
| `spark_session` | `SparkSession` | PySpark session for engine="pyspark". | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | With `.tracking`, `.metadata`, `.teams`, `.players`, `.periods`. |

Examples:

Multi-file from disk (existing behavior):

```
>>> ds = hawkeye.load_tracking(
...     ball_data=["hawkeye_1_1.ball", "hawkeye_1_2.ball"],
...     player_data=["hawkeye_1_1.centroids", "hawkeye_1_2.centroids"],
...     meta_data="hawkeye_meta.json",
...     engine="polars",
... )
```

Single-file for distributed compute:

```
>>> ds = hawkeye.load_tracking(
...     ball_data=ball_bytes, player_data=player_bytes,
...     meta_data=meta_bytes,
...     period=1, minute=1,
...     engine="arrow[spark]",
...     include_game_id="match_uuid_42",
... )
```

### Signality

Load Signality tracking data.

Supports two modes, distinguished by whether `period` is provided:

-   **Multi-file mode** (no `period`): load a full match. `raw_data_feeds` is a list — either `List[FileLike]` (polars/pyspark only; kloppy resolves) or `List[(period, bytes)]` pairs (any engine; no kloppy).
-   **Single-file mode** (`period` provided): load one period of one match. `raw_data_feeds` is single-shaped: bytes-like (any engine) or single `FileLike` (polars/pyspark only). `include_game_id` should be a string match_id when used for distributed compute (so rows from different matches don't collide after union).

Arrow engines (`"arrow"` / `"arrow[spark]"`) require bytes-only inputs — same kloppy-free contract as the other 11 providers. FileLike inputs on arrow engines raise `TypeError`.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `meta_data` | `FileLike or bytes - like` | Metadata file (JSON). | required |
| `raw_data_feeds` | `FileLike, List[FileLike], bytes-like, or List[(period, bytes)]` | Raw-data input. See mode descriptions above. | required |
| `venue_information` | `FileLike or bytes - like` | Venue information file (JSON). | required |
| `layout` | `('long', 'long_ball', 'wide')` | Layout. `wide` rejected on arrow engines. | `"long"` |
| `coordinates` | `str` | Coordinate system to transform into. | `"cdf"` |
| `orientation` | `str` | Orientation convention. | `"static_home_away"` |
| `only_alive` | `bool` | If True, drop frames where the ball is not alive. | `True` |
| `include_game_id` | `bool or str` | Whether to include a `game_id` column. Pass a string to override the match id (required in single-file mode for distributed compute). | `True` |
| `include_officials` | `bool` | Include referees/assistants as rows in the tracking dataframe. | `False` |
| `period` | `int` | Single-file mode toggle. When provided, single-file mode activates and `raw_data_feeds` must be single-shaped. | `None` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine. Output type matches: - "polars" → `pl.DataFrame` tables - "pyspark" → `spark.DataFrame` tables - "arrow" → `pyarrow.Table` tables with Polars-style Arrow types - "arrow[spark]" → `pyarrow.Table` tables with Spark-compat types | `"polars"` |
| `spark_session` | `SparkSession` | PySpark session for engine="pyspark". | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | With `.tracking`, `.metadata`, `.teams`, `.players`, `.periods`. |

Examples:

Multi-file from disk (existing behavior):

```
>>> ds = signality.load_tracking(
...     meta_data="signality_meta_data.json",
...     raw_data_feeds=["signality_p1_raw_data.json", "signality_p2_raw_data.json"],
...     venue_information="signality_venue_information.json",
...     engine="polars",
... )
```

Single-file (per-period) for distributed compute:

```
>>> ds = signality.load_tracking(
...     meta_data=meta_bytes,
...     raw_data_feeds=raw_bytes,
...     venue_information=venue_bytes,
...     period=1,
...     engine="arrow[spark]",
...     include_game_id="match_uuid_42",
... )
```

### StatsPerform

Load StatsPerform tracking data.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `ma25_data` | `FileLike` | Path to MA25 tracking data file (text format). | required |
| `ma1_data` | `FileLike` | Path to MA1 metadata file (JSON or XML format, auto-detected). | required |
| `pitch_length` | `float` | Length of the pitch in meters. StatsPerform data does not include pitch dimensions, so this must be provided. Default: 105.0m. | `None` |
| `pitch_width` | `float` | Width of the pitch in meters. StatsPerform data does not include pitch dimensions, so this must be provided. Default: 68.0m. | `None` |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names | `"long"` |
| `coordinates` | `str` | Coordinate system for output. Options: - "cdf": Center origin, meters (default) - "statsperform" / "sportvu": Native top-left origin, y-down, meters - Other provider coordinate systems | `"cdf"` |
| `orientation` | `str` | Coordinate orientation | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play | `True` |
| `include_game_id` | `Union[bool, str]` | If True, add game_id column from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `include_officials` | `bool` | If True, include match officials (referees) in the players DataFrame with team_id="officials" and appropriate position codes (REF, AREF, 4TH). | `False` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. |

Notes

StatsPerform uses the SportVU coordinate system: - Origin at top-left corner of the pitch - X increases left to right (0 to ~105m) - Y increases top to bottom (0 to ~68m) - inverted from standard - Units are meters - Frame rate is typically 10 Hz (100ms between frames)

The MA1 metadata format is auto-detected (JSON or XML) based on content.

### GradientSports

Load GradientSports (PFF) tracking data.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to JSONL tracking file, or bytes, or file-like object. Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths, zip files. | required |
| `meta_data` | `FileLike` | Path to JSON metadata file, or bytes, or file-like object. | required |
| `roster_data` | `FileLike` | Path to JSON roster file, or bytes, or file-like object. Resolved to bytes by the framework before dispatch — engine-aware (kloppy on polars/pyspark, no-kloppy on arrow). | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names | `"long"` |
| `coordinates` | `str` | Coordinate system (gradientsports uses CDF format natively) | `"gradientsports"` |
| `orientation` | `str` | Coordinate orientation | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball is in play | `True` |
| `include_incomplete_frames` | `bool` | If True, include frames with null ball coordinates or null player arrays. If False (default), only include frames with complete data. | `False` |
| `include_game_id` | `bool or str` | If True, add game_id column from metadata. If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. |

### Respovision

Load Respovision tracking data.

Respovision data comes in a single JSONL file containing all tracking frames with embedded metadata. Team names are extracted from the filename pattern YYYYMMDD-HomeTeam-AwayTeam-\*.jsonl.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `raw_data` | `FileLike` | Path to JSONL tracking file, or bytes, or file-like object. Filename pattern: YYYYMMDD-HomeTeam-AwayTeam-*.jsonl Supports: file paths (str/Path), bytes, file objects, URLs, S3 paths. For `engine="arrow"` / `"arrow[spark]"`, only bytes-like input is accepted (no FileLike resolution; see `filename` for game_id derivation in that case). | required |
| `layout` | `('long', 'long_ball', 'wide')` | DataFrame layout: - "long": Ball as row with team_id="ball", player_id="ball" - "long_ball": Ball in separate columns, only player rows - "wide": One row per frame, player_id in column names Note: Wide layout does not include joint angles. | `"long"` |
| `coordinates` | `str` | Coordinate system. Options: - "cdf": Common Data Format (origin at center, meters) - "respovision": Native coordinates (origin at bottom-left corner, meters) - Other provider coordinate systems | `"cdf"` |
| `orientation` | `str` | Coordinate orientation. | `"static_home_away"` |
| `only_alive` | `bool` | If True, only include frames where ball_possession is not null. | `True` |
| `exclude_missing_ball_frames` | `bool` | If True, exclude frames where ball coordinates are missing (null). | `True` |
| `pitch_length` | `float` | Pitch length in meters. | `105.0` |
| `pitch_width` | `float` | Pitch width in meters. | `68.0` |
| `include_game_id` | `bool or str` | If True, add game_id column (auto-generated from filename). If False, no game_id column is added. If str, use the provided string as the game_id value. | `True` |
| `include_joint_angles` | `bool` | If True, include head_angle, shoulders_angle, hips_angle columns. Only applies to long and long_ball layouts. | `True` |
| `include_officials` | `bool` | If True, include referees in tracking data with team_id="officials". | `False` |
| `filename` | `str` | Explicit filename for game_id derivation. Required when `raw_data` is bytes and you want auto-derived game_id (engine="arrow" can't extract a filename from raw bytes). When raw_data is a FileLike, the filename is auto-extracted and this kwarg is ignored. | `None` |
| `engine` | `('polars', 'pyspark', 'arrow', 'arrow[spark]')` | DataFrame engine to use: - "polars": Return Polars DataFrames (default) - "pyspark": Return PySpark DataFrames - "arrow": Return pyarrow.Tables with Polars-style Arrow types (string_view, duration[ms]). For Dask/Ray workers. - "arrow[spark]": Return pyarrow.Tables pre-normalized for Spark consumption (string, int64 ms). For Spark mapInArrow UDFs. | `"polars"` |
| `spark_session` | `SparkSession` | PySpark SparkSession to use. If None and engine="pyspark", will get or create a session automatically. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `TrackingDataset` | Object with .tracking, .metadata, .teams, .players, .periods properties. |

Notes

-   Native coordinate system (respovision): origin at bottom-left corner, meters X in \[0, pitch_length\], Y in \[0, pitch_width\]
-   Home/away team designation is extracted from filename
-   Player IDs are formatted as {team_name_lower}_{jersey_number}
-   Team IDs are lowercase team names with spaces replaced by underscores
-   Game ID default format: YYYYMMDD-{home_prefix}-{away_prefix}
-   Frame rate is typically 25 Hz
-   Ball state: alive if ball_possession is not null, dead otherwise
-   Joint angles may contain null values (especially for goalkeepers)

## Transforms

### transform_coordinates

Transform DataFrame coordinates between coordinate systems.

Uses CDF as intermediate format: source -> CDF -> target.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `df` | `DataFrame` | DataFrame with x, y columns (and optionally z) | required |
| `from_system` | `str` | Source coordinate system (e.g., "cdf", "tracab", "opta") | required |
| `to_system` | `str` | Target coordinate system | required |
| `pitch_length` | `float` | Pitch length in meters | required |
| `pitch_width` | `float` | Pitch width in meters | required |

Returns:

| Type | Description |
| --- | --- |
| `DataFrame` | DataFrame with transformed x, y, z columns |

### transform_dimensions

Transform DataFrame to different pitch dimensions using zone-based scaling.

Uses IFAB standard zone boundaries to preserve pitch feature proportions (penalty area, six-yard box, center circle, etc.).

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `df` | `DataFrame` | DataFrame with x, y columns (must be in CDF format: center origin, meters) | required |
| `from_length` | `float` | Source pitch length in meters | required |
| `from_width` | `float` | Source pitch width in meters | required |
| `to_length` | `float` | Target pitch length in meters | required |
| `to_width` | `float` | Target pitch width in meters | required |

Returns:

| Type | Description |
| --- | --- |
| `DataFrame` | DataFrame with zone-scaled x, y coordinates |

### transform_orientation

Transform DataFrame orientation by flipping coordinates.

Orientation flipping negates x and y coordinates around the center (0, 0). This is used to ensure consistent attacking direction.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `df` | `DataFrame` | DataFrame with x, y columns (must be in CDF format: center origin) | required |
| `flip` | `bool` | If True, flip the coordinates (negate x and y) | required |

Returns:

| Type | Description |
| --- | --- |
| `DataFrame` | DataFrame with flipped x, y coordinates (if flip=True) |