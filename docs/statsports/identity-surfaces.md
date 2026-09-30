---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# STATSports Identity Surfaces

## ID fields in the STATSports API

Every ID below comes from the v5, v6 and v7 specs. None has a description in the
spec, so the "Entity" column is inferred from the schema that holds the field.

| Schema | Field | Type | Format | Entity |
|---|---|---|---|---|
| `ThirdPartyDataV5/V6/V7` | `id` | `string` | `uuid` | the top-level record the API returns |
| `ThirdPartyDataV6/V7` | `clubId` | `string` (nullable) | none | club |
| `SessionDataV7` | `squadId` | `string` (nullable) | none | squad |
| `SessionPlayerDataV6/V7` | `id` | `string` | `uuid` | player in a session |
| `SessionPlayerDataV6/V7` | `sessionId` | `string` | `uuid` | session |
| `SessionPlayerDataV6/V7` | `dataId` | `string` | `uuid` | not described |
| `PlayerDataV5/V6` | `id` | `string` | `uuid` | player |
| `PlayerDataV6` | `sessionId` | `string` (nullable) | none | session |
| `PlayerDataV5/V6` | `thirdPartyId1`, `thirdPartyId2`, `thirdPartyId3` | `string` (nullable) | none | not described |
| `PlayerThirdParty` | `id` | `string` | `uuid` | the third-party link record |
| `PlayerThirdParty` | `playerId` | `string` | `uuid` | player |
| `PlayerThirdParty` | `thirdPartyId` | `integer` | `int32` | not described; values not listed |
| `PlayerThirdParty` | `customId` | `string` (nullable) | none | not described |
| `PlayerThirdParty` | `createdBy`, `updatedBy` | `string` | `uuid` (`updatedBy` nullable) | not described |
| `DrillDataV6/V7` | `id` | `string` | `uuid` | drill |
| `DrillDataV6/V7` | `sessionId` | `string` | `uuid` | session |
| `DrillDataV6/V7` | `sessionPlayerDataId` | `string` | `uuid` | player in a session |
| `ThirdPartyRawDataDto` | `rawDataId` | `string` | `uuid` | raw data set to page through |
| request bodies | `thirdPartyApiId` | `string` | `uuid` | the caller's API key (see STATSports API access) |

`PlayerDataV5` and `PlayerDataV6` hold `playerThirdParties`, an array of
`PlayerThirdParty`. The spec does not say how `thirdPartyId1` to `thirdPartyId3`
relate to that array.

No field in the session, player or drill schemas is named `rawDataId`. The spec does
not say where a caller gets the `rawDataId` for the raw-data operations.

## Joining STATSports data to football data providers

The STATSports spec has no field that holds an ID from a football data provider
(Opta, StatsBomb, Wyscout, SportMonks or similar), and no match or fixture ID. Its
units are the session, the player and the drill, with `startTime` and `endTime`
(`date-time`) on sessions and drills.

To join STATSports data to match or event data, a club needs its own mapping:

- Players: map the STATSports player `id` (UUID) to the club's own player ID. The
  free-text fields `thirdPartyId1`, `thirdPartyId2`, `thirdPartyId3` and
  `PlayerThirdParty.customId` may hold such a key, but the spec does not say what
  they hold or who sets them.
- Sessions: match by `sessionDate`, `startTime` and `endTime`. The spec gives no
  match ID, opponent or competition field. `sessionType`, `primaryLabel`,
  `secondaryLabel`, `tertiaryLabel` and `freeText` are free text in the spec.

## Personal data in identity fields

`PlayerDataV5` and `PlayerDataV6` also carry `displayName`, `firstName`, `lastName`,
`shortName`, `dateOfBirth` (`date-time`), `gender` (`integer`), `height`,
`weight`, `maxHeartRate` and `restingHeartRate`. These are personal data, and the
body and heart-rate fields are health data (special category data under UK and EU
GDPR). Do not use them as join keys, and do not copy them into shared datasets.
