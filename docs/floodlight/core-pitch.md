---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.365Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

_`class`_ `floodlight.core.pitch.``Pitch`(_`xlim`_, _`ylim`_, _`unit`_, _`boundaries`_, _`length``=``None`_, _`width``=``None`_, _`sport``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/pitch.html#Pitch)[](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "Link to this definition")

Pitch and coordinate system specifications. Core class of floodlight.

Parameters:

-   **xlim** (_Tuple\[Numeric, Numeric\]_) – Limits of pitch boundaries in longitudinal direction. This tuple has the form (x_min, x_max) and delimits the length of the pitch (not of any actual data) within the coordinate system.
    
-   **ylim** (_Tuple\[Numeric, Numeric\]_) – Limits of pitch boundaries in lateral direction. This tuple has the form (y_min, y_max) and delimits the width of the pitch (not of any actual data) within the coordinate system.
    
-   **unit** (_{‘m’, ‘cm’, ‘percent’, ‘normed’}_) – The unit in which data is measured along axes. The values ‘percent’ and ‘normed’ can be used to denote standardized pitches where data is scaled along the axes independent of the actual pitch size. In this case, ‘percent’ refers to a scaling onto the range (0, 100), and ‘normed’ to all other scalings. To get non-distorted calculations from these unit-systems, the length and width attributes need to be specified.
    
-   **boundaries** (_str_) – One of {‘fixed’, ‘flexible’}. Here, ‘fixed’ denotes coordinate systems that limit axes to the respective xlim and ylim. On the contrary, ‘flexible’ coordinate systems do not explicitly specify a limit. Instead, the limit is implicitly set by the actual pitch length and width.
    
-   **length** (_Numeric, optional_) – Actual pitch length in _m_.
    
-   **width** (_Numeric, optional_) – Actual pitch width in _m_.
    
-   **sport** (_str, optional_) – Sport for which the pitch is used. This is used to automatically generate lines and markings.
    

Variables:

-   **center** (_tuple_) – Returns coordinates of the pitch center.
    
-   **is_metrical** (_bool_) – Returns True if the object’s unit is metrical, False otherwise.
    

_`classmethod`_ `from_template`(_`template_name`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/pitch.html#Pitch.from_template)[](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch.from_template "Link to this definition")

Creates a Pitch object representing common data provider formats.

Parameters:

-   **template_name** (_str_) – The name of the template the pitch should follow. Currently supported are {‘dfl’, ‘eigd’, ‘opta’, ‘statsbomb’, ‘secondspectrum’, ‘statsperform_event’, ‘statsperform_tracking’, ‘statsperform_open’, ‘tracab’}.
    
-   **kwargs** – You may pass optional arguments (length, width, sport) used for class instantiation. For some data providers, additional kwargs are needed to represent their format correctly. For example, pass the length and width argument to create a Pitch object in the ‘tracab’ format.
    

Returns:

**pitch** – A class instance of the given provider format.

Return type:

[Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")

`plot`(_`color_scheme``=``'standard'`_, _`show_axis_ticks``=``False`_, _`ax``=``None`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/pitch.html#Pitch.plot)[](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch.plot "Link to this definition")

Plots a pitch on a matplotlib.axes for a given sport.

Parameters:

-   **color_scheme** (_str, optional_) – Color scheme of the plot. One of {‘standard’, ‘bw’}. Defaults to ‘standard’.
    
-   **show_axis_ticks** (_bool, optional_) – If set to True, the axis ticks are visible. Defaults to False.
    
-   **ax** (_matplotlib.axes, optional_) – Axes from matplotlib library on which the playing field is plotted. If ax is None, a default-sized matplotlib.axes object is created.
    
-   **kwargs** – Optional keyworded arguments {‘linewidth’, ‘zorder’, ‘scalex’, ‘scaley’} which can be used for the plot functions from matplotlib. The kwargs are only passed to all the plot functions of matplotlib.
    

Returns:

**axes** – Axes from matplotlib library on which the specified pitch is plotted.

Return type:

matplotlib.axes

Notes

The kwargs are only passed to the plot functions of matplotlib. To customize the plots have a look at [matplotlib](https://matplotlib.org/3.5.0/api/_as_gen/matplotlib.axes.Axes.plot.html). For example in order to modify the linewidth pass a float to the keyworded argument ‘linewidth’. The same principle applies to other kwargs like ‘zorder’, ‘scalex’ and ‘scaley’.

Examples

-   [Handball pitch](https://floodlight.readthedocs.io/en/latest/modules/vis/pitches.html#handball-pitch-label)
    
-   [Football pitch](https://floodlight.readthedocs.io/en/latest/modules/vis/pitches.html#football-pitch-label)