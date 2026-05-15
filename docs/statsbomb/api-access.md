# StatsBomb API Access

StatsBomb data can be accessed through three channels: the free open data repository, the statsbombpy Python library, and the commercial REST API.

---

## 1. Open Data (Free)

**Repository**: [github.com/statsbomb/open-data](https://github.com/statsbomb/open-data)

StatsBomb makes select competition data freely available for research and analysis. The data is provided as JSON files that mirror the commercial API's output format.

### Repository Structure

```
data/
├── competitions.json
├── matches/{competition_id}/{season_id}.json
├── events/{match_id}.json
├── lineups/{match_id}.json
└── three-sixty/{match_id}.json
```

### Available Competitions (Open Data)

**Men's International**
| Competition | Seasons |
|-------------|---------|
| FIFA World Cup | 1958, 1962, 1970, 1974, 1986, 1990, 2018, 2022 |
| UEFA Euro | 2020, 2024 |
| Copa America | 2024 |
| African Cup of Nations | 2023 |
| FIFA U20 World Cup | 1979 |

**Women's International**
| Competition | Seasons |
|-------------|---------|
| Women's World Cup | 2019, 2023 |
| UEFA Women's Euro | 2022, 2025 |

**Men's Club**
| Competition | Seasons |
|-------------|---------|
| La Liga (Spain) | 1973/74, 2004/05 through 2020/21 (most complete coverage) |
| Premier League (England) | 2003/04, 2015/16 |
| Champions League | 1970/71-72/73, 1999/00, 2003/04-2018/19 |
| 1. Bundesliga (Germany) | 2015/16, 2023/24 |
| Ligue 1 (France) | 2015/16, 2021/22, 2022/23 |
| Serie A (Italy) | 1986/87, 2015/16 |
| Major League Soccer | 2023 |
| Copa del Rey (Spain) | 1977/78, 1982/83, 1983/84 |
| Liga Profesional (Argentina) | 1981, 1997/98 |
| Indian Super League | 2021/22 |
| UEFA Europa League | 1988/89 |
| North American League | 1977 |

**Women's Club**
| Competition | Seasons |
|-------------|---------|
| FA Women's Super League (England) | 2018/19, 2019/20, 2020/21 |
| NWSL (USA) | 2018 |

### 360 Data Availability

360 freeze frame data is available for select competitions/seasons (indicated by non-null `match_available_360` in competitions.json). Competitions with 360 data include:
- FIFA World Cup 2022
- UEFA Euro 2020, 2024
- La Liga (recent seasons)
- Ligue 1 (2021/22, 2022/23)
- 1. Bundesliga 2023/24
- Women's World Cup 2023
- UEFA Women's Euro 2022
- Major League Soccer 2023

### Terms of Use

- Must credit "StatsBomb" as data source in any published work
- Must use the StatsBomb logo (available in their [Media Pack](https://statsbomb.com/media-pack/))
- Register at [statsbomb.com/resource-centre](https://www.statsbomb.com/resource-centre/) to receive data updates
- Subject to the [StatsBomb User Agreement](https://github.com/statsbomb/open-data/blob/master/doc/LICENSE.pdf)

### Fetching Open Data Directly

Raw JSON files can be fetched from GitHub:

```
https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json
https://raw.githubusercontent.com/statsbomb/open-data/master/data/matches/{comp_id}/{season_id}.json
https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/{match_id}.json
https://raw.githubusercontent.com/statsbomb/open-data/master/data/lineups/{match_id}.json
https://raw.githubusercontent.com/statsbomb/open-data/master/data/three-sixty/{match_id}.json
```

---

## 2. statsbombpy (Python Library)

**Install**: `pip install statsbombpy`
**Repository**: [github.com/statsbomb/statsbombpy](https://github.com/statsbomb/statsbombpy)

Python library for loading both open data and commercial API data into pandas DataFrames.

### Open Data Usage (No Authentication)

```python
from statsbombpy import sb

# List all available competitions
comps = sb.competitions()

# Get matches for a competition/season
matches = sb.matches(competition_id=43, season_id=106)

# Get events for a match
events = sb.events(match_id=3869685)

# Get lineups for a match
lineups = sb.lineups(match_id=3869685)

# Get 360 freeze frames for a match
frames = sb.frames(match_id=3869685)

# Get all events for a competition/season (parallelised)
all_events = sb.competition_events(
    country="International",
    division="FIFA World Cup",
    season="2022"
)

# Get all 360 frames for a competition/season
all_frames = sb.competition_frames(
    country="International",
    division="FIFA World Cup",
    season="2022"
)
```

### Commercial API Usage (Requires License)

```python
from statsbombpy import sb

# Option 1: Environment variables
# Set SB_USERNAME and SB_PASSWORD

# Option 2: Pass credentials explicitly
creds = {"user": "your@email.com", "passwd": "your-password"}
events = sb.events(match_id=12345, creds=creds)
```

### Concurrency

Set the `SB_CORES` environment variable to control parallelism for `competition_events()` and `competition_frames()`. Defaults to (detected cores - 2), minimum 4.

### Output Format

statsbombpy returns pandas DataFrames with events flattened into columns:

```python
events = sb.events(match_id=3869685)
# Returns DataFrame with columns like:
# id, index, period, timestamp, minute, second, type, possession,
# possession_team, play_pattern, team, player, position, location,
# pass_recipient, pass_length, pass_angle, pass_height, pass_end_location,
# shot_statsbomb_xg, shot_end_location, shot_outcome, shot_body_part, ...
```

The nested JSON objects (pass, shot, carry, etc.) are flattened with underscores: `shot.statsbomb_xg` becomes `shot_statsbomb_xg`.

---

## 3. Commercial REST API

**Access**: Requires a paid license from StatsBomb (contact sales@statsbomb.com)

### Authentication

HTTP Basic Auth with username (email) and password provided by StatsBomb. The
same credentials work across every endpoint.

### Endpoints

There is **no single base URL or global API version**. Each resource is
independently versioned and the API spans **two hostnames**
(`data.statsbombservices.com` and `data.statsbomb.com`). The full host/version
matrix, query parameters, and caveats (including a host typo in StatsBomb's own
Team Stats spec) are documented in **`api-endpoints.md`**. Summary:

| Resource | Path (see api-endpoints.md for host + version) |
|----------|-----------------------------------------------|
| Competitions | `/api/v4/competitions` |
| Matches | `/api/v6/competitions/{cid}/seasons/{sid}/matches` |
| Lineups | `/api/v4/lineups/{mid}` |
| Events | `/api/v8/events/{mid}` |
| 360 Frames | `/api/v2/360-frames/{mid}` |
| Player Mapping | `/api/v1/player-mapping?<params>` |
| Player Match / Season Stats | `/api/v5/matches/{mid}/player-stats`, `/api/v4/competitions/{cid}/seasons/{sid}/player-stats` |
| Team Match / Season Stats | `/api/v1/matches/{mid}/team-stats`, `/api/v2/competitions/{cid}/seasons/{sid}/team-stats` |

### Response Format

For competitions, matches, lineups, events, and 360 frames the commercial API
returns the same JSON structure as the open data files (more competitions,
fresher data). The **stats endpoints and player-mapping have no open-data
equivalent** — see the parity table below and the dedicated docs
(`player-match-stats.md`, `player-season-stats.md`, `team-match-stats.md`,
`team-season-stats.md`, `player-mapping.md`, `iq-metrics-glossary.md`).

### Open Data vs Commercial parity

| Capability | Open Data | Commercial API |
|---|---|---|
| Competitions / Matches / Lineups / Events / 360 | Yes (selective comps) | Yes (licensed scope) |
| Player & Team Match/Season Stats (IQ metrics) | **No** | Yes |
| Player Mapping (live/offline IDs) | **No** | Yes |
| Freshness | Irregular GitHub updates | Near-live for licensed comps |

Code written against open data cannot read OBV, xGChain, PPDA, PSxG, the IQ
metric catalogues, or live/offline IDs — these exist only in the commercial
feed.

### Rate Limits

The commercial API has rate limits that vary by license tier. StatsBomb
recommends caching responses locally and polling the Competitions/Matches
`*_updated` / `last_updated` timestamps to refetch only changed data (see
`api-endpoints.md` → Incremental sync).

---

## 4. Data Freshness

| Channel | Update Frequency |
|---------|-----------------|
| Open Data (GitHub) | Irregular (new competitions added periodically, existing data updated) |
| statsbombpy (open) | Mirrors GitHub repo |
| Commercial API | Near-live for licensed competitions (events typically available within hours of match completion) |

---

## 5. Alternative Libraries

### R
- **StatsBombR**: Official R package ([github.com/statsbomb/StatsBombR](https://github.com/statsbomb/StatsBombR))

### JavaScript/TypeScript
- No official library. Fetch JSON directly from the open data repo URLs or use the REST API with standard HTTP clients.

### kloppy (Python)
- [kloppy](https://github.com/PySport/kloppy) can load StatsBomb data and convert to a standardised format, useful for cross-provider analysis.

```python
from kloppy import statsbomb

dataset = statsbomb.load_open_data(match_id=3869685)
```
