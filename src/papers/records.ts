/**
 * The paper record every source maps into, the identifier parser, and the
 * text formatting the tools share.
 */

import { truncate } from "./core.js";

export type PaperSource = "openalex" | "arxiv" | "sportrxiv" | "crossref" | "zotero" | "local";

export const SOURCE_NAMES: Record<PaperSource, string> = {
  openalex: "OpenAlex",
  arxiv: "arXiv",
  sportrxiv: "SportRxiv",
  crossref: "Crossref",
  zotero: "your Zotero library",
  local: "a file you added",
};

export type OpenCopy = {
  url: string;
  /** True when the URL is a PDF rather than a landing page. */
  pdf: boolean;
  licence?: string;
  /** submittedVersion, acceptedVersion or publishedVersion, when the source says. */
  version?: string;
  host?: string;
};

export type PaperRecord = {
  source: PaperSource;
  title: string;
  authors: string[];
  year?: number;
  date?: string;
  venue?: string;
  type?: string;
  ids: { doi?: string; arxiv?: string; openalex?: string; zotero?: string };
  /** The record's landing page. */
  url?: string;
  abstract?: string;
  citedBy?: number;
  /** The licence of the record's own copy, where the source states one (arXiv, SportRxiv). */
  licence?: string;
  oaStatus?: string;
  openCopies: OpenCopy[];
};

// ---------------------------------------------------------------------------
// Identifiers

export type PaperId =
  | { kind: "doi"; doi: string }
  | { kind: "arxiv"; arxiv: string }
  | { kind: "openalex"; openalex: string }
  | { kind: "local"; key: string }
  | { kind: "zotero"; key: string }
  | { kind: "semantic-scholar"; value: string }
  | { kind: "url"; url: string }
  | { kind: "unknown"; value: string };

const ARXIV_NEW = /^(\d{4}\.\d{4,5})(v\d+)?$/i;
const ARXIV_OLD = /^([a-z-]+(?:\.[a-z]{2})?\/\d{7})(v\d+)?$/i;
const SPORTRXIV_VIEW = /sportrxiv\.org\/index\.php\/server\/preprint\/view\/(\d+)/i;

/** The arXiv ID without "arXiv:" and with its version, if one was given. */
function arxivFrom(value: string): string | null {
  const bare = value.replace(/^arxiv:\s*/i, "");
  const match = bare.match(ARXIV_NEW) ?? bare.match(ARXIV_OLD);
  return match ? match[1] + (match[2] ?? "") : null;
}

export function normaliseDoi(value: string): string {
  return value
    .trim()
    .replace(/^doi:\s*/i, "")
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .toLowerCase();
}

export function parsePaperId(input: string): PaperId {
  const value = input.trim();

  const local = value.match(/^local:([0-9a-f]{12,64})$/i);
  if (local) return { kind: "local", key: `local:${local[1].toLowerCase()}` };
  const zotero = value.match(/^zotero:([A-Za-z0-9]{8})$/);
  if (zotero) return { kind: "zotero", key: zotero[1].toUpperCase() };

  const arxiv = arxivFrom(value);
  if (arxiv) return { kind: "arxiv", arxiv };

  const sportrxiv = value.match(SPORTRXIV_VIEW);
  if (sportrxiv) return { kind: "doi", doi: `10.51224/srxiv.${sportrxiv[1]}` };

  const arxivUrl = value.match(/arxiv\.org\/(?:abs|pdf|html)\/([^?#]+?)(?:\.pdf)?\/?(?:[?#].*)?$/i);
  if (arxivUrl) {
    const id = arxivFrom(arxivUrl[1]);
    if (id) return { kind: "arxiv", arxiv: id };
  }

  const openalex = value.match(/^(?:https?:\/\/(?:api\.)?openalex\.org\/(?:works\/)?)?(W\d+)$/i);
  if (openalex) return { kind: "openalex", openalex: openalex[1].toUpperCase() };

  const doi = normaliseDoi(value);
  if (/^10\.\d{4,9}\/\S+$/.test(doi)) {
    // arXiv's own DOIs name the preprint, so resolve them through arXiv.
    const arxivDoi = doi.match(/^10\.48550\/arxiv\.(.+)$/);
    const id = arxivDoi ? arxivFrom(arxivDoi[1]) : null;
    if (id) return { kind: "arxiv", arxiv: id };
    return { kind: "doi", doi };
  }

  if (/^corpusid:\s*\d+$/i.test(value) || /^[0-9a-f]{40}$/i.test(value) || /semanticscholar\.org\/paper\//i.test(value)) {
    return { kind: "semantic-scholar", value };
  }
  if (/^https?:\/\//i.test(value)) return { kind: "url", url: value };
  return { kind: "unknown", value };
}

/** Keys that identify the same paper across sources. */
export function identityKeys(record: PaperRecord): string[] {
  const keys: string[] = [];
  if (record.ids.doi) keys.push(`doi:${record.ids.doi.toLowerCase()}`);
  if (record.ids.arxiv) keys.push(`arxiv:${record.ids.arxiv.replace(/v\d+$/, "").toLowerCase()}`);
  if (record.ids.openalex) keys.push(`openalex:${record.ids.openalex}`);
  return keys;
}

// ---------------------------------------------------------------------------
// Licences

const ARXIV_LICENCES: Record<string, string> = {
  "nonexclusive-distrib/1.0": "arXiv non-exclusive licence to distribute (all rights stay with the authors)",
};

/** A readable name for a licence URL or code, keeping the URL when it is unknown. */
export function licenceName(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const text = value.trim();
  const arxiv = text.match(/arxiv\.org\/licenses\/(.+?)\/?$/i);
  if (arxiv) return ARXIV_LICENCES[arxiv[1]] ?? text;
  const cc = text.match(/creativecommons\.org\/(licenses|publicdomain)\/([a-z-]+)\/(\d\.\d)/i);
  if (cc) {
    if (cc[1].toLowerCase() === "publicdomain") return `CC0 ${cc[3]}`;
    return `CC ${cc[2].toUpperCase()} ${cc[3]}`;
  }
  // OpenAlex codes: cc-by, cc-by-nc-nd, other-oa, public-domain.
  if (/^cc-/i.test(text)) return text.toUpperCase().replace(/^CC-/, "CC ");
  return text;
}

// ---------------------------------------------------------------------------
// Formatting

function authorLine(authors: string[], max = 3): string {
  if (!authors.length) return "authors not listed";
  if (authors.length <= max) return authors.join(", ");
  return `${authors.slice(0, max).join(", ")} and ${authors.length - max} more`;
}

function idLine(record: PaperRecord): string {
  const parts: string[] = [];
  if (record.ids.doi) parts.push(`DOI ${record.ids.doi}`);
  if (record.ids.arxiv) parts.push(`arXiv ${record.ids.arxiv}`);
  if (record.ids.openalex) parts.push(`OpenAlex ${record.ids.openalex}`);
  if (record.ids.zotero) parts.push(`zotero:${record.ids.zotero}`);
  return parts.join(" · ") || "no stable ID";
}

function copyLine(copy: OpenCopy): string {
  const facts = [copy.pdf ? "PDF" : "page", copy.host, copy.version, copy.licence ? `licence: ${licenceName(copy.licence)}` : "licence unknown"];
  return `${copy.url} (${facts.filter(Boolean).join(", ")})`;
}

/** A short summary of a record: title, authors, IDs, first open copy, start of the abstract. */
export function formatSummary(record: PaperRecord): string[] {
  const lines = [
    `**${record.title}**`,
    `${authorLine(record.authors)}${record.year ? ` (${record.year})` : ""}${record.venue ? ` · ${record.venue}` : ""}`,
    `${idLine(record)}${record.citedBy !== undefined ? ` · cited by ${record.citedBy}` : ""} · from ${SOURCE_NAMES[record.source]}`,
  ];
  const open = record.openCopies[0];
  if (open) lines.push(`Open copy: ${copyLine(open)}`);
  else if (record.oaStatus === "closed") lines.push("No open copy known.");
  if (record.abstract) lines.push(truncate(record.abstract, 240));
  return lines;
}

/** One search hit: enough to choose which paper to open with get_paper. */
export function formatHit(record: PaperRecord, index: number): string {
  const [title, ...rest] = formatSummary(record);
  return [`${index}. ${title}`, ...rest.map((line) => `   ${line}`)].join("\n");
}

/** A citation line in author-year form, built only from the record's fields. */
export function citeAs(record: PaperRecord): string {
  // An arXiv record's DOI belongs to the published version, so cite the preprint itself.
  const link =
    record.source === "arxiv" && record.ids.arxiv
      ? `arXiv:${record.ids.arxiv}. https://arxiv.org/abs/${record.ids.arxiv}`
      : record.ids.doi
        ? `https://doi.org/${record.ids.doi}`
        : record.ids.arxiv
          ? `https://arxiv.org/abs/${record.ids.arxiv}`
          : record.url;
  const parts = [
    `${record.authors.join(", ") || "Unknown authors"} (${record.year ?? "n.d."}).`,
    `${record.title}.`,
    record.venue ? `${record.venue}.` : "",
    link ?? "",
  ];
  return parts.filter(Boolean).join(" ");
}

/** The full record for get_paper. */
export function formatRecord(record: PaperRecord): string {
  const lines = [`# ${record.title}`, ""];
  lines.push(`- **Authors:** ${record.authors.join(", ") || "not listed"}`);
  if (record.date || record.year) lines.push(`- **Date:** ${record.date ?? record.year}`);
  if (record.venue) lines.push(`- **Venue:** ${record.venue}`);
  if (record.type) lines.push(`- **Type:** ${record.type}`);
  lines.push(`- **IDs:** ${idLine(record)}`);
  if (record.source === "arxiv" && record.ids.doi) lines.push("  (The DOI is the published version's; see below.)");
  if (record.url) lines.push(`- **Landing page:** ${record.url}`);
  if (record.citedBy !== undefined) lines.push(`- **Cited by:** ${record.citedBy} works (OpenAlex count)`);
  if (record.licence) lines.push(`- **Licence:** ${licenceName(record.licence)}`);
  if (record.oaStatus) lines.push(`- **Open access status:** ${record.oaStatus}`);
  lines.push(`- **Record from:** ${SOURCE_NAMES[record.source]}`);
  lines.push("");
  if (record.openCopies.length) {
    lines.push("## Open copies", "");
    for (const copy of record.openCopies) lines.push(`- ${copyLine(copy)}`);
    lines.push("");
  } else {
    lines.push("## Open copies", "", "None known to the source. The paper may be behind a paywall.", "");
  }
  if (record.abstract) lines.push("## Abstract", "", record.abstract, "");
  lines.push("## Cite as", "", citeAs(record));
  return lines.join("\n");
}
