# Event-Derived Metric Recipes

Use kloppy-style normalised events when you need lightweight team or player metrics
from provider event feeds. These recipes are deliberately simple: label them as
derived estimates unless you are matching a provider's official metric definition
exactly.

## Coordinate convention

Pick one attacking coordinate convention before calculating metrics. A common
adapter convention is a 0-100 pitch where the acting team attacks towards `x=100`.
Under that convention:

| Zone | Rule |
|---|---|
| own defensive half | `x < 50` |
| opponent half | `x >= 50` |
| final third | `x >= 66.7` |
| high-press opponent build-up zone | opponent passes with `x < 60` |
| pressing action zone | pressing-team defensive actions with `x > 40` |

Do not assume raw providers all arrive in this convention. Opta event coordinates
are already 0-100 in attack direction, StatsBomb uses a 120x80 event pitch, and
tracking feeds often use metre-based or centre-origin coordinates. Transform first,
then calculate.

## End coordinates

For passes and carries, keep both start and end coordinates.

| Surface | Typical field |
|---|---|
| kloppy event start | `event.coordinates.x`, `event.coordinates.y` |
| kloppy event end | `event.end_coordinates.x`, `event.end_coordinates.y` |
| pandas export | `coordinates_x`, `coordinates_y`, `end_x`, `end_y` |
| Opta raw pass end | qualifiers `140` and `141` |
| Wyscout pass/carry end | `pass.endLocation` / `carry.endLocation` |
| StatsBomb pass/carry end | provider pass/carry end-location fields |

If end coordinates are missing, do not calculate xT, progressive-pass distance,
or pass vectors for that event.

## xT from pass and carry events

Expected threat can be implemented as a zone-grid delta for completed ball
movements:

```text
xT = value(end zone) - value(start zone)
```

Apply the delta to completed passes and completed carries only. Failed passes,
missing coordinates, shots, fouls, and defensive actions should contribute `0` or
be excluded, depending on whether your API reports total event contribution or
only successful attacking movement. Negative deltas are valid when the ball moves
away from goal.

State the grid source in your output. For example, a public 12x8 grid can be used
for fast product analytics, while socceraction can be used for SPADL/VAEP-style
models when you need a fuller action-value pipeline.

## Progressive passes

A simple 0-100 implementation counts a completed pass as progressive when:

```text
end_x - start_x >= 10
```

This is useful for quick product surfaces, but it is not the same as every
provider's official progressive-pass definition. Wyscout progressive-pass metrics,
for example, use their own glossary and are available as provider aggregates where
covered. Do not mix a custom `end_x - start_x >= 10` count with provider
advanced-stat totals without labelling the source.

## Field tilt

Field tilt is usually the team's share of final-third touches:

```text
team_final_third_touches / all_final_third_touches
```

With the 0-100 attacking convention, count located touch or on-ball events where
`x >= 66.7`. If neither team has a final-third touch, return `0` for both teams
or mark the metric unavailable consistently; do not divide by zero.

## PPDA

PPDA is passes allowed per defensive action. A lightweight event-derived version:

```text
opponent_completed_passes_in_build_up_zone / pressing_team_defensive_actions
```

Under the 0-100 acting-team convention:

| Component | Example rule |
|---|---|
| passes allowed | opponent completed passes with `x < 60` |
| defensive actions | pressing-team tackles, interceptions, challenges, and fouls with `x > 40` |

Lower PPDA means more intense pressing. If the defensive-action denominator is
zero, the value is infinite or unavailable; serialise it as `null` in JSON rather
than `0`.

## Output labelling

For public APIs and chart layers, include the metric source:

| Metric | Recommended label |
|---|---|
| custom xT grid | `derived_xT` or `xT_model` with grid version |
| custom PPDA | `event_derived_PPDA` |
| provider PPDA | provider name plus endpoint/source |
| custom progressive pass count | threshold and coordinate convention |
| field tilt | event types counted and coordinate convention |

This makes it clear when a chart is using provider aggregates versus metrics
computed from normalised event rows.
