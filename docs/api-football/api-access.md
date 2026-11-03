---
source_url: https://www.api-football.com/documentation-v3
source_type: curated
upstream_version: 3.9.3
crawled_at: 2026-10-16
---

# API-Football v3 access

API-Football is the football API from API-SPORTS. These original reference
notes cover access and selected football endpoints, not a complete mirror of
the provider's portal. Official documentation version 3.9.3 was checked on
2026-10-15. Direct-access response structures were checked on the same date.
Access guidance was revised on 2026-10-16: RapidAPI references below are
historical, not a verified current access path. Direct Free-plan checks were
executed on 2026-10-16; their scope and season restriction are described below.

## API-Football direct API-SPORTS access

Use direct API-SPORTS access and its dashboard for account setup. This is the
access path verified for this reference with both paid and Free accounts.

| Access path | Base URL | Request headers | Verification |
|---|---|---|---|
| Direct API-SPORTS | `https://v3.football.api-sports.io` | `x-apisports-key: YOUR_API_KEY` | Successful paid GET requests on 2026-10-15 and Free checks on 2026-10-16 |

For direct access, the fixture path is `/fixtures`. The direct API
documentation specifies GET requests and an allowed request-header list
containing `x-apisports-key`. Check its CORS restrictions when using a
framework that adds custom headers.
Source: [API-Football authentication](https://www.api-football.com/documentation-v3#section/Authentication).

**Historical note only — not setup instructions:** older material used the
RapidAPI base `https://api-football-v1.p.rapidapi.com/v3` with `X-RapidAPI-Key`
and `X-RapidAPI-Host` headers, rather than the direct API-SPORTS URL/key.
Do not use that historical gateway for new setup or send a direct-access key
there; current availability not verified. Sources: [older provider URL example](https://www.api-football.com/news/post/how-to-get-all-teams-and-their-ids)
and [RapidAPI header protocol](https://docs.rapidapi.com/v2/docs/configuring-api-authentication).

## API-Football plans and rate limits

API-Football's direct-access quotas below were checked on 2026-10-15. Daily
allocation and request rate are separate limits. These quotas apply to
direct API-SPORTS access.

| Direct plan | Requests per day | Requests per minute |
|---|---|---|
| Free | 100 | 10 |
| Pro | 7,500 | 300 |
| Ultra | 75,000 | 450 |
| Mega | 150,000 | 900 |

The pricing page restricts the seasons available on Free. Choose a season
available to the account; a successful paid-plan request is not evidence that
the same request is included on Free. This reference does not fix a list of
Free seasons or promise identical coverage across plans.

In direct Free checks on 2026-10-16, `/status` identified an active Free plan
and headers reported 100 daily requests and 10 requests per minute.
`/fixtures?league=140&season=2024&team=541&status=FT` returned 38 fixtures
without errors. The same league/team with `season=2026` returned HTTP 200,
zero results, an empty response and an `errors.plan` field. An HTTP-success
code alone does not establish season access. This is a dated check of two
seasons, not a permanent list of Free coverage. Successful Free samples also
covered league/team metadata, events, lineups, team and player match
statistics, standings, two player-statistics pages without overlapping IDs,
current squads, injuries and transfers for the selected context.

Successful direct samples included these response headers (header names are case-insensitive):

| Header | Meaning |
|---|---|
| `x-ratelimit-requests-limit` | Daily allocation |
| `x-ratelimit-requests-remaining` | Daily requests remaining |
| `X-RateLimit-Limit` | Maximum requests per minute |
| `X-RateLimit-Remaining` | Requests remaining in the minute window |

All four headers were present in the successful paid and Free samples. They
were absent in the sampled Free season-restriction response, so clients must
tolerate missing quota headers on errors. The provider documents HTTP 429 for excessive request rate, with an `errors` object in its example.
Do not assume every `errors` value is an array just because successful
responses contain `[]`. No rate-limit failure was deliberately triggered.
The provider also warns that excessive traffic can cause a firewall block.

Sources: [direct plans](https://www.api-football.com/pricing),
[rate-limit policy, published 2026-06-12](https://www.api-football.com/news/post/how-ratelimit-works),
[authentication and response headers](https://www.api-football.com/documentation-v3#section/Authentication).

## API-Football account status and response errors

`GET /status` on the direct API returns account, subscription and request-quota
information. The portal says this call does not count against the daily
quota. Keep account details and credentials out of logs and shared examples.

The successful 2026-10-15 status sample had `errors: []`, an object in
`response`, and `results: 0`, despite an active subscription. Other sampled
football endpoints returned arrays in `response`. Do not implement a universal
"results equals zero means authentication failed" rule. Check HTTP status,
`errors` and the endpoint's response shape.

A separate validation check, `/players?team=541` without the required season,
returned HTTP 200 with an `errors` object containing a season error, zero
results and an empty response array. HTTP 200 alone does not establish a
successful data query. Empty events and lineups for a scheduled fixture were
also checked: those had no errors and are different from this parameter error.

Source: [API-SPORTS account and status](https://www.api-football.com/documentation-v3#section/Authentication/API-SPORTS-Account).
The status result above is a dated observation, not a guarantee about future
responses.

## API-Football football endpoint selection

These GET endpoints cover the first API-Football data-model reference. Their
paths and relevant parameters were checked against documentation v3.9.3;
each row also had a successful direct-access sample on 2026-10-15. Parameters
shown here identify useful queries, not every valid combination.

| Endpoint | Selected query parameters | Response context |
|---|---|---|
| `GET /leagues` | `id`, `season` | Competition, country and available seasons with coverage |
| `GET /teams` | `id` | Team and venue |
| `GET /fixtures` | `league`, `season`, `team`, `status` | Matches and scores |
| `GET /fixtures/events` | `fixture` | Goals, cards, substitutions and VAR incidents |
| `GET /fixtures/lineups` | `fixture` | Formation, coach, starters and substitutes |
| `GET /fixtures/statistics` | `fixture` | Team-level match statistics |
| `GET /fixtures/players` | `fixture` | Player-level match statistics, grouped by team |
| `GET /standings` | `league`, `season` | Competition standings, grouped in nested arrays |
| `GET /players` | `team`, `league`, `season`, `page` | Player profiles and contextual season statistics |
| `GET /players/squads` | `team` | Current squad |
| `GET /injuries` | `team`, `league`, `season` | Player absences in fixture context |
| `GET /transfers` | `team` | Available transfer records |
| `GET /fixtures/rounds` | `league`, `season`, `dates` | Round labels with date ranges when requested |
| `GET /fixtures/headtohead` | `h2h`, `last` | Selected fixtures between two team IDs |
| `GET /players/profiles` | `player` | Player profile |
| `GET /players/teams` | `player` | Teams associated with a player |

`/fixtures/rounds` accepts a boolean `dates` option, documented default false;
`dates=true` was checked and returned round/date objects.
`/fixtures/statistics` accepts boolean `half`, documented default false, with
half data documented from season 2024. The checked `half=true` response
contained `statistics_1h` and `statistics_2h` arrays alongside `statistics`.
`/injuries?ids=...` was checked for one and for two fixture IDs. The documented
maximum is 20; the boundary itself was not tested.

The fixtures portal documents `id` and `ids` queries with extended events,
lineups, fixture statistics and player statistics. A single-ID request and a
two-ID batch were checked for those blocks. `ids` is documented to accept up
to 20 hyphen-separated fixture IDs; that boundary was not tested. Do not
assume a league-filtered fixture list contains those same extended blocks.

Source: [API-Football endpoint reference](https://www.api-football.com/documentation-v3#tag/Fixtures/operation/get-fixtures).
See [data-model.md](data-model.md) for the sampled fields and limitations.

## API-Football players pagination and current squads

`GET /players` uses the `page` query parameter and documents 20 results per
page. In the checked query, `page=1` returned 20 results with
`paging.current=1` and `paging.total=4`. All four pages were checked: 20, 20,
20 and 2 records, with 62 distinct player IDs and no overlap between pages in
this query. Use the returned pagination metadata instead of assuming that
the first response is the complete player list.

`GET /players/squads?team=...` returns a current squad, not a season-filtered
historical squad. The documented parameters are `team` and `player`, not
`season`; the `player` form returns associated teams. Season statistics from
`/players` are a different resource and can contain multiple competitive
contexts for the same player. Both `team` and `player` query forms were checked.

Sources: [player statistics](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players),
[squads](https://www.api-football.com/documentation-v3#tag/Players/operation/get-players-squads).

## API-Football Python GET example

This standard-library example uses direct access. Set `API_FOOTBALL_KEY` in
the process environment. It reads a selected league response and prints only
the result count; it does not print credentials or the response payload.
The example was executed successfully on 2026-10-15 with a paid account.

```python
import json
import os
import urllib.request

request = urllib.request.Request(
    "https://v3.football.api-sports.io/leagues?id=140&season=2024",
    headers={"x-apisports-key": os.environ["API_FOOTBALL_KEY"]},
)
with urllib.request.urlopen(request, timeout=30) as response:
    data = json.load(response)
if data.get("errors"):
    raise RuntimeError("API-Football reported an error")
print(data["results"])
```

This is one GET example, not a polling client. HTTP and transport exceptions
propagate to the caller. Check quota headers and subscription coverage before
using it in a recurring pipeline. Source: [direct authentication](https://www.api-football.com/documentation-v3#section/Authentication).

## API-Football data sources and verification limits

API-Football's [terms](https://www.api-football.com/terms), checked on
2026-10-15, refer to data supplied by partners but do not name the upstream
collectors or licensors. Record the collection/licensing provenance as **not
publicly documented** beyond that statement; do not assign a particular
upstream provider or describe every field as first-party or derived.

These docs contain original summaries of public documentation and dated
structural observations. A subscription is required for the sampled data API;
this reference grants no rights in the underlying data, images or trademarks.
Raw API payloads and account details are not included. The structural evidence
is in `data/api-football-observations.json`; separate Free checks are in
`data/api-football-free-observations.json`.

The main direct samples cover league 140, team 541, completed fixtures in
season 2024 and scheduled fixtures in season 2026. Head-to-head, squad and
transfer queries are not restricted to that season pair. The observations
include successful data, legitimate empty responses and a parameter error;
they do not establish every possible type, competition or status. Update
frequencies in the portal are indicative, not guaranteed. Free checks are
separate from the paid samples used for the field/type tables. Only direct
API-SPORTS access is covered by the setup instructions and live checks.
