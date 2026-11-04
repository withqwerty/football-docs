---
source_url: https://docs.aiontheball.nl/versions/v1/concepts/webhooks/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.562Z
---
# Webhooks

HTTP callbacks sent to a configured URL when an analysis progresses or completes.

## Configuration

A user manages their webhook settings in the dashboard under account settings. An organization administrator can configure webhooks on behalf of a user. Each notification type is enabled or disabled independently. Contact [support@smart11.ai](mailto:support@smart11.ai) for help with setup.

## Delivery

| Property          | Value                                          |
| ----------------- | ---------------------------------------------- |
| Method            | `POST` to the configured URL                   |
| `Content-Type`    | `application/json`                             |
| `User-Agent`      | `AI-on-the-ball`                               |
| Expected response | any 2xx within 10 seconds, connection within 5 |

A payload may be delivered more than once, so handlers must be idempotent. Verify that `analysis_id` belongs to your account before acting on it.

## analysis_done

Sent when an analysis has finished processing.

```
{
  "event": "analysis_done",
  "analysis_id": 1246,
  "status": "done",
  "completion_rate": 100
}
```

| Field             | Type    | Description                                                                                            |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `event`           | string  | Always `analysis_done`                                                                                 |
| `analysis_id`     | integer | Analysis ID, as in [Get Analysis](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/index.md) |
| `status`          | string  | Final status, `done` or `error`                                                                        |
| `completion_rate` | integer | Percentage complete, 100 when done                                                                     |

## analysis_completion_rate

Sent periodically while an analysis is processing.

| Field             | Type    | Description                                                                                            |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `event`           | string  | Always `analysis_completion_rate`                                                                      |
| `analysis_id`     | integer | Analysis ID, as in [Get Analysis](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/index.md) |
| `status`          | string  | Current status, typically `running`                                                                    |
| `completion_rate` | integer | Estimated percentage complete, 0-100                                                                   |
