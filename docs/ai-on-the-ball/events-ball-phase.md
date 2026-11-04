---
source_url: https://docs.aiontheball.nl/versions/v1/events/ball-phase/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Ball Phase

A continuous span describing whether the ball is in play, out of bounds, or in a stoppage. Carries a `phase` enum: `in_play`, `out_of_bounds`, `in_bounds_stoppage`, `half_kickoff`.

Category: Structure

## Properties

| Property | Type  | Description            | Values                                                           |
| -------- | ----- | ---------------------- | ---------------------------------------------------------------- |
| `phase`  | `str` | Ball-phase span label. | `in_play`, `out_of_bounds`, `in_bounds_stoppage`, `half_kickoff` |

## Property Values

### `phase`

A continuous span describing whether the ball is in play, out of bounds, or in a stoppage. Carries a `phase` enum: `in_play`, `out_of_bounds`, `in_bounds_stoppage`, `half_kickoff`.

| Value                | Description                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `in_play`            | Active gameplay. The ball is in bounds and the referee has not stopped play.                      |
| `out_of_bounds`      | Between the ball crossing a touchline or goal-line and the restart.                               |
| `in_bounds_stoppage` | Play is paused but the ball is still on-pitch (e.g. foul, injury). Distinct from `out_of_bounds`. |
| `half_kickoff`       | Single-frame kickoff anchor at the start of a period.                                             |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "ball_phase",
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
  "event_id": "06a0765b-0005-7005-8000-000000000005",
  "start": 125.5,
  "end": 135.5,
  "label": "in_play",
  "event_type": "ball_phase",
  "team_id": null,
  "timeline_confidence": null
}
```

`label` is the phase value, e.g. `"in_play"` or `"out_of_bounds"`.
