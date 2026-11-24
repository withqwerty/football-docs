import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DOC = resolve(ROOT, "docs", "skillcorner", "dynamic-events.md");
const TRUTH = resolve(ROOT, "data", "skillcorner-open-data-truth.json");

interface Truth {
  source: { repo: string; commit: string; matches: number; rows: number };
  columns: string[];
}

const truth: Truth = JSON.parse(readFileSync(TRUTH, "utf-8"));
const doc = readFileSync(DOC, "utf-8");

/** The field names in the first column of the doc's tables. */
function fields(text: string): string[] {
  return [...text.matchAll(/^\| `([^`]+)` \|/gm)].map((m) => m[1]);
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
