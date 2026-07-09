---
source_url: https://www.transferroom.com/api-docs
source_type: crawled
upstream_version: null
crawled_at: 2026-07-09
---

# TransferRoom API Access

## Overview

TransferRoom exposes a commercial club API for integrating transfer-market and recruitment data into internal club systems. The public documentation describes JSON endpoints for players, competitions, head coaches, teams, transfers, received pitches, requirements, and injury data.

- Public docs page: `https://www.transferroom.com/api-docs`
- Embedded docs app: `https://v0-simple-api-documentation-templat.vercel.app/`
- Contact/access page linked by the docs: `https://www.transferroom.com/features/club-api`
- Production API host shown in examples: `https://apiprod.transferroom.com`
- API namespace shown in examples: `/api/external/...`

The docs page says the API is intended to let clubs "extract TransferRoom's unique transfer market data" in JSON format for integration into internal databases.

## Access levels

Access is subscription-tier dependent and can also be bought standalone. The public docs describe three access groupings:

| Access level | Publicly documented data |
|---|---|
| Lite API | Basic player identifiers, xTV (Expected Transfer Value), agency information, and player rating. |
| Advanced API | All Lite features plus advanced player data, estimated salaries, contract information, GBE scores, head coach data, team data, transfer data, and pitches received on TransferRoom. |
| Advanced Injury Data | Injury data across 50 leagues, injury records across 25 data points, historical data back to 2017, recurrence risk, player injury risk rating, and fatigue/workload style metrics. |

Endpoint availability is tied to these access levels. For example, the public docs mark requirements and pitches as Advanced API endpoints, and injury endpoints as Advanced Injury Data endpoints.

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

Subsequent requests send the token in the `Authorization` header:

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

