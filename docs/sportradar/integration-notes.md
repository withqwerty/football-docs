---
source_url: https://developer.sportradar.com/soccer/docs/soccer-api-vs-soccer-extended-api
source_type: api_docs
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-07-09
---

# Sportradar Integration Notes

## Soccer API Versus Soccer Extended

Use the base Soccer API when the product needs broad fixtures, scores,
standings, team/player profiles, transfers, and standard timelines.

Use Soccer Extended when the product needs advanced live/editorial data:

- event coordinates;
- 100+ extended player and team stats;
- passes, tackles, dribbles, crosses, blocks, interceptions, and chances created;
- period splits;
- live or pre-match probabilities;
- momentum values;
- AI-generated match insights and text summaries;
- push event/statistics feeds for low-latency live surfaces.

## Data Retrieval Pattern

Most workflows start from a schedule or season endpoint, then drill into sport
events, competitors, players, and statistics with `sr:*` IDs.

Common examples:

- Find a match: Daily Schedules -> `sport_event_id`.
- Build a match centre: Sport Event Summary -> Timeline -> Lineups -> Extended Summary.
- Build a season page: Competitions -> Competition Seasons -> Season Schedule -> Season Standings -> Seasonal Competitor Statistics.
- Build a player page: Competitor Profile or Season Players -> Player Profile -> Player Summaries.
- Monitor live data: Live Schedules -> Live Timelines Delta and Push Events/Statistics.

## Failover Behaviour

Live data can degrade if a deeper scout feed is unavailable. In failover cases,
the API may return only basic events such as goals, cards, substitutions, shots,
corners, assists, offsides, and sometimes only limited player names.

Production integrations should expose the current coverage/availability state
instead of silently filling missing advanced fields.

## Where It Fits Against Other Football Docs Providers

| Need | Better first lookup |
|---|---|
| Official broad schedules, scores, timelines, and live probabilities | Sportradar |
| Deep commercial event data with Opta-style qualifiers | Opta / Stats Perform |
| Hudl/Wyscout event model and glossary metrics | Wyscout |
| Broadcast tracking and physical/Game Intelligence data | SkillCorner |
| Public Python visualisation patterns | mplsoccer |
| Free public season aggregates | FBref / soccerdata |

