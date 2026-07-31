import { describe, expect, it } from "vitest";
import {
  countDocumentedEndpoints,
  extractDispatchValues,
  extractDocumentedEndpoints,
  extractEnumTokens,
  extractImportedSymbols,
  listOpenApiProviders,
  listPostmanProviders,
  listTruthProviders,
  loadOpenApiTruth,
  loadPostmanTruth,
  loadProviderDocs,
  loadProviderTruth,
  normalisePath,
  validateOpenApiDocs,
  validatePostmanDocs,
  validateProviderDocs,
} from "../provider-truth.js";

const providers = listTruthProviders();
const openApiProviders = listOpenApiProviders();

describe("provider docs are grounded in the real package", () => {
  it("has truth files to validate against", () => {
    expect(providers.length).toBeGreaterThan(0);
  });

  it.each(providers)("%s docs cite only real symbols and enum members", (provider) => {
    const truth = loadProviderTruth(provider);
    const violations = validateProviderDocs(loadProviderDocs(provider), truth);
    expect(violations).toEqual([]);
  });

  it.each(providers)("%s truth file records the version it was built from", (provider) => {
    const truth = loadProviderTruth(provider);
    expect(truth.source.package).toBeTruthy();
    expect(truth.source.version).not.toBe("unknown");
    expect(Object.keys(truth.modules).length).toBeGreaterThan(0);
    expect(truth.symbols.length).toBeGreaterThan(0);
  });
});

describe("extractors", () => {
  it("pulls names out of from-imports, ignoring aliases and star imports", () => {
    const text = [
      "```python",
      "from kloppy import load",
      "from kloppy.domain import Orientation, EventType as ET",
      "from kloppy.helpers import *",
      "from pandas import DataFrame",
      "```",
    ].join("\n");
    expect(extractImportedSymbols(text, "kloppy").sort()).toEqual([
      "EventType",
      "Orientation",
      "load",
    ]);
  });

  it("only treats code-span uppercase tokens as enum claims", () => {
    expect(extractEnumTokens("`LOW_PASS` and PLAIN_PROSE and `xg`")).toEqual(["LOW_PASS"]);
  });

  it("flags an invented import", () => {
    const truth = loadProviderTruth("kloppy");
    const violations = validateProviderDocs(
      [{ file: "fake.md", text: "from kloppy.domain import NotARealSymbolAtAll" }],
      truth,
    );
    expect(violations.some((v) => v.includes("NotARealSymbolAtAll"))).toBe(true);
  });

  it("flags an invented enum member", () => {
    const truth = loadProviderTruth("kloppy");
    const violations = validateProviderDocs(
      [{ file: "fake.md", text: "Use `TOTALLY_INVENTED_MEMBER` here." }],
      truth,
    );
    expect(violations.some((v) => v.includes("TOTALLY_INVENTED_MEMBER"))).toBe(true);
  });

  it("accepts a real enum member", () => {
    const truth = loadProviderTruth("kloppy");
    const violations = validateProviderDocs(
      [{ file: "fake.md", text: "Use `STATIC_HOME_AWAY` here." }],
      truth,
    );
    expect(violations).toEqual([]);
  });
});

describe("provider docs are grounded in the vendor's OpenAPI spec", () => {
  it("has OpenAPI truth files to validate against", () => {
    expect(openApiProviders.length).toBeGreaterThan(0);
  });

  it.each(openApiProviders)("%s docs cite only endpoints the spec defines", (provider) => {
    const truth = loadOpenApiTruth(provider);
    const violations = validateOpenApiDocs(loadProviderDocs(provider), truth);
    expect(violations).toEqual([]);
  });

  it.each(openApiProviders)("%s truth records which specs it came from", (provider) => {
    const truth = loadOpenApiTruth(provider);
    expect(truth.source.specs.length).toBeGreaterThan(0);
    expect(Object.keys(truth.paths).length).toBeGreaterThan(0);
  });

  /**
   * Providers whose docs cite endpoints as paths, so the endpoint check has
   * something to check. A clean result for one of these is meaningful; if the
   * count ever drops to zero the docs changed style and the check went blind.
   *
   * Sportradar mostly names feeds the way its own documentation does ("Daily
   * Schedules") rather than citing paths, so its coverage here is thin by nature -
   * the spec earns its place through field and enum accuracy more than endpoints.
   */
  const PATH_CITING = ["wyscout", "skillcorner", "fmdb-pro", "sportradar"];

  it.each(PATH_CITING)("%s docs actually cite endpoints, so the check is not vacuous", (provider) => {
    expect(countDocumentedEndpoints(loadProviderDocs(provider))).toBeGreaterThan(0);
  });

  it("flags an endpoint the spec does not define", () => {
    const truth = loadOpenApiTruth("wyscout");
    const violations = validateOpenApiDocs(
      [{ file: "fake.md", text: "Call `GET /matches/{wyId}/not-a-real-endpoint`." }],
      truth,
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("not-a-real-endpoint");
  });

  it("flags a method the spec does not allow on a real path", () => {
    const truth = loadOpenApiTruth("wyscout");
    const violations = validateOpenApiDocs(
      [{ file: "fake.md", text: "Call `DELETE /competitions`." }],
      truth,
    );
    expect(violations.some((v) => v.includes("not DELETE"))).toBe(true);
  });

  it("still rejects a fake path once placeholders match concrete values", () => {
    // Segment-wise matching lets a doc's worked example (/en/...) satisfy a spec
    // variable (/{locale}/...). It must not become a wildcard for everything.
    const truth = loadOpenApiTruth("sportradar");
    expect(
      validateOpenApiDocs(
        [{ file: "fake.md", text: "`GET /soccer/trial/v4/en/not_a_thing/{id}/summary.json`" }],
        truth,
      ),
    ).toHaveLength(1);
    expect(
      validateOpenApiDocs(
        [{ file: "ok.md", text: "`GET /soccer/trial/v4/en/sport_events/{id}/timeline.json`" }],
        truth,
      ),
    ).toEqual([]);
  });

  it("requires the same number of path segments", () => {
    const truth = loadOpenApiTruth("sportradar");
    expect(
      validateOpenApiDocs(
        [{ file: "fake.md", text: "`GET /soccer/trial/v4/en/sport_events/timeline.json`" }],
        truth,
      ),
    ).toHaveLength(1);
  });

  it("reads endpoints from fenced http blocks as well as code spans", () => {
    const text = ["```http", "GET /api/players?pageSize=20 HTTP/1.1", "Host: api.fmdb.pro", "```"].join("\n");
    expect(extractDocumentedEndpoints(text)).toEqual([{ method: "GET", path: "/api/players?pageSize=20" }]);
  });

  it("accepts a real endpoint", () => {
    const truth = loadOpenApiTruth("wyscout");
    expect(
      validateOpenApiDocs([{ file: "fake.md", text: "Call `GET /competitions`." }], truth),
    ).toEqual([]);
  });

  it("compares endpoints on shape, so placeholder naming does not matter", () => {
    expect(normalisePath("/matches/{wyId}/events?fetch=teams")).toBe("/matches/{}/events");
    expect(normalisePath("/competitions/{competition_id}/editions/")).toBe(
      "/competitions/{}/editions",
    );
  });

  it("treats an ellipsis path as prose, not an endpoint claim", () => {
    expect(extractDocumentedEndpoints("`GET /metrics/game_intelligence/...`")).toEqual([]);
    expect(extractDocumentedEndpoints("`GET /competitions`")).toEqual([
      { method: "GET", path: "/competitions" },
    ]);
  });
});

describe("single-endpoint provider docs are grounded in the published collection", () => {
  const postmanProviders = listPostmanProviders();

  it("has collection truth files to validate against", () => {
    expect(postmanProviders.length).toBeGreaterThan(0);
  });

  it.each(postmanProviders)("%s docs cite only published request values", (provider) => {
    const truth = loadPostmanTruth(provider);
    expect(validatePostmanDocs(loadProviderDocs(provider), truth)).toEqual([]);
  });

  it.each(postmanProviders)("%s docs actually cite request values", (provider) => {
    const truth = loadPostmanTruth(provider);
    const param = truth.source.dispatch_param as string;
    const cited = loadProviderDocs(provider).reduce(
      (n, d) => n + extractDispatchValues(d.text, param).length,
      0,
    );
    expect(cited).toBeGreaterThan(0);
  });

  it("flags an invented request value", () => {
    const truth = loadPostmanTruth("besoccer");
    const violations = validatePostmanDocs(
      [{ file: "fake.md", text: "Call `?req=totally_made_up_thing`" }],
      truth,
    );
    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("totally_made_up_thing");
  });

  it("flags a plausible misspelling", () => {
    // BeSoccer's matches-per-day selector is `matchs`, not `matches` - precisely
    // the kind of value a model corrects into something that does not exist.
    const truth = loadPostmanTruth("besoccer");
    expect(
      validatePostmanDocs([{ file: "fake.md", text: "Use `?req=matches`" }], truth),
    ).toHaveLength(1);
    expect(validatePostmanDocs([{ file: "ok.md", text: "Use `?req=matchs`" }], truth)).toEqual([]);
  });

  it("does not retain response bodies from the collection", () => {
    // The published collection is mostly saved responses full of BeSoccer's own
    // match data; the truth file must carry only the request surface.
    const raw = JSON.stringify(loadPostmanTruth("besoccer"));
    expect(raw).not.toContain("league_logos");
    expect(raw.length).toBeLessThan(200_000);
  });
});
