# Opta Shot Placement and Goal-Mouth Charts

## Build a goalmouth shot chart

A goalmouth shot chart needs the shot event, the goal-mouth endpoint qualifiers,
and the expected-goals surface in one joined row. Use this recipe when an agent
asks for a goalmouth chart, shot-placement chart, PSxG chart, xGOT marker-size
plot, post-distance view, or crossbar/goal-frame analysis.

| Chart field | Opta source | Implementation note |
|---|---|---|
| Shot outcome | `matchevent/{token}?fx={matchId}` typeIds `13`, `14`, `15`, `16` | Encode miss, post/woodwork, saved, blocked, and goal as separate outcomes before styling markers. |
| Goal-mouth endpoint | qualifiers `102` (`GoalMouthY`) and `103` (`GoalMouthZ`) | These are goal-mouth coordinates, not pitch coordinates. Missing values mean the shot is not plottable in the goal frame. |
| xG / PSxG / xGOT | `matchexpectedgoals/{token}?fx={matchId}` qualifiers `321` and `322` | Use xGOT/PSxG for marker radius only when present; missing xGOT should become an unavailable/default size, not zero danger. |
| Marker style | derived from outcome plus xGOT | Goals, saved shots, posts, misses, and blocks should have distinct colour/shape/fill treatment; keep opacity low enough for clustered shots. |
| Frame metrics | `GoalMouthY`, `GoalMouthZ`, goal-post/crossbar constants | Calculate post distance or frame distance only after declaring the coordinate scale and conversion. |

Prefer a direct event-id join between `matchevent` shots and
`matchexpectedgoals` rows. If that ID is not present in your feed, fall back to a
strict match on match, team, player, period, clock, and shot order, then flag the
join as inferred.

## Shot placement data surfaces

Opta/WhoScored-style shot placement charts need the F24 event stream plus, when
available, the separate expected-goals endpoint:

| Need | Best Opta surface | Notes |
|---|---|---|
| Shot origin, body part, outcome, and goal-mouth endpoint | `matchevent/{token}?fx={matchId}` | Shot events are typeIds `13`, `14`, `15`, and `16`; goal-mouth coordinates are qualifiers `102` and `103`. |
| Continuous provider xG and xGOT | `matchexpectedgoals/{token}?fx={matchId}` | Use qualifiers `321` (`expectedGoals`) and `322` (`expectedGoalsOnTarget`) from this endpoint when present. |
| Lineups and player labels | `matchstats/{token}?fx={matchId}` | Join by `playerId`; use `matchName`, position, and lineup fields for display. |

Do not assume qualifier `213` supplies usable xG in the public Opta Analyst-style
`matchevent` feed. It is defined in some F24 references, but this feed tier commonly
populates xG as qualifier `321` on `matchexpectedgoals` instead.

## Provider-first xG service recipe

Use this recipe when an agent asks for an xG service, xG API response, provider
xG fallback, local model fallback, penalty xG rule, or source caption for an
Opta/WhoScored-style shot feed.

Resolve each shot in an explicit order:

| Priority | Source | Handling |
|---|---|---|
| 1 | provider xG from `matchexpectedgoals` qualifier `321` | Prefer the licensed provider value when present and numeric. Do not overwrite it with a local model. |
| 2 | penalty rule | If the shot is a penalty and no provider value is available, use a declared constant or provider policy; record the source as a rule, not a model. |
| 3 | local fallback model | Only use a trained fallback for non-penalty shots without provider xG. Expose model version/training metadata when returning the value. |
| 4 | unavailable | If no source resolves the shot, return an unavailable reason rather than `0`. |

Recommended response bookkeeping:

| Field | Meaning |
|---|---|
| `xg` | resolved shot value, when available |
| `xg_source` | `provider`, `rule`, or `model` |
| `provider_shots` / `rule_shots` / `model_shots` | counts of shots resolved by each source |
| `unresolved_shots` | count of shots with no usable xG source |
| `model` | descriptor for fallback model version, feature columns, corpus, and training date when model values were used |
| `reason` | machine-readable unavailable reason when a block cannot produce values |

Implementation notes:

- Provider xG should be treated as the best available value for that feed. A
  local model is a fallback for missing values, not a replacement for the
  provider's own model.
- Keep penalty handling outside a geometry-trained open-play model unless the
  model was explicitly trained and calibrated for penalties. Penalty constants
  should be labelled as rule-derived.
- When building a fallback model, document geometry inputs, body-part fields,
  play-kind/context fields, missing-level handling, training corpus, and model
  version. Missing body part or play context should remain an explicit unknown
  level rather than being imputed silently.
- Source captions should describe the sources that actually resolved shots in
  the current fixture. For example, do not say "provider xG" if all values came
  from a fallback model or penalty rule.
- Malformed qualifier `321` values should degrade to "no provider value" for
  that shot, not crash the whole match response.

## Shot event and result fields

| Event or qualifier | Meaning |
|---|---|
| typeId `13` | miss / off target |
| typeId `14` | shot on post |
| typeId `15` | attempt saved |
| typeId `16` | goal |
| qualifier `82` | blocked shot |
| qualifier `102` | `GoalMouthY`, horizontal endpoint across the goal mouth |
| qualifier `103` | `GoalMouthZ`, vertical endpoint / height |
| qualifier `146` | blocked/save X coordinate |
| qualifier `147` | blocked/save Y coordinate |

When deriving a shot result, handle qualifier `82` before treating typeId `15` as
a normal saved shot. Some serializers classify a shot as blocked from the qualifier
even when the broader type branch would otherwise be "attempt saved".

## Shot context and consequence filters

Shot-placement stories often ask whether a miss, save, post hit, or weak finish
changed the match state. Join each shot row to a running scoreline timeline before
building late-game, close-game, or "mattered" filters.

| Derived field | How to derive it | Use |
|---|---|---|
| `team_score_at_shot` / `opp_score_at_shot` | Count valid goals strictly before the shot clock, from the shooting team's perspective | Tooltip, score-state splits, consequence labels |
| `goal_diff_at_shot` | `team_score_at_shot - opp_score_at_shot` | Classify whether the shooter was leading, level, or trailing |
| `state_at_shot` | `winning`, `drawing`, or `losing` from `goal_diff_at_shot` | Filter shot maps by game state or pressure context |
| `is_late` | minute threshold such as `minute >= 80`, using expanded minutes when available | Late-shot and stoppage-time story filters |
| `is_close_final` | final margin within one goal, after converting to the shooting team's perspective | Avoid overstating misses in already-decided matches |
| `mattered` | shot taken while the goal difference was within one and the final margin was within one | Narrative filter for chances that could plausibly change the result |

Use the goal-timeline reconstruction in [charting-game-state.md](charting-game-state.md):
drop disallowed goals with qualifier `8`, credit own goals with qualifier `28` to
the opposing team, and sort by period-aware clock or `expandedMinute`. Count only
goals before the shot; a goal event at the same clock should not retroactively
change the shot's pre-shot state unless the provider explicitly links them.

Keep these consequence fields separate from provider facts. `mattered`,
`late`, `close final`, and `pressure shot` are analysis labels layered on top of
Opta events, not Opta event types.

## Body part and play-kind filters

Low-xG finishing or shot-placement work usually needs foot shots only and explicit
set-piece exclusions or strata.

| Qualifier | Use |
|---|---|
| `15` | head / headed shot |
| `3` | headed pass; can also imply head body part in some deserialisers |
| `72` | left foot |
| `20` | right foot |
| `21` | other body part |
| `2` | cross |
| `5` | free-kick pass / free-kick delivery |
| `6` | corner |
| `9` | penalty |
| `26` | free-kick shot |
| `107` | throw-in |
| `124` | goal kick in some JSON exports |

For placement-skill charts, filter to qualifiers `72` or `20` for left/right-foot
shots, exclude qualifier `15`/`3` headed actions, and either exclude or separately
stratify penalties, corners, direct free kicks, and other set-piece contexts.

## Goal-mouth scaling

Goal-mouth coordinates are on the Opta goal-mouth scale, not pitch `x`/`y`.
For physical distances, a common football-analytics convention is:

| Quantity | Formula or value |
|---|---|
| Left post | `GoalMouthY ~= 44.62` |
| Right post | `GoalMouthY ~= 55.38` |
| Crossbar | `GoalMouthZ ~= 37` |
| Y scale | `7.32m / (55.38 - 44.62) ~= 0.68m` per Y unit |
| Z scale | `2.44m / 37 ~= 0.066m` per Z unit |
| Post distance | `min(abs(gmy - 44.62), abs(gmy - 55.38)) * 0.68` |
| Frame distance | Euclidean distance outside the `[44.62, 55.38] x [0, 37]` goal frame |

Use post distance for "how close to the corners" and frame distance for miss quality.
Do not calculate these metrics unless both qualifiers `102` and `103` are present.

## Wide-miss and true-endpoint recipe

Use this recipe when an agent asks for worst-shot charts, wide-miss bands,
off-target shot placement, angular deviation, spectacle scores, miss-distance
rankings, or any Opta/WhoScored-style chart that mixes shots on the goal frame
with shots that went wide, high, or out of play.

| Output field | Source fields | Rule |
|---|---|---|
| `goal_frame_y` / `goal_frame_z` | qualifiers `102` and `103` | Treat these as the shot's endpoint on the Opta goal-mouth scale, not as pitch coordinates. |
| `wide_miss_band` | `GoalMouthY` vs post bounds | Classify shots outside the post bounds as a separate wide band before near-post, inner, or central bands. |
| `over_miss_band` | `GoalMouthZ` vs crossbar bound | Classify shots above the crossbar as over/high before normal height bands. |
| `frame_distance_m` | `GoalMouthY`, `GoalMouthZ`, post/crossbar constants | Compute distance to the nearest point on the goal frame for misses, posts, saves, and goals only after converting the goal-mouth scale. |
| `true_exit_point` | paired ball-out event, related event, or explicit exit coordinates when available | Prefer the provider's explicit ball-out/touchline/byline coordinate for where the ball actually left play. |
| `endpoint_source` | goal-mouth qualifier, paired exit event, or inferred line intersection | Label whether the endpoint came from goal-mouth projection, explicit exit data, or an inferred trajectory. |
| `quality_flags` | missing qualifiers, clipped coordinates, unavailable paired event | Report when the true endpoint is unavailable instead of silently treating goal-mouth projection as the actual exit point. |

Core rule: separate goal-frame placement from true ball-exit location.
`GoalMouthY` and `GoalMouthZ` are the right source for goal-frame miss distance,
but a wide shot may leave the pitch through the touchline before it reaches the
goal line. Use an explicit paired ball-out event or exit coordinate when the
product needs the true endpoint of the ball path.

Safety rule: wide misses should not be folded into central or near-post bins just
because their distance from the nearest post is large or small. Add an outside-posts guard first;
otherwise wide misses can contaminate conversion, save, and
placement-quality bands.

Implementation notes:

- Classify horizontal placement in this order: missing endpoint, outside posts
  (`wide_miss_band`), near post, inner, central. Classify vertical placement
  similarly: missing endpoint, over/high, then within-frame height bands.
- Keep `frame_distance_m` and `true_exit_distance_m` separate if both are
  available. Frame distance answers "how close was the shot to the goal frame";
  true-exit distance answers "where did the ball actually leave the pitch".
- Treat typeId `13` misses, typeId `14` post hits, typeId `15` saved attempts,
  and typeId `16` goals as different outcomes before computing spectacle or
  worst-shot rankings.
- If a feed clips pitch coordinates to `[0, 100]`, do not infer side-line versus
  byline exit only from clipped pitch values. Use provider event semantics,
  related-event links, or an explicit exit field when available.
- Do not use xGOT qualifier `322` as a miss-quality value for off-target shots
  without checking the feed semantics. Some expected-goals endpoints set xGOT to
  zero for off-target shots; that is not the same as "barely wide" versus
  "skied into the stand".

## Zone and low-xG proxies

If a continuous xG source is unavailable, zone qualifiers can be used as a rough
proxy, but label the result as a proxy rather than xG:

| Zone qualifier family | Typical use |
|---|---|
| `16`, `60`, `61` | small-box zones; usually exclude from low-xG placement-skill cuts |
| `17` | box centre |
| `62`, `63`, `64`, `65` | box wide/deep-box zones |
| `18` | out-of-box centre |
| `66`, `67`, `68`, `69` | out-of-box wide/deep zones |
| `19`, `70`, `71` | thirty-five-plus / long-range zones |
| `76` | big chance; usually exclude from low-xG placement-skill cuts |
| `9`, `108` | penalty; exclude or analyse separately |

For a robust first pass, join continuous xG from `matchexpectedgoals` where possible.
If you only have `matchevent`, a low-xG proxy can exclude small-box, big-chance, and
penalty qualifiers, then report zone-adjusted residuals so wide-angle geometry does
not masquerade as finishing skill.
