# Wyscout v3 Event Types

Wyscout uses a **primary type + secondary type** system. Each event has a `type` object with `primary` and `secondary` fields, both containing `id` and `name`.

## Primary Event Types

| Primary Type ID | Name | Description |
|---|---|---|
| `pass` | Pass | Any pass attempt (short, long, cross, through ball, key pass, assist) |
| `shot` | Shot | Any shot attempt (on target, off target, blocked, post) |
| `duel` | Duel | Any 1v1 contest (aerial, ground attacking, ground defending, ground loose ball) |
| `free_kick` | Free Kick | Free kicks, corners, goal kicks, throw-ins, penalties |
| `touch` | Touch | Ball touch events (clearance, interception, acceleration) |
| `goalkeeper` | Goalkeeper | Goalkeeper-specific actions (save, punch, drop, pick-up) |
| `infraction` | Infraction | Fouls and handballs |
| `others_on_the_ball` | Others On The Ball | Other on-ball events not covered above |
| `game_interruption` | Game Interruption | Stoppages (injury, referee stop, etc.) |

## Secondary Event Types by Primary Type

### Pass Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `simple_pass` | Simple Pass | Short ground pass |
| `launch` | Launch | Long ball (typically > 32m) |
| `cross` | Cross | Cross into the box |
| `smart_pass` | Smart Pass | Creative pass that breaks defensive lines |
| `head_pass` | Head Pass | Header pass |
| `hand_pass` | Hand Pass | Goalkeeper hand pass / throw |
| `high_pass` | High Pass | Lofted pass |
| `goal_kick` | Goal Kick | Goal kick distribution (also under free_kick primary) |

### Shot Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `shot` | Shot | Standard shot |
| `head_shot` | Head Shot | Header on goal |

### Duel Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `aerial_duel` | Aerial Duel | Header contest |
| `ground_attacking_duel` | Ground Attacking Duel | Attacker in 1v1 ground duel |
| `ground_defending_duel` | Ground Defending Duel | Defender in 1v1 ground duel |
| `ground_loose_ball_duel` | Ground Loose Ball Duel | 50/50 contest for loose ball |

### Free Kick Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `free_kick` | Free Kick | Direct/indirect free kick |
| `free_kick_cross` | Free Kick Cross | Free kick delivered as a cross |
| `corner` | Corner | Corner kick |
| `goal_kick` | Goal Kick | Goal kick |
| `throw_in` | Throw In | Throw-in |
| `penalty` | Penalty | Penalty kick |
| `free_kick_shot` | Free Kick Shot | Shot from a free kick |

### Touch Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `clearance` | Clearance | Defensive clearance |
| `interception` | Interception | Intercepting a pass |
| `acceleration` | Acceleration | Ball carry / acceleration with ball |
| `touch` | Touch | Generic ball touch |

### Goalkeeper Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `save_attempt` | Save Attempt | Goalkeeper save |
| `punch` | Punch | Goalkeeper punch |
| `goalkeeper_pick_up` | Goalkeeper Pick Up | Goalkeeper picks up ball |
| `keeper_sweeper` | Keeper Sweeper | Goalkeeper comes off line |

### Infraction Secondary Types

| Secondary Type ID | Name | Description |
|---|---|---|
| `foul` | Foul | Foul committed |
| `hand_foul` | Hand Foul | Handball |
| `late_card_foul` | Late Card Foul | Foul shown card after play |
| `out_of_game_foul` | Out Of Game Foul | Foul off the ball |
| `protest` | Protest | Yellow card for dissent |
| `simulation` | Simulation | Dive / simulation |
| `time_lost_foul` | Time Lost Foul | Time wasting |
| `violent_foul` | Violent Foul | Violent conduct |

## Event Properties

Every Wyscout v3 event includes:

```json
{
  "id": 123456789,
  "matchId": 5012345,
  "matchPeriod": "1H",
  "second": 245.6,
  "videoTimestamp": "00:04:05",
  "team": { "id": 123, "name": "Team Name" },
  "player": { "id": 456, "name": "Player Name" },
  "type": {
    "primary": { "id": "pass", "name": "Pass" },
    "secondary": { "id": "cross", "name": "Cross" }
  },
  "location": { "x": 72.5, "y": 34.2 },
  "possession": { "id": 789, "team": { "id": 123 }, "types": ["positional_attack"] },
  "groundPressure": true,
  "aerialDuel": false
}
```

## Shot-specific Properties

```json
{
  "shot": {
    "isGoal": true,
    "onTarget": true,
    "goalZone": "gc",
    "xg": 0.15,
    "postShotXg": 0.82,
    "bodyPart": "right_foot",
    "goalMouthLocation": { "y": 45.2, "z": 22.1 }
  }
}
```

### Goal Zones

| Code | Zone |
|---|---|
| `gc` | Goal centre |
| `gl` | Goal left |
| `gr` | Goal right |
| `ghl` | Goal high left |
| `ghc` | Goal high centre |
| `ghr` | Goal high right |
| `obr` | Out bottom right |
| `obl` | Out bottom left |
| `otr` | Out top right |
| `otl` | Out top left |
| `bc` | Blocked centre |

## Pass-specific Properties

```json
{
  "pass": {
    "accurate": true,
    "angle": 24.5,
    "length": 18.3,
    "height": "ground",
    "endLocation": { "x": 85.1, "y": 42.0 },
    "recipient": { "id": 789, "name": "Recipient Name" }
  }
}
```

## Possession Types

Each event includes a `possession` object with attack classification:

| Type | Description |
|---|---|
| `positional_attack` | Build-up play, patient attack |
| `counter_attack` | Fast transition after winning ball |
| `set_piece_attack` | Attack from a set piece |
| `free_kick_attack` | Attack from a free kick |
| `corner_attack` | Attack from a corner |
| `throw_in_attack` | Attack from a throw-in |
| `goal_kick_attack` | Attack from a goal kick |
| `penalty_attack` | Penalty situation |

## v2 vs v3 Type ID Differences

In Wyscout **v2**, primary types used numeric IDs:

| v2 ID | v3 ID | Name |
|---|---|---|
| 1 | `duel` | Duel |
| 2 | `free_kick` | Free Kick |
| 3 | `goalkeeper` | Goalkeeper |
| 7 | `others_on_the_ball` | Others On The Ball |
| 8 | `pass` | Pass |
| 9 | `infraction` | Infraction |
| 10 | `shot` | Shot |

v3 switched to string-based IDs for both primary and secondary types and restructured the type hierarchy significantly. The v2 `subeventId` (numeric) was replaced by the `type.secondary` object.
