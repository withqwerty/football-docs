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
      id: "transferroom-availability-story",
      args: {
        query:
          "build player availability injury burden story injury timeline missing players injuries player matchdays squad value availability heatmap forest plot TransferRoom FMDB Pro Sportradar SportMonks Transfermarkt",
        max_results: 10,
      },
      expectedProvider: "transferroom",
      expected: [
        "Build an availability story",
        "**Category:** charting-availability",
        "`GET /injuries/competitions`",
        "`GET /injuries/players`",
        "`matches_missed_burden`",
        "`xAvailability`",
        "historical absence",
        "Do not infer causality from injury endpoints alone",
        "coefficient / forest plot",
      ],
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
      id: "opta-passmap-receiver-surfaces",
      args: {
        query:
          "Opta pass map receiver playerPass passmatrix passEndX 140 141 formationPlace matchstats inferred receiver xT game-state",
        provider: "WhoScored",
        max_results: 5,
      },
      expectedProvider: "opta",
      expected: [
        "Pass-map data surfaces",
        "`passmatrix/{token}?fx={matchId}`",
        "`playerPass[]`",
        "not the receiving player",
        "infer the receiver",
        "`formationPlace`",
      ],
    },
    {
      id: "opta-shot-placement-goal-mouth",
      args: {
        query:
          "build a goalmouth shot chart with GoalMouthY GoalMouthZ xGOT PSxG marker size outcome colours saved goal post crossbar post distance Opta qualifiers 102 103 321 322",
        provider: "WhoScored",
        max_results: 8,
      },
      expectedProvider: "opta",
      expected: [
        "Build a goalmouth shot chart",
        "**Category:** charting-shot-placement",
        "`matchexpectedgoals/{token}?fx={matchId}`",
        "`GoalMouthY`",
        "`GoalMouthZ`",
        "not pitch coordinates",
        "missing xGOT",
        "outcome",
        "post distance",
      ],
    },
    {
      id: "opta-corner-delivery-sequence-analysis",
      args: {
        query:
          "build corner delivery set piece analysis second phase shots FromCorner qualifier 25 CornerTaken 6 PassEndX 140 PassEndY 141 Head 15 right foot left foot DirectCorner 263 delivery zone near post far post short corner link delivery to shot relatedEventId time window",
        provider: "WhoScored",
        max_results: 10,
      },
      expectedProvider: "opta",
      expected: [
        "Build a corner-delivery analysis",
        "**Category:** charting-set-pieces",
        "typeId `1` + Q6",
        "qualifier `25` (`fromCorner`)",
        "Direct corner / Olimpico",
        "Delivery zones and mirroring",
        "Link deliveries to shots",
        "goals per corner",
        "delivery or goals per corner-sourced shot",
      ],
    },
    {
      id: "opta-game-state-scoreline-reconstruction",
      args: {
        query:
          "game state running scoreline goal events disallowed goal qualifier 8 own goal qualifier 28 expandedMinute winning losing level0 pass maps minute filter",
        provider: "WhoScored",
        max_results: 5,
      },
      expectedProvider: "opta",
      expected: [
        "Reconstructing running scoreline",
        "qualifier `8`",
        "qualifier `28`",
        "`expandedMinute`",
        "`level0`",
        "Do not infer in-play score state from final score",
      ],
    },
    {
      id: "opta-lineups-team-sheet",
      args: {
        query:
          "Opta match lineups team sheet starters bench captain formation q130 q131 q194 shirt number q59 formation slot q145 substitutions ratings",
        provider: "WhoScored",
        max_results: 5,
      },
      expectedProvider: "opta",
      expected: [
        "Team setup qualifiers",
        "typeId `34`",
        "`59` | shirt numbers",
        "`130` | team formation",
        "`131` | team-player formation",
        "`145` | formation slot",
        "`194` | captain",
        "Treat ratings as optional enrichment",
      ],
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
      id: "statsbomb-lineups-team-sheet",
      args: {
        query:
          "StatsBomb Open Data team sheet lineups events Starting XI tactics formation Substitution Tactical Shift starters bench shirt numbers cards position intervals from to start_reason end_reason ratings",
        provider: "StatsBomb Open Data",
        max_results: 5,
      },
      expectedProvider: "statsbomb",
      expected: [
        "Lineup data surfaces",
        "`lineups/{match_id}.json`",
        "event type `35` (`Starting XI`)",
        "event type `19` (`Substitution`)",
        "event type `36` (`Tactical Shift`)",
        "Ratings are not part of the open-data lineups/events seam",
      ],
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
      id: "clubelo-provider-alias",
      args: {
        query: "ClubElo historical Elo ratings API CSV run-in fixture difficulty",
        provider: "ClubElo",
        max_results: 5,
      },
      expectedProvider: "free-sources",
      expected: ["ClubElo (free-sources)", "api.clubelo.com", "fixture-difficulty", "strength prior"],
    },
    {
      id: "football-data-co-uk-provider-alias",
      args: {
        query: "football-data.co.uk Premier League CSV full time scores FTHG FTAG scorigami",
        provider: "football-data.co.uk",
        max_results: 5,
      },
      expectedProvider: "free-sources",
      expected: [
        "football-data.co.uk (free-sources)",
        "https://www.football-data.co.uk/mmz4281",
        "FTHG",
        "FTAG",
        "scorigami baselines",
      ],
    },
    {
      id: "engsoccerdata-provider-alias",
      args: {
        query: "engsoccerdata historical English football results scorigami baseline csv",
        provider: "engsoccerdata",
        max_results: 5,
      },
      expectedProvider: "free-sources",
      expected: ["engsoccerdata (free-sources)", "James P. Curley", "`england`", "`hgoal`", "`vgoal`"],
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
      expected: [
        "WhoScored (opta)",
        "**Provider:** opta",
        "Provider-first xG service recipe",
        "Body part and play-kind filters",
      ],
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
      id: "sofascore-status-lifecycle",
      args: {
        query: "Sofascore status code 31 halftime inprogress code 93 removed finished postponed code 60",
        provider: "Sofascore",
        max_results: 5,
      },
      expectedProvider: "soccerdata",
      expected: [
        "Sofascore (soccerdata)",
        "status.type",
        "code `93` / description `Removed`",
        "code `31`, `41`, or `50`",
        "code `60`",
        "statusCode",
        "statusType",
      ],
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
      id: "second-spectrum-tracking-rendering",
      args: {
        query:
          "tracking data centre origin centimetres pitch_length pitch_width project to 0-100 fps live dead ball speed distance windows Second Spectrum Tracab",
        provider: "Second Spectrum",
        max_results: 5,
      },
      expectedProvider: "kloppy",
      expected: [
        "Rendering centre-origin tracking data",
        "`secondspectrum`",
        "`tracab`",
        "x100 = 50 +",
        "`x_m = x_cm / 100`",
        "Tracking-derived pressing timeline recipe",
        "ball_coordinates",
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
      id: "mplsoccer-profile-chart-data-prep",
      args: {
        query:
          "build player radar pizza chart scouting profile percentiles per 90 metrics cohort minutes threshold benchmark distribution Wyscout StatsBomb SkillCorner FMDB Pro mplsoccer PyPizza Radar lower is better",
        max_results: 10,
      },
      expectedProvider: "mplsoccer",
      expected: [
        "Player Profile Radar and Pizza Data Prep",
        "**Category:** visualizations",
        "`Radar` and `PyPizza` are chart renderers, not metric engines",
        "`percentile`",
        "named cohort",
        "minimum minutes",
        "`lower_is_better`",
        "Choose one normalisation",
        "source of each metric family",
      ],
    },
    {
      id: "mplsoccer-interactive-chart-filtering",
      args: {
        query:
          "interactive football chart filters legend filter option counts dimensions selection state filter before aggregation shot map pass map heatmap outcome body part team player",
        provider: "mplsoccer",
        max_results: 8,
      },
      expected: [
        "Interactive chart filtering",
        "**Category:** visualizations",
        "apply filters before computing the visual",
        "stable semantic keys",
        "Within one dimension",
        "Across dimensions",
        "Option counts",
        "legend item",
        "unfiltered item count",
        "empty-state reason",
      ],
    },
    {
      id: "mplsoccer-pass-flow-data-contract",
      args: {
        query:
          "pass flow chart pass origin bins circular mean resultant length relative frequency arrows missing end coordinates football",
        provider: "mplsoccer",
        max_results: 8,
      },
      expected: [
        "Flow Maps",
        "**Category:** visualizations",
        "pass-origin",
        "`direction_count`",
        "`relative_frequency`",
        "circular statistics",
        "mean resultant length",
        "at least two valid vectors",
        "missing end coordinates",
      ],
    },
    {
      id: "mplsoccer-chart-reference-layers",
      args: {
        query:
          "football chart reference layers target line benchmark peer band league average percentile band threshold annotations keep metric separate from visual overlay",
        provider: "mplsoccer",
        max_results: 8,
      },
      expected: [
        "Chart Reference Layers",
        "**Category:** visualizations",
        "`layer_kind`",
        "same unit",
        "required-pace lines",
        "rolling-form envelopes",
        "Keep generated layers separate from data series",
        "model version or grid version",
        "Clip layers to the plot area",
      ],
    },
    {
      id: "sportmonks-season-story-fixtures",
      args: {
        query:
          "SportMonks season story fixtures completed fixtureStates 5 include events.player lineups.details scores round participants standings rounds participant details lineup type_id 11 12 rating 118 minutes 119 substitution player_id related_player_id",
        provider: "sportmonks",
        max_results: 5,
      },
      expectedProvider: "sportmonks",
      expected: [
        "Season-story data surfaces",
        "`fixtureSeasons:{seasonId};fixtureStates:5,7,8`",
        "`GET /fixtures?filters=fixtureSeasons:{seasonId};fixtureStates:5,7,8&include=events.player;lineups.details;scores;round;participants`",
        "`118` | `RATING`",
        "`119` | `MINUTES_PLAYED`",
        "`player_id` is the player coming on",
        "`related_player_id` is the player coming off",
      ],
    },
    {
      id: "sportmonks-table-possibilities",
      args: {
        query:
          "gameweek table possibilities pending fixtures simulate all win draw loss combinations reachable positions goal difference dependent tiebreaker points goal difference goals scored SportMonks standings fixture grid run-in",
        provider: "sportmonks",
        max_results: 8,
      },
      expectedProvider: "sportmonks",
      expected: [
        "Gameweek table-possibilities recipe",
        "**Category:** charting-season-stories",
        "`pending_fixture_ids`",
        "`possible_positions`",
        "`goal_difference_dependent`",
        "`scenario_count = 3 ** pending_fixture_count`",
        "De-duplicate by fixture ID",
        "points, goal difference, goals scored",
        "If no fixtures remain",
      ],
    },
    {
      id: "wyscout-analysis-story-metrics",
      args: {
        query:
          "Wyscout entertainment index PPDA possession adjusted PAdj progressive passes progressive runs deep completions deep_completition xA shot assists key passes counterpressing recoveries pressing lower 60 defensive actions",
        provider: "Wyscout",
        max_results: 5,
      },
      expectedProvider: "wyscout",
      expected: [
        "Story metric fields and tags",
        "`PPDA`",
        "`PAdj` / `Opp30`",
        "`progressive_pass`",
        "`progressive_run`",
        "`deep_completition`",
        "`shot_assist`",
        "`counterpressing_recovery`",
      ],
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
      id: "kloppy-event-derived-metric-recipes",
      args: {
        query:
          "event-derived metrics xT progressive passes field tilt PPDA end_x end_y 140 141 final third zero denominator null",
        provider: "kloppy",
        max_results: 8,
      },
      expected: [
        "Territory chart and field-tilt recipe",
        "**Category:** event-derived-metrics",
        "`x >= 66.7`",
        "3x3 or 5x3 pitch zones",
        "Fixed-zone territory is not a smoothed heatmap",
        "qualifiers `140` and `141`",
        "`derived_xT` or `xT_model` with grid version",
        "end_x - start_x >= 10",
        "serialise it as `null`",
      ],
    },
    {
      id: "kloppy-tracking-off-ball-runs",
      args: {
        query:
          "tracking off-ball run detection speed threshold ball proximity trailing receive towards goal attacking direction goalkeeper anchor fps live frames football analytics",
        provider: "kloppy",
        max_results: 8,
      },
      expected: [
        "Tracking-derived off-ball runs recipe",
        "**Category:** tracking-rendering",
        "`duration_s`",
        "`peak_speed_mps`",
        "`towards_goal`",
        "live/dead flag",
        "short trailing",
        "`home_team_side` plus period",
        "provider official physical metrics",
      ],
    },
    {
      id: "kloppy-tracking-pitch-control-overlay",
      args: {
        query:
          "tracking pitch control nearest player dominance grid home away control field not probabilistic missing players one team neutral overlay live frame football analytics",
        provider: "kloppy",
        max_results: 8,
      },
      expected: [
        "Tracking-derived pitch-control overlay recipe",
        "**Category:** tracking-rendering",
        "player dominance grid",
        "not a probabilistic pitch-control model",
        "`grid_cols` / `grid_rows`",
        "`control`",
        "common metric pitch coordinate",
        "`pitch_length`",
        "`pitch_width`",
        "both teams",
        "neutral or unavailable field",
        "distance-to-space view",
      ],
    },
    {
      id: "kloppy-tracking-physical-output",
      args: {
        query:
          "derive physical output from raw tracking speed bands sprint count live ball glitch speed missing provider speed distance fallback high speed running top speed",
        provider: "kloppy",
        max_results: 8,
      },
      expected: [
        "Tracking-derived physical output recipe",
        "**Category:** tracking-rendering",
        "`total_distance_m`",
        "`sprint_count`",
        "`top_speed_mps`",
        "provider speed",
        "derive speed from adjacent coordinates",
        "glitch guard",
        "contiguous live-frame runs",
        "not the same contract as official provider physical metrics",
      ],
    },
    {
      id: "ppda-pressing",
      args: {
        query: "PPDA pressing passes allowed defensive actions opponent build-up zone",
        max_results: 5,
      },
      expectedProvider: "kloppy",
      expected: ["PPDA", "passes allowed per defensive action", "defensive action"],
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
    {
      id: "free-source-contextual-story-joins",
      args: {
        query:
          "weather travel distance home advantage story fixtures results ClubElo Open-Meteo venue pitch dimensions Elo adjusted xG public data",
        max_results: 8,
      },
      expectedProvider: "free-sources",
      expected: [
        "Contextual Story Joins",
        "`away_travel_km >= 300`",
        "ClubElo(home_team, fixture_date)",
        "observed match weather",
        "never overwrite official scores",
      ],
    },
    {
      id: "free-source-xg-timeline-recipes",
      args: {
        query:
          "cumulative xG timeline shot flow score strip halftime guide full time guide goal markers sparse shots Understat Opta StatsBomb shot xG source model provider labels",
        max_results: 10,
      },
      expectedProvider: "free-sources",
      expected: [
        "xG Timeline Recipes",
        "**Category:** xg-timelines",
        "`score_events[]`",
        "`time_guides[]`",
        "Do not mix xG models silently",
        "Render the lines as steps",
        "do not increment score",
      ],
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

    expect(text).toContain("**statsbomb** (237 chunks)");
    expect(text).toContain("charting-lineups (6)");
    expect(text).toContain("aliases: stats-bomb, statsbomb-open-data, statsbomb-open");
    expect(text).toContain("**wyscout** (163 chunks)");
    expect(text).toContain("charting-analysis-metrics (6)");
    expect(text).toContain("aliases: hudl, hudl-wyscout");
    expect(text).toContain("**sportmonks** (85 chunks)");
    expect(text).toContain("charting-season-stories (7)");
    expect(text).toContain("**fmdb-pro** (36 chunks)");
    expect(text).toContain("aliases: fmdb");
    expect(text).toContain("**transferroom** (43 chunks)");
    expect(text).toContain("charting-availability (5)");
    expect(text).toContain("aliases: transfer-room");
    expect(text).toContain("**free-sources** (62 chunks)");
    expect(text).toContain("contextual-story-joins (8)");
    expect(text).toContain("xg-timelines (8)");
    expect(text).toContain(
      "aliases: fbref, football-reference, understat, clubelo, club-elo, football-data, football-data-uk, football-data-co-uk, engsoccerdata",
    );
    expect(text).toContain("**opta** (71 chunks)");
    expect(text).toContain("charting-game-state (9)");
    expect(text).toContain("charting-lineups (6)");
    expect(text).toContain("charting-passmaps (5)");
    expect(text).toContain("charting-set-pieces (6)");
    expect(text).toContain("charting-shot-placement (9)");
    expect(text).toContain("aliases: statsperform, stats-perform, opta-f24, whoscored, who-scored");
    expect(text).toContain("**soccerdata** (41 chunks)");
    expect(text).toContain("aliases: soccer-data, sofascore, sofa-score, espn");
    expect(text).toContain("**databallpy** (63 chunks)");
    expect(text).toContain(
      "aliases: data-ball-py, databall-py, metrica, metrica-sports, metricasports, sportec, dfl, sportec-dfl, open-dfl, tracab",
    );
    expect(text).toContain("**mplsoccer** (64 chunks)");
    expect(text).toContain("visualizations (48)");
    expect(text).toContain("**kloppy** (120 chunks)");
    expect(text).toContain("event-derived-metrics (10)");
    expect(text).toContain("tracking-rendering (10)");
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
    expect(text).toContain("Sofascore match summary/status payload");
    expect(text).toContain("ESPN (sd.ESPN)");
    expect(text).not.toContain("No matching docs found for requested provider(s): sofascore");
    expect(text).not.toContain("No matching docs found for requested provider(s): espn");
  });

  it("finds Sofascore lifecycle details in project-style status comparisons", () => {
    const result = compareProviders(db, {
      topic: "match summary status live halftime postponed finished scores",
      providers: ["Sofascore", "FBref", "Understat"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 2 provider(s)");
    expect(text).toContain("## soccerdata");
    expect(text).toContain("Sofascore match summary/status payload");
    expect(text).toContain("Do not treat halftime as");
    expect(text).toContain("## free-sources");
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
    expect(text).toContain("Rendering centre-origin tracking data");
    expect(text).not.toContain("No matching docs found for requested provider(s): metrica-sports");
    expect(text).not.toContain("No matching docs found for requested provider(s): sportec-dfl");
    expect(text).not.toContain("No matching docs found for requested provider(s): second-spectrum");
  });

  it("compares tracking rendering semantics across tracking providers", () => {
    const result = compareProviders(db, {
      topic:
        "tracking render pitch coordinates centre origin centimetres fps live ball speed distance pitch_length pitch_width",
      providers: ["Second Spectrum", "TRACAB", "SkillCorner"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 3 provider(s)");
    expect(text).toContain("## kloppy");
    expect(text).toContain("Rendering centre-origin tracking data");
    expect(text).toContain("Tracking-derived physical output recipe");
    expect(text).toContain("live/dead flag");
    expect(text).toContain("## databallpy");
    expect(text).toContain("Origin at center of pitch");
    expect(text).toContain("## skillcorner");
    expect(text).toContain("pitch_length");
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

  it("compares shot placement fields across charting providers", () => {
    const result = compareProviders(db, {
      topic: "shot placement goal mouth coordinates xG xGOT body part blocked shot charts",
      providers: ["WhoScored", "StatsBomb", "Sportradar"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 3 provider(s)");
    expect(text).toContain("## opta");
    expect(text).toContain("Shot placement data surfaces");
    expect(text).toContain("Do not assume qualifier `213`");
    expect(text).toContain("## statsbomb");
    expect(text).toContain("Post-Shot xG");
    expect(text).toContain("## sportradar");
    expect(text).toContain("goalface_x");
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

  it("compares event-timeline game state with live-score providers", () => {
    const result = compareProviders(db, {
      topic: "game state running scoreline live scores final status disallowed own goals",
      providers: ["WhoScored", "TheSportsDB", "SportMonks"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 3 provider(s)");
    expect(text).toContain("## opta");
    expect(text).toContain("Reconstructing running scoreline");
    expect(text).toContain("Do not infer in-play score state from final score");
    expect(text).toContain("## thesportsdb");
    expect(text).toContain("Soccer Status Codes");
    expect(text).toContain("## sportmonks");
    expect(text).toContain("State IDs");
    expect(text).toContain("`INPLAY_2ND_HALF`");
    expect(text).toContain("To Be Announced");
    expect(text).toContain("Walk Over");
    expect(text).toContain("Fetch `GET /v3/football/states`");
  });

  it("compares historical baselines with live-score overlays for scoreline projects", () => {
    const result = compareProviders(db, {
      topic: "historical final scores live overlay Elo fixtures scorigami baseline",
      providers: ["ClubElo", "football-data.co.uk", "TheSportsDB"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 2 provider(s)");
    expect(text).toContain("## free-sources");
    expect(text).toContain("football-data.co.uk");
    expect(text).toContain("engsoccerdata");
    expect(text).toContain("## thesportsdb");
    expect(text).toContain("idEvent");
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
    expect(text).toContain("Shot placement data surfaces");
    expect(text).toContain("Body part and play-kind filters");
    expect(text).not.toContain("No matching docs found for requested provider(s): whoscored");
  });

  it("compares pass-map data extraction with rendering libraries", () => {
    const result = compareProviders(db, {
      topic: "pass maps passmatrix playerPass receiver inferred xT formationPlace lineup",
      providers: ["WhoScored", "mplsoccer"],
    });
    const text = result.content[0].text;

    expect(result.isError).toBeUndefined();
    expect(text).toContain("across 2 provider(s)");
    expect(text).toContain("## opta");
    expect(text).toContain("Pass-map data surfaces");
    expect(text).toContain("not the receiving player");
    expect(text).toContain("## mplsoccer");
    expect(text).toContain("Arrows (Pass Maps)");
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
