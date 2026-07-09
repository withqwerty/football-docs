# SportMonks Season Stories and Match Sheets

## Season-story data surfaces

SportMonks fixture responses can carry enough related data for match sheets,
availability timelines, standings-at-the-time views, and season narrative
graphics if the include set is chosen deliberately.

| Need | Endpoint and includes | Notes |
|---|---|---|
| Completed fixtures for a season | `GET /fixtures?filters=fixtureSeasons:{seasonId};fixtureStates:5,7,8&include=events.player;lineups.details;scores;round;participants` | States `5`, `7`, and `8` cover full-time, after-extra-time, and after-penalties finishes. |
| Fixture team sheets | `lineups.details` plus `lineups.player` when display names or positions are needed | `type_id` `11` marks starters and `12` marks substitutes. |
| Goals, assists, cards, substitutions | `events.player` | Event `type_id` values identify goal, card, substitution, and VAR incidents. |
| Round-by-round table position | `GET /standings/rounds/{roundId}?include=participant;details` | Use after fetching season rounds. The `details` array carries points, wins, goals, and goal difference. |
| Injury or absence timelines | `/sidelineds/seasons/{seasonId}/teams/{teamId}` plus player/team includes as needed | Useful for availability stories, but coverage varies by plan and competition. |
| Scores and half-time/full-time splits | `scores` | Use score `description` values such as `CURRENT`, `HT`, `FT`, `ET`, and `PS`. |

For historical or post-match analysis pages, prefer fixture endpoints over
livescores. Fixtures are designed for complete match data at any time; livescore
endpoints are lighter surfaces for active polling.

## Gameweek table-possibilities recipe

Use this recipe when an agent asks for reachable league positions, gameweek table
possibilities, a run-in range chart, or "where can each team finish after this
round?" from SportMonks fixtures and standings.

| Output field | Source fields | Rule |
|---|---|---|
| `team_id` / `team_name` | standings participant, fixture participants | Use provider IDs internally; labels are display-only. |
| `current_position` | current standings | Keep the current table snapshot alongside every range output. |
| `pending_fixture_ids` | fixtures for the selected round or date window | De-duplicate by fixture ID so the same match is not counted once per team. |
| `possible_positions` | scenario rankings | Emit every rank the team can occupy after the pending fixtures resolve. |
| `position_status` | ranking certainty | Mark ranks as `reachable`, `goal_difference_dependent`, or `blocked`. |
| `scenario_count` | pending fixture count | For result-only enumeration, `scenario_count = 3 ** pending_fixture_count`. |

Implementation notes:

- Start from a standings snapshot with at least points, played, wins, draws,
  losses, goals for, goals against, and goal difference. If standings `details`
  omit any tie-break field, keep it unavailable instead of silently inventing it.
- Fetch pending fixtures for one explicit round, gameweek, or date window. Treat
  postponed and rescheduled fixtures deliberately: either include them in the
  selected window or label them excluded.
- Enumerate each pending fixture once as home win, draw, or away win when the
  product only needs result-level possibilities. Update points and W/D/L counts
  for every scenario.
- Result-only enumeration cannot know the future goal difference or goals scored.
  If two or more teams can tie on points and a missing score swing could decide
  the rank, mark that position as `goal_difference_dependent` rather than
  presenting it as guaranteed.
- For exact-score prediction modes, update goals for, goals against, and goal
  difference per scenario, then sort with the competition's declared tie-break
  order, for example points, goal difference, goals scored, then any
  competition-specific head-to-head rules.
- Cap exhaustive enumeration when the fixture count is too high for the target
  runtime. Ten fixtures produce `3 ** 10 = 59049` result combinations; larger
  windows usually need batching, worker threads, or Monte Carlo sampling.
- Keep linked fixture state consistent in interactive tools. If the user sets
  Team A to beat Team B, the same fixture must update Team B as a loss in the
  table model.
- If no fixtures remain, return the final table and mark prediction controls
  inactive rather than showing an open possibility range.

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
| Finished fixtures filtered by season and state | Use `fixtureSeasons:{seasonId};fixtureStates:5,7,8`. |
| Substitute event | Player `player_id` is marked on; `related_player_id` is marked off. |
| Bench player without substitution event or minutes | Remains bench / unused. |
| Missing rating detail `118` | Render without rating. |
| Missing minutes detail `119` | Use no minutes or an explicitly labelled estimate. |
| Round standings missing for a round | Keep the fixture but mark table-position context unavailable. |
