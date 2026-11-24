---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data v2.0 (tag v2.0, Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-11-24
---

# Impect KPI Definitions Index

Every KPI value in the open data is referenced only by an integer `kpiId`, in
both `data/events_kpis/` and `data/player_kpis/`. This file is the ID → name
lookup.

**The authoritative source is `data/kpi_definitions.json`** in the
[open-data repository](https://github.com/ImpectAPI/open-data), which carries the
full `definition` and `meaning` prose for each KPI. Resolve at runtime from that
file rather than hard-coding a mapping — the snapshot holds 103 definitions, and
Impect's live product covers more.

This page describes release v2.0 (tag `v2.0`). The KPI IDs and names are the
same in v1.0; v2.0 rewrote the `definition` or `meaning` text of 34 KPIs, set
the labels of `PXT_REC`, `DEF_PXT_BALL_WIN` and `DEF_PXT_FOUL`, and added the
`inverted` flag.

Data source: **Impect**. See [overview.md](overview.md) for licence and
attribution terms.

## Reading the naming scheme

| Prefix or suffix | Meaning |
|---|---|
| `BYPASSED_OPPONENTS_*` | Opponents taken out of the game by an action |
| `BYPASSED_DEFENDERS_*` | Restricted to the last five outfield players nearest their own goal |
| `*_RECEIVING` | Credited to the receiver of the pass rather than the passer |
| `*_NUMBER` | Counts qualifying **actions** rather than summing opponents |
| `*_RAW` / `*_WO_VERIFICATION` | Variants before verification adjustments |
| `PXT_*` | Own-team goal threat added (offensive pxT) |
| `DEF_PXT_*` | Change in the threat of conceding (defensive pxT); `inverted`, so lower is better |
| `OPP_PXT_*` | Opponent-threat counterpart |

The pxT identities, the player-level exclusions and the three xG flavours are
explained in [concepts.md](concepts.md).

## The `inverted` flag

From v2.0, each entry in `kpi_definitions.json` carries a boolean `inverted`.
The repository's `CHANGELOG.md` describes it as marking KPIs where a lower value
is better. 28 KPIs are inverted: sideways play (`NEUTRAL_PLAY_NUMBER`), reverse
play, ball losses, own goals, the red card, unsuccessful passes, lost duels and
every `DEF_PXT_*` KPI. Read the flag when you rank or colour-scale players; do not infer it
from the name. v1.0 has no `inverted` field.

## Event-level and player-level KPIs

`data/player_kpis/` carries 101 of the 103 KPIs; `YELLOW_CARD` and
`SECOND_YELLOW_CARD` appear in neither KPI file. In v2.0, `data/events_kpis/`
carries the same 101 KPIs as `data/player_kpis/`; in v1.0 it carried 94. v2.0
added seven KPIs to the event level, which in v1.0 were player-level only:
`SHOT_XG_FROM_PASSES` (1693), `SHOT_CREATING_ACTIONS` (1694), `PRE_ASSISTS`
(1715), `SHOT_ASSISTS` (1780), `EXPECTED_SHOT_ASSISTS` (1781),
`EXPECTED_GOAL_ASSISTS` (1782) and `EXPECTED_PASSES` (1783).

## Full index

All 103 KPI definitions in v2.0, by ID. A dash means the KPI has no `label` set
in the source file. **Inverted** is the `inverted` flag (yes = lower is better).

| ID | Name | Label | Inverted |
|---|---|---|---|
| `0` | `BYPASSED_OPPONENTS` | Bypassed Opponents | no |
| `1` | `BYPASSED_OPPONENTS_NUMBER` | Bypassed Opponents Number | no |
| `2` | `BYPASSED_DEFENDERS` | Bypassed Defenders | no |
| `3` | `BYPASSED_OPPONENTS_WO_VERIFICATION` | Bypassed Opponents Without Verification | no |
| `4` | `BYPASSED_DEFENDERS_WO_VERIFICATION` | Bypassed Defenders Without Verification | no |
| `6` | `BYPASSED_OPPONENTS_BY_ACTION_SECOND_BALL` | — | no |
| `7` | `BYPASSED_OPPONENTS_RECEIVING` | Bypassed Opponents Receiving | no |
| `8` | `BYPASSED_OPPONENTS_RECEIVING_NUMBER` | Bypassed Opponents Receiving Number | no |
| `9` | `BYPASSED_DEFENDERS_RECEIVING` | Bypassed Defenders Receiving | no |
| `10` | `BYPASSED_OPPONENTS_RECEIVING_DUETO_VERIFICATION` | Bypassed Opponents Receiving Due To Verification | no |
| `15` | `NEUTRAL_PLAY_NUMBER` | Sideway Action | yes |
| `16` | `REVERSE_PLAY_ADDED_OPPONENTS` | Reverse Play Added Opponents | yes |
| `17` | `REVERSE_PLAY_NUMBER` | Reverse Play Number | yes |
| `20` | `BALL_LOSS_ADDED_OPPONENTS` | Ball Loss Added Opponents | yes |
| `21` | `BALL_LOSS_REMOVED_TEAMMATES` | Ball Loss Removed Teammates | yes |
| `22` | `BALL_LOSS_NUMBER` | Ball Loss Number | yes |
| `23` | `BALL_WIN_ADDED_TEAMMATES` | Ball Win Added Teammates | no |
| `24` | `BALL_WIN_REMOVED_OPPONENTS` | Ball Win Removed Opponents | no |
| `25` | `BALL_WIN_REMOVED_OPPONENTS_DEFENDERS` | Ball Win Removed Opponents Defenders | no |
| `27` | `BALL_WIN_NUMBER` | Ball Win Number | no |
| `28` | `GOALS` | Goals | no |
| `29` | `BYPASSED_OPPONENTS_MIDFIELD` | Bypassed Midfielders | no |
| `33` | `BALL_LOSS_ADDED_OPPONENTS_DEFENDERS` | Ball Loss Added Opponents Defenders | yes |
| `36` | `BALL_WIN_ADDED_TEAMMATES_DEFENDERS` | Ball Win Added Teammates Defenders | no |
| `37` | `REVERSE_PLAY_ADDED_OPPONENTS_DEFENDERS` | Reverse Play Added Opponents Defenders | yes |
| `38` | `OWNGOALS` | Own Goals | yes |
| `47` | `RED_CARD` | Red Card | yes |
| `49` | `CRITICAL_BALL_LOSS_NUMBER` | Critical Ball Loss Number | yes |
| `69` | `BALL_LOSS_REMOVED_TEAMMATES_DEFENDERS` | Ball Loss Removed Teammates Defenders | yes |
| `74` | `BYPASSED_DEFENDERS_BY_ACTION_SECOND_BALL` | — | no |
| `77` | `ASSISTS` | Assists | no |
| `82` | `SHOT_XG` | Shot-based xG | no |
| `83` | `PACKING_XG` | Packing non-shot-based xG | no |
| `90` | `SUCCESSFUL_PASSES` | Successful Passes | no |
| `91` | `UNSUCCESSFUL_PASSES` | Unsuccessful Passes | yes |
| `92` | `OFFENSIVE_TOUCHES` | Offensive Touches | no |
| `93` | `DEFENSIVE_TOUCHES` | Defensive Touches | no |
| `94` | `WON_GROUND_DUELS` | Won Ground Duels | no |
| `95` | `LOST_GROUND_DUELS` | Lost Ground Duels | yes |
| `96` | `WON_AERIAL_DUELS` | Won Aerial Duels | no |
| `97` | `LOST_AERIAL_DUELS` | Lost Aerial Duels | yes |
| `100` | `SHOT_AT_GOAL_NUMBER` | Total Shots | no |
| `101` | `SHOT_AT_GOAL_OFF_TARGET_NUMBER` | Total Shots Off Target | no |
| `1399` | `BYPASSED_OPPONENTS_RAW` | Bypassed Opponents Raw | no |
| `1400` | `BYPASSED_OPPONENTS_DEFENDERS_RAW` | Bypassed Defenders Raw | no |
| `1401` | `POSTSHOT_XG` | Post-Shot xG | no |
| `1404` | `PXT_PASS` | Passes | no |
| `1405` | `PXT_DRIBBLE` | Dribbles | no |
| `1406` | `PXT_SETPIECE` | Set pieces | no |
| `1407` | `PXT_BLOCK` | Blocks | no |
| `1408` | `PXT_SHOT` | Shots | no |
| `1409` | `PXT_BALL_WIN` | Ball wins | no |
| `1410` | `PXT_FOUL` | Fouls | no |
| `1411` | `PXT_NO_VIDEO` | No Video | no |
| `1412` | `PXT_REC` | Receiving | no |
| `1413` | `OPP_PXT_PASS` | Passes (Opponent Threat) | no |
| `1414` | `OPP_PXT_DRIBBLE` | Dribbles (Opponent Threat) | no |
| `1415` | `OPP_PXT_SETPIECE` | Set pieces (Opponent Threat) | no |
| `1416` | `OPP_PXT_BLOCK` | Blocks (Opponent Threat) | no |
| `1417` | `OPP_PXT_SHOT` | Shots (Opponent Threat) | no |
| `1418` | `OPP_PXT_BALL_WIN` | Ball wins (Opponent Threat) | no |
| `1419` | `OPP_PXT_FOUL` | Fouls (Opponent Threat) | no |
| `1420` | `OPP_PXT_NO_VIDEO` | No Video (Opponent Threat) | no |
| `1421` | `OPP_PXT_BALL_LOSS` | Ball losses (Opponent Threat) | no |
| `1431` | `NEUTRAL_PASSES` | Neutral Passes | no |
| `1515` | `SHOT_AT_GOAL_NUMBER_ON_TARGET` | Total Shots On Target | no |
| `1516` | `SHOT_AT_GOAL_NUMBER_SUCCESS` | Total Shots Successful | no |
| `1517` | `SHOT_AT_GOAL_NUMBER_SAVED` | Total Shots Saved | no |
| `1518` | `SHOT_AT_GOAL_NUMBER_CAUGHT` | Total Shots Caught | no |
| `1519` | `SHOT_AT_GOAL_NUMBER_BLOCKED` | Total Shots Blocked | no |
| `1520` | `SHOT_AT_GOAL_NUMBER_OTHER` | Total Shots Other | no |
| `1522` | `DEF_PXT_PASS` | Opponent passes (Defensive Threat) | yes |
| `1523` | `DEF_PXT_DRIBBLE` | Opponent dribbles (Defensive Threat) | yes |
| `1524` | `DEF_PXT_SETPIECE` | Opponent set pieces (Defensive Threat) | yes |
| `1525` | `DEF_PXT_BLOCK` | Opponent blocks (Defensive Threat) | yes |
| `1526` | `DEF_PXT_SHOT` | Opponent shots (Defensive Threat) | yes |
| `1527` | `DEF_PXT_BALL_WIN` | Ball Wins | yes |
| `1528` | `DEF_PXT_NOVIDEO` | No video (Defensive Threat) | yes |
| `1529` | `DEF_PXT_BALL_LOSS` | Ball losses (Defensive Threat) | yes |
| `1530` | `DEF_PXT_FOUL` | Fouls | yes |
| `1531` | `PXT_PASSIVE` | Passive | no |
| `1532` | `PXT_OTHER` | Other | no |
| `1533` | `PXT_FOULED` | Fouled | no |
| `1534` | `DEF_PXT_ACTIVE` | Active actions (Defensive Threat) | yes |
| `1535` | `DEF_PXT_OTHER` | Other (Defensive Threat) | yes |
| `1536` | `NUMBER_OF_PRESSES` | Number of presses | no |
| `1610` | `SECOND_BALL_START` | Second Ball Starts | no |
| `1611` | `SECOND_BALL_WIN` | Second Ball Wins | no |
| `1612` | `DISTANCE_TO_GOAL_COVERED_FDR` | Distance Covered From Deep Runs | no |
| `1613` | `DISTANCE_TO_GOAL_COVERED_DRIBBLE` | Distance Covered By Dribbles | no |
| `1633` | `PXT_ATTACK` | PXT Attack | no |
| `1634` | `PXT_DEFEND` | PXT Defend | no |
| `1635` | `DEF_PXT_ATTACK` | DEF PXT Attack | yes |
| `1636` | `DEF_PXT_DEFEND` | DEF PXT Defend | yes |
| `1637` | `YELLOW_CARD` | Yellow Card | no |
| `1638` | `SECOND_YELLOW_CARD` | Second Yellow Card | no |
| `1693` | `SHOT_XG_FROM_PASSES` | Shot xG from Passes | no |
| `1694` | `SHOT_CREATING_ACTIONS` | Shot-Creating Actions | no |
| `1715` | `PRE_ASSISTS` | Pre Assist | no |
| `1780` | `SHOT_ASSISTS` | Shot Assists | no |
| `1781` | `EXPECTED_SHOT_ASSISTS` | Expected Shot Assists | no |
| `1782` | `EXPECTED_GOAL_ASSISTS` | Expected Goal Assists | no |
| `1783` | `EXPECTED_PASSES` | Expected Passes | no |

## Gaps in the ID sequence

The IDs are not contiguous — the snapshot jumps from 4 to 6, 10 to 15, 101 to
1399, and so on. Gaps are expected and do not indicate missing data; they are
simply IDs not present in this snapshot. Never infer a KPI from an unlisted ID.
