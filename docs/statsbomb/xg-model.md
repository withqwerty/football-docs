# StatsBomb xG Model

StatsBomb's expected goals (xG) model is one of the most sophisticated publicly discussed xG implementations. The value is provided as `statsbomb_xg` on every shot event.

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

StatsBomb's xG model incorporates significantly more features than basic distance-and-angle models. Based on their published methodology and research:

### 1. Shot Location
- Distance to goal centre
- Angle to goal (visible goal width from the shooter's position)
- Position on the pitch (x, y coordinates)

### 2. Shot Type and Technique
- Body part: right foot, left foot, head, other
- Technique: normal, volley, half-volley, lob, overhead kick, diving header, backheel
- First-time shot vs controlled shot

### 3. Shot Context
- Open play, free kick, corner, penalty, kick-off
- Following a dribble
- One-on-one situation
- Open goal (goalkeeper out of position)

### 4. Freeze Frame Data (Unique to StatsBomb)
This is the most significant differentiator. StatsBomb's model uses the positions of all visible players at the moment of the shot:

- **Goalkeeper position**: Where the keeper is relative to the goal line and the shot trajectory. A keeper off their line or out of position significantly affects xG.
- **Defender positions**: Number of defenders between the shooter and the goal, and their ability to block the shot.
- **Defender pressure**: Whether defenders are close enough to affect the shot quality.
- **Shot angle obstruction**: Whether defenders narrow the effective shooting angle.
- **Body orientation**: Inferred from player positions and movement direction.

### 5. Preceding Events
- Whether the shot followed a cross, through ball, or cut-back
- Quality and type of the assist pass (key pass)
- Whether the possession involved a counter-attack or set piece build-up

---

## What Makes StatsBomb xG Different

### Freeze Frame Integration
Most xG models (including early public models from sources like Understat or FBref/Opta) use only shot location, angle, body part, and game state. StatsBomb's model is fundamentally different because it incorporates the defensive setup via freeze frame data.

This means two shots from the same location can have very different xG values depending on:
- How many defenders are blocking the path to goal
- Whether the goalkeeper is well-positioned
- Whether the shooter is under pressure
- Whether there is an open passing option (making defenders hesitate)

### Example Impact

A shot from 20 yards with:
- Clear path to goal, keeper off line: ~0.08 xG
- Two defenders blocking, keeper set: ~0.02 xG

Same location, 4x difference based on defensive context.

### Penalty xG

StatsBomb assigns a fixed xG value to penalties. Based on their data, penalties convert at approximately 76-77%, so penalty xG is typically around **0.76**.

### Header xG

Headers generally receive lower xG than foot shots from the same location, reflecting the lower conversion rate of headed shots. The model accounts for header difficulty separately from foot shots.

---

## Model Updates

StatsBomb periodically updates their xG model as they collect more data and refine their methodology. The model version is not explicitly stated in the data, but improvements are reflected in updated `statsbomb_xg` values for historical matches when data is reprocessed.

Key known iterations:
- **Original model**: Location-based with basic features
- **Freeze frame model**: Incorporated goalkeeper and defender positions from shot freeze frames
- **360 enhanced**: Further refined using 360 data for more comprehensive spatial context

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

| Feature | StatsBomb | Opta | Understat | FBref (basic) |
|---------|-----------|------|-----------|---------------|
| Shot location | Yes | Yes | Yes | Yes |
| Body part | Yes | Yes | Yes | Yes |
| Shot type/technique | Yes | Yes | Partial | Partial |
| Game state | Yes | Yes | Yes | No |
| Freeze frame (GK position) | Yes | No | No | No |
| Freeze frame (defenders) | Yes | No | No | No |
| Preceding event context | Yes | Partial | No | No |
| Publicly available values | Open data only | Licensed | Free (web) | Free (web, Opta-sourced) |

StatsBomb's use of freeze frame data is the primary methodological advantage. Academic research has consistently shown that goalkeeper position and defender locations are among the most predictive features for shot conversion probability.

---

## xG Limitations

Even StatsBomb's model has inherent limitations:

1. **Shooter skill not modelled**: The model does not know who is taking the shot. Messi and a League Two striker get the same xG from the same position with the same setup.
2. **Shot placement not predicted**: xG estimates the probability before the shot is struck. Where the ball actually goes (top corner vs straight at the keeper) is not an input.
3. **Sample size**: Rare situations (e.g., scorpion kicks, shots from the halfway line) have limited training data.
4. **Freeze frame coverage**: Only players visible to the broadcast camera are captured. Players outside the visible area are not in the freeze frame.
5. **Dynamic context**: The freeze frame is a snapshot. It does not capture player momentum, acceleration, or the shooter's body shape at the moment of striking the ball.

---

## Post-Shot xG (xGOT)

StatsBomb also provides post-shot expected goals (xGOT / expected goals on target) for shots that are on target. This considers where the shot was placed relative to the goal frame. xGOT is available in the commercial API and some derived datasets but is not a standard field in the open data event JSON.
