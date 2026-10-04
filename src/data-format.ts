/**
 * The on-disk format of the docs index, shared by ingest and the server.
 *
 * The index can reach a server two ways: inside the npm package, or downloaded
 * later from the data-latest release (see data-update.ts). Both paths must agree
 * on what a usable file looks like, so the schema, the metadata keys and the
 * validation all live here.
 */

import { z } from "zod";
import { type Database, openDatabase, pragmaValue, transaction } from "./sqlite.js";

/** Bump when the table layout changes. Servers only use data with their own version. */
export const DATA_SCHEMA_VERSION = 1;

/**
 * The oldest server release that can read data built by this code. Raise it when
 * the data starts to rely on server code that older releases lack (a new field in
 * providers.json the tools must read, for example), and release that server first.
 */
export const MIN_SERVER_VERSION = "0.13.0";

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    source_type TEXT NOT NULL DEFAULT 'curated',
    upstream_version TEXT,
    crawled_at TEXT
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS docs_fts USING fts5(
    provider,
    category,
    title,
    content,
    content='docs',
    content_rowid='id',
    tokenize='porter unicode61'
  );

  CREATE TRIGGER IF NOT EXISTS docs_ai AFTER INSERT ON docs BEGIN
    INSERT INTO docs_fts(rowid, provider, category, title, content)
    VALUES (new.id, new.provider, new.category, new.title, new.content);
  END;

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`;

const providerSourceSchema = z.looseObject({
  url: z.string().optional(),
  type: z.string(),
  note: z.string().optional(),
});

const providerEntrySchema = z.looseObject({
  description: z.string(),
  display_name: z.string(),
  aliases: z.array(z.string()),
  access_level: z.string(),
  licence_status: z.string(),
  public_safety_notes: z.string(),
  version: z.string().nullable(),
  sources: z.array(providerSourceSchema),
  last_crawled: z.string().nullable(),
});

/** A provider that was assessed and is not indexed, with the reason. */
const notIndexedEntrySchema = z.looseObject({
  display_name: z.string(),
  aliases: z.array(z.string()),
  reason: z.string(),
});

export const providersFileSchema = z.looseObject({
  providers: z.record(z.string(), providerEntrySchema),
  not_indexed: z.record(z.string(), notIndexedEntrySchema).optional(),
});

export type ProvidersFile = z.infer<typeof providersFileSchema>;
export type ProviderRegistryEntry = z.infer<typeof providerEntrySchema>;

export interface DataMeta {
  schemaVersion: number;
  minServerVersion: string;
  /** ISO-8601 time of the source commit. */
  dataStamp: string;
  /** dataStamp as epoch milliseconds; compare this, never the string. */
  stampMs: number;
  commit: string | null;
  providers: ProvidersFile;
}

/** Compare two x.y.z versions; a pre-release suffix is ignored. */
export function compareVersions(a: string, b: string): number {
  const parts = (version: string) =>
    version
      .split("-")[0]
      .split(".")
      .map((part) => Number.parseInt(part, 10) || 0);
  const [left, right] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i += 1) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff !== 0) return Math.sign(diff);
  }
  return 0;
}

function hasMetaTable(db: Database): boolean {
  return Boolean(
    db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'meta'").get(),
  );
}

/**
 * Read and check the meta table. Returns null when the file predates the table
 * (older releases, and the in-memory databases some tests build).
 */
export function readMeta(db: Database): DataMeta | null {
  if (!hasMetaTable(db)) return null;
  const rows = db.prepare("SELECT key, value FROM meta").all() as Array<{ key: string; value: string }>;
  const values = new Map(rows.map((row) => [row.key, row.value]));

  const schemaVersion = Number.parseInt(values.get("schema_version") ?? "", 10);
  const minServerVersion = values.get("min_server_version") ?? "";
  const dataStamp = values.get("data_stamp") ?? "";
  const stampMs = Date.parse(dataStamp);
  if (!Number.isInteger(schemaVersion)) throw new Error("meta.schema_version is missing or not an integer");
  if (!/^\d+\.\d+\.\d+/.test(minServerVersion)) throw new Error("meta.min_server_version is missing");
  if (!Number.isFinite(stampMs)) throw new Error("meta.data_stamp is missing or not a date");

  let providersJson: unknown;
  try {
    providersJson = JSON.parse(values.get("providers_json") ?? "");
  } catch {
    throw new Error("meta.providers_json is not JSON");
  }
  const providers = providersFileSchema.safeParse(providersJson);
  if (!providers.success) throw new Error("meta.providers_json does not match the provider registry format");

  return {
    schemaVersion,
    minServerVersion,
    dataStamp,
    stampMs,
    commit: values.get("commit") || null,
    providers: providers.data,
  };
}

export interface MetaInput {
  dataStamp: string;
  commit: string | null;
  providersJson: string;
  /** metrics/cards.json, when the build has metric cards. Servers before 0.17 ignore the key. */
  metricCardsJson?: string;
}

/** Replace the meta table's contents. Used by ingest. */
export function writeMeta(db: Database, input: MetaInput): void {
  const insert = db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)");
  transaction(db, () => {
    db.prepare("DELETE FROM meta").run();
    insert.run("schema_version", String(DATA_SCHEMA_VERSION));
    insert.run("min_server_version", MIN_SERVER_VERSION);
    insert.run("data_stamp", new Date(input.dataStamp).toISOString());
    if (input.commit) insert.run("commit", input.commit);
    insert.run("providers_json", input.providersJson);
    if (input.metricCardsJson) insert.run("metric_cards", input.metricCardsJson);
  });
}

type SchemaRow = { type: string; name: string; tbl_name: string; sql: string | null };

/** FTS5's internal tables. Their SQL is written by SQLite, not by us. */
const FTS_SHADOW_TABLE = /^docs_fts_(data|idx|content|docsize|config)$/;

/**
 * The schema as comparable rows. The objects SCHEMA_SQL defines are compared
 * exactly; the FTS5 shadow tables by name and type only, because users' installs
 * may build a different SQLite whose FTS5 writes their SQL differently.
 */
function schemaRows(db: Database): SchemaRow[] {
  return (
    db
      .prepare("SELECT type, name, tbl_name, sql FROM sqlite_master ORDER BY type, name")
      .all() as SchemaRow[]
  )
    .filter((row) => row.name !== "sqlite_sequence")
    .map((row) => (FTS_SHADOW_TABLE.test(row.name) ? { ...row, sql: null } : row));
}

let referenceSchema: string | undefined;

/** The exact sqlite_master rows a database built from SCHEMA_SQL has. */
function expectedSchema(): string {
  if (!referenceSchema) {
    const reference = openDatabase(":memory:");
    reference.exec(SCHEMA_SQL);
    referenceSchema = JSON.stringify(schemaRows(reference));
    reference.close();
  }
  return referenceSchema;
}

/** Settings for any docs database this process opens, bundled or downloaded. */
export function hardenConnection(db: Database): void {
  db.exec("PRAGMA trusted_schema = OFF");
  db.exec("PRAGMA cell_size_check = ON");
}

export type ValidationResult =
  | { ok: true; meta: DataMeta }
  | { ok: false; reason: string };

/**
 * Decide whether a file is a docs index this server can use: the exact schema,
 * a supported schema version, a minimum server version it meets, a valid provider
 * registry and at least one chunk. `integrity` adds a full quick_check, used for
 * freshly downloaded files.
 */
export function validateDatabase(
  path: string,
  serverVersion: string,
  options: { integrity?: boolean } = {},
): ValidationResult {
  let db: Database | undefined;
  try {
    db = openDatabase(path, { readonly: true });
    hardenConnection(db);

    if (options.integrity) {
      const check = pragmaValue(db, "quick_check");
      if (check !== "ok") return { ok: false, reason: `integrity check failed (${String(check)})` };
    }
    if (JSON.stringify(schemaRows(db)) !== expectedSchema()) {
      return { ok: false, reason: "schema does not match this server's schema" };
    }

    const meta = readMeta(db);
    if (!meta) return { ok: false, reason: "no meta table" };
    if (meta.schemaVersion !== DATA_SCHEMA_VERSION) {
      return { ok: false, reason: `schema version ${meta.schemaVersion}, server reads ${DATA_SCHEMA_VERSION}` };
    }
    if (compareVersions(serverVersion, meta.minServerVersion) < 0) {
      return { ok: false, reason: `needs server ${meta.minServerVersion} or newer (this is ${serverVersion})` };
    }
    if (!db.prepare("SELECT 1 FROM docs LIMIT 1").get()) return { ok: false, reason: "no chunks" };

    return { ok: true, meta };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  } finally {
    db?.close();
  }
}
