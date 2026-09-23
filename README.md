# football-docs

Searchable football data provider and tooling documentation for AI coding agents. Like [Context7](https://context7.com) for football data.

**Who it's for:** Developers and analysts who use AI coding tools (Claude Code, Cursor, VS Code Copilot) to work with football data. Works with any tool that supports MCP.

**What it does:** Gives your AI agent a searchable index of documentation for 24 football data providers and tools — event types, qualifier IDs, coordinate systems, API endpoints, data models, identity surfaces, and cross-provider comparisons for the data providers (StatsBomb, Opta, Wyscout, Impect, SkillCorner, Sportradar, TheSportsDB, FMDB Pro, TransferRoom, and more), plus the open-source libraries people build with (kloppy, mplsoccer, socceraction, soccerdata, floodlight, fast-forward, unravelsports, and more). Your agent looks up the real docs instead of guessing from training data.

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
| `search_docs` | Full-text search across all provider docs. Filter by provider. Results include provenance (source URL, version). |
| `resolve_provider_id` | Resolve provider names and aliases to canonical indexed provider keys before searching. |
| `get_provider_docs` | Retrieve docs for a resolved provider, optionally filtered by topic or category. |
| `list_providers` | List all indexed providers and their doc coverage. |
| `compare_providers` | Compare how different providers handle the same concept. |
| `request_update` | Request a new provider, flag outdated docs, or suggest a better doc source. Queues locally and points to the matching public GitHub issue template. |
| `resolve_entity` | Map a player, coach, referee, team, competition, season, stage or match to its IDs at every provider through the [Reep register](https://reep.football). Uses a local copy of the free register (`REEP_DUCKDB_PATH`), else the Reep API (`REEP_API_KEY`; keys are issued by hand on request to getintouch+nutmeg@withqwerty.com, with no self-service sign-up), else returns setup steps and a DuckDB query. See [Reep through football-docs](docs/reep/overview.md#using-reep-through-football-docs). |

Provider filters use the indexed provider keys shown by `list_providers`, but common aliases are accepted. Examples: `fbref`, `understat`, `ClubElo`, `football-data.co.uk`, and `engsoccerdata` search `free-sources`; `Sofascore` searches `soccerdata`; `ESPN`, `ESPN FC`, and `espn-soccer` search `espn`; `FMDB` searches `fmdb-pro`; `Transfer Room` searches `transferroom`; `Hudl Wyscout` searches `wyscout`; `Stats Perform` / `Opta F24` / `WhoScored` search `opta`; `Metrica`, `Sportec` / `DFL`, and `TRACAB` search `databallpy`; `Second Spectrum` searches `kloppy`; `Hawk-Eye`, `SciSports`, `Signality`, `Respovision`, `GradientSports` and `OptaVision` search `fast-forward`; `unravel` searches `unravelsports`; `SportRadar API` / `Soccer Extended` search `sportradar`; `The Sports DB` / `TSDB` search `thesportsdb`; `StatsBomb Open Data` searches `statsbomb`.

## Example queries

- "What is Opta qualifier 76?" (big chance)
- "How does StatsBomb represent shot events?"
- "Compare Opta and Wyscout coordinate systems"
- "What player ID fields does Transfermarkt expose?"
- "Does SportMonks have xG data?"
- "What event types does kloppy map to GenericEvent?"
- "How does SPADL represent a tackle?"

## Indexed providers

| Provider | Chunks | Categories |
|----------|--------|------------|
| fast-forward | 250 | overview, getting-started, data-model, coordinate-system, orientations, layouts, transformations, distributed-compute, api-reference, 12 provider format pages |
| StatsBomb | 235 | event-types, data-model, coordinate-system, api-access, api-endpoints, charting-lineups, xg-model, iq-metrics, player/team stats, player-mapping, identity-surfaces |
| unravelsports | 202 | overview, installation, quickstart, concepts, graph converters, pressing intensity, formation detection, models, utils, american-football |
| Wyscout | 163 | event-types, data-model, coordinate-system, api-access, api-endpoints, charting-analysis-metrics, glossary, identity-surfaces |
| kloppy | 126 | data-model, usage, provider-mapping, tracking-rendering, event-derived-metrics |
| floodlight | 144 | core data objects, io parsers (Tracab, DFL, Kinexon, Opta, SkillCorner, StatsBomb, StatsPerform, Second Spectrum), transforms, metrics, models, visualisation, guides |
| SportMonks | 565 | full v3 endpoint reference (fixtures, livescores, leagues, seasons, states, types, statistics, brackets), syntax and includes, filtering, rate limits, error codes, changelog, plus curated event-types, data-model, api-access, charting-season-stories, identity-surfaces |
| databallpy | 63 | data-model, overview, usage |
| mplsoccer | 65 | overview, pitch-types, visualizations |
| Impect | 77 | overview, data-model, event-types, coordinate-system, concepts, kpi-definitions, identity-surfaces |
| SkillCorner | 49 | api-access, api-endpoints, data-model, physical-data, coordinate-system, concepts, identity-surfaces |
| Free sources | 62 | overview, fbref, understat, contextual-story-joins, xg-timelines |
| soccerdata | 40 | overview, data-sources, usage |
| TransferRoom | 43 | api-access, api-endpoints, charting-availability, data-model, identity-surfaces |
| Opta | 71 | event-types, qualifiers, coordinate-system, api-access, charting-game-state, charting-lineups, charting-passmaps, charting-set-pieces, charting-shot-placement, identity-surfaces |
| FMDB Pro | 35 | api-access, api-endpoints, data-model, identity-surfaces |
| Sportradar | 30 | api-access, api-endpoints, data-model, charting-and-stories, integration-notes |
| socceraction | 34 | SPADL format, VAEP, Expected Threat |
| BeSoccer | 14 | api-access, api-endpoints |
| Driblab | 30 | api-access, api-endpoints, data-model |
| ESPN | 20 | api-access, scoreboard, match-summary, teams-and-standings, identity-and-coverage |
| Reep | 26 | overview, identity-and-ids, download-duckdb-csv, api |
| TheSportsDB | 18 | api-access, api-endpoints, livescore, identity-surfaces |
| FotMob | 3 | identity-surfaces |
| Soccerdonna | 3 | identity-surfaces |
| Transfermarkt | 3 | identity-surfaces |

**2,371 searchable chunks** across 26 providers and tools.

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
| Reep | The public OpenAPI spec (endpoint paths and methods), and one release's manifest and column schema (CSV table list, columns used in the SQL examples, licence and exclusions) | `src/__tests__/provider-truth.test.ts`, `src/__tests__/reep.test.ts` |

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

```bash
npm run discover                        # probe sources without crawling
npm run crawl                           # crawl all providers with sources
npm run crawl -- --provider kloppy      # crawl one provider
npm run ingest                          # rebuild search index from docs/
npm run ingest -- --provider kloppy     # re-ingest one provider (incremental)
```

Each crawled doc carries provenance metadata (source URL, source type, upstream version, crawl timestamp) that is surfaced in search results, so agents can distinguish between curated content and upstream documentation.

### Cutting a release

**Pushing the tag is the release.** `.github/workflows/release.yml` runs on any
`v*` tag and does the rest: it re-runs the full check suite, creates the GitHub
Release, and publishes to npm.

```bash
# 1. Bump the version in package.json and server.json (three fields in total).
#    Land it on main through a pull request, as `chore: release vX.Y.Z`.
#
# 2. Tag the merge commit and push the tag.
git tag -a v0.11.0 -m "v0.11.0"
git push origin v0.11.0
```

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
  Node 22 still ships npm 10. The whole job uses one Node version, because
  switching mid-job would leave `better-sqlite3`'s native binding built for the
  wrong ABI and `pnpm ingest` would fail on it. Node 24 is in the CI matrix for
  the same reason: a release must not be the first time the suite meets it.
- **The release job does not cache dependencies.** This is the tree that gets
  published, so it is resolved fresh from the lockfile rather than rehydrated
  from a cache that earlier runs could have poisoned.

Note that `prepublishOnly` runs `pnpm build && pnpm ingest`, which rebuilds
`data/docs.db`. Publishing by hand therefore leaves that file dirty in the
working tree; the content is unchanged, only SQLite's page layout differs, so
`git checkout data/docs.db` clears it.

## License

MIT
