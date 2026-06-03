---
source_url: https://skillcorner.com/api/docs/
source_type: crawled
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner API Access

## Overview

SkillCorner is a **commercial tracking-data provider** specialising in **broadcast (optical) tracking**, **physical data**, and **Game Intelligence** (off-ball runs, on-ball engagements, passing options, player possessions). The REST API is documented with Swagger (drf-yasg) at [skillcorner.com/api/docs/](https://skillcorner.com/api/docs/); this doc is sourced from its OpenAPI spec (`specs/skillcorner/skillcorner_openapi.json`).

- Base URL: `https://skillcorner.com/api`
- Glossary & material: <https://skillcorner.crunch.help/en>
- Endpoint inventory: [api-endpoints.md](api-endpoints.md) · data model: [data-model.md](data-model.md) · physical metrics: [physical-data.md](physical-data.md) · concepts: [concepts.md](concepts.md)

## Authentication

Two schemes (either works):

- **Basic auth** — username/password.
- **API key** — pass `?token=<key>` as a query parameter.

The official **`skillcorner`** Python client wraps this:

```python
from skillcorner.client import SkillcornerClient

client = SkillcornerClient(username="...", password="...")
teams = client.get_teams()
physical = client.get_physical(params={"competition_edition": [123], "group_by": ["player"]})
```

(See also `skillcornerviz` and `skillcorner-toolkit`.) Docs: <https://skillcorner.readthedocs.io/>.

## Multi-value parameters

Many filter params accept **multiple comma-separated values** in the URL (e.g. `?competition=1,2,3`). In Swagger UI you enter each ID as a separate value and they are combined into one parameter. With the Python client, pass a list.

## Pagination

Two styles depending on endpoint:

- **`limit` / `offset`** — classic paging (master-data and list endpoints), often with a `count`/`next`/`previous` envelope.
- **`after`** cursor — some large endpoints (e.g. `/physical/`) return a `next` value; pass it back as `after` for the next page.

## Rate limiting

Endpoints return `429 Too Many Requests` when exceeded; back off and retry. (No fixed per-second figure is published in the spec — the official client paces requests.)

## Response formats

- **List/metric endpoints** return JSON. `/physical/` additionally accepts `response_format` ∈ `json`, `small_json`, `csv` (this toggle is `/physical/`-only; the GI-metric endpoints always return JSON).
- **Tracking** (`/match/{id}/tracking/`) returns a **downloadable file**: `file_format` ∈ `jsonl` (one JSON object per line), `fifa-xml`, or `fifa-data` (FIFA EPTS standard — a metadata `.xml` + data `.txt`). Current `data_version` is `3`.
- **Dynamic events** (`/match/{id}/dynamic_events/...`) return **CSV files** (`file_format`, `data_version`, `period_starts`).

## Data versions

SkillCorner versions its data products independently. Current versions seen in the spec: **tracking v3**, **physical v3**, **dynamic events v2**, **GI metrics v2**. The `/matches/` endpoint exposes `*_last_modified__gte` filters per product (e.g. `tracking_last_modified__gte`, `physical_v3_last_modified__gte`, `dynamic_events_v2_last_modified__gte`) for incremental sync.

## Custom feeds

Endpoints under `/match/{id}/custom/...`, `/matches/custom/` and `/data_collections/custom/` serve **customer-specific** computed feeds (the standard, non-custom endpoints serve SkillCorner's catalogue products). `/data_collections/` tells you which data products are available for which matches.

## Deprecated

`/beta/out_of_possession/` and `/in_possession/{off_ball_runs,on_ball_pressures,passes}/` are **Game Intelligence V1 (deprecated)**. Use the `dynamic_events` and `metrics/game_intelligence` endpoints (V2) instead.
