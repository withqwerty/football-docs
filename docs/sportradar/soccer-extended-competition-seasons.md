---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competition-seasons
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Competition Seasons

**Soccer Extended Competition Seasons** provides historical season information for a given competition. Valid competition IDs can be found in the Competitions feed.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Resolving Seasons
>
> Learn how to use Competition Seasons to resolve a competition's current season in our [Fixtures (Schedules)](https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures) integration scenario.

## Data Points

### Competition

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `competition_id` | `season` | String | Unique ID for the competition a season belongs to<br /><br />ex. `sr:competition:17` (Premier League) |
| `disabled` | `season` | Boolean | Signifies a season has been disabled when `true` |
| `end_date` | `season` | Date | End date of a season<br /><br />ex. `2024-05-19` |
| `id` | `season` | String | Unique ID for a season<br /><br />ex. `sr:season:105353` (Premier League 23/24) |
| `name` | `season` | String | Name of a season<br /><br />ex. `Premier League 23/24` |
| `start_date` | `season` | Date | Start date of a season<br /><br />ex. `2023-08-11` |
| `year` | `season` | String | Year of a season<br /><br />ex. `23/24` |
