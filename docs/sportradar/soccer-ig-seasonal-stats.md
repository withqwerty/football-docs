---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-seasonal-stats
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.193Z
---
# Seasonal Statistics

## Prerequisite - Accessing Available Seasons

<AccessingAvailableSeasons />

<br />

## Overview

Seasonal statistics offer a cumulative view of team and player performance over a full season. Use this data to power leaderboards, comparisons, and performance tracking across your platform.

  ### Data Availability and Timing

  As a general rule, the Soccer API provides data for the current season and the two preceding seasons of each competition. However, coverage may extend as far back as 2007, depending on the competition and its data depth.

  Seasonal Statistics are updated in realtime for Tier 1 competitions and seasons. For more information on when data is updated, visit the [**Update Frequencies**](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies) page.

> 👍 Understand Every Data Point
>
> To view all possible data fields returned by an endpoint, including definitions, refer to the Data Points table for that specific endpoint. For example, see the data points for the **[Season Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics)** endpoint. These tables are especially helpful for understanding the full range of values you may encounter and for planning your integration accordingly.
>
> For a complete view of all data fields available across the API, visit the Statistics Summary page for your chosen API. See statistics summaries for:
>
> * **[Soccer](https://developer.sportradar.com/soccer/reference/soccer-statistics-summary#seasonal-statistics--team)**
> * **[Soccer Extended](https://developer.sportradar.com/soccer/reference/soccer-extended-statistics-summary#seasonal-statistics--team)**

<br />

***

## Seasonal Statistics

<br />

### Team and Player

You can access team and player seasonal statistics using the [Seasonal Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics) feed.

<details>
  <summary>Seasonal Statistics Response Example</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_competitor_statistics
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T17:45:42+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_competitor_statistics.xsd">
	<season id="sr:season:127179" name="MLS 2025" start_date="2025-02-22" end_date="2025-12-08" year="2025" competition_id="sr:competition:242">
		<sport id="sr:sport:1" name="Soccer"/>
	</season>
	<competitor id="sr:competitor:2502" name="DC United" country="USA" country_code="USA" abbreviation="DC" gender="male">
		<statistics average_ball_possession="46.54" cards_given="62" corner_kicks="110" free_kicks="262" goals_by_foot="14" goals_by_head="6" goals_conceded="45" goals_conceded_first_half="23" goals_conceded_second_half="22" goals_scored="20" goals_scored_first_half="11" goals_scored_second_half="9" matches_played="24" offsides="28" penalties_missed="1" red_cards="0" shots_blocked="42" shots_off_target="82" shots_on_bar="4" shots_on_post="3" shots_on_target="82" shots_total="206" yellow_cards="61" yellow_red_cards="1"/>
		<players>
			<player id="sr:player:45970" name="Benteke, Christian">
				<statistics assists="0" cards_given="3" goals_by_head="3" goals_by_penalty="1" goals_conceded="74" goals_scored="7" matches_played="16" offsides="8" own_goals="0" penalties_missed="1" red_cards="0" shots_blocked="4" shots_off_target="16" shots_on_target="25" substituted_in="2" substituted_out="6" yellow_cards="3" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:772907" name="Rowles, Kye">
				<statistics assists="0" cards_given="7" goals_by_head="0" goals_by_penalty="0" goals_conceded="110" goals_scored="0" matches_played="21" own_goals="0" penalties_missed="0" red_cards="0" shots_off_target="1" substituted_in="1" substituted_out="0" yellow_cards="7" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:808422" name="Leal, Randall">
				<statistics assists="0" corner_kicks="4" goals_by_head="0" goals_by_penalty="0" goals_conceded="31" goals_scored="0" matches_played="13" own_goals="0" penalties_missed="0" red_cards="0" shots_off_target="2" shots_on_target="5" substituted_in="11" substituted_out="2" yellow_cards="0" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:813960" name="Badji, Dominique">
				<statistics assists="0" cards_given="3" corner_kicks="1" goals_by_head="0" goals_by_penalty="0" goals_conceded="58" goals_scored="1" matches_played="18" offsides="1" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="1" shots_off_target="2" shots_on_target="3" substituted_in="12" substituted_out="5" yellow_cards="3" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:1134267" name="Herrera, Aaron">
				<statistics assists="3" cards_given="7" corner_kicks="26" goals_by_head="0" goals_by_penalty="0" goals_conceded="94" goa
... (example cut here; 11 KB in the source page)
```
```json
{
  "generated_at": "2025-07-25T16:55:48+00:00",
  "season": {
    "id": "sr:season:127179",
    "name": "MLS 2025",
    "start_date": "2025-02-22",
    "end_date": "2025-12-08",
    "year": "2025",
    "competition_id": "sr:competition:242",
    "sport": {
      "id": "sr:sport:1",
      "name": "Soccer"
    }
  },
  "competitor": {
    "id": "sr:competitor:2502",
    "name": "DC United",
    "country": "USA",
    "country_code": "USA",
    "abbreviation": "DC",
    "gender": "male",
    "statistics": {
      "average_ball_possession": 46.54,
      "cards_given": 62,
      "corner_kicks": 110,
      "free_kicks": 262,
      "goals_by_foot": 14,
      "goals_by_head": 6,
      "goals_conceded": 45,
      "goals_conceded_first_half": 23,
      "goals_conceded_second_half": 22,
      "goals_scored": 20,
      "goals_scored_first_half": 11,
      "goals_scored_second_half": 9,
      "matches_played": 24,
      "offsides": 28,
      "penalties_missed": 1,
      "red_cards": 0,
      "shots_blocked": 42,
      "shots_off_target": 82,
      "shots_on_bar": 4,
      "shots_on_post": 3,
      "shots_on_target": 82,
      "shots_total": 206,
      "yellow_cards": 61,
      "yellow_red_cards": 1
    },
    "players": [
      {
        "id": "sr:player:45970",
        "name": "Benteke, Christian",
        "statistics": {
          "assists": 0,
          "cards_given": 3,
          "goals_by_head": 3,
          "goals_by_penalty": 1,
          "goals_conceded": 74,
          "goals_scored": 7,
          "matches_played": 16,
          "offsides": 8,
          "own_goals": 0,
          "penalties_missed": 1,
          "red_cards": 0,
          "shots_blocked": 4,
          "shots_off_target": 16,
          "shots_on_target": 25,
          "substituted_in": 2,
          "substituted_out": 6,
          "yellow_cards": 3,
          "yellow_red_cards": 0
        }
      },
      {
        "id": "sr:player:772907",
        "name": "Rowles, Kye",
        "statistics": {
          "assists": 0,
          "cards_given": 7,
          "goals_by_head": 0,
          "goals_by_penalty": 0,
          "goals_conceded": 110,
          "goals_scored": 0,
          "matches_played": 21,
          "own_goals": 0,
          "penalties_missed": 0,
          "red_cards": 0,
          "shots_off_target": 1,
          "substituted_in": 1,
          "substituted_out": 0,
          "yellow_cards": 7,
          "yellow_red_cards": 0
        }
      },
      {
        "id": "sr:player:808422",
        "name": "Leal, Randall",
        "statistics": {
          "assists": 0,
          "corner_kicks": 4,
          "goals_by_head": 0,
          "goals_by_penalty": 0,
          "goals_conceded": 31,
          "goals_scored": 0,
          "matches_played": 13,
          "own_goals": 0,
          "penalties_missed": 0,
          "red_cards": 0,
          "shots_off_target": 2,
          "shots_on_target": 5,
          "substituted_in": 11,
          "substituted_out": 2,
          "ye
... (example cut here; 17 KB in the source page)
```

This feed provides season-level statistics for a single competitor (team), along with performance metrics for each player on the roster. Team-level data includes totals and averages such as goals scored, ball possession, shots, fouls, and disciplinary actions. Player-level statistics include appearances, goals, assists, substitutions, cards, shots, and more—ideal for season summaries, leaderboards, or performance insights.

</details>

  ### Level-Up Seasonal Stats with Soccer Extended

  Get beyond the basics, use the **[Soccer Extended API](https://developer.sportradar.com/soccer/reference/soccer-extended-overview)** to access a richer set of seasonal statistics, including advanced metrics like successful vs. unsuccessful crosses, dribbles completed, loss of possession, and more. Perfect for powering in-depth analysis, tactical breakdowns, and scouting insights.

<details>
  <summary>Seasonal Statistics Response Example (Soccer Extended)</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_competitor_statistics
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T17:59:00+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer-extended/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer-extended/v4 https://schemas.sportradar.com/sportsapi/soccer-extended/v4/schemas/season_competitor_statistics.xsd">
	<season id="sr:season:127179" name="MLS 2025" start_date="2025-02-22" end_date="2025-12-08" year="2025" competition_id="sr:competition:242">
		<sport id="sr:sport:1" name="Soccer"/>
	</season>
	<competitor id="sr:competitor:2502" name="DC United" country="USA" country_code="USA" abbreviation="DC" gender="male">
		<statistics average_ball_possession="46.54" cards_given="62" chances_created="180" clearances="884" corner_kicks="110" crosses_successful="124" crosses_total="462" crosses_unsuccessful="338" defensive_blocks="122" diving_saves="23" dribbles="64" free_kicks="262" goals_by_foot="14" goals_by_head="6" goals_conceded="45" goals_conceded_first_half="23" goals_conceded_second_half="22" goals_scored="20" goals_scored_first_half="11" goals_scored_second_half="9" interceptions="122" long_passes_successful="225" long_passes_total="822" long_passes_unsuccessful="597" loss_of_possession="505" matches_played="24" offsides="28" passes_successful="7498" passes_total="8514" passes_unsuccessful="1016" penalties_missed="1" red_cards="0" shots_blocked="42" shots_off_target="82" shots_on_bar="4" shots_on_post="3" shots_on_target="82" shots_total="206" tackles_successful="175" tackles_total="207" tackles_unsuccessful="32" was_fouled="230" yellow_cards="61" yellow_red_cards="1"/>
		<players>
			<player id="sr:player:45970" name="Benteke, Christian">
				<statistics assists="0" cards_given="3" chances_created="11" clean_sheets="19" clearances="10" crosses_successful="0" crosses_total="2" defensive_blocks="0" dribbles_completed="3" fouls_committed="0" fouls_won="0" goals_by_head="3" goals_by_penalty="1" goals_conceded="0" goals_scored="7" interceptions="3" long_passes_successful="1" long_passes_total="3" long_passes_unsuccessful="2" loss_of_possession="28" matches_played="16" minutes_played="1118" offsides="8" own_goals="0" passes_successful="161" passes_total="230" passes_unsuccessful="69" penalties_missed="1" red_cards="0" shots_blocked="4" shots_faced="0" shots_off_target="16" shots_on_target="25" substituted_in="2" substituted_out="6" tackles_successful="1" tackles_total="3" yellow_cards="3" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:772907" name="Rowles, Kye">
				<statistics assists="0" cards_given="7" chances_created="4" clean_sheets="12" clearances="179" crosses_successful="1" crosses_total="3" defensive_blocks="0" dribbles_completed="0" fouls_committed="0" fouls_won="0" goals_by_head="0" goals_by_penalty="0" goals_conceded="0" goals_scored="0" interceptions="14" long_passes_successful="18" long_passes_total="76" long_pa
... (example cut here; 23 KB in the source page)
```
```json
{
  "generated_at": "2025-07-25T08:55:48+00:00",
  "season": {
    "id": "sr:season:127179",
    "name": "MLS 2025",
    "start_date": "2025-02-22",
    "end_date": "2025-12-08",
    "year": "2025",
    "competition_id": "sr:competition:242",
    "sport": {
      "id": "sr:sport:1",
      "name": "Soccer"
    }
  },
  "competitor": {
    "id": "sr:competitor:2502",
    "name": "DC United",
    "country": "USA",
    "country_code": "USA",
    "abbreviation": "DC",
    "gender": "male",
    "statistics": {
      "average_ball_possession": 46.54,
      "cards_given": 62,
      "chances_created": 180,
      "clearances": 884,
      "corner_kicks": 110,
      "crosses_successful": 124,
      "crosses_total": 462,
      "crosses_unsuccessful": 338,
      "defensive_blocks": 122,
      "diving_saves": 23,
      "dribbles": 64,
      "free_kicks": 262,
      "goals_by_foot": 14,
      "goals_by_head": 6,
      "goals_conceded": 45,
      "goals_conceded_first_half": 23,
      "goals_conceded_second_half": 22,
      "goals_scored": 20,
      "goals_scored_first_half": 11,
      "goals_scored_second_half": 9,
      "interceptions": 122,
      "long_passes_successful": 225,
      "long_passes_total": 822,
      "long_passes_unsuccessful": 597,
      "loss_of_possession": 505,
      "matches_played": 24,
      "offsides": 28,
      "passes_successful": 7498,
      "passes_total": 8514,
      "passes_unsuccessful": 1016,
      "penalties_missed": 1,
      "red_cards": 0,
      "shots_blocked": 42,
      "shots_off_target": 82,
      "shots_on_bar": 4,
      "shots_on_post": 3,
      "shots_on_target": 82,
      "shots_total": 206,
      "tackles_successful": 175,
      "tackles_total": 207,
      "tackles_unsuccessful": 32,
      "was_fouled": 230,
      "yellow_cards": 61,
      "yellow_red_cards": 1
    },
    "players": [
      {
        "id": "sr:player:45970",
        "name": "Benteke, Christian",
        "statistics": {
          "assists": 0,
          "cards_given": 3,
          "chances_created": 11,
          "clean_sheets": 19,
          "clearances": 10,
          "crosses_successful": 0,
          "crosses_total": 2,
          "defensive_blocks": 0,
          "dribbles_completed": 3,
          "fouls_committed": 0,
          "fouls_won": 0,
          "goals_by_head": 3,
          "goals_by_penalty": 1,
          "goals_conceded": 0,
          "goals_scored": 7,
          "interceptions": 3,
          "long_passes_successful": 1,
          "long_passes_total": 3,
          "long_passes_unsuccessful": 2,
          "loss_of_possession": 28,
          "matches_played": 16,
          "minutes_played": 1118,
          "offsides": 8,
          "own_goals": 0,
          "passes_successful": 161,
          "passes_total": 230,
          "passes_unsuccessful": 69,
          "penalties_missed": 1,
          "red_cards": 0,
          "shots_blocked": 4,
          "shots_faced": 0,
          "shots_off_target": 16,
          "shots_on_target": 25,
... (example cut here; 35 KB in the source page)
```

The extended version of the [Seasonal Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-extended-seasonal-competitor-statistics) endpoint delivers significantly richer data for both teams and players. In addition to standard season metrics like goals, cards, and match appearances, the extended feed provides advanced stats such as **loss of possession**, **successful vs. unsuccessful crosses and long passes**, **defensive actions** (e.g., clearances, blocks, interceptions), and **dribble completions**. These enhanced fields offer deeper tactical insights and performance evaluation, ideal for building advanced dashboards, scouting tools, or match analysis features. Use this endpoint when you need a more granular, context-rich view of how teams and individual players are performing over the course of a season.

</details>

<br />

### Season Leaders

You can access a list of leaders for a given season with the [Season Leaders](https://developer.sportradar.com/soccer/reference/soccer-season-leaders) endpoint. This feed returns the top-performing players across key statistics, including points, goals, assists, cards, and minutes played.

\*\*Soccer Extended:\*\*For a deeper look at top performers, upgrade to Soccer Extended to access the enhanced version of the [Season Leaders endpoint](https://developer.sportradar.com/soccer/reference/soccer-extended-season-leaders).

<details>
  <summary>Seasonal Leaders Response Example</summary>

```json
{
"generated_at": "2025-08-06T07:47:27+00:00",
  "lists": [
    {
      "type": "points",
      "leaders": [
        {
          "rank": 1,
          "players": [
            {
              "id": "sr:player:12994",
              "name": "Messi, Lionel",
              "competitors": [
                {
                  "id": "sr:competitor:659691",
                  "name": "Inter Miami CF",
                  "abbreviation": "MIA",
                  "datapoints": [
                    {
                      "type": "goals",
                      "value": 18
                    },
                    {
                      "type": "assists",
                      "value": 8
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "rank": 2,
          "players": [
            {
              "id": "sr:player:756440",
              "name": "Dreyer, Anders",
              "competitors": [
                {
                  "id": "sr:competitor:1217911",
                  "name": "San Diego FC",
                  "abbreviation": "SAN",
                  "datapoints": [
                    {
                      "type": "goals",
                      "value": 11
                    },
                    {
                      "type": "assists",
                      "value": 13
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "rank": 3,
          "players": [
            {
              "id": "sr:player:1238264",
              "name": "Ojeda, Martin",
              "competitors": [
                {
                  "id": "sr:competitor:52237",
                  "name": "Orlando City SC",
                  "abbreviation": "ORL",
                  "datapoints": [
                    {
                      "type": "goals",
                      "value": 13
                    },
                    {
                      "type": "assists",
                      "value": 9
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "rank": 4,
          "players": [
            {
              "id": "sr:player:918706",
              "name": "Evander",
              "competitors": [
                {
                  "id": "sr:competitor:245305",
                  "name": "FC Cincinnati",
                  "abbreviation": "CIN",
                  "datapoints": [
                    {
                      "type": "goals",
                      "value": 15
                    },
                    {
                      "type": "assists",
                      "value": 6
                    }
                  ]
                }
              ]
            },
            {
              "id": "sr:player:940680",
              "name": "Surridge, Sam",
              "competitors": [
                {
... (example cut here; 7 KB in the source page)
```
```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_leaders
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-08-06T07:59:00+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_leaders.xsd">
	<list type="points">
		<leaders>
			<leader rank="1">
				<players>
					<player id="sr:player:12994" name="Messi, Lionel">
						<competitors>
							<competitor id="sr:competitor:659691" name="Inter Miami CF" abbreviation="MIA">
								<datapoints>
									<datapoint type="goals" value="18"/>
									<datapoint type="assists" value="8"/>
								</datapoints>
							</competitor>
						</competitors>
					</player>
				</players>
			</leader>
			<leader rank="2">
				<players>
					<player id="sr:player:756440" name="Dreyer, Anders">
						<competitors>
							<competitor id="sr:competitor:1217911" name="San Diego FC" abbreviation="SAN">
								<datapoints>
									<datapoint type="goals" value="11"/>
									<datapoint type="assists" value="13"/>
								</datapoints>
							</competitor>
						</competitors>
					</player>
				</players>
			</leader>
			<leader rank="3">
				<players>
					<player id="sr:player:1238264" name="Ojeda, Martin">
						<competitors>
							<competitor id="sr:competitor:52237" name="Orlando City SC" abbreviation="ORL">
								<datapoints>
									<datapoint type="goals" value="13"/>
									<datapoint type="assists" value="9"/>
								</datapoints>
							</competitor>
						</competitors>
					</player>
				</players>
			</leader>
			<leader rank="4">
				<players>
					<player id="sr:player:918706" name="Evander">
						<competitors>
							<competitor id="sr:competitor:245305" name="FC Cincinnati" abbreviation="CIN">
								<datapoints>
									<datapoint type="goals" value="15"/>
									<datapoint type="assists" value="6"/>
								</datapoints>
							</competitor>
						</competitors>
					</player>
					<player id="sr:player:940680" name="Surridge, Sam">
						<competitors>
							<competitor id="sr:competitor:668063" name="Nashville SC" abbreviation="NSH">
								<datapoints>
									<datapoint type="goals" value="18"/>
									<datapoint type="assists" value="3"/>
								</datapoints>
							</competitor>
						</competitors>
					</player>
				</players>
			</leader>
			<leader rank="6">
				<players>
					<player id="sr:player:1369420" name="Biel, Pep">
						<competitors>
							<competitor id="sr:competitor:863473" name="Charlotte FC" abbreviation="CLT">
								<datapoints>
									<datapoint type="goals" value="10"/>
									<datapoint type="assists" value="10"/>
								</datapoints>
							</competitor>
						</competitors>
					</player>
				</players>
			</leader>
			<leader rank="7">
				<players>
					<player id="sr:player:760618" name="Bouanga, Denis">
						<competitors>
							<competitor id="sr:competitor:4022
... (example cut here; 5 KB in the source page)
```

Use the **Season Leaders** feed to retrieve a ranked list of top-performing players across a season. Each entry includes the player’s **name**, **team**, and key **performance stats** like **goals**, **assists**, and **points**. Players are ranked by stat type, and ties are supported when players have matching totals. This feed is ideal for showcasing **season standouts**, powering **leaderboards**, and highlighting **individual achievements** across teams.

</details>

You can use the Season Leaders feed to generate leaderboard views like this top scorers table by extracting and aggregating the `goals_scored` stat from each player's match data across the season.

![](https://files.readme.io/8a15135876cd6a56b2d93f0558e28933023e0b701ae0bbbe99620f81f7cbd322-image.png)

  ### Accessing Images

  To access images in the Soccer API, use the **[Images API](https://developer.sportradar.com/images-and-editorials/reference/images-overview)**.

<br />

### Season Over/Under Statistics

Season over/under statistics track whether a team's or player's cumulative performance (e.g., goals scored, points earned) is over or under a predefined threshold set for the season. These stats are often used for betting markets, projections, and performance tracking against expected outcomes.

<details>
  <summary>How Over/Under Thresholds Are Set</summary>

The over/under threshold is typically set by oddsmakers at sportsbooks, based on a combination of historical performance, player rosters, injuries, schedule strength, and advanced statistical models. For non-betting contexts, analysts or teams may define custom thresholds using similar data to benchmark performance or forecast season outcomes.

</details>

You can access season over/under statistics for all teams in a given season using the [Season Over/Under Statistics](https://developer.sportradar.com/soccer/reference/soccer-season-overunder-statistics) feed.

<details>
  <summary>Season Over/Under Statistics Response Example</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_over_under_statistics
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-08-05T15:32:39+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_over_under_statistics.xsd">
	<competitors>
		<competitor id="sr:competitor:2502" name="DC United">
			<competitor_over_under_statistics>
				<over_under_statistics_list type="full_time_total">
					<statistics>
						<statistic goals="0.5" over="21" under="4"/>
						<statistic goals="1.5" over="19" under="6"/>
						<statistic goals="2.5" over="15" under="10"/>
						<statistic goals="3.5" over="6" under="19"/>
						<statistic goals="4.5" over="4" under="21"/>
						<statistic goals="5.5" over="3" under="22"/>
					</statistics>
				</over_under_statistics_list>
				<over_under_statistics_list type="first_period_total">
					<statistics>
						<statistic goals="0.5" over="19" under="6"/>
						<statistic goals="1.5" over="10" under="15"/>
						<statistic goals="2.5" over="5" under="20"/>
						<statistic goals="3.5" over="2" under="23"/>
						<statistic goals="4.5" over="0" under="25"/>
						<statistic goals="5.5" over="0" under="25"/>
					</statistics>
				</over_under_statistics_list>
				<over_under_statistics_list type="second_period_total">
					<statistics>
						<statistic goals="0.5" over="17" under="8"/>
						<statistic goals="1.5" over="11" under="14"/>
						<statistic goals="2.5" over="5" under="20"/>
						<statistic goals="3.5" over="2" under="23"/>
						<statistic goals="4.5" over="0" under="25"/>
						<statistic goals="5.5" over="0" under="25"/>
					</statistics>
				</over_under_statistics_list>
			</competitor_over_under_statistics>
		</competitor>
		<competitor id="sr:competitor:2504" name="Columbus Crew">
			<competitor_over_under_statistics>
				<over_under_statistics_list type="full_time_total">
					<statistics>
						<statistic goals="0.5" over="23" under="2"/>
						<statistic goals="1.5" over="20" under="5"/>
						<statistic goals="2.5" over="16" under="9"/>
						<statistic goals="3.5" over="9" under="16"/>
						<statistic goals="4.5" over="5" under="20"/>
						<statistic goals="5.5" over="4" under="21"/>
					</statistics>
				</over_under_statistics_list>
				<over_under_statistics_list type="first_period_total">
					<statistics>
						<statistic goals="0.5" over="21" under="4"/>
						<statistic goals="1.5" over="13" under="12"/>
						<statistic goals="2.5" over="7" under="18"/>
						<statistic goals="3.5" over="2" under="23"/>
						<statistic goals="4.5" over="1" under="24"/>
						<statistic goals="5.5" over="0" under="25"/>
					</statistics>
				</over_under_statistics_list>
				<over_under_statistics_list type="second_period_total">
					<statistics>
						<statistic goals="0.5" over="19" under="6"/>
						<statistic goals="1.5" over="
... (example cut here; 5 KB in the source page)
```
```json
{
  "generated_at": "2025-08-05T15:28:03+00:00",
  "competitors": [
    {
      "id": "sr:competitor:2502",
      "name": "DC United",
      "competitor_over_under_statistics": [
        {
          "type": "full_time_total",
          "statistics": [
            {
              "goals": 0.5,
              "over": 21,
              "under": 4
            },
            {
              "goals": 1.5,
              "over": 19,
              "under": 6
            },
            {
              "goals": 2.5,
              "over": 15,
              "under": 10
            },
            {
              "goals": 3.5,
              "over": 6,
              "under": 19
            },
            {
              "goals": 4.5,
              "over": 4,
              "under": 21
            },
            {
              "goals": 5.5,
              "over": 3,
              "under": 22
            }
          ]
        },
        {
          "type": "first_period_total",
          "statistics": [
            {
              "goals": 0.5,
              "over": 19,
              "under": 6
            },
            {
              "goals": 1.5,
              "over": 10,
              "under": 15
            },
            {
              "goals": 2.5,
              "over": 5,
              "under": 20
            },
            {
              "goals": 3.5,
              "over": 2,
              "under": 23
            },
            {
              "goals": 4.5,
              "over": 0,
              "under": 25
            },
            {
              "goals": 5.5,
              "over": 0,
              "under": 25
            }
          ]
        },
        {
          "type": "second_period_total",
          "statistics": [
            {
              "goals": 0.5,
              "over": 17,
              "under": 8
            },
            {
              "goals": 1.5,
              "over": 11,
              "under": 14
            },
            {
              "goals": 2.5,
              "over": 5,
              "under": 20
            },
            {
              "goals": 3.5,
              "over": 2,
              "under": 23
            },
            {
              "goals": 4.5,
              "over": 0,
              "under": 25
            },
            {
              "goals": 5.5,
              "over": 0,
              "under": 25
            }
          ]
        }
      ]
    },
    {
      "id": "sr:competitor:2504",
      "name": "Columbus Crew",
      "competitor_over_under_statistics": [
        {
          "type": "full_time_total",
          "statistics": [
            {
              "goals": 0.5,
              "over": 23,
              "under": 2
            },
            {
              "goals": 1.5,
              "over": 20,
              "under": 5
            },
            {
              "goals": 2.5,
              "over": 16,
              "under": 9
            },
            {
              "goals": 3.5,
... (example cut here; 7 KB in the source page)
```

Use the Season Over/Under Statistics endpoint to track how often teams finish matches over or under specific goal thresholds across the full match, first period, or second period. You can use this data to power predictive models, support betting logic, or identify scoring trends, for example, how often a team’s matches end with over 2.5 goals. Each entry gives you the number of times a team hit over or under for common goal lines like 0.5, 1.5, up to 5.5, helping you quantify consistency and risk.

</details>
