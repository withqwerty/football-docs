---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/create-analysis/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Create Analysis

Starts an analysis on a video.

## Request

```
POST /videos/{video_id}/analysis
```

| Parameter  | Type    | Required | Description                                                                                        |
| ---------- | ------- | -------- | -------------------------------------------------------------------------------------------------- |
| `video_id` | integer | Yes      | Video ID, in the path                                                                              |
| `fps`      | integer | No       | Legacy body field. Analyses always run at 25 frames per second, so `25` is the only accepted value |

The body is optional and `{}` is the normal request. The video does not have to be `available` yet: the analysis sits in `waiting_for_video` until it is, then starts on its own. Run the [confirm-sides widget](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md) before this call; the [analysis workflow guide](https://docs.aiontheball.nl/versions/v1/guides/analysis-workflow/index.md) has the full sequence.

```
{}
```

`400` when the video is shorter than 2 minutes, when its duration cannot be determined, or when `fps` is set to anything other than `25`:

```
{ "message": "Length of video has to be at least 2 minutes" }
```

On a prepaid account the call spends one [credit](https://docs.aiontheball.nl/versions/v1/endpoints/credits/index.md): `402` when none are left, `422` when the video is longer than 2 hours, `429` when two analyses are already running.

`401` without a valid token, `403` when the caller has no access to the video, `404` when the video does not exist.

## Response

```
{
  "data": {
    "id": 1247,
    "video_id": 789,
    "status": "init",
    "algorithm_version": "0.4.98",
    "parameters": {},
    "results_available": false,
    "progress": 0,
    "video": {
      "id": 789,
      "title": "Team A vs Team B"
    }
  }
}
```

### Response Fields

| Field               | Type    | Description                                                                                    |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `id`                | integer | Analysis ID                                                                                    |
| `video_id`          | integer | Video the analysis runs on                                                                     |
| `status`            | string  | See [Status Values](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/#status-values) |
| `algorithm_version` | string  | Pipeline version the analysis runs                                                             |
| `parameters`        | object  | Analysis parameters. Empty on a default run                                                    |
| `results_available` | boolean | True when results can be queried                                                               |
| `progress`          | number  | Estimated completion, 0-100                                                                    |
| `video`             | object  | The [video object](https://docs.aiontheball.nl/versions/v1/endpoints/videos/#video-object)     |

Track progress with [webhooks](https://docs.aiontheball.nl/versions/v1/concepts/webhooks/index.md) or by polling [Get Analysis](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/index.md).
