---
source_url: https://floodlight.readthedocs.io/en/latest/modules/transforms/transforms.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
Collection of data transformation and processing functions.

Filter

[`` `butterworth_lowpass` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.butterworth_lowpass "floodlight.transforms.filter.butterworth_lowpass")

Applies a digital Butterworth lowpass-filter to an XY data object.

[`` `savgol_lowpass` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.savgol_lowpass "floodlight.transforms.filter.savgol_lowpass")

Applies a Savitzky-Golay lowpass-filter to an XY data object.

[`` `fir_lowpass` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.fir_lowpass "floodlight.transforms.filter.fir_lowpass")

Applies a FIR lowpass-filter to an XY data object.

[`` `kalman` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.kalman "floodlight.transforms.filter.kalman")

Applies a forward Kalman filter to an XY data object.

[`` `wiener` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.wiener "floodlight.transforms.filter.wiener")

Applies a Wiener filter to an XY data object.

Spatial

Permutation

[`` `assign_roles` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/permutation.html#floodlight.transforms.permutation.assign_roles "floodlight.transforms.permutation.assign_roles")

Assigns consistent roles to players across frames using the Hungarian algorithm.

Interpolation

[`` `interpolate_linear` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/interpolation.html#floodlight.transforms.interpolation.interpolate_linear "floodlight.transforms.interpolation.interpolate_linear")

Linearly interpolates gaps in XY tracking data along the temporal axis.

[`` `interpolate_polynomial` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/interpolation.html#floodlight.transforms.interpolation.interpolate_polynomial "floodlight.transforms.interpolation.interpolate_polynomial")

Interpolates gaps in XY tracking data using piecewise polynomial interpolation along the temporal axis.

[`` `interpolate_spline` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/interpolation.html#floodlight.transforms.interpolation.interpolate_spline "floodlight.transforms.interpolation.interpolate_spline")

Interpolates gaps in XY tracking data using spline interpolation along the temporal axis.

Temporal

[`` `resample` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/temporal.html#floodlight.transforms.temporal.resample "floodlight.transforms.temporal.resample")

Resample a floodlight core object to a new framerate.