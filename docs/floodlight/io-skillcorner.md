---
source_url: https://floodlight.readthedocs.io/en/latest/modules/io/skillcorner.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.366Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.io.skillcorner.``read_position_data_json`(_`file_path_structured_data`_, _`file_path_match_data`_, _`teamsheet_home``=``None`_, _`teamsheet_away``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/io/skillcorner.html#read_position_data_json)[](https://floodlight.readthedocs.io/en/latest/modules/io/skillcorner.html#floodlight.io.skillcorner.read_position_data_json "Link to this definition")

Parse and process position data and match data from the [SkillCorner Open Dataset](https://github.com/SkillCorner/opendata) from disk.

This dataset was published by [SkillCorner](https://www.skillcorner.com/) in a joint initiative with [Friends Of Tracking](https://www.youtube.com/channel/UCUBFJYcag8j2rm_9HkrrA7w). It contains 9 matches of broadcast tracking data in JSON format. The data for each match is structured in two separate files. The match data file contains meta information about the match and its competitors, like team and player’s identifiers. The structured data file contains the position data for each frame.

Parameters:

-   **file_path_structured_data** (_str_) – The file path to the positions JSON file.
    
-   **file_path_match_data** (_str_) – The file path to the match data JSON file.
    
-   **teamsheet_home** (_Teamsheet, optional_) – The teamsheet for the home team (default is None).
    
-   **teamsheet_away** (_Teamsheet, optional_) – The teamsheet for the away team (default is None).
    

Return type:

`` `tuple` ``\[`` `Dict` ``\[`` `str` ``, `` `Dict` ``\[`` `str` ``, [`` `XY` ``](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")\]\], `` `Dict` ``\[`` `str` ``, `` `Dict` ``\[`` `str` ``, [`` `Code` ``](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\]\], `` `Dict` ``\[`` `str` ``, `` `Dict` ``\[`` `str` ``, [`` `Code` ``](https://floodlight.readthedocs.io/en/latest/modules/core/code.html#floodlight.core.code.Code "floodlight.core.code.Code")\]\], `` `Dict` ``\[`` `str` ``, [`` `Teamsheet` ``](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "floodlight.core.teamsheet.Teamsheet")\], [`` `Pitch` ``](https://floodlight.readthedocs.io/en/latest/modules/core/pitch.html#floodlight.core.pitch.Pitch "floodlight.core.pitch.Pitch")\]

Returns:

-   **xy_objects** (_dict_) – A dictionary containing XY objects for each half and each team.
    
-   **possession_objects_team** (_dict_) – A dictionary containing team possession codes for each half.
    
-   **possession_objects_player** (_dict_) – A dictionary containing player possession codes for each half.
    
-   **teamsheets** (_dict_) – A dictionary containing the teamsheets for ‘Home’, ‘Away’, and ‘Ball’.
    
-   **pitch** (_Pitch_) – The Pitch object representing the match pitch.