# Opta Lineups and Team Sheets

## Lineup data surfaces

Opta line-up and team-sheet work usually needs a join across setup events,
match-stats rows, and squad metadata.

| Need | Best Opta surface | Notes |
|---|---|---|
| Kickoff team setup | `matchevent/{token}?fx={matchId}` typeId `34` | Team set-up event. Qualifiers `30`, `44`, `59`, `130`, `131`, and sometimes `194` describe the player list, positions, shirt numbers, formation, and captain. |
| Formation changes | `matchevent/{token}?fx={matchId}` typeId `40` plus typeId `35` | Use formation-change and player-position events for in-game shape changes. |
| Player on/off timing | typeId `18` and typeId `19`, or `matchstats` substitution fields | Use the explicit substitution event or substitution row. Do not derive minutes from starter/bench status alone. |
| Player labels and squad context | `squads/{token}?tmcl={seasonId}` plus `matchstats/{token}?fx={matchId}` | Join by Opta player ID for display labels, positions, and match-day rows. |
| Pass-map or shot-map roles | `matchstats` player rows | `formationPlace` gives the starting XI slot for many match-stats exports. |

## Team setup qualifiers

On the typeId `34` team set-up event, the useful qualifiers are usually parallel
arrays. Keep their ordering intact when building team sheets.

| Qualifier | Meaning | Team-sheet use |
|---|---|---|
| `30` | player IDs | Match-day player list. |
| `44` | player positions | Provider position values, parallel to the player list. |
| `59` | shirt numbers | Shirt number list, parallel to the player list. |
| `130` | team formation | Formation ID or label for the team setup. |
| `131` | team-player formation | Starting XI formation slots, usually `1` through `11`. |
| `145` | formation slot | Slot for a player coming on as a substitute. |
| `194` | captain | Opta player ID of the team captain when supplied. |

For a simple kickoff team sheet, combine `30`, `59`, `130`, `131`, and `194`.
The first eleven formation slots describe the starters; players without a
starting slot belong on the bench unless another feed-specific field says
otherwise. Validate array lengths before trusting the join: if player IDs and
shirt numbers do not line up, treat the team sheet as incomplete rather than
silently shifting labels onto the wrong player.

## Building starters, bench, and labels

A practical line-up normalisation flow:

1. Read the typeId `34` team set-up event for each team.
2. Parse the parallel player-ID, shirt-number, position, and formation-slot
   qualifiers without reordering them.
3. Mark players with formation slots `1` to `11` as starters.
4. Mark the qualifier `194` player ID as captain.
5. Join player labels, preferred names, and broader squad details from
   `squads` or `matchstats`.
6. Join substitution minutes from typeId `18`/`19` events or explicit
   `matchstats` substitution fields.

Substitution status should be event-backed. A bench player is not automatically a
used substitute, and a starter is not automatically substituted off. Populate
`minuteOn` and `minuteOff` only when the substitution event or row supplies the
minute.

## WhoScored-shaped payloads

WhoScored-style match-centre payloads are Opta-family data, but their shape is
different from the raw F24 event stream. They often expose home/away team
objects with player arrays, formation labels, formation slots, shirt numbers,
captain IDs, and sometimes formation intervals.

Useful fields in that shape include:

| Field family | Use |
|---|---|
| team `players` array | Starters and bench with labels and shirt numbers. |
| `formationSlots` / player formation positions | Starter ordering and shape. |
| `captainPlayerId` or captain flag | Captain marker. |
| formation intervals | In-game shape context when present. |
| player rating fields | Optional display enrichment only. |

Treat ratings as optional enrichment, not a guaranteed line-up field. Formation
intervals can help explain shape changes, but they do not automatically provide
perfect minute-on or minute-off semantics unless you also apply clear
substitution rules.

## Implementation checks

When writing tests or adapters for Opta-family line-ups, include fixtures for:

| Case | Expected handling |
|---|---|
| Missing qualifier `194` | Team sheet still renders, with no captain flag. |
| Player IDs and shirt numbers have different lengths | Reject or mark the line-up incomplete. |
| Bench player without a typeId `19` event | Remains unused substitute. |
| Starter without a typeId `18` event | Remains on pitch for minute-off purposes. |
| Player-on event with qualifier `145` | Use the qualifier as the incoming player's formation slot. |
| Ratings absent from the payload | Do not fabricate ratings or block the team sheet. |
