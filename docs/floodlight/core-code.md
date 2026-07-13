---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/code.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.365Z
---
_`class`_ `floodlight.core.code.``Code`(_`code`_, _`name`_, _`definitions``=``None`_, _`framerate``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/code.html#Code)[](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "Link to this definition")

Fragment of continuous signal encoding one game state. Core class of floodlight.

Parameters:

-   **code** (_np.ndarray_) – One-dimensional array with codes describing a sequence of play.
    
-   **name** (_str_) – Name of encoded game state (e.g. ‘possession’).
    
-   **definitions** (_dict, optional_) – Dictionary of the form {token: definition} where each code category is defined or explained.
    
-   **framerate** (_int, optional_) – Temporal resolution of data in frames per second/Hertz.
    

Variables:

**token** (_list_) – A list of all tokens used in game code, in ascending order.

`find_sequences`(_`return_type``=``'dict'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/code.html#Code.find_sequences)[](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code.find_sequences "Link to this definition")

Finds all sequences of consecutive appearances for each token and returns their start and end indices.

Parameters:

**return_type** (_{‘dict’, ‘list’}, default=’dict’_) – Specifies type of the returned sequences object.

Returns:

**sequences** – If `` `return_type` `` is ‘dict’, returns a dictionary of the form `` `{token:` `[(sequence_start_idx,` `sequence_end_idx)]}` ``. If `` `return_type` `` is ‘list’, returns a list of the form `` `[(sequence_start_idx,` `sequence_end_idx,` `token)]` `` ordered by the respective sequence start indices.

Return type:

Union\[Dict\[Any, tuple\], List\[tuple\]\]

Examples

```
>>> import numpy as np
>>> from floodlight import Code
```

```
>>> code = Code(code=np.array([1, 1, 2, 1, 1, 3, 1, 1]), name="intensity")
>>> code.find_sequences()
{1: [(0, 2), (3, 5), (6, 8)], 2: [(2, 3)], 3: [(5, 6)]}
```

```
>>> code = Code(code=np.array(['A', 'A', 'H', 'H', 'H', 'H', 'A', 'A', 'A']),
...                           name="possession")
>>> code.find_sequences(return_type="list")
[(0, 2, 'A'), (2, 6, 'H'), (6, 9, 'A')]
```

`slice`(_`startframe``=``None`_, _`endframe``=``None`_, _`inplace``=``False`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/code.html#Code.slice)[](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code.slice "Link to this definition")

Return copy of object with sliced code. Mimics numpy’s array slicing.

Parameters:

-   **startframe** (_int, optional_) – Start of slice. Defaults to beginning of segment.
    
-   **endframe** (_int, optional_) – End of slice (endframe is excluded). Defaults to end of segment.
    
-   **inplace** (_bool, optional_) – If set to `` `False` `` (default), a new object is returned, otherwise the operation is performed in place on the called object.
    

Returns:

**code_sliced**

Return type:

Union\[[Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code"), None\]

_`property`_ `token`_`:` `list`_[](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code.token "Link to this definition")

A list of all tokens used in game code, in ascending order.