import { describe, expect, it } from "vitest";
import {
  extractDocumentedEndpoints,
  extractEnumTokens,
  extractImportedSymbols,
  listOpenApiProviders,
  listTruthProviders,
  loadOpenApiTruth,
  loadProviderDocs,
  loadProviderTruth,
  normalisePath,
  validateOpenApiDocs,
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
