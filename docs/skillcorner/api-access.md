---
source_url: https://www.skillcorner.com/apidocs.json
archived_url: https://web.archive.org/web/20261125124623/https://www.skillcorner.com/apidocs.json
source_type: crawled
upstream_version: SkillCorner API (OpenAPI 3.1)
crawled_at: 2026-08-31
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

- **List/metric endpoints** return JSON. `/physical/` additionally accepts `response_format` ∈ `json`, `small_json`, `csv`, `nested_json` ("small_json: data_version 3.x only; nested_json: data_version=4.0 only"). The GI-metric endpoints always return JSON.
- **Tracking** (`/match/{id}/tracking/`) returns a **downloadable file**: `file_format` ∈ `jsonl` (one JSON object per line), `fifa-xml`, or `fifa-data` (FIFA EPTS standard — a metadata `.xml` + data `.txt`). `data_version` ∈ `3.0`, `4.0` (default `3.0`). `frame_rate` (`10` or `25` fps) and `file_format=parquet` are "only available for data_version >= 4.0"; the spec fetched on 2026-11-24 is the first to list `4.0` and `parquet` in its enums.
- **Dynamic events** (`/match/{id}/dynamic_events/...`) return **CSV files** (`file_format`, `data_version`, `period_starts`).
- **Physical events** (`/match/{id}/physical_events/`, physical v4.0 only) return a file: `file_format` ∈ `csv` (default), `json`, `sportscode-xml`, `matchtracker-xml`, `focus-json`.

## Data versions

SkillCorner versions its data products independently. Versions in the 2026-08-31 spec: **tracking v3**, **physical v3** (with a `physical_v3_0_3` point release), **dynamic events v3**, **GI metrics v2**. The `/matches/` and `/matches/custom/` endpoints expose `*_last_modified__gte` filters per product for incremental sync — `tracking_last_modified__gte`, `physical_v3_last_modified__gte`, `physical_v3_0_3_last_modified__gte`, `dynamic_events_v2_last_modified__gte`, `dynamic_events_v3_last_modified__gte` — and match records carry the matching `*_check` and `*_last_modified` fields, including `dynamic_events_v3_check`.

Dynamic events v2 filters remain in the spec alongside v3, so a sync job written
against v2 keeps working; point new work at the v3 filters.

### Version 4 (spec fetched on 2026-11-24)

The spec fetched on 2026-11-24 adds a version 4 for tracking and physical data:

- **Tracking `4.0`** is selectable on the tracking endpoints, with `frame_rate` and `file_format=parquet`. The default stays `3.0`.
- **Physical `4.0`** is selectable on `/physical/` and `custom/physical/` (the default stays `3.0.3`). It adds the main-referee endpoints (`/physical/referee/`, `/match/{id}/custom/physical/referee/`) and the physical-events endpoints (`/match/{id}/physical_events/`, `/match/{id}/custom/physical_events/`). See [physical-data.md](physical-data.md#physical-v40).
- New sync filters on `/matches/` and `/matches/custom/`: `extrapolated_tracking_v4_last_modified__gte`, `physical_v4_0_last_modified__gte`, `physical_events_v4_0_last_modified__gte`.
- New data-collection fields: `physical_v4_0_last_modified`, `physical_v4_0_quality_index`, `physical_events_v4_0_last_modified`, `tracking_extra_v4_last_modified`, `tracking_extra_v4_ball_quality_index`, `tracking_extra_v4_players_quality_index`, `goal_event_provider_used_v4`, `shot_event_provider_used_v4`.

## Custom feeds

Endpoints under `/match/{id}/custom/...`, `/matches/custom/` and `/data_collections/custom/` serve **customer-specific** computed feeds (the standard, non-custom endpoints serve SkillCorner's catalogue products). `/data_collections/` tells you which data products are available for which matches.

## Removed

`/beta/out_of_possession/` and `/in_possession/{off_ball_runs,on_ball_pressures,passes}/` were **Game Intelligence V1**. The spec fetched on 2026-11-03 no longer lists them, or their per-match forms under `/match/{id}/custom/`. Use the `dynamic_events` and `metrics/game_intelligence` endpoints (V2) instead.
