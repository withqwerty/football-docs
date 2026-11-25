---
source_url: https://reep.football/data/
archived_url: https://web.archive.org/web/20261125113550/https://reep.football/data/
source_type: curated
upstream_version: 2026-11-23.1
crawled_at: 2026-11-24
---

# Reep download: DuckDB, Parquet and CSV

The whole register is a free download with no key and no sign-up. Each table
comes as a Parquet file and as a gzipped CSV, and one DuckDB file holds every
table. The site calls the Parquet and CSV files the source contract and the
DuckDB file a convenience build of the same rows. Written from reep.football and
release `2026-11-23.1`, the current download, on 2026-11-24.

From release `2026-11-23.1` a release publishes a mapping and nothing else: Reep
IDs, names, provider IDs, redirects, Wikidata links and aliases. The site says it
"carries no scores, grades, evidence or provider-private values". Code written
for the earlier layouts needs changes; see "Earlier layouts" below.

## Stable download links

These links always resolve to the current release:

- DuckDB: https://reep.football/downloads/duckdb (the file is `reep-register.duckdb`)
- One CSV per table: `https://reep.football/downloads/csv/<table>`, for example
  https://reep.football/downloads/csv/bridges
- One Parquet file per table: `https://reep.football/downloads/parquet/<table>`

Each link redirects to the file under
`https://data.reep.football/releases/<stamp>/objects/<id>/`.

Tables available as CSV: `entities`, `bridges`, `redirects`, `provider_aliases`,
and the Wikidata overlay tables `overlay_links` and `overlay_aliases`.

Source: [downloads](https://reep.football/data/). The old page address,
https://reep.football/downloads, redirects there.

## Release files and checksums

https://data.reep.football/releases/latest.json names the release the downloads
channel serves: its `stamp` (for example `2026-11-23.1`), and under `release` the
`key` and `sha256` of that release's `release.json`. The file has `schema`
`reep-public-selection/v1`, and also `generated_at`, `activation_requested_at`
and the checksums of the candidate, the policy and the predecessor. It is a
selection, not a counter: it can name a release older than one it named before
(see the overview).

`release.json` (`schema` `reep-public-release/v4` in release `2026-11-23.1`)
lists every file of the release by name, each with its `key` (its path on the
`data.reep.football` host), its `sha256` and its size in `bytes`. Release
`2026-11-23.1` has, besides `<table>.parquet` and `<table>.csv.gz` for each
table and `reep-register.duckdb`:

- `schema.json`: every table's columns and types (`schema_version`
  `reep-public-register/5`).
- `manifest.json`: row counts by table, entity type and provider, the licence
  (`licence` `CC0-1.0`), checksums, and a `diff` against the previous release
  (entity and bridge changes, and `dropped_ids`).
- `LICENSE.txt`: the CC0 1.0 text.
- `site-summary.json`, `upkeep_ledger.json` and a copy of `latest.json`.

Verify a download against its `sha256` in `release.json`. Read the columns from
`schema.json`, or from the file itself (`DESCRIBE bridges;` in DuckDB, or the
first line of a CSV).

## Keeping a local copy current

A new download release is cut weekly or less often. The daily matching goes to
the API only, so the file has no matches made after its release. The DuckDB file
of release `2026-11-23.1` records its own stamp: its `release_metadata` table
(`key`, `value`) has `source_stamp` `2026-11-23.1`, and also `schema_version`,
`generated_at` and `licence`. Compare that stamp with the `stamp` in
`latest.json`. When they differ, download the file again from
https://reep.football/downloads/duckdb over the old copy, then resolve stored
Reep IDs through the `redirects` table, and check them against the `dropped_ids`
of the new release's `manifest.json` (see the IDs page). Check before any bulk
matching job.

## The four tables that do the crosswalk

| Table | Columns | What it is |
|---|---|---|
| `bridges` | `reep_id, provider, namespace, external_id, entity_type` | The crosswalk: one row per provider ID that Reep has resolved. |
| `entities` | `reep_id, entity_type, canonical_name, gender, country` | One row per identity. The name is in `canonical_name`. |
| `redirects` | `from_id, to_id` | IDs retired by a merge, pointing at the survivor. |
| `provider_aliases` | `reep_id, alias, alias_kind` | Name variants from providers, for name search. |

`provider_aliases.alias_kind` is one of `label`, `initial_name`, `alias`,
`short_name` and `official_name`. `overlay_aliases` (`reep_id, qid, alias,
language`) holds Wikidata names in many languages, and `overlay_links` (`reep_id,
qid, entity_type`) links an entity to its Wikidata QID.

A match is one `entities` row with `entity_type` `match`. Its `canonical_name` is
the fixture label, for example `Middlesbrough v Blackburn Rovers, 1935-02-23`, and
its provider match IDs are in `bridges`. The download has no team, season, date,
score or state columns for a match, and no table that links a match to its teams
or a season to its competition.

The DuckDB file is self-describing: `SHOW TABLES;` and `DESCRIBE bridges;`.
Source: [downloads](https://reep.football/data/).

### Redirects

In release `2026-11-23.1`, `redirects` has 7,916 rows. Every row has a `to_id`
that is an entity in the release, and the ledger is flat: no `to_id` is also a
`from_id`. The table has no `reason` column, and no rows for withdrawn IDs (see
the IDs page).

### Bridges can name a merged Reep ID

When two Reep IDs merge, the losing ID can keep its bridge rows, and `redirects`
points it at the survivor. A bridge's `reep_id` can then be a merged ID, and a
join from `bridges` straight to `entities` lands on the merged ID and misses the
survivor's other provider IDs. Release `20261005T180536Z` had 4,211 such
bridges; releases `2026-10-19.1`, `2026-10-31.1` and `2026-11-23.1` have none.
Resolve every bridge to its survivor first anyway, so the same query works on
every release. The site's own guidance says the same: always left-join
`redirects` before joining `entities`. One join is enough, because the ledger is
flat:

```sql
WITH rb AS (   -- every bridge, with the Reep ID it resolves to
  SELECT b.*, coalesce(nullif(r.to_id, ''), b.reep_id) AS survivor_id
  FROM bridges b
  LEFT JOIN redirects r ON r.from_id = b.reep_id
)
SELECT * FROM rb LIMIT 5;
```

An entity's full set of provider IDs is every `rb` row whose `survivor_id` is
its Reep ID. The examples below use `rb`. The `nullif` keeps a tombstone in an
older release (a row with an empty `to_id`) from turning a bridge's ID into an
empty string.

## Map one provider's ID to another's

Two hops through the Reep ID. Swap the two provider clauses to go the other way.

```sql
-- Wyscout player ID → Reep ID → SkillCorner player ID
WITH rb AS (
  SELECT b.*, coalesce(nullif(r.to_id, ''), b.reep_id) AS survivor_id
  FROM bridges b
  LEFT JOIN redirects r ON r.from_id = b.reep_id
)
SELECT a.external_id AS wyscout_id, e.reep_id, e.canonical_name,
       b.external_id AS skillcorner_id
FROM rb a
JOIN entities e ON e.reep_id = a.survivor_id
LEFT JOIN rb b
       ON b.survivor_id = e.reep_id
      AND b.provider = 'skillcorner' AND b.namespace = 'player'
WHERE a.provider = 'wyscout' AND a.namespace = 'player'
  AND a.external_id = '379209';
-- → rp1b829f1d3468c4 · Declan Rice · skillcorner 12174
```

Checked on release `2026-11-23.1`.

## Bridge a whole file in one pass

DuckDB reads CSV directly, so your own file joins without an import step.

```sql
CREATE TABLE my_squad AS SELECT * FROM read_csv_auto('my_squad.csv');

WITH rb AS (
  SELECT b.*, coalesce(nullif(r.to_id, ''), b.reep_id) AS survivor_id
  FROM bridges b
  LEFT JOIN redirects r ON r.from_id = b.reep_id
)
SELECT m.*, e.reep_id, e.canonical_name AS reep_label,
       string_agg(DISTINCT b.external_id, '|') FILTER (WHERE b.provider = 'skillcorner') AS skillcorner_id,
       string_agg(DISTINCT b.external_id, '|') FILTER (WHERE b.provider = 'opta')        AS opta_id
FROM my_squad m
LEFT JOIN rb a
       ON a.provider = 'wyscout' AND a.namespace = 'player'
      AND a.external_id = CAST(m.wyscout_id AS VARCHAR)
LEFT JOIN entities e ON e.reep_id = a.survivor_id
LEFT JOIN rb b
       ON b.survivor_id = e.reep_id
      AND (b.provider, b.namespace) IN (('skillcorner', 'player'), ('opta', 'person'))
GROUP BY ALL;
```

A NULL `reep_id` means no bridge exists for that ID in this release. A NULL
target ID means the entity is in Reep but not yet bridged to that provider. A
few entities hold two IDs from one provider; `string_agg` keeps both.

The same queries run on the Parquet files: replace `bridges` with
`'bridges.parquet'`, and so on.

## Export flat mapping CSVs

For a spreadsheet or an import job, reshape the long `bridges` table into one row
per entity with a column per provider:

```sql
COPY (
  PIVOT (
    SELECT e.reep_id, e.canonical_name, b.provider || '_' || b.namespace AS id_column, b.external_id
    FROM bridges b
    LEFT JOIN redirects r ON r.from_id = b.reep_id
    JOIN entities e ON e.reep_id = coalesce(nullif(r.to_id, ''), b.reep_id)
    WHERE e.entity_type = 'team'
  )
  ON id_column USING string_agg(DISTINCT external_id, '|')
  GROUP BY reep_id, canonical_name
) TO 'teams_all_providers.csv' (HEADER);
```

The match entities (1,496,974 in release `2026-11-23.1`) are more than Excel's
1,048,576-row limit; filter them first. Source:
[exporting flat mapping CSVs](https://reep.football/get-started#export-csv).

## No provider ID: search by name

There is no search table. Names are in `entities.canonical_name`,
`provider_aliases.alias` and `overlay_aliases.alias`, so search all three. A
name match is a shortlist, not an answer. This query ranks an exact name first,
then the entities with the most provider IDs:

```sql
WITH hits AS (
  SELECT reep_id, lower(canonical_name) = 'ødegaard' AS exact FROM entities WHERE canonical_name ILIKE '%ødegaard%'
  UNION ALL SELECT reep_id, lower(alias) = 'ødegaard' FROM provider_aliases WHERE alias ILIKE '%ødegaard%'
  UNION ALL SELECT reep_id, lower(alias) = 'ødegaard' FROM overlay_aliases WHERE alias ILIKE '%ødegaard%'
), named AS (SELECT reep_id, bool_or(exact) AS exact FROM hits GROUP BY reep_id)
SELECT e.reep_id, e.canonical_name, e.entity_type, count(b.reep_id) AS bridge_count
FROM named n JOIN entities e USING (reep_id) LEFT JOIN bridges b USING (reep_id)
GROUP BY e.reep_id, e.canonical_name, e.entity_type, n.exact
ORDER BY n.exact DESC, bridge_count DESC, e.reep_id
LIMIT 5;
-- → Martin Ødegaard (26 bridges), Magnar Ødegaard (19), Emil Gundelach Ødegaard (17), …
```

Checked on release `2026-11-23.1`. Confirm a name match by team, season or
nationality before trusting it.

## Earlier layouts

- **Releases `2026-10-19.1` and `2026-10-31.1`** had more tables and columns:
  `entity_search` (one text column of names, used for name search), `matches`
  (fixtures, with team, season and score columns in `2026-10-31.1`), `edges`
  (relationships; empty in `2026-10-19.1`), an uncompressed `<table>.csv` next to
  each `<table>.csv.gz`, and on `bridges` `independence_bucket`, `route_scope`,
  `rule_id`, `confidence` and `attached_at`. `entities` had `grade`,
  `bucket_count`, `corroboration_buckets`, `metadata_json`, `updated_at` and
  empty date-of-birth columns; `redirects` had `reason` (free text) and
  `created_at`. Their DuckDB files had no `release_metadata` table, so they did
  not record their stamp, and the releases shipped no `schema.json` or
  `LICENSE.txt`.
- **Older releases, such as `20261005T180536Z`,** used stamps of that form, a
  `release_metadata` table in the DuckDB file (`reep-register-v1.duckdb`), a
  `schema.json`, an `entities.label` column and `bridges.rung` and
  `bridges.upstream_status`, and `redirects` rows with an empty `to_id` for
  withdrawn IDs (tombstones).
