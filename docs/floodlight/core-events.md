---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/events.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.365Z
---
_`class`_ `floodlight.core.events.``Events`(_`events`_, _`direction``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "Link to this definition")

Event data fragment. Core class of floodlight.

Event data is stored in a pandas `` `DataFrame` ``, where each row stores one event with its different properties organized in columns. Columns may contain any relevant information. An “eID” (event ID) and “gameclock” column is required for instantiation, to identify and time-locate events. Some particular column names are protected (see Notes).

Parameters:

-   **events** (_pd.DataFrame_) – DataFrame containing rows of events and columns of respective event properties.
    
-   **direction** (_str, optional_) – Playing direction of players in data fragment, should be either ‘lr’ (left-to-right) or ‘rl’ (right-to-left).
    

Variables:

-   **essential** (_list_) – List of essential columns available for stored events.
    
-   **protected** (_list_) – List of protected columns available for stored events.
    
-   **custom** (_list_) – List of custom (i.e. non-essential and non-protected) columns available for stored events.
    
-   **essential_missing** (_list_) – List of missing essential columns.
    
-   **essential_invalid** (_list_) – List of essential columns that violate the definitions.
    
-   **protected_missing** (_list_) – List of missing protected columns.
    
-   **protected_invalid** (_list_) – List of protected columns that violate the definitions.
    

Notes

Event data, particularly information available for each event, may vary across data providers. To accommodate all data flavours, any column name or data type is permissible. However, two essential columns are required (“eID” and “gameclock”). Other column names are protected. Using these names assumes that data stored in these columns follows conventions in terms of data types and value ranges. These are required for methods working with protected columns to assure correct calculations. Definitions for essential and protected columns can be found in [floodlight.core.definitions](https://floodlight.readthedocs.io/en/latest/modules/core/definitions.html#definitions-target).

`add_frameclock`(_`framerate`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.add_frameclock)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.add_frameclock "Link to this definition")

Add the column “frameclock”, computed as the rounded multiplication of gameclock and framerate, to the inner events DataFrame.

Parameters:

**framerate** (_int_) – Temporal resolution of data in frames per second/Hertz.

`column_values_in_range`(_`col`_, _`definitions`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.column_values_in_range)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.column_values_in_range "Link to this definition")

Check if values for a single column of the inner event DataFrame are in correct range using the specifications from [floodlight.core.definitions](https://floodlight.readthedocs.io/en/latest/modules/core/definitions.html#definitions-target).

Parameters:

-   **col** (_str_) – Column name of the inner events DataFrame to be checked
    
-   **definitions** (_Dict_) – Dictionary (from floodlight.core.definitions) containing specifications for the columns to be checked.
    
    The definitions need to contain an entry for the column to be checked and this entry needs to contain information about the value range in the form: `` `definitions[col][value_range]` `=` `(min,` `max)` ``.
    

Returns:

True if the checks for value range pass and False otherwise

Return type:

bool

Notes

Non-integer results of this computation will always be rounded to the next smaller integer.

`get_event_stream`(_`fade``=``0`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.get_event_stream)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.get_event_stream "Link to this definition")

Generates a Code object containing the eIDs of all events at the respective frame and optionally subsequent frames as defined by the fade argument.

This function translates the object’s DataFrame of temporally irregular events to a continuous frame-wise representation. This can be especially helpful to connect event data with spatiotemporal data, e.g., for filtering the latter based on the former. Events overwrite preceding event’s fade, and unfilled values are set to np.nan.

Notes

Requires the DataFrame to contain the protected `` `frameclock` `` column.

Parameters:

-   **fade** (_int, optional_) – Number of additional frames for which the Code object should stay at a value after the event occurred. The value is overwritten if another event occurs within the fade duration. If chosen to zero, the value is maintained only for a single frame. If chosen to None, the value is maintained until either the next event or until the end of the sequence. Defaults to 0.
    
-   **kwargs** – Keyword arguments of the Code object (“name”, “definitions”, “framerate”) that are passed down to instantiate the returned event_stream.
    

Returns:

**event_stream** – Generated continuous event stream describing the designated game state.

Return type:

[Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")

`reflect`(_`axis`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.reflect)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.reflect "Link to this definition")

Reflects data on given axis.

Parameters:

**axis** (_{‘x’, ‘y’}_) – Name of reflection axis. If set to “x”, data is reflected on x-axis, if set to “y”, data is reflected on y-axis.

`rotate`(_`alpha`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.rotate)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.rotate "Link to this definition")

Rotates data on given angle ‘alpha’ around the origin.

Parameters:

**alpha** (_float_) – Rotation angle in degrees. Alpha must be between -360 and 360. If positive alpha, data is rotated in counter clockwise direction. If negative, data is rotated in clockwise direction around the origin.

`scale`(_`factor`_, _`axis``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.scale)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.scale "Link to this definition")

Scales data by a given factor and optionally selected axis.

Parameters:

-   **factor** (_float_) – Scaling factor.
    
-   **axis** (_{None, ‘x’, ‘y’}, optional_) – Name of scaling axis. If set to ‘x’ data is scaled on x-axis, if set to ‘y’ data is scaled on y-axis. If None, data is scaled in both directions (default).
    

`select`(_`conditions`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.select)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.select "Link to this definition")

Returns a DataFrame containing all entries from the inner events DataFrame

that satisfy all given conditions.

Parameters:

**conditions** (_Tuple or List of Tuples_) – A single or a list of conditions used for filtering. Each condition should follow the form `` `(column,` `value)` ``. If `` `value` `` is given as a variable (can also be None), it is used to filter for an exact value. If given as a tuple `` `value` `=` `(min,` `max)` `` that specifies a minimum and maximum value, it is filtered for a value range.

For example, to filter all events that have the `` `eID` `` of `` `"Pass"` `` and that happened within the first 1000 seconds of the segment, conditions should look like: `` `conditions` `=` `[("eID",` `"Pass"),` `("gameclock",` `(0,` `1000))]` ``

Returns:

**filtered_events** – A view of the inner events DataFrame with rows fulfilling all criteria specified in conditions. The DataFrame can be empty if no row fulfills all specified criteria.

Return type:

pd.DataFrame

`slice`(_`start``=``None`_, _`end``=``None`_, _`slice_by``=``'gameclock'`_, _`inplace``=``False`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.slice)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.slice "Link to this definition")

Return copy of object with events sliced in a time interval.

Intended columns for using this function are `` `gameclock` `` (total seconds) or `` `frameclock` ``. However, also allows slicing by any other column that manifests a temporal relation between events (e.g. `` `minute` ``). Excludes all entries without a valid entry in the specified column (e.g. None).

Parameters:

-   **start** (_float, optional_) – Start frame or second of slice. Defaults to beginning of segment.
    
-   **end** (_float, optional_) – End frame or second of slice (endframe is excluded). Defaults to last event of segment (including).
    
-   **slice_by** (_{‘gameclock’, ‘frameclock’}, optional_) – Column used to slice the events. Defaults to `` `gameclock` ``.
    
-   **inplace** (_bool, optional_) – If set to `` `False` `` (default), a new object is returned, otherwise the operation is performed in place on the called object.
    

Returns:

**events_sliced**

Return type:

Union\[[Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events"), None\]

`translate`(_`shift`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/events.html#Events.translate)[](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events.translate "Link to this definition")

Translates data by shift vector.

Parameters:

**shift** (_list or array-like_) – Shift vector of form v = (x, y). Any iterable data type with two numeric entries is accepted.