---
source_url: https://docs.aiontheball.nl/versions/v1/concepts/possession/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Possession

Who controls the ball, at team level and at player level.

## Team possession

A [team possession](https://docs.aiontheball.nl/versions/v1/events/team-possession/index.md) span runs until possession transfers to the opponent, the ball goes out of play, or the classifier loses confidence.

The possession split counts only time the ball is in play ([ball phase](https://docs.aiontheball.nl/versions/v1/events/ball-phase/index.md) `in_play`) and credited to a team. `team_0` and `team_1` percentages sum to 100. The match `pct` is calibrated on ground truth: the raw split of the seconds runs a little wide on the side ahead, so `pct` pulls it toward 50/50 and can differ from the ratio of the two `seconds` by a few points. `per_minute` shares stay uncalibrated. Resolve the labels to home/away via [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md). Two figures sit beside the split, in seconds:

| Field                      | Meaning                                                                                                                                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ball_out_of_play_sec`     | Dead-ball time inside the two halves: out of bounds, stoppages, kickoffs. Half-time and the footage before kick-off and after the final whistle do not count. About 4% typical error on broadcast footage; on club-camera footage it reads some 15% high |
| `unattributed_in_play_sec` | Ball in play but credited to neither team: a contested or 50/50 ball, a transition, an aerial duel, or footage the classifier could not read. Left out of the split                                                                                      |

Both are null on analyses without ball-phase spans; the split then uses all team-possession time.

## Player possession

A [player possession](https://docs.aiontheball.nl/versions/v1/events/player-possession/index.md) span is the interval one identified player had the ball. Spans are attributed only when the player was identified, so they are a lower bound. The player's `player_id` follows the format in [Player IDs](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md).

## Where possession appears

| Endpoint                                                                                      | Shape                                                                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Summary](https://docs.aiontheball.nl/versions/v1/endpoints/summary/index.md)                 | `possession.summary`: `{seconds, pct}` per team plus `ball_out_of_play_sec` and `unattributed_in_play_sec`. `possession.per_minute`: one `{minute, team_0_pct, team_1_pct}` entry per video minute, counted from `0` at video start |
| [Events](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md)                   | One row per span, with `start` and `end` in seconds and `event_type` of `team_possession` or `player_possession`. A gap between two rows is a moment credited to no team                                                            |
| [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md) | The `team_possession` and `player_possession` filters select intervals by holder                                                                                                                                                    |
| [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md) | The [`possession_change`](https://docs.aiontheball.nl/versions/v1/filters/possession-change/index.md) filter returns the moments a team won or lost the ball, as zero-length intervals                                              |
| [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md)     | `on_ball.involvement` counts one player's spans; `position.heatmap_with_ball` restricts to frames the player's team held the ball                                                                                                   |

`team_possession` and `player_possession` filters match during replays as well as live play. Combine them with a `scene` filter of `is_analysable: true` to restrict a query to gameplay.
