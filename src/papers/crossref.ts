/**
 * Crossref: the DOI registry's bibliographic metadata. get_paper uses it only
 * when OpenAlex has no record for a DOI. Crossref asks clients to name
 * themselves in the User-Agent, which core.ts does.
 */

import { FetchError, getJson, type PaperContext, plainText } from "./core.js";
import type { PaperRecord } from "./records.js";

type CrossrefWork = {
  DOI: string;
  title?: string[];
  author?: Array<{ given?: string; family?: string; name?: string }>;
  issued?: { "date-parts"?: number[][] };
  "container-title"?: string[];
  type?: string;
  URL?: string;
  abstract?: string;
  license?: Array<{ URL?: string; "content-version"?: string }>;
  "is-referenced-by-count"?: number;
};

export async function getCrossrefWork(ctx: PaperContext, doi: string): Promise<PaperRecord | null> {
  const path = doi.split("/").map(encodeURIComponent).join("/");
  try {
    const { body } = await getJson<{ message?: CrossrefWork }>(ctx, `https://api.crossref.org/works/${path}`);
    const work = body.message;
    if (!work) return null;
    const parts = work.issued?.["date-parts"]?.[0] ?? [];
    const vor = work.license?.find((entry) => entry["content-version"] === "vor") ?? work.license?.[0];
    return {
      source: "crossref",
      title: plainText(work.title?.[0]) || "(untitled)",
      authors: (work.author ?? []).map((a) => a.name ?? [a.given, a.family].filter(Boolean).join(" ")).filter(Boolean),
      year: parts[0],
      date: parts.length ? parts.map((part) => String(part).padStart(2, "0")).join("-") : undefined,
      venue: plainText(work["container-title"]?.[0]) || undefined,
      type: work.type,
      ids: { doi: work.DOI.toLowerCase() },
      url: work.URL,
      abstract: plainText(work.abstract) || undefined,
      citedBy: undefined,
      licence: vor?.URL,
      openCopies: [],
    };
  } catch (error) {
    if (error instanceof FetchError && error.status === 404) return null;
    throw error;
  }
}
