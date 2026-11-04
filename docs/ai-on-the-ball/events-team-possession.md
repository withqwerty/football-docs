---
source_url: https://docs.aiontheball.nl/versions/v1/events/team-possession/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Team Possession

A continuous span over which one team is in possession of the ball. Ends when possession transfers to the opponent, the ball goes out of play, or the underlying classifier loses confidence (`team_side = 'unknown'`).

Category: Possession

## Properties

| Property         | Type   | Description                                               | Values                     |
| ---------------- | ------ | --------------------------------------------------------- | -------------------------- |
| `team_label`     | `int8` | Team label, harmonised across the match (0 or 1).         |                            |
| `team_side`      | `str`  | Camera-relative side a `team_possession` span belongs to. | `left`, `right`, `unknown` |
| `unknown_reason` | `str`  | Why a span was tagged `team_side='unknown'`.              | `unclear`                  |

## Property Values

### `team_side`

A continuous span over which one team is in possession of the ball. Ends when possession transfers to the opponent, the ball goes out of play, or the underlying classifier loses confidence (`team_side = 'unknown'`).

| Value     | Description                                                                                  |
| --------- | -------------------------------------------------------------------------------------------- |
| `left`    | Camera-relative left side of the pitch.                                                      |
| `right`   | Camera-relative right side of the pitch.                                                     |
| `unknown` | Possession classifier had low confidence. Pair with `metadata.unknown_reason` for the cause. |

### `unknown_reason`

Why a span was tagged `unknown` (currently only set on `team_possession` spans with `team_side='unknown'`).

| Value     | Description                                           |
| --------- | ----------------------------------------------------- |
| `unclear` | Possession classifier confidence was below threshold. |

## Querying

Request body for [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

```
{
  "filters": [
    { "type": "team_possession", "teams": ["team_0"] }
  ]
}
```

## Response

Shape of this event type in the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) response.

```
{
  "event_id": "06a0765b-0001-7001-8000-000000000001",
  "start": 125.5,
  "end": 135.5,
  "label": "FC Example",
  "event_type": "team_possession",
  "team_id": "team_0",
  "timeline_confidence": null
}
```

`label` is the team name and may change when team identity resolves. Key on `team_id`.
