---
source_url: https://apidocs.wyscout.com/
source_type: crawled
upstream_version: v3 2024-03-12 / v4 2024-05-09
crawled_at: 2026-06-03
---

# Wyscout Data Model

The event and stats payloads returned by the Wyscout API. The event model is **identical in v3 and v4**; v4 adds tracking, physical and direction payloads (covered at the end). For the type vocabulary see [event-types.md](event-types.md); for coordinates see [coordinate-system.md](coordinate-system.md).

## Events response envelope

`GET /matches/{wyId}/events` returns:

```json
{
  "elements": [ { "events": [ /* MatchEvent objects */ ], "...": "fetched relations" } ],
  "meta": { /* pagination/meta */ }
}
```

The `elements[].events` array holds the `MatchEvent` objects. Optional related blocks appear on the element when requested via `fetch`:

- `fetch=teams` → `teams[<teamId>]`
- `fetch=players` → `players[<teamId>]` (array of player objects)
- `fetch=match` → `match`
- `fetch=coaches` → `coaches[<teamId>].coach`
- `fetch=referees` → `referees[]` with `refereeId` + `role` (`referee`, `firstAssistant`, `secondAssistant`, `fourthOfficial`)
- `fetch=formations` → `formations[<teamId>][<matchPeriod>][<startSec>][<scheme>]`
- `fetch=substitutions` → `substitutions[<teamId>][<matchPeriod>][<startSec>]` with `in[]`/`out[]` (red cards counted as `out`)

Use `exclude=possessions,names,positions,formations` to shrink the payload, and `details=tag` to expand tag detail.

## MatchEvent object

Every event carries this core set; contextual sub-objects appear only for the relevant event kind.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Event id |
| `matchId` | integer | |
| `matchPeriod` | string | `1H`/`2H`/`E1`/`E2`/`P` |
| `minute` | integer | |
| `second` | integer | |
| `matchTimestamp` | string | Time within the match |
| `videoTimestamp` | string | Time within the match video |
| `relatedEventId` | integer | Links related events (e.g. pass → reception) |
| `team` | object | Acting team |
| `opponentTeam` | object | |
| `player` | object | Acting player |
| `type` | object | `primary` (single) + `secondary[]` — see [event-types.md](event-types.md) |
| `location` | object | `{x, y}` in pitch percentages (0–100), or `null` if untagged |
| `possession` | object | The possession this event belongs to |
| `pass` | object | Present for passes (and throw-ins, etc.) |
| `shot` | object | Present for shots and post-match penalties |
| `carry` | object | Present for carries |
| `groundDuel` | object | Present for ground duels |
| `aerialDuel` | object | Present for aerial duels |
| `infraction` | object | Present for fouls, yellow/red cards |

### location

```json
"location": { "x": 50, "y": 50 }
```

`x`/`y` are percentages of the pitch from 0 to 100 from the acting subject's perspective: `(0,0)` = left corner near own goal, `(0,100)` = right corner near own goal, `(100,0)` = left corner near opponent goal, `(100,100)` = right corner near opponent goal, `(50,50)` = centre. `null` when location is not tagged. Full detail in [coordinate-system.md](coordinate-system.md).

### pass

| Field | Type | Notes |
|---|---|---|
| `accurate` | boolean | True if the pass was accurate |
| `angle` | integer | Degrees. `0°` = perfect forward (toward goal); right = positive (`90°` strictly right), left = negative (`-90°` strictly left), straight back = `180°` |
| `length` | number | Metres (standard pitch dimensions) |
| `endLocation` | `{x, y}` | Pitch percentages |
| `recipient` | object | `{id, name, position}` of the receiving player |

### shot

| Field | Type | Notes |
|---|---|---|
| `isGoal` | boolean | |
| `onTarget` | boolean | |
| `xg` | number | Expected goals (penalty xG fixed at 0.76) |
| `postShotXg` | number | Post-shot xG (xGOT-style) |
| `bodyPart` | string | `left_foot`, `right_foot`, `head_or_other` |
| `goalZone` | string | Where the shot ended up (see table below) |
| `goalkeeper` | object | `{id, name}` |
| `goalkeeperActionId` | integer | Links to the GK's `shot_against`/`save` event |

**`goalZone` codes** — `g*` = on goal frame, `o*` = off target / out, `p*` = hit the post, `bc` = blocked. The `g*` codes map to a 3×3 grid of the goal mouth (as seen by the shooter), with `o*`/`p*` mirroring the same nine positions for off-target and post hits:

![Wyscout goal zones](https://dataglossary.wyscout.com/static/aeeac3b7bd041a6b256583f864286c4b/0ec88/goal-zones.png)


| Code | Meaning | Code | Meaning |
|---|---|---|---|
| `bc` | Shot blocked | `gc` | Goal centre |
| `gb` | Goal low centre | `gt` | Goal high centre |
| `gbr` | Goal low right | `gtl` | Goal high left |
| `glb` | Goal low left | `gtr` | Goal high right |
| `gl` | Goal centre left | `gr` | Goal centre right |
| `ol` | Out centre left | `or` | Out centre right |
| `olb` | Out low left | `obr` | Out low right |
| `ot` | Out high centre | `otl` | Out high left |
| `otr` | Out high right | `pl` | Post centre left |
| `plb` | Post low left | `pbr` | Post low right |
| `pr` | Post centre right | `pt` | Post high centre |
| `ptl` | Post high left | `ptr` | Post high right |

### carry

| Field | Type | Notes |
|---|---|---|
| `endLocation` | `{x, y}` | |
| `progression` | number | Distance progressed toward goal |

### groundDuel

| Field | Type | Notes |
|---|---|---|
| `duelType` | string | `defensive_duel`, `dribble`, `offensive_duel` |
| `opponent` | object | `{id, name, position}` |
| `keptPossession` | boolean | |
| `recoveredPossession` | boolean | |
| `progressedWithBall` | boolean | |
| `stoppedProgress` | boolean | |
| `takeOn` | boolean | |
| `side` | string | |
| `relatedDuelId` | integer | Links the two sides of the duel |

### aerialDuel

| Field | Type | Notes |
|---|---|---|
| `firstTouch` | boolean | Duel won by whoever touches the ball first |
| `height` | integer | Acting player's height |
| `opponent` | object | `{id, name, position, height}` |
| `relatedDuelId` | integer | |

### infraction

| Field | Type | Notes |
|---|---|---|
| `type` | string | `hand_foul`, `regular_foul`, `violent_foul`, `out_of_play_foul`, `protest_foul`, `time_lost_foul`, `simulation_foul`, `late_card_foul` |
| `yellowCard` | boolean | |
| `redCard` | boolean | |
| `opponent` | object | `{id, name, position}` — the fouled player |

### possession

| Field | Type | Notes |
|---|---|---|
| `id` | integer | |
| `types` | array | Possession types (see [event-types.md](event-types.md)) |
| `team` | object | Team in possession |
| `duration` | string | |
| `eventsNumber` | integer | Events in the possession |
| `eventIndex` | integer | This event's index within the possession |
| `startLocation` | `{x, y}` | |
| `endLocation` | `{x, y}` | |
| `attack` | object | Attack context (when the possession is an attack) |

## Advanced stats

Aggregated metrics from the `advancedstats` endpoints (player, team, match). These are pre-computed by Wyscout, not derived from the event feed.

- **Player advanced stats** — ~260 fields per player including `goals`, `assists`, `shots`, `shotsOnTarget`, `xgShot`/xG-related, `keyPasses`, `progressivePasses`, `progressiveRun`, `passesToFinalThird`, `smartPasses`, `throughPasses`, `crosses`, `dribbles`/`successfulDribbles`, `defensiveDuels`/`defensiveDuelsWon`, `interceptions`, `recoveries`, `counterpressingRecoveries`, `aerialDuels`/`aerialDuelsWon`, `slidingTackles`, plus goalkeeping (`gkSaves`, `gkCleanSheets`, `gkConcededGoals`, `gkExits`, `gkShotsAgainst`), `minutesOnField`/`minutesTagged`, and accuracy splits (`successful*` counterparts of most actions).
- **Team advanced stats** — ~230 fields including the above aggregated to team level plus `ppda` (passes per defensive action), `possessionPercent`, `shotsAgainst`, `cleanSheets`, `concededGoals`, and goal-kick distribution (`shortGoalKicks`/`longGoalKicks`).

Player/team advanced-stats endpoints require `compId` and accept `seasonId`, `roundId`, `matchDay`. Per-match variants live at `/players/{wyId}/matches/{matchWyId}/advancedstats` and `/teams/{wyId}/matches/{matchWyId}/advancedstats`.

The match-level `GET /matches/{wyId}/advancedstats` returns a stats block keyed by `<teamId>` plus `totalTime`/`deadTime`. Use `GET /matches/{wyId}/advancedstats/players` for all players in one call.

## v4-only payloads

### Match directions — `GET /matches/{wyId}/directions`

Which way each team attacks in each period. Keyed by period (`1H`, `2H`, `E1`, `E2`), each value:

```json
"1H": { "leftToRightTeamId": 16276, "rightToLeftTeamId": 3163 }
```

Needed to reconcile event coordinates (which are subject-relative) with an absolute, broadcast-oriented pitch. See [coordinate-system.md](coordinate-system.md).

### Match physical data — `GET /matches/{wyId}/physicaldata`

Per-player physical-metrics summary, where available. Shape: an array of team blocks, each with `players[]`, each player carrying `metrics[]`. Each metric has a `name` (e.g. "Count Medium Acceleration", "Count High Acceleration") and a `values[]` array broken down by `phase`:

```json
{
  "gameId": "5343506", "teamId": "16276", "teamName": "Tunisia",
  "players": [{
    "id": "285477", "name": "F. Ben Arbi",
    "metrics": [{
      "name": "Count Medium Acceleration",
      "values": [
        {"phase": "Session", "value": 183}, {"phase": "1st Half", "value": 130},
        {"phase": "2nd Half", "value": 53}, {"phase": "1'-15'", "value": 47}
      ]
    }]
  }]
}
```

Phases include `Session`, `Drills`, `1st Half`, `2nd Half`, and 15-minute buckets (`1'-15'`, `16'-30'`, `31'-45+'`, `46'-60'`, `61'-75'`, `76'-90+'`).

### Broadcast tracking — `GET /matches/{wyId}/fulltracking`

Does **not** return the tracking frames inline. It returns a pointer:

```json
{ "wyId": 5343506, "trackingDownloadUrl": "https://.../tracking.json" }
```

Fetch `trackingDownloadUrl` to download the JSON file of (x,y) location data ("Broadcast Tracking"). This is optical tracking derived from broadcast footage, available for a subset of matches.
