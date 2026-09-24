---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-data-coverage-tiers
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.191Z
---
# Data Coverage and Tiers

## Coverage

The Soccer API provides coverage across **a global suite of men’s and women’s leagues**, including top-tier competitions and emerging markets worldwide.

  ### Understanding Competitions and Seasons

  * **Competition** refers to an organized tournament or league in which teams compete, such as the Premier League, FIFA World Cup, or UEFA Champions League. Each competition has a unique `competition_id`.
  * **Season** represents a specific instance or edition of a competition, typically tied to a year or range of years (e.g., Premier League 2024/25). Each season has a unique `season_id` and includes all matches, teams, and data for that timeframe within the competition.

<br />

## Tiers

To help developers manage varying levels of data detail, the API groups competitions into 9 tiers—with Tier 1 offering the most comprehensive coverage and Tier 9 the most limited.

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Tier
      </th>

      <th>
        Coverage Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        1
      </td>

      <td>
        * Highest coverage<br /> - Live extended match player statistics (passing, tackles, fouls, offsides)<br /> - Live deeper statistics (shots, assists, corner kicks, offsides, etc)<br /> - Live hard facts (goal scorer, cards, substitutions + minute)<br /> - Detailed match timelines<br /> - Pre-match lineups (including formations)<br /> - Match facts<br /> - Post-match league source-matching<br /> - Player and team profiles<br /> - Roster / squad information<br /> - Missing players service<br /> - Live standings<br /> - Stats leaders<br />
      </td>
    </tr>

    <tr>
      <td>
        2
      </td>

      <td>
        * Live deeper statistics (shots, assists, corner kicks, offsides, etc)<br />- Live hard facts (goal scorer, cards, substitutions + minute)<br />- Detailed match timelines<br />- Pre-match lineups (with formations available for most)<br />- Match facts<br />- Player and team profiles<br />- Roster / squad information<br />- Live standings<br />- Stats leaders<br />
      </td>
    </tr>

    <tr>
      <td>
        3
      </td>

      <td>
        * Live hard facts (goal scorer, cards, substitutions + minute)<br />- Basic match timelines<br />- Pre-match lineups (formations available for only a few matches)<br />- Match facts<br />
      </td>
    </tr>

    <tr>
      <td>
        4
      </td>

      <td>
        * Live score updates (with goalscorer + min & red cards also live)<br />- Lineups added post match
        * Hard facts added post match (cards, substitutions + minute)<br />- Standings<br />- Stats leaders<br />
      </td>
    </tr>

    <tr>
      <td>
        5
      </td>

      <td>
        * Live score change only<br />- Lineups added post match<br />- Hard facts added post match (goal scorer, cards, substitutions + minute)<br />- Standings<br />- Stats leaders<br />
      </td>
    </tr>

    <tr>
      <td>
        6 (Cup Competitions)
      </td>

      <td>
        * Cup competitions vary greatly from round to round<br />- Coverage levels generally increase with the popularity of a competition<br />- Most cup competitions start with lower-tier coverage in the early rounds<br />- Supercups are an exception to typical coverage patterns<br />- In high-interest competitions, Supercup matches can receive as high as Tier 2 coverage<br />- Standings are not provided for cup competitions
      </td>
    </tr>

    <tr>
      <td>
        7
      </td>

      <td>
        * Live score updates, including goal scorers (with minute) and red cards.<br />- Standings<br />- No lineups, formations, player data, hard facts/statistics, or leaders
      </td>
    </tr>

    <tr>
      <td>
        8
      </td>

      <td>
        * Live score change only<br />- Standings<br />- No lineups, formations, player data, hard facts/statistics, or leaders
      </td>
    </tr>

    <tr>
      <td>
        9
      </td>

      <td>
        * Post match results only
      </td>
    </tr>
  </tbody>
</Table>

<br />

## Accessing Detailed Coverage Data

To get comprehensive details on coverage available for a specific competition and season, use both the [Coverage Matrix](https://coverage-matrix.sportradar.com/) and [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) endpoint.

  ### Note on "Extended" Statistics

  Whether "Extended" statistics are covered refers to the availability of detailed performance data through the **[Soccer v4 Extended API](https://developer.sportradar.com/soccer/reference/soccer-extended-overview)**. This includes over 100 unique data points such as passes, tackles, dribbles, chances created, and more—along with XY event coordinates, period-based stats, and AI-powered commentary and summaries.

### Coverage Matrix

The [Coverage Matrix](https://coverage-matrix.sportradar.com/) is an interactive tool that shows the level of data coverage available for each soccer competition and season. Use it to quickly identify which data types—like lineups, statistics, and standings—are fully, partially, or not covered across competitions.

![](https://files.readme.io/b1cf606a1be7f21e42704c9ef76d982c73a23e1cf34233878b922d667efd7783-image.png)

#### Coverage Matrix Tips and Best Practices

<details>
  <summary><b><u>1. Select a Package and Tier</u></b></summary>

Use the dropdown filters at the top to narrow results by package (e.g., Soccer) and tier (1–9) to match your data plan or interest.

![](https://files.readme.io/12d685b98c44aa9c0b3899d39e2aafc8321af787be546a35124e95ecaa7461d8-image.png)

You can also use the search bar to search for a specific competition.

</details>

<details>
  <summary><b><u>2. Review Coverage by Competition</u></b></summary>

Each row shows a competition and its associated season. The columns represent data types such as schedules, results, statistics, and player profiles.

![](https://files.readme.io/2871bea5801e25265b2c4cc120f4045da1bdc803dacca1e266c37b6fae2e989e-image.png)

**Interpret the Dots:**

🟢 **Full Coverage** – This data type is fully supported for the competition/season.

🟡 **Partial Coverage** – This data type is available with some limitations or in select matches.

🔴 **No Coverage** – This data type is not available for the competition/season.

</details>

<details>
  <summary><b><u>3. Sort and Analyze Data Types</u></b></summary>

Click the arrow icons in column headers to sort competitions by season start date or coverage level for a specific data type—such as Live or Schedules.

![](https://files.readme.io/392ab042c221599df702fc291ccbf66821c308dd97701e6f1745322095601840-image.png)

Hover over any data type name to view a brief description of what it includes.

You can also sort Competitions by **Full Coverage**, **Partial Coverage**, and **No Coverage** for specific data types by clicking the white dot in the corresponding header.

![](https://files.readme.io/94f026efc877f56a33517154b307733c9c8360fa0da0852bda16de4171e965a5-image.png)

A menu opens to select the corresponding dot for your target coverage.

Refreshing your page is the quickest way to clear applied filters.

</details>

<details>
  <summary><b><u>4. Match Competition and Season Information</u></b></summary>

You can use the `season_id` and `competition_id` values found in the Coverage Matrix to make accurate API calls across many endpoints.

![](https://files.readme.io/d02efaa1e9606c03409ae6e747d8832ac781956c6005c99a478d268ae103c69d-image.png)

</details>

<details>
  <summary><b><u>5. Export the Matrix</u></b></summary>

Click the Export button at the top right of the table to download the full Coverage Matrix as a CSV or Excel file for offline analysis or sharing.

![](https://files.readme.io/c2ed7a2840b36ff318907e926af0df00c551d95f1bbec726987eb262aff390a0-image.png)

</details>

### Season Info Endpoint

The [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) feed returns detailed coverage information for a specific season—including available data types (e.g., lineups, statistics, player transfers). It also includes a list of all participating teams for that season.

<details>
  <summary><b><u>Season Info - Response Example</u></b></summary>

```xml Season Info Example (XML)
<?xml version="1.0" encoding="UTF-8"?>
<season_info
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-03T13:41:44+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_info.xsd">
	<coverage type="competition">
		<competition_properties brackets="false" missing_players="true" player_transfer_history="true" schedules="true" season_player_statistics="true" season_stats_leaders="true" season_team_statistics="true" standings="live" team_squads="true"/>
		<sport_event_properties basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true" extended_player_stats="true" extended_team_stats="true" deeper_play_by_play="true" deeper_team_stats="true" deeper_player_stats="true" lineups="true" goal_scorers="true" goal_scorers_live="true" scores="live" assists="true"/>
	</coverage>
	<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17">
		<sport id="sr:sport:1" name="Soccer"/>
		<category id="sr:category:1" name="England" country_code="ENG"/>
		<competition id="sr:competition:17" name="Premier League" gender="men"/>
	</season>
	<stages>
		<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25">
			<groups>
				<group id="sr:league:84075" name="Premier League" max_rounds="38">
					<competitors>
						<competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" gender="male"/>
						<competitor id="sr:competitor:35" name="Manchester United" country="England" country_code="ENG" abbreviation="MUN" gender="male"/>
						<competitor id="sr:competitor:37" name="West Ham United" country="England" country_code="ENG" abbreviation="WHU" gender="male"/>
						<competitor id="sr:competitor:48" name="Everton FC" country="England" country_code="ENG" abbreviation="EVE" gender="male"/>
						<competitor id="sr:competitor:45" name="Southampton FC" country="England" country_code="ENG" abbreviation="SOU" gender="male"/>
						<competitor id="sr:competitor:38" name="Chelsea FC" country="England" country_code="ENG" abbreviation="CHE" gender="male"/>
						<competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" gender="male"/>
						<competitor id="sr:competitor:39" name="Newcastle United" country="England" country_code="ENG" abbreviation="NEW" gender="male"/>
						<competitor id="sr:competitor:31" name="Leicester City" country="England" country_code="ENG" abbreviation="LEI" gender="male"/>
						<competitor id="sr:competitor:32" name="Ipswich Town" country="England" country_code="ENG" abbreviation="IPS" gender="male"/>
						<competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" gender="male"/>
						<competitor id="sr:competitor:40" name="Aston Villa" country="England" country_code="ENG" abbreviation="AVL" gender="male"/>
						<competitor id="sr:competitor:33" name="Tottenham Hotspur" country="England" country_code="ENG" abbreviation="TOT" gender="male"/>
						<competitor id="sr:competitor:43" name="Fulham FC" country="England" country_code="ENG" abbreviation="FUL" gender="male"/>
						<competitor id="sr:competitor:3" name="Wolverhampton Wanderers" country="England" country_code="ENG" abbreviation="WOL" gender="male"/>
						<competitor id="sr:competitor:7" name="Crystal Palace" country="England" country_code="ENG" abbreviation="CRY" gender="male"/>
						<competitor id="sr:competitor:14" name="Nottingham Forest" country="England" country_code="ENG" abbreviation="NFO" gender="male"/>
						<competitor id="sr:competitor:30" name="Brighton &amp; Hove Albion" country="England" country_code="ENG" abbreviation="BRI" gender="male"/>
						<competitor id="sr:competitor:60" name="AFC Bournemouth" country="England" country_code="ENG" abbreviation="BOU" gender="male"/>
						<competitor id="sr:competitor:50" name="Brentford FC" country="England" country_code="ENG" abbreviation="BRE" gender="male"/>
					</competitors>
					<coverage type="group">
						<group_properties brackets="false" cup="false" league="true" missing_players="true" qualification="false" schedules="true" results="true" standings="live" group_stage="false"/>
						<sport_event_properties basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true" lineups="true" extended_player_stats="true" extended_team_stats="true" deeper_team_stats="true" deeper_player_stats="true" deeper_play_by_play="true" goal_scorers="true" scores="live"/>
					</coverage>
				</group>
			</groups>
		</stage>
	</stages>
</season_info>
```
```json Season Info Example (JSON)
{
  "generated_at": "2025-07-03T13:31:32+00:00",
  "coverage": {
    "type": "competition",
    "competition_properties": {
      "brackets": false,
      "missing_players": true,
      "player_transfer_history": true,
      "schedules": true,
      "season_player_statistics": true,
      "season_stats_leaders": true,
      "season_team_statistics": true,
      "standings": "live",
      "team_squads": true
    },
    "sport_event_properties": {
      "basic_play_by_play": true,
      "basic_player_stats": true,
      "basic_team_stats": true,
      "extended_player_stats": true,
      "extended_team_stats": true,
      "deeper_play_by_play": true,
      "deeper_team_stats": true,
      "deeper_player_stats": true,
      "lineups": true,
      "goal_scorers": true,
      "goal_scorers_live": true,
      "scores": "live",
      "assists": true
    }
  },
  "season": {
    "id": "sr:season:118689",
    "name": "Premier League 24/25",
    "start_date": "2024-08-16",
    "end_date": "2025-05-25",
    "year": "24/25",
    "competition_id": "sr:competition:17",
    "sport": {
      "id": "sr:sport:1",
      "name": "Soccer"
    },
    "category": {
      "id": "sr:category:1",
      "name": "England",
      "country_code": "ENG"
    },
    "competition": {
      "id": "sr:competition:17",
      "name": "Premier League",
      "gender": "men"
    }
  },
  "stages": [
    {
      "order": 1,
      "type": "league",
      "phase": "regular season",
      "start_date": "2024-08-16",
      "end_date": "2025-05-25",
      "year": "24/25",
      "groups": [
        {
          "id": "sr:league:84075",
          "name": "Premier League",
          "competitors": [
            {
              "id": "sr:competitor:17",
              "name": "Manchester City",
              "country": "England",
              "country_code": "ENG",
              "abbreviation": "MCI",
              "gender": "male"
            },
            {
              "id": "sr:competitor:35",
              "name": "Manchester United",
              "country": "England",
              "country_code": "ENG",
              "abbreviation": "MUN",
              "gender": "male"
            },
            {
              "id": "sr:competitor:37",
              "name": "West Ham United",
              "country": "England",
              "country_code": "ENG",
              "abbreviation": "WHU",
              "gender": "male"
            },
            {
              "id": "sr:competitor:48",
              "name": "Everton FC",
              "country": "England",
              "country_code": "ENG",
              "abbreviation": "EVE",
              "gender": "male"
            },
            {
              "id": "sr:competitor:45",
              "name": "Southampton FC",
              "country": "England",
              "country_code": "ENG",
              "abbreviation": "SOU",
              "gender": "male"
            },
            {
              "id
... (example cut here; 8 KB in the source page)
```

This data confirms that the Premier League 24/25 season includes coverage for key data types such as player transfers, missing players, and extended player stats, each marked as `true` to indicate availability. For example, since Manchester United is listed as a participant, you can confidently retrieve transfer history or missing player info for players like Marcus Rashford.

</details>

> 👍 (Tip) Use Season IDs from the Coverage Matrix
>
> You can use the `season_id` value from the Coverage Matrix to call the Season Info endpoint and check detailed coverage and team participation for that specific season.

<br />

***

## Simulations

Test your Soccer API integration by replaying recorded matches on demand using both REST and Push feeds. The Simulations tool lets you validate your integration against real match data on your own schedule, useful for development, QA, and onboarding new team members without waiting for live matches.

New recordings are added as matches are played. See the Simulations documentation for available recordings, supported endpoints, and session handling.
