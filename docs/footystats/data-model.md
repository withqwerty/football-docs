---
source_url: https://footystats.org/api/documentations/
source_type: curated
upstream_version: null
crawled_at: 2026-09-24
---

# FootyStats data model

Response fields for the FootyStats API, taken from live responses on 2026-09-24,
mostly for Thai League 1 2026/27 (season ID 17367), with match 8688069 (an AFC
Champions League Elite game) for match-only fields. "Type" is the JSON type seen. Rows
say where a field was null, `-1`, empty, or missing. Odds and other betting fields are
deliberately left out: see the list in [api-access.md](api-access.md).

## Missing-value conventions in FootyStats responses

FootyStats marks missing data in several different ways, and a missing value is often
a real-looking number. Check for all of these before computing anything:

| Marker | Where seen | Meaning |
|---|---|---|
| `-1` (integer) | match stats before full time (`team_a_shots`, `team_a_corners`, `team_a_possession`, `attendance`); `height`, `weight`, `club_team_2_id`, `national_team_id`, `rank_in_*`, `penalty_success` on players; `winningTeam` on draws and unplayed matches; `revised_game_week` | Not recorded, not applicable, or not played yet |
| `"-1"` (string) | `bench[].player_out_time` for unused substitutes | No substitution |
| `null` | `refereeID` on every Thai League 1 match checked; `continent` on teams; `detailed` on many `player-stats` rows | Not available |
| `""` (empty string) | `stadium_name` on most `league-matches` rows; player name fields on a few rows | Not available |
| `0` | `team_a_xg`, `team_b_xg` on unplayed matches, and on 3 of 24 completed Thai League 1 matches; `min_per_goal_overall` when a player has no goals | Ambiguous: can mean "not recorded" rather than zero |

Treat `-1` and empty strings as missing, never as values. Treat a match xG of exactly
0 with suspicion unless the match had no shots.

## league-list entry fields

Each element of `league-list` `data` is one league with its seasons.

| Field | Type | Example | Notes |
|---|---|---|---|
| `name` | string | `"Thailand Thai League T1"` | Country plus league name |
| `country` | string | `"Thailand"` | |
| `league_name` | string | `"Thai League T1"` | |
| `image` | string | CDN URL | Competition logo |
| `season` | array of objects | `[{"id": 17367, "year": 20262027}]` | `id` is the season ID used by every season endpoint; `year` is an integer such as `2026` or `20262027` |

1,737 entries were returned on 2026-09-24. Some leagues appear under more than one
entry (for example separate regional divisions).

## league-season fields

`league-season?season_id=` returns one object. Key fields (231 fields besides the
`name_xx` translations):

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | integer | `17367` | Season ID |
| `name`, `english_name` | string | `"Thai League T1"` | |
| `name_th`, `name_jp`, ... | string or null | | About 40 translated names; many are null |
| `country`, `continent` | string | `"Thailand"`, `"as"` | |
| `season` | string | `"2026/2027"` | Label; single-year seasons use `"2026"` |
| `starting_year`, `ending_year` | integer | `2026`, `2027` | |
| `status` | string | `"In Progress"` | |
| `format` | string | `"Domestic League"` | |
| `division` | integer | `1` | |
| `comp_master_id` | integer | `317` | Stable competition ID across seasons (see identity-surfaces.md) |
| `clubNum` | integer | `16` | |
| `totalMatches`, `matchesCompleted` | integer | `240`, `24` | |
| `game_week`, `total_game_week` | integer | `4`, `30` | `game_week` is the current or next week, not the last completed one |
| `progress` | integer | `10` | Percent of season completed |
| `averageAttendance` | integer | `5954` | |
| `xg_avg` | number | `3.15` | Average total match xG (FootyStats' own model) |
| `total_goals`, `seasonAVG_overall` | integer, number | | Goals and goals per match |
| `homeWins`, `draws`, `awayWins` (+ `...Percentage`) | integer | | |
| `cornersAVG_*`, `cardsAVG_*`, `foulsAVG_*`, `shotsAVG_*`, `offsidesAVG_*` | number | | `_overall`, `_home`, `_away` variants, plus `...Total_*` counts |
| `goals_min_0_to_10` ... `goals_min_81_to_90`, `goals_min_0_to_15` ... `goals_min_76_to_90` | integer | | Goals by time band |
| `seasonBTTSPercentage`, `seasonCSPercentage` | integer | | Share of matches where both teams scored, and share of clean sheets |
| `seasonOver25Percentage_overall` and similar | integer | | Share of matches above a goal threshold (0.5 to 5.5) |
| `top_scorers`, `top_assists`, `top_clean_sheets` | array of player rows | | Same shape as `league-players` rows. Can include rows with empty name fields |

## Match fields (league-matches and match)

`league-matches` returns an array of matches. `match?match_id=` returns one match with
extra fields (see the next sections). Core fields shared by both:

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | integer | `8688069` | Match ID |
| `homeID`, `awayID` | integer | `1171`, `836` | Team IDs |
| `home_name`, `away_name` | string | `"Ratchaburi"` | Short display names |
| `competition_id` | integer | `17381` | The season ID the match belongs to |
| `season` | string | `"2026/2027"` | |
| `status` | string | `"complete"` | Only `complete` and `incomplete` were seen; no live state |
| `date_unix` | integer | `1789466400` | Kick-off, Unix seconds (UTC) |
| `game_week` | integer | `1` | Matchweek |
| `roundID` | integer | `125766` | One value for a whole league season |
| `homeGoalCount`, `awayGoalCount`, `totalGoalCount` | integer | `4`, `6`, `10` | `0` before kick-off |
| `homeGoals`, `awayGoals` | array of strings | `["71", "84", "90+5"]` | Goal minutes; stoppage time as `"90+5"` |
| `ht_goals_team_a`, `ht_goals_team_b` | integer | `0`, `3` | Half-time score |
| `winningTeam` | integer | `836` | Team ID of the winner; `-1` for a draw or unplayed match |
| `team_a_shots`, `team_a_shotsOnTarget`, `team_a_shotsOffTarget` | integer | `21`, `9`, `12` | `team_b_*` for away; `-1` until complete |
| `team_a_possession` | integer | `53` | Percent; `-1` until complete |
| `team_a_corners`, `team_a_offsides`, `team_a_fouls` | integer | | |
| `team_a_yellow_cards`, `team_a_red_cards`, `team_a_cards_num` | integer | | |
| `team_a_attacks`, `team_a_dangerous_attacks` | integer | `106`, `53` | Counts from FootyStats' feed; definitions not published |
| `team_a_throwins`, `team_a_freekicks`, `team_a_goalkicks` | integer | | Flags such as `throwins_recorded` say whether recorded |
| `team_a_penalties_won`, `team_a_penalty_goals`, `team_a_penalty_missed` | integer | | |
| `team_a_fh_corners`, `team_a_2h_corners`, `team_a_fh_cards`, `team_a_2h_cards` | integer | | By half |
| `team_a_xg`, `team_b_xg`, `total_xg` | number | `2.33`, `1.51`, `3.85` | FootyStats' own xG model; `0` when not available |
| `team_a_xg_prematch` | number | `2.19` | FootyStats' pre-match expected goals for the side |
| `attendance` | integer | `2974` | `-1` when not recorded |
| `stadium_name`, `stadium_location` | string | `"Mitr Phol Stadium"` | Often empty on `league-matches` |
| `refereeID` | integer or null | `null` | Null for all Thai matches checked |
| `coach_a_ID`, `coach_b_ID` | integer | `21976` | Manager IDs, usable with the `manager` endpoint |
| `home_ppg`, `away_ppg`, `pre_match_home_ppg`, ... | number | | Points per game |
| `no_home_away` | integer | `0` or `1` | Meaning not documented. It was `1` on an AFC Champions League Elite home match that was not at a neutral venue, so don't read it as "neutral venue" |
| `match_url`, `home_url`, `away_url`, `home_image`, `away_image` | string | | footystats.org paths |

Around 215 fields are returned per match. The ones not listed are mostly
time-band splits (`team_a_0_10_min_goals`, `team_a_corners_0_10_min`) and the betting
fields left out of these docs.

## Match-only fields: lineups and bench

`match` (not `league-matches`) returns `lineups` and `bench`, each an object with
`team_a` and `team_b` arrays.

| Path | Type | Example | Notes |
|---|---|---|---|
| `lineups.team_a[].player_id` | integer | `710639` | Starting XI |
| `lineups.team_a[].shirt_number` | integer | `3` | |
| `lineups.team_a[].player_events` | array | `[{"event_type": "Yellow", "event_time": "74"}]` | Goals and cards for that player |
| `bench.team_a[].player_in_id` | integer | `149270` | Substitute |
| `bench.team_a[].player_in_shirt_number` | integer | `5` | |
| `bench.team_a[].player_out_id` | integer | `707` | `-1` if the substitute did not come on |
| `bench.team_a[].player_out_time` | string | `"55'"` | Minute with a trailing apostrophe; `"-1"` if unused |
| `bench.team_a[].player_in_events` | array | `[{"event_type": "Goal", "event_time": "90+6"}]` | |

There are no formation strings and no pitch positions. The lineup gives shirt numbers
and player IDs only.

## Match-only fields: goal, card and corner details

| Path | Type | Example | Notes |
|---|---|---|---|
| `team_a_goal_details[].player_id` | integer | `160380` | Scorer |
| `team_a_goal_details[].assist_player_id` | integer | `44509` | Assister |
| `team_a_goal_details[].time` | string | `"90+5"` | |
| `team_a_goal_details[].type` | string | `"Right foot shot"`, `"Header"` | Body part or goal type |
| `team_a_goal_details[].extra` | null or string | `null` | |
| `team_a_card_details[].player_id` | integer | `467002` | |
| `team_a_card_details[].card_type` | string | `"Yellow"` | |
| `team_a_card_details[].time` | string | `"74"` | |
| `team_a_corner_timings` | array of strings | `["4", "9", "45+2"]` | Minute of each corner |
| `tv_stations` | array of strings | `["FanCode"]` | Broadcasters |
| `h2h.previous_matches_results` | object | `team_a_wins`, `draw`, `totalMatches` | Head-to-head record |
| `h2h.previous_matches_ids` | array | | Earlier meetings |

`team_b_*` fields mirror the `team_a_*` ones for the away side.

## Team fields (league-teams, team, lastx)

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | integer | `1177` | Team ID, stable across competitions and seasons |
| `name` | string | `"Port FC"` | |
| `cleanName` | string | `"Port"` | On `league-teams` and `league-tables`; shorter display name |
| `english_name`, `full_name` | string | `"Port FC"` | |
| `alt_names` | array of strings | often empty | |
| `country` | string | `"Thailand"` | |
| `founded` | string | `"1967"` | A string; `"-1"` when unknown |
| `competition_id` | integer | `17367` | Season ID of this row; `-1` on `lastx` |
| `season` | string | `"2026/2027"` | |
| `table_position`, `performance_rank` | integer | `7` | |
| `stadium_name`, `stadium_address` | string | `"PAT Stadium"` | Seen on `team`, not on plain `league-teams` |
| `official_sites` | array of strings | | |
| `stats` | object | | Only with `league-teams?include=stats`, and always on `team` and `lastx` |

`team` returns one row per competition-season the team has played (34 rows for Port,
25 per page). `lastx` returns 3 rows (`last_x_match_num` 5, 6 and 10) summarising
recent form across competitions.

## Team stats object

The `stats` object on team rows holds about 1,045 fields. They follow a
`metric_scope` naming pattern, with scope `_overall`, `_home` or `_away`:

| Family | Example fields |
|---|---|
| Results | `seasonWinsNum_overall`, `seasonDrawsNum_home`, `seasonMatchesPlayed_away`, `seasonPPG_overall` |
| Goals | `seasonGoals_overall`, `seasonConceded_overall`, `seasonGoalDifference_overall`, `seasonScoredAVG_overall` |
| Clean sheets and failing to score | `seasonCS_overall`, `seasonCSPercentage_overall`, `seasonFTS_overall` |
| Match stats | `shotsAVG_overall`, `possessionAVG_overall`, `cornersAVG_overall`, `cardsAVG_overall` |
| Expected goals (FootyStats' model) | `xg_for_avg_overall`, `xg_against_avg_overall` (plus `_home`, `_away`) |
| Home advantage | `homeAttackAdvantage`, `homeDefenceAdvantage`, `homeOverallAdvantage` |
| Goal thresholds | `seasonOver25Percentage_overall`, `seasonBTTSPercentage_overall` |
| Timing | goals scored and conceded by minute band |

Checked values for Port, Thai League 1 2026/27 after three matches:
`seasonGoals_overall` 5, `possessionAVG_overall` 69, `shotsAVG_overall` 25.67.

## League table fields (league-tables)

`league-tables` returns an object, not an array:

| Key | Type | Notes |
|---|---|---|
| `league_table` | array | Current table, one row per team |
| `all_matches_table_overall`, `all_matches_table_home`, `all_matches_table_away` | array | Full, home-only and away-only tables |
| `specific_tables` | array | Per-round tables: `round`, `round_id`, `table`, `groups`, `description` |

Table row fields: `id` (team ID), `name`, `cleanName`, `position`, `points`,
`matchesPlayed`, `seasonWins_overall`, `seasonDraws_overall`, `seasonLosses_overall`,
`seasonGoals`, `seasonConceded`, `seasonGoalDifference`, `ppg_overall`, and home and away
splits. `zone` is an object such as `{"name": "AFC Champions League", "number": 1}`.
`corrections` is an integer points adjustment (`0` when none).

## Player season rows (league-players and player-stats)

`league-players?season_id=` returns one row per player for that competition-season.
`player-stats?player_id=` returns the same shape, one row per competition-season in
the player's career. About 65 fields:

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | integer | `44540` | Player ID |
| `competition_id` | integer | `17367` | Season ID of the row |
| `full_name`, `first_name`, `last_name`, `known_as`, `shorthand` | string | `"Ekkachai Sumrei"` | Can be empty strings on some rows |
| `position` | string | `"Defender"` | Usually `Goalkeeper`, `Defender`, `Midfielder` or `Forward`; rare finer values such as `"Centre Back"` also seen |
| `club_team_id` | integer | `666944` | Club **for this competition-season**, not the current club |
| `club_team_2_id` | integer | `-1` | Second club in the same season, or `-1` |
| `national_team_id` | integer | `-1` | |
| `nationality`, `continent` | string | `"Thailand"`, `"as"` | |
| `birthday` | integer | `596707200` | Unix seconds |
| `age` | integer | `37` | |
| `height`, `weight` | integer | `173` | `-1` when unknown |
| `appearances_overall`, `minutes_played_overall` | integer | `3`, `252` | `_home` and `_away` variants too |
| `goals_overall`, `assists_overall` | integer | | `_home` and `_away` variants |
| `penalty_goals`, `penalty_misses`, `penalty_success` | integer | | `penalty_success` is `-1` with no attempts |
| `clean_sheets_overall`, `conceded_overall` | integer | | |
| `goals_per_90_overall`, `assists_per_90_overall`, `goals_involved_per_90_overall` | number | `0.36` | Can be JSON integers (`0`) or decimals |
| `min_per_goal_overall`, `min_per_assist_overall`, `min_per_card_overall` | integer | `252` | `0` when there were no goals, assists or cards |
| `yellow_cards_overall`, `red_cards_overall`, `cards_overall` | integer | | |
| `rank_in_league_top_attackers`, `rank_in_club_top_scorer` | integer | | `-1` when not ranked |
| `last_match_timestamp` | integer | | Unix seconds |

`player-stats` rows can repeat: 13 of 34 rows for one player were exact duplicates of
another row. Deduplicate on (`competition_id`, `minutes_played_overall`) or on the
whole row before summing.

## Player detailed object (player-stats only)

`player-stats` rows can carry a `detailed` object with about 188 advanced fields. It is
`null` on many rows. For Thai League 1 it was present from 2025/26, not for 2024/25
or earlier. Field groups:

| Group | Example fields |
|---|---|
| Expected goals (FootyStats' model) | `xg_total_overall`, `xg_per_90_overall`, `npxg_total_overall`, `npxg_per_90_overall`, `xa_total_overall`, `xa_per_90_overall` |
| Shooting | `shots_total_overall`, `shots_on_target_per_90_overall`, `shot_conversion_rate_overall`, `shot_accuraccy_percentage_overall` (spelled with a double c) |
| Passing and creation | `passes_per_90_overall`, `pass_completion_rate_overall`, `key_passes_per_90_overall`, `accurate_crosses_per_90_overall`, `progressive_passes_total_overall` |
| Ball carrying | `dribbles_successful_per_90_overall`, `dribbles_successful_percentage_overall`, `dispossesed_per_90_overall` (spelled with one s before -ed) |
| Defending | `tackles_per_90_overall`, `interceptions_per_90_overall`, `clearances_per_90_overall`, `blocks_per_90_overall`, `aerial_duels_won_per_90_overall`, `duels_won_percentage_overall` |
| Goalkeeping | `saves_per_90_overall`, `save_percentage_overall`, `shots_faced_per_90_overall`, `punches_per_90_overall` |
| Ratings | `average_rating_overall` (a 0–10 match rating) |
| Coverage | `detailed_minutes_played_recorded_overall`, `detailed_matches_played_recorded_overall` |
| Percentiles | `*_percentile_overall` fields, for example `xg_per90_percentile_overall` |

The `_percentile_` fields are FootyStats' own ranks, and the comparison group is not
documented. Small samples give extreme values: a player with 36 minutes showed several
99th-percentile ranks. For a defensible comparison, compute percentiles yourself
against a stated group of players with a stated minimum of minutes.

`detailed_minutes_played_recorded_overall` can be lower than `minutes_played_overall`.
The per-90 values then rest on the recorded minutes only.

In two of 52 Thai League 1 2025/26 forwards with 900+ minutes, `xa_total_overall`
equalled `xg_total_overall` to two decimals. Check any xA value that exactly matches
the same player's xG before relying on it.

## Manager fields (manager)

`manager?manager_id=` returns one row per competition-season, with the same header
fields as player rows (`id`, `competition_id`, `full_name`, `known_as`, `nationality`,
`birthday`, `age`, `club_team_id`, `club_team_2_id`, `season`) plus:

| Field | Type | Notes |
|---|---|---|
| `appearances_overall` | integer | Matches in charge; `_home` and `_away` variants too |
| `wins_overall`, `draws_overall`, `losses_overall` | integer | |
| `wins_per_overall`, `draws_per_overall`, `losses_per_overall` | integer | Percentages |
| `goals_overall`, `conceded_overall` | integer | Team goals under the manager |
| `min_per_goal_overall`, `min_per_conceded_overall`, `min_per_card_overall` | integer | |
| `yellow_cards_overall`, `red_cards_overall` | integer | |
| `over25_overall` and similar | integer | Matches above a goal threshold |
| `total_matches_managed` | integer | Was `0` on the rows checked even when `appearances_overall` was not |

Manager rows repeat like player rows (two identical 2025/26 rows were seen), so deduplicate before summing. Manager IDs come from `coach_a_ID` and `coach_b_ID` on match rows.
