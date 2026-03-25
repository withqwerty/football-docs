/**
 * Nutmeg Football Docs MCP Server
 *
 * A Context7-style searchable index of football data provider documentation.
 * Exposes two tools:
 *   - search_docs: Full-text search across all provider docs
 *   - list_providers: List all indexed providers and their coverage
 *
 * Data is stored in a SQLite FTS5 index for fast offline search.
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Database from "better-sqlite3";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "..", "data", "docs.db");

// ── Database ────────────────────────────────────────────────────────────

function openDb(): Database.Database {
  if (!existsSync(DB_PATH)) {
    throw new Error(
      `Docs database not found at ${DB_PATH}. Run 'npm run ingest' first to build the index.`
    );
  }
  return new Database(DB_PATH, { readonly: true });
}

// ── Server ──────────────────────────────────────────────────────────────

const server = new McpServer({
  name: "nutmeg-football-docs",
  version: "0.1.0",
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
      let sql = `
        SELECT provider, category, title, content,
               rank * -1 as relevance
        FROM docs_fts
        WHERE docs_fts MATCH ?
      `;
      const params: (string | number)[] = [query];

      if (provider) {
        sql += ` AND provider = ?`;
        params.push(provider.toLowerCase());
      }

      sql += ` ORDER BY rank LIMIT ?`;
      params.push(max_results ?? 10);

      const rows = db.prepare(sql).all(...params) as Array<{
        provider: string;
        category: string;
        title: string;
        content: string;
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
        .map(
          (r, i) =>
            `## [${i + 1}] ${r.title}\n**Provider:** ${r.provider} | **Category:** ${r.category}\n\n${r.content}`
        )
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
      let sql = `
        SELECT provider, category, title, content,
               rank * -1 as relevance
        FROM docs_fts
        WHERE docs_fts MATCH ?
      `;
      const params: (string | number)[] = [topic];

      if (providers && providers.length > 0) {
        const placeholders = providers.map(() => "?").join(", ");
        sql += ` AND provider IN (${placeholders})`;
        params.push(...providers.map((p) => p.toLowerCase()));
      }

      sql += ` ORDER BY provider, rank LIMIT 30`;

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

// ── Start ───────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start nutmeg docs server:", err);
  process.exit(1);
});
