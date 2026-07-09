---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-overview
source_type: api_docs
upstream_version: Soccer Extended v4
crawled_at: 2026-07-09
---

# Sportradar Soccer Extended Endpoints

## Discovery And Schedules

Use the primary feeds to discover IDs before calling match, competitor, player,
or season-specific endpoints.

| Feed | Purpose |
|---|---|
| Competitions | list available soccer competitions |
| Competition Seasons | seasons for a competition; docs note a maximum of three seasons per competition response |
| Seasons | historical season catalogue |
| Season Schedule | all matches for a season, with scoring and coverage metadata |
| Daily Schedules | match information for a given date |
| Daily Summaries | scheduled matches for a given date |
| Live Schedules | currently live matches |
| Live Summaries | live matches with scoring and team/player stats where covered |

## Competitors And Players

| Feed | Purpose |
|---|---|
| Competitor Profile | team profile, roster, manager, venue, team colours |
| Competitor Schedules | upcoming matches and recent results for a team |
| Competitor Summaries | previous/upcoming match summaries for a team |
| Competitor Versus Competitor | head-to-head matches and stats for two teams |
| Player Profile | player biography and team membership |
| Player Schedules | recent matches for a player |
| Player Summaries | match summaries/statistics for recent player appearances |
| Player Mappings | player ID mapping between Soccer API versions |
| Player Merge Mappings | replacement IDs after duplicate player profiles are merged |

## Match Feeds

| Feed | Purpose |
|---|---|
| Sport Event Summary | real-time match-level scoring, stats, and channel availability according to coverage |
| Sport Event Timeline | play-by-play event timeline, stats, scoring, event coordinates, and descriptions |
| Sport Event Extended Summary | extended match-level player and team stats by period, with 100+ data points |
| Sport Event Extended Timeline | extended event timeline with passes, tackles, dribbles, interceptions, coordinates, and metadata |
| Sport Event Lineups | starting players, substitutions, formations, and broadcast channel availability |
| Sport Event Momentum | minute-by-minute team momentum values |
| Sport Event Fun Facts | human-readable statistical facts for a match |
| Sport Event Insights | selected AI-generated pre-match and live insights |

## Season And Competition Feeds

| Feed | Purpose |
|---|---|
| Season Information | participating teams and coverage metadata for a season |
| Season Competitors | teams in a season |
| Season Players | participating players |
| Season Lineups | match lineups and substitutions for a season |
| Season Standings | standings table |
| Season Summaries | season match summaries and match-level statistics |
| Season Transfers | player transfers |
| Season Missing Players | injured and missing players |
| Season Leaders | leaders for goals, assists, cards, minutes, and related stats |
| Seasonal Competitor Statistics | team and player seasonal statistics |
| Seasonal Competitor Extended Statistics | extended season player/team stats with 100+ data points |

## Update And Push Feeds

| Feed | Purpose |
|---|---|
| Sport Events Created | sport event IDs created in the last 24 hours |
| Sport Events Updated | sport event IDs updated in the last 24 hours |
| Sport Events Removed | sport event IDs removed or deleted |
| Live Timelines Delta | ten-second live delta with scoring and timeline changes |
| Push Events | real-time event updates for live matches |
| Push Statistics | real-time team and player match-level statistics |

## Probabilities

Probability endpoints are part of an additional Soccer Extended probabilities
plan. They cover pre-match, live, timeline, season, and outright probabilities.

| Feed | Purpose |
|---|---|
| Live Probabilities | live match probability state |
| Sport Event Probabilities | pre-match and live probabilities for a match |
| Timeline Probabilities | probability changes through the match timeline |
| Season Probabilities | home/draw/away probabilities for all matches in a season |
| Season Outright Probabilities | outright probabilities for season competitors |

