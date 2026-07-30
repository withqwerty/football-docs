# kloppy Data Model

## Overview

kloppy is a Python library that provides a **unified data model** for football event and tracking data. It abstracts away provider-specific formats (Opta, StatsBomb, Wyscout, WhoScored, etc.) into a canonical set of event types, coordinate systems, and data structures.

Repository: https://github.com/kloppy-project/kloppy

## Canonical Event Types

kloppy defines **19 canonical event types** that all provider events map to:

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
| `SUBSTITUTION` | `SubstitutionEvent` | A player is substituted off and replaced by another player |
| `CARD` | `CardEvent` | A player receives a card |
| `PLAYER_ON` | `PlayerOnEvent` | A player returns to the pitch after a `PLAYER_OFF` event |
| `PLAYER_OFF` | `PlayerOffEvent` | A player goes/is carried off the pitch without a substitution |
| `RECOVERY` | `RecoveryEvent` | A player gathers a loose ball and gains possession for their team |
| `PRESSURE` | `PressureEvent` | A player pressures an opponent to force a mistake |

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
| `OWN_GOAL` | Shot resulted in an own goal |

#### TakeOnResult

| Value | Description |
|---|---|
| `COMPLETE` | Successful dribble |
| `INCOMPLETE` | Failed dribble, lost possession |
| `OUT` | Ball went out of play during the take-on |

#### DuelResult

| Value | Description |
|---|---|
| `WON` | Won the duel (player touching the ball first) |
| `LOST` | Lost the duel (opponent touches the ball first) |
| `NEUTRAL` | Neither player won the duel (mainly for Wyscout v2) |

#### InterceptionResult

| Value | Description |
|---|---|
| `SUCCESS` | Successfully intercepted |
| `LOST` | Interception attempt failed |
| `OUT` | Interception knocked the ball out of play |

Note: `GoalkeeperEvent` has no `result` property (its `result` is always `None`) -- there is no `GoalkeeperActionResult` enum in kloppy.

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
| `RIGHT_FOOT` | Pass, shot, or (for goalkeepers) save with the right foot |
| `LEFT_FOOT` | Pass, shot, or (for goalkeepers) save with the left foot |
| `HEAD` | Pass, shot, or (for goalkeepers) save with the head |
| `OTHER` | Other body part (chest, back, etc.), for pass and shot |
| `HEAD_OTHER` | Pass or shot with head or other body part (used when the provider does not distinguish `HEAD` from `OTHER`) |
| `BOTH_HANDS` | Goalkeeper only. Save with both hands |
| `CHEST` | Goalkeeper only. Save with chest |
| `LEFT_HAND` | Goalkeeper only. Save with left hand |
| `RIGHT_HAND` | Goalkeeper only. Save with right hand |
| `DROP_KICK` | Pass is a keeper drop kick |
| `KEEPER_ARM` | Pass thrown from the keeper's hands |
| `NO_TOUCH` | Pass only. A player deliberately let the pass go past them instead of receiving it (a "dummy") |

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
| `LONG_BALL` | A pass that travels at least 32 metres |
| `THROUGH_BALL` | Through ball, played into space behind the defence |
| `CHIPPED_PASS` | Chipped pass, lifted into the air |
| `SWITCH_OF_PLAY` | Any pass which crosses the centre zone and travels more than 50% of the pitch width |
| `LAUNCH` | A long forward pass with no specific target |
| `HEAD_PASS` | Headed pass |
| `HIGH_PASS` | High/lofted pass |
| `HAND_PASS` | Goalkeeper hand pass |
| `SMART_PASS` | Creative, penetrative pass attempting to break defensive lines |
| `SIMPLE_PASS` | A standard pass without complex manoeuvres |
| `FLICK_ON` | A pass where a player flicks the ball on towards a teammate, usually with their head |
| `SHOT_ASSIST` | A pass leading directly to a shot attempt (not necessarily a goal) |
| `ASSIST` | A pass leading directly to a goal |
| `ASSIST_2ND` | A pass leading to another pass which then leads to a goal |

### GoalkeeperQualifier

| Value | Description |
|---|---|
| `SAVE` | Goalkeeper faces a shot and saves |
| `CLAIM` | Goalkeeper catches a cross |
| `PUNCH` | Goalkeeper punches ball clear |
| `PICK_UP` | Goalkeeper picks up the ball |
| `SMOTHER` | Goalkeeper comes out to dispossess a player (equivalent to a tackle for an outfield player) |
| `REFLEX` | Goalkeeper performs a reflex save |
| `SAVE_ATTEMPT` | Goalkeeper attempts to save a shot |

## Event Structure

Every event shares a common base:

```python
class Event:
    event_id: str                    # Unique event ID
    event_type: EventType            # One of the 19 canonical types
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
| `kloppy` | 1 x 1 | Top-left | Down (normalised) |
| `opta` | 100 x 100 | Bottom-left | Up |
| `wyscout` | 100 x 100 | Top-left | Down |
| `statsbomb` | 120 x 80 | Top-left | Down |
| `secondspectrum` | 105 x 68 | Centre | Up |
| `tracab` | 10500 x 6800 | Centre | Up (centimetres) |
| `metrica` | 1 x 1 | Top-left | Down (normalised) |
| `sportec` | 105 x 68 | Bottom-left | Up |
| `skillcorner` | 105 x 68 | Centre | Up |
| `datafactory` | 2 x 2 | Centre | Down (normalised) |

### Transforming Coordinates

```python
from kloppy.domain import MetricPitchDimensions, Dimension

# Transform to kloppy's standard system
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

# Or export with additional derived columns
df = dataset.to_df(engine="pandas", coordinates_x=lambda e: e.coordinates.x)
```

### Orientation

| Orientation | Description |
|---|---|
| `BALL_OWNING_TEAM` | The team currently in possession always attacks left-to-right |
| `ACTION_EXECUTING_TEAM` | The team executing the action always attacks left-to-right (event data only; equivalent to `BALL_OWNING_TEAM` for tracking data) |
| `HOME_AWAY` | Home team attacks left-to-right in the first period, away team in the second |
| `AWAY_HOME` | Away team attacks left-to-right in the first period, home team in the second |
| `STATIC_HOME_AWAY` | Home team attacks left-to-right in both periods (physical pitch) |
| `STATIC_AWAY_HOME` | Away team attacks left-to-right in both periods (physical pitch) |
| `NOT_SET` | Attacking direction is not defined |

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
    position: Optional[Position]  # PositionType has 33 members, e.g. Goalkeeper,
                                  # LeftBack, CenterDefensiveMidfield, Striker
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
