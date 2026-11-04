---
source_url: https://docs.aiontheball.nl/versions/v1/filters/possession-change/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Possession Change Filter

The `possession_change` filter returns the moments a team won or lost the ball. Requires v3 data.

```
{
  "type": "possession_change",
  "teams": ["team_0"],
  "direction": "lost",
  "context": "open_play",
  "zone": "defensive_third"
}
```

| Parameter            | Type             | Unit | Required | Description                                                                                 |
| -------------------- | ---------------- | ---- | -------- | ------------------------------------------------------------------------------------------- |
| `direction`          | string           |      | Yes      | `won` or `lost`                                                                             |
| `teams`              | `array \| null`  |      | No       | The team the question is about: `team_0`, `team_1`, or both. Default both                   |
| `context`            | string           |      | No       | `any`, `open_play` or `restart`. Default `any`                                              |
| `zone`               | `string \| null` |      | No       | `defensive_third`, `middle_third` or `attacking_third`. Default any zone                    |
| `max_unknown_gap_ms` | integer          | ms   | No       | Longest gap without a known holder that still counts as a change, `0-10000`. Default `3000` |

## Rules

- A change is the start of a team's [`team_possession`](https://docs.aiontheball.nl/versions/v1/filters/temporal/#team-possession) interval when the previous known interval belongs to the other team. Team 0 losing the ball and team 1 winning it are the same moment.
- When the two intervals are separated by time without a known holder, the change counts only if that gap is at most `max_unknown_gap_ms`. A longer gap returns no change.
- Intervals on either side of half time are never a change.
- Each result is a zero-length interval at the change. `pad_sec` turns it into a clip.
- `context: restart` keeps changes within 2 s of a stoppage in the `ball_phase` event (`out_of_bounds`, `in_bounds_stoppage`, `half_kickoff`). `open_play` keeps the rest. Both return no intervals when the analysis has no `ball_phase` events.
- `zone` is the third of the pitch the ball was in at the change, seen from the attacking direction of the team in `teams`. `won` with `attacking_third` returns high regains. `lost` with `defensive_third` returns losses near the team's own goal.

Results carry the label `possession_won` or `possession_lost`. `team_id` and `team_name` are the team in `teams`, and `player_id` is null. With `include_pitch_coords`, `x` and `y` are the ball position at the change. They are null when no ball was detected within 1 s.

Warning

With `zone` set, the filter returns no intervals when the attacking direction or the half boundary is unknown. A change without a detected ball within 1 s is left out.
