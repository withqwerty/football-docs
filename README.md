# @nutmeg/docs

Searchable football data provider documentation for AI coding agents. Like [Context7](https://context7.com) for football data.

An MCP server that gives your AI agent instant access to documentation for Opta, StatsBomb, Wyscout, SportMonks, kloppy, and free sources (FBref, Understat, ClubElo). Search event types, qualifier IDs, coordinate systems, API endpoints, and cross-provider mappings.

## Quick start

### With Claude Code

Add to your MCP config:

```json
{
  "mcpServers": {
    "football-docs": {
      "command": "npx",
      "args": ["-y", "@nutmeg/docs"]
    }
  }
}
```

### With any MCP client

```bash
npx @nutmeg/docs
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

## Indexed providers

| Provider | Chunks | Categories |
|----------|--------|------------|
| Opta | 29 | event-types, qualifiers, coordinate-system, api-access |
| StatsBomb | 143 | event-types, data-model, coordinate-system, api-access, xg-model |
| Wyscout | 61 | event-types, data-model, coordinate-system, api-access |
| SportMonks | 71 | event-types, data-model, api-access |
| kloppy | 100 | data-model, usage, provider-mapping |
| Free sources | 28 | overview, fbref, understat |

**432 searchable chunks** across 6 providers.

## Contributing docs

Add or improve provider documentation by creating markdown files in `docs/{provider}/`:

```
docs/
  opta/
    event-types.md
    qualifiers.md
    coordinate-system.md
    api-access.md
  statsbomb/
    ...
  your-new-provider/
    events.md
    api.md
```

Then rebuild the index:

```bash
npm run ingest
```

Each markdown file is chunked by heading (## or ###) and indexed with FTS5. PRs welcome.

## License

MIT
