---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
archived_url: https://web.archive.org/web/20261125135449/https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-11-16
---

# STATSports Data Model

## Response structure (v7)

`getFullSession`, `getFullSessionsByDateRange` and `getFullSessionByShareDate`
return an array of `ThirdPartyDataV7` in v7. The nesting, from the spec's `$ref`
links:

```
ThirdPartyDataV7[]
├── sessionDetails: SessionDataV7
└── sessionPlayers[]: SessionPlayerDataV7
    ├── playerDetails: PlayerDataV6
    └── drills[]: DrillDataV7
        └── drillKpi: DrillKpiV7   (319 metric fields, see STATSports drill KPI metrics)
```

In v6 the same shape uses `ThirdPartyDataV6`, `SessionDataV6`,
`SessionPlayerDataV6`, `PlayerDataV6`, `DrillDataV6` and `DrillKpiV6`. In v5 it uses
the `V5` schemas. `getPlayerDetails` returns an array of `PlayerDataV6` in v6 and
v7, and an array of `PlayerDataV5` in v5.

## STATSports spec changes on 2026-11-16

The specs fetched on 2026-11-16 rename and remove fields in all three versions.
The docs follow the new specs. Responses were not checked against the live API,
because it needs a customer token. Compared with the specs fetched on 2026-11-03:

- The full-session endpoints and `getPlayerDetails` return an array; the earlier
  specs gave a single object.
- Top-level session response: `name` is now `sessionName`, `session` is
  `sessionDetails` and `players` is `sessionPlayers`. `clubId` (v6, v7) is gone.
- Player in a session: `player` is now `playerDetails`. In v6 and v7, `dataId` is
  gone and `rawDataId` is new, and `sessionId` is gone.
- Player: `id`, `thirdPartyId1`, `thirdPartyId2`, `thirdPartyId3`,
  `playerThirdParties` and (v6) `sessionId` are gone, and `customPlayerId` is new.
  No player field holds a STATSports player ID any more.
- Drill: `name` is now `drillName`. In v6 and v7, `sessionId` is gone.
- Drill KPIs: `hmltime` is now `hmlTime` and `hrexertion` is now `hrExertion`.
- IMU sample: `ax`, `ay`, `az`, `gx`, `gy`, `gz` are now `aX`, `aY`, `aZ`, `gX`,
  `gY`, `gZ`.
- `ThirdPartyDateRangeDto` (request body): `sessionStartDate` and `sessionEndDate`
  are now `SessionStartDate` and `SessionEndDate`.
- `PlayerThirdParty` is still defined, but no schema or operation refers to it.
- The `IntPtr` schema is gone, and each spec declares the server URL
  `/thirdpartyapi`.
- Each version's spec now defines only its own schemas. The v6 and v7 specs no
  longer carry the `V5` schemas, and the v7 spec no longer carries `DrillDataV6`,
  `DrillKpiV6`, `SessionDataV6` or `SessionPlayerDataV6`.

No schema field in any version has a description, and the spec gives no units.
Every schema sets `additionalProperties: false`. The field tables below copy name,
type, format and nullability from the spec. Fields marked **Personal data** hold
data about an identifiable athlete; health data (heart rate, body measures) is
special category data under UK and EU GDPR.

These docs use the short schema names. Since 2026-11-03 the specs name each schema
by its .NET full type name: `DrillKpiV7` is
`Core.Common.Models.ThirdPartyService.V7.DrillKpiV7`, `ThirdPartyDto` is
`Core.Common.Models.ThirdPartyService.Api.ThirdPartyDto`, and `GpsDataV6RawDataResponse`
is ``ThirdPartyCloudService.Models.RawDataResponse`1[[Core.Common.Models.ThirdPartyService.V6.GpsDataV6, ...]]``.
That renaming changed no field; the field changes came with the specs fetched on
2026-11-16 (see above).

## `ThirdPartyDataV7` (session response)

<!-- generated:statsports-schema-thirdpartydatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionDetails` | `SessionDataV7` |  |  |  |  |
| `sessionPlayers` | array of `SessionPlayerDataV7` |  | yes |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionName` | `string` |  | yes |  |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
<!-- generated:statsports-schema-thirdpartydatav7 end -->

## `ThirdPartyDataV6` (session response)

<!-- generated:statsports-schema-thirdpartydatav6 start -->
Defined in the v6 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionDetails` | `SessionDataV6` |  |  |  |  |
| `sessionPlayers` | array of `SessionPlayerDataV6` |  | yes |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionName` | `string` |  | yes |  |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
<!-- generated:statsports-schema-thirdpartydatav6 end -->

## `ThirdPartyDataV5` (session response)

<!-- generated:statsports-schema-thirdpartydatav5 start -->
Defined in the v5 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `sessionName` | `string` |  | yes |  |  |
| `shareDate` | `string` | `date-time` | yes |  |  |
| `sessionDetails` | `SessionDataV5` |  |  |  |  |
| `sessionPlayers` | array of `SessionPlayerDataV5` |  | yes |  |  |
<!-- generated:statsports-schema-thirdpartydatav5 end -->

## `SessionDataV7` (session)

<!-- generated:statsports-schema-sessiondatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `squadId` | `string` |  | yes |  |  |
| `sessionDate` | `string` | `date-time` |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-sessiondatav7 end -->

## `SessionDataV6` (session)

<!-- generated:statsports-schema-sessiondatav6 start -->
Defined in the v6 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `sessionDate` | `string` | `date-time` |  |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-sessiondatav6 end -->

## `SessionDataV5` (session)

<!-- generated:statsports-schema-sessiondatav5 start -->
Defined in the v5 spec.

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
| `drills` | array of `DrillDataV7` |  | yes |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `playerDetails` | `PlayerDataV6` |  |  |  |  |
| `rawDataId` | `string` | `uuid` |  |  |  |
<!-- generated:statsports-schema-sessionplayerdatav7 end -->

## `SessionPlayerDataV6` (player in a session)

<!-- generated:statsports-schema-sessionplayerdatav6 start -->
Defined in the v6 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `playerDetails` | `PlayerDataV6` |  |  |  |  |
| `rawDataId` | `string` | `uuid` |  |  |  |
| `drills` | array of `DrillDataV6` |  | yes |  |  |
<!-- generated:statsports-schema-sessionplayerdatav6 end -->

## `SessionPlayerDataV5` (player in a session)

<!-- generated:statsports-schema-sessionplayerdatav5 start -->
Defined in the v5 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `playerDetails` | `PlayerDataV5` |  |  |  |  |
| `drills` | array of `DrillDataV5` |  | yes |  |  |
<!-- generated:statsports-schema-sessionplayerdatav5 end -->

## `PlayerDataV6` (player)

<!-- generated:statsports-schema-playerdatav6 start -->
Defined in the v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `primaryPosition` | `string` |  | yes |  |  |
| `secondaryPosition` | `string` |  | yes |  |  |
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
| `customPlayerId` | `string` |  | yes |  |  |
| `maxAccel` | `number` | `double` |  |  |  |
| `maxDecel` | `number` | `double` |  |  |  |
| `runningSymmetry` | `number` | `double` |  |  |  |
<!-- generated:statsports-schema-playerdatav6 end -->

`gender` is an `integer` (`int32`). The spec gives no mapping from values to meanings. `customPlayerId` has no description in the spec. The player has no STATSports ID field (see STATSports spec changes on 2026-11-16).

## `PlayerDataV5` (player)

<!-- generated:statsports-schema-playerdatav5 start -->
Defined in the v5 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `position` | `string` |  | yes |  |  |
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
| `customPlayerId` | `string` |  | yes |  |  |
| `maxAccel` | `number` | `double` |  |  |  |
| `maxDecel` | `number` | `double` |  |  |  |
| `runningSymmetry` | `number` | `double` |  |  |  |
<!-- generated:statsports-schema-playerdatav5 end -->

`gender` is an `integer` (`int32`). The spec gives no mapping from values to meanings. `customPlayerId` has no description in the spec. The player has no STATSports ID field (see STATSports spec changes on 2026-11-16).

## `PlayerThirdParty` (player third-party ID)

<!-- generated:statsports-schema-playerthirdparty start -->
Defined in the v5, v6, v7 specs.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `playerId` | `string` | `uuid` |  |  |  |
| `thirdPartyId` | `integer` | `int32` |  |  |  |
| `customId` | `string` |  | yes |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `syncedAt` | `string` | `date-time` | yes |  |  |
| `isDeleted` | `boolean` |  |  |  |  |
| `createdAt` | `string` | `date-time` |  |  |  |
| `createdBy` | `string` | `uuid` |  |  |  |
| `updatedAt` | `string` | `date-time` | yes |  |  |
| `updatedBy` | `string` | `uuid` | yes |  |  |
<!-- generated:statsports-schema-playerthirdparty end -->

`thirdPartyId` is an `integer`; the spec does not list its values or say which third party each value names. Since the specs fetched on 2026-11-16, no schema or operation refers to `PlayerThirdParty`: the player objects no longer carry `playerThirdParties`.

## `DrillDataV7` (drill)

<!-- generated:statsports-schema-drilldatav7 start -->
Defined in the v7 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `drillKpi` | `DrillKpiV7` |  |  |  |  |
| `id` | `string` | `uuid` |  |  |  |
| `sessionPlayerDataId` | `string` | `uuid` |  |  |  |
| `primaryLabel` | `string` |  | yes |  |  |
| `secondaryLabel` | `string` |  | yes |  |  |
| `tertiaryLabel` | `string` |  | yes |  |  |
| `freeText` | `string` |  | yes |  |  |
| `drillName` | `string` |  | yes |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-drilldatav7 end -->

## `DrillDataV6` (drill)

<!-- generated:statsports-schema-drilldatav6 start -->
Defined in the v6 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `id` | `string` | `uuid` |  |  |  |
| `sessionPlayerDataId` | `string` | `uuid` |  |  |  |
| `primaryLabel` | `string` |  | yes |  |  |
| `secondaryLabel` | `string` |  | yes |  |  |
| `tertiaryLabel` | `string` |  | yes |  |  |
| `freeText` | `string` |  | yes |  |  |
| `drillKpi` | `DrillKpiV6` |  |  |  |  |
| `drillName` | `string` |  | yes |  |  |
| `startTime` | `string` | `date-time` |  |  |  |
| `endTime` | `string` | `date-time` |  |  |  |
| `sessionType` | `string` |  | yes |  |  |
<!-- generated:statsports-schema-drilldatav6 end -->

## `DrillDataV5` (drill)

<!-- generated:statsports-schema-drilldatav5 start -->
Defined in the v5 spec.

| Field | Type | Format | Nullable | Required | Description |
|---|---|---|---|---|---|
| `drillName` | `string` |  | yes |  |  |
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
| `SessionStartDate` | `string` | `date-time` | yes |  |  |
| `SessionEndDate` | `string` | `date-time` | yes |  |  |
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
| `aX` | `number` | `double` |  |  |  |
| `aY` | `number` | `double` |  |  |  |
| `aZ` | `number` | `double` |  |  |  |
| `gX` | `number` | `double` |  |  |  |
| `gY` | `number` | `double` |  |  |  |
| `gZ` | `number` | `double` |  |  |  |
<!-- generated:statsports-schema-imudatav6 end -->

The spec gives no units or descriptions for `t`, `aX`, `aY`, `aZ`, `gX`, `gY` or `gZ`. Specs before 2026-11-16 spelt them `ax`, `ay`, `az`, `gx`, `gy` and `gz`.

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
| `imuData` | array of `ImuDataV6` |  | yes |  |  |
| `t` | `integer` | `int64` |  |  |  |
| `lat` | `number` | `double` |  |  |  |
| `lon` | `number` | `double` |  |  |  |
| `v` | `number` | `double` |  |  |  |
| `hr` | `number` | `double` |  |  | **Personal data.** |
<!-- generated:statsports-schema-gpsimudatav6 end -->

## Differences between versions

From the spec files, compared on 2026-11-16:

- v6 adds, over v5: the `getFullSessionsByDateRange`, `getSessionGpsData`,
  `getSessionImuData` and `getSessionRawData` operations; `id`,
  `sessionPlayerDataId`, `primaryLabel`, `secondaryLabel`, `tertiaryLabel` and
  `freeText` on the drill; `id` and `rawDataId` on the session player;
  `primaryPosition` and `secondaryPosition` on the player (v5 has `position`
  instead); and 11 drill KPI fields.
- v7 adds, over v6: `squadId` on the session, and a new drill KPI schema
  (`DrillKpiV7`) with 319 fields. `DrillKpiV7` drops 79 `DrillKpiV6` field names
  and adds 168. The full lists are in STATSports drill KPI metrics.
- v7 still returns `PlayerDataV6` for players, and v6 schemas for raw data.
