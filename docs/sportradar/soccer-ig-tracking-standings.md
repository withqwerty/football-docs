---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-tracking-standings
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Tracking Standings

This integration scenario explains how to retrieve and render **soccer standings** using the Sportradar Soccer v4 API. It covers how to build league tables, render group-stage standings for cup and tournament competitions, track live standings while matches are in progress, display recent-form guides, and surface qualification, promotion, and relegation context.

This scenario is commonly used to:

* Render league standings tables (position, points, win/draw/loss, goal difference)
* Display group-stage tables for cup and tournament competitions
* Track live standings that recalculate while matches are in progress
* Power recent-form widgets (W/D/L over the last several matches)
* Surface qualification, promotion, and relegation context within a table
* Display official FIFA World Rankings for national teams

This scenario focuses on **standings and table placement**. Match and season performance statistics (team and player) are covered separately in the **Seasonal Statistics** integration scenario.

<br />

***

## Overview

Standings and form standings are closely related, but they serve different purposes.

<br />

### Standings vs. Form Standings

**Season Standings** provide the complete competitive table for a season, including:

* Position and rank
* Points, points per game, and matches played
* Win, draw, and loss records
* Goals for, goals against, and goal difference
* Position change (movement since the previous round)
* A recent-form string per team (`form`, for example `WWDWW`)
* Qualification, promotion, and relegation outcome (where applicable)

**Season Form Standings** are a streamlined view focused on recent results, computed over a rolling window of recent matches (`played` is 10 in the Premier League sample, rather than a fixed six).

Both feeds share the core record fields (W/D/L, goals, goal difference, `points`, and a `form` string) but differ in the placement context they carry:

| Field                                           | Season Standings                                                        | Form Standings                   |
| ----------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------- |
| Rank / position (`rank`)                        | Yes                                                                     | No                               |
| Qualification / relegation (`current_outcome`)  | Yes, on outcome rows only                                               | No                               |
| Position change (`change`)                      | Yes                                                                     | No                               |
| Points per game (`points_per_game`)             | Yes                                                                     | No                               |
| W/D/L, goals, goal difference, `points`, `form` | Yes                                                                     | Yes                              |
| `type` splits                                   | 9 (`total`/`home`/`away`, each full-match, first-half, and second-half) | 6 (`full_time_*`, `half_time_*`) |

When present, `current_outcome` holds values such as `Champions League`, `UEFA Europa League`, `Conference League Qualification`, or `Relegation`; mid-table rows omit it, so guard for its absence.

You can retrieve standings for both **league competitions** (a single table) and **cup or tournament competitions** (one table per group or stage), allowing applications to render group-stage tables separately from straight league tables when applicable.

<br />

  ### What Are "Live Standings"?

  **Live standings are delivered by default** in the Season Standings endpoint. While matches are in progress, the table is recalculated in real time using an automatic set of tiebreaker rules based on the live scores.

  This is surfaced through the `live` flag on each `group` node, which may take values such as:

  * `false`: The standing reflects confirmed, completed results only
  * `true`: The standing includes in-progress match results and is being calculated live

  This applies only to competitions whose Season Info reports `standings="live"`; `post`-coverage competitions update standings only after matches finish. Live recalculation reflects provisional ordering. Once matches conclude and official results post, the standing settles to the confirmed table. Always drive competitive order from position/rank, points, and goal difference rather than from a single field in isolation.

<br />

### Relevant Feeds

The following feeds support standings tables, form widgets, and group/stage context.

| Feed                                                                                                                         | Purpose                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Season Standings                | Full standings tables with position, points, W/D/L, goals, goal difference, position change, and qualification outcome; live by default |
| Season Form Standings | Lightweight recent-form table (W/D/L for up to six matches per team)                                                                    |
| Season Info                               | Confirms standings coverage level and participating teams for a season (coverage flags at competition and group level)                  |
| Season Links                            | Linked stages, groups, and cup rounds for compiling advancement brackets in multi-stage competitions                                    |
| Sport Events Updated    | Monitor matches that have changed so you know when to refresh standings                                                                 |
| FIFA Rankings                | Official FIFA World Rankings for national teams (Soccer Extended API)                                                                   |

<br />

***

## Authentication & Base URL

All Soccer v4 requests are sent over HTTPS to `https://api.sportradar.com/soccer/` and authenticated with your API key in the `x-api-key` header. The path carries four standard placeholders:

* `access_level`: `trial` or `production`, matching your key
* `language_code`: a 2-letter language code (for example `en`)
* `season_id`: the target season (resolved in Step 1, Establish Season Context)
* `format`: `json` or `xml`

```http
GET https://api.sportradar.com/soccer/trial/v4/en/seasons/sr:season:118689/standings.xml
x-api-key: YOUR_API_KEY
```

Trial keys are rate-limited (about one request per second) and expose a limited set of competitions and seasons; use a production key with `access_level` set to `production` for full coverage.

<br />

***

## High-Level Workflow

A typical standings integration follows this flow:

**Season Context → Standings or Form Standings → Group/Stage Handling → Qualification & Relegation Context → Advancement (Season Links) → Refresh (Sport Events Updated)**

1. Identify the `competition_id` and `season_id`
2. Pull **Season Standings** (recommended for tables) or **Season Form Standings** (form widgets)
3. Iterate groups and stages for cup and tournament competitions
4. Render qualification, promotion, and relegation context using `current_outcome`
5. For knockout phases, use **Season Links** to compile advancement brackets
6. Refresh standings as matches change, using **Sport Events Updated**

<br />

***

## Integration Steps

<br />

### 1. Establish Season Context

Determine:

* `competition_id` (from the Competitions feed)
* `season_id` (from the Competition Seasons or Seasons feed)

Use the Season Info feed to confirm standings coverage for the target season. Coverage is reported at both the competition level (`season_info.coverage`) and group level (`group.coverage`), so cup competitions may differ in coverage by group or stage. These values scope the standings request to the correct season.

The `standings` coverage flag tells you how standings are produced: `live` means the table is recalculated in-play (so it can return `live="true"` during matches), while `post` means it updates only after matches finish. The snippet below shows the competition-level coverage and the group-level coverage for UEFA Euro 2024 (Group A), both `standings="live"`:

```xml Season Info Snippet (xml)
<?xml version="1.0" ?>
<season_info xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" generated_at="2026-06-04T22:31:07+00:00" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_info.xsd">
  <coverage type="competition">
    <competition_properties brackets="false" missing_players="true" player_transfer_history="true" schedules="true" season_player_statistics="true" season_stats_leaders="true" season_team_statistics="true" standings="live" team_squads="true"/>
    <sport_event_properties basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true" extended_player_stats="true" extended_team_stats="true" deeper_play_by_play="true" deeper_team_stats="true" deeper_player_stats="true" lineups="true" goal_scorers="true" goal_scorers_live="true" scores="live" assists="true"/>
  </coverage>
  <season id="sr:season:92261" name="UEFA Euro 2024" start_date="2024-06-14" end_date="2024-07-14" year="2024" competition_id="sr:competition:1">
    <sport id="sr:sport:1" name="Soccer"/>
    <category id="sr:category:4" name="International"/>
    <competition id="sr:competition:1" name="UEFA Euro" gender="men"/>
  </season>
  <stages>
    <stage order="1" type="league" phase="regular season" start_date="2024-06-14" end_date="2024-06-26" year="2024">
      <groups>
        <group id="sr:league:80247" name="Group A" max_rounds="3" group_name="A">
          <competitors>
            <competitor id="sr:competitor:4711" name="Germany" country="Germany" country_code="DEU" abbreviation="GER" gender="male"/>
            <competitor id="sr:competitor:4695" name="Scotland" country="Scotland" country_code="SCO" abbreviation="SCO" gender="male"/>
            <competitor id="sr:competitor:4699" name="Switzerland" country="Switzerland" country_code="CHE" abbreviation="SUI" gender="male"/>
            <competitor id="sr:competitor:4709" name="Hungary" country="Hungary" country_code="HUN" abbreviation="HUN" gender="male"/>
          </competitors>
          <coverage type="group">
            <group_properties brackets="false" cup="false" league="true" missing_players="true" qualification="false" schedules="true" results="true" standings="live" group_stage="true"/>
            <sport_event_properties basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true" lineups="true" extended_player_stats="true" extended_team_stats="true" deeper_team_stats="true" deeper_player_stats="true" deeper_play_by_play="true" goal_scorers="true" scores="live"/>
          </coverage>
        </group>
        <!-- groups B to F and the knockout stage omitted for brevity -->
      </groups>
    </stage>
  </stages>
</season_info>
```

<br />

### 2. Retrieve Standings or Form Standings

Choose the feed based on the UI you are building:

* Season Standings for full tables and record context (points, W/D/L, goals, goal difference, position change, qualification outcome)

  ```http
  GET https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/seasons/{season_id}/standings.{format}
  ```

  <br />
* Season Form Standings for lightweight form-guide components where you only need recent W/D/L results
  ```http
  GET https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/seasons/{season_id}/form_standings.{format}
  ```
  <br />

**Season Standings** is the default choice for most standings pages because it already includes qualification outcome and position-change fields in addition to records. Ensure you pull standings according to the feed's [update frequencies](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies).

```xml Season Standings Snippet (xml)
<?xml version="1.0" ?>
<season_standings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" generated_at="2026-06-04T21:21:57+00:00" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_standings.xsd">
  <season_standing tie_break_rule="In the event that two (or more) teams have an equal number of points, the following rules break the tie:
1. Goal difference
2. Goals scored
3. H2H" type="total" points_win="3" points_draw="1" points_loss="0" round="38">
    <groups>
      <group id="sr:league:84075" name="Premier League" live="false">
        <stage order="1" type="league" phase="regular season" start_date="2024-08-16" end_date="2025-05-25" year="24/25"/>
        <standings>
          <standing rank="1" played="38" win="25" loss="4" draw="9" goals_for="86" goals_against="41" goals_diff="45" points="84" current_outcome="Champions League" change="0" points_per_game="2.21">
            <competitor id="sr:competitor:44" name="Liverpool FC" country="England" country_code="ENG" abbreviation="LFC" gender="male" form="WLDLD"/>
          </standing>
          <standing rank="2" played="38" win="20" loss="4" draw="14" goals_for="69" goals_against="34" goals_diff="35" points="74" current_outcome="Champions League" change="0" points_per_game="1.95">
            <competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" gender="male" form="DLDWW"/>
          </standing>
          <standing rank="3" played="38" win="21" loss="9" draw="8" goals_for="72" goals_against="44" goals_diff="28" points="71" current_outcome="Champions League" change="0" points_per_game="1.87">
            <competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" gender="male" form="WWDWW"/>
          </standing>
          <standing rank="4" played="38" win="20" loss="9" draw="9" goals_for="64" goals_against="43" goals_diff="21" points="69" current_outcome="Champions League" change="1" points_per_game="1.82">
            <competitor id="sr:competitor:38" name="Chelsea FC" country="England" country_code="ENG" abbreviation="CFC" gender="male" form="WWLWW"/>
          </standing>
          <standing rank="5" played="38" win="20" loss="12" draw="6" goals_for="68" goals_against="47" goals_diff="21" points="66" current_outcome="Champions League" change="-1" points_per_game="1.74">
            <competitor id="sr:competitor:39" name="Newcastle United" country="England" country_code="ENG" abbreviation="NEW" gender="male" form="WDWLL"/>
          </standing>
          <standing rank="6" played="38" win="19" loss="10" draw="9" goals_for="58" goals_against="51" goals_diff="7" points="66" current_outcome="UEFA Europa League" change="0" points_per_game="1.74">
            <competitor id="sr:competitor:40" name="Aston Villa" country="England" country_code="ENG" abbreviation="AVL" gender="male" form="LWWWL"/>
          </standing>
          <standing rank="7" played="38" win="19" loss="11" draw="8" goals_for="58" goals_against="46" goals_diff="12" points="65" current_outcome="UEFA Europa League" change="0" points_per_game="1.71">
            <competitor id="sr:competitor:14" name="Nottingham Forest" country="England" country_code="ENG" abbreviation="NFO" gender="male" form="LDDWL"/>
          </standing>
          <standing rank="8" played="38" win="16" loss="9" draw="13" goals_for="66" goals_against="59" goals_diff="7" points="61" change="0" points_per_game="1.61">
            <competitor id="sr:competitor:30" name="Brighton &amp; Hove Albion" country="England" country_code="ENG" abbreviation="BRI" gender="male" form="WDWWW"/>
          </standing>
          <standing rank="9" played="38" win="15" loss="12" draw="11" goals_for="58" goals_against="46" goals_diff="12" points="56" change="2" points_per_game="1.47">
            <competitor id="sr:competitor:60" name="AFC Bournemouth" country="England" country_code="ENG" abbreviation="BOU" gender="male" form="DWLLW"/>
          </standing>
          <standing rank="10" played="38" win="16" loss="14" draw="8" goals_for="66" goals_against="57" goals_diff="9" points="56" change="-1" points_per_game="1.47">
            <competitor id="sr:competitor:50" name="Brentford FC" country="England" country_code="ENG" abbreviation="BRE" gender="male" form="WWWLD"/>
          </standing>
          <standing rank="11" played="38" win="15" loss="14" draw="9" goals_for="54" goals_against="54" goals_diff="0" points="54" change="-1" points_per_game="1.42">
            <competitor id="sr:competitor:43" name="Fulham FC" country="England" country_code="ENG" abbreviation="FUL" gender="male" form="WLLWL"/>
          </standing>
          <standing rank="12" played="38" win="13" loss="11" draw="14" goals_for="51" goals_against="51" goals_diff="0" points="53" current_outcome="Conference League Qualification" change="0" points_per_game="1.39">
            <competitor id="sr:competitor:7" name="Crystal Palace" country="England" country_code="ENG" abbreviation="CRY" gender="male" form="DDWWD"/>
          </standing>
          <standing rank="13" played="38" win="11" loss="12" draw="15" goals_for="42" goals_against="44" goals_diff="-2" points="48" change="0" points_per_game="1.26">
            <competitor id="sr:competitor:48" name="Everton FC" country="England" country_code="ENG" abbreviation="EVE" gender="male" form="LDWWW"/>
          </standing>
          <standing rank="14" played="38" win="11" loss="17" draw="10" goals_for="46" goals_against="62" goals_diff="-16" points="43" change="1" points_per_game="1.13">
            <competitor id="sr:competitor:37" name="West Ham United" country="England" country_code="ENG" abbreviation="WHU" gender="male" form="LDWLW"/>
          </standing>
          <standing rank="15" played="38" win="11" loss="18" draw="9" goals_for="44" goals_against="54" goals_diff="-10" points="42" change="1" points_per_game="1.11">
            <competitor id="sr:competitor:35" name="Manchester United" country="England" country_code="ENG" abbreviation="MUN" gender="male" form="DLLLW"/>
          </standing>
          <standing rank="16" played="38" win="12" loss="20" draw="6" goals_for="54" goals_against="69" goals_diff="-15" points="42" change="-2" points_per_game="1.11">
            <competitor id="sr:competitor:3" name="Wolverhampton Wanderers" country="England" country_code="ENG" abbreviation="WOL" gender="male" form="WLLLD"/>
          </standing>
          <standing rank="17" played="38" win="11" loss="22" draw="5" goals_for="64" goals_against="65" goals_diff="-1" points="38" current_outcome="Champions League" change="0" points_per_game="1">
            <competitor id="sr:competitor:33" name="Tottenham Hotspur" country="England" country_code="ENG" abbreviation="TOT" gender="male" form="LDLLL"/>
          </standing>
          <standing rank="18" played="38" win="6" loss="25" draw="7" goals_for="33" goals_against="80" goals_diff="-47" points="25" current_outcome="Relegation" change="0" points_per_game="0.66">
            <competitor id="sr:competitor:31" name="Leicester City" country="England" country_code="ENG" abbreviation="LEI" gender="male" form="LWDWL"/>
          </standing>
          <standing rank="19" played="38" win="4" loss="24" draw="10" goals_for="36" goals_against="82" goals_diff="-46" points="22" current_outcome="Relegation" change="0" points_per_game="0.58">
            <competitor id="sr:competitor:32" name="Ipswich Town" country="England" country_code="ENG" abbreviation="IPS" gender="male" form="LDLLL"/>
          </standing>
          <standing rank="20" played="38" win="2" loss="30" draw="6" goals_for="26" goals_against="86" goals_diff="-60" points="12" current_outcome="Relegation" change="0" points_per_game="0.32">
            <competitor id="sr:competitor:45" name="Southampton FC" country="England" country_code="ENG" abbreviation="SOU" gender="male" form="LLDLL"/>
          </standing>
        </standings>
      </group>
    </groups>
  </season_standing>
  <!-- home, away, first_half_total, first_half_home, first_half_away, second_half_total, second_half_home and second_half_away splits omitted for brevity -->
</season_standings>
```

<br />

Set `format` to `json` for the same data as JSON. The structure mirrors the XML, with `standings[].groups[].standings[]` and a nested `competitor` object (trimmed here to the top three of the `total` split):

```json Season Standings Snippet (json)
{
  "generated_at": "2026-06-04T23:10:26+00:00",
  "standings": [
    {
      "type": "total",
      "round": 38,
      "groups": [
        {
          "stage": {
            "order": 1,
            "type": "league",
            "phase": "regular season",
            "start_date": "2024-08-16",
            "end_date": "2025-05-25",
            "year": "24/25"
          },
          "id": "sr:league:84075",
          "name": "Premier League",
          "live": false,
          "standings": [
            {
              "rank": 1,
              "played": 38,
              "win": 25,
              "loss": 4,
              "draw": 9,
              "goals_for": 86,
              "goals_against": 41,
              "goals_diff": 45,
              "competitor": {
                "id": "sr:competitor:44",
                "name": "Liverpool FC",
                "country": "England",
                "country_code": "ENG",
                "abbreviation": "LFC",
                "gender": "male",
                "form": "WLDLD"
              },
              "points": 84,
              "current_outcome": "Champions League",
              "change": 0,
              "points_per_game": 2.21
            },
            {
              "rank": 2,
              "played": 38,
              "win": 20,
              "loss": 4,
              "draw": 14,
              "goals_for": 69,
              "goals_against": 34,
              "goals_diff": 35,
              "competitor": {
                "id": "sr:competitor:42",
                "name": "Arsenal FC",
                "country": "England",
                "country_code": "ENG",
                "abbreviation": "ARS",
                "gender": "male",
                "form": "DLDWW"
              },
              "points": 74,
              "current_outcome": "Champions League",
              "change": 0,
              "points_per_game": 1.95
            },
            {
              "rank": 3,
              "played": 38,
              "win": 21,
              "loss": 9,
              "draw": 8,
              "goals_for": 72,
              "goals_against": 44,
              "goals_diff": 28,
              "competitor": {
                "id": "sr:competitor:17",
                "name": "Manchester City",
                "country": "England",
                "country_code": "ENG",
                "abbreviation": "MCI",
                "gender": "male",
                "form": "WWDWW"
              },
              "points": 71,
              "current_outcome": "Champions League",
              "change": 0,
              "points_per_game": 1.87
            }
          ]
        }
      ]
    }
  ]
}
```

<br />

For lightweight form-guide widgets, **Season Form Standings** returns a recent-results table. Each `<season_form_standing>` covers a split (`full_time_total`, `full_time_home`, `full_time_away`, and the half-time variants).

```xml Season Form Standings Snippet (xml)
<?xml version="1.0" ?>
<season_form_standings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" generated_at="2026-06-04T21:27:39+00:00" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_form_standings.xsd">
  <season_form_standing type="full_time_total">
    <groups>
      <group id="sr:league:84075" name="Premier League 24/25">
        <form_standings>
          <form_standing played="10" win="7" loss="0" draw="3" goals_for="19" goals_against="6" goals_diff="13" points="24" form="WWDWWW">
            <competitor id="sr:competitor:17" name="Manchester City" country="England" country_code="ENG" abbreviation="MCI" gender="male"/>
          </form_standing>
          <form_standing played="10" win="8" loss="2" draw="0" goals_for="18" goals_against="6" goals_diff="12" points="24" form="LWWWLW">
            <competitor id="sr:competitor:40" name="Aston Villa" country="England" country_code="ENG" abbreviation="AVL" gender="male"/>
          </form_standing>
          <form_standing played="10" win="6" loss="2" draw="2" goals_for="11" goals_against="7" goals_diff="4" points="20" form="WWLWWW">
            <competitor id="sr:competitor:38" name="Chelsea FC" country="England" country_code="ENG" abbreviation="CFC" gender="male"/>
          </form_standing>
          <form_standing played="10" win="6" loss="3" draw="1" goals_for="21" goals_against="9" goals_diff="12" points="19" form="LLWDWL">
            <competitor id="sr:competitor:39" name="Newcastle United" country="England" country_code="ENG" abbreviation="NEW" gender="male"/>
          </form_standing>
          <form_standing played="10" win="5" loss="1" draw="4" goals_for="17" goals_against="10" goals_diff="7" points="19" form="WWDLDW">
            <competitor id="sr:competitor:42" name="Arsenal FC" country="England" country_code="ENG" abbreviation="ARS" gender="male"/>
          </form_standing>
          <form_standing played="10" win="6" loss="3" draw="1" goals_for="16" goals_against="12" goals_diff="4" points="19" form="DLLLWW">
            <competitor id="sr:competitor:3" name="Wolverhampton Wanderers" country="England" country_code="ENG" abbreviation="WOL" gender="male"/>
          </form_standing>
          <!-- 14 more teams omitted for brevity -->
        </form_standings>
      </group>
    </groups>
  </season_form_standing>
  <!-- full_time_home, full_time_away, half_time_total, half_time_home and half_time_away splits omitted for brevity -->
</season_form_standings>
```

<br />

<br />

> ℹ️ When to Use Form Standings
>
> Form Standings is best used when you want a smaller payload focused on **recent form**. It still includes `win`/`draw`/`loss`, goals for/against, goal difference, and `points`, computed over a recent-match window, and it omits the placement context Season Standings carries (`rank`, `current_outcome`, `change`, and `points_per_game`).

<br />

### 3. Handle Groups and Multi-Stage Competitions

Standings are organized into `group` nodes, and the structure depends on the competition type:

* **League competitions** return a single `group` containing the full table
* **Cup and tournament competitions** return multiple `group` nodes (for example, group-stage tables), and may differ in coverage by group

Iterate every `group` node rather than assuming a single table, and select the split you need from the `type` attribute. Season Standings returns nine splits (`total`, `home`, and `away`, each with `first_half_*` and `second_half_*` variants), so filter to the `type` your UI requires. The `total`, `home`, and `away` splits use full-match results (all fixtures, home fixtures only, or away fixtures only); the `first_half_*` and `second_half_*` variants recompute the same tables from first-half-only or second-half-only scores. For competitions with multiple phases, render each group or stage table independently.

In a cup competition, each group carries a `group_name` (for example `A` to `F`) and its own `current_outcome` (such as `Playoffs` for sides advancing to the knockout phase). The example below is the UEFA Euro 2024 group stage (`total` split, Groups A and B shown):

```xml Group-Stage Standings Snippet (xml)
<?xml version="1.0" ?>
<season_standings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" generated_at="2026-06-04T22:31:04+00:00" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_standings.xsd">
  <season_standing tie_break_rule="In the event that two (or more) teams finish with an equal number of points, the following rules break the tie:
1. Head-to-head games between the teams concerned
1a. Points total
1b. Goal difference
1c. Goals scored
2. Goal difference
3. Goals scored
4. Disciplinary Points
5. European Qualifiers Ranking;

If two teams are tied on points, goals scored, and goals conceded, and they play their final group match against each other, a penalty shootout will determine their rankings, provided no other teams in the group have the same points." type="total" points_win="3" points_draw="1" points_loss="0" round="3">
    <groups>
      <group id="sr:league:80247" name="Group A" live="false" group_name="A">
        <stage order="1" type="league" phase="regular season" start_date="2024-06-14" end_date="2024-06-23" year="2024"/>
        <standings>
          <standing rank="1" played="3" win="2" loss="0" draw="1" goals_for="8" goals_against="2" goals_diff="6" points="7" current_outcome="Playoffs" change="0" points_per_game="2.33">
            <competitor id="sr:competitor:4711" name="Germany" country="Germany" country_code="DEU" abbreviation="GER" gender="male" form="WWD"/>
          </standing>
          <standing rank="2" played="3" win="1" loss="0" draw="2" goals_for="5" goals_against="3" goals_diff="2" points="5" current_outcome="Playoffs" change="0" points_per_game="1.67">
            <competitor id="sr:competitor:4699" name="Switzerland" country="Switzerland" country_code="CHE" abbreviation="SUI" gender="male" form="WDD"/>
          </standing>
          <standing rank="3" played="3" win="1" loss="2" draw="0" goals_for="2" goals_against="5" goals_diff="-3" points="3" change="1" points_per_game="1">
            <competitor id="sr:competitor:4709" name="Hungary" country="Hungary" country_code="HUN" abbreviation="HUN" gender="male" form="LLW"/>
          </standing>
          <standing rank="4" played="3" win="0" loss="2" draw="1" goals_for="2" goals_against="7" goals_diff="-5" points="1" change="-1" points_per_game="0.33">
            <competitor id="sr:competitor:4695" name="Scotland" country="Scotland" country_code="SCO" abbreviation="SCO" gender="male" form="LDL"/>
          </standing>
        </standings>
      </group>
      <group id="sr:league:80249" name="Group B" live="false" group_name="B">
        <stage order="1" type="league" phase="regular season" start_date="2024-06-15" end_date="2024-06-24" year="2024"/>
        <standings>
          <standing rank="1" played="3" win="3" loss="0" draw="0" goals_for="5" goals_against="0" goals_diff="5" points="9" current_outcome="Playoffs" change="0" points_per_game="3">
            <competitor id="sr:competitor:4698" name="Spain" country="Spain" country_code="ESP" abbreviation="ESP" gender="male" form="WWW"/>
          </standing>
          <standing rank="2" played="3" win="1" loss="1" draw="1" goals_for="3" goals_against="3" goals_diff="0" points="4" current_outcome="Playoffs" change="0" points_per_game="1.33">
            <competitor id="sr:competitor:4707" name="Italy" country="Italy" country_code="ITA" abbreviation="ITA" gender="male" form="WLD"/>
          </standing>
          <standing rank="3" played="3" win="0" loss="1" draw="2" goals_for="3" goals_against="6" goals_diff="-3" points="2" change="1" points_per_game="0.67">
            <competitor id="sr:competitor:4715" name="Croatia" country="Croatia" country_code="HRV" abbreviation="CRO" gender="male" form="LDD"/>
          </standing>
          <standing rank="4" played="3" win="0" loss="2" draw="1" goals_for="3" goals_against="5" goals_diff="-2" points="1" change="-1" points_per_game="0.33">
            <competitor id="sr:competitor:4690" name="Albania" country="Albania" country_code="ALB" abbreviation="ALB" gender="male" form="LDL"/>
          </standing>
        </standings>
      </group>
      <!-- groups C, D, E and F omitted for brevity -->
    </groups>
  </season_standing>
  <!-- home, away and half-time splits omitted for brevity -->
</season_standings>
```

<br />

### 4. Render Qualification, Promotion, and Relegation Context

Standings expose post-table context through outcome and movement fields:

* `current_outcome` for qualification and relegation status (real values include `Champions League`, `UEFA Europa League`, `Conference League Qualification`, and `Relegation`). It is present **only on rows that have an outcome**; mid-table rows omit it, so guard for its absence. It also reflects *actual* qualification, which can sit outside league order: in the 24/25 sample, 17th-placed Tottenham carries `current_outcome="Champions League"` after winning the Europa League, so never infer it from `rank`.
* `rank` for placement within the group (the response attribute is `rank`)
* `change` for movement since the previous round (positive, negative, or no change)
* Record fields like `points`, `points_per_game`, `goals_diff`, `win`, `draw`, and `loss` for the competitive ordering

Common UI patterns:

* Color-coded qualification and relegation zones in the table
* Qualification badges (Champions League, Europa League, promotion, relegation)
* Position-change arrows driven by `change`
* Tooltip explanations for outcome labels and tiebreaker rules

<br />

### 5. Compile Advancement Brackets

For knockout and cup competitions, combine standings with Season Links to render advancement:

* Use group standings to identify group winners and runners-up
* Use Season Links (`stages_groups_cup_rounds`) to retrieve linked cup rounds and compile full advancement brackets, including parent and child round relationships

Then render bracket and progression modules, such as:

* Group-stage-to-knockout transition views
* Cup round brackets that fill in as matchups are confirmed
* Stage navigation across multi-phase competitions

Each `cup_round` carries a `name` (for example `round_of_16`, `quarterfinal`), a `state`, and `linked_cup_rounds` that connect it to its `parent` and `child` rounds. The UEFA Euro 2024 bracket below shows resolved rounds (`state="winner"` with a `winner_id`):

```xml Season Links Snippet (xml)
<?xml version="1.0" ?>
<season_stages_groups_cup_rounds xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" generated_at="2026-06-04T22:31:09+00:00" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_stages_groups_cup_rounds.xsd">
  <stages>
    <stage order="1" type="cup" phase="playoffs" start_date="2024-06-29" end_date="2024-07-14" year="2024">
      <groups>
        <group id="sr:cup:157967" group_name="Knockout stage">
          <cup_rounds>
            <cup_round id="sr:cup_round:1984283" name="round_of_16" order="1" state="winner" winner_id="sr:competitor:4698">
              <sport_events>
                <sport_event id="sr:sport_event:45843695" start_time="2024-06-30T19:00:00+00:00" start_time_confirmed="true" date_confirmed="true" order="1"/>
              </sport_events>
              <linked_cup_rounds>
                <cup_round id="sr:cup_round:1984299" type="parent" name="quarterfinal" order="1" state="winner" winner_id="sr:competitor:4698"/>
              </linked_cup_rounds>
            </cup_round>
            <cup_round id="sr:cup_round:1984299" name="quarterfinal" order="1" state="winner" winner_id="sr:competitor:4698">
              <sport_events>
                <sport_event id="sr:sport_event:45843709" start_time="2024-07-05T16:00:00+00:00" start_time_confirmed="true" date_confirmed="true" order="1"/>
              </sport_events>
              <linked_cup_rounds>
                <cup_round id="sr:cup_round:1984283" type="child" name="round_of_16" order="1" state="winner" winner_id="sr:competitor:4698"/>
                <cup_round id="sr:cup_round:1984285" type="child" name="round_of_16" order="2" state="winner" winner_id="sr:competitor:4711"/>
                <cup_round id="sr:cup_round:1984307" type="parent" name="semifinal" order="1" state="winner" winner_id="sr:competitor:4698"/>
              </linked_cup_rounds>
            </cup_round>
            <!-- remaining round_of_16, quarterfinal, semifinal and final rounds omitted for brevity -->
          </cup_rounds>
        </group>
      </groups>
    </stage>
  </stages>
</season_stages_groups_cup_rounds>
```

<br />

  ### Reading Cup Round State

  Season Links exposes a `cup_round.state` that signals how complete a matchup is. For example:

  * `empty`: A matchup has been created but neither the match details nor the competitors are known
  * `unseeded_fixture`: Match details are known but the competitors are not yet determined
  * `winner`: The matchup is resolved; `winner_id` identifies the advancing competitor

  Use the unresolved states to render placeholder matchups (for example "TBD vs. TBD") before the bracket is fully populated, and `winner` to fill in results as rounds conclude.

<br />

### 6. Keep Standings Current

Standings change as matches are played, so refresh them off events rather than re-pulling on a fixed timer. Sport Events Updated returns the sport events that have changed recently, each with an `updated_at` timestamp:

```json Sport Events Updated Snippet (json)
{
  "generated_at": "2026-06-04T23:15:44+00:00",
  "sport_events_updated": [
    {
      "id": "sr:sport_event:71355914",
      "updated_at": "2026-06-04T23:14:47+00:00"
    },
    {
      "id": "sr:sport_event:68158874",
      "updated_at": "2026-06-04T23:14:45+00:00"
    },
    {
      "id": "sr:sport_event:68158900",
      "updated_at": "2026-06-04T23:14:39+00:00"
    }
  ]
}
```

Poll this feed on a short interval (roughly every 30 to 60 seconds, and follow the per-feed [update frequencies](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies)), collect the changed `id` values, map each to its season, and re-pull Season Standings only for the affected seasons rather than every season on every tick. While a match is in progress in a `standings="live"` competition, refresh that season more aggressively, since its table recalculates in-play.

<br />

***

## Displaying FIFA Rankings

The FIFA Rankings feed carries the official FIFA World Rankings for national teams, a natural companion to the club tables above in a rankings hub. It is part of the **Soccer Extended API**, so requests go to the `soccer-extended` base URL rather than the base URL used elsewhere in this scenario:

```http
GET https://api.sportradar.com/soccer-extended/trial/v4/en/fifa_rankings.json
x-api-key: YOUR_API_KEY
```

Each ranking list carries a `gender` marker and a `competitor_rankings` array ordered by `rank`. Every entry pairs a national team with its current `points`, its `previous_points` from the prior rankings update, its `movement` compared to that update, and a `last_updated` timestamp. The response below is trimmed to the top three entries of the men's list:

```json FIFA Rankings (json)
{
  "generated_at": "2026-07-28T08:55:13+00:00",
  "rankings": [
    {
      "gender": "men",
      "competitor_rankings": [
        {
          "rank": 1,
          "movement": 0,
          "points": 1995.9,
          "competitor": {
            "id": "sr:competitor:4698",
            "name": "Spain",
            "country": "Spain",
            "country_code": "ESP",
            "abbreviation": "ESP",
            "gender": "male"
          },
          "previous_points": 1995.9,
          "last_updated": "2026-07-28 08:54:50"
        },
        {
          "rank": 2,
          "movement": 0,
          "points": 1970.4,
          "competitor": {
            "id": "sr:competitor:4819",
            "name": "Argentina",
            "country": "Argentina",
            "country_code": "ARG",
            "abbreviation": "ARG",
            "gender": "male"
          },
          "previous_points": 1970.4,
          "last_updated": "2026-07-28 08:54:50"
        },
        {
          "rank": 3,
          "movement": 0,
          "points": 1949,
          "competitor": {
            "id": "sr:competitor:4481",
            "name": "France",
            "country": "France",
            "country_code": "FRA",
            "abbreviation": "FRA",
            "gender": "male"
          },
          "previous_points": 1949,
          "last_updated": "2026-07-28 08:54:50"
        }
      ]
    }
  ]
}
```

To fold the rankings into your display:

* Use `rank` for position and `movement` as a rise or fall indicator relative to the previous rankings update
* Pair `points` with `previous_points` to show how a team's ranking points changed
* Read `last_updated` to date each entry, and pull on an as-needed basis (see the [update frequencies](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies) chart)

<br />

***

## Errors & Rate Limits

**Authentication failures** return `403` with an HTML body, not a JSON error object, so branch on the status code rather than parsing the response. A missing, invalid, or wrong-tier `x-api-key` returns:

```http
HTTP/1.1 403 Forbidden

      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Authentication Error</title>
        </head>
        <body>
          <p>Authentication Error</p>
        </body>
      </html>
```

A couple of other failure modes to handle:

* **Rate limits** apply per key; trial keys allow roughly one request per second. Exceeding the limit returns `429 Too Many Requests`, so space out calls and retry with exponential backoff.
* **Unsupported standings** are not an error. If a competition's Season Info omits a `standings` coverage value, expect an empty `standings` set rather than a table, so confirm coverage (Step 1) and guard for missing data before rendering.

<br />

***

## Best Practices

* Default to **Season Standings** when building standings tables since it already includes qualification outcome and position-change fields along with record context.
* Use **Season Form Standings** for lightweight form-guide widgets where the full record breakdown is unnecessary.
* Iterate every `group` node and respect the `type` split (`total`, `home`, `away`); do not assume a competition has a single table.
* Treat `current_outcome` as **optional** display metadata (badges, colors, tooltips); it appears only on rows with an outcome and can reflect cup-route qualification outside league order. Competitive ordering should always be driven by `rank`, `points`, and `goals_diff`.
* Respect the `live` flag; provisional live standings settle to the confirmed table once matches conclude.
* Use Season Info to confirm standings coverage before requesting tables, especially for lower-tier or cup competitions.
* Use Sport Events Updated to monitor changed matches and refresh standings efficiently.
