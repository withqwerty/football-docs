# Understat

understat.com. Free xG data for the top 5 European leagues and Russian Premier League.

## What's available

### Shot-Level Data

Every shot in every match, with:

| Field | Type | Description |
|---|---|---|
| `id` | integer | Unique shot ID |
| `minute` | integer | Minute of the match |
| `result` | string | `"Goal"`, `"SavedShot"`, `"MissedShots"`, `"BlockedShot"`, `"ShotOnPost"` |
| `X` | float | X coordinate (0-1, normalised, left-to-right attacking) |
| `Y` | float | Y coordinate (0-1, normalised, top-to-bottom) |
| `xG` | float | Expected goals value for this shot |
| `player` | string | Shooter name |
| `player_id` | integer | Shooter ID |
| `h_a` | string | `"h"` (home) or `"a"` (away) |
| `situation` | string | `"OpenPlay"`, `"FromCorner"`, `"SetPiece"`, `"DirectFreekick"`, `"Penalty"` |
| `shotType` | string | `"RightFoot"`, `"LeftFoot"`, `"Head"` |
| `season` | integer | Season start year (e.g., `2024` for 2024/25) |
| `match_id` | integer | Match ID |
| `h_team` | string | Home team name |
| `a_team` | string | Away team name |
| `h_goals` | integer | Home team final goals |
| `a_goals` | integer | Away team final goals |
| `date` | string | Match date (YYYY-MM-DD) |
| `player_assisted` | string | Assist player name (if applicable) |
| `lastAction` | string | Action before the shot (see below) |

### Last Action Types

| Value | Description |
|---|---|
| `Pass` | Through pass or key pass |
| `Cross` | Cross into the box |
| `HeadPass` | Headed pass/layoff |
| `ThroughBall` | Through ball |
| `Rebound` | Rebound from save/block/post |
| `BallRecovery` | Won the ball back |
| `Aerial` | Won an aerial duel |
| `Standard` | Standard situation (set piece) |
| `Chipped` | Chipped ball |
| `LayOff` | Lay-off pass |
| `CornerAwarded` | From a corner |
| `None` | No preceding action recorded |

### Player Aggregated Stats

Per-player per-season:

| Field | Description |
|---|---|
| `games` | Matches played |
| `time` | Minutes played |
| `goals` | Goals scored |
| `xG` | Total expected goals |
| `assists` | Assists |
| `xA` | Total expected assists |
| `shots` | Total shots |
| `key_passes` | Key passes |
| `yellow_cards` | Yellow cards |
| `red_cards` | Red cards |
| `npg` | Non-penalty goals |
| `npxG` | Non-penalty expected goals |
| `xGChain` | xG chain (total xG of possessions player was involved in) |
| `xGBuildup` | xG buildup (xG chain minus shots and key passes) |

### Team Aggregated Stats

Per-team per-season, both `for` and `against`:

| Field | Description |
|---|---|
| `xG` / `xGA` | Expected goals for / against |
| `npxG` / `npxGA` | Non-penalty xG for / against |
| `deep` / `deep_allowed` | Deep completions (passes within 20m of goal) |
| `scored` / `missed` | Goals scored / conceded |
| `xpts` | Expected points |
| `npxGD` | Non-penalty xG difference |
| `ppda_att` / `ppda_def` | PPDA components (pressing intensity) |
| `oppda_att` / `oppda_def` | Opponent PPDA components |

## Access methods

**Python (soccerdata):**

```python
import soccerdata as sd
understat = sd.Understat('ENG-Premier League', '2024')
shots = understat.read_shot_events()  # Per-shot with xG
team_stats = understat.read_team_season_stats()
player_stats = understat.read_player_season_stats()
```

**Direct HTTP:**

Understat serves data as JSONP embedded in HTML pages. Parse with regex or use the soccerdata wrapper.

```python
import requests, re, json, codecs

def get_understat_data(url, var_name):
    """Extract embedded JSON data from Understat page."""
    html = requests.get(url).text
    match = re.search(rf"var {var_name}\s*=\s*JSON\.parse\('(.+?)'\)", html)
    if not match:
        raise ValueError(f"Could not find {var_name} in page")
    raw = match.group(1)
    decoded = codecs.decode(raw, 'unicode_escape')
    return json.loads(decoded)

# Match shots
shots = get_understat_data("https://understat.com/match/12345", "shotsData")
home_shots = shots["h"]
away_shots = shots["a"]

# Player shots
player_shots = get_understat_data("https://understat.com/player/1250", "shotsData")

# Team match-by-match
team_data = get_understat_data("https://understat.com/team/Liverpool/2024", "datesData")
```

### URL Patterns

```
# League:  https://understat.com/league/{league}/{season}
#          league: EPL, La_Liga, Bundesliga, Serie_A, Ligue_1, RFPL
#          season: start year (2024 for 2024/25)
# Player:  https://understat.com/player/{player_id}
# Team:    https://understat.com/team/{team_name}/{season}
# Match:   https://understat.com/match/{match_id}
```

### Embedded Data Variables

| Page | Variable | Content |
|---|---|---|
| League | `datesData` | Match-level team stats by date |
| League | `teamsData` | Team aggregated stats |
| League | `playersData` | Player aggregated stats |
| Match | `shotsData` | Shot-level data (`h` and `a` keys) |
| Match | `rostersData` | Player match stats |
| Player | `shotsData` | All shots for that player |
| Player | `groupsData` | Stats grouped by season/situation |
| Team | `datesData` | Match-by-match team stats |
| Team | `statisticsData` | Season aggregated stats |

## Coordinate System

Normalised 0-1:

- **X**: 0 (own goal line) to 1 (opponent goal line)
- **Y**: 0 (top touchline, TV perspective) to 1 (bottom touchline)

Conversions:

```python
# To 105x68m pitch
pitch_x = X * 105
pitch_y = Y * 68

# To Opta (0-100, Y inverted)
opta_x = X * 100
opta_y = (1 - Y) * 100
```

## xG model

Understat uses a neural network trained on ~100,000 shots. Features include:
- Shot distance and angle
- Body part (foot, head)
- Situation (open play, set piece, counter, penalty)
- Last action (pass, cross, through ball, dribble, etc.)

Their xG model is independent from StatsBomb and Opta. Values will differ. The model does not use freeze frame data (unlike StatsBomb).

## Coverage

| League | Available since |
|---|---|
| Premier League | 2014/15 |
| La Liga | 2014/15 |
| Bundesliga | 2014/15 |
| Serie A | 2014/15 |
| Ligue 1 | 2014/15 |
| Russian Premier League | 2014/15 |

## Caveats

- No official API. Data is scraped from the website.
- No rate limit documentation. Be respectful (1-2 req/sec).
- xG model methodology is not fully published. It's a black box.
- No event data beyond shots. No passes, tackles, etc.
- Data updates can lag 1-2 days after matches.
- Match IDs are internal and don't map to other providers. Match by teams + date.
- Player names may differ from other sources (transliterations, shortened forms).

## Used In

The myTeam project uses Understat data:
- `scripts/fetch-season-story.ts` references Understat xG data
- `src/data/game-state/understat-xg.json` stores cached xG values
- The `--skip-xg` flag on `fetch-season-story.ts` reuses existing Understat xG data
