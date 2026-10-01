/**
 * Facts about this release for the website and the announcement card:
 * version, chunk and provider counts, the MCP tools, and each indexed
 * provider's chunk count. Read from package.json, providers.json, the tool
 * list in src/tools.ts and data/docs.db, so run `pnpm ingest` first.
 *
 * The release workflow attaches the output to each GitHub Release as
 * site-stats.json; nutmeg-site reads it from the latest release.
 *
 * Usage:
 *   pnpm site:stats                       # print to stdout
 *   pnpm site:stats --out site-stats.json # write a file
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase } from "../src/sqlite.js";
import { TOOL_NAMES } from "../src/tools.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

type Registry = { providers: Record<string, { display_name?: string }> };

const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8")) as { version: string };
const registry = JSON.parse(readFileSync(resolve(ROOT, "providers.json"), "utf8")) as Registry;

const db = openDatabase(resolve(ROOT, "data", "docs.db"), { readonly: true });
const rows = db.prepare("SELECT provider, COUNT(*) AS chunks FROM docs GROUP BY provider").all() as Array<{
  provider: string;
  chunks: number;
}>;
db.close();

const providers = rows
  .map((row) => ({
    key: row.provider,
    name: registry.providers[row.provider]?.display_name ?? row.provider,
    chunks: Number(row.chunks),
  }))
  .sort((a, b) => b.chunks - a.chunks || a.name.localeCompare(b.name));

const stats = {
  version: pkg.version,
  chunks: providers.reduce((sum, provider) => sum + provider.chunks, 0),
  providerCount: providers.length,
  toolCount: TOOL_NAMES.length,
  tools: [...TOOL_NAMES],
  providers,
};

const json = `${JSON.stringify(stats, null, 2)}\n`;
const outIndex = process.argv.indexOf("--out");
if (outIndex >= 0 && process.argv[outIndex + 1]) {
  writeFileSync(resolve(process.argv[outIndex + 1]), json);
} else {
  process.stdout.write(json);
}
