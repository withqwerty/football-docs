---
source_type: curated
source_url: https://prd-euw-api-extdynamo.valdperformance.com/swagger/v1/swagger.json
upstream_version: Vald.Api.ExternalDynamo.V1 v1 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD DynaMo API

## VALD DynaMo API host and specification

- Host: `https://prd-<region>-api-extdynamo.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-extdynamo.valdperformance.com/swagger/v1/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalDynamo.V1", `info.version` "v1").
- Local snapshot: `specs/vald/extdynamo.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`, `audience` "vald-api-external". The spec applies it to every operation.
- The spec declares no `servers`. Its 149 schema fields have no descriptions.

## VALD DynaMo endpoints

| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/v2022q2/teams/{teamId}/tests` |  |  |
| `GET` | `/v2022q2/teams/{teamId}/tests/{testId}` |  |  |
| `GET` | `/v2022q2/teams/{teamId}/tests/{testId}/trace` |  |  |
| `GET` | `/v1/test/tests-by-modified-date` |  |  |

## VALD DynaMo service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string) | `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalDynamo.V1.Configuration.Diagnostics.GetDiagnosticsResponse` |

## VALD DynaMo: `GET /v2022q2/teams/{teamId}/tests`

Parameters:

- `teamId` (path, string, format uuid, required)
- `athleteId` (query, string, format uuid)
- `testFromUTC` (query, string, format date-time)
- `testToUTC` (query, string, format date-time)
- `modifiedFromUTC` (query, string, format date-time)
- `includeRepSummaries` (query, boolean)
- `includeReps` (query, boolean)
- `page` (query, integer, format int32)

Responses:

- `200` OK: `Vald.Api.ExternalDynamo.V1.Models.PagedDTO`1[[Vald.Api.ExternalDynamo.V1.Models.TestDTO, Vald.Api.ExternalDynamo.V1, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD DynaMo: `GET /v2022q2/teams/{teamId}/tests/{testId}`

Parameters:

- `teamId` (path, string, format uuid, required)
- `testId` (path, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalDynamo.V1.Models.TestDTO`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD DynaMo: `GET /v2022q2/teams/{teamId}/tests/{testId}/trace`

Parameters:

- `teamId` (path, string, format uuid, required)
- `testId` (path, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD DynaMo: `GET /v1/test/tests-by-modified-date`

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ModifiedFromUtc` (query, string, format date-time, required)

Responses:

- `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalDynamo.V1.Models.TestCursorHttpResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD DynaMo schemas

The 23 component schemas of the DynaMo spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

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

### `Vald.Api.ExternalDynamo.V1.Configuration.Diagnostics.DiagnosticResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalDynamo.V1.Configuration.Diagnostics.GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalDynamo.V1.Configuration.Diagnostics.DiagnosticResult` | yes |

### `Vald.Api.ExternalDynamo.V1.Models.AsymmetryDTO`

| Field | Type | Format | Description |
| --- | --- | --- | --- |
| `movement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |  |
| `valuePercentage` | `number` | `double` | minimum: `-100` maximum: `100` |

### `Vald.Api.ExternalDynamo.V1.Models.AttachmentType`

Type `string`.

| Value |
|---|
| `None` |
| `CurvedPad` |
| `FlatPad` |
| `PalmPad` |
| `TensionLink` |
| `GripInner` |
| `GripOuter` |

### `Vald.Api.ExternalDynamo.V1.Models.Attachments`

Type `string`.

| Value |
|---|
| `LeftNoneRightNone` |
| `LeftPalmPadRightCurvedPad` |
| `LeftPalmPadRightFlatPad` |
| `LeftFlatPadRightCurvedPad` |
| `LeftGripInnerRightGripOuter` |
| `LeftGripOuterRightGripInner` |
| `LeftTensionLinkRightTensionLink` |

### `Vald.Api.ExternalDynamo.V1.Models.BodyRegion`

Type `string`.

| Value |
|---|
| `Neck` |
| `Shoulder` |
| `Trunk` |
| `Hip` |
| `Elbow` |
| `Wrist` |
| `Hand` |
| `Knee` |
| `Ankle` |
| `Foot` |
| `Scapula` |

### `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `profileId` | `string` | `uuid` |  |
| `tenantId` | `string` | `uuid` |  |
| `startTimeUTC` | `string` | `date-time` |  |
| `forceTrace` | array of `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse_ForceDTO` |  | yes |
| `imuTrace` | array of `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse_ImuDTO` |  | yes |

### `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse_ForceDTO`

| Field | Type | Format |
| --- | --- | --- |
| `timeSeconds` | `number` | `double` |
| `forceNewtons` | `number` | `double` |

### `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse_ImuDTO`

| Field | Type | Format |
| --- | --- | --- |
| `timeSeconds` | `number` | `double` |
| `orientation` | `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse_ImuDTO_QuaternionDTO` |  |

### `Vald.Api.ExternalDynamo.V1.Models.GetTestTraceResponse_ImuDTO_QuaternionDTO`

| Field | Type | Format |
| --- | --- | --- |
| `x` | `number` | `float` |
| `y` | `number` | `float` |
| `z` | `number` | `float` |
| `w` | `number` | `float` |

### `Vald.Api.ExternalDynamo.V1.Models.Laterality`

Type `string`.

| Value |
|---|
| `None` |
| `LeftSide` |
| `RightSide` |
| `LeftThenRight` |
| `RightThenLeft` |

### `Vald.Api.ExternalDynamo.V1.Models.Movement`

Type `string`.

| Value |
|---|
| `Abduction` |
| `Adduction` |
| `AdductionSqueeze` |
| `Flexion` |
| `Extension` |
| `ExternalRotation` |
| `InternalRotation` |
| `Rotation` |
| `Dorsiflexion` |
| `PlantarFlexion` |
| `Eversion` |
| `Inversion` |
| `GripSqueeze` |
| `LateralFlexionLeft` |
| `LateralFlexionRight` |
| `Protraction` |
| `Retraction` |
| `Scaption` |
| `RadialDeviation` |
| `UlnaDeviation` |
| `Supination` |
| `Pronation` |
| `Elevation` |
| `RotationLeft` |
| `RotationRight` |
| `ToeFlexion` |
| `ToeExtension` |
| `Custom` |
| `InternalRotationExternalRotation` |
| `FlexionExtension` |
| `AdductionAbduction` |
| `DorsiflexionPlantarFlexion` |
| `InversionEversion` |
| `LateralFlexionLeftLateralFlexionRight` |
| `RotationLeftRotationRight` |
| `SupinationPronation` |
| `HorizontalAbduction` |
| `HorizontalAdduction` |
| `HorizontalAbductionAdduction` |
| `IsometricMidThighPull` |
| `ISOITest` |
| `ISOYTest` |
| `ISOTTest` |
| `RadialDeviationUlnaDeviation` |
| `PinchGrip` |
| `FirstFingerPinch` |
| `SecondFingerPinch` |
| `ThirdFingerPinch` |
| `FourthFingerPinch` |
| `ThreePointPinch` |
| `FlexionKicker` |
| `ThumbPush` |
| `Pull` |
| `Push` |
| `Row` |
| `PullDown` |
| `LateralFlexion` |
| `IsometricBeltSquat` |

### `Vald.Api.ExternalDynamo.V1.Models.PagedDTO`1[[Vald.Api.ExternalDynamo.V1.Models.TestDTO, Vald.Api.ExternalDynamo.V1, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `items` | array of `Vald.Api.ExternalDynamo.V1.Models.TestDTO` |  | yes |
| `currentPage` | `integer` | `int32` |  |
| `totalItems` | `integer` | `int32` |  |
| `totalPages` | `integer` | `int32` |  |

### `Vald.Api.ExternalDynamo.V1.Models.Position`

Type `string`.

| Value |
|---|
| `Neutral` |
| `p30DegreesAbduction` |
| `p45DegreesAbduction` |
| `p90DegreesAbduction` |
| `p90DegreesFlexion` |
| `Seated` |
| `LongSittingPlantarFlexed` |
| `LongSittingPlantigrade` |
| `Standing` |
| `LongSitting` |
| `SideLying` |
| `Prone` |
| `Supine` |
| `Supine90DegreesHipFlexion` |
| `Standing30DegreesAbduction` |
| `p90DegreesShoulderAbduction` |
| `HorizontalFlexion` |
| `p90DegreesElbowFlexion` |
| `ElbowExtended` |
| `MidProne` |
| `Pronated` |
| `Supinated` |
| `Custom` |
| `Supine90DegreesShoulderAbduction` |
| `p90DegreesShoulderFlexion` |
| `Knee0Degrees` |
| `Knee45Degrees` |
| `Knee90Degrees` |
| `Knee30Degrees` |
| `p45Degrees` |
| `p90Degrees` |
| `SeatedElbow90Degrees` |
| `SeatedElbow90Degrees90DegreeShoulderAbduction` |
| `StandingElbow90Degrees` |
| `StandingElbow90Degrees90DegreeShoulderAbduction` |
| `SupineElbow90Degrees90DegreeShoulderAbduction` |
| `SupineElbow90Degrees` |
| `SupineElbow90Degrees120ShoulderAbduction` |
| `SeatedShortLever` |
| `SeatedLongLever` |
| `StandingLongLever` |
| `StandingShortLever` |
| `ProneLongLever` |
| `Seated90DegreeShoulderFlexion` |
| `Standing90DegreeShoulderFlexion` |
| `SupineLongLever` |
| `SupineShortLever` |
| `SideLyingLongLever` |
| `SideLyingShortLever` |
| `Seated90DegreesShoulderAbductionLongLever` |
| `Seated90DegreesShoulderAbductionShortLever` |
| `Prone90DegreeKneeFlexion` |
| `ProneShortLever` |
| `SemiProne` |
| `SupineKnees45Degrees` |
| `SupineKnees90Degrees` |
| `IsometricMidThighPull` |
| `p90DegreeElbowFlexionWristNeutral` |
| `p90DegreeElbowFlexionWristSupinated` |
| `p90DegreeElbowFlexionWristPronated` |
| `p90DegreeElbowFlexion90AbductionWristNeutral` |
| `p90DegreeElbowFlexion90AbductionWristSupinated` |
| `p90DegreeElbowFlexion90AbductionWristPronated` |
| `p90DegreesElbowFlexionWristNeutral` |
| `p90DegreesElbowFlexionWristSupinated` |
| `p90DegreesElbowFlexionWristPronated` |
| `HalfKneeling` |
| `Overhead` |
| `Prone30DegreeKneeFlexion` |
| `Prone45DegreeKneeFlexion` |
| `Prone60DegreeKneeFlexion` |
| `Seated30DegreeKneeFlexion` |
| `Seated45DegreeKneeFlexion` |
| `Seated60DegreeKneeFlexion` |
| `Supine30DegreeKneeFlexion` |
| `Supine45DegreeKneeFlexion` |
| `Supine60DegreeKneeFlexion` |
| `StandingChesttoWall` |
| `StandingBacktoWall` |
| `Seated45DegreesShoulderAbductionShortLever` |
| `Seated45DegreesShoulderAbductionLongLever` |
| `ProneElbow90Degrees90DegreeShoulderAbduction` |
| `IsometricBeltSquat` |
| `BieringSorensenPosition` |
| `MidThigh` |

### `Vald.Api.ExternalDynamo.V1.Models.RatioDTO`

| Field | Type | Format |
| --- | --- | --- |
| `laterality` | `Vald.Api.ExternalDynamo.V1.Models.Laterality` |  |
| `numeratorMovement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |
| `denominatorMovement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |
| `value` | `number` | `double` |

### `Vald.Api.ExternalDynamo.V1.Models.RepetitionDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `movement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |  |
| `laterality` | `Vald.Api.ExternalDynamo.V1.Models.Laterality` |  |  |
| `repNo` | `integer` | `int32` |  |
| `startOffsetSeconds` | `number` | `double` |  |
| `durationSeconds` | `number` | `double` |  |
| `maxForceNewtons` | `number` | `double` |  |
| `impulseNewtonSeconds` | `number` | `double` |  |
| `rateOfForceDevelopmentNewtonsPerSecond` | `number` | `double` |  |
| `timeToPeakForceSeconds` | `number` | `double` |  |
| `rangeOfMotionDegrees` | `number` | `double` |  |
| `baselineForceNewtons` | `number` | `double` | yes |
| `netPeakForceNewtons` | `number` | `double` | yes |
| `netForceAt100msNewtons` | `number` | `double` | yes |
| `netForceAt150msNewtons` | `number` | `double` | yes |
| `netForceAt200msNewtons` | `number` | `double` | yes |
| `netImpulseAt100msNewtonSeconds` | `number` | `double` | yes |
| `netImpulseAt150msNewtonSeconds` | `number` | `double` | yes |
| `netImpulseAt200msNewtonSeconds` | `number` | `double` | yes |
| `timeTo80PercentPeakForceSeconds` | `number` | `double` | yes |
| `rateOfForceDevelopment150msNewtonsPerSecond` | `number` | `double` | yes |
| `rateOfForceDevelopment200msNewtonsPerSecond` | `number` | `double` | yes |
| `rateOfForceDevelopment250msNewtonsPerSecond` | `number` | `double` | yes |

### `Vald.Api.ExternalDynamo.V1.Models.RepetitionTypeSummaryDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `testId` | `string` | `uuid` |  |
| `movement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |  |
| `laterality` | `Vald.Api.ExternalDynamo.V1.Models.Laterality` |  |  |
| `repCount` | `integer` | `int32` |  |
| `maxForceNewtons` | `number` | `double` |  |
| `avgForceNewtons` | `number` | `double` |  |
| `maxImpulseNewtonSeconds` | `number` | `double` |  |
| `avgImpulseNewtonSeconds` | `number` | `double` |  |
| `maxRateOfForceDevelopmentNewtonsPerSecond` | `number` | `double` |  |
| `avgRateOfForceDevelopmentNewtonsPerSecond` | `number` | `double` |  |
| `maxRangeOfMotionDegrees` | `number` | `double` |  |
| `avgRangeOfMotionDegrees` | `number` | `double` |  |
| `avgTimeToPeakForceSeconds` | `number` | `double` |  |
| `minTimeToPeakForceSeconds` | `number` | `double` |  |
| `avgBaselineForceNewtons` | `number` | `double` | yes |
| `avgNetPeakForceNewtons` | `number` | `double` | yes |
| `avgNetForceAt100msNewtons` | `number` | `double` | yes |
| `avgNetForceAt150msNewtons` | `number` | `double` | yes |
| `avgNetForceAt200msNewtons` | `number` | `double` | yes |
| `avgNetImpulseAt100msNewtonSeconds` | `number` | `double` | yes |
| `avgNetImpulseAt150msNewtonSeconds` | `number` | `double` | yes |
| `avgNetImpulseAt200msNewtonSeconds` | `number` | `double` | yes |
| `avgTimeTo80PercentPeakForceSeconds` | `number` | `double` | yes |
| `avgRateOfForceDevelopment150msNewtonsPerSecond` | `number` | `double` | yes |
| `avgRateOfForceDevelopment200msNewtonsPerSecond` | `number` | `double` | yes |
| `avgRateOfForceDevelopment250msNewtonsPerSecond` | `number` | `double` | yes |
| `maxBaselineForceNewtons` | `number` | `double` | yes |
| `maxNetPeakForceNewtons` | `number` | `double` | yes |
| `maxNetForceAt100msNewtons` | `number` | `double` | yes |
| `maxNetForceAt150msNewtons` | `number` | `double` | yes |
| `maxNetForceAt200msNewtons` | `number` | `double` | yes |
| `maxNetImpulseAt100msNewtonSeconds` | `number` | `double` | yes |
| `maxNetImpulseAt150msNewtonSeconds` | `number` | `double` | yes |
| `maxNetImpulseAt200msNewtonSeconds` | `number` | `double` | yes |
| `maxRateOfForceDevelopment150msNewtonsPerSecond` | `number` | `double` | yes |
| `maxRateOfForceDevelopment200msNewtonsPerSecond` | `number` | `double` | yes |
| `maxRateOfForceDevelopment250msNewtonsPerSecond` | `number` | `double` | yes |
| `minTimeTo80PercentPeakForceSeconds` | `number` | `double` | yes |

### `Vald.Api.ExternalDynamo.V1.Models.TestCategory`

Type `string`.

| Value |
|---|
| `Strength` |
| `RangeofMotion` |

### `Vald.Api.ExternalDynamo.V1.Models.TestCursorHttpResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `tests` | array of `Vald.Api.ExternalDynamo.V1.Models.TestDtoWithModifiedDate` | yes |

### `Vald.Api.ExternalDynamo.V1.Models.TestDTO`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `teamId` | `string` | `uuid` |  |
| `testCategory` | `Vald.Api.ExternalDynamo.V1.Models.TestCategory` |  |  |
| `bodyRegion` | `Vald.Api.ExternalDynamo.V1.Models.BodyRegion` |  |  |
| `movement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |  |
| `position` | `Vald.Api.ExternalDynamo.V1.Models.Position` |  |  |
| `customPosition` | `string` |  | yes |
| `laterality` | `Vald.Api.ExternalDynamo.V1.Models.Laterality` |  |  |
| `attachments` | `Vald.Api.ExternalDynamo.V1.Models.Attachments` |  |  |
| `leftAttachment` | `Vald.Api.ExternalDynamo.V1.Models.AttachmentType` |  |  |
| `rightAttachment` | `Vald.Api.ExternalDynamo.V1.Models.AttachmentType` |  |  |
| `startTimeUTC` | `string` | `date-time` |  |
| `durationSeconds` | `number` | `double` |  |
| `hardwareInfo` | `string` |  | yes |
| `softwareInfo` | `string` |  | yes |
| `analysisInfo` | `string` |  | yes |
| `analysedDateUTC` | `string` | `date-time` |  |
| `repetitionTypeSummaries` | array of `Vald.Api.ExternalDynamo.V1.Models.RepetitionTypeSummaryDTO` |  | yes |
| `repetitions` | array of `Vald.Api.ExternalDynamo.V1.Models.RepetitionDTO` |  | yes |
| `asymmetries` | array of `Vald.Api.ExternalDynamo.V1.Models.AsymmetryDTO` |  | yes |
| `ratios` | array of `Vald.Api.ExternalDynamo.V1.Models.RatioDTO` |  | yes |

### `Vald.Api.ExternalDynamo.V1.Models.TestDtoWithModifiedDate`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `athleteId` | `string` | `uuid` |  |
| `teamId` | `string` | `uuid` |  |
| `testCategory` | `Vald.Api.ExternalDynamo.V1.Models.TestCategory` |  |  |
| `bodyRegion` | `Vald.Api.ExternalDynamo.V1.Models.BodyRegion` |  |  |
| `movement` | `Vald.Api.ExternalDynamo.V1.Models.Movement` |  |  |
| `position` | `Vald.Api.ExternalDynamo.V1.Models.Position` |  |  |
| `customPosition` | `string` |  | yes |
| `laterality` | `Vald.Api.ExternalDynamo.V1.Models.Laterality` |  |  |
| `attachments` | `Vald.Api.ExternalDynamo.V1.Models.Attachments` |  |  |
| `leftAttachment` | `Vald.Api.ExternalDynamo.V1.Models.AttachmentType` |  |  |
| `rightAttachment` | `Vald.Api.ExternalDynamo.V1.Models.AttachmentType` |  |  |
| `startTimeUTC` | `string` | `date-time` |  |
| `durationSeconds` | `number` | `double` |  |
| `hardwareInfo` | `string` |  | yes |
| `softwareInfo` | `string` |  | yes |
| `analysisInfo` | `string` |  | yes |
| `analysedDateUTC` | `string` | `date-time` |  |
| `repetitionTypeSummaries` | array of `Vald.Api.ExternalDynamo.V1.Models.RepetitionTypeSummaryDTO` |  | yes |
| `repetitions` | array of `Vald.Api.ExternalDynamo.V1.Models.RepetitionDTO` |  | yes |
| `asymmetries` | array of `Vald.Api.ExternalDynamo.V1.Models.AsymmetryDTO` |  | yes |
| `ratios` | array of `Vald.Api.ExternalDynamo.V1.Models.RatioDTO` |  | yes |
| `modifiedDateUtc` | `string` | `date-time` |  |
