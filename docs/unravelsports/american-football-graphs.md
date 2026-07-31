---
source_url: https://unravelsports.readthedocs.io/en/latest/api/american_football/graphs.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.624Z
---
Converting NFL tracking data to graph structures.

_`class`_ `unravel.american_football.``AmericanFootballGraphConverter`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/graphs/graph_converter.html#AmericanFootballGraphConverter)

Bases: `` `DefaultGraphConverter` ``

Convert NFL Big Data Bowl tracking data to graph structures for GNN training.

This class transforms American Football tracking data from Polars DataFrames into graph representations suitable for Graph Neural Networks (GNNs). Each frame becomes a graph with players and the football as nodes, with edges representing spatial relationships or team affiliations.

The converter supports two GNN frameworks: - PyTorch Geometric (recommended) via `` `to_pytorch_graphs()` `` - Spektral (deprecated, Python 3.11 only) via `` `to_spektral_graphs()` ``

Graph Structure:

-   **Nodes**: Players (22 total: 11 offense + 11 defense) and football
    
-   **Node Features**: Position, velocity, acceleration, orientation, direction, height, weight, position type (12+ default features)
    
-   **Edges**: Defined by adjacency_matrix_type (team-based, spatial, or dense)
    
-   **Edge Features**: Distances, angles, relative velocities, orientations (7 default features)
    
-   **Global Features**: Optional play-level features attached to football node
    
-   **Labels**: Play outcome or custom labels (e.g., yards gained, tackle probability)
    

The graph structure captures: - Offensive and defensive formations - Player movements and accelerations - Spatial relationships between players - Position-specific information (QB, WR, CB, etc.) - Body orientations and movement directions - Anthropometric data (height, weight)

Parameters:

-   **dataset** ([`` `BigDataBowlDataset` ``](https://unravelsports.readthedocs.io/en/latest/api/generated/unravel.american_football.BigDataBowlDataset.html#unravel.american_football.BigDataBowlDataset "unravel.american_football.BigDataBowlDataset")) – Preprocessed NFL tracking data with player positions, velocities, and play information.
    
-   **chunk_size** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Number of frames to process per batch for memory efficiency. Defaults to 2000.
    
-   **attacking_non_qb_node_value** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Node feature value (0-1) assigned to offensive players who are not the quarterback. Used to distinguish QB from other offensive players in node features. Defaults to 0.1.
    
-   **graph_feature_cols** (`` `Optional[List[str]]` ``, _optional_) – List of column names containing graph-level features (e.g., win probability, expected points) to attach to the football node. These columns must have the same value for all nodes in each frame. Defaults to None (no graph features).
    
-   **\*\*kwargs** – Additional parameters passed to DefaultGraphConverter, including: - adjacency_matrix_type: Edge connectivity pattern - label_col: Column name for graph labels - graph_id_col: Column name for graph identifiers - prediction: Whether in prediction mode (no labels)
    

`dataset`

Processed tracking data from BigDataBowlDataset.

Type:

`` `pl.DataFrame` ``

`settings`

Configuration with pitch dimensions, adjacency patterns, and feature settings.

Type:

`` `AmericanFootballGraphSettings` ``

`label_column`

Name of the label column for supervised learning.

Type:

[`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")

`graph_id_column`

Name of the graph ID column for batching.

Type:

[`` `str` ``](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")

Raises:

-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If dataset is not an instance of BigDataBowlDataset.
    
-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If label_column or graph_id_column are not strings.
    
-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If label_column is missing when not in prediction mode.
    
-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If graph_id_column is missing from dataset.
    
-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If attacking_non_qb_node_value is not float or int.
    
-   [**Exception**](https://docs.python.org/3/library/exceptions.html#Exception "(in Python v3.14)") – If frames with missing football or insufficient players are detected.
    

Example

```
>>> from unravel.american_football.dataset import BigDataBowlDataset
>>> from unravel.american_football.graphs import AmericanFootballGraphConverter
>>>
>>> # Load Big Data Bowl data
>>> dataset = BigDataBowlDataset(
...     tracking_file_path="tracking.csv",
...     players_file_path="players.csv",
...     plays_file_path="plays.csv"
... )
>>>
>>> # Add labels and graph IDs
>>> dataset.add_dummy_labels()
>>> dataset.add_graph_ids()
>>>
>>> # Initialize converter
>>> converter = AmericanFootballGraphConverter(
...     dataset=dataset,
...     adjacency_matrix_type="delaunay",
...     label_col="label",
...     graph_id_col="graph_id"
... )
>>>
>>> # Convert to PyTorch Geometric format
>>> pyg_dataset = converter.to_pytorch_graphs()
>>> print(f"Number of graphs: {len(pyg_dataset)}")
>>> print(f"Node features: {pyg_dataset[0].x.shape}")
>>> print(f"Edge features: {pyg_dataset[0].edge_attr.shape}")
>>>
>>> # Add graph-level features (e.g., expected points)
>>> # First, join expected points to dataset
>>> dataset.data = dataset.data.join(
...     expected_points_df,
...     on=["game_id", "play_id"],
...     how="left"
... )
>>> converter = AmericanFootballGraphConverter(
...     dataset=dataset,
...     graph_feature_cols=["expected_points", "win_probability"]
... )
>>> pyg_dataset = converter.to_pytorch_graphs()
```

Note

-   The converter automatically filters out frames with missing footballs or insufficient players (< 10 per frame).
    
-   Node ordering: Offensive players (sorted by ascending team_id sort), then defensive players, then football (always last).
    
-   The QB receives a special node feature value (1.0), while other offensive players receive attacking_non_qb_node_value (default 0.1).
    
-   Graph-level features must be constant within each frame. If they vary, a ValueError is raised.
    
-   Position names are encoded as one-hot vectors in node features.
    

Warning

Spektral support is deprecated and only works on Python 3.11. Use PyTorch Geometric for new projects.

See also

`` `BigDataBowlDataset` ``: Data loading

and preprocessing.

`` `to_pytorch_graphs()` ``: Convert to PyTorch Geometric DataLoader. `` `to_spektral_graphs()` ``: Convert to Spektral format (deprecated). ../tutorials/american_football: Complete tutorial on NFL GNN modeling.

`__init__`(_`dataset`_, _`chunk_size``=``2000`_, _`attacking_non_qb_node_value``=``0.1`_, _`graph_feature_cols``=``None`_, _`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/american_football/graphs/graph_converter.html#AmericanFootballGraphConverter.__init__)

Parameters:

-   **dataset** ([_BigDataBowlDataset_](https://unravelsports.readthedocs.io/en/latest/api/generated/unravel.american_football.BigDataBowlDataset.html#unravel.american_football.BigDataBowlDataset "unravel.american_football.dataset.dataset.BigDataBowlDataset"))
    
-   **chunk_size** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    
-   **attacking_non_qb_node_value** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"))
    
-   **graph_feature_cols** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_ _|_ _None_)
    

_`property`_ `return_dtypes`

```
from unravel.american_football import AmericanFootballGraphConverter

converter = AmericanFootballGraphConverter(
    dataset=bdb_dataset,
    self_loop_ball=True,
    adjacency_matrix_connect_type="ball",
    adjacency_matrix_type="split_by_team",
    label_type="binary",
)

graphs = converter.to_pytorch_graphs()
```