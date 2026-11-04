---
source_url: https://docs.aiontheball.nl/versions/v1/events/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Event Types

Event types detected by the analysis engine and returned by the [Events endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md).

The [Schema endpoint](https://docs.aiontheball.nl/versions/v1/endpoints/schema/index.md) lists the event types and properties a given analysis carries. Ball actions are queried with the [event_property filter](https://docs.aiontheball.nl/versions/v1/filters/event-property/index.md).

## Ball Actions

| Event Type                                                             | Description                                                                                         |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Pass](https://docs.aiontheball.nl/versions/v1/events/pass/index.md)   | A deliberate attempt to deliver the ball to a teammate. The unified pass event covers open-play...  |
| [Carry](https://docs.aiontheball.nl/versions/v1/events/carry/index.md) | A player moving with the ball at their feet while keeping control of it. The span covers...         |
| [Drive](https://docs.aiontheball.nl/versions/v1/events/drive/index.md) | A carry of at least 3 m: the player moved the ball somewhere under control. Derived from the...     |
| [Shot](https://docs.aiontheball.nl/versions/v1/events/shot/index.md)   | An attempt to score: a kick or other body contact directed at the opponent's goal, with any body... |

## Possession

| Event Type                                                                                     | Description                                                                                   |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [Team Possession](https://docs.aiontheball.nl/versions/v1/events/team-possession/index.md)     | A continuous span over which one team is in possession of the ball. Ends when possession...   |
| [Player Possession](https://docs.aiontheball.nl/versions/v1/events/player-possession/index.md) | A continuous span over which one specific player is the active ball-carrier. Distinct from... |

## Structure

| Event Type                                                                               | Description                                                                                        |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [Ball Phase](https://docs.aiontheball.nl/versions/v1/events/ball-phase/index.md)         | A continuous span describing whether the ball is in play, out of bounds, or in a stoppage....      |
| [Ball Pitchzone](https://docs.aiontheball.nl/versions/v1/events/ball-pitchzone/index.md) | A continuous span describing which longitudinal third of the pitch the ball is currently in....    |
| [Scene](https://docs.aiontheball.nl/versions/v1/events/scene/index.md)                   | A continuous span of the broadcast feed of a single scene type. `is_analysable` is true for the... |
| [Match Timeline](https://docs.aiontheball.nl/versions/v1/events/match-timeline/index.md) | A set of spans that place the match on the frame timeline, so every other event can be read...     |

## Match Events

| Event Type                                                           | Description                                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Goal](https://docs.aiontheball.nl/versions/v1/events/goal/index.md) | A goal: the ball has fully crossed the goal line between the posts and under the crossbar, and... |
