---
source_url: https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer fixtures and scores

Observed on 2026-09-06 for eng.1 and esp.1. ESPN publishes no schema for these
endpoints, so everything here is what the sampled responses contained. The samples
cover completed and scheduled matches, not in-progress ones.

## Fixtures by date and historical results

On host site.api.espn.com, use the observed request
`GET /apis/site/v2/sports/soccer/{league}/scoreboard` with a dates query parameter.
The single-day form is dates=20250817. A range also works: for eng.1,
dates=20250816-20250817 returned events on both days. Historical depth and the
maximum range size were not tested.

A future date (dates=20260912, requested on 2026-09-06) returns scheduled
fixtures. Kick-off times change, so refresh them. Timestamps are UTC (they end
in Z); convert them for display rather than dropping the zone.

Sources: [completed day](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[date range](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250816-20250817),
[scheduled day](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20260912),
[second league](https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=20250817).

## Event IDs, teams, and scores

The [] notation means an array element. Types are as observed; a listed field is
not guaranteed to be present.

| JSON path | Observed type | Use |
|---|---|---|
| `events` | array | Match list |
| `events[].id` | string | Event ID used as the summary event parameter |
| `events[].uid` | string | Separate ESPN identifier; preserve separately from id |
| `events[].date` | string | Match timestamp |
| `events[].season.year` | number | Event season value |
| `events[].competitions[].id` | string | Competition record inside the event |
| `events[].competitions[].competitors[].homeAway` | string | Side label; use it instead of assuming array order |
| `events[].competitions[].competitors[].team.id` | string | ESPN team ID |
| `events[].competitions[].competitors[].team.displayName` | string | Display label |
| `events[].competitions[].competitors[].score` | string | Score representation, not a JSON number |
| `events[].competitions[].competitors[].winner` | boolean | Winner flag when present |

Keep IDs as strings. Check match status before treating a score as a completed
result. The presence of a competition ID inside an event does not make that ID
the league slug used in the URL. Source:
[ESPN scoreboard](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817).

## Scheduled, completed, and empty scoreboards

Scheduled matches had state pre and completed matches post. In-progress matches
were not sampled and may use another value, so treat any state other than post
as not completed.

| JSON path | Observed type | Use |
|---|---|---|
| `events[].status.type.state` | string | Observed match phase |
| `events[].status.type.completed` | boolean | Completion flag |
| `events[].status.type.name` | string | Status identifier; no full vocabulary established |
| `events[].status.type.detail` | string | Display detail |

A date with no matches (eng.1, dates=20250701) returns HTTP 200 with an empty
events array, not an error. Postponements, cancellations, extra time, shootouts
and live updates were not sampled.

Sources: [scheduled fixtures](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20260912),
[completed fixtures](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[empty date](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250701).
