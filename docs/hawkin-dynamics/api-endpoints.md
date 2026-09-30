---
source_type: curated
source_url: https://connect.hawkindynamics.com/api
upstream_version: Hawkin Force Platform API 1.15 (OpenAPI 3.0.3)
crawled_at: 2026-09-30
---

# Hawkin Dynamics API Endpoints

## Endpoint inventory

All 14 operations in the Hawkin Force Platform API spec
(`info.version` "1.15"), from the OpenAPI document published inline on
https://connect.hawkindynamics.com/api. Paths are relative to the regional base URL
(see Hawkin Dynamics API access), for example
`https://cloud.hawkindynamics.com/api/v1/athletes`.

| Method | Path | Tag | Summary |
|---|---|---|---|
| `GET` | `/api/token` | Authentication | Get Access Token |
| `GET` | `/api/v1` | Tests | Get Tests |
| `GET` | `/api/v1/forcetime/{test_id}` | Tests | Get Force-Time Data |
| `GET` | `/api/v1/cop/{test_id}` | Tests | Get Center of Pressure Data |
| `GET` | `/api/v1/test_types` | Tests | Get Test Types |
| `GET` | `/api/v1/metrics` | Tests | Get Metrics |
| `GET` | `/api/v1/athletes` | Athletes | Get Athletes |
| `POST` | `/api/v1/athletes` | Athletes | Create Athlete |
| `POST` | `/api/v1/athletes/bulk` | Athletes | Create Athletes (Bulk) |
| `PUT` | `/api/v1/athletes/bulk` | Athletes | Update Athletes (Bulk) |
| `PUT` | `/api/v1/athletes/{athleteId}` | Athletes | Update Athlete |
| `GET` | `/api/v1/teams` | Organization | Get Teams |
| `GET` | `/api/v1/groups` | Organization | Get Groups |
| `GET` | `/api/v1/tags` | Organization | Get Tags |

The spec applies `BearerAuth` to every operation. `GET /api/token` takes the refresh token as the bearer; every other operation takes the access token.

## `GET /api/token` (Get Access Token)

Exchange your Refresh Token for a short-lived Access Token (1 hour). Generate your Refresh Token in the Hawkin dashboard under **Settings → Integrations**. Only the organization administrator account can generate API tokens. **Note:** After you authenticate using the Authorize button above, executing this endpoint will use your cached refresh token to demonstrate the exchange.

Responses:

- `200` Access token successfully issued: `AccessTokenResponse`
- `401` Refresh Token is invalid or expired: `ErrorResponse`
- `403` Refresh Token is missing: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1` (Get Tests)

Retrieve test results for your organization. Returns all tests unless filtered. **Important:** For large databases, always use time-range parameters to avoid memory limit failures. **Note:** Available metrics can change at any time. Some tests may be missing metrics if they cannot be calculated.

Parameters:

- `from` (query, integer) — Unix timestamp — return tests from this time onward. Best for bulk historical exports.
- `to` (query, integer) — Unix timestamp — return tests up to this time. Best for bulk historical exports.
- `syncFrom` (query, integer) — Unix timestamp — return tests **modified or created** since this time. Includes updates. Best for incremental sync. Cannot be used to fetch entire database.
- `syncTo` (query, integer) — Unix timestamp — upper bound for syncFrom queries. Store the returned `lastSyncTime` value and pass as `syncFrom` in your next request.
- `athleteId` (query, string) — Filter by a specific athlete ID. Can only be used with `from`/`to` parameters.
- `teamId` (query, string) — Filter by one or more team IDs (comma-separated, max 10). Can only be used with `from`/`to` parameters.
- `groupId` (query, string) — Filter by one or more group IDs (comma-separated, max 10). Can only be used with `from`/`to` parameters.
- `testTypeId` (query, string) — Filter by a specific test type ID. Can only be used with `from`/`to` parameters.
- `includeInactive` (query, boolean) default `true` — Default true. Set to false to return only active tests.
- `includeEid` (query, boolean) default `false` — Default false. Set to true to include the hardware `eid` (equipment ID) on each returned test record.
- `paginate` (query, boolean) — Set to true to enable paginated responses (1,000 tests per page).
- `cursor` (query, string) — Firestore document ID from previous response's nextCursor. Omit on first request.

Responses:

- `200` Array of test results matching the query: `TestsResponse`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1/forcetime/{test_id}` (Get Force-Time Data)

Retrieve the raw force-time series data for a specific test. Returns time-series arrays for left force, right force, combined force, velocity, displacement, and power sampled at 1ms intervals.

Parameters:

- `test_id` (path, string, required) — The test ID to retrieve force-time data for

Responses:

- `200` Force-time data for the requested test: `ForceTimeData`
- `401` Invalid Access Token: `ErrorResponse`
- `404` Test not found: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1/cop/{test_id}` (Get Center of Pressure Data)

Retrieve the center-of-pressure (COP) time series for a **Free Run** test. Returns `Time(s)` (derived from the platform sampling rate in hertz) alongside combined and per-platform COP coordinates. **Free Run tests only.** This endpoint returns COP data exclusively for Free Run tests. **Team-scoped tokens:** if the access token is scoped to teams that do not include this test, the endpoint returns an empty object (`{}`) with HTTP 200 rather than a 404.

Parameters:

- `test_id` (path, string, required) — The Free Run test ID to retrieve COP data for

Responses:

- `200` COP data for the requested Free Run test. A team-scoped token without access to the test receives an empty object ({}) with status 200.: `COPData`
- `401` Invalid Access Token: `ErrorResponse`
- `404` Returned when the test does not exist, is not a Free Run test, or has no COP data.: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1/test_types` (Get Test Types)

Retrieve all test types available in the Hawkin system (e.g. Countermovement Jump, Squat Jump, Drop Jump). **Note:** Unlike the other list endpoints, this endpoint returns a **bare JSON array** (`[{ id, name }, ...]`), not an object wrapped in `data`.

Responses:

- `200` Bare array of test types: array of `TestTypeSummary`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1/metrics` (Get Metrics)

Retrieve all metrics available for each test type, including ID, label, units, and description. Useful for building metric lookup tables.

Responses:

- `200` Array of test types with their associated metrics: `MetricsResponse`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1/athletes` (Get Athletes)

Retrieve all athletes in your organization. Returns only active athletes by default; set includeInactive=true to also include archived records.

Parameters:

- `includeInactive` (query, boolean) default `false` — Default false. Set to true to also include athletes whose `active` field is false.
- `teamId` (query, string) — Optional. Restrict results to one or more teams (comma-separated team IDs). With a team-scoped token, results are already limited to the token's teams.

Responses:

- `200` Array of athlete records: `object`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

`200` response body fields:

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `data` | array of `Athlete` |  |  |  |  |
| `count` | `integer` |  |  |  |  |

## `POST /api/v1/athletes` (Create Athlete)

Create a single new athlete record.

Request body (required): `AthleteInput` (application/json).

Responses:

- `200` Created athlete object: `Athlete`
- `400` Validation error: `ErrorResponse`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `POST /api/v1/athletes/bulk` (Create Athletes (Bulk))

Bulk create up to **500 athletes** in a single request. Returns details of successfully created athletes and any failures.

Request body (required): array of `AthleteInput` (application/json). `maxItems`: 500.

Responses:

- `200` Bulk creation result with successes and failures: `BulkResult`
- `401` Invalid Access Token: `ErrorResponse`
- `413` Payload too large (exceeds 500 athletes): `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `PUT /api/v1/athletes/bulk` (Update Athletes (Bulk))

Bulk update up to **500 athletes** in a single request. **Note:** Optional fields not included in the request will be left unchanged. However, when updating `external` properties, any custom properties **not present in the request will be removed**.

Request body (required): array of `AthleteUpdateInput` (application/json). `maxItems`: 500.

Responses:

- `200` Bulk update result with successes and failures: `BulkResult`
- `401` Invalid Access Token: `ErrorResponse`
- `413` Payload too large: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `PUT /api/v1/athletes/{athleteId}` (Update Athlete)

Update a single athlete by ID. **Note:** Optional fields not included will be left unchanged. However, when updating `external` properties, custom properties **not present in the request will be removed**.

Parameters:

- `athleteId` (path, string, required) — The athlete's ID

Request body (required): `AthleteUpdateInput` (application/json).

Responses:

- `200` Updated athlete object: `Athlete`
- `400` Validation error: `ErrorResponse`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

## `GET /api/v1/teams` (Get Teams)

Retrieve all teams in your organization with their IDs and names.

Parameters:

- `teamId` (query, string) — Optional. Restrict results to one or more teams (comma-separated team IDs). With a team-scoped token, results are already limited to the token's teams.

Responses:

- `200` Array of teams: `object`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

`200` response body fields:

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `data` | array of `Team` |  |  |  |  |
| `count` | `integer` |  |  |  | Number of teams returned. |

## `GET /api/v1/groups` (Get Groups)

Retrieve all groups in your organization with their IDs and names.

Parameters:

- `teamId` (query, string) — Optional. Restrict results to one or more teams (comma-separated team IDs). With a team-scoped token, results are already limited to the token's teams.

Responses:

- `200` Array of groups: `object`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

`200` response body fields:

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `data` | array of `Group` |  |  |  |  |
| `count` | `integer` |  |  |  | Number of groups returned. |

## `GET /api/v1/tags` (Get Tags)

Retrieve all tags in your organization. Tags are used to sub-classify tests within a test type (e.g. 'Arm Swing', 'Right Single Leg').

Responses:

- `200` Array of tags: `object`
- `401` Invalid Access Token: `ErrorResponse`
- `500` Internal server error: `ErrorResponse`

`200` response body fields:

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `data` | array of `object` |  |  |  |  |
| `count` | `integer` |  |  |  | Number of tags returned. |
