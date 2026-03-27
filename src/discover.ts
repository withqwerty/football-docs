/**
 * Source discovery for football data providers.
 *
 * Given a provider's known URLs, discovers the best documentation source
 * to crawl. Checks for llms.txt, ReadTheDocs structure, GitHub docs, etc.
 *
 * Usage:
 *   import { discoverBestSource } from "./discover.js";
 *   const result = await discoverBestSource(provider);
 */

import { fetchText, urlExists } from "./http.js";

export interface ProviderSource {
  url: string;
  type: "llms_txt" | "readthedocs" | "github_docs" | "api_docs" | "openapi" | "curated";
  note?: string;
}

export interface DiscoveryResult {
  provider: string;
  /** The best source found, or null if only curated content is available */
  source: ProviderSource | null;
  /** All sources that were checked and what was found */
  checked: Array<{ url: string; found: string | null; error?: string }>;
}

export interface ProbeResult {
  url: string;
  sourceType: ProviderSource["type"];
  llmsTxt: { url: string; content: string } | null;
  isReadTheDocs: boolean;
  isReachable: boolean;
}

/**
 * Probe a base URL for llms.txt variants.
 * Returns the URL and content of the best llms.txt found, or null.
 */
async function probeLlmsTxt(
  baseUrl: string
): Promise<{ url: string; content: string } | null> {
  const root = baseUrl.replace(/\/$/, "");

  for (const filename of ["llms-full.txt", "llms.txt"]) {
    const url = `${root}/${filename}`;
    const content = await fetchText(url);
    if (content && content.length > 100) {
      return { url, content };
    }
  }

  return null;
}

/**
 * Check if a URL looks like a ReadTheDocs or Sphinx site.
 */
async function probeReadTheDocs(url: string): Promise<boolean> {
  const check = await urlExists(url);
  if (!check.ok) return false;

  const html = await fetchText(url);
  if (!html) return false;

  return (
    html.includes("readthedocs") ||
    html.includes("sphinx") ||
    html.includes("Read the Docs") ||
    /\/en\/(latest|stable)\//.test(url)
  );
}

/**
 * Choose the best source to crawl from probe results.
 *
 * Scoring: llms-full.txt (>1000 chars) = 100, llms.txt (>1000 chars) = 90,
 * ReadTheDocs/Sphinx = 70, short llms.txt = 50, reachable = 40, unreachable = 0.
 *
 * @param probeResults - What was actually found at each URL
 * @returns The best source to crawl, or null if only curated content is available
 */
export function chooseBestSource(
  probeResults: ProbeResult[]
): ProviderSource | null {
  let bestScore = 0;
  let bestSource: ProviderSource | null = null;

  for (const probe of probeResults) {
    let score = 0;

    if (probe.llmsTxt) {
      const isFullTxt = probe.llmsTxt.url.includes("llms-full.txt");
      const isSubstantial = probe.llmsTxt.content.length > 1000;
      score = isFullTxt && isSubstantial ? 100
            : isSubstantial             ? 90
            :                             50;
    } else if (probe.isReadTheDocs) {
      score = 70;
    } else if (probe.isReachable) {
      score = 40;
    }

    if (score > bestScore) {
      bestScore = score;
      bestSource = probe.llmsTxt
        ? { url: probe.llmsTxt.url, type: "llms_txt" }
        : { url: probe.url, type: probe.sourceType };
    }
  }

  return bestSource;
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Discover the best documentation source for a provider.
 *
 * Probes all configured URLs for llms.txt, ReadTheDocs markers, and
 * basic reachability, then uses chooseBestSource() to pick the winner.
 */
export async function discoverBestSource(
  provider: string,
  sources: ProviderSource[]
): Promise<DiscoveryResult> {
  const checked: DiscoveryResult["checked"] = [];
  const probeResults: ProbeResult[] = [];

  for (const source of sources) {
    if (source.type === "curated" || !source.url) continue;

    try {
      const [llmsTxt, isReadTheDocs, reachability] = await Promise.all([
        probeLlmsTxt(source.url),
        probeReadTheDocs(source.url),
        urlExists(source.url),
      ]);

      const found = llmsTxt
        ? `llms.txt (${llmsTxt.content.length} chars)`
        : isReadTheDocs
          ? "readthedocs"
          : reachability.ok
            ? "reachable"
            : null;

      checked.push({ url: source.url, found });
      probeResults.push({
        url: source.url,
        sourceType: source.type,
        llmsTxt,
        isReadTheDocs,
        isReachable: reachability.ok,
      });
    } catch (err) {
      checked.push({
        url: source.url,
        found: null,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const bestSource = chooseBestSource(probeResults);

  return { provider, source: bestSource, checked };
}
