---
source_url: https://api.fmdb.pro/api/openapi
source_type: crawled
upstream_version: latest (full OpenAPI)
crawled_at: 2026-07-09
---

# FMDB Pro API Endpoints

## Endpoint inventory

All endpoints are under `https://api.fmdb.pro/`. Data endpoints require `x-api-key`; most data requests also accept the optional `x-api-version` header.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/clubs` | List of clubs. |
| `GET` | `/api/clubsCompetitions` | List of club competitions. |
| `GET` | `/api/continents` | List of continents. |
| `GET` | `/api/countries` | List of countries. |
| `GET` | `/api/coverage` | Coverage information. |
| `GET` | `/api/formations` | List of formations. |
| `GET` | `/api/historicalValues` | Historical values of players. |
| `GET` | `/api/kit/{encryptedKey}.svg` | Kit SVG by unique hash from a club or nation `kits` node. |
| `GET` | `/api/nationPlayerAppearances` | Player appearances for a nation in the last 12 months. |
| `GET` | `/api/nations` | List of nations. |
| `GET` | `/api/nationsCompetitions` | List of national competitions. |
| `GET` | `/api/officials` | List of officials. |
| `GET` | `/api/openapi` | OpenAPI JSON file for the API. |
| `GET` | `/api/persons` | List of people. |
| `POST` | `/api/persons` | People search using a filter-group request body. |
| `GET` | `/api/playerAppearances` | Player appearances broken down by season and team. |
| `GET` | `/api/players` | List of players. |
| `POST` | `/api/players` | Player search using a filter-group request body. |
| `GET` | `/api/regions` | List of world regions. |
| `GET` | `/api/stadiums` | List of stadiums. |
| `GET` | `/api/status` | System status and available API versions. |

## Core catalogue endpoints

The broad catalogue endpoints are:

- `/api/clubs`
- `/api/clubsCompetitions`
- `/api/nations`
- `/api/nationsCompetitions`
- `/api/countries`
- `/api/continents`
- `/api/regions`
- `/api/stadiums`
- `/api/officials`
- `/api/formations`

These are useful for building local dimension tables before querying player/person data. The club and nation objects include nested relationship surfaces such as competitions, countries, stadiums, captains, kits, teams, reputation, facilities, and update timestamps.

## Player and person endpoints

`/api/players` is the main player surface. It returns football-playing fields, attributes, values, club/nation relationships, contracts, injuries, history, preferred moves, positions, GBE fields, tags, and external IDs.

`/api/persons` is broader. It includes non-playing people and staff-oriented fields such as current job, coaching, management, medical, tactics, tendencies, preferred formations, qualification, reputation, and chairperson fields, while sharing many identity and contract fields with players.

Both endpoints support:

- `GET` query-parameter search.
- `POST` body search using `RequestBodyPlayersFilterGroup` or `RequestBodyPersonsFilterGroup`.
- Page or continuation pagination.
- Sorting, field inclusion, field exclusion, and field-specific filters.

## Appearances and values

`/api/playerAppearances` returns season/team appearance aggregates with:

- `playerId`
- `playerName`
- `teamName`
- `competitionName`
- `competitionType`
- `season`
- `startDate`
- `endDate`
- `matches`
- `appearances`
- `starts`
- `minutesPlayed`
- `goals`
- `assists`
- `yellowCards`
- `redCards`
- `updated`

`/api/nationPlayerAppearances` returns national-team appearance information for the last 12 months.

`/api/historicalValues` returns historical player value records keyed by `type` and `typeId`, with `values`, `trends`, `currentTrend`, `dateOfBirth`, `lastChange`, and `updated`.

## Coverage and metadata

`/api/coverage` reports coverage by country/nation/club competition and includes count objects and game type. Use it to decide whether a requested country, nation, competition, or free-agent slice is covered before running wider extracts.

`/api/status` exposes system status and available API versions. The documentation UI uses it to populate the API-version selector.

`/api/openapi` returns the API specification. Useful query parameters include:

| Parameter | Notes |
|---|---|
| `version` | `simple` or `full`. |
| `documentationType` | `redoc` or `swagger`. |

## Kit SVGs

`/api/kit/{encryptedKey}.svg` returns a kit image by encrypted key. The key comes from a `kits` node in a Club or Nation object. Treat this as an asset endpoint rather than a searchable data endpoint.

## Common errors

The OpenAPI spec defines shared response references for:

| Response | Meaning |
|---|---|
| `400 BadRequest` | Request is malformed. |
| `401 Unauthorized` | Missing or invalid authentication. |
| `403 Forbidden` | API key lacks access to the requested resource. |
| `404 NotFound` | Requested resource does not exist. |
| `409 Conflict` | Similar entity already exists and cannot be duplicated. |
| `422 InvalidInput` | Entity constraints failed; response includes invalid fields/checks. |

