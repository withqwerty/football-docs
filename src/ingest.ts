/**
 * Ingest provider documentation into the SQLite FTS5 index.
 *
 * Reads markdown files from docs/providers/{provider}/*.md and chunks them
 * by heading (## or ###), storing each chunk with metadata.
 *
 * Usage:
 *   npm run ingest                    # ingest all providers
 *   npm run ingest -- --provider opta # ingest one provider
 *
 * Doc file naming convention:
 *   docs/providers/{provider}/{category}.md
 *
 * Example:
 *   docs/providers/opta/event-types.md
 *   docs/providers/opta/qualifiers.md
 *   docs/providers/opta/coordinate-system.md
 *   docs/providers/statsbomb/events.md
 *   docs/providers/kloppy/data-model.md
 */

import Database from "better-sqlite3";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, "..", "docs");
const DB_DIR = resolve(__dirname, "..", "data");
const DB_PATH = resolve(DB_DIR, "docs.db");

interface DocChunk {
  provider: string;
  category: string;
  title: string;
  content: string;
}

/** Split a markdown file into chunks by ## or ### headings. */
function chunkMarkdown(text: string, provider: string, category: string): DocChunk[] {
  const chunks: DocChunk[] = [];
  const lines = text.split("\n");

  let currentTitle = `${provider} - ${category}`;
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch && currentLines.length > 0) {
      const content = currentLines.join("\n").trim();
      if (content.length > 20) {
        chunks.push({ provider, category, title: currentTitle, content });
      }
      currentTitle = headingMatch[2].trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  const content = currentLines.join("\n").trim();
  if (content.length > 20) {
    chunks.push({ provider, category, title: currentTitle, content });
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
    "INSERT INTO docs (provider, category, title, content) VALUES (?, ?, ?, ?)"
  );

  for (const file of files) {
    const category = basename(file, ".md");
    const text = readFileSync(resolve(providerDir, file), "utf-8");
    const chunks = chunkMarkdown(text, provider, category);

    for (const chunk of chunks) {
      insert.run(chunk.provider, chunk.category, chunk.title, chunk.content);
    }

    totalChunks += chunks.length;
    console.log(`  ${provider}/${file}: ${chunks.length} chunks`);
  }

  return totalChunks;
}

function main() {
  const providerArg = process.argv.indexOf("--provider");
  const singleProvider = providerArg >= 0 ? process.argv[providerArg + 1] : undefined;

  mkdirSync(DB_DIR, { recursive: true });

  const db = new Database(DB_PATH);

  db.exec(`
    DROP TABLE IF EXISTS docs_fts;
    DROP TABLE IF EXISTS docs;

    CREATE TABLE docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE docs_fts USING fts5(
      provider,
      category,
      title,
      content,
      content='docs',
      content_rowid='id',
      tokenize='porter unicode61'
    );

    CREATE TRIGGER docs_ai AFTER INSERT ON docs BEGIN
      INSERT INTO docs_fts(rowid, provider, category, title, content)
      VALUES (new.id, new.provider, new.category, new.title, new.content);
    END;
  `);

  console.log("Ingesting provider docs...\n");

  if (singleProvider) {
    const count = ingestProvider(db, singleProvider);
    console.log(`\nDone: ${count} chunks from ${singleProvider}`);
  } else {
    if (!existsSync(DOCS_DIR)) {
      console.log(`No docs directory at ${DOCS_DIR}`);
      console.log("Create docs/providers/{provider}/*.md files first.");
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
