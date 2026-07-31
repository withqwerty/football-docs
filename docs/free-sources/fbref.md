# FBref

Football Reference (fbref.com). A comprehensive free source for historical results,
basic statistics and squad information across 100+ competitions.

> **Advanced statistics were removed on 20 January 2026.** Stats Perform (which owns
> Opta, FBref's provider since 2022) terminated FBref's access to its feeds, and
> Sports Reference removed the Opta-sourced data with immediate effect. Everything
> beyond basic goals, assists and appearances went with it — xG, xAG, progressive
> passes and carries, shot- and goal-creating actions, defensive actions, possession
> and the advanced goalkeeping tables. No replacement provider has been announced.
>
> Anything written before that date describing FBref as a free xG source is stale.
> For xG, use Understat or StatsBomb open data instead.

## What's available

### Team stats (per season)

| Category | Examples |
|----------|---------|
| Standard | Goals, assists, appearances, minutes |
| Shooting | Goals, penalties (basic shooting only since January 2026) |
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

100+ competitions. Basic stats and results go back to the 1990s for many leagues. Advanced metrics existed from 2017/18 until January 2026 and are no longer served.

## Caveats

- FBref has never computed its own advanced metrics; they came from its data provider,
  and are unavailable since that agreement ended in January 2026.
- No event-level data (pass-by-pass). Only aggregates.
- Rate limit: max ~10 requests per minute. Use `time.sleep(6)` between requests.
- Cache results locally. Aggressive scraping will get you blocked.
