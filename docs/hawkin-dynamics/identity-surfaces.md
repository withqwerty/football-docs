---
source_type: curated
source_url: https://connect.hawkindynamics.com/api
upstream_version: Hawkin Force Platform API 1.15 (OpenAPI 3.0.3)
crawled_at: 2026-09-30
---

# Hawkin Dynamics Identity Surfaces

## ID fields in the Hawkin API

From the spec's schemas and parameters. Every ID is a `string`.

| Entity | ID field | Where it appears | Notes from the spec |
|---|---|---|---|
| Test | `id` | `Test`, `ForceTimeData`, `COPData`; path parameter `test_id` | Example `exampleTestId0000000`. The `cursor` parameter is described as a "Firestore document ID from previous response's nextCursor". |
| Athlete | `id` | `Athlete`, `AthleteRef` (`athlete` on tests); path parameter `athleteId`; query parameter `athleteId` | |
| Test type | `id` | `TestType`, `TestTypeSummary`; query parameter `testTypeId` | `TestType` example `9710f473daa20f7069c3d337753e879c` for "Countermovement Jump" |
| Test type (canonical) | `canonicalId` | `TestType` | Example `7nNduHeM5zETPjHxvm7s`. `metrics.json` keys test types by `canonicalTestTypeId`, and its Countermovement Jump entry has the same value. |
| Team | `id` | `Team`; `Athlete.teams` (array of team IDs); query parameter `teamId` | |
| Group | `id` | `Group`; `Athlete.groups` (array of group IDs); query parameter `groupId` | |
| Tag | `id` | `Tag`, inside `TestType.tags` | Tags "sub-classify tests within a test type (e.g. 'Arm Swing', 'Right Single Leg')" |
| Equipment | `eid` | `Test` (only with `includeEid=true`), `ForceTimeData`, `COPData` | "Equipment ID of the hardware that produced the test." Example `eq_AB12CD` |
| Trial | `segment` | `Test` | "Test type and trial number within session", example `Countermovement Jump:5` |

The spec gives two different example IDs for the same test type: `id`
`9710f473daa20f7069c3d337753e879c` and `canonicalId` `7nNduHeM5zETPjHxvm7s`. It does
not say which one `testTypeId` takes. `metrics.json` uses the canonical form.

## Custom keys for joining to other systems

`Athlete.external` is "Custom external properties as key-value pairs" (`object`,
any properties). A club can store its own player ID there. The spec warns on the
update endpoints: "when updating `external` properties, custom properties **not
present in the request will be removed**."

## Joining Hawkin data to football data providers

The Hawkin spec has no field that holds an ID from a football data provider, and no
match or fixture ID. Test times are Unix timestamps (`timestamp`, integer seconds).
To join Hawkin tests to match data, a club needs its own mapping, for example a
player ID kept in `external`.

## Personal data in identity fields

`Athlete` carries `name`, `image` (URL to a photo), `dob` (date of birth, ISO-8601
date), `height` (centimetres), `position` and `sport`. These are personal data;
`height` is health data. Do not use them as join keys, and do not copy them into
shared datasets.
