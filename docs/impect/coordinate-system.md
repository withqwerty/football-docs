---
source_url: https://api.impect.com
source_type: crawled
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect Coordinate System & Spatial Zones

Impect locates events with both **continuous coordinates** and a set of **categorical zone descriptors**. The categorical descriptors (packing zone, lane, pitch position) are central to Impect's analytics and are attached to the start and end of every event.

## Coordinates

Each `EventPositionDto` carries two coordinate pairs (`CoordinateDto = {x, y}`):

- **`coordinates`** — raw pitch coordinates.
- **`adjCoordinates`** — **direction-adjusted** coordinates, normalised so a squad's attacking direction is consistent regardless of which way it physically plays. Use these to compare/aggregate across halves and teams without flipping.

The OpenAPI spec types `x`/`y` as numbers but does not pin the numeric range, so treat the scale as provider-defined and prefer the categorical zones below for portable logic; use `adjCoordinates` for any direction-sensitive computation. Shots also expose a goal-plane aim point via `ShotDto.targetPoint = {y, z}` and the goalkeeper position/`divePoint`.

## Packing zone (`PackingZone`)

Longitudinal bands up the pitch, used in Packing/pxT metrics:

`GKR` → `FIRST_THIRD` → `SECOND_THIRD` → `FINAL_THIRD` → `BOX`

(`GKR` = goalkeeper/restart zone behind the first third; `BOX` = opponent penalty area.)

## Lane (`Lane`)

Lateral channels across the pitch (the half-space framework):

`LEFT_WING` · `LEFT_HALF_SPACE` · `CENTER` · `RIGHT_HALF_SPACE` · `RIGHT_WING`

## Pitch position (`PitchPosition`)

Coarse thirds-by-box location:

`OWN_BOX` · `OWN_HALF` · `OPPONENT_HALF` · `OPPONENT_BOX`

## Set-piece end zones (`EndZone`)

Target zones used in set-piece sub-phases (corners, free-kicks, goal-kicks, throw-ins, second deliveries):

`FAR_LEFT`, `FAR_RIGHT`, `NEAR_POST`, `FAR_POST`, `OPPOSITE_SIDE_1`, `OPPOSITE_SIDE_2`, `SAME_SIDE_1`, `SAME_SIDE_2`, `SIX_YARD_BOX`, `INSIDE_OWN_BOX`, `INSIDE_OPPONENT_BOX`, `OUTSIDE_BOX`, `LEFT_GOAL_KICK_ZONE`, `RIGHT_GOAL_KICK_ZONE`, `CENTER`

## Putting it together

A single event therefore carries, at both `start` and `end`: continuous `coordinates` + `adjCoordinates`, plus the `packingZone` (longitudinal band), `lane` (lateral channel) and `pitchPosition` (coarse box/half). The packing zone and lane together give a grid Impect uses to define line-breaking passes and the threat models in [concepts.md](concepts.md).
