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
});
