---
source_url: https://footystats.org/api/documentations/
source_type: curated
upstream_version: null
crawled_at: 2026-09-24
---

# FootyStats identity surfaces

How FootyStats identifies competitions, seasons, teams, players, managers and
matches, and what goes wrong when joining FootyStats to other sources. Checked against
live responses on 2026-09-24. The worked example comes from footballsiam.com, which
syncs Thai League data from FootyStats into its own database.

## FootyStats entity IDs

All IDs are integers, scoped per entity type.

| Entity | ID field | Where it appears | Stable across seasons? |
|---|---|---|---|
| Season (competition-season) | `id` on `league-season`; `season[].id` in `league-list`; `competition_id` on match, team, player and manager rows | Every season endpoint takes it as `season_id` (or `league_id`) | No: a new ID every season |
| Competition | `comp_master_id` on `league-season` | Only on `league-season` | Yes |
| Team | `id` on team rows; `homeID`, `awayID` on matches; `club_team_id` on player rows | | Yes, across seasons and competitions |
| Player | `id` on `league-players` and `player-stats`; `player_id` in lineups and goal details | | Yes |
| Manager | `id` on `manager`; `coach_a_ID`, `coach_b_ID` on matches | | Yes |
| Match | `id` on `league-matches` and `match` | | Yes |
| Referee | `refereeID` on matches | | Often null (see below) |
| Country | `id` on `country-list` | | Yes |

## Season IDs versus competition IDs

The ID the season endpoints need is a **season** ID. `league-list` lists them under
each league, for example Thai League 1:
`[{"id": 12475, "year": 20242025}, {"id": 15140, "year": 20252026}, {"id": 17367, "year": 20262027}]`.

Rows from every other endpoint carry the same number as `competition_id`, so
`competition_id` means "season ID" despite its name. To group seasons of the same
competition, use `comp_master_id` from `league-season`: 317 for both Thai League 1
seasons 15140 (2025/26) and 17367 (2026/27), and 315 for Thai League 2.

`year` in `league-list` is an integer such as `20262027` for a split season or `2026`
for a calendar-year season. The `season` label on rows is a string such as
`"2026/2027"` or `"2026"`.

## Team and player IDs across competitions

Team IDs don't change between competitions. Port is 1177 in Thai League 1 (season
17367) and in the AFC Champions League Elite (season 17381). `team?team_id=1177`
returns one row per competition-season (34 rows for Port), each with its own
`competition_id`.

Player IDs also persist, but **a player row's `club_team_id` is the club in that
competition-season**, not the player's current club. Reading last season's rows gives
last season's clubs. For a current club, take the row whose `competition_id` is the
current season. If a player has no row in any current season (for example after
moving abroad to a competition you have not chosen), FootyStats cannot tell you where
he is now.

## Names are labels, not keys

Display names differ between endpoints and can be out of date. Join on IDs.

| Team ID | `league-teams` `name` | `cleanName` | `home_name` on matches |
|---|---|---|---|
| 1182 | `Bangkok Glass FC` | `Bangkok Glass` | `Bangkok Glass` |
| 1171 | `Ratchaburi Mitr Phol FC` | `Ratchaburi` | `Ratchaburi` |
| 1177 | `Port FC` | `Port FC` | `Port FC` |
| 7038 | `Prachuap FC` | `Prachuap` | `Prachuap` |

Team 1182 plays as BG Pathum United, commonly shortened to Pathum United, but
FootyStats still labelled it with the older Bangkok Glass name in September 2026.
Sponsor words also appear inconsistently (`Ratchaburi Mitr Phol FC` against
`Ratchaburi`). Any publisher with a house naming style needs its own ID-to-name map.

Player names are romanised Thai names in one spelling, which may not match other
sources. FootyStats spells player 44432 "Peeradon Chamratsamee", while footballsiam.com
uses "Peeradol". A few player rows have every name field empty (`full_name`,
`known_as`, `first_name`, `last_name` all `""`) even though the ID and stats are
present.

## Referee identity is often missing

`refereeID` was `null` on all 24 completed Thai League 1 2026/27 matches checked, and
`league-referees?season_id=17367` returned an empty array. Referee joins are not
possible for these competitions. Check coverage for yours before relying on it.

## Joining FootyStats to other providers

FootyStats IDs are not in the Reep open identity register (its bridge list covers
Opta, Wyscout, Transfermarkt, StatsBomb, SportMonks, FotMob, SkillCorner and
API-Football, as of 2026-09-24). There is no published crosswalk, so joins are built
by hand:

- **Teams:** keep a fixed map of FootyStats team ID to your own ID or to the other
  provider's ID. The numbers are unrelated across providers: Port is 1177 in FootyStats
  and 2789 in API-Football. Build the map once per league and review it when promoted
  or relegated clubs appear.
- **Players:** match on several fields together: name, `birthday` (Unix seconds),
  nationality and the club in the same season. Do not match on name alone, because of
  the romanisation differences above.
- **Matches:** match on the date (`date_unix`, converted to local kick-off time) plus
  the two mapped team IDs.
- **Managers:** `coach_a_ID` and `coach_b_ID` on each match give the manager for that
  side on that day. The `manager` endpoint then gives names and records.

## Worked example: Thai League data at footballsiam.com

footballsiam.com syncs Thai League 1, 2 and 3, Laos, Cambodia and AFC competitions from
FootyStats into WordPress. What held up in practice:

1. **Season IDs are configured per competition per season**, and every new season means
   a new set of IDs to find in `league-list`. Thai League 3 alone has separate
   regional seasons (North, North East, East, South, West, Bangkok and Perimeter),
   each with its own ID.
2. **Clubs are mapped by FootyStats team ID** to the site's own club records, through a
   fixed dictionary. Promoted clubs are added by hand, and until then their matches
   fall back to plain-text team names.
3. **Players are created on first sight** keyed by FootyStats player ID, with the
   display name corrected where FootyStats' spelling differs from the site's.
4. **Current club comes from the current-season row only**. Charting last season's
   stats against last season's `club_team_id` put several players at clubs they had
   already left.
5. **Duplicate rows are removed** before totals are computed, because `player-stats`
   and `manager` repeat identical season rows.
