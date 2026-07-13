---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/property.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.365Z
---
_`class`_ `floodlight.core.property.``DyadicProperty`(_`property`_, _`name`_, _`framerate``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/property.html#DyadicProperty)[](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.DyadicProperty "Link to this definition")

Fragment of one continuous property per player dyad. Core class of floodlight.

Parameters:

-   **property** (_np.ndarray_) – A 3-dimensional array of properties of shape (T, N_1, N_2), where T is the number of total frames and {N_1, N_2} are the number of players between dyads are formed. For example, the item at (1, 2, 3) encodes the relation from player with xID=2 to player with xID=3 at frame 1. Note that players could be in the same team (intra-team relations, in this case N_1 = N_2) or opposing teams (inter-team relations).
    
-   **name** (_str_) – Name of the property (e.g. ‘distance’).
    
-   **framerate** (_int, optional_) – Temporal resolution of data in frames per second/Hertz.
    

`slice`(_`startframe``=``None`_, _`endframe``=``None`_, _`inplace``=``False`_)[](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.DyadicProperty.slice "Link to this definition")

Return copy of object with sliced property. Mimics numpy’s array slicing.

Parameters:

-   **startframe** (_int, optional_) – Start of slice. Defaults to beginning of segment.
    
-   **endframe** (_int, optional_) – End of slice (endframe is excluded). Defaults to end of segment.
    
-   **inplace** (_bool, optional_) – If set to `` `False` `` (default), a new object is returned, otherwise the operation is performed in place on the called object.
    

Returns:

**property_sliced**

Return type:

Union\[cls, None\]

_`class`_ `floodlight.core.property.``PlayerProperty`(_`property`_, _`name`_, _`framerate``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/property.html#PlayerProperty)[](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "Link to this definition")

Fragment of one continuous property per player. Core class of floodlight.

Parameters:

-   **property** (_np.ndarray_) – A 2-dimensional array of properties of shape (T, N), where T is the number of total frames and N is the number of players.
    
-   **name** (_str_) – Name of the property (e.g. ‘speed’).
    
-   **framerate** (_int, optional_) – Temporal resolution of data in frames per second/Hertz.
    

`slice`(_`startframe``=``None`_, _`endframe``=``None`_, _`inplace``=``False`_)[](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty.slice "Link to this definition")

Return copy of object with sliced property. Mimics numpy’s array slicing.

Parameters:

-   **startframe** (_int, optional_) – Start of slice. Defaults to beginning of segment.
    
-   **endframe** (_int, optional_) – End of slice (endframe is excluded). Defaults to end of segment.
    
-   **inplace** (_bool, optional_) – If set to `` `False` `` (default), a new object is returned, otherwise the operation is performed in place on the called object.
    

Returns:

**property_sliced**

Return type:

Union\[cls, None\]

_`class`_ `floodlight.core.property.``TeamProperty`(_`property`_, _`name`_, _`framerate``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/property.html#TeamProperty)[](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty "Link to this definition")

Fragment of one continuous team property. Core class of floodlight.

Parameters:

-   **property** (_np.ndarray_) – A 1-dimensional array of properties of shape (T), where T is the number of total frames.
    
-   **name** (_str_) – Name of the property (e.g. ‘stretch_index’).
    
-   **framerate** (_int, optional_) – Temporal resolution of data in frames per second/Hertz.
    

`slice`(_`startframe``=``None`_, _`endframe``=``None`_, _`inplace``=``False`_)[](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty.slice "Link to this definition")

Return copy of object with sliced property. Mimics numpy’s array slicing.

Parameters:

-   **startframe** (_int, optional_) – Start of slice. Defaults to beginning of segment.
    
-   **endframe** (_int, optional_) – End of slice (endframe is excluded). Defaults to end of segment.
    
-   **inplace** (_bool, optional_) – If set to `` `False` `` (default), a new object is returned, otherwise the operation is performed in place on the called object.
    

Returns:

**property_sliced**

Return type:

Union\[cls, None\]