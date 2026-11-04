---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/summary/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Summary

Game summary for one analysis: metadata, team names, event counts, possession split, field tilt and per-player statistics.

## Request

```
GET /analyses/{id}/summary
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Analysis ID |

The response is aggregated on each request and may take several seconds. It is deterministic for a given analysis, apart from team names, which are resolved from the current team identity.

## Response

```
{
  "metadata": {
    "game_id": "2025-01-15_hub-1246",
    "game_date": "2025-01-15",
    "version": "0.4.98",
    "generated_at": "2025-01-20T14:30:00.000Z",
    "video_length_sec": 5425.5
  },

  "teams": {
    "team_0_name": "Team A",
    "team_1_name": "Team B"
  },

  "match_stats": {
    "event_counts": {
      "team_possession": 245,
      "player_possession": 1830,
      "scene": 12,
      "match_timeline": 1
    },
    "total_durations_sec": {
      "team_possession": 5280.5,
      "player_possession": 4920.3,
      "scene": 5400.0,
      "match_timeline": 5400.0
    },
    "analysable_duration_sec": 5320.0,
    "non_analysable_duration_sec": 80.0
  },

  "possession": {
    "summary": {
      "team_0": { "seconds": 1650.5, "pct": 53.8 },
      "team_1": { "seconds": 1420.0, "pct": 46.2 },
      "ball_out_of_play_sec": 1890.0,
      "unattributed_in_play_sec": 410.0
    },
    "per_minute": [
      { "minute": 0, "team_0_pct": 63.67, "team_1_pct": 36.33 },
      { "minute": 1, "team_0_pct": 47.5, "team_1_pct": 52.5 },
      { "minute": 2, "team_0_pct": 61.2, "team_1_pct": 38.8 }
      // ... one entry per match minute
    ]
  },

  "field_tilt": {
    "team_0_pct": 61.4,
    "team_1_pct": 38.6,
    "per_minute": [
      { "minute": 0, "value": null },
      { "minute": 1, "value": 0.214 }
      // ... one entry per match minute
    ]
  },

  "players": [
    {
      "player_id": "0-10",
      "team_id": "team_0",
      "jersey_number": 10,
      "name": "Team A #10",
      "stats": {
        "total_distance_m": 10542.5,
        "total_distance_m_est": 10380.0,
        "distance_by_speed_bucket": {
          "walking_m": 3200.0,
          "jogging_m": 4500.0,
          "running_m": 2200.0,
          "sprinting_m": 642.5
        },
        "avg_speed_kmh": 7.2,
        "max_speed_kmh": 32.1,
        "tracking_duration_sec": 5280.0,
        "minutes_covered": 89.5,
        "sprint_count": 6,
        "sprint_distance_m": 172.4,
        "sprints_est": 21,
        "sprint_distance_m_est": 590.0,
        "physical_withheld": null,
        "ball_actions": {
          "passes": 12,
          "carries": 8,
          "drives": 3,
          "shots": 2
        }
      }
    },
    {
      "player_id": "1-9",
      "team_id": "team_1",
      "jersey_number": 9,
      "name": "Team B #9",
      "stats": {
        "total_distance_m": 9876.32,
        "total_distance_m_est": 9730.0,
        "distance_by_speed_bucket": {
          "walking_m": 2800.0,
          "jogging_m": 4200.0,
          "running_m": 2100.0,
          "sprinting_m": 776.32
        },
        "avg_speed_kmh": 6.9,
        "max_speed_kmh": 30.5,
        "tracking_duration_sec": 5100.0,
        "minutes_covered": 88.0,
        "sprint_count": 4,
        "sprint_distance_m": 101.8,
        "sprints_est": 17,
        "sprint_distance_m_est": 470.0,
        "physical_withheld": null,
        "ball_actions": {
          "passes": 12,
          "carries": 8,
          "drives": 8,
... (example cut here; 3 KB in the source page)
```

## metadata

| Field              | Type   | Unit | Description                                      |
| ------------------ | ------ | ---- | ------------------------------------------------ |
| `game_id`          | string |      | Internal game identifier, `YYYY-MM-DD_hub-XXX`   |
| `game_date`        | string |      | ISO date taken from `game_id`, e.g. `2025-01-15` |
| `version`          | string |      | Pipeline version the analysis was produced with  |
| `generated_at`     | string |      | ISO timestamp this response was generated at     |
| `video_length_sec` | float  | s    | Total video duration                             |

## teams

| Field         | Type   | Description                                                                                                                                                                                |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `team_0_name` | string | Display name for `team_0`, resolved from team identity. `Team 0` while identity is unknown. See [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) |
| `team_1_name` | string | Display name for `team_1`. `Team 1` while identity is unknown                                                                                                                              |

## match_stats

All values are rounded to 2 decimal places.

| Field                         | Type   | Unit | Description                                                                                                                                                |
| ----------------------------- | ------ | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event_counts`                | object |      | Events per type, keyed by the [event type](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) names the analysis carries, `drive` included |
| `total_durations_sec`         | object | s    | Seconds covered per event type, same keys as `event_counts`                                                                                                |
| `analysable_duration_sec`     | float  | s    | Duration of gameplay                                                                                                                                       |
| `non_analysable_duration_sec` | float  | s    | Duration of replays, graphics and other non-gameplay footage                                                                                               |

## possession

Possession over the whole match and per minute, as a share of the in-play time credited to a team. See [Possession](https://docs.aiontheball.nl/versions/v1/concepts/possession/index.md). `summary` holds the same figures the [Team Report](https://docs.aiontheball.nl/versions/v1/endpoints/team-report/#possession) returns under `possession`.

| Field        | Type   | Description                                                                                                     |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------- |
| `summary`    | object | `team_0` and `team_1`, each `{seconds, pct}`, plus `ball_out_of_play_sec` and `unattributed_in_play_sec` (float |
| `per_minute` | array  | One entry per match minute, in order                                                                            |

### Summary bucket object

| Field     | Type  | Unit | Description                                                               |
| --------- | ----- | ---- | ------------------------------------------------------------------------- |
| `seconds` | float | s    | In-play time in possession                                                |
| `pct`     | float |      | Share of in-play time credited to a team, 0-100. The two teams sum to 100 |

### Per-minute object

| Field        | Type    | Unit | Description                                                                      |
| ------------ | ------- | ---- | -------------------------------------------------------------------------------- |
| `minute`     | integer | min  | Match minute, from 0                                                             |
| `team_0_pct` | float   |      | `team_0` share of the minute's in-play time credited to a team, 0-100            |
| `team_1_pct` | float   |      | `team_1` share, 0-100. Both are 0 when no team held the ball in play that minute |

## field_tilt

*Experimental.* Which team pinned the other back, over the match and per minute: the in-play seconds a team has the ball **in its attacking third**, read in that team's attacking direction (see [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md)). The per-minute curve sits beside `possession.per_minute`. Null when the attacking direction is unknown or the run has no detected ball. Measured on broadcast footage only: match share typical error 1.2 points; the per-minute curve follows ground truth at r 0.94.

| Field                      | Type  | Description                                          |
| -------------------------- | ----- | ---------------------------------------------------- |
| `team_0_pct`, `team_1_pct` | float | null                                                 |
| `per_minute`               | array | One `{minute, value}` entry per video minute, from 0 |

### Per-minute object

| Field    | Type    | Unit | Description          |
| -------- | ------- | ---- | -------------------- |
| `minute` | integer | min  | Video minute, from 0 |
| `value`  | float   | null |                      |

## players

One entry per detected player.

| Field           | Type   | Description                                                                                    |
| --------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `player_id`     | string | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md), e.g. `0-10` |
| `team_id`       | string | `team_0` or `team_1`                                                                           |
| `jersey_number` | int    | string                                                                                         |
| `name`          | string | Display name, e.g. `Team A #10`                                                                |
| `stats`         | object | Movement and ball action statistics                                                            |

### Stats object

Computed from the same speed series as the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md), so distance, top speed and buckets agree across the two endpoints. See [Speed & Distance](https://docs.aiontheball.nl/versions/v1/concepts/speed-distance/index.md). Values are rounded to 2 decimal places, except `minutes_covered` and `sprint_distance_m` (1) and the estimates (nearest 10 m).

| Field                      | Type    | Unit | Description                                                                                                                                                                                                                                                                                                                           |
| -------------------------- | ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `total_distance_m`         | float   | m    | `sum(speed) * 40 ms` over detected samples, so a detection gap contributes nothing rather than a straight-line dash                                                                                                                                                                                                                   |
| `total_distance_m_est`     | float   | null | m                                                                                                                                                                                                                                                                                                                                     |
| `distance_by_speed_bucket` | object  | m    | Distance per speed bucket                                                                                                                                                                                                                                                                                                             |
| `avg_speed_kmh`            | float   | null | km/h                                                                                                                                                                                                                                                                                                                                  |
| `max_speed_kmh`            | float   | km/h | Highest 1-second rolling-mean speed over contiguous measured windows, not the single fastest frame. Samples above a realistic ceiling are dropped first as tracking artifacts                                                                                                                                                         |
| `tracking_duration_sec`    | float   | s    | Detected samples times 40 ms. Off-camera gaps are not counted, so this is lower on non-broadcast footage                                                                                                                                                                                                                              |
| `minutes_covered`          | float   | min  | Minutes the player is accounted for: detected plus projected time. The window the estimates are projected over. Not the same as `tracking_duration_sec`, which counts detected time only. The same number as the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) `physical.minutes_covered` |
| `sprint_count`             | integer |      | Sprints counted in detected time. The same count as the length of the Player Report `physical.sprints`                                                                                                                                                                                                                                |
| `sprint_distance_m`        | float   | m    | Metres covered inside counted sprints, `0.0` when there are none. Not `distance_by_speed_bucket.sprinting_m`, which counts every stride at 21 km/h or above. The same number as the Player Report `physical.sprint_distance_m`                                                                                                        |
| `sprints_est`              | integer | null |                                                                                                                                                                                                                                                                                                                                       |
| `sprint_distance_m_est`    | float   | null | m                                                                                                                                                                                                                                                                                                                                     |
| `physical_withheld`        | string  | null |                                                                                                                                                                                                                                                                                                                                       |
| `ball_actions`             | object  |      | Ball action counts                                                                                                                                                                                                                                                                                                                    |

Warning

Distance and bucket totals are sums over detected time. A substitute or a player far from the camera has a lower `total_distance_m` for that reason alone. Show `tracking_duration_sec` next to any total.

### Distance by speed bucket object

Bucket edges are defined in [Speed & Distance](https://docs.aiontheball.nl/versions/v1/concepts/speed-distance/#speed-buckets).

| Field         | Type  | Unit | Description                |
| ------------- | ----- | ---- | -------------------------- |
| `walking_m`   | float | m    | Distance at walking pace   |
| `jogging_m`   | float | m    | Distance at jogging pace   |
| `running_m`   | float | m    | Distance at running pace   |
| `sprinting_m` | float | m    | Distance at sprinting pace |

### Ball actions object

| Field     | Type    | Description                                                                                                                                                                        |
| --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `passes`  | integer | Passes                                                                                                                                                                             |
| `carries` | integer | Carries                                                                                                                                                                            |
| `drives`  | integer | Carries of at least 3 m ([`drive`](https://docs.aiontheball.nl/versions/v1/events/drive/index.md) events). Each is also counted in `carries`. `0` before analysis version `0.5.45` |
| `shots`   | integer | Shots                                                                                                                                                                              |
