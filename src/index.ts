/**
 * Nutmeg Football Docs MCP Server
 *
 * A Context7-style searchable index of football data provider documentation.
 * Exposes tools for searching docs, listing providers, comparing providers,
 * requesting documentation updates, and resolving football entities.
 *
 * Data is stored in a SQLite FTS5 index for fast offline search. Update
 * requests are stored in a separate writable SQLite DB in a user-writable
 * location (XDG_DATA_HOME or ~/.local/share).
 */

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import Database from "better-sqlite3";
import { z } from "zod";
import {
  compareProviders,
  listProviders,
  requestUpdate,
  resolveEntity,
  searchDocs,
} from "./tools.js";

export { sanitiseFtsQuery } from "./tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "..", "data", "docs.db");
const PKG_VERSION = (
  JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf-8")) as { version: string }
).version;

const QUEUE_DB_DIR = resolve(
  process.env.XDG_DATA_HOME ?? resolve(homedir(), ".local", "share"),
  "football-docs",
);
const QUEUE_DB_PATH = resolve(QUEUE_DB_DIR, "requests.db");

export function openDb(): Database.Database {
  if (!existsSync(DB_PATH)) {
    throw new Error(
      `Docs database not found at ${DB_PATH}. Run 'npm run ingest' first to build the index.`,
    );
  }
  const db = new Database(DB_PATH, { readonly: true });

  const columns = db.pragma("table_info(docs)") as Array<{ name: string }>;
  const hasProvenance = columns.some((column) => column.name === "source_type");
  if (!hasProvenance) {
    db.close();
    throw new Error(
      "Docs database is outdated (missing provenance columns). Run 'npm run ingest' to rebuild.",
    );
  }

  return db;
}

export function openQueueDb(): Database.Database {
  mkdirSync(QUEUE_DB_DIR, { recursive: true });
  const db = new Database(QUEUE_DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      reason TEXT NOT NULL,
      suggested_urls TEXT,
      requested_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending'
    )
  `);
  return db;
}

function withDocsDb<T>(handler: (db: Database.Database) => T): T {
  const db = openDb();
  try {
    return handler(db);
  } finally {
    db.close();
  }
}

function withQueueDb<T>(handler: (db: Database.Database) => T): T {
  const db = openQueueDb();
  try {
    return handler(db);
  } finally {
    db.close();
  }
}

export function createFootballDocsServer(): McpServer {
  const server = new McpServer({
    name: "nutmeg-football-docs",
    version: PKG_VERSION,
  });

  server.tool(
    "search_docs",
    "Search football data provider documentation. Use for finding event types, qualifier IDs, API endpoints, coordinate systems, data models, and cross-provider mappings. Returns the most relevant documentation chunks.",
    {
      query: z.string().describe(
        "Search query. Examples: 'Opta goal qualifier', 'StatsBomb shot event type', 'coordinate system differences', 'xG qualifier ID', 'SportMonks fixture endpoint', 'FMDB Pro players endpoint'",
      ),
      provider: z
        .string()
        .optional()
        .describe(
          "Optional provider filter. Use list_providers for indexed provider keys. Common aliases such as fbref, understat, FMDB, TransferRoom, Hudl Wyscout, Stats Perform, Opta F24, and WhoScored are accepted.",
        ),
      max_results: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of results to return (default 10)"),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    async (args) => withDocsDb((db) => searchDocs(db, args)),
  );

  server.tool(
    "list_providers",
    "List all indexed football data providers, their document count, and coverage categories. Use to understand what documentation is available. Call this first to see what providers are indexed before searching.",
    {},
    { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    async () => withDocsDb((db) => listProviders(db)),
  );

  server.tool(
    "compare_providers",
    "Compare what two or more providers offer for a specific data type or concept. For example: 'How do Opta and StatsBomb represent shot events differently?'",
    {
      topic: z.string().describe(
        "The concept to compare across providers. Examples: 'shot events', 'coordinate systems', 'xG', 'pass types'",
      ),
      providers: z
        .array(z.string())
        .optional()
        .describe(
          "Providers to compare. If omitted, compares all indexed providers. Use list_providers for indexed keys; common aliases such as StatsBomb Open Data, Opta F24, WhoScored, and SkillCorner are accepted.",
        ),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    async (args) => withDocsDb((db) => compareProviders(db, args)),
  );

  server.tool(
    "request_update",
    "Request that a provider's documentation be added, updated, or recrawled. Use when you notice docs are outdated, a provider is missing, or you know of a better documentation source. Requests are queued for review.",
    {
      type: z.enum(["new_provider", "recrawl", "flag_outdated", "suggest_source"]).describe(
        "Type of request: new_provider (add a new tool/library), recrawl (refresh existing docs), flag_outdated (mark docs as stale), suggest_source (recommend a better doc source like llms.txt)",
      ),
      provider: z
        .string()
        .max(100)
        .describe(
          "Provider name (existing or proposed). Examples: 'statsbomb', 'mplsoccer', 'floodlight'",
        ),
      reason: z
        .string()
        .max(2000)
        .describe(
          "Why this update is needed. Be specific: version bump, missing event types, new API endpoints, etc.",
        ),
      suggested_urls: z
        .array(z.string().url().max(500))
        .max(10)
        .optional()
        .describe("URLs for documentation sources (readthedocs, GitHub, llms.txt, etc.)"),
    },
    { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
    async (args) => withQueueDb((db) => requestUpdate(db, args)),
  );

  server.tool(
    "resolve_entity",
    "Resolve a football entity (player, team, or coach) to get cross-provider IDs. Use when you need to map between Transfermarkt, FBref, Sofascore, Opta, and other provider IDs, or when you need to look up a player/team/coach by name.",
    {
      name: z
        .string()
        .optional()
        .describe("Entity name to search for (e.g. 'Cole Palmer', 'Arsenal'). Fuzzy match on name and aliases."),
      provider: z
        .string()
        .optional()
        .describe("Source provider for ID resolution (e.g. 'transfermarkt', 'fbref', 'sofascore', 'opta', 'soccerway')"),
      id: z.string().optional().describe("ID from the source provider to resolve to all other IDs"),
      qid: z.string().optional().describe("Wikidata QID for direct lookup (e.g. 'Q99760796')"),
      type: z.enum(["player", "team", "coach"]).optional().describe("Filter results by entity type"),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async (args) => resolveEntity(args),
  );

  return server;
}

export async function main() {
  const transport = new StdioServerTransport();
  await createFootballDocsServer().connect(transport);
}

const isDirectRun = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun) {
  main().catch((error) => {
    console.error("Failed to start nutmeg docs server:", error);
    process.exit(1);
  });
}
