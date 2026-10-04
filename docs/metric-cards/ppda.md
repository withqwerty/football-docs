---
source_type: curated
source_url: https://blogarchive.statsbomb.com/articles/soccer/defensive-metrics-measuring-the-intensity-of-a-high-press/
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# PPDA (passes allowed per defensive action)

Metric card `ppda`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("ppda")`, or one variant with its ID.

PPDA divides the opponent's passes by the pressing team's defensive actions, both counted in the part of the pitch where the pressing happens. Colin Trainor introduced it in 2014. At least five public definitions are in use, and they differ in the zone, in which defensive actions count, and in whether failed passes count. Values from different definitions are not comparable: on the 2022 World Cup final, Argentina's PPDA is 7.42 by the StatsBomb/Hudl formula and 9.77 by an approximation of Trainor's original.

- **Measures:** How intensely a team presses the opponent's build-up: how many passes it lets the opponent make, in the pressing zone, for each defensive action it makes there.
- **Direction:** Lower values mean more pressing. A team with no counted defensive action has no value (division by zero).
- **Unit:** passes per defensive action (a ratio)
- **Data:** event data
- **Also called:** passes per defensive action, passes allowed per defensive action, passes/defensive action, pressing score

## Origin

Colin Trainor, StatsBomb blog, 30 July 2014, building on his 'passes allowed per pressing action' ratios (9 October 2013), which counted the whole pitch. Wyscout's glossary also credits him with introducing it in 2014. He chose the zone with Rene Maric of Spielverlagerung.

Source: https://blogarchive.statsbomb.com/articles/soccer/defensive-metrics-measuring-the-intensity-of-a-high-press/

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `ppda.trainor-2014` | Pressing team's attacking 60% (Opta x > 40 of 100). | approximation |
| `ppda.statsbomb-hudl` | Pressing team's attacking 60% (StatsBomb x >= 48 of 120). | exact |
| `ppda.wyscout` | Pressing team's final 60%. | none yet |
| `ppda.opta-analyst` | Outside the pressing team's own defensive third (about 67% of the pitch, not 60%). | approximation |
| `ppda.stats-perform-2016` | Opponent's defensive 3/5 (the same 60% as Trainor). | none yet |
| `ppda.understat` | The opposition half (50% of the pitch, not 60%). | none yet |

## ppda.trainor-2014: Trainor (2014), the original

All opposition passes, completed or not, divided by the pressing team's tackles, interceptions, challenges (failed tackles) and fouls, both counted beyond Opta's x = 40 line in the pressing team's direction: its attacking 60% of the pitch.

- **Formula:** opponent passes (x > 40 of 100, pressing team's view) / (tackles + interceptions + challenges + fouls by the pressing team at x > 40)
- **Zone:** Pressing team's attacking 60% (Opta x > 40 of 100).
- **Passes counted:** All passes, completed or not: Trainor says it does not matter whether the opposition completed them.
- **Source:** Defensive Metrics: Measuring the Intensity of a High Press (Colin Trainor, 2014-07-30): https://blogarchive.statsbomb.com/articles/soccer/defensive-metrics-measuring-the-intensity-of-a-high-press/
- **Quote** (matches the source word for word, 2026-10-04): "PPDA = Number of Passes made by Attacking Team / Number of Defensive Actions"
- **Reference code (approximation):** `football_metrics.ppda:ppda_trainor_2014` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta events: tackle = Duel of type Tackle (any outcome), challenge = Dribbled Past, interception = Interception, foul = Foul Committed; Opta x > 40 of 100 = StatsBomb x > 48 of 120.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 9.7674
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 11.7317
- Trainor plots a 6-game rolling average of match values and also gives league and season tables.
- He tested the boundary at x = 33, 40 and 50 before choosing 40.

## ppda.statsbomb-hudl: Hudl StatsBomb

The opponent's completed passes in its own 60% of the pitch, divided by the pressing team's tackles, interceptions (including interceptions made with a pass), dribbled-past events and fouls outside its own defending 40%.

- **Formula:** opposition passes with pass outcome = completed and start x < 72 / pressing team's (tackle or interception (including pass type = interception) or dribbled past or foul) with x >= 48 (StatsBomb 120 x 80 pitch)
- **Zone:** Pressing team's attacking 60% (StatsBomb x >= 48 of 120).
- **Passes counted:** Completed passes only.
- **Source:** Passes Per Defensive Action (PPDA) (Hudl StatsBomb): https://support.hudl.com/s/article/passes-defensive-action
- **Quote** (checked word for word in a browser, 2026-10-04): "Count of opposition event name = pass and pass outcome = completed and start_location_x<72/count of (event_name = tackle or interception (including pass type = interception) or dribbled past or foul) and event_x>=48"
- **Quote check note:** The page builds its text with JavaScript, so match_quote cannot read it; checked word for word in a browser.
- **Reference code (exact):** `football_metrics.ppda:ppda_statsbomb_hudl` on statsbomb-open-data. The source's own formula on the source's own event data.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 7.4222
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 9.0909
- Hudl's prose description also lists blocks, but its exact formula does not; this variant follows the formula.
- The formula counts interceptions made with a pass (pass type Interception). On the 2022 World Cup final that adds 2 actions for Argentina and moves its PPDA from 7.77 to 7.42.
- StatsBomb's IQ season value (team_season_ppda) exists; whether it is a ratio of sums or a mean of match values is not stated.

## ppda.wyscout: Wyscout

Opponent passes that start in the pressing team's final 60%, divided by the pressing team's fouls, interceptions, won defensive duels and sliding tackles there.

- **Formula:** opponent passes started in the final 60% / (fouls + interceptions + won defensive duels + sliding tackles) in the final 60%
- **Zone:** Pressing team's final 60%.
- **Passes counted:** All opponent passes that start in the zone; the page does not say whether failed passes count.
- **Source:** PPDA (Wyscout): https://dataglossary.wyscout.com/ppda/
- **Quote** (matches the source word for word, 2026-10-04): "we calculate all opponent passes that started there and divide them by the sum of defensive actions (fouls, interceptions, won defensive duels, sliding tackles) of the pressing team"
- **Reference code:** none yet.
- Lost duels do not count. Challenges and blocked passes are not in the list.
- The glossary's worked example: Liverpool v Manchester United, 20 October 2019, Liverpool 207 / (10 + 16 + 11 + 3) = 5.2.
- No reference implementation yet: the action list uses Wyscout's duel outcomes. The public Wyscout match event dataset (Pappalardo et al.) could carry one.

## ppda.opta-analyst: Opta Analyst

Opposition passes outside the pressing team's own defensive third, divided by the pressing team's fouls, tackles, interceptions, challenges and blocked passes outside its own defensive third.

- **Formula:** opposition passes outside the pressing team's defensive third / (fouls + tackles + interceptions + challenges + blocked passes) outside that third
- **Zone:** Outside the pressing team's own defensive third (about 67% of the pitch, not 60%).
- **Passes counted:** Not stated.
- **Source:** Opta football stats definitions (Opta Analyst): https://theanalyst.com/articles/opta-football-stats-definitions
- **Quote** (matches the source word for word, 2026-10-04): "In our PPDA calculation, the defensive actions are fouls, tackles, interceptions, challenges, and blocked passes."
- **Reference code (approximation):** `football_metrics.ppda:ppda_opta_analyst` on statsbomb-open-data. An approximation on StatsBomb events: blocked pass = Block (which also covers blocked shots), challenge = Dribbled Past, tackle = Duel of type Tackle; outside the defensive third = x > 40 of 120 for the pressing team. All passes are counted, as the page does not say.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 6.8116
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 8.9661
- Adds blocked passes to Trainor's four actions. The page shows no date, so when this wording started is not known.

## ppda.stats-perform-2016: Stats Perform (Opta Pro), about 2016

Opponent passes allowed per defensive action in the opponent's defensive three-fifths of the pitch, deferring to Trainor for the details.

- **Formula:** as ppda.trainor-2014
- **Zone:** Opponent's defensive 3/5 (the same 60% as Trainor).
- **Passes counted:** As Trainor.
- **Source:** How we measure pressure (Stats Perform): https://www.statsperform.com/insights/how-we-measure-pressure/
- **Quote** (matches the source apart from case, spacing, quote marks or hyphens, 2026-10-04): "Opponent passes allowed per defensive action, in the opponent's defensive 3/5ths of the pitch"
- **Reference code:** none yet.
- The page now shows a 2026 date but uses 2015/16 data, so it was republished; the original date and author are not known.

## ppda.understat: Understat

Passes allowed per defensive action in the opposition half.

- **Formula:** opponent passes in the opposition half / defensive actions in the opposition half
- **Zone:** The opposition half (50% of the pitch, not 60%).
- **Passes counted:** Not stated.
- **Source:** Understat league page script (column tooltips) (Understat): https://understat.com/js/league.min.js
- **Quote** (matches the source word for word, 2026-10-04): "Passes allowed per defensive action in the opposition half"
- **Quote check note:** The tooltip text is in the page's script, not its HTML.
- **Reference code:** none yet.
- The page does not list which defensive actions count.
- Understat's data hold ppda.att and ppda.def per match; its season value is the sum of att divided by the sum of def (a ratio of sums, not a mean of match values).
- OPPDA is the same measure for the opponent's pressing against this team.

## Caveats

- Values from different definitions are not comparable: zone, actions and pass counting all change the number. Cite the variant ID.
- No public definition counts ball recoveries as a defensive action. A formula that does (for example in the opposition half) is a house variant and gives much lower values.
- PPDA measures the high press only; a team that presses in its own half looks passive.
- Possession and territory confound it: a dominant team's defensive actions happen high up the pitch anyway.
- Every variant counts fouls, which end a possession but are not pressing.
- Game state, red cards and the scoreline change pressing; Trainor smooths match values with a 6-game rolling mean.
- A season value can be a ratio of sums (Understat) or a mean of match values; they differ.

## Related cards

`field_tilt`, `pressures`, `defensive_action_height`
