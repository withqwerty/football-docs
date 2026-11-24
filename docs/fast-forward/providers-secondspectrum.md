---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/secondspectrum/
source_type: crawled
upstream_version: 0.4.0
crawled_at: 2026-11-24T20:04:36.009Z
---
Load tracking data from **SecondSpectrum** JSONL format.

## Function Signature

```
from fastforward import secondspectrum

dataset = secondspectrum.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="metadata.json",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to JSONL tracking file |
| `meta_data` | FileLike | required | Path to the metadata file: SecondSpectrum JSON or XML, or a mapping file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Only include frames where ball is in play |
| `exclude_missing_ball_frames` | bool | `True` | Exclude frames where ball tracking failed |
| `include_game_id` | bool \| str | `True` | Add game_id column |
| `object_id` | str | `"ss"` | Which id `player_id` carries: `"ss"`, `"fsp"`, or `"auto"` |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## File Format

**Tracking data** (JSONL): One JSON object per frame.

**Metadata**: Match information with teams, players, and pitch dimensions.

`meta_data` accepts three formats, detected from the file content:

| Format | Teams and players | Periods and fps |
| --- | --- | --- |
| SecondSpectrum JSON | From the metadata | From the metadata |
| SecondSpectrum XML | Team ids are `home` and `away`; players come from the tracking | From the metadata |
| Mapping file | From the mapping file | From the tracking |

### Mapping file

A JSON file with `MatchId`, `KickOffTime`, `Stadium` with `PitchLength` and `PitchWidth`, and `HomeTeam` and `AwayTeam`, each with an `Id`, a `Name` and `Players`. Every player needs an `Id` and a `JerseyNumber`. A player's `Id` is the FSP id the tracking carries in `playerExternalIds.fspId`, which is how the roster is linked to the tracking.

-   `game_id` is `MatchId`, the team ids are the mapping file's team `Id`s, and `game_date` is `KickOffTime.Date`.
-   Without `Stadium`, the pitch is assumed to be 105 by 68 metres.
-   fps is measured from the tracking, and the periods are derived from it.
-   The players table follows the mapping file's order, home team first. `position` is `UNK` and `is_starter` is null.
-   A player on the other side in the tracking, or wearing a different number there, raises an error, as does a tracking player missing from the mapping file. Each of these usually means the mapping file belongs to another match.

## Player ids

`object_id` picks which id `player_id` carries, in both the tracking and the players table:

| `object_id` | `player_id` |
| --- | --- |
| `"ss"` | SecondSpectrum's player UUID. A player who never appears in the tracking has no UUID and is left out of the players table. |
| `"fsp"` | The FSP id from `playerExternalIds.fspId`. A tracking player without one raises an error. |
| `"auto"` | The FSP id where the player has one, otherwise the UUID. |

Team ids always come from the metadata.

```
dataset = secondspectrum.load_tracking(
    raw_data="tracking.jsonl",
    meta_data="mapping_file.json",
    object_id="fsp",
)
```

## Example

```
from fastforward import secondspectrum

dataset = secondspectrum.load_tracking(
    raw_data="secondspectrum_tracking.jsonl",
    meta_data="secondspectrum_meta.json",
    layout="long_ball",
    coordinates="cdf",
    only_alive=True,
    exclude_missing_ball_frames=True,
)

print(dataset.tracking.shape)
print(dataset.metadata)
```

## Notes

-   SecondSpectrum uses CDF-compatible coordinates natively (center origin, meters)
-   Failed ball tracking is indicated by `ball_z == -10`. The `exclude_missing_ball_frames` parameter filters these frames out by default