---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/tracking/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Download Tracking

Per-frame player, referee and ball positions for one analysis, as a file download.

## Request

```
GET /analyses/{id}/tracking/download?format=parquet
```

| Parameter | Type    | Required | Description                    |
| --------- | ------- | -------- | ------------------------------ |
| `id`      | integer | Yes      | Analysis ID                    |
| `format`  | string  | No       | `clean` or `parquet` (default) |

The file is deterministic for a given analysis and can be cached client-side. Clean is around 1-2 MB, parquet around 20-30 MB.

## Clean Format

`format=clean` returns a gzipped JSON file holding two keys: `meta` and `tracklets`. Each tracklet is one continuous entity (player, goalkeeper or ball) with a voted team and jersey, gap-filled and smoothed, so a viewer draws steady dots rather than the blinking of raw per-detection rows. Positions are quantised to decimetres, downsampled and delta-encoded against the frame grid `meta` describes, which keeps a full match around 1-2 MB. This is the payload behind minimap and video-overlay views.

From analysis version `0.5.62`, each tracklet also carries `status`, run-length encoded over its samples as `[["detected" | "projected", count], ...]`: `detected` is a position seen on screen, `projected` an estimated one (player off screen, or ball between detections).

Analyses from version `0.5.38` carry the file. Older ones return `404` for this format and can be drawn from the parquet instead.

## Response

The `parquet` format is one table: one row per tracked entity per sampled frame.

```
timestamp  role        player_id  team  x      y      status
3309680    player      0-4        0     6606   3256   detected
3309680    player      0-10       0     4520   4100   detected
3309680    player      1-3        1     2210   1180   projected
3309680    ball        null       null  5200   3400   detected
3309720    player      0-4        0     6610   3259   detected
```

## Columns

| Column               | Type    | Unit | Description                                                                                      |
| -------------------- | ------- | ---- | ------------------------------------------------------------------------------------------------ |
| `timestamp`          | int32   | ms   | Time from video start                                                                            |
| `role`               | string  |      | `player`, `goal_keeper`, `ball` or `referee`                                                     |
| `player_id`          | string  | null |                                                                                                  |
| `team`               | int8    | null |                                                                                                  |
| `player_id_conf`     | float16 | null |                                                                                                  |
| `x`                  | int16   | null | cm                                                                                               |
| `y`                  | int16   | null | cm                                                                                               |
| `bbox_x`             | int16   | null | px                                                                                               |
| `bbox_y`             | int16   | null | px                                                                                               |
| `status`             | string  |      | How the row was produced. See [Row Status](#row-status). Absent before analysis version `0.5.36` |
| `overlap_partner_id` | string  | null |                                                                                                  |
| `position_conf`      | float   | null |                                                                                                  |
| `identity_conf`      | float   | null |                                                                                                  |

## Row Status

| Status             | Meaning                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| `detected`         | Player detected in the video frame                                                                             |
| `detected_overlap` | Detected while overlapping another player, named by `overlap_partner_id`. Identity attribution is less certain |
| `projected`        | Player not visible in the frame, position projected by the tracking model                                      |
| `projected_nocam`  | Player outside all camera coverage, position projected with the highest uncertainty                            |

From analysis version `0.5.36` the file covers the full squad: detection rows plus projected rows for players the camera does not see. Detection rows are sampled at 25 FPS (40 ms steps), projected rows at 5 Hz (200 ms steps).

Warning

Projected rows are estimates at a different sample rate. Summing frame-to-frame movement over the whole file inflates distance. Keep rows whose `status` starts with `detected` before computing per-player statistics.
