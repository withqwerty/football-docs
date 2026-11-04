---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/events/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Events

Every event detected in an analysis, as a flat time-ordered array.

## Request

```
GET /analyses/{id}/events
```

| Parameter | Type    | Required | Description                                                                                                                                  |
| --------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | integer | Yes      | Analysis ID                                                                                                                                  |
| `include` | string  | No       | `properties` adds `event_status` and `properties` to every row. See [Properties](#properties). Omitted, the rows carry only the fields below |

Requires `status: "done"` on [Get Analysis](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/index.md). Which event types an analysis carries depends on its data version, given per type in [Event types](#event-types). To select events by metadata or to turn them into clip windows, use [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md) with an [event_property](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md) or [ball_action](https://docs.aiontheball.nl/versions/v1/filters/ball-action/index.md) filter.

## Response

```
[
  {
    "event_id": "06a0765b-0001-7001-8000-000000000001",
    "start": 0.04,
    "end": 20.36,
    "label": "Team A",
    "event_type": "team_possession",
    "team_id": "team_0",
    "timeline_confidence": null
  },
  {
    "event_id": "06a0765b-0003-7003-8000-000000000003",
    "start": 0.00,
    "end": 3.00,
    "label": "not analysable",
    "event_type": "scene",
    "team_id": null,
    "timeline_confidence": null
  },
  {
    "event_id": "06a0765b-0005-7005-8000-000000000005",
    "start": 0.00,
    "end": 5400.00,
    "label": "full_game",
    "event_type": "match_timeline",
    "team_id": null,
    "timeline_confidence": 1.0
  },
  {
    "event_id": "06a0765b-0006-7006-8000-000000000006",
    "start": 617.92,
    "end": 618.32,
    "label": "pass",
    "event_type": "pass",
    "team_id": "team_0",
    "timeline_confidence": null
  },
  {
    "event_id": "06a0765b-0007-7007-8000-000000000007",
    "start": 633.48,
    "end": 634.72,
    "label": "carry",
    "event_type": "carry",
    "team_id": "team_1",
    "timeline_confidence": null
  },
  {
    "event_id": "06a0765b-000a-700a-8000-00000000000a",
    "start": 0.04,
    "end": 617.88,
    "label": "in_play",
    "event_type": "ball_phase",
    "team_id": null,
    "timeline_confidence": null
  }
  // ... one entry per detected event
]
```

### Response Fields

| Field                 | Type   | Unit | Description                                                                               |
| --------------------- | ------ | ---- | ----------------------------------------------------------------------------------------- |
| `event_id`            | string | null |                                                                                           |
| `start`               | float  | s    | Start time from video start                                                               |
| `end`                 | float  | s    | End time. Equal to `start` on point events (`shot`, `goal`). `pass` and `carry` are spans |
| `label`               | string |      | Value carried by the event, per type                                                      |
| `event_type`          | string |      | One of the types below                                                                    |
| `team_id`             | string | null |                                                                                           |
| `timeline_confidence` | float  | null |                                                                                           |

`label` is a display name and may change when team identity resolves. Key on `team_id`, and resolve names via [team-mapping](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md).

### Event Types

| Type                | Description                                                                                                                                                                                                               | Labels                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `team_possession`   | Team in control of the ball. A gap between two events is time with no team credited: ball out of play, contested, or a transition. See [Possession](https://docs.aiontheball.nl/versions/v1/concepts/possession/index.md) | Team names                                                                        |
| `player_possession` | Player in control of the ball                                                                                                                                                                                             | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md) |
| `scene`             | Whether the footage is gameplay. `not analysable` covers replays, crowd shots, graphics and half-time                                                                                                                     | `analysable`, `not analysable`                                                    |
| `match_timeline`    | Game period. `full_game` is the whole video, `match` the envelope of the two halves. The halves are emitted from analysis version `0.5.45` when the split could be resolved, with `timeline_confidence` saying how firmly | `full_game`, `first_half`, `second_half`, `match`                                 |
| `pass`              | Pass. Data version 2+                                                                                                                                                                                                     | `pass`                                                                            |
| `carry`             | Player moving with the ball at their feet, spanning the run with the ball. Data version 2+. Named `drive` before analysis version `0.5.45`; older analyses are served as `carry`                                          | `carry`                                                                           |
| `drive`             | A `carry` of at least 3 m, listed next to it with the same span. See [Drive](https://docs.aiontheball.nl/versions/v1/events/drive/index.md). From analysis version `0.5.45`                                               | `drive`                                                                           |
| `shot`              | Shot. Data version 2+                                                                                                                                                                                                     | `shot`                                                                            |
| `ball_phase`        | Ball in or out of play. `in_bounds_stoppage` is play stopped with the ball on the field (foul, injury), `half_kickoff` the period around a half kickoff. Data version 3+                                                  | `in_play`, `out_of_bounds`, `in_bounds_stoppage`, `half_kickoff`                  |
| `ball_pitchzone`    | Pitch third the ball is in                                                                                                                                                                                                | `ball_pitchzone`                                                                  |
| `goal`              | Goal scored, followed by a kickoff restart                                                                                                                                                                                | `goal`                                                                            |

Without `include`, this response carries no actor, position or metadata beyond the fields above. [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md) returns those for the events it matches.

## Properties

```
GET /analyses/{id}/events?include=properties
```

Each row gains two fields. The other fields and the row order are the same as without `include`.

```
{
  "event_id": "06ac5122-7aef-7fae-8000-a968f5f67d10",
  "start": 751.92,
  "end": 753.08,
  "label": "pass",
  "event_type": "pass",
  "team_id": "team_0",
  "timeline_confidence": null,
  "event_status": "stable",
  "properties": {
    "confidence_event": 0.951,
    "confidence_identity": 0.947,
    "length_cm": 1254,
    "receiver_id": "0-14",
    "receiver_team": 0,
    "set_piece": "kick_off",
    "x_target": 3863,
    "y_target": 3660
  }
}
```

| Field          | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event_status` | string | null                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `properties`   | object | Every property [Schema](https://docs.aiontheball.nl/versions/v1/endpoints/schema/index.md) lists for the event type, keyed by name. Values and units are as described in [Event types](https://docs.aiontheball.nl/versions/v1/events/index.md), with the unit in the name (`length_cm`). A property that is null, or the enum value `unknown`, is left out. Floats are rounded to 3 decimals. `{}` on data version 1 and 2 |

A property the engine adds to Schema appears here without an API change.
