import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadSportMonksTruth, validateSportMonksDocs } from "../sportmonks-truth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DOCS_DIR = join(ROOT, "docs", "sportmonks");

const TABLE = (column: string, rows: string) => `| ${column} | Name |\n|---|---|\n${rows}\n`;

describe("SportMonks ID validation", () => {
  const truth = loadSportMonksTruth();

  it("holds every ID table in docs/sportmonks to SportMonks' published definitions", () => {
    const docs = readdirSync(DOCS_DIR)
      .filter((name) => name.endsWith(".md"))
      .map((name) => ({ path: relative(ROOT, join(DOCS_DIR, name)), text: readFileSync(join(DOCS_DIR, name), "utf-8") }));
    const violations = validateSportMonksDocs(docs, truth);
    expect(violations.map((v) => `${v.path}:${v.line} ${v.message}`)).toEqual([]);
  });

  it("flags swapped card types", () => {
    const violations = validateSportMonksDocs(
      [{ path: "x.md", text: TABLE("Type ID", "| 20 | Yellow/Red Card |\n| 21 | Red Card |") }],
      truth,
    );
    expect(violations.map((v) => v.message)).toEqual([
      'type 20 is "Yellow/Red Card" in the doc; SportMonks publishes "Redcard"',
      'type 21 is "Red Card" in the doc; SportMonks publishes "Yellow/Red card"',
    ]);
  });

  it("flags an ID SportMonks does not publish", () => {
    const violations = validateSportMonksDocs([{ path: "x.md", text: TABLE("Stat Type ID", "| 48 | Fouls Drawn |") }], truth);
    expect(violations.map((v) => v.message)).toEqual(["type 48 is not in SportMonks' published definitions"]);
  });

  it("checks a state's code as well as its name", () => {
    const violations = validateSportMonksDocs(
      [{ path: "x.md", text: TABLE("State ID", "| 5 | Full-Time (`AET`) |") }],
      truth,
    );
    expect(violations.map((v) => v.message)).toEqual(["state 5 has code AET in the doc; SportMonks publishes FT"]);
  });

  it("accepts SportMonks' developer name and a listed alias", () => {
    expect(
      validateSportMonksDocs(
        [{ path: "x.md", text: TABLE("Type ID", "| `118` | `RATING` |\n| `16` | Penalty goal |") }],
        truth,
      ),
    ).toEqual([]);
  });
});
