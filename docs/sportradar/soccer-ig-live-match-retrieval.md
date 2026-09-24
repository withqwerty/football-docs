---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.193Z
---
# Live Match Updates

> ⚠️ Live Coverage Requirement
>
> The workflows described in this documentation apply only to matches with **live coverage**. Matches in lower tiers, such as **Tier 9**, do not receive live updates and are therefore excluded from these workflows. Always check the coverage level before applying event-based logic.
>
> See **[Data Coverage and Tiers](http://developer.sportradar.com/soccer/docs/soccer-ig-data-coverage-tiers)** for more information on coverage levels.

## Accessing Available Seasons (Prerequisite)

Understanding which seasons are available—and what [level of data coverage is provided](https://developer.sportradar.com/soccer/docs/soccer-ig-data-availability-coverage)—is essential for making reliable and accurate API calls.

* Use the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed to view all available seasons for each competition in the API.
* Reference the [Coverage Matrix](https://coverage-matrix.sportradar.com/) to determine the depth of coverage by competition tier (Tier 1–9).
* Use the [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) feed to confirm what data is available for a given season of the target competition (e.g., player transfers, team squads, stats levels).

Validating coverage and season availability early can help prevent errors and streamline your data integration process.

<br />

***

## Access Match Fixtures (Getting Started)

Access the matches you want to track:

1. Find the `sport_event_id` by querying one of the following Schedule feeds:

   * [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules)
   * [Competitor vs. Competitor](https://developer.sportradar.com/soccer/reference/soccer-competitor-vs-competitor)
   * [Daily Schedules](https://developer.sportradar.com/soccer/reference/soccer-daily-schedules)
   * [Live Schedules](https://developer.sportradar.com/soccer/reference/soccer-live-schedules) - You can use the Live Schedules endpoint to check coverage levels for all live matches, helping you understand what data is available before making additional calls.
   * [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule) For more information on accessing fixture data, see the [Fixtures (Schedules) ](https://developer.sportradar.com/soccer/docs/soccer-ig-fixtures) integration scenario.

2. Use the `sport_event_id` to access live data from any of the following push and RESTful feeds when the game is about to start or live. The table below shows which feeds correspond to each data type:

   <Table align={["left","left","left","left"]}>
     <thead>
       <tr>
         <th style={{ textAlign: "left" }}>
           Data Type
         </th>

         <th style={{ textAlign: "left" }}>
           Sport Event Feeds (RESTful)
         </th>

         <th style={{ textAlign: "left" }}>
           Live Feeds (RESTful)
         </th>

         <th style={{ textAlign: "left" }}>
           Push Feeds
         </th>
       </tr>
     </thead>

     <tbody>
       <tr>
         <td style={{ textAlign: "left" }}>
           Timeline (Play-by-Play) Data and Substitutions
         </td>

         <td style={{ textAlign: "left" }}>
           [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline)
         </td>

         <td style={{ textAlign: "left" }}>
           * [Live Timelines](https://developer.sportradar.com/soccer/reference/soccer-live-timelines)<br />- [Live Timelines Delta](https://developer.sportradar.com/soccer/reference/soccer-live-timelines-delta)

           <br />
         </td>

         <td style={{ textAlign: "left" }}>
           [Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events)
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           Game Statistics
         </td>

         <td style={{ textAlign: "left" }}>
           [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary)
         </td>

         <td style={{ textAlign: "left" }}>
           [Live Summaries](https://developer.sportradar.com/soccer/reference/soccer-live-summaries)
         </td>

         <td style={{ textAlign: "left" }}>
           [Push Statistics](https://developer.sportradar.com/soccer/reference/soccer-push-statistics)
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           Match Lineups and Formations
         </td>

         <td style={{ textAlign: "left" }}>
           [Sport Event Lineups](https://developer.sportradar.com/soccer/reference/soccer-sport-event-lineups)
         </td>

         <td style={{ textAlign: "left" }}>
           N/A
         </td>

         <td style={{ textAlign: "left" }}>
           N/A
         </td>
       </tr>
     </tbody>
   </Table>

   **Note:** All feeds including scoring updates.

   
     ### Check Update Frequencies for REST Endpoints

     The [**Update Frequencies**](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies) page outlines how often data is refreshed and provides recommended call intervals for each REST endpoint. Use it to optimize your polling strategy before, during, and after matches while avoiding unnecessary requests.
   

   > 👍 Understand Every Data Point
   >
   > To view all possible data fields returned by an endpoint, including definitions, refer to the Data Points table for that specific endpoint. For example, see the data points for the **[Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline)** endpoint. These tables are especially helpful for understanding the full range of values you may encounter and for planning your integration accordingly.
   >
   > For a complete view of all data fields available across the API, visit the Statistics Summary page for your chosen API. See statistics summaries for:
   >
   > * **[Soccer](https://developer.sportradar.com/soccer/reference/soccer-statistics-summary)**
   > * **[Soccer Extended](https://developer.sportradar.com/soccer/reference/soccer-extended-statistics-summary)**

<br />

***

## Live Data Types

<br />

### Timeline (Play-by-Play) Data

Play-by-Play data provides a detailed, sequential account of every action that occurs during a game, including all plays, events, and substitutions. This data type is beneficial for analyzing game flow, player performance, and tactical decisions in real-time.

You can use the following feeds to access play-by-play data:

* [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline)
* [Live Timelines](https://developer.sportradar.com/soccer/reference/soccer-live-timelines)
* [Live Timelines Delta](https://developer.sportradar.com/soccer/reference/soccer-live-timelines-delta)
* [Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events)

<details>
  <summary>Sport Event Timeline - Response Snippets</summary>

```xml Sport Event Timeline (XML)
<timeline>
		<event id="2091765092" type="match_started" time="2025-07-12T23:55:09+00:00"/>
		<event id="2091765090" type="period_start" time="2025-07-12T23:55:09+00:00" period="1" period_type="regular_period" period_name="regular_period"/>
		<event id="2091765286" type="throw_in" time="2025-07-12T23:55:25+00:00" match_time="1" match_clock="0:16" competitor="away" x="45" y="100" period="1" period_type="regular_period">
			<commentaries>
				<commentary text="Filip Dujic signals a Nashville throw-in in Miami's half."/>
			</commentaries>
		</event>
		<event id="2091766364" type="free_kick" time="2025-07-12T23:57:35+00:00" match_time="3" match_clock="2:23" competitor="home" x="34" y="79" period="1" period_type="regular_period">
			<players>
				<player id="sr:player:2134036" name="Yazbek, Patrick"/>
			</players>
			<commentaries>
				<commentary text="Filip Dujic signals a free kick to Miami in their own half."/>
			</commentaries>
		</event>
		<event id="2091766706" type="throw_in" time="2025-07-12T23:58:22+00:00" match_time="4" match_clock="3:10" competitor="home" x="61" y="100" period="1" period_type="regular_period">
			<commentaries>
				<commentary text="Can Miami get the ball into an attacking position from this throw-in in Nashville's half?"/>
			</commentaries>
		</event>
		<event id="2091766782" type="throw_in" time="2025-07-12T23:58:34+00:00" match_time="4" match_clock="3:22" competitor="away" x="58" y="0" period="1" period_type="regular_period">
			<commentaries>
				<commentary text="Throw-in for Nashville in their own half."/>
			</commentaries>
		</event>
		<event id="2091767006" type="free_kick" time="2025-07-12T23:59:04+00:00" match_time="4" match_clock="3:52" competitor="away" x="56" y="78" period="1" period_type="regular_period">
			<players>
				<player id="sr:player:1630482" name="Weigandt, Marcelo"/>
			</players>
			<commentaries>
				<commentary text="Nashville awarded a free kick in their own half."/>
			</commentaries>
		</event>
		<event id="2091767338" type="goal_kick" time="2025-07-12T23:59:49+00:00" match_time="5" match_clock="4:37" competitor="home" x="5" y="50" period="1" period_type="regular_period">
			<commentaries>
				<commentary text="Miami have a goal kick."/>
			</commentaries>
		</event>
	</timeline>
```
```json Sport Event Timeline (JSON)
{
"timeline": [
    {
      "id": 2091765092,
      "type": "match_started",
      "time": "2025-07-12T23:55:09+00:00"
    },
    {
      "id": 2091765090,
      "type": "period_start",
      "time": "2025-07-12T23:55:09+00:00",
      "period": 1,
      "period_type": "regular_period",
      "period_name": "regular_period"
    },
    {
      "id": 2091765286,
      "type": "throw_in",
      "time": "2025-07-12T23:55:25+00:00",
      "match_time": 1,
      "match_clock": "0:16",
      "competitor": "away",
      "x": 45,
      "y": 100,
      "period": 1,
      "period_type": "regular_period",
      "commentaries": [
        {
          "text": "Filip Dujic signals a Nashville throw-in in Miami's half."
        }
      ]
    },
    {
      "id": 2091766364,
      "type": "free_kick",
      "time": "2025-07-12T23:57:35+00:00",
      "match_time": 3,
      "match_clock": "2:23",
      "competitor": "home",
      "players": [
        {
          "id": "sr:player:2134036",
          "name": "Yazbek, Patrick"
        }
      ],
      "x": 34,
      "y": 79,
      "period": 1,
      "period_type": "regular_period",
      "commentaries": [
        {
          "text": "Filip Dujic signals a free kick to Miami in their own half."
        }
      ]
    },
    {
      "id": 2091766706,
      "type": "throw_in",
      "time": "2025-07-12T23:58:22+00:00",
      "match_time": 4,
      "match_clock": "3:10",
      "competitor": "home",
      "x": 61,
      "y": 100,
      "period": 1,
      "period_type": "regular_period",
      "commentaries": [
        {
          "text": "Can Miami get the ball into an attacking position from this throw-in in Nashville's half?"
        }
      ]
    },
    {
      "id": 2091766782,
      "type": "throw_in",
      "time": "2025-07-12T23:58:34+00:00",
      "match_time": 4,
      "match_clock": "3:22",
      "competitor": "away",
      "x": 58,
      "y": 0,
      "period": 1,
      "period_type": "regular_period",
      "commentaries": [
        {
          "text": "Throw-in for Nashville in their own half."
        }
      ]
    },
    {
      "id": 2091767006,
      "type": "free_kick",
      "time": "2025-07-12T23:59:04+00:00",
      "match_time": 4,
      "match_clock": "3:52",
      "competitor": "away",
      "players": [
        {
          "id": "sr:player:1630482",
          "name": "Weigandt, Marcelo"
        }
      ],
      "x": 56,
      "y": 78,
      "period": 1,
      "period_type": "regular_period",
      "commentaries": [
        {
          "text": "Nashville awarded a free kick in their own half."
        }
      ]
    },
    {
      "id": 2091767338,
      "type": "goal_kick",
      "time": "2025-07-12T23:59:49+00:00",
      "match_time": 5,
      "match_clock": "4:37",
      "competitor": "home",
      "x": 5,
      "y": 50,
      "period": 1,
      "period_type": "regular_period",
      "commentaries": [
        {
          "text": "Miami have a goal kick."
... (example cut here; 3 KB in the source page)
```

This Sport Event Timeline entry shows a free kick awarded to Miami, taken by Patrick Yazbek. It includes key details like match time (2:23), player name, field position (x: 34, y: 79), and a short commentary—“Filip Dujic signals a free kick to Miami in their own half.” These timeline updates help track the flow of the match in real time.

</details>

You could visualize timeline data by charting a sequence of play-by-play events such as throw-ins, free kicks, and goal kicks. This allows you to illustrate tempo, possession trends, and territorial shifts as they unfold in real time.

![](https://files.readme.io/6e551ad5fd75747cbe9bb48b9df63c3c383cc7f2dd6728c7cb26d0801530fcb4-image.png)

<br />

#### Fun Facts, Insights, and Momentum

Enrich your timeline with contextual pre-match and live insights and momentum swings. Perfect for event timelines, tickers, or broadcast graphics.

🧠 **Fun Facts:**

The fun facts in the above illustration are powered by the Sport Event Fun Facts endpoint.

Examples:

* Nashville haven't won any of their last 3 games against Miami
* When playing at home, Miami have not lost to Nashville in their last 4 encounters

💡 **Insights:**

Use the Insights endpoint (*Soccer Extended only*) for AI-generated pre-match and live insights.

Examples:

* In their last 5 matches, Liverpool FC have received an average of 1.6 cards per match, while AFC Bournemouth have averaged 3 cards.
* The match is still tied after the first half. In their last 9 home matches in the J.League when that happened, Sanfrecce Hiroshima have won 5 times.

⚡ **Momentum:**

Leverage the Momentum endpoint (*Soccer Extended only*) to make a graphical timeline of events in a given match.

In this endpoint, each timeline event includes a momentum value (-50 to 50) indicating an advantage for the home or away team.

<br />

  ### Enhance Visuals with the Images API

  Use the Images API to integrate team logos, player headshots, and action images into your match experience.

<br />

### Substitutions

You can also use the use the same endpoints that provide live timeline data to track substitutions during a match:

* [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline)
* [Live Timelines](https://developer.sportradar.com/soccer/reference/soccer-live-timelines)
* [Live Timelines Delta](https://developer.sportradar.com/soccer/reference/soccer-live-timelines-delta)
* [Push Events](https://developer.sportradar.com/soccer/reference/soccer-push-events)

The datapoint `type="substitution"` identifies a player substitution event. Inside the `players` node, players are listed with their `type` attributes set to either `substituted_in` or `substituted_out`, indicating who entered and exited the match.

```xml Substitution Event Sample (XML)
  <event id="2092556686" type="substitution" time="2025-07-13T20:55:23+00:00" match_time="77" match_clock="76:53" competitor="home" period="2" period_type="regular_period">
            <players>
                <player id="sr:player:1140070" name="James, Reece" type="substituted_out"/>
                <player id="sr:player:1055173" name="Dewsbury-Hall, Kiernan" type="substituted_in"/>
            </players>
            <commentaries>
                <commentary text="Enzo Maresca (Chelsea) is making a fourth change, with Kiernan Dewsbury-Hall replacing the possibly injured Reece James."/>
            </commentaries>
        </event>
```

You can use substitution events from the Sport Event Timeline feed to visually indicate changes on the pitch (field) and in the bench list. In this example, player **#29 Julian Gaines** is highlighted to reflect his substitution for **#37 Ahmed Qasem**, clearly linking the active player on the field with the replaced player from the starting lineup.

![](https://files.readme.io/31e7f062a3a826b6c92717017f3955b38133ab0565313c9083c35acc3bd4335c-image.png)

<br />

### Match Statistics

Match statistics include quantifiable data points from a soccer match, such as goals, assists, tackles, passes completed, and team performance comparisons.

You can use the following feeds to access match statistics:

* [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary)
* [Live Summaries](https://developer.sportradar.com/soccer/reference/soccer-live-summaries)
* [Push Statistics](https://developer.sportradar.com/soccer/reference/soccer-push-statistics)

<details>
  <summary>Sport Event Summary - Response Example</summary>

```xml Sport Event Timeline (XML)
<?xml version="1.0" encoding="UTF-8"?>
<sport_event_summary
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-17T12:16:57+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/sport_event_summary.xsd">
	<sport_event id="sr:sport_event:56690877" start_time="2025-07-12T23:45:00+00:00" start_time_confirmed="true">
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
			<competitor id="sr:competitor:668063" name="Nashville SC" country="USA" country_code="USA" abbreviation="NSH" qualifier="away" gender="male"/>
		</competitors>
		<venue id="sr:venue:51991" name="Chase Stadium" capacity="21550" city_name="Fort Lauderdale, FL" country_name="USA" map_coordinates="26.193056, -80.161111" country_code="USA" timezone="America/New_York"/>
		<channels>
			<channel name="Fox Sports 1" url="https://www.foxsports.com/presspass/latest-news/weekly-schedule" country="United States" country_code="USA"/>
			<channel name="Fox Deportes" url="https://www.foxsports.com/presspass/latest-news/weekly-schedule/" country="United States" country_code="USA"/>
			<channel name="Fubo TV" url="https://www.livesoccertv.com/channels/fubo-tv/" country="United States" country_code="USA"/>
			<channel name="Apple TV" country="United States" country_code="USA"/>
		</channels>
		<sport_event_conditions>
			<referees>
				<referee id="sr:referee:2311821" name="Dujic, Filip" nationality="USA" country_code="USA" type="main_referee"/>
				<referee id="sr:referee:1006797" name="White, Jason" nationality="USA" country_code="USA" type="first_assistant_referee"/>
				<referee id="sr:referee:2169170" name="Nickerson, Michael" nationality="USA" country_code="USA" type="second_assistant_referee"/>
				<referee id="sr:referee:1740253" name="Lauziere, Pierre-Luc" nationality="USA" country_code="USA" type="fourth_official"/>
				<referee id="sr:referee:1011991" name="Marrakchi, Younes" nationality="USA" country_code="USA" type="video_assistant_referee"/>
			</referees>
			<attendance count="23108"/>
			<weather pitch_conditions="good" overall_conditions="good"/>
			<ground neutral="false"/>
			<lineups confirmed="true"/>
		</sport_event_conditions>
	</sport_event>
	<sport_event_status status="closed" match_status="ended" home_score="2" away_score="1" winner_id="sr:competitor:659691">
		<period_scores>
			<period_score home_score="1" away_score="0" type="regular_period" number="1"/>
			<period_score home_score="1" away_score="1" type="regular_period" number="2"/>
		</period_scores>
		<ball_locations>
			<ball_location order="4" x="39" y="48" qualifier="home"/>
			<ball_location order="3" x="56" y="84" qualifier="home"/>
			<ball_location order="2" x="45" y="84" qualifier="home"/>
			<ball_location order="1" x="43" y="69" qualifier="home"/>
		</ball_locations>
		<match_situation status="safe" qualifier="home" updated_at="2025-07-13T01:50:45+00:00"/>
	</sport_event_status>
	<statistics>
		<totals>
			<competitors>
				<competitor id="sr:competitor:659691" name="Inter Miami CF" abbreviation="MIA" qualifier="home">
					<statistics ball_possession="53" cards_given="2" corner_kicks="0" fouls="11" free_kicks="17" goal_kicks="6" injuries="0" offsides="2" red_cards="0" shots_blocked="1" shots_off_target="3" shots_on_target="4" shots_saved="2" shots_total="8" substitutions="4" throw_ins="10" yellow_cards="2" yellow_red_cards="0"/>
					<players>
						<player id="sr:player:12994" name="Messi, Lionel" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="2" offsides="0" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="0" shots_on_target="2" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:15525" name="Ustari, Oscar" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:16943" name="Suarez, Luis" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="1" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="2" shots_on_target="1" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:35199" name="Alba, Jordi" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:39433" name="Busquets, Sergio" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:246097" name="Yarbrough, William" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:608742" name="Picault, Fafa" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:871084" name="Falcon, Maximiliano" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:918922" name="Martinez, David" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:1630482" name="Weigandt, Marcelo" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="1" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2133062" name="Segovia, Telasco" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="1" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2148390" name="Redondo, Federico" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2285547" name="Sailor, Ryan" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2291935" name="Allende, Tadeo" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2343043" name="Rodriguez, Baltasar" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2343061" name="Rios Novo, Rocco" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2551443" name="Cremaschi, Benjamin" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="1" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2552313" name="Aviles, Tomas" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2686219" name="Morales, Santiago" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2750869" name="Afonso, Leo" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
					</players>
				</competitor>
				<competitor id="sr:competitor:668063" name="Nashville SC" abbreviation="NSH" qualifier="away">
					<statistics ball_possession="47" cards_given="2" corner_kicks="4" fouls="13" free_kicks="13" goal_kicks="4" injuries="0" offsides="4" red_cards="0" shots_blocked="3" shots_off_target="2" shots_on_target="3" shots_saved="2" shots_total="8" substitutions="5" throw_ins="11" yellow_cards="2" yellow_red_cards="0"/>
					<players>
						<player id="sr:player:111293" name="Bunbury, Teal" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:118178" name="Najar, Andy" starter="true">
							<statistics assists="1" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:147269" name="Brugman, Gaston" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:150047" name="Willis, Joe" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:221350" name="Mukhtar, Hany" starter="true">
							<statistics assists="0" corner_kicks="4" goals_by_head="1" goals_scored="1" offsides="0" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="0" shots_on_target="2" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:314128" name="Zimmerman, Walker" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="1" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:558698" name="Lovitz, Daniel" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:590832" name="Acosta, Bryan" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:940680" name="Surridge, Sam" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="2" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:951366" name="Muyl, Alex" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:1114897" name="Palacios Murillo, Jeisson Andres" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:1129495" name="Maher, Jack" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:1132195" name="Tagseth, Edvard" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:1708595" name="Shaffelburg, Jacob" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="1" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:1796354" name="Qasem, Ahmed" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2054309" name="Schwake, Brian" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2127564" name="Bauer, Josh" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2134036" name="Yazbek, Patrick" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="1" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2205696" name="Gaines, Julian" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:2717258" name="Corcoran, Matthew" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
					</players>
				</competitor>
			</competitors>
		</totals>
	</statistics>
</sport_event_summary>

```
```json Sport Event Timeline (JSON)
{
  "generated_at": "2025-07-17T11:59:10+00:00",
  "sport_event": {
    "id": "sr:sport_event:56690877",
    "start_time": "2025-07-12T23:45:00+00:00",
    "start_time_confirmed": true,
    "sport_event_context": {
      "sport": {
        "id": "sr:sport:1",
        "name": "Soccer"
      },
      "category": {
        "id": "sr:category:26",
        "name": "USA",
        "country_code": "USA"
      },
      "competition": {
        "id": "sr:competition:242",
        "name": "MLS",
        "gender": "men"
      },
      "season": {
        "id": "sr:season:127179",
        "name": "MLS 2025",
        "start_date": "2025-02-22",
        "end_date": "2025-12-08",
        "year": "2025",
        "competition_id": "sr:competition:242"
      },
      "stage": {
        "order": 1,
        "type": "league",
        "phase": "regular season",
        "start_date": "2025-02-22",
        "end_date": "2025-10-20",
        "year": "2025"
      },
      "round": {},
      "groups": [
        {
          "id": "sr:league:89897",
          "name": "MLS 2025"
        },
        {
          "id": "sr:league:89899",
          "name": "MLS 2025, Eastern Conference",
          "group_name": "Eastern Conference"
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
        "id": "sr:competitor:659691",
        "name": "Inter Miami CF",
        "country": "USA",
        "country_code": "USA",
        "abbreviation": "MIA",
        "qualifier": "home",
        "gender": "male"
      },
      {
        "id": "sr:competitor:668063",
        "name": "Nashville SC",
        "country": "USA",
        "country_code": "USA",
        "abbreviation": "NSH",
        "qualifier": "away",
        "gender": "male"
      }
    ],
    "venue": {
      "id": "sr:venue:51991",
      "name": "Chase Stadium",
      "capacity": 21550,
      "city_name": "Fort Lauderdale, FL",
      "country_name": "USA",
      "map_coordinates": "26.193056, -80.161111",
      "country_code": "USA",
      "timezone": "America/New_York"
    },
    "channels": [
      {
        "name": "Fox Sports 1",
        "url": "https://www.foxsports.com/presspass/latest-news/weekly-schedule",
        "country": "United States",
        "country_
... (example cut here; 32 KB in the source page)
```

This Sport Event Summary feed delivers a full statistical profile of the match, including team totals and individual player stats. You can surface metrics like ball possession (Inter Miami 53%, Nashville 47%), shots on and off target, fouls, cards, and substitutions. Player-level stats include goals, assists, shot accuracy, and discipline—such as Messi’s 2 goals on 2 shots on target.

</details>

You can visually represent key soccer statistics in your applications using a layout like the following graphic, highlighting data such as ball possession, conversion rates, cards, fouls, and shot accuracy.

![](https://files.readme.io/6931684f514ace4bc8daad72b382a2962909c6832ca8e54822ac337544a4293d-image.png)

<br />

### Match Lineups and Formations

Match lineup data captures all team formations and player participation, including starting lineups, and bench assignments. This data is valuable for tracking player availability, tactical adjustments, and team strategy throughout the match.

You can use the the [Sport Event Lineups](https://developer.sportradar.com/soccer/reference/soccer-sport-event-lineups) feed to track lineup and formation data throughout a match.

<TutorialTile backgroundColor="#f4b401" emoji="⚽" id="6878f1ffc97b9f76647c57f2" link="https://developer.sportradar.com/v4/recipes/accessing-lineup-changes" slug="accessing-lineup-changes" title="TAccessing Lineup Changes" />

<details>
<summary>Sport Event Lineups Response Example</summary>

```xml XML
<?xml version="1.0" encoding="UTF-8"?>
<sport_event_lineups
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-17T12:55:28+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/sport_event_lineups.xsd">
	<sport_event id="sr:sport_event:56690877" start_time="2025-07-12T23:45:00+00:00" start_time_confirmed="true">
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
			<competitor id="sr:competitor:668063" name="Nashville SC" country="USA" country_code="USA" abbreviation="NSH" qualifier="away" gender="male"/>
		</competitors>
		<venue id="sr:venue:51991" name="Chase Stadium" capacity="21550" city_name="Fort Lauderdale, FL" country_name="USA" map_coordinates="26.193056, -80.161111" country_code="USA" timezone="America/New_York"/>
		<channels>
			<channel name="Fox Sports 1" url="https://www.foxsports.com/presspass/latest-news/weekly-schedule" country="United States" country_code="USA"/>
			<channel name="Fox Deportes" url="https://www.foxsports.com/presspass/latest-news/weekly-schedule/" country="United States" country_code="USA"/>
			<channel name="Fubo TV" url="https://www.livesoccertv.com/channels/fubo-tv/" country="United States" country_code="USA"/>
			<channel name="Apple TV" country="United States" country_code="USA"/>
		</channels>
		<sport_event_conditions>
			<referees>
				<referee id="sr:referee:2311821" name="Dujic, Filip" nationality="USA" country_code="USA" type="main_referee"/>
				<referee id="sr:referee:1006797" name="White, Jason" nationality="USA" country_code="USA" type="first_assistant_referee"/>
				<referee id="sr:referee:2169170" name="Nickerson, Michael" nationality="USA" country_code="USA" type="second_assistant_referee"/>
				<referee id="sr:referee:1740253" name="Lauziere, Pierre-Luc" nationality="USA" country_code="USA" type="fourth_official"/>
				<referee id="sr:referee:1011991" name="Marrakchi, Younes" nationality="USA" country_code="USA" type="video_assistant_referee"/>
			</referees>
			<attendance count="23108"/>
			<weather pitch_conditions="good" overall_conditions="good"/>
			<ground neutral="false"/>
			<lineups confirmed="true"/>
		</sport_event_conditions>
	</sport_event>
	<sport_event_status status="closed" match_status="ended" home_score="2" away_score="1" winner_id="sr:competitor:659691">
		<period_scores>
			<period_score home_score="1" away_score="0" type="regular_period" number="1"/>
			<period_score home_score="1" away_score="1" type="regular_period" number="2"/>
		</period_scores>
		<ball_locations>
			<ball_location order="4" x="39" y="48" qualifier="home"/>
			<ball_location order="3" x="56" y="84" qualifier="home"/>
			<ball_location order="2" x="45" y="84" qualifier="home"/>
			<ball_location order="1" x="43" y="69" qualifier="home"/>
		</ball_locations>
		<match_situation status="safe" qualifier="home" updated_at="2025-07-13T01:50:45+00:00"/>
	</sport_event_status>
	<lineups>
		<competitors>
			<competitor id="sr:competitor:659691" name="Inter Miami CF" country="USA" country_code="USA" abbreviation="MIA" qualifier="home" gender="male">
				<players>
					<player id="sr:player:2343061" name="Rios Novo, Rocco" type="goalkeeper" date_of_birth="2002-06-04" nationality="Argentina" country_code="ARG" height="181" weight="76" jersey_number="34" preferred_foot="right"/>
					<player id="sr:player:246097" name="Yarbrough, William" type="goalkeeper" date_of_birth="1989-03-20" nationality="United states" country_code="USA" height="188" weight="75" jersey_number="25" preferred_foot="right"/>
					<player id="sr:player:608742" name="Picault, Fafa" type="midfielder" date_of_birth="1991-02-23" nationality="Haiti" country_code="HTI" height="173" weight="76" jersey_number="7" preferred_foot="both"/>
					<player id="sr:player:2285547" name="Sailor, Ryan" type="defender" date_of_birth="1998-11-27" nationality="United states" country_code="USA" height="193" weight="82" jersey_number="15" preferred_foot="right" played="true"/>
					<player id="sr:player:2686219" name="Morales, Santiago" type="midfielder" date_of_birth="2007-02-09" nationality="United states" country_code="USA" height="170" weight="67" jersey_number="81" preferred_foot="right"/>
					<player id="sr:player:2552313" name="Aviles, Tomas" type="forward" date_of_birth="2004-02-03" nationality="Argentina" country_code="ARG" height="186" weight="72" jersey_number="6" preferred_foot="right" played="true"/>
					<player id="sr:player:2148390" name="Redondo, Federico" type="midfielder" date_of_birth="2003-01-18" nationality="Argentina" country_code="ARG" height="188" weight="75" jersey_number="55" preferred_foot="right" played="true"/>
					<player id="sr:player:2750869" name="Afonso, Leo" type="forward" date_of_birth="2001-07-13" nationality="Brazil" country_code="BRA" height="180" weight="77" jersey_number="22" preferred_foot="right"/>
					<player id="sr:player:2343043" name="Rodriguez, Baltasar" type="midfielder" date_of_birth="2003-07-09" nationality="Argentina" country_code="ARG" height="173" weight="63" jersey_number="11" played="true"/>
					<player id="sr:player:16943" name="Suarez, Luis" type="forward" date_of_birth="1987-01-24" nationality="Uruguay" country_code="URY" height="182" weight="86" jersey_number="9" preferred_foot="right" place_of_birth="Salto" starter="true" played="true" order="11" position="striker"/>
					<player id="sr:player:12994" name="Messi, Lionel" type="forward" date_of_birth="1987-06-24" nationality="Argentina" country_code="ARG" height="170" weight="67" jersey_number="10" preferred_foot="left" place_of_birth="Rosario" starter="true" played="true" order="10" position="striker"/>
					<player id="sr:player:2133062" name="Segovia, Telasco" type="midfielder" date_of_birth="2003-04-02" nationality="Venezuela" country_code="VEN" height="180" weight="72" jersey_number="8" preferred_foot="right" starter="true" played="true" order="9" position="left_winger"/>
					<player id="sr:player:39433" name="Busquets, Sergio" type="midfielder" date_of_birth="1988-07-16" nationality="Spain" country_code="ESP" height="189" weight="76" jersey_number="5" preferred_foot="right" place_of_birth="Sabadell" starter="true" played="true" order="8" position="central_midfielder"/>
					<player id="sr:player:2551443" name="Cremaschi, Benjamin" type="midfielder" date_of_birth="2005-03-02" nationality="United states" country_code="USA" height="180" weight="75" jersey_number="30" preferred_foot="right" starter="true" played="true" order="7" position="central_midfielder"/>
					<player id="sr:player:2291935" name="Allende, Tadeo" type="forward" date_of_birth="1999-02-20" nationality="Argentina" country_code="ARG" height="185" weight="80" jersey_number="21" preferred_foot="right" starter="true" played="true" order="6" position="right_winger"/>
					<player id="sr:player:35199" name="Alba, Jordi" type="defender" date_of_birth="1989-03-21" nationality="Spain" country_code="ESP" height="170" weight="68" jersey_number="18" preferred_foot="left" place_of_birth="L Hospitalet de Llobregat" starter="true" played="true" order="5" position="left_back"/>
					<player id="sr:player:918922" name="Martinez, David" type="defender" date_of_birth="1998-01-21" nationality="Paraguay" country_code="PRY" height="185" weight="82" jersey_number="14" preferred_foot="left" starter="true" played="true" order="4" position="central_defender"/>
					<player id="sr:player:871084" name="Falcon, Maximiliano" type="defender" date_of_birth="1997-05-01" nationality="Uruguay" country_code="URY" height="177" weight="65" jersey_number="37" preferred_foot="right" starter="true" played="true" order="3" position="central_defender"/>
					<player id="sr:player:1630482" name="Weigandt, Marcelo" type="defender" date_of_birth="2000-01-11" nationality="Argentina" country_code="ARG" height="175" weight="74" jersey_number="57" preferred_foot="right" starter="true" played="true" order="2" position="right_back"/>
					<player id="sr:player:15525" name="Ustari, Oscar" type="goalkeeper" date_of_birth="1986-07-03" nationality="Argentina" country_code="ARG" height="184" weight="82" jersey_number="19" preferred_foot="right" starter="true" played="true" order="1" position="goalkeeper"/>
				</players>
				<jersey type="home" base="fe94a8" sleeve="fe94a8" number="050505" squares="false" stripes="true" stripes_color="facedb" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
				<manager id="sr:player:11378" name="Mascherano, Javier" date_of_birth="1984-06-08" nationality="Argentina" country_code="ARG" preferred_foot="right" place_of_birth="San Lorenzo"/>
				<formation type="4-4-2"/>
			</competitor>
			<competitor id="sr:competitor:668063" name="Nashville SC" country="USA" country_code="USA" abbreviation="NSH" qualifier="away" gender="male">
				<players>
					<player id="sr:player:590832" name="Acosta, Bryan" type="midfielder" date_of_birth="1993-11-24" nationality="Honduras" country_code="HND" height="175" weight="73" jersey_number="6" preferred_foot="right"/>
					<player id="sr:player:147269" name="Brugman, Gaston" type="midfielder" date_of_birth="1992-09-07" nationality="Uruguay" country_code="URY" height="175" weight="67" jersey_number="7" preferred_foot="right" place_of_birth="Rosario" played="true"/>
					<player id="sr:player:2205696" name="Gaines, Julian" type="defender" date_of_birth="2002-11-05" nationality="United states" country_code="USA" height="178" weight="73" jersey_number="29" played="true"/>
					<player id="sr:player:2127564" name="Bauer, Josh" type="defender" date_of_birth="1998-07-22" nationality="United states" country_code="USA" height="185" weight="79" jersey_number="22"/>
					<player id="sr:player:314128" name="Zimmerman, Walker" type="defender" date_of_birth="1993-05-19" nationality="United states" country_code="USA" height="190" weight="84" jersey_number="25" preferred_foot="right" played="true"/>
					<player id="sr:player:951366" name="Muyl, Alex" type="midfielder" date_of_birth="1995-09-30" nationality="United states" country_code="USA" height="180" weight="79" jersey_number="19" preferred_foot="right" played="true"/>
					<player id="sr:player:111293" name="Bunbury, Teal" type="forward" date_of_birth="1990-02-27" nationality="United states" country_code="USA" height="188" weight="79" jersey_number="12" preferred_foot="both"/>
					<player id="sr:player:2717258" name="Corcoran, Matthew" type="midfielder" date_of_birth="2006-02-17" nationality="United states" country_code="USA" height="178" jersey_number="16" played="true"/>
					<player id="sr:player:2054309" name="Schwake, Brian" type="goalkeeper" date_of_birth="2001-08-24" nationality="United states" country_code="USA" height="189" jersey_number="99" preferred_foot="right"/>
					<player id="sr:player:1708595" name="Shaffelburg, Jacob" type="forward" date_of_birth="1999-11-26" nationality="Canada" country_code="CAN" height="178" weight="68" jersey_number="14" preferred_foot="left" starter="true" played="true" order="11" position="striker"/>
					<player id="sr:player:940680" name="Surridge, Sam" type="forward" date_of_birth="1998-07-28" nationality="England" country_code="ENG" height="191" weight="85" jersey_number="9" preferred_foot="right" starter="true" played="true" order="10" position="striker"/>
					<player id="sr:player:1796354" name="Qasem, Ahmed" type="forward" date_of_birth="2003-07-12" nationality="Sweden" country_code="SWE" jersey_number="37" preferred_foot="left" starter="true" played="true" order="9" position="striker"/>
					<player id="sr:player:2134036" name="Yazbek, Patrick" type="midfielder" date_of_birth="2002-04-05" nationality="Australia" country_code="AUS" height="183" weight="78" jersey_number="8" preferred_foot="right" starter="true" played="true" order="8" position="central_midfielder"/>
					<player id="sr:player:1132195" name="Tagseth, Edvard" type="midfielder" date_of_birth="2001-01-23" nationality="Norway" country_code="NOR" height="171" jersey_number="20" preferred_foot="left" starter="true" played="true" order="7" position="central_midfielder"/>
					<player id="sr:player:221350" name="Mukhtar, Hany" type="midfielder" date_of_birth="1995-03-21" nationality="Germany" country_code="DEU" height="173" weight="71" jersey_number="10" preferred_foot="both" starter="true" played="true" order="6" position="central_midfielder"/>
					<player id="sr:player:558698" name="Lovitz, Daniel" type="defender" date_of_birth="1991-08-27" nationality="United states" country_code="USA" height="178" weight="77" jersey_number="2" preferred_foot="left" starter="true" played="true" order="5" position="left_back"/>
					<player id="sr:player:1114897" name="Palacios Murillo, Jeisson Andres" type="defender" date_of_birth="1994-03-20" nationality="Colombia" country_code="COL" height="186" weight="82" jersey_number="4" preferred_foot="right" starter="true" played="true" order="4" position="central_defender"/>
					<player id="sr:player:1129495" name="Maher, Jack" type="defender" date_of_birth="1999-10-28" nationality="United states" country_code="USA" height="190" weight="79" jersey_number="5" starter="true" played="true" order="3" position="central_defender"/>
					<player id="sr:player:118178" name="Najar, Andy" type="defender" date_of_birth="1993-03-16" nationality="Honduras" country_code="HND" height="171" weight="69" jersey_number="31" preferred_foot="right" starter="true" played="true" order="2" position="right_back"/>
					<player id="sr:player:150047" name="Willis, Joe" type="goalkeeper" date_of_birth="1988-08-10" nationality="United states" country_code="USA" height="193" weight="86" jersey_number="1" preferred_foot="left" starter="true" played="true" order="1" position="goalkeeper"/>
				</players>
				<jersey type="home" base="fffc3d" sleeve="112756" number="112756" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
				<manager id="sr:player:2623527" name="Callaghan, B.J." date_of_birth="1981-07-01" nationality="United states" country_code="USA"/>
				<formation type="4-3-3"/>
			</competitor>
		</competitors>
	</lineups>
</sport_event_lineups>

```
```json JSON
{
  "generated_at": "2025-07-17T12:51:58+00:00",
  "sport_event": {
    "id": "sr:sport_event:56690877",
    "start_time": "2025-07-12T23:45:00+00:00",
    "start_time_confirmed": true,
    "sport_event_context": {
      "sport": {
        "id": "sr:sport:1",
        "name": "Soccer"
      },
      "category": {
        "id": "sr:category:26",
        "name": "USA",
        "country_code": "USA"
      },
      "competition": {
        "id": "sr:competition:242",
        "name": "MLS",
        "gender": "men"
      },
      "season": {
        "id": "sr:season:127179",
        "name": "MLS 2025",
        "start_date": "2025-02-22",
        "end_date": "2025-12-08",
        "year": "2025",
        "competition_id": "sr:competition:242"
      },
      "stage": {
        "order": 1,
        "type": "league",
        "phase": "regular season",
        "start_date": "2025-02-22",
        "end_date": "2025-10-20",
        "year": "2025"
      },
      "round": {},
      "groups": [
        {
          "id": "sr:league:89897",
          "name": "MLS 2025"
        },
        {
          "id": "sr:league:89899",
          "name": "MLS 2025, Eastern Conference",
          "group_name": "Eastern Conference"
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
        "id": "sr:competitor:659691",
        "name": "Inter Miami CF",
        "country": "USA",
        "country_code": "USA",
        "abbreviation": "MIA",
        "qualifier": "home",
        "gender": "male"
      },
      {
        "id": "sr:competitor:668063",
        "name": "Nashville SC",
        "country": "USA",
        "country_code": "USA",
        "abbreviation": "NSH",
        "qualifier": "away",
        "gender": "male"
      }
    ],
    "venue": {
      "id": "sr:venue:51991",
      "name": "Chase Stadium",
      "capacity": 21550,
      "city_name": "Fort Lauderdale, FL",
      "country_name": "USA",
      "map_coordinates": "26.193056, -80.161111",
      "country_code": "USA",
      "timezone": "America/New_York"
    },
    "channels": [
      {
        "name": "Fox Sports 1",
        "url": "https://www.foxsports.com/presspass/latest-news/weekly-schedule",
        "country": "United States",
        "country_code": "USA"
      },
... (example cut here; 25 KB in the source page)
```

</details>

You can use the Sport Event Lineups endpoint to display starting formations, player positions, and roles as shown here. The data supports visualizing tactical setups, jersey numbers, and player stats such as goals or cards in a structured formation layout.

![](https://files.readme.io/bbcbddb8550c6f03d596c7362ad7245d806d71aff1a00d7536189116182f120a-image.png)

<br />

***

## VAR Review Process

VAR activity is tracked through the same live timeline feeds used for play-by-play updates: **Sport Event Timeline**, **Live Timelines**, **Live Timelines Delta**, and **Push Events**.

VAR reviews use two event types: `video_assistant_referee` marks the start of a review, and `video_assistant_referee_over` marks its conclusion. Both events include a `description` value that identifies what is under review and, on the closing event, the outcome.

> ⚠️ This workflow applies only to matches with live play-by-play coverage, indicated by `deeper_play_by_play="true"`.

***

### Integration Flow

1. When `video_assistant_referee` appears, a VAR review has begun. Check its `description` to identify what is being reviewed — for example, `goal`, `penalty`, or `red_card`.
2. When `video_assistant_referee_over` appears, the review has concluded. Check its `description` for the outcome — for example, `call_stands`, `call_overturned`, `no_penalty`, or `no_goal`.
3. Continue processing subsequent timeline events to determine the final match impact, such as a confirmed goal, penalty awarded, or no further action.

***

### Example

Note that other timeline events, such as `dribble`, may appear between the opening and closing VAR events.

```xml
        <event id="3000032774" type="video_assistant_referee" time="2026-04-29T01:07:33+00:00" match_time="50" match_clock="49:14" competitor="away" period="2" period_type="regular_period" description="penalty"/>
        <event id="3000032899" type="dribble" time="2026-04-29T01:10:21+00:00" match_time="52" match_clock="51:17" competitor="away" x="8" y="72" period="2" period_type="regular_period" outcome="successful">
            <players>
                <player id="sr:player:2150446" name="Veliz, Alejo" competitor_id="sr:competitor:3217"/>
            </players>
        </event>
        <event id="3000032882" type="video_assistant_referee_over" time="2026-04-29T01:09:38+00:00" match_time="52" match_clock="51:19" competitor="away" period="2" period_type="regular_period" description="penalty"/>
```

The away team triggers a VAR review for a possible penalty. A `dribble` event occurs during the review period. The review closes with `description="penalty"` confirming that the original penalty call stands.

***

### Supported Values

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Field
      </th>

      <th>
        Event Type
      </th>

      <th>
        Supported Values
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        `description`
      </td>

      <td>
        `video_assistant_referee`

        `video_assistant_referee_over`
      </td>

      <td>
        `goal`, `penalty`, `red_card`, `no_goal`, `no_penalty`, `no_red_card`, `corner`, `no_corner`, `mistaken_identity`, `no_mistaken_identity`
      </td>
    </tr>
  </tbody>
</Table>

***

<br />
