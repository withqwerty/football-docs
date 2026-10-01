/**
 * get_web_source: read a public web page (a blog post, newsletter or club or
 * vendor article) as text, with its Wayback Machine snapshots so a citation
 * can point at a fixed copy.
 *
 * Limits:
 * - Only public http(s) addresses. Names that resolve to loopback, private or
 *   link-local addresses are refused, so a page cannot steer the tool at a
 *   service on the user's machine or network.
 * - When a site answers with a bot check (Cloudflare and similar), the tool
 *   stops. It never tries to get past one.
 * - It does not ask the Wayback Machine to save a page; it only reads what is
 *   there and gives the save link.
 */

import { lookup as dnsLookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";
import {
  FetchError,
  getJson,
  type PaperContext,
  plainText,
  readCapped,
  reason,
  type ServiceLog,
  USER_AGENT,
} from "./core.js";
import { licenceName } from "./records.js";

const MAX_REDIRECTS = 5;
/** Pages up to this size come back whole; longer ones come back by section. */
export const WHOLE_PAGE_CHARS = 40_000;

export type Lookup = (host: string) => Promise<string[]>;

const defaultLookup: Lookup = async (host) => (await dnsLookup(host, { all: true })).map((entry) => entry.address);

const blocked = new BlockList();
for (const [net, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blocked.addSubnet(net, prefix, "ipv4");
}
for (const [net, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  blocked.addSubnet(net, prefix, "ipv6");
}

function isPrivateAddress(address: string): boolean {
  const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) return blocked.check(mapped[1], "ipv4");
  const family = isIP(address);
  if (family === 4) return blocked.check(address, "ipv4");
  if (family === 6) return blocked.check(address, "ipv6");
  return true;
}

/** Throws when the URL is not a public http(s) address. */
export async function checkPublicUrl(raw: string, lookup: Lookup = defaultLookup): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new FetchError("not a valid URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new FetchError("only http and https URLs are allowed");
  if (url.username || url.password) throw new FetchError("URLs with a user name or password are not allowed");
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new FetchError("local and private addresses are not allowed");
  }
  const addresses = isIP(host) ? [host] : await lookup(host).catch(() => {
    throw new FetchError(`could not resolve ${host}`);
  });
  if (!addresses.length || addresses.some(isPrivateAddress)) {
    throw new FetchError("local and private addresses are not allowed");
  }
  return url;
}

// ---------------------------------------------------------------------------
// Fetching the page

const CHALLENGE_MARKERS = [
  /<title>\s*just a moment/i,
  /challenge-platform/i,
  /cf-chl-/i,
  /<title>\s*attention required/i,
  /captcha-delivery\.com/i,
  /g-recaptcha|h-captcha|hcaptcha\.com/i,
  /<title>[^<]*(are you a robot|access denied|verify you are human)/i,
];

export function isBotChallenge(status: number, headers: Headers, body: string): boolean {
  if (headers.get("cf-mitigated") === "challenge") return true;
  if (status !== 403 && status !== 429 && status !== 503 && status !== 200) return false;
  // A normal page can mention reCAPTCHA in a form; only treat short pages as a challenge on 200.
  if (status === 200 && body.length > 20_000) return false;
  return CHALLENGE_MARKERS.some((pattern) => pattern.test(body));
}

export type FetchedPage = { url: string; status: number; contentType: string; body: string };

export class BotChallengeError extends Error {}

/** GET with redirects followed by hand, so every hop is checked against the address rules. */
export async function fetchPage(ctx: PaperContext, start: URL, lookup: Lookup): Promise<FetchedPage> {
  let url = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let response: Response;
    try {
      response = await ctx.fetchImpl(url.href, {
        redirect: "manual",
        headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5" },
        signal: AbortSignal.timeout(20_000),
      });
    } catch (error) {
      throw new FetchError(reason(error));
    }
    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      await response.body?.cancel().catch(() => undefined);
      url = await checkPublicUrl(new URL(location, url).href, lookup);
      continue;
    }
    const contentType = response.headers.get("content-type") ?? "";
    const body = new TextDecoder().decode(await readCapped(response));
    if (isBotChallenge(response.status, response.headers, body)) {
      throw new BotChallengeError(`${url.host} answered with a bot check (HTTP ${response.status})`);
    }
    if (!response.ok) throw new FetchError(`HTTP ${response.status}`, response.status);
    return { url: url.href, status: response.status, contentType, body };
  }
  throw new FetchError(`more than ${MAX_REDIRECTS} redirects`);
}

// ---------------------------------------------------------------------------
// Wayback Machine

export type Snapshot = { timestamp: string; url: string };
export type Snapshots = { earliest?: Snapshot; latest?: Snapshot };

function snapshotUrl(timestamp: string, original: string): string {
  return `https://web.archive.org/web/${timestamp}/${original}`;
}

export function snapshotDate(timestamp: string): string {
  return `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}`;
}

/**
 * The snapshot closest to a timestamp, from the Wayback Machine's redirect:
 * /web/1id_/URL redirects to the earliest copy and /web/3000id_/URL to the
 * latest. This answers in under a second; the CDX API can take 25.
 */
async function closestSnapshot(ctx: PaperContext, url: string, timestamp: string): Promise<Snapshot | undefined> {
  const response = await ctx.fetchImpl(`https://web.archive.org/web/${timestamp}id_/${url}`, {
    method: "HEAD",
    redirect: "manual",
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(20_000),
  });
  if (response.status === 404) return undefined;
  const location = response.headers.get("location") ?? "";
  const match = location.match(/\/web\/(\d{14})id_\/(.+)$/);
  if (response.status < 300 || response.status >= 400 || !match) {
    throw new FetchError(`HTTP ${response.status}`, response.status);
  }
  return { timestamp: match[1], url: snapshotUrl(match[1], match[2]) };
}

/** The same two snapshots from the CDX API, used when the redirect fails. */
async function cdxSnapshots(ctx: PaperContext, url: string): Promise<Snapshots> {
  const query = async (limit: number): Promise<Snapshot | undefined> => {
    const cdx = new URL("https://web.archive.org/cdx/search/cdx");
    cdx.searchParams.set("url", url);
    cdx.searchParams.set("output", "json");
    cdx.searchParams.set("fl", "timestamp,original");
    cdx.searchParams.set("filter", "statuscode:200");
    cdx.searchParams.set("limit", String(limit));
    const { body } = await getJson<string[][]>(ctx, cdx.href, { timeoutMs: 40_000 });
    const row = body[1];
    return row ? { timestamp: row[0], url: snapshotUrl(row[0], row[1]) } : undefined;
  };
  const [earliest, latest] = await Promise.all([query(1), query(-1)]);
  return earliest ? { earliest, latest: latest ?? earliest } : {};
}

/** The earliest and latest Wayback snapshots of a URL. */
export async function waybackSnapshots(ctx: PaperContext, url: string): Promise<Snapshots> {
  try {
    const [earliest, latest] = await Promise.all([closestSnapshot(ctx, url, "1"), closestSnapshot(ctx, url, "3000")]);
    return earliest ? { earliest, latest: latest ?? earliest } : {};
  } catch {
    return cdxSnapshots(ctx, url);
  }
}

// ---------------------------------------------------------------------------
// Extraction

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });

type Doc = ReturnType<typeof parseHTML>["document"];

function meta(document: Doc, ...names: string[]): string | undefined {
  for (const name of names) {
    const node = document.querySelector(`meta[property="${name}"], meta[name="${name}"], meta[itemprop="${name}"]`);
    const value = node?.getAttribute("content")?.trim();
    if (value) return plainText(value);
  }
  return undefined;
}

function jsonLdField(document: Doc, field: string): string | undefined {
  for (const node of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
    try {
      const data = JSON.parse(node.textContent ?? "");
      for (const item of Array.isArray(data) ? data : [data, ...(data["@graph"] ?? [])]) {
        const value = item?.[field];
        if (typeof value === "string" && value.trim()) return value.trim();
        if (field === "author" && value) {
          const names = (Array.isArray(value) ? value : [value]).map((a) => a?.name).filter(Boolean);
          if (names.length) return names.join(", ");
        }
      }
    } catch {
      // Not valid JSON; ignore.
    }
  }
  return undefined;
}

function licenceLink(document: Doc): string | undefined {
  const rel = document.querySelector('link[rel="license"], a[rel="license"]')?.getAttribute("href");
  if (rel) return rel;
  const cc = Array.from(document.querySelectorAll("a[href*='creativecommons.org/licenses/'], a[href*='creativecommons.org/publicdomain/']"))[0];
  return cc?.getAttribute("href") ?? undefined;
}

export type Section = { heading: string; level: number; text: string };

export type WebPage = {
  title?: string;
  author?: string;
  published?: string;
  modified?: string;
  siteName?: string;
  canonical?: string;
  licence?: string;
  description?: string;
  sections: Section[];
  text: string;
};

/** Split markdown into sections at its headings. Text before the first heading is section 0. */
export function splitSections(markdown: string): Section[] {
  const sections: Section[] = [];
  let current: Section = { heading: "(start)", level: 0, text: "" };
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^(```|~~~)/.test(line)) inFence = !inFence;
    const heading = !inFence ? line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/) : null;
    if (heading) {
      if (current.text.trim() || current.level > 0) sections.push({ ...current, text: current.text.trim() });
      current = { heading: heading[2], level: heading[1].length, text: "" };
    } else {
      current.text += `${line}\n`;
    }
  }
  if (current.text.trim() || current.level > 0) sections.push({ ...current, text: current.text.trim() });
  return sections.flatMap((section) => splitLongSection(section, WHOLE_PAGE_CHARS));
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
    heading: index === 0 ? section.heading : `${section.heading} (part ${index + 1} of ${parts.length})`,
    level: section.level,
    text,
  }));
}

export function extractPage(html: string, pageUrl: string): WebPage {
  const withBase = html.includes("<base ") ? html : html.replace(/(<head[^>]*>)/i, `$1<base href="${pageUrl}">`);
  const { document } = parseHTML(withBase);
  const facts = {
    title: meta(document, "og:title", "twitter:title", "citation_title") ?? plainText(document.querySelector("title")?.textContent),
    author: meta(document, "citation_author", "author", "article:author") ?? jsonLdField(document, "author"),
    published:
      meta(document, "article:published_time", "citation_publication_date", "citation_date", "datePublished", "date", "dc.date", "DC.date.issued") ??
      jsonLdField(document, "datePublished") ??
      document.querySelector("time[datetime]")?.getAttribute("datetime") ??
      undefined,
    modified: meta(document, "article:modified_time", "dateModified") ?? jsonLdField(document, "dateModified"),
    siteName: meta(document, "og:site_name"),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? undefined,
    licence: licenceLink(document),
    description: meta(document, "description", "og:description"),
  };
  // Readability changes the document, so read the facts first.
  const article = new Readability(document as unknown as Document, { charThreshold: 100 }).parse();
  const markdown = article?.content
    ? turndown.turndown(article.content)
    : plainText(document.querySelector("body")?.textContent ?? "");
  const text = markdown.replace(/\n{3,}/g, "\n\n").trim();
  return {
    ...facts,
    title: facts.title || article?.title || undefined,
    author: facts.author ?? (article?.byline ? plainText(article.byline) : undefined),
    sections: splitSections(text),
    text,
  };
}

// ---------------------------------------------------------------------------
// The tool

export type WebSourceArgs = { url: string; section?: number };

function outline(sections: Section[]): string {
  // Indent from the page's top heading level, which is often h2 or lower.
  const top = Math.min(...sections.map((section) => section.level || Number.POSITIVE_INFINITY));
  return sections
    .map((section, index) => `${"  ".repeat(Math.max(0, section.level - top))}- [${index}] ${section.heading} (${section.text.length} characters)`)
    .join("\n");
}

function sectionText(section: Section): string {
  return section.level > 0 ? `${"#".repeat(section.level)} ${section.heading}\n\n${section.text}` : section.text;
}

export type WebSourceResult = { text: string; isError?: boolean };

export async function readWebSource(
  ctx: PaperContext,
  args: WebSourceArgs,
  log: ServiceLog,
  lookup: Lookup = defaultLookup,
): Promise<WebSourceResult> {
  let url: URL;
  try {
    url = await checkPublicUrl(args.url.trim(), lookup);
  } catch (error) {
    return { text: `Cannot read ${args.url}: ${reason(error)}.`, isError: true };
  }

  // Ask the Wayback Machine while the page loads.
  const snapshotsRequest = waybackSnapshots(ctx, url.href).then(
    (found) => ({ found, error: null as unknown }),
    (error: unknown) => ({ found: {} as Snapshots, error }),
  );
  let page: FetchedPage | null = null;
  let pageError: unknown = null;
  try {
    page = await fetchPage(ctx, url, lookup);
  } catch (error) {
    pageError = error;
  }
  const { found: snapshots, error: snapshotError } = await snapshotsRequest;
  if (snapshotError) log.failed("Wayback Machine", reason(snapshotError));
  else log.ok("Wayback Machine");

  let fromArchive = false;
  if (page) {
    log.ok(url.host);
  } else {
    const error = pageError;
    if (error instanceof BotChallengeError) {
      log.failed(url.host, "bot check");
      return {
        text: [
          `${error.message}. football-docs stops here and does not try to get past bot checks.`,
          "Open the page in a browser to read it.",
          snapshots.latest ? `An archived copy exists: ${snapshots.latest.url} (${snapshotDate(snapshots.latest.timestamp)}).` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        isError: true,
      };
    }
    log.failed(url.host, reason(error));
    if (snapshots.latest) {
      const raw = snapshots.latest.url.replace(/\/web\/(\d+)\//, "/web/$1id_/");
      try {
        page = await fetchPage(ctx, new URL(raw), lookup);
        fromArchive = true;
        log.ok("Wayback Machine", `archived copy of ${snapshotDate(snapshots.latest.timestamp)}`);
      } catch (archiveError) {
        log.failed("Wayback Machine", `archived copy: ${reason(archiveError)}`);
      }
    }
  }

  if (!page) {
    return { text: `Could not read ${url.href}: the page and any archived copy failed to load.`, isError: true };
  }

  if (/application\/pdf/i.test(page.contentType) || page.body.startsWith("%PDF-")) {
    return {
      text: `${url.href} is a PDF. This version of football-docs cannot read PDFs yet. Use get_paper for papers with a DOI or arXiv ID.`,
      isError: true,
    };
  }

  const isHtml = /html|xml/i.test(page.contentType) || /^\s*<(!doctype|html)/i.test(page.body);
  const extracted: WebPage = isHtml
    ? extractPage(page.body, page.url)
    : { sections: splitSections(page.body.trim()), text: page.body.trim() };

  const lines = [`# ${extracted.title ?? url.href}`, ""];
  lines.push(`- **URL:** ${url.href}${page.url !== url.href && !fromArchive ? ` (redirected to ${page.url})` : ""}`);
  if (fromArchive) lines.push("- **Read from:** the Wayback Machine's latest copy, because the live page did not load");
  if (extracted.canonical && extracted.canonical !== url.href) lines.push(`- **Canonical URL:** ${extracted.canonical}`);
  if (extracted.siteName) lines.push(`- **Site:** ${extracted.siteName}`);
  lines.push(`- **Author:** ${extracted.author ?? "not stated on the page"}`);
  lines.push(`- **Published:** ${extracted.published ?? "no date on the page"}`);
  if (extracted.modified) lines.push(`- **Modified:** ${extracted.modified}`);
  const licence = extracted.licence ? licenceName(extracted.licence) : undefined;
  lines.push(
    `- **Licence:** ${!licence ? "none stated on the page" : licence === extracted.licence ? licence : `${licence} (${extracted.licence})`}`,
  );
  if (snapshots.earliest) {
    lines.push(`- **Earliest Wayback snapshot:** ${snapshotDate(snapshots.earliest.timestamp)} ${snapshots.earliest.url}`);
    if (!extracted.published) {
      lines.push(`  (The page has no date. It existed by ${snapshotDate(snapshots.earliest.timestamp)}, the date of this snapshot.)`);
    }
  }
  if (snapshots.latest && snapshots.latest.timestamp !== snapshots.earliest?.timestamp) {
    lines.push(`- **Latest Wayback snapshot:** ${snapshotDate(snapshots.latest.timestamp)} ${snapshots.latest.url}`);
  }
  if (!snapshots.earliest && !snapshotError) {
    lines.push(`- **Wayback:** no snapshot. To make one, open https://web.archive.org/save/${url.href}`);
  }
  lines.push("");

  const sections = extracted.sections;
  if (args.section !== undefined) {
    const section = sections[args.section];
    if (!section) {
      lines.push(`There is no section ${args.section}. Sections:`, "", outline(sections));
      return { text: lines.join("\n"), isError: true };
    }
    lines.push(`Section ${args.section} of ${sections.length - 1}:`, "", sectionText(section));
    return { text: lines.join("\n") };
  }

  if (extracted.text.length <= WHOLE_PAGE_CHARS) {
    lines.push("## Page text", "", extracted.text || "(no text found on the page)");
    return { text: lines.join("\n") };
  }

  lines.push(
    `The page text is ${extracted.text.length} characters, so it comes back by section. Call again with section: N.`,
    "",
    "## Sections",
    "",
    outline(sections),
    "",
  );
  const first: string[] = [];
  let budget = WHOLE_PAGE_CHARS;
  for (const section of sections) {
    const text = sectionText(section);
    if (text.length > budget) break;
    first.push(text, "");
    budget -= text.length;
  }
  if (first.length) lines.push(`## Page text (sections 0 to ${first.length / 2 - 1})`, "", ...first);
  return { text: lines.join("\n") };
}
