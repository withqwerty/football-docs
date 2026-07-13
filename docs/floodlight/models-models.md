---
source_url: https://floodlight.readthedocs.io/en/latest/modules/models/models.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

Collection of data models grouped by category. Each submodule contains model classes that provide data analysis methods based on core objects. Inspired by the [scikit-learn API](https://arxiv.org/abs/1309.0238), each model class contains a `` `.fit(...)` ``\-method that ‘fits’ the model to the data.

All Available Models

[`` `kinematics.DistanceModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.DistanceModel "floodlight.models.kinematics.DistanceModel")

Computations for Euclidean distances of all players.

[`` `kinematics.VelocityModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.VelocityModel "floodlight.models.kinematics.VelocityModel")

Computations for velocities of all players.

[`` `kinematics.AccelerationModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinematics.html#floodlight.models.kinematics.AccelerationModel "floodlight.models.kinematics.AccelerationModel")

Computations for accelerations of all players.

[`` `geometry.CentroidModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel "floodlight.models.geometry.CentroidModel")

Computations based on the geometric center of all players, commonly referred to as a team's _centroid_.

[`` `geometry.NearestMateModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel "floodlight.models.geometry.NearestMateModel")

Computations for within-team distance metrics.

[`` `geometry.NearestOpponentModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel "floodlight.models.geometry.NearestOpponentModel")

Computations for between-team distance metrics.

[`` `geometry.ConvexHullModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel "floodlight.models.geometry.ConvexHullModel")

Computations based on the convex hull of player positions.

[`` `kinetics.MetabolicPowerModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/kinetics.html#floodlight.models.kinetics.MetabolicPowerModel "floodlight.models.kinetics.MetabolicPowerModel")

Class for calculating Metabolic Power and derived metrics from spatiotemporal data.

[`` `space.DiscreteVoronoiModel` ``](https://floodlight.readthedocs.io/en/latest/modules/models/space.html#floodlight.models.space.DiscreteVoronoiModel "floodlight.models.space.DiscreteVoronoiModel")

Calculates discretized dominant regions commonly used to assess space control.

For quick reference, the following computations are available after calling the respective model’s `` `.fit(...)` ``\-method

Geometry

[`` `CentroidModel.centroid` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.centroid "floodlight.models.geometry.CentroidModel.centroid")

Returns the team centroid positions as computed by the fit method.

[`` `CentroidModel.centroid_distance` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.centroid_distance "floodlight.models.geometry.CentroidModel.centroid_distance")

Calculates the Euclidean distance of each player to the fitted centroids.

[`` `CentroidModel.stretch_index` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.CentroidModel.stretch_index "floodlight.models.geometry.CentroidModel.stretch_index")

Calculates the _Stretch Index_, i.e., the mean distance of all players to the team centroid.

[`` `NearestMateModel.distance_to_nearest_mate` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.distance_to_nearest_mate "floodlight.models.geometry.NearestMateModel.distance_to_nearest_mate")

Calculates the distance to the nearest teammate for each player.

[`` `NearestMateModel.team_spread` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestMateModel.team_spread "floodlight.models.geometry.NearestMateModel.team_spread")

Calculates the team spread (Frobenius norm of distance matrix).

[`` `NearestOpponentModel.distance_to_nearest_opponent` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.NearestOpponentModel.distance_to_nearest_opponent "floodlight.models.geometry.NearestOpponentModel.distance_to_nearest_opponent")

Calculates distance to nearest opponent for each player on both teams.

[`` `ConvexHullModel.convex_hull_area` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.convex_hull_area "floodlight.models.geometry.ConvexHullModel.convex_hull_area")

Calculates the area enclosed by the convex hull.

[`` `ConvexHullModel.plot` ``](https://floodlight.readthedocs.io/en/latest/modules/models/geometry.html#floodlight.models.geometry.ConvexHullModel.plot "floodlight.models.geometry.ConvexHullModel.plot")

Plot the convex hull for a given time point on a matplotlib axes.

Kinematics

Kinetics

Space