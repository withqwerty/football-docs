---
source_url: https://docs.aiontheball.nl/versions/v1/events/scene/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Scene

A continuous span of the broadcast feed of a single scene type. `is_analysable` is true for the main tactical camera and false for replays, slow-motion, close-ups, and other shots where tracking can't run.

Category: Structure

## Properties

| Property        | Type   | Description                                           | Values |
| --------------- | ------ | ----------------------------------------------------- | ------ |
| `is_analysable` | `bool` | Whether this scene is the main-camera broadcast feed. |        |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    { "type": "scene" }
  ]
}
```

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0003-7003-8000-000000000003",
  "start": 125.5,
  "end": 135.5,
  "label": "analysable",
  "event_type": "scene",
  "team_id": null,
  "timeline_confidence": null
}
```

`label` is `"analysable"` or `"not analysable"`.
