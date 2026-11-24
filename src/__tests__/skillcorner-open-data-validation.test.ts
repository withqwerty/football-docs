import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DOC = resolve(ROOT, "docs", "skillcorner", "dynamic-events.md");
const CURATED = resolve(ROOT, "docs", "skillcorner", "dynamic-events-delivered-values.md");
const TRUTH = resolve(ROOT, "data", "skillcorner-open-data-truth.json");
const GENERATOR = resolve(ROOT, "scripts", "gen_skillcorner_open_data_truth.py");

interface Truth {
  source: { repo: string; commit: string; matches: number; rows: number };
  columns: string[];
  /** Distinct values, for columns with at most 30. */
  values: Record<string, string[]>;
  types: Record<string, "number" | "bool" | "text">;
  /** Text-value shapes ("45:03.2" -> "dd:dd.d"), for columns with at most 5. */
  shapes: Record<string, string[]>;
  /** The event types whose rows fill each column. */
  events: Record<string, string[]>;
  /** `<name>_id` column -> ID -> the `<name>` value seen with it. */
  id_pairs: Record<string, Record<string, string>>;
}

const truth: Truth = JSON.parse(readFileSync(TRUTH, "utf-8"));
const doc = readFileSync(DOC, "utf-8");
const curated = readFileSync(CURATED, "utf-8");
const generator = readFileSync(GENERATOR, "utf-8");

const EVENT_CODES: Record<string, string> = {
  off_ball_run: "OBR",
  passing_option: "PO",
  player_possession: "PP",
  on_ball_engagement: "OBE",
};

/** The field names in the first column of the doc's tables. */
function fields(text: string): string[] {
  return [...text.matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);
}

/** The words in backticks in one table cell. */
function ticked(cell: string): string[] {
  return [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}

/** True when a cell is only backticked values joined by " / ". */
function onlyTicked(cell: string): boolean {
  return cell.replace(/`[^`]+`/g, "").replace(/ \/ /g, "").trim() === "";
}

/** One `##` section of a page, without its heading. */
function section(text: string, heading: string): string {
  const start = text.indexOf(`\n## ${heading}\n`);
  if (start < 0) return "";
  const rest = text.slice(start + heading.length + 5);
  const end = rest.indexOf("\n## ");
  return end < 0 ? rest : rest.slice(0, end);
}

interface SpecField {
  type: string;
  /** The Values cell split into its values. An ID entry such as "15 (defending_direct)", "1(GK)" or "1: first half" also adds its number. */
  values: string[];
  /** ID -> name, from entries such as "15 (defending_direct)" or "1(GK)". */
  ids: Map<string, string>;
  events: string[];
}

/** The spec's Type, Values and Events cells for each field. */
function specFields(text: string): Map<string, SpecField> {
  const out = new Map<string, SpecField>();
  for (const m of text.matchAll(/^\| `([^`]+)` \| ([^|]*) \|.*\| ([^|]*) \| ([A-Z, ]+) \|$/gm)) {
    const values = m[3].split(/ \/ |<br>|,/).map((v) => v.trim());
    const ids = new Map<string, string>();
    const numbers: string[] = [];
    for (const v of values) {
      const id = /^(-?\d+) ?(?:\((.+)\)|:)/.exec(v);
      if (!id) continue;
      numbers.push(id[1]);
      if (id[2]) ids.set(id[1], id[2]);
    }
    out.set(m[1], { type: m[2].trim(), values: [...values, ...numbers], ids, events: m[4].split(", ") });
  }
  return out;
}

interface CuratedRow {
  /** Named columns, or every column the spec lists as TRUE / FALSE minus the named exceptions. */
  columns: string[] | { trueFalseExcept: string[] };
  specCell: string;
  deliveredCell: string;
  spec: string[];
  delivered: string[];
}

/** The rows of the one table in a curated section. */
function curatedRows(text: string): CuratedRow[] {
  return [...text.matchAll(/^\| (.+) \| (.+) \| (.+) \|$/gm)]
    .filter((m) => m[1] !== "Columns" && !m[1].startsWith("---"))
    .map((m) => ({
      columns: m[1].startsWith("Every column listed as")
        ? { trueFalseExcept: ticked(m[1]).filter((v) => v !== "TRUE" && v !== "FALSE") }
        : ticked(m[1]),
      specCell: m[2],
      deliveredCell: m[3],
      spec: ticked(m[2]),
      delivered: ticked(m[3]),
    }));
}

const specField = specFields(doc);
const spec = new Map([...specField].map(([name, f]) => [name, f.values]));
const rows = curatedRows(section(curated, "Values in the delivered CSV"));
const typeRows = curatedRows(section(curated, "Types in the delivered CSV"));
const isTrueFalse = (values: string[]) => values.includes("TRUE") && values.includes("FALSE");

function rowColumns(row: CuratedRow): string[] {
  if (Array.isArray(row.columns)) return row.columns;
  const { trueFalseExcept } = row.columns;
  return [...spec]
    .filter(([name, values]) => isTrueFalse(values) && !trueFalseExcept.includes(name))
    .map(([name]) => name);
}

/** Spec value -> delivered value, per column, from the curated values table. */
const renames = new Map<string, Map<string, string>>();
for (const row of rows) {
  for (const name of rowColumns(row)) {
    const map = renames.get(name) ?? new Map<string, string>();
    for (const [i, v] of row.spec.entries()) map.set(v, row.delivered[i]);
    renames.set(name, map);
  }
}

/** The ID the data gives a value, or the ID the spec gives a value. */
function dataId(idColumn: string, value: string): string | undefined {
  return Object.entries(truth.id_pairs[idColumn] ?? {}).find(([, v]) => v === value)?.[0];
}
function specId(idColumn: string, value: string): string | undefined {
  return [...(specField.get(idColumn)?.ids ?? [])].find(([, v]) => v === value)?.[0];
}

/**
 * True when the spec's own ID list names the delivered value, at the ID the data
 * gives it, and no other spec value claims that ID. event_type is the case: its
 * Values cell says defensive_engagement, but event_type_id lists 9 (on_ball_engagement).
 */
function takesFreeId(idColumn: string, specValues: string[], delivered: string): boolean {
  const id = dataId(idColumn, delivered);
  if (id === undefined || specField.get(idColumn)?.ids.get(id) !== delivered) return false;
  return !specValues.some((v) => specId(idColumn, v) === id);
}

describe("skillcorner dynamic-events doc is grounded in the open data", () => {
  it("pins the truth file, the generator and the curated page to one commit", () => {
    const { commit, matches } = truth.source;
    expect(truth.source.repo).toBe("https://github.com/SkillCorner/opendata");
    expect(commit).toMatch(/^[0-9a-f]{40}$/);
    expect(generator).toContain(`DEFAULT_COMMIT = "${commit}"`);
    expect(curated).toMatch(new RegExp(`^source_url: .*/tree/${commit}$`, "m"));
    expect(curated).toContain(`commit \`${commit.slice(0, 7)}\``);
    expect(curated).toContain(`the ${matches} \`*_dynamic_events.csv\` files`);
    expect(truth.columns.length).toBeGreaterThan(300);
  });

  it("documents each field once", () => {
    const names = fields(doc);
    expect(names.length).toBeGreaterThan(290);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  });

  it("reads the Type, Values and Events of every field", () => {
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

  it("lists, in the Events column, the event types whose rows fill each field", () => {
    const wrong = [...specField].flatMap(([name, f]) => {
      const filled = (truth.events[name] ?? []).map((e) => EVENT_CODES[e]);
      if (filled.length === 0) return [];
      return [...f.events].sort().join(", ") === filled.sort().join(", ")
        ? []
        : [`${name}: doc ${f.events.join(", ")}, data ${filled.join(", ")}`];
    });
    expect(wrong).toEqual([]);
  });

  it("gives each ID the name the data pairs it with", () => {
    const wrong = Object.entries(truth.id_pairs).flatMap(([idColumn, pairs]) => {
      const ids = specField.get(idColumn)?.ids;
      if (!ids || ids.size === 0) return [];
      const nameColumn = idColumn.slice(0, -3);
      return Object.entries(pairs).flatMap(([id, name]) => {
        const specName = ids.get(id);
        if (specName === undefined) return [`${idColumn}: ${id} not listed`];
        const delivered = renames.get(nameColumn)?.get(specName) ?? specName;
        return delivered === name ? [] : [`${idColumn}: ${id} is ${specName} in the doc, ${name} in the data`];
      });
    });
    expect(wrong).toEqual([]);
  });
});

describe("skillcorner delivered values match the open data", () => {
  it("has curated tables", () => {
    expect(curated).toMatch(/^source_type: curated$/m);
    expect(rows.length).toBeGreaterThan(5);
    expect(typeRows.length).toBeGreaterThan(2);
  });

  it("names only spec fields, and writes every value in backticks", () => {
    const unknown = [...rows, ...typeRows].flatMap((row) =>
      (Array.isArray(row.columns) ? row.columns : row.columns.trueFalseExcept).filter((n) => !spec.has(n)),
    );
    expect(unknown).toEqual([]);
    const loose = rows.filter(
      (row) =>
        !onlyTicked(row.deliveredCell) ||
        row.delivered.length === 0 ||
        (row.specCell !== "not listed" && (!onlyTicked(row.specCell) || row.spec.length === 0)),
    );
    expect(loose).toEqual([]);
  });

  it("quotes the spec's own values in the Specification column", () => {
    const wrong = rows.flatMap((row) =>
      rowColumns(row).flatMap((name) =>
        row.spec.filter((v) => !(spec.get(name) ?? []).includes(v)).map((v) => `${name}: ${v}`),
      ),
    );
    expect(wrong).toEqual([]);
  });

  it("says not listed only for values the spec does not list", () => {
    const wrong = rows
      .filter((row) => row.specCell === "not listed")
      .flatMap((row) =>
        rowColumns(row).flatMap((name) =>
          row.delivered.filter((v) => (spec.get(name) ?? []).includes(v)).map((v) => `${name}: ${v}`),
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

  it("pairs each spec value with the delivered value it becomes", () => {
    const norm = (v: string) =>
      v
        .replace(/ \(.*\)$/, "")
        .toLowerCase()
        .replace(/ /g, "_");
    const wrong = rows
      .filter((row) => row.spec.length > 0)
      .flatMap((row) => {
        if (row.spec.length !== row.delivered.length) return [`${row.specCell}: ${row.spec.length} values, ${row.delivered.length} delivered`];
        return rowColumns(row).flatMap((name) =>
          row.spec.flatMap((v, i) => {
            const d = row.delivered[i];
            const idColumn = `${name}_id`;
            const sid = specId(idColumn, v);
            const ok =
              sid !== undefined
                ? sid === dataId(idColumn, d)
                : norm(v) === d.toLowerCase() || norm(v).startsWith(`${d}_`) || takesFreeId(idColumn, row.spec, d);
            return ok ? [] : [`${name}: ${v} -> ${d}`];
          }),
        );
      });
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
    const text = section(curated, "Columns the specification does not define");
    const families = [...text.matchAll(/`([a-z_]+)_\*`/g)].map((m) => m[1]);
    expect(text).toContain(`carry ${undefinedColumns.length} columns`);
    expect(undefinedColumns.filter((c) => !families.some((f) => c.startsWith(`${f}_`)))).toEqual([]);
    expect(families.filter((f) => !undefinedColumns.some((c) => c.startsWith(`${f}_`)))).toEqual([]);
  });

  it("names every column whose delivered type differs from the spec", () => {
    const SPEC_TIMESTAMP = "dd:dd:dd.ddd";
    const differs = [...specField]
      .filter(([name, f]) => {
        const type = truth.types[name];
        if (!type) return false;
        const exampleNumber = /^e\.g\. -?\d+(\.\d+)?$/.test(f.values[0] ?? "");
        const saysNumber = f.type === "int" || f.type === "float" || exampleNumber;
        const saysBool = f.type === "bool" || isTrueFalse(f.values);
        if (f.type === "timestamp") return (truth.shapes[name] ?? []).some((s) => s !== SPEC_TIMESTAMP);
        return (saysNumber && type !== "number") || (saysBool && type !== "bool") || (f.type === "str" && type !== "text");
      })
      .map(([name]) => name);
    const named = typeRows.flatMap(rowColumns);
    expect(named.sort()).toEqual(differs.sort());
  });

  it("gives the delivered type and form of each column in the types table", () => {
    const wrong = typeRows.flatMap((row) =>
      rowColumns(row).flatMap((name) => {
        const type = truth.types[name];
        if (!row.deliveredCell.startsWith(`${type}`)) return [`${name}: data holds ${type}`];
        const forms = ticked(row.deliveredCell).filter((v) => /^[A-Z]+:/.test(v));
        const shapes = forms.map((v) => v.replace(/[A-Za-z]/g, "d"));
        return shapes.every((s) => (truth.shapes[name] ?? []).includes(s)) ? [] : [`${name}: form ${forms}`];
      }),
    );
    expect(wrong).toEqual([]);
  });
});
