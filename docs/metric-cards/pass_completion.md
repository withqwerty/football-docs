---
source_type: curated
source_url: https://theanalyst.com/articles/opta-football-stats-definitions
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# Pass completion

Metric card `pass_completion`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("pass_completion")`, or one variant with its ID.

Pass completion divides completed passes by attempted passes. The formula is generic, but providers differ on what counts as a pass (crosses, throw-ins, goal kicks, corners, keeper throws) and on what counts as completed (StatsBomb: no failed pass outcome; Opta: reaches a teammate without an opposition touch; Wyscout: the next touch is by a teammate). On the 2022 World Cup final, Argentina's pass completion is 0.8081 by the Hudl StatsBomb formula, 0.8165 by an approximation of Opta's pass set and 0.8183 by an approximation of Wyscout's.

- **Measures:** How often a team's (or player's) passes reach a teammate: completed passes divided by attempted passes.
- **Direction:** Higher values mean more passes completed. It is not a measure of passing quality on its own: safe, short passes raise it. No value when no pass is counted (division by zero).
- **Unit:** share of attempted passes that were completed (0 to 1, often shown as a percentage)
- **Data:** event data
- **Also called:** pass completion rate, pass accuracy, passing accuracy, passing %, pass %, pass success rate, Passing%

## Origin

Generic: a completion rate has no single originator, and no source we read credits one. Opta's definitions call it 'simply a formula'.

Source: https://theanalyst.com/articles/opta-football-stats-definitions

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `pass_completion.statsbomb-hudl` | Whole pitch. | exact |
| `pass_completion.opta` | Whole pitch, or any selected area. | approximation |
| `pass_completion.wyscout` | Whole pitch. | approximation |

## pass_completion.statsbomb-hudl: Hudl StatsBomb (Passing%)

Completed passes divided by all passes: every StatsBomb Pass event counts as an attempt, set pieces, goal kicks, throw-ins, crosses and keeper throws included.

- **Formula:** count of passes where pass outcome = completed / count of all passes
- **Zone:** Whole pitch.
- **Passes counted:** All Pass events. Completed = no pass.outcome in the event data; the failed outcomes are Incomplete, Out, Pass Offside and Unknown.
- **Source:** Event Data Glossary: Team Metrics (Hudl StatsBomb): https://support.hudl.com/s/article/event-data-glossary-team-metrics
- **Quote** (checked word for word in a browser, 2026-10-04): "Count of passes where pass outcome = completed / Count of all passes"
- **Quote check note:** The page builds its text with JavaScript, so match_quote cannot read it; checked word for word in a browser.
- **Reference code (exact):** `football_metrics.territory:pass_completion_statsbomb_hudl` on statsbomb-open-data. The source's own formula on the source's own event data. Penalty shoot-out (period 5) excluded.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 0.8081
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.7614
- The team glossary also defines Opposition Passing% (the same formula on the opponent's passes); the player glossary defines Passing% as the percentage of all attempted passes that were completed.
- Hudl StatsBomb publishes split rates separately, for example Long Ball% (pass length >= 35) and Crossing% (pass.cross = true).

## pass_completion.opta: Opta

Successful passes divided by attempted passes, for whichever set of passes is selected; usually crosses are left out. Opta's pass event covers open-play passes, goal kicks, corners and free kicks played as a pass; crosses, keeper throws and throw-ins do not count as a pass. A completed pass goes to a teammate directly without a touch from an opposition player.

- **Formula:** successful passes / attempted passes (Opta pass events, usually without crosses)
- **Zone:** Whole pitch, or any selected area.
- **Passes counted:** Opta pass events: open-play passes, goal kicks, corners and free kicks played as a pass. Not crosses (counted separately as crossing success), keeper throws or throw-ins.
- **Source:** Opta football stats definitions (Opta Analyst): https://theanalyst.com/articles/opta-football-stats-definitions
- **Quote** (matches the source word for word, 2026-10-04): "This is simply a formula where successful passes are divided by total attempted passes in whichever combination of passes is selected. Usually, pass completion excludes crosses."
- **Reference code (approximation):** `football_metrics.territory:pass_completion_opta` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta events. Pass = a StatsBomb Pass that is not pass.cross = true (cross), not pass.type Throw-in and not pass.body_part Keeper Arm (keeper throw). Corners and free kicks stay in unless StatsBomb sets pass.cross = true; in the 2022 World Cup final no Corner pass has pass.cross = true, so crossed corners (crosses to Opta) stay in. Completed = no pass.outcome (Opta: to a teammate without an opposition touch); Out, Pass Offside and Unknown count as attempted and not completed. Penalty shoot-out (period 5) excluded.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 0.8165
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.764
- The definition leaves open which passes are in the set, so a published Opta rate can use a narrower set, for example open play only.

## pass_completion.wyscout: Wyscout (pass accuracy)

The percentage of successful passes. A pass is an attempt to pass the ball to a teammate; it is successful if the next touch of the ball is by a teammate. Crosses, head passes, hand passes, smart passes and long passes are included; goal kicks, corner kicks, free-kick crosses and throw-ins are not.

- **Formula:** successful passes (next touch by a teammate) / passes (without goal kicks, corner kicks, free-kick crosses and throw-ins)
- **Zone:** Whole pitch.
- **Passes counted:** Passes including crosses, head passes and hand passes. Not goal kicks, corner kicks, free-kick crosses or throw-ins.
- **Source:** Pass (Wyscout): https://dataglossary.wyscout.com/pass/
- **Quote** (matches the source word for word, 2026-10-04): "A pass is considered successful if the next touch of the ball is by a teammate."
- **Reference code (approximation):** `football_metrics.territory:pass_completion_wyscout` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Wyscout events. Pass = a StatsBomb Pass that is not pass.type Goal Kick, Corner or Throw-in, and not pass.type Free Kick with pass.cross = true (free-kick cross). Keeper Arm passes (hand passes) and crosses stay in. Successful = no pass.outcome; StatsBomb records no 'next touch' field, so a failed pass that a teammate touches next counts as failed here but successful in Wyscout. Out, Pass Offside and Unknown count as not successful. Penalty shoot-out (period 5) excluded.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 0.8183
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.7765
- The success rule is about the next touch, not the intended receiver: a loose ball that a teammate touches next counts as successful.
- Wyscout marks success with API tag 1801 (successful) or 1802 (not successful).

## Caveats

- Values from different definitions are not comparable: the pass set and the success rule both change the number. Cite the variant ID.
- Completion rate ignores pass difficulty: long balls, crosses and passes under pressure fail more often, so style drives it. Expected pass completion (xPass) models adjust for difficulty; each provider's trained model is closed, and a separate card (expected_pass_completion) will cover them.
- StatsBomb's failed outcomes include Out, Pass Offside and Unknown as well as Incomplete. Each counts as attempted and not completed here; a house formula that drops offside or unknown passes gives a different value.
- A season value can be a ratio of season sums or a mean of match rates; they differ.
- Set pieces and goal kicks have their own completion rates; a definition that keeps them in mixes those rates with open play.

## Related cards

`possession_share` (no card yet), `progressive_passes`, `field_tilt`, `ppda`, `expected_pass_completion` (no card yet)
