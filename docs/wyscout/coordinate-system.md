---
source_url: https://apidocs.wyscout.com/
source_type: crawled
upstream_version: v3 2024-03-12 / v4 2024-05-09
crawled_at: 2026-06-03
---

# Wyscout Coordinate System

## Overview

Wyscout event locations are expressed as **percentages of the pitch, from 0 to 100**, on both axes. Coordinates are **subject-relative**: the goal the acting team is defending is always at `x=0`, and the goal it is attacking is always at `x=100`. There are no negative coordinates and no metre units on the location field (lengths/distances elsewhere — e.g. `pass.length` — are in metres).

```
x = 0    →  own goal (defending)
x = 100  →  opponent goal (attacking)
y = 0    →  one touchline
y = 100  →  the other touchline
```

## Corner reference points

From the acting subject's perspective:

| Point (x, y) | Pitch location |
|---|---|
| `(0, 0)` | Left corner near **own** goal |
| `(0, 100)` | Right corner near **own** goal |
| `(100, 0)` | Left corner near **opponent** goal |
| `(100, 100)` | Right corner near **opponent** goal |
| `(50, 50)` | Centre of the pitch |

![Wyscout pitch coordinates](https://dataglossary.wyscout.com/static/658f1bfbfc22e3b8df89f569fdb4883e/1d3c4/WyscoutDataCoordinates.png)

Both teams' events use this same own-goal-to-opponent-goal convention, so by default **both teams attack toward `x=100`** in the raw data. A team's events are always oriented as if it is attacking left-to-right regardless of the real-world direction of play.

`location` can be `null` for events where a location is not tagged.

## Implications for analysis

- To plot both teams on a single, broadcast-oriented pitch, **flip one team's coordinates** (`x → 100 - x`, `y → 100 - y`) so they attack opposite directions. Which team to flip per period depends on the real direction of play.
- Because coordinates are percentages, convert to metres against your assumed pitch size (e.g. 105×68 m) for any distance-based metric you compute yourself. Wyscout's own length/progression fields are already in metres.
- `pass.endLocation`, `carry.endLocation`, `shot` origin (`location`) and `possession.startLocation`/`endLocation` all use this same 0–100 system.

## Absolute orientation (v4): match directions

v3 gives you only subject-relative coordinates. **v4 adds `GET /matches/{wyId}/directions`**, which tells you the real direction of attack for each team in each period:

```json
{
  "1H": { "leftToRightTeamId": 16276, "rightToLeftTeamId": 3163 },
  "2H": { "leftToRightTeamId": 3163,  "rightToLeftTeamId": 16276 }
}
```

Combine this with the subject-relative event coordinates to place events on an **absolute** broadcast pitch (and to align with `fulltracking` broadcast-tracking data, which is in absolute pitch space). Teams swap ends between halves, so the mapping differs per period.

## Pass angle convention

`pass.angle` is in **degrees**: `0°` is a perfect forward pass (straight toward the opponent goal), positive values go right (`90°` = strictly right), negative values go left (`-90°` = strictly left), and a straight back pass is `180°`.
