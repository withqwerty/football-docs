---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
---

# Impect Open Data: Overview

Impect is a German football data provider whose analytics are built around
**Packing** (counting bypassed opponents) and **pxT** (Packing Expected Threat,
a possession-value model). This documentation set describes Impect's
**open-data repository** — the only Impect source indexed here.

- **Repository**: [github.com/ImpectAPI/open-data](https://github.com/ImpectAPI/open-data)
- **Format**: JSON files, one per match or per iteration
- **Coverage**: Bundesliga 2023/24 (`iterationId` 743) — 306 matches
- **In-repo reference**: `Documentation.pdf` (field-by-field descriptions and appendices)

> **Scope note.** These docs cover the open-data repository only. Impect's
> commercial products and customer-facing API are not documented here. If you
> need those, contact Impect directly — do not infer an API surface from this
> material.

## What the snapshot is (and is not)

The open-data repository is a **static snapshot**, published to show what Impect
provides and how it is structured. Treat it as a *representative* picture of
Impect's data structure and metric definitions, **not** a complete or current
mirror of the live product.

In particular:

- It is a single competition-season (Bundesliga 2023/24), not Impect's full coverage.
- Impect regularly enriches and adjusts data points in the live product. Fields,
  enum members and KPI sets can differ from what appears in this snapshot.
- The snapshot carries `dataVersion: "V3"`. Impect's own documentation marks
  several attributes as available only from **dataV4+** / seasons starting summer
  2024. Those are described in [data-model.md](data-model.md) and flagged as
  *not populated in the snapshot* where that is the case.

Anything an agent asserts about Impect beyond what is in this repository is a
guess. Prefer "the open data does not show this" over inference.

## What is in the repository

| Path | Contents | Filename key |
|---|---|---|
| `data/events/` | Full event feed per match | match ID |
| `data/events_kpis/` | Event-level KPI values | match ID |
| `data/player_kpis/` | KPI aggregates per player per position per match | match ID |
| `data/lineups/` | Line-ups, substitutions, tactical changes, formations | match ID |
| `data/matches/` | Match metadata for the iteration | iteration ID |
| `data/players/` | Player master data | iteration ID |
| `data/squads/` | Squad master data | iteration ID |
| `data/countries.json` | Country names, ISO and FIFA codes | — |
| `data/iterations.json` | Competition-season metadata | — |
| `data/kpi_definitions.json` | KPI names, labels, definitions and meanings | — |

Impect states the uploaded files are an exact match to the files their API
returns for the same endpoints, so the payload shapes documented here are the
shapes Impect delivers.

See [data-model.md](data-model.md) for the payload schema of each file.

## Loading the data

Directly with pandas:

```python
import pandas as pd

df = pd.read_json("data/events/events_122838.json")
print(df.head())
```

Via [kloppy](https://kloppy.pysport.org/), which has a first-class Impect
deserialiser and will normalise coordinates and event types into its own model:

```python
from kloppy import impect

events = impect.load_open_data(match_id=122840)   # open data
# impect.load(...) is the entry point for non-open data
```

Requires `kloppy>=3.18.0`. kloppy's transform/filter/export chain then applies as
usual:

```python
df = (
    events.transform(to_orientation="STATIC_HOME_AWAY")
    .filter(lambda event: event.period.id == 1)
    .to_df(engine="polars")
)
```

## Joining the files

The join keys are plain integer IDs:

- `events_kpis[].eventId` → `events[].id` (attach KPI values to an event)
- `events[].kpiId`, `player_kpis` `kpis[].kpiId` → `kpi_definitions[].id`
- `events[].player.id`, `lineups` player IDs → `players[].id`
- `events[].squadId` → `squads[].id`
- `matches[].id` → the match ID in the `events_*` / `lineups_*` filenames
- `matches[].iterationId` → `iterations[].id`
- `players[].countryIds[]`, `squads[].countryId` → `countries[].id`

## Scale of the snapshot

Measured across all 306 matches in the repository:

| Quantity | Count |
|---|---|
| Matches | 306 |
| Events | 939,200 |
| Events carrying a `pass` object | 337,387 |
| Events carrying a `shot` object | 8,069 |
| Events carrying a `duel` object | 26,729 |
| Events linked to a set-piece phase | 32,377 |
| KPI definitions | 103 |

## Licensing and attribution

Use of the open-data repository is governed by Impect's Terms of Use
(`LICENSE.pdf` in the repository). Key points for anyone building on it:

- The data is licensed **non-exclusively and non-transferably**, for analytical
  and research use.
- You may **not** redistribute, reproduce, sell or transfer the data to third
  parties, and may not use it for commercial purposes.
- You **must credit Impect** as the data source in any published insight.
- The data is provided "as is" — Impect does not warrant it is free of errors or
  omissions.

Impect reserves all rights in and to its data, documentation, APIs and other
intellectual property. Nothing here grants any licence beyond what the
repository's own Terms of Use permit.

Data source: **Impect** ([impect.com](https://www.impect.com)).

## Where to go next

| Question | Document |
|---|---|
| What fields does each file have? | [data-model.md](data-model.md) |
| What are the event/action/phase enum values? | [event-types.md](event-types.md) |
| How are pitch locations encoded? | [coordinate-system.md](coordinate-system.md) |
| What are Packing and pxT? | [concepts.md](concepts.md) |
| What does `kpiId` N mean? | [kpi-definitions.md](kpi-definitions.md) |
| How do I map Impect IDs to other providers? | [identity-surfaces.md](identity-surfaces.md) |
