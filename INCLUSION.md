# Inclusion policy

How we decide what goes into football-docs, what the docs may say, and what we
are and are not responsible for. This extends the "What belongs here" section
of [STRATEGY.md](STRATEGY.md). Every new-provider request is assessed against
it, including requests from the provider itself.

## What is in scope

- **Data providers**, commercial or free: APIs, feeds and datasets that
  analysts and data engineers integrate.
- **Open-source football tooling**: libraries that load, convert, model or plot
  football data.
- **Public web sources**: sites people read or scrape for football data. These
  are documented with a clear warning that they can change without notice.

Out of scope:

- General software libraries that are not specific to football data.
- Products whose main output is tips, picks or betting advice.
- Wrappers that only repackage a provider we already index and add no data or
  IDs of their own. We document the upstream provider instead.

## Evidence

The person asking for inclusion provides the evidence. A request must meet at
least one of these routes:

| Route | What counts |
|---|---|
| Established use | Public use by independent projects, articles or tools. For libraries, sustained downloads or stars. For commercial vendors, known clients or a visible presence in the analytics community. |
| Unique coverage | Data that no indexed source has, for example lower divisions, women's leagues or regional competitions. |
| Demand | Independent users have asked for it, in issues or in the community. |

A request must also meet all of these:

- The documentation is public and readable without logging in.
- The access terms allow the documentation to be published.
- The provider is active and has operated long enough to judge its stability.

There is no single usage number. Commercial vendors have no stars or download
counts, and download counts for new packages are often inflated by registry
scanners. Maintainers weigh the evidence and give reasons when they decline.

## Submitting your own product

Vendors and maintainers are welcome to request and write docs for their own
product. State the affiliation in the issue and in the pull request. The docs
get the same review as any other, with a specific check for neutrality.

## What the docs may say

Docs are reference material for agents. They document facts:

- endpoints, parameters, response fields and types
- IDs and identity surfaces
- access tiers, authentication and rate limits
- coverage, and what is not available

Odds, predictions, projections and other model outputs are data like any other.
Document them as fields and endpoints, and name the model that produces them.
The SportMonks `odds` and `predictions` includes follow this pattern.

Docs do not include:

- accuracy or performance claims, for example "calibrated" or "beats the market"
- betting guidance of any kind
- marketing copy or comparisons that favour the provider
- prices, except for access tiers, dated with the date they were checked

## Scraping

We document public access paths as they are, and we document third-party
libraries as they are, including how they fetch data. Recipes written for this
repo do not add ways around authentication, paywalls or explicit blocks.

## What we are responsible for

- The docs match their source on the date they were crawled or verified.
- Every doc carries provenance: where it came from and when.
- We fix drift when someone reports it.
- We remove docs that no longer meet this policy.

## What we are not responsible for

- The quality, accuracy or uptime of a provider's data or API.
- Whether a user's access complies with the provider's terms. Users check the
  terms of each provider they use.
- Pricing or commercial terms.
- Endorsement. Inclusion means a provider meets this policy. It is not a
  recommendation.

## Removal

A maintainer can remove or archive a provider's docs when:

- the provider shuts down or withdraws the documented access
- docs are reported stale and nobody can verify a fix
- the provider's terms change so that the docs can no longer be published
- a provider asks for its own content to be removed
