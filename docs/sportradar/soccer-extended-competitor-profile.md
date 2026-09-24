---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitor-profile
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Competitor Profile

**Soccer Extended Competitor Profile** provides top-level information for a given team, including the full team roster, manager, home venue, and team colors.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Managing Rosters
>
> Learn how to use the Competitor Profile for team details and squad context in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Category & Sport

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `competitor_profile` - `category` | String | Country code for a competitor's category<br /><br />ex. `ENG` (England) |
| `id` | `competitor_profile` - `category` | String | Unique category ID for a competitor<br /><br />ex. `sr:category:1` |
| `name` | `competitor_profile` - `category` | String | Name for a competitor's category<br /><br />ex. `England` (Premier League) |
| `id` | `competitor_profile` - `sport` | String | Unique sport ID for a competitor<br /><br />ex. `sr:sport:1` |
| `name` | `competitor_profile` - `sport` | String | Name for a competitor's sport<br /><br />ex. `Soccer` |

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `short_name` | `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool` |

### Jersey

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `base` | `jerseys` - `jersey` | String | RGB color code of a competitor's base jersey<br /><br />ex. `e41e2c` |
| `horizontal_stripes` | `jerseys` - `jersey` | Boolean | Signifies a competitor's jersey has horizontal stripes when `true` |
| `horizontal_stripes_color` | `jerseys` - `jersey` | String | RGB color code of a competitor's horizontal jersey stripes<br /><br />ex. `e41e2c` |
| `number` | `jerseys` - `jersey` | String | RGB color code of a competitor's jersey number<br /><br />ex. `ffffff` |
| `shirt_type` | `jerseys` - `jersey` | String | Shirt type of a competitor's jersey<br /><br />ex. `short_sleeves` |
| `sleeve` | `jerseys` - `jersey` | String | RGB color code of a competitor's jersey sleeves<br /><br />ex. `e41e2c` |
| `sleeve_detail` | `jerseys` - `jersey` | String | RGB color code of a competitor's jersey sleeves detail<br /><br />ex. `ffffff` |
| `split` | `jerseys` - `jersey` | Boolean | Signifies a competitor's jersey is split when `true` |
| `split_color` | `jerseys` - `jersey` | String | RGB color code of a competitor's jersey split<br /><br />ex. `ffffff` |
| `squares` | `jerseys` - `jersey` | Boolean | Signifies a competitor's jersey is squares when `true` |
| `squares_color` | `jerseys` - `jersey` | String | RGB color code of a competitor's jersey squares<br /><br />ex. `ffffff` |
| `stripes` | `jerseys` - `jersey` | Boolean | Signifies a competitor's jersey has stripes when `true` |
| `stripes_color` | `jerseys` - `jersey` | String | RGB color code of a competitor's jersey stripes<br /><br />ex. `ffffff` |
| `type` | `jerseys` - `jersey` | String | Type of competitor jersey entry<br /><br />ex. `home`, `away`, `goalkeeper`, `third` |

### Manager

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `manager` | String | Country code of a manager<br /><br />ex. `ENG` (England) |
| `date_of_birth` | `manager` | Date | Date of birth of a manager<br /><br />ex. `1967-06-16` |
| `gender` | `manager` | String | Gender of a manager<br /><br />`male`, `female` |
| `id` | `manager` | String | Unique ID of a manager<br /><br />ex. `sr:player:52829` |
| `name` | `manager` | String | Name of a manager<br /><br />ex. `Klopp, Jurgen` |
| `nationality` | `manager` | String | Nationality of a manager<br /><br />ex. `Germany` |
| `nickname` | `manager` | String | Nickname of a manager |
| `preferred_foot` | `manager` | String | Preferred foot of a manager<br /><br />`left`, `right` |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `captain` | `players` - `player` | Boolean | Indicates the player is the team captain for the associated team when `true` |
| `country_code` | `players` - `player` | String | Country code of a player<br /><br />ex. `EGY` (Egypt) |
| `country_of_birth` | `players` - `player` | String | Birth country of a player<br /><br />ex. `Egypt` |
| `date_of_birth` | `players` - `player` | Date | Date of birth of a player<br /><br />ex. `1992-06-15` |
| `gender` | `players` - `player` | String | Gender of a player<br /><br />`male`, `female` |
| `height` | `players` - `player` | Integer | Height of a player in centimeters<br /><br />ex. `175` |
| `id` | `players` - `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `jersey_number` | `players` - `player` | Integer | Jersey number of a player |
| `loaned_to_competitor_id` | `players` - `player` | String | Unique ID of the competitor a player is currently on loan to<br /><br />ex. `sr:competitor:9` |
| `name` | `players` - `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `nationality` | `players` - `player` | String | Nationality of a player<br /><br />ex. `Egypt` |
| `nickname` | `players` - `player` | String | Nickname of a player |
| `on_loan` | `players` - `player` | Boolean | Signifies a player is on loan to this team when `true` |
| `place_of_birth` | `players` - `player` | String | Place of birth of a player<br /><br />ex. `Basyoun, El Gharbia` |
| `preferred_foot` | `players` - `player` | String | Preferred foot of a player<br /><br />`left`, `right` |
| `type` | `players` - `player` | String | Position of a player<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward` |
| `weight` | `players` - `player` | Integer | Weight of a player in kilograms<br /><br />ex. `71` |

### Venue

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `capacity` | `venue` | Integer | Capacity of a competitor's home venue<br /><br />ex. `60000` |
| `changed` | `venue` | Boolean | Signifies a venue has been changed when `true` |
| `city_id` | `venue` | String | Unique ID of a city<br /><br />ex. `sr:city:59` |
| `city_name` | `venue` | String | City name of a competitor's home venue<br /><br />ex. `Liverpool` |
| `country_code` | `venue` | String | Country code of a competitor's home venue<br /><br />ex. `ENG` (England) |
| `country_name` | `venue` | String | Country name of a competitor's home venue<br /><br />ex. `England` |
| `id` | `venue` | String | Unique ID of a competitor's home venue<br /><br />ex. `sr:venue:579` |
| `map_coordinates` | `venue` | String | Coordinates of a competitor's home venue<br /><br />ex. `53.430622,-2.960919` |
| `name` | `venue` | String | Name of a competitor's home venue<br /><br />ex. `Anfield` |
| `reduced_capacity` | `venue` | Boolean | Optional attribute signifying a venue has a restricted capacity when `true` |
| `reduced_capacity_max` | `venue` | Integer | Value of a venue's restricted capacity |
| `timezone` | `venue` | String | Timezone of a competitor's home venue<br /><br />ex. `Europe/London` |
