import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Holds docs/reep to a snapshot of one published Reep release: its file list
// (specs/reep/release.json), its manifest (specs/reep/manifest.json) and the
// columns of each table (specs/reep/columns.json, read from the CSV headers, as
// the release publishes no schema file). Endpoints are checked separately against
// specs/reep/openapi.yaml by the provider-truth tests. Refresh the snapshots with
// scripts/check_reep_live.py.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const release = JSON.parse(readFileSync(resolve(ROOT, "specs/reep/release.json"), "utf8")) as {
  stamp: string;
  files: Record<string, { key: string; sha256: string }>;
};
const manifest = JSON.parse(readFileSync(resolve(ROOT, "specs/reep/manifest.json"), "utf8")) as {
  appearance_count: number;
  identity_rider_boundaries: { private_dobs_stripped: boolean; u18_persons_withheld: number; internal_lineups_withheld: boolean };
};
const schema = JSON.parse(readFileSync(resolve(ROOT, "specs/reep/columns.json"), "utf8")) as Record<string, string[]>;
const docs = Object.fromEntries(
  readdirSync(resolve(ROOT, "docs/reep"))
    .filter((f) => f.endsWith(".md"))
    .map((f) => [f, readFileSync(resolve(ROOT, "docs/reep", f), "utf8")]),
) as Record<string, string>;

const csvTables = new Set(
  Object.keys(release.files)
    .filter((name) => /^[a-z_]+\.csv\.gz$/.test(name))
    .map((name) => name.replace(/\.csv\.gz$/, "")),
);
const columns: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(schema).map(([table, cols]) => [table, new Set(cols)]),
);

// The user's own example tables. Each is named here so an invented table or
// column elsewhere still fails.
const EXTRA_TABLES: Record<string, string[]> = {
  my_squad: ["wyscout_id", "shirt_name"],
  my_saved_ids: ["reep_id"],
};
const knownTables = new Set([...csvTables, ...Object.keys(EXTRA_TABLES)]);

/** The comma list of backticked table names after "Tables available as CSV:". */
function documentedCsvTables(text: string): string[] {
  const block = text.split("Tables available as CSV:")[1]?.split("\n\n")[0] ?? "";
  return [...block.matchAll(/`([a-z_]+)`/g)].map((m) => m[1]);
}

/** Rows of the "four tables" summary: | `table` | `col, col, …` | … |. */
function summaryViolations(text: string): string[] {
  const errors: string[] = [];
  for (const row of text.matchAll(/^\| `([a-z_]+)` \| `([^`]+)` \|/gm)) {
    const [, table, cols] = row;
    if (!columns[table]) {
      errors.push(`unknown table ${table}`);
      continue;
    }
    for (const col of cols.split(",").map((c) => c.trim()).filter((c) => c && c !== "…")) {
      if (!columns[table].has(col)) errors.push(`${table}.${col} not in schema`);
    }
  }
  return errors;
}

/** The columns of a known table, or of a CTE defined in the same block. */
function columnsOf(table: string, ctes: Record<string, Set<string>>): Set<string> {
  return ctes[table] ?? columns[table] ?? new Set(EXTRA_TABLES[table]);
}

/**
 * Inside ```sql blocks: every table after FROM/JOIN must exist, and every
 * alias.column must be a column of the table that alias names. A CTE
 * (`WITH rb AS (SELECT b.*, … AS survivor_id FROM bridges b …)`) counts as a
 * table whose columns are its base table's (for `alias.*`) plus its `AS` names.
 */
function sqlViolations(text: string): string[] {
  const errors: string[] = [];
  for (const block of text.matchAll(/```sql\n([\s\S]*?)```/g)) {
    const sql = block[1].replace(/--.*$/gm, "");
    const ctes: Record<string, Set<string>> = {};
    for (const m of sql.matchAll(
      /\b(?:WITH|,)\s*([a-z_]+)\s+AS\s*\(\s*SELECT\s+([\s\S]*?)\bFROM\s+([a-z_]+)(?:\s+(?:AS\s+)?([a-z]{1,2})\b)?/g,
    )) {
      const [, name, select, table, alias] = m;
      const cols = new Set<string>();
      if (alias && new RegExp(`\\b${alias}\\.\\*`).test(select)) for (const c of columnsOf(table, ctes)) cols.add(c);
      for (const a of select.matchAll(/\bAS\s+([a-z_]+)/g)) cols.add(a[1]);
      ctes[name] = cols;
    }
    const aliases: Record<string, string> = {};
    for (const m of sql.matchAll(/\b(?:FROM|JOIN)\s+([a-z_]+)\b(?!\s*\()(?:\s+(?:AS\s+)?([a-z]{1,2})\b)?/g)) {
      const [, table, alias] = m;
      if (!knownTables.has(table) && !ctes[table]) errors.push(`unknown table ${table}`);
      else if (alias) aliases[alias] = table;
    }
    for (const m of sql.matchAll(/\b([a-z]{1,2})\.([a-z_]+)\b/g)) {
      const [, alias, col] = m;
      const table = aliases[alias];
      if (!table) errors.push(`alias ${alias} names no table`);
      else if (!columnsOf(table, ctes).has(col)) {
        errors.push(`${table}.${col} not in schema`);
      }
    }
  }
  return errors;
}

describe("Reep docs match the release snapshot", () => {
  it("lists exactly the CSV tables the release publishes", () => {
    const listed = documentedCsvTables(docs["download-duckdb-csv.md"]);
    expect(listed.length).toBeGreaterThanOrEqual(9);
    expect(Object.keys(schema).sort()).toEqual([...csvTables].sort());
    expect(new Set(listed)).toEqual(csvTables);
  });

  it("names only real columns in the table summary", () => {
    const text = docs["download-duckdb-csv.md"];
    expect([...text.matchAll(/^\| `([a-z_]+)` \| `/gm)].length).toBe(4);
    expect(summaryViolations(text)).toEqual([]);
  });

  it("uses only real tables and columns in every SQL example", () => {
    const blocks = Object.values(docs).flatMap((t) => [...t.matchAll(/```sql/g)]);
    expect(blocks.length).toBeGreaterThanOrEqual(5);
    for (const [file, text] of Object.entries(docs)) {
      expect(sqlViolations(text), file).toEqual([]);
    }
  });

  it("states the licence and exclusions the manifest records", () => {
    // The release files no longer state the licence; the downloads page does.
    expect(docs["overview.md"]).toContain("CC0 1.0");
    const boundaries = manifest.identity_rider_boundaries;
    expect(boundaries.private_dobs_stripped).toBe(true);
    expect(boundaries.internal_lineups_withheld).toBe(true);
    expect(manifest.appearance_count).toBe(0);
    const overview = docs["overview.md"].replace(/\s+/g, " ");
    expect(overview).toContain(`${boundaries.u18_persons_withheld.toLocaleString("en-GB")} under-18 persons withheld`);
    expect(overview).toContain(`release \`${release.stamp}\``);
    expect(overview).toContain("excludes dates of birth");
    expect(overview).toContain("raw provider evidence");
    expect(overview).toContain("no career history, squad membership or appearance data");
  });

  it("catches invented tables and columns", () => {
    expect(summaryViolations("| `bridges` | `provider, upstream_status` | x |")).toEqual([
      "bridges.upstream_status not in schema",
    ]);
    expect(summaryViolations("| `transfers` | `reep_id` | x |")).toEqual(["unknown table transfers"]);
    expect(sqlViolations("```sql\nSELECT b.nonesuch FROM bridges b;\n```")).toEqual([
      "bridges.nonesuch not in schema",
    ]);
    // A real column, on the wrong table: canonical_name is an entities column.
    expect(sqlViolations("```sql\nSELECT b.canonical_name FROM bridges b;\n```")).toEqual([
      "bridges.canonical_name not in schema",
    ]);
    // A column of an older release layout.
    expect(sqlViolations("```sql\nSELECT e.label FROM entities e;\n```")).toEqual(["entities.label not in schema"]);
    expect(sqlViolations("```sql\nSELECT z.reep_id FROM bridges b;\n```")).toEqual([
      "alias z names no table",
    ]);
    expect(sqlViolations("```sql\nSELECT * FROM transfers;\n```")).toEqual(["unknown table transfers"]);
    // A CTE is a table with its base table's columns plus its own AS names.
    expect(
      sqlViolations("```sql\nWITH rb AS (SELECT b.*, b.reep_id AS survivor_id FROM bridges b)\nSELECT a.survivor_id, a.provider, a.nonesuch FROM rb a;\n```"),
    ).toEqual(["rb.nonesuch not in schema"]);
    expect(documentedCsvTables("Tables available as CSV: `bridges`, `transfers`.")).toEqual([
      "bridges",
      "transfers",
    ]);
  });
});
