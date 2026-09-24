---
source_url: https://www.football-charts.com/developers
source_type: curated
upstream_version: "v1"
crawled_at: 2026-09-24
---

# Football Charts Data Model

## Response Envelope

Every Football Charts API (v1) response is a JSON object that ends with
`"attribution": "Data by football-charts.com"`. League-scoped endpoints echo
`league` and usually `season`; season-aware endpoints also return
`season_state` (for example `in_season`) and `current_season`. Scores are
strings in `home:away` form (`"3:0"`), never integers. Fields below were read
from live responses on 2026-09-24.

## Table Endpoint Fields

`GET /api/v1/leagues/{league}/table/?season=&view=classic|luck|goals` returns
`table`, an array of team rows ordered by `position`.

| Field | Type | Meaning |
|---|---|---|
| `id` | integer | internal row id (changes when the table is rebuilt; not a team id) |
| `team` | string | team display name |
| `position`, `played`, `won`, `drawn`, `lost` | integer | standard table columns |
| `goals_for`, `goals_against`, `goal_difference`, `points` | integer | standard table columns |
| `last_5_form` | string | last five results as W/D/L letters, e.g. `"WWDLW"` |
| `last_5_points` | integer | points from those five |
| `biggest_win`, `biggest_loss` | string | e.g. `"4:1 vs Crystal Palace"`; empty string if none |
| `avg_goals_scored`, `avg_goals_conceded`, `avg_total_goals` | number | per match |
| `home_goals_avg`, `away_goals_avg` | number | total goals per match by venue |
| `clean_sheets`, `failed_to_score` | integer | counts |
| `over_25_percentage`, `under_25_percentage` | number | % of matches with more / fewer than 2.5 total goals |
| `highest_scoring_match`, `lowest_scoring_match` | string | e.g. `"5:3 vs Sunderland"` |
| `updated_at` | string | ISO timestamp of the last rebuild |

`view` (`classic`, `luck`, `goals`; anything else returns 400 `bad_view`)
does not change the row shape. Rows also carry fields computed from pre-match
market prices (`expected_points`, `expected_position`, the `luck_*` and
`*_luck` fields, `luckiest_result`, `unluckiest_result`, and `roi_*` /
`profit_backing`); they are outside the scope of this document.

## Results Endpoint Fields

`GET /api/v1/leagues/{league}/results/?season=&team=` returns `count` and
`matches`, finished matches in date order. `team` is a case-insensitive
substring filter on either side.

| Field | Type | Meaning |
|---|---|---|
| `id` | integer | internal match id (results space; differs from the match endpoint's `id`) |
| `game_index` | integer | 1-based order within the season |
| `date` | string | `YYYY-MM-DD` |
| `time` | string | kick-off `HH:MM:SS` as published by the results source (local time, not normalised to UTC) |
| `homeTeam`, `awayTeam` | string | team display names (camelCase in this endpoint only) |
| `score` | string | full-time score `"h:a"` |
| `ht_result` | string | half-time score `"h:a"` |
| `first_goal_time` | integer or null | minute of the first goal; `null` when `goalless` |
| `first_goal_time_extra` | integer or null | currently always `0`/`null`, see stoppage time below |
| `goalless` | boolean | `true` for 0:0 |

## Goal Minutes And Stoppage Time

Football Charts stores a stoppage-time goal as the minute past the end of the
half: 45+2 is `47`, 90+4 is `94` (`first_goal_time` values above 90 are
common). `first_goal_time_extra` is not populated. Consequence: a minute of
46-50 can be first-half stoppage time or early second half. To split goals by
half, use `ht_result` rather than a cut at minute 45; in 2025-26 the two
methods differ by 4.7 percentage points across 92 leagues (46.2% of goals
before half-time by `ht_result`, 41.5% by minute <= 45).

## Goal-Timing Endpoint Fields

`GET /api/v1/leagues/{league}/goal-timing/?season=&team=` returns every goal
scored in the season, binned by minute, per team.

| Field | Type | Meaning |
|---|---|---|
| `time_bins` | array of string | `["0-15","15-30","30-45","45+","46-60","60-75","75-90","90+"]` |
| `stats.total_goals` | integer | goals in the league-season |
| `stats.match_count` | integer | matches counted |
| `stats.most_active_period` | string | bin with most goals |
| `stats.period_totals` | array of integer | league-wide totals per bin |
| `stats.late_goals` | integer | goals in the `75-90` and `90+` bins |
| `data[].team` | string | team display name |
| `data[].total` | integer | goals scored by the team |
| `data[].bins` | object | bin label -> goals scored |
| `data[].goals` | array of integer | the same counts in `time_bins` order |
| `data[].peak_bins`, `data[].peak_goals` | array, integer | team's busiest bin(s) and its count |
| `data[].late_share_pct`, `data[].first_half_pct` | integer | percentages of the team's goals |
| `data[].logo_url` | string | team logo |

`45+` and `90+` hold stoppage-time goals (see stoppage time above).
League totals (`stats`) are exact. Per-team bins are an approximation: the
stored goal minutes do not record the scoring side, so for a match won 2:1 the
home team is credited with the first two goal minutes and the away team with
the last one. Team bins are therefore wrong for matches where the order of
scoring does not follow that pattern.

## Fixtures Endpoint Fields

`GET /api/v1/leagues/{league}/fixtures/` returns `count` and `matches`,
upcoming matches from today on. Leagues between rounds return `count: 0`.

| Field | Type | Meaning |
|---|---|---|
| `slug` | string | match slug, usable with `/api/v1/matches/{slug}/` |
| `home_team`, `away_team` | string | team display names |
| `match_date` | string | `YYYY-MM-DD` |
| `time` | string | kick-off `HH:MM` in UTC |
| `status` | string | e.g. `scheduled` |
| `league`, `country`, `real_league_name` | string | league key, country, display name |
| `model_predictions` | object | baseline model outputs, see the model section |

## Baseline Model Output Fields

`model_predictions.dc_v2` appears on fixtures and on the match endpoint. It is
the output of a Dixon-Coles model (`model: "dc_v2.0"`) fitted on the league's
results.

| Field | Type | Meaning |
|---|---|---|
| `model` | string | model version, `dc_v2.0` |
| `raw.expected_home_goals`, `raw.expected_away_goals` | number | expected goals per side from the model |
| `raw.expected_ht_goals` | number | expected first-half goals |
| `raw.home`, `raw.away` | number | model probability of a home / away win (draw = 1 - home - away) |
| `raw.btts_yes` | number | probability both teams score |
| `raw.over_N.5` (N = 0..4), `raw.ht_over_0.5`, `raw.ht_over_1.5` | number | probability of more than N.5 goals (full time / first half) |
| `calibrated` | object | the same probabilities after a post-hoc adjustment step (subset of keys) |
| `ratings.home` / `ratings.away` | object | `attack`, `defence` parameters of each team |
| `xi` | number | time-decay rate per day (0.0019: a one-year-old match weighs about 0.5) |
| `sigma` | number | prior standard deviation of the attack/defence ratings |
| `effective_matches.home` / `.away` | number | weighted number of matches behind each rating |
| `data_through` | string | date of the latest result used |
| `data_status.stale`, `data_status.matches_behind` | boolean, integer | whether results were missing when computed |
| `computed_at` | string | ISO timestamp |

## Teams Endpoint Fields

`GET /api/v1/leagues/{league}/teams/?season=` returns `teams`.

| Field | Type | Meaning |
|---|---|---|
| `team` | string | display name |
| `slug` | string | team slug for `/teams/{team}/` |
| `position`, `points`, `played` | integer | current table values |
| `logo_url` | string | team logo |

## Team Detail Endpoint Fields

`GET /api/v1/leagues/{league}/teams/{team}/?season=` returns one team.

| Field | Type | Meaning |
|---|---|---|
| `team`, `slug`, `league`, `season` | string | identity |
| `seasons` | array of string | every season the team appears in (tier gating still applies to `?season=`) |
| `api_team_name` | string | the team's name at API-Football |
| `ranking` | object | the team's table row (same fields as the table endpoint) |
| `matches[]` | array | match log: `id`, `date`, `time`, `home`, `away`, `venue` (`H`/`A`), `score`, `ht`, `first_goal_time`, `outcome` (`W`/`D`/`L`), `match_slug` |
| `time_bins`, `goal_bins` | array | goals scored per 15-minute bin (same approximation as team goal-timing bins) |
| `first_goal_bins[]` | array | `time`, `count`: minute bin of the first goal in the team's matches, plus a `No Goal` entry |

In `matches[]`, `first_goal_time` is a string and `"111"` means the match had
no goal.
| `stats` | object or null | match-statistic averages, null where no statistics are held |

## Team Match-Statistics Fields

`stats` on the team detail endpoint averages the per-match statistics held for
that team-season (see data sources in api-access.md for coverage).

| Field | Type | Meaning |
|---|---|---|
| `matches_with_stats` | integer | matches the averages are based on |
| `shots_avg`, `shots_on_target_avg` | number | team's shots per match |
| `shots_against_avg` | number | opponents' shots per match |
| `possession_avg` | number | % |
| `corners_avg` | number | per match |
| `xg_avg`, `xg_against_avg` | number or null | average of API-Football's expected-goals value where that source provides one; null otherwise |

Per-match statistic rows (fouls, cards, saves, passes are also held) are not
exposed by the API.

## Projection Endpoint Fields

`GET /api/v1/leagues/{league}/projection/` returns `projection`, a Monte Carlo
simulation of the remaining season using the Dixon-Coles baseline.

| Field | Type | Meaning |
|---|---|---|
| `run_date` | string | date of the run |
| `n_sims` | integer | simulations (10,000) |
| `scheduled_remaining`, `expected_remaining` | integer | remaining matches |
| `partial_schedule` | boolean | true when not every remaining fixture is known |
| `teams.{team}.pts_now`, `.gd_now`, `.played` | integer | current values |
| `teams.{team}.mean_pts` | number | mean final points |
| `teams.{team}.p10_pts`, `.p90_pts` | integer | 10th / 90th percentile final points |
| `teams.{team}.title`, `.top4` | number | share of simulations finishing 1st / top four |
| `teams.{team}.bottom1`, `.bottom2`, `.bottom3` | number | share finishing in the bottom 1 / 2 / 3 |
| `teams.{team}.position_matrix` | array of number | share of simulations per final position |

`teams` is keyed by team display name.

## Match Endpoint Fields

`GET /api/v1/matches/{slug}/` returns `match`.

| Field | Type | Meaning |
|---|---|---|
| `id` | integer | internal fixture id (fixture space; differs from results `id`) |
| `slug`, `label` | string | match slug; `"Home vs. Away"` |
| `league`, `real_league_name`, `country`, `season` | string | league identity |
| `match_date`, `time`, `match_datetime` | string | date, local time, ISO UTC datetime |
| `home_team`, `away_team` | string | display names |
| `home_score`, `away_score` | integer or null | full-time goals |
| `ht_result` | string | half-time score |
| `match_status` | string | e.g. `ft`, `scheduled` |
| `finished_at` | string | ISO timestamp |
| `api_football_fixture_id`, `api_football_league_id` | integer | API-Football ids |
| `api_football_home_team_id`, `api_football_away_team_id` | integer | API-Football team ids |
| `home_team_logo`, `away_team_logo` | string | logo URLs |
| `model_predictions` | object | baseline model outputs (see the model section) |
