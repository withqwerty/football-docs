---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
Note

We cannot guarantee data availability for public data sets, unfortunately. Data from published articles (e.g. the EIGD) should be permanently available and stay static. Public provider data from StatsBomb is available on GitHub, but unversioned and with dynamically changing content. You can find methods to query the current list of games, and we also state the last date that we found the data to be available.

As public data sets for proprietary sports data are fairly rare, the standard way of accessing data is still via provider raw data files. To load these, we have more than ten parser for different provider formats in the IO submodule!

_`class`_ `floodlight.io.datasets.``EIGDDataset`(_`dataset_dir_name``=``'eigd_dataset'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#EIGDDataset)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.EIGDDataset "Link to this definition")

This dataset loads the EIGD-H data from the _A Unified Taxonomy and Multimodal Dataset for Events in Invasion Games_ paper. [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#id2)

Upon instantiation, the class checks if the data already exists in the repository’s root `` `.data` ``\-folder, and will download the files (~120MB) to this folder if not.

Parameters:

**dataset_dir_name** (_str, optional_) – Name of subdirectory where the dataset is stored within the root .data directory. Defaults to ‘eigd_dataset’.

Notes

The dataset contains a total of 25 short samples of spatiotemporal data for both teams and the ball from the German Men’s Handball Bundesliga (HBL). For more information, visit the [official project repository](https://github.com/MM4SPA/eigd). Data for one sample can be queried calling the [`` `get()` ``](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.EIGDDataset.get "floodlight.io.datasets.EIGDDataset.get")\-method specifying the match and segment. The following matches and segments are available:

```
matches = ['48dcd3', 'ad969d', 'e0e547', 'e8a35a', 'ec7a6a']
segments = {
    '48dcd3': ['00-06-00', '00-15-00', '00-25-00', '01-05-00', '01-10-00'],
    'ad969d': ['00-00-30', '00-15-00', '00-43-00', '01-11-00', '01-35-00'],
    'e0e547': ['00-00-00', '00-08-00', '00-15-00', '00-50-00', '01-00-00'],
    'e8a35a': ['00-02-00', '00-07-00', '00-14-00', '01-05-00', '01-14-00'],
    'ec7a6a': ['00-30-00', '00-53-00', '01-19-00', '01-30-00', '01-40-00'],
}
```

Examples

```
>>> from floodlight.io.datasets import EIGDDataset
```

```
>>> dataset = EIGDDataset()
# get one sample
>>> teamA, teamB, ball = dataset.get(match_name="48dcd3", segment="00-06-00")
# get the corresponding pitch
>>> pitch = dataset.get_pitch()
```

References

`get`(_`match_name``=``'48dcd3'`_, _`segment``=``'00-06-00'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#EIGDDataset.get)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.EIGDDataset.get "Link to this definition")

Get one sample from the EIGD dataset.

Parameters:

-   **match_name** (_str, optional_) – Match name, check Notes section for valid arguments. Defaults to the first match (“48dcd3”).
    
-   **segment** (_str, optional_) – Segment identifier, check Notes section for valid arguments. Defaults to the first segment (“00-06-00”).
    

Returns:

**sample** – Returns three XY objects of the form (teamA, teamB, ball) for the requested sample.

Return type:

Tuple\[[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY"), [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY"), [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]

_`static`_ `get_pitch`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#EIGDDataset.get_pitch)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.EIGDDataset.get_pitch "Link to this definition")

Returns a Pitch object corresponding to the EIGD-data.

Return type:

[`` `Pitch` ``](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")

_`class`_ `floodlight.io.datasets.``IDSSEDataset`(_`dataset_dir_name``=``'idsse_dataset'`_, _`match_id``=``'J03WMX'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#IDSSEDataset)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.IDSSEDataset "Link to this definition")

This dataset loads the accompanying data set from the _An integrated dataset of spatiotemporal and event data in elite soccer_ paper. [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#id4)

Upon instantiation, the class checks if the specified data already exists in the repository’s root `` `.data` ``\-folder, and will download the files to this folder if not. The default setting is to load the first match from the dataset. However, any individual match or the entire dataset (~2.4 GB) can be downloaded.

Parameters:

-   **dataset_dir_name** (_str, optional_) – Name of subdirectory where the dataset is stored within the root .data directory. Defaults to ‘idsse_dataset’.
    
-   **match_id** (_str, optional_) – Match-ID of either one of the matches or ‘all’. Defaults to ‘J03WMX’. Setting it to one of the matches will download the data of this individual match, if it does not exist in the repository’s root `` `.data` ``\-folder. Setting it to ‘all’ will download the data of all matches that do not exist in `` `.data` ``.
    

Notes

The dataset contains seven full matches of raw event and position data for both teams and the ball from the German Men’s Bundesliga season 2022/23 first and second division. A detailed description of the dataset as well as the collection process can be found in the accompanying paper. Data for one match can be queried calling the [`` `get()` ``](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.IDSSEDataset.get "floodlight.io.datasets.IDSSEDataset.get")\-method by specifying the match. The following matches are available:

```
matches = {
'J03WMX': 1. FC Köln vs. FC Bayern München,
'J03WN1': VfL Bochum 1848 vs. Bayer 04 Leverkusen,
'J03WPY': Fortuna Düsseldorf vs. 1. FC Nürnberg,
'J03WOH': Fortuna Düsseldorf vs. SSV Jahn Regensburg,
'J03WQQ': Fortuna Düsseldorf vs. FC St. Pauli,
'J03WOY': Fortuna Düsseldorf vs. F.C. Hansa Rostock,
'J03WR9': Fortuna Düsseldorf vs. 1. FC Kaiserslautern
}
```

Examples

```
>>> from floodlight.io.datasets import IDSSEDataset
```

```
>>> dataset = IDSSEDataset("J03WMX")
# get one sample
>>> events, xy, possession, ballstatus, teamsheets, pitch = dataset.get("J03WMX")
# get the corresponding pitch
>>> pitch = dataset.get_pitch()
```

References

`get`(_`match_id``=``'J03WMX'`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_, _`events``=``True`_, _`positions``=``True`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#IDSSEDataset.get)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.IDSSEDataset.get "Link to this definition")

Get event and position data from the IDSSE dataset.

Parameters:

-   **match_id** (_str, optional_) – Match name, check Notes section for valid arguments. Defaults to the first match “J03WMX”.
    
-   **teamsheet_home** (_Teamsheet, optional_) –
    
    Teamsheet-object for the home team used to create link dictionaries of the
    
    form links\[pID\] = team. If given as None (default), teamsheet is extracted from the data.
    
-   **teamsheet_away** (_Teamsheet, optional_) –
    
    Teamsheet-object for the away team used to create link dictionaries of the
    
    form links\[pID\] = team. If given as None (default), teamsheet is extracted from the data.
    
-   **events** (_bool, optional_) – Specifies whether the event data should be returned. Default is True. If false None will be returned instead of the events-objects.
    
-   **positions** (_bool, optional_) – Specifies whether the position data should be returned. Default is True. If false None will be returned instead of the XY-objects, possession-objects, and ballstatus-objects. This will improve performance considerably if only event data is required.
    

Return type:

`` `Tuple` ``\[`` `Dict` ``\[`` `str` ``, `` `Dict` ``\[`` `str` ``, [`` `Events` ``](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], `` `Dict` ``\[`` `str` ``, `` `Dict` ``\[`` `str` ``, [`` `XY` ``](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], `` `Dict` ``\[`` `str` ``, [`` `Code` ``](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], `` `Dict` ``\[`` `str` ``, [`` `Code` ``](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\], `` `Dict` ``\[`` `str` ``, [`` `Teamsheet` ``](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [`` `Pitch` ``](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

Returns:

-   **match_data** (_Tuple\[Dict\[str, Dict\[str, Events\]\], Dict\[str, Dict\[str, XY\]\],_)
    
-   _Dict\[str, Code\], Dict\[str, Code\], Dict\[str, Teamsheet\],Pitch\]_ – Returns a tuple of shape (events_objects, xy_objects, possession_objects, ballstatus_objects, teamsheets_objects, pitch_object) as returned by the `` `floodlight.io.dfl.read_event_data_xml()` `` and `` `floodlight.io.dfl.read_position_data_xml()` `` functions for the requested match. If any of the arguments `` `events` `` or `` `positions` `` are set to False, None is returned instead of event_data or xy_objects, possession_objects, and ballstatus_objects, respectively.
    

_`static`_ `get_pitch`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#IDSSEDataset.get_pitch)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.IDSSEDataset.get_pitch "Link to this definition")

Returns a Pitch object corresponding to the IDSSE-data.

Return type:

[`` `Pitch` ``](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")

_`class`_ `floodlight.io.datasets.``StatsBombOpenDataset`(_`dataset_dir_name``=``'statsbomb_dataset'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#StatsBombOpenDataset)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.StatsBombOpenDataset "Link to this definition")

This dataset loads the StatsBomb open data provided by the [official data repository](https://github.com/statsbomb/open-data).

Due to the size of the full dataset (~5GB), only metadata (~2MB) are downloaded to the repository’s root `` `.data` ``\-folder upon instantiation while the other data are only downloaded on demand. All downloaded files stay on disk if not manually removed.

Parameters:

**dataset_dir_name** (_str, optional_) – Name of subdirectory where the dataset is stored within the root .data directory. Defaults to ‘statsbomb_dataset’.

Notes

The dataset contains results, lineups, event data, and (partly) [StatsBomb360 data](https://statsbomb.com/articles/soccer/statsbomb-360-freeze-frame-viewer-a-new-release-in-statsbomb-iq/) for a variety of matches from a total of eight different competitions (Women’s World Cup, FIFA World Cup, UEFA Euro, Champions League, FA Women’s Super League, NWSL, Premier League, and La Liga). The Champions League data for example contains all Finals from 2003/2004 to 2018/2019. The La Liga data contains every one of the 520 matches ever played by Lionel Messi for FC Barcelona. The UEFA Euro data contains 51 matches where StatsBomb360 data is available. As the data is constantly updated, we provide an overview over the stats here but refer to the official repository for up-to-date information (last checked 20.08.2022):

```
number_of_matches = {
    "Champions League": {
        '1999/2000' : 0, '2003/2004' : 1, '2004/2005' : 1, '2006/2007' : 1,
        '2008/2009' : 1, '2009/2010' : 1, '2010/2011' : 1, '2011/2012' : 1,
        '2012/2013' : 1, '2013/2014' : 1, '2014/2015' : 1, '2015/2016' : 1,
        '2016/2017' : 1, '2017/2018' : 1, '2018/2019' : 1,
        },
    "FA Women's Super League": {
        '2018/2019' : 108, '2019/2020' : 87, '2020/2021' : 131,
        },
    "FIFA World Cup": {
        '2018' : 64,
        },
    "La Liga": {
        '2004/2005': 7, '2005/2006' : 17, '2006/2007' : 26, '2007/2008' : 28,
        '2008/2009' : 31, '2009/2010' : 35, '2010/2011' : 33, '2011/2012' : 37,
        '2012/2013' : 32, '2013/2014' : 31, '2014/2015' : 38, '2015/2016' : 33,
        '2016/2017' : 34, '2017/2018' : 36, '2018/2019' : 34, '2019/2020' : 33,
        '2020/2021' : 35,
        },
    "NWSL": {
        '2018' : 36,
        },
    "Premier League": {
        '2003/2004' : 33,
        },
    "UEFA Euro" : {
        '2020' : 51,
        },
    "Women's World Cup": {
        '2019' : 52,
        },
}
```

Examples

```
>>> from floodlight.io.datasets import StatsBombOpenDataset
>>> dataset = StatsBombOpenDataset()
# get one sample of event data with StatsBomb360 data
>>> events, teamsheets = dataset.get("UEFA Euro", "2020", "England vs. Germany")
# get the corresponding pitch
>>> pitch = dataset.get_pitch()
# get a summary of available matches in the dataset
>>> matches = dataset.available_matches
# extract every La Liga Clásico played in Camp Nou by Lionel Messi
>>> clasicos = matches[matches["match_name"] == "Barcelona vs. Real Madrid"]
# print outcomes
>>> for _, match in clasicos.iterrows():
>>>     print(f"Season {match['season_name']} - Barcelona {match['score']} Real'")
# read events to list
>>> clasico_events = []
>>> for _, clasico in clasicos.iterrows():
>>>     data = dataset.get("La Liga", clasico["season_name"], clasico["match_name"])
>>>     clasico_events.append(data)
```

_`property`_ `available_matches`_`:` `DataFrame`_[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.StatsBombOpenDataset.available_matches "Link to this definition")

Creates and returns a DataFrame with information for all available matches from the metadata that is downloaded upon instantiation.

Returns:

**summary** – Table where the rows contain meta information of individual games such as `` `competition_name` ``, `` `season_name` ``, and `` `match_name` `` (in the format Home vs. Away), location of the match (`` `stadium` `` and `` `country` ``), `` `sex` `` of the players (female or male), the `` `StatsBomb360_status` `` and the final `` `score` ``.

Return type:

pd.DataFrame

`get`(_`competition_name``=``'La` `Liga'`_, _`season_name``=``'2020/2021'`_, _`match_name``=``None`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#StatsBombOpenDataset.get)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.StatsBombOpenDataset.get "Link to this definition")

Get events and teamsheets from one match of the StatsBomb open dataset.

If [StatsBomb360data](https://statsbomb.com/articles/soccer/statsbomb-360-freeze-frame-viewer-a-new-release-in-statsbomb-iq/) are available, they are stored in the `` `qualifier` `` column of the Events object. If the files are not contained in the repository’s root `` `.data` `` folder they are downloaded to the folder and will be stored until removed by hand.

Parameters:

-   **competition_name** (_str, optional_) – Competition name for which the match is played, check Notes section for possible competitions. Defaults to “La Liga”.
    
-   **season_name** (_str, optional_) – Season name during which the match is played. For league matches use the format YYYY/YYYY and for international cup matches the format YYYY. Check Notes for available seasons of every competition. Defaults to “2020/2021”.
    
-   **match_name** (_str, optional_) – Match name relating to the available matches in the chosen competition and season. If equal to None (default), the first available match of the given competition and season is chosen.
    
-   **teamsheet_home** (_Teamsheet, optional_) – Teamsheet-object for the home team used to create link dictionaries of the form links\[pID\] = team. If given as None (default), teamsheet is extracted from the data.
    
-   **teamsheet_away** (_Teamsheet, optional_) – Teamsheet-object for the away team. If given as None (default), teamsheet is extracted from data.
    

Returns:

**data_objects** – Tuple of (nested) floodlight core objects with shape (events_objects, teamsheets).

`` `events_objects` `` is a nested dictionary containing `` `Events` `` objects for each team and segment of the form `` `events_objects[segment][team]` `=` `Events` ``. For a typical league match with two halves and teams this dictionary looks like: `` `{'HT1':` `{'Home':` `Events,` `'Away':` `Events},` `'HT2':` `{'Home':` `Events,` `'Away':` `Events}}` ``.

`` `teamsheets` `` is a dictionary containing `` `Teamsheet` `` objects for each team of the form `` `teamsheets[team]` `=` `Teamsheet` ``.

Return type:

Tuple\[Dict\[str, Dict\[str, [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events")\]\], Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]\]

_`static`_ `get_pitch`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#StatsBombOpenDataset.get_pitch)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.StatsBombOpenDataset.get_pitch "Link to this definition")

Returns a Pitch-object corresponding to the StatsBomb Dataset.

Return type:

[`` `Pitch` ``](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")

`get_teamsheets`(_`competition_name``=``'La` `Liga'`_, _`season_name``=``'2020/2021'`_, _`match_name``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#StatsBombOpenDataset.get_teamsheets)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.StatsBombOpenDataset.get_teamsheets "Link to this definition")

Returns a dictionary with Teamsheet-objects for both teams (“Home” and “Away”) from one match of the StatsBomb open dataset.

Parameters:

-   **competition_name** (_str, optional_) – Competition name for which the match is played, check Notes section for possible competitions. Defaults to “La Liga”.
    
-   **season_name** (_str, optional_) – Season name during which the match is played. For league matches use the format YYYY/YYYY and for international cup matches the format YYYY. Check Notes for available seasons of every competition. Defaults to “2020/2021”.
    
-   **match_name** (_str, optional_) – Match name relating to the available matches in the chosen competition and season. If equal to None (default), the first available match of the given competition and season is chosen.
    

Returns:

**teamsheets** – Teamsheet-objects for both teams (“Home” and “Away”) of the given match.

Return type:

Dict\[str, [Teamsheet](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\]

_`class`_ `floodlight.io.datasets.``ToyDataset`[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#ToyDataset)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.ToyDataset "Link to this definition")

This dataset loads synthetic data for a (very) short artificial football match.

The data can be used for testing or trying out features. They come shipped with the package and are stored in the repository’s root `` `.data` ``\-folder.

Examples

```
>>> from floodlight.io.datasets import ToyDataset
```

```
>>> dataset = ToyDataset()
# get one sample
>>> (
>>>     xy_home,
>>>     xy_away,
>>>     xy_ball,
>>>     events_home,
>>>     events_away,
>>>     possession,
>>>     ballstatus,
>>> ) = dataset.get(segment="HT1")
# get the corresponding pitch
>>> pitch = dataset.get_pitch()
```

`get`(_`segment``=``'HT1'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#ToyDataset.get)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.ToyDataset.get "Link to this definition")

Get data objects for one segment from the toy dataset.

Parameters:

**segment** (_{‘HT1’, ‘HT2’}, optional_) – Segment identifier for the first (“HT1”, default)) or the second (“HT2”) half.

Returns:

**toy_dataset** – Returns seven core objects of the form (xy_home, xy_away, xy_ball, events_home, events_away, possession, ballstatus) for the requested segment.

Return type:

Tuple\[[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY"), [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY"), [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY"), [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events"), [Events](https://floodlight.readthedocs.io/en/latest/modules/core/events.html#floodlight.core.events.Events "floodlight.core.events.Events"), [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code"), [Code](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\]

_`static`_ `get_pitch`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/datasets.html#ToyDataset.get_pitch)[](https://floodlight.readthedocs.io/en/latest/modules/io/datasets.html#floodlight.io.datasets.ToyDataset.get_pitch "Link to this definition")

Returns a Pitch object corresponding to the Toy Dataset.

Return type:

[`` `Pitch` ``](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")