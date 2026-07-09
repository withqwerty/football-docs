---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Opta / Stats Perform Identity Surfaces

Opta data usually has the strongest structured identity spine for professional
football projects that have licensed access to the SDAPI feeds. Treat Opta as a
canonical schedule and structure source only when the local entitlement and
coverage audit prove that the relevant competition family is complete.

## Access Surface

Primary access is through licensed Stats Perform / Opta feeds or customer
exports. Public-facing Opta Analyst surfaces can be useful for examples, but
they are not a substitute for an entitlement-safe feed contract. Record the feed
family, extraction date, and competition coverage when using Opta identity facts.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | competition or tournament identifiers | Use with tournament-calendar metadata. Names and display labels vary by locale and feed. |
| Season | tournament calendar UUID | Strong season or tournament-edition key. Split-stage competitions may need parent and child season modelling outside Opta. |
| Stage or round | stage, phase, group, round, or schedule metadata | Opta is often authoritative for schedule-stage shape, but label strings still need normalisation. |
| Match | fixture or match UUID | Best canonical match key when schedule coverage is complete. Fixture tuples should corroborate, not define, identity. |
| Team | contestant UUID | Can represent clubs, national teams, youth teams, reserve sides, or historical contestants. Use type/scope attributes. |
| Player | person UUID | Strong person key inside Opta. Still corroborate against names, DOB, nationality, and relationship evidence before cross-provider bridging. |
| Coach or staff | person UUID plus role surface | Person UUIDs can span player and coach roles. Keep role edges separate from person identity. |

## ID Scheme Notes

Opta identifiers are opaque provider keys. Do not parse semantic meaning from
their string shape, and do not assume that display labels, stage labels, or
contestant names are stable identifiers. Match, contestant, person, competition,
and tournament-calendar IDs should be stored with provider, feed family, and
snapshot metadata.

## Useful Matching Fields

- Match: date/time, home and away contestant UUIDs, score, competition, season,
  stage, venue, and status.
- Team: contestant UUID, official name, short name, country, gender, age class,
  national-team or club scope, and active period where available.
- Person: Opta person UUID, full name, short name, date of birth, nationality,
  position, gender, and squad or career memberships.
- Relationships: schedule team participation, squads, lineups, coaching staff,
  substitutions, and career memberships.

## Known Quirks

- Opta labels are provider display labels, not ontology. Do not mint a separate
  competition or team solely because the feed label differs from another
  provider.
- Some competitions have full schedule and squad coverage but sparse match-event
  or lineup tables in a local mirror. Check all person substrates before
  assuming people cannot be resolved.
- National teams need explicit team scope and country attributes. Do not encode
  the full national-team concept only in a club-shaped team type.
- Some person facts are current-point-in-time surfaces, especially active squad
  or career listings. Record the snapshot date when using them.

## Implementation Notes

Use this page as the public provider-fact reference for Opta identity surfaces:
access shape, ID families, matching fields, and known quirks. Keep project
acceptance policy, canonical-source assignments, review cases, action ledgers,
and implementation-only feed observations outside football-docs.
