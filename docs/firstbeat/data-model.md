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

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `consumerName` | `string` |  |  | yes | minLength: `2` maxLength: `100` |

## `RegisterResponse`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` |  |  |  | minLength: `36` maxLength: `36` |
| `consumerName` | `string` |  |  |  | minLength: `2` maxLength: `100` |
| `sharedSecret` | `string` |  |  |  | minLength: `36` maxLength: `36` |

## `ApiKey`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `apiKey` | `string` |  |  |  | minLength: `20` maxLength: `128` |

The spec names this field `apiKey`. The "Getting Started" page (https://apidocs.firstbeat.com/getting-started/) shows the response as `{"apikey": "..."}` and reads `response.json()["apikey"]`, with a lower-case `k`. The two sources disagree.

## `SharedSecret`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sharedSecret` | `string` |  |  |  | minLength: `36` maxLength: `36` |

## `Accounts`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `accounts` | array of `Account` |  |  |  |  |

## `Account`

`authorizedBy` is an object with one field, `coachId` (`integer`).

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `accountId` | `string` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `authorizedBy` | `object` |  |  |  |  |

## `Athletes`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `athletes` | array of `Athlete` |  |  |  |  |

## `Athlete`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `athleteId` | `integer` |  |  |  |  |
| `firstName` | `string` |  |  |  | **Personal data.** |
| `lastName` | `string` |  |  |  | **Personal data.** |
| `email` | `string` |  |  |  | **Personal data.** |

## `Coaches`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `coaches` | array of `Coach` |  |  |  |  |

## `Coach`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `coachId` | `integer` |  |  |  |  |
| `firstName` | `string` |  |  |  | **Personal data.** |
| `lastName` | `string` |  |  |  | **Personal data.** |
| `email` | `string` |  |  |  | **Personal data.** |

## `Teams`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `teams` | array of `Team` |  |  |  |  |

## `Team`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `teamId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |
| `groups` | array of `Group` |  |  |  |  |

## `Group`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `groupId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |

## `Sessions`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `sessions` | array of `Session` |  |  |  |  |

## `Session`

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

## `SessionLap`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `lapId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |
| `athleteIds` | array of `integer` |  |  |  |  |

## `SessionResults`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `measurements` | array of `SessionMeasurementResults` |  |  |  |  |

## `Measurements`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `more` | `boolean` |  |  |  |  |
| `measurements` | array of `AthleteMeasurement` |  |  |  |  |

## `AthleteMeasurement`

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

## `MeasurementLap`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `lapId` | `integer` |  |  |  |  |
| `name` | `string` |  |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `startTimeLocal` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `endTimeLocal` | `string` | `date-time` |  |  |  |

## `SessionMeasurementResults`

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

## `AthleteMeasurementResults`

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

## `AthleteMeasurementLapResults`

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

## `SessionLapResults`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `measurements` | array of `SessionLapMeasurementResults` |  |  |  |  |

## `SessionLapMeasurementResults`

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

## `Variable`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  |  |  |  |
| `unit` | `string` |  |  |  |  |
| `value` | `number` |  |  |  |  |

`variables` in the results schemas is an array whose items are one of `Variable` or `TimeSeriesVariable` (`oneOf`). Names, units and meanings of the variables are listed in Firstbeat variables.

## `TimeSeriesVariable`

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  |  |  |  |
| `unit` | `string` |  |  |  |  |
| `samplingRate` | `string` |  |  |  |  |
| `type` | `string` |  |  |  |  |
| `bits` | `integer` |  |  |  |  |
| `value` | `string` |  |  |  |  |

`variables` in the results schemas is an array whose items are one of `Variable` or `TimeSeriesVariable` (`oneOf`). Names, units and meanings of the variables are listed in Firstbeat variables.
