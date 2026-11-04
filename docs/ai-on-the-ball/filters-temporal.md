---
source_url: https://docs.aiontheball.nl/versions/v1/filters/temporal/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Temporal & State Filters

Filter by match period, scene type and possession.

## Match Timeline

Time inside a match period.

```
{
  "type": "match_timeline",
  "periods": ["second_half"]
}
```

| Parameter | Type   | Required | Description                                                                                                                                                                                                                                                                 |
| --------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | string | Yes      | `"match_timeline"`                                                                                                                                                                                                                                                          |
| `periods` | array  | Yes      | Periods to include: `first_half`, `second_half`, `match`, `full_game`. `full_game` is the whole video, pre-match footage and half-time included. `match` runs from the first-half kickoff to the end of the second half. Asking for `full_game` also returns the two halves |

From analysis version `0.5.45` the engine emits the halves and `match` when it locates them. On older analyses, and when the engine abstains, `first_half` and `second_half` are derived by the analysis service from the moment the teams changed ends, the same detection the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) normalises its coordinates on, snapped to the kickoff that restarted play, and `match` returns nothing. The half-time break falls outside both halves. Extra time periods are not supported.

Warning

When neither source locates the change of ends, on a video holding more than one match or with too little tracking, the half periods return no intervals rather than a guess. An `AND` query containing one then returns nothing.

## Scene

Time classified as analysable gameplay, or the footage that is not.

```
{
  "type": "scene",
  "is_analysable": true
}
```

| Parameter       | Type    | Required | Description                                                                                                           |
| --------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `type`          | string  | Yes      | `"scene"`                                                                                                             |
| `is_analysable` | boolean | No       | `true` returns live play and set pieces, `false` returns replays, graphics, crowd shots and half-time. Default `true` |

Broadcast footage contains replays of events. Add this filter with `is_analysable: true` under `AND` to hold results to live play.

## Team Possession

Time a team controls the ball.

```
{
  "type": "team_possession",
  "teams": ["team_0"]
}
```

| Parameter | Type   | Required | Description                                                                              |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `type`    | string | Yes      | `"team_possession"`                                                                      |
| `teams`   | array  | Yes      | `team_0`, `team_1`, or both. Listing both returns the time either team was in possession |

`team_0` and `team_1` are the engine's shirt-cluster labels and carry no side or home/away meaning. Resolve them with `GET /analyses/{id}/team-mapping` or the `team_zero` field on the video, then filter on the resolved label. See [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md).

Each interval is labelled with the team name from the analysis metadata, falling back to `team_0` or `team_1` when the analysis carries no name.

Gaps between intervals are time without a resolved holder: ball out of play, contested or transitional possession, or non-analysable footage.

## Player Possession

Time one of the listed players controls the ball.

```
{
  "type": "player_possession",
  "players": ["0-10", "0-9"]
}
```

| Parameter | Type   | Required | Description                                                                                                                         |
| --------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | string | Yes      | `"player_possession"`                                                                                                               |
| `players` | array  | Yes      | [Player IDs](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md). Any listed player matching returns the interval |

Each interval is labelled with the id of the player who held the ball. Analyses whose possession events carry no player attribution return no intervals.

This filter tests identified control of the ball. [Player Ball Proximity](https://docs.aiontheball.nl/versions/v1/filters/spatial/#player-ball-proximity) tests physical distance to it.
