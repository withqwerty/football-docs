# DataBallPy Usage Guide

## Installation

```bash
pip install databallpy

# With kloppy integration (expands provider support)
pip install 'databallpy[kloppy]'

# With dangerous accessible space metric
pip install 'databallpy[accessible-space]'
```

## Loading Data

### From Files with Native Parsers

```python
from databallpy import get_game

# Tracab tracking + Opta events (most common combo)
game = get_game(
    tracking_data_loc="../data/tracking_data.dat",
    tracking_metadata_loc="../data/tracking_metadata.xml",
    tracking_data_provider="tracab",
    event_data_loc="../data/event_data_f24.xml",
    event_metadata_loc="../data/event_metadata_f7.xml",
    event_data_provider="opta",
)

# StatsBomb events only (requires extra files)
game = get_game(
    event_data_loc="events.json",
    event_match_loc="match.json",
    event_lineup_loc="lineup.json",
    event_data_provider="statsbomb",
)

# Metrica tracking + events
game = get_game(
    tracking_data_loc="tracking_home.csv",
    tracking_metadata_loc="metadata.xml",
    tracking_data_provider="metrica",
    event_data_loc="events.json",
    event_data_provider="metrica",
)
```

### From Kloppy Datasets

```python
from kloppy import sportec
from databallpy import get_game_from_kloppy

tracking_dataset = sportec.load_open_tracking_data(match_id="J03WPY", only_alive=False)
event_dataset = sportec.load_open_event_data(match_id="J03WPY")
game = get_game_from_kloppy(
    tracking_dataset=tracking_dataset,
    event_dataset=event_dataset
)
```

### Open Data (DFL/Bundesliga)

```python
from databallpy import get_open_game

# 7 available matches (2 Bundesliga 1 + 5 Bundesliga 2)
game = get_open_game(provider="sportec", game_id="J03WMX")  # Köln vs Bayern
```

### Save and Load Games

```python
# Save (creates parquet + JSON files)
game.save_game(name="my_game", path="/data")

# Load
from databallpy import get_saved_game
game = get_saved_game(name="my_game", path="/data")
```

## Accessing Data

```python
# DataFrames
game.tracking_data   # TrackingData (custom DataFrame)
game.event_data      # EventData (custom DataFrame)
game.shot_events     # DataFrame of ShotEvent objects
game.pass_events     # DataFrame of PassEvent objects
game.dribble_events  # DataFrame of DribbleEvent objects

# Player column IDs (for tracking data)
home_col_ids = game.get_column_ids(team="home")
defenders = game.get_column_ids(team="home", positions=["defender"])

# Get specific frames
frame_data = game.get_frames(12345, playing_direction="team_oriented")
frame_data = game.get_frames(12345, playing_direction="possession_oriented")

# Get event and its tracking frame
event = game.get_event(event_id=42)
frame = game.get_event_frame(event_id=42)

# Match metadata
game.home_team_name, game.away_team_name
game.home_score, game.away_score
game.home_formation, game.away_formation
game.pitch_dimensions  # [length, width] in metres
```

## Synchronization

Aligns tracking and event data using the Needleman-Wunsch algorithm. After sync, tracking data gets `event_id`, `databallpy_event`, `sync_certainty` columns; event data gets `tracking_frame`, `sync_certainty` columns.

```python
game.synchronise_tracking_and_event_data(
    n_batches="smart",  # or int for manual batch count
    verbose=True,
    offset=1,           # seconds offset for alignment
)

# Check sync status
game.is_synchronised  # bool
```

Quality checks must pass for sync to be allowed (kick-off near origin, ball alive >50% of game, player positions within bounds).

## Preprocessing

### Filtering Tracking Data

```python
game.tracking_data.filter_tracking_data(
    column_ids=home_col_ids,
    filter_type="savitzky_golay",
    window_length=7,
    polyorder=2,
)
```

### Velocity and Acceleration

```python
# Add velocity columns (_vx, _vy)
game.tracking_data.add_velocity(
    column_ids=home_col_ids,
    filter_type=None,          # optional smoothing
    max_velocity=np.inf,
)

# Add acceleration columns (_ax, _ay)
game.tracking_data.add_acceleration(
    column_ids=home_col_ids,
    filter_type=None,
    max_acceleration=np.inf,
)
```

## Analytics and Metrics

### Covered Distance (by velocity/acceleration zones)

```python
result_df = game.tracking_data.get_covered_distance(
    column_ids=home_col_ids,
    velocity_intervals=((0, 5), (5, 20)),      # m/s
    acceleration_intervals=((2, np.inf),),       # m/s²
)
```

### Pressure (Herold & Kempe 2022)

```python
pressure = game.tracking_data.get_pressure_on_player(
    index=12345,           # frame index
    column_id="home_1",    # player to measure pressure on
    pitch_size=game.pitch_dimensions,
    d_front="variable",    # or float
    d_back=3.0,
    q=1.75,
)
```

### Team Possession (from synchronized events)

```python
game.tracking_data.add_team_possession(game.event_data, game.home_team_id)
```

### Individual Player Possession (Vidal-Codina et al. 2022)

```python
game.tracking_data.add_individual_player_possession(
    pz_radius=1.5,
    bv_threshold=5.0,
    ba_threshold=10.0,
    min_frames_pz=0,
)
```

### Pitch Control (Gaussian influence model)

```python
pitch_control = game.tracking_data.get_pitch_control(
    pitch_dimensions=game.pitch_dimensions,
    n_x_bins=106,
    n_y_bins=68,
)
```

### Voronoi Space Occupation

```python
distances, assigned = game.tracking_data.get_approximate_voronoi(
    pitch_dimensions=game.pitch_dimensions,
    n_x_bins=106,
    n_y_bins=68,
)
```

### Dangerous Accessible Space

Requires `pip install 'databallpy[accessible-space]'`:

```python
game.tracking_data.add_dangerous_accessible_space(mask=None)
```

## Visualization

```python
from databallpy.visualize import (
    plot_soccer_pitch, plot_tracking_data, plot_events, save_tracking_video
)

# Plot empty pitch
fig, ax = plot_soccer_pitch(field_dimen=(106.0, 68.0), pitch_color="mediumseagreen")

# Plot single tracking frame
fig, ax = plot_tracking_data(
    game, idx=12345,
    team_colors=["green", "red"],
    events=["pass", "shot"],
    add_velocities=True,
    add_player_possession=True,
    heatmap_overlay=some_array,
)

# Plot events on pitch
fig, ax = plot_events(game, events=["shot"], outcome=True, team_id=game.home_team_id)

# Save video clip (requires ffmpeg)
save_tracking_video(
    game, start_idx=1000, end_idx=2000,
    save_folder="./clips", title="goal_clip",
    events=["shot"],
)
```

## Video Analysis Export

Export events to SportsCode/Longomatch-compatible XML:

```python
xml_str = game.event_data.to_video_analysis_xml(
    databallpy_events=["shot", "pass"],
    before_seconds=3.0,
    after_seconds=3.0,
)
```

## Long Format Conversion

Convert tracking data from wide format (one column per player axis) to long format (one row per frame/player):

```python
long_df = game.tracking_data.to_long_format()
```
