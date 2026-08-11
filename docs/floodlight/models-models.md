---
source_url: https://floodlight.readthedocs.io/en/latest/modules/models/models.html
source_type: crawled
upstream_version:
crawled_at: 2026-08-11T08:29:26.563Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

Collection of data models grouped by category. Each submodule contains model classes that provide data analysis methods based on core objects. Inspired by the [scikit-learn API](https://arxiv.org/abs/1309.0238), each model class contains a `` `.fit(...)` ``\-method that ‘fits’ the model to the data.

All Available Models

|  |  |
| --- | --- |
| `kinematics.DistanceModel` | Computations for Euclidean distances of all players. |
| `kinematics.VelocityModel` | Computations for velocities of all players. |
| `kinematics.AccelerationModel` | Computations for accelerations of all players. |
| `geometry.CentroidModel` | Computations based on the geometric center of all players, commonly referred to as a team's centroid. |
| `geometry.NearestMateModel` | Computations for within-team distance metrics. |
| `geometry.NearestOpponentModel` | Computations for between-team distance metrics. |
| `geometry.ConvexHullModel` | Computations based on the convex hull of player positions. |
| `kinetics.MetabolicPowerModel` | Class for calculating Metabolic Power and derived metrics from spatiotemporal data. |
| `space.DiscreteVoronoiModel` | Calculates discretized dominant regions commonly used to assess space control. |

For quick reference, the following computations are available after calling the respective model’s `` `.fit(...)` ``\-method

Geometry

|  |  |
| --- | --- |
| `CentroidModel.centroid` | Returns the team centroid positions as computed by the fit method. |
| `CentroidModel.centroid_distance` | Calculates the Euclidean distance of each player to the fitted centroids. |
| `CentroidModel.stretch_index` | Calculates the Stretch Index, i.e., the mean distance of all players to the team centroid. |
| `NearestMateModel.distance_to_nearest_mate` | Calculates the distance to the nearest teammate for each player. |
| `NearestMateModel.team_spread` | Calculates the team spread (Frobenius norm of distance matrix). |
| `NearestOpponentModel.distance_to_nearest_opponent` | Calculates distance to nearest opponent for each player on both teams. |
| `ConvexHullModel.convex_hull_area` | Calculates the area enclosed by the convex hull. |
| `ConvexHullModel.plot` | Plot the convex hull for a given time point on a matplotlib axes. |

Kinematics

Kinetics

Space