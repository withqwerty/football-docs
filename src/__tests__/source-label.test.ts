import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DATA_SCHEMA_VERSION, readArchivedUrls, writeMeta } from "../data-format.js";
import { archivedUrlMap, parseFrontmatter, SCHEMA_SQL } from "../ingest.js";
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
      db.prepare("INSERT INTO docs (provider, category, title, content, source_url, crawled_at) VALUES (?, ?, ?, ?, ?, ?)").run(
        "reep",
        "overview",
        "Reep overview",
        "Reep maps provider IDs onto one Reep ID.",
        LIVE,
        "2026-11-24",
      );
      writeMeta(db, {
        dataStamp: "2026-11-25T00:00:00Z",
        commit: null,
        providersJson: readFileSync(new URL("../../providers.json", import.meta.url), "utf8"),
        archivedUrlsJson: JSON.stringify({ "reep/overview": ARCHIVED }),
      });
    });
    afterAll(() => db.close());

    it("shows the permalink in search_docs and get_provider_docs", () => {
      expect(searchDocs(db, { query: "Reep provider IDs" }).content[0].text).toContain(`archived ${ARCHIVED}`);
      expect(getProviderDocs(db, { provider: "reep" }).content[0].text).toContain(`archived ${ARCHIVED}`);
    });
  });

  describe("an index without a permalink map", () => {
    let db: Database;
    beforeAll(() => {
      db = openDatabase(":memory:");
      db.exec(SCHEMA_SQL);
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
      expect(readArchivedUrls(db).size).toBe(0);
      const text = searchDocs(db, { query: "Reep provider IDs" }).content[0].text;
      expect(text).toContain(`curated by football-docs contributors from ${LIVE}`);
      expect(text).not.toContain("archived");
    });
  });

  it("keys each permalink by the doc, so two docs can share a source page", () => {
    const dir = mkdtempSync(join(tmpdir(), "archived-"));
    mkdirSync(join(dir, "reep"));
    const doc = (archived: string) => `---\nsource_url: ${LIVE}\narchived_url: ${archived}\n---\n\n# T\n`;
    writeFileSync(join(dir, "reep", "a.md"), doc(ARCHIVED));
    writeFileSync(join(dir, "reep", "b.md"), doc(`${ARCHIVED}x`));
    writeFileSync(join(dir, "reep", "c.md"), "# No frontmatter\n");
    expect(archivedUrlMap(dir)).toEqual({ "reep/a": ARCHIVED, "reep/b": `${ARCHIVED}x` });
  });
});

describe("the index schema", () => {
  // Servers compare the schema exactly and reject any other. Servers up to
  // 0.17.9 rejected an index with an extra archived_url column, so data
  // publishing stopped. A change here needs a DATA_SCHEMA_VERSION bump and a
  // server release, or a meta key instead (as archived_urls is).
  it("is the one schema version 1 servers accept", () => {
    expect(DATA_SCHEMA_VERSION).toBe(1);
    expect(createHash("sha256").update(SCHEMA_SQL).digest("hex")).toBe("3b8a572c76f9a58fdbdbdc6d46bc53348c66025da307dee939181d644a92ed1b");
  });
});
