# Opta Game-State and Running Scoreline Charts

## Reconstructing running scoreline

Game-state charts, pass-map filters, and win-probability stories often need a
minute-by-minute scoreline reconstructed from the Opta/WhoScored event stream.
Use the goal events rather than final-score fields when you need the state at a
specific match minute.

| Field or qualifier | Meaning |
|---|---|
| typeId `16` | goal event |
| qualifier `8` | disallowed goal; exclude from scoreline reconstruction |
| qualifier `28` | own goal; credit the opposing team, not the event `contestantId` |
| event `contestantId` / `teamId` | team attached to the event |
| `timeMin` + `timeSec` | event clock in the Opta feed |
| `minute` + `second` / `expandedMinute` | common WhoScored-shaped equivalents |

When consuming a WhoScored-shaped event payload, prefer `expandedMinute` for
game-state filters because it keeps stoppage-time order usable. A pass at 45+3
should sort after minute 45 events, not collapse into the same minute bucket.

Recommended scoreline reconstruction:

1. Select goal events: Opta typeId `16`, or `isGoal === true` in a WhoScored-shaped
   event model.
2. Drop any goal carrying qualifier `8` (`goalDisallowed`).
3. If qualifier `28` (`ownGoal`) is present, add the goal to the opponent's
   score; otherwise add it to the event team.
4. Sort goals by period and clock/expanded minute.
5. Build milestones `(minute, homeScore, awayScore)`, then binary-search them for
   any requested minute.

Do not infer in-play score state from final score or from a provider's current
score snapshot unless the provider explicitly returns the full scored-at timeline.

## Pass-map game-state filters

For pass maps split by state, derive a minute filter from the running scoreline
timeline, then apply it to event-level passes before aggregating nodes or edges.

Common analysis states:

| State | Definition |
|---|---|
| `level0` | score is 0-0 |
| `winning` | selected team is ahead |
| `losing` | selected team is behind |
| `drawing` | scores are level but not 0-0, if you choose to expose it |

Use expanded minutes or period-aware clocks for the filter. If the pass event only
has period-local minute/second fields, convert them to a continuous match minute
before applying states such as "after minute 60" or "while losing".

## Season minutes-ahead recipe

Use this recipe when an agent asks for a minutes-ahead chart, percent of season
spent leading, time spent drawing/trailing, comeback-rate panel, or club dashboard
from Opta/WhoScored-style event timelines.

| Aggregate | Minute states to include | Display |
|---|---|---|
| leading share | selected team score greater than opponent score | `% of observed match minutes spent leading` |
| drawing share | score is level, including `0-0` unless split separately | `% of observed match minutes spent drawing` |
| trailing share | selected team score lower than opponent score | `% of observed match minutes spent trailing` |
| comeback denominator | matches with more than a labelled threshold of trailing time | count the threshold in minutes, e.g. `> 10` |
| rescued points | matches from the comeback denominator ending in win or draw | rate or count, labelled as a project metric |

Implementation notes:

- Build the same running scoreline timeline once per match, then derive minute
  states for both teams from that single source.
- Use observed match duration as the denominator when stoppage-time events extend
  beyond 90 minutes. Do not silently divide every match by 90 if the chart includes
  90+ minutes.
- Decide whether `level0` is a separate state or part of drawing before aggregating
  across matches; expose the choice in the API response or chart notes.
- For stacked bars, store both raw minute counts and percentages so labels can
  survive rounding.
- Penalty shootouts should not contribute to normal leading/drawing/trailing
  minutes unless the story explicitly models shootout state.
- If the event feed lacks a reliable goal timeline, do not backfill minute states
  from the final score. Return the aggregate as unavailable for that match.

## Win-probability game-state stories

For richer season or match stories, the same scoreline timeline can drive a
minute-by-minute win-probability model. Combine:

| Input | Role |
|---|---|
| pre-match strength estimate such as Elo | baseline win probability |
| scoreline at each minute | in-play state |
| time remaining | probability decay / comeback window |
| red-card events | optional team-strength adjustment |
| final score and fixture metadata | validation and display |

Keep the model labels separate from the raw event data. Terms such as
`comfortable`, `protecting`, `level`, `chasing`, or `desperate` are project
classifications layered on top of the Opta event stream, not provider event types.

## Edge cases to test

Add tests or fixtures for these cases when implementing game-state logic:

| Case | Expected handling |
|---|---|
| Disallowed goal with qualifier `8` | does not change scoreline |
| Own goal with qualifier `28` | increments the opposing team's score |
| Multiple goals in stoppage time | sorted by expanded minute / period-aware clock |
| Goal before a pass-map window | affects every later pass in that team's state |
| Penalty shootout or post-match period | exclude from normal 90/120-minute state unless explicitly modelling shootouts |
| Missing goal timeline | do not fabricate states from final score alone |
