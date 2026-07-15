---
source_type: crawled
source_url: https://api.impect.com
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect Identity Surfaces

## ID Mappings (v5 API)

The v5 API exposes a first-class **`idMappings`** field on master-data
objects — `IterationDto`, `SquadDto`, `PlayerDto`, `MatchInfoDto`, `CoachDto`,
and `StadiumDto` all carry it (i.e. nearly every entity except the nested
single-match `MatchDto`). `IdMappingDto` is:

> "ID mappings to external systems. Keys are provider names, values are arrays
> of string identifiers." — i.e. each entry is a `map<providerName, string[]>`,
> and the field is an array of such maps.

An entity may map to multiple IDs per provider (hence arrays). Matches expose
`idMappings` on the flat list item (`MatchInfoDto`, from
`GET /iterations/{id}/matches`), not on the single-match `MatchDto` from
`GET /matches/{matchId}`. Impect also aligns events to **SkillCorner** frames
via `GET /matches/{matchId}/skillcorner-frame-mappings`, a separate
frame-to-event mapping not part of `idMappings`.

Entity keys themselves are integer `id` fields: `iterationId`, `matchId`,
`squadId`, player `id`, `coachId`, `stadiumId`, `countryId`. Iterations are the
season × competition unit (`{season, competition{...}}`).

## Access surface

Access is through licensed Impect deliveries or customer APIs.

## Entity ID fields

| Entity | Common surface |
|---|---|
| Competition | provider competition key |
| Season | provider season or competition-edition key |
| Match | provider match key |
| Team | provider team key |
| Player | provider player key |
| Staff | provider staff or official key if exposed |

Impect match, team, player, season, and competition keys are opaque and
provider-scoped; some deliveries may be customer-shaped.

## Other fields

- Match: provider match key, date, home and away teams, score, competition,
  season, venue, and delivery snapshot.
- Team: provider team key, names, country, and competition participation.
- Player: provider player key, display name, team in match, lineup status,
  shirt number, position, and event participation.
