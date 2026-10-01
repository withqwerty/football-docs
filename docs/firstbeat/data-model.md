---
source_type: curated
source_url: https://apidocs.firstbeat.com/assets/api-specification/openapi.json
upstream_version: Firstbeat Cloud API 1.1.0 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# Firstbeat Data Model

## Resource structure

From the spec's paths and the "Basic Concepts" page
(https://apidocs.firstbeat.com/basic-concepts/):

```
API consumer
└── accounts (accountId)
    ├── athletes (athleteId)
    │   └── measurements (measurementId)
    │       ├── results           -> variables
    │       └── laps (lapId)
    │           └── results       -> variables
    ├── coaches (coachId)
    └── teams (teamId), each with groups (groupId)
        ├── athletes
        └── sessions (sessionId)
            ├── results           -> one entry per athlete measurement, with variables
            └── laps (lapId)
                └── results       -> one entry per athlete measurement, with variables
```

A measurement belongs to one athlete. A session belongs to one team and is created
by a coach. The Basic Concepts page says: "Both measurements and sessions can have
laps", "One measurement can belong to zero or several sessions", and "If value for
some field is not set, the field is not returned."

List responses (`Athletes`, `Coaches`, `Teams`, `Sessions`, `Measurements`) carry a
boolean `more`. The "Querying the API" page says a list returns at most 1000 items,
and the next page is requested with `offset` set to the number of items already
received.

The spec's schema fields have no descriptions. The tables copy each field's type,
format and enum values from the spec. The spec's example values are left out.
Fields marked **Personal data** identify a person.

## `Register`

<!-- generated:firstbeat-schema-register start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `consumerName` | `string` |  |  | yes | minLength: `2` maxLength: `100` |
<!-- generated:firstbeat-schema-register end -->

## `RegisterResponse`

<!-- generated:firstbeat-schema-registerresponse start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  | minLength: `36` maxLength: `36` |
| `consumerName` | `string` |  |  |  | minLength: `2` maxLength: `100` |
| `sharedSecret` | `string` |  |  |  | minLength: `36` maxLength: `36` |
<!-- generated:firstbeat-schema-registerresponse end -->

## `ApiKey`

<!-- generated:firstbeat-schema-apikey start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `apiKey` | `string` |  |  |  | minLength: `20` maxLength: `128` |
<!-- generated:firstbeat-schema-apikey end -->

The spec names this field `apiKey`. The "Getting Started" page (https://apidocs.firstbeat.com/getting-started/) shows the response as `{"apikey": "..."}` and reads `response.json()["apikey"]`, with a lower-case `k`. The two sources disagree.

## `SharedSecret`

<!-- generated:firstbeat-schema-sharedsecret start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sharedSecret` | `string` |  |  |  | minLength: `36` maxLength: `36` |
<!-- generated:firstbeat-schema-sharedsecret end -->

## `Accounts`

<!-- generated:firstbeat-schema-accounts start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `accounts` | array of `Account` |  |  |  |  |
<!-- generated:firstbeat-schema-accounts end -->

## `Account`

`authorizedBy` is an object with one field, `coachId` (`integer`).

<!-- generated:firstbeat-schema-account start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `accountId` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `authorizedBy` | `object` |  |  |  |  |
<!-- generated:firstbeat-schema-account end -->

## `Athletes`

<!-- generated:firstbeat-schema-athletes start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `athletes` | array of `Athlete` |  |  |  |  |
<!-- generated:firstbeat-schema-athletes end -->

## `Athlete`

<!-- generated:firstbeat-schema-athlete start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `athleteId` | `integer` |  |  |  |  |
| `firstName` | `string` |  |  |  | **Personal data.** |
| `lastName` | `string` |  |  |  | **Personal data.** |
| `email` | `string` |  |  |  | **Personal data.** |
<!-- generated:firstbeat-schema-athlete end -->

## `Coaches`

<!-- generated:firstbeat-schema-coaches start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `coaches` | array of `Coach` |  |  |  |  |
<!-- generated:firstbeat-schema-coaches end -->

## `Coach`

<!-- generated:firstbeat-schema-coach start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `coachId` | `integer` |  |  |  |  |
| `firstName` | `string` |  |  |  | **Personal data.** |
| `lastName` | `string` |  |  |  | **Personal data.** |
| `email` | `string` |  |  |  | **Personal data.** |
<!-- generated:firstbeat-schema-coach end -->

## `Teams`

<!-- generated:firstbeat-schema-teams start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `teams` | array of `Team` |  |  |  |  |
<!-- generated:firstbeat-schema-teams end -->

## `Team`

<!-- generated:firstbeat-schema-team start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `teamId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |
| `groups` | array of `Group` |  |  |  |  |
<!-- generated:firstbeat-schema-team end -->

## `Group`

<!-- generated:firstbeat-schema-group start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `groupId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |
<!-- generated:firstbeat-schema-group end -->

## `Sessions`

<!-- generated:firstbeat-schema-sessions start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `sessions` | array of `Session` |  |  |  |  |
<!-- generated:firstbeat-schema-sessions end -->

## `Session`

<!-- generated:firstbeat-schema-session start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionId` | `integer` |  |  |  |  |
| `coachId` | `integer` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  |  |  |  |
| `sportsType` | `string` |  |  |  |  |
| `eventType` | `string` |  |  |  |  |
| `notes` | `string` |  |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |
| `laps` | array of `SessionLap` |  |  |  |  |
<!-- generated:firstbeat-schema-session end -->

## `SessionLap`

<!-- generated:firstbeat-schema-sessionlap start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `lapId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |
<!-- generated:firstbeat-schema-sessionlap end -->

## `SessionResults`

<!-- generated:firstbeat-schema-sessionresults start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `measurements` | array of `SessionMeasurementResults` |  |  |  |  |
<!-- generated:firstbeat-schema-sessionresults end -->

## `Measurements`

<!-- generated:firstbeat-schema-measurements start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `measurements` | array of `AthleteMeasurement` |  |  |  |  |
<!-- generated:firstbeat-schema-measurements end -->

## `AthleteMeasurement`

<!-- generated:firstbeat-schema-athletemeasurement start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `measurementId` | `integer` |  |  |  |  |
| `athleteId` | `integer` |  |  |  |  |
| `sessionId` | `integer` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `measurementType` | `string` |  |  |  | Values: `exercise`, `quickRecoveryTest`, `night`, `manual` |
| `exerciseType` | `string` |  |  |  |  |
| `sportsType` | `string` |  |  |  |  |
| `eventType` | `string` |  |  |  |  |
| `notes` | `string` |  |  |  |  |
| `laps` | array of `MeasurementLap` |  |  |  |  |
<!-- generated:firstbeat-schema-athletemeasurement end -->

## `MeasurementLap`

<!-- generated:firstbeat-schema-measurementlap start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `lapId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
<!-- generated:firstbeat-schema-measurementlap end -->

## `SessionMeasurementResults`

<!-- generated:firstbeat-schema-sessionmeasurementresults start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `athleteId` | `integer` |  |  |  |  |
| `sessionId` | `integer` |  |  |  |  |
| `measurementId` | `integer` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `exerciseType` | `string` |  |  |  |  |
| `sportsType` | `string` |  |  |  |  |
| `eventType` | `string` |  |  |  |  |
| `notes` | `string` |  |  |  |  |
| `variables` | array of `Variable` or `TimeSeriesVariable` |  |  |  |  |
<!-- generated:firstbeat-schema-sessionmeasurementresults end -->

## `AthleteMeasurementResults`

<!-- generated:firstbeat-schema-athletemeasurementresults start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `athleteId` | `integer` |  |  |  |  |
| `measurementId` | `integer` |  |  |  |  |
| `sessionId` | `integer` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `measurementType` | `string` |  |  |  | Values: `exercise`, `quickRecoveryTest`, `night`, `manual` |
| `exerciseType` | `string` |  |  |  |  |
| `sportsType` | `string` |  |  |  |  |
| `eventType` | `string` |  |  |  |  |
| `notes` | `string` |  |  |  |  |
| `variables` | array of `Variable` or `TimeSeriesVariable` |  |  |  |  |
<!-- generated:firstbeat-schema-athletemeasurementresults end -->

## `AthleteMeasurementLapResults`

<!-- generated:firstbeat-schema-athletemeasurementlapresults start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `athleteId` | `integer` |  |  |  |  |
| `measurementId` | `integer` |  |  |  |  |
| `sessionId` | `integer` |  |  |  |  |
| `lapId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `measurementType` | `string` |  |  |  | Values: `exercise`, `quickRecoveryTest`, `night`, `manual` |
| `exerciseType` | `string` |  |  |  |  |
| `sportsType` | `string` |  |  |  |  |
| `eventType` | `string` |  |  |  |  |
| `notes` | `string` |  |  |  |  |
| `variables` | array of `Variable` or `TimeSeriesVariable` |  |  |  |  |
<!-- generated:firstbeat-schema-athletemeasurementlapresults end -->

## `SessionLapResults`

<!-- generated:firstbeat-schema-sessionlapresults start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `measurements` | array of `SessionLapMeasurementResults` |  |  |  |  |
<!-- generated:firstbeat-schema-sessionlapresults end -->

## `SessionLapMeasurementResults`

<!-- generated:firstbeat-schema-sessionlapmeasurementresults start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionId` | `integer` |  |  |  |  |
| `lapId` | `integer` |  |  |  |  |
| `athleteId` | `integer` |  |  |  |  |
| `measurementId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `exerciseType` | `string` |  |  |  |  |
| `sportsType` | `string` |  |  |  |  |
| `eventType` | `string` |  |  |  |  |
| `notes` | `string` |  |  |  |  |
| `variables` | array of `Variable` or `TimeSeriesVariable` |  |  |  |  |
<!-- generated:firstbeat-schema-sessionlapmeasurementresults end -->

## `Variable`

<!-- generated:firstbeat-schema-variable start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  |  |  |  |
| `unit` | `string` |  |  |  |  |
| `value` | `number` |  |  |  |  |
<!-- generated:firstbeat-schema-variable end -->

`variables` in the results schemas is an array whose items are one of `Variable` or `TimeSeriesVariable` (`oneOf`). Names, units and meanings of the variables are listed in Firstbeat variables.

## `TimeSeriesVariable`

<!-- generated:firstbeat-schema-timeseriesvariable start -->
| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  |  |  |  |
| `unit` | `string` |  |  |  |  |
| `samplingRate` | `string` |  |  |  |  |
| `type` | `string` |  |  |  |  |
| `bits` | `integer` |  |  |  |  |
| `value` | `string` |  |  |  |  |
<!-- generated:firstbeat-schema-timeseriesvariable end -->

`variables` in the results schemas is an array whose items are one of `Variable` or `TimeSeriesVariable` (`oneOf`). Names, units and meanings of the variables are listed in Firstbeat variables.
