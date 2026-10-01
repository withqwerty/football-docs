---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# STATSports API Endpoints

## Endpoint inventory by version

STATSports publishes three versions of its "STATSports 3rd Party API": v5, v6 and
v7. Each version is a separate OpenAPI 3.0.1 document. Paths are the same in every
version; the `api-version` header selects the version. All paths sit under
`/api/thirdPartyData/`, and the callable base URL is
`https://statsportsproseries.com/thirdpartyapi` (see STATSports API access).

<!-- generated:statsports-endpoint-inventory start -->
| Operation | v5 | v6 | v7 |
|---|---|---|---|
| `GET /api/thirdPartyData/test` | yes | yes | yes |
| `GET /api/thirdPartyData/getAvailableMetrics` | yes | yes | yes |
| `POST /api/thirdPartyData/getFullSession` | yes | yes | yes |
| `POST /api/thirdPartyData/getFullSessionByShareDate` | yes | yes | yes |
| `POST /api/thirdPartyData/getPlayerDetails` | yes | yes | yes |
| `POST /api/thirdPartyData/getFullSessionsByDateRange` | no | yes | yes |
| `POST /api/thirdPartyData/getSessionGpsData` | no | yes | yes |
| `POST /api/thirdPartyData/getSessionImuData` | no | yes | yes |
| `POST /api/thirdPartyData/getSessionRawData` | no | yes | yes |
<!-- generated:statsports-endpoint-inventory end -->

## Version 7 endpoints

Spec: `https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json`, `info.version` "7". `info.description`: "3rd Party API To Allow Authorized 3rd Parties Access To STATSports Data."

<!-- generated:statsports-endpoints-v7 start -->
| Method | Path | Request body | Response `200` |
|---|---|---|---|
| `GET` | `/api/thirdPartyData/test` | none | no body in the spec |
| `GET` | `/api/thirdPartyData/getAvailableMetrics` | none | array of `string` |
| `POST` | `/api/thirdPartyData/getFullSession` | `ThirdPartyDto` (application/json) | `ThirdPartyDataV7` |
| `POST` | `/api/thirdPartyData/getFullSessionsByDateRange` | `ThirdPartyDateRangeDto` (application/Json) | `ThirdPartyDataV7` |
| `POST` | `/api/thirdPartyData/getFullSessionByShareDate` | `ThirdPartyShareDateDto` (application/json) | `ThirdPartyDataV7` |
| `POST` | `/api/thirdPartyData/getPlayerDetails` | `ThirdPartyDto` (application/json) | `PlayerDataV6` |
| `POST` | `/api/thirdPartyData/getSessionGpsData` | `ThirdPartyRawDataDto` (application/json) | `GpsDataV6RawDataResponse` |
| `POST` | `/api/thirdPartyData/getSessionImuData` | `ThirdPartyRawDataDto` (application/json) | `ImuDataV6RawDataResponse` |
| `POST` | `/api/thirdPartyData/getSessionRawData` | `ThirdPartyRawDataDto` (application/json) | `GpsImuDataV6RawDataResponse` |
<!-- generated:statsports-endpoints-v7 end -->

Every operation in v7 takes one parameter: `api-version` (header, `string`, required, default `"7"`), described as "The requested API version". The spec gives no summary or description for any operation. Every response in the spec is `200` "Success"; no error responses are documented.

## Version 6 endpoints

Spec: `https://statsportsproseries.com/thirdpartyapi/swagger/v6/swagger.json`, `info.version` "6". `info.description`: "3rd Party API To Allow Authorized 3rd Parties Access To STATSports Data. This API version has been deprecated."

<!-- generated:statsports-endpoints-v6 start -->
| Method | Path | Request body | Response `200` |
|---|---|---|---|
| `GET` | `/api/thirdPartyData/test` | none | no body in the spec |
| `GET` | `/api/thirdPartyData/getAvailableMetrics` | none | array of `string` |
| `POST` | `/api/thirdPartyData/getFullSession` | `ThirdPartyDto` (application/json) | `ThirdPartyDataV6` |
| `POST` | `/api/thirdPartyData/getFullSessionsByDateRange` | `ThirdPartyDateRangeDto` (application/Json) | `ThirdPartyDataV6` |
| `POST` | `/api/thirdPartyData/getFullSessionByShareDate` | `ThirdPartyShareDateDto` (application/json) | `ThirdPartyDataV6` |
| `POST` | `/api/thirdPartyData/getPlayerDetails` | `ThirdPartyDto` (application/json) | `PlayerDataV6` |
| `POST` | `/api/thirdPartyData/getSessionGpsData` | `ThirdPartyRawDataDto` (application/json) | `GpsDataV6RawDataResponse` |
| `POST` | `/api/thirdPartyData/getSessionImuData` | `ThirdPartyRawDataDto` (application/json) | `ImuDataV6RawDataResponse` |
| `POST` | `/api/thirdPartyData/getSessionRawData` | `ThirdPartyRawDataDto` (application/json) | `GpsImuDataV6RawDataResponse` |
<!-- generated:statsports-endpoints-v6 end -->

Every operation in v6 takes one parameter: `api-version` (header, `string`, required, default `"6"`), described as "The requested API version". The spec gives no summary or description for any operation. Every response in the spec is `200` "Success"; no error responses are documented.

## Version 5 endpoints

Spec: `https://statsportsproseries.com/thirdpartyapi/swagger/v5/swagger.json`, `info.version` "5". `info.description`: "3rd Party API To Allow Authorized 3rd Parties Access To STATSports Data. This API version has been deprecated."

<!-- generated:statsports-endpoints-v5 start -->
| Method | Path | Request body | Response `200` |
|---|---|---|---|
| `GET` | `/api/thirdPartyData/test` | none | no body in the spec |
| `GET` | `/api/thirdPartyData/getAvailableMetrics` | none | array of `string` |
| `POST` | `/api/thirdPartyData/getFullSession` | `ThirdPartyDto` (application/json) | `ThirdPartyDataV5` |
| `POST` | `/api/thirdPartyData/getFullSessionByShareDate` | `ThirdPartyShareDateDto` (application/json) | `ThirdPartyDataV5` |
| `POST` | `/api/thirdPartyData/getPlayerDetails` | `ThirdPartyDto` (application/json) | `PlayerDataV5` |
<!-- generated:statsports-endpoints-v5 end -->

Every operation in v5 takes one parameter: `api-version` (header, `string`, required, default `"5"`), described as "The requested API version". The spec gives no summary or description for any operation. Every response in the spec is `200` "Success"; no error responses are documented.

## Endpoint notes from the spec

- `GET /api/thirdPartyData/test` has no response body in the spec. On 2026-09-30,
  `https://statsportsproseries.com/thirdpartyapi/api/thirdPartyData/test` with
  header `api-version: 7` answered HTTP 200 with the body `"Success"`.
- `GET /api/thirdPartyData/getAvailableMetrics` returns an array of strings. The
  spec does not list the values.
- `POST /api/thirdPartyData/getFullSessionsByDateRange` declares its request body
  as `application/Json` (capital J) in v6 and v7. Every other request body is
  `application/json`.
- `getFullSessionsByDateRange` returns one `ThirdPartyDataV6` or `ThirdPartyDataV7`
  object in the spec, not an array, although its name is plural.
- The three raw-data operations (`getSessionGpsData`, `getSessionImuData`,
  `getSessionRawData`) take `ThirdPartyRawDataDto` (`thirdPartyApiId`,
  `rawDataId`, `nextPage`) and return an object with `nextPage` (`integer`,
  `int32`) and `data` (array). The spec does not say where a `rawDataId` comes from
  or how `nextPage` ends; no field in the session, player or drill schemas is
  named `rawDataId`.
