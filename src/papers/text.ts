/**
 * Paper and page text: PDF extraction, sections, quote matching and short
 * passages.
 *
 * Quote matching follows the W3C TextQuoteSelector idea: the matched text plus
 * a little text before and after it, so a reader can find the place again. It
 * tries an exact match first, then a match after normalising case, spacing,
 * quotes, dashes, ligatures and line-end hyphens, then the closest passage
 * with a similarity score.
 */

import { extractText, getDocumentProxy, getMeta } from "unpdf";
import { truncate } from "./core.js";

export type Section = { heading: string; level: number; text: string; page?: number };

/** Pages up to this size come back whole; longer ones come back by section. */
export const WHOLE_TEXT_CHARS = 40_000;

// ---------------------------------------------------------------------------
// Sections

/** Split markdown into sections at its headings. Text before the first heading is "(start)". */
export function splitSections(markdown: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: "(start)", level: 0, text: "" };
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^(```|~~~)/.test(line)) inFence = !inFence;
    const heading = !inFence ? line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/) : null;
    if (heading) {
      if (current.text.trim() || current.level > 0) sections.push({ ...current, text: current.text.trim() });
      current = { heading: stripMarkdown(heading[2]), level: heading[1].length, text: "" };
    } else {
      current.text += `${line}\n`;
    }
  }
  if (current.text.trim() || current.level > 0) sections.push({ ...current, text: current.text.trim() });
  return sections.flatMap((section) => splitLongSection(section, WHOLE_TEXT_CHARS));
}

/** Markdown to plain text: link text without its URL, no emphasis marks or escapes. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^\w*])[*_](\S(?:.*?\S)?)[*_](?=[^\w*]|$)/g, "$1$2")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\\([\\`*_{}[\]()#+\-.!|>])/g, "$1");
}

/** Cut a section longer than max at paragraph breaks into parts, so no one reply is unbounded. */
export function splitLongSection(section: Section, max: number): Section[] {
  if (section.text.length <= max) return [section];
  const parts: string[] = [];
  let part = "";
  for (const paragraph of section.text.split(/\n{2,}/)) {
    if (part && part.length + paragraph.length + 2 > max) {
      parts.push(part);
      part = "";
    }
    // A single paragraph longer than max is cut hard.
    for (let start = 0; start < paragraph.length; start += max) {
      const piece = paragraph.slice(start, start + max);
      if (part && part.length + piece.length + 2 > max) {
        parts.push(part);
        part = "";
      }
      part = part ? `${part}\n\n${piece}` : piece;
    }
  }
  if (part) parts.push(part);
  return parts.map((text, index) => ({
    ...section,
    heading: index === 0 ? section.heading : `${section.heading} (part ${index + 1} of ${parts.length})`,
    text,
  }));
}

const NAMED_HEADINGS =
  /^(abstract|introduction|related work|background|literature review|methods?|methodology|data( and methods)?|experiments?|results?|evaluation|discussion|conclusions?|limitations|future work|acknowledge?ments?|references|bibliography|appendix\b.{0,40})$/i;

/** A line that reads as a section heading in PDF text: "2 SPADL: A LANGUAGE ...", "3.1 Data", "ABSTRACT". */
export function headingLevel(line: string): number {
  const text = line.trim();
  if (text.length < 3 || text.length > 80 || (/[.,;:]$/.test(text) && !/^\d/.test(text))) return 0;
  if (NAMED_HEADINGS.test(text)) return 1;
  const numbered = text.match(/^(\d{1,2}(?:\.\d{1,2}){0,2})\.?\s+(\p{Lu}.*)$/u);
  if (numbered) {
    // Table rows ("1 M. Salah 0.986 2 € 150m") carry numbers or symbols in the title.
    if (/[\d€$£%=]/.test(numbered[2])) return 0;
    const words = numbered[2].split(/\s+/);
    if (words.length > 12 || /[.,;]$/.test(text)) return 0;
    // Most words capitalised, or the whole title in capitals.
    const capitalised = words.filter((word) => /^[\p{Lu}\d(]/u.test(word)).length;
    if (numbered[2] === numbered[2].toUpperCase() || capitalised / words.length >= 0.5) {
      return numbered[1].split(".").length;
    }
  }
  return 0;
}

/**
 * Sections of a PDF from its page texts. Headings are found by the rules in
 * headingLevel; a heading in capitals that wraps onto a second line in
 * capitals is joined. With fewer than three headings, the sections are pages.
 */
export function pdfSections(pages: string[]): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: "(start)", level: 0, text: "", page: 1 };
  let headings = 0;
  // Numbered headings go up in order: 2 after 1, 2.1 inside 2. A number out of
  // order is a list item or a table row.
  let lastTop = 0;
  for (const [pageIndex, page] of pages.entries()) {
    const lines = page.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      let level = headingLevel(line);
      const number = line.match(/^(\d{1,2})[.\s]/);
      if (level && number) {
        const top = Number(number[1]);
        const sub = /^\d{1,2}\.\d/.test(line);
        if (sub ? top !== lastTop : top !== lastTop + 1) level = 0;
        else lastTop = top;
      }
      if (!level) {
        current.text += `${line}\n`;
        continue;
      }
      let heading = line;
      const next = lines[i + 1]?.trim() ?? "";
      if (heading === heading.toUpperCase() && next && next.length < 60 && next === next.toUpperCase() && /\p{Lu}/u.test(next) && !headingLevel(next)) {
        heading = `${heading} ${next}`;
        i++;
      }
      if (current.text.trim() || current.level > 0) sections.push({ ...current, text: tidy(current.text) });
      current = { heading, level, text: "", page: pageIndex + 1 };
      headings++;
    }
  }
  if (current.text.trim() || current.level > 0) sections.push({ ...current, text: tidy(current.text) });
  if (headings < 3) {
    return pages
      .map((page, index) => ({ heading: `Page ${index + 1}`, level: 1, text: tidy(page), page: index + 1 }))
      .filter((section) => section.text)
      .flatMap((section) => splitLongSection(section, WHOLE_TEXT_CHARS));
  }
  return sections.flatMap((section) => splitLongSection(section, WHOLE_TEXT_CHARS));
}

/** Join PDF lines into paragraphs: mend words hyphenated at a line end, keep blank lines. */
function tidy(text: string): string {
  return text
    .replace(/(\p{Ll})-\n(\p{Ll})/gu, "$1$2")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type PdfText = { pages: string[]; title?: string; author?: string; doi?: string };

/** Text of every page of a PDF, with the title, author and first DOI it states. */
export async function readPdf(data: Uint8Array): Promise<PdfText> {
  const pdf = await getDocumentProxy(new Uint8Array(data));
  try {
    const { text } = await extractText(pdf, { mergePages: false });
    const { info } = (await getMeta(pdf).catch(() => ({ info: {} }))) as { info: Record<string, unknown> };
    const firstPages = text.slice(0, 2).join("\n");
    const doi = firstPages.match(/\b(10\.\d{4,9}\/[^\s"<>]+[^\s"<>.,;)])/)?.[1];
    const title = typeof info.Title === "string" && info.Title.trim() ? info.Title.trim() : undefined;
    const author = typeof info.Author === "string" && info.Author.trim() ? info.Author.trim() : undefined;
    return { pages: text, title, author, doi: doi?.toLowerCase() };
  } finally {
    await pdf.loadingTask.destroy();
  }
}

export function isPdf(data: Uint8Array): boolean {
  return new TextDecoder().decode(data.slice(0, 1024)).includes("%PDF-");
}

// ---------------------------------------------------------------------------
// Rendering

export function outline(sections: Section[]): string {
  // Indent from the text's top heading level, which is often h2 or lower.
  const top = Math.min(...sections.map((section) => section.level || Number.POSITIVE_INFINITY));
  return sections
    .map((section, index) => {
      const page = section.page ? `, page ${section.page}` : "";
      return `${"  ".repeat(Math.min(3, Math.max(0, section.level - top)))}- [${index}] ${section.heading} (${section.text.length} characters${page})`;
    })
    .join("\n");
}

export function sectionText(section: Section): string {
  return section.level > 0 ? `${"#".repeat(Math.min(section.level + 1, 6))} ${section.heading}\n\n${section.text}` : section.text;
}

/** Whole text when short, else the outline and the first sections that fit. */
export function renderFull(sections: Section[], requested?: number): { lines: string[]; isError?: boolean } {
  const lines: string[] = [];
  if (requested !== undefined) {
    const section = sections[requested];
    if (!section) return { lines: [`There is no section ${requested}. Sections:`, "", outline(sections)], isError: true };
    return { lines: [`Section ${requested} of ${sections.length - 1}:`, "", sectionText(section)] };
  }
  const total = sections.reduce((sum, section) => sum + section.text.length, 0);
  if (total <= WHOLE_TEXT_CHARS) {
    lines.push("## Text", "", sections.map(sectionText).join("\n\n") || "(no text found)");
    return { lines };
  }
  lines.push(`The text is ${total} characters, so it comes back by section. Call again with section: N.`, "", "## Sections", "", outline(sections), "");
  const first: string[] = [];
  let budget = WHOLE_TEXT_CHARS;
  for (const section of sections) {
    const text = sectionText(section);
    if (text.length > budget) break;
    first.push(text, "");
    budget -= text.length;
  }
  if (first.length) lines.push(`## Text (sections 0 to ${first.length / 2 - 1})`, "", ...first);
  return { lines };
}

// ---------------------------------------------------------------------------
// Normalising and matching

/** Normalised text plus, for each of its characters, the index in the original. */
export type Normalised = { text: string; map: number[] };

const FOLD: Record<string, string> = {
  "‘": "'",
  "’": "'",
  "‚": "'",
  "‛": "'",
  "′": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "″": '"',
  "‐": "-",
  "‑": "-",
  "‒": "-",
  "–": "-",
  "—": "-",
  "−": "-",
  "ﬀ": "ff",
  "ﬁ": "fi",
  "ﬂ": "fl",
  "ﬃ": "ffi",
  "ﬄ": "ffl",
  " ": " ",
  "­": "",
};

/**
 * Lower case, one space for any run of white space, plain quotes and dashes,
 * ligatures expanded, soft hyphens and line-end hyphens removed, markdown
 * emphasis and link brackets dropped.
 */
export function normalise(input: string): Normalised {
  const out: string[] = [];
  const map: number[] = [];
  let lastSpace = true;
  for (let i = 0; i < input.length; i++) {
    let ch = input[i];
    // A hyphen at a line end inside a word: drop it and the line break.
    if (ch === "-" && input[i + 1] === "\n" && /\p{L}/u.test(input[i - 1] ?? "") && /\p{Ll}/u.test(input[i + 2] ?? "")) {
      i++;
      continue;
    }
    if (ch === "*" || ch === "_" || ch === "`" || ch === "[" || ch === "]") continue;
    ch = FOLD[ch] ?? ch;
    for (const c of ch.normalize("NFKC").toLowerCase()) {
      if (/\s/.test(c)) {
        if (lastSpace) continue;
        out.push(" ");
        map.push(i);
        lastSpace = true;
      } else {
        out.push(c);
        map.push(i);
        lastSpace = false;
      }
    }
  }
  while (out.length && out[out.length - 1] === " ") {
    out.pop();
    map.pop();
  }
  return { text: out.join(""), map };
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}

export type QuoteMatch = {
  kind: "exact" | "normalised" | "close" | "none";
  /** 1 for exact and normalised matches; the similarity of the closest passage otherwise. */
  score: number;
  /** Offsets in the original text. */
  start: number;
  end: number;
};

/** The score a closest passage needs to count as a close match. */
export const CLOSE_MATCH_SCORE = 0.85;

/** Find a quote in a text. Offsets refer to the text as given. */
export function findQuote(source: string, quote: string): QuoteMatch {
  const wanted = quote.trim();
  if (!wanted) return { kind: "none", score: 0, start: 0, end: 0 };
  const exact = source.indexOf(wanted);
  if (exact >= 0) return { kind: "exact", score: 1, start: exact, end: exact + wanted.length };

  const haystack = normalise(source);
  const needle = normalise(wanted).text;
  if (!needle) return { kind: "none", score: 0, start: 0, end: 0 };
  const at = haystack.text.indexOf(needle);
  if (at >= 0) {
    return { kind: "normalised", score: 1, start: haystack.map[at], end: haystack.map[at + needle.length - 1] + 1 };
  }

  // Closest passage: rank word windows by shared words, then score the best
  // few by edit distance.
  const words = [...haystack.text.matchAll(/\S+/g)].map((m) => ({ word: m[0], index: m.index ?? 0 }));
  const quoteWords = needle.split(" ");
  const size = quoteWords.length;
  if (!words.length) return { kind: "none", score: 0, start: 0, end: 0 };
  const wanted_ = new Map<string, number>();
  for (const word of quoteWords) wanted_.set(word, (wanted_.get(word) ?? 0) + 1);
  const candidates: Array<{ from: number; shared: number }> = [];
  for (let from = 0; from <= Math.max(0, words.length - size); from++) {
    const seen = new Map<string, number>();
    let shared = 0;
    for (let k = from; k < Math.min(words.length, from + size); k++) {
      const word = words[k].word;
      const count = (seen.get(word) ?? 0) + 1;
      seen.set(word, count);
      if (count <= (wanted_.get(word) ?? 0)) shared++;
    }
    candidates.push({ from, shared });
  }
  candidates.sort((a, b) => b.shared - a.shared);
  let best = { score: 0, start: 0, end: 0 };
  for (const { from } of candidates.slice(0, 20)) {
    for (const extra of [-2, -1, 0, 1, 2]) {
      const to = Math.min(words.length, from + size + extra) - 1;
      if (to < from) continue;
      const startN = words[from].index;
      const endN = words[to].index + words[to].word.length;
      const window = haystack.text.slice(startN, endN);
      const score = 1 - levenshtein(window, needle) / Math.max(window.length, needle.length);
      if (score > best.score) best = { score, start: haystack.map[startN], end: haystack.map[endN - 1] + 1 };
    }
  }
  return { kind: best.score >= CLOSE_MATCH_SCORE ? "close" : "none", ...best };
}

/** Text before and after a span, cut at word boundaries. */
export function context(source: string, start: number, end: number, chars: number): { prefix: string; suffix: string } {
  const before = source.slice(Math.max(0, start - chars), start);
  const after = source.slice(end, end + chars);
  return {
    prefix: before.replace(/^\S*\s/, "").replace(/\s+/g, " "),
    suffix: after.replace(/\s\S*$/, "").replace(/\s+/g, " "),
  };
}

/** Up to `limit` passages of at most `cap` characters around the places a query's terms occur together. */
export function passages(source: string, query: string, cap: number, limit = 5): string[] {
  const terms = (query.toLowerCase().match(/"[^"]+"|\S+/g) ?? []).map((term) => term.replace(/^"|"$/g, "")).filter((term) => term.length > 1);
  if (!terms.length) return [];
  const haystack = normalise(source);
  const hits: number[] = [];
  let from = 0;
  const first = normalise(terms[0]).text;
  for (;;) {
    const at = haystack.text.indexOf(first, from);
    if (at < 0) break;
    const window = haystack.text.slice(Math.max(0, at - cap), at + cap);
    if (terms.every((term) => window.includes(normalise(term).text))) hits.push(haystack.map[at]);
    from = at + first.length;
  }
  const out: string[] = [];
  let lastEnd = -1;
  for (const hit of hits) {
    let start = Math.max(0, hit - Math.floor(cap / 3));
    // Begin at a word, not inside one.
    if (start > 0) {
      const space = source.slice(start, hit).search(/\s/);
      if (space >= 0) start += space + 1;
    }
    if (start < lastEnd) continue;
    // The marks for cut text count towards the cap.
    const lead = start > 0 ? "…" : "";
    out.push(lead + truncate(source.slice(start, start + cap).replace(/\s+/g, " ").trim(), cap - lead.length - 1));
    lastEnd = start + cap;
    if (out.length >= limit) break;
  }
  return out;
}
