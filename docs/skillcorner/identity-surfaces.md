---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# SkillCorner Identity Surfaces

SkillCorner is mainly a tracking and physical-data provider. Its identity
surfaces are most useful for linking delivered match, team, and player rows back
to an existing register rather than minting a full football ontology.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | provider competition key where present | Often secondary to match delivery scope. Audit before treating as canonical. |
| Season | provider season or delivery context | Keep provider-scoped unless a stable season key is documented in the extract. |
| Match | provider match key | Strong bridge when fixture fields and delivery metadata agree. |
| Team | provider team key | Corroborate with match participation and team names. |
| Player | provider player key | Corroborate with tracking roster, shirt number, position, and external person attributes. |

## Useful Matching Fields

- Match: provider match key, date, competition, season, home and away teams,
  score where present, and data delivery snapshot.
- Team: provider team key, name, side in match, and relationship to match.
- Player: provider player key, name, team in match, shirt number, position,
  starter/substitute status where supplied, and tracking samples.

## Quirks

- Tracking feeds can expose matchday rosters without enough biographical detail
  for safe person minting. Use them as relationship evidence unless another
  source supplies the identity attributes.
- Delivery metadata may be more reliable than display names for reproducible
  matching.
- A match-level tracking file is not proof of a season-long membership edge.

## Reep-Derived Provenance Rules

Public notes should avoid proprietary tracking payload examples. Use synthetic
examples or high-level field names unless the provider has published equivalent
documentation.
