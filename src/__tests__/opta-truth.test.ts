import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadOptaTruth, type OptaDoc, validateOptaDocs } from "../opta-truth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith(".md") ? [path] : [];
  });
}

function readDocs(): OptaDoc[] {
  const paths = [
    ...markdownFiles(join(ROOT, "docs")),
    ...["README.md", "CONTRIBUTING.md", "AGENTS.md"].map((name) => join(ROOT, name)),
  ];
  return paths.map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, "utf-8") }));
}

describe("Opta ID validation", () => {
  const truth = loadOptaTruth();

  it("holds every Opta ID table and mention to the checked meanings", () => {
    const violations = validateOptaDocs(readDocs(), truth);
    expect(violations.map((v) => `${v.path}:${v.line} ${v.message}`)).toEqual([]);
  });

  it("flags a qualifier row with the wrong label", () => {
    const violations = validateOptaDocs(
      [{ path: "docs/opta/qualifiers.md", text: "| ID | Name | Notes |\n|----|------|-------|\n| 76 | bigChance | x |\n" }],
      truth,
    );
    expect(violations.map((v) => v.message)).toEqual([
      "qualifier 76 is not in data/opta-truth.json; check it against F24 and add it",
      'states qualifier 76 as big chance (Q76 is low left; big chance is Q214): "| 76 | bigChance | x |"',
    ]);
    const relabelled = validateOptaDocs(
      [{ path: "docs/opta/qualifiers.md", text: "| ID | Name | Notes |\n|----|------|-------|\n| 214 | length | x |\n" }],
      truth,
    );
    expect(relabelled.map((v) => v.message)).toEqual([
      'qualifier 214 is labelled "length"; the checked label is "bigChance"',
      'states qualifier 214 as length or xA (Q214 is big chance): "| 214 | length | x |"',
    ]);
  });

  it("flags an event type with the wrong name", () => {
    const violations = validateOptaDocs(
      [{ path: "docs/opta/event-types.md", text: "| typeId | Name | Per match avg |\n|---|---|---|\n| 32 | Ball recovery | ~80 |\n" }],
      truth,
    );
    expect(violations.map((v) => v.message)).toEqual(['typeId 32 is named "Ball recovery"; F24 names it "Start"']);
  });

  it.each([
    ['- "What is Opta qualifier 76?" (big chance)', 76],
    ["Use Q108 to flag penalties.", 108],
    ["xG comes from qualifier 213 on shot events.", 213],
    ["Q56 marks a right-foot shot.", 56],
    ["Big chance (Q76) shots convert more often.", 76],
    ["missing qualifier ID 468 (expectedGoalsNonPenalty)", 468],
  ])("flags the old wrong meaning in %j", (text, id) => {
    const violations = validateOptaDocs([{ path: "README.md", text }], truth);
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0].message).toContain(`qualifier ${id}`);
  });

  it("flags an old wrong meaning in an Opta table row", () => {
    const violations = validateOptaDocs(
      [{ path: "docs/opta/charting-set-pieces.md", text: "| `56` | rightFoot | Right-footed action |" }],
      truth,
    );
    expect(violations.map((v) => v.message)).toEqual([
      'states qualifier 56 as right foot (Q56 is zone; right foot is Q20): "| `56` | rightFoot | Right-footed action |"',
    ]);
  });

  it.each([
    "Qualifier 213 is the pass angle, not xG.",
    "Do not read qualifier `213` as xG: it is the pass or clearance angle.",
    "use q321 from `matchexpectedgoals` (q213 is the pass angle, not xG)",
    "Q108 is Volley, NOT penalty.",
    "It is not a goal-kick flag; goal kicks are Q124. Qualifier 7 is players caught offside.",
    "Big chance = Q214.",
  ])("allows the corrected statement %j", (text) => {
    expect(validateOptaDocs([{ path: "README.md", text }], truth)).toEqual([]);
  });
});
