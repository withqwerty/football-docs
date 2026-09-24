---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-standings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Standings

**Soccer Extended Season Standings** provides detailed standings info for a given season.

  ### Update Frequency

  10s Time To Live / Cache

> 📘 Tracking Standings
>
> Learn how to use Season Standings to display league tables and their splits in our [Tracking Standings](https://developer.sportradar.com/soccer/docs/soccer-ig-tracking-standings) integration scenario.

***

## Data Points

### Groups & Stages

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `season_standing` - `groups` - `group` | String | Unique ID for a season's group<br /><br />ex. `sr:league:80253` (UEFA Euro 2024, Group D) |
| `live` | `season_standing` - `groups` - `group` | Boolean | Signifies standings are based on live scores when `true` |
| `name` | `season_standing` - `groups` - `group` | String | Name of a season's group<br /><br />ex. `UEFA Euro 2024, Group D` |
| `group_name` | `season_standing` - `groups` - `group` | String | Abbreviated name of a season's group<br /><br />ex. `D` |
| `parent_group_id` | `season_standing` - `groups` - `group` | String | Unique ID for a parent of a season's group. For example, Eastern Conference (`sr:league:71197`) could be a child of MLS (`sr:league:71197`) <br /><br />ex. `sr:league:71197` |
| `end_date` | `season_standing` - `groups` - `group` - `stage` | Date | End date of a season's stage<br /><br />ex. `2024-05-19` |
| `order` | `season_standing` - `groups` - `group` - `stage` | Integer | Order of a stage within a competition |
| `phase` | `season_standing` - `groups` - `group` - `stage` | String | Name of a season's stage<br /><br />ex. `regular season`, `preliminary_round`, `qualification` |
| `start_date` | `season_standing` - `groups` - `group` - `stage` | Date | Start date of a season's stage<br /><br />ex. `2023-08-11` |
| `type` | `season_standing` - `groups` - `group` - `stage` | String | Type of a season's stage<br /><br />`cup`, `league` |
| `year` | `season_standing` - `groups` - `group` - `stage` | String | Year of a season's stage<br /><br />ex. `23/24` |

### Competitor

| Attribute     | Parent Element              | Type    | Description |
|---------------|----------------------------|---------|-------------|
| `abbreviation` | `standing` - `competitor`  | String  | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group`    | `standing` - `competitor`  | String  | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country`      | `standing` - `competitor`  | String  | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `standing` - `competitor`  | String  | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `form`         | `standing` - `competitor`  | String  | Form standings for a team's last 5 matches, with the oldest match listed first.<br /><br />`W` = Win, `L` = Loss, `D` = Draw<br /><br />ex. `WWLWD` |
| `gender`       | `standing` - `competitor`  | String  | Gender for a competitor<br /><br />`male`, `female` |
| `id`           | `standing` - `competitor`  | String  | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name`         | `standing` - `competitor`  | String  | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `virtual`      | `standing` - `competitor`  | Boolean | Signifies a competitor is a virtual team when `true` |

### Standings

> Standings are separated in the following possible categories: `total`, `home`, `away`, `first_half_total`, `first_half_home`, `first_half_away`, `second_half_total`, `second_half_home`, `second_half_away`, `best_third`

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `points_draw` | `season_standing` | Integer | Number of points awarded for a draw in the season standing group |
| `points_loss` | `season_standing` | Integer | Number of points awarded for a loss in the season standing group |
| `points_win` | `season_standing` | Integer | Number of points awarded for a win in the season standing group |
| `tie_break_rule` | `season_standing` | String | Tie break rule for the season standing group<br /><br />ex. `In the event that two (or more) teams have an equal number of points, the following rules break the tie: 1. Goal difference 2. Goals scored` |
| `type` | `season_standing` | String | Category of the season standing group<br /><br />`total`, `home`, `away`, `first_half_total`, `first_half_home`, `first_half_away`, `second_half_total`, `second_half_home`, `second_half_away`, `best_third` |
| `change` | `group` - `stage` - `standing` | Integer | Change in a team's standing rank from the previous week<br /><br />ex. `2` or `-1` |
| `current_outcome` | `group` - `stage` - `standing` | String | Current outcome of a team for the season<br /><br />ex. `Champions League` or `Relegation` |
| `draw` | `group` - `stage` - `standing` | Integer | Number of ties for a team in the season standing group |
| `goals_against` | `group` - `stage` - `standing` | Integer | Number of goals against for a team in the season standing group |
| `goals_diff` | `group` - `stage` - `standing` | Integer | Goal difference for a team in the season standing group<br /><br />ex. `42` or `-3` |
| `goals_for` | `group` - `stage` - `standing` | Integer | Number of goals scored for a team in the season standing group |
| `loss` | `group` - `stage` - `standing` | Integer | Number of losses for a team in the season standing group |
| `played` | `group` - `stage` - `standing` | Integer | Number of matches played for a team in the season standing group |
| `points` | `group` - `stage` - `standing` | Integer | Number of points for a team in the season standing group |
| `points_per_game` | `group` - `stage` - `standing` | Double | Average points per game for a team in the season standing group<br /><br />ex. `1.95` |
| `rank` | `group` - `stage` - `standing` | Integer | Team rank in the season standing group |
| `round` | `group` - `stage` - `standing` | Integer | Number of rounds in the season standing group |
| `win` | `group` - `stage` - `standing` | Integer | Number of wins for a team in the season standing group |
| `text` | `group` - `stage` - `standing` - `comment` | String | Supplementary info for a team's standings entry<br /><br />ex. `6 points deducted due to decision by the Federation` |
