# VAEP and Expected Threat (xT)

Action valuation models from the DTAI Sports Analytics Lab, implemented in the socceraction library.

## Expected Threat (xT)

Measures how much a ball movement increases the probability of scoring.

### How it works

1. Divide the pitch into an M x N grid (default: 16 x 12 = 192 zones)
2. For each zone, calculate the probability of scoring from that location
3. Use a Markov decision process to learn zone values that account for both direct shots and passes to higher-value zones
4. xT of an action = xT(destination zone) - xT(origin zone)

### Key properties

- Only meaningful for ball-progressing actions that maintain possession (passes, carries)
- Not applicable to shots (use xG instead), tackles, or interceptions
- Zone values range from ~0.01 (own half) to ~0.15 (penalty area edge)
- Requires ~50,000+ possessions for stable estimates

### Usage

```python
from socceraction.xthreat import ExpectedThreat

xt = ExpectedThreat(l=16, w=12)
xt.fit(actions)  # Train on SPADL actions
xt_values = xt.rate(actions)  # Rate each action
```

### Comparison with other models

| Model | Inputs | Values | Strengths |
|-------|--------|--------|-----------|
| xT | Zone-based (grid) | Ball movements only | Simple, interpretable, fast to compute |
| VAEP | Action sequence features | All on-ball actions | More accurate, handles context |
| xG | Shot location + context | Shots only | Standard for chance quality |

## VAEP (Valuing Actions by Estimating Probabilities)

Values every on-ball action by how it changes the probability of scoring minus conceding.

### How it works

1. Define game state as the last 3 actions: S_i = {a_{i-2}, a_{i-1}, a_i}
2. Train two gradient-boosted tree classifiers:
   - P_scores(S_i): probability of scoring within the next 10 actions
   - P_concedes(S_i): probability of conceding within the next 10 actions
3. Value of action a_i:
   - Offensive value = P_scores(S_i) - P_scores(S_{i-1})
   - Defensive value = P_concedes(S_{i-1}) - P_concedes(S_i)
   - Total VAEP = offensive + defensive

### Features

The default feature set (`xfns_default`) produces 568 columns for the default 3-action
game state (188 columns if `nb_prev_actions=1`) — largely driven by the action-type
one-hot encoding alone contributing 23 columns per action in the state:

| Feature group | Examples |
|--------------|---------|
| Action type | One-hot encoded action type |
| Result | One-hot encoded result |
| Body part | foot, head, other, head/other, foot_left, foot_right |
| Location | start_x, start_y, end_x, end_y |
| Polar coordinates | Distance and angle to goal from start/end |
| Movement | dx, dy between start and end |
| Tempo | Time between consecutive actions |
| Context | Period, time remaining, score differential |

### Usage

```python
from socceraction.vaep import VAEP

vaep = VAEP()

# fit() takes precomputed feature/label matrices (X, y), not raw SPADL actions.
# Build them per game with compute_features()/compute_labels(), then concatenate
# across games before fitting.
X = pd.concat([vaep.compute_features(game, game_actions) for game, game_actions in games_actions])
y = pd.concat([vaep.compute_labels(game, game_actions) for game, game_actions in games_actions])
vaep.fit(X, y)

# rate() operates on a single game (a pd.Series) plus that game's actions
values = vaep.rate(game, game_actions)

# Decompose into offensive and defensive contributions
values[["offensive_value", "defensive_value"]].head()
```

### Practical notes

- Requires substantial training data (multiple seasons recommended)
- Training takes minutes, not hours
- Feature engineering is the most important step
- Results are relative to the training data distribution
- Per-90 aggregation is standard for player comparisons
- Minimum ~900 minutes before player ratings are meaningful

## Atomic-VAEP

VAEP applied to Atomic-SPADL actions. The key difference:

- Standard VAEP: a pass is one action credited to the passer
- Atomic-VAEP: a pass is split into "pass" (passer) + "receival" (receiver)
- Enables separate credit for passers and receivers
- Better for evaluating off-ball positioning and movement

### Usage

```python
from socceraction.atomic.vaep import AtomicVAEP

avaep = AtomicVAEP()

# AtomicVAEP inherits fit()/rate() from VAEP unchanged: fit() takes precomputed
# feature/label matrices (built per game and concatenated), and rate() operates
# on a single game plus that game's atomic actions.
X = pd.concat([avaep.compute_features(game, game_actions) for game, game_actions in games_actions])
y = pd.concat([avaep.compute_labels(game, game_actions) for game, game_actions in games_actions])
avaep.fit(X, y)

values = avaep.rate(game, game_actions)
```

## Key academic reference

Decroos et al. (2019). "Actions Speak Louder than Goals: Valuing Player Actions in Soccer." KDD 2019.
