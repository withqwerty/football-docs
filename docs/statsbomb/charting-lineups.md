# StatsBomb Lineups and Team Sheets

## Lineup data surfaces

StatsBomb team-sheet work is a multi-payload join. The separate lineups payload
has the match-day squad and position intervals; the event stream has the
formation and explicit lineup-change events.

| Need | Best StatsBomb surface | Notes |
|---|---|---|
| Match-day squad, shirt numbers, cards | `lineups/{match_id}.json` or `GET /api/v4/lineups/{mid}` | One object per team. The `lineup` array includes starters and substitutes. |
| Position intervals | player `positions[]` inside the lineups payload | Each interval has `from`, `to`, `from_period`, `to_period`, `start_reason`, and `end_reason`. |
| Kickoff formation and slots | event type `35` (`Starting XI`) | The event carries `tactics.formation` and `tactics.lineup[]` with player, position, and jersey number. |
| Substitution events | event type `19` (`Substitution`) plus lineups `positions[]` | Use the explicit substitution event and/or interval boundaries. Do not infer usage from bench membership alone. |
| Tactical shifts | event type `36` (`Tactical Shift`) | Same tactics shape as Starting XI, but describes an in-game formation or position change. |

Open Data and the commercial API use the same conceptual split for these core
entities. Open Data stores them as files; the commercial API exposes lineups via
`/api/v4/lineups/{mid}` and events via `/api/v8/events/{mid}`.

## Building starters, bench, and formation

A practical team-sheet flow:

1. Load the lineups payload and keep every team `lineup[]` player.
2. Mark starters from a position interval whose `start_reason` is `Starting XI`,
   or from the event type `35` `tactics.lineup[]`.
3. Mark bench players as the remaining match-day squad members unless an
   availability field in your licensed feed says otherwise.
4. Read the kickoff formation from event type `35` `tactics.formation`.
5. Use `tactics.lineup[].position` for kickoff position or slot labels.
6. Join substitutions from event type `19` and lineups `positions[]` intervals.
7. Join tactical changes from event type `36` if the chart needs in-game shape,
   not just the kickoff team sheet.

The lineups payload is not just the starting XI. A player can appear in
`lineup[]` with no interval starting at `00:00`, then enter later through a
`Substitution` interval. Conversely, a starter can have a later interval ending
with `Substitution` or `Tactical Shift`.

## Position intervals

Each lineups player can carry multiple `positions[]` entries:

| Field | Team-sheet use |
|---|---|
| `position_id` / `position` | Display role for the interval. |
| `from` / `from_period` | Entry time for that role. |
| `to` / `to_period` | Exit time for that role; `null` means through the final whistle or current interval end. |
| `start_reason` | Why the interval started: `Starting XI`, `Substitution`, or `Tactical Shift`. |
| `end_reason` | Why the interval ended: `Substitution`, `Tactical Shift`, `Final Whistle`, etc. |

For a static lineup card, use the interval that starts with `Starting XI`. For a
timeline, formation animation, or minute-specific pitch view, resolve the active
interval by period and timestamp.

## What not to infer

Keep these boundaries explicit:

| Tempting inference | Safer handling |
|---|---|
| Every lineups player is a starter | Starters require `Starting XI` evidence. |
| Every bench player was used | Used substitutes require a `Substitution` event or interval. |
| Team sheets contain player ratings | Ratings are not part of the open-data lineups/events seam. Use commercial player stats only when licensed and present. |
| `tactics.formation` is minute-by-minute state | It is tied to Starting XI and Tactical Shift events. Reconstruct state from those events if needed. |
| Position intervals are x/y coordinates | They are role intervals, not explicit pitch coordinates. Use event locations or 360 frames for spatial analysis. |

## Implementation checks

When building an adapter or chart from StatsBomb lineups, include fixtures for:

| Case | Expected handling |
|---|---|
| Substitute appears in `lineup[]` but has no type `19` event | Keep them on the bench / unused. |
| Starter has multiple `positions[]` intervals | Use the first `Starting XI` interval for kickoff; later intervals are tactical state. |
| Tactical Shift event changes formation | Update in-game formation state from type `36`. |
| Missing player rating field | Render the team sheet without ratings. |
| `to` and `to_period` are `null` | Treat the interval as active through the final whistle or current endpoint. |
