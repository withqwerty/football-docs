/**
 * Validate provider docs against ground truth introspected from the real package.
 *
 * Companion to scripts/gen_python_truth.py, which writes
 * data/provider-truth/<provider>.json from an installed package. This module
 * checks docs/<provider>/*.md against those facts and is run by the test suite,
 * so a doc claiming a symbol or enum member that does not exist fails the build.
 *
 * Two checks, both chosen for precision over coverage:
 *
 *   1. Imports  - every `from <package> import X` in a doc must resolve to a real
 *                 symbol. This is what catches fabricated API surface.
 *   2. Enum members - every SCREAMING_SNAKE token in a code span must belong to
 *                 one of the package's enums, or be explicitly allowlisted below.
 *
 * Regenerate a truth file after a version bump:
 *   python3 scripts/gen_python_truth.py kloppy --provider kloppy
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TRUTH_DIR = resolve(__dirname, "..", "data", "provider-truth");
const DOCS_DIR = resolve(__dirname, "..", "docs");

export interface PythonPackageTruth {
  provider: string;
  kind: string;
  source: { package: string; version: string; generated_at: string };
  modules: Record<string, string[]>;
  enums: Record<string, string[]>;
  valueLists: Record<string, string[]>;
  classes: string[];
  symbols: string[];
  signatures: Record<string, string>;
}

/**
 * SCREAMING_SNAKE tokens that legitimately appear in a provider's docs without
 * being members of that package's own enums - other providers' vocabularies,
 * format markers, and column names. Anything not listed here and not in the
 * package is treated as invented.
 */
const TOKEN_ALLOWLIST: Record<string, string[]> = {
  kloppy: ["SPADL", "VAEP"],
  socceraction: ["SPADL", "VAEP"],
  soccerdata: [
    // Environment variables and a log level, read by the package but not symbols in it.
    "SOCCERDATA_DIR",
    "SOCCERDATA_LOGLEVEL",
    "SOCCERDATA_MAXAGE",
    "SOCCERDATA_NOCACHE",
    "SOCCERDATA_NOSTORE",
    "INFO",
    // football-data.co.uk CSV headers, which MatchHistory passes through unrenamed.
    "FTHG",
    "FTAG",
    "HTHG",
    "HTAG",
    "B365H",
    "B365D",
    "B365A",
  ],
  mplsoccer: [],
  floodlight: ["PATH"],
  databallpy: [],
  // HTTP verbs in the endpoint tables.
  skillcorner: ["GET", "POST"],
};

export interface DocFile {
  file: string;
  text: string;
}

export function loadProviderTruth(provider: string): PythonPackageTruth {
  return JSON.parse(
    readFileSync(resolve(TRUTH_DIR, `${provider}.json`), "utf-8"),
  ) as PythonPackageTruth;
}

export function listTruthProviders(): string[] {
  return readdirSync(TRUTH_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function loadProviderDocs(provider: string): DocFile[] {
  const dir = resolve(DOCS_DIR, provider);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => ({ file, text: readFileSync(resolve(dir, file), "utf-8") }));
}

/** Names imported from the package in `from x import a, b` statements. */
export function extractImportedSymbols(text: string, pkg: string): string[] {
  const out = new Set<string>();
  const re = new RegExp(`from\\s+(${pkg}(?:\\.[\\w.]+)?)\\s+import\\s+([^\\n#]+)`, "g");
  for (const match of text.matchAll(re)) {
    for (const raw of match[2].split(",")) {
      const name = raw.trim().replace(/\s+as\s+\w+$/, "").trim();
      // `import *` says nothing about individual names.
      if (name && name !== "*" && /^[A-Za-z_]\w*$/.test(name)) out.add(name);
    }
  }
  return [...out];
}

/** SCREAMING_SNAKE_CASE tokens inside backtick code spans. */
export function extractEnumTokens(text: string): string[] {
  const out = new Set<string>();
  for (const match of text.matchAll(/`([A-Z][A-Z0-9_]{2,})`/g)) out.add(match[1]);
  return [...out];
}

export function validateProviderDocs(docs: DocFile[], truth: PythonPackageTruth): string[] {
  const violations: string[] = [];
  const pkg = truth.source.package;

  const knownSymbols = new Set([
    ...truth.symbols,
    ...truth.classes,
    ...Object.keys(truth.modules).map((m) => m.split(".").pop() as string),
  ]);

  // A SCREAMING_SNAKE token is legitimate if it is an enum member, or any real
  // name in the package - module constants and class constants both get
  // documented (soccerdata's TEAMNAME_REPLACEMENTS, floodlight's ECW_ES_CUTOFFS).
  const knownTokens = new Set([
    ...Object.values(truth.enums).flat(),
    ...truth.symbols,
    ...(TOKEN_ALLOWLIST[truth.provider] ?? []),
  ]);

  for (const { file, text } of docs) {
    for (const name of extractImportedSymbols(text, pkg)) {
      if (!knownSymbols.has(name)) {
        violations.push(
          `${file}: \`from ${pkg}... import ${name}\` - no such symbol in ${pkg} ${truth.source.version}`,
        );
      }
    }

    for (const token of extractEnumTokens(text)) {
      if (!knownTokens.has(token)) {
        violations.push(
          `${file}: \`${token}\` is not a member of any ${pkg} enum - invented, renamed, or needs an allowlist entry`,
        );
      }
    }
  }

  return violations;
}
