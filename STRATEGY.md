# football-docs strategy

football-docs is a community-owned documentation index for football data work.
The aim is to be Context7 for football data: a source-transparent MCP that helps
agents answer provider-specific questions from checked docs instead of guessing
from stale model memory.

## What we are building

- A public, reviewable corpus for football data providers, open-source football
  tooling, and football analytics/data-engineering recipes.
- A local-first MCP package that works in agent clients without depending on a
  hosted backend.
- A provider registry that explains what is indexed, where it came from, how
  fresh it is, and what aliases agents should resolve to the same provider.
- A test suite that treats retrieval quality as a public contract, not as an
  implementation detail.

## What belongs here

- Public API docs, OpenAPI specs, `llms.txt`, ReadTheDocs sites, GitHub docs,
  public data dictionaries, and public-safe notes derived from those sources.
- Football-specific implementation recipes for analytics and data engineering:
  provider IDs, event and qualifier semantics, coordinate systems, tracking
  data, charting inputs, availability, identity surfaces, and cross-provider
  joins.
- Curated notes where the source and confidence are clear. Curated content must
  say whether it is from public docs, public page evidence, licensed feed shape,
  or a reviewed public-safe observation.

## What does not belong here

- Private paths, credentials, tokens, customer payloads, raw restricted docs, or
  notes that reveal club/vendor internals.
- General software-library docs that are not directly useful for football data
  analysis, football data engineering, or provider integration.
- Unreviewed dumps from private projects. Generalise the football-data lesson or
  keep it out.

## How we work

- Prefer source transparency over volume. Every useful result should carry
  provenance or clearly mark itself as curated.
- Prefer replacement over deprecation in docs. Reserve deprecation language for
  genuine breaking changes or upstream deprecations.
- Keep provider-specific facts separate from product opinions. A provider ID,
  endpoint, qualifier, or coordinate rule is a fact; how a product should rank
  it is a downstream decision.
- Treat aliases and provider resolution as part of the public contract. Agents
  should be able to resolve "Stats Perform", "Opta F24", "Hudl Wyscout",
  "Second Spectrum", "FMDB", and similar names without guessing.
- Require meaningful retrieval tests for meaningful corpus changes. New docs
  should improve a real football analytics or data-engineering task.

## Community contribution path

1. Open an issue for a new provider, stale docs, or a better source.
2. Add or update the provider registry entry with source, access, licence, alias,
   version, and public-safety metadata.
3. Add public docs under `docs/<provider>/` with provenance frontmatter when the
   source is crawled or derived from an upstream document.
4. Rebuild the index and update README coverage when indexed content changes.
5. Add or update golden retrieval tests that prove the new content is useful to
   an agent working on a real football-data task.

## Near-term direction

- Add Context7-style provider resolution and explicit provider-doc retrieval.
- Make provider metadata auditable from `providers.json`.
- Keep request and contribution flows GitHub-native so the community can see
  what is missing, stale, or disputed.
- Keep the package local-first until a hosted ingestion service is clearly worth
  the operational cost.
