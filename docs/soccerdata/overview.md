# soccerdata

## Overview

soccerdata is a Python library that scrapes football data from popular websites and returns pandas DataFrames with consistent, matching column names and identifiers across datasets. Data is downloaded on demand and cached locally. Licensed under Apache 2.0, authored by Pieter Robberechts (KU Leuven).

- **Install**: `pip install soccerdata` (optional: `pip install soccerdata[socceraction]` for SPADL conversion)
- **Python**: >=3.9, <3.14
- **Key dependencies**: pandas, lxml, seleniumbase (Selenium scrapers), tls_requests, html5lib, unidecode

## Supported Sources

| Scraper Class | Source | Access Method | Rate Limit | Coverage |
|---|---|---|---|---|
| `sd.FBref` | fbref.com (Opta/StatsBomb data) | HTTP (tls_requests) | 7s between requests | Top leagues + many more, 2017/18+ for detailed stats |
| `sd.Understat` | understat.com | HTTP (JSON API) | None explicit | Big 5 European leagues only |
| `sd.WhoScored` | whoscored.com (Opta data) | Selenium (Chrome) | 5s + 0-5s random | Top leagues, detailed event data |
| `sd.Sofascore` | sofascore.com | HTTP (JSON API) | None explicit | Wide coverage |
| `sd.ESPN` | ESPN public API | HTTP (JSON API) | None explicit | Top leagues |
| `sd.ClubElo` | clubelo.com | HTTP (CSV API) | None explicit | All European clubs, 1939-present |
| `sd.SoFIFA` | sofifa.com (FIFA game ratings) | HTTP | 1s between requests | All FIFA-rated leagues |
| `sd.MatchHistory` | football-data.co.uk | HTTP (CSV download) | None | 25+ leagues, results + betting odds |

## Built-in League Support

| League ID | FBref | Understat | WhoScored | ESPN | Sofascore | ClubElo | MatchHistory | SoFIFA |
|---|---|---|---|---|---|---|---|---|
| ENG-Premier League | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| ESP-La Liga | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| ITA-Serie A | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| GER-Bundesliga | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| FRA-Ligue 1 | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| INT-World Cup | Yes | - | Yes | - | - | - | - | - |
| INT-European Championship | Yes | - | Yes | - | Yes | - | - | - |

Custom leagues can be added via `~/soccerdata/config/league_dict.json`.

## Architecture

Two base reader classes:
- **`BaseRequestsReader`** -- uses `tls_requests` (TLS-fingerprint-resistant HTTP client, not standard `requests`). Used by: FBref, Understat, ClubElo, ESPN, Sofascore, SoFIFA, MatchHistory.
- **`BaseSeleniumReader`** -- uses SeleniumBase with undetected-chromedriver (Chrome). Used by: WhoScored only. Constructor accepts `path_to_browser` and `headless` (default `False`).

Both inherit from abstract `BaseReader` which provides caching, proxy management, league/season selection.

## Limitations and Caveats

- **Web scraping is fragile**: The README warns "any changes to the scraped websites will break the package."
- **Anti-scraping / IP blocking**: WhoScored uses Incapsula protection (code checks for "Incapsula incident ID"). FBref enforces strict 7s rate limits. All HTTP scrapers use TLS-fingerprint-resistant requests.
- **WhoScored requires Chrome browser**: Slower, more resource-intensive, harder to run in CI. Headless mode may trigger anti-bot detection.
- **Limited built-in leagues**: Only 5+3 leagues built-in. Understat only covers Big 5 European leagues.
- **No authentication required**: All scrapers use public-facing websites/APIs.
- **FBref multi-level columns**: Returns DataFrames with multi-level column headers (category + stat) that can be tricky to work with.
- **SoFIFA uses FIFA game versions**, not real-world seasons. The `versions` parameter maps to specific game database snapshots.
