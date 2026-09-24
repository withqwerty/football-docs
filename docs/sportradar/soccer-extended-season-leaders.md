---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-leaders
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Leaders

**Soccer Extended Season Leaders** provides a list of leaders for a given season. Statistics include points, goals, assists, cards, and minutes played.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Retrieving Seasonal Statistics
>
> Learn how to use Season Leaders to display top scorers and assist leaders in our [Seasonal Statistics](https://developer.sportradar.com/soccer/docs/soccer-ig-seasonal-stats) integration scenario.

***

## Data Points

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `list` - `leader` - `player` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `id` | `list` - `leader` - `player` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `list` - `leader` - `player` - `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `list` - `leader` - `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `name` | `list` - `leader` - `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `multiple_competitors` | `leader` - `player` | Boolean | Signifies a player has featured for multiple competitors within a season when `true` |

### Season Leaders

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `type` | `list` | String | Type of leader statistic<br /><br />`points`, `goals`, `assists`, `red_cards`, `yellow_red_cards`, `yellow_cards`, `own_goals`, `shots_on_target`, `shots_off_target`, `goals_by_head`, `goals_by_penalty`, `minutes_played` |
| `rank` | `list` - `leader` | Integer | Player rank for a leader statistic |
| `type` | `list` - `leader` - `player` - `competitor` - `datapoint` | String | Type of leader statistic for a player entry<br /><br />`points`, `goals`, `assists`, `red_cards`, `yellow_red_cards`, `yellow_cards`, `own_goals`, `shots_on_target`, `shots_off_target`, `goals_by_head`, `goals_by_penalty`, `minutes_played` |
| `value` | `list` - `leader` - `player` - `competitor` - `datapoint` | Integer | Value of a player's leader statistic |
