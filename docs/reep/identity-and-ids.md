---
source_url: https://reep.football/id-policy
archived_url: https://web.archive.org/web/20261125113647/https://reep.football/id-policy/
source_type: curated
upstream_version: null
crawled_at: 2026-11-24
---

# Reep IDs, bridges and redirects

Written from the Reep ID policy, the get-started guide and the API specification
on 2026-09-22, and checked against release `2026-11-23.1` on 2026-11-24.

## The Reep ID

The API specification says a Reep ID matches `^r[a-z][0-9a-f]{14}$`, for example
`rp1b829f1d3468c4`. The second letter varies with the entity type, but read the
`entity_type` field rather than parsing the ID. Store Reep IDs as text.

The download has a second form too. In release `2026-11-23.1`, 37 of the
2,060,636 entities have an ID of one letter, an underscore and 16 hex digits: 29
venues (for example `v_01b78a3ba1badb02`), 3 coaches (`c_…`), 3 players (`p_…`)
and 2 stages (`r_…`). Release `2026-10-19.1` also had 1,088 transfers in that form
(for example `x_0025dde5e1e2fe1f`) and 2 awards (`a_…`), and release
`2026-10-31.1` gave 192,906 matches the underscore form (for example
`m_00004237ae76edf9`). Do not validate Reep IDs against the pattern above; treat
them as opaque text.

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

### What release `2026-11-23.1` shows

The ID policy page still says, on 2026-11-24, that "A previously published ID
never simply vanishes". The download of release `2026-11-23.1` does not keep that
for 1,092 IDs: the 1,090 transfer and 2 award entities of release `2026-10-19.1`.
They are in no table of the release, `redirects` included, and `redirects` has no
tombstone rows at all. The only record of them is the `diff.dropped_ids` list in
the release's `manifest.json`, which compares the release with `2026-10-19.1`.
What the API answers for these IDs was not checked (it needs a key).

So, after downloading a new release, check stored Reep IDs against both
`redirects` (for merges) and `diff.dropped_ids` in `manifest.json` (for IDs the
release dropped). A stored ID found in neither, and not in `entities`, is not
explained by the release files.

## Bridges: provider IDs keyed by namespace

A bridge maps one provider ID onto a Reep ID. It is keyed by
`(provider, namespace, external_id)`, never by the bare ID, because several
providers reuse numbers across entity types (Transfermarkt's player and club IDs
overlap, for instance). A wrong namespace matches nothing, silently.

| Provider | Players | Teams | Other namespaces |
|---|---|---|---|
| `skillcorner` | `player` | `team` | `match`, `competition`, `competition_edition`, `venue` |
| `opta` | `person` | `team` | `match`, `competition`, `season`, `stage`, `venue` |
| `wyscout` | `player` | `team` | `match`, `competition`, `competition-part`, `season`, `stage`, `round`, `coach`, `referee` |
| `transfermarkt` | `spieler` | `verein` | `spiel`, `wettbewerb`, `saison`, `trainer`, `schiedsrichter` |
| `statsbomb` | `offline_player` | `offline_team` | `offline_match`, `offline_season`, `offline_competition`, `offline_venue`, `stage` |
| `sportmonks` | `player` | `team` | `season`, `competition`, `match`, `stage`, `coach` |
| `fotmob` | `person` | `team` | `match`, `competition`, `league_instance`, `league_season`, `season`, `stage`, `coach`, `venue` |
| `api_football` | `player` | `team` | `match`, `competition`, `season`, `stage`, `coach`, `manager`, `venue` |

The full list is `SELECT DISTINCT provider, namespace FROM bridges` in the
download. External IDs are text: cast numeric columns before joining. Opta
carries both its 25-character IDs (`person`, `team`) and numeric forms
(`person_numeric`, `team_numeric`, `competition_numeric`, `match_numeric` and
`season_numeric`). The namespaces above follow the get-started guide and were
checked against release `2026-11-23.1`.

That release has 179 provider and namespace pairs across 29 providers. Next to
the namespaces above, many providers also carry generic ones: `team` (22
providers), `competition` and `player` (20 each), `season` (17), `match` (16),
`stage` (13), `coach` (7), `person` and `venue` (6 each) and `manager` (4).
Transfermarkt's players are under `spieler` only (416,312 bridges); release
`2026-10-19.1` also had 907 under `player`, and release `2026-10-31.1` a
Transfermarkt `team` namespace with different IDs (Arsenal was `verein` `11` and
`team` `97974`). Join on the namespace your IDs came from; a wrong namespace
matches nothing, or matches a different ID.

In release `2026-11-23.1`, 72 of the 2,382 venue bridges carry a prefix in
`external_id`: the Emirates Stadium is `besoccer / venue / bs_venue:263` and
`fotmob / venue / fmob_venue:9825`, but `api_football / venue / 494`. Check the
form before joining a provider's bare venue number.

A few entities hold two IDs from one provider, for example after the provider
reissued an ID. Aggregate with `string_agg` rather than `max` so that neither is
dropped. Releases from 2026-09-26 to at least 2026-10-05 marked the retired one
of such a pair in `bridges.upstream_status`; releases `2026-10-19.1`,
`2026-10-31.1` and `2026-11-23.1` have no such column. Source: [get-started guide](https://reep.football/get-started).

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

In the download, join stored IDs through the `redirects` table (`from_id, to_id`
in release `2026-11-23.1`) before using them:

```sql
SELECT coalesce(r.to_id, x.reep_id) AS reep_id
FROM my_saved_ids x
LEFT JOIN redirects r ON r.from_id = x.reep_id;
```

The same applies to the `reep_id` on a bridge row: a merged ID keeps its
bridges, so resolve it through `redirects` before joining. See "Bridges can name
a merged Reep ID" on the download page.

In the API, requesting a redirected ID returns HTTP 200 with the survivor, and
the body carries `requested_id` and `redirected_to` so the stored ID can be
updated. Source: [get-started guide](https://reep.football/get-started).
