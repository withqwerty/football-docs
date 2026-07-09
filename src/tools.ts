import type Database from "better-sqlite3";

export const TOOL_NAMES = [
  "search_docs",
  "list_providers",
  "compare_providers",
  "request_update",
  "resolve_entity",
] as const;

type TextContent = {
  type: "text";
  text: string;
};

export type ToolResponse = {
  isError?: boolean;
  content: TextContent[];
};

export type SearchDocsArgs = {
  query: string;
  provider?: string;
  max_results?: number;
};

export type CompareProvidersArgs = {
  topic: string;
  providers?: string[];
};

export type RequestUpdateArgs = {
  type: "new_provider" | "recrawl" | "flag_outdated" | "suggest_source";
  provider: string;
  reason: string;
  suggested_urls?: string[];
};

export type ResolveEntityArgs = {
  name?: string;
  provider?: string;
  id?: string;
  qid?: string;
  type?: "player" | "team" | "coach";
};

type SearchRow = {
  provider: string;
  category: string;
  title: string;
  content: string;
  source_type: string;
  source_url: string | null;
  upstream_version: string | null;
  relevance: number;
};

type CompareRow = {
  provider: string;
  category: string;
  title: string;
  content: string;
  relevance: number;
};

const QUERY_STOP_WORDS = new Set(["and", "or", "not", "near"]);

function textResult(text: string, isError = false): ToolResponse {
  return {
    isError: isError || undefined,
    content: [{ type: "text", text }],
  };
}

function extractFtsTokens(query: string): string[] {
  const rawTokens = query.match(/[\p{L}\p{N}_]+/gu) ?? [];
  const tokens = rawTokens
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 0 && !QUERY_STOP_WORDS.has(token));
  return [...new Set(tokens)];
}

function quoteFtsToken(token: string): string {
  return `"${token.replace(/"/g, '""')}"`;
}

/**
 * Build a safe FTS5 MATCH query from user text.
 *
 * User questions are usually natural language, not exact doc phrases. Joining
 * searchable tokens with AND keeps results precise while still allowing queries
 * like "Opta qualifier 76" to match docs that contain those tokens separately.
 */
export function sanitiseFtsQuery(query: string): string {
  const tokens = extractFtsTokens(query);
  if (tokens.length === 0) return '""';
  return tokens.map(quoteFtsToken).join(" AND ");
}

function relaxedFtsQuery(query: string): string {
  const tokens = extractFtsTokens(query);
  if (tokens.length === 0) return '""';
  return tokens.map(quoteFtsToken).join(" OR ");
}

function normaliseProvider(provider: string): string {
  return provider.trim().toLowerCase();
}

function normaliseLimit(value: number | undefined, defaultValue: number, maxValue: number): number {
  if (value === undefined || !Number.isFinite(value)) return defaultValue;
  return Math.min(Math.max(Math.trunc(value), 1), maxValue);
}

function searchRows(
  db: Database.Database,
  matchQuery: string,
  provider: string | undefined,
  limit: number,
): SearchRow[] {
  let sql = `
    SELECT d.provider, d.category, d.title, d.content,
           d.source_type, d.source_url, d.upstream_version,
           rank * -1 as relevance
    FROM docs_fts
    JOIN docs d ON d.id = docs_fts.rowid
    WHERE docs_fts MATCH ?
  `;
  const params: (string | number)[] = [matchQuery];

  if (provider) {
    sql += " AND d.provider = ?";
    params.push(normaliseProvider(provider));
  }

  sql += " ORDER BY rank LIMIT ?";
  params.push(limit);

  return db.prepare(sql).all(...params) as SearchRow[];
}

function compareRows(
  db: Database.Database,
  matchQuery: string,
  providers: string[] | undefined,
): CompareRow[] {
  let sql = `
    SELECT d.provider, d.category, d.title, d.content,
           rank * -1 as relevance
    FROM docs_fts
    JOIN docs d ON d.id = docs_fts.rowid
    WHERE docs_fts MATCH ?
  `;
  const params: (string | number)[] = [matchQuery];

  if (providers && providers.length > 0) {
    const placeholders = providers.map(() => "?").join(", ");
    sql += ` AND d.provider IN (${placeholders})`;
    params.push(...providers.map(normaliseProvider));
  }

  sql += " ORDER BY d.provider, rank LIMIT 30";
  return db.prepare(sql).all(...params) as CompareRow[];
}

function sourceLabel(row: SearchRow): string {
  if (row.source_type === "curated") {
    return "**Source:** curated by football-docs contributors";
  }
  return `**Source:** ${row.source_type}${row.source_url ? ` (${row.source_url})` : ""}${
    row.upstream_version ? ` | v${row.upstream_version}` : ""
  }`;
}

export function searchDocs(db: Database.Database, args: SearchDocsArgs): ToolResponse {
  const limit = normaliseLimit(args.max_results, 10, 50);
  const strictQuery = sanitiseFtsQuery(args.query);
  const fallbackQuery = relaxedFtsQuery(args.query);
  let rows = searchRows(db, strictQuery, args.provider, limit);

  if (rows.length === 0 && fallbackQuery !== strictQuery) {
    rows = searchRows(db, fallbackQuery, args.provider, limit);
  }

  if (rows.length === 0) {
    return textResult(
      `No results found for "${args.query}"${args.provider ? ` in ${args.provider}` : ""}. Try broader terms or remove the provider filter.`,
    );
  }

  const results = rows
    .map((row, index) => {
      return `## [${index + 1}] ${row.title}\n**Provider:** ${row.provider} | **Category:** ${
        row.category
      } | ${sourceLabel(row)}\n\n${row.content}`;
    })
    .join("\n\n---\n\n");

  return textResult(
    `Found ${rows.length} result(s) for "${args.query}"${
      args.provider ? ` in ${args.provider}` : ""
    }:\n\n${results}`,
  );
}

export function listProviders(db: Database.Database): ToolResponse {
  const rows = db
    .prepare(
      `SELECT provider, category, COUNT(*) as chunks
       FROM docs
       GROUP BY provider, category
       ORDER BY provider, category`,
    )
    .all() as Array<{ provider: string; category: string; chunks: number }>;

  const byProvider = new Map<string, { categories: string[]; total: number }>();
  for (const row of rows) {
    const entry = byProvider.get(row.provider) ?? { categories: [], total: 0 };
    entry.categories.push(`${row.category} (${row.chunks})`);
    entry.total += row.chunks;
    byProvider.set(row.provider, entry);
  }

  const lines = [...byProvider.entries()]
    .map(([provider, info]) => {
      return `**${provider}** (${info.total} chunks): ${info.categories.join(", ")}`;
    })
    .join("\n");

  return textResult(`Indexed providers:\n\n${lines}`);
}

export function compareProviders(
  db: Database.Database,
  args: CompareProvidersArgs,
): ToolResponse {
  const strictQuery = sanitiseFtsQuery(args.topic);
  const fallbackQuery = relaxedFtsQuery(args.topic);
  let rows = compareRows(db, strictQuery, args.providers);

  if (rows.length === 0 && fallbackQuery !== strictQuery) {
    rows = compareRows(db, fallbackQuery, args.providers);
  }

  if (rows.length === 0) {
    return textResult(`No documentation found for "${args.topic}". Try different terms.`);
  }

  const grouped = new Map<string, string[]>();
  for (const row of rows) {
    const entries = grouped.get(row.provider) ?? [];
    entries.push(`### ${row.title}\n${row.content}`);
    grouped.set(row.provider, entries);
  }

  const sections = [...grouped.entries()]
    .map(([provider, chunks]) => `## ${provider}\n\n${chunks.slice(0, 3).join("\n\n")}`)
    .join("\n\n---\n\n");

  return textResult(`Comparison for "${args.topic}" across ${grouped.size} provider(s):\n\n${sections}`);
}

export function requestUpdate(
  db: Database.Database,
  args: RequestUpdateArgs,
  options: { now?: Date; requestId?: string } = {},
): ToolResponse {
  const countRow = db.prepare("SELECT COUNT(*) as cnt FROM requests").get() as { cnt: number };
  if (countRow.cnt >= 500) {
    return textResult(
      `Request queue is full (${countRow.cnt} entries). Please file an issue at https://github.com/withqwerty/football-docs/issues instead.`,
      true,
    );
  }

  const recentRequest = db
    .prepare(
      `SELECT id, requested_at FROM requests
       WHERE lower(provider) = lower(?) AND status = 'pending'
         AND datetime(requested_at) > datetime('now', '-7 days')
       LIMIT 1`,
    )
    .get(args.provider) as { id: string; requested_at: string } | undefined;

  if (recentRequest) {
    return textResult(
      `A pending request for "${args.provider}" already exists (from ${recentRequest.requested_at}). Requests have a 7-day cooldown to prevent duplicate work. Request ID: ${recentRequest.id}`,
      true,
    );
  }

  const id =
    options.requestId ??
    `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const requestedAt = (options.now ?? new Date()).toISOString();

  db.prepare(
    `INSERT INTO requests (id, type, provider, reason, suggested_urls, requested_at, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
  ).run(
    id,
    args.type,
    args.provider.toLowerCase(),
    args.reason,
    args.suggested_urls ? JSON.stringify(args.suggested_urls) : null,
    requestedAt,
  );

  const typeLabel = {
    new_provider: "New provider request",
    recrawl: "Recrawl request",
    flag_outdated: "Outdated docs flag",
    suggest_source: "Source suggestion",
  }[args.type];

  return textResult(
    `${typeLabel} queued for "${args.provider}" (ID: ${id}).\n\nReason: ${args.reason}${
      args.suggested_urls?.length
        ? `\nSuggested URLs:\n${args.suggested_urls.map((url) => `  - ${url}`).join("\n")}`
        : ""
    }\n\nThis request will be reviewed by maintainers. You can also file an issue at https://github.com/withqwerty/football-docs/issues for community visibility.`,
  );
}

export async function resolveEntity(
  args: ResolveEntityArgs,
  options: { baseUrl?: string; fetchImpl?: typeof fetch } = {},
): Promise<ToolResponse> {
  const baseUrl = options.baseUrl ?? "https://reep-api.rahulkeerthi2-95d.workers.dev";
  const fetchImpl = options.fetchImpl ?? fetch;
  let url: string;

  if (args.qid) {
    url = `${baseUrl}/lookup?qid=${encodeURIComponent(args.qid)}`;
  } else if (args.provider && args.id) {
    url = `${baseUrl}/resolve?provider=${encodeURIComponent(args.provider)}&id=${encodeURIComponent(args.id)}`;
  } else if (args.name) {
    url = `${baseUrl}/search?name=${encodeURIComponent(args.name)}&limit=10`;
    if (args.type) url += `&type=${encodeURIComponent(args.type)}`;
  } else {
    return textResult(
      "Provide at least one of: name, qid, or provider+id. Examples:\n- name: 'Cole Palmer'\n- provider: 'transfermarkt', id: '568177'\n- qid: 'Q99760796'",
      true,
    );
  }

  try {
    const response = await fetchImpl(url);
    if (!response.ok) {
      return textResult(`Reep API error: ${response.status} ${response.statusText}`, true);
    }

    const data = (await response.json()) as { results: Array<Record<string, unknown>>; count?: number };
    if (!data.results?.length) {
      return textResult("No entities found matching the query.");
    }

    const formatted = data.results
      .map((entity) => {
        const ids = entity.external_ids as Record<string, string> | undefined;
        const idLines = ids
          ? Object.entries(ids)
              .map(([provider, id]) => `  ${provider}: ${id}`)
              .join("\n")
          : "  (none)";

        const bio = [
          entity.date_of_birth && `DOB: ${entity.date_of_birth}`,
          entity.nationality && `Nationality: ${entity.nationality}`,
          entity.position && `Position: ${entity.position}`,
          entity.height_cm && `Height: ${entity.height_cm}cm`,
          entity.country && `Country: ${entity.country}`,
          entity.stadium && `Stadium: ${entity.stadium}`,
        ]
          .filter(Boolean)
          .join(" | ");

        return `### ${entity.name_en} (${entity.type})\nWikidata: ${entity.qid}${
          entity.aliases_en ? `\nAliases: ${entity.aliases_en}` : ""
        }${bio ? `\n${bio}` : ""}\nProvider IDs:\n${idLines}`;
      })
      .join("\n\n");

    return textResult(`Found ${data.results.length} result(s):\n\n${formatted}`);
  } catch (error) {
    return textResult(
      `Failed to reach Reep API: ${error instanceof Error ? error.message : String(error)}`,
      true,
    );
  }
}
