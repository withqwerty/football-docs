---
source_url: https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
_`class`_ `floodlight.models.geometry.``CentroidModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#CentroidModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel "Link to this definition")

Computations based on the geometric center of all players, commonly referred to as a team’s _centroid_.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.fit "floodlight.models.geometry.CentroidModel.fit")\-method, this model calculates a team’s centroid. The following calculations can subsequently be queried by calling the corresponding methods:

> -   Centroid [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#id3) –> [`` `centroid()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.centroid "floodlight.models.geometry.CentroidModel.centroid")
>     
> -   Centroid Distance –> [`` `centroid_distance()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.centroid_distance "floodlight.models.geometry.CentroidModel.centroid_distance")
>     
> -   Stretch Index [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#id4) –> [`` `stretch_index()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.stretch_index "floodlight.models.geometry.CentroidModel.stretch_index")
>     

Notes

Team centroids are computed as the arithmetic mean of all player positions (based on _numpy_’s nanmean function). For a fixed point in time and \\(N\\) players with corresponding positions \\(x_1, \\dots, x_N \\in \\mathbb{R}^2\\), the centroid is calculated as

> \\\[C = \\frac{1}{N} \\sum_i^N x_i.\\\]

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.geometry import CentroidModel
```

```
>>> xy = XY(np.array(((1, 1, 2, -2), (1.5, np.nan, np.nan, -0))))
>>> cm = CentroidModel()
>>> cm.fit(xy)
>>> cm.centroid()
XY(xy=array([[ 1.5, -0.5],
   [ 1.5,  0. ]]), framerate=None, direction=None)
>>> cm.stretch_index(xy)
TeamProperty(property=array([1.5811388, nan]), name='stretch_index', framerate=None)
>>> cm.stretch_index(xy, axis='x')
TeamProperty(property=array([0.5, 0.]), name='stretch_index', framerate=None)
```

References

`centroid`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#CentroidModel.centroid)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.centroid "Link to this definition")

Returns the team centroid positions as computed by the fit method.

Returns:

**centroid** – An XY object of shape (T, 2), where T is the total number of frames. The two columns contain the centroids’ x- and y-coordinates, respectively.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

`centroid_distance`(_`xy`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#CentroidModel.centroid_distance)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.centroid_distance "Link to this definition")

Calculates the Euclidean distance of each player to the fitted centroids.

Parameters:

-   **xy** (_XY_) – Player spatiotemporal data for which the distances to the fitted centroids are calculated.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Optional argument that restricts distance calculation to either the x- or y-dimension of the data. If set to None (default), distances are calculated in both dimensions.
    

Returns:

**centroid_distance** – A PlayerProperty object of shape (T, N), where T is the total number of frames. Each column contains the distances to the team centroid of the player with corresponding xID.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`fit`(_`xy`_, _`exclude_xIDs``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#CentroidModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.fit "Link to this definition")

Fit the model to the given data and calculate team centroids.

Parameters:

-   **xy** (_XY_) – Player spatiotemporal data for which the centroid is calculated.
    
-   **exclude_xIDs** (_list, optional_) – A list of xIDs to be excluded from computation. This can be useful if one would like, for example, to exclude goalkeepers from analysis.
    

`stretch_index`(_`xy`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#CentroidModel.stretch_index)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.stretch_index "Link to this definition")

Calculates the _Stretch Index_, i.e., the mean distance of all players to the team centroid.

Parameters:

-   **xy** (_XY_) – Player spatiotemporal data for which the stretch index is calculated.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Optional argument that restricts stretch index calculation to either the x- or y-dimension of the data. If set to None (default), the stretch index is calculated in both dimensions.
    

Returns:

**stretch_index** – A TeamProperty object of shape (T,), where T is the total number of frames. Each entry contains the stretch index of that particular frame.

Return type:

[TeamProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty "floodlight.core.property.TeamProperty")

_`class`_ `floodlight.models.geometry.``ConvexHullModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#ConvexHullModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel "Link to this definition")

Computations based on the convex hull of player positions.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.fit "floodlight.models.geometry.ConvexHullModel.fit") method, this model calculates convex hull objects for each frame. The following calculations can subsequently be queried by calling the corresponding methods:

> -   Convex Hull Area –> [`` `convex_hull_area()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.convex_hull_area "floodlight.models.geometry.ConvexHullModel.convex_hull_area")
>     
> -   Convex Hull Visualization –> [`` `plot()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.plot "floodlight.models.geometry.ConvexHullModel.plot")
>     

Notes

The convex hull is computed using scipy’s [ConvexHull class](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.ConvexHull.html) and can be understood as the minimal convex area containing all (outfield) players.

The convex hull is also known in the literature under the terms ‘surface area’, ‘coverage area’ and ‘playing area’ [\[3\]](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#id7).

When multiple XY objects are provided, all players from all teams are combined and the convex hull encompasses all of them. This is commonly referred to as the _Effective Area of Play (EAP)_ [\[4\]](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#id8).

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.geometry import ConvexHullModel
```

Single team convex hull (excluding goalkeeper):

```
>>> xy = XY(np.array([[0, 0, 10, 0, 10, 10, 0, 10],
...                   [0, 0, 10, 0,  5, 10, 5,  5]]))
>>> chm = ConvexHullModel()
>>> chm.fit(xy, exclude_xIDs=[[0]])
>>> chull = chm.convex_hull_area()
>>> chull
TeamProperty(property=array([50., 12.5]), name='convex_hull_area', framerate=None)
```

Effective Area of Play (both teams):

```
>>> xy_home = XY(np.array([[0, 10, 20, 20], [10, 20, 10, 20]]))
>>> xy_away = XY(np.array([[40, 50, 60, 60], [50, 70, 50, 60]]))
>>> chm = ConvexHullModel()
>>> chm.fit([xy_home, xy_away])
>>> eap = chm.convex_hull_area()
>>> eap
TeamProperty(property=array([400., 200.]), name='convex_hull_area', framerate=None)
```

References

`convex_hull_area`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#ConvexHullModel.convex_hull_area)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.convex_hull_area "Link to this definition")

Calculates the area enclosed by the convex hull.

Returns:

**convex_hull_area** – A TeamProperty object of shape (T,), where T is the total number of frames. Each entry contains the area enclosed by the convex hull for that frame. Frames with insufficient valid points have NaN values.

Return type:

[TeamProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty "floodlight.core.property.TeamProperty")

Notes

If the model was fitted with:

-   Single XY object: returns the team’s convex hull area
    
-   Multiple XY objects: returns the effective area of play (EAP)
    

`fit`(_`xy`_, _`exclude_xIDs``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#ConvexHullModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.fit "Link to this definition")

Fit the model to the given data and calculate convex hulls.

Parameters:

-   **xy** (_XY or list\[XY\]_) – Single XY object or list of XY objects. If list, all XY objects will be combined and the convex hull will encompass all players (effective playing space).
    
-   **exclude_xIDs** (_list\[list\], optional_) – For each XY object, a list of xIDs to exclude from computation. This can be useful to exclude goalkeepers from analysis. Length must match number of XY objects.
    
    Examples:
    
    -   Single XY with xID=0 excluded: `` `[[0]]` ``
        
    -   Two XYs with both xID=0 excluded: `` `[[0],` `[0]]` ``
        

`plot`(_`t`_, _`ax``=``None`_, _`fill``=``True`_, _`fill_alpha``=``0.3`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#ConvexHullModel.plot)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.plot "Link to this definition")

Plot the convex hull for a given time point on a matplotlib axes.

Parameters:

-   **t** (_int_) – Frame index to plot.
    
-   **ax** (_matplotlib.axes.Axes, optional_) – Matplotlib axes to plot on. If None, a new figure and axes are created.
    
-   **fill** (_bool, optional_) – Whether to fill the convex hull polygon. Default is True.
    
-   **fill_alpha** (_float, optional_) – Transparency of the fill (0=transparent, 1=opaque). Default is 0.3. Only used if fill=True.
    
-   **\*\*kwargs** (_optional_) – Additional keyword arguments passed to the line plot. Common options:
    
    -   color : str, default ‘black’
        
    -   alpha : float, default 1.0 (line transparency)
        
    -   linewidth : float, default 2
        
    -   linestyle : str (e.g., ‘–’, ‘:’)
        
    -   Any other matplotlib.axes.Axes.plot() parameters
        

Returns:

**ax** – The axes object with the convex hull plotted.

Return type:

matplotlib.axes.Axes

Notes

The kwargs are passed to the plot function of matplotlib for drawing the hull boundary. To customize the plots have a look at [matplotlib](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html).

Examples

```
>>> import matplotlib.pyplot as plt
>>> from floodlight import Pitch
>>>
>>> pitch = Pitch(
... xlim=(0, 105), ylim=(0, 68), sport="football", unit="m", boundaries="fixed"
... )
>>>
>>> fig, ax = plt.subplots()
>>> pitch.plot(ax=ax)
>>>
>>> # Filled hull with custom color
>>> chm.plot(t=0, ax=ax, color='blue', fill_alpha=0.2)
```

![../../_images/sample_chm_plot_filled.png](https://floodlight.readthedocs.io/en/latest/_images/sample_chm_plot_filled.png)

```
>>> # Dashed outline, no fill
>>> chm.plot(t=0, ax=ax, fill=False, linestyle="--", linewidth=3)
```

![../../_images/sample_chm_plot_dashed.png](https://floodlight.readthedocs.io/en/latest/_images/sample_chm_plot_dashed.png)

_`class`_ `floodlight.models.geometry.``NearestMateModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestMateModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel "Link to this definition")

Computations for within-team distance metrics.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.fit "floodlight.models.geometry.NearestMateModel.fit")\-method, this model calculates pairwise distances between all players for each frame. The following calculations can subsequently be queried by calling the corresponding methods:

> -   Distance to Nearest Mate –> [`` `distance_to_nearest_mate()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.distance_to_nearest_mate "floodlight.models.geometry.NearestMateModel.distance_to_nearest_mate")
>     
> -   Team Spread [\[5\]](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#id10) –> [`` `team_spread()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.team_spread "floodlight.models.geometry.NearestMateModel.team_spread")
>     

Notes

The calculations are performed as follows:

-   _Distance to Nearest Mate (DTNM)_:
    
    For each player in each frame, the Euclidean distance to their nearest teammate is computed.
    
-   _Team Spread_:
    
    The Frobenius norm of the lower triangular matrix of all pairwise player distances, representing the overall dispersion of the team.
    

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.geometry import NearestMateModel
```

```
>>> xy = XY(np.array(((1, 1, 2, -2), (1.5, np.nan, np.nan, -0))))
>>> nmm = NearestMateModel()
>>> nmm.fit(xy)
```

```
>>> dtnm = nmm.distance_to_nearest_mate()
>>> dtnm
PlayerProperty(property=array([[3.16227766, 3.16227766],
       [nan, nan]]), name='distance_to_nearest_mate', framerate=None)
>>> dtnm.property.mean(axis=1)  # Mean distance per frame
array([3.16227766, nan])
```

```
>>> nmm.team_spread()
TeamProperty(property=array([3.16227766, nan]), name='team_spread', framerate=None)
```

References

`distance_to_nearest_mate`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestMateModel.distance_to_nearest_mate)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.distance_to_nearest_mate "Link to this definition")

Calculates the distance to the nearest teammate for each player.

Returns:

**distance_to_nearest_mate** – A PlayerProperty object of shape (T, N), where T is the total number of frames and N is the number of players. Each entry contains the distance to the nearest teammate for that player in that frame.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`fit`(_`xy`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestMateModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.fit "Link to this definition")

Fit the model to the given data and calculate pairwise distances.

Parameters:

**xy** (_XY_) – Player spatiotemporal data for which the pairwise distances are calculated.

`team_spread`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestMateModel.team_spread)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.team_spread "Link to this definition")

Calculates the team spread (Frobenius norm of distance matrix).

Returns:

**spread** – A TeamProperty object of shape (T,), where T is the total number of frames. Each entry contains the team spread (Frobenius norm of the pairwise distance matrix) for that frame.

Return type:

[TeamProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty "floodlight.core.property.TeamProperty")

_`class`_ `floodlight.models.geometry.``NearestOpponentModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestOpponentModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel "Link to this definition")

Computations for between-team distance metrics.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel.fit "floodlight.models.geometry.NearestOpponentModel.fit")\-method, this model calculates pairwise distances between players of opposing teams. The following calculations can subsequently be queried:

> -   Distance to Nearest Opponent [\[6\]](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#id12) –> [`` `distance_to_nearest_opponent()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel.distance_to_nearest_opponent "floodlight.models.geometry.NearestOpponentModel.distance_to_nearest_opponent")
>     

Notes

For each player in each frame, the Euclidean distance to their nearest opponent is computed.

References

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.geometry import NearestOpponentModel
```

```
>>> xy1 = XY(np.array(((1, 1, 2, -2), (1.5, np.nan, np.nan, -0))))
>>> xy2 = XY(np.array(((2, 2, -1, -1), (0.5, np.nan, np.nan, 1))))
>>> nom = NearestOpponentModel()
>>> nom.fit(xy1, xy2)
```

```
>>> dtno1, dtno2 = nom.distance_to_nearest_opponent()
>>> dtno1
PlayerProperty(property=array([[1.41421356, 3.16227766],
       [nan, nan]]), name='distance_to_nearest_opponent', framerate=None)
>>> dtno1.property.mean(axis=1)  # Mean distance per frame
array([2.28824561, nan])
```

`distance_to_nearest_opponent`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestOpponentModel.distance_to_nearest_opponent)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel.distance_to_nearest_opponent "Link to this definition")

Calculates distance to nearest opponent for each player on both teams.

Returns:

**distance_to_nearest_opponent** – A tuple of two PlayerProperty objects of shape (T, N) containing distances to nearest opponent for each player in the first and second team for each frame.

Return type:

tuple\[[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty"), [PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")\]

`fit`(_`xy1`_, _`xy2`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/geometry.html#NearestOpponentModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel.fit "Link to this definition")

Fit the model to the given data and calculate pairwise distances.

Parameters:

-   **xy1** (_XY_) – Player spatiotemporal data for the first team.
    
-   **xy2** (_XY_) – Player spatiotemporal data for the second team.