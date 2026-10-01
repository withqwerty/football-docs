import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// The STATSports, Firstbeat, Hawkin Dynamics and VALD docs carry tables that
// scripts/gen_vendor_tables.py builds from the mirrored specs, between
// `<!-- generated:<id> start -->` and `end -->` markers. The script is the only
// definition of those tables, so the test runs it rather than reimplementing it:
// `--check` writes nothing and exits 1 with a diff when a doc and specs/ disagree.
// It needs only python3 and its standard library, which CI's runners have.

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

describe("generated vendor tables", () => {
  it("match what specs/ generates", () => {
    const result = spawnSync("python3", ["scripts/gen_vendor_tables.py", "--check"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    if (result.error) throw result.error;
    const report = `${result.stdout}${result.stderr}`;
    expect(result.status, report).toBe(0);
    expect(result.stdout).toContain("generated sections match specs/");
  });
});
