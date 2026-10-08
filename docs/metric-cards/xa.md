---
source_type: curated
source_url: https://theanalyst.com/articles/what-are-expected-assists-xa
upstream_version: metric card v1
crawled_at: 2026-10-04
---

# xA (expected assists, pass-level model)

Metric card `xa`, version 1, updated 2026-10-04. Look it up exactly with `get_metric("xa")`, or one variant with its ID.

Opta / Stats Perform's expected assists (xA) is a pass-level model: every completed pass gets the probability that it becomes a goal assist, from the type of pass, the pattern of play, where the pass starts and ends, and its distance. A pass earns xA even if the receiver never shoots. This card is ONLY that pass-level metric. The same name, xA, is also used for the xG of the shot that a pass led to (Understat, Wyscout, American Soccer Analysis, and FBref before October 2022); that shot-linked metric is card `xg_assisted`, and the two are not comparable. Opta's model is closed and StatsBomb open data has no xA field, so this card has no reference code.

- **Measures:** How likely a player's or team's completed passes were to become goal assists, judged from the pass itself, whether or not a shot followed.
- **Direction:** Higher values mean the passes were more likely to become assists. Comparing xA with actual assists shows over- or under-performance.
- **Unit:** expected assists: a probability from 0 to 1 per completed pass, summed over passes
- **Data:** event data
- **Also called:** expected assists, Opta xA, Stats Perform xA, pass xA

## Origin

Stats Perform (Opta). The earliest public description found is The Analyst's article 'What Are Expected Assists (xA)?' by Jonny Whitmore, 24 March 2021, which presents Stats Perform's xA model. Whether Opta used a pass-level xA before that date is not known. The name xA was already in use for the shot-linked metric (card xg_assisted) by 2018.

Source: https://theanalyst.com/articles/what-are-expected-assists-xa

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `xa.opta` | Whole pitch. | none yet |
| `xa.fbref` | Whole pitch. | none yet |

## xa.opta: Opta / Stats Perform

For every completed pass, the probability that it becomes a goal assist, from a logistic regression built on hundreds of thousands of passes from historical Opta data. A player's or team's xA is the sum over its completed passes.

- **Formula:** xA(pass) = P(the completed pass becomes a goal assist | type of pass, pattern of play, location where the pass is received, location where the pass is made from, distance of the pass); xA(player) = sum of xA over the player's completed passes
- **Zone:** Whole pitch.
- **Passes counted:** Every completed pass in Stats Perform's event data, whether or not a shot follows.
- **Source:** What Are Expected Assists (xA)? (Jonny Whitmore (The Analyst, Stats Perform), 2021-03-24): https://theanalyst.com/articles/what-are-expected-assists-xa
- **Quote** (matches the source word for word, 2026-10-04): "Stats Perform’s expected assists (xA) model measures the likelihood that a given pass will become a goal assist. The model rewards players who pass into dangerous areas, regardless of whether the receiver takes a shot or not."
- **Reference code:** none yet.
- The inputs named as the most important: type of pass (for example cross, non-cross, header, through ball), pattern of play (for example open play, corner, free kick, throw-in), location where the pass is received, location where the pass is made from, and distance of the pass.
- Pattern of play and type of pass matter most, so the model has sub-models for the interactions between them.
- The scale runs from 0 (a pass that will never become an assist) to 1 (a pass the receiver would score from every time).
- Example in the article: in the 2019-20 Premier League, Trent Alexander-Arnold had 7.1 open-play xA and Andy Robertson 4.9, but Robertson made more open-play assists (10 against 6).
- Opta Analyst's stats definitions page gives the shorter form: xA for a completed pass from the type of pass, end-point and length of pass.
- No reference code: the model is closed and StatsBomb open data has no xA field.

## xa.fbref: FBref xA (Opta values), historical

Opta's xA as published on FBref from October 2022: the likelihood that a completed pass becomes a goal assist, from the type of pass, its location on the pitch, the phase of play and the distance covered.

- **Formula:** as xa.opta (FBref showed Opta's values)
- **Zone:** Whole pitch.
- **Passes counted:** Every completed pass, whether or not a shot followed.
- **Source:** Expected Goals Model Explained (FBref (Sports Reference)): https://web.archive.org/web/20251031052137/https://fbref.com/en/expected-goals-model-explained/
- **Quote** (matches the source word for word, 2026-10-04): "Players receive xA for every completed pass regardless of whether a shot occurred or not."
- **Reference code:** none yet.
- Before October 2022 FBref used the label xA for the shot-linked metric (card xg_assisted). When it switched its data provider to Opta it renamed that metric xAG and used xA for Opta's pass-level values.
- Historical: FBref removed its Opta advanced data on 20 January 2026 (Sports Reference blog), so these values are no longer published there. The source is a Wayback Machine snapshot.
- No reference code: the values come from Opta's closed model.

## Caveats

- This is not card xg_assisted. Many sites label the shot-linked metric (the xG of the shot after a pass) xA. Check which one a number is before you compare it.
- xA is a closed model output: Opta names the inputs but not the weights, so nobody else can reproduce the values.
- Only completed passes get xA. A failed pass into a dangerous area earns nothing.
- The public description lists only the most important inputs, so the full feature set is not known.
- Passes into dangerous areas earn xA even when nobody shoots, so xA and xG assisted can rank the same players differently.

## Related cards

`xg_assisted`, `xg`, `npxg`, `key_passes` (no card yet)
