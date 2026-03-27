# soccerdata Usage Guide

## Installation

```bash
pip install soccerdata

# With SPADL conversion support (for WhoScored events)
pip install soccerdata[socceraction]
```

## Basic Usage Pattern

All scrapers follow the same pattern: instantiate with league(s) and season(s), then call `read_*()` methods to get DataFrames.

```python
import soccerdata as sd

# Single league, single season
fbref = sd.FBref('ENG-Premier League', '2023-2024')

# Multiple leagues and seasons
fbref = sd.FBref(
    ['ENG-Premier League', 'ESP-La Liga'],
    ['2022-2023', '2023-2024']
)

# Fetch data -- returns pandas DataFrames
schedule = fbref.read_schedule()
team_stats = fbref.read_team_season_stats(stat_type="passing")
player_stats = fbref.read_player_season_stats(stat_type="standard")
```

## Season Format

Very flexible parsing -- all of these are equivalent:

```python
'2021', '21', '2020-2021', '2020/2021', '2020-21', '20-21', '20/21', 2021
```

Internally normalised to either single-year or multi-year format depending on league calendar. If no seasons are specified, defaults to the last 5 seasons.

## DataFrame Structure

All data returns as pandas DataFrames with **MultiIndex**. Common index patterns:

| Index Pattern | Used For |
|---|---|
| `[league, season, game]` | Match-level data |
| `[league, season, team]` | Team season aggregates |
| `[league, season, team, player]` | Player season stats |
| `[league, season, game, team, player]` | Player match stats |

**Game ID format**: `"YYYY-MM-DD home_team-away_team"` (constructed by `make_game_id()`).

**Column naming**: All columns converted to snake_case. FBref often has multi-level column headers (level 0 = stat category, level 1 = specific stat).

## Team Name Standardization

All scrapers apply `TEAMNAME_REPLACEMENTS` to normalize team names across sources. Add custom mappings in `~/soccerdata/config/teamname_replacements.json`:

```json
{
  "StandardName": ["Alternative1", "Alternative2"]
}
```

## Caching and Configuration

**Directory structure** (default `~/soccerdata/`):
- `data/` -- cached data files, subdirectories per source (FBref/, Understat/, etc.)
- `config/` -- `league_dict.json`, `teamname_replacements.json`
- `logs/` -- `info.log`, `error.log` (rotating, 1MB max, 10 backups)

**Environment variables**:

| Variable | Description | Default |
|---|---|---|
| `SOCCERDATA_DIR` | Base directory | `~/soccerdata` |
| `SOCCERDATA_NOCACHE` | Disable reading cache (`true`/`1`/`t`) | `false` |
| `SOCCERDATA_NOSTORE` | Disable writing cache | `false` |
| `SOCCERDATA_MAXAGE` | Max cache age in days | None (no expiry) |
| `SOCCERDATA_LOGLEVEL` | Logging level | `INFO` |

**Constructor cache parameters**:

```python
# Ignore cached data, always re-download
fbref = sd.FBref('ENG-Premier League', no_cache=True)

# Do not save downloaded data to disk
fbref = sd.FBref('ENG-Premier League', no_store=True)

# Custom cache directory
fbref = sd.FBref('ENG-Premier League', data_dir=Path('/tmp/soccerdata'))
```

For current (incomplete) seasons, cached data is automatically re-fetched. Use `force_cache=True` on read methods to override this and use cached data even for current seasons.

## Proxy Support

```python
# Tor proxy on default port 9050
fbref = sd.FBref('ENG-Premier League', proxy='tor')

# Custom SOCKS5 proxy
fbref = sd.FBref('ENG-Premier League', proxy='socks5://host:port')

# Rotating proxy list
fbref = sd.FBref('ENG-Premier League', proxy=['proxy1', 'proxy2'])

# Custom callable returning a proxy URL
fbref = sd.FBref('ENG-Premier League', proxy=my_proxy_function)
```

## Rate Limits and Retries

| Scraper | Rate Limit | Retry Behaviour |
|---|---|---|
| FBref | 7s between requests | Up to 5 retries |
| WhoScored | 5s + 0-5s random delay | 5 retries with exponential backoff (0s, 10s, 20s, 30s, 40s) |
| SoFIFA | 1s between requests | Up to 5 retries |
| Others | No explicit rate limit | Up to 5 retries |

## WhoScored-Specific Setup

WhoScored requires a browser for Selenium-based scraping:

```python
ws = sd.WhoScored(
    'ENG-Premier League', '2023-2024',
    path_to_browser='/usr/bin/chromium',  # optional, auto-detects
    headless=False  # headless may trigger anti-bot detection
)

# Get Opta event data
events = ws.read_events(output_fmt='events')  # DataFrame
raw = ws.read_events(output_fmt='raw')         # JSON dict
spadl = ws.read_events(output_fmt='spadl')      # SPADL format (needs socceraction)
```

## Cross-Source Workflow Example

```python
import soccerdata as sd

# Combine FBref stats with Understat xG data
fbref = sd.FBref('ENG-Premier League', '2023-2024')
understat = sd.Understat('ENG-Premier League', '2023-2024')

# Team names are automatically standardized across sources
team_stats = fbref.read_team_season_stats(stat_type="standard")
xg_stats = understat.read_team_match_stats()

# Match on standardized team names in the index
```
