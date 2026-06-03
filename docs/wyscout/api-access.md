---
source_url: https://apidocs.wyscout.com/
source_type: crawled
upstream_version: v3 2024-03-12 / v4 2024-05-09
crawled_at: 2026-06-03
---

# Wyscout API Access

## Overview

Wyscout is a **commercial football data provider** owned by Hudl. Access requires a paid license — there is no free public tier of the REST API. The product documentation is published as an OpenAPI (Redoc) portal at [apidocs.wyscout.com](https://apidocs.wyscout.com/), and the data dictionary at [dataglossary.wyscout.com](https://dataglossary.wyscout.com/).

This document is sourced from the live OpenAPI specs behind the docs portal (`assets/specs/prod/current.yml` = v3, `next.yml` = v4 preview, `legacy.yml` = v2). Endpoint inventories live in [api-endpoints.md](api-endpoints.md); the event payload in [data-model.md](data-model.md); the event taxonomy in [event-types.md](event-types.md).

## Authentication

HTTP **Basic Access Authentication**. You are issued a username and password; supply them on every request.

```bash
curl -u "username:password" "https://apirest.wyscout.com/v3/matches/5012345"
```

To build the header manually:

1. Build the string `username:password`.
2. Base64-encode it.
3. Send `Authorization: Basic <encoded>`.

For example `Aladdin:OpenSesame` encodes to `QWxhZGRpbjpPcGVuU2VzYW1l`, so the header is `Authorization: Basic QWxhZGRpbjpPcGVuU2VzYW1l`.

Python:

```python
import requests
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth("your_username", "your_password")
r = requests.get("https://apirest.wyscout.com/v3/matches/5012345", auth=auth)
r.raise_for_status()
data = r.json()
```

## Base URLs and versions

| Version | Base URL | Spec slug | Status |
|---|---|---|---|
| **v4** | `https://apirest.wyscout.com/v4` | `next` | **Preview** (beta of the next release) |
| **v3** | `https://apirest.wyscout.com/v3` | `current` | **Current** (latest stable) |
| v2 | `https://apirest.wyscout.com/v2` | `legacy` | Legacy (still running) |

Most existing integrations run on **v3**. **v4** is the preview track where new endpoints land first — notably broadcast tracking, physical data, and match attack directions (see [api-endpoints.md](api-endpoints.md)). Anyone who started building on Wyscout recently may have begun on v4.

## Versioning model

Wyscout maintains three parallel sets of endpoints:

- **Current** — the latest stable version with the most recent endpoints and improvements.
- **Preview** — the beta of the next official release; new endpoints are implemented here first.
- **Legacy** — the previous version, kept running so users can migrate.

When a new **Current** is released, the previous Current becomes **Legacy** and remains available for at least six months before being retired (i.e. until the *next* Current ships). Documentation on apidocs.wyscout.com stays available for the Legacy version too. The version is selected by the base-URL path segment (`/v2`, `/v3`, `/v4`) — there is no version header.

## Rate limits

The API enforces **12 requests per second per API key**. Exceeding it returns HTTP `429`:

```json
{
  "error": {
    "code": 429,
    "message": "Too many requests"
  }
}
```

## Pagination

List endpoints (e.g. `/competitions/{wyId}/players`, `/seasons/{wyId}/players`) accept:

| Param | Meaning |
|---|---|
| `limit` (alias `count`) | Results per page (max **100**) |
| `page` | Page number (current page) |
| `sort` | Sort the result set by a given field and direction |
| `search` | Simple OR search across defined search fields |
| `filter` | Simple AND/EQUAL filter on a given field |

Paged responses wrap results in a `meta` envelope alongside the data array.

## Related-object expansion (`fetch` / `details` / `exclude`)

Many endpoints support querystring expansion so you can avoid extra round-trips:

- **`fetch`** — embed related top-level objects (e.g. `fetch=competition,season,round`).
- **`details`** — embed nested detail objects (e.g. `details=teams,players`; on `/events`, `details=tag`).
- **`exclude`** — drop sections from the payload to shrink responses (on `/events`: `possessions`, `names`, `positions`, `formations`).

Values are comma-separated. The accepted values differ per endpoint — see [api-endpoints.md](api-endpoints.md).

## Identifiers

Every resource (competition, season, team, player, match, coach, referee, round, area) is keyed by an integer **`wyId`** (Wyscout ID). Path parameters are named `wyId` (or `matchWyId`, `matchId`). Areas additionally use a three-letter code (`areaId`, e.g. `ENG`). See [identity-surfaces.md](identity-surfaces.md) for cross-provider ID mapping.

## Data availability

- **Event data** — top leagues, broadly from 2014/15 onward (coverage varies by competition).
- **Advanced stats** — aggregated xG/xA/PPDA and progressive metrics; see [data-model.md](data-model.md).
- **Video** — match video endpoints exist (`/videos/{matchId}`) but availability depends on licence.
- **Broadcast tracking** — v4 only, via `/matches/{wyId}/fulltracking` (returns a download URL to a tracking JSON file). Historically Wyscout was event-data only; v4 adds optical/broadcast tracking where available.
- **Physical data** — v4 only, via `/matches/{wyId}/physicaldata` (per-player physical metrics by match phase, where available).

## Loading Wyscout data (kloppy)

There is no official Python SDK. For loading event data into analysis pipelines, use **kloppy**, which understands the Wyscout v2 and v3 event JSON formats:

```python
from kloppy import wyscout

dataset = wyscout.load(event_data="events.json", data_version="V3")
df = dataset.to_df()
```

A minimal direct client:

```python
import requests
from requests.auth import HTTPBasicAuth

class WyscoutClient:
    def __init__(self, username, password, version="v3"):
        self.base = f"https://apirest.wyscout.com/{version}"
        self.auth = HTTPBasicAuth(username, password)

    def get(self, path, **params):
        r = requests.get(f"{self.base}{path}", auth=self.auth, params=params)
        r.raise_for_status()
        return r.json()

    def match_events(self, match_id, **params):
        return self.get(f"/matches/{match_id}/events", **params)
```

## Open / academic data

Wyscout has historically offered discounted or free access for academic research (contact Hudl/Wyscout; some universities hold institutional licences). A widely-cited **public open dataset** (Pappalardo et al.) covers the 2017/18 top-5 leagues, the 2018 World Cup and Euro 2016 in the older **v2** event format:

- <https://figshare.com/collections/Soccer_match_event_dataset/4415000>

Note this open dataset predates the v3/v4 event model documented here — its event/tag taxonomy differs from the current schema.
