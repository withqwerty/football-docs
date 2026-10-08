---
source_type: curated
source_url: https://www.statsperform.com/insights/how-we-measure-pressure/
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# Field tilt

Metric card `field_tilt`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("field_tilt")`, or one variant with its ID.

Field tilt divides a team's final-third passes (or touches) by the sum of both teams' final-third passes (or touches). No source we read credits an originator; the earliest use we found is Stats Perform's 'How we measure pressure' (about 2016). Public definitions differ on passes or touches, on where the final third starts, and they do not say whether failed passes count. On the 2022 World Cup final, Argentina's field tilt is 0.6186 by final-third passes and 0.6303 by final-third touches (both approximations on StatsBomb events).

- **Measures:** How much of a match's play in the final thirds belongs to one team: its passes (or touches) in its attacking third as a share of both teams' passes (or touches) in their attacking thirds.
- **Direction:** Higher values mean more territorial dominance. The two teams' values in one match add up to 1. A match with no counted event in either final third has no value (division by zero).
- **Unit:** share of both teams' final-third passes or touches (0 to 1, often shown as a percentage)
- **Data:** event data
- **Also called:** territorial dominance, final-third pass share, final-third touch share, territory share

## Origin

Not confirmed. No source we read credits an originator. The earliest use we found is Stats Perform's 'How we measure pressure', which uses 2015-2016 data (so about 2016) and is now republished with a 2026 date and no named author. It defines field tilt as team final-third passes divided by team and opponent final-third passes, and uses it to show how territory confounds PPDA.

Source: https://www.statsperform.com/insights/how-we-measure-pressure/

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `field_tilt.stats-perform-2016` | Each team's attacking third. The page does not say where the line is; Opta's thirds put it at x = 66.7 of 100 (StatsBomb x = 80 of 120). | approximation |
| `field_tilt.opta-analyst` | Each team's attacking third. The article does not say where the line is; Opta's thirds put it at x = 66.7 of 100 (StatsBomb x = 80 of 120). | approximation |
| `field_tilt.touches` | Each team's attacking third. The post does not say where the line is. | approximation |
| `field_tilt.driblab` | The last 35 metres of the pitch, each team in its attacking direction. On a 105 m pitch that is the final third; on other pitch lengths it is not. | none yet |

## field_tilt.stats-perform-2016: Stats Perform, about 2016: final-third passes

A team's passes in the final third divided by the passes in the final third by the team and its opponent together.

- **Formula:** team final-third passes / (team final-third passes + opponent final-third passes)
- **Zone:** Each team's attacking third. The page does not say where the line is; Opta's thirds put it at x = 66.7 of 100 (StatsBomb x = 80 of 120).
- **Passes counted:** Passes. The page does not say whether failed passes count.
- **Source:** How we measure pressure (Stats Perform): https://www.statsperform.com/insights/how-we-measure-pressure/
- **Quote** (matches the source word for word, 2026-10-04): "Graphing PPDA against Field Tilt (team final third passes / team and opponent final third passes) illustrates how the relationship between territorial dominance and PPDA slightly confounds the intended measurement of PPDA."
- **Reference code (approximation):** `football_metrics.territory:field_tilt_opta_passes` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta events. Pass = a StatsBomb Pass that Opta would also log as a pass: not pass.cross = true, not pass.type Throw-in, not pass.body_part Keeper Arm (Opta: crosses, keeper throws and throw-ins do not count as a pass). All such passes count, completed or not, as the page does not say. Final third = pass start location x >= 80 of 120 in the passing team's direction (Opta x >= 66.7 of 100). Penalty shoot-out (period 5) excluded.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 0.6186
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.3814
- The page now shows a 2026 date but uses 2015-2016 data, so it was republished; the original date and author are not known.
- The page uses field tilt only in a graph against PPDA, to show how territory confounds PPDA.

## field_tilt.opta-analyst: Opta Analyst (2024): final-third passes

A team's share of possession in its attacking third against its opponent's, counted as passes: over 50% means the team makes more passes in the opposition's final third than the opponent makes in the team's defensive third.

- **Formula:** team passes in the opposition's final third / (team passes in the opposition's final third + opponent passes in the team's defensive third)
- **Zone:** Each team's attacking third. The article does not say where the line is; Opta's thirds put it at x = 66.7 of 100 (StatsBomb x = 80 of 120).
- **Passes counted:** Passes. The article does not say whether failed passes count.
- **Source:** Possession and Territory, but Too Few Chances Created: Tottenham's Final-Third Problems Analysed (Ali Tweedale (Opta Analyst), 2024-09-18): https://theanalyst.com/articles/tottenham-problems-chances-created
- **Quote** (matches the source word for word, 2026-10-04): "Field tilt measures territorial dominance between teams, looking at the share of possession each side has in their attacking third compared to their opponent. A field tilt of over 50% means your team makes more passes in the opposition’s final third than they make in your defensive third."
- **Reference code (approximation):** `football_metrics.territory:field_tilt_opta_passes` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta events. Pass = a StatsBomb Pass that Opta would also log as a pass: not pass.cross = true, not pass.type Throw-in, not pass.body_part Keeper Arm. All such passes count, completed or not, as the article does not say. Final third = pass start location x >= 80 of 120 in the passing team's direction (Opta x >= 66.7 of 100). Penalty shoot-out (period 5) excluded.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 0.6186
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.3814
- The article describes the metric in passing; Opta Analyst's definitions page has no field tilt entry.
- The article gives Tottenham's 2024/25 Premier League field tilt after four matches as 78.4%, the league's highest.
- The reference code is the same as for field_tilt.stats-perform-2016: both are final-third pass shares on Opta data.

## field_tilt.touches: Final-third touches (Cannon Stats, 2023)

A team's touches in the final third divided by both teams' touches in the final third.

- **Formula:** team final-third touches / (team final-third touches + opponent final-third touches)
- **Zone:** Each team's attacking third. The post does not say where the line is.
- **Passes counted:** Touches. The post does not list which events are touches or name its data provider.
- **Source:** Should we care about Field Tilt? (Scott Willis (Cannon Stats), 2023-11-07): https://www.cannonstats.com/p/should-we-care-about-field-tilt
- **Quote** (matches the source word for word, 2026-10-04): "Field tilt is a pretty simple metric, it is simply the ratio of each team’s final third touches compared to the total final third touches."
- **Reference code (approximation):** `football_metrics.territory:field_tilt_touches` on statsbomb-open-data. An approximation on StatsBomb events: the post lists no touch events, so this uses Hudl StatsBomb's own touch list from its 'Touches in Box' formula (support.hudl.com event data glossary, player metrics). Touch = Pass with no pass.outcome or with outcome Pass Offside; Dribble with outcome Complete; Duel of type Tackle not Lost, Lost In Play or Lost Out; Interception; Clearance; Shot; Block; Ball Receipt* with no outcome; Goal Keeper of type Shot Saved, Shot Saved Off T, Shot Saved To Post, Saved To Post, Penalty Saved, Penalty Saved To Post, Save, Collected, Punch, Smother or Keeper Sweeper. Final third = event location x >= 80 of 120 in the acting team's direction. Penalty shoot-out (period 5) excluded.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 0.6303
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.3697
- The post's worked example: 241 and 107 final-third touches give 69.3% and 30.7% (241 / (241 + 107)).
- The author's match graphics show field tilt as a 10-minute moving average across the match; the match value is the full-match ratio.

## field_tilt.driblab: Driblab (2023): passes and touches in the last 35 m

A team's share of all passes and touches by both teams in the last 35 metres of the pitch.

- **Formula:** team passes and touches in the last 35 m / both teams' passes and touches in the last 35 m
- **Zone:** The last 35 metres of the pitch, each team in its attacking direction. On a 105 m pitch that is the final third; on other pitch lengths it is not.
- **Passes counted:** Passes and touches. The post does not say how the two are combined (added, or passes as part of touches).
- **Source:** 'Field Tilt': percentage of passes and touches in the final third (Alejandro Arroyo (Driblab), 2023-12-14): https://www.driblab.com/blog/field-tilt-percentage-of-passes-and-touches-in-the-final-third
- **Quote** (matches the source word for word, 2026-10-04): "This functionality is based on the last 35 metres of the pitch, the area where the teams move from the build-up zone to the finishing zone, where teams change pace."
- **Reference code:** none yet.
- The season value is the mean of the match percentages, not a ratio of season sums: the post describes it as the average, over the matches, of each match's percentage of touches in the final third.
- Shown in the match sheets of Driblab's driblabPRO platform. The post's example: Barcelona 63.9 and Girona 36.3%.
- No reference implementation: the post does not say how passes and touches are combined or which events are touches.

## Caveats

- Values from different definitions are not comparable: passes or touches, the final-third line and the event list all change the number. Cite the variant ID.
- No public definition we read says whether failed passes count or which events are touches.
- It is a ratio, so it ignores volume: 241 to 107 final-third touches and 122 to 54 give the same 69.3% (Cannon Stats).
- High field tilt does not mean good chances: Opta Analyst shows a team with a high field tilt and few expected goals per final-third entry.
- Game state changes it: a team that leads often gives up territory.
- Territory confounds PPDA: Stats Perform graphs PPDA against field tilt to show that teams which dominate territory may make their defensive actions high up the pitch anyway.
- A season value can be a mean of match values (Driblab) or a ratio of season sums; they differ.

## Related cards

`ppda`, `possession_share` (no card yet), `progressive_passes`, `pass_completion`
