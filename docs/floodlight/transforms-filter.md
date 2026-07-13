---
source_url: https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
`floodlight.transforms.filter.``butterworth_lowpass`(_`xy`_, _`order``=``3`_, _`Wn``=``1`_, _`remove_short_seqs``=``False`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/filter.html#butterworth_lowpass)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.butterworth_lowpass "Link to this definition")

Applies a digital Butterworth lowpass-filter to an XY data object. [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#id4)

For filtering, the [scipy.filter.butter](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.butter.html) and the [scipy.signal.filtfilt](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.filtfilt.html) functions are used. This function provides a convenience access to both functions, directly applying the filter to all non-NaN sequences in all columns.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **order** (_int, optional_) – The order of the filter. Corresponds to the argument `` `N` `` from the [scipy. signal.butter](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.butter.html) function. Default is 3
    
-   **Wn** (_Numeric, optional_) – The normalized critical cutoff frequency. Corresponds to the argument `` `Wn` `` from the [scipy.signal.butter](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.butter.html) function. Default is 1.
    
-   **remove_short_seqs** (_bool, optional_) – If True, sequences that are too short for the filter with the specified settings are replaced with np.nan. If False, they are kept unfiltered. Default is False.
    
-   **kwargs** – Optional arguments {‘padtype’, ‘padlen’, ‘method’, ‘irlen’} that can be passed to the [scipy.signal.filtfilt](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.filtfilt.html) function.
    

Returns:

**xy_filtered** – XY object with position data filtered by designed Butterworth low pass filter.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

The values of the input data are assumed to be numerical. Missing data is assumed to be either np.nan or None. The Butterworth-filter requires a minimum signal length depending on the settings. A signal is a sequence of data in the XY-object that is not interrupted by missing values. The minimum signal length is defined as \\(3 \\cdot (order + 1)\\). The treatment of signals shorter than the minimum signal length are specified with the `` `remove_short_sequence` ``\-argument, where True will replace these sequences with np.nan and False will keep the sequences in the data unfiltered.

Examples

```
>>> import numpy as np
>>> import matplotlib.pyplot as plt
>>> from floodlight import XY
>>> from floodlight.transforms.filter import butterworth_lowpass
```

We first generate a noisy XY-object to smooth.

```
>>> t = np.linspace(-5, 5, 1000)
>>> player_x = np.sin(t) * t + np.random.rand(1000)
>>> player_x[450:495] = np.nan
>>> player_x[505:550] = np.nan
>>> player_y = t + np.random.randn()
>>> xy = XY(np.transpose(np.stack((player_x, player_y))), framerate=20)
```

Apply the Butterworth lowpass filter with its default settings.

```
>>> xy_filt = butterworth_lowpass(xy)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/butterworth_default_example.png](https://floodlight.readthedocs.io/en/latest/_images/butterworth_default_example.png)

Apply the same filter but remove the sequence that is too short to filter.

```
>>> xy_filt = butterworth_lowpass(xy, remove_short_seqs=True)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/butterworth_removed_short_example.png](https://floodlight.readthedocs.io/en/latest/_images/butterworth_removed_short_example.png)

Apply the filter with different specifications.

```
>>> xy_filt = butterworth_lowpass(xy, order=5, Wn=4)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/butterworth_adjusted_example.png](https://floodlight.readthedocs.io/en/latest/_images/butterworth_adjusted_example.png)

References

`floodlight.transforms.filter.``fir_lowpass`(_`xy`_, _`numtaps``=``21`_, _`cutoff``=``1`_, _`window``=``'hamming'`_, _`remove_short_seqs``=``False`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/filter.html#fir_lowpass)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.fir_lowpass "Link to this definition")

Applies a FIR lowpass-filter to an XY data object.

For filtering, the [scipy.signal.firwin](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.firwin.html) and the [scipy.signal.filtfilt](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.filtfilt.html) functions are used. This function provides a convenience access to both functions, directly applying the filter to all non-NaN sequences in all columns.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **numtaps** (_int, optional_) – Length of the FIR filter (number of coefficients, i.e. the filter order + 1). `` `numtaps` `` must be odd for a Type I filter. Corresponds to the argument `` `numtaps` `` from the [scipy.signal.firwin](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.firwin.html) function. Default is 21.
    
-   **cutoff** (_Numeric, optional_) – The cutoff frequency of the filter in Hz. Corresponds to the argument `` `cutoff` `` from the [scipy.signal.firwin](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.firwin.html) function. Default is 1.
    
-   **window** (_str, optional_) – Desired window to use for the FIR filter design. Corresponds to the argument `` `window` `` from the [scipy.signal.firwin](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.firwin.html) function. Default is `` `"hamming"` ``.
    
-   **remove_short_seqs** (_bool, optional_) – If True, sequences that are too short for the filter with the specified settings are replaced with np.nans. If False, they are kept unfiltered. Default is False.
    
-   **kwargs** – Optional arguments {‘padtype’, ‘padlen’, ‘method’, ‘irlen’} that can be passed to the [scipy.signal.filtfilt](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.filtfilt.html) function.
    

Returns:

**xy_filtered** – XY object with position data filtered by the designed FIR lowpass filter.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

The values of the input data are assumed to be numerical. Missing data is assumed to be either np.nan or None. The FIR filter requires a minimum signal length depending on the settings. A signal is a sequence of data in the XY-object that is not interrupted by missing values. The minimum signal length is defined as \\(3 \\cdot numtaps\\). The treatment of signals shorter than the minimum signal length are specified with the `` `remove_short_seqs` ``\-argument, where True will replace these sequences with np.nan and False will keep the sequences in the data unfiltered.

Examples

```
>>> import numpy as np
>>> import matplotlib.pyplot as plt
>>> from floodlight import XY
>>> from floodlight.transforms.filter import fir_lowpass
```

We first generate a noisy XY-object to smooth.

```
>>> t = np.linspace(-5, 5, 1000)
>>> player_x = np.sin(t) * t + np.random.rand(1000)
>>> player_x[450:495] = np.nan
>>> player_x[505:550] = np.nan
>>> player_y = t + np.random.randn()
>>> xy = XY(np.transpose(np.stack((player_x, player_y))), framerate=20)
```

Apply the FIR lowpass filter with its default settings.

```
>>> xy_filt = fir_lowpass(xy)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/fir_default_example.png](https://floodlight.readthedocs.io/en/latest/_images/fir_default_example.png)

Apply the filter with different specifications.

```
>>> xy_filt = fir_lowpass(xy, numtaps=101, cutoff=3)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/fir_adjusted_example.png](https://floodlight.readthedocs.io/en/latest/_images/fir_adjusted_example.png)

`floodlight.transforms.filter.``kalman`(_`xy`_, _`process_noise``=``1.0`_, _`measurement_noise``=``0.04`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/filter.html#kalman)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.kalman "Link to this definition")

Applies a forward Kalman filter to an XY data object. [\[3\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#id13)

Uses a constant-velocity motion model where the state vector consists of position and velocity. Only positions are observed. The filter smooths noisy position data by combining predictions from the motion model with the observed measurements.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object. Must have `` `framerate` `` set.
    
-   **process_noise** (_float, optional_) – Process noise intensity (acceleration variance in m²/s⁴) that controls how much the model trusts the constant-velocity prediction. Larger values allow faster changes in velocity. Default corresponds to \\(\\sigma_a = 1\\,\\mathrm{m/s^2}\\), which is a conservative smoothing prior.
    
-   **measurement_noise** (_float, optional_) – Measurement noise variance (in m²) controlling how much the model trusts the observed positions. Larger values produce smoother output. Default is 0.04, corresponding to 0.20 m RMSE, a conservative estimate for common optical [\[4\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#id14) and local [\[5\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#id15) tracking systems during high-dynamic situations.
    

Returns:

**xy_filtered** – XY object with position data filtered by the Kalman filter.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

The Kalman filter requires `` `xy.framerate` `` to be set in order to compute the time interval between frames.

The default noise parameters assume positions are given in meters. If positions use a different unit (e.g. centimeters), the noise parameters must be adjusted accordingly (e.g. `` `measurement_noise` `=` `20.0**2` `` for 20 cm RMSE in centimeter units).

Unlike [`` `butterworth_lowpass()` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.butterworth_lowpass "floodlight.transforms.filter.butterworth_lowpass") and [`` `savgol_lowpass()` ``](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.savgol_lowpass "floodlight.transforms.filter.savgol_lowpass"), the Kalman filter handles missing data (NaN) natively. When an observation is missing, the filter runs a predict-only step, maintaining its internal state (velocity estimate, covariance) across gaps. Frames with missing input data remain NaN in the output — no gap-filling is performed.

Examples

```
>>> import numpy as np
>>> import matplotlib.pyplot as plt
>>> from floodlight import XY
>>> from floodlight.transforms.filter import kalman
```

Generate a noisy XY-object to smooth.

```
>>> t = np.linspace(-5, 5, 1000)
>>> player_x = np.sin(t) * t + np.random.rand(1000)
>>> player_x[450:495] = np.nan
>>> player_x[505:550] = np.nan
>>> player_y = t + np.random.randn()
>>> xy = XY(np.transpose(np.stack((player_x, player_y))), framerate=20)
```

Apply the Kalman filter with default settings.

```
>>> xy_filt = kalman(xy)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/kalman_default_example.png](https://floodlight.readthedocs.io/en/latest/_images/kalman_default_example.png)

Apply the filter with increased measurement noise for stronger smoothing.

```
>>> xy_filt = kalman(xy, measurement_noise=1.0)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/kalman_adjusted_example.png](https://floodlight.readthedocs.io/en/latest/_images/kalman_adjusted_example.png)

References

`floodlight.transforms.filter.``savgol_lowpass`(_`xy`_, _`window_length``=``5`_, _`poly_order``=``3`_, _`remove_short_seqs``=``False`_, _`**``kwargs`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/filter.html#savgol_lowpass)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.savgol_lowpass "Link to this definition")

Applies a Savitzky-Golay lowpass-filter to an XY data object. [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#id19)

For filtering, the [scipy.filter.savgol](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.savgol_filter.html) function is used. This function provides a convenient access to the function, directly applying the filter to all non-NaN sequences in all columns.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **window_length** (_int, optional_) – The length of the filter window. Corresponds to the argument `` `window_length` `` from the [scipy.filter.savgol](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.savgol_filter.html) function. Default is 5.
    
-   **poly_order** (_Numeric, optional_) – The order of the polynomial used to fit the samples. `` `poly_order` `` must be less than `` `window_length` ``. Default is 3. Corresponds to the argument `` `poly_order` `` from the [scipy.filter.savgol](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.savgol_filter.html) function. Default is 5.
    
-   **remove_short_seqs** (_bool, optional_) – If True, sequences that are too short for the filter with the specified settings are removed from the data. If False, they are kept unfiltered. Default is False.
    
-   **kwargs** – Optional arguments {‘deriv’, ‘delta’, ‘mode’, ‘cval’} that can be passed to the [scipy.signal.savgol](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.savgol_filter.html) function.
    

Returns:

**xy_filtered** – XY object with position data filtered by designed Savitzky-Golay low pass filter.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

The values of the input data are assumed to be numerical. Missing data is assumed to be either np.nan or None. The Savitzky-Golay-filter requires a minimum signal length depending on the settings. A signal is a sequence of data in the XY-object that is not interrupted by missing values. The minimum signal length is defined as the `` `window_length` ``. The treatment of signals shorter than the minimum signal length are specified with the `` `remove_short_sequence` ``\-argument, where True will replace these sequences with np.nan and False will keep the sequences in the data unfiltered.

Examples

```
>>> import numpy as np
>>> import matplotlib.pyplot as plt
>>> from floodlight import XY
>>> from floodlight.transforms.filter import savgol_lowpass
```

We first generate a noisy XY-object to smooth.

```
>>> t = np.linspace(-5, 5, 1000)
>>> player_x = np.sin(t) * t + np.random.rand(1000)
>>> player_x[450:495] = np.nan
>>> player_x[505:550] = np.nan
>>> player_y = t + np.random.randn()
>>> xy = XY(np.transpose(np.stack((player_x, player_y))), framerate=20)
```

Apply the Savgol lowpass filter with its default settings.

```
>>> xy_filt = savgol_lowpass(xy)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/savgol_default_example.png](https://floodlight.readthedocs.io/en/latest/_images/savgol_default_example.png)

Apply the filter with a longer window length and remove the sequence that is too short to filter.

```
>>> xy_filt = savgol_lowpass(xy, window_length=12, remove_short_seqs=True)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/savgol_removed_short_example.png](https://floodlight.readthedocs.io/en/latest/_images/savgol_removed_short_example.png)

Apply the filter with different specifications.

```
>>> xy_filt = savgol_lowpass(xy, window_length=50, poly_order=5)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/savgol_adjusted_example.png](https://floodlight.readthedocs.io/en/latest/_images/savgol_adjusted_example.png)

References

`floodlight.transforms.filter.``wiener`(_`xy`_, _`window_size``=``5`_, _`noise``=``None`_, _`remove_short_seqs``=``False`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/filter.html#wiener)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#floodlight.transforms.filter.wiener "Link to this definition")

Applies a Wiener filter to an XY data object. [\[6\]](https://floodlight.readthedocs.io/en/latest/modules/transforms/filter.html#id23)

For filtering, the [scipy.signal.wiener](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.wiener.html) function is used. This function provides a convenient access to the function, directly applying the filter to all non-NaN sequences in all columns.

Parameters:

-   **xy** (_XY_) – Floodlight XY Data object.
    
-   **window_size** (_int, optional_) – Size of the local window used for noise estimation and filtering. Corresponds to the argument `` `mysize` `` from the [scipy.signal.wiener](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.wiener.html) function. Default is 5.
    
-   **noise** (_float, optional_) – Noise power estimate. If None, the noise power is estimated locally from the data within the window. Corresponds to the argument `` `noise` `` from the [scipy.signal.wiener](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.wiener.html) function. Default is None.
    
-   **remove_short_seqs** (_bool, optional_) – If True, sequences that are too short for the filter with the specified settings are replaced with np.nan. If False, they are kept unfiltered. Default is False.
    

Returns:

**xy_filtered** – XY object with position data filtered by the Wiener filter.

Return type:

[XY](https://floodlight.readthedocs.io/en/latest/modules/core/xy.html#floodlight.core.xy.XY "floodlight.core.xy.XY")

Notes

The values of the input data are assumed to be numerical. Missing data is assumed to be either np.nan or None. The Wiener filter requires a minimum signal length depending on the settings. A signal is a sequence of data in the XY-object that is not interrupted by missing values. The minimum signal length is defined as the `` `window_size` ``. The treatment of signals shorter than the minimum signal length are specified with the `` `remove_short_seqs` ``\-argument, where True will replace these sequences with np.nan and False will keep the sequences in the data unfiltered.

Examples

```
>>> import numpy as np
>>> import matplotlib.pyplot as plt
>>> from floodlight import XY
>>> from floodlight.transforms.filter import wiener
```

We first generate a noisy XY-object to smooth.

```
>>> t = np.linspace(-5, 5, 1000)
>>> player_x = np.sin(t) * t + np.random.rand(1000)
>>> player_x[450:495] = np.nan
>>> player_x[505:550] = np.nan
>>> player_y = t + np.random.randn()
>>> xy = XY(np.transpose(np.stack((player_x, player_y))), framerate=20)
```

Apply the Wiener filter with its default settings.

```
>>> xy_filt = wiener(xy)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/wiener_default_example.png](https://floodlight.readthedocs.io/en/latest/_images/wiener_default_example.png)

Apply the filter with a larger window size for stronger smoothing.

```
>>> xy_filt = wiener(xy, window_size=25)
>>> plt.plot(xy.x)
>>> plt.plot(xy_filt.x, linewidth=3)
>>> plt.legend(("Raw", "Smoothed"))
>>> plt.show()
```

![../../_images/wiener_adjusted_example.png](https://floodlight.readthedocs.io/en/latest/_images/wiener_adjusted_example.png)

References