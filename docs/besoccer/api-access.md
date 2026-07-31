---
source_url: https://documenter.getpostman.com/view/6414020/2s93JwM1t4
source_type: curated
upstream_version: Postman collection "Apiclient"
crawled_at: 2026-07-31
---

# BeSoccer API Access

BeSoccer is a Spanish football data provider. Its client API is documented as a
public Postman collection rather than an OpenAPI specification.

- **Base URL**: `https://apiclient.besoccerapps.com/scripts/api/api.php`
- **Documentation**: [Postman collection](https://documenter.getpostman.com/view/6414020/2s93JwM1t4)
- **Style**: single endpoint, resource selected by the `req` query parameter

## Authentication

A single API key, passed as the `key` query parameter on every request:

```
GET https://apiclient.besoccerapps.com/scripts/api/api.php?key={key}&req=competitions&format=json
```

There is no OAuth flow, no bearer token and no login call. The key is described
as the "unique key that allows users to connect to the API", and it is a query
parameter, so it will appear in server logs and browser history — keep it out of
anything shared or committed.

## Request shape

Every call is a `GET` to the same URL. Four parameters are common to all requests:

| Parameter | Required | Notes |
|---|---|---|
| `key` | yes | API key |
| `req` | yes | Resource selector — see [api-endpoints.md](api-endpoints.md) |
| `format` | no | `json`, `xml`, `text` or `js` |
| `tz` | no | Time zone, e.g. `Europe/Madrid` |

Everything else varies per request: `id`, `year`, `league`, `team`, `competitions`,
`players`, `lang` and others. The full per-request parameter list is in
[api-endpoints.md](api-endpoints.md).

Because the resource is a query parameter, a typo in `req` is not a 404 on a path
— it is a request to an endpoint that does not exist, and the failure will not
necessarily look like a routing error. Validate `req` against the published
vocabulary rather than guessing.

## Access levels

Requests are grouped into three levels, which map to access tiers:

| Level | Requests | Broad content |
|---|---|---|
| Level 1 | 15 | Competitions, seasons, tables, teams, matches by day, live matches |
| Level 2 | 24 | Match detail and lineups, team detail and squads, transfers, referees, TV listings |
| Level 3 | 18 | Player detail, player statistics and trajectory, advanced team statistics, historical data |

A key not entitled to a level cannot call the requests in it. Which levels a key
carries is a commercial matter between you and BeSoccer.

## Coverage window

BeSoccer states that the API serves **the current season plus the two previous
years**. Anything older is outside its range — plan historical work around another
source rather than expecting deep archives here.

## Identifiers

BeSoccer uses its own integer IDs for competitions, teams, players and matches.
They are provider-scoped, with no cross-provider mapping exposed in the API, so
bridging to another provider means matching on attributes rather than looking up
an ID.

Seasons are selected with `year`, given as the starting calendar year of the
season.

## Licensing

The API is commercial and key-gated. The Postman collection is public
documentation of the request surface; the data returned is BeSoccer's and subject
to whatever terms accompany your key. This repository documents the request
surface only and holds none of BeSoccer's data.
