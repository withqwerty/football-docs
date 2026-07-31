---
source_url: https://unravelsports.readthedocs.io/en/latest/api/american_football/dataset.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.624Z
---
Loading NFL tracking data from Big Data Bowl.

_`class`_ `unravel.american_football.``BigDataBowlDataset`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/dataset/dataset.html#BigDataBowlDataset)

Bases: `` `DefaultDataset` ``

Load and preprocess NFL Big Data Bowl tracking data into Polars DataFrame format.

This class handles NFL tracking data from the Big Data Bowl competition, converting CSV files into a standardized Polars DataFrame with computed velocities, standardized coordinate systems, and orientation normalization. It processes three input files: tracking data, player metadata, and play information.

The loader performs: - Coordinate system standardization (centering at midfield) - Orientation normalization (attacking left-to-right) - Angle conversion (degrees → radians in \[-π, π\] range) - Player metadata enrichment (height, weight, position) - Play-level information joining (possession team, play details) - Metric conversion (imperial → metric for anthropometrics)

The resulting dataset is ready for graph construction via `` `AmericanFootballGraphConverter` ``.

Parameters:

-   **tracking_file_path** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")) – Path to tracking CSV file. Must contain columns: gameId, playId, nflId, frameId, x, y, s (speed), o (orientation), dir (direction), team (or club).
    
-   **players_file_path** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")) – Path to players CSV file. Must contain: nflId, position (or officialPosition), height, weight.
    
-   **plays_file_path** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")) – Path to plays CSV file. Must contain: gameId, playId, possessionTeam.
    
-   **sample_rate** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Sampling rate for downsampling frames. For example, 0.5 keeps every 2nd frame. Defaults to None (no downsampling).
    
-   **max_player_speed** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Maximum physically plausible player speed (m/s) for filtering outliers. Defaults to 12.0 m/s (~27 mph).
    
-   **max_ball_speed** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Maximum physically plausible ball speed (m/s). Defaults to 28.0 m/s (~63 mph).
    
-   **max_player_acceleration** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Maximum player acceleration (m/s²). Defaults to 6.0 m/s².
    
-   **max_ball_acceleration** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Maximum ball acceleration (m/s²). Defaults to 13.5 m/s².
    
-   **orient_ball_owning** ([`` `bool` ``](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"), _optional_) – Whether to normalize coordinate system so the offense always attacks left-to-right. Defaults to True (recommended).
    
-   **\*\*kwargs** – Additional arguments passed to DefaultDataset.
    

`data`

Processed tracking data with columns: - game_id, play_id, frame_id: Identifiers - object_id: Player NFL ID (or “football” for ball) - team_id: Team abbreviation or “football” - x, y: Position in yards (centered at midfield) - s: Speed in yards/second - o: Orientation angle in radians \[-π, π\] - dir: Direction of movement in radians \[-π, π\] - position_name: Player position (e.g., “QB”, “WR”, “CB”) - height_cm: Player height in centimeters (rounded to nearest 10cm) - weight_kg: Player weight in kilograms (rounded to nearest 10kg) - ball_owning_team_id: Team with possession

Type:

`` `pl.DataFrame` ``

`settings`

Configuration object with pitch dimensions, orientation settings, and speed thresholds.

Type:

`` `DefaultSettings` ``

Raises:

[**NotImplementedError**](https://docs.python.org/3/library/exceptions.html#NotImplementedError "(in Python v3.14)") – If orient_ball_owning=False (currently unsupported).

Example

```
>>> from unravel.american_football.dataset import BigDataBowlDataset
>>>
>>> # Load Big Data Bowl 2024 data
>>> dataset = BigDataBowlDataset(
...     tracking_file_path="tracking_week_1.csv",
...     players_file_path="players.csv",
...     plays_file_path="plays.csv",
...     sample_rate=1.0,  # Use all frames
...     orient_ball_owning=True
... )
>>>
>>> # Access processed data
>>> print(dataset.data)
>>> print(f"Total frames: {dataset.data['frame_id'].n_unique()}")
>>> print(f"Total plays: {dataset.data['play_id'].n_unique()}")
>>>
>>> # Downsample to 5 Hz (every other frame from 10 Hz)
>>> dataset_5hz = BigDataBowlDataset(
...     tracking_file_path="tracking_week_1.csv",
...     players_file_path="players.csv",
...     plays_file_path="plays.csv",
...     sample_rate=0.5  # Keep every 2nd frame
... )
>>>
>>> # Add dummy labels for GNN training
>>> dataset.add_dummy_labels()
>>> dataset.add_graph_ids()
```

Note

-   Big Data Bowl data uses yards as the unit. The coordinate system is centered at midfield (x=0) with y=0 at the center of the field.
    
-   Player heights and weights are rounded to the nearest 10 cm / 10 kg to protect player privacy while retaining useful anthropometric information.
    
-   The orientation normalization (orient_ball_owning=True) ensures offensive players always attack from left to right, simplifying model training.
    
-   Frame IDs are computed as: play_id \* 100,000 + frameId to ensure global uniqueness.
    
-   The “football” object has team_id=”football” and is included in every frame.
    

Warning

NFL Big Data Bowl data format can vary by year. This loader is tested on 2023-2024 formats. Older competitions may require modifications.

See also

`` `AmericanFootballGraphConverter` ``:

Convert to graph format for GNN training.

[`` `add_dummy_labels()` ``](https://unravelsports.readthedocs.io/en/latest/api/generated/unravel.american_football.BigDataBowlDataset.html#unravel.american_football.BigDataBowlDataset.add_dummy_labels "unravel.american_football.BigDataBowlDataset.add_dummy_labels"): Add placeholder labels for testing. [`` `add_graph_ids()` ``](https://unravelsports.readthedocs.io/en/latest/api/generated/unravel.american_football.BigDataBowlDataset.html#unravel.american_football.BigDataBowlDataset.add_graph_ids "unravel.american_football.BigDataBowlDataset.add_graph_ids"): Add graph identifiers for batching. ../tutorials/american_football: Tutorial on NFL tracking data analysis.

`__init__`(_`tracking_file_path`_, _`players_file_path`_, _`plays_file_path`_, _`sample_rate``=``None`_, _`max_player_speed``=``12.0`_, _`max_ball_speed``=``28.0`_, _`max_player_acceleration``=``6.0`_, _`max_ball_acceleration``=``13.5`_, _`orient_ball_owning``=``True`_, _`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/dataset/dataset.html#BigDataBowlDataset.__init__)

Parameters:

-   **tracking_file_path** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **players_file_path** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **plays_file_path** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **sample_rate** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_player_speed** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_ball_speed** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_player_acceleration** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **max_ball_acceleration** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **orient_ball_owning** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    

`load`()[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/dataset/dataset.html#BigDataBowlDataset.load)

`add_dummy_labels`(_`by``=``['game_id',` `'frame_id']`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/dataset/dataset.html#BigDataBowlDataset.add_dummy_labels)

Parameters:

**by** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_)

Return type:

_DataFrame_

`add_graph_ids`(_`by``=``['game_id']`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/dataset/dataset.html#BigDataBowlDataset.add_graph_ids)

Parameters:

**by** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_)

Return type:

_DataFrame_

```
from unravel.american_football import BigDataBowlDataset

bdb_dataset = BigDataBowlDataset(
    tracking_file_path="tracking_week_1.csv",
    players_file_path="players.csv",
    plays_file_path="plays.csv",
)

# Access the DataFrame
df = bdb_dataset.dataset
print(df.head())
```