---
source_url: https://docs.aiontheball.nl/versions/v1/guides/analysis-workflow/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.558Z
---
# Workflow: from video to results

The end-to-end path. Step 2 is optional but recommended. It anchors team identity, which improves the labelling of every downstream result.

```
1. POST /videos                     register the video (by URL)
2.      confirm sides               widget or PUT /videos/{id}     (optional)
3. POST /videos/{id}/analysis       start the analysis
4. GET  /analyses/{id}              poll until done (or use webhooks)
5.      fetch results               events / summary / tracking / query-intervals / crops
```

## 1. Register the video

```
POST /v1/videos
```

```
{
  "video_file_url": "https://cdn.example.com/match-4711.mp4",
  "title": "Cup final",
  "date": "2026-07-12",
  "home_team_name": "Home FC",
  "away_team_name": "Away FC",
  "left_start_team": "home",
  "start_offset_seconds": 0,
  "end_offset_seconds": null
}
```

Only `video_file_url` is required. It must be a public `http(s)` URL: a host that resolves to a private or loopback address is rejected with `422`. Hub downloads the file in the background. Provide team names if you know them. They label every downstream result. Registering also starts the [team preview pass](https://docs.aiontheball.nl/versions/v1/endpoints/preview-teams/index.md). Registration is rate limited per account (by default 5 per minute and 200 per day); excess requests get `429`.

The video's `status` runs `created` -> `downloading` -> `available`, or `error` if the download or validation fails. The video's `duration` stays `null` until the download finishes. Step 3 does not wait for `available`: an analysis parks as `waiting_for_video` until the download finishes.

## 2. Confirm teams (optional)

Let your user say which of the two detected kits is the home team. The video cannot determine this on its own. Embed the [confirm-sides widget](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md), or build your own step on [`GET /videos/{id}/preview-teams`](https://docs.aiontheball.nl/versions/v1/endpoints/preview-teams/index.md).

Do not ask which side that team starts on. The analysis derives `left_start_team` from the kit answer and writes it back when it completes. Set it at creation only if you already know it.

Nothing blocks the run. Team identity (names and sides) resolves at read time via [`GET /analyses/{id}/team-mapping`](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md). A confirm-sides answer or corrected metadata arriving after the run fixes the labels on every result.

## 3. Start the analysis

```
POST /v1/videos/{id}/analysis
```

An empty body `{}` is accepted. Returns the analysis with its `id` and `status`. There is nothing to configure: any body field other than the deprecated `fps` is ignored. Analyses never wait on the client. The `wait_for` and `wait_for_timeout_minutes` parameters no longer exist. Identity is composed at read time instead of blocking the run.

The analysis may park briefly as `status: "waiting_for_meta"` with `waiting_for: ["game_context"]` while hub finishes its kit-colour pass on the footage. This hold is automatic and bounded and needs no action.

A video has one analysis per engine version. Requesting another one while an analysis of that video at the current engine version exists (and has not failed) returns `409`. Its results would overwrite the existing ones. Use the existing analysis, or delete it first.

## 4. Wait for completion

Poll `GET /v1/analyses/{id}`. `status` runs `init` -> `waiting_for_video` -> (`waiting_for_meta` ->) `running` -> `done`, with `progress` while running. To avoid polling, register a webhook to be called on completion (see the webhooks concept page).

## 5. Fetch results

Once `status` is `done`:

| What                                           | Endpoint                               |
| ---------------------------------------------- | -------------------------------------- |
| Detected events (passes, shots, possession, …) | `GET /analyses/{id}/events`            |
| Match summary & aggregate stats                | `GET /analyses/{id}/summary`           |
| Raw tracking data                              | `GET /analyses/{id}/tracking/download` |
| Video intervals matching your filters          | `POST /analyses/{id}/query-intervals`  |
| Player/team thumbnails                         | `GET /analyses/{id}/exemplar-crops`    |
| Machine-readable output schema                 | `GET /analyses/{id}/schema`            |

See the endpoint reference and the events/filters pages for the payloads.

## Cleaning up

```
DELETE /v1/videos/{id}      # the video and all its analyses
DELETE /v1/analyses/{id}    # one analysis and its results
```

Both are permanent and return `204 No Content`; an item with a `running` analysis returns `409 Conflict`. Videos are kept for 6 months and results for 2 years unless your account agreed a shorter period. The retention and deletion page has the details: what each endpoint returns afterwards, and when the files are erased.
