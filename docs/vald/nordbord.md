---
source_type: curated
source_url: https://prd-euw-api-externalnordbord.valdperformance.com/swagger/v1/swagger.json
upstream_version: Vald.Api.ExternalNordbord.V1 v1 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD NordBord API

## VALD NordBord API host and specification

- Host: `https://prd-<region>-api-externalnordbord.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-externalnordbord.valdperformance.com/swagger/v1/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalNordbord.V1", `info.version` "v1").
- Local snapshot: `specs/vald/externalnordbord.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`. The spec applies it to every operation.
- The spec declares no `servers`. Its 270 schema fields have no descriptions.

## VALD NordBord endpoints

| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/tests/{testId}/nordbordtrace` | Retrieves a Nordbord force trace. |  |
| `GET` | `/tests/{testId}` | Retrieves a Nordbord test summary. |  |
| `GET` | `/tests` | Retrieves a collection of pageable Nordbord test summaries. | yes |
| `GET` | `/tests/v2` | Retrieves a collection of Nordbord test summaries by modified date. |  |
| `GET` | `/tests/{testId}/metrics` | Retrieves additional metrics for a Nordbord test summary. |  |
| `GET` | `/training/programs/current` | Retrieves a list of Nordbord training programs or a single program. |  |
| `GET` | `/training/sessions/eccentric` | Retrieves a list of Nordbord eccentric training sessions |  |
| `GET` | `/training/sessions/eccentric/exercises` | Retrieves a list of Nordbord eccentric training exercise sessions |  |
| `GET` | `/training/sessions/eccentric/exercises/repetitions` | Retrieves a list of Nordbord eccentric training exercise repetition sessions |  |
| `GET` | `/training/sessions/isometric` | Retrieves a list of Nordbord isometric training sessions |  |
| `GET` | `/training/sessions/isometric/exercises` | Retrieves a list of Nordbord isometric training exercise sessions |  |
| `GET` | `/training/sessions/isometric/exercises/repetitions` | Retrieves a list of Nordbord isometric training exercise sessions |  |

## VALD NordBord service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string) | `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalNordbord.V1.Features.Diagnostics.Responses.GetDiagnosticsResponse` |

## VALD NordBord: `GET /tests/{testId}/nordbordtrace`

Retrieves a Nordbord force trace.

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestForceTraceResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD NordBord: `GET /tests/{testId}`

Retrieves a Nordbord test summary.

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestSummaryResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD NordBord: `GET /tests`

Retrieves a collection of pageable Nordbord test summaries. Marked `deprecated` in the spec.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `TestFromUtc` (query, string, format date-time, required)
- `TestToUtc` (query, string, format date-time, required)
- `AthleteId` (query, string, format uuid)
- `Page` (query, integer, format int32)
- `PageSize` (query, integer, format int32)

Responses:

- `200` OK: `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetPagedTestSummariesResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD NordBord: `GET /tests/v2`

Retrieves a collection of Nordbord test summaries by modified date.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestSummariesByModifiedDateResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD NordBord: `GET /tests/{testId}/metrics`

Retrieves additional metrics for a Nordbord test summary.

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid)

Responses:

- `200` OK: `Vald.Api.ExternalNordbord.V1.Features.Tests.Messages.GetTestSummaryAdditionalMetrics.GetTestSummaryAdditionalMetricsResult`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD NordBord: `GET /training/programs/current`

Retrieves a list of Nordbord training programs or a single program.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `Id` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingProgramResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord: `GET /training/sessions/eccentric`

Retrieves a list of Nordbord eccentric training sessions

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsEccentricResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord: `GET /training/sessions/eccentric/exercises`

Retrieves a list of Nordbord eccentric training exercise sessions

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsEccentricExercisesResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord: `GET /training/sessions/eccentric/exercises/repetitions`

Retrieves a list of Nordbord eccentric training exercise repetition sessions

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsEccentricExerciseRepetitionsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord: `GET /training/sessions/isometric`

Retrieves a list of Nordbord isometric training sessions

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsIsometricResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord: `GET /training/sessions/isometric/exercises`

Retrieves a list of Nordbord isometric training exercise sessions

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsIsometricExercisesResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord: `GET /training/sessions/isometric/exercises/repetitions`

Retrieves a list of Nordbord isometric training exercise sessions

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsIsometricExerciseRepetitionsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD NordBord schemas

The 27 component schemas of the NordBord spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

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
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |
| `errors` | object (map of array of `string`) |  | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Diagnostics.DiagnosticsResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Diagnostics.Responses.GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalNordbord.V1.Features.Diagnostics.DiagnosticsResult` | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Messages.GetTestSummaryAdditionalMetrics.GetTestSummaryAdditionalMetricsResult`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `athleteId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `leftMaxForcePerKg` | `number` | `double` | yes |
| `rightMaxForcePerKg` | `number` | `double` | yes |
| `leftAvgForcePerKg` | `number` | `double` | yes |
| `rightAvgForcePerKg` | `number` | `double` | yes |
| `leftMaxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `rightMaxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `leftAvgRFDNewtonsPerSecond` | `number` | `double` | yes |
| `rightAvgRFDNewtonsPerSecond` | `number` | `double` | yes |
| `leftMinTimeToMaxForceSeconds` | `number` | `double` | yes |
| `rightMinTimeToMaxForceSeconds` | `number` | `double` | yes |
| `leftAvgTimeToMaxForceSeconds` | `number` | `double` | yes |
| `rightAvgTimeToMaxForceSeconds` | `number` | `double` | yes |
| `leftMaxTorquePerKg` | `number` | `double` | yes |
| `rightMaxTorquePerKg` | `number` | `double` | yes |
| `leftAvgTorquePerKg` | `number` | `double` | yes |
| `rightAvgTorquePerKg` | `number` | `double` | yes |
| `leftMaxRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `leftAvgRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `rightMaxRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `rightAvgRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `leftMaxRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `leftAvgRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `rightMaxRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `rightAvgRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `leftMaxRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `leftAvgRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `rightMaxRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `rightAvgRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `leftMaxRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `leftAvgRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `rightMaxRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `rightAvgRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `leftMaxRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `leftAvgRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `rightMaxRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `rightAvgRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `leftMaxImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `leftAvgImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `rightMaxImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `rightAvgImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `leftMaxImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `leftAvgImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `rightMaxImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `rightAvgImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `leftMaxImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `leftAvgImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `rightMaxImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `rightAvgImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `leftMaxImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `leftAvgImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `rightMaxImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `rightAvgImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `leftMaxImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `leftAvgImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `rightMaxImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `rightAvgImpulse250msNewtonSeconds` | `number` | `double` | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.ForceTrace`

| Field | Type | Format |
| --- | --- | --- |
| `ticks` | `integer` | `int64` |
| `leftForce` | `number` | `double` |
| `rightForce` | `number` | `double` |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetPagedTestSummariesResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tests` | array of `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestSummaryResponse` |  | yes |
| `page` | `integer` | `int32` |  |
| `pageCount` | `integer` | `int32` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestForceTraceResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `athleteId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `testTypeId` | `string` | `uuid` |  |
| `testTypeName` | `string` |  | yes |
| `forces` | array of `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.ForceTrace` |  | yes |
| `device` | `string` |  | yes |
| `testDateUtc` | `string` | `date-time` |  |
| `notes` | `string` |  | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestSummariesByModifiedDateResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `tests` | array of `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.TestSummary` | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.GetTestSummaryResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `athleteId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `modifiedUtc` | `string` | `date-time` |  |
| `testDateUtc` | `string` | `date-time` |  |
| `testTypeId` | `string` | `uuid` |  |
| `testTypeName` | `string` |  | yes |
| `notes` | `string` |  | yes |
| `device` | `string` |  | yes |
| `leftAvgForce` | `number` | `double` |  |
| `leftImpulse` | `number` | `double` |  |
| `leftMaxForce` | `number` | `double` |  |
| `leftTorque` | `number` | `double` |  |
| `leftCalibration` | `number` | `double` |  |
| `rightAvgForce` | `number` | `double` |  |
| `rightImpulse` | `number` | `double` |  |
| `rightMaxForce` | `number` | `double` |  |
| `rightTorque` | `number` | `double` |  |
| `rightCalibration` | `number` | `double` |  |
| `leftRepetitions` | `integer` | `int32` |  |
| `rightRepetitions` | `integer` | `int32` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Tests.Responses.TestSummary`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `profileId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `testDateUtc` | `string` | `date-time` |  |
| `testTypeId` | `string` | `uuid` |  |
| `testTypeName` | `string` |  | yes |
| `notes` | `string` |  | yes |
| `device` | `string` |  | yes |
| `leftAvgForce` | `number` | `double` |  |
| `leftImpulse` | `number` | `double` |  |
| `leftMaxForce` | `number` | `double` |  |
| `leftTorque` | `number` | `double` |  |
| `leftCalibration` | `number` | `double` |  |
| `leftRepetitions` | `integer` | `int32` |  |
| `rightAvgForce` | `number` | `double` |  |
| `rightImpulse` | `number` | `double` |  |
| `rightMaxForce` | `number` | `double` |  |
| `rightTorque` | `number` | `double` |  |
| `rightCalibration` | `number` | `double` |  |
| `rightRepetitions` | `integer` | `int32` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.EccentricPrescriptionType`

Type `string`.

| Value |
|---|
| `Repetitions` |
| `TotalImpulse` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.EccentricThresholdType`

Type `string`.

| Value |
|---|
| `Manual` |
| `PersonalBest` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingProgramResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `name` | `string` |  | yes |
| `addedDateUtc` | `string` | `date-time` |  |
| `programInstanceId` | `string` | `uuid` |  |
| `instanceAddedDateUtc` | `string` | `date-time` |  |
| `exercises` | array of `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ProgramExercise` |  | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsEccentricExerciseRepetitionsResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `sessionExerciseId` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` | yes |
| `tenantId` | `string` | `uuid` | yes |
| `repetitionDateUtc` | `string` | `date-time` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `repNumber` | `integer` | `int32` |  |
| `exceededTrainingThreshold` | `boolean` |  |  |
| `enteredTargetZone` | `boolean` |  |  |
| `leftImpulseInTargetZoneNewtonSeconds` | `number` | `double` |  |
| `rightImpulseInTargetZoneNewtonSeconds` | `number` | `double` |  |
| `leftTimeInTargetZoneSeconds` | `number` | `double` |  |
| `rightTimeInTargetZoneSeconds` | `number` | `double` |  |
| `durationInTargetZoneSeconds` | `number` | `double` |  |
| `leftImpulseAboveThresholdNewtonSeconds` | `number` | `double` |  |
| `rightImpulseAboveThresholdNewtonSeconds` | `number` | `double` |  |
| `leftTimeAboveThresholdSeconds` | `number` | `double` |  |
| `rightTimeAboveThresholdSeconds` | `number` | `double` |  |
| `durationAboveThresholdSeconds` | `number` | `double` |  |
| `leftImpulseBelowThresholdNewtonSeconds` | `number` | `double` |  |
| `rightImpulseBelowThresholdNewtonSeconds` | `number` | `double` |  |
| `leftTimeBelowThresholdSeconds` | `number` | `double` |  |
| `rightTimeBelowThresholdSeconds` | `number` | `double` |  |
| `durationBelowThresholdSeconds` | `number` | `double` |  |
| `leftImpulseBeforePeakNewtonSeconds` | `number` | `double` |  |
| `rightImpulseBeforePeakNewtonSeconds` | `number` | `double` |  |
| `leftImpulseAfterPeakNewtonSeconds` | `number` | `double` |  |
| `rightImpulseAfterPeakNewtonSeconds` | `number` | `double` |  |
| `repDurationSeconds` | `number` | `double` |  |
| `timeToPeakSeconds` | `number` | `double` |  |
| `leftPeakForceNewtons` | `number` | `double` |  |
| `rightPeakForceNewtons` | `number` | `double` |  |
| `leftImpulseEntireRepNewtonSeconds` | `number` | `double` |  |
| `rightImpulseEntireRepNewtonSeconds` | `number` | `double` |  |
| `leftImpulseAboveThresholdBeforePeakNewtonSeconds` | `number` | `double` |  |
| `rightImpulseAboveThresholdBeforePeakNewtonSeconds` | `number` | `double` |  |
| `leftImpulseAboveThresholdAfterPeakNewtonSeconds` | `number` | `double` |  |
| `rightImpulseAboveThresholdAfterPeakNewtonSeconds` | `number` | `double` |  |
| `leftTimeToPeakSeconds` | `number` | `double` |  |
| `rightTimeToPeakSeconds` | `number` | `double` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsEccentricExercisesResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `sessionId` | `string` | `uuid` |  |
| `programInstanceExerciseId` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` | yes |
| `tenantId` | `string` | `uuid` | yes |
| `exerciseDateUtc` | `string` | `date-time` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `baseExerciseId` | `string` | `uuid` | yes |
| `totalRepsCompleted` | `integer` | `int32` |  |
| `totalRepsAboveThreshold` | `integer` | `int32` |  |
| `totalRepsInTargetZone` | `number` | `double` |  |
| `eccentricPrescriptionType` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.EccentricPrescriptionType` |  |  |
| `prescribedEccentricRepetitions` | `integer` | `int32` |  |
| `prescribedEccentricTotalImpulseNewtonSeconds` | `integer` | `int32` |  |
| `totalImpulseInTargetZoneNewtonSeconds` | `number` | `double` |  |
| `totalDurationInTargetZoneSeconds` | `number` | `double` |  |
| `totalImpulseInTargetZoneAsymmetryPercentage` | `number` | `double` |  |
| `totalImpulseAboveThresholdNewtonSeconds` | `number` | `double` |  |
| `totalDurationAboveThresholdSeconds` | `number` | `double` |  |
| `totalImpulseAboveThresholdAsymmetryPercentage` | `number` | `double` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsEccentricResponse`

| Field | Type | Format |
| --- | --- | --- |
| `id` | `string` | `uuid` |
| `profileId` | `string` | `uuid` |
| `tenantId` | `string` | `uuid` |
| `sessionDateUtc` | `string` | `date-time` |
| `modifiedDateUtc` | `string` | `date-time` |
| `programInstanceId` | `string` | `uuid` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsIsometricExerciseRepetitionsResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `sessionExerciseId` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` | yes |
| `tenantId` | `string` | `uuid` | yes |
| `repetitionDateUtc` | `string` | `date-time` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `timeInZoneLeft` | `number` | `double` |  |
| `timeInZoneRight` | `number` | `double` |  |
| `impulseLeft` | `number` | `double` |  |
| `impulseRight` | `number` | `double` |  |
| `stabilityLeft` | `number` | `double` |  |
| `stabilityRight` | `number` | `double` |  |
| `repNumber` | `integer` | `int32` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsIsometricExercisesResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` | yes |
| `tenantId` | `string` | `uuid` | yes |
| `sessionId` | `string` | `uuid` |  |
| `programInstanceExerciseId` | `string` | `uuid` |  |
| `exerciseDateUtc` | `string` | `date-time` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `baseExerciseId` | `string` | `uuid` | yes |
| `timeInZoneLeft` | `number` | `double` |  |
| `timeInZoneRight` | `number` | `double` |  |
| `impulseLeft` | `number` | `double` |  |
| `impulseRight` | `number` | `double` |  |
| `stabilityLeft` | `number` | `double` |  |
| `stabilityRight` | `number` | `double` |  |
| `totalRepetitions` | `integer` | `int32` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.GetTrainingSessionsIsometricResponse`

| Field | Type | Format |
| --- | --- | --- |
| `id` | `string` | `uuid` |
| `profileId` | `string` | `uuid` |
| `tenantId` | `string` | `uuid` |
| `sessionDateUtc` | `string` | `date-time` |
| `programInstanceId` | `string` | `uuid` |
| `modifiedDateUtc` | `string` | `date-time` |
| `timeInZoneLeft` | `number` | `double` |
| `timeInZoneRight` | `number` | `double` |
| `impulseLeft` | `number` | `double` |
| `impulseRight` | `number` | `double` |
| `stabilityLeft` | `number` | `double` |
| `stabilityRight` | `number` | `double` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.LateralityType`

Type `string`.

| Value |
|---|
| `Left` |
| `Right` |
| `Bilateral` |
| `UnilateralAlternating` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ProgramEccentricConfiguration`

| Field | Type | Format | Nullable | Required |
| --- | --- | --- | --- | --- |
| `id` | `string` | `uuid` |  | yes |
| `programInstanceExerciseId` | `string` | `uuid` |  | yes |
| `thresholdType` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.EccentricThresholdType` |  |  | yes |
| `thresholdValue` | `number` | `double` |  | yes |
| `thresholdValueUnit` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ThresholdUnitType` |  |  | yes |
| `targetZoneLowerValue` | `number` | `double` |  | yes |
| `targetZoneUpperValue` | `number` | `double` | yes |  |
| `targetZoneAsymmetryLowerLimit` | `number` | `double` |  | yes |
| `targetZoneAsymmetryUpperLimit` | `number` | `double` |  | yes |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ProgramExercise`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `order` | `integer` | `int32` |  |
| `repetitions` | `integer` | `int32` |  |
| `restTimeSeconds` | `integer` | `int64` |  |
| `testTypeName` | `string` |  | yes |
| `testTypeId` | `string` | `uuid` |  |
| `trainingType` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.TrainingType` |  |  |
| `baseExerciseId` | `string` | `uuid` | yes |
| `eccentricPrescriptionType` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.EccentricPrescriptionType` |  |  |
| `eccentricRepetitions` | `integer` | `int32` | yes |
| `eccentricTotalImpulse` | `integer` | `int32` | yes |
| `isometricConfiguration` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ProgramIsometricConfiguration` |  |  |
| `eccentricConfiguration` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ProgramEccentricConfiguration` |  |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ProgramIsometricConfiguration`

| Field | Type | Format |
| --- | --- | --- |
| `id` | `string` | `uuid` |
| `programInstanceExerciseId` | `string` | `uuid` |
| `trainingZone` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.TrainingZoneType` |  |
| `forceGoal` | `number` | `double` |
| `tolerance` | `number` | `double` |
| `contractionTimeSeconds` | `integer` | `int64` |
| `laterality` | `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.LateralityType` |  |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.ThresholdUnitType`

Type `string`.

| Value |
|---|
| `Percentage` |
| `Newton` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.TrainingType`

Type `string`.

| Value |
|---|
| `Isometric` |
| `Eccentric` |

### `Vald.Api.ExternalNordbord.V1.Features.Training.Responses.TrainingZoneType`

Type `string`.

| Value |
|---|
| `Manual` |
| `Max` |
| `Average` |
