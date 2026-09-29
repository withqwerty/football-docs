/**
 * Background check for a newer docs index.
 *
 * CI publishes each data build to the data-latest release of this repository
 * with a manifest (see .github/workflows/data.yml). At most once a day the
 * server reads the manifest for its schema version, and when it names a newer
 * build it downloads the file, checks its size, hash, schema and metadata, and
 * adds it to the data directory under its stamp. The next tool call uses it.
 *
 * Every failure leaves the current index in use. Nothing is written to stdout,
 * which is the MCP channel.
 */

import { createHash, randomBytes } from "node:crypto";
import { constants, copyFileSync, existsSync, linkSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { open } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { compareVersions, DATA_SCHEMA_VERSION, validateDatabase } from "./data-format.js";
import { SignatureError, TRUSTED_KEYS, type TrustedKey, verifySignedManifest } from "./data-signing.js";
import { cachedFileName } from "./data-source.js";

export const DEFAULT_DATA_BASE_URL = "https://github.com/withqwerty/football-docs/releases/download/data-latest/";
/**
 * The signed manifest servers read. Its payload is the manifest-v<schema>.json
 * that data.yml builds; the unsigned file is not published, and a server never
 * falls back to it, so deleting the signed file cannot downgrade the check.
 */
export const MANIFEST_NAME = `manifest-v${DATA_SCHEMA_VERSION}-signed.json`;

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const MANIFEST_TIMEOUT_MS = 10_000;
const DOWNLOAD_TIMEOUT_MS = 60_000;
export const MAX_DOWNLOAD_BYTES = 64 * 1024 * 1024;

const manifestSchema = z.object({
  schema_version: z.number().int(),
  min_server_version: z.string(),
  data_stamp: z.string(),
  commit: z.string().nullable().optional(),
  file: z.string().regex(/^docs-\d+\.db$/),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  size: z.number().int().positive(),
});

export type Manifest = z.infer<typeof manifestSchema>;

export type UpdateOutcome =
  | "skipped-ci"
  | "skipped-recent"
  | "not-published"
  | "up-to-date"
  | "installed"
  | "rejected"
  | "failed";

export interface UpdateOptions {
  dataDir: string;
  serverVersion: string;
  /** Stamp of the index in use, in epoch milliseconds, or null if unknown. */
  currentStampMs: number | null;
  baseUrl?: string;
  env?: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  now?: () => number;
  signal?: AbortSignal;
  maxBytes?: number;
  /** Keys that may sign manifests; defaults to the keys shipped in the package. */
  trustedKeys?: readonly TrustedKey[];
  log?: (message: string) => void;
}

export interface UpdateResult {
  outcome: UpdateOutcome;
  detail?: string;
  /** Path of the newly added index, for outcome "installed". */
  path?: string;
}

function statePath(dataDir: string): string {
  return join(dataDir, "state.json");
}

function lastCheckedMs(dataDir: string): number | null {
  try {
    const state = JSON.parse(readFileSync(statePath(dataDir), "utf-8")) as { last_checked?: string };
    const time = Date.parse(state.last_checked ?? "");
    return Number.isFinite(time) ? time : null;
  } catch {
    return null;
  }
}

function recordCheck(dataDir: string, nowMs: number): void {
  const temp = join(dataDir, `state-${process.pid}-${randomBytes(4).toString("hex")}.json`);
  writeFileSync(temp, `${JSON.stringify({ last_checked: new Date(nowMs).toISOString() })}\n`);
  renameSync(temp, statePath(dataDir));
}

/** One signal that fires on the caller's abort or after `ms`. */
function timeoutSignal(ms: number, parent?: AbortSignal): { signal: AbortSignal; done: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`timed out after ${ms / 1000}s`)), ms);
  timer.unref?.();
  const onAbort = () => controller.abort(parent?.reason);
  if (parent?.aborted) controller.abort(parent.reason);
  else parent?.addEventListener("abort", onAbort, { once: true });
  return {
    signal: controller.signal,
    done: () => {
      clearTimeout(timer);
      parent?.removeEventListener("abort", onAbort);
    },
  };
}

function requireHttps(url: string): void {
  if (new URL(url).protocol !== "https:") throw new Error(`refusing a non-HTTPS URL: ${url}`);
}

class NotPublished extends Error {}
class Rejected extends Error {}

async function fetchManifest(
  fetchImpl: typeof fetch,
  url: string,
  keys: readonly TrustedKey[],
  parent?: AbortSignal,
): Promise<Manifest> {
  requireHttps(url);
  const timeout = timeoutSignal(MANIFEST_TIMEOUT_MS, parent);
  try {
    const response = await fetchImpl(url, { signal: timeout.signal, redirect: "follow" });
    if (response.url) requireHttps(response.url);
    if (response.status === 404) throw new NotPublished(`no ${MANIFEST_NAME} published`);
    if (!response.ok) throw new Error(`manifest request returned HTTP ${response.status}`);
    // Verify the signature over the exact signed text before parsing any of it.
    const payload = verifySignedManifest(await response.json(), keys);
    return manifestSchema.parse(JSON.parse(payload));
  } finally {
    timeout.done();
  }
}

/** Stream the file to `target`, enforcing the size cap, and return its SHA-256. */
async function download(
  fetchImpl: typeof fetch,
  url: string,
  target: string,
  maxBytes: number,
  parent?: AbortSignal,
): Promise<{ sha256: string; size: number }> {
  requireHttps(url);
  const timeout = timeoutSignal(DOWNLOAD_TIMEOUT_MS, parent);
  const file = await open(target, "wx");
  try {
    const response = await fetchImpl(url, { signal: timeout.signal, redirect: "follow" });
    if (response.url) requireHttps(response.url);
    if (!response.ok || !response.body) throw new Error(`download returned HTTP ${response.status}`);

    const hash = createHash("sha256");
    let size = 0;
    const reader = response.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error(`download is larger than ${maxBytes} bytes`);
      }
      hash.update(value);
      await file.write(value);
    }
    return { sha256: hash.digest("hex"), size };
  } finally {
    timeout.done();
    await file.close();
  }
}

/**
 * Put the verified file in place under its final name without ever replacing an
 * existing one: another server may have added the same build first, which is fine.
 */
function install(temp: string, target: string): void {
  try {
    linkSync(temp, target);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EEXIST") return;
    if (code !== "EPERM" && code !== "ENOTSUP" && code !== "EXDEV") throw error;
    // No hard links on this filesystem: copy, still refusing to overwrite.
    try {
      copyFileSync(temp, target, constants.COPYFILE_EXCL);
    } catch (copyError) {
      if ((copyError as NodeJS.ErrnoException).code !== "EEXIST") throw copyError;
    }
  }
}

export async function checkForUpdate(options: UpdateOptions): Promise<UpdateResult> {
  const env = options.env ?? process.env;
  const now = options.now ?? Date.now;
  const log = options.log ?? (() => {});
  const fetchImpl = options.fetch ?? fetch;
  const baseUrl = env.FOOTBALL_DOCS_DATA_BASE_URL || options.baseUrl || DEFAULT_DATA_BASE_URL;

  if (env.CI) return { outcome: "skipped-ci" };
  const last = lastCheckedMs(options.dataDir);
  if (last !== null && now() - last < CHECK_INTERVAL_MS) return { outcome: "skipped-recent" };

  mkdirSync(options.dataDir, { recursive: true });
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  let manifest: Manifest;
  try {
    manifest = await fetchManifest(
      fetchImpl,
      new URL(MANIFEST_NAME, base).toString(),
      options.trustedKeys ?? TRUSTED_KEYS,
      options.signal,
    );
  } catch (error) {
    if (error instanceof NotPublished) {
      recordCheck(options.dataDir, now());
      return { outcome: "not-published" };
    }
    const detail = error instanceof Error ? error.message : String(error);
    // A malformed manifest is a completed check; a network failure is not.
    if (error instanceof SignatureError) {
      recordCheck(options.dataDir, now());
      log(`football-docs: data manifest rejected: ${detail}`);
      return { outcome: "rejected", detail };
    }
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      recordCheck(options.dataDir, now());
      log(`football-docs: data manifest rejected: ${detail}`);
      return { outcome: "rejected", detail: "malformed manifest" };
    }
    log(`football-docs: could not check for newer docs (${detail}); using the current index`);
    return { outcome: "failed", detail };
  }

  const stampMs = Date.parse(manifest.data_stamp);
  const rejection =
    manifest.schema_version !== DATA_SCHEMA_VERSION
      ? `schema version ${manifest.schema_version}`
      : compareVersions(options.serverVersion, manifest.min_server_version) < 0
        ? `needs server ${manifest.min_server_version}`
        : !Number.isFinite(stampMs)
          ? "bad data_stamp"
          : manifest.file !== cachedFileName(stampMs)
            ? "file name does not match data_stamp"
            : null;
  if (rejection) {
    recordCheck(options.dataDir, now());
    return { outcome: "rejected", detail: rejection };
  }
  if (options.currentStampMs !== null && stampMs <= options.currentStampMs) {
    recordCheck(options.dataDir, now());
    return { outcome: "up-to-date" };
  }

  const target = join(options.dataDir, manifest.file);
  if (!existsSync(target)) {
    const temp = join(options.dataDir, `tmp-${process.pid}-${randomBytes(6).toString("hex")}.db`);
    try {
      const got = await download(
        fetchImpl,
        new URL(manifest.file, base).toString(),
        temp,
        options.maxBytes ?? MAX_DOWNLOAD_BYTES,
        options.signal,
      );
      if (got.size !== manifest.size) throw new Rejected(`size ${got.size}, manifest says ${manifest.size}`);
      if (got.sha256 !== manifest.sha256) throw new Rejected("SHA-256 does not match the manifest");

      const result = validateDatabase(temp, options.serverVersion, { integrity: true });
      if (!result.ok) throw new Rejected(result.reason);
      if (result.meta.stampMs !== stampMs) throw new Rejected("the file's data_stamp does not match the manifest");

      install(temp, target);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      if (error instanceof Rejected) {
        recordCheck(options.dataDir, now());
        log(`football-docs: downloaded docs index rejected (${detail}); using the current index`);
        return { outcome: "rejected", detail };
      }
      log(`football-docs: could not download newer docs (${detail}); using the current index`);
      return { outcome: "failed", detail };
    } finally {
      rmSync(temp, { force: true });
    }
  }

  recordCheck(options.dataDir, now());
  log(`football-docs: docs index updated to ${manifest.data_stamp}`);
  return { outcome: "installed", path: target };
}
