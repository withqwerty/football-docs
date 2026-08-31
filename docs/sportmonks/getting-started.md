---
source_url: https://docs.sportmonks.com/football/llms-full.txt
source_type: llms_txt
upstream_version: v3
crawled_at: 2026-08-31T00:17:40.844Z
---
# Getting Started

We'll briefly inform you about the features of our API, and then you can explore our documentation for yourself. You will also find out how to create **your** dream application. Sportmonks offers standard REST APIs. Requests are sent with URLs and responses will be returned in **JSON format**. Every authentication is spearheaded by an API token. We have assembled a library of all of our endpoints including example requests in **Postman**.

{% embed url="<https://www.youtube.com/watch?v=nKJLO6gtHww>" %}

{% hint style="info" %}
We also offer detailed postman documentation with examples and a complete up-to-date version of all our endpoints. Below is a button that lets your fork the collection or import it

\
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316?action=collection%2Ffork\&collection-url=entityId%3D11949411-c7a3a0a0-b5c5-4109-9bf6-f430fec65316%26entityType%3Dcollection%26workspaceId%3D17c720d0-d97b-42a9-9ea7-23260ed53ddf)
{% endhint %}

Short introduction to Sportmonks:

Now you know who we are, what we do, what we offer, and how we can help you: We suppose you want to get started right away. Head over to our [Getting Started section](/v3/welcome/making-your-first-request), where you'll create your own API token and create your first request

What else do we cover in the documentation?&#x20;

* [Getting started ](/v3)
* [API section](/v3/api/syntax)
* [Endpoint overview](/v3/endpoints-and-entities/endpoints)
* [Entities explained ](/v3/endpoints-and-entities/entities)
* [Tutorials](/v3/tutorials-and-guides/tutorials)&#x20;
* [How-to guides](/v3/tutorials-and-guides/guides)
* [Definitions](/v3/definitions/response-codes)&#x20;

**API structure**

<figure><img src="/files/OcXSkC1Hrxx1dWtYAVfb" alt=""><figcaption></figcaption></figure>

### Persona-based getting started paths

Different developers have different needs and experience levels. This document provides tailored getting started paths for each user persona, helping them find the most relevant documentation quickly and reducing time-to-first-success.

#### Choose your path

Select the path that best describes you to get started quickly with the right resources:

#### New to APIs?

**You're here to:** Learn what APIs are and how to use Sportmonks for the first time.

#### Your learning path

**Step 1: Understand the basics**

* [What is an API?](https://www.sportmonks.com/glossary/application-programming-interface/) - Learn API fundamentals
* [What can you do with Sportmonks?](https://docs.sportmonks.com/v3/welcome/what-can-you-do-with-sportmonks-data) - See what's possible

**Step 2: Get set up**

* [Authentication guide](https://docs.sportmonks.com/v3/welcome/authentication) - Get your API token
* [Making your first request](https://docs.sportmonks.com/v3/welcome/making-your-first-request) - Send your first API call

**Step 3: Learn core concepts (15 min)**

* [API structure & navigation](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/api-structure-and-navigation) - How the API is organised
* [Fixtures tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures) - Working with match data
* [Includes tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes) - Get more data in one request

**Step 4: Build something simple (10-15 min)**

* [Build a simple livescore app](https://www.sportmonks.com/blogs/building-a-real-time-livescore-app-with-a-football-api-best-practices/)- Step-by-step tutorial
* [Understanding responses](https://www.sportmonks.com/glossary/json-response/) - Read API responses
* [Common beginner mistakes](https://www.sportmonks.com/blogs/5-common-mistakes-developers-make-with-football-apis-and-how-to-avoid-them/) - Avoid pitfalls

#### Experienced developer, new to Sportmonks?

**You're here to:** Get productive quickly with Sportmonks' most powerful features.

#### Your fast-track path

**Step 1: Quick setup**

* [Authentication](https://docs.sportmonks.com/v3/welcome/authentication) - Get your token
* [Quick start guide](https://docs.sportmonks.com/v3/welcome/quick-start-guide) - Make your first request
* [API structure](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/api-structure-and-navigation) - Understand organisation

**Step 2: Power features**

* [Advanced includes](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes) - Combine data efficiently
* [Filter & select](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/filter-and-select-fields) - Optimise responses
* [Rate limiting](https://docs.sportmonks.com/v3/api/rate-limit) - Understand limits

**Step 3: Essential tutorials**

* [Livescores & fixtures](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures) - Core match data
* [Statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics) - Advanced stats
* [States & types](https://docs.sportmonks.com/v3/definitions/states) - Reference data

**Step 4: Optimise**

* [Best practices](https://docs.sportmonks.com/v3/welcome/best-practices) - Production-ready code
* [Error handling](https://docs.sportmonks.com/v3/api/error-codes) - Handle errors properly
* [Performance tips](https://www.sportmonks.com/blogs/10-tips-for-maximising-sportmonks-football-api-usage-best-practices-for-developers/) - Scale efficiently

&#x20;**Pro tips:**

* Use [ID finder](https://my.sportmonks.com/resources/id-finder) to discover entity IDs
* Test with [Postman collection](https://postman.sportmonks.com/)
* Cache reference data (types, states, leagues)

#### Migrating from API v2?

**You're here to:** Upgrade from API v2 to v3 smoothly and quickly.

#### Your migration path

**Step 1: Understand changes (10 min)**

* [Key differences overview](https://docs.sportmonks.com/v3/welcome/differences-between-api-2-and-api-3) - What changed
* [API changes](https://docs.sportmonks.com/v3/welcome/differences-between-api-2-and-api-3/api-changes) - Detailed breakdown
* [Syntax changes](https://docs.sportmonks.com/v3/welcome/differences-between-api-2-and-api-3/syntax-and-filters) - New syntax

**Step 2: Breaking changes checklist**

* **Participants replace localTeam/visitorTeam** - Update team includes
* **New include syntax** - Use semicolons (`;`) instead of commas
* **New pagination** - No more `total_pages` in response
* **Rate limits per entity** - Not per endpoint anymore
* **Statistics only show recorded values** - No default zeros
* **Trends structure changed** - New period-based format
* **Bookmaker IDs changed** - Use `legacy_id` for mapping

**Step 3: New features to explore**

* [New endpoints](https://docs.sportmonks.com/v3/welcome/differences-between-api-2-and-api-3/new-endpoints-and-data-features) - What's new in v3
* [Expected goals (xG)](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/expected) - Advanced metrics
* [Trends analysis](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/trends) - Form tracking
* [Pressure index](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/pressure-index) - Match momentum

**Migration checklist:**

```
□ Update base URL to /v3/
□ Replace include commas with semicolons
□ Change localTeam/visitorTeam to participants
□ Update pagination logic (no total_pages)
□ Handle null statistics (not zeros)
□ Test all endpoints in your app
□ Update error handling for new codes
□ Review rate limits per entity
```

### Building specific applications?

Choose your application type for a focused guide:

#### Livescore app

**What you'll build:** Real-time match tracker with scores, events, and lineups.

**Your path**

1. **Core features**
   * [Livescores tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/livescores) - Real-time scores
   * [Events tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/events) - Goals, cards, subs
   * [Lineups tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/lineups-and-formations) - Team lineups
2. **Enhancement features (15 min)**
   * [Scores by period](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/scores) - Half-time scores
   * [States](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/states) - Match status (NS, LIVE, FT)
   * [Fixtures tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures) - Match details
3. **Optimisation**
   * [Polling strategy](https://docs.sportmonks.com/v3/welcome/best-practices) - How often to refresh
   * [Rate limiting](https://docs.sportmonks.com/v3/api/rate-limit) - Stay within limits
   * [Caching strategy](https://www.sportmonks.com/blogs/caching-and-optimisation-strategies-for-high-volume-football-api-usage/) - Improve performance
4. **Polish**
   * [Error Handling](https://docs.sportmonks.com/v3/api/error-codes) - Handle failures
   * [Filtering](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/filter-and-select-fields) - Show specific leagues

**📱 Quick Implementation:**

```javascript
// Fetch live matches with events and lineups
const response = await fetch(
  'https://api.sportmonks.com/v3/football/livescores/inplay?api_token=YOUR_TOKEN&include=scores;events;participants;lineups'
);
const liveMatches = await response.json();

// Poll every 10 seconds for updates
setInterval(async () => {
  const updates = await fetch(
    'https://api.sportmonks.com/v3/football/livescores/latest?api_token=YOUR_TOKEN&include=scores;events'
  );
  // Update your UI with changes
}, 10000);
```

#### Betting platform

**What you'll build:** Platform with odds, predictions, and statistics.

**Your path:**

1. **Foundation**
   * [Fixtures tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures) - Match data
   * [Statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics) - Performance data
   * [Head-to-head](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures#get-fixture-by-head-to-head) - H2H records
2. **Odds & predictions**
   * [Pre-match odds](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/odds-and-predictions/pre-match-odds) - Bookmaker odds
   * [Live odds](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/odds-and-predictions/live-inplay-odds) - In-play odds
   * [Predictions](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/odds-and-predictions/predictions) - ML predictions
   * [Value bets](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/odds-and-predictions/predictions/value-bet) - Best value
3. **Advanced stats**
   * [Expected goals (xG)](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/expected) - Performance metrics
   * [Trends](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/trends) - Form analysis
   * [Team statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics/team-statistics) - Team performance
4. **Implementation**
   * [Markets & bookmakers](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/odds-and-predictions) - Understanding odds structure
   * Plan requirements - What you need
   * [Best practices](https://docs.sportmonks.com/v3/welcome/best-practices) - Production tips

#### Fantasy football

**What you'll build:** Fantasy league with player stats and scoring.

**Your path**

1. **Player data**
   * [Players](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/teams-players-coaches-and-referees) - Player profiles
   * [Player statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics/players-statistics) - Performance metrics
   * [Lineups](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/lineups-and-formations) - Starting players
2. **Scoring system**
   * [Statistics types](https://docs.sportmonks.com/v3/definitions/types/statistics/player-statistics) - Available stats
   * [Fixture statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics/fixture-statistics) - Match stats
   * [Events](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/events) - Goals, assists, cards
3. **League management**
   * [Fixtures by date](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures#get-fixture-by-date) - Gameweek fixtures
   * [Season schedule](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/season-schedule) - Plan gameweeks
   * [Livescores](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/livescores) - Live scoring
4. **Advanced features**
   * [Expected goals](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/expected) - xG for players
   * [Trends](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/trends) - Form indicators
   * [Transfers](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/transfers) - Transfer news

**Sample fantasy points calculation:**

```javascript
const calculatePoints = (playerStats) => {
  let points = 0;
  
  // Goals: 5 points each
  points += (playerStats.goals || 0) * 5;
  
  // Assists: 3 points each  
  points += (playerStats.assists || 0) * 3;
  
  // Clean sheet (goalkeeper/defender): 4 points
  if (playerStats.cleansheet && ['GK', 'DEF'].includes(playerStats.position)) {
    points += 4;
  }
  
  // Yellow card: -1 point
  points += (playerStats.yellowcards || 0) * -1;
  
  // Red card: -3 points
  points += (playerStats.redcards || 0) * -3;
  
  return points;
};
```

#### Stats dashboard

**What you'll build:** Analytics dashboard with trends, comparisons, and visualizations.

**Your path**

1. **Statistics foundation**
   * [Statistics tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics) - Overview
   * [Season statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics/season-statistics) - League stats
   * [Team statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics/team-statistics) - Team metrics
   * [Player statistics](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/statistics/players-statistics) - Player metrics
2. **Advanced metrics**
   * [Expected goals (xG)](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/expected) - Performance analysis
   * [Trends](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/trends) - Form tracking
   * [Pressure index](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/pressure-index) - Match control
3. **Comparisons**
   * [Head-to-head](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/livescores-and-fixtures/fixtures#get-fixture-by-head-to-head) - Team comparisons
   * [Standings](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/standings) - League tables
   * [Filter & select](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/filter-and-select-fields) - Custom queries
4. **Visualisation tips**
   * [Statistics types reference](https://docs.sportmonks.com/v3/definitions/types/statistics) - Understand data
   * Data processing - Clean and format
   * [Best practices](https://docs.sportmonks.com/v3/welcome/best-practices) - Optimise

**Dashboard components:**

* Team form chart (last 10 matches)
* xG vs actual goals scatter plot
* Player comparison radar charts
* League-wide statistics tables
* Trend lines for key metrics

### Additional resources by persona

#### For beginners

**Helpful Guides:**

* [API glossary](https://www.sportmonks.com/glossary/) - Common terms explained
* [Understanding JSON](https://www.sportmonks.com/glossary/json-response/) - How to read responses
* [Postman tutorial](https://www.postman.com/sportmonks-api) - Test without code
* [Common errors](https://docs.sportmonks.com/v3/api/error-codes) - Fix issues

#### For experienced developers

**Advanced topics:**

* [Nested includes](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/tips-and-tricks) - Complex queries
* [Bulk operations](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/introduction/pagination) - Process multiple entities

**Performance:**

* [Caching strategies](https://docs.sportmonks.com/v3/welcome/best-practices#caching) - Speed up apps
* Database Design - Store efficiently
* Monitoring - Track usage

#### For migrators

**Migration tools:**

* [API v2 to v3 Mapping](https://docs.sportmonks.com/v3/welcome/differences-between-api-2-and-api-3) - Endpoint changes

### Need help?

Can't find what you're looking for? We're here to help:

#### Quick help

* **Search documentation** - Use search bar above
* **Browse tutorials** - [All Tutorials](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials)

#### Direct Support

* **Email:** <support@sportmonks.com>
* **Sales:** For plan questions

#### Report Issues

* **Bug report:** [Submit Issue](maito:support@sportmonks.com)
* **Documentation feedback:** Use smile /frown emojis
* **Feature request:** [Submit Request](https://maito:support@sportmonks.com/)

### See also

* [Full tutorial index](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials)
* [API reference](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints)
* [Best practices](https://docs.sportmonks.com/v3/welcome/best-practices)
* [Error codes](https://docs.sportmonks.com/v3/api/error-codes)