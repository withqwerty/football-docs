# FBref

Football Reference (fbref.com). The most comprehensive free source for season-level aggregated statistics. Powered by StatsBomb data since 2017/18 for the top 5 European leagues.

## What's available

### Team stats (per season)

| Category | Examples |
|----------|---------|
| Standard | Goals, assists, xG, xAG, progressive passes/carries |
| Shooting | Shots, SoT, shot distance, free kicks, penalties |
| Passing | Total/short/medium/long, key passes, final third passes, progressive passes |
| Pass types | Live ball, dead ball, free kicks, through balls, switches, crosses |
| Goal and shot creation | SCA, GCA, types (live, dead, take-on, shot, foul, defensive) |
| Defensive | Tackles, interceptions, blocks, clearances, errors |
| Possession | Touches by zone, take-ons, carries, progressive carries, receiving |
| Goalkeeper | Save %, PSxG, crosses stopped, sweeper actions |

### Access methods

**Python (soccerdata):**

```python
import soccerdata as sd
fbref = sd.FBref('ENG-Premier League', '2024')
team_stats = fbref.read_team_season_stats(stat_type='standard')
player_stats = fbref.read_player_season_stats(stat_type='shooting')
```

**R (worldfootballR):**

```r
library(worldfootballR)
team_stats <- fb_season_team_stats("ENG", "M", 2024, "standard")
player_stats <- fb_big5_advanced_season_stats(season_end_year=2024, stat_type="standard")
```

## Coverage

Top 5 European leagues + Championship + Champions League. Stats from 1990s, xG from 2017/18.

## Caveats

- xG data is from StatsBomb. FBref doesn't compute its own.
- No event-level data (pass-by-pass). Only aggregates.
- Rate limit: max ~10 requests per minute. Use `time.sleep(6)` between requests.
- Cache results locally. Aggressive scraping will get you blocked.
