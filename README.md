# football-docs

Searchable football data provider documentation for AI coding agents. Like [Context7](https://context7.com) for football data.

An MCP server that gives your AI agent instant access to documentation for Opta, StatsBomb, Wyscout, SportMonks, socceraction, kloppy, and free sources (FBref, Understat, ClubElo). Search event types, qualifier IDs, coordinate systems, API endpoints, and cross-provider mappings.

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
| `search_docs` | Full-text search across all provider docs. Filter by provider. |
| `list_providers` | List all indexed providers and their doc coverage. |
| `compare_providers` | Compare how different providers handle the same concept. |

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
| Opta | 29 | event-types, qualifiers, coordinate-system, api-access |
| StatsBomb | 143 | event-types, data-model, coordinate-system, api-access, xg-model |
| Wyscout | 61 | event-types, data-model, coordinate-system, api-access |
| SportMonks | 71 | event-types, data-model, api-access |
| socceraction | 43 | SPADL format, VAEP, Expected Threat |
| kloppy | 100 | data-model, usage, provider-mapping |
| Free sources | 28 | overview, fbref, understat |

**475 searchable chunks** across 7 providers.

## Contributing

We want this to be the most comprehensive football data reference available. Contributions are welcome from everyone, regardless of experience level.

### When to open an issue

- You've found an error (wrong type ID, incorrect field name, broken code example)
- You want docs for a provider we don't cover yet but aren't able to write them yourself
- You're unsure whether something is correct and want to flag it for review
- You have a suggestion for how to improve existing docs

Use our [issue templates](https://github.com/withqwerty/football-docs/issues/new/choose) to get started.

### When to open a PR

- You want to fix an error or add missing information to existing docs
- You want to add a new file for a provider we already cover (e.g. a missing `coordinate-system.md`)
- You want to add docs for a provider we don't cover yet

**You don't need to be an expert.** The contributing guide walks you through using your AI coding tool (Claude Code, Cursor, Copilot, etc.) to write the docs from source material you provide (official docs, API responses, blog posts, etc.). You review what the AI writes, verify the key facts, and submit.

Read the full guide: **[CONTRIBUTING.md](CONTRIBUTING.md)**

### What we especially need

| Provider | Priority | Source material to start from |
|----------|----------|-------------------------------|
| FPL (Fantasy Premier League) | High | [FPL APIs Explained](https://www.oliverlooney.com/blogs/FPL-APIs-Explained) |
| API-Football (RapidAPI) | High | [API-Football docs](https://www.api-football.com/documentation-v3) |
| Football-data.org | Medium | [Football-data.org docs](https://www.football-data.org/documentation/api) |
| TheSportsDB | Medium | [TheSportsDB API](https://www.thesportsdb.com/api.php) |
| WhoScored | Medium | Based on Opta F24, community-documented |
| Sofascore | Medium | Unofficial API, community-documented |

We also welcome improvements to existing docs: more code examples (especially R and JavaScript), cross-provider comparisons, and gotchas from real-world usage.

## License

MIT
