---
source_url: https://github.com/ImpectAPI/open-data/tree/v2.0
archived_url: https://github.com/ImpectAPI/open-data/tree/dfc80331b1e75629541992dc25650f50f6d8f5ea
source_type: curated
upstream_version: open-data v2.0 (tag v2.0, Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-11-24
---

# Impect Open Data: Overview

Impect is a German football data provider whose analytics are built around
**Packing** (counting bypassed opponents) and **pxT** (Packing Expected Threat,
a possession-value model). This documentation set describes Impect's
**open-data repository** — the only Impect source indexed here.

- **Repository**: [github.com/ImpectAPI/open-data](https://github.com/ImpectAPI/open-data)
- **Format**: JSON files, one per match or per iteration
- **Coverage**: Bundesliga 2023/24 (`iterationId` 743) — 306 matches
- **Current release**: v2.0 (2026-11-24), on the `v2` branch and tag `v2.0`.
  v1.0 is on `main` and tag `v1.0` — see [Versions](#versions-v20-and-v10)
- **In-repo reference**: `Documentation.pdf` (field-by-field descriptions and
  appendices; identical in v1.0 and v2.0) and `CHANGELOG.md` (from v2.0)

> **Scope note.** These docs cover the open-data repository only. Impect's
> commercial products and customer-facing API are not documented here. If you
> need those, contact Impect directly — do not infer an API surface from this
> material.

## What the snapshot is (and is not)

The open-data repository is a **static snapshot**, published to show what Impect
provides and how it is structured. Impect versions it with git tags, so an
analysis can pin a release. Treat it as a *representative* picture of
Impect's data structure and metric definitions, **not** a complete or current
mirror of the live product.

In particular:

- It is a single competition-season (Bundesliga 2023/24), not Impect's full coverage.
- Impect regularly enriches and adjusts data points in the live product. Fields,
  enum members and KPI sets can differ from what appears in this snapshot.
- Both releases carry `dataVersion: "V3"`. Impect's own documentation marks
  several attributes as available only from **dataV4+** / seasons starting summer
  2024. Those are described in [data-model.md](data-model.md) and flagged as
  *not populated in the snapshot* where that is the case.

Anything an agent asserts about Impect beyond what is in this repository is a
guess. Prefer "the open data does not show this" over inference.

## Versions: v2.0 and v1.0

These docs describe **v2.0**, released 2026-11-24 on the `v2` branch (tag
`v2.0`). Impect recalculated all 306 matches with its current pipeline, so
results computed on v1.0 do not reproduce exactly on v2.0.

Breaking changes from v1.0:

- **New event IDs.** Every event `id` was regenerated; no v1.0 event ID occurs in
  v2.0. Stored v1.0 IDs, and joins on `eventId` against v1.0 data, do not carry
  over.
- **`pass` is `null` without an end location.** On pass-like events, `pass` is
  now `null` whenever `end` is null. In v1.0 those events carried a `pass`
  object, often `{"distance": 0.0, "angle": null, "receiver": null}`. See
  [data-model.md](data-model.md).

Other changes: recalculated event attributes (`sequenceIndex`, set-piece links,
`action`/`actionType`, some end locations) and KPI values; seven KPIs added at
event level; rewritten KPI descriptions and a new `inverted` flag in
`kpi_definitions.json`; new fields `goals`, `result`, `resultType` and
`stadiumId` on matches, `height` on players, `stadiumId` on lineups and
`competition.ageGroup` on iterations; `coachId` set in lineups; country
corrections. `Documentation.pdf` and `LICENSE.pdf` are unchanged.

**v1.0 and kloppy (as of 2026-11-24).** v1.0 stays on `main` and tag `v1.0`.
The repository README says `main` and kloppy's `impect.load_open_data()` serve
v1.0 until a kloppy release supports v2.0; kloppy 3.19.1 is the latest release
and still loads v1.0. Support for v2.0 is tracked in
[PySport/kloppy#666](https://github.com/PySport/kloppy/pull/666), which is not
merged. Where these docs give a v2.0 count or field, the v1.0 difference is
noted beside it.

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

Directly with pandas, from a clone of the `v2` branch
(`git clone --branch v2 https://github.com/ImpectAPI/open-data.git`):

```python
import pandas as pd

df = pd.read_json("data/events/events_122838.json")
print(df.head())
```

Via [kloppy](https://kloppy.pysport.org/), which has a first-class Impect
deserialiser and will normalise coordinates and event types into its own model.
`load_open_data()` reads `main`, so it returns **v1.0** data:

```python
from kloppy import impect

events = impect.load_open_data(match_id=122840)   # v1.0 open data
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

Measured across all 306 matches in each release:

| Quantity | v2.0 | v1.0 |
|---|---|---|
| Matches | 306 | 306 |
| Events | 939,341 | 939,200 |
| Events carrying a `pass` object | 335,439 | 337,387 |
| Events carrying a `shot` object | 8,073 | 8,069 |
| Events carrying a `duel` object | 26,698 | 26,729 |
| Events linked to a set-piece phase | 96,613 | 32,377 |
| KPI definitions | 103 | 103 |

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
