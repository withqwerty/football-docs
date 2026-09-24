---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-player-merge-mappings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Player Merge Mappings

**Soccer Extended Player Merge Mappings** provides valid ids for players who have had their profiles merged. While Sportradar always strives to provide one unique player id, it is a possibility for two ids to be created. This feed provides the correct id once profiles have been merged.<br><br>Entries are retained in this endpoint for one week.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Monitoring Data Changes
>
> Learn how to use Player Merge Mappings to keep player IDs current after merges in our [Monitoring Data Changes](https://developer.sportradar.com/soccer/docs/monitoring-data-changes) integration scenario.

***

## Data Points

### Mapping
  | Attribute     | Parent Element | Type   | Description                                                                                                 |
  | ------------- | -------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
  | `merged_id`   | `mapping`      | String | Player ID for a merged profile. This ID will be removed from the API database.<br />ex. `sr:player:2771499` |
  | `name`        | `mapping`      | String | Player name of a merged profile<br />ex. `Abduweli, Behram`                                                 |
  | `retained_id` | `mapping`      | String | Player ID for a retained profile<br />ex. `sr:player:2333063`                                               |
