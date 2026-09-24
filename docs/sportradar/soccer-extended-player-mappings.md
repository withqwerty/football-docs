---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-player-mappings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Player Mappings

**Soccer Extended Player Mappings** provides player id mapping between previous versions of the Soccer API.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Resolving IDs Across Products
>
> Learn how to use Player Mappings to connect player IDs across Sportradar products in our [ID Handling](https://developer.sportradar.com/soccer/docs/soccer-ig-id-handling) guide.

***

## Data Points

### Mapping
  | Attribute     | Parent Element | Type   | Description                                                                            |
  | ------------- | -------------- | ------ | -------------------------------------------------------------------------------------- |
  | `external_id` | `mapping`      | String | Unique League Specific ID of a player <br />ex. `48a43e67-24eb-4b51-8c76-dfe856c4727f` |
  | `id`          | `mapping`      | String | Unique General Sport ID of a player <br />ex. `sr:player:186047`                       |
