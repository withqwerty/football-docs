---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-schedule
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Schedule

**Soccer Extended Season Schedule** provides basic match information for all matches for a given season, including scoring and match coverage.

  ### Update Frequency

  300s Time To Live / Cache

> 📘 Loading Fixtures
>
> Learn how to use the Season Schedule to load a season's full fixture list and locate match IDs in our [Fixtures (Schedules)](https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures) integration scenario.

***

## Data Points

### Sport Event

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `id` | `sport_event` | String | Unique ID of a sport event<br /><br />ex. `sr:sport_event:47395897` |
| `replaced_by` | `sport_event` | String | An alternative sport event ID if the match is postponed and played at a later date<br /><br />ex. `sr:sport_event:47395897` |
| `resume_time` | `sport_event` | Date | An updated timestamp if there is a delay at the start or interruption during a match<br /><br />ex. `2024-03-26T20:00:00+00:00` |
| `start_time` | `sport_event` | Date | Start time of a sport event<br /><br />ex. `2024-03-26T20:00:00+00:00` |
| `start_time_confirmed` | `sport_event` | Boolean | Signifies the start time of a sport event is confirmed when `true` |
| `date_confirmed` | `sport_event` | Boolean | Indicates whether the event date is confirmed (`true`). This applies when the calendar day is finalized, but the exact start time has not yet been determined. |

### Venue

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `capacity` | `venue` | Integer | Capacity of a venue<br /><br />ex. `60000` |
| `changed` | `venue` | Boolean | Signifies a venue has been changed when `true` |
| `city_name` | `venue` | String | City name of a venue<br /><br />ex. `Liverpool` |
| `country_code` | `venue` | String | Country code of a venue<br /><br />ex. `ENG` (England) |
| `country_name` | `venue` | String | Country name of a venue<br /><br />ex. `England` |
| `id` | `venue` | String | Unique ID of a venue<br /><br />ex. `sr:venue:579` |
| `map_coordinates` | `venue` | String | Coordinates of a venue<br /><br />ex. `53.430622,-2.960919` |
| `name` | `venue` | String | Name of a venue<br /><br />ex. `Anfield` |
| `reduced_capacity` | `venue` | Boolean | Optional attribute signifying a venue has a restricted capacity when `true` |
| `reduced_capacity_max` | `venue` | Integer | Value of a venue's restricted capacity |
| `timezone` | `venue` | String | Timezone of a venue<br /><br />ex. `Europe/London` |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Situation (`soccer-extended-competitor-schedules`), Sport Event Status (`soccer-extended-competitor-schedules`).
