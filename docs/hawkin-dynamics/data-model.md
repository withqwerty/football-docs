---
source_type: curated
source_url: https://connect.hawkindynamics.com/api
upstream_version: Hawkin Force Platform API 1.16 (OpenAPI 3.0.3)
crawled_at: 2026-09-30
---

# Hawkin Dynamics Data Model

## About the schemas

The component schemas of the Hawkin Force Platform API spec, copied field by field.
Descriptions are the spec's own; an empty cell means the spec gives none. Fields
marked **Personal data** hold data about an identifiable athlete. On `Athlete`,
`AthleteRef`, `AthleteInput` and `AthleteUpdateInput`, `name` is the athlete's name.

## `AccessTokenResponse`

<!-- generated:hawkin-schema-accesstokenresponse start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `access_token` | `string` |  |  |  | JWT access token to use in subsequent API requests |
| `token_type` | `string` |  |  |  |  |
| `expires_at` | `integer` |  |  |  | Unix timestamp when the token expires |
<!-- generated:hawkin-schema-accesstokenresponse end -->

## `TestType`

<!-- generated:hawkin-schema-testtype start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `canonicalId` | `string` |  |  |  |  |
| `tags` | array of `Tag` |  |  |  |  |
<!-- generated:hawkin-schema-testtype end -->

## `Tag`

<!-- generated:hawkin-schema-tag start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `description` | `string` |  |  |  |  |
<!-- generated:hawkin-schema-tag end -->

## `AthleteRef`

<!-- generated:hawkin-schema-athleteref start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `name` | `string` |  |  |  | **Personal data.** |
<!-- generated:hawkin-schema-athleteref end -->

## `Test`

<!-- generated:hawkin-schema-test start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `testType` | `TestType` |  |  |  |  |
| `athlete` | `AthleteRef` |  |  |  |  |
| `timestamp` | `integer` |  |  |  | Unix timestamp of the test |
| `segment` | `string` |  |  |  | Test type and trial number within session |
| `eid` | `string` |  |  |  | Equipment ID of the hardware that produced the test. Only present when the request was made with includeEid=true. |
| `active` | `boolean` |  |  |  | Whether the test is active (not archived). Included by default because the public endpoint uses includeInactive=true; set includeInactive=false to return only active tests. |
<!-- generated:hawkin-schema-test end -->

Besides the fields above, a `Test` has `additionalProperties` of type `number`, nullable, described as: "Metric values keyed by metric name (e.g. 'Jump Height(m)'). Non-calculable metrics are returned as null by default (useNulls=true); with useNulls=false they are the string 'N/A'. Values are unrounded unless rounding=true. Omitted entirely when nestMetrics=true (see TestNested)."

The reference page's Metrics section says something different: "The id shown for each metric is the property name you'll see in API responses". The metric `id` values are camelCase (for example `jumpHeight`), while the spec's example key is `Jump Height(m)`, which is the metric's `label` followed by its `units` in brackets. The two statements disagree; check a live response before relying on either.

## `TestsResponse`

<!-- generated:hawkin-schema-testsresponse start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `data` | array of `Test` |  |  |  | Test records. Each item is a Test, or a TestNested when the request was made with nestMetrics=true. |
| `count` | `integer` |  |  |  |  |
| `lastTestTime` | `integer` |  |  |  | Unix timestamp of the most recent test |
| `lastSyncTime` | `integer` |  |  |  | Unix timestamp to use as syncFrom in your next request |
| `hasMore` | `boolean` |  |  |  | True if more pages exist. Only present when paginate=true. |
| `nextCursor` | `string` |  | yes |  | Cursor for next page. Null on last page. Only present when paginate=true. |
<!-- generated:hawkin-schema-testsresponse end -->

## `TestNested`

Shape of each test when the request was made with nestMetrics=true. Metadata fields match Test; metrics move into a `metrics` array and are never rounded.

<!-- generated:hawkin-schema-testnested start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `testType` | `TestType` |  |  |  |  |
| `athlete` | `AthleteRef` |  |  |  |  |
| `timestamp` | `integer` |  |  |  | Unix timestamp of the test |
| `segment` | `string` |  |  |  | Test type and trial number within session |
| `active` | `boolean` |  |  |  | Whether the test is active (not archived). Present when includeInactive=true (the default). |
| `metrics` | array of `NestedMetric` |  |  |  |  |
<!-- generated:hawkin-schema-testnested end -->

## `NestedMetric`

One metric on a test when the request was made with nestMetrics=true. Only metrics with a numeric value are included (from the `nestMetrics` parameter's description).

<!-- generated:hawkin-schema-nestedmetric start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `metricId` | `string` |  |  |  | Stable metric ID |
| `metricLabel` | `string` |  |  |  | Metric label |
| `metricUnits` | `string` |  |  |  | Units, may be empty |
| `metricValue` | `number` |  |  |  | Unrounded metric value |
<!-- generated:hawkin-schema-nestedmetric end -->

In this shape each metric carries its `metricId` (for example `jumpHeight`), its `metricLabel` and its `metricUnits` as separate fields, rather than a single `Jump Height(m)` style key.

## `Athlete`

<!-- generated:hawkin-schema-athlete start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  | yes |  |
| `name` | `string` |  |  | yes | **Personal data.** |
| `active` | `boolean` |  |  | yes |  |
| `teams` | array of `string` |  |  | yes | Array of team IDs |
| `groups` | array of `string` |  |  | yes | Array of group IDs |
| `image` | `string` | `uri` | yes |  | **Personal data.** URL to the athlete's photo. Three-state: omitted when never set, null when explicitly cleared, string when set. |
| `position` | `string` |  |  |  | **Personal data.** Free-text playing position (e.g. "Forward"). Omitted when blank. |
| `dob` | `string` | `date` |  |  | **Personal data.** Date of birth as ISO-8601 (YYYY-MM-DD). Omitted when blank. |
| `sport` | `string` |  |  |  | **Personal data.** Free-text sport name (e.g. "Basketball"). Omitted when blank. |
| `height` | `number` |  |  |  | **Personal data.** Athlete height in centimeters. Guaranteed numeric and in-range when present. Omitted entirely when no valid height is on file. minimum: `1` maximum: `300` |
| `lastTestedOn` | `integer` | `int64` |  |  | Unix epoch seconds of the athlete's most recent test session. Omitted when the athlete has no tests on file. |
| `external` | `object` |  |  |  | Custom external properties as key-value pairs |
<!-- generated:hawkin-schema-athlete end -->

## `AthleteInput`

<!-- generated:hawkin-schema-athleteinput start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  |  | yes | **Personal data.** |
| `image` | `string` |  | yes |  | **Personal data.** URL to athlete image default: `null` |
| `active` | `boolean` |  |  |  | default: `true` |
| `teams` | array of `string` |  |  |  | Team IDs. Defaults to [defaultTeamId] |
| `groups` | array of `string` |  |  |  | Group IDs default: `[]` |
| `external` | `object` |  |  |  | Custom properties |
<!-- generated:hawkin-schema-athleteinput end -->

## `AthleteUpdateInput`

<!-- generated:hawkin-schema-athleteupdateinput start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  | yes | Required. The athlete's ID |
| `name` | `string` |  |  |  | **Personal data.** |
| `image` | `string` |  | yes |  | **Personal data.** |
| `active` | `boolean` |  |  |  |  |
| `teams` | array of `string` |  |  |  |  |
| `groups` | array of `string` |  |  |  |  |
| `external` | `object` |  |  |  | Custom properties. Note: custom properties NOT present in the request will be REMOVED. |
<!-- generated:hawkin-schema-athleteupdateinput end -->

## `BulkResult`

<!-- generated:hawkin-schema-bulkresult start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `data` | array of `Athlete` |  |  |  |  |
| `hasFailures` | `boolean` |  |  |  |  |
| `failures` | array of `object` |  |  |  |  |

Each `failures` item is an object with these fields:

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `reason` | `string` |  |  |  |  |
| `data` | `object` |  |  |  |  |
<!-- generated:hawkin-schema-bulkresult end -->

## `ForceTimeData`

<!-- generated:hawkin-schema-forcetimedata start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `testType` | `TestType` |  |  |  |  |
| `athlete` | `AthleteRef` |  |  |  |  |
| `timestamp` | `integer` |  |  |  | Unix timestamp (seconds) of the test |
| `eid` | `string` |  | yes |  | Equipment ID of the hardware that produced the test. Null when unavailable. |
| `Time(s)` | array of `number` |  |  |  |  |
| `LeftForce(N)` | array of `number` |  |  |  |  |
| `RightForce(N)` | array of `number` |  |  |  |  |
| `CombinedForce(N)` | array of `number` |  |  |  |  |
| `XLeftForce(N)` | array of `number` |  |  |  | Medio-lateral (X-axis) shear force under the left platform. |
| `XRightForce(N)` | array of `number` |  |  |  | Medio-lateral (X-axis) shear force under the right platform. |
| `YLeftForce(N)` | array of `number` |  |  |  | Anterior-posterior (Y-axis) shear force under the left platform. |
| `YRightForce(N)` | array of `number` |  |  |  | Anterior-posterior (Y-axis) shear force under the right platform. |
| `XLeftMoments` | array of `number` |  |  |  | Moment about the X-axis under the left platform. |
| `XRightMoments` | array of `number` |  |  |  | Moment about the X-axis under the right platform. |
| `YLeftMoments` | array of `number` |  |  |  | Moment about the Y-axis under the left platform. |
| `YRightMoments` | array of `number` |  |  |  | Moment about the Y-axis under the right platform. |
| `Velocity(m/s)` | array of `number` |  |  |  |  |
| `Displacement(m)` | array of `number` |  |  |  |  |
| `Power(W)` | array of `number` |  |  |  |  |
| `rsi` | array of `number` |  |  |  | Reactive Strength Index values (one per contact/flight cycle). |
<!-- generated:hawkin-schema-forcetimedata end -->

## `COPData`

Center-of-pressure time series for a Free Run test. `Time(s)` is derived from the platform sampling rate (hertz). copX/copY are the combined center of pressure; leftCop*/rightCop* are per-platform.

<!-- generated:hawkin-schema-copdata start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `testType` | `TestType` |  |  |  |  |
| `athlete` | `AthleteRef` |  |  |  |  |
| `timestamp` | `integer` |  |  |  | Unix timestamp (seconds) of the test |
| `eid` | `string` |  | yes |  | Equipment ID of the hardware that produced the test. Null when unavailable. |
| `Time(s)` | array of `number` |  |  |  | Sample timestamps in seconds, derived from the sampling rate (hertz). |
| `copX` | array of `number` |  |  |  | Combined center-of-pressure X position. |
| `copY` | array of `number` |  |  |  | Combined center-of-pressure Y position. |
| `leftCopX` | array of `number` |  |  |  | Left-platform center-of-pressure X position. |
| `leftCopY` | array of `number` |  |  |  | Left-platform center-of-pressure Y position. |
| `rightCopX` | array of `number` |  |  |  | Right-platform center-of-pressure X position. |
| `rightCopY` | array of `number` |  |  |  | Right-platform center-of-pressure Y position. |
<!-- generated:hawkin-schema-copdata end -->

## `Team`

<!-- generated:hawkin-schema-team start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
<!-- generated:hawkin-schema-team end -->

## `Group`

<!-- generated:hawkin-schema-group start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
<!-- generated:hawkin-schema-group end -->

## `TestTypeSummary`

<!-- generated:hawkin-schema-testtypesummary start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
<!-- generated:hawkin-schema-testtypesummary end -->

## `Metric`

<!-- generated:hawkin-schema-metric start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  |  |
| `label` | `string` |  |  |  |  |
| `units` | `string` |  | yes |  |  |
| `description` | `string` |  |  |  |  |
<!-- generated:hawkin-schema-metric end -->

## `MetricsResponse`

`MetricsResponse` is an array. Each item has `canonicalTestTypeId` (`string`), `testTypeName` (`string`, "Human-readable name of the test type (e.g. 'Countermovement Jump').") and `metrics` (array of `Metric`). The public file `https://connect.hawkindynamics.com/assets/metrics.json` has the same shape; its contents are in Hawkin Dynamics test metrics.

## `ErrorResponse`

<!-- generated:hawkin-schema-errorresponse start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `error` | `string` |  |  |  |  |
<!-- generated:hawkin-schema-errorresponse end -->
