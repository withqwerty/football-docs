---
source_type: curated
source_url: https://www.hudl.com/blog/introducing-xgchain-and-xgbuildup
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# xG assisted (xGAs, xAG; the shot-linked xA)

Metric card `xg_assisted`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("xg_assisted")`, or one variant with its ID.

xG assisted credits the passer with the xG of the shot that the pass led directly to (the key pass or shot assist). It is a shot-linked metric: no shot, no credit, and the value is the shooter's xG, so it depends on the provider's xG model. Many sites call it xA, but it is NOT the pass-level expected assists model of Opta / Stats Perform, which values every completed pass whether or not a shot follows; that metric is card `xa`. FBref renamed its version from xA to xAG in October 2022 when it switched to Opta. On the 2022 World Cup final (StatsBomb open data), Argentina's xG assisted is 1.34 from 15 assisted shots and France's is 0.57 from 4.

- **Measures:** The quality of the chances a player or team creates for team-mates: the xG of each shot that their pass led to, credited to the passer.
- **Direction:** Higher values mean the passes set up more and better shots. A pass that no shot follows earns nothing.
- **Unit:** expected goals (xG), summed over the assisted shots
- **Data:** event data
- **Also called:** xG Assisted, xGAs, xAG, expected assisted goals, xA (Understat, Wyscout, American Soccer Analysis, FBref before October 2022), xAssists, xG from key passes

## Origin

The first use of the name is not known. By 30 September 2018 Thom Lawrence of StatsBomb could describe xA as a basic metric that credits creative players who make key passes, so this shot-linked meaning was in use before Stats Perform published its pass-level xA (card xa) in March 2021.

Source: https://www.hudl.com/blog/introducing-xgchain-and-xgbuildup

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `xg_assisted.statsbomb-hudl` | Whole pitch. | exact |
| `xg_assisted.fbref` | Whole pitch. | none yet |
| `xg_assisted.understat` | Whole pitch. | none yet |
| `xg_assisted.wyscout` | Whole pitch. | none yet |
| `xg_assisted.asa` | Whole pitch. | none yet |

## xg_assisted.statsbomb-hudl: Hudl StatsBomb (xG Assisted)

For each player, the sum of the StatsBomb xG of the shots that the player assisted, that is, the shots whose key pass the player made.

- **Formula:** Count of shot _xG for shots that the player assisted (team value: the sum over the team's players)
- **Zone:** Whole pitch.
- **Passes counted:** Every pass linked to a shot as its key pass (open play and set pieces). Penalties have no key pass and add nothing; Hudl's xG is non-penalty anyway.
- **Source:** Event Data Glossary: Player Metrics (Hudl StatsBomb): https://support.hudl.com/s/article/event-data-glossary-player-metrics
- **Quote** (checked word for word in a browser, 2026-10-04): "xG assisted. This is calculated from the expected goal value of the assisted shot."
- **Quote check note:** The page builds its text with JavaScript, so match_quote cannot read it; checked word for word in a browser. The formula 'Count of shot _xG for shots that the player assisted' was checked the same way.
- **Reference code (exact):** `football_metrics.xg_assisted:xg_assisted_statsbomb_hudl` on statsbomb-open-data. The source's own definition on the source's own event data: an assisted shot is a Shot with shot.key_pass_id, its value is shot.statsbomb_xg, and the credit goes to the team (and player) of the linked Pass. The penalty shoot-out (period 5) is excluded; extra time counts.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 1.3397
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 0.5687
- The glossary short name is xG Assisted and the abbreviation xGAs.
- Hudl also lists Open Play xG Assisted (OPxGAs, for events not from a set piece) and Set Piece xG Assisted (SPxGAs, for events from a set piece), and xG & xG Assisted (xG+xGAs). The glossary does not say which StatsBomb field decides 'from set piece', so these splits have no reference code.
- On the 2022 World Cup final the team values are the sum of shot.statsbomb_xg over 15 assisted shots for Argentina and 4 for France. The same totals come from the pass side (pass.assisted_shot_id) and from all xG minus the xG of shots with no key pass.
- Player values for the same match: Alexis Mac Allister 0.3034 (his assist for Di María's goal), Di María 0.2781, Messi 0.2742; for France, Ibrahima Konaté 0.2775 and Marcus Thuram 0.1017 (his assist for Mbappé's second goal). The module's xg_assisted_by_player function gives them.

## xg_assisted.fbref: FBref xAG (expected assisted goals), historical

The xG of the shot that follows a completed pass, credited to the passer. FBref used Opta's xG.

- **Formula:** sum of Opta xG over the shots that directly follow the player's completed passes
- **Zone:** Whole pitch.
- **Passes counted:** Only completed passes that a shot follows.
- **Source:** Expected Goals Model Explained (FBref (Sports Reference)): https://web.archive.org/web/20251031052137/https://fbref.com/en/expected-goals-model-explained/
- **Quote** (matches the source word for word, 2026-10-04): "Players receive xAG only when a shot is taken after a completed pass."
- **Reference code:** none yet.
- FBref called this metric xA until October 2022. When it switched its data provider to Opta it renamed it xAG and used xA for Opta's pass-level model (card xa).
- FBref also showed npxG + xAG and per-90 versions (xAG/90).
- Historical: FBref removed its Opta advanced data on 20 January 2026 (Sports Reference blog), so these values are no longer published there. The source is a Wayback Machine snapshot.
- No reference code: the value uses Opta's xG model, which is not in StatsBomb open data.

## xg_assisted.understat: Understat (labelled xA)

The sum of the Understat xG of the shots that came from a player's key passes.

- **Formula:** sum of Understat xG over the shots from the player's key passes
- **Zone:** Whole pitch.
- **Passes counted:** Key passes (passes that lead to a shot). The tooltip does not say how set pieces or penalties are treated; a penalty has no key pass.
- **Source:** Understat league table (column tooltips) (Understat): https://understat.com/league/EPL
- **Quote** (checked word for word in a browser, 2026-10-04): "The sum of Expected Goals of shots from a player's key passes"
- **Quote check note:** The tooltip is a title attribute that the page's script builds, so match_quote cannot read it; checked word for word in a browser.
- **Reference code:** none yet.
- Understat labels this column xA. It is not Opta's pass-level xA.
- No reference code: the value uses Understat's own xG model, which is not in StatsBomb open data.

## xg_assisted.wyscout: Wyscout (labelled xA)

The xA value of a pass is the xG of the shot that the pass led to. The pass must be a shot assist.

- **Formula:** xA of a pass = Wyscout xG of the shot that the pass led to; a player's xA is the sum over the player's shot assists
- **Zone:** Whole pitch.
- **Passes counted:** Shot assists: regular passes, crosses, corners, throw-ins and passes from free kicks that a shot follows.
- **Source:** xA (Wyscout): https://dataglossary.wyscout.com/xa/
- **Quote** (matches the source word for word, 2026-10-04): "Expected assist (xA) value for a pass is the value of expected goals (xG) of the shot that this pass led to."
- **Reference code:** none yet.
- Fouls suffered that lead to penalties or direct free kicks earn no xA, as goals from them do not count as assisted.
- A pass to an offside player is an unsuccessful pass and has no xA, even if a goal follows. The same applies after a VAR-found foul or offside.
- Wyscout labels this xA. It is not Opta's pass-level xA.
- No reference code: the value uses Wyscout's own xG model, which is not in StatsBomb open data.

## xg_assisted.asa: American Soccer Analysis (xAssists, xA)

The xG of all the shots for which a player made the pass, using ASA's own xG model.

- **Formula:** sum of ASA xG over the shots whose key pass the player made
- **Zone:** Whole pitch.
- **Passes counted:** Key passes, which ASA defines as passes that lead directly to a shot.
- **Source:** Expected goals explanation (American Soccer Analysis): https://www.americansocceranalysis.com/explanation
- **Quote** (matches the source word for word, 2026-10-04): "You will now find a new stat on the players page: xAssists. These measure the Expected Goals value of all shots for which a particular player passed the ball."
- **Reference code:** none yet.
- ASA's xG model is a logistic regression with separate models for teams, shooters and goalkeepers.
- The page is undated. Its example credits Latif Blessing with 0.762 xA for a pass to a Christian Ramirez shot worth 0.762 xG that did not score.
- No reference code: the value uses ASA's own xG model, which is not in StatsBomb open data.

## Caveats

- This is not card xa. Understat, Wyscout and American Soccer Analysis label this metric xA, and FBref did until October 2022; Opta's xA is a pass-level model. Check which one a number is before you compare it.
- The value is the shooter's xG, so it depends on the provider's xG model and on what the receiver does after the pass, not only on the pass.
- Penalties have no key pass, so penalty xG never counts. A foul won that leads to a penalty or a direct free kick earns nothing (Wyscout says so explicitly).
- Rebounds and other shots with no linked key pass earn no xG assisted for anyone. On the 2022 World Cup final, Messi's extra-time goal (0.49 xG) has no key pass.
- Set-piece deliveries (corners, free-kick passes, throw-ins) count unless a variant splits them out; Hudl StatsBomb has separate open-play and set-piece versions.

## Related cards

`xa`, `xg`, `npxg`, `key_passes` (no card yet)
