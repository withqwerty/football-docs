# StatsBomb Data Model

StatsBomb structures football data into four primary entities: **competitions**, **matches**, **lineups**, and **events**. A fifth entity, **360 freeze frames**, is available for select matches and provides positional data for all visible players on every event.

## Data Hierarchy

```
competitions.json
  └── matches/{competition_id}/{season_id}.json
        ├── lineups/{match_id}.json
        ├── events/{match_id}.json
        └── three-sixty/{match_id}.json  (optional, select matches)
```

---

## Competitions

File: `competitions.json` (single file, all competitions)

```json
{
  "competition_id": 43,
  "season_id": 106,
  "country_name": "International",
  "competition_name": "FIFA World Cup",
  "competition_gender": "male",
  "competition_youth": false,
  "competition_international": true,
  "season_name": "2022",
  "match_updated": "2023-08-21T14:00:00.000",
  "match_updated_360": "2023-08-21T14:00:00.000",
  "match_available_360": "2023-08-21T14:00:00.000",
  "match_available": "2023-08-21T14:00:00.000"
}
```

Key fields:
- `competition_id` + `season_id` together form the unique key
- `match_available_360` -- non-null when 360 data is available for that season
- `competition_gender` -- `"male"` or `"female"`
- `competition_international` -- true for national team competitions

---

## Matches

File: `matches/{competition_id}/{season_id}.json`

```json
{
  "match_id": 3869685,
  "match_date": "2022-12-18",
  "kick_off": "15:00:00.000",
  "competition": {
    "competition_id": 43,
    "country_name": "International",
    "competition_name": "FIFA World Cup"
  },
  "season": {
    "season_id": 106,
    "season_name": "2022"
  },
  "home_team": {
    "home_team_id": 779,
    "home_team_name": "Argentina",
    "home_team_gender": "male",
    "home_team_group": "Group C",
    "country": { "id": 11, "name": "Argentina" },
    "managers": [
      {
        "id": 5677,
        "name": "Lionel Scaloni",
        "nickname": null,
        "dob": "1978-05-16",
        "country": { "id": 11, "name": "Argentina" }
      }
    ]
  },
  "away_team": { ... },
  "home_score": 3,
  "away_score": 3,
  "match_status": "available",
  "match_status_360": "available",
  "last_updated": "2023-08-21T14:00:00.000",
  "last_updated_360": "2023-08-21T14:00:00.000",
  "metadata": {
    "data_version": "1.1.0",
    "shot_fidelity_version": "2",
    "xy_fidelity_version": "2"
  },
  "match_week": 7,
  "competition_stage": { "id": 26, "name": "Final" },
  "stadium": { "id": 5164, "name": "Lusail Stadium", "country": { "id": 185, "name": "Qatar" } },
  "referee": { "id": 833, "name": "Szymon Marciniak", "country": { "id": 181, "name": "Poland" } }
}
```

### Data Quality Flags

- `data_version` -- spec version (current: `"1.1.0"`)
- `shot_fidelity_version` -- `"1"` (basic) or `"2"` (enhanced, includes freeze frames on shots)
- `xy_fidelity_version` -- `"1"` (less precise locations) or `"2"` (high-precision x/y coordinates)

---

## Lineups

File: `lineups/{match_id}.json`

Array of two team objects, each containing the full squad list:

```json
{
  "team_id": 771,
  "team_name": "France",
  "lineup": [
    {
      "player_id": 3009,
      "player_name": "Kylian Mbappe Lottin",
      "player_nickname": "Kylian Mbappe",
      "jersey_number": 10,
      "country": { "id": 78, "name": "France" },
      "cards": [
        {
          "time": "86:24",
          "card_type": "Yellow Card",
          "reason": "Foul Committed",
          "period": 2
        }
      ],
      "positions": [
        {
          "position_id": 23,
          "position": "Center Forward",
          "from": "00:00",
          "to": "41:20",
          "from_period": 1,
          "to_period": 1,
          "start_reason": "Starting XI",
          "end_reason": "Tactical Shift"
        },
        {
          "position_id": 21,
          "position": "Left Wing",
          "from": "41:20",
          "to": null,
          "from_period": 1,
          "to_period": null,
          "start_reason": "Tactical Shift",
          "end_reason": "Final Whistle"
        }
      ]
    }
  ]
}
```

Key details:
- `positions` array tracks every positional change throughout the match
- `to: null` and `to_period: null` mean the player was in that position until the end of the match
- `start_reason` / `end_reason` explain why the position changed (Starting XI, Tactical Shift, Substitution, etc.)
- `cards` array records all cards received during the match
- The lineup includes all players in the squad, not just starters (substitutes have positions starting later)

---

## Events

File: `events/{match_id}.json`

Array of all match events, ordered by `index`. See `event-types.md` for the full event type reference.

### Core Event Structure

Every event has these base fields:

```json
{
  "id": "uuid-v4",
  "index": 1,
  "period": 1,
  "timestamp": "00:00:00.000",
  "minute": 0,
  "second": 0,
  "type": { "id": 35, "name": "Starting XI" },
  "possession": 1,
  "possession_team": { "id": 779, "name": "Argentina" },
  "play_pattern": { "id": 1, "name": "Regular Play" },
  "team": { "id": 779, "name": "Argentina" }
}
```

On-ball events additionally have:
- `player` -- the player performing the action
- `position` -- the player's position at the time
- `location` -- [x, y] coordinates on the pitch
- `duration` -- how long the event lasted in seconds
- `related_events` -- UUIDs linking to causally related events
- `under_pressure` -- true if a defender is pressuring the player

### Possession Model

StatsBomb tracks possession sequences. Each time the ball changes team, the `possession` counter increments. All events within a possession share the same `possession` number and `possession_team`.

The `play_pattern` describes how the possession began:
- Regular Play, From Corner, From Free Kick, From Throw In, From Goal Kick, From Keeper, From Kick Off, From Counter, Other

### Event Relationships

Events are linked via `related_events` (array of UUIDs). Common relationships:
- Pass -> Ball Receipt (the receipt of the pass)
- Shot -> Goal Keeper (keeper's response to the shot)
- Foul Committed -> Foul Won (the same incident from both perspectives)
- Pressure -> on-ball event (the event being pressured)
- Dribble -> Dribbled Past (the defender's perspective)

### Type-Specific Objects

Each event type can have a nested object with the same lowercase name as the type:
- Shot events have `shot: { ... }`
- Pass events have `pass: { ... }`
- Duel events have `duel: { ... }`
- Carry events have `carry: { ... }`
- Goalkeeper events have `goalkeeper: { ... }`
- Interception events have `interception: { ... }`
- Dribble events have `dribble: { ... }`

---

## 360 Freeze Frames

File: `three-sixty/{match_id}.json`

Available for select matches (primarily 2020+ competitions). This is separate from the per-shot freeze frames embedded in shot events.

```json
{
  "event_uuid": "f651a6c4-55e3-4e0f-a178-59414ba83d6a",
  "visible_area": [
    8.98, 80.0, 41.46, 0.0, 80.34, 0.0, 113.33, 80.0, 8.98, 80.0
  ],
  "freeze_frame": [
    {
      "teammate": true,
      "actor": false,
      "keeper": false,
      "location": [39.21, 44.77]
    },
    {
      "teammate": false,
      "actor": false,
      "keeper": true,
      "location": [118.5, 40.2]
    }
  ]
}
```

### 360 Fields

| Field | Type | Description |
|-------|------|-------------|
| `event_uuid` | string | Links to the `id` of an event in the events file |
| `visible_area` | number[] | Polygon vertices [x1,y1, x2,y2, ...] defining the camera's visible area |
| `freeze_frame` | array | Positions of all visible players |

### 360 Freeze Frame Entry

| Field | Type | Description |
|-------|------|-------------|
| `teammate` | boolean | Whether this player is on the same team as the actor |
| `actor` | boolean | Whether this is the player performing the event |
| `keeper` | boolean | Whether this player is a goalkeeper |
| `location` | [x, y] | Player position in StatsBomb coordinates |

### 360 vs Shot Freeze Frame

| Feature | Shot Freeze Frame | 360 Freeze Frame |
|---------|-------------------|-------------------|
| Available on | Shot events only | All events (for 360 matches) |
| Player identity | Named (player id + name) | Anonymous (teammate/actor/keeper flags only) |
| Position info | Includes position name | No position info |
| File location | Embedded in `shot.freeze_frame` | Separate `three-sixty/` file |
| Visible area | Not provided | Polygon defining camera coverage |

---

## What Makes StatsBomb Data Unique

### 1. Carries
StatsBomb infers "carry" events between other on-ball events, creating a continuous chain of possession. Most other providers only record discrete actions (pass, shot, tackle) without the movements between them.

### 2. Possession Chains
Every event is tagged with a `possession` sequence number and `possession_team`, making it easy to reconstruct full possession sequences without custom logic.

### 3. 360 Freeze Frames
For supported matches, every event has an associated freeze frame showing all visible player positions -- not just shots. This enables spatial analysis of pressing, defensive shape, and passing options.

### 4. Shot Freeze Frames
Even without 360 data, all shots include freeze frames showing every player's position at the moment of the shot. This is critical for their xG model and enables advanced shot analysis.

### 5. Pressure Events
StatsBomb explicitly records defensive pressure events, allowing analysis of pressing intensity and pressing triggers.

### 6. Detailed Positional Tracking
Lineups track every positional change (tactical shifts, substitutions) with precise timestamps, enabling formation analysis at any point in the match.

### 7. High-Precision Coordinates
Version 2 data (`xy_fidelity_version: "2"`) provides high-precision x/y coordinates on the StatsBomb 120x80 yard pitch.

### 8. Play Pattern Attribution
Every event is tagged with how the current possession started (counter-attack, set piece, etc.), enabling analysis by attacking pattern.

---

## Data Versions

| Version | Field | Notes |
|---------|-------|-------|
| `data_version` | `1.0.0` | Original spec |
| `data_version` | `1.1.0` | Current spec with carries, enhanced events |
| `shot_fidelity_version` | `"1"` | Basic shot data |
| `shot_fidelity_version` | `"2"` | Enhanced shots with freeze frames |
| `xy_fidelity_version` | `"1"` | Standard coordinate precision |
| `xy_fidelity_version` | `"2"` | High-precision coordinates |
