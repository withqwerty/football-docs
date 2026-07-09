---
source_url: https://api.fmdb.pro/api/openapi
source_type: crawled
upstream_version: latest (full OpenAPI)
crawled_at: 2026-07-09
---

# FMDB Pro API Access

## Overview

FMDB Pro is a commercial football database from Sports Interactive. The API exposes football entities and scouting-oriented fields for clubs, players, people, competitions, nations, countries, officials, stadiums, player appearances, historical player values, coverage, formations, and kit SVGs.

- Documentation UI: `https://app.fmdb.pro/docs`
- OpenAPI endpoint: `https://api.fmdb.pro/api/openapi`
- Base URL: `https://api.fmdb.pro/`
- Main API namespace: `/api/...`
- Local OpenAPI snapshot: `specs/fmdb-pro/openapi.json`
- OpenAPI version: `3.0.2`
- API version in the snapshot: `latest`
- Documentation variant in the snapshot: `full`

## Authentication

Requests use an API key in the `x-api-key` request header:

```http
GET /api/players?pageSize=20 HTTP/1.1
Host: api.fmdb.pro
x-api-key: <api-key>
```

The OpenAPI spec says API keys are issued by the FMDB Pro team. Do not put the key in query parameters or request bodies.

## API versioning

Data requests accept an optional `x-api-version` header. If omitted, the API returns the latest version. The documentation UI also exposes available API versions through `/api/status`, and the OpenAPI route accepts the version header when fetching a spec.

```http
GET /api/clubs HTTP/1.1
Host: api.fmdb.pro
x-api-key: <api-key>
x-api-version: latest
```

## OpenAPI variants

The OpenAPI route supports documentation variants:

- `version=simple` gives a smaller spec.
- `version=full` includes the full parameter lists for the data endpoints.
- `documentationType=redoc` or `documentationType=swagger` controls the UI-oriented spec rendering.

The downloaded snapshot in this repository is the `full` variant, which is useful for seeing every field-specific filter, sort, include, and exclude parameter. It is large because the player and person endpoints expose deeply nested fields.

## Response envelope

Search/list endpoints return JSON with a `meta` object and a `data` array. `meta` can include:

| Field | Meaning |
|---|---|
| `calledApiUrl` | URL called by the API layer. |
| `numTotalRecords` | Total records matching the request. |
| `currentPageSize` | Page size for page-number pagination. |
| `currentPage` | Current page number when using page pagination. |
| `totalPages` | Total pages when available. |
| `continuationToken` | Cursor token for the next continuation request. |
| `hasMoreResults` | Whether more cursor results are available. |
| `message` | Optional status or informational message. |

## Pagination

Two pagination styles are available:

| Parameter | Default | Notes |
|---|---:|---|
| `pageSize` | `20` | Number of records per request. The documented maximum is 500. |
| `page` | `1` | Page-number pagination. Do not combine with `continuation` or `continuationToken`. |
| `continuation` | `false` | Enables cursor pagination for larger extracts. |
| `continuationToken` | `null` | Cursor returned from the previous response. Requires `continuation=true`. |

For large extracts, prefer `continuation=true` and repeat with `continuationToken` until the response token is `null` or `hasMoreResults` is false. The spec notes that continuation mode does not work with `pageSize`; the API chooses an optimal result size for the dataset.

## Sorting and shaping

Use `sortBy` and `sortOrder` for sorting. Multiple comma-separated fields are supported, and `sortOrder` can also be comma-separated:

```http
GET /api/players?sortBy=name,age&sortOrder=ASC,DESC
```

Sorting cannot be used with continuation pagination.

Use `includeFields` or `excludeFields` to shape first-level response fields:

```http
GET /api/players?includeFields=id,name,dateOfBirth,fmId,externalIds
GET /api/clubs?excludeFields=kits,finances,wageHistory
```

Field shaping applies only to first-level fields, not nested objects.

## Filtering

The API supports exact-match filters by field name and a family of suffix operators:

| Filter form | Use |
|---|---|
| `<field>` | Exact match. |
| `<field>Null`, `<field>NotNull` | Null checks. |
| `<field>Not` | Negated exact match. |
| `<field>In`, `<field>NotIn` | List membership. |
| `<field>StartsWith`, `<field>EndsWith`, `<field>Contains` | String matching. |
| `<field>Regex` | Perl-style regular expression matching. |
| `<field>MinorThan`, `<field>MinorEqualThan` | Less-than comparisons; aliases of before-style date filters. |
| `<field>MajorThan`, `<field>MajorEqualThan` | Greater-than comparisons; aliases of after-style date filters. |
| `<field>Between`, `<field>BetweenIncluded` | Range comparisons using `lower|upper`. |

Nested fields use dot notation where listed by the full spec, for example `country.name`, `basedClub.id`, `externalIds.hudlWyscoutId`, or `gbe.status`.

