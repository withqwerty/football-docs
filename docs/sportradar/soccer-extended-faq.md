---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-faq
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.201Z
---
# Extended FAQs

Browse by category below. Select any group or question to jump straight to it. Use your browser's find (**Ctrl/Cmd + F**) to search the page.

## Table of Contents

  
    <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
      <a href="#getting-started" style={{ textDecoration: "none" }}>Getting Started</a>
    </p>
    
- Coverage
- Integration
- Pagination
- Simulations
    
  

  
    <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
      <a href="#game-data" style={{ textDecoration: "none" }}>Game Data</a>
    </p>
    
- Sport Event Statuses
- Event & Period Types
- Ball Location
- Red / Yellow Cards
- Video Assistant Referee (VAR)
- Commentary
    
  

  
    <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
      <a href="#players--personnel" style={{ textDecoration: "none" }}>Players & Personnel</a>
    </p>
    
- Lineups / Rosters
- Minutes Played
    
  

  
    <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
      <a href="#statistics" style={{ textDecoration: "none" }}>Statistics</a>
    </p>
    
- Extended Statistics
- Leaders
    
  

  
    <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
      <a href="#reference-data" style={{ textDecoration: "none" }}>Reference Data</a>
    </p>
    
- Standings / Tournaments
- Past Season Data
- Weather
- Probabilities
    
  

  
    <p style={{ marginTop: 0, marginBottom: "10px", fontSize: "1rem", fontWeight: 600 }}>
      <a href="#miscellaneous" style={{ textDecoration: "none" }}>Miscellaneous</a>
    </p>
    
- Replay Matches
- TV Coverage
- Sport Events Updated
    
  

***

# Getting Started

## Coverage

<br />

### What leagues or tournaments do you cover for soccer?

You can find all the leagues we cover, as well as a breakdown of data offered, via our [Coverage Matrix](https://coverage-matrix.sportradar.com/). See the **Extended Statistics** column for competitions covered in the Soccer Extended package.

<br />

### When is coverage information added to the endpoints?

On the first day of the season.

<br />

### How do I find out the coverage for a particular match?

Find the node for `coverage` within the Summaries, Lineups, and Timeline endpoints.

Coverage nodes have three types: `competition` level, `group` level, and `sport_event` level.

* The `competition` level describes data coverage you can expect for matches involved in that given competition.
* The `group` level is similar because there exists competitions where coverage levels differ at different stages or in different groups - mostly cup competitions.
* The `sport_event` level describes the data depth of a specific match within the group and season.

Note: There are occasions when the `sport_event` coverage can vary from the anticipated `season` coverage. This node exists to highlight that instance and assist in handling any discrepancies.

```xml sport_event Coverage (Sport Event Summary)
<coverage type="sport_event">
    <sport_event_properties lineups="true" venue="true" extended_player_stats="true" extended_team_stats="true" basic_play_by_play="true" basic_player_stats="true" basic_team_stats="true"/>
</coverage>
```
```xml competition Coverage (Season Info)
<coverage type="competition">
    <competition_properties brackets="false" missing_players="false" player_transfer_history="false" schedules="true" season_player_statistics="false" season_stats_leaders="false" season_team_statistics="false" standings="false" team_squads="false"/>
    <sport_event_properties basic_play_by_play="false" basic_player_stats="false" basic_team_stats="false" extended_player_stats="false" extended_team_stats="false" deeper_play_by_play="false" deeper_team_stats="false" deeper_player_stats="false" lineups="false" goal_scorers="true" scores="live" assists="false"/>
</coverage>
```

<br />

### How is coverage for a particular match defined?

The `coverage` nodes contain classifications of data types which are expressed as Boolean values or denoted as `live` or `post`.

```xml Sample
<coverage type="sport_event">
    <sport_event_properties lineups="false" venue="false" extended_player_stats="false" extended_team_stats="false" ballspotting="false" commentary="false" fun_facts="false" goal_scorers="false" scores="post" game_clock="false" deeper_play_by_play="false" deeper_player_stats="false" deeper_team_stats="false" basic_play_by_play="false" basic_player_stats="false" basic_team_stats="false"/>
</coverage>
```

<br />

### How do you define basic and deeper play-by-play in terms of coverage?

* `basic_play_by_play` includes `score_change`, `cards`, and `substitutions`.
* `deeper_play_by_play` includes all other event types.

<br />

### How will a sport event behave when it is not covered with live scores?

When a `sport_event` is not covered live, the `status` and `match_status` will remain as `not_started` until results are entered post-match.

```xml
<sport_event_status status="not_started" match_status="not_started"/>
```

<br />

### How are "live" endpoints handled in the API?

Sport events appear in the feed 10 minutes before the scheduled start time and are removed 10 minutes after the sport event ends. Live endpoints include: [Live Summaries](https://developer.sportradar.com/soccer/reference/soccer-extended-live-summaries), [Live Timelines](https://developer.sportradar.com/soccer/reference/soccer-extended-live-timelines), and [Live Timelines Delta](https://developer.sportradar.com/soccer/reference/soccer-extended-live-timelines-delta).

*Learn more: the [Push Feeds](https://developer.sportradar.com/soccer/docs/soccer-ig-push) guide covers streaming live match data over a continuous connection.*

<br />

### How are friendlies handled in the Summary endpoints?

The Summary endpoints return all Friendlies played in the last 2 weeks and scheduled for the next 4 weeks.

<br />

### What level of coverage is offered for friendly competitions?

Friendly competitions are handled uniquely, with coverage being set on a case-by-case basis. Selected matches will be scouted and will therefore have live coverage. We would suggest checking `sport_event_properties` within each `sport_event` to understand the coverage set for a particular match.

<br />

### How do you define Team Statistics and Player Statistics as `sport_event_properties` in terms of coverage?

**Team Statistics:**

* basic\_team\_stats: yellow\_cards, yellow\_red\_cards, and red\_cards.
* deeper\_team\_stats: corner\_kicks, shots\_total, shots\_on\_target, shots\_off\_target, shots\_blocked, ball\_possession, free\_kicks, offsides, goal\_kicks, throw\_ins, shots\_saved, fouls, and injuries.

**Player Statistics:**

* basic\_player\_stats: goals\_scored, yellow\_cards, yellow\_red\_cards, red\_cards, own\_goals, assists, substituted\_in, and substituted\_out.
* deeper\_player\_stats: offsides, corner\_kicks, shots\_on\_target, shots\_off\_target, and shots\_blocked.
* extended\_player\_stats: goals\_by\_head, goals\_by\_penalty, clearances, interceptions, chances\_created, crosses\_successful, crosses\_total, passes\_total, passes\_successful, passes\_unsuccessful, long\_passes\_total, long\_passes\_successful, long\_passes\_unsuccessful, tackles\_total, tackles\_successful, goals\_conceded, shots\_faced\_saved, shots\_faced\_total, penalties\_faced, penalties\_saved, performance\_score, dribbles\_completed, loss\_of\_possession, diving\_saves, fouls\_committed, was\_fouled, minutes\_played, and defensive\_blocks

  ### Note

  Extended player statistics are only available in the soccer extended package. If our coverage cannot guarantee extended stats, deeper stats or basic stats for a competition, they will not be available on match or season level.

<br />

### Why does the coverage of a cup competition not match the data?

For cup competitions, coverage levels may vary from the early rounds to latter stages. Coverage properties are set at a competition level and display the best coverage we offer
... (example cut here; 3 KB in the source page)
```xml Sample (Season Info)
<sport_event_properties basic_play_by_play="false" basic_player_stats="false" basic_team_stats="false" extended_player_stats="false" extended_team_stats="false" deeper_play_by_play="false" deeper_team_stats="false" deeper_player_stats="false" lineups="false" goal_scorers="false" scores="live" assists="false"/>
```

<br />

### Why do properties for all matches adjust during Cup Competitions?

Some of our settings are updated on the Competition level only. Using `formations` as an example, this is not available for the 1st round of a competition and will therefore be set to `false`. When formation becomes available for the Quarterfinals, the property updates to `true` for all matches.

<br />

***

## Integration

<br />

### How can I find the values for various enum data points within the API?

Many enum values are listed in the FAQ below. For the most up-to-date values, please see the Schema section of the OpenAPI specification [here](https://api.sportradar.com/soccer-extended/trial/v4/openapi/swagger/index.html)

<br />

### What format are date fields presented in?

Date values are presented in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard format.

**Timestamp fields** are in UTC. These could include scheduled start times or play-by-play event timestamps. Examples: `scheduled="2024-02-11T23:30:00+00:00"`, `created_at="2024-02-11T23:43:20+00:00"`

**Date-only fields** reflect local league convention and are not UTC-adjusted. These could include season start dates and birth dates. Examples: `start_date="2024-08-16"`, `date_of_birth="1984-09-22"`

<br />

### How do I locate the TTL (Time to Live)/cache on an API endpoint?

The cache (in seconds) can be accessed in the returned header information on each RESTful API call, under `cache-control`.

ex. `cache-control: max-age=1, public, s-maxage=1` or `cache-control: public, must-revalidate, max-age=120`

<br />

***

## Pagination

<br />

### How can I tell if an endpoint is paginated?

To determine if a RESTful API endpoint uses pagination, visit the endpoint's page on our developer portal, its OpenAPI specification, or check the `X-Result` and `X-Max-Results` headers in the API response.

* `X-Result`: This header indicates the number of items returned for this request.
* `X-Max-Results`: This header specifies the total number of items available for a specified request.

If both headers are present and the response data is truncated (i.e., `X-Result` value is less than `X-Max-Results`), you can infer that pagination is in use. To fetch the remaining data, make use of the `limit` and `start` (or `offset`) query string parameters.

In the below Season Summary response, the header specifies 100 sports events are returned (`x-result`), but 381 sport events are available (`x-max-results`). Make an additional API request – such as appending `&start=100` to the end of your call – to obtain additional events.

```text Response Header Sample
< HTTP/2 200
< content-type: application/json
< content-length: 1725369
< date: Wed, 13 Nov 2024 21:06:18 GMT
< x-amzn-requestid: c10fe405-ce81-46fb-a3db-38d153dd2a6c
< x-offset: 0
< x-amz-apigw-id: BNAvVGCUliAEKJA=
< cache-control: max-age=300, public, s-maxage=300
< x-result: 100
< etag: "341dc78002bc578c62a6878519ba0404"
< x-max-results: 381
< link: <https://schemas.sportradar.com/sportsapi/soccer/v4/schemas/season_summaries.json#>; rel="describedBy"
< x-amzn-trace-id: Root=1-673514c8-7a887f81636af0110ecce2d3
< x-amzn-remapped-date: Wed, 13 Nov 2024 21:06:17 GMT
< vary: Accept-Encoding
< x-cache: Hit from cloudfront
< via: 1.1 f2f0cb8191da3bf07a9ca31ece94ab68.cloudfront.net (CloudFront)
< x-amz-cf-pop: IAD61-P4
< x-amz-cf-id: 1cyji-XQZuBlAUsR8QoHdNLWD-jn1HvBC-ShaCMhXl5mMDiFTDRVyQ==
< age: 16
```

<br />

### Why can't I find a particular match in the Daily Summaries, Season Summaries or Sport Events Updated endpoints?

These endpoints support pagination and return a select number of results by default. To return more matches, include an additional query string parameter. Visit an endpoint page for minimum and maximum result values.

<br />

***

## Simulations

<br />

### Are simulations available for Soccer v4?

Yes. You can replay past matches as though they were live using our on-demand [Simulations](https://developer.sportradar.com/getting-started/docs/simulations) service.

*Learn more: Simulations are also the best way to test a [Push Feeds](https://developer.sportradar.com/soccer/docs/soccer-ig-push) integration outside of live match windows.*

<br />

***

[Back to top ↑](#table-of-contents)

***

# Game Data

## Sport Event Statuses

<br />

### What are the valid `sport_event_status` - `status` values?

Here are the valid `sport_event_status` values and their definitions:

* `not_started` - The match is scheduled to be played
* `started` - The match has begun
* `live` - The match is currently in progress
* `postponed` - The match has been postponed to a future date
* `suspended` - The match has been suspended
* `delayed` - The match has been temporarily delayed and will be continued. Typically appears prior to match start
* `interrupted` - The match began, but coverage has stopped for a short time. Note that match scores may not be updated during this period; the last recorded match score will be displayed instead. Any interrupted match that remains in this status for more than 48 hours will receive limited coverage upon resumption; coverage up to the point of interruption remains at the level originally specified for the match.
* `cancelled` - The match has been cancelled and will not be played
* `ended` - The match is over
* `closed` - The match results have been confirmed
* `abandoned` - The match has been abandoned

*Learn more: the [Live Match Updates](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval) guide walks through tracking match status through the event lifecycle.*

<br />

### What are the valid `sport_event_status` - `match_status` values?

Here are the valid `match_status` values and their definitions:

* `not_started` - The match is scheduled to be played
* `started` - The match has begun
* `1st_half` - The match is in the first half
* `2nd_half` - The match is in the second half
* `overtime` - The match is in overtime
* `1st_extra` - The match is in the first extra period
* `2nd_extra` - The match is in the second extra period
* `awaiting_penalties` - Waiting for announcement of penalties
* `penalties` - Penalties are ongoing
* `awaiting_extra_time` - Waiting on referee to announce extra time
* `interrupted` - The match has been interrupted
* `abandoned` - The match has been abandoned
* `postponed` - The match has been postponed to a future date
* `start_delayed` - The match
... (example cut here; 5 KB in the source page)
```xml Timeline Sample (xml)
<event id="1721757571" type="match_started" time="2024-04-16T19:01:48+00:00"/>
<event id="1721757569" type="period_start" time="2024-04-16T19:01:48+00:00" period="1" period_type="regular_period" period_name="regular_period"/>
<event id="1721758935" type="free_kick" time="2024-04-16T19:03:37+00:00" match_time="2" match_clock="1:49" competitor="away" x="49" y="18" period="1" period_type="regular_period">
    <players>
        <player id="sr:player:138156" name="Can, Emre"/>
    </players>
    <commentaries>
        <commentary text="Free kick Atletico."/>
    </commentaries>
</event>
<event id="1721759321" type="throw_in" time="2024-04-16T19:04:08+00:00" match_time="3" match_clock="2:20" competitor="home" x="26" y="0" period="1" period_type="regular_period">
    <commentaries>
        <commentary text="Slavko Vincic awards the home team a throw-in."/>
    </commentaries>
</event>
```
```json Timeline Sample (json)
"timeline": [
    {
        "id": 1721757571,
        "type": "match_started",
        "time": "2024-04-16T19:01:48+00:00"
    },
    {
        "id": 1721757569,
        "type": "period_start",
        "time": "2024-04-16T19:01:48+00:00",
        "period": 1,
        "period_type": "regular_period",
        "period_name": "regular_period"
    },
    {
        "id": 1721758935,
        "type": "free_kick",
        "time": "2024-04-16T19:03:37+00:00",
        "match_time": 2,
        "match_clock": "1:49",
        "competitor": "away",
        "players": [
            {
                "id": "sr:player:138156",
                "name": "Can, Emre"
            }
        ],
        "x": 49,
        "y": 18,
        "period": 1,
        "period_type": "regular_period",
        "commentaries": [
            {
                "text": "Free kick Atletico."
            }
        ]
    },
    {
        "id": 1721759321,
        "type": "throw_in",
        "time": "2024-04-16T19:04:08+00:00",
        "match_time": 3,
        "match_clock": "2:20",
        "competitor": "home",
        "x": 26,
        "y": 0,
        "period": 1,
        "period_type": "regular_period",
        "commentaries": [
            {
                "text": "Slavko Vincic awards the home team a throw-in."
            }
        ]
    },
    {
        "id": 1721760077,
        "type": "shot_on_target",
        "time": "2024-04-16T19:05:15+00:00",
        "match_time": 4,
        "match_clock": "3:26",
        "competitor": "home",
        "players": [
            {
                "id": "sr:player:862396",
                "name": "Ryerson, Julian"
            }
        ],
        "x": 95,
        "y": 76,
        "period": 1,
        "period_type": "regular_period",
        "commentaries": [
            {
                "text": "Julian Ryerson of Dortmund smashes in a shot on target. The keeper saves, though."
            }
        ]
    },
    {
        "id": 1721760083,
        "type": "shot_saved",
        "time": "2024-04-16T19:05:15+00:00",
        "match_time": 4,
        "match_clock": "3:26",
        "competitor": "away",
        "period": 1,
        "period_type": "regular_period"
    },

```

<br />

### Which Timeline event types can be associated with a player?

Here are the Timeline event types that can be associated with a player:

* `corner_kick`
* `injury`
* `injury_return`
* `offside`
* `penalty_awarded`
* `penalty_kick`
* `penalty_missed`
* `penalty_shootout`
* `player_back_from_injury`
* `red_card`
* `score_change`
* `shot_off_target`
* `shot_on_target`
* `substitution`
* `yellow_card`
* `yellow_red_card`

```xml Timeline Event Sample (xml)
<event id="1721787551" type="yellow_card" time="2024-04-16T19:47:26+00:00" match_time="45" match_clock="45:00" competitor="away" stoppage_time="1" stoppage_time_clock="0:37" period="1" period_type="regular_period">
    <players>
        <player id="sr:player:353130" name="Hermoso, Mario"/>
    </players>
    <commentaries>
        <commentary text="Mario Hermoso (Atletico) has received a yellow card from Slavko Vincic."/>
    </commentaries>
</event>
```
```json Timeline Event Sample (json)
{
    "id": 1721787305,
    "type": "injury_time_shown",
    "time": "2024-04-16T19:46:54+00:00",
    "match_time": 45,
    "match_clock": "45:00",
    "stoppage_time": 1,
    "stoppage_time_clock": "0:05",
    "period": 1,
    "period_type": "regular_period",
    "injury_time_announced": 2
},
{
    "id": 1721787551,
    "type": "yellow_card",
    "time": "2024-04-16T19:47:26+00:00",
    "match_time": 45,
    "match_clock": "45:00",
    "competitor": "away",
    "players": [
        {
            "id": "sr:player:353130",
            "name": "Hermoso, Mario"
        }
    ],
    "stoppage_time": 1,
    "stoppage_time_clock": "0:37",
    "period": 1,
    "period_type": "regular_period",
    "commentaries": [
        {
            "text": "Mario Hermoso (Atletico) has received a yellow card from Slavko Vincic."
        }
    ]
},
```

<br />

### How does the `possible_goal` event type work?

This event will occur immediately if one team scores a goal or if they are in a very clear scoring opportunity (1-on-1 with the goalkeeper, clear shot at an empty net, etc).

```xml
<event id="2167869680" type="possible_goal" time="2025-10-16T16:13:56+00:00" match_time="54" match_clock="53:36" competitor="home" period="2" period_type="regular_period"/>
<event id="2167869794" type="score_change" time="2025-10-16T16:14:05+00:00" match_time="54" match_clock="53:36" competitor="home" x="90" y="66" period="2" period_type="regular_period" home_score="1" away_score="0">
    <players>
        <player id="sr:player:1988141" name="Stjopin, Maksim" type="scorer"/>
    </players>
    <commentaries>
        <commentary text="Goal! Ilves have got their heads in front thanks to a Maksim Stjopin strike."/>
    </commentaries>
</event>
```

<br />

### Why is there no `shot_on_target` type included for a scored goal?

The `shot_on_target` event type is included on scored goals for the Soccer Extended Timeline endpoint only. In Extended, the event will also include `additional_outcome="goal"` (see below sample).

The shot on goal is aggregated with the statistics for the match in all endpoints.

```xml Extended Timeline
<event id="18188919" type="possible_goal" time="2026-03-10T21:41:53+00:00" match_time="86" match_clock="85:37" competitor="home" period="2" period_type="regular_period"/>
<event id="18188924" type="shot_on_target" time="2026-03-10T21:42:02+00:00" match_time="86" match_clock="85:37" competitor="home" x="94" y="39" period="2" period_type="regular_period" body_type="right_foot" outcome="on_target" additional_outcome="goal" xg_value="0.38" goalface_x="7" goalface_y="36" type_of_play="open_play">
    <players>
        <player id="sr:player:1055187" name="Barnes, Harvey" type="shot_taker" competitor_id="sr:competitor:39"/>
        <player id="sr:player:372336" name="Murphy, Jacob" type="assist"/>
    </players>
</event>
```
```xml Timeline
<event id="2293795114" type="score_change" time="2026-03-10T21:42:03+00:00" match_time="86" match_clock="85:37" competitor="home" x="93" y="45" period="2" period_type="regular_period" home_score="1" away_score="0">
    <players>
        <player id="sr:player:1055187" name="Barnes, Harvey" type="scorer"/>
        <player id="sr:player:372336" name="Murphy, Jacob" type="assist"/>
    </players>
</event>
```

<br />

***

## Ball Location

<br />

### How does the ball location attribute work?

Our scouts mark down the `x` (lateral) and `y` (longitudinal) coordinates as observed on the pitch. The data can come in sporadically as events on the field play out, but new `ball_location` data is potentially available every 1 second. This is only available for matches with `ballspotting="true"`.

The element `ball_locations` stores the last four known ball locations, after which the data is not available unless it corresponds with another event in the timeline such as `throw_in` or `shot_on_goal`. The `ball_location` order illustrates the most recent location as `4` and the oldest location as `1`.

```xml Sample
<ball_locations>
    <ball_location order="4" x="14" y="100" qualifier="home"/>
    <ball_location order="3" x="7" y="89" qualifier="away"/>
    <ball_location order="2" x="31" y="77" qualifier="away"/>
    <ball_location order="1" x="66" y="50" qualifier="away"/>
</ball_locations>
```

<br />

### What is the scale of the X Y coordinates?

The pitch we use is 100 by 100. Here is a layout of the pitch:

`x` = Horizontal position on the pitch. X is a number between 0 and 100. The reference point 0 is at the home team’s goal.

`y` = Vertical position on the pitch. Y is a number between 0 and 100. The reference point 0 is on the top of the pitch where the home team’s goal is on the left hand side.

`A`, `B`, `C`, `D` = Penalty box edge coordinates. The coordinates start from 0 on the home team side and end with 100 on the away team side.

**Note**: The home team *always* attacks from left to right in the data feed, and the away team from right to left. They do not switch at halftime.

<br />

### What are the possible values for match situation status (`match_situation.status`)?

Here are the valid `match_situation.status` values and their definitions. These can be leveraged to determine the status of a ball in play.

* `safe` - Team in possession of the ball is inside their defensive half
* `dangerous` - Team in possession is in the opponent’s half but not near the penalty box
* `attack` - Team in possession is in the opponent’s half, near the penalty box

<br />

***

## Red / Yellow Cards

<br />

### How do you represent red and yellow cards?

Red and yellow cards are provided with three attributes:

* `red_cards`
* `yellow_cards`
* `yellow_red_cards`

Yellow/red cards (`yellow_red_cards`) are added when a player receives a second yellow card, resulting in a red card. Red cards (`red_cards`) are only added when a player receives a red card.

```xml Yellow/Red Card Sample - sr:player:1070898
<statistics>
    <totals>
        <competitors>
            <competitor id="sr:competitor:4717" name="Belgium" abbreviation="BEL" qualifier="home">
                <statistics ball_possession="46" cards_given="3" corner_kicks="9" fouls="8" free_kicks="12" goal_kicks="6" injuries="0" offsides="2" penalties_missed="1" red_cards="0" shots_blocked="4" shots_off_target="7" shots_on_target="6" shots_saved="3" shots_total="17" substitutions="4" throw_ins="15" yellow_cards="3" yellow_red_cards="0"/>
                <players>
                    <player id="sr:player:70987" name="Casteels, Koen" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:135666" name="Trossard, Leandro" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="2" shots_on_target="2" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:329417" name="Castagne, Timothy" starter="true">
                        <statistics assists="1" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:331737" name="Tielemans, Youri" starter="true">
                        <statistics assists="0" corner_kicks="6" goals_scored="0" offsides="1" own_goals="0" penalties_missed="1" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="1" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:361696" name="Faes, Wout" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:369430" name="Lukebakio, Dodi" starter="false">
                        <statistics assists="0" corner_kicks="3" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:815708" name="Mangala, Orel" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:936428" name="Bornauw, Sebastiaan" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:973773" name="Openda, Lois" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_by_head="1" goals_scored="1" offsides="1" own_goals="0" red_cards="0" shots_blocked="2" shots_off_target="1" shots_on_target="2" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1059113" name="Ngonge, Cyril" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1120733" name="De Wolf, Ortwin" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1297614" name="Doku, Jeremy" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1479828" name="Vandevoordt, Maarten" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1624310" name="De Cuyper, Maxime" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1624316" name="De Ketelaere, Charles" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1646402" name="Theate, Arthur" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1831190" name="Vranckx, Aster" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1939304" name="Engels, Arne" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1985243" name="Debast, Zeno" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="0" shots_on_target="1" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1985261" name="Bakayoko, Johan" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:2346779" name="Fofana, Malick" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:2405115" name="Smets, Matte" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                </players>
            </competitor>
            <competitor id="sr:competitor:4481" name="France" abbreviation="FRA" qualifier="away">
                <statistics ball_possession="54" cards_given="6" corner_kicks="4" fouls="12" free_kicks="10" goal_kicks="10" injuries="0" offsides="0" red_cards="0" shots_blocked="3" shots_off_target="4" shots_on_target="5" shots_saved="5" shots_total="12" substitutions="4" throw_ins="7" yellow_cards="5" yellow_red_cards="1"/>
                <players>
                    <player id="sr:player:96531" name="Areola, Alphonse" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:96538" name="Digne, Lucas" starter="true">
                        <statistics assists="1" corner_kicks="3" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:144864" name="Clauss, Jonathan" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:164055" name="Samba, Brice" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:191210" name="Maignan, Mike" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:361350" name="Dembele, Ousmane" starter="true">
                        <statistics assists="0" corner_kicks="1" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:545970" name="Thuram, Marcus" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:769333" name="Nkunku, Christopher" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:772113" name="Hernandez, Theo" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:936572" name="Konate, Ibrahima" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:940560" name="Kounde, Jules" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1054707" name="Guendouzi, Matteo" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="1" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1070898" name="Tchouameni, Aurelien" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="1" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="1"/>
                    </player>
                    <player id="sr:player:1103411" name="Kolo Muani, Randal" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_by_head="1" goals_by_penalty="1" goals_scored="2" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="2" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1402953" name="Fofana, Wesley" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1513599" name="Saliba, William" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1567396" name="Fofana, Youssouf" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1692931" name="Camavinga, Eduardo" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1693879" name="Kone, Manu" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="2" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1717779" name="Olise, Michael" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1948356" name="Barcola, Bradley" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="2" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:1983573" name="Bade, Loic" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:2256607" name="Zaire-Emery, Warren" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                </players>
            </competitor>
        </competitors>
    </totals>
</statistics>
```
```xml Red Card Sample - sr:player:774445
<statistics>
    <totals>
        <competitors>
            <competitor id="sr:competitor:6102" name="America de Cali" abbreviation="AME" qualifier="home">
                <statistics ball_possession="48" cards_given="2" corner_kicks="2" fouls="14" free_kicks="15" goal_kicks="1" injuries="1" offsides="1" red_cards="0" shots_blocked="0" shots_off_target="4" shots_on_target="3" shots_saved="3" shots_total="7" substitutions="3" throw_ins="16" yellow_cards="2" yellow_red_cards="0"/>
                <players>
                    <player id="sr:player:38172" name="Ramos, Adrian" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="1" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:47724" name="Mosquera, Andres" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:123272" name="Bocanegra, Daniel" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:162563" name="Rivera, Harold" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:322529" name="Balanta, Eder" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="0" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="0" shots_on_target="0" substituted_in="0" substituted_out="1" yellow_cards="0" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:333807" name="Leys, Franco" starter="true">
                        <statistics assists="0" corner_kicks="0" goals_scored="1" offsides="0" own_goals="0" red_cards="0" shots_blocked="0" shots_off_target="1" shots_on_target="1" substituted_in="0" substituted_out="0" yellow_cards="1" yellow_red_cards="0"/>
                    </player>
                    <player id="sr:player:353296" name="Zapata, Alexis" starter="false">
                        <statistics assists="0" corner_kicks="0" goals_scored="0"
... (example cut here; 14 KB in the source page)
```

<br />

### What are the possible values for `event` - `card_description` in the Timeline feeds?

Here are the valid `event.card_description` values:

* `pre_match`
* `half_time`
* `post_match`
* `player_on_bench`
* `first_half`
* `second_half`
* `during_penalty_shootout`

<br />

***

## Video Assistant Referee (VAR)

<br />

### Do you cover VAR events?

VAR events are supported with events `video_assistant_referee` & `video_assistant_referee_over`. However, we cannot guarantee the accuracy or frequency of these events.

For a full integration walkthrough, see the [VAR Review Process](https://developer.sportradar.com/soccer/docs/soccer-ig-live-match-retrieval#var-review-process) section on the Live Match Updates page.

```xml Timeline Snippet (xml)
<event id="3000032774" type="video_assistant_referee" time="2026-04-29T01:07:33+00:00" match_time="50" match_clock="49:14" competitor="away" period="2" period_type="regular_period" description="penalty"/>
<event id="3000032899" type="dribble" time="2026-04-29T01:10:21+00:00" match_time="52" match_clock="51:17" competitor="away" x="8" y="72" period="2" period_type="regular_period" outcome="successful">
    <players>
        <player id="sr:player:2150446" name="Veliz, Alejo" competitor_id="sr:competitor:3217"/>
    </players>
</event>
<event id="3000032882" type="video_assistant_referee_over" time="2026-04-29T01:09:38+00:00" match_time="52" match_clock="51:19" competitor="away" period="2" period_type="regular_period" description="penalty"/>
```
```json Timeline Snippet (json)
{
    "id": 1579569948,
    "type": "video_assistant_referee",
    "time": "2023-10-29T15:46:10+00:00",
    "match_time": 85,
    "match_clock": "84:01",
    "period": 2,
    "period_type": "regular_period",
    "description": "penalty",
    "competitor": "away"
},
{
    "id": 1579570270,
    "type": "video_assistant_referee_over",
    "time": "2023-10-29T15:46:22+00:00",
    "match_time": 85,
    "match_clock": "84:13",
    "period": 2,
    "period_type": "regular_period",
    "description": "no_penalty",
    "competitor": "away"
},
{
    "id": 1579571486,
    "type": "shot_on_target",
    "time": "2023-10-29T15:47:13+00:00",
    "match_time": 86,
    "match_clock": "85:05",
    "competitor": "away",
    "players": [
        {
            "id": "sr:player:1718666",
            "name": "Elanga, Anthony"
        }
    ],
    "x": 5,
    "y": 69,
    "period": 2,
    "period_type": "regular_period"
},
{
    "id": 1579571528,
    "type": "shot_saved",
    "time": "2023-10-29T15:47:15+00:00",
    "match_time": 86,
    "match_clock": "85:05",
    "competitor": "home",
    "period": 2,
    "period_type": "regular_period"
},
```

<br />

### What are the possible `description` values for VAR events?

Here are the valid VAR event `description` values:

* `goal`
* `penalty`
* `red_card`
* `no_goal`
* `no_penalty`
* `no_red_card`
* `corner`
* `no_corner`
* `mistaken_identity`
* `no_mistaken_identity`

```xml
<event id="3000032774" type="video_assistant_referee" time="2026-04-29T01:07:33+00:00" match_time="50" match_clock="49:14" competitor="away" period="2" period_type="regular_period" description="penalty"/>
<event id="3000032882" type="video_assistant_referee_over" time="2026-04-29T01:09:38+00:00" match_time="52" match_clock="51:19" competitor="away" period="2" period_type="regular_period" description="penalty"/>
```

<br />

### What are the possible values for `referee_assistant` type?

Here are the valid `referee_assistant` type values:

* `first_assistant_referee`
* `second_assistant_referee`
* `fourth_official`
* `video_assistant_referee`
* `first_additional_assistant`
* `second_additional_assistant`
* `third_additional_assistant`

<br />

***

## Commentary

<br />

### Why don’t I see commentary in Sport Event Timeline when the coverage has `commentary="true"` under `sport_event_property`?

Commentary is only available for a fixed amount of time (14 days typically). The attribute, which denotes that commentary is or was available, remains even after the commentary is removed.

<br />

### When are fun facts added to the Sport Event Fun Facts endpoint?

Fun facts appear in [Sport Event Fun Facts](https://developer.sportradar.com/soccer/reference/soccer-sport-event-fun-facts) 7 days before a match and are available for a fixed amount of time (14 days typically).

<br />

***

[Back to top ↑](#table-of-contents)

***

# Players & Personnel

## Lineups / Rosters

<br />

### When does the Lineups Availability update?

The `lineups_availability` data is updated 30 days before the sport event is scheduled to begin.

<br />

### When will lineups confirmed show as true?

Lineups information displays as it is entered. Once complete, we confirm lineups and the `lineups_confirmed` attribute updates to `true`. This only appears for matches with `lineups_availability="pre"`.

<br />

### What are the possible values for `sport_event_properties` - `lineups_availability` in the Summary and Timeline endpoints?

Here are the valid `sport_event_properties.lineups_availability` values:

* `pre`
* `post`

<br />

### What are the valid lineup types (player position) values?

Here are the valid lineup type (player position) values:

* `goalkeeper`
* `defender`
* `midfielder`
* `forward`

<br />

### What are the valid lineups descriptions (player tactical position) values?

Here are the valid lineup description (player tactical position) values:

* `goalkeeper`
* `right back`
* `central defender`
* `left back`
* `right winger`
* `central midfielder`
* `left winger`
* `striker`

<br />

### How is the order value in the Lineups endpoint organized?

Order number 1 is always the goalie (star marking) and formations as well as numbering should start with the goalkeeper.

In the example diagram the formation **4-2-3-1** is used.

4 is the number of players in the line in front of the goalkeeper, then comes the line with 2 players and so on.

Numbering in every line starts at the right-hand side of the goalkeeper – this causes the numbering to be mirrored for the home and away team.

<br />

### Do you have player transfer and on-loan data available?

**Transfers**

We use roles from player profiles to create a [Season Transfers](https://developer.sportradar.com/soccer/reference/soccer-extended-season-transfers) endpoint. This displays any player recently assigned to a team in a season covered with `player_transfer_history="true"`.

Transfers can include youth players recently added to a matchday squad. If there is no previous club within 10 days, then this will be understood to be a free agent and therefore no `from_competitor` will display.

For `transfer_date`, we use multiple sources and cannot guarantee the accuracy.

### Sample Snippet (Season Transfers)
  ```xml
   <transfer transfer_date="2025-09-01" role_type="player" from_competitor="sr:competitor:1681" to_competitor="sr:competitor:7">
      <player id="sr:player:2839263" name="Canvot, Jaydee" type="defender" date_of_birth="2006-07-29" nationality="France" country_code="FRA" height="188" weight="75" jersey_number="23" preferred_foot="right" place_of_birth="Argenteuil"/>
          <competitors>
          <competitor id="sr:competitor:1681" name="Toulouse FC" country="France" country_code="FRA" abbreviation="TFC" gender="male"/>
              <competitor id="sr:competitor:7" name="Crystal Palace" country="England" country_code="ENG" abbreviation="CRY" gender="male"/>
              </competitors>
  </transfer>
  <transfer transfer_date="2025-09-01" role_type="on_loan" from_competitor="sr:competitor:2859" to_competitor="sr:competitor:7">
      <player id="sr:player:2801755" name="Uche, Christantus" type="midfielder" date_of_birth="2003-05-19" nationality="Nigeria" country_code="NGA" height="190" weight="84" jersey_number="10" preferred_foot="both" place_of_birth="Owerri (NIGERIA)"/>
          <competitors>
          <competitor id="sr:competitor:2859" name="Getafe CF" country="Spain" country_code="ESP" abbreviation="GET" gender="male"/>
              <competitor id="sr:competitor:7" name="Crystal Palace" country="England" country_code="ENG" abbreviation="CRY" gender="male"/>
              </competitors>
  </transfer>
  ```

**On-Loan**

Players on loan to other teams appear in the **Competitor Profile** and **Seasonal Competitor Players** endpoints for their teams. They are identified using the following attributes:

* `on_loan` - Boolean value signifying a player is on loan to this team (parent `competitor`) when `true`
* `loaned_to_competitor_id` - The unique ID of the competitor (team) the player is currently loaned to (for example, `sr:competitor:9`)

### Sample Snippets
  ```json Sample Snippet (Competitor Profile)
    {
      "id": "sr:player:552632",
      "name": "Manuel, Benson",
      "type": "forward",
      "date_of_birth": "1997-03-28",
      "nationality": "Angola",
      "country_code": "AGO",
      "height": 178,
      "weight": 68,
      "jersey_number": 26,
      "preferred_foot": "left",
      "gender": "male",
      "loaned_to_competitor_id": "sr:competitor:74"
    },
  ```
  ```xml Sample Snippet (Seasonal Competitor Players)
    <player id="sr:player:927018" name="Krejci, Ladislav" type="defender" date_of_birth="1999-04-20" nationality="Czech republic" country_code="CZE" height="191" weight="70" jersey_number="37" preferred_foot="left" place_of_birth="Rosice" on_loan="true"/>
  ```

<br />

### What are the possible reasons for a player to appear in the Missing Players endpoint?

Here are the valid reasons for a player to appear in the Missing Players endpoint:

* `on_loan`
* `injured`
* `suspended`
* `other`

<br />

### Why does a player appear on both the Season Missing Players and Sport Event Lineups endpoints?

A player
... (example cut here; 26 KB in the source page)
```xml Sample
<standing rank="5" played="16" win="8" loss="4" draw="4" goals_for="23" goals_against="24" goals_diff="-1" points="28" current_outcome="Promotion Playoffs" change="1" points_per_game="1.75">
    <competitor id="sr:competitor:21" name="Preston North End" country="England" country_code="ENG" abbreviation="PNE" gender="male" form="DDLWW"/>
</standing>
<standing rank="6" played="16" win="8" loss="6" draw="2" goals_for="27" goals_against="17" goals_diff="10" points="26" current_outcome="Promotion Playoffs" change="2" points_per_game="1.63">
    <competitor id="sr:competitor:41" name="Sunderland AFC" country="England" country_code="ENG" abbreviation="SUN" gender="male" form="LLWDW"/>
</standing>
<standing rank="7" played="16" win="7" loss="4" draw="5" goals_for="26" goals_against="17" goals_diff="9" points="26" change="-2" points_per_game="1.63">
    <competitor id="sr:competitor:8" name="West Bromwich Albion" country="England" country_code="ENG" abbreviation="WBA" gender="male" form="DWWWL"/>
</standing>
```

<br />

### How are group IDs delivered in the stage array with the various types?

With the type of "league" they will have a `sr:league` prefix. With the type of "cup" they will have a `sr:cup` prefix.

<br />

### What are the valid current outcome values?

Here are the valid current outcome values:

* `AFC Champions League`
* `AFC Cup`
* `CAF Confederation Cup`
* `Champions League`
* `Champions League Qualification`
* `Champions Round`
* `Championship Round`
* `Club Championship`
* `Conference League Qualification`
* `Copa Libertadores`
* `Copa Libertadores Qualification`
* `Copa Sudamericana`
* `Cup Winners`
* `Eliminated`
* `European Cup`
* `Final Four`
* `Final Round`
* `Finals`
* `Group Matches`
* `International Competition`
* `Main Round`
* `Next Group Phase`
* `Placement Matches`
* `Playoffs`
* `Preliminary Round`
* `Promotion`
* `Promotion Playoff`
* `Promotion Playoffs`
* `Promotion Round`
* `Qualification Playoffs`
* `Qualified`
* `Qualifying Round`
* `Relegation`
* `Relegation Playoff`
* `Relegation Playoffs`
* `Relegation Round`
* `Semifinal`
* `Top Six`
* `UEFA Conference League`
* `UEFA Conference League Qualification`
* `UEFA Cup`
* `UEFA Cup Qualification`
* `UEFA Europa League`
* `UEFA Europa League Qualification`
* `UEFA Intertoto Cup`

<br />

### How are form standings displayed?

Forms are available in the [Season Standings](https://developer.sportradar.com/soccer/reference/soccer-extended-season-standings) endpoint and the [Season Form Standings](https://developer.sportradar.com/soccer/reference/soccer-extended-season-form-standings) endpoint, but they are displayed differently.

**Season Standings:**

Form standings is located under `competitor.form`. It displays a team's last 5 matches. ***The oldest match is listed first***.

`W` = Win, `L` = Loss, `D` = Draw

ex. `form="WLDDW"`

**Season Form Standings:**

Form standings is located under `form_standing.form`. You may configure the number of matches to return. ***The most recent match is listed first***.

The max limit to display in your request is `10`, which will show, for example, `played="10"`, `win="8"`, `loss="2"`. The `form` will always display a maximum of 6 matches.

`W` = Win, `L` = Loss, `D` = Draw

ex. `form="WDDLWW"`

<br />

***

## Past Season Data

<br />

### Why does the coverage of past seasons not match the data?

Coverage properties are set at a competition level and only reflect the current or last season of that competition. Previous seasons may have greater or lesser coverage.

<br />

### How long is full match data available in the API?

Match data is archived after one year and you will only be able to service basic score information from the API.

A historical statistics API for Soccer is on the roadmap, but no ETA is available at this time.

<br />

### How are seasonal competitor statistics handled?

Statistics from any qualification rounds will not be displayed. The feed will only display data from the main competition.

<br />

***

## Weather

<br />

### What are the possible weather conditions?

Here are the valid weather conditions:

* `indoor`
* `good`
* `medium`
* `bad`
* `extreme`

<br />

### What are the possible pitch values?

Here are the valid pitch values:

* `good`
* `medium`
* `bad`

<br />

***

## Replay Matches

<br />

### How are replay cup matches handled?

Within the **Summary**, **Timeline**, or **Lineups** endpoints you can locate the round data for a given match. In that round data you can find the number of matches in the cup round (`cup_round_number_of_sport_events`) and the number of the given match in the cup round (`cup_round_sport_event_number`).

The values for `cup_round_sport_event_number` are detailed below:

* `1` = Replay
* `2` = 1st Replay
* `3` = 2nd Replay

<br />

***

## TV Coverage

<br />

### Which regions are covered with TV channel data?

We offer network TV data for the United States.

This will be available for:

* MLS
* World Cup
* EPL
* UEFA Champions League
* Bundesliga
* Liga MX
* Gold Cup.

<br />

***

## Sport Events Updated

<br />

### What prompts a match to appear in [Sport Events Updated](https://developer.sportradar.com/soccer/reference/soccer-extended-sport-events-updated)?

Changes to score, match status, or schedule in last 24 hours cause a match to display in this endpoint.

<br />

***

[Back to top ↑](#table-of-contents)

***

***

<br />

  ### More questions?

  Reach out to **[mediasupport@sportradar.com](mailto:mediasupport@sportradar.com)** for further assistance.

<br /><br />
