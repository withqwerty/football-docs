/**
 * The paper tools: search_papers, get_paper and get_web_source.
 *
 * Each reply ends with the services the call asked, so the user can see what
 * left the machine. FOOTBALL_DOCS_PAPERS=off stops every call before it sends
 * anything.
 */

import { getArxivRecord, searchArxiv } from "./arxiv.js";
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
import { getCrossrefWork } from "./crossref.js";
import { getOpenAlexWork, searchOpenAlex } from "./openalex.js";
import { formatHit, formatRecord, formatSummary, identityKeys, type PaperRecord, type PaperSource, parsePaperId, SOURCE_NAMES } from "./records.js";
import { findInMirror, loadMirror, searchMirror } from "./sportrxiv.js";
import { type Lookup, readWebSource, type WebSourceArgs } from "./web.js";

export const SEARCH_SOURCES = ["openalex", "arxiv", "sportrxiv"] as const;
export type SearchSource = (typeof SEARCH_SOURCES)[number];

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
  if (papersDisabled(ctx.env)) return textResult(DISABLED_MESSAGE);
  const query = args.query.trim();
  if (!query) return textResult("Give a query: words, \"quoted phrases\", AND / OR / NOT.", true);

  const limit = Math.min(Math.max(1, Math.round(args.max_results ?? 10)), 25);
  const sources = args.sources?.length ? [...new Set(args.sources)] : [...SEARCH_SOURCES];
  const log = new ServiceLog();
  const notes: string[] = [];

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
    lines.push("Open one with get_paper (DOI, arXiv ID or OpenAlex ID). OpenAlex matches full text, so a hit may only cite the idea.", "");
  }
  lines.push(...notes);
  return withFooter(lines.join("\n").trimEnd(), log, results.length === 0);
}

export type GetPaperArgs = { id: string };

export async function getPaper(args: GetPaperArgs, options: PaperOptions = {}): Promise<ToolResponse> {
  const ctx = contextFrom(options);
  if (papersDisabled(ctx.env)) return textResult(DISABLED_MESSAGE);
  const id = parsePaperId(args.id);
  const log = new ServiceLog();

  if (id.kind === "semantic-scholar") {
    return textResult(
      "Semantic Scholar IDs are not supported yet: the API needs a key in practice. Give the DOI or arXiv ID instead.",
      true,
    );
  }
  if (id.kind === "url") {
    return textResult(`${id.url} is not a DOI, arXiv or OpenAlex link. To read a web page, use get_web_source.`, true);
  }
  if (id.kind === "unknown") {
    return textResult(
      `"${id.value}" is not an ID get_paper knows. Give a DOI (10.1145/3292500.3330758), an arXiv ID (1802.07127) or an OpenAlex ID (W4288278931). To find one, use search_papers.`,
      true,
    );
  }

  let record: PaperRecord | null = null;
  const extra: string[] = [];
  try {
    if (id.kind === "arxiv") {
      record = await getArxivRecord(ctx, id.arxiv);
      log.ok("arXiv");
      // The published version, when arXiv names one, has citation counts and other copies.
      if (record?.ids.doi) {
        try {
          const published = await getOpenAlexWork(ctx, { doi: record.ids.doi });
          log.ok("OpenAlex");
          if (published) {
            extra.push("## Published version", "", ...formatSummary(published));
          }
        } catch (error) {
          log.failed("OpenAlex", reason(error));
        }
      }
    } else if (id.kind === "openalex") {
      record = await getOpenAlexWork(ctx, { openalex: id.openalex });
      log.ok("OpenAlex");
    } else {
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
        record = await getCrossrefWork(ctx, id.doi);
        log.ok("Crossref", record ? undefined : "no record");
      }
    }
  } catch (error) {
    const service = id.kind === "arxiv" ? "arXiv" : id.kind === "openalex" ? "OpenAlex" : "Crossref";
    log.failed(service, reason(error));
    return withFooter(`Could not look up ${args.id}.`, log, true);
  }

  if (!record) return withFooter(`No record found for ${args.id}.`, log, true);
  return withFooter([formatRecord(record), ...(extra.length ? ["", ...extra] : [])].join("\n"), log);
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
