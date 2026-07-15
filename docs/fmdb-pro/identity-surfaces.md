---
source_url: https://api.fmdb.pro/api/openapi
source_type: crawled
upstream_version: latest (full OpenAPI)
crawled_at: 2026-07-09
---

# FMDB Pro Identity Surfaces

## Primary entity IDs

FMDB Pro entities expose an `id` field, scoped per entity type:

- `/api/players` -> player `id`
- `/api/persons` -> person `id`
- `/api/clubs` -> club `id`
- `/api/nations` -> nation `id`
- `/api/clubsCompetitions` and `/api/nationsCompetitions` -> competition `id`
- `/api/stadiums` -> stadium `id`
- `/api/officials` -> official `id`

IDs are not guaranteed to be globally unique across entity types.

## Football Manager IDs

Many entities include `fmId`, the Football Manager database identity, since
FMDB Pro is built around Sports Interactive's football database. It is a
distinct field from the FMDB Pro API `id`:

| Field | Use |
|---|---|
| `id` | FMDB Pro API entity key. |
| `fmId` | Football Manager database identity where present. |

## FA IDs

The player, person, and club surfaces can include `faId`, an England/FA
identifier with nullable/partial coverage.

## External IDs

The player full spec exposes `externalIds`, including
`externalIds.hudlWyscoutId` as a filterable nested field:

```text
FMDB Pro player id -> externalIds.hudlWyscoutId -> Hudl/Wyscout player id
```

## Name and birth fields

Player/person identity includes multiple name and birth-date fields:

- `name`
- `firstName`
- `secondName`
- `commonName`
- `fullName`
- `kitName`
- `nickName`
- `dateOfBirth`
- `latestDateOfBirth`
- `yearOfBirth`
- `cityOfBirth`
- `regionOfBirth`

`latestDateOfBirth` and `yearOfBirth` cover uncertain or partial birth-date
cases; they are not equivalent to a confirmed `dateOfBirth`.

## Nationality and country context

Player/person nationality and country context includes:

- `country`
- `nationalityInfo`
- `secondCountry`
- `secondNationalityInfo`
- `thirdCountry`
- `thirdNationalityInfo`
- `declaredNation`
- `residentNation`
- `basedCountry`
- `clubNation`
- `contractedNation`

`declaredNation`, `clubNation`, and `contractedNation` answer different
questions from legal nationality/country fields.

## Club context

Current and historical club context appears through:

- `basedClub`
- `permanentClub`
- `loanClub`
- `lastPlayingClub`
- `lastNonPlayingClub`
- `clubCompetition`
- `permanentClubContract`
- `loanClubContract`
- `clubContracts`
- `history`
- `moves`

## Public-safe provenance

These identity notes are derived from the public FMDB Pro OpenAPI schema and
documentation UI. They describe field surfaces only; they do not imply access
to private FMDB Pro data or credentials.
