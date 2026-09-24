---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-overview
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Extended Overview

## Introduction

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

<br />

***

## API Map

To best utilize the Soccer Extended v4 API, you will need specific parameters to create your API calls. The map below shows every feed in the API, grouped by task; the key marks the identifier each feed takes, and each entry links out to its endpoint page.

Feeds that require no ID, or only a date, can be called directly. Their responses provide the competition, season, sport event, competitor, and player IDs that the remaining feeds take.

_(Diagram omitted: see the source page.)_

***

### Endpoint Descriptions

**Competition Info** – Provides the name, id, and parent id for a given competition.

**Competition Seasons** – Provides historical season information for a given competition. Competitions will return a maximum of three seasons of data, including current or newly created seasons.

**Competitions** – Provides a list of all available Soccer competitions.

**Competitor Mappings** – Provides competitor id mapping between previous versions of the Soccer API.

**Competitor Profile** – Provides top-level information for a given team, including the full team roster, manager, home venue, and team colors.

**Competitor Schedules** – Provides all upcoming scheduled matches and results for the past 30 matches for a given team.

**Competitor Summaries** - Provides previous and upcoming match information for a given competitor, including statistics for past matches and scheduling info for upcoming matches.

**Competitor Versus Competitor** – Provides previous and upcoming matches between two teams including scoring information, player and team match statistics.

**Daily Schedules** – Provides match information for a given day including team scoring, player and team match statistics.

**Daily Summaries** – Provides a list of scheduled matches for a given day.

**FIFA Rankings** – Provides the FIFA World Rankings for national soccer teams.

**League Timeline** - Provides an alternate set of statistics for an event which match official league sites. Official stats are provided for: England Premier League, Germany Bundesliga, Italy Serie A, Spain La Liga, UEFA Champions League, USA MLS, Austria Bundesliga.

**Live Schedules** - Provides match information for all currently live matches. This feed updates in real time as matches are played. Matches appear a few minutes before kick-off and disappear a few minutes after the match reaches “ended” status.

**Live Summaries** - Provides match information for all currently live matches including team scoring, player and team match statistics. This feed updates in real time as matches are played. Matches appear a few minutes before kick-off and disappear a few minutes after the match reaches “ended” status.

**Live Timelines** – Provides a play-by-play event timeline for currently live matches. Matches appear a few minutes before kick-off and disappear a few minutes after the match reaches “ended” status.

**Live Timelines Delta** – Provides a 10 second live delta of match information, including scoring and a play-by-play event timeline.

**Player Mappings** – Provides player id mapping between previous versions of the Soccer API.

**Player Merge Mappings** – Provides valid ids for players who have had their profiles merged. While Sportradar always strives to provide one unique player id, it is a possibility for two ids to be created. This feed provides the correct id once profiles have been merged.

**Player Profile** – Provides player information, including current and historical team membership info.

**Player Schedules** - Provides schedules and results of the last 10 matches played for a given player.

**Player Summaries** - Provides match info and statistics for the past 10 matches in which a given player participated.

**Season Competitors** – Provides a list of teams participating for a given season.

**Season Information** – Provides detailed information for a given season, including participating teams and coverage level.

**Season Leaders** – Provides a list of leaders for a given season. Statistics include points, goals, assists, cards, and minutes played.

**Season Lineups** – Provides match lineups and substitutions for a given season.

**Season Links** – Provides information about linked cup rounds for a given season. Use this feed to compile full advancement brackets for relevant seasons/tournaments. Links between all matches and rounds are available when competitors (TBD vs. TBD) are not yet known.

**Season Missing Players** – Provides a list of injured and/or missing players for a given season.

**Season Over/Under Statistics** – provides the over/under match goal totals for all teams in a given season.

**Season Players** – Provides names and ids for all participating players for a given season.

**Season Probabilities** – Provides 3-way win probabilities (home team win, away team win, draw) for all matches for a given season.

**Season Schedule** – Provides basic match information for all matches for a given season, including scoring and match coverage.

**Season Standings** – Provides detailed standings info for a given season.

**Season Summaries** - Provides information for all matches from a given season including scoring and statistics at the match level.

**Season Transfers** - Provides a list of player transfers for a given season, showing only transfers into the competition. When a player leaves, that move is reflected in the destination competition's season feed rather than this one.

**Season Venues** – Provides a list of venues associated with a given season.

**Seasonal Competitor Extended Statistics** - Provides extended team and player seasonal statistics for a given season. "Extended" data includes player and team stats with 100+ unique data points.

**Seasonal Competitor Players** – Provides player roster information for every team from a given season.

**Seasonal Competitor Statistics** – Provides team and player seasonal statistics for a given season.

**Seasons** – Provides a list of historical season information for all competitions. Competitions will return a maximum of three seasons of data, including current or newly created seasons.

**Seasons Disabled** – Provides a list of currently disabled seasons, including future seasons that have not yet been enabled.

**Sport Event Extended Summary** – Provides real-time match-level statistics for a given match. "Extended" data includes player and team stats by period and 100+ unique data points.

**Sport Event Extended Timeline** – Provides a real-time event timeline for a given match. "Extended" data includes passes, tackles, dribbles, interceptions, x/y coordinates, and event metadata.

**Sport Event Fun Facts** – Provides noteworthy, human-readable, facts based on statistical information about a given match and its competing teams.

**Sport Event Insights** – Provides selected, AI generated, pre-match and live insights based on statistical information about a given match and its competing teams.

**Sport Event Lineups** – Provides detailed roster information for a given match. Starting players, substitutions, formation type, and channel availability are included if supported by coverage level.

**Sport Event Momentum** – Provides minute-by-minute momentum values for each team in a given match.

**Sport Event Summary** - Provides real-time match-level statistics for a given match. Including player and team stats, scoring info, and channel availability. Please note that data returned is determined by coverage level.

**Sport Event Timeline** – Provides real-time match-level statistics and a play-by-play event timeline for a given match. This includes player and team stats, scoring info, channel availability, x/y event coordinates, and human-readable event descriptions. Please note that data returned is determined by coverage level.

**Sport Events Created** – Provides ids for sport events that have been created in the last 24 hours.

**Sport Events Removed** – Provides ids for sport events that have been removed or deleted.

**Sport Events Updated** - Provides ids for sport events that have been updated in the last 24 hours.

**Push Events** - Provides real-time event updates for all live matches.

**Push Statistics** - Provides real-time team and player match-level statistics for all live matches.

**Live Probabilities** - Provides top-level information for live matches. If probabilities are available for a match, pre-match and live probabilities will be displayed.

**Season Outright Probabilities** - Provides a list of outright probabilities for each competitor from a given season.

**Sport Event Probabilities** - Provides pre-match and live probabilities for a given match.

**Sport Event Upcoming Probabilities** - Provides a list of IDs for upcoming sport events in the next 24 hours.

**Timeline Probabilities** - Provides a timeline of pre-match and live probability changes for a given match. This also provides match information including player stats, team stats, and scoring info.

  ### Probabilities Endpoints

  Available only with the probabilities plan within the Soccer Extended v4 package. See our [FAQ](https://developer.sportradar.com/soccer/reference/soccer-faq#probabilities) for details.

***

### Data Retrieval Samples

To find the fun facts for a given match:

- Call the daily summaries for the date of the match and find the Sport Event Id for the chosen match- Call the Sport Event Fun Facts using the Sport Event Id- Locate the Fact Statement

The fun facts for the match are displayed.

***

To find a team's number of goals by headers for the current season:

- Call the daily summaries and find the desired Competitor Id- Make note of the Season Id for the current season- Call the seasonal competitor statistics using the Team Id and Season Id- Locate the statistics - goals_by_head

The team's number of goals by headers is displayed.

<br />

***

## Integration Links

<br />

### OpenAPI Specs

Our Soccer Extended API is available via OpenAPI. Click below to view and/or download the spec.

[Soccer Extended v4 OpenAPI](https://api.sportradar.com/soccer-extended/trial/v4/openapi/swagger/index.html)

[Soccer Extended v4 Probabilities OpenAPI](https://api.sportradar.com/soccer-extended-probabilities/trial/v4/openapi/swagger/index.html)

<br />

### Postman Workspace

  ## Run in Postman

  Our full Media API suite—including the Soccer Extended collection—lives in our public Postman workspace. Fork or follow any collection to get updates automatically.

  <a href="https://app.getpostman.com/run-collection/17203961-4b444667-2e12-4767-a2c7-e542efca23b5?action=collection%2Ffork&collection-url=entityId%3D17203961-4b444667-2e12-4767-a2c7-e542efca23b5%26entityType%3Dcollection%26workspaceId%3Da6193b92-ee53-4979-bbfe-7ffdc589c3fc">
    <img src="https://run.pstmn.io/button.svg" />
  </a>

<br />

### Schema Download

Open the zip file below to access our entire Soccer Extended API XSD schema.

[Soccer Extended v4 Schema](https://api-docs.sportradar.us/soccer/Soccer_Extended_v4.zip)

<br />

### Simulations

Check out our Simulations to replay actual games at any time, on your own schedule.

<br />

### MCP Server

The **Sportradar Soccer Extended MCP Server** is a Model Context Protocol (MCP) implementation that bridges AI assistants directly to our Soccer Extended API feeds. It allows LLMs to use standardized tools to fetch our sports data, helping to power your applications, assist in coding, and streamlining your integration.

For detailed instructions on how to set up and use this integration, visit our MCP Server documentation.

<br />

***

## Failover Info

<p>If our scout feed goes down or becomes unavailable, Sportradar takes over Live Data Entry (LDE) to provide a failover.</p> <p>In case of a failover, we follow one of the following scenarios:</p>

- We are unable to provide deeper player or team stats, such as shots, corners, assists, and offsides. We will deliver only basic stats and events such as goals, cards, and substitutions with player names.
- We are unable to provide deeper player or team stats and player names for all basic events, such as cards, substitutions, shots, corners, assists, and offsides. We will display player names for goals.
