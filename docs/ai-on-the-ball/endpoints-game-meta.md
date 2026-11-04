---
source_url: https://docs.aiontheball.nl/versions/v1/endpoints/game-meta/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Game meta

Read back the per-game meta envelope: team names and the derived kickoff side. See [Teams and sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md) for the `home`/`away` vs `team_a`/`team_b` vocabulary.

## Read the game meta

```
GET /v1/videos/{id}/meta
```

The resolved game-meta envelope:

```
{
  "game_name": "Home FC - Away FC",
  "home_team_name": "Home FC",
  "away_team_name": "Away FC",
  "left_start_team": "home"
}
```

- `home_team_name` / `away_team_name` are the team names as stored on the video, or `null` when unset.
- `left_start_team` is which team defends the left half at kickoff: `"home"`, `"away"` or `"unknown"`. It is derived; see [Teams and sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md).
