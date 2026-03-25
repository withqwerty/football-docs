# Contributing to football-docs

We want this to be the most comprehensive football data reference for AI agents. Contributions are welcome, whether you're adding a new provider, improving existing docs, or fixing errors.

## The easiest way to contribute

Use your AI coding tool (Claude Code, Cursor, Copilot, etc.) to help write the docs. Here's exactly how:

### 1. Fork and clone

```bash
git clone https://github.com/YOUR_USERNAME/football-docs.git
cd football-docs
npm install
```

### 2. Tell your AI what to write

Give your AI tool a prompt like this:

> I'm contributing to football-docs, a searchable documentation index for football data providers. I need to add documentation for [PROVIDER NAME].
>
> Read CONTRIBUTING.md for the required structure and format, then create the markdown files in `docs/[provider-name]/`.

### 3. Review what it wrote

Check the output against the quality checklist below. AI tools are good at structure but sometimes hallucinate field names or invent API endpoints. Verify against the actual provider documentation.

### 4. Build and test

```bash
npm run ingest    # Rebuild the search index
npm run dev       # Start the MCP server locally
```

Test your docs are searchable by querying the MCP server.

### 5. Open a PR

Push your branch and open a PR. Include:
- Which provider you're adding/updating
- What source you used to verify the information (official docs URL, API testing, etc.)
- Whether any sections are uncertain or need verification

---

## File structure

Each provider gets a directory under `docs/`:

```
docs/
  provider-name/           # lowercase, hyphenated
    event-types.md          # Event/action type reference
    data-model.md           # Data structures, relationships, JSON shapes
    coordinate-system.md    # Pitch coordinate system and conversions
    api-access.md           # API endpoints, auth, rate limits
    qualifiers.md           # (if applicable) Qualifier/attribute IDs
    xg-model.md             # (if applicable) xG methodology
```

Not every provider needs every file. Use what's relevant:

| File | When to include |
|------|----------------|
| `event-types.md` | Provider has event/action data (always include if possible) |
| `data-model.md` | Provider has a structured data model worth documenting |
| `coordinate-system.md` | Provider uses spatial coordinates (pitch positions) |
| `api-access.md` | Provider has an API or specific access method |
| `qualifiers.md` | Provider uses qualifier/attribute IDs (Opta-style) |
| `xg-model.md` | Provider has their own xG model worth explaining |

## Markdown format

### Headings

Use `#` for the page title, `##` for major sections, `###` for subsections. The search index chunks by heading, so each `##` or `###` section becomes a separately searchable unit.

**Good:** Each section is self-contained and answers a specific question.

```markdown
## Shot Event Type

Shots are represented as type ID 13 (miss), 14 (post), 15 (saved), 16 (goal).
Each shot event includes qualifiers for body part, shot location, and outcome.
```

**Bad:** Sections that only make sense in context of the previous section.

```markdown
## More Details

As mentioned above, these also include...
```

### Tables

Use tables for reference data. They search well and are easy to scan:

```markdown
| ID | Name | Description |
|----|------|-------------|
| 1 | Pass | Successful or unsuccessful pass attempt |
| 16 | Goal | Goal scored (check qualifier 28 for own goals) |
```

### Code examples

Include code examples where helpful, especially for:
- API request/response shapes
- Data loading patterns
- Coordinate conversion formulas

Use language-tagged fenced code blocks:

````markdown
```python
# Load StatsBomb open data
from statsbombpy import sb
events = sb.events(match_id=3788741)
```

```typescript
// Opta coordinate conversion
const statsbomb_x = opta_x * 1.2;
const statsbomb_y = opta_y * 0.8;
```
````

### Cross-references

When one provider's concept relates to another, mention the comparison:

```markdown
## Coordinate System

Opta uses a 0-100 normalised pitch. This differs from StatsBomb (120x80 yards)
and Wyscout (0-100 with inverted Y axis). See the kloppy provider-mapping docs
for automatic conversion.
```

## Content quality checklist

Before submitting, verify:

- [ ] **Accuracy**: Field names, type IDs, and API endpoints are verified against actual provider documentation or tested against live APIs. Do not rely solely on AI-generated content.
- [ ] **Specificity**: Includes actual values, not just descriptions. "Type ID 16" not "the goal event type". "0-100 range" not "normalised coordinates".
- [ ] **Self-contained sections**: Each `##` section answers a question independently. Someone finding it via search should understand it without reading the whole file.
- [ ] **Practical**: Includes "how to use this" not just "what this is". Code examples, conversion formulas, common gotchas.
- [ ] **Honest about limitations**: Notes what data is NOT available, what's undocumented, what's unstable.
- [ ] **No sensitive credentials**: No API keys, tokens, or passwords. Reference environment variable names instead (`SPORTMONKS_API_TOKEN`).

## What we especially need

### New providers

- **API-Football (RapidAPI)**: event types, endpoints, rate limits
- **Football-data.org**: API reference, free tier details
- **FPL (Fantasy Premier League)**: endpoint catalogue, data shapes, bootstrap-static
- **TheSportsDB**: API reference, what's available free vs paid
- **Transfermarkt**: data structure (for scraping), what's available
- **WhoScored**: event data shape, how it relates to Opta F24
- **Sofascore**: API patterns, data availability

### Improvements to existing docs

- More code examples (especially R and JavaScript, not just Python)
- Cross-provider comparison tables ("how does X handle penalty kicks?")
- Common pitfalls and gotchas from real-world usage
- Version-specific notes (e.g., Wyscout v2 vs v3 differences)

### Conceptual docs

- Football analytics glossary (standardised definitions)
- "Which provider should I use for X?" decision guide
- Common data quality issues by provider

## Testing your changes

After adding or editing docs:

```bash
# Rebuild the search index
npm run ingest

# Verify your docs were indexed
npm run dev
# Then query: search_docs("your topic")
```

The ingestion script will show chunk counts per file. If a file produces 0 chunks, check that it has `##` headings and content longer than 20 characters per section.

## Versioning

When docs are added or updated, bump the patch version in `package.json` before your PR. We'll publish to npm after merging.
