---
source_type: curated
source_url: https://prd-euw-api-externaltenants.valdperformance.com/swagger/v1/swagger.json
upstream_version: Vald.Api.ExternalTenants.V1 v1 (OpenAPI 3.0.4)
crawled_at: 2026-09-30
---

# VALD Tenants API

## VALD Tenants API host and specification

- Host: `https://prd-<region>-api-externaltenants.valdperformance.com`, where `<region>` is
  `euw`, `use` or `aue` (see VALD API access).
- Specification: `https://prd-<region>-api-externaltenants.valdperformance.com/swagger/v1/swagger.json`
  (OpenAPI 3.0.4, `info.title` "Vald.Api.ExternalTenants.V1", `info.version` "v1").
- Local snapshot: `specs/vald/externaltenants.json` (the `euw` copy).
- Security: `OAuth2`, OAuth2 client credentials, token URL `https://auth.prd.vald.com/oauth/token`, `audience` "vald-api-external". The spec applies it to every operation.
- The spec declares no `servers`. Its 53 schema fields have no descriptions.

## VALD Tenants endpoints

| Method | Path | Summary | Deprecated |
|---|---|---|---|
| `GET` | `/categories` |  |  |
| `GET` | `/categories/{categoryId}` |  |  |
| `POST` | `/categories/import` |  |  |
| `GET` | `/version` |  |  |
| `GET` | `/liveness` |  |  |
| `GET` | `/readiness` |  |  |
| `GET` | `/diagnostics` |  |  |
| `GET` | `/groups` |  |  |
| `GET` | `/groups/{groupId}` |  |  |
| `DELETE` | `/groups/{groupId}` |  |  |
| `POST` | `/groups/import` |  |  |
| `PUT` | `/groups/profiles` |  |  |
| `DELETE` | `/groups/profiles` |  |  |
| `GET` | `/tenants` |  |  |
| `GET` | `/tenants/{tenantId}` |  |  |
| `DELETE` | `/tenants/{tenantId}/syncids` |  |  |

## VALD Tenants service health endpoints

`/version`, `/liveness`, `/readiness` and `/diagnostics` report on the service itself, not on athlete data.

| Endpoint | Parameters | Responses |
|---|---|---|
| `GET /version` |  | `200` OK: `string` |
| `GET /liveness` |  | `204` No Content |
| `GET /readiness` |  | `204` No Content<br>`503` Service Unavailable |
| `GET /diagnostics` | `Diagnostics-Key` (header, string, required) | `401` Unauthorized: `Microsoft.AspNetCore.Mvc.ProblemDetails`<br>`200` OK: `Vald.Api.ExternalTenants.V1.Models.GetDiagnosticsResponse` |

## VALD Tenants: `GET /categories`

Parameters:

- `TenantId` (query, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalTenants.V1.Models.GetCategoriesResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `GET /categories/{categoryId}`

Parameters:

- `categoryId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalTenants.V1.Models.GetCategoryResponse`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `POST /categories/import`

Request body: `Vald.Api.ExternalTenants.V1.Models.ImportCategoryRequest` (application/json-patch+json); `Vald.Api.ExternalTenants.V1.Models.ImportCategoryRequest` (application/json); `Vald.Api.ExternalTenants.V1.Models.ImportCategoryRequest` (text/json); `Vald.Api.ExternalTenants.V1.Models.ImportCategoryRequest` (application/*+json).

Responses:

- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`
- `403` Forbidden: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `204` No Content

## VALD Tenants: `GET /groups`

Parameters:

- `TenantId` (query, string, format uuid, required)
- `SyncId` (query, string)

Responses:

- `200` OK: `Vald.Api.ExternalTenants.V1.Models.GetGroupsResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `GET /groups/{groupId}`

Parameters:

- `groupId` (path, string, format uuid, required)
- `tenantId` (query, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalTenants.V1.Models.GetGroupResponse`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `DELETE /groups/{groupId}`

Parameters:

- `tenantId` (query, string, format uuid, required)
- `groupId` (path, string, format uuid, required)

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `POST /groups/import`

Request body: `Vald.Api.ExternalTenants.V1.Models.ImportGroupRequest` (application/json-patch+json); `Vald.Api.ExternalTenants.V1.Models.ImportGroupRequest` (application/json); `Vald.Api.ExternalTenants.V1.Models.ImportGroupRequest` (text/json); `Vald.Api.ExternalTenants.V1.Models.ImportGroupRequest` (application/*+json).

Responses:

- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `PUT /groups/profiles`

Request body: `Vald.Api.ExternalTenants.V1.Models.ReplaceProfilesInGroupRequest` (application/json-patch+json); `Vald.Api.ExternalTenants.V1.Models.ReplaceProfilesInGroupRequest` (application/json); `Vald.Api.ExternalTenants.V1.Models.ReplaceProfilesInGroupRequest` (text/json); `Vald.Api.ExternalTenants.V1.Models.ReplaceProfilesInGroupRequest` (application/*+json).

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `DELETE /groups/profiles`

Request body: `Vald.Api.ExternalTenants.V1.Models.DeleteProfilesInGroupRequest` (application/json-patch+json); `Vald.Api.ExternalTenants.V1.Models.DeleteProfilesInGroupRequest` (application/json); `Vald.Api.ExternalTenants.V1.Models.DeleteProfilesInGroupRequest` (text/json); `Vald.Api.ExternalTenants.V1.Models.DeleteProfilesInGroupRequest` (application/*+json).

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `GET /tenants`

Responses:

- `200` OK: `Vald.Api.ExternalTenants.V1.Models.GetTenantsResponse`
- `204` No Content
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `GET /tenants/{tenantId}`

Parameters:

- `tenantId` (path, string, format uuid, required)

Responses:

- `200` OK: `Vald.Api.ExternalTenants.V1.Models.GetTenantResponse`
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`
- `400` Bad Request: `Microsoft.AspNetCore.Mvc.ValidationProblemDetails`

## VALD Tenants: `DELETE /tenants/{tenantId}/syncids`

Parameters:

- `tenantId` (path, string, format uuid, required)

Responses:

- `204` No Content
- `404` Not Found: `Microsoft.AspNetCore.Mvc.ProblemDetails`

## VALD Tenants schemas

The 18 component schemas of the Tenants spec, in spec order. No field has a description in the spec. Fields marked **Personal data** hold data about an identifiable person; body measures are health data.

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

### `Vald.Api.ExternalTenants.V1.DiagnosticsResult`

| Field | Type | Nullable |
| --- | --- | --- |
| `key` | `string` | yes |
| `isOk` | `boolean` |  |
| `message` | `string` | yes |

### `Vald.Api.ExternalTenants.V1.Models.DeleteProfilesInGroupRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `groupId` | `string` | `uuid` | yes |
| `profileIds` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetCategoriesResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `categories` | array of `Vald.Api.ExternalTenants.V1.Models.GetCategoriesResponse_Category` | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetCategoriesResponse_Category`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `syncId` | `string` |  | yes |
| `name` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetCategoryResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `syncId` | `string` |  | yes |
| `name` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetDiagnosticsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `machineName` | `string` | yes |
| `results` | array of `Vald.Api.ExternalTenants.V1.DiagnosticsResult` | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetGroupResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `categoryId` | `string` | `uuid` |  |
| `name` | `string` |  | yes |
| `syncId` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetGroupsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `groups` | array of `Vald.Api.ExternalTenants.V1.Models.GetGroupsResponse_Group` | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetGroupsResponse_Group`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `name` | `string` |  | yes |
| `categoryId` | `string` | `uuid` |  |
| `syncId` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetTenantResponse`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `name` | `string` |  | yes |
| `sport` | `Vald.Api.ExternalTenants.V1.Sport` |  |  |
| `league` | `string` |  | yes |
| `logoUri` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetTenantsResponse`

| Field | Type | Nullable |
| --- | --- | --- |
| `tenants` | array of `Vald.Api.ExternalTenants.V1.Models.GetTenantsResponse_Tenant` | yes |

### `Vald.Api.ExternalTenants.V1.Models.GetTenantsResponse_Tenant`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `id` | `string` | `uuid` |  |
| `name` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.ImportCategoryRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `syncId` | `string` |  | yes |
| `tenantId` | `string` | `uuid` | yes |
| `name` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.ImportGroupRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `syncId` | `string` |  | yes |
| `categoryId` | `string` | `uuid` | yes |
| `name` | `string` |  | yes |

### `Vald.Api.ExternalTenants.V1.Models.ReplaceProfilesInGroupRequest`

| Field | Type | Format | Nullable |
| --- | --- | --- | --- |
| `tenantId` | `string` | `uuid` | yes |
| `groupId` | `string` | `uuid` | yes |
| `profileIds` | array of `string` | `uuid` | yes |

### `Vald.Api.ExternalTenants.V1.Sport`

Type `string`.

| Value |
|---|
| `AmericanFootball` |
| `AustralianRulesFootball` |
| `Badminton` |
| `Baseball` |
| `Basketball` |
| `BeachVolleyball` |
| `Bowling` |
| `Boxing` |
| `Climbing` |
| `Clinic` |
| `Cricket` |
| `Cycling` |
| `Dance` |
| `Diving` |
| `FieldHockey` |
| `FootballSoccer` |
| `GaelicFootball` |
| `Golf` |
| `Gymnastics` |
| `Handball` |
| `HorseRacing` |
| `IceHockey` |
| `Lacrosse` |
| `MartialArts` |
| `MotorRacing` |
| `MountainBiking` |
| `MultiSports` |
| `Netball` |
| `Recreational` |
| `Research` |
| `Rowing` |
| `RugbyLeague` |
| `RugbyUnion` |
| `Sailing` |
| `Skateboarding` |
| `Skating` |
| `Skiing` |
| `Softball` |
| `Sumo` |
| `Surfing` |
| `Swimming` |
| `TableTennis` |
| `Tennis` |
| `TrackField` |
| `Triathlon` |
| `University` |
| `Volleyball` |
| `Weightlifting` |
| `Wrestling` |
| `Other` |
| `Hurling` |
| `Fencing` |
| `Aerospace` |
| `AlliedHealth` |
| `Circus` |
| `CorporateWellnessProgram` |
| `CrossFit` |
| `DemoHealth` |
| `DemoSport` |
| `FirstResponders` |
| `GoverningBody` |
| `Gym` |
| `Hospital` |
| `Individual` |
| `Military` |
| `MMA` |
| `MultiAthlete` |
| `MultiSportCollege` |
| `MultiSportInstitute` |
| `OccupationalTherapy` |
| `Orthopaedic` |
| `PersonalTraining` |
| `Athletics` |
| `Marathon` |
| `WaterPolo` |
| `Unknown` |
