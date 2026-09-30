# AGENTS.md — football-docs

MCP server that serves searchable football data provider documentation to AI coding
agents. Think "Context7 for football data".

- Repo: github.com/withqwerty/football-docs
- npm: `football-docs` (bin entry `bin/serve.js`)
- MCP name: `io.github.withqwerty/football-docs`

## What this repo does

Crawls provider documentation (StatsBomb, Opta, Wyscout, kloppy, SportMonks and
others) into markdown files with provenance frontmatter, ingests them into a SQLite
FTS index (`data/docs.db`), and exposes MCP tools over it: `search_docs`,
`resolve_provider_id`, `get_provider_docs`, `list_providers`, `compare_providers`,
`request_update` and `resolve_entity`.

See the README's "Indexed providers" table for the current corpus size — it is
regenerated on each release and this file is not kept in lockstep with it.

## Layout

| Path | Purpose |
|------|---------|
| `src/index.ts` | MCP server entry (stdio transport) |
| `src/tools.ts` | Tool implementations |
| `src/data-format.ts` | Index schema, `meta` table, validation, `DATA_SCHEMA_VERSION` and `MIN_SERVER_VERSION` |
| `src/data-source.ts` | Chooses the index to open: bundled, downloaded or pinned |
| `src/data-update.ts` | Daily background check for a newer index on the `data-latest` release |
| `src/data-signing.ts` | Trusted ed25519 keys and manifest signature checks |
| `src/crawl.ts` | Crawl pipeline (llms.txt > ReadTheDocs > GitHub README discovery) |
| `src/ingest.ts` | Rebuilds `data/docs.db` FTS index from `docs/` markdown |
| `src/discover.ts` | Source probing without crawling |
| `src/provider-truth.ts` | Validates docs against package/spec ground truth |
| `src/impect-truth.ts` | Validates Impect docs against the open-data repository |
| `src/statsbomb-truth.ts` | Validates StatsBomb ID tables against a sample of the open data |
| `src/opta-truth.ts` | Holds Opta ID tables to the hand-checked `data/opta-truth.json` |
| `src/sportmonks-truth.ts` | Holds SportMonks ID tables to its published definitions |
| `src/__tests__/` | Vitest tests |
| `scripts/` | Ground-truth generators (Python), live checks, and the data-release scripts (`write-data-manifest.mjs`, `check-data-compat.mjs`) |
| `bin/serve.js` | npm bin entry — launches compiled `dist/index.js` |
| `docs/<provider>/` | Markdown per provider, with provenance frontmatter |
| `specs/` | Public vendor OpenAPI snapshots — see `specs/README.md` |
| `data/docs.db` | SQLite FTS index (shipped with the package) |
| `data/provider-truth/` | Generated ground truth for doc validation |
| `providers.json` | Provider registry — doc sources, access level, crawl config, `exclude_categories`, `llms_indexes`, `exclude_sections` |
| `server.json` | MCP registry manifest |

## Commands

```bash
pnpm dev                              # run MCP server via tsx (local dev)
pnpm build                            # tsc -> dist/ (runs check first)
pnpm check                            # tsc --noEmit
pnpm test                             # vitest run
pnpm lint                             # biome check src/
pnpm lint:fix                         # biome check --write src/

# Maintainer workflows
pnpm discover                         # probe sources without crawling
pnpm crawl                            # crawl all providers
pnpm crawl -- --provider kloppy       # crawl one provider
pnpm ingest                           # rebuild data/docs.db from docs/
pnpm ingest -- --provider kloppy      # incremental re-ingest
pnpm provider:truth                   # regenerate package ground truth (python3.11)
pnpm openapi:truth                    # regenerate spec-derived ground truth
pnpm impect:truth                     # regenerate Impect open-data ground truth
pnpm statsbomb:truth                  # regenerate StatsBomb ID ground truth from a sample of open data
pnpm check:upstream                   # check packages, specs and live sources against upstream (run before a release)
```

Node >= 22.13 (the index uses the built-in `node:sqlite`). Package manager is pnpm. Linter is Biome (not ESLint).

## Corpus scope

A vendor's docs site often carries pages that are not football data
documentation — IDE and assistant setup guides, prompt catalogues, navigation
indexes. STRATEGY.md keeps those out. List them in the provider's
`exclude_categories` in `providers.json` rather than deleting the files after a
crawl, so the next crawl does not put them back.

## Provenance

Every crawled doc carries frontmatter: source URL, source type (llms.txt / rtd /
github), upstream version, crawl timestamp. This is surfaced in `search_docs`
results so agents can tell curated content from upstream docs. Don't strip this
frontmatter when editing `docs/<provider>/*.md` by hand.

## Accuracy rules

Documentation that is confidently wrong is worse than no documentation, because the
agent consuming it has no way to tell. Two rules follow:

1. **Never write a provider fact from memory.** Enum values, ID mappings, field
   names and endpoint paths must come from the provider's own source — an
   installable package, a published spec, or their open data. Where that source
   exists, the test suite checks the docs against it and will fail the build on an
   invented value. See "Documentation validation" in the README.
2. **State what the source actually shows.** If a source only covers one season, one
   version or one surface, say so in the doc rather than generalising.

## What must not go in this repo

This is a public repository. Keep out:

- Credentials, API keys, tokens and customer payloads.
- Private or licensed data extracts, and anything from a private sibling project —
  including internal ticket references, local file paths and internal tooling names.
- Vendor material a licence does not permit reproducing. Where a fact can be derived
  instead, derive it: `scripts/gen_openapi_truth.py` exists so validation does not
  depend on keeping a vendor's file.

Provider identity notes belong here only as descriptive, publicly stated facts about
ID fields and access shape.

## Gotchas

- `CLAUDE.md` and `.context/` are gitignored. `AGENTS.md` is **not** — it is public,
  so treat it as published.
- **Merging a change to `docs/` or `providers.json` ships it.** `data.yml` publishes
  the rebuilt index to the `data-latest` release, and installed servers use it
  within about a day, with no npm release. Treat a doc PR's merge as its release.
  The manifest is signed with a key only `main` can use; servers never read an
  unsigned one. Never print, commit or move the `DATA_SIGNING_KEY` secret.
- `data/docs.db` ships with the npm package (see `files` in `package.json`) —
  rebuilding it with `pnpm ingest` changes what end users get on the next publish.
  Commit it rebuilt: a test checks that its `meta.providers_json` matches
  `providers.json`.
- Changing `SCHEMA_SQL` needs `DATA_SCHEMA_VERSION` raised; data that needs new
  server code needs `MIN_SERVER_VERSION` raised. Both need an npm release before
  the data can reach anyone. See README "How doc changes reach users".
  The tests check chunk counts, not chunk text, so a wrong index can still pass CI.
  When a PR changes `data/docs.db`, rebuild it yourself and compare the rows.
- When a doc in `docs/free-sources/` changes how to fetch the data, change its check
  in `scripts/check_free_sources_live.py` in the same commit and run the script.
  CI does not run it; `pnpm check:upstream` does, before a release.
- SQLite access goes through `src/sqlite.ts`, which wraps Node's built-in
  `node:sqlite`. Do not add a native SQLite addon back: `npx` shares one cache
  between Node versions, and an addon built for one Node ABI fails under another.
- Each Python ground-truth package needs its own venv; co-installing makes pip
  silently downgrade conflicting versions.
