---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/opta.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
`floodlight.io.opta.``get_opta_feedtype`(_`filepath`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/opta.html#get_opta_feedtype)[](https://floodlight.readthedocs.io/en/latest/modules/io/opta.html#floodlight.io.opta.get_opta_feedtype "Link to this definition")

Tries to extract the feed type from Opta’s XML feed.

This function assumes that the file follows Opta’s format of producing feeds. Thus it should have a “PRODUCTION HEADER” comment at the top of the file so that on line 6 it reads something like `` `production` `module:`  `Opta::Feed::XML::Soccer::F24` ``.

Parameters:

**filepath** (_Union\[str, Path\]_) – Full path to Opta XML file.

Returns:

**feedtype** – Returns the type of the feed as a string in case it finds it, e.g. ‘F24’, and None otherwise.

Return type:

str or None

`floodlight.io.opta.``read_event_data_xml`(_`filepath`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/opta.html#read_event_data_xml)[](https://floodlight.readthedocs.io/en/latest/modules/io/opta.html#floodlight.io.opta.read_event_data_xml "Link to this definition")

Parse Opta’s f24 feed (containing match events) and extract event data and pitch information.

This function provides a high-level access to the particular f24 feed and will return event objects for both teams. The number of segments is inferred from the data, yet data for each segment is stored in a separate object.

Parameters:

**filepath** (_str or pathlib.Path_) – Full path to the XML feed.

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, pitch).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `Events,` `'Away':` `Events},` `'HT2':` `{'Home':` `Events,` `'Away':` `Events}}` ``.

`` `pitch` `` is a `` `Pitch` `` object corresponding to the data.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], [Pitch](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

Notes

Opta’s format of handling event data information involves an elaborate use of so called qualifiers, which attach additional information to certain events. There also exists a number of mappings that define which qualifiers may be attached to which kind of events. Parsing this information involves quite a bit of logic and is planned to be included in further releases. As of now, qualifier information is parsed as a string in the qualifier column of the returned DataFrame and can be transformed to a dict of the form {qualifier_id: value}.