---
source_url: https://docs.aiontheball.nl/versions/v1/concepts/pitch-coordinates/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.561Z
---
# Pitch Coordinates

The pitch model every position in the API is expressed in, and the frames those positions can be reported in.

## Pitch model

Every analysis uses one pitch of 105 m by 68 m. The origin `(0, 0)` is a corner: `x` runs 0-105 along the length, `y` runs 0-68 across the width.

| Context                                              | Unit        | Conversion    |
| ---------------------------------------------------- | ----------- | ------------- |
| API filters, reports, `query-intervals` pitch coords | metres      | direct        |
| Tracking download                                    | centimetres | divide by 100 |

## Zone bounds

| Feature            | X range  | Y range     |
| ------------------ | -------- | ----------- |
| Full pitch         | 0-105    | 0-68        |
| Left half          | 0-52.5   | 0-68        |
| Right half         | 52.5-105 | 0-68        |
| Left third         | 0-35     | 0-68        |
| Middle third       | 35-70    | 0-68        |
| Right third        | 70-105   | 0-68        |
| Left penalty area  | 0-16.5   | 13.85-54.15 |
| Right penalty area | 88.5-105 | 13.85-54.15 |
| Left 6-yard box    | 0-5.5    | 24.85-43.15 |
| Right 6-yard box   | 99.5-105 | 24.85-43.15 |
| Left goal          | 0        | 30.34-37.66 |
| Right goal         | 105      | 30.34-37.66 |

## Team orientation

Which goal a team defends at kickoff is measured, not implied by its label. `team_0` is a shirt-cluster label and is not guaranteed to be the left-starting team. Read `starts_left` per label from `GET /analyses/{id}/team-mapping` ([Teams & Sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md)) before writing a zone query against a fixed end. Teams normally change ends at half time, so a zone fixed in `x` covers opposite ends of the pitch in the two halves.

## Coordinate frames

A frame is how the raw camera coordinates are rotated.

| Frame                  | Meaning                                                                                                                                                                                              | Where it appears                                                                                                                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `camera`               | As filmed, with no attacking-direction rotation. Both teams' coordinates are in one raw frame, so the two teams' `x` are not comparable and thirds and goal distances carry no meaning               | `POST /query-intervals` (default) and the tracking download; the reports when the run's sides could not be determined                                                                                                                             |
| `attacking`            | Rotated so the reported team always attacks towards `+x`, opponent goal at `x = 105`, in both halves. Two players on the same team are directly comparable regardless of the end they started at     | [Player Report](https://docs.aiontheball.nl/versions/v1/endpoints/player-report/index.md) and [Team Report](https://docs.aiontheball.nl/versions/v1/endpoints/team-report/index.md); `POST /query-intervals` with `coordinate_frame: "attacking"` |
| `attacking_first_half` | The attacking frame using the first half's direction for the whole match, because the moment the teams changed ends could not be located. Second-half coordinates are mirrored relative to the first | The reports and `query-intervals` `attacking`, when the half boundary is unknown                                                                                                                                                                  |

The reports state the frame they used in their top-level `coordinate_frame` field. `POST /query-intervals` is `camera` by default; request `coordinate_frame: "attacking"` to rotate the pitch coords, and each row then carries the `coordinate_frame` that was applied ([Query Intervals](https://docs.aiontheball.nl/versions/v1/endpoints/query-intervals/index.md)). The rotation uses the same team sides everywhere, so a report position and a `query-intervals` `attacking` position for the same event agree.

The `ball_location` filter's `team_side_perspective` applies the same rotation to a query: it rotates the requested zone into a team's attacking frame, so `x = 70-105` means their attacking third in both halves. When the half boundary is unknown, the first-half direction is applied to the whole match, so the zone is the wrong end in the second half. When the sides are unknown, the zone is evaluated in the camera frame.

Warning

Only `attacking` is safe to render against a fixed pitch. A run whose sides are unknown returns `camera`, where thirds, goal distances and cross-team `x` comparisons are wrong rather than missing.
