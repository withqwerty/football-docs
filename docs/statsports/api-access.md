---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/index.html
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# STATSports API Access

## Overview

STATSports makes Apex wearable GPS devices and the Sonra analysis software. Its
"STATSports 3rd Party API" returns a customer's session, player and drill data from
Sonra, and raw GPS and IMU samples. The spec's `info.description` is "3rd Party API
To Allow Authorized 3rd Parties Access To STATSports Data."

- Swagger UI: https://statsportsproseries.com/thirdpartyapi/index.html
- Specs (OpenAPI 3.0.1, public, no login):
  - https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
  - https://statsportsproseries.com/thirdpartyapi/swagger/v6/swagger.json
  - https://statsportsproseries.com/thirdpartyapi/swagger/v5/swagger.json
- Local snapshots: `specs/statsports/thirdpartyapi-v5.json`, `-v6.json`, `-v7.json`
- Base URL: `https://statsportsproseries.com/thirdpartyapi`
- Paths: `/api/thirdPartyData/<operation>`
- Contact in the spec: STATSports, info@statsports.com, https://statsports.com/contact/

## Base URL

The spec declares no `servers`. The Swagger UI loads its specs from
`/thirdpartyapi/swagger/...`, and the API paths start `/api/thirdPartyData/`. On
2026-09-30 a request to
`https://statsportsproseries.com/thirdpartyapi/api/thirdPartyData/test` with header
`api-version: 7` answered HTTP 200 with the body `"Success"`. So a full URL is:

```
https://statsportsproseries.com/thirdpartyapi/api/thirdPartyData/getFullSession
```

The host root, `https://statsportsproseries.com/`, redirects to a sign-in page
(`/Account/SignIn`). It is not an API endpoint.

## API versions and the api-version header

| Version | Status in the spec | Operations |
|---|---|---|
| v7 | No deprecation notice | 9 |
| v6 | `info.description` ends "This API version has been deprecated." | 9 |
| v5 | `info.description` ends "This API version has been deprecated." | 5 |

Every operation in every version takes the header `api-version`: `string`,
described as "The requested API version". The v6 and v7 specs mark it required;
the v5 spec does not. The spec's default is `"7"`, `"6"` or `"5"`, matching the
spec file. The paths are the same in every version, so
the header alone selects the version.

## Authentication

- The spec defines no `securitySchemes` and no `security` requirement.
- Every `POST` body carries `thirdPartyApiId` (`string`, format `uuid`). The spec
  gives it no description. `ThirdPartyShareDateDto` is the only request schema that
  marks it required.
- The two `GET` operations, `test` and `getAvailableMetrics`, take no body, and
  the spec shows no key for them.
- The spec does not say how a `thirdPartyApiId` is issued. STATSports' help centre
  (`elitesupport.statsports.com`) blocks non-browser clients, so it was not read and
  is not a source for these docs.

Treat the `thirdPartyApiId` as a secret. Keep it in an environment variable, for
example `STATSPORTS_THIRD_PARTY_API_ID`, not in code.

## Request example

The spec gives no example requests. A v7 `getFullSession` call built from the spec's
schemas (`ThirdPartyDto` has `thirdPartyApiId` and a nullable `sessionDate`, format
`date-time`):

```bash
curl -X POST "https://statsportsproseries.com/thirdpartyapi/api/thirdPartyData/getFullSession" \
  -H "api-version: 7" \
  -H "Content-Type: application/json" \
  -d "{\"thirdPartyApiId\": \"$STATSPORTS_THIRD_PARTY_API_ID\", \"sessionDate\": \"<date-time>\"}"
```

The spec does not describe what `sessionDate` selects, or which time zone it uses.

## Rate limits and errors

The spec states no rate limit, quota or page size, other than the `nextPage` field
on raw-data requests and responses. Every response in the spec is `200` "Success";
no error codes are documented.

## Terms

The spec's `info.license` has the name "Privacy Policy" and the URL
`https://statsports.com/apex-pro-series-privacy-policy/`, which returned HTTP 404
on 2026-09-30. No published terms for the API documentation were found. The spec
does not say who can get API access. Check with STATSports before you build on it.
