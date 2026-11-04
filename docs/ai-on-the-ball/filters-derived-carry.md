---
source_url: https://docs.aiontheball.nl/versions/v1/filters/derived-carry/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Derived Carry Filters

Two filters classify `carry` events by properties the API computes from the carry geometry and the team's attacking direction. Both return carry intervals with the actor fields (`player_id`, `team_id`, `team_name`) and, when requested, pitch coordinates. Both require v3 data. `take_on_candidate` requires engine `0.5.45` or later.

Both filters apply to every carry, whatever its length. For coach-facing counts and clips use the [`drive`](https://docs.aiontheball.nl/versions/v1/events/drive/index.md) event: carries of at least 3 m carrying the same two classifications as `progressive` and `take_on`, queried with the [event_property filter](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md):

```
{
  "type": "event_property",
  "event_type": "drive",
  "properties": [{ "field": "progressive", "eq": true }]
}
```

## Progressive carry

Carries that moved the ball toward the opponent goal, by the FBref/Opta standard. A carry is progressive when it advances at least 10 m toward the opponent goal, or at least 5 m when it starts in the attacking third, or it ends inside the opponent penalty box. Carries shorter than 5 m never qualify.

```
{
  "type": "progressive_carry",
  "teams": ["team_0"],
  "players": ["0-10"]
}
```

| Parameter | Type            | Required | Description                                             |
| --------- | --------------- | -------- | ------------------------------------------------------- |
| `players` | `array \| null` | No       | Restrict to these player ids.                           |
| `teams`   | `array \| null` | No       | Restrict to these teams. Ignored when `players` is set. |

Progress toward goal needs the team's attacking direction, taken from the same source the [player report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) uses. Results carry the label `progressive_carry`.

Warning

When the run's attacking direction is unknown, the filter returns no intervals rather than guessing. The direction comes from the video's `left_start_team` (the confirm-sides answer when one was given), else the engine's game meta, else the tracking side signal. When the half boundary is unknown, the first-half direction is applied to the whole match, so second-half carries are scored toward the wrong goal.

## Take-on candidate

Carries that engaged a defender: the carrier came within a threshold distance of an opponent during the carry. This marks a carry as a candidate take-on. It is not a claim that the defender was beaten. The engine does not grade take-on success.

```
{
  "type": "take_on_candidate",
  "teams": ["team_0"],
  "max_opp_dist_m": 1.5
}
```

| Parameter        | Type            | Unit | Required | Description                                                                  |
| ---------------- | --------------- | ---- | -------- | ---------------------------------------------------------------------------- |
| `players`        | `array \| null` |      | No       | Restrict to these player ids.                                                |
| `teams`          | `array \| null` |      | No       | Restrict to these teams. Ignored when `players` is set.                      |
| `max_opp_dist_m` | `float \| null` | m    | No       | Closest-approach distance that counts as engaging a defender. Default `1.5`. |

The threshold reads the carry's `min_opp_dist_m` metadata. A lower value selects tighter engagements: `1.5` recovers more take-ons, `1.0` fewer but purer. Results carry the label `take_on_candidate`.

## Progressive pass

Passes that moved the ball toward the opponent goal, by the same rule as [progressive carry](#progressive-carry): at least 10 m toward the opponent goal, or at least 5 m when the pass starts in the attacking third, or ending inside the opponent penalty box. Passes shorter than 5 m never qualify.

```
{
  "type": "progressive_pass",
  "teams": ["team_0"]
}
```

| Parameter | Type            | Required | Description                                             |
| --------- | --------------- | -------- | ------------------------------------------------------- |
| `players` | `array \| null` | No       | Restrict to these player ids.                           |
| `teams`   | `array \| null` | No       | Restrict to these teams. Ignored when `players` is set. |

Passes with `pass_result` `incomplete` or `out` are left out. Passes without a `pass_result` count, and the field is not currently populated, so results are attempted passes. Results carry the label `progressive_pass`.

Warning

When the run's attacking direction or half boundary is unknown, the filter returns no intervals.

## Zone entry

Passes and carries that start outside a zone and end inside it, in the actor's attacking direction.

**Experimental:** on measured broadcast matches this returns about 40 % fewer entries than the ball makes while the team has it. Use it to find clips, not as a count.

```
{
  "type": "zone_entry",
  "zone": "final_third",
  "via": "pass",
  "teams": ["team_0"]
}
```

| Parameter | Type            | Required | Description                                                                                      |
| --------- | --------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `zone`    | string          | Yes      | `final_third` (the third nearest the opponent goal) or `penalty_box` (the opponent penalty box). |
| `via`     | string          | No       | `pass`, `carry` or `any`. Default `any`.                                                         |
| `players` | `array \| null` | No       | Restrict to these player ids.                                                                    |
| `teams`   | `array \| null` | No       | Restrict to these teams. Ignored when `players` is set.                                          |

A pass or carry that starts inside the zone is not an entry. Passes with `pass_result` `incomplete` or `out` are left out. Results carry the label `final_third_entry` or `penalty_box_entry`.

Warning

When the run's attacking direction or half boundary is unknown, the filter returns no intervals.
