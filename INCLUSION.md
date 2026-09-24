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
- Anything directly about betting or heavily oriented to it: betting tools and
  apps, tipsters, odds feeds and odds archives. See [Betting](#betting).
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

## Data provenance

A provider states where its data comes from. Use one or more of these:

| Category | Meaning |
|---|---|
| First-party | Collected by the provider itself, for example its own scouts, loggers or tracking systems. |
| Licensed | Licensed from a named upstream source, for example a league or another data provider. |
| Aggregated | Collected from public sources such as websites, feeds or public datasets. |
| Derived | Models or metrics built on one of the above. Name the input source. |

Each provider records this in a short `data-provenance.md` in its docs folder,
or in a "Data sources" section of its `api-access.md`, so an agent can tell a
user before they build on the data. Use a separate file when the provider's
other docs are crawled, so that the crawled pages stay verbatim. Open-source
tooling that holds no data of its own, such as kloppy or mplsoccer, does not
need one.

We do not index a product whose main offer is resale or relicensing of
third-party data when it does not disclose the source, or does not appear to
have the right to redistribute it. Free libraries and wrappers that fetch public
data for the user are different, because they sell nothing. soccerdata and the
free-sources docs are examples.

We check that the source is disclosed. We do not audit contracts or verify
rights.

### Exemption for well-known providers

Established commercial providers whose collection or licensing is widely known
do not need to disclose their sources to be included. Examples are Opta,
StatsBomb, Wyscout, Sportradar and SportMonks. Their provenance notes record
what is publicly known, or say "not publicly documented". A maintainer
decides whether a provider is well known, and gives reasons in the issue.

## What the docs may say

Docs are reference material for agents. They document facts:

- endpoints, parameters, response fields and types
- IDs and identity surfaces
- access tiers, authentication and rate limits
- coverage, and what is not available

Model outputs such as xG, expected points and season projections are data.
Document them as fields and endpoints, and name the model that produces them.

Docs do not include:

- accuracy or performance claims, for example "calibrated" or "beats the market"
- betting content (see below)
- marketing copy or comparisons that favour the provider
- prices, except for access tiers, dated with the date they were checked

## Betting

Many data providers also sell odds or betting products. We index their football
data and leave the betting side out:

- no docs, sections or endpoints about odds, bookmakers, betting markets, tips
  or value bets
- no providers, tools or datasets that are mainly about betting

Incidental mentions inside a verbatim upstream page can stay, for example an
`odds` entry in a list of includes. Removing them would break the page's
provenance.

Stats that describe the match or model football are fine, even when betting
sites use them: the rate at which both teams score, matches over a goal
threshold, corners per match, expected points, season projections. Use neutral
names and no market framing. Match-outcome probabilities presented as betting
prices stay out.

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
- Whether a provider has the right to the data it sells. We check that sources
  are disclosed, not that the rights behind them are sound.
- Pricing or commercial terms.
- Endorsement. Inclusion means a provider meets this policy. It is not a
  recommendation.

## Removal

A maintainer can remove or archive a provider's docs when:

- the provider shuts down or withdraws the documented access
- docs are reported stale and nobody can verify a fix
- the provider's terms change so that the docs can no longer be published
- a provider asks for its own content to be removed
