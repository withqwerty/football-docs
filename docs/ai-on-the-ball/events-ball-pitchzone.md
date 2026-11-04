---
source_url: https://docs.aiontheball.nl/versions/v1/events/ball-pitchzone/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Ball Pitchzone

A continuous span describing which longitudinal third of the pitch the ball is currently in. Carries a `pitchzone` enum: `defensive_third`, `middle_third`, `attacking_third`.

Category: Structure

## Properties

| Property    | Type  | Description                                        | Values                                               |
| ----------- | ----- | -------------------------------------------------- | ---------------------------------------------------- |
| `pitchzone` | `str` | Pitch-third span label on `ball_pitchzone` events. | `defensive_third`, `middle_third`, `attacking_third` |

## Property Values

### `pitchzone`

A continuous span describing which longitudinal third of the pitch the ball is currently in. Carries a `pitchzone` enum: `defensive_third`, `middle_third`, `attacking_third`.

| Value             | Description                                                                     |
| ----------------- | ------------------------------------------------------------------------------- |
| `defensive_third` | Ball is in the longitudinal third closest to the in-possession team's own goal. |
| `middle_third`    | Ball is in the central longitudinal third.                                      |
| `attacking_third` | Ball is in the longitudinal third closest to the opposition goal.               |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "ball_pitchzone",
      "properties": []
    }
  ]
}
```

`properties` constrains the metadata fields listed above. See [Event Property Filter](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md).

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0006-7006-8000-000000000006",
  "start": 125.5,
  "end": 135.5,
  "label": "ball_pitchzone",
  "event_type": "ball_pitchzone",
  "team_id": null,
  "timeline_confidence": null
}
```
