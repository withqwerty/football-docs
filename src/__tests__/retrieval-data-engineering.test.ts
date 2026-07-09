import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { searchDocs } from "../tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "..", "..", "data", "docs.db");

describe("data-engineering retrieval", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(DB_PATH, { readonly: true });
  });

  afterAll(() => {
    db.close();
  });

  it("finds soccerdata cache, retry, and proxy guidance", () => {
    const result = searchDocs(db, {
      query:
        "soccerdata public data pipeline cache directory no_cache no_store proxy retries FBref rate limits",
      provider: "soccerdata",
      max_results: 8,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    expect(text).toContain("Rate Limits and Retries");
    expect(text).toContain("FBref");
    expect(text).toContain("7s between requests");
    expect(text).toContain("no_cache=True");
    expect(text).toContain("no_store=True");
    expect(text).toContain("data_dir=Path");
    expect(text).toContain("force_cache=True");
    expect(text).toContain("proxy=['proxy1', 'proxy2']");
  });

  it("finds soccerdata reader architecture for HTTP-backed sources", () => {
    const result = searchDocs(db, {
      query:
        "soccerdata FBref Understat ClubElo MatchHistory BaseRequestsReader tls_requests cache proxy management",
      provider: "soccerdata",
      max_results: 6,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    expect(text).toContain("Architecture");
    expect(text).toContain("`BaseRequestsReader`");
    expect(text).toContain("`tls_requests`");
    expect(text).toContain("FBref");
    expect(text).toContain("Understat");
    expect(text).toContain("ClubElo");
    expect(text).toContain("MatchHistory");
    expect(text).toContain("caching, proxy management");
  });
});
