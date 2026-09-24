---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-events-created
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.199Z
---
# Sport Events Created

**Soccer Extended Sport Events Created** provides ids for sport events that have been created in the last 24 hours.

  ### Update Frequency

  60s Time To Live / Cache

> 📘 Monitoring Data Changes
>
> Learn how to use Sport Events Created to detect newly added matches in our [Monitoring Data Changes](https://developer.sportradar.com/soccer/docs/monitoring-data-changes) integration scenario.

***

## Data Points

### Sport Event
  | Attribute       | Parent Element        | Type      | Description                                                              |
  | --------------- | --------------------- | --------- | ------------------------------------------------------------------------ |
  | `id`            | `sport_event_created` | String    | Unique ID for a created sport event<br />ex. `sr:sport_event:49626999`   |
  | `created_at`    | `sport_event_created` | Date-time | Timestamp for a created sport event<br />ex. `2024-04-22T15:28:44+00:00` |
  | `active_season` | `sport_event_created` | Boolean   | Signifies a created sport event is within an active season when `true`   |
