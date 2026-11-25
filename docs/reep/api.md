---
source_url: https://reep.football/api
archived_url: https://web.archive.org/web/20261125113550/https://reep.football/data/#api
source_type: curated
upstream_version: null
crawled_at: 2026-11-24
---

# Reep API

The API serves the current release over HTTP for single, live lookups. It
exposes nothing the free download does not. Base URL:
`https://reep.football/api/v1`. The full contract is the OpenAPI specification
at https://reep.football/openapi.yaml, rendered at https://reep.football/docs.
Checked against the specification fetched on 2026-11-24 (`x-api-schema`
`public-scope-mapping-v1`), when the download served release `2026-11-23.1`.

The specification says: "A release publishes a mapping and nothing else: Reep
IDs, names, provider IDs, redirects, Wikidata links and aliases. `/search` and
`/changes` answer 410 `not_published` on this release." The match filter list
(matches filtered by team, competition or season) answers 410
`match_details_unavailable`, and the
relationships endpoint is gone. The specification fetched on 2026-11-16
(`public-bridge-register-v2`) still had all three.

## Getting a key

**Keys are issued by hand; there is no self-service sign-up.** Keys go to three
groups:

- **Data partners:** providers whose IDs the register bridges, checking and
  maintaining those bridges.
- **Organisations evaluating the register:** federations and FAs, clubs, and
  analytics companies testing it against their own data. A free evaluation key
  is unmetered at 20 requests a second and expires automatically after 30 days.
  It is extended on request, and the key value stays the same.
- **Production access:** a paid service for teams that want Reep lookups in a
  live system. Volume, rate, uptime and support terms are on request.

Email getintouch+nutmeg@withqwerty.com with your organisation, which group you
are in and what you are matching. Keys and limits never unlock extra fields or
providers. For bulk work, use the download instead.

Send the key as `Authorization: Bearer <key>`. Entity, bridge, overlay, match and
resolve calls each count as one lookup. The remaining count comes back in
`X-Reep-Credits-Remaining`. Metadata endpoints (`/meta`, `/providers`,
`/provider-notices/summary`) do not count. Every endpoint is subject to the key's
per-second rate limit. A key that expires also gets `X-Reep-Key-Expires` (ISO
time) and `X-Reep-Key-Days-Remaining` on every authenticated response, and
`GET /api/v1/key` shows the key's status.

Source: [API guide](https://reep.football/api).

## Endpoints

| Request | Purpose | Lookup cost |
|---|---|---|
| `GET /api/v1/meta` | The serving release's stamp, tier, schema and row counts | none |
| `GET /api/v1/providers` | Providers with bridge counts, entity types and role | none |
| `GET /api/v1/key` | The calling key's plan, expiry and remaining allowance | none |
| `GET /api/v1/resolve/{provider}/{external_id}` | Provider ID to Reep entity; takes `namespace` and `type` | one |
| `POST /api/v1/batch` | Up to 100 entity items or 20 resolve items per request | one per item |
| `GET /api/v1/entities/{reep_id}` | Entity detail | one |
| `GET /api/v1/entities/{reep_id}/bridges` | Every provider ID for one entity | one |
| `GET /api/v1/entities/{reep_id}/overlay` | The linked Wikidata QID for one entity | one |
| `GET /api/v1/matches/{reep_id}` | One match and every provider's match ID | one |
| `GET /api/v1/matches/{provider}/{external_id}` | One provider's match ID to the Reep ID and every other provider's match ID; takes `namespace` | one |
| `GET /api/v1/search` | 410 `not_published` on release `2026-11-23.1` | none |
| `GET /api/v1/changes`, `/changes/summary`, `/changes/releases` | 410 `not_published` on release `2026-11-23.1` | none |

Source: [OpenAPI specification](https://reep.football/openapi.yaml).

## Resolve a provider ID

```bash
curl -H "Authorization: Bearer $REEP_API_KEY" \
  "https://reep.football/api/v1/resolve/wyscout/379209?namespace=player&type=player&include=bridges"
```

Always pass the namespace: bridges are keyed by provider, namespace and ID.
Entity and resolve responses carry the core record only, unless you add
`include=` with any of `aliases`, `attributes`, `bridges` and `overlay`. With `include=bridges`, one call returns every provider ID Reep holds
for the entity. A merged ID returns its survivor with HTTP 200, naming both
`requested_id` and `redirected_to`.

## Batch lookups

```bash
curl -X POST -H "Authorization: Bearer $REEP_API_KEY" -H "Content-Type: application/json" \
  -d '{"include":["bridges"],"requests":[
        {"type":"resolve","provider":"wyscout","namespace":"player","external_id":"379209"},
        {"type":"entity","id":"rp1b829f1d3468c4"}
      ]}' \
  "https://reep.football/api/v1/batch"
```

Each item returns its own `{status, body}`, so one miss never fails the batch.
Each item costs one lookup; the batch counts as one request against the rate
limit.

## Search by name

`GET /api/v1/search` answers 410 `not_published` on release `2026-11-23.1`: the
release has no search index. The specification says: "To find a name, join
`provider_aliases` or `overlay_aliases` (and `entities.canonical_name`) in the
download." See "No provider ID: search by name" on the download page. Up to the
specification fetched on 2026-11-16, `search` took `q`, `type`, `sort` and
`limit`.

## Keeping in sync

The change feed (`/changes`, `/changes/summary`, `/changes/releases`) answers
410 `not_published` on release `2026-11-23.1`. The downloads page says to compare
the change counts and dropped IDs in the release metadata files instead (the
`diff` in `manifest.json`, and `upkeep_ledger.json`), and to read the current
stamp from `GET /api/v1/meta`.

## Key status

`GET /api/v1/key` returns the calling key's status and costs no lookup:

- `key`: `plan` (for example `evaluation`), `access_model`, `organisation`,
  `provider`, `expires_at`, `days_remaining`, `expiring_soon`,
  `credits_remaining` and `rate_limit_remaining`. Each can be null except
  `expiring_soon`, which turns true 7 days before `expires_at`.
- `extend`: how to extend the key (`how`, `contact`), or null for a key that
  never expires.

## Matches mapped across providers

A match is published as a mapping: one entity with its fixture label and the
provider IDs attached to it.

```bash
curl -H "Authorization: Bearer $REEP_API_KEY" \
  "https://reep.football/api/v1/matches/transfermarkt/<match-id>?namespace=spiel"
```

- `GET /api/v1/matches/{provider}/{external_id}` takes a provider's match ID,
  with `namespace`. Transfermarkt and Soccerdonna match IDs use the namespace
  `spiel`. A provider ID that maps to more than one match answers 409.
- `GET /api/v1/matches/{reep_id}` starts from the Reep side. A redirected Reep ID
  answers with its survivor (`requested_id`, `redirected_to`); the Reep ID of
  another entity type answers 404.
- **Response:** `reep_id`, `entity_type` (`match`), `canonical_name` (the label,
  "Home v Away, YYYY-MM-DD") and `bridges`. There is no score and no team
  column.
- The filter list (matches filtered by team, competition or season) answers 410
  `match_details_unavailable` on release `2026-11-23.1`. Up to the specification
  fetched on 2026-11-16 it returned teams, competition, season, scores and states,
  filtered by team, competition or season.

Source: [OpenAPI specification](https://reep.football/openapi.yaml), fetched on
2026-11-24.
