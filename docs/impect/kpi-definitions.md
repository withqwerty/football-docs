---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
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
| `DEF_PXT_*` | Opponent goal threat prevented (defensive pxT) |
| `OPP_PXT_*` | Opponent-threat counterpart |

The pxT identities, the player-level exclusions and the three xG flavours are
explained in [concepts.md](concepts.md).

## Full index

All 103 KPI definitions in the snapshot, by ID. A dash means the KPI has no
`label` set in the source file.

| ID | Name | Label |
|---|---|---|
| `0` | `BYPASSED_OPPONENTS` | Bypassed Opponents |
| `1` | `BYPASSED_OPPONENTS_NUMBER` | Bypassed Opponents Number |
| `2` | `BYPASSED_DEFENDERS` | Bypassed Defenders |
| `3` | `BYPASSED_OPPONENTS_WO_VERIFICATION` | Bypassed Opponents Without Verification |
| `4` | `BYPASSED_DEFENDERS_WO_VERIFICATION` | Bypassed Defenders Without Verification |
| `6` | `BYPASSED_OPPONENTS_BY_ACTION_SECOND_BALL` | — |
| `7` | `BYPASSED_OPPONENTS_RECEIVING` | Bypassed Opponents Receiving |
| `8` | `BYPASSED_OPPONENTS_RECEIVING_NUMBER` | Bypassed Opponents Receiving Number |
| `9` | `BYPASSED_DEFENDERS_RECEIVING` | Bypassed Defenders Receiving |
| `10` | `BYPASSED_OPPONENTS_RECEIVING_DUETO_VERIFICATION` | Bypassed Opponents Receiving Due To Verification |
| `15` | `NEUTRAL_PLAY_NUMBER` | Sideway Action |
| `16` | `REVERSE_PLAY_ADDED_OPPONENTS` | Reverse Play Added Opponents |
| `17` | `REVERSE_PLAY_NUMBER` | Reverse Play Number |
| `20` | `BALL_LOSS_ADDED_OPPONENTS` | Ball Loss Added Opponents |
| `21` | `BALL_LOSS_REMOVED_TEAMMATES` | Ball Loss Removed Teammates |
| `22` | `BALL_LOSS_NUMBER` | Ball Loss Number |
| `23` | `BALL_WIN_ADDED_TEAMMATES` | Ball Win Added Teammates |
| `24` | `BALL_WIN_REMOVED_OPPONENTS` | Ball Win Removed Opponents |
| `25` | `BALL_WIN_REMOVED_OPPONENTS_DEFENDERS` | Ball Win Removed Opponents Defenders |
| `27` | `BALL_WIN_NUMBER` | Ball Win Number |
| `28` | `GOALS` | Goals |
| `29` | `BYPASSED_OPPONENTS_MIDFIELD` | Bypassed Midfielders |
| `33` | `BALL_LOSS_ADDED_OPPONENTS_DEFENDERS` | Ball Loss Added Opponents Defenders |
| `36` | `BALL_WIN_ADDED_TEAMMATES_DEFENDERS` | Ball Win Added Teammates Defenders |
| `37` | `REVERSE_PLAY_ADDED_OPPONENTS_DEFENDERS` | Reverse Play Added Opponents Defenders |
| `38` | `OWNGOALS` | Own Goals |
| `47` | `RED_CARD` | Red Card |
| `49` | `CRITICAL_BALL_LOSS_NUMBER` | Critical Ball Loss Number |
| `69` | `BALL_LOSS_REMOVED_TEAMMATES_DEFENDERS` | Ball Loss Removed Teammates Defenders |
| `74` | `BYPASSED_DEFENDERS_BY_ACTION_SECOND_BALL` | — |
| `77` | `ASSISTS` | Assists |
| `82` | `SHOT_XG` | Shot-based xG |
| `83` | `PACKING_XG` | Packing non-shot-based xG |
| `90` | `SUCCESSFUL_PASSES` | Successful Passes |
| `91` | `UNSUCCESSFUL_PASSES` | Unsuccessful Passes |
| `92` | `OFFENSIVE_TOUCHES` | Offensive Touches |
| `93` | `DEFENSIVE_TOUCHES` | Defensive Touches |
| `94` | `WON_GROUND_DUELS` | Won Ground Duels |
| `95` | `LOST_GROUND_DUELS` | Lost Ground Duels |
| `96` | `WON_AERIAL_DUELS` | Won Aerial Duels |
| `97` | `LOST_AERIAL_DUELS` | Lost Aerial Duels |
| `100` | `SHOT_AT_GOAL_NUMBER` | Total Shots |
| `101` | `SHOT_AT_GOAL_OFF_TARGET_NUMBER` | Total Shots Off Target |
| `1399` | `BYPASSED_OPPONENTS_RAW` | Bypassed Opponents Raw |
| `1400` | `BYPASSED_OPPONENTS_DEFENDERS_RAW` | Bypassed Defenders Raw |
| `1401` | `POSTSHOT_XG` | Post-Shot xG |
| `1404` | `PXT_PASS` | Passes |
| `1405` | `PXT_DRIBBLE` | Dribbles |
| `1406` | `PXT_SETPIECE` | Set pieces |
| `1407` | `PXT_BLOCK` | Blocks |
| `1408` | `PXT_SHOT` | Shots |
| `1409` | `PXT_BALL_WIN` | Ball wins |
| `1410` | `PXT_FOUL` | Fouls |
| `1411` | `PXT_NO_VIDEO` | No Video |
| `1412` | `PXT_REC` | — |
| `1413` | `OPP_PXT_PASS` | Passes (Opponent Threat) |
| `1414` | `OPP_PXT_DRIBBLE` | Dribbles (Opponent Threat) |
| `1415` | `OPP_PXT_SETPIECE` | Set pieces (Opponent Threat) |
| `1416` | `OPP_PXT_BLOCK` | Blocks (Opponent Threat) |
| `1417` | `OPP_PXT_SHOT` | Shots (Opponent Threat) |
| `1418` | `OPP_PXT_BALL_WIN` | Ball wins (Opponent Threat) |
| `1419` | `OPP_PXT_FOUL` | Fouls (Opponent Threat) |
| `1420` | `OPP_PXT_NO_VIDEO` | No Video (Opponent Threat) |
| `1421` | `OPP_PXT_BALL_LOSS` | Ball losses (Opponent Threat) |
| `1431` | `NEUTRAL_PASSES` | Neutral Passes |
| `1515` | `SHOT_AT_GOAL_NUMBER_ON_TARGET` | Total Shots On Target |
| `1516` | `SHOT_AT_GOAL_NUMBER_SUCCESS` | Total Shots Successful |
| `1517` | `SHOT_AT_GOAL_NUMBER_SAVED` | Total Shots Saved |
| `1518` | `SHOT_AT_GOAL_NUMBER_CAUGHT` | Total Shots Caught |
| `1519` | `SHOT_AT_GOAL_NUMBER_BLOCKED` | Total Shots Blocked |
| `1520` | `SHOT_AT_GOAL_NUMBER_OTHER` | Total Shots Other |
| `1522` | `DEF_PXT_PASS` | Opponent passes (Defensive Threat) |
| `1523` | `DEF_PXT_DRIBBLE` | Opponent dribbles (Defensive Threat) |
| `1524` | `DEF_PXT_SETPIECE` | Opponent set pieces (Defensive Threat) |
| `1525` | `DEF_PXT_BLOCK` | Opponent blocks (Defensive Threat) |
| `1526` | `DEF_PXT_SHOT` | Opponent shots (Defensive Threat) |
| `1527` | `DEF_PXT_BALL_WIN` | — |
| `1528` | `DEF_PXT_NOVIDEO` | No video (Defensive Threat) |
| `1529` | `DEF_PXT_BALL_LOSS` | Ball losses (Defensive Threat) |
| `1530` | `DEF_PXT_FOUL` | — |
| `1531` | `PXT_PASSIVE` | Passive |
| `1532` | `PXT_OTHER` | Other |
| `1533` | `PXT_FOULED` | Fouled |
| `1534` | `DEF_PXT_ACTIVE` | Active actions (Defensive Threat) |
| `1535` | `DEF_PXT_OTHER` | Other (Defensive Threat) |
| `1536` | `NUMBER_OF_PRESSES` | Number of presses |
| `1610` | `SECOND_BALL_START` | Second Ball Starts |
| `1611` | `SECOND_BALL_WIN` | Second Ball Wins |
| `1612` | `DISTANCE_TO_GOAL_COVERED_FDR` | Distance Covered From Deep Runs |
| `1613` | `DISTANCE_TO_GOAL_COVERED_DRIBBLE` | Distance Covered By Dribbles |
| `1633` | `PXT_ATTACK` | PXT Attack |
| `1634` | `PXT_DEFEND` | PXT Defend |
| `1635` | `DEF_PXT_ATTACK` | DEF PXT Attack |
| `1636` | `DEF_PXT_DEFEND` | DEF PXT Defend |
| `1637` | `YELLOW_CARD` | Yellow Card |
| `1638` | `SECOND_YELLOW_CARD` | Second Yellow Card |
| `1693` | `SHOT_XG_FROM_PASSES` | Shot xG from Passes |
| `1694` | `SHOT_CREATING_ACTIONS` | Shot-Creating Actions |
| `1715` | `PRE_ASSISTS` | Pre Assist |
| `1780` | `SHOT_ASSISTS` | Shot Assists |
| `1781` | `EXPECTED_SHOT_ASSISTS` | Expected Shot Assists |
| `1782` | `EXPECTED_GOAL_ASSISTS` | Expected Goal Assists |
| `1783` | `EXPECTED_PASSES` | Expected Passes |

## Gaps in the ID sequence

The IDs are not contiguous — the snapshot jumps from 4 to 6, 10 to 15, 101 to
1399, and so on. Gaps are expected and do not indicate missing data; they are
simply IDs not present in this snapshot. Never infer a KPI from an unlisted ID.
