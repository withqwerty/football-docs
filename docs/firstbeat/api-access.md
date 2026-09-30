---
source_type: curated
source_url: https://apidocs.firstbeat.com/getting-started/
upstream_version: Firstbeat Cloud API 1.1.0 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# Firstbeat API Access

## Overview

Firstbeat Sports records athletes' heart rate and movement with its own sensors and
analyses the data in Sports Cloud. The Firstbeat Sports Cloud API returns that
analysis for the customer accounts an API consumer may access.

- Documentation: https://apidocs.firstbeat.com/
- OpenAPI spec (3.0.1, `info.version` "1.1.0"):
  https://apidocs.firstbeat.com/assets/api-specification/openapi.json
- Local snapshot: `specs/firstbeat/openapi.json`
- Base URL (the spec's server): `https://api.firstbeat.com/v1`
- Variable list: https://apidocs.firstbeat.com/variables/ (see Firstbeat variables)
- API support contact in the spec: sports-cloud-api@firstbeat.com

## Who can use the API

From the documentation home page, checked 2026-09-30:

| Subscription level | What the page says you get |
|---|---|
| Standard | "No API access by default. A feature purchase adds the ability to connect through an existing API Partner system (e.g. gpexe, Teamworks), not a standalone API client of your own." |
| Premium | "Connect through an existing API Partner system, included in your subscription, no separate purchase needed." |
| Premium+ | "Full access: build and use your own API client, in addition to API Partner connections." |

The page names these API partners as examples: gpexe, XPS Network, Kinexon, Kitman
Lab, Apollo V2, Teamworks and SAP Sports One. It asks AMS vendors and other
collaborators to contact sports@firstbeat.com.

## Registration steps

The "Getting Started" page lists five steps:

1. Register: `POST /account/register` with a JSON body `{"consumerName": "..."}`
   (2 to 100 characters). It needs no authentication. The response holds `id`,
   `consumerName` and `sharedSecret`. The page says each call creates a new API
   consumer, even with the same name, and the name cannot be changed later.
2. Get approval: email sports-cloud-api@firstbeat.com with the `consumerName`, the
   `id`, the customer account names to link and contact people. Firstbeat approves
   the consumer and links it to those accounts.
3. Grant access: a Coach on the customer account opens Sports Cloud settings, then
   "Cloud API", accepts the licence agreement, selects the API consumer and ticks
   the account. The page says only Coaches can grant or revoke API access.
4. Authenticate: create a JWT and get an API key (below).
5. Test: `GET /sports/accounts` lists the accounts the consumer can read.

## Authentication

- JWT: sign with HS256 using the `sharedSecret`. The payload is `iss` (the consumer
  `id`), `iat` and `exp`. The page says "Tokens must be valid for a maximum of 5
  minutes." Send it as `Authorization: Bearer <token>`.
- API key: `GET /account/api-key` with the JWT returns the key. The page says the key
  is generated once and stays the same on later calls. Send it as `x-api-key`.
- Which endpoints need what, from the page: `/account/register` needs no
  authentication; `/account/api-key` needs the JWT only; every other endpoint needs
  both the `Authorization` header and the `x-api-key` header.
- Secret rotation: `GET /account/new-secret` returns a new `sharedSecret`, and
  `POST /account/new-secret/confirm`, called with a JWT signed by the new secret,
  confirms it and invalidates the old one.
- The spec itself declares no `securitySchemes`; it lists `Authorization` and
  `x-api-key` as required header parameters on each operation.

Keep the `sharedSecret` and API key out of code, for example in
`FIRSTBEAT_SHARED_SECRET` and `FIRSTBEAT_API_KEY`.

```python
import os, time, jwt, requests

consumer_id = os.environ["FIRSTBEAT_CONSUMER_ID"]
now = int(time.time())
token = jwt.encode({"iss": consumer_id, "iat": now, "exp": now + 300},
                   os.environ["FIRSTBEAT_SHARED_SECRET"], algorithm="HS256")
accounts = requests.get(
    "https://api.firstbeat.com/v1/sports/accounts",
    headers={"Authorization": f"Bearer {token}", "x-api-key": os.environ["FIRSTBEAT_API_KEY"]},
).json()
```

## Usage limits

From the "Usage Limits" page (https://apidocs.firstbeat.com/usage-limits/), checked
2026-09-30. Limits apply per API consumer, and accounts linked to one consumer share
them.

| Usage limit | Value | Description on the page |
|---|---|---|
| Rate limit | 1 requests per second | Token bucket refilling at 1 token/sec |
| Burst | 60 requests / minute | Token bucket with 60 token capacity |
| Daily quota | 5000 requests / day | Fixed window that resets every day at 00:00:00 (midnight) UTC |

When a limit is exceeded the API returns HTTP `429`, with an `x-amzn-ErrorType`
header:

| Header value | Cause |
|---|---|
| `LimitExceededException` | Daily quota exceeded |
| `ThrottledException` | Per-minute rate limit exceeded |

The page says the API gives no way to read the remaining quota, and returns no
remaining-quota header. Limits can be changed on request.

## Asynchronous results and payload size

The four `/results` endpoints can return:

- `202`: "Accepted. Analysis job is in progress. You should wait 5 seconds and then
  run the same request again."
- `204`: "No Content. Analysis job has failed."
- `413`: "Response Too Large".

The "Querying the API" page says `format=list` decodes time series on the server,
and recommends client-side decoding "to save bandwidth and avoid possible problems of
hitting the max 6MB response payload size".

## Terms

The documentation site footer reads "© 2026 Firstbeat Technologies". No licence
for reusing the documentation was found. The data licence is the agreement a Coach
accepts in Sports Cloud (registration step 3); its text is not public.
