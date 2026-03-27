# mplsoccer Pitch Types and Coordinate Systems

## Supported Pitch Types

| Pitch Type | Provider | X Range | Y Range | Dimensions Required | Notes |
|---|---|---|---|---|---|
| `statsbomb` (default) | StatsBomb | 0-120 | 80-0 (inverted y) | No (fixed) | Default pitch type |
| `opta` | Stats Perform / Opta | 0-100 | 0-100 | No (fixed) | Also used by Sofascore, WhoScored |
| `wyscout` | Wyscout / Hudl | 0-100 | 0-100 (inverted y) | No (fixed) | Similar to Opta but y-inverted |
| `tracab` | TRACAB / ChyronHego | Centered, cm | Centered, cm | Yes | Values in centimetres |
| `uefa` | UEFA | 0-105 | 0-68 | No (fixed) | Standard 105m x 68m |
| `metricasports` | Metrica Sports | 0-1 | 0-1 (inverted y) | Yes | Normalised coordinates |
| `skillcorner` | SkillCorner | Centered, m | Centered, m | Yes | Values in metres |
| `secondspectrum` | Second Spectrum | Centered, m | Centered, m | Yes | Values in metres |
| `impect` | Impect | -52.5 to 52.5 | -34 to 34 | No (fixed) | Centered |
| `custom` | Any | 0 to pitch_length | 0 to pitch_width | Yes | Fully configurable |

Tracking data providers (`tracab`, `metricasports`, `skillcorner`, `secondspectrum`, `custom`) require explicit `pitch_length` and `pitch_width` (typically 105 and 68).

## Pitch Constructor

```python
from mplsoccer import Pitch, VerticalPitch

# Basic pitch
pitch = Pitch(pitch_type='statsbomb')

# Tracking data pitch (requires dimensions)
pitch = Pitch(pitch_type='tracab', pitch_length=105, pitch_width=68)

# Customisation
pitch = Pitch(
    pitch_type='statsbomb',
    pitch_color='grass',       # 'grass' or any color
    line_color='white',
    stripe=True,               # alternating grass stripes
    stripe_color='#c2d59d',
    half=True,                 # show only half pitch
    goal_type='box',           # 'line', 'box', 'circle', or None
    positional=True,           # Juego de Posición zone lines
    corner_arcs=True,
    pad_left=5, pad_right=5,   # padding in data units
    pad_bottom=5, pad_top=5,
)

# Vertical orientation (rotated 90°)
vpitch = VerticalPitch(pitch_type='opta')
```

## Coordinate Standardization

The `Standardizer` converts coordinates between any two pitch types by mapping pitch markings (penalty areas, six-yard boxes, etc.) -- not just linear scaling. This is more accurate for event data but means the mapping is piecewise-linear.

```python
from mplsoccer import Standardizer

# Convert Opta (0-100) to StatsBomb (120x80)
std = Standardizer(pitch_from='opta', pitch_to='statsbomb')
x_new, y_new = std.transform(x, y)

# Reverse direction
x_orig, y_orig = std.transform(x_new, y_new, reverse=True)

# For tracking data, specify dimensions
std = Standardizer(
    pitch_from='tracab', pitch_to='statsbomb',
    length_from=105, width_from=68
)
```

## Custom Dimensions

For normalised ML coordinate systems, use `center_scale_dims()`:

```python
from mplsoccer.dimensions import center_scale_dims

# Create a -1 to 1 coordinate space
custom_dims = center_scale_dims(
    pitch_width=68, pitch_length=105,
    width=2, length=2,
    invert_y=False
)

pitch = Pitch(pitch_type=custom_dims)
```

For fully custom dimensions, subclass `BaseSoccerDims`.
