---
source_url: https://driblab.notion.site/Driblab-API-1-0-Guide-EN-65ce257f83b5451fb79896b01d41aede
source_type: curated
upstream_version: Driblab API 1.0 Guide [EN]
crawled_at: 2026-09-09
---

# Driblab API Access

Driblab is a football analytics company. It runs a platform called Driblab PRO,
and exposes data through an HTTP REST API. The guide describes the API as giving
access to **aggregated metrics** of players, teams and leagues, in JSON — it is
not an event-stream feed.

- **Base URL**: `https://apidriblab.com`
- **Documentation**: [Driblab API 1.0 Guide (EN)](https://driblab.notion.site/Driblab-API-1-0-Guide-EN-65ce257f83b5451fb79896b01d41aede)
- **Format**: JSON only
- **Version**: 1.0. There is no version segment in the path.

## Authentication

A bearer token in the `Authorization` header on every request:

```bash
curl -X GET https://apidriblab.com/countries -H "Authorization: Bearer {API_TOKEN}"
```

The token is generated the first time you log into Driblab PRO, and you retrieve
it from the PRO navigation bar under **API → Authentication**. There is no OAuth
flow, no refresh call and no login endpoint. One token per user.

## Response envelope

Every response is wrapped. The payload is under `body`, and the HTTP status is
repeated inside the JSON as `statusCode`:

```json
{ "statusCode": 200, "body": [ ] }
```

Errors carry `message` instead of `body`, so a client that reads `body`
unconditionally will throw on an error rather than surface it. Check for
`message` first — the guide's own worked example does exactly that.

## Response codes

| Code | Meaning |
|---|---|
| 200 | Request succeeded |
| 401 | Invalid or expired token |
| 403 | Forbidden resource — the token exists but is not entitled to it |
| 404 | Resource not found |
| 405 | Too many requests — the rate limit |
| 500 | Server error on Driblab's side |

**405, not 429.** Driblab returns `405` for a rate-limit breach, which is
normally "Method Not Allowed". Retry logic keyed on 429 will not fire here, and
logic keyed on 405 as a routing bug will misreport it.

403 is worth handling separately from 401: entitlement is per resource, so a
valid token can read some competitions and not others.

**A 403 can also mean the route does not exist.** Checked on 2026-09-22: a
request to a path the API does not define, such as a stats path with the wrong
spelling, returns `403` with an AWS API Gateway message about the
`Authorization` header ("Invalid key=value pair (missing equal-sign)"), not a
`404`. It reads like an authentication or entitlement failure but is a routing
one. When a new path returns 403 on a token that works elsewhere, check the path
spelling before the entitlement.

**409 is not in the guide's table.** On 2026-09-22 some requests with a valid
token returned `409` with no body, for example a player's season physical stats
and `GET /team/{id}/game-stats`. The guide does not document 409, so its meaning
is not stated; treat it as "no data available for this request" only after
confirming with Driblab.

## Rate limits

| Window | Limit |
|---|---|
| Per minute | 60 requests |
| Per day | 60,000 requests |

Once a limit is hit the API returns 405 for the rest of that minute or that day.
One request per second is the sustainable rate, and the guide's own example
sleeps between calls. Plan bulk pulls around the daily ceiling: at 60,000 calls a
day, per-game or per-player fan-out over a full season is a multi-day job.

## Pagination

Three query parameters, on the endpoints that support them:

| Parameter | Type | Meaning |
|---|---|---|
| `page` | Number | Page to retrieve, from 0 |
| `size` | Number | Number of items per page |
| `sort` | String | Field to sort by; must match a response field name |

```
https://apidriblab.com/countries?page=1&size=25
https://apidriblab.com/countries?sort=code
```

Pagination is **not** universal. Roughly a third of the endpoints accept it, and
the rest return the whole collection. Which is which is listed per endpoint in
[api-endpoints.md](api-endpoints.md) — do not assume `page`/`size` work
everywhere. Notably the stats endpoints (`GET /season/{id}/players/stats`,
`GET /season/{id}/teams/stats`, `GET /season/{id}/arrigo-metrics`) are
unpaginated and return a whole season at once, so they are the large responses.

## Identifiers

Driblab uses its own integer IDs for countries, competitions, seasons, teams,
players, coaches and games. They are provider-scoped. The API exposes **no
cross-provider ID mapping** — there is no Transfermarkt, Wyscout or Opta ID field
on any resource — so bridging to another provider means matching on attributes
(name, date of birth, nationality, club) rather than looking up an ID.

The one place another provider is named is the tracking pipeline: one of the
values from `GET /game/tracking/status` is "Match WyScout ID Set", which is an
internal processing state, not a field you can read.

Seasons are their own entities with their own IDs, not a year on a competition.
The normal drill-down is country → competition → season → team or player, and the
guide's worked example follows exactly that chain. `GET /competition/available`
and `GET /season/available` short-circuit it when you only need to know what your
token can see.

## Write access

The API is not read-only. Two endpoints change state:

- `POST /game` requests the creation of a game and returns presigned URLs to
  `PUT` video files and match sheets into.
- `DELETE /player/{id}` deletes a player.

Both are gated by entitlement rather than by a separate credential, so the same
token that reads data may be able to delete a player. Treat the token as a write
credential.

## Licensing

Driblab's API is commercial and token-gated; a token comes with a Driblab PRO
subscription. The guide is publicly readable, and this documentation covers the
request surface only — endpoint paths, parameters, and field and metric names.
It holds none of Driblab's data. The metric definitions behind the names, and the
data itself, are Driblab's intellectual property and subject to your contract
with them.
