import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadStatsBombTruth, validateStatsBombDocs } from "../statsbomb-truth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DOCS_DIR = join(ROOT, "docs", "statsbomb");

const TABLE = (heading: string, rows: string) => `### ${heading}\n\n| ID | Name |\n|----|------|\n${rows}\n`;

describe("StatsBomb ID validation", () => {
  const truth = loadStatsBombTruth();

  it("has a truth file sampled from the open data", () => {
    expect(truth.source.matches).toBeGreaterThan(100);
    expect(Object.keys(truth.fields)).toContain("shot.outcome");
  });

  it("holds every ID table in docs/statsbomb to the open data", () => {
    const docs = readdirSync(DOCS_DIR)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({ path: relative(ROOT, join(DOCS_DIR, name)), text: readFileSync(join(DOCS_DIR, name), "utf-8") }));
    const violations = validateStatsBombDocs(docs, truth);
    expect(violations.map((v) => `${v.path}:${v.line} ${v.message}`)).toEqual([]);
  });

  it("flags swapped card IDs", () => {
    const violations = validateStatsBombDocs(
      [{ path: "x.md", text: TABLE("Card Types", "| 5 | Yellow Card |\n| 7 | Red Card |") }],
      truth,
    );
    expect(violations.map((v) => v.message)).toEqual([
      'Card Types 5 is "Yellow Card" in the doc; the open data has "Red Card"',
      'Card Types 7 is "Red Card" in the doc; the open data has "Yellow Card"',
    ]);
  });

  it("flags an ID that neither the data nor the documented list has", () => {
    const violations = validateStatsBombDocs([{ path: "x.md", text: TABLE("Shot Outcomes", "| 999 | Wonder Goal |") }], truth);
    expect(violations.map((v) => v.message)).toEqual([
      'Shot Outcomes 999 ("Wonder Goal") is not in the open data or the documented list',
    ]);
  });

  it("accepts a documented ID the sample does not carry", () => {
    expect(validateStatsBombDocs([{ path: "x.md", text: TABLE("Shot Types", "| 65 | Kick Off |") }], truth)).toEqual([]);
  });

  it("flags an ID table under a heading it cannot map", () => {
    const violations = validateStatsBombDocs([{ path: "x.md", text: TABLE("Mystery Codes", "| 1 | Thing |") }], truth);
    expect(violations.map((v) => v.message)).toEqual([
      'the ID table under "Mystery Codes" is not mapped to a StatsBomb field',
    ]);
  });
});
