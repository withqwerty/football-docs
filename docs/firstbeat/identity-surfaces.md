---
source_type: curated
source_url: https://apidocs.firstbeat.com/assets/api-specification/openapi.json
upstream_version: Firstbeat Cloud API 1.1.0 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# Firstbeat Identity Surfaces

## ID fields in the Firstbeat API

From the spec's schemas and path parameters:

| Entity | ID field | Type in the spec | Where it appears |
|---|---|---|---|
| API consumer | `id` | `string` (36 characters) | `RegisterResponse`; sent as the JWT `iss` claim |
| Account | `accountId` | `string` | `Account`; path parameter on every `/sports/accounts/{accountId}/...` call |
| Athlete | `athleteId` | `integer` | `Athlete`, measurements, results; path parameter |
| Coach | `coachId` | `integer` | `Coach`, `Session`, `Account.authorizedBy` |
| Team | `teamId` | `integer` | `Team`; path parameter |
| Group | `groupId` | `integer` | `Group` (inside `Team.groups`) |
| Measurement | `measurementId` | `integer` | measurements and results; path parameter |
| Session | `sessionId` | `integer` | `Session`, measurements and results; path parameter |
| Lap | `lapId` | `integer` | `SessionLap`, `MeasurementLap`, lap results; path parameter |

Notes from the spec and the documentation pages:

- `accountId` is a string. The spec's example is `"1-1"`; the "Getting Started"
  and "Basic Concepts" pages show values such as `"3-12345"`.
- The `teamId` path parameter takes a team or a group: its description is "Id of
  the team or group" (or "Id of the team/group").
- The "Basic Concepts" page says an athlete "always belongs to exactly one account
  and cannot be shared across multiple accounts".
- Measurement example responses on the "Querying the API" and "Basic Concepts" pages
  show `"sessionId": 0` on measurements. The spec does not say what `0` means.
- `Team.athleteIds`, `Group.athleteIds`, `Session.athleteIds` and
  `SessionLap.athleteIds` are arrays of `integer` athlete IDs.

## Joining Firstbeat data to football data providers

The Firstbeat spec has no field that holds an ID from a football data provider, and
no match or fixture ID. Its time fields are `startTime`, `endTime` (UTC) and
`startTimeLocal`, `endTimeLocal` (local clock time, with offset), all `date-time`.

To join Firstbeat data to match data, a club needs its own mapping:

- Athletes: map `athleteId` (unique within Firstbeat) to the club's player IDs. The
  spec has no external or custom ID field on `Athlete`.
- Games: filter measurements or sessions with `eventType=game` and
  `sportsType=football`, then match on time. `sessionType`, `exerciseType` and
  `notes` are free text.

## Personal data in identity fields

`Athlete` and `Coach` carry `firstName`, `lastName` and `email`. These are personal
data. Do not use them as join keys. The documentation home page asks support
requests to use IDs rather than names "to protect privacy".
