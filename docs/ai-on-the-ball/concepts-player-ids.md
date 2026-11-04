---
source_url: https://docs.aiontheball.nl/versions/v1/concepts/player-ids/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Player IDs

The `player_id` string that identifies a player in every endpoint and filter.

## Format

```
{team}-{jersey}
```

| Component | Values          | Description                                                                                                                              |
| --------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `team`    | `0` or `1`      | Shirt-cluster label. Resolve to home/away via [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) |
| `jersey`  | number, or `GK` | Shirt number. Always `GK` for a goalkeeper, whose number is not read                                                                     |

| Player ID | Meaning            |
| --------- | ------------------ |
| `0-10`    | Team 0, shirt 10   |
| `1-7`     | Team 1, shirt 7    |
| `1-99`    | Team 1, shirt 99   |
| `0-GK`    | Team 0, goalkeeper |
| `1-GK`    | Team 1, goalkeeper |

Filter and request by the exact id the API returned. A player returned as `0-GK` is not addressable as `0-1`.

## Team assignment

`team_0` and `team_1` are the engine's own labels for the two shirt clusters it detects, fixed before anything about sides or fixture roles has been measured. They carry no identity: `team_0` is not the left, home, or first-named team.

| Source                            | Field                                 | Resolves                                    |
| --------------------------------- | ------------------------------------- | ------------------------------------------- |
| `GET /videos/{id}`                | `team_zero`: `home`, `away` or `null` | Who the `0-` prefix is                      |
| `GET /analyses/{id}/team-mapping` | per label                             | Fixture role, side at kickoff, display name |

`null` means unknown; the system never guesses. Render neutral labels ("Team 0", "Team 1") until it resolves. See [Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) for how identity is resolved and corrected.

## Identity fields across endpoints

`player_id` is the join key everywhere. The [Summary](https://docs.aiontheball.nl/versions/v1/endpoints/summary/index.md), a legacy shape kept stable for existing clients, and the match [reports](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) name the same identity with different fields.

| Concept        | Summary and filters                                                 | Player & Team reports                                   |
| -------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| Team           | `team_id`: `"team_0"` / `"team_1"` (string)                         | `team`: `0` / `1` (int)                                 |
| Shirt number   | `jersey_number`: int, or the raw suffix string for a non-numeric id | `jersey`: int, or `null` when the suffix is not numeric |
| Display suffix | folded into `name`                                                  | `label`: the raw suffix (`"7"`, `"GK"`)                 |

`team_id: "team_0"` is `team: 0`, and a `0-GK` id is `jersey_number: "GK"` on the summary but `jersey: null` with `label: "GK"` on the reports. Match rows across endpoints on `player_id`, never on the team or jersey fields.

## Identification confidence

Tracking rows carry `player_id_conf`, the confidence of the identification.

| Value   | Meaning                              |
| ------- | ------------------------------------ |
| > 0.8   | High confidence                      |
| 0.5-0.8 | Medium confidence                    |
| < 0.5   | Low confidence                       |
| `null`  | Player detected, jersey not readable |

From analysis version `0.5.36`, tracking rows also carry a `status` column, an `overlap_partner_id` for overlapping detections, and an `identity_conf` for projected (off-camera) rows. See [Row Status](https://docs.aiontheball.nl/versions/v1/endpoints/tracking/#row-status).
