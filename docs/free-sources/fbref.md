---
source_url: https://www.sports-reference.com/blog/2026/01/fbref-stathead-data-update/
archived_url: https://web.archive.org/web/20260709014630/https://www.sports-reference.com/blog/2026/01/fbref-stathead-data-update/
source_type: curated
---

# FBref

Football Reference (fbref.com). A comprehensive free source for historical results,
basic statistics and squad information across 100+ competitions.

> **Advanced statistics were removed on 20 January 2026.** Sports Reference announced
> that the provider of its advanced soccer data (not named in the announcement) sent a
> letter terminating its access to the provider's data feeds and requiring deletion of
> that data from the site immediately. Sports Reference removed the provider's data from
> FBref and Stathead. The post does not list the removed stats; FBref's squad pages no
> longer carry the xG columns or the passing, pass types, goal and shot creation,
> defensive actions, possession and advanced goalkeeping tables. Sports Reference said
> FBref will continue to present its historic basic data, and that any advanced data it
> presents in future will be on a dramatically smaller scale.
>
> Anything written before that date describing FBref as a free xG source is stale.
> For xG, use Understat or StatsBomb open data instead.

## What's available

### Team stats (per season)

| Category | Examples |
|----------|---------|
| Standard | Players used, average age, possession, matches, starts, minutes, goals, assists, non-penalty goals, penalties, yellow and red cards, per-90 rates |
| Goalkeeping | Goals against, shots on target against, saves, save %, wins/draws/losses, clean sheets, penalties faced and saved |
| Shooting | Goals, shots, shots on target, shots on target %, goals per shot, goals per shot on target, penalties |
| Playing time | Minutes per match, starts, complete matches, substitute appearances, unused substitute, points per match, on-pitch goals for and against, plus/minus |
| Miscellaneous | Cards, fouls committed and drawn, offsides, crosses, interceptions, tackles won, penalties won and conceded, own goals |

No longer served since January 2026: Passing, Pass types, Goal and shot creation,
Defensive actions, Possession (touches, carries, take-ons) and Advanced goalkeeping
tables, and all xG columns.

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
  and are unavailable since the provider terminated FBref's access in January 2026.
- No event-level data (pass-by-pass). Only aggregates.
- Rate limit: max ~10 requests per minute. Use `time.sleep(6)` between requests.
- Cache results locally. Aggressive scraping will get you blocked.
