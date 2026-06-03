---
source_url: https://skillcorner.com/api/docs/
source_type: crawled
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
---

# SkillCorner Coordinate System (Tracking)

SkillCorner tracking gives player and ball positions on the pitch, frame by frame. Geometry is anchored to the match metadata rather than a fixed normalised grid.

## Pitch frame

The match object (`GET /match/{match_id}/`) exposes:

- **`pitch_length`** / **`pitch_width`** — the actual pitch dimensions in **metres**. Tracking coordinates are expressed against these dimensions, so the playable area differs per stadium.
- **`home_team_side`** — which side the home team plays toward (per period). Teams switch ends between halves, so you need this (together with `match_periods`) to orient both teams consistently and to know attacking direction.

The precise axis origin and sign convention are carried in the tracking file's metadata (for `fifa-xml`/`fifa-data`, in the EPTS `.xml`; for `jsonl`, per the SkillCorner glossary). Treat coordinates as metres on the `pitch_length × pitch_width` rectangle and resolve direction with `home_team_side` + period rather than assuming a fixed orientation.

## Linking tracking to players

Each tracked player carries a **`trackable_object`** id. Join it to `Player.trackable_object` (from `/players/` or the match lineup) to attach identity to a track. The ball is a distinct tracked object.

## File formats

- **`jsonl`** — one JSON frame per line (frame index, clock/period, tracked objects with positions, ball).
- **`fifa-xml` / `fifa-data`** — the [FIFA EPTS standard](https://www.fifa.com/technical/football-technology/standards/epts/research-development-epts-standard-data-format): a `.xml` metadata file (pitch, teams, players, sensor/coordinate definitions) + a `.txt` data file (the frames).

Current tracking `data_version` is `3`.

## Note on extrapolated tracking

The `/matches/` filter set distinguishes `tracking_last_modified__gte` from `extrapolated_tracking_last_modified__gte` (and a v3 variant). SkillCorner offers both measured broadcast tracking and **extrapolated** tracking (positions inferred when players are off-camera); check which product a match carries via `/data_collections/` before assuming full-frame coverage.
