---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-overunder-statistics
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Over/Under Statistics

**Soccer Extended Season Over/Under Statistics** provides the over/under match goal totals for all teams in a given season.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Retrieving Seasonal Statistics
>
> Learn how to use Season Over/Under Statistics for per-team goal-total splits in our [Seasonal Statistics](https://developer.sportradar.com/soccer/docs/soccer-ig-seasonal-stats) integration scenario.

***

## Data Points

### Competitor
  | Attribute   | Parent Element | Type   | Description                                                           |
  | ----------- | -------------- | ------ | --------------------------------------------------------------------- |
  | `age_group` | `competitor`   | String | Age group of a competitor, when applicable<br />ex. `U23`             |
  | `id`        | `competitor`   | String | Unique ID for a competitor<br />ex. `sr:competitor:44` (Liverpool FC) |
  | `name`      | `competitor`   | String | Name for a competitor<br />ex. `Liverpool FC`                         |

### Over/Under Stats
  | Attribute | Parent Element                                      | Type    | Description                                                                                           |
  | --------- | --------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
  | `type`    | `over_under_statistics_list` - `type`               | String  | Type of over/under statistic<br />ex. `full_time_total`, `first_period_total`, `second_period_total` |
  | `goals`   | `over_under_statistics_list` - `type` - `statistic` | Double  | Goal value for an over/under statistic entry<br />ex. `0.5` or `4.5`                                  |
  | `over`    | `over_under_statistics_list` - `type` - `statistic` | Integer | Number of games over for a over/under statistic entry                                                 |
  | `under`   | `over_under_statistics_list` - `type` - `statistic` | Integer | Number of games under for a over/under statistic entry                                                |
