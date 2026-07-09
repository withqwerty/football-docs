---
source_url: https://api.fmdb.pro/api/openapi
source_type: crawled
upstream_version: latest (full OpenAPI)
crawled_at: 2026-07-09
---

# FMDB Pro Identity Surfaces

## Primary entity IDs

FMDB Pro entities expose an `id` field. Treat it as the FMDB Pro primary key for the returned entity type:

- `/api/players` -> player `id`
- `/api/persons` -> person `id`
- `/api/clubs` -> club `id`
- `/api/nations` -> nation `id`
- `/api/clubsCompetitions` and `/api/nationsCompetitions` -> competition `id`
- `/api/stadiums` -> stadium `id`
- `/api/officials` -> official `id`

Do not assume IDs are globally unique across entity types unless FMDB Pro explicitly confirms that. Store provider keys with an entity-type namespace, for example `fmdb-pro:player:<id>` and `fmdb-pro:club:<id>`.

## Football Manager IDs

Many entities include `fmId`. This is an important bridge field because FMDB Pro is built around Sports Interactive's football database. Ingest it separately from the FMDB Pro API `id`:

| Field | Use |
|---|---|
| `id` | FMDB Pro API entity key. |
| `fmId` | Football Manager database identity where present. |

For person matching, prefer a composite candidate set using `fmId`, name fields, date/year of birth, nationality, and club context. Do not collapse `id` and `fmId` into one namespace.

## FA IDs

The player, person, and club surfaces can include `faId`. This can be useful for England/FA-facing workflows, but coverage and semantics may vary by entity type. Treat it as an external identifier with nullable/partial coverage.

## External IDs

The player full spec exposes `externalIds`, including `externalIds.hudlWyscoutId` as a filterable nested field. This is the clearest documented cross-provider bridge in the current OpenAPI snapshot.

Use external IDs as high-confidence links only when the field is present and the target provider namespace is explicit. For example:

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

Use `dateOfBirth` when available. `latestDateOfBirth` and `yearOfBirth` are useful for uncertain or partial birth-date cases, but they should not be treated as equivalent to a confirmed date of birth.

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

For matching, distinguish legal nationality/country fields from declared sporting nation and current football location. `declaredNation`, `clubNation`, and `contractedNation` can be especially useful disambiguators, but they answer different questions.

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

Use club context as supporting evidence, not as a durable identity key. Players and staff move, and loan/permanent relationships can coexist.

## Recommended matching approach

For players:

1. Match exact `fmId` or explicit external IDs first.
2. Then compare `id` within the FMDB Pro namespace.
3. Use `dateOfBirth`, `latestDateOfBirth`, or `yearOfBirth` as birth evidence.
4. Use `fullName`, `commonName`, `firstName`, `secondName`, and `kitName` as name evidence.
5. Use country/nation and club fields as disambiguators.

For staff/persons:

1. Match exact `fmId` first where present.
2. Use `id` in the person namespace.
3. Use name and birth evidence.
4. Use `currentJob`, club/nation relationships, coaching/tactics fields, and career history as context.

## Public-safe provenance

These identity notes are derived from the public FMDB Pro OpenAPI schema and documentation UI. They describe field surfaces and matching strategy only; they do not imply access to private FMDB Pro data, credentials, or a complete mapping table.
