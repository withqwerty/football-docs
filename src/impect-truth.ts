/**
 * Ground-truth validation for the Impect documentation set.
 *
 * The Impect corpus is built from one source only: the public open-data
 * repository at https://github.com/ImpectAPI/open-data. Everything in
 * docs/impect/ must be traceable to it — enum members, KPI names and IDs, and
 * field names all appear in that repository, so anything else in the docs is an
 * invention and should fail the build.
 *
 * Two halves:
 *
 *   1. A generator (CLI) that reads a local clone of the open-data repository
 *      and writes data/impect-open-data-truth.json. Maintainer-only; needs the
 *      clone, so it is not run in CI.
 *
 *   2. validateImpectDocs(), a pure function run by the test suite against the
 *      committed truth file. No clone required.
 *
 * Usage:
 *   pnpm impect:truth                              # uses IMPECT_OPEN_DATA_DIR
 *   pnpm impect:truth -- --dir /path/to/open-data
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRUTH_PATH = resolve(__dirname, "..", "data", "impect-open-data-truth.json");

export const OPEN_DATA_REPO = "https://github.com/ImpectAPI/open-data";

export interface ImpectTruth {
  source: {
    repo: string;
    commit: string;
    generated_at: string;
    matches: number;
    events: number;
  };
  /** Enum members observed in the snapshot, by field name. */
  enums: Record<string, string[]>;
  /** KPI id (as string) -> machine name, from kpi_definitions.json. */
  kpis: Record<string, string>;
  /** ISO and FIFA country codes from countries.json. */
  countryCodes: string[];
}

/**
 * Documented in the repository's Documentation.pdf but not present in the
 * snapshot, so the generator cannot observe them. Editorial, not derived from
 * the data — which is why these live here rather than in the truth file.
 */
const DOCUMENTED_ONLY = [
  // dataV4+ woodwork enum
  "LEFT_POST",
  "RIGHT_POST",
  "CROSSBAR",
  "CROSSBAR_LEFT_POST",
  "CROSSBAR_RIGHT_POST",
  // dataV4+ card action / actionType
  "YELLOW_CARD",
  // appendix 3 documents GROUND_DUEL as an action; the data emits DUEL there
  "GROUND_DUEL",
  // appendix 8 prints the pxT identity with this spelling; the KPI is PXT_NO_VIDEO
  "PXT_NOVIDEO",
  // documented enum members outside this snapshot's coverage (men's club league)
  "FEMALE",
  "NATIONAL_TEAM",
];

/** Values the docs name only to rule them out, as negative examples. */
const NON_MEMBERS = ["BUILD_UP", "COUNTER_ATTACK"];

/** Tokens that are not Impect data values at all. */
const ALLOWLIST = [
  "OPP_", // the bare prefix, discussed as a prefix
  "STATIC_HOME_AWAY", // kloppy orientation, in the loading example
];

/**
 * Guards against Impect's commercial API surface reappearing in the corpus.
 * Assembled patterns rather than literal strings: this file is the enforcement
 * mechanism, so it should not carry a copy of what it exists to keep out.
 */
export const FORBIDDEN_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "Impect API hostname", pattern: /\b(?:api|login)\.impect\.com\b/i },
  { label: "Impect commercial API path", pattern: /\bcustomer[-_]?api\b/i },
  { label: "bundled Impect OpenAPI spec", pattern: /impect[-_]?openapi/i },
];

/** Collect every distinct non-null value at a dotted path across an array of records. */
function collect(records: unknown[], path: string): string[] {
  const parts = path.split(".");
  const out = new Set<string>();
  for (const record of records) {
    let value: unknown = record;
    for (const part of parts) {
      if (value === null || typeof value !== "object") {
        value = null;
        break;
      }
      value = (value as Record<string, unknown>)[part];
    }
    if (typeof value === "string") out.add(value);
  }
  return [...out].sort();
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf-8"));
}

/** Build the truth file from a local clone of the open-data repository. */
export function generateTruth(openDataDir: string, commit: string, generatedAt: string): ImpectTruth {
  const dataDir = resolve(openDataDir, "data");

  const eventFiles = readdirSync(resolve(dataDir, "events")).filter((f) => f.endsWith(".json"));
  const enums: Record<string, Set<string>> = {};
  const add = (field: string, values: string[]) => {
    enums[field] ??= new Set();
    for (const v of values) enums[field].add(v);
  };

  let eventCount = 0;
  for (const file of eventFiles) {
    const events = readJson(resolve(dataDir, "events", file)) as unknown[];
    eventCount += events.length;

    add("actionType", collect(events, "actionType"));
    add("action", collect(events, "action"));
    add("result", collect(events, "result"));
    add("phase", collect(events, "phase"));
    add("bodyPart", collect(events, "bodyPart"));
    add("bodyPartExtended", collect(events, "bodyPartExtended"));
    add("previousPassHeight", collect(events, "previousPassHeight"));
    add("distanceToOpponent", collect(events, "distanceToOpponent"));
    add("duelType", collect(events, "duel.duelType"));
    add("receiverType", collect(events, "pass.receiver.type"));
    add("position", collect(events, "player.position"));
    add("positionSide", collect(events, "player.positionSide"));
    for (const end of ["start", "end"]) {
      add("packingZone", collect(events, `${end}.packingZone`));
      add("lane", collect(events, `${end}.lane`));
      add("pitchPosition", collect(events, `${end}.pitchPosition`));
    }
  }

  // BANK and UNKNOWN appear only in lineups, never on events.
  for (const file of readdirSync(resolve(dataDir, "lineups")).filter((f) => f.endsWith(".json"))) {
    const lineup = readJson(resolve(dataDir, "lineups", file)) as Record<string, unknown>;
    for (const side of ["squadHome", "squadAway"]) {
      const squad = lineup[side] as Record<string, unknown> | undefined;
      if (!squad) continue;
      const starting = (squad.startingPositions ?? []) as unknown[];
      const subs = (squad.substitutions ?? []) as unknown[];
      add("position", collect(starting, "position"));
      add("position", collect(subs, "toPosition"));
      add("position", collect(subs, "fromPosition"));
      add("positionSide", collect(starting, "positionSide"));
      add("positionSide", collect(subs, "positionSide"));
      add("positionSide", collect(subs, "fromPositionSide"));
    }
  }

  const iterationDir = resolve(dataDir, "players");
  const players = readdirSync(iterationDir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => readJson(resolve(iterationDir, f)) as unknown[]);
  add("leg", collect(players, "leg"));
  add("gender", collect(players, "gender"));

  const squads = readdirSync(resolve(dataDir, "squads"))
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => readJson(resolve(dataDir, "squads", f)) as unknown[]);
  add("squadType", collect(squads, "type"));

  const iterations = readJson(resolve(dataDir, "iterations.json")) as unknown[];
  add("dataVersion", collect(iterations, "dataVersion"));

  const kpiDefs = readJson(resolve(dataDir, "kpi_definitions.json")) as Array<{
    id: number;
    name: string;
  }>;
  const kpis: Record<string, string> = {};
  for (const kpi of kpiDefs) kpis[String(kpi.id)] = kpi.name;

  const countries = readJson(resolve(dataDir, "countries.json")) as unknown[];
  const countryCodes = [
    ...new Set([...collect(countries, "isoCode"), ...collect(countries, "fifaCode")]),
  ].sort();

  const matches = readdirSync(resolve(dataDir, "matches"))
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => readJson(resolve(dataDir, "matches", f)) as unknown[]);

  return {
    source: {
      repo: OPEN_DATA_REPO,
      commit,
      generated_at: generatedAt,
      matches: matches.length,
      events: eventCount,
    },
    enums: Object.fromEntries(
      Object.entries(enums)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([field, values]): [string, string[]] => [field, [...values].sort()]),
    ),
    kpis,
    countryCodes,
  };
}

export interface DocFile {
  file: string;
  text: string;
}

/** Every SCREAMING_SNAKE_CASE token inside a backtick code span. */
export function extractUppercaseTokens(text: string): string[] {
  const out = new Set<string>();
  for (const match of text.matchAll(/`([A-Z][A-Z0-9_]{2,})`/g)) {
    out.add(match[1]);
  }
  return [...out];
}

/**
 * Check the Impect docs against the open-data ground truth.
 * Returns a list of human-readable violations; empty means clean.
 */
export function validateImpectDocs(docs: DocFile[], truth: ImpectTruth): string[] {
  const violations: string[] = [];

  const known = new Set<string>([
    ...Object.values(truth.enums).flat(),
    ...Object.values(truth.kpis),
    ...truth.countryCodes,
    ...DOCUMENTED_ONLY,
    ...NON_MEMBERS,
    ...ALLOWLIST,
  ]);

  for (const { file, text } of docs) {
    for (const { label, pattern } of FORBIDDEN_PATTERNS) {
      if (pattern.test(text)) {
        violations.push(`${file}: contains forbidden commercial-API reference (${label})`);
      }
    }

    for (const token of extractUppercaseTokens(text)) {
      if (!known.has(token)) {
        violations.push(
          `${file}: "${token}" is not present in the open-data repository — invented, renamed, or needs an explicit entry in impect-truth.ts`,
        );
      }
    }

    // The KPI index table maps ID -> name; both must match the source file.
    for (const row of text.matchAll(/^\|\s*`(\d+)`\s*\|\s*`([A-Z][A-Z0-9_]*)`\s*\|/gm)) {
      const [, id, name] = row;
      const actual = truth.kpis[id];
      if (actual === undefined) {
        violations.push(`${file}: KPI id ${id} does not exist in kpi_definitions.json`);
      } else if (actual !== name) {
        violations.push(`${file}: KPI id ${id} is "${actual}" in the source, documented as "${name}"`);
      }
    }
  }

  return violations;
}

export function loadTruth(path: string = TRUTH_PATH): ImpectTruth {
  return JSON.parse(readFileSync(path, "utf-8")) as ImpectTruth;
}

function main() {
  const dirArg = process.argv.indexOf("--dir");
  const openDataDir =
    dirArg >= 0 ? process.argv[dirArg + 1] : process.env.IMPECT_OPEN_DATA_DIR;

  if (!openDataDir) {
    console.error(
      `Need a local clone of ${OPEN_DATA_REPO}.\n` +
        `  git clone ${OPEN_DATA_REPO}.git\n` +
        "  pnpm impect:truth -- --dir /path/to/open-data\n" +
        "or set IMPECT_OPEN_DATA_DIR.",
    );
    process.exit(1);
  }

  const commit = process.env.IMPECT_OPEN_DATA_COMMIT ?? "unknown";
  const generatedAt = new Date().toISOString().slice(0, 10);

  console.log(`Reading open data from ${openDataDir}...`);
  const truth = generateTruth(openDataDir, commit, generatedAt);

  writeFileSync(TRUTH_PATH, `${JSON.stringify(truth, null, 2)}\n`);

  const enumCount = Object.values(truth.enums).reduce((n, v) => n + v.length, 0);
  console.log(
    `Wrote ${TRUTH_PATH}\n` +
      `  ${truth.source.events} events across ${truth.source.matches} matches\n` +
      `  ${Object.keys(truth.enums).length} enums, ${enumCount} members\n` +
      `  ${Object.keys(truth.kpis).length} KPI definitions`,
  );
}

const isDirectRun =
  process.argv[1]?.endsWith("impect-truth.ts") || process.argv[1]?.endsWith("impect-truth.js");
if (isDirectRun) {
  main();
}
