---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/preview-teams/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Preview teams

Provisional pre-analysis team detection: the two kits found in the video and a few example player crops.

```
GET /v1/videos/{id}/preview-teams
```

A preview pass starts when a video is created via the API. It reads a handful of frames from `video_file_url` over HTTP range requests, without a full download, in parallel with the normal download. The result is typically ready about 10 seconds after `POST /videos` and always under a minute. A fast, range-seekable source URL makes it quicker.

Use it to build a team-confirmation step before the analysis runs: your own UI, or the [confirm-sides widget](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md), which polls this payload.

## Response

While the pass runs, poll every 2 seconds:

```
{ "status": "processing" }
```

When ready:

```
{
  "status": "ready",
  "stage": "preview",
  "crops_status": "ready",
  "ready_at": "2026-07-17T09:41:03.000000Z",
  "home_name": "Home FC",
  "away_name": "Away FC",
  "confirmed_home_key": "team_b",
  "teams": [
    {
      "key": "team_a",
      "swatch": { "primary": "red", "secondary": "white", "shorts": "red",
                  "socks": "red", "pattern": "solid", "description": "all red kit" },
      "crops": ["https://…presigned player crop…", "…"]
    },
    { "key": "team_b", "swatch": { "…": "…" }, "crops": [] }
  ]
}
```

- `team_a`/`team_b` are the detected kits in a stable canonical order, not home or away. Mapping a kit to home/away is the confirmation you ask your user for (see [Teams and sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md)).
- `stage` is `"preview"` (pre-analysis pass) or `"final"` (re-run on the fully processed video). Crop URLs are presigned and expire.
- `home_name`/`away_name` echo the video's team names and may be `null`.
- `confirmed_home_key` is the detected kit a human has confirmed as the home team. It is `null` until someone answers. It survives a later `final` pass: that pass re-orders its own anchors to keep the confirmed kit on the same key, so the answer never re-points at the other team.

### Crops

Kit swatches are published when they are detected. The example player crops need a further vision call and land a few seconds later. `"status": "ready"` with an empty `crops` array is normal and usually temporary. `crops_status` reports which:

| `crops_status` | Meaning                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pending`      | Crops may still arrive, usually within a second or two of the colours.                                                             |
| `ready`        | Crops are in.                                                                                                                      |
| `unavailable`  | No crops are coming. The pass finished with nothing, never ran, or can no longer run for this video. Polling longer will not help. |

If your UI shows crops, poll while `crops_status` is `pending` under a short timeout, then render the swatches alone. The bundled widget does this.

If the source URL does not support HTTP range requests, the preview stays `processing` until the full download and preprocessing finish. That takes minutes, depending on file size.

### Older videos

Videos created before the preview pass existed have no preview stored. The first call to this endpoint, or to [`POST /videos/{id}/embed-token`](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md), dispatches the pass and returns `{"status": "processing"}`. Keep polling and it fills in. It reads frames from the copy hub already holds, not from the original URL, which may have expired. Expect a first answer in tens of seconds, because nothing was warmed up in advance. Repeat calls do not queue more work.

These preview crops are provisional. Once an analysis is done, the analysis-scoped crops are served by `GET /analyses/{id}/exemplar-crops`.
