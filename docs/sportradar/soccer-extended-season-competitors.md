---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-competitors
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Competitors

**Soccer Extended Season Competitors** provides a list of teams participating for a given season.

  ### Update Frequency

  300s Time To Live / Cache

  ### Managing Rosters

  Learn how to use Season Competitors to load the teams contesting a season in our [Rosters, Lineups, and Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers) integration scenario.

***

## Data Points

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `LIV` (Liverpool FC)      |
| `age_group` | `competitor` | String | Age group of a competitor, when applicable<br /><br />ex. `U23` |
| `gender` | `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id`  | `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:44` (Liverpool FC) |
| `long_name` | `competitor` | String | Extended name for a competitor. Provides a fuller or more official club name along with a home-nation code, useful for disambiguating clubs in international competitions.<br /><br />ex. `Newcastle Jets FC (AUS)` |
| `name` | `competitor` | String | Standard, full name for a competitor.<br /><br />ex. `Newcastle United Jets` |
| `short_name` | `competitor` | String | Shortened name for a competitor, suited to compact or space-limited displays.<br /><br />ex. `Newcastle` |
| `virtual` | `competitor` | Boolean | Signifies a competitor is a virtual team when `true`. Used for placeholder teams in TBD vs TBD matchups. |
