---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-players
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Players

**Soccer Extended Season Players** provides names and ids for all participating players for a given season.<br /><br /><i>Note: Historical team associations are not retained. This endpoint always returns the current players of a squad.</i>

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Managing Rosters
>
> Learn how to use Season Players to load every player appearing in a season in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `display_first_name` | `player` | String | Display first name of a player<br /><br />ex. `Mohamed` |
| `display_last_name` | `player` | String | Display last name of a player<br /><br />ex. `Salah` |
| `first_name` | `player` | String | Display last name of a player<br /><br />ex. `Mohamed Salah Hamed` |
| `id` | `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `jersey_number` | `player` | Integer | Jersey number of a player |
| `last_name` | `player` | String | Last name of a player<br /><br />ex. `Mahrous Ghaly` |
| `name` | `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `type` | `player` | String | Position of a player<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward` |
