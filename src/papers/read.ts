/**
 * Reading papers: find a readable copy, keep its text in the user's library,
 * and return it by the rules for its access:
 * - open copies (arXiv, open repositories, open-access publishers, SportRxiv)
 *   come back in full, by section;
 * - papers the user supplied (a file or a Zotero item) come back as an
 *   outline and passages of at most FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS
 *   characters (default 200).
 *
 * football-docs never logs in to a publisher or library, never holds the
 * user's credentials or cookies, and stops at bot checks.
 */

import { getArxivRecord } from "./arxiv.js";
import { DISABLED_MESSAGE, FetchError, type PaperContext, papersDisabled, reason, type ServiceLog, truncate } from "./core.js";
import { getCrossrefWork } from "./crossref.js";
import {
  type Access,
  canonicalKey,
  FORMAT,
  loadEntry,
  NoZoteroPdfError,
  passageChars,
  readZoteroPaper,
  type StoredPaper,
  saveEntry,
  userEntriesFor,
  zoteroCreators,
} from "./library.js";
import { getOpenAlexWork } from "./openalex.js";
import { licenceName, type PaperId, type PaperRecord, parsePaperId } from "./records.js";
import { findInMirror, loadMirror } from "./sportrxiv.js";
import { context, findQuote, outline, passages, type QuoteMatch, type Section, stripMarkdown } from "./text.js";
import { checkPublicUrl, fetchPage, type Lookup, pageText } from "./web.js";

// ---------------------------------------------------------------------------
// Metadata

export type Resolved = { record: PaperRecord; published?: PaperRecord };

/** Metadata for a DOI, arXiv ID or OpenAlex ID. Null when no source knows it. */
export async function resolveRecord(
  ctx: PaperContext,
  id: Extract<PaperId, { kind: "doi" | "arxiv" | "openalex" }>,
  log: ServiceLog,
): Promise<Resolved | null> {
  if (id.kind === "arxiv") {
    const record = await getArxivRecord(ctx, id.arxiv).catch((error) => {
      log.failed("arXiv", reason(error));
      throw error;
    });
    log.ok("arXiv");
    if (!record) return null;
    // The published version, when arXiv names one, has citation counts and other copies.
    if (record.ids.doi) {
      try {
        const published = await getOpenAlexWork(ctx, { doi: record.ids.doi });
        log.ok("OpenAlex");
        if (published) return { record, published };
      } catch (error) {
        log.failed("OpenAlex", reason(error));
      }
    }
    return { record };
  }
  if (id.kind === "openalex") {
    const record = await getOpenAlexWork(ctx, { openalex: id.openalex }).catch((error) => {
      log.failed("OpenAlex", reason(error));
      throw error;
    });
    log.ok("OpenAlex", record ? undefined : "no record");
    return record ? { record } : null;
  }
  let record: PaperRecord | null = null;
  try {
    record = await getOpenAlexWork(ctx, { doi: id.doi });
    log.ok("OpenAlex", record ? undefined : "no record");
  } catch (error) {
    log.failed("OpenAlex", reason(error));
  }
  if (!record && id.doi.startsWith("10.51224/")) {
    try {
      const state = await loadMirror(ctx);
      record = findInMirror(state.mirror, id.doi);
      log.ok("SportRxiv", state.refreshed === "cached" ? "local copy, no request sent" : "updated the local copy");
    } catch (error) {
      log.failed("SportRxiv", reason(error));
    }
  }
  if (!record) {
    record = await getCrossrefWork(ctx, id.doi).catch((error) => {
      log.failed("Crossref", reason(error));
      throw error;
    });
    log.ok("Crossref", record ? undefined : "no record");
  }
  return record ? { record } : null;
}

/** A record for a library entry, for get_paper. */
export function recordFromEntry(entry: StoredPaper): PaperRecord {
  return {
    source: entry.zotero ? "zotero" : entry.access === "user" ? "local" : "openalex",
    title: entry.title,
    authors: entry.authors,
    year: entry.year,
    ids: { ...entry.ids, zotero: entry.zotero },
    licence: entry.licence,
    openCopies: [],
  };
}

// ---------------------------------------------------------------------------
// Finding a readable copy

type Candidate = { url: string; licence?: string; label: string };

/** An HTML page shorter than this is a landing page with an abstract, not the paper. */
const MIN_HTML_PAPER_CHARS = 6000;
const MIN_PDF_PAPER_CHARS = 1000;

async function sportrxivDownloads(ctx: PaperContext, doi: string): Promise<Candidate[]> {
  try {
    const state = await loadMirror(ctx);
    const record = state.mirror.records.find((entry) => entry.doi === doi);
    if (!record) return [];
    const licence = record.rights.find((value) => /^https?:\/\//.test(value));
    // OAI lists galley viewer pages; the file itself is at /download/.
    return record.files.map((url) => ({ url: url.replace("/preprint/view/", "/preprint/download/"), licence, label: "SportRxiv" }));
  } catch {
    return [];
  }
}

async function candidatesFor(ctx: PaperContext, resolved: Resolved, log: ServiceLog): Promise<{ list: Candidate[]; arxivLicence?: string }> {
  const { record, published } = resolved;
  const list: Candidate[] = [];
  const arxiv = record.ids.arxiv ?? published?.ids.arxiv;
  let arxivLicence = record.source === "arxiv" ? record.licence : undefined;
  if (arxiv) {
    if (!arxivLicence) {
      try {
        arxivLicence = (await getArxivRecord(ctx, arxiv))?.licence;
        log.ok("arXiv", "licence");
      } catch (error) {
        log.failed("arXiv", reason(error));
      }
    }
    list.push({ url: `https://arxiv.org/html/${arxiv}`, licence: arxivLicence, label: "arXiv HTML" });
    list.push({ url: `https://arxiv.org/pdf/${arxiv}`, licence: arxivLicence, label: "arXiv PDF" });
  }
  const doi = record.ids.doi ?? published?.ids.doi;
  if (doi?.startsWith("10.51224/")) list.push(...(await sportrxivDownloads(ctx, doi)));
  const copies = [...record.openCopies, ...(published?.openCopies ?? [])];
  for (const copy of [...copies.filter((c) => c.pdf), ...copies.filter((c) => !c.pdf)]) {
    if (/arxiv\.org\//i.test(copy.url) && arxiv) continue;
    if (!list.some((candidate) => candidate.url === copy.url)) {
      list.push({ url: copy.url, licence: copy.licence, label: copy.host ?? new URL(copy.url).host });
    }
  }
  return { list, arxivLicence };
}

async function readCandidate(ctx: PaperContext, candidate: Candidate, lookup?: Lookup): Promise<Section[]> {
  const url = await checkPublicUrl(candidate.url, lookup);
  const page = await fetchPage(ctx, url, lookup);
  const content = await pageText(page);
  const length = content.sections.reduce((sum, section) => sum + section.text.length, 0);
  if (length < (content.pdf ? MIN_PDF_PAPER_CHARS : MIN_HTML_PAPER_CHARS)) {
    throw new FetchError(content.pdf ? "the PDF has almost no text (a scan?)" : "only a landing page, not the paper's text");
  }
  return content.sections;
}

export type Loaded = { entry: StoredPaper; fromLibrary: boolean };

/** The library entry for an ID: from the library, else read now. Returns an error message instead of throwing. */
export async function loadPaper(ctx: PaperContext, rawId: string, log: ServiceLog, lookup?: Lookup): Promise<Loaded | { error: string }> {
  const id = parsePaperId(rawId);
  switch (id.kind) {
    case "url":
      return { error: `${id.url} is a web address. Use get_web_source to read it, or match_quote with the URL.` };
    case "semantic-scholar":
      return { error: "Semantic Scholar IDs are not supported yet: the API needs a key in practice. Give the DOI or arXiv ID instead." };
    case "unknown":
      return {
        error: `"${id.value}" is not an ID football-docs knows. Give a DOI, an arXiv ID, an OpenAlex ID, local:… from add_local_paper or zotero:… from search_papers.`,
      };
    case "local": {
      const entry = loadEntry(ctx, id.key);
      return entry ? { entry, fromLibrary: true } : { error: `${id.key} is not in your library. Add the file with add_local_paper.` };
    }
    case "zotero": {
      const cached = loadEntry(ctx, `zotero:${id.key}`);
      if (cached) return { entry: cached, fromLibrary: true };
      try {
        const paper = await readZoteroPaper(ctx, id.key);
        log.ok(paper.label);
        const year = Number(paper.item.data.date?.match(/\d{4}/)?.[0]);
        const entry: StoredPaper = {
          format: FORMAT,
          key: `local:${paper.sha256.slice(0, 16)}`,
          access: "user",
          title: paper.item.data.title || paper.attachment.data.title || "(untitled)",
          authors: zoteroCreators(paper.item),
          year: Number.isFinite(year) ? year : undefined,
          ids: { doi: paper.item.data.DOI?.toLowerCase() || undefined },
          origin: `Zotero item ${paper.item.key}${paper.label === "Zotero web API" ? " (Zotero web API)" : ""}`,
          zotero: id.key,
          sha256: paper.sha256,
          savedAt: new Date(ctx.now()).toISOString(),
          sections: paper.sections,
        };
        saveEntry(ctx, entry);
        return { entry, fromLibrary: false };
      } catch (error) {
        // An item saved without its PDF: read the paper by its DOI instead,
        // which finds an open copy when there is one.
        if (error instanceof NoZoteroPdfError) {
          log.ok(error.label, "item has no PDF");
          const doi = error.item.data.DOI?.trim();
          if (doi) return loadPaper(ctx, doi, log, lookup);
          return { error: `The Zotero item ${id.key} has no PDF attachment and no DOI. Attach the PDF in Zotero, or use add_local_paper.` };
        }
        log.failed("Zotero", reason(error));
        return { error: `Could not read zotero:${id.key}: ${reason(error)}.` };
      }
    }
  }

  const directKey = id.kind === "doi" ? `doi:${id.doi}` : id.kind === "arxiv" ? `arxiv:${id.arxiv.replace(/v\d+$/i, "")}` : `openalex:${id.openalex}`;
  const cached = loadEntry(ctx, directKey);
  if (cached) return { entry: cached, fromLibrary: true };

  const userCopy = () => (id.kind === "doi" ? userEntriesFor(ctx, id.doi)[0] : undefined);
  if (papersDisabled(ctx.env)) {
    const own = userCopy();
    return own ? { entry: own, fromLibrary: true } : { error: DISABLED_MESSAGE };
  }

  let resolved: Resolved | null;
  try {
    resolved = await resolveRecord(ctx, id, log);
  } catch (error) {
    return { error: `Could not look up ${rawId}: ${reason(error)}.` };
  }
  if (!resolved) {
    const own = userCopy();
    return own ? { entry: own, fromLibrary: true } : { error: `No record found for ${rawId}.` };
  }

  // The same paper may be in the library under another of its IDs.
  const { record, published } = resolved;
  for (const key of [record.ids.doi && `doi:${record.ids.doi}`, record.ids.arxiv && `arxiv:${record.ids.arxiv.replace(/v\d+$/i, "")}`, record.ids.openalex && `openalex:${record.ids.openalex}`]) {
    const hit = key ? loadEntry(ctx, key) : null;
    if (hit) return { entry: hit, fromLibrary: true };
  }

  const { list } = await candidatesFor(ctx, resolved, log);
  const tried: string[] = [];
  for (const candidate of list) {
    try {
      const sections = await readCandidate(ctx, candidate, lookup);
      log.ok(new URL(candidate.url).host, candidate.label);
      const ids = { ...published?.ids, ...record.ids };
      const key = ids.arxiv ? `arxiv:${ids.arxiv.replace(/v\d+$/i, "")}` : ids.doi ? `doi:${ids.doi}` : `openalex:${ids.openalex}`;
      const entry: StoredPaper = {
        format: FORMAT,
        key: canonicalKey(key),
        access: "open",
        title: record.title,
        authors: record.authors,
        year: record.year,
        ids,
        origin: candidate.url,
        licence: candidate.licence,
        savedAt: new Date(ctx.now()).toISOString(),
        sections,
      };
      saveEntry(ctx, entry);
      return { entry, fromLibrary: false };
    } catch (error) {
      log.failed(new URL(candidate.url).host, reason(error));
      tried.push(`${candidate.url} (${reason(error)})`);
    }
  }

  const own = record.ids.doi ? userEntriesFor(ctx, record.ids.doi)[0] : undefined;
  if (own) return { entry: own, fromLibrary: true };
  return {
    error: [
      `No open copy of "${record.title}" could be read.`,
      tried.length ? `Tried:\n${tried.map((line) => `- ${line}`).join("\n")}` : "No open copy is known.",
      "If you have access to the paper, download the PDF and call add_local_paper with its path, or add it to Zotero and use its zotero: ID.",
    ].join("\n"),
  };
}

// ---------------------------------------------------------------------------
// Output

export function entryHeader(entry: StoredPaper, cap: number): string[] {
  const lines = [`# ${entry.title}`, ""];
  lines.push(`- **Authors:** ${entry.authors.join(", ") || "not listed"}${entry.year ? ` (${entry.year})` : ""}`);
  const ids = [
    entry.ids.doi && `DOI ${entry.ids.doi}`,
    entry.ids.arxiv && `arXiv ${entry.ids.arxiv}`,
    entry.ids.openalex && `OpenAlex ${entry.ids.openalex}`,
    entry.key.startsWith("local:") && entry.key,
    entry.zotero && `zotero:${entry.zotero}`,
  ].filter(Boolean);
  lines.push(`- **IDs:** ${ids.join(" · ") || "none"}`);
  if (entry.access === "open") {
    lines.push(`- **Text from:** ${entry.origin}`);
    lines.push(`- **Licence:** ${entry.licence ? licenceName(entry.licence) : "unknown"}`);
    lines.push("- **Access:** open copy, so the full text is returned");
  } else {
    lines.push(`- **Text from:** ${entry.origin}`);
    lines.push(`- **Access:** your copy, so only the outline and passages of at most ${cap} characters are returned`);
  }
  return lines;
}

/** Passages for a query across sections, labelled with their section. */
export function sectionPassages(sections: Section[], query: string, cap: number, limit = 5): string[] {
  const out: string[] = [];
  for (const [index, section] of sections.entries()) {
    for (const passage of passages(section.text, query, cap, limit - out.length)) {
      out.push(`- [section ${index}: ${section.heading}${section.page ? `, page ${section.page}` : ""}] ${passage}`);
    }
    if (out.length >= limit) break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Quote matching

export type QuoteResult = { match: QuoteMatch; section: number; heading: string; page?: number };

export function bestQuoteMatch(sections: Section[], quote: string): QuoteResult | null {
  const rank = { exact: 3, normalised: 2, close: 1, none: 0 };
  let best: QuoteResult | null = null;
  for (const [index, section] of sections.entries()) {
    const match = findQuote(section.text, quote);
    if (
      !best ||
      rank[match.kind] > rank[best.match.kind] ||
      (rank[match.kind] === rank[best.match.kind] && match.score > best.match.score)
    ) {
      best = { match, section: index, heading: section.heading, page: section.page };
    }
    if (match.kind === "exact") break;
  }
  return best;
}

const VERDICTS: Record<QuoteMatch["kind"], string> = {
  exact: "The quote appears word for word.",
  normalised: "The quote appears with the same words; only case, spacing, quote marks, ligatures or hyphens differ.",
  close: "The source says something close but not the same. Quote the source's own words, shown below.",
  none: "The quote does not appear in the source.",
};

/** The report for a quote match. For user papers, every piece of source text stays within cap characters. */
export function quoteReport(sections: Section[], quote: string, access: Access, cap: number): string[] {
  const best = bestQuoteMatch(sections, quote);
  if (!best) return ["The source has no text to match against."];
  const { match } = best;
  const text = sections[best.section].text;
  const where = `section ${best.section} (${best.heading}${best.page ? `, page ${best.page}` : ""}), characters ${match.start} to ${match.end}`;
  const lines = [`**Result: ${match.kind}${match.kind === "close" || match.kind === "none" ? ` (similarity ${match.score.toFixed(2)})` : ""}.** ${VERDICTS[match.kind]}`, ""];
  // Selectors and passages carry the source's words, without markdown marks.
  // A hyphen at a line end stays, joined to the next line.
  const plain = (value: string) => stripMarkdown(value).replace(/-[ \t]*\n[ \t]*/g, "-").replace(/\s+/g, " ");
  const found = plain(text.slice(match.start, match.end));

  if (match.kind === "none") {
    if (match.score > 0.5) {
      const limit = access === "open" ? 400 : cap;
      lines.push(`Closest passage, in ${where}:`, "", `> ${truncate(found, limit)}`);
    }
    return lines;
  }

  lines.push(`- **Where:** ${where}`);
  if (access === "open") {
    const { prefix, suffix } = context(text, match.start, match.end, 60);
    lines.push(
      "- **Text quote selector** (W3C):",
      "",
      "```json",
      JSON.stringify({ type: "TextQuoteSelector", exact: found, prefix: plain(prefix), suffix: plain(suffix) }, null, 2),
      "```",
    );
  } else {
    const exact = truncate(found, cap - 1);
    const room = cap - exact.length;
    const near = room >= 20 ? context(text, match.start, match.end, Math.floor(room / 2)) : { prefix: "", suffix: "" };
    // Removing markdown only shortens the text, so the cap still holds.
    const prefix = plain(near.prefix);
    const suffix = plain(near.suffix);
    lines.push(
      `- **Text quote selector** (W3C; your copy, so at most ${cap} characters of source text):`,
      "",
      "```json",
      JSON.stringify({ type: "TextQuoteSelector", exact, prefix, suffix }, null, 2),
      "```",
    );
  }
  return lines;
}

export { outline, passageChars };
