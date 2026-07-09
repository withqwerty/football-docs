import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { compareProviders, listProviders, resolveEntity, searchDocs } from "../tools.js";

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
    {
      id: "opta-provider-xg",
      args: {
        query: "Opta provider xG qualifier 321 standard qualifier 213 match expected goals endpoint",
        provider: "opta",
        max_results: 5,
      },
      expected: ["321", "322", "matchexpectedgoals", "213"],
    },
    {
      id: "statsbomb-chart-coordinate-normalisation",
      args: {
        query: "StatsBomb to 0-100 coordinate normalisation shot map xG chart",
        provider: "StatsBomb Open Data",
        max_results: 5,
      },
      expectedProvider: "statsbomb",
      expected: ["120", "80", "100", "flip the coordinates"],
    },
    {
      id: "wyscout-lineups-formations",
      args: {
        query: "Wyscout formation lineups team formation player positions starting eleven",
        provider: "wyscout",
        max_results: 5,
      },
      expected: ["/matches/{wyId}/formations", "formations", "lineups"],
    },
    {
      id: "fbref-provider-alias",
      args: {
        query: "FBref player season stats shooting standard table",
        provider: "fbref",
        max_results: 5,
      },
      expectedProvider: "free-sources",
      expected: ["fbref (free-sources)", "**Provider:** free-sources", "player_stats"],
    },
    {
      id: "understat-provider-alias",
      args: {
        query: "Understat shot events per-shot xG JSON data",
        provider: "understat",
        max_results: 5,
      },
      expectedProvider: "free-sources",
      expected: ["understat (free-sources)", "**Provider:** free-sources", "read_shot_events"],
    },
    {
      id: "fmdb-provider-alias",
      args: {
        query: "FMDB player endpoint API key",
        provider: "FMDB",
        max_results: 5,
      },
      expectedProvider: "fmdb-pro",
      expected: ["FMDB (fmdb-pro)", "**Provider:** fmdb-pro", "x-api-key"],
    },
    {
      id: "xt-expected-threat",
      args: {
        query: "xT expected threat action value grid socceraction pass carry shot chart",
        max_results: 5,
      },
      expectedProvider: "socceraction",
      expected: ["Expected Threat", "xT", "grid", "xT(destination zone) - xT(origin zone)"],
    },
    {
      id: "ppda-pressing",
      args: {
        query: "PPDA pressing passes allowed defensive actions opponent build-up zone",
        max_results: 5,
      },
      expectedProvider: "statsbomb",
      expected: ["PPDA", "Passes Per Defensive Action", "defensive action"],
    },
    {
      id: "pass-network",
      args: {
        query: "passing network pass matrix average positions player connections",
        max_results: 5,
      },
      expectedProvider: "opta",
      expected: ["Pass matrix", "average positions", "Passing networks"],
    },
    {
      id: "set-piece-shot-quality",
      args: {
        query: "corner shots set piece xG shot quality restart types Opta qualifiers",
        max_results: 5,
      },
      expectedProvider: "statsbomb",
      expected: ["Set pieces", "team_match_corner_xg", "xG per corner"],
    },
  ])("answers $id from sourced docs", ({ args, expected, expectedProvider }) => {
    const result = searchDocs(db, args);
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).not.toContain("No results found");
    expect(text).toContain(`**Provider:** ${expectedProvider ?? args.provider}`);
    expect(text).toContain("**Source:**");
    for (const term of expected) {
      expect(text).toContain(term);
    }
  });

  it("lists the newly covered club API providers", () => {
    const result = listProviders(db);
    const text = result.content[0].text;

    expect(text).toContain("**fmdb-pro** (36 chunks)");
    expect(text).toContain("aliases: fmdb");
    expect(text).toContain("**transferroom** (38 chunks)");
    expect(text).toContain("aliases: transfer-room");
    expect(text).toContain("**free-sources** (45 chunks)");
    expect(text).toContain("aliases: fbref, football-reference, understat");
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

  it("keeps explicitly requested providers in long project-style comparisons", () => {
    const result = compareProviders(db, {
      topic:
        "coordinate systems for event and tracking data including pitch dimensions origin direction of play and conversion considerations",
      providers: ["statsbomb", "wyscout", "opta", "skillcorner"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 4 provider(s)");
    expect(text).toContain("## statsbomb");
    expect(text).toContain("120 x 80");
    expect(text).toContain("## wyscout");
    expect(text).toContain("coordinates are percentages");
    expect(text).toContain("directions");
    expect(text).toContain("## opta");
    expect(text).toContain("0-100");
    expect(text).toContain("## skillcorner");
    expect(text).toContain("pitch_length");
  });

  it("normalises compare provider aliases and reports unknown requested providers", () => {
    const result = compareProviders(db, {
      topic: "players endpoint authentication API key bearer token",
      providers: ["FMDB", "Transfer Room", "Not A Provider"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("## fmdb-pro");
    expect(text).toContain("x-api-key");
    expect(text).toContain("## transferroom");
    expect(text).toContain("Bearer");
    expect(text).toContain("No matching docs found for requested provider(s): not-a-provider");
  });

  it("compares adapter coordinate normalisation for chart surfaces", () => {
    const result = compareProviders(db, {
      topic: "adapter coordinate normalisation for shot maps heatmaps pass networks",
      providers: ["StatsBomb Open Data", "Wyscout", "Opta F24", "mplsoccer"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 4 provider(s)");
    expect(text).toContain("## statsbomb");
    expect(text).toContain("120 x 80");
    expect(text).toContain("## wyscout");
    expect(text).toContain("## opta");
    expect(text).toContain("## mplsoccer");
  });

  it("compares tracking metadata needed for physical and pitch views", () => {
    const result = compareProviders(db, {
      topic: "tracking metadata pitch length width periods fps physical speed distance",
      providers: ["SkillCorner", "databallpy", "mplsoccer"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 3 provider(s)");
    expect(text).toContain("## skillcorner");
    expect(text).toContain("pitch_length");
    expect(text).toContain("## databallpy");
    expect(text).toContain("## mplsoccer");
  });

  it("distinguishes an unindexed provider filter from an empty search", () => {
    const result = searchDocs(db, {
      query: "shot map expected threat player radar",
      provider: "WhoScored",
      max_results: 3,
    });
    const text = result.content[0].text;

    expect(result.isError).toBe(true);
    expect(text).toContain('Provider "WhoScored (whoscored)" is not indexed');
    expect(text).toContain("Call list_providers");
    expect(text).toContain("request_update");
  });

  it("suggests close provider matches for typoed provider filters", () => {
    const result = searchDocs(db, {
      query: "shot freeze frame xG",
      provider: "StatBomb",
      max_results: 3,
    });
    const text = result.content[0].text;

    expect(result.isError).toBe(true);
    expect(text).toContain('Provider "StatBomb (statbomb)" is not indexed');
    expect(text).toContain("Did you mean: statsbomb?");
  });

  it("reports unindexed providers when a comparison has no matches", () => {
    const result = compareProviders(db, {
      topic: "shot maps and xG",
      providers: ["WhoScored", "SofaScore"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain('No matching docs found for "shot maps and xG"');
    expect(text).toContain("Requested provider(s) not indexed: whoscored, sofascore");
    expect(text).toContain("Call list_providers");
    expect(text).toContain("request_update");
  });

  it("suggests close provider matches for comparison provider typos", () => {
    const result = compareProviders(db, {
      topic: "tracking pitch length width physical data",
      providers: ["Skill Coner"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("Requested provider(s) not indexed: skill-coner");
    expect(text).toContain("skill-coner: did you mean skillcorner?");
  });

  it("keeps typo suggestions when comparison has partial results", () => {
    const result = compareProviders(db, {
      topic: "tracking pitch length width physical data",
      providers: ["SkillCorner", "Skill Coner"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("## skillcorner");
    expect(text).toContain("No matching docs found for requested provider(s): skill-coner");
    expect(text).toContain("skill-coner: did you mean skillcorner?");
  });

  it("explains Reep authentication failures for entity resolution", async () => {
    const result = await resolveEntity(
      { name: "Arsenal", type: "team" },
      {
        baseUrl: "https://reep.example.test",
        fetchImpl: async () => new Response("Unauthorized", { status: 401, statusText: "Unauthorized" }),
      },
    );
    const text = result.content[0].text;

    expect(result.isError).toBe(true);
    expect(text).toContain("Reep API authentication failed");
    expect(text).toContain("Entity resolution is optional");
    expect(text).toContain("Docs search tools still work");
  });
});
