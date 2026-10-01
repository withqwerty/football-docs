---
source_type: curated
source_url: https://prd-euw-api-extforcedecks.valdperformance.com/swagger/v2019q3/swagger.json
upstream_version: VALD external APIs, eight specifications (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD API Endpoints

## VALD endpoint inventory

VALD publishes one OpenAPI specification per product API. Each API has its own host,
`https://prd-<region>-api-<service>.valdperformance.com`, so the same path (for
example `GET /tests`) means different things on different hosts. The table lists
every operation in the eight specifications, except the four service health
endpoints (`/version`, `/liveness`, `/readiness`, `/diagnostics`) that every
service has. Each product's page has the parameters, responses and schemas.

<!-- generated:vald-endpoint-inventory start -->
| API | Host service | Method | Path | Summary | Deprecated |
|---|---|---|---|---|---|
| Tenants | `externaltenants` | `GET` | `/categories` |  |  |
| Tenants | `externaltenants` | `GET` | `/categories/{categoryId}` |  |  |
| Tenants | `externaltenants` | `POST` | `/categories/import` |  |  |
| Tenants | `externaltenants` | `GET` | `/groups` |  |  |
| Tenants | `externaltenants` | `GET` | `/groups/{groupId}` |  |  |
| Tenants | `externaltenants` | `DELETE` | `/groups/{groupId}` |  |  |
| Tenants | `externaltenants` | `POST` | `/groups/import` |  |  |
| Tenants | `externaltenants` | `PUT` | `/groups/profiles` |  |  |
| Tenants | `externaltenants` | `DELETE` | `/groups/profiles` |  |  |
| Tenants | `externaltenants` | `GET` | `/tenants` |  |  |
| Tenants | `externaltenants` | `GET` | `/tenants/{tenantId}` |  |  |
| Tenants | `externaltenants` | `DELETE` | `/tenants/{tenantId}/syncids` |  |  |
| Profiles | `externalprofile` | `POST` | `/profiles/import` |  |  |
| Profiles | `externalprofile` | `GET` | `/profiles/exists` |  |  |
| Profiles | `externalprofile` | `GET` | `/profiles/{profileId}` |  |  |
| Profiles | `externalprofile` | `GET` | `/profiles` |  |  |
| Profiles | `externalprofile` | `DELETE` | `/profiles/syncids` |  |  |
| Profiles | `externalprofile` | `PUT` | `/profiles/groups` |  |  |
| Profiles | `externalprofile` | `DELETE` | `/profiles/groups` |  |  |
| Profiles | `externalprofile` | `POST` | `/profiles/groups` |  |  |
| Profiles | `externalprofile` | `POST` | `/profiles/merge` |  |  |
| ForceDecks | `extforcedecks` | `GET` | `/resultdefinitions` | Retrieves a collection of ForceDecks result definitions. |  |
| ForceDecks | `extforcedecks` | `GET` | `/resultdefinitions/{resultId}` | Retrieves a ForceDecks result definition. |  |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/athletes` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/athletes/softdeleted` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/athletes/deleted` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/athlete/{athleteId}/tests/{page}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/athlete/{athleteId}/tests/deleted` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/{page}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/{dateFrom}/{dateTo}/{page}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/summary/{dateFrom}/{dateTo}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/typesummarybyathlete/{dateFrom}/{dateTo}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/deleted` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/detailed/{dateFrom}/{dateTo}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/{testId}/trials` |  |  |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/{testId}/recording` |  |  |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/tests/{testId}/recording/file` |  |  |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/recordings/{recordingId}` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/v2019q3/teams/{teamId}/recordings/{recordingId}/file` |  | yes |
| ForceDecks | `extforcedecks` | `GET` | `/tests` | Retrieves a collection of ForceDecks test summaries. |  |
| NordBord | `externalnordbord` | `GET` | `/tests/{testId}/nordbordtrace` | Retrieves a Nordbord force trace. |  |
| NordBord | `externalnordbord` | `GET` | `/tests/{testId}` | Retrieves a Nordbord test summary. |  |
| NordBord | `externalnordbord` | `GET` | `/tests` | Retrieves a collection of pageable Nordbord test summaries. | yes |
| NordBord | `externalnordbord` | `GET` | `/tests/v2` | Retrieves a collection of Nordbord test summaries by modified date. |  |
| NordBord | `externalnordbord` | `GET` | `/tests/{testId}/metrics` | Retrieves additional metrics for a Nordbord test summary. |  |
| NordBord | `externalnordbord` | `GET` | `/training/programs/current` | Retrieves a list of Nordbord training programs or a single program. |  |
| NordBord | `externalnordbord` | `GET` | `/training/sessions/eccentric` | Retrieves a list of Nordbord eccentric training sessions |  |
| NordBord | `externalnordbord` | `GET` | `/training/sessions/eccentric/exercises` | Retrieves a list of Nordbord eccentric training exercise sessions |  |
| NordBord | `externalnordbord` | `GET` | `/training/sessions/eccentric/exercises/repetitions` | Retrieves a list of Nordbord eccentric training exercise repetition sessions |  |
| NordBord | `externalnordbord` | `GET` | `/training/sessions/isometric` | Retrieves a list of Nordbord isometric training sessions |  |
| NordBord | `externalnordbord` | `GET` | `/training/sessions/isometric/exercises` | Retrieves a list of Nordbord isometric training exercise sessions |  |
| NordBord | `externalnordbord` | `GET` | `/training/sessions/isometric/exercises/repetitions` | Retrieves a list of Nordbord isometric training exercise sessions |  |
| ForceFrame | `externalforceframe` | `GET` | `/tests/{testId}/forceframetrace` | Retrieves a ForceFrame force trace. |  |
| ForceFrame | `externalforceframe` | `GET` | `/tests/{testId}` | Retrieves a ForceFrame test summary. |  |
| ForceFrame | `externalforceframe` | `GET` | `/tests/{testId}/repetitions` |  |  |
| ForceFrame | `externalforceframe` | `GET` | `/tests` | Retrieves a collection of pageable ForceFrame test summaries. | yes |
| ForceFrame | `externalforceframe` | `GET` | `/tests/v2` | Retrieves a collection of ForceFrame test summaries. |  |
| ForceFrame | `externalforceframe` | `GET` | `/tests/{testId}/metrics` | Retrieves additional metrics for a ForceFrame test summary. |  |
| ForceFrame | `externalforceframe` | `GET` | `/training/programs/current` | Retrieves a list of ForceFrame training programs or a single program. |  |
| ForceFrame | `externalforceframe` | `GET` | `/training/sessions` | Retrieves a list of ForceFrame training sessions. |  |
| ForceFrame | `externalforceframe` | `GET` | `/training/sessions/exercises` | Retrieves a list of ForceFrame training session exercises or a single training session exercise. |  |
| ForceFrame | `externalforceframe` | `GET` | `/training/sessions/exercises/repetitions` | Retrieves a list of ForceFrame training session exercise repetitions or a single training session exercise repetition. |  |
| SmartSpeed | `extsmartspeed` | `GET` | `/v1/team/{teamId}/tests/{testId}/detail` |  |  |
| SmartSpeed | `extsmartspeed` | `GET` | `/v1/team/{teamId}/tests` |  |  |
| SmartSpeed | `extsmartspeed` | `GET` | `/v1/test/tests-by-modified-date` |  |  |
| DynaMo | `extdynamo` | `GET` | `/v2022q2/teams/{teamId}/tests` |  |  |
| DynaMo | `extdynamo` | `GET` | `/v2022q2/teams/{teamId}/tests/{testId}` |  |  |
| DynaMo | `extdynamo` | `GET` | `/v2022q2/teams/{teamId}/tests/{testId}/trace` |  |  |
| DynaMo | `extdynamo` | `GET` | `/v1/test/tests-by-modified-date` |  |  |
| HumanTrak | `externalhumantrakv2` | `GET` | `/v2/test/{testId}/repetitions` |  |  |
| HumanTrak | `externalhumantrakv2` | `GET` | `/v2/tests-by-modified-date` |  |  |
| HumanTrak | `externalhumantrakv2` | `GET` | `/v2/test-type/metrics` |  |  |
<!-- generated:vald-endpoint-inventory end -->

## VALD operation counts

<!-- generated:vald-operation-counts start -->
| API | Host service | Spec version | Operations (with health endpoints) | Schemas | Schema fields |
|---|---|---|---|---|---|
| Tenants | `externaltenants` | `v1` | 16 | 18 | 53 |
| Profiles | `externalprofile` | `v1` | 13 | 14 | 65 |
| ForceDecks | `extforcedecks` | `v2019q3` | 24 | 33 | 188 |
| NordBord | `externalnordbord` | `v1` | 16 | 27 | 270 |
| ForceFrame | `externalforceframe` | `v1` | 14 | 22 | 278 |
| SmartSpeed | `extsmartspeed` | `v1` | 7 | 32 | 186 |
| DynaMo | `extdynamo` | `v1` | 8 | 23 | 149 |
| HumanTrak | `externalhumantrakv2` | `v2` | 7 | 23 | 80 |
<!-- generated:vald-operation-counts end -->
