---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/exemplar-crops/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.560Z
---
# Exemplar Crops

Representative appearance images of each tracked player and of each team, selected from across the match.

Crops need engine version 0.5.30 or later. Older analyses return `404` on all three endpoints.

| Endpoint                                                            | Description          |
| ------------------------------------------------------------------- | -------------------- |
| `GET /analyses/{id}/exemplar-crops`                                 | List available crops |
| `GET /analyses/{id}/exemplar-crops/individuals/{player_id}/{index}` | One player crop      |
| `GET /analyses/{id}/exemplar-crops/teams/{team}/{index}`            | One team crop        |

## List crops

```
GET /analyses/{id}/exemplar-crops
```

| Parameter | Type    | Required | Description |
| --------- | ------- | -------- | ----------- |
| `id`      | integer | Yes      | Analysis ID |

### Response

```
{
  "individuals": {
    "0-GK": 5,
    "0-2": 5,
    "0-4": 5,
    "0-5": 5,
    "1-GK": 5,
    "1-2": 5,
    "1-4": 5
  },
  "teams": {
    "team_0": 10,
    "team_1": 10
  }
}
```

| Field         | Type   | Description                                                                                                                                            |
| ------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `individuals` | object | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md) to number of available crops, typically 5                            |
| `teams`       | object | `team_0`, `team_1`, `goalkeeper_0` or `goalkeeper_1` to number of available crops, typically 10. A key is absent when the analysis has no crops for it |

## Get a player crop

```
GET /analyses/{id}/exemplar-crops/individuals/{player_id}/{index}
```

| Parameter   | Type    | Required | Description                                                                                              |
| ----------- | ------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `id`        | integer | Yes      | Analysis ID                                                                                              |
| `player_id` | string  | Yes      | [Player ID](https://docs.aiontheball.nl/versions/v1/concepts/player-ids/index.md), e.g. `0-10` or `1-GK` |
| `index`     | integer | Yes      | Crop index from `0` to the count the listing reports minus 1                                             |

Returns a JPEG image, `image/jpeg`.

## Get a team crop

```
GET /analyses/{id}/exemplar-crops/teams/{team}/{index}
```

| Parameter | Type    | Required | Description                                                  |
| --------- | ------- | -------- | ------------------------------------------------------------ |
| `id`      | integer | Yes      | Analysis ID                                                  |
| `team`    | string  | Yes      | `team_0`, `team_1`, `goalkeeper_0` or `goalkeeper_1`         |
| `index`   | integer | Yes      | Crop index from `0` to the count the listing reports minus 1 |

Returns a JPEG image, `image/jpeg`.
