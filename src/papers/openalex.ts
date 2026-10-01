/**
 * OpenAlex (https://openalex.org): CC0 metadata for about 250 million works.
 *
 * `search=` matches title, abstract and full text, with quoted phrases and
 * AND / OR / NOT. Without a key the API gives 1000 credits a day: a search
 * costs 10, a lookup by ID or DOI costs nothing. A free key from
 * openalex.org/settings/api raises that; set OPENALEX_API_KEY or put it in the
 * keychain (see apiKey in core.ts).
 */

import { apiKey, FetchError, getJson, type PaperContext, plainText } from "./core.js";
import type { OpenCopy, PaperRecord } from "./records.js";

const API = "https://api.openalex.org";
const SELECT = [
  "id",
  "doi",
  "display_name",
  "publication_year",
  "publication_date",
  "type",
  "authorships",
  "primary_location",
  "locations",
  "best_oa_location",
  "open_access",
  "cited_by_count",
  "abstract_inverted_index",
].join(",");

type Location = {
  landing_page_url?: string | null;
  pdf_url?: string | null;
  license?: string | null;
  version?: string | null;
  is_oa?: boolean;
  source?: { display_name?: string | null; type?: string | null } | null;
  raw_source_name?: string | null;
};

export type OpenAlexWork = {
  id: string;
  doi?: string | null;
  display_name?: string | null;
  publication_year?: number | null;
  publication_date?: string | null;
  type?: string | null;
  authorships?: Array<{ author?: { display_name?: string | null } | null; raw_author_name?: string | null }>;
  primary_location?: Location | null;
  locations?: Location[];
  best_oa_location?: Location | null;
  open_access?: { is_oa?: boolean; oa_status?: string | null } | null;
  cited_by_count?: number | null;
  abstract_inverted_index?: Record<string, number[]> | null;
};

/** OpenAlex ships abstracts as word -> positions. Put the words back in order. */
export function rebuildAbstract(index: Record<string, number[]> | null | undefined): string | undefined {
  if (!index) return undefined;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) words[position] = word;
  }
  const text = words.filter((word) => word !== undefined).join(" ");
  return text ? plainText(text) : undefined;
}

function arxivIdFrom(locations: Location[]): string | undefined {
  for (const location of locations) {
    const match = location.landing_page_url?.match(/arxiv\.org\/abs\/([^?#]+)/i);
    if (match) return match[1];
  }
  return undefined;
}

function openCopies(work: OpenAlexWork): OpenCopy[] {
  const copies: OpenCopy[] = [];
  const seen = new Set<string>();
  const ordered = [work.best_oa_location, ...(work.locations ?? [])].filter(Boolean) as Location[];
  for (const location of ordered) {
    if (!location.is_oa) continue;
    const url = location.pdf_url || location.landing_page_url;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    copies.push({
      url,
      pdf: Boolean(location.pdf_url),
      licence: location.license ?? undefined,
      version: location.version ?? undefined,
      host: location.source?.display_name ?? location.raw_source_name ?? undefined,
    });
  }
  return copies;
}

export function fromOpenAlex(work: OpenAlexWork): PaperRecord {
  const locations = work.locations ?? [];
  const primary = work.primary_location;
  const venue = primary?.source?.display_name ?? primary?.raw_source_name ?? undefined;
  return {
    source: "openalex",
    title: plainText(work.display_name) || "(untitled)",
    authors: (work.authorships ?? [])
      .map((a) => a.author?.display_name ?? a.raw_author_name ?? "")
      .filter(Boolean),
    year: work.publication_year ?? undefined,
    date: work.publication_date ?? undefined,
    venue: venue ? plainText(venue) : undefined,
    type: work.type ?? undefined,
    ids: {
      doi: work.doi ? work.doi.replace(/^https?:\/\/doi\.org\//i, "").toLowerCase() : undefined,
      arxiv: arxivIdFrom(locations),
      openalex: work.id.replace(/^https?:\/\/openalex\.org\//i, ""),
    },
    url: primary?.landing_page_url ?? undefined,
    abstract: rebuildAbstract(work.abstract_inverted_index),
    citedBy: work.cited_by_count ?? undefined,
    oaStatus: work.open_access?.oa_status ?? undefined,
    openCopies: openCopies(work),
  };
}

async function withKey(ctx: PaperContext, url: URL): Promise<URL> {
  const key = await apiKey(ctx, "OPENALEX_API_KEY");
  if (key) url.searchParams.set("api_key", key);
  return url;
}

/** A note when the day's free credits run low, read from the reply headers. */
export function creditNote(headers: Headers): string | undefined {
  const remaining = Number(headers.get("x-ratelimit-remaining"));
  const limit = Number(headers.get("x-ratelimit-limit"));
  if (!Number.isFinite(remaining) || !Number.isFinite(limit) || !headers.has("x-ratelimit-remaining")) return undefined;
  if (remaining >= 100) return undefined;
  return `OpenAlex has ${remaining} of ${limit} daily credits left (a search costs 10). A free key from https://openalex.org/settings/api raises the limit: set OPENALEX_API_KEY.`;
}

function explain(error: unknown): never {
  if (error instanceof FetchError && error.status === 429) {
    throw new FetchError(
      "daily credit limit reached (HTTP 429). A free key from https://openalex.org/settings/api raises it: set OPENALEX_API_KEY",
      429,
    );
  }
  throw error;
}

export type OpenAlexSearch = { records: PaperRecord[]; total: number; note?: string };

export async function searchOpenAlex(
  ctx: PaperContext,
  query: string,
  options: { limit: number; yearFrom?: number; yearTo?: number },
): Promise<OpenAlexSearch> {
  const url = new URL(`${API}/works`);
  url.searchParams.set("search", query);
  url.searchParams.set("per_page", String(options.limit));
  url.searchParams.set("select", SELECT);
  if (options.yearFrom || options.yearTo) {
    url.searchParams.set("filter", `publication_year:${options.yearFrom ?? ""}-${options.yearTo ?? ""}`);
  }
  try {
    const { body, headers } = await getJson<{ meta?: { count?: number }; results?: OpenAlexWork[] }>(ctx, (await withKey(ctx, url)).href);
    return {
      records: (body.results ?? []).map(fromOpenAlex),
      total: body.meta?.count ?? 0,
      note: creditNote(headers),
    };
  } catch (error) {
    return explain(error);
  }
}

/** Look up one work by DOI or OpenAlex ID (free of credits). Null when OpenAlex has no record. */
export async function getOpenAlexWork(
  ctx: PaperContext,
  id: { doi: string } | { openalex: string },
): Promise<PaperRecord | null> {
  // Keep the DOI's slashes but escape anything that would end the path (# or ?).
  const path = "doi" in id ? `doi:${id.doi.split("/").map(encodeURIComponent).join("/")}` : id.openalex;
  const url = new URL(`${API}/works/${path}`);
  try {
    const { body } = await getJson<OpenAlexWork>(ctx, (await withKey(ctx, url)).href);
    return fromOpenAlex(body);
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) return null;
    return explain(error);
  }
}
