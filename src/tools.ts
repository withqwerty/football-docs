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
const PROVIDER_ALIASES: Record<string, string> = {
  fbref: "free-sources",
  "football-reference": "free-sources",
  understat: "free-sources",
  free: "free-sources",
  "free-source": "free-sources",
  fmdb: "fmdb-pro",
  "transfer-room": "transferroom",
  hudl: "wyscout",
  "hudl-wyscout": "wyscout",
  statsperform: "opta",
  "stats-perform": "opta",
  "opta-f24": "opta",
  whoscored: "opta",
  "who-scored": "opta",
  "skill-corner": "skillcorner",
  "data-ball-py": "databallpy",
  "databall-py": "databallpy",
  metrica: "databallpy",
  "metrica-sports": "databallpy",
  metricasports: "databallpy",
  sportec: "databallpy",
  dfl: "databallpy",
  "sportec-dfl": "databallpy",
  "open-dfl": "databallpy",
  tracab: "databallpy",
  "mpl-soccer": "mplsoccer",
  secondspectrum: "kloppy",
  "second-spectrum": "kloppy",
  "soccer-action": "socceraction",
  "soccer-data": "soccerdata",
  sofascore: "soccerdata",
  "sofa-score": "soccerdata",
  espn: "soccerdata",
  "sport-radar": "sportradar",
  "sportradar-api": "sportradar",
  "soccer-extended": "sportradar",
  "sportradar-soccer": "sportradar",
  tsdb: "thesportsdb",
  "the-sports-db": "thesportsdb",
  "the-sportsdb": "thesportsdb",
  sportsdb: "thesportsdb",
  "soccer-donna": "soccerdonna",
  "sport-monks": "sportmonks",
  "stats-bomb": "statsbomb",
  "statsbomb-open-data": "statsbomb",
  "statsbomb-open": "statsbomb",
};
const DISPLAY_PROVIDER_ALIASES: Record<string, string[]> = Object.entries(PROVIDER_ALIASES).reduce(
  (aliasesByProvider, [alias, provider]) => {
    const aliases = aliasesByProvider[provider] ?? [];
    aliases.push(alias);
    aliasesByProvider[provider] = aliases;
    return aliasesByProvider;
  },
  {} as Record<string, string[]>,
);

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

function slugProvider(provider: string): string {
  return provider
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normaliseProvider(provider: string): string {
  const slug = slugProvider(provider);
  return PROVIDER_ALIASES[slug] ?? slug;
}

function providerFilterLabel(original: string | undefined, normalised: string | undefined): string {
  if (!original || !normalised) return "";
  const trimmed = original.trim();
  return trimmed === normalised ? normalised : `${trimmed} (${normalised})`;
}

function indexedProviders(db: Database.Database): Set<string> {
  const rows = db.prepare("SELECT DISTINCT provider FROM docs ORDER BY provider").all() as Array<{
    provider: string;
  }>;
  return new Set(rows.map((row) => row.provider));
}

function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function providerSuggestions(provider: string, providerSet: Set<string>): string[] {
  const candidates = new Map<string, string>();
  for (const indexedProvider of providerSet) {
    candidates.set(indexedProvider, indexedProvider);
  }
  for (const [alias, indexedProvider] of Object.entries(PROVIDER_ALIASES)) {
    if (providerSet.has(indexedProvider)) {
      candidates.set(alias, indexedProvider);
    }
  }

  const threshold = Math.max(2, Math.ceil(provider.length * 0.3));
  return [...candidates.entries()]
    .map(([candidate, indexedProvider]) => ({
      candidate,
      indexedProvider,
      distance: editDistance(provider, candidate),
    }))
    .filter((suggestion) => suggestion.distance <= threshold)
    .sort((a, b) => a.distance - b.distance || a.candidate.localeCompare(b.candidate))
    .map((suggestion) => suggestion.indexedProvider)
    .filter((providerName, index, suggestions) => suggestions.indexOf(providerName) === index)
    .slice(0, 3);
}

function unknownProviderMessage(original: string, provider: string, providerSet: Set<string>): string {
  const suggestions = providerSuggestions(provider, providerSet);
  const suggestionText = suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : "";
  return `Provider "${providerFilterLabel(original, provider)}" is not indexed.${suggestionText} Call list_providers for available provider keys, or use request_update to suggest adding it.`;
}

function requestProviderKey(provider: string): string {
  return slugProvider(provider).replace(/-/g, "");
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

function compareRowsForProvider(
  db: Database.Database,
  matchQuery: string,
  provider: string,
  limit: number,
): CompareRow[] {
  return db
    .prepare(
      `SELECT d.provider, d.category, d.title, d.content,
              rank * -1 as relevance
       FROM docs_fts
       JOIN docs d ON d.id = docs_fts.rowid
       WHERE docs_fts MATCH ? AND d.provider = ?
       ORDER BY rank
       LIMIT ?`,
    )
    .all(matchQuery, normaliseProvider(provider), limit) as CompareRow[];
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
  const provider = args.provider ? normaliseProvider(args.provider) : undefined;

  if (args.provider && provider) {
    const providerSet = indexedProviders(db);
    if (!providerSet.has(provider)) {
      return textResult(unknownProviderMessage(args.provider, provider, providerSet), true);
    }
  }

  let rows = searchRows(db, strictQuery, provider, limit);

  if (rows.length === 0 && fallbackQuery !== strictQuery) {
    rows = searchRows(db, fallbackQuery, provider, limit);
  }

  if (rows.length === 0) {
    const providerLabel = providerFilterLabel(args.provider, provider);
    return textResult(
      `No results found for "${args.query}"${providerLabel ? ` in ${providerLabel}` : ""}. Try broader football-data terms, remove the provider filter, or call list_providers to inspect coverage.`,
    );
  }

  const results = rows
    .map((row, index) => {
      return `## [${index + 1}] ${row.title}\n**Provider:** ${row.provider} | **Category:** ${
        row.category
      } | ${sourceLabel(row)}\n\n${row.content}`;
    })
    .join("\n\n---\n\n");

  const providerLabel = providerFilterLabel(args.provider, provider);
  return textResult(
    `Found ${rows.length} result(s) for "${args.query}"${
      providerLabel ? ` in ${providerLabel}` : ""
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
      const aliases = DISPLAY_PROVIDER_ALIASES[provider];
      const aliasText = aliases?.length ? ` | aliases: ${aliases.join(", ")}` : "";
      return `**${provider}** (${info.total} chunks): ${info.categories.join(", ")}${aliasText}`;
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
  let rows: CompareRow[];
  let requestedProviders: string[] = [];
  const providerSet = indexedProviders(db);

  if (args.providers?.length) {
    requestedProviders = [...new Set(args.providers.map(normaliseProvider))];
    rows = requestedProviders.flatMap((provider) => {
      if (!providerSet.has(provider)) return [];
      const strictRows = compareRowsForProvider(db, strictQuery, provider, 3);
      if (strictRows.length > 0 || fallbackQuery === strictQuery) return strictRows;
      return compareRowsForProvider(db, fallbackQuery, provider, 3);
    });
  } else {
    rows = compareRows(db, strictQuery, args.providers);

    if (rows.length === 0 && fallbackQuery !== strictQuery) {
      rows = compareRows(db, fallbackQuery, args.providers);
    }
  }

  if (rows.length === 0) {
    if (requestedProviders.length > 0) {
      const missingProviders = requestedProviders.filter((provider) => !providerSet.has(provider));
      const providerNote = missingProviders.length
        ? ` Requested provider(s) not indexed: ${missingProviders.join(", ")}.${missingProviders
            .map((provider) => {
              const suggestions = providerSuggestions(provider, providerSet);
              return suggestions.length ? ` ${provider}: did you mean ${suggestions.join(", ")}?` : "";
            })
            .join("")}`
        : "";
      return textResult(
        `No matching docs found for "${args.topic}" across requested provider(s): ${requestedProviders.join(", ")}.${providerNote} Call list_providers to inspect coverage, or use request_update to suggest missing provider docs.`,
      );
    }

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
  const missingProviders = requestedProviders.filter((provider) => !grouped.has(provider));
  const missingNote = missingProviders.length
    ? `\n\nNo matching docs found for requested provider(s): ${missingProviders.join(", ")}.${missingProviders
        .map((provider) => {
          if (providerSet.has(provider)) return "";
          const suggestions = providerSuggestions(provider, providerSet);
          return suggestions.length ? ` ${provider}: did you mean ${suggestions.join(", ")}?` : "";
        })
        .join("")}`
    : "";

  return textResult(
    `Comparison for "${args.topic}" across ${grouped.size} provider(s):\n\n${sections}${missingNote}`,
  );
}

export function requestUpdate(
  db: Database.Database,
  args: RequestUpdateArgs,
  options: { now?: Date; requestId?: string } = {},
): ToolResponse {
  const requestedAt = (options.now ?? new Date()).toISOString();
  const providerKey = requestProviderKey(args.provider);
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
       WHERE provider = ? AND status = 'pending'
         AND datetime(requested_at) > datetime(?, '-7 days')
       LIMIT 1`,
    )
    .get(providerKey, requestedAt) as { id: string; requested_at: string } | undefined;

  if (recentRequest) {
    return textResult(
      `A pending request for "${args.provider}" already exists (from ${recentRequest.requested_at}). Requests have a 7-day cooldown to prevent duplicate work. Request ID: ${recentRequest.id}`,
      true,
    );
  }

  const id =
    options.requestId ??
    `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  db.prepare(
    `INSERT INTO requests (id, type, provider, reason, suggested_urls, requested_at, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
  ).run(
    id,
    args.type,
    providerKey,
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
      if (response.status === 401 || response.status === 403) {
        return textResult(
          `Reep API authentication failed (${response.status} ${response.statusText}). Entity resolution is optional and needs a Reep API credential/configured endpoint before provider ID lookup can work. Docs search tools still work without Reep access.`,
          true,
        );
      }

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
