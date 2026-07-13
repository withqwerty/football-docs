---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/sportradar.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.io.sportradar.``read_event_data_json`(_`filepath_events`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/sportradar.html#read_event_data_json)[](https://floodlight.readthedocs.io/en/latest/modules/io/sportradar.html#floodlight.io.sportradar.read_event_data_json "Link to this definition")

Parses the Sportradar timeline files in json format and extracts the event data.

This function provides access to [Sport Event Timeline](https://developer.sportradar.com/docs/read/handball/Handball_v2#sport-event-timeline) files from the data provider [Sportradar](https://sportradar.com/) exported in json format and returns Event objects for all teams and segments of the game.

Parameters:

**filepath_events** (_str or pathlib.Path_) – Full path to json file where the Sport Event Timeline is saved.

Returns:

**data_objects** – Nested dictionary with `` `Events` `` objects for all teams and segments. The returned dictionary contains one dictionary per segment, which in return contain one `` `Events` `` object per team. For a usual league match with two halves and two teams this dictionary looks like: `` `{"HT1":` `{"Home":` `Events,` `"Away":` `Events},` `"HT2":` `{Home:` `Events,` `Away:` `Events}}` ``

Return type:

Dict\[str: Dict\[str: Events\]\]

Notes

Sportradar provides different information depending on the respective Event type. This parser itemizes top-level information for each possible event type listed in the [Handball v2 documentation FAQ](https://developer.sportradar.com/docs/read/handball/Handball_v2#frequently-asked-questions) (most recent check: 11.01.2023).

For example, this involves individual columns for the home and away score parsed event type _score_change_. However, individual columns for players involved in Events, like _seven_m_awarded_ or _shots_ are not fully itemized, as they can contain different information depending on the situation. More complex information that changes per event type is instead included as dict or list of dicts in according column, so they can be accessed if necessary.

In the return, the following columns contain temporal information about the event: `` `("gameclock",` `"time_stamp",` `"minutes_gross",` `"seconds_gross",` `"minutes",` `"seconds"` `)` ``. In handball, the match-clock determines the net playing time (60 minutes) and diverges from the gross “real world” time passed. The “gameclock” column contains the gross time passed in seconds in relation to the start of the respective segment. The “minute_gross” and “second_gross” columns contain the “gameclock” converted to minutes and seconds, respectively. The columns “minutes” and “seconds” contain the information about the net match-clock. The column “time_stamp” contains the global time-stamp of the respective event in the ISO 8601 standard format.

The column “outcome” in the return contains the “outcome” information in the raw event data and not information about the success {0, 1} of an event. The outcome in terms of success can be inferred by the `` `eID` ``. E.g. “score_change” implies that a shot lead to a goal, “shot_saved” implies that a goal was not scored.