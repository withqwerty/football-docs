---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/secondspectrum.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.io.secondspectrum.``read_event_data_jsonl`(_`filepath_insight`_, _`filepath_metadata`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/secondspectrum.html#read_event_data_jsonl)[](https://floodlight.readthedocs.io/en/latest/modules/io/secondspectrum.html#floodlight.io.secondspectrum.read_event_data_jsonl "Link to this definition")

Parse Second Spectrum’s Insight file (containing match events) and extract event data and pitch information.

This function provides a high-level access to the particular Second Spectrum Insight file and will return event objects for both teams. The number of segments is inferred from the data, yet data for each segment is stored in a separate object.

Parameters:

-   **filepath_insight** (_str or pathlib.Path_) – Full path to .jsonl-file.
    
-   **filepath_metadata** (_str or pathlib.Path_) – Full path to _meta.json file.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, pitch).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `Events,` `'Away':` `Events},` `'HT2':` `{'Home':` `Events,` `'Away':` `Events}}` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

Notes

Second Spectrum’s Insight files can be seen as a union of (wrapped) Opta event feeds and attached Second Spectrum markings. Thus, properties of the Opta F24-feed parser also mostly apply to this parser. This particularly includes the handling of qualifiers, which are included as a string in the `` `qualifier` `` column of the returned DataFrame’s. Second Spectrum markings are disregarded at this moment, but could be included in future releases.

`floodlight.io.secondspectrum.``read_position_data_jsonl`(_`filepath_position`_, _`filepath_metadata`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/secondspectrum.html#read_position_data_jsonl)[](https://floodlight.readthedocs.io/en/latest/modules/io/secondspectrum.html#floodlight.io.secondspectrum.read_position_data_jsonl "Link to this definition")

Parse Second Spectrum files and extract position data, possession and ballstatus codes, as well as pitch information.

Second Spectrum data is typically stored in two separate files, a .jsonl file containing the actual data as well as a _meta.json containing information about pitch size, framerate, lineups and start- and endframes of match periods. This function provides a high-level access to Second Spectrum data by parsing “the full match” given both files.

Parameters:

-   **filepath_position** (_str or pathlib.Path_) – Full path to .jsonl-file.
    
-   **filepath_metadata** (_str or pathlib.Path_) – Full path to _meta.json file.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet object for the home team used to create link dictionaries of the form links\[team\]\[jID\] = xID. The links are used to map players to a specific xID in the respective XY objects. Should be supplied for custom ordering. If given as None (default), teamsheet is extracted from the meta.json file and xIDs are assigned based on the ordering determined by the `` `read_teamsheets_from_metajson` `` function (see for details).
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet object for the away team. If given as None (default), teamsheet is extracted from the meta.json-file. See teamsheet_home for details.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (xy_objects, possession_objects, ballstatus_objects, teamsheets, pitch).

`` `xy_objects` `` is a nested dictionary containing `` `XY` `` objects for each team and segment of the form `` `xy_objects[segment][team]` `=` `XY` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `XY,` `'Away':` `XY},` `'HT2':` `{'Home':` `XY,` `'Away':` `XY}}` ``.

`` `possession_objects` `` is a dictionary containing `` `Code` `` objects with possession information (home or away) for each segment of the form `` `possession_objects[segment]` `=` `Code` ``.

`` `ballstatus_objects` `` is a dictionary containing `` `Code` `` objects with ballstatus information (dead or alive) for each segment of the form `` `ballstatus_objects[segment]` `=` `Code` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], Dict\[str, [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], Dict\[str, [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

`floodlight.io.secondspectrum.``read_teamsheets_from_meta_json`(_`filepath_metadata`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/secondspectrum.html#read_teamsheets_from_meta_json)[](https://floodlight.readthedocs.io/en/latest/modules/io/secondspectrum.html#floodlight.io.secondspectrum.read_teamsheets_from_meta_json "Link to this definition")

Parses the Second Spectrum meta.json-file and creates respective teamsheets for the home and the away team.

Parameters:

**filepath_metadata** (_str or pathlib.Path_) – Full path to _meta.json file.

Returns:

**teamsheets** – Dictionary with teamsheets for the home team and the away team.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]

Notes

The ordering of players is determined by position precedence, with the following precedence values assigned to Second Spectrum’s player position information:

```
{
    'GK': 1,
    'LB': 2,
    'LCB': 3,
    'CB': 4,
    'RCB': 5,
    'RB': 6,
    'LWB': 7,
    'LDM': 8,
    'CDM': 9,
    'RDM': 10,
    'RWB': 11,
    'LM': 12,
    'LCM': 13,
    'CM': 14,
    'RCM': 15,
    'RM': 16,
    'LW': 17,
    'CAM': 18,
    'RW': 19,
    'LF': 20,
    'LCF': 21,
    'CF': 22,
    'RCF': 23,
    'RF': 24,
    'SUB': 99
}
```