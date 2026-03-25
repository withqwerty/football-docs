# Wyscout Coordinate System

## Overview

Wyscout uses a **percentage-based coordinate system** with values ranging from 0 to 100 on both axes.

- **Origin**: Top-left corner of the pitch (from the perspective of the attacking team's own goal)
- **X-axis**: 0 (own goal line) to 100 (opponent goal line) -- always in the direction of attack
- **Y-axis**: 0 (top of the pitch) to 100 (bottom of the pitch)

```
         0,0 ────────────────────────── 100,0
          │                                │
          │   Own half    │  Opponent half  │
          │               │                 │
          │      ←  Direction of attack  →  │
          │               │                 │
          │               │                 │
         0,100 ──────────────────────── 100,100
```

## Key Characteristics

- **Y-axis is inverted** compared to Opta (where Y=0 is bottom). In Wyscout, Y=0 is the top of the pitch.
- **Always attacking left-to-right**: coordinates are normalised so the team always attacks from left (x=0) to right (x=100), regardless of which half they're actually playing in.
- **Percentage-based**: values are not in metres. The pitch is treated as a 100x100 grid regardless of actual dimensions.

## Standard Pitch Dimensions

A standard football pitch is 105m x 68m. To convert:

```
actual_x_metres = (wyscout_x / 100) * 105
actual_y_metres = (wyscout_y / 100) * 68
```

## Conversion Formulas

### Wyscout to Opta

Opta uses 0-100 on both axes, but with Y=0 at the bottom.

```python
opta_x = wyscout_x       # Same
opta_y = 100 - wyscout_y  # Invert Y
```

### Wyscout to StatsBomb

StatsBomb uses metres: x in [0, 120], y in [0, 80]. Origin is top-left (same Y orientation as Wyscout).

```python
statsbomb_x = (wyscout_x / 100) * 120
statsbomb_y = (wyscout_y / 100) * 80
```

### Wyscout to kloppy (Standardised)

kloppy's default pitch dimensions are 105 x 68 metres, origin bottom-left:

```python
kloppy_x = (wyscout_x / 100) * 105
kloppy_y = 68 - (wyscout_y / 100) * 68  # Invert Y, scale to metres
```

Or let kloppy handle it:

```python
from kloppy import wyscout

dataset = wyscout.load(event_data=events_json, data_version="V3")
# Coordinates auto-transformed to kloppy's model
dataset = dataset.transform(
    to_coordinate_system="kloppy",  # 105x68, bottom-left origin
)
```

### Wyscout to WhoScored / Opta (0-100, bottom-left origin)

```python
whoscored_x = wyscout_x        # Same scale
whoscored_y = 100 - wyscout_y  # Invert Y axis
```

## Pitch Landmarks in Wyscout Coordinates

| Landmark | x | y |
|---|---|---|
| Own goal centre | 0 | 50 |
| Centre spot | 50 | 50 |
| Opponent goal centre | 100 | 50 |
| Own penalty spot | 10.5 | 50 |
| Opponent penalty spot | 89.5 | 50 |
| Top-left corner | 0 | 0 |
| Bottom-right corner | 100 | 100 |
| Own box top-left | 0 | 19.1 |
| Own box bottom-right | 16.5 | 80.9 |
| Opponent box top-left | 83.5 | 19.1 |
| Opponent box bottom-right | 100 | 80.9 |

Note: Penalty box coordinates are approximate based on 105x68m pitch mapped to 0-100.

## End Location

In v3, end locations are type-specific:

```json
{
  "pass": { "endLocation": { "x": 85.1, "y": 42.0 } },
  "shot": { "goalMouthLocation": { "y": 45.2, "z": 22.1 } }
}
```

In v2, end location was the second element of the `positions` array:

```json
{
  "positions": [
    { "x": 72, "y": 34 },
    { "x": 85, "y": 42 }
  ]
}
```

## Shot Goal Mouth Coordinates

For shots, the `goalMouthLocation` uses a separate coordinate system:

- **y**: 0-100 across the goal width (left post = 0, right post = 100)
- **z**: 0-100 for goal height (ground = 0, crossbar = 100)

This is independent of the pitch coordinate system.
