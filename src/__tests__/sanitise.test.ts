import { describe, expect, it } from "vitest";
import { sanitiseFtsQuery } from "../index.js";

describe("sanitiseFtsQuery", () => {
  it("wraps plain text in double quotes", () => {
    expect(sanitiseFtsQuery("shot events")).toBe('"shot events"');
  });

  it("escapes embedded double quotes", () => {
    expect(sanitiseFtsQuery('the "best" xG')).toBe('"the ""best"" xG"');
  });

  it("neutralises FTS5 AND/OR/NOT operators", () => {
    const result = sanitiseFtsQuery("pass AND shot");
    // Inside double quotes, AND is treated as literal text, not an operator
    expect(result).toBe('"pass AND shot"');
  });

  it("neutralises FTS5 NEAR operator", () => {
    expect(sanitiseFtsQuery("NEAR(pass shot)")).toBe('"NEAR(pass shot)"');
  });

  it("neutralises FTS5 wildcard and prefix operators", () => {
    expect(sanitiseFtsQuery("pass*")).toBe('"pass*"');
    expect(sanitiseFtsQuery("^shot")).toBe('"^shot"');
  });

  it("neutralises FTS5 column filter syntax", () => {
    expect(sanitiseFtsQuery("provider:opta")).toBe('"provider:opta"');
  });

  it("handles empty string", () => {
    expect(sanitiseFtsQuery("")).toBe('""');
  });

  it("handles string that is just double quotes", () => {
    expect(sanitiseFtsQuery('"')).toBe('""""');
  });
});
