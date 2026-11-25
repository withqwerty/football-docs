---
source_url: https://www.hudl.com/blog/upgrading-expected-goals
source_type: curated
---

# StatsBomb xG Model

StatsBomb provides its expected goals (xG) value as `statsbomb_xg` on the shot object. The Open Data Events v4.0.0 spec describes it as "The StatsBomb expected goals value calculated for the shot."

---

## Where xG Appears in the Data

```json
{
  "type": { "id": 16, "name": "Shot" },
  "shot": {
    "statsbomb_xg": 0.024542088,
    "end_location": [117.3, 38.3, 0.8],
    "technique": { "id": 93, "name": "Normal" },
    "body_part": { "id": 40, "name": "Right Foot" },
    "type": { "id": 87, "name": "Open Play" },
    "outcome": { "id": 100, "name": "Saved" },
    "freeze_frame": [ ... ]
  }
}
```

The `statsbomb_xg` field is a float between 0.0 and 1.0 representing the probability that the shot results in a goal, given the circumstances of the shot.

---

## Model Inputs

Hudl's public posts name these inputs. They do not publish a full feature list.

### Traditional inputs
Hudl's xG explainer (<https://www.hudl.com/blog/expected-goals-xg-explained>) says the main factors that have traditionally been fed into the large majority of xG models are distance to goal, angle to goal, body part, and type of assist or previous action (throughball, cross, set-piece, dribble, etc.).

### What Hudl Statsbomb adds
The same explainer says Hudl Statsbomb xG adds goalkeeper position and status, the position of all attackers and defenders in frame, and shot impact height.

### Freeze frame features
Hudl's "Upgrading Expected Goals" post (May 2022) says the existing xG uses the location of off-ball players in freeze frames at the time of the shot:

- the number of blockers in the triangle between the shot-taker and goalposts
- the proportion of the goalface blocked by the defenders
- whether there is any player between the goal and the shot-taker (the open-goal feature)

The 2022 upgrade replaced these discrete features with continuous ones, by representing defenders as 2D Gaussian surfaces instead of fixed-radius circles.

### Shot and pass height
StatsBomb's Shot Impact Height post (July 2020, <https://blogarchive.statsbomb.com/news/statsbomb-release-expected-goals-with-shot-impact-height/>) says pass height (whether a pass was on the ground or not) was already an xG input, and adds Shot Impact Height: the height (z coordinate) of the ball when a shot is struck.

---

## What Makes StatsBomb xG Different

### Freeze Frame Integration
StatsBomb says it has added the location of goalkeeper and defenders around a shot, on every shot, since its data debuted in 2018. This means two shots from the same location can have different xG values depending on where the goalkeeper and defenders are.

### Example Impact

The Shot Impact Height post gives a goalkeeper-position example: a shot valued at 0.48 xG without goalkeeper position is 0.82 with Hudl Statsbomb xG. The post says goalkeeper position has nominal value for most shots, but a large effect when the goalkeeper is far out of position.

### Penalty xG

Hudl's xG explainer says the large majority of models assign penalties a static value of 0.76 xG, reflecting the historical conversion rate, and that the 2022 update of the Hudl Statsbomb xG model changes this static value to **0.78** xG.

### Header xG

Hudl's xG explainer says that, from the same distance, foot shots are more likely to result in goals than headed shots.

---

## Model Updates

StatsBomb has published these changes to its xG model:

- **2018**: goalkeeper and defender locations around every shot were part of the model from the start.
- **2020 (Shot Impact Height)**: freeze frames around shots collected by computer vision, and Shot Impact Height added as a feature.
- **2022 ("Upgrading Expected Goals")**: continuous blocker and goalkeeper features, monotonic constraints (the models are Gradient Boosted Trees), shot velocity in the post-shot xG model, and a split between chance quality and shot execution. Hudl said these upgrades would cover all historic data and everything collected going forwards.

---

## Using xG in Analysis

### Per-Shot xG
The `statsbomb_xg` value on each shot event is the probability of scoring that specific chance.

### Match xG
Sum all `statsbomb_xg` values for a team's shots in a match to get the team's total expected goals.

```python
import json

with open("events/3869685.json") as f:
    events = json.load(f)

for team in ["Argentina", "France"]:
    shots = [e for e in events if e["type"]["name"] == "Shot" and e["team"]["name"] == team]
    total_xg = sum(s["shot"]["statsbomb_xg"] for s in shots)
    goals = sum(1 for s in shots if s["shot"]["outcome"]["name"] == "Goal")
    print(f"{team}: {len(shots)} shots, {total_xg:.2f} xG, {goals} goals")
```

### xG Overperformance
Compare actual goals to xG to measure finishing quality or luck:
- Goals - xG > 0: overperforming (clinical finishing or good fortune)
- Goals - xG < 0: underperforming (poor finishing or bad luck)

### Non-Penalty xG (npxG)
Filter out penalties to isolate open-play shot quality:

```python
npxg = sum(
    s["shot"]["statsbomb_xg"]
    for s in shots
    if s["shot"]["type"]["name"] != "Penalty"
)
```

---

## Comparison with Other xG Models

Hudl's xG explainer says not all xG models take into account the same factors. Its example: a standard model with only distance, angle, body part, and type of assist might value a shot at 0.30 xG, while a model that knows the goalkeeper was out of position might give the same chance 0.65 xG. Hudl does not publish a feature-by-feature comparison with other providers.

---

## xG Limitations

Even StatsBomb's model has inherent limitations:

1. **Shooter skill not modelled**: The model does not know who is taking the shot. Messi and a League Two striker get the same xG from the same position with the same setup.
2. **Shot placement not predicted**: xG estimates the probability before the shot is struck. Where the ball actually goes (top corner vs straight at the keeper) is not an input.
3. **Sample size**: Rare situations (e.g., scorpion kicks, shots from the halfway line) have limited training data.
4. **Freeze frame coverage**: Only players visible to the broadcast camera are captured. Players outside the visible area are not in the freeze frame.
5. **Dynamic context**: The freeze frame is a snapshot. It does not capture player momentum, acceleration, or the shooter's body shape at the moment of striking the ball.

---

## xG decomposition

Hudl's "Upgrading Expected Goals" post says every shot includes several xG-related outputs:

| Output | Meaning (from the post) |
|---|---|
| Chance quality (xG) | How dangerous a shooting opportunity is, considering the location of the goalkeeper and defenders. |
| Shot execution | Post-shot xG from the shot-taker's perspective: chance quality features plus shot placement and velocity. |
| Save difficulty | Post-shot xG from the keeper's perspective. |
| Shot execution xG suppression | Listed as an output; the post does not define it further. |
| GK positioning xG suppression | The difference between models with and without goalkeeper position: how much higher or lower the xG is because of the goalkeeper's position, compared with the average position for that situation. |
| GK shot-stopping xG suppression | Listed as an output; the post says decoupling positioning lets StatsBomb value it separately from shot-stopping ability. |
| Shot placement xG maps | Goal probability if the shot was placed anywhere along the goal face. |
| GK positioning xG maps | Positioning value if the goalkeeper had stood in different areas of the penalty box. |

The post gives the output names, not JSON field names. The public Open Data Events v4.0.0 spec lists only `statsbomb_xg` on the shot object. Aggregated goalkeeping metrics are covered in `iq-metrics-glossary.md` and the `player-*-stats.md` catalogues.

## Post-Shot xG (PSxG / xGOT)

Hudl's xG explainer says post-shot xG is calculated after a shot has been taken, generally considers shot placement (and goalkeeper positioning if the model includes it), and assigns a value between 0 (off-target) and 1 to every shot. Its primary use has been assessing goalkeeper shot-stopping. Hudl Statsbomb's post-shot xG model includes shot velocity. Post-shot xG is not a field in the public Open Data Events v4.0.0 spec, which lists only `statsbomb_xg` on the shot object.
