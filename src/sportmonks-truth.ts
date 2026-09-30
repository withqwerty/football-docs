/**
 * Validation for the SportMonks ID tables.
 *
 * SportMonks publishes its type and state IDs on its definitions pages and in a
 * types spreadsheet linked from the Types page. data/sportmonks-types-truth.json
 * holds those ID, name, developer name and code values as published. The tests
 * hold every ID table in docs/sportmonks to it: an ID must be published, and the
 * name the doc gives it must be SportMonks' own (or an alias listed below).
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const SPORTMONKS_TRUTH_PATH = resolve(__dirname, "..", "data", "sportmonks-types-truth.json");

type Published = { name?: string; developer_name?: string; code?: string; state?: string };

export interface SportMonksTruth {
  source: { pages: string; fetched: string; note: string };
  types: Record<string, Published>;
  states: Record<string, Published>;
}

export interface SportMonksDoc {
  path: string;
  text: string;
}

export interface SportMonksViolation {
  path: string;
  line: number;
  message: string;
}

/** Which truth section each table's first column names. */
const TABLE_SECTIONS: Record<string, "types" | "states"> = {
  "Type ID": "types",
  "Stat Type ID": "types",
  "Position ID": "types",
  "State ID": "states",
};

/**
 * Names docs use that differ from SportMonks' wording but mean the same type.
 * Keep this short: a loose match would let a swap through, since "Yellow/Red
 * card" contains "Red card".
 */
const ALIASES: Record<string, string[]> = {
  "16": ["Penalty goal"],
};

function normalise(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function loadSportMonksTruth(): SportMonksTruth {
  return JSON.parse(readFileSync(SPORTMONKS_TRUTH_PATH, "utf-8")) as SportMonksTruth;
}

export function validateSportMonksDocs(docs: SportMonksDoc[], truth: SportMonksTruth): SportMonksViolation[] {
  const violations: SportMonksViolation[] = [];
  for (const doc of docs) {
    let section: "types" | "states" | undefined;
    let header = false;
    doc.text.split("\n").forEach((line, index) => {
      if (!line.startsWith("|")) {
        section = undefined;
        header = false;
        return;
      }
      const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      if (!header) {
        header = true;
        section = TABLE_SECTIONS[cells[0]];
        return;
      }
      const id = cells[0].replace(/`/g, "");
      if (!section || !/^\d+$/.test(id)) return;

      const at = { path: doc.path, line: index + 1 };
      const published = truth[section][id];
      // "Full-Time (`FT`)" names the state and gives its code; both must match.
      const codeMatch = cells[1].match(/\(`([^`]+)`\)/);
      const name = cells[1].replace(/\(`[^`]*`\)/, "").replace(/`/g, "").trim();
      if (!published) {
        violations.push({
          ...at,
          message: `${section === "states" ? "state" : "type"} ${id} is not in SportMonks' published definitions`,
        });
        return;
      }
      const accepted = [published.name, published.developer_name, published.code, published.state, ...(ALIASES[id] ?? [])]
        .filter((value): value is string => Boolean(value))
        .map(normalise);
      if (!accepted.includes(normalise(name))) {
        violations.push({
          ...at,
          message: `${section === "states" ? "state" : "type"} ${id} is "${name}" in the doc; SportMonks publishes "${published.name ?? published.developer_name}"`,
        });
      }
      const publishedCode = published.state ?? published.developer_name;
      if (codeMatch && publishedCode && normalise(codeMatch[1]) !== normalise(publishedCode)) {
        violations.push({
          ...at,
          message: `${section === "states" ? "state" : "type"} ${id} has code ${codeMatch[1]} in the doc; SportMonks publishes ${publishedCode}`,
        });
      }
    });
  }
  return violations;
}
