---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitions
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Competitions

**Soccer Extended Competitions** provides a list of all available Soccer competitions.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Loading the Competition Catalog
>
> Learn how to use the Competitions feed to discover leagues and cups and collect competition IDs in our [Fixtures (Schedules)](https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures) integration scenario.

***

## Data Points

### Category & Sport

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `competition` - `category` | String | Country code for a competition category<br /><br />ex. `ENG` (England) |
| `id` | `competition` - `category` | String | Unique category ID for a competition<br /><br />ex. `sr:category:1` |
| `name` | `competition` - `category` | String | Name for a competition category<br /><br />ex. `England` (Premier League) |

### Competition

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `alternative_name` | `competition` | String | Alternate name of a competition<br /><br />ex. `English Premier League` (instead of `Premier League`) |
| `gender` | `competition` | String | Gender for a competition<br /><br />ex. `men` |
| `id` | `competition` | String | Unique ID for a competition<br /><br />ex. `sr:competition:17` (Premier League) |
| `name` | `competition` | String | Name of a competition<br /><br />ex. `Premier League` |
| `parent_id` | `competition` | String | Unique parent ID for a competition. Typically present for group stage or playoff competitions <br /><br />ex. `sr:competition:945` used to link competitions together, like the World Cup and the various qualifiers. |
