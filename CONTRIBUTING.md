# Contributing to football-docs

We want this to be the most comprehensive football data reference for AI agents. Anyone can contribute, regardless of experience level. You'll use your AI coding tool (Claude Code, Cursor, Copilot, etc.) to do most of the work.

There are three types of contributions:
1. **Fix or improve existing docs** (typo, missing field, better example)
2. **Add new docs for an existing provider** (new file for a provider we already cover)
3. **Add a new provider entirely** (provider we don't cover yet)

Pick the one that matches what you want to do and follow the steps below.

---

## Before you start

### What you'll need

- A GitHub account (free)
- Node.js 18+ installed
- An AI coding tool (Claude Code, Cursor, GitHub Copilot, or similar)
- A source to work from: official API docs, a website, a GitHub repo, or your own experience with the provider

### Get the code

1. Go to https://github.com/withqwerty/football-docs
2. Click "Fork" (top right) to copy it to your account
3. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/football-docs.git
cd football-docs
npm install
```

4. Create a branch for your changes:

```bash
git checkout -b add-fpl-docs    # name it after what you're doing
```

---

## Option A: Fix or improve existing docs

Use this when you've spotted an error, want to add a missing field, improve an explanation, or add a code example to docs that already exist.

### Step 1: Find the file

All docs live in `docs/{provider-name}/`. Look at what's there:

```bash
ls docs/
# opta/  statsbomb/  wyscout/  sportmonks/  kloppy/  socceraction/  free-sources/
```

### Step 2: Ask your AI to make the fix

Open the file in your AI tool and tell it what to change. Be specific about your source:

> The Opta qualifiers doc at `docs/opta/qualifiers.md` is missing qualifier ID 468 (expectedGoalsNonPenalty). Add it to the xG Qualifiers section. Source: I verified this exists by checking actual Opta match event data.

Or:

> The StatsBomb event-types doc is missing the "50/50" event type. Add it. Here's the official spec: [paste URL or content]

### Step 3: Verify the change

Open the file and check the AI's output is correct. Did it put the entry in the right table? Are the field names right? Is the description accurate?

### Step 4: Test and submit

```bash
npm run ingest    # Rebuild the search index (should show the updated chunk count)
git add .
git commit -m "docs: add missing qualifier 468 to Opta qualifiers"
git push origin your-branch-name
```

Then go to GitHub and open a Pull Request.

---

## Option B: Add new docs for an existing provider

Use this when a provider is already in `docs/` but is missing a file. For example, maybe `docs/sportmonks/` exists but doesn't have a `coordinate-system.md`.

### Step 1: Check what exists

```bash
ls docs/sportmonks/
# api-access.md  data-model.md  event-types.md
# Missing: coordinate-system.md
```

### Step 2: Find your source material

You need something for the AI to work from. This could be:

- An official docs URL (e.g., `https://docs.sportmonks.com/football/`)
- A GitHub repo with specs (e.g., `https://github.com/statsbomb/open-data`)
- An API response you've captured
- A blog post or tutorial that documents the data format
- A PDF specification document

### Step 3: Give your AI the source and the task

The more specific you are, the better the output. Here's a template:

> I'm contributing to football-docs (https://github.com/withqwerty/football-docs).
>
> Read the CONTRIBUTING.md file in this repo for the format and quality rules.
>
> Then look at an existing example of the same type of doc. Read `docs/opta/coordinate-system.md` to see how coordinate system docs should be structured.
>
> Now create `docs/sportmonks/coordinate-system.md` using this source material:
> [paste URL, or paste the actual content, or say "fetch this URL: ..."]
>
> Make sure to include:
> - The coordinate system origin and ranges
> - How to convert to/from other providers (Opta, StatsBomb)
> - Any gotchas or edge cases

### Step 4: Review what the AI wrote

This is the most important step. AI tools are good at structure but sometimes:

- **Invent field names** that don't actually exist
- **Guess API endpoints** instead of checking real ones
- **Copy from similar providers** and change the name (Opta docs relabelled as SportMonks)
- **Miss important caveats** like "this field is only populated for certain competitions"

Check every specific claim (type IDs, field names, URL paths, value ranges) against your source material.

### Step 5: Test, commit, and PR

```bash
npm run ingest    # Should show your new file with chunk counts

# Example output:
#   sportmonks/coordinate-system.md: 5 chunks
# If it shows 0 chunks, your file is missing ## headings

git add .
git commit -m "docs: add coordinate system docs for SportMonks"
git push origin your-branch-name
```

Open a Pull Request on GitHub. In the PR description, include:
- What you added
- What source you used (link to official docs, or "verified against live API")
- Anything you're unsure about

---

## Option C: Add a new provider entirely

Use this when you want to document a provider we don't cover at all yet.

### Step 1: Create the directory

```bash
mkdir docs/your-provider-name    # lowercase, hyphenated
```

### Step 2: Decide which files to create

Not every provider needs every file type. Here's the guide:

| File | Create if... | Example |
|------|-------------|---------|
| `api-access.md` | Provider has an API or specific access method | Almost always yes |
| `data-model.md` | Provider has structured data worth documenting | Usually yes |
| `event-types.md` | Provider has match event/action data | StatsBomb, Opta, Wyscout |
| `coordinate-system.md` | Provider uses pitch coordinates | StatsBomb, Opta, Wyscout |
| `qualifiers.md` | Provider uses qualifier/attribute IDs on events | Opta |
| `xg-model.md` | Provider has their own xG model | StatsBomb, Understat |

For a typical API provider (like FPL or Football-data.org), you'd create `api-access.md` and `data-model.md` at minimum.

### Step 3: Gather your source material

Get the best reference you can:

| Source type | How to use it |
|------------|---------------|
| Official API docs URL | Tell your AI: "Fetch this URL and document the endpoints" |
| GitHub repo | Tell your AI: "Read the README at this repo and document the data format" |
| Blog post / tutorial | Paste the relevant parts into your prompt |
| Your own API testing | Paste example responses into your prompt |
| PDF documentation | If your AI can read PDFs, point it at the file. Otherwise, paste key sections |

### Step 4: Use this prompt template

Copy this entire prompt and fill in the blanks:

```
I'm contributing to football-docs (https://github.com/withqwerty/football-docs),
a searchable documentation index for football data providers.

I need to create docs for [PROVIDER NAME] in docs/[provider-name]/.

Read CONTRIBUTING.md in this repo for the exact format and quality rules.

Then read these existing docs as examples of the style and detail level we need:
- docs/opta/api-access.md (for API documentation style)
- docs/statsbomb/event-types.md (for event type documentation style)
- docs/statsbomb/data-model.md (for data model documentation style)

Now create the following files for [PROVIDER NAME]:
- docs/[provider-name]/api-access.md
- docs/[provider-name]/data-model.md
- [add or remove files as needed]

Use this source material:
[PASTE URL, docs content, API responses, or repo link here]

Important:
- Every ## section should be self-contained (searchable independently)
- Use tables for reference data (field names, type IDs, endpoints)
- Include code examples for accessing the data (Python, JavaScript, or R)
- Note what data is NOT available or undocumented
- Do not invent field names or endpoints. If unsure, mark it as unverified.
```

### Step 5: Review thoroughly

For a new provider, review is especially important. Go through each file and check:

- [ ] Are the API endpoints real? (Try one in your browser or with curl)
- [ ] Are the field names from actual API responses, not guessed?
- [ ] Are rate limits and auth requirements accurate?
- [ ] Are the data types correct? (Is it a string or number? Is it nullable?)
- [ ] Does the code example actually work if you run it?
- [ ] Did the AI copy content from another provider's docs and relabel it?

### Step 6: Test and submit

```bash
npm run ingest
# Should show:
#   your-provider/api-access.md: X chunks
#   your-provider/data-model.md: X chunks
# Total should increase

git add .
git commit -m "docs: add [provider-name] documentation"
git push origin your-branch-name
```

Open a Pull Request. In the description, include:
- What provider you're adding
- Links to the source material you used
- Which sections you've verified vs which are AI-generated and need review

---

## Writing rules

These rules exist because the docs are chunked by heading and searched by AI agents. Every section needs to work independently.

### Each `##` section should stand alone

Someone will find your section via a search query, not by reading the whole file. They won't see the title or previous sections.

Good:
```markdown
## Pass Event (type ID 1)

Opta represents passes as type ID 1. Outcome: 0 = unsuccessful, 1 = successful.
Key qualifiers: 1 (long ball), 2 (cross), 4 (through ball), 140/141 (end coordinates).
```

Bad:
```markdown
## Passes

These work the same way as the shots described above...
```

### Use tables for anything with IDs, names, or types

```markdown
| ID | Name | Notes |
|----|------|-------|
| 1  | Pass | 0=fail, 1=success |
| 16 | Goal | Check qualifier 28 for own goals |
```

### Include conversion formulas between providers

```markdown
## Converting to StatsBomb coordinates

StatsBomb uses 120x80 yards with origin at top-left.
To convert from Opta (0-100):
- statsbomb_x = opta_x * 1.2
- statsbomb_y = opta_y * 0.8
```

### Be specific, not vague

Good: "Qualifier 321 contains the xG value as a decimal string (e.g. '0.342')"
Bad: "The xG data is available via qualifiers"

### Note what's missing or unreliable

```markdown
## Limitations

- xG values are not available on the standard matchevent endpoint.
  Use the separate matchexpectedgoals endpoint (qualifier 321).
- Tracking data coordinates can overflow the 0-100 range (observed: -1.7 to 101.7).
- The FPL API is unofficial and undocumented. Endpoints can change without notice.
```

### No credentials in docs

Reference environment variable names, not actual values:

Good: `Set SPORTMONKS_API_TOKEN in your .env file`
Bad: `Use token abc123xyz`

---

## Testing your changes

```bash
# Rebuild the search index
npm run ingest

# Check the output - each file should produce chunks:
#   opta/qualifiers.md: 10 chunks
#   your-new-file.md: 7 chunks

# If a file shows 0 chunks:
# - Check it has ## headings (the chunker splits on ## and ###)
# - Check sections have more than 20 characters of content
```

---

## What we especially need

### New providers (not yet documented)

| Provider | Priority | Best source material |
|----------|----------|---------------------|
| FPL (Fantasy Premier League) | High | https://www.oliverlooney.com/blogs/FPL-APIs-Explained |
| API-Football (RapidAPI) | High | https://www.api-football.com/documentation-v3 |
| Football-data.org | Medium | https://www.football-data.org/documentation/api |
| TheSportsDB | Medium | https://www.thesportsdb.com/api.php |
| WhoScored | Medium | Based on Opta F24, but has its own wrapper format |
| Sofascore | Medium | Unofficial API, community-documented |
| Transfermarkt | Low | Web scraping only, fragile |

### Improvements to existing docs

- More code examples in R (using `worldfootballR`, `StatsBombR`) and JavaScript
- Cross-provider comparison tables (e.g., "how do each handle penalty kicks?")
- Common gotchas from real-world usage
- Missing fields or type IDs that we haven't documented yet

### Conceptual docs (in `docs/concepts/`)

- Football analytics glossary with standardised definitions
- "Which provider should I use for X?" decision guide
- Common data quality issues and how to handle them

---

## PR checklist

Copy this into your PR description:

```markdown
## What I changed
- [ ] Fixed existing docs / Added new file for existing provider / Added new provider

## Source material
- Link or description of what I used to verify accuracy

## Verification
- [ ] Field names and type IDs checked against actual docs or API responses
- [ ] Code examples tested (or marked as untested)
- [ ] No API keys or credentials included
- [ ] `npm run ingest` runs successfully and shows expected chunk counts
- [ ] Each ## section makes sense if read independently (no "as mentioned above")

## Anything uncertain
- List any sections where you relied on AI output without independent verification
```
