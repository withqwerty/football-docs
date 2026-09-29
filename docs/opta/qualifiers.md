# Opta Qualifier IDs

Qualifiers add context to events. Each event has a `qualifier[]` array where each entry has a `qualifierId` (numeric) and optional `value` (string).

The IDs and names below are checked against Stats Perform's qualifier table for the
MA36 feed (August 2025). The camelCase names in the Name column are labels for this
doc, not field names: the feed carries only the numeric `qualifierId`.

## Pass Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 1 | longBall | Pass longer than 32 metres |
| 2 | cross | Cross (Q2). Corners commonly carry Q2 + Q6; free-kick crosses commonly carry Q2 + Q5; open-play crosses are Q2 without Q5/Q6. |
| 3 | headPass | Headed pass (Q3). Distinct from Q15, the headed shot qualifier. |
| 4 | throughBall | Through ball (Q4). Do not confuse with Q5 free-kick delivery. |
| 5 | freeKickTaken | Free kick pass / free-kick delivery (Q5), direct or indirect. |
| 6 | cornerTaken | Corner kick / corner delivery (Q6). |
| 107 | throwIn | Throw-in |
| 124 | goalKick | Goal kick pass. For goal-kick distribution charts, combine with pass end coordinates Q140/Q141. |
| 279 | kickOff | Kick-off pass. Value `S` is the kick-off that starts a period; `G` is the kick-off after a goal. |
| 7 | playersCaughtOffside | On an offside pass (typeId 2). The value is the ID of the player caught offside. It is not a goal-kick flag; goal kicks are Q124. |
| 154 | intentionalAssist | Pass that creates a scoring chance, for example a cross into the box or a through ball |
| 210 | assist | The pass set up a shot, a goal or a missed chance |
| 196 | switchOfPlay | Pass crossing centre zone, y-distance > 60 |
| 212 | length | Estimated distance in metres that the ball travelled on the pass or clearance |
| 213 | angle | Direction of the pass or clearance relative to the direction of play, in radians (0.00 to 6.28) |

## Location Qualifiers

| ID | Name | Value type | Notes |
|----|------|------------|-------|
| 140 | passEndX | number (0-100) | Pass destination X coordinate |
| 141 | passEndY | number (0-100) | Pass destination Y coordinate |

## Shot Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 15 | head | Headed shot/goal |
| 20 | rightFoot | Right-footed shot |
| 72 | leftFoot | Left-footed shot |
| 21 | otherBodyPart | Knee, chest, etc. |
| 22 | regularPlay | The event happened in open play, not from a set play |
| 24 | setPiece | The event followed a free kick that was not struck directly. A shot struck directly from a free kick is Q26 |
| 25 | fromCorner | Shot followed a corner |
| 26 | freeKick | Shot struck directly from a free kick |
| 29 | assisted | A team-mate's pass set up the shot or chance |
| 160 | throwInSetPiece | The shot or pass came from a throw-in set piece |
| 214 | bigChance | Big chance: a clear-cut chance the player should score, such as a one-on-one |
| 9 | penalty | Penalty taken, or penalty awarded (on a foul, typeId 4) |
| 108 | volley | Volley: the ball did not bounce before the shot |
| 328 | firstTouch | Shot struck first time, without a controlling touch |
| 263 | directCorner | Shot or goal directly from a corner (Olimpico) |
| 136 | keeperTouched | Goal where the goalkeeper got a touch on the ball |
| 82 | blocked | The shot was blocked |
| 146 | blockedX | X coordinate where the shot was blocked, or where an opponent touched an off-target shot |
| 147 | blockedY | Y coordinate for the same point as Q146 |

Qualifiers 16-19 and 60-71 are pitch zones for the shot location (for example 16
small box centre, 17 box centre, 18 out of box centre, 19 35+ centre). See
charting-shot-placement for the full zone list.

## Goal Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 28 | ownGoal | Own goal. contestantId is the team that scored it; credit the opposing team. Own-goal coordinates are near the defending end, so exclude or reattribute them before shot-distance analysis. |
| 280 | fantasyAssistType | Fantasy assist type on a goal, as a string (open data shows values such as `PENALTY_WON`, `HANDBALL_WON`, `PASS_LOST` and `BLOCKED_SHOT`). It is not an own-goal flag; use Q28. |
| 8 | goalDisallowed | On a pass (typeId 2): the pass led to a goal that was disallowed for a foul or offside. It is not a flag on goal events. |
| 102 | goalMouthY | Y coord in goal mouth; the posts are at 45.2 and 54.8 |
| 103 | goalMouthZ | Z coord / height in goal mouth; 0 is the ground and the crossbar is at 38 |

### Goal Mouth Zones (F24 Appendix 12)

| Zone | goalMouthY | goalMouthZ |
|------|-----------|-----------|
| Low left | 51.8-54.8 | 0-20 |
| Low centre | 48.2-51.8 | 0-20 |
| Low right | 45.2-48.2 | 0-20 |
| High left | 51.8-54.8 | 20-38 |
| High centre | 48.2-51.8 | 20-38 |
| High right | 45.2-48.2 | 20-38 |

## xG Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 321 | expectedGoals | xG value (on `matchexpectedgoals` endpoint only, NOT on standard `matchevent`) |
| 322 | expectedGoalsOnTarget | xGOT value (on `matchexpectedgoals` endpoint only) |

**Important:** Qualifier 213 is the pass angle, not xG. Use qualifiers 321/322 from the separate `matchexpectedgoals` endpoint for xG.

## Context Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 30 | involved | Player (or coach) IDs as a list, on team set-up and formation-change events |
| 44 | playerPosition | Player positions in the team formation, on set-up, formation-change and substitution events |
| 130 | teamFormation | Formation ID (on lineup events) |
| 131 | teamPlayerFormation | Player positions 1-11 (on lineup events) |
| 145 | formationSlot | Formation position of player coming on (1-11) |
| 59 | jerseyNumber | Shirt number of player(s), shown for substitutions, lineups, and lineup changes |
| 194 | captain | Player ID of the team captain |
| 292 | detailedPositionId | Granular position on sub-on events (1-10) |
| 364 | VARDelay | VAR delay marker on a start delay event (typeId 27) |

## Card Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 31 | yellowCard | Yellow card |
| 32 | secondYellow | Second yellow card |
| 33 | redCard | Straight red card |

## Goalkeeper Position Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 230 | gkX | Goalkeeper's X position for the shot (post, goal and, for some competitions, other shots) |
| 231 | gkY | Goalkeeper's Y position for the shot |
| 395 | gkXAtGoal | Goalkeeper's X position when the ball crossed the line for a goal (post-match) |
| 396 | gkYAtGoal | Goalkeeper's Y position when the ball crossed the line for a goal (post-match) |
