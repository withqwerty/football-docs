---
source_url: https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

_`class`_ `floodlight.models.kinematics.``AccelerationModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#AccelerationModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.AccelerationModel "Link to this definition")

Computations for accelerations of all players.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.AccelerationModel.fit "floodlight.models.kinematics.AccelerationModel.fit")\-method, this model calculates the frame-wise acceleration for each player. The calculation can subsequently be queried by calling the corresponding method:

> -   Frame-wise acceleration –> [`` `acceleration()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.AccelerationModel.acceleration "floodlight.models.kinematics.AccelerationModel.acceleration")
>     

Notes

For input data in metrical units, the output equals the input unit. Differences between frames can be calculated with two different methods:

> _Central difference method_ (recommended) allows for differentiation without temporal shift:
> 
> > \\\[y^{\\prime}(t_{0}) = \\frac{y_{1}-y_{-1}}{t_{1} - t_{-1}}\\\]
> 
> The first and last frame are padded with linear extrapolation.
> 
> _Backward difference method_ calculates the difference between each consecutive frame:
> 
> > \\\[y^{\\prime}(t_{0}) = \\frac{y_{0}-y_{-1}}{t_{0} - t_{-1}}\\\]
> 
> The first frame is padded prepending a ‘0’ at the beginning of the array along axis=1.

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.kinematics import AccelerationModel
```

```
>>> xy = XY(np.array(((0, 0), (0, 1), (1, 1), (2, 2))), framerate=20)
```

```
>>> am = AccelerationModel()
>>> am.fit(xy)
```

```
>>> am.acceleration()
PlayerProperty(property=array([[-117.15728753],
   [  23.60679775],
   [ 141.42135624],
   [ 118.47182945]]), name='acceleration', framerate=20)
```

`acceleration`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#AccelerationModel.acceleration)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.AccelerationModel.acceleration "Link to this definition")

Returns the frame-wise acceleration as computed by the fit method.

Returns:

**acceleration** – A PlayerProperty object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the frame-wise acceleration.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`fit`(_`xy`_, _`difference``=``'central'`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#AccelerationModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.AccelerationModel.fit "Link to this definition")

Fits a model calculating accelerations of each player to an XY object.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **difference** (_{‘central’, ‘backward’}, optional_) – The method of differentiation. ‘central’ will differentiate using the central difference method, ‘backward’ will differentiate using the backward difference method as described in the Notes.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Optional argument that restricts distance calculation to either the x- or y-dimension of the data. If set to None (default), distances are calculated in both dimensions.
    

_`class`_ `floodlight.models.kinematics.``DistanceModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#DistanceModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel "Link to this definition")

Computations for Euclidean distances of all players.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel.fit "floodlight.models.kinematics.DistanceModel.fit")\-method, this model calculates the frame-wise Euclidean distance for each player. The following calculations can subsequently be queried by calling the corresponding methods:

> -   Frame-wise Distance Covered –> [`` `distance_covered()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel.distance_covered "floodlight.models.kinematics.DistanceModel.distance_covered")
>     
> -   Cumulative Distance Covered –> [`` `cumulative_distance_covered()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel.cumulative_distance_covered "floodlight.models.kinematics.DistanceModel.cumulative_distance_covered")
>     

Notes

For input data in metrical units, the output equals the input unit. Differences between frames can be calculated with two different methods:

> _Central difference method_ (recommended) allows for differentiation without temporal shift:
> 
> > \\\[y^{\\prime}(t_{0}) = \\frac{y_{1}-y_{-1}}{t_{1} - t_{-1}}\\\]
> 
> The first and last frame are padded with linear extrapolation.
> 
> _Backward difference method_ calculates the difference between each consecutive frame:
> 
> > \\\[y^{\\prime}(t_{0}) = \\frac{y_{0}-y_{-1}}{t_{0} - t_{-1}}\\\]
> 
> The first frame is padded prepending a ‘0’ at the beginning of the array along axis=1.

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.kinematics import DistanceModel
```

```
>>> xy = XY(np.array(((0, 0), (0, 1), (1, 1), (2, 2))))
```

```
>>> dm = DistanceModel()
>>> dm.fit(xy)
```

```
>>> dm.distance_covered()
PlayerProperty(property=array([[1.        ],
   [0.70710678],
   [1.11803399],
   [1.41421356]]), name='distance_covered')
>>> dm.cumulative_distance_covered()
PlayerProperty(property=array([[1.        ],
   [0.70710678],
   [1.11803399],
   [1.41421356]]), name='distance_covered')
```

`cumulative_distance_covered`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#DistanceModel.cumulative_distance_covered)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel.cumulative_distance_covered "Link to this definition")

Returns the cumulative distance covered.

Returns:

**cumulative_distance_euclidean** – A PlayerProperty object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the cumulative Euclidean distance covered calculated by numpy.nancumsum() over axis=0.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`distance_covered`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#DistanceModel.distance_covered)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel.distance_covered "Link to this definition")

Returns the frame-wise distance covered as computed by the fit method.

Returns:

**distance_euclidean** – A PlayerProperty object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the frame-wise Euclidean distance covered.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`fit`(_`xy`_, _`difference``=``'central'`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#DistanceModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel.fit "Link to this definition")

Fits a model calculating Euclidean distances of each player to an XY object.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **difference** (_{‘central’, ‘backward’}, optional_) – The method of differentiation. ‘central’ will differentiate using the central difference method, ‘backward’ will differentiate using the backward difference method as described in the Notes.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Optional argument that restricts distance calculation to either the x- or y-dimension of the data. If set to None (default), distances are calculated in both dimensions.
    

_`class`_ `floodlight.models.kinematics.``VelocityModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#VelocityModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel "Link to this definition")

Computations for velocities of all players.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel.fit "floodlight.models.kinematics.VelocityModel.fit")\-method, this model calculates the frame-wise velocity for each player. The calculation can subsequently be queried by calling the corresponding method:

> -   Frame-wise velocity –> [`` `velocity()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel.velocity "floodlight.models.kinematics.VelocityModel.velocity")
>     

Notes

For input data in metrical units, the output equals the input unit. Differences between frames can be calculated with two different methods:

> _Central difference method_ (recommended) allows for differentiation without temporal shift:
> 
> > \\\[y^{\\prime}(t_{0}) = \\frac{y_{1}-y_{-1}}{t_{1} - t_{-1}}\\\]
> 
> The first and last frame are padded with linear extrapolation.
> 
> _Backward difference method_ calculates the difference between each consecutive frame:
> 
> > \\\[y^{\\prime}(t_{0}) = \\frac{y_{0}-y_{-1}}{t_{0} - t_{-1}}\\\]
> 
> The first frame is padded prepending a ‘0’ at the beginning of the array along axis=1.

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.kinematics import VelocityModel
```

```
>>> xy = XY(np.array(((0, 0), (0, 1), (1, 1), (2, 2))), framerate=20)
```

```
>>> vm = VelocityModel()
>>> vm.fit(xy)
```

```
>>> vm.velocity()
PlayerProperty(property=array([[20.        ],
   [14.14213562],
   [22.36067977],
   [28.28427125]]), name='velocity', framerate=20)
```

`fit`(_`xy`_, _`difference``=``'central'`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#VelocityModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel.fit "Link to this definition")

Fits a model calculating velocities of each player to an XY object.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **difference** (_{‘central’, ‘backward’}, optional_) – The method of differentiation. ‘central’ will differentiate using the central difference method, ‘backward’ will differentiate using the backward difference method as described in the Notes.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Optional argument that restricts distance calculation to either the x- or y-dimension of the data. If set to None (default), distances are calculated in both dimensions.
    

`velocity`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinematics.html#VelocityModel.velocity)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel.velocity "Link to this definition")

Returns the frame-wise velocity as computed by the fit method.

Returns:

**velocity** – A PlayerProperty object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the frame-wise velocity.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")