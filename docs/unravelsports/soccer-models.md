---
source_url: https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html
source_type: crawled
upstream_version: 1.2.1
crawled_at: 2026-07-31T18:45:15.624Z
---
Soccer-specific analytical models.

_`class`_ `unravel.soccer.``PressingIntensity`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/models/pressing_intensity.html#PressingIntensity)

Bases: [`` `object` ``](https://docs.python.org/3/library/functions.html#object "(in Python v3.14)")

Compute pressing intensity metrics for soccer tracking data.

Pressing Intensity quantifies the defensive pressure applied to ball carriers by measuring spatial coverage, defender proximity, and velocity components. The metric computes time-to-intercept and probability-to-intercept matrices between players, capturing how effectively defenders can close down passing options.

The model outputs two matrices per frame: - **Time-to-Intercept (TTI)**: Time in seconds for each defender to reach each

> attacker, accounting for positions, velocities, and reaction time.

-   **Probability-to-Intercept (PTI)**: Probability (0-1) that a defender can successfully press each attacker, derived from TTI using a sigmoid function.
    

These matrices enable analysis of: - Defensive compactness and coverage - Pressing triggers and coordination - Passing lane availability - Individual pressing effectiveness

The implementation is based on tracking data research and extends concepts from pitch control and space occupation models.

Parameters:

-   **dataset** ([`` `KloppyPolarsDataset` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.KloppyPolarsDataset")) – Dataset containing soccer tracking data with positions, velocities, and ball ownership information.
    
-   **chunk_size** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Number of frames to process in each batch for memory efficiency. Defaults to 20000.
    

`output`

Computed pressing intensity matrices with columns: - frame_id, period_id, timestamp: Frame identifiers - time_to_intercept: List\[List\[float\]\] - TTI matrix (rows × columns) - probability_to_intercept: List\[List\[float\]\] - PTI matrix (rows × columns) - columns: List\[str\] - Object IDs for column players (typically attackers) - rows: List\[str\] - Object IDs for row players (typically defenders)

Type:

`` `pl.DataFrame` ``

Raises:

[**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If dataset is not of type KloppyPolarsDataset.

Example

```
>>> from unravel.soccer.dataset import KloppyPolarsDataset
>>> from unravel.soccer.models import PressingIntensity
>>> from kloppy import datasets
>>>
>>> # Load tracking data
>>> dataset = datasets.load(
...     provider="skillcorner",
...     match_id="123",
...     competition="EPL"
... )
>>> soccer_data = KloppyPolarsDataset(kloppy_dataset=dataset)
>>>
>>> # Initialize pressing intensity model
>>> pi = PressingIntensity(dataset=soccer_data)
>>>
>>> # Compute pressing intensity for all frames
>>> pi.fit(
...     method="teams",           # 11x11 matrix (attackers × defenders)
...     ball_method="max",        # Merge ball and ball carrier
...     reaction_time=0.7,        # 0.7 second defender reaction time
...     time_threshold=1.5,       # 1.5 second pressing window
...     sigma=0.45                # Sigmoid steepness parameter
... )
>>>
>>> # Access results
>>> print(pi.output)
>>> # Shows time_to_intercept and probability_to_intercept matrices per frame
>>>
>>> # Compute pressing intensity for specific period
>>> pi.fit(
...     start_time=pl.duration(minutes=0),
...     end_time=pl.duration(minutes=5),
...     period_id=1,
...     method="teams"
... )
```

Note

-   The model requires velocity data. Ensure your dataset has computed velocities via [`` `KloppyPolarsDataset.load()` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset.load "unravel.soccer.KloppyPolarsDataset.load") with appropriate smoothing parameters.
    
-   Time-to-intercept assumes defenders accelerate optimally toward attackers from their current positions, bounded by max_player_speed.
    
-   Probability values near 1.0 indicate high pressing pressure; values near 0.0 indicate low pressure or distant defenders.
    

See also

`` `KloppyPolarsDataset` ``: Data loading and preprocessing. [`` `fit()` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.PressingIntensity.fit "unravel.soccer.PressingIntensity.fit"): Configure and compute pressing intensity metrics. ../tutorials/pressing_intensity: Tutorial on pressing intensity analysis.

`dataset`_`:` [`KloppyPolarsDataset`](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.dataset.kloppy_polars.KloppyPolarsDataset")_

`chunk_size`_`:` [`int`](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)")_ _`=` `20000`_

`fit`(_`start_time``=``None`_, _`end_time``=``None`_, _`period_id``=``None`_, _`speed_threshold``=``None`_, _`reaction_time``=``0.7`_, _`time_threshold``=``1.5`_, _`sigma``=``0.45`_, _`method``=``'teams'`_, _`ball_method``=``'max'`_, _`orient``=``'ball_owning'`_, _`line_method``=``None`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/models/pressing_intensity.html#PressingIntensity.fit)

Compute pressing intensity metrics for tracking data.

Calculates time-to-intercept (TTI) and probability-to-intercept (PTI) matrices quantifying defensive pressure. For each frame, computes how quickly defenders can reach attackers and the likelihood of successful pressing actions.

The computation considers: - Player positions and velocities - Reaction time delays - Maximum acceleration capabilities - Ball position and ball carrier proximity

Parameters:

-   **start_time** (`` `pl.duration` ``, _optional_) – Start time for analysis window. Must be specified together with end_time and period_id. Defaults to None (processes all frames).
    
-   **end_time** (`` `pl.duration` ``, _optional_) – End time for analysis window. Defaults to None.
    
-   **period_id** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Period ID to analyze (e.g., 1 for first half). Defaults to None.
    
-   **speed_threshold** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Minimum player speed (m/s) to include in pressing calculations. Players below this threshold are masked out (PTI set to 0.0). Useful for analyzing active pressing vs passive coverage. Defaults to None (no filtering).
    
-   **reaction_time** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Defender reaction time in seconds before accelerating toward target. Models decision-making and perception delay. Defaults to 0.7 seconds.
    
-   **time_threshold** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Time window (seconds) for pressing opportunities. TTI values beyond this are considered low-pressure situations. Affects sigmoid conversion to probabilities. Defaults to 1.5 seconds.
    
-   **sigma** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Sigmoid steepness parameter for TTI → PTI conversion. Higher values create sharper transitions between high/low pressure. Defaults to 0.45.
    
-   **method** (`` `Literal[``` ``”teams”`` `,` ```"full"` ```` `]` ``, _optional_) – Matrix structure: - “teams”: 11×11 matrix (ball-owning team × non-owning team) - “full”: 22×22 matrix (all players × all players) Defaults to “teams”.
    
-   **ball_method** (`` `Literal[``` ``”include”`` `,` ```"exclude"` ``, `` `"max"` ```` `]` ``, _optional_) –
    
    Ball handling: - “include”: Add ball as separate node (creates 11×12 or 22×23 matrix) - “exclude”: Ignore ball entirely - “max”: Merge ball with ball carrier using max(ball_tti, carrier_tti),
    
    > preserving matrix dimensions
    
    Defaults to “max” (recommended).
    
-   **orient** (`` `Literal[``` ``”ball_owning”`` `,` ```"pressing"` ``, `` `"home_away"` ``, `` `"away_home"` ```` `]` ``, _optional_) – Matrix orientation perspective: - “ball_owning”: Rows = ball-owning team, Cols = non-owning team - “pressing”: Rows = non-owning team, Cols = ball-owning team (transpose) - “home_away”: Rows = home team, Cols = away team - “away_home”: Rows = away team, Cols = home team Defaults to “ball_owning”.
    
-   **line_method** (`` `Union[None` ``, `` `Literal[``` ``”touchline”`` `,` ```"byline"` ``, `` `"all"` ```` `]]` ``, _optional_) – Reserved for future development (include pitch boundaries in calculations). Currently has no effect. Defaults to None.
    

Returns:

Self, with computed results stored in [`` `output` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.PressingIntensity.output "unravel.soccer.PressingIntensity.output").

Return type:

[PressingIntensity](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.PressingIntensity "unravel.soccer.PressingIntensity")

Raises:

-   [**TypeError**](https://docs.python.org/3/library/exceptions.html#TypeError "(in Python v3.14)") – If period_id is not an integer.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If method, ball_method, orient, or line_method have invalid values.
    
-   [**TypeError**](https://docs.python.org/3/library/exceptions.html#TypeError "(in Python v3.14)") – If reaction_time, speed_threshold, time_threshold, or sigma have invalid types.
    
-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If start_time, end_time, and period_id are partially specified (must be all or none).
    

Example

```
>>> # Basic usage: compute pressing intensity for all frames
>>> pi = PressingIntensity(dataset=soccer_data)
>>> pi.fit(method="teams", ball_method="max")
>>> print(pi.output.columns)
['frame_id', 'period_id', 'timestamp', 'time_to_intercept',
 'probability_to_intercept', 'columns', 'rows']
>>>
>>> # Analyze specific time window
>>> pi.fit(
...     start_time=pl.duration(minutes=10),
...     end_time=pl.duration(minutes=15),
...     period_id=1,
...     method="teams"
... )
>>>
>>> # Filter for active pressing (players moving > 2 m/s)
>>> pi.fit(
...     method="teams",
...     speed_threshold=2.0,
...     reaction_time=0.5,
...     time_threshold=1.0
... )
>>>
>>> # Full 22x22 matrix with ball as separate node
>>> pi.fit(method="full", ball_method="include")
>>>
>>> # Extract pressing intensity for frame 1000
>>> frame_data = pi.output.filter(pl.col("frame_id") == 1000)
>>> tti_matrix = np.array(frame_data["time_to_intercept"][0])
>>> pti_matrix = np.array(frame_data["probability_to_intercept"][0])
>>> print(f"Max pressing probability: {pti_matrix.max():.2f}")
```

Note

-   Time windows (start_time, end_time, period_id) must be specified together or all set to None. Partial specification raises ValueError.
    
-   The output DataFrame contains nested lists for TTI and PTI matrices. Use .to_numpy() or indexing to extract arrays for analysis.
    
-   Matrix dimensions depend on method and ball_method: - “teams” + “max”: 11×11 - “teams” + “include”: 11×12 - “full” + “max”: 22×22 - “full” + “include”: 22×23
    
-   Player IDs in “columns” and “rows” correspond to matrix dimensions and indicate which player occupies each position.
    

See also

[`` `PressingIntensity` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.PressingIntensity "unravel.soccer.PressingIntensity"): Class documentation with conceptual overview. ../tutorials/pressing_intensity: Complete tutorial with visualizations.

`__init__`(_`dataset`_, _`chunk_size``=``20000`_)

Parameters:

-   **dataset** ([_KloppyPolarsDataset_](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.dataset.kloppy_polars.KloppyPolarsDataset"))
    
-   **chunk_size** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    

Return type:

None

_`class`_ `unravel.soccer.``EFPI`[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/models/formations/efpi.html#EFPI)

Bases: `` `FormationDetection` ``

Detect soccer team formations using Expected Formation Positioning Inference (EFPI).

EFPI automatically identifies team formations (e.g., 4-3-3, 4-4-2, 3-5-2) from player positions using optimal assignment between observed positions and canonical formation templates. The algorithm uses the Hungarian algorithm (linear sum assignment) to minimize the total distance between players and template positions, scaled to match the team’s spatial distribution.

The method works by: 1. Extracting player positions for each team (attack/defense separately) 2. Comparing positions to predefined formation templates (mplsoccer or Shaw-Glickman) 3. Finding the best-fit formation via optimal bipartite matching 4. Assigning positional labels (e.g., “LW”, “CM”, “RB”) to each player 5. Tracking formation changes over time or possession segments

Key features: - Automatic formation detection with no manual labeling - Separate formations for attacking and defending phases - Position-specific labels for each player - Temporal aggregation (per-frame, per-possession, or custom windows) - Substitution handling (merge or drop) - Formation stability tracking via cost thresholds

The algorithm is based on research in formation detection and extends methods from Decroos et al. and Shaw & Glickman’s formation analysis work.

Parameters:

-   **dataset** ([`` `KloppyPolarsDataset` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.KloppyPolarsDataset")) – Soccer tracking dataset with player positions and ball ownership information.
    
-   **formations** (`` `Union[List[str]` ``, `` `Literal[``` ``”shaw-glickman”[\`\`](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#id1)`` `]]` ``, _optional_) – Formation templates to use. Either a list of formation names (e.g., \[“4-3-3”, “4-4-2”\]) or “shaw-glickman” for the alternative template set. Defaults to None (uses mplsoccer formations).
    

`output`

Detected formations with columns: - object_id: Player ID - team_id: Team ID - position: Assigned position label (e.g., “LW”, “CM”, “GK”) - formation: Formation name (e.g., “4-3-3”) - is_attacking: Boolean indicating attacking (True) or defending (False) - frame_id (if every=”frame”): Frame identifier - \[segment_id\] (if every != “frame”): Possession or time window identifier

Type:

`` `pl.DataFrame` ``

`segments`

When using temporal aggregation (every != “frame”), contains segment metadata: - segment_id: Unique segment identifier - n_frames: Number of frames in segment - start_timestamp / end_timestamp: Time bounds - start_frame_id / end_frame_id: Frame bounds

Type:

`` `pl.DataFrame` ``, _optional_

Raises:

-   [**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If dataset is not of type KloppyPolarsDataset.
    
-   [**ImportError**](https://docs.python.org/3/library/exceptions.html#ImportError "(in Python v3.14)") – If scipy is not installed (required for linear_sum_assignment).
    

Example

```
>>> from unravel.soccer.dataset import KloppyPolarsDataset
>>> from unravel.soccer.models.formations import EFPI
>>> from kloppy import datasets
>>>
>>> # Load tracking data
>>> dataset = datasets.load(provider="skillcorner", match_id="123")
>>> soccer_data = KloppyPolarsDataset(kloppy_dataset=dataset)
>>>
>>> # Initialize EFPI detector
>>> efpi = EFPI(dataset=soccer_data)
>>>
>>> # Detect formations per frame
>>> efpi.fit(every="frame")
>>> print(efpi.output)
>>> # Shows: frame_id, object_id, position, formation, is_attacking
>>>
>>> # Detect formations per possession
>>> efpi.fit(
...     every="possession",
...     change_after_possession=True,  # Re-detect when possession changes
...     change_threshold=0.2            # Re-detect if cost improves by 20%
... )
>>> print(efpi.segments)
>>> # Shows possession segments with start/end times
>>>
>>> # Detect formations per 5-minute window
>>> efpi.fit(every="5m", substitutions="drop")
>>>
>>> # Use custom formation templates
>>> efpi_custom = EFPI(
...     dataset=soccer_data,
...     formations=["4-3-3", "4-2-3-1", "3-5-2"]
... )
>>> efpi_custom.fit(every="possession")
```

Note

-   Formation detection requires at least 10 outfield players per team. Frames with fewer players are automatically filtered out.
    
-   The algorithm assigns positions based on spatial distribution, not player roles. A player listed as a striker may be assigned “CM” if positioned centrally.
    
-   For per-frame detection, formations can change every frame. Use temporal aggregation (every=”possession” or time windows) for more stable detection.
    
-   The cost metric measures total euclidean distance between players and template positions. Lower cost indicates better fit.
    

See also

`` `KloppyPolarsDataset` ``: Data loading and preprocessing. [`` `fit()` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.EFPI.fit "unravel.soccer.EFPI.fit"): Configure and run formation detection. ../tutorials/formation_detection: Tutorial on formation analysis.

_`property`_ `return_dtypes`

`__init__`(_`dataset`_, _`chunk_size``=``2000`_)

Parameters:

-   **dataset** ([_KloppyPolarsDataset_](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.dataset.kloppy_polars.KloppyPolarsDataset"))
    
-   **chunk_size** ([_int_](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"))
    

Return type:

None

`fit`(_`start_time``=``None`_, _`end_time``=``None`_, _`period_id``=``None`_, _`every``=``'frame'`_, _`formations``=``None`_, _`substitutions``=``'drop'`_, _`change_after_possession``=``True`_, _`change_threshold``=``None`_)[`[source]`](https://unravelsports.readthedocs.io/en/latest/_modules/unravel/soccer/models/formations/efpi.html#EFPI.fit)

Detect team formations from player positions.

Runs the EFPI formation detection algorithm on tracking data, identifying formations for both attacking and defending teams. Supports temporal aggregation to detect formations at different time scales (per-frame, per-possession, or custom time windows).

The detection process: 1. Groups data by the specified temporal unit (every) 2. For each group, extracts attacking and defending team positions 3. Compares positions to formation templates using optimal assignment 4. Selects best-fit formation and assigns positional labels 5. Handles substitutions and formation changes based on thresholds

Parameters:

-   **start_time** (`` `pl.duration` ``, _optional_) – Start time for analysis window. Must be specified together with end_time and period_id. Defaults to None (processes all data).
    
-   **end_time** (`` `pl.duration` ``, _optional_) – End time for analysis window. Defaults to None.
    
-   **period_id** ([`` `int` ``](https://docs.python.org/3/library/functions.html#int "(in Python v3.14)"), _optional_) – Period ID to analyze (e.g., 1 for first half). Defaults to None.
    
-   **every** (`` `Optional[Union[str` ``, `` `Literal[``` ``”frame”`` `,` ```"period"` ``, `` `"possession"` ```` `]]]` ``, _optional_) – Temporal aggregation level: - “frame”: Detect formations every frame (no aggregation) - “possession”: Detect formations per possession phase - “period”: Detect formations per period (half) - Time string (e.g., “5m”, “30s”): Detect formations per time window Defaults to “frame”.
    
-   **formations** (`` `Union[List[str]` ``, `` `Literal[``` ``”shaw-glickman”[\`\`](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#id3)`` `]]` ``, _optional_) – Formation templates to use. Either a list of formation names (e.g., \[“4-3-3”, “4-4-2”, “3-5-2”\]) or “shaw-glickman” for alternative templates. Defaults to None (uses all mplsoccer formations).
    
-   **substitutions** (`` `Literal[``` ``”merge”`` `,` ```"drop"` ```` `]` ``, _optional_) – How to handle substitutions within temporal windows: - “drop”: Exclude players with shortest appearance in window - “merge”: Average positions across substitution overlap (not yet implemented) Defaults to “drop”.
    
-   **change_after_possession** ([`` `bool` ``](https://docs.python.org/3/library/functions.html#bool "(in Python v3.14)"), _optional_) – Whether to re-detect formations when possession changes (even within the same temporal window). Defaults to True.
    
-   **change_threshold** ([`` `float` ``](https://docs.python.org/3/library/functions.html#float "(in Python v3.14)"), _optional_) – Minimum relative cost improvement (0-1) required to update the detected formation. For example, 0.2 means the new formation must have 20% lower cost to replace the current one. Helps stabilize detections. Defaults to None (always update).
    

Returns:

Self, with detected formations stored in [`` `output` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.EFPI.output "unravel.soccer.EFPI.output") and temporal

segments in [`` `segments` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.EFPI.segments "unravel.soccer.EFPI.segments").

Return type:

[EFPI](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.EFPI "unravel.soccer.EFPI")

Raises:

[**ValueError**](https://docs.python.org/3/library/exceptions.html#ValueError "(in Python v3.14)") – If start_time, end_time, and period_id are partially specified (must be all or none).

Example

```
>>> # Per-frame detection (no temporal aggregation)
>>> efpi = EFPI(dataset=soccer_data)
>>> efpi.fit(every="frame")
>>> print(efpi.output.head())
>>> # Shows formation for each frame
>>>
>>> # Per-possession detection with stability threshold
>>> efpi.fit(
...     every="possession",
...     change_after_possession=True,
...     change_threshold=0.15  # Only update if cost improves by 15%
... )
>>> # Formation changes only when possession changes or cost improves significantly
>>>
>>> # Per-period detection (one formation per half)
>>> efpi.fit(every="period")
>>> # Single formation assignment for each period
>>>
>>> # 5-minute rolling window detection
>>> efpi.fit(every="5m", substitutions="drop")
>>> print(efpi.segments)
>>> # Shows 5-minute windows with start/end times
>>>
>>> # Custom formations with time window
>>> efpi.fit(
...     start_time=pl.duration(minutes=10),
...     end_time=pl.duration(minutes=20),
...     period_id=1,
...     every="possession",
...     formations=["4-3-3", "4-2-3-1"]
... )
>>>
>>> # Analyze formation changes during first half
>>> efpi.fit(every="possession", period_id=1)
>>> formation_changes = (
...     efpi.output
...     .group_by(["team_id", "possession_id"])
...     .agg(pl.col("formation").first())
... )
>>> print(formation_changes)
```

Note

-   Per-frame detection can be noisy due to player movements. Use temporal aggregation (every=”possession” or time windows) for more stable results.
    
-   The change_threshold parameter only applies when using temporal aggregation (every != “frame”). It prevents frequent formation updates within windows.
    
-   When using time windows (e.g., every=”5m”), player positions are averaged across the window before formation detection.
    
-   Substitutions within windows are handled by the substitutions parameter: - “drop”: Keeps the 11 players with longest appearances - “merge”: Not yet implemented (will raise NotImplementedError)
    
-   The output DataFrame structure differs based on every: - “frame”: Contains frame_id - “possession” / time windows: Contains segment_id and is_attacking - Use segments attribute to map segment_id back to frame ranges
    

See also

[`` `EFPI` ``](https://unravelsports.readthedocs.io/en/latest/api/soccer/models.html#unravel.soccer.EFPI "unravel.soccer.EFPI"): Class documentation with algorithm overview. ../tutorials/formation_detection: Complete tutorial with examples.

`dataset`_`:` [`KloppyPolarsDataset`](https://unravelsports.readthedocs.io/en/latest/api/soccer/dataset.html#unravel.soccer.KloppyPolarsDataset "unravel.soccer.KloppyPolarsDataset")_

```
from unravel.soccer import PressingIntensity
import polars as pl

model = PressingIntensity(dataset=polars_dataset)
result = model.fit(
    start_time=pl.duration(minutes=1, seconds=53),
    end_time=pl.duration(minutes=2, seconds=32),
    period_id=1,
    method="teams",
)
```

## Formation Detection (EFPI)

```
from unravel.soccer import EFPI

model = EFPI(dataset=polars_dataset)
formations = model.fit(
    every="5m",
    substitutions="drop",
)
```