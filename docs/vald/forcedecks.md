---
source_type: curated
source_url: https://prd-euw-api-extforcedecks.valdperformance.com/swagger/v2019q3/swagger.json
upstream_version: VALD External ForceDecks API v2019q3 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD ForceDecks API

## VALD ForceDecks API host and specification

- Host: `https://prd-<region>-api-extforcedecks.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-extforcedecks.valdperformance.com/swagger/v2019q3/swagger.json`
  (OpenAPI 3.0.4, `info.title` "VALD External ForceDecks API", `info.version` "v2019q3").
- Local snapshot: `specs/vald/extforcedecks.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`. The spec applies it to every operation.
- The spec declares no `servers`. Its 188 schema fields have no descriptions.

## VALD ForceDecks endpoints

<!-- generated:vald-forcedecks-endpoints start -->
| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/resultdefinitions` | Retrieves a collection of ForceDecks result definitions. |  |
| `GET` | `/resultdefinitions/{resultId}` | Retrieves a ForceDecks result definition. |  |
| `GET` | `/v2019q3/teams` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/athletes` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/athletes/softdeleted` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/athletes/deleted` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/athlete/{athleteId}/tests/{page}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/athlete/{athleteId}/tests/deleted` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/{page}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/{dateFrom}/{dateTo}/{page}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/summary/{dateFrom}/{dateTo}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/typesummarybyathlete/{dateFrom}/{dateTo}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/deleted` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/detailed/{dateFrom}/{dateTo}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/tests/{testId}/trials` |  |  |
| `GET` | `/v2019q3/teams/{teamId}/tests/{testId}/recording` |  |  |
| `GET` | `/v2019q3/teams/{teamId}/tests/{testId}/recording/file` |  |  |
| `GET` | `/v2019q3/teams/{teamId}/recordings/{recordingId}` |  | yes |
| `GET` | `/v2019q3/teams/{teamId}/recordings/{recordingId}/file` |  | yes |
| `GET` | `/tests` | Retrieves a collection of ForceDecks test summaries. |  |
<!-- generated:vald-forcedecks-endpoints end -->

## VALD ForceDecks service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

<!-- generated:vald-forcedecks-health start -->
| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string) | `401` Unauthorized: `ProblemDetails`<br>`200` OK: `GetDiagnosticsResponse` |
<!-- generated:vald-forcedecks-health end -->

## VALD ForceDecks: `GET /resultdefinitions`

Retrieves a collection of ForceDecks result definitions.

Responses:

- `200` OK: `GetResultDefinitionsResponse`
- `204` No Content

## VALD ForceDecks: `GET /resultdefinitions/{resultId}`

Retrieves a ForceDecks result definition.

Parameters:

- `resultId` (path, integer, format int32, required)

Responses:

- `200` OK: `GetResultDefinitionResponse`
- `404` Not Found: `ProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use External Tenants API."

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `TeamDTO`
- `404` Not Found

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/athletes`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use External Profiles API."

Parameters:

- `teamId` (path, string, format uuid, required)
- `modifiedFrom` (query, string, format date-time)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `AthleteItemDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/athletes/softdeleted`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use External Profiles API."

Parameters:

- `teamId` (path, string, format uuid, required)
- `deletedFrom` (query, string, format date-time)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `AthleteItemDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/athletes/deleted`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use External Profiles API."

Parameters:

- `teamId` (path, string, format uuid, required)
- `deletedFrom` (query, string, format date-time)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `DeletedAthleteDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/athlete/{athleteId}/tests/{page}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `athleteId` (path, string, format uuid, required)
- `modifiedFrom` (query, string, format date-time, required)
- `page` (path, integer, format int32, required) default `1`

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `TestDTOPagedDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/athlete/{athleteId}/tests/deleted`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `athleteId` (path, string, format uuid, required)
- `deletedFrom` (query, string, format date-time)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `DeletedTestDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/{page}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `modifiedFrom` (query, string, format date-time, required)
- `page` (path, integer, format int32, required) default `1`

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `TestDTOPagedDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/{dateFrom}/{dateTo}/{page}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `dateFrom` (path, string, format date-time, required)
- `dateTo` (path, string, format date-time, required)
- `page` (path, integer, format int32, required) default `1`

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `TestDTOPagedDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/summary/{dateFrom}/{dateTo}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `dateFrom` (path, string, format date-time, required)
- `dateTo` (path, string, format date-time, required)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `SummaryTestDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/typesummarybyathlete/{dateFrom}/{dateTo}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `dateFrom` (path, string, format date-time, required)
- `dateTo` (path, string, format date-time, required)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `TestTypeSummaryDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/deleted`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `deletedFrom` (query, string, format date-time)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `DeletedTestDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/detailed/{dateFrom}/{dateTo}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /tests."

Parameters:

- `teamId` (path, string, format uuid, required)
- `dateFrom` (path, string, format date-time, required)
- `dateTo` (path, string, format date-time, required)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `DetailedTestDTO`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/{testId}/trials`

Parameters:

- `teamId` (path, string, format uuid, required)
- `testId` (path, string, format uuid, required)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: array of `TrialDTO`
- `400` Bad Request: `ValidationProblemDetails`
- `404` Not Found

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/{testId}/recording`

Parameters:

- `teamId` (path, string, format uuid, required)
- `testId` (path, string, format uuid, required)
- `includeSampleData` (query, boolean)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `RecordingDTO`
- `400` Bad Request: `ValidationProblemDetails`
- `404` Not Found

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/tests/{testId}/recording/file`

Parameters:

- `teamId` (path, string, format uuid, required)
- `testId` (path, string, format uuid, required)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `string`
- `400` Bad Request: `ValidationProblemDetails`
- `404` Not Found

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/recordings/{recordingId}`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /v2019q3/teams/{teamId}/tests/{testId}/recording."

Parameters:

- `teamId` (path, string, format uuid, required)
- `recordingId` (path, string, format uuid, required)
- `includeSampleData` (query, boolean)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `RecordingDTO`
- `400` Bad Request: `ValidationProblemDetails`
- `404` Not Found

## VALD ForceDecks: `GET /v2019q3/teams/{teamId}/recordings/{recordingId}/file`

Marked `deprecated` in the spec. Description: "Endpoints greyed out with a strikethrough are marked as 'Deprecated' and will be phased out over time, though they remain functional. Please refer to the External ForceDecks API Guide (https://support.vald.com/hc/en-au/articles/38086939480729-A-guide-to-using-the-External-ForceDecks-API#h_01J8HACNZ2HQ543JVHCMA2NMBR) for details on the correct endpoints to use moving forward. We will provide plenty of notice when we plan to phase out the deprecated endpoints. Please use /v2019q3/teams/{teamId}/tests/{testId}/recording/file."

Parameters:

- `teamId` (path, string, format uuid, required)
- `recordingId` (path, string, format uuid, required)

Responses:

- `401` Unauthorized
- `403` Forbidden
- `200` OK: `string`
- `400` Bad Request: `ValidationProblemDetails`
- `404` Not Found

## VALD ForceDecks: `GET /tests`

Retrieves a collection of ForceDecks test summaries.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: `GetCursorPagedTestsResponse`
- `204` No Content
- `400` Bad Request: `ValidationProblemDetails`
- `403` Forbidden: `ProblemDetails`

## VALD ForceDecks schemas

The 33 component schemas of the ForceDecks spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

<!-- generated:vald-forcedecks-schemas start -->
### `AthleteItemDTO`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `teamId` | `string` | `uuid` |  |  |
| `id` | `string` | `uuid` |  |  |
| `hubId` | `string` | `uuid` | yes |  |
| `name` | `string` |  | yes | **Personal data.** |
| `givenName` | `string` |  | yes | **Personal data.** |
| `familyName` | `string` |  | yes | **Personal data.** |
| `externalId` | `string` |  | yes |  |
| `lastModifiedUTC` | `string` | `date-time` |  |  |
| `notes` | `string` |  | yes |  |
| `attributes` | array of `AttributeDTO` |  | yes |  |
| `links` | object (map of `string`) |  | yes | readOnly: `true` |

### `AttributeDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `attributeValueId` | `string` | `uuid` |  |
| `valueName` | `string` |  | yes |
| `attributeTypeId` | `string` | `uuid` |  |
| `typeName` | `string` |  | yes |

### `AzureRegion`

Type `string`.

| Value |
|---|
| `NoRegion` |
| `AustraliaEast` |
| `WestEurope` |
| `EastUnitedStates` |

### `DeletedAthleteDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `teamId` | `string` | `uuid` |  |
| `id` | `string` | `uuid` |  |
| `hubId` | `string` | `uuid` | yes |
| `isHardDeleted` | `boolean` |  |  |
| `deletedUTC` | `string` | `date-time` |  |

### `DeletedTestDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `teamId` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `hubAthleteId` | `string` | `uuid` | yes |
| `deletedUTC` | `string` | `date-time` |  |

### `DetailedTestDTO`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |  |
| `teamId` | `string` | `uuid` |  |  |
| `athleteId` | `string` | `uuid` |  |  |
| `hubAthleteId` | `string` | `uuid` | yes |  |
| `fullName` | `string` |  | yes | **Personal data.** |
| `recordedUTC` | `string` | `date-time` |  |  |
| `recordedOffset` | `integer` | `int32` |  |  |
| `recordedTimezone` | `string` |  | yes |  |
| `analysedUTC` | `string` | `date-time` |  |  |
| `analysedOffset` | `integer` | `int32` |  |  |
| `analysedTimezone` | `string` |  | yes |  |
| `testType` | `string` |  | yes |  |
| `param` | `TestParameterDTO` |  |  |  |
| `weight` | `number` | `double` |  | **Personal data.** |
| `notes` | `string` |  | yes |  |
| `attributes` | array of `AttributeDTO` |  | yes |  |
| `trials` | array of `TrialDTO` |  | yes |  |
| `trialCount` | `integer` | `int32` |  | readOnly: `true` |
| `links` | object (map of `string`) |  | yes | readOnly: `true` |

### `DiagnosticsResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `GetCursorPagedTestsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `tests` | array of `TestResponse` | yes |

### `GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `DiagnosticsResult` | yes |

### `GetResultDefinitionResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `resultId` | `integer` | `int32` |  |
| `resultIdString` | `string` |  | yes |
| `resultName` | `string` |  | yes |
| `resultDescription` | `string` |  | yes |
| `resultGroup` | `ResultGroup` |  |  |
| `supportsAsymmetry` | `boolean` |  |  |
| `isRepeatResult` | `boolean` |  |  |
| `resultUnit` | `UnitType` |  |  |
| `resultUnitName` | `string` |  | yes |
| `resultUnitScaleFactor` | `number` | `double` |  |
| `numberOfDecimalPlaces` | `integer` | `int32` |  |
| `trendDirection` | `TrendDirection` |  |  |

### `GetResultDefinitionsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `resultDefinitions` | array of `GetResultDefinitionResponse` | yes |

### `ProblemDetails`

`additionalProperties`: `{}`.

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |

### `RecordingDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `hubAthleteId` | `string` | `uuid` | yes |
| `recordedUTC` | `string` | `date-time` |  |
| `recordedOffset` | `integer` | `int32` |  |
| `recordedTimezone` | `string` |  | yes |
| `recordingInfo` | `string` |  | yes |
| `dataSource` | `string` |  | yes |
| `recordingType` | `RecordingType` |  |  |
| `recordingOutput` | `RecordingOutput` |  |  |
| `samplingFrequency` | `integer` | `int32` |  |
| `duration` | `number` | `double` |  |
| `lastModifiedUTC` | `string` | `date-time` |  |
| `recordingDataHeader` | array of `string` |  | yes |
| `recordingData` | array of array of `number` |  | yes |

### `RecordingOutput`

Type `string`.

| Value |
|---|
| `None` |
| `ForceZ` |
| `ForceX` |
| `ForceY` |
| `CentreOfPressureX` |
| `CentreOfPressureY` |
| `ForceComponents` |
| `CustomComponents` |

### `RecordingType`

Type `string`.

| Value |
|---|
| `None` |
| `Single` |
| `Dual` |
| `AuxSingle` |
| `AuxDual` |

### `ResultDefinition`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `integer` | `int32` |  |
| `result` | `string` |  | yes |
| `description` | `string` |  | yes |
| `name` | `string` |  | yes |
| `unit` | `string` |  | yes |
| `repeatable` | `boolean` |  |  |
| `asymmetry` | `boolean` |  |  |

### `ResultGroup`

Type `string`.

| Value |
|---|
| `None` |
| `General` |
| `EISPhases` |
| `EISVariables` |
| `Performance` |
| `Takeoff` |
| `Rebound` |
| `Landing` |
| `Balance` |
| `Functional` |
| `BestHop` |
| `BestNHops` |
| `Fatigue` |

### `ResultLimb`

Type `string`.

| Value |
|---|
| `Trial` |
| `Left` |
| `Right` |
| `Asym` |

### `SummaryTestDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `teamId` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `hubAthleteId` | `string` | `uuid` | yes |
| `testType` | `string` |  | yes |
| `recordingId` | `string` | `uuid` |  |
| `recordedUTC` | `string` | `date-time` |  |
| `recordedOffset` | `integer` | `int32` |  |
| `samplingFrequency` | `integer` | `int32` |  |
| `duration` | `number` | `double` |  |
| `dataSource` | `string` |  | yes |
| `analysedUTC` | `string` | `date-time` |  |
| `analysedOffset` | `integer` | `int32` |  |
| `analysisInfo` | `string` |  | yes |
| `lastModifiedUTC` | `string` | `date-time` |  |

### `TeamDTO`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |  |
| `name` | `string` |  | yes |  |
| `region` | `AzureRegion` |  |  |  |
| `links` | object (map of `string`) |  | yes | readOnly: `true` |

### `TestAttributeResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `attributeValueId` | `string` | `uuid` |  |
| `attributeValueName` | `string` |  | yes |
| `attributeTypeId` | `string` | `uuid` |  |
| `attributeTypeName` | `string` |  | yes |

### `TestDTO`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |  |
| `teamId` | `string` | `uuid` |  |  |
| `athleteId` | `string` | `uuid` |  |  |
| `hubAthleteId` | `string` | `uuid` | yes |  |
| `recordingId` | `string` | `uuid` |  |  |
| `recordedUTC` | `string` | `date-time` |  |  |
| `recordedOffset` | `integer` | `int32` |  |  |
| `recordedTimezone` | `string` |  | yes |  |
| `analysedUTC` | `string` | `date-time` |  |  |
| `analysedOffset` | `integer` | `int32` |  |  |
| `analysedTimezone` | `string` |  | yes |  |
| `lastModifiedUTC` | `string` | `date-time` |  |  |
| `testType` | `string` |  | yes |  |
| `param` | `TestParameterDTO` |  |  |  |
| `extParams` | array of `TestParameterDTO` |  | yes |  |
| `weight` | `number` | `double` |  | **Personal data.** |
| `notes` | `string` |  | yes |  |
| `attributes` | array of `AttributeDTO` |  | yes |  |
| `links` | object (map of `string`) |  | yes | readOnly: `true` |

### `TestDTOPagedDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `items` | array of `TestDTO` |  | yes |
| `currentPage` | `integer` | `int32` |  |
| `totalItems` | `integer` | `int32` |  |
| `totalPages` | `integer` | `int32` |  |
| `nextPage` | `string` |  | yes |
| `previousPage` | `string` |  | yes |

### `TestParameterDTO`

| Field | Type | Format | Description |
| --- | --- | --- | --- |
| `resultId` | `integer` | `int32` | readOnly: `true` |
| `value` | `number` | `double` | readOnly: `true` |
| `definition` | `ResultDefinition` |  |  |

### `TestParameterResponse`

| Field | Type | Format |
| --- | --- | --- |
| `resultId` | `integer` | `int32` |
| `value` | `number` | `double` |

### `TestResponse`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `testId` | `string` | `uuid` |  |  |
| `tenantId` | `string` | `uuid` |  |  |
| `profileId` | `string` | `uuid` |  |  |
| `recordingId` | `string` | `uuid` |  |  |
| `modifiedDateUtc` | `string` | `date-time` |  |  |
| `recordedDateUtc` | `string` | `date-time` |  |  |
| `recordedDateOffset` | `integer` | `int32` |  |  |
| `recordedDateTimezone` | `string` |  | yes |  |
| `analysedDateUtc` | `string` | `date-time` |  |  |
| `analysedDateOffset` | `integer` | `int32` |  |  |
| `analysedDateTimezone` | `string` |  | yes |  |
| `testType` | `string` |  | yes |  |
| `notes` | `string` |  | yes |  |
| `weight` | `number` | `double` |  | **Personal data.** |
| `parameter` | `TestParameterResponse` |  |  |  |
| `extendedParameters` | array of `TestParameterResponse` |  | yes |  |
| `attributes` | array of `TestAttributeResponse` |  | yes |  |

### `TestTypeSummaryDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `teamId` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `hubAthleteId` | `string` | `uuid` | yes |
| `testType` | `string` |  | yes |
| `count` | `integer` | `int32` |  |

### `TrendDirection`

Type `string`.

| Value |
|---|
| `None` |
| `Positive` |
| `Negative` |

### `TrialDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `hubAthleteId` | `string` | `uuid` | yes |
| `recordedUTC` | `string` | `date-time` |  |
| `recordedOffset` | `integer` | `int32` |  |
| `recordedTimezone` | `string` |  | yes |
| `startTime` | `number` | `double` |  |
| `endTime` | `number` | `double` |  |
| `results` | array of `TrialResultDTO` |  | yes |
| `lastModifiedUTC` | `string` | `date-time` |  |
| `limb` | `TrialLimb` |  |  |

### `TrialLimb`

Type `string`.

| Value |
|---|
| `Both` |
| `Left` |
| `Right` |

### `TrialResultDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `resultId` | `integer` | `int32` |  |
| `value` | `number` | `double` | yes |
| `time` | `number` | `double` |  |
| `limb` | `ResultLimb` |  |  |
| `repeat` | `integer` | `int32` |  |
| `definition` | `ResultDefinition` |  |  |

### `UnitType`

Type `string`.

| Value |
|---|
| `NoUnit` |
| `Meter` |
| `Centimeter` |
| `CentimeterSI` |
| `Millimeter` |
| `Inch` |
| `MeterSquared` |
| `CentimeterSquared` |
| `MillimeterSquared` |
| `Newton` |
| `NewtonPerCentimeter` |
| `NewtonPerMeter` |
| `NewtonPerSecond` |
| `NewtonPerSecondPerKilo` |
| `NewtonPerSecondPerCentimeter` |
| `NewtonPerKilo` |
| `NewtonSecond` |
| `NewtonSecondPerKilo` |
| `MeterPerSecond` |
| `MeterPerSecondPerSecond` |
| `CentimeterPerSecond` |
| `MillimeterPerSecond` |
| `Second` |
| `Millisecond` |
| `Watt` |
| `WattPerKilo` |
| `WattPerSecond` |
| `WattPerSecondPerKilo` |
| `Joule` |
| `Percent` |
| `Asymmetry` |
| `Kilo` |
| `Pound` |
| `RSIModified` |
| `KilogramMeterPerSecond` |
| `Boolean` |
| `Enum` |

### `ValidationProblemDetails`

`additionalProperties`: `{}`.

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |
| `errors` | object (map of array of `string`) |  | yes |
<!-- generated:vald-forcedecks-schemas end -->
