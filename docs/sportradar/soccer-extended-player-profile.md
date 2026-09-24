---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-player-profile
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Player Profile

**Soccer Extended Player Profile** provides player information, including current and historical team membership info.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Building Player Views
>
> Learn how to use the Player Profile for player bios and career history in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Competitor

> Competitor data is present in the `competitors` XML node for the player's current teams. It is also present within the `roles` XML node for the player's past teams.

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitors` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `competitors` - `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `competitors` - `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `competitors` - `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `competitors` - `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitors` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitors` - `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `player` | String | Country code of a player<br /><br />ex. `EGY` (Egypt) |
| `country_of_birth` | `player` | String | Birth country of a player<br /><br />ex. `Egypt` |
| `date_of_birth` | `player` | Date | Date of birth of a player<br /><br />ex. `1992-06-15` |
| `gender` | `player` | String | Gender of a player<br /><br />`male`, `female` |
| `height` | `player` | Integer | Height of a player in centimeters<br /><br />ex. `175` |
| `id` | `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `jersey_number` | `player` | Integer | Jersey number of a player |
| `name` | `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `nationality` | `player` | String | Nationality of a player<br /><br />ex. `Egypt` |
| `nickname` | `player` | String | Nickname of a player |
| `place_of_birth` | `player` | String | Place of birth of a player<br /><br />ex. `Basyoun, El Gharbia` |
| `preferred_foot` | `player` | String | Preferred foot of a player<br /><br />`left`, `right` |
| `type` | `player` | String | Position of a player<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward` |
| `weight` | `player` | Integer | Weight of a player in kilograms<br /><br />ex. `71` |

### Team Membership

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `active` | `role` | Boolean | Signifies a player is currently active with the child `competitor` team when `true` |
| `end_date` | `role` | String | Player's end date with the child `competitor` team<br /><br />ex. `2016-06-30 00:00:00` |
| `jersey_number` | `role` | Integer | Jersey number of a player with the child `competitor` team |
| `type` | `player` | String | Position of a player with the child `competitor` team<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward`, `team_captain` |
| `start_date` | `role` | String | Player's start date with the child `competitor` team<br /><br />ex. `2014-01-26 00:00:00` |
