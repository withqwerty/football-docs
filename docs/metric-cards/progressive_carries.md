---
source_type: curated
source_url: https://www.statsperform.com/insights/identifying-progressive-ball-carriers/
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# Progressive carries

Metric card `progressive_carries`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("progressive_carries")`, or one variant with its ID.

A progressive carry is a carry (a player moving with the ball at their feet) that takes the ball a long way towards the opponent's goal. The public rules differ a lot: Wyscout's 'progressive run' uses 30 / 15 / 10 m thresholds by half, FBref (on Opta data, until January 2026) used 10 yards from the ball's furthest point in the last six passes, Opta Analyst counts any carry that gains more than 5 m upfield, a Stats Perform article counts carries of more than 5 m that end at least 5 m closer to goal in the opposition half, and a 2023 StatsBomb blog uses 25% of the remaining distance to goal. Carries are also derived differently by each provider. On the 2022 World Cup final the reference code gives from 48 (Wyscout) to 173 (Opta Analyst) progressive carries for both teams together.

- **Measures:** How often a player or team moves the ball a long way towards the opponent's goal by running with it.
- **Direction:** Higher values mean more ball progression by carrying. A count, not a quality measure: it grows with possession, space and the number of carries a player makes.
- **Unit:** carries (a count, often given per 90 minutes)
- **Data:** event data
- **Also called:** prog carries, PrgC, progressive carry, progressive runs, progressive ball carries

## Origin

No single origin is confirmed. A Stats Perform article by Peter Mckeever, written with Premier League data up to 2018 (the page now shows a 2026 republication date), defines progressive carries on Opta's carries, which it calls a by-product of the OptaPro sequence data framework. StatsBomb added Carry events to its data in specification v1.1 (13 May 2019).

Source: https://www.statsperform.com/insights/identifying-progressive-ball-carriers/

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `progressive_carries.wyscout` | Whole pitch; the threshold depends on the halves the run starts and ends in. | approximation |
| `progressive_carries.fbref-opta` | Carries that end outside the carrying team's defending 50% (in the opponent's half). | approximation |
| `progressive_carries.opta-analyst` | Whole pitch. | approximation |
| `progressive_carries.stats-perform-2019` | The opposition half. | approximation |
| `progressive_carries.statsbomb-blog-2023` | Whole pitch (no zone limit is stated). | approximation |

## progressive_carries.wyscout: Wyscout (progressive run)

A continuous ball control by one player that moves the ball closer to the opponent's goal, measured from the start point to the player's last touch: at least 30 m closer when the start and finish are both in the own half, at least 15 m when they are in different halves, and at least 10 m when both are in the opponent's half.

- **Formula:** gain = distance to the opponent's goal at the start - distance at the last touch; progressive if gain >= 30 m (own half to own half), >= 15 m (across halfway) or >= 10 m (opponent's half to opponent's half)
- **Zone:** Whole pitch; the threshold depends on the halves the run starts and ends in.
- **Passes counted:** All progressive runs; the glossary gives no success rule for runs.
- **Source:** Progressive run (Wyscout): https://dataglossary.wyscout.com/progressive_run/
- **Quote** (matches the source apart from case, spacing, quote marks or hyphens, 2026-10-04): "at least 30 meters closer to opponent goal if starting and finishing points are in own half - at least 15 meters closer to opponent goal if starting and finishing points are in different field halves - at least 10 meters closer to opponent goal if starting and finishing points are in opponent half"
- **Quote check note:** The three thresholds are list items on the page; the hyphens mark the list items.
- **Reference code (approximation):** `football_metrics.progression:progressive_carries_wyscout` on statsbomb-open-data. An approximation on StatsBomb events: a StatsBomb Carry event stands for a Wyscout run (they are not the same event), and carry.end_location for the last touch; distance is the straight-line distance to the goal centre (120, 40); own half is x < 60; StatsBomb yards are converted to metres (1 yard = 0.9144 m).
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 23.0
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 25.0
- Wyscout calls it a progressive run, not a progressive carry. Its thresholds are the same as for its progressive pass.
- The glossary does not say whether 'closer to opponent goal' is the straight-line distance to the goal or the gain along the pitch.

## progressive_carries.fbref-opta: FBref (Opta data), historical

Carries that move the ball towards the opponent's goal line at least 10 yards from its furthest point in the last six passes, or any carry into the penalty area. Carries that end in the defending 50% of the pitch do not count.

- **Formula:** carry ending outside the defending 50%, and (end - furthest point of the ball in the last six passes >= 10 yards towards the goal line, or end in the penalty area)
- **Zone:** Carries that end outside the carrying team's defending 50% (in the opponent's half).
- **Passes counted:** All carries that meet the rule; FBref states no success rule.
- **Source:** Premier League Possession Stats (archived 4 May 2025) (FBref, 2025-05-04): https://web.archive.org/web/20250504112623/https://fbref.com/en/comps/9/possession/Premier-League-Stats
- **Quote** (checked word for word in a browser, 2026-10-04): "Carries that move the ball towards the opponent's goal line at least 10 yards from its furthest point in the last six passes, or any carry into the penalty area. Excludes carries which end in the defending 50% of the pitch"
- **Quote check note:** The definition is the column tooltip (the data-tip attribute of the PrgC header), not readable page text, so match_quote cannot read it; checked word for word in the archived page in a browser.
- **Reference code (approximation):** `football_metrics.progression:progressive_carries_fbref` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta carries: StatsBomb Carry events that end at x >= 60; progressive if carry.end_location is in the penalty area (x >= 102, 18 <= y <= 62) from outside it, or if end x minus the furthest x of the ball is at least 10 (StatsBomb units are yards). The furthest x is read as the largest x among the carry start and the start and end of the team's previous six completed passes in the same StatsBomb possession.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 28.0
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 37.0
- FBref removed its Opta advanced data on 20 January 2026 (Sports Reference blog, 'FBref & Stathead Data Update'), so this variant is historical.
- The zone rule differs from FBref's progressive passes, which exclude passes that start in the defending 40%; for carries the end point must be outside the defending 50%.
- FBref does not say how the 'furthest point in the last six passes' is found. The reference code states its reading.

## progressive_carries.opta-analyst: Opta Analyst

Ball carries that move the ball more than five metres upfield. A carry is the player moving the ball five metres or more.

- **Formula:** carry with (end - start along the length of the pitch) > 5 m
- **Zone:** Whole pitch.
- **Passes counted:** All carries that meet the rule.
- **Source:** Opta football stats definitions (Opta Analyst): https://theanalyst.com/articles/opta-football-stats-definitions
- **Quote** (matches the source word for word, 2026-10-04): "Ball carries that move the ball more than five metres upfield."
- **Reference code (approximation):** `football_metrics.progression:progressive_carries_opta_analyst` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta carries: StatsBomb Carry events whose gain along x (carry.end_location x - location x) is more than 5 m = 5.468 StatsBomb units (yards). StatsBomb carries shorter than Opta's 5 m minimum can never pass this test.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 83.0
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 90.0
- The same glossary defines carry directness as total progressive carry distance / total carry distance.
- The page shows no date.

## progressive_carries.stats-perform-2019: Stats Perform (Peter Mckeever)

Carries in the opposition half that are longer than five metres and move the ball at least five metres towards the opposition goal. A carry is any movement of the ball by a player of more than five metres from where they received the ball; a progressive carry is successful when the player keeps possession.

- **Formula:** carry with length > 5 m, in the opposition half, and distance to goal at the start - distance at the end >= 5 m
- **Zone:** The opposition half.
- **Passes counted:** All such carries; successful ones are those where the player retains possession.
- **Source:** Identifying Progressive Ball Carriers (Peter Mckeever): https://www.statsperform.com/insights/identifying-progressive-ball-carriers/
- **Quote** (matches the source word for word, 2026-10-04): "In this article we look at carries that occur in the opposition half, which are greater than five metres and move the ball at least five metres towards the opposition goal."
- **Reference code (approximation):** `football_metrics.progression:progressive_carries_stats_perform_2019` on statsbomb-open-data. An approximation on StatsBomb events of a definition written for Opta carries: StatsBomb Carry events with straight-line length over 5 m (5.468 yards), ending at x > 60, whose straight-line distance to the goal centre (120, 40) falls by at least 5 m. Possession retention is not tested, so all carries that meet the rule count.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 56.0
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 56.0
- The article says the carries 'occur in the opposition half' but also shows defenders who begin a progressive carry in their own half and move the ball into the opposition half. The reference code therefore tests where the carry ends.
- The article uses Premier League data from 2013 to 2018. The page now shows a republication date of 4 June 2026; the original date is not shown.

## progressive_carries.statsbomb-blog-2023: Hudl StatsBomb blog (2023)

Any carry, dribbles included, that moves the ball at least 25% of the remaining distance towards the centre of the goal. The same article applies the rule to successful passes.

- **Formula:** carry with distance to the goal centre at the end <= 0.75 x distance at the start
- **Zone:** Whole pitch (no zone limit is stated).
- **Passes counted:** All carries that meet the rule (the article's 'successful' qualifier is attached to passes; StatsBomb carries have no outcome).
- **Source:** The Art of Progression: An Analysis of Passing vs. Ball Carrying (Jaymes Monte, 2023-03-22): https://blogarchive.statsbomb.com/articles/soccer/the-art-of-progression-an-analysis-of-passing-vs-ball-carrying/
- **Quote** (matches the source word for word, 2026-10-04): "Any successful pass (set pieces excluded) or carry (including dribbles) that moves the ball at least 25% of the remaining distance towards the centre of the goal."
- **Reference code (approximation):** `football_metrics.progression:progressive_carries_statsbomb_blog` on statsbomb-open-data. StatsBomb's own rule on StatsBomb events, but the article gives it in prose, not on StatsBomb fields, so the field choices are ours: every Carry event (a StatsBomb Dribble event marks a take-on at one location; the ball movement with it is in Carry events); distance = straight-line distance from location and carry.end_location to the goal centre (120, 40).
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 25.0
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 26.0
- This is the methodology of one blog article, not a Hudl StatsBomb product metric: Hudl's Event Data Glossary (player metrics) has no progressive carry metric.
- At player level the article normalises by the number of touches (progressive carries per 100 touches).

## Caveats

- Values from different definitions are not comparable: the distance rule, the zone and the carry itself all differ. Cite the variant ID.
- Carries are derived, not observed directly, and each provider derives them differently: Opta needs a movement of five metres or more, StatsBomb's Carry is a player controlling the ball at their feet, moving or standing still, and Wyscout's run is one player's continuous control of the ball.
- Units differ: Wyscout and Opta Analyst state metres, FBref yards; StatsBomb's 120 x 80 grid is in yards on a fixed pitch, whatever the real pitch size.
- Whether 'closer to goal' means the straight-line distance to the centre of the goal or the gain along the pitch is often not stated. The reference code says which it uses.
- Counts grow with possession and with the space the opponent allows (strong teams carry more against deep blocks); compare per 90 minutes or per 100 touches.
- Many web explainers give a rule of 10 m outside the final 40% and 5 m inside it attributed to FBref, StatsBomb or Opta with no primary source; it does not match FBref's own wording.
- FBref no longer shows Opta's advanced data: the Sports Reference blog said on 20 January 2026 that the data provider had ended its access. FBref values are historical.

## Related cards

`progressive_passes`, `xt`, `passes_into_final_third` (no card yet)
