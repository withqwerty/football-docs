---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-historical-data
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Historical Data

## Prerequisite: Confirm Season Availability and Coverage

Understanding which seasons are available—and what [level of data coverage is provided](https://developer.sportradar.com/soccer/docs/soccer-ig-data-availability-coverage)—is essential for making reliable and accurate API calls.

* Use the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed to view all available seasons for each competition in the API.
* Reference the [Coverage Matrix](https://coverage-matrix.sportradar.com/) to determine the depth of coverage by competition tier (Tier 1–9).
* Use the [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) feed to confirm what data is available for a given season of the target competition (e.g., player transfers, team squads, stats levels).

Validating coverage and season availability early can help prevent errors and streamline your data integration process.

<br />

***

## Data Availability

**Rule of Thumb**: The Soccer API provides data for the current season plus the two previous seasons for each competition. However, data can extend as far back as 2007, depending on the competition and coverage level.

Soccer data is primarily collected by Sportradar.

<br />

### Data Updates

We are always enhancing our datasets, and as a result, you may notice certain stats are unavailable in past years or versions.

When new data points are added, they are typically available in the most recent API version from that point going forward. Reference the [Soccer API Change Log](https://developer.sportradar.com/soccer/reference/soccer-change-log) for more specifics on added data.

<br />

***

## Data Accessibility

Historical Soccer statistics are available within the Soccer API. There is no separate API or add-on package at this time.

The following Soccer API feeds can be used to retrieve historical statistics by leveraging the `competition_id`, `season_id`, or `player_id parameters`:

* [Competition Seasons](https://developer.sportradar.com/soccer/reference/soccer-competition-seasons)
* [Player Profile](https://developer.sportradar.com/soccer/reference/soccer-player-profile)
* [Season Form Standings](https://developer.sportradar.com/soccer/reference/soccer-season-form-standings)
* [Season Leaders](https://developer.sportradar.com/soccer/reference/soccer-season-leaders)
* [Season Lineups](https://developer.sportradar.com/soccer/reference/soccer-season-lineups)
* [Season Links](https://developer.sportradar.com/soccer/reference/soccer-season-links)
* [Season Missing Players](https://developer.sportradar.com/soccer/reference/soccer-season-missing-players)
* [Season Over/Under Statistics](https://developer.sportradar.com/soccer/reference/soccer-season-overunder-statistics)
* [Season Players](https://developer.sportradar.com/soccer/reference/soccer-season-players)
* [Season Probabilities](https://developer.sportradar.com/soccer/reference/soccer-season-probabilities)
* [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule)
* [Season Standings](https://developer.sportradar.com/soccer/reference/soccer-season-standings)
* [Season Summaries](https://developer.sportradar.com/soccer/reference/soccer-season-summaries)
* [Season Transfers](https://developer.sportradar.com/soccer/reference/soccer-season-transfers)
* [Season Competitor Players](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-players)
* [Seasonal Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics)
* [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons)

Use the below data retrieval samples as a starting point to obtain your historical stats.

<br />

### Seasonal Stats by Team

To retrieve team seasonal stats we'll want to access the [Seasonal Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics) feed. This feed provides complete team and player seasonal statistics for a given season. Let's look at the syntax below and retrieve 2023 season stats for Manchester City

https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/seasons/ {season_id}/competitors/{competitor_id}/statistics.{format}

<br />

To start building this request, you can access the unique 2023 `season_id`for the Premier League—the league Manchester City competes in.  Here are two example workflows for navigating the endpoints to obtain the desired ID:

<br />

Use the unique `season.id` obtained from the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed to call the [Season Competitors](https://developer.sportradar.com/soccer/reference/soccer-season-competitors) feed and retrieve the `competitor.id` for Manchester City.

Once you have your 2023 Premier League  `season.id` and Manchester City `competitor.id` you can use both to call the [Seasonal Competitor Statistics](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics) feed.  Here's how your final call should look: `https://api.sportradar.com/soccer/trial/v4/en/seasons/sr:season:105353/competitors/sr:competitor:17/statistics.xml`

This call will return 2023 seasonal stats for Manchester City. Stats are also further broken down by players. You can find all of the data points available in Seasonal Competitor Statistics feed [here](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-statistics#data-points).

```xml Seasonal Competitor Stats Snippet (xml)
<?xml version="1.0" encoding="UTF-8"?>
<season_competitor_statistics
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T14:45:26+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_competitor_statistics.xsd">
	<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17">
		<sport id="sr:sport:1" name="Soccer"/>
	</season>
	<competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" gender="male">
		<statistics average_ball_possession="65.53" cards_given="55" corner_kicks="286" free_kicks="501" goals_by_foot="83" goals_by_head="11" goals_conceded="34" goals_conceded_first_half="16" goals_conceded_second_half="18" goals_scored="96" goals_scored_first_half="40" goals_scored_second_half="56" matches_played="38" offsides="42" penalties_missed="1" red_cards="1" shots_blocked="177" shots_off_target="193" shots_on_bar="3" shots_on_post="3" shots_on_target="261" shots_total="631" yellow_cards="53" yellow_red_cards="1"/>
		<players>
			<player id="sr:player:44614" name="Walker, Kyle">
				<statistics assists="4" cards_given="2" goals_by_head="0" goals_by_penalty="0" goals_conceded="29" goals_scored="0" matches_played="32" offsides="7" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="7" shots_off_target="6" shots_on_target="3" substituted_in="2" substituted_out="3" yellow_cards="2" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:70996" name="De Bruyne, Kevin">
				<statistics assists="10" cards_given="2" corner_kicks="66" goals_by_head="1" goals_by_penalty="0" goals_conceded="8" goals_scored="4" matches_played="18" offsides="1" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="14" shots_off_target="13" shots_on_target="14" substituted_in="3" substituted_out="10" yellow_cards="2" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:125274" name="Ortega, Stefan">
				<statistics assists="0" goals_by_head="0" goals_by_penalty="0" goals_conceded="7" goals_scored="0" matches_played="9" own_goals="0" penalties_missed="0" red_cards="0" substituted_in="4" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:136710" name="Kovacic, Mateo">
				<statistics assists="0" cards_given="4" corner_kicks="4" goals_by_head="0" goals_by_penalty="0" goals_conceded="14" goals_scored="1" matches_played="30" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="6" shots_off_target="5" shots_on_target="5" substituted_in="14" substituted_out="9" yellow_cards="4" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:149663" name="Ake, Nathan">
				<statistics assists="1" goals_by_head="2" goals_by_penalty="0" goals_conceded="20" goals_scored="2" matches_played="29" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="4" shots_off_target="7" shots_on_target="4" substituted_in="5" substituted_out="5" yellow_cards="0" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:149734" name="Laporte, Aymeric">
				<statistics assists="0" goals_by_head="0" goals_by_penalty="0" goals_conceded="0" goals_scored="0" matches_played="1" own_goals="0" penalties_missed="0" red_cards="0" shots_on_target="1" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:152077" name="Stones, John">
				<statistics assists="0" cards_given="2" goals_by_head="0" goals_by_penalty="0" goals_conceded="10" goals_scored="1" matches_played="16" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="1" shots_on_target="1" substituted_in="4" substituted_out="3" yellow_cards="2" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:189061" name="Grealish, Jack">
				<statistics assists="3" cards_given="7" corner_kicks="6" goals_by_head="0" goals_by_penalty="0" goals_conceded="13" goals_scored="3" matches_played="20" offsides="1" own_goals="0" penalties_missed="0" red_cards="0" shots_blocked="5" shots_off_target="3" shots_on_target="6" substituted_in="10" substituted_out="3" yellow_cards="7" yellow_red_cards="0"/>
			</player>
			<player id="sr:player:254491" name="Ederson">
				<statistics assists="0" cards_given="5" goals_by_head="0" goals_by_penalty="0" goals_conceded="27" goals_scored="0" matches_played="33" own_goals="0" penalties_missed="0" red_cards="0" substituted_in="0" substituted_out="4" yellow_cards="5" yellow_red_cards="0"/>
			</player>
	</competitor>
</season_competitor_statistics>
```
```json Seasonal Competitor Stats Snippet (json)
{
  "generated_at": "2025-06-30T14:51:05+00:00",
  "season": {
    "id": "sr:season:105353",
    "name": "Premier League 23/24",
    "start_date": "2023-08-11",
    "end_date": "2024-05-19",
    "year": "23/24",
    "competition_id": "sr:competition:17",
    "sport": {
      "id": "sr:sport:1",
      "name": "Soccer"
    }
  },
  "competitor": {
    "id": "sr:competitor:17",
    "name": "Manchester City",
    "country": "England",
    "country_code": "ENG",
    "abbreviation": "MCI",
    "gender": "male",
    "statistics": {
      "average_ball_possession": 65.53,
      "cards_given": 55,
      "corner_kicks": 286,
      "free_kicks": 501,
      "goals_by_foot": 83,
      "goals_by_head": 11,
      "goals_conceded": 34,
      "goals_conceded_first_half": 16,
      "goals_conceded_second_half": 18,
      "goals_scored": 96,
      "goals_scored_first_half": 40,
      "goals_scored_second_half": 56,
      "matches_played": 38,
      "offsides": 42,
      "penalties_missed": 1,
      "red_cards": 1,
      "shots_blocked": 177,
      "shots_off_target": 193,
      "shots_on_bar": 3,
      "shots_on_post": 3,
      "shots_on_target": 261,
      "shots_total": 631,
      "yellow_cards": 53,
      "yellow_red_cards": 1
    },
    "players": [
      {
        "id": "sr:player:44614",
        "name": "Walker, Kyle",
        "statistics": {
          "assists": 4,
          "cards_given": 2,
          "goals_by_head": 0,
          "goals_by_penalty": 0,
          "goals_conceded": 29,
          "goals_scored": 0,
          "matches_played": 32,
          "offsides": 7,
          "own_goals": 0,
          "penalties_missed": 0,
          "red_cards": 0,
          "shots_blocked": 7,
          "shots_off_target": 6,
          "shots_on_target": 3,
          "substituted_in": 2,
          "substituted_out": 3,
          "yellow_cards": 2,
          "yellow_red_cards": 0
        }
      },
      {
        "id": "sr:player:70996",
        "name": "De Bruyne, Kevin",
        "statistics": {
          "assists": 10,
          "cards_given": 2,
          "corner_kicks": 66,
          "goals_by_head": 1,
          "goals_by_penalty": 0,
          "goals_conceded": 8,
          "goals_scored": 4,
          "matches_played": 18,
          "offsides": 1,
          "own_goals": 0,
          "penalties_missed": 0,
          "red_cards": 0,
          "shots_blocked": 14,
          "shots_off_target": 13,
          "shots_on_target": 14,
          "substituted_in": 3,
          "substituted_out": 10,
          "yellow_cards": 2,
          "yellow_red_cards": 0
        }
      },
      {
        "id": "sr:player:125274",
        "name": "Ortega, Stefan",
        "statistics": {
          "assists": 0,
          "goals_by_head": 0,
          "goals_by_penalty": 0,
          "goals_conceded": 7,
          "goals_scored": 0,
          "matches_played": 9,
          "own_goals": 0,
          "penalties_missed": 0,
          "
... (example cut here; 7 KB in the source page)
```

<br />

### Seasonal Stats by Match

To retrieve historical match statistics we'll want to access the "Sport Event" feeds. Depending on your use case, you may want the [Sport Event Lineups](https://developer.sportradar.com/soccer/reference/soccer-sport-event-lineups), [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary), or [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) feeds.

Let's say we want to retrieve the match statistics for the entire Premier League 2023 season. For this, we'll need to parse the [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary) feed.

https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/ sport_events/{sport_event_id}/summary.{format}

To build this request, we will need the unique `sport_event_id` for each game in the 2023 season, which we can locate in the [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule) feed.

Season Schedule requires the the `season_id` which we can access from the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed.

2023 Premier League Season Schedule: `https://api.sportradar.com/soccer/trial/v4/en/seasons/sr:season:105353/schedules.xml`

```xml 2023 Season Schedule Snippet
<season_schedules
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T15:19:49+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_schedules.xsd">
	<schedule>
		<sport_event id="sr:sport_event:41762837" start_time="2023-08-11T19:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:6" name="Burnley FC" country="England" country_code="ENG" abbreviation="BUR" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:806" name="Turf Moor" capacity="22546" city_name="Burnley" country_name="England" map_coordinates="53.789167,-2.230278" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="0" away_score="3" winner_id="sr:competitor:17">
			<period_scores>
				<period_score home_score="0" away_score="2" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762839" start_time="2023-08-12T12:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:14" name="Nottingham Forest" country="England" country_code="ENG" abbreviation="NFO" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:624" name="Emirates Stadium" capacity="60704" city_name="London" country_name="England" map_coordinates="51.555050,-0.108046" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="2" away_score="1" winner_id="sr:competitor:42">
			<period_scores>
				<period_score home_score="2" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762841" start_time="2023-08-12T14:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:60" name="AFC Bournemouth" country="England" country_code="ENG" abbreviation="BOU" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:37" name="West Ham United" country="England" country_code="ENG" abbreviation="WHU" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:2990" name="Vitality Stadium" capacity="11307" city_name="Bournemouth" country_name="England" map_coordinates="50.735278, -1.838333" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="1" away_score="1" match_tie="true">
			<period_scores>
				<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="1" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762843" start_time="2023-08-12T14:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:30" name="Brighton &amp; Hove Albion" country="England" country_code="ENG" abbreviation="BRI" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:72" name="Luton Town" country="England" country_code="ENG" abbreviation="LUT" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:2443" name="American Express Community Stadium" capacity="31876" city_name="Falmer" country_name="England" map_coordinates="50.861822,-0.083278" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="4" away_score="1" winner_id="sr:competitor:30">
			<period_scores>
				<period_score home_score="1" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="3" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762845" start_time="2023-08-12T14:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:48" name="Everton FC" country="England" country_code="ENG" abbreviation="EVE" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:43" name="Fulham FC" country="England" country_code="ENG" abbreviation="FUL" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:12" name="Goodison Park" capacity="39572" city_name="Liverpool" country_name="England" map_coordinates="53.439255,-2.967065" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="0" away_score="1" winner_id="sr:competitor:43">
			<period_scores>
				<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762847" start_time="2023-08-12T14:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:15" name="Sheffield United" country="England" country_code="ENG" abbreviation="SHU" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:7" name="Crystal Palace" country="England" country_code="ENG" abbreviation="CRY" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:598" name="Bramall Lane" capacity="32050" city_name="Sheffield" country_name="England" map_coordinates="53.370278,-1.470833" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="0" away_score="1" winner_id="sr:competitor:7">
			<period_scores>
				<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762849" start_time="2023-08-12T16:30:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:39" name="Newcastle United" country="England" country_code="ENG" abbreviation="NEW" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:40" name="Aston Villa" country="England" country_code="ENG" abbreviation="AVL" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:765" name="St. James' Park" capacity="52258" city_name="Newcastle upon Tyne" country_name="England" map_coordinates="54.975577, -1.621659" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="5" away_score="1" winner_id="sr:competitor:39">
			<period_scores>
				<period_score home_score="2" away_score="1" type="regular_period" number="1"/>
				<period_score home_score="3" away_score="0" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762851" start_time="2023-08-13T13:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:50" name="Brentford FC" country="England" country_code="ENG" abbreviation="BRE" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:33" name="Tottenham Hotspur" country="England" country_code="ENG" abbreviation="TOT" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:53349" name="Brentford Community Stadium" capacity="17250" city_name="London" country_name="England" map_coordinates="51.4907295,-0.2891696" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="2" away_score="2" match_tie="true">
			<period_scores>
				<period_score home_score="2" away_score="2" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="0" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762853" start_time="2023-08-13T15:30:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:38" name="Chelsea FC" country="England" country_code="ENG" abbreviation="CHE" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:799" name="Stamford Bridge" capacity="40341" city_name="London" country_name="England" map_coordinates="51.481579,-0.191094" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="1" away_score="1" match_tie="true">
			<period_scores>
				<period_score home_score="1" away_score="1" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="0" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762855" start_time="2023-08-14T19:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:35" name="Manchester United" country="England" country_code="ENG" abbreviation="MUN" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:3" name="Wolverhampton Wanderers" country="England" country_code="ENG" abbreviation="WOL" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:9" name="Old Trafford" capacity="75635" city_name="Manchester" country_name="England" map_coordinates="53.463150,-2.291444" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="1" away_score="0" winner_id="sr:competitor:35">
			<period_scores>
				<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="1" away_score="0" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:41762869" start_time="2023-08-18T18:45:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:105353" name="Premier League 23/24" start_date="2023-08-11" end_date="2024-05-19" year="23/24" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2023-08-11" end_date="2024-05-19" year="23/24"/>
				<round number="2"/>
				<groups>
					<group id="sr:league:74627" name="Premier League 23/24"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:14" name="Nottingham Forest" country="England" country_code="ENG" abbreviation="NFO" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:15" name="Sheffield United" country="England" country_code="ENG" abbreviation="SHU" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:2230" name="City Ground" capacity="30404" city_name="Nottingham" country_name="England" map_coordinates="52.940000,-1.132778" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="2" away_score="1" winner_id="sr:competitor:14">
			<period_scores>
				<period_score home_score="1" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="1" away_score="1" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
  </season_schedules>
```

Use each `sport_event.id` instance in the 2023 Schedule to retrieve the individual [match statistics](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary) for every match in that season.

Sport Event Summary Sample Request: `https://api.sportradar.com/soccer/trial/v4/en/sport_events/sr:sport_event:41762841/summary.xml`

Use this same retrieval method for all Soccer seasons and competitions, and interchange the "Sport Event" feed as necessary depending on your need.

<br />

<br />

<br />

<br />
