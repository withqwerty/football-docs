---
source_url: https://docs.aiontheball.nl/versions/v1/events/carry/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Carry

A player moving with the ball at their feet while keeping control of it. The span covers consecutive frames where the same player is the active possessor and the ball stays bound to them. This is a carry in the standard sense (the ball is progressed under control); it is not a claim that an opponent was beaten one on one.

Category: Ball action

## Properties

| Property               | Type      | Description                                                                                                                                                                                                                                                                                                                                                                 | Values                          |
| ---------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows.                                                                                                                                                                                                                                                                           | `head`, `both_hands`, `unknown` |
| `confidence_detection` | `float32` | Detection confidence [0,1]. Not currently populated.                                                                                                                                                                                                                                                                                                                        |                                 |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                                                                                                                                                                                                                                         |                                 |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null).                                                                                                                                                                                                                        |                                 |
| `direction_deg`        | `int16`   | Heading of the carry start → end, degrees in [-180, 180], in the raw pitch frame (0 points toward increasing x). Not attack-relative; rotate with the game's left_start_team to make it so. Null when start/end xy are unavailable.                                                                                                                                         |                                 |
| `length_cm`            | `int32`   | Euclidean distance start → target, in cm (span events).                                                                                                                                                                                                                                                                                                                     |                                 |
| `min_opp_dist_m`       | `float32` | Closest the carrier came to any opponent over the carry span, in metres. Low values indicate the carrier engaged a defender (a take-on). Null when the carrier's identity is unresolved or no opponent was observed on-pitch during the span.                                                                                                                               |                                 |
| `path_length_cm`       | `int32`   | Distance travelled along the carry path, in cm (sum of the actor's frame-to-frame movement over the span). At least length_cm when tracking is dense (a weaving carry exceeds its straight-line distance); can fall below it where the track has gaps, since it sums only observed movement. Null when the actor has no resolved identity or no tracked path over the span. |                                 |
| `x_target`             | `int16`   | Target x-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                                                                                                                                                                |                                 |
| `y_target`             | `int16`   | Target y-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                                                                                                                                                                |                                 |

## Property Values

### `body_part`

Which body part contacted the ball.

| Value        | Description                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `head`       | Headed contact. Includes header, flick-on, headed pass, headed clearance.                                                               |
| `both_hands` | Two-handed throw. Used for throw-in restarts (paired with `set_piece=throw_in`).                                                        |
| `unknown`    | Engine-side placeholder for rows where body part was not measured. Distinct from a positive identification of a non-standard body part. |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "carry",
      "properties": []
    }
  ]
}
```

`properties` constrains the metadata fields listed above, `players` and `teams` restrict the actor. See [Event Property Filter](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md).

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0007-7007-8000-000000000007",
  "start": 617.92,
  "end": 618.72,
  "label": "carry",
  "event_type": "carry",
  "team_id": "team_0",
  "timeline_confidence": null
}
```

A span: `end` is at or after `start`. `team_id` is the actor's team. Null when the team is unknown.
