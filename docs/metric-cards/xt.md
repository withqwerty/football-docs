---
source_type: curated
source_url: https://karun.in/blog/expected-threat.html
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# xT (expected threat)

Metric card `xt`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("xt")`, or one variant with its ID.

xT gives every zone of the pitch a value: the probability that a team with the ball there scores within the next few actions. A pass, cross or carry is worth the value of the zone where it ends minus the value of the zone where it starts. Karun Singh introduced it in a blog post in early 2019. The value surface is learned from data, so the grid size, the data, the stopping rule for the iteration and which actions count all change the numbers. On the 2022 World Cup final, Singh's published 12 x 8 surface gives Argentina 1.86 xT added and France 1.18.

- **Measures:** How much a ball-progressing action (pass, cross or carry) raises the chance of scoring, from where the ball starts to where it ends, using a value for each zone of the pitch.
- **Direction:** Higher means more threat added. Moving the ball backwards gives a negative value.
- **Unit:** probability of scoring (an action's value is a difference of two probabilities)
- **Data:** event data
- **Also called:** expected threat, xthreat

## Origin

Karun Singh, 'Introducing Expected Threat (xT)', blog post, early 2019. The page has no date; the Wayback Machine holds it from 22 February 2019. Singh credits Cervone et al.'s possession-value work in basketball for the motivation and notes that valuing every location on the pitch is not new. Earlier Markov-chain possession models in football include Sarah Rudd's 2011 NESSIS talk.

Source: https://karun.in/blog/expected-threat.html

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `xt.singh-2019` | Whole pitch, divided into a 16 x 12 grid (192 zones); the post says another resolution can be used. | none yet |
| `xt.singh-open-12x8` | Whole pitch, 12 x 8 grid. | approximation |
| `xt.socceraction` | Whole pitch; default grid 16 x 12. | none yet |
| `xt.databallpy` | Whole pitch, 32 x 24 grid. | none yet |

## xt.singh-2019: Singh (2019), the original

Each zone's xT is the probability of shooting there times the probability of scoring from there, plus the probability of moving the ball times the sum, over every zone it can move to, of the move probability times that zone's xT. The values are found by iteration from zero; after n iterations a zone's xT is the probability of scoring within the next n actions. An action that moves the ball from one zone to another is worth the end zone's xT minus the start zone's.

- **Formula:** xT(x,y) = s(x,y) * g(x,y) + m(x,y) * sum over zones (z,w) of T((x,y) -> (z,w)) * xT(z,w); action value = xT(end zone) - xT(start zone)
- **Zone:** Whole pitch, divided into a 16 x 12 grid (192 zones); the post says another resolution can be used.
- **Passes counted:** Successful moves only (passes and dribbles completed without losing possession), from the 2017/18 Premier League season. Iterated 4 to 5 times.
- **Source:** Introducing Expected Threat (xT) (Karun Singh, 2019 (undated page; archived 2019-02-22)): https://karun.in/blog/expected-threat.html
- **Quote** (matches the source word for word, 2026-10-04): "for the purposes of this post, we're working with a 16x12 grid on the pitch, which gives us 192 zones."
- **Reference code:** none yet.
- s is the shot probability, g the goal probability given a shot, m the move probability (s + m = 1) and T the matrix of move transitions between zones.
- The post does not name its data provider, and the fitted 16 x 12 surface is not published, so this variant has no reference code.

## xt.singh-open-12x8: Singh's published 12 x 8 surface

A ready-made xT surface that Singh published as a JSON file: 8 rows across the pitch and 12 columns along it, from about 0.0064 near the own goal to about 0.2575 in front of the opponent's goal. Actions are valued with it the way socceraction's ExpectedThreat.rate does: successful passes, crosses and dribbles (carries) only, end zone value minus start zone value.

- **Formula:** action value = surface[end zone] - surface[start zone]; team total = sum over the team's successful passes, crosses and carries
- **Zone:** Whole pitch, 12 x 8 grid.
- **Passes counted:** Successful moves only. Set-piece passes (free kicks, corners, throw-ins, goal kicks) are not valued; a kick-off is an ordinary pass.
- **Source:** socceraction xthreat.py, load_model (v1.5.3) (KU Leuven DTAI): https://raw.githubusercontent.com/ML-KULeuven/socceraction/3ca3ce0b0163352b84a0f7665c647fb4f3f9c3ad/socceraction/xthreat.py
- **Quote** (matches the source word for word, 2026-10-04): "Karun Singh provides such a grid at the follwing url"
- **Quote check note:** The quote keeps the source's spelling ('follwing'). The surface itself is https://karun.in/blog/data/open_xt_12x8_v1.json.
- **Reference code (approximation):** `football_metrics.xt:xt_singh_open_surface` on statsbomb-open-data. Singh's surface applied to StatsBomb events, choosing actions as socceraction's StatsBomb converter and ExpectedThreat.rate do: a Pass with no outcome and a pass.type other than Free Kick, Corner, Throw-in or Goal Kick, or a Carry (socceraction's dribble). Zones: column = int(x / 120 * 12), row = int(y / 80 * 8), clipped. socceraction also inserts synthetic dribbles between consecutive actions of the same team (3 to 60 units apart, under 10 seconds); StatsBomb's Carry events stand for those here.
- **Test value:** Argentina, Argentina v France, World Cup 2022 final (match 3869685): 1.8631
- **Test value:** France, Argentina v France, World Cup 2022 final (match 3869685): 1.1759
- Which data and how many iterations produced the published surface is not stated.
- The surface is symmetric top to bottom, so the orientation of the y axis does not change values.
- socceraction's load_model reads this file; its documentation points to the URL.

## xt.socceraction: socceraction (KU Leuven), fitted

socceraction fits the surface itself from SPADL actions. Move actions are passes, dribbles and crosses; take-ons are left out. The shot probability uses open-play shots only (SPADL type shot, not free-kick or penalty shots). The move probability counts every move attempt, and the transition matrix divides successful moves by all attempts, so failed moves act as lost possession. Iteration stops when no zone changes by more than a small tolerance.

- **Formula:** as xt.singh-2019, with T = successful moves / all move attempts from each zone; iterate until the largest change is below eps
- **Zone:** Whole pitch; default grid 16 x 12.
- **Passes counted:** Fitting uses all move attempts; rating values successful moves only.
- **Source:** socceraction xthreat.py, get_move_actions (v1.5.3) (KU Leuven DTAI): https://raw.githubusercontent.com/ML-KULeuven/socceraction/3ca3ce0b0163352b84a0f7665c647fb4f3f9c3ad/socceraction/xthreat.py
- **Quote** (matches the source apart from case, spacing, quote marks or hyphens, 2026-10-04): "These include passes, dribbles and crosses. Take-ons are ignored because they typically coincide with dribbles and do not move the ball to a different cell."
- **Reference code:** none yet.
- Defaults in socceraction v1.5.3: l = 16, w = 12, eps = 1e-5; optional bilinear interpolation.
- No reference code here yet: a fit needs many matches of training data.
- The socceraction README says the package is no longer actively developed; pin the version.

## xt.databallpy: DataBallPy

DataBallPy's xT model follows Singh's method on a finer grid of 32 x 24 cells, interpolated to a smoother surface. Before fitting it deletes own goals, shots from the own half (which it treats as data errors) and events in set-piece situations (corners, free kicks, throw-ins, goal kicks).

- **Formula:** as xt.singh-2019, on a 32 x 24 grid
- **Zone:** Whole pitch, 32 x 24 grid.
- **Source:** Expected Threat (xT) models (DataBallPy): https://databallpy.readthedocs.io/en/main/features/xt_models.html
- **Quote** (matches the source word for word, 2026-10-04): "closely based on the work and blog of Karun Singh"
- **Reference code:** none yet.
- No reference code here; DataBallPy ships its own fitted model.

## Caveats

- The grid size, the training data, the number of iterations and which shots feed the goal probability are free choices; different packages give different numbers for the same action. Cite the variant and the surface.
- xT values only ball-progressing actions. Defensive actions, take-ons and moves inside one zone are worth zero.
- It values the attacking side only, and ignores what happens after a turnover.
- The state is the ball's zone alone: no players, no pressure, no game state, and one surface for a whole league unless it is fitted per team.
- Shots are not valued as actions, so player xT totals favour creators over finishers.
- Singh's post values successful moves; socceraction counts failed moves in the move probability, so failed moves act as lost possession in the fit.

## Related cards

`vaep`, `progressive_passes`, `progressive_carries`
