import { describe, expect, it } from "vitest";
import {
  extractEnumTokens,
  extractImportedSymbols,
  listTruthProviders,
  loadProviderDocs,
  loadProviderTruth,
  validateProviderDocs,
} from "../provider-truth.js";

const providers = listTruthProviders();

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
