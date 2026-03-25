# Opta Coordinate System

## Pitch Coordinates (F24 Appendix 11)

Opta uses a 0-100 normalised pitch for event coordinates (`x`, `y` fields on each event).

- **x-axis:** 0 = own goal-line, 100 = opponent's goal-line (direction of attack)
- **y-axis:** 0 = right touchline, 100 = left touchline (when facing opponent's goal)
- Values can slightly overflow (observed range: -1.7 to 101.7 on x, -2.0 to 102.0 on y)

Coordinates are always normalised **left to right**. The attacking team plays from x=0 to x=100 regardless of actual pitch direction or period.

## Own Goals

When qualifier 28 (Own Goal) is present on a type 16 goal event, the coordinates are **inverted**. The event is recorded at the defending goal end (low x) since that's where the ball went in. The `contestantId` on the event is the team that scored the own goal; downstream code must flip attribution to credit the opposing team.

## Key Pitch Zones

| Zone | X range | Notes |
|------|---------|-------|
| Own defensive third | 0-33.3 | Team's own third |
| Middle third | 33.3-66.7 | Midfield |
| Opponent's defensive third | 66.7-100 | Attacking third |
| Penalty area (approx) | 83-100, 21-79 | Inside the box |
| Six-yard box (approx) | 94-100, 37-63 | Near goal |

## Comparison with Other Providers

| Provider | X range | Y range | Origin | Notes |
|----------|---------|---------|--------|-------|
| Opta | 0-100 | 0-100 | Own goal, right touchline | Always attacks left-to-right |
| StatsBomb | 0-120 | 0-80 | Top-left | Metres, always attacks left-to-right |
| Wyscout | 0-100 | 0-100 | Top-left | Y is inverted vs Opta |
| SportMonks | varies | varies | Depends on source | Often inherits from underlying provider |

## Converting Between Systems

To convert Opta to StatsBomb coordinates:
```
statsbomb_x = opta_x * 1.2
statsbomb_y = opta_y * 0.8
```

To convert Opta to Wyscout:
```
wyscout_x = opta_x
wyscout_y = 100 - opta_y  (invert Y axis)
```

kloppy handles all coordinate transformations automatically with its `.transform()` method.
