---
source_url: https://floodlight.readthedocs.io/en/latest/modules/metrics/entropy.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.368Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.metrics.entropy.``approx_entropy`(_`sig`_, _`m``=``2`_, _`r``=``0.5`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/metrics/entropy.html#approx_entropy)[](https://floodlight.readthedocs.io/en/latest/modules/metrics/entropy.html#floodlight.metrics.entropy.approx_entropy "Link to this definition")

Calculates the Approximate Entropy ApEn(m,r) of sig according to Pincus (1991). [\[1\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/entropy.html#id3)

Parameters:

-   **sig** (_np.array_) – A time-series as np.ndarray with a single dimension (sig.ndim == 1).
    
-   **m** (_int, optional_) – Comparison length of runs. Typically, m in {2,3}. Defaults to 2.
    
-   **r** (_float, optional_) – Filtering level. Defaults to 0.5.
    

Returns:

**ApEn** – The Approximate Entropy of sig.

Return type:

float

Notes

Time-series must be taken at equally spaced time points. Lower bound according to Pincus, Gladstone, Ehrenkranz (1991) is 50 time points [\[2\]](https://floodlight.readthedocs.io/en/latest/modules/metrics/entropy.html#id4). The filtering level r should be at least three times larger in magnitude as the noise.

Rule of thumb: 0.1-0.25 of data STD.

References