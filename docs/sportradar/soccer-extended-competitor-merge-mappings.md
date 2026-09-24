---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitor-merge-mappings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Competitor Merge Mappings

**Soccer Extended Competitor Merge Mappings** provides the valid Sportradar Id in cases when two competitors have been merged into one.<br><br>Entries are retained in this endpoint for one week.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Monitoring Data Changes
>
> Learn how to use Competitor Merge Mappings to keep team IDs current after merges in our [Monitoring Data Changes](https://developer.sportradar.com/soccer/docs/monitoring-data-changes) integration scenario.

***

## Data Points

### Mapping
  | Attribute     | Parent Element | Type   | Description                                                                                                       |
  | ------------- | -------------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
  | `merged_id`   | `mapping`      | String | Competitor ID for a merged profile. This ID will be removed from the API database.<br />ex. `sr:competitor:54131` |
  | `name`        | `mapping`      | String | Competitor name of a merged profile<br />ex. `Liverpool FC`                                                       |
  | `retained_id` | `mapping`      | String | Competitor ID for a retained profile<br />ex. `sr:competitor:2728`                                                |
