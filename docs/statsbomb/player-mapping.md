---
source_type: curated
source_url: https://github.com/statsbomb/open-data
upstream_version: "1.0.0"
crawled_at: null
---

# StatsBomb Player Mapping API

The Player Mapping endpoint bridges StatsBomb's **two internal ID systems** —
the *live* system and the *offline* system — for players, teams, and countries.
**Commercial API only**; there is no Open Data equivalent.

- Endpoint: `GET https://data.statsbomb.com/api/v1/player-mapping?<params>` (v1)
- Auth: HTTP Basic (StatsBomb credentials)

## Why this matters: live vs offline IDs

StatsBomb does not have a single player/team/country ID space. The same player
has a **`live_player_id`** (StatsBomb Live system) and a separate
**`offline_player_id`** (standard StatsBomb offline system); likewise
`live_team_id`/`offline_team_id` and `live_country_of_birth_id`/
`offline_country_of_birth_id`, and `live_match_id`/`offline_match_id`. Which ID
appears in a given feed depends on the system that produced it. This endpoint is
the authoritative crosswalk between the two.

Treat StatsBomb IDs as **(system, id)** pairs, not bare integers. A
`player_id` seen elsewhere is only unambiguous once you know whether it is a
live or offline id. See `identity-surfaces.md`.

## Request parameters

No query parameters → no data returned. Filters narrow the licensed set:

| Parameter | Type | Description |
|---|---|---|
| `competition-id` | integer | Desired competition id |
| `season-id` | integer | Desired season id |
| `live-player-id` | integer | Player id from the StatsBomb Live system |
| `offline-player-id` | integer | Player id from the offline system |
| `match-date-from` | yyyy-mm-dd | Only competition-season-team blocks with matches on/after this date |
| `match-date-to` | yyyy-mm-dd | Only blocks with matches on/before this date (combine with `-from` for a window) |

Size/shape controls:

| Parameter | Type | Description |
|---|---|---|
| `all-account-data` | boolean | Must be `true` to return all player data on the account (otherwise trimmed, to protect trialling users) |
| `add-matches-played` | boolean | Must be `true` to include the `matches_played` array per block |

Constraints:
- `live-player-id` and `offline-player-id` are **mutually exclusive** — supply
  at most one.
- If the query would return **more than 5000 records, the response is streamed
  to a file** as JSON instead of being returned as the inline payload. Plan for
  both delivery modes.
- Even when `match-date-from`/`-to` are set, `matches_played` (when requested)
  still returns **all** matches in the competition-season-team block, not just
  those in the date window.

Example — Jill Scott, 2020/21 FA WSL, with matches:

```
https://data.statsbomb.com/api/v1/player-mapping?season-id=90&competition-id=37&offline-player-id=10172&add-matches-played=true
```

## Response

JSON array of player-mapping blocks. One block per
**{competition, season, team}** the player appeared for — so a mid-season
transfer yields multiple blocks for the same player.

| Field | Type | Description |
|---|---|---|
| `competition_id` | integer | Competition id (some StatsBomb documentation misspells the key as `competiton_id`; the JSON payload uses `competition_id`) |
| `competition_name` | string | Competition name |
| `season_id` / `season_name` | integer / string | Season |
| `offline_team_id` | integer | Team id (offline system) |
| `live_team_id` | integer | Team id (Live system) |
| `team_name` | string | Team name |
| `team_gender` | string | Gender of competitions played by the team |
| `earliest_match_date` | yyyy-mm-dd | Earliest match the player appeared in for this block |
| `most_recent_match_date` | yyyy-mm-dd | Most recent match in this block |
| `offline_country_of_birth_id` | integer | Country-of-birth id (offline system) |
| `live_country_of_birth_id` | integer | Country-of-birth id (Live system) |
| `country_of_birth_name` | string | Country of birth name |
| `offline_player_id` | integer | Player id (offline system) |
| `live_player_id` | integer | Player id (Live system) |
| `player_name` | string | Player name |
| `player_nickname` | string | Player nickname (nullable) |
| `player_height` | number | Height (cm) |
| `player_weight` | number | Weight (kg) |
| `player_birth_date` | yyyy-mm-dd | Date of birth |
| `player_preferred_foot` | string | Recognised preferred foot (some StatsBomb documentation misspells the key as `player_perferred_foot`; the JSON payload uses `player_preferred_foot`) |
| `matches_played` | array | Matches in this block (only if `add-matches-played=true`) |

`matches_played[]` entries:

| Field | Type | Description |
|---|---|---|
| `offline_match_id` | integer | Match id (offline system) |
| `live_match_id` | integer | Match id (Live system) |
| `match_date` | yyyy-mm-dd | Date the match was played |

### Example response (abridged)

```json
[ {
  "competition_id": 37,
  "competition_name": "FA Women's Super League",
  "season_id": 90,
  "season_name": "2020/2021",
  "offline_team_id": 746,
  "live_team_id": 389,
  "team_name": "Manchester City WFC",
  "team_gender": "female",
  "earliest_match_date": "2020-09-05",
  "most_recent_match_date": "2021-01-17",
  "offline_country_of_birth_id": 68,
  "live_country_of_birth_id": 2,
  "country_of_birth_name": "England",
  "offline_player_id": 10172,
  "live_player_id": 32564,
  "player_name": "Jill Scott",
  "player_nickname": null,
  "player_height": 181.0,
  "player_weight": 68.0,
  "player_birth_date": "1987-02-02",
  "player_preferred_foot": "Right",
  "matches_played": [
    { "match_date": "2020-09-05", "live_match_id": 90335, "offline_match_id": 3764234 }
  ]
} ]
```

Note in the example how the **offline and live ids differ** for player
(10172 vs 32564), team (746 vs 389), country of birth (68 vs 2), and every
match — exactly the crosswalk this endpoint exists to provide.

## Relevance to reep

reep is the entity register that answers "who is this player?" and holds
provider cross-references. This endpoint is the canonical StatsBomb-internal
crosswalk: a `custom_id` bridge to StatsBomb must record **which system** an id
belongs to (live vs offline) and can use this endpoint to reconcile the two.
Mapping only a bare StatsBomb player id without its system risks colliding live
and offline spaces. The block-per-{competition,season,team} shape also captures
transfer history within a season, useful as relationship evidence.
