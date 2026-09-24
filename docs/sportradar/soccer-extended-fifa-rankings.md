---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-fifa-rankings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.195Z
---
# FIFA Rankings

**Soccer Extended FIFA Rankings** provides the FIFA World Rankings for national soccer teams.

  ### Update Frequency

  **TTL / Cache:**

  * 300 seconds

  **Data Updates**:

  * Rankings are updated after each official FIFA publication

  **Recommended Pull**:

  * Pull on an as needed basis

> 📘 Displaying FIFA Rankings
>
> Learn how to use FIFA Rankings to display national team world rankings in our [Tracking Standings](https://developer.sportradar.com/soccer/docs/soccer-ig-tracking-standings) integration scenario.

***

## Data Points

### Competitor

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `abbreviation` | `competitor_ranking` - `competitor` | String | Abbreviation for a competitor name<br /><br />ex. `ESP` (Spain) |
| `country` | `competitor_ranking` - `competitor` | String | Country of a competitor<br /><br />ex. `Spain` |
| `country_code` | `competitor_ranking` - `competitor` | String | Country code of a competitor<br /><br />ex. `ESP` (Spain) |
| `gender` | `competitor_ranking` - `competitor` | String | Gender for a competitor<br /><br />`male`, `female` |
| `id` | `competitor_ranking` - `competitor` | String | Unique ID for a competitor<br /><br />ex. `sr:competitor:4698` (Spain) |
| `name` | `competitor_ranking` - `competitor` | String | Name for a competitor<br /><br />ex. `Spain` |

### Competitor Ranking

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `gender` | `ranking` | String | Gender of a ranking leaderboard<br /><br />ex. `men`, `women` |
| `name` | `ranking` | String | Name of a ranking leaderboard |
| `last_updated` | `ranking` - `competitor_ranking` | date-time | Timestamp of the last update to a competitor's ranking<br /><br />ex. `2026-03-22 15:20:25` |
| `movement` | `ranking` - `competitor_ranking` | Integer | Competitor movement compared to the last rankings update |
| `points` | `ranking` - `competitor_ranking` | Float | Competitor points<br /><br />ex. `1877.2` |
| `previous_points` | `ranking` - `competitor_ranking` | Float | Competitor points for the previous rankings update<br /><br />ex. `1873.3` |
| `rank` | `ranking` - `competitor_ranking` | Integer | Competitor rank |

<br />
