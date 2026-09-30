import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadOpenApiTruth } from "../provider-truth.js";

// The STATSports, Firstbeat, Hawkin Dynamics and VALD docs reproduce whole schemas
// and metric vocabularies as tables. provider-truth.test.ts holds their endpoints
// to the specs; this file holds their field names, and checks that the two large
// vocabularies (STATSports DrillKpiV7, Hawkin metrics.json) are complete.
// Snapshots and refresh steps: specs/README.md.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const readDoc = (provider: string, file: string) =>
  readFileSync(resolve(ROOT, "docs", provider, file), "utf8");
const readSpec = (path: string) => JSON.parse(readFileSync(resolve(ROOT, "specs", path), "utf8"));

/** Backticked names in the first column of every markdown table body row. */
function firstColumnNames(text: string): string[] {
  const names: string[] = [];
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (/^\|\s*-{3}/.test(lines[i + 1] ?? "")) return; // a header row
    const match = line.match(/^\|\s*`([^`]+)`\s*\|/);
    if (match) names.push(match[1]);
  });
  return names;
}

/** Rows of the table under a `## heading`, as backticked first-column names. */
function tableUnder(text: string, heading: string): string[] {
  const start = text.indexOf(`\n## ${heading}\n`);
  if (start === -1) throw new Error(`no section "${heading}"`);
  const rest = text.slice(start + 1);
  const next = rest.indexOf("\n## ", 1);
  return firstColumnNames(next === -1 ? rest : rest.slice(0, next));
}

/** Schema and field tables whose first column must name something in the spec. */
const FIELD_TABLE_DOCS: Record<string, string[]> = {
  statsports: ["data-model.md", "drill-kpi-metrics.md"],
  firstbeat: ["data-model.md"],
  "hawkin-dynamics": ["data-model.md"],
  vald: readdirSync(resolve(ROOT, "docs", "vald")).filter(
    (f) => !["api-access.md", "api-endpoints.md", "identity-surfaces.md", "data-provenance.md"].includes(f),
  ),
};

describe("wearable vendor docs are grounded in the vendor's spec", () => {
  it.each(Object.entries(FIELD_TABLE_DOCS))("%s field tables name only spec fields", (provider, files) => {
    const truth = loadOpenApiTruth(provider);
    const known = new Set([
      ...truth.fields,
      ...truth.parameters,
      ...truth.schemas,
      ...Object.values(truth.enums).flat(),
    ]);
    let checked = 0;
    const unknown: string[] = [];
    for (const file of files) {
      for (const name of firstColumnNames(readDoc(provider, file))) {
        // Endpoint rows are held to the spec by provider-truth.test.ts.
        if (/^(GET|POST|PUT|PATCH|DELETE)\b/.test(name)) continue;
        checked += 1;
        if (!known.has(name)) unknown.push(`${file}: ${name}`);
      }
    }
    expect(unknown).toEqual([]);
    expect(checked).toBeGreaterThan(20);
  });

  it("lists every DrillKpiV7 field exactly once", () => {
    const spec = readSpec("statsports/thirdpartyapi-v7.json");
    const fields = Object.keys(spec.components.schemas.DrillKpiV7.properties);
    const text = readDoc("statsports", "drill-kpi-metrics.md");
    const documented = text
      .split("\n## ")
      .filter((section) => section.startsWith("DrillKpiV7 fields:"))
      .flatMap((section) => firstColumnNames(section));
    expect(fields).toHaveLength(319);
    expect([...documented].sort()).toEqual([...fields].sort());
  });

  it("lists the DrillKpiV6 fields that v7 dropped and the fields v6 added over v5", () => {
    const schemas = readSpec("statsports/thirdpartyapi-v7.json").components.schemas;
    const v7 = Object.keys(schemas.DrillKpiV7.properties);
    const v6 = Object.keys(schemas.DrillKpiV6.properties);
    const v5 = Object.keys(schemas.DrillKpiV5.properties);
    const text = readDoc("statsports", "drill-kpi-metrics.md");
    expect(tableUnder(text, "DrillKpiV6 fields not in DrillKpiV7").sort()).toEqual(
      v6.filter((f) => !v7.includes(f)).sort(),
    );
    expect(tableUnder(text, "DrillKpiV6 fields not in DrillKpiV5").sort()).toEqual(
      v6.filter((f) => !v5.includes(f)).sort(),
    );
  });

  it("lists every metric of each test type the Hawkin reference page shows", () => {
    // The page leaves out two test types with no testTypeName and three by
    // product decision; the doc does the same and says so.
    const excluded = new Set([
      "zwGhMmCVKKrf8Fgccg23",
      "2jNA63KIvQcqKlxo63we",
      "cloaBt6gXbKvsrDcqNAs",
      "HWI4BzMSq0S0HFjWPIeC",
      "3HKDlteQolAUXmEKKWoT",
    ]);
    const metrics = readSpec("hawkin-dynamics/metrics.json") as Array<{
      canonicalTestTypeId: string;
      testTypeName?: string;
      metrics: Array<{ id: string; units: string }>;
    }>;
    const text = readDoc("hawkin-dynamics", "test-metrics.md");
    const shown = metrics.filter((t) => t.testTypeName && !excluded.has(t.canonicalTestTypeId));
    expect(shown.length).toBe(13);
    for (const testType of shown) {
      expect(tableUnder(text, `${testType.testTypeName} metrics`)).toEqual(testType.metrics.map((m) => m.id));
    }
  });

  it("keeps sample athlete values out of the docs", () => {
    // Spec examples include names and email addresses. The docs list fields only.
    for (const provider of Object.keys(FIELD_TABLE_DOCS)) {
      for (const file of readdirSync(resolve(ROOT, "docs", provider))) {
        const text = readDoc(provider, file);
        expect(text, `${provider}/${file}`).not.toMatch(/[\w.+-]+@example\.com/);
        expect(text, `${provider}/${file}`).not.toContain("John Doe");
      }
    }
  });
});
