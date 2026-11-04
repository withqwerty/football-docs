---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/analyses/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Get Analysis

Status, version and quality of one analysis.

## Request

```
GET /analyses/{id}
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Analysis ID |

The result endpoints require `status: "done"`; check here before querying them. Status changes can also be pushed to a [webhook](https://docs.aiontheball.nl/versions/v1/concepts/webhooks/index.md).

## Response

```
{
  "data": {
    "id": 1246,
    "video_id": 789,
    "status": "done",
    "aggregate_version": "0.4.98",
    "finished_at": "2025-01-15T11:45:00Z",
    "quality": {
      "score": 89.8,
      "grade": "good",
      "reasons": [
        { "code": "pitch_not_located", "severity": "major", "segments": 10, "impact": 87 }
      ]
    },
    "video": {
      "id": 789,
      "title": "Team A vs Team B - League Match",
      "duration": 5400,
      "home_team_name": "Team A",
      "away_team_name": "Team B"
    }
  }
}
```

### Response Fields

| Field               | Type     | Description                                                                                     |
| ------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `id`                | integer  | Analysis ID                                                                                     |
| `video_id`          | integer  | Video the analysis ran on                                                                       |
| `status`            | string   | See [Status Values](#status-values)                                                             |
| `waiting_for`       | array    | What the hold is on, e.g. `["game_context"]`. Present only while `status` is `waiting_for_meta` |
| `aggregate_version` | string   | Pipeline version, e.g. `0.4.98`                                                                 |
| `finished_at`       | datetime | null                                                                                            |
| `quality`           | object   | How reliable the finished results are. See [Quality](#quality)                                  |
| `video`             | object   | The [video object](https://docs.aiontheball.nl/versions/v1/endpoints/videos/#video-object)      |

### Status Values

| Status              | Description                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`              | Analysis created, initialising                                                                                                                                                          |
| `waiting_for_video` | Waiting for the video to be ready                                                                                                                                                       |
| `waiting_for_meta`  | Parked while kit detection on the video finishes, with the reason in `waiting_for`. Bounded: after 60 minutes it continues on its own. Show the confirm-teams step rather than an error |
| `running`           | Currently being processed                                                                                                                                                               |
| `done`              | Completed, results available                                                                                                                                                            |
| `error`             | Processing failed                                                                                                                                                                       |
| `ignored`           | Analysis was ignored and will not be processed                                                                                                                                          |
| `no_match_detected` | No soccer match was detected in the video; the analysis will not run                                                                                                                    |
| `needs_attention`   | Processing paused, pending manual review                                                                                                                                                |

### Quality

The same object shape is repeated on [Team Report](https://docs.aiontheball.nl/versions/v1/endpoints/team-report/index.md).

| Field     | Type   | Description                                              |
| --------- | ------ | -------------------------------------------------------- |
| `score`   | number | null                                                     |
| `grade`   | string | null                                                     |
| `reasons` | array  | Factors that lowered the score. `[]` when there are none |

#### Reason object

| Field      | Type    | Description                                     |
| ---------- | ------- | ----------------------------------------------- |
| `code`     | string  | Reason identifier, e.g. `pitch_not_located`     |
| `severity` | string  | How serious the issue is, e.g. `minor`, `major` |
| `segments` | integer | Match segments affected                         |
| `impact`   | integer | Weight this factor carried in the score         |
