# AGENTS.md - football-docs (local, gitignored)

MCP server that serves searchable football data provider documentation to AI coding agents. Think "Context7 for football data".

- Repo: github.com/withqwerty/football-docs
- npm: `football-docs` (bin entry `bin/serve.js`)
- MCP name: `io.github.withqwerty/football-docs`
- Related repos: `../reep` (public entity register), `../reep-custom` (private match scripts)

## What this repo does

Crawls provider documentation (StatsBomb, Opta, Wyscout, kloppy, SportMonks, etc.) into markdown files with provenance frontmatter, ingests them into a SQLite FTS index (`data/docs.db`), and exposes four MCP tools: `search_docs`, `list_providers`, `compare_providers`, `request_update`.

Currently: **640 searchable chunks across 10 providers** (StatsBomb, kloppy, SportMonks, databallpy, mplsoccer, Wyscout, Free sources, soccerdata, Opta, socceraction).

## Layout

| Path | Purpose |
|------|---------|
| `src/index.ts` | MCP server entry (stdio transport) |
| `src/crawl.ts` | Crawl pipeline (llms.txt > ReadTheDocs > GitHub README discovery) |
| `src/ingest.ts` | Rebuilds `data/docs.db` FTS index from `docs/` markdown |
| `src/discover.ts` | Source probing without crawling |
| `src/http.ts` | Shared HTTP client |
| `src/__tests__/` | Vitest tests |
| `bin/serve.js` | npm bin entry — launches compiled `dist/index.js` |
| `docs/<provider>/` | Crawled markdown per provider with provenance frontmatter |
| `data/docs.db` | SQLite FTS index (shipped with the package) |
| `providers.json` | Provider registry — doc sources, priorities, crawl config |
| `server.json` | MCP registry manifest |

## Commands

```bash
pnpm dev                              # run MCP server via tsx (local dev)
pnpm build                            # tsc -> dist/ (runs check first)
pnpm check                            # tsc --noEmit
pnpm test                             # vitest run
pnpm lint                             # biome check src/
pnpm lint:fix                         # biome check --write src/

# Crawl pipeline (maintainer workflow)
pnpm discover                         # probe sources without crawling
pnpm crawl                            # crawl all providers
pnpm crawl -- --provider kloppy       # crawl one provider
pnpm ingest                           # rebuild data/docs.db from docs/
pnpm ingest -- --provider kloppy      # incremental re-ingest
```

Node >= 20. Package manager is pnpm. Linter is Biome (not ESLint).

## Provenance

Every crawled doc carries frontmatter: source URL, source type (llms.txt / rtd / github), upstream version, crawl timestamp. This is surfaced in `search_docs` results so agents can tell curated content from upstream docs. Don't strip this frontmatter when editing `docs/<provider>/*.md` by hand.

## Wishlist providers (from README)

High priority: FPL, API-Football. Medium: Football-data.org, TheSportsDB, WhoScored, Sofascore. WhoScored is based on Opta F24 — can partially derive from existing Opta docs.

## Relationship to reep / reep-custom

These are three sibling repos with different jobs:

- **reep** — the entity register (IDs, names, DOB, provider cross-references). Answers "who is this player?"
- **reep-custom** — private match scripts that populate `custom_ids` in reep's D1. Answers "how do I bridge provider X to reep?"
- **football-docs** (this repo) — provider documentation index. Answers "how does provider X structure its data?"

When working in reep or reep-custom and you need to understand a provider's data model, event types, qualifier IDs, or API surface, use the `mcp__plugin_nutmeg_football-docs__search_docs` tool — don't guess from training data. football-docs was built specifically to solve that class of mistake.

Conversely, when working in this repo (football-docs) and you need to know which providers actually have ID mappings in the reep register, check `../reep-custom/AGENTS.md` for the live custom_ids provider list.

## Gotchas

- `AGENTS.md` (this file) is gitignored. Safe to add personal notes.
- `.context/` is gitignored (review artifacts).
- `data/docs.db` is shipped with the npm package (see `files` in `package.json`) — rebuilding it with `pnpm ingest` changes what end users get on next publish.
- `better-sqlite3` is in `onlyBuiltDependencies` — if install fails, check native build toolchain.
