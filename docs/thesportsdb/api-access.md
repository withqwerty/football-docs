---
source_url: https://www.thesportsdb.com/docs_api_guide
source_type: api_docs
upstream_version: "1 / 2"
crawled_at: 2026-07-09
---

# TheSportsDB API Access

## Overview

TheSportsDB is an open, crowd-sourced sports database with a JSON API for teams,
events, players, leagues, schedules, scores, standings, artwork, TV listings,
and video highlights. For football projects it is best treated as a broad
public/live-score and metadata source, not as an advanced event-data provider.

## Free Versus Premium

The public docs distinguish a free API and a premium supporter API.

| Tier | Notes |
|---|---|
| Free | Uses the public `123` key for v1; useful for simple lookups and tests, with restricted methods/limits |
| Premium | Dedicated API key, higher limits, v2 access, live scores, video highlights, and the full upgraded method set |

Do not assume v2 or livescore access exists unless the deployment has a premium
`THESPORTSDB_API_KEY` or equivalent secret.

## Base URLs

```text
https://www.thesportsdb.com/api/v1/json
https://www.thesportsdb.com/api/v2/json
```

v1 puts the API key in the URL path:

```http
GET /api/v1/json/123/searchteams.php?t=Arsenal HTTP/1.1
Host: www.thesportsdb.com
```

v2 uses a header:

```http
GET /api/v2/json/livescore/soccer HTTP/1.1
Host: www.thesportsdb.com
X-API-KEY: <api-key>
```

## Rate Limits

The docs state that rate limits vary by tier and that the service returns HTTP
`429` when a client exceeds the limit.

| Tier | Documented rate |
|---|---:|
| Free | 30 requests per minute |
| Premium | 100 requests per minute |
| Business | 120 requests per minute |

For workers, bots, and cron jobs, cache lookups and de-duplicate event polling.

## Images

Returned team/player/event payloads often include artwork URLs. The docs note
that previews can be requested by appending `/medium`, `/small`, or `/tiny` to
image URLs. Do not assume every entity has every artwork type.
