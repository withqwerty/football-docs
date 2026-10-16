import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseFrontmatter } from "../ingest.js";
import { extractDocumentedEndpoints } from "../provider-truth.js";
import { type Database, openDatabase } from "../sqlite.js";
import { getProviderDocs, resolveProviderId, searchDocs } from "../tools.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
interface Observation {
  case?: string;
  endpoint: string;
  http_status: number;
  results: number;
  fields: Record<string, string[]>;
  expected_empty?: boolean;
  expected_error?: boolean;
}
const evidence = JSON.parse(
  readFileSync(resolve(ROOT, "data/api-football-observations.json"), "utf8"),
) as {
  observed_at: string;
  observations: Observation[];
  checks: { pagination: { pages_checked: number; results_per_page: number[]; unique_players: number; overlap: boolean } };
};
const model = readFileSync(resolve(ROOT, "docs/api-football/data-model.md"), "utf8");
const sectionEndpoints: Record<string, string | null> = {
  "API-Football response envelope": null,
  "API-Football leagues and season coverage": "/leagues",
  "API-Football teams and venues": "/teams",
  "API-Football fixtures and scores": "/fixtures",
  "API-Football fixture events": "/fixtures/events",
  "API-Football fixture lineups": "/fixtures/lineups",
  "API-Football fixture team statistics": "/fixtures/statistics",
  "API-Football fixture player statistics": "/fixtures/players",
  "API-Football standings": "/standings",
  "API-Football player profiles and season statistics": "/players",
  "API-Football current squads": "/players/squads",
  "API-Football injuries and fixture absences": "/injuries",
  "API-Football transfers": "/transfers",
};

// Field paths and observed type unions only: this does not validate prose or
// infer unobserved types from a sample that contains only null.
function violations(text: string, samples: Observation[]): string[] {
  const errors: string[] = [];
  for (const [, path, types] of text.matchAll(/^\| `([^`]+)` \| ([^|]+) \|/gm)) {
    const observed = [...new Set(samples.flatMap((sample) => sample.fields[path] ?? []))].sort();
    const documented = types.trim().split(" / ").sort();
    if (JSON.stringify(observed) !== JSON.stringify(documented)) {
      errors.push(`Unobserved field/type union: ${path} ${types.trim()}`);
    }
  }
  return errors;
}

describe("API-Football dated structural evidence", () => {
  it("checks every field table against the matching endpoint sample", () => {
    const sections = model.split(/^## /m).slice(1).filter((section) => section.includes("| Field path |"));
    expect(sections).toHaveLength(Object.keys(sectionEndpoints).length);
    for (const section of sections) {
      const title = section.split("\n")[0];
      expect(sectionEndpoints, title).toHaveProperty(title);
      const endpoint = sectionEndpoints[title];
      const samples = evidence.observations.filter((sample) => endpoint === null || sample.endpoint === endpoint);
      expect(samples.length, title).toBeGreaterThan(0);
      expect(violations(section, samples), title).toEqual([]);
    }
  });

  it("rejects invented paths, wrong types and cross-endpoint field borrowing", () => {
    const fixtures = evidence.observations.filter((sample) => sample.endpoint === "/fixtures");
    expect(violations("| `response[].fixture.id` | string | Wrong type |", fixtures)).toHaveLength(1);
    expect(violations("| `response[].invented` | integer | Invented |", fixtures)).toHaveLength(1);
    expect(violations("| `response[].player.id` | integer | Wrong endpoint |", fixtures)).toHaveLength(1);
  });

  it("ties sampled GET paths and provenance to successful dated observations", () => {
    expect(evidence.observations).toHaveLength(32);
    expect(evidence.observed_at.startsWith("2026-10-15")).toBe(true);
    const endpoints = new Set(evidence.observations.map((sample) => sample.endpoint));
    const access = readFileSync(resolve(ROOT, "docs/api-football/api-access.md"), "utf8");
    for (const endpoint of extractDocumentedEndpoints(access)) {
      expect(endpoint.method).toBe("GET");
      expect(endpoints.has(endpoint.path), endpoint.path).toBe(true);
    }
    for (const sample of evidence.observations) {
      expect(sample.http_status).toBe(200);
      if (sample.endpoint !== "/status" && !sample.expected_empty && !sample.expected_error) {
        expect(sample.results).toBeGreaterThan(0);
      }
      expect(Object.keys(sample.fields).some((path) => /account|odds|predictions/.test(path))).toBe(false);
    }
    for (const name of ["api-access", "data-model", "identity-surfaces"]) {
      const { frontmatter } = parseFrontmatter(readFileSync(resolve(ROOT, `docs/api-football/${name}.md`), "utf8"));
      expect(frontmatter.source_type).toBe("curated");
      expect(frontmatter.source_url).toBe("https://www.api-football.com/documentation-v3");
      expect(frontmatter.upstream_version).toBe("3.9.3");
      expect(frontmatter.crawled_at).toBe(name === "api-access" ? "2026-10-16" : "2026-10-15");
    }
  });

  it("distinguishes Free coverage from an HTTP-200 season restriction", () => {
    const free = JSON.parse(readFileSync(resolve(ROOT, "data/api-football-free-observations.json"), "utf8")) as {
      observed_at: string;
      observations: (Observation & { errors_present: boolean; quota_headers_present: string[]; quota_limits?: { daily: number; per_minute: number }; error_fields?: string[] })[];
      checks: { plan: string; active: boolean; completed: boolean; historical_season_accepted: number; season_2026_rejected: boolean };
    };
    expect(free.observed_at.startsWith("2026-10-16")).toBe(true);
    expect(free.checks).toMatchObject({ plan: "Free", active: true, completed: true, historical_season_accepted: 2024, season_2026_rejected: true });
    const denied = free.observations.find((sample) => sample.case === "free-current-season-fixtures");
    expect(denied).toMatchObject({ http_status: 200, results: 0, errors_present: true, error_fields: ["plan"], quota_headers_present: [] });
    expect(denied?.fields.errors).toEqual(["object"]);
    expect(denied?.quota_limits).toBeUndefined();
    const successful = free.observations.filter((sample) => !sample.errors_present);
    for (const endpoint of new Set(Object.values(sectionEndpoints).filter((path) => path !== null))) {
      expect(successful.some((sample) => sample.endpoint === endpoint && sample.results > 0), endpoint).toBe(true);
    }
    for (const sample of successful) {
      expect(sample.http_status).toBe(200);
      expect(sample.quota_limits).toEqual({ daily: 100, per_minute: 10 });
    }
    for (const sample of free.observations) {
      expect(Object.keys(sample.fields).some((path) => /account|odds|predictions/.test(path))).toBe(false);
    }
  });

  it("keeps pending, empty, parameter-error and full-pagination evidence distinct", () => {
    const cases = new Map(evidence.observations.filter((sample) => sample.case).map((sample) => [sample.case, sample]));
    expect(cases.get("scheduled-fixtures")?.fields["response[].goals.home"]).toEqual(["null"]);
    for (const name of ["scheduled-events-empty", "scheduled-lineups-empty"]) {
      expect(cases.get(name)?.expected_empty).toBe(true);
      expect(cases.get(name)?.results).toBe(0);
      expect(cases.get(name)?.fields.errors).toEqual(["array"]);
    }
    const invalid = cases.get("missing-required-season");
    expect(invalid?.expected_error).toBe(true);
    expect(invalid?.http_status).toBe(200);
    expect(invalid?.fields.errors).toEqual(["object"]);
    const pagination = evidence.checks.pagination;
    expect(pagination.pages_checked).toBe(4);
    expect(pagination.results_per_page).toEqual([20, 20, 20, 2]);
    expect(pagination.unique_players).toBe(pagination.results_per_page.reduce((total, count) => total + count, 0));
    expect(pagination.overlap).toBe(false);
  });
});

describe("API-Football retrieval", () => {
  let db: Database;
  beforeAll(() => { db = openDatabase(resolve(ROOT, "data/docs.db"), { readonly: true }); });
  afterAll(() => { db.close(); });

  it.each(["API-Football", "api_football", "APIFootball", "api-sports-football", "API-Football (RapidAPI)"])(
    "resolves %s to the indexed provider",
    (query) => {
      const text = resolveProviderId(db, { query }).content[0].text;
      expect(text).toContain("provider ID: **api-football**");
      expect(text).toContain("**Indexed:** yes");
    },
  );

  it.each([
    { query: "API-Football direct RapidAPI authentication headers", expected: ["x-apisports-key", "X-RapidAPI-Host", "Historical note only", "not setup instructions", "current availability not verified"] },
    { query: "API-Football Free plans season restriction rate limits", expected: ["2026-10-16", "season=2024", "season=2026", "errors.plan", "missing quota headers"] },
    { query: "API-Football players pagination current squads", expected: ["20 results", "paging.total=4", "not a season-filtered"] },
    { query: "API-Football passes accuracy representation", expected: ["percentage string", "does not prove", "unsupported interpretation"] },
    { query: "API-Football fixture status codes", expected: ["`FT`, `AET`, `PEN`", "`SUSP`, `INT`", "retain NS"] },
    { query: "API-Football injuries fixture absences", expected: ["response[].player.reason", "Questionable", "suspensions"] },
    { query: "API-Football data sources verification limits", expected: ["not publicly documented", "partners", "not guaranteed"] },
  ])("retrieves $query with provider provenance", ({ query, expected }) => {
    const result = searchDocs(db, { query, provider: "api-football", max_results: 5 });
    const text = result.content[0].text.replace(/\s+/g, " ");
    expect(result.isError).toBeUndefined();
    expect(text).toContain("**Provider:** api-football");
    expect(text).toContain("https://www.api-football.com/documentation-v3");
    for (const term of expected) expect(text).toContain(term);
  });

  it("returns only API-Football model docs for an alias", () => {
    const result = getProviderDocs(db, { provider: "api_football", category: "data-model", topic: "standings" });
    const text = result.content[0].text;
    expect(result.isError).toBeUndefined();
    expect(text).toContain("API-Football standings");
    expect(text).toContain("response[].league.standings[][]");
    expect(text).not.toContain("**Provider:** sportmonks");
  });
});
