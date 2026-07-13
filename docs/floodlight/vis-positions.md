---
source_url: https://floodlight.readthedocs.io/en/latest/modules/vis/positions.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
`floodlight.vis.positions.``plot_positions`(_`xy`_, _`frame`_, _`ball`_, _`ax`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/vis/positions.html#plot_positions)[](https://floodlight.readthedocs.io/en/latest/modules/vis/positions.html#floodlight.vis.positions.plot_positions "Link to this definition")

Scatter plots positions for a given frame of an XY object on a matplotlib.axes.

Parameters:

-   **xy** (_floodlight.core.xy.XY_) – XY object containing spatiotemporal data to be plotted.
    
-   **frame** (_int_) – Number of frame to be plotted.
    
-   **ball** (_bool_) – Boolean indicating whether this object is storing ball data. If set to False marker=”o”, else marker=”.”.
    
-   **ax** (_matplotlib.axes_) – Axes from matplotlib library on which the positions are plotted.
    
-   **kwargs** – Optional keyworded arguments e.g. {‘color’, ‘zorder’, ‘marker’} which can be used for the plot functions from matplotlib. The kwargs are only passed to the plot functions of matplotlib.
    

Returns:

**axes** – Axes from matplotlib library on which the positions are plotted.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html). For example in order to modify the color of the points pass a color name or rgb-value ([matplotlib colors](https://matplotlib.org/3.5.0/tutorials/colors/colors.html)) to the keyworded argument ‘color’. The same principle applies to other kwargs like ‘zorder’ and ‘marker’.

Examples

```
>>> import matplotlib.pyplot as plt
>>> import numpy as np
>>> from floodlight.core.xy import XY
>>> from floodlight.core.pitch import Pitch
>>> from floodlight.vis.positions import plot_positions
```

```
>>> # positions
>>> pos = np.array(
>>>     [[35,5,35,63,25,25,25,50],
>>>     [45,10,45,55,35,20,35,45],
>>>     [55,10,55,55,45,20,45,45],
>>>     [88.5,20,88.5,30,88.5,40,88.5,50]])
>>> # create XY object
>>> xy_pos = XY(pos)
>>> # create Pitch object
>>> football_pitch = Pitch(xlim=(0,105), ylim=(0, 68), unit="m", sport="football")
>>> # create matplotlib.axes
>>> ax = plt.subplots()[1]
>>> # plot football pitch on ax
>>> football_pitch.plot(ax=ax)
>>> # plot positions on ax
>>> plot_positions(xy=xy_pos, frame=0, ball=False, ax=ax)
>>> plt.show()
```

![../../_images/positions_example.png](https://floodlight.readthedocs.io/en/latest/_images/positions_example.png)

`floodlight.vis.positions.``plot_trajectories`(_`xy`_, _`start_frame`_, _`end_frame`_, _`ball`_, _`ax`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/vis/positions.html#plot_trajectories)[](https://floodlight.readthedocs.io/en/latest/modules/vis/positions.html#floodlight.vis.positions.plot_trajectories "Link to this definition")

Draws the trajectories of an XY object from a given time interval on a matplotlib.axes.

Parameters:

-   **xy** (_floodlight.core.xy.XY_) – XY object containing spatiotemporal data to be plotted.
    
-   **start_frame** (_int_) – Starting frame of time interval to be plotted.
    
-   **end_frame** (_int_) – Closing frame of time interval to be plotted.
    
-   **ball** (_bool_) – Boolean indicating whether this object is storing ball data. If set to False marker=”o”, else marker=”.”.
    
-   **ax** (_matplotlib.axes_) – Axes from matplotlib library on which the trajectories are drawn.
    
-   **kwargs** – Optional keyworded arguments e.g. {‘linewidth’, ‘zorder’, ‘linestyle’, ‘alpha’} which can be used for the plot functions from matplotlib. The kwargs are only passed to all the plot functions of matplotlib.
    

Returns:

**axes** – Axes from matplotlib library on which the trajectories are drawn.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html). For example in order to modify the color of the lines pass a color name or rgb-value ([matplotlib colors](https://matplotlib.org/3.5.0/tutorials/colors/colors.html)) to the keyworded argument ‘color’. The same principle applies to other kwargs like ‘zorder’ and ‘linestyle’.

Examples

```
>>> import matplotlib.pyplot as plt
>>> import numpy as np
>>> from floodlight.core.xy import XY
>>> from floodlight.core.pitch import Pitch
>>> from floodlight.vis.positions import plot_trajectories
```

```
>>> # positions
>>> pos = np.array(
>>>     [[35,5,35,63,25,25,25,50],
>>>     [45,10,45,55,35,20,35,45],
>>>     [55,10,55,55,45,20,45,45],
>>>     [88.5,20,88.5,30,88.5,40,88.5,50]])
>>> # create XY object
>>> xy_pos = XY(pos)
>>> # create matplotlib.axes
>>> ax = plt.subplots()[1]
>>> # create Pitch object
>>> football_pitch = Pitch(xlim=(0,105), ylim=(0, 68), unit="m", sport="football")
>>> # plot football pitch on ax
>>> football_pitch.plot(ax=ax)
>>> # plot positions on ax
>>> plot_trajectories(xy=xy_pos, start_frame=0, end_frame=4, ball=False, ax=ax)
>>> plt.show()
```

![../../_images/trajectories_example.png](https://floodlight.readthedocs.io/en/latest/_images/trajectories_example.png)