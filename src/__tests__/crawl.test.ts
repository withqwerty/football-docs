import { describe, expect, it } from "vitest";
import { crawlLlmsTxt, htmlToMarkdown, slugify } from "../crawl.js";

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
