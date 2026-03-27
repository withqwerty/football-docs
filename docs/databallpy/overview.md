# DataBallPy

## Overview

DataBallPy is a Python package for loading, synchronizing, and analyzing soccer event and tracking data. Developed by Alexander Oonk and Daan Grob, licensed under MIT. Current version: 0.7.2.

Its key distinguishing feature is **smart synchronization of tracking and event data** using the Needleman-Wunsch algorithm (borrowed from bioinformatics sequence alignment), which preserves event ordering during alignment. Naive cost-function approaches do not guarantee this.

- **Install**: `pip install databallpy` (optional: `pip install 'databallpy[kloppy]'` for kloppy integration, `pip install 'databallpy[accessible-space]'` for dangerous accessible space)
- **Python**: 3.10 through 3.14
- **Key dependencies**: pandas>=2.1, numpy, scipy, matplotlib, pandera (schema validation), beautifulsoup4, pyarrow

## Supported Providers

### Tracking Data

| Provider | `tracking_data_provider` | Precise Timestamps | Notes |
|---|---|---|---|
| Tracab | `"tracab"` | Yes | Includes Sportec/DFL format |
| Metrica | `"metrica"` | Yes | Has open data support |
| Inmotio | `"inmotio"` | No | |
| Sportec/DFL | `"dfl"` or `"sportec"` | Yes | Uses Tracab parser internally |

### Event Data

| Provider | `event_data_provider` | Precise Timestamps | Notes |
|---|---|---|---|
| Opta | `"opta"` | Yes | F24 (events) + F7 (metadata) XML files |
| Metrica | `"metrica"` | Yes | Has open data support |
| Instat | `"instat"` | No | |
| SciSports | `"scisports"` | No | No separate metadata file needed |
| Sportec/DFL | `"dfl"` or `"sportec"` | Yes | |
| StatsBomb | `"statsbomb"` | No | Requires event_match_loc + event_lineup_loc |

### Kloppy Integration (v0.7.0+)

Install with `pip install 'databallpy[kloppy]'` to parse data from any kloppy-supported provider and convert to a DataBallPy `Game` object via `get_game_from_kloppy()`. This dramatically expands provider coverage.

## Coordinate System

Origin at center of pitch. All data is normalised so:
- Home team always plays left to right (negative x to positive x)
- Away team always plays right to left
- x range: roughly -53 to +53 metres (half pitch length)
- y range: roughly -34 to +34 metres (half pitch width)
- Validation bounds: ball_x [-62.5, 62.5], ball_y [-45, 45]

**Playing direction options** when retrieving frames:
- `"team_oriented"` (default): home left-to-right
- `"possession_oriented"`: coordinates flipped so possessing team always plays left-to-right

## Built-in Open Data

`get_open_game()` provides 7 DFL/Bundesliga matches (2 Bundesliga 1 + 5 Bundesliga 2):

```python
from databallpy import get_open_game
game = get_open_game(provider="sportec", game_id="J03WMX")
```

## Limitations and Caveats

- **Both data streams often needed**: Many features (synchronization, team possession, event frames) require both tracking and event data.
- **Simple xG/xT models**: Built-in xG uses basic logistic regression on distance and angle. xT uses pre-computed static lookup tables. Useful for quick analysis, not production-grade.
- **Sync quality depends on data quality**: If ball_status is wrong, timestamps imprecise, or tracking data starts late, sync degrades.
- **No Second Spectrum native parser**: Must use Kloppy bridge.
- **Video export requires ffmpeg**: `save_tracking_video` needs ffmpeg installed.
- **Deprecation in progress (v0.7.x to v0.8.0)**: `Match` class deprecated in favour of `Game`. Standalone feature functions deprecated in favour of methods on `TrackingData`.
- **Strict coordinate validation**: Pandera schema validation on load can reject data with positions slightly outside expected bounds.
- **Performance**: Some features iterate frame-by-frame in Python (Voronoi, pressure), which can be slow for full-game tracking data at 25 Hz (~135,000 frames).
- **Soccer only**: Despite the generic name, no support for other sports.
