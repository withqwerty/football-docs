---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/statsbomb.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.io.statsbomb.``read_open_event_data_json`(_`filepath_events`_, _`filepath_match`_, _`filepath_threesixty``=``None`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsbomb.html#read_open_event_data_json)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsbomb.html#floodlight.io.statsbomb.read_open_event_data_json "Link to this definition")

Parses files for a single match from the StatsBomb open dataset and extracts the event data and teamsheets.

This function provides high-level access to an events json file from the openly published StatsBomb open data and returns Event- and Teamsheet-objects for both teams for the full match. A StatsBomb360 json file can be passed to the function to include [StatsBomb360 data](https://statsbomb.com/articles/soccer/statsbomb-360-freeze-frame-viewer-a-new-release-in-statsbomb-iq/) to the `` `qualifier` `` column. Requires the parsed files from the dataset to maintain their original names from the [official data repository](https://github.com/statsbomb/open-data)

Parameters:

-   **filepath_events** (_str or pathlib.Path_) – Full path to json file where the Event data is saved.
    
-   **filepath_match** (_str or pathlib.Path_) – Full path to json file where information about all matches of a season are stored.
    
-   **filepath_threesixty** (_str or pathlib.Path, optional_) – Full path to json file where the StatsBomb360 data is saved if available. The information about the area of the field where player positions are tracked (`` `visible_area` ``) and player positions at single events (`` `freeze` `frame` ``) are stored as a string in the `` `qualifier` `` column.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[pID\] = team. If given as None (default), teamsheet is extracted from the events and match json files.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from the events and match json files. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, teamsheets).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `Events,` `'Away':` `Events},` `'HT2':` `{'Home':` `Events,` `'Away':` `Events}}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]\]

Notes

StatsBomb’s open format of handling provides certain additional event attributes, which attach additional information to certain events. As of now, these information are parsed as a string in the `` `qualifier` `` column of the returned DataFrame and can be transformed to a dict of form `` `{attribute:` `value}` ``. This includes the information about the tracked position of (some) players and the visible area that is included in the StatsBomb360 data.

`floodlight.io.statsbomb.``read_teamsheets_from_open_event_data_json`(_`filepath_events`_, _`filepath_match`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/statsbomb.html#read_teamsheets_from_open_event_data_json)[](https://floodlight.readthedocs.io/en/latest/modules/io/statsbomb.html#floodlight.io.statsbomb.read_teamsheets_from_open_event_data_json "Link to this definition")

Reads open events and match files and returns Teamsheet objects for the home and the away team.

Parameters:

-   **filepath_events** (_str or pathlib.Path_) – Full path to json file where the Event data is saved.
    
-   **filepath_match** (_str or pathlib.Path_) – Full path to json file where information about all matches of a season are stored.
    

Returns:

**teamsheets** – Dictionary with teamsheets for the home team and the away team.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]