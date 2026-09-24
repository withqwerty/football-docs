---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-tracking-tournaments
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Tracking Tournaments

This integration scenario explains how to track soccer tournaments using the Sportradar Soccer API. It covers how tournament structures are represented, how to build tournament brackets or stage views, and which feeds to use to track matches, statistics, and live match events throughout the tournament.

This scenario is commonly used to:

* Display tournament brackets and stage progression
* Render group stage standings and knockout rounds
* Track scheduled, live, and completed matches
* Monitor match events such as goals, cards, and substitutions
* Retrieve team and player statistics for tournament matches
* Power tournament dashboards and live match centers

<br />

***

## Overview

Soccer tournaments typically consist of **multiple stages**, which may include:

* **Group stages**
* **Qualification rounds**
* **Knockout rounds**
* **Two-legged ties**
* **Final championship matches**

From an integration perspective:

* Each match in a tournament is represented as a **sport event**
* Tournament structure is derived from **season, stage, round, and group metadata**
* Some tournaments include **group stages followed by knockout rounds**, which are represented in the API through stage and group structures before advancing to bracket-based rounds
* Some competitions use **league-style stages or playoffs (such as MLS)** where standings determine advancement before entering knockout rounds
* Bracket progression is constructed using **Season Links**
* Match events and statistics are retrieved using **Sport Event endpoints**

Applications track tournament progression using season-level feeds to retrieve the tournament structure and sport event feeds to retrieve match events, statistics, and results.

If your product supports richer match experiences or analytics, the **Soccer Extended API** provides additional endpoints with deeper statistics, expanded events, and event coordinate data.

<br />

### Tournament Structure Example

Competitions in the Soccer API follow a hierarchical structure:

```
competition
 └ season
    └ stage
       └ round
          └ match (sport_event)
```

For example, a tournament like the **FIFA World Cup** may appear structurally as:

```
World Cup
 ├ group stage
 │ ├ group A
 │ ├ group B
 │ ├ group C
 │ └ group D
 └ knockout stage
    ├ round_of_16
    ├ quarterfinal
    ├ semifinal
    └ final
```

Each match within this structure corresponds to a **`sport_event.id`**, which you can use to retrieve match events, statistics, and live updates.

<br />

  ### Tournament Structure Updates

  For **Tier 1 competitions**, tournament structures and match relationships are typically published shortly after official schedules are released. As matches are completed, advancing teams and future matchups are reflected in the **Season Links** feed.

  The [Update Frequencies](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies) page outlines how often data is refreshed and provides recommended call intervals for each REST endpoint. Use it to optimize your polling strategy before, during, and after matches while avoiding unnecessary requests.

<br />

***

## Relevant Feeds

The following feeds are commonly used when tracking soccer tournaments:

| Feed                                                                                                                                                          | Purpose                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Competitions                                                             | Discover available competitions and obtain the competition id for the tournament.                                                        |
| Competition Seasons                                        | Retrieve seasons associated with a competition.                                                                                          |
| Season Links                                                             | Build tournament brackets, retrieve tournament matches, and track match progression across rounds.                                       |
| Sport Event Lineups                                        | Retrieve pre-match and in-match lineup information, including starters, bench players, substitutions, and formation data when available. |
| Sport Event Timeline                                     | Retrieve play-by-play match events such as goals, substitutions, and cards.                                                              |
| Sport Event Summary                                        | Retrieve match statistics including team and player stats.                                                                               |
| Season Standings                                                 | Retrieve current tournament standings for group stages or league-style phases, including post-match table updates.                       |
| Live Summaries                                                       | Retrieve match summaries for all currently live matches.                                                                                 |
| Live Timelines                                                       | Retrieve play-by-play timelines for all currently live matches.                                                                          |
| Sport Event Extended Timeline | Provides expanded event detail and XY event coordinates (Soccer Extended package).                                                       |
| Sport Event Extended Summary    | Provides deeper team and player statistics for a match (Soccer Extended package).                                                        |

<br />

***

## High-Level Workflow

**Discover competition → Build tournament structure → Track lineups, match events, statistics, and standings → Refresh bracket progression**

1. Discover the tournament competition and season
2. Build the tournament structure and retrieve matches using Season Links
3. Track pre-match lineups, live match events, statistics, and standings
4. Refresh the tournament structure after matches complete

<br />

<br />

***

## Integration Steps

<br />

### 1. Discover the Tournament Competition and Season

Start by retrieving competitions to locate the tournament and its competition id.

1. Call the Competitions endpoint to retrieve the list of available competitions.
2. Identify the `competition.id` for the tournament you want to access.
3. Call the Competition Seasons endpoint using the `competition.id` to retrieve the `season.id` for the tournament edition you want to track.

The `season.id` is required for retrieving tournament structure, matches, events, and statistics.

<br />

  ### Understanding Competitions and Seasons

  * A **Competition** in soccer represents a league or tournament, such as the English Premier League, UEFA Champions League, or FIFA World Cup. Each competition has a unique `competition_id`.

  * A **Season** represents a specific edition of that competition, typically aligned with a year or competition cycle (e.g., Premier League 2024–25 or World Cup 2026). Each season has a unique `season_id` and includes all matches, teams, standings, and results associated with that edition of the competition.

<br />

### 2. Build the Tournament Structure

Use the Season Links endpoint to construct the tournament structure. This feed is especially useful for tournaments where:

* competitors are **not yet known**
* matches appear as **TBD vs TBD**
* matches are **linked across knockout rounds**

```http
GET https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/seasons/{season_id}/stages_groups_cup_rounds.{format}
```

```xml Season Links Snippet (xml)
<season_stages_groups_cup_rounds
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2026-03-04T11:33:10+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_stages_groups_cup_rounds.xsd">
	<stages>
		<stage order="1" type="cup" phase="playoffs" start_date="2024-06-29" end_date="2024-07-14" year="2024">
			<groups>
				<group id="sr:cup:157967" group_name="Knockout stage">
					<cup_rounds>
						<cup_round id="sr:cup_round:1984283" name="round_of_16" order="1" state="winner" winner_id="sr:competitor:4698">
							<sport_events>
								<sport_event id="sr:sport_event:45843695" start_time="2024-06-30T19:00:00+00:00" start_time_confirmed="true" order="1"/>
							</sport_events>
							<linked_cup_rounds>
								<cup_round id="sr:cup_round:1984299" type="parent" name="quarterfinal" order="1" state="winner" winner_id="sr:competitor:4698"/>
							</linked_cup_rounds>
						</cup_round>
						<cup_round id="sr:cup_round:1984285" name="round_of_16" order="2" state="winner" winner_id="sr:competitor:4711">
							<sport_events>
								<sport_event id="sr:sport_event:45843693" start_time="2024-06-29T19:00:00+00:00" start_time_confirmed="true" order="1"/>
							</sport_events>
							<linked_cup_rounds>
								<cup_round id="sr:cup_round:1984299" type="parent" name="quarterfinal" order="1" state="winner" winner_id="sr:competitor:4698"/>
							</linked_cup_rounds>
						</cup_round>
```
```json Season Links Snippet (json)
{
  "generated_at": "2026-03-04T10:31:59+00:00",
  "stages": [
    {
      "order": 1,
      "type": "cup",
      "phase": "playoffs",
      "start_date": "2024-06-29",
      "end_date": "2024-07-14",
      "year": "2024",
      "groups": [
        {
          "id": "sr:cup:157967",
          "group_name": "Knockout stage",
          "cup_rounds": [
            {
              "id": "sr:cup_round:1984283",
              "sport_events": [
                {
                  "id": "sr:sport_event:45843695",
                  "start_time": "2024-06-30T19:00:00+00:00",
                  "start_time_confirmed": true,
                  "order": 1
                }
              ],
              "linked_cup_rounds": [
                {
                  "id": "sr:cup_round:1984299",
                  "type": "parent",
                  "name": "quarterfinal",
                  "order": 1,
                  "state": "winner",
                  "winner_id": "sr:competitor:4698"
                }
              ],
              "name": "round_of_16",
              "order": 1,
              "state": "winner",
              "winner_id": "sr:competitor:4698"
            },
            {
              "id": "sr:cup_round:1984285",
              "sport_events": [
                {
                  "id": "sr:sport_event:45843693",
                  "start_time": "2024-06-29T19:00:00+00:00",
                  "start_time_confirmed": true,
                  "order": 1
                }
              ],
              "linked_cup_rounds": [
                {
                  "id": "sr:cup_round:1984299",
                  "type": "parent",
                  "name": "quarterfinal",
                  "order": 1,
                  "state": "winner",
                  "winner_id": "sr:competitor:4698"
                }
              ],
              "name": "round_of_16",
              "order": 2,
              "state": "winner",
              "winner_id": "sr:competitor:4711"
            },
```

In addition to bracket relationships, the feed also returns sport event identifiers and scheduling information when available, allowing applications to both build the tournament structure and identify the matches that belong to each round. Typical structure elements returned include:

* `groups`
* `cup_round`
* `sport_event.id`
* `other_sport_event_id` (for two-legged ties)
* scheduled match timing

Using the relationships returned in the **Season Links** feed, you can construct a tournament bracket similar to the knockout stage used in competitions such as the **FIFA World Cup** or the **MLS Cup Playoffs**.

Each match in the bracket corresponds to a **`sport_event.id`**, while progression between rounds is determined using the **`linked_cup_rounds`** relationships.

**Implementing a Bracket Data Model**

Many applications store tournament brackets using a simple round-based or tree structure derived from the Season Links response:

```
{
  "round_of_16": [
    { "match_id": "sr:sport_event:123", "next_round": "quarterfinal_1" },
    { "match_id": "sr:sport_event:124", "next_round": "quarterfinal_1" }
  ]
}
```

Each match becomes a **node in the bracket**, while **linked rounds determine where winners advance**. Here is the recommended logic:

1. Iterate through rounds returned by the Season Links feed.
2. Group matches under their respective round or stage.
3. Store the `sport_event.id` for each match.
4. Link matches across rounds using round identifiers.
5. Handle two-legged ties by pairing matches using the linked event id.

<br />

### 3. Track Match Events, Statistics, Standings, and Lineups

Once you have the `sport_event.id` for each tournament match, use sport event endpoints to retrieve pre-match and live match data.

Use the Sport Event Lineups feed **before match start** to retrieve lineup information when available, including:

* starting players
* bench players
* formations
* substitutions
* lineup confirmation status

This is useful for powering **pregame match centers, lineup cards, and formation displays**.

Use the [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) feed to retrieve play-by-play match events:

* goals
* substitutions
* yellow and red cards
* match clock updates
* period transitions
* penalty shootout events

Use the [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary) feed to retrieve match statistics including:

* scoring
* player statistics
* match status
* venue information

Use the Season Standings feed to retrieve **current tournament standings** for group stages and league-style phases.

This is useful for:

* showing live or near-live table movement during matchday
* retrieving updated standings after matches complete
* rendering group tables alongside knockout progression where applicable

For **post-match standings**, re-pull Season Standings after matches reach a completed state and official table updates have been published.

For **previous-round standings**, applications should typically store their own standings snapshots over time if historical round-by-round table views are required, since integrations often need to preserve how a table looked at specific points in the tournament.

If deeper statistical coverage is required, the **Soccer Extended API** provides:

* **Sport Event Extended Timeline**
* **Sport Event Extended Summary**

These provide **100+ advanced statistics and event coordinates**.

<br />

  ### Monitoring All Live Matches

  If you want to retrieve information for **all matches currently live**, use the Live feeds:

  * Live Summaries
  * Live Timelines

  These feeds return match status, scoring updates, statistics, and play-by-play events for **all currently live soccer matches**.

  Because these feeds are not limited to a specific tournament, applications should filter results using:

  * `competition.id`
  * `season.id`

  This approach is useful for tournament dashboards that need to quickly detect **which matches in the tournament are currently live**.

<br />

### 4. Refresh the Tournament Structure After Matches Complete

After a match reaches a completed state, re-pull **Season Links** to refresh the tournament bracket. Refreshing updates:

* advancing competitors
* resolved TBD placeholders
* future round matchups

Typical refresh workflow:

1. Monitor match statuses using the [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) or [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary) feeds.
2. When a match reaches `ended`, re-call [Season Links](https://developer.sportradar.com/soccer/reference/soccer-season-links).
3. Update your stored bracket structure

This ensures your bracket remains synchronized with official results.

<br />

  ### FIFA Rankings

  For World Cup competitions, use our FIFA Ranking  endpoint to display each team's world ranking.

<br />

***

## Best Practices

**Tournament Structure**

* Use **Season Links** as the source of tournament bracket structure.
* Store `sport_event.id` for all tournament matches.
* Re-pull **Season Links** after matches reach a completed state to keep tournament brackets updated with advancing competitors and future matchups.

**Match Events, Statistics, and Lineups**

* Use **Sport Event Lineups** before matches start to retrieve starters, bench players, formations, and lineup confirmation status.
* Use **Sport Event Timeline** for match events.
* Use **Sport Event Summary** for match statistics.
* Use **Season Standings** for current and post-match tournament tables.
* Store your own standings snapshots if you need to show historical standings by round or matchday.
* Use **Soccer Extended endpoints** when deeper statistics or advanced event data is required.

**Live Match Monitoring**

* Use **Live endpoints** when you need to detect all currently live matches.
* Filter live results by `competition.id` or `season.id` when monitoring a specific tournament.
