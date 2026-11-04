---
source_url: https://docs.aiontheball.nl/versions/v1/events/shot/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Shot

An attempt to score: a kick or other body contact directed at the opponent's goal, with any body part. A headed attempt on goal is `shot` with `body_part=head`, intent is the more-specific feature.

Category: Ball action

## Properties

| Property               | Type      | Description                                                                                                                                          | Values                          |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows. Not currently populated.                           | `head`, `both_hands`, `unknown` |
| `confidence_detection` | `float32` | Detection confidence [0,1]. Not currently populated.                                                                                                 |                                 |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                  |                                 |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null). |                                 |
| `team_label`           | `int8`    | Team label, harmonised across the match (0 or 1).                                                                                                    |                                 |

## Property Values

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "shot",
      "properties": []
    }
  ]
}
```

`properties` constrains the metadata fields listed above, `players` and `teams` restrict the actor. See [Event Property Filter](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md).

`team_label` is the shooting team. `teams` matches a shot by it.

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0007-7007-8000-000000000007",
  "start": 617.92,
  "end": 617.92,
  "label": "shot",
  "event_type": "shot",
  "team_id": "team_0",
  "timeline_confidence": null
}
```

A point event: `end` equals `start`. `team_id` is the shooting team, from `team_label`. Null when the team is unknown.

Also returns these data points, documented on the page named in brackets: `body_part` (`events-carry`).
