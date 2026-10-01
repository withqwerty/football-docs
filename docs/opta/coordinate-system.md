# Opta Coordinate System

## Pitch Coordinates (F24 Appendix 11)

Opta uses a 0-100 normalised pitch for event coordinates (`x`, `y` fields on each event).

- **x-axis:** 0 = own goal-line, 100 = opponent's goal-line (direction of attack)
- **y-axis:** 0 = right touchline, 100 = left touchline (when facing opponent's goal)

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

To convert Opta to StatsBomb coordinates, flip the y axis as well as scaling it:
Opta's y = 0 is the right touchline (bottom), and StatsBomb's y = 0 is the top.
```
statsbomb_x = opta_x * 1.2
statsbomb_y = (100 - opta_y) * 0.8
```

This linear scaling is approximate. Opta's 0-100 pitch is not drawn to scale
(the penalty spot is at x = 11.5), so pitch markings do not line up exactly:
mplsoccer 1.8.1's `Standardizer(pitch_from="opta", pitch_to="statsbomb")` maps
Opta (11.5, 50) to StatsBomb (12, 40), not (13.8, 40). Use mplsoccer's
`Standardizer` or kloppy's `.transform()` when positions near the boxes matter.

To convert Opta to Wyscout:
```
wyscout_x = opta_x
wyscout_y = 100 - opta_y  (invert Y axis)
```

kloppy handles all coordinate transformations automatically with its `.transform()` method.
