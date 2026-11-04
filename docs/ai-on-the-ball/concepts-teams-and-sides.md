---
source_url: https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.562Z
---
# Teams and sides

The API uses three team vocabularies. A team has two independent identities: its fixture role (home or away), and the engine's labels for the two squads it detects in the video before identity is known. Tracking output labels the squads `team_0` and `team_1`. Detected kits are labelled `team_a` and `team_b`.

| Vocabulary          | Where you see it                                                                                  | Meaning                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `home` / `away`     | Everything you send: video metadata. Also everything resolved: `team-mapping`, `left_start_team`. | The fixture axis. The only vocabulary you write.                                                                         |
| `team_0` / `team_1` | Tracking output (`player_id` prefixes like `"0-9"`).                                              | The engine's own labels for the two squads. They carry no identity. Resolve them with `GET /analyses/{id}/team-mapping`. |
| `team_a` / `team_b` | `GET /videos/{id}/preview-teams`.                                                                 | The two detected kits, in a canonical colour-sorted order. Identity unknown.                                             |

Sending `team_a`/`team_b` where `home`/`away` is expected returns `422` with an explanatory error.

## The side axis: `left_start_team`

Which team defends the left half at kickoff is a separate axis from home/away. It lives on the video as `left_start_team` (`"home"`, `"away"` or `"unknown"`). It is derived, and a correction never needs a re-run. Two sources answer it:

- You assert it, via `POST`/`PUT /videos` (`left_start_team`). An asserted side is authoritative and is never overwritten.
- A human answers it. The [confirm-sides widget](https://docs.aiontheball.nl/versions/v1/guides/confirm-sides-widget/index.md) asks which detected kit is the home team. The side follows from that answer plus the engine's reading of which squad started left.

An analysis starts immediately. Identity attaches to the results whenever a source lands, before, during or after the run.

## Resolving tracking data: `GET /analyses/{id}/team-mapping`

Tracking rows are keyed by `team_0`/`team_1`. The mapping endpoint returns, per label: its fixture role (`home`/`away`), whether it started left, and its display name. It also returns `identity_source`, which of the two sources above answered.

```
{
  "team_0": { "role": "home", "starts_left": true, "name": "Home FC" },
  "team_1": { "role": "away", "starts_left": false, "name": "Away FC" },
  "left_start_team": "home",
  "identity_source": "confirmed_kit"
}
```

- `role` is `home`, `away` or `null`. `null` means unknown. Render neutral labels (`Team 0`, `Team 1`) until it resolves.
- `identity_source`: `confirmed_kit` (widget answer), `asserted_side` (your `left_start_team`), or `null`.
- The same resolution is exposed on the video as `team_zero` (`home`/`away`/`null` in `GET /videos/{id}`): the fixture role of `team_0`, the `0-` prefix in player IDs.
- `team_0` is picked per analysis. When a video has several analyses, use each analysis's own `team-mapping`; the video's `team_zero` follows the most recent one. Your answers (widget kit, `left_start_team`) are stored on the video and apply to every analysis.

Analyses aggregated before this identity measurement existed have no answer recorded. `team_zero` and the `role` fields read `null` there until the analysis is re-aggregated.
