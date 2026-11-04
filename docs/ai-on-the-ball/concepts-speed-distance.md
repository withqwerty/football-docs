---
source_url: https://docs.aiontheball.nl/versions/v1/concepts/speed-distance/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.562Z
---
# Speed & Distance

The speed series behind every distance and speed number, the buckets it is split into, and how the Summary and the match reports report it.

## Speed buckets

[Summary](https://docs.aiontheball.nl/versions/v1/endpoints/summary/index.md) reports `distance_by_speed_bucket` over four buckets. The lower bound is inclusive, the upper bound exclusive, and the top bucket has no upper edge.

| Bucket    | Speed range       | Field         |
| --------- | ----------------- | ------------- |
| Walking   | 0-7 km/h          | `walking_m`   |
| Jogging   | 7-14 km/h         | `jogging_m`   |
| Running   | 14-21 km/h        | `running_m`   |
| Sprinting | 21 km/h and above | `sprinting_m` |

## Speed zones in the match reports

The [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) splits the same series into five zones in `physical.speed_zones`. The edges are the 7 / 14 / 21 km/h split plus a 25.2 km/h sprint threshold, so each Summary bucket is an exact union of zones.

| Zone             | Speed range         | Summary bucket        |
| ---------------- | ------------------- | --------------------- |
| `walking`        | 0-7 km/h            | `walking_m`           |
| `jogging`        | 7-14 km/h           | `jogging_m`           |
| `running`        | 14-21 km/h          | `running_m`           |
| `high_intensity` | 21-25.2 km/h        | part of `sprinting_m` |
| `sprinting`      | 25.2 km/h and above | part of `sprinting_m` |

`sprinting_m` equals `high_intensity` plus `sprinting`. Each zone carries its own `min_kmh` and `max_kmh`, and the thresholds are in the report's `params`; read the bounds off the response rather than hardcoding them.

## A sprint zone is not a sprint

The `sprinting` zone is a bucket of time and distance: every sample at or above `params.sprint_min_kmh` lands in it, however brief. A `physical.sprints[]` entry is a run that reached that speed and lasted at least `params.sprint_min_s` before dropping below `params.sprint_exit_kmh`. A single fast stride adds to the zone but produces no sprint, and the number of sprints is not derivable from `speed_zones`.

To show a sprint count with a sprint distance, use `physical.sprint_distance_m`: the metres covered inside the counted sprints. It is `0.0` when there are no sprints, so the two numbers always agree.

## Estimated sprints

Measured sprints undercount far more than measured distance: a fast run is where a player is most likely to leave the camera view or lose tracking, and a sprint must hold its speed for a full second to count. Projecting the measured sprints like distance still leaves them about half the true number. The Player Report therefore estimates sprints from the high-speed band, which holds up better, on the same covered minutes as `distance_m_est`:

```
sprint_distance_m_est = sprint_m_per_high_speed_m * high_speed distance_m_est   (nearest 10 m)
sprints_est           = sprints_per_high_speed_m  * high_speed distance_m_est   (rounded)
```

The factors depend on the footage: 0.39 m and 0.019 sprints per metre on broadcast footage, 0.34 m and 0.017 on non-broadcast footage, where players sprint less per metre run fast. The ones used for a report are in its `params`. Neither estimate is ever below what was measured (`sprint_distance_m`, the number of `sprints`), and both are null whenever `distance_m_est` is. Show `distance_m_est`, `sprint_distance_m_est` and `sprints_est` together so all three are on the same footing. `sprints[]` lists only the measured sprints, so it is shorter than `sprints_est`.

## How speed and distance are computed

Summary and the Player Report read one shared speed series, so a player's distance, top speed and buckets agree across the two endpoints.

| Quantity      | Definition                                                                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Source        | The pipeline's own smoothed per-frame speed where the analysis ships it, otherwise a rolling-median smoother over tracking positions. The Player Report states which was used in `physical.source` (`engine` or `tracking_fallback`)                         |
| Distance      | `sum(speed) * 40 ms` over detected samples, so a detection gap contributes nothing rather than a straight-line dash. Samples above `params.top_speed_ceiling_kmh` are dropped, as for top speed                                                              |
| Top speed     | The highest 1-second rolling mean over contiguous measured windows (`max_speed_kmh`, the report's `top_speed_kmh`), not the single fastest frame. Samples above a realistic ceiling (`params.top_speed_ceiling_kmh`) are dropped first as tracking artifacts |
| Average speed | Mean per-sample speed (`avg_speed_kmh`)                                                                                                                                                                                                                      |
| Tracked time  | Detected samples times 40 ms (`tracking_duration_sec`, the report's `coverage.seconds_detected`). Off-camera gaps are not counted                                                                                                                            |

Warning

Every total is a sum over detected time, which is lower on non-broadcast footage and for players far from the camera. Compare players only alongside their tracked time.

## Estimated distance

Detected-only distance is a lower bound, since a player carries a speed for only part of the match. Both endpoints also carry an estimate: `total_distance_m_est` on Summary, `physical.distance_m_est` (with `distance_per_min`, `distance_per90_m` and a `distance_bands` breakdown) on the Player Report. They are the same number where they overlap.

The estimate adds the untracked minutes to what was measured. A player is tracked most while play is near him, so his untracked minutes hold more walking and less running than his tracked ones. Each speed band is projected at its own share of the measured pace:

```
distance_per_min  = distance_m / minutes_measured
band estimate     = band distance_m * (1 + f_band * untracked_minutes / minutes_measured)
distance_m_est    = sum of the band estimates
minutes_measured  = speed-carrying seconds / 60
minutes_covered   = seconds_in_halves / 60   (detected + projected seconds inside the two halves)
untracked_minutes = minutes_covered - minutes_measured
f_band            = 1.18 walking, 0.61 jogging, 0.86 running, 0.87 at 21 km/h and above
```

Pre-match, half-time and post-match time is left out of `minutes_covered`; on an analysis without detected halves it falls back to all detected and projected seconds. `distance_m_est` is a total over the covered minutes, not a full 90, so read it with `minutes_covered`. `distance_per90_m` projects the measured rate to a full match instead. Both are rounded to the nearest 10 m, `distance_per_min` to 0.1 m. See [accuracy](#accuracy) for how close it lands. `distance_per_min` is the measured pace: it does not depend on how long each player was tracked, but it reads a little high because tracked minutes are the busier ones.

## When values are null

A speed above `params.top_speed_ceiling_kmh` (36 km/h) is a tracking artifact, not running: it adds no distance, time, zone or sprint. The rate and the estimate are `null`, with the reason in `physical_withheld`, when the player has under `params.est_seconds_floor` (`300 s`) of measured time (`insufficient_measured_time`), runs above 150 m per measured minute, 100 for a keeper (`implausible_rate`), or covers more than 30% of the distance at 21 km/h or above (`implausible_sprint_share`); the last two also null the Summary `avg_speed_kmh`. A keeper's rate and estimate are always `null` (`keeper_only_observed_near_play`): keepers are tracked mostly when play comes near, so their rate does not project to a match. The detected-only totals are always present.

## Where Summary and the report differ

| Cause                               | Effect                                                                                                                                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rounding                            | Summary rounds every value to 2 decimal places. The report rounds metres and seconds to 1, speeds to 2                                                                                                               |
| Fallback analyses                   | The fallback smoother first drops positions further than 3 m outside the pitch rectangle, so Summary's `tracking_duration_sec` counts fewer samples than the report's `coverage.seconds_detected`                    |
| Analysis version `0.5.44` and later | The report's `coverage.seconds_detected` is the pipeline's own measurement rather than a sample count, so it can differ from `tracking_duration_sec` by the samples the pipeline measured but the series did not use |
