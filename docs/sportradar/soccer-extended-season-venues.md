---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-season-venues
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.196Z
---
# Season Venues

**Soccer Extended Season Venues** provides a list of venues associated with a given season.

  ### Update Frequency

  300s Time To Live / Cache

***

## Data Points

### Venue
  | Attribute         | Parent Element | Type    | Description                                                                                 |
  | ----------------- | -------------- | ------- | ------------------------------------------------------------------------------------------- |
  | `capacity`        | `venue`        | Integer | Capacity of a venue<br /><br />ex. `60000`                                                  |
  | `city_id`         | `venue`        | String  | Unique ID of a city<br /><br />ex. `sr:city:59`                                             |
  | `city_name`       | `venue`        | String  | City name of a venue<br /><br />ex. `Liverpool`                                             |
  | `country_code`    | `venue`        | String  | Country code of a venue<br /><br />ex. `ENG` (England)                                      |
  | `country_name`    | `venue`        | String  | Country name of a venue<br /><br />ex. `England`                                            |
  | `id`              | `venue`        | String  | Unique ID of a venue<br /><br />ex. `sr:venue:579`                                          |
  | `long_name`       | `venue`        | String  | Extended name for a venue, when one exists<br />ex. `Sultan Qaboos Sports Complex - Muscat` |
  | `map_coordinates` | `venue`        | String  | Coordinates of a venue<br /><br />ex. `53.430622,-2.960919`                                 |
  | `name`            | `venue`        | String  | Name of a venue<br /><br />ex. `Sultan Qaboos Sports Complex`                               |
  | `timezone`        | `venue`        | String  | Timezone of a venue<br /><br />ex. `Europe/London`                                          |
