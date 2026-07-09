# Opta Set-Piece and Corner Sequence Charts

## Build a corner-delivery analysis

Use this recipe when an agent asks for corner delivery zones, set-piece shot
quality, second-phase corner shots, near-post/far-post targeting, short-corner
rates, or delivery-to-shot sequence charts from Opta/WhoScored-shaped event data.

| Need | Opta surface | Implementation note |
|---|---|---|
| Corner delivery event | `matchevent/{token}?fx={matchId}` pass events with qualifier `6` (`cornerTaken`) | Treat typeId `1` + Q6 as the delivery, not typeId `6` (`Corner awarded`). |
| Delivery endpoint | qualifiers `140` (`passEndX`) and `141` (`passEndY`) | Fall back to provider `endX`/`endY` fields only when the qualifier values are absent and the export defines those fields. |
| Corner-sourced shots | shot events typeIds `13`, `14`, `15`, `16` with qualifier `25` (`fromCorner`) | Use this for shot/result counts; it does not identify the delivery by itself. |
| Body part | qualifiers `15`, `20`/`56`, `72`, `22` | `20` can mean right foot in shot exports but an involved-player field elsewhere, so read it in the shot-event context only. |
| Direct corner / Olimpico | qualifier `263` where present | Keep direct corners separate from normal delivery-to-shot sequences because timestamp order can look like a near-zero-second shot. |

For xG or xGOT, join the shot row to `matchexpectedgoals/{token}?fx={matchId}`
and use qualifiers `321`/`322` from that endpoint when available. The standard
`matchevent` feed should still drive the corner delivery, event clock, body part,
and sequence context.

## Delivery zones and mirroring

Opta event coordinates use a 0-100 attacking pitch. For corner delivery zones:

| Zone rule | Meaning |
|---|---|
| `end_x < 83` | short corner or delivery that does not reach the penalty-area edge |
| `83 <= end_x < 88` | deeper penalty-area / edge delivery |
| `88 <= end_x < 94` | penalty-area delivery around the penalty spot band |
| `end_x >= 94` | six-yard-box delivery |
| mirrored `end_y < 44` | near-post side |
| mirrored `44 <= end_y <= 56` | central lane |
| mirrored `end_y > 56` | far-post side |

Mirror the delivery `y` coordinate by corner side before assigning near/far-post
labels. A practical rule is: infer the corner side from the delivery origin
`y`; for left-side corners, use `100 - end_y` so the near-post side is
consistently the lower mirrored value. Keep the raw `end_y` as provenance because
some feeds or visual layers may use a different display orientation.

## Link deliveries to shots

Opta-family exports do not always link a corner delivery directly to the eventual
shot. A robust implementation should try links in this order:

1. If the shot's related-event field points to the corner delivery in the same
   match and period with a plausible positive time gap, use it.
2. Otherwise, select the closest preceding same-team corner delivery in the same
   match and period within a declared time window.
3. Mark the link as `direct` when the related event points to the delivery, and
   `inferred` or `second_phase` when the shot is only linked by time proximity.

Declare the time window in the metric label. Short windows describe first-contact
or immediate scramble outcomes; longer windows capture more second-phase play but
increase the risk of connecting a shot to the wrong restart. Never mix direct
links and inferred time-window links without exposing the link method in the
output.

## Chart outputs

Useful public chart fields:

| Field | Source |
|---|---|
| delivery zone | Q140/Q141 after mirroring |
| short-corner flag | `end_x < 83` or a separately coded short-corner action |
| shot outcome | shot typeId plus goal/post/saved/miss/block handling |
| body-part split | Q15 head, Q20/Q56 right foot, Q72 left foot, Q22 other |
| phase | direct related-event link versus inferred time-window link |
| xG / xGOT | Q321/Q322 from `matchexpectedgoals` when joined |

For team or season stories, separate counts by denominator: deliveries, linked
shots, goals, xG, and goals per delivery answer different questions. A chart
labelled "corner conversion" should say whether it means goals per corner
delivery or goals per corner-sourced shot.
