import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { rmSync, existsSync } from "node:fs";
import { chunkMarkdown } from "../ingest.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DB_PATH = resolve(__dirname, "..", "..", "data", "test.db");

describe("ingest → search integration", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(TEST_DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      DROP TABLE IF EXISTS docs_fts;
      DROP TABLE IF EXISTS docs;

      CREATE TABLE docs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        source_url TEXT,
        source_type TEXT NOT NULL DEFAULT 'curated',
        upstream_version TEXT,
        crawled_at TEXT
      );

      CREATE VIRTUAL TABLE docs_fts USING fts5(
        provider, category, title, content,
        content='docs', content_rowid='id',
        tokenize='porter unicode61'
      );

      CREATE TRIGGER docs_ai AFTER INSERT ON docs BEGIN
        INSERT INTO docs_fts(rowid, provider, category, title, content)
        VALUES (new.id, new.provider, new.category, new.title, new.content);
      END;
    `);
  });

  afterAll(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
    for (const ext of ["-wal", "-shm"]) {
      const f = TEST_DB_PATH + ext;
      if (existsSync(f)) rmSync(f);
    }
  });

  it("chunks with frontmatter are searchable with correct provenance", () => {
    const markdown = `---
source_url: https://example.com/docs
source_type: crawled
upstream_version: 2.0.0
crawled_at: 2026-03-27T00:00:00Z
---

## Pass Event

StatsBomb represents passes as type 30. The pass object contains
start and end locations, recipients, and pass outcomes.

## Shot Event

StatsBomb represents shots as type 16. Includes xG, body part,
technique, and freeze frame data.`;

    const chunks = chunkMarkdown(markdown, "statsbomb", "events");
    expect(chunks.length).toBe(2);

    const insert = db.prepare(
      `INSERT INTO docs (provider, category, title, content, source_url, source_type, upstream_version, crawled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (const chunk of chunks) {
      insert.run(
        chunk.provider, chunk.category, chunk.title, chunk.content,
        chunk.source_url, chunk.source_type, chunk.upstream_version, chunk.crawled_at
      );
    }

    const rows = db.prepare(`
      SELECT d.provider, d.title, d.source_type, d.source_url, d.upstream_version
      FROM docs_fts
      JOIN docs d ON d.id = docs_fts.rowid
      WHERE docs_fts MATCH 'pass'
      ORDER BY rank
    `).all() as Array<{
      provider: string;
      title: string;
      source_type: string;
      source_url: string;
      upstream_version: string;
    }>;

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].provider).toBe("statsbomb");
    expect(rows[0].source_type).toBe("crawled");
    expect(rows[0].source_url).toBe("https://example.com/docs");
    expect(rows[0].upstream_version).toBe("2.0.0");
  });

  it("curated chunks (no frontmatter) get source_type curated", () => {
    const markdown = `## Coordinate System

Opta uses a 100x100 coordinate system with origin at bottom-left.
The x-axis runs left to right, y-axis bottom to top.`;

    const chunks = chunkMarkdown(markdown, "opta", "coordinates");
    expect(chunks.length).toBe(1);
    expect(chunks[0].source_type).toBe("curated");
    expect(chunks[0].source_url).toBeNull();

    const insert = db.prepare(
      `INSERT INTO docs (provider, category, title, content, source_url, source_type, upstream_version, crawled_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    insert.run(
      chunks[0].provider, chunks[0].category, chunks[0].title, chunks[0].content,
      chunks[0].source_url, chunks[0].source_type, chunks[0].upstream_version, chunks[0].crawled_at
    );

    const row = db.prepare(
      `SELECT d.source_type FROM docs_fts JOIN docs d ON d.id = docs_fts.rowid WHERE docs_fts MATCH 'coordinate' LIMIT 1`
    ).get() as { source_type: string };

    expect(row.source_type).toBe("curated");
  });

  it("schema check detects missing source_type column", () => {
    const oldDb = new Database(":memory:");
    oldDb.exec(`
      CREATE TABLE docs (
        id INTEGER PRIMARY KEY,
        provider TEXT, category TEXT, title TEXT, content TEXT
      );
    `);

    const columns = oldDb.pragma("table_info(docs)") as Array<{ name: string }>;
    const hasProvenance = columns.some((c) => c.name === "source_type");
    expect(hasProvenance).toBe(false);
    oldDb.close();
  });
});
