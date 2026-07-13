---
source_url: https://floodlight.readthedocs.io/en/latest/compendium/5_identifier.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.364Z
---
## Identifier - Linking Information[](https://floodlight.readthedocs.io/en/latest/compendium/5_identifier.html#identifier-linking-information "Link to this heading")

We’ve previously highlighted the importance and necessity of linking information within and across observations. Within observations, data from the same players (such as positions, events or performance metrics) are often required to be linked across objects. This is especially important during parsing, where players are identified with their jersey number or an attached sensor ID rather than their name. Across observations, one might be interested in comparing player and team performances over the course of a season.

Data providers have established their own systems to keep track of identities. These systems assign IDs on many things from players, referees or coaches to clubs, competitions or seasons. Yet, different providers solve this task with slightly different systems that differ mostly in terms of scope and ID formats. A challenge arises when processing files from two data providers that use two non-matching ID systems.

In this package, we aim to fit these different systems under one hood by providing a minimal common ID system. Our approach consists of defining a set of ID categories that are reserved for ID purposes and follow a specific naming convention. All parsers within the package parse provider IDs into these categories, yet they only change the name, not the IDs. This way, you are free to use any database of IDs that you would like while knowing where to find certain information. We also offer a small linkage convention that helps connecting the multiple IDs.

## ID System[](https://floodlight.readthedocs.io/en/latest/compendium/5_identifier.html#id-system "Link to this heading")

Below is a list of IDs and according names have a special meaning within our package. This is one of the (rare) cases we deliberately deviate from PEP8 naming conventions to keep variable names short and quickly identifiable (_pun intended_). You will also find these IDs throughout the code.

pID

player identifier - Unique number or string for player identification.

jID

jersey identifier - A players jersey number within a single observation.

xID

index identifier - A players index in the list of all players of a team for a given observation. Starts counting at **0**. This identifier is primarily used for locating players in [XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html) objects, but can also be helpful iterating over or displaying all players of a team.

tID

team identifier - Unique number or string for team identification.

mID

match identifier - Unique number or string for match identification.

cID

competition identifier - Unique number or string for competition (e.g. league or cup) identification.

## Links[](https://floodlight.readthedocs.io/en/latest/compendium/5_identifier.html#links "Link to this heading")

To link one ID to another, we often use dictionaries that map the incoming to the outgoing ID. These are called `` `links` `` or, more detailed `` `links_*ID_to_*ID` ``. The dictionary keys are the incoming, the dictionary values the outgoing IDs. For example, a dictionary linking jersey numbers to index numbers can look the following:

```
links_jID_to_xID = {
    1: 1,
    15: 2,
    2: 3,
    # ...
}
```

If at some point you need to query or store player information with a certain ID, but you only have another one, this dictionary does all the work:

```
# Get the position data for player with shirt number 15 - this method requires and xID
xy.player(links_jID_to_xID[15])
```

A final remark: links are not enforced by the code at any point. It’s just a little internal convention that you will find throughout the source code. Some methods require or return links, and the method descriptions then give you more detailed information as to what they link. Feel free to use them!