---
source_type: curated
source_url: https://connect.hawkindynamics.com/api
upstream_version: Hawkin Force Platform API 1.15 (OpenAPI 3.0.3)
crawled_at: 2026-09-30
---

# Hawkin Dynamics API Access

## Overview

Hawkin Dynamics makes force plates. The Hawkin Force Platform API returns an
organisation's own test results (jumps, isometric tests and others), force-time
data and athlete records. The reference page labels it "Beta API · v1.15".

- Reference page: https://connect.hawkindynamics.com/api
- OpenAPI 3.0.3 document: inline on the reference page (its "Download OpenAPI Spec"
  button saves it as JSON or YAML). There is no spec URL; `/openapi.json` on the
  same host returned 404 on 2026-09-30.
- Local snapshot: `specs/hawkin-dynamics/openapi.json`, extracted with
  `scripts/extract_hawkin_openapi.mjs`
- Metric vocabulary: https://connect.hawkindynamics.com/assets/metrics.json (see
  Hawkin Dynamics test metrics)
- Contact in the spec: dev-team@hawkindynamics.com

The spec's own description says the API is "**Designed for server-to-server use.**
Not intended for direct client-app access."

## Regional base URLs

The spec lists three servers. The reference page says to "Connect to the region
matching your organization's data residency."

| Region | Base URL | Page note |
|---|---|---|
| Americas | `https://cloud.hawkindynamics.com` | Default · US data residency |
| Europe | `https://eu.cloud.hawkindynamics.com` | EU data residency |
| Asia-Pacific | `https://apac.cloud.hawkindynamics.com` | APAC data residency |

## Authentication

The spec's security scheme is `BearerAuth` (`http`, `bearer`, `bearerFormat`
`JWT`). Access works in two steps:

1. An organisation administrator creates a refresh token in the Hawkin dashboard,
   under Settings → Integrations. The spec says: "Only the organization
   administrator account can generate API tokens."
2. `GET /api/token` with header `Authorization: Bearer <refresh token>` returns
   `AccessTokenResponse`: `access_token`, `token_type` and `expires_at` (Unix
   timestamp). The spec says the access token is "short-lived" and lasts 1 hour.

Every other call sends `Authorization: Bearer <access token>`. Keep the refresh
token out of code, for example in `HAWKIN_REFRESH_TOKEN`.

```bash
ACCESS_TOKEN=$(curl -s -H "Authorization: Bearer $HAWKIN_REFRESH_TOKEN" \
  "https://cloud.hawkindynamics.com/api/token" | jq -r '.access_token')
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://cloud.hawkindynamics.com/api/v1?syncFrom=<unix-seconds>"
```

## Team-scoped tokens

From the spec's description: "A Refresh Token may be **scoped to specific teams**.
When it is, the Access Token it produces restricts **every read** to those teams".
List endpoints return only in-scope records. A request for one out-of-scope
resource returns "an **empty result with HTTP 200**" (an empty object `{}` for
`/forcetime/{test_id}` and `/cop/{test_id}`, or an empty `data` array for lists),
not `404`. The spec asks integrations to "treat an empty 200 response as \"no
access / no data\" rather than an error."

## Sync strategy, pagination and limits

From the spec's description and the `GET /api/v1` parameters:

- The spec states no numeric rate limit. Its description says: "As your database
  grows, use `from`/`to` or `syncFrom`/`syncTo` parameters to limit response size.
  Responses exceeding the memory limit will fail."
- Incremental sync: `syncFrom` and `syncTo` (Unix timestamps) return tests
  "**modified or created**" in the window. The response's `lastSyncTime` is the
  `syncFrom` for the next request. The spec recommends a scheduled job "every 5
  minutes".
- Bulk history: `from` and `to` (Unix timestamps), "per month in parallel or
  sequential requests".
- `athleteId`, `teamId`, `groupId` and `testTypeId` filters "Can only be used with
  `from`/`to` parameters". `teamId` and `groupId` take up to 10 comma-separated IDs.
- Pagination is opt-in: `paginate=true` returns "1,000 tests per page", with
  `hasMore` and `nextCursor`; pass `nextCursor` as `cursor`.
- Bulk athlete create and update take at most 500 athletes per request; more gives
  `413`.

## Version history

The reference page's changelog, checked 2026-09-30:

| Date | Version | Change, as the page states it |
|---|---|---|
| Jul 2026 | v1.15 | New `GET /api/v1/cop/{test_id}`; force-time shear forces, moments and `eid`; `rsi` is an array; `timestamp` is an integer; non-calculable metrics are `null`, not `"N/A"`; tests include `active`; metrics use `testTypeName`; test types return a bare array; teams, groups and tags include `count`; team-scoped token behaviour documented |
| May 2026 | v1.14 | Athlete profile fields `image`, `position`, `dob`, `sport`, `height`, `lastTestedOn`; `includeInactive` on athletes documented |
| Apr 2026 | v1.13 | `includeInactive` and cursor pagination (`paginate`, `cursor`) on Get Tests |
| Mar 2026 | v1.12 | Primary data endpoint path updated to `/api/v1` |
| Jan 2025 | v1.11 | Endpoint reference aligned with `/api/v1` |
| Jan 2023 | v1.10-beta | Bulk athlete create and update; `teamId`, `groupId` and `testTypeId` on tests |
| Earlier | v1.0–v1.9 | Initial beta release |

## Terms

The Hawkin Connect Terms of Service (https://connect.hawkindynamics.com/terms,
effective 2026-02-24) cover the Hawkin Connect integrations and say they, "including
all associated code, design, and documentation, are the property of Hawkin
Dynamics LLC". No licence to reuse the API documentation was found. API access
needs a Hawkin organisation account and an administrator's token.
