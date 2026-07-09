# kloppy Tracking Rendering Notes

## Rendering centre-origin tracking data

Several tracking providers use a pitch-centred coordinate frame. kloppy exposes the
provider coordinate system through the dataset metadata, so read the coordinate system
before drawing.

| Provider coordinate system | Typical dimensions | Origin | Unit |
|---|---|---|---|
| `secondspectrum` | `105 x 68` | centre | metres |
| `tracab` | `10500 x 6800` | centre | centimetres |
| `skillcorner` | `105 x 68` | centre | metres |

For a top-down 0-100 pitch display, a common centre-origin projection is:

```text
x100 = 50 + (x_m / pitch_length_m) * 100
y100 = 50 - (y_m / pitch_width_m) * 100
```

Use metres in the formula. For TRACAB-style centimetre feeds, convert first:
`x_m = x_cm / 100`, `y_m = y_cm / 100`. The `50 - ...` y formula is a display
choice that makes positive provider y render upward on a browser/canvas coordinate
system where screen y increases downward. If your renderer uses mathematical y-up
coordinates, keep y positive upward instead.

Do not hard-code `105 x 68` for every match when the provider metadata gives actual
pitch dimensions. Use the match or dataset `pitch_dimensions`, `pitch_length`, and
`pitch_width` fields where available.

## Frame windows and interpolation

Tracking feeds are frame sequences, usually exposed through kloppy as `Frame`
objects on a `TrackingDataset`.

| Field | Use |
|---|---|
| `frame_id` | frame ordering / cache key |
| `timestamp` | time within the period |
| `period` | first half, second half, extra time, etc. |
| `ball_coordinates` | ball position, often optional |
| `players_data[player].coordinates` | player position for the frame |
| `players_data[player].speed` | provider speed where available |
| `players_data[player].distance` | provider cumulative distance where available |
| `metadata.frame_rate` / `frame_rate` | frames per second, needed for interpolation and derived speeds |

For interactive rendering, stream small match-clock windows rather than the full
match into the browser. A 20 second window at 25 fps is roughly 500 frames. Interpolate
between neighbouring frames for smooth playback:

```text
frame_float = (target_ms - window_start_ms) / frame_dt_ms
i0 = floor(frame_float)
i1 = i0 + 1
frac = frame_float - i0
point = point0 + (point1 - point0) * frac
```

If either neighbouring player coordinate is missing, draw the non-missing point
without interpolation; if both are missing, omit that player for the frame.

## Ball live/dead handling

Some tracking exports distinguish live ball-in-play frames from dead-ball frames
or park the ball at a neutral location while play is stopped. If the feed exposes
a ball-state or live flag, preserve it alongside the coordinates.

Rendering guidance:

| Case | Recommended handling |
|---|---|
| live frame with ball coordinates | draw the current ball position |
| dead-ball frame with a last live ball position | show the last live position as inactive/faded |
| no ball coordinates | omit the ball rather than placing it at centre |
| no live/dead flag in an older cache/export | treat frames as live only if that is the provider's documented default |

Do not infer ball-in-play state from the ball being near the centre spot alone.
Centre coordinates can be genuine in kick-off or restart phases.

## Speed and distance fallbacks

Prefer provider speed and cumulative distance fields when they are present and
documented. If speed is absent, derive instantaneous speed from adjacent player
coordinates:

```text
speed_mps = distance(point_i, point_i+1) / dt_seconds
```

Apply sensible glitch guards before using derived speed for analysis or labels:
drop impossible spikes, skip frames with missing positions, and avoid reporting
speed from a single isolated coordinate. If cumulative distance is absent, either
derive it consistently over live frames or label it unavailable; do not mix
provider cumulative distance for some players with naive per-frame sums for others
without marking the source.

## Joining tracking to events

To combine tracking with event data:

1. Keep a canonical time coordinate such as `(period, milliseconds since period kick-off)`.
2. Convert event clocks and frame timestamps into that coordinate.
3. Use provider player IDs or kloppy `Player` objects to join event actors to tracked
   players.
4. Treat unmatched players as a normal data-quality condition; tracking rosters and
   event lineups are not always identical.

When a display combines event counts with tracking positions, only show the event
counts for players whose identity join is proven. Tracking-only players can still
show speed, distance, and position labels.
