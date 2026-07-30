import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  type DocFile,
  extractUppercaseTokens,
  loadTruth,
  validateImpectDocs,
} from "../impect-truth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMPECT_DOCS = resolve(__dirname, "..", "..", "docs", "impect");

function loadImpectDocs(): DocFile[] {
  return readdirSync(IMPECT_DOCS)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({ file, text: readFileSync(resolve(IMPECT_DOCS, file), "utf-8") }));
}

describe("impect docs are grounded in the open-data repository", () => {
  const truth = loadTruth();
  const docs = loadImpectDocs();

  it("has docs to validate", () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  it("cites only enum members, KPI names and codes present in the open data", () => {
    const violations = validateImpectDocs(docs, truth);
    expect(violations).toEqual([]);
  });

  it("names the open-data repository as the source in every file", () => {
    for (const { file, text } of docs) {
      expect(text, `${file} should declare its source`).toContain(
        "github.com/ImpectAPI/open-data",
      );
    }
  });

  it("carries the static-snapshot caveat in the overview", () => {
    const overview = docs.find((d) => d.file === "overview.md");
    expect(overview).toBeDefined();
    expect(overview?.text).toContain("static snapshot");
    expect(overview?.text).toContain("Bundesliga 2023/24");
  });

  it("credits Impect as the data source", () => {
    const overview = docs.find((d) => d.file === "overview.md");
    expect(overview?.text).toContain("credit Impect");
  });

  it("keeps the truth file pinned to a known open-data commit", () => {
    expect(truth.source.repo).toBe("https://github.com/ImpectAPI/open-data");
    expect(truth.source.commit).toMatch(/^[0-9a-f]{40}$/);
    expect(Object.keys(truth.kpis).length).toBeGreaterThan(0);
  });

  it("flags an invented enum value", () => {
    const violations = validateImpectDocs(
      [{ file: "fake.md", text: "The phase is `TOTALLY_INVENTED_PHASE` here." }],
      truth,
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("TOTALLY_INVENTED_PHASE");
  });

  it("flags a mismatched KPI id", () => {
    const violations = validateImpectDocs(
      [{ file: "fake.md", text: "| `0` | `NOT_THE_RIGHT_NAME` | Label |" }],
      truth,
    );
    expect(violations.some((v) => v.includes("BYPASSED_OPPONENTS"))).toBe(true);
  });

  it("flags reintroduced commercial-API references", () => {
    // Assembled at runtime so this test file does not itself carry the strings
    // it exists to keep out of the corpus.
    const host = ["api", "impect", "com"].join(".");
    const violations = validateImpectDocs(
      [{ file: "fake.md", text: `Authenticate against https://${host} first.` }],
      truth,
    );
    expect(violations.some((v) => v.includes("forbidden commercial-API reference"))).toBe(true);
  });

  it("extracts only code-span uppercase tokens", () => {
    expect(extractUppercaseTokens("`LOW_PASS` and PLAIN_PROSE and `xg`")).toEqual(["LOW_PASS"]);
  });
});
