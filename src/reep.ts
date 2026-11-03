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

export const ENTITY_TYPES = ["player", "coach", "referee", "team", "competition", "season", "stage", "venue", "match"] as const;
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

type Bridge = {
  provider: string;
  namespace: string;
  external_id: string;
  role?: string;
  /** The merged Reep ID this bridge is still attached to in the release, when it is not the entity's own. */
  via?: string;
  /** Empty for a provider ID still in use; "retired" or "removed" when the provider no longer uses it. */
  upstream_status?: string;
};

/** How a non-live provider ID is marked, from bridges.upstream_status. */
function upstreamLabel(status: string | undefined): string {
  if (!status) return "";
  if (status === "retired") return "retired by the provider";
  if (status === "removed") return "removed from the provider's list";
  return `upstream status: ${status}`;
}

// Register files differ by release: bridges.upstream_status arrived in the
// 2026-09-26 release and is gone again from later ones, and later releases name
// an entity in entities.canonical_name instead of entities.label.
const knownColumns = new WeakMap<LocalRegister, Map<string, Promise<boolean>>>();
function hasColumn(register: LocalRegister, table: string, column: string): Promise<boolean> {
  let columns = knownColumns.get(register);
  if (!columns) {
    columns = new Map();
    knownColumns.set(register, columns);
  }
  const key = `${table}.${column}`;
  let known = columns.get(key);
  if (!known) {
    known = register
      .query(
        "SELECT count(*) AS n FROM information_schema.columns WHERE table_name = $table AND column_name = $column",
        { table, column },
      )
      .then((rows) => Number(rows[0]?.n ?? 0) > 0)
      .catch(() => false);
    columns.set(key, known);
  }
  return known;
}
function hasUpstreamStatus(register: LocalRegister): Promise<boolean> {
  return hasColumn(register, "bridges", "upstream_status");
}
type Found = {
  reep_id: string;
  label: string;
  entity_type: string;
  requested_id?: string;
  matched?: string;
  /** The namespace a provider-ID lookup matched in. */
  matched_namespace?: string;
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
  // Later releases ship the file without release_metadata, so its stamp is unknown.
  const hasMetadata = await query(
    "SELECT count(*) AS n FROM information_schema.tables WHERE table_name = 'release_metadata'",
    {},
  );
  const meta =
    Number(hasMetadata[0]?.n ?? 0) > 0
      ? await query("SELECT value FROM release_metadata WHERE key = 'source_stamp'", {})
      : [];
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

/**
 * A Reep ID that was published and is no longer in the register. The redirects
 * table holds these as rows with an empty to_id, next to the merges (which carry
 * the survivor): reason de_corroborated (withdrawn) or withheld.
 */
type Tombstone = { id: string; reason: string; requested_id?: string; matched?: string; /** Where a dangling redirect points. */ target?: string };

/**
 * Follow merge redirects to the survivor (bounded, in case of a chain). A row
 * with an empty to_id is a tombstone, not a merge: stop there. Bridges can name
 * a merged ID too, so every hit goes through this, not only Reep ID lookups.
 */
async function followRedirects(register: LocalRegister, start: string): Promise<{ id: string; tombstone?: Tombstone }> {
  let current = start;
  const seen = new Set([start]);
  for (let hop = 0; hop < 5; hop++) {
    const next = await register.query("SELECT to_id, reason FROM redirects WHERE from_id = $id", { id: current });
    if (!next.length) return { id: current };
    const to = next[0].to_id == null ? "" : String(next[0].to_id).trim();
    if (!to) {
      const reason = next[0].reason == null ? "" : String(next[0].reason).trim();
      return { id: current, tombstone: { id: current, reason, requested_id: current === start ? undefined : start } };
    }
    // A loop has no survivor: report it as withdrawn, as the reep package does.
    if (seen.has(to)) return { id: current, tombstone: { id: start, reason: "redirect_loop" } };
    seen.add(to);
    current = to;
  }
  // Still redirecting after 5 steps (the published ledger is flat, so this
  // should not happen): no survivor was reached.
  return { id: current, tombstone: { id: start, reason: "redirect_loop" } };
}

async function localLookup(
  register: LocalRegister,
  q: Query,
): Promise<{ found: Found[]; tombstone?: Tombstone; tombstones: Tombstone[] }> {
  let ids: Array<{
    reep_id: string;
    requested_id?: string;
    bridge_count?: number;
    matched?: string;
    matched_namespace?: string;
  }> = [];

  const upstream = await hasUpstreamStatus(register);
  const upstreamCol = upstream ? "upstream_status" : "NULL AS upstream_status";
  const labelCol = (await hasColumn(register, "entities", "label")) ? "label" : "canonical_name AS label";

  if (q.kind === "provider") {
    const params: Record<string, string> = { provider: q.provider, id: q.id };
    let sql =
      `SELECT DISTINCT b.reep_id, b.namespace, ${upstream ? "b.upstream_status" : "NULL AS upstream_status"} ` +
      "FROM bridges b JOIN entities e USING (reep_id) WHERE b.provider = $provider AND b.external_id = $id";
    if (q.namespace) {
      sql += " AND b.namespace = $namespace";
      params.namespace = q.namespace;
    }
    if (q.type) {
      sql += " AND e.entity_type = $type";
      params.type = q.type;
    }
    ids = (await register.query(`${sql} LIMIT ${MAX_RESULTS}`, params)).map((r) => {
      // A retired ID still resolves, so stored old IDs keep working; say so.
      const status = upstreamLabel(r.upstream_status == null ? "" : String(r.upstream_status).trim());
      return {
        reep_id: String(r.reep_id),
        matched: `${q.provider} / ${String(r.namespace ?? "")}: ${q.id}${status ? ` (${status})` : ""}`,
        matched_namespace: String(r.namespace ?? ""),
      };
    });
  } else if (q.kind === "reep_id") {
    ids = [{ reep_id: q.reepId }];
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
  const tombstones: Tombstone[] = [];
  const seen = new Set<string>();
  for (const hit of ids) {
    const target = await followRedirects(register, hit.reep_id);
    if (target.tombstone) {
      tombstones.push({ ...target.tombstone, matched: hit.matched });
      continue;
    }
    // Two bridges (or search hits) can lead to the same survivor.
    if (seen.has(target.id)) continue;
    seen.add(target.id);
    const entity = await register.query(`SELECT reep_id, ${labelCol}, entity_type FROM entities WHERE reep_id = $id`, {
      id: target.id,
    });
    if (!entity.length) {
      // A redirect that ends at an ID with no entity in this release has no
      // survivor: report it rather than dropping the hit.
      if (target.id !== hit.reep_id) {
        tombstones.push({ id: hit.reep_id, reason: "target_not_in_release", target: target.id, matched: hit.matched });
      }
      continue;
    }
    // A release can leave a provider ID on a merged Reep ID, not on its survivor,
    // so the survivor's own bridges are incomplete. Add the bridges of every ID
    // merged into it (through chains, bounded), marked with the merged ID.
    const bridges = await register.query(
      [
        "WITH RECURSIVE merged(id, depth) AS (",
        "  SELECT from_id, 1 FROM redirects WHERE to_id = $id",
        "  UNION ALL",
        "  SELECT r.from_id, m.depth + 1 FROM redirects r JOIN merged m ON r.to_id = m.id WHERE m.depth < 5",
        ")",
        `SELECT provider, namespace, external_id, ${upstreamCol}, CASE WHEN reep_id = $id THEN NULL ELSE reep_id END AS via`,
        "FROM bridges WHERE reep_id = $id OR reep_id IN (SELECT id FROM merged)",
        "ORDER BY provider, namespace, external_id, via NULLS FIRST",
      ].join("\n"),
      { id: target.id },
    );
    const own = new Set<string>();
    found.push({
      reep_id: target.id,
      label: String(entity[0].label),
      entity_type: String(entity[0].entity_type),
      requested_id: target.id === hit.reep_id ? undefined : hit.reep_id,
      matched: hit.matched,
      matched_namespace: hit.matched_namespace,
      bridges: bridges
        .map((b) => ({
          provider: String(b.provider),
          namespace: String(b.namespace ?? ""),
          external_id: String(b.external_id),
          via: b.via == null ? undefined : String(b.via),
          upstream_status: b.upstream_status == null ? undefined : String(b.upstream_status).trim() || undefined,
        }))
        .filter((b) => {
          // The survivor's own bridge wins over the same provider ID on a merged ID.
          const key = `${b.provider}\u0000${b.namespace}\u0000${b.external_id}`;
          if (own.has(key)) return false;
          own.add(key);
          return true;
        })
        // Live provider IDs first: those are the ones to map to.
        .sort((x, y) => Number(Boolean(x.upstream_status)) - Number(Boolean(y.upstream_status))),
    });
  }
  if (q.kind === "reep_id" && tombstones.length) return { found: [], tombstone: tombstones[0], tombstones };
  return { found, tombstones };
}

/** What a tombstone means, from the redirects table's published schema note. */
function tombstoneText(t: Tombstone): string {
  const matched = t.matched ? `${t.matched} points at ${t.requested_id ?? t.id}. ` : "";
  const via = t.requested_id ? `${t.requested_id} was merged into ${t.id}, and ` : "";
  const what =
    t.reason === "de_corroborated"
      ? "is withdrawn (reason: de_corroborated). It was in an earlier release, and this release no longer admits it " +
        "because its corroboration fell below the register's threshold."
      : t.reason === "withheld"
        ? "is withheld (reason: withheld). It is a live, corroborated ID that a publication rule (for example named " +
          "teams or the season horizon) keeps out of this release."
        : t.reason === "redirect_loop"
          ? "is withdrawn (reason: redirect_loop). Its redirects form a loop, or never reach a survivor."
          : t.reason === "target_not_in_release"
            ? `is withdrawn: it redirects to ${t.target ?? "an ID"}, which has no entity in this release.`
            : `has a tombstone in the redirects table (reason: ${t.reason || "none given"}) with no survivor.`;
  return (
    `${matched}${via}Reep ID ${t.id} ${what} There is no survivor ID. Do not treat it as an unknown ID: ` +
    "it was published, and the ID will never be reused."
  );
}

/**
 * A provider-ID lookup without a namespace. Reep keys bridges on (provider,
 * namespace, external_id), and providers reuse numbers across entity types, so
 * a single match can still be the wrong kind of entity.
 */
function namespaceNote(q: Query, found: Found[]): string {
  if (q.kind !== "provider" || q.namespace || !found.length) return "";
  const namespaces = [...new Set(found.map((f) => f.matched_namespace).filter((n): n is string => Boolean(n)))];
  if (namespaces.length > 1) {
    return (
      `\n\n**No namespace was given, and this ID matches in ${namespaces.length} namespaces.** ${q.provider} reuses ` +
      "numbers across entity types. Pass namespace to pick the one you mean."
    );
  }
  if (q.type) return "";
  const where = namespaces.length ? ` It matched only in namespace "${namespaces[0]}".` : "";
  return (
    `\n\n**No namespace was given.**${where} Reep keys provider IDs on provider, namespace and ID, and ` +
    `${q.provider} may use the same number for different kinds of entity. Pass namespace (or type) to be sure this ` +
    "is the entity you meant."
  );
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
  if (local === null) {
    return (
      `The local register file does not record its release (it has no release_metadata table); the current ` +
      `release is ${current}. If the file was downloaded before that release, update it:\n${update}`
    );
  }
  return (
    `**The local register is out of date.** Local release: ${local}; current release: ${current}. ` +
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
  if (response.status === 404) {
    // Keep the API's own error code and message: a removed entity leaves a
    // tombstone, and "not found" alone would hide that it was ever published.
    const error = (await response.json().catch(() => null)) as { error?: string; message?: string; detail?: string } | null;
    const why = [error?.error, error?.message, error?.detail].filter(Boolean).join(": ");
    return textResult(`No Reep entity matches that query${why ? ` (${why})` : ""}.${footer ? `\n\n${footer}` : ""}`);
  }

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
  if (q.kind === "provider") {
    for (const f of found) {
      f.matched_namespace = f.bridges?.find((b) => b.provider === q.provider && b.external_id === q.id)?.namespace;
    }
  }
  const hint =
    q.kind === "name" ? "\n\nSearch results carry no provider IDs. Call again with reep_id to get every provider ID." : "";
  return textResult(
    `Found ${found.length} result(s) via the Reep API:\n\n${formatFound(found)}${hint}${namespaceNote(q, found)}${footer ? `\n\n${footer}` : ""}`,
  );
}

// ---------------------------------------------------------------------------
// Source 3: neither configured

function sqlFor(q: Query): string {
  const quote = (s: string) => `'${s.replace(/'/g, "''")}'`;
  if (q.kind === "provider") {
    return [
      "-- A bridge can name a merged Reep ID: follow its redirect to the survivor. An empty",
      "-- to_id is a tombstone (the ID was withdrawn or withheld), not a merge.",
      "SELECT b.reep_id AS bridged_id, r.reason AS redirect_reason, e.reep_id, e.canonical_name, e.entity_type,",
      "       o.provider, o.namespace, o.external_id",
      "FROM bridges b",
      "LEFT JOIN redirects r ON r.from_id = b.reep_id",
      "JOIN entities e ON e.reep_id = coalesce(nullif(r.to_id, ''), b.reep_id)",
      "-- The survivor's provider IDs, plus any still attached to an ID merged into it.",
      "JOIN bridges o ON o.reep_id = e.reep_id OR o.reep_id IN (SELECT from_id FROM redirects WHERE to_id = e.reep_id)",
      `WHERE b.provider = ${quote(q.provider)}${q.namespace ? ` AND b.namespace = ${quote(q.namespace)}` : ""}`,
      `  AND b.external_id = ${quote(q.id)}`,
      "ORDER BY o.provider, o.namespace;",
    ].join("\n");
  }
  if (q.kind === "reep_id") {
    return [
      "-- First check for a tombstone: a redirect with an empty to_id means the ID was withdrawn",
      "-- or withheld, not merged.",
      `SELECT from_id, to_id, reason FROM redirects WHERE from_id = ${quote(q.reepId)};`,
      "",
      "-- Then follow a merge redirect to the survivor, and list every provider ID, including",
      "-- any still attached to an ID merged into it (bridged_on names that ID).",
      "SELECT e.reep_id, e.canonical_name, e.entity_type, b.provider, b.namespace, b.external_id, b.reep_id AS bridged_on",
      "FROM entities e",
      "JOIN bridges b ON b.reep_id = e.reep_id OR b.reep_id IN (SELECT from_id FROM redirects WHERE to_id = e.reep_id)",
      `WHERE e.reep_id = coalesce((SELECT nullif(to_id, '') FROM redirects WHERE from_id = ${quote(q.reepId)}), ${quote(q.reepId)})`,
      `  AND NOT EXISTS (SELECT 1 FROM redirects WHERE from_id = ${quote(q.reepId)} AND coalesce(to_id, '') = '')`,
      "ORDER BY b.provider, b.namespace;",
    ].join("\n");
  }
  return [
    "SELECT reep_id, canonical_name, entity_type, bridge_count",
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
    "Meanwhile, this query answers the question against the downloaded file (duckdb reep-register.duckdb):",
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
          const via = b.via ? ` (via merged ${b.via})` : "";
          const status = upstreamLabel(b.upstream_status);
          lines.push(
            `  ${b.provider}${b.namespace ? ` / ${b.namespace}` : ""}: ${b.external_id}${role}${via}${status ? ` (${status})` : ""}`,
          );
        }
        if (f.bridges.some((b) => b.upstream_status)) {
          lines.push(
            "  Provider IDs marked retired or removed are no longer in use at that provider. They still resolve, " +
              "but map to the unmarked ones.",
          );
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
      const { found, tombstone, tombstones } = await localLookup(register, q);
      const note = await freshnessNote(path, register.stamp, fetchImpl);
      if (tombstone) return textResult(`${tombstoneText(tombstone)}\n\n${note}`);
      const gone = tombstones.map((t) => tombstoneText(t)).join("\n\n");
      if (!found.length) {
        return textResult(`${gone || "No Reep entity matches that query in the local register."}\n\n${note}`);
      }
      return textResult(
        `Found ${found.length} result(s) in the local Reep register:\n\n${formatFound(found)}${namespaceNote(q, found)}` +
          `${gone ? `\n\n${gone}` : ""}\n\n${note}`,
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
