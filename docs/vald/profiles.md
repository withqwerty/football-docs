---
source_type: curated
source_url: https://prd-euw-api-externalprofile.valdperformance.com/swagger/v1/swagger.json
upstream_version: Vald.Api.ExternalProfile.V1 v1 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD Profiles API

## VALD Profiles API host and specification

- Host: `https://prd-<region>-api-externalprofile.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-externalprofile.valdperformance.com/swagger/v1/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalProfile.V1", `info.version` "v1").
- Local snapshot: `specs/vald/externalprofile.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`, `audience` "vald-api-external". The spec applies it to every operation.
- The spec declares no `servers`. Its 65 schema fields have no descriptions.

`info.description`: "Please view the [knowledge base](https://support.vald.com/hc/en-au/articles/15973572185625-Developer-Tools-Integrate-your-PMS-AMS-with-VALD-Hub) for more information."

## VALD Profiles endpoints

<!-- generated:vald-profiles-endpoints start -->
| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `POST` | `/profiles/import` |  |  |
| `GET` | `/profiles/exists` |  |  |
| `GET` | `/profiles/{profileId}` |  |  |
| `GET` | `/profiles` |  |  |
| `DELETE` | `/profiles/syncids` |  |  |
| `PUT` | `/profiles/groups` |  |  |
| `DELETE` | `/profiles/groups` |  |  |
| `POST` | `/profiles/groups` |  |  |
| `POST` | `/profiles/merge` |  |  |
<!-- generated:vald-profiles-endpoints end -->

## VALD Profiles service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

<!-- generated:vald-profiles-health start -->
| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string) | `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalProfile.V1.Models.GetDiagnosticsResponse` |
<!-- generated:vald-profiles-health end -->

## VALD Profiles: `POST /profiles/import`

Request body: `Vald.Api.ExternalProfile.V1.Models.ImportProfileRequest` (application/json-patch+json); `Vald.Api.ExternalProfile.V1.Models.ImportProfileRequest` (application/json); `Vald.Api.ExternalProfile.V1.Models.ImportProfileRequest` (text/json); `Vald.Api.ExternalProfile.V1.Models.ImportProfileRequest` (application/*+json).

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD Profiles: `GET /profiles/exists`

Parameters:

- `SyncId` (query, string, required)
- `TenantId` (query, string, format uuid, required)

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalProfile.V1.Models.GetProfileExistsResponse`

## VALD Profiles: `GET /profiles/{profileId}`

Parameters:

- `tenantId` (query, string, format uuid, required)
- `profileId` (path, string, format uuid, required)

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalProfile.V1.Models.GetProfileByIdResponse`

## VALD Profiles: `GET /profiles`

Parameters:

- `TenantId` (query, string, format uuid, required)
- `ProfileIds` (query, array of string)
- `SyncId` (query, string)
- `ExternalId` (query, string)
- `ModifiedFromUtc` (query, string, format date-time)
- `GroupId` (query, string, format uuid)

Responses:

- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `200` OK: `Vald.Api.ExternalProfile.V1.Models.GetProfileSearchResponse`

## VALD Profiles: `DELETE /profiles/syncids`

Parameters:

- `tenantId` (query, string, format uuid, required)

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD Profiles: `PUT /profiles/groups`

Request body: `Vald.Api.ExternalProfile.V1.Models.ReplaceProfileGroupsRequest` (application/json-patch+json); `Vald.Api.ExternalProfile.V1.Models.ReplaceProfileGroupsRequest` (application/json); `Vald.Api.ExternalProfile.V1.Models.ReplaceProfileGroupsRequest` (text/json); `Vald.Api.ExternalProfile.V1.Models.ReplaceProfileGroupsRequest` (application/*+json).

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD Profiles: `DELETE /profiles/groups`

Request body: `Vald.Api.ExternalProfile.V1.Models.DeleteProfileGroupsRequest` (application/json-patch+json); `Vald.Api.ExternalProfile.V1.Models.DeleteProfileGroupsRequest` (application/json); `Vald.Api.ExternalProfile.V1.Models.DeleteProfileGroupsRequest` (text/json); `Vald.Api.ExternalProfile.V1.Models.DeleteProfileGroupsRequest` (application/*+json).

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD Profiles: `POST /profiles/groups`

Request body: `Vald.Api.ExternalProfile.V1.Models.AddProfileGroupsRequest` (application/json-patch+json); `Vald.Api.ExternalProfile.V1.Models.AddProfileGroupsRequest` (application/json); `Vald.Api.ExternalProfile.V1.Models.AddProfileGroupsRequest` (text/json); `Vald.Api.ExternalProfile.V1.Models.AddProfileGroupsRequest` (application/*+json).

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD Profiles: `POST /profiles/merge`

Request body: `Vald.Api.ExternalProfile.V1.Models.MergeProfileRequest` (application/json-patch+json); `Vald.Api.ExternalProfile.V1.Models.MergeProfileRequest` (application/json); `Vald.Api.ExternalProfile.V1.Models.MergeProfileRequest` (text/json); `Vald.Api.ExternalProfile.V1.Models.MergeProfileRequest` (application/*+json).

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `409` Conflict: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD Profiles schemas

The 14 component schemas of the Profiles spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

<!-- generated:vald-profiles-schemas start -->
### `Microsoft.AspNetCore.Mvc.ProblemDetails`

`additionalProperties`: `{}`.

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |

### `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

`additionalProperties`: `{}`.

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `errors` | object (map of array of `string`) |  | yes |
| `type` | `string` |  | yes |
| `title` | `string` |  | yes |
| `status` | `integer` | `int32` | yes |
| `detail` | `string` |  | yes |
| `instance` | `string` |  | yes |

### `Vald.Api.ExternalProfile.V1.DiagnosticsResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalProfile.V1.Models.AddProfileGroupsRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `profileId` | `string` | `uuid` | yes |
| `groupIds` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalProfile.V1.Models.DeleteProfileGroupsRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `profileId` | `string` | `uuid` | yes |
| `groupIds` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalProfile.V1.Models.GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalProfile.V1.DiagnosticsResult` | yes |

### `Vald.Api.ExternalProfile.V1.Models.GetProfileByIdResponse`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `profileId` | `string` | `uuid` |  |  |
| `syncId` | `string` |  | yes |  |
| `givenName` | `string` |  | yes | **Personal data.** |
| `familyName` | `string` |  | yes | **Personal data.** |
| `dateOfBirth` | `string` | `date-time` | yes | **Personal data.** |
| `sex` | `Vald.Api.ExternalProfile.V1.Sex` |  |  | **Personal data.** |
| `email` | `string` |  | yes | **Personal data.** |
| `weightInKg` | `number` | `double` |  | **Personal data.** |
| `heightInCm` | `number` | `double` |  | **Personal data.** |
| `groupIds` | array of `string` | `uuid` | yes |  |
| `externalId` | `string` |  | yes |  |
| `beingMergedWithProfileId` | `string` | `uuid` | yes |  |
| `beingMergedWithProfileExpiryDateUtc` | `string` | `date-time` | yes |  |
| `sport` | `string` |  | yes | **Personal data.** |
| `position` | `string` |  | yes | **Personal data.** |

### `Vald.Api.ExternalProfile.V1.Models.GetProfileExistsResponse`

| Field | Type |
| --- | --- |
| `isExistingProfile` | `boolean` |

### `Vald.Api.ExternalProfile.V1.Models.GetProfileSearchResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `profiles` | array of `Vald.Api.ExternalProfile.V1.Models.GetProfileSearchResponse_ProfileDetail` | yes |

### `Vald.Api.ExternalProfile.V1.Models.GetProfileSearchResponse_ProfileDetail`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `profileId` | `string` | `uuid` |  |  |
| `syncId` | `string` |  | yes |  |
| `givenName` | `string` |  | yes | **Personal data.** |
| `familyName` | `string` |  | yes | **Personal data.** |
| `dateOfBirth` | `string` | `date-time` | yes | **Personal data.** |
| `modifiedDateUtc` | `string` | `date-time` |  |  |
| `externalId` | `string` |  | yes |  |
| `beingMergedWithProfileId` | `string` | `uuid` | yes |  |
| `beingMergedWithProfileExpiryDateUtc` | `string` | `date-time` | yes |  |

### `Vald.Api.ExternalProfile.V1.Models.ImportProfileRequest`

| Field | Type | Format | Nullable | Description |
| --- | --- | --- | --- | --- |
| `dateOfBirth` | `string` | `date-time` | yes | **Personal data.** |
| `email` | `string` |  | yes | **Personal data.** |
| `givenName` | `string` |  | yes | **Personal data.** |
| `familyName` | `string` |  | yes | **Personal data.** |
| `tenantId` | `string` | `uuid` | yes |  |
| `syncId` | `string` |  | yes |  |
| `sex` | `Vald.Api.ExternalProfile.V1.Sex` |  |  | **Personal data.** |
| `externalId` | `string` |  | yes |  |
| `isCreatedByUserOver18YearsOld` | `boolean` |  | yes | **Personal data.** |
| `isGuardianConsentGiven` | `boolean` |  | yes | **Personal data.** |
| `isPhotoVideoConsentGiven` | `boolean` |  | yes | **Personal data.** |

### `Vald.Api.ExternalProfile.V1.Models.MergeProfileRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `fromProfileId` | `string` | `uuid` | yes |
| `toProfileId` | `string` | `uuid` | yes |

### `Vald.Api.ExternalProfile.V1.Models.ReplaceProfileGroupsRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `profileId` | `string` | `uuid` | yes |
| `groupIds` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalProfile.V1.Sex`

Type `string`.

| Value |
|---|
| `Male` |
| `Female` |
| `Unknown` |
| `NotApplicable` |
<!-- generated:vald-profiles-schemas end -->
