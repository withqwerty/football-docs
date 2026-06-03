---
source_url: https://api.impect.com
source_type: crawled
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect API Access

## Overview

Impect is a **commercial football data provider** known for its *Packing* and *pxT* (packing expected threat) metrics, KPI/score framework and detailed set-piece data. Access is via the **Impect Customer API (v5)**, a REST/JSON API. This document is sourced from the v5 OpenAPI spec (`specs/impect/impect_openapi_docs.yml`).

- Base URL: `https://api.impect.com`
- Swagger: `https://api.impect.com/v3/api-docs/CustomerAPI`
- All endpoints are `GET` and namespaced under `/v5/customerapi/...`.
- Endpoint inventory: [api-endpoints.md](api-endpoints.md) · data model: [data-model.md](data-model.md) · metrics: [concepts.md](concepts.md).

## Authentication

**Bearer token** obtained via Keycloak (`https://login.impect.com/`). Pass it as `Authorization: Bearer <token>`. Every endpoint is protected by `hasRole('API')`.

The official **`impectPy`** Python client handles the token exchange — get a token from your username/password, then pass it to each call:

```python
import impectPy as ip

token = ip.getAccessToken(username="you@club.com", password="...")
iterations = ip.getIterations(token=token)
events = ip.getEvents(matches=[match_id], token=token)
```

(There is also an R client, `impectR`.) If calling the REST API directly, exchange credentials for a token at the Keycloak token endpoint, then send `Authorization: Bearer <token>` on each request.

## Rate limiting

**10 requests per second per user.** `impectPy` implements client-side token-bucket throttling to stay under it. The API also returns `RateLimit-Policy` and `RateLimit-Remaining` headers; on a `429`, wait for the `Retry-After` header duration before retrying.

## Request correlation

Every endpoint accepts an optional **`X-Request-ID`** header (ideally a UUID) to correlate client and server logs when raising support issues.

## Response envelope

All responses share an envelope:

```json
{
  "data": [ /* the payload — usually a List<...Dto> */ ],
  "status": 200,
  "message": null
}
```

`data` holds the typed payload; `status` mirrors the HTTP status; `message` carries error/info text. Errors use `ErrorResponseObject`.

## Core concepts (how the API is organised)

| Term | Meaning |
|---|---|
| **Iteration** | A season × competition instance (e.g. "Premier League 2024/25"). The primary unit for aggregated data. `iterationId` keys most master-data and iteration-level endpoints. |
| **Match** | A single game, keyed by `matchId`. The unit for event-level data, KPIs, scores and set-pieces. |
| **Squad** | A team (club or national team), keyed by `squadId`. |
| **KPI** | A countable/valued key performance indicator computed per event/player/squad. See [concepts.md](concepts.md). |
| **Score** | A 0–100-style standardised rating derived from KPIs, at player/squad/profile level. |
| **Profile** | A weighted bundle of KPIs/scores defining a player archetype, position-scoped. |

## Update & delete feeds

For keeping a local mirror in sync, the API exposes incremental **update** and **delete** feeds per entity type. Both take a required **`since`** query param (ISO 8601 timestamp) and return only records changed/deleted after it. See the Update Feed / Delete Feed sections of [api-endpoints.md](api-endpoints.md).

## Cross-provider IDs

Master-data objects (iterations, players, squads, matches, coaches, stadiums) carry an **`idMappings`** field — provider name → array of that provider's IDs — so you can bridge Impect entities to other providers directly. See [identity-surfaces.md](identity-surfaces.md).

## SkillCorner integration

Impect aligns its events to **SkillCorner** tracking frames. `GET /v5/customerapi/matches/{matchId}/skillcorner-frame-mappings` returns frame ↔ event-index mappings (with an `isMatched` flag), letting you join Impect event data to SkillCorner tracking. See [skillcorner](../skillcorner/api-access.md).
