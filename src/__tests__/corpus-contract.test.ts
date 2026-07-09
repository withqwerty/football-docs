import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TOOL_NAMES } from "../tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const DB_PATH = resolve(ROOT, "data", "docs.db");

function slugProvider(displayName: string): string {
  return displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function markdownFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...markdownFiles(fullPath));
    } else if (entry.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

describe("corpus and public contract", () => {
  let db: Database.Database;
  let counts: Map<string, number>;

  beforeAll(() => {
    db = new Database(DB_PATH, { readonly: true });
    const rows = db
      .prepare("SELECT provider, COUNT(*) as chunks FROM docs GROUP BY provider ORDER BY provider")
      .all() as Array<{ provider: string; chunks: number }>;
    counts = new Map(rows.map((row) => [row.provider, row.chunks]));
  });

  afterAll(() => {
    db.close();
  });

  it("keeps README provider counts in sync with the shipped database", () => {
    const readme = readFileSync(resolve(ROOT, "README.md"), "utf-8");
    const summary = readme.match(/\*\*([\d,]+) searchable chunks\*\* across (\d+) providers and tools\./);

    expect(summary).not.toBeNull();
    const totalFromReadme = Number(summary![1].replace(/,/g, ""));
    const providerCountFromReadme = Number(summary![2]);
    const totalFromDb = [...counts.values()].reduce((sum, chunks) => sum + chunks, 0);

    expect(totalFromReadme).toBe(totalFromDb);
    expect(providerCountFromReadme).toBe(counts.size);

    const providerRows = [...readme.matchAll(/^\| ([^|]+) \| (\d+) \| [^|]+ \|$/gm)];
    expect(providerRows).toHaveLength(counts.size);
    for (const [, displayName, chunks] of providerRows) {
      expect(counts.get(slugProvider(displayName))).toBe(Number(chunks));
    }
  });

  it("keeps the documented MCP tools in sync with the implementation", () => {
    const readme = readFileSync(resolve(ROOT, "README.md"), "utf-8");
    const toolRows = [...readme.matchAll(/^\| `([^`]+)` \| [^|]+ \|$/gm)].map((match) => match[1]);

    expect(toolRows).toEqual([...TOOL_NAMES]);
  });

  it("keeps every indexed provider registered in providers.json", () => {
    const registry = readJson<{ providers: Record<string, unknown> }>(resolve(ROOT, "providers.json"));

    for (const provider of counts.keys()) {
      expect(registry.providers).toHaveProperty(provider);
    }
  });

  it("ships the runtime files needed by the npm package", () => {
    const pkg = readJson<{ bin: Record<string, string>; files: string[] }>(resolve(ROOT, "package.json"));

    expect(pkg.bin["football-docs"]).toBe("bin/serve.js");
    expect(pkg.files).toEqual(expect.arrayContaining(["dist/", "bin/", "data/docs.db", "docs/", "providers.json"]));
    expect(existsSync(resolve(ROOT, "bin", "serve.js"))).toBe(true);
    expect(existsSync(DB_PATH)).toBe(true);
  });

  it("does not leak local machine paths or obvious secrets into indexed docs", () => {
    const forbidden = [/\/Users\//, /\/Volumes\//, /REEP_NEXT_API_KEY/, /sk-[A-Za-z0-9_-]{20,}/];

    for (const file of markdownFiles(resolve(ROOT, "docs"))) {
      const content = readFileSync(file, "utf-8");
      for (const pattern of forbidden) {
        expect(content, `${file} must not match ${pattern}`).not.toMatch(pattern);
      }
    }
  });
});
