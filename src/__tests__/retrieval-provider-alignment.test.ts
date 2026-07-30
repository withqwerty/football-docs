import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FORBIDDEN_PATTERNS } from "../impect-truth.js";
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

  it("finds Impect cross-provider idMappings guidance", () => {
    const result = searchDocs(db, {
      query:
        "Impect idMappings cross provider IDs skill_corner heim_spiel players squads matches iterations arrays of strings",
      provider: "impect",
      max_results: 8,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    expect(text).toContain("Cross-provider IDs");
    expect(text).toContain("skill_corner");
    expect(text).toContain("heim_spiel");
    // idMappings is an array of single-key objects whose values are string arrays -
    // both shapes are easy to mis-parse, so the docs must keep saying so.
    expect(text).toContain("array of single-key objects");
    expect(text).toContain("arrays of strings");
  });

  it("does not surface Impect commercial API material", () => {
    const result = searchDocs(db, {
      query: "Impect commercial endpoints authentication bearer token update feed delete feed",
      provider: "impect",
      max_results: 20,
    });

    const text = result.content.map((entry) => entry.text).join("\n");

    expect(result.isError).toBeUndefined();
    // The Impect corpus is rebuilt from the public open-data repository only.
    for (const { label, pattern } of FORBIDDEN_PATTERNS) {
      expect(text, `Impect results should not contain ${label}`).not.toMatch(pattern);
    }
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
