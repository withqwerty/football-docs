# Opta Shot Placement and Goal-Mouth Charts

## Shot placement data surfaces

Opta/WhoScored-style shot placement charts need the F24 event stream plus, when
available, the separate expected-goals endpoint:

| Need | Best Opta surface | Notes |
|---|---|---|
| Shot origin, body part, outcome, and goal-mouth endpoint | `matchevent/{token}?fx={matchId}` | Shot events are typeIds `13`, `14`, `15`, and `16`; goal-mouth coordinates are qualifiers `102` and `103`. |
| Continuous provider xG and xGOT | `matchexpectedgoals/{token}?fx={matchId}` | Use qualifiers `321` (`expectedGoals`) and `322` (`expectedGoalsOnTarget`) from this endpoint when present. |
| Lineups and player labels | `matchstats/{token}?fx={matchId}` | Join by `playerId`; use `matchName`, position, and lineup fields for display. |

Do not assume qualifier `213` supplies usable xG in the public Opta Analyst-style
`matchevent` feed. It is defined in some F24 references, but project pipelines have
observed xG populated as qualifier `321` on `matchexpectedgoals` instead.

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
For physical distances, common project conventions are:

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
