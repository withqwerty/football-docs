# kloppy Data Model

## Overview

kloppy is a Python library that provides a **unified data model** for football event and tracking data. It abstracts away provider-specific formats (Opta, StatsBomb, Wyscout, WhoScored, etc.) into a canonical set of event types, coordinate systems, and data structures.

Repository: https://github.com/kloppy-project/kloppy

## Canonical Event Types

kloppy defines **13 canonical event types** that all provider events map to:

| Event Type | Class | Description |
|---|---|---|
| `PASS` | `PassEvent` | Any pass attempt (short, long, cross, through ball) |
| `SHOT` | `ShotEvent` | Any shot attempt |
| `TAKE_ON` | `TakeOnEvent` | Dribble / take-on attempt |
| `CARRY` | `CarryEvent` | Ball carry between events (synthetic, inferred from consecutive events) |
| `DUEL` | `DuelEvent` | 1v1 contest (ground or aerial) |
| `INTERCEPTION` | `InterceptionEvent` | Interception of opponent pass |
| `CLEARANCE` | `ClearanceEvent` | Defensive clearance |
| `MISCONTROL` | `MiscontrolEvent` | Failed ball control / bad touch |
| `BALL_OUT` | `BallOutEvent` | Ball goes out of play |
| `FOUL_COMMITTED` | `FoulCommittedEvent` | Foul committed by a player |
| `GOALKEEPER` | `GoalkeeperEvent` | Goalkeeper-specific action (save, punch, claim, etc.) |
| `FORMATION_CHANGE` | `FormationChangeEvent` | Tactical formation change |
| `GENERIC` | `GenericEvent` | Catch-all for provider events that don't map to a canonical type |

### Result Enums

Each event has a `result` property with type-specific enum values:

#### PassResult

| Value | Description |
|---|---|
| `COMPLETE` | Pass reached intended target |
| `INCOMPLETE` | Pass intercepted or out of play |
| `OFFSIDE` | Pass resulted in offside |
| `OUT` | Pass went out of play |

#### ShotResult

| Value | Description |
|---|---|
| `GOAL` | Shot resulted in a goal |
| `SAVED` | Shot saved by goalkeeper |
| `OFF_TARGET` | Shot off target (wide or over) |
| `BLOCKED` | Shot blocked by defender |
| `POST` | Shot hit the post/crossbar |

#### TakeOnResult

| Value | Description |
|---|---|
| `COMPLETE` | Successful dribble |
| `INCOMPLETE` | Failed dribble, lost possession |

#### DuelResult

| Value | Description |
|---|---|
| `WON` | Won the duel |
| `LOST` | Lost the duel |

#### InterceptionResult

| Value | Description |
|---|---|
| `SUCCESS` | Successfully intercepted |
| `LOST` | Interception attempt failed |
| `WON` | Interception won (alias for SUCCESS in some contexts) |

#### GoalkeeperActionResult

| Value | Description |
|---|---|
| `SUCCESS` | Successful goalkeeper action |
| `FAILURE` | Failed goalkeeper action |

## Qualifiers

Qualifiers add additional context to events without creating separate event types.

### SetPieceQualifier

| Value | Description |
|---|---|
| `GOAL_KICK` | From a goal kick |
| `FREE_KICK` | From a free kick |
| `THROW_IN` | From a throw-in |
| `CORNER_KICK` | From a corner kick |
| `PENALTY` | From a penalty |
| `KICK_OFF` | From kick-off |

### BodyPartQualifier

| Value | Description |
|---|---|
| `RIGHT_FOOT` | Right foot |
| `LEFT_FOOT` | Left foot |
| `HEAD` | Header |
| `NO_TOUCH` | No body part (e.g., deflection) |

### CardQualifier

| Value | Description |
|---|---|
| `FIRST_YELLOW` | First yellow card |
| `SECOND_YELLOW` | Second yellow card |
| `RED` | Straight red card |

### PassQualifier

| Value | Description |
|---|---|
| `CROSS` | Cross into the box |
| `LONG_BALL` | Long ball |
| `THROUGH_BALL` | Through ball |
| `CHIPPED` | Chipped pass |
| `SWITCH` | Switch of play |
| `LAUNCH` | Long launch |
| `HEAD_PASS` | Headed pass |
| `HIGH_PASS` | High/lofted pass |
| `HAND_PASS` | Goalkeeper hand pass |
| `SMART_PASS` | Creative pass (Wyscout-specific) |

### GoalkeeperQualifier

| Value | Description |
|---|---|
| `SAVE` | Save attempt |
| `CLAIM` | Claim / catch |
| `PUNCH` | Punch clear |
| `PICK_UP` | Pick up ball |
| `SMOTHER` | Smother at feet |
| `KEEPER_SWEEP` | Sweeper keeper action |

## Event Structure

Every event shares a common base:

```python
class Event:
    event_id: str                    # Unique event ID
    event_type: EventType            # One of the 13 canonical types
    result: Optional[ResultType]     # Type-specific result enum
    qualifiers: List[Qualifier]      # Additional context
    period: Period                    # Match period (1H, 2H, etc.)
    timestamp: timedelta             # Time within the period
    ball_owning_team: Optional[Team] # Team in possession
    ball_state: Optional[BallState]  # ALIVE, DEAD
    team: Team                       # Team performing the action
    player: Optional[Player]        # Player performing the action
    coordinates: Optional[Point]    # Location on the pitch
    end_coordinates: Optional[Point] # End location (passes, carries)
    receiver_player: Optional[Player] # Pass recipient
    raw_event: dict                  # Original provider data preserved
    related_events: List[Event]      # Linked events
```

### Accessing Qualifiers

```python
from kloppy.domain import SetPieceQualifier, BodyPartQualifier

for event in dataset.events:
    # Check if event is from a set piece
    set_piece = event.get_qualifier_value(SetPieceQualifier)
    if set_piece == SetPieceQualifier.CORNER_KICK:
        print(f"Corner kick by {event.player.name}")

    # Check body part
    body_part = event.get_qualifier_value(BodyPartQualifier)
    if body_part == BodyPartQualifier.HEAD:
        print(f"Header by {event.player.name}")
```

## Coordinate System

kloppy abstracts coordinate systems through the `CoordinateSystem` class.

### Properties

| Property | Description |
|---|---|
| `origin` | Where (0,0) is on the pitch |
| `vertical_orientation` | Which direction Y increases |
| `pitch_dimensions` | Width and height in the coordinate system's units |

### Built-in Coordinate Systems

| System | Dimensions | Origin | Y Direction |
|---|---|---|---|
| `kloppy` | 105 x 68 | Bottom-left | Up |
| `opta` | 100 x 100 | Bottom-left | Up |
| `wyscout` | 100 x 100 | Top-left | Down |
| `statsbomb` | 120 x 80 | Top-left | Down |
| `secondspectrum` | 105 x 68 | Centre | Up |
| `tracab` | 10500 x 6800 | Centre | Up (centimetres) |
| `metrica` | 1 x 1 | Bottom-left | Up (normalised) |
| `sportec` | 105 x 68 | Bottom-left | Up |
| `skillcorner` | 105 x 68 | Centre | Up |
| `datafactory` | 100 x 100 | Bottom-left | Up |

### Transforming Coordinates

```python
from kloppy.domain import TransformationModel

# Transform to kloppy's standard system
dataset = dataset.transform(
    to_pitch_dimensions=PitchDimensions(x_dim=Dimension(0, 105), y_dim=Dimension(0, 68)),
    to_orientation="FIXED_HOME_AWAY"
)

# Or use a named coordinate system
from kloppy.helpers import to_pandas
df = to_pandas(dataset, additional_columns={"coordinates_x": lambda e: e.coordinates.x})
```

### Orientation

| Orientation | Description |
|---|---|
| `FIXED_HOME_AWAY` | Home team always attacks left-to-right in both halves |
| `ACTION_EXECUTING_TEAM` | Attacking team always goes left-to-right (like Opta/Wyscout raw) |
| `HOME_TEAM` | Home team's perspective throughout |
| `AWAY_TEAM` | Away team's perspective throughout |
| `BALL_OWNING_TEAM` | Ball-owning team always goes left-to-right |
| `STATIC_HOME_AWAY` | Home attacks right in 1H, left in 2H (physical pitch) |

## Dataset Structure

The top-level `EventDataset` holds everything:

```python
class EventDataset:
    metadata: Metadata            # Match info, teams, players, periods
    events: List[Event]           # All events in chronological order
    coordinate_system: CoordinateSystem
```

### Metadata

```python
class Metadata:
    teams: List[Team]             # Home team first
    periods: List[Period]         # Match periods
    pitch_dimensions: PitchDimensions
    orientation: Orientation
    frame_rate: Optional[float]   # For tracking data
    provider: Provider            # OPTA, STATSBOMB, WYSCOUT, etc.
    flags: DatasetFlags           # What's included (e.g., BALL_OWNING_TEAM)
```

### Team & Player

```python
class Team:
    team_id: str
    name: str
    ground: Ground                # HOME or AWAY
    starting_formation: Optional[FormationType]
    players: List[Player]

class Player:
    player_id: str
    name: str
    team: Team
    jersey_no: Optional[int]
    position: Optional[Position]  # GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD
    starting: bool                # In starting XI
```

### Period

```python
class Period:
    id: int                       # 1, 2, 3 (ET1), 4 (ET2), 5 (penalties)
    start_timestamp: timedelta
    end_timestamp: timedelta
```

## Tracking Data Model

For tracking/positional data (e.g., TRACAB, Second Spectrum, SkillCorner):

```python
class Frame:
    frame_id: int
    timestamp: timedelta
    ball_coordinates: Optional[Point3D]  # x, y, z
    players_data: Dict[Player, PlayerData]
    period: Period

class PlayerData:
    coordinates: Point            # x, y position
    speed: Optional[float]        # m/s
    distance: Optional[float]     # cumulative distance
```

`TrackingDataset` is analogous to `EventDataset` but contains `Frame` objects instead of `Event` objects.
