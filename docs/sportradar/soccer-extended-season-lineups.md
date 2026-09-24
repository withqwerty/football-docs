---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-lineups
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Lineups

**Soccer Extended Season Lineups** provides match lineups and substitutions for a given season.

  ### Update Frequency

  30s Time To Live / Cache

> 📘 Displaying Lineups
>
> Learn how to use Season Lineups to pull lineups across a season's matches in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Jersey

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `base` | `competitor` - `jersey` | String | RGB color code of a competitor's base jersey<br /><br />ex. `e41e2c` |
| `horizontal_stripes` | `competitor` - `jersey` | Boolean | Signifies a competitor's jersey has horizontal stripes when `true` |
| `horizontal_stripes_color` | `competitor` - `jersey` | String | RGB color code of a competitor's horizontal jersey stripes<br /><br />ex. `e41e2c` |
| `number` | `competitor` - `jersey` | String | RGB color code of a competitor's jersey number<br /><br />ex. `ffffff` |
| `shirt_type` | `competitor` - `jersey` | String | Shirt type of a competitor's jersey<br /><br />ex. `short_sleeves` |
| `sleeve` | `competitor` - `jersey` | String | RGB color code of a competitor's jersey sleeves<br /><br />ex. `e41e2c` |
| `sleeve_detail` | `competitor` - `jersey` | String | RGB color code of a competitor's jersey sleeves detail<br /><br />ex. `ffffff` |
| `split` | `competitor` - `jersey` | Boolean | Signifies a competitor's jersey is split when `true` |
| `split_color` | `competitor` - `jersey` | String | RGB color code of a competitor's jersey split<br /><br />ex. `ffffff` |
| `squares` | `competitor` - `jersey` | Boolean | Signifies a competitor's jersey is squares when `true` |
| `squares_color` | `competitor` - `jersey` | String | RGB color code of a competitor's jersey squares<br /><br />ex. `ffffff` |
| `stripes` | `competitor` - `jersey` | Boolean | Signifies a competitor's jersey has stripes when `true` |
| `stripes_color` | `competitor` - `jersey` | String | RGB color code of a competitor's jersey stripes<br /><br />ex. `ffffff` |
| `type` | `competitor` - `jersey` | String | Type of competitor jersey entry<br /><br />ex. `home`, `away`, `goalkeeper`, `third` |

### Manager

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `country_code` | `competitor` - `manager` | String | Country code of a manager<br /><br />ex. `ENG` (England) |
| `date_of_birth` | `competitor` - `manager` | Date | Date of birth of a manager<br /><br />ex. `1967-06-16` |
| `gender` | `competitor` - `manager` | String | Gender of a manager<br /><br />`male`, `female` |
| `id` | `competitor` - `manager` | String | Unique ID of a manager<br /><br />ex. `sr:player:52829` |
| `name` | `competitor` - `manager` | String | Name of a manager<br /><br />ex. `Klopp, Jurgen` |
| `nationality` | `competitor` - `manager` | String | Nationality of a manager<br /><br />ex. `Germany` |
| `nickname` | `competitor` - `manager` | String | Nickname of a manager |
| `preferred_foot` | `competitor` - `manager` | String | Preferred foot of a manager<br /><br />`left`, `right` |

### Player

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `captain` | `player` | Boolean | Indicates the player is the team captain for the match when `true`. Populates when `lineups.confirmed` moves to `true`. |
| `country_code` | `player` | String | Country code of a player<br /><br />ex. `EGY` (Egypt) |
| `date_of_birth` | `player` | Date | Date of birth of a player<br /><br />ex. `1992-06-15` |
| `gender` | `player` | String | Gender of a player<br /><br />`male`, `female` |
| `height` | `player` | Integer | Height of a player in centimeters<br /><br />ex. `175` |
| `id` | `player` | String | Unique ID of a player<br /><br />ex. `sr:player:159665` |
| `jersey_number` | `player` | Integer | Jersey number of a player |
| `name` | `player` | String | Name of a player<br /><br />ex. `Salah, Mohamed` |
| `nationality` | `player` | String | Nationality of a player<br /><br />ex. `Egypt` |
| `nickname` | `player` | String | Nickname of a player |
| `place_of_birth` | `player` | String | Place of birth of a player<br /><br />ex. `Basyoun, El Gharbia` |
| `played` | `player` | Boolean | Signifies a player appeared in a match when `true` |
| `preferred_foot` | `player` | String | Preferred foot of a player<br /><br />`left`, `right` |
| `starter` | `player` | Boolean | Signifies a player is in the starting lineup of a match when `true` |
| `type` | `player` | String | Position of a player<br /><br />`goalkeeper`, `defender`, `midfielder`, `forward` |
| `weight` | `player` | Integer | Weight of a player in kilograms<br /><br />ex. `71` |

### Match Lineups

See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#lineups) for more information on lineups.

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `order` | `player` | Integer | Lineup position number for a player. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-extended-faq#how-is-the-order-value-in-the-lineups-endpoint-organized) for detailed information on order numbers |
| `position` | `player` | Integer | Lineup position description (player tactical position) of a player for a match<br /><br />`goalkeeper`, `right_back`, `central_defender`, `left_back`, `right_winger`, `central_midfielder`, `left_winger`, `striker`, `fullback` |
| `type` | `formation` | String | Team lineup formation for a match<br /><br />ex. `4-3-3` or `4-2-3-1` |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Situation (`soccer-extended-competitor-schedules`), Sport Event Status (`soccer-extended-competitor-schedules`), Ball Location (`soccer-extended-competitor-schedules`), Match Stats (Player) (`soccer-extended-competitor-summaries`), Match Stats (Team) (`soccer-extended-competitor-summaries`), Venue (`soccer-extended-competitor-schedules`).
