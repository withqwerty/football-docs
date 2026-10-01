/**
 * SportRxiv (https://sportrxiv.org), the sport-science preprint server.
 *
 * Its search is an HTML page and its REST API needs a key, but its OAI-PMH
 * feed is open and small (under 1000 records). The tool keeps a copy of the
 * feed's metadata in the user's cache folder and searches that. The first
 * search downloads the feed (about 8 pages); after a week the next search asks
 * only for records changed since the last download.
 */

import { DOMParser } from "linkedom";
import { getText, type PaperContext, plainText, readCacheJson, writeCacheJson } from "./core.js";
import type { PaperRecord } from "./records.js";

const OAI_API = "https://sportrxiv.org/index.php/server/oai";
const CACHE_FILE = "sportrxiv.json";
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_PAGES = 50;

export type SportrxivRecord = {
  oai: string;
  title: string;
  authors: string[];
  subjects: string[];
  abstract: string;
  date?: string;
  doi?: string;
  url?: string;
  /** Galley links (PDF and other formats) from dc:relation. */
  files: string[];
  rights: string[];
  deleted?: boolean;
};

export type SportrxivMirror = { harvestedAt: string; records: SportrxivRecord[] };

type XmlElement = {
  getElementsByTagName(name: string): ArrayLike<XmlElement>;
  getAttribute(name: string): string | null;
  textContent: string | null;
};

function texts(parent: XmlElement, tag: string): string[] {
  return Array.from(parent.getElementsByTagName(tag))
    .map((node) => plainText(node.textContent))
    .filter(Boolean);
}

/** Parse one ListRecords page into records and the token for the next page. */
export function parseOaiPage(xml: string): { records: SportrxivRecord[]; token: string | null } {
  const doc = new DOMParser().parseFromString(xml, "text/xml") as unknown as XmlElement;
  const records = Array.from(doc.getElementsByTagName("record")).map((record): SportrxivRecord => {
    const header = record.getElementsByTagName("header")[0];
    const identifiers = texts(record, "dc:identifier");
    return {
      oai: texts(header, "identifier")[0] ?? "",
      title: texts(record, "dc:title")[0] ?? "",
      authors: texts(record, "dc:creator").map((name) => name.replace(/\s+/g, " ")),
      subjects: texts(record, "dc:subject"),
      abstract: texts(record, "dc:description")[0] ?? "",
      date: texts(record, "dc:date")[0],
      doi: identifiers.find((value) => /^10\.\d+\//.test(value))?.toLowerCase(),
      url: identifiers.find((value) => /^https?:\/\//.test(value)),
      files: texts(record, "dc:relation").filter((value) => /^https?:\/\//.test(value)),
      rights: texts(record, "dc:rights"),
      deleted: header?.getAttribute("status") === "deleted" || undefined,
    };
  });
  const token = plainText(doc.getElementsByTagName("resumptionToken")[0]?.textContent);
  return { records, token: token || null };
}

async function harvest(ctx: PaperContext, from?: string): Promise<SportrxivRecord[]> {
  const records: SportrxivRecord[] = [];
  let url = `${OAI_API}?verb=ListRecords&metadataPrefix=oai_dc${from ? `&from=${from}` : ""}`;
  for (let page = 0; page < MAX_PAGES; page++) {
    const xml = await getText(ctx, url, { timeoutMs: 30_000 });
    // OAI answers an update with nothing new with an error element, not an empty list.
    if (xml.includes('code="noRecordsMatch"')) break;
    const parsed = parseOaiPage(xml);
    records.push(...parsed.records);
    if (!parsed.token) break;
    url = `${OAI_API}?verb=ListRecords&resumptionToken=${encodeURIComponent(parsed.token)}`;
  }
  return records;
}

export type MirrorState = { mirror: SportrxivMirror; refreshed: "full" | "update" | "cached"; stale?: string };

/**
 * The local copy of the feed: downloaded in full the first time, updated
 * incrementally when older than a week. When an update fails, the old copy is
 * used and the failure is reported.
 */
export async function loadMirror(ctx: PaperContext): Promise<MirrorState> {
  const cached = readCacheJson<SportrxivMirror>(ctx.cacheDir, CACHE_FILE);
  const age = cached ? ctx.now() - Date.parse(cached.harvestedAt) : Number.POSITIVE_INFINITY;
  if (cached && age < REFRESH_MS) return { mirror: cached, refreshed: "cached" };

  const startedAt = new Date(ctx.now()).toISOString();
  try {
    if (!cached) {
      const records = (await harvest(ctx)).filter((record) => !record.deleted);
      const mirror = { harvestedAt: startedAt, records };
      writeCacheJson(ctx.cacheDir, CACHE_FILE, mirror);
      return { mirror, refreshed: "full" };
    }
    const changed = await harvest(ctx, cached.harvestedAt.slice(0, 10));
    const byOai = new Map(cached.records.map((record) => [record.oai, record]));
    for (const record of changed) {
      if (record.deleted) byOai.delete(record.oai);
      else byOai.set(record.oai, record);
    }
    const mirror = { harvestedAt: startedAt, records: [...byOai.values()] };
    writeCacheJson(ctx.cacheDir, CACHE_FILE, mirror);
    return { mirror, refreshed: "update" };
  } catch (error) {
    if (!cached) throw error;
    return {
      mirror: cached,
      refreshed: "cached",
      stale: `update failed (${error instanceof Error ? error.message : String(error)}); used the copy from ${cached.harvestedAt.slice(0, 10)}`,
    };
  }
}

function licenceOf(record: SportrxivRecord): string | undefined {
  return record.rights.find((value) => /^https?:\/\//.test(value));
}

export function fromSportrxiv(record: SportrxivRecord): PaperRecord {
  const licence = licenceOf(record);
  const pdfs = record.files;
  return {
    source: "sportrxiv",
    title: record.title,
    authors: record.authors,
    year: record.date ? Number(record.date.slice(0, 4)) : undefined,
    date: record.date,
    venue: "SportRxiv (preprint)",
    type: "preprint",
    ids: { doi: record.doi },
    url: record.url,
    abstract: record.abstract || undefined,
    licence,
    // OAI gives galley links without their formats; the landing page lists them.
    openCopies: record.url
      ? [{ url: record.url, pdf: false, host: "SportRxiv", licence, version: pdfs.length ? `${pdfs.length} file(s) on the page` : undefined }]
      : [],
  };
}

/** Terms and quoted phrases from a query, lower case, without AND/OR/NOT. */
function queryTerms(query: string): string[] {
  return (query.toLowerCase().match(/"[^"]+"|\S+/g) ?? [])
    .map((term) => term.replace(/^"|"$/g, "").trim())
    .filter((term) => term && !["and", "or", "not"].includes(term));
}

/** Records whose title, abstract, subjects or authors hold every term; title matches first. */
export function searchMirror(mirror: SportrxivMirror, query: string, limit: number): { records: PaperRecord[]; total: number } {
  const terms = queryTerms(query);
  if (!terms.length) return { records: [], total: 0 };
  const scored: Array<{ record: SportrxivRecord; score: number }> = [];
  for (const record of mirror.records) {
    const title = record.title.toLowerCase();
    const body = [record.abstract, record.subjects.join(" "), record.authors.join(" ")].join(" ").toLowerCase();
    if (!terms.every((term) => title.includes(term) || body.includes(term))) continue;
    const score = terms.filter((term) => title.includes(term)).length;
    scored.push({ record, score });
  }
  scored.sort((a, b) => b.score - a.score || (b.record.date ?? "").localeCompare(a.record.date ?? ""));
  return { records: scored.slice(0, limit).map((entry) => fromSportrxiv(entry.record)), total: scored.length };
}

export function findInMirror(mirror: SportrxivMirror, doi: string): PaperRecord | null {
  const record = mirror.records.find((entry) => entry.doi === doi.toLowerCase());
  return record ? fromSportrxiv(record) : null;
}
