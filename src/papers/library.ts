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
import { type Env, FetchError, type PaperContext, readCacheJson, readCapped, reason, USER_AGENT, writeCacheJson } from "./core.js";
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
// Zotero's local API (Zotero 7: Settings > Advanced > "Allow other applications
// on this computer to communicate with Zotero"). Read requests need no key.

export const ZOTERO_API = "http://localhost:23119/api/users/0";

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

async function zoteroGet(ctx: PaperContext, path: string): Promise<Response> {
  let response: Response;
  try {
    response = await ctx.fetchImpl(`${ZOTERO_API}${path}`, {
      headers: { "User-Agent": USER_AGENT, "Zotero-API-Version": "3" },
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new FetchError("Zotero is not running, or its local API is not reachable on port 23119");
  }
  if (response.status === 403) {
    throw new FetchError(
      "Zotero's local API is off. In Zotero 7, open Settings > Advanced and turn on \"Allow other applications on this computer to communicate with Zotero\"",
      403,
    );
  }
  if (response.status === 404) throw new FetchError("no such Zotero item", 404);
  if (!response.ok) throw new FetchError(`Zotero answered HTTP ${response.status}`, response.status);
  return response;
}

async function zoteroJson<T>(ctx: PaperContext, path: string): Promise<T> {
  const response = await zoteroGet(ctx, path);
  return JSON.parse(new TextDecoder().decode(await readCapped(response))) as T;
}

export function zoteroCreators(item: ZoteroItem): string[] {
  return (item.data.creators ?? []).map((c) => c.name ?? [c.firstName, c.lastName].filter(Boolean).join(" ")).filter(Boolean);
}

export async function searchZotero(ctx: PaperContext, query: string, limit: number): Promise<ZoteroItem[]> {
  const q = encodeURIComponent(query.replace(/"/g, ""));
  return zoteroJson<ZoteroItem[]>(ctx, `/items/top?q=${q}&qmode=titleCreatorYear&limit=${limit}`);
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

export type ZoteroPaper = { item: ZoteroItem; attachment: ZoteroItem; sections: Section[]; sha256: string };

/**
 * The text of a Zotero item's PDF: the item itself when it is a PDF
 * attachment, else its first PDF attachment. Reads the file Zotero stores;
 * when Zotero has no file on this computer, uses Zotero's own full-text index.
 */
export async function readZoteroPaper(ctx: PaperContext, key: string): Promise<ZoteroPaper> {
  if (!/^[A-Z0-9]{8}$/.test(key)) throw new FetchError("a Zotero item key is 8 capital letters and digits, such as ABCD2345");
  const item = await zoteroJson<ZoteroItem>(ctx, `/items/${key}`);
  let attachment = item;
  let parent = item;
  if (item.data.itemType !== "attachment") {
    const children = await zoteroJson<ZoteroItem[]>(ctx, `/items/${key}/children`);
    const pdf = children.find((child) => child.data.itemType === "attachment" && child.data.contentType === "application/pdf");
    if (!pdf) throw new FetchError(`the Zotero item ${key} has no PDF attachment`);
    attachment = pdf;
  } else if (item.data.parentItem) {
    parent = await zoteroJson<ZoteroItem>(ctx, `/items/${item.data.parentItem}`);
  }

  try {
    const url = (await (await zoteroGet(ctx, `/items/${attachment.key}/file/view/url`)).text()).trim();
    if (url.startsWith("file:")) {
      const local = await readLocalPdf(fileURLToPath(url));
      return { item: parent, attachment, sections: local.sections, sha256: local.sha256 };
    }
  } catch (error) {
    if (!(error instanceof FetchError) || error.status === 403) throw error;
  }
  const fulltext = await zoteroJson<{ content?: string }>(ctx, `/items/${attachment.key}/fulltext`).catch((error) => {
    throw new FetchError(`Zotero has neither the file nor its full text for ${attachment.key} (${reason(error)})`);
  });
  const content = fulltext.content ?? "";
  return {
    item: parent,
    attachment,
    sections: splitSections(content),
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}
