---
source_url: https://www.api-football.com/documentation-v3
source_type: curated
upstream_version: 3.9.3
crawled_at: 2026-10-15
---

# API-Football v3 data model

Selected API-Football football response fields, checked on 2026-10-15.
**Table types are the types observed in the selected successful direct API
responses, not exhaustive schemas or non-null guarantees.** A field seen only
as null remains listed as null; its general type is not inferred.
`[]` marks an array element, and paths start at the response envelope.

Sources: [official documentation v3.9.3](https://www.api-football.com/documentation-v3)
and the structural evidence in `data/api-football-observations.json`.
No raw API responses are reproduced. Coverage is limited to the contexts
listed in [api-access.md](api-access.md).

## API-Football response envelope

The sampled API-Football GET responses share these envelope fields. The type
unions below span the successful, empty and parameter-error samples, including
`/status`.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `get` | string | Requested resource name |
| `parameters` | array / object | Query parameters; the no-parameter status sample used an array |
| `errors` | array / object | Empty array on success; object in the parameter-error sample |
| `results` | integer | Result counter; interpret in endpoint context |
| `paging.current` | integer | Current page |
| `paging.total` | integer | Total pages reported |
| `response` | array / object | Arrays for sampled football resources, object for status |

An empty successful `errors` array does not define failure responses: the
missing-season player query returned HTTP 200 with an `errors` object,
`results: 0` and `response: []`. The provider's
[rate-limit example](https://www.api-football.com/news/post/how-ratelimit-works)
also uses an `errors` object. The status sample returned `results: 0` with a
valid object response; a generic zero-result failure check would misclassify it.
Source: [account status](https://www.api-football.com/documentation-v3#section/Authentication/API-SPORTS-Account).

## API-Football leagues and season coverage

`GET /leagues` returns a competition, its country and `seasons[]`. Types below
come from `id=140&season=2024`, checked on 2026-10-15.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].league.id` | integer | Competition ID |
| `response[].league.name` | string | Competition name |
| `response[].league.type` | string | Competition type |
| `response[].country.name` | string | Country name |
| `response[].country.code` | string | Country code in this sample |
| `response[].seasons[].year` | integer | Season year |
| `response[].seasons[].start` | string | Season start date |
| `response[].seasons[].end` | string | Season end date |
| `response[].seasons[].current` | boolean | Current-season flag |
| `response[].seasons[].coverage.fixtures.events` | boolean | Event coverage flag |
| `response[].seasons[].coverage.fixtures.lineups` | boolean | Lineup coverage flag |
| `response[].seasons[].coverage.fixtures.statistics_fixtures` | boolean | Team match-statistics coverage |
| `response[].seasons[].coverage.fixtures.statistics_players` | boolean | Player match-statistics coverage |
| `response[].seasons[].coverage.standings` | boolean | Standings coverage |
| `response[].seasons[].coverage.players` | boolean | Player coverage |
| `response[].seasons[].coverage.injuries` | boolean | Absence coverage |

Coverage belongs to a competition-season and reflects availability at query
time. The portal explicitly says that true does not guarantee complete data
for every fixture; future seasons can have false flags before play starts.
Source: [leagues](https://www.api-football.com/documentation-v3#tag/Leagues/operation/get-leagues).

## API-Football teams and venues

`GET /teams` returns separate `team` and `venue` objects. These types were
observed for `id=541` on 2026-10-15; other teams may have missing information.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].team.id` | integer | Team ID |
| `response[].team.name` | string | Display name |
| `response[].team.code` | string | Short code |
| `response[].team.country` | string | Country |
| `response[].team.founded` | integer | Foundation year |
| `response[].team.national` | boolean | National-team flag |
| `response[].team.logo` | string | Logo URL |
| `response[].venue.id` | integer | Venue ID |
| `response[].venue.name` | string | Venue name |
| `response[].venue.city` | string | City |
| `response[].venue.capacity` | integer | Capacity |
| `response[].venue.surface` | string | Surface description |

Source: [teams](https://www.api-football.com/documentation-v3#tag/Teams/operation/get-teams).

## API-Football fixtures and scores

`GET /fixtures` returns fixture metadata, competitive context, two teams,
goals and score breakdowns. Samples include FT fixtures for league 140,
season 2024 and team 541, NS fixtures in season 2026, and selected single/batch
fixture queries. Live fixtures were not sampled.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].fixture.id` | integer | Fixture ID |
| `response[].fixture.referee` | null / string | Referee label |
| `response[].fixture.timezone` | string | Response time zone |
| `response[].fixture.date` | string | Fixture date-time |
| `response[].fixture.timestamp` | integer | Numeric fixture timestamp |
| `response[].fixture.status.short` | string | Status code |
| `response[].fixture.status.long` | string | Status label |
| `response[].fixture.status.elapsed` | integer / null | Elapsed match time |
| `response[].fixture.status.extra` | integer / null | Additional elapsed-time field where present |
| `response[].league.id` | integer | Competition ID |
| `response[].league.season` | integer | Season year |
| `response[].league.round` | string | Round label |
| `response[].teams.home.id` | integer | Home-team ID |
| `response[].teams.away.id` | integer | Away-team ID |
| `response[].teams.home.winner` | boolean / null | Home winner flag |
| `response[].teams.away.winner` | boolean / null | Away winner flag |
| `response[].goals.home` | integer / null | Home goals; null in the scheduled sample |
| `response[].goals.away` | integer / null | Away goals; null in the scheduled sample |
| `response[].score.halftime.home` | integer / null | Home half-time score |
| `response[].score.fulltime.home` | integer / null | Home full-time score |
| `response[].score.extratime.home` | null | No populated value in this sample |
| `response[].score.penalty.home` | null | No populated value in this sample |

Score breakdowns also have away-side fields. An unpopulated extra-time or
penalty score is not a zero. The optional `timezone` query selects a response
time zone; it does not create a different fixture identity.
Source: [fixtures](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures).

## API-Football fixture status codes

These codes come from the API-Football v3.9.3 fixture status table, checked on
2026-10-15. FT and NS were exercised in the selected completed/scheduled queries;
the remaining status catalogue is documentation-derived.

| Codes | Interpretation |
|---|---|
| `TBD`, `NS` | Scheduled; TBD date/time is not final |
| `1H`, `HT`, `2H` | First half, half-time break, second half |
| `ET`, `BT`, `P` | Extra time, extra-time break, penalty shootout in progress |
| `SUSP`, `INT` | Suspended or interrupted; not a normal final result |
| `LIVE` | In progress without the usual period or elapsed-time detail |
| `FT`, `AET`, `PEN` | Finished in regular time, after extra time, or after penalties |
| `PST`, `CANC`, `ABD` | Postponed, cancelled, or abandoned |
| `AWD`, `WO` | Technical loss or walkover |

The portal warns that competitions without live coverage can retain NS until
the result is entered after the match. Do not treat NS alone as proof that
the real-world match has not started. TBD, PST and CANC fixtures can carry
provisional dates. A date change is not evidence of a new fixture ID.
Source: [fixtures and status table](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures).

## API-Football fixture events

`GET /fixtures/events` returns match incidents. In the completed-fixture
sample, each array element contained the paths below. This is not evidence
for a feed of every on-ball action or tracking coordinates.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].time.elapsed` | integer | Event match minute |
| `response[].time.extra` | null | Additional minute was unpopulated in this sample |
| `response[].team.id` | integer | Event team ID |
| `response[].player.id` | integer | Event player ID |
| `response[].player.name` | string | Event player name |
| `response[].assist.id` | integer / null | Associated player ID where populated |
| `response[].assist.name` | null / string | Associated player name where populated |
| `response[].type` | string | Event family |
| `response[].detail` | string | Event detail |
| `response[].comments` | null | No populated comments in this sample |

The official table describes goals, cards, substitutions and VAR decisions.
Interpret `type` together with `detail`; an associated `assist` object should
not automatically be counted as a goal assist for every event family.
An additional events query for a scheduled fixture returned an empty array
with zero results and no errors; absence of incidents is not a parameter error.
Source: [events](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures-events).

## API-Football fixture lineups

`GET /fixtures/lineups` returns one object per team in the sampled fixture.
Starters are under `startXI`, not a flat player list shared with substitutes.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].team.id` | integer | Team ID |
| `response[].formation` | string | Formation label |
| `response[].coach.id` | integer | Coach ID |
| `response[].coach.name` | string | Coach name |
| `response[].startXI[].player.id` | integer | Starting player ID |
| `response[].startXI[].player.number` | integer | Shirt number |
| `response[].startXI[].player.pos` | string | Position label |
| `response[].startXI[].player.grid` | string | Formation-grid location |
| `response[].substitutes[].player.id` | integer | Substitute player ID |
| `response[].substitutes[].player.grid` | null | Not populated for these substitutes |

The documented grid format is `X:Y`, row and column within the formation.
It is not a metric pitch-coordinate system. Lineup availability depends on
coverage: the portal gives an indicative pre-match window and also describes
competitions whose lineups arrive only after the match.
The scheduled-fixture lineup query returned zero results and an empty array,
without errors. Do not invent a formation or players from an empty response.
Source: [lineups](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures-lineups).

## API-Football fixture team statistics

`GET /fixtures/statistics` groups named statistics by team. The completed
fixture was checked both without and with `half=true`; the field table covers
the main `statistics` array. The optional response also had `statistics_1h`
and `statistics_2h` arrays with named values.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].team.id` | integer | Team ID |
| `response[].statistics[].type` | string | Statistic name |
| `response[].statistics[].value` | integer / null / string | Heterogeneous statistic value |

Do not parse every value as a number or treat null as zero. Preserve the
statistic name and its representation before applying any unit conversion.
The sample does not establish an exhaustive catalogue or a unit for every
statistic. Source: [fixture statistics](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures-statistics).

## API-Football fixture player statistics

`GET /fixtures/players` groups players by team; each player has a
`statistics[]` array. These are match statistics, not `/players` season totals.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].team.id` | integer | Team ID |
| `response[].players[].player.id` | integer | Player ID |
| `response[].players[].statistics[].games.minutes` | integer / null | Minutes field |
| `response[].players[].statistics[].games.position` | string | Position label |
| `response[].players[].statistics[].games.rating` | null / string | Rating representation |
| `response[].players[].statistics[].games.substitute` | boolean | Substitute flag |
| `response[].players[].statistics[].goals.total` | integer / null | Goals field |
| `response[].players[].statistics[].goals.assists` | integer / null | Assists field |
| `response[].players[].statistics[].passes.total` | integer / null | Passes total field |
| `response[].players[].statistics[].passes.key` | integer / null | Key-passes field |
| `response[].players[].statistics[].passes.accuracy` | null / string | Accuracy representation; see the passes caveat |
| `response[].players[].statistics[].cards.yellow` | integer | Yellow-card field |
| `response[].players[].statistics[].cards.red` | integer | Red-card field |
| `response[].players[].statistics[].penalty.commited` | integer / null | Provider spelling, with one t |

Keep provider spellings when reading JSON; do not silently rename
`commited` to `committed`. A null rating or count is not a measured zero.
Source: [fixture player statistics](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures-players).

## API-Football standings

`GET /standings` wraps the standings in `response[].league.standings[][]`.
The inner lists preserve group structure; do not assume a single flat table.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].league.id` | integer | Competition ID |
| `response[].league.season` | integer | Season year |
| `response[].league.standings` | array | Array of group arrays |
| `response[].league.standings[]` | array | One group array |
| `response[].league.standings[][].team.id` | integer | Team ID |
| `response[].league.standings[][].rank` | integer | Rank in this table |
| `response[].league.standings[][].points` | integer | Points |
| `response[].league.standings[][].goalsDiff` | integer | Goal difference |
| `response[].league.standings[][].group` | string | Group label |
| `response[].league.standings[][].form` | string | Form representation |
| `response[].league.standings[][].description` | null / string | Qualification or other description where populated |
| `response[].league.standings[][].all.played` | integer | Overall matches played |
| `response[].league.standings[][].all.goals.for` | integer | Overall goals for |
| `response[].league.standings[][].all.goals.against` | integer | Overall goals against |
| `response[].league.standings[][].home.played` | integer | Home matches played |
| `response[].league.standings[][].away.played` | integer | Away matches played |
| `response[].league.standings[][].update` | string | Update label |

Source: [standings](https://www.api-football.com/documentation-v3#tag/Standings/operation/get-standings).

## API-Football player profiles and season statistics

`GET /players` returns a profile plus `statistics[]` blocks. All four pages of
the team 541, league 140, season 2024 query were checked: 62 player records,
without overlapping IDs across pages. Keep team, league and season with each
statistics block.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].player.id` | integer | Player ID |
| `response[].player.name` | string | Display name |
| `response[].player.birth.date` | string | Birth date |
| `response[].player.nationality` | string | Nationality label |
| `response[].player.height` | null / string | Height representation |
| `response[].player.weight` | null / string | Weight representation |
| `response[].player.injured` | boolean | Profile injury flag |
| `response[].statistics[].team.id` | integer | Statistics team context |
| `response[].statistics[].league.id` | integer | Statistics competition context |
| `response[].statistics[].league.season` | integer | Statistics season context |
| `response[].statistics[].games.appearences` | integer / null | Provider spelling of appearances |
| `response[].statistics[].games.lineups` | integer / null | Lineups field |
| `response[].statistics[].games.minutes` | integer / null | Minutes field |
| `response[].statistics[].games.rating` | null / string | Rating representation |
| `response[].statistics[].passes.total` | integer / null | Passes total field |
| `response[].statistics[].passes.key` | integer / null | Key-passes field |
| `response[].statistics[].passes.accuracy` | integer / null | Null on page 1; integers also observed on later pages |

The documented pagination parameter is `page`. A player can have statistics
for multiple teams in a season after a transfer. This endpoint is not a
complete current-squad list; `/players/squads` serves that different purpose.
Source: [player statistics](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players).

## API-Football passes accuracy representation caveat

Do not impose one type or formula on `passes.accuracy` across API-Football
endpoints. The official `/fixtures/players` example shows a percentage string;
the official `/players` example shows a number. In the 2026-10-15 live samples,
the match field was string or null, with no percent sign in the populated
strings. The season field was null throughout page 1; later pages contained
integers as well as null.

Those observations do not establish a universal unit, a completed-pass count
or a conversion formula. In particular, stripping characters and dividing by
100 without checking the endpoint would be an unsupported interpretation.
The same field name does not prove equivalent aggregation at match and season
level. Sources: [match example](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures-players),
[season example](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players).

## API-Football current squads

`GET /players/squads?team=...` returns team context and `players[]`, not the
profile-plus-season-statistics shape of `/players`. These types are from the
team 541 current-squad sample checked on 2026-10-15.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].team.id` | integer | Team ID |
| `response[].players[].id` | integer | Player ID |
| `response[].players[].name` | string | Player name |
| `response[].players[].age` | integer | Age |
| `response[].players[].number` | integer | Shirt number |
| `response[].players[].position` | string | Position |
| `response[].players[].photo` | string | Photo URL |

The portal documents `team` and `player` filters, with no `season` parameter.
A current squad does not establish which club a player belonged to in a past
season. Source: [squads](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players-squads).

## API-Football injuries and fixture absences

`GET /injuries` records absences in a fixture context. Types below were checked
for team 541, league 140, season 2024. Reason and availability classification
are inside the `player` object, not top-level fields of the record.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].player.id` | integer | Player ID |
| `response[].player.type` | string | Availability classification |
| `response[].player.reason` | string | Reported reason |
| `response[].team.id` | integer | Team ID |
| `response[].fixture.id` | integer | Fixture ID |
| `response[].fixture.date` | string | Fixture date-time |
| `response[].league.id` | integer | Competition ID |
| `response[].league.season` | integer | Season context |

The portal distinguishes `Missing Fixture` from `Questionable`; the latter
does not confirm that the player will miss the match. It describes absences
for reasons including injuries and suspensions, so the resource name is not
proof that every entry is a medical injury.
Source: [injuries](https://www.api-football.com/documentation-v3#tag/Injuries/operation/get-injuries).

## API-Football transfers

`GET /transfers` returns player records with nested `transfers[]`. The team
541 sample was not season-filtered; do not assign it a season from another
request's context.

| Field path | Observed type(s) | Meaning |
|---|---|---|
| `response[].player.id` | integer | Player ID |
| `response[].player.name` | string | Player name |
| `response[].update` | string | Update label |
| `response[].transfers[].date` | string | Transfer date |
| `response[].transfers[].type` | string | Provider transfer-type description |
| `response[].transfers[].teams.in.id` | integer / null | Incoming team ID where known |
| `response[].transfers[].teams.in.name` | null / string | Incoming team name where known |
| `response[].transfers[].teams.out.id` | integer / null | Outgoing team ID where known |
| `response[].transfers[].teams.out.name` | null / string | Outgoing team name where known |

Preserve the direction of `teams.in` and `teams.out`, and handle unknown teams.
The `type` field is a string; this sample does not establish a structured fee
amount/currency contract or a player's market valuation.
Source: [transfers](https://www.api-football.com/documentation-v3#tag/Transfers/operation/get-transfers).
