---
source_url: https://floodlight.readthedocs.io/en/latest/modules/transforms/spatial.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.transforms.spatial.``min_max_normalize`(_`positions`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/spatial.html#min_max_normalize)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/spatial.html#floodlight.transforms.spatial.min_max_normalize "Link to this definition")

Min-max normalizes an (N, 2) formation array to \[0, 1\] per axis.

Each axis (x, y) is independently scaled so that its minimum maps to 0 and its maximum maps to 1. This makes formations with different compactness comparable.

Parameters:

**positions** (_np.ndarray_) – Formation positions of shape (N, 2).

Returns:

**normalized** – Normalized positions of shape (N, 2) with values in \[0, 1\].

Return type:

np.ndarray

Notes

If all positions share the same value along one axis (zero range), that axis is left at 0.0 rather than producing a division-by-zero error.

`floodlight.transforms.spatial.``subtract_centroid`(_`xy`_, _`exclude_xIDs``=``None`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/spatial.html#subtract_centroid)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/spatial.html#floodlight.transforms.spatial.subtract_centroid "Link to this definition")

Subtracts the per-frame team centroid from all player positions.

For each frame, the centroid is computed as the arithmetic mean of all included player positions (using nanmean). The centroid is then subtracted from every player’s coordinates, yielding positions relative to the team center.

Parameters:

-   **xy** (_XY_) – Spatiotemporal data with shape (T, 2\*N).
    
-   **exclude_xIDs** (_list, optional_) – A list of player indices (xIDs) to exclude from the centroid computation. Excluded players’ coordinates are still translated by the centroid of the remaining players. This can be useful to exclude goalkeepers from computation.
    

Returns:

**xy_centered** – New XY object with centroid-subtracted coordinates. Same shape, framerate, and direction as input.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

This transform is commonly used as a preprocessing step for formation analysis, where the relative spacing of players is more informative than their absolute positions on the pitch.