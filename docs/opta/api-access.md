# Opta / Perform API Access

## theanalyst.com Feed

The public Opta Analyst website (theanalyst.com) uses a static feed key that provides access to Perform's soccerdata API.

| Detail | Value |
|--------|-------|
| Base URL | `https://api.performfeeds.com/soccerdata` |
| Required headers | `Referer: https://theanalyst.com/`, `Origin: https://theanalyst.com` |
| Response format | JSONP (wrapped in `cb(...)`) or JSON with `_fmt=json` |
| Rate limiting | None observed, but throttle to ~0.5s between calls |

## Available Endpoints

### Season-level (aggregate)

| Endpoint | Path | Notes |
|----------|------|-------|
| Tournament calendar | `/tournamentcalendar/{token}/active` | Lists active seasons |
| All seasons | `/tournamentcalendar/{token}?comp={compId}` | Full season history |
| Matches | `/match/{token}?tmcl={seasonId}&live=yes&_pgSz=380` | All fixtures + scores |
| Standings | `/standings/{token}?tmcl={seasonId}` | League tables (11 views) |
| Squads | `/squads/{token}?tmcl={seasonId}` | Full rosters |
| Top performers | `/topperformers/{token}?tmcl={seasonId}` | Season leaderboards |

### Per-match (fixture-level)

| Endpoint | Path | Size | Notes |
|----------|------|------|-------|
| Match stats | `/matchstats/{token}?fx={matchId}` | ~70KB | Team + player stats, lineups |
| Match events | `/matchevent/{token}?fx={matchId}` | ~1.6MB | Full F24 event stream |
| Pass matrix | `/passmatrix/{token}?fx={matchId}` | ~100KB | Passing networks |
| Expected goals | `/matchexpectedgoals/{token}?fx={matchId}` | ~154KB | Per-shot xG and xGOT |
| Possession | `/possession/{token}?fx={matchId}` | ~17KB | 5-min possession waves |
| Commentary | `/commentary/{token}?fx={matchId}` | ~54KB | Text commentary |

## Premier League Competition ID

`2kwbbcootiqqgmrzs6o5inle5`

## Data Availability

- Premier League seasons available back to 1901/02
- Per-match event data available for all played matches
- xG (q321) and xGOT (q322) available on `matchexpectedgoals` endpoint only (NOT on standard `matchevent`)
- Pass matrix includes average positions for all players

## Limitations

- This is an unofficial access path via theanalyst.com's frontend key
- No SLA or guaranteed uptime
- Token could be rotated at any time
- Some F24 qualifiers documented in the spec are not populated (e.g. q213 xG on matchevent)
- Data redistribution likely prohibited under Stats Perform terms
