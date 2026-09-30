---
source_type: curated
source_url: https://prd-euw-api-externalprofile.valdperformance.com/swagger/v1/swagger.json
upstream_version: VALD external APIs, eight specifications (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD Identity Surfaces

## Organisation and athlete IDs in the VALD APIs

From the eight specifications. The specs give no field descriptions, so the
"Entity" column is inferred from the field and schema names.

| Entity | ID field | Type | Where it appears |
|---|---|---|---|
| Tenant (organisation) | `tenantId` / `TenantId` | `string`, `uuid` | every test API; Tenants and Profiles APIs |
| Athlete profile | `profileId` / `ProfileId` | `string`, `uuid` | Profiles API; test records in ForceDecks, NordBord, ForceFrame, SmartSpeed, DynaMo, HumanTrak |
| Athlete (older endpoints) | `athleteId` / `AthleteId` | `string`, `uuid` | ForceDecks `v2019q3` endpoints and `TrialDTO`; NordBord, ForceFrame and DynaMo records; filters on NordBord, ForceFrame and SmartSpeed |
| Athlete (ForceDecks) | `hubAthleteId` | `string`, `uuid` | ForceDecks `TrialDTO` |
| Athlete (ForceDecks) | `id`, `hubId` | `string`, `uuid` | ForceDecks `AthleteItemDTO` |
| Team (older endpoints) | `teamId` | `string`, `uuid` | ForceDecks `v2019q3`, SmartSpeed `v1/team/{teamId}`, DynaMo `v2022q2/teams/{teamId}` |
| Group | `groupId`, `groupIds` | `string`, `uuid` | Tenants API; `groupIds` on profiles |
| Category | `categoryId` | `string`, `uuid` | Tenants API |
| Test | `testId` | `string`, `uuid` | every test API |
| Recording | `recordingId` | `string`, `uuid` | ForceDecks |
| Trial | `id` | `string`, `uuid` | ForceDecks `TrialDTO` |
| Result definition | `resultId` | `integer`, `int32` | ForceDecks `/resultdefinitions/{resultId}`, `GetResultDefinitionResponse` |

The specs do not say how `athleteId`, `hubAthleteId` and `profileId` relate, or how
`teamId` relates to `tenantId`. The deprecated ForceDecks team and athlete endpoints
point to the "External Tenants API" and the "External Profiles API" instead.

## Custom keys for joining to other systems

Two string fields exist for an organisation's own keys:

- `externalId` (`string`): on Profiles API profiles (`GetProfileByIdResponse`,
  `GetProfileSearchResponse_ProfileDetail`, `ImportProfileRequest`), as a filter on
  `GET /profiles`, and on ForceDecks `AthleteItemDTO`.
- `syncId` (`string`): on profiles, and on Tenants API groups and categories. It is a
  filter on `GET /profiles`, `GET /groups` and `GET /profiles/exists`. The Profiles
  API also has `DELETE /profiles/syncids` and the Tenants API
  `DELETE /tenants/{tenantId}/syncids`.

The specs do not describe either field's meaning.

## Joining VALD data to football data providers

The VALD specs have no field that holds an ID from a football data provider, and no
match or fixture ID. Test records carry dates such as `recordedDateUtc` and
`modifiedDateUtc`. To join VALD tests to match data, a club needs its own mapping,
for example a player ID kept in `externalId`.

The Tenants API `Sport` enum has a value `FootballSoccer`. It describes a tenant's
sport, not a link to any football data.

## Personal data in identity fields

Profiles carry `givenName`, `familyName`, `dateOfBirth`, `sex` (`Male`, `Female`,
`Unknown`, `NotApplicable`), `email`, `weightInKg`, `heightInCm`, `sport` and
`position`. `ImportProfileRequest` also has the consent flags
`isCreatedByUserOver18YearsOld`, `isGuardianConsentGiven` and
`isPhotoVideoConsentGiven`. ForceDecks `AthleteItemDTO` has `name`, `givenName` and
`familyName`, and `DetailedTestDTO` has `fullName`. These are personal data; the
body measures are health data. Do not use them as join keys, and do not copy them
into shared datasets.
