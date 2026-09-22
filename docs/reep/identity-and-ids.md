---
source_url: https://reep.football/id-policy
source_type: curated
upstream_version: null
crawled_at: 2026-09-22
---

# Reep IDs, bridges and redirects

Written from the Reep ID policy, the get-started guide and the API specification
on 2026-09-22.

## The Reep ID

A Reep ID matches `^r[a-z][0-9a-f]{14}$`, for example `rp1b829f1d3468c4`. The
second letter varies with the entity type, but read the `entity_type` field
rather than parsing the ID. Store Reep IDs as text.

What an ID promises:

- **Never reused.** An ID points at one entity for good. A retired ID is never
  handed to a different player, club or match.
- **Append-mostly.** New IDs arrive as coverage grows; published IDs are not
  quietly deleted.
- **Merges leave a redirect.** When two IDs turn out to be the same entity, the
  losing ID redirects to the survivor.
- **Removals leave a tombstone.** An entity that loses its evidence is marked
  moved or withdrawn, never silently dropped.
- **Checked every release.** Each release is diffed against the previous one, and
  any published ID that would vanish blocks the release.

Design storage around the redirect, not string equality. Sources:
[ID policy](https://reep.football/id-policy),
[API specification](https://reep.football/openapi.yaml).

## Bridges: provider IDs keyed by namespace

A bridge maps one provider ID onto a Reep ID. It is keyed by
`(provider, namespace, external_id)`, never by the bare ID, because several
providers reuse numbers across entity types (Transfermarkt's player and club IDs
overlap, for instance). A wrong namespace matches nothing, silently.

| Provider | Players | Teams | Other namespaces |
|---|---|---|---|
| `skillcorner` | `player` | `team` | `match`, `competition`, `competition_edition` |
| `opta` | `person` | `team` | `match`, `competition`, `season`, `stage` |
| `wyscout` | `player` | `team` | `match`, `competition`, `season`, `round`, `coach` |
| `transfermarkt` | `spieler` | `verein` | `spiel`, `wettbewerb`, `saison`, `trainer`, `schiedsrichter` |
| `statsbomb` | `offline_player` | `offline_team` | — |
| `sportmonks` | `player` | `team` | — |
| `fotmob` | `person` | `team` | — |
| `api_football` | `player` | `team` | `match`, `competition`, `season`, `coach` |

The full list is `SELECT DISTINCT provider, namespace FROM bridges` in the
download. External IDs are text: cast
numeric columns before joining. Opta carries both its 25-character IDs
(`person`, `team`) and numeric forms (`person_numeric`, `team_numeric`).

A few entities hold two IDs from one provider, for example after the provider
reissued an ID. Aggregate with `string_agg` rather than `max` so that neither is
dropped. Source: [get-started guide](https://reep.football/get-started).

## Provider roles

The API's `GET /api/v1/providers` gives each provider one of three roles:

- `canonical_bridge`: a normal public ID link.
- `bridge_only`: useful for interoperability, but never counted as independent
  corroboration of an identity.
- `overlay_only`: Wikidata, which is convenience data and never a canonical
  bridge.

Source: [API specification](https://reep.football/openapi.yaml).

## Wikidata is an overlay, not a bridge

Wikidata QIDs, and the external identifiers those QIDs carry, ship as a separate
overlay. The overlay is community-edited, so it is kept apart from the
corroborated bridges and is lower confidence. In the API it appears under
`overlay.wikidata`, never as a canonical bridge. Treat it as a discovery aid,
not as confirmation. Source: [API guide](https://reep.football/api).

## Resolving stored IDs after a merge

In the download, join stored IDs through the `redirects` table
(`from_id, to_id, reason`) before using them:

```sql
SELECT coalesce(r.to_id, x.reep_id) AS reep_id
FROM my_saved_ids x
LEFT JOIN redirects r ON r.from_id = x.reep_id;
```

In the API, requesting a redirected ID returns HTTP 200 with the survivor, and
the body carries `requested_id` and `redirected_to` so the stored ID can be
updated. Source: [get-started guide](https://reep.football/get-started).
