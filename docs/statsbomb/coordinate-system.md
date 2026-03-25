# StatsBomb Coordinate System

## Pitch Dimensions

StatsBomb uses a **120 x 80 yard** pitch coordinate system.

```
(0,0) ────────────────────────────────────────── (120,0)
  │                                                │
  │                      │                         │
  │    ┌────────┐        │        ┌────────┐       │
  │    │        │        │        │        │       │
  │    │  ┌──┐  │        │        │  ┌──┐  │       │
  │    │  │GK│  │     ───┤        │  │GK│  │       │
  │    │  └──┘  │        │        │  └──┘  │       │
  │    │        │        │        │        │       │
  │    └────────┘        │        └────────┘       │
  │                      │                         │
  │                                                │
(0,80) ───────────────────────────────────────── (120,80)
```

## Key Properties

| Property | Value |
|----------|-------|
| Origin | Top-left corner (0, 0) |
| X-axis | Runs left to right (0 to 120) |
| Y-axis | Runs top to bottom (0 to 80) |
| Units | Yards |
| Pitch length | 120 yards |
| Pitch width | 80 yards |

## Attack Direction

The team in possession **always attacks left to right** (toward x=120). StatsBomb normalises all coordinates so that the acting team's goal is at x=0 and the opponent's goal is at x=120. This means:

- A shot from the edge of the box will have x around 96-102
- A goalkeeper's location will be around x=0-2 (own goal) or x=118-120 (opponent GK in freeze frames, shown from that team's perspective)
- Centre circle is at approximately (60, 40)

When viewing freeze frame data, opponent positions are shown from the perspective of the team performing the event. The opponent keeper will appear near x=120.

## Key Pitch Landmarks

| Landmark | Coordinates |
|----------|------------|
| Centre spot | (60, 40) |
| Own goal centre | (0, 40) |
| Opponent goal centre | (120, 40) |
| Own penalty spot | (12, 40) |
| Opponent penalty spot | (108, 40) |
| Own 6-yard box (near post) | (0, 30) to (6, 50) |
| Opponent 6-yard box | (114, 30) to (120, 50) |
| Own 18-yard box | (0, 18) to (18, 62) |
| Opponent 18-yard box | (102, 18) to (120, 62) |
| Goal width | 8 yards (y = 36 to y = 44) |
| Centre circle radius | 10 yards |

## Shot End Location (3D)

Shot `end_location` can include a third coordinate for height:

```json
"end_location": [117.3, 38.3, 0.8]
```

- `[x, y]` -- 2D position on the pitch
- `[x, y, z]` -- 3D position where z is height in yards above the ground

The goal frame (at x=120):
- Ground level: z = 0
- Crossbar height: z = 2.67 yards (8 feet)
- Post-to-post: y = 36 to y = 44 (8 yards)

---

## Coordinate Conversions

### StatsBomb to Opta (0-100 scale)

Opta uses a 100x100 coordinate system where (0,0) is bottom-left and (100,100) is top-right. The attacking team attacks left to right.

```
opta_x = (statsbomb_x / 120) * 100
opta_y = 100 - (statsbomb_y / 80) * 100
```

Note the Y-axis inversion: StatsBomb y increases downward, Opta y increases upward.

```typescript
function statsbombToOpta(x: number, y: number): [number, number] {
  return [
    (x / 120) * 100,
    100 - (y / 80) * 100
  ];
}

function optaToStatsbomb(x: number, y: number): [number, number] {
  return [
    (x / 100) * 120,
    (1 - y / 100) * 80
  ];
}
```

### StatsBomb to Wyscout (0-100 scale)

Wyscout also uses a 100x100 system, but (0,0) is top-left (same Y direction as StatsBomb). However, Wyscout inverts the attacking direction for the away team -- the home team attacks left to right and the away team attacks right to left. StatsBomb normalises both teams to attack left to right.

```typescript
function statsbombToWyscout(x: number, y: number): [number, number] {
  return [
    (x / 120) * 100,
    (y / 80) * 100
  ];
}

function wyscoutToStatsbomb(x: number, y: number): [number, number] {
  return [
    (x / 100) * 120,
    (y / 100) * 80
  ];
}
```

**Important**: When converting Wyscout away-team events, you must first flip the coordinates (100 - x, 100 - y) before applying the conversion, since Wyscout does not normalise attack direction.

### StatsBomb to Metres

A standard football pitch is approximately 105m x 68m:

```typescript
function statsbombToMetres(x: number, y: number): [number, number] {
  return [
    (x / 120) * 105,
    (y / 80) * 68
  ];
}
```

### StatsBomb to Pixel Coordinates

For rendering on a canvas/SVG of width `W` and height `H`:

```typescript
function statsbombToPixel(
  x: number, y: number,
  canvasWidth: number, canvasHeight: number
): [number, number] {
  return [
    (x / 120) * canvasWidth,
    (y / 80) * canvasHeight
  ];
}
```

---

## Provider Comparison

| Property | StatsBomb | Opta | Wyscout |
|----------|-----------|------|---------|
| Dimensions | 120 x 80 | 100 x 100 | 100 x 100 |
| Units | Yards | Percentage | Percentage |
| Origin | Top-left | Bottom-left | Top-left |
| X direction | Left to right | Left to right | Left to right |
| Y direction | Top to bottom | Bottom to top | Top to bottom |
| Attack normalised | Yes (always L-to-R) | Yes (always L-to-R) | Home only (away R-to-L) |
| 3D coordinates | Yes (shot end_location z) | No | No |

---

## 360 Visible Area

The `visible_area` in 360 data is a polygon defined as alternating x,y coordinates:

```json
"visible_area": [8.98, 80.0, 41.46, 0.0, 80.34, 0.0, 113.33, 80.0, 8.98, 80.0]
```

This decodes to vertices: (8.98, 80.0), (41.46, 0.0), (80.34, 0.0), (113.33, 80.0), closing back to (8.98, 80.0). The polygon represents the region of the pitch visible to the broadcast camera for that event. Players outside this polygon may exist but are not captured in the freeze frame.

To parse:

```typescript
function parseVisibleArea(coords: number[]): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let i = 0; i < coords.length; i += 2) {
    points.push([coords[i], coords[i + 1]]);
  }
  return points;
}
```
