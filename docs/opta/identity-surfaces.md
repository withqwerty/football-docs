---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Opta / Stats Perform Identity Surfaces

Opta identifiers are opaque provider keys used across the SDAPI feeds and
Opta Analyst public surfaces.

## Access surface

Primary access is through licensed Stats Perform / Opta feeds or customer
exports. Public-facing Opta Analyst pages expose some of the same entities
at a lower level of detail.

## Entity ID fields

| Entity | Common surface |
|---|---|
| Competition | competition or tournament identifier |
| Season | tournament calendar UUID |
| Stage or round | stage, phase, group, round, or schedule metadata |
| Match | fixture or match UUID |
| Team | contestant UUID |
| Player | person UUID |
| Coach or staff | person UUID plus a role attribute |

Person UUIDs can represent both players and coaches; the role is carried as a
separate attribute rather than a distinct ID space. Contestant UUIDs can
represent clubs, national teams, youth teams, reserve sides, or historical
contestants, distinguished by type/scope attributes.

## Other fields

- Match: date/time, home and away contestant UUIDs, score, competition,
  season, stage, venue, and status.
- Team: contestant UUID, official name, short name, country, gender, age
  class, national-team or club scope, and active period where available.
- Person: Opta person UUID, full name, short name, date of birth,
  nationality, position, gender, and squad or career memberships.
