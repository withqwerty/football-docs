---
source_url: https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer access

These are curated observations of ESPN-hosted soccer JSON endpoints, checked on
2026-09-06. No current official soccer API reference or published schema was
identified. Path components such as v2 are observed URL components, not a
documented compatibility promise. Coverage below is limited to the tested requests.

For the soccerdata Python reader, request provider soccerdata and search for
sd.ESPN. Its [reader documentation](../soccerdata/data-sources.md) remains indexed
separately. The ESPN provider key now retrieves these direct endpoint notes.

## Authentication and access status

The checked ESPN soccer requests returned HTTP 200 JSON without an API key,
authorization header, login, or cookies. This is an observation of those requests,
not a guarantee of future access or an official developer service. No supported
rate limit, polling interval, SLA, or bulk-download entitlement was established.

Public reachability does not establish permission to reuse data. Disney's
[US terms of use](https://disneytermsofuse.com/english/), which include ESPN,
restrict commercial use and automated extraction without written permission.
Check the applicable terms and permissions for the intended use. This corpus
contains original structural notes, not ESPN articles, images, commentary text,
or raw match responses. The repository's MIT licence does not license ESPN content.

Source checks: [scoreboard](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817),
[teams](https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams),
[standings](https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings?season=2025),
[league discovery](https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=5&page=1).

## Endpoint families and request paths

ESPN's soccer paths use soccer as the sport segment. The tested league slugs were
eng.1 and esp.1. Keep each endpoint's host and path together: standings does not
use the same path prefix as scoreboard, summary, and teams.

| Request | Host | Purpose |
|---|---|---|
| `GET /apis/site/v2/sports/soccer/{league}/scoreboard` | site.api.espn.com | Fixtures, results, event IDs |
| `GET /apis/site/v2/sports/soccer/{league}/summary` | site.api.espn.com | Match details selected by the event query parameter |
| `GET /apis/site/v2/sports/soccer/{league}/teams` | site.api.espn.com | Team discovery |
| `GET /apis/v2/sports/soccer/{league}/standings` | site.api.espn.com | League tables selected by season |
| `GET /v2/sports/soccer/leagues` | sports.core.api.espn.com | Paginated league resource references |

Examples are the requests recorded in the dated source checks, not an exhaustive
endpoint catalogue. See [scoreboard.md](scoreboard.md),
[match-summary.md](match-summary.md), [teams-and-standings.md](teams-and-standings.md),
and [identity-and-coverage.md](identity-and-coverage.md) for verified parameters.

## Handling change and missing data

For an integration with the necessary permissions, check HTTP status and JSON
shape before parsing. Treat missing sections, empty arrays, and unknown status
values explicitly. Do not convert unavailable statistics into zero observations.
Use bounded requests and backoff on failures; these are integration recommendations,
not ESPN-published retry or polling rules. A denied request is not evidence that
the requested match or team does not exist.

The checked sources establish no stable contract or rate-limit policy. Stop on
access denial rather than attempting to bypass it. An application that needs
guaranteed availability must establish that separately with its data supplier.
