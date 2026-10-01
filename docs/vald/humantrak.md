---
source_type: curated
source_url: https://prd-euw-api-externalhumantrakv2.valdperformance.com/swagger/v2/swagger.json
upstream_version: Vald.Api.ExternalHumanTrak.V2 v2 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD HumanTrak API

## VALD HumanTrak API host and specification

- Host: `https://prd-<region>-api-externalhumantrakv2.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-externalhumantrakv2.valdperformance.com/swagger/v2/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalHumanTrak.V2", `info.version` "v2").
- Local snapshot: `specs/vald/externalhumantrakv2.json` (the `euw` copy).
- Security: `Auth0`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`, `audience` "vald-api-external". The spec applies it to every operation.
- The spec declares no `servers`. Its 80 schema fields have no descriptions.

## VALD HumanTrak endpoints

<!-- generated:vald-humantrak-endpoints start -->
| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/v2/test/{testId}/repetitions` |  |  |
| `GET` | `/v2/tests-by-modified-date` |  |  |
| `GET` | `/v2/test-type/metrics` |  |  |
<!-- generated:vald-humantrak-endpoints end -->

## VALD HumanTrak service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

<!-- generated:vald-humantrak-health start -->
| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string, required) | `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalHumanTrak.V2.Models.GetDiagnosticsResponse` |
<!-- generated:vald-humantrak-health end -->

## VALD HumanTrak: `GET /v2/test/{testId}/repetitions`

Parameters:

- `testId` (path, string, format uuid, required)
- `TenantId` (query, string, format uuid)
- `ProfileId` (query, string, format uuid)

Responses:

- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content
- `200` OK: `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD HumanTrak: `GET /v2/tests-by-modified-date`

Parameters:

- `TenantId` (query, string, format uuid)
- `ModifiedFromUtc` (query, string, format date-time)

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `204` No Content
- `200` OK: `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse`

## VALD HumanTrak: `GET /v2/test-type/metrics`

Responses:

- `204` No Content
- `200` OK: `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse`

## VALD HumanTrak schemas

The 23 component schemas of the HumanTrak spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

<!-- generated:vald-humantrak-schemas start -->
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

### `Vald.Api.ExternalHumanTrak.V2.DiagnosticsResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalHumanTrak.V2.Models.GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalHumanTrak.V2.DiagnosticsResult` | yes |

### `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `testTypeCode` | `string` | yes |
| `repetitions` | array of `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse_Repetition` | yes |

### `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse_Repetition`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `number` | `integer` | `int32` |  |
| `side` | `string` |  | yes |
| `metrics` | array of `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse_Repetition_Metric` |  | yes |

### `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse_Repetition_Metric`

| Field | Type | Nullable |
| --- | --- | --- |
| `metricGroupCode` | `string` | yes |
| `values` | `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse_Repetition_Metric_Result` |  |

### `Vald.Api.ExternalHumanTrak.V2.Models.GetTestRepetitionsResponse_Repetition_Metric_Result`

| Field | Type |
| --- | --- |
| `isSided` | `boolean` |

### `Vald.Api.ExternalHumanTrak.V2.MovementSide`

Type `string`.

| Value |
|---|
| `Left` |
| `Right` |
| `Both` |
| `None` |
| `NotApplicable` |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse`

| Field | Type |
| --- | --- |
| `data` | `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData` |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData`

| Field | Type | Nullable |
| --- | --- | --- |
| `testResults` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult` | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `testId` | `string` | `uuid` |  |
| `startDateUtc` | `string` | `date-time` |  |
| `endDateUtc` | `string` | `date-time` |  |
| `profileId` | `string` | `uuid` |  |
| `tenantId` | `string` | `uuid` |  |
| `modifiedDateUtc` | `string` | `date-time` |  |
| `testTypeCode` | `string` |  | yes |
| `repetitionCounts` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_RepetitionCount` |  | yes |
| `metricGroups` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_MetricGroup` |  | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_Aggregates`

| Field | Type | Format | Required |
| --- | --- | --- | --- |
| `max` | `number` | `double` | yes |
| `min` | `number` | `double` | yes |
| `avg` | `number` | `double` | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_AsymmetryMeasurement`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `unit` | `string` | yes | yes |
| `aggregates` | `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_Aggregates` |  | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_MetricGroup`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `code` | `string` | yes | yes |
| `longName` | `string` | yes | yes |
| `shortName` | `string` | yes | yes |
| `classification` | `string` | yes | yes |
| `trendSentiment` | `string` | yes | yes |
| `summaryMeasurements` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_SummaryMeasurement` | yes |  |
| `asymmetryMeasurement` | `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_AsymmetryMeasurement` |  |  |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_RepetitionCount`

| Field | Type | Format |
| --- | --- | --- |
| `movementSide` | `Vald.Api.ExternalHumanTrak.V2.MovementSide` |  |
| `count` | `integer` | `int32` |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_SummaryMeasurement`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `side` | `string` | yes | yes |
| `unit` | `string` | yes | yes |
| `aggregates` | `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetNestedTestResultsByModifiedDateResponse_TestResultsData_TestResult_Aggregates` |  | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `testTypes` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType` | yes | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `code` | `string` | yes | yes |
| `name` | `string` | yes | yes |
| `laterality` | `string` | yes | yes |
| `metricGroups` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup` | yes | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `code` | `string` | yes | yes |
| `longName` | `string` | yes | yes |
| `shortName` | `string` | yes | yes |
| `classification` | `string` | yes | yes |
| `trendSentiment` | `string` | yes | yes |
| `repetitionMetricTypes` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup_RepetitionMetricType` | yes | yes |
| `summaryMetricTypes` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup_SummaryMetricType` | yes | yes |
| `asymmetryMetricTypes` | array of `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup_AsymmetryMetricType` | yes | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup_AsymmetryMetricType`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `code` | `string` | yes | yes |
| `name` | `string` | yes | yes |
| `leftSummaryMetricTypeCode` | `string` | yes | yes |
| `rightSummaryMetricTypeCode` | `string` | yes | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup_RepetitionMetricType`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `code` | `string` | yes | yes |
| `name` | `string` | yes | yes |
| `movementSide` | `string` | yes | yes |
| `metricSide` | `string` | yes | yes |
| `unit` | `string` | yes | yes |

### `Vald.Api.ExternalHumanTrak.V2.Proxies.Vald_.HumanTrakV2.GetTestTypeMetricsResponse_TestType_MetricGroup_SummaryMetricType`

| Field | Type | Nullable | Required |
| --- | --- | --- | --- |
| `code` | `string` | yes | yes |
| `name` | `string` | yes | yes |
| `movementSide` | `string` | yes | yes |
| `metricSide` | `string` | yes | yes |
| `unit` | `string` | yes | yes |
| `calculationType` | `string` | yes | yes |
<!-- generated:vald-humantrak-schemas end -->
