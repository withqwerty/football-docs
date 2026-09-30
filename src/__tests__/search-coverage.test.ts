import Database from "better-sqlite3";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SCHEMA_SQL } from "../ingest.js";
import { searchDocs } from "../tools.js";

describe("search_docs coverage labels", () => {
  let db: Database.Database;

  beforeAll(() => {
    db = new Database(":memory:");
    db.exec(SCHEMA_SQL);
    const insert = db.prepare("INSERT INTO docs (provider, category, title, content) VALUES (?, ?, ?, ?)");
    insert.run("opta", "qualifiers", "Shot Qualifiers", "Qualifier 214 is big chance on Opta shot events.");
    insert.run("opta", "qualifiers", "Pass Qualifiers", "Qualifier 212 is the pass length in metres.");
    insert.run("skillcorner", "physical-data", "Physical data", "SkillCorner tracking gives player speed.");
  });

  afterAll(() => {
    db.close();
  });

  it("does not label results that match every topic term", () => {
    const text = searchDocs(db, { query: "What is Opta qualifier 214?" }).content[0].text;

    expect(text).not.toContain("No indexed doc matches every term");
    expect(text).toMatch(/## \[1\] Shot Qualifiers\n[^\n]*curated by football-docs contributors\n/);
  });

  it("says when no doc matches every term and names the terms nothing mentions", () => {
    const text = searchDocs(db, { query: "Catapult GPS player speed" }).content[0].text;

    expect(text).toContain("No indexed doc matches every term, so these are partial matches");
    expect(text).toContain('No indexed doc mentions "catapult", "gps". If the question is about those, it is not indexed.');
    expect(text).toContain("## [1] Physical data");
    expect(text).toContain("**Match:** partial");
  });

  it("names the terms nothing mentions when there are no results", () => {
    const text = searchDocs(db, { query: "catapult vector" }).content[0].text;

    expect(text).toContain('No results found for "catapult vector".');
    expect(text).toContain('No indexed doc mentions "catapult", "vector".');
  });

  it("puts full matches first and says where the partial matches start", () => {
    const text = searchDocs(db, { query: "Opta qualifier 214" }).content[0].text;

    expect(text).toContain("Results 1-1 match every term. Results 2-2 match only some terms.");
    expect(text).toMatch(/## \[1\] Shot Qualifiers\n[^\n]*curated by football-docs contributors\n/);
    expect(text).toMatch(/## \[2\] Pass Qualifiers\n[^\n]*\*\*Match:\*\* partial\n/);
  });
});
