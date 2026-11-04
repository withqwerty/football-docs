---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/credits/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.558Z
---
# Prepaid credits

Self-service accounts are prepaid. Sign up on the AI on the Ball home page, buy a pack of 3, 10 or 25 analysis credits, and create your API key on the dashboard. The analysis log lists every analysis you ran and your purchases; volume pricing above 25 credits via support@smart11.ai.

```
GET /v1/account/credits
```

```
{ "prepaid": true, "credits": 7, "max_video_seconds": 7200 }
```

## How credits are spent

- Starting an analysis (`POST /v1/videos/{id}/analysis`) spends **one credit**.
- If the analysis ends in `error` or `no_match_detected`, the credit is **returned automatically**.
- A credit covers one video of up to `max_video_seconds` (2 hours).

## Errors

Registering a video (`POST /v1/videos`) with 0 credits returns `402`.

When starting an analysis:

| Status | Meaning                                                       |
| ------ | ------------------------------------------------------------- |
| `402`  | No credits left. Buy another pack.                            |
| `422`  | The video is longer than `max_video_seconds`.                 |
| `429`  | Two analyses are already in progress. Wait for one to finish. |

Accounts on a contract are not prepaid: `prepaid` is `false` and no credits are spent.
