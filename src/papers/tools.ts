/**
 * The paper tools: search_papers, get_paper, get_web_source, read_paper,
 * match_quote, add_local_paper, forget_paper and purge_cache.
 *
 * Each reply ends with the services the call asked, so the user can see what
 * left the machine. FOOTBALL_DOCS_PAPERS=off stops every request that would
 * leave it; the library, local files and Zotero on this computer still work.
 */

import { searchArxiv } from "./arxiv.js";
import {
  contextFrom,
  DISABLED_MESSAGE,
  type PaperOptions,
  papersDisabled,
  reason,
  ServiceLog,
  type ToolResponse,
  textResult,
} from "./core.js";
import {
  FORMAT,
  forgetEntry,
  fromZotero,
  listEntries,
  loadEntry,
  passageChars,
  purgeAll,
  readLocalPdf,
  type StoredPaper,
  saveEntry,
  searchZotero,
} from "./library.js";
import { searchOpenAlex } from "./openalex.js";
import { entryHeader, loadPaper, quoteReport, type Resolved, recordFromEntry, resolveRecord, sectionPassages } from "./read.js";
import { formatHit, formatRecord, formatSummary, identityKeys, type PaperRecord, type PaperSource, parsePaperId, SOURCE_NAMES } from "./records.js";
import { loadMirror, searchMirror } from "./sportrxiv.js";
import { outline, renderFull } from "./text.js";
import { type Lookup, loadWebSource, readWebSource, type WebSourceArgs } from "./web.js";

export const SEARCH_SOURCES = ["openalex", "arxiv", "sportrxiv", "zotero"] as const;
export type SearchSource = (typeof SEARCH_SOURCES)[number];
/** Zotero is asked only when named: it is the user's own library, not a public source. */
const DEFAULT_SOURCES: SearchSource[] = ["openalex", "arxiv", "sportrxiv"];

export type SearchPapersArgs = {
  query: string;
  sources?: SearchSource[];
  max_results?: number;
  year_from?: number;
  year_to?: number;
};

type SourceResult = { source: PaperSource; records: PaperRecord[]; total: number };

function withFooter(text: string, log: ServiceLog, isError = false): ToolResponse {
  return textResult(`${text}\n\n${log.footer()}`, isError);
}

/** Merge a later record's IDs and copies into an earlier one for the same paper. */
function mergeInto(target: PaperRecord, other: PaperRecord): void {
  target.ids = { ...other.ids, ...target.ids };
  for (const copy of other.openCopies) {
    if (!target.openCopies.some((existing) => existing.url === copy.url)) target.openCopies.push(copy);
  }
  target.abstract ??= other.abstract;
}

export async function searchPapers(args: SearchPapersArgs, options: PaperOptions = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  const query = args.query.trim();
  if (!query) return textResult("Give a query: words, \"quoted phrases\", AND / OR / NOT.", true);

  const limit = Math.min(Math.max(1, Math.round(args.max_results ?? 10)), 25);
  const asked = args.sources?.length ? [...new Set(args.sources)] : DEFAULT_SOURCES;
  const notes: string[] = [];
  let sources = asked;
  if (papersDisabled(ctx.env)) {
    sources = asked.filter((source) => source === "zotero");
    if (!sources.length) return textResult(DISABLED_MESSAGE);
    notes.push("Public sources were not asked: lookups are off (FOOTBALL_DOCS_PAPERS=off).");
  }
  // Zotero last, so its hits fold into the public records for the same paper.
  sources = [...sources.filter((source) => source !== "zotero"), ...sources.filter((source) => source === "zotero")];
  const log = new ServiceLog();

  const runs = sources.map(async (source): Promise<SourceResult | null> => {
    try {
      if (source === "openalex") {
        const found = await searchOpenAlex(ctx, query, { limit, yearFrom: args.year_from, yearTo: args.year_to });
        if (found.note) notes.push(found.note);
        log.ok("OpenAlex", `${found.total} matches`);
        return { source, records: found.records, total: found.total };
      }
      if (source === "arxiv") {
        const found = await searchArxiv(ctx, query, { limit });
        const records = found.records.filter(
          (record) =>
            (!args.year_from || (record.year ?? 0) >= args.year_from) && (!args.year_to || (record.year ?? 9999) <= args.year_to),
        );
        log.ok("arXiv", `${found.total} matches`);
        return { source, records, total: found.total };
      }
      if (source === "zotero") {
        const items = await searchZotero(ctx, query, limit);
        log.ok("Zotero on this computer", `${items.length} matches`);
        return { source, records: items.map(fromZotero), total: items.length };
      }
      const state = await loadMirror(ctx);
      const found = searchMirror(state.mirror, query, limit * 3);
      const records = found.records
        .filter(
          (record) =>
            (!args.year_from || (record.year ?? 0) >= args.year_from) && (!args.year_to || (record.year ?? 9999) <= args.year_to),
        )
        .slice(0, limit);
      const detail =
        state.refreshed === "full"
          ? "downloaded its feed"
          : state.refreshed === "update"
            ? "updated the local copy"
            : `local copy from ${state.mirror.harvestedAt.slice(0, 10)}, no request sent`;
      log.ok("SportRxiv", `${detail}; ${found.total} matches`);
      if (state.stale) notes.push(`SportRxiv: ${state.stale}.`);
      return { source, records, total: found.total };
    } catch (error) {
      log.failed(SOURCE_NAMES[source], reason(error));
      return null;
    }
  });
  const results = (await Promise.all(runs)).filter((result): result is SourceResult => result !== null);

  // Fold duplicates into the first record seen, in source order.
  const byKey = new Map<string, PaperRecord>();
  const sections: Array<{ source: PaperSource; total: number; records: PaperRecord[] }> = [];
  for (const result of results) {
    const kept: PaperRecord[] = [];
    for (const record of result.records) {
      const keys = identityKeys(record);
      const existing = keys.map((key) => byKey.get(key)).find(Boolean);
      if (existing) {
        mergeInto(existing, record);
        for (const key of identityKeys(existing)) byKey.set(key, existing);
        continue;
      }
      for (const key of keys) byKey.set(key, record);
      kept.push(record);
    }
    sections.push({ source: result.source, total: result.total, records: kept });
  }

  const lines = [`# Papers for: ${query}`, ""];
  let index = 0;
  for (const section of sections) {
    lines.push(`## ${SOURCE_NAMES[section.source]} (${section.records.length} shown of ${section.total})`, "");
    if (!section.records.length) lines.push("No new matches.", "");
    for (const record of section.records) lines.push(formatHit(record, ++index), "");
  }
  if (!index) {
    lines.push(
      "No paper matched. Try fewer words, a quoted phrase (\"expected threat\"), or an author's name.",
      "Many football methods were first published as blog posts or conference papers without a DOI.",
      "Search the web for those, then read the page with get_web_source.",
      "",
    );
  } else {
    lines.push(
      "Open one with get_paper, or read it with read_paper (DOI, arXiv ID, OpenAlex ID or zotero: ID). OpenAlex matches full text, so a hit may only cite the idea.",
      "",
    );
  }
  lines.push(...notes);
  return withFooter(lines.join("\n").trimEnd(), log, results.length === 0);
}

export type GetPaperArgs = { id: string };

export async function getPaper(args: GetPaperArgs, options: PaperOptions = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  const id = parsePaperId(args.id);
  const log = new ServiceLog();

  switch (id.kind) {
    case "semantic-scholar":
      return textResult("Semantic Scholar IDs are not supported yet: the API needs a key in practice. Give the DOI or arXiv ID instead.", true);
    case "url":
      return textResult(`${id.url} is not a DOI, arXiv or OpenAlex link. To read a web page, use get_web_source.`, true);
    case "unknown":
      return textResult(
        `"${id.value}" is not an ID get_paper knows. Give a DOI (10.1145/3292500.3330758), an arXiv ID (1802.07127) or an OpenAlex ID (W4288278931). To find one, use search_papers.`,
        true,
      );
    case "local": {
      const entry = loadEntry(ctx, id.key);
      if (!entry) return textResult(`${id.key} is not in your library.`, true);
      return textResult(formatRecord(recordFromEntry(entry)));
    }
    case "zotero": {
      try {
        const loaded = await loadPaper(ctx, `zotero:${id.key}`, log);
        if ("error" in loaded) return withFooter(loaded.error, log, true);
        return withFooter(formatRecord(recordFromEntry(loaded.entry)), log);
      } catch (error) {
        return withFooter(`Could not read zotero:${id.key}: ${reason(error)}.`, log, true);
      }
    }
  }

  if (papersDisabled(ctx.env)) return textResult(DISABLED_MESSAGE);
  let resolved: Resolved | null;
  try {
    resolved = await resolveRecord(ctx, id, log);
  } catch {
    return withFooter(`Could not look up ${args.id}.`, log, true);
  }
  if (!resolved) return withFooter(`No record found for ${args.id}.`, log, true);
  const extra = resolved.published ? ["", "## Published version", "", ...formatSummary(resolved.published)] : [];
  return withFooter([formatRecord(resolved.record), ...extra].join("\n"), log);
}

export async function getWebSource(
  args: WebSourceArgs,
  options: PaperOptions & { lookup?: Lookup } = {},
): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  if (papersDisabled(ctx.env)) return textResult(DISABLED_MESSAGE);
  const log = new ServiceLog();
  const result = await readWebSource(ctx, args, log, options.lookup);
  return withFooter(result.text, log, result.isError);
}

// ---------------------------------------------------------------------------
// Reading

export type ReadPaperArgs = { id: string; section?: number; query?: string };

export async function readPaper(args: ReadPaperArgs, options: PaperOptions & { lookup?: Lookup } = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  const log = new ServiceLog();
  const loaded = await loadPaper(ctx, args.id, log, options.lookup);
  if ("error" in loaded) return withFooter(loaded.error, log, true);
  const { entry, fromLibrary } = loaded;
  if (fromLibrary) log.ok("your library", "no request sent");
  const cap = passageChars(ctx.env);
  const lines = [...entryHeader(entry, cap), ""];

  if (entry.access === "open") {
    if (args.query) {
      const found = sectionPassages(entry.sections, args.query, 400, 10);
      lines.push(`## Passages for "${args.query}"`, "", ...(found.length ? found : ["No passage holds every term."]));
      return withFooter(lines.join("\n"), log);
    }
    const rendered = renderFull(entry.sections, args.section);
    return withFooter([...lines, ...rendered.lines].join("\n").trimEnd(), log, rendered.isError);
  }

  // A paper the user supplied: outline and short passages only.
  if (args.section !== undefined) {
    lines.push(
      `Sections of papers you supplied are not returned whole. Use query to get passages of at most ${cap} characters, or match_quote to check a quote.`,
    );
    return withFooter(lines.join("\n"), log, true);
  }
  lines.push("## Outline", "", outline(entry.sections), "");
  if (args.query) {
    const found = sectionPassages(entry.sections, args.query, cap);
    lines.push(`## Passages for "${args.query}"`, "", ...(found.length ? found : ["No passage holds every term."]));
  } else {
    lines.push(`Call again with query to get up to five passages of at most ${cap} characters, or use match_quote.`);
  }
  return withFooter(lines.join("\n"), log);
}

export type MatchQuoteArgs = { source: string; quote: string };

export async function matchQuote(args: MatchQuoteArgs, options: PaperOptions & { lookup?: Lookup } = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  const log = new ServiceLog();
  const quote = args.quote.trim();
  if (quote.length < 10) return textResult("Give a quote of at least 10 characters.", true);
  const cap = passageChars(ctx.env);

  if (/^https?:\/\//i.test(args.source.trim())) {
    if (papersDisabled(ctx.env)) return textResult(DISABLED_MESSAGE);
    const loaded = await loadWebSource(ctx, args.source, log, options.lookup);
    if ("error" in loaded) return withFooter(loaded.error, log, true);
    const lines = [`# Quote check: ${loaded.content.title ?? loaded.url.href}`, "", `- **Source:** ${loaded.url.href}`];
    if (loaded.snapshots.latest) lines.push(`- **Wayback snapshot:** ${loaded.snapshots.latest.url}`);
    lines.push("", ...quoteReport(loaded.content.sections, quote, "open", cap));
    return withFooter(lines.join("\n"), log);
  }

  const loaded = await loadPaper(ctx, args.source, log, options.lookup);
  if ("error" in loaded) return withFooter(loaded.error, log, true);
  if (loaded.fromLibrary) log.ok("your library", "no request sent");
  const { entry } = loaded;
  const lines = [`# Quote check: ${entry.title}`, "", `- **Source:** ${entry.origin}`, ""];
  lines.push(...quoteReport(entry.sections, quote, entry.access, cap));
  return withFooter(lines.join("\n"), log);
}

// ---------------------------------------------------------------------------
// The user's library

export type AddLocalPaperArgs = { path: string; id?: string };

export async function addLocalPaper(args: AddLocalPaperArgs, options: PaperOptions = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  const log = new ServiceLog();
  let pdf: Awaited<ReturnType<typeof readLocalPdf>>;
  try {
    pdf = await readLocalPdf(args.path);
  } catch (error) {
    return textResult(`Could not add ${args.path}: ${reason(error)}.`, true);
  }
  const key = `local:${pdf.sha256.slice(0, 16)}`;
  const existing = loadEntry(ctx, key);
  if (existing) {
    return textResult(`This file is already in your library as ${key} ("${existing.title}"). Read it with read_paper.`);
  }

  // Metadata: from the ID given or the DOI printed in the file, when lookups are on.
  let record: PaperRecord | null = null;
  const idText = args.id ?? pdf.doi;
  const id = idText ? parsePaperId(idText) : null;
  if (id && (id.kind === "doi" || id.kind === "arxiv" || id.kind === "openalex") && !papersDisabled(ctx.env)) {
    try {
      record = (await resolveRecord(ctx, id, log))?.record ?? null;
    } catch {
      record = null;
    }
  }
  const entry: StoredPaper = {
    format: FORMAT,
    key,
    access: "user",
    title: record?.title ?? pdf.title ?? pdf.name,
    authors: record?.authors ?? (pdf.author ? [pdf.author] : []),
    year: record?.year,
    ids: { doi: record?.ids.doi ?? (id?.kind === "doi" ? id.doi : pdf.doi), arxiv: record?.ids.arxiv, openalex: record?.ids.openalex },
    origin: `your file ${pdf.name}`,
    sha256: pdf.sha256,
    savedAt: new Date(ctx.now()).toISOString(),
    sections: pdf.sections,
  };
  saveEntry(ctx, entry);
  const cap = passageChars(ctx.env);
  const lines = [
    `Added "${entry.title}" to your library as **${key}**.`,
    "",
    ...entryHeader(entry, cap),
    "",
    "## Outline",
    "",
    outline(entry.sections),
    "",
    "The text stays in your cache folder and is never sent anywhere. Read it with read_paper and match_quote.",
  ];
  return withFooter(lines.join("\n"), log);
}

export type ForgetPaperArgs = { id: string };

export async function forgetPaper(args: ForgetPaperArgs, options: PaperOptions = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  const id = parsePaperId(args.id);
  const key =
    id.kind === "local"
      ? id.key
      : id.kind === "zotero"
        ? `zotero:${id.key}`
        : id.kind === "doi"
          ? `doi:${id.doi}`
          : id.kind === "arxiv"
            ? `arxiv:${id.arxiv.replace(/v\d+$/i, "")}`
            : id.kind === "openalex"
              ? `openalex:${id.openalex}`
              : null;
  const removed = key ? forgetEntry(ctx, key) : null;
  if (!removed) return textResult(`${args.id} is not in your library.`, true);
  return textResult(
    `Removed "${removed.title}" (${removed.key}) from your library.${removed.access === "user" ? " Your original file and Zotero are not touched." : ""}`,
  );
}

export type PurgeCacheArgs = { confirm: boolean };

export async function purgeCache(args: PurgeCacheArgs, options: PaperOptions = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  if (args.confirm !== true) {
    const count = listEntries(ctx).length;
    return textResult(
      `This deletes the paper library in ${ctx.cacheDir} (${count} papers) and the SportRxiv copy. Call again with confirm: true to do it.`,
      true,
    );
  }
  const { papers, bytes } = purgeAll(ctx);
  return textResult(`Deleted ${papers} papers and ${Math.round(bytes / 1024)} KB from ${ctx.cacheDir}. Your original files and Zotero are not touched.`);
}
