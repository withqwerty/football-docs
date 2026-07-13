---
source_url: https://floodlight.readthedocs.io/en/latest/modules/metrics/trajectory_clustering.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
`floodlight.metrics.trajectory_clustering.``formation_similarity`(_`xy`_, _`template`_, _`exclude_xIDs``=``None`_, _`role_assignment``=``True`_, _`n_iter``=``1`_, _`delta``=``0.3333333333333333`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/metrics/trajectory_clustering.html#formation_similarity)[](https://floodlight.readthedocs.io/en/latest/modules/metrics/trajectory_clustering.html#floodlight.metrics.trajectory_clustering.formation_similarity "Link to this definition")

Computes formation similarity (FSIM) between observed player positions and a formation template via template matching. [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/trajectory_clustering.html#id5)

The algorithm classifies a team’s formation by comparing role-resolved average positions against an idealized formation template.

Parameters:

-   **xy** (_XY_) – Spatiotemporal tracking data for one team, shape (T, 2\*N).
    
-   **template** (_np.ndarray_) – Template position array of shape (M, 2) representing an idealized formation.
    
-   **exclude_xIDs** (_list, optional_) – A list of player indices (xIDs) to exclude from the analysis. Excluded players are removed from centroid computation and from the formation comparison. This is typically used to exclude goalkeepers.
    
-   **role_assignment** (_bool, optional_) – If True (default), role assignment via the Hungarian algorithm is applied before averaging. Set to False to skip this step, e.g. when the input data has already been role-assigned externally.
    
-   **n_iter** (_int, optional_) – Number of role assignment iterations. Only used when `` `role_assignment` `` is True. Defaults to 1.
    
-   **delta** (_float, optional_) – Similarity decay parameter controlling how quickly similarity drops with distance between role positions. Motivated by a coarse 3x3 pitch partitioning where roles one zone apart should have near-zero similarity. Defaults to 1/3 according to [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/trajectory_clustering.html#id5).
    

Returns:

**fsim** – Formation similarity score in \[0, 1\].

Return type:

float

Notes

The pipeline proceeds as follows:

1.  Per-frame centroid subtraction to obtain center-relative positions.
    
2.  Role assignment (optional, default=True) [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/trajectory_clustering.html#id6) via Hungarian algorithm using mean positions as reference (one iteration per default, as proposed in [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/trajectory_clustering.html#id5)).
    
3.  Averaging role-resolved positions across frames to obtain a single formation snapshot of shape (N, 2).
    
4.  Independent min-max normalization of query and template to \[0, 1\] per axis, ensuring scale and compactness invariance.
    
5.  Computation of an N x N similarity matrix using \\(m_{i,j} = \\max(1 - \\|\\tilde{r}_i - \\tilde{r}_j\\|^2 / \\delta, \\; 0)\\), optimal one-to-one assignment via the Hungarian algorithm, and averaging matched similarities to obtain the FSIM score.
    

References