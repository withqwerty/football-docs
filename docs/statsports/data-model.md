---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# STATSports Data Model

## Response structure (v7)

`getFullSession`, `getFullSessionsByDateRange` and `getFullSessionByShareDate`
return `ThirdPartyDataV7` in v7. The nesting, from the spec's `$ref` links:

```
ThirdPartyDataV7
├── session: SessionDataV7
└── players[]: SessionPlayerDataV7
    ├── player: PlayerDataV6
    └── drills[]: DrillDataV7
        └── drillKpi: DrillKpiV7   (319 metric fields, see STATSports drill KPI metrics)
```

In v6 the same shape uses `ThirdPartyDataV6`, `SessionDataV6`,
`SessionPlayerDataV6`, `PlayerDataV6`, `DrillDataV6` and `DrillKpiV6`. In v5 it uses
the `V5` schemas. `getPlayerDetails` returns `PlayerDataV6` in v6 and v7, and
`PlayerDataV5` in v5.

No schema field in any version has a description, and the spec gives no units.
Every schema sets `additionalProperties: false`. The field tables below copy name,
type, format and nullability from the spec. Fields marked **Personal data** hold
data about an identifiable athlete; health data (heart rate, body measures) is
special category data under UK and EU GDPR.

## `ThirdPartyDataV7` (session response)

<!-- generated:statsports-schema-thirdpartydatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `name` | `string` |  | yes |  |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
| `session` | `SessionDataV7` |  |  |  |  |
| `players` | array of `SessionPlayerDataV7` |  | yes |  |  |
| `clubId` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-thirdpartydatav7 end -->

## `ThirdPartyDataV6` (session response)

<!-- generated:statsports-schema-thirdpartydatav6 start -->
Defined in the v6 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `name` | `string` |  | yes |  |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
| `session` | `SessionDataV6` |  |  |  |  |
| `players` | array of `SessionPlayerDataV6` |  | yes |  |  |
| `clubId` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-thirdpartydatav6 end -->

## `ThirdPartyDataV5` (session response)

<!-- generated:statsports-schema-thirdpartydatav5 start -->
Defined in the v5 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `name` | `string` |  | yes |  |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
| `session` | `SessionDataV5` |  |  |  |  |
| `players` | array of `SessionPlayerDataV5` |  | yes |  |  |
<!-- generated:statsports-schema-thirdpartydatav5 end -->

## `SessionDataV7` (session)

<!-- generated:statsports-schema-sessiondatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionDate` | `string` | `date-time` |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
| `squadId` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-sessiondatav7 end -->

## `SessionDataV6` (session)

<!-- generated:statsports-schema-sessiondatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionDate` | `string` | `date-time` |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-sessiondatav6 end -->

## `SessionDataV5` (session)

<!-- generated:statsports-schema-sessiondatav5 start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionDate` | `string` | `date-time` |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-sessiondatav5 end -->

## `SessionPlayerDataV7` (player in a session)

<!-- generated:statsports-schema-sessionplayerdatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `player` | `PlayerDataV6` |  |  |  |  |
| `drills` | array of `DrillDataV7` |  | yes |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionId` | `string` | `uuid` |  |  |  |
| `dataId` | `string` | `uuid` |  |  |  |
<!-- generated:statsports-schema-sessionplayerdatav7 end -->

## `SessionPlayerDataV6` (player in a session)

<!-- generated:statsports-schema-sessionplayerdatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `player` | `PlayerDataV6` |  |  |  |  |
| `drills` | array of `DrillDataV6` |  | yes |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionId` | `string` | `uuid` |  |  |  |
| `dataId` | `string` | `uuid` |  |  |  |
<!-- generated:statsports-schema-sessionplayerdatav6 end -->

## `SessionPlayerDataV5` (player in a session)

<!-- generated:statsports-schema-sessionplayerdatav5 start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `player` | `PlayerDataV5` |  |  |  |  |
| `drills` | array of `DrillDataV5` |  | yes |  |  |
<!-- generated:statsports-schema-sessionplayerdatav5 end -->

## `PlayerDataV6` (player)

<!-- generated:statsports-schema-playerdatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `displayName` | `string` |  | yes |  | **Personal data.** |
| `firstName` | `string` |  | yes |  | **Personal data.** |
| `lastName` | `string` |  | yes |  | **Personal data.** |
| `dateOfBirth` | `string` | `date-time` |  |  | **Personal data.** |
| `gender` | `integer` | `int32` |  |  | **Personal data.** |
| `shortName` | `string` |  | yes |  | **Personal data.** |
| `height` | `number` | `double` |  |  | **Personal data.** |
| `weight` | `number` | `double` |  |  | **Personal data.** |
| `maxSpeed` | `number` | `double` |  |  |  |
| `maxHeartRate` | `number` | `double` |  |  | **Personal data.** |
| `restingHeartRate` | `number` | `double` |  |  | **Personal data.** |
| `activeSquadName` | `string` |  | yes |  |  |
| `thirdPartyId1` | `string` |  | yes |  |  |
| `maxAccel` | `number` | `double` |  |  |  |
| `maxDecel` | `number` | `double` |  |  |  |
| `runningSymmetry` | `number` | `double` |  |  |  |
| `thirdPartyId2` | `string` |  | yes |  |  |
| `thirdPartyId3` | `string` |  | yes |  |  |
| `playerThirdParties` | array of `PlayerThirdParty` |  | yes |  |  |
| `sessionId` | `string` |  | yes |  |  |
| `primaryPosition` | `string` |  | yes |  |  |
| `secondaryPosition` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-playerdatav6 end -->

`gender` is an `integer` (`int32`). The spec gives no mapping from values to meanings. `thirdPartyId1`, `thirdPartyId2` and `thirdPartyId3` have no description in the spec.

## `PlayerDataV5` (player)

<!-- generated:statsports-schema-playerdatav5 start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `displayName` | `string` |  | yes |  | **Personal data.** |
| `firstName` | `string` |  | yes |  | **Personal data.** |
| `lastName` | `string` |  | yes |  | **Personal data.** |
| `dateOfBirth` | `string` | `date-time` |  |  | **Personal data.** |
| `gender` | `integer` | `int32` |  |  | **Personal data.** |
| `shortName` | `string` |  | yes |  | **Personal data.** |
| `height` | `number` | `double` |  |  | **Personal data.** |
| `weight` | `number` | `double` |  |  | **Personal data.** |
| `maxSpeed` | `number` | `double` |  |  |  |
| `maxHeartRate` | `number` | `double` |  |  | **Personal data.** |
| `restingHeartRate` | `number` | `double` |  |  | **Personal data.** |
| `activeSquadName` | `string` |  | yes |  |  |
| `thirdPartyId1` | `string` |  | yes |  |  |
| `maxAccel` | `number` | `double` |  |  |  |
| `maxDecel` | `number` | `double` |  |  |  |
| `runningSymmetry` | `number` | `double` |  |  |  |
| `thirdPartyId2` | `string` |  | yes |  |  |
| `thirdPartyId3` | `string` |  | yes |  |  |
| `playerThirdParties` | array of `PlayerThirdParty` |  | yes |  |  |
| `position` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-playerdatav5 end -->

`gender` is an `integer` (`int32`). The spec gives no mapping from values to meanings. `thirdPartyId1`, `thirdPartyId2` and `thirdPartyId3` have no description in the spec.

## `PlayerThirdParty` (player third-party ID)

<!-- generated:statsports-schema-playerthirdparty start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `syncedAt` | `string` | `date-time` | yes |  |  |
| `isDeleted` | `boolean` |  |  |  |  |
| `createdAt` | `string` | `date-time` |  |  |  |
| `createdBy` | `string` | `uuid` |  |  |  |
| `updatedAt` | `string` | `date-time` | yes |  |  |
| `updatedBy` | `string` | `uuid` | yes |  |  |
| `playerId` | `string` | `uuid` |  |  |  |
| `thirdPartyId` | `integer` | `int32` |  |  |  |
| `customId` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-playerthirdparty end -->

`thirdPartyId` is an `integer`; the spec does not list its values or say which third party each value names.

## `DrillDataV7` (drill)

<!-- generated:statsports-schema-drilldatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  | yes |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
| `drillKpi` | `DrillKpiV7` |  |  |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionId` | `string` | `uuid` |  |  |  |
| `sessionPlayerDataId` | `string` | `uuid` |  |  |  |
| `primaryLabel` | `string` |  | yes |  |  |
| `secondaryLabel` | `string` |  | yes |  |  |
| `tertiaryLabel` | `string` |  | yes |  |  |
| `freeText` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-drilldatav7 end -->

## `DrillDataV6` (drill)

<!-- generated:statsports-schema-drilldatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  | yes |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
| `drillKpi` | `DrillKpiV6` |  |  |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionId` | `string` | `uuid` |  |  |  |
| `sessionPlayerDataId` | `string` | `uuid` |  |  |  |
| `primaryLabel` | `string` |  | yes |  |  |
| `secondaryLabel` | `string` |  | yes |  |  |
| `tertiaryLabel` | `string` |  | yes |  |  |
| `freeText` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-drilldatav6 end -->

## `DrillDataV5` (drill)

<!-- generated:statsports-schema-drilldatav5 start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `name` | `string` |  | yes |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
| `drillKpi` | `DrillKpiV5` |  |  |  |  |
<!-- generated:statsports-schema-drilldatav5 end -->

## `ThirdPartyDto` (request body)

<!-- generated:statsports-schema-thirdpartydto start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `thirdPartyApiId` | `string` | `uuid` |  |  |  |
| `sessionDate` | `string` | `date-time` | yes |  |  |
<!-- generated:statsports-schema-thirdpartydto end -->

## `ThirdPartyShareDateDto` (request body)

<!-- generated:statsports-schema-thirdpartysharedatedto start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `thirdPartyApiId` | `string` | `uuid` |  | yes |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
<!-- generated:statsports-schema-thirdpartysharedatedto end -->

## `ThirdPartyDateRangeDto` (request body)

<!-- generated:statsports-schema-thirdpartydaterangedto start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `thirdPartyApiId` | `string` | `uuid` |  |  |  |
| `sessionStartDate` | `string` | `date-time` | yes |  |  |
| `sessionEndDate` | `string` | `date-time` | yes |  |  |
<!-- generated:statsports-schema-thirdpartydaterangedto end -->

## `ThirdPartyRawDataDto` (request body)

<!-- generated:statsports-schema-thirdpartyrawdatadto start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `thirdPartyApiId` | `string` | `uuid` |  |  |  |
| `rawDataId` | `string` | `uuid` |  |  |  |
| `nextPage` | `integer` | `int32` |  |  |  |
<!-- generated:statsports-schema-thirdpartyrawdatadto end -->

## `GpsDataV6RawDataResponse` (raw GPS page)

<!-- generated:statsports-schema-gpsdatav6rawdataresponse start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `nextPage` | `integer` | `int32` |  |  |  |
| `data` | array of `GpsDataV6` |  | yes |  |  |
<!-- generated:statsports-schema-gpsdatav6rawdataresponse end -->

## `GpsDataV6` (GPS sample)

<!-- generated:statsports-schema-gpsdatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `t` | `integer` | `int64` |  |  |  |
| `lat` | `number` | `double` |  |  |  |
| `lon` | `number` | `double` |  |  |  |
| `v` | `number` | `double` |  |  |  |
| `hr` | `number` | `double` |  |  | **Personal data.** |
<!-- generated:statsports-schema-gpsdatav6 end -->

The spec gives no units or descriptions for `t`, `lat`, `lon`, `v` or `hr`. `hr` is heart rate data, which is health data.

## `ImuDataV6RawDataResponse` (raw IMU page)

<!-- generated:statsports-schema-imudatav6rawdataresponse start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `nextPage` | `integer` | `int32` |  |  |  |
| `data` | array of `ImuDataV6` |  | yes |  |  |
<!-- generated:statsports-schema-imudatav6rawdataresponse end -->

## `ImuDataV6` (IMU sample)

<!-- generated:statsports-schema-imudatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `t` | `integer` | `int64` |  |  |  |
| `ax` | `number` | `double` |  |  |  |
| `ay` | `number` | `double` |  |  |  |
| `az` | `number` | `double` |  |  |  |
| `gx` | `number` | `double` |  |  |  |
| `gy` | `number` | `double` |  |  |  |
| `gz` | `number` | `double` |  |  |  |
<!-- generated:statsports-schema-imudatav6 end -->

The spec gives no units or descriptions for `t`, `ax`, `ay`, `az`, `gx`, `gy` or `gz`.

## `GpsImuDataV6RawDataResponse` (raw GPS and IMU page)

<!-- generated:statsports-schema-gpsimudatav6rawdataresponse start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `nextPage` | `integer` | `int32` |  |  |  |
| `data` | array of `GpsImuDataV6` |  | yes |  |  |
<!-- generated:statsports-schema-gpsimudatav6rawdataresponse end -->

## `GpsImuDataV6` (GPS sample with IMU samples)

<!-- generated:statsports-schema-gpsimudatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `t` | `integer` | `int64` |  |  |  |
| `lat` | `number` | `double` |  |  |  |
| `lon` | `number` | `double` |  |  |  |
| `v` | `number` | `double` |  |  |  |
| `hr` | `number` | `double` |  |  | **Personal data.** |
| `imuData` | array of `ImuDataV6` |  | yes |  |  |
<!-- generated:statsports-schema-gpsimudatav6 end -->

## `IntPtr` (empty schema)

Defined in the v5, v6, v7 specs.

`IntPtr` is an object with no properties. No operation or schema in any version refers to it.

## Differences between versions

From the spec files, compared on 2026-09-30:

- v6 adds, over v5: the `getFullSessionsByDateRange`, `getSessionGpsData`,
  `getSessionImuData` and `getSessionRawData` operations; `id`, `sessionId`,
  `sessionPlayerDataId`, `primaryLabel`, `secondaryLabel`, `tertiaryLabel` and
  `freeText` on the drill; `id`, `sessionId` and `dataId` on the session player;
  `sessionId`, `primaryPosition` and `secondaryPosition` on the player (v5 has
  `position` instead); `clubId` on the top-level object; and 11 drill KPI
  fields.
- v7 adds, over v6: `squadId` on the session, and a new drill KPI schema
  (`DrillKpiV7`) with 319 fields. `DrillKpiV7` drops 79 `DrillKpiV6` field names
  and adds 168. The full lists are in STATSports drill KPI metrics.
- v7 still returns `PlayerDataV6` for players, and v6 schemas for raw data.
