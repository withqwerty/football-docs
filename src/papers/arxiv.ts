/**
 * arXiv: metadata search through the query API, and one record with its
 * licence through OAI-PMH. arXiv metadata is CC0. arXiv asks for no more than
 * one request every three seconds, which core.ts enforces.
 *
 * The query API searches titles, abstracts, authors and comments only, not
 * the body of a paper.
 */

import { DOMParser } from "linkedom";
import { getText, type PaperContext, plainText } from "./core.js";
import type { PaperRecord } from "./records.js";

const QUERY_API = "https://export.arxiv.org/api/query";
const OAI_API = "https://oaipmh.arxiv.org/oai";

type XmlElement = {
  getElementsByTagName(name: string): ArrayLike<XmlElement>;
  getAttribute(name: string): string | null;
  textContent: string | null;
};

function parseXml(text: string): XmlElement {
  return new DOMParser().parseFromString(text, "text/xml") as unknown as XmlElement;
}

function all(parent: XmlElement, tag: string): XmlElement[] {
  return Array.from(parent.getElementsByTagName(tag));
}

function first(parent: XmlElement, tag: string): string {
  return plainText(parent.getElementsByTagName(tag)[0]?.textContent ?? "");
}

/**
 * Turn a free-text query into arXiv's field syntax: every word and quoted
 * phrase is searched in all fields, joined with AND unless the query says
 * OR or NOT.
 */
export function arxivQuery(query: string): string {
  const tokens = query.match(/"[^"]+"|\S+/g) ?? [];
  const parts: string[] = [];
  let operator = "AND";
  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (upper === "AND" || upper === "OR" || upper === "NOT") {
      operator = upper === "NOT" ? "ANDNOT" : upper;
      continue;
    }
    const term = token.startsWith('"') ? token : token.replace(/[^\p{L}\p{N}.-]/gu, "");
    if (!term || term === '""') continue;
    if (parts.length) parts.push(operator);
    parts.push(`all:${term}`);
    operator = "AND";
  }
  return parts.join(" ");
}

/**
 * The year of first submission, from the ID's YYMM part. OAI's <created> can
 * hold a later date than the first version (1802.07127 shows 2019-07-10), so
 * the record does not use it.
 */
export function arxivYear(arxivId: string): number | undefined {
  const match = arxivId.match(/^(\d{2})\d{2}\./) ?? arxivId.match(/\/(\d{2})\d{5}/);
  if (!match) return undefined;
  const yy = Number(match[1]);
  return yy >= 91 ? 1900 + yy : 2000 + yy;
}

function idFromAbsUrl(url: string): string {
  return url.replace(/^https?:\/\/arxiv\.org\/abs\//i, "");
}

export type ArxivSearch = { records: PaperRecord[]; total: number };

export async function searchArxiv(ctx: PaperContext, query: string, options: { limit: number }): Promise<ArxivSearch> {
  const searchQuery = arxivQuery(query);
  if (!searchQuery) return { records: [], total: 0 };
  const url = new URL(QUERY_API);
  url.searchParams.set("search_query", searchQuery);
  url.searchParams.set("max_results", String(options.limit));
  url.searchParams.set("sortBy", "relevance");
  const feed = parseXml(await getText(ctx, url.href));
  const records = all(feed, "entry").map((entry): PaperRecord => {
    const id = idFromAbsUrl(first(entry, "id"));
    const published = first(entry, "published");
    const doi = first(entry, "arxiv:doi");
    const journal = first(entry, "arxiv:journal_ref");
    return {
      source: "arxiv",
      title: first(entry, "title"),
      authors: all(entry, "author").map((author) => first(author, "name")).filter(Boolean),
      year: published ? Number(published.slice(0, 4)) : undefined,
      date: published ? published.slice(0, 10) : undefined,
      venue: journal || undefined,
      type: "preprint",
      ids: { arxiv: id, doi: doi ? doi.toLowerCase() : undefined },
      url: `https://arxiv.org/abs/${id}`,
      abstract: first(entry, "summary") || undefined,
      openCopies: [{ url: `https://arxiv.org/pdf/${id}`, pdf: true, host: "arXiv" }],
    };
  });
  return { records, total: Number(first(feed, "opensearch:totalResults")) || records.length };
}

/**
 * One arXiv record through OAI-PMH, which also gives the paper's licence and
 * the DOI of the published version. The version suffix is not part of an OAI
 * identifier, so it is dropped for the call and kept in the record.
 */
export async function getArxivRecord(ctx: PaperContext, arxivId: string): Promise<PaperRecord | null> {
  const bare = arxivId.replace(/v\d+$/i, "");
  if (!/^[\w./-]+$/.test(bare)) return null;
  // Built by hand: the server does not answer when the colons are percent-encoded,
  // which URLSearchParams does.
  const url = `${OAI_API}?verb=GetRecord&identifier=oai:arXiv.org:${bare}&metadataPrefix=arXiv`;
  const doc = parseXml(await getText(ctx, url));
  const record = doc.getElementsByTagName("arXiv")[0];
  if (!record) return null;
  const doi = first(record, "doi");
  const journal = first(record, "journal-ref");
  const authors = all(record, "author").map((author) =>
    [first(author, "forenames"), first(author, "keyname")].filter(Boolean).join(" "),
  );
  return {
    source: "arxiv",
    title: first(record, "title"),
    authors,
    year: arxivYear(bare),
    venue: journal || undefined,
    type: "preprint",
    ids: { arxiv: arxivId, doi: doi ? doi.toLowerCase() : undefined },
    url: `https://arxiv.org/abs/${arxivId}`,
    abstract: first(record, "abstract") || undefined,
    licence: first(record, "license") || undefined,
    openCopies: [
      { url: `https://arxiv.org/pdf/${arxivId}`, pdf: true, host: "arXiv", licence: first(record, "license") || undefined },
    ],
  };
}
