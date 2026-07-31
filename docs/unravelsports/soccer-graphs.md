---
source_url: https://unravelsports.readthedocs.io/en/latest/api/soccer/graphs.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.624Z
---
Converting soccer tracking data to graph structures for GNN training.

_`class`_ `unravel.soccer.``SoccerGraphConverter`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/graphs/graph_converter.html#SoccerGraphConverter)

Bases: `` `DefaultGraphConverter` ``

Convert soccer tracking data from Polars DataFrame to graph structures for GNN training.

This class transforms soccer tracking data into graph representations suitable for Graph Neural Networks. Each frame of tracking data becomes a graph with players and the ball as nodes, with edges representing spatial relationships or team affiliations.

The converter supports two GNN frameworks: - PyTorch Geometric (recommended) via `` `to_pytorch_graphs()` `` - Spektral (deprecated, Python 3.11 only) via `` `to_spektral_graphs()` ``

Graph Structure:

-   **Nodes**: Players (home team, away team) and ball
    
-   **Node Features**: Position, velocity, acceleration, distances, angles (12 default features)
    
-   **Edges**: Defined by adjacency_matrix_type (team-based, spatial, or dense)
    
-   **Edge Features**: Distances, angles, relative velocities (6-7 default features)
    
-   **Global Features**: Optional match-level features attached to ball node
    

Key Features:

-   Configurable node and edge feature engineering
    
-   Multiple adjacency matrix types (split_by_team, delaunay, dense)
    
-   Custom feature functions via decorators
    
-   Automatic padding for fixed-size graphs
    
-   Ball connection strategies (all players, carrier only, none)
    
-   Permutation invariance via random node ordering
    

Parameters:

-   **dataset** ([`` `KloppyPolarsDataset` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.KloppyPolarsDataset")) – Polars dataset with tracking data. Must have been processed with [`` `add_graph_ids()` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset.add_graph_ids "unravel.soccer.KloppyPolarsDataset.add_graph_ids") and optionally [`` `add_dummy_labels()` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset.add_dummy_labels "unravel.soccer.KloppyPolarsDataset.add_dummy_labels").
    
-   **chunk_size** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Number of graphs to process simultaneously. Higher values use more memory but may be faster. Defaults to 20000.
    
-   **non_potential_receiver_node_value** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Node feature value (0-1) assigned to defending team players. Used to distinguish attackers from defenders. Defaults to 0.1.
    
-   **edge_feature_funcs** (`` `List[Callable]` ``, _optional_) – Custom edge feature functions decorated with `` `@graph_feature(type="edge")` ``. If None, uses defaults. Defaults to None.
    
-   **node_feature_funcs** (`` `List[Callable]` ``, _optional_) – Custom node feature functions decorated with `` `@graph_feature(type="node")` ``. If None, uses defaults. Defaults to None.
    
-   **global_feature_cols** (`` `List[str]` ``, _optional_) – Column names from the dataset to use as graph-level features (e.g., match score, team ratings). Must be constant within each graph_id group. Defaults to empty list.
    
-   **global_feature_type** (`` `Literal[``` ``”ball”`` `,` ```"all"` ```` `]` ``, _optional_) – Where to attach global features. “ball” attaches to ball node only, “all” attaches to all nodes. Defaults to “ball”.
    
-   **additional_feature_cols** (`` `List[str]` ``, _optional_) – Extra columns from dataset to make available to custom feature functions (e.g., player height, position). Defaults to empty list.
    

`settings`

Configuration for graph conversion including adjacency matrix type, padding, and feature settings.

Type:

`` `GraphSettingsPolars` ``

`n_node_features`

Total number of node features per node.

Type:

[`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")

`n_edge_features`

Total number of edge features per edge.

Type:

[`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")

`n_graph_features`

Total number of global/graph-level features.

Type:

[`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")

Raises:

-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If dataset is not a KloppyPolarsDataset.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If required columns (graph_id, label) are missing.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If custom feature functions are not properly decorated.
    

Example

```
>>> from unravel.soccer import KloppyPolarsDataset, SoccerGraphConverter
>>> from kloppy import sportec
>>>
>>> # Load and prepare data
>>> kloppy_dataset = sportec.load_open_tracking_data(only_alive=True)
>>> polars_dataset = KloppyPolarsDataset(kloppy_dataset=kloppy_dataset)
>>> polars_dataset.add_dummy_labels(by=["frame_id"])
>>> polars_dataset.add_graph_ids(by=["frame_id"])
>>>
>>> # Create converter
>>> converter = SoccerGraphConverter(
...     dataset=polars_dataset,
...     self_loop_ball=True,
...     adjacency_matrix_connect_type="ball",
...     adjacency_matrix_type="split_by_team",
...     label_type="binary",
... )
>>>
>>> # Convert to PyTorch Geometric format
>>> graphs = converter.to_pytorch_graphs()
>>> print(f"Created {len(graphs)} graphs")
>>> print(f"Node features: {converter.n_node_features}")
>>> print(f"Edge features: {converter.n_edge_features}")
```

Note

For detailed configuration options, see `` `GraphSettingsPolars` ``. For custom features, see [`` `graph_feature()` ``](https://unravelsports.readthedocs.io/en/latest/api/utils/features.html#unravel.utils.features.graph_feature "unravel.utils.features.graph_feature") decorator.

Warning

If not using padding (`` `pad=False` ``), graphs with incomplete player data (< 22 players) will be dropped. Use `` `pad=True` `` for variable-sized teams.

`dataset`_`:` [`KloppyPolarsDataset`](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.dataset.kloppy_polars.KloppyPolarsDataset")_ _`=` `None`_

`chunk_size`_`:` [`int`](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")_ _`=` `20000`_

`non_potential_receiver_node_value`_`:` [`float`](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)")_ _`=` `0.1`_

`edge_feature_funcs`_`:` [`List`](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")`[`[`Callable`](https://docs.python.org/3/library/typing.html#typing.Callable "(in Python v3.14)")`[``[`[`Dict`](https://docs.python.org/3/library/typing.html#typing.Dict "(in Python v3.14)")`[`[`str`](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")`,` [`Any`](https://docs.python.org/3/library/typing.html#typing.Any "(in Python v3.14)")`]``]``,` [`ndarray`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html#numpy.ndarray "(in NumPy v2.4)")`]``]`_

`node_feature_funcs`_`:` [`List`](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")`[`[`Callable`](https://docs.python.org/3/library/typing.html#typing.Callable "(in Python v3.14)")`[``[`[`Dict`](https://docs.python.org/3/library/typing.html#typing.Dict "(in Python v3.14)")`[`[`str`](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")`,` [`Any`](https://docs.python.org/3/library/typing.html#typing.Any "(in Python v3.14)")`]``]``,` [`ndarray`](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html#numpy.ndarray "(in NumPy v2.4)")`]``]`_

`global_feature_cols`_`:` [`List`](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")`[`[`str`](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")`]` `|` [`None`](https://docs.python.org/3/library/constants.html#None "(in Python v3.14)")_

`global_feature_type`_`:` [`Literal`](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")`[``'ball'``,` `'all'``]`_ _`=` `'ball'`_

`additional_feature_cols`_`:` [`List`](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")`[`[`str`](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")`]` `|` [`None`](https://docs.python.org/3/library/constants.html#None "(in Python v3.14)")_

_`property`_ `default_node_feature_funcs`_`:` [`list`](https://docs.python.org/3/library/stdtypes.html#list "(in Python v3.14)")_

_`property`_ `default_edge_feature_funcs`_`:` [`list`](https://docs.python.org/3/library/stdtypes.html#list "(in Python v3.14)")_

`get_players_by_team_id`(_`team_id`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/graphs/graph_converter.html#SoccerGraphConverter.get_players_by_team_id)

`get_player_by_id`(_`player_id`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/graphs/graph_converter.html#SoccerGraphConverter.get_player_by_id)

`plot`(_`file_path`_, _`fps``=``None`_, _`timestamp``=``None`_, _`end_timestamp``=``None`_, _`period_id``=``None`_, _`team_color_a``=``'#CD0E61'`_, _`team_color_b``=``'#0066CC'`_, _`ball_color``=``'black'`_, _`sort``=``True`_, _`color_by``=``'ball_owning'`_, _`anonymous``=``False`_, _`plot_type``=``'full'`_, _`show_label``=``True`_, _`show_ball_label``=``False`_, _`show_timestamp``=``True`_, _`next_closest_timestamp``=``False`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/graphs/graph_converter.html#SoccerGraphConverter.plot)

Plot tracking data as a static image or video file.

This method visualizes tracking data for players and the ball. It can generate either: - A single PNG image (if either fps or end_timestamp is None, or both are None) - An MP4 video (if both fps and end_timestamp are provided)

Parameters:

-   **file_path** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")) – The output path where the PNG or MP4 file will be saved
    
-   **fps** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Frames per second for video output. If None, a static image is generated
    
-   **timestamp** (`` `pl.duration` ``, _optional_) – The starting timestamp to plot. If None, starts from the beginning of available data
    
-   **end_timestamp** (`` `pl.duration` ``, _optional_) – The ending timestamp for video output. If None, a static image is generated
    
-   **period_id** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – ID of the match period to visualize. If None, all periods are included
    
-   **team_color_a** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"), _default_ `` `"#CD0E61"` ``) – Hex color code for Team A visualization
    
-   **team_color_b** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"), _default_ `` `"#0066CC"` ``) – Hex color code for Team B visualization
    
-   **ball_color** ([`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"), _default_ `` `"black"` ``) – Color for ball visualization
    
-   **color_by** (`` `Literal[``` ``”ball_owning”`` `,` ```"static_home_away"` ```` `]` ``, _default_ `` `"ball_owning"` ``) – Method for coloring the teams: - “ball_owning”: Colors teams based on ball possession - “static_home_away”: Uses static colors for home and away teams
    
-   **anonymous** ([`` `bool` ``](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"), _default_ [`` `False` ``](https://docs.python.org/3/library/constants.html#False "(in Python v3.14)")) – Whether to anonymize player labels
    
-   **plot_type** (`` `Literal[``` ``”pitch_only”`` `,` ```"graph_only"` ``, `` `"full"` ```` `]` ``, _default_ `` `"full"` ``) – Type of plot to generate: - “pitch_only”: Shows only the soccer pitch visualization - “graph_only”: Shows only the graph features (node features, adjacency matrix, edge features) - “full”: Shows both pitch and graph visualizations
    
-   **show_pitch_label** ([`` `bool` ``](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"), _default_ [`` `True` ``](https://docs.python.org/3/library/constants.html#True "(in Python v3.14)")) – Whether to show the label on the pitch visualization
    
-   **show_pitch_timestamp** ([`` `bool` ``](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"), _default_ [`` `True` ``](https://docs.python.org/3/library/constants.html#True "(in Python v3.14)")) – Whether to show the timestamp on the pitch visualization
    
-   **next_closest_timestamp** ([`` `bool` ``](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"), _default_ [`` `False` ``](https://docs.python.org/3/library/constants.html#False "(in Python v3.14)")) – When plotting a .png and the timestamp isn’t 100% correct we find the next correct timestamp and use that to plot.
    
-   **sort** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **show_label** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **show_ball_label** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **show_timestamp** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    

Returns:

The function saves the output file to the specified file_path but doesn’t return any value

Return type:

[`` `None` ``](https://docs.python.org/3/library/constants.html#None "(in Python v3.14)")

Notes

Output file type is determined by parameters: - PNG: Generated when either fps or end_timestamp is None, or both are None - MP4: Generated when both fps and end_timestamp are provided

Raises:

[**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If file extension doesn’t match the parameters provided (e.g., .mp4 extension but missing fps or end_timestamp, or .png extension with both fps and end_timestamp)

Parameters:

-   **file_path** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **fps** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **timestamp** (_duration_)
    
-   **end_timestamp** (_duration_)
    
-   **period_id** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **team_color_a** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **team_color_b** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **ball_color** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **sort** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **color_by** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'ball_owning'__,_ _'static_home_away'__\]_)
    
-   **anonymous** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **plot_type** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'pitch_only'__,_ _'graph_only'__,_ _'full'__\]_)
    
-   **show_label** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **show_ball_label** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **show_timestamp** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **next_closest_timestamp** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    

`__init__`(_`engine='auto'`_, _`prediction=False`_, _`self_loop_ball=False`_, _`adjacency_matrix_connect_type='ball'`_, _`adjacency_matrix_type='split_by_team'`_, _`label_type='binary'`_, _`defending_team_node_value=0.1`_, _`random_seed=False`_, _`pad=False`_, _`verbose=False`_, _`label_col=None`_, _`graph_id_col=None`_, _`sample_rate=None`_, _`dataset=None`_, _`chunk_size=20000`_, _`non_potential_receiver_node_value=0.1`_, _`edge_feature_funcs=<factory>`_, _`node_feature_funcs=<factory>`_, _`global_feature_cols=<factory>`_, _`global_feature_type='ball'`_, _`additional_feature_cols=<factory>`_)

Parameters:

-   **engine** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'auto'__,_ _'gpu'__\]_)
    
-   **prediction** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **self_loop_ball** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **adjacency_matrix_connect_type** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'ball'__,_ _'ball_carrier'__,_ _'no_connection'__\]_)
    
-   **adjacency_matrix_type** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'delaunay'__,_ _'split_by_team'__,_ _'dense'__,_ _'dense_ap'__,_ _'dense_dp'__\]_)
    
-   **label_type** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'binary'__\]_)
    
-   **defending_team_node_value** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **random_seed** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)") _|_ [_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **pad** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **verbose** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"))
    
-   **label_col** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **graph_id_col** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **sample_rate** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **dataset** ([_KloppyPolarsDataset_](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.dataset.kloppy_polars.KloppyPolarsDataset"))
    
-   **chunk_size** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **non_potential_receiver_node_value** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **edge_feature_funcs** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_Callable_](https://docs.python.org/3/library/typing.html#typing.Callable "(in Python v3.14)")_\[__\[_[_Dict_](https://docs.python.org/3/library/typing.html#typing.Dict "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_,_ [_Any_](https://docs.python.org/3/library/typing.html#typing.Any "(in Python v3.14)")_\]__\]__,_ [_ndarray_](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html#numpy.ndarray "(in NumPy v2.4)")_\]__\]_)
    
-   **node_feature_funcs** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_Callable_](https://docs.python.org/3/library/typing.html#typing.Callable "(in Python v3.14)")_\[__\[_[_Dict_](https://docs.python.org/3/library/typing.html#typing.Dict "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_,_ [_Any_](https://docs.python.org/3/library/typing.html#typing.Any "(in Python v3.14)")_\]__\]__,_ [_ndarray_](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html#numpy.ndarray "(in NumPy v2.4)")_\]__\]_)
    
-   **global_feature_cols** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_ _|_ _None_)
    
-   **global_feature_type** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'ball'__,_ _'all'__\]_)
    
-   **additional_feature_cols** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_ _|_ _None_)
    

Return type:

None

`settings`_`:` `DefaultGraphSettings`_

```
from unravel.soccer import SoccerGraphConverter

converter = SoccerGraphConverter(
    dataset=polars_dataset,
    self_loop_ball=True,
    adjacency_matrix_connect_type="ball",
    adjacency_matrix_type="split_by_team",
    label_type="binary",
)

# Convert to PyTorch Geometric
graphs = converter.to_pytorch_graphs()

# Or Spektral (deprecated)
graphs = converter.to_spektral_graphs()
```