---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.193Z
---
# Fixtures (Schedules)

  ### Fixtures = Schedules

  In both global soccer terminology and in our Soccer API documentation, fixtures and schedules are interchangeable terms that refer to upcoming matches—whether for a team, player, or competition.

## Prerequisite: Confirm Season Availability and Coverage

Understanding which seasons are available—and what [level of data coverage is provided](https://developer.sportradar.com/soccer/docs/soccer-ig-data-availability-coverage)—is essential for making reliable and accurate API calls.

* Use the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed to view all available seasons for each competition in the API.
* Reference the [Coverage Matrix](https://coverage-matrix.sportradar.com/) to determine the depth of coverage by competition tier (Tier 1–9).
* Use the [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) feed to confirm what data is available for a given season of the target competition (e.g., player transfers, team squads, stats levels).

Validating coverage and season availability early can help prevent errors and streamline your data integration process.

<br />

***

## Fixture Releases

Match schedules are published within four hours of official confirmation and may appear up to one month in advance, depending on competition priority and availability.

#### Lineups

Starting lineups are announced approximately one hour before kickoff and may be updated up to the start of the match.\
We aim to deliver this data during that window, with the latest expected availability being 15 minutes into the match.

<br />

***

## Schedule Feeds Available

Accessing the schedule is fundamental to your integration and essential in critical scenarios. For instance, if you need to [retrieve live match data](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval), you'll first need to pull a schedule feed to obtain the event IDs for the specific matches you're targeting.

You can access Soccer scheduling data using the following feeds:

* [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules) - Provides all upcoming scheduled matches and results for the past 30 matches for a given team.
* [Competitor vs. Competitor](https://developer.sportradar.com/soccer/reference/soccer-competitor-vs-competitor) - Provides previous and upcoming matches between two teams including scoring information, player and team match statistics.
* [Daily Schedules](https://developer.sportradar.com/soccer/reference/soccer-daily-schedules) - Provides a list of scheduled matches for a given day.
* [Live Schedules ](https://developer.sportradar.com/soccer/reference/soccer-live-schedules)- Provides match information for all currently live matches. This feed updates in real time as matches are played. Matches appear a few minutes before kick-off and disappear a few minutes after the match reaches an `ended` status.
* [Player Schedules](https://developer.sportradar.com/soccer/reference/soccer-player-schedules) - Provides schedules and results of the last 10 matches played for a given player.
* [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule) - Provides basic match information for all matches for a given season, including scoring (for previous games) and match coverage.
* [Seasons Disabled](https://developer.sportradar.com/soccer/reference/soccer-seasons-disabled) - Provides a list of currently disabled seasons, including future seasons that have not yet been enabled. Request this to obtain IDs for seasons not yet available in the above feeds. *Note: Season details and availability are subject to change prior to enablement.*

<br />

***

## Retrieving Season Schedules

You can use the [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule) endpoint to retrieve basic match information for all matches for a given season, including scoring and match coverage.

1. Call the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) endpoint to retrieve the `season_id` for a tournament season your target team is participating in.
2. Call the [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule) endpoint using the `season_id` to access the list of matches for that season.

<details>
  <summary><b><u>Season Schedule - Response Snippet</u></b></summary>

```xml Season Schedule Snippet (XML)
<?xml version="1.0" encoding="UTF-8"?>
<season_schedules
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-16T13:34:07+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_schedules.xsd">
	<schedule>
		<sport_event id="sr:sport_event:50849967" start_time="2024-08-16T19:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:84075" name="Premier League 24/25"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:35" name="Manchester United" country="England" country_code="ENG" abbreviation="MUN" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:43" name="Fulham FC" country="England" country_code="ENG" abbreviation="FUL" qualifier="away" gender="male"/>
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
		<sport_event id="sr:sport_event:50849969" start_time="2024-08-17T11:30:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:84075" name="Premier League 24/25"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:32" name="Ipswich Town" country="England" country_code="ENG" abbreviation="IPS" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:2188" name="Portman Road Stadium" capacity="30017" city_name="Ipswich" country_name="England" map_coordinates="52.055061,1.144831" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="0" away_score="2" winner_id="sr:competitor:44">
			<period_scores>
				<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="2" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:50849971" start_time="2024-08-17T14:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
				<round number="1"/>
				<groups>
					<group id="sr:league:84075" name="Premier League 24/25"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:3" name="Wolverhampton Wanderers" country="England" country_code="ENG" abbreviation="WOL" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:624" name="Emirates Stadium" capacity="60704" city_name="London" country_name="England" map_coordinates="51.555050,-0.108046" country_code="ENG" timezone="Europe/London"/>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="2" away_score="0" winner_id="sr:competitor:42">
			<period_scores>
				<period_score home_score="1" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="1" away_score="0" type="regular_period" number="2"/>
			</period_scores>
		</sport_event_status>
	</schedule>
	</season_schedules>
```
```json Season Schedule Snippet (JSON)
{
  "generated_at": "2025-07-16T13:34:00+00:00",
  "schedules": [
    {
      "sport_event": {
        "id": "sr:sport_event:50849967",
        "start_time": "2024-08-16T19:00:00+00:00",
        "start_time_confirmed": true,
        "sport_event_context": {
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
          },
          "season": {
            "id": "sr:season:118689",
            "name": "Premier League 24/25",
            "start_date": "2024-08-16",
            "end_date": "2025-05-25",
            "year": "24/25",
            "competition_id": "sr:competition:17"
          },
          "stage": {
            "order": 1,
            "type": "league",
            "phase": "regular season",
            "start_date": "2024-08-16",
            "end_date": "2025-05-25",
            "year": "24/25"
          },
          "round": {
            "number": 1
          },
          "groups": [
            {
              "id": "sr:league:84075",
              "name": "Premier League 24/25"
            }
          ]
        },
        "coverage": {
          "type": "sport_event",
          "sport_event_properties": {
            "lineups": true,
            "formations": false,
            "venue": true,
            "extended_play_by_play": true,
            "extended_player_stats": true,
            "extended_team_stats": true,
            "lineups_availability": "pre",
            "ballspotting": true,
            "commentary": true,
            "fun_facts": true,
            "goal_scorers": true,
            "goal_scorers_live": true,
            "scores": "live",
            "game_clock": true,
            "deeper_play_by_play": true,
            "deeper_player_stats": true,
            "deeper_team_stats": true,
            "basic_play_by_play": true,
            "basic_player_stats": true,
            "basic_team_stats": true
          }
        },
        "competitors": [
          {
            "id": "sr:competitor:35",
            "name": "Manchester United",
            "country": "England",
            "country_code": "ENG",
            "abbreviation": "MUN",
            "qualifier": "home",
            "gender": "male"
          },
          {
            "id": "sr:competitor:43",
            "name": "Fulham FC",
            "country": "England",
            "country_code": "ENG",
            "abbreviation": "FUL",
            "qualifier": "away",
            "gender": "male"
          }
        ],
        "venue": {
          "id": "sr:venue:9",
          "name": "Old Trafford",
          "capacity": 75635,
          "city_name": "Manchester",
          "country_name": "England",
... (example cut here; 10 KB in the source page)
```

You can use the data in the schedules array to power Arsenal FC’s upcoming match display across Premier League fixtures.

</details>

<br />

***

## Displaying Team Schedules

You can use the [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules) endpoint to display a specific team's schedule on your platform.

1. Call the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) endpoint to retrieve the `season_id` for a tournament season your target team is participating in. This ID is required to access the team's schedule data for a specified season.
2. Call the [Season Competitors](https://developer.sportradar.com/soccer/reference/soccer-season-competitors) endpoint using the `season_id` to access the `competitor_id`.
3. Call the [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules) endpoint using the `competitor_id`.\
   This endpoint returns the team’s upcoming matches and past 30 matches across all leagues in which they participate.
4. (Optional) Filter the data for the league(s) you’re interested in.

<details>
  <summary><b><u>Competitor Schedules - Response Snippet</u></b></summary>

```xml Competitor Schedules Snippet (XML)
<competitor_schedules
                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T16:32:02+00:00"
                      xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/competitor_schedules.xsd">
  <schedule>
    <sport_event id="sr:sport_event:57490697" start_time="2025-06-29T16:00:00+00:00" start_time_confirmed="true">
      <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:393" name="International Clubs"/>
        <competition id="sr:competition:357" name="FIFA Club World Cup" gender="men"/>
        <season id="sr:season:126393" name="FIFA Club World Cup 2025" start_date="2025-06-01" end_date="2025-07-13" year="2025" competition_id="sr:competition:357"/>
        <stage order="3" type="cup" phase="playoffs" start_date="2025-06-28" end_date="2025-07-13" year="2025"/>
        <round name="round_of_16" cup_round_sport_event_number="1" cup_round_number_of_sport_events="1" cup_round_id="sr:cup_round:2306489"/>
        <groups>
          <group id="sr:cup:175667" name="FIFA Club World Cup 2025, Playoffs"/>
        </groups>
      </sport_event_context>
      <coverage type="sport_event">
        <sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="false" extended_player_stats="false" extended_team_stats="false" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
      </coverage>
      <competitors>
        <competitor id="sr:competitor:1644" name="Paris Saint-Germain" country="France" country_code="FRA" abbreviation="PSG" qualifier="home" gender="male"/>
        <competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="away" gender="male"/>
      </competitors>
      <venue id="sr:venue:20343" name="Mercedes-Benz Stadium" capacity="71000" city_name="Atlanta, GA" country_name="USA" map_coordinates="33.757368,-84.401008" country_code="USA" timezone="America/New_York"/>
      <sport_event_conditions>
        <referees>
          <referee id="sr:referee:243701" name="Pereira Sampaio, Wilton" nationality="Brazil" country_code="BRA" type="main_referee"/>
        </referees>
        <attendance count="65574"/>
        <weather pitch_conditions="good"/>
        <ground neutral="true"/>
        <lineups confirmed="true"/>
      </sport_event_conditions>
    </sport_event>
    <sport_event_status status="closed" match_status="ended" home_score="4" away_score="0" winner_id="sr:competitor:1644">
      <period_scores>
        <period_score home_score="4" away_score="0" type="regular_period" number="1"/>
        <period_score home_score="0" away_score="0" type="regular_period" number="2"/>
      </period_scores>
      <ball_locations>
        <ball_location order="4" x="34" y="32" qualifier="away"/>
        <ball_location order="3" x="94" y="39" qualifier="away"/>
        <ball_location order="2" x="94" y="39" qualifier="home"/>
        <ball_location order="1" x="84" y="15" qualifier="home"/>
      </ball_locations>
      <match_situation status="attack" qualifier="away" updated_at="2025-06-29T17:52:45+00:00"/>
    </sport_event_status>
  </schedule>
  <schedule>
    <sport_event id="sr:sport_event:56690813" start_time="2025-06-28T23:30:00+00:00" start_time_confirmed="true" replaced_by="sr:sport_event:61472753">
      <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:26" name="USA" country_code="USA"/>
        <competition id="sr:competition:242" name="MLS" gender="men"/>
        <season id="sr:season:127179" name="MLS 2025" start_date="2025-02-22" end_date="2025-12-08" year="2025" competition_id="sr:competition:242"/>
        <stage order="1" type="league" phase="regular season" start_date="2025-02-22" end_date="2025-10-20" year="2025"/>
        <round/>
        <groups>
          <group id="sr:league:89897" name="MLS 2025"/>
          <group id="sr:league:89899" name="MLS 2025, Eastern Conference" group_name="Eastern Conference"/>
        </groups>
      </sport_event_context>
      <coverage type="sport_event">
        <sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
      </coverage>
      <competitors>
        <competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="home" gender="male"/>
        <competitor id="sr:competitor:305920" name="Atlanta United FC" country="USA" country_code="USA" abbreviation="ATL" qualifier="away" gender="male"/>
      </competitors>
      <venue id="sr:venue:51991" name="Chase Stadium" capacity="21550" city_name="Fort Lauderdale, FL" country_name="USA" map_coordinates="26.193056, -80.161111" country_code="USA" timezone="America/New_York"/>
      <channels>
        <channel name="Apple TV" country="United States" country_code="USA"/>
      </channels>
      <sport_event_conditions>
        <ground neutral="false"/>
      </sport_event_conditions>
    </sport_event>
    <sport_event_status status="postponed" match_status="postponed"/>
  </schedule>
  <schedule>
    <sport_event id="sr:sport_event:56189293" start_time="2025-06-24T01:00:00+00:00" start_time_confirmed="true">
      <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:393" name="International Clubs"/>
        <competition id="sr:competition:357" name="FIFA Club World Cup" gender="men"/>
        <season id="sr:season:126393" name="FIFA Club World Cup 2025" start_date="2025-06-01" end_date="2025-07-13" year="2025" competition_id="sr:competition:357"/>
        <stage order="2" type="league" phase="regular season" start_date="2025-06-15" end_date="2025-06-27" year="2025"/>
        <round number="3"/>
        <groups>
          <group id="sr:league:89287" name="FIFA Club World Cup 2025, Group A" group_name="A"/>
        </groups>
      </sport_event_context>
      <coverage type="sport_event">
        <sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="false" extended_player_stats="false" extended_team_stats="false" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
      </coverage>
      <competitors>
        <competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="home" gender="male"/>
        <competitor id="sr:competitor:1963" name="SE Palmeiras SP" country="Brazil" country_code="BRA" abbreviation="PAL" qualifier="away" gender="male"/>
      </competitors>
      <venue id="sr:venue:21306" name="Hard Rock Stadium" capacity="65326" city_name="Miami, FL" country_name="USA" map_coordinates="25.958025,-80.238724" country_code="USA" timezone="America/New_York"/>
      <sport_event_conditions>
        <referees>
          <referee id="sr:referee:72926" name="Marciniak, Szymon" nationality="Poland" country_code="POL" type="main_referee"/>
        </referees>
        <attendance count="60914"/>
        <weather pitch_conditions="good" overall_conditions="medium"/>
        <ground neutral="true"/>
        <lineups confirmed="true"/>
      </sport_event_conditions>
    </sport_event>
    <sport_event_status status="closed" match_status="ended" home_score="2" away_score="2" match_tie="true">
      <period_scores>
        <period_score home_score="1" away_score="0" type="regular_period" number="1"/>
        <period_score home_score="1" away_score="2" type="regular_period" number="2"/>
      </period_scores>
      <ball_locations>
        <ball_location order="4" x="16" y="47" qualifier="away"/>
        <ball_location order="3" x="12" y="53" qualifier="away"/>
        <ball_location order="2" x="44" y="52" qualifier="away"/>
        <ball_location order="1" x="54" y="50" qualifier="away"/>
      </ball_locations>
      <match_situation status="dangerous" qualifier="away" updated_at="2025-06-24T02:54:34+00:00"/>
    </sport_event_status>
  </schedule>
  <schedule>
    <sport_event id="sr:sport_event:56189291" start_time="2025-06-19T19:00:00+00:00" start_time_confirmed="true">
      <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:393" name="International Clubs"/>
        <competition id="sr:competition:357" name="FIFA Club World Cup" gender="men"/>
        <season id="sr:season:126393" name="FIFA Club World Cup 2025" start_date="2025-06-01" end_date="2025-07-13" year="2025" competition_id="sr:competition:357"/>
        <stage order="2" type="league" phase="regular season" start_date="2025-06-15" end_date="2025-06-27" year="2025"/>
        <round number="2"/>
        <groups>
          <group id="sr:league:89287" name="FIFA Club World Cup 2025, Group A" group_name="A"/>
        </groups>
      </sport_event_context>
      <coverage type="sport_event">
        <sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="false" extended_player_stats="false" extended_team_stats="false" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
      </coverage>
      <competitors>
        <competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="home" gender="male"/>
        <competitor id="sr:competitor:3002" name="FC Porto" country="Portugal" country_code="PRT" abbreviation="FCP" qualifier="away" gender="male"/>
      </competitors>
      <venue id="sr:venue:20343" name="Mercedes-Benz Stadium" capacity="71000" city_name="Atlanta, GA" country_name="USA" map_coordinates="33.757368,-84.401008" country_code="USA" timezone="America/New_York"/>
      <sport_event_conditions>
        <referees>
          <referee id="sr:referee:1405029" name="Garay, Cristian" nationality="Chile" country_code="CHL" type="main_referee"/>
        </referees>
        <attendance count="31783"/>
        <weather pitch_conditions="good" overall_conditions="medium"/>
        <ground neutral="true"/>
        <lineups confirmed="true"/>
      </sport_event_conditions>
    </sport_event>
    <sport_event_status status="closed" match_status="ended" home_score="2" away_score="1" winner_id="sr:competitor:659691">
      <period_scores>
        <period_score home_score="0" away_score="1" type="regular_period" number="1"/>
        <period_score home_score="2" away_score="0" type="regular_period" number="2"/>
      </period_scores>
      <ball_locations>
        <ball_location order="4" x="100" y="100" qualifier="home"/>
        <ball_location order="3" x="90" y="63" qualifier="home"/>
        <ball_location order="2" x="84" y="59" qualifier="home"/>
        <ball_location order="1" x="89" y="63" qualifier="home"/>
      </ball_locations>
      <match_situation status="dangerous" qualifier="home" updated_at="2025-06-19T20:59:39+00:00"/>
    </sport_event_status>
  </schedule>
  <schedule>
    <sport_event id="sr:sport_event:56189281" start_time="2025-06-15T00:00:00+00:00" start_time_confirmed="true">
      <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:393" name="International Clubs"/>
        <competition id="sr:competition:357" name="FIFA Club World Cup" gender="men"/>
        <season id="sr:season:126393" name="FIFA Club World Cup 2025" start_date="2025-06-01" end_date="2025-07-13" year="2025" competition_id="sr:competition:357"/>
        <stage order="2" type="league" phase="regular season" start_date="2025-06-15" end_date="2025-06-27" year="2025"/>
        <round number="1"/>
        <groups>
          <group id="sr:league:89287" name="FIFA Club World Cup 2025, Group A" group_name="A"/>
        </groups>
      </sport_event_context>
      <coverage type="sport_event">
        <sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="false" extended_player_stats="false" extended_team_stats="false" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
      </coverage>
      <competitors>
        <competitor id="sr:competitor:6910" name="AL Ahly SC (EGY)" country="Egypt" country_code="EGY" abbreviation="AHL" qualifier="home" gender="male"/>
        <competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="away" gender="male"/>
      </competitors>
      <venue id="sr:venue:21306" name="Hard Rock Stadium" capacity="65326" city_name="Miami, FL" country_name="USA" map_coordinates="25.958025,-80.238724" country_code="USA" timezone="America/New_York"/>
      <channels>
        <channel name="Italia 1 HD - Hot Bird 1/2/3/4/6 (13.0E)" url="http://guidatv.sky.it/guidatv/grid.html?category=sport" country="Italy" country_code="ITA"/>
        <channel name="DAZN 1 France - Astra 1C-1H / 2C (19.2E)" url="https://www.footao.tv/" country="France" country_code="FRA"/>
      </channels>
      <sport_event_conditions>
        <referees>
          <referee id="sr:referee:144373" name="Faghani, Alireza" nationality="Australia" country_code="AUS" type="main_referee"/>
        </referees>
        <attendance count="60927"/>
        <weather pitch_conditions="good" overall_conditions="medium"/>
        <ground neutral="true"/>
        <lineups confirmed="true"/>
      </sport_event_conditions>
    </sport_event>
    <sport_event_status status="closed" match_status="ended" home_score="0" away_score="0" match_tie="true">
      <period_scores>
        <period_score home_score="0" away_score="0" type="regular_period" number="1"/>
        <period_score home_score="0" away_score="0" type="regular_period" number="2"/>
      </period_scores>
      <ball_locations>
        <ball_location order="4" x="89" y="65" qualifier="home"/>
        <ball_location order="3" x="91" y="63" qualifier="home"/>
        <ball_location order="2" x="92" y="64" qualifier="home"/>
        <ball_location order="1" x="91" y="69" qualifier="home"/>
      </ball_locations>
      <match_situation status="dangerous" qualifier="home" updated_at="2025-06-15T02:06:48+00:00"/>
    </sport_event_status>
  </schedule>
  <schedule>
    <sport_event id="sr:sport_event:56690727" start_time="2025-05-31T23:30:00+00:00" start_time_confirmed="true">
      <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:26" name="USA" country_code="USA"/>
        <competition id="sr:competition:242" name="MLS" gender="men"/>
        <season id="sr:season:127179" name="MLS 2025" start_date="2025-02-22" end_date="2025-12-08" year="2025" competition_id="sr:competition:242"/>
        <stage order="1" type="league" phase="regular season" start_date="2025-02-22" end_date="2025-10-20" year="2025"/>
        <round/>
        <groups>
          <group id="sr:league:89897" name="MLS 2025"/>
          <group id="sr:league:89899" name="MLS 2025, Eastern Conference" group_name="Eastern Conference"/>
        </groups>
      </sport_event_context>
      <coverage type="sport_event">
        <sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
      </coverage>
      <competitors>
        <competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="home" gender="male"/>
        <competitor id="sr:competitor:2504" name="Columbus Crew" country="USA" country_code="USA" abbreviation="CLB" qualifier="away" gender="male"/>
      </competitors>
      <venue id="sr:venue:51991" name="Chase Stadium" capacity="21550" city_name="Fort Lauderdale, FL" country_name="USA" map_coordinates="26.193056, -80.161111" country_code="USA" timezone="America/New_York"/>
      <channels>
        <channel name="Apple TV" country="United States" country_code="USA"/>
      </channels>
      <sport_event_conditions>
        <referees>
          <referee id="sr:referee:1560614" name="Mendoza, Rosendo" nationality="USA" country_code="USA" type="main_referee"/>
          <referee id="sr:referee:1322180" name="Greeson, Jeffrey" nationality="USA" country_code="USA" type="first_assistant_referee"/>
          <referee id="sr:referee:2057859" name="Lock, Kevin" nationality="USA" country_code="USA" type="second_assistant_referee"/>
          <referee id="sr:referee:1560828" name="Osmanovic, Elvis" nationality="USA" country_code="USA" type="fourth_official"/>
          <referee id="sr:referee:200528" name="Jurisevic, Edvin" nationality="USA" country_code="USA" type="video_assistant_referee"/>
        </referees>
        <attendance count="20861"/>
        <weather pitch_conditions="good" overall_conditions="medium"/>
        <ground neutral="false"/>
        <lineups confirmed="true"/>
      </sport_event_conditions>
    </sport_event>
    <sport_event_status status="closed" match_status="ended" home_score="5" away_score="1" winner_id="sr:competitor:659691">
      <period_scores>
        <period_score home_score="3" away_score="0" type="regular_period" number="1"/>
        <period_score home_score="2" away_score="1" type="regular_period" number="2"/>
      </period_scores>
      <ball_locations>
        <ball_location order="4" x="39" y="72" qualifier="away"/>
        <ball_location order="3" x="16" y="48" qualifier="away"/>
        <ball_location order="2" x="16" y="44" qualifier="away"/>
        <ball_location order="1" x="0" y="100" qualifier="away"/>
      </ball_locations>
      <match_situation status="attack" qualifier="away" updated_at="2025-06-01T01:31:51+00:00"/>
    </sport_event_status>
  </schedule>
</competitor_schedules>
```
```json Competitor Schedules Snippet (JSON)
{
  "generated_at": "2025-06-30T16:28:34+00:00",
  "schedules": [
    {
      "sport_event": {
        "id": "sr:sport_event:57490697",
        "start_time": "2025-06-29T16:00:00+00:00",
        "start_time_confirmed": true,
        "sport_event_context": {
          "sport": {
            "id": "sr:sport:1",
            "name": "Soccer"
          },
          "category": {
            "id": "sr:category:393",
            "name": "International Clubs"
          },
          "competition": {
            "id": "sr:competition:357",
            "name": "FIFA Club World Cup",
            "gender": "men"
          },
          "season": {
            "id": "sr:season:126393",
            "name": "FIFA Club World Cup 2025",
            "start_date": "2025-06-01",
            "end_date": "2025-07-13",
            "year": "2025",
            "competition_id": "sr:competition:357"
          },
          "stage": {
            "order": 3,
            "type": "cup",
            "phase": "playoffs",
            "start_date": "2025-06-28",
            "end_date": "2025-07-13",
            "year": "2025"
          },
          "round": {
            "name": "round_of_16",
            "cup_round_sport_event_number": 1,
            "cup_round_number_of_sport_events": 1,
            "cup_round_id": "sr:cup_round:2306489"
          },
          "groups": [
            {
              "id": "sr:cup:175667",
              "name": "FIFA Club World Cup 2025, Playoffs"
            }
          ]
        },
        "coverage": {
          "type": "sport_event",
          "sport_event_properties": {
            "lineups": true,
            "formations": false,
            "venue": true,
            "extended_play_by_play": false,
            "extended_player_stats": false,
            "extended_team_stats": false,
            "lineups_availability": "pre",
            "ballspotting": true,
            "commentary": true,
            "fun_facts": true,
            "goal_scorers": true,
            "goal_scorers_live": true,
            "scores": "live",
            "game_clock": true,
            "deeper_play_by_play": true,
            "deeper_player_stats": true,
            "deeper_team_stats": true,
            "basic_play_by_play": true,
            "basic_player_stats": true,
            "basic_team_stats": true
          }
        },
        "competitors": [
          {
            "id": "sr:competitor:1644",
            "name": "Paris Saint-Germain",
            "country": "France",
            "country_code": "FRA",
            "abbreviation": "PSG",
            "qualifier": "home",
            "gender": "male"
          },
          {
            "id": "sr:competitor:659691",
            "name": "Inter Miami CF",
            "country": "USA",
            "country_code": "USA",
            "abbreviation": "MIA",
            "qualifier": "away",
            "gender": "male"
          }
        ],
        "venue": {
... (example cut here; 23 KB in the source page)
```

You can use the data in the schedules array to power Inter Miami CF’s upcoming match schedule across multiple competitions. Filtering the entries where the `competitor.id` matches Inter Miami’s ID (`sr:competitor:659691`) and `sport_event_status.status` is not `closed`, enables you to highlight future fixtures within the team's schedule data.

</details>

The visual below demonstrates one way to render Competition Schedule data on your site. This example filters for upcoming Inter Miami CF matches in the MLS competition (`sr:competition:242`).

![](https://files.readme.io/1299a43e540a45beea2c228dc16f3199cd6af6dc2171f6523445d6450c067104-image.png)

  ### Accessing Images

  To access images in the Soccer API, use the **[Images API](https://developer.sportradar.com/images-and-editorials/reference/images-overview)**.

<br />

### Displaying Upcoming Matches Between Two Teams

To display upcoming matches between two teams, use the [Competitor vs. Competitor](https://developer.sportradar.com/soccer/reference/soccer-competitor-vs-competitor) endpoint.

1. Call the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) endpoint to retrieve the `season_id` for a tournament season your target teams are participating in. This ID is required to access the teams' schedule data for a specified season.
2. Call the [Season Competitors](https://developer.sportradar.com/soccer/reference/soccer-season-competitors) endpoint using the `season_id` to access the `competitor_id` for both teams.
3. Call the [Competitor vs. Competitor](https://developer.sportradar.com/soccer/reference/soccer-competitor-vs-competitor) endpoint using the `competitor_id` for both teams.\
   This endpoint returns the upcoming matches between the two teams **including scoring information, player and team match statistics.**

<details>
  <summary><b><u>Competitor vs. Competitor - Response Snippet</u></b></summary>

```xml Competitor vs. Competitor Snippet (XML)
<?xml version="1.0" encoding="UTF-8"?>
<competitor_versus_summaries
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-02T14:01:02+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/competitor_versus_summaries.xsd">
	<competitors>
		<competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" gender="male"/>
		<competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" gender="male"/>
	</competitors>
	<next_meetings>
		<summary>
			<sport_event id="sr:sport_event:61300919" start_time="2026-01-07T20:00:00+00:00" start_time_confirmed="true">
				<sport_event_context>
					<sport id="sr:sport:1" name="Soccer"/>
					<category id="sr:category:1" name="England" country_code="ENG"/>
					<competition id="sr:competition:17" name="Premier League" gender="men"/>
					<season id="sr:season:130281" name="Premier League 25/26" start_date="2025-08-15" end_date="2026-05-24" year="25/26" competition_id="sr:competition:17"/>
					<stage order="1" type="league" phase="regular season" start_date="2025-08-15" end_date="2026-05-24" year="25/26"/>
					<round number="21"/>
					<groups>
						<group id="sr:league:95139" name="Premier League 25/26"/>
					</groups>
				</sport_event_context>
				<coverage type="sport_event">
					<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="false" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="false" deeper_player_stats="false" deeper_team_stats="false" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
				</coverage>
				<competitors>
					<competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" qualifier="home" gender="male"/>
					<competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" qualifier="away" gender="male"/>
				</competitors>
				<venue id="sr:venue:624" name="Emirates Stadium" capacity="60704" city_name="London" country_name="England" map_coordinates="51.555050,-0.108046" country_code="ENG" timezone="Europe/London"/>
				<sport_event_conditions>
					<ground neutral="false"/>
				</sport_event_conditions>
			</sport_event>
			<sport_event_status status="not_started" match_status="not_started"/>
		</summary>
		<summary>
			<sport_event id="sr:sport_event:61300553" start_time="2025-08-30T14:00:00+00:00" start_time_confirmed="true">
				<sport_event_context>
					<sport id="sr:sport:1" name="Soccer"/>
					<category id="sr:category:1" name="England" country_code="ENG"/>
					<competition id="sr:competition:17" name="Premier League" gender="men"/>
					<season id="sr:season:130281" name="Premier League 25/26" start_date="2025-08-15" end_date="2026-05-24" year="25/26" competition_id="sr:competition:17"/>
					<stage order="1" type="league" phase="regular season" start_date="2025-08-15" end_date="2026-05-24" year="25/26"/>
					<round number="3"/>
					<groups>
						<group id="sr:league:95139" name="Premier League 25/26"/>
					</groups>
				</sport_event_context>
				<coverage type="sport_event">
					<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="false" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="false" deeper_player_stats="false" deeper_team_stats="false" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
				</coverage>
				<competitors>
					<competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" qualifier="home" gender="male"/>
					<competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" qualifier="away" gender="male"/>
				</competitors>
				<venue id="sr:venue:579" name="Anfield" capacity="61276" city_name="Liverpool" country_name="England" map_coordinates="53.430622,-2.960919" country_code="ENG" timezone="Europe/London"/>
				<sport_event_conditions>
					<ground neutral="false"/>
				</sport_event_conditions>
			</sport_event>
			<sport_event_status status="not_started" match_status="not_started"/>
		</summary>
	</next_meetings>
</competitor_versus_summaries>

```
```json Competitor vs. Competitor Snippet (JSON)
{
  "competitors": [
    {
      "id": "sr:competitor:44",
      "name": "Liverpool FC",
      "country": "England",
      "country_code": "ENG",
      "abbreviation": "LFC",
      "gender": "male"
    },
    {
      "id": "sr:competitor:42",
      "name": "Arsenal FC",
      "country": "England",
      "country_code": "ENG",
      "abbreviation": "ARS",
      "gender": "male"
    }
  ],
"next_meetings": [
    {
      "sport_event": {
        "id": "sr:sport_event:61300919",
        "start_time": "2026-01-07T20:00:00+00:00",
        "start_time_confirmed": true,
        "sport_event_context": {
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
          },
          "season": {
            "id": "sr:season:130281",
            "name": "Premier League 25/26",
            "start_date": "2025-08-15",
            "end_date": "2026-05-24",
            "year": "25/26",
            "competition_id": "sr:competition:17"
          },
          "stage": {
            "order": 1,
            "type": "league",
            "phase": "regular season",
            "start_date": "2025-08-15",
            "end_date": "2026-05-24",
            "year": "25/26"
          },
          "round": {
            "number": 21
          },
          "groups": [
            {
              "id": "sr:league:95139",
              "name": "Premier League 25/26"
            }
          ]
        },
        "coverage": {
          "type": "sport_event",
          "sport_event_properties": {
            "lineups": true,
            "formations": false,
            "venue": true,
            "extended_play_by_play": true,
            "extended_player_stats": true,
            "extended_team_stats": true,
            "lineups_availability": "pre",
            "ballspotting": false,
            "commentary": true,
            "fun_facts": true,
            "goal_scorers": true,
            "goal_scorers_live": true,
            "scores": "live",
            "game_clock": true,
            "deeper_play_by_play": false,
            "deeper_player_stats": false,
            "deeper_team_stats": false,
            "basic_play_by_play": true,
            "basic_player_stats": true,
            "basic_team_stats": true
          }
        },
        "competitors": [
          {
            "id": "sr:competitor:42",
            "name": "Arsenal FC",
            "country": "England",
            "country_code": "ENG",
            "abbreviation": "ARS",
            "qualifier": "home",
            "gender": "male"
          },
          {
            "id": "sr:competitor:44",
            "name": "Liverpool FC",
            "country":
... (example cut here; 7 KB in the source page)
```

In this example, the data highlights future meetings between Liverpool FC and Arsenal FC during the 2025/26 Premier League season. Each entry includes key match metadata such as start time, venue, competition, and coverage details. You can use this to power match previews, team comparison modules, or fan-facing schedule pages that focus on direct rivalries between clubs.

</details>

<br />

### Showcasing Recent Matches by Team

In addition to listing upcoming matches, the [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules) and [Competitor vs. Competitor](https://developer.sportradar.com/soccer/reference/soccer-competitor-vs-competitor) feeds also provide data for **recent matches**. You can use entries where status is `closed` or `ended` to display dates and final scores.

![](https://files.readme.io/0a53f70e015d8bcb7b2993eca2b3a75acc299c995467167e492d61b290d6a67e-image.png)

<br />

***

## Displaying Players' Recent Matches

You can use the [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules) endpoint to display a specific player's 10 recent matches on your platform.

1. Call the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) endpoint to retrieve the `season_id` for a tournament season your target player is participating in. This ID is required to access the player's schedule data for a specified season.
2. Call the [Season Players](https://developer.sportradar.com/soccer/reference/soccer-season-players) endpoint using the `season_id` to access the `player_id`.
3. Call the [Player Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules) endpoint using the `player_id`.\
   This endpoint returns the player's 10 most recent matches across all leagues they are participating in.
4. (Optional) Filter the data for the league(s) you’re interested in.

<details>
  <summary><b><u>Player Schedules - Response Snippet</u></b></summary>

```xml Player Schedules Snippet (XML)
<player_schedules
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-02T13:27:25+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/player_schedules.xsd">
	<schedule>
		<sport_event id="sr:sport_event:50850645" start_time="2025-04-22T19:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
				<round number="34"/>
				<groups>
					<group id="sr:league:84075" name="Premier League 24/25"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:40" name="Aston Villa" country="England" country_code="ENG" abbreviation="AVL" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:606" name="Etihad Stadium" capacity="55097" city_name="Manchester" country_name="England" map_coordinates="53.484592,-2.202695" country_code="ENG" timezone="Europe/London"/>
			<channels>
				<channel name="Sky Sports Main Event HD - Astra 2A/2B/2D (28.2E)" url="http://www.skysports.com/watch/sport-on-sky" country="Great Britain" country_code="GBR"/>
				<channel name="Sky Sport Uno HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://guidatv.sky.it/sport-e-calcio?vista=griglia" country="Italy" country_code="ITA"/>
				<channel name="Sky Sport Calcio HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://www.goal.com/it/notizie/guida-tv-dove-vedere-tutto-il-calcio-in-diretta-e-streaming/1674frahvw8qt1nojf0cwjwlzr" country="Italy" country_code="ITA"/>
				<channel name="Digi Sport 2 RO - Thor 2/3 (1.0W)" url="http://www.digisport.ro/Program/" country="Romania" country_code="ROU"/>
				<channel name="Sky Sports PL HD - Astra 2A/2B/2D (28.2E)" url="http://www.skysports.com/watch/sport-on-sky" country="Great Britain" country_code="GBR"/>
				<channel name="V Sport Premium HD - Thor 2/3 (1.0W)" url="https://www.allente.se/tv-guide/" country="Sweden" country_code="SWE"/>
				<channel name="Spiler 1 TV - Thor 2/3 (1.0W)" url="http://spilertv.hu/musorujsag/" country="Hungary" country_code="HUN"/>
				<channel name="Universo" country="United States" country_code="USA"/>
				<channel name="USA Network" url="https://www.usanetwork.com/" country="United States" country_code="USA"/>
				<channel name="Fubo TV" url="https://www.livesoccertv.com/channels/fubo-tv/" country="United States" country_code="USA"/>
				<channel name="Sky Sport Premier League HD - Astra 1C-1H / 2C (19.2E)" url="https://info.sky.de/inhalt/de/programm_info_live_events_start.jsp" country="Germany" country_code="DEU"/>
				<channel name="CANAL+ Foot FR - Astra 1C-1H / 2C (19.2E)" url="https://www.canalplus.com/programme-tv/" country="France" country_code="FRA"/>
				<channel name="Novasports PL HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://www.gazzetta.gr/tv-program" country="Greece" country_code="GRC"/>
			</channels>
			<sport_event_conditions>
				<referees>
					<referee id="sr:referee:81627" name="Pawson, Craig" nationality="England" country_code="ENG" type="main_referee"/>
					<referee id="sr:referee:1428203" name="Hopton, Nick" nationality="England" country_code="ENG" type="first_assistant_referee"/>
					<referee id="sr:referee:2761231" name="Taylor, Craig" nationality="England" country_code="ENG" type="second_assistant_referee"/>
					<referee id="sr:referee:1089244" name="Donohue, Matt" nationality="England" country_code="ENG" type="fourth_official"/>
					<referee id="sr:referee:229470" name="Brooks, John" nationality="England" country_code="ENG" type="video_assistant_referee"/>
				</referees>
				<attendance count="52192"/>
				<weather pitch_conditions="good" overall_conditions="medium"/>
				<ground neutral="false"/>
				<lineups confirmed="true"/>
			</sport_event_conditions>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="2" away_score="1" winner_id="sr:competitor:17">
			<period_scores>
				<period_score home_score="1" away_score="1" type="regular_period" number="1"/>
				<period_score home_score="1" away_score="0" type="regular_period" number="2"/>
			</period_scores>
			<ball_locations>
				<ball_location order="4" x="37" y="73" qualifier="home"/>
				<ball_location order="3" x="37" y="73" qualifier="away"/>
				<ball_location order="2" x="58" y="71" qualifier="away"/>
				<ball_location order="1" x="58" y="71" qualifier="home"/>
			</ball_locations>
			<match_situation status="safe" qualifier="home" updated_at="2025-04-22T20:57:07+00:00"/>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:50850621" start_time="2025-04-19T14:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
				<round number="33"/>
				<groups>
					<group id="sr:league:84075" name="Premier League 24/25"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:48" name="Everton FC" country="England" country_code="ENG" abbreviation="EVE" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:12" name="Goodison Park" capacity="39572" city_name="Liverpool" country_name="England" map_coordinates="53.439255,-2.967065" country_code="ENG" timezone="Europe/London"/>
			<channels>
				<channel name="Sky Sport Uno HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://guidatv.sky.it/sport-e-calcio?vista=griglia" country="Italy" country_code="ITA"/>
				<channel name="SKY Sport 253 HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://guidatv.sky.it/sport-e-calcio?vista=griglia" country="Italy" country_code="ITA"/>
				<channel name="Bein Sports HD 3 TR - Türksat 1C / Eurasiasat 1 (42.0E)" url="http://tr.beinsports.com/yayin-akisi/beinsports-3" country="Turkey" country_code="TUR"/>
				<channel name="Digi Sport 2 RO - Thor 2/3 (1.0W)" url="http://www.digisport.ro/Program/" country="Romania" country_code="ROU"/>
				<channel name="V Sport Premium HD - Thor 2/3 (1.0W)" url="https://www.allente.se/tv-guide/" country="Sweden" country_code="SWE"/>
				<channel name="Universo" country="United States" country_code="USA"/>
				<channel name="USA Network" url="https://www.usanetwork.com/" country="United States" country_code="USA"/>
				<channel name="Fubo TV" url="https://www.livesoccertv.com/channels/fubo-tv/" country="United States" country_code="USA"/>
				<channel name="Sky Sport Premier League HD - Astra 1C-1H / 2C (19.2E)" url="https://info.sky.de/inhalt/de/programm_info_live_events_start.jsp" country="Germany" country_code="DEU"/>
				<channel name="Novasports PL HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://www.gazzetta.gr/tv-program" country="Greece" country_code="GRC"/>
				<channel name="Canal+ Live 9 HD FR - Astra 1C-1H / 2C (19.2E)" url="https://www.footao.tv/" country="France" country_code="FRA"/>
			</channels>
			<sport_event_conditions>
				<referees>
					<referee id="sr:referee:79902" name="Hooper, Simon" nationality="England" country_code="ENG" type="main_referee"/>
					<referee id="sr:referee:84321" name="Holmes, Adrian" nationality="England" country_code="ENG" type="first_assistant_referee"/>
					<referee id="sr:referee:88710" name="Long, Simon" nationality="England" country_code="ENG" type="second_assistant_referee"/>
					<referee id="sr:referee:79032" name="Madley, Robert" nationality="England" country_code="ENG" type="fourth_official"/>
					<referee id="sr:referee:74774" name="England, Darren" nationality="England" country_code="ENG" type="video_assistant_referee"/>
				</referees>
				<attendance count="39332"/>
				<weather pitch_conditions="good" overall_conditions="good"/>
				<ground neutral="false"/>
				<lineups confirmed="true"/>
			</sport_event_conditions>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="0" away_score="2" winner_id="sr:competitor:17">
			<period_scores>
				<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="2" type="regular_period" number="2"/>
			</period_scores>
			<ball_locations>
				<ball_location order="4" x="84" y="100" qualifier="away"/>
				<ball_location order="3" x="88" y="56" qualifier="away"/>
				<ball_location order="2" x="88" y="56" qualifier="home"/>
				<ball_location order="1" x="92" y="36" qualifier="home"/>
			</ball_locations>
			<match_situation status="safe" qualifier="away" updated_at="2025-04-19T15:51:50+00:00"/>
		</sport_event_status>
	</schedule>
	<schedule>
		<sport_event id="sr:sport_event:50850549" start_time="2025-03-15T15:00:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:1" name="England" country_code="ENG"/>
				<competition id="sr:competition:17" name="Premier League" gender="men"/>
				<season id="sr:season:118689" name="Premier League 24/25" start_date="2024-08-16" end_date="2025-05-25" year="24/25" competition_id="sr:competition:17"/>
				<stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
				<round number="29"/>
				<groups>
					<group id="sr:league:84075" name="Premier League 24/25"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:30" name="Brighton &amp; Hove Albion" country="England" country_code="ENG" abbreviation="BRI" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:606" name="Etihad Stadium" capacity="55097" city_name="Manchester" country_name="England" map_coordinates="53.484592,-2.202695" country_code="ENG" timezone="Europe/London"/>
			<channels>
				<channel name="Sky Sport Calcio HD - Hot Bird 1/2/3/4/6 (13.0E)" url="https://www.goal.com/it/notizie/guida-tv-dove-vedere-tutto-il-calcio-in-diretta-e-streaming/1674frahvw8qt1nojf0cwjwlzr" country="Italy" country_code="ITA"/>
				<channel name="Bein Sports HD 3 TR - Türksat 1C / Eurasiasat 1 (42.0E)" url="http://tr.beinsports.com/yayin-akisi/beinsports-3" country="Turkey" country_code="TUR"/>
				<channel name="Digi Sport 2 RO - Thor 2/3 (1.0W)" url="http://www.digisport.ro/Program/" country="Romania" country_code="ROU"/>
				<channel name="Sky Austria 1 HD - Astra 1C-1H / 2C (19.2E)" url="https://info.sky.de/inhalt/de/programm_info_live_events_start.jsp" country="Austria" country_code="AUT"/>
				<channel name="V Sport Premium HD - Thor 2/3 (1.0W)" url="https://www.allente.se/tv-guide/" country="Sweden" country_code="SWE"/>
				<channel name="Peacock Premium" country="United States" country_code="USA"/>
				<channel name="Sky Sport Premier League HD - Astra 1C-1H / 2C (19.2E)" url="https://info.sky.de/inhalt/de/programm_info_live_events_start.jsp" country="Germany" country_code="DEU"/>
				<channel name="CANAL+ Foot FR - Astra 1C-1H / 2C (19.2E)" url="https://www.canalplus.com/programme-tv/" country="France" country_code="FRA"/>
				<channel name="MATCH4 - Thor 2/3 (1.0W)" url="https://focimagazin.hu/content/tv-m%c5%b1sor-%c3%a9l%c5%91-foci-tv-ben" country="Hungary" country_code="HUN"/>
			</channels>
			<sport_event_conditions>
				<referees>
					<referee id="sr:referee:79902" name="Hooper, Simon" nationality="England" country_code="ENG" type="main_referee"/>
					<referee id="sr:referee:84321" name="Holmes, Adrian" nationality="England" country_code="ENG" type="first_assistant_referee"/>
					<referee id="sr:referee:88710" name="Long, Simon" nationality="England" country_code="ENG" type="second_assistant_referee"/>
					<referee id="sr:referee:69853" name="Taylor, Anthony" nationality="England" country_code="ENG" type="fourth_official"/>
					<referee id="sr:referee:1973235" name="Bell, James" nationality="England" country_code="ENG" type="video_assistant_referee"/>
				</referees>
				<attendance count="52471"/>
				<weather pitch_conditions="good" overall_conditions="good"/>
				<ground neutral="false"/>
				<lineups confirmed="true"/>
			</sport_event_conditions>
		</sport_event>
		<sport_event_status status="closed" match_status="ended" home_score="2" away_score="2" match_tie="true">
			<period_scores>
				<period_score home_score="2" away_score="1" type="regular_period" number="1"/>
				<period_score home_score="0" away_score="1" type="regular_period" number="2"/>
			</period_scores>
			<ball_locations>
				<ball_location order="4" x="50" y="47" qualifier="away"/>
				<ball_location order="3" x="59" y="46" qualifier="away"/>
				<ball_location order="2" x="59" y="38" qualifier="away"/>
				<ball_location order="1" x="59" y="59" qualifier="away"/>
			</ball_locations>
			<match_situation status="safe" qualifier="away" updated_at="2025-03-15T16:53:49+00:00"/>
		</sport_event_status>
	</schedule>
</player_schedules>

```
```json Player Schedules Snippet (JSON)
{
"schedules": [
    {
      "sport_event": {
        "id": "sr:sport_event:50850645",
        "start_time": "2025-04-22T19:00:00+00:00",
        "start_time_confirmed": true,
        "sport_event_context": {
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
          },
          "season": {
            "id": "sr:season:118689",
            "name": "Premier League 24/25",
            "start_date": "2024-08-16",
            "end_date": "2025-05-25",
            "year": "24/25",
            "competition_id": "sr:competition:17"
          },
          "stage": {
            "order": 1,
            "type": "league",
            "phase": "regular season",
            "start_date": "2024-08-16",
            "end_date": "2025-05-25",
            "year": "24/25"
          },
          "round": {
            "number": 34
          },
          "groups": [
            {
              "id": "sr:league:84075",
              "name": "Premier League 24/25"
            }
          ]
        },
        "coverage": {
          "type": "sport_event",
          "sport_event_properties": {
            "lineups": true,
            "formations": false,
            "venue": true,
            "extended_play_by_play": true,
            "extended_player_stats": true,
            "extended_team_stats": true,
            "lineups_availability": "pre",
            "ballspotting": true,
            "commentary": true,
            "fun_facts": true,
            "goal_scorers": true,
            "goal_scorers_live": true,
            "scores": "live",
            "game_clock": true,
            "deeper_play_by_play": true,
            "deeper_player_stats": true,
            "deeper_team_stats": true,
            "basic_play_by_play": true,
            "basic_player_stats": true,
            "basic_team_stats": true
          }
        },
        "competitors": [
          {
            "id": "sr:competitor:17",
            "name": "Manchester City",
            "country": "England",
            "country_code": "ENG",
            "abbreviation": "MCI",
            "qualifier": "home",
            "gender": "male"
          },
          {
            "id": "sr:competitor:40",
            "name": "Aston Villa",
            "country": "England",
            "country_code": "ENG",
            "abbreviation": "AVL",
            "qualifier": "away",
            "gender": "male"
          }
        ],
        "venue": {
          "id": "sr:venue:606",
          "name": "Etihad Stadium",
          "capacity": 55097,
          "city_name": "Manchester",
          "country_name": "England",
          "map_coordinates": "53.484592,-2.20
... (example cut here; 24 KB in the source page)
```

This response showcases Carson Scott’s most recently played matches across all competitions. Each `sport_event id` entry includes rich metadata about the match, such as the competition (e.g., Premier League), season, venue, broadcasting channels, and competitors. You can use this data to render a player’s recent match history—useful for powering stat summaries, match recaps, or player performance tracking across rounds.

</details>
