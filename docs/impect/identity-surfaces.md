---
source_url: https://github.com/ImpectAPI/open-data
source_type: curated
upstream_version: open-data snapshot (Bundesliga 2023/24, dataVersion V3)
crawled_at: 2026-07-30
---

# Impect Identity Surfaces

How Impect identifies entities, and what it gives you for mapping those entities
to other providers. Grounded in the
[open-data repository](https://github.com/ImpectAPI/open-data).

## Entity keys

Every Impect entity is keyed by a plain **integer `id`**. There are no composite
or string keys, and no separate "external reference" primary key.

| Entity | Key field | Referenced elsewhere as |
|---|---|---|
| Iteration (competition-season) | `iterations[].id` | `iterationId` |
| Competition | `iterations[].competition.id` | — |
| Match | `matches[].id` | match ID in `events_*` / `lineups_*` filenames |
| Squad | `squads[].id` | `squadId`, `homeSquadId`, `awaySquadId`, `currentSquadId` |
| Player | `players[].id` | `playerId`, `player.id`, `pressingPlayerId`, `fouledPlayerId`, `exchangedPlayerId` |
| Country | `countries[].id` | `countryId`, `countryIds[]` |
| Event | `events[].id` | `eventId` in `events_kpis` |
| KPI | `kpi_definitions[].id` | `kpiId` |

An **iteration** is the central organising unit: one season of one competition.
It is what master-data files are partitioned by — `players_743.json` and
`squads_743.json` are the players and squads of iteration 743, not a global
register. A player's `currentSquadId` is their squad at snapshot time, which is
not necessarily their squad in any given match; for match-time affiliation use
the lineups file.

## Cross-provider IDs (`idMappings`)

Four master-data entities carry an `idMappings` field: **iterations, matches,
squads and players**.

The shape is an **array of single-key objects**, each mapping a provider name to
an **array of string IDs**:

```json
"idMappings": [
  { "heim_spiel":   ["9684272"] },
  { "skill_corner": ["1033915"] }
]
```

Three things to handle when parsing:

1. It is an array of objects, not one object — flatten before lookup.
2. The values are **arrays of strings**, not scalars, so an entity may carry more
   than one ID per provider. In this snapshot every array has exactly one member,
   but do not assume that holds generally.
3. IDs are **strings even though they look numeric**. Compare as strings, or cast
   deliberately.

### Providers present in the snapshot

| Provider key | Entity coverage in the snapshot |
|---|---|
| `heim_spiel` | iterations 1/1, matches 306/306, squads 18/18, players 570/570 |
| `skill_corner` | iterations 1/1, matches 306/306, squads 18/18, players 570/570 |

Coverage is complete for both providers across all four entity types here. That
is a property of this curated snapshot and should not be read as a guarantee for
Impect's wider catalogue.

The provider key set is snapshot-specific. Impect's live data may expose
different or additional keys — enumerate whatever keys are present rather than
hard-coding `heim_spiel` and `skill_corner`.

### What does not carry `idMappings`

- **Events** have no cross-provider identifiers. There is no event-level ID
  bridge to another provider's event feed.
- **Countries** have no `idMappings`, but they do carry ISO and FIFA codes, which
  serve the same purpose — see below.
- **Coaches and stadiums** are not entities in the open data at all. `coachId`
  appears in the lineups payload but is null throughout the snapshot, and there is
  no coach or stadium master-data file.

## Country identification

`countries.json` is the one place Impect offers standards-based identifiers
rather than opaque integers:

| Field | Use |
|---|---|
| `isoName` / `isoCode` | ISO 3166-1 alpha-3 |
| `fifaName` / `fifaCode` | FIFA country name and code |

These diverge for the UK home nations — Scotland is ISO `GBR` ("United Kingdom")
but FIFA `SCO` ("Scotland"). For national-team work the FIFA code is usually the
right join key. Both fields are nullable, and an `id: 346` "unknown" row exists
with all codes null.

## Matching players without an ID bridge

Where `idMappings` does not reach a provider you need, the player payload carries
the attributes conventional matching relies on:

| Field | Note |
|---|---|
| `firstname`, `lastname`, `commonname` | `commonname` is the full display name; names are unaccented in some rows |
| `birthdate` | `YYYY-MM-DD` — the strongest disambiguator |
| `birthplace` | Free text |
| `countryIds[]` | Multiple nationalities possible, so treat as a set |
| `leg` | `LEFT` / `RIGHT` / `BOTH` |
| `currentSquadId` | Snapshot-time squad, not match-time |

Shirt numbers are in the **lineups** file (`players[].shirtNumber`), not in player
master data, and are per match.

## Deriving match context

The open data has no scoreline field. To establish a result, count `GOAL` and
`OWN_GOAL` events, attributing own goals to the opposing squad. Match metadata
gives `homeSquadId`, `awaySquadId`, `scheduledDate` and `matchDay`, but not the
score, venue or referee.

There is also no stadium or venue reference anywhere in the open data.

## Relationship to SkillCorner

The `skill_corner` key in `idMappings` is an **identifier cross-reference only** —
it tells you which SkillCorner entity corresponds to an Impect iteration, match,
squad or player. The open data contains no tracking data and no event-to-frame
alignment. Any join to SkillCorner tracking must be built on your own side, from
these entity IDs plus your SkillCorner licence.
