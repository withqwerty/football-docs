---
source_url: https://reep.football/data/
source_type: curated
upstream_version: null
crawled_at: 2026-09-29
---

# Reep download: DuckDB and CSV

The whole register is a free download with no key and no sign-up. It comes as
one DuckDB file, or as one gzipped CSV per table. The CSV release is the source
contract; the DuckDB file is built from it. Written from reep.football on
2026-09-22.

## Stable download links

These links always resolve to the current release:

- DuckDB: https://reep.football/downloads/duckdb (the file is `reep-register-v1.duckdb`)
- One CSV per table: `https://reep.football/downloads/csv/<table>`, for example
  https://reep.football/downloads/csv/bridges

Each release also publishes `checksums.txt` and `schema.json` next to the files;
the manifest at https://data.reep.football/releases/latest.json lists every file
for the current release.

Tables available as CSV: `bridges`, `entities`, `relationships`, `matches`,
`aliases`, `players`, `coaches`, `referees`, `teams`, `competitions`, `seasons`,
`stages`, `observed_clubs`, `redirects`, `coverage`, and the Wikidata overlay
tables `overlay_xids`, `overlay_aliases` and `overlay_links`.

Source: [downloads](https://reep.football/data/). The old page address,
https://reep.football/downloads, redirects there; the `/downloads/duckdb` and
`/downloads/csv/<table>` links above still work.

## Keeping a local copy current

A new release is cut every week, and each file carries its stamp in the
`release_metadata` table:

```sql
SELECT value FROM release_metadata WHERE key = 'source_stamp';
```

Compare it with the `stamp` field of
https://data.reep.football/releases/latest.json, which needs no key. When they
differ, download the file again from https://reep.football/downloads/duckdb over
the old copy, then resolve stored Reep IDs through the `redirects` table. Check
before any bulk matching job.

## The four tables that do the crosswalk

| Table | Columns | What it is |
|---|---|---|
| `bridges` | `provider, namespace, external_id, reep_id, rung, upstream_status` | The crosswalk: one row per provider ID. `rung` says how the bridge was corroborated; `upstream_status` says whether the provider still uses the ID. |
| `entities` | `reep_id, entity_type, status, label, gender, country, …` | One row per identity. |
| `aliases` | `reep_id, alias, kind, rank, language` | Alternate and historical names. |
| `redirects` | `from_id, to_id, reason` | IDs retired by a merge, pointing at the survivor. |

The DuckDB file is self-describing: `SHOW TABLES;` and `DESCRIBE bridges;`.
Source: [get-started guide](https://reep.football/get-started).

### Live and retired provider IDs

`upstream_status` was added to `bridges` in the 2026-09-26 release, at the end of
the column list, so code that reads the first five columns by position is
unaffected. It is empty for an ID the provider still uses. In that release:

| Value | Rows | Meaning |
|---|---|---|
| empty | 7,932,209 | live provider ID |
| `retired` | 330 | the provider retired this ID in favour of another; the same Reep ID also has a live bridge to that provider |
| `removed` | 210 | the provider's own list no longer includes the ID (all SkillCorner in this release) |

Reep's published schema note describes the empty and `retired` values. Look up
by any ID, retired ones included, so that old stored IDs still resolve. When you
map *to* a provider, keep only live rows, or a retired ID can come back next to
the live one. The examples below do this with
`coalesce(b.upstream_status, '') = ''`, which works whether the empty value
arrives as NULL or as an empty string.

## Map one provider's ID to another's

Two hops through the Reep ID. Swap the two provider clauses to go the other way.

```sql
-- Wyscout player ID → Reep ID → SkillCorner player ID
SELECT a.external_id AS wyscout_id, e.reep_id, e.label,
       b.external_id AS skillcorner_id
FROM bridges a
JOIN entities e USING (reep_id)
LEFT JOIN bridges b
       ON b.reep_id = e.reep_id
      AND b.provider = 'skillcorner' AND b.namespace = 'player'
      AND coalesce(b.upstream_status, '') = ''
WHERE a.provider = 'wyscout' AND a.namespace = 'player'
  AND a.external_id = '379209';
-- → rp1b829f1d3468c4 · Declan Rice · skillcorner 12174
```

## Bridge a whole file in one pass

DuckDB reads CSV directly, so your own file joins without an import step.

```sql
CREATE TABLE my_squad AS SELECT * FROM read_csv_auto('my_squad.csv');

SELECT m.*, e.reep_id, e.label AS reep_label,
       string_agg(DISTINCT b.external_id, '|') FILTER (WHERE b.provider = 'skillcorner') AS skillcorner_id,
       string_agg(DISTINCT b.external_id, '|') FILTER (WHERE b.provider = 'opta')        AS opta_id
FROM my_squad m
LEFT JOIN bridges a
       ON a.provider = 'wyscout' AND a.namespace = 'player'
      AND a.external_id = CAST(m.wyscout_id AS VARCHAR)
LEFT JOIN entities e USING (reep_id)
LEFT JOIN bridges b
       ON b.reep_id = e.reep_id
      AND (b.provider, b.namespace) IN (('skillcorner', 'player'), ('opta', 'person'))
      AND coalesce(b.upstream_status, '') = ''
GROUP BY ALL;
```

A NULL `reep_id` means no bridge exists for that ID in this release. A NULL
target ID means the entity is in Reep but not yet bridged to that provider.

## Export flat mapping CSVs

For a spreadsheet or an import job, reshape the long `bridges` table into one row
per entity with a column per provider:

```sql
COPY (
  PIVOT (
    SELECT b.reep_id, e.label, b.provider || '_' || b.namespace AS id_column, b.external_id
    FROM bridges b JOIN entities e USING (reep_id)
    WHERE e.entity_type = 'team'
      AND coalesce(b.upstream_status, '') = ''
  )
  ON id_column USING string_agg(DISTINCT external_id, '|')
  GROUP BY reep_id, label
) TO 'teams_all_providers.csv' (HEADER);
```

The match table is larger than Excel's 1,048,576-row limit; filter by competition
or season first. Source:
[exporting flat mapping CSVs](https://reep.football/get-started#export-csv).

## No provider ID: search by name

A name match is a shortlist, not an answer. `entity_search` holds each label with
every alias in one text column, and `bridge_count` is a fair proxy for the
better-known identity:

```sql
SELECT reep_id, label, entity_type, bridge_count
FROM entity_search
WHERE search_text ILIKE '%ødegaard%'
ORDER BY bridge_count DESC
LIMIT 5;
```

Confirm a name match by team, season or nationality before trusting it.
