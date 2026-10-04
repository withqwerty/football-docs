import { mkdtempSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { InstallWatch } from "../stale-install.js";

// npx updates its cache folder in place; a server that started on the old
// version must say so instead of failing with an unclear error.

function install(version: string) {
  const dir = mkdtempSync(join(tmpdir(), "fd-install-"));
  const path = join(dir, "package.json");
  writeFileSync(path, JSON.stringify({ name: "football-docs", version }));
  return { dir, path };
}

function bump(path: string, version: string) {
  writeFileSync(path, JSON.stringify({ name: "football-docs", version }));
  // Make sure the change is visible even on file systems with coarse mtimes.
  const later = new Date(Date.now() + 5_000);
  utimesSync(path, later, later);
}

const ok = async () => ({ content: [{ type: "text" as const, text: "result" }] });

describe("install watch", () => {
  it("adds nothing while the files match the running version", async () => {
    const { path } = install("0.16.2");
    const watch = new InstallWatch(path, "0.16.2");
    expect(await watch.wrap(ok)).toEqual({ content: [{ type: "text", text: "result" }] });
  });

  it("puts a reconnect note first after an update on disk", async () => {
    const { path } = install("0.16.1");
    const watch = new InstallWatch(path, "0.16.1");
    await watch.wrap(ok);
    bump(path, "0.16.2");
    const reply = await watch.wrap(ok);
    expect(reply.content[0].text).toMatch(/on disk is now v0\.16\.2, but this server is still running v0\.16\.1.*Reconnect/);
    expect(reply.content[1].text).toBe("result");
  });

  it("turns a failure after an update into an error that says how to recover", async () => {
    const { path } = install("0.14.0");
    const watch = new InstallWatch(path, "0.14.0");
    bump(path, "0.16.2");
    const reply = await watch.wrap(async () => {
      throw new Error("Could not locate the bindings file.");
    });
    expect(reply.isError).toBe(true);
    expect(reply.content[0].text).toMatch(/Reconnect or restart the football-docs MCP server[\s\S]*Could not locate the bindings file/);
  });

  it("rethrows a failure when nothing changed on disk", async () => {
    const { path } = install("0.16.2");
    const watch = new InstallWatch(path, "0.16.2");
    await expect(watch.wrap(async () => { throw new Error("boom"); })).rejects.toThrow("boom");
  });

  it("notices when the install folder is gone", async () => {
    const { dir, path } = install("0.16.2");
    const watch = new InstallWatch(path, "0.16.2");
    rmSync(dir, { recursive: true, force: true });
    expect(watch.notice()).toMatch(/files this server \(v0\.16\.2\) started from are gone/);
  });
});
