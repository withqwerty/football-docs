---
source_url: https://reep.football/data/
source_type: curated
upstream_version: 2026-10-31.1
crawled_at: 2026-11-03
---

# Reep download: DuckDB, Parquet and CSV

The whole register is a free download with no key and no sign-up. Each table
comes as a Parquet file and as a gzipped CSV, and one DuckDB file holds every
table. The site calls the Parquet and CSV files the source contract and the
DuckDB file a convenience build of the same rows. Written from reep.football and
release `2026-10-31.1` on 2026-11-03.

## Stable download links

These links always resolve to the current release:

- DuckDB: https://reep.football/downloads/duckdb (the file is `reep-register.duckdb`)
- One CSV per table: `https://reep.football/downloads/csv/<table>`, for example
  https://reep.football/downloads/csv/bridges
- One Parquet file per table: `https://reep.football/downloads/parquet/<table>`

Each link redirects to the file under
`https://data.reep.football/releases/<stamp>/objects/<id>/`.

Tables available as CSV: `bridges`, `entities`, `redirects`, `entity_search`,
`matches`, `edges`, `provider_aliases`, and the Wikidata overlay tables
`overlay_links` and `overlay_aliases`.

Source: [downloads](https://reep.football/data/). The old page address,
https://reep.football/downloads, redirects there.

## Release files and checksums

https://data.reep.football/releases/latest.json names the current release: its
`stamp` (for example `2026-10-31.1`), and under `release` the `key` and `sha256`
of that release's `release.json`. `release.json` lists every file of the release
by name, each with its `key` (its path on the `data.reep.football` host), its
`sha256` and its size in `bytes`. Besides the tables (`<table>.parquet`,
`<table>.csv.gz` and an uncompressed `<table>.csv`) and `reep-register.duckdb`, a
release has `manifest.json` (row counts by table, entity type and provider, and
what the release withholds), `site-summary.json` and `upkeep_ledger.json`.

Verify a download against its `sha256` in `release.json`. The release publishes
no column schema file; read the columns from the file itself (`DESCRIBE bridges;`
in DuckDB, or the first line of a CSV).

Older releases, such as `20261005T180536Z`, used a different layout: stamps of
that form, a `release_metadata` table in the DuckDB file
(`reep-register-v1.duckdb`), a `schema.json`, an `entities.label` column and
`bridges.rung` and `bridges.upstream_status`. Release `2026-10-31.1` has none of
these. Code written for the old layout fails on the new file.

## Keeping a local copy current

A new download release is cut weekly or less often. The daily matching goes to
the API only, so the file has no matches made after its release. The DuckDB file
of release `2026-10-31.1` does not record its own stamp, so keep the stamp of the
release you downloaded next to the file, or compare the file's SHA-256 with the `sha256` of
`reep-register.duckdb` in the current `release.json`. When they differ, download
the file again from https://reep.football/downloads/duckdb over the old copy,
then resolve stored Reep IDs through the `redirects` table. Check before any bulk
matching job.

## The four tables that do the crosswalk

| Table | Columns | What it is |
|---|---|---|
| `bridges` | `reep_id, provider, namespace, external_id, entity_type, independence_bucket, route_scope, rule_id, confidence, attached_at` | The crosswalk: one row per provider ID that Reep has resolved. |
| `entities` | `reep_id, entity_type, canonical_name, gender, country, grade, bucket_count, corroboration_buckets, …` | One row per identity. The name is in `canonical_name`. |
| `redirects` | `from_id, to_id, reason, created_at` | IDs retired by a merge, pointing at the survivor. |
| `entity_search` | `reep_id, entity_type, label, canonical_name, search_text, bridge_count, alias_count` | Each identity's names and aliases in one text column, for name search. |

`entities` also has `birth_date`, `birth_date_iso` and `dob_precision`. In
release `2026-10-31.1` both date columns are empty in every row and
`dob_precision` is `redacted_private` in every row. `matches` holds fixtures
(`fixture_label`, `match_date_iso`, `season_id`, `home_team_id`, `away_team_id`,
`home_score`, `away_score` and more), `edges` holds typed links between entities
(`edge_kind` values in that release: `home_team`, `away_team`, `match_in_season`,
`stage_of`, `season_of`, `hosted_at`), and `provider_aliases` holds provider name
variants (`alias_kind`: `label`, `initial_name`, `alias`, `short_name`,
`full_name`, `official_name`).

The DuckDB file is self-describing: `SHOW TABLES;` and `DESCRIBE bridges;`.
Source: [get-started guide](https://reep.football/get-started).

### Redirect reasons

In release `2026-10-31.1`, `redirects` has 12,917 rows and every row has a
`to_id`: there are no tombstones (rows with an empty `to_id`) in that release.
`reason` is free text, with 5,983 distinct values, for example
`v4.dormant_recorroborate.match_reconciled_to_active`. Do not branch on it. The
ledger is flat: no `to_id` is also a `from_id`.

### Bridges can name a merged Reep ID

When two Reep IDs merge, the losing ID can keep its bridge rows, and `redirects`
points it at the survivor. A bridge's `reep_id` can then be a merged ID, and a
join from `bridges` straight to `entities` lands on the merged ID and misses the
survivor's other provider IDs. Release `20261005T180536Z` had 4,211 such
bridges; release `2026-10-31.1` has none. Resolve every bridge to its survivor
first anyway, so the same query works on every release. One join is enough,
because the ledger is flat:

```sql
WITH rb AS (   -- every bridge, with the Reep ID it resolves to
  SELECT b.*, coalesce(nullif(r.to_id, ''), b.reep_id) AS survivor_id
  FROM bridges b
  LEFT JOIN redirects r ON r.from_id = b.reep_id
)
SELECT * FROM rb LIMIT 5;
```

An entity's full set of provider IDs is every `rb` row whose `survivor_id` is
its Reep ID. The examples below use `rb`. The `nullif` keeps a tombstone, if a
release has one, from turning a bridge's ID into an empty string.

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

Checked on release `2026-10-31.1`.

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

The match table is larger than Excel's 1,048,576-row limit; filter by competition
or season first. Source:
[exporting flat mapping CSVs](https://reep.football/get-started#export-csv).

## No provider ID: search by name

A name match is a shortlist, not an answer. `entity_search` holds each name with
every alias in one text column, and `bridge_count` is a fair proxy for the
better-known identity:

```sql
SELECT reep_id, canonical_name, entity_type, bridge_count
FROM entity_search
WHERE search_text ILIKE '%ødegaard%'
ORDER BY bridge_count DESC
LIMIT 5;
-- → Martin Ødegaard (26 bridges), Magnar Ødegaard (18), Emil Gundelach Ødegaard (17), …
```

Confirm a name match by team, season or nationality before trusting it.
