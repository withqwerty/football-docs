---
source_url: https://docs.aiontheball.nl/versions/v1/events/pass/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Pass

A deliberate attempt to deliver the ball to a teammate. The unified pass event covers open-play passes, crosses, throw-ins, kickoffs, set-piece restarts played as passes, and headed passes. All decomposed via two orthogonal metadata axes (`set_piece` and `pass_type`) plus `body_part`.

Category: Ball action

## Properties

| Property               | Type      | Description                                                                                                                                                                                                                  | Values                                                                       |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows.                                                                                                                            | `head`, `both_hands`, `unknown`                                              |
| `confidence_detection` | `float32` | Detection confidence [0,1]. Not currently populated.                                                                                                                                                                         |                                                                              |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                                                                                          |                                                                              |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null).                                                                         |                                                                              |
| `length_cm`            | `int32`   | Euclidean distance start → target, in cm (span events).                                                                                                                                                                      |                                                                              |
| `pass_result`          | `str`     | On `pass` rows: `complete` (next holder is a teammate), `incomplete` (next holder is an opponent) or `out` (play stopped before anyone controlled the ball). Null when undeterminable. Not currently populated.              | `complete`, `incomplete`, `out`                                              |
| `pass_type`            | `str`     | Stylistic flavour for a `pass` event (e.g. `cross`). null for plain passes.                                                                                                                                                  | `cross`                                                                      |
| `receiver_id`          | `str`     | On `pass` rows: 'team-jersey' id of the next player to control the ball (the receiver, or the intercepting opponent). Null when the next holder's identity is unresolved or no holder is observed within the receive window. |                                                                              |
| `receiver_team`        | `int8`    | On `pass` rows: harmonised team (0 or 1) of the next holder. Set even when `receiver_id` is null (team-only identity). Null when no holder is observed.                                                                      |                                                                              |
| `set_piece`            | `str`     | Restart context for a `pass` event. `open_play` is the in-play default.                                                                                                                                                      | `open_play`, `throw_in`, `kick_off`, `corner_kick`, `free_kick`, `goal_kick` |
| `x_target`             | `int16`   | Target x-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                 |                                                                              |
| `y_target`             | `int16`   | Target y-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                 |                                                                              |

## Property Values

### `pass_result`

How a `pass` ended: `complete` when the next player to control the ball is a teammate of the passer, `incomplete` when it is an opponent, `out` when play stopped before anyone controlled it. Reserved: not emitted today.

| Value        | Description                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------- |
| `complete`   | The next player to control the ball is a teammate of the passer.                              |
| `incomplete` | The next player to control the ball is an opponent (interception / failed pass).              |
| `out`        | Play stopped (ball out of bounds or an in-bounds stoppage) before anyone controlled the ball. |

### `pass_type`

Stylistic flavour of a `pass` event. Null for plain passes. Only set when a positive style signal fires.

| Value   | Description                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cross` | Wide delivery into the box. Set independently of `set_piece` and `body_part` (e.g. an open-play headed cross is `set_piece=open_play`, `pass_type=cross`, `body_part=head`). |

### `set_piece`

Restart context for a `pass` event. Records *how* the pass entered play.

| Value         | Description                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `open_play`   | In-play default. Always set on `pass` rows (not omitted) so consumers can distinguish "in play" from "field not declared". |
| `throw_in`    | Two-handed touchline restart after the ball leaves the sideline. Pair with `body_part=both_hands`.                         |
| `kick_off`    | Centre-circle restart at the start of a half or after a goal. Single-frame anchor.                                         |
| `corner_kick` | Restart from the corner arc after the defending team puts the ball over its own goal line.                                 |
| `free_kick`   | Restart awarded after a foul or other in-play stoppage, taken from the spot of the offence.                                |
| `goal_kick`   | Restart from the six-yard box after the attacking team puts the ball over the byline.                                      |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "pass",
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
  "label": "pass",
  "event_type": "pass",
  "team_id": "team_0",
  "timeline_confidence": null
}
```

A span: `end` is at or after `start`. `team_id` is the actor's team. Null when the team is unknown.

Also returns these data points, documented on the page named in brackets: `body_part` (`events-carry`).
