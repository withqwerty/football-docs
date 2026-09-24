---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-missing-players
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Missing Players

**Soccer Extended Season Missing Players** provides a list of injured and/or missing players for a given season.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Tracking Availability
>
> Learn how to use Season Missing Players to surface injuries and suspensions in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `id` | `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `competitor` - `players` - `player` | String | Unique ID of a missing player<br /><br />ex. `sr:player:791` |
| `name` | `competitor` - `players` - `player` | String | Name of a missing player<br /><br />ex. `Milner, James` |

### Missing

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `start_date` | `competitor` - `players` - `player` | DateTime | Timestamp of a missing player entry<br /><br />ex. `2024-03-01T05:56:33+00:00` |
| `reason` | `competitor` - `players` - `player` | String | Reason for a missing player entry<br /><br />`on_loan`, `injured`, `suspended`, `other` |
| `status` | `competitor` - `players` - `player` | String | Status of a missing player<br /><br />`missing`, `doubtful`, `other` |
| `estimated_return_date` | `competitor` - `players` - `player` | DateTime | Estimated return date for a missing player<br /><br />ex. `2026-08-22T00:00:00+00:00` |
