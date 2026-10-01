---
source_type: curated
source_url: https://apidocs.firstbeat.com/assets/api-specification/openapi.json
upstream_version: Firstbeat Cloud API 1.1.0 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# Firstbeat API Endpoints

## Endpoint inventory

All 20 operations in the Firstbeat Cloud API spec (`info.version`
"1.1.0"). The server in the spec is `https://api.firstbeat.com/v1`, so
`GET /sports/accounts` is called as `https://api.firstbeat.com/v1/sports/accounts`.

<!-- generated:firstbeat-endpoint-inventory start -->
| Method | Path | Tag | Summary |
|---|---|---|---|
| `POST` | `/account/register` | account | Register as an API consumer |
| `GET` | `/account/api-key` | account | Request an API key |
| `GET` | `/account/new-secret` | account | Get a new shared secret |
| `POST` | `/account/new-secret/confirm` | account | Confirm new shared secret |
| `GET` | `/sports/accounts` | sports | Get accounts |
| `GET` | `/sports/sports-types` | sports | Get possible values of sportsType |
| `GET` | `/sports/event-types` | sports | Get possible values of eventType |
| `GET` | `/sports/accounts/{accountId}/athletes` | sports | Get list of athletes |
| `GET` | `/sports/accounts/{accountId}/athletes/{athleteId}` | sports | Get athlete |
| `GET` | `/sports/accounts/{accountId}/athletes/{athleteId}/measurements` | sports | Get athlete measurements |
| `GET` | `/sports/accounts/{accountId}/athletes/{athleteId}/measurements/{measurementId}/results` | sports | Get athlete measurement results |
| `GET` | `/sports/accounts/{accountId}/athletes/{athleteId}/measurements/{measurementId}/laps/{lapId}/results` | sports | Get athlete measurement lap results |
| `GET` | `/sports/accounts/{accountId}/coaches` | sports | Get coaches |
| `GET` | `/sports/accounts/{accountId}/coaches/{coachId}` | sports | Get coach |
| `GET` | `/sports/accounts/{accountId}/teams` | sports | Get teams |
| `GET` | `/sports/accounts/{accountId}/teams/{teamId}` | sports | Get team |
| `GET` | `/sports/accounts/{accountId}/teams/{teamId}/athletes` | sports | Get team athletes |
| `GET` | `/sports/accounts/{accountId}/teams/{teamId}/sessions` | sports | Get team sessions |
| `GET` | `/sports/accounts/{accountId}/teams/{teamId}/sessions/{sessionId}/results` | sports | Get session results |
| `GET` | `/sports/accounts/{accountId}/teams/{teamId}/sessions/{sessionId}/laps/{lapId}/results` | sports | Get session lap results |
<!-- generated:firstbeat-endpoint-inventory end -->

## `POST /account/register`

Register as an API consumer. Register as a new API consumer using a name that uniquely and unambiguously identifies you or your organization

Request body (required): `Register` (*/*). Described as "Created API Consumer object".

Responses:

- `200` Successful operation: `RegisterResponse`
- `400` Invalid payload supplied

## `GET /account/api-key`

Request an API key. Retrieve consumer specific API key needed to access other endpoints

Parameters:

- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN

Responses:

- `200` Successful operation: `ApiKey`
- `401` Unauthorized. Check token validity.

## `GET /account/new-secret`

Get a new shared secret. Retrieve a new shared secret that must be confirmed using /account/new-secret/confirm endpoint before it can be used for other purposes

Parameters:

- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `SharedSecret`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check x-api-key header.
- `429` Rate Limit Exceeded

## `POST /account/new-secret/confirm`

Confirm new shared secret. Confirm your possession of a new shared secret and invalidate the previous shared secret

Parameters:

- `Authorization` (header, string, required) — Use the new shared secret to generate the token. Format: Bearer NEW_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check x-api-key header.
- `429` Rate Limit Exceeded

## `GET /sports/accounts`

Get accounts. Get Firstbeat Sports accounts linked to your API consumer

Parameters:

- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Accounts`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check x-api-key header.
- `429` Rate Limit Exceeded

## `GET /sports/sports-types`

Get possible values of sportsType. Get possible values for field sportsType in measurements and sessions

Parameters:

- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: array of `string`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check x-api-key header.
- `429` Rate Limit Exceeded

The spec's example for the `200` response: `football`, `americanFootball`, `rugbySevens`, `rugbyUnion`, `rugbyLeague`, `fieldHockey`, `iceHockey`, `ringette`, `baseball`, `basketball`, `futsal`, `volleyball`, `beachVolleyball`, `floorball`, `handball`, `lacrosse`, `softball`, `gaelicFootball`, `australianFootball`, `cricket`, `tennis`, `badminton`, `squash`, `ultimate`, `trailRunning`, `running`, `treadmillRunning`, `orienteering`, `strength`, `cardio`, `xcSkiing`, `biathlon`, `roadCycling`, `indoorCycling`, `mountainBiking`, `bmx`, `alpineSkiing`, `swimming`, `walking`, `nordicWalking`, `snowboarding`, `rowing`, `mountaineering`, `hiking`, `multisport`, `triathlon`, `golf`, `inlineSkating`, `climbing`, `iceSkating`, `taekwondo`, `boxing`, `figureSkating`, `gymnastics`, `kayaking`, `mma`, `rollerskating`, `trackAndField`, `wheelchairBasketball`, `wrestling`.

## `GET /sports/event-types`

Get possible values of eventType. Get possible values for field eventType in measurements and sessions

Parameters:

- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: array of `string`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check x-api-key header.
- `429` Rate Limit Exceeded

The spec's example for the `200` response: `race`, `game`, `rehab`, `recovery`, `training`.

## `GET /sports/accounts/{accountId}/athletes`

Get list of athletes. Get athletes that belong to the specified account

Parameters:

- `accountId` (path, string, required) — Id of the account
- `offset` (query, number) — Skip a number of first items in the response
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Athletes`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/athletes/{athleteId}`

Get athlete. Get athlete

Parameters:

- `accountId` (path, string, required) — Id of the account
- `athleteId` (path, integer, required) — Id of the athlete
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Athlete`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/athletes/{athleteId}/measurements`

Get athlete measurements. List all measurements of an athlete

Parameters:

- `accountId` (path, string, required) — Id of the account
- `athleteId` (path, integer, required) — Id of the athlete
- `fromTime` (query, string, format date-time) — Limit the response to measurements that start earliest at specified time
- `toTime` (query, string, format date-time) — Limit the response to measurements that start before specified time
- `exerciseType` (query, string) — Limit the response to measurements of specified exercise type, also known as title
- `measurementType` (query, string) values `exercise`, `quickRecoveryTest`, `night`, `manual` — Limit the response to measurements of specified measurement type
- `sportsType` (query, string) — Limit the response to measurements of specified sports. To make a single query for more than one sports, pass them as a comma-separated list. See Sports Type and Event Type for possible values.
- `eventType` (query, string) — Limit the response to measurements from a specific type of event. To make a single query for more than one event type, pass them as a comma-separated list. See Sports Type and Event Type for possible values.
- `offset` (query, number) — Skip a number of first items in the response
- `includeLaps` (query, boolean) — Include laps in the response
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Measurements`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/athletes/{athleteId}/measurements/{measurementId}/results`

Get athlete measurement results. Get athlete measurement results

Parameters:

- `accountId` (path, string, required) — Id of the account
- `athleteId` (path, integer, required) — Id of the athlete
- `var` (query, string) — Specify names of requested variables in a comma-separated string
- `format` (query, string) values `binary`, `list` — Request time series either as binary data or JSON lists of numbers
- `measurementId` (path, integer, required) — Id of the measurement
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `AthleteMeasurementResults`
- `202` Accepted. Analysis job is in progress. You should wait 5 seconds and then run the same request again.
- `204` No Content. Analysis job has failed.
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `413` Response Too Large
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/athletes/{athleteId}/measurements/{measurementId}/laps/{lapId}/results`

Get athlete measurement lap results. Get analysis results for lap in athlete's measurement

Parameters:

- `accountId` (path, string, required) — Id of the account
- `athleteId` (path, integer, required) — Id of the athlete
- `measurementId` (path, integer, required) — Id of the measurement
- `lapId` (path, integer, required) — Id of the lap
- `var` (query, string) — Specify names of requested variables in a comma-separated string
- `format` (query, string) values `binary`, `list` — Request time series either as binary data or JSON lists of numbers
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `AthleteMeasurementLapResults`
- `202` Accepted. Analysis job is in progress. You should wait 5 seconds and then run the same request again.
- `204` No Content. Analysis job has failed.
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `413` Response Too Large
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/coaches`

Get coaches. Get all coaches in an account

Parameters:

- `accountId` (path, string, required) — Id of the account
- `offset` (query, number) — Skip a number of first items in the response
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Coaches`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/coaches/{coachId}`

Get coach. Get coach info

Parameters:

- `accountId` (path, string, required) — Id of the account
- `coachId` (path, integer, required) — Id of the coach
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Coach`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/teams`

Get teams. Get all teams and groups in an account

Parameters:

- `accountId` (path, string, required) — Id of the account
- `offset` (query, number) — Skip a number of first items in the response
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Teams`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/teams/{teamId}`

Get team. Get team and its groups

Parameters:

- `accountId` (path, string, required) — Id of the account
- `teamId` (path, integer, required) — Id of the team/group
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Team`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/teams/{teamId}/athletes`

Get team athletes. Get all athletes in a team or group

Parameters:

- `accountId` (path, string, required) — Id of the account
- `teamId` (path, integer, required) — Id of the team or group
- `offset` (query, number) — Skip a number of first items in the response
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Athletes`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/teams/{teamId}/sessions`

Get team sessions. Get all sessions of a team or group

Parameters:

- `accountId` (path, string, required) — Id of the account
- `teamId` (path, integer, required) — Id of the team or group
- `offset` (query, number) — Skip a number of first items in the response
- `fromTime` (query, string, format date-time) — Limit the response to sessions that start earliest at specified time
- `toTime` (query, string, format date-time) — Limit the response to sessions that start before specified time
- `type` (query, string) — Limit the response to sessions of specified type, also known as title
- `sportsType` (query, string) — Limit the response to measurements of specified sports. To make a single query for more than one sports, pass them as a comma-separated list. See Sports Type and Event Type for possible values.
- `eventType` (query, string) — Limit the response to measurements from a specific type of event. To make a single query for more than one event type, pass them as a comma-separated list. See Sports Type and Event Type for possible values.
- `includeLaps` (query, boolean) — Include laps in the response
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `Sessions`
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/teams/{teamId}/sessions/{sessionId}/results`

Get session results. Get session results

Parameters:

- `accountId` (path, string, required) — Id of the account
- `teamId` (path, integer, required) — Id of the team/group
- `sessionId` (path, integer, required) — Id of the session
- `var` (query, string) — Specify names of requested variables in a comma-separated string
- `format` (query, string) values `binary`, `list` — Request time series either as binary data or JSON lists of numbers
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `SessionResults`
- `202` Accepted. Analysis job is in progress. You should wait 5 seconds and then run the same request again.
- `204` No Content. Analysis job has failed.
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `413` Response Too Large
- `429` Rate Limit Exceeded

## `GET /sports/accounts/{accountId}/teams/{teamId}/sessions/{sessionId}/laps/{lapId}/results`

Get session lap results. Get session lap results

Parameters:

- `accountId` (path, string, required) — Id of the account
- `teamId` (path, integer, required) — Id of the team/group
- `sessionId` (path, integer, required) — Id of the session
- `lapId` (path, integer, required) — Id of the lap
- `var` (query, string) — Specify names of requested variables in a comma-separated string
- `format` (query, string) values `binary`, `list` — Request time series either as binary data or JSON lists of numbers
- `Authorization` (header, string, required) — format: Bearer YOUR_TOKEN
- `x-api-key` (header, string, required) — API key received from /account/api-key endpoint

Responses:

- `200` Successful operation: `SessionLapResults`
- `202` Accepted. Analysis job is in progress. You should wait 5 seconds and then run the same request again.
- `204` No Content. Analysis job has failed.
- `401` Unauthorized. Check token validity.
- `403` Forbidden. Check the x-api-key header or whether the account is closed.
- `404` Not found
- `413` Response Too Large
- `429` Rate Limit Exceeded
