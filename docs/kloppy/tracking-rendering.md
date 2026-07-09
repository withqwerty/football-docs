# kloppy Tracking Rendering Notes

## Rendering centre-origin tracking data

Several tracking providers use a pitch-centred coordinate frame. kloppy exposes the
provider coordinate system through the dataset metadata, so read the coordinate system
before drawing.

| Provider coordinate system | Typical dimensions | Origin | Unit |
|---|---|---|---|
| `secondspectrum` | `105 x 68` | centre | metres |
| `tracab` | `10500 x 6800` | centre | centimetres |
| `skillcorner` | `105 x 68` | centre | metres |

For a top-down 0-100 pitch display, a common centre-origin projection is:

```text
x100 = 50 + (x_m / pitch_length_m) * 100
y100 = 50 - (y_m / pitch_width_m) * 100
```

Use metres in the formula. For TRACAB-style centimetre feeds, convert first:
`x_m = x_cm / 100`, `y_m = y_cm / 100`. The `50 - ...` y formula is a display
choice that makes positive provider y render upward on a browser/canvas coordinate
system where screen y increases downward. If your renderer uses mathematical y-up
coordinates, keep y positive upward instead.

Do not hard-code `105 x 68` for every match when the provider metadata gives actual
pitch dimensions. Use the match or dataset `pitch_dimensions`, `pitch_length`, and
`pitch_width` fields where available.

## Frame windows and interpolation

Tracking feeds are frame sequences, usually exposed through kloppy as `Frame`
objects on a `TrackingDataset`.

| Field | Use |
|---|---|
| `frame_id` | frame ordering / cache key |
| `timestamp` | time within the period |
| `period` | first half, second half, extra time, etc. |
| `ball_coordinates` | ball position, often optional |
| `players_data[player].coordinates` | player position for the frame |
| `players_data[player].speed` | provider speed where available |
| `players_data[player].distance` | provider cumulative distance where available |
| `metadata.frame_rate` / `frame_rate` | frames per second, needed for interpolation and derived speeds |

For interactive rendering, stream small match-clock windows rather than the full
match into the browser. A 20 second window at 25 fps is roughly 500 frames. Interpolate
between neighbouring frames for smooth playback:

```text
frame_float = (target_ms - window_start_ms) / frame_dt_ms
i0 = floor(frame_float)
i1 = i0 + 1
frac = frame_float - i0
point = point0 + (point1 - point0) * frac
```

If either neighbouring player coordinate is missing, draw the non-missing point
without interpolation; if both are missing, omit that player for the frame.

## Ball live/dead handling

Some tracking exports distinguish live ball-in-play frames from dead-ball frames
or park the ball at a neutral location while play is stopped. If the feed exposes
a ball-state or live flag, preserve it alongside the coordinates.

Rendering guidance:

| Case | Recommended handling |
|---|---|
| live frame with ball coordinates | draw the current ball position |
| dead-ball frame with a last live ball position | show the last live position as inactive/faded |
| no ball coordinates | omit the ball rather than placing it at centre |
| no live/dead flag in an older cache/export | treat frames as live only if that is the provider's documented default |

Do not infer ball-in-play state from the ball being near the centre spot alone.
Centre coordinates can be genuine in kick-off or restart phases.

## Second Spectrum delivery-bundle validation recipe

Use this recipe when an agent asks for a Second Spectrum delivery bundle,
tracking metadata validation, JSONL/XML tracking ingest, physical summary/splits
checks, or event-to-frame alignment between optical tracking and an Opta-style
event feed.

Common bundle components are contract-specific, but a robust ingest should model
them separately:

| Output field | Source fields | Rule |
|---|---|---|
| `metadata` | match metadata JSON/XML | Parse game ids, teams, players, pitch dimensions, fps, periods, and attacking direction before reading frame rows. |
| `tracking_frames` | line-delimited JSON, XML, or provider frame stream | Treat each row/message as one frame with period, frame index, clock, player positions, ball position, live/dead state, and optional speed. |
| `physical_summary` | provider physical summary CSV/table | Keep official match-level player aggregates separate from any metrics derived from raw frames. |
| `physical_splits` | provider interval split CSV/table | Store split length, thresholds, team rows, player rows, and whether the final split is partial. |
| `event_alignment` | event feed plus tracking alignment fields | Join events to frames through explicit aligned clock/frame fields when supplied; otherwise label any time-window join as inferred. |
| `player_bridge` | tracking player id, shirt number, provider player id | Prefer explicit provider ids. Use shirt numbers only as a scoped fallback inside one team, match, and period. |
| quality flags | missing files, duplicate frames, period bounds, fps, live flag, id joins | Report bundle completeness and clock consistency before exposing analytics. |

Core check: event-to-frame alignment must use a period-local match clock or an
explicit `aligned_frame_idx`, not wall-clock time alone.

Safety rule: do not assume every contract includes the same delivery files.

Source rule: official provider physical outputs stay separate from derived
raw-tracking metrics.

Implementation notes:

- Do not assume every contract includes the same files or field names. Some
  deliveries include metadata plus tracking only; others also include physical
  summaries, physical splits, aligned event feeds, or signals. Detect the
  available components and record the schema version or delivery note if known.
- Validate periods before analytics: frame indices should be monotonic within a
  period, period start/end bounds should match metadata, and frame spacing should
  be consistent with fps apart from documented gaps.
- Keep wall-clock timestamps, frame indices, and match clocks as separate
  fields. Wall-clock time is useful for delivery/debugging; charting and
  event-to-frame joins should use period and match clock.
- Preserve both tracking ids and event-provider ids when the metadata supplies
  them. A player can have a tracking-specific id and an Opta-style id in the
  same bundle.
- Treat `live`, last-touch, possession, and attacking-direction fields as
  provider annotations when present. If they are missing, expose the missing
  state rather than deriving silent substitutes.
- Official provider physical outputs are not interchangeable with derived raw-
  tracking metrics. If both are available, surface their source, threshold set,
  and calculation basis separately.

## Second Spectrum insight-marking recipe

Use this recipe when an agent asks for a Second Spectrum insight feed, aligned
Opta events, event-to-marking joins, tracking markings, pass quality, pressure
or press annotations, run annotations, expected completion, defenders bypassed,
or an event-linked tracking analysis table.

An insight feed should preserve the event record and the tracking-derived
marking as separate nullable objects. Do not flatten the tracking marking into
the raw event row without retaining source labels.

| Output field | Source fields | Rule |
|---|---|---|
| `opta_event` | aligned event object, event feed row | Keep the provider event id, event type, outcome, team, player, period, clock, and qualifiers as an event-source record. |
| `tracking_marking` | Second Spectrum marking object | Keep the tracking-derived marking as its own source record; one side can be null when there is no matching event or no matching marking. |
| `marking_type` | marking type field | Treat pass, shot, pressure, press, or run as tracking-enriched provider annotations, not a raw Opta event type. |
| `aligned_clock` / `aligned_frame_idx` | alignment fields supplied with the feed | Join to tracking frames through explicit period-local clock and frame fields. Prefer `aligned_frame_idx` when present. |
| `event_id` / `marking_id` | event id, marking id | Store both ids and label which system produced each id. Do not invent a shared id when the source only gives an alignment. |
| `player_bridge` | event player id, tracking player id, roster metadata | Preserve both identity namespaces. Use lineup metadata to bridge them before player-level aggregation. |
| `model_fields` | pass, shot, pressure, press, or run attributes | Keep expected completion, defenders bypassed, pressure, press, and run metrics as provider/model outputs with source/version labels when available. |

Core join rule: an aligned Opta event and a Second Spectrum marking can be
paired, but one side can be null. Model the relationship as an optional join
instead of assuming one event always produces one marking.

Safety rule: `marking_type` is not a raw Opta event type. It is a tracking-
enriched annotation that may describe a pass, shot, pressure, press, or run
around the event clock.

Implementation notes:

- Keep the original event semantics intact. A pass event remains the event
  source record; the marking carries the provider's tracking annotation and
  model fields.
- Use `aligned_frame_idx`, aligned period clock, and period number for frame
  joins. Do not join an event to tracking by wall-clock timestamp alone.
- Preserve nullability explicitly. A marking without an event can still be
  useful for tracking analysis; an event without a marking can still be useful
  for event analysis.
- Treat expected completion, defenders bypassed, and related pass-quality
  fields as provider/model outputs. Do not compare them to another model unless
  both model definitions and source versions are visible.
- For pressure, press, and run markings, retain start/end clock or frame fields
  separately from the event alignment point. A marking can span a window while
  the aligned event is a single timestamp.
- Avoid deriving identity bridges from shirt number or display name when both
  event-player ids and tracking-player ids are present. Store the raw ids first,
  then add a reviewed bridge if needed.

## Speed and distance fallbacks

Prefer provider speed and cumulative distance fields when they are present and
documented. If speed is absent, derive instantaneous speed from adjacent player
coordinates:

```text
speed_mps = distance(point_i, point_i+1) / dt_seconds
```

Apply sensible glitch guards before using derived speed for analysis or labels:
drop impossible spikes, skip frames with missing positions, and avoid reporting
speed from a single isolated coordinate. If cumulative distance is absent, either
derive it consistently over live frames or label it unavailable; do not mix
provider cumulative distance for some players with naive per-frame sums for others
without marking the source.

## Tracking-derived physical output recipe

Use this recipe when an agent asks for a physical report, raw-tracking workload
table, speed-band totals, top-speed list, sprint count, or high-speed-running
summary from kloppy `TrackingDataset` frames rather than from a provider's
official physical endpoint.

| Output field | Source fields | Rule |
|---|---|---|
| `player_id` / `team_id` | tracking player object, lineup join | Emit stable provider ids only after the tracking roster has been joined to match players. |
| `minutes_observed` | player coordinates, frame rate | Count frames where the player has a usable position; report the denominator before ranking rates. |
| `total_distance_m` | provider cumulative distance or player coordinates | Prefer documented provider cumulative distance; otherwise derive frame-to-frame distance in metres with a consistent missing-position rule. |
| speed-band distances | provider speed or derived speed, live flag | Bucket live-frame distance into declared walking, jogging, HSR, and sprint bands. Keep thresholds in the response metadata. |
| `sprint_count` | speed series, frame rate, live flag | Count sustained contiguous live-frame runs above the sprint threshold, with an explicit minimum duration and optional short-gap merge rule. |
| `top_speed_mps` | provider speed or derived speed | Use the maximum non-glitch speed from live frames; return `null` when no usable speed sample exists. |
| quality flags | missing speed, missing distance, live/dead state, coordinate unit | State whether values are provider supplied, derived, partially unavailable, or computed without a live-ball flag. |

Core fallback: derive speed from adjacent coordinates when no trusted provider
speed is available.

Safety rule: this is not the same contract as official provider physical metrics.

Implementation notes:

- Use provider speed when present and documented. If it is missing, derive speed
  from adjacent coordinates as `distance_m / dt_seconds`, then smooth or
  aggregate before displaying labels so one-frame jitter does not dominate.
- Convert coordinates to metres before computing distance or speed. Tracking
  feeds may expose metres, centimetres, or normalised pitch coordinates.
- Apply a declared glitch guard before top speed, speed-band totals, and sprint
  detection. Impossible spikes should become missing samples, not records.
- Treat period boundaries separately for speed derivation, smoothing, and sprint
  detection. Do not connect a run across half-time or extra-time breaks.
- Filter speed-band totals and sprint detection to live frames when the feed
  exposes a live/dead flag. Distance covered and observed minutes may still count
  every tracked frame, but label that choice.
- Keep a provider/derived source flag per metric family. It is acceptable for
  distance to be provider supplied while speed is derived, but the API response
  should make that visible.
- Do not compare custom thresholds against SkillCorner, Wyscout, or other
  provider physical outputs without labelling the threshold set. A derived
  tracking workload report is not the same contract as official provider
  physical metrics.

## Tracking-derived pressing timeline recipe

Use this recipe when an agent asks for a rolling pressing-intensity timeline,
pressure sparkline, out-of-possession pressure chart, or tracking-derived press
dashboard from Second Spectrum, TRACAB, SkillCorner, Sportec, Metrica, or other
optical tracking feeds.

| Output field | Source fields | Rule |
|---|---|---|
| `period` / `t_ms` | frame period and timestamp | Use the window centre on the period clock, not wall-clock time. |
| `pressing_team` | player team, ball position | Attribute possession to the team whose player is nearest the ball across the window; the other team is pressing. |
| `pressers_mean` | player coordinates, ball coordinates | Mean count of out-of-possession players within a labelled radius of the ball, such as 5-6 metres. |
| `closing_mps_mean` | player-ball distance over time, frame rate | Mean positive closing speed towards the ball; floor negative values at zero so moving away does not reduce the metric. |
| quality flags | live/dead state, missing ball/player coordinates | Report skipped or unavailable windows rather than filling with zero. |

Implementation notes:

- Compute player-to-ball distances once per frame and reuse that array for nearest
  team, presser counts, and closing speed.
- Use rolling windows that are long enough to dampen frame noise, for example five
  seconds stepped every one second. Label both values in the API response.
- Exclude dead-ball frames and frames without ball coordinates from possession and
  pressure votes. If an older export has no live/dead flag, state the fallback.
- When both teams are equally near the ball or all relevant coordinates are missing,
  skip that frame or window instead of guessing possession.
- Keep this separate from event-derived PPDA. PPDA counts passes and defensive
  actions; a tracking pressing timeline measures spatial proximity and approach
  speed around the ball.
- Preserve the coordinate unit: tracking feeds may use metres, centimetres, or
  normalised coordinates. Convert to metres before applying any radius or speed
  threshold.
- If the provider already supplies on-ball engagements, pressures, or out-of-
  possession metrics, expose those as provider metrics and label this rolling
  timeline as derived.

## Tracking-derived off-ball runs recipe

Use this recipe when an agent asks for off-ball runs, high-speed runs away from
the ball, forward runs, channel runs, run maps, or run-detection timelines from
optical tracking feeds.

| Output field | Source fields | Rule |
|---|---|---|
| `player_id` / `team_id` | tracking entity, lineup join | Emit provider ids and display labels only after the identity join is proven. |
| `period` / `start_ms` / `end_ms` | frame period and timestamp | Use the tracking period clock, not wall-clock time. |
| `duration_s` | consecutive above-threshold frames | Count the span of the run, not just the number of sampled frames. |
| `distance_m` | player coordinates or provider cumulative distance | Prefer provider distance when documented; otherwise derive consistently from live-frame coordinates. |
| `peak_speed_mps` | provider speed or coordinate delta / frame interval | Convert units before thresholding; keep the source of speed visible. |
| `towards_goal` | attacking direction plus player displacement | Resolve attacking direction per team and period before labelling a run forward. |
| quality flags | live/dead state, missing positions, ball proximity, direction confidence | Report rejected or skipped windows rather than filling with zero. |

Implementation notes:

- Filter to live frames when the feed exposes a live/dead flag. If an older
  export lacks that flag, state the fallback rather than silently changing the
  definition.
- Detect candidate runs as contiguous spans above a declared speed threshold,
  with an optional short-gap merge rule. Label both the threshold and the
  minimum duration.
- Exclude on-ball carrying or receiving actions by checking player-ball
  proximity across the run. A common rule is to reject runs where the player is
  close to the ball during the body of the run, while allowing a short trailing
  receive window at the end.
- Resolve attacking direction from provider metadata where available, such as
  `home_team_side` plus period. If metadata is absent and you infer direction
  from goalkeeper depth or team shape, label that inference and expose a
  confidence flag.
- Do not classify "towards goal" from raw `+x` movement until the coordinate
  frame, team side, and period have been normalised.
- Keep this separate from provider official physical metrics. A derived run
  detector is a product rule over frames; provider high-speed running or sprint
  counts may use different thresholds, smoothing, and live-ball handling.

## Tracking-derived pitch-control overlay recipe

Use this recipe when an agent asks for a simple pitch-control overlay, nearest-
player dominance grid, territory-control field, or live tracking control map from
optical tracking feeds. This is an indicative spatial overlay, not a provider
official metric and not a probabilistic pitch-control model.

| Output field | Source fields | Rule |
|---|---|---|
| `period` / `t_ms` | frame period and timestamp | Use the current or interpolated live frame on the tracking period clock. |
| `grid_cols` / `grid_rows` | renderer or API parameters | Declare the grid resolution used to sample the pitch. |
| `cell_x` / `cell_y` | pitch dimensions | Store each cell centre in the same normalised coordinate frame as the renderer. |
| `control` | nearest home and away player distance | Compute `(d_away - d_home) / (d_away + d_home + eps)` and clamp to `[-1, 1]`. Positive values mean home dominance, negative values mean away dominance, and values near zero mean an even contest. |
| quality flags | live/dead state, visible home/away player counts, missing coordinates | Mark the field neutral or unavailable when the inputs cannot support a two-team comparison. |

Implementation notes:

- Build the field from player positions in a single live frame or from a frame
  interpolated to the display clock. For UI overlays, recompute at a bounded
  cadence such as once per second rather than on every render.
- Split the pitch into fixed cells, map each cell centre to pitch coordinates,
  and compute the nearest visible home-player and away-player distance for each
  cell.
- Convert player positions and cell centres to a common metric pitch coordinate
  system before distance calculations. If the renderer uses 0-100 or 0-1
  coordinates, scale x by `pitch_length` and y by `pitch_width` so the rectangular
  pitch aspect ratio is preserved.
- Require both teams to have visible player coordinates. If either team has no
  visible players in the frame, emit a neutral or unavailable field rather than
  painting the pitch as owned by the other team.
- Skip players with missing coordinates and expose the visible-player counts so
  downstream views can decide whether to hide, fade, or label the overlay.
- Keep an even-contest band around zero, such as `abs(control) < 0.15`, when
  rendering heatmap cells. Leaving uncertain cells unpainted is usually clearer
  than implying confident ownership.
- Do not narrow the underlying control calculation when a user filters the
  display to one team unless the product is explicitly switching to a one-team
  distance-to-space view. Two-team pitch control requires both teams.
- Label the output as nearest-player dominance or derived control. Do not present
  it as official provider pitch control, possession probability, or a modelled
  reachable-space probability unless the provider supplies that metric directly.

## Canonical match-clock sync recipe

Use this recipe when an agent asks for a shared match clock, event-to-tracking
alignment, video playhead analytics, multi-angle clip sync, frame-to-event
joins, or a cross-surface timeline that combines events, optical tracking, and
media assets.

The robust pattern is to keep one canonical, period-local football clock, then
convert each source clock into it. Do not collapse provider event time, tracking
frame time, wall-clock timestamps, and media playback seconds into a single raw
field.

| Output field | Source fields | Rule |
|---|---|---|
| `canonical_clock` | period plus milliseconds since period kick-off | Store as `{ period, t_ms }`. This is the ordering key for football analytics, not a display string. |
| `event_clock` | event period, minute, second, expanded minute, timestamp, or aligned event time | Convert events into `canonical_clock`, but preserve the original event clock and conversion source. |
| `tracking_clock` | tracking period, frame index, fps, frame timestamp, or aligned frame fields | Convert frames into `canonical_clock`; keep `frame_idx` because frame-perfect joins and debugging still need it. |
| `media_clock` | video asset seconds, stream timestamp, provider offset map, or manual sync table | Store media time per asset or angle. Resolve media time through `canonical_clock`, not by joining videos to each other. |
| `clip_range` | canonical start/end plus lead-in/out | Build football clip windows on `canonical_clock`, then convert to media seconds for the selected asset and clamp to asset bounds. |
| `sync_source` | provider offsets, aligned frame fields, external table, manual sync, or inferred offset | Label the source of every conversion. Treat inferred sync as lower confidence than official offsets or explicit alignment fields. |
| `quality_flags` | missing offset, period mismatch, drift, dropped frames, duplicate frames, unmatched events | Return explicit flags instead of silently filling gaps or borrowing another clock. |

Core rule: one canonical clock coordinates the surfaces, but the source clocks
remain separate. Use `canonical_clock` to ask "what happened by this football
time?" and `media_clock` only to seek, play, and export clips.

Safety rule: do not sync two video assets directly to each other. Sync each
asset to the canonical match clock with its own offset because camera angles,
tactical feeds, and broadcast cuts can have different starts, gaps, or drift.

Implementation notes:

- Validate monotonic clocks inside each period before joining sources. Do not
  bridge half-time, extra-time, or shootout boundaries by continuing one running
  timestamp unless the provider explicitly defines that clock.
- When a user scrubs video, convert the current `media_clock` into
  `canonical_clock`, then filter events and tracking frames at or before that
  period-local time. If sync is unavailable, disable playhead-window analytics
  rather than guessing.
- For event-to-frame joins, prefer explicit aligned frame indices or aligned
  period clocks. A nearest-frame join is acceptable only when labelled with a
  tolerance window and a quality flag.
- Keep per-asset offsets. A tactical angle, broadcast angle, and clip export can
  have different lead-in, frame rate, or dropped-frame behaviour even when they
  cover the same match.
- Store both `frame_idx` and `t_ms` for tracking. The frame index is the stable
  row key; the period-local clock is the cross-source join key.
- Treat missing events, missing frames, and unsynchronised assets as normal data
  quality outcomes. Public APIs should return unavailable/null states with
  quality flags, not invented joins.

## Joining tracking to events

To combine tracking with event data:

1. Keep a canonical time coordinate such as `(period, milliseconds since period kick-off)`.
2. Convert event clocks and frame timestamps into that coordinate.
3. Use provider player IDs or kloppy `Player` objects to join event actors to tracked
   players.
4. Treat unmatched players as a normal data-quality condition; tracking rosters and
   event lineups are not always identical.

When a display combines event counts with tracking positions, only show the event
counts for players whose identity join is proven. Tracking-only players can still
show speed, distance, and position labels.
