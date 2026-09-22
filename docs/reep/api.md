---
source_url: https://reep.football/api
source_type: curated
upstream_version: null
crawled_at: 2026-09-22
---

# Reep API

The API serves the current release over HTTP for single, live lookups. It
exposes nothing the free download does not. Base URL:
`https://reep.football/api/v1`. The full contract is the OpenAPI specification
at https://reep.football/openapi.yaml, rendered at https://reep.football/docs.
Written on 2026-09-22.

## Getting a key

**Keys are issued by hand; there is no self-service sign-up.** Email
getintouch+nutmeg@withqwerty.com with your organisation, what you are matching and
roughly how many lookups you expect. An evaluation key starts at 1,000 lookups a
month at 2 requests a second; limits are raised for partners on request. For bulk
work, use the download instead.

Send the key as `Authorization: Bearer <key>`. Search, entity, bridge, overlay,
relationship and resolve calls each cost one lookup, and the remaining count
comes back in `X-Reep-Credits-Remaining`. Metadata and changes endpoints cost
nothing. Every endpoint is subject to the key's per-second rate limit.

Source: [API guide](https://reep.football/api).

## Endpoints

| Request | Purpose | Lookup cost |
|---|---|---|
| `GET /api/v1/meta` | Current release stamp and its predecessor | none |
| `GET /api/v1/providers` | Providers with bridge counts, entity types and role | none |
| `GET /api/v1/resolve/{provider}/{external_id}` | Provider ID to Reep entity; takes `namespace` and `type` | one |
| `POST /api/v1/batch` | Up to 100 entity items or 20 resolve items per request | one per item |
| `GET /api/v1/entities/{reep_id}` | Entity detail | one |
| `GET /api/v1/entities/{reep_id}/bridges` | Every provider ID for one entity | one |
| `GET /api/v1/entities/{reep_id}/overlay` | Wikidata overlay for one entity | one |
| `GET /api/v1/entities/{reep_id}/relationships` | Relationship summary | one |
| `GET /api/v1/search` | Name and alias search; takes `q`, `type`, `sort`, `limit` | one |
| `GET /api/v1/changes/summary` | Change counts since a stamp | none |
| `GET /api/v1/changes` | Paged change events, filtered by `type` or `provider` | none |
| `GET /api/v1/changes/releases` | The list of published releases | none |

Source: [OpenAPI specification](https://reep.football/openapi.yaml).

## Resolve a provider ID

```bash
curl -H "Authorization: Bearer $REEP_API_KEY" \
  "https://reep.football/api/v1/resolve/wyscout/379209?namespace=player&type=player&include=bridges"
```

Always pass the namespace: bridges are keyed by provider, namespace and ID.
Entity and resolve responses carry the core record only, unless you add
`include=` with any of `aliases`, `attributes`, `bridges`, `relationships` and
`overlay`. With `include=bridges`, one call returns every provider ID Reep holds
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

`GET /api/v1/search?q=salah&type=player&sort=bridges&limit=10` searches canonical
labels and safe aliases. Relevance is the default order; `sort=bridges` orders by
how many providers are bridged. Search is bounded to 500 candidates per token, so
use the download's full-text search for exhaustive discovery.

## Keeping in sync

Poll `GET /api/v1/changes/summary?since=<stamp>` for the counts since your last
sync, then page `GET /api/v1/changes` for the events: entities added, IDs
redirected with their survivor, and bridges added or removed. Use `from` and `to`
for any two published releases. Both endpoints return an `ETag`, and a matching
`If-None-Match` returns 304 with no body.
