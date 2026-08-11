---
source_url: https://floodlight.readthedocs.io/en/latest/modules/transforms/transforms.html
source_type: crawled
upstream_version:
crawled_at: 2026-08-11T09:08:54.627Z
---
Collection of data transformation and processing functions.

Filter

|  |  |
| --- | --- |
| `butterworth_lowpass` | Applies a digital Butterworth lowpass-filter to an XY data object. |
| `savgol_lowpass` | Applies a Savitzky-Golay lowpass-filter to an XY data object. |
| `fir_lowpass` | Applies a FIR lowpass-filter to an XY data object. |
| `kalman` | Applies a forward Kalman filter to an XY data object. |
| `wiener` | Applies a Wiener filter to an XY data object. |

Spatial

Permutation

|  |  |
| --- | --- |
| `assign_roles` | Assigns consistent roles to players across frames using the Hungarian algorithm. |

Interpolation

|  |  |
| --- | --- |
| `interpolate_linear` | Linearly interpolates gaps in XY tracking data along the temporal axis. |
| `interpolate_polynomial` | Interpolates gaps in XY tracking data using piecewise polynomial interpolation along the temporal axis. |
| `interpolate_spline` | Interpolates gaps in XY tracking data using spline interpolation along the temporal axis. |

Temporal

|  |  |
| --- | --- |
| `resample` | Resample a floodlight core object to a new framerate. |