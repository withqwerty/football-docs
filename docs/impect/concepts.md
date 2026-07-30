---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
---

# Impect Concepts: Packing, pxT and KPIs

Impect's analytics rest on two signature ideas — **Packing** (counting the
opponents an action takes out of the game) and **pxT** (Packing Expected Threat,
a possession-value model built on top of it). Both are grounded in the packing
zones described in [coordinate-system.md](coordinate-system.md).

Definitions here come from the
[open-data repository](https://github.com/ImpectAPI/open-data): its
`Documentation.pdf` appendices and `data/kpi_definitions.json`. Quoted text is
Impect's own. Data source: **Impect**.

## Packing — bypassing opponents

An opponent is **bypassed** when an action moves the ball past them:

> An opponent is bypassed if, after a pass or dribbling, they are further away
> from their goal than the ball and is therefore no longer able to defend the
> goal.

The event field `opponents` counts the opponents still able to defend — those
whose radial distance to their own goal is smaller than the ball's. `BYPASSED_*`
KPIs then express how many were taken out.

The metric splits three ways, and confusing them is the most common Impect
mistake:

| Distinction | KPIs | What it counts |
|---|---|---|
| Opponents vs defenders | `BYPASSED_OPPONENTS` vs `BYPASSED_DEFENDERS` | *Defenders* are only the last five outfield players closest to their own goal, so a through-ball to a striker can bypass all 5 defenders |
| Passer vs receiver | `BYPASSED_OPPONENTS` vs `BYPASSED_OPPONENTS_RECEIVING` | The receiving variant credits the same bypassed opponents "from the perspective of the receiver" — movement and positioning rather than passing |
| Sum vs count | `BYPASSED_OPPONENTS` vs `BYPASSED_OPPONENTS_NUMBER` | The first sums opponents bypassed; the second counts the *actions* that bypassed anyone |

Impect frames bypassed opponents as measuring "ball progression, offensive
game-play, verticality" — the alternative to possession and pass-count metrics.

Related: `BYPASSED_OPPONENTS_MIDFIELD` (bypassed midfielders), the
`*_WO_VERIFICATION` / `*_RAW` variants, and `REVERSE_PLAY_*` for actions that add
opponents back in front of the ball.

## pxT — Packing Expected Threat

pxT is Impect's possession-value model. Impect describes it as quantifying goal
threat from three attributes:

1. distance to goal,
2. number of opponents between the ball and the goal,
3. pressure on the player with the ball.

It is a **Markov model trained on over 50 million events**, assigning state values
that express the goal-scoring potential of a game situation. What differentiates
it from position- or action-based possession-value models is that it accounts for
pressure and opponent positioning, and it credits a team's goal threat even while
the opponent has the ball.

### On the event

Every event carries `pxT` as `{team, opponent}`:

| Field | Meaning |
|---|---|
| `team` | The goal threat of the team **on** the ball |
| `opponent` | The goal threat of the team **off** the ball |

Both are derived from the same model.

### The offensive identity

The offensive pxT model is anchored to Post-Shot xG: all goal-threat changes sum
to a team's total Post-Shot xG.

```
ΔPXT = POSTSHOT_XG
     = PXT_PASS + PXT_DRIBBLE + PXT_SETPIECE + PXT_SHOT + PXT_BALL_WIN
     + PXT_FOUL + PXT_BLOCK + PXT_FOULED + PXT_PASSIVE + PXT_NOVIDEO + PXT_OTHER
```

### The defensive identity

The defensive model attributes responsibility to defenders based on packing
zones, valuing both active and passive contributions to reducing goal threat.
Total threat conceded equals the opponent's Post-Shot xG:

```
ΔDEF_PXT = OPP.POSTSHOT_XG
         = DEF_PXT_PASS + DEF_PXT_DRIBBLE + DEF_PXT_SETPIECE + DEF_PXT_SHOT
         + DEF_PXT_BALL_WIN + DEF_PXT_BALL_LOSS + DEF_PXT_BLOCK + DEF_PXT_FOUL
         + DEF_PXT_ACTIVE + DEF_PXT_NOVIDEO + DEF_PXT_OTHER
```

> **Name mismatch.** The identities above are printed with `PXT_NOVIDEO`, but the
> actual KPI name in `kpi_definitions.json` is **`PXT_NO_VIDEO`** (id 1411). The
> defensive one really is `DEF_PXT_NOVIDEO` (id 1528). Resolve by ID, not by
> transcribing the formula.

### Player-level caveat

Impect recommends excluding these from player-level aggregation, because they
cannot be attributed to an individual:

`PXT_NO_VIDEO` · `PXT_OTHER` · `DEF_PXT_SHOT` · `DEF_PXT_NOVIDEO` · `DEF_PXT_OTHER`

They remain valid at team level, where they are needed for the identities to sum.

### Phase-split pxT

Four KPIs split a player's influence by whether their team was attacking or
defending at the time:

| KPI | Measures |
|---|---|
| `PXT_ATTACK` | Impact on own goal threat while the team is attacking |
| `PXT_DEFEND` | Impact on own goal threat while the team is defending |
| `DEF_PXT_ATTACK` | Impact on the opponent's goal threat while the team is attacking |
| `DEF_PXT_DEFEND` | Impact on the opponent's goal threat while the team is defending |

`PXT_PASSIVE` and `DEF_PXT_ACTIVE` capture the complementary idea: threat that
changes without the player acting on the ball, distributed by Impect's
responsibility model.

## The three expected-goals flavours

Impect ships three distinct xG metrics. They are not interchangeable:

| KPI | Covers | Key property |
|---|---|---|
| `SHOT_XG` (82) | All shot attempts — open play, direct free kicks, penalties | Pre-shot. Parameters include distance, angle, pressure, opponents between ball and goal, body part and match situation |
| `PACKING_XG` (83) | All potential shooting positions, **whether or not a shot is taken** | Non-shot xG. Credits a team for reaching dangerous areas even when the move breaks down |
| `POSTSHOT_XG` (1401) | Shots on target only (scored or saved) | Adds the ball's likely finishing position at the goal line. Blocked shots, woodwork and off-target are valued 0 |

Useful comparisons: `SHOT_XG` against goals gives finishing efficiency;
`POSTSHOT_XG` against `SHOT_XG` isolates shot placement quality; conceded
`POSTSHOT_XG` against goals conceded gives goalkeeper shot-stopping.

## KPIs in the data

A KPI is a valued metric referenced by integer `kpiId`. It appears at two
granularities:

| Level | File | Shape |
|---|---|---|
| Event | `data/events_kpis/` | `{position, playerId, eventId, kpiId, value}` |
| Player per position per match | `data/player_kpis/` | `{kpiId, value}` inside each player's `kpis` array |

Resolve any `kpiId` through `data/kpi_definitions.json`, which carries `name`,
`details.label`, `details.definition` and `details.meaning`. See
[kpi-definitions.md](kpi-definitions.md) for the full ID index.

`parentKpi` and `context` exist for aggregated data but are null for the
event-level KPIs in this snapshot.

## Phases of play

Impect computes a **phase** for every event algorithmically — from the interval
between actions, action length, pressure, opponents behind the ball and other
parameters — rather than tagging it manually. The four values
(`IN_POSSESSION`, `ATTACKING_TRANSITION`, `SET_PIECE`, `SECOND_BALL`) are defined
in [event-types.md](event-types.md).

`SECOND_BALL` is the distinctive one: an explicit "chaos phase" where possession
cannot be cleanly assigned to either team. `SECOND_BALL_START` and
`SECOND_BALL_WIN` quantify it.

## What the open data does not contain

Do not assume these exist here:

- **Set-piece sub-phase detail.** Events link to a set piece via
  `setPiece: {id, subPhaseId, mainEvent}`, but the sub-phase objects themselves —
  delivery types, end zones, touch outcomes — are not part of the snapshot.
- **Standardised scores, player profiles, squad ratings and match predictions.**
  None appear in the open data. Anything asserting an Impect "score" or "profile"
  schema is not grounded in this source.
- **Tracking data.** Impect open data is event data. The `skill_corner` entries in
  `idMappings` are identifier cross-references only — see
  [identity-surfaces.md](identity-surfaces.md).
