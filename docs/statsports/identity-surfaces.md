---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
archived_url: https://web.archive.org/web/20261125135449/https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-11-16
---

# STATSports Identity Surfaces

## ID fields in the STATSports API

Every ID below comes from the v5, v6 and v7 specs fetched on 2026-11-16. None has a
description in the spec, so the "Entity" column is inferred from the schema that
holds the field.

| Schema | Field | Type | Format | Entity |
|---|---|---|---|---|
| `ThirdPartyDataV5/V6/V7` | `id` | `string` | `uuid` | the top-level record the API returns |
| `SessionDataV7` | `squadId` | `string` (nullable) | none | squad |
| `SessionPlayerDataV6/V7` | `id` | `string` | `uuid` | player in a session |
| `SessionPlayerDataV6/V7` | `rawDataId` | `string` | `uuid` | not described |
| `PlayerDataV5/V6` | `customPlayerId` | `string` (nullable) | none | not described |
| `PlayerThirdParty` | `id` | `string` | `uuid` | the third-party link record |
| `PlayerThirdParty` | `playerId` | `string` | `uuid` | player |
| `PlayerThirdParty` | `thirdPartyId` | `integer` | `int32` | not described; values not listed |
| `PlayerThirdParty` | `customId` | `string` (nullable) | none | not described |
| `PlayerThirdParty` | `createdBy`, `updatedBy` | `string` | `uuid` (`updatedBy` nullable) | not described |
| `DrillDataV6/V7` | `id` | `string` | `uuid` | drill |
| `DrillDataV6/V7` | `sessionPlayerDataId` | `string` | `uuid` | player in a session |
| `ThirdPartyRawDataDto` | `rawDataId` | `string` | `uuid` | raw data set to page through |
| request bodies | `thirdPartyApiId` | `string` | `uuid` | the caller's API key (see STATSports API access) |

`PlayerThirdParty` is still defined in each spec, but no schema or operation refers
to it, so no documented response returns it.

The spec does not say whether `SessionPlayerDataV6/V7.rawDataId` is the value the
raw-data operations take in `ThirdPartyRawDataDto.rawDataId`.

## STATSports ID fields removed on 2026-11-16

The specs fetched on 2026-11-16 removed these ID fields, which the earlier specs had:

- `id` (`uuid`) on the player (`PlayerDataV5`, `PlayerDataV6`). No player field
  holds a STATSports player ID any more.
- `thirdPartyId1`, `thirdPartyId2`, `thirdPartyId3` and `playerThirdParties` on the
  player. `customPlayerId` is new.
- `sessionId` on the player (v6), the player in a session (v6, v7) and the drill
  (v6, v7), and `dataId` on the player in a session (v6, v7).
- `clubId` on the top-level session response (v6, v7).

Code written against the earlier specs that reads any of these fields needs to
change. The new names were not checked against live responses, because the API
needs a customer token.

## Joining STATSports data to football data providers

The STATSports spec has no field that holds an ID from a football data provider
(Opta, StatsBomb, Wyscout, SportMonks or similar), and no match or fixture ID. Its
units are the session, the player and the drill, with `startTime` and `endTime`
(`date-time`) on sessions and drills.

To join STATSports data to match or event data, a club needs its own mapping:

- Players: the specs fetched on 2026-11-16 give the player no STATSports ID. The
  only player key field is `customPlayerId` (nullable string). The spec does not
  say what it holds or who sets it. The `id` of a player in a session
  (`SessionPlayerDataV6/V7`) identifies one player in one session, not a player
  across sessions.
- Sessions: match by `sessionDate`, `startTime` and `endTime`. The spec gives no
  match ID, opponent or competition field. `sessionType`, `primaryLabel`,
  `secondaryLabel`, `tertiaryLabel` and `freeText` are free text in the spec.

## Personal data in identity fields

`PlayerDataV5` and `PlayerDataV6` also carry `displayName`, `firstName`, `lastName`,
`shortName`, `dateOfBirth` (`date-time`), `gender` (`integer`), `height`,
`weight`, `maxHeartRate` and `restingHeartRate`. These are personal data, and the
body and heart-rate fields are health data (special category data under UK and EU
GDPR). Do not use them as join keys, and do not copy them into shared datasets.
