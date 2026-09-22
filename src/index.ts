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
import { ENTITY_TYPES } from "./reep.js";
import {
  compareProviders,
  getProviderDocs,
  listProviders,
  requestUpdate,
  resolveEntity,
  resolveProviderId,
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
          "Optional provider filter. Use list_providers for indexed provider keys. Common aliases such as fbref, understat, ClubElo, football-data.co.uk, engsoccerdata, Sofascore, ESPN, FMDB, TransferRoom, Hudl Wyscout, Stats Perform, Opta F24, WhoScored, Metrica, Sportec/DFL, TRACAB, Second Spectrum, SportRadar API, Soccer Extended, TheSportsDB, and TSDB are accepted.",
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
    "resolve_provider_id",
    "Resolve a football data provider name or alias to the canonical football-docs provider key before searching. Use when users mention brands, vendors, products, or aliases such as Stats Perform, Opta F24, Hudl Wyscout, Second Spectrum, FMDB, Transfer Room, FBref, Sofascore, or TheSportsDB.",
    {
      query: z
        .string()
        .describe("Provider name, brand, product, or alias to resolve to a canonical provider key."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    async (args) => withDocsDb((db) => resolveProviderId(db, args)),
  );

  server.tool(
    "get_provider_docs",
    "Retrieve documentation for a resolved provider, optionally filtered by topic or indexed category. Use after resolve_provider_id when you know which provider to inspect and want provenance-bearing docs.",
    {
      provider: z
        .string()
        .describe("Provider key or alias. Use resolve_provider_id first when the provider name is ambiguous."),
      topic: z.string().optional().describe("Optional topic to search within this provider's docs."),
      category: z
        .string()
        .optional()
        .describe("Optional indexed category to restrict results, such as api-endpoints, qualifiers, identity-surfaces, or tracking-rendering."),
      max_results: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of provider docs to return (default 10)."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    async (args) => withDocsDb((db) => getProviderDocs(db, args)),
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
          "Providers to compare. If omitted, compares all indexed providers. Use list_providers for indexed keys; common aliases such as ClubElo, football-data.co.uk, engsoccerdata, Sofascore, ESPN, StatsBomb Open Data, Opta F24, WhoScored, SkillCorner, Metrica, Sportec/DFL, TRACAB, Second Spectrum, SportRadar API, Soccer Extended, TheSportsDB, and TSDB are accepted.",
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
    [
      "Map a football entity (player, coach, referee, team, competition, season, stage or match) to its IDs at every provider",
      "through the Reep register: Opta, Transfermarkt, Wyscout, SkillCorner, StatsBomb, FotMob, API-Football and more.",
      "Look up by provider + id (pass namespace too, e.g. transfermarkt 'spieler', opta 'person'), by reep_id, or by name.",
      "Sources, in order: a local copy of the free register (REEP_DUCKDB_PATH), then the Reep API (REEP_API_KEY; keys are",
      "issued by hand on request, never self-service). With neither set, it returns setup steps and a DuckDB query.",
      "Keeping the local file current: Reep releases weekly. Every local answer ends with the file's release stamp checked",
      "against https://data.reep.football/releases/latest.json. If it says the file is out of date, tell the user and offer",
      "to run the curl command it gives, which downloads https://reep.football/downloads/duckdb over the same path; the",
      "next call uses the new file without a restart. Before bulk matching, make sure the file is current.",
    ].join(" "),
    {
      provider: z
        .string()
        .optional()
        .describe("Provider key for an ID lookup, e.g. 'transfermarkt', 'opta', 'wyscout', 'skillcorner', 'fotmob'"),
      id: z.string().optional().describe("The provider's own ID, used with provider"),
      namespace: z
        .string()
        .optional()
        .describe(
          "The provider's namespace for that ID, e.g. 'spieler' or 'verein' for Transfermarkt, 'person' or 'team' for Opta, 'player' for Wyscout. Recommended: some providers reuse numbers across entity types.",
        ),
      reep_id: z.string().optional().describe("A Reep ID (e.g. 'rp1b829f1d3468c4') to list every provider ID for"),
      name: z
        .string()
        .optional()
        .describe("Name to search, at least 3 characters (e.g. 'Declan Rice'). A name match is a shortlist, not an answer."),
      type: z.enum(ENTITY_TYPES).optional().describe("Restrict results to one entity type"),
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
