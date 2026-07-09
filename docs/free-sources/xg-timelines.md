# xG Timeline Recipes

Use an xG timeline when the product question is "when did each team create
danger?" rather than only "what was the final xG total?". The chart should be a
cumulative step view built from shot-level xG rows plus match-state annotations.

## Required shot fields

Normalise provider shots into one row per shot before building the timeline:

| Field | Required | Notes |
|---|---|---|
| `minute` | yes | Regular match minute; exclude shots without a usable time |
| `second` | optional | Tie-breaker within a minute when available |
| `added_time` | optional | Preserve stoppage time for labels such as `45+2` |
| `period` | optional | Needed for extra-time guides and precise halftime handling |
| `team_id` | yes | Must resolve to home or away team |
| `player_name` | optional | Tooltip/label only |
| `xg` | yes | Provider/model xG value for the shot |
| `outcome` | optional | Goal, saved, post, missed, blocked, etc. |
| `is_penalty` | optional | Useful for filters or marker styling |
| `shot_id` | optional | Stable ordering and deduplication |
| `xg_model` | yes | `understat`, `statsbomb`, `opta`, or another named model |

Do not mix xG models silently. Understat, StatsBomb, Opta, and FBref/Opta values
come from different models and can disagree for the same shot. If a story blends
or compares models, expose the model name in the data and chart notes.

## Source-specific inputs

| Source | Timeline inputs |
|---|---|
| Understat | `minute`, `X`, `Y`, `xG`, `result`, `h_a`, `player`, `situation`, `shotType` |
| StatsBomb | shot event `minute`/`second`, `team`, `shot.statsbomb_xg`, `shot.outcome`, `shot.type`, `shot.body_part` |
| Opta / WhoScored-style events | shot event types `13`-`16`, xG qualifier where licensed, body-part/context qualifiers, goal-mouth qualifiers where available |
| FBref | season/match aggregates only; not enough for a shot-by-shot timeline |

For Opta-derived feeds, distinguish shot outcomes from score attribution. Type
`16` with own-goal qualifier `28` should update the score for the opposing team,
not the event contestant. Disallowed goals should be marked but should not change
the running scoreline.

## Cumulative step construction

Sort shots by period, minute, second, and a stable shot id if available. For each
shot, add the current xG value only to the shooting team's cumulative total and
carry the other team's total forward:

```text
home_cum_xg_after_shot =
  previous_home_cum_xg + (shot.team_id == home_team_id ? shot.xg : 0)
away_cum_xg_after_shot =
  previous_away_cum_xg + (shot.team_id == away_team_id ? shot.xg : 0)
```

Render the lines as steps, not smoothed curves. A shot changes the value at a
specific match moment; smoothing implies chance quality accrued continuously.

For a static chart, emit enough points to draw flat sections:

```text
(time_before_shot, previous_total)
(shot_time, previous_total)
(shot_time, new_total)
```

This keeps long quiet periods visible and avoids diagonal interpolation between
unrelated shots.

## Match-time guides

Add guide marks from match structure, not from shot distribution:

| Guide | Typical position |
|---|---|
| halftime | 45 minutes |
| full time | 90 minutes |
| extra-time halftime | 105 minutes |
| extra-time full time | 120 minutes |

If stoppage-time placement is flattened into minute values, say so in the output
or chart notes. Do not invent precise stoppage-time spacing when the source only
has minute-level timing.

## Running score strip

A score strip helps readers connect chance quality to actual goals. Build it from
goal events, not from xG values:

| Case | Score handling |
|---|---|
| normal goal | increment scoring team |
| own goal | increment the opponent of the event contestant when the provider encodes own goals that way |
| penalty goal | increment scoring team and optionally style the marker |
| disallowed goal | annotate separately; do not increment score |
| shootout penalty | keep outside the regular xG timeline unless the chart explicitly covers shootouts |

Keep goal markers visually distinct from all-shot dots. A goal is an outcome, not
a larger xG value.

## Sparse and empty matches

The fallback behaviour should be honest:

| Input state | Recommended output |
|---|---|
| no shots with xG | empty state; do not invent a flat 0-0 narrative |
| one team's shots only | that team's step line plus a flat zero baseline for the opponent |
| very sparse match | preserve the stepped geometry and show the low-event nature |
| missing team assignment | exclude the affected shot and record a data-quality warning |
| missing xG value | exclude from xG totals or render as an unvalued shot marker, but do not add `0` silently |

## Data contract for agents

When generating data for a reusable xG timeline, include:

- `match_id`, `home_team_id`, `away_team_id`;
- a sorted `shots[]` array with raw provider id where available;
- `xg_model` and provider/source for every xG value;
- `score_events[]` for running score reconstruction;
- `time_guides[]` for halftime/full-time/extra-time markers;
- `data_quality[]` warnings for excluded shots, missing xG, missing teams, or
  source/model mismatches.
