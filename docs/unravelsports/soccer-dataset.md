---
source_url: https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.624Z
---
Loading and converting soccer tracking data.

_`class`_ `unravel.soccer.``KloppyPolarsDataset`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset)

Bases: `` `DefaultDataset` ``

Convert Kloppy soccer tracking data to Polars DataFrame format.

This class takes tracking data loaded via Kloppy (supporting providers like Sportec, SkillCorner, Tracab, SecondSpectrum, etc.) and converts it into a fast, efficient Polars DataFrame with computed velocities, accelerations, and ball carrier inference.

The conversion process includes: - Coordinate system standardization - Velocity and acceleration computation with optional smoothing - Ball carrier and ball owning team inference - Goalkeeper position identification - Speed and acceleration filtering to remove outliers - Optional orientation normalization (attacking left-to-right)

Parameters:

-   **kloppy_dataset** – A Kloppy TrackingDataset instance containing the raw tracking data.
    
-   **ball_carrier_threshold** – Maximum distance (in meters) between player and ball to be considered the ball carrier. Defaults to 25.0.
    
-   **max_player_speed** – Maximum realistic player speed in m/s. Values above this are capped to prevent sensor errors. Defaults to 12.0 m/s.
    
-   **max_ball_speed** – Maximum realistic ball speed in m/s. Values above this are capped. Defaults to 28.0 m/s.
    
-   **max_player_acceleration** – Maximum realistic player acceleration in m/s². Values above this are capped. Defaults to 6.0 m/s².
    
-   **max_ball_acceleration** – Maximum realistic ball acceleration in m/s². Values above this are capped. Defaults to 13.5 m/s².
    
-   **orient_ball_owning** – If True, normalize coordinates so the team with possession always attacks from left to right. Defaults to True.
    
-   **add_smoothing** – If True, apply Savitzky-Golay smoothing to velocities to reduce noise. Defaults to True.
    
-   **\*\*kwargs** – Additional keyword arguments passed to DefaultDataset.
    

`data`

The converted Polars DataFrame with all tracking data.

Type:

`` `pl.DataFrame` ``

`settings`

Configuration and metadata for the dataset.

Type:

`` `DefaultSettings` ``

`home_players`

List of home team player objects.

Type:

`` `List[SoccerObject]` ``

`away_players`

List of away team player objects.

Type:

`` `List[SoccerObject]` ``

`kloppy_dataset`

The original Kloppy dataset.

Type:

`` `TrackingDataset` ``

Raises:

-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If kloppy_dataset is not a TrackingDataset instance.
    
-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If ball_carrier_threshold is not a float.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If the dataset orientation is NOT_SET.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If ball owning team must be inferred but ball_carrier_threshold is None.
    

Example

```
>>> from kloppy import sportec
>>> from unravel.soccer import KloppyPolarsDataset
>>>
>>> # Load tracking data with Kloppy
>>> kloppy_dataset = sportec.load_open_tracking_data(only_alive=True)
>>>
>>> # Convert to Polars format
>>> polars_dataset = KloppyPolarsDataset(
...     kloppy_dataset=kloppy_dataset,
...     ball_carrier_threshold=25.0,
...     max_player_speed=12.0,
...     orient_ball_owning=True
... )
>>>
>>> # Access the DataFrame
>>> df = polars_dataset.data
>>> print(df.head())
>>>
>>> # Add dummy labels for training
>>> polars_dataset.add_dummy_labels(by=["frame_id"])
>>>
>>> # Add graph IDs for grouping
>>> polars_dataset.add_graph_ids(by=["frame_id"])
```

Note

For non-Sportec providers, always use `` `only_alive=True` `` or `` `include_empty_frames=False` `` when loading data with Kloppy to avoid frames without ball tracking data.

Warning

If the dataset doesn’t include ball owning team information, it will be inferred using distance to ball. This may cause unexpected results in situations where the ball is contested or in the air.

`__init__`(_`kloppy_dataset`_, _`ball_carrier_threshold``=``25.0`_, _`max_player_speed``=``12.0`_, _`max_ball_speed``=``28.0`_, _`max_player_acceleration``=``6.0`_, _`max_ball_acceleration``=``13.5`_, _`orient_ball_owning``=``True`_, _`add_smoothing``=``True`_, _`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.__init__)

Parameters:

-   **kloppy_dataset** ([_TrackingDataset_](https://kloppy.pysport.org/reference/domain/models/tracking/tracking-dataset/#kloppy.domain.TrackingDataset "(in kloppy 3.18.0 v0.0.0)"))
    
-   **ball_carrier_threshold** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_player_speed** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_ball_speed** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_player_acceleration** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_ball_acceleration** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **orient_ball_owning** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **add_smoothing** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    

`convert_orientation_to_ball_owning`(_`df`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.convert_orientation_to_ball_owning)

Convert field orientation so attacking team always goes left-to-right.

This method normalizes the coordinate system so that the team with possession always attacks from left to right, regardless of which half they’re in. This helps machine learning models by providing consistent attacking directionality.

When the away team has possession, all spatial coordinates (x, y) and their derivatives (vx, vy, ax, ay) are multiplied by -1.

Parameters:

**df** (_DataFrame_) – The DataFrame with STATIC_HOME_AWAY orientation.

Returns:

DataFrame with BALL_OWNING_TEAM orientation.

Return type:

pl.DataFrame

Raises:

[**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If orientation is already BALL_OWNING_TEAM.

Example

```
>>> # Typically called automatically if orient_ball_owning=True
>>> # But can be called manually:
>>> df = dataset.convert_orientation_to_ball_owning(dataset.data)
```

Note

This is called automatically during `` `load()` `` if the `` `orient_ball_owning` `` parameter is set to True in `` `__init__` ``.

The following columns are flipped when away team has possession: - x, y: Position coordinates - vx, vy: Velocity components - ax, ay: Acceleration components

See also

Kloppy Orientation documentation for more details on coordinate systems.

`load`()[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.load)

Load and process the Kloppy tracking dataset into Polars DataFrame.

This method performs the complete data transformation pipeline:

1.  Transform coordinate system to SecondSpectrum standard
    
2.  Extract player and ball metadata
    
3.  Convert wide format (columns per player) to long format
    
4.  Compute velocities with optional Savitzky-Golay smoothing
    
5.  Compute accelerations
    
6.  Filter unrealistic speed/acceleration values
    
7.  Infer ball carrier and ball owning team (if not provided)
    
8.  Optionally normalize orientation to ball-owning team
    
9.  Infer goalkeeper positions (if position data unavailable)
    

The resulting DataFrame is stored in `` `self.data` `` and contains columns: - period_id, timestamp, frame_id: Temporal identifiers - id, team_id, position_name: Object identifiers - x, y, z: Positions - vx, vy, vz, speed: Velocities - ax, ay, az, acceleration: Accelerations - ball_state: Ball in/out of play - ball_owning_team_id: Team with possession - is_ball_carrier: Boolean flag for ball carrier - game_id: Match identifier

Returns:

Self, for method chaining.

Return type:

[KloppyPolarsDataset](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.KloppyPolarsDataset")

Raises:

-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If dataset orientation is NOT_SET.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If ball owning team inference is needed but ball_carrier_threshold is None.
    

Example

```
>>> # Typically called automatically in __init__
>>> # But can be called manually to reload:
>>> dataset.load()
```

Note

This method is called automatically during `` `__init__` ``, so you typically don’t need to call it manually unless reloading data.

Warning

If ball owning team is not provided in the data, it will be inferred using distance thresholds, which may be inaccurate during contested ball situations.

`add_dummy_labels`(_`by``=``['game_id',` `'frame_id']`_, _`random_seed``=``None`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.add_dummy_labels)

Add a column of random binary labels for testing/demonstration purposes.

This method adds a ‘label’ column with random 0/1 values to the dataset. Useful for testing graph neural network pipelines before you have real labels.

Parameters:

-   **by** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_) – Column names to group by before assigning labels. Each unique combination gets the same random label. Defaults to \[“game_id”, “frame_id”\].
    
-   **random_seed** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)") _|_ _None_) – Random seed for reproducibility. If None, labels will be different each time. Defaults to None.
    

Returns:

The updated DataFrame with ‘label’ column added.

Return type:

pl.DataFrame

Example

```
>>> # Add random labels, one per frame
>>> dataset.add_dummy_labels(by=["frame_id"])
>>>
>>> # Add labels grouped by possession
>>> dataset.add_dummy_labels(by=["ball_owning_team_id", "period_id"])
>>>
>>> # Reproducible labels
>>> dataset.add_dummy_labels(by=["frame_id"], random_seed=42)
```

Note

In real applications, replace this with actual labels from your data:

```
>>> import polars as pl
>>> labels = pl.DataFrame({"frame_id": [...], "label": [...]})
>>> dataset.data = dataset.data.join(labels, on="frame_id")
```

`add_graph_ids`(_`by``=``['game_id',` `'period_id']`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.add_graph_ids)

Add a graph_id column for grouping frames into graph samples.

This method adds a ‘graph_id’ column that groups tracking frames into distinct graph samples for GNN training. This is crucial for proper train/test splitting to avoid data leakage.

Parameters:

**by** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_) – Column names to group by. Each unique combination gets a unique graph_id. Defaults to \[“game_id”, “period_id”\].

Returns:

The updated DataFrame with ‘graph_id’ column added.

Return type:

pl.DataFrame

Example

```
>>> # Each frame is a separate graph
>>> dataset.add_graph_ids(by=["frame_id"])
>>>
>>> # Group by possession (all frames in same possession = one graph)
>>> dataset.add_graph_ids(by=["ball_owning_team_id", "period_id"])
>>>
>>> # Group by 10-frame sequences
>>> dataset.data = dataset.data.with_columns(
...     (pl.col("frame_id") // 10).alias("sequence_id")
... )
>>> dataset.add_graph_ids(by=["sequence_id"])
```

Important

When splitting data for training, **always split by graph_id** to avoid data leakage. Never split by row index:

```
>>> # CORRECT: Split by graph_id
>>> train, test, val = dataset.split_test_train_validation(4, 1, 1)
>>>
>>> # WRONG: Don't split by index
>>> train = dataset[:800]  # May have same game in train and test!
```

See also

[`` `add_graph_id_column()` ``](https://unravelsports.readthedocs.io/en/latest/api/utils/helpers.html#unravel.utils.add_graph_id_column "unravel.utils.add_graph_id_column"): Underlying utility function. `` `split_test_train_validation()` ``: Splitting method.

`get_player_by_id`(_`player_id`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.get_player_by_id)

`get_team_id_by_player_id`(_`player_id`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.get_team_id_by_player_id)

`sample`(_`sample_rate`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/dataset/kloppy_polars.html#KloppyPolarsDataset.sample)

Downsample the dataset by keeping every Nth frame.

This method reduces the temporal resolution of the data by keeping only a subset of frames. Useful for faster experimentation or when full temporal resolution is not needed.

Parameters:

**sample_rate** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)")) – Sampling rate. For example: - 2.0 keeps every 2nd frame (halves data size) - 5.0 keeps every 5th frame (reduces to 20% of original) - 10.0 keeps every 10th frame (reduces to 10% of original)

Returns:

Self, for method chaining.

Return type:

[KloppyPolarsDataset](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.KloppyPolarsDataset")

Example

```
>>> # Keep every 2nd frame (50% of data)
>>> dataset.sample(sample_rate=2.0)
>>>
>>> # Keep every 5th frame (20% of data)
>>> dataset.sample(sample_rate=5.0)
>>>
>>> # Can chain with other methods
>>> dataset.sample(5.0).add_dummy_labels().add_graph_ids()
```

Note

This modifies `` `self.data` `` in-place. The original data is not preserved.

Warning

Downsampling may affect velocity and acceleration calculations if you recalculate them after sampling. It’s recommended to downsample before conversion to graphs.

```
from kloppy import sportec
from unravel.soccer import KloppyPolarsDataset

# Load tracking data
kloppy_dataset = sportec.load_open_tracking_data(only_alive=True)

# Convert to Polars
polars_dataset = KloppyPolarsDataset(kloppy_dataset=kloppy_dataset)

# Access the DataFrame
df = polars_dataset.dataset
print(df.head())
```