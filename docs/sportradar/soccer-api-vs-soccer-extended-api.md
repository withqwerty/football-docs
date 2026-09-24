---
source_url: https://developer.sportradar.com/soccer/docs/soccer-api-vs-soccer-extended-api
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.191Z
---
# Soccer API vs. Soccer Extended: Feature Comparison

Sportradar offers two primary soccer data APIs:

* [Soccer API](https://developer.sportradar.com/soccer/reference/soccer-overview): Provides comprehensive coverage of global soccer competitions, delivering real-time updates and a wide range of statistics.
* [Soccer Extended API](https://developer.sportradar.com/soccer/reference/soccer-extended-overview): An enhancement of the standard Soccer API, offering deeper insights with advanced statistics and features for a more detailed analysis.

<br />

## Feature Comparison

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Feature
      </th>

      <th>
        Soccer API
      </th>

      <th>
        Soccer Extended API
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Coverage
      </td>

      <td>
        Over 650 competitions worldwide
      </td>

      <td>
        Over 1,000 competitions and enhanced coverage for top-tier leagues.
      </td>
    </tr>

    <tr>
      <td>
        Real-Time Updates
      </td>

      <td>
        Live scores, standings, and basic statistics
      </td>

      <td>
        Includes all Soccer API features, plus enriched play-by-play event details and stats
      </td>
    </tr>

    <tr>
      <td>
        Statistics  
        (Player & Team)  
        (Game & Season)
      </td>

      <td>
        Basic stats: goals, assists, minutes played
      </td>

      <td>
        Advanced stats: passes, tackles, dribbles, crosses, blocks, interceptions, chances created, etc.
      </td>
    </tr>

    <tr>
      <td>
        Event Data
      </td>

      <td>
        Basic event information
      </td>

      <td>
        Detailed event data with XY coordinates for all events
      </td>
    </tr>

    <tr>
      <td>
        AI-Driven Content
      </td>

      <td>
        Not available
      </td>

      <td>
        Live text commentary, match previews, half-time and full-time summaries
      </td>
    </tr>

    <tr>
      <td>
        Probabilities Package
      </td>

      <td>
        Pre-match win probabilities
      </td>

      <td>
        In-game probability updates and season outrights
      </td>
    </tr>

    <tr>
      <td>
        Player Availability
      </td>

      <td>
        Missing players with reason, status, and start date
      </td>

      <td>
        Adds <code>estimated_return_date</code> for a projected return timeline
      </td>
    </tr>
  </tbody>
</Table>

<br />

***

## What's New with Soccer Extended

<br />

### More Detailed Play-by-Play

Get a richer view of the match with extended play-by-play coverage—including passes, tackles, dribbles, and interceptions. Each event includes added context like XY location, body part used, and expected goals (xG), giving you deeper insights into every moment.

**Example**:

`event="shot_on_target" body_part="right_leg" penalty_area="outside" xg_value="0.05"`

<br />

### Extended Statistics and Visualizations

We’ve more than doubled our statistical coverage, from 41 to 100+ datapoints. This update includes period-based breakdowns (1st half, 2nd half, full match) and added positional context, enabling more advanced analysis and visualizations such as:

* Shot Graphics - Enriched with XY coordinates for plotting precise goalface locations

  

* **Pass Maps** - Visualize pass trajectories using start and end XY coordinates

  

* **xG Charts** - Generate cumulative expected goal charts with event-level granularity

  

### Enhanced with AI

AI-powered features are now part of your data feed:

* Live text commentary driven by AI, complementing real-time updates
* AI-generated match previews, halftime summaries, and full-time wrap-ups
* Smarter “fun facts” with AI-driven insights to keep your experiences fresh and engaging

<br />

***

## Upgrade Your Insights with Extended Soccer Data

To unlock access to extended data and take advantage of the new endpoints, contact your Sportradar Sales representative or <sales@sportradar.com>.

Explore what's possible with the [Soccer Extended API](https://developer.sportradar.com/soccer/reference/soccer-extended-overview) including three extended endpoints:

* Extended Timeline – Get richer event-level detail including XY coordinates and added metadata.
* Extended Summary – Access expanded statistics and contextual match data.
* Seasonal Competitor Extended Statistics – Access extended team and player seasonal statistics for a given season.

Reach out today to get started.
