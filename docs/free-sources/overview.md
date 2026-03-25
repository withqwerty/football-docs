# Free Football Data Sources

## Overview

| Source | Data Type | Access Method | Coverage | Rate Limits |
|---|---|---|---|---|
| StatsBomb Open Data | Event-level (full) | GitHub download / API | Select matches (World Cups, specific leagues/seasons) | None |
| FBref | Aggregated stats | Web scrape / soccerdata | Top leagues, 5+ seasons | Strict (3s between requests) |
| Understat | xG, shot-level | Web scrape / soccerdata | Top 5 European leagues | Moderate |
| ClubElo | Historical Elo ratings | HTTP API | All top European leagues, 1946-present | Generous |
| football-data.co.uk | Match results + odds | CSV download | 25+ leagues, 20+ seasons | None |
| Transfermarkt | Market values, transfers, injuries | Web scrape | All professional leagues | Strict |
| WhoScored | Match ratings, event-level (limited) | Web scrape (headed browser) | Top leagues | Strict, requires JS rendering |
| European Football Statistics | Historical results | CSV download | Many European leagues | None |

## StatsBomb Open Data

**What it provides**: Full event-level data identical to their commercial product -- every pass, shot, duel, carry, pressure event with coordinates, xG, and freeze frames for shots.

**Coverage** (as of 2025):
- FIFA World Cups (2018, 2022)
- FIFA Women's World Cup (2019, 2023)
- UEFA Euro (2020, 2024)
- La Liga (2004/05-2020/21 -- Messi-era seasons)
- Premier League (select seasons)
- NWSL (multiple seasons)
- FA Women's Super League (multiple seasons)
- Champions League (select seasons)
- Various international tournaments

**Access**:
```bash
git clone https://github.com/statsbomb/open-data.git
```

Or via kloppy:
```python
from kloppy import statsbomb
dataset = statsbomb.load_open_data(match_id=3788741)
```

**Data format**: JSON files organised by competition and season. See `docs/providers/statsbomb/` for full event type documentation.

**License**: Free for non-commercial use with attribution. Must credit StatsBomb.

## FBref

**What it provides**: Comprehensive aggregated statistics sourced from Opta (via StatsPerform). Player-level and team-level stats across many categories.

**Stat categories**: Passing, shooting, pass types, goal & shot creation (GCA/SCA), defensive actions, possession, playing time, miscellaneous, goalkeeping, advanced goalkeeping.

**Coverage**: Top 5 European leagues + MLS, plus many others. Detailed stats from 2017/18 onwards (when Opta data begins); basic stats go back further.

**Access**: Web scraping or `soccerdata` Python library. See `fbref.md` for details.

**Key URL patterns**:
- Team: `https://fbref.com/en/squads/{team_id}/{team_name}-Stats`
- Player: `https://fbref.com/en/players/{player_id}/{player_name}`
- Match: `https://fbref.com/en/matches/{match_id}/{match_name}`
- Season: `https://fbref.com/en/comps/{comp_id}/{season}/stats`

## Understat

**What it provides**: Expected goals (xG) data at the shot level, plus player and team aggregated stats. Uses their own xG model.

**Coverage**: Top 5 European leagues (Premier League, La Liga, Bundesliga, Serie A, Ligue 1) from 2014/15 onwards. Russian Premier League also included.

**Access**: Web scraping or `soccerdata` Python library. See `understat.md` for details.

**Key data points**: Shot coordinates (x, y), xG per shot, result (goal/saved/blocked/missed), situation (open play/set piece/counter/penalty), body part, player, assist player.

## ClubElo

**What it provides**: Historical Elo ratings for European football clubs, updated daily during the season. The Elo model adjusts for home advantage, goal difference, and competition level.

**Coverage**: Most European leagues from 1946 to present. Updated daily during the season.

**Access**: Simple HTTP API returning CSV.

**API endpoints**:
```
# Single club history
http://api.clubelo.com/{club_name}
# Example: http://api.clubelo.com/Liverpool

# All clubs on a specific date
http://api.clubelo.com/{YYYY-MM-DD}
# Example: http://api.clubelo.com/2024-12-01

# All clubs in a country on a date
http://api.clubelo.com/{YYYY-MM-DD}/{country_code}
```

**Response format** (CSV):
```
Rank,Club,Country,Level,Elo,From,To
1,Liverpool,ENG,1,2050,2024-11-30,2024-12-07
```

**Used in**: myTeam's PL Era Champions story page (`scripts/fetch-elo-history.ts`).

## football-data.co.uk

**What it provides**: Match results, odds data, and basic match statistics. Excellent historical coverage.

**Coverage**: 25+ leagues, 20+ seasons. Premier League data back to 1993/94.

**Access**: Direct CSV download.

**URL pattern**: `https://www.football-data.co.uk/mmz4281/{season}/{league}.csv`

Season format: `2425` for 2024/25. League codes: `E0` (Premier League), `E1` (Championship), `SP1` (La Liga), `I1` (Serie A), `D1` (Bundesliga), `F1` (Ligue 1).

**CSV columns include**:
- `Date`, `HomeTeam`, `AwayTeam`, `FTHG`, `FTAG`, `FTR` (Full Time Result: H/D/A)
- `HTHG`, `HTAG`, `HTR` (Half Time)
- `HS`, `AS` (Shots), `HST`, `AST` (Shots on Target)
- `HC`, `AC` (Corners), `HF`, `AF` (Fouls), `HY`, `AY` (Yellows), `HR`, `AR` (Reds)
- Betting odds from multiple bookmakers (B365H, B365D, B365A, etc.)

## Transfermarkt

**What it provides**: Player market values, transfer history, contract details, injury history, squad information, manager history.

**Coverage**: Essentially all professional leagues worldwide. Market values from ~2004 onwards.

**Access**: Web scraping only (no official API). The site uses anti-scraping measures and requires setting a proper User-Agent header.

**Python libraries**:
- `transfermarkt-api` -- unofficial REST API wrapper
- Direct scraping with `requests` + `BeautifulSoup` (need to set `User-Agent` header)

**Key data points**:
- Player market values (current + historical)
- Transfer fees and dates
- Injury history with dates and types
- Contract expiry dates
- Squad lists with shirt numbers and positions

**Caveats**: Transfermarkt explicitly prohibits automated scraping in their ToS. Use responsibly with generous rate limiting and caching.

## WhoScored

**What it provides**: Match ratings, player ratings, event-level data (passes, shots, tackles, etc.) derived from Opta. Also provides match statistics, heat maps, and chalkboard visualisations.

**Coverage**: Top European leagues, Champions League, Europa League, international tournaments.

**Access**: Web scraping with a **headed browser** (JavaScript rendering required). The match data is embedded in the page as JavaScript objects.

**Data extraction**: Match event data is embedded in `matchCentreData` JavaScript variable. Requires executing JS or extracting from page source. See `docs/WHOSCORED_EVENT_DATA.md` for the full event type and qualifier reference.

**Key data points**: Full event stream (Opta-derived), player ratings (0-10), team statistics, formation data, touch heat maps.

**Caveats**:
- Requires headed browser (Puppeteer/Playwright) -- no simple HTTP scraping
- Rate limiting is strict; adding delays between requests is essential
- Data is Opta-sourced, so event types and qualifier IDs match Opta's system

**Used in**: myTeam's passmap data pipeline (`scripts/fetch-whoscored-events.ts` stores events in Postgres, `scripts/generate-passmap-data.ts` processes them).

## European Football Statistics

**What it provides**: Historical match results for European leagues.

**Access**: CSV download from `https://www.european-football-statistics.co.uk/`.

**Coverage**: Various European leagues with long historical records. Useful for pre-digital era results.

## Comparison Matrix

| Feature | StatsBomb Open | FBref | Understat | ClubElo | football-data.co.uk | Transfermarkt | WhoScored |
|---|---|---|---|---|---|---|---|
| Event-level data | Full | No | Shot-level | No | No | No | Full |
| Aggregated stats | Via events | Yes | Yes | No | Basic | No | Yes |
| xG | Yes | Yes (Opta) | Yes (own model) | No | No | No | No |
| Coordinates | Yes | No | Shot coords | No | No | No | Yes |
| Historical depth | Limited | 2017+ detailed | 2014+ | 1946+ | 1993+ | 2004+ | ~2010+ |
| League coverage | Select | Top 5+ | Top 5 | Europe | 25+ | Global | Top 5+ |
| Commercial use | No | No | Unclear | Yes | Yes | No | No |
| API available | GitHub | No | No | Yes (CSV) | CSV download | No | No |
