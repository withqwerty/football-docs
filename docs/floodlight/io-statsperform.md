---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.367Z
---
`floodlight.io.statsperform.``read_event_data_from_url`(_`url`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_event_data_from_url)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_event_data_from_url "Link to this definition")

Reads a URL containing a StatsPerform events CSV file and extracts the stored event data, pitch information, and teamsheets.

The event data from the URL is downloaded into a temporary file stored in the repository’s internal root `` `.data` ``\-folder and removed afterwards.

Parameters:

-   **url** (_str_) – URL to the XML file containing the event data.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[pID\] = team. The links are used to map players to the home and away teams. If given as None (default), teamsheet is extracted from the event data XML file.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the event data XML file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, teamsheets, pitch).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `Events,` `'Away':` `Events},` `'HT2':` `{'Home':` `Events,` `'Away':` `Events}}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

`floodlight.io.statsperform.``read_event_data_xml`(_`filepath_events`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_event_data_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_event_data_xml "Link to this definition")

Parses a StatsPerform XML file and extracts event data and pitch information.

This function provides high-level access to the StatsPerform match events XML file and returns Events objects for both teams and information about the pitch.

Parameters:

-   **filepath_events** (_str or pathlib.Path_) – Full path to the XML file containing the event data.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[pID\] = team. The links are used to map players to the home and away teams. If given as None (default), teamsheet is extracted from the event data XML file.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the event data XML file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, teamsheets, pitch).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `Events,` `'Away':` `Events},` `'HT2':` `{'Home':` `Events,` `'Away':` `Events}}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

`floodlight.io.statsperform.``read_open_event_data_csv`(_`filepath_events`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_open_event_data_csv)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_open_event_data_csv "Link to this definition")

Parses an open StatsPerform Match Event CSV file and extracts the event data and teamsheets.

This function provides high-level access to the particular openly published StatsPerform match events CSV file (e.g. for the Pro Forum ‘22) and returns Event objects for both teams.

Parameters:

-   **filepath_events** (_str or pathlib.Path_) – Full path to xml File where the Event data in StatsPerform csv format is saved
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team. If given as None (default), teamsheet is extracted from the event data CSV file.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the event data CSV file.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, teamsheets).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'1':` `{'Home':` `Events,` `'Away':` `Events},` `'2':` `{'Home':` `Events,` `'Away':` `Events}` `}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]\]

Notes

StatsPerform’s open format of handling provides certain additional event attributes, which attach additional information to certain events. As of now, these information are parsed as a string in the `` `qualifier` `` column of the returned DataFrame and can be transformed to a dict of form `` `{attribute:` `value}` ``.

`floodlight.io.statsperform.``read_open_position_data_csv`(_`filepath_position`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_open_position_data_csv)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_open_position_data_csv "Link to this definition")

Parses an open StatsPerform CSV file and extract position data and possession codes as well as teamsheets and pitch information.

Openly published StatsPerform position data (e.g. for the Pro Forum ‘22) is stored in a CSV file containing all position data (for both halves) as well as information about players, the pitch, and the ball possession. This function provides high-level access to StatsPerform data by parsing the CSV file.

Parameters:

-   **filepath_position** (_str or pathlib.Path_) – Full path to the CSV file.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[team\]\[jID\] = xID. The links are used to map players to a specific xID in the respective XY objects. Should be supplied for custom ordering. If given as None (default), teamsheet is extracted from the open StatsPerform CSV file and its xIDs are assigned in order of appearance.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the Match Information XML file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (xy_objects, possession_objects, teamsheets, pitch).

`` `xy_objects` `` is a nested dictionary containing `` `XY` `` objects for each team and segment of the form `` `xy_objects[segment][team]` `=` `XY` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{0:` `{'Home':` `XY,` `'Away':` `XY},` `1:` `{'Home':` `XY,` `'Away':` `XY}}` ``.

`` `possession_objects` `` is a dictionary containing `` `Code` `` objects with possession information (home or away) for each segment of the form `` `possession_objects[segment]` `=` `Code` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[int, Dict\[str, [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], Dict\[int, [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

`floodlight.io.statsperform.``read_position_data_from_url`(_`url`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_position_data_from_url)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_position_data_from_url "Link to this definition")

Reads a URL from the StatsPerform API (StatsEdgeViewer) containing a position data TXT file and extracts position data and teamsheets.

The position data from the URL is downloaded into a temporary file stored in the repository’s internal root `` `.data` ``\-folder and removed afterwards.

Parameters:

-   **url** (_str or pathlib.Path_) – URL to the TXT file containing the position data.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[team\]\[jID\] = xID. The links are used to map players to a specific xID in the respective XY objects. Should be supplied for custom ordering. If given as None (default), teamsheet is extracted from the position data TXT file and its xIDs are assigned in order of appearance.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the position data TXT file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (xy_objects, teamsheets).

`` `xy_objects` `` is a nested dictionary containing `` `XY` `` objects for each team and segment of the form `` `xy_objects[segment][team]` `=` `XY` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{1:` `{'Home':` `XY,` `'Away':` `XY},` `2:` `{'Home':` `XY,` `'Away':` `XY}}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

Return type:

Tuple\[Dict\[int, Dict\[str, [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], Dict\[int, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]\]

Notes

Statsperform position data does not contain any player information expect jersey numbers by default. Thus, the teamsheet objects generated by this method will name players ‘Player i’ with i starting at 1. To identify players, use the jersey numbers of players or provide custom teamsheets (e.g. by parsing teamsheets from the Statsperform event data or another data provider).

`floodlight.io.statsperform.``read_position_data_txt`(_`filepath_position`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_position_data_txt)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_position_data_txt "Link to this definition")

Parses a StatsPerform TXT file and extracts position data and teamsheets.

> Internal StatsPerform position data is stored as a TXT file containing all position data (for both halves). This function provides high-level access to StatsPerform data by parsing the TXT file. Since no information about framerate is delivered in the data itself, it is estimated from time difference between individual frames. Teamsheets are extracted from the event data, if filepath_events is provided. Otherwise, minimal Teamsheet-objects are inferred from the position data.

Parameters:

-   **filepath_position** (_str or pathlib.Path_) – Full path to the TXT file containing the position data.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[team\]\[jID\] = xID. The links are used to map players to a specific xID in the respective XY objects. Should be supplied for custom ordering. If given as None (default), teamsheet is extracted from the position data TXT file and its xIDs are assigned in order of appearance.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the position data TXT file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (xy_objects, teamsheets).

`` `xy_objects` `` is a nested dictionary containing `` `XY` `` objects for each team and segment of the form `` `xy_objects[segment][team]` `=` `XY` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{1:` `{'Home':` `XY,` `'Away':` `XY},` `2:` `{'Home':` `XY,` `'Away':` `XY}}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

Return type:

Tuple\[Dict\[int, Dict\[str, [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], Dict\[int, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]\]

Notes

Statsperform position data does not contain any player information expect jersey numbers by default. Thus, the teamsheet objects generated by this method will name players ‘Player i’ with i starting at 1. To identify players, use the jersey numbers of players or provide custom teamsheets (e.g. by parsing teamsheets from the Statsperform event data or another data provider).

`floodlight.io.statsperform.``read_teamsheets_from_event_data_xml`(_`filepath_events`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_teamsheets_from_event_data_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_teamsheets_from_event_data_xml "Link to this definition")

Parses the StatsPerform event file and returns two Teamsheet-objects with detailed player information for the home and the away team.

Parameters:

**filepath_events** (_str or pathlib.Path_) – Full path to the XML file containing the event data.

Returns:

**teamsheets** – Dictionary with teamsheets for the home team and the away team.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]

`floodlight.io.statsperform.``read_teamsheets_from_open_data_csv`(_`filepath_csv`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_teamsheets_from_open_data_csv)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_teamsheets_from_open_data_csv "Link to this definition")

Parses the entire open StatsPerform position data CSV file for unique jIDs (jerseynumbers) and creates teamsheets for both teams.

Parameters:

**filepath_csv** (_str or pathlib.Path_) – CSV file containing either open position or open event data.

Returns:

**teamsheets** – Dictionary with teamsheets for the home team and the away team.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]

Notes

Statsperform open data does not contain any player names. Thus, the teamsheet objects generated by this method will name players ‘Player i’ with i starting at 1. To identify players, use the jersey numbers of players or provide custom teamsheets generated by a different parser if Statsperform open data is used in combination with other data providers.

`floodlight.io.statsperform.``read_teamsheets_from_position_data_txt`(_`filepath_position`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsperform.html#read_teamsheets_from_position_data_txt)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsperform.html#floodlight.io.statsperform.read_teamsheets_from_position_data_txt "Link to this definition")

Parses the StatsPerform position file and returns two simple Teamsheet-objects containing only two columns “player” and “jID” for the home and the away team.

Parameters:

**filepath_position** (_str or pathlib.Path_) – Full path to the TXT file containing the position data.

Returns:

**teamsheets** – Dictionary with teamsheets for the home team and the away team.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]