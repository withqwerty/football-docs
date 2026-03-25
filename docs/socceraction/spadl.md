# SPADL (Soccer Player Action Description Language)

A standardised action format from the DTAI Sports Analytics Lab. Converts provider-specific event streams into a unified representation for cross-provider analysis.

## Action attributes

Every action in SPADL has 12 attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| game_id | int | Match identifier |
| period_id | int | Game period (1=first half, 2=second half) |
| seconds | float | Timestamp in seconds from period start |
| player | string | Player performing the action |
| team | string | Player's team |
| start_x | float | Starting X coordinate (0-105m) |
| start_y | float | Starting Y coordinate (0-68m) |
| end_x | float | Ending X coordinate (0-105m) |
| end_y | float | Ending Y coordinate (0-68m) |
| action_type | string | One of 22 types (see below) |
| result | string | success, fail, offside, own_goal, yellow_card, red_card |
| bodypart | string | foot, head, other, none |

## Coordinate system

- Pitch dimensions: 105m x 68m
- Origin: bottom-left corner
- X-axis: 0 = own goal line, 105 = opponent's goal line
- Y-axis: 0 = bottom touchline, 68 = top touchline
- Use `play_left_to_right()` to standardise attack direction

## Action types (22)

| Type | Description |
|------|-------------|
| pass | Short or medium pass |
| cross | Cross into the box |
| throw_in | Throw-in |
| freekick_crossed | Free kick crossed into the box |
| freekick_short | Short free kick pass |
| corner_crossed | Corner kick crossed |
| corner_short | Short corner |
| take_on | Dribble attempt past opponent |
| foul | Foul committed |
| tackle | Tackle attempt |
| interception | Intercepting opponent's pass |
| shot | Shot at goal |
| shot_penalty | Penalty kick |
| shot_freekick | Direct free kick shot |
| keeper_save | Goalkeeper save |
| keeper_claim | Goalkeeper claims the ball |
| keeper_punch | Goalkeeper punches the ball |
| keeper_pick_up | Goalkeeper picks up the ball |
| clearance | Defensive clearance |
| bad_touch | Miscontrol / bad touch |
| non_action | Non-action filler event |
| dribble | Successful carry (ball movement without pass) |
| goalkick | Goal kick |

## Result values

| Result | Description |
|--------|-------------|
| success | Action completed successfully |
| fail | Action failed |
| offside | Offside |
| own_goal | Own goal scored |
| yellow_card | Yellow card received |
| red_card | Red card received |

## Atomic-SPADL

A variant that removes the `result` attribute and splits compound actions into separate initiation and completion events.

- A pass becomes two actions: "pass" (by the passer) and "receival" (by the receiver)
- Uses 11 attributes: single x/y position plus dx/dy deltas instead of start/end pairs
- Enables finer-grained player attribution (credit passer and receiver separately)

## Converting from providers

```python
import socceraction.spadl as spadl

# From StatsBomb
from socceraction.data.statsbomb import StatsBombLoader
loader = StatsBombLoader(getter="remote", creds={"user": "", "passwd": ""})
events = loader.events(game_id=12345)
actions = spadl.statsbomb.convert_to_actions(events, home_team_id=123)

# From Wyscout
from socceraction.data.wyscout import PublicWyscoutLoader
loader = PublicWyscoutLoader()
events = loader.events(game_id=12345)
actions = spadl.wyscout.convert_to_actions(events, home_team_id=123)

# From Opta
from socceraction.data.opta import OptaLoader
loader = OptaLoader(root="path/to/f24/files", parser="xml")
events = loader.events(game_id=12345)
actions = spadl.opta.convert_to_actions(events, home_team_id=123)

# From any kloppy-supported provider
from socceraction.spadl.kloppy import convert_to_actions
import kloppy
dataset = kloppy.load_statsbomb(event_data=..., lineup_data=...)
actions = convert_to_actions(dataset)
```
