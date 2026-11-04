---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/team-report/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Team Report

Match report for both teams: average formation shape, possession split, territory and analysis quality.

## Request

```
GET /analyses/{id}/team-report
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Analysis ID |

The first request computes the report and caches it server-side; later requests are fast. The response is deterministic per `(analysis_id, schema_version)` except for `teams[].name`, which is resolved at read time. Confirming sides after the analysis finished can also change `orientation_source` and the positions.

## Response

```
{
  "schema_version": 5,
  "engine_version": "0.5.44",
  "coordinate_frame": "attacking",
  "orientation_source": "game_meta",

  "params": {
    "sample_interval_ms": 40,
    "sprint_min_kmh": 25.2,
    "sprint_min_s": 1.0,
    "top_speed_percentile": 0.99,
    "top_speed_ceiling_kmh": 36.0,
    "reliable_seconds_floor": 600.0,
    "est_seconds_floor": 300.0,
    "hull_central_fraction": 0.8,
    "max_sample_gap_ms": 400,
    "sequence_gap_ms": 5000,
    "sequence_shot_slack_ms": 1000,
    "drive_min_length_m": 3.0,
    "take_on_max_opp_dist_m": 1.5,
    "pitch": { "length_m": 105.0, "width_m": 68.0 }
  },

  "teams": [
    {
      "team": 0,
      "name": "Team A",
      "kit": {
        "primary": "red",
        "primary_rgb": [200, 16, 46],
        "secondary": "white",
        "secondary_rgb": [255, 255, 255],
        "pattern": "solid"
      },
      "physical": {
        "distance_m_est": 108840.0,
        "distance_per_min": 116.4,
        "n_players_est": 11
      },
      "average_positions": [
        {
          "player_id": "0-10",
          "jersey": 10,
          "label": "10",
          "role": "player",
          "position": { "x": 61.7, "y": 41.5 },
          "n_frames": 124510
        },
        {
          "player_id": "0-11",
          "jersey": 11,
          "label": "11",
          "role": "player",
          "position": { "x": 53.6, "y": 18.0 },
          "n_frames": 35332
        },
        {
          "player_id": "0-GK",
          "jersey": null,
          "label": "GK",
          "role": "goalkeeper",
          "position": { "x": 9.4, "y": 34.1 },
          "n_frames": 121904
        }
        // ... one entry per detected player on this team
      ]
    },
    {
      "team": 1,
      "name": "Team B",
      "kit": {
        "primary": "sky_blue",
        "primary_rgb": [108, 171, 221],
        "secondary": "navy",
        "secondary_rgb": [28, 40, 82],
        "pattern": "stripes"
      },
      "physical": {
        "distance_m_est": 112300.0,
        "distance_per_min": 119.1,
        "n_players_est": 12
      },
      "average_positions": [
        {
          "player_id": "1-9",
          "jersey": 9,
          "label": "9",
          "role": "player",
          "position": { "x": 68.2, "y": 33.4 },
          "n_frames": 88959
        }
        // ... one entry per detected player on this team
      ]
    }
  ],

  "possession": [
    { "team": 0, "seconds": 1831.8, "pct": 53.36 },
    { "team": 1, "seconds": 1601.5, "pct": 46.64 }
  ],
  "ball_out_of_play_sec": 1874.0,
  "unattributed_in_play_sec": 397.5,

  "territory": [
    { "zone": "attacking_third", "seconds": 1204.6 },
    { "zone": "defensive_third", "seconds": 1388.2 },
    { "zone": "middle_third",    "seconds": 2411.9 }
  ],

  "quality": {
    "score": 71.0,
    "grade": "fair",
    "reasons": [
      { "code": "pitch_not_located", "severity": "major", "segments": 10, "impact": 29 }
    ]
  }
}
```

## Top level

| Field                | Type    | Description                                                                      |
| -------------------- | ------- | -------------------------------------------------------------------------------- |
| `schema_version`     | integer | Version of this response shape. See [Schema version](#schema-version)            |
| `engine_version`     | string  | Pipeline version the analysis was produced with                                  |
| `coordinate_frame`   | string  | `attacking`, `attacking_first_half` or `camera`. See [Coordinates](#coordinates) |
| `orientation_source` | string  | null                                                                             |

## params

Thresholds the report was computed with, identical to the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/#params). Read edges and thresholds from here rather than hardcoding them.

## teams

Always two entries, `team: 0` first.

| Field               | Type    | Description                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `team`              | integer | `0` or `1`, the shirt-cluster label. Resolve to home/away via [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md)                                                                                                                                                                                        |
| `name`              | string  | Display name, resolved from team identity at read time. Confirming sides after the analysis finished is reflected on the next request. `Team 0` / `Team 1` while identity is unknown                                                                                                                                                            |
| `kit`               | object  | null                                                                                                                                                                                                                                                                                                                                            |
| `physical`          | object  | Team distance estimate, summed over the players with an estimate                                                                                                                                                                                                                                                                                |
| `average_positions` | array   | One entry per detected player on the team, numeric jerseys ascending then non-numeric suffixes such as `0-GK`, the order [Player IDs](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md) and [Summary](https://docs.aiontheball.nl/versions/v1/endpoints/summary/index.md) use. A player with no detected tracking is absent |

### Physical object

The per-player [`distance_m_est`](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/#physical) summed over the team. Only players over `params.est_seconds_floor` measured seconds contribute, so this is a lower bound when some were tracked too little to estimate. Read it with `n_players_est`.

| Field              | Type    | Unit | Description                                                                    |
| ------------------ | ------- | ---- | ------------------------------------------------------------------------------ |
| `distance_m_est`   | float   | null | m                                                                              |
| `distance_per_min` | float   | null | m                                                                              |
| `n_players_est`    | integer |      | Players on the team that had an estimate and so contributed. `0` when none did |

### Average position object

| Field       | Type    | Unit | Description                                                                                                                                                                                             |
| ----------- | ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `player_id` | string  |      | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md), e.g. `0-10`. Accepted by [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md)   |
| `jersey`    | int     | null |                                                                                                                                                                                                         |
| `label`     | string  |      | Id suffix, e.g. `"10"` or `"GK"`                                                                                                                                                                        |
| `role`      | string  |      | `goalkeeper` or `player`                                                                                                                                                                                |
| `position`  | {x, y}  | m    | Mean position over the whole match. For a per-half mean read `position.avg_position` from the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/#average-position-object) |
| `n_frames`  | integer |      | Frames behind the mean. A substitute detected for ten minutes appears in this list next to a player detected for ninety; scale the marker by `n_frames` or drop entries below a threshold of your own   |

## possession

Two entries, team 0 then team 1, aligned with `teams[]` by index and by `team`: the split of in-play time credited to a team, summing to 100. Top-level `ball_out_of_play_sec` and `unattributed_in_play_sec` (float | null, s) hold the time left out. See [Possession](https://docs.aiontheball.nl/versions/v1/concepts/possession/index.md). The same figures [Summary](https://docs.aiontheball.nl/versions/v1/endpoints/summary/#possession) returns under `possession.summary`.

| Field     | Type  | Unit | Description                                     |
| --------- | ----- | ---- | ----------------------------------------------- |
| `team`    | int   |      | `0` or `1`                                      |
| `seconds` | float | s    | In-play time in possession                      |
| `pct`     | float |      | Share of in-play time credited to a team, 0-100 |

## territory

In-play time the ball spent in each longitudinal third, sorted by zone name. The split is calibrated on optical tracking: about 1 point typical error per third on broadcast footage (raw it read the defensive third some 10 points high); not yet measured on club-camera footage. One match-wide split, not a per-team one; for a team's own territory profile combine the possession filters on [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md). `[]` when the analysis carries no pitch-zone spans.

| Field     | Type   | Unit | Description                                                                                                                                                                                                                                                                                           |
| --------- | ------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zone`    | string |      | Pitch-zone name from the analysis, currently `defensive_third`, `middle_third` or `attacking_third`, relative to the team in possession. Treat it as an open string and render an unfamiliar name as-is. See [Ball Pitchzone](https://docs.aiontheball.nl/versions/v1/events/ball-pitchzone/index.md) |
| `seconds` | float  | s    | In-play time the ball spent in that zone (calibrated; the zones sum to the in-play time)                                                                                                                                                                                                              |

## quality

Reliability of the analysis behind the report, the same shape as `quality` on [Get Analysis](https://docs.aiontheball.nl/versions/v1/endpoints/analyses/#quality). Null when the analysis was never scored.

| Field     | Type   | Description                                              |
| --------- | ------ | -------------------------------------------------------- |
| `score`   | float  | null                                                     |
| `grade`   | string | null                                                     |
| `reasons` | array  | Factors that lowered the score. `[]` when there are none |

### Reason object

| Field      | Type   | Description                                 |
| ---------- | ------ | ------------------------------------------- |
| `code`     | string | Reason identifier, e.g. `pitch_not_located` |
| `severity` | string | null                                        |
| `segments` | int    | null                                        |
| `impact`   | int    | null                                        |

## Coordinates

Coordinates are metres in `x` / `y` fields and points are `{x, y}`. Positions are rotated so that each team attacks from `x = 0` towards `x = 105`, as in the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/#coordinates). `coordinate_frame` states how far that rotation could be resolved:

| Value                  | Meaning                                                                                                                                                                                                    |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attacking`            | Both halves oriented for each team                                                                                                                                                                         |
| `attacking_first_half` | The first-half direction applied to the whole match because the moment the teams changed ends could not be located. Second-half positions are mirrored                                                     |
| `camera`               | No attacking direction. Raw camera-frame coordinates as in [Pitch Coordinates](https://docs.aiontheball.nl/versions/v1/concepts/pitch-coordinates/index.md); both teams are then already in the same frame |

Warning

In `attacking` and `attacking_first_half` the rotation is per team, so `teams[0].average_positions` and `teams[1].average_positions` are in different frames. To draw both on one pitch as opponents, mirror one team through the centre point: `x' = params.pitch.length_m - x`, `y' = params.pitch.width_m - y`.

Warning

Every position here is a whole-match mean. In `attacking_first_half` the halves are in opposite frames, so each mean averages a player's first-half position with the mirror image of their second-half one and the formation shape pulls towards the halfway line.

## Time

Durations are seconds in `seconds`, distances end in `_m`, speeds in `_kmh`, and timestamps are milliseconds from video start in fields ending `_ms`. Divide a `_ms` value by 1000 to align with the `start` / `end` seconds of [Events](https://docs.aiontheball.nl/versions/v1/endpoints/events/index.md) and [Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md).

## Schema version

`schema_version` is the same integer the [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/#schema-version) carries and is bumped for both reports together when a field is added, removed or renamed, or a threshold in `params` changes. Currently `5`. Key caches on `(analysis_id, schema_version)`, and refresh when team identity changes because `teams[].name` moves without the version moving.
