---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.192Z
---
# Update Frequencies

## Intro

Soccer API endpoints update at a variable frequency, in terms of both its cache and its data.

Given your limited amount of API requests and QPS, these frequencies should be understood and factored into your pull rate.

Use this section to help determine the best pull frequency for your needs.

<br />

***

## Time-to-Live (TTL) and Data Updates

Understanding the distinction between TTL and data updates is crucial for designing an efficient and reliable Soccer API solution. TTL is focused on the validity of cached data to optimize performance, whereas data updates are concerned with the actual data within the API.

<br />

### Time-to-Live (TTL)

Time-to-Live (TTL) is a mechanism used to define the lifespan of data in a cache or network. It specifies the duration for which the data remains valid and can be reused. Once the TTL expires, the data could be stale and must be re-fetched.

You can find the TTL for each RESTful feed in the response header of a request under `Cache-Control`. A response of `public, must-revalidate, max-age=300` signifies a time-to-live of 300 seconds.

<br />

### Data Updates

Data Updates refer to the changes made to the underlying data that the API provides access to. This can occur through various operations such as creating, updating, or deleting our sports data.

Data updates are critical to ensuring that the API delivers the most current and accurate information. Data entry workflows and processes specific to Soccer data will affect your suggested request frequency.

<br />

***

## Additional Frequency Resources

Visit our Headers documentation to learn how to interpret and use header responses to access the freshest sports data.

<br />

***

## Frequency Chart

What is the right request frequency for your use? Which endpoints should you pull to get the most efficient use of your allotted calls?

The below chart provides answers to these questions, with a breakdown of the cache and data updates for every Soccer (and Soccer Extended) API endpoint, as well as our recommended pulling frequency.

  ### Note on Update Frequencies by Tier

  Update frequencies in the table below reflect Tier 1 league coverage. Since coverage levels vary across tiers, data from lower-tier leagues may update less frequently.

<Table align={["left","left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        Endpoint
      </th>

      <th>
        TTL / Cache
      </th>

      <th>
        Data Updates
      </th>

      <th>
        Recommended Pull

        (Non-Live)
      </th>

      <th>
        Recommended Pull

        (Live)
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        [Competition Info](https://developer.sportradar.com/soccer/reference/soccer-competition-info)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Tournaments are added within 4 hours of official publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Competition Seasons](https://developer.sportradar.com/soccer/reference/soccer-competition-seasons)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Tournaments are added within 4 hours of official publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Competitions](https://developer.sportradar.com/soccer/reference/soccer-competitions)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Tournaments are added within 4 hours of official publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Competitor Profile](https://developer.sportradar.com/soccer/reference/soccer-competitor-profile)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Player/roster data checks occur two weeks before the competition start
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Results are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case

        Note that this feed should be used for schedule info prior to a match start. For status of a live match, reference a "sport event" endpoint
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the quickest result information
      </td>
    </tr>

    <tr>
      <td>
        [Competitor Summaries](https://developer.sportradar.com/soccer/reference/soccer-competitor-summaries)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Statistics are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case

        Note that this feed should be used for schedule info prior to a match start. For status of a live match, reference a "sport event" endpoint
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the quickest stat updates
      </td>
    </tr>

    <tr>
      <td>
        [Competitor vs Competitor](https://developer.sportradar.com/soccer/reference/soccer-competitor-vs-competitor)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Statistics are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case

        Note that this feed should be used for schedule info prior to a match start. For status of a live match, reference a "sport event" endpoint
      </td>

      <td>
        Pull \~1 minute after a match has closed to receive the quickest updates
      </td>
    </tr>

    <tr>
      <td>
        [Daily Schedules](https://developer.sportradar.com/soccer/reference/soccer-daily-schedules)
      </td>

      <td>
        1 second
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Match status and scores are updated in realtime
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Can request as fast as every second (matching the TTL) when matches are live

        However, for more comprehensive match statistics and events, use a "sport event" or "live" feed
      </td>
    </tr>

    <tr>
      <td>
        [Daily Summaries](https://developer.sportradar.com/soccer/reference/soccer-daily-summaries)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Statistics are updated as events occur during matches
      </td>

      <td>
        Pull every hour or less, depending on your use case

        Note that this feed should be used for schedule info prior to a match start. For status of a live match, reference a "sport event" endpoint
      </td>

      <td>
        Can request as fast as every 300s (matching the TTL) when matches are live

        However, for quicker and more comprehensive match statistics, use a "sport event" or "live" feed
      </td>
    </tr>

    <tr>
      <td>
        [FIFA Rankings](https://developer.sportradar.com/soccer/reference/soccer-extended-fifa-rankings)

        Soccer Extended only
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Rankings are updated after each official FIFA publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [League Timeline](https://developer.sportradar.com/soccer/reference/soccer-league-timeline)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Statistics are updated as events occur during matches
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Can request as fast as every 300s (matching the TTL) when matches are live
      </td>
    </tr>

    <tr>
      <td>
        [Live Schedules](https://developer.sportradar.com/soccer/reference/soccer-live-summaries)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Feed can be ignored until a few  minutes before kickoff.

        Utilize the Sport Event Updated feed to capture data changes after a match has ended
      </td>

      <td>
        Can request as fast as every second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Live Summaries](https://developer.sportradar.com/soccer/reference/soccer-live-summaries)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Feed can be ignored until a few  minutes before kickoff

        Utilize the Sport Event Updated feed to capture data changes after a match has ended
      </td>

      <td>
        Can request as fast as every second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Live Timelines](https://developer.sportradar.com/soccer/reference/soccer-live-timelines)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Feed can be ignored until a few  minutes before kickoff

        Utilize the Sport Event Updated feed to capture data changes after a match has ended
      </td>

      <td>
        Can request as fast as every second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Live Timelines Data](https://developer.sportradar.com/soccer/reference/soccer-live-timelines)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Feed can be ignored until a few  minutes before kickoff

        Utilize the Sport Event Updated feed to capture data changes after a match has ended
      </td>

      <td>
        Can request as fast as every second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Competitor Mappings](https://developer.sportradar.com/soccer/reference/soccer-competitor-mappings)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Data updates as relevant changes are made to API
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Player Mappings](https://developer.sportradar.com/soccer/reference/soccer-player-mappings)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Data updates as relevant changes are made to API
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Player Merge Mappings](https://developer.sportradar.com/soccer/reference/soccer-player-merge-mappings)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Data updates as relevant changes are made to API
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Player Profile](https://developer.sportradar.com/soccer/reference/soccer-player-profile)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Player data checks occur two weeks before competition start
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Player Schedules](https://developer.sportradar.com/soccer/reference/soccer-player-schedules)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules and results are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the quickest result information
      </td>
    </tr>

    <tr>
      <td>
        [Player Summaries](https://developer.sportradar.com/soccer/reference/soccer-player-summaries)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules and statistics are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the latest stat information
      </td>
    </tr>

    <tr>
      <td>
        [Season Competitors](https://developer.sportradar.com/soccer/reference/soccer-season-competitors)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Data check two weeks before competition start
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Season Form Standings](https://developer.sportradar.com/soccer/reference/soccer-season-form-standings)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Goal differentials are updated as goals are scored

        Result statistics (wins, losses, ties) are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Pull \~1 minute after a match has closed for the latest match results and splits
      </td>
    </tr>

    <tr>
      <td>
        [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Tournaments are added within 4 hours of official publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Season Leaders](https://developer.sportradar.com/soccer/reference/soccer-season-leaders)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Statistics are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the latest stat information
      </td>
    </tr>

    <tr>
      <td>
        [Season Lineups](https://developer.sportradar.com/soccer/reference/soccer-season-lineups)
      </td>

      <td>
        30 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Lineups are typically available up to one hour before kickoff and up to 15 minutes after the match begins
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Can request as fast as every 30 seconds (matching the TTL) when a matches are live

        However, for quicker lineup and substitution data, pull the Sport Event Timeline and Sport Event Lineups feeds
      </td>
    </tr>

    <tr>
      <td>
        [Season Links](https://developer.sportradar.com/soccer/reference/soccer-season-links)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Tournaments are added within 4 hours of official publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the quickest updates
      </td>
    </tr>

    <tr>
      <td>
        [Season Missing Players](https://developer.sportradar.com/soccer/reference/soccer-season-missing-players)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Player data checks occur two weeks before competition start
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Season Over/Under Statistics](https://developer.sportradar.com/soccer/reference/soccer-season-overunder-statistics)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Statistics are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Pull \~5 minutes after a match has closed to receive the latest stat information
      </td>
    </tr>

    <tr>
      <td>
        [Season Players](https://developer.sportradar.com/soccer/reference/soccer-season-players)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Player data checks occur two weeks before competition start
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Season Probabilities](https://developer.sportradar.com/soccer/reference/soccer-season-probabilities)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Probabilities added within four hours after official publish
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Pull \~1 minute after a match has closed for the latest probabilities update
      </td>
    </tr>

    <tr>
      <td>
        [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Scores are updated as goals are made
      </td>

      <td>
        Pull every hour or less, depending on your use case

        Note that this feed should be used for schedule info prior to a match start. For status of a live game, reference a "sport event" endpoint
      </td>

      <td>
        Can request as fast as every 300 seconds (matching the TTL) during matches

        However, for quicker scoring updates, reference a "live" or "sport event" endpoint
      </td>
    </tr>

    <tr>
      <td>
        [Season Standings](https://developer.sportradar.com/soccer/reference/soccer-season-standings)
      </td>

      <td>
        10 seconds
      </td>

      <td>
        Rankings and goal differentials update as goals are scored
      </td>

      <td>
        Pull every hour or less, depending on your use case.
      </td>

      <td>
        Can request as fast as every 10 seconds (matching the TTL) during matches
      </td>
    </tr>

    <tr>
      <td>
        [Season Summaries](https://developer.sportradar.com/soccer/reference/soccer-season-summaries)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Schedules are added within 4 hours of official publication

        Statistics are updated as match events occur
      </td>

      <td>
        Pull every hour or less, depending on your use case

        Note that this feed should be used for schedule info prior to a match start. For status of a live match, reference a "sport event" endpoint
      </td>

      <td>
        Can request as fast as every 300 seconds (matching the TTL) during matches

        However, for quicker stat updates, reverence a "live" or "sport event" endpoint
      </td>
    </tr>

    <tr>
      <td>
        [Season Transfers](https://developer.sportradar.com/soccer/reference/soccer-season-transfers)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Transfer updates are available within 24 hours after official publication
      </td>

      <td>
        Pull every hour or less, depending on your use case
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Season Venues](https://developer.sportradar.com/soccer/reference/soccer-season-venues)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Available as seasons are created
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Seasonal Competitor Players](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-players)
      </td>

      <td>
        30 seconds
      </td>

      <td>
        Statistics are updated as match events occur
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Seasonal Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics)
      </td>

      <td>
        30 seconds
      </td>

      <td>
        Statistics updated in realtime
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Can request as fast as every 30 seconds (matching the TTL) during matches
      </td>
    </tr>

    <tr>
      <td>
        [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Tournaments are added within 4 hours of official publication
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Seasons Disabled](https://developer.sportradar.com/soccer/reference/soccer-seasons-disabled)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Data updates as seasons are enabled or disabled
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Sport Event Fun Facts](https://developer.sportradar.com/soccer/reference/soccer-sport-event-fun-facts)
      </td>

      <td>
        300 seconds
      </td>

      <td>
        Facts can be added up to a week before the match
      </td>

      <td>
        For the earliest access to match facts, make your first request within five days of the confirmed match start.

        Facts remain accessible at any time after they become available.
      </td>

      <td>
        For the earliest access to match facts, make your first request within five days of the confirmed match start.

        Facts remain accessible at any time after they become available.
      </td>
    </tr>

    <tr>
      <td>
        [Sport Event Lineups](https://developer.sportradar.com/soccer/reference/soccer-sport-event-lineups)
      </td>

      <td>
        1 second
      </td>

      <td>
        Lineups are typically available up to one hour before kickoff and up to 15 minutes after the match begins

        Lineup changes during a match are updated in realtime.
      </td>

      <td>
        Lineups should start to be requested 75 minutes before the scheduled start

        Can request as fast as every 1 second (matching the TTL) before a match starts
      </td>

      <td>
        Can request as fast as every 1 second (matching the TTL) during the match to capture any lineup changes.
      </td>
    </tr>

    <tr>
      <td>
        [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Feed can be ignored until a few  minutes before kickoff, depending on your use case

        Utilize the Sport Event Updated feed to capture data changes after a match has ended
      </td>

      <td>
        Can request as fast as every 1 second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Feed can be ignored until a few  minutes before kickoff, depending on your use case

        Utilize the Sport Event Updated feed to capture data changes after a match has ended
      </td>

      <td>
        Can request as fast as every 1 second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Sport Events Created](https://developer.sportradar.com/soccer/reference/soccer-sport-events-created)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Last 24 hours
      </td>

      <td>
        Pull every hour or less depending on your use case.
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Sport Events Removed](https://developer.sportradar.com/soccer/reference/soccer-sport-events-removed)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Last 24 hours
      </td>

      <td>
        Pull every hour or less depending on your use case
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Sport Events Updated](https://developer.sportradar.com/soccer/reference/soccer-sport-events-updated)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Last 24 hours
      </td>

      <td>
        Pull every hour or less depending on your use case
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Live Probabilities](https://developer.sportradar.com/soccer/reference/soccer-live-probabilities)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Can request as fast as every 1 second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Season Outright Probabilities](https://developer.sportradar.com/soccer/reference/soccer-season-outright-probabilities)
      </td>

      <td>
        60 seconds
      </td>

      <td>
        Initial season outright probabilities are added within four hours of official publication.

        Outright probabilities are updated when matches are closed (`"status": "closed"`)
      </td>

      <td>
        Pull every hour or less depending on your use case
      </td>

      <td>
        Pull \~1 minute after a match has closed for the latest probabilities update
      </td>
    </tr>

    <tr>
      <td>
        [Sport Event Probabilities](https://developer.sportradar.com/soccer/reference/soccer-sport-event-probabilities)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Can request as fast as every 1 second (matching the TTL) when a match is live
      </td>
    </tr>

    <tr>
      <td>
        [Sport Event Upcoming Probabilities](https://developer.sportradar.com/soccer/reference/soccer-sport-event-upcoming-probabilities)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Pull every hour or less depending on your use case
      </td>

      <td>
        Not applicable
      </td>
    </tr>

    <tr>
      <td>
        [Timeline Probabilities](https://developer.sportradar.com/soccer/reference/soccer-timeline-probabilities)
      </td>

      <td>
        1 second
      </td>

      <td>
        Realtime
      </td>

      <td>
        Pull on an as needed basis
      </td>

      <td>
        Can request as fast as every 1 second (matching the TTL) when a match is live
      </td>
    </tr>
  </tbody>
</Table>

  ### Important Note

  Pull recommendations are based on a typical customer's needs. We suggest starting with our recommended rate and adjusting as necessary according to your needs.

<br />

<br />

<br />

<br />
