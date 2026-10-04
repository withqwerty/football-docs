import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// docs/free-sources/football-data-columns.md repeats football-data.co.uk's
// notes.txt column key word for word, between marker comments that
// scripts/gen_football_data_columns.py builds from specs/football-data/notes.txt.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("football-data.co.uk column tables", () => {
  it("match specs/football-data/notes.txt", () => {
    const result = spawnSync("python3", ["scripts/gen_football_data_columns.py", "--check"], {
      cwd: ROOT,
      encoding: "utf8",
      // Python on Windows defaults to the ANSI code page for files and pipes.
      env: { ...process.env, PYTHONUTF8: "1" },
    });
    if (result.error) throw result.error;
    expect(result.status, `${result.stdout}${result.stderr}`).toBe(0);
    expect(result.stdout).toContain("football-data column tables match");
  }, 30_000);
});
