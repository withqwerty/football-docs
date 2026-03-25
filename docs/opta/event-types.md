# Opta Event Types (F24 Specification)

Opta's event stream uses numeric `typeId` values on each event. Source: F24 Appendix 1.

## Event Type Reference

| typeId | Name | Per match avg | Outcome | Notes |
|--------|------|---------------|---------|-------|
| 1 | Pass | ~925 | 0=miss, 1=success | Includes open play, goal kicks, corners, free kicks played as passes |
| 2 | Offside pass | ~3 | always 1 | Receiving player called offside |
| 3 | Take on | ~35 | 0=fail, 1=success | Dribble past opponent |
| 4 | Foul | ~44 | 0=committed, 1=fouled | Events come in pairs (one per team) |
| 5 | Out | ~106 | 0=put out, 1=gains possession | Ball out of play |
| 6 | Corner awarded | ~18 | 0=conceded, 1=won | |
| 7 | Tackle | ~32 | 0=fail, 1=wins ball | Legal ground-level challenge |
| 8 | Interception | ~13 | always 1 | Intercepts opposition pass |
| 10 | Save | ~11 | always 1 | GK prevents goal (also outfield with qual 94) |
| 11 | Claim | ~2 | 0=drops, 1=catches | GK catches crossed ball |
| 12 | Clearance | ~53 | always 1 | Defensive clearance |
| 13 | Miss | ~9 | always 1 | Shot wide or over |
| 14 | Post | <1 | always 1 | Ball hits frame |
| 15 | Attempt saved | ~11 | always 1 | Shot on target, saved |
| 16 | Goal | ~2.5 | always 1 | Own goals have qualifier 28 |
| 17 | Card | ~4 | always 1 | Yellow/second yellow/red via qualifiers |
| 18 | Player off | ~9 | always 1 | Substituted off |
| 19 | Player on | ~1 | always 1 | Substituted on |
| 27 | Start delay | ~3 | always 1 | Kick-off / restart |
| 28 | End delay | ~3 | always 1 | Period end |
| 30 | End | ~6 | always 1 | Match end event |
| 32 | Ball recovery | ~4 | always 1 | Gathering loose ball |
| 34 | Team set up | ~2 | always 1 | Formation/lineup event |
| 37 | Half end | ~2 | always 1 | Half-time |
| 40 | Blocked pass | ~4 | always 1 | Player blocks opponent pass |
| 41 | Player retired | ~1 | always 1 | Player leaves match |
| 42 | Player returns | <1 | always 1 | Player returns (injury) |
| 43 | Formation change | varies | always 1 | In-game formation change |
| 44 | Aerial | ~60 | 0=lost, 1=won | Aerial duel |
| 45 | Challenge | ~15 | always 0 | Unsuccessful tackle attempt |
| 49 | Ball recovery | ~80 | always 1 | Player gathers loose ball |
| 50 | Dispossessed | ~10 | always 1 | Loses ball via opponent tackle |
| 51 | Error | ~1 | always 1 | Mistake losing ball |
| 52 | Keeper pick-up | ~5 | always 1 | GK picks up ball |
| 54 | Smother | <1 | always 1 | GK covers ball at attacker's feet |
| 55 | Offside provoked | ~3 | always 1 | Defender's position causes offside |
| 59 | Keeper sweeper | ~5 | always 1 | GK comes off line to clear/claim |
| 61 | Ball touch | ~3 | always 1 | Bad touch / loss of control |
| 67 | 50/50 | ~2 | 0=lost, 1=won | Two players contest loose ball |
| 74 | Blocked pass | ~10 | always 1 | Alternative blocked pass type |
| 83 | Attempted tackle | ~15 | always 0 | Unsuccessful tackle |

## Shot Events

Shot events are types 13 (miss), 14 (post), 15 (attempt saved), and 16 (goal). All share the same qualifier set for location, body part, and shot details.

## Outcome Values

| Value | Meaning |
|-------|---------|
| 0 | Unsuccessful |
| 1 | Successful |

## Period IDs

| Value | Meaning |
|-------|---------|
| 1 | First half |
| 2 | Second half |
| 14 | Post-match / full-time |
| 16 | Pre-match |
