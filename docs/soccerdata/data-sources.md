# soccerdata Data Sources

## FBref (sd.FBref)

Source: fbref.com, powered by StatsBomb/Opta data. HTTP-based, 7-second rate limit enforced. Supports "Big 5 European Leagues Combined" as a virtual league for efficient bulk scraping.

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_leagues()` | League metadata | -- | |
| `read_seasons()` | Available seasons with URLs | -- | Includes round-robin vs elimination format |
| `read_schedule()` | Match schedule | `[league, season, game]` | Columns: week, date, time, home/away team, home/away xG, score, game_id |
| `read_team_season_stats(stat_type)` | Aggregated team stats | `[league, season, team]` | |
| `read_team_match_stats(stat_type)` | Per-match team logs | `[league, season, team, game]` | Optional `team` filter |
| `read_player_season_stats(stat_type)` | Aggregated player stats | `[league, season, team, player]` | |
| `read_player_match_stats(stat_type)` | Per-match player stats | `[league, season, game, team, player]` | Optional `match_id` filter |
| `read_lineup(match_id=None)` | Lineups | `[league, season, game]` | jersey_number, position, minutes_played, is_starter |
| `read_events(match_id=None)` | In-match events | `[league, season, game]` | Goals, cards, substitutions with timing |

**Team season stat types**: `standard`, `keeper`, `keeper_adv`, `shooting`, `passing`, `passing_types`, `goal_shot_creation`, `defense`, `possession`, `playing_time`, `misc`.

**Team match stat types**: `schedule`, `keeper`, `shooting`, `passing`, `passing_types`, `goal_shot_creation`, `defense`, `possession`, `misc`.

**Player match stat types**: `summary`, `keepers`, `passing`, `passing_types`, `defense`, `possession`, `misc`.

## Understat (sd.Understat)

Source: understat.com. HTTP-based JSON API with initial cookie-setting request. Coverage: Big 5 European leagues only (EPL, La Liga, Serie A, Bundesliga, Ligue 1).

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_leagues()` | League metadata | -- | |
| `read_seasons()` | Season metadata with URLs | -- | |
| `read_schedule()` | Match schedule | `[league, season, game]` | Includes home/away xG, goals, team codes |
| `read_team_match_stats()` | Per-match team stats | `[league, season, game]` | points, expected_points, xG, npxG, PPDA, deep_completions |
| `read_player_season_stats()` | Player season aggregates | `[league, season, team, player]` | goals, xG, npG, npxG, assists, xA, shots, key_passes, xGChain, xGBuildup |
| `read_player_match_stats()` | Per-match player stats | `[league, season, game, team, player]` | minutes, goals, shots, xG, xGChain, xGBuildup, assists, xA |
| `read_shot_events()` | Shot-level data | `[league, season, game, team, player]` | xG, location_x/y, body_part, situation, result |

**Shot event fields**: `body_part` (Right Foot / Left Foot / Other), `situation` (Open Play / From Corner / Set Piece / Direct Freekick), `result` (Goal / Blocked Shot / Saved Shot / Missed Shot / Shot On Post / Own Goal).

## WhoScored (sd.WhoScored)

Source: whoscored.com (Opta event data). Selenium-based, requires Chrome/Chromium. Rate limit: 5s + 0-5s random delay. Constructor: `sd.WhoScored(leagues, seasons, path_to_browser=None, headless=False)`.

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_leagues()` | League metadata with region info | -- | |
| `read_seasons()` | Seasons with region/league/season IDs | -- | |
| `read_season_stages()` | Stages within seasons | -- | Group stages, knockouts, etc. |
| `read_schedule()` | Match schedule | `[league, season, game]` | |
| `read_missing_players()` | Injured/suspended players | `[league, season, game, team, player]` | Includes reason and status |
| `read_events()` | Detailed Opta event stream | `[league, season, game]` | See output formats below |

**Event output formats** (`output_fmt` parameter):
- `'events'`: DataFrame with columns: game_id, period, minute, second, expanded_minute, type, outcome_type, team, player, x, y, end_x, end_y, goal_mouth_y/z, blocked_x/y, qualifiers, is_touch, is_shot, is_goal, card_type, related_event_id
- `'raw'`: Original WhoScored JSON dict
- `'spadl'`: SPADL format (requires socceraction package)
- `'atomic-spadl'`: Atomic-SPADL format (requires socceraction package)
- `'loader'`: Returns socceraction OptaLoader instance
- `None`: Cache only, no return

## ClubElo (sd.ClubElo)

Source: clubelo.com. HTTP-based CSV API. Does not filter by league (global data). Elo scores available from 1939 (provisional before 1960).

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_by_date(date=None)` | All team Elo ratings for a date | `team` | Columns: rank, country, level, elo, from, to, league |
| `read_team_history(team)` | Full Elo timeline for one club | `from` (date) | `max_age` parameter controls cache age |

## ESPN (sd.ESPN)

Source: ESPN's public API (site.api.espn.com). HTTP-based JSON API.

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_schedule()` | Match schedule | `[league, season, game]` | date, home/away team, game_id |
| `read_matchsheet()` | Team-level match stats | `[league, season, game, team]` | venue, attendance, capacity, box score stats |
| `read_lineup()` | Detailed lineups | `[league, season, game, team, player]` | position, formation_place, sub times, per-player stats |

## Sofascore (sd.Sofascore)

Source: sofascore.com API. HTTP-based JSON API.

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_leagues()` | League metadata with league_id | -- | |
| `read_seasons()` | Season metadata with season_id | -- | |
| `read_league_table()` | Standings | `[league, season]` | MP, W, D, L, GF, GA, GD, Pts |
| `read_schedule()` | Match schedule | `[league, season, game]` | round, week, date, scores, game_id |

## SoFIFA (sd.SoFIFA)

Source: sofifa.com (FIFA video game ratings). HTTP-based, 1-second rate limit. Uses `versions` parameter instead of seasons -- maps to FIFA game database snapshots. Options: `'latest'` (default), `'all'`, specific version ID, or list of IDs.

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_leagues()` | League metadata | -- | |
| `read_versions()` | Available FIFA editions/updates | -- | version_id for each snapshot |
| `read_teams()` | Teams per league per version | -- | |
| `read_players(team=None)` | Player lists with player_id | -- | |
| `read_team_ratings()` | 23 team attributes | -- | overall, attack, midfield, defence, build_up_speed/dribbling/passing, etc. |
| `read_player_ratings()` | 36 individual player attributes | -- | overall, potential, crossing, finishing, dribbling, pace, etc. |

**Player rating attributes**: overall, potential, crossing, finishing, heading_accuracy, short_passing, volleys, dribbling, curve, fk_accuracy, long_passing, ball_control, acceleration, sprint_speed, agility, reactions, balance, shot_power, jumping, stamina, strength, long_shots, aggression, interceptions, positioning, vision, penalties, composure, defensive_awareness, standing_tackle, sliding_tackle, GK stats.

## MatchHistory (sd.MatchHistory)

Source: football-data.co.uk. HTTP-based CSV files. Historical match results with extensive betting odds.

**Methods**:

| Method | Returns | Index | Notes |
|---|---|---|---|
| `read_games()` | Comprehensive match data | `[league, season, game]` | See columns below |

**Key columns**: league, date, home/away team, referee, full-time/half-time goals, shots, shots on target, fouls, corners, cards, plus betting odds from multiple bookmakers (Bet365, Betway, Pinnacle, etc.). Full column documentation at football-data.co.uk/notes.txt.
