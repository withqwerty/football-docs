---
source_type: curated
source_url: https://web.archive.org/web/20151120002822/http://www.optasportspro.com/about/optapro-blog/posts/2012/blog-assessing-the-performance-of-premier-league-goalscorers
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# xG (expected goals)

Metric card `xg`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("xg")`, or one variant with its ID.

The xG of one shot is the output of a provider's model (Opta, Hudl StatsBomb, Wyscout, Understat and others), so this card does not define a model: it defines how shot values are read and added up. Totals differ for three reasons besides the model. Each provider gives every penalty one fixed value (Opta 0.79, Wyscout 0.76, Hudl StatsBomb 0.78, which is 0.7835 in the open data). Some totals add the shot values as they are (Wyscout, Understat, Hudl StatsBomb's xG columns) and some cap each possession at one goal with 1 - product of (1 - xG) (FBref, Hudl StatsBomb's cumulative xG). Penalty shoot-out kicks are not part of match xG. On the 2022 World Cup final, Argentina's xG is 2.7583 as a sum of StatsBomb shot values and 2.7027 as cumulative xG.

- **Measures:** The quality of the chances a team or player creates: each shot gets the probability, from a provider's model, that a shot like it is scored, and the card adds those probabilities up for a match, a season or a player.
- **Direction:** Higher values mean more or better chances. A team with no counted shot has a total of 0.
- **Unit:** expected goals (a sum of per-shot goal probabilities, each between 0 and 1)
- **Data:** event data
- **Also called:** expected goals, xG, pre-shot xG, shot xG, statsbomb_xg, cumulative xG

## Origin

Sam Green, 'Assessing the performance of Premier League goalscorers', OptaPro blog, Thursday 12 April 2012 (data to 9 April 2012). Green builds a model of a shot's probability of being scored and tallies up each player's shot probabilities into an expected goal (xG) value. Stats Perform's The Analyst credits Opta's Sam Green with introducing xG in 2012. Earlier academic models of shot probability exist; this post is the first public use of the name for this metric that the card can cite, not the first shot model.

Source: https://web.archive.org/web/20151120002822/http://www.optasportspro.com/about/optapro-blog/posts/2012/blog-assessing-the-performance-of-premier-league-goalscorers

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `xg.statsbomb-hudl` | Whole pitch (every shot). | exact |
| `xg.statsbomb-cumulative` | Whole pitch (every shot). | approximation |
| `xg.fbref` | Whole pitch (every shot). | none yet |
| `xg.opta` | Whole pitch (every shot). | none yet |
| `xg.wyscout` | Whole pitch (every shot). | none yet |
| `xg.understat` | Whole pitch (every shot). | none yet |

## xg.statsbomb-hudl: Hudl StatsBomb, sum of shot values (penalties included)

The sum of the StatsBomb xG value (shot.statsbomb_xg in the open data, shot_xg in Hudl's formulas) over all of the team's shots, penalties included. Hudl StatsBomb's team glossary uses this total as the 'for' side of 'xG Difference Inclusive'; its column named xG leaves penalties out (see npxg).

- **Formula:** sum of shot.statsbomb_xg over the team's Shot events (Hudl: Count of shot_xg (for))
- **Zone:** Whole pitch (every shot).
- **Source:** Event Data Glossary: Team Metrics (Hudl StatsBomb): https://support.hudl.com/s/article/event-data-glossary-team-metrics
- **Quote** (checked word for word in a browser, 2026-10-04): "xG minus xG conceded (including penalties)."
- **Quote check note:** The page builds its text with JavaScript, so match_quote cannot read it; checked word for word in a browser.
- **Reference code (exact):** `football_metrics.xg:xg_statsbomb_hudl` on statsbomb-open-data. The source's own formula on the source's own event data: the sum of shot.statsbomb_xg over the team's Shot events, with penalty shoot-out kicks (period 5) left out.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 2.7583
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 2.2726
- Hudl's formula for xG Difference Inclusive is the shot_xg total for the team minus the total against it; Hudl writes 'Count of' for a sum of the values.
- Penalty value: the Hudl blog 'What are Expected Goals (xG)?' says the 2022 model update set it to 0.78 xG. In the open data every penalty checked carries 0.7835, including all 11 penalties of match 3869685 (3 in play, 8 in the shoot-out).
- Hudl does not say how shoot-outs are treated; the reference code leaves out period 5, as for every match total.
- StatsBomb's model uses freeze frames (goalkeeper and defender positions) and shot impact height; the open data has the value, not the model.

## xg.statsbomb-cumulative: Hudl StatsBomb cumulative xG (one possession is worth at most one goal)

Within each possession, the team's shots count as 1 minus the product of each shot's probability of not scoring, so a shot and its rebound cannot add up to more than one goal. The possession values are then added up. Hudl calls this cumulative xG and shows it in IQ, the IQ API and the match race chart.

- **Formula:** sum over possessions of [1 - product over the possession's shots of (1 - shot_xg)]
- **Zone:** Whole pitch (every shot).
- **Source:** Cumulative Expected Goals (xG) (Hudl StatsBomb): https://support.hudl.com/s/article/cumulative-expected-goals
- **Quote** (checked word for word in a browser, 2026-10-04): "From a team perspective, that sequence of play can only ever be worth 1, so there is a simple formula that discounts the values in the sequence, to keep the combined value of these shots under the maximum of 1."
- **Quote check note:** The page builds its text with JavaScript, so match_quote cannot read it; checked word for word in a browser.
- **Reference code (approximation):** `football_metrics.xg:xg_statsbomb_cumulative` on statsbomb-open-data. Hudl's formula on StatsBomb events, but the grouping is an assumption: a 'sequence of play' is read as the event's possession number in the open data. Hudl's team glossary warns elsewhere that event data and IQ have different possessions, so IQ values can differ. All shots count, penalties included; penalty shoot-out kicks (period 5) are left out.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 2.7027
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 2.2726
- Hudl's example: two shots of 0.8 xG in one sequence give 1 - (0.2 * 0.2) = 0.96, not 1.6.
- The page first says cumulative xG applies to a sequence of play whose xG would otherwise total more than 1; its FAQ says it adjusts any sequence with more than one shot. The reference applies the formula to every possession; for a possession with one shot it gives that shot's value.
- The page does not say whether penalties count. The reference counts every shot, penalties included.
- On the 2022 World Cup final, two Argentina possessions have two shots each (104th and 107th minutes), so cumulative xG is 0.0556 lower than the plain sum.

## xg.fbref: FBref (Opta values, possession-capped totals), historical to January 2026

Opta's shot xG, totalled per possession as 1 minus the probability that the defending team does not concede in that possession, so one possession is worth at most one goal. Totals include penalty kicks (0.79 each) and leave out penalty shoot-outs. A player's total uses the same rule over his own shots in each possession, so player totals need not add up to the team total.

- **Formula:** sum over possessions of [1 - product over the possession's shots of (1 - Opta xG)]
- **Zone:** Whole pitch (every shot).
- **Source:** xG Explained (FBref (Sports Reference)): https://web.archive.org/web/20260107000728/https://fbref.com/en/expected-goals-model-explained/
- **Quote** (matches the source apart from case, spacing, quote marks or hyphens, 2026-10-04): "To solve this problem, we find the probability that the defending team does not allow a goal in this possession."
- **Quote check note:** FBref blocks automated clients, so the quote is checked against a Wayback Machine snapshot of 7 January 2026.
- **Reference code:** none yet.
- FBref's example: shots of .41, .47 and .79 in one Nürnberg possession give 1 - .0657 = .9343 xG, not 1.67.
- FBref treats corner kicks and free kicks as the start of a new possession, and said it was still studying the issue.
- FBref's column tooltip says xG totals include penalty kicks but not penalty shoot-outs, unless noted otherwise.
- Historical: FBref removed its Opta advanced data, xG included, on 20 January 2026 (Sports Reference blog, 'FBref & Stathead Data Update'). Values cited from FBref before then follow this variant.
- No reference code: the values come from Opta's model, which is not in the open data.

## xg.opta: Opta (Stats Perform, The Analyst)

Opta's xG model gives each shot the probability that it is scored, from information on similar past shots; totals add those values. The current model is trained with XGBoost on nearly one million shots from 40 competitions between 2018-19 and 2021-22 and evaluates over 20 variables. Penalties get one constant value, 0.79 xG.

- **Formula:** sum of Opta shot xG (penalties = 0.79)
- **Zone:** Whole pitch (every shot).
- **Source:** What Are Expected Goals (xG)? (Jonny Whitmore (The Analyst), 2023-08-08): https://theanalyst.com/articles/what-is-expected-goals-xg
- **Quote** (matches the source word for word, 2026-10-04): "Penalties are the most consistent shot in football and are given a constant value reflective of their historical conversion rate (0.79 xG)."
- **Reference code:** none yet.
- Opta uses a separate model for women's competitions.
- The page does not say how The Analyst totals shots within one possession.
- No reference code: the values come from Opta's model, which is not in the open data.

## xg.wyscout: Wyscout

Wyscout's machine-learning model gives each shot a probability of scoring from the location of the shot, the location of the assist, foot or head, the assist type, a dribble just before the shot, set piece, counterattack or transition, and the tagger's assessment of danger. A penalty is fixed at 0.76. Totals add shot values with no cap per possession.

- **Formula:** sum of Wyscout shot xG (penalties = 0.76), no possession cap
- **Zone:** Whole pitch (every shot).
- **Source:** xG (Wyscout): https://dataglossary.wyscout.com/xg/
- **Quote** (matches the source word for word, 2026-10-04): "At the moment there are no additional constraints for xG of shots in the same possession. So a sequence of shots in short succession (like a rebound after a save) could theoretically yield an xG value of > 1."
- **Reference code:** none yet.
- So a shot and its rebound can add up to more than 1 xG in one possession.
- No reference code: the values come from Wyscout's model, which is not in StatsBomb's open data.

## xg.understat: Understat

Understat's xG comes from a neural network trained on more than 100,000 shots with over 10 parameters each; the parameters are not listed. A team's match xG is the plain sum of its shot values, penalties included.

- **Formula:** sum of Understat shot xG
- **Zone:** Whole pitch (every shot).
- **Source:** Understat home page (Understat): https://understat.com/
- **Quote** (matches the source word for word, 2026-10-04): "For this case, we trained neural network prediction algorithms with the large dataset (>100,000 shots, over 10 parameters for each)."
- **Reference code:** none yet.
- Checked on Understat's public data (4 October 2026): in Liverpool v Manchester City, 8 February 2026 (Understat match 29024), Manchester City's match xG of 2.41476 is the sum of its 16 shot values, a 0.7612 penalty included.
- Understat does not publish its penalty value. In Erling Haaland's shot data, penalties carry 0.7612 in the Premier League from 2022/23 and 0.7578 in his Bundesliga seasons 2020/21 and 2021/22.
- No reference code: the values come from Understat's model, which is not in the open data.

## Caveats

- Shot values from different providers' models are not comparable, even for the same shot. Cite the variant ID and the provider.
- Penalty values differ by provider (0.76 to 0.79), so a penalty-heavy total moves with the provider. Use npxg to compare without them.
- A sum of shot values can give one possession more than one goal (a shot and its rebound). FBref and Hudl StatsBomb's cumulative xG cap each possession at 1; plain sums do not.
- Penalty shoot-out kicks are shot events in some data (StatsBomb period 5, each with a penalty xG value). Leave them out of match xG.
- Own goals are not shots and carry no xG.
- Providers update their models; a model change moves every value, so values from before and after a change are not comparable.
- xG does not know who shoots: FBref's explainer notes that it ignores the quality of the players involved. Goals minus xG over a few matches is mostly noise.
- A column called xG may already exclude penalties: Hudl StatsBomb's player and team xG are non-penalty. See npxg.

## Related cards

`npxg`, `xg_assisted`, `xa`, `psxg` (no card yet)
