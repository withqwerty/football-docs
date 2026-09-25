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
| `ppda.att` / `ppda.def` | PPDA components (pressing intensity) |
| `ppda_allowed.att` / `ppda_allowed.def` | Opponent PPDA components |

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

Understat pages now return a shell without the former embedded JSONP blobs. Fetch the
AJAX endpoints instead. The `X-Requested-With` header is required; the browser headers
below also make the request shape explicit. `requests` handles the compressed response.

The season in a league or team path is the start year: `2026` means the 2026/27
campaign.

```python
import requests

BASE = "https://understat.com/"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": BASE,
    "Accept": "application/json, text/javascript, */*; q=0.01",
}

def get_understat_data(path):
    response = requests.get(
        f"{BASE}{path.lstrip('/')}", headers=HEADERS, timeout=30
    )
    response.raise_for_status()
    return response.json()

# League data: teams, players and match dates
league = get_understat_data("getLeagueData/Serie_A/2026")

# Team match-by-match data and season statistics
team = get_understat_data("getTeamData/AC_Milan/2025")

# Match shots and rosters
match = get_understat_data("getMatchData/12345")
home_shots = match["shots"]["h"]
away_shots = match["shots"]["a"]

# Player profile, aggregates and shots
player = get_understat_data("getPlayerData/1250")
player_shots = player["shots"]
```

### URL Patterns and API Paths

Use the page URL for a browser view and the corresponding API path for data access.
Team names use Understat's slug (for example, `AC_Milan`).

| Page | Page URL | API path |
|---|---|---|
| League | `https://understat.com/league/{league}/{season}` | `getLeagueData/{league}/{season}` |
| Player | `https://understat.com/player/{player_id}` | `getPlayerData/{player_id}` |
| Team | `https://understat.com/team/{team_name}/{season}` | `getTeamData/{team_name}/{season}` |
| Match | `https://understat.com/match/{match_id}` | `getMatchData/{match_id}` |

`league` is one of `EPL`, `La_Liga`, `Bundesliga`, `Serie_A`, `Ligue_1` or `RFPL`.

### API Response Keys

| API path | Response keys |
|---|---|
| `getLeagueData/{league}/{season}` | `teams` (dict keyed by team ID, each with `id`, `title` and `history`), `players` (list), `dates` (list) |
| `getTeamData/{team}/{season}` | `dates`, `players`, `statistics` (`situation`, `formation`, `gameState`, `timing`, `shotZone`, `attackSpeed`, `result`) |
| `getMatchData/{match_id}` | `shots` (`h` and `a`), `rosters` (`h` and `a`), `tmpl` |
| `getPlayerData/{player_id}` | `player`, `matches`, `groups`, `positionsList`, `minMaxPlayerStats`, `shots`, `lastMatch` |

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
- Match IDs are source-specific and don't map to other providers. Match by teams + date.
- Player names may differ from other sources (transliterations, shortened forms).

## Project use

Understat is useful as an xG enrichment source for match-result, season-story,
and game-state surfaces when the primary fixture provider does not include
shot-level or match-level xG. Cache by competition, season, team names, and match
date rather than by Understat match ID alone, because Understat IDs are not
portable across providers.

When joining to Opta, SportMonks, football-data.co.uk, or another fixture source:

- match by date plus home/away team aliases;
- keep the provider's final score as the fixture authority;
- store Understat `xG` and `xGA` as an enrichment layer;
- expose the xG model name so it is not confused with StatsBomb, Opta, or
  provider-supplied expected-goals values.
