import { describe, it, expect } from "vitest";
import { parseFrontmatter, chunkMarkdown } from "../ingest.js";

describe("parseFrontmatter", () => {
  it("returns defaults when no frontmatter present", () => {
    const { frontmatter, body } = parseFrontmatter("# Hello\n\nSome content");
    expect(frontmatter.source_type).toBe("curated");
    expect(frontmatter.source_url).toBeNull();
    expect(body).toBe("# Hello\n\nSome content");
  });

  it("parses valid frontmatter", () => {
    const text = `---
source_url: https://example.com/docs
source_type: crawled
upstream_version: 1.2.3
crawled_at: 2026-03-26T00:00:00Z
---

# Content here`;

    const { frontmatter, body } = parseFrontmatter(text);
    expect(frontmatter.source_url).toBe("https://example.com/docs");
    expect(frontmatter.source_type).toBe("crawled");
    expect(frontmatter.upstream_version).toBe("1.2.3");
    expect(frontmatter.crawled_at).toBe("2026-03-26T00:00:00Z");
    expect(body).toBe("# Content here");
  });

  it("returns defaults on unterminated frontmatter", () => {
    const text = "---\nsource_type: crawled\nno closing delimiter";
    const { frontmatter, body } = parseFrontmatter(text);
    expect(frontmatter.source_type).toBe("curated"); // defaults
    expect(body).toBe(text); // entire text returned as body
  });

  it("handles values with colons (URLs)", () => {
    const text = `---
source_url: https://docs.example.com/en/latest/
---

Body`;

    const { frontmatter } = parseFrontmatter(text);
    expect(frontmatter.source_url).toBe("https://docs.example.com/en/latest/");
  });

  it("ignores unknown keys", () => {
    const text = `---
source_type: crawled
unknown_key: some_value
---

Body`;

    const { frontmatter } = parseFrontmatter(text);
    expect(frontmatter.source_type).toBe("crawled");
    expect(frontmatter).not.toHaveProperty("unknown_key");
  });

  it("strips surrounding quotes from values", () => {
    const text = `---
source_type: "llms_txt"
upstream_version: '2.0'
---

Body`;

    const { frontmatter } = parseFrontmatter(text);
    expect(frontmatter.source_type).toBe("llms_txt");
    expect(frontmatter.upstream_version).toBe("2.0");
  });
});

describe("chunkMarkdown", () => {
  it("produces a single chunk for headingless content", () => {
    const text = "This is some content without any headings that is long enough to pass the threshold.";
    const chunks = chunkMarkdown(text, "test", "doc");
    expect(chunks).toHaveLength(1);
    expect(chunks[0].title).toBe("test - doc");
    expect(chunks[0].provider).toBe("test");
    expect(chunks[0].category).toBe("doc");
  });

  it("splits on ## headings", () => {
    const text = `# Top heading

Some intro text that is longer than twenty characters.

## Section One

Content for section one is here and is long enough.

## Section Two

Content for section two is here and is long enough.`;

    const chunks = chunkMarkdown(text, "provider", "category");
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks[1].title).toBe("Section One");
    expect(chunks[2].title).toBe("Section Two");
  });

  it("drops chunks shorter than 20 characters", () => {
    const text = `# Introduction

This intro section has enough content to pass the twenty character threshold easily.

## Good Section

This section has enough content to be indexed properly by the system.

## Tiny

Short.

## Another Good Section

This section also has enough content to pass the twenty character threshold.`;

    const chunks = chunkMarkdown(text, "test", "doc");
    const titles = chunks.map((c) => c.title);
    // Good Section and Another Good Section have >20 chars content
    expect(titles).toContain("Good Section");
    expect(titles).toContain("Another Good Section");
    // Tiny has <20 chars content ("Short.") so it gets dropped
    expect(titles).not.toContain("Tiny");
  });

  it("propagates frontmatter to all chunks", () => {
    const text = `---
source_url: https://example.com
source_type: crawled
---

## Section A

Content for section A is long enough to pass the threshold.

## Section B

Content for section B is long enough to pass the threshold.`;

    const chunks = chunkMarkdown(text, "prov", "cat");
    for (const chunk of chunks) {
      expect(chunk.source_type).toBe("crawled");
      expect(chunk.source_url).toBe("https://example.com");
    }
  });

  it("defaults to curated when no frontmatter", () => {
    const text = "## Section\n\nContent that is long enough to be indexed by the chunker.";
    const chunks = chunkMarkdown(text, "prov", "cat");
    expect(chunks[0].source_type).toBe("curated");
    expect(chunks[0].source_url).toBeNull();
  });
});
