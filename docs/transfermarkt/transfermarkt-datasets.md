---
source_type: curated
source_url: https://github.com/dcaribou/transfermarkt-datasets
upstream_version: release of 2026-09-05 (commit e44f186)
crawled_at: 2026-10-08
---

# Transfermarkt datasets (dcaribou/transfermarkt-datasets)

`transfermarkt-datasets` is a community project, not Transfermarkt's own
data. It scrapes Transfermarkt pages and publishes the result as CSV files.
The repository licence is CC0-1.0. The files are published at
`https://pub-e682421888d945d684bcae8890b0ec20.r2.dev/data/<name>.csv.gz`
(for example `player_valuations.csv.gz`, `players.csv.gz`, `clubs.csv.gz`).
The notes below were checked against the release of 2026-09-05 (files last
modified 2026-09-05, repository commit `e44f186`).

## Status: updates paused since July 2026

The project's updates are paused, and the data is frozen. Its README and its
status announcement (discussion #383, 2026-09-05) say the collection pipeline
stopped completing in mid-July 2026: the last successful collection run was
on 10 July 2026 and the last data update was published on 11 July 2026.
There is no estimated date for updates to resume.

| File | Nothing after |
|---|---|
| `games`, `game_events` | 2026-07-06 |
| `appearances` | 2026-06-28 |
| `player_valuations` | 2026-06-12 |

2026/27 squads are not covered. The files published before the pause are
still available to download. The 2026-09-05 release changed only the CSV
quoting and the README, not the data. Do not treat the latest
`player_valuations` row as a player's current value, or `players.csv` as
current squads.

## player_valuations columns

`player_valuations.csv.gz` has one row per market value record. The project
describes it as "one row per player value record. Player value records appear
as a result of a change in the player market value." The primary key is
(`player_id`, `date`).

| Column | Where it comes from |
|---|---|
| `player_id` | Transfermarkt player ID |
| `date` | Date of the market value record |
| `market_value_in_eur` | The market value, in euros |
| `current_club_name` | The club name in the player's market value history, for that record |
| `current_club_id` | Derived by the project: see below. Not the club at the valuation date. |
| `player_club_domestic_competition_id` | The domestic competition of the club in `current_club_id`, so it has the same problem |

## current_club_id is not the club at the valuation date

In `player_valuations`, `current_club_id` is not Transfermarkt's club for that
valuation. The project derives it (`dbt/models/curated/player_valuations.sql`,
changed on 2026-02-14 to fix issue #137):

- the `to_club_id` of the player's latest transfer in the project's
  `transfers` table dated on or before the valuation date;
- if there is no such transfer, the player's `current_club_id` from
  `players.csv`, which is the club at scrape time.

So when the `transfers` table misses a move (for example a loan or a
lower-league transfer), `current_club_id` keeps the club of an earlier
recorded transfer, or holds the club at scrape time. `current_club_name`
comes from the market value history itself and follows the player's moves.
`player_club_domestic_competition_id` is looked up from `current_club_id`,
so it can also name the wrong competition.

Checked on the release of 2026-09-05, over the 407,084 valuation rows dated
from 2018-06-01:

- `current_club_id` is found in `clubs.csv` for 81.8% of rows. Of those, the
  club's name agrees with `current_club_name` (first six characters,
  ignoring case) for 63.9%.
- 49% of the 37,640 players have more than one `current_club_id` in the
  period, and 82% have more than one `current_club_name`.
- Example: player 143219 is valued on 2023-02-22 and 2023-06-07 with
  `current_club_name` "Budafoki MTE", but `current_club_id` 31 (Liverpool FC)
  and `player_club_domestic_competition_id` "GB1".
- Where the transfers are recorded, the two agree: player 203460 (Jack
  Grealish) has Aston Villa (405) up to 2021-05-28 and Manchester City (281)
  from 2021-10-05 in both columns.

### Building a club's squad value at a past date

- Do not assign valuations to clubs by `current_club_id` or by
  `player_club_domestic_competition_id`.
- Use `current_club_name` for the club at the valuation date: take each
  player's latest valuation on or before the date and group by
  `current_club_name`.
- To get a club ID, join `current_club_name` to `clubs.csv` by name, and
  check the result. `clubs.csv` holds 796 clubs (the clubs in the
  competitions the project scrapes), and an exact name match finds a club
  for 53.0% of the rows from 2018-06-01. The other rows need a manual or
  fuzzy name match, or have no club in `clubs.csv`.
- Some rows have `current_club_name` "Unknown".

Sources: the project's model SQL and asset definition at commit `e44f186`
(https://github.com/dcaribou/transfermarkt-datasets), issue #137
(https://github.com/dcaribou/transfermarkt-datasets/issues/137, closed
2026-02-14), the status announcement
(https://github.com/dcaribou/transfermarkt-datasets/discussions/383), and the 2026-09-05 files `player_valuations.csv.gz`,
`players.csv.gz` and `clubs.csv.gz`. Checked 2026-10-08.
