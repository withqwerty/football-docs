---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-api-basics
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.191Z
---
# Soccer API Basics

## Intro

Sportradar's Soccer data is delivered as a RESTful B2B (Business-to-Business) API. HTTP requests are made using the [API authentication](https://developer.sportradar.com/getting-started/docs/authentication) access established in [your account](https://developer.sportradar.com/getting-started/docs/your-account).

Data can be returned in either JSON or XML format.

<br />

***

## Technical Requirements

To accept data from our API feeds, ensure that your application:

* Supports TLS 1.2 or above
* Can follow an HTTP redirect (used in [Push](https://developer.sportradar.com/soccer/reference/soccer-push-feeds) and the [Images API](https://developer.sportradar.com/images-and-editorials/reference/images-overview))

<br />

***

## API Style

The Soccer API is a Sportradar [General Sport API](https://developer.sportradar.com/getting-started/docs/coverage-information#-league-specific--general-sport-apis). This means it was designed specifically for the sport of soccer, and an aim to provide our media customers with in-depth, intuitive, and speedy soccer statistics.

We also provide an additional soccer data API, [Soccer Extended](https://developer.sportradar.com/soccer/reference/soccer-extended-overview).

Our Soccer Extended API provides an expansive array of statistics unavailable in the [Soccer API](https://developer.sportradar.com/soccer/reference/soccer-overview). **100+** unique data points are available, including passes, tackles, dribbles, crosses, blocks, interceptions, chances created, and more!

Over 20 top leagues are available, with **1,000+** total competitions covered. See our [Coverage Matrix](https://coverage-matrix.sportradar.com/) for a detailed breakdown of competitions and data offered.

Additional features include:

* XY coordinates for all events
* Match stats available by period
* AI-driven live text commentary\*
* AI-driven match previews, half summaries, and full time summaries\*

Real-time customers are also offered two delivery [Push Feeds](https://developer.sportradar.com/soccer/reference/soccer-extended-push-feeds) to enhance speed.

An extended [Probabilities](https://developer.sportradar.com/soccer/reference/soccer-extended-probabilities-feeds) package is also offered. This add-on includes in-game probability updates and season outrights.

\*This commentary is AI-generated and provided for informational purposes only.

  ### Soccer API vs. Soccer Extended API

  To learn more about the differences between the Soccer API and the Soccer Extended API, see our [**feature comparison guide**](https://developer.sportradar.com/soccer/docs/soccer-api-vs-soccer-extended-api).

  All concepts covered in this guide apply to both the Soccer API and Soccer Extended API. If a feature or rule applies only to Soccer Extended, we note that explicitly.

<br />

***

## API Coverage

Our API provides coverage across **a global suite of men’s and women’s leagues**, including top-tier competitions and emerging markets worldwide. [Learn more here](http://developer.sportradar.com/soccer/docs/soccer-ig-data-coverage-tiers).

To help developers manage varying levels of data detail, the API is logically organized into 9 tiers—with Tier 1 offering the most comprehensive coverage and Tier 9 the most limited. You can explore which competitions fall under each tier using the [Coverage Matrix](https://coverage-matrix.sportradar.com/).

For a specific season, the [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) endpoint provides valuable metadata about what's included. This includes the availability of:

* Player Transfers
* Missing Players
* Team Squads
* Season Statistics
* Match-level coverage granularity, such as extended, deeper, or basic data packages

This tiered structure helps set accurate expectations around data availability and enables more flexible integration across different levels of competition.

  ### Understanding Competitions and Seasons

  * **Competition** refers to an organized tournament or league in which teams compete, such as the Premier League, FIFA World Cup, or UEFA Champions League. Each competition has a unique `competition_id`.
  * **Season** represents a specific instance or edition of a competition, typically tied to a year or range of years (e.g., Premier League 2024/25). Each season has a unique `season_id` and includes all matches, teams, and data for that timeframe within the competition.

<br />

***

## Data Collection

The Soccer API is available in version v4, which includes our most up-to-date and stable feature set. We recommend all users adopt and build with this version for the best experience. To access Soccer v4, include v4 in the version parameter of your API requests—no additional configuration is needed.

<br />

***

## Supported Languages

The Soccer API supports multiple languages to help you deliver localized experiences to global audiences.

You can request data in various supported languages by including the appropriate language code in your API request.

`https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/sport_events/{sport_event_id}/timeline.{format}`

This ensures that country names, [sport event descriptions](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline), [fun facts](https://developer.sportradar.com/soccer/reference/soccer-sport-event-fun-facts), other text-based fields are returned in your preferred language where available.

#### List of Supported Languages

* `da` (Danish)
* `de` (German)
* `el` (Greek)
* `en` (English)
* `es` (Spanish)
* `fi` (Finnish)
* `fr` (French)
* `id` (Indonesian)
* `it` (Italian)
* `ja` (Japanese)
* `nl` (Dutch)
* `pt` (Portuguese)
* `ru` (Russian)
* `sr` (Serbian)
* `sr1` (Serbian Latin)
* `th` (Thai)
* `tr` (Turkish)
* `zh` (Chinese - simplified)
* `zht` (Chinese - traditional)

<br />

***

## Versioning

The Soccer API is on version 4, featuring our most up-to-date and stable feature set. We recommend all users adopt and build with this version for the best experience. To access Soccer v4, include `v4` in the version parameter of your API requests.

<br />

***

## Data Flow and Retrieval

The Soccer API organizes its data into logical endpoints, or feeds. For example, to access a team's schedule you will want to retrieve the  [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules); to access a match, you will want to retrieve a "Sport Event" feed like [Sport Event Timelines](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) or [Sport Event Summaries](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary).

The Soccer API is separated into 52 distinct feeds, each with a focused purpose to allow for efficient data retrieval. Depending on your specific need, different feeds and pull frequencies are needed. Use our [Soccer Endpoints](https://developer.sportradar.com/soccer/reference/soccer-competition-info) section for feed documentation and an interactive sandbox.

Most feeds will require the inclusion of a unique Id or parameter. Parameters can range from: season, competition, sport event ID, player ID, or competitor ID. To retrieve these unique Ids you may have to iterate through feeds with larger data sets. See our [ID Handling](https://developer.sportradar.com/soccer/docs/soccer-ig-id-handling) section for more info on Sportradar Ids.

Here is a retrieval path for a player profile.

<p style={{textAlign:"center"}}><b>Step 1</b></p>

<p style={{textAlign:"center"}}><b>Step 2</b></p>

<p style={{textAlign:"center"}}><b>Step 3</b></p>

All Soccer API feeds will follow this pulling logic. Visit our [Integration Scenarios](https://developer.sportradar.com/soccer/docs/soccer-ig-scenarios) section for specific retrieval scenarios.

You can also reference our [Soccer API Map](https://developer.sportradar.com/soccer/reference/soccer-overview#api-map) to get a sense of how the entire API is interconnected.

<br />

### RESTful & Push

Most of our Soccer endpoints are RESTful, but we also include complementary [Push feeds](https://developer.sportradar.com/soccer/docs/soccer-ig-push) available for Realtime customers.

With RESTful feeds, a request must be made whenever a data update is needed. For our Push feeds, one request will open up a streaming connection. Data is then delivered in a continuous stream indefinitely.

Push feeds correlate to the RESTful endpoints, but are not necessarily 1:1 in parity. For example, the [Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events) feed follows the same format, and includes nearly all of the same data, as the [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) RESTful endpoint. And [Push Statistics](https://developer.sportradar.com/soccer/reference/soccer-push-statistics) correlates to [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary).

For increased data speed, and less API requests, many customers use Push. Though it is important to note that Push feeds are not meant to replace the RESTful data, but to enhance it. RESTful feeds should always be used as the backbone of the Soccer API.

See our [Push Feeds](https://developer.sportradar.com/soccer/docs/soccer-ig-push) section for more info.

<br />

### Monitoring Data Changes

The Soccer API offers the following feeds to help you track changes to data:

* [Sport Events Created](https://developer.sportradar.com/soccer/reference/soccer-sport-events-created) – Returns IDs for sport events created in the last 24 hours.
* [Sport Events Removed](https://developer.sportradar.com/soccer/reference/soccer-sport-events-removed) – Returns IDs for sport events that have been removed due to entry errors. These IDs remain available in the feed for 2 weeks.
* [Sport Events Updated](https://developer.sportradar.com/soccer/reference/soccer-sport-events-updated) – Returns IDs for sport events that have been updated in the last 24 hours.

When using the **Sport Events Updated** feed, you can track updates to matches by using the returned `sport_event_id`. This allows you to cross-reference with other feeds—such as stats, lineups, or play-by-play—to identify what has changed. Common updates include stat revisions or event corrections. Comparing the latest data with your previously stored data helps you pinpoint what was impacted.

<br />

***

## Pagination

The Soccer API uses pagination to manage the volume of data returned in a single response. On busy match days, there may be hundreds of events and thousands of statistics provided. Returning all of this at once could lead to performance issues or timeouts.

For details on how pagination works for supported endpoints, refer to our [Soccer API endpoint documentation](https://developer.sportradar.com/soccer/reference/soccer-competition-info).

<br />

***

## Additional Integration Options

<br />

### OpenAPI Specs

#### Soccer

[Soccer v4 OpenAPI](https://api.sportradar.com/soccer/trial/v4/openapi/swagger/index.html)

[Soccer v4 Probabilities OpenAPI](https://api.sportradar.com/soccer-probabilities/trial/v4/openapi/swagger/index.html)

#### Soccer Extended

[Soccer Extended v4 OpenAPI](https://api.sportradar.com/soccer-extended/trial/v4/openapi/swagger/index.html)

[Soccer Extended v4 Probabilities OpenAPI](https://api.sportradar.com/soccer-extended-probabilities/trial/v4/openapi/swagger/index.html)

<br />

### Postman Workspace

<a href="https://app.getpostman.com/run-collection/782198-098da692-3ef4-48fd-bb5d-84601f56040f?action=collection%2Ffork&collection-url=entityId%3D782198-098da692-3ef4-48fd-bb5d-84601f56040f%26entityType%3Dcollection%26workspaceId%3Da6193b92-ee53-4979-bbfe-7ffdc589c3fc"><img src="https://run.pstmn.io/button.svg"/></a>

Our entire Media APIs are available on Postman. Click the link above to be taken directly to our Soccer API collection.

Feel free to follow and/or fork any collections to receive updates.

<br />

### Schema Download

Open the zip file below to access our entire Soccer API XSD schema.

[Soccer v4 Schema](https://api-docs.sportradar.us/soccer/Soccer_v4.zip)

  ### More Questions?

  Check our **[Soccer API FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq)** or reach out to our support team at [support@sportradar.com](mailto:support@sportradar.com)

<br />

### Simulations

Test your integration by replaying recorded matches on demand using both REST and Push feeds. See the Simulations documentation for available recordings, supported endpoints, and session handling.

<br />

<br />
