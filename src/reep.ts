import { statSync } from "node:fs";

/**
 * resolve_entity: map a football entity to its IDs at every provider, through
 * the Reep register (https://reep.football).
 *
 * Three sources, tried in this order:
 *   1. A local copy of the free register (REEP_DUCKDB_PATH). No key, whole
 *      register, queried on this machine. The tool checks the file's release
 *      stamp against the published latest.json and tells the agent when a
 *      newer release exists.
 *   2. The Reep API (REEP_API_KEY). Keys are issued by hand on request; there
 *      is no self-service sign-up.
 *   3. Neither: no network call. The answer says how to set up either source
 *      and gives the DuckDB query that answers the question from the download.
 */

export const REEP_CONTACT = "getintouch+nutmeg@withqwerty.com";
export const REEP_DOWNLOAD_URL = "https://reep.football/downloads/duckdb";
export const REEP_LATEST_URL = "https://data.reep.football/releases/latest.json";
const DEFAULT_API_URL = "https://reep.football/api/v1";
// Cloudflare refuses some default client User-Agents.
const USER_AGENT = "football-docs (+https://github.com/withqwerty/football-docs)";
const MAX_RESULTS = 10;
const FRESHNESS_TTL_MS = 60 * 60 * 1000;

export const ENTITY_TYPES = ["player", "coach", "referee", "team", "competition", "season", "stage", "match"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export type ResolveEntityArgs = {
  name?: string;
  provider?: string;
  id?: string;
  namespace?: string;
  reep_id?: string;
  type?: EntityType;
};

type ToolResponse = { isError?: boolean; content: Array<{ type: "text"; text: string }> };
const textResult = (text: string, isError = false): ToolResponse => ({
  isError: isError || undefined,
  content: [{ type: "text", text }],
});

type Row = Record<string, unknown>;

/** A read-only view of a local register file. Injectable so tests need no 700 MB file. */
export interface LocalRegister {
  stamp: string | null;
  query(sql: string, params: Record<string, string>): Promise<Row[]>;
}

export type ResolveEntityOptions = {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  openLocal?: (path: string) => Promise<LocalRegister>;
};

type Bridge = { provider: string; namespace: string; external_id: string; role?: string };
type Found = {
  reep_id: string;
  label: string;
  entity_type: string;
  requested_id?: string;
  matched?: string;
  bridges?: Bridge[];
  bridge_count?: number;
};

type Query =
  | { kind: "provider"; provider: string; id: string; namespace?: string; type?: EntityType }
  | { kind: "reep_id"; reepId: string }
  | { kind: "name"; name: string; type?: EntityType };

function parseQuery(args: ResolveEntityArgs): Query | string {
  const provider = args.provider?.trim().toLowerCase();
  const id = args.id?.trim();
  if (provider && id) {
    return { kind: "provider", provider, id, namespace: args.namespace?.trim() || undefined, type: args.type };
  }
  if (args.reep_id?.trim()) return { kind: "reep_id", reepId: args.reep_id.trim() };
  const name = args.name?.trim();
  if (name) {
    if (name.length < 3) return "A name search needs at least 3 characters.";
    return { kind: "name", name, type: args.type };
  }
  return [
    "Provide one of: provider + id, reep_id, or name. Examples:",
    "- provider: 'transfermarkt', namespace: 'spieler', id: '28003'",
    "- provider: 'wyscout', namespace: 'player', id: '379209'",
    "- reep_id: 'rp1b829f1d3468c4'",
    "- name: 'Declan Rice', type: 'player'",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Source 1: the local DuckDB file

type OpenFile = { mtimeMs: number; register: LocalRegister; close: () => void };
const openFiles = new Map<string, OpenFile>();

async function openDuckdb(path: string): Promise<{ register: LocalRegister; close: () => void }> {
  const duckdb = await import("@duckdb/node-api");
  const instance = await duckdb.DuckDBInstance.create(path, { access_mode: "READ_ONLY" });
  const connection = await instance.connect();
  const query = async (sql: string, params: Record<string, string>) =>
    (await connection.runAndReadAll(sql, params)).getRowObjectsJson() as Row[];
  const meta = await query("SELECT value FROM release_metadata WHERE key = 'source_stamp'", {});
  return {
    register: { stamp: meta.length ? String(meta[0].value) : null, query },
    close: () => connection.closeSync(),
  };
}

/** Open once per path; reopen when the file changes, so a fresh download needs no restart. */
async function localRegister(path: string, options: ResolveEntityOptions): Promise<LocalRegister> {
  if (options.openLocal) return options.openLocal(path);
  const mtimeMs = statSync(path).mtimeMs;
  const cached = openFiles.get(path);
  if (cached && cached.mtimeMs === mtimeMs) return cached.register;
  cached?.close();
  const opened = await openDuckdb(path);
  openFiles.set(path, { mtimeMs, ...opened });
  return opened.register;
}

async function localLookup(register: LocalRegister, q: Query): Promise<Found[]> {
  let ids: Array<{ reep_id: string; requested_id?: string; bridge_count?: number; matched?: string }> = [];

  if (q.kind === "provider") {
    const params: Record<string, string> = { provider: q.provider, id: q.id };
    let sql =
      "SELECT DISTINCT b.reep_id, b.namespace FROM bridges b JOIN entities e USING (reep_id) " +
      "WHERE b.provider = $provider AND b.external_id = $id";
    if (q.namespace) {
      sql += " AND b.namespace = $namespace";
      params.namespace = q.namespace;
    }
    if (q.type) {
      sql += " AND e.entity_type = $type";
      params.type = q.type;
    }
    ids = (await register.query(`${sql} LIMIT ${MAX_RESULTS}`, params)).map((r) => ({
      reep_id: String(r.reep_id),
      matched: `${q.provider} / ${String(r.namespace ?? "")}: ${q.id}`,
    }));
  } else if (q.kind === "reep_id") {
    // Follow merge redirects to the survivor (bounded, in case of a chain).
    let current = q.reepId;
    for (let hop = 0; hop < 5; hop++) {
      const next = await register.query("SELECT to_id FROM redirects WHERE from_id = $id", { id: current });
      if (!next.length) break;
      current = String(next[0].to_id);
    }
    ids = [{ reep_id: current, requested_id: current === q.reepId ? undefined : q.reepId }];
  } else {
    const pattern = `%${q.name.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    const params: Record<string, string> = { pattern };
    let sql = "SELECT reep_id, bridge_count FROM entity_search WHERE search_text ILIKE $pattern ESCAPE '\\'";
    if (q.type) {
      sql += " AND entity_type = $type";
      params.type = q.type;
    }
    ids = (await register.query(`${sql} ORDER BY bridge_count DESC LIMIT ${MAX_RESULTS}`, params)).map((r) => ({
      reep_id: String(r.reep_id),
      bridge_count: Number(r.bridge_count),
    }));
  }

  const found: Found[] = [];
  for (const hit of ids) {
    const entity = await register.query("SELECT reep_id, label, entity_type FROM entities WHERE reep_id = $id", {
      id: hit.reep_id,
    });
    if (!entity.length) continue;
    const bridges = await register.query(
      "SELECT provider, namespace, external_id FROM bridges WHERE reep_id = $id ORDER BY provider, namespace, external_id",
      { id: hit.reep_id },
    );
    found.push({
      reep_id: hit.reep_id,
      label: String(entity[0].label),
      entity_type: String(entity[0].entity_type),
      requested_id: hit.requested_id,
      matched: hit.matched,
      bridges: bridges.map((b) => ({
        provider: String(b.provider),
        namespace: String(b.namespace ?? ""),
        external_id: String(b.external_id),
      })),
    });
  }
  return found;
}

// Keyed by the fetch implementation, so an injected fetch never sees another's cache.
const latestCache = new WeakMap<typeof fetch, { at: number; stamp: string }>();

/** The current published stamp, from the public latest.json (no key). Cached for an hour. */
async function latestStamp(fetchImpl: typeof fetch): Promise<string> {
  const cached = latestCache.get(fetchImpl);
  if (cached && Date.now() - cached.at < FRESHNESS_TTL_MS) return cached.stamp;
  const response = await fetchImpl(REEP_LATEST_URL, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const stamp = String(((await response.json()) as { stamp?: string }).stamp ?? "");
  if (!stamp) throw new Error("latest.json has no stamp");
  latestCache.set(fetchImpl, { at: Date.now(), stamp });
  return stamp;
}

/** Instructions for the agent about the local file's age. */
async function freshnessNote(path: string, local: string | null, fetchImpl: typeof fetch): Promise<string> {
  const update = [
    "To update it, download the file again to the same path:",
    `  curl -L -o "${path}" ${REEP_DOWNLOAD_URL}`,
    "The file is several hundred MB. The next resolve_entity call opens the new file; no restart is needed.",
  ].join("\n");
  let current: string;
  try {
    current = await latestStamp(fetchImpl);
  } catch (error) {
    return (
      `Local register release: ${local ?? "unknown"}. Could not check for a newer release ` +
      `(${error instanceof Error ? error.message : String(error)}). The current stamp is at ${REEP_LATEST_URL}; ` +
      `releases are weekly. If it differs from the local release:\n${update}`
    );
  }
  if (local === current) return `Local register release: ${local} (current).`;
  return (
    `**The local register is out of date.** Local release: ${local ?? "unknown"}; current release: ${current}. ` +
    `Tell the user, and offer to update it before relying on these results.\n${update}`
  );
}

// ---------------------------------------------------------------------------
// Source 2: the API

function apiRequest(base: string, q: Query): string {
  const root = base.replace(/\/+$/, "");
  if (q.kind === "provider") {
    const url = new URL(`${root}/resolve/${encodeURIComponent(q.provider)}/${encodeURIComponent(q.id)}`);
    url.searchParams.set("include", "bridges");
    if (q.namespace) url.searchParams.set("namespace", q.namespace);
    if (q.type) url.searchParams.set("type", q.type);
    return url.href;
  }
  if (q.kind === "reep_id") {
    const url = new URL(`${root}/entities/${encodeURIComponent(q.reepId)}`);
    url.searchParams.set("include", "bridges");
    return url.href;
  }
  const url = new URL(`${root}/search`);
  url.searchParams.set("q", q.name);
  url.searchParams.set("sort", "bridges");
  url.searchParams.set("limit", String(MAX_RESULTS));
  if (q.type) url.searchParams.set("type", q.type);
  return url.href;
}

type ApiEntity = {
  reep_id: string;
  entity_type: string;
  name_en?: string;
  label?: string;
  requested_id?: string;
  redirected_to?: string;
  bridge_count?: number;
  bridges?: Bridge[];
};

function fromApi(e: ApiEntity): Found {
  return {
    reep_id: e.reep_id,
    label: e.name_en ?? e.label ?? e.reep_id,
    entity_type: e.entity_type,
    requested_id: e.redirected_to ? e.requested_id : undefined,
    bridges: e.bridges,
    bridge_count: e.bridge_count,
  };
}

async function apiLookup(q: Query, key: string, base: string, fetchImpl: typeof fetch): Promise<ToolResponse> {
  let response: Response;
  try {
    response = await fetchImpl(apiRequest(base, q), {
      headers: { Authorization: `Bearer ${key}`, "User-Agent": USER_AGENT, Accept: "application/json" },
    });
  } catch (error) {
    return textResult(`Could not reach the Reep API: ${error instanceof Error ? error.message : String(error)}`, true);
  }

  const stamp = response.headers.get("X-Reep-Release-Stamp");
  const credits = response.headers.get("X-Reep-Credits-Remaining");
  const footer = [stamp && `Release: ${stamp}`, credits && `Lookups remaining this month: ${credits}`]
    .filter(Boolean)
    .join(" · ");

  if (response.status === 401 || response.status === 403) {
    return textResult(
      `The Reep API refused the key in REEP_API_KEY (HTTP ${response.status}). It may be mistyped, revoked or expired. ` +
        `Keys are issued by hand: email ${REEP_CONTACT}. Without a key, the free download answers the same ` +
        `question locally: set REEP_DUCKDB_PATH to a copy of ${REEP_DOWNLOAD_URL}.`,
      true,
    );
  }
  if (response.status === 429) {
    return textResult(
      "The Reep API rate limit or monthly lookup allowance is used up (HTTP 429). For bulk work, use the free " +
        `download instead: set REEP_DUCKDB_PATH to a copy of ${REEP_DOWNLOAD_URL}. To raise the limit, email ${REEP_CONTACT}.`,
      true,
    );
  }
  if (response.status === 404) return textResult(`No Reep entity matches that query.${footer ? `\n\n${footer}` : ""}`);

  let body: { results?: ApiEntity[] } & ApiEntity;
  try {
    body = (await response.json()) as typeof body;
  } catch {
    return textResult(`Reep API error: HTTP ${response.status} ${response.statusText}`, true);
  }

  if (response.status === 409) {
    const candidates = (body.results ?? []).map(fromApi);
    return textResult(
      `That provider ID maps to ${candidates.length} Reep entities, so it is ambiguous. Pass namespace or type ` +
        `to narrow it, or check each candidate:\n\n${formatFound(candidates)}${footer ? `\n\n${footer}` : ""}`,
    );
  }
  if (!response.ok) return textResult(`Reep API error: HTTP ${response.status} ${response.statusText}`, true);

  const found = (q.kind === "reep_id" ? [body] : (body.results ?? [])).map(fromApi);
  if (!found.length) return textResult(`No Reep entity matches that query.${footer ? `\n\n${footer}` : ""}`);
  const hint =
    q.kind === "name" ? "\n\nSearch results carry no provider IDs. Call again with reep_id to get every provider ID." : "";
  return textResult(`Found ${found.length} result(s) via the Reep API:\n\n${formatFound(found)}${hint}${footer ? `\n\n${footer}` : ""}`);
}

// ---------------------------------------------------------------------------
// Source 3: neither configured

function sqlFor(q: Query): string {
  const quote = (s: string) => `'${s.replace(/'/g, "''")}'`;
  if (q.kind === "provider") {
    return [
      "SELECT e.reep_id, e.label, e.entity_type, o.provider, o.namespace, o.external_id",
      "FROM bridges b",
      "JOIN entities e USING (reep_id)",
      "JOIN bridges o ON o.reep_id = e.reep_id",
      `WHERE b.provider = ${quote(q.provider)}${q.namespace ? ` AND b.namespace = ${quote(q.namespace)}` : ""}`,
      `  AND b.external_id = ${quote(q.id)}`,
      "ORDER BY o.provider, o.namespace;",
    ].join("\n");
  }
  if (q.kind === "reep_id") {
    return [
      "-- Follow a merge redirect first, then list every provider ID.",
      "SELECT e.reep_id, e.label, e.entity_type, b.provider, b.namespace, b.external_id",
      "FROM entities e JOIN bridges b USING (reep_id)",
      `WHERE e.reep_id = coalesce((SELECT to_id FROM redirects WHERE from_id = ${quote(q.reepId)}), ${quote(q.reepId)})`,
      "ORDER BY b.provider, b.namespace;",
    ].join("\n");
  }
  return [
    "SELECT reep_id, label, entity_type, bridge_count",
    "FROM entity_search",
    `WHERE search_text ILIKE ${quote(`%${q.name}%`)}${q.type ? ` AND entity_type = ${quote(q.type)}` : ""}`,
    "ORDER BY bridge_count DESC",
    "LIMIT 10;",
  ].join("\n");
}

function setupGuidance(q: Query, note?: string): string {
  return [
    ...(note ? [note, ""] : []),
    "Reep entity resolution is not set up in this MCP server. Two ways to enable it:",
    "",
    `1. Free, no key: download the whole register (${REEP_DOWNLOAD_URL}, one DuckDB file of several hundred MB)`,
    "   and set REEP_DUCKDB_PATH to its path in this server's MCP configuration. Lookups then run locally.",
    "   Reep releases weekly; this tool reports when the local file is out of date and how to refresh it.",
    `2. The Reep API: set REEP_API_KEY. Keys are issued by hand on request, with no self-service sign-up;`,
    `   email ${REEP_CONTACT} with your organisation and what you are matching.`,
    "",
    "Meanwhile, this query answers the question against the downloaded file (duckdb reep-register-v1.duckdb):",
    "",
    "```sql",
    sqlFor(q),
    "```",
    "",
    "Guides: https://reep.football/get-started · Namespaces matter: bridges key on (provider, namespace, external_id).",
  ].join("\n");
}

// ---------------------------------------------------------------------------

function formatFound(found: Found[]): string {
  return found
    .map((f) => {
      const lines = [`### ${f.label} (${f.entity_type})`, `Reep ID: ${f.reep_id}`];
      if (f.matched) lines.push(`Matched: ${f.matched}`);
      if (f.requested_id) lines.push(`Redirected: ${f.requested_id} was merged into ${f.reep_id}; store the new ID.`);
      if (f.bridges) {
        lines.push("Provider IDs:");
        if (!f.bridges.length) lines.push("  (none)");
        for (const b of f.bridges) {
          const role = b.role && b.role !== "canonical_bridge" ? ` (${b.role})` : "";
          lines.push(`  ${b.provider}${b.namespace ? ` / ${b.namespace}` : ""}: ${b.external_id}${role}`);
        }
      } else if (f.bridge_count !== undefined) {
        lines.push(`Providers bridged: ${f.bridge_count}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

export async function resolveEntity(args: ResolveEntityArgs, options: ResolveEntityOptions = {}): Promise<ToolResponse> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const q = parseQuery(args);
  if (typeof q === "string") return textResult(q, true);

  const path = env.REEP_DUCKDB_PATH?.trim();
  const key = env.REEP_API_KEY?.trim();
  let localProblem: string | undefined;

  if (path) {
    try {
      const register = await localRegister(path, options);
      const found = await localLookup(register, q);
      const note = await freshnessNote(path, register.stamp, fetchImpl);
      if (!found.length) return textResult(`No Reep entity matches that query in the local register.\n\n${note}`);
      const namespaces = new Set(found.map((f) => f.matched?.split(":")[0]));
      const warning =
        q.kind === "provider" && !q.namespace && namespaces.size > 1
          ? `\n\n**No namespace was given, and this ID matches in ${namespaces.size} namespaces.** ${q.provider} reuses ` +
            "numbers across entity types. Pass namespace to pick the one you mean."
          : "";
      return textResult(
        `Found ${found.length} result(s) in the local Reep register:\n\n${formatFound(found)}${warning}\n\n${note}`,
      );
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      localProblem = /Cannot find (package|module) '@duckdb\/node-api'/.test(reason)
        ? "REEP_DUCKDB_PATH is set, but the DuckDB client that reads it is not installed. It is an optional " +
          "dependency whose native build can fail on some systems; reinstall football-docs, or install " +
          "@duckdb/node-api alongside it."
        : `REEP_DUCKDB_PATH is set to "${path}", but the file could not be read (${reason}). ` +
          `Download it with: curl -L -o "${path}" ${REEP_DOWNLOAD_URL}`;
    }
  }

  if (key) {
    const result = await apiLookup(q, key, env.REEP_API_URL?.trim() || DEFAULT_API_URL, fetchImpl);
    if (localProblem) result.content[0].text = `${localProblem}\n\n${result.content[0].text}`;
    return result;
  }
  return textResult(setupGuidance(q, localProblem), Boolean(localProblem));
}
