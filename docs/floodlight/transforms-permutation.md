---
source_url: https://floodlight.readthedocs.io/en/latest/modules/transforms/permutation.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.transforms.permutation.``assign_roles`(_`xy`_, _`reference``=``None`_, _`n_iter``=``1`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/permutation.html#assign_roles)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/permutation.html#floodlight.transforms.permutation.assign_roles "Link to this definition")

Assigns consistent roles to players across frames using the Hungarian algorithm. [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/permutation.html#id3)

For each frame, player positions are matched to reference positions by minimizing the total Euclidean distance. The resulting XY object has columns reordered so that column _i_ consistently represents role _i_ across all frames.

Parameters:

-   **xy** (_XY_) – Spatiotemporal data with shape (T, 2\*N).
    
-   **reference** (_np.ndarray, optional_) – Reference positions of shape (N, 2) used as the assignment target. If None (default), the mean position of each player column across all frames is used.
    
-   **n_iter** (_int, optional_) – Number of assignment iterations. After each iteration the reference is recomputed as the column-wise mean of the assigned data. More iterations can improve convergence for longer sequences. Defaults to 1, which is sufficient for short sequences as proposed in [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/permutation.html#id3).
    

Returns:

**xy_assigned** – New XY object with columns reordered per frame so that column _i_ consistently represents role _i_. Same shape, framerate, and direction as input.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

Players with NaN positions in a given frame are excluded from the assignment. Their corresponding role slots in the output are filled with NaN. Reference positions that are NaN are likewise excluded from the cost matrix, so the assignment operates only on valid data.

References