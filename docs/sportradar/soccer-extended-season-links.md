---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-links
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Links

**Soccer Extended Season Links** provides information about linked cup rounds for a given season.<br><br>Use this feed to compile full advancement brackets for relevant seasons/tournaments. Links between all matches and rounds are available when competitors (TBD vs. TBD) are not yet known.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Building Tournament Brackets
>
> Learn how to use Season Links to wire cup rounds into a bracket in our [Tracking Tournaments](https://developer.sportradar.com/soccer/docs/soccer-ig-tracking-tournaments) integration scenario.

***

## Data Points

### Groups, Rounds, Seasons, & Stages

> Cup round info may reside within `cup_round` or `linked_cup_rounds`. Linked cup round info signifies `parent` or `child` rounds associated with the parent `cup_round`. 

| Attribute | Parent Element | Type | Description |
|-----------|----------------|------|-------------|
| `end_date` | `season_stages_groups_cup_rounds` - `stage` | Date | End date of a season's stage<br /><br />ex. `2024-05-19` |
| `order` | `season_stages_groups_cup_rounds` - `stage` | Integer | Order of a stage within a season |
| `phase` | `season_stages_groups_cup_rounds` - `stage` | String | Name of a season's stage<br /><br />ex. `regular season`, `preliminary_round`, `qualification`, `playoffs`<br /><br />See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#what-are-the-possible-values-for-stage---phase) for a complete list of phases |
| `start_date` | `season_stages_groups_cup_rounds` - `stage` | Date | Start date of a season's stage<br /><br />ex. `2023-08-11` |
| `type` | `season_stages_groups_cup_rounds` - `stage` | String | Type of a season's stage<br /><br />`cup`, `league` |
| `year` | `season_stages_groups_cup_rounds` - `stage` | String | Year of a season's stage<br /><br />ex. `23/24` |
| `id` | `stages` - `groups` - `group` | String | Unique ID for a stage or season's group<br /><br />ex. `sr:cup:142213` (UEFA Euro 2024, Group D) |
| `group_name` | `stages` - `groups` - `group` | String | Abbreviated name of a sport event's group<br /><br />ex. `MLS 2023, Playoffs` |
| `order` | `stages` - `groups` - `group` | Integer | Order of the `cup_round` within the stage |
| `id` | `stages` - `groups` - `cup_rounds` - `cup_round` | String | Unique ID for a stage or season's cup round<br /><br />ex. `sr:cup_round:1741113` |
| `name` | `stages` - `groups` - `cup_rounds` - `cup_round` | String | Name of a stage or season's cup round<br /><br />ex. `round_3` or `round_of_16` |
| `order` | `stages` - `groups` - `cup_rounds` - `cup_round` | Integer | Order number for a match in a stage or season's cup round |
| `state` | `stages` - `groups` - `cup_rounds` - `cup_round` | String | State/status of a match in a stage or season's cup round<br /><br />ex. `ended`, `decided`, `unstarted`, `cancelled`, `winner` |
| `type` | `stages` - `groups` - `cup_rounds` - `cup_round` | String | Type of a stage or season's cup round<br /><br />ex. `parent` |
| `winner_id` | `stages` - `groups` - `cup_rounds` - `cup_round` | String | Unique ID for the winner of a stage or season's cup round<br /><br />ex. `sr:competitor:4819` |

### Sport Event

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `cup_rounds` - `sport_events` - `sport_event` | String | Unique ID of a sport event<br /><br />ex. `sr:sport_event:47395897` |
| `order` | `cup_rounds` - `sport_events` - `sport_event` | Integer | Order of the `sport_event` within the `cup_round` |
| `start_time` | `cup_rounds` - `sport_events` - `sport_event` | Date | Start time of a sport event<br /><br />ex. `2024-03-26T20:00:00+00:00` |
| `start_time_confirmed` | `cup_rounds` - `sport_events` - `sport_event` | Boolean | Signifies the start time of a sport event is confirmed when `true` |
| `date_confirmed` | `sport_event` | Boolean | Indicates whether the event date is confirmed (`true`). This applies when the calendar day is finalized, but the exact start time has not yet been determined. |
