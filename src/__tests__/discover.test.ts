import { describe, expect, it } from "vitest";
import { chooseBestSource, type ProbeResult } from "../discover.js";

function makeProbe(overrides: Partial<ProbeResult> = {}): ProbeResult {
  return {
    url: "https://example.com",
    sourceType: "readthedocs",
    llmsTxt: null,
    isReadTheDocs: false,
    isReachable: false,
    ...overrides,
  };
}

describe("chooseBestSource", () => {
  it("returns null when no probe results", () => {
    expect(chooseBestSource([])).toBeNull();
  });

  it("returns null when all URLs are unreachable", () => {
    const probes = [
      makeProbe({ isReachable: false }),
      makeProbe({ url: "https://other.com", isReachable: false }),
    ];
    expect(chooseBestSource(probes)).toBeNull();
  });

  it("prefers llms-full.txt over everything", () => {
    const probes = [
      makeProbe({
        url: "https://docs.example.com",
        isReadTheDocs: true,
        isReachable: true,
      }),
      makeProbe({
        url: "https://other.com",
        isReachable: true,
        llmsTxt: {
          url: "https://other.com/llms-full.txt",
          content: "x".repeat(2000),
        },
      }),
    ];

    const result = chooseBestSource(probes);
    expect(result).not.toBeNull();
    expect(result!.type).toBe("llms_txt");
    expect(result!.url).toContain("llms-full.txt");
  });

  it("prefers substantial llms.txt over ReadTheDocs", () => {
    const probes = [
      makeProbe({
        url: "https://rtd.example.com",
        isReadTheDocs: true,
        isReachable: true,
      }),
      makeProbe({
        url: "https://other.com",
        isReachable: true,
        llmsTxt: {
          url: "https://other.com/llms.txt",
          content: "x".repeat(2000),
        },
      }),
    ];

    const result = chooseBestSource(probes);
    expect(result!.type).toBe("llms_txt");
  });

  it("prefers ReadTheDocs over a tiny llms.txt", () => {
    const probes = [
      makeProbe({
        url: "https://rtd.example.com",
        isReadTheDocs: true,
        isReachable: true,
      }),
      makeProbe({
        url: "https://other.com",
        isReachable: true,
        llmsTxt: {
          url: "https://other.com/llms.txt",
          content: "short", // <1000 chars = score 50, RTD = 70
        },
      }),
    ];

    const result = chooseBestSource(probes);
    expect(result!.type).toBe("readthedocs");
    expect(result!.url).toBe("https://rtd.example.com");
  });

  it("prefers ReadTheDocs over a generic reachable URL", () => {
    const probes = [
      makeProbe({
        url: "https://github.com/org/repo",
        sourceType: "github_docs",
        isReachable: true,
      }),
      makeProbe({
        url: "https://docs.example.com",
        sourceType: "readthedocs",
        isReadTheDocs: true,
        isReachable: true,
      }),
    ];

    const result = chooseBestSource(probes);
    expect(result!.type).toBe("readthedocs");
  });

  it("falls back to reachable when no RTD or llms.txt", () => {
    const probes = [
      makeProbe({
        url: "https://github.com/org/repo",
        sourceType: "github_docs",
        isReachable: true,
      }),
    ];

    const result = chooseBestSource(probes);
    expect(result!.type).toBe("github_docs");
    expect(result!.url).toBe("https://github.com/org/repo");
  });

  it("skips unreachable and picks the reachable one", () => {
    const probes = [
      makeProbe({ url: "https://dead.link", isReachable: false }),
      makeProbe({
        url: "https://alive.com",
        sourceType: "api_docs",
        isReachable: true,
      }),
    ];

    const result = chooseBestSource(probes);
    expect(result!.url).toBe("https://alive.com");
  });
});
