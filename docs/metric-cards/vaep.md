---
source_type: curated
source_url: 1802.07127
upstream_version: metric card v1
crawled_at: 2026-10-05
---

# VAEP (valuing actions by estimating probabilities)

Metric card `vaep`, version 1, updated 2026-10-05. Look it up exactly with `get_metric("vaep")`, or one variant with its ID.

VAEP values every on-the-ball action by how it changes two probabilities: that the team in possession scores within the next few actions, and that it concedes within them. Two classifiers estimate those probabilities from the last three actions; an action's value is its change in scoring probability minus its change in conceding probability. Tom Decroos, Lotte Bransen, Jan Van Haaren and Jesse Davis introduced it (KDD 2019, arXiv 1802.07127). Values depend on the trained model, so there are no fixed test values: this card has no reference code, and numbers from different models are not comparable.

- **Measures:** How much an on-the-ball action changes its team's chance of scoring soon minus its chance of conceding soon.
- **Direction:** Higher means the action helped its team more. Values can be negative.
- **Unit:** change in probability (an action's value is a difference of probability changes)
- **Data:** event data
- **Also called:** valuing actions by estimating probabilities, atomic-vaep, atomic vaep

## Origin

Tom Decroos, Lotte Bransen, Jan Van Haaren and Jesse Davis (KU Leuven and SciSports), 'Actions Speak Louder than Goals: Valuing Player Actions in Soccer', KDD 2019 (DOI 10.1145/3292500.3330758); first posted on arXiv in February 2018 (1802.07127).

Source: 1802.07127

## Variants

| Variant | Zone | Reference code |
|---|---|---|
| `vaep.decroos-2019` | Whole pitch. | none yet |
| `vaep.socceraction` | Whole pitch. | none yet |
| `vaep.atomic` | Whole pitch. | none yet |

## vaep.decroos-2019: Decroos et al. (2019), the paper

Actions are in SPADL. A game state is approximated by the previous three actions. A state gets a positive scoring label if the team in possession after the action scores within the next k actions, and a positive conceding label if it concedes within them, with k = 10. Two classifiers estimate the probabilities of scoring and of conceding; an action's value is the change in the scoring probability minus the change in the conceding probability that it causes. The offensive value is the scoring change and the defensive value is minus the conceding change.

- **Formula:** V(a_i) = [P_score(S_i) - P_score(S_i-1)] - [P_concede(S_i) - P_concede(S_i-1)], with S_i approximated by the actions a_i-2, a_i-1, a_i and labels looking k = 10 actions ahead
- **Zone:** Whole pitch.
- **Passes counted:** On-the-ball actions only.
- **Source:** Actions Speak Louder than Goals: Valuing Player Actions in Soccer (Tom Decroos, Lotte Bransen, Jan Van Haaren, Jesse Davis, 2019 (KDD); arXiv first version 2018): 1802.07127
- **Quote** (matches the source word for word, 2026-10-04): "In this paper, we chose k=10 based on domain knowledge and preliminary experiments."
- **Reference code:** none yet.
- The paper uses Wyscout data: 11565 league games from 2012/13 to 2017/18 in the English, Spanish, German, Italian, French, Dutch and Belgian top divisions. One model is trained on 2012/13 to 2015/16 to value 2016/17, and a second on 2012/13 to 2016/17 to value 2017/18.
- Features: the SPADL attributes of the three actions, plus derived features such as distance and angle to goal and time between actions, and game context such as the score.
- The paper compares four learners on Brier score and ROC AUC: CatBoost (default parameters) is best for both probabilities, and XGBoost is a close second. Logistic regression and random forest do worse.
- In the paper's data, 1.5% of game states lead to a scored goal and 0.5% to a conceded goal within the label window.
- The paper reads a value as goals: an action valued at +0.05 is expected to add 0.05 goals for the acting team.
- No reference code: the values need a trained model, and the paper's models and data are not public.

## vaep.socceraction: socceraction (KU Leuven), the reference implementation

socceraction implements the paper's labels (10 actions ahead) and three-action state, with XGBoost as the default learner (CatBoost and LightGBM optional). Its formula adds rules the paper does not describe: the previous scoring probability is set to 0 when the previous action was more than 10 seconds earlier or was a scored shot; a penalty starts from a fixed scoring probability of 0.792453; a corner (crossed or short) starts from 0.0465. When possession changes between two actions, the previous action's conceding probability stands in for the previous scoring probability.

- **Formula:** as vaep.decroos-2019, with previous probability reset to 0 after a gap of more than 10 seconds or a scored shot, and fixed priors of 0.792453 for penalties and 0.0465 for corners
- **Zone:** Whole pitch.
- **Source:** socceraction vaep/formula.py (v1.5.3) (KU Leuven DTAI): https://raw.githubusercontent.com/ML-KULeuven/socceraction/3ca3ce0b0163352b84a0f7665c647fb4f3f9c3ad/socceraction/vaep/formula.py
- **Quote** (matches the source word for word, 2026-10-04): "if the previous action was too long ago, the odds of scoring are now 0"
- **Reference code:** none yet.
- Constants and defaults read from socceraction v1.5.3 (commit 3ca3ce0b): _samephase_nb = 10, nr_actions = 10, nb_prev_actions = 3, learner = 'xgboost'.
- socceraction's public notebooks (1 to 4) use a smaller set-up than these defaults: StatsBomb open data for the 2018 World Cup (64 matches), features of the current action only (nb_prev_actions = 1), XGBoost with 50 trees of depth 3, and the same games for training and evaluation. Values from the notebooks are not comparable with values from the VAEP class defaults.
- The socceraction README says the package is no longer actively developed.
- No reference code here: values need a trained model.

## vaep.atomic: Atomic-VAEP

VAEP on Atomic-SPADL, a version of SPADL in which every action always completes: the result attribute is gone, a pass becomes a pass followed by a receival, and new action types such as interception and out mark what happened next. Shots, free kicks and corners are split into a start and a completion.

- **Formula:** as vaep.decroos-2019, on Atomic-SPADL actions
- **Zone:** Whole pitch.
- **Source:** Introducing Atomic-SPADL: A New Way to Represent Event Stream Data (KU Leuven DTAI sports): https://dtai.cs.kuleuven.be/sports/blog/introducing-atomic-spadl:-a-new-way-to-represent-event-stream-data/
- **Quote** (matches the source word for word, 2026-10-04): "all actions are “atomic” in the sense that they are always completed successfully without interruption."
- **Reference code:** none yet.
- Introduced on the KU Leuven DTAI sports blog in 2020; no separate paper was found.
- socceraction's atomic formula resets after goals and own goals, but has no time-gap reset and no penalty or corner constants.
- No reference code here: values need a trained model.

## Caveats

- Values depend on the trained probability models: the training data, the learner and the features. Compare values only within one model, and cite it.
- VAEP values on-the-ball actions only; defending by positioning is not valued (the paper names this as a limitation).
- The labels look a fixed number of actions ahead (k = 10), not a time window. A turnover followed by a goal within that window counts as a concede for the team that lost the ball.
- Ratings from the original version are less stable across data splits than xT's and are driven by shots and goals; Atomic-VAEP was introduced partly to reduce this.
- Game-context features such as the score can carry team strength into the values.
- socceraction's code adds rules and constants the paper does not describe (see vaep.socceraction); pin the version.
- No ground truth for action values exists, so a model cannot be shown to be right, only better calibrated.

## Related cards

`xt`, `xg`
