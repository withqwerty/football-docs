---
source_url: https://apidocs.wyscout.com/
source_type: crawled
upstream_version: v3 2024-03-12 / v4 2024-05-09
crawled_at: 2026-06-03
---

# Wyscout API Endpoints (v3 and v4)

Full endpoint inventory for the Wyscout REST API, extracted from the OpenAPI specs behind [apidocs.wyscout.com](https://apidocs.wyscout.com/). All endpoints are `GET`, require HTTP Basic auth, and return JSON. Base URLs: `https://apirest.wyscout.com/v3` (Current) and `https://apirest.wyscout.com/v4` (Preview). See [api-access.md](api-access.md) for auth, pagination and the `fetch`/`details`/`exclude` expansion model.

v3 exposes **46** endpoints; v4 exposes **50**. The two share an identical event model and schema set — v4 is a superset that adds tracking, physical and direction data and reshapes `/updatedobjects`.

## What's new in v4

v4 is **API-compatible** with v3 for all shared endpoints (same paths, params, event taxonomy and schemas). The differences:

| Change | v3 | v4 |
|---|---|---|
| **Broadcast tracking** | — | `GET /matches/{wyId}/fulltracking` — returns a `trackingDownloadUrl` pointing to a JSON file of (x,y) location data |
| **Physical data** | — | `GET /matches/{wyId}/physicaldata` — per-player physical metrics, broken down by match phase |
| **Match directions** | — | `GET /matches/{wyId}/directions` — which way each team attacks per period (1H/2H/E1/E2) |
| **Updated objects** | `GET /updatedobjects` | split into `GET /updatedobjects/updated` and `GET /updatedobjects/deleted` |
| **Formations** | `GET /matches/{wyId}/formations?fetch=teams,players` | `GET /matches/{wyId}/formations?details=teams,players` |

The new tracking, physical and direction endpoints are detailed in [data-model.md](data-model.md) and [coordinate-system.md](coordinate-system.md). Everything below is available in **both** versions unless flagged **(v4 only)** or **(v3 only)**.

## Areas

| Endpoint | Summary |
|---|---|
| `GET /areas` | List of areas (countries/confederations) with three-letter codes |

## Competitions

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /competitions` | Competitions list | `areaId` **(required)** — three-letter area code |
| `GET /competitions/{wyId}` | Competition detail | |
| `GET /competitions/{wyId}/matches` | Matches in a competition | `fetch=competition` |
| `GET /competitions/{wyId}/players` | Players in a competition | `limit`/`count`, `page`, `sort`, `search`, `filter`, `fetch=competition` |
| `GET /competitions/{wyId}/seasons` | Seasons list | `active`, `fetch=competition` |
| `GET /competitions/{wyId}/teams` | Teams list | `fetch=competition` |

## Seasons

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /seasons/{wyId}` | Season detail | `details=competition` |
| `GET /seasons/{wyId}/matches` | Matches in a season | `fetch=season` |
| `GET /seasons/{wyId}/fixtures` | Fixtures (dated) | `fromDate`, `toDate` (`YYYY-MM-DD`), `details=matches,players,teams` |
| `GET /seasons/{wyId}/teams` | Teams in a season | `fetch=season` |
| `GET /seasons/{wyId}/players` | Players in a season | `limit`/`count`, `page`, `sort`, `search`, `filter` |
| `GET /seasons/{wyId}/standings` | League table | `roundId`, `details=teams` |
| `GET /seasons/{wyId}/scorers` | Top scorers | `fetch=season,competition`, `details=players,teams` |
| `GET /seasons/{wyId}/assistmen` | Top assist providers | `fetch=season,competition`, `details=players,teams` |
| `GET /seasons/{wyId}/career` | Season career/standings history | `filters` (e.g. `gameWeek`, `gameWeekInterval`) |
| `GET /seasons/{wyId}/transfers` | Transfers in a season | `fromDate`, `toDate`, `details=teams,player` |

## Rounds

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /rounds/{wyId}` | Round detail | `details=competition,season` |

## Matches

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /matches/{wyId}` | Match detail | `useSides` (relabels teamId → home/away), `details=coaches,players,teams,competition,round,season` |
| `GET /matches/{wyId}/events` | **Event feed** (primary analytics endpoint) | `fetch=teams,players,match,coaches,referees,formations,substitutions`; `details=tag`; `exclude=possessions,names,positions,formations` |
| `GET /matches/{wyId}/formations` | Formations / lineups over time | v3: `fetch=teams,players` · v4: `details=teams,players` |
| `GET /matches/{wyId}/advancedstats` | Match advanced stats (team-level) | `useSides`, `details=teams,match` |
| `GET /matches/{wyId}/advancedstats/players` | Match advanced stats for all players | `fetch=competition,season,round,match`, `details=player` |
| `GET /matches/{wyId}/directions` **(v4 only)** | Direction of attack per period | — |
| `GET /matches/{wyId}/fulltracking` **(v4 only)** | Broadcast tracking download URL | — |
| `GET /matches/{wyId}/physicaldata` **(v4 only)** | Per-player physical summary | — |

## Teams

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /teams/{wyId}` | Team detail | |
| `GET /teams/{wyId}/squad` | Current/seasonal squad | `seasonId`, `fetch=team` |
| `GET /teams/{wyId}/matches` | Team matches | `seasonId`, `fetch=team` |
| `GET /teams/{wyId}/fixtures` | Team fixtures (dated) | `fromDate`, `toDate` |
| `GET /teams/{wyId}/career` | Season-by-season history | `fetch=team`, `details=season,competition` |
| `GET /teams/{wyId}/transfers` | Team transfers | `fromDate`, `toDate`, `details=teams,player` |
| `GET /teams/{wyId}/advancedstats` | Aggregated team advanced stats | `compId` **(required)**, `seasonId`, `roundId`, `matchDay`, `fetch=competition,season,round` |
| `GET /teams/{wyId}/matches/{matchWyId}/advancedstats` | Team advanced stats for one match | `fetch=competition,season,round`, `details=team` |

## Players

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /players/{wyId}` | Player detail | `details=currentTeam` |
| `GET /players/{wyId}/matches` | Player matches | `seasonId`, `fetch=player` |
| `GET /players/{wyId}/fixtures` | Player fixtures (dated) | `fromDate`, `toDate` |
| `GET /players/{wyId}/career` | Career history | `fetch=player`, `details=team,competition,season` |
| `GET /players/{wyId}/contractinfo` | Contract information | `fetch=player` |
| `GET /players/{wyId}/transfers` | Transfer history | `fetch=player`, `details=teams` |
| `GET /players/{wyId}/advancedstats` | Aggregated player advanced stats | `compId` **(required)**, `seasonId`, `roundId`, `matchDay`, `fetch=competition,season,round` |
| `GET /players/{wyId}/matches/{matchWyId}/advancedstats` | Player advanced stats for one match | `fetch=competition,season,round,match`, `details=player` |

## Coaches & Referees

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /coaches/{wyId}` | Coach detail | `details=currentTeam` |
| `GET /referees/{wyId}` | Referee detail | `imageDataURL` (embeds base64 image) |

## Search

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /search` | Search resources by name | `query` **(required)**; `objType` **(required)** ∈ `competition,team,player,referee`; `gender` ∈ `men,women` |

## Videos

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /videos/{matchId}` | Match video / custom clip | `start`, `end` (seconds), `quality` ∈ `lq,sd,hd,fullhd`, `fetch=match` |
| `GET /videos/{matchId}/offsets` | Video time offsets (sync to events) | `fetch=match` |
| `GET /videos/{matchId}/qualities` | Available video qualities | |

## Updated objects (change feed)

Track inserts/updates/deletes against your local mirror. You can look back a maximum of **168 hours (1 week)**; Wyscout recommends polling every few hours per object type rather than pulling a full week.

| Endpoint | Summary | Key params |
|---|---|---|
| `GET /updatedobjects` **(v3 only)** | Recently updated resources | `updated_since` **(required)**, `type` **(required)**, `emptyPayload` |
| `GET /updatedobjects/updated` **(v4 only)** | Recently updated resources | `updated_since` **(required)**, `type` **(required)**, `limit`/`count`, `page`, `emptyPayload` |
| `GET /updatedobjects/deleted` **(v4 only)** | Recently deleted resources | `updated_since` **(required)**, `type` **(required)**, `limit`/`count`, `page` |

`updated_since` format: `YYYY-MM-DD HH:MM:SS` (e.g. `2018-02-09 18:00:00`). `type` ∈ `areas`, `coaches`, `competitions`, `matches`, `matchevents`, `playercareers`, `playerinjuries`, `players`, `referees`, `rounds`, `seasons`, `teams` (and more). Set `emptyPayload=true` to get only IDs without bodies. Results are ordered by increasing date (oldest first page).
