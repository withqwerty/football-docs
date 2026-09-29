import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  compareVersions,
  DATA_SCHEMA_VERSION,
  MIN_SERVER_VERSION,
  readMeta,
  SCHEMA_SQL,
  validateDatabase,
  writeMeta,
} from "../data-format.js";
import { cachedFileName, cleanDataDir, dataModeFor, IndexChooser, selectDatabase } from "../data-source.js";
import { checkForUpdate, MANIFEST_NAME } from "../data-update.js";
import { listProviders, resolveProviderId } from "../tools.js";

const ROOT = resolve(import.meta.dirname, "..", "..");
const PROVIDERS_JSON = readFileSync(resolve(ROOT, "providers.json"), "utf-8");
const SERVER = MIN_SERVER_VERSION;
const BASE = "https://example.test/data/";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "football-docs-data-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

interface BuildOptions {
  stamp: string;
  schemaVersion?: string;
  minServer?: string;
  providersJson?: string;
  extraSql?: string;
  rows?: number;
}

function buildDb(path: string, options: BuildOptions): string {
  const db = new Database(path);
  db.exec(SCHEMA_SQL);
  const insert = db.prepare(
    "INSERT INTO docs (provider, category, title, content, source_type) VALUES (?, ?, ?, ?, 'curated')",
  );
  for (let i = 0; i < (options.rows ?? 1); i += 1) {
    insert.run("opta", "event-types", `Title ${i}`, `Stamp ${options.stamp} chunk ${i}`);
  }
  writeMeta(db, { dataStamp: options.stamp, commit: "abc1234def", providersJson: options.providersJson ?? PROVIDERS_JSON });
  if (options.schemaVersion) db.prepare("UPDATE meta SET value = ? WHERE key = 'schema_version'").run(options.schemaVersion);
  if (options.minServer) db.prepare("UPDATE meta SET value = ? WHERE key = 'min_server_version'").run(options.minServer);
  if (options.extraSql) db.exec(options.extraSql);
  db.pragma("journal_mode = DELETE");
  db.close();
  return path;
}

const ms = (iso: string) => Date.parse(iso);

describe("data format", () => {
  it("compares versions numerically", () => {
    expect(compareVersions("0.13.0", "0.12.4")).toBe(1);
    expect(compareVersions("0.9.1", "0.10.0")).toBe(-1);
    expect(compareVersions("1.0.0-beta.1", "1.0.0")).toBe(0);
  });

  it("accepts a database built from the schema, including its insert trigger", () => {
    const path = buildDb(join(dir, "ok.db"), { stamp: "2026-09-29T07:00:00Z" });
    const result = validateDatabase(path, SERVER);
    expect(result).toMatchObject({ ok: true });
    if (result.ok) {
      expect(result.meta.schemaVersion).toBe(DATA_SCHEMA_VERSION);
      expect(result.meta.stampMs).toBe(ms("2026-09-29T07:00:00Z"));
    }
  });

  it.each([
    ["an extra trigger", { extraSql: "CREATE TRIGGER extra AFTER INSERT ON meta BEGIN SELECT 1; END;" }, "schema"],
    ["an extra column", { extraSql: "ALTER TABLE docs ADD COLUMN extra TEXT;" }, "schema"],
    ["another schema version", { schemaVersion: "2" }, "schema version 2"],
    ["a newer minimum server", { minServer: "99.0.0" }, "needs server 99.0.0"],
    ["an invalid registry", { providersJson: JSON.stringify({ providers: { opta: { aliases: "x" } } }) }, "registry"],
    ["no chunks", { rows: 0 }, "no chunks"],
  ])("rejects a database with %s", (_label, options, reason) => {
    const path = buildDb(join(dir, "bad.db"), { stamp: "2026-09-29T07:00:00Z", ...options });
    const result = validateDatabase(path, SERVER);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain(reason);
  });

  it("rejects a file that is not SQLite", () => {
    const path = join(dir, "junk.db");
    writeFileSync(path, "not a database");
    expect(validateDatabase(path, SERVER, { integrity: true }).ok).toBe(false);
  });
});

describe("the committed index", () => {
  const db = new Database(resolve(ROOT, "data", "docs.db"), { readonly: true });

  it("records the current provider registry and is not in WAL mode", () => {
    const meta = db.prepare("SELECT value FROM meta WHERE key = 'providers_json'").get() as { value: string };
    expect(meta.value).toBe(PROVIDERS_JSON);
    expect(db.pragma("journal_mode", { simple: true })).toBe("delete");
    expect(readMeta(db)?.schemaVersion).toBe(DATA_SCHEMA_VERSION);
  });
});

describe("registry", () => {
  it("comes from the database's meta table", () => {
    const registry = JSON.parse(PROVIDERS_JSON);
    registry.providers.opta.aliases = [...registry.providers.opta.aliases, "only-in-this-build"];
    const path = buildDb(join(dir, "registry.db"), {
      stamp: "2026-09-29T07:00:00Z",
      providersJson: JSON.stringify(registry),
    });
    const db = new Database(path, { readonly: true });
    const text = resolveProviderId(db, { query: "only-in-this-build" }).content[0].text;
    db.close();
    expect(text).toContain("provider ID: **opta**");
  });

  it("falls back to the packaged providers.json for a database without meta", () => {
    const db = new Database(":memory:");
    db.exec("CREATE TABLE docs (id INTEGER PRIMARY KEY, provider TEXT, category TEXT, title TEXT, content TEXT)");
    const text = resolveProviderId(db, { query: "Stats Perform" }).content[0].text;
    const list = listProviders(db).content[0].text;
    db.close();
    expect(text).toContain("provider ID: **opta**");
    expect(list).toContain("Data: built before data stamps were recorded.");
  });

  it("names the data stamp and source in list_providers", () => {
    const path = buildDb(join(dir, "stamp.db"), { stamp: "2026-09-29T07:00:00Z" });
    const db = new Database(path, { readonly: true });
    const text = listProviders(db, { source: "downloaded" }).content[0].text;
    db.close();
    expect(text).toContain("Data: built 2026-09-29T07:00:00.000Z from commit abc1234 (downloaded).");
  });
});

describe("choosing the index", () => {
  const bundledStamp = "2026-09-20T00:00:00Z";
  let bundled: string;
  let dataDir: string;
  const cache = (stamp: string, options: Partial<BuildOptions> = {}) =>
    buildDb(join(dataDir, cachedFileName(ms(stamp))), { stamp, ...options });
  const choose = (extra: { mode?: "auto" | "bundled"; pinnedPath?: string } = {}) =>
    selectDatabase({ bundledPath: bundled, dataDir, serverVersion: SERVER, mode: extra.mode ?? "auto", pinnedPath: extra.pinnedPath });

  beforeEach(() => {
    bundled = buildDb(join(dir, "bundled.db"), { stamp: bundledStamp });
    dataDir = join(dir, "data");
    mkdirSync(dataDir);
  });

  it("uses the bundled index when nothing is cached", () => {
    expect(choose()).toMatchObject({ path: bundled, source: "bundled" });
  });

  it("uses a newer cached index", () => {
    const newer = cache("2026-09-25T00:00:00Z");
    expect(choose()).toMatchObject({ path: newer, source: "downloaded" });
  });

  it("ignores an older cached index, for example after an npm upgrade", () => {
    cache("2026-09-10T00:00:00Z");
    expect(choose().source).toBe("bundled");
  });

  it("prefers the bundled index on a tie", () => {
    cache(bundledStamp);
    expect(choose().source).toBe("bundled");
  });

  it("skips a newer cached index it cannot use and takes the next one", () => {
    cache("2026-09-28T00:00:00Z", { schemaVersion: "2" });
    const usable = cache("2026-09-26T00:00:00Z");
    expect(choose().path).toBe(usable);
  });

  it("skips a cached file whose name does not match its stamp", () => {
    buildDb(join(dataDir, cachedFileName(ms("2026-09-28T00:00:00Z"))), { stamp: "2026-09-27T00:00:00Z" });
    expect(choose().source).toBe("bundled");
  });

  it("ignores the cache in bundled mode", () => {
    cache("2026-09-25T00:00:00Z");
    expect(choose({ mode: "bundled" }).source).toBe("bundled");
  });

  it("uses a pinned file, and refuses one it cannot validate", () => {
    const pinned = buildDb(join(dir, "pinned.db"), { stamp: "2026-09-01T00:00:00Z" });
    expect(choose({ pinnedPath: pinned })).toMatchObject({ path: pinned, source: "pinned" });
    const bad = buildDb(join(dir, "pinned-bad.db"), { stamp: "2026-09-01T00:00:00Z", schemaVersion: "9" });
    expect(() => choose({ pinnedPath: bad })).toThrow(/cannot be used/);
  });

  it("picks up a newer file added after the first choice, as another server's download", () => {
    const chooser = new IndexChooser({ bundledPath: bundled, dataDir, serverVersion: SERVER, mode: "auto" });
    expect(chooser.current().source).toBe("bundled");
    const newer = cache("2026-09-25T00:00:00Z");
    expect(chooser.current().path).toBe(newer);
    const newest = cache("2026-09-27T00:00:00Z");
    expect(chooser.current().path).toBe(newest);
  });

  it("chooses again when the chosen file disappears", () => {
    const older = cache("2026-09-25T00:00:00Z");
    const newer = cache("2026-09-27T00:00:00Z");
    const chooser = new IndexChooser({ bundledPath: bundled, dataDir, serverVersion: SERVER, mode: "auto" });
    expect(chooser.current().path).toBe(newer);
    rmSync(newer);
    expect(chooser.current().path).toBe(older);
  });

  it("does not validate an unusable newer file on every call", () => {
    const chooser = new IndexChooser({ bundledPath: bundled, dataDir, serverVersion: SERVER, mode: "auto" });
    cache("2026-09-28T00:00:00Z", { schemaVersion: "2" });
    const first = chooser.current();
    expect(first.source).toBe("bundled");
    expect(chooser.current()).toBe(first);
  });

  it("defaults to bundled mode in a git checkout and auto mode in an installed package", () => {
    expect(dataModeFor({}, ROOT)).toBe("bundled");
    expect(dataModeFor({}, dir)).toBe("auto");
    expect(dataModeFor({ FOOTBALL_DOCS_DATA: "auto" }, ROOT)).toBe("auto");
    expect(dataModeFor({ FOOTBALL_DOCS_DATA: "bundled" }, dir)).toBe("bundled");
  });

  it("cleans up stale temporary files and week-old superseded indexes only", () => {
    const now = ms("2026-10-10T00:00:00Z");
    const old = cache("2026-09-21T00:00:00Z");
    const recentOld = cache("2026-09-22T00:00:00Z");
    const active = cache("2026-09-25T00:00:00Z");
    const staleTemp = join(dataDir, "tmp-1-aa.db");
    const freshTemp = join(dataDir, "tmp-2-bb.db");
    writeFileSync(staleTemp, "x");
    writeFileSync(freshTemp, "x");
    const set = (path: string, iso: string) => utimesSync(path, new Date(iso), new Date(iso));
    set(old, "2026-09-21T00:00:00Z");
    set(recentOld, "2026-10-08T00:00:00Z");
    set(staleTemp, "2026-10-09T00:00:00Z");
    set(freshTemp, "2026-10-09T23:30:00Z");

    cleanDataDir(dataDir, ms("2026-09-25T00:00:00Z"), now);
    expect(existsSync(old)).toBe(false);
    expect(existsSync(recentOld)).toBe(true);
    expect(existsSync(active)).toBe(true);
    expect(existsSync(staleTemp)).toBe(false);
    expect(existsSync(freshTemp)).toBe(true);
  });
});

describe("checking for updates", () => {
  const newStamp = "2026-09-29T07:00:00Z";
  let dataDir: string;
  let file: Buffer;
  let manifest: Record<string, unknown>;
  let requests: string[];
  let logs: string[];

  const fakeFetch = (overrides: { manifestStatus?: number; body?: Buffer; throwOn?: string } = {}) =>
    (async (input: string | URL | Request) => {
      const url = String(input);
      requests.push(url);
      if (overrides.throwOn && url.endsWith(overrides.throwOn)) throw new TypeError("fetch failed");
      if (url.endsWith(MANIFEST_NAME)) {
        return new Response(JSON.stringify(manifest), { status: overrides.manifestStatus ?? 200 });
      }
      return new Response(overrides.body ?? file, { status: 200 });
    }) as typeof fetch;

  const run = (overrides: Parameters<typeof fakeFetch>[0] = {}, extra: Partial<Parameters<typeof checkForUpdate>[0]> = {}) =>
    checkForUpdate({
      dataDir,
      serverVersion: SERVER,
      currentStampMs: ms("2026-09-20T00:00:00Z"),
      baseUrl: BASE,
      env: {},
      fetch: fakeFetch(overrides),
      now: () => ms("2026-09-29T12:00:00Z"),
      log: (message) => logs.push(message),
      ...extra,
    });

  beforeEach(() => {
    dataDir = join(dir, "data");
    const source = buildDb(join(dir, "published.db"), { stamp: newStamp, rows: 3 });
    file = readFileSync(source);
    manifest = {
      schema_version: DATA_SCHEMA_VERSION,
      min_server_version: MIN_SERVER_VERSION,
      data_stamp: new Date(newStamp).toISOString(),
      commit: "abc1234def",
      file: cachedFileName(ms(newStamp)),
      sha256: createHash("sha256").update(file).digest("hex"),
      size: file.length,
    };
    requests = [];
    logs = [];
  });

  const installed = () => readdirSync(dataDir).filter((name) => name.startsWith("docs-"));
  const temps = () => readdirSync(dataDir).filter((name) => name.startsWith("tmp-"));
  const checked = () => existsSync(join(dataDir, "state.json"));

  it("downloads, verifies and installs a newer index", async () => {
    const result = await run();
    expect(result.outcome).toBe("installed");
    expect(installed()).toEqual([cachedFileName(ms(newStamp))]);
    expect(temps()).toEqual([]);
    expect(checked()).toBe(true);
    expect(requests).toEqual([`${BASE}${MANIFEST_NAME}`, `${BASE}${cachedFileName(ms(newStamp))}`]);
  });

  it("does nothing when the published index is not newer", async () => {
    const result = await run({}, { currentStampMs: ms(newStamp) });
    expect(result.outcome).toBe("up-to-date");
    expect(requests).toHaveLength(1);
    expect(checked()).toBe(true);
  });

  it("checks at most once a day, and never under CI", async () => {
    await run({}, { currentStampMs: ms(newStamp) });
    expect((await run()).outcome).toBe("skipped-recent");
    expect((await run({}, { env: { CI: "true" } })).outcome).toBe("skipped-ci");
    expect(requests).toHaveLength(1);
  });

  it("records a missing manifest as a completed check", async () => {
    expect((await run({ manifestStatus: 404 })).outcome).toBe("not-published");
    expect(checked()).toBe(true);
  });

  it("does not record a network failure, so the next start tries again", async () => {
    expect((await run({ throwOn: MANIFEST_NAME })).outcome).toBe("failed");
    expect(checked()).toBe(false);
    expect(logs.join("\n")).toContain("could not check for newer docs");
  });

  it.each([
    ["a hash mismatch", () => ({ body: Buffer.concat([file.subarray(0, -1), Buffer.from([file.at(-1)! ^ 1])]) }), "SHA-256"],
    ["a size mismatch", () => ({ body: file.subarray(0, 4096) }), "size"],
  ])("rejects %s and keeps nothing", async (_label, overrides, reason) => {
    const result = await run(overrides());
    expect(result).toMatchObject({ outcome: "rejected" });
    expect(result.detail).toContain(reason);
    expect(installed()).toEqual([]);
    expect(temps()).toEqual([]);
  });

  it("stops a download over the size cap", async () => {
    const result = await run({}, { maxBytes: 1024 });
    expect(result.outcome).toBe("failed");
    expect(result.detail).toContain("larger than");
    expect(installed()).toEqual([]);
    expect(temps()).toEqual([]);
  });

  it("rejects a file that fails validation even when the manifest matches it", async () => {
    const bad = buildDb(join(dir, "bad.db"), { stamp: newStamp, extraSql: "CREATE VIEW v AS SELECT 1;" });
    file = readFileSync(bad);
    manifest.sha256 = createHash("sha256").update(file).digest("hex");
    manifest.size = file.length;
    const result = await run();
    expect(result.outcome).toBe("rejected");
    expect(result.detail).toContain("schema");
    expect(installed()).toEqual([]);
  });

  it("rejects a file whose stamp differs from the manifest", async () => {
    manifest.data_stamp = "2026-09-29T08:00:00.000Z";
    manifest.file = cachedFileName(ms("2026-09-29T08:00:00Z"));
    expect((await run()).detail).toContain("data_stamp");
  });

  it.each([
    ["another schema version", { schema_version: 2 }, "schema version 2"],
    ["a newer minimum server", { min_server_version: "99.0.0" }, "needs server 99.0.0"],
  ])("skips a manifest with %s without downloading", async (_label, change, detail) => {
    Object.assign(manifest, change);
    const result = await run();
    expect(result).toMatchObject({ outcome: "rejected", detail });
    expect(requests).toHaveLength(1);
  });

  it("refuses a non-HTTPS base URL", async () => {
    const result = await run({}, { baseUrl: "http://example.test/data/" });
    expect(result.outcome).toBe("failed");
    expect(result.detail).toContain("non-HTTPS");
  });

  it("keeps an index another process installed first", async () => {
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(join(dataDir, cachedFileName(ms(newStamp))), file);
    const result = await run();
    expect(result.outcome).toBe("installed");
    expect(requests).toHaveLength(1);
  });

  it("installs a file the server then chooses", async () => {
    const bundled = buildDb(join(dir, "bundled.db"), { stamp: "2026-09-20T00:00:00Z" });
    await run();
    expect(
      selectDatabase({ bundledPath: bundled, dataDir, serverVersion: SERVER, mode: "auto" }),
    ).toMatchObject({ source: "downloaded" });
  });
});
