---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: null
crawled_at: null
---

# StatsBomb Commercial REST API Endpoints

Reference for the StatsBomb commercial REST API surface. Each resource is
**independently versioned** and the API spans **two hostnames** — there is no
single global API version or base path.

> This page describes these endpoint versions: Competitions v4.0.0, Matches
> v6.0.0, Lineups v4.0.1, Events v8.0.0, 360 Frames v2.0.0, Player Mapping
> v1.0.0, Player Match Stats v5.0.0, Player Season Stats v4.0.0, Team Match
> Stats v1.0.0, Team Season Stats v2.0.0. StatsBomb increments the version
> segment per resource when the response shape changes, so the URL itself
> tells you which version a feed is; a higher version than listed here may
> carry additional fields not described on this page.

## Authentication

All endpoints use **HTTP Basic Auth** with the username (email) and password
issued by StatsBomb. The same credentials work across every endpoint. Access
requires a paid licence; licensed scope determines which competitions/seasons
return data.

`statsbombpy` and `StatsBombR` wrap these endpoints. With `statsbombpy`, set
`SB_USERNAME`/`SB_PASSWORD` env vars or pass `creds={"user":..., "passwd":...}`.

## Endpoint matrix

`{cid}` = competition_id, `{sid}` = season_id, `{mid}` = match_id.

| Resource | Method + path | Host | Spec version |
|---|---|---|---|
| Competitions | `GET /api/v4/competitions` | `data.statsbombservices.com` | v4.0.0 |
| Matches | `GET /api/v6/competitions/{cid}/seasons/{sid}/matches` | `data.statsbombservices.com` | v6.0.0 |
| Lineups | `GET /api/v4/lineups/{mid}` | `data.statsbomb.com` | v4.0.1 |
| Events | `GET /api/v8/events/{mid}` | `data.statsbombservices.com` | v8.0.0 |
| 360 Frames | `GET /api/v2/360-frames/{mid}` | `data.statsbombservices.com` | v2.0.0 |
| Player Mapping | `GET /api/v1/player-mapping?<params>` | `data.statsbomb.com` | v1.0.0 |
| Player Match Stats | `GET /api/v5/matches/{mid}/player-stats` | `data.statsbombservices.com` | v5.0.0 |
| Player Season Stats | `GET /api/v4/competitions/{cid}/seasons/{sid}/player-stats` | `data.statsbombservices.com` | v4.0.0 |
| Team Match Stats | `GET /api/v1/matches/{mid}/team-stats` | `data.statsbomb.com` | v1.0.0 |
| Team Season Stats | `GET /api/v2/competitions/{cid}/seasons/{sid}/team-stats` | `data.statsbombservices.com` | v2.0.0 |

Older versions of a resource are generally reachable by lowering the version
segment (e.g. `/api/v7/events/{mid}`), subject to StatsBomb retaining them.

### Host and typo caveats

- **Two active hosts.** Most resources are on `data.statsbombservices.com`;
  Lineups and Player Mapping are documented on `data.statsbomb.com`. The hosts
  are not interchangeable in the specs — use the one documented per resource and
  verify against live behaviour.
- **Team Match Stats typo.** The Team Match Stats v1.0.0 PDF prints the host as
  `data.statsbom.com` (missing a `b`). This is a documentation typo; the
  intended host is almost certainly `data.statsbomb.com`. Treat with caution and
  confirm against StatsBomb support.

## Response format

Every endpoint returns a JSON **array** of objects. The shape mirrors the
StatsBomb Open Data JSON for the entities that exist in open data
(competitions, matches, lineups, events, 360-frames). The four stats endpoints
and player-mapping have no open-data equivalent.

| Resource | Array element | Documented in |
|---|---|---|
| Competitions | competition-season object | `data-model.md` |
| Matches | match object (incl. `collection_status`, `metadata`) | `data-model.md` |
| Lineups | per-team lineup (lineup/formations/events arrays) | `data-model.md` |
| Events | event object (v8 fields incl. OBV, pass clusters) | `event-types.md` |
| 360 Frames | freeze-frame object per event_uuid | `data-model.md`, `coordinate-system.md` |
| Player Mapping | competition-season-team block per player | `player-mapping.md` |
| Player Match/Season Stats | one row per player | `player-match-stats.md`, `player-season-stats.md` |
| Team Match/Season Stats | one row per team | `team-match-stats.md`, `team-season-stats.md` |

## Open Data vs commercial parity

The free Open Data repository (`github.com/statsbomb/open-data`) mirrors only a
subset of the commercial API:

| Capability | Open Data | Commercial API |
|---|---|---|
| Competitions / Matches / Lineups / Events / 360 | Yes (selective competitions) | Yes (licensed scope) |
| Player Match Stats | **No** | Yes (`/matches/{mid}/player-stats`) |
| Player Season Stats | **No** | Yes (`/competitions/{cid}/seasons/{sid}/player-stats`) |
| Team Match Stats | **No** | Yes (`/matches/{mid}/team-stats`) |
| Team Season Stats | **No** | Yes (`/competitions/{cid}/seasons/{sid}/team-stats`) |
| Player Mapping (live/offline IDs) | **No** | Yes (`/player-mapping`) |
| Data freshness | Irregular GitHub updates | Near-live for licensed comps |

The pre-computed IQ metric catalogues (OBV, xGChain, PPDA, PSxG, GSAA, etc.)
and the live/offline ID mapping **only exist in the commercial feed**. Code
written against open data cannot read these fields — do not assume their
presence from open-data examples.

## Incremental sync

The Competitions response carries `match_updated`, `match_updated_360`,
`match_available`, and `match_available_360` timestamps per competition-season;
the Matches response carries `last_updated` / `last_updated_360` per match.
Poll Competitions, diff the timestamps, then refetch only changed
competition-seasons/matches rather than re-pulling everything.

`match_status` must be `"available"` before Events can be fetched for a match;
`match_status_360` of `"available"` is required before 360 frames exist. See the
collection/match status enums in `data-model.md`.

## Player Mapping request rules

`/api/v1/player-mapping` requires at least one query parameter (no params = no
data). `all-account-data=true` is required to return the full licensed set
(otherwise the response is trimmed for trialling). If a query would return
**more than 5000 records the response is streamed to a file** as JSON rather
than returned inline. See `player-mapping.md` for parameters and the
live/offline ID model.
