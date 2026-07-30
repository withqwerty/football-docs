# kloppy Usage Guide

## Installation

```bash
pip install kloppy

# With optional dependencies for specific providers
pip install kloppy[statsbomb]
pip install kloppy[wyscout]
```

## Loading Data from Providers

### StatsBomb (Open Data)

```python
from kloppy import statsbomb

# Load from StatsBomb open data (no auth needed)
dataset = statsbomb.load_open_data(
    match_id=3788741,  # StatsBomb match ID
    coordinates="statsbomb"  # Keep original coordinates
)

# Load from local files
dataset = statsbomb.load(
    event_data="events.json",
    lineup_data="lineups.json",
)
```

### Opta (F24 XML + F7 XML)

```python
from kloppy import opta

# Load from files
dataset = opta.load(
    f24_data="f24.xml",      # Event data
    f7_data="f7.xml",        # Match metadata (lineups, formations)
)
```

### Wyscout

```python
from kloppy import wyscout

# Load v3 format
dataset = wyscout.load(
    event_data="events_v3.json",
    data_version="V3"
)

# Load v2 format (legacy)
dataset = wyscout.load(
    event_data="events_v2.json",
    data_version="V2"
)
```

### WhoScored (via Opta-style JSON)

WhoScored uses Opta-derived data. Load using the `opta` loader with JSON format:

```python
from kloppy import opta

dataset = opta.load(
    f24_data="whoscored_events.json",
    f7_data="whoscored_meta.json",
    coordinates="opta"
)
```

### Second Spectrum (Tracking)

```python
from kloppy import secondspectrum

dataset = secondspectrum.load(
    raw_data="tracking.jsonl",
    meta_data="meta.json",
)
```

### TRACAB (Tracking)

```python
from kloppy import tracab

dataset = tracab.load(
    raw_data="tracking.dat",
    meta_data="meta.xml",
)
```

### SkillCorner (Tracking)

```python
from kloppy import skillcorner

dataset = skillcorner.load(
    raw_data="tracking.json",
    meta_data="match.json",
)
```

## Transforming Coordinates

```python
from kloppy.domain import MetricPitchDimensions, Dimension

# Transform to a standard 105x68 metre pitch
dataset = dataset.transform(
    to_pitch_dimensions=MetricPitchDimensions(
        x_dim=Dimension(0, 105),
        y_dim=Dimension(0, 68),
        pitch_length=105,
        pitch_width=68,
        standardized=False,
    ),
    to_orientation="STATIC_HOME_AWAY"
)

# Or transform to match another provider's system
dataset = dataset.transform(
    to_coordinate_system="statsbomb"
)
```

## Exporting to pandas

kloppy doesn't export a top-level `to_pandas` function -- exporting is a method
on the dataset itself, `Dataset.to_df(*columns, engine=..., **named_columns)`:

```python
# Basic export
df = dataset.to_df(engine="pandas")

# With additional derived columns (passed as keyword arguments)
df = dataset.to_df(
    engine="pandas",
    end_x=lambda event: event.end_coordinates.x if event.end_coordinates else None,
    end_y=lambda event: event.end_coordinates.y if event.end_coordinates else None,
    receiver=lambda event: event.receiver_player.name if event.receiver_player else None,
    is_goal=lambda event: event.result.value == "GOAL" if hasattr(event.result, 'value') else False,
)

# The DataFrame includes these columns by default:
# event_id, event_type, result, timestamp, period_id,
# team_id, player_id, coordinates_x, coordinates_y,
# ball_state, ball_owning_team_id
```

## Exporting to Polars

```python
# Same to_df() method, different engine
df = dataset.to_df(engine="polars")
```

## Filtering Events

### By Event Type

```python
from kloppy.domain import EventType

# Filter to only passes
passes = dataset.filter(lambda event: event.event_type == EventType.PASS)

# Filter to shots
shots = dataset.filter(lambda event: event.event_type == EventType.SHOT)

# Multiple types
actions = dataset.filter(
    lambda event: event.event_type in [EventType.PASS, EventType.SHOT, EventType.TAKE_ON]
)
```

### By Result

```python
from kloppy.domain import ShotResult, PassResult

# Only goals
goals = dataset.filter(
    lambda event: event.event_type == EventType.SHOT and event.result == ShotResult.GOAL
)

# Completed passes
completed = dataset.filter(
    lambda event: event.event_type == EventType.PASS and event.result == PassResult.COMPLETE
)
```

### By Team or Player

```python
# By team
home_team = dataset.metadata.teams[0]
home_events = dataset.filter(lambda event: event.team == home_team)

# By player name
salah_events = dataset.filter(
    lambda event: event.player and event.player.name == "Mohamed Salah"
)

# By player ID
player_events = dataset.filter(
    lambda event: event.player and event.player.player_id == "p123456"
)
```

### By Qualifier

```python
from kloppy.domain import SetPieceQualifier, BodyPartQualifier

# Corner kicks
corners = dataset.filter(
    lambda event: event.get_qualifier_value(SetPieceQualifier) == SetPieceQualifier.CORNER_KICK
)

# Headers
headers = dataset.filter(
    lambda event: event.get_qualifier_value(BodyPartQualifier) == BodyPartQualifier.HEAD
)
```

### By Location

```python
# Events in the final third (assuming 105m pitch, STATIC_HOME_AWAY orientation)
final_third = dataset.filter(
    lambda event: event.coordinates and event.coordinates.x > 70
)

# Events inside the box (approximate)
in_box = dataset.filter(
    lambda event: (
        event.coordinates
        and event.coordinates.x > 88.5  # 105 - 16.5
        and 13.84 < event.coordinates.y < 54.16  # centred 40.32m box
    )
)
```

### Chaining Filters

```python
# Progressive passes in the first half
progressive = dataset.filter(
    lambda event: (
        event.event_type == EventType.PASS
        and event.result == PassResult.COMPLETE
        and event.period.id == 1
        and event.coordinates
        and event.end_coordinates
        and (event.end_coordinates.x - event.coordinates.x) > 25  # 25m+ forward
    )
)
```

## Practical Examples

### Pass Network (Pass Map)

```python
from collections import defaultdict
from kloppy import statsbomb
from kloppy.domain import EventType, PassResult

dataset = statsbomb.load_open_data(match_id=3788741)
dataset = dataset.transform(
    to_pitch_dimensions=MetricPitchDimensions(
        x_dim=Dimension(0, 105),
        y_dim=Dimension(0, 68),
        pitch_length=105,
        pitch_width=68,
        standardized=False,
    ),
    to_orientation="STATIC_HOME_AWAY"
)

home_team = dataset.metadata.teams[0]

# Completed passes by home team
home_passes = dataset.filter(
    lambda e: (
        e.event_type == EventType.PASS
        and e.result == PassResult.COMPLETE
        and e.team == home_team
        and e.player
        and e.receiver_player
    )
)

# Build pass matrix
pass_counts = defaultdict(int)
for event in home_passes.events:
    key = (event.player.name, event.receiver_player.name)
    pass_counts[key] += 1

# Average positions
player_positions = defaultdict(lambda: {"x": [], "y": []})
for event in home_passes.events:
    if event.coordinates:
        player_positions[event.player.name]["x"].append(event.coordinates.x)
        player_positions[event.player.name]["y"].append(event.coordinates.y)

avg_positions = {
    name: (sum(pos["x"]) / len(pos["x"]), sum(pos["y"]) / len(pos["y"]))
    for name, pos in player_positions.items()
}
```

### Shot Map with xG

```python
from kloppy import statsbomb
from kloppy.domain import EventType

dataset = statsbomb.load_open_data(match_id=3788741)
df = dataset.filter(lambda e: e.event_type == EventType.SHOT).to_df(
    engine="pandas",
    x=lambda e: e.coordinates.x if e.coordinates else None,
    y=lambda e: e.coordinates.y if e.coordinates else None,
    xg=lambda e: e.raw_event.get("shot", {}).get("statsbomb_xg"),
    outcome=lambda e: e.result.value if e.result else None,
    body_part=lambda e: str(e.get_qualifier_value(BodyPartQualifier)),
)
```

### Cross-Provider Comparison

```python
from kloppy import statsbomb, wyscout
from kloppy.domain import MetricPitchDimensions, Dimension

# Load same match from two providers
sb_dataset = statsbomb.load(event_data="sb_events.json", lineup_data="sb_lineups.json")
wy_dataset = wyscout.load(event_data="wy_events.json", data_version="V3")

# Normalise both to the same coordinate system
target_dims = MetricPitchDimensions(
    x_dim=Dimension(0, 105), y_dim=Dimension(0, 68),
    pitch_length=105, pitch_width=68, standardized=False,
)

sb_dataset = sb_dataset.transform(to_pitch_dimensions=target_dims, to_orientation="STATIC_HOME_AWAY")
wy_dataset = wy_dataset.transform(to_pitch_dimensions=target_dims, to_orientation="STATIC_HOME_AWAY")

# Now both datasets use the same coordinates and event model
sb_passes = len(sb_dataset.filter(lambda e: e.event_type == EventType.PASS).events)
wy_passes = len(wy_dataset.filter(lambda e: e.event_type == EventType.PASS).events)
print(f"StatsBomb passes: {sb_passes}, Wyscout passes: {wy_passes}")
```

## Working with Tracking Data

```python
from kloppy import tracab

dataset = tracab.load(raw_data="tracking.dat", meta_data="meta.xml")

# Access frames
for frame in dataset.frames[:10]:
    print(f"Frame {frame.frame_id} at {frame.timestamp}")
    if frame.ball_coordinates:
        print(f"  Ball: ({frame.ball_coordinates.x:.1f}, {frame.ball_coordinates.y:.1f})")
    for player, data in frame.players_data.items():
        print(f"  {player.name}: ({data.coordinates.x:.1f}, {data.coordinates.y:.1f})")

# Convert to DataFrame
df = dataset.to_df(engine="pandas")
```

## Serialisation

kloppy has no top-level `to_json`/`load` pair for round-tripping a full
dataset. To serialise, export the flattened records with `to_records()` or
`to_dict()` and write them out yourself:

```python
import json

# Flattened list of dicts, one per event/frame
# (use default=str since fields like `timestamp` are timedelta objects)
records = dataset.to_records()
with open("output.json", "w") as f:
    json.dump(records, f, default=str)
```

To get data back into kloppy, re-run the original provider loader (e.g.
`statsbomb.load(...)`) against the source files -- there is no generic
loader for kloppy's own export format.
