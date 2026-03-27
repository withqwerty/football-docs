/**
 * Nutmeg Football Docs MCP Server
 *
 * A Context7-style searchable index of football data provider documentation.
 * Exposes tools for searching docs, listing providers, comparing providers,
 * and requesting documentation updates.
 *
 * Data is stored in a SQLite FTS5 index for fast offline search.
 * Update requests are stored in a separate writable SQLite DB in a
 * user-writable location (XDG_DATA_HOME or ~/.local/share).
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Database from "better-sqlite3";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "..", "data", "docs.db");

// Request queue DB goes in a user-writable location, not inside the npm package
const QUEUE_DB_DIR = resolve(
  process.env.XDG_DATA_HOME ?? resolve(homedir(), ".local", "share"),
  "football-docs"
);
const QUEUE_DB_PATH = resolve(QUEUE_DB_DIR, "requests.db");

// ── Database ────────────────────────────────────────────────────────────

function openDb(): Database.Database {
  if (!existsSync(DB_PATH)) {
    throw new Error(
      `Docs database not found at ${DB_PATH}. Run 'npm run ingest' first to build the index.`
    );
  }
  const db = new Database(DB_PATH, { readonly: true });

  // Check schema version — source_type column was added in v0.2.0
  const columns = db.pragma("table_info(docs)") as Array<{ name: string }>;
  const hasProvenance = columns.some((c) => c.name === "source_type");
  if (!hasProvenance) {
    db.close();
    throw new Error(
      `Docs database is outdated (missing provenance columns). Run 'npm run ingest' to rebuild.`
    );
  }

  return db;
}

function openQueueDb(): Database.Database {
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

/** Sanitise a query string for FTS5 MATCH by wrapping in double quotes (phrase search). */
function sanitiseFtsQuery(query: string): string {
  // FTS5 special syntax (AND, OR, NOT, NEAR, column:, *, ^) can cause errors.
  // Wrap the user query in double quotes to treat it as a phrase search,
  // escaping any embedded double quotes first.
  return `"${query.replace(/"/g, '""')}"`;
}

// ── Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "nutmeg-football-docs",
  version: "0.2.0",
});

// Tool: search_docs
server.tool(
  "search_docs",
  "Search football data provider documentation. Use for finding event types, qualifier IDs, API endpoints, coordinate systems, data models, and cross-provider mappings. Returns the most relevant documentation chunks.",
  {
    query: z.string().describe(
      "Search query. Examples: 'Opta goal qualifier', 'StatsBomb shot event type', 'coordinate system differences', 'xG qualifier ID', 'SportMonks fixture endpoint'"
    ),
    provider: z
      .string()
      .optional()
      .describe(
        "Filter to a specific provider: opta, statsbomb, wyscout, sportmonks, fbref, understat, kloppy, or leave empty for all"
      ),
    max_results: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of results to return (default 10)"),
  },
  async ({ query, provider, max_results }) => {
    const db = openDb();
    try {
      const safeQuery = sanitiseFtsQuery(query);
      let sql = `
        SELECT d.provider, d.category, d.title, d.content,
               d.source_type, d.source_url, d.upstream_version,
               rank * -1 as relevance
        FROM docs_fts
        JOIN docs d ON d.id = docs_fts.rowid
        WHERE docs_fts MATCH ?
      `;
      const params: (string | number)[] = [safeQuery];

      if (provider) {
        sql += ` AND d.provider = ?`;
        params.push(provider.toLowerCase());
      }

      sql += ` ORDER BY rank LIMIT ?`;
      params.push(max_results ?? 10);

      const rows = db.prepare(sql).all(...params) as Array<{
        provider: string;
        category: string;
        title: string;
        content: string;
        source_type: string;
        source_url: string | null;
        upstream_version: string | null;
        relevance: number;
      }>;

      if (rows.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No results found for "${query}"${provider ? ` in ${provider}` : ""}. Try broader terms or remove the provider filter.`,
            },
          ],
        };
      }

      const results = rows
        .map((r, i) => {
          const source = r.source_type === "curated"
            ? "**Source:** curated by football-docs contributors"
            : `**Source:** ${r.source_type}${r.source_url ? ` (${r.source_url})` : ""}${r.upstream_version ? ` | v${r.upstream_version}` : ""}`;
          return `## [${i + 1}] ${r.title}\n**Provider:** ${r.provider} | **Category:** ${r.category} | ${source}\n\n${r.content}`;
        })
        .join("\n\n---\n\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Found ${rows.length} result(s) for "${query}"${provider ? ` in ${provider}` : ""}:\n\n${results}`,
          },
        ],
      };
    } finally {
      db.close();
    }
  }
);

// Tool: list_providers
server.tool(
  "list_providers",
  "List all indexed football data providers, their document count, and coverage categories. Use to understand what documentation is available.",
  {},
  async () => {
    const db = openDb();
    try {
      const rows = db
        .prepare(
          `SELECT provider, category, COUNT(*) as chunks
           FROM docs
           GROUP BY provider, category
           ORDER BY provider, category`
        )
        .all() as Array<{ provider: string; category: string; chunks: number }>;

      const byProvider = new Map<string, { categories: string[]; total: number }>();
      for (const r of rows) {
        const entry = byProvider.get(r.provider) ?? { categories: [], total: 0 };
        entry.categories.push(`${r.category} (${r.chunks})`);
        entry.total += r.chunks;
        byProvider.set(r.provider, entry);
      }

      const lines = [...byProvider.entries()]
        .map(
          ([p, info]) =>
            `**${p}** (${info.total} chunks): ${info.categories.join(", ")}`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Indexed providers:\n\n${lines}`,
          },
        ],
      };
    } finally {
      db.close();
    }
  }
);

// Tool: compare_providers
server.tool(
  "compare_providers",
  "Compare what two or more providers offer for a specific data type or concept. For example: 'How do Opta and StatsBomb represent shot events differently?'",
  {
    topic: z.string().describe("The concept to compare across providers. Examples: 'shot events', 'coordinate systems', 'xG', 'pass types'"),
    providers: z.array(z.string()).optional().describe("Providers to compare. If omitted, compares all indexed providers."),
  },
  async ({ topic, providers }) => {
    const db = openDb();
    try {
      const safeTopic = sanitiseFtsQuery(topic);
      let sql = `
        SELECT d.provider, d.category, d.title, d.content,
               rank * -1 as relevance
        FROM docs_fts
        JOIN docs d ON d.id = docs_fts.rowid
        WHERE docs_fts MATCH ?
      `;
      const params: (string | number)[] = [safeTopic];

      if (providers && providers.length > 0) {
        const placeholders = providers.map(() => "?").join(", ");
        sql += ` AND d.provider IN (${placeholders})`;
        params.push(...providers.map((p) => p.toLowerCase()));
      }

      sql += ` ORDER BY d.provider, rank LIMIT 30`;

      const rows = db.prepare(sql).all(...params) as Array<{
        provider: string;
        category: string;
        title: string;
        content: string;
      }>;

      if (rows.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No documentation found for "${topic}". Try different terms.`,
            },
          ],
        };
      }

      // Group by provider
      const grouped = new Map<string, string[]>();
      for (const r of rows) {
        const entries = grouped.get(r.provider) ?? [];
        entries.push(`### ${r.title}\n${r.content}`);
        grouped.set(r.provider, entries);
      }

      const sections = [...grouped.entries()]
        .map(([p, chunks]) => `## ${p}\n\n${chunks.slice(0, 3).join("\n\n")}`)
        .join("\n\n---\n\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `Comparison for "${topic}" across ${grouped.size} provider(s):\n\n${sections}`,
          },
        ],
      };
    } finally {
      db.close();
    }
  }
);

// Tool: request_update
server.tool(
  "request_update",
  "Request that a provider's documentation be added, updated, or recrawled. Use when you notice docs are outdated, a provider is missing, or you know of a better documentation source. Requests are queued for review.",
  {
    type: z.enum(["new_provider", "recrawl", "flag_outdated", "suggest_source"]).describe(
      "Type of request: new_provider (add a new tool/library), recrawl (refresh existing docs), flag_outdated (mark docs as stale), suggest_source (recommend a better doc source like llms.txt)"
    ),
    provider: z.string().max(100).describe("Provider name (existing or proposed). Examples: 'statsbomb', 'mplsoccer', 'floodlight'"),
    reason: z.string().max(2000).describe("Why this update is needed. Be specific: version bump, missing event types, new API endpoints, etc."),
    suggested_urls: z.array(z.string().url().max(500)).max(10).optional().describe("URLs for documentation sources (readthedocs, GitHub, llms.txt, etc.)"),
  },
  async ({ type, provider, reason, suggested_urls }) => {
    const qdb = openQueueDb();
    try {
      // Hard cap on queue size
      const countRow = qdb.prepare("SELECT COUNT(*) as cnt FROM requests").get() as { cnt: number };
      if (countRow.cnt >= 500) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `Request queue is full (${countRow.cnt} entries). Please file an issue at https://github.com/withqwerty/football-docs/issues instead.`,
            },
          ],
        };
      }

      // Cooldown: reject if same provider was requested in last 7 days
      const recentRequest = qdb.prepare(
        `SELECT id, requested_at FROM requests
         WHERE lower(provider) = lower(?) AND status = 'pending'
           AND datetime(requested_at) > datetime('now', '-7 days')
         LIMIT 1`
      ).get(provider) as { id: string; requested_at: string } | undefined;

      if (recentRequest) {
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: `A pending request for "${provider}" already exists (from ${recentRequest.requested_at}). Requests have a 7-day cooldown to prevent duplicate work. Request ID: ${recentRequest.id}`,
            },
          ],
        };
      }

      const id = `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

      qdb.prepare(
        `INSERT INTO requests (id, type, provider, reason, suggested_urls, requested_at, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`
      ).run(
        id,
        type,
        provider.toLowerCase(),
        reason,
        suggested_urls ? JSON.stringify(suggested_urls) : null,
        new Date().toISOString(),
      );

      const typeLabel = {
        new_provider: "New provider request",
        recrawl: "Recrawl request",
        flag_outdated: "Outdated docs flag",
        suggest_source: "Source suggestion",
      }[type];

      return {
        content: [
          {
            type: "text" as const,
            text: `${typeLabel} queued for "${provider}" (ID: ${id}).\n\nReason: ${reason}${suggested_urls?.length ? `\nSuggested URLs:\n${suggested_urls.map((u) => `  - ${u}`).join("\n")}` : ""}\n\nThis request will be reviewed by maintainers. You can also file an issue at https://github.com/withqwerty/football-docs/issues for community visibility.`,
          },
        ],
      };
    } finally {
      qdb.close();
    }
  }
);

// ── Start ───────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start nutmeg docs server:", err);
  process.exit(1);
});
