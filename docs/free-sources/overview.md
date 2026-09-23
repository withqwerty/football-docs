# Free Football Data Sources

## Overview

| Source | Data Type | Access Method | Coverage | Rate Limits |
|---|---|---|---|---|
| StatsBomb Open Data | Event-level (full) | GitHub download / API | Select matches (World Cups, specific leagues/seasons) | None |
| FBref | Results, basic stats (no advanced metrics since Jan 2026) | Web scrape / soccerdata | 100+ competitions | Strict (3s between requests) |
| Understat | xG, shot-level | Web scrape / soccerdata | Top 5 European leagues | Moderate |
| ClubElo | Elo ratings | Web pages (API now behind auth) | All top European leagues, public pages from ~2022 | Unknown |
| football-data.co.uk | Match results + odds | CSV download | 25+ leagues, 20+ seasons | None |
| engsoccerdata | Historical league results | R package / GitHub data | England 1888+, Spain 1928+, other leagues | None |
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
git clone https://github.com/hudl/open-data.git
```

Or via kloppy:
```python
from kloppy import statsbomb
dataset = statsbomb.load_open_data(match_id=3788741)
```

**Data format**: JSON files organised by competition and season. See `docs/providers/statsbomb/` for full event type documentation.

**License**: Free for non-commercial use with attribution. Must credit StatsBomb.

## FBref

**What it provides**: Historical results, basic player and team statistics, and squad
information across 100+ competitions.

**Advanced statistics ended on 20 January 2026**, when Stats Perform terminated
FBref's access to the Opta feeds that supplied them. No replacement has been
announced. Treat any guidance that presents FBref as a free source of xG or
possession-adjusted metrics as out of date.

**Stat categories still available**: goals, assists, appearances, minutes, cards and
match results. The advanced tables (passing detail, pass types, GCA/SCA, defensive
actions, possession, advanced goalkeeping) are no longer served.

**Coverage**: 100+ competitions. Basic stats and results run back to the 1990s for
many leagues. Advanced metrics covered 2017/18 to January 2026 only.

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

**What it provides**: Elo ratings for European football clubs, updated after each match. The Elo model adjusts for home advantage, goal difference, and competition level.

> **The public CSV API is gone (checked 23 September 2026).** `api.clubelo.com`,
> which served `http://api.clubelo.com/{club_name}` and
> `http://api.clubelo.com/{YYYY-MM-DD}` as CSV, now returns 502. The API has moved
> behind authentication, and registration is not open yet. Anything that uses the
> old endpoints, including the `soccerdata` ClubElo reader, no longer works.

**Access**: The website only. The pages are rendered on the server, with the data in the HTML. Each chart is a Vega-Lite spec assigned to a `vegaJson` variable in the page, with its rows under `datasets`.

| Page | Chart dataset fields | Range |
|---|---|---|
| `https://clubelo.com/` | `Name`, `Elo`, `Golo`, `Level`, `Federation`, `FedURL`, `TLC` (top 50 clubs) | Current |
| `https://clubelo.com/{club}` (e.g. `/Bayern`, `/Liverpool`) | `Date`, `Elo`, `Golo`, `segment_id` (one row per match) | About four years (from late 2022) |

The pages also carry HTML tables of recent and upcoming matches, with Elo win probabilities and rating changes per game. Club slugs are the site's own (`AstonVilla`, `AustriaWien`); take them from the links on the ranking page.

```python
import json, re, requests

def clubelo_history(club):
    """Rows from the rating chart on a ClubElo club page."""
    html = requests.get(f"https://clubelo.com/{club}", timeout=30).text
    spec = json.loads(re.search(r"var vegaJson = (\{.*?\});\s*\n", html, re.S).group(1))
    return next(iter(spec["datasets"].values()))

rows = clubelo_history("Bayern")   # [{"Date": "2022-09-30T00:00:00", "Elo": ..., "Golo": ..., "segment_id": 0}, ...]
```

**Coverage**: Ratings run from 1946 to the present, but the public pages expose only the recent chart window. The full history was available through the old API.

**Project use**: For run-in, fixture-difficulty, and season-story surfaces,
ClubElo is useful as a lightweight strength prior. Join by a maintained club
name map rather than assuming site labels match your canonical team labels.
ClubElo is a rating source, not a fixture/result source, so combine it with
fixtures from Opta, SportMonks, football-data.co.uk, or another schedule feed.

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

**Project use**: Excellent for scorigami, scoreline grids, baseline baking,
result-history charts, odds-history backfills, and simple match-stat trend
stories. For scorigami baselines, use full-time fields (`FTHG`, `FTAG`, `FTR`)
and ignore half-time or bookmaker columns unless the chart explicitly needs
them. Keep a league-code map in project code (`E0`, `E1`, `SP1`, etc.) and a
team-name map because historical labels and promoted/relegated club names can
drift from canonical names.

## engsoccerdata

**What it provides**: Historical football result datasets packaged for R by
James P. Curley. The GitHub package includes English league data, FA Cup data,
playoff data, and several European leagues including Spain, Germany, Italy,
France, Netherlands, Belgium, Portugal, Turkey, Scotland, Greece, South Africa,
and MLS.

**Useful datasets**:

| Dataset | Notes |
|---|---|
| `england` | English league results, top four tiers, from 1888/89 in the classic package docs |
| `englandplayoffs` | English playoff matches |
| `facup` | FA Cup results |
| `spain` | Spanish league results from 1928/29 in the classic package docs |

**Common fields**:

| Field | Meaning |
|---|---|
| `Date` | match date |
| `Season` | season start year |
| `home` / `visitor` | home and away teams |
| `FT` | full-time score string |
| `hgoal` / `vgoal` | home and away full-time goals |
| `division` | division label |
| `tier` | football pyramid tier |
| `result` | `H`, `A`, or `D` |

**Project use**: Useful as a deep historical baseline for scorigami and
marcadorigami-style scoreline grids. Pair with football-data.co.uk for recent
season gap fills or in-season updates. The package was formerly on CRAN and is
now best treated as a GitHub/open-data source; cite James P. Curley when using
it in public analysis.

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

## European Football Statistics

**What it provides**: Historical match results for European leagues.

**Access**: CSV download from `https://www.european-football-statistics.co.uk/`.

**Coverage**: Various European leagues with long historical records. Useful for pre-digital era results.

## Comparison Matrix

| Feature | StatsBomb Open | FBref | Understat | ClubElo | football-data.co.uk | engsoccerdata | Transfermarkt | WhoScored |
|---|---|---|---|---|---|---|---|---|
| Event-level data | Full | No | Shot-level | No | No | No | No | Full |
| Aggregated stats | Via events | Yes | Yes | No | Basic | No | No | Yes |
| xG | Yes | Yes (Opta) | Yes (own model) | No | No | No | No | No |
| Coordinates | Yes | No | Shot coords | No | No | No | No | Yes |
| Historical depth | Limited | 2017+ detailed | 2014+ | ~2022+ public (1946+ via API) | 1993+ | 1888+ England | 2004+ | ~2010+ |
| League coverage | Select | Top 5+ | Top 5 | Europe | 25+ | England + selected global leagues | Global | Top 5+ |
| Commercial use | No | No | Unclear | Yes | Yes | Non-commercial attribution expected | No | No |
| API available | GitHub | No | No | Behind auth | CSV download | R/GitHub data | No | No |
