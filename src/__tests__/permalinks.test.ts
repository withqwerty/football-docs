import { describe, expect, it } from "vitest";
import { parseGitHub, permalinkHolds, waybackDate, withArchivedUrl } from "../../scripts/permalinks.mjs";

describe("permalinks script", () => {
  it("puts archived_url after source_url and replaces an old one", () => {
    const text = "---\nsource_url: https://a.example/x\nsource_type: curated\ncrawled_at: 2026-11-24\n---\n\n# T\n";
    const once = withArchivedUrl(text, "https://web.archive.org/web/20261124000000/https://a.example/x");
    expect(once).toBe(
      "---\nsource_url: https://a.example/x\narchived_url: https://web.archive.org/web/20261124000000/https://a.example/x\nsource_type: curated\ncrawled_at: 2026-11-24\n---\n\n# T\n",
    );
    const twice = withArchivedUrl(once, "https://web.archive.org/web/20261125000000/https://a.example/x");
    expect(twice.match(/archived_url:/g)).toHaveLength(1);
    expect(twice).toContain("archived_url: https://web.archive.org/web/20261125000000/");
  });

  it("reads the date in a Wayback URL", () => {
    expect(waybackDate("https://web.archive.org/web/20261125113550/https://reep.football/data/")).toBe("2026-11-25");
    expect(waybackDate("https://github.com/a/b")).toBeNull();
  });

  it("keeps a snapshot until the doc is checked well after it", () => {
    const archivedUrl = "https://web.archive.org/web/20261125000000/https://a.example/x";
    expect(permalinkHolds({ archivedUrl, crawledAt: "2026-09-24" })).toBe(true); // saved after the check
    expect(permalinkHolds({ archivedUrl, crawledAt: "2026-12-10" })).toBe(true); // within 30 days
    expect(permalinkHolds({ archivedUrl, crawledAt: "2027-02-01" })).toBe(false); // checked again later
    expect(permalinkHolds({ archivedUrl: null, crawledAt: "2026-11-24" })).toBe(false);
    expect(permalinkHolds({ archivedUrl: "https://github.com/a/b/tree/0123", crawledAt: "2030-01-01" })).toBe(true);
  });

  it("parses GitHub page and raw URLs", () => {
    expect(parseGitHub("https://github.com/ImpectAPI/open-data")).toEqual({
      owner: "ImpectAPI",
      repo: "open-data",
      kind: "tree",
      ref: null,
      path: "",
    });
    expect(parseGitHub("https://github.com/ImpectAPI/open-data/tree/v2.0")).toMatchObject({ kind: "tree", ref: "v2.0", path: "" });
    expect(parseGitHub("https://github.com/hudl/open-data/blob/master/doc/events.md")).toMatchObject({
      kind: "blob",
      ref: "master",
      path: "doc/events.md",
    });
    expect(parseGitHub("https://raw.githubusercontent.com/o/r/main/a/b.json")).toMatchObject({ kind: "raw", ref: "main", path: "a/b.json" });
    expect(parseGitHub("https://docs.sportmonks.com/football/llms-full.txt")).toBeNull();
  });
});
