---
source_url: https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
_`class`_ `floodlight.models.kinetics.``MetabolicPowerModel`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinetics.html#MetabolicPowerModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel "Link to this definition")

Class for calculating Metabolic Power and derived metrics from spatiotemporal data.

Upon calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.fit "floodlight.models.kinetics.MetabolicPowerModel.fit")\-method, this model calculates the frame-wise Metabolic Power for each player. The following calculations can subsequently be queried by calling the corresponding methods:

> -   Frame-wise Metabolic Power –> [`` `metabolic_power()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.metabolic_power "floodlight.models.kinetics.MetabolicPowerModel.metabolic_power")
>     
> -   Cumulative Metabolic Power –> [`` `cumulative_metabolic_power()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.cumulative_metabolic_power "floodlight.models.kinetics.MetabolicPowerModel.cumulative_metabolic_power")
>     
> -   Frame-wise Equivalent Distance –> [`` `equivalent_distance()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.equivalent_distance "floodlight.models.kinetics.MetabolicPowerModel.equivalent_distance")
>     
> -   Cumulative Equivalent Distance –> [`` `cumulative_equivalent_distance()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.cumulative_equivalent_distance "floodlight.models.kinetics.MetabolicPowerModel.cumulative_equivalent_distance")
>     

Notes

Metabolic Power is defined as the energy expenditure over time necessary to move at a certain speed, and is calculated as the product of energy cost of transport per unit body mass and distance \[\\(\\frac{J}{kg \\cdot m}\\)\] and velocity \[\\(\\frac{m}{s}\\)\]. Metabolic Power and Energy cost of walking is calculated according to di Prampero & Osgnach [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#id3). Energy cost of running is calculated with the updated formula of Minetti & Pavei [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#id4).

Examples

```
>>> import numpy as np
>>> from floodlight import XY
>>> from floodlight.models.kinetics import MetabolicPowerModel
```

```
>>> xy = XY(np.array(((0, 0), (0, 1), (1, 1), (2, 2))), framerate=20)
```

```
>>> metabolic_power_model = MetabolicPowerModel()
>>> metabolic_power_model.fit(xy)
```

```
>>> metabolic_power_model.metabolic_power()
PlayerProperty(property=array([[1164.59773017],
       [ 185.59792131],
       [9448.10007077],
       [8593.05199423]]), name='metabolic_power', framerate=20)
>>> metabolic_power_model.cumulative_equivalent_distance()
PlayerProperty(property=array([[ 323.49936949],
   [ 375.05434763],
   [2999.52658952],
   [5386.4854768 ]]), name='cumulative_equivalent_distance', framerate=20)
```

References

`ECW_ES_CUTOFFS` _`=` `array([-0.3,` `-0.2,` `-0.1,`  `0.` `,`  `0.1,`  `0.2,`  `0.3,`  `0.4])`_[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.ECW_ES_CUTOFFS "Link to this definition")

`ECW_POLY_COEFF` _`=` `array([[` `2.8000e-01,` `-1.6600e+00,`  `3.8100e+00,` `-3.9600e+00,`  `4.0100e+00],`        `[` `3.0000e-02,` `-1.5000e-01,`  `9.8000e-01,` `-2.2500e+00,`  `3.1400e+00],`        `[` `6.9000e-01,` `-3.2100e+00,`  `5.9400e+00,` `-5.0700e+00,`  `2.7900e+00],`        `[` `1.2500e+00,` `-6.5700e+00,`  `1.3140e+01,` `-1.1150e+01,`  `5.3500e+00],`        `[` `6.8000e-01,` `-4.1700e+00,`  `1.0170e+01,` `-1.0310e+01,`  `8.6600e+00],`        `[` `3.8000e+00,` `-1.4910e+01,`  `2.2940e+01,` `-1.4530e+01,`  `1.1240e+01],`        `[` `4.4950e+01,` `-1.2288e+02,`  `1.2694e+02,` `-5.7460e+01,`  `2.1390e+01],`        `[` `9.4620e+01,` `-2.1394e+02,`  `1.8443e+02,` `-6.8490e+01,`  `2.5040e+01]])`_[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.ECW_POLY_COEFF "Link to this definition")

`RUNNING_TRANSITION_COEFF` _`=` `array([-107.05,`  `113.13,`   `-1.13,`  `-15.84,`   `-1.7` `,`    `2.27])`_[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.RUNNING_TRANSITION_COEFF "Link to this definition")

`cumulative_equivalent_distance`(_`eccr``=``3.6`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinetics.html#MetabolicPowerModel.cumulative_equivalent_distance)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.cumulative_equivalent_distance "Link to this definition")

Returns cumulative equivalent distance defined as the distance a player could have run if moving at a constant speed and calculated as the fraction of metabolic work and the cost of constant running.

Parameters:

**eccr** (_Numeric_) – Energy cost of constant running. Default is set to 3.6 \\(\\frac{J}{kg \\cdot m}\\) according to di Prampero (2018). Can differ for different turfs.

Returns:

**cumulative_equivalent_distance** – A Player Property object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the cumulative equivalent distance calculated by numpy.nancumsum() over axis=0.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`cumulative_metabolic_power`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinetics.html#MetabolicPowerModel.cumulative_metabolic_power)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.cumulative_metabolic_power "Link to this definition")

Returns the cumulative metabolic power.

Returns:

**metabolic_power** – A Player Property object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the cumulative metabolic power calculated by numpy.nancumsum() over axis=0.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`equivalent_distance`(_`eccr``=``3.6`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinetics.html#MetabolicPowerModel.equivalent_distance)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.equivalent_distance "Link to this definition")

Returns frame-wise equivalent distance, defined as the distance a player could have run if moving at a constant speed and calculated as the fraction of metabolic work and the cost of constant running.

Parameters:

**eccr** (_Numeric_) – Energy cost of constant running. Default is set to 3.6 \\(\\frac{J}{kg \\cdot m}\\) according to di Prampero (2018). Can differ for different turfs.

Returns:

**equivalent_distance** – A Player Property object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the frame-wise equivalent distance.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")

`fit`(_`xy`_, _`difference``=``'central'`_, _`axis``=``None`_, _`eccr``=``3.6`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinetics.html#MetabolicPowerModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.fit "Link to this definition")

Fit the model to the given data and calculate metabolic power for every player.

Notes

To give appropriate results, unit of coordinates must be in meter.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **difference** (_{‘central’, ‘forward’}, optional_) – The method of differentiation to calculate velocity and acceleration. See [`` `VelocityModel()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel "floodlight.models.kinematics.VelocityModel") for further details.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Optional argument that restricts distance calculation to either the x- or y-dimension of the data. If set to None (default), distances are calculated in both dimensions.
    
-   **eccr** (_Numeric_) – Energy cost of constant running. Default is set to 3.6 \\(\\frac{J}{kg \\cdot m}\\) according to di Prampero (2018). Can differ for different turfs.
    

`metabolic_power`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/kinetics.html#MetabolicPowerModel.metabolic_power)[](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel.metabolic_power "Link to this definition")

Returns the frame-wise metabolic power as computed by the `` `fit()` ``\-method.

Returns:

**metabolic_power** – A Player Property object of shape (T, N), where T is the total number of frames and N is the number of players. The columns contain the frame-wise metabolic power.

Return type:

[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")