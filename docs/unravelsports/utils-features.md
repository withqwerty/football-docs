---
source_url: https://unravelsports.readthedocs.io/en/latest/api/utils/features.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.625Z
---
Feature engineering utilities and decorators.

The features module provides built-in feature functions and a decorator for creating custom graph features.

`unravel.utils.features.``graph_feature`(_`feature_type`_, _`is_custom``=``False`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/features/utils.html#graph_feature)

A decorator factory that returns a decorator function.

Parameters:

-   **feature_type** ([_Literal_](https://docs.python.org/3/library/typing.html#typing.Literal "(in Python v3.14)")_\[__'edge'__,_ _'node'__\]_) – The type of feature (“edge” or “node”)
    
-   **is_custom** ([_bool_](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)")) – Whether this is a custom feature
    

Returns:

A decorator function that will mark the decorated function

`unravel.utils.features.``x_normed`(_`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/features/builtin.html#x_normed)

`unravel.utils.features.``y_normed`(_`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/features/builtin.html#y_normed)

`unravel.utils.features.``speeds_normed`(_`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/features/builtin.html#speeds_normed)

`unravel.utils.features.``velocity_components_2d_normed`(_`**``kwargs`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/utils/features/builtin.html#velocity_components_2d_normed)

```
from unravel.utils.features import graph_feature

@graph_feature(
    cols=["x", "y"],
    returns=["distance_from_center"],
    type="node"
)
def distance_from_center(x, y):
    import polars as pl
    return [pl.sqrt(x**2 + y**2)]

# Use in converter
from unravel.soccer import SoccerGraphConverter

converter = SoccerGraphConverter(
    dataset=polars_dataset,
    node_feature_cols=[distance_from_center],
)
```