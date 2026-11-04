---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/videos/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Videos

Video records, the object an analysis is created on. Team names and the confirmed sides live on the video; see [Teams and sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) for how they resolve and the [analysis workflow guide](https://docs.aiontheball.nl/versions/v1/guides/analysis-workflow/index.md) for the end-to-end flow.

## List Videos

Every video belonging to your account, newest first, 50 per page.

### Request

```
GET /videos
```

### Response

```
{
  "data": [
    {
      "id": 789,
      "status": "available",
      "game_name": "happy-dolphin-42",
      "title": "Team A vs Team B - League Match",
      "created_at": "2025-01-15T10:00:00Z",
      "home_team_name": "Team A",
      "away_team_name": "Team B",
      "team_zero": "home",
      "left_start_team": "home",
      "duration": 5400,
      "start_offset_seconds": null,
      "end_offset_seconds": null,
      "video_file_url": "https://example.com/match-video.mp4",
      "mp4_source": "https://cdn.example.com/videos/789.mp4"
    }
  ],
  "links": { },
  "meta": { }
}
```

### Video object

| Field                  | Type     | Unit | Description                                                                                                                             |
| ---------------------- | -------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | integer  |      | Video ID                                                                                                                                |
| `status`               | string   |      | See [Video Status](#video-status)                                                                                                       |
| `game_name`            | string   |      | Unique human-readable identifier                                                                                                        |
| `title`                | string   |      | Display title                                                                                                                           |
| `created_at`           | datetime |      | When the record was created                                                                                                             |
| `duration`             | integer  | s    | Video duration                                                                                                                          |
| `home_team_name`       | string   |      | Home team name                                                                                                                          |
| `away_team_name`       | string   |      | Away team name                                                                                                                          |
| `team_zero`            | string   | null |                                                                                                                                         |
| `left_start_team`      | string   |      | Which team defends the left half at kickoff: `home`, `away` or `unknown`. Derived from the footage or from the assertion sent on create |
| `start_offset_seconds` | integer  | null | s                                                                                                                                       |
| `end_offset_seconds`   | integer  | null | s                                                                                                                                       |
| `video_file_url`       | string   |      | Source URL sent on create                                                                                                               |
| `mp4_source`           | string   |      | URL of the stored video file                                                                                                            |

Warning

Map tracking labels onto your teams with `team_zero`. `left_start_team` is a derived value and does not identify which side is `team_0`.

## Create Video

### Request

```
POST /videos
```

```
{
  "video_file_url": "https://example.com/match-video.mp4",
  "title": "Team A vs Team B - League Match",
  "home_team_name": "Team A",
  "away_team_name": "Team B",
  "date": "2025-01-15",
  "start_offset_seconds": 0,
  "end_offset_seconds": 5400
}
```

| Parameter              | Type    | Required | Description                                                                                                                                                                                                                                                                          |
| ---------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `video_file_url`       | string  | Yes      | Publicly accessible URL of the file. MP4, 2 minutes to 2 hours long, 25 FPS, 1080p or lower. Clips under 10 minutes name fewer players                                                                                                                                               |
| `title`                | string  | No       | Human-readable title                                                                                                                                                                                                                                                                 |
| `home_team_name`       | string  | No       | Home team name                                                                                                                                                                                                                                                                       |
| `away_team_name`       | string  | No       | Away team name                                                                                                                                                                                                                                                                       |
| `date`                 | date    | No       | Match date, `YYYY-MM-DD`                                                                                                                                                                                                                                                             |
| `start_offset_seconds` | integer | No       | Seconds trimmed from the beginning                                                                                                                                                                                                                                                   |
| `end_offset_seconds`   | integer | No       | Seconds trimmed from the end                                                                                                                                                                                                                                                         |
| `left_start_team`      | string  | No       | Assertion of which team defends the left half at kickoff: `home`, `away` or `unknown`. The strongest identity source, overriding the [confirm-sides widget](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md) answer. Omit it unless the side is certain |

### Response

```
{
  "data": {
    "id": 790,
    "status": "init",
    "game_name": "swift-eagle-43",
    "title": "Team A vs Team B - League Match",
    "created_at": "2025-01-16T14:30:00Z"
  }
}
```

## Get Video

### Request

```
GET /videos/{id}
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Video ID    |

### Response

Same [video object](#video-object) as the list.

```
{
  "data": {
    "id": 789,
    "status": "available",
    "game_name": "happy-dolphin-42",
    "title": "Team A vs Team B - League Match",
    "created_at": "2025-01-15T10:00:00Z",
    "home_team_name": "Team A",
    "away_team_name": "Team B",
    "team_zero": "home",
    "left_start_team": "home",
    "duration": 5400,
    "start_offset_seconds": null,
    "end_offset_seconds": null,
    "video_file_url": "https://example.com/match-video.mp4",
    "mp4_source": "https://cdn.example.com/videos/789.mp4"
  }
}
```

## Update Video

Team names or a confirmed side sent after an analysis has run are picked up at read time, so labels on existing results update without re-processing.

### Request

```
PUT /videos/{id}
```

```
{
  "title": "Updated Match Title",
  "home_team_name": "Team A",
  "away_team_name": "Team B"
}
```

| Parameter              | Type    | Required | Description                                                                  |
| ---------------------- | ------- | -------- | ---------------------------------------------------------------------------- |
| `id`                   | integer | Yes      | Video ID, in the path                                                        |
| `title`                | string  | No       | Human-readable title                                                         |
| `home_team_name`       | string  | No       | Home team name                                                               |
| `away_team_name`       | string  | No       | Away team name                                                               |
| `left_start_team`      | string  | No       | `home`, `away` or `unknown`, an assertion with the same meaning as on create |
| `date`                 | date    | No       | Match date, `YYYY-MM-DD`                                                     |
| `start_offset_seconds` | integer | No       | Seconds trimmed from the beginning                                           |
| `end_offset_seconds`   | integer | No       | Seconds trimmed from the end                                                 |

## Delete Video

Deletes the video and every analysis on it. This cannot be undone.

### Request

```
DELETE /videos/{id}
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Video ID    |

### Response

`204 No Content`.

`409` while an analysis on the video is running:

```
{ "message": "Cannot delete a video while one of its analyses is running. Wait for it to finish first." }
```

## Video Status

An analysis can be created as soon as the video record exists; it waits for the video to reach `available` on its own.

| Status              | Description                                   |
| ------------------- | --------------------------------------------- |
| `init`              | Record created, download pending              |
| `downloading`       | Video is being downloaded from the source URL |
| `locally_available` | Downloaded, being prepared for analysis       |
| `available`         | Ready for analysis                            |
| `error`             | Download or processing failed                 |
