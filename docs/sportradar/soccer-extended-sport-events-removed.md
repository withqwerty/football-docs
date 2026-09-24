---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-events-removed
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.200Z
---
# Sport Events Removed

**Soccer Extended Sport Events Removed** provides ids for sport events that have been removed from the API due to an entry error. Ids will remain in the response for 2 weeks.

  ### Update Frequency

  60s Time To Live / Cache

> 📘 Monitoring Data Changes
>
> Learn how to use Sport Events Removed to prune deleted matches from your store in our [Monitoring Data Changes](https://developer.sportradar.com/soccer/docs/monitoring-data-changes) integration scenario.

***

## Data Points

### Sport Event
  | Attribute     | Parent Element        | Type   | Description                                                                |
  | ------------- | --------------------- | ------ | -------------------------------------------------------------------------- |
  | `id`          | `sport_event_removed` | String | Unique ID for a removed sport event<br />ex. `sr:sport_event:43257057`     |
  | `replaced_by` | `sport_event_removed` | String | Unique ID for a replacement sport event<br />ex. `sr:sport_event:43257057` |
