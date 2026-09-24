---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-transfers
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Transfers

**Soccer Extended Season Transfers** provides a list of player transfers for a given season, showing only transfers into the competition. When a player leaves, that move is reflected in the destination competition's season feed rather than this one.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Tracking Transfers
>
> Learn how to use Season Transfers to follow player movement in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `transfer` - `competitors` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `transfer` - `competitors` - `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `transfer` - `competitors` - `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `transfer` - `competitors` - `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `transfer` - `competitors` - `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `transfer` - `competitors` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `transfer` - `competitors` - `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `virtual` | `transfer` - `competitors` - `competitor` | Boolean | Signifies a competitor is a virtual team when `true`. Used for placeholder teams in TBD vs TBD matchups. |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `transfer` - `player` | String | Country code of a player<br /><br />ex. `EGY` (Egypt) |
| `date_of_birth` | `transfer` - `player` | Date | Date of birth of a player<br /><br />ex. `1992-06-15` |
| `gender` | `transfer` - `player` | String | Gender of a player<br /><br />`male`, `female` |
| `height` | `transfer` - `player` | Integer | Height of a player in centimeters<br /><br />ex. `175` |
| `id` | `transfer` - `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `jersey_number` | `transfer` - `player` | Integer | Jersey number of a player |
| `name` | `transfer` - `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `nationality` | `transfer` - `player` | String | Nationality of a player<br /><br />ex. `Egypt` |
| `nickname` | `transfer` - `player` | String | Nickname of a player |
| `place_of_birth` | `transfer` - `player` | String | Place of birth of a player<br /><br />ex. `Basyoun, El Gharbia` |
| `preferred_foot` | `transfer` - `player` | String | Preferred foot of a player<br /><br />`left`, `right` |
| `type` | `transfer` - `player` | String | Position of a player<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward` |
| `weight` | `transfer` - `player` | Integer | Weight of a player in kilograms<br /><br />ex. `71` |

### Transfer

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `transfer_date` | `transfer` | Date | Transfer date of a player transfer<br /><br />ex. `2024-02-01` |
| `role_type` | `transfer` | String | Player's role for transfer<br /><br />`player`, `manager`, `on_loan`, `unemployed`, `other` |
| `from_competitor` | `transfer` | String | Unique ID of the competitor a player transferred from<br /><br />ex. `sr:competitor:2383` |
| `to_competitor` | `transfer` | String | Unique ID of the competitor a player transferred to<br /><br />ex. `sr:competitor:2383` |
