/**
 * Validation for the Opta ID tables.
 *
 * Opta's reference, the Stats Perform F24 appendices, has no machine-readable
 * form, so data/opta-truth.json is kept by hand: each ID the docs use,
 * with the label the docs give it, checked against F24. The tests then hold the
 * docs to that file, and reject meanings that were wrong in earlier versions of
 * the docs (Q76 as big chance, Q213 as xG and so on) wherever they reappear.
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const OPTA_TRUTH_PATH = resolve(__dirname, "..", "data", "opta-truth.json");

export interface OptaTruth {
  source: { reference: string; url: string; checked: string; note: string };
  /** typeId -> event type name. */
  eventTypes: Record<string, string>;
  /** qualifierId -> the label docs/opta/qualifiers.md gives it. */
  qualifiers: Record<string, string>;
}

export interface OptaDoc {
  path: string;
  text: string;
}

export interface OptaViolation {
  path: string;
  line: number;
  message: string;
}

export function loadOptaTruth(): OptaTruth {
  return JSON.parse(readFileSync(OPTA_TRUTH_PATH, "utf-8")) as OptaTruth;
}

/**
 * Meanings earlier docs gave these IDs, all wrong. The pattern matches the ID
 * and the wrong meaning in one clause, in either order, and in a row of an Opta
 * qualifier table. A clause that negates the claim ("Q213 is the pass angle, not
 * xG", "Do not read qualifier 213 as xG") is allowed.
 */
export const WRONG_MEANINGS: Array<{ id: number; meaning: string; pattern: RegExp }> = [
  { id: 7, meaning: "goal kick (goal kick is Q124)", pattern: /goal[- ]?kick/ },
  { id: 17, meaning: "blocked x (blocked x is Q146)", pattern: /block(ed)?[ _-]?x/ },
  { id: 18, meaning: "blocked y (blocked y is Q147)", pattern: /block(ed)?[ _-]?y/ },
  { id: 20, meaning: "an involved-player field (Q20 is right foot)", pattern: /involved/ },
  { id: 22, meaning: "other body part (other body part is Q21)", pattern: /other[ _-]?body/ },
  { id: 24, meaning: "assisted shot (Q24 is set piece; assisted is Q29)", pattern: /assisted[ _-]?shot/ },
  { id: 26, meaning: "low drive (Q26 is a direct free-kick shot)", pattern: /low[ _-]?drive/ },
  { id: 31, meaning: "second yellow (Q31 is yellow card; second yellow is Q32)", pattern: /second[ _-]?yellow/ },
  { id: 56, meaning: "right foot (Q56 is zone; right foot is Q20)", pattern: /right[ _-]?foot/ },
  { id: 72, meaning: "angle (Q72 is left foot; angle is Q213)", pattern: /\bangle\b/ },
  { id: 76, meaning: "big chance (Q76 is low left; big chance is Q214)", pattern: /big[ _-]?chance/ },
  { id: 108, meaning: "penalty (Q108 is volley; penalty is Q9)", pattern: /penalt/ },
  { id: 136, meaning: "direct free kick (Q136 is keeper touched)", pattern: /direct[ _-]?(free|fk)/ },
  { id: 154, meaning: "volley (Q154 is intentional assist; volley is Q108)", pattern: /volley/ },
  { id: 213, meaning: "xG (Q213 is angle; xG is Q321)", pattern: /\bxg\b|\bexpected[ _-]?goals\b/ },
  { id: 214, meaning: "length or xA (Q214 is big chance)", pattern: /\blength\b|\bxa\b|\bexpected[ _-]?assist/ },
  { id: 328, meaning: "strong or big chance (Q328 is first touch)", pattern: /strong|powerful|big[ _-]?chance/ },
  { id: 468, meaning: "xG (Q468 is related error 1 ID)", pattern: /\bxg\b|\bexpected[ _-]?goals/ },
];

const NEGATION = /\bnot\b|\bnever\b|n't\b|\binstead\b/;
/** A clause ends at a full stop, semicolon or table cell. */
const CLAUSE = "[^.;|\\n]{0,60}?";

function idPattern(id: number): string {
  return `(?:\\bq|\\bqualifier\\s*(?:id\\s*)?\`?)${id}\\b\`?`;
}

function lineOf(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

/** The start of the clause that ends at `index`, for a negation before the match. */
function clauseBefore(text: string, index: number): string {
  const before = text.slice(Math.max(0, index - 40), index);
  return before.split(/[.;|\n]/).pop() ?? "";
}

function findWrongMeanings(doc: OptaDoc): OptaViolation[] {
  const text = doc.text.toLowerCase();
  const violations: OptaViolation[] = [];
  const report = (id: number, meaning: string, index: number, length: number) =>
    violations.push({
      path: doc.path,
      line: lineOf(doc.text, index),
      message: `states qualifier ${id} as ${meaning}: "${doc.text.slice(index, index + length)}"`,
    });

  for (const { id, meaning, pattern } of WRONG_MEANINGS) {
    const forward = new RegExp(`${idPattern(id)}(${CLAUSE})(?:${pattern.source})`, "g");
    const backward = new RegExp(`(?:${pattern.source})(${CLAUSE})${idPattern(id)}`, "g");
    for (const regex of [forward, backward]) {
      for (const match of text.matchAll(regex)) {
        const index = match.index ?? 0;
        if (NEGATION.test(match[1] ?? "") || NEGATION.test(clauseBefore(text, index))) continue;
        report(id, meaning, index, match[0].length);
      }
    }
  }

  // Opta tables give the ID a cell of its own ("| 76 | bigChance |"). The typeId
  // table is skipped: its IDs are event types, not qualifiers.
  if (doc.path.includes("opta/") && !doc.path.endsWith("event-types.md")) {
    let offset = 0;
    for (const line of text.split("\n")) {
      const row = line.match(/^\|\s*`?(\d+)`?\s*\|(.*)$/);
      const entry = row && WRONG_MEANINGS.find((candidate) => String(candidate.id) === row[1]);
      if (row && entry) {
        const hit = row[2].match(entry.pattern);
        if (hit && !NEGATION.test(row[2].slice(0, hit.index))) report(entry.id, entry.meaning, offset, line.length);
      }
      offset += line.length + 1;
    }
  }
  return violations;
}

/** Rows of every table whose header starts with the given first column name. */
function idTableRows(text: string, firstColumn: string): Array<{ id: string; name: string; line: number }> {
  const rows: Array<{ id: string; name: string; line: number }> = [];
  let inTable = false;
  text.split("\n").forEach((line, index) => {
    const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
    if (line.startsWith("|") && cells[0] === firstColumn) {
      inTable = true;
      return;
    }
    if (!line.startsWith("|")) {
      inTable = false;
      return;
    }
    if (inTable && /^\d+$/.test(cells[0])) rows.push({ id: cells[0], name: cells[1], line: index + 1 });
  });
  return rows;
}

export function validateOptaDocs(docs: OptaDoc[], truth: OptaTruth): OptaViolation[] {
  const violations: OptaViolation[] = [];
  for (const doc of docs) {
    if (doc.path.endsWith("opta/qualifiers.md")) {
      for (const row of idTableRows(doc.text, "ID")) {
        const expected = truth.qualifiers[row.id];
        if (expected === undefined) {
          violations.push({
            path: doc.path,
            line: row.line,
            message: `qualifier ${row.id} is not in data/opta-truth.json; check it against F24 and add it`,
          });
        } else if (row.name !== expected) {
          violations.push({
            path: doc.path,
            line: row.line,
            message: `qualifier ${row.id} is labelled "${row.name}"; the checked label is "${expected}"`,
          });
        }
      }
    }
    if (doc.path.endsWith("opta/event-types.md")) {
      for (const row of idTableRows(doc.text, "typeId")) {
        const expected = truth.eventTypes[row.id];
        if (expected === undefined) {
          violations.push({
            path: doc.path,
            line: row.line,
            message: `typeId ${row.id} is not in data/opta-truth.json; check it against F24 and add it`,
          });
        } else if (row.name.toLowerCase() !== expected.toLowerCase()) {
          violations.push({
            path: doc.path,
            line: row.line,
            message: `typeId ${row.id} is named "${row.name}"; F24 names it "${expected}"`,
          });
        }
      }
    }
    violations.push(...findWrongMeanings(doc));
  }
  return violations;
}
