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

export interface OpenApiTruth {
  provider: string;
  kind: string;
  source: {
    specs: Array<{ spec: string; title: string; version: string }>;
    generated_at: string;
  };
  /** Server base paths (e.g. /soccer/trial/v4), which callable URLs include. */
  basePaths?: string[];
  /** Endpoint path -> the HTTP methods the spec defines on it. */
  paths: Record<string, string[]>;
  parameters: string[];
  schemas: string[];
  fields: string[];
  enums: Record<string, string[]>;
}

/**
 * Endpoint paths a doc set may cite without the spec defining them - other
 * vendors' endpoints named in comparison prose, and illustrative examples.
 */
const ENDPOINT_ALLOWLIST: Record<string, string[]> = {
  wyscout: [],
  skillcorner: [],
  "fmdb-pro": [],
};

/**
 * Compare endpoints on shape, not on parameter naming. Docs and specs often use
 * different placeholder names for the same path segment, and that is a style
 * difference rather than a documentation error.
 */
export function normalisePath(path: string, basePaths: string[] = []): string {
  let p = path.split("?")[0].trim();
  // Docs cite the callable URL, which carries the server base path and often a
  // response-format extension; the spec lists neither.
  for (const base of [...basePaths].sort((a, b) => b.length - a.length)) {
    if (p.startsWith(base)) {
      p = p.slice(base.length);
      break;
    }
  }
  return p
    .replace(/\.(json|xml)$/i, "")
    .replace(/\{[^}]*\}/g, "{}")
    .replace(/\/+$/, "")
    .trim();
}

/**
 * Endpoint claims in a doc set, from both notations the corpus uses: inline code
 * spans (`GET /matches/{wyId}/events`) and HTTP request lines inside fenced
 * blocks (```http ... GET /api/players HTTP/1.1).
 */
export function extractDocumentedEndpoints(text: string): Array<{ method: string; path: string }> {
  const out: Array<{ method: string; path: string }> = [];
  const seen = new Set<string>();

  const add = (method: string, rawPath: string) => {
    // `GET /metrics/game_intelligence/...` is prose shorthand for a family of
    // endpoints, not a claim that this exact path exists.
    if (rawPath.includes("...")) return;
    const key = `${method} ${rawPath}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ method, path: rawPath });
  };

  for (const match of text.matchAll(/`(GET|POST|PUT|PATCH|DELETE)\s+(\/[^`\s]*)`/g)) {
    add(match[1], match[2]);
  }

  // Request lines are anchored to the start of a line and may carry an HTTP
  // version suffix, which keeps ordinary prose from matching.
  for (const block of text.matchAll(/```[a-z]*\n([\s\S]*?)```/g)) {
    for (const line of block[1].split("\n")) {
      const m = line.match(/^\s*(GET|POST|PUT|PATCH|DELETE)\s+(\/\S*)(?:\s+HTTP\/[\d.]+)?\s*$/);
      if (m) add(m[1], m[2]);
    }
  }

  return out;
}

/**
 * How many endpoint claims a doc set actually makes.
 *
 * validateOpenApiDocs returns no violations both when every endpoint is correct
 * and when a doc set cites no endpoints at all. Those are very different states,
 * and only one of them means anything, so callers can check coverage separately.
 */
export function countDocumentedEndpoints(docs: DocFile[]): number {
  return docs.reduce((n, d) => n + extractDocumentedEndpoints(d.text).length, 0);
}

export function loadOpenApiTruth(provider: string): OpenApiTruth {
  return JSON.parse(
    readFileSync(resolve(TRUTH_DIR, `${provider}.openapi.json`), "utf-8"),
  ) as OpenApiTruth;
}

export function listOpenApiProviders(): string[] {
  return readdirSync(TRUTH_DIR)
    .filter((f) => f.endsWith(".openapi.json"))
    .map((f) => f.replace(/\.openapi\.json$/, ""))
    .sort();
}

/** Check that every endpoint a doc set cites exists in the vendor's own spec. */
export function validateOpenApiDocs(docs: DocFile[], truth: OpenApiTruth): string[] {
  const violations: string[] = [];

  const bases = truth.basePaths ?? [];

  // Spec paths as segment arrays. A placeholder segment matches any concrete
  // value, so a doc showing a worked example (/en/...) still matches a spec
  // written with a variable (/{locale}/...).
  const specPaths: Array<{ segments: string[]; methods: Set<string> }> = [];
  for (const [path, methods] of Object.entries(truth.paths)) {
    const segments = normalisePath(path, bases).split("/").filter(Boolean);
    const existing = specPaths.find(
      (s) => s.segments.length === segments.length && s.segments.every((seg, i) => seg === segments[i]),
    );
    const target = existing ?? { segments, methods: new Set<string>() };
    for (const m of methods) target.methods.add(m);
    if (!existing) specPaths.push(target);
  }

  const matchSpec = (docPath: string): Set<string> | undefined => {
    const segments = normalisePath(docPath, bases).split("/").filter(Boolean);
    const hit = specPaths.find(
      (s) =>
        s.segments.length === segments.length &&
        s.segments.every((seg, i) => seg === "{}" || seg === segments[i]),
    );
    return hit?.methods;
  };

  const allowed = new Set(
    (ENDPOINT_ALLOWLIST[truth.provider] ?? []).map((p) => normalisePath(p, bases)),
  );

  for (const { file, text } of docs) {
    for (const { method, path } of extractDocumentedEndpoints(text)) {
      const shape = normalisePath(path, bases);
      if (allowed.has(shape)) continue;

      const methods = matchSpec(path);
      if (!methods) {
        violations.push(`${file}: \`${method} ${path}\` - no such path in the ${truth.provider} spec`);
      } else if (!methods.has(method)) {
        violations.push(
          `${file}: \`${method} ${path}\` - spec defines ${[...methods].sort().join(", ")} on this path, not ${method}`,
        );
      }
    }
  }

  return violations;
}

export function loadProviderTruth(provider: string): PythonPackageTruth {
  return JSON.parse(
    readFileSync(resolve(TRUTH_DIR, `${provider}.json`), "utf-8"),
  ) as PythonPackageTruth;
}

export function listTruthProviders(): string[] {
  return readdirSync(TRUTH_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".openapi.json"))
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
