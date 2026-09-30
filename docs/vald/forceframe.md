---
source_type: curated
source_url: https://prd-euw-api-externalforceframe.valdperformance.com/swagger/v1/swagger.json
upstream_version: Vald.Api.ExternalForceFrame.V1 v1 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD ForceFrame API

## VALD ForceFrame API host and specification

- Host: `https://prd-<region>-api-externalforceframe.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-externalforceframe.valdperformance.com/swagger/v1/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalForceFrame.V1", `info.version` "v1").
- Local snapshot: `specs/vald/externalforceframe.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`. The spec applies it to every operation.
- The spec declares no `servers`. Its 278 schema fields have no descriptions.

## VALD ForceFrame endpoints

| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/tests/{testId}/forceframetrace` | Retrieves a ForceFrame force trace. |  |
| `GET` | `/tests/{testId}` | Retrieves a ForceFrame test summary. |  |
| `GET` | `/tests/{testId}/repetitions` |  |  |
| `GET` | `/tests` | Retrieves a collection of pageable ForceFrame test summaries. | yes |
| `GET` | `/tests/v2` | Retrieves a collection of ForceFrame test summaries. |  |
| `GET` | `/tests/{testId}/metrics` | Retrieves additional metrics for a ForceFrame test summary. |  |
| `GET` | `/training/programs/current` | Retrieves a list of ForceFrame training programs or a single program. |  |
| `GET` | `/training/sessions` | Retrieves a list of ForceFrame training sessions. |  |
| `GET` | `/training/sessions/exercises` | Retrieves a list of ForceFrame training session exercises or a single training session exercise. |  |
| `GET` | `/training/sessions/exercises/repetitions` | Retrieves a list of ForceFrame training session exercise repetitions or a single training session exercise repetition. |  |

## VALD ForceFrame service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string) | `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalForceFrame.V1.Models.GetDiagnosticsHttpResponse` |

## VALD ForceFrame: `GET /tests/{testId}/forceframetrace`

Retrieves a ForceFrame force trace.

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalForceFrame.V1.Models.GetTraceResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD ForceFrame: `GET /tests/{testId}`

Retrieves a ForceFrame test summary.

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalForceFrame.V1.Models.GetTestSummaryResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD ForceFrame: `GET /tests/{testId}/repetitions`

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `200` OK: array of `Vald.Api.ExternalForceFrame.V1.Messages.GetTestRepetitions.GetTestRepetitionsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD ForceFrame: `GET /tests`

Retrieves a collection of pageable ForceFrame test summaries. Marked `deprecated` in the spec.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `TestFromUtc` (query, string, format date-time, required)
- `TestToUtc` (query, string, format date-time, required)
- `AthleteId` (query, string, format uuid)
- `Page` (query, integer, format int32)
- `PageSize` (query, integer, format int32)

Responses:

- `204` No Content
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalForceFrame.V1.Models.GetTestsByDateRangeResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD ForceFrame: `GET /tests/v2`

Retrieves a collection of ForceFrame test summaries.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `204` No Content
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalForceFrame.V1.Models.GetTestsByModifiedDateResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD ForceFrame: `GET /tests/{testId}/metrics`

Retrieves additional metrics for a ForceFrame test summary.

Parameters:

- `testId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalForceFrame.V1.Messages.GetTestSummaryAdditionalMetricsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD ForceFrame: `GET /training/programs/current`

Retrieves a list of ForceFrame training programs or a single program.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `Id` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingProgram.GetTrainingProgramResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD ForceFrame: `GET /training/sessions`

Retrieves a list of ForceFrame training sessions.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingSessions.GetTrainingSessionsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD ForceFrame: `GET /training/sessions/exercises`

Retrieves a list of ForceFrame training session exercises or a single training session exercise.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingSessionExercises.GetTrainingSessionExercisesResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD ForceFrame: `GET /training/sessions/exercises/repetitions`

Retrieves a list of ForceFrame training session exercise repetitions or a single training session exercise repetition.

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)
- `ProfileId` (query, string, format uuid)

Responses:

- `200` OK: array of `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingSessionExerciseRepetitions.GetTrainingSessionExerciseRepetitionsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD ForceFrame schemas

The 22 component schemas of the ForceFrame spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

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

### `Vald.Api.ExternalForceFrame.V1.Core.Defaults.ForceTarget`

Type `string`.

| Value |
|---|
| `Manual` |
| `Max` |
| `Average` |

### `Vald.Api.ExternalForceFrame.V1.Core.Defaults.Joint`

Type `string`.

| Value |
|---|
| `Hamstring` |
| `Hip` |
| `Ankle` |
| `Knee` |
| `Shoulder` |
| `Neck` |
| `Elbow` |
| `Dyno` |
| `Custom` |

### `Vald.Api.ExternalForceFrame.V1.Core.Defaults.Laterality`

Type `string`.

| Value |
|---|
| `Bilateral` |
| `UnilateralAlternating` |
| `Left` |
| `Right` |
| `NA` |

### `Vald.Api.ExternalForceFrame.V1.Core.Defaults.Movement`

Type `string`.

| Value |
|---|
| `Abduction` |
| `Adduction` |
| `InternalRotation` |
| `ExternalRotation` |
| `Flexion` |
| `Extension` |
| `Eccentric` |
| `Concentric` |
| `AbductionAdduction` |
| `InternalExternalRotation` |
| `FlexionExtension` |
| `EccentricConcentric` |
| `LateralFlexion` |
| `Dorsiflexion` |
| `Inversion` |
| `Eversion` |
| `PlantarFlexion` |
| `InnerPaddles` |
| `OuterPaddles` |

### `Vald.Api.ExternalForceFrame.V1.DiagnosticsResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalForceFrame.V1.Enums.SensorType`

Type `string`.

| Value |
|---|
| `InnerLeft` |
| `InnerRight` |
| `OuterLeft` |
| `OuterRight` |
| `FlatLeft` |
| `FlatRight` |

### `Vald.Api.ExternalForceFrame.V1.Messages.GetTestRepetitions.GetTestRepetitionsResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `sensorType` | `Vald.Api.ExternalForceFrame.V1.Enums.SensorType` |  |  |
| `repNumber` | `integer` | `int32` |  |
| `startOffsetSeconds` | `number` | `double` | yes |
| `endOffsetSeconds` | `number` | `double` | yes |
| `maxForce` | `number` | `double` |  |
| `impulse` | `number` | `double` |  |
| `maxForcePerKg` | `number` | `double` | yes |
| `maxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `timeToMaxForceSeconds` | `number` | `double` | yes |
| `rfd50msNewtonsPerSecond` | `number` | `double` | yes |
| `rfd100msNewtonsPerSecond` | `number` | `double` | yes |
| `rfd150msNewtonsPerSecond` | `number` | `double` | yes |
| `rfd200msNewtonsPerSecond` | `number` | `double` | yes |
| `rfd250msNewtonsPerSecond` | `number` | `double` | yes |
| `impulse50msNewtonSeconds` | `number` | `double` | yes |
| `impulse100msNewtonSeconds` | `number` | `double` | yes |
| `impulse150msNewtonSeconds` | `number` | `double` | yes |
| `impulse200msNewtonSeconds` | `number` | `double` | yes |
| `impulse250msNewtonSeconds` | `number` | `double` | yes |

### `Vald.Api.ExternalForceFrame.V1.Messages.GetTestSummaryAdditionalMetricsResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `athleteId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `innerLeftMaxForcePerKg` | `number` | `double` | yes |
| `innerRightMaxForcePerKg` | `number` | `double` | yes |
| `outerLeftMaxForcePerKg` | `number` | `double` | yes |
| `outerRightMaxForcePerKg` | `number` | `double` | yes |
| `innerLeftAvgForcePerKg` | `number` | `double` | yes |
| `innerRightAvgForcePerKg` | `number` | `double` | yes |
| `outerLeftAvgForcePerKg` | `number` | `double` | yes |
| `outerRightAvgForcePerKg` | `number` | `double` | yes |
| `innerLeftMaxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightMaxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftMaxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightMaxRFDNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftAvgRFDNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightAvgRFDNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftAvgRFDNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightAvgRFDNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftMinTimeToMaxForceSeconds` | `number` | `double` | yes |
| `innerRightMinTimeToMaxForceSeconds` | `number` | `double` | yes |
| `outerLeftMinTimeToMaxForceSeconds` | `number` | `double` | yes |
| `outerRightMinTimeToMaxForceSeconds` | `number` | `double` | yes |
| `innerLeftAvgTimeToMaxForceSeconds` | `number` | `double` | yes |
| `innerRightAvgTimeToMaxForceSeconds` | `number` | `double` | yes |
| `outerLeftAvgTimeToMaxForceSeconds` | `number` | `double` | yes |
| `outerRightAvgTimeToMaxForceSeconds` | `number` | `double` | yes |
| `innerLeftMaxRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightMaxRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftMaxRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightMaxRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftAvgRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightAvgRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftAvgRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightAvgRFD50msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftMaxRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightMaxRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftMaxRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightMaxRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftAvgRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightAvgRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftAvgRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightAvgRFD100msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftMaxRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightMaxRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftMaxRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightMaxRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftAvgRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightAvgRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftAvgRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightAvgRFD150msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftMaxRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightMaxRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftMaxRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightMaxRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftAvgRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightAvgRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftAvgRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightAvgRFD200msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftMaxRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightMaxRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftMaxRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightMaxRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftAvgRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `innerRightAvgRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `outerLeftAvgRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `outerRightAvgRFD250msNewtonsPerSecond` | `number` | `double` | yes |
| `innerLeftMaxImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `innerRightMaxImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftMaxImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `outerRightMaxImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftAvgImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `innerRightAvgImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftAvgImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `outerRightAvgImpulse50msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftMaxImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `innerRightMaxImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftMaxImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `outerRightMaxImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftAvgImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `innerRightAvgImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftAvgImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `outerRightAvgImpulse100msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftMaxImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `innerRightMaxImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftMaxImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `outerRightMaxImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftAvgImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `innerRightAvgImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftAvgImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `outerRightAvgImpulse150msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftMaxImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `innerRightMaxImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftMaxImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `outerRightMaxImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftAvgImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `innerRightAvgImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftAvgImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `outerRightAvgImpulse200msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftMaxImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `innerRightMaxImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftMaxImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `outerRightMaxImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `innerLeftAvgImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `innerRightAvgImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `outerLeftAvgImpulse250msNewtonSeconds` | `number` | `double` | yes |
| `outerRightAvgImpulse250msNewtonSeconds` | `number` | `double` | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.Force`

| Field | Type | Format |
| --- | --- | --- |
| `ticks` | `integer` | `int64` |
| `innerLeftForce` | `number` | `double` |
| `innerRightForce` | `number` | `double` |
| `outerLeftForce` | `number` | `double` |
| `outerRightForce` | `number` | `double` |

### `Vald.Api.ExternalForceFrame.V1.Models.GetDiagnosticsHttpResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalForceFrame.V1.DiagnosticsResult` | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTestSummaryResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `athleteId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `testDateUtc` | `string` | `date-time` |  |
| `testTypeId` | `string` | `uuid` |  |
| `testPositionId` | `string` | `uuid` |  |
| `notes` | `string` |  | yes |
| `innerLeftAvgForce` | `number` | `double` |  |
| `innerLeftImpulse` | `number` | `double` |  |
| `innerLeftMaxForce` | `number` | `double` |  |
| `innerLeftRepetitions` | `integer` | `int32` |  |
| `innerRightAvgForce` | `number` | `double` |  |
| `innerRightImpulse` | `number` | `double` |  |
| `innerRightMaxForce` | `number` | `double` |  |
| `innerRightRepetitions` | `integer` | `int32` |  |
| `outerLeftAvgForce` | `number` | `double` |  |
| `outerLeftImpulse` | `number` | `double` |  |
| `outerLeftMaxForce` | `number` | `double` |  |
| `outerLeftRepetitions` | `integer` | `int32` |  |
| `outerRightAvgForce` | `number` | `double` |  |
| `outerRightImpulse` | `number` | `double` |  |
| `outerRightMaxForce` | `number` | `double` |  |
| `outerRightRepetitions` | `integer` | `int32` |  |
| `device` | `string` |  | yes |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `testTypeName` | `string` |  | yes |
| `testPositionName` | `string` |  | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTestSummaryResponseV2`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `profileId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `testDateUtc` | `string` | `date-time` |  |
| `testTypeId` | `string` | `uuid` |  |
| `testPositionId` | `string` | `uuid` |  |
| `notes` | `string` |  | yes |
| `innerLeftAvgForce` | `number` | `double` |  |
| `innerLeftImpulse` | `number` | `double` |  |
| `innerLeftMaxForce` | `number` | `double` |  |
| `innerLeftRepetitions` | `integer` | `int32` |  |
| `innerRightAvgForce` | `number` | `double` |  |
| `innerRightImpulse` | `number` | `double` |  |
| `innerRightMaxForce` | `number` | `double` |  |
| `innerRightRepetitions` | `integer` | `int32` |  |
| `outerLeftAvgForce` | `number` | `double` |  |
| `outerLeftImpulse` | `number` | `double` |  |
| `outerLeftMaxForce` | `number` | `double` |  |
| `outerLeftRepetitions` | `integer` | `int32` |  |
| `outerRightAvgForce` | `number` | `double` |  |
| `outerRightImpulse` | `number` | `double` |  |
| `outerRightMaxForce` | `number` | `double` |  |
| `outerRightRepetitions` | `integer` | `int32` |  |
| `device` | `string` |  | yes |
| `modifiedDateUtc` | `string` |  | yes |
| `testTypeName` | `string` |  | yes |
| `testPositionName` | `string` |  | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTestsByDateRangeResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tests` | array of `Vald.Api.ExternalForceFrame.V1.Models.GetTestSummaryResponse` |  | yes |
| `page` | `integer` | `int32` |  |
| `pageCount` | `integer` | `int32` |  |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTestsByModifiedDateResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `tests` | array of `Vald.Api.ExternalForceFrame.V1.Models.GetTestSummaryResponseV2` | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTraceResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `athleteId` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `testTypeId` | `string` | `uuid` |  |
| `testTypeName` | `string` |  | yes |
| `testPositionId` | `string` | `uuid` |  |
| `testPositionName` | `string` |  | yes |
| `forces` | array of `Vald.Api.ExternalForceFrame.V1.Models.Force` |  | yes |
| `device` | `string` |  | yes |
| `testDateUTC` | `string` | `date-time` |  |
| `notes` | `string` |  | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingProgram.GetTrainingProgramResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `name` | `string` |  | yes |
| `exercises` | array of `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingProgram.TrainingExercise` |  | yes |
| `scheduledDatesUTC` | array of `string` | `date-time` | yes |
| `addedDate` | `string` | `date-time` |  |
| `modifiedDate` | `string` | `date-time` |  |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingProgram.TrainingExercise`

| Field | Type | Format | Nullable | Required | Description |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | `uuid` |  | yes |  |
| `contractionTime` | `string` | `date-span` |  | yes |  |
| `forceGoal` | `number` | `double` |  | yes |  |
| `trainingZone` | `Vald.Api.ExternalForceFrame.V1.Core.Defaults.ForceTarget` |  |  | yes |  |
| `laterality` | `Vald.Api.ExternalForceFrame.V1.Core.Defaults.Laterality` |  |  | yes |  |
| `movement` | `Vald.Api.ExternalForceFrame.V1.Core.Defaults.Movement` |  |  | yes |  |
| `joint` | `Vald.Api.ExternalForceFrame.V1.Core.Defaults.Joint` |  |  | yes |  |
| `repetitions` | `integer` | `int32` |  | yes |  |
| `restTime` | `string` | `date-span` |  | yes |  |
| `restTimeAfterSet` | `string` | `date-span` |  | yes |  |
| `tolerance` | `number` | `double` |  | yes |  |
| `toleranceUnit` | `string` |  |  | yes | minLength: `1` |
| `order` | `integer` | `int32` |  | yes | minimum: `1` maximum: `2147483647` |
| `trainingPositionId` | `string` | `uuid` |  | yes |  |
| `testTypeName` | `string` |  | yes |  |  |
| `testTypeId` | `string` | `uuid` | yes |  |  |
| `testPositionId` | `string` | `uuid` | yes |  |  |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingSessionExerciseRepetitions.GetTrainingSessionExerciseRepetitionsResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` | yes |
| `tenantId` | `string` | `uuid` | yes |
| `sessionId` | `string` | `uuid` |  |
| `sessionExerciseId` | `string` | `uuid` |  |
| `programExerciseId` | `string` | `uuid` |  |
| `repetitionId` | `string` | `uuid` |  |
| `repetition` | `integer` | `int32` |  |
| `repetitionDateUTC` | `string` | `date-time` |  |
| `modifiedDateUTC` | `string` | `date-time` |  |
| `timeInZoneLeft` | `number` | `double` |  |
| `timeInZoneRight` | `number` | `double` |  |
| `stabilityLeft` | `number` | `double` |  |
| `stabilityRight` | `number` | `double` |  |
| `impulseLeft` | `number` | `double` |  |
| `impulseRight` | `number` | `double` |  |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingSessionExercises.GetTrainingSessionExercisesResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `sessionId` | `string` | `uuid` |  |
| `programExerciseId` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` | yes |
| `tenantId` | `string` | `uuid` | yes |
| `exerciseDateUtc` | `string` | `date-time` |  |
| `modifiedDateUTC` | `string` | `date-time` |  |
| `timeInZoneLeft` | `number` | `double` | yes |
| `timeInZoneRight` | `number` | `double` | yes |
| `impulseLeft` | `number` | `double` | yes |
| `impulseRight` | `number` | `double` | yes |
| `stabilityLeft` | `number` | `double` | yes |
| `stabilityRight` | `number` | `double` | yes |

### `Vald.Api.ExternalForceFrame.V1.Models.GetTrainingSessions.GetTrainingSessionsResponse`

| Field | Type | Format |
| --- | --- | --- |
| `id` | `string` | `uuid` |
| `profileId` | `string` | `uuid` |
| `tenantId` | `string` | `uuid` |
| `programId` | `string` | `uuid` |
| `sessionDateUtc` | `string` | `date-time` |
| `modifiedDateUTC` | `string` | `date-time` |
| `impulseLeft` | `number` | `double` |
| `impulseRight` | `number` | `double` |
| `stabilityLeft` | `number` | `double` |
| `stabilityRight` | `number` | `double` |
| `timeInZoneLeft` | `number` | `double` |
| `timeInZoneRight` | `number` | `double` |
