---
source_url: https://docs.aiontheball.nl/versions/v1/events/player-possession/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Player Possession

A continuous span over which one specific player is the active ball-carrier. Distinct from `team_possession`: a single team-possession span typically contains many player-possession spans as the ball moves between teammates.

Category: Possession

## Properties

| Property              | Type      | Description                                                                                                                                          | Values                 |
| --------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `confidence_identity` | `float32` | Identity confidence [0,1]. Null for non-actor events and for rows where the jersey/player_id was not resolved (team-only actor rows have this null). |                        |
| `model_source`        | `str`     | Player-possession source: which model produced the span (`short` / `long` / `mix`).                                                                  | `short`, `long`, `mix` |

## Property Values

### `model_source`

Deprecated (experimental, not vetted): carries no information since engine 0.5.59, when one ball-touch model replaced the two player-possession models, `mix` on every span of 0.5.59-0.5.62 runs, null from 0.5.63 on. Only older runs say which retired model produced the span. Don't filter or slice quality on it; it will be removed.

| Value   | Description                                                                        |
| ------- | ---------------------------------------------------------------------------------- |
| `short` | Old runs only. Span produced by the retired short-horizon player-possession model. |
| `long`  | Old runs only. Span produced by the retired long-horizon player-possession model.  |
| `mix`   | Old runs only. Both retired models contributed within the span.                    |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    { "type": "player_possession", "players": ["0-10"] }
  ]
}
```

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0002-7002-8000-000000000002",
  "start": 125.5,
  "end": 126.1,
  "label": "0-10",
  "event_type": "player_possession",
  "team_id": "team_0",
  "timeline_confidence": null
}
```

`label` is the player ID.
