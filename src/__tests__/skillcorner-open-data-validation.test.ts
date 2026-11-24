import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DOC = resolve(ROOT, "docs", "skillcorner", "dynamic-events.md");
const CURATED = resolve(ROOT, "docs", "skillcorner", "dynamic-events-delivered-values.md");
const TRUTH = resolve(ROOT, "data", "skillcorner-open-data-truth.json");

interface Truth {
  source: { repo: string; commit: string; matches: number; rows: number };
  columns: string[];
  values: Record<string, string[]>;
  numeric: string[];
}

const truth: Truth = JSON.parse(readFileSync(TRUTH, "utf-8"));
const doc = readFileSync(DOC, "utf-8");
const curated = readFileSync(CURATED, "utf-8");

/** The field names in the first column of the doc's tables. */
function fields(text: string): string[] {
  return [...text.matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);
}

/** The words in backticks in one table cell. */
function ticked(cell: string): string[] {
  return [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}

interface SpecField {
  type: string;
  /** The Values cell split into its values. An ID entry such as "15 (defending_direct)", "1(GK)" or "1: first half" also adds its number. */
  values: string[];
}

/** The spec's Type and Values cells for each field. */
function specFields(text: string): Map<string, SpecField> {
  const out = new Map<string, SpecField>();
  for (const m of text.matchAll(/^\| `([^`]+)` \| ([^|]*) \|.*\| ([^|]*) \| [A-Z, ]+ \|$/gm)) {
    const values = m[3].split(/ \/ |<br>|,/).map((v) => v.trim());
    const ids = values.flatMap((v) => /^(-?\d+) ?[(:]/.exec(v)?.[1] ?? []);
    out.set(m[1], { type: m[2].trim(), values: [...values, ...ids] });
  }
  return out;
}

interface CuratedRow {
  /** Named columns, or every column the spec lists as TRUE / FALSE minus the named exceptions. */
  columns: string[] | { trueFalseExcept: string[] };
  specCell: string;
  spec: string[];
  delivered: string[];
}

/** The rows of the curated "Values in the delivered CSV" table. */
function curatedRows(text: string): CuratedRow[] {
  return [...text.matchAll(/^\| (.+) \| (.+) \| (.+) \|$/gm)]
    .filter((m) => m[1] !== "Columns" && !m[1].startsWith("---"))
    .map((m) => ({
      columns: m[1].startsWith("Every column listed as")
        ? { trueFalseExcept: ticked(m[1]).filter((v) => v !== "TRUE" && v !== "FALSE") }
        : ticked(m[1]),
      specCell: m[2],
      spec: ticked(m[2]),
      delivered: ticked(m[3]),
    }));
}

const specField = specFields(doc);
const spec = new Map([...specField].map(([name, f]) => [name, f.values]));
const rows = curatedRows(curated);
const isTrueFalse = (values: string[]) => values.includes("TRUE") && values.includes("FALSE");

function rowColumns(row: CuratedRow): string[] {
  if (Array.isArray(row.columns)) return row.columns;
  const { trueFalseExcept } = row.columns;
  return [...spec]
    .filter(([name, values]) => isTrueFalse(values) && !trueFalseExcept.includes(name))
    .map(([name]) => name);
}

describe("skillcorner dynamic-events doc is grounded in the open data", () => {
  it("keeps the truth file pinned to a known open-data commit", () => {
    expect(truth.source.repo).toBe("https://github.com/SkillCorner/opendata");
    expect(truth.source.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(truth.columns.length).toBeGreaterThan(300);
  });

  it("documents each field once", () => {
    const names = fields(doc);
    expect(names.length).toBeGreaterThan(290);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it("reads the Type and Values of every field", () => {
    expect([...specField.keys()]).toEqual(fields(doc));
  });

  it("names only fields that are columns in the open-data CSVs", () => {
    const columns = new Set(truth.columns);
    expect(fields(doc).filter((n) => !columns.has(n))).toEqual([]);
  });

  it("flags an invented field", () => {
    const columns = new Set(truth.columns);
    const text = "| `furthest_line_break_kind` | str | x | y | PP |";
    expect(fields(text).filter((n) => !columns.has(n))).toEqual(["furthest_line_break_kind"]);
  });
});

describe("skillcorner delivered values match the open data", () => {
  it("has a curated table", () => {
    expect(curated).toMatch(/^source_type: curated$/m);
    expect(rows.length).toBeGreaterThan(5);
  });

  it("names only spec fields, and quotes a spec value or says not listed", () => {
    const unknown = rows.flatMap((row) =>
      (Array.isArray(row.columns) ? row.columns : row.columns.trueFalseExcept).filter((n) => !spec.has(n)),
    );
    expect(unknown).toEqual([]);
    expect(rows.filter((row) => row.spec.length === 0 && row.specCell !== "not listed")).toEqual([]);
    expect(rows.filter((row) => row.delivered.length === 0)).toEqual([]);
  });

  it("quotes the spec's own values in the Specification column", () => {
    const wrong = rows.flatMap((row) =>
      rowColumns(row).flatMap((name) =>
        row.spec.filter((v) => !(spec.get(name) ?? []).includes(v)).map((v) => `${name}: ${v}`),
      ),
    );
    expect(wrong).toEqual([]);
  });

  it("lists only values that the delivered CSV holds", () => {
    const wrong = rows.flatMap((row) =>
      rowColumns(row).flatMap((name) =>
        row.delivered.filter((v) => !(truth.values[name] ?? []).includes(v)).map((v) => `${name}: ${v}`),
      ),
    );
    expect(wrong).toEqual([]);
  });

  it("covers every delivered value that the spec does not list", () => {
    const covered = new Map<string, Set<string>>();
    for (const row of rows) {
      for (const name of rowColumns(row)) {
        covered.set(name, new Set([...(covered.get(name) ?? []), ...row.delivered]));
      }
    }
    const missing = [...spec].flatMap(([name, values]) => {
      if (values[0]?.startsWith("e.g.") || !truth.values[name]) return [];
      return truth.values[name]
        .filter((v) => !values.includes(v) && !covered.get(name)?.has(v))
        .map((v) => `${name}: ${v}`);
    });
    expect(missing).toEqual([]);
  });

  it("counts and names the columns the spec does not define", () => {
    const documented = new Set(fields(doc));
    const undefinedColumns = truth.columns.filter((c) => !documented.has(c));
    const section = curated.split("\n## Columns the specification does not define\n")[1] ?? "";
    const families = [...section.matchAll(/`([a-z_]+)_\*`/g)].map((m) => m[1]);
    expect(section).toContain(`carry ${undefinedColumns.length} columns`);
    expect(undefinedColumns.filter((c) => !families.some((f) => c.startsWith(`${f}_`)))).toEqual([]);
    expect(families.filter((f) => !undefinedColumns.some((c) => c.startsWith(`${f}_`)))).toEqual([]);
  });

  it("names every column whose delivered type differs from the spec", () => {
    const numeric = new Set(truth.numeric);
    const isText = (name: string) => Boolean(truth.values[name]) && !numeric.has(name);
    const differs = [...specField]
      .filter(([name, f]) => {
        const exampleNumber = /^e\.g\. -?\d/.test(f.values[0] ?? "");
        const saysNumber = f.type === "int" || f.type === "float" || exampleNumber;
        const saysBool = f.type === "bool" || isTrueFalse(f.values);
        return (saysNumber && isText(name)) || (saysBool && numeric.has(name));
      })
      .map(([name]) => name);
    const section = curated.split("\n## Types in the delivered CSV\n")[1] ?? "";
    const named = [...section.matchAll(/^- `([^`]+)`/gm)].map((m) => m[1]);
    expect(named.sort()).toEqual(differs.sort());
  });
});
