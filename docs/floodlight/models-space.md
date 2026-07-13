---
source_url: https://floodlight.readthedocs.io/en/latest/modules/models/space.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
_`class`_ `floodlight.models.space.``DiscreteVoronoiModel`(_`pitch`_, _`mesh``=``'square'`_, _`xpoints``=``100`_, _`motion_model``=``'euclidean'`_, _`max_acceleration``=``4.2`_, _`vmax``=``7.8`_, _`alpha``=``1.3`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/space.html#DiscreteVoronoiModel)[](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel "Link to this definition")

Calculates discretized dominant regions commonly used to assess space control.

Upon instantiation, this model creates a mesh grid that spans the entire pitch with a fixed number of mesh points. When calling the [`` `fit()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.fit "floodlight.models.space.DiscreteVoronoiModel.fit")\-method, the controlling player for each mesh point is determined according to the selected movement model. By default, the Euclidean distance is used, which corresponds to a classical Voronoi tessellation. Alternatively, motion-based models can be selected that account for player velocity and acceleration. Cumulative controls and controlled areas are then calculated on a discretization of the pitch. The following calculations can subsequently be queried by calling the corresponding methods:

> -   Player Space Control –> [`` `player_controls()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.player_controls "floodlight.models.space.DiscreteVoronoiModel.player_controls")
>     
> -   Team Space Control –> [`` `team_controls()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.team_controls "floodlight.models.space.DiscreteVoronoiModel.team_controls")
>     

Furthermore, the following plotting methods are available to visualize the model:

> -   Plot controlled areas –> [`` `plot()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.plot "floodlight.models.space.DiscreteVoronoiModel.plot")
>     
> -   Plot mesh grid –> [`` `plot_mesh()` ``](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.plot_mesh "floodlight.models.space.DiscreteVoronoiModel.plot_mesh")
>     

Parameters:

-   **pitch** (_Pitch_) – A floodlight Pitch object corresponding to the XY data that will be supplied to the model. The mesh created during instantiation will span this pitch.
    
-   **mesh** (_{‘square’, ‘hexagonal’}, optional_) – A string indicating the type of mesh that will be generated. ‘square’ will generate a grid-like mesh with square cell shapes (default). ‘hexagonal’ will generate a mesh with hexagonal cell shapes where mesh points have equidistant neighbours.
    
-   **xpoints** (_int, optional_) – The number of mesh grid points used in x-direction. Must be in range \[10, 1000\] and defaults to 100. The number of mesh grid points in y-direction will be inferred automatically to match the shape of the pitch and produce regular mesh cell shapes.
    
-   **motion_model** (_{‘euclidean’, ‘taki_hasegawa’, ‘fujimura_sugihara’}, optional_) – The motion model used to assign mesh points to players. ‘euclidean’ (default) assigns each mesh point to the nearest player by Euclidean distance. ‘taki_hasegawa’ assigns each mesh point to the player who can reach it fastest, considering initial velocity and maximum acceleration. ‘fujimura_sugihara’ uses an exponential velocity decay model where players approach a terminal velocity with a drag coefficient.
    
-   **max_acceleration** (_float, optional_) – Maximum player acceleration in m/s². Only used by ‘taki_hasegawa’. Defaults to 4.2 according to [\[5\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id13).
    
-   **vmax** (_float, optional_) – Terminal velocity in m/s used by ‘fujimura_sugihara’. Defaults to 7.8, according to [\[4\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id12).
    
-   **alpha** (_float, optional_) – Drag coefficient controlling how quickly players approach terminal velocity used by ‘fujimura_sugihara’. Defaults to 1.3 according to [\[4\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id12).
    

Notes

The original work by Taki and Hasegawa proposed to use Voronoi tessellations for assessing player dominant regions [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id9). This approach has later been simplified by using the Euclidean distance when allocating space to players [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id10) , [\[3\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id11). Instead of computing algebraic Voronoi regions, this model discretizes the problem by sampling space control on a finite number of mesh points across the pitch. This runs much faster and can be easier to handle. If an appropriate number of mesh points is chosen, the resulting error is expected to be negligible given the common spatial inaccuracies of tracking data as well as variations in moving players’ centers of masses.

In addition to the Euclidean model, this class supports the motion-based model by Taki and Hasegawa [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id9). This approach assigns each mesh point to the player who can reach it fastest, considering both current velocity and maximum acceleration. For each player at position \\(\\mathbf{p}\\) with velocity \\(\\mathbf{v}\\), the minimum arrival time \\(t^\*\\) to a target point \\(\\mathbf{x}\\) under the isotropic acceleration constraint \\(\\|\\mathbf{a}\\| \\leq a_{max}\\) is the smallest \\(t \\ge 0\\) satisfying:

\\\[\\|\\mathbf{x} - \\mathbf{p} - \\mathbf{v} t\\| \\leq \\frac{1}{2} a_{max} t^2\\\]

This is solved numerically via bisection on the feasibility function \\(g(t) = \\|\\mathbf{x} - \\mathbf{p} - \\mathbf{v} t\\| - \\frac{1}{2} a_{max} t^2\\), using a velocity-projection quadratic as lower bound and a stop-then-go strategy as upper bound for initial bracketing.

The model by Fujimura and Sugihara [\[4\]](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#id12) extends this by modeling player motion with an exponential decay of acceleration instead of constant acceleration. A player’s velocity approaches a terminal speed \\(v_{max}\\) with drag coefficient \\(\\alpha\\). The center of the reachable region by time \\(t\\) is displaced by \\(\\varphi(t) = (1 - e^{-\\alpha t}) / \\alpha\\) along the initial velocity direction, while the reachable radius grows as \\(v_{max} (t - \\varphi(t))\\). The arrival time is the smallest \\(t \\ge 0\\) satisfying:

\\\[\\|\\mathbf{x} - \\mathbf{p} - \\varphi(t) \\mathbf{v}\\| \\leq v_{max} (t - \\varphi(t))\\\]

Note

Computation time scales with the number of mesh points, players, and frames. Motion-based models (`` `'taki_hasegawa'` ``, `` `'fujimura_sugihara'` ``) are significantly more expensive than the Euclidean model. For high-resolution meshes and long sequences, fitting may take several minutes.

References

Examples

```
>>> import numpy as np
>>> from floodlight import XY, Pitch
>>> from floodlight.models.space import DiscreteVoronoiModel
```

```
>>> # create data and fit model
>>> xy1 = XY(np.array(((10, 10, 20, 80, 30, 40), (10, 10, np.nan, np.nan, 35, 35))))
>>> xy2 = XY(np.array(((90, 90, 80, 20, 75, 80), (90, 90, 75, 25, 80, 70))))
>>> pitch = Pitch.from_template("opta", length=105, width=68)
>>> dvm = DiscreteVoronoiModel(pitch)
>>> dvm.fit(xy1, xy2)
```

```
>>> # print player controls [%] for first team
>>> player_control1, player_control2 = dvm.player_controls()
>>> print(player_control1.property)
[[10.63 19.32 21.71]
 [10.35  0.   36.56]]
```

```
>>> # print team controls [%] for first team
>>> team_control1, team_control2 = dvm.team_controls()
>>> print(team_control1.property)
[[51.66]
 [46.91]]
```

`fit`(_`xy1`_, _`xy2`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/space.html#DiscreteVoronoiModel.fit)[](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.fit "Link to this definition")

Fit the model to the given data and calculate control values for mesh points.

Parameters:

-   **xy1** (_XY_) – Player spatiotemporal data of the first team.
    
-   **xy2** (_XY_) – Player spatiotemporal data of the second team.
    

`player_controls`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/space.html#DiscreteVoronoiModel.player_controls)[](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.player_controls "Link to this definition")

Returns the percentage of mesh points controlled by each player of the first and second team.

Returns:

**player_controls** – One Property object for each team (corresponding to the fitted xy1 and xy2) of shape (n_frames x n_players), respectively. Property objects contain the percentage of points controlled by each player on the pitch.

Return type:

Tuple\[[PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty"), [PlayerProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.PlayerProperty "floodlight.core.property.PlayerProperty")\]

`plot`(_`t``=``0`_, _`team_colors``=``('red',` `'blue')`_, _`ax``=``None`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/space.html#DiscreteVoronoiModel.plot)[](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.plot "Link to this definition")

Plots the fitted mesh grid colored by team controls for a given time point on a matplotlib axes.

Parameters:

-   **t** (_int, optional_) – Frame for which controls are plotted. Defaults to 0.
    
-   **team_colors** (_Tuple\[str, str\], optional_) – Tuple of two colors in a format accepted by matplotlib that is used to color team specific control areas. Defaults to (‘red’, ‘blue’).
    
-   **ax** (_matplotlib.axes, optional_) – Axes from matplotlib library to plot on. Defaults to None.
    
-   **kwargs** – Optional keyworded arguments e.g. {‘zorder’, ‘ec’, ‘alpha’} which can be used for the plot functions from matplotlib. The kwargs are only passed to all the plot functions of matplotlib. If not given default values are used.
    

Returns:

**axes** – Axes from matplotlib library with plot.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html).

Examples

Given a DiscreteVoronoiModel that has already been fitted:

```
>>> # fitted_dvm_model has square mesh
>>> ax = pitch.plot(color_scheme="bw")
>>> fitted_dvm_model.plot(ax=ax)
```

![../../_images/sample_dvm_plot_square.png](https://floodlight.readthedocs.io/en/latest/_images/sample_dvm_plot_square.png)

```
>>> # fitted_dvm_model has hexagonal mesh
>>> ax = pitch.plot(color_scheme="bw")
>>> fitted_dvm_model.plot(ax=ax)
```

![../../_images/sample_dvm_plot_hex.png](https://floodlight.readthedocs.io/en/latest/_images/sample_dvm_plot_hex.png)

`plot_mesh`(_`ax``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/space.html#DiscreteVoronoiModel.plot_mesh)[](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.plot_mesh "Link to this definition")

Plots the generated mesh on a matplotlib.axes.

Parameters:

**ax** (_matplotlib.axes, optional_) – Matplotlib axes on which the mesh points are plotted. If ax is None, a default-sized matplotlib.axes object is created.

Returns:

**axes** – Matplotlib axes on which the mesh points are plotted.

Return type:

matplotlib.axes

Examples

Given a DiscreteVoronoiModel that has already been fitted:

```
>>> ax = pitch.plot(color_scheme="bw")
>>> fitted_dvm_model.plot_mesh(ax=ax)
```

![../../_images/sample_dvm_plot_hex_mesh.png](https://floodlight.readthedocs.io/en/latest/_images/sample_dvm_plot_hex_mesh.png)

`team_controls`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/models/space.html#DiscreteVoronoiModel.team_controls)[](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel.team_controls "Link to this definition")

Returns the percentage of mesh points controlled by the first and second team.

Returns:

**team_controls** – One Property object for each team (corresponding to the fitted xy1 and xy2) of shape (n_frames x 1), respectively. Property objects contain the percentage of points controlled by each team on the pitch.

Return type:

Tuple\[[TeamProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty "floodlight.core.property.TeamProperty"), [TeamProperty](https://floodlight.readthedocs.io/en/latest/modules/core/property.html#floodlight.core.property.TeamProperty "floodlight.core.property.TeamProperty")\]