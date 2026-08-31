---
source_url: https://www.transferroom.com/api-docs
source_type: crawled
upstream_version: null
crawled_at: 2026-08-31
---

# TransferRoom API Access

## Overview

TransferRoom exposes a commercial club API for integrating transfer-market and recruitment data into internal club systems. The public documentation describes JSON endpoints for players, competitions, head coaches, teams, transfers, received pitches, requirements, and injury data.

- Public docs page: `https://www.transferroom.com/api-docs`
- Embedded docs app: `https://proud-island-049eed003.2.azurestaticapps.net/` (loaded in an iframe by the public docs page; it replaced a Vercel-hosted app that is now offline)
- Contact/access page linked by the docs: `https://www.transferroom.com/features/club-api`
- Production API host shown in examples: `https://apiprod.transferroom.com`
- API namespace shown in examples: `/api/external/...`

The docs page says the API is intended to let clubs "extract TransferRoom's unique transfer market data" in JSON format for integration into internal databases.

## Access packages

The documentation splits buyers into two groups, each with its own packages. A
2026 revision replaced the earlier "Lite API / Advanced API" naming, so code or
notes written against those names refer to a model the docs no longer use.

**Market Place Subscribers — 2 tiers**

| Tier | Publicly documented data |
|---|---|
| Core API | Advanced player data including estimated salaries, contract information and GBE scores; head coach data; team data; transfer history; pitches received on TransferRoom. |
| Advanced Injury Data (AID) | Injury data covering 50 leagues, 25 data points per injury including type, duration, expected return date and recurrence rates, history back to 2017, and predictive metrics including recurrence risk, injury risk rating and fatigue rating. |

**3rd Party Subscribers — 6 packages**

| Package | Publicly documented data |
|---|---|
| Global Football Database | Player identity, current and parent team, contract expiry, positions, height, career history; team ID, name, competition, division level; head coach identity, current team and role, career history, contract expiry. |
| Performance Intelligence | Player TR rating and potential rating, playing style, GBE score and breakdown, percentage of available minutes, points added; team average starter rating, team rating and history. |
| Transfer Intelligence | Player xTV, base value, book value, xTV change over 6 and 12 months and history, full transfer history since 2013; team total xTV, base and book value, transfer spend, predicted requirements. |
| Financial Intelligence | Player estimated gross and net salary; team gross and net salary benchmarks and estimated taxation rates. |
| Head Coach Intelligence | Head coach TR rating and rating change, tactical style, team rating impact, trust in youth, formation, rotation, and three-season average spend. |
| Injury | Player injury risk rating and xAvailability, current workload, minutes played over 3, 6 and 12 months; per injury body part, type, dates, days out, surgery, recurrence, sources and statistical benchmarks. |

Availability is documented per data point rather than per endpoint: each endpoint
page carries a table mapping every response field to the packages that include
it. Some fields, such as head coach `Suitability`, are marked club users only.

## Authentication

The docs show a login call that returns a bearer token:

```python
import requests

email = "example@transferroom.com"
password = "example_p4ssW0rd"

auth_url = "https://apiprod.transferroom.com/api/external/login?email=" + email + "&password=" + password
response = requests.post(auth_url)
token = response.json()["token"]
```

The docs state that bearer tokens expire after one month and must then be
regenerated. Subsequent requests send the token in the `Authorization` header:

```python
headers = {"Authorization": "Bearer " + token}
response = requests.get(
    "https://apiprod.transferroom.com/api/external/players?position=0&amount=100",
    headers=headers,
)
```

Operational note: because the public example passes credentials as query parameters, avoid logging request URLs, reverse-proxy access logs, shell history, or monitoring traces that could capture the full login URL.

## Rate limits

The public docs state that requests are rate limited to **300 requests per minute across all endpoints**.

## Pagination

List endpoints shown in the docs use offset-style pagination:

| Parameter | Meaning |
|---|---|
| `position` | Starting point in the list. Defaults to `0` where documented. |
| `amount` | Number of results to return. Defaults to `1000` and maxes at `10000` where documented. |

The examples use `position=0&amount=100` or `position=0&amount=1000` for list extracts.

## Common request pattern

```python
import requests

headers = {"Authorization": "Bearer " + token}

request_url = "https://apiprod.transferroom.com/api/external/players?position=0&amount=100"
response = requests.get(request_url, headers=headers)
data = response.json()
```

## Public documentation limits

The public docs do not expose a downloadable OpenAPI/Swagger specification. Endpoint paths, examples, permissions, query parameters, rate limit, and sample response fields are visible, but exact error schemas, status codes, and full authentication contract are not described in the public page.

