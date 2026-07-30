---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
---

# Impect Coordinate System and Spatial Zones

Impect locates every event three ways at once: continuous pitch coordinates, a
**packing zone** (fluid, defined against the opposition's shape), and two static
grids (`pitchPosition` vertically, `lane` horizontally). The packing zone is the
distinctive one and underpins Impect's Packing and pxT metrics.

## Pitch coordinates

Impect uses a **standardised 105 × 68 metre pitch with the origin at the centre
spot**.

| Field | Meaning |
|---|---|
| `coordinates` | Raw coordinates, from the viewpoint of the TV footage |
| `adjCoordinates` | Adjusted coordinates, where **both teams play left to right** |

Ranges observed across all 939,200 snapshot events:

| Axis | Range |
|---|---|
| `x` | −52.5 to +52.5 (length, 105 m) |
| `y` | −34.0 to +34.0 (width, 68 m) |

Use `adjCoordinates` for anything direction-sensitive — comparing or aggregating
across halves and teams — since it removes the need to flip by period or side.
Use raw `coordinates` only when you need to align with the broadcast view.

Both `start` and `end` carry both coordinate pairs. `end` is null on roughly 42%
of events (those with no distinct end location), so guard for it.

## Packing zones

Packing zones are Impect's central spatial concept and the one most often
misdescribed. They are **not** thirds of the pitch, and they are **not** static.

> Zones are a big issue in modern football. All previous approaches from the data
> field have referred to the pitch ("1st third", "half track") and were thus
> static. Packing zones are fluid zones that are mainly oriented towards the
> opposing field players.

They answer: in which zones does a player move, which zones does the opponent
like to play in, and in which zones can the opponent be broken?

### The 24 base zones

Each zone family has a central, left and right variant (suffix `C`, `L`, `R`),
except the wide and in-behind-wide families.

| Family | Codes | Definition | Meaning |
|---|---|---|---|
| Goalkeeper | `GKC`, `GKL`, `GKR` | Determined solely by the goalkeeper's position; horizontal and vertical points are not relevant | The goalkeeper has the ball, regardless of where |
| Centre-Back | `CBC`, `CBL`, `CBR` | In front of the opposing forwards, usually with all opponents between ball and opposing goal. Borders the FB zones laterally, the DM zone in front, the GK zone behind | Neutral zone in which play is built from the centre |
| Full-Back Right | `FBR` | Adjacent to the CB zone, defined by the player being outside the opponent's formation. Borders the wide-right zone in front | Deep zone right of the CB zone, where the right-sided defender usually is |
| Full-Back Left | `FBL` | Adjacent to the CB zone, defined by the player being outside the opponent's formation. Borders the wide-left zone in front | Deep zone left of the CB zone |
| Defensive-Mid | `DMC`, `DML`, `DMR` | Central and semi-central, behind the opposing strikers and in front of the opposing midfielders. Between the CB zone behind and the CM zone in front, bounded laterally by the wide zones | Centrally ahead of the opponent's strikers and first line of defence |
| Centre-Mid | `CMC`, `CML`, `CMR` | Central and semi-central space within the opponent's midfield, ahead of the DM zone and behind the AM zone. Behind the opposing strikers and first midfielders but not yet directly in front of the last line | Central space between the DM and AM zones |
| Attacking-Mid | `AMC`, `AML`, `AMR` | Immediately in front of the opponent's last line of defence, inside the opponent's formation. Bounded by the CM zone behind and the in-behind central zone in front | Central zone directly in front of the opponent's defensive line |
| Wide Right | `WR` | Behind the opposing strikers and often the opposing winger; outside the opponent's formation, between their first and last defensive lines | Space outside right, behind the first line and in front of the last |
| Wide Left | `WL` | Mirror of `WR` on the left | Space outside left, behind the first line and in front of the last |
| In-Behind Wide Right | `IBWR` | Behind or beside the opponent's defensive line, with at least two opposing centre-backs still able to defend and at least one full-back bypassed | Wide area with at least one full-back bypassed |
| In-Behind Wide Left | `IBWL` | Mirror of `IBWR` on the left | Wide area with at least one full-back bypassed |
| In-Behind | `IBC`, `IBL`, `IBR` | Behind the opponent's defence, with at most one opposing centre-back and the goalkeeper between ball and goal. Within the lateral bounds of the opponent's formation | Central space with at least one central defender bypassed — often a complete breakthrough |

Read roughly from own goal towards the opponent's goal, the progression is:

```
GK -> CB -> DM -> CM -> AM -> IB
       \-> FB -> W  -> IBW
```

### The `OPP_` prefix

Every one of the 24 base codes also occurs with an `OPP_` prefix — `OPP_CBC`,
`OPP_AMR`, `OPP_IBWL` and so on — giving **48 observed `packingZone` values**.

The repository's `Documentation.pdf` defines the 24 base zones but does not
document the `OPP_` prefix. Do not guess at its semantics from the name; if the
distinction matters to your analysis, confirm it with Impect.

### Zone codes are not lane codes

Note the collision risk: `WL`/`WR` are packing zones, while `LEFT_WING`/
`RIGHT_WING` are lanes, and `LEFT_WINGER`/`RIGHT_WINGER` are positions. They are
three different fields with three different vocabularies.

## `pitchPosition` — static vertical fifths

The pitch divided into five zones along its length:

`OWN_BOX` · `FIRST_THIRD` · `MIDDLE_THIRD` · `FINAL_THIRD` · `OPPONENT_BOX`

Despite the "third" naming there are five members, because both penalty areas are
split out. This is a static grid — unlike packing zones, it does not react to the
opposition's shape.

## `lane` — static horizontal fifths

The pitch divided into five channels across its width:

`LEFT_WING` · `LEFT_HALF_SPACE` · `CENTER` · `RIGHT_HALF_SPACE` · `RIGHT_WING`

The lanes are delimited on the sides by the lines of the **18-yard box and the
6-yard box** — so the half-spaces are the channels between those two lines
extended up the pitch, not arbitrary fifths.

## Goal map (`shot.targetPoint`)

`targetPoint` is `{y, z}`: where the shot would have crossed the goal plane.

For dataV3 the **y-axis is inverted** — the **right post is at y = −3.66** and the
**left post is at y = +3.66**. `z` is height above the ground, with the crossbar
at 2.44 m.

Values run outside the frame for off-target shots. Observed in the snapshot:
`y` from −5.08 to +5.07, `z` from 0.04 to 3.62.

## Putting it together

Every event carries, at both `start` and (usually) `end`:

- continuous `coordinates` and `adjCoordinates`,
- a `packingZone` — fluid, relative to the opponent's shape,
- a `pitchPosition` — static vertical fifth,
- a `lane` — static horizontal fifth.

The packing zone is what makes Impect's line-breaking and threat models work; the
static grids are there for conventional pitch-location analysis. See
[concepts.md](concepts.md) for how zones feed Packing and pxT.
