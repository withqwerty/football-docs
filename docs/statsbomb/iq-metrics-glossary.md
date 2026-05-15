---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: null
crawled_at: null
---

# StatsBomb IQ Metrics Glossary

Definitions of the derived metrics that recur across the StatsBomb commercial
stats endpoints (`player-match-stats`, `player-season-stats`,
`team-match-stats`, `team-season-stats`) and, for OBV/xG, the Events feed.
These concepts are referenced by many column names — read this alongside the
per-endpoint catalogues.

These metrics are commercial-only unless noted. OBV and the xG-decomposition
fields also appear on individual events; everything else is delivered
pre-aggregated by the stats endpoints.

## On-Ball Value (OBV)

OBV models the change in the likelihood of scoring/conceding caused by an event,
expressed in expected-goal-difference units.

On an **event** (Events v8) it appears decomposed as:
- `obv_for_after` / `obv_for_before` — probability of scoring within the
  possession chain after / before the event.
- `obv_for_net` — net change in scoring likelihood from the event.
- `obv_against_after` / `obv_against_before` / `obv_against_net` — same for the
  likelihood of conceding in the next possession chain.
- `obv_total_net` — net change in expected goal difference (scoring change minus
  conceding change) over the next two possession chains.

OBV is only populated where the sequence of play is not interrupted by off-ball
events. Event types eligible for OBV: Carry, Ground/High/Low Pass, Dribble,
Shot, Goalkeeper Collection, Block, Tackle, Interception, Clearance, Goalkeeper
Sweep, Goalkeeper Save, Foul Committed, Goalkeeper Concede.

In the **stats** endpoints OBV is aggregated and split by action family:
`*_obv` (total), `*_obv_pass`, `*_obv_shot`, `*_obv_defensive_action`,
`*_obv_dribble_carry`, `*_obv_gk`. Team stats add `*_obv_*_conceded` (opponent
OBV). Season uses `_90` / `_pg` suffixes.

## xGChain and xGBuildup

Both attribute the xG of a possession's final shot to **every player involved in
that possession**, not just the shooter/assister.

- **xGChain** — credits all players who touched the ball during a possession
  that ended in a shot, with the shot's xG.
- **xGBuildup** — the same, but **excludes** the shooter and the assisting
  (key) pass, isolating contribution to build-up play prior to the chance.

Variants across the stats endpoints: `xgchain` / `xgbuildup`, `op_*` (open play
only), `*_per_possession`, and `_90` / `_pg` season forms.

## xG, npxG, xA and combined measures

- `np_xg` — non-penalty expected goals (xG excluding penalty shots).
- `np_xg_per_shot` — shot-quality proxy: average npxG per shot taken.
- `xa` / `op_xa` / `sp_xa` — expected assists: the xG of the shot a player's
  pass set up (all / open play / set piece).
- `npxgxa` (season) — non-penalty xG + xA combined goal contribution.
- `over_under_performance` (season) — actual goal contribution minus expected
  (xG+xA): finishing/creation over- or under-performance.
- `conversion_ratio` / `penalty_conversion_ratio` — % of (non-penalty / penalty)
  shots converted to goals.

## Post-Shot xG (PSxG) and goalkeeping value

PSxG models goal probability **after** the shot is struck, using placement and
velocity — only defined for on-target, unblocked shots. Used to value
goalkeeping.

- `np_psxg` — non-penalty PSxG earned from a player's on-target shots.
- `npot_psxg_faced` / `np_psxg_faced_90` — non-penalty on-target PSxG faced by a
  goalkeeper.
- `gsaa` (Goals Saved Above Average) — goals the keeper saved/conceded versus
  expectation (PSxG faced minus goals conceded). `gsaa_ratio` expresses it as a
  share of shots faced. `xs_ratio` (season) — expected save % given PSxG faced.
- `save_ratio` — % of on-target shots saved.
- `gk_positioning_error` / `np_optimal_gk_dlength` — average distance of the
  keeper from the modelled optimal position for facing a shot.
- `da_aggressive_distance` — average distance from goal at which the keeper
  performs defensive actions (sweeping tendency).
- `ccaa` / `clcaa` — Claimable Collection Attempts over Average: how often the
  keeper attempts to claim a claimable pass vs the average keeper.
- `claim_success` — % of claim attempts that succeed.
- `goals_conceded` (player-match) — goals conceded by the keeper, excluding
  penalties and own goals.

The Events v8 shot object decomposes shot xG into: `statsbomb_xg` (chance
quality — pre-strike situation including GK/defender positions),
`shot_execution_xg` (incorporates placement & velocity),
`shot_execution_xg_uplift` (`shot_execution_xg − statsbomb_xg`; can be
negative), `gk_save_difficulty_xg` (renamed from `statsbomb_xg2`; difficulty for
the keeper given placement/velocity/position), `gk_positioning_xg_suppression`
and `gk_shot_stopping_xg_suppression` (threat suppressed by keeper positioning /
shot-stopping). See `xg-model.md`.

## PPDA — Passes Per Defensive Action

`ppda` (team stats) — how many passes a team allows the opponent before making a
defensive action (tackle, interception, foul). Lower = more intense pressing.
StatsBomb defines it in attacking areas: from 40% of pitch length away from the
pressing team's own goal and forward. `defensive_distance_ppda` is the average
distance from a team's own goal at which it makes those defensive actions.

## Pressing and counterpressing

- `pressures` — times a player/team pressures an opponent in possession.
- `counterpressures` — pressures within 5 seconds of the team losing the ball
  (an open-play turnover).
- `pressure_regains` / `counterpressure_regains` /
  `defensive_action_regains` — ball won back within 5 seconds of a pressure /
  counterpressure / any defensive action.
- `pressured_action_fails` / `counterpressured_action_fails` — opponent actions
  forced to fail under (counter)pressure.
- `aggressive_actions` — tackles, pressures and fouls within 2 seconds of an
  opposition ball receipt. `aggression` — the proportion of an opponent's pass
  receipts so contested.
- `fhalf_*` — restricted to the opposition (final) half of the pitch;
  `fhalf_*_ratio` expresses it as a share of the player's/team's total.
- `defensive_distance` — average distance from a team's own goal at which it
  makes defensive actions (higher = higher defensive line / more proactive).

## Possession-adjusted defensive metrics (padj_*)

`padj_clearances`, `padj_interceptions`, `padj_pressures`, `padj_tackles`,
`padj_tackles_and_interceptions` (season, per-90) — raw counts adjusted
proportionally to the team's possession volume, so low-possession teams' high
raw defensive counts are normalised for fair cross-team comparison.

## Progression and territory

- `deep_progressions` — passes, dribbles and carries into the opposition final
  third.
- `deep_completions` — successful passes within ~20 m of the opposition goal.
- `passes_into_box` / `op_passes_into_box` — successful passes into the box from
  outside it (all / open play).
- `passes_inside_box` — passes completed both starting and ending in the box.
- `directness` (team) — distance gained towards goal during a shot-ending
  possession divided by total distance travelled in the build-up (1.0 = perfectly
  direct).
- `pace_towards_goal` (team) — average build-up speed (m/s) from start of
  possession to shot, for shot-ending possessions.
- `pass_length` family — `s_pass_length` (avg completed), `p_pass_length` /
  `ps_pass_length` (under pressure), `pass_length_ratio` (completed length ÷
  attempted length), `pressured_change_in_pass_length`.
- Pass-direction proportions (season) — `forward_pass_proportion`,
  `backward_pass_proportion`, `sideways_pass_proportion` (and `op_f3_*`
  variants). Direction is defined by radian arcs of the pass-angle circle:
  forwards = 11π/6→π/6, backwards = 5π/6→7π/6, sideways = the two remaining
  arcs, where angle 0 = no change in y (towards the opponent goal line).

## Line-Breaking Passes (LBP) — requires 360 data

A pass is line-breaking when it crosses a defensive line (a row of sufficiently
close defenders) and makes enough progression toward the centre of the goal.
360 data also carries this as a per-event `line_breaking_pass` boolean. The
stats endpoints expose a large LBP suite:

- `lbp` / `lbp_completed` / `lbp_ratio` — attempted / completed / success %.
- `fhalf_*` and `f3_*` — restricted to opposition half / final third.
- `obv_lbp` — pass-OBV from line-breaking passes.
- `lbp_received` — line-breaking passes received.
- `lbp_to_space_{2,5,10}` — completed LBPs whose recipient had >2/5/10 m of
  space; `*_received` variants; `average_lbp_to_space_distance` /
  `*_received_distance` — average space of the recipient.

These (and the `ball_receipts_in_space_{2,5,10}`,
`average_space_received_in`, `*_passes_360`, `*_ball_receipts_360`,
`360_minutes`) metrics are derived from 360 data and only populated for matches
that have it. **Per-90 conversion for 360-derived season metrics uses
`player_season_360_minutes` / `team_season` 360 minutes, not the standard
minutes field** — see `player-season-stats.md`.

## Ball receipts in space (360)

- `average_space_received_in` — average value of space for all ball receipts
  (`fhalf_` / `f3_` variants for opposition half / final third).
- `ball_receipts_in_space_{2,5,10}` — share of ball receipts made with more than
  2/5/10 m of space. The 5 m set is a subset of the 2 m set; the 10 m set is a
  subset of both.

## Outcome / involvement scores

- `positive_outcome_score` — how frequently the player is involved, while on the
  pitch, in sequences that resolve with a positive outcome (a shot, a free kick
  in the attacking half, or a corner).
- `positive_outcome` (season count) — possessions that connected through the
  player and ended in such an outcome.
- `defensive_actions` — tackles, pressure events and fouls recorded
  (`_90` per-90 in season).
- `shot_touch_ratio` — shots taken as a proportion of touches.
- `challenge_ratio` — % of duels entered where the player makes a tackle rather
  than being dribbled past. `dribble_faced_ratio` — % of faced dribbles that
  were stopped.
- `change_in_passing_ratio` (season) — pressured pass % minus overall pass %.

## Set-piece breakdown (team stats)

Team stats split attacking and conceding output by set-piece type: `corner`,
`free_kick` (indirect), `direct_free_kick`, `throw_in`, and aggregate `sp`.
For each: counts, `*_xg`, `xg_per_*`, `shots_from_*`, `goals_from_*`, and
`*_shot_ratio` / `*_goal_ratio`, each with a `_conceded` mirror. Also
`counter_attacking_shots` (shots within 15 s of a possession from own half),
`high_press_shots` (shots from possessions won within 5 s of a defensive action
in the opposition half), `shots_in_clear` (only the keeper between shooter and
goal) — all with `_conceded` mirrors.

## Suffix conventions

- `op_` — open play only (excludes set pieces).
- `np_` — non-penalty (excludes penalty shots/goals).
- `sp_` — set piece only.
- `fhalf_` — opposition (final) half of the pitch.
- `f3_` — final third.
- `padj_` — possession-adjusted.
- `_90` — per 90 minutes (player-season; uses `360_minutes` for 360 metrics).
- `_pg` — per game (team-season).
- `_conceded` — the value allowed to/by the opponent (team stats).
- `*_ratio` — a percentage or proportion.
