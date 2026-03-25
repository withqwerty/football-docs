# StatsBomb Event Types

StatsBomb uses named event types with numeric IDs. Every event in a match has a `type` object with `id` and `name` fields. Events also carry type-specific nested objects (e.g. a Shot event has a `shot` object with outcome, xG, freeze frame, etc.).

## Event Type Reference

| ID | Name | Description |
|----|------|-------------|
| 2 | Ball Recovery | Player regains possession from a loose ball |
| 3 | Dispossessed | Player loses the ball through opponent action (not a failed dribble) |
| 4 | Duel | Contested situation between two players (aerial or ground) |
| 6 | Block | Player blocks a shot, pass, or cross |
| 8 | Offside | Player caught in an offside position |
| 9 | Clearance | Defensive action to remove the ball from a dangerous area |
| 10 | Interception | Player intercepts an opponent's pass |
| 14 | Dribble | Attempt to beat an opponent with the ball (success or failure) |
| 16 | Shot | Attempt on goal |
| 17 | Pressure | Player applies pressure on an opponent in possession |
| 18 | Half Start | Marks the start of each half/period |
| 19 | Substitution | Player substitution |
| 21 | Foul Won | Player wins a foul from an opponent |
| 22 | Foul Committed | Player commits a foul |
| 23 | Goal Keeper | Goalkeeper-specific actions (saves, punches, claims, etc.) |
| 24 | Bad Behaviour | Disciplinary action not linked to a foul (e.g. dissent) |
| 26 | Player On | Player enters the pitch (substitution on) |
| 27 | Player Off | Player leaves the pitch (substitution off) |
| 28 | Shield | Player shields the ball from an opponent |
| 30 | Pass | Any pass between players, including crosses, through balls, etc. |
| 33 | 50/50 | Contested loose ball between two players |
| 34 | Half End | Marks the end of each half/period |
| 35 | Starting XI | Starting lineup announcement (one per team per match) |
| 36 | Tactical Shift | Formation or positional change during play |
| 38 | Miscontrol | Player fails to control the ball cleanly |
| 39 | Dribbled Past | Player is beaten by an opponent's dribble |
| 40 | Injury Stoppage | Play stopped due to injury |
| 42 | Ball Receipt* | Player receives a pass (the asterisk is part of the name) |
| 43 | Carry | Player moves with the ball at their feet between events |

---

## Common Event Fields

Every event shares these base fields:

```json
{
  "id": "uuid-string",
  "index": 192,
  "period": 1,
  "timestamp": "00:04:40.798",
  "minute": 4,
  "second": 40,
  "type": { "id": 16, "name": "Shot" },
  "possession": 14,
  "possession_team": { "id": 779, "name": "Argentina" },
  "play_pattern": { "id": 1, "name": "Regular Play" },
  "team": { "id": 779, "name": "Argentina" },
  "player": { "id": 27886, "name": "Alexis Mac Allister" },
  "position": { "id": 15, "name": "Left Center Midfield" },
  "location": [92.4, 30.0],
  "duration": 0.94819,
  "related_events": ["uuid-of-related-event"],
  "under_pressure": true
}
```

- `id` -- UUID v4, globally unique
- `index` -- sequential index within the match (1-based)
- `period` -- 1 = first half, 2 = second half, 3 = first extra, 4 = second extra, 5 = penalties
- `timestamp` -- time within the period (HH:MM:SS.mmm)
- `minute` / `second` -- match clock time
- `possession` -- possession sequence number (increments each time possession changes)
- `possession_team` -- team that has possession during this event
- `play_pattern` -- how the current possession began
- `location` -- [x, y] in StatsBomb coordinates (120x80 yards)
- `duration` -- event duration in seconds (0.0 for instantaneous events)
- `related_events` -- UUIDs of causally linked events (e.g. pass -> receipt)
- `under_pressure` -- boolean, present and true when a defender is applying pressure

---

## Play Patterns

| ID | Name |
|----|------|
| 1 | Regular Play |
| 2 | From Corner |
| 3 | From Free Kick |
| 4 | From Throw In |
| 5 | Other |
| 6 | From Counter |
| 7 | From Goal Kick |
| 8 | From Keeper |
| 9 | From Kick Off |

---

## Shot (type_id: 16)

The `shot` object is nested within shot events.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `statsbomb_xg` | float | StatsBomb expected goals value (0.0 to 1.0) |
| `end_location` | [x, y] or [x, y, z] | Where the shot ended up. Z is height in yards (present for shots that leave the ground) |
| `key_pass_id` | string | UUID of the pass that assisted this shot |
| `technique` | object | How the shot was struck |
| `body_part` | object | Which body part was used |
| `type` | object | How the shot originated |
| `outcome` | object | Result of the shot |
| `first_time` | boolean | Whether the shot was taken first-time |
| `freeze_frame` | array | Positions of all visible players at the moment of the shot |
| `one_on_one` | boolean | Whether the shooter was one-on-one with the keeper |
| `open_goal` | boolean | Whether the goal was unguarded |
| `follows_dribble` | boolean | Whether the shot followed a successful dribble |
| `redirect` | boolean | Whether the shot was a deflection/redirect |
| `saved_to_post` | boolean | Whether the keeper saved onto the post |
| `saved_off_target` | boolean | Whether the keeper saved to a position off target |

### Shot Techniques

| ID | Name |
|----|------|
| 89 | Backheel |
| 90 | Diving Header |
| 91 | Half Volley |
| 92 | Lob |
| 93 | Normal |
| 94 | Overhead Kick |
| 95 | Volley |

### Shot Body Parts

| ID | Name |
|----|------|
| 37 | Head |
| 38 | Left Foot |
| 40 | Right Foot |
| 70 | No Touch |

### Shot Types

| ID | Name |
|----|------|
| 61 | Corner |
| 62 | Free Kick |
| 87 | Open Play |
| 88 | Penalty |
| 65 | Kick Off |

### Shot Outcomes

| ID | Name |
|----|------|
| 96 | Blocked |
| 97 | Goal |
| 98 | Off T | (Off Target)
| 99 | Post |
| 100 | Saved |
| 101 | Wayward |
| 115 | Saved Off Target |
| 116 | Saved to Post |

### Shot Freeze Frame

Each entry in `freeze_frame` contains:

```json
{
  "location": [101.0, 48.0],
  "player": { "id": 6704, "name": "Theo Hernandez" },
  "position": { "id": 6, "name": "Left Back" },
  "teammate": false
}
```

This is the per-shot freeze frame (available on all shots). Separate from the 360 freeze frame data which covers all events.

---

## Pass (type_id: 30)

The `pass` object is nested within pass events.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `recipient` | object | Player receiving the pass |
| `length` | float | Pass distance in yards |
| `angle` | float | Pass angle in radians |
| `height` | object | Pass height classification |
| `end_location` | [x, y] | Where the pass was received/ended |
| `assisted_shot_id` | string | UUID of the shot this pass assisted |
| `shot_assist` | boolean | Whether this pass led to a shot |
| `goal_assist` | boolean | Whether this pass directly assisted a goal |
| `cross` | boolean | Whether this pass is a cross |
| `switch` | boolean | Whether this pass switches play to the other side |
| `cut_back` | boolean | Whether this is a cut-back pass |
| `body_part` | object | Body part used |
| `type` | object | Type of pass |
| `outcome` | object | Result of the pass (absent if pass was complete) |
| `technique` | object | Pass technique |
| `through_ball` | boolean | Whether this is a through ball |
| `no_touch` | boolean | Player intended the ball to run through |
| `miscommunication` | boolean | Pass and recipient miscommunicated |
| `backheel` | boolean | Whether the pass was a backheel |

### Pass Types

| ID | Name |
|----|------|
| 61 | Corner |
| 62 | Free Kick |
| 63 | Goal Kick |
| 64 | Interception |
| 65 | Kick Off |
| 66 | Recovery |
| 67 | Throw-in |

Note: Regular open-play passes have no `type` field.

### Pass Heights

| ID | Name |
|----|------|
| 1 | Ground Pass |
| 2 | Low Pass |
| 3 | High Pass |

### Pass Outcomes

| ID | Name |
|----|------|
| 9 | Incomplete |
| 74 | Out |
| 75 | Pass Offside |
| 76 | Unknown |
| 77 | Injury Clearance |

A successful pass has **no** `outcome` field. The absence of `outcome` means the pass was completed.

---

## Carry (type_id: 43)

Carries represent a player moving with the ball between two other events. StatsBomb infers carries -- they are not manually tagged.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `end_location` | [x, y] | Where the carry ended |

The carry `location` is where the preceding event ended (e.g. ball receipt location), and `end_location` is where the next event begins.

---

## Dribble (type_id: 14)

A dribble is an attempt to beat a defender.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `outcome` | object | Whether the dribble succeeded |
| `overrun` | boolean | Whether the player overran the ball |
| `nutmeg` | boolean | Whether the player nutmegged the defender |
| `no_touch` | boolean | Whether the player used a no-touch dribble |

### Dribble Outcomes

| ID | Name |
|----|------|
| 8 | Complete |
| 9 | Incomplete |

---

## Duel (type_id: 4)

A contest between two players.

### Duel Types

| ID | Name |
|----|------|
| 10 | Aerial Lost |
| 11 | Aerial Won |
| 16 | Lost |
| 17 | Won |

The type encodes both the duel category (aerial vs ground/tackle) and the outcome.

---

## Pressure (type_id: 17)

Defensive pressure applied to a player on the ball. Pressure events have `location` and `duration` but no nested object -- they are simple positional records.

Pressure events are used by StatsBomb to flag `under_pressure` on the corresponding on-ball event. They are linked via `related_events`.

---

## Goal Keeper (type_id: 23)

The `goalkeeper` object contains keeper-specific action details.

### Goalkeeper Types

| ID | Name |
|----|------|
| 25 | Collected |
| 27 | Keeper Pick-Up |
| 28 | Keeper Sweep |
| 31 | Punch |
| 33 | Shot Saved |
| 34 | Shot Saved Off Target |
| 35 | Shot Saved to Post |
| 37 | Smother |
| 44 | Goal Conceded |
| 57 | Shot Faced |

### Goalkeeper Body Parts

| ID | Name |
|----|------|
| 35 | Both Hands |
| 36 | Chest |
| 37 | Head |
| 38 | Left Foot |
| 39 | Left Hand |
| 40 | Right Foot |
| 41 | Right Hand |
| 69 | No Touch |

### Goalkeeper Techniques

| ID | Name |
|----|------|
| 45 | Diving |
| 46 | Standing |

### Goalkeeper Outcomes

| ID | Name |
|----|------|
| 1 | Claim |
| 15 | Success |
| 16 | Success In Play |
| 17 | Success Out |
| 47 | Clear |
| 48 | Fail |
| 49 | In Play |
| 50 | In Play Danger |
| 51 | In Play Safe |
| 52 | No Touch |
| 53 | Punched Out |
| 55 | Touched In |
| 56 | Touched Out |
| 58 | Won |

---

## Interception (type_id: 10)

### Interception Outcomes

| ID | Name |
|----|------|
| 4 | Won |
| 15 | Success |
| 16 | Success In Play |
| 17 | Success Out |

---

## Block (type_id: 6)

### Block Fields

| Field | Type | Description |
|-------|------|-------------|
| `deflection` | boolean | Whether the block deflected the ball |
| `offensive` | boolean | Whether this was an offensive block |
| `save_block` | boolean | Whether this block prevented a goal |
| `counterpress` | boolean | Whether this block was part of a counterpress |

---

## Ball Recovery (type_id: 2)

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `offensive` | boolean | Whether the recovery was from the team's own failed action |
| `recovery_failure` | boolean | Whether the recovery attempt failed |

---

## Foul Committed (type_id: 22)

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `card` | object | Card shown (if any) |
| `offensive` | boolean | Whether the foul was committed by the attacking team |
| `type` | object | Type of foul |
| `advantage` | boolean | Whether advantage was played |
| `penalty` | boolean | Whether the foul resulted in a penalty |
| `counterpress` | boolean | Whether the foul was committed during a counterpress |

### Card Types

| ID | Name |
|----|------|
| 5 | Yellow Card |
| 6 | Second Yellow |
| 7 | Red Card |

---

## Clearance (type_id: 9)

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `aerial_won` | boolean | Whether an aerial duel was won as part of the clearance |
| `body_part` | object | Body part used |
| `head` | boolean | Whether the clearance was headed |
| `right_foot` | boolean | Whether the clearance was with right foot |
| `left_foot` | boolean | Whether the clearance was with left foot |
| `other` | boolean | Whether cleared with another body part |

---

## Starting XI (type_id: 35)

Contains `tactics` object with formation and lineup:

```json
{
  "tactics": {
    "formation": 433,
    "lineup": [
      {
        "player": { "id": 6909, "name": "Damian Martinez" },
        "position": { "id": 1, "name": "Goalkeeper" },
        "jersey_number": 23
      }
    ]
  }
}
```

Formation is encoded as an integer: 433 = 4-3-3, 442 = 4-4-2, 352 = 3-5-2, etc.

---

## Substitution (type_id: 19)

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `replacement` | object | Player coming on |
| `outcome` | object | Reason for substitution |

### Substitution Outcomes

| ID | Name |
|----|------|
| 101 | Injury |
| 102 | Tactical |

---

## Tactical Shift (type_id: 36)

Same structure as Starting XI -- contains `tactics` with updated formation and lineup positions.

---

## Positions

StatsBomb uses a fixed set of position IDs across all events:

| ID | Name |
|----|------|
| 1 | Goalkeeper |
| 2 | Right Back |
| 3 | Right Center Back |
| 4 | Center Back |
| 5 | Left Center Back |
| 6 | Left Back |
| 7 | Right Wing Back |
| 8 | Left Wing Back |
| 9 | Right Defensive Midfield |
| 10 | Center Defensive Midfield |
| 11 | Left Defensive Midfield |
| 12 | Right Midfield |
| 13 | Right Center Midfield |
| 14 | Center Midfield |
| 15 | Left Center Midfield |
| 16 | Left Midfield |
| 17 | Right Wing |
| 18 | Right Attacking Midfield |
| 19 | Center Attacking Midfield |
| 20 | Left Attacking Midfield |
| 21 | Left Wing |
| 22 | Right Center Forward |
| 23 | Center Forward (Striker) |
| 24 | Left Center Forward |
| 25 | Secondary Striker |
