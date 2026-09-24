---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-id-handling
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.192Z
---
# ID Handling

## Intro to IDs

Our Soccer API features a number of unique identifiers. Some IDs are needed to request feeds, while others signify unique data.

IDs can be attributed to competitions, seasons, competitors, players, venues, sport events (matches), referees, and many other variables.

<br />

***

## SR IDs

**SR IDs (Sportradar Identifiers)** is the ID type attributed to a variety of variables in the Soccer API. Other APIs use a combination of SR IDs and UUIDs (see below for more details).

These IDs correlate to our General Sport APIs. They can have a varying structure but always begin with `sr:` and end with a number.

```xml sr_id Sample
<competitor_profile
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-12T16:20:05+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/competitor_profile.xsd">
	<competitor id="sr:competitor:44" name="Liverpool FC" short_name="Liverpool" country="England" country_code="ENG" abbreviation="LFC" gender="male"/>
	<category id="sr:category:1" name="England" country_code="ENG"/>
	<sport id="sr:sport:1" name="Soccer"/>
```

<br />

***

## UUIDs in Other Sportradar Products

UUIDs follow a specific structure: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`

You'll see these UUIDs in league specific APIs like the NFL API shown in the code examples below.

```xml UUID Sample
<team id="c5a59daa-53a7-4de0-851f-fb12be893e9e" name="Lions" market="Detroit" alias="DET" reference="4985" sr_id="sr:competitor:4419"></team>
```

```xml sr_id Sample
<code><competitor id="sr:competitor:4419"  name="Detroit Lions" country="USA" country_code="USA" abbreviation="DET"/></code>
```

These IDs may appear as an `id` or a `sr_id` in various league-specific APIs.

```xml sr_id Sample #2
<code><team id="c5a59daa-53a7-4de0-851f-fb12be893e9e" name="Lions" market="Detroit" alias="DET" reference="4985" sr_id="sr:competitor:4419"/></code>
```

  ### Mappings SR IDs to UUIDs

  Use the [**Mapping API**](https://developer.sportradar.com/odds/reference/mapping-overview) for on-demand, entity-level lookups that translate Soccer SR IDs to external ID systems used by other Sportradar products and partners. The legacy Soccer [**Competitor Mappings**](https://developer.sportradar.com/soccer/reference/soccer-competitor-mappings) and [**Player Mappings**](https://developer.sportradar.com/soccer/reference/soccer-player-mappings) feeds remain available for bulk competitor and player mappings. See the [Mapping API](#mapping-api) section below for details.

<br />

***

## Mapping API

The [**Mapping API**](https://developer.sportradar.com/odds/reference/mapping-overview) provides on-demand, entity-level lookups that translate Soccer SR IDs (for example, `sr:season:131129`) to external ID systems used by other Sportradar products and partners. Rather than paginating through large mapping feeds, submit a supported SR ID and retrieve its mappings in a single targeted request.

> ℹ️ Legacy Soccer Mapping Feeds
>
> The Soccer [**Competitor Mappings**](https://developer.sportradar.com/soccer/reference/soccer-competitor-mappings), [**Player Mappings**](https://developer.sportradar.com/soccer/reference/soccer-player-mappings), [**Competitor Merge Mappings**](https://developer.sportradar.com/soccer/reference/soccer-competitor-merge-mappings), and [**Player Merge Mappings**](https://developer.sportradar.com/soccer/reference/soccer-player-merge-mappings) endpoints remain available and supported. Use the Mapping API for new integrations that need on-demand lookups for specific entities; continue using the legacy feeds when you need bulk mappings or merge history.

<br />

### Soccer-Relevant Endpoints

Each endpoint accepts an SR ID and returns mappings to Sportradar UUIDs by default.

| Mapping Type | Endpoint                        | Input                 |
| :----------- | :------------------------------ | :-------------------- |
| Competition  | Sport Competition Mappings      | `sport_id`            |
| Competitor   | Season Competitor Mappings      | `season_id`           |
| Competitor   | Sport Event Competitor Mappings | `sport_event_id`      |
| Player       | Season Player Mappings          | `season_id`           |
| Player       | Sport Event Player Mappings     | `sport_event_id`      |
| Season       | Competition Season Mappings     | `competition_id`      |
| Sport Event  | Daily Sport Event Mappings      | `sport_id` and `date` |
| Sport Event  | Season Sport Event Mappings     | `season_id`           |
| Sport Event  | Sport Event Mappings            | `sport_event_id`      |

<br />

### Sample Workflow

Link Soccer entities to the IDs used by other Sportradar products or external partners. For example, retrieve partner-specific IDs for every match in a given season.

1. Retrieve a Soccer `season.id` (SR ID) from the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-
... (example cut here; 3 KB in the source page)
```curl Initial Request
curl --location 'https://api.sportradar.com/mapping/trial/v2/en/seasons/sr:season:131129/sport_event_mappings.json?start=0' \
--header 'x-api-key: [YOUR_API_KEY]'
```

```curl Pagination
curl --location 'https://api.sportradar.com/mapping/trial/v2/en/seasons/sr:season:131129/sport_event_mappings.json?start=100' \
--header 'x-api-key: [YOUR_API_KEY]'
```

3. The response maps each Soccer SR ID (`id`) to the corresponding ID in another system (`external_id`).

```json Response Sample
{
  "generated_at": "2026-03-27T20:00:44+00:00",
  "sport_events": [
    {
      "id": "sr:match:63290531",
      "mappings": [
        {
          "bookmaker_id": "sr:book:10358",
          "external_id": "75e97ab9-6335-4320-906a-ed279bd561cb"
        }
      ]
    },
    {
      "id": "sr:match:63290533",
      "mappings": [
        {
          "bookmaker_id": "sr:book:10358",
          "external_id": "f047c913-bdb2-455f-a4c6-fea3ae924d97"
        }
      ]
    }
  ]
}
```

4. Use the returned IDs in the downstream product or system that requires them.

<br />

### Best Practices

* **Cache mappings locally** when your application repeatedly references the same entities. Storing results reduces repeat lookups, improves performance, and lessens dependence on real-time mapping calls.
* **Use entity-level lookups** for known IDs instead of re-fetching full mapping feeds. Request only the IDs you need.
* **Reconcile merged teams and players** using the [Competitor Merge Mappings](https://developer.sportradar.com/soccer/reference/soccer-competitor-merge-mappings) and [Player Merge Mappings](https://developer.sportradar.com/soccer/reference/soccer-player-merge-mappings) endpoints to maintain accurate historical alignment after Sportradar consolidates duplicate entities.
* **Paginate season-level requests** with the `start` or `offset` parameter. Season Sport Event Mappings and similar endpoints return a maximum of 100 records per page.
* **Request additional ID system mappings** by contacting the [Support Team](mailto:support@sportradar.com).

<br />

***

## Soccer IDs in Other Sportradar Products

<br />

### Images & Editorial

Our [Images](https://developer.sportradar.com/images-and-editorials/reference/images-overview) and [Editorial](https://developer.sportradar.com/images-and-editorials/reference/editorial-overview) APIs include both UUID and SR IDs within image and article entries (under `entity_id`). This allows you to sync player, team, and sport event IDs to this content.

```xml Soccer Getty Action Shot Sample (xml)
<assetlist xmlns="http://feed.elasticstats.com/schema/assets/manifest-v2.5.xsd" provider="getty" league="epl" type="actionshot" entity="events" manifest_date="2025-05-22T00:00:22+00:00">
  <asset id="fa5cb7ca-ac9d-4a31-b75c-998928bd31c7" created="2025-05-20T21:59:42+00:00" updated="2025-05-20T21:59:50+00:00">
    <title>
      <![CDATA[Manchester City FC v AFC Bournemouth - Premier League]]>
    </title>
    <description>
      <![CDATA[MANCHESTER, ENGLAND - MAY 20: A fan of Manchester City holds up a banner for Kevin De Bruyne of Manchester City  during the Premier League match between Manchester City FC and AFC Bournemouth at Etihad Stadium on May 20, 2025 in Manchester, England. (Photo by Robbie Jay Barratt - AMA/Getty Images)]]>
    </description>
    <copyright>Getty</copyright>
    <links>
      <link width="5147" height="3431" href="/epl/actionshots/events/2025/5/20/fa5cb7ca-ac9d-4a31-b75c-998928bd31c7/original.jpg"/>
      <link width="1000" height="667" href="/epl/actionshots/events/2025/5/20/fa5cb7ca-ac9d-4a31-b75c-998928bd31c7/h1000-max-resize.jpg"/>
      <link width="500" height="333" href="/epl/actionshots/events/2025/5/20/fa5cb7ca-ac9d-4a31-b75c-998928bd31c7/h500-max-resize.jpg"/>
      <link width="250" height="167" href="/epl/actionshots/events/2025/5/20/fa5cb7ca-ac9d-4a31-b75c-998928bd31c7/h250-max-resize.jpg"/>
    </links>
    <refs>
      <ref name="Bournemouth" type="organization" sport="soccer" sportradar_id="sr:competitor:60">
        <entity_id origin="SR" id="sr:competitor:60" sport="soccer"/>
      </ref>
      <ref name="De Bruyne, Kevin" type="profile" sport="soccer" sportradar_id="sr:player:70996">
        <entity_id origin="SR" id="sr:player:70996" sport="soccer"/>
      </ref>
      <ref name="MCI v BOU - 5/20/2025 - Premier League" type="event" sport="soccer" sportradar_id="sr:match:60367893">
        <entity_id origin="SR" id="sr:match:60367893" sport="soccer"/>
      </ref>
      <ref name="Man City" type="organization" sport="soccer" sportradar_id="sr:competitor:17">
        <entity_id origin="SR" id="sr:competitor:17" sport="soccer"/>
      </ref>
      <ref name="Premier League" type="tournament" sport="soccer" sportradar_id="sr:tournament:17">
        <entity_id origin="SR" id="sr:tournament:17" sport="soccer"/>
      </ref>
    </refs>
    <provider name="getty">
      <provider_item_id>2215589496</provider_item_id>
      <original_publish>2025-05-20T00:00:00+00:00</original_publish>
    </provider>
  </asset>
  <asset id="f62e2a7d-db0e-48ed-b490-e42cde2e6629" created="2025-05-20T23:58:52+00:00" updated="2025-05-20T23:59:28+00:00">
    <title>
      <![CDATA[Crystal Palace FC v Wolverhampton Wanderers FC - Premier League]]>
    </title>
    <description>
      <![CDATA[LONDON, ENGLAND - MAY 20: Joel Ward of Crystal Palace walks out on to the pitch holding the Emirates FA Cup as he is given a guard of honour on to the pitch following his final match at Selhurst Park for Crystal Palace after 13 years at the club after the Premier League match between Crystal Palace FC and Wolverhampton Wanderers FC at Selhurst Park on May 20, 2025 in London, England. Crystal Palace won the Emirates FA Cup last Saturday, after a 1-0 victory in the Final against Manchester City. (Photo by Crystal Pix/MB Media/Getty Images)]]>
    </description>
    <copyright>Getty</copyright>
    <links>
      <link width="8100" height="4830" href="/epl/actionshots/events/2025/5/20/f62e2a7d-db0e-48ed-b490-e42cde2e6629/original.jpg"/>
      <link width="1000" height="596" href="/epl/actionshots/events/2025/5/20/f62e2a7d-db0e-48ed-b490-e42cde2e6629/h1000-max-resize.jpg"/>
      <link width="500" height="298" href="/epl/actionshots/events/2025/5/20/f62e2a7d-db0e-48ed-b490-e42cde2e6629/h500-max-resize.jpg"/>
      <link width="250" height="149" href="/epl/actionshots/events/2025/5/20/f62e2a7d-db0e-48ed-b490-e42cde2e6629/h250-max-resize.jpg"/>
    </links>
    <refs>
      <ref name="Crystal Palace" type="organization" sport="soccer" sportradar_id="sr:competitor:7">
        <entity_id origin="SR" id="sr:competitor:7" sport="soccer"/>
      </ref>
      <ref name="Crystal Palace v Wolverhampton Wanderers (5/20/2025)" type="event" sport="soccer" sportradar_id="sr:match:50850705">
        <entity_id origin="SR" id="sr:match:50850705" sport="soccer"/>
      </ref>
      <ref name="Premier League" type="tournament" sport="soccer" sportradar_id="sr:tournament:17">
        <entity_id origin="SR" id="sr:tournament:17" sport="soccer"/>
      </ref>
      <ref name="Ward, Joel" type="profile" sport="soccer" sportradar_id="sr:player:39183">
        <entity_id origin="SR" id="sr:player:39183" sport="soccer"/>
      </ref>
      <ref name="Wolves" type="organization" sport="soccer" sportradar_id="sr:competitor:3">
        <entity_id origin="SR" id="sr:competitor:3" sport="soccer"/>
      </ref>
    </refs>
    <provider name="getty">
      <provider_item_id>2215592982</provider_item_id>
      <original_publish>2025-05-20T00:00:00+00:00</original_publish>
    </provider>
  </asset>
  <asset id="f6465be0-55d8-436d-9e15-be6d30c90746" created="2025-05-20T20:40:20+00:00" updated="2025-05-20T20:40:26+00:00">
    <title>
      <![CDATA[Manchester City FC v AFC Bournemouth - Premier League]]>
    </title>
    <description>
      <![CDATA[MANCHESTER, ENGLAND - MAY 20: Lewis Cook of Bournemouth receives a red card from Referee Thomas Bramall during the Premier League match between Manchester City FC and AFC Bournemouth at Etihad Stadium on May 20, 2025 in Manchester, England. (Photo by Robbie Jay Barratt - AMA/Getty Images)]]>
    </description>
    <copyright>Getty</copyright>
    <links>
      <link width="3327" height="2218" href="/epl/actionshots/events/2025/5/20/f6465be0-55d8-436d-9e15-be6d30c90746/original.jpg"/>
      <link width="1000" height="667" href="/epl/actionshots/events/2025/5/20/f6465be0-55d8-436d-9e15-be6d30c90746/h1000-max-resize.jpg"/>
      <link width="500" height="333" href="/epl/actionshots/events/2025/5/20/f6465be0-55d8-436d-9e15-be6d30c90746/h500-max-resize.jpg"/>
      <link width="250" height="167" href="/epl/actionshots/events/2025/5/20/f6465be0-55d8-436d-9e15-be6d30c90746/h250-max-resize.jpg"/>
    </links>
    <refs>
      <ref name="Bournemouth" type="organization" sport="soccer" sportradar_id="sr:competitor:60">
        <entity_id origin="SR" id="sr:competitor:60" sport="soccer"/>
      </ref>
      <ref name="Cook, Lewis" type="profile" sport="soccer" sportradar_id="sr:player:548188">
        <entity_id origin="SR" id="sr:player:548188" sport="soccer"/>
      </ref>
      <ref name="MCI v BOU - 5/20/2025 - Premier League" type="event" sport="soccer" sportradar_id="sr:match:60367893">
        <entity_id origin="SR" id="sr:match:60367893" sport="soccer"/>
      </ref>
      <ref name="Man City" type="organization" sport="soccer" sportradar_id="sr:competitor:17">
        <entity_id origin="SR" id="sr:competitor:17" sport="soccer"/>
      </ref>
      <ref name="Premier League" type="tournament" sport="soccer" sportradar_id="sr:tournament:17">
        <entity_id origin="SR" id="sr:tournament:17" sport="soccer"/>
      </ref>
    </refs>
    <provider name="getty">
      <provider_item_id>2215584119</provider_item_id>
      <original_publish>2025-05-20T00:00:00+00:00</original_publish>
    </provider>
  </asset>
```
```xml Soccer Premium Editorial Sample (xml)
<asset id="8b82836f-f4c3-4674-9de6-e8e4374eb3b5" created="2024-05-14T21:07:20+00:00" updated="2024-05-14T21:07:23+00:00">
        <title>
          <![CDATA[Britain Soccer Premier League]]>
        </title>
        <description>
          <![CDATA[Manchester City's Erling Haaland celebrates scoring his side's first goal during the English Premier League soccer match between Tottenham Hotspur and Manchester City at Tottenham Hotspur Stadium in London, Tuesday, May 14, 2024.(AP Photo/Kin Cheung)]]>
        </description>
        <links>
          <link width="3341" height="2227" href="/assets/2024/5/14/8b82836f-f4c3-4674-9de6-e8e4374eb3b5/original.jpg"/>
          <link width="1000" height="667" href="/assets/2024/5/14/8b82836f-f4c3-4674-9de6-e8e4374eb3b5/h1000-max-resize.jpg"/>
        </links>
        <refs>
          <ref name="Haaland, Erling" type="profile" sport="soccer" sportradar_id="sr:player:991181" sportsdata_id="69a62c19-1138-4476-a8d4-86ebb4557044">
            <entity_id origin="SR" id="sr:player:991181" sport="soccer"/>
            <entity_id origin="SD" id="69a62c19-1138-4476-a8d4-86ebb4557044" alt_id="69a62c19-1138-4476-a8d4-86ebb4557044" sport="soccer"/>
          </ref>
          <ref name="Man City" type="organization" sport="soccer" sportradar_id="sr:competitor:17">
            <entity_id origin="SR" id="sr:competitor:17" sport="soccer"/>
          </ref>
        </refs>
      </asset>
      <asset id="8a11af9f-0753-4405-a84b-bdbbdbd3ec17" created="2024-05-14T21:07:21+00:00" updated="2024-05-14T21:07:27+00:00">
        <title>
          <![CDATA[Britain Soccer Premier League]]>
        </title>
        <description>
          <![CDATA[Manchester City's Kevin De Bruyne passes the ball to Manchester City's Erling Haaland during the English Premier League soccer match between Tottenham Hotspur and Manchester City at Tottenham Hotspur Stadium in London, Tuesday, May 14, 2024.(AP Photo/Kin Cheung)]]>
        </description>
        <links>
          <link width="4586" height="3057" href="/assets/2024/5/14/8a11af9f-0753-4405-a84b-bdbbdbd3ec17/original.jpg"/>
          <link width="1000" height="667" href="/assets/2024/5/14/8a11af9f-0753-4405-a84b-bdbbdbd3ec17/h1000-max-resize.jpg"/>
        </links>
        <refs>
          <ref name="De Bruyne, Kevin" type="profile" sport="soccer" sportradar_id="sr:player:70996" sportsdata_id="3e4cd8af-36cd-42b2-a2e0-bd727cc3c37b">
            <entity_id origin="SR" id="sr:player:70996" sport="soccer"/>
            <entity_id origin="SD" id="3e4cd8af-36cd-42b2-a2e0-bd727cc3c37b" alt_id="3e4cd8af-36cd-42b2-a2e0-bd727cc3c37b" sport="soccer"/>
          </ref>
          <ref name="Haaland, Erling" type="profile" sport="soccer" sportradar_id="sr:player:991181" sportsdata_id="69a62c19-1138-4476-a8d4-86ebb4557044">
            <entity_id origin="SR" id="sr:player:991181" sport="soccer"/>
            <entity_id origin="SD" id="69a62c19-1138-4476-a8d4-86ebb455
... (example cut here; 5 KB in the source page)
```

<br />

### Widgets

Our [Soccer Widgets](https://developer.sportradar.com/widgets/docs/soccer-getting-started) often will require the input of a unique match, team, player, or season ID.

<br />

***

## Event (Match) IDs

Each Soccer match will have its own unique identifier under `sport_event_id`. See below for a sample taken from the [Daily Schedules](https://developer.sportradar.com/soccer/reference/soccer-daily-schedules) endpoint.

```xml
<sport_event id="sr:sport_event:57380311" start_time="2025-06-01T00:00:00+00:00" start_time_confirmed="true">
  <sport_event_context>
        <sport id="sr:sport:1" name="Soccer"/>
        <category id="sr:category:49" name="Chile" country_code="CHL"/>
        <competition id="sr:competition:27665" name="Primera Division" parent_id="sr:competition:244" gender="men"/>
        <season id="sr:season:127935" name="Primera Division 2025" start_date="2025-02-15" end_date="2025-12-07" year="2025" competition_id="sr:competition:27665"/>
        <stage order="1" type="league" phase="regular season" start_date="2025-02-15" end_date="2025-12-07" year="2025"/>
        <round number="13"/>
        <groups>
          <group id="sr:league:90581" name="Primera Division 2025"/>
        </groups>
  </sport_event_context>
```
```json JSON

    {
      "sport_event": {
        "id": "sr:sport_event:57380311",
        "start_time": "2025-06-01T00:00:00+00:00",
        "start_time_confirmed": true,
        "sport_event_context": {
          "sport": {
            "id": "sr:sport:1",
            "name": "Soccer"
          },
          "category": {
            "id": "sr:category:49",
            "name": "Chile",
            "country_code": "CHL"
          },
          "competition": {
            "id": "sr:competition:27665",
            "name": "Primera Division",
            "parent_id": "sr:competition:244",
            "gender": "men"
          },
          "season": {
            "id": "sr:season:127935",
            "name": "Primera Division 2025",
            "start_date": "2025-02-15",
            "end_date": "2025-12-07",
            "year": "2025",
            "competition_id": "sr:competition:27665"
          },
          "stage": {
            "order": 1,
            "type": "league",
            "phase": "regular season",
            "start_date": "2025-02-15",
            "end_date": "2025-12-07",
            "year": "2025"
          },
          "round": {
            "number": 13
          },
          "groups": [
            {
              "id": "sr:league:90581",
              "name": "Primera Division 2025"
            }
          ]
        }
      }
    }
```

Once created, match IDs are unchanging, except in the rare case that a match is [postponed](https://developer.sportradar.com/soccer/docs/soccer-ig-match-status-workflow#postponed), or a match is mistakenly created twice (the duplicated UUID would be removed).

### Event ID Updates

The following endpoints are useful for tracking changes to `sport_event_id` values over time:

* Use the [Sport Events Created](https://developer.sportradar.com/soccer/reference/soccer-sport-events-created) endpoint to identify new `sport_event_id`s generated in the past 24 hours.
* Use the [Sport Events Removed](https://developer.sportradar.com/soccer/reference/soccer-sport-events-removed) endpoint to detect and remove duplicate or invalid events.
* Use the [Sport Events Updated](https://developer.sportradar.com/soccer/reference/soccer-sport-events-updated) endpoint to monitor matches that have been updated in the past 24 hours.

<br />

***

## Competitor (Team) IDs

Each soccer team has a unique identifier available in the `competitor.id` field. To retrieve all active teams for a given season of a competition, use the [Season Competitors](https://developer.sportradar.com/soccer/reference/soccer-season-competitors) endpoint.

```xml Season Competitors (XML)
<?xml version="1.0" encoding="UTF-8"?>
<season_competitors
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T08:37:29+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_competitors.xsd">
	<competitor id="sr:competitor:3" name="Wolverhampton Wanderers" short_name="Wolverhampton" abbreviation="WOL" gender="male"/>
	<competitor id="sr:competitor:7" name="Crystal Palace" short_name="Crystal Palace" abbreviation="CRY" gender="male"/>
	<competitor id="sr:competitor:14" name="Nottingham Forest" short_name="Nottingham" abbreviation="NFO" gender="male"/>
	<competitor id="sr:competitor:17" name="Manchester City" short_name="Manchester City" abbreviation="MCI" gender="male"/>
	<competitor id="sr:competitor:30" name="Brighton &amp; Hove Albion" short_name="Brighton" abbreviation="BRI" gender="male"/>
	<competitor id="sr:competitor:31" name="Leicester City" short_name="Leicester" abbreviation="LEI" gender="male"/>
	<competitor id="sr:competitor:32" name="Ipswich Town" short_name="Ipswich" abbreviation="IPS" gender="male"/>
	<competitor id="sr:competitor:33" name="Tottenham Hotspur" short_name="Tottenham" abbreviation="TOT" gender="male"/>
	<competitor id="sr:competitor:35" name="Manchester United" short_name="Manchester United" abbreviation="MUN" gender="male"/>
	<competitor id="sr:competitor:37" name="West Ham United" short_name="West Ham" abbreviation="WHU" gender="male"/>
	<competitor id="sr:competitor:38" name="Chelsea FC" short_name="Chelsea" abbreviation="CHE" gender="male"/>
	<competitor id="sr:competitor:39" name="Newcastle United" short_name="Newcastle" abbreviation="NEW" gender="male"/>
	<competitor id="sr:competitor:40" name="Aston Villa" short_name="Aston Villa" abbreviation="AVL" gender="male"/>
	<competitor id="sr:competitor:42" name="Arsenal FC" short_name="Arsenal" abbreviation="ARS" gender="male"/>
	<competitor id="sr:competitor:43" name="Fulham FC" short_name="Fulham" abbreviation="FUL" gender="male"/>
	<competitor id="sr:competitor:44" name="Liverpool FC" short_name="Liverpool" abbreviation="LFC" gender="male"/>
	<competitor id="sr:competitor:45" name="Southampton FC" short_name="Southampton" abbreviation="SOU" gender="male"/>
	<competitor id="sr:competitor:48" name="Everton FC" short_name="Everton" abbreviation="EVE" gender="male"/>
	<competitor id="sr:competitor:50" name="Brentford FC" short_name="Brentford" abbreviation="BRE" gender="male"/>
	<competitor id="sr:competitor:60" name="AFC Bournemouth" short_name="Bournemouth" abbreviation="BOU" gender="male"/>
</season_competitors>
```
```json Season Competitors (JSON)
{
  "season_competitors": [
    {
      "id": "sr:competitor:3",
      "name": "Wolverhampton Wanderers",
      "short_name": "Wolverhampton",
      "abbreviation": "WOL",
      "gender": "male"
    },
    {
      "id": "sr:competitor:7",
      "name": "Crystal Palace",
      "short_name": "Crystal Palace",
      "abbreviation": "CRY",
      "gender": "male"
    },
    {
      "id": "sr:competitor:14",
      "name": "Nottingham Forest",
      "short_name": "Nottingham",
      "abbreviation": "NFO",
      "gender": "male"
    },
    {
      "id": "sr:competitor:17",
      "name": "Manchester City",
      "short_name": "Manchester City",
      "abbreviation": "MCI",
      "gender": "male"
    },
    {
      "id": "sr:competitor:30",
      "name": "Brighton & Hove Albion",
      "short_name": "Brighton",
      "abbreviation": "BRI",
      "gender": "male"
    },
    {
      "id": "sr:competitor:31",
      "name": "Leicester City",
      "short_name": "Leicester",
      "abbreviation": "LEI",
      "gender": "male"
    },
    {
      "id": "sr:competitor:32",
      "name": "Ipswich Town",
      "short_name": "Ipswich",
      "abbreviation": "IPS",
      "gender": "male"
    },
    {
      "id": "sr:competitor:33",
      "name": "Tottenham Hotspur",
      "short_name": "Tottenham",
      "abbreviation": "TOT",
      "gender": "male"
    },
    {
      "id": "sr:competitor:35",
      "name": "Manchester United",
      "short_name": "Manchester United",
      "abbreviation": "MUN",
      "gender": "male"
    },
    {
      "id": "sr:competitor:37",
      "name": "West Ham United",
      "short_name": "West Ham",
      "abbreviation": "WHU",
      "gender": "male"
    },
    {
      "id": "sr:competitor:38",
      "name": "Chelsea FC",
      "short_name": "Chelsea",
      "abbreviation": "CHE",
      "gender": "male"
    },
    {
      "id": "sr:competitor:39",
      "name": "Newcastle United",
      "short_name": "Newcastle",
      "abbreviation": "NEW",
      "gender": "male"
    },
    {
      "id": "sr:competitor:40",
      "name": "Aston Villa",
      "short_name": "Aston Villa",
      "abbreviation": "AVL",
      "gender": "male"
    },
    {
      "id": "sr:competitor:42",
      "name": "Arsenal FC",
      "short_name": "Arsenal",
      "abbreviation": "ARS",
      "gender": "male"
    },
    {
      "id": "sr:competitor:43",
      "name": "Fulham FC",
      "short_name": "Fulham",
      "abbreviation": "FUL",
      "gender": "male"
    },
    {
      "id": "sr:competitor:44",
      "name": "Liverpool FC",
      "short_name": "Liverpool",
      "abbreviation": "LFC",
      "gender": "male"
    },
    {
      "id": "sr:competitor:45",
      "name": "Southampton FC",
      "short_name": "Southampton",
      "abbreviation": "SOU",
      "gender": "male"
    },
    {
      "id": "sr:competitor:48",
      "name": "Everton FC",
      "short_name": "Everton",
      "abbreviation": "EVE",
      "gender": "male"
    },
... (example cut here; 3 KB in the source page)
```

  ### Competitor Merges

  Use the [**Competitor Merge Mappings**](https://developer.sportradar.com/soccer/reference/soccer-competitor-merge-mappings) endpoint to identify teams that have merged. This allows you to map old competitor IDs to a new, unified team ID and maintain accurate historical data alignment.

<br />

### TBD Teams

The `competitor.id` may occasionally represent a placeholder team labeled as TBD when the matchup is not yet determined. This unique ID allows match information to be included even when the participating team is still unknown.

`<competitor id="sr:competitor:333" name="TBD" short_name="TBD" abbreviation="TBD" gender="male"/>`

<br />

***

## Player IDs

Each Soccer player will have their own unique identifier under `player.id`. You can locate all players on a given team in the [Competitor Profile](https://developer.sportradar.com/soccer/reference/soccer-competitor-profile) endpoint, and retrieve detailed player biographical info and stats in the [Player Profile](https://developer.sportradar.com/soccer/reference/soccer-player-profile) endpoint.

Player IDs will not change once created.

```xml Team Roster Sample (xml)
<competitor_profile
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T09:41:11+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/competitor_profile.xsd">
	<competitor id="sr:competitor:44" name="Liverpool FC" short_name="Liverpool" country="England" country_code="ENG" abbreviation="LFC" gender="male"/>
	<category id="sr:category:1" name="England" country_code="ENG"/>
	<sport id="sr:sport:1" name="Soccer"/>
	<jerseys>
		<jersey type="home" base="e41e2c" sleeve="e41e2c" number="ffffff" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves" sleeve_detail="f20202"/>
		<jersey type="away" base="000000" sleeve="4fb5c1" number="ffffff" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="goalkeeper" base="18fffb" sleeve="121820" number="f3f5f0" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="third" base="ffffff" sleeve="de020e" number="000000" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
	</jerseys>
	<manager id="sr:player:2250" name="Slot, Arne" date_of_birth="1978-09-17" nationality="Netherlands" country_code="NLD" preferred_foot="right" gender="male"/>
	<venue id="sr:venue:579" name="Anfield" capacity="61276" city_name="Liverpool" country_name="England" map_coordinates="53.430622,-2.960919" country_code="ENG" timezone="Europe/London"/>
	<players>
		<player id="sr:player:143040" name="Endo, Wataru" type="midfielder" date_of_birth="1993-02-09" nationality="Japan" country_code="JPN" height="178" weight="76" jersey_number="3" preferred_foot="right" place_of_birth="Yokohama" gender="male"/>
		<player id="sr:player:151545" name="Van Dijk, Virgil" type="defender" date_of_birth="1991-07-08" nationality="Netherlands" country_code="NLD" height="195" weight="92" jersey_number="4" preferred_foot="right" place_of_birth="Breda" gender="male"/>
		<player id="sr:player:159665" name="Salah, Mohamed" type="forward" date_of_birth="1992-06-15" nationality="Egypt" country_code="EGY" height="175" weight="71" jersey_number="11" preferred_foot="left" place_of_birth="Basyoun, El Gharbia" gender="male"/>
		<player id="sr:player:243609" name="Alisson" type="goalkeeper" date_of_birth="1992-10-02" nationality="Brazil" country_code="BRA" height="193" weight="91" jersey_number="1" preferred_foot="right" place_of_birth="Novo Hamburgo" gender="male"/>
		<player id="sr:player:262911" name="Robertson, Andy" type="defender" date_of_birth="1994-03-11" nationality="Scotland" country_code="SCO" height="178" weight="64" jersey_number="26" preferred_foot="left" place_of_birth="Glasgow" gender="male"/>
		<player id="sr:player:318927" name="Gomez, Joe" type="defender" date_of_birth="1997-05-23" nationality="England" country_code="ENG" height="188" weight="77" jersey_number="2" preferred_foot="right" place_of_birth="London" gender="male"/>
		<player id="sr:player:605434" name="Tsimikas, Kostas" type="defender" date_of_birth="1996-05-12" nationality="Greece" country_code="GRC" height="178" weight="77" jersey_number="21" preferred_foot="left" place_of_birth="Thessaloniki" gender="male"/>
		<player id="sr:player:606164" name="Jota, Diogo" type="forward" date_of_birth="1996-12-04" nationality="Portugal" country_code="PRT" height="178" weight="70" jersey_number="20" preferred_foot="right" place_of_birth="Porto" gender="male"/>
		<player id="sr:player:755360" name="Kelleher, Caoimhin" type="goalkeeper" date_of_birth="1998-11-23" nationality="Ireland" country_code="IRL" height="188" weight="75" jersey_number="62" preferred_foot="right" place_of_birth="Cork" gender="male"/>
		<player id="sr:player:936572" name="Konate, Ibrahima" type="defender" date_of_birth="1999-05-25" nationality="France" country_code="FRA" height="194" weight="84" jersey_number="5" preferred_foot="right" place_of_birth="Paris" gender="male"/>
		<player id="sr:player:1012117" name="Chiesa, Federico" type="midfielder" date_of_birth="1997-10-25" nationality="Italy" country_code="ITA" height="175" weight="70" jersey_number="14" preferred_foot="right" place_of_birth="Genova" gender="male"/>
		<player id="sr:player:1058437" name="Gakpo, Cody" type="forward" date_of_birth="1999-05-07" nationality="Netherlands" country_code="NLD" height="193" weight="76" jersey_number="18" preferred_foot="right" place_of_birth="Einthoven" gender="male"/>
		<player id="sr:player:1064588" name="Szoboszlai, Dominik" type="midfielder" date_of_birth="2000-10-25" nationality="Hungary" country_code="HUN" height="186" weight="74" jersey_number="8" preferred_foot="right" place_of_birth="Szekesfehervar" gender="male"/>
		<player id="sr:player:1134923" name="Diaz, Luis" type="forward" date_of_birth="1997-01-13" nationality="Colombia" country_code="COL" height="180" weight="68" jersey_number="7" preferred_foot="right" place_of_birth="Barrancas" gender="male"/>
		<player id="sr:player:1245194" name="Mac Allister, Alexis" type="midfielder" date_of_birth="1998-12-24" nationality="Argentina" country_code="ARG" height="176" weight="70" jersey_number="10" preferred_foot="right" place_of_birth="Santa Rosa" gender="male"/>
		<player id="sr:player:1298510" name="Jones, Curtis" type="midfielder" date_of_birth="2001-01-30" nationality="England" country_code="ENG" height="185" weight="81" jersey_number="17" preferred_foot="right" place_of_birth="Liverpool" gender="male"/>
		<player id="sr:player:1319220" name="Gravenberch, Ryan" type="midfielder" date_of_birth="2002-05-16" nationality="Netherlands" country_code="NLD" height="190" weight="77" jersey_number="38" preferred_foot="right" place_of_birth="Amserdam" gender="male"/>
		<player id="sr:player:1406549" name="Nunez, Darwin" type="forward" date_of_birth="1999-06-24" nationality="Uruguay" country_code="URY" height="187" weight="79" jersey_number="9" preferred_foot="right" place_of_birth="Artigas" gender="male"/>
		<player id="sr:player:1544819" name="Phillips, Nat" type="defender" date_of_birth="1997-03-21" nationality="England" country_code="ENG" height="190" jersey_number="47" place_of_birth="Bolton" gender="male"/>
		<player id="sr:player:1604594" name="Elliott, Harvey" type="midfielder" date_of_birth="2003-04-04" nationality="England" country_code="ENG" height="175" weight="64" jersey_number="19" preferred_foot="left" place_of_birth="London" gender="male"/>
		<player id="sr:player:1939964" name="Morton, Tyler" type="midfielder" date_of_birth="2002-10-31" nationality="England" country_code="ENG" height="178" weight="68" jersey_number="80" preferred_foot="right" place_of_birth="Wallasey" gender="male"/>
		<player id="sr:player:1939984" name="Davies, Harvey" type="goalkeeper" date_of_birth="2003-09-03" nationality="England" country_code="ENG" height="190" weight="77" jersey_number="95" preferred_foot="left" place_of_birth="Liverpool" gender="male"/>
		<player id="sr:player:1939988" name="Quansah, Jarell" type="defender" date_of_birth="2003-01-29" nationality="England" country_code="ENG" height="190" weight="84" jersey_number="78" preferred_foot="right" place_of_birth="Warrington" gender="male"/>
		<player id="sr:player:1939996" name="Bradley, Conor" type="defender" date_of_birth="2003-07-09" nationality="Northern ireland" country_code="NIR" height="181" weight="76" jersey_number="84" preferred_foot="right" place_of_birth="Castlederg" gender="male"/>
		<player id="sr:player:2263163" name="Mrozek, Fabian" type="goalkeeper" date_of_birth="2003-09-28" nationality="Poland" country_code="POL" height="192" weight="86" jersey_number="93" preferred_foot="right" gender="male"/>
		<player id="sr:player:2263171" name="Mabaya, Isaac" type="midfielder" date_of_birth="2004-09-22" nationality="England" country_code="ENG" jersey_number="52" preferred_foot="right" place_of_birth="Preston" gender="male"/>
		<player id="sr:player:2263797" name="McConnell, James" type="midfielder" date_of_birth="2004-09-13" nationality="England" country_code="ENG" height="180" weight="75" jersey_number="53" preferred_foot="right" place_of_birth="Newcastle upon Tyne (ENGLAND)" gender="male"/>
		<player id="sr:player:2439483" name="Kone-Doherty, Trent" type="forward" date_of_birth="2006-06-30" nationality="Ireland" country_code="IRL" jersey_number="51" place_of_birth="Londonderis" gender="male"/>
		<player id="sr:player:2439493" name="Young, Ranel" type="forward" date_of_birth="2005-12-26" nationality="England" country_code="ENG" height="175" weight="65" jersey_number="82" preferred_foot="right" place_of_birth="Huddersfield (ENGLAND)" gender="male"/>
		<player id="sr:player:2569099" name="Morrison, Kieran" type="midfielder" date_of_birth="2006-11-09" nationality="Northern ireland" country_code="NIR" jersey_number="68" gender="male"/>
		<player id="sr:player:2714270" name="Nyoni, Treymaurice" type="midfielder" date_of_birth="2007-06-30" nationality="England" country_code="ENG" height="180" weight="75" jersey_number="98" preferred_foot="right" place_of_birth="Leicester (ENGLAND)" gender="male"/>
		<player id="sr:player:2772009" name="Nallo, Amara" type="defender" date_of_birth="2006-11-18" nationality="England" country_code="ENG" height="186" weight="74" jersey_number="65" preferred_foot="both" gender="male"/>
		<player id="sr:player:2915821" name="Ngumoha, Rio" type="forward" date_of_birth="2008-08-29" nationality="England" country_code="ENG" height="170" weight="75" jersey_number="73" preferred_foot="right" place_of_birth="London" gender="male"/>
	</players>
</competitor_profile>

```
```json Player Profile Sample (json)
{
  "player": {
    "id": "sr:player:159665",
    "name": "Salah, Mohamed",
    "type": "forward",
    "date_of_birth": "1992-06-15",
    "nationality": "Egypt",
    "country_code": "EGY",
    "height": 175,
    "weight": 71,
    "jersey_number": 11,
    "preferred_foot": "left",
    "place_of_birth": "Basyoun, El Gharbia",
    "gender": "male"
  },
  "competitors": [
    {
      "id": "sr:competitor:4758",
      "name": "Egypt",
      "country": "Egypt",
      "country_code": "EGY",
      "abbreviation": "EGY",
      "gender": "male"
    },
    {
      "id": "sr:competitor:44",
      "name": "Liverpool FC",
      "country": "England",
      "country_code": "ENG",
      "abbreviation": "LFC",
      "gender": "male"
    }
  ],
  "roles": [
    {
      "type": "player",
      "active": true,
      "competitor": {
        "id": "sr:competitor:4758",
        "name": "Egypt",
        "country": "Egypt",
        "country_code": "EGY",
        "abbreviation": "EGY",
        "gender": "male"
      },
      "jersey_number": 10
    },
    {
      "type": "player",
      "active": false,
      "competitor": {
        "id": "sr:competitor:22679",
        "name": "Egypt",
        "country": "Egypt",
        "country_code": "EGY",
        "abbreviation": "EGY",
        "gender": "male",
        "age_group": "U20"
      },
      "jersey_number": 12
    },
    {
      "type": "player",
      "active": false,
      "competitor": {
        "id": "sr:competitor:69224",
        "name": "Egypt",
        "country": "Egypt",
        "country_code": "EGY",
        "abbreviation": "EGY",
        "gender": "male",
        "age_group": "U23"
      },
      "jersey_number": 11
    },
    {
      "type": "player",
      "active": false,
      "competitor": {
        "id": "sr:competitor:42365",
        "name": "Al Mokawloon Al Arab",
        "country": "Egypt",
        "country_code": "EGY",
        "abbreviation": "MOK",
        "gender": "male"
      },
      "start_date": "2008-07-01 00:00:00",
      "end_date": "2012-06-30 00:00:00"
    },
    {
      "type": "player",
      "active": false,
      "competitor": {
        "id": "sr:competitor:2501",
        "name": "FC Basel 1893",
        "country": "Switzerland",
        "country_code": "CHE",
        "abbreviation": "FCB",
        "gender": "male"
      },
      "start_date": "2012-07-01 00:00:00",
      "end_date": "2014-01-25 00:00:00",
      "jersey_number": 22
    },
    {
      "type": "player",
      "active": false,
      "competitor": {
        "id": "sr:competitor:38",
        "name": "Chelsea FC",
        "country": "England",
        "country_code": "ENG",
        "abbreviation": "CHE",
        "gender": "male"
      },
      "start_date": "2014-01-26 00:00:00",
      "end_date": "2016-06-30 00:00:00",
      "jersey_number": 17
    },
    {
      "type": "on_loan",
      "active": false,
      "competitor": {
        "id": "sr:competitor:2693",
        "name": "ACF Fi
... (example cut here; 4 KB in the source page)
```

  ### Player Merges

  Use the [**Player Merge Mappings**](https://developer.sportradar.com/soccer/reference/soccer-player-merge-mappings) endpoint to track players whose profiles have been merged. This helps ensure continuity when a player’s data has been consolidated under a new player ID.

### Access all Player IDs

Iterate through the past [Seasonal Players](https://developer.sportradar.com/soccer/reference/soccer-season-players) feeds for each season and team to obtain all player IDs in the Soccer API.

Alternately, request the [Sport Event Lineups](https://developer.sportradar.com/soccer/reference/soccer-sport-event-lineups) endpoint for every Soccer match to capture every player who has appeared on a team roster.

<br />

***

## Season IDs

Each Soccer season will have its own unique identifier under `season.id`.  You can locate all historical seasons in the [Seasons](https://developer.sportradar.com/soccer/reference/soccer-seasons) feed.

Season IDs will not change once created.

```xml Seasons Sample (xml)
<seasons
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T10:18:25+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/seasons.xsd">
	<season id="sr:season:92261" name="UEFA Euro 2024" start_date="2024-06-14" end_date="2024-07-14" year="2024" competition_id="sr:competition:1"/>
	<season id="sr:season:58428" name="UEFA Euro 2020" start_date="2021-06-11" end_date="2021-07-11" year="2021" competition_id="sr:competition:1"/>
	<season id="sr:season:12170" name="UEFA Euro 2016" start_date="2016-06-10" end_date="2016-07-11" year="2016" competition_id="sr:competition:1"/>
	<season id="sr:season:131129" name="UEFA Champions League 25/26" start_date="2025-07-08" end_date="2026-05-31" year="25/26" competition_id="sr:competition:7"/>
	<season id="sr:season:119239" name="UEFA Champions League 24/25" start_date="2024-07-09" end_date="2025-05-31" year="24/25" competition_id="sr:competition:7"/>
	<season id="sr:season:106479" name="UEFA Champions League 23/24" start_date="2023-06-27" end_date="2024-06-01" year="23/24" competition_id="sr:competition:7"/>
</seasons>

```
```json Seasons Sample (json)
{
  "seasons": [
    {
      "id": "sr:season:92261",
      "name": "UEFA Euro 2024",
      "start_date": "2024-06-14",
      "end_date": "2024-07-14",
      "year": "2024",
      "competition_id": "sr:competition:1"
    },
    {
      "id": "sr:season:58428",
      "name": "UEFA Euro 2020",
      "start_date": "2021-06-11",
      "end_date": "2021-07-11",
      "year": "2021",
      "competition_id": "sr:competition:1"
    },
    {
      "id": "sr:season:12170",
      "name": "UEFA Euro 2016",
      "start_date": "2016-06-10",
      "end_date": "2016-07-11",
      "year": "2016",
      "competition_id": "sr:competition:1"
    },
    {
      "id": "sr:season:131129",
      "name": "UEFA Champions League 25/26",
      "start_date": "2025-07-08",
      "end_date": "2026-05-31",
      "year": "25/26",
      "competition_id": "sr:competition:7"
    },
    {
      "id": "sr:season:119239",
      "name": "UEFA Champions League 24/25",
      "start_date": "2024-07-09",
      "end_date": "2025-05-31",
      "year": "24/25",
      "competition_id": "sr:competition:7"
    },
    {
      "id": "sr:season:106479",
      "name": "UEFA Champions League 23/24",
      "start_date": "2023-06-27",
      "end_date": "2024-06-01",
      "year": "23/24",
      "competition_id": "sr:competition:7"
    }
  ]
}
```

<br />

***

## Venue IDs

Each soccer venue will have its own unique identifier under `venue.id`. You can locate a team's home venue in the [Competitor Profile](https://developer.sportradar.com/soccer/reference/soccer-competitor-profile), and each Sport Event feed will include the venue ID for that matchup.

Venue IDs will not change once created.

```xml Venu Sample (xml)
<competitor_profile
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" generated_at="2025-06-30T09:41:11+00:00"
	xmlns="http://schemas.sportradar.com/sportsapi/soccer/v4" xsi:schemaLocation="http://schemas.sportradar.com/sportsapi/soccer/v4 https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/competitor_profile.xsd">
	<competitor id="sr:competitor:44" name="Liverpool FC" short_name="Liverpool" country="England" country_code="ENG" abbreviation="LFC" gender="male"/>
	<category id="sr:category:1" name="England" country_code="ENG"/>
	<sport id="sr:sport:1" name="Soccer"/>
	<jerseys>
		<jersey type="home" base="e41e2c" sleeve="e41e2c" number="ffffff" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves" sleeve_detail="f20202"/>
		<jersey type="away" base="000000" sleeve="4fb5c1" number="ffffff" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="goalkeeper" base="18fffb" sleeve="121820" number="f3f5f0" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
		<jersey type="third" base="ffffff" sleeve="de020e" number="000000" squares="false" stripes="false" horizontal_stripes="false" split="false" shirt_type="short_sleeves"/>
	</jerseys>
	<manager id="sr:player:2250" name="Slot, Arne" date_of_birth="1978-09-17" nationality="Netherlands" country_code="NLD" preferred_foot="right" gender="male"/>
	<venue id="sr:venue:579" name="Anfield" capacity="61276" city_name="Liverpool" country_name="England" map_coordinates="53.430622,-2.960919" country_code="ENG" timezone="Europe/London"/>
</competitor_profile>
```
```json Venue Sample (json)
{
  "competitor": {
    "id": "sr:competitor:44",
    "name": "Liverpool FC",
    "short_name": "Liverpool",
    "country": "England",
    "country_code": "ENG",
    "abbreviation": "LFC",
    "gender": "male"
  },
  "category": {
    "id": "sr:category:1",
    "name": "England",
    "country_code": "ENG"
  },
  "sport": {
    "id": "sr:sport:1",
    "name": "Soccer"
  },
  "jerseys": [
    {
      "type": "home",
      "base": "e41e2c",
      "sleeve": "e41e2c",
      "number": "ffffff",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves",
      "sleeve_detail": "f20202"
    },
    {
      "type": "away",
      "base": "000000",
      "sleeve": "4fb5c1",
      "number": "ffffff",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    },
    {
      "type": "goalkeeper",
      "base": "18fffb",
      "sleeve": "121820",
      "number": "f3f5f0",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    },
    {
      "type": "third",
      "base": "ffffff",
      "sleeve": "de020e",
      "number": "000000",
      "squares": false,
      "stripes": false,
      "horizontal_stripes": false,
      "split": false,
      "shirt_type": "short_sleeves"
    }
  ],
  "manager": {
    "id": "sr:player:2250",
    "name": "Slot, Arne",
    "date_of_birth": "1978-09-17",
    "nationality": "Netherlands",
    "country_code": "NLD",
    "preferred_foot": "right",
    "gender": "male"
  },
  "venue": {
    "id": "sr:venue:579",
    "name": "Anfield",
    "capacity": 61276,
    "city_name": "Liverpool",
    "country_name": "England",
    "map_coordinates": "53.430622,-2.960919",
    "country_code": "ENG",
    "timezone": "Europe/London"
  }
}
```

**Note:** [Sportradar IDs](https://developer.sportradar.com/football/docs/nfl-ig-id-handling#sr-ids) will be consistent across sports and leagues, where available. Meaning those venue IDs would be consistent across APIs.

<br />

<br />

<br />

<br />
