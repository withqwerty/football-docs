---
source_type: crawled
source_url: https://api.impect.com
upstream_version: Customer API v5.0
crawled_at: 2026-06-03
---

# Impect Identity Surfaces

Impect is primarily useful as a commercial match and event data provider. The
sections below combine **spec-confirmed** identity facts from the Customer API v5
with cautious curated guidance for entity-resolution work that has legitimate
data access.

## ID Mappings (confirmed, v5 API)

The v5 API exposes a first-class **`idMappings`** field on master-data objects —
`IterationDto`, `SquadDto`, `PlayerDto`, `MatchInfoDto`, `CoachDto` and
`StadiumDto` all carry it (i.e. nearly every entity except the nested single-match
`MatchDto`). `IdMappingDto` is:

> "ID mappings to external systems. Keys are provider names, values are arrays of
> string identifiers." — i.e. each entry is a `map<providerName, string[]>`, and
> the field is an array of such maps.

This means Impect entities can be bridged to other providers **directly from the
feed**, without inference — read `idMappings` on the iteration/squad/player/match/
coach/stadium and match the external IDs to your register. An entity may map to
multiple IDs per provider (hence arrays). Note matches expose `idMappings` on the
flat list item (`MatchInfoDto`, from `GET /iterations/{id}/matches`), not on the
single-match `MatchDto` from `GET /matches/{matchId}`. Impect also aligns events
to **SkillCorner** frames via `GET /matches/{matchId}/skillcorner-frame-mappings`,
a separate frame↔event bridge (not part of `idMappings`).

Entity keys themselves are integer `id` fields: `iterationId`, `matchId`,
`squadId`, player `id`, `coachId`, `stadiumId`, `countryId`. Iterations are the
season×competition unit (`{season, competition{...}}`).

## Access Surface

Access is through licensed Impect deliveries or customer APIs. Public
football-docs examples should stay synthetic or describe field families only.
Record delivery date, competition scope, and whether IDs are documented as
stable across deliveries before using them as durable bridges.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | provider competition key | Check whether the feed exposes stable competition IDs or only customer-specific names. |
| Season | provider season or competition-edition key | Treat as provider scoped until audited. |
| Match | provider match key | Strong bridge if the key is stable in the delivered feed and fixture fields align. |
| Team | provider team key | Corroborate with match participation, name, country, and side type. |
| Player | provider player key | Corroborate with lineup/event participation and biographical attributes from another authority. |
| Staff | provider staff or official key if exposed | Treat as role evidence unless profile attributes are available. |

## ID Scheme Notes

Treat Impect match, team, player, season, and competition keys as opaque
provider-scoped IDs. Some deliveries may be customer-shaped; do not assume a key
is globally stable until that is confirmed in the contract or repeated exports.

## Useful Matching Fields

- Match: provider match key, date, home and away teams, score, competition,
  season, venue, and delivery snapshot.
- Team: provider team key, names, country, competition participation, and match
  relationship evidence.
- Player: provider player key, display name, team in match, lineup status,
  shirt number, position, and event participation.

## Known Quirks

- Commercial data extracts may be customer-shaped. Confirm whether IDs are
  stable across deliveries before using them as durable bridges.
- Event participation is strong relationship evidence, but it does not prove
  person identity without attribute or external-provider corroboration.
- If profile attributes are thin, keep Impect as a corroborator rather than a
  canonical mint source.

## Reep Next Usage

Use this page as the public provider-fact reference for Impect identity field
families and matching cautions. Reep Next can cite those public-safe field
shapes, but customer deliveries, private IDs, raw feed payloads, and register
review outcomes belong outside football-docs.
