/**
 * Ingest provider documentation into the SQLite FTS5 index.
 *
 * Reads markdown files from docs/{provider}/*.md and chunks them
 * by heading (## or ###), storing each chunk with provenance metadata.
 *
 * Each markdown file can include a YAML frontmatter block with provenance:
 *   ---
 *   source_url: https://example.com/docs
 *   source_type: readthedocs
 *   upstream_version: 1.8.8
 *   crawled_at: 2026-03-26T00:00:00Z
 *   ---
 *
 * Files without frontmatter default to source_type: "curated".
 *
 * Usage:
 *   npm run ingest                    # ingest all providers
 *   npm run ingest -- --provider opta # ingest one provider
 */

import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, "..", "docs");
const DB_DIR = resolve(__dirname, "..", "data");
const DB_PATH = resolve(DB_DIR, "docs.db");

interface Frontmatter {
  source_url: string | null;
  source_type: string; // "crawled" | "curated" | "llms_txt"
  upstream_version: string | null;
  crawled_at: string | null;
}

interface DocChunk {
  provider: string;
  category: string;
  title: string;
  content: string;
  source_url: string | null;
  source_type: string;
  upstream_version: string | null;
  crawled_at: string | null;
}

/** Parse optional YAML frontmatter from a markdown file. */
export function parseFrontmatter(text: string): { frontmatter: Frontmatter; body: string } {
  const defaults: Frontmatter = {
    source_url: null,
    source_type: "curated",
    upstream_version: null,
    crawled_at: null,
  };

  if (!text.startsWith("---")) {
    return { frontmatter: defaults, body: text };
  }

  const endIndex = text.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { frontmatter: defaults, body: text };
  }

  const yamlBlock = text.slice(4, endIndex);
  const body = text.slice(endIndex + 4).trimStart();

  // Simple YAML key: value parser (no dependency needed for flat frontmatter)
  const fm = { ...defaults };
  for (const line of yamlBlock.split("\n")) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      const cleaned = value.replace(/^["']|["']$/g, "").trim();
      if (key in fm) {
        (fm as Record<string, string | null>)[key] = cleaned || null;
      }
    }
  }

  return { frontmatter: fm, body };
}

/** Split a markdown file into chunks by ## or ### headings. */
export function chunkMarkdown(text: string, provider: string, category: string): DocChunk[] {
  const { frontmatter, body } = parseFrontmatter(text);
  const chunks: DocChunk[] = [];
  const lines = body.split("\n");

  let currentTitle = `${provider} - ${category}`;
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch && currentLines.length > 0) {
      const content = currentLines.join("\n").trim();
      if (content.length > 20) {
        chunks.push({ provider, category, title: currentTitle, content, ...frontmatter });
      }
      currentTitle = headingMatch[2].trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  const content = currentLines.join("\n").trim();
  if (content.length > 20) {
    chunks.push({ provider, category, title: currentTitle, content, ...frontmatter });
  }

  return chunks;
}

/** Ingest all docs for a provider. */
function ingestProvider(db: Database.Database, provider: string): number {
  const providerDir = resolve(DOCS_DIR, provider);
  if (!existsSync(providerDir)) {
    console.log(`  Skipping ${provider}: no docs directory`);
    return 0;
  }

  const files = readdirSync(providerDir).filter((f) => f.endsWith(".md"));
  let totalChunks = 0;

  const insert = db.prepare(
    `INSERT INTO docs (provider, category, title, content, source_url, source_type, upstream_version, crawled_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const file of files) {
    const category = basename(file, ".md");
    const text = readFileSync(resolve(providerDir, file), "utf-8");
    const chunks = chunkMarkdown(text, provider, category);

    for (const chunk of chunks) {
      insert.run(
        chunk.provider,
        chunk.category,
        chunk.title,
        chunk.content,
        chunk.source_url,
        chunk.source_type,
        chunk.upstream_version,
        chunk.crawled_at,
      );
    }

    totalChunks += chunks.length;
    const sourceTag = chunks[0]?.source_type ?? "curated";
    console.log(`  ${provider}/${file}: ${chunks.length} chunks [${sourceTag}]`);
  }

  return totalChunks;
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS docs (
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

  CREATE VIRTUAL TABLE IF NOT EXISTS docs_fts USING fts5(
    provider,
    category,
    title,
    content,
    content='docs',
    content_rowid='id',
    tokenize='porter unicode61'
  );

  CREATE TRIGGER IF NOT EXISTS docs_ai AFTER INSERT ON docs BEGIN
    INSERT INTO docs_fts(rowid, provider, category, title, content)
    VALUES (new.id, new.provider, new.category, new.title, new.content);
  END;
`;

/** Ensure tables exist without dropping existing data. */
function ensureSchema(db: Database.Database): void {
  db.exec(SCHEMA_SQL);
}

/** Drop everything and recreate from scratch. */
function rebuildSchema(db: Database.Database): void {
  db.exec(`
    DROP TABLE IF EXISTS docs_fts;
    DROP TABLE IF EXISTS docs;
  `);
  db.exec(SCHEMA_SQL);
}

function main() {
  const providerArg = process.argv.indexOf("--provider");
  const singleProvider = providerArg >= 0 ? process.argv[providerArg + 1] : undefined;

  mkdirSync(DB_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  if (singleProvider) {
    // Single-provider mode: only rebuild that provider's data
    // Ensure tables exist (in case DB is fresh)
    ensureSchema(db);

    // Atomically delete existing data and re-ingest for this provider
    const deleteAndReinsert = db.transaction(() => {
      const rows = db.prepare(
        "SELECT id, provider, category, title, content FROM docs WHERE provider = ?"
      ).all(singleProvider) as Array<{ id: number; provider: string; category: string; title: string; content: string }>;

      const ftsDelete = db.prepare(
        "INSERT INTO docs_fts(docs_fts, rowid, provider, category, title, content) VALUES('delete', ?, ?, ?, ?, ?)"
      );
      for (const row of rows) {
        ftsDelete.run(row.id, row.provider, row.category, row.title, row.content);
      }

      db.prepare("DELETE FROM docs WHERE provider = ?").run(singleProvider);
    });
    deleteAndReinsert();

    console.log(`Ingesting ${singleProvider}...\n`);
    const count = ingestProvider(db, singleProvider);
    console.log(`\nDone: ${count} chunks from ${singleProvider}`);
  } else {
    // Full rebuild: drop and recreate everything
    rebuildSchema(db);

    console.log("Ingesting provider docs...\n");
    if (!existsSync(DOCS_DIR)) {
      console.log(`No docs directory at ${DOCS_DIR}`);
      console.log("Create docs/{provider}/*.md files first.");
      db.close();
      return;
    }

    const providers = readdirSync(DOCS_DIR).filter((d) => {
      const full = resolve(DOCS_DIR, d);
      return existsSync(full) && readdirSync(full).some((f) => f.endsWith(".md"));
    });

    let total = 0;
    for (const provider of providers) {
      total += ingestProvider(db, provider);
    }

    console.log(`\nDone: ${total} chunks from ${providers.length} providers`);
  }

  db.close();
}

main();
