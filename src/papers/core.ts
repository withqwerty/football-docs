/**
 * Shared parts of the paper and web-source tools: the off switch, the local
 * cache folder, API keys, and a fetch that keeps to each service's limits.
 *
 * These tools call public services at run time (OpenAlex, arXiv, SportRxiv,
 * Crossref, the Wayback Machine and the web page asked for). Nothing they fetch
 * goes into the repository, data/docs.db or a data release: metadata the tools
 * keep stays in the user's cache folder.
 */

import { execFile } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";

export const USER_AGENT = "football-docs (+https://github.com/withqwerty/football-docs)";

export type Env = Record<string, string | undefined>;

export type TextContent = { type: "text"; text: string };
export type ToolResponse = { isError?: boolean; content: TextContent[] };

export function textResult(text: string, isError = false): ToolResponse {
  return { isError: isError || undefined, content: [{ type: "text", text }] };
}

/** Everything a paper tool touches outside the process. Tests replace each part. */
export type PaperContext = {
  env: Env;
  fetchImpl: typeof fetch;
  cacheDir: string;
  /** Wait before a call to a service with a minimum interval (arXiv). */
  sleep: (ms: number) => Promise<void>;
  now: () => number;
  /** Look up a key in the system keychain. Returns null when there is none. */
  keychain: (name: string) => Promise<string | null>;
};

export type PaperOptions = Partial<PaperContext>;

const OFF_VALUES = new Set(["off", "0", "false", "no"]);

/** FOOTBALL_DOCS_PAPERS=off turns every outbound paper and web lookup off. */
export function papersDisabled(env: Env): boolean {
  return OFF_VALUES.has((env.FOOTBALL_DOCS_PAPERS ?? "").trim().toLowerCase());
}

export const DISABLED_MESSAGE = [
  "Paper and web-source lookups are off (FOOTBALL_DOCS_PAPERS=off), so no request was sent.",
  "Unset FOOTBALL_DOCS_PAPERS in the MCP server's environment to turn them on.",
].join(" ");

export function defaultCacheDir(env: Env = process.env): string {
  const base = env.XDG_DATA_HOME?.trim() || resolve(homedir(), ".local", "share");
  return resolve(base, "football-docs", "papers");
}

export function contextFrom(options: PaperOptions = {}): PaperContext {
  const env = options.env ?? process.env;
  return {
    env,
    fetchImpl: options.fetchImpl ?? fetch,
    cacheDir: options.cacheDir ?? defaultCacheDir(env),
    sleep: options.sleep ?? ((ms) => new Promise((done) => setTimeout(done, ms))),
    now: options.now ?? Date.now,
    keychain: options.keychain ?? systemKeychain,
  };
}

// ---------------------------------------------------------------------------
// Local cache: a folder only the user can read

export function ensureCacheDir(dir: string): void {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700);
}

export function readCacheJson<T>(dir: string, name: string): T | null {
  const path = join(dir, name);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

/** Write through a temporary file, so a crash never leaves half a file. */
export function writeCacheJson(dir: string, name: string, value: unknown): void {
  ensureCacheDir(dir);
  const path = join(dir, name);
  const temp = `${path}.${process.pid}.tmp`;
  writeFileSync(temp, JSON.stringify(value), { mode: 0o600 });
  renameSync(temp, path);
}

// ---------------------------------------------------------------------------
// Keys: environment first, then the system keychain

const keyCache = new Map<string, string | null>();

/**
 * Read a key from the environment, else from the keychain:
 *   macOS: security add-generic-password -s football-docs -a NAME -w
 *   Linux: secret-tool store --label=football-docs service football-docs key NAME
 */
export async function apiKey(ctx: PaperContext, name: string): Promise<string | null> {
  const fromEnv = ctx.env[name]?.trim();
  if (fromEnv) return fromEnv;
  return ctx.keychain(name);
}

async function systemKeychain(name: string): Promise<string | null> {
  if (keyCache.has(name)) return keyCache.get(name) ?? null;
  const command =
    platform() === "darwin"
      ? { file: "security", args: ["find-generic-password", "-s", "football-docs", "-a", name, "-w"] }
      : platform() === "linux"
        ? { file: "secret-tool", args: ["lookup", "service", "football-docs", "key", name] }
        : null;
  const value = command
    ? await new Promise<string | null>((done) => {
        execFile(command.file, command.args, { timeout: 5000 }, (error, stdout) => {
          done(error ? null : stdout.trim() || null);
        });
      })
    : null;
  keyCache.set(name, value);
  return value;
}

// ---------------------------------------------------------------------------
// Fetching

/** Services asked during one tool call, named in its reply. */
export class ServiceLog {
  private readonly entries: string[] = [];

  ok(service: string, detail?: string): void {
    this.entries.push(detail ? `${service} (${detail})` : service);
  }

  failed(service: string, reason: string): void {
    this.entries.push(`${service} (failed: ${reason})`);
  }

  get failures(): string[] {
    return this.entries.filter((entry) => entry.includes("(failed:"));
  }

  footer(): string {
    return this.entries.length
      ? `Services asked: ${this.entries.join("; ")}.`
      : "Services asked: none.";
  }
}

export class FetchError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

const lastCallAt = new Map<string, number>();

/**
 * arXiv asks for no more than one request every three seconds from one client.
 * Calls to a host with an interval wait their turn.
 */
const MIN_INTERVAL_MS: Record<string, number> = {
  "export.arxiv.org": 3100,
  "oaipmh.arxiv.org": 3100,
};

let queue: Promise<unknown> = Promise.resolve();

async function waitForTurn(ctx: PaperContext, host: string): Promise<void> {
  const interval = MIN_INTERVAL_MS[host];
  if (!interval) return;
  const turn = queue.then(async () => {
    const wait = (lastCallAt.get(host) ?? 0) + interval - ctx.now();
    if (wait > 0) await ctx.sleep(wait);
    lastCallAt.set(host, ctx.now());
  });
  queue = turn.catch(() => undefined);
  await turn;
}

/** Forget the per-host timings. Tests only. */
export function resetRateLimits(): void {
  lastCallAt.clear();
  queue = Promise.resolve();
}

export const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

/** Read a body, stopping at maxBytes so one huge page cannot fill memory. */
export async function readCapped(response: Response, maxBytes = MAX_RESPONSE_BYTES): Promise<Uint8Array> {
  const declared = Number(response.headers.get("content-length") ?? "0");
  if (declared > maxBytes) throw new FetchError(`response is over ${maxBytes / 1024 / 1024} MB`);
  if (!response.body) return new Uint8Array(await response.arrayBuffer());
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new FetchError(`response is over ${maxBytes / 1024 / 1024} MB`);
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export type GetOptions = { headers?: Record<string, string>; timeoutMs?: number };

/** GET a public API. Throws FetchError with the status on a non-2xx reply. */
export async function getResponse(ctx: PaperContext, url: string, options: GetOptions = {}): Promise<Response> {
  await waitForTurn(ctx, new URL(url).host);
  let response: Response;
  try {
    response = await ctx.fetchImpl(url, {
      headers: { "User-Agent": USER_AGENT, ...options.headers },
      signal: AbortSignal.timeout(options.timeoutMs ?? 20_000),
    });
  } catch (error) {
    throw new FetchError(error instanceof Error ? error.message : String(error));
  }
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new FetchError(`HTTP ${response.status}`, response.status);
  }
  return response;
}

export async function getText(ctx: PaperContext, url: string, options: GetOptions = {}): Promise<string> {
  const response = await getResponse(ctx, url, options);
  return new TextDecoder().decode(await readCapped(response));
}

export async function getJson<T>(ctx: PaperContext, url: string, options: GetOptions = {}): Promise<{ body: T; headers: Headers }> {
  const response = await getResponse(ctx, url, options);
  const text = new TextDecoder().decode(await readCapped(response));
  try {
    return { body: JSON.parse(text) as T, headers: response.headers };
  } catch {
    throw new FetchError("reply was not JSON");
  }
}

export function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

// ---------------------------------------------------------------------------
// Text helpers shared by the sources

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
};

/** Strip tags and decode the entities that appear in OAI and API abstracts. */
export function plainText(value: string | undefined | null): string {
  if (!value) return "";
  let text = value;
  // OAI feeds sometimes encode twice (&amp;nbsp;), so decode until stable.
  for (let i = 0; i < 3; i++) {
    const next = text
      .replace(/<[^>]+>/g, " ")
      .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (whole, name: string) => {
        if (name.startsWith("#x") || name.startsWith("#X")) return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
        if (name.startsWith("#")) return String.fromCodePoint(Number(name.slice(1)));
        return ENTITIES[name.toLowerCase()] ?? whole;
      });
    if (next === text) break;
    text = next;
  }
  return text.replace(/\s+/g, " ").trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
