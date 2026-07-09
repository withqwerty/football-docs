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

## Match drama score recipe

Use this recipe when an agent asks for a post-match entertainment score, drama
ranking, blockbuster index, weekend replay chart, or match receipt from
Opta/WhoScored-style event timelines.

| Component | Source | Rule |
|---|---|---|
| total goals | final score or valid goal timeline | Cap at a stated football-realistic maximum rather than min-maxing a single match. |
| lead changes | running scoreline milestones | Count only changes from one non-level leader to the other; drawing level is not a lead change unless your product says so. |
| comeback | running scoreline plus final result | Label whether it means draw-from-behind, win-from-behind, or both. |
| late drama | goal milestones | Count goals after a declared minute threshold, such as 80, only when they change match state. |
| xG swing | shot xG events split by half or interval | Compare expected-goal differential between periods; return unavailable if xG is not licensed. |
| possession volatility | possession intervals, where available | Count flips in the possession-leading team across stable intervals; do not infer this from final possession alone. |
| spectacle/flair | event types and qualifiers | Examples include volleys, direct free kicks, long-range goals, good-skill events, and successful take-ons. |

Implementation notes:

- Build the score from named components, then expose both the final score and the
  component values. A one-number drama score without components is hard to audit.
- Keep provider facts separate from product judgements. `lead_changes`,
  `late_drama_goals`, and `xg_swing` can be derived facts; `entertainment_score`
  is a product metric with chosen weights and caps.
- Use absolute caps for per-match components, then document them. Cross-match
  min-max normalisation can make early-season rankings unstable.
- Treat missing optional sources honestly: if xG, xGOT, or possession intervals
  are unavailable, either omit those components or use a labelled neutral value.
- Use the same valid-goal reconstruction rules as the rest of this document:
  disallowed goals do not count, and own goals are credited to the opponent.
- Do not compare scores across providers unless component definitions, event
  inclusion rules, and optional-source fallbacks are aligned.

## Dead-time and restart-gap recipe

Use this recipe when an agent asks for a ball-in-play approximation, dead-time
barcode, restart-gap chart, goalkeeper hold-time chart, or time-wasting split
from Opta/WhoScored-style event streams.

This is an event-derived model, not official Opta ball-in-play data. Label it as
`event_derived_dead_time` or similar unless your feed explicitly provides
official ball-in-play intervals.

| Transition | Event rule | Notes |
|---|---|---|
| play to dead | typeId `5` ball out, typeId `16` goal, typeId `27` start delay, typeId `4` foul | For paired foul/out events, define which outcome/team is treated as the causer. |
| dead to play | typeId `1` pass with restart qualifier `107`, `124`, `6`, `279`, or `5`; or typeId `28` end delay | Qualifier `107` = throw-in, `124` = goal kick in many JSON exports, `6` = corner, `279` = kick-off/restart, `5` = free kick. |
| restart gap | dead trigger timestamp to matching restart pass timestamp | Keep restart type, period, time, and restarting team. |
| goal-to-restart gap | goal event to following kick-off/restart | Useful for post-goal delay stories; keep it separate from generic ball-out gaps. |
| dead-time barcode | dead segments over period start/end bounds | Render halves separately and show the half-time gap as a gap, not as dead time. |
| winning/losing split | dead segment causer plus running scoreline | Treat as coarse attribution; do not present it as official time-wasting proof. |

Implementation notes:

- Process each period independently. Close any open dead segment at the period
  end so half-time does not inflate dead time.
- De-duplicate duplicate event rows before building the state machine; event
  streams can contain paired or repeated rows at the same timestamp.
- Cap or flag very long segments such as VAR reviews, injuries, or data gaps so
  one malformed interval does not dominate a match barcode.
- Corners are best measured from corner-awarded to corner-taken; throw-ins, goal
  kicks, and free kicks can use the prior ball-out or foul trigger.
- Preserve announced added-time fields separately from played added time. The
  difference is a derived story metric, not a provider score.
- If the product needs exact BIP, prefer a provider metric such as StatsBomb
  `team_match_ball_in_play_time` or a tracking/physical feed with explicit BIP
  phases.

## Video-synced moment timeline recipe

Use this recipe when an agent asks for a dense match timeline, video-synced
event list, clustered moments, playhead marker, seek-to-event behaviour, or
automatic clip ranges from an Opta/WhoScored-style event feed.

| Output field | Source | Rule |
|---|---|---|
| `event_id` | provider event id | Keep stable IDs so clips, pins, and related-event links survive re-renders. |
| `period` / `start_ms` / `end_ms` | event clock, qualifiers, and neighbouring events | Convert minute/second fields to a period-local millisecond clock; derive a short span for point events. |
| `media_seconds` | video offset map or external sync table | Store separately from match clock; leave null when the event cannot be synced to the selected angle. |
| `kind` | event type and qualifiers | Classify headline moments such as `goal`, `shot`, `card`, `substitution`, `restart`, or `cluster`. |
| `events[]` | events grouped into one moment | Cluster near-simultaneous events in the same period so rebounds, cards, fouls, and restarts do not overwhelm the timeline. |
| `clip_start_ms` / `clip_end_ms` | moment span plus padding | Add a declared lead-in/lead-out, but clamp inside the period and available media range. |
| `link_method` | sync provenance | Distinguish provider video offsets, external manual sync, inferred offset, and unavailable sync. |

Implementation notes:

- Keep match time and media time as different clocks. A period-local event at
  `57:34` may map to a different `media_seconds` on each video angle.
- Sort by period and millisecond clock, not by array order or display minute
  alone. Stoppage-time labels can be duplicated while the underlying clock is
  still ordered.
- Cluster events with a small, declared window, then choose a headline event by
  priority: goal, shot, card, substitution, restart/dead-ball, then generic
  cluster. Keep the original events in the moment for audit and filters.
- For "up to playhead" analysis views, include only events whose synced
  `media_seconds` is known and less than or equal to the selected media time.
  Events without sync should be excluded from playhead-window counts rather than
  guessed into the window.
- Seek behaviour should land slightly before the moment start so the action is
  visible. Clip generation should use the full moment span plus padding.
- If a feed has video endpoints with official offsets, such as Wyscout video
  offsets, prefer those offsets. For Opta-only feeds, require an external sync
  table or state that video sync is unavailable.

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
