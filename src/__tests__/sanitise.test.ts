import { describe, expect, it } from "vitest";
import { sanitiseFtsQuery } from "../index.js";
import { versionLabel } from "../tools.js";

describe("sanitiseFtsQuery", () => {
  it("turns natural-language text into a precise token query", () => {
    expect(sanitiseFtsQuery("shot events")).toBe('"shot" AND "events"');
  });

  it("extracts useful tokens from quoted text", () => {
    expect(sanitiseFtsQuery('the "best" xG')).toBe('"the" AND "best" AND "xg"');
  });

  it("neutralises FTS5 AND/OR/NOT operators", () => {
    const result = sanitiseFtsQuery("pass AND shot");
    expect(result).toBe('"pass" AND "shot"');
  });

  it("neutralises FTS5 NEAR operator", () => {
    expect(sanitiseFtsQuery("NEAR(pass shot)")).toBe('"pass" AND "shot"');
  });

  it("neutralises FTS5 wildcard and prefix operators while keeping the token", () => {
    expect(sanitiseFtsQuery("pass*")).toBe('"pass"');
    expect(sanitiseFtsQuery("^shot")).toBe('"shot"');
  });

  it("turns column filter syntax into normal tokens", () => {
    expect(sanitiseFtsQuery("provider:opta")).toBe('"provider" AND "opta"');
  });

  it("handles empty string", () => {
    expect(sanitiseFtsQuery("")).toBe('""');
  });

  it("handles string that is just double quotes", () => {
    expect(sanitiseFtsQuery('"')).toBe('""');
  });
});

describe("versionLabel", () => {
  it("prefixes a bare version number", () => {
    expect(versionLabel("0.3.0")).toBe("v0.3.0");
    expect(versionLabel("1 / 2")).toBe("v1 / 2");
  });

  it("leaves a version that already carries its own prefix", () => {
    expect(versionLabel("v3")).toBe("v3");
    expect(versionLabel("Soccer v4 / Soccer Extended v4")).toBe("Soccer v4 / Soccer Extended v4");
  });

  it("renders nothing for an absent version", () => {
    expect(versionLabel(null)).toBe("");
    expect(versionLabel("   ")).toBe("");
  });
});
