import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parseFrontmatter, SCHEMA_SQL } from "../ingest.js";
import { type Database, openDatabase } from "../sqlite.js";
import { getProviderDocs, searchDocs, sourceLabel } from "../tools.js";

const LIVE = "https://reep.football/coverage";
const ARCHIVED = "https://web.archive.org/web/20261124120000/https://reep.football/coverage";

describe("sourceLabel", () => {
  it("names the source page and its permalink on curated docs", () => {
    expect(
      sourceLabel({
        source_type: "curated",
        source_url: LIVE,
        archived_url: ARCHIVED,
        upstream_version: null,
        crawled_at: "2026-11-24",
      }),
    ).toBe(`**Source:** curated by football-docs contributors from ${LIVE}, archived ${ARCHIVED} | checked 2026-11-24`);
  });

  it("names the source page on curated docs without a permalink", () => {
    expect(
      sourceLabel({ source_type: "curated", source_url: LIVE, archived_url: null, upstream_version: null, crawled_at: null }),
    ).toBe(`**Source:** curated by football-docs contributors from ${LIVE}`);
  });

  it("keeps the plain curated label when no source is recorded", () => {
    expect(
      sourceLabel({ source_type: "curated", source_url: null, archived_url: null, upstream_version: null, crawled_at: null }),
    ).toBe("**Source:** curated by football-docs contributors");
  });

  it("adds the permalink to crawled docs", () => {
    expect(
      sourceLabel({
        source_type: "crawled",
        source_url: LIVE,
        archived_url: ARCHIVED,
        upstream_version: "0.4.0",
        crawled_at: "2026-11-24",
      }),
    ).toBe(`**Source:** crawled (${LIVE}, archived ${ARCHIVED}) | v0.4.0 | crawled 2026-11-24`);
  });
});

describe("archived_url in the index", () => {
  it("reads archived_url from frontmatter", () => {
    const { frontmatter } = parseFrontmatter(`---\nsource_url: ${LIVE}\narchived_url: ${ARCHIVED}\n---\n\n# Title\n`);
    expect(frontmatter.archived_url).toBe(ARCHIVED);
  });

  describe("current layout", () => {
    let db: Database;
    beforeAll(() => {
      db = openDatabase(":memory:");
      db.exec(SCHEMA_SQL);
      db.prepare(
        "INSERT INTO docs (provider, category, title, content, source_url, archived_url, crawled_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      ).run("reep", "overview", "Reep overview", "Reep maps provider IDs onto one Reep ID.", LIVE, ARCHIVED, "2026-11-24");
    });
    afterAll(() => db.close());

    it("shows the permalink in search_docs and get_provider_docs", () => {
      expect(searchDocs(db, { query: "Reep provider IDs" }).content[0].text).toContain(`archived ${ARCHIVED}`);
      expect(getProviderDocs(db, { provider: "reep" }).content[0].text).toContain(`archived ${ARCHIVED}`);
    });
  });

  describe("an index built before archived_url existed", () => {
    let db: Database;
    beforeAll(() => {
      db = openDatabase(":memory:");
      db.exec(SCHEMA_SQL.replace("    archived_url TEXT,\n", ""));
      db.prepare("INSERT INTO docs (provider, category, title, content, source_url) VALUES (?, ?, ?, ?, ?)").run(
        "reep",
        "overview",
        "Reep overview",
        "Reep maps provider IDs onto one Reep ID.",
        LIVE,
      );
    });
    afterAll(() => db.close());

    it("still answers, without a permalink", () => {
      const columns = db.prepare("PRAGMA table_info(docs)").all() as Array<{ name: string }>;
      expect(columns.map((c) => c.name)).not.toContain("archived_url");
      const text = searchDocs(db, { query: "Reep provider IDs" }).content[0].text;
      expect(text).toContain(`curated by football-docs contributors from ${LIVE}`);
      expect(text).not.toContain("archived");
    });
  });
});
