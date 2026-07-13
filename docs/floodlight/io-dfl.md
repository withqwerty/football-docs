---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/dfl.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
`floodlight.io.dfl.``read_event_data_xml`(_`filepath_events`_, _`filepath_mat_info`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/dfl.html#read_event_data_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/dfl.html#floodlight.io.dfl.read_event_data_xml "Link to this definition")

Parses a DFL Match Event XML file and extracts the event data as well as teamsheets.

The structure of the official tracking system of the DFL (German Football League) contains two separate xml files, one containing the actual data as well as a metadata file containing information about teams, pitch size, and start- and endframes of match periods. This function provides high-level access to DFL data by parsing “the full match” and returning Events-objects parsed from the event data xml-file as well as Teamsheet-objects parsed from the metadata xml-file. The number of segments is inferred from the data, yet data for each segment is stored in a separate object.

Parameters:

-   **filepath_events** (_str or pathlib.Path_) – Full path to XML File where the Event data in DFL format is saved.
    
-   **filepath_mat_info** (_str or pathlib.Path_) – Full path to XML File where the Match Information data in DFL format is saved.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to assign the tIDs of the teams to the “Home” and “Away” position. If given as None (default), teamsheet is extracted from the Match Information XML file.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the Match Information XML file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, teamsheets, pitch).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{` `'firstHalf':` `{'Home':` `Events,` `'Away':` `Events},` `'secondHalf':` `{'Home':` `Events,'Away':` `Events}` `}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

Notes

The DFL format of handling event data information involves an elaborate use of certain event attributes, which attach additional information to certain events. There also exist detailed definitions for these attributes. Parsing this information involves quite a bit of logic and is planned to be included in further releases. As of now, qualifier information is parsed as a string in the qualifier column of the returned DataFrame and might be transformed to a dict of the form: {attribute: value}.

`floodlight.io.dfl.``read_pitch_from_mat_info_xml`(_`filepath_mat_info`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/dfl.html#read_pitch_from_mat_info_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/dfl.html#floodlight.io.dfl.read_pitch_from_mat_info_xml "Link to this definition")

Reads match_information XML file and returns the playing Pitch.

Parameters:

**filepath_mat_info** (_str or pathlib.Path_) – Full path to XML File where the Match Information data in DFL format is saved.

Returns:

**pitch** – Pitch object with actual pitch length and width.

Return type:

[Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")

`floodlight.io.dfl.``read_position_data_xml`(_`filepath_positions`_, _`filepath_mat_info`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/dfl.html#read_position_data_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/dfl.html#floodlight.io.dfl.read_position_data_xml "Link to this definition")

Parse DFL files and extract position data, possession and ballstatus codes as well as pitch information and teamsheets.

The structure of the official tracking system of the DFL (German Football League) contains two separate xml files, one containing the actual data as well as a metadata file containing information about teams, pitch size, and start- and endframes of match periods. However, since no information about framerate is contained in the metadata, the framerate is estimated from the time difference between individual frames. This function provides high-level access to DFL data by parsing “the full match” and returning XY- and Code-objects parsed from the position data xml-file as well as Pitch- and Teamsheet-objects parsed from the metadata xml-file.

Parameters:

-   **filepath_positions** (_str or pathlib.Path_) – Full path to XML File where the Position data in DFL format is saved.
    
-   **filepath_mat_info** (_str or pathlib.Path_) – Full path to XML File where the Match Information data in DFL format is saved.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[team\]\[jID\] = xID and links\[team\]\[pID\] = jID. The links are used to map players to a specific xID in the respective XY objects. Should be supplied for custom ordering. If given as None (default), teamsheet is extracted from the Match Information XML file and its xIDs are assigned in order of appearance.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the Match Information XML file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (xy_objects, possession_objects, ballstatus_objects, teamsheets, pitch).

`` `xy_objects` `` is a nested dictionary containing `` `XY` `` objects for each team and segment of the form `` `xy_objects[segment][team]` `=` `XY` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'firstHalf':` `{'Home':` `XY,` `'Away':` `XY},` `'secondHalf':` `{'Home':` `XY,` `'Away':` `XY}}` ``.

`` `possession_objects` `` is a dictionary containing `` `Code` `` objects with possession information (home or away) for each segment of the form `` `possession_objects[segment]` `=` `Code` ``.

`` `ballstatus_objects` `` is a dictionary containing `` `Code` `` objects with ballstatus information (dead or alive) for each segment of the form `` `ballstatus_objects[segment]` `=` `Code` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], Dict\[str, [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], Dict\[str, [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

`floodlight.io.dfl.``read_teamsheets_from_mat_info_xml`(_`filepath_mat_info`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/dfl.html#read_teamsheets_from_mat_info_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/dfl.html#floodlight.io.dfl.read_teamsheets_from_mat_info_xml "Link to this definition")

Reads match_information XML file and returns two teamsheet objects for the home and the away team.

Parameters:

**filepath_mat_info** (_str or pathlib.Path_) – Full path to XML File where the Match Information data in DFL format is saved.

Returns:

**teamsheets** – Dictionary with teamsheets for the home team and the away team.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]