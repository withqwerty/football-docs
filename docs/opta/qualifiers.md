# Opta Qualifier IDs

Qualifiers add context to events. Each event has a `qualifier[]` array where each entry has a `qualifierId` (numeric) and optional `value` (string).

## Pass Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 1 | longBall | Long pass |
| 2 | cross | Cross (Q2). Corners commonly carry Q2 + Q6; free-kick crosses commonly carry Q2 + Q5; open-play crosses are Q2 without Q5/Q6. |
| 3 | headPass | Headed pass (Q3). Distinct from a headed shot qualifier. |
| 4 | throughBall | Through ball (Q4). Do not confuse with Q5 free-kick delivery. |
| 5 | freeKickTaken | Free kick pass / free-kick delivery (Q5). |
| 6 | cornerTaken | Corner kick / corner delivery (Q6). |
| 7 | goalKick | Goal kick in the F24 spec. Some JSON/event-stream exports use qualifier 124 for goal-kick passes instead. |
| 107 | throwIn | Throw-in |
| 124 | goalKick | Goal kick pass in some match-events JSON exports. For goal-kick distribution charts, combine with pass end coordinates Q140/Q141. |
| 24 | assistedShot | Pass led to a shot |
| 210 | intentionalAssist | Pass led to a goal |
| 196 | switchOfPlay | Pass crossing centre zone, y-distance > 60 |

## Location Qualifiers

| ID | Name | Value type | Notes |
|----|------|------------|-------|
| 140 | passEndX | number (0-100) | Pass destination X coordinate |
| 141 | passEndY | number (0-100) | Pass destination Y coordinate |
| 20 | involvedPlayer | player ID | Other player involved in the event |

## Shot Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 15 | head | Headed shot/goal |
| 56 | rightFoot | Right-footed action |
| 72 | leftFoot | Left-footed action |
| 22 | otherBodyPart | Knee, chest, etc. |
| 76 | bigChance | Big chance (high xG situation) |
| 9 | penalty | Penalty shot flag in some match-events JSON exports and foul-award workflows |
| 108 | penalty | Penalty kick |
| 136 | directFK | Direct free kick goal |
| 154 | volley | Volley |
| 328 | strong | Powerful shot |
| 17 | blockX | Block x-coordinate |
| 18 | blockY | Block y-coordinate |

## Goal Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 28 | ownGoal | Own goal. contestantId is the team that scored it; credit opposing team |
| 280 | ownGoal | Own-goal marker in some JSON exports, often with value `OWN_GOAL`. Own-goal coordinates may be near the defending end, so exclude or reattribute before shot-distance analysis. |
| 8 | goalDisallowed | Goal ruled out (offside/foul) |
| 102 | goalMouthY | Y coord in goal mouth (45.2-54.8 range) |
| 103 | goalMouthZ | Z coord / height in goal mouth (0-38 range) |

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

**Important:** The standard qualifier 213 is defined in the F24 spec as `expectedGoals` but is NOT populated in the theanalyst.com feed. Use qualifier 321/322 from the separate `matchexpectedgoals` endpoint instead.

## Context Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 130 | teamFormation | Formation ID (on lineup events) |
| 131 | teamPlayerFormation | Player positions 1-11 (on lineup events) |
| 145 | formationSlot | Formation position of player coming on (1-11) |
| 214 | length | Estimated metres ball travelled |
| 292 | detailedPositionId | Granular position on sub-on events (1-10) |
| 364 | VARReview | VAR review marker on delay events. In PL match-events JSON, typeId 27 + Q364 marks VAR review start/pause and typeId 28 + Q364 marks review end. |

## Card Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 31 | secondYellow | Is this a second yellow? |
| 32 | secondYellowCard | Second yellow card flag |
| 33 | redCard | Straight red card |

## Shot Position Qualifiers

| ID | Name | Notes |
|----|------|-------|
| 395 | shotStartX | X coordinate of shot origin (0-100) |
| 396 | shotStartY | Y coordinate of shot origin (0-100) |
| 230 | shotEndX | X coordinate where shot crossed goal plane |
| 231 | shotEndY | Y coordinate where shot crossed goal plane |
