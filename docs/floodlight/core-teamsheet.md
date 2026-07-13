---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.365Z
---
_`class`_ `floodlight.core.teamsheet.``Teamsheet`(_`teamsheet`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/teamsheet.html#Teamsheet)[](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet "Link to this definition")

Teamsheet storing player information. Core class of floodlight.

Teamsheet data is stored in a pandas `` `DataFrame` ``, where each row stores one player with their different properties organized in columns. Columns may contain any relevant information. A “player” column is required for instantiation to identify a player, and some particular column names are protected (see Notes).

Parameters:

**teamsheet** (_pd.DataFrame_) – DataFrame containing rows of players and columns of respective properties.

Variables:

-   **essential** (_list_) – List of essential columns available for stored players.
    
-   **protected** (_list_) – List of protected columns available for stored players.
    
-   **custom** (_list_) – List of custom (i.e. non-essential and non-protected) columns available for stored players.
    
-   **essential_missing** (_list_) – List of missing essential columns.
    
-   **essential_invalid** (_list_) – List of essential columns that violate the definitions.
    
-   **protected_missing** (_list_) – List of missing protected columns.
    
-   **protected_invalid** (_list_) – List of protected columns that violate the definitions.
    

Notes

Teamsheet data, particularly information available for players, may vary across data providers. To accommodate all data flavours, any column name or data type is permissible. However, one essential column is required (“player”). Other column names are protected. Using these names assumes that data stored in these columns follows conventions in terms of data types and value ranges. These are required for methods working with protected columns to assure correct calculations. Definitions for essential and protected columns can be found in [floodlight.core.definitions](https://floodlight.readthedocs.io/en/latest/modules/core/definitions.html#definitions-target).

`add_xIDs`()[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/teamsheet.html#Teamsheet.add_xIDs)[](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet.add_xIDs "Link to this definition")

Adds the column “xID” as an increasing index over all players.

The player index identifier (“xID”) is used to enforce an order to the players within a team. This identifier is primarily used for locating players in respective XY objects, but can also be helpful iterating over or displaying all players of a team. This function assigns the “xID” as an increasing index that counts over all players in the inner teamsheet DataFrame, starting at 0 and ending at N_players - 1. Any existing entries for “xID” are overwritten by this function.

`column_values_in_range`(_`col`_, _`definitions`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/teamsheet.html#Teamsheet.column_values_in_range)[](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet.column_values_in_range "Link to this definition")

Check if values for a single column of the inner teamsheet DataFrame are in correct range using the specifications from [floodlight.core.definitions](https://floodlight.readthedocs.io/en/latest/modules/core/definitions.html#definitions-target).

Parameters:

-   **col** (_str_) – Column name of the inner teamsheet DataFrame to be checked
    
-   **definitions** (_Dict_) – Dictionary (from floodlight.core.definitions) containing specifications for the columns to be checked.
    
    The definitions need to contain an entry for the column to be checked and this entry needs to contain information about the value range in the form: `` `definitions[col][value_range]` `=` `(min,` `max)` ``.
    

Returns:

True if the checks for value range pass and False otherwise

Return type:

bool

Notes

Non-integer results of this computation will always be rounded to the next smaller integer.

`get_links`(_`keys`_, _`values`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/core/teamsheet.html#Teamsheet.get_links)[](https://floodlight.readthedocs.io/en/latest/modules/core/teamsheet.html#floodlight.core.teamsheet.Teamsheet.get_links "Link to this definition")

Creates dictionary of links between two columns of the teamsheet as specified by keys and values.

Parameters:

-   **keys** (_str_) – Column of teamsheet used as keys in links dictionary.
    
-   **values** (_str_) – Column of teamsheet used as values in links dictionary.
    

Returns:

**links** – Dictionary of links between columns specified by keys and values argument.

Return type:

dict