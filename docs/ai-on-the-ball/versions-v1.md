---
source_url: https://docs.aiontheball.nl/versions/v1/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.558Z
---
# API Overview

Version 1 of the match analysis API: video management, analysis creation and every result an analysis produces.

## Base URL

```
https://aiontheball.nl/api/v1/
```

Every request carries a bearer token, see [Authentication](https://docs.aiontheball.nl/versions/v1/authentication/index.md):

```
Authorization: Bearer YOUR_API_TOKEN
Accept: application/json
```

All responses are JSON. A successful request returns HTTP 200, except `DELETE /videos/{id}`, which returns 204.

## Endpoints

### Videos and analyses

| Endpoint                                                                                                   | Method | Description                                                      |
| ---------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| [`/videos`](https://docs.aiontheball.nl/versions/v1/endpoints/videos/index.md)                             | GET    | List all videos                                                  |
| [`/videos`](https://docs.aiontheball.nl/versions/v1/endpoints/videos/#create-video)                        | POST   | Create a video from a public URL                                 |
| [`/videos/{id}`](https://docs.aiontheball.nl/versions/v1/endpoints/videos/#get-video)                      | GET    | Video details and status                                         |
| [`/videos/{id}`](https://docs.aiontheball.nl/versions/v1/endpoints/videos/#update-video)                   | PUT    | Update video metadata                                            |
| [`/videos/{id}`](https://docs.aiontheball.nl/versions/v1/endpoints/videos/#delete-video)                   | DELETE | Delete the video and every analysis on it                        |
| [`/videos/{id}/preview-teams`](https://docs.aiontheball.nl/versions/v1/endpoints/preview-teams/index.md)   | GET    | Kit colours and player crops detected before analysis            |
| [`/videos/{id}/meta`](https://docs.aiontheball.nl/versions/v1/endpoints/game-meta/#read-the-game-meta)     | GET    | Read the resolved game-meta envelope                             |
| [`/videos/{id}/embed-token`](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md) | POST   | Mint a token for the confirm-sides widget                        |
| [`/videos/{id}/analysis`](https://docs.aiontheball.nl/versions/v1/endpoints/create-analysis/index.md)      | POST   | Create an analysis for a video                                   |
| [`/analyses/{id}`](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/index.md)                    | GET    | Analysis status, progress and quality                            |
| [`/analyses/{id}/team-mapping`](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) | GET    | Resolve `team_0` / `team_1` to home/away, names, roles and sides |

### Account

| Endpoint                                                                                 | Method | Description                                            |
| ---------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| [`/account/credits`](https://docs.aiontheball.nl/versions/v1/endpoints/credits/index.md) | GET    | Credit balance and the longest video one credit covers |

### Results

| Endpoint                                                                                                               | Method | Description                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| [`/analyses/{id}/events`](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md)                           | GET    | Every detected event, as timed rows                                                                |
| [`/analyses/{id}/summary`](https://docs.aiontheball.nl/versions/v1/endpoints/summary/index.md)                         | GET    | Match summary: possession, player identities and player statistics                                 |
| [`/analyses/{id}/player-report/{player_id}`](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) | GET    | Per-player report: coverage, physical, position, on-ball, interactions                             |
| [`/analyses/{id}/team-report`](https://docs.aiontheball.nl/versions/v1/endpoints/team-report/index.md)                 | GET    | Per-team report: average positions, possession, territory, kits, quality                           |
| [`/analyses/{id}/query-intervals`](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md)         | POST   | Time intervals matching a [filter](https://docs.aiontheball.nl/versions/v1/filters/index.md) query |
| [`/analyses/{id}/tracking/download`](https://docs.aiontheball.nl/versions/v1/endpoints/tracking/index.md)              | GET    | Raw player and ball positions as Parquet or JSON                                                   |
| [`/analyses/{id}/schema`](https://docs.aiontheball.nl/versions/v1/endpoints/schema/index.md)                           | GET    | Event types and metadata fields the analysis carries                                               |
| [`/analyses/{id}/exemplar-crops`](https://docs.aiontheball.nl/versions/v1/endpoints/exemplar-crops/index.md)           | GET    | Player and team appearance crops                                                                   |

## Response format

Video and analysis endpoints wrap their records in a `data` envelope. `team-mapping`, `preview-teams` and `embed-token` return a bare object. Result endpoints return the payload unwrapped, a bare JSON array or object as shown on each endpoint page.

```
{ "data": { ... } }
```

Errors carry `message` for 401 and 403 on every path, for a 404 on an unknown video or analysis id, and for the 504 when a result does not arrive within 15 seconds:

```
{ "message": "Unauthenticated." }
```

Every other error from a result endpoint carries `detail`:

```
{ "detail": "Analysis not found" }
```

## Response codes

| Code | Description                                                                    |
| ---- | ------------------------------------------------------------------------------ |
| 200  | Success                                                                        |
| 204  | Video deleted                                                                  |
| 400  | Request rejected by a validation rule, e.g. a video shorter than 2 minutes     |
| 402  | No credits left on a prepaid account. Buy a pack on the dashboard              |
| 401  | Invalid or missing token                                                       |
| 403  | No access to this video or analysis                                            |
| 404  | Video, analysis or result not found                                            |
| 409  | Video cannot be deleted while an analysis on it is running                     |
| 422  | Invalid request body or query parameter                                        |
| 429  | Rate limit exceeded                                                            |
| 500  | Analysis data could not be loaded                                              |
| 503  | Analysis not finished yet, or its data is temporarily unavailable. Retry later |
| 504  | Result did not arrive in time. Retry later                                     |

## Rate limits

Default limits per account. A `429` is returned when one is exceeded.

| Scope                        | Limit                          |
| ---------------------------- | ------------------------------ |
| `POST /videos`               | 5 per minute, 200 per day      |
| `POST /videos/{id}/analysis` | 10 per 5 minutes, 300 per week |
