import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { resetRateLimits } from "../papers/core.js";
import { FORMAT, passageChars } from "../papers/library.js";
import { findQuote, normalise, passages, stripMarkdown } from "../papers/text.js";
import { addLocalPaper, forgetPaper, getPaper, matchQuote, purgeCache, readPaper, searchPapers } from "../papers/tools.js";
import { samplePaper } from "./fixtures-pdf.js";
import { options, type Route, text } from "./papers-helpers.js";

beforeEach(() => resetRateLimits());

const ARXIV_OAI = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"><GetRecord><record><metadata>
<arXiv xmlns="http://arxiv.org/OAI/arXiv/">
  <id>2511.09457</id>
  <authors><author><keyname>van Arem</keyname><forenames>Koen W.</forenames></author></authors>
  <title>The trade-off between model flexibility and accuracy of the Expected Threat model in football</title>
  <license>http://creativecommons.org/licenses/by-nc-nd/4.0/</license>
  <abstract>The Expected Threat model has been praised for its explainability.</abstract>
</arXiv></metadata></record></GetRecord></OAI-PMH>`;

const ARXIV_HTML = `<!doctype html><html><head><title>The trade-off between model flexibility and accuracy</title></head><body><article>
<h1>The trade-off between model flexibility and accuracy</h1>
<h2>1 Introduction</h2><p>${"The Expected Threat model divides the pitch into a grid of zones. ".repeat(60)}</p>
<h2>2 Grid size</h2><p>Using a finer grid leads to a more flexible model that can better distinguish between different situations, but the accuracy of the estimates deteriorates.</p>
<p>${"Simulations on the Markov chain show the error. ".repeat(40)}</p>
</article></body></html>`;

const ARXIV_ROUTES: Route[] = [
  ["https://oaipmh.arxiv.org/oai?", { body: ARXIV_OAI }],
  ["https://arxiv.org/html/2511.09457", { body: ARXIV_HTML, headers: { "content-type": "text/html" } }],
];

function pdfFile(): string {
  const dir = mkdtempSync(join(tmpdir(), "fd-pdf-"));
  const path = join(dir, "valuing-actions.pdf");
  writeFileSync(path, samplePaper());
  return path;
}

// ---------------------------------------------------------------------------

describe("quote matching", () => {
  const source = "Using a finer grid leads to a more flexible model that can better distinguish between different situa-\ntions, but the accuracy of the estimates deteriorates.";

  it("finds an exact quote and gives its offsets", () => {
    const match = findQuote(source, "a more flexible model");
    expect(match.kind).toBe("exact");
    expect(source.slice(match.start, match.end)).toBe("a more flexible model");
  });

  it("finds a quote across case, curly quotes, ligatures and a line-end hyphen", () => {
    const match = findQuote(source, "Better distinguish between different situations, but the accuracy");
    expect(match.kind).toBe("normalised");
    expect(source.slice(match.start, match.end)).toContain("situa-\ntions");
    expect(normalise("“ﬁner” grid — model").text).toBe('"finer" grid - model');
  });

  it("scores a reworded quote as close and an unrelated one as none", () => {
    const close = findQuote(source, "a finer grid leads to a more flexible model which can better distinguish between situations");
    expect(close.kind).toBe("close");
    expect(close.score).toBeGreaterThanOrEqual(0.85);
    expect(findQuote(source, "goalkeepers rarely leave their line during penalty kicks").kind).toBe("none");
  });

  it("keeps every passage within the cap", () => {
    const long = `${"Filler about pressing. ".repeat(50)}The accuracy of the estimates deteriorates with a finer grid. ${"More filler. ".repeat(50)}`;
    const found = passages(long, "accuracy deteriorates", 120);
    expect(found).toHaveLength(1);
    expect(found[0].length).toBeLessThanOrEqual(120);
    expect(found[0]).toContain("accuracy of the estimates");
  });

  it("turns markdown into the source's plain words", () => {
    expect(stripMarkdown("so **'Expected Threat' (xT)** seems [apt](https://x.org) and `code` 1\\. Intro")).toBe(
      "so 'Expected Threat' (xT) seems apt and code 1. Intro",
    );
  });

  it("reads the passage length from the environment, within 50 to 1000", () => {
    expect(passageChars({})).toBe(200);
    expect(passageChars({ FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS: "80" })).toBe(80);
    expect(passageChars({ FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS: "5" })).toBe(50);
    expect(passageChars({ FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS: "99999" })).toBe(1000);
  });
});

describe("read_paper on open copies", () => {
  it("reads arXiv HTML in full with the paper's licence, then serves it from the library", async () => {
    const calls: string[] = [];
    const opts = options(ARXIV_ROUTES, calls);
    const first = text(await readPaper({ id: "2511.09457" }, opts));
    expect(first).toMatch(/Licence:\*\* CC BY-NC-ND 4\.0/);
    expect(first).toMatch(/Access:\*\* open copy, so the full text is returned/);
    expect(first).toContain("Using a finer grid leads to a more flexible model");
    expect(first).toMatch(/Services asked: arXiv; arxiv\.org \(arXiv HTML\)\./);

    const before = calls.length;
    const second = text(await readPaper({ id: "arXiv:2511.09457v1" }, opts));
    expect(calls.length).toBe(before);
    expect(second).toMatch(/your library \(no request sent\)/);
  });

  it("returns passages for a query", async () => {
    const opts = options(ARXIV_ROUTES);
    const out = text(await readPaper({ id: "2511.09457", query: "finer grid" }, opts));
    expect(out).toMatch(/\[section \d+: 2 Grid size\]/);
  });

  it("skips a copy behind a bot check and a landing page, and says what it tried", async () => {
    const opts = options([
      [
        "https://api.openalex.org/works/doi:",
        {
          body: JSON.stringify({
            id: "https://openalex.org/W1",
            doi: "https://doi.org/10.1234/abc",
            display_name: "A paper",
            locations: [
              { is_oa: true, pdf_url: "https://publisher.example/paper.pdf", license: "cc-by" },
              { is_oa: true, landing_page_url: "https://repository.example/item/1" },
            ],
          }),
        },
      ],
      ["https://publisher.example/paper.pdf", { status: 403, body: "<title>Just a moment...</title>", headers: { "cf-mitigated": "challenge" } }],
      ["https://repository.example/item/1", { body: "<html><head><title>Item</title></head><body><p>Abstract only.</p></body></html>", headers: { "content-type": "text/html" } }],
    ]);
    const result = await readPaper({ id: "10.1234/abc" }, opts);
    expect(result.isError).toBe(true);
    const out = text(result);
    expect(out).toMatch(/publisher\.example\/paper\.pdf \(publisher\.example answered with a bot check/);
    expect(out).toMatch(/repository\.example\/item\/1 \(only a landing page/);
    expect(out).toMatch(/add_local_paper/);
  });
});

describe("match_quote", () => {
  it("checks a quote against an open paper and gives a W3C selector", async () => {
    const opts = options(ARXIV_ROUTES);
    const out = text(await matchQuote({ source: "2511.09457", quote: "Using a finer grid leads to a more flexible model" }, opts));
    expect(out).toMatch(/Result: exact\./);
    const selector = JSON.parse(out.match(/```json\n([\s\S]+?)\n```/)![1]);
    expect(selector).toMatchObject({ type: "TextQuoteSelector", exact: "Using a finer grid leads to a more flexible model" });
    // The suffix is the text right after the match, space included.
    expect(selector.suffix).toMatch(/^ that can better distinguish/);
  });

  it("checks a quote against a web page", async () => {
    const url = "https://karun.in/blog/expected-threat.html";
    const page = `<html><head><title>Introducing Expected Threat (xT)</title></head><body><article><p>${"Intro text about buildup play. ".repeat(20)}</p><p>It is inherently designed to capture a notion of 'threat', so 'Expected Threat' (xT) seems like an apt name for it.</p></article></body></html>`;
    const opts = options([
      [`https://web.archive.org/web/1id_/${url}`, { status: 404 }],
      [`https://web.archive.org/web/3000id_/${url}`, { status: 404 }],
      [url, { body: page, headers: { "content-type": "text/html" } }],
    ]);
    const out = text(await matchQuote({ source: url, quote: "It is inherently designed to capture a notion of ‘threat’" }, opts));
    expect(out).toMatch(/Result: normalised\./);
  });

  it("says when a quote is not in the source", async () => {
    const opts = options(ARXIV_ROUTES);
    const out = text(await matchQuote({ source: "2511.09457", quote: "xT was introduced by Opta in 2015 for broadcast graphics" }, opts));
    expect(out).toMatch(/Result: none/);
  });
});

describe("papers you supply", () => {
  it("adds a local PDF and returns only the outline and capped passages", async () => {
    const opts = options([["https://api.openalex.org/", { status: 404 }], ["https://api.crossref.org/", { status: 404 }]]);
    const added = text(await addLocalPaper({ path: pdfFile() }, opts));
    const id = added.match(/\*\*(local:[0-9a-f]{16})\*\*/)![1];
    expect(added).toContain('Added "Valuing Actions in Football"');
    expect(added).toMatch(/Text from:\*\* your file valuing-actions\.pdf$/m);
    expect(added).toMatch(/\[3\] 2 Method/);

    const outline = text(await readPaper({ id }, opts));
    expect(outline).toMatch(/Access:\*\* your copy, so only the outline and passages of at most 200 characters/);
    expect(outline).not.toContain("change in the probability of scoring");

    const refused = await readPaper({ id, section: 3 }, opts);
    expect(refused.isError).toBe(true);

    const found = text(await readPaper({ id, query: "probability scoring" }, opts));
    const passage = found.match(/^- \[section 3: 2 Method, page 2\] (.+)$/m)![1];
    expect(passage.length).toBeLessThanOrEqual(200);
  });

  it("matches a quote in a supplied paper without passing the cap", async () => {
    const opts = options([], [], { env: { FOOTBALL_DOCS_PAPERS: "off", FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS: "60" } });
    const id = text(await addLocalPaper({ path: pdfFile() }, opts)).match(/\*\*(local:[0-9a-f]{16})\*\*/)![1];
    const out = text(await matchQuote({ source: id, quote: "We value each action by the change in the probability of scoring a goal within the next ten actions." }, opts));
    expect(out).toMatch(/Result: exact\./);
    const selector = JSON.parse(out.match(/```json\n([\s\S]+?)\n```/)![1]);
    expect(selector.exact.length + selector.prefix.length + selector.suffix.length).toBeLessThanOrEqual(60);
  });

  it("refuses files that are not PDFs and relative paths", async () => {
    const dir = mkdtempSync(join(tmpdir(), "fd-pdf-"));
    const notPdf = join(dir, "secret.txt");
    writeFileSync(notPdf, "not a paper");
    const opts = options([]);
    expect(text(await addLocalPaper({ path: notPdf }, opts))).toMatch(/only PDF files can be added/);
    expect(text(await addLocalPaper({ path: "papers/x.pdf" }, opts))).toMatch(/give the full path/);
  });

  it("keeps library files private and marks them so they can never be committed", async () => {
    const opts = options([], [], { env: { FOOTBALL_DOCS_PAPERS: "off" } });
    await addLocalPaper({ path: pdfFile() }, opts);
    const index = JSON.parse(readFileSync(join(opts.cacheDir!, "library.json"), "utf8")) as { aliases: Record<string, string> };
    const file = join(opts.cacheDir!, "text", Object.values(index.aliases)[0]);
    expect(JSON.parse(readFileSync(file, "utf8")).format).toBe(FORMAT);
  });

  it("forgets one paper and purges the library only when confirmed", async () => {
    const opts = options([], [], { env: { FOOTBALL_DOCS_PAPERS: "off" } });
    const id = text(await addLocalPaper({ path: pdfFile() }, opts)).match(/\*\*(local:[0-9a-f]{16})\*\*/)![1];
    expect(text(await forgetPaper({ id }, opts))).toMatch(/Removed "Valuing Actions in Football".*original file and Zotero are not touched/);
    expect((await readPaper({ id }, opts)).isError).toBe(true);

    await addLocalPaper({ path: pdfFile() }, opts);
    expect((await purgeCache({ confirm: false }, opts)).isError).toBe(true);
    expect(text(await purgeCache({ confirm: true }, opts))).toMatch(/Deleted 1 papers/);
  });
});

describe("off switch", () => {
  it("still reads the library and local files, and sends nothing", async () => {
    const calls: string[] = [];
    const opts = options([], calls, { env: { FOOTBALL_DOCS_PAPERS: "off" } });
    expect(text(await readPaper({ id: "10.1234/abc" }, opts))).toMatch(/lookups are off/);
    const added = text(await addLocalPaper({ path: pdfFile() }, opts));
    expect(added).toContain("Added");
    expect(calls).toEqual([]);
  });
});

describe("Zotero", () => {
  const ZOTERO = "http://localhost:23119/api/users/0";

  function zoteroRoutes(pdfPath: string): Route[] {
    return [
      [`${ZOTERO}/items/top?q=`, { body: JSON.stringify([{ key: "ABCD2345", data: { key: "ABCD2345", itemType: "journalArticle", title: "Valuing Actions in Football", creators: [{ firstName: "Ada", lastName: "Lovelace" }], date: "2021", DOI: "10.9999/va" } }]) }],
      [`${ZOTERO}/items/ABCD2345/children`, { body: JSON.stringify([{ key: "PDF23456", data: { key: "PDF23456", itemType: "attachment", contentType: "application/pdf" } }]) }],
      [`${ZOTERO}/items/ABCD2345`, { body: JSON.stringify({ key: "ABCD2345", data: { key: "ABCD2345", itemType: "journalArticle", title: "Valuing Actions in Football", creators: [{ firstName: "Ada", lastName: "Lovelace" }], date: "2021", DOI: "10.9999/va" } }) }],
      [`${ZOTERO}/items/PDF23456/file/view/url`, { body: pathToFileURL(pdfPath).href }],
    ];
  }

  it("searches your Zotero library even with lookups off", async () => {
    const calls: string[] = [];
    const opts = options(zoteroRoutes(pdfFile()), calls, { env: { FOOTBALL_DOCS_PAPERS: "off" } });
    const out = text(await searchPapers({ query: "valuing actions", sources: ["zotero", "openalex"] }, opts));
    expect(out).toContain("zotero:ABCD2345");
    expect(out).toMatch(/Public sources were not asked/);
    expect(calls.every((call) => call.includes("localhost:23119"))).toBe(true);
  });

  it("reads an item's PDF as your copy", async () => {
    const opts = options(zoteroRoutes(pdfFile()));
    const out = text(await readPaper({ id: "zotero:ABCD2345", query: "passes box" }, opts));
    expect(out).toMatch(/Text from:\*\* Zotero item ABCD2345/);
    expect(out).toMatch(/Access:\*\* your copy/);
    expect(out).toMatch(/\[section 4: 3 Results, page 3\]/);
    expect(text(await getPaper({ id: "zotero:ABCD2345" }, opts))).toContain("DOI 10.9999/va");
  });

  it("explains how to turn on Zotero's local API", async () => {
    const opts = options([[`${ZOTERO}/`, { status: 403, body: "Local API is not enabled" }]]);
    const out = text(await readPaper({ id: "zotero:ABCD2345" }, opts));
    expect(out).toMatch(/Allow other applications on this computer to communicate with Zotero/);
  });
});
