---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-events-updated
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.200Z
---
# Sport Events Updated

**Soccer Extended Sport Events Updated** provides ids for sport events that have been updated in the last 24 hours.

  ### Update Frequency

  60s Time To Live / Cache

> 📘 Monitoring Data Changes
>
> Learn how to use Sport Events Updated to refresh only what changed in our [Monitoring Data Changes](https://developer.sportradar.com/soccer/docs/monitoring-data-changes) integration scenario.

***

## Data Points

### Sport Event

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id`         | `sport_event_updated` | String    | Unique ID for an updated sport event<br /><br />ex. `sr:sport_event:43257057`   |
| `updated_at` | `sport_event_updated` | Date-time | Timestamp for an updated sport event<br /><br />ex. `2024-04-22T15:28:44+00:00` |
