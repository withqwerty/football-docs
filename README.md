# football-docs

Searchable football data provider documentation for AI coding agents. Like [Context7](https://context7.com) for football data.

An MCP server that gives your AI agent instant access to documentation for Opta, StatsBomb, Wyscout, SportMonks, socceraction, kloppy, soccerdata, mplsoccer, databallpy, and free sources (FBref, Understat, ClubElo). Search event types, qualifier IDs, coordinate systems, API endpoints, and cross-provider mappings.

## Quick start

### With Claude Code

Add to your MCP config:

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

### With any MCP client

```bash
npx football-docs
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
- "Does SportMonks have xG data?"
- "What event types does kloppy map to GenericEvent?"
- "How does SPADL represent a tackle?"

## Indexed providers

| Provider | Chunks | Categories |
|----------|--------|------------|
| StatsBomb | 143 | event-types, data-model, coordinate-system, api-access, xg-model |
| kloppy | 100 | data-model, usage, provider-mapping |
| SportMonks | 71 | event-types, data-model, api-access |
| databallpy | 63 | data-model, overview, usage |
| mplsoccer | 62 | overview, pitch-types, visualizations |
| Wyscout | 61 | event-types, data-model, coordinate-system, api-access |
| Free sources | 45 | overview, fbref, understat |
| soccerdata | 40 | overview, data-sources, usage |
| Opta | 29 | event-types, qualifiers, coordinate-system, api-access |
| socceraction | 26 | SPADL format, VAEP, Expected Threat |

**640 searchable chunks** across 10 providers.

## Contributing

Contributions are welcome from everyone. There are three ways to help:

1. **Open an issue** — [request a new provider](https://github.com/withqwerty/football-docs/issues/new/choose), [flag outdated docs](https://github.com/withqwerty/football-docs/issues/new/choose), or [suggest a better doc source](https://github.com/withqwerty/football-docs/issues/new/choose)
2. **Use the `request_update` tool** — AI agents can flag outdated or missing docs directly via the MCP server, which queues requests for maintainer review
3. **Open a PR** — fix errors, add new providers, or improve existing docs

**You don't need to be an expert.** See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

### What we especially need

| Provider | Priority | Source material to start from |
|----------|----------|-------------------------------|
| FPL (Fantasy Premier League) | High | [FPL APIs Explained](https://www.oliverlooney.com/blogs/FPL-APIs-Explained) |
| API-Football (RapidAPI) | High | [API-Football docs](https://www.api-football.com/documentation-v3) |
| Football-data.org | Medium | [Football-data.org docs](https://www.football-data.org/documentation/api) |
| TheSportsDB | Medium | [TheSportsDB API](https://www.thesportsdb.com/api.php) |
| WhoScored | Medium | Based on Opta F24, community-documented |
| Sofascore | Medium | Unofficial API, community-documented |

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
