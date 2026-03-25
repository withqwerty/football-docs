# SportMonks Event & Stat Type IDs

## Fixture Event Type IDs

These are the `type_id` values returned in the fixture events (incidents) endpoint.

### Goals & Scoring

| Type ID | Name | Description |
|---|---|---|
| 14 | Goal | Regular goal |
| 15 | Own Goal | Own goal |
| 16 | Penalty Goal | Converted penalty (in-game) |
| 17 | Penalty Missed | Missed/saved penalty (in-game) |

### Cards

| Type ID | Name | Description |
|---|---|---|
| 19 | Yellow Card | Yellow card |
| 20 | Yellow/Red Card | Second yellow leading to red |
| 21 | Red Card | Straight red card |

### Substitutions

| Type ID | Name | Description |
|---|---|---|
| 18 | Substitution | Player substitution (includes `player_id` subbed off, `related_player_id` subbed on) |

### Penalties (Shootout)

| Type ID | Name | Description |
|---|---|---|
| 22 | Penalty Shootout Goal | Penalty scored in shootout |
| 23 | Penalty Shootout Miss | Penalty missed in shootout |

### VAR

| Type ID | Name | Description |
|---|---|---|
| 24 | VAR Event | VAR decision |

## Event Response Structure

```json
{
  "id": 123456,
  "fixture_id": 19145782,
  "type_id": 14,
  "participant_id": 9,
  "player_id": 456,
  "related_player_id": null,
  "player_name": "M. Salah",
  "minute": 42,
  "extra_minute": null,
  "section": "event",
  "result": "1-0",
  "info": null,
  "addition": null,
  "injured": false
}
```

## Stat Type IDs

Statistics are returned per-player or per-team on fixture endpoints. These are the `type_id` values in the statistics response.

### Shooting

| Stat Type ID | Name | Description |
|---|---|---|
| 41 | Shots Total | Total shots |
| 42 | Shots On Target | Shots on target |
| 43 | Shots Off Target | Shots off target |
| 44 | Shots Blocked | Shots blocked by defenders |
| 86 | Hit Woodwork | Shots hitting the post/crossbar |
| 52 | Shots Inside Box | Shots from inside the penalty area |
| 53 | Shots Outside Box | Shots from outside the penalty area |

### Passing

| Stat Type ID | Name | Description |
|---|---|---|
| 80 | Passes Total | Total passes attempted |
| 81 | Passes Accurate | Accurate passes |
| 116 | Passes Accurate % | Pass accuracy percentage |
| 84 | Key Passes | Passes leading to a shot |
| 117 | Crosses Total | Total crosses |
| 118 | Crosses Accurate | Accurate crosses |
| 119 | Long Balls Total | Total long balls |
| 120 | Long Balls Accurate | Accurate long balls |

### Defence

| Stat Type ID | Name | Description |
|---|---|---|
| 45 | Tackles | Total tackles |
| 78 | Interceptions | Interceptions |
| 51 | Clearances | Clearances |
| 56 | Blocked Shots | Shots blocked |

### Possession & Dribbling

| Stat Type ID | Name | Description |
|---|---|---|
| 45 | Ball Possession % | Team possession percentage |
| 79 | Dribbles Attempted | Dribble attempts |
| 108 | Dribbles Won | Successful dribbles |
| 83 | Touches | Total touches |

### Duels

| Stat Type ID | Name | Description |
|---|---|---|
| 105 | Duels Total | Total duels contested |
| 106 | Duels Won | Duels won |
| 46 | Aerials Won | Aerial duels won |

### Goalkeeper

| Stat Type ID | Name | Description |
|---|---|---|
| 57 | Saves | Goalkeeper saves |
| 208 | Punches | Goalkeeper punches |
| 209 | Goal Kicks | Goal kicks taken |
| 210 | Throws | Goalkeeper throws |

### Discipline & Fouls

| Stat Type ID | Name | Description |
|---|---|---|
| 47 | Fouls Committed | Fouls committed |
| 48 | Fouls Drawn | Fouls suffered |
| 56 | Offsides | Offsides |
| 57 | Corners | Corner kicks |

### Team-level

| Stat Type ID | Name | Description |
|---|---|---|
| 34 | Ball Possession | Team possession % |
| 50 | Dangerous Attacks | Dangerous attack count |
| 49 | Attacks | Total attack count |

### xG (if available on plan)

| Stat Type ID | Name | Description |
|---|---|---|
| 580 | Expected Goals (xG) | Expected goals value |
| 581 | Expected Assists (xA) | Expected assists value |

## Statistics Response Structure

```json
{
  "id": 789012,
  "fixture_id": 19145782,
  "type_id": 42,
  "participant_id": 9,
  "player_id": 456,
  "data": {
    "value": 3
  },
  "location": "home"
}
```

Team-level stats use the same structure but without `player_id`.

## Lineup Type IDs

Lineups include position information:

| Position ID | Name |
|---|---|
| 24 | Goalkeeper |
| 25 | Defender |
| 26 | Midfielder |
| 27 | Forward |

Detailed position data (e.g., centre-back, left-wing) is available through the player's `detailed_position_id` field.

## Market Value & Transfer Types

| Type | Description |
|---|---|
| 1 | Transfer |
| 2 | Loan |
| 3 | Free Transfer |
| 4 | Loan Return |

## Common Sidelined Type IDs

Used for injury/absence tracking:

| Type ID | Name |
|---|---|
| 1 | Injury |
| 2 | Illness |
| 3 | Suspension |
| 4 | Rest |
| 5 | National Team Duty |
| 6 | Personal Reasons |
