---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.io.kinexon.``create_links_from_meta_data`(_`pID_dict`_, _`identifier``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/kinexon.html#create_links_from_meta_data)[](https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html#floodlight.io.kinexon.create_links_from_meta_data "Link to this definition")

Creates a dictionary from the pID_dict linking the identifier to the xID.

Parameters:

-   **pID_dict** (_Dict\[str, Dict\[str, List\[str\]\]\]_) – Nested dictionary that stores information about the pIDs from every player- identifying column in every group. The format is `` `pID_dict[group][identifying_column]` `=` `[pID1,` `pID2,` `...,` `pIDn]` ``. When recording and exporting Kinexon data, the pID can be stored in different columns. Player-identifying columns are `` `"sensor_id"` ``, `` `"mapped_id"` ``, and `` `"full_name"` ``. If the respective column is in the recorded data, its pIDs are listed in `` `pID_dict` ``.
    
-   **identifier** (_str, optional_) – Column-name of personal identifier in Kinexon.csv-file, defaults to None. Can be one of: `` `"sensor_id"` ``, `` `"mapped_id"` ``, `` `"name"` ``.
    
    When recording and exporting Kinexon data, the pID can be stored in different columns. Player-identifying columns are `` `"sensor_id"` ``, `` `"mapped_id"` ``, and `` `"full_name"` ``. If specified to one of the above, keys in links will be the pIDs in that column. If not specified, it will use one of the columns, favoring `` `"name"` `` over `` `"mapped_id"` `` over `` `"sensor_id"` ``.
    

Returns:

**links** – Link-dictionary of the form `` `links[group][identifier-ID]` `=` `xID` ``.

Return type:

Dict\[str, Dict\[str, int\]\]

`floodlight.io.kinexon.``get_column_names_from_csv`(_`filepath_data`_, _`delimiter``=``','`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/kinexon.html#get_column_names_from_csv)[](https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html#floodlight.io.kinexon.get_column_names_from_csv "Link to this definition")

Reads first line of a Kinexon.csv-file and extracts the column names.

Parameters:

-   **filepath_data** (_str or pathlib.Path_) – Full path to Kinexon.csv-file.
    
-   **delimiter** (_str_) – Column delimiter used in the Kinexon.csv file. Defaults to ‘,’.
    

Returns:

**columns** – List with every column name of the .csv-file.

Return type:

List\[str\]

`floodlight.io.kinexon.``get_meta_data`(_`filepath_data`_, _`delimiter``=``','`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/kinexon.html#get_meta_data)[](https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html#floodlight.io.kinexon.get_meta_data "Link to this definition")

Reads Kinexon’s position data file and extracts meta-data about groups, sensors, length and framerate.

Parameters:

-   **filepath_data** (_str or pathlib.Path_) – Full path to Kinexon.csv-file.
    
-   **delimiter** (_str, optional_) – Column delimiter used in the Kinexon.csv file. Defaults to ‘,’.
    

Return type:

`` `Tuple` ``\[`` `Dict` ``\[`` `str` ``, `` `Dict` ``\[`` `str` ``, `` `List` ``\[`` `str` ``\]\]\], `` `int` ``, `` `int` ``, `` `int` ``\]

Returns:

-   **pID_dict** (_Dict\[str, Dict\[str, List\[str\]\]\],_) – Nested dictionary that stores information about the pIDs from every player- identifying column in every group. ‘pID_dict\[group_identifier\]\[identifying_column\] = \[pID1, pID2, …, pIDn\]’ When recording and exporting Kinexon data, the pID can be stored in different columns. Player-identifying columns are “sensor_id”, “mapped_id”, and “full_name”. If the respective column is in the recorded data, its pIDs are listed in pID_dict. As with pID, group ids can be stored in different columns. Group-identifying columns are “group_name” and “group_id”. If both are available, group_name will be favored over group_id as the group_identifier.
    
-   **number_of_frames** (_int_) – Number of frames from the first to the last recorded frame.
    
-   **framerate** (_int_) – Estimated framerate in frames per second. Estimated from the smallest difference between two consecutive frames.
    
-   **t_null** (_int_) – Timestamp of the first recorded frame
    

`floodlight.io.kinexon.``read_position_data_csv`(_`filepath_data`_, _`delimiter``=``','`_, _`teamsheets``=``None`_, _`as_dict``=``False`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/kinexon.html#read_position_data_csv)[](https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html#floodlight.io.kinexon.read_position_data_csv "Link to this definition")

Parses a Kinexon .csv file and extracts position data.

Parameters:

-   **filepath_data** (_str or pathlib.Path_) – Full path to Kinexon .csv-file.
    
-   **delimiter** (_str, optional_) – Column delimiter used in the Kinexon.csv file. Defaults to ‘,’.
    
-   **teamsheets** (_dict of Teamsheet, optional_) – Pre-defined Teamsheet objects keyed by group ID. If None (default), teamsheets will be created automatically from metadata.
    
-   **as_dict** (_bool, optional_) – If True, returns teamsheets as a dictionary keyed by group. If False (default), returns teamsheets as a list sorted by group.
    

Returns:

**xy_objects** – If as_dict == False (default) returns a list of XY-objects for the whole game, one per group. The order of groups is ascending according to their group_id. If as_dict == True returns a dictionary with entries {group_id: XY} for each group in the data. If no groups are specified in the file, all data gets assigned to a dummy group “0”. The order inside the groups is ascending according to their appearance in the data.

Return type:

List\[[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\] or Dict\[str, [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]

`floodlight.io.kinexon.``read_teamsheets_from_csv`(_`filepath_data`_, _`delimiter``=``','`_, _`as_dict``=``False`_, _`player_id``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/kinexon.html#read_teamsheets_from_csv)[](https://floodlight.readthedocs.io/en/latest/modules/io/kinexon.html#floodlight.io.kinexon.read_teamsheets_from_csv "Link to this definition")

Reads Kinexon .csv data and returns Teamsheet objects per group.

Parameters:

-   **filepath_data** (_str or pathlib.Path_) – Full path to Kinexon .csv file.
    
-   **delimiter** (_str, optional_) – Delimiter used in the file. Defaults to ‘,’.
    
-   **as_dict** (_bool, optional_) – If True, return teamsheets as dict keyed by group. If False (default), return a list sorted by group.
    
-   **player_id** (_str, optional_) – Column name to use as the primary player identifier in the Teamsheet’s “player” column. Must match one of the available identifiers in the Kinexon data (e.g., “name”, “mapped_id”, “sensor_id”, “number”). If None (default), the function will automatically choose the best available identifier, prioritizing: “name” > “mapped_id” > “sensor_id” > “number”.
    

Returns:

**teamsheets** – List or dictionary with teamsheets for each group.

Return type:

List\[[Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\] or Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]