---
source_url: https://reep.football/api
source_type: curated
upstream_version: null
crawled_at: 2026-10-09
---

# Reep API

The API serves the current release over HTTP for single, live lookups. It
exposes nothing the free download does not. Base URL:
`https://reep.football/api/v1`. The full contract is the OpenAPI specification
at https://reep.football/openapi.yaml, rendered at https://reep.football/docs.
Checked on 2026-10-09 against release `20261005T180536Z`.

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

Send the key as `Authorization: Bearer <key>`. Search, entity, bridge, overlay,
relationship and resolve calls each count as one lookup, as does each page of
matches. The remaining count comes back in `X-Reep-Credits-Remaining`. Metadata
and changes endpoints do not count. Every endpoint is subject to the key's
per-second rate limit. A key that expires also gets `X-Reep-Key-Expires` (ISO
time) and `X-Reep-Key-Days-Remaining` on every authenticated response, and
`GET /api/v1/key` shows the key's status.

Source: [API guide](https://reep.football/api).

## Endpoints

| Request | Purpose | Lookup cost |
|---|---|---|
| `GET /api/v1/meta` | Current release stamp and its predecessor | none |
| `GET /api/v1/providers` | Providers with bridge counts, entity types and role | none |
| `GET /api/v1/key` | The calling key's plan, expiry and remaining allowance | none |
| `GET /api/v1/resolve/{provider}/{external_id}` | Provider ID to Reep entity; takes `namespace` and `type` | one |
| `POST /api/v1/batch` | Up to 100 entity items or 20 resolve items per request | one per item |
| `GET /api/v1/entities/{reep_id}` | Entity detail | one |
| `GET /api/v1/entities/{reep_id}/bridges` | Every provider ID for one entity | one |
| `GET /api/v1/entities/{reep_id}/overlay` | Wikidata overlay for one entity | one |
| `GET /api/v1/entities/{reep_id}/relationships` | Relationship summary | one |
| `GET /api/v1/search` | Name and alias search; takes `q`, `type`, `sort`, `limit` | one |
| `GET /api/v1/matches` | Published matches mapped across providers, filtered by team, competition or season | one per page |
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

## Key status

`GET /api/v1/key` returns the calling key's status and costs no lookup:

- `key`: `plan` (for example `evaluation`), `access_model`, `organisation`,
  `provider`, `expires_at`, `days_remaining`, `expiring_soon`,
  `credits_remaining` and `rate_limit_remaining`. Each can be null except
  `expiring_soon`, which turns true 7 days before `expires_at`.
- `extend`: how to extend the key (`how`, `contact`), or null for a key that
  never expires.

## Matches mapped across providers

`GET /api/v1/matches` returns published matches with their IDs at every
provider. It is available only when the register's generation mode is on; when
it is off or in shadow, the endpoint returns 404.

```bash
curl -H "Authorization: Bearer $REEP_API_KEY" \
  "https://reep.football/api/v1/matches?team=<reep_id or provider:namespace:id>&from=2026-08-01&to=2026-08-31&require=opta,wyscout"
```

- **Anchors:** at least one `team`, `competition` or `season` is required. Each
  takes a Reep ID or `provider:namespace:id`, up to five values. Repeat the
  parameter for more than one value (`team=a&team=b`); do not comma-separate.
  Values within one anchor are ORed, and different filters intersect.
- **Other filters:** `opponent` and `venue` (`home`, `away` or `any`, default
  `any`) need exactly one `team`. `from` and `to` are inclusive register dates,
  with no time-zone conversion. `state` takes comma-separated states (`played`,
  `scheduled`, `postponed`, `cancelled`, `awarded`, `abandoned`, or `none` for a
  null state). `providers` limits the bridges returned; `require` and `missing`
  keep matches that have, or do not have, a publishable bridge at each named
  provider. `sort` is `desc` (default) or `asc` by date, and `limit` is 1 to 100
  (default 20).
- **Default window:** with no `season` and no date bound, the window is the last
  30 calendar dates including today (UTC). A `season` removes the default
  window, and a single date bound leaves the other end open. Undated matches
  are left out whenever a date bound applies.
- **Paging:** a page holds at most 100 rows and 262,144 bytes, so it can hold
  fewer than `limit`. Continue with `cursor=<next_cursor>`. Cursors are signed,
  expire after 24 hours and are bound to the filters and the generation; a
  changed filter or generation, or an expired cursor, returns 400
  `stale_cursor`, and you restart without it.
- **Response:** `matches`, `count`, `generation`, `unresolved` (anchors that
  did not resolve, which give an empty page) and `next_cursor`. Each match has
  `reep_id`, `played_on`, `state`, `home`, `away`, `competition`, `season` and
  `stage` (each a `reep_id` with a `label`), `home_score`, `away_score`,
  `shootout_home`, `shootout_away`, `result_form`, `score_basis`, `leg`,
  `aggregate_of`, `bridges` (`provider`, `namespace`, `external_id`) and
  `generation`.
- **Nulls:** null means the register holds no published value, never zero or
  unknown. Scores are after-play goals and exclude shoot-out kicks. No date,
  score, state or structure is inferred.
- **Errors** carry the code in `error`: 400 for an invalid query (for example
  `anchor_required`, `single_team_required`, `invalid_id`) or `stale_cursor`,
  409 `ambiguous_provider_id`, 422 `wrong_entity_type`, and 503
  `generation_unavailable` or `match_response_too_large`.

Source: [OpenAPI specification](https://reep.football/openapi.yaml), release
`20261005T180536Z`.
