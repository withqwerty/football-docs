---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-seasons-disabled
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.197Z
---
# Seasons Disabled

Provides a list of currently disabled seasons, including future seasons that have not yet been enabled.<br><br><i>Note: Season details and availability are subject to change prior to enablement.</i>

  ### Update Frequency

  **TTL / Cache:**

  * 300 seconds

  **Data Updates**:

  * Data updates as seasons are enabled or disabled

  **Recommended Pull**:

  * Pull on an as needed basis

> 📘 Monitoring Data Changes
>
> Learn how to use Seasons Disabled to track season availability in our [Monitoring Data Changes](https://developer.sportradar.com/soccer/docs/monitoring-data-changes) integration scenario.

***

## Data Points

### Season
  | Attribute        | Parent Element | Type    | Description                                                                                                |
  | ---------------- | -------------- | ------- | ---------------------------------------------------------------------------------------------------------- |
  | `competition_id` | `season`       | String  | Unique ID for the competition a sport event belongs to<br /><br />ex. `sr:competition:17` (Premier League) |
  | `disabled`       | `season`       | Boolean | Signifies a season has been disabled when `true`                                                           |
  | `end_date`       | `season`       | Date    | End date of a season<br /><br />ex. `2027-05-30`                                                           |
  | `id`             | `season`       | String  | Unique ID for a season<br /><br />ex. `sr:season:105353`                                                   |
  | `name`           | `season`       | String  | Name of a season<br /><br />ex. `Premier League 26/27`                                                     |
  | `start_date`     | `season`       | Date    | Start date of a season<br /><br />ex. `2026-08-22`                                                         |
  | `year`           | `season`       | String  | Year of a season<br /><br />ex. `26/27` or `2026`                                                          |

<br />
