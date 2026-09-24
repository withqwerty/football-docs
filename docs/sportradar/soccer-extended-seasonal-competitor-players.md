---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-seasonal-competitor-players
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.197Z
---
# Seasonal Competitor Players

**Soccer Extended Seasonal Competitor Players** provides player roster information for every team from a given season.<br /><br /><i>Note: Historical team associations are not retained. This endpoint always returns the current players of a squad.</i>

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Managing Rosters
>
> Learn how to use Seasonal Competitor Players to load per-team squads in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Competitor
  | Attribute      | Parent Element | Type   | Description                                                                 |
  | -------------- | -------------- | ------ | --------------------------------------------------------------------------- |
  | `abbreviation` | `competitor`   | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC)      |
  | `id`           | `competitor`   | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
  | `name`         | `competitor`   | String | Name for a competitor<br /><br />ex. `Liverpool FC`                         |
  | `short_name`   | `competitor`   | String | Name for a competitor<br /><br />ex. `Liverpool`                            |

### Player
  | Attribute                 | Parent Element          | Type    | Description                                                                                   |
  | ------------------------- | ----------------------- | ------- | --------------------------------------------------------------------------------------------- |
  | `country_code`            | `competitor` - `player` | String  | Country code of a player<br /><br />ex. `EGY` (Egypt)                                         |
  | `date_of_birth`           | `competitor` - `player` | Date    | Date of birth of a player<br /><br />ex. `1992-06-15`                                         |
  | `gender`                  | `competitor` - `player` | String  | Gender of a player<br /><br />`male`, `female`                                                |
  | `height`                  | `competitor` - `player` | Integer | Height of a player in centimeters<br /><br />ex. `175`                                        |
  | `id`                      | `competitor` - `player` | String  | Unique ID of a player<br /><br />ex. `sr:player:159665`                                       |
  | `jersey_number`           | `competitor` - `player` | Integer | Jersey number of a player                                                                     |
  | `loaned_to_competitor_id` | `competitor` - `player` | String  | Unique ID of the competitor a player is currently on loan to<br /><br />ex. `sr:competitor:9` |
  | `name`                    | `competitor` - `player` | String  | Name of a player<br /><br />ex. `Salah, Mohamed`                                              |
  | `nationality`             | `competitor` - `player` | String  | Nationality of a player<br /><br />ex. `Egypt`                                                |
  | `nickname`                | `competitor` - `player` | String  | Nickname of a player                                                                          |
  | `on_loan`                 | `competitor` - `player` | Boolean | Signifies a player is on loan to this team (parent `competitor`) when `true`                  |
  | `place_of_birth`          | `competitor` - `player` | String  | Place of birth of a player<br /><br />ex. `Basyoun, El Gharbia`                               |
  | `preferred_foot`          | `competitor` - `player` | String  | Preferred foot of a player<br /><br />`left`, `right`                                         |
  | `type`                    | `competitor` - `player` | String  | Position of a player<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward`             |
  | `weight`                  | `competitor` - `player` | Integer | Weight of a player in kilograms<br /><br />ex. `71`                                           |
