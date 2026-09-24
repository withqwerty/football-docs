---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-competitor-vs-competitor
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# Competitor vs Competitor

**Soccer Extended Competitor vs Competitor** provides previous and upcoming matches between two teams including scoring information, player and team match statistics.

  ### Update Frequency

  60s Time To Live / Cache

> 📘 Tracking a Single Match
>
> Learn how to surface head-to-head context around a match in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

***

## Data Points

### Competitor

> Competitor info is available at the top of each file and for each individual game. 

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitors` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC) |
| `age_group` | `competitors` - `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `country` | `competitors` - `competitor` | String | Country of a competitor<br /><br />ex. `England` |
| `country_code` | `competitors` - `competitor` | String | Country code of a competitor<br /><br />ex. `ENG` (England) |
| `gender` | `competitors` - `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitors` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `name` | `competitors` - `competitor` | String | Name for a competitor<br /><br />ex. `Liverpool FC` |
| `qualifier` | `competitors` - `competitor` | String | Designation of a competitor for a sport event<br /><br />`home`, `away` |
| `virtual` | `competitors` - `competitor` | Boolean | Signifies a competitor is a virtual team when `true`. Used for placeholder teams in TBD vs TBD matchups. |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Player (`soccer-extended-competitor-summaries`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Situation (`soccer-extended-competitor-schedules`), Sport Event Status (`soccer-extended-competitor-schedules`), Ball Location (`soccer-extended-competitor-schedules`), Match Stats (Player) (`soccer-extended-competitor-summaries`), Match Stats (Team) (`soccer-extended-competitor-summaries`), Venue (`soccer-extended-competitor-schedules`).
