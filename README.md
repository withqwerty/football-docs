# football-docs

Searchable football data provider and tooling documentation for AI coding agents. Like [Context7](https://context7.com) for football data.

**Who it's for:** Developers and analysts who use AI coding tools (Claude Code, Cursor, VS Code Copilot) to work with football data. Works with any tool that supports MCP.

**What it does:** Gives your AI agent a searchable index of documentation for 17 football data providers and tools — event types, qualifier IDs, coordinate systems, API endpoints, data models, identity surfaces, and cross-provider comparisons for the data providers (StatsBomb, Opta, Wyscout, Impect, SkillCorner, FMDB Pro, TransferRoom, and more), plus the open-source libraries people build with (kloppy, mplsoccer, socceraction, soccerdata, and more). Your agent looks up the real docs instead of guessing from training data.

**Why not just let the AI figure it out?** LLMs get football data specifics wrong constantly — Opta qualifier IDs, StatsBomb coordinate ranges, API endpoint URLs, library method signatures. These are mutable facts that change across versions. football-docs gives the agent verified, sourced documentation with provenance tracking so you know where every answer came from.

## Provider identity facts

football-docs is the public source for provider identity-surface facts: access
shape, ID schemes, matching fields, provider quirks, and provenance rules.
Curated Reep-derived notes belong here when they can be stated without private
register state. They should say whether a fact comes from public docs, public
page evidence, licensed feed shape, or a reviewed public-safe observation, and
must not include private paths, credentials, scraper state, action ledgers, mint
salts, or raw restricted payloads.

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
| `list_providers` | List all indexed providers and their doc coverage. |
| `compare_providers` | Compare how different providers handle the same concept. |
| `request_update` | Request a new provider, flag outdated docs, or suggest a better doc source. Queued for maintainer review. |

## Example queries

- "What is Opta qualifier 76?" (big chance)
- "How does StatsBomb represent shot events?"
- "Compare Opta and Wyscout coordinate systems"
- "Which provider IDs are safe identity bridges for Transfermarkt players?"
- "Does SportMonks have xG data?"
- "What event types does kloppy map to GenericEvent?"
- "How does SPADL represent a tackle?"

## Indexed providers

| Provider | Chunks | Categories |
|----------|--------|------------|
| StatsBomb | 231 | event-types, data-model, coordinate-system, api-access, api-endpoints, xg-model, iq-metrics, player/team stats, player-mapping, identity-surfaces |
| Wyscout | 157 | event-types, data-model, coordinate-system, api-access, api-endpoints, glossary, identity-surfaces |
| kloppy | 100 | data-model, usage, provider-mapping |
| SportMonks | 78 | event-types, data-model, api-access, identity-surfaces |
| databallpy | 63 | data-model, overview, usage |
| mplsoccer | 62 | overview, pitch-types, visualizations |
| Impect | 58 | api-access, api-endpoints, data-model, event-types, coordinate-system, concepts, identity-surfaces |
| SkillCorner | 51 | api-access, api-endpoints, data-model, physical-data, coordinate-system, concepts, identity-surfaces |
| Free sources | 45 | overview, fbref, understat |
| soccerdata | 40 | overview, data-sources, usage |
| TransferRoom | 38 | api-access, api-endpoints, data-model, identity-surfaces |
| Opta | 36 | event-types, qualifiers, coordinate-system, api-access, identity-surfaces |
| FMDB Pro | 36 | api-access, api-endpoints, data-model, identity-surfaces |
| socceraction | 26 | SPADL format, VAEP, Expected Threat |
| FotMob | 7 | identity-surfaces |
| Soccerdonna | 7 | identity-surfaces |
| Transfermarkt | 7 | identity-surfaces |

**1,042 searchable chunks** across 17 providers and tools.

## Contributing

Contributions are welcome from everyone. There are three ways to help:

1. **Open an issue** — [request a new provider](https://github.com/withqwerty/football-docs/issues/new/choose), [flag outdated docs](https://github.com/withqwerty/football-docs/issues/new/choose), or [suggest a better doc source](https://github.com/withqwerty/football-docs/issues/new/choose)
2. **Use the `request_update` tool** — AI agents can flag outdated or missing docs directly via the MCP server, which queues requests for maintainer review
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

## License

MIT
