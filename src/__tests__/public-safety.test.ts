import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * This is a public repository built alongside private sibling projects. Content
 * has leaked across that boundary before, so the boundary is now a test.
 *
 * Each pattern targets vocabulary that only appears when private material has
 * been pasted or paraphrased in - internal ticket IDs, local mirror paths,
 * private tooling names. Facts about a provider are fine; the machinery used to
 * ingest them privately is not.
 */
const FORBIDDEN: Array<{ label: string; pattern: RegExp }> = [
  { label: "internal ticket reference", pattern: /\bWIT-\d+/ },
  { label: "private sibling repository", pattern: /reep-(custom|register|next|toolkit|scripts)/i },
  { label: "local data mirror", pattern: /[\w-]+-local\.sqlite/i },
  { label: "absolute local path", pattern: /\/Volumes\/[A-Za-z0-9_-]+\//, },
  { label: "private substrate vocabulary", pattern: /\bprovider-mirror\b|\bregister surface\b|\bWIT class\b/i },
  { label: "private register vocabulary", pattern: /\bmint salt|\baction ledger|\bcorroborator\b/i },
  { label: "private ingestion tooling", pattern: /\bloom (refetch|fetch|sync)\b/i },
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, "..", "..");

/** Tracked text files, excluding generated artefacts we do not author. */
function trackedTextFiles(): string[] {
  const out = execFileSync("git", ["ls-files"], { cwd: REPO, encoding: "utf-8" });
  return out
    .split("\n")
    .filter(Boolean)
    .filter((f) => !f.startsWith("node_modules/"))
    .filter((f) => !f.endsWith(".db"))
    .filter((f) => !f.startsWith("specs/"))
    .filter((f) => !f.startsWith("data/provider-truth/"));
}

describe("public-safety boundary", () => {
  const files = trackedTextFiles();

  it("has files to scan", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("contains no private-project references", () => {
    const violations: string[] = [];
    for (const file of files) {
      let text: string;
      try {
        text = readFileSync(resolve(REPO, file), "utf-8");
      } catch {
        continue; // binary or unreadable
      }
      for (const { label, pattern } of FORBIDDEN) {
        const match = text.match(pattern);
        if (match) {
          violations.push(`${file}: ${label} — "${match[0]}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it("does not describe AGENTS.md as gitignored, because it is published", () => {
    const agents = readFileSync(resolve(REPO, "AGENTS.md"), "utf-8");
    expect(agents).not.toMatch(/AGENTS\.md.{0,40}gitignored/i);
  });

  it("detects a planted violation", () => {
    // Assembled at runtime: this file is scanned by the very check it defines, so a
    // literal example would make the guard fail on itself.
    const planted = `see ${"WIT"}-1234 for the backfill`;
    expect(FORBIDDEN.some(({ pattern }) => pattern.test(planted))).toBe(true);
  });
});
