---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-sport-event-extended-timeline
source_type: api_docs
upstream_version: Soccer Extended v4
crawled_at: 2026-07-09
---

# Sportradar Soccer Data Model

## IDs

Sportradar uses stable global IDs prefixed with `sr:`. Project code should store
these IDs, not display names.

| Entity | Example shape |
|---|---|
| Competition | `sr:competition:<id>` |
| Season | `sr:season:<id>` |
| Sport event / match | `sr:sport_event:<id>` |
| Competitor / team | `sr:competitor:<id>` |
| Player | `sr:player:<id>` |
| Venue | `sr:venue:<id>` |

Use mapping feeds when migrating between Soccer API versions, and player merge
mapping feeds when duplicate player profiles have been consolidated.

## Coverage Flags

Do not assume every match has every feed. Season and match responses include
coverage metadata that should drive UI fallbacks.

Important checks:

- whether the season/match has extended coverage;
- whether extended player stats are available;
- whether lineups and formation data are available;
- whether probabilities are part of the subscription;
- whether live timelines and push feeds are supported for the competition.

## Coordinates

Timeline event coordinates use a 0-100 pitch frame.

| Field | Meaning |
|---|---|
| `x` | horizontal event coordinate; `0` is at the home team's goal |
| `y` | vertical event coordinate; `0` is the top of the pitch when the home goal is on the left |
| `destination_x` | completed-pass end x coordinate |
| `destination_y` | completed-pass end y coordinate |
| `goalface_x` | shot goal-mouth x coordinate |
| `goalface_y` | shot goal-mouth y coordinate |

For charting, normalise these fields explicitly before mixing them with Opta,
StatsBomb, Wyscout, SkillCorner, or custom pitch coordinates.

## Timeline Event Fields

Extended timeline events contain both event identity and football semantics.
Useful chart/story fields include:

| Field | Notes |
|---|---|
| `type` | event type such as `goal_kick`, `period_start`, `yellow_card`; check enum docs for full list |
| `match_time` | match minute |
| `match_clock` | minute:second match clock |
| `stoppage_time` | added-time minute |
| `period` / `period_name` / `period_type` | period structure, extra time, penalties, pauses |
| `home_score` / `away_score` | score after the event |
| `competitor` | `home` or `away` |
| `counterattack` | boolean counterattack flag |
| `type_of_play` | shot context: set piece, open play, or individual |
| `xg_value` | xG value for a shot on goal |
| `body_type` | shot body part |
| `outcome` | event outcome, including on/off target, post, complete/incomplete, goal, saved |
| `additional_outcome` | shot detail such as hit woodwork, goal, saved, or goal prevented |
| `decision` / `description` | VAR decision state and outcome |

## Player Event Details

Timeline events can attach players with activity types such as scorer, assist,
substituted in/out, fouler, fouled, passer, receiver, tackler, won by, lost by,
and shot taker. For event-to-player joins, use the `sr:player:*` ID and not only
the name.

