---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
---

# Impect Event Types and Enums

Impect classifies every event with two controlled enums: **`actionType`** (the
broad category) and **`action`** (the specific action, a finer form of the same
thing). Neither is a free-text field.

Values below are those **observed across all 939,200 events** in the
[open-data snapshot](https://github.com/ImpectAPI/open-data), cross-checked
against appendices 3–5 and 7 of the repository's `Documentation.pdf`. Where the
documentation and the data disagree, both are shown — that discrepancy is itself
something to code defensively against.

Because the snapshot is one competition-season at `dataVersion: "V3"`, treat
these lists as **observed members, not a closed set**. The live product may emit
values that do not appear here.

## `actionType` — 25 observed values

| Value | Description |
|---|---|
| `PASS` | Low passes, low and high crosses, diagonal passes, chipped passes, short aerial passes, and passes with the head |
| `RECEPTION` | Reception of the ball after a teammate's action |
| `DRIBBLE` | Tagged when the player carries the ball more than two steps, or the pressure changes significantly, or the number of opponents changes during their possession |
| `SHOT` | The player intends to shoot |
| `INTERCEPTION` | Reception of the ball within the opponent formation after an opponent action |
| `LOOSE_BALL_REGAIN` | Reception of the ball within the opponent formation after an opponent action |
| `CLEARANCE` | Pass under high pressure, most likely after an opponent action |
| `GROUND_DUEL` | Ball won through a ground duel |
| `BLOCK` | Block of a pass or shot |
| `KICK_OFF` | Kick-off |
| `THROW_IN` | Throw-in |
| `FREE_KICK` | Free kick |
| `GOAL_KICK` | Goal kick |
| `CORNER` | Corner |
| `GK_CATCH` | Goalkeeper catch |
| `GK_SAVE` | Goalkeeper save |
| `GOAL` | Goal |
| `OWN_GOAL` | Own goal |
| `OUT` | Ball out of play |
| `OFFSIDE` | Offside |
| `FOUL` | Foul |
| `RED_CARD` | Red card |
| `FINAL_WHISTLE` | Final whistle of a half |
| `REFEREE_INTERCEPTION` | Referee interrupts the match, e.g. for an injury |
| `NO_VIDEO` | No video footage available |

**Documented but absent from the snapshot:** `YELLOW_CARD`, which Impect marks as
dataV4+.

## `action` — 44 observed values

### Passing and distribution

| Value | Definition |
|---|---|
| `LOW_PASS` | Flat pass with the foot; ball trajectory reaches a maximum of hip height. May land with a teammate, an opponent, or out of bounds |
| `LOW_CROSS` | Cross into the opponent box from wide, not exceeding hip height |
| `HIGH_CROSS` | Aerial cross into the opponent box from wide; must reach waist height at least once |
| `DIAGONAL_PASS` | High foot pass from centre or wide that switches play to the wing |
| `CHIPPED_PASS` | High foot pass travelling at least 15 metres, mainly along the line or through the centre |
| `SHORT_AERIAL_PASS` | High foot pass under 15 metres — lobs, volleys, chips, e.g. after a throw-in or bounce |
| `HEADER` | Any reception or release with the head, including headed passes and headed finishes |
| `CLEARANCE` | Relieving a high-press situation with a defensive action on the ball, most often a single contact |

### Carrying and receiving

| Value | Definition |
|---|---|
| `DRIBBLE` | At least two touches in a sequence — carrying or holding the ball |
| `HOLD_UP_PLAY` | Receiving and retaining possession from a high pass under pressure, or a low pass held in a one-on-one |
| `AVAILABILITY_IN_THE_BACK` | Receiving in the GK, CB, FB or DM zone (at most one opponent bypassed) |
| `AVAILABILITY_BTL` | Availability between the lines — receiving in the DM, CM or AM zone |
| `AVAILABILITY_OUT_WIDE` | Receiving in the Wide Left, Wide Right, LB or RB zone |
| `AVAILABILITY_FDR` | Receiving behind the opponent's defensive chain, in an in-behind zone, from a pass played in front of it |
| `AVAILABILITY_IN_THE_BOX` | Receiving a pass in the opponent box |

### Defending

| Value | Definition |
|---|---|
| `INTERCEPTION` | Picking up an opponent's attempted pass |
| `LOOSE_BALL_REGAIN` | Winning free balls — excludes intercepted passes, clearances and tackles. Mainly second balls and bounces |
| `DUEL` | Duel event as emitted in the data (see the note below) |
| `BLOCK` | Touching the ball under pressure so high there is no possibility of control — blocked shots, passes and crosses |

### Shooting

| Value | Definition |
|---|---|
| `LONG_RANGE_SHOT` | Shot from over 22 m, measured to the centre of the goal |
| `MID_RANGE_SHOT` | Shot from 10–22 m |
| `CLOSE_RANGE_SHOT` | Shot from up to 10 m that is not a clear one-on-one with the goalkeeper |
| `ONE_VS_ONE_AGAINST_GK` | Shooter free in front of the goalkeeper or last man |
| `OPEN_GOAL_SHOT` | All opposing players bypassed; shot at an open goal |
| `GOAL` | Goal by the tagged player |
| `OWN_GOAL` | Own goal by the tagged player |

### Set pieces

| Value | Definition |
|---|---|
| `THROW_IN` | Ball brought into play by a throw-in |
| `CORNER` | Ball brought into play by a corner |
| `FREE_KICK` | Ball brought into play by a free kick |
| `DIRECT_FREE_KICK` | Shot from a free kick |
| `PENALTY_KICK` | Ball brought into play by a penalty |
| `GOAL_KICK` | Ball brought into play by a goal kick |

### Goalkeeping

| Value | Definition |
|---|---|
| `SAVE` | Goalkeeper parries the ball without holding it |
| `CATCH` | Goalkeeper intercepts and holds the ball |

### Match control and administrative

| Value | Definition |
|---|---|
| `FOUL` | Foul by the tagged player; the fouled player is in `fouledPlayerId` |
| `RED_CARD` | Red card for the tagged player |
| `KICKOFF_WHISTLE` | Kick-off whistle and kick-off |
| `FINAL_WHISTLE` | Final whistle of a half |
| `BALL_OUT_OF_GOAL_LINE` | Ball out of play at the goal line |
| `BALL_OUT_OF_SIDE_LINE` | Ball out of play at the side line |
| `BALL_OUT_OF_UNKNOWN` | Ball out at the goal or side line, side unresolved |
| `REFERY_INTERCEPTION` | Referee interrupts play, e.g. for an injured player |
| `VIDEO_NOT_AVAILABLE` | No video footage available |

### Documentation-versus-data discrepancies

Three worth coding around:

- **`REFERY_INTERCEPTION` vs `REFEREE_INTERCEPTION`.** The `action` enum uses the
  misspelled `REFERY_INTERCEPTION`; the `actionType` enum uses the correctly
  spelled `REFEREE_INTERCEPTION`. Both appear in the data. Match on the exact
  string for the field you are reading.
- **`DUEL` vs `GROUND_DUEL`.** `Documentation.pdf` appendix 3 documents
  `GROUND_DUEL` as an `action`, but the snapshot emits `DUEL` there.
  `GROUND_DUEL` does exist as an `actionType`. Read the duel type from
  `duel.duelType` rather than from `action`.
- **`YELLOW_CARD`** is documented for both enums but is dataV4+ and absent here.

## `result`

`SUCCESS`, `FAIL`, `NEUTRAL`

`NEUTRAL` applies to passes only — where the receiver is under high pressure or a
foul follows. Dribbles and shots are only `SUCCESS` or `FAIL`. The field is null
on events for which a result is not meaningful. See
[data-model.md](data-model.md) for the full pass-result thresholds.

## `phase` — phase of play

Computed algorithmically from the interval between actions, action length,
pressure on the ball carrier, number of opponents behind the ball and other
parameters. Not manually tagged.

| Value | Definition |
|---|---|
| `IN_POSSESSION` | Starts when a team holds the ball in a back zone (GK, FB or CB) for at least 4 seconds. Ends on a turnover, second ball, set piece or other stoppage. Means: controlled build-up |
| `ATTACKING_TRANSITION` | Starts when possession is won with some control (pressure < 40). Ends when the team takes the speed out of the situation, or on a second ball, set piece or stoppage. Means: direct attack after winning the ball without full control |
| `SET_PIECE` | Starts with a set piece being taken. Throw-ins, penalties and goal kicks end on execution; corners and free kicks run until a low-pressure action occurs or the ball leaves the final third — so a direct header from a corner is still `SET_PIECE` |
| `SECOND_BALL` | Begins after uncontrollable actions such as an aerial duel or blocked pass/shot, while both teams contest the ball. Ends when one team achieves control (pressure < 40) or play stops. The "chaos phase" |

Note that `BUILD_UP` and `COUNTER_ATTACK` are **not** Impect phase values.

## Contextual enums

| Enum | Observed values |
|---|---|
| `bodyPart` | `FOOT`, `FOOT_LOW`, `FOOT_HIGH`, `FOOT_LEFT`, `FOOT_RIGHT`, `HEAD`, `BODY` |
| `bodyPartExtended` | `FOOT`, `HEAD`, `BODY`, `HAND` |
| `previousPassHeight` | `LOW`, `HIGH` |
| `duel.duelType` | `GROUND_DUEL`, `AERIAL_DUEL` |
| `pass.receiver.type` | `TEAMMATE`, `OPPONENT` |
| `distanceToOpponent` | `LESS_THAN_ONE_METER`, `ONE_METER`, `TWO_METERS`, `THREE_METERS`, `FOUR_METERS`, `MORE_THAN_FOUR_METERS` |
| `leg` (players) | `LEFT`, `RIGHT`, `BOTH` |
| `gender` | `MALE`, `FEMALE` |
| `type` (squads) | `CLUB`, `NATIONAL_TEAM` |
| `dataVersion` | `V3` in the snapshot |

### Body part detail

| Value | Meaning |
|---|---|
| `FOOT` | Release of the ball with the foot |
| `FOOT_LOW` | Reception of a low ball (previous ball below chest height) |
| `FOOT_HIGH` | Reception of a high ball |
| `BODY` | Reception or release with the body, knee to chest |
| `HEAD` | Reception or release with the head |
| `FOOT_LEFT` / `FOOT_RIGHT` | Shot with the left / right foot |

From dataV4 the `FOOT_LOW` / `FOOT_HIGH` distinction moves out of `bodyPart` — the
incoming-ball height is carried by `previousPassHeight` instead, and
`bodyPartExtended` adds `HAND` for goalkeeper actions.

## Position enums

`position` is the **live** position of the player on the ball, updated per event.

| Enum | Values |
|---|---|
| `position` | `GOALKEEPER`, `CENTRAL_DEFENDER`, `RIGHT_WINGBACK_DEFENDER`, `LEFT_WINGBACK_DEFENDER`, `DEFENSE_MIDFIELD`, `CENTRAL_MIDFIELD`, `RIGHT_WINGER`, `LEFT_WINGER`, `ATTACKING_MIDFIELD`, `CENTER_FORWARD` |
| `positionSide` | `LEFT`, `CENTRE`, `CENTRE_LEFT`, `CENTRE_RIGHT`, `RIGHT` |

Two values appear in lineups and substitutions but never on events:

- `BANK` — a `position` meaning the bench. Used in `startingPositions` and as the
  `toPosition` of a player being substituted off.
- `UNKNOWN` — a `positionSide`, used when a player moves to `BANK`.

For central positions (`CENTRAL_DEFENDER`, `DEFENSE_MIDFIELD`, `CENTRAL_MIDFIELD`,
`CENTER_FORWARD`) Impect derives `positionSide` algorithmically, and only when two
or more players occupy the same position. Note the British spelling `CENTRE` in
`positionSide` against the American `CENTER_FORWARD` / `CENTER` (lane) elsewhere.

Spatial enums (`packingZone`, `lane`, `pitchPosition`) are documented in
[coordinate-system.md](coordinate-system.md).
