# SportMonks Event & Stat Type IDs

Every ID below is from SportMonks' public type definitions for Football API v3
(https://docs.sportmonks.com/v3/definitions/types and its events, statistics,
expected, transfers and position pages, plus the types spreadsheet linked from
the Types page), checked on 2026-09-30. SportMonks has about 1,300 types; the
complete live list needs an API key (`GET /v3/core/types`). IDs in the JSON
examples are illustrative.

## Fixture Event Type IDs

These are the `type_id` values returned in the fixture events (incidents) endpoint.

### Goals & Scoring

| Type ID | Name | Description |
|---|---|---|
| 14 | Goal | Regular goal |
| 15 | Own Goal | Own goal |
| 16 | Penalty | Converted penalty (in-game) |
| 17 | Missed Penalty | Missed or saved penalty (in-game) |

### Cards

| Type ID | Name | Description |
|---|---|---|
| 19 | Yellowcard | Yellow card |
| 20 | Redcard | Straight red card |
| 21 | Yellow/Red card | Second yellow leading to red |

### Substitutions

| Type ID | Name | Description |
|---|---|---|
| 18 | Substitution | Player substitution. `player_id` is the player coming on; `related_player_id` is the player coming off. |

### Penalties (Shootout)

| Type ID | Name | Description |
|---|---|---|
| 22 | Penalty Shootout Miss | Penalty missed in shootout |
| 23 | Penalty Shootout Goal | Penalty scored in shootout |

### VAR

| Type ID | Name | Description |
|---|---|---|
| 10 | VAR | VAR decision |

## Event Response Structure

```json
{
  "id": 123456,
  "fixture_id": 19145782,
  "type_id": 14,
  "participant_id": 9,
  "player_id": 456,
  "related_player_id": null,
  "player_name": "Example Player",
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
| 42 | Shots Total | Total shots |
| 86 | Shots On Target | Shots on target |
| 41 | Shots Off Target | Shots off target |
| 58 | Shots Blocked | Shots blocked by defenders |
| 64 | Hit Woodwork | Shots hitting the post or crossbar |
| 49 | Shots Insidebox | Shots from inside the penalty area |
| 50 | Shots Outsidebox | Shots from outside the penalty area |
| 52 | Goals | Goals scored |
| 580 | Big Chances Created | Big chances created |
| 581 | Big Chances Missed | Big chances missed |

### Passing

| Stat Type ID | Name | Description |
|---|---|---|
| 80 | Passes | Total passes attempted |
| 116 | Accurate Passes | Accurate passes |
| 1584 | Accurate Passes Percentage | Pass accuracy percentage |
| 117 | Key Passes | Passes leading to a shot |
| 79 | Assists | Assists |
| 98 | Total Crosses | Total crosses |
| 99 | Accurate Crosses | Accurate crosses |
| 122 | Long Balls | Total long balls |
| 123 | Long Balls Won | Accurate long balls |

### Defence

| Stat Type ID | Name | Description |
|---|---|---|
| 78 | Tackles | Total tackles |
| 100 | Interceptions | Interceptions |
| 101 | Clearances | Clearances |
| 97 | Blocked Shots | Shots blocked |

### Possession & Dribbling

| Stat Type ID | Name | Description |
|---|---|---|
| 45 | Ball Possession % | Team possession percentage |
| 108 | Dribble Attempts | Dribble attempts |
| 109 | Successful Dribbles | Successful dribbles |
| 110 | Dribbled Past | Times the player was dribbled past |
| 120 | Touches | Total touches |

### Duels

| Stat Type ID | Name | Description |
|---|---|---|
| 105 | Total Duels | Total duels contested |
| 106 | Duels Won | Duels won |
| 107 | Aerials Won | Aerial duels won |

### Goalkeeper

| Stat Type ID | Name | Description |
|---|---|---|
| 57 | Saves | Goalkeeper saves |
| 103 | Punches | Goalkeeper punches |
| 53 | Goal Kicks | Goal kicks taken |
| 1535 | Goalkeeper Goals Conceded | Goals conceded while in goal |

### Discipline & Fouls

| Stat Type ID | Name | Description |
|---|---|---|
| 56 | Fouls | Fouls committed |
| 96 | Fouls Drawn | Fouls suffered |
| 51 | Offsides | Offsides |
| 34 | Corners | Corner kicks |
| 84 | Yellowcards | Yellow cards |
| 83 | Redcards | Red cards |
| 85 | Yellowred Cards | Second yellow cards |

### Team-level

| Stat Type ID | Name | Description |
|---|---|---|
| 43 | Attacks | Total attack count |
| 44 | Dangerous Attacks | Dangerous attack count |

### Player rating and minutes

| Stat Type ID | Name | Description |
|---|---|---|
| 118 | Rating | Player rating |
| 119 | Minutes Played | Minutes played |

### xG (if available on plan)

| Stat Type ID | Name | Description |
|---|---|---|
| 5304 | Expected Goals (xG) | Expected goals value |
| 5305 | Expected Goals on Target (xGoT) | Expected goals on target value |

The expected-types page lists the rest of the xG family. SportMonks publishes no
type ID named expected assists (xA).

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
| 27 | Attacker |

Detailed position data (e.g., centre-back, left-wing) is available through the player's `detailed_position_id` field.

## Transfer Types

| Type ID | Name |
|---|---|
| 218 | Loan |
| 219 | Transfer |
| 220 | Free Transfer |
| 9688 | End of Loan |

## Common Sidelined Type IDs

Sidelined entries use injury and suspension types. SportMonks has many; common ones:

| Type ID | Name |
|---|---|
| 629 | Injury |
| 1692 | Suspension |
| 336 | Ill |
| 590 | Rest |
