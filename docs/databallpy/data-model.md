# DataBallPy Data Model

## Game Object

The `Game` dataclass is the central object, holding tracking data, event data, and match metadata.

**Key attributes**:

| Attribute | Type | Description |
|---|---|---|
| `tracking_data` | `TrackingData` | Custom pandas DataFrame subclass |
| `event_data` | `EventData` | Custom pandas DataFrame subclass |
| `pitch_dimensions` | `list[float]` | [length, width] in metres (typically [106.0, 68.0]) |
| `periods` | `pd.DataFrame` | Start/end frames and datetimes for periods 1-5 |
| `home_team_id` | `int` | |
| `home_team_name` | `str` | |
| `home_players` | `pd.DataFrame` | Player info (see PlayersSchema) |
| `home_score` | `int` | |
| `home_formation` | `str` | |
| `away_team_id` | `int` | |
| `away_team_name` | `str` | |
| `away_players` | `pd.DataFrame` | |
| `away_score` | `int` | |
| `away_formation` | `str` | |
| `country` | `str \| None` | |
| `shot_events` | `pd.DataFrame` | Typed shot events |
| `dribble_events` | `pd.DataFrame` | Typed dribble events |
| `pass_events` | `pd.DataFrame` | Typed pass events |

**Key methods**: `synchronise_tracking_and_event_data()`, `get_column_ids()`, `get_event()`, `get_frames()`, `get_event_frame()`, `save_game()`, `copy()`.

**Key properties**: `is_synchronised`, `tracking_timestamp_is_precise`, `event_timestamp_is_precise`, `date`, `name`.

## TrackingData

Custom `pd.DataFrame` subclass with extra attributes: `provider: str`, `frame_rate: int|float`.

**Required columns** (validated by Pandera schema):

| Column | Type | Description |
|---|---|---|
| `frame` | int (unique) | Frame number |
| `datetime` | datetime | Timestamp |
| `ball_x` | float | Ball x position (metres from centre) |
| `ball_y` | float | Ball y position (metres from centre) |
| `ball_z` | float | Ball height |
| `ball_status` | str | `"alive"` or `"dead"` |
| `team_possession` | str | Which team has possession |

**Player columns** follow the pattern: `home_1_x`, `home_1_y`, `away_3_x`, `away_3_y`, etc. Player IDs map to the `home_players` / `away_players` DataFrames on the Game object.

**Added columns** (from preprocessing methods):
- `{col_id}_vx`, `{col_id}_vy` -- velocity (from `add_velocity()`)
- `{col_id}_ax`, `{col_id}_ay` -- acceleration (from `add_acceleration()`)
- `event_id`, `databallpy_event`, `sync_certainty` -- after synchronization

## EventData

Custom `pd.DataFrame` subclass with extra attribute: `provider: str`.

**Required columns** (validated by Pandera schema):

| Column | Type | Description |
|---|---|---|
| `event_id` | int (unique) | Event identifier |
| `databallpy_event` | str (nullable) | One of: `"pass"`, `"shot"`, `"dribble"`, `"tackle"`, `"own_goal"` |
| `period_id` | int | Period number |
| `minutes` | int | Minute of event |
| `seconds` | int | Second within minute |
| `player_id` | int | Player identifier |
| `player_name` | str | |
| `team_id` | int | |
| `is_successful` | bool | |
| `start_x` | float | Range: -60 to 60 |
| `start_y` | float | Range: -45 to 45 |
| `datetime` | datetime | Timestamp |
| `original_event_id` | str | Provider's event ID |
| `original_event` | str | Provider's event type name |

**Optional columns**: `end_x`, `end_y`, `to_player_id`, `to_player_name`, `event_type_id`, `team_name`.

**Added columns after synchronization**: `tracking_frame`, `sync_certainty`.

## PlayersSchema

| Column | Type | Constraints |
|---|---|---|
| `id` | int | Unique |
| `full_name` | str | Unique |
| `shirt_num` | int | Unique, 0-100 |
| `position` | str | goalkeeper / defender / midfielder / forward / unspecified |
| `start_frame` | int | |
| `end_frame` | int | |
| `starter` | bool | |

## Event Classes

All event classes are dataclasses in `databallpy/events/` with strict validation.

### IndividualCloseToBallEvent (base)

Fields: `event_id`, `period_id`, `minutes`, `seconds`, `datetime`, `start_x`, `start_y`, `team_id`, `team_side`, `pitch_size`, `player_id`, `jersey`, `outcome`, `related_event_id`.

### IndividualOnBallEvent (extends base)

Adds: `body_part`, `possession_type`, `set_piece`, plus computed `xt` (expected threat) property.

**body_part values**: `right_foot`, `left_foot`, `foot`, `head`, `other`, `unspecified`.

**set_piece values**: `goal_kick`, `free_kick`, `throw_in`, `corner_kick`, `kick_off`, `penalty`, `no_set_piece`, `unspecified`.

**possession_type values**: `open_play`, `counter_attack`, `corner_kick`, `free_kick`, `throw_in`, `penalty`, `kick_off`, `goal_kick`, `rebound`, `unspecified`.

### ShotEvent

Extends `IndividualOnBallEvent`. Adds: `outcome_str`, `y_target`, `z_target`, `first_touch`, `ball_goal_distance`, `shot_angle`, `xg` (auto-computed).

**outcome_str values**: `goal`, `miss_off_target`, `miss_hit_post`, `miss_on_target`, `blocked`, `own_goal`, `miss`, `unspecified`.

xG model: logistic regression on distance and angle, with separate models for foot/head/free_kick/penalty. Penalty xG = 0.79.

### PassEvent

Extends `IndividualOnBallEvent`. Adds: `outcome_str`, `end_x`, `end_y`, `pass_type`, `receiver_player_id`.

**outcome_str values**: `successful`, `unsuccessful`, `offside`, `results_in_shot`, `assist`, `fair_play`, `unspecified`.

**pass_type values**: `long_ball`, `cross`, `through_ball`, `chipped`, `lay-off`, `lounge`, `flick_on`, `pull_back`, `switch_off_play`, `unspecified`.

### DribbleEvent

Extends `IndividualOnBallEvent`. Adds: `duel_type` (offensive/defensive/unspecified), `with_opponent` (bool).

### TackleEvent

Extends `IndividualCloseToBallEvent`. No additional fields.

## Expected Threat (xT)

Karun Singh model with pre-computed lookup tables for open play, free kicks, and throw-ins. Auto-computed as `xt` property on all `IndividualOnBallEvent` subclasses.

Special values: penalty = 0.797, corner kick = 0.049, goal kick = 0.0, kick off = 0.001.

## Missing Values

`MISSING_INT = -999` is used as a sentinel for missing integers throughout the codebase.
