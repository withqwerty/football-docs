import { describe, expect, it } from "vitest";
import { htmlToMarkdown, slugify } from "../crawl.js";

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
