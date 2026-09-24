---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-form-standings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Form Standings

**Soccer Extended Season Form Standings** provides a form table of game results and splits for a given season. Table displays W/D/L (win/draw/loss) for a maximum of 6 matches for each team.

  ### Update Frequency

  60s Time To Live / Cache

> 📘 Tracking Standings
>
> Learn how to use Season Form Standings to display form tables in our [Tracking Standings](https://developer.sportradar.com/soccer/docs/soccer-ig-tracking-standings) integration scenario.

***

## Data Points

### Group

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `season_form_standing` - `groups` - `group` | String | Unique ID for a season's group<br /><br />ex. `sr:league:65927` (Premier League 22/23) |
| `name` | `season_form_standing` - `groups` - `group` | String | Name of a season's group<br /><br />ex. `Premier League 22/23` |

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `form_standing` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `form_standing` - `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `form_standing` - `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `form_standing` - `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `form_standing` - `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `form_standing` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `form_standing` - `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `virtual` | `form_standing` - `competitor` | Boolean | Signifies a competitor is a virtual team when `true` |

### Form Standings

> Form standings are separated in the following possible categories: `full_time_total`, `full_time_home`, `full_time_away`, `half_time_total`, `half_time_home`, `half_time_away`

| Attribute       | Parent Element          | Type    | Description |
|-----------------|------------------------|---------|-------------|
| `type`          | `season_form_standing`  | String  | Category of the season form standing group<br /><br />`total`, `home, away`, `first_help_total`, `first_half_home`, `first_half_away`, `second_half_total`, `second_half_home`, `second_half_away` |
| `draw`          | `group` - `form_standing` | Integer | Number of ties for a team in the season form standing group |
| `form`          | `group` - `form_standing` | String  | Form standings for a team's last matches, with the most recent match listed first.<br /><br />The max limit to display in your request is `10`, which will show, for example, `played="10"`, `win="8"`, `loss="2"`. The `form` will always display a maximum of 6 matches.<br /><br />`W` = Win, `L` = Loss, `D` = Draw<br /><br />ex. `form="LDWWWW"` |
| `goals_against` | `group` - `form_standing` | Integer | Number of goals against for a team in the season form standing group |
| `goals_diff`    | `group` - `form_standing` | Integer | Goal difference for a team in the season form standing group<br /><br />ex. `42` or `-3` |
| `goals_for`     | `group` - `form_standing` | Integer | Number of goals scored for a team in the season form standing group |
| `loss`          | `group` - `form_standing` | Integer | Number of losses for a team in the season form standing group |
| `played`        | `group` - `form_standing` | Integer | Number of matches played for a team in the season form standing group |
| `points`        | `group` - `form_standing` | Integer | Number of points for a team in the season form standing group |
| `rank`          | `group` - `form_standing` | Integer | Team rank in the season form standing group |
| `win`           | `group` - `form_standing` | Integer | Number of wins for a team in the season form standing group |
