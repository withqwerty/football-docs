import { statSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { arxivQuery, arxivYear } from "../papers/arxiv.js";
import { plainText, resetRateLimits } from "../papers/core.js";
import { creditNote, rebuildAbstract } from "../papers/openalex.js";
import { citeAs, licenceName, parsePaperId } from "../papers/records.js";
import { findQuote, splitLongSection, splitSections } from "../papers/text.js";
import { getPaper, getWebSource, searchPapers } from "../papers/tools.js";
import { checkPublicUrl, extractPage, isBotChallenge } from "../papers/web.js";
import { samplePaper } from "./fixtures-pdf.js";
import { options, type Route, text } from "./papers-helpers.js";


// ---------------------------------------------------------------------------
// Canned replies, cut down from real responses

const OPENALEX_VAEP = {
  id: "https://openalex.org/W4288278931",
  doi: "https://doi.org/10.1145/3292500.3330758",
  display_name: "Actions Speak Louder than Goals",
  publication_year: 2019,
  publication_date: "2019-07-25",
  type: "conference-paper",
  authorships: [
    { author: { display_name: "Tom Decroos" } },
    { author: { display_name: "Lotte Bransen" } },
    { author: { display_name: "Jan Van Haaren" } },
    { author: { display_name: "Jesse Davis" } },
  ],
  primary_location: {
    landing_page_url: "https://doi.org/10.1145/3292500.3330758",
    raw_source_name: "Proceedings of the 25th ACM SIGKDD International Conference on Knowledge Discovery &amp; Data Mining",
    is_oa: false,
  },
  locations: [
    {
      landing_page_url: "http://arxiv.org/abs/1802.07127",
      pdf_url: "https://arxiv.org/pdf/1802.07127",
      is_oa: true,
      version: "submittedVersion",
      source: { display_name: "arXiv (Cornell University)" },
    },
  ],
  best_oa_location: {
    landing_page_url: "http://arxiv.org/abs/1802.07127",
    pdf_url: "https://arxiv.org/pdf/1802.07127",
    is_oa: true,
    version: "submittedVersion",
    source: { display_name: "arXiv (Cornell University)" },
  },
  open_access: { is_oa: true, oa_status: "green" },
  cited_by_count: 239,
  abstract_inverted_index: { Assessing: [0], the: [1], impact: [2] },
};

const ARXIV_FEED = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:arxiv="http://arxiv.org/schemas/atom">
  <opensearch:totalResults>2</opensearch:totalResults>
  <entry>
    <id>http://arxiv.org/abs/1802.07127v2</id>
    <title>Actions Speak Louder Than Goals: Valuing Player Actions in Soccer</title>
    <published>2018-02-20T14:12:40Z</published>
    <summary>Assessing the impact of the individual actions performed by soccer players.</summary>
    <arxiv:doi>10.1145/3292500.3330758</arxiv:doi>
    <author><name>Tom Decroos</name></author>
  </entry>
  <entry>
    <id>http://arxiv.org/abs/2511.09457v1</id>
    <title>The trade-off between model flexibility and accuracy of the Expected Threat model in football</title>
    <published>2025-11-12T16:18:11Z</published>
    <summary>The Expected Threat model has been praised for its explainability.</summary>
    <author><name>Koen W. van Arem</name></author>
  </entry>
</feed>`;

const ARXIV_OAI = `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"><GetRecord><record><metadata>
<arXiv xmlns="http://arxiv.org/OAI/arXiv/">
  <id>1802.07127</id><created>2019-07-10</created>
  <authors><author><keyname>Decroos</keyname><forenames>Tom</forenames></author><author><keyname>Davis</keyname><forenames>Jesse</forenames></author></authors>
  <title>Actions Speak Louder Than Goals: Valuing Player Actions in Soccer</title>
  <doi>10.1145/3292500.3330758</doi>
  <license>http://arxiv.org/licenses/nonexclusive-distrib/1.0/</license>
  <abstract>Assessing the impact of the individual actions performed by soccer players.</abstract>
</arXiv></metadata></record></GetRecord></OAI-PMH>`;

function oaiPage(records: Array<{ n: number; title: string; date?: string; deleted?: boolean }>, token?: string): string {
  const body = records
    .map(
      (r) => `<record><header${r.deleted ? ' status="deleted"' : ""}><identifier>oai:ojs.scholarsportal.info:preprint/${r.n}</identifier></header>
<metadata><oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:title xml:lang="en-US">${r.title}</dc:title>
<dc:creator>Doe, Jane </dc:creator>
<dc:subject xml:lang="en-US">football</dc:subject>
<dc:description xml:lang="en-US">Abstract about ${r.title}.&amp;nbsp;</dc:description>
<dc:date>${r.date ?? "2024-05-01"}</dc:date>
<dc:identifier>https://sportrxiv.org/index.php/server/preprint/view/${r.n}</dc:identifier>
<dc:identifier>10.51224/SRXIV.${r.n}</dc:identifier>
<dc:relation>https://sportrxiv.org/index.php/server/preprint/view/${r.n}/10</dc:relation>
<dc:rights xml:lang="en-US">Copyright (c) 2024 Jane Doe</dc:rights>
<dc:rights xml:lang="en-US">https://creativecommons.org/licenses/by/4.0</dc:rights>
</oai_dc:dc></metadata></record>`,
    )
    .join("\n");
  return `<?xml version="1.0"?><OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"><ListRecords>${body}${
    token ? `<resumptionToken completeListSize="3" cursor="0">${token}</resumptionToken>` : ""
  }</ListRecords></OAI-PMH>`;
}

const SPORTRXIV_ROUTES: Route[] = [
  ["https://sportrxiv.org/index.php/server/oai?verb=ListRecords&resumptionToken=page2", { body: oaiPage([{ n: 3, title: "Pressing intensity in elite football" }]) }],
  [
    "https://sportrxiv.org/index.php/server/oai?verb=ListRecords&metadataPrefix=oai_dc",
    {
      body: oaiPage(
        [
          { n: 1, title: "Expected threat in youth football" },
          { n: 2, title: "Sprint load in rugby" },
        ],
        "page2",
      ),
    },
  ],
];

beforeEach(() => resetRateLimits());

// ---------------------------------------------------------------------------

describe("identifiers", () => {
  it.each([
    ["10.1145/3292500.3330758", { kind: "doi", doi: "10.1145/3292500.3330758" }],
    ["https://doi.org/10.1007/S10994-021-05989-6", { kind: "doi", doi: "10.1007/s10994-021-05989-6" }],
    ["doi:10.3390/app15084151", { kind: "doi", doi: "10.3390/app15084151" }],
    ["arXiv:1802.07127", { kind: "arxiv", arxiv: "1802.07127" }],
    ["2511.09457v1", { kind: "arxiv", arxiv: "2511.09457v1" }],
    ["https://arxiv.org/abs/1802.07127v2", { kind: "arxiv", arxiv: "1802.07127v2" }],
    ["https://arxiv.org/pdf/2011.09426.pdf", { kind: "arxiv", arxiv: "2011.09426" }],
    ["10.48550/arXiv.1802.07127", { kind: "arxiv", arxiv: "1802.07127" }],
    ["hep-th/9901001", { kind: "arxiv", arxiv: "hep-th/9901001" }],
    ["W4288278931", { kind: "openalex", openalex: "W4288278931" }],
    ["https://openalex.org/W4288278931", { kind: "openalex", openalex: "W4288278931" }],
    ["https://sportrxiv.org/index.php/server/preprint/view/42", { kind: "doi", doi: "10.51224/srxiv.42" }],
    ["CorpusId:55284304", { kind: "semantic-scholar", value: "CorpusId:55284304" }],
    ["https://karun.in/blog/expected-threat.html", { kind: "url", url: "https://karun.in/blog/expected-threat.html" }],
    ["expected threat", { kind: "unknown", value: "expected threat" }],
  ])("parses %s", (input, expected) => {
    expect(parsePaperId(input)).toEqual(expected);
  });

  it("dates arXiv IDs by their first submission", () => {
    expect(arxivYear("1802.07127")).toBe(2018);
    expect(arxivYear("hep-th/9901001")).toBe(1999);
  });
});

describe("text helpers", () => {
  it("names licences and keeps unknown ones as given", () => {
    expect(licenceName("http://arxiv.org/licenses/nonexclusive-distrib/1.0/")).toMatch(/non-exclusive/);
    expect(licenceName("https://creativecommons.org/licenses/by-nc-nd/4.0/")).toBe("CC BY-NC-ND 4.0");
    expect(licenceName("cc-by")).toBe("CC BY");
    expect(licenceName("other-oa")).toBe("other-oa");
  });

  it("decodes twice-encoded entities from OAI feeds", () => {
    expect(plainText("Results&amp;nbsp;<i>here</i> &amp;lt;0.001")).toBe("Results here <0.001");
  });

  it("rebuilds an OpenAlex abstract in word order", () => {
    expect(rebuildAbstract({ goals: [3], speak: [1], Actions: [0], louder: [2] })).toBe("Actions speak louder goals");
  });

  it("turns a free-text query into arXiv field syntax", () => {
    expect(arxivQuery('"expected threat" soccer')).toBe('all:"expected threat" AND all:soccer');
    expect(arxivQuery("xT OR VAEP NOT basketball")).toBe("all:xT OR all:VAEP ANDNOT all:basketball");
  });

  it("warns when the OpenAlex daily credits run low", () => {
    expect(creditNote(new Headers({ "x-ratelimit-remaining": "990", "x-ratelimit-limit": "1000" }))).toBeUndefined();
    expect(creditNote(new Headers({ "x-ratelimit-remaining": "40", "x-ratelimit-limit": "1000" }))).toMatch(/40 of 1000/);
  });
});

describe("off switch", () => {
  it.each(["off", "0", "false", "NO"])("FOOTBALL_DOCS_PAPERS=%s stops every tool before any request", async (value) => {
    const calls: string[] = [];
    const opts = options([], calls, { env: { FOOTBALL_DOCS_PAPERS: value } });
    for (const result of [
      await searchPapers({ query: "xG" }, opts),
      await getPaper({ id: "1802.07127" }, opts),
      await getWebSource({ url: "https://karun.in/blog/expected-threat.html" }, opts),
    ]) {
      expect(text(result)).toMatch(/lookups are off/);
    }
    expect(calls).toEqual([]);
  });
});

describe("search_papers", () => {
  it("asks all three sources, folds duplicates and names the services", async () => {
    const calls: string[] = [];
    const opts = options(
      [
        [
          "https://api.openalex.org/works?",
          { body: JSON.stringify({ meta: { count: 142 }, results: [OPENALEX_VAEP] }), headers: { "x-ratelimit-remaining": "990", "x-ratelimit-limit": "1000" } },
        ],
        ["https://export.arxiv.org/api/query", { body: ARXIV_FEED }],
        ...SPORTRXIV_ROUTES,
      ],
      calls,
    );
    const result = await searchPapers({ query: '"expected threat"' }, opts);
    const out = text(result);
    // The arXiv copy of VAEP is the OpenAlex record's arXiv location: shown once.
    expect(out.match(/Actions Speak Louder/gi)).toHaveLength(1);
    expect(out).toContain("The trade-off between model flexibility");
    expect(out).toContain("Expected threat in youth football");
    expect(out).not.toContain("Sprint load in rugby");
    expect(out).toMatch(/Services asked: .*OpenAlex \(142 matches\)/);
    expect(out).toMatch(/SportRxiv \(downloaded its feed; 1 matches\)/);
    expect(calls.some((call) => call.includes("search=%22expected+threat%22"))).toBe(true);
  });

  it("uses an OpenAlex key from the keychain when the environment has none", async () => {
    const calls: string[] = [];
    const opts = options(
      [["https://api.openalex.org/works?", { body: JSON.stringify({ meta: { count: 0 }, results: [] }) }]],
      calls,
      { keychain: async (name) => (name === "OPENALEX_API_KEY" ? "k-123" : null) },
    );
    await searchPapers({ query: "xG", sources: ["openalex"] }, opts);
    expect(calls[0]).toContain("api_key=k-123");
  });

  it("explains an exhausted OpenAlex day and still returns the other sources", async () => {
    const opts = options([
      ["https://api.openalex.org/works?", { status: 429 }],
      ["https://export.arxiv.org/api/query", { body: ARXIV_FEED }],
    ]);
    const out = text(await searchPapers({ query: "threat", sources: ["openalex", "arxiv"] }, opts));
    expect(out).toMatch(/OpenAlex \(failed: daily credit limit reached .*OPENALEX_API_KEY\)/);
    expect(out).toContain("The trade-off between model flexibility");
  });

  it("points to web search when no paper matches", async () => {
    const opts = options([["https://export.arxiv.org/api/query", { body: '<feed xmlns="http://www.w3.org/2005/Atom"></feed>' }]]);
    const out = text(await searchPapers({ query: "who introduced xT", sources: ["arxiv"] }, opts));
    expect(out).toMatch(/blog posts or conference papers without a DOI/);
    expect(out).toMatch(/get_web_source/);
  });
});

describe("SportRxiv mirror", () => {
  it("keeps the feed in a folder only the user can read and updates it after a week", async () => {
    const calls: string[] = [];
    let now = Date.parse("2026-10-01T12:00:00Z");
    const opts = options(
      [
        [
          "https://sportrxiv.org/index.php/server/oai?verb=ListRecords&metadataPrefix=oai_dc&from=2026-10-01",
          { body: oaiPage([{ n: 2, title: "Sprint load", deleted: true }, { n: 4, title: "Expected threat for women's football" }]) },
        ],
        ...SPORTRXIV_ROUTES,
      ],
      calls,
      { now: () => now },
    );
    await searchPapers({ query: "football", sources: ["sportrxiv"] }, opts);
    expect(calls).toHaveLength(2);
    // Windows has no POSIX modes; the user folder's access rules apply there.
    if (process.platform !== "win32") {
      expect(statSync(opts.cacheDir!).mode & 0o777).toBe(0o700);
      expect(statSync(join(opts.cacheDir!, "sportrxiv.json")).mode & 0o777).toBe(0o600);
    }

    // Within the week: no request.
    now += 24 * 60 * 60 * 1000;
    const cached = text(await searchPapers({ query: "football", sources: ["sportrxiv"] }, opts));
    expect(calls).toHaveLength(2);
    expect(cached).toMatch(/local copy from 2026-10-01, no request sent/);

    // After it: only the changes since the last download.
    now += 7 * 24 * 60 * 60 * 1000;
    const updated = text(await searchPapers({ query: "threat", sources: ["sportrxiv"] }, opts));
    expect(calls[2]).toContain("from=2026-10-01");
    expect(updated).toContain("Expected threat for women's football");
    expect(updated).toContain("Expected threat in youth football");
  });

  it("uses the old copy and says so when an update fails", async () => {
    let now = Date.parse("2026-10-01T12:00:00Z");
    let fail = false;
    const routes: Route[] = SPORTRXIV_ROUTES.map(([prefix, reply]) => [prefix, (url, init) => (fail ? { status: 503 } : typeof reply === "function" ? reply(url, init) : reply)]);
    const opts = options(routes, [], { now: () => now });
    await searchPapers({ query: "threat", sources: ["sportrxiv"] }, opts);
    fail = true;
    now += 8 * 24 * 60 * 60 * 1000;
    const out = text(await searchPapers({ query: "threat", sources: ["sportrxiv"] }, opts));
    expect(out).toContain("Expected threat in youth football");
    expect(out).toMatch(/update failed \(HTTP 503\); used the copy from 2026-10-01/);
  });
});

describe("get_paper", () => {
  it("reads an arXiv record with its licence, then the published version", async () => {
    const calls: string[] = [];
    const opts = options(
      [
        ["https://oaipmh.arxiv.org/oai?", { body: ARXIV_OAI }],
        ["https://api.openalex.org/works/doi:10.1145/3292500.3330758", { body: JSON.stringify(OPENALEX_VAEP) }],
      ],
      calls,
    );
    const out = text(await getPaper({ id: "arXiv:1802.07127v2" }, opts));
    // arXiv's server does not answer when the colons are percent-encoded.
    expect(calls[0]).toContain("identifier=oai:arXiv.org:1802.07127&");
    expect(out).toMatch(/Licence:\*\* arXiv non-exclusive licence/);
    expect(out).toMatch(/Date:\*\* 2018/);
    expect(out).toContain("arXiv:1802.07127v2. https://arxiv.org/abs/1802.07127v2");
    expect(out).toMatch(/## Published version[\s\S]*cited by 239/);
    expect(out).toMatch(/Services asked: arXiv; OpenAlex\./);
  });

  it("falls back to Crossref when OpenAlex has no record of a DOI", async () => {
    const opts = options([
      ["https://api.openalex.org/works/doi:", { status: 404 }],
      [
        "https://api.crossref.org/works/10.1234/abc",
        {
          body: JSON.stringify({
            message: { DOI: "10.1234/ABC", title: ["A football paper"], author: [{ given: "Ada", family: "Lovelace" }], issued: { "date-parts": [[2020, 3]] } },
          }),
        },
      ],
    ]);
    const out = text(await getPaper({ id: "10.1234/abc" }, opts));
    expect(out).toContain("# A football paper");
    expect(out).toMatch(/Date:\*\* 2020-03/);
    expect(out).toMatch(/Services asked: OpenAlex \(no record\); Crossref\./);
  });

  it("finds a SportRxiv DOI in the mirror when OpenAlex has none", async () => {
    const opts = options([["https://api.openalex.org/works/doi:", { status: 404 }], ...SPORTRXIV_ROUTES]);
    const out = text(await getPaper({ id: "https://sportrxiv.org/index.php/server/preprint/view/3" }, opts));
    expect(out).toContain("# Pressing intensity in elite football");
    expect(out).toMatch(/Licence:\*\* CC BY 4\.0/);
  });

  it("waits three seconds between two arXiv calls", async () => {
    const waits: number[] = [];
    let now = 1_000_000;
    const opts = options([["https://oaipmh.arxiv.org/oai?", { body: ARXIV_OAI }], ["https://api.openalex.org/", { status: 404 }]], [], {
      now: () => now,
      sleep: async (ms) => {
        waits.push(ms);
        now += ms;
      },
    });
    await getPaper({ id: "1802.07127" }, opts);
    now += 500;
    await getPaper({ id: "1802.07127" }, opts);
    expect(waits).toEqual([2600]);
  });

  it("explains IDs it cannot resolve without asking any service", async () => {
    const calls: string[] = [];
    const opts = options([], calls);
    expect(text(await getPaper({ id: "CorpusId:55284304" }, opts))).toMatch(/Semantic Scholar IDs are not supported yet/);
    expect(text(await getPaper({ id: "https://karun.in/blog/expected-threat.html" }, opts))).toMatch(/use get_web_source/);
    expect(calls).toEqual([]);
  });

  it("cites an OpenAlex record by its DOI", () => {
    expect(
      citeAs({ source: "openalex", title: "T", authors: ["A B"], year: 2019, ids: { doi: "10.1/x" }, openCopies: [] }),
    ).toBe("A B (2019). T. https://doi.org/10.1/x");
  });
});

// ---------------------------------------------------------------------------

const XT_PAGE = `<!doctype html><html><head><title>Introducing Expected Threat (xT)</title>
<meta name="author" content="Karun Singh"></head><body><article>
<h4>Credit where credit's due</h4>
<p>${"It values locations based on not just the immediate shooting threat, but the potential to induce danger later in the possession sequence. ".repeat(3)}</p>
<h4>Existing approaches</h4><p>${"You can look at assists, but contributions such as these will go unnoticed in the numbers. ".repeat(3)}</p>
</article></body></html>`;

const WAYBACK_EARLIEST = "https://web.archive.org/web/1id_/";
const WAYBACK_LATEST = "https://web.archive.org/web/3000id_/";

function waybackRoutes(url: string, earliest = "20190222174641", latest = "20260922114139"): Route[] {
  return [
    [`${WAYBACK_EARLIEST}${url}`, { status: 302, headers: { location: `https://web.archive.org/web/${earliest}id_/${url}` } }],
    [`${WAYBACK_LATEST}${url}`, { status: 302, headers: { location: `https://web.archive.org/web/${latest}id_/${url}` } }],
  ];
}

describe("get_web_source", () => {
  const XT = "https://karun.in/blog/expected-threat.html";

  it("reads a page and dates it by its earliest snapshot when it has no date", async () => {
    const opts = options([...waybackRoutes(XT), [XT, { body: XT_PAGE, headers: { "content-type": "text/html" } }]]);
    const out = text(await getWebSource({ url: XT }, opts));
    expect(out).toContain("# Introducing Expected Threat (xT)");
    expect(out).toMatch(/Author:\*\* Karun Singh/);
    expect(out).toMatch(/Published:\*\* no date on the page/);
    expect(out).toMatch(/Licence:\*\* none stated on the page/);
    expect(out).toContain("Earliest Wayback snapshot:** 2019-02-22 https://web.archive.org/web/20190222174641/https://karun.in/blog/expected-threat.html");
    expect(out).toMatch(/It existed by 2019-02-22/);
    expect(out).toContain("potential to induce danger later in the possession sequence");
    expect(out).toMatch(/Services asked: karun\.in; Wayback Machine\.|Services asked: Wayback Machine; karun\.in\./);
  });

  it("gives the save link when the Wayback Machine has no copy", async () => {
    const url = "https://example.org/post";
    const opts = options([
      [`${WAYBACK_EARLIEST}${url}`, { status: 404 }],
      [`${WAYBACK_LATEST}${url}`, { status: 404 }],
      [url, { body: XT_PAGE, headers: { "content-type": "text/html" } }],
    ]);
    expect(text(await getWebSource({ url }, opts))).toContain("To make one, open https://web.archive.org/save/https://example.org/post");
  });

  it("reads the archived copy when the live page is gone", async () => {
    const opts = options([
      ...waybackRoutes(XT),
      ["https://web.archive.org/web/20260922114139id_/", { body: XT_PAGE, headers: { "content-type": "text/html" } }],
      [XT, { status: 404 }],
    ]);
    const out = text(await getWebSource({ url: XT }, opts));
    expect(out).toMatch(/Read from:\*\* the Wayback Machine's latest copy/);
    expect(out).toContain("potential to induce danger");
    expect(out).toMatch(/karun\.in \(failed: HTTP 404\)/);
  });

  it("stops at a bot check and does not try to get past it", async () => {
    const calls: string[] = [];
    const challenge = "<html><head><title>Just a moment...</title></head><body><script src='/cdn-cgi/challenge-platform/x.js'></script></body></html>";
    const opts = options(
      [...waybackRoutes(XT), [XT, { status: 403, body: challenge, headers: { "cf-mitigated": "challenge" } }]],
      calls,
    );
    const result = await getWebSource({ url: XT }, opts);
    expect(result.isError).toBe(true);
    expect(text(result)).toMatch(/bot check .*does not try to get past/);
    expect(calls.filter((call) => call.endsWith(XT) && call.startsWith("GET"))).toHaveLength(1);
  });

  it("refuses a redirect to a private address", async () => {
    const opts = options([
      ...waybackRoutes(XT),
      [XT, { status: 302, headers: { location: "http://127.0.0.1:23119/api/" } }],
    ]);
    const out = text(await getWebSource({ url: XT }, opts));
    expect(out).toMatch(/local and private addresses are not allowed/);
  });

  it("reads a PDF by its sections", async () => {
    const url = "https://example.org/paper.pdf";
    const opts = options([...waybackRoutes(url), [url, { bytes: samplePaper(), headers: { "content-type": "application/pdf" } }]]);
    const out = text(await getWebSource({ url }, opts));
    expect(out).toContain("# Valuing Actions in Football");
    expect(out).toMatch(/Format:\*\* PDF, 6 sections/);
    expect(out).toMatch(/Author:\*\* Ada Lovelace/);
    expect(out).toContain("## 2 Method");
    expect(out).toContain("change in the probability of scoring a goal");
  });

  it("returns a long page by section", async () => {
    const url = "https://example.org/long";
    const long = `<html><head><title>Long</title></head><body><article>${Array.from({ length: 6 }, (_, i) => `<h2>Part ${i}</h2><p>${`Sentence ${i} about pitch control. `.repeat(400)}</p>`).join("")}</article></body></html>`;
    const opts = options([...waybackRoutes(url), [url, { body: long, headers: { "content-type": "text/html" } }]]);
    const outline = text(await getWebSource({ url }, opts));
    expect(outline).toMatch(/comes back by section/);
    expect(outline).toMatch(/^- \[4\] Part 4 \(\d+ characters\)$/m);
    const section = text(await getWebSource({ url, section: 5 }, opts));
    expect(section).toContain("## Part 5");
    expect(section).toContain("Sentence 5 about pitch control.");
    expect(section).not.toContain("Sentence 4 about");
  });
});

describe("address rules", () => {
  const publicLookup = async () => ["93.184.216.34"];

  it.each([
    "http://localhost:23119/api/",
    "http://127.0.0.1/",
    "http://[::1]/",
    "http://10.1.2.3/",
    "http://192.168.1.10/",
    "http://169.254.169.254/latest/meta-data",
    "http://[::ffff:127.0.0.1]/",
    "http://printer.local/",
    "file:///etc/passwd",
    "https://user:pass@example.org/",
  ])("refuses %s", async (url) => {
    await expect(checkPublicUrl(url, publicLookup)).rejects.toThrow();
  });

  it("refuses a public name that resolves to a private address", async () => {
    await expect(checkPublicUrl("https://evil.example/", async () => ["192.168.0.5"])).rejects.toThrow(/private/);
  });

  it("allows a public address", async () => {
    await expect(checkPublicUrl("https://karun.in/blog/expected-threat.html", publicLookup)).resolves.toBeInstanceOf(URL);
  });

  it("recognises a challenge page but not a long article that mentions a captcha", () => {
    expect(isBotChallenge(503, new Headers(), "<title>Just a moment...</title>")).toBe(true);
    expect(isBotChallenge(200, new Headers(), `<p>g-recaptcha</p>${"x".repeat(30_000)}`)).toBe(false);
  });
});

describe("maths in arXiv HTML", () => {
  // LaTeXML (arXiv's HTML) writes each formula as rendered MathML plus a LaTeX
  // annotation. Read naively, "13×10" came out as "13×1013\times 10".
  const simple =
    '<math alttext="13\\times 10" display="inline"><semantics><mrow><mn>13</mn><mo>×</mo><mn>10</mn></mrow><annotation encoding="application/x-tex">13\\times 10</annotation></semantics></math>';
  const structured =
    '<math alttext="T_{s\\to s^{\\prime}}" display="inline"><semantics><msub><mi>T</mi><mrow><mi>s</mi><mo>→</mo><msup><mi>s</mi><mo>′</mo></msup></mrow></msub><annotation encoding="application/x-tex">T_{s\\to s^{\\prime}}</annotation></semantics></math>';
  const html = `<html><head><title>Paper</title></head><body><article><h2>Rule of thumb</h2><p>${"Background on grids. ".repeat(20)}</p><p>This means that the rule of thumb gives that a ${simple} grid yields the most flexible model with an acceptable model error. The transition matrix ${structured} is estimated from data.</p></article></body></html>`;

  it("keeps one form of each formula", () => {
    const { text } = extractPage(html, "https://arxiv.org/html/2511.09457");
    expect(text).toContain("a 13×10 grid yields");
    expect(text).not.toContain("13×1013");
    expect(text).toContain("`T_{s\\to s^{\\prime}}`");
  });

  it("matches a quote that contains maths exactly", () => {
    const { text } = extractPage(html, "https://arxiv.org/html/2511.09457");
    expect(findQuote(text, "the rule of thumb gives that a 13×10 grid yields the most flexible model").kind).toBe("exact");
  });
});

describe("sections", () => {
  it("splits at headings outside code fences", () => {
    const sections = splitSections("intro\n\n## A\n\ntext\n\n```\n# not a heading\n```\n\n### B\n\nmore");
    expect(sections.map((s) => s.heading)).toEqual(["(start)", "A", "B"]);
    expect(sections[1].text).toContain("# not a heading");
  });

  it("cuts an over-long section into numbered parts", () => {
    const parts = splitLongSection({ heading: "References", level: 2, text: Array(10).fill("y".repeat(30)).join("\n\n") }, 100);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((part) => part.text.length <= 100)).toBe(true);
    expect(parts[1].heading).toMatch(/References \(part 2 of \d+\)/);
  });
});
