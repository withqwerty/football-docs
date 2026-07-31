---
source_url: https://fast-forward.readthedocs.io/en/latest/providers/optavision/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.333Z
---
Load tracking data from **OptaVision** (StatsPerform's FIFA EPTS format).

## Function Signature

```
from fastforward import optavision

dataset = optavision.load_tracking(
    raw_data="match-trackingdata.txt",
    meta_data="match-metadata.xml",
)
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `raw_data` | FileLike | required | Path to the tracking text file |
| `meta_data` | FileLike | required | Path to the meta data XML file |
| `layout` | str | `"long"` | `"long"`, `"long_ball"`, or `"wide"` |
| `coordinates` | str | `"cdf"` | Target coordinate system |
| `orientation` | str | `"static_home_away"` | Target orientation |
| `only_alive` | bool | `True` | Accepted for API parity, has no effect (see Notes) |
| `include_game_id` | bool\| str | `True` | Add game_id column (defaults to the metadata's `match_uuid`) |
| `include_ball_owning_player` | bool | `True` | Add the `ball_owning_player_id` column |
| `engine` | str | `"polars"` | `"polars"` or `"pyspark"` |

## Ball-Owning Player

OptaVision exports include the player UUID of whoever is in possession on each frame. By default this is exposed as an additional column on the tracking DataFrame:

| Column | Type | Description |
| --- | --- | --- |
| `ball_owning_player_id` | Utf8 | Player UUID in possession |

Values match `dataset.players["player_id"]`. Set `include_ball_owning_player=False` to exclude this column.

## Example

```
from fastforward import optavision

dataset = optavision.load_tracking(
    raw_data="match-trackingdata.txt",
    meta_data="match-metadata.xml",
    layout="long",
)

print(dataset.tracking.head())
```

## Notes

-   OptaVision exports only contain in-play frames, so `only_alive` has no effect.
-   Native coordinates are CDF (metres, origin at pitch centre).
-   The FIFA EPTS export does not provide player positions, so every player has `position="UNK"`.