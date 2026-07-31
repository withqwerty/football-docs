---
source_url: https://unravelsports.readthedocs.io/en/latest/api/utils/objects.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.625Z
---
Base classes and core data structures.

_`class`_ `unravel.utils.``GraphDataset`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/objects/graph_dataset.html#GraphDataset)

Bases:

Factory function that creates the appropriate dataset based on format.

Parameters:

-   **format** – Format specification (‘spektral’ or ‘pyg’). Defaults to ‘spektral’.
    
-   **\*\*kwargs** – Arguments passed to the dataset constructor
    

Returns:

SpektralGraphDataset or PyGGraphDataset depending on format

Examples

\# Spektral format (default) dataset = GraphDataset(graphs=spektral_graph_list, format=’spektral’)

\# PyG format dataset = GraphDataset(graphs=pyg_data_list, format=’pyg’)

\# From pickle files dataset = GraphDataset(pickle_file=’graphs.pickle.gz’, format=’pyg’)

```
from unravel.utils import GraphDataset

# Create dataset
dataset = GraphDataset(graphs=graphs, format="pyg")

# Split data
train, test, val = dataset.split_test_train_validation(4, 1, 1)
```