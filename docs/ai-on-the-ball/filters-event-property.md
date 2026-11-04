---
source_url: https://docs.aiontheball.nl/versions/v1/filters/event-property/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Event Property Filter

Filter intervals by the metadata properties of one event type.

Requires analysis data version 3 or later. The [Schema endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/schema/index.md) lists the event types and properties a given analysis carries.

```
{
  "filters": [
    {
      "type": "event_property",
      "event_type": "pass",
      "properties": [
        { "field": "set_piece", "eq": "open_play" },
        { "field": "length_cm", "gte": 2000 }
      ],
      "teams": ["team_0"]
    }
  ]
}
```

## Parameters

| Parameter    | Type   | Required | Description                                                              |
| ------------ | ------ | -------- | ------------------------------------------------------------------------ |
| `type`       | string | Yes      | Must be `"event_property"`                                               |
| `event_type` | string | Yes      | Event type to filter, e.g. `"pass"`, `"carry"`, `"shot"`                 |
| `properties` | array  | Yes      | Property constraints, AND-combined. `[]` matches every event of the type |
| `players`    | array  | No       | Player IDs, e.g. `["0-5", "1-13"]`                                       |
| `teams`      | array  | No       | `"team_0"`, `"team_1"`                                                   |

`teams` matches an event with a player by the player's team, and an event without a player (`goal`, `team_possession`) by its `team_label`. An event whose team is unknown is excluded when `teams` is set.

### Property Constraints

Each entry in `properties` constrains a single metadata field.

| Field   | Type   | Description                                                                                                                                                 |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field` | string | Metadata field name, e.g. `"set_piece"`, `"length_cm"`                                                                                                      |
| `eq`    | any    | Exact match                                                                                                                                                 |
| `in`    | array  | Match any value in the list. `in_` is accepted as an alias. Values are all strings, all numbers or all booleans, e.g. `["corner", "free_kick"]` or `[0, 1]` |
| `gte`   | number | Greater than or equal                                                                                                                                       |
| `lte`   | number | Less than or equal                                                                                                                                          |

## Available Properties

### pass

| Property               | Type      | Description                                                                                                                                                                                                                  | Values                                                                       |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows.                                                                                                                            | `head`, `both_hands`, `unknown`                                              |
| `confidence_detection` | `float32` | Detection confidence [0,1].                                                                                                                                                                                                  |                                                                              |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                                                                                          |                                                                              |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null).                                                                         |                                                                              |
| `length_cm`            | `int32`   | Euclidean distance start → target, in cm (span events).                                                                                                                                                                      |                                                                              |
| `pass_result`          | `str`     | On `pass` rows: `complete` (next holder is a teammate), `incomplete` (next holder is an opponent) or `out` (play stopped before anyone controlled the ball). Null when undeterminable.                                       | `complete`, `incomplete`, `out`                                              |
| `pass_type`            | `str`     | Stylistic flavour for a `pass` event (e.g. `cross`). null for plain passes.                                                                                                                                                  | `cross`                                                                      |
| `receiver_id`          | `str`     | On `pass` rows: 'team-jersey' id of the next player to control the ball (the receiver, or the intercepting opponent). Null when the next holder's identity is unresolved or no holder is observed within the receive window. |                                                                              |
| `receiver_team`        | `int8`    | On `pass` rows: harmonised team (0 or 1) of the next holder. Set even when `receiver_id` is null (team-only identity). Null when no holder is observed.                                                                      |                                                                              |
| `set_piece`            | `str`     | Restart context for a `pass` event. `open_play` is the in-play default.                                                                                                                                                      | `open_play`, `throw_in`, `kick_off`, `corner_kick`, `free_kick`, `goal_kick` |
| `x_target`             | `int16`   | Target x-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                 |                                                                              |
| `y_target`             | `int16`   | Target y-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                 |                                                                              |

### carry

| Property               | Type      | Description                                                                                                                                                                                                                                                                                                                                                                 | Values                          |
| ---------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows.                                                                                                                                                                                                                                                                           | `head`, `both_hands`, `unknown` |
| `confidence_detection` | `float32` | Detection confidence [0,1].                                                                                                                                                                                                                                                                                                                                                 |                                 |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                                                                                                                                                                                                                                         |                                 |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null).                                                                                                                                                                                                                        |                                 |
| `direction_deg`        | `int16`   | Heading of the carry start → end, degrees in [-180, 180], in the raw pitch frame (0 points toward increasing x). Not attack-relative; rotate with the game's left_start_team to make it so. Null when start/end xy are unavailable.                                                                                                                                         |                                 |
| `length_cm`            | `int32`   | Euclidean distance start → target, in cm (span events).                                                                                                                                                                                                                                                                                                                     |                                 |
| `min_opp_dist_m`       | `float32` | Closest the carrier came to any opponent over the carry span, in metres. Low values indicate the carrier engaged a defender (a take-on). Null when the carrier's identity is unresolved or no opponent was observed on-pitch during the span.                                                                                                                               |                                 |
| `path_length_cm`       | `int32`   | Distance travelled along the carry path, in cm (sum of the actor's frame-to-frame movement over the span). At least length_cm when tracking is dense (a weaving carry exceeds its straight-line distance); can fall below it where the track has gaps, since it sums only observed movement. Null when the actor has no resolved identity or no tracked path over the span. |                                 |
| `x_target`             | `int16`   | Target x-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                                                                                                                                                                |                                 |
| `y_target`             | `int16`   | Target y-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                                                                                                                                                                |                                 |

### shot

| Property               | Type      | Description                                                                                                                                          | Values                          |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows.                                                    | `head`, `both_hands`, `unknown` |
| `confidence_detection` | `float32` | Detection confidence [0,1].                                                                                                                          |                                 |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                  |                                 |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null). |                                 |
| `team_label`           | `int8`    | Team label, harmonised across the match (0 or 1).                                                                                                    |                                 |

### team_possession

| Property         | Type   | Description                                               | Values                     |
| ---------------- | ------ | --------------------------------------------------------- | -------------------------- |
| `team_label`     | `int8` | Team label, harmonised across the match (0 or 1).         |                            |
| `team_side`      | `str`  | Camera-relative side a `team_possession` span belongs to. | `left`, `right`, `unknown` |
| `unknown_reason` | `str`  | Why a span was tagged `team_side='unknown'`.              | `unclear`                  |

### player_possession

| Property              | Type      | Description                                                                                                                                          | Values                 |
| --------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `confidence_identity` | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null). |                        |
| `model_source`        | `str`     | Player-possession source: which model produced the span (`short` / `long` / `mix`).                                                                  | `short`, `long`, `mix` |

### ball_phase

| Property | Type  | Description            | Values                                                           |
| -------- | ----- | ---------------------- | ---------------------------------------------------------------- |
| `phase`  | `str` | Ball-phase span label. | `in_play`, `out_of_bounds`, `in_bounds_stoppage`, `half_kickoff` |

### ball_pitchzone

| Property    | Type  | Description                                        | Values                                               |
| ----------- | ----- | -------------------------------------------------- | ---------------------------------------------------- |
| `pitchzone` | `str` | Pitch-third span label on `ball_pitchzone` events. | `defensive_third`, `middle_third`, `attacking_third` |

### scene

| Property        | Type   | Description                                           | Values |
| --------------- | ------ | ----------------------------------------------------- | ------ |
| `is_analysable` | `bool` | Whether this scene is the main-camera broadcast feed. |        |

### match_timeline

| Property              | Type      | Description                                                                                                                                                                                                                                 | Values                                            |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `period`              | `str`     | Match-period span label. `full_game` is the whole-video extent; `first_half`/`second_half`/`match` are the detected play spans and their envelope.                                                                                          | `full_game`, `first_half`, `second_half`, `match` |
| `timeline_confidence` | `float32` | Confidence [0,1] in a detected `match_timeline` span. High (near 1.0) when a restart anchor and label-free priors agree on the half split; low (near 0.4) for a best-effort fallback boundary. `full_game` is exact (1.0). Null when unset. |                                                   |

### goal

| Property           | Type      | Description                                                                                                                                        | Values                                            |
| ------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `confidence_event` | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                |                                                   |
| `period`           | `str`     | Match-period span label. `full_game` is the whole-video extent; `first_half`/`second_half`/`match` are the detected play spans and their envelope. | `full_game`, `first_half`, `second_half`, `match` |
| `team_label`       | `int8`    | Team label, harmonised across the match (0 or 1).                                                                                                  |                                                   |

### drive

| Property               | Type      | Description                                                                                                                                                                                                                                                                                                                                                                 | Values                          |
| ---------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `body_part`            | `str`     | Which body part contacted the ball. `unknown` is the engine-side placeholder for unmeasured rows.                                                                                                                                                                                                                                                                           | `head`, `both_hands`, `unknown` |
| `confidence_detection` | `float32` | Detection confidence [0,1].                                                                                                                                                                                                                                                                                                                                                 |                                 |
| `confidence_event`     | `float32` | Event [0,1]. Model confidence for this event class.                                                                                                                                                                                                                                                                                                                         |                                 |
| `confidence_identity`  | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null).                                                                                                                                                                                                                        |                                 |
| `direction_deg`        | `int16`   | Heading of the carry start → end, degrees in [-180, 180], in the raw pitch frame (0 points toward increasing x). Not attack-relative; rotate with the game's left_start_team to make it so. Null when start/end xy are unavailable.                                                                                                                                         |                                 |
| `length_cm`            | `int32`   | Euclidean distance start → target, in cm (span events).                                                                                                                                                                                                                                                                                                                     |                                 |
| `min_opp_dist_m`       | `float32` | Closest the carrier came to any opponent over the carry span, in metres. Low values indicate the carrier engaged a defender (a take-on). Null when the carrier's identity is unresolved or no opponent was observed on-pitch during the span.                                                                                                                               |                                 |
| `path_length_cm`       | `int32`   | Distance travelled along the carry path, in cm (sum of the actor's frame-to-frame movement over the span). At least length_cm when tracking is dense (a weaving carry exceeds its straight-line distance); can fall below it where the track has gaps, since it sums only observed movement. Null when the actor has no resolved identity or no tracked path over the span. |                                 |
| `x_target`             | `int16`   | Target x-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                                                                                                                                                                |                                 |
| `y_target`             | `int16`   | Target y-coordinate in cm (corner-origin, same convention as top-level x/y).                                                                                                                                                                                                                                                                                                |                                 |
| `progressive`          | `bool`    | True when the drive moved the ball at least 10 m toward the opponent goal, 5 m when it started in the attacking third, or ended in the opponent box; drives under 5 m never qualify. Null when the attacking direction or the half-time boundary is unknown.                                                                                                                |                                 |
| `take_on`              | `bool`    | True when `min_opp_dist_m` is 1.5 m or less: a take-on attempt, never a verdict on whether the defender was beaten. Null when `min_opp_dist_m` is null.                                                                                                                                                                                                                     |                                 |

## Metadata Field Reference

Enumerated metadata fields across all event types.

### `unknown_reason`

Why a span was tagged `unknown` (currently only set on `team_possession` spans with `team_side='unknown'`).

| Value     | Description                                           |
| --------- | ----------------------------------------------------- |
| `unclear` | Possession classifier confidence was below threshold. |

## Response

```
{
  "start": 125.5,
  "end": 135.5,
  "label": "pass",
  "type": "event_property",
  "player_id": "0-10",
  "team_id": "team_0",
  "team_name": "Home Team"
}
```

| Field       | Type   | Description                                                                                                                                              |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start`     | float  | Start time in seconds                                                                                                                                    |
| `end`       | float  | End time in seconds                                                                                                                                      |
| `label`     | string | The event type. On events without a player (`goal`, `team_possession`, `scene`, `ball_phase`), `"event_type: value"` when the first constraint uses `eq` |
| `type`      | string | Always `"event_property"`                                                                                                                                |
| `player_id` | string | null                                                                                                                                                     |
| `team_id`   | string | null                                                                                                                                                     |
| `team_name` | string | null                                                                                                                                                     |

Events with neither a player nor a team (`scene`, `ball_phase`) return only `start`, `end`, `label` and `type`.

Also returns these data points, documented on the page named in brackets: `body_part` (`events-carry`), `model_source` (`events-player-possession`), `pass_result` (`events-pass`), `pass_type` (`events-pass`), `period` (`events-goal`), `phase` (`events-ball-phase`), `pitchzone` (`events-ball-pitchzone`), `set_piece` (`events-pass`), `team_side` (`events-team-possession`).
