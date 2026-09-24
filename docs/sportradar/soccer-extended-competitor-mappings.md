---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitor-mappings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Competitor Mappings

**Soccer Extended Competitor Mappings** provides competitor id mapping between previous versions of the Soccer API.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Resolving IDs Across Products
>
> Learn how to use Competitor Mappings to connect team IDs across Sportradar products in our [ID Handling](https://developer.sportradar.com/soccer/docs/soccer-ig-id-handling) guide.

***

## Data Points

### Mapping
  | Attribute     | Parent Element | Type   | Description                                                                                |
  | ------------- | -------------- | ------ | ------------------------------------------------------------------------------------------ |
  | `external_id` | `mapping`      | String | Unique League Specific ID of a competitor <br />ex. `48afd607-eda9-4db8-9125-380bc78612d2` |
  | `id`          | `mapping`      | String | Unique General Sport ID of a competitor <br />ex. `sr:competitor:44`                       |
