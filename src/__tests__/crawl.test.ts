import { describe, expect, it } from "vitest";
import {
  applyCategoryExclusions,
  cleanLlmsPage,
  crawlLlmsIndexes,
  crawlLlmsTxt,
  dedupeSharedSections,
  dropSections,
  htmlToMarkdown,
  llmsPageCategory,
  parseLlmsIndex,
  slugify,
  splitOversizedSections,
} from "../crawl.js";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("API (v3) — Endpoints!")).toBe("api-v3-endpoints");
  });

  it("strips leading and trailing hyphens", () => {
    expect(slugify("--test--")).toBe("test");
  });

  it("truncates to 50 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(50);
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles path-like input safely", () => {
    // ../../../etc/passwd → no dots or slashes survive
    expect(slugify("../../../etc/passwd")).toBe("etc-passwd");
  });
});

describe("htmlToMarkdown", () => {
  it("extracts content from a simple article", () => {
    const html = `
      <html><head><title>Test</title></head>
      <body>
        <nav>Navigation links here</nav>
        <article>
          <h1>Main Title</h1>
          <p>This is the main content of the article with enough text to pass the threshold.</p>
          <h2>Section Two</h2>
          <p>More detailed content in the second section of this documentation page.</p>
        </article>
        <footer>Footer stuff</footer>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).not.toBeNull();
    expect(result).toContain("Main Title");
    expect(result).toContain("main content");
    expect(result).toContain("Section Two");
    // Should not contain nav/footer
    expect(result).not.toContain("Navigation links");
    expect(result).not.toContain("Footer stuff");
  });

  it("converts code blocks to fenced markdown", () => {
    const html = `
      <html><body>
        <article>
          <h1>Code Example</h1>
          <p>Here is some code for the documentation page that has enough content.</p>
          <pre><code>const x = 1;
console.log(x);</code></pre>
          <p>After the code block there is more text to ensure the article passes the threshold.</p>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).not.toBeNull();
    expect(result).toContain("```");
    expect(result).toContain("const x = 1;");
  });

  it("converts tables to GFM, keeping cells on their own row", () => {
    const html = `
      <html><body>
        <article>
          <h1>Coordinate Systems</h1>
          <p>This page documents the coordinate systems the loader accepts as arguments.</p>
          <table>
            <thead><tr><th>Name</th><th>Origin</th><th>Units</th></tr></thead>
            <tbody>
              <tr><td><code>cdf</code></td><td>Center</td><td>meters</td></tr>
              <tr><td><code>opta</code></td><td>Bottom-left</td><td>0-100</td></tr>
            </tbody>
          </table>
          <p>Every transformation passes through the intermediate system before reaching the target.</p>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).toContain("| Name | Origin | Units |");
    expect(result).toContain("| `cdf` | Center | meters |");
    expect(result).toContain("| `opta` | Bottom-left | 0-100 |");
  });

  it("escapes backslashes before pipes, so a cell cannot split its row", () => {
    const html = `
      <html><body>
        <article>
          <h1>Separators</h1>
          <p>This page documents the escape sequences the parser accepts in its arguments.</p>
          <table>
            <tr><th>Pattern</th><th>Meaning</th></tr>
            <tr><td>a\\|b</td><td>literal pipe</td></tr>
          </table>
          <p>Any other character is passed through to the underlying regular expression engine.</p>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    // Both characters escaped: the row keeps exactly two columns.
    expect(result).toContain("| a\\\\\\|b | literal pipe |");
  });

  it("drops the permalink anchor Sphinx and mkdocs append to every heading", () => {
    const html = `
      <html><body>
        <article>
          <h1>Orientations</h1>
          <p>This page explains how the attacking direction is normalised across periods.</p>
          <h2>Static<a class="headerlink" href="#static" title="Permanent link">¶</a></h2>
          <p>Static orientations keep coordinates consistent across every period of the match.</p>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).toContain("## Static");
    expect(result).not.toContain("Permanent link");
    expect(result).not.toContain("¶");
  });

  it("keeps the qualified name a definition permalink carries, and drops a heading slug", () => {
    const html = `
      <html><body>
        <article>
          <h1>XY</h1>
          <p>The XY object stores position data for one team over a full match period.</p>
          <h2>Methods<a class="headerlink" href="#methods" title="Link to this heading">¶</a></h2>
          <dl class="py method">
            <dt><code>frame</code><a class="headerlink" href="https://ex.com/xy.html#floodlight.core.xy.XY.frame" title="Link to this definition"></a></dt>
            <dd><p>Returns data for the given frame.</p></dd>
          </dl>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).toContain("`floodlight.core.xy.XY.frame`");
    expect(result).toContain("## Methods");
    expect(result).not.toContain("#methods");
    expect(result).not.toContain("Link to this");
  });

  it("marks the terms of a definition list so they stay attached to their descriptions", () => {
    const html = `
      <html><body>
        <article>
          <h1>Space</h1>
          <p>Providers differ in how they encode the playing surface, so we summarise the properties.</p>
          <dl class="simple">
            <dt>Unit of measurement</dt><dd><p>What is x and y measured in?</p></dd>
            <dt>Pitch dimension</dt><dd><p>What is the length and width of the pitch?</p></dd>
          </dl>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).toContain("**Unit of measurement**");
    expect(result).toContain("What is x and y measured in?");
    expect(result).toContain("**Pitch dimension**");
  });

  it("leaves an API signature list unbolded, since the signature is already code", () => {
    const html = `
      <html><body>
        <article>
          <h1>Reference</h1>
          <p>This module exposes a single parser for the provider position data files.</p>
          <dl class="py function">
            <dt><code>read_position_data_dat</code>(<em>path</em>)</dt>
            <dd><p>Parses a TRACAB file and extracts position data.</p></dd>
          </dl>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).toContain("read_position_data_dat");
    expect(result).not.toContain("**`read_position_data_dat`");
  });

  it("returns null for empty or script-only pages", () => {
    const html = "<html><body><script>var x = 1;</script></body></html>";
    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).toBeNull();
  });

  it("handles a Sphinx/RTD-style page with role=main", () => {
    const html = `
      <html><body>
        <div class="sidebar">Sidebar navigation content</div>
        <div role="main">
          <h1>API Reference</h1>
          <p>This function does something important in the library and is documented thoroughly here.</p>
          <h2>Parameters</h2>
          <p>The first parameter is the input data frame containing the event data from the provider.</p>
        </div>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).not.toBeNull();
    expect(result).toContain("API Reference");
    expect(result).not.toContain("Sidebar navigation");
  });

  it("preserves tables", () => {
    const html = `
      <html><body>
        <article>
          <h1>Event Types Reference</h1>
          <p>The following table lists all event types supported by the provider in this version.</p>
          <table>
            <thead><tr><th>ID</th><th>Name</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Pass</td></tr>
              <tr><td>2</td><td>Shot</td></tr>
            </tbody>
          </table>
        </article>
      </body></html>
    `;

    const result = htmlToMarkdown(html, "https://example.com");
    expect(result).not.toBeNull();
    expect(result).toContain("Pass");
    expect(result).toContain("Shot");
  });
});

describe("crawlLlmsTxt", () => {
  it("splits multi-section content by headings", () => {
    const content = `# API Reference

This is the overview section with enough content to pass the threshold.

## Endpoints

GET /matches returns a list of matches with detailed information.

## Authentication

Use Bearer token authentication for all API requests to the service.`;

    const docs = crawlLlmsTxt(content, "https://example.com/llms.txt");
    expect(docs.length).toBe(3);
    // First chunk uses the default "overview" title (content before first heading switch)
    expect(docs[0].category).toBe("overview");
    expect(docs[1].category).toBe("endpoints");
    expect(docs[2].category).toBe("authentication");
    for (const doc of docs) {
      expect(doc.source_type).toBe("llms_txt");
      expect(doc.source_url).toBe("https://example.com/llms.txt");
    }
  });

  it("returns single 'reference' doc when no headings present", () => {
    const content = "This is a flat llms.txt with no headings but enough content to pass the fifty character threshold for indexing.";
    const docs = crawlLlmsTxt(content, "https://example.com/llms.txt");
    expect(docs.length).toBe(1);
    expect(docs[0].category).toBe("reference");
    expect(docs[0].content).toBe(content);
  });

  it("returns single 'reference' doc when only one section", () => {
    const content = `# Only Section

This is the only section with enough content to pass the threshold for indexing.`;

    const docs = crawlLlmsTxt(content, "https://example.com/llms.txt");
    expect(docs.length).toBe(1);
    expect(docs[0].category).toBe("reference");
  });

  it("splits a large llms-full.txt on h1 only, keeping each page whole", () => {
    const pages = Array.from(
      { length: 12 },
      (_, i) =>
        `# Page ${i}\n\nIntroductory text for page ${i} that is comfortably over the fifty character minimum.\n\n## Parameters\n\nA subsection that belongs with its page rather than standing on its own.`
    ).join("\n\n");

    const docs = crawlLlmsTxt(pages, "https://example.com/llms-full.txt");

    expect(docs.length).toBe(12);
    expect(docs.map((d) => d.category)).not.toContain("parameters");
    expect(docs[1].content).toContain("## Parameters");
  });

  it("ignores headings inside fenced code blocks", () => {
    const content = `# Overview\n\nThis overview has enough content to be included in the final output for sure.\n\n\`\`\`bash\n# Not a heading, just a shell comment\ncurl https://example.com/v3/football\n\`\`\`\n\n## Real Section\n\nThis section has plenty of content to pass the fifty character minimum threshold.`;

    const docs = crawlLlmsTxt(content, "https://example.com/llms.txt");

    expect(docs.map((d) => d.category)).toEqual(["overview", "real-section"]);
    expect(docs[0].content).toContain("curl https://example.com/v3/football");
    // The fence survives intact rather than being cut in half by a split.
    expect(docs[0].content.match(/```/g)?.length).toBe(2);
  });

  it("drops sections shorter than 50 characters", () => {
    const content = `# Overview

This overview has enough content to be included in the final output for sure.

## Tiny

Short.

## Detailed Section

This section has plenty of content to pass the fifty character minimum threshold.`;

    const docs = crawlLlmsTxt(content, "https://example.com/llms.txt");
    const categories = docs.map((d) => d.category);
    expect(categories).toContain("overview");
    expect(categories).toContain("detailed-section");
    expect(categories).not.toContain("tiny");
  });
});

describe("applyCategoryExclusions", () => {
  const docs = [
    { category: "get-all-fixtures" },
    { category: "cursor-rules" },
    { category: "error-codes" },
    { category: "windsurf" },
  ];

  it("drops the categories a provider excludes", () => {
    const kept = applyCategoryExclusions(docs, ["cursor-rules", "windsurf"]);
    expect(kept.map((d) => d.category)).toEqual(["get-all-fixtures", "error-codes"]);
  });

  it("keeps everything when a provider excludes nothing", () => {
    expect(applyCategoryExclusions(docs, undefined)).toEqual(docs);
    expect(applyCategoryExclusions(docs, [])).toEqual(docs);
  });

  it("ignores an exclusion that matches no crawled category", () => {
    expect(applyCategoryExclusions(docs, ["not-a-page"])).toEqual(docs);
  });
});

describe("llms.txt indexes", () => {
  const index = [
    "# Soccer",
    "- [Guide index](https://docs.example.com/soccer/docs/llms.txt): full index",
    "- [Overview](https://docs.example.com/soccer/docs/soccer-overview.md)",
    "- [Timeline](https://docs.example.com/soccer/reference/soccer-timeline.md#top): feed",
    "- [Elsewhere](https://evil.example.org/steal.md)",
  ].join("\n");

  it("separates page links from nested indexes and ignores other hosts", () => {
    expect(parseLlmsIndex(index, "https://docs.example.com/soccer/llms.txt")).toEqual({
      pages: [
        "https://docs.example.com/soccer/docs/soccer-overview.md",
        "https://docs.example.com/soccer/reference/soccer-timeline.md",
      ],
      indexes: ["https://docs.example.com/soccer/docs/llms.txt"],
    });
  });

  it("names a page by its last path segment", () => {
    expect(llmsPageCategory("https://docs.example.com/soccer/reference/soccer-extended-faq.md")).toBe(
      "soccer-extended-faq",
    );
  });

  it("follows nested indexes and never fetches an excluded page", async () => {
    const pages: Record<string, string> = {
      "https://docs.example.com/llms.txt": "- [Section](https://docs.example.com/section/llms.txt)",
      "https://docs.example.com/section/llms.txt": [
        "- [Kept](https://docs.example.com/section/kept.md)",
        "- [Odds](https://docs.example.com/section/odds-feed.md)",
      ].join("\n"),
      "https://docs.example.com/section/kept.md": `# Kept\n\n## Data Points\n\n${"A real paragraph. ".repeat(10)}`,
    };
    const fetched: string[] = [];
    const fetcher = async (url: string) => {
      fetched.push(url);
      return pages[url] ?? null;
    };
    const docs = await crawlLlmsIndexes(["https://docs.example.com/llms.txt"], ["odds-feed"], fetcher, 0);
    expect(docs.map((d) => d.category)).toEqual(["kept"]);
    expect(docs[0].source_url).toBe("https://docs.example.com/section/kept");
    expect(docs[0].source_type).toBe("llms_txt");
    expect(fetched).not.toContain("https://docs.example.com/section/odds-feed.md");
  });
});

describe("cleanLlmsPage", () => {
  it("drops the frontmatter, the index pointer and the appended OpenAPI definition", () => {
    const page = [
      "---",
      "updatedAt: 2026-07-28",
      "---",
      "",
      "Fetch the complete documentation index at: https://docs.example.com/llms.txt.",
      "",
      "# Timeline",
      "",
      "Real content.",
      "",
      "# OpenAPI definition",
      "",
      "```json",
      '{"openapi": "3.0.0"}',
      "```",
    ].join("\n");
    const cleaned = cleanLlmsPage(page);
    expect(cleaned).toContain("Real content.");
    expect(cleaned).not.toContain("updatedAt");
    expect(cleaned).not.toContain("Fetch the complete documentation index");
    expect(cleaned).not.toContain("OpenAPI definition");
  });

  it("turns accordion titles into headings, so each data-point table is its own section", () => {
    const cleaned = cleanLlmsPage('<Accordion title="Venue" icon="x">\n\n| a | b |\n\n</Accordion>');
    expect(cleaned).toContain("### Venue");
    expect(cleaned).not.toContain("<Accordion");
  });

  it("unwraps HTML lists to bullets", () => {
    expect(cleanLlmsPage('<ul class="x">\n  <li data-term="a">Clock Played</li>\n</ul>')).toContain("- Clock Played");
  });

  it("cuts a long example payload and says how much was dropped", () => {
    const cleaned = cleanLlmsPage(`\`\`\`json\n${"x".repeat(10000)}\n\`\`\``);
    expect(cleaned.length).toBeLessThan(4000);
    expect(cleaned).toContain("example cut here");
    expect(cleaned.trimEnd().endsWith("```")).toBe(true);
  });

  it("omits an SVG diagram but keeps the text of other HTML blocks", () => {
    const cleaned = cleanLlmsPage(
      "<HTMLBlock>{`<div><svg><text>MAP</text></svg></div>`}</HTMLBlock>\n\n<HTMLBlock>{`<table><tr><td>https://api.example.com/x.json</td></tr></table>`}</HTMLBlock>",
    );
    expect(cleaned).toContain("Diagram omitted");
    expect(cleaned).not.toContain("<svg");
    expect(cleaned).toContain("https://api.example.com/x.json");
  });
});

describe("splitOversizedSections", () => {
  it("splits a long section at paragraph breaks and repeats its heading", () => {
    const text = `## Big\n\n${Array.from({ length: 6 }, (_, i) => `Paragraph ${i} ${"z".repeat(50)}`).join("\n\n")}`;
    const split = splitOversizedSections(text, 150);
    expect(split.match(/^## Big \(continued\)$/gm)?.length).toBeGreaterThan(0);
    for (const section of split.split(/(?=^## )/m)) expect(section.length).toBeLessThan(300);
  });

  it("never splits inside a code fence", () => {
    const fence = ["```", "line one", "", "line two", "", "line three", "```"].join("\n");
    const split = splitOversizedSections(`## Code\n\n${fence}`, 20);
    const inside = split.slice(split.indexOf("```"), split.lastIndexOf("```"));
    expect(inside).not.toContain("(continued)");
  });
});

describe("dedupeSharedSections", () => {
  it("keeps the first copy of a repeated table and names it on later pages", () => {
    const table = `### Venue\n\n${"| `id` | venue | String | id |\n".repeat(10)}`;
    const docs = dedupeSharedSections([
      { category: "first", content: `# First\n\n${table}` },
      { category: "second", content: `# Second\n\n${table}` },
    ]);
    expect(docs[0].content).toContain("### Venue");
    expect(docs[1].content).not.toContain("### Venue");
    expect(docs[1].content).toContain("Venue (`first`)");
  });
});

describe("dropSections", () => {
  it("drops a listed section with everything nested under it", () => {
    const text = ["## Keep", "a", "## Probabilities", "b", "### Markets", "c", "## After", "d"].join("\n");
    expect(dropSections(text, ["probabilities"])).toBe(["## Keep", "a", "## After", "d"].join("\n"));
  });

  it("drops only the listed subsection when it is a ### heading", () => {
    const text = ["## IDs", "a", "### Odds", "b", "### Mapping", "c"].join("\n");
    expect(dropSections(text, ["Odds"])).toBe(["## IDs", "a", "### Mapping", "c"].join("\n"));
  });
});
