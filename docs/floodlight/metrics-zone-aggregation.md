---
source_url: https://floodlight.readthedocs.io/en/latest/modules/metrics/zone_aggregation.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.metrics.zone_aggregation.``aggregate_property_by_zones`(_`property_to_aggregate`_, _`binning_property`_, _`zones`_, _`zone_names``=``None`_, _`aggregation``=``'sum'`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/metrics/zone_aggregation.html#aggregate_property_by_zones)[](https://floodlight.readthedocs.io/en/latest/modules/metrics/zone_aggregation.html#floodlight.metrics.zone_aggregation.aggregate_property_by_zones "Link to this definition")

Aggregates a property over threshold-based zones of another property.

This function bins frames based on the value of `` `binning_property` `` and aggregates values from `` `property_to_aggregate` `` within each zone. Common use cases include calculating distance covered per velocity zone or time spent in different intensity zones [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/zone_aggregation.html#id2).

Parameters:

-   **property_to_aggregate** (_PlayerProperty or TeamProperty_) – Property values to aggregate. For PlayerProperty, shape is (T, N) where T is the number of frames and N is the number of players. For TeamProperty, shape is (T,) where T is the number of frames.
    
-   **binning_property** (_PlayerProperty or TeamProperty_) – Property values used to determine zone membership. Must have the same shape as `` `property_to_aggregate` ``.
    
-   **zones** (_list\[tuple\[Numeric, Numeric\]\]_) – List of (min, max) threshold tuples defining each zone. Zones use half-open intervals \[min, max) where the minimum is inclusive and maximum is exclusive. For example, \[(0, 2), (2, 4)\] creates two zones: \[0, 2) and \[2, 4).
    
-   **zone_names** (_list\[str\], optional_) – Names for each zone. If None, zones are named as “_min_ to _max_”. Must have the same length as `` `zones` `` if provided.
    
-   **aggregation** (_str, optional_) – Aggregation function to apply within each zone. Options:
    
    -   “sum”: Sum of property values in zone
        
    -   “count”: Number of frames with valid data in zone
        
    -   “mean”: Average property value in zone
        
    -   “min”: Minimum property value in zone
        
    -   “max”: Maximum property value in zone
        
    
    Default is ‘sum’.
    

Returns:

**zone_aggregates** – DataFrame with aggregated values. For PlayerProperty inputs, rows correspond to players and columns to zones. For TeamProperty inputs, a single-row DataFrame is returned. Empty zones (no frames matching) return NaN for mean/min/max and 0 for sum/count.

Return type:

pd.DataFrame

Notes

Valid property combinations:

-   PlayerProperty by PlayerProperty: Both must have shape (T, N) with matching T and N
    
-   TeamProperty by TeamProperty: Both must have shape (T,) with matching T
    
-   PlayerProperty by TeamProperty: Aggregation property has shape (T, N), binning property has shape (T,). The binning values are broadcast across all players.
    

Invalid combination:

-   TeamProperty by PlayerProperty: Cannot bin a single team value using player-specific thresholds.
    

Frames where either property has NaN values are excluded from all aggregations. The boundary handling uses half-open intervals \[min, max) to avoid ambiguity at zone boundaries.

Examples

Calculate distance covered in velocity zones for each player:

```
>>> import numpy as np
>>> from floodlight import PlayerProperty
>>> from floodlight.metrics.zone_aggregation import aggregate_property_by_zones
```

```
>>> # Create sample data: 4 frames, 2 players
>>> distances = PlayerProperty(
...     property=np.array([[10, 5], [10, 5], [10, 5], [10, 5]], dtype=float),
...     name="distance"
... )
>>> velocities = PlayerProperty(
...     property=np.array([[1, 6], [3, 8], [1, 6], [3, 8]], dtype=float),
...     name="velocity"
... )
>>> # Define velocity zones (m/s)
>>> zones = [(0, 2), (2, 4), (5, 9)]
>>> zone_names = ["Low", "Medium", "High"]
>>> result = aggregate_property_by_zones(
...     distances, velocities, zones, zone_names, aggregation='sum'
... )
>>> result
   Low  Medium  High
0  20.0    20.0   0.0
1   0.0     0.0  20.0
```

Calculate time spent (frame count) in metabolic power zones:

```
>>> power = PlayerProperty(
...     property=np.array([[5, 15], [8, 25], [12, 30], [6, 18]], dtype=float),
...     name="power"
... )
>>> zones = [(0, 10), (10, 20), (20, 35)]
>>> result = aggregate_property_by_zones(
...     power, power, zones, aggregation='count'
... )
>>> result
   0 to 10  10 to 20  20 to 35
0      3.0       1.0       0.0
1      0.0       2.0       2.0
```

References