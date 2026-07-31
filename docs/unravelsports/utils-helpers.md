---
source_url: https://unravelsports.readthedocs.io/en/latest/api/utils/helpers.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.625Z
---
[unravelsports](https://unravelsports.readthedocs.io/en/latest/index.html)

Helper functions for data manipulation.

`unravel.utils.``dummy_labels`(_`dataset`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/utils.html#dummy_labels)

Create dummy labels to feed into GraphNeuralNetworkConverter

Parameters:

**dataset** ([_TrackingDataset_](https://kloppy.pysport.org/reference/domain/models/tracking/tracking-dataset/#kloppy.domain.TrackingDataset "(in kloppy 3.18.0 v0.0.0)"))

Return type:

[_Dict_](https://docs.python.org/3/library/typing.html#typing.Dict "(in Python v3.14)")

`unravel.utils.``add_dummy_label_column`(_`dataset`_, _`by``=``['gameId',` `'playId',` `'frameId']`_, _`column_name``=``'label'`_, _`random_seed``=``None`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/utils.html#add_dummy_label_column)

Parameters:

-   **dataset** (_DataFrame_)
    
-   **by** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_)
    
-   **column_name** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    
-   **random_seed** ([_float_](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)") _|_ _None_)
    

`unravel.utils.``dummy_graph_ids`(_`dataset`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/utils.html#dummy_graph_ids)

Create dummy graph_ids to feed into GraphNeuralNetworkConverter

Parameters:

**dataset** ([_TrackingDataset_](https://kloppy.pysport.org/reference/domain/models/tracking/tracking-dataset/#kloppy.domain.TrackingDataset "(in kloppy 3.18.0 v0.0.0)"))

Return type:

[_Dict_](https://docs.python.org/3/library/typing.html#typing.Dict "(in Python v3.14)")

`unravel.utils.``add_graph_id_column`(_`dataset`_, _`by``=``['game_id',` `'play_id']`_, _`column_name``=``'graph_id'`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/utils.html#add_graph_id_column)

Parameters:

-   **dataset** (_DataFrame_)
    
-   **by** ([_List_](https://docs.python.org/3/library/typing.html#typing.List "(in Python v3.14)")_\[_[_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)")_\]_)
    
-   **column_name** ([_str_](https://docs.python.org/3/library/stdtypes.html#str "(in Python v3.14)"))
    

```
from unravel.utils import add_dummy_label_column

# Add random binary labels
dataset.dataset = add_dummy_label_column(dataset.dataset)
```

## Adding Graph IDs

```
from unravel.utils import add_graph_id_column

# Each frame is a separate graph
dataset.dataset = add_graph_id_column(dataset.dataset, by=["frame_id"])

# Group by possession
dataset.dataset = add_graph_id_column(
    dataset.dataset,
    by=["ball_owning_team_id", "period_id"]
)
```