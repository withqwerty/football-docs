---
source_url: https://driblab.notion.site/Driblab-API-1-0-Guide-EN-65ce257f83b5451fb79896b01d41aede
source_type: curated
upstream_version: Driblab API 1.0 Guide [EN]
crawled_at: 2026-09-09
---

# Driblab Data Model

Driblab serves **aggregated metrics**, not events. There is no event feed, no
qualifier vocabulary and no per-action rows. Everything below is a total or a
rate over a season, a match, or a player's spell at one club.

## Three metric families

The API separates its numbers into three families, each with its own endpoints.
They never appear in the same payload.

| Family | Endpoint suffix | Contents |
|---|---|---|
| Technical stats | `/stats`, `/player-stats`, `/team-stats` | Passing, shooting, defending, and so on |
| Physical stats | `/physical-stats`, `/player-physical-stats` | Distance, runs, accelerations, speed |
| Arrigo metrics | `/arrigo-metrics`, `/player-arrigo-metrics` | Line-breaking and defender-bypassing |

Asking for physical data from a `/stats` endpoint returns nothing — it is a
different call, not a different field.

## Envelope shape of a stats response

Every stats row identifies its subject and nests the numbers under `stats`, which
is grouped by category:

```
player  { id, name, position, secondary_position, side, minutes_played, games_played }
season  { id, name }
team    { id, name }
stats   { <group>: { <metric>: <number> } }
```

`minutes_played` and `games_played` ride along on the `player` object in stats
responses, so per-90 normalisation needs no second call.

The guide does not state how any metric is normalised. Judging by the names and
the sample values, the counting metrics (`shots`, `passes`, `tackles`) look like
totals, while `*Pct`, `*Efficiency`, `catching`, `handPassing`, `shooting` and
`finishing` are clearly not counts. Confirm against your own data before
comparing players — do not assume per-90.

## Technical stat groups

Seven groups for players; teams add an eighth, `predictive`.

**`shooting`** — `xG`, `xGPerShot`, `xGPerNpg`, `xGEfficiency`, `shots`,
`shotsOnTarget`, `shotsOffTarget`, `shotsPerNpg`, `goals`, `nonPenaltyGoals`,
`headers`, `headedGoals`, `shooting`, `finishing`

**`passing`** — `passes`, `passesSuccessful`, `passingPct`, `longBallTotal`,
`longBallSuccessful`, `longBallPct`, `passingFinalThird`,
`passingFinalThirdPct`, `passesFinalThirdTotal`, `passesOppHalf`

**`association`** — `xAssists`, `assists`, `xGChain`, `xGBuildup`,
`xGBuildup5pass`, `chancesCreated`, `chancesCreatedOP`, `openPlayKeyPasses`,
`openPlayPassesIntoOpponentBox`, `ballProgression`, `throughBalls`, `crossing`,
`completedCrosses`, `crossEfficiency`, `passesPerLongBall`, `scoringContribution`

**`defending`** — `tackles`, `tacklesWasDribbled`, `interceptions`, `clearances`,
`recoveries`, `individualPressure`, `fouls`, `yellowCards`, `redCards`

**`ball_handling`** — `touches`, `touchesInOpponentBox`, `dribblesAttempted`,
`successfulDribbles`, `successfulDribblesPct`, `deepProgression`,
`dispossessed`, `foulsTaken`, `penaltiesTaken`

**`aerial`** — `aerials`, `aerialWins`, `aerialWinsPct`, `aerialEfficiency`

**`saving`** (goalkeepers) — `shotsAgainst`, `shotsOnTargetAgainst`,
`shotsOnTargetInBoxAgainst`, `shotsOnTargetOutBoxAgainst`, `savesPct`,
`savesInBox`, `savesInBoxPct`, `savesOutBox`, `savesOutOfBoxPct`,
`goalsConceded`, `nonPenaltyGoalsAgainst`, `shotsPerGoal`, `xGPerShotAgainst`,
`xGFacedOnTargetEfficiency`, `xGFacedOnTargetPerGoalReceived`, `catching`,
`claimAccuracy`, `handPassing`

**`predictive`** (teams only) — `expectedPoints`

Goalkeepers carry all groups, not only `saving`; the outfield groups are simply
mostly zero.

**An undocumented ninth group.** The response samples for
`GET /game/{id}/player-stats` carry a `crosses` group — `crossing`,
`completedCrosses`, `crossEfficiency` — that the guide's own field table for that
endpoint does not list. The same three metrics also sit inside `association` on
the season-level endpoints. Handle an unexpected group rather than keying off the
documented list.

**A naming trap.** The guide's field tables spell the ball-handling group
`ball_handing`, while every response sample uses `ball_handling`. Read the key as
`ball_handling` and treat `ball_handing` as a typo in the documentation. The same
kind of slip appears on the player resource: the field table says
`second_nationality`, the sample says `secondary_nationality`.

Metric names inside a group are **camelCase**; group names and top-level resource
fields are **snake_case**. Both conventions live in the same object.

## Physical stat groups

Four groups, from `/physical-stats` and `/player-physical-stats`:

- **`distance`** — `totalDistance`, `walkingDistance`, `joggingDistance`,
  `runningDistance`, `hsrDistance`, `sprintDistance`
- **`runs`** — `runsQuantity`, `hsrQuantity`, `sprintsQuantity`
- **`accelerations`** — `accelerationsNumber`, `extremeAccelerationsNumber`,
  `maxAcceleration`
- **`speed`** — `maxSpeed`

Physical values can be `null` rather than zero — every acceleration metric is
`null` in the guide's published sample while the distance and speed metrics carry
values. Treat `null` as absent rather than as zero.

The guide states no units for any physical metric. The sample values are
consistent with metres for the distances and km/h for `maxSpeed`, but that is an
inference, not a documented fact — confirm against your own data.

## Arrigo metrics

Driblab's own metric family, in a single group, `out_play`. The guide gives the
metric names but defines none of them, so the readings below come from the names
and from the sample values, not from Driblab.

Actions performed: `passesBypassingPlayers`, `passesBypassingDefenders`,
`carriesBypassingDefenders`, `bypassedPlayersByPasses`,
`bypassedDefendersByPasses`, `bypassedPlayersByCarries`,
`bypassedDefendersByCarries`, `bypassedPlayersByActions`,
`bypassedDefendersByActions`.

Actions suffered: `timesBypassedByPasses`, `timesBypassedByCarries`,
`timesBypassedByActions`.

Team-level totals use the shorter forms: `bypassedPlayers`, `bypassedDefenders`,
`bypassedByPasses`, `bypassedByCarries`, `bypassedByTotal`,
`bypassedPlayersTotal`, `bypassedDefendersTotal`, `bypassedPlayersCarries`,
`bypassedDefendersCarries`.

The names sort into three axes: what did the bypassing (`Passes`, `Carries`,
`Actions`), who was bypassed (`Players`, `Defenders`), and direction (performed,
or `timesBypassed*` suffered).

`Actions` is passes and carries added together, not an independent measurement.
In the guide's sample, `bypassedPlayersByActions` (421) equals
`bypassedPlayersByPasses` (421) plus `bypassedPlayersByCarries` (0), and
`timesBypassedByActions` (106) equals `timesBypassedByPasses` (95) plus
`timesBypassedByCarries` (11). Summing the three would double-count.

What distinguishes `Players` from `Defenders` is not stated in the guide.

## Match-level entities

**Game** (`GET /game/{id}`) — `id`, `name` (a scoreline string such as
`"Home 0:2 Away"`), `status`, `match_date`, `match_day`, `venue`, `season`,
`home_team` and `away_team` objects, and four
`last_minute_played_*` fields for each half and each period of extra time.
`home_team` and `away_team` carry `score`, `penalty_shootout_score`,
`formation` (a bare string like `"4231"`), `possession` and `coach`.

**Game stats** (`GET /game/{id}/stats`) — per-side model outputs, under
`home_team` and `away_team`: `xG`, `xGOpenPlay`, `xGSetPiece`, `xA`, `xAOpenPlay`, `xASetPiece`,
`xP`, `winChance`, `drawChance`, `possession`, `ppda`, `directness`.

**Timeline** (`GET /game/{id}/timeline`) — main events only. Each entry has
`name` (the event category, e.g. `card`, `goal`), `info` (the detail, e.g.
`yellowCard`, `penalty`), `home_team` as a boolean rather than an ID, `period`,
`min`, and a `subjects` array of the players involved. This is a match summary,
not an event feed: there are no coordinates, no possession chains and no
qualifiers.

**Lineup** (`GET /game/{id}/lineup`) — positional and timing information per
player.

**One endpoint breaks the shape.** `GET /team/{id}/game-stats` returns `stats` as
a **flat array of `{name, value}` pairs**, not the nested group object every other
stats endpoint uses, and it uses its own metric names: `passing`, `crossing`,
`crossesCompleted`, `aerials`, `aerialsWon`, `aerialsPct`, `passingFinalThird`,
`assists`, `clearances`, `fouls`. A parser written against the nested shape will
not read it, and `aerialsWon` here is `aerialWins` elsewhere.

## Player and squad entities

**Player** (`GET /player/{id}`) — `id`, `name`, `first_name`, `last_name`,
`dob` (`DD/MM/YYYY`), `age`, `height` (cm), `weight` (kg), `nationality` and
`secondary_nationality`, `position`, `secondary_position`, `side`,
`current_team`, `market_value`, `academy`, `jersey_num`, and a `contract` object
holding `end_contract_date`, `contract_option`, `loan_team` and
`loan_end_contract_date`.

`position` is a short code (`GK`) and `side` is a word (`Centre`); the full
vocabulary comes from `GET /player-positions`. `market_value` appears on both
players and teams, so squad value needs no summing.

**Season** (`GET /season/{id}`) — `year` (the starting calendar year),
`alias` (a short label such as `ESP I 2016`), `current_matchday`,
`total_matchdays`, `total_games`, `total_games_played`, `total_games_counted`,
`is_active`, `start_date` and `end_date` (ISO 8601).

`total_games`, `total_games_played` and `total_games_counted` are three separate
fields. The guide describes the last as "number of games counted" and does not say
how it relates to the other two, so check all three before treating a season
aggregate as complete rather than assuming they agree.

**Competition** — `division` (a number, 1 for a top flight), `competition_type`,
`is_youth`, `is_male`, `country`, `number_of_seasons`. Gender is a boolean
`is_male` rather than an enumerated field.

## What Driblab does not provide

- **No event data.** No shot locations, no pass origins and destinations, no
  qualifiers. Aggregated metrics and a match timeline only.
- **No coordinates anywhere**, including in the timeline.
- **No cross-provider IDs.** See [api-access.md](api-access.md).
- **Tracking only as a file link**, not as an API resource — and only for games
  Driblab has processed.
