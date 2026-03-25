# Wyscout Data Model

## Core Entities

### Match

```json
{
  "matchId": 5012345,
  "seasonId": 188945,
  "competitionId": 524,
  "roundId": 4425634,
  "gameweek": 15,
  "status": "Played",
  "dateutc": "2024-12-14 15:00:00",
  "winner": 123,
  "duration": "Regular",
  "homeTeam": {
    "teamId": 123,
    "teamName": "Home FC",
    "score": 2,
    "scoreHT": 1,
    "formation": "4-3-3",
    "coach": { "coachId": 456, "shortName": "J. Coach" }
  },
  "awayTeam": {
    "teamId": 789,
    "teamName": "Away United",
    "score": 1,
    "scoreHT": 0,
    "formation": "4-2-3-1",
    "coach": { "coachId": 101, "shortName": "M. Boss" }
  },
  "venue": { "venueId": 55, "venueName": "Stadium Name" },
  "referee": { "refereeId": 33, "shortName": "A. Referee" }
}
```

### Player

```json
{
  "playerId": 456789,
  "shortName": "M. Salah",
  "firstName": "Mohamed",
  "lastName": "Salah",
  "birthDate": "1992-06-15",
  "birthArea": { "id": 50, "name": "Egypt", "alpha2code": "EG" },
  "passportArea": { "id": 50, "name": "Egypt", "alpha2code": "EG" },
  "role": { "code2": "FW", "code3": "FWD", "name": "Forward" },
  "foot": "left",
  "height": 175,
  "weight": 71,
  "currentTeamId": 123,
  "status": "active",
  "gender": "male",
  "imageDataURL": "https://..."
}
```

### Team

```json
{
  "teamId": 123,
  "officialName": "Liverpool Football Club",
  "name": "Liverpool",
  "area": { "id": 0, "name": "England", "alpha2code": "EN" },
  "type": "club",
  "category": "default",
  "gender": "male",
  "city": "Liverpool",
  "children": [],
  "imageDataURL": "https://..."
}
```

### Competition / Season

```json
{
  "competitionId": 524,
  "name": "Premier League",
  "area": { "id": 0, "name": "England" },
  "format": "Domestic league",
  "type": "club",
  "gender": "male",
  "category": "default"
}
```

Seasons nest under competitions:

```json
{
  "seasonId": 188945,
  "competitionId": 524,
  "name": "2024/2025",
  "startDate": "2024-08-17",
  "endDate": "2025-05-25",
  "active": true
}
```

## Event Model

Events are the core analytical unit. Every on-ball action generates an event.

### v3 Event Structure

```json
{
  "id": 987654321,
  "matchId": 5012345,
  "matchPeriod": "1H",
  "second": 145.2,
  "minute": 2,
  "videoTimestamp": "00:02:25",
  "relatedEventId": 987654322,
  "type": {
    "primary": { "id": "pass", "name": "Pass" },
    "secondary": { "id": "cross", "name": "Cross" }
  },
  "location": { "x": 72.5, "y": 34.2 },
  "team": { "id": 123, "name": "Liverpool" },
  "player": { "id": 456, "name": "M. Salah" },
  "opponentTeam": { "id": 789, "name": "Manchester City" },
  "pass": {
    "accurate": true,
    "angle": 24.5,
    "length": 18.3,
    "height": "ground",
    "endLocation": { "x": 85.1, "y": 42.0 },
    "recipient": { "id": 789, "name": "D. Nunez" }
  },
  "possession": {
    "id": 42,
    "team": { "id": 123, "name": "Liverpool" },
    "types": ["positional_attack"],
    "endLocation": { "x": 92.1, "y": 50.0 },
    "attack": {
      "withShot": true,
      "withShotOnTarget": true,
      "withGoal": false,
      "xg": 0.15,
      "flank": "right"
    }
  },
  "groundPressure": false,
  "aerialDuel": false
}
```

### Key Event Properties

| Field | Type | Description |
|---|---|---|
| `id` | integer | Unique event ID |
| `matchId` | integer | Match this event belongs to |
| `matchPeriod` | string | `"1H"`, `"2H"`, `"E1"`, `"E2"`, `"P"` |
| `second` | float | Exact second within the period |
| `minute` | integer | Minute of the match |
| `videoTimestamp` | string | Timestamp for video sync |
| `relatedEventId` | integer | Linked event (e.g., pass received, duel opponent) |
| `type.primary` | object | Primary event classification |
| `type.secondary` | object | Secondary event classification |
| `location` | object | `{x, y}` in Wyscout coordinates (0-100) |
| `team` | object | Team performing the action |
| `player` | object | Player performing the action |
| `opponentTeam` | object | Opposing team |
| `possession` | object | Possession context including attack type |
| `groundPressure` | boolean | Whether event occurred under pressure |
| `aerialDuel` | boolean | Whether an aerial duel was involved |

### Type-specific Sub-objects

Events include additional properties based on their primary type:

- **`pass`**: `accurate`, `angle`, `length`, `height`, `endLocation`, `recipient`
- **`shot`**: `isGoal`, `onTarget`, `xg`, `postShotXg`, `bodyPart`, `goalZone`, `goalMouthLocation`
- **`duel`**: sub-type details embedded in secondary type
- **`goalkeeper`**: save type, reflexes

## Lineup / Formation Data

```json
{
  "matchId": 5012345,
  "homeTeam": {
    "teamId": 123,
    "formation": "4-3-3",
    "lineup": [
      {
        "playerId": 456,
        "shortName": "M. Salah",
        "position": "RW",
        "shirtNumber": 11,
        "substitute": false,
        "minuteIn": 0,
        "minuteOut": 90,
        "goals": 1,
        "ownGoals": 0,
        "yellowCards": 0,
        "redCards": 0
      }
    ],
    "bench": [
      {
        "playerId": 457,
        "shortName": "C. Jones",
        "position": "CM",
        "shirtNumber": 17,
        "substitute": true,
        "minuteIn": 65,
        "minuteOut": 90
      }
    ]
  }
}
```

## v2 vs v3 Differences

### Structural Changes

| Aspect | v2 | v3 |
|---|---|---|
| Event type IDs | Numeric (`eventId: 8`, `subEventId: 85`) | String-based (`type.primary.id: "pass"`, `type.secondary.id: "cross"`) |
| Location format | `positions: [{x: 50, y: 50}]` (array, 0-100) | `location: {x: 50, y: 50}` (object, 0-100) |
| End location | `positions[1]` (second element) | Type-specific: `pass.endLocation`, etc. |
| Tags | Numeric tag array: `tags: [{id: 1801}]` | Named booleans: `pass.accurate: true` |
| xG | Not included natively | `shot.xg`, `shot.postShotXg` |
| Possession | Not structured | Full `possession` object with attack classification |
| Pressure | Tag-based (`tag 1801`) | `groundPressure: boolean` |

### v2 Tag IDs (Legacy Reference)

Common v2 tags (numeric, no longer used in v3):

| Tag ID | Meaning |
|---|---|
| 101 | Goal |
| 102 | Own goal |
| 301 | Assist |
| 302 | Key pass |
| 401 | Left foot |
| 402 | Right foot |
| 403 | Head/body |
| 501 | Free space right |
| 502 | Free space left |
| 701 | Lost |
| 702 | Neutral |
| 703 | Won |
| 1801 | Accurate |
| 1802 | Not accurate |
| 1901 | Goal low centre |
| 1902 | Goal low right |
| 1903 | Goal centre left |

### Migration Considerations

- v2 API is deprecated; new integrations should use v3
- v2 data exports (e.g., from academic licenses) still use the old format
- kloppy supports both v2 and v3 format loading
- The coordinate system (0-100, origin top-left) is the same in both versions
