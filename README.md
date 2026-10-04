# football-docs

Searchable football data provider and tooling documentation for AI coding agents. Like [Context7](https://context7.com) for football data.

**Who it's for:** Developers and analysts who use AI coding tools (Claude Code, Cursor, VS Code Copilot) to work with football data. Works with any tool that supports MCP.

**What it does:** Gives your AI agent a searchable index of documentation for 30 football data providers and tools — event types, qualifier IDs, coordinate systems, API endpoints, data models, identity surfaces, and cross-provider comparisons for the data providers (StatsBomb, Opta, Wyscout, Impect, SkillCorner, Sportradar, TheSportsDB, FMDB Pro, TransferRoom, and more), the open-source libraries people build with (kloppy, mplsoccer, socceraction, soccerdata, floodlight, fast-forward, unravelsports, and more), and the APIs of wearable and sports-science vendors (STATSports, Firstbeat, Hawkin Dynamics, VALD). Your agent looks up the real docs instead of guessing from training data.

**Why not just let the AI figure it out?** LLMs get football data specifics wrong constantly — Opta qualifier IDs, StatsBomb coordinate ranges, API endpoint URLs, library method signatures. These are mutable facts that change across versions. football-docs gives the agent verified, sourced documentation with provenance tracking so you know where every answer came from.

## Strategy

football-docs is intended to be a community-owned, source-transparent Context7
for football data. The public operating contract is in
[STRATEGY.md](STRATEGY.md): what belongs here, what must stay out, how we handle
public-safe provider facts, and how contributors should prove retrieval quality.

## Provider identity facts

football-docs is the public source for provider identity-surface facts: access
shape, ID schemes, matching fields, provider quirks, and provenance rules.
Curated provider identity notes belong here when they can be stated as public
facts about the provider. They should say whether a fact comes from public docs,
public page evidence, licensed feed shape, or a reviewed public-safe
observation, and must not include credentials, local paths, internal tooling
details, or restricted payloads from any private project.

MCP ([Model Context Protocol](https://modelcontextprotocol.io)) is a standard for connecting AI coding tools to external data sources.

## Quick start

The server needs Node.js 22.13 or newer. It uses Node's built-in SQLite, so no
native module is compiled at install time.

### Claude Code

```bash
claude mcp add football-docs -- npx -y football-docs
```

### Cursor

Settings → MCP → Add server. Use this config:

```json
{
  "mcpServers": {
    "football-docs": {
      "command": "npx",
      "args": ["-y", "football-docs"]
    }
  }
}
```

### VS Code / Copilot

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "football-docs": {
      "command": "npx",
      "args": ["-y", "football-docs"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "football-docs": {
      "command": "npx",
      "args": ["-y", "football-docs"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `search_docs` | Full-text search across all provider docs. Filter by provider. Results include provenance (source URL, version), mark partial matches, name query terms that no indexed doc mentions, and say when a query names a provider that is not indexed (the `not_indexed` list in `providers.json` gives the reason). |
| `resolve_provider_id` | Resolve provider names and aliases to canonical indexed provider keys before searching. |
| `get_provider_docs` | Retrieve docs for a resolved provider, optionally filtered by topic or category. |
| `list_providers` | List all indexed providers and their doc coverage. |
| `compare_providers` | Compare how different providers handle the same concept. |
| `request_update` | Request a new provider, flag outdated docs, or suggest a better doc source. Queues locally and points to the matching public GitHub issue template. |
| `resolve_entity` | Map a player, coach, referee, team, competition, season, stage or match to its IDs at every provider through the [Reep register](https://reep.football). Uses a local copy of the free register (`REEP_DUCKDB_PATH`), else the Reep API (`REEP_API_KEY`; keys are issued by hand on request to getintouch+nutmeg@withqwerty.com, with no self-service sign-up), else returns setup steps and a DuckDB query. See [Reep through football-docs](docs/reep/overview.md#using-reep-through-football-docs). |
| `search_papers` | Search scholarly papers on football analytics and sport science in [OpenAlex](https://openalex.org) (title, abstract and full text), [arXiv](https://arxiv.org) and [SportRxiv](https://sportrxiv.org), and, when asked, your Zotero library. See [Papers and web sources](#papers-and-web-sources). |
| `get_paper` | Look up one paper by DOI, arXiv ID, OpenAlex ID or Zotero item: authors, date, venue, all IDs, licence, open copies with their licences, abstract and a citation line. |
| `get_web_source` | Read a public web page or PDF (a blog post, newsletter, club or vendor article, or an author's copy of a paper) as text, with its author, date, licence and Wayback Machine snapshots. Long pages come back by section. |
| `read_paper` | Read a paper: the full text of an open copy, by section, with its licence; or the outline and short passages of a paper you supplied. Kept in your library, so a second read sends no request. |
| `match_quote` | Check that a quote appears in a paper or web page: exact, normalised, close (with a score) or none, with the section, page and a W3C text quote selector. |
| `add_local_paper` | Add a PDF you have to your library, for papers with no open copy. |
| `forget_paper` | Remove one paper from your library. |
| `purge_cache` | Delete your whole paper library (needs `confirm: true`). |

Provider filters use the indexed provider keys shown by `list_providers`, but common aliases are accepted. Examples: `fbref`, `understat`, `ClubElo`, `football-data.co.uk`, and `engsoccerdata` search `free-sources`; `Sofascore` searches `soccerdata`; `ESPN`, `ESPN FC`, and `espn-soccer` search `espn`; `FMDB` searches `fmdb-pro`; `Transfer Room` searches `transferroom`; `Hudl Wyscout` searches `wyscout`; `Stats Perform` / `Opta F24` / `WhoScored` search `opta`; `Metrica`, `Sportec` / `DFL`, and `TRACAB` search `databallpy`; `Second Spectrum` searches `kloppy`; `Hawk-Eye`, `SciSports`, `Signality`, `Respovision`, `GradientSports` and `OptaVision` search `fast-forward`; `unravel` searches `unravelsports`; `SportRadar API` / `Soccer Extended` search `sportradar`; `Sonra` / `Apex` search `statsports`; `Hawkin` searches `hawkin-dynamics`; `ForceDecks` / `NordBord` / `ForceFrame` search `vald`; `The Sports DB` / `TSDB` search `thesportsdb`; `StatsBomb Open Data` searches `statsbomb`.

## How the index stays current

The package ships a docs index, but doc fixes do not wait for a new package
version. Once a day at most, the server checks the
[`data-latest`](https://github.com/withqwerty/football-docs/releases/tag/data-latest)
release of this repository for a newer index built from `main`:

- It reads a small signed manifest (`manifest-v1-signed.json`) and, only when that
  names a newer build, downloads the index (about 6 MB).
- It accepts the manifest only if its ed25519 signature verifies against a public
  key shipped in the package (`src/data-signing.ts`). The manifest carries the
  index's size and SHA-256, so the signature covers the index too.
- It checks the download's size and SHA-256, its SQLite integrity, its exact
  schema and its metadata before using it, and keeps the one it had on any failure.
- It stores downloads in `$XDG_DATA_HOME/football-docs/data/` (by default
  `~/.local/share/football-docs/data/`). The next tool call uses the new file; no
  restart is needed.
- It runs in the background after start-up and never delays a tool call.
  `list_providers` ends with the build time of the index in use and whether it is
  bundled or downloaded.

Privacy: the check is one HTTPS request a day to GitHub, plus the download when
there is one. No search queries or other usage data are sent.

Settings, as environment variables in the server's MCP configuration:

- `FOOTBALL_DOCS_DATA=bundled`: use only the index inside the package. No update
  check, no downloads. (This does not turn off the paper tools; see
  `FOOTBALL_DOCS_PAPERS` under [Papers and web sources](#papers-and-web-sources).)
- `FOOTBALL_DOCS_DATA=auto`: the default for an installed package. Check daily and
  use the newest valid index.
- `FOOTBALL_DOCS_DB_PATH=<file>`: use exactly this index file.
- `FOOTBALL_DOCS_DATA_BASE_URL=<url>`: read the manifest and index from a mirror
  (HTTPS only).

Offline, or behind a proxy that Node's built-in `fetch` does not use, the check
fails quietly and the server keeps the index it has. Under CI (`CI` set) the check
does not run. A server running from a git checkout defaults to `bundled`, so
development and tests always use the working tree's docs.

## Papers and web sources

Many football methods come from papers, and some from blog posts: Karun Singh
introduced expected threat (xT) in a blog post, not a paper. `search_papers`
finds papers and the works that cite an idea; a web search finds the original
post, and `get_web_source` reads it. `get_paper` checks that a reference exists,
`read_paper` reads it, and `match_quote` checks that a quote is in the source.

### Open and paid papers

| Paper | How it gets in | What the tools return |
|---|---|---|
| Open copy: arXiv, an open repository, an open-access publisher, SportRxiv, a public web page | `read_paper` or `get_web_source` finds and reads it | The full text, by section, with its licence |
| A paper you have through a subscription or purchase | You download the PDF and call `add_local_paper`, or keep it in Zotero and use its `zotero:` ID | The outline and passages of at most 200 characters (`FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS`, 50 to 1000) |

football-docs never logs in to a publisher or a library, never holds your
credentials or cookies, and does not use publisher text-mining APIs (their terms
exclude tools like this). When a site answers with a bot check, the tool stops;
download the paper yourself instead.

Zotero: `search_papers` with `sources: ["zotero"]` searches your library, and
`read_paper` reads an item's PDF. Two ways to connect, tried in this order:

1. Zotero on this computer. In Zotero 7, open Settings > Advanced and turn on
   "Allow other applications on this computer to communicate with Zotero". The
   tools then use its local API on port 23119; nothing leaves the machine.
2. The Zotero web API, for when Zotero is not running here (another machine, a
   cloud session). Create a read-only key at
   [zotero.org/settings/keys](https://www.zotero.org/settings/keys) with access
   to your library and its files, and set `ZOTERO_API_KEY` (and optionally
   `ZOTERO_USER_ID`; without it the tools ask the key). It reads only files kept
   in Zotero's own storage, not linked files; for those it uses Zotero's
   full-text index. The key is sent only to api.zotero.org, never to the file
   storage host.

An item saved without its PDF (metadata only) is read by its DOI instead, so
`read_paper` still returns the open copy when there is one.

### Services

The tools call public services at run time. Each reply ends with the services
it asked.

| Service | Used for | Limits |
|---|---|---|
| OpenAlex | Search (title, abstract and full text); DOI and OpenAlex ID lookups; open copies | 1000 credits a day without a key: a search costs 10, a lookup costs nothing. A free key from [openalex.org/settings/api](https://openalex.org/settings/api) raises it. |
| arXiv | Search (title, abstract, authors); arXiv ID lookups with the paper's licence; the paper's HTML or PDF | One request every three seconds to the API; the tool waits its turn. |
| SportRxiv | Search in a local copy of its OAI feed; preprint PDFs | The first search downloads the feed (under 1000 records); after a week, the next search asks only for changes. |
| Crossref | DOI lookups that OpenAlex does not know | |
| Wayback Machine | The earliest and latest snapshot of a web page; the archived copy when the live page fails | The tool never asks it to save a page. |
| The host of an open copy or web page | The text | Bot checks stop the tool. |

### Your library

- Text the tools read is kept in `$XDG_DATA_HOME/football-docs/papers/` (by
  default `~/.local/share/football-docs/papers/`). On macOS and Linux the folder
  and its files are readable only by you (modes 0700 and 0600); on Windows they
  have the access rules of your user folder. A second read sends no request.
- `forget_paper` removes one paper; `purge_cache` with `confirm: true` deletes
  the whole library and the SportRxiv copy. Neither touches your own files or
  Zotero.
- Nothing in the library goes into this repository, `data/docs.db` or a data
  release. A test fails if a cached paper or any PDF is added to the repository.
- `get_web_source`, `read_paper` and `match_quote` read only public `http` and
  `https` addresses. They refuse names that resolve to loopback, private or
  link-local addresses, also after a redirect.
- `add_local_paper` reads only PDF files, given by their full path.

### Settings

As environment variables in the server's MCP configuration:

- `FOOTBALL_DOCS_PAPERS=off`: send no paper or web request, including to the
  Zotero web API. Your library, files you add and Zotero on this computer still
  work. The provider-doc tools never
  call these services.
- `ZOTERO_API_KEY=<key>` and `ZOTERO_USER_ID=<number>`: a read-only Zotero web
  API key, for reading Zotero when the app is not running here. The key can also
  go in the keychain, as for OpenAlex below.
- `FOOTBALL_DOCS_PAPERS_PASSAGE_CHARS=<n>`: the longest passage returned from a
  paper you supplied, 50 to 1000 characters (default 200).
- `OPENALEX_API_KEY=<key>`: your OpenAlex key. On macOS and Linux you can keep it
  in the system keychain instead of the environment:
  - macOS: `security add-generic-password -s football-docs -a OPENALEX_API_KEY -w <key>`
  - Linux (needs `secret-tool`, from libsecret): `secret-tool store --label=football-docs service football-docs key OPENALEX_API_KEY`
  - Windows: use the environment variable; the tools do not read Windows Credential Manager.

## Example queries

- "What is Opta qualifier 214?" (big chance)
- "How does StatsBomb represent shot events?"
- "Compare Opta and Wyscout coordinate systems"
- "What player ID fields does Transfermarkt expose?"
- "Does SportMonks have xG data?"
- "What event types does kloppy map to GenericEvent?"
- "How does SPADL represent a tackle?"
- "Who introduced expected threat (xT)? Cite the original." (a web search finds the post, `get_web_source` reads it, `match_quote` checks the quote, `search_papers` finds the papers that cite it)
- "How does VAEP define the value of an action? Quote the paper." (`read_paper` on arXiv 1802.07127, then `match_quote`)

## Indexed providers

| Provider | Chunks | Categories |
|----------|--------|------------|
| fast-forward | 250 | overview, getting-started, data-model, coordinate-system, orientations, layouts, transformations, distributed-compute, api-reference, 12 provider format pages |
| StatsBomb | 244 | event-types, data-model, coordinate-system, api-access, api-endpoints, charting-lineups, xg-model, iq-metrics, player/team stats, player-mapping, identity-surfaces, data-provenance |
| unravelsports | 202 | overview, installation, quickstart, concepts, graph converters, pressing intensity, formation detection, models, utils, american-football |
| Wyscout | 165 | event-types, data-model, coordinate-system, api-access, api-endpoints, charting-analysis-metrics, glossary, identity-surfaces, data-provenance |
| kloppy | 126 | data-model, usage, provider-mapping, tracking-rendering, event-derived-metrics |
| floodlight | 144 | core data objects, io parsers (Tracab, DFL, Kinexon, Opta, SkillCorner, StatsBomb, StatsPerform, Second Spectrum), transforms, metrics, models, visualisation, guides |
| SportMonks | 568 | full v3 endpoint reference (fixtures, livescores, leagues, seasons, states, types, statistics, brackets), syntax and includes, filtering, rate limits, error codes, changelog, plus curated event-types, data-model, api-access, charting-season-stories, identity-surfaces, data-provenance |
| databallpy | 63 | data-model, overview, usage |
| mplsoccer | 65 | overview, pitch-types, visualizations |
| Impect | 79 | overview, data-model, event-types, coordinate-system, concepts, kpi-definitions, identity-surfaces, data-provenance |
| SkillCorner | 51 | api-access, api-endpoints, data-model, physical-data, coordinate-system, concepts, identity-surfaces, data-provenance |
| Free sources | 69 | overview, fbref, understat, football-data-columns, contextual-story-joins, xg-timelines, data-provenance |
| soccerdata | 40 | overview, data-sources, usage |
| TransferRoom | 45 | api-access, api-endpoints, charting-availability, data-model, identity-surfaces, data-provenance |
| Opta | 73 | event-types, qualifiers, coordinate-system, api-access, charting-game-state, charting-lineups, charting-passmaps, charting-set-pieces, charting-shot-placement, identity-surfaces, data-provenance |
| FMDB Pro | 37 | api-access, api-endpoints, data-model, identity-surfaces, data-provenance |
| Sportradar | 481 | integration guide (API basics, coverage tiers, ID handling, match status, update frequencies, push, historical data), Soccer Extended v4 endpoint reference with data-point tables, FAQ, plus curated api-access, api-endpoints, data-model, charting-and-stories, integration-notes, data-provenance |
| socceraction | 34 | SPADL format, VAEP, Expected Threat |
| BeSoccer | 16 | api-access, api-endpoints, data-provenance |
| Driblab | 32 | api-access, api-endpoints, data-model, data-provenance |
| ESPN | 21 | api-access, scoreboard, match-summary, teams-and-standings, identity-and-coverage |
| Reep | 29 | overview, identity-and-ids, download-duckdb-csv, api, data-provenance |
| TheSportsDB | 20 | api-access, api-endpoints, livescore, identity-surfaces, data-provenance |
| FotMob | 5 | identity-surfaces, data-provenance |
| Soccerdonna | 5 | identity-surfaces, data-provenance |
| Transfermarkt | 5 | identity-surfaces, data-provenance |
| STATSports | 70 | api-access, api-endpoints, data-model, drill-kpi-metrics (all 319 DrillKpiV7 fields), identity-surfaces, data-provenance |
| Firstbeat | 79 | api-access, api-endpoints, data-model, variables (100 scalars, 17 time series), identity-surfaces, data-provenance |
| Hawkin Dynamics | 69 | api-access, api-endpoints, data-model, test-metrics (535 metrics across 13 test types), identity-surfaces, data-provenance |
| VALD | 318 | api-access, api-endpoints, per-product endpoints and schemas (tenants, profiles, forcedecks, nordbord, forceframe, smartspeed, dynamo, humantrak), identity-surfaces, data-provenance |

**3,405 searchable chunks** across 30 providers and tools.

STATSports, Firstbeat, Hawkin Dynamics and VALD sell wearables and testing devices.
Their APIs return a customer's own athlete data, which includes personal and health
data. The docs describe the API surface only: endpoints, field names, types and
units as each vendor's public spec or reference page states them. They contain no
athlete data, and none of these vendors' IDs join to a football data provider's IDs.

ESPN coverage consists of curated, dated observations of ESPN-hosted soccer
endpoints, checked for eng.1 and esp.1. These observations are not an official API
contract or an open-data licence. See [ESPN access notes](docs/espn/api-access.md)
for source status and [coverage notes](docs/espn/identity-and-coverage.md) for the
tested requests and limitations.

> **Impect** documentation is built solely from the public
> [ImpectAPI/open-data](https://github.com/ImpectAPI/open-data) repository — a
> static Bundesliga 2023/24 snapshot, representative of Impect's structure and
> metric definitions rather than a complete or current mirror. Impect's
> commercial API is deliberately not documented here. Every enum value, KPI name
> and field name in `docs/impect/` is validated against that repository in CI
> (`pnpm impect:truth`, `src/__tests__/impect-open-data-validation.test.ts`).
> Data source: **Impect**; use is subject to the repository's own Terms of Use.

## Documentation validation

Docs for AI agents are only useful if they are correct, and prose about an API is
exactly the kind of thing that drifts or gets invented. Where a machine-readable
source of truth exists, this repo checks the docs against it in CI rather than
trusting them.

| Providers | Ground truth | Checked by |
|---|---|---|
| kloppy, socceraction, soccerdata, mplsoccer, floodlight, databallpy, skillcorner, fast-forward, unravelsports | The installed package itself — enum members, importable symbols, class constants, `Literal` parameter vocabularies | `src/__tests__/provider-truth.test.ts` |
| Wyscout, SkillCorner, FMDB Pro, Sportradar | The vendor's own publicly published OpenAPI spec — endpoint paths and methods | `src/__tests__/provider-truth.test.ts` |
| BeSoccer | The vendor's published Postman collection — request vocabulary and parameters | `src/__tests__/provider-truth.test.ts` |
| Driblab | The vendor's published API guide — endpoint paths and methods. Field and group names are not in CI: the guide disagrees with the live API on them, so the docs follow the live API, checked by hand on 2026-09-22 | `src/__tests__/provider-truth.test.ts` |
| Impect | The public [open-data](https://github.com/ImpectAPI/open-data) repository | `src/__tests__/impect-open-data-validation.test.ts` |
| StatsBomb | ID and name pairs observed in a sample of the public [open data](https://github.com/statsbomb/open-data) (three matches per competition-season, at a pinned commit). IDs the sample lacks must be listed in both the Open Data Events specification and kloppy's parser. Regenerate with `pnpm statsbomb:truth` | `src/__tests__/statsbomb-truth.test.ts` |
| Opta | Stats Perform's F24 appendices, which have no machine-readable form. `data/opta-truth.json` holds each ID the docs use, with its label, checked by hand. The test also rejects the wrong meanings earlier docs gave some IDs (`WRONG_MEANINGS` in `src/opta-truth.ts`) | `src/__tests__/opta-truth.test.ts` |
| SportMonks | Type and state IDs as SportMonks publishes them on its definitions pages and in the types spreadsheet linked from its Types page (`data/sportmonks-types-truth.json`, fetched 2026-09-30). Not the full list: the complete one needs an API key | `src/__tests__/sportmonks-truth.test.ts` |
| Reep | The public OpenAPI spec (endpoint paths and methods), and one release's manifest and column schema (CSV table list, columns used in the SQL examples, licence and exclusions) | `src/__tests__/provider-truth.test.ts`, `src/__tests__/reep.test.ts` |
| STATSports, Firstbeat, Hawkin Dynamics, VALD | Each vendor's public OpenAPI spec (STATSports v5 to v7, Firstbeat's `openapi.json`, the document inline on Hawkin's API reference page, VALD's eight product specs) — endpoint paths and methods, and every field name in the docs' schema tables. The STATSports `DrillKpiV7` table and the Hawkin metric tables must list the spec's and `metrics.json`'s entries in full. Firstbeat's variable list has no machine-readable source and is copied by hand from its public variables page | `src/__tests__/provider-truth.test.ts`, `src/__tests__/wearable-vendors.test.ts` |

ESPN has a separate observation check in `src/__tests__/espn.test.ts`. It validates
documented endpoint paths, field-table names and types, and source URLs against
`data/espn-observations.json`. These are selected structural observations, not a
published specification. CI reads them offline and does not contact ESPN.
Refresh manually with `python3 scripts/observe_espn.py --scheduled-date YYYYMMDD`,
choosing a future fixture date and using permitted access. The script stores no
raw responses. Review the diff, update the docs and dates, then rebuild the index.

Reep's snapshots age weekly, as a new release is cut each week. Run
`python3 scripts/check_reep_live.py` to check every download link and list what
has changed since the snapshots; the refresh steps are in [specs/README.md](specs/README.md#reep).

`pnpm check:upstream` runs every upstream check in one report: pinned package
versions against PyPI, npm and GitHub, each spec snapshot against its public URL,
BeSoccer's and Driblab's truth regenerated from their Postman collection and Notion
page, and the free-source and Reep live checks below. It runs by hand, never in CI, and
lists what to review.

Free sources have no spec, and they tend to fail quietly: a page still answers
200 after the data has gone. Run `python3 scripts/check_free_sources_live.py` to
request each access path documented in `docs/free-sources/` and check that the
response still carries the data the doc describes. When a doc's access recipe
changes, change its check in the same commit.

Truth files live in `data/provider-truth/` and are generated, not hand-written:

```bash
pnpm provider:truth      # rebuild every package truth file (needs python3.11)
pnpm openapi:truth       # rebuild every spec-derived truth file
```

The specs those derive from are snapshots of **publicly published, unauthenticated**
vendor documentation. Source URLs, fetch dates and refresh instructions are in
[`specs/README.md`](specs/README.md). Wyscout's v3 and v4 specifications merge into
one truth file, because its docs span both. The v2 legacy specification is no
longer mirrored: the docs describe v3 and v4, and no documented fact derives from
the legacy surface.

Each package gets its own pinned venv — co-installing them makes pip silently
downgrade conflicting versions, which would produce truth that disagrees with the
docs. Bump a pin in `scripts/gen_all_truth.sh` and the matching `version` in
`providers.json` together, then re-run and fix whatever the tests flag.

A doc that names an enum member or importable symbol which does not exist in the
real package fails the build. `scripts/gen_openapi_truth.py` derives the same kind
of facts from a vendor OpenAPI spec, for providers documented that way.

Not every vocabulary is an enum. fast-forward's coordinate systems, orientations
and layouts are lowercase strings on `Literal`-annotated parameters, so the truth
files also record what each parameter accepts, and a doc writing
`coordinates="statsbomb"` fails the same way an invented enum member would.

## Contributing

Contributions are welcome from everyone. There are three ways to help:

1. **Open an issue** — [request a new provider](https://github.com/withqwerty/football-docs/issues/new/choose), [flag outdated docs](https://github.com/withqwerty/football-docs/issues/new/choose), or [suggest a better doc source](https://github.com/withqwerty/football-docs/issues/new/choose)
2. **Use the `request_update` tool** — AI agents can flag outdated or missing docs directly via the MCP server, which queues requests locally and points to the matching public GitHub issue template
3. **Open a PR** — fix errors, add new providers, or improve existing docs

**You don't need to be an expert.** See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

## For maintainers

### Crawl pipeline

Provider doc sources are tracked in `providers.json`. The crawl pipeline discovers the best doc source (llms.txt > ReadTheDocs > GitHub README) and writes markdown with provenance frontmatter.

Two registry fields narrow a crawl. `llms_indexes` lists llms.txt files that link to pages rather than contain them; the crawler follows those links (and nested indexes) to each page's markdown copy instead of running discovery. Sportradar uses it for its integration guide and Soccer Extended reference. `exclude_categories` skips whole pages, and `exclude_sections` drops named `##`/`###` sections from pages that are otherwise kept, for content INCLUSION.md keeps out, such as odds. Pages crawled through an index are not byte-for-byte copies: the crawler drops the OpenAPI definition ReadMe appends and SVG diagrams, cuts example payloads over 3 KB with a note, replaces a data-point table repeated from an earlier page with a line naming that page, and marks a split long section "(continued)". It adds no other text.

```bash
npm run discover                        # probe sources without crawling
npm run crawl                           # crawl all providers with sources
npm run crawl -- --provider kloppy      # crawl one provider
npm run ingest                          # rebuild search index from docs/
npm run ingest -- --provider kloppy     # re-ingest one provider (incremental)
```

Each crawled doc carries provenance metadata (source URL, source type, upstream version, crawl timestamp) that is surfaced in search results, so agents can distinguish between curated content and upstream documentation.

### How doc changes reach users

A merge to `main` that touches `docs/` or `providers.json` runs
`.github/workflows/data.yml`, which rebuilds the index, runs the tests against it,
checks that the **published** server can use it (`scripts/check-data-compat.mjs`),
and publishes it to the `data-latest` release. Installed servers pick it up within
about a day, including servers that have been running for days (they check again
every six hours, at most once a day). Merging a doc PR is therefore also shipping it; there is no later step at
which to stop it. To undo a bad doc change, revert it on `main`, which publishes a
newer build.

**What the signature guarantees.** The publish job signs the manifest with a key
held only in the `data-publish` environment, whose deployment policy allows only
`main`. A manifest that verifies was therefore produced by `data.yml` running on
`main`. Replacing release assets by hand, or from a workflow on another branch,
cannot produce one. It does **not** mean anyone reviewed the change: `main`
accepts a PR with no approvals, so anyone who can merge to `main` can still ship
data. Requiring approvals on `main`, or required reviewers on the `data-publish`
environment (which makes every doc publish wait for a person), would close that
too.

**Rotating the key:** generate a new ed25519 pair, add its public key to
`TRUSTED_KEYS` in `src/data-signing.ts`, release, then replace the
`DATA_SIGNING_KEY` environment secret and `DATA_SIGNING_PUBLIC_KEY` in `data.yml`.
Drop the old key in a later release. A lost private key is handled the same way.

The index carries its own metadata (`meta` table, `src/data-format.ts`): a schema
version, the oldest server version that can read it, the build stamp and the
provider registry. Two rules follow:

- **Changing the schema** (`SCHEMA_SQL`) needs `DATA_SCHEMA_VERSION` raised and an
  npm release. Servers read only `manifest-v<their schema>.json`, so older servers
  keep their last compatible data rather than breaking.
- **Data that relies on new server code** (for example a new `providers.json` field
  the tools must read) needs `MIN_SERVER_VERSION` raised, and that server released
  first. Until then the compatibility check fails, and no installed server would
  accept the build anyway.

Code changes, including changes to `src/ingest.ts`, still ship only through a
release.

### Cutting a release

**Pushing the tag is the release.** `.github/workflows/release.yml` runs on any
`v*` tag and does the rest: it re-runs the full check suite, creates the GitHub
Release, and publishes to npm.

Before a release, run `pnpm check:upstream` (see "Documentation validation"). It
reports any provider whose package, spec or live access path has moved since the
docs were written, so a release does not ship docs that are already stale. Fix or
note what it lists; a known, tracked failure (an open issue) need not block.

```bash
# 1. Bump the version in package.json and server.json (three fields in total).
#    Land it on main through a pull request, as `chore: release vX.Y.Z`.
#
# 2. Tag the merge commit and push the tag.
git tag -a v0.11.0 -m "v0.11.0"
git push origin v0.11.0
```

3. The release job attaches `site-stats.json` (version, chunk and provider counts,
   tools, per-provider chunks; `pnpm site:stats` prints the same) to the GitHub
   Release. In nutmeg-site, `pnpm football-docs:release` reads it from the latest
   release, rebuilds the football-docs section and saves the announcement card as
   `cards/football-docs-v<version>.png`. Update its "What's new" text, then
   `pnpm deploy` there.

Release notes come from the body of the `chore: release vX.Y.Z` commit, so write
that message as the release notes you want readers to see. The workflow reads it
from the second parent when the tag sits on a merge commit, strips the commit
trailers, and falls back to GitHub's generated notes if the body is empty.

Three properties worth knowing, because each one exists to stop a specific
failure:

- **The tag must match `package.json`.** A mismatch fails the job before
  anything is created or published, so a version can never ship under another
  version's name.
- **The full suite runs again.** A tag can be pushed to any commit, including
  one that never went through a pull request, so the release path cannot assume
  CI already passed on that tree.
- **Re-running is safe.** An existing Release is left alone and an
  already-published version is skipped, so a failed job can simply be re-run.

**There is no npm token in this repository.** Publishing uses npm
[trusted publishing](https://docs.npmjs.com/trusted-publishers): the registry
authenticates the workflow itself over OIDC, against a trust configuration on the
package that names this repository and this workflow file. Publishing rights are
bound to `release.yml` rather than to a secret that would work from anywhere it
leaked to, and there is nothing to rotate.

That trust was configured once, with the npm CLI:

```bash
npm trust github football-docs \
  --repo withqwerty/football-docs \
  --file release.yml \
  --allow-publish
```

`npm trust list football-docs` shows it; `npm trust revoke` removes it. **Renaming
`release.yml`, or publishing from a different workflow, breaks the match** — by
design. Re-point it with `npm trust github ... --file <new-name>` if the file
ever moves.

Trusted publishing generates [provenance](https://docs.npmjs.com/generating-provenance-statements)
automatically, so the tarball on npm is attested to this repository and this
workflow run without the workflow asking for it.

Two consequences worth knowing:

- **The release job runs on Node 24.** Trusted publishing needs npm >= 11.5.1 and
  Node 22 still ships npm 10. Node 24 is in the CI matrix so that a release is
  not the first time the suite meets it.
- **The release job does not cache dependencies.** This is the tree that gets
  published, so it is resolved fresh from the lockfile rather than rehydrated
  from a cache that earlier runs could have poisoned.

Note that `prepublishOnly` runs `pnpm build && pnpm ingest`, which rebuilds
`data/docs.db`. Publishing by hand therefore leaves that file dirty in the
working tree; the content is unchanged, only SQLite's page layout differs, so
`git checkout data/docs.db` clears it.

## License

MIT
