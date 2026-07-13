---
source_url: https://floodlight.readthedocs.io/en/latest/modules/transforms/temporal.html
source_type: crawled
upstream_version:
crawled_at: 2026-07-13T16:20:22.369Z
---
[floodlight](https://floodlight.readthedocs.io/en/latest/index.html)

`floodlight.transforms.temporal.``resample`(_`obj`_, _`target_framerate`_, _`interp_method``=``None`_, _`order``=``3`_, _`k``=``3`_)[`[source]`](https://floodlight.readthedocs.io/en/latest/_modules/floodlight/transforms/temporal.html#resample)[](https://floodlight.readthedocs.io/en/latest/modules/transforms/temporal.html#floodlight.transforms.temporal.resample "Link to this definition")

Resample a floodlight core object to a new framerate.

Rescales any framerate-bearing core object (`` `XY` ``, `` `Code` ``, `` `TeamProperty` ``, `` `PlayerProperty` ``, or `` `DyadicProperty` ``) to a target framerate.

Parameters:

-   **obj** (_XY | Code | TeamProperty | PlayerProperty | DyadicProperty_) – Framerate-bearing core object to resample.
    
-   **target_framerate** (_int_) – Target framerate in Hz. Must be a positive integer.
    
-   **interp_method** (_str or None, optional_) – Interpolation method for the upsample path. Must be one of `` `"linear"` ``, `` `"polynomial"` ``, `` `"spline"` ``, `` `"nearest"` `` or `` `None` ``. Default `` `None` ``: new rows are left NaN, only target samples that coincide with source samples take source values. Ignored on the identity and downsample paths.
    
-   **order** (_int, optional_) – Polynomial order for `` `interp_method="polynomial"` ``. Default 3.
    
-   **k** (_int, optional_) – Spline degree for `` `interp_method="spline"` ``. Default 3.
    

Returns:

**obj_resampled** – New object with `` `framerate` `` rescaled to `` `target_framerate` ``.

Return type:

same type as `` `obj` ``

Notes

In case of `` `target_framerate` `==` `obj.framerate` `` `` `resample()` `` returns a deep copy of `` `obj` ``.

Pre-existing NaN gaps in the source pass through unchanged on both the upsample and downsample paths.

The downsample path uses an integer-math nearest-sample index formula; `` `interp_method` `` is ignored there. No anti-aliasing filter is applied.