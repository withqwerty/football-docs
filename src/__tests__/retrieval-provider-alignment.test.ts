import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { searchDocs } from "../tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = resolve(__dirname, "..", "..", "data", "docs.db");

describe("provider-alignment retrieval", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(DB_PATH, { readonly: true });
  });

  afterAll(() => {
    db.close();
  });

  it("finds Impect event-to-SkillCorner frame mapping guidance", () => {
    const result = searchDocs(db, {
      query:
        "join Impect events to SkillCorner tracking frames isMatched event index frame mappings update feed idMappings",
      provider: "impect",
      max_results: 8,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    expect(text).toContain("SkillCorner integration");
    expect(text).toContain("`GET /v5/customerapi/matches/{matchId}/skillcorner-frame-mappings`");
    expect(text).toContain("`isMatched`");
    expect(text).toContain("`GET /update/skillcorner-frame-mappings`");
    expect(text).toContain("ID Mappings");
    expect(text).toContain("not part of `idMappings`");
  });

  it("finds DataBallPy tracking-event synchronisation guidance", () => {
    const result = searchDocs(db, {
      query:
        "DataBallPy synchronise tracking event data Needleman Wunsch sync_certainty tracking_frame get_event_frame",
      provider: "databallpy",
      max_results: 8,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    expect(text).toContain("Synchronization");
    expect(text).toContain("Needleman-Wunsch algorithm");
    expect(text).toContain("`sync_certainty`");
    expect(text).toContain("`tracking_frame`");
    expect(text).toContain("game.synchronise_tracking_and_event_data");
    expect(text).toContain("game.get_event_frame");
  });

  it("finds SkillCorner physical and Game Intelligence quality gates", () => {
    const result = searchDocs(db, {
      query:
        "SkillCorner physical_check_passed dynamic_events_check Game Intelligence off_ball_runs bad data quality ignore_dynamic_events_check",
      provider: "skillcorner",
      max_results: 8,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    expect(text).toContain("Data quality gates");
    expect(text).toContain("`physical_check_passed`");
    expect(text).toContain("`dynamic_events_check`");
    expect(text).toContain("`ignore_dynamic_events_check`");
    expect(text).toContain("`403 Bad data quality`");
    expect(text).toContain("`GET /metrics/game_intelligence/in_possession/off_ball_runs/`");
    expect(text).toContain("`GET /match/{match_id}/dynamic_events/off_ball_runs/`");
  });
});
