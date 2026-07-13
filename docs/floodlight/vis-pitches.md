---
source_url: https://floodlight.readthedocs.io/en/latest/modules/vis/pitches.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
`floodlight.vis.pitches.``plot_football_pitch`(_`xlim`_, _`ylim`_, _`length`_, _`width`_, _`unit`_, _`color_scheme`_, _`show_axis_ticks`_, _`ax`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/vis/pitches.html#plot_football_pitch)[](https://floodlight.readthedocs.io/en/latest/modules/vis/pitches.html#floodlight.vis.pitches.plot_football_pitch "Link to this definition")

Plots a football pitch on a given matplotlib.axes.

Parameters:

-   **xlim** (_Tuple\[Numeric, Numeric\]_) – Limits of pitch boundaries in longitudinal direction. This tuple has the form (x_min, x_max) and delimits the length of the pitch (not of any actual data) within the coordinate system.
    
-   **ylim** (_Tuple\[Numeric, Numeric\]_) – Limits of pitch boundaries in lateral direction. This tuple has the form (y_min, y_max) and delimits the width of the pitch (not of any actual data) within the coordinate system.
    
-   **length** (_Numeric_) – Length of the actual pitch in unit.
    
-   **width** (_Numeric, optional_) – Width of the actual pitch in unit.
    
-   **unit** (_str_) – The unit in which data is measured along axes. Possible types are {‘m’, ‘cm’, ‘percent’}.
    
-   **color_scheme** (_str_) – Color scheme of the plot. One of {‘standard’, ‘bw’}.
    
-   **show_axis_ticks** (_bool_) – If set to True, the axis ticks are visible.
    
-   **ax** (_matplotlib.axes_) – Axes from matplotlib library on which the football field is plotted.
    
-   **kwargs** – Optional keyworded arguments {‘linewidth’, ‘zorder’, ‘scalex’, ‘scaley’} which can be used for the plot functions from matplotlib. The kwargs are only passed to all the plot functions of matplotlib.
    

Returns:

**axes** – Axes from matplotlib library on which a football pitch is plotted.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html). For example in order to modify the linewidth pass a float to the keyworded argument ‘linewidth’. The same principle applies to other kwargs like ‘zorder’, ‘scalex’ and ‘scaley’.

Examples

```
>>> import matplotlib.pyplot as plt
>>> from floodlight.vis.pitches import plot_football_pitch
>>> # create matplotlib.axes
>>> ax = plt.subplots()[1]
```

```
>>> # plot handball pitch
>>> plot_football_pitch(xlim=(0,108), ylim=(0,68), length=108, width=68, unit='m',
>>>                     color_scheme='standard', show_axis_ticks=False, ax=ax)
>>> plt.show()
```

![../../_images/pitch_football_example.png](https://floodlight.readthedocs.io/en/latest/_images/pitch_football_example.png)

`floodlight.vis.pitches.``plot_handball_pitch`(_`xlim`_, _`ylim`_, _`unit`_, _`color_scheme`_, _`show_axis_ticks`_, _`ax`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/vis/pitches.html#plot_handball_pitch)[](https://floodlight.readthedocs.io/en/latest/modules/vis/pitches.html#floodlight.vis.pitches.plot_handball_pitch "Link to this definition")

Plots a handball pitch on a given matplotlib.axes.

Parameters:

-   **xlim** (_Tuple\[Numeric, Numeric\]_) – Limits of pitch boundaries in longitudinal direction. This tuple has the form (x_min, x_max) and delimits the length of the pitch (not of any actual data) within the coordinate system.
    
-   **ylim** (_Tuple\[Numeric, Numeric\]_) – Limits of pitch boundaries in lateral direction. This tuple has the form (y_min, y_max) and delimits the width of the pitch (not of any actual data) within the coordinate system.
    
-   **unit** (_str_) – The unit in which data is measured along axes. Possible types are {‘m’, ‘cm’, ‘percent’}.
    
-   **color_scheme** (_str_) – Color scheme of the plot. One of {‘standard’, ‘bw’}.
    
-   **show_axis_ticks** (_bool_) – If set to True, the axis ticks are visible.
    
-   **ax** (_matplotlib.axes_) – Axes from matplotlib library on which the handball field is plotted.
    
-   **kwargs** – Optional keyworded arguments {‘linewidth’, ‘zorder’, ‘scalex’, ‘scaley’} which can be used for the plot functions from matplotlib. The kwargs are only passed to all the plot functions of matplotlib.
    

Returns:

**axes** – Axes from matplotlib library on which a handball pitch is plotted.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html). For example in order to modify the linewidth pass a float to the keyworded argument ‘linewidth’. The same principle applies to other kwargs like ‘zorder’, ‘scalex’ and ‘scaley’.

Examples

```
>>> import matplotlib.pyplot as plt
>>> from floodlight.vis.pitches import plot_handball_pitch
>>> # create matplotlib.axes
>>> ax = plt.subplots()[1]
```

```
>>> # plot handball pitch
>>> plot_handball_pitch(xlim=(0,40), ylim=(0,20), unit='m', color_scheme='standard',
>>>                     show_axis_ticks=False, ax=ax)
>>> plt.show()
```

![../../_images/pitch_handball_example.png](https://floodlight.readthedocs.io/en/latest/_images/pitch_handball_example.png)