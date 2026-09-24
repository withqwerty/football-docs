---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-match-status-workflow
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.192Z
---
# Match Status Workflow

> 🚧 Live Coverage Requirement
>
> The workflows described in this documentation apply only to matches with **live coverage**. Matches in lower tiers, such as **Tier 9**, do not receive live updates and are therefore excluded from these workflows. Always check the coverage level before applying event-based logic.
>
> See **[Data Coverage and Tiers](http://developer.sportradar.com/soccer/docs/soccer-ig-data-coverage-tiers)** for more information on coverage levels.

## Intro

Every soccer match progresses through a series of statuses during its lifecycle. Use the `status` and `match_status` fields to determine the appropriate endpoint to call at each stage.

  ### Difference Between `status` and `match_status`

  The `status` field indicates the overall state of the match—before it starts, during live play, and after it ends.

  Once the match is live, you can use the `match_status` field to get more detailed sub-statuses that describe the specific phase of the live match (e.g., `halftime`, `overtime`, `penalties`).

The `status` is available in every **Schedule** endpoint. To retrieve a match's initial status and schedule information it would be most appropriate to request the [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule), [Daily Schedules](https://developer.sportradar.com/soccer/reference/soccer-daily-schedules), [Competitor Schedules](https://developer.sportradar.com/soccer/reference/soccer-competitor-schedules)or [Player Schedules](https://developer.sportradar.com/soccer/reference/soccer-player-schedules) endpoints.

<details>
  <summary><b><u>Season Schedule Code Examples</u></b></summary>

```xml Season Schedule Snippet (XML)
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
      <sport_event_properties lineups="true" formations="false" venue="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
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
```
```json Season Schedule Snippet (JSON)
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
          "map_coordinates": "53.463150,-2.291444",
          "country_code": "ENG",
          "timezone": "Eur
... (example cut here; 3 KB in the source page)
```

</details>

The `match_status` field is most useful during live matches and is typically accessed through **Event** endpoints that also provide live details such as statistics and play-by-play events. To monitor a match's live status, we recommend using the [Sport Event Lineups](https://developer.sportradar.com/soccer/reference/soccer-sport-event-lineups), [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary), or [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline) endpoints.

<details>
  <summary><b><u>Sport Event Summary Code Example</u></b></summary>

```xml Sport Event Summary Snippet (XML)
<sport_event id="sr:sport_event:51133377" start_time="2025-06-05T18:15:00+00:00" start_time_confirmed="true">
		<sport_event_context>
			<sport id="sr:sport:1" name="Soccer"/>
			<category id="sr:category:4" name="International"/>
			<competition id="sr:competition:308" name="World Cup Qualification AFC" parent_id="sr:competition:24660" gender="men"/>
			<season id="sr:season:108589" name="World Cup Qualification 2026, AFC" start_date="2023-10-12" end_date="2025-11-25" year="23-25" competition_id="sr:competition:308"/>
			<stage order="3" type="league" phase="regular season" start_date="2024-09-05" end_date="2025-06-10" year="23-25"/>
			<round number="9"/>
			<groups>
				<group id="sr:league:76709" name="World Cup 2026, AFC Qualification, Round 3, Group A" group_name="A"/>
			</groups>
		</sport_event_context>
		<coverage type="sport_event">
			<sport_event_properties lineups="true" formations="false" venue="true" extended_player_stats="false" extended_team_stats="false" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
		</coverage>
		<competitors>
			<competitor id="sr:competitor:4792" name="Qatar" country="Qatar" country_code="QAT" abbreviation="QAT" qualifier="home" gender="male"/>
			<competitor id="sr:competitor:4766" name="IR Iran" country="Iran" country_code="IRN" abbreviation="IRI" qualifier="away" gender="male"/>
		</competitors>
		<venue id="sr:venue:2205" name="Jassim Bin Hamad Stadium" capacity="35000" city_name="Doha" country_name="Qatar" map_coordinates="25.267358,51.484251" country_code="QAT" timezone="Asia/Qatar"/>
		<sport_event_conditions>
			<referees>
				<referee id="sr:referee:2162222" name="Khled Hoish, Mohammed" nationality="Saudi Arabia" country_code="SAU" type="main_referee"/>
			</referees>
			<weather pitch_conditions="good" overall_conditions="medium"/>
			<ground neutral="false"/>
			<lineups confirmed="true"/>
		</sport_event_conditions>
	</sport_event>
	<sport_event_status status="live" match_status="1st_half" home_score="0" away_score="0">
		<period_scores>
			<period_score home_score="0" away_score="0" type="regular_period" number="1"/>
		</period_scores>
		<ball_locations>
			<ball_location order="4" x="63" y="81" qualifier="away"/>
			<ball_location order="3" x="71" y="76" qualifier="away"/>
			<ball_location order="2" x="93" y="62" qualifier="away"/>
			<ball_location order="1" x="93" y="62" qualifier="home"/>
		</ball_locations>
		<match_situation status="safe" qualifier="away" updated_at="2025-06-05T18:35:27+00:00"/>
		<clock played="17:16"/>
	</sport_event_status>
	<statistics>
		<totals>
			<competitors>
				<competitor id="sr:competitor:4792" name="Qatar" abbreviation="QAT" qualifier="home">
					<statistics ball_possession="44" cards_given="0" corner_kicks="0" fouls="1" free_kicks="3" goal_kicks="0" injuries="1" offsides="1" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" shots_saved="2" shots_total="1" substitutions="0" throw_ins="4" yellow_cards="0" yellow_red_cards="0"/>
					<players>
						<player id="sr:player:223372" name="Hatem, Abdel Aziz" starter="false">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
						<player id="sr:player:229278" name="Alaaeldin, Ahmed" starter="true">
							<statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
						</player>
```
```json Sport Event Summary Snippet (JSON)
  {
  "sport_event": {
    "id": "sr:sport_event:51133377",
    "start_time": "2025-06-05T18:15:00+00:00",
    "start_time_confirmed": true,
    "sport_event_context": {
      "sport": {
        "id": "sr:sport:1",
        "name": "Soccer"
      },
      "category": {
        "id": "sr:category:4",
        "name": "International"
      },
      "competition": {
        "id": "sr:competition:308",
        "name": "World Cup Qualification AFC",
        "parent_id": "sr:competition:24660",
        "gender": "men"
      },
      "season": {
        "id": "sr:season:108589",
        "name": "World Cup Qualification 2026, AFC",
        "start_date": "2023-10-12",
        "end_date": "2025-11-25",
        "year": "23-25",
        "competition_id": "sr:competition:308"
      },
      "stage": {
        "order": 3,
        "type": "league",
        "phase": "regular season",
        "start_date": "2024-09-05",
        "end_date": "2025-06-10",
        "year": "23-25"
      },
      "round": {
        "number": 9
      },
      "groups": [
        {
          "id": "sr:league:76709",
          "name": "World Cup 2026, AFC Qualification, Round 3, Group A",
          "group_name": "A"
        }
      ]
    },
    "coverage": {
      "type": "sport_event",
      "sport_event_properties": {
        "lineups": true,
        "formations": false,
        "venue": true,
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
        "id": "sr:competitor:4792",
        "name": "Qatar",
        "country": "Qatar",
        "country_code": "QAT",
        "abbreviation": "QAT",
        "qualifier": "home",
        "gender": "male"
      },
      {
        "id": "sr:competitor:4766",
        "name": "IR Iran",
        "country": "Iran",
        "country_code": "IRN",
        "abbreviation": "IRI",
        "qualifier": "away",
        "gender": "male"
      }
    ],
    "venue": {
      "id": "sr:venue:2205",
      "name": "Jassim Bin Hamad Stadium",
      "capacity": 35000,
      "city_name": "Doha",
      "country_name": "Qatar",
      "map_coordinates": "25.267358,51.484251",
      "country_code": "QAT",
      "timezone": "Asia/Qatar"
    },
    "sport_event_conditions": {
      "referees": [
        {
          "id": "sr:referee:2162222",
          "name": "Khled Hoish, Mohammed",
          "nationality": "Saudi Arabia",
          "country_code": "SAU",
          "type": "main_referee"
        }
      ],
... (example cut here; 6 KB in the source page)
```

</details>

<br />

## Coverage Levels

The Soccer API is organized into 9 tiers, with Tier 1 offering the most comprehensive data and Tier 9 the least. Tiers determine the level of detail available for a given competition—such as player transfers, missing players, team squads, and season statistics.

  ### Note

  Coverage details for a season or competition include whether features like **Player Transfers**, **Missing Players**, **Team Squads**, and **Season Statistics** are available. You'll also see how each match is covered—either at the **basic**, **deeper**, or **extended** level—helping you determine the granularity of the data available for your integration.

For more on about accessing competition-level coverage details, see [data coverage and tiers](http://developer.sportradar.com/soccer/docs/soccer-ig-data-coverage-tiers).

<br />

***

## Status Definitions

#### status

Below are each of the overall status values you can expect to see returned from the Soccer API `status` attribute. Reference these definitions for details on what each sport event state signifies.

* `not_started` – The match is scheduled to be played
* `started` - The match has begun
* `live` – The match is currently in progress
* `postponed` – The match has been postponed to a future date
* `suspended` - The match has been suspended
* `delayed` – The match has been temporarily delayed and will be continued. Typically appears prior to match start
* `interrupted` – The match began, but coverage has stopped for a short time. Note that match scores may not be updated during this period; the last recorded match score will be displayed instead. Any interrupted match that remains in this status for more than 48 hours will receive limited coverage upon resumption; coverage up to the point of interruption remains at the level originally specified for the match.
* `cancelled` – The match has been cancelled and will not be played
* `ended` – The match is over
* `closed` – The match results have been confirmed
* `abandoned` - The match has been abandoned

<br />

#### match\_status

Below are the valid `match_status` values you may encounter in the Soccer API. Use these definitions to understand the specific phases of a match while it is in a live state.

* `not_started` – The match is scheduled to be played
* `started` - The match has begun
* `1st_half` – The match is in the first half
* `2nd_half` – The match is in the second half
* `overtime` – The match is in overtime
* `1st_extra` – The match is in the first extra period
* `2nd_extra` – The match is in the second extra period
* `awaiting_penalties` – Waiting for announcement of penalties
* `penalties` – Penalties are ongoing
* `awaiting_extra_time` – Waiting on referee to announce extra time
* `interrupted` – The match has been interrupted
* `abandoned` – The match has been abandoned
* `postponed` – The match has been postponed to a future date
* `start_delayed` – The match has been temporarily delayed and will be continued
* `cancelled` – The match has been cancelled and will not be played
* `halftime` – The match is in halftime
* `extra_time_halftime` – The match is in extra time halftime
* `ended` – The match has ended
* `aet` – The match has ended after extra time
* `ap` – The match has ended after penalties

<br />

***

## Status Workflows

See the below diagrams for common status flows, with context around each update.

### Standard Match

Below is the flow of the overall status of a typical Soccer game from `not_started` to `closed`.

<br />

***

### Knockout (Extra Time)

If the match is tied at the end of regular time and it is a knockout match (a winner must be determined), the game enters extra time:

<br />

***

### Knockout (Extra Time w/ Penalties)

If the match is still tied after extra time, it proceeds to penalties.

***

### Postponed

In the Soccer API, postponed matches are handled based on a few key rules:

* Matches delayed more than 48 hours are considered `postponed`.
* If the match resumes from the interruption point within 48 hours, it retains the same `sport_event` ID.
* If a match is restarted from the beginning or resumes after 48 hours, it receives a new `sport_event` ID. The original match is marked with a `replaced_by` tag referencing the new ID.

<details>
  <summary><b><u>Postponed Match Samples</u></b></summary>

```xml Sport Event Timeline (XML)
<?xml version="1.0" encoding="UTF-8"?>
<sport_event_timeline
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-16T09:37:35+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/sport_event_timeline.xsd">
	<sport_event id="sr:sport_event:41762865" start_time="2023-08-19T14:00:00+00:00" start_time_confirmed="true" replaced_by="sr:sport_event:43618043">
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
			<competitor id="sr:competitor:72" name="Luton Town" country="England" country_code="ENG" abbreviation="LUT" qualifier="home" gender="male"/>
			<competitor id="sr:competitor:6" name="Burnley FC" country="England" country_code="ENG" abbreviation="BUR" qualifier="away" gender="male"/>
		</competitors>
		<venue id="sr:venue:2178" name="Kenilworth Road" capacity="12056" city_name="Luton" country_name="England" map_coordinates="51.884167,-0.431667" country_code="ENG" timezone="Europe/London"/>
		<sport_event_conditions>
			<ground neutral="false"/>
		</sport_event_conditions>
	</sport_event>
	<sport_event_status status="postponed" match_status="postponed"/>
</sport_event_timeline>
```
```json Sport Event Timeline (JSON)
{
  "generated_at": "2025-07-16T09:39:42+00:00",
  "sport_event": {
    "id": "sr:sport_event:41762865",
    "start_time": "2023-08-19T14:00:00+00:00",
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
        "id": "sr:season:105353",
        "name": "Premier League 23/24",
        "start_date": "2023-08-11",
        "end_date": "2024-05-19",
        "year": "23/24",
        "competition_id": "sr:competition:17"
      },
      "stage": {
        "order": 1,
        "type": "league",
        "phase": "regular season",
        "start_date": "2023-08-11",
        "end_date": "2024-05-19",
        "year": "23/24"
      },
      "round": {
        "number": 2
      },
      "groups": [
        {
          "id": "sr:league:74627",
          "name": "Premier League 23/24"
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
        "basic_play_by_play": true,
        "basic_player_stats": true,
        "basic_team_stats": true
      }
    },
    "competitors": [
      {
        "id": "sr:competitor:72",
        "name": "Luton Town",
        "country": "England",
        "country_code": "ENG",
        "abbreviation": "LUT",
        "qualifier": "home",
        "gender": "male"
      },
      {
        "id": "sr:competitor:6",
        "name": "Burnley FC",
        "country": "England",
        "country_code": "ENG",
        "abbreviation": "BUR",
        "qualifier": "away",
        "gender": "male"
      }
    ],
    "venue": {
      "id": "sr:venue:2178",
      "name": "Kenilworth Road",
      "capacity": 12056,
      "city_name": "Luton",
      "country_name": "England",
      "map_coordinates": "51.884167,-0.431667",
      "country_code": "ENG",
      "timezone": "Europe/London"
    },
    "replaced_by": "sr:sport_event:43618043",
    "sport_event_conditions": {
      "ground": {
        "neutral": false
      }
    }
  },
  "sport_event_status": {
    "status": "postponed",
    "match_status": "postponed"
  }
}
```

</details>

Below is the flow of a `postponed` match.

Once a new game is created in `scheduled` status, it follows the [Standard Match](http://developer.sportradar.com/soccer/docs/soccer-ig-match-status-workflow#standard-match) flow.

<br />

<br />

***

### Suspended

Below is the flow of a `suspended` match.

Once a suspended game moves back to `live` it follows the [Standard Match](http://developer.sportradar.com/soccer/docs/soccer-ig-match-status-workflow#standard-match) flow.

<br />

***

### Cancelled

Below is the flow of a `cancelled` match.

A cancelled game will remain in `cancelled` status.

<details>
  <summary><b><u>Cancelled Match Samples</u></b></summary>

```xml Sport Event Timeline (XML)
<?xml version="1.0" encoding="UTF-8"?>
<sport_event_timeline
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-16T10:44:49+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/sport_event_timeline.xsd">
	<sport_event id="sr:sport_event:51567551" start_time="2025-04-21T13:00:00+00:00" start_time_confirmed="true">
		<sport_event_context>
			<sport id="sr:sport:1" name="Soccer"/>
			<category id="sr:category:122" name="Germany Amateur" country_code="DEU"/>
			<competition id="sr:competition:146" name="Oberliga Westfalen" gender="men"/>
			<season id="sr:season:121021" name="Oberliga Westfalen 24/25" start_date="2024-08-09" end_date="2025-06-01" year="24/25" competition_id="sr:competition:146"/>
			<stage order="1" type="league" phase="regular season" start_date="2024-08-09" end_date="2025-06-01" year="24/25"/>
			<round number="32"/>
			<groups>
				<group id="sr:league:85191" name="Oberliga Westfalen 24/25"/>
			</groups>
		</sport_event_context>
		<coverage type="sport_event">
			<sport_event_properties lineups="false" formations="false" venue="false" extended_play_by_play="false" extended_player_stats="false" extended_team_stats="false" ballspotting="false" commentary="false" fun_facts="false" goal_scorers="false" goal_scorers_live="true" scores="post" game_clock="false" deeper_play_by_play="false" deeper_player_stats="false" deeper_team_stats="false" basic_play_by_play="false" basic_player_stats="false" basic_team_stats="false"/>
		</coverage>
		<competitors>
			<competitor id="sr:competitor:458499" name="TuS Bovinghausen 04" abbreviation="BOV" qualifier="home" gender="male"/>
			<competitor id="sr:competitor:5839" name="VfL Bochum II" country="Germany" country_code="DEU" abbreviation="BOC" qualifier="away" gender="male"/>
		</competitors>
		<sport_event_conditions>
			<ground neutral="false"/>
		</sport_event_conditions>
	</sport_event>
	<sport_event_status status="cancelled"/>
</sport_event_timeline>
```
```json Sport Event Timeline (JSON)
{
  "generated_at": "2025-07-16T10:43:40+00:00",
  "sport_event": {
    "id": "sr:sport_event:51567551",
    "start_time": "2025-04-21T13:00:00+00:00",
    "start_time_confirmed": true,
    "sport_event_context": {
      "sport": {
        "id": "sr:sport:1",
        "name": "Soccer"
      },
      "category": {
        "id": "sr:category:122",
        "name": "Germany Amateur",
        "country_code": "DEU"
      },
      "competition": {
        "id": "sr:competition:146",
        "name": "Oberliga Westfalen",
        "gender": "men"
      },
      "season": {
        "id": "sr:season:121021",
        "name": "Oberliga Westfalen 24/25",
        "start_date": "2024-08-09",
        "end_date": "2025-06-01",
        "year": "24/25",
        "competition_id": "sr:competition:146"
      },
      "stage": {
        "order": 1,
        "type": "league",
        "phase": "regular season",
        "start_date": "2024-08-09",
        "end_date": "2025-06-01",
        "year": "24/25"
      },
      "round": {
        "number": 32
      },
      "groups": [
        {
          "id": "sr:league:85191",
          "name": "Oberliga Westfalen 24/25"
        }
      ]
    },
    "coverage": {
      "type": "sport_event",
      "sport_event_properties": {
        "lineups": false,
        "formations": false,
        "venue": false,
        "extended_play_by_play": false,
        "extended_player_stats": false,
        "extended_team_stats": false,
        "ballspotting": false,
        "commentary": false,
        "fun_facts": false,
        "goal_scorers": false,
        "goal_scorers_live": true,
        "scores": "post",
        "game_clock": false,
        "deeper_play_by_play": false,
        "deeper_player_stats": false,
        "deeper_team_stats": false,
        "basic_play_by_play": false,
        "basic_player_stats": false,
        "basic_team_stats": false
      }
    },
    "competitors": [
      {
        "id": "sr:competitor:458499",
        "name": "TuS Bovinghausen 04",
        "abbreviation": "BOV",
        "qualifier": "home",
        "gender": "male"
      },
      {
        "id": "sr:competitor:5839",
        "name": "VfL Bochum II",
        "country": "Germany",
        "country_code": "DEU",
        "abbreviation": "BOC",
        "qualifier": "away",
        "gender": "male"
      }
    ],
    "sport_event_conditions": {
      "ground": {
        "neutral": false
      }
    }
  },
  "sport_event_status": {
    "status": "cancelled"
  }
}
```

</details>

<br />

<br />

<br />

***

## General Data Workflows and Production Timelines

Here’s what you can expect for common data processes in the Soccer API:

* **Schedule Releases and Tournament Creation:** Fixtures are typically created within 4 hours of schedule announcement or up to 1 month in advance, depending on priority.
* **Lineups Information**: Starting lineups are announced roughly 1 hour before kickoff and can change until the match begins. The latest expected availability is 15 minutes into the match.
* **Player Transfers and Rosters:** Transfer data is updated within 24 hours of official confirmation, based on priority.
* **Translated Terms:** New teams or competitions are translated within 4 weeks of creation.
* **Corrections:** Most corrections occur during live coverage, with post-match validation to ensure data accuracy.
* **Resulting:** Match results are finalized and published within 5 minutes of match completion.

<br />

***

## Simulations

To help you test your integration against the various match statuses and workflows described above, use our Simulations tool. Simulations let you replay recorded soccer matches on demand using both REST and Push feeds, so you can validate how your application handles status transitions (such as `live`, `halftime`, `ended`, and `closed`) without waiting for a live match.

This is especially useful for testing edge cases like extra time, penalties, and live statistics updates. See the Simulations documentation for available recordings, supported endpoints, and session handling.
