---
source_url: https://docs.aiontheball.nl/versions/v1/events/goal/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Goal

A goal: the ball has fully crossed the goal line between the posts and under the crossbar, and the match restarts with a kickoff. Each goal is reported with the team credited with it, the half it fell in, and the ball's position on the pitch, each left empty rather than guessed when it could not be established.

Category: Match event

## Properties

| Property           | Type      | Description                                                                                                                                        | Values                                            |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `confidence_event` | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                |                                                   |
| `period`           | `str`     | Match-period span label. `full_game` is the whole-video extent; `first_half`/`second_half`/`match` are the detected play spans and their envelope. | `full_game`, `first_half`, `second_half`, `match` |
| `team_label`       | `int8`    | Team label, harmonised across the match (0 or 1).                                                                                                  |                                                   |

## Property Values

### `period`

A set of spans that place the match on the frame timeline, so every other event can be read against periods of play rather than raw frame numbers.

| Value         | Description                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `full_game`   | A single span covering the whole video, from the first frame to the last.                                |
| `first_half`  | The first period of play, from its opening restart to the last active play before the break.             |
| `second_half` | The second period of play, from its opening restart to the last active play.                             |
| `match`       | The regulation envelope from the first-half start to the second-half end, including the half-time break. |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "goal",
      "properties": []
    }
  ]
}
```

`properties` constrains the metadata fields listed above. See [Event Property Filter](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md).

`teams` matches a goal by `team_label`. From engine version `0.5.55` that is the team the goal counts for, own goals included. Before `0.5.55` it is the team in possession when the goal was scored. A goal with a null `team_label` is excluded when `teams` is set.

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0007-7007-8000-000000000007",
  "start": 617.92,
  "end": 617.92,
  "label": "goal",
  "event_type": "goal",
  "team_id": "team_0",
  "timeline_confidence": null
}
```

A point event: `end` equals `start`. `team_id` is the team the goal counts for, from `team_label`. Null when the team is unknown.
