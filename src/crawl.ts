/**
 * Crawl upstream documentation for football data providers.
 *
 * Fetches documentation from the best available source (llms.txt, ReadTheDocs,
 * GitHub, OpenAPI specs) and writes markdown files with provenance frontmatter.
 *
 * IMPORTANT: This crawler stores upstream content faithfully. It does NOT
 * paraphrase, summarise, or interpret. The content in the output files should
 * be directly traceable to the source URL.
 *
 * Usage:
 *   npm run crawl                         # crawl all providers with sources
 *   npm run crawl -- --provider kloppy    # crawl one provider
 *   npm run crawl -- --discover           # probe sources without crawling
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import SwaggerParser from "@apidevtools/swagger-parser";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import TurndownService from "turndown";
import { discoverBestSource, type ProviderSource } from "./discover.js";
import { fetchText } from "./http.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = resolve(__dirname, "..", "docs");
const PROVIDERS_PATH = resolve(__dirname, "..", "providers.json");

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Sphinx (and other Pygments-based renderers) mark up code blocks as bare
// <pre> containing syntax-highlighting <span>s, not <pre><code>. Turndown's
// built-in fenced-code rule only matches <pre><code>, so these fall through
// to plain-text handling where markdown-escaping mangles identifiers (e.g.
// `read_position_data_json` becomes `read\_position\_data\_json`). Read
// textContent directly to bypass that escaping.
turndown.addRule("preBlock", {
  filter: "pre",
  replacement: (_content, node) => {
    const code = (node as unknown as Element).textContent?.replace(/\n+$/, "") ?? "";
    if (!code.trim()) return "";
    const parentClass = (node as unknown as Element).parentElement?.getAttribute?.("class") ?? "";
    const langMatch = parentClass.match(/highlight-(\w+)/);
    const lang = langMatch && langMatch[1] !== "default" ? langMatch[1] : "";
    return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
  },
});

// Sphinx marks up identifiers/parameter names/default values in signatures
// with <span class="pre"> (a "don't word-wrap" hint, not semantic <code>).
// Same escaping problem as above — render as inline code instead.
turndown.addRule("sphinxPreSpan", {
  filter: (node) =>
    node.nodeName === "SPAN" &&
    ((node as unknown as Element).getAttribute?.("class") ?? "")
      .split(/\s+/)
      .includes("pre"),
  replacement: (_content, node) => `\`${(node as unknown as Element).textContent ?? ""}\``,
});

// Sphinx and mkdocs both append a permalink anchor to every heading. Left in, it
// becomes `## Orientations[¶](https://.../#orientations "Permanent link")`, and
// since a chunk is titled by its heading that URL is the first thing an agent
// reads in a search result. It carries no information the frontmatter lacks.
turndown.addRule("headerlink", {
  filter: (node) =>
    node.nodeName === "A" &&
    ((node as unknown as Element).getAttribute?.("class") ?? "")
      .split(/\s+/)
      .includes("headerlink"),
  replacement: () => "",
});

// Turndown has no table rule, so a <table> falls through to block handling and
// every cell lands on its own line. That is worse than losing the table: a
// coordinate-system alias table becomes a column of unattached words, and an
// agent reading "cdf / CDF / Center / meters / Up" cannot tell which value
// belongs to which heading. Emit GFM instead - the corpus is markdown that
// models read, and the row is the unit of meaning.
turndown.addRule("gfmTable", {
  filter: "table",
  replacement: (_content, node) => {
    // Turndown parses with its own bundled DOM, whose NodeList is neither
    // spreadable nor guaranteed to implement querySelectorAll. Walking direct
    // children is portable, and it keeps a nested table's rows out of this one.
    const childrenNamed = (parent: Element, names: string[]): Element[] => {
      const out: Element[] = [];
      const kids = parent.childNodes;
      for (let i = 0; i < (kids?.length ?? 0); i++) {
        const kid = kids[i] as unknown as Element;
        if (names.includes(kid.nodeName)) out.push(kid);
      }
      return out;
    };

    const table = node as unknown as Element;
    const rows: Element[] = [];
    for (const section of [table, ...childrenNamed(table, ["THEAD", "TBODY", "TFOOT"])]) {
      rows.push(...childrenNamed(section, ["TR"]));
    }
    if (rows.length === 0) return "";

    // textContent alone would flatten `<code>cdf</code>` to bare cdf, and the
    // enum-member check only looks inside backticks - so a vocabulary documented
    // in a table would silently stop being validated.
    const cellText = (cell: Element): string => {
      let text = "";
      const visit = (element: Element) => {
        const kids = element.childNodes;
        for (let i = 0; i < (kids?.length ?? 0); i++) {
          const kid = kids[i] as unknown as Element;
          if (kid.nodeName === "CODE") text += `\`${kid.textContent ?? ""}\``;
          else if (kid.nodeName === "#text") text += kid.textContent ?? "";
          else visit(kid);
        }
      };
      visit(cell);
      // Flatten to one line and neutralise pipes, which would invent columns.
      // Backslashes have to go first: escaping only the pipe turns a cell reading
      // `a\|b` into `a\\|b`, where the backslash escapes itself and the pipe is
      // left live, splitting the row.
      return text
        .replace(/\s+/g, " ")
        .replace(/\\/g, "\\\\")
        .replace(/\|/g, "\\|")
        .trim();
    };

    const body = rows
      .map((row) => childrenNamed(row, ["TH", "TD"]).map(cellText))
      .filter((cells) => cells.length > 0);
    if (body.length === 0) return "";

    // A table whose first row carries <th> has an explicit header; otherwise GFM
    // still requires a delimiter row, so synthesise an empty one.
    const hasHeader = childrenNamed(rows[0], ["TH"]).length > 0;
    const width = Math.max(...body.map((cells) => cells.length));
    const pad = (cells: string[]) => [...cells, ...Array(width - cells.length).fill("")];
    const line = (cells: string[]) => `| ${pad(cells).join(" | ")} |`;

    const header = hasHeader ? body[0] : Array(width).fill("");
    const rest = hasHeader ? body.slice(1) : body;

    return `\n\n${[line(header), `|${" --- |".repeat(width)}`, ...rest.map(line)].join("\n")}\n\n`;
  },
});

// Turndown escapes every underscore in plain text nodes by default (guarding
// against accidental markdown emphasis), including identifiers that carry no
// code markup at all — e.g. Sphinx renders parameter/return names in
// "Variables:" lists as plain `<strong>essential_missing</strong>`, no <code>
// or .pre span in sight. Since this corpus exists for full-text search rather
// than pixel-perfect rendering, an escaped underscore that breaks substring
// matches on the real identifier is worse than the rare accidental italics.
const defaultEscape = turndown.escape.bind(turndown);
turndown.escape = (text: string) => defaultEscape(text).replace(/\\_/g, "_");

// Turndown's built-in image rule escapes alt text via a private module-level
// helper, not the overridable `escape` method above, so alt text (often just
// the image's own filename, e.g. "pitch_positive.png") still comes out with
// escaped underscores. Same fix, applied to this one rule directly.
turndown.addRule("unescapedImageAlt", {
  filter: "img",
  replacement: (_content, node) => {
    const el = node as unknown as Element;
    const alt = el.getAttribute?.("alt") ?? "";
    const src = el.getAttribute?.("src") ?? "";
    const title = el.getAttribute?.("title");
    const titlePart = title ? ` "${title.replace(/"/g, '\\"')}"` : "";
    return src ? `![${alt}](${src}${titlePart})` : "";
  },
});

// ── Types ────────────────────────────────────────────────────────────

interface ProviderConfig {
  description: string;
  version: string | null;
  package: { type: string; name?: string; repo?: string } | null;
  sources: Array<{
    url?: string;
    type: string;
    note?: string;
  }>;
  last_crawled: string | null;
}

interface ProvidersFile {
  providers: Record<string, ProviderConfig>;
}

interface CrawledDoc {
  category: string;
  content: string;
  source_url: string;
  source_type: string;
}

// ── HTML → Markdown ──────────────────────────────────────────────────

/**
 * Extract main content from an HTML page and convert to markdown.
 * Uses Mozilla's Readability (same algorithm as Firefox Reader View)
 * to isolate the main content, then Turndown to convert to markdown.
 */
export function htmlToMarkdown(html: string, url: string): string | null {
  // linkedom's parseHTML doesn't support a url option, so we inject a <base> tag
  // for Readability to resolve relative links against the source URL
  const htmlWithBase = html.includes("<base ")
    ? html
    : html.replace(/(<head[^>]*>)/i, `$1<base href="${url}">`);
  const { document } = parseHTML(htmlWithBase);

  // classesToPreserve keeps class="pre" (Sphinx's no-wrap marker for inline
  // literals) and class="headerlink" (both Sphinx's and mkdocs' per-heading
  // permalink) alive through Readability's cleanup, so the sphinxPreSpan and
  // headerlink Turndown rules above can still detect them.
  const reader = new Readability(document, {
    charThreshold: 100,
    classesToPreserve: ["pre", "headerlink"],
  });
  const article = reader.parse();

  if (!article?.content) return null;

  return turndown.turndown(article.content);
}

// ── Crawl strategies ─────────────────────────────────────────────────

/**
 * Crawl an llms.txt or llms-full.txt file.
 * Already structured for LLM consumption — chunk by top-level heading.
 */
export function crawlLlmsTxt(content: string, sourceUrl: string): CrawledDoc[] {
  const sections: CrawledDoc[] = [];
  const lines = content.split("\n");

  let currentTitle = "overview";
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,2})\s+(.+)/);
    if (headingMatch && currentLines.length > 0) {
      const body = currentLines.join("\n").trim();
      if (body.length > 50) {
        sections.push({
          category: slugify(currentTitle),
          content: body,
          source_url: sourceUrl,
          source_type: "llms_txt",
        });
      }
      currentTitle = headingMatch[2].trim();
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  const body = currentLines.join("\n").trim();
  if (body.length > 50) {
    sections.push({
      category: slugify(currentTitle),
      content: body,
      source_url: sourceUrl,
      source_type: "llms_txt",
    });
  }

  if (sections.length <= 1) {
    return [{
      category: "reference",
      content,
      source_url: sourceUrl,
      source_type: "llms_txt",
    }];
  }

  return sections;
}

/**
 * Crawl a documentation website by fetching linked pages from the index.
 * Works with Sphinx/RTD, MkDocs, GitBook HTML, Docusaurus, and most
 * static doc sites — Readability handles content extraction regardless
 * of the specific platform.
 */
async function crawlDocsSite(baseUrl: string): Promise<CrawledDoc[]> {
  const docs: CrawledDoc[] = [];
  const root = baseUrl.replace(/\/$/, "");
  const rootHost = new URL(root).hostname;
  const usedCategories = new Set<string>();

  const indexHtml = await fetchText(root);
  if (!indexHtml) return docs;

  // Extract the root/index page itself
  const indexContent = htmlToMarkdown(indexHtml, root);
  if (indexContent && indexContent.length >= 100) {
    usedCategories.add("index");
    docs.push({
      category: "index",
      content: indexContent,
      source_url: root,
      source_type: "crawled",
    });
  }

  // Extract links from the index page.
  //
  // Sphinx writes page links as `concepts/dataset.html`; mkdocs and anything else
  // using directory URLs writes `concepts/dataset/`. Matching only the first form
  // is why a mkdocs site used to yield its index page and nothing else.
  const linkPattern = /href="([^"]+)"/g;
  const rootPath = new URL(`${root}/`).pathname;
  const links = new Set<string>();
  for (const match of indexHtml.matchAll(linkPattern)) {
    const href = match[1];
    if (
      href.startsWith("#") ||
      href.includes("genindex") ||
      href.includes("search.html") ||
      href.includes("_static") ||
      href.includes("_sources")
    ) continue;

    let url: URL;
    try {
      url = new URL(href, `${root}/`);
    } catch {
      continue;
    }

    if (url.hostname !== rootHost) continue;
    if (!/\.html?$/.test(url.pathname) && !url.pathname.endsWith("/")) continue;
    // The index page is already captured above, and every nav links back to it.
    if (url.pathname === rootPath) continue;

    // Anchors and queries point into a page already queued, not at a new one.
    url.hash = "";
    url.search = "";
    links.add(url.href);
  }

  // Cap at 50 pages to avoid hammering upstream
  const pageUrls = [...links].slice(0, 50);

  for (const pageUrl of pageUrls) {
    const html = await fetchText(pageUrl);
    if (!html) continue;

    const content = htmlToMarkdown(html, pageUrl);
    if (!content || content.length < 100) continue;

    // Use last 2 path segments to avoid duplicate category names, minus the
    // language and version segments ReadTheDocs puts in every URL - without this
    // a top-level page at /en/latest/getting-started/ is filed as
    // "latest-getting-started", which reads as a version rather than a topic.
    const pathSegments = new URL(pageUrl).pathname
      .replace(/\.(html?|htm)$/, "")
      .split("/")
      .filter(Boolean)
      .filter((segment) => !/^(en|latest|stable|v?\d+(\.\d+)*)$/i.test(segment));
    let category = slugify(pathSegments.slice(-2).join("-") || "page");

    // Deduplicate: append a suffix if the category is already used
    if (usedCategories.has(category)) {
      let suffix = 2;
      while (usedCategories.has(`${category}-${suffix}`)) suffix++;
      category = `${category}-${suffix}`;
    }
    usedCategories.add(category);

    docs.push({
      category,
      content,
      source_url: pageUrl,
      source_type: "crawled",
    });
  }

  return docs;
}

/**
 * Crawl a GitHub repository's README.
 */
async function crawlGitHubReadme(repoUrl: string): Promise<CrawledDoc[]> {
  const docs: CrawledDoc[] = [];

  const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!repoMatch) return docs;
  const [, owner, repo] = repoMatch;

  for (const branch of ["main", "master", "develop"]) {
    const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    const content = await fetchText(readmeUrl);
    if (content) {
      docs.push({
        category: "readme",
        content,
        source_url: readmeUrl,
        source_type: "crawled",
      });
      break;
    }
  }

  return docs;
}

/**
 * Crawl an OpenAPI/Swagger spec and convert endpoints to searchable markdown.
 * Handles both YAML and JSON specs, with $ref resolution.
 */
async function crawlOpenApiSpec(specUrl: string): Promise<CrawledDoc[]> {
  const docs: CrawledDoc[] = [];

  // Fetch the spec ourselves first, then dereference the parsed object
  // with external $ref resolution disabled to prevent SSRF via malicious specs
  const specContent = await fetchText(specUrl);
  if (!specContent) return docs;

  let api: Awaited<ReturnType<typeof SwaggerParser.dereference>>;
  try {
    const parsed = JSON.parse(specContent);
    api = await SwaggerParser.dereference(parsed, {
      resolve: { external: false },
    });
  } catch {
    // If JSON parse fails, try as YAML via URL (for YAML specs)
    try {
      api = await SwaggerParser.dereference(specUrl, {
        resolve: { external: false },
      });
    } catch (err) {
      console.error(`  Failed to parse OpenAPI spec: ${err}`);
      return docs;
    }
  }

  const info = api.info;
  const paths = (api as Record<string, unknown>).paths as Record<string, Record<string, unknown>> | undefined;

  // Overview doc
  const overviewLines: string[] = [
    `# ${info?.title ?? "API"}`,
    "",
  ];
  if (info?.description) overviewLines.push(info.description, "");
  if (info?.version) overviewLines.push(`**Version:** ${info.version}`, "");

  // Collect servers/base URLs if present
  const servers = (api as Record<string, unknown>).servers as Array<{ url: string; description?: string }> | undefined;
  if (servers?.length) {
    overviewLines.push("## Base URLs", "");
    for (const s of servers) {
      overviewLines.push(`- \`${s.url}\`${s.description ? ` — ${s.description}` : ""}`);
    }
    overviewLines.push("");
  }

  docs.push({
    category: "api-overview",
    content: overviewLines.join("\n").trim(),
    source_url: specUrl,
    source_type: "openapi",
  });

  if (!paths) return docs;

  // Group endpoints by tag (or by first path segment if untagged)
  const byGroup = new Map<string, string[]>();

  for (const [path, methods] of Object.entries(paths)) {
    if (!methods || typeof methods !== "object") continue;

    for (const [method, details] of Object.entries(methods)) {
      if (method.startsWith("x-") || typeof details !== "object" || !details) continue;
      const op = details as Record<string, unknown>;

      const tags = (op.tags as string[]) ?? [path.split("/").filter(Boolean)[0] ?? "general"];
      const group = tags[0] ?? "general";

      const lines: string[] = [];
      lines.push(`### ${method.toUpperCase()} ${path}`);
      if (op.summary) lines.push("", String(op.summary));
      if (op.description) lines.push("", String(op.description));

      // Parameters
      const params = op.parameters as Array<Record<string, unknown>> | undefined;
      if (params?.length) {
        lines.push("", "**Parameters:**", "");
        lines.push("| Name | In | Type | Required | Description |");
        lines.push("|---|---|---|---|---|");
        for (const p of params) {
          const schema = p.schema as Record<string, unknown> | undefined;
          lines.push(
            `| ${p.name} | ${p.in} | ${schema?.type ?? "—"} | ${p.required ? "yes" : "no"} | ${p.description ?? "—"} |`
          );
        }
      }

      // Response codes
      const responses = op.responses as Record<string, Record<string, unknown>> | undefined;
      if (responses) {
        lines.push("", "**Responses:**", "");
        for (const [code, resp] of Object.entries(responses)) {
          lines.push(`- **${code}**: ${resp.description ?? "—"}`);
        }
      }

      lines.push("");

      const groupLines = byGroup.get(group) ?? [];
      groupLines.push(lines.join("\n"));
      byGroup.set(group, groupLines);
    }
  }

  // Write one doc per tag/group
  for (const [group, endpoints] of byGroup) {
    docs.push({
      category: slugify(group),
      content: `## ${group}\n\n${endpoints.join("\n---\n\n")}`,
      source_url: specUrl,
      source_type: "openapi",
    });
  }

  return docs;
}

// ── Utilities ────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

/** Write a crawled doc to disk with provenance frontmatter. */
function writeCrawledDoc(
  provider: string,
  doc: CrawledDoc,
  upstreamVersion: string | null
): void {
  const dir = resolve(DOCS_DIR, provider);
  mkdirSync(dir, { recursive: true });

  const frontmatter = [
    "---",
    `source_url: ${doc.source_url}`,
    `source_type: ${doc.source_type}`,
    upstreamVersion ? `upstream_version: ${upstreamVersion}` : `upstream_version:`,
    `crawled_at: ${new Date().toISOString()}`,
    "---",
    "",
  ].join("\n");

  const filePath = resolve(dir, `${doc.category}.md`);
  const rel = relative(dir, filePath);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`Path traversal detected: ${doc.category}`);
  }
  writeFileSync(filePath, frontmatter + doc.content, "utf-8");
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const providerArg = args.indexOf("--provider");
  const singleProvider = providerArg >= 0 ? args[providerArg + 1] : undefined;
  const discoverOnly = args.includes("--discover");

  if (!existsSync(PROVIDERS_PATH)) {
    console.error("providers.json not found. Create it first.");
    process.exit(1);
  }

  const providersFile = JSON.parse(
    readFileSync(PROVIDERS_PATH, "utf-8")
  ) as ProvidersFile;
  const providers = providersFile.providers;

  const targets = singleProvider
    ? { [singleProvider]: providers[singleProvider] }
    : providers;

  if (singleProvider && !providers[singleProvider]) {
    console.error(`Provider "${singleProvider}" not found in providers.json`);
    process.exit(1);
  }

  for (const [name, config] of Object.entries(targets)) {
    if (!config) continue;

    const sources: ProviderSource[] = config.sources
      .filter((s): s is { url: string; type: string; note?: string } => !!s.url)
      .map((s) => ({
        url: s.url,
        type: s.type as ProviderSource["type"],
        note: s.note,
      }));

    if (sources.length === 0) {
      console.log(`${name}: curated-only (no URLs to crawl)`);
      continue;
    }

    console.log(`\n${name}: discovering sources...`);
    const discovery = await discoverBestSource(name, sources);

    for (const check of discovery.checked) {
      const status = check.found ?? check.error ?? "not found";
      console.log(`  ${check.url} → ${status}`);
    }

    if (!discovery.source) {
      console.log(`  → no crawlable source found (chooseBestSource returned null)`);
      continue;
    }

    console.log(`  → best source: ${discovery.source.type} (${discovery.source.url})`);

    if (discoverOnly) continue;

    // Crawl based on source type
    let docs: CrawledDoc[] = [];

    if (discovery.source.type === "llms_txt") {
      const content = await fetchText(discovery.source.url);
      if (content) {
        docs = crawlLlmsTxt(content, discovery.source.url);
      }
    } else if (discovery.source.type === "readthedocs" || discovery.source.type === "api_docs") {
      docs = await crawlDocsSite(discovery.source.url);
    } else if (discovery.source.type === "github_docs") {
      docs = await crawlGitHubReadme(discovery.source.url);
    } else if (discovery.source.type === "openapi") {
      docs = await crawlOpenApiSpec(discovery.source.url);
    }

    if (docs.length === 0) {
      console.log(`  → no content extracted`);
      continue;
    }

    for (const doc of docs) {
      writeCrawledDoc(name, doc, config.version);
      console.log(`  wrote ${name}/${doc.category}.md (${doc.content.length} chars) [${doc.source_type}]`);
    }

    console.log(`  → ${docs.length} doc(s) written`);
  }
}

// Only run when executed directly. Importing this module for its exported
// helpers - which the tests do - must not start a crawl: it writes over docs/
// for every provider in the registry, from whatever upstream happens to serve
// that minute. Compare resolved paths rather than matching on the filename, so
// a same-named script elsewhere on the path cannot trigger it either.
const entrypoint = process.argv[1] ? resolve(process.argv[1]) : "";
if (entrypoint && entrypoint === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error("Crawl failed:", err);
    process.exit(1);
  });
}
