---
source_url: https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer match summary

Curated observations checked on 2026-09-06. Two completed and two scheduled
summaries were sampled across eng.1 and esp.1. Field presence varies by match
state; this is not an official API schema or a guarantee of competition coverage.

## From scoreboard event ID to match details

On host site.api.espn.com, the observed request is
`GET /apis/site/v2/sports/soccer/{league}/summary` with event set to an event ID
returned by that league's scoreboard. For example, event=740603 came from the
eng.1 scoreboard for 2025-08-17. Do not pass a team ID or league ID as event.

| JSON path | Observed type | Use |
|---|---|---|
| `header.id` | string | Summary event ID |
| `header.competitions[].id` | string | Competition record inside the event |
| `header.competitions[].status.type.state` | string | Match state |
| `header.competitions[].status.type.completed` | boolean | Completion flag |

Sources: [scoreboard](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[completed summary](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603),
[second completed summary](https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/summary?event=748148).

## Team statistics and match state

The checked ESPN summaries exposed team statistics under boxscore. The entries
carry names and display values; select by the returned name rather than an array
offset. Formatted display values should not be assumed to be plain numbers.

| JSON path | Observed type | Use |
|---|---|---|
| `boxscore.teams[].team.id` | string | Team the statistics belong to |
| `boxscore.teams[].statistics[].name` | string | Statistic key |
| `boxscore.teams[].statistics[].label` | string | Display label |
| `boxscore.teams[].statistics[].displayValue` | string | Formatted value |

The sampled scheduled summaries also contained team statistics. Their presence
alone does not establish that a match has started or that values describe that
match. Check the header's match state and establish the statistic's context before
using it. This corpus does not assign a model, unit, or definition to unverified
statistic names, including expected-goals metrics.

Sources: [completed summary](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603),
[scheduled summary](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=401879285).

## Lineups, formations, and player IDs

The completed ESPN soccer summaries contained rosters with player entries and
formation labels. In the sampled scheduled summaries, roster team records existed
without populated player entries. A team record alone is not a confirmed lineup.

| JSON path | Observed type | Use |
|---|---|---|
| `rosters[].team.id` | string | ESPN team ID |
| `rosters[].homeAway` | string | Side label |
| `rosters[].formation` | string | Formation label when available |
| `rosters[].roster[].athlete.id` | string | ESPN player ID |
| `rosters[].roster[].athlete.displayName` | string | Player display label |
| `rosters[].roster[].starter` | boolean | Starter flag |
| `rosters[].roster[].jersey` | string | Shirt number representation |
| `rosters[].roster[].position.abbreviation` | string | Position label |
| `rosters[].roster[].formationPlace` | string | Placement label; no pitch coordinate mapping established |
| `rosters[].roster[].subbedIn` | boolean | Substitution flag |
| `rosters[].roster[].subbedOut` | boolean | Substitution flag |
| `rosters[].roster[].stats[].name` | string | Per-player statistic key |
| `rosters[].roster[].stats[].value` | number | Numeric statistic value |
| `rosters[].roster[].stats[].displayValue` | string | Display representation |

Keep missing player statistics distinct from zero. The samples do not establish
when confirmed lineups become available or an exhaustive position vocabulary.
They also do not establish a standalone player statistics endpoint.

Sources: [completed lineup](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603),
[scheduled summary](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=401879285),
[second scheduled summary](https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/summary?event=401882881).

## Key events and commentary availability

The completed ESPN soccer summaries had keyEvents and commentary arrays, with
the fields below. No top-level plays field occurred in any of the four sampled
summaries. Do not borrow a play-by-play schema from a different ESPN sport.

| JSON path | Observed type | Use |
|---|---|---|
| `keyEvents[].id` | string | Key-event identifier |
| `keyEvents[].type.id` | string | Event type ID; no exhaustive mapping established |
| `keyEvents[].type.text` | string | Event type label |
| `keyEvents[].text` | string | Event description |
| `keyEvents[].clock.displayValue` | string | Display clock |
| `keyEvents[].team.id` | string | Related team when present |
| `keyEvents[].participants[].athlete.id` | string | Related player when present |
| `keyEvents[].scoringPlay` | boolean | Scoring flag |
| `commentary[].text` | string | Commentary text |
| `commentary[].time.displayValue` | string | Display time |

These arrays were absent from the sampled scheduled summaries. Preserve missing
sections as unavailable. The observations do not establish a complete event feed,
event ordering guarantees, coordinate conventions, or live-update latency.
Commentary text is not reproduced in this corpus.

Sources: [completed summary](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=740603),
[scheduled summary](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/summary?event=401879285).
