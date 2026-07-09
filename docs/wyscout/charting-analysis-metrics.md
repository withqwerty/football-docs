# Wyscout Analysis Metrics and Story Charts

## Metric data surfaces

Wyscout exposes two useful surfaces for analysis charts:

| Need | Best Wyscout surface | Notes |
|---|---|---|
| Pre-computed match/team metrics | `GET /matches/{wyId}/advancedstats` | Team-level xG/xA, PPDA, possession-adjusted, progression, and related aggregates where covered. |
| Pre-computed player metrics for one match | `GET /matches/{wyId}/advancedstats/players` | One call for all player match advanced stats; use `details=player` for labels. |
| Aggregated team metrics | `GET /teams/{wyId}/advancedstats?compId={compId}` | Accepts `seasonId`, `roundId`, and `matchDay` filters. |
| Aggregated player metrics | `GET /players/{wyId}/advancedstats?compId={compId}` | Accepts `seasonId`, `roundId`, and `matchDay` filters. |
| Event-tag-derived story slices | `GET /matches/{wyId}/events?details=tag` | Use when a chart needs exact event tags, locations, recipients, or possession context. |

Use pre-computed advancedstats for reporting tables and benchmark charts. Use
events when the chart needs transparent filtering logic, video sync, custom
zones, or possession-level reconstruction.

## Story metric fields and tags

For entertainment-index, player-profile, or tactical story charts, these
Wyscout concepts commonly appear together:

| Story concept | Advanced/glossary metric | Event tag or field to check |
|---|---|---|
| High press intensity | `PPDA` | Opponent passes in the final/lower 60 percent of the pitch divided by defensive actions: fouls, interceptions, won defensive duels, and sliding tackles. Lower is more intense. |
| Possession-adjusted defending | `PAdj` / `Opp30` | Use for defensive metrics only; it normalises defensive actions as if possession were balanced. |
| Progressive passing | Progressive passes | `progressive_pass` secondary tag. |
| Progressive carrying | Progressive runs | `progressive_run` secondary tag, or carry `progression` where consuming event payloads. |
| Deep completions | Deep completions | API tag is `deep_completition` for the pass completion; preserve the misspelt contract spelling. |
| Deep completed crosses | Deep completed crosses | `deep_completed_cross` secondary tag. |
| Chance creation | xA / shot assists | `shot_assist` is the pass leading to a shot; Wyscout xA is the xG value of that shot. |
| Counterpressing | Counterpressing recoveries | `counterpressing_recovery` secondary tag. |

Do not mix glossary display labels with API tag names without a mapping layer.
The glossary says "Deep completions"; the event API tag is
`deep_completition`.

## PPDA and pressing charts

PPDA is defined as opponent passes in the relevant high-press zone divided by
the pressing team's defensive actions in that same zone.

For a custom event-derived PPDA:

1. Select opponent pass events that start in the final/lower 60 percent zone
   used by your Wyscout convention.
2. Count pressing-team defensive actions in that zone: fouls, interceptions, won
   defensive duels, and sliding tackles.
3. Divide passes allowed by defensive actions.
4. Treat zero defensive actions as unavailable or infinite rather than zero.

Lower PPDA means the opponent completes fewer passes per defensive action, so it
is the stronger high-press signal. If using Wyscout advancedstats, keep the
provider value as the source of truth rather than recalculating from a partial
event export.

## xA and shot-assist charts

Wyscout xA belongs to shot assists. A pass should qualify as a shot assist before
it receives the xA value of the following shot. Regular passes, crosses, corners,
throw-ins, and free-kick deliveries can all produce shot assists. Suffered fouls
that produce penalties or direct free kicks should not be counted as assisted
goals for this purpose.

For cancelled or invalidated play, follow the provider event state: offside and
VAR-cancelled actions should not become xA-bearing assists if Wyscout excludes
the action.

## Implementation checks

When building Wyscout metric adapters or story charts, include tests for:

| Case | Expected handling |
|---|---|
| Deep completion tag | Match `deep_completition`, not a corrected `deep_completion`. |
| PPDA denominator is zero | Return unavailable/infinite, not `0`. |
| Lower PPDA value | Interpreted as stronger pressing. |
| PAdj metric | Use only for defensive metrics, not attacking output. |
| xA without shot assist | Do not assign xA to non-shot-assist passes. |
| Advancedstats missing for a competition | Fall back to event-derived counts only when the methodology is explicit. |
