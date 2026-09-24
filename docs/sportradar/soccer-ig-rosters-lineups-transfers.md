---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.193Z
---
# Rosters, Lineups, and Transfers

## Prerequisite - Accessing Available Seasons

Understanding which seasons are available—and what [level of data coverage is provided](https://developer.sportradar.com/soccer/docs/soccer-ig-data-availability-coverage)—is essential for making reliable and accurate API calls.

* Use the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed to view all available seasons for each competition in the API.
* Reference the [Coverage Matrix](https://coverage-matrix.sportradar.com/) to determine the depth of coverage by competition tier (Tier 1–9).
* Use the [Season Info](https://developer.sportradar.com/soccer/reference/soccer-season-info) feed to confirm what data is available for a given season of the target competition (e.g., player transfers, team squads, stats levels).

Validating coverage and season availability early can help prevent errors and streamline your data integration process.

<br />

***

## Overview

Rosters, lineups, and transfers are key building blocks for delivering accurate and dynamic team and player data in your soccer applications:

* **[Rosters](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers#rosters)** list all players registered to a team for a season or competition—ideal for team profiles and player lookup.

* **[Lineups](http://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers#lineups)** show starting players and substitutes for a match, used to display formations, track subs, and analyze tactics.

* **[Transfers](https://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers#transfers)** record player movements between clubs, impacting roster data and long-term player history.

* **[Missing Players and Injuries](http://developer.sportradar.com/soccer/docs/soccer-ig-rosters-lineups-transfers#missing-players-and-injuries)** identify which players are unavailable for a given match due to suspension, injury, or other reasons—helpful for match previews, fantasy decisions, and squad analysis.

Together, these data types support match previews, live coverage, squad management, and historical insights. The scenarios below show how to use them in practice.

  ### Data Availability Timing

  For information on when roster, lineup, and transfer data is added to the API for Tier 1 competitions and seasons, visit the [**Update Frequencies**](https://developer.sportradar.com/soccer/docs/soccer-ig-update-frequencies) page. This page will soon be expanded to include data update timeframes for additional tiers.

  ### Understand Every Data Point

  To view all possible data fields returned by an endpoint, including definitions, refer to the Data Points table for that specific endpoint. For example, see the data points for the **[Season Competitor Players](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-players)** endpoint. These tables are especially helpful for understanding the full range of values you may encounter and for planning your integration accordingly.

  For a complete view of all data fields available across the API, visit the Statistics Summary page for your chosen API. See statistics summaries for:

- **[Soccer](https://developer.sportradar.com/soccer/reference/soccer-statistics-summary)**
- **[Soccer Extended](https://developer.sportradar.com/soccer/reference/soccer-extended-statistics-summary)**

<br />

***

## Rosters

You can use the following feeds to access team roster data:

* [Competitor Profile](https://developer.sportradar.com/soccer/reference/soccer-competitor-profile) – Provides top-level information for a given team, including the full team roster, manager, home venue, and team colors.
* [Seasonal Competitor Players](https://developer.sportradar.com/soccer/reference/soccer-seasonal-competitor-players) – Provides player roster information for every team from a given season.
  **Note**: The Seasonal Competitor Players endpoint offers a more efficient way to access roster data; however, unlike the Competitor Profile feed, it returns data for all teams rather than a specific one.

```
<TutorialTile backgroundColor="#b6babd" emoji="👕" id="6882516dc1372d7bf2a43b33" link="https://developer.sportradar.com/v4/recipes/acess-rosters-for-a-specific-team" slug="acess-rosters-for-a-specific-team" title="Acess Rosters for a Specific Team" />
<TutorialTile backgroundColor="#52c2ec" emoji="🏃‍♂️" id="688222d836f652a1ba77f2e9" link="https://developer.sportradar.com/v4/recipes/access-rosters-for-all-teams-in-a-season" slug="access-rosters-for-all-teams-in-a-season" title="Access Rosters for All Teams in a Season" />
```

<details>
  <summary>Competitor Profile Response Example</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<competitor_profile
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T09:12:00+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/competitor_profile.xsd">
	<competitor id="sr:competitor:2502" name="DC United" short_name="DC United" country="USA" country_code="USA" abbreviation="DC" gender="male"/>
	<category id="sr:category:26" name="USA" country_code="USA"/>
	<sport id="sr:sport:1" name="Soccer"/>
	<jerseys>
		<jersey type="home" base="000000" sleeve="ff0000" number="ffffff" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="away" base="f4f1ea" sleeve="f4f1ea" number="ab7f68" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="goalkeeper" base="7cc2ee" sleeve="7cc2ee" number="101b3c" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="third" base="2b2156" sleeve="8affca" number="69fac8" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
	</jerseys>
	<manager id="sr:player:3022414" name="Flanagan, Kevin" nationality="United states" country_code="USA" gender="male"/>
	<venue id="sr:venue:27207" name="Audi Field" capacity="20000" city_name="Washington, D.C." country_name="USA" map_coordinates="38.8689,-77.0129" country_code="USA" timezone="America/New_York"/>
	<players>
		<player id="sr:player:45970" name="Benteke, Christian" type="forward" date_of_birth="1990-12-03" nationality="Belgium" country_code="BEL" height="190" weight="83" jersey_number="20" preferred_foot="right" place_of_birth="Kinshasa" gender="male"/>
		<player id="sr:player:772907" name="Rowles, Kye" type="defender" date_of_birth="1998-06-24" nationality="Australia" country_code="AUS" height="185" weight="76" jersey_number="15" preferred_foot="left" gender="male"/>
		<player id="sr:player:808422" name="Leal, Randall" type="midfielder" date_of_birth="1997-01-14" nationality="Costa rica" country_code="CRI" height="169" weight="70" jersey_number="11" preferred_foot="right" gender="male"/>
		<player id="sr:player:813960" name="Badji, Dominique" type="forward" date_of_birth="1992-10-16" nationality="Senegal" country_code="SEN" height="183" weight="79" jersey_number="14" preferred_foot="left" gender="male"/>
		<player id="sr:player:1134267" name="Herrera, Aaron" type="defender" date_of_birth="1997-06-06" nationality="Guatemala" country_code="GTM" height="180" weight="73" jersey_number="22" preferred_foot="right" gender="male"/>
		<player id="sr:player:1388005" name="Servania, Brandon" type="midfielder" date_of_birth="1999-03-12" nationality="United states" country_code="USA" height="179" weight="73" jersey_number="23" preferred_f
... (example cut here; 7 KB in the source page)
```
```json JSON
{
  "generated_at": "2025-07-24T22:25:05+00:00",
  "competitor": {
    "id": "sr:competitor:2502",
    "name": "DC United",
    "short_name": "DC United",
    "country": "USA",
    "country_code": "USA",
    "abbreviation": "DC",
    "gender": "male"
  },
  "category": {
    "id": "sr:category:26",
    "name": "USA",
    "country_code": "USA"
  },
  "sport": {
    "id": "sr:sport:1",
    "name": "Soccer"
  },
  "jerseys": [
    {
      "type": "home",
      "base": "000000",
      "sleeve": "ff0000",
      "number": "ffffff",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    },
    {
      "type": "away",
      "base": "f4f1ea",
      "sleeve": "f4f1ea",
      "number": "ab7f68",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    },
    {
      "type": "goalkeeper",
      "base": "7cc2ee",
      "sleeve": "7cc2ee",
      "number": "101b3c",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    },
    {
      "type": "third",
      "base": "2b2156",
      "sleeve": "8affca",
      "number": "69fac8",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    }
  ],
  "manager": {
    "id": "sr:player:3022414",
    "name": "Flanagan, Kevin",
    "nationality": "United states",
    "country_code": "USA",
    "gender": "male"
  },
  "venue": {
    "id": "sr:venue:27207",
    "name": "Audi Field",
    "capacity": 20000,
    "city_name": "Washington, D.C.",
    "country_name": "USA",
    "map_coordinates": "38.8689,-77.0129",
    "country_code": "USA",
    "timezone": "America/New_York"
  },
  "players": [
    {
      "id": "sr:player:45970",
      "name": "Benteke, Christian",
      "type": "forward",
      "date_of_birth": "1990-12-03",
      "nationality": "Belgium",
      "country_code": "BEL",
      "height": 190,
      "weight": 83,
      "jersey_number": 20,
      "preferred_foot": "right",
      "place_of_birth": "Kinshasa",
      "gender": "male"
    },
    {
      "id": "sr:player:772907",
      "name": "Rowles, Kye",
      "type": "defender",
      "date_of_birth": "1998-06-24",
      "nationality": "Australia",
      "country_code": "AUS",
      "height": 185,
      "weight": 76,
      "jersey_number": 15,
      "preferred_foot": "left",
      "gender": "male"
    },
    {
      "id": "sr:player:808422",
      "name": "Leal, Randall",
      "type": "midfielder",
      "date_of_birth": "1997-01-14",
      "nationality": "Costa rica",
      "country_code": "CRI",
      "height": 169,
      "weight": 70,
      "jersey_number": 11,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:813960",
      "name": "Badji, Dominique",
      "type": "forward",
      "date_of_birth": "1992-10-16",
      "nationality": "Senegal",
      "country_code": "SEN",
      "height": 183,
      "weight": 79,
      "jersey_number": 14,
      "preferred_foot": "left",
      "gender": "male"
    },
    {
      "id": "sr:player:1134267",
      "name": "Herrera, Aaron",
      "type": "defender",
      "date_of_birth": "1997-06-06",
      "nationality": "Guatemala",
      "country_code": "GTM",
      "height": 180,
      "weight": 73,
      "jersey_number": 22,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:1388005",
      "name": "Servania, Brandon",
      "type": "midfielder",
      "date_of_birth": "1999-03-12",
      "nationality": "United states",
      "country_code": "USA",
      "height": 179,
      "weight": 73,
      "jersey_number": 23,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:1423183",
      "name": "Schnegg, David",
      "type": "defender",
      "date_of_birth": "1998-09-29",
      "nationality": "Austria",
      "country_code": "AUT",
      "height": 185,
      "weight": 80,
      "jersey_number": 28,
      "preferred_foot": "left",
      "gender": "male"
    },
    {
      "id": "sr:player:1557205",
      "name": "Peltola, Matti",
      "type": "defender",
      "date_of_birth": "2002-07-03",
      "nationality": "Finland",
      "country_code": "FIN",
      "height": 185,
      "weight": 75,
      "jersey_number": 4,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:1626872",
      "name": "Enow, Boris",
      "type": "midfielder",
      "date_of_birth": "2000-03-30",
      "nationality": "Cameroon",
      "country_code": "CMR",
      "height": 175,
      "weight": 65,
      "jersey_number": 6,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:1709887",
      "name": "Barraza, Luis",
      "type": "goalkeeper",
      "date_of_birth": "1996-11-08",
      "nationality": "United states",
      "country_code": "USA",
      "height": 188,
      "weight": 88,
      "jersey_number": 13,
      "gender": "male"
    },
    {
      "id": "sr:player:1882892",
      "name": "Stroud, Jared",
      "type": "midfielder",
      "date_of_birth": "1996-07-10",
      "nationality": "United states",
      "country_code": "USA",
      "height": 178,
      "weight": 72,
      "jersey_number": 8,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:1957251",
      "name": "Peglow",
      "type": "forward",
      "date_of_birth": "2002-01-07",
      "nationality": "Brazil",
      "country_code": "BRA",
      "height": 172,
      "weight": 67,
      "jersey_number": 7,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:1957963",
      "name": "Joon-hong, Kim",
      "type": "goalkeeper",
      "date_of_birth": "2003-06-03",
      "nationality": "Korea, republic of",
      "country_code": "KOR",
      "height": 190,
      "weight": 85,
      "jersey_number": 1,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2077049",
      "name": "Pirani, Gabriel",
      "type": "midfielder",
      "date_of_birth": "2002-04-12",
      "nationality": "Brazil",
      "country_code": "BRA",
      "height": 170,
      "weight": 64,
      "jersey_number": 10,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2106854",
      "name": "Zouhir, Rida",
      "type": "midfielder",
      "date_of_birth": "2003-11-23",
      "nationality": "Canada",
      "country_code": "CAN",
      "height": 155,
      "weight": 72,
      "jersey_number": 44,
      "gender": "male"
    },
    {
      "id": "sr:player:2119488",
      "name": "Dodson, Derek",
      "type": "forward",
      "date_of_birth": "1998-11-03",
      "nationality": "United states",
      "country_code": "USA",
      "height": 183,
      "weight": 77,
      "jersey_number": 18,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2254209",
      "name": "MacNaughton, Lukas",
      "type": "defender",
      "date_of_birth": "1995-03-08",
      "nationality": "Canada",
      "country_code": "CAN",
      "height": 185,
      "weight": 84,
      "jersey_number": 5,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2302429",
      "name": "Bartlett, Lucas",
      "type": "defender",
      "date_of_birth": "1997-07-26",
      "nationality": "United states",
      "country_code": "USA",
      "height": 190,
      "weight": 91,
      "jersey_number": 3,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2334049",
      "name": "Hopkins, Jackson",
      "type": "midfielder",
      "date_of_birth": "2004-07-01",
      "nationality": "United states",
      "country_code": "USA",
      "height": 188,
      "weight": 74,
      "jersey_number": 25,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2431807",
      "name": "Fletcher, Kristian George",
      "type": "forward",
      "date_of_birth": "2005-08-06",
      "nationality": "United states",
      "country_code": "USA",
      "height": 183,
      "weight": 79,
      "jersey_number": 27,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2745367",
      "name": "Tubbs, Garrison Isaiah",
      "type": "defender",
      "date_of_birth": "2002-02-17",
      "nationality": "United states",
      "country_code": "USA",
      "height": 189,
      "weight": 79,
      "jersey_number": 16,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2748501",
      "name": "Murrell, Jacob",
      "type": "forward",
      "date_of_birth": "2004-03-29",
      "nationality": "United states",
      "country_code": "USA",
      "height": 188,
      "weight": 79,
      "jersey_number": 17,
      "preferred_foot": "right",
      "gender": "male"
    },
    {
      "id": "sr:player:2748855",
      "name": "Kijima, Hosei",
      "type": "midfielder",
      "date_of_birth": "2002-07-01",
      "nationality": "Japan",
      "country_code": "JPN",
      "height": 178,
      "weight": 73,
      "jersey_number": 77,
      "gender": "male"
    },
    {
      "id": "sr:player:2768193",
      "name": "Antley, William Conner",
      "type": "defender",
      "date_of_birth": "1995-03-22",
      "nationality": "United states",
      "country_code": "USA",
      "height": 185,
      "jersey_number": 12,
      "gender": "male"
    },
    {
      "id": "sr:player:2947771",
      "name": "Farr, Jordan",
      "type": "goalkeeper",
      "date_of_birth": "1994-10-05",
      "nationality": "United states",
      "country_code": "USA",
      "height": 185,
      "jersey_number": 24,
      "gender": "male"
    },
    {
      "id": "sr:player:2947773",
      "name": "Turner, Gavin",
      "type": "midfielder",
      "date_of_birth": "2007-01-05",
      "nationality": "United states",
      "country_code": "USA",
      "height": 173,
      "jersey_number": 48,
      "preferred_foot": "both",
      "gender": "male"
    }
  ]
}
```

This example from the Competitor Profile endpoint shows how to access detailed roster data for a specific team, such as DC United. Each player entry includes key attributes like position (type), date of birth, nationality, jersey number, height, weight, and preferred foot. You’ll also get team-level context like manager, venue, and jersey details.

</details>

<details>
  <summary>Seasonal Competitor Players Response Snippet</summary>

## Rosters (continued)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_competitor_players
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T09:29:47+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_competitor_players.xsd">
	<competitor id="sr:competitor:2502" name="DC United" short_name="DC United" abbreviation="DC">
		<players>
			<player id="sr:player:45970" name="Benteke, Christian" type="forward" date_of_birth="1990-12-03" nationality="Belgium" country_code="BEL" height="190" weight="83" jersey_number="20" preferred_foot="right" place_of_birth="Kinshasa"/>
			<player id="sr:player:772907" name="Rowles, Kye" type="defender" date_of_birth="1998-06-24" nationality="Australia" country_code="AUS" height="185" weight="76" jersey_number="15" preferred_foot="left"/>
			<player id="sr:player:808422" name="Leal, Randall" type="midfielder" date_of_birth="1997-01-14" nationality="Costa rica" country_code="CRI" height="169" weight="70" jersey_number="11" preferred_foot="right"/>
			<player id="sr:player:813960" name="Badji, Dominique" type="forward" date_of_birth="1992-10-16" nationality="Senegal" country_code="SEN" height="183" weight="79" jersey_number="14" preferred_foot="left"/>
			<player id="sr:player:1134267" name="Herrera, Aaron" type="defender" date_of_birth="1997-06-06" nationality="Guatemala" country_code="GTM" height="180" weight="73" jersey_number="22" preferred_foot="right"/>
			<player id="sr:player:1388005" name="Servania, Brandon" type="midfielder" date_of_birth="1999-03-12" nationality="United states" country_code="USA" height="179" weight="73" jersey_number="23" preferred_foot="right"/>
			<player id="sr:player:1423183" name="Schnegg, David" type="defender" date_of_birth="1998-09-29" nationality="Austria" country_code="AUT" height="185" weight="80" jersey_number="28" preferred_foot="left"/>
			<player id="sr:player:1557205" name="Peltola, Matti" type="defender" date_of_birth="2002-07-03" nationality="Finland" country_code="FIN" height="185" weight="75" jersey_number="4" preferred_foot="right"/>
			<player id="sr:player:1626872" name="Enow, Boris" type="midfielder" date_of_birth="2000-03-30" nationality="Cameroon" country_code="CMR" height="175" weight="65" jersey_number="6" preferred_foot="right"/>
			<player id="sr:player:1709887" name="Barraza, Luis" type="goalkeeper" date_of_birth="1996-11-08" nationality="United states" country_code="USA" height="188" weight="88" jersey_number="13"/>
			<player id="sr:player:1882892" name="Stroud, Jared" type="midfielder" date_of_birth="1996-07-10" nationality="United states" country_code="USA" height="178" weight="72" jersey_number="8" preferred_foot="right"/>
			<player id="sr:player:1957251" name="Peglow" type="forward" date_of_birth="2002-01-07" nationality="Brazil" country_code="BRA" height="172" weight="67" jersey_number="7" preferred_foot="right"/>
			<player id="sr:player:1957963" name="Joon-hong, Kim" type="goalkeeper" date_of_birth="2003-06-03" nationality="Korea, republic of" country_code="KOR" height="190" weight="85" jersey_number="1" preferred_foot="right"/>
			<player id="sr:player:2077049" name="Pirani, Gabriel" type="midfielder" date_of_birth="2002-04-12" nationality="Brazil" country_code="BRA" height="170" weight="64" jersey_number="10" preferred_foot="right"/>
			<player id="sr:player:2106854" name="Zouhir, Rida" type="midfielder" date_of_birth="2003-11-23" nationality="Canada" country_code="CAN" height="155" weight="72" jersey_number="44"/>
			<player id="sr:player:2119488" name="Dodson, Derek" type="forward" date_of_birth="1998-11-03" nationality="United states" country_code="USA" height="183" weight="77" jersey_number="18" preferred_foot="right"/>
			<player id="sr:player:2254209" name="MacNaughton, Lukas" type="defender" date_of_birth="1995-03-08" nationality="Canada" country_code="CAN" height="185" weight="84" jersey_number="5" preferred_foot="right"/>
			<player id="sr:player:2302429" name="Bartlett, Lucas" type="defender" date_of_birth="1997-07-26" nationality="United states" country_code="USA" height="190" weight="91" jersey_number="3" preferred_foot="right"/>
			<player id="sr:player:2334049" name="Hopkins, Jackson" type="midfielder" date_of_birth="2004-07-01" nationality="United states" country_code="USA" height="188" weight="74" jersey_number="25" preferred_foot="right"/>
			<player id="sr:player:2431807" name="Fletcher, Kristian George" type="forward" date_of_birth="2005-08-06" nationality="United states" country_code="USA" height="183" weight="79" jersey_number="27" preferred_foot="right"/>
			<player id="sr:player:2745367" name="Tubbs, Garrison Isaiah" type="defender" date_of_birth="2002-02-17" nationality="United states" country_code="USA" height="189" weight="79" jersey_number="16" preferred_foot="right"/>
			<player id="sr:player:2748501" name="Murrell, Jacob" type="forward" date_of_birth="2004-03-29" nationality="United states" country_code="USA" height="188" weight="79" jersey_number="17" preferred_foot="right"/>
			<player id="sr:player:2748855" name="Kijima, Hosei" type="midfielder" date_of_birth="2002-07-01" nationality="Japan" country_code="JPN" height="178" weight="73" jersey_number="77"/>
			<player id="sr:player:2768193" name="Antley, William Conner" type="defender" date_of_birth="1995-03-22" nationality="United states" country_code="USA" height="185" jersey_number="12"/>
			<player id="sr:player:2947771" name="Farr, Jordan" type="goalkeeper" date_of_birth="1994-10-05" nationality="United states" country_code="USA" height="185" jersey_number="24"/>
			<player id="sr:player:2947773" name="Turner, Gavin" type="midfielder" date_of_birth="2007-01-05" nationality="United states" country_code="USA" height="173" jersey_number="48" preferred_foot="both"/>
		</players>
	</competitor>
	<competitor id="sr:competitor:2504" name="Columbus Crew" short_name="Columbus" abbreviation="CLB">
		<players>
			<player id="sr:player:135777" name="Camacho, Rudy" type="defender" date_of_birth="1991-03-05" nationality="France" country_code="FRA" height="185" weight="79" jersey_number="4" preferred_foot="right"/>
			<player id="sr:player:149026" name="Nagbe, Darlington" type="midfielder" date_of_birth="1990-07-19" nationality="United states" country_code="USA" height="179" weight="75" jersey_number="6" preferred_foot="right"/>
			<player id="sr:player:223944" name="Bush, Evan" type="goalkeeper" date_of_birth="1986-03-06" nationality="United states" country_code="USA" height="188" weight="84" jersey_number="24" preferred_foot="right"/>
			<player id="sr:player:284605" name="Gazdag, Daniel" type="midfielder" date_of_birth="1996-03-02" nationality="Hungary" country_code="HUN" height="178" weight="76" jersey_number="8" preferred_foot="right" place_of_birth="Nyiregyhaza"/>
			<player id="sr:player:287833" name="Moreira, Steven" type="defender" date_of_birth="1994-08-13" nationality="Cape verde" country_code="CPV" height="179" weight="75" jersey_number="31" preferred_foot="right" place_of_birth="Noisy le Grand"/>
			<player id="sr:player:755474" name="Cheberko, Yevhen" type="defender" date_of_birth="1998-01-23" nationality="Ukraine" country_code="UKR" height="184" weight="66" jersey_number="21" preferred_foot="left"/>
			<player id="sr:player:792057" name="Hagen, Nicholas" type="goalkeeper" date_of_birth="1996-08-02" nationality="Guatemala" country_code="GTM" height="193" weight="80" jersey_number="1" preferred_foot="right"/>
			<player id="sr:player:856862" name="Lappalainen, Lassi" type="midfielder" date_of_birth="1998-08-24" nationality="Finland" country_code="FIN" height="184" weight="80" jersey_number="26" preferred_foot="both"/>
			<player id="sr:player:861432" name="Amundsen, Malte" type="defender" date_of_birth="1998-02-11" nationality="Denmark" country_code="DNK" height="179" weight="81" jersey_number="18" preferred_foot="left"/>
			<player id="sr:player:919602" name="Romero, Abraham" type="goalkeeper" date_of_birth="1998-02-18" nationality="Mexico" country_code="MEX" height="188" weight="86" jersey_number="22" preferred_foot="right"/>
			<player id="sr:player:962435" name="Rossi, Diego" type="forward" date_of_birth="1998-03-05" nationality="Uruguay" country_code="URY" height="170" weight="66" jersey_number="10" preferred_foot="right"/>
			<player id="sr:player:1011615" name="Jones, Derrick" type="midfielder" date_of_birth="1997-03-03" nationality="United states" country_code="USA" height="190" weight="75" jersey_number="20" preferred_foot="right"/>
			<player id="sr:player:1244748" name="Chambost, Dylan" type="midfielder" date_of_birth="1997-08-19" nationality="France" country_code="FRA" height="177" weight="70" jersey_number="7" preferred_foot="left" place_of_birth="Annecy"/>
			<player id="sr:player:1712815" name="Sejdic, Amar" type="midfielder" date_of_birth="1996-11-29" nationality="United states" country_code="USA" height="179" weight="72" jersey_number="14"/>
			<player id="sr:player:1736977" name="Aliyu, Ibrahim" type="forward" date_of_birth="2002-01-16" nationality="Nigeria" country_code="NGA" height="184" weight="77" jersey_number="11" preferred_foot="right"/>
			<player id="sr:player:1957289" name="Russell-Rowe, Jacen" type="forward" date_of_birth="2002-09-13" nationality="Canada" country_code="CAN" height="183" weight="84" jersey_number="19" preferred_foot="both"/>
			<player id="sr:player:2139054" name="Farsi, Mohamed" type="defender" date_of_birth="1999-12-16" nationality="Algeria" country_code="DZA" height="180" weight="85" jersey_number="23" preferred_foot="right"/>
			<player id="sr:player:2286841" name="Zawadzki, Sean" type="midfielder" date_of_birth="2000-04-21" nationality="United states" country_code="USA" height="175" weight="72" jersey_number="25" preferred_foot="right"/>
			<player id="sr:player:2302873" name="Schulte, Patrick" type="goalkeeper" date_of_birth="2001-03-13" nationality="United states" country_code="USA" height="190" weight="78" jersey_number="28" preferred_foot="left"/>
			<player id="sr:player:2463263" name="Picard, Hugo" type="midfielder" date_of_birth="2003-05-09" nationality="France" country_code="FRA" height="168" preferred_foot="right"/>
			<player id="sr:player:2563395" name="Arfsten, Max" type="midfielder" date_of_birth="2001-04-19" nationality="United states" country_code="USA" height="185" weight="78" jersey_number="27" preferred_foot="left"/>
			<player id="sr:player:2717274" name="Habroune, Taha" type="midfielder" date_of_birth="2006-02-05" nationality="United states" country_code="USA" height="182" weight="76" jersey_number="16" preferred_foot="right"/>
			<player id="sr:player:2774235" name="Mrowka, Cole" type="midfielder" date_of_birth="2006-04-06" nationality="United states" country_code="USA" height="176" weight="77" jersey_number="29" preferred_foot="both"/>
			<player id="sr:player:2780415" name="Lapkes, Stanislav" type="goalkeeper" date_of_birth="2006-03-03" nationality="Belarus" country_code="BLR" height="194" weight="80" jersey_number="41"/>
			<player id="sr:player:2856091" name="Presthus, Owen" type="defender" date_of_birth="2006-02-21" nationality="United states" country_code="USA" jersey_number="45" preferred_foot="both"/>
			<player id="sr:player:2947765" name="Brown, Tristan" type="defender" date_of_birth="2007-10-17" nationality="United states" country_code="USA" jersey_number="44"/>
			<player id="sr:player:2947767" name="Adams, Chase" type="forward" date_of_birth="2008-04-17" nationality="United states" country_code="USA" jersey_number="46"/>
			<player id="sr:player:2953803" name="Ruvalcaba, Cesar" type="defender" date_of_birth="2001-07-13" nationality="United states" country_code="USA" jersey_number="48"/>
			<player id="sr:player:2960323" name="Pruter, Luke" type="goalkeeper" date_of_birth="2001-09-03" nationality="United states" country_code="USA" height="196" jersey_number="54"/>
		</players>
	</competitor>
	<competitor id="sr:competitor:2505" name="Chicago Fire" short_name="Chicago Fire" abbreviation="CFI">
		<players>
			<player id="sr:player:48896" name="Gonzalez, Omar" type="defender" date_of_birth="1988-10-11" nationality="United states" country_code="USA" height="196" weight="92" jersey_number="34" preferred_foot="right"/>
			<player id="sr:player:155950" name="Acosta, Kellyn" type="midfielder" date_of_birth="1995-07-24" nationality="United states" country_code="USA" height="177" weight="64" jersey_number="23" preferred_foot="right"/>
			<player id="sr:player:328247" name="Zinckernagel, Philip" type="forward" date_of_birth="1994-12-16" nationality="Denmark" country_code="DNK" height="175" weight="70" jersey_number="11" preferred_foot="right"/>
			<player id="sr:player:595576" name="Bamba, Jonathan" type="forward" date_of_birth="1996-03-26" nationality="Cote d ivoire" country_code="CIV" height="175" weight="70" jersey_number="19" preferred_foot="right" place_of_birth="Alfortville"/>
			<player id="sr:player:977319" name="Cuypers, Hugo" type="forward" date_of_birth="1997-02-07" nationality="Belgium" country_code="BEL" height="185" weight="75" jersey_number="9" preferred_foot="right"/>
			<player id="sr:player:1061079" name="Haile-Selassie, Maren" type="midfielder" date_of_birth="1999-03-13" nationality="Switzerland" country_code="CHE" height="176" weight="72" jersey_number="7" preferred_foot="right"/>
			<player id="sr:player:1107259" name="Elliott, Jack" type="defender" date_of_birth="1995-08-25" nationality="England" country_code="ENG" height="195" weight="82" jersey_number="3"/>
			<player id="sr:player:1129445" name="Samuel Rogers" type="defender" date_of_birth="1999-05-17" nationality="United states" country_code="USA" height="191" weight="86" jersey_number="5" preferred_foot="right"/>
			<player id="sr:player:1244404" name="Kouame, Romenique" type="midfielder" date_of_birth="1996-12-17" nationality="Mali" country_code="MLI" height="177" weight="68" jersey_number="6" preferred_foot="left"/>
			<player id="sr:player:1413511" name="Mueller, Chris" type="forward" date_of_birth="1996-08-29" nationality="United states" country_code="USA" height="175" weight="77" jersey_number="8"/>
			<player id="sr:player:1581710" name="Gal, Jeff" type="goalkeeper" date_of_birth="1993-04-06" nationality="United states" country_code="USA" height="187" weight="86" jersey_number="25"/>
			<player id="sr:player:1696483" name="Teran, Carlos" type="defender" date_of_birth="2000-09-24" nationality="Colombia" country_code="COL" height="187" weight="85" jersey_number="4"/>
			<player id="sr:player:1709505" name="Gutman, Andrew" type="defender" date_of_birth="1996-10-02" nationality="United states" country_code="USA" height="180" weight="77" jersey_number="15"/>
			<player id="sr:player:1709725" name="Gasper, Chase" type="defender" date_of_birth="1996-01-25" nationality="United states" country_code="USA" height="183" weight="82" jersey_number="77" preferred_foot="left"/>
			<player id="sr:player:1739999" name="Barlow, Tom" type="forward" date_of_birth="1995-07-08" nationality="United states" country_code="USA" height="188" weight="84" jersey_number="12"/>
			<player id="sr:player:2000063" name="Pineda, Mauricio" type="defender" date_of_birth="1997-10-17" nationality="United states" country_code="USA" height="183" weight="78" jersey_number="22"/>
			<player id="sr:player:2029737" name="Gutierrez, Brian" type="midfielder" date_of_birth="2003-06-17" nationality="United states" country_code="USA" height="178" weight="64" jersey_number="17"/>
			<player id="sr:player:2038487" name="Brady, Chris" type="goalkeeper" date_of_birth="2004-03-03" nationality="United states" country_code="USA" height="190" weight="77" jersey_number="1"/>
			<player id="sr:player:2171752" name="Dean, Jonathan" type="midfielder" date_of_birth="1997-05-15" nationality="United states" country_code="USA" height="173" weight="68" jersey_number="24"/>
			<player id="sr:player:2300773" name="Oregel, Sergio" type="midfielder" date_of_birth="2005-05-16" nationality="United states" country_code="USA" height="175" weight="65" jersey_number="35"/>
			<player id="sr:player:2303651" name="Poreba, David" type="midfielder" date_of_birth="2002-12-01" nationality="United states" country_code="USA" height="182" weight="75" jersey_number="48"/>
			<player id="sr:player:2355153" name="Barroso, Leonardo" type="defender" date_of_birth="2005-06-12" nationality="Portugal" country_code="PRT" height="170" weight="71" jersey_number="2" preferred_foot="both"/>
			<player id="sr:player:2560111" name="Reynolds, Justin" type="defender" date_of_birth="2004-04-08" nationality="United states" country_code="USA" height="175" weight="75" jersey_number="36"/>
			<player id="sr:player:2625901" name="Osorio, Harold" type="midfielder" date_of_birth="2003-08-20" nationality="El salvador" country_code="SLV" height="179" weight="70" jersey_number="45" preferred_foot="right"/>
			<player id="sr:player:2627565" name="Glasgow, Omari" type="midfielder" date_of_birth="2003-11-22" nationality="Guyana" country_code="GUY" height="175" weight="74" jersey_number="26"/>
			<player id="sr:player:2764935" name="D'avilla, Dje" type="midfielder" date_of_birth="2003-05-05" nationality="Cote d ivoire" country_code="CIV" height="191" jersey_number="42"/>
			<player id="sr:player:2767487" name="Dowd, Bryan" type="goalkeeper" date_of_birth="2002-03-08" nationality="United states" country_code="USA" height="190" weight="84" jersey_number="31" preferred_foot="right"/>
			<player id="sr:player:2815259" name="Konincks, Diego Juan" type="defender" date_of_birth="2000-11-30" nationality="Netherlands" country_code="NLD" height="187" weight="76" jersey_number="40" preferred_foot="right"/>
			<player id="sr:player:2831991" name="Shannon, Jaylen" type="defender" date_of_birth="2000-02-10" nationality="United states" country_code="USA" height="187" weight="77" jersey_number="43"/>
			<player id="sr:player:2916995" name="Borso, Dylan" type="midfielder" date_of_birth="2006-06-02" nationality="United states" country_code="USA" height="182" weight="74" jersey_number="27"/>
			<player id="sr:player:2917873" name="Boltz, Dean" type="forward" date_of_birth="2006-06-07" nationality="United states" country_code="USA" height="188" weight="82" jersey_number="28" preferred_foot="right"/>
			<player id="sr:player:2935589" name="Turdean, Robert" type="midfielder" date_of_birth="2010-01-14" nationality="United states" country_code="USA" height="170" weight="75" jersey_number="37"/>
			<player id="sr:player:2947769" name="Williams, Sam" type="midfielder" date_of_birth="2005-03-18" nationality="United states" country_code="USA" height="178" jersey_number="47" preferred_foot="right"/>
			<player id="sr:player:2948031" name="Cupps, Christopher" type="defender" date_of_birth="2008-05-26" nationality="United states" country_code="USA" jersey_number="38"/>
			<player id="sr:player:3005321" name="Shokalook, Jason" type="forward" date_of_birth="2002-09-30" nationality="United states" country_code="USA" height="185" weight="73" jersey_number="44"/>
			<player id="sr:player:3005323" name="Hlyut, Vitaliy" type="forward" date_of_birth="2008-04-29" nationality="Ukraine" country_code="UKR" jersey_number="68" preferred_foot="right"/>
		</players>
	</competitor>
</season_competitor_players>
```
```json
{
  "generated_at": "2025-07-25T08:57:02+00:00",
  "season_competitor_players": [
    {
      "id": "sr:competitor:2502",
      "name": "DC United",
      "short_name": "DC United",
      "abbreviation": "DC",
      "players": [
        {
          "id": "sr:player:45970",
          "name": "Benteke, Christian",
          "type": "forward",
          "date_of_birth": "1990-12-03",
          "nationality": "Belgium",
          "country_code": "BEL",
          "height": 190,
          "weight": 83,
          "jersey_number": 20,
          "preferred_foot": "right",
          "place_of_birth": "Kinshasa"
        },
        {
          "id": "sr:player:772907",
          "name": "Rowles, Kye",
          "type": "defender",
          "date_of_birth": "1998-06-24",
          "nationality": "Australia",
          "country_code": "AUS",
          "height": 185,
          "weight": 76,
          "jersey_number": 15,
          "preferred_foot": "left"
        },
        {
          "id": "sr:player:808422",
          "name": "Leal, Randall",
          "type": "midfielder",
          "date_of_birth": "1997-01-14",
          "nationality": "Costa rica",
          "country_code": "CRI",
          "height": 169,
          "weight": 70,
          "jersey_number": 11,
          "preferred_foot": "right"
        },
        {
          "id": "sr:player:813960",
          "name": "Badji, Dominique",
          "type": "forward",
          "date_of_birth": "1992-10-16",
          "nationality": "Senegal",
          "country_code": "SEN",
          "height": 183,
          "weight": 79,
          "jersey_number": 14,
          "preferred_foot": "left"
        },
        {
          "id": "sr:player:1134267",
          "name": "Herrera, Aaron",
          "type": "defender",
          "date_of_birth": "1997-06-06",
          "nationality": "Guatemala",
          "country_code": "GTM",
          "height": 180,
          "weight": 73,
          "jersey_number": 22,
          "preferred_foot": "right"
        },
        {
          "id": "sr:player:1388005",
          "name": "Servania, Brandon",
          "type": "midfielder",
          "date_of_birth": "1999-03-12",
          "nationality": "United states",
          "country_code": "USA",
          "height": 179,
          "weight": 73,
          "jersey_number": 23,
          "preferred_foot": "right"
        },
        {
          "id": "sr:player:1423183",
          "name": "Schnegg, David",
          "type": "defender",
          "date_of_birth": "1998-09-29",
          "nationality": "Austria",
          "country_code": "AUT",
          "height": 185,
          "weight": 80,
          "jersey_number": 28,
          "preferred_foot": "left"
        },
        {
          "id": "sr:player:1557205",
          "name": "Peltola, Matti",
          "type": "defender",
          "date_of_birth": "2002-07-03",
          "nationality": "Finland",
          "country_code": "FIN",
          "height": 185,
... (example cut here; 31 KB in the source page)
```

The Seasonal Competitor Players endpoint allows you to pull full rosters for every team in a given season, rather than querying each team individually. This is useful when you need to build league-wide features on your platform—like global search, player comparisons, or preloading data for fantasy drafts. You’ll still receive the same detailed player attributes (e.g., position, height, jersey number, preferred foot), just organized by team. This approach can save you time and reduce the number of API calls when working at the season or competition level.

</details>

#### Visualizing Rosters

The following image shows how you can visualize roster data pulled from the *Competitor Profile* endpoint. Each player row reflects fields like `name`, `jersey_number`, `type` (position), `date_of_birth` (used to calculate age), `height`, `weight`, and `preferred_foot`. You can also display the `manager` name above the roster to highlight coaching staff. Use this structure to present the API data in a clean, sortable table for end users.

![](https://files.readme.io/0e6750b3582bac878ef0984c78663715e34731e35292ce6a89672b6e9d8eeb3b-image.png)

  ### Enhance Visuals with the Images API

  Use the **[Images API](https://developer.sportradar.com/images-and-editorials/reference/images-overview)** to integrate team logos, player headshots, and action images into your match experience.

<br />

***



## Lineups

<br />

### Match Lineups

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

### Season Lineups

Season Lineups are match lineups and substitutions for the entire season. You can use the [Season Lineups](https://developer.sportradar.com/soccer/reference/soccer-season-lineups) feed to access this data.

<details>
  <summary>Season Lineups Response Snippet</summary>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_lineups
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T10:16:15+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_lineups.xsd">
	<lineup>
		<sport_event id="sr:sport_event:56690251" start_time="2025-02-22T21:45:00+00:00" start_time_confirmed="true">
			<sport_event_context>
				<sport id="sr:sport:1" name="Soccer"/>
				<category id="sr:category:26" name="USA" country_code="USA"/>
				<competition id="sr:competition:242" name="MLS" gender="men"/>
				<season id="sr:season:127179" name="MLS 2025" start_date="2025-02-22" end_date="2025-12-08" year="2025" competition_id="sr:competition:242"/>
				<stage order="1" type="league" phase="regular season" start_date="2025-02-22" end_date="2025-10-20" year="2025"/>
				<round/>
				<groups>
					<group id="sr:league:89897" name="MLS 2025"/>
					<group id="sr:league:89901" name="MLS 2025, Western Conference" group_name="Western Conference"/>
				</groups>
			</sport_event_context>
			<coverage type="sport_event">
				<sport_event_properties lineups="true" formations="false" venue="true" extended_play_by_play="true" extended_player_stats="true" extended_team_stats="true" lineups_availability="pre" ballspotting="true" commentary="true" fun_facts="true" goal_scorers="true" goal_scorers_live="true" scores="live" game_clock="true" deeper_play_by_play="true" deeper_player_stats="true" deeper_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
			</coverage>
			<competitors>
				<competitor id="sr:competitor:402227" name="Los Angeles FC" country="USA" country_code="USA" abbreviation="LAN" qualifier="home" gender="male"/>
				<competitor id="sr:competitor:41618" name="Minnesota United FC" country="USA" country_code="USA" abbreviation="MIN" qualifier="away" gender="male"/>
			</competitors>
			<venue id="sr:venue:27209" name="BMO Stadium" capacity="22000" city_name="Los Angeles, CA" country_name="USA" map_coordinates="34.012741, -118.284099" country_code="USA" timezone="America/Los_Angeles"/>
			<channels>
				<channel name="FOX US" url="https://www.foxsports.com/presspass/latest-news/weekly-schedule/" country="United States" country_code="USA"/>
				<channel name="Fox Deportes" url="https://www.foxsports.com/presspass/latest-news/weekly-schedule/" country="United States" country_code="USA"/>
				<channel name="Fubo TV" url="https://www.livesoccertv.com/channels/fubo-tv/" country="United States" country_code="USA"/>
				<channel name="Apple TV" country="United States" country_code="USA"/>
			</channels>
			<sport_event_conditions>
				<referees>
					<referee id="sr:referee:1560328" name="Gonzales Jr, Guido" nationality="USA" country_code="USA" type="main_referee"/>
					<referee id="sr:referee:1560854" name="McKay, Ian" nationality="USA
... (example cut here; 30 KB in the source page)
```
```json
{
  "generated_at": "2025-07-25T10:00:31+00:00",
  "lineups": [
    {
      "sport_event": {
        "id": "sr:sport_event:56690251",
        "start_time": "2025-02-22T21:45:00+00:00",
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
              "id": "sr:league:89901",
              "name": "MLS 2025, Western Conference",
              "group_name": "Western Conference"
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
            "id": "sr:competitor:402227",
            "name": "Los Angeles FC",
            "country": "USA",
            "country_code": "USA",
            "abbreviation": "LAN",
            "qualifier": "home",
            "gender": "male"
          },
          {
            "id": "sr:competitor:41618",
            "name": "Minnesota United FC",
            "country": "USA",
            "country_code": "USA",
            "abbreviation": "MIN",
            "qualifier": "away",
            "gender": "male"
          }
        ],
        "venue": {
          "id": "sr:venue:27209",
          "name": "BMO Stadium",
          "capacity": 22000,
... (example cut here; 56 KB in the source page)
```

The Season Lineups endpoint gives you access to confirmed lineups for every match in a given season, grouped by fixture. This is especially helpful when you want to power match previews, and player comparison tools, across all games. You can access complete lineup details including starters, jersey numbers, player positions, and formation types, plus contextual data like match time, venue, and referee assignments. This endpoint is ideal for platforms that support season-long coverage, fan engagement features, or pre-match content automation.

</details>

<br />

***

## Transfers & Loans

### Transfers

We use player profile roles to generate the [Season Transfers](https://developer.sportradar.com/soccer/reference/soccer-season-transfers) endpoint, which lists all player movements for a given season — including permanent transfers and loans. Each record includes the `transfer_date`, player details, and the source and destination teams. This data helps track roster changes, power transfer feeds, and maintain up-to-date team compositions.

Transfers may also include youth players newly added to a squad. If no previous club is found within 10 days, the player is considered a free agent and no `from_competitor` is shown. The `transfer_date` is sourced from multiple providers and may vary in accuracy.

**Update Frequency:** Transfers are typically available within 24 hours of official publication. For active seasons, poll the endpoint hourly or less frequently based on your needs.

### Season Transfers Response Snippet
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <season_transfers
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T10:44:44+00:00"
    xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_transfers.xsd">
    <transfer transfer_date="2025-07-24" role_type="player" from_competitor="sr:competitor:1654" to_competitor="sr:competitor:2504">
        <player id="sr:player:2463263" name="Picard, Hugo" type="midfielder" date_of_birth="2003-05-09" nationality="France" country_code="FRA" height="168" preferred_foot="right"/>
        <competitors>
            <competitor id="sr:competitor:1654" name="EA Guingamp" country="France" country_code="FRA" abbreviation="EAG" gender="male"/>
            <competitor id="sr:competitor:2504" name="Columbus Crew" country="USA" country_code="USA" abbreviation="CLB" gender="male"/>
        </competitors>
    </transfer>
    <transfer transfer_date="2025-07-24" role_type="player" from_competitor="sr:competitor:687" to_competitor="sr:competitor:874725">
        <player id="sr:player:2434773" name="Fall, Fallou" type="defender" date_of_birth="2004-04-15" nationality="Senegal" country_code="SEN" height="192" preferred_foot="left"/>
        <competitors>
            <competitor id="sr:competitor:687" name="Fredrikstad FK" country="Norway" country_code="NOR" abbreviation="FFK" gender="male"/>
            <competitor id="sr:competitor:874725" name="Saint Louis City SC" country="USA" country_code="USA" abbreviation="SAI" gender="male"/>
        </competitors>
    </transfer>
    <transfer transfer_date="2025-07-24" role_type="on_loan" from_competitor="sr:competitor:2685" to_competitor="sr:competitor:22006">
        <player id="sr:player:2155058" name="Gillier, Thomas" type="goalkeeper" date_of_birth="2004-05-28" nationality="Chile" country_code="CHL" height="186" weight="73" preferred_foot="right"/>
        <competitors>
            <competitor id="sr:competitor:2685" name="Bologna FC" country="Italy" country_code="ITA" abbreviation="BFC" gender="male"/>
            <competitor id="sr:competitor:22006" name="CF Montreal" country="Canada" country_code="CAN" abbreviation="MON" gender="male"/>
        </competitors>
    </transfer>
    </season_transfers>
  ```
  ```json
  {
    "generated_at": "2025-07-25T10:33:47+00:00",
    "transfers": [
      {
        "transfer_date": "2025-07-24",
        "role_type": "player",
        "from_competitor": "sr:competitor:1654",
        "to_competitor": "sr:competitor:2504",
        "player": {
          "id": "sr:player:2463263",
          "name": "Picard, Hugo",
          "type": "midfielder",
          "date_of_birth": "2003-05-09",
          "nationality": "France",
          "country_code": "FRA",
          "height": 168,
          "preferred_foot": "right"
        },
        "competitors": [
          {
            "i
... (example cut here; 7 KB in the source page)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<season_missing_players
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-07-25T11:13:00+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_missing_players.xsd">
	<competitors>
		<competitor id="sr:competitor:2502" name="DC United" abbreviation="DC">
			<players>
				<player id="sr:player:45970" name="Benteke, Christian" start_date="2025-07-16T09:55:01+00:00" reason="injured" status="doubtful"/>
				<player id="sr:player:2254209" name="MacNaughton, Lukas" start_date="2025-07-05T12:54:40+00:00" reason="injured" status="doubtful"/>
				<player id="sr:player:2431807" name="Fletcher, Kristian George" start_date="2025-06-28T05:38:38+00:00" reason="injured" status="missing"/>
				<player id="sr:player:2748501" name="Murrell, Jacob" start_date="2025-07-12T13:09:39+00:00" reason="injured" status="doubtful"/>
			</players>
		</competitor>
		<competitor id="sr:competitor:2504" name="Columbus Crew" abbreviation="CLB">
			<players>
				<player id="sr:player:135777" name="Camacho, Rudy" start_date="2025-04-04T06:20:18+00:00" reason="injured" status="missing"/>
				<player id="sr:player:792057" name="Hagen, Nicholas" start_date="2025-07-12T12:28:07+00:00" reason="injured" status="missing"/>
				<player id="sr:player:861432" name="Amundsen, Malte" start_date="2025-06-14T03:33:37+00:00" reason="injured" status="missing"/>
				<player id="sr:player:2139054" name="Farsi, Mohamed" start_date="2025-07-16T08:58:37+00:00" reason="injured" status="doubtful"/>
			</players>
		</competitor>
		<competitor id="sr:competitor:2505" name="Chicago Fire" abbreviation="CFI">
			<players>
				<player id="sr:player:1413511" name="Mueller, Chris" start_date="2025-05-09T14:52:10+00:00" reason="other" status="missing"/>
				<player id="sr:player:1696483" name="Teran, Carlos" start_date="2025-05-03T13:31:30+00:00" reason="injured" status="missing"/>
				<player id="sr:player:2300773" name="Oregel, Sergio" start_date="2025-07-18T14:22:51+00:00" reason="suspended" status="missing"/>
				<player id="sr:player:2303651" name="Poreba, David" start_date="2025-05-03T13:31:22+00:00" reason="injured" status="missing"/>
				<player id="sr:player:2560111" name="Reynolds, Justin" start_date="2025-07-05T13:06:29+00:00" reason="injured" status="missing"/>
				<player id="sr:player:2948031" name="Cupps, Christopher" start_date="2025-07-05T13:06:01+00:00" reason="injured" status="missing"/>
			</players>
		</competitor>
		</season_missing_players>
```
```json
{
  "generated_at": "2025-07-25T11:02:51+00:00",
  "competitors": [
    {
      "id": "sr:competitor:2502",
      "name": "DC United",
      "abbreviation": "DC",
      "players": [
        {
          "id": "sr:player:45970",
          "name": "Benteke, Christian",
          "start_date": "2025-07-16T09:55:01+00:00",
          "reason": "injured",
          "status": "doubtful"
        },
        {
          "id": "sr:player:2254209",
          "name": "MacNaughton, Lukas",
          "start_date": "2025-07-05T12:54:40+00:00",
          "reason": "injured",
          "status": "doubtful"
        },
        {
          "id": "sr:player:2431807",
          "name": "Fletcher, Kristian George",
          "start_date": "2025-06-28T05:38:38+00:00",
          "reason": "injured",
          "status": "missing"
        },
        {
          "id": "sr:player:2748501",
          "name": "Murrell, Jacob",
          "start_date": "2025-07-12T13:09:39+00:00",
          "reason": "injured",
          "status": "doubtful"
        }
      ]
    },
    {
      "id": "sr:competitor:2504",
      "name": "Columbus Crew",
      "abbreviation": "CLB",
      "players": [
        {
          "id": "sr:player:135777",
          "name": "Camacho, Rudy",
          "start_date": "2025-04-04T06:20:18+00:00",
          "reason": "injured",
          "status": "missing"
        },
        {
          "id": "sr:player:792057",
          "name": "Hagen, Nicholas",
          "start_date": "2025-07-12T12:28:07+00:00",
          "reason": "injured",
          "status": "missing"
        },
        {
          "id": "sr:player:861432",
          "name": "Amundsen, Malte",
          "start_date": "2025-06-14T03:33:37+00:00",
          "reason": "injured",
          "status": "missing"
        },
        {
          "id": "sr:player:2139054",
          "name": "Farsi, Mohamed",
          "start_date": "2025-07-16T08:58:37+00:00",
          "reason": "injured",
          "status": "doubtful"
        }
      ]
    },
    {
      "id": "sr:competitor:2505",
      "name": "Chicago Fire",
      "abbreviation": "CFI",
      "players": [
        {
          "id": "sr:player:1413511",
          "name": "Mueller, Chris",
          "start_date": "2025-05-09T14:52:10+00:00",
          "reason": "other",
          "status": "missing"
        },
        {
          "id": "sr:player:1696483",
          "name": "Teran, Carlos",
          "start_date": "2025-05-03T13:31:30+00:00",
          "reason": "injured",
          "status": "missing"
        },
        {
          "id": "sr:player:2300773",
          "name": "Oregel, Sergio",
          "start_date": "2025-07-18T14:22:51+00:00",
          "reason": "suspended",
          "status": "missing"
        },
        {
          "id": "sr:player:2303651",
          "name": "Poreba, David",
          "start_date": "2025-05-03T13:31:22+00:00",
          "reason": "injured",
          "status": "missing"
        },
        {
          "id": "s
... (example cut here; 3 KB in the source page)
```

The Season Missing Players endpoint provides a list of players who are unavailable during the season due to injury, suspension, or other reasons. For each affected player, you'll receive their name, the reason for absence, start date, and current status (e.g., `missing` or `doubtful`). This is especially useful for powering match previews, keeping fantasy users informed, or dynamically adjusting lineups in predictive models. Integrating this data helps keep your platform in sync with real-world availability.

</details>

  ### Estimated Return Dates — Soccer Extended only

  The Soccer Extended version of this endpoint also returns an optional `estimated_return_date` for missing players. It is an ISO 8601 value representing a date only — the time component is always `00:00:00 UTC`.

  Coverage is focused on top leagues and the date is an estimate that may change, so check whether the attribute is present rather than assuming it. A season with `missing_players="true"` coverage does not guarantee it.

#### Visualizing Missing Player Data

This image below shows how you can use the Season Missing Players endpoint to create a clear, user-friendly view of unavailable players. Each row presents the player’s name, nationality, position, and injury status, data all available in the API response. You could further enhance it by filtering by `reason` (e.g., `injured` vs. `suspended`).

![](https://files.readme.io/e5eb84f1c31069440d2cff4c56773c8debf22119525dc6f35c7bb488a4d12bb3-image.png)
