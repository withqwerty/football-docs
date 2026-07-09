# Event-Derived Metric Recipes

Use kloppy-style normalised events when you need lightweight team or player metrics
from provider event feeds. These recipes are deliberately simple: label them as
derived estimates unless you are matching a provider's official metric definition
exactly.

## Coordinate convention

Pick one attacking coordinate convention before calculating metrics. A common
adapter convention is a 0-100 pitch where the acting team attacks towards `x=100`.
Under that convention:

| Zone | Rule |
|---|---|
| own defensive half | `x < 50` |
| opponent half | `x >= 50` |
| final third | `x >= 66.7` |
| high-press opponent build-up zone | opponent passes with `x < 60` |
| pressing action zone | pressing-team defensive actions with `x > 40` |

Do not assume raw providers all arrive in this convention. Opta event coordinates
are already 0-100 in attack direction, StatsBomb uses a 120x80 event pitch, and
tracking feeds often use metre-based or centre-origin coordinates. Transform first,
then calculate.

## End coordinates

For passes and carries, keep both start and end coordinates.

| Surface | Typical field |
|---|---|
| kloppy event start | `event.coordinates.x`, `event.coordinates.y` |
| kloppy event end | `event.end_coordinates.x`, `event.end_coordinates.y` |
| pandas export | `coordinates_x`, `coordinates_y`, `end_x`, `end_y` |
| Opta raw pass end | qualifiers `140` and `141` |
| Wyscout pass/carry end | `pass.endLocation` / `carry.endLocation` |
| StatsBomb pass/carry end | provider pass/carry end-location fields |

If end coordinates are missing, do not calculate xT, progressive-pass distance,
or pass vectors for that event.

## xT from pass and carry events

Expected threat can be implemented as a zone-grid delta for completed ball
movements:

```text
xT = value(end zone) - value(start zone)
```

Apply the delta to completed passes and completed carries only. Failed passes,
missing coordinates, shots, fouls, and defensive actions should contribute `0` or
be excluded, depending on whether your API reports total event contribution or
only successful attacking movement. Negative deltas are valid when the ball moves
away from goal.

State the grid source in your output. For example, a public 12x8 grid can be used
for fast product analytics, while socceraction can be used for SPADL/VAEP-style
models when you need a fuller action-value pipeline.

## Progressive passes

A simple 0-100 implementation counts a completed pass as progressive when:

```text
end_x - start_x >= 10
```

This is useful for quick product surfaces, but it is not the same as every
provider's official progressive-pass definition. Wyscout progressive-pass metrics,
for example, use their own glossary and are available as provider aggregates where
covered. Do not mix a custom `end_x - start_x >= 10` count with provider
advanced-stat totals without labelling the source.

## Player dossier progression recipe

Use this recipe when an agent asks for a player dossier, progression plot,
player pass map, take-on panel, shot-action summary, or single-player xT view
from normalised event rows.

| Action set | Required fields | Derived fields |
|---|---|---|
| passes | player id, team id, event id, period/clock, start `x`/`y`, end `x`/`y`, outcome | `cross`, `progressive`, `xT`, threat class |
| take-ons | player id, team id, event id, period/clock, start `x`/`y`, outcome | success rate, next same-team threat action within a labelled time window |
| shots | player id, event id, period/clock, `x`/`y`, result, body part, play kind | `xg`, `xg_source`, `zone_xT`, shot-result counts |
| totals | all included action rows | pass count, completed passes, crosses, progressive passes, take-ons won, shots, goals, total xT |

Implementation notes:

- Filter to one player before plotting so the chart reads as a dossier rather
  than a team pass map.
- Require both start and end coordinates for pass vectors, progressive-pass
  flags, and xT deltas. Missing end coordinates should drop that action from
  vector/xT views rather than defaulting to zero.
- For Opta-shaped pass events, end coordinates come from qualifiers `140` and
  `141`; qualifier `2` marks crosses, qualifier `4` marks through balls, and
  qualifier `196` marks switches of play.
- For Wyscout, prefer provider tags such as `progressive_pass`,
  `progressive_run`, `shot_assist`, and `deep_completition` when consuming event
  tags; preserve the provider spelling in adapter code.
- A "next threat" after a take-on should be explicitly labelled as a product
  rule, for example the first same-team pass, carry, or shot within 10-15
  seconds that adds positive xT. Do not present it as a provider event type.
- Use a stable xT grid or model version and expose the threshold used for
  colours such as "threatening pass" (`xT > 0.02`, `xT > 0.05`, etc.).
- Shot body-part and play-kind logic is provider-specific. Opta body-part
  qualifiers include `72` left foot, `20` right foot, `15`/`3` head, and `21`
  other; set-piece qualifiers such as `6` corner, `9` penalty, and `26`
  free-kick shot should be mapped before grouping.

For public APIs, include both row-level actions and aggregate totals. This lets a
UI draw pass/progression lines, take-on markers, and shot markers while also
showing a compact summary. Label every derived field (`derived_xT`,
`derived_progressive`, `next_threat_window_ms`) so it is not confused with a
provider official aggregate.

## As-at-playhead cumulative metrics recipe

Use this recipe when an agent asks for live match metrics, "up to playhead"
analysis, cumulative xG/xT/PPDA/field-tilt panels, video-synced match summaries,
or an event-derived table that updates as playback advances.

The robust pattern is to precompute metric deltas from the normalised event feed,
then build cumulative rows on the canonical match clock. A video player should
look up the latest cumulative row at the current football time; it should not
recompute event metrics on every animation frame.

| Output field | Source fields | Rule |
|---|---|---|
| `event_key` | provider event id, period, event index | Stable row id for the source event. Keep provider id and row order when both are available. |
| `canonical_clock` | period plus milliseconds since period kick-off | Use the same period-local clock used for event, tracking, and media sync. |
| `metric_delta` | event type, team, player, coordinates, outcome, xG/xT fields | Store per-event contributions such as `shot_count_delta`, `xg_delta`, `xT_delta`, `final_third_touch_delta`, `ppda_pass_allowed_delta`, and `ppda_def_action_delta`. |
| `team_cumulative` | ordered metric deltas grouped by team | Emit running totals by team after each event or after declared time buckets. |
| `player_cumulative` | ordered metric deltas grouped by player | Emit only metrics where the actor identity join is proven. Do not attribute team-only deltas to a guessed player. |
| `score_state` | confirmed goal events and own-goal rules | Update from confirmed match-score events only. Keep disallowed goals, shootout penalties, and corrections as explicit states. |
| `metric_version` | grid, thresholds, included event types, provider model source | Version every derived metric family so later chart reads can explain what changed. |
| `quality_flags` | missing xG, missing end coordinates, unknown player, clock disorder, unavailable denominator | Return null/unavailable states rather than filling with zero when the source cannot support the metric. |

Core rule: cumulative match metrics are step functions over event time. Sort by
`canonical_clock`, then a stable provider order. Do not interpolate cumulative
xG, xT, PPDA, field tilt, score, or shot counts across dead time.

Safety rule: provider official aggregates and event-derived as-at metrics are
different products. Use provider official match totals where the chart asks for
final official numbers; use event-derived deltas when the chart asks "what did
we know by this playhead time?"

Implementation notes:

- Build one event-delta table first, then derive team and player cumulative
  views from it. This keeps xT, xG, shot count, and score panels reconcilable
  because they share the same event ordering.
- For a video playhead, convert media seconds to `canonical_clock`, then binary
  search the cumulative table for the latest row at or before that period-local
  time. If the selected asset has no sync, disable as-at metrics rather than
  using raw media time.
- Keep ratio metrics as numerator and denominator accumulators. For PPDA, field
  tilt, shot conversion, or pass completion, serialise the ratio as `null` when
  the denominator is zero or unavailable.
- Treat xG and xT as separate model families. Do not sum provider xG, a custom
  xT grid, and a VAEP/OBV model into one "threat" column unless a product-level
  model explicitly defines that blend.
- Rebuild cumulative state after corrections rather than patching visible totals
  in place. Duplicate events, late corrections, and disallowed goals should
  appear as quality or correction states tied to the raw event stream.
- For player panels, aggregate only actor-owned actions unless the metric
  definition explicitly shares credit, such as a documented xGChain model.

## Field tilt

Field tilt is usually the team's share of final-third touches:

```text
team_final_third_touches / all_final_third_touches
```

With the 0-100 attacking convention, count located touch or on-ball events where
`x >= 66.7`. If neither team has a final-third touch, return `0` for both teams
or mark the metric unavailable consistently; do not divide by zero.

## Territory chart and field-tilt recipe

Use this recipe when an agent asks for a territory chart, field-tilt chart,
touch map, final-third touch share, or progressive-pass territory view from
normalised provider events.

| Step | Rule | Caveat |
|---|---|---|
| Normalise coordinates | Convert every provider into one attacking convention, such as 0-100 with the acting team attacking towards `x=100`. | Do this before applying any third, half, or zone threshold. |
| Select touch events | Count located on-ball events for each team: passes, carries, receptions, shots, recoveries, and other intentional touches if your event model exposes them. | State the included event types; providers differ on whether duels, deflections, or fouls count as touches. |
| Calculate field tilt | `team_final_third_touches / all_final_third_touches`, with final third usually `x >= 66.7` after normalisation. | If the denominator is zero, return `0` for both teams or `null`, but do not divide by zero. |
| Build fixed-zone territory | Bin the selected events into 3x3 or 5x3 pitch zones and label each zone as a share of the selected event set. | Fixed-zone territory is not a smoothed heatmap; use a heatmap/KDE only when local density is the story. |
| Add progression context | For passes, require both start and end coordinates; a simple product rule is `end_x - start_x >= 10`. | Label the threshold and do not mix it with provider official progressive-pass aggregates without explanation. |

For cross-provider comparisons, keep the metric label explicit: for example,
`event_derived_field_tilt`, `final_third_touch_share`, or
`provider_official_final_third_entries`. A chart should not silently combine a
custom touch count with a provider aggregate in the same series.

## PPDA

PPDA is passes allowed per defensive action. A lightweight event-derived version:

```text
opponent_completed_passes_in_build_up_zone / pressing_team_defensive_actions
```

Under the 0-100 acting-team convention:

| Component | Example rule |
|---|---|
| passes allowed | opponent completed passes with `x < 60` |
| defensive actions | pressing-team tackles, interceptions, challenges, and fouls with `x > 40` |

Lower PPDA means more intense pressing. If the defensive-action denominator is
zero, the value is infinite or unavailable; serialise it as `null` in JSON rather
than `0`.

## Output labelling

For public APIs and chart layers, include the metric source:

| Metric | Recommended label |
|---|---|
| custom xT grid | `derived_xT` or `xT_model` with grid version |
| custom PPDA | `event_derived_PPDA` |
| provider PPDA | provider name plus endpoint/source |
| custom progressive pass count | threshold and coordinate convention |
| field tilt | event types counted and coordinate convention |

This makes it clear when a chart is using provider aggregates versus metrics
computed from normalised event rows.
