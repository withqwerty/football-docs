---
source_type: curated
source_url: https://prd-euw-api-extsmartspeed.valdperformance.com/swagger/v1/swagger.json
upstream_version: Vald.Api.ExternalSmartSpeed.V1 v1 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD SmartSpeed API

## VALD SmartSpeed API host and specification

- Host: `https://prd-<region>-api-extsmartspeed.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-extsmartspeed.valdperformance.com/swagger/v1/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalSmartSpeed.V1", `info.version` "v1").
- Local snapshot: `specs/vald/extsmartspeed.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`, `audience` "vald-api-external". The spec applies it to every operation.
- The spec declares no `servers`. Its 186 schema fields have no descriptions.

## VALD SmartSpeed endpoints

<!-- generated:vald-smartspeed-endpoints start -->
| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/v1/team/{teamId}/tests/{testId}/detail` |  |  |
| `GET` | `/v1/team/{teamId}/tests` |  |  |
| `GET` | `/v1/test/tests-by-modified-date` |  |  |
<!-- generated:vald-smartspeed-endpoints end -->

## VALD SmartSpeed service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

<!-- generated:vald-smartspeed-health start -->
| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string) | `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalSmartSpeed.V1.Configuration.Diagnostics.GetDiagnosticsResponse` |
<!-- generated:vald-smartspeed-health end -->

## VALD SmartSpeed: `GET /v1/team/{teamId}/tests/{testId}/detail`

Parameters:

- `teamId` (path, string, format uuid, required)
- `testId` (path, string, format uuid, required)

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD SmartSpeed: `GET /v1/team/{teamId}/tests`

Parameters:

- `teamId` (path, string, format uuid, required)
- `AthleteId` (query, string, format uuid)
- `TestFromUtc` (query, string, format date-time)
- `TestToUtc` (query, string, format date-time)
- `ModifiedFromUtc` (query, string, format date-time)
- `GroupUnderTestId` (query, string, format uuid)
- `Page` (query, integer, format int32, required)

Responses:

- `200` OK: array of `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD SmartSpeed: `GET /v1/test/tests-by-modified-date`

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)

Responses:

- `200` OK: array of `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD SmartSpeed schemas

The 32 component schemas of the SmartSpeed spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

<!-- generated:vald-smartspeed-schemas start -->
### `Microsoft.AspNetCore.Mvc.ProblemDetails`

`additionalProperties`: `{}`.

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |

### `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

`additionalProperties`: `{}`.

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `errors` | object (map of array of `string`) |  | yes |
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Configuration.Diagnostics.DiagnosticResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Configuration.Diagnostics.GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalSmartSpeed.V1.Configuration.Diagnostics.DiagnosticResult` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.CutChoice`

Type `string`.

| Value |
|---|
| `Random` |
| `Fixed` |

### `Vald.Api.ExternalSmartSpeed.V1.Direction`

Type `string`.

| Value |
|---|
| `Left` |
| `Right` |
| `Random` |
| `Both` |

### `Vald.Api.ExternalSmartSpeed.V1.IntervalType`

Type `string`.

| Value |
|---|
| `FixedDuration` |
| `FixedRecovery` |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `sessionId` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` |  |
| `groupUnderTestId` | `string` | `uuid` | yes |
| `testDateUtc` | `string` | `date-time` |  |
| `trialIndex` | `integer` | `int32` |  |
| `tag` | `Vald.Api.ExternalSmartSpeed.V1.TestTag` |  |  |
| `additionalTestResult` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_AdditionalTestResultDto` |  |  |
| `repResults` | array of `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_RepResult` |  | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_AdditionalSplitData`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `expectedDirection` | `integer` | `int32` | yes |
| `colour` | `string` |  | yes |
| `splitType` | `string` |  | yes |
| `goalSplitTime` | `number` | `float` | yes |
| `goalCumulativeTime` | `number` | `float` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_AdditionalTestResultDto`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `totalOne` | `number` | `float` | yes |  |
| `totalOneToTwo` | `number` | `float` | yes |  |
| `totalOneToThree` | `number` | `float` | yes |  |
| `totalOneToFour` | `number` | `float` | yes |  |
| `totalThreeToFour` | `number` | `float` | yes |  |
| `reactionTime` | `number` | `float` | yes |  |
| `heightM` | `number` | `float` | yes |  |
| `weightKg` | `number` | `float` | yes | **Personal data.** |
| `direction` | `string` |  | yes |  |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_JumpResult`

| Field | Type | Format |
| --- | --- | --- |
| `jumpIndex` | `integer` | `int32` |
| `contactTime` | `number` | `float` |
| `flightTime` | `number` | `float` |
| `splitCompleteDate` | `string` | `date-time` |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_RepResult`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `restDuration` | `number` | `float` | yes |
| `repIndex` | `integer` | `int32` |  |
| `splitResults` | array of `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_SplitResult` |  | yes |
| `jumpResults` | array of `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_JumpResult` |  | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_SplitResult`

| Field | Type | Format |
| --- | --- | --- |
| `gateIndex` | `integer` | `int32` |
| `splitIndex` | `integer` | `int32` |
| `splitTime` | `number` | `float` |
| `cumulativeTime` | `number` | `float` |
| `splitCompleteDate` | `string` | `date-time` |
| `additionalSplitData` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestDetailHttpResponse_AdditionalSplitData` |  |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `testResultId` | `string` | `uuid` |  |
| `groupUnderTestId` | `string` | `uuid` | yes |
| `profileId` | `string` | `uuid` |  |
| `testDateUtc` | `string` | `date-time` |  |
| `deviceCount` | `integer` | `int32` |  |
| `repCount` | `integer` | `int32` |  |
| `testTypeName` | `Vald.Api.ExternalSmartSpeed.V1.TestTypeName` |  |  |
| `testName` | `string` |  | yes |
| `isValid` | `boolean` |  |  |
| `additionalOptionsFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_AdditionalOptionsFieldsDto` |  |  |
| `jumpingSummaryFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_JumpingSummaryFieldsDto` |  |  |
| `runningSummaryFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_RunningSummaryFieldsDto` |  |  |
| `allGroups` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_AdditionalOptionsFieldsDto`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `startType` | `Vald.Api.ExternalSmartSpeed.V1.StartType` |  |  |  |
| `direction` | `Vald.Api.ExternalSmartSpeed.V1.Direction` |  |  |  |
| `cutDirectionChoice` | `Vald.Api.ExternalSmartSpeed.V1.CutChoice` |  |  |  |
| `reactiveDelayEnabled` | `boolean` |  | yes |  |
| `reactiveDelayMinimumInSeconds` | `number` | `float` | yes |  |
| `reactiveDelayMaximumInSeconds` | `number` | `float` | yes |  |
| `events` | `integer` | `int32` | yes |  |
| `durationInSeconds` | `number` | `float` | yes |  |
| `lapCount` | `integer` | `int32` | yes |  |
| `intervalType` | `Vald.Api.ExternalSmartSpeed.V1.IntervalType` |  |  |  |
| `testStandardType` | `Vald.Api.ExternalSmartSpeed.V1.TestStandardType` |  |  |  |
| `dropHeight` | `number` | `float` | yes |  |
| `dropHeightEnabled` | `boolean` |  | yes |  |
| `weightKg` | `number` | `float` | yes | **Personal data.** |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_FvpSummaryDto`

| Field | Type | Format |
| --- | --- | --- |
| `maxVelocity` | `number` | `float` |
| `maxForce` | `number` | `float` |
| `maxForceNormalised` | `number` | `float` |
| `maxPower` | `number` | `float` |
| `maxPowerNormalised` | `number` | `float` |
| `forceVelocityCurve` | `number` | `float` |
| `drf` | `number` | `float` |
| `rfMax` | `number` | `float` |
| `tau` | `number` | `float` |
| `vMax` | `number` | `float` |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_GateSummaryFieldsDto`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `splitOne` | `number` | `float` | yes |
| `splitTwo` | `number` | `float` | yes |
| `splitThree` | `number` | `float` | yes |
| `splitFour` | `number` | `float` | yes |
| `cumulativeOne` | `number` | `float` | yes |
| `cumulativeTwo` | `number` | `float` | yes |
| `cumulativeThree` | `number` | `float` | yes |
| `cumulativeFour` | `number` | `float` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_JumpingSummaryFieldsDto`

| Field | Type | Format |
| --- | --- | --- |
| `flightTimeSeconds` | `number` | `float` |
| `contactTimeSeconds` | `number` | `float` |
| `heightMeters` | `number` | `float` |
| `rsi` | `number` | `float` |
| `flightTimeOverContractionTime` | `number` | `float` |
| `peakPowerOutput` | `number` | `float` |
| `legStiffness` | `number` | `float` |
| `impulse` | `number` | `float` |
| `flightTimePlusContractionTime` | `number` | `float` |
| `peakPowerOutputOverTotalMass` | `number` | `float` |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_RunningSummaryFieldsDto`

| Field | Type | Format |
| --- | --- | --- |
| `totalTimeSeconds` | `number` | `float` |
| `bestSplitSeconds` | `number` | `float` |
| `splitAverageSeconds` | `number` | `float` |
| `velocityFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_VelocityFieldsDto` |  |
| `gateSummaryFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_GateSummaryFieldsDto` |  |

### `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_VelocityFieldsDto`

| Field | Type | Format |
| --- | --- | --- |
| `peakVelocityMetersPerSecond` | `number` | `float` |
| `meanVelocityMetersPerSecond` | `number` | `float` |
| `distance` | `number` | `float` |
| `fvpSummaryDto` | `Vald.Api.ExternalSmartSpeed.V1.Models.GetTestSummariesHttpResponse_FvpSummaryDto` |  |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `summaries` | array of `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_Summary` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_AdditionalOptionsFieldsDto`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `startType` | `Vald.Api.ExternalSmartSpeed.V1.StartType` |  |  |  |
| `direction` | `Vald.Api.ExternalSmartSpeed.V1.Direction` |  |  |  |
| `cutDirectionChoice` | `Vald.Api.ExternalSmartSpeed.V1.CutChoice` |  |  |  |
| `reactiveDelayEnabled` | `boolean` |  | yes |  |
| `reactiveDelayMinimumInSeconds` | `number` | `float` | yes |  |
| `reactiveDelayMaximumInSeconds` | `number` | `float` | yes |  |
| `events` | `integer` | `int32` | yes |  |
| `durationInSeconds` | `number` | `float` | yes |  |
| `lapCount` | `integer` | `int32` | yes |  |
| `intervalType` | `Vald.Api.ExternalSmartSpeed.V1.IntervalType` |  |  |  |
| `testStandardType` | `Vald.Api.ExternalSmartSpeed.V1.TestStandardType` |  |  |  |
| `dropHeight` | `number` | `float` | yes |  |
| `dropHeightEnabled` | `boolean` |  | yes |  |
| `weightKg` | `number` | `float` | yes | **Personal data.** |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_FvpSummaryDto`

| Field | Type | Format |
| --- | --- | --- |
| `maxVelocity` | `number` | `float` |
| `maxForce` | `number` | `float` |
| `maxForceNormalised` | `number` | `float` |
| `maxPower` | `number` | `float` |
| `maxPowerNormalised` | `number` | `float` |
| `forceVelocityCurve` | `number` | `float` |
| `drf` | `number` | `float` |
| `rfMax` | `number` | `float` |
| `tau` | `number` | `float` |
| `vMax` | `number` | `float` |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_GateSummaryFieldsDto`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `splitOne` | `number` | `float` | yes |
| `splitTwo` | `number` | `float` | yes |
| `splitThree` | `number` | `float` | yes |
| `splitFour` | `number` | `float` | yes |
| `cumulativeOne` | `number` | `float` | yes |
| `cumulativeTwo` | `number` | `float` | yes |
| `cumulativeThree` | `number` | `float` | yes |
| `cumulativeFour` | `number` | `float` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_JumpingSummaryFieldsDto`

| Field | Type | Format |
| --- | --- | --- |
| `flightTimeSeconds` | `number` | `float` |
| `contactTimeSeconds` | `number` | `float` |
| `heightMeters` | `number` | `float` |
| `rsi` | `number` | `float` |
| `flightTimeOverContractionTime` | `number` | `float` |
| `peakPowerOutput` | `number` | `float` |
| `legStiffness` | `number` | `float` |
| `impulse` | `number` | `float` |
| `flightTimePlusContractionTime` | `number` | `float` |
| `peakPowerOutputOverTotalMass` | `number` | `float` |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_RunningSummaryFieldsDto`

| Field | Type | Format |
| --- | --- | --- |
| `totalTimeSeconds` | `number` | `float` |
| `bestSplitSeconds` | `number` | `float` |
| `splitAverageSeconds` | `number` | `float` |
| `velocityFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_VelocityFieldsDto` |  |
| `gateSummaryFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_GateSummaryFieldsDto` |  |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_Summary`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `testResultId` | `string` | `uuid` |  |
| `testSessionId` | `string` | `uuid` |  |
| `groupUnderTestId` | `string` | `uuid` | yes |
| `profileId` | `string` | `uuid` |  |
| `testDateUtc` | `string` | `date-time` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `deviceCount` | `integer` | `int32` |  |
| `trialNumber` | `integer` | `int32` |  |
| `repCount` | `integer` | `int32` |  |
| `testTypeName` | `Vald.Api.ExternalSmartSpeed.V1.TestTypeName` |  |  |
| `testName` | `string` |  | yes |
| `isValid` | `boolean` |  |  |
| `additionalOptionsFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_AdditionalOptionsFieldsDto` |  |  |
| `jumpingSummaryFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_JumpingSummaryFieldsDto` |  |  |
| `runningSummaryFields` | `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_RunningSummaryFieldsDto` |  |  |
| `allGroups` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_VelocityFieldsDto`

| Field | Type | Format |
| --- | --- | --- |
| `peakVelocityMetersPerSecond` | `number` | `float` |
| `meanVelocityMetersPerSecond` | `number` | `float` |
| `distance` | `number` | `float` |
| `fvpSummaryDto` | `Vald.Api.ExternalSmartSpeed.V1.Models.TestCursorHttpResponse_FvpSummaryDto` |  |

### `Vald.Api.ExternalSmartSpeed.V1.StartType`

Type `string`.

| Value |
|---|
| `Standard` |
| `InBeam` |
| `TrafficLight` |
| `ReactiveStart` |

### `Vald.Api.ExternalSmartSpeed.V1.TestStandardType`

Type `string`.

| Value |
|---|
| `Standard` |
| `Free` |
| `Events` |
| `Duration` |

### `Vald.Api.ExternalSmartSpeed.V1.TestTag`

Type `string`.

| Value |
|---|
| `Valid` |
| `Invalid` |

### `Vald.Api.ExternalSmartSpeed.V1.TestTypeName`

Type `string`.

| Value |
|---|
| `TrafficLightSprint` |
| `Cut` |
| `Free` |
| `LapTiming` |
| `Serpentine` |
| `IntervalShuttle` |
| `Grid` |
| `IntervalProtocol` |
| `Pacing` |
| `ReactiveProAgility` |
| `TrafficLightStart_0121` |
| `AutoStart_112` |
| `TrafficLightStart_0123` |
| `TrafficLightStart_013` |
| `ProAgility` |
| `OneWay` |
| `FvpSprint` |
| `Jumping` |
<!-- generated:vald-smartspeed-schemas end -->
