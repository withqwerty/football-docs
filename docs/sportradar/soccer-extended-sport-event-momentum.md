---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-momentum
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.198Z
---
# Sport Event Momentum

**Soccer Extended Sport Event Momentum** provides minute-by-minute momentum values for each team in a given match

  ### Update Frequency

  30s Time To Live / Cache

> 📘 Tracking Live Matches
>
> Learn how to use Sport Event Momentum to follow live match momentum in our [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) integration scenario.

## Data Points

### Sport Event Situation

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `away_score` | `sport_event_status` - `period_scores` - `period_score` | Integer | Away team period score |
| `home_score` | `sport_event_status` - `period_scores` - `period_score` | Integer | Home team period score |
| `number` | `sport_event_status` - `period_scores` - `period_score` | Integer | Period number |
| `type` | `sport_event_status` - `period_scores` - `period_score` | String | Period type<br /><br />`regular_period`, `overtime`, `penalties`, `pause`, `awaiting_extra`, `extra_time_halftime`, `interrupted` |

### Momentum

| Attribute | Parent Element | Type | Description |
| --------- | -------------- | ---- | ----------- |
| `competitor` | `momentum` | Boolean | Competitor associated with a momentum timeline event<br /><br />`home`, `away` |
| `match_time` | `momentum` | Integer | Match clock value of a momentum timeline event, in minutes<br /><br />ex. `89` |
| `stoppage_time` | `momentum` | Integer | Match clock value of a momentum timeline event during stoppage/extra time, in minutes<br /><br />ex. `89` |
| `value` | `momentum` | String | Value of a momentum timeline event<br /><br />`-50` to `1` = momentum in the favor of the home team<br /><br />`1` to `50` = momentum in the favor of the away team<br /><br />ex. `89` |

Also returns these data points, documented on the page named in brackets: Category & Sport (`soccer-extended-competitor-schedules`), Competition (`soccer-extended-competitor-schedules`), Group (`soccer-extended-competitor-schedules`), Round (`soccer-extended-competitor-schedules`), Season (`soccer-extended-competitor-schedules`), Stage (`soccer-extended-competitor-schedules`), Competitor (`soccer-extended-competitor-schedules`), Sport Event (`soccer-extended-competitor-schedules`), Sport Event - Channel (`soccer-extended-competitor-schedules`), Sport Event - Referee (`soccer-extended-competitor-schedules`), Sport Event - Coverage Properties (`soccer-extended-competitor-summaries`), Sport Event Status (`soccer-extended-competitor-schedules`), Venue (`soccer-extended-season-schedule`).
