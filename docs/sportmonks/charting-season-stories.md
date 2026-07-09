# SportMonks Season Stories and Match Sheets

## Season-story data surfaces

SportMonks fixture responses can carry enough related data for match sheets,
availability timelines, standings-at-the-time views, and season narrative
graphics if the include set is chosen deliberately.

| Need | Endpoint and includes | Notes |
|---|---|---|
| Completed fixtures for a season | `GET /fixtures?filters=fixtureSeasons:{seasonId};fixtureStates:5&include=events.player;lineups.details;scores;round;participants` | State `5` is the confirmed finished state in SportMonks' fixture state model. |
| Fixture team sheets | `lineups.details` plus `lineups.player` when display names or positions are needed | `type_id` `11` marks starters and `12` marks substitutes. |
| Goals, assists, cards, substitutions | `events.player` | Event `type_id` values identify goal, card, substitution, and VAR incidents. |
| Round-by-round table position | `GET /standings/rounds/{roundId}?include=participant;details` | Use after fetching season rounds. The `details` array carries points, wins, goals, and goal difference. |
| Injury or absence timelines | `/sidelineds/seasons/{seasonId}/teams/{teamId}` plus player/team includes as needed | Useful for availability stories, but coverage varies by plan and competition. |
| Scores and half-time/full-time splits | `scores` | Use score `description` values such as `CURRENT`, `HT`, `FT`, `ET`, and `PS`. |

For historical or post-match analysis pages, prefer fixture endpoints over
livescores. Fixtures are designed for complete match data at any time; livescore
endpoints are lighter surfaces for active polling.

## Player status from lineups and events

A robust match-sheet pipeline should keep lineups and events separate:

1. Build the match-day squad from `lineups`.
2. Mark players with lineup `type_id = 11` as starters.
3. Mark players with lineup `type_id = 12` as bench players.
4. Use event `type_id = 18` to identify used substitutes.
5. For substitutions, SportMonks event semantics are:
   - `player_id` is the player coming on.
   - `related_player_id` is the player coming off.
6. Read player ratings and minutes from lineup `details` when available.

Do not infer a used substitute solely from bench membership. A bench player needs
a substitution event or a minutes-played detail before being marked as
`sub_on`.

## Lineup detail statistics

Lineup `details` use SportMonks statistic type IDs. Two useful player sheet
fields are:

| Type ID | Code | Meaning |
|---|---|---|
| `118` | `RATING` | Player match rating. |
| `119` | `MINUTES_PLAYED` | Number of minutes played. |

Treat both as optional. Some plans, competitions, or fixtures may omit ratings
or minutes. If minutes are absent, label any fallback as an estimate rather than
mixing it with provider-supplied minutes.

## Goals, assists, and cards

Fixture events use `type_id` for incident type:

| Type ID | Meaning | Player fields |
|---|---|---|
| `14` | Goal | `player_id` is scorer; `related_player_id` can be assist provider. |
| `15` | Own goal | Credit carefully; team and player semantics can differ from normal goals. |
| `16` | Penalty goal | `player_id` is penalty taker. |
| `18` | Substitution | `player_id` on, `related_player_id` off. |
| `19` | Yellow card | `player_id` receives the card. |
| `20` | Second yellow / yellow-red | `player_id` receives the second yellow. |
| `21` | Red card | `player_id` receives the card. |

Sort events by `sort_order` when available, not just by `minute`, because VAR
chains, substitutions, and cards can share the same displayed minute.

## Implementation checks

When building season-story or squad-availability views from SportMonks, include
tests for:

| Case | Expected handling |
|---|---|
| Finished fixtures filtered by season and state | Use `fixtureSeasons:{seasonId};fixtureStates:5`. |
| Substitute event | Player `player_id` is marked on; `related_player_id` is marked off. |
| Bench player without substitution event or minutes | Remains bench / unused. |
| Missing rating detail `118` | Render without rating. |
| Missing minutes detail `119` | Use no minutes or an explicitly labelled estimate. |
| Round standings missing for a round | Keep the fixture but mark table-position context unavailable. |
