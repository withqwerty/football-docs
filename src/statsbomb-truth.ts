/**
 * Ground-truth validation for the StatsBomb ID tables.
 *
 * Every StatsBomb event carries its vocabulary as `{ id, name }` objects: the
 * event type, the play pattern, and nested values such as `shot.outcome` or
 * `pass.height`. docs/statsbomb/event-types.md documents those IDs in tables, so
 * each row can be checked against what the public open data actually carries.
 *
 * Two halves, as for Impect:
 *
 *   1. A generator (CLI) that samples matches from the public open-data
 *      repository at a pinned commit and writes data/statsbomb-open-data-truth.json.
 *      Maintainer-only; it downloads, so CI never runs it.
 *
 *   2. validateStatsBombDocs(), a pure function the test suite runs against the
 *      committed truth file.
 *
 * Usage:
 *   pnpm statsbomb:truth                    # the pinned commit below
 *   pnpm statsbomb:truth -- --commit <sha>  # a newer snapshot
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const STATSBOMB_TRUTH_PATH = resolve(__dirname, "..", "data", "statsbomb-open-data-truth.json");

export const OPEN_DATA_REPO = "https://github.com/statsbomb/open-data";
const PINNED_COMMIT = "4b73468fc5b0f1950f9f66fada70ad3a4f9327cb";
const MATCHES_PER_SEASON = 3;

export interface StatsBombTruth {
  source: {
    repo: string;
    commit: string;
    generated_at: string;
    matches: number;
    events: number;
  };
  /** Field path (e.g. "shot.outcome") -> id (as string) -> name, as observed. */
  fields: Record<string, Record<string, string>>;
}

/**
 * Paths whose `{ id, name }` objects are people or teams, not vocabulary.
 * Their ids are entity keys, and a doc table never lists them.
 */
const ENTITY_PATH = /(^|\.)(player|team|possession_team|recipient|replacement)$/;

function collect(value: unknown, path: string, into: Map<string, Map<string, string>>): void {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, path, into);
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  if (path && typeof record.id === "number" && typeof record.name === "string" && !ENTITY_PATH.test(path)) {
    const ids = into.get(path) ?? new Map<string, string>();
    ids.set(String(record.id), record.name);
    into.set(path, ids);
  }
  for (const [key, child] of Object.entries(record)) {
    if (key === "id" || key === "name") continue;
    collect(child, path ? `${path}.${key}` : key, into);
  }
}

/** Spread picks across a season, so one round's quirks do not dominate. */
function spread<T>(items: T[], count: number): T[] {
  if (items.length <= count) return items;
  return Array.from({ length: count }, (_, index) => items[Math.floor((index * items.length) / count)]);
}

async function fetchJson(commit: string, path: string): Promise<unknown> {
  const url = `https://raw.githubusercontent.com/statsbomb/open-data/${commit}/data/${path}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

export async function generateStatsBombTruth(commit = PINNED_COMMIT): Promise<StatsBombTruth> {
  const competitions = (await fetchJson(commit, "competitions.json")) as Array<{
    competition_id: number;
    season_id: number;
  }>;
  const fields = new Map<string, Map<string, string>>();
  let matches = 0;
  let events = 0;

  for (const { competition_id, season_id } of competitions) {
    const seasonMatches = (await fetchJson(commit, `matches/${competition_id}/${season_id}.json`)) as Array<{
      match_id: number;
    }>;
    const picks = spread(
      [...seasonMatches].sort((a, b) => a.match_id - b.match_id),
      MATCHES_PER_SEASON,
    );
    for (const { match_id } of picks) {
      const matchEvents = (await fetchJson(commit, `events/${match_id}.json`)) as unknown[];
      collect(matchEvents, "", fields);
      matches += 1;
      events += matchEvents.length;
    }
  }

  const sorted = Object.fromEntries(
    [...fields.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, ids]) => [
        path,
        Object.fromEntries([...ids.entries()].sort(([a], [b]) => Number(a) - Number(b))),
      ]),
  );

  return {
    source: { repo: OPEN_DATA_REPO, commit, generated_at: new Date().toISOString(), matches, events },
    fields: sorted,
  };
}

/** Which data fields each ID table in docs/statsbomb documents, by its heading. */
export const TABLE_FIELDS: Record<string, string[]> = {
  "Event Type Reference": ["type"],
  "Play Patterns": ["play_pattern"],
  "Shot Techniques": ["shot.technique"],
  "Shot Body Parts": ["shot.body_part"],
  "Shot Types": ["shot.type"],
  "Shot Outcomes": ["shot.outcome"],
  "Pass Types": ["pass.type"],
  "Pass Heights": ["pass.height"],
  "Pass Outcomes": ["pass.outcome"],
  "Pass Techniques": ["pass.technique"],
  "Pass Body Parts": ["pass.body_part"],
  "Dribble Outcomes": ["dribble.outcome"],
  "Duel Types": ["duel.type"],
  "Duel Outcomes": ["duel.outcome"],
  "50/50 Outcomes": ["50_50.outcome"],
  "Goalkeeper Types": ["goalkeeper.type"],
  "Goalkeeper Body Parts": ["goalkeeper.body_part"],
  "Goalkeeper Techniques": ["goalkeeper.technique"],
  "Goalkeeper Positions": ["goalkeeper.position"],
  "Goalkeeper Outcomes": ["goalkeeper.outcome"],
  "Interception Outcomes": ["interception.outcome"],
  "Foul Types": ["foul_committed.type"],
  "Card Types": ["foul_committed.card", "bad_behaviour.card"],
  "Clearance Body Parts": ["clearance.body_part"],
  "Substitution Outcomes": ["substitution.outcome"],
  "Positions": ["position", "tactics.lineup.position", "shot.freeze_frame.position"],
};

/**
 * IDs the sampled matches do not carry, each listed in both the Open Data
 * Events v4.0.0 specification and kloppy's StatsBomb parser. Editorial, not
 * derived from the data, which is why they live here and not in the truth file.
 * The specification is not trusted on its own: it has the card and 50/50 IDs
 * wrong.
 */
const DOCUMENTED_ONLY: Record<string, Record<string, string>> = {
  "shot.type": { "65": "Kick Off" },
  "duel.outcome": { "1": "Lost", "15": "Success" },
  "goalkeeper.type": { "110": "Saved to Post" },
  "goalkeeper.outcome": { "17": "Success Out", "51": "In Play" },
  "interception.outcome": { "1": "Lost", "15": "Success" },
};

export interface StatsBombDoc {
  path: string;
  text: string;
}

export interface StatsBombViolation {
  path: string;
  line: number;
  message: string;
}

/** Case, punctuation and the deprecation asterisk do not count as differences. */
function normaliseName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function validateStatsBombDocs(docs: StatsBombDoc[], truth: StatsBombTruth): StatsBombViolation[] {
  const violations: StatsBombViolation[] = [];
  for (const doc of docs) {
    let heading = "";
    let inIdTable = false;
    doc.text.split("\n").forEach((line, index) => {
      const headingMatch = line.match(/^#+\s+(.*)$/);
      if (headingMatch) {
        heading = headingMatch[1].trim();
        return;
      }
      if (!line.startsWith("|")) {
        inIdTable = false;
        return;
      }
      const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      if (cells[0] === "ID") {
        inIdTable = true;
        return;
      }
      if (!inIdTable || !/^\d+$/.test(cells[0])) return;

      const [id, name] = cells;
      const at = { path: doc.path, line: index + 1 };
      const fields = TABLE_FIELDS[heading];
      if (!fields) {
        violations.push({ ...at, message: `the ID table under "${heading}" is not mapped to a StatsBomb field` });
        return;
      }
      const observed = fields.map((field) => truth.fields[field]?.[id]).find((value) => value !== undefined);
      const documented = fields.map((field) => DOCUMENTED_ONLY[field]?.[id]).find((value) => value !== undefined);
      const expected = observed ?? documented;
      if (expected === undefined) {
        violations.push({ ...at, message: `${heading} ${id} ("${name}") is not in the open data or the documented list` });
      } else if (normaliseName(expected) !== normaliseName(name)) {
        violations.push({ ...at, message: `${heading} ${id} is "${name}" in the doc; the open data has "${expected}"` });
      }
    });
  }
  return violations;
}

export function loadStatsBombTruth(): StatsBombTruth {
  return JSON.parse(readFileSync(STATSBOMB_TRUTH_PATH, "utf-8")) as StatsBombTruth;
}

const isDirectRun = process.argv[1]?.endsWith("statsbomb-truth.ts") || process.argv[1]?.endsWith("statsbomb-truth.js");
if (isDirectRun) {
  const commitArg = process.argv.indexOf("--commit");
  const commit = commitArg >= 0 ? process.argv[commitArg + 1] : PINNED_COMMIT;
  const truth = await generateStatsBombTruth(commit);
  writeFileSync(STATSBOMB_TRUTH_PATH, `${JSON.stringify(truth, null, 2)}\n`);
  console.log(
    `Wrote ${STATSBOMB_TRUTH_PATH}: ${Object.keys(truth.fields).length} fields from ${truth.source.matches} matches (${truth.source.events} events)`,
  );
}
