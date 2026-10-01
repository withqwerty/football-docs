/**
 * Nutmeg Football Docs MCP Server
 *
 * A Context7-style searchable index of football data provider documentation.
 * Exposes tools for searching docs, listing providers, comparing providers,
 * requesting documentation updates, and resolving football entities, plus
 * paper and web-source lookups that call public services at run time.
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
import { z } from "zod";
import { hardenConnection } from "./data-format.js";
import { cleanDataDir, dataModeFor, defaultDataDir, IndexChooser } from "./data-source.js";
import { checkForUpdate } from "./data-update.js";
import {
  addLocalPaper,
  forgetPaper,
  getPaper,
  getWebSource,
  matchQuote,
  purgeCache,
  readPaper,
  SEARCH_SOURCES,
  searchPapers,
} from "./papers/tools.js";
import { ENTITY_TYPES } from "./reep.js";
import { type Database, openDatabase } from "./sqlite.js";
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
const PACKAGE_ROOT = resolve(__dirname, "..");
const BUNDLED_DB_PATH = resolve(PACKAGE_ROOT, "data", "docs.db");
const PKG_VERSION = (
  JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf-8")) as { version: string }
).version;

const QUEUE_DB_DIR = resolve(
  process.env.XDG_DATA_HOME ?? resolve(homedir(), ".local", "share"),
  "football-docs",
);
const QUEUE_DB_PATH = resolve(QUEUE_DB_DIR, "requests.db");

const DATA_DIR = defaultDataDir();
const DATA_MODE = dataModeFor(process.env, PACKAGE_ROOT);

function logToStderr(message: string): void {
  // stdout is the MCP channel; anything else written there corrupts it.
  process.stderr.write(`${message}\n`);
}

const chooser = new IndexChooser({
  bundledPath: BUNDLED_DB_PATH,
  dataDir: DATA_DIR,
  serverVersion: PKG_VERSION,
  mode: DATA_MODE,
  pinnedPath: process.env.FOOTBALL_DOCS_DB_PATH?.trim() || undefined,
  log: logToStderr,
});

function currentSelection() {
  return chooser.current();
}

export function openDb(): Database {
  const path = currentSelection().path;
  if (!existsSync(path)) {
    throw new Error(
      `Docs database not found at ${path}. Run 'npm run ingest' first to build the index.`,
    );
  }
  const db = openDatabase(path, { readonly: true });
  hardenConnection(db);

  const columns = db.prepare("PRAGMA table_info(docs)").all() as Array<{ name: string }>;
  const hasProvenance = columns.some((column) => column.name === "source_type");
  if (!hasProvenance) {
    db.close();
    throw new Error(
      "Docs database is outdated (missing provenance columns). Run 'npm run ingest' to rebuild.",
    );
  }

  return db;
}

export function openQueueDb(): Database {
  mkdirSync(QUEUE_DB_DIR, { recursive: true });
  const db = openDatabase(QUEUE_DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
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

function withDocsDb<T>(handler: (db: Database) => T): T {
  const db = openDb();
  try {
    return handler(db);
  } finally {
    db.close();
  }
}

function withQueueDb<T>(handler: (db: Database) => T): T {
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
    "Search football data provider documentation. Use for finding event types, qualifier IDs, API endpoints, coordinate systems, data models, and cross-provider mappings. Returns the most relevant documentation chunks. Results that do not contain every query term are marked \"partial\", and the reply names any query term that no indexed doc mentions: if the question is about that term, it is not indexed. It also says when the query names a provider that is not indexed, and why.",
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
    async () => withDocsDb((db) => listProviders(db, { source: currentSelection().source })),
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

  server.tool(
    "search_papers",
    [
      "Search scholarly papers on football analytics and sport science: OpenAlex (title, abstract and full text),",
      "arXiv (title, abstract, authors) and SportRxiv (title, abstract, keywords). Use it to find the paper behind a",
      "method (xG, VAEP, EPV, pitch control) or the works that cite an idea. Use words and \"quoted phrases\";",
      "OpenAlex matches full text, so a hit may cite the idea rather than introduce it. Many methods first appeared",
      "in blog posts or conference papers without a DOI (xT, for example): search the web for those and read them",
      "with get_web_source. The reply names the services asked. FOOTBALL_DOCS_PAPERS=off turns paper lookups off.",
    ].join(" "),
    {
      query: z
        .string()
        .describe('Words and "quoted phrases", optionally with AND / OR / NOT. Examples: \'"expected threat" soccer\', \'"pitch control" Spearman\', \'VAEP action values\''),
      sources: z
        .array(z.enum(SEARCH_SOURCES))
        .optional()
        .describe(
          "Sources to ask. Default: openalex, arxiv and sportrxiv (searched in a local copy of its feed). Add zotero to search the user's own Zotero library (Zotero on this computer, else the Zotero web API with ZOTERO_API_KEY).",
        ),
      max_results: z.number().optional().default(10).describe("Results per source, 1 to 25 (default 10)."),
      year_from: z.number().int().optional().describe("Only papers published in or after this year."),
      year_to: z.number().int().optional().describe("Only papers published in or before this year."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async (args) => searchPapers(args),
  );

  server.tool(
    "get_paper",
    [
      "Look up one paper by DOI, arXiv ID, OpenAlex ID, zotero: ID or local: ID: title, authors, date, venue, all IDs, licence, open copies",
      "with their licences, abstract and a citation line. arXiv IDs come from arXiv with the paper's licence; DOIs",
      "from OpenAlex, then SportRxiv or Crossref. Use it to check that a reference exists and says what is claimed.",
    ].join(" "),
    {
      id: z
        .string()
        .describe("A DOI (10.1145/3292500.3330758 or https://doi.org/...), an arXiv ID or URL (1802.07127, arxiv.org/abs/1802.07127), or an OpenAlex ID (W4288278931)."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async (args) => getPaper(args),
  );

  server.tool(
    "get_web_source",
    [
      "Read a public web page (blog post, newsletter, club or vendor article) as text, with its author, date,",
      "licence and Wayback Machine snapshots. Use it for methods first published on the web, such as Karun Singh's",
      "xT post, after finding the page with a web search. A page with no date gets the date of its earliest snapshot",
      "as an upper bound. Reads HTML and PDF. Long pages come back by section. The tool stops at bot checks and refuses",
      "local addresses.",
    ].join(" "),
    {
      url: z.string().describe("The page's http(s) URL."),
      section: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("For a long page, the section number from the outline of an earlier call."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async (args) => getWebSource(args),
  );

  const paperId = z
    .string()
    .describe("A DOI, arXiv ID, OpenAlex ID, zotero:KEY from search_papers, or local:… from add_local_paper.");

  server.tool(
    "read_paper",
    [
      "Read a paper's text. Finds an open copy (arXiv, open repositories, open-access publishers, SportRxiv) and returns",
      "it in full, by section, with its licence. For a paper the user supplied (add_local_paper or zotero:), returns",
      "only the outline and passages of at most 200 characters (FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS). The text is kept in",
      "the user's library, so a second call sends no request. It never logs in anywhere and stops at bot checks; when",
      "no open copy can be read it says so and suggests add_local_paper.",
    ].join(" "),
    {
      id: paperId,
      section: z.number().int().min(0).optional().describe("Section number from the outline of an earlier call (open copies only)."),
      query: z.string().optional().describe("Words to find: returns passages that hold all of them, with their section and page."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async (args) => readPaper(args),
  );

  server.tool(
    "match_quote",
    [
      "Check that a quote appears in its source: a paper (any ID read_paper takes) or a web page URL. Reports exact,",
      "normalised (same words; case, spacing, quote marks, ligatures or hyphens differ), close (with a similarity",
      "score: quote the source's own words instead) or none, with the section, page and a W3C TextQuoteSelector. Use it",
      "before citing a definition or a claim.",
    ].join(" "),
    {
      source: z.string().describe("A paper ID or an http(s) URL."),
      quote: z.string().min(10).describe("The quote to check, at least 10 characters."),
    },
    { readOnlyHint: true, destructiveHint: false, openWorldHint: true },
    async (args) => matchQuote(args),
  );

  server.tool(
    "add_local_paper",
    [
      "Add a PDF the user has (for example a paper from their library's subscription) to their football-docs library.",
      "Only PDF files are read; the text stays on this computer and is never sent anywhere. Returns a local: ID for",
      "read_paper and match_quote, which give only the outline and short passages of such papers.",
    ].join(" "),
    {
      path: z.string().describe("The full path to the PDF, for example /Users/me/Downloads/paper.pdf or ~/Downloads/paper.pdf."),
      id: z.string().optional().describe("The paper's DOI or arXiv ID, to fill in its title and authors. Found in the PDF when omitted."),
    },
    { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    async (args) => addLocalPaper(args),
  );

  server.tool(
    "forget_paper",
    "Remove one paper's text from the user's football-docs library. The user's own file and Zotero are not touched.",
    { id: paperId },
    { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    async (args) => forgetPaper(args),
  );

  server.tool(
    "purge_cache",
    "Delete the user's whole football-docs paper library and the SportRxiv copy. Call with confirm: true only when the user asked for it.",
    { confirm: z.boolean().describe("Must be true to delete.") },
    { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    async (args) => purgeCache(args),
  );

  return server;
}

/**
 * Look for a newer docs index in the background. Runs after the transport is
 * connected and never delays a tool call; a new file is picked up by the next
 * call to openDb.
 */
async function updateDataInBackground(signal: AbortSignal): Promise<void> {
  if (DATA_MODE !== "auto" || process.env.FOOTBALL_DOCS_DB_PATH) return;
  const selection = currentSelection();
  cleanDataDir(DATA_DIR, selection.meta?.stampMs ?? null);
  // A file this installs is picked up by the chooser on the next tool call.
  await checkForUpdate({
    dataDir: DATA_DIR,
    serverVersion: PKG_VERSION,
    currentStampMs: selection.meta?.stampMs ?? null,
    signal,
    log: logToStderr,
  });
}

/** Servers can run for days; check again periodically. state.json still limits it to once a day. */
const RECHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

export async function main() {
  const transport = new StdioServerTransport();
  await createFootballDocsServer().connect(transport);

  const updates = new AbortController();
  const runCheck = () =>
    updateDataInBackground(updates.signal).catch((error) => {
      logToStderr(`football-docs: docs update check failed: ${error instanceof Error ? error.message : String(error)}`);
    });
  const timer = setInterval(runCheck, RECHECK_INTERVAL_MS);
  timer.unref();
  process.stdin.once("close", () => {
    clearInterval(timer);
    updates.abort();
  });
  void runCheck();
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
