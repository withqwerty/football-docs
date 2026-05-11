---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Impect Identity Surfaces

Impect is primarily useful as a commercial match and event data provider. Public
documentation for identity surfaces is limited, so this page records cautious
curated guidance for entity-resolution work that has legitimate data access.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | provider competition key | Check whether the feed exposes stable competition IDs or only customer-specific names. |
| Season | provider season or competition-edition key | Treat as provider scoped until audited. |
| Match | provider match key | Strong bridge if the key is stable in the delivered feed and fixture fields align. |
| Team | provider team key | Corroborate with match participation, name, country, and side type. |
| Player | provider player key | Corroborate with lineup/event participation and biographical attributes from another authority. |
| Staff | provider staff or official key if exposed | Treat as role evidence unless profile attributes are available. |

## Useful Matching Fields

- Match: provider match key, date, home and away teams, score, competition,
  season, venue, and delivery snapshot.
- Team: provider team key, names, country, competition participation, and match
  relationship evidence.
- Player: provider player key, display name, team in match, lineup status,
  shirt number, position, and event participation.

## Quirks

- Commercial data extracts may be customer-shaped. Confirm whether IDs are
  stable across deliveries before using them as durable bridges.
- Event participation is strong relationship evidence, but it does not prove
  person identity without attribute or external-provider corroboration.
- If profile attributes are thin, keep Impect as a corroborator rather than a
  canonical mint source.

## Reep-Derived Provenance Rules

Do not publish customer data, proprietary feed examples, or private IDs without
permission. Public Reep notes should restrict themselves to general field-shape
guidance and describe any examples as synthetic.
