---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/xy.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.365Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

_`class`_ `floodlight.core.xy.``XY`(_`xy`_, _`framerate``=``None`_, _`direction``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "Link to this definition")

Spatio-temporal data fragment. Core class of floodlight.

Parameters:

-   **xy** (_np.ndarray_) – Full data array containing x- and y-coordinates, where each player’s coordinates occupy two consecutive columns.
    
-   **framerate** (_int, optional_) – Temporal resolution of data in frames per second/Hertz.
    
-   **direction** (_{‘lr’, ‘rl’}, optional_) – Playing direction of players in data fragment, should be either ‘lr’ (left-to-right) or ‘rl’ (right-to-left).
    

Variables:

-   **x** (_np.ndarray_) – X-data array, where each player’s x-coordinates occupy one column.
    
-   **y** (_np.ndarray_) – Y-data array, where each player’s y-coordinates occupy one column.
    
-   **N** (_int_) – The object’s number of players.
    

`frame`(_`t`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.frame)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.frame "Link to this definition")

Returns data for given frame _t_.

Parameters:

**t** (_int_) – Frame index.

Returns:

**frame** – One-dimensional xy-data row for given frame.

Return type:

np.ndarray

`player`(_`xID`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.player)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.player "Link to this definition")

Returns data for player with given player index _xID_.

Parameters:

**xID** (_int_) – Player index.

Returns:

**player** – Two-dimensional xy-data for given player.

Return type:

np.ndarray

`plot`(_`t`_, _`plot_type``=``'positions'`_, _`ball``=``False`_, _`ax``=``None`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.plot)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.plot "Link to this definition")

Plots a snapshot or time interval of the object’s spatiotemporal data on a matplotlib axes.

Parameters:

-   **t** (_Union\[int, Tuple \[int, int\]\]_) – Frame for which positions should be plotted if plot_type == ‘positions’, or a Tuple that has the form (start_frame, end_frame) if plot_type == ‘trajectories’.
    
-   **plot_type** (_str, optional_) – One of {‘positions’, ‘trajectories’}. Determines which plotting function is called. Defaults to ‘positions’.
    
-   **ball** (_bool, optional_) – Boolean indicating whether this object is storing ball data. If set to True, the styling is adjusted accordingly. Defaults to False.
    
-   **ax** (_matplotlib.axes, optional_) – Axes from matplotlib library to plot on. Defaults to None.
    
-   **kwargs** – Optional keyworded arguments e.g. {‘color’, ‘zorder’, ‘marker’, ‘linestyle’, ‘alpha’} which can be used for the plot functions from matplotlib. The kwargs are only passed to all the plot functions of matplotlib. If not given default values are used (see floodlight.vis.positions).
    

Returns:

**axes** – Axes from matplotlib library on which the specified plot type is plotted.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html). For example in order to modify the color of the points and lines pass a color name or rgb-value ([matplotlib colors](https://matplotlib.org/3.5.0/tutorials/colors/colors.html)) to the keyworded argument ‘color’. The same principle applies to other kwargs like ‘zorder’, ‘marker’ and ‘linestyle’.

Examples

-   [Positions plot](https://floodlight.readthedocs.io/en/latest/modules/vis/positions.html#positions-plot-label)
    
-   [Trajectories plot](https://floodlight.readthedocs.io/en/latest/modules/vis/positions.html#trajectories-plot-label)
    

`point`(_`t`_, _`xID`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.point)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.point "Link to this definition")

Returns data for a point determined by frame _t_ and player index _xID_.

Parameters:

-   **t** (_int_) – Frame index.
    
-   **xID** (_int_) – Player index.
    

Returns:

**point** – Point-data of shape (2,)

Return type:

np.ndarray

`reflect`(_`axis`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.reflect)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.reflect "Link to this definition")

Reflects data on given axis.

Parameters:

**axis** (_{‘x’, ‘y’}_) – Name of reflection axis. If set to “x”, data is reflected on x-axis, if set to “y”, data is reflected on y-axis.

`rotate`(_`alpha`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.rotate)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.rotate "Link to this definition")

Rotates data on given angle ‘alpha’ around the origin.

Parameters:

**alpha** (_float_) – Rotation angle in degrees. Alpha must be between -360 and 360. If positive alpha, data is rotated in counter clockwise direction around the origin. If negative, data is rotated in clockwise direction around the origin.

Notes

Executing this method will cast the object’s xy attribute to dtype np.float32 if it previously has a non-floating dtype.

`scale`(_`factor`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.scale)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.scale "Link to this definition")

Scales data by a given factor and optionally selected axis.

Parameters:

-   **factor** (_float_) – Scaling factor.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Name of scaling axis. If set to ‘x’ data is scaled on x-axis, if set to ‘y’ data is scaled on y-axis. If None, data is scaled in both directions (default).
    

Notes

Executing this method will cast the object’s xy attribute to dtype np.float32 if it previously has a non-floating dtype.

`slice`(_`startframe``=``None`_, _`endframe``=``None`_, _`inplace``=``False`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.slice)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.slice "Link to this definition")

Return copy of object with sliced data. Mimics numpy’s array slicing.

Parameters:

-   **startframe** (_int, optional_) – Start of slice. Defaults to beginning of segment.
    
-   **endframe** (_int, optional_) – End of slice (endframe is excluded). Defaults to end of segment.
    
-   **inplace** (_bool, optional_) – If set to `` `False` `` (default), a new object is returned, otherwise the operation is performed in place on the called object.
    

Returns:

**xy_sliced**

Return type:

Union\[[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY"), None\]

`translate`(_`shift`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/xy.html#XY.translate)[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.translate "Link to this definition")

Translates data by shift vector.

Parameters:

**shift** (_list or array-like_) – Shift vector of form v = (x, y). Any iterable data type with two numeric entries is accepted.

Notes

Executing this method will cast the object’s xy attribute to dtype np.float32 if it previously has a non-floating dtype.

_`property`_ `x`_`:` `array`_[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.x "Link to this definition")

X-data array, where each player’s x-coordinates occupy one column.

_`property`_ `y`_`:` `array`_[](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY.y "Link to this definition")

Y-data array, where each player’s y-coordinates occupy one column.