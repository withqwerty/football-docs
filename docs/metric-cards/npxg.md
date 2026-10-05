---
source_type: curated
source_url: https://web.archive.org/web/20260107000728/https://fbref.com/en/expected-goals-model-explained/
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# npxG (non-penalty expected goals)

Metric card `npxg`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("npxg")`, or one variant with its ID.

npxG is xG without penalty kicks. It is a filter on the xg card, so the provider's model still sets each shot's value. Two traps: Hudl StatsBomb's metric named xG is already non-penalty (its label is NP xG), so it matches this card, not xg; and FBref's npxG also removed shots from a rebound after a penalty, which a plain filter on shot type keeps. Penalty shoot-out kicks are never counted. On the 2022 World Cup final, France's npxG is 0.7056 against an xG of 2.2726, because two of its in-play shots were penalties.

- **Measures:** The quality of the chances a team or player creates without penalties: the xG total with penalty kicks taken out, so that a penalty, which every provider values at one fixed number, does not swamp the total.
- **Direction:** Higher values mean more or better chances. A team with no counted shot has a total of 0.
- **Unit:** expected goals (a sum of per-shot goal probabilities, each between 0 and 1)
- **Data:** event data
- **Also called:** non-penalty expected goals, non-penalty xG, NPxG, NP xG, not penalty expected goals

## Origin

No single origin. npxG is a filter on xG (see the xg card for Sam Green's 2012 OptaPro post). FBref's xG explainer recommends npxG (non-penalty expected goals) for xG without penalty kicks. Who first used the label is not known.

Source: https://web.archive.org/web/20260107000728/https://fbref.com/en/expected-goals-model-explained/

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `npxg.statsbomb-hudl` | Whole pitch (every non-penalty shot). | exact |
| `npxg.fbref` | Whole pitch (every non-penalty shot). | none yet |
| `npxg.understat` | Whole pitch (every non-penalty shot). | none yet |

## npxg.statsbomb-hudl: Hudl StatsBomb 'xG' (NP xG)

The sum of the StatsBomb xG value over the team's shots whose shot type is not Penalty. Hudl StatsBomb names this metric xG in its glossary; the column label is NP xG (abbreviation NPxG). In the player glossary, xG is 'Non-penalty expected goals produced by the player' over non-penalty shots.

- **Formula:** Count of shot_xg where shot type≠penalty (sum of shot.statsbomb_xg over Shot events with shot.type.name not "Penalty")
- **Zone:** Whole pitch (every non-penalty shot).
- **Source:** Event Data Glossary: Team Metrics (Hudl StatsBomb): https://support.hudl.com/s/article/event-data-glossary-team-metrics
- **Quote** (checked word for word in a browser, 2026-10-04): "Cumulative expected goal value of all non-penalty shots."
- **Quote check note:** The page builds its text with JavaScript, so match_quote cannot read it; checked word for word in a browser.
- **Reference code (exact):** `football_metrics.xg:npxg_statsbomb_hudl` on statsbomb-open-data. The source's own formula on the source's own event data: shot.statsbomb_xg summed over the team's Shot events with shot.type.name not "Penalty", with penalty shoot-out kicks (period 5) left out.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 1.9748
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.7056
- 'Cumulative' in Hudl's description means a running total. The formula is a plain sum, not the possession-capped cumulative xG of xg.statsbomb-cumulative.
- A shot from a rebound after a penalty counts, as its shot type is not Penalty.
- Hudl's 'xG Conceded' and 'xG Difference' are also non-penalty; 'xG Difference Inclusive' includes penalties (see xg.statsbomb-hudl).

## npxg.fbref: FBref (Opta values, penalty rebounds removed), historical to January 2026

FBref's possession-capped xG (xg.fbref) without penalty kicks and without shots from a rebound after a penalty kick: FBref treats such a rebound as part of the penalty kick xG. In FBref's example a Reus penalty (.79) and his rebound (.92) give .9832 xG and 0 npxG.

- **Formula:** xg.fbref total, leaving out penalty kicks and shots from a rebound after a penalty kick
- **Zone:** Whole pitch (every non-penalty shot).
- **Source:** xG Explained (FBref (Sports Reference)): https://web.archive.org/web/20260107000728/https://fbref.com/en/expected-goals-model-explained/
- **Quote** (matches the source word for word, 2026-10-04): "However, since the second shot is also considered to be a part of the penalty kick xG, Reus gets 0 npxG (non-penalty expected goals) on this play."
- **Quote check note:** FBref blocks automated clients, so the quote is checked against a Wayback Machine snapshot of 7 January 2026.
- **Reference code:** none yet.
- FBref's tooltip names the column 'Non-Penalty Expected Goals' (npxG) and says 'Provided by Opta.'
- Historical: FBref removed its Opta advanced data, xG and npxG included, on 20 January 2026 (Sports Reference blog, 'FBref & Stathead Data Update'). Values cited from FBref before then follow this variant.
- No reference code: the values come from Opta's model, which is not in the open data.

## npxg.understat: Understat (NPxG)

Understat's xG without penalties. Its team column NPxG is expected goals for, without penalties and own goals; its player column NPxG is xG without penalties.

- **Formula:** sum of Understat shot xG over shots whose situation is not Penalty
- **Zone:** Whole pitch (every non-penalty shot).
- **Source:** Understat league page script (column tooltips) (Understat): https://understat.com/js/league.min.js
- **Quote** (matches the source word for word, 2026-10-04): "Expected goals for without penalties and own goals"
- **Quote check note:** The tooltip text is in the page's script, not its HTML.
- **Reference code:** none yet.
- Checked on Understat's public data (4 October 2026): in Liverpool v Manchester City, 8 February 2026 (Understat match 29024), Manchester City's npxG of 1.65359 is its xG of 2.41476 minus its one penalty (0.7612).
- Understat does not say how it treats a rebound after a penalty, or how own goals enter its xG.
- NPxGA and NPxGD are the same measure for shots conceded and the difference.
- No reference code: the values come from Understat's model, which is not in the open data.

## Caveats

- Check what a column called xG means before comparing: Hudl StatsBomb's player and team xG leave penalties out, FBref's and Understat's xG include them.
- Rebounds after a penalty: FBref's npxG left them out; a filter on shot type (Hudl StatsBomb) keeps them. Understat does not say.
- The shot values come from each provider's model, so npxG from different providers is not comparable. Cite the variant ID.
- Penalty shoot-out kicks are not part of match xG or npxG.
- Own goals are not shots and carry no xG.
- npxG removes the penalty but not the foul that won it: a player who wins penalties gets no credit for them.

## Related cards

`xg`, `xg_assisted`, `xa`, `psxg` (no card yet)
