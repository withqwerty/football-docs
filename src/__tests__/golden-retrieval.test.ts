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
      id: "opta-goal-kick-story-qualifiers",
      args: {
        query: "Opta goal kick qualifier 124 pass end coordinates 140 141 short long goal kicks",
        provider: "opta",
        max_results: 5,
      },
      expected: ["124", "goal-kick distribution charts", "Q140/Q141"],
    },
    {
      id: "opta-var-review-delay-qualifier",
      args: {
        query: "Opta VAR review qualifier 364 delay start typeId 27 delay end typeId 28",
        provider: "opta",
        max_results: 5,
      },
      expected: ["364", "typeId 27 + Q364", "typeId 28 + Q364"],
    },
    {
      id: "opta-penalty-qualifier-variants",
      args: {
        query: "Opta penalty qualifier 9 108 penalty shot foul awarded",
        provider: "opta",
        max_results: 5,
      },
      expected: ["9", "108", "Penalty"],
    },
    {
      id: "opta-own-goal-qualifier-variants",
      args: {
        query: "Opta own goal qualifier 28 280 OWN_GOAL shot distance attribution",
        provider: "opta",
        max_results: 5,
      },
      expected: ["28", "280", "OWN_GOAL", "reattribute"],
    },
    {
      id: "opta-open-play-cross-story-qualifiers",
      args: {
        query: "Opta open play crosses Q2 excluding Q6 corner Q5 free kick through ball Q4 headed pass Q3",
        provider: "opta",
        max_results: 5,
      },
      expected: ["Q2", "Q5/Q6", "Q4", "Q3"],
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
      id: "whoscored-opta-family-alias",
      args: {
        query: "WhoScored shot event types qualifiers body part xG fallback",
        provider: "WhoScored",
        max_results: 5,
      },
      expectedProvider: "opta",
      expected: ["WhoScored (opta)", "**Provider:** opta", "Shot Qualifiers"],
    },
    {
      id: "sofascore-soccerdata-alias",
      args: {
        query: "Sofascore match summary public API schedule teams score status",
        provider: "Sofascore",
        max_results: 5,
      },
      expectedProvider: "soccerdata",
      expected: ["Sofascore (soccerdata)", "**Provider:** soccerdata", "sd.Sofascore", "read_schedule"],
    },
    {
      id: "espn-soccerdata-alias",
      args: {
        query: "ESPN public API match summary schedule team scores lineups",
        provider: "ESPN",
        max_results: 5,
      },
      expectedProvider: "soccerdata",
      expected: ["ESPN (soccerdata)", "**Provider:** soccerdata", "sd.ESPN", "read_matchsheet"],
    },
    {
      id: "metrica-databallpy-alias",
      args: {
        query: "Metrica tracking events open data game provider coordinates",
        provider: "Metrica",
        max_results: 5,
      },
      expectedProvider: "databallpy",
      expected: [
        "Metrica (databallpy)",
        "**Provider:** databallpy",
        'tracking_data_provider="metrica"',
        "Has open data support",
      ],
    },
    {
      id: "sportec-databallpy-alias",
      args: {
        query: "Sportec DFL open tracking event data load_open_tracking_data",
        provider: "Sportec",
        max_results: 5,
      },
      expectedProvider: "databallpy",
      expected: [
        "Sportec (databallpy)",
        "**Provider:** databallpy",
        "sportec.load_open_tracking_data",
        "sportec.load_open_event_data",
      ],
    },
    {
      id: "second-spectrum-kloppy-alias",
      args: {
        query: "Second Spectrum tracking provider kloppy load optical data coordinates",
        provider: "Second Spectrum",
        max_results: 5,
      },
      expectedProvider: "kloppy",
      expected: [
        "Second Spectrum (kloppy)",
        "**Provider:** kloppy",
        "Second Spectrum (Tracking)",
        "secondspectrum.load",
      ],
    },
    {
      id: "sportradar-api-alias",
      args: {
        query: "x-api-key soccer v4 extended summary base URL",
        provider: "SportRadar API",
        max_results: 5,
      },
      expectedProvider: "sportradar",
      expected: [
        "SportRadar API (sportradar)",
        "**Provider:** sportradar",
        "https://api.sportradar.com/soccer-extended",
        "x-api-key",
      ],
    },
    {
      id: "sportradar-charting-surfaces",
      args: {
        query: "Sport Event Extended Timeline x y destination_x xg_value pass direction coordinates",
        provider: "Sportradar",
        max_results: 5,
      },
      expectedProvider: "sportradar",
      expected: ["Shot map", "Pass map", "destination_x", "xg_value", "goalface_x"],
    },
    {
      id: "soccer-extended-probability-alias",
      args: {
        query: "win probability momentum timeline probabilities game state chart",
        provider: "Soccer Extended",
        max_results: 5,
      },
      expectedProvider: "sportradar",
      expected: [
        "Soccer Extended (sportradar)",
        "Win-probability chart",
        "Sport Event Probabilities",
        "Timeline Probabilities",
      ],
    },
    {
      id: "thesportsdb-livescore-alias",
      args: {
        query: "livescore soccer API X-API-KEY event status team name mapping",
        provider: "TheSportsDB",
        max_results: 5,
      },
      expectedProvider: "thesportsdb",
      expected: [
        "TheSportsDB (thesportsdb)",
        "**Provider:** thesportsdb",
        "X-API-KEY",
        "livescore/soccer",
        "Brighton and Hove Albion",
      ],
    },
    {
      id: "tsdb-scorigami-live-score-alias",
      args: {
        query: "Premier League live scores scorigami final status idEvent strProgress",
        provider: "TSDB",
        max_results: 5,
      },
      expectedProvider: "thesportsdb",
      expected: ["TSDB (thesportsdb)", "idEvent", "strProgress", "`FT`", "match finished"],
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
      id: "socceraction-kloppy-vaep-runtime-caveats",
      args: {
        query: "socceraction kloppy Opta convert_to_actions VAEP SPADL support best effort StatsBomb training",
        max_results: 5,
      },
      expectedProvider: "socceraction",
      expected: [
        "kloppy bridge caveats",
        "StatsBomb is the safe open-data training path",
        "Opta via kloppy is a runtime compatibility path",
        "105m x 68m",
      ],
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
    expect(text).toContain("**opta** (36 chunks)");
    expect(text).toContain("aliases: statsperform, stats-perform, opta-f24, whoscored, who-scored");
    expect(text).toContain("**soccerdata** (40 chunks)");
    expect(text).toContain("aliases: soccer-data, sofascore, sofa-score, espn");
    expect(text).toContain("**databallpy** (63 chunks)");
    expect(text).toContain(
      "aliases: data-ball-py, databall-py, metrica, metrica-sports, metricasports, sportec, dfl, sportec-dfl, open-dfl, tracab",
    );
    expect(text).toContain("**kloppy** (100 chunks)");
    expect(text).toContain("aliases: secondspectrum, second-spectrum");
    expect(text).toContain("**sportradar** (29 chunks)");
    expect(text).toContain(
      "aliases: sport-radar, sportradar-api, soccer-extended, sportradar-soccer",
    );
    expect(text).toContain("**thesportsdb** (18 chunks)");
    expect(text).toContain("aliases: tsdb, the-sports-db, the-sportsdb, sportsdb");
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
      provider: "API-Football",
      max_results: 3,
    });
    const text = result.content[0].text;

    expect(result.isError).toBe(true);
    expect(text).toContain('Provider "API-Football (api-football)" is not indexed');
    expect(text).toContain("Call list_providers");
    expect(text).toContain("request_update");
  });

  it("routes narrow public match surface adapters to soccerdata docs", () => {
    const result = compareProviders(db, {
      topic: "public API match summary schedule team scores lineups",
      providers: ["Sofascore", "ESPN"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 1 provider(s)");
    expect(text).toContain("## soccerdata");
    expect(text).toContain("Sofascore (sd.Sofascore)");
    expect(text).toContain("ESPN (sd.ESPN)");
    expect(text).not.toContain("No matching docs found for requested provider(s): sofascore");
    expect(text).not.toContain("No matching docs found for requested provider(s): espn");
  });

  it("routes open tracking adapter names to library docs", () => {
    const result = compareProviders(db, {
      topic: "tracking coordinates pitch length width event data loaders",
      providers: ["Metrica Sports", "Sportec DFL", "Second Spectrum"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 2 provider(s)");
    expect(text).toContain("## databallpy");
    expect(text).toContain("pitch_dimensions");
    expect(text).toContain("tracking_data");
    expect(text).toContain("## kloppy");
    expect(text).toContain("Second Spectrum");
    expect(text).not.toContain("No matching docs found for requested provider(s): metrica-sports");
    expect(text).not.toContain("No matching docs found for requested provider(s): sportec-dfl");
    expect(text).not.toContain("No matching docs found for requested provider(s): second-spectrum");
  });

  it("compares Sportradar chart fields with Opta and Wyscout shot surfaces", () => {
    const result = compareProviders(db, {
      topic: "shot maps xG event coordinates goal mouth post shot xG",
      providers: ["Sportradar", "Opta", "Wyscout"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 3 provider(s)");
    expect(text).toContain("## sportradar");
    expect(text).toContain("goalface_x");
    expect(text).toContain("xg_value");
    expect(text).toContain("## opta");
    expect(text).toContain("0-100");
    expect(text).toContain("## wyscout");
    expect(text).toContain("postShotXg");
  });

  it("compares public live-score APIs for bot-style polling", () => {
    const result = compareProviders(db, {
      topic: "live scores fixtures event status livescore API final score polling",
      providers: ["TheSportsDB", "SportMonks", "Sportradar"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 3 provider(s)");
    expect(text).toContain("## thesportsdb");
    expect(text).toContain("idEvent");
    expect(text).toContain("De-duplicate final-score actions");
    expect(text).toContain("## sportmonks");
    expect(text).toContain("CURRENT");
    expect(text).toContain("## sportradar");
    expect(text).toContain("Live Schedules");
  });

  it("routes WhoScored project adapter questions to Opta-family docs", () => {
    const result = compareProviders(db, {
      topic: "WhoScored Opta shot event qualifiers body part xG fallback",
      providers: ["WhoScored", "Opta"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 1 provider(s)");
    expect(text).toContain("## opta");
    expect(text).toContain("Shot Qualifiers");
    expect(text).not.toContain("No matching docs found for requested provider(s): whoscored");
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
      providers: ["API-Football"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain('No matching docs found for "shot maps and xG"');
    expect(text).toContain("Requested provider(s) not indexed: api-football");
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
