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

**Game-level player rows are flat.** In live responses (checked 2026-09-22),
`GET /game/{id}/player-stats` does not nest `player`, `team` and `season`
objects. Each row carries flat camelCase keys instead: `playerId`, `playerName`,
`playerPosition`, `teamId`, `teamName`, `seasonId`, `seasonName`,
`minutesPlayed`, and `stats`. A parser written for the season-level rows will not
find `player.id` here.

The guide does not state how any metric is normalised. Judging by the names and
the sample values, the counting metrics (`shots`, `passes`, `tackles`) look like
totals, while `*Pct`, `*Efficiency`, `catching`, `handPassing`, `shooting` and
`finishing` are clearly not counts. Confirm against your own data before
comparing players — do not assume per-90.

## Technical stat groups

**The live API does not match the guide here.** The guide's field tables list
seven player groups in snake_case (`shooting`, `passing`, `association`,
`defending`, `ball_handling`, `aerial`, `saving`) plus `predictive` for teams.
Live responses, checked on 2026-09-22 against `GET /season/{id}/players/stats`,
`GET /player/{id}/season/{seasonId}/stats`, `GET /game/{id}/player-stats`,
`GET /season/{id}/teams/stats` and `GET /team/{id}/season/{seasonId}/stats`,
differ in three ways:

1. **Player endpoints use PascalCase group names; team endpoints use
   snake_case.** The same group is `BallHandling` in a player row and
   `ball_handling` in a team row. Key a parser on the endpoint family, not on one
   convention.
2. **There are twelve groups, not seven.** Both families add `Carries`,
   `Crosses`, `Turnovers` and `SequenceInvolvement`. Player rows also carry
   `Score`; team rows carry `predictive` instead.
3. **The metric lists are longer and partly different.** Some metrics the guide
   places in one group sit in another: `deepProgression` is in `Carries`,
   `dispossessed` in `Turnovers`, and the crossing metrics in `Crosses` rather
   than `Association`.

Metric names inside a group are camelCase in both families.

### Player stat groups (live)

The same twelve groups and metric sets appear at season level and at game level.

**`Shooting`** — `avgShotDistance`, `finishing`, `finishingxGOT`, `goals`,
`goalsOutBox`, `headedGoals`, `headerPerCross`, `headerPerShot`, `headers`,
`nonPenaltyGoals`, `offsidesCaught`, `shooting`, `shootingOutBox`, `shots`,
`shotsOffTarget`, `shotsOnTarget`, `shotsOutBox`, `shotsPerNpg`, `xG`,
`xGBuildupInTeam`, `xGEfficiency`, `xGOPInTeam`, `xGOnTarget`, `xGPerNpg`,
`xGPerShot`, `xGSetPiece`

**`Passing`** — `averagePassDistance`, `cutbacks`, `deepPasses`, `longBallPct`,
`longBallReceived`, `longBallSuccessful`, `longBallTotal`,
`oPPassesIntoOppBoxPct`, `passes`, `passesFinalThirdTotal`,
`passesFinalThirdTotalPct`, `passesForwardPct`, `passesOPIntoBoxInTeam`,
`passesOppHalf`, `passesPerLongBall`, `passesReceivedFinalThird`,
`passesSuccessful`, `passingFinalThird`, `passingFinalThirdPct`,
`passingOppHalfPct`, `passingOwnHalfPct`, `passingPct`,
`passingSuccessForwardPct`, `progressivePassesAccurate`,
`progressivePassesTotalPct`

**`Association`** — `assists`, `ballProgression`, `ballProgressionDribbling`,
`ballProgressionFinalThird`, `ballProgressionOppHalfInTeam`,
`ballProgressionPassing`, `chancesCreated`, `chancesCreatedOP`,
`entriesOppBox`, `openPlayKeyPasses`,
`openPlayPassesIntoOpponentBoxSuccessful`, `progressivePassesReceived`,
`progressivePassesReceivedFinalThird`, `progressivePassesReceivedIntoBox`,
`progressivePassesReceivedOppHalf`, `scoringContribution`, `throughBalls`,
`touchesPerShot`, `xACrosses`, `xAssists`, `xAssistsOpenPlay`,
`xAssistsSetPiece`, `xGBuildup`, `xGBuildup5pass`, `xGBuildupFinalThird`,
`xGChain`, `xGChainFinalThird`, `xT`, `xTDribbling`, `xTOpenPlay`,
`xTPassing`, `xTPassing100Passes`

**`Defending`** — `aggressiveActions`, `blockedCrosses`, `blockedShots`,
`breadth`, `clearances`, `defensiveActions`, `defensiveDistance`,
`defensiveDuelsPct`, `duelsDefTotal`, `duelsLost`, `duelsPct`, `duelsTotal`,
`fouls`, `foulsOwnHalfPct`, `highDefensiveActionPct`, `individualPressure`,
`individualPressureOppHalf`, `interceptions`, `quickRecoveries`,
`quickRecoveriesPct`, `recoveries`, `recoveriesOppHalf`, `redCards`,
`tacklesAttempted`, `tacklesSuccessful`, `tacklesWasDribbled`,
`tacklesWasDribbledFinalThird`, `tacklesWasDribbledFirstThird`,
`tacklesWasDribbledFouls`, `tacklesWasDribbledSecondThird`, `yellowCards`

**`BallHandling`** — `badActionsOwnHalf`, `ballRetention`,
`ballRetentionOppHalf`, `dribblesAttempted`, `dribblesFinalThird`,
`dribblesFinalThirdPct`, `dribblesOppHalf`, `dribblesOppHalfPct`,
`dribblesOwnHalf`, `dribblesOwnHalfPct`, `dribblesWonFinalThird`,
`dribblesWonOppHalf`, `dribblesWonOwnHalf`, `foulsTaken`, `penaltiesTaken`,
`successfulDribbles`, `successfulDribblesPct`, `touches`,
`touchesInOpponentBox`, `touchesOppBoxInTeam`

**`Carries`** — `assistEndingCarries`, `averageCarriesProgress`,
`avgCarriesDistance`, `carries`, `chanceEndingCarries`, `deepProgression`,
`deepProgressionFinalThird`, `goalEndingCarries`, `progressiveRuns`,
`shotEndingCarries`

**`Aerial`** — `aerialDefensive`, `aerialDefensivePct`, `aerialEfficiency`,
`aerialOffensive`, `aerialOffensivePct`, `aerialWins`, `aerialWinsPct`,
`aerialWonDefensive`, `aerialWonOffensive`, `aerials`, `aerialsPctOppBox`,
`aerialsPctOwnBox`, `aerialsTotalOppHalf`, `aerialsWonOppBox`,
`aerialsWonOppHalfPct`, `aerialsWonOwnBox`

**`Crosses`** — `completedCrosses`, `completedCrossesOP`, `crossEfficiency`,
`crosses`, `crosses6yardBox`, `crossing`, `crossingOP`

**`Turnovers`** — `dispossessed`, `goalEndingHighTurnovers`, `highTurnovers`,
`shotEndingHighTurnovers`

**`SequenceInvolvement`** — `goalEndingSequence`, `shotEndingSequence`

**`Saving`** (goalkeepers) — `catching`, `claimAccuracy`, `goalsConceded`,
`handPassing`, `savesInBox`, `savesInBoxPct`, `savesOutBox`,
`savesOutOfBoxPct`, `savesPct`, `shotsPerGoal`, `xGFacedOnTargetEfficiency`,
`xGFacedOnTargetPerGoalReceived`, `xGSavedPerXGFacedOnTarget`

**`Score`** — `score`

Goalkeepers carry all groups, not only `Saving`; the outfield groups are simply
mostly zero.

### Team stat groups (live)

Team rows carry `season`, `team` and `stats`. The group names are snake_case and
most groups are short.

**`shooting`** — `goals`, `headedGoals`, `nonPenaltyGoals`, `shots`,
`shotsOnTarget`, `xG`, `xGPerNpg`, `xGPerShot`, `xGSetPiece`

**`association`** — `assists`, `ballProgressionFinalThird`, `directness`,
`entriesOppBox`, `lengthPerPossession`, `numPossession10Passes`,
`openPlayPassesIntoOpponentBoxSuccessful`, `passesPerPossession`,
`passesPerShots`, `possession`, `ppda`, `rivalPossession`, `xAssists`,
`xGChain`, `xT`, `xTOpenPlay`

**`defending`** — `aggressiveActions`, `defensiveDistance`, `fouls`,
`highDefensiveActionPct`, `highDefensiveDistance`, `highRecoveries`,
`recoveriesOppHalf`, `tacklesWasDribbled`

**`saving`** — `goalsConceded`, `nonPenaltyGoalsAgainst`, `savesInBox`,
`savesOutBox`, `shotsAgainst`, `shotsOnTargetAgainst`,
`shotsOnTargetInBoxAgainst`, `shotsOnTargetOutBoxAgainst`, `xGAgainst`,
`xGPerNpgAgainst`, `xGPerShotAgainst`, `xGSetPieceAgainst`

**`passing`** — `averagePassDistance`, `passesPerLongBall`, `passingFinalThird`

**`predictive`** — `expectedPoints`, `points`

**`ball_handling`** — `penaltiesTaken`, `touchesInOpponentBox`

**`turnovers`** — `highTurnovers`, `shotEndingHighTurnovers`

**`aerial`** — `aerialDefensivePct`, `aerialWonOffensive`

**`crosses`** — `crossingPerXG`

**`sequence_involvement`** — `speedSequence`

**`carries`** — `deepProgression`

### Naming traps in the guide

The guide's field tables spell the ball-handling group `ball_handing`. Live team
responses use `ball_handling` and live player responses use `BallHandling`; the
`ball_handing` spelling appears in neither. The same kind of slip appears on the
player resource: the field table says `second_nationality`, and live responses
say `secondary_nationality`.

## Physical stat groups

Four groups, from `/physical-stats` and `/player-physical-stats`, as the guide
documents them. These could not be checked against live responses: on
2026-09-22 the physical endpoints returned no rows or a 409 for the seasons
tried, so the casing and metric lists below are the guide's, not observed.
Given the technical groups, expect them to differ.

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

Driblab's own metric family. The guide documents a single group, `out_play`.
Live responses from `GET /season/{id}/arrigo-metrics` (checked 2026-09-22)
carry **eight** groups, and several names mix an underscore and a space in the
same key, so quote them exactly:

| Group | Metrics |
|---|---|
| `out_play` | the bypassing metrics below, plus `bypassedDefendersPerCarry`, `bypassedDefendersPerPass`, `bypassedPlayersPerCarry`, `bypassedPlayersPerPass`, `carriesBypassingPlayers` |
| `line_breaking passes` | `lineBreakingPasses`, `lineBreakingPassesM`, `lineBreakingPassesMD`, `lineBreakingPassesPerPass`, `lineBreakingThroughBalls`, `linesBrokenByPasses`, `linesBrokenPerPass`, `passesPerLineBreakingPass` |
| `line_breaking carries` | `carriesPerLineBreakingCarry`, `lineBreakingCarries`, `lineBreakingCarriesD`, `lineBreakingCarriesM`, `lineBreakingCarriesMD`, `lineBreakingCarriesPerCarry`, `linesBrokenByCarries`, `linesBrokenPerCarry` |
| `line_breaking actions` | `lineBreakingActions`, `lineBreakingActionsD`, `lineBreakingActionsM`, `lineBreakingActionsMD`, `linesBrokenByActions` |
| `off_ball runs` | `offBallRuns`, `offBallRunsComingShort`, `offBallRunsCrossReceiver`, `offBallRunsOverlap`, `offBallRunsRunAhead`, `offBallRunsRunBehind`, `offBallRunsSupport`, `offBallRunsUnderlap` |
| `on_ball pressure` | `lightOnBallPressuresPct`, `strongOnBallPressuresPct`, `successfulLightOnBallPressures`, `successfulStrongOnBallPressures`, `totalLightOnBallPressures`, `totalStrongOnBallPressures` |
| `pass_under pressure` | `passingUnderLightPressure`, `passingUnderStrongPressure`, `successfulPassesUnderLightPressure`, `successfulPassesUnderStrongPressure`, `totalPassesUnderLightPressure`, `totalPassesUnderStrongPressure` |
| `ball_received` | `passReceiptsInSpace`, `passReceiptsInSpaceCompleted` |

The guide defines none of these metrics, so the readings below for `out_play`
come from the names and from the guide's sample values, not from Driblab.

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

**One endpoint breaks the shape, according to the guide.** (Not observed live:
on 2026-09-22 this endpoint returned `409` for the team tried.)
`GET /team/{id}/game-stats` returns `stats` as
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
