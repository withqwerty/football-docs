import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { compareProviders, listProviders, searchDocs } from "../tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "..", "..", "data", "docs.db");

describe("golden retrieval evals", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(DB_PATH, { readonly: true });
  });

  afterAll(() => {
    db.close();
  });

  it.each([
    {
      id: "opta-qualifier-76",
      args: { query: "Opta qualifier 76", provider: "opta", max_results: 3 },
      expected: ["76", "bigChance", "Big chance"],
    },
    {
      id: "fmdb-pro-players-endpoint",
      args: { query: "FMDB Pro players endpoint", provider: "fmdb-pro", max_results: 5 },
      expected: ["/api/players", "x-api-key"],
    },
    {
      id: "transferroom-bearer-token",
      args: { query: "TransferRoom bearer token", provider: "transferroom", max_results: 5 },
      expected: ["bearer token", "apiprod.transferroom.com"],
    },
    {
      id: "statsbomb-shot-freeze-frame",
      args: { query: "StatsBomb shot freeze frame xG", provider: "statsbomb", max_results: 5 },
      expected: ["Shot", "xG", "freeze frame"],
    },
  ])("answers $id from sourced docs", ({ args, expected }) => {
    const result = searchDocs(db, args);
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).not.toContain("No results found");
    expect(text).toContain(`**Provider:** ${args.provider}`);
    expect(text).toContain("**Source:**");
    for (const term of expected) {
      expect(text).toContain(term);
    }
  });

  it("lists the newly covered club API providers", () => {
    const result = listProviders(db);
    const text = result.content[0].text;

    expect(text).toContain("**fmdb-pro** (36 chunks)");
    expect(text).toContain("**transferroom** (38 chunks)");
    expect(text).toContain("api-endpoints");
  });

  it("compares coordinate systems across multiple providers", () => {
    const result = compareProviders(db, {
      topic: "coordinate systems",
      providers: ["opta", "statsbomb", "wyscout"],
    });
    const text = result.content[0].text;

    expect(text).toContain('Comparison for "coordinate systems"');
    expect(text).toContain("## opta");
    expect(text).toContain("## statsbomb");
    expect(text).toContain("## wyscout");
  });
});
