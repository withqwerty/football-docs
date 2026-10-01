/**
 * The user's paper library: text of papers read, kept in the cache folder.
 *
 * Two kinds of entry:
 * - "open": text from an open copy (arXiv, a repository, an open-access
 *   publisher, SportRxiv). Read tools return it in full, by section.
 * - "user": a paper the user supplied, from a file or from Zotero, which may
 *   be paid access. Read tools return its outline and short passages only.
 *
 * Every file here is written with mode 0600 in a 0700 folder. Each entry
 * carries the FORMAT marker, which the public-safety test looks for in the
 * repository so that paper text can never be committed.
 */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { apiKey, type Env, FetchError, type PaperContext, readCacheJson, readCapped, reason, USER_AGENT, writeCacheJson } from "./core.js";
import type { PaperRecord } from "./records.js";
import { isPdf, pdfSections, readPdf, type Section, splitSections } from "./text.js";

export const FORMAT = "football-docs/paper-text/v1";
const TEXT_DIR = "text";
const INDEX_FILE = "library.json";
const MAX_LOCAL_PDF_BYTES = 100 * 1024 * 1024;

export type Access = "open" | "user";

export type StoredPaper = {
  format: typeof FORMAT;
  /** The ID the entry is filed under: arxiv:…, doi:…, openalex:… or local:…. */
  key: string;
  access: Access;
  title: string;
  authors: string[];
  year?: number;
  ids: PaperRecord["ids"];
  /** Where the text came from: a URL for open copies, a file name or Zotero item for user papers. */
  origin: string;
  licence?: string;
  zotero?: string;
  sha256?: string;
  savedAt: string;
  sections: Section[];
};

type LibraryIndex = { aliases: Record<string, string> };

/** Passage length for user papers: FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS, 50 to 1000, default 200. */
export function passageChars(env: Env): number {
  const value = Number(env.FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS);
  if (!Number.isFinite(value) || value <= 0) return 200;
  return Math.min(1000, Math.max(50, Math.round(value)));
}

function fileFor(key: string): string {
  return `${createHash("sha256").update(key).digest("hex").slice(0, 24)}.json`;
}

function textDir(ctx: PaperContext): string {
  return join(ctx.cacheDir, TEXT_DIR);
}

function readIndex(ctx: PaperContext): LibraryIndex {
  return readCacheJson<LibraryIndex>(ctx.cacheDir, INDEX_FILE) ?? { aliases: {} };
}

/** Every key an entry can be found by: its own key plus its IDs. */
export function aliasesOf(entry: Pick<StoredPaper, "key" | "ids" | "zotero" | "access">): string[] {
  const keys = [entry.key];
  // A user paper is found by its local and Zotero keys only, so that a DOI
  // lookup still tries an open copy first.
  if (entry.access === "open") {
    if (entry.ids.doi) keys.push(`doi:${entry.ids.doi.toLowerCase()}`);
    if (entry.ids.arxiv) keys.push(`arxiv:${entry.ids.arxiv.replace(/v\d+$/i, "").toLowerCase()}`);
    if (entry.ids.openalex) keys.push(`openalex:${entry.ids.openalex}`);
  }
  if (entry.zotero) keys.push(`zotero:${entry.zotero}`);
  return [...new Set(keys)];
}

/** Keys compare in lower case, except Zotero item keys, which are capitals. */
export function canonicalKey(key: string): string {
  const trimmed = key.trim();
  return /^zotero:/i.test(trimmed) ? `zotero:${trimmed.slice(7).toUpperCase()}` : trimmed.toLowerCase();
}

export function saveEntry(ctx: PaperContext, entry: StoredPaper): void {
  const file = fileFor(entry.key);
  writeCacheJson(textDir(ctx), file, entry);
  const index = readIndex(ctx);
  for (const alias of aliasesOf(entry)) index.aliases[canonicalKey(alias)] = file;
  writeCacheJson(ctx.cacheDir, INDEX_FILE, index);
}

export function loadEntry(ctx: PaperContext, key: string): StoredPaper | null {
  const file = readIndex(ctx).aliases[canonicalKey(key)];
  if (!file) return null;
  const entry = readCacheJson<StoredPaper>(textDir(ctx), file);
  return entry?.format === FORMAT ? entry : null;
}

/** User papers whose metadata names this DOI. */
export function userEntriesFor(ctx: PaperContext, doi: string): StoredPaper[] {
  const dir = textDir(ctx);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readCacheJson<StoredPaper>(dir, name))
    .filter((entry): entry is StoredPaper => entry?.format === FORMAT && entry.access === "user" && entry.ids.doi === doi.toLowerCase());
}

export function listEntries(ctx: PaperContext): StoredPaper[] {
  const dir = textDir(ctx);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => readCacheJson<StoredPaper>(dir, name))
    .filter((entry): entry is StoredPaper => entry?.format === FORMAT);
}

/** Remove one entry and its aliases. Returns the removed entry, if any. */
export function forgetEntry(ctx: PaperContext, key: string): StoredPaper | null {
  const entry = loadEntry(ctx, key);
  if (!entry) return null;
  const file = fileFor(entry.key);
  rmSync(join(textDir(ctx), file), { force: true });
  const index = readIndex(ctx);
  for (const [alias, target] of Object.entries(index.aliases)) {
    if (target === file) delete index.aliases[alias];
  }
  writeCacheJson(ctx.cacheDir, INDEX_FILE, index);
  return entry;
}

/** Delete everything in the cache folder: paper text, the index and the SportRxiv copy. */
export function purgeAll(ctx: PaperContext): { papers: number; bytes: number } {
  if (!existsSync(ctx.cacheDir)) return { papers: 0, bytes: 0 };
  const papers = listEntries(ctx).length;
  let bytes = 0;
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const stat = statSync(path);
      if (stat.isDirectory()) walk(path);
      else bytes += stat.size;
    }
  };
  walk(ctx.cacheDir);
  for (const name of readdirSync(ctx.cacheDir)) rmSync(join(ctx.cacheDir, name), { recursive: true, force: true });
  return { papers, bytes };
}

// ---------------------------------------------------------------------------
// Local files

export function expandPath(path: string): string {
  const trimmed = path.trim();
  // "~/" on macOS and Linux; "~\\" too, for Windows.
  const expanded = trimmed === "~" || /^~[/\\]/.test(trimmed) ? join(homedir(), trimmed.slice(1)) : trimmed;
  return resolve(expanded);
}

export type LocalPdf = { sha256: string; name: string; sections: Section[]; title?: string; author?: string; doi?: string };

/** Read a PDF the user names. Only regular files that start as a PDF are read. */
export async function readLocalPdf(path: string): Promise<LocalPdf> {
  if (!isAbsolute(path.trim()) && !path.trim().startsWith("~")) throw new FetchError("give the full path to the file");
  const full = expandPath(path);
  if (!existsSync(full)) throw new FetchError(`no file at ${full}`);
  const stat = statSync(full);
  if (!stat.isFile()) throw new FetchError(`${full} is not a file`);
  if (stat.size > MAX_LOCAL_PDF_BYTES) throw new FetchError("the file is over 100 MB");
  const data = new Uint8Array(readFileSync(full));
  if (!isPdf(data)) throw new FetchError("only PDF files can be added");
  const pdf = await readPdf(data);
  return {
    sha256: createHash("sha256").update(data).digest("hex"),
    name: basename(full),
    sections: pdfSections(pdf.pages),
    title: pdf.title,
    author: pdf.author,
    doi: pdf.doi,
  };
}

// ---------------------------------------------------------------------------
// Zotero
//
// Two routes to the same library:
// - the local API of Zotero 7 on this computer (Settings > Advanced > "Allow
//   other applications on this computer to communicate with Zotero"). Read
//   requests need no key, and nothing leaves the machine;
// - the Zotero web API at api.zotero.org, with a read-only key from
//   zotero.org/settings/keys (ZOTERO_API_KEY, and ZOTERO_USER_ID or the user
//   ID the key reports). Used when Zotero is not running here. It reads only
//   files kept in Zotero's own storage, not linked files.

export const ZOTERO_LOCAL = "http://localhost:23119/api/users/0";
const ZOTERO_WEB = "https://api.zotero.org";

export type ZoteroItem = {
  key: string;
  data: {
    key: string;
    itemType: string;
    title?: string;
    creators?: Array<{ firstName?: string; lastName?: string; name?: string }>;
    date?: string;
    DOI?: string;
    url?: string;
    publicationTitle?: string;
    contentType?: string;
    linkMode?: string;
    parentItem?: string;
    filename?: string;
  };
};

export type ZoteroRoute = { kind: "local" | "web"; base: string; headers: Record<string, string>; label: string };

const LOCAL_ROUTE: ZoteroRoute = {
  kind: "local",
  base: ZOTERO_LOCAL,
  headers: { "User-Agent": USER_AGENT, "Zotero-API-Version": "3" },
  label: "Zotero on this computer",
};

const userIds = new Map<string, string>();

/** Forget the user IDs read from keys. Tests only. */
export function resetZoteroRoutes(): void {
  userIds.clear();
}

async function zoteroFetch(ctx: PaperContext, route: ZoteroRoute, url: string, redirect: RequestRedirect = "follow"): Promise<Response> {
  let response: Response;
  try {
    response = await ctx.fetchImpl(url, { headers: route.headers, redirect, signal: AbortSignal.timeout(20_000) });
  } catch (error) {
    if (route.kind === "local") throw new FetchError("Zotero is not running, or its local API is not reachable on port 23119");
    throw new FetchError(`the Zotero web API did not answer (${reason(error)})`);
  }
  if (response.status === 403) {
    await response.body?.cancel().catch(() => undefined);
    throw new FetchError(
      route.kind === "local"
        ? "Zotero's local API is off. In Zotero 7, open Settings > Advanced and turn on \"Allow other applications on this computer to communicate with Zotero\""
        : "the Zotero web API refused the key (HTTP 403). Check at zotero.org/settings/keys that it allows access to your library, and to files for PDFs",
      403,
    );
  }
  if (response.status === 404) {
    await response.body?.cancel().catch(() => undefined);
    throw new FetchError("no such Zotero item, or no file stored for it", 404);
  }
  if (response.status === 429 || response.status === 503) {
    const wait = response.headers.get("retry-after") ?? response.headers.get("backoff");
    throw new FetchError(`Zotero asked to slow down${wait ? `; try again in ${wait} seconds` : ""}`, response.status);
  }
  if (!response.ok && !(redirect === "manual" && response.status >= 300 && response.status < 400)) {
    throw new FetchError(`Zotero answered HTTP ${response.status}`, response.status);
  }
  return response;
}

async function zoteroJson<T>(ctx: PaperContext, route: ZoteroRoute, path: string): Promise<T> {
  const response = await zoteroFetch(ctx, route, `${route.base}${path}`);
  return JSON.parse(new TextDecoder().decode(await readCapped(response))) as T;
}

async function webRoute(ctx: PaperContext): Promise<ZoteroRoute | null> {
  const key = await apiKey(ctx, "ZOTERO_API_KEY");
  if (!key) return null;
  const headers = { "User-Agent": USER_AGENT, "Zotero-API-Version": "3", "Zotero-API-Key": key };
  let userId = ctx.env.ZOTERO_USER_ID?.trim() || userIds.get(key);
  if (!userId) {
    const probe: ZoteroRoute = { kind: "web", base: ZOTERO_WEB, headers, label: "Zotero web API" };
    const current = await zoteroJson<{ userID?: number }>(ctx, probe, "/keys/current");
    if (!current.userID) throw new FetchError("the Zotero key did not report a user ID; set ZOTERO_USER_ID");
    userId = String(current.userID);
    userIds.set(key, userId);
  }
  if (!/^\d+$/.test(userId)) throw new FetchError("ZOTERO_USER_ID must be the number shown at zotero.org/settings/keys");
  return { kind: "web", base: `${ZOTERO_WEB}/users/${userId}`, headers, label: "Zotero web API" };
}

/**
 * The route to use: the local API when Zotero answers on this computer, else
 * the web API when a key is set. The error names both ways to set one up.
 */
export async function zoteroRoute(ctx: PaperContext): Promise<ZoteroRoute> {
  let localProblem: string;
  try {
    await zoteroJson(ctx, LOCAL_ROUTE, "/items/top?limit=1");
    return LOCAL_ROUTE;
  } catch (error) {
    localProblem = reason(error);
  }
  const web = await webRoute(ctx);
  if (web) return web;
  throw new FetchError(
    `${localProblem}. To read Zotero without the app running, set ZOTERO_API_KEY to a read-only key from zotero.org/settings/keys`,
  );
}

export function zoteroCreators(item: ZoteroItem): string[] {
  return (item.data.creators ?? []).map((c) => c.name ?? [c.firstName, c.lastName].filter(Boolean).join(" ")).filter(Boolean);
}

export async function searchZotero(ctx: PaperContext, query: string, limit: number): Promise<{ items: ZoteroItem[]; label: string }> {
  const route = await zoteroRoute(ctx);
  const q = encodeURIComponent(query.replace(/"/g, ""));
  const items = await zoteroJson<ZoteroItem[]>(ctx, route, `/items/top?q=${q}&qmode=titleCreatorYear&limit=${limit}`);
  return { items, label: route.label };
}

export function fromZotero(item: ZoteroItem): PaperRecord {
  const year = Number(item.data.date?.match(/\d{4}/)?.[0]);
  return {
    source: "zotero",
    title: item.data.title || "(untitled)",
    authors: zoteroCreators(item),
    year: Number.isFinite(year) ? year : undefined,
    venue: item.data.publicationTitle || undefined,
    type: item.data.itemType,
    ids: { doi: item.data.DOI?.toLowerCase() || undefined, zotero: item.key },
    url: item.data.url || undefined,
    openCopies: [],
  };
}

/** A Zotero item with no PDF attachment. Carries the item, so a caller can read its DOI instead. */
export class NoZoteroPdfError extends FetchError {
  constructor(
    readonly item: ZoteroItem,
    readonly label: string,
  ) {
    super(`the Zotero item ${item.key} has no PDF attachment`);
  }
}

export type ZoteroPaper = { item: ZoteroItem; attachment: ZoteroItem; sections: Section[]; sha256: string; label: string };

/** A PDF's sections and hash from its bytes. */
async function pdfFromBytes(data: Uint8Array): Promise<{ sections: Section[]; sha256: string }> {
  if (!isPdf(data)) throw new FetchError("the stored file is not a PDF");
  const pdf = await readPdf(data);
  return { sections: pdfSections(pdf.pages), sha256: createHash("sha256").update(data).digest("hex") };
}

/**
 * The file of an attachment through the web API. The API answers with a
 * redirect to the storage host; that request goes without the Zotero key, so
 * the key is sent only to api.zotero.org.
 */
async function webFile(ctx: PaperContext, route: ZoteroRoute, attachmentKey: string): Promise<Uint8Array> {
  const response = await zoteroFetch(ctx, route, `${route.base}/items/${attachmentKey}/file`, "manual");
  const location = response.headers.get("location");
  if (response.status >= 300 && response.status < 400 && location) {
    await response.body?.cancel().catch(() => undefined);
    const file = await ctx.fetchImpl(new URL(location, route.base).href, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(60_000),
    });
    if (!file.ok) throw new FetchError(`the Zotero file download answered HTTP ${file.status}`, file.status);
    return readCapped(file, MAX_LOCAL_PDF_BYTES);
  }
  return readCapped(response, MAX_LOCAL_PDF_BYTES);
}

/**
 * The text of a Zotero item's PDF: the item itself when it is a PDF
 * attachment, else its first PDF attachment. Reads the stored file; when there
 * is none (a linked file, through the web API), uses Zotero's own full-text index.
 */
export async function readZoteroPaper(ctx: PaperContext, key: string): Promise<ZoteroPaper> {
  if (!/^[A-Z0-9]{8}$/.test(key)) throw new FetchError("a Zotero item key is 8 capital letters and digits, such as ABCD2345");
  const route = await zoteroRoute(ctx);
  const item = await zoteroJson<ZoteroItem>(ctx, route, `/items/${key}`);
  let attachment = item;
  let parent = item;
  if (item.data.itemType !== "attachment") {
    const children = await zoteroJson<ZoteroItem[]>(ctx, route, `/items/${key}/children`);
    const pdf = children.find((child) => child.data.itemType === "attachment" && child.data.contentType === "application/pdf");
    if (!pdf) throw new NoZoteroPdfError(item, route.label);
    attachment = pdf;
  } else if (item.data.parentItem) {
    parent = await zoteroJson<ZoteroItem>(ctx, route, `/items/${item.data.parentItem}`);
  }

  try {
    if (route.kind === "local") {
      const url = (await (await zoteroFetch(ctx, route, `${route.base}/items/${attachment.key}/file/view/url`)).text()).trim();
      if (url.startsWith("file:")) {
        const local = await readLocalPdf(fileURLToPath(url));
        return { item: parent, attachment, sections: local.sections, sha256: local.sha256, label: route.label };
      }
    } else {
      const pdf = await pdfFromBytes(await webFile(ctx, route, attachment.key));
      return { item: parent, attachment, ...pdf, label: route.label };
    }
  } catch (error) {
    if (!(error instanceof FetchError) || error.status === 403 || error.status === 429 || error.status === 503) throw error;
  }
  const fulltext = await zoteroJson<{ content?: string }>(ctx, route, `/items/${attachment.key}/fulltext`).catch((error) => {
    throw new FetchError(`Zotero has neither the file nor its full text for ${attachment.key} (${reason(error)})`);
  });
  const content = fulltext.content ?? "";
  return {
    item: parent,
    attachment,
    sections: splitSections(content),
    sha256: createHash("sha256").update(content).digest("hex"),
    label: route.label,
  };
}
