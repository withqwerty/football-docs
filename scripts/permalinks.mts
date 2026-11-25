/**
 * Give each doc's source a permalink: a link that keeps showing the page as it
 * was when the doc was written, after the live page changes or goes away.
 *
 * For each docs/<provider>/<page>.md whose frontmatter has a source_url, it
 * writes archived_url next to it:
 *
 * - GitHub pages pin to the commit that was current on the doc's crawled_at
 *   date (or, without crawled_at, the date the doc was last committed) (github.com/<owner>/<repo>/blob/<sha>/<path>).
 * - Every other page uses the Wayback Machine snapshot closest to crawled_at,
 *   if one is within MAX_DAYS of it. If none is, it asks the Wayback Machine to
 *   save the page now.
 *
 * It keeps a GitHub permalink, and a Wayback permalink no more than MAX_DAYS
 * older than crawled_at, so a second run changes nothing. A re-crawl writes new
 * frontmatter without archived_url, and the next run adds a fresh one.
 * Pages it cannot archive (behind a login, or refused by the site) keep only
 * source_url, and the run lists them.
 *
 *   pnpm permalinks                     # every doc
 *   pnpm permalinks -- --provider reep  # one provider
 *   pnpm permalinks -- --check          # list docs with a source but no permalink; no network
 */

import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");

/** How far a snapshot may be from the date the doc was checked. */
const MAX_DAYS = 30;
/** Pause between Save Page Now requests, which the Wayback Machine rate-limits. */
const SAVE_PAUSE_MS = 8_000;

/**
 * Pages another script writes in full. A permalink written here would be lost
 * on the next build, or fail that script's check, so their generators carry it.
 */
const GENERATED = [/^metric-cards\//, /^skillcorner\/dynamic-events\.md$/];

type Doc = {
  path: string;
  rel: string;
  text: string;
  sourceUrl: string;
  archivedUrl: string | null;
  crawledAt: string | null;
  /** crawled_at is missing, so crawledAt is the doc's last commit date. */
  datedByGit?: boolean;
};

function frontmatterValue(block: string, key: string): string | null {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  const value = match?.[1].replace(/^["']|["']$/g, "").trim();
  return value && value !== "null" ? value : null;
}

export function readDoc(path: string): Doc | null {
  const text = readFileSync(path, "utf8").replace(/\r\n?/g, "\n");
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const block = text.slice(4, end);
  const sourceUrl = frontmatterValue(block, "source_url");
  if (!sourceUrl?.startsWith("http")) return null;
  const crawled = frontmatterValue(block, "crawled_at");
  return {
    path,
    rel: relative(DOCS, path),
    text,
    sourceUrl,
    archivedUrl: frontmatterValue(block, "archived_url"),
    crawledAt: crawled ? crawled.slice(0, 10) : lastCommitDate(path),
    datedByGit: !crawled,
  };
}

/**
 * A doc without crawled_at was written from its source when it was last
 * committed, so that date picks the snapshot or commit. Null for a new file.
 */
function lastCommitDate(path: string): string | null {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs", "--", path], { cwd: ROOT, encoding: "utf8" }).trim() || null;
  } catch {
    return null;
  }
}

/** The frontmatter with archived_url set, right after source_url. */
export function withArchivedUrl(text: string, archivedUrl: string): string {
  const end = text.indexOf("\n---", 3);
  const block = text.slice(0, end).replace(/^archived_url:.*\n?/m, "");
  const lines = block.split("\n");
  const at = lines.findIndex((line) => line.startsWith("source_url:"));
  lines.splice(at + 1, 0, `archived_url: ${archivedUrl}`);
  return lines.join("\n") + text.slice(end);
}

/** The date in a Wayback URL (YYYY-MM-DD), or null for any other URL. */
export function waybackDate(url: string): string | null {
  const match = url.match(/^https:\/\/web\.archive\.org\/web\/(\d{4})(\d{2})(\d{2})\d*\//);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

function daysBetween(a: string, b: string): number {
  return Math.abs(Date.parse(a) - Date.parse(b)) / 86_400_000;
}

/** Whether an archived_url already on a doc still stands for it. */
export function permalinkHolds(doc: Pick<Doc, "archivedUrl" | "crawledAt" | "datedByGit">): boolean {
  if (!doc.archivedUrl) return false;
  // Without crawled_at, the last commit may only have touched the frontmatter
  // (adding source_url, say), so it is no sign that the doc was checked again.
  if (doc.datedByGit) return true;
  if (/^https:\/\/(github\.com|raw\.githubusercontent\.com)\//.test(doc.archivedUrl)) return true;
  const date = waybackDate(doc.archivedUrl);
  if (!date) return true; // set by hand
  // A snapshot taken after the check still shows what the doc describes, until
  // the doc is checked again more than MAX_DAYS after the snapshot.
  return !doc.crawledAt || Date.parse(date) >= Date.parse(doc.crawledAt) - MAX_DAYS * 86_400_000;
}

type GitHubRef = { owner: string; repo: string; kind: "blob" | "tree" | "raw"; ref: string | null; path: string };

export function parseGitHub(url: string): GitHubRef | null {
  const raw = url.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
  if (raw) return { owner: raw[1], repo: raw[2], kind: "raw", ref: raw[3], path: raw[4] };
  const page = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)(?:\/(blob|tree)\/([^/#?]+)(?:\/([^#?]*))?)?\/?(?:[#?].*)?$/);
  if (!page) return null;
  return {
    owner: page[1],
    repo: page[2].replace(/\.git$/, ""),
    kind: (page[3] as "blob" | "tree" | undefined) ?? "tree",
    ref: page[4] ?? null,
    path: (page[5] ?? "").replace(/\/$/, ""),
  };
}

function gh(args: string[]): string {
  return execFileSync("gh", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

/** The commit a tag names, or null when the ref is a branch. A tag is already a version, so the doc's date does not move it. */
function tagCommit(ref: GitHubRef): string | null {
  try {
    // Only a tag names a fixed commit; a branch name must still go through the doc date.
    gh(["api", `repos/${ref.owner}/${ref.repo}/git/ref/tags/${ref.ref}`, "--jq", ".ref"]);
    const sha = gh(["api", `repos/${ref.owner}/${ref.repo}/commits/${ref.ref}`, "--jq", ".sha"]);
    return /^[0-9a-f]{40}$/.test(sha) ? sha : null;
  } catch {
    return null;
  }
}

/** The commit the GitHub page showed on the doc's date, as a permalink. */
function githubPermalink(ref: GitHubRef, crawledAt: string | null): string {
  let sha = ref.ref && /^[0-9a-f]{40}$/.test(ref.ref) ? ref.ref : null;
  if (!sha && ref.ref) sha = tagCommit(ref);
  if (!sha) {
    const query = new URLSearchParams({ per_page: "1" });
    if (ref.ref) query.set("sha", ref.ref);
    if (ref.path) query.set("path", decodeURIComponent(ref.path));
    if (crawledAt) query.set("until", `${crawledAt}T23:59:59Z`);
    sha = gh(["api", `repos/${ref.owner}/${ref.repo}/commits?${query}`, "--jq", ".[0].sha"]);
    if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`no commit for ${ref.owner}/${ref.repo} ${ref.path}`);
  }
  if (ref.kind === "raw") return `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${sha}/${ref.path}`;
  return `https://github.com/${ref.owner}/${ref.repo}/${ref.kind}/${sha}${ref.path ? `/${ref.path}` : ""}`;
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

async function fetchWithRetry(url: string, init: RequestInit = {}, attempts = 3): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(120_000) });
      if (response.status !== 429 && response.status < 500) return response;
      if (attempt >= attempts) return response;
    } catch (error) {
      if (attempt >= attempts) throw error;
    }
    await sleep(30_000 * attempt);
  }
}

/** The 200-status snapshot closest to the date, if one is within MAX_DAYS. */
async function closestSnapshot(url: string, date: string): Promise<string | null> {
  const cdx = new URL("https://web.archive.org/cdx/search/cdx");
  cdx.searchParams.set("url", url);
  cdx.searchParams.set("output", "json");
  cdx.searchParams.set("filter", "statuscode:200");
  cdx.searchParams.set("closest", date.replace(/-/g, ""));
  cdx.searchParams.set("sort", "closest");
  cdx.searchParams.set("limit", "1");
  cdx.searchParams.set("fl", "timestamp,original");
  const response = await fetchWithRetry(cdx.href);
  if (!response.ok) throw new Error(`CDX HTTP ${response.status}`);
  const body = (await response.text()).trim();
  const rows = body ? (JSON.parse(body) as string[][]) : [];
  const row = rows[1];
  if (!row) return null;
  const snapshot = `https://web.archive.org/web/${row[0]}/${row[1]}`;
  const snapshotDate = waybackDate(snapshot);
  return snapshotDate && daysBetween(snapshotDate, date) <= MAX_DAYS ? snapshot : null;
}

/** Ask the Wayback Machine to save the page now, and return the snapshot. */
async function saveNow(url: string): Promise<string> {
  const response = await fetchWithRetry(`https://web.archive.org/save/${url}`, { redirect: "manual" });
  const location = response.headers.get("location") ?? response.headers.get("content-location");
  if (location) {
    const absolute = new URL(location, "https://web.archive.org").href;
    if (waybackDate(absolute)) return absolute;
  }
  // Save Page Now sometimes answers 200 with the snapshot instead of a redirect.
  const today = new Date().toISOString().slice(0, 10);
  await sleep(5_000);
  const found = await closestSnapshot(url, today);
  if (found && waybackDate(found) === today) return found;
  throw new Error(`Save Page Now HTTP ${response.status}`);
}

async function permalinkFor(doc: Doc, saved: Map<string, string>): Promise<string> {
  const cached = saved.get(`${doc.sourceUrl} ${doc.crawledAt}`);
  if (cached) return cached;
  const github = parseGitHub(doc.sourceUrl);
  let permalink: string;
  if (github) {
    permalink = githubPermalink(github, doc.crawledAt);
  } else {
    const date = doc.crawledAt ?? new Date().toISOString().slice(0, 10);
    const found = await closestSnapshot(doc.sourceUrl, date);
    if (found) {
      permalink = found;
    } else {
      permalink = await saveNow(doc.sourceUrl);
      await sleep(SAVE_PAUSE_MS);
    }
  }
  saved.set(`${doc.sourceUrl} ${doc.crawledAt}`, permalink);
  return permalink;
}

function docFiles(provider?: string): string[] {
  const providers = provider ? [provider] : readdirSync(DOCS);
  return providers.flatMap((name) => {
    try {
      return readdirSync(join(DOCS, name))
        .filter((file) => file.endsWith(".md"))
        .map((file) => join(DOCS, name, file));
    } catch {
      return [];
    }
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const providerAt = args.indexOf("--provider");
  const provider = providerAt >= 0 ? args[providerAt + 1] : undefined;

  const docs = docFiles(provider)
    .map(readDoc)
    .filter((doc): doc is Doc => doc !== null && !GENERATED.some((pattern) => pattern.test(doc.rel)));
  const todo = docs.filter((doc) => !permalinkHolds(doc));

  if (check) {
    for (const doc of todo) console.log(`${doc.rel}: ${doc.archivedUrl ? "permalink older than crawled_at" : "no permalink"} (${doc.sourceUrl})`);
    console.log(`${docs.length - todo.length} of ${docs.length} docs with a source have a permalink.`);
    return;
  }

  const saved = new Map<string, string>();
  const failed: string[] = [];
  for (const doc of todo) {
    try {
      const permalink = await permalinkFor(doc, saved);
      writeFileSync(doc.path, withArchivedUrl(doc.text, permalink));
      console.log(`${doc.rel}: ${permalink}`);
    } catch (error) {
      failed.push(`${doc.rel}: ${(error as Error).message} (${doc.sourceUrl})`);
      console.log(`${doc.rel}: FAILED ${(error as Error).message}`);
    }
  }
  console.log(`\n${todo.length - failed.length} permalinks written, ${docs.length - todo.length} already set.`);
  if (failed.length) console.log(`No permalink for ${failed.length}:\n${failed.map((line) => `  ${line}`).join("\n")}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
