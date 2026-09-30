---
source_type: curated
source_url: https://prd-euw-api-extforcedecks.valdperformance.com/swagger/index.html
upstream_version: VALD external APIs, eight specifications (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD API Access

## Overview

VALD makes athlete testing devices. Its external APIs return an organisation's own
test data for these products: ForceDecks, NordBord, ForceFrame, SmartSpeed, DynaMo
and HumanTrak. Two more APIs, Tenants and Profiles, return the organisation's
tenants, groups, categories and athlete profiles.

- Each API publishes its own OpenAPI 3.0.4 specification, with a Swagger UI, on a
  public host (no login). Local snapshots: `specs/vald/`.
- Sources for these docs: the eight specifications, fetched 2026-09-30, and VALD's
  own R package `valdr` 4.0.0 (CRAN, MIT licence, "Copyright holder" VALD) for
  behaviour the specs do not describe.
- VALD's help centre (`support.vald.com`) returns a bot challenge to non-browser
  clients. It is not a source for these docs.

## Hosts and specifications

The host pattern is `https://prd-<region>-api-<service>.valdperformance.com`.
`valdr` builds the same hosts from a region code, and gives the examples "aue",
"use" and "euw". On 2026-09-30 every specification below answered on all three
region hosts, and the copies differed only in `operationId` values.

| API | `<service>` | Specification path | `info.title` | `info.version` |
|---|---|---|---|---|
| Tenants | `externaltenants` | `/swagger/v1/swagger.json` | Vald.Api.ExternalTenants.V1 | v1 |
| Profiles | `externalprofile` | `/swagger/v1/swagger.json` | Vald.Api.ExternalProfile.V1 | v1 |
| ForceDecks | `extforcedecks` | `/swagger/v2019q3/swagger.json` | VALD External ForceDecks API | v2019q3 |
| NordBord | `externalnordbord` | `/swagger/v1/swagger.json` | Vald.Api.ExternalNordbord.V1 | v1 |
| ForceFrame | `externalforceframe` | `/swagger/v1/swagger.json` | Vald.Api.ExternalForceFrame.V1 | v1 |
| SmartSpeed | `extsmartspeed` | `/swagger/v1/swagger.json` | Vald.Api.ExternalSmartSpeed.V1 | v1 |
| DynaMo | `extdynamo` | `/swagger/v1/swagger.json` | Vald.Api.ExternalDynamo.V1 | v1 |
| HumanTrak | `externalhumantrakv2` | `/swagger/v2/swagger.json` | Vald.Api.ExternalHumanTrak.V2 | v2 |

For example, the ForceDecks Swagger UI in the `euw` region is
`https://prd-euw-api-extforcedecks.valdperformance.com/swagger/index.html`.

The ForceDecks specification also has an `AzureRegion` enum with the values
`NoRegion`, `AustraliaEast`, `WestEurope` and `EastUnitedStates`. The specs do not
map these to the region codes in host names.

## Authentication

Every specification declares an OAuth2 client-credentials scheme and applies it to
every operation. All eight give the token URL `https://auth.prd.vald.com/oauth/token`.
The Tenants, Profiles, SmartSpeed, DynaMo and HumanTrak specifications also give
`audience: vald-api-external`; the ForceDecks, NordBord and ForceFrame
specifications give no audience. The scheme is named `OAuth2` in seven specs and
`Auth0` in the HumanTrak spec.

`valdr` requests a token with a form-encoded `POST` to that URL, with
`grant_type=client_credentials`, `client_id`, `client_secret` and
`audience=vald-api-external`, for every API. It then sends
`Authorization: Bearer <access_token>`.

```bash
TOKEN=$(curl -s -X POST https://auth.prd.vald.com/oauth/token \
  -d grant_type=client_credentials \
  -d client_id="$VALD_CLIENT_ID" -d client_secret="$VALD_CLIENT_SECRET" \
  -d audience=vald-api-external | jq -r '.access_token')
curl -H "Authorization: Bearer $TOKEN" \
  "https://prd-euw-api-extforcedecks.valdperformance.com/tests?TenantId=$VALD_TENANT_ID&ModifiedFromUtc=2026-01-01T00:00:00Z"
```

The specifications do not say how to get a `client_id` and `client_secret`.
`valdr`'s DESCRIPTION points to VALD's integration guide,
https://support.vald.com/hc/en-au/articles/23415335574553-How-to-integrate-with-VALD-APIs,
which was not read (see Overview).

## Tenant ID and region

Almost every data endpoint takes a tenant ID (`TenantId` or `tenantId`, format
`uuid`), usually as a required query parameter. The Tenants API has
`GET /tenants` and `GET /tenants/{tenantId}`; the spec gives them no summary.
`valdr` stores one tenant ID and one region per set of credentials.

## Paging by modified date

The current list endpoints take a required `ModifiedFromUtc` (`date-time`) and
return tests modified from that time. Examples: ForceDecks `GET /tests`, NordBord
and ForceFrame `GET /tests/v2`, SmartSpeed and DynaMo
`GET /v1/test/tests-by-modified-date`, HumanTrak `GET /v2/tests-by-modified-date`.
All of these list `204` "No Content" among their responses.

`valdr` pages all six test APIs through those endpoints in the same way: it
requests from a start time, sets `modifiedFromUtc` to the last returned test's
`modifiedDateUtc`, requests again, and stops at HTTP `204`. It waits 0.2 seconds
between requests, with the comment "Pause to respect rate limits".

Older list endpoints page by number instead: `GET /tests` on NordBord and ForceFrame
(`Page`, `PageSize`; marked deprecated), SmartSpeed `GET /v1/team/{teamId}/tests`
(`Page`, required) and DynaMo `GET /v2022q2/teams/{teamId}/tests` (`page`).

## Rate limits and errors

The specifications state no rate limit. Error responses in the specs use
`ProblemDetails` and `ValidationProblemDetails` schemas (`type`, `title`, `status`,
`detail`, `instance`, and `errors` for validation); some specs give them longer
names, such as `Microsoft.AspNetCore.Mvc.ProblemDetails`.

## Deprecated ForceDecks endpoints

The ForceDecks specification marks 14 of its `/v2019q3/...` endpoints as
deprecated. Their description says they "will be phased out over time, though they
remain functional", and names a replacement:

| Deprecated endpoints | Replacement named in the spec |
|---|---|
| `/v2019q3/teams` | "External Tenants API" |
| `/v2019q3/teams/{teamId}/athletes`, `.../athletes/softdeleted`, `.../athletes/deleted` | "External Profiles API" |
| The eight `/v2019q3/teams/{teamId}/.../tests...` list endpoints | `/tests` |
| `/v2019q3/teams/{teamId}/recordings/{recordingId}` | `/v2019q3/teams/{teamId}/tests/{testId}/recording` |
| `/v2019q3/teams/{teamId}/recordings/{recordingId}/file` | `/v2019q3/teams/{teamId}/tests/{testId}/recording/file` |

Three `/v2019q3` endpoints are not deprecated: `.../tests/{testId}/trials`,
`.../tests/{testId}/recording` and `.../tests/{testId}/recording/file`. Nor are
`GET /tests` and the two `/resultdefinitions` endpoints.

## Terms

The specifications carry no licence. No published terms for reusing the API
documentation were found; `https://valdperformance.com/policies/terms-of-use`
returned 404 on 2026-09-30. Access needs credentials that VALD issues.
