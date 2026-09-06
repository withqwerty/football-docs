import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseFrontmatter } from "../ingest.js";
import { extractDocumentedEndpoints } from "../provider-truth.js";
import { getProviderDocs, listProviders, resolveProviderId, searchDocs } from "../tools.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
interface Observation {
  name: string;
  family: string;
  url: string;
  observed_at: string;
  http_status: number;
  top_level_fields: string[];
  fields: Record<string, string[]>;
  states?: string[];
  event_count?: number;
  event_dates?: string[];
  season_year?: number;
  pagination?: { pageIndex: number; pageSize: number; pageCount: number; count: number };
  league_refs?: string[];
}
const { observations } = JSON.parse(
  readFileSync(resolve(ROOT, "data/espn-observations.json"), "utf8"),
) as { observations: Observation[] };
const families: Record<string, string[]> = {
  "api-access.md": ["scoreboard", "summary", "teams", "standings", "leagues"],
  "scoreboard.md": ["scoreboard"],
  "match-summary.md": ["summary"],
  "teams-and-standings.md": ["teams", "standings"],
  "identity-and-coverage.md": ["leagues", "scoreboard", "summary"],
};
const docs = readdirSync(resolve(ROOT, "docs/espn"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => ({ file, text: readFileSync(resolve(ROOT, "docs/espn", file), "utf8") }));

// This checks observed paths and tabulated types, not prose semantics or an
// official contract. Limit evidence to the endpoint families each page covers.
function violations(text: string, samples: Observation[]): string[] {
  const errors: string[] = [];
  const paths = new Set(samples.map((o) => new URL(o.url).pathname.replace(/\/(eng|esp)\.1\//, "/{league}/")));
  for (const endpoint of extractDocumentedEndpoints(text)) {
    if (endpoint.method !== "GET" || !paths.has(endpoint.path)) {
      errors.push(`Unobserved endpoint: ${endpoint.method} ${endpoint.path}`);
    }
  }
  for (const row of text.matchAll(/^\| `([^`]+)` \| ([^|]+) \|/gm)) {
    const [, path, type] = row;
    if (path.startsWith("GET ")) continue;
    if (!samples.some((o) => o.fields[path]?.includes(type.trim()))) {
      errors.push(`Unobserved field/type: ${path} ${type.trim()}`);
    }
  }
  return errors;
}

describe("ESPN docs match dated public-endpoint observations", () => {
  it("has evidence for every documented endpoint and field table", () => {
    expect(docs.map((d) => d.file).sort()).toEqual(Object.keys(families).sort());
    for (const doc of docs) {
      const samples = observations.filter((o) => families[doc.file].includes(o.family));
      expect(violations(doc.text, samples), doc.file).toEqual([]);
    }
    expect(docs.flatMap((d) => extractDocumentedEndpoints(d.text)).length).toBeGreaterThanOrEqual(10);
    expect(docs.reduce((n, d) => n + [...d.text.matchAll(/^\| `[^`]+` \| (?:string|number|array|boolean) \|/gm)].length, 0))
      .toBeGreaterThan(60);
  });

  it("rejects invented endpoints, fields, and incorrect observed types", () => {
    expect(violations("`GET /apis/site/v2/sports/soccer/{league}/invented`", observations)).toHaveLength(1);
    expect(violations("| `events[].invented` | string | Bad field |", observations)).toHaveLength(1);
    expect(violations("| `events[].id` | number | Wrong type |", observations)).toHaveLength(1);
    expect(violations("| `header.id` | string | Wrong endpoint family |", observations.filter((o) => o.family === "scoreboard")))
      .toHaveLength(1);
  });

  it("keeps ESPN source URLs and provenance tied to recorded requests", () => {
    const urls = new Set(observations.map((o) => o.url));
    for (const doc of docs) {
      const { frontmatter } = parseFrontmatter(doc.text);
      expect(frontmatter.source_type).toBe("curated");
      expect(frontmatter.upstream_version).toBeNull();
      expect(urls.has(frontmatter.source_url!), doc.file).toBe(true);
      const source = observations.find((o) => o.url === frontmatter.source_url)!;
      expect(source.observed_at.startsWith(frontmatter.crawled_at!), doc.file).toBe(true);
      for (const link of doc.text.matchAll(/https:\/\/[^\s)]+\.espn\.com\/[^\s)]+/g)) {
        expect(urls.has(link[0]), link[0]).toBe(true);
      }
    }
    for (const sample of observations) {
      expect(sample.http_status).toBe(200);
      expect(Number.isNaN(Date.parse(sample.observed_at))).toBe(false);
      expect(Object.keys(sample.fields).length).toBeGreaterThan(0);
    }
  });

  it("supports the documented scheduled, completed, and empty cases", () => {
    for (const league of ["eng.1", "esp.1"]) {
      const complete = observations.find((o) => o.name === `${league}-summary-completed`)!;
      const scheduled = observations.find((o) => o.name === `${league}-summary-scheduled`)!;
      expect(complete.states).toEqual(["post"]);
      expect(scheduled.states).toEqual(["pre"]);
      expect(complete.fields["rosters[].roster[].athlete.id"]).toEqual(["string"]);
      expect(scheduled.fields["rosters[].roster[].athlete.id"]).toBeUndefined();
      expect(scheduled.fields["boxscore.teams[].statistics[].name"]).toEqual(["string"]);
      for (const section of ["keyEvents", "commentary"]) {
        expect(complete.top_level_fields).toContain(section);
        expect(scheduled.top_level_fields).not.toContain(section);
      }
      expect(complete.top_level_fields).not.toContain("plays");
      expect(scheduled.top_level_fields).not.toContain("plays");
    }
    const empty = observations.find((o) => o.name === "eng.1-empty-date")!;
    expect(empty.event_count).toBe(0);
    expect(empty.fields.events).toEqual(["array"]);
    const range = observations.find((o) => o.name === "eng.1-date-range")!;
    expect(new Set(range.event_dates!.map((date) => date.slice(0, 10))))
      .toEqual(new Set(["2025-08-16", "2025-08-17"]));
  });

  it("verifies season selection and distinct discovery pages", () => {
    for (const sample of observations.filter((o) => o.family === "standings")) {
      expect(sample.season_year).toBe(Number(new URL(sample.url).searchParams.get("season")));
    }
    const pages = observations.filter((o) => o.family === "leagues");
    expect(pages).toHaveLength(2);
    for (const page of pages) {
      expect(page.pagination?.pageIndex).toBe(Number(new URL(page.url).searchParams.get("page")));
      expect(page.pagination?.pageSize).toBe(5);
      expect(page.league_refs).toHaveLength(5);
    }
    expect(new Set(pages.flatMap((p) => p.league_refs!)).size).toBe(10);
  });
});

describe("ESPN retrieval", () => {
  let db: Database.Database;
  beforeAll(() => { db = new Database(resolve(ROOT, "data/docs.db"), { readonly: true }); });
  afterAll(() => { db.close(); });

  it.each(["ESPN", "espn-soccer", "ESPN FC"])("resolves %s to the indexed provider", (query) => {
    const result = resolveProviderId(db, { query });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("provider ID: **espn**");
    expect(result.content[0].text).toContain("**Indexed:** yes");
    expect(result.content[0].text).toContain("**Access level:** public-web");
  });

  it.each([
    { query: "ESPN fixtures by date historical results", expected: ["dates=20250817", "dates=20250816-20250817"] },
    { query: "ESPN soccer lineups formations player IDs", expected: ["rosters[].roster[].athlete.id", "not a confirmed lineup"] },
    { query: "ESPN league standings season selection", expected: ["/apis/v2/sports/soccer/{league}/standings", "season=2024"] },
    { query: "ESPN league discovery pagination", expected: ["items[].$ref", "limit=5&page=2"] },
    { query: "ESPN key events commentary availability", expected: ["keyEvents[].type.id", "No top-level plays"] },
    { query: "ESPN authentication access status", expected: ["without an API key", "not a guarantee", "terms of use"] },
  ])("retrieves $query", ({ query, expected }) => {
    // Unfiltered searches exercise discovery alongside the existing corpus.
    const result = searchDocs(db, { query, max_results: 5 });
    const text = result.content.map((c) => c.text).join("\n");
    expect(result.isError).toBeUndefined();
    expect(text).toContain("espn");
    for (const term of expected) expect(text).toContain(term);
    expect(text).toContain("curated");
    expect(text).toContain("2026-09-06");
  });

  it("lists ESPN and retrieves a category through an alias", () => {
    expect(listProviders(db).content[0].text).toContain("**espn**");
    const result = getProviderDocs(db, { provider: "espn-soccer", category: "match-summary", max_results: 10 });
    expect(result.isError).toBeUndefined();
    expect(result.content[0].text).toContain("Lineups, formations, and player IDs");
  });
});
