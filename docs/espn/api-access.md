---
source_url: https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard?dates=20250817
source_type: curated
upstream_version: null
crawled_at: 2026-09-06
---

# ESPN soccer access

Curated observations of ESPN's soccer JSON endpoints, checked on 2026-09-06.
ESPN publishes no API reference or schema for them and promises no stability;
the v2 in the paths is not a versioning commitment. Everything in these docs is
what the tested requests returned.

For the soccerdata Python reader, request provider soccerdata and search for
sd.ESPN. Its [reader documentation](../soccerdata/data-sources.md) remains indexed
separately. The ESPN provider key now retrieves these direct endpoint notes.

## Authentication and access status

The requests returned HTTP 200 JSON without an API key, authorization header,
login or cookies. That is not a guarantee of future access or an official developer
service, and ESPN publishes no rate limit or service level.

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

These are the tested requests, not a full catalogue. See [scoreboard.md](scoreboard.md),
[match-summary.md](match-summary.md), [teams-and-standings.md](teams-and-standings.md),
and [identity-and-coverage.md](identity-and-coverage.md) for verified parameters.

## Handling change and missing data

Check the HTTP status and the JSON shape before parsing. Handle missing sections,
empty arrays and unknown status values explicitly, and never turn a missing
statistic into a zero. Pace requests and back off on failures (our recommendation;
ESPN publishes no rules). A denied request does not mean the match or team does
not exist.

Stop on access denial rather than trying to bypass it. An application that needs
guaranteed availability needs a licensed data supplier.
