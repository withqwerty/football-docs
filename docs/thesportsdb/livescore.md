---
source_url: https://www.thesportsdb.com/docs_api_data
source_type: api_docs
upstream_version: "1 / 2"
crawled_at: 2026-07-09
---

# TheSportsDB Livescore Data

## Livescore Shape

The livescore payload is a compact match-state feed. Key fields include:

| Field | Meaning |
|---|---|
| `idLiveScore` | dynamic live-score row ID; not stable enough for project identity |
| `idEvent` | event/match ID; use this as the stable match join key |
| `strSport` | sport name, e.g. `Soccer` |
| `idLeague` / `strLeague` | league ID and display name |
| `idHomeTeam` / `idAwayTeam` | home/away team IDs |
| `strHomeTeam` / `strAwayTeam` | display names from the feed |
| `strHomeTeamBadge` / `strAwayTeamBadge` | badge image URLs |
| `intHomeScore` / `intAwayScore` | current or final score |
| `strProgress` | clock/progress text such as live minute text or `Final` |
| `strEventTime` | event start time as reported by the feed |
| `dateEvent` | event date in the API feed's local timezone |
| `updated` | feed update timestamp |

For scorigami or live-score bots, store `idEvent` and your own processed/final
state. Treat `idLiveScore` as a transient row identifier.

## Soccer Status Codes

The data guide documents soccer event statuses:

| Code | Meaning |
|---|---|
| `TBD` | time to be defined |
| `NS` | not started |
| `1H` | first half |
| `HT` | half-time |
| `2H` | second half |
| `ET` | extra time |
| `P` | penalties in progress |
| `FT` | match finished |
| `AET` | match finished after extra time |
| `PEN` | match finished after penalties |
| `BT` | break time in extra time |
| `SUSP` | suspended |
| `INT` | interrupted |
| `PST` | postponed |
| `CANC` | cancelled |
| `ABD` | abandoned |
| `AWD` | technical loss |
| `WO` | walkover |

Use the code/status, not only `strProgress`, when deciding whether a football
match is final.

## Project Caveats

- Team names are public display strings and may not match local canonical club
  names. Maintain a name map for variants such as `Brighton and Hove Albion`.
- Use TheSportsDB IDs for de-duplication and joins, then map to your canonical
  team IDs separately.
- Livescore is a polling surface. De-duplicate final-score actions so a cron
  worker does not post twice.
- Scores and statuses can be revised. Keep an audit trail for bot decisions.
- The API is multi-sport; always filter to soccer/football leagues or sport
  where the endpoint allows it.
