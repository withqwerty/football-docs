---
source_url: https://fast-forward.readthedocs.io/en/latest/concepts/transformations/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
The `TrackingDataset.transform()` method lets you change the coordinate system, orientation, or pitch dimensions of your tracking data after loading.

## Basic Usage

```
transformed = dataset.transform(
    to_coordinates="opta",
    to_orientation="home_away",
    to_dimensions=(100, 100),
)
```

All three parameters are optional; you can transform any combination.

## Transform Order

When multiple transforms are applied in a single call, they are always executed in this order:

1.  **Orientation**: flip coordinates if needed
2.  **Dimensions**: scale to new pitch dimensions
3.  **Coordinates**: convert between coordinate systems

This order is enforced internally to ensure correct results.

## Coordinate Transforms

Transform between any of the [supported coordinate systems](https://fast-forward.readthedocs.io/en/latest/concepts/coordinate-systems/):

```
# Tracab (centimeters, center origin) -> Opta (0-100, bottom-left)
dataset = dataset.transform(to_coordinates="opta")

# Check new state
print(dataset.coordinate_system)  # "opta"
```

All coordinate transformations use **CDF as an intermediate**: source -> CDF -> target. This means any pair of coordinate systems can be converted.

## Orientation Transforms

Change the attacking direction convention:

```
# Static -> alternating
dataset = dataset.transform(to_orientation="home_away")

print(dataset.orientation)  # "home_away"
```

When orientation requires flipping, both x and y coordinates are **negated** (reflected around the center origin). See [Orientations](https://fast-forward.readthedocs.io/en/latest/concepts/orientations/) for details on each option.

## Dimension Transforms

Scale coordinates to different pitch dimensions:

```
# Original: 105m x 68m -> Target: 100m x 100m
dataset = dataset.transform(to_dimensions=(100, 100))

print(dataset.pitch_dimensions)  # (100.0, 100.0)
```

Zone-Based Scaling

Dimension transforms use **zone-based scaling** that preserves IFAB standard pitch feature proportions. The penalty area, six-yard box, center circle, and other markings remain correctly proportioned relative to the pitch, rather than being uniformly stretched.

## Chaining Transforms

Transforms can be chained by calling `.transform()` multiple times:

```
result = (
    dataset
    .transform(to_orientation="home_away")
    .transform(to_dimensions=(100, 100))
    .transform(to_coordinates="opta")
)
```

Or applied all at once:

```
result = dataset.transform(
    to_orientation="home_away",
    to_dimensions=(100, 100),
    to_coordinates="opta",
)
```

Both approaches produce the same result.

After a transform, the metadata DataFrame is updated to reflect the new state:

```
dataset = dataset.transform(to_coordinates="opta")

# Metadata reflects the new coordinate system
print(dataset.metadata["coordinate_system"][0])  # "opta"
print(dataset.coordinate_system)                  # "opta"
```

The `coordinate_system`, `orientation`, `pitch_length`, and `pitch_width` fields are all updated automatically.