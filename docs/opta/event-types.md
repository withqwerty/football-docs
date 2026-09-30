# Opta Event Types (F24 Specification)

Opta's event stream uses numeric `typeId` values on each event. Source: F24 Appendix 1.
The IDs and names are checked against Stats Perform's event type table for the
MA36 feed (August 2025), and against the Opta type lists in socceraction 1.5.3
(`socceraction.data.opta.loader`) and kloppy 3.19 (`statsperform` deserializer).

## Event Type Reference

Outcome rules are from F24 Appendix 8 unless the note says otherwise.

| typeId | Name | Outcome | Notes |
|--------|------|---------|-------|
| 1 | Pass | 0=miss, 1=success | Includes open play, goal kicks, corners, free kicks played as passes |
| 2 | Offside pass | always 1 | Receiving player called offside |
| 3 | Take on | 0=fail, 1=success | Dribble past opponent |
| 4 | Foul | 0=committed, 1=fouled | Events come in pairs (one per team) |
| 5 | Out | 0=put out, 1=gains possession | Ball out of play |
| 6 | Corner awarded | 0=conceded, 1=won | |
| 7 | Tackle | 0=fail, 1=wins ball | Legal ground-level challenge |
| 8 | Interception | always 1 | Intercepts opposition pass |
| 10 | Save | always 1 | GK prevents goal (also outfield with qual 94) |
| 11 | Claim | 0=drops, 1=catches | GK catches crossed ball |
| 12 | Clearance | always 1 | Defensive clearance |
| 13 | Miss | always 1 | Shot wide or over |
| 14 | Post | always 1 | Ball hits frame |
| 15 | Attempt saved | always 1 | Shot on target, saved |
| 16 | Goal | always 1 | Own goals have qualifier 28 |
| 17 | Card | always 1 | Yellow/second yellow/red via qualifiers 31/32/33 |
| 18 | Player off | always 1 | Substituted off |
| 19 | Player on | always 1 | Substituted on |
| 20 | Player retired | always 1 | Player leaves the pitch, for example injured, with no substitution. Not a red card |
| 21 | Player returns | always 1 | Player comes back on after leaving the pitch |
| 27 | Start delay | always 1 | Play stops for a delay. With qualifier 364, a VAR review |
| 28 | End delay | always 1 | The delay ends and play restarts |
| 30 | End | always 1 | End of a period. kloppy reads the period end time from it |
| 32 | Start | always 1 | Start of a period. kloppy reads the period start time from it |
| 34 | Team set up | always 1 | Formation/lineup event |
| 37 | Collection end | always 1 | |
| 40 | Formation change | always 1 | In-game formation change |
| 41 | Punch | always 1 | GK punches the ball |
| 42 | Good skill | always 1 | |
| 43 | Deleted event | always 1 | Opta removed this event. Drop it before analysis; kloppy does |
| 44 | Aerial | 0=lost, 1=won | Aerial duel. Events come in pairs |
| 45 | Challenge | always 0 | Unsuccessful tackle attempt |
| 49 | Ball recovery | always 1 | Player gathers loose ball |
| 50 | Dispossessed | always 1 | Loses ball via opponent tackle |
| 51 | Error | always 1 | Mistake losing ball |
| 52 | Keeper pick-up | always 1 | GK picks up ball |
| 54 | Smother | always 1 | GK covers ball at attacker's feet |
| 55 | Offside provoked | always 1 | Defender's position causes offside |
| 59 | Keeper sweeper | 0=possession goes to the other team, 1=kept or put out of play | GK comes off line to clear/claim |
| 61 | Ball touch | 0=lost control, 1=ball hit the player unintentionally | Bad touch / loss of control |
| 67 | 50/50 | 0=lost, 1=won | Two players contest loose ball. F24: not collected since 10 July 2023 |
| 74 | Blocked pass | always 1 | Player blocks an opponent's pass |
| 83 | Attempted tackle | not defined in F24 | Unsuccessful tackle |
| 84 | Deleted after review | — | An event deleted after a VAR review (from 1 March 2021). Qualifier 436 gives its typeId before deletion; a goal ruled out by VAR has 436 = `16` |

A dash means the outcome has not been checked for that type.

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
| 3 | Extra time, first half |
| 4 | Extra time, second half |
| 5 | Penalty shoot-out |
| 14 | Post-match / full-time |
| 16 | Pre-match |

## Event-stream validation recipe

Use this recipe when an agent asks for Opta/WhoScored event-feed validation,
logical event checks, state-transition tests, duplicate event handling, missing
goal detection, or data-quality gates before deriving metrics such as xT, VAEP,
PPDA, pass maps, dead-time, or game-state timelines.

| Check | Source fields | Rule |
|---|---|---|
| `event_identity` | event id, match id, period, clock, team, player, typeId | Keep the raw provider event id as the primary audit key. If the feed lacks a stable id, build a scoped fingerprint and mark it inferred. |
| `clock_order` | period id, `timeMin`, `timeSec`, `expandedMinute`, sequence index | Sort by period-aware clock plus provider sequence, not by display minute or array order alone. |
| `duplicate_events` | event id or scoped fingerprint | De-duplicate exact repeats before state machines; keep a duplicate count in `quality_flags`. |
| `paired_events` | typeId `4` fouls, typeId `5` outs, duel events, `relatedEventId` where available | Validate expected pairs or links, but do not fabricate the missing side. |
| `scoreline_consistency` | typeId `16` goals, qualifier `28`, typeId `84` with qualifier `436` = `16`, final score | Reconstruct valid goals and compare with the final score. A goal that VAR rules out becomes typeId `84`, not a typeId `16` event. Flag mismatches rather than forcing the event stream to agree. |
| `lineup_state` | typeIds `18`, `19`, `20`, `21`, `34`, `40`, qualifiers `130`, `131`, `145` | Check that substitutions and formation changes do not create impossible on-pitch player states. |
| `coordinate_bounds` | event `x`/`y`, pass end qualifiers `140`/`141`, goal-mouth qualifiers `102`/`103` | Validate against the field-specific coordinate scale before calculating derived metrics. |
| `raw_vs_corrected` | raw event row plus validation output | Store validation flags and any corrected interpretation separately from raw provider facts. |

Core rule: validation should produce quality flags and corrected interpretation
layers, not overwrite the raw event stream. Downstream metrics can choose whether
to exclude, repair, or display flagged rows.

Safety rule: an impossible transition is not proof that the provider event type
is wrong. It may be a missing event, duplicate event, clock-ordering issue,
licence-tier omission, or parser bug. Preserve enough evidence to inspect it.

Implementation notes:

- Run validation before metric derivation. xT, VAEP, pass networks, dead-time
  models, and game-state filters all inherit event ordering and scoreline errors.
- Keep period boundaries explicit. Do not let pre-match, half-time, full-time,
  extra-time, or post-match events leak into normal in-play state machines.
- Treat duplicate rows differently from paired rows. Fouls, duels, and ball-out
  sequences can legitimately involve more than one event at the same clock.
- Validate scoreline reconstruction with the same rules used in charting:
  count typeId `16` goals, credit own goals with qualifier `28` to the opponent,
  and do not count goals deleted after review (typeId `84`). Qualifier `8` sits on
  the offside pass (typeId `2`) that led to a disallowed goal, not on goal events.
- For coordinate checks, validate each coordinate family separately. Pitch
  coordinates, pass-end qualifiers, and goal-mouth qualifiers do not share the
  same scale.
- Return a compact `quality_flags[]` array per event and a match-level summary
  with counts for duplicates, ordering fixes, missing links, score mismatches,
  coordinate failures, and unavailable checks.
