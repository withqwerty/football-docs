---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/schema/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Schema

Event schema for one analysis: the event types it carries, their metadata properties, the available filters, frame_state availability, and the measured quality of each event type.

## Request

```
GET /analyses/{id}/schema
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Analysis ID |

## Response

```
{
  "data_version": 6,
  "engine_version": "0.5.64",
  "event_types": {
    "pass": {
      "summary": "A deliberate attempt to deliver the ball to a teammate....",
      "status": "stable",
      "quality": { "metric": "...", "per_source": { "...": { "recall": 0.81, "precision": 0.73, "f1": 0.77, "n": 3806 } } },
      "properties": [
        { "name": "body_part", "type": "str", "available": true, "enum": ["head", "both_hands", "unknown"] },
        { "name": "confidence_detection", "type": "float32", "available": true },
        { "name": "confidence_event", "type": "float32", "available": true }
      ]
    },
    "shot": {
      "summary": "An attempt to score: a kick or other body contact...",
      "status": "stable",
      "quality": { "metric": "...", "per_source": { "...": { "recall": 0.81, "precision": 0.73, "f1": 0.77, "n": 3806 } } },
      "properties": [
        { "name": "body_part", "type": "str", "available": true, "enum": ["head", "both_hands", "unknown"] },
        { "name": "confidence_detection", "type": "float32", "available": true },
        { "name": "confidence_event", "type": "float32", "available": true }
      ]
    }
  },
  "filters": [
    { "type": "team_possession", "description": "..." },
    { "type": "event_property", "description": "..." },
    { "type": "frame_state", "description": "..." }
  ],
  "frame_state": {
    "available": true,
    "columns": [
      { "name": "timestamp", "type": "int32", "description": "Milliseconds from video start; join key. Same..." },
      { "name": "player_id", "type": "str", "description": "Identity-resolved 'team-jersey' id; join key." },
      { "name": "speed_mps", "type": "float32", "description": "Smoothed speed in m/s, positions de-jittered..." }
    ]
  },
  "eval_sources": {
    "pcbas": { "label": "PCBAS broadcast benchmark", "description": "Top-flight matches captured from professional broadcast..." },
    "sb": { "label": "World Cup Broadcast", "description": "World Cup 2022 knockout broadcasts scored against..." }
  }
}
```

Analyses on data version 1 or 2 return a minimal schema with no event type details.

```
{
  "data_version": 2,
  "engine_version": "0.5.10",
  "event_types": {},
  "filters": [
    { "type": "team_possession", "description": "..." },
    { "type": "ball_action", "description": "..." }
  ],
  "frame_state": {
    "available": false,
    "columns": []
  },
  "eval_sources": {}
}
```

## Response Fields

| Field                                  | Type    | Description                                                                                                                                                                                                |
| -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data_version`                         | integer | Event data version, currently 6. Versions 1-2 are legacy                                                                                                                                                   |
| `engine_version`                       | string  | Engine version that produced the data                                                                                                                                                                      |
| `event_types`                          | object  | Map of event type name to definition. `{}` on data version 1 and 2                                                                                                                                         |
| `event_types[].summary`                | string  | Description of the event type                                                                                                                                                                              |
| `event_types[].status`                 | string  | `experimental` when this event type's quality record for the analysis's engine version is flagged unreliable, else `stable`. Experimental types are served as usual, with lower confidence in their counts |
| `event_types[].properties`             | array   | Metadata properties available for this event type                                                                                                                                                          |
| `event_types[].properties[].available` | boolean | `false` when this analysis never fills the property: null, or the placeholder `unknown`, on every event of that type. `true` when the type has no events in the analysis                                   |
| `event_types[].quality`                | object  | null                                                                                                                                                                                                       |
| `filters`                              | array   | Filter types available for this analysis                                                                                                                                                                   |
| `frame_state.available`                | boolean | Whether frame_state data exists                                                                                                                                                                            |
| `frame_state.columns`                  | array   | Available frame_state columns. `[]` when unavailable                                                                                                                                                       |
| `eval_sources`                         | object  | The evaluation slices the quality numbers are measured on, keyed as in `per_source`. `{}` on data version 1 and 2                                                                                          |
