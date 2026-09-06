---
source_url: https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer fixtures and scores

Observed on 2026-09-06 for eng.1 and esp.1. These are public-endpoint observations,
not an official schema. The examples cover completed and scheduled matches;
in-progress match behavior was not sampled.

## Fixtures by date and historical results

On host site.api.espn.com, use the observed request
`GET /apis/site/v2/sports/soccer/{league}/scoreboard` with a dates query parameter.
The checked single-day form was dates=20250817. For eng.1, the checked range
dates=20250816-20250817 returned event dates on both days. This verifies that
specific range, not arbitrary historical depth or a maximum range size.

The scheduled date dates=20260912 returned future fixtures when checked on
2026-09-06. Scheduling can change, so retain the returned timestamp and refresh
within the permissions of the integration. The tested timestamps ended in Z;
convert them for local display instead of discarding their time-zone information.
These samples do not establish how every time zone interacts with the date filter.

Sources: [completed day](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[date range](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250816-20250817),
[scheduled day](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20260912),
[second league](https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard?dates=20250817).

## Event IDs, teams, and scores

The ESPN scoreboard fields below occurred in the checked eng.1 and esp.1 responses.
The [] notation means an array element, not literal property-name characters.
Types describe observations and do not imply that fields are required.

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

The checked ESPN soccer events used state values pre for scheduled matches and
post for completed matches. These two values are not an exhaustive enum. Unknown
states must remain distinguishable from completed results.

| JSON path | Observed type | Use |
|---|---|---|
| `events[].status.type.state` | string | Observed match phase |
| `events[].status.type.completed` | boolean | Completion flag |
| `events[].status.type.name` | string | Status identifier; no full vocabulary established |
| `events[].status.type.detail` | string | Display detail |

The eng.1 request for dates=20250701 returned HTTP 200 with an empty events array.
Handle this as an empty result for that request, without inferring either an
authentication failure or the absence of football matches everywhere. These
samples do not establish postponement, cancellation, extra-time, shootout, or
live-update semantics.

Sources: [scheduled fixtures](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20260912),
[completed fixtures](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[empty date](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250701).
