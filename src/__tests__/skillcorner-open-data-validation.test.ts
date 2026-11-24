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

/** The spec's Values cell for each field, split into its values. */
function specValues(text: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const m of text.matchAll(/^\| `([^`]+)` \|.*\| ([^|]*) \| [A-Z, ]+ \|$/gm)) {
    out.set(m[1], m[2].split(/ \/ |<br>|,/).map((v) => v.trim()));
  }
  return out;
}

interface CuratedRow {
  /** Named columns, or every column the spec lists as TRUE / FALSE minus the named exceptions. */
  columns: string[] | { trueFalseExcept: string[] };
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
      spec: ticked(m[2]),
      delivered: ticked(m[3]),
    }));
}

const spec = specValues(doc);
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

  it("states the two type mismatches", () => {
    expect(isTrueFalse(spec.get("xloss_player_possession_start") ?? [])).toBe(true);
    expect(truth.numeric).toContain("xloss_player_possession_start");
    expect(truth.values.player_targeted_difficult_pass_target).toEqual(["False", "True"]);
    expect(curated).toContain("`xloss_player_possession_start` is listed with the values `TRUE` / `FALSE`");
    expect(curated).toContain("`player_targeted_difficult_pass_target` is typed `float`");
  });
});
