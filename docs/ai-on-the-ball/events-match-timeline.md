---
source_url: https://docs.aiontheball.nl/versions/v1/events/match-timeline/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Match Timeline

A set of spans that place the match on the frame timeline, so every other event can be read against periods of play rather than raw frame numbers.

Category: Structure

## Properties

| Property              | Type      | Description                                                                                                                                                                                                                                 | Values                                            |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `period`              | `str`     | Match-period span label. `full_game` is the whole-video extent; `first_half`/`second_half`/`match` are the detected play spans and their envelope.                                                                                          | `full_game`, `first_half`, `second_half`, `match` |
| `timeline_confidence` | `float32` | Confidence [0,1] in a detected `match_timeline` span. High (near 1.0) when a restart anchor and label-free priors agree on the half split; low (near 0.4) for a best-effort fallback boundary. `full_game` is exact (1.0). Null when unset. |                                                   |

## Property Values

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    { "type": "match_timeline", "periods": ["full_game"] }
  ]
}
```

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0004-7004-8000-000000000004",
  "start": 737.48,
  "end": 3512.48,
  "label": "first_half",
  "event_type": "match_timeline",
  "team_id": null,
  "timeline_confidence": 0.9
}
```

`label` is the period name. `full_game` is always emitted and spans the whole video. From analysis version `0.5.45` `first_half`, `second_half` and `match` are emitted too when the engine locates the halves; otherwise only `full_game` is.

Also returns these data points, documented on the page named in brackets: `period` (`events-goal`).
