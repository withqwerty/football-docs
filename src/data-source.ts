/**
 * Which docs index the server opens.
 *
 * The npm package ships an index, and data-update.ts can download newer ones
 * into the data directory. The server uses the newest file it can validate.
 * Downloaded files are named by stamp and never overwritten, so several server
 * processes can share the directory without replacing a file another one reads.
 */

import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { type DataMeta, validateDatabase } from "./data-format.js";

export type DataMode = "auto" | "bundled";

export interface DataSourceOptions {
  /** The index inside the npm package. */
  bundledPath: string;
  /** Where downloaded indexes live. */
  dataDir: string;
  /** This server's package version, checked against each file's min_server_version. */
  serverVersion: string;
  mode: DataMode;
  /** FOOTBALL_DOCS_DB_PATH: use exactly this file. */
  pinnedPath?: string;
  log?: (message: string) => void;
}

export interface DataSelection {
  path: string;
  source: "bundled" | "downloaded" | "pinned";
  meta: DataMeta | null;
}

const CACHED_FILE = /^docs-(\d+)\.db$/;
const TEMP_FILE = /^tmp-.*\.db$/;
const SIDE_FILES = ["", "-journal", "-wal", "-shm"];
/** Another running server may still use a recent older file, so keep it this long. */
const OLD_FILE_GRACE_MS = 7 * 24 * 60 * 60 * 1000;
const TEMP_FILE_GRACE_MS = 60 * 60 * 1000;

export function defaultDataDir(env: NodeJS.ProcessEnv = process.env): string {
  return resolve(env.XDG_DATA_HOME ?? resolve(homedir(), ".local", "share"), "football-docs", "data");
}

/**
 * FOOTBALL_DOCS_DATA picks the mode. Without it, a server running from a git
 * checkout uses its own bundled file, so development and tests always see the
 * working tree's docs and never touch the network or the user's cache.
 */
export function dataModeFor(env: NodeJS.ProcessEnv, packageRoot: string): DataMode {
  const setting = env.FOOTBALL_DOCS_DATA?.trim().toLowerCase();
  if (setting === "auto" || setting === "bundled") return setting;
  return existsSync(join(packageRoot, ".git")) ? "bundled" : "auto";
}

export function cachedFileName(stampMs: number): string {
  return `docs-${stampMs}.db`;
}

/** Downloaded files, newest first. */
function cachedFiles(dataDir: string): Array<{ path: string; stampMs: number }> {
  if (!existsSync(dataDir)) return [];
  return readdirSync(dataDir)
    .map((name) => ({ name, match: CACHED_FILE.exec(name) }))
    .filter((entry): entry is { name: string; match: RegExpExecArray } => entry.match !== null)
    .map((entry) => ({ path: join(dataDir, entry.name), stampMs: Number(entry.match[1]) }))
    .sort((a, b) => b.stampMs - a.stampMs);
}

/**
 * Choose the index to open. The newest valid file wins; on a tie the bundled
 * file wins. If the bundled file fails validation (an index built before the
 * meta table existed, in a development checkout) it is still the fallback, so
 * the server behaves as it did before downloads existed.
 */
export function selectDatabase(options: DataSourceOptions): DataSelection {
  const log = options.log ?? (() => {});

  if (options.pinnedPath) {
    const result = validateDatabase(options.pinnedPath, options.serverVersion);
    if (!result.ok) {
      throw new Error(`FOOTBALL_DOCS_DB_PATH ${options.pinnedPath} cannot be used: ${result.reason}`);
    }
    return { path: options.pinnedPath, source: "pinned", meta: result.meta };
  }

  const bundled = validateDatabase(options.bundledPath, options.serverVersion);
  const bundledSelection: DataSelection = {
    path: options.bundledPath,
    source: "bundled",
    meta: bundled.ok ? bundled.meta : null,
  };
  if (options.mode === "bundled") return bundledSelection;

  const bundledStamp = bundled.ok ? bundled.meta.stampMs : Number.NEGATIVE_INFINITY;
  for (const file of cachedFiles(options.dataDir)) {
    if (file.stampMs <= bundledStamp) break;
    const result = validateDatabase(file.path, options.serverVersion);
    if (result.ok && result.meta.stampMs === file.stampMs) {
      return { path: file.path, source: "downloaded", meta: result.meta };
    }
    log(`football-docs: skipping cached index ${file.path}: ${result.ok ? "stamp does not match its name" : result.reason}`);
  }
  return bundledSelection;
}

function removeWithSideFiles(path: string): void {
  for (const suffix of SIDE_FILES) {
    rmSync(`${path}${suffix}`, { force: true });
  }
}

/**
 * Remove leftovers from the data directory: temporary downloads older than an
 * hour, and downloaded indexes older than the active one that have not changed
 * for a week. Errors are ignored; a file that cannot be removed now is tried again
 * at the next start.
 */
export function cleanDataDir(dataDir: string, activeStampMs: number | null, now = Date.now()): void {
  if (!existsSync(dataDir)) return;
  for (const name of readdirSync(dataDir)) {
    const path = join(dataDir, name);
    try {
      const age = now - statSync(path).mtimeMs;
      if (TEMP_FILE.test(name)) {
        if (age > TEMP_FILE_GRACE_MS) removeWithSideFiles(path);
        continue;
      }
      const match = CACHED_FILE.exec(name);
      if (match && activeStampMs !== null && Number(match[1]) < activeStampMs && age > OLD_FILE_GRACE_MS) {
        removeWithSideFiles(path);
      }
    } catch {
      // Best effort only.
    }
  }
}
