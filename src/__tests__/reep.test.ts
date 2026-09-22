import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Holds docs/reep to a snapshot of one published Reep release: its manifest
// (specs/reep/release.json) and its column schema (specs/reep/schema.json).
// Endpoints are checked separately against specs/reep/openapi.yaml by the
// provider-truth tests. Refresh the snapshots with scripts/check_reep_live.py.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const manifest = JSON.parse(readFileSync(resolve(ROOT, "specs/reep/release.json"), "utf8")) as {
  stamp: string;
  licence: { spdx: string };
  redaction: Record<string, string>;
  files: Record<string, { role?: string }>;
};
const schema = JSON.parse(readFileSync(resolve(ROOT, "specs/reep/schema.json"), "utf8")) as {
  files: Record<string, { columns: string[] }>;
};
const docs = Object.fromEntries(
  readdirSync(resolve(ROOT, "docs/reep"))
    .filter((f) => f.endsWith(".md"))
    .map((f) => [f, readFileSync(resolve(ROOT, "docs/reep", f), "utf8")]),
) as Record<string, string>;

const tableOf = (key: string) => key.replace(/^csv\//, "").replace(/\.csv\.gz$/, "");
const csvTables = new Set(Object.keys(manifest.files).filter((k) => /^csv\/.+\.csv\.gz$/.test(k)).map(tableOf));
const columns: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(schema.files).map(([k, v]) => [tableOf(k), new Set(v.columns)]),
);

// Tables that exist only in the DuckDB build, and the user's own example tables.
// Each is named here so an invented table or column elsewhere still fails.
const EXTRA_TABLES: Record<string, string[]> = {
  entity_search: ["reep_id", "label", "entity_type", "search_text", "bridge_count"],
  release_metadata: ["key", "value"],
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

/**
 * Inside ```sql blocks: every table after FROM/JOIN must exist, and every
 * alias.column must be a column of the table that alias names.
 */
function sqlViolations(text: string): string[] {
  const errors: string[] = [];
  for (const block of text.matchAll(/```sql\n([\s\S]*?)```/g)) {
    const sql = block[1].replace(/--.*$/gm, "");
    const aliases: Record<string, string> = {};
    for (const m of sql.matchAll(/\b(?:FROM|JOIN)\s+([a-z_]+)\b(?!\s*\()(?:\s+(?:AS\s+)?([a-z]{1,2})\b)?/g)) {
      const [, table, alias] = m;
      if (!knownTables.has(table)) errors.push(`unknown table ${table}`);
      else if (alias) aliases[alias] = table;
    }
    for (const m of sql.matchAll(/\b([a-z]{1,2})\.([a-z_]+)\b/g)) {
      const [, alias, col] = m;
      const table = aliases[alias];
      if (!table) errors.push(`alias ${alias} names no table`);
      else if (!(columns[table] ?? new Set(EXTRA_TABLES[table])).has(col)) {
        errors.push(`${table}.${col} not in schema`);
      }
    }
  }
  return errors;
}

describe("Reep docs match the release snapshot", () => {
  it("lists exactly the CSV tables the release publishes", () => {
    const listed = documentedCsvTables(docs["download-duckdb-csv.md"]);
    expect(listed.length).toBeGreaterThan(10);
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
    expect(manifest.licence.spdx).toBe("CC0-1.0");
    expect(docs["overview.md"]).toContain("CC0 1.0");
    for (const field of ["dob", "evidence", "appearances"]) {
      expect(manifest.redaction[field], field).toBe("excluded");
    }
    const overview = docs["overview.md"].replace(/\s+/g, " ");
    expect(overview).toContain("excludes dates of birth");
    expect(overview).toContain("raw provider evidence");
    expect(overview).toContain("no career history, squad membership or appearance data");
  });

  it("catches invented tables and columns", () => {
    expect(summaryViolations("| `bridges` | `provider, confidence` | x |")).toEqual([
      "bridges.confidence not in schema",
    ]);
    expect(summaryViolations("| `transfers` | `reep_id` | x |")).toEqual(["unknown table transfers"]);
    expect(sqlViolations("```sql\nSELECT b.nonesuch FROM bridges b;\n```")).toEqual([
      "bridges.nonesuch not in schema",
    ]);
    // A real column, on the wrong table: label is an entities column.
    expect(sqlViolations("```sql\nSELECT b.label FROM bridges b;\n```")).toEqual([
      "bridges.label not in schema",
    ]);
    expect(sqlViolations("```sql\nSELECT z.reep_id FROM bridges b;\n```")).toEqual([
      "alias z names no table",
    ]);
    expect(sqlViolations("```sql\nSELECT * FROM transfers;\n```")).toEqual(["unknown table transfers"]);
    expect(documentedCsvTables("Tables available as CSV: `bridges`, `transfers`.")).toEqual([
      "bridges",
      "transfers",
    ]);
  });
});
