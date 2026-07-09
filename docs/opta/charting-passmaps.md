# Opta Charting and Pass Maps

## Pass-map data surfaces

Opta projects often need two different pass-map surfaces:

| Need | Best Opta surface | Notes |
|---|---|---|
| Event-level pass timing, coordinates, xT, game-state filtering | `matchevent/{token}?fx={matchId}` | Use typeId `1` pass events with outcome `1`; pass end coordinates come from qualifiers `140` and `141`. |
| Completed player-to-player connection counts | `passmatrix/{token}?fx={matchId}` | Use each player's `playerPass[]` array. Each connection has the target `playerId` and `value` completed passes. |
| Lineup, starters, substitutions, and formation context | `matchstats/{token}?fx={matchId}` plus event qualifiers | `formationPlace` marks starters in match-stats player rows. Team setup/formation events use qualifiers `130` and `131`; sub-on formation slots use qualifier `145`. |

`matchevent` pass rows do not provide a general explicit receiver field. Qualifiers
`140` and `141` are destination coordinates, not the receiving player. Qualifier
`20` is an involved-player field on some event families and should not be treated
as a universal pass recipient.

If an event-only pipeline needs a passing network, make the receiver rule explicit:
infer the receiver from the next same-team touch/pass in match-time order, or use a
provider-specific event link if your licensed feed supplies one. Label those edges
as inferred. If the `passmatrix` endpoint is available, prefer it for connection
weights because `playerPass[].playerId` is already the target player.

## Building pass-map nodes and edges

For a match-level pass map:

1. Pull `passmatrix/{token}?fx={matchId}`.
2. For each player, use `x` and `y` as the player's average pass position on the
   Opta 0-100 pitch.
3. Size nodes from `passSuccess`, `passLost`, total passes, or another chosen
   involvement measure.
4. Build edges from `playerPass[]`: source player is the containing player object,
   target player is `playerPass[].playerId`, weight is `playerPass[].value`.
5. Join display names and roles from `matchstats` if you need richer labels,
   starters, substitutions, or formation metadata.

The `passmatrix` endpoint is aggregate data. It gives completed connection counts
and average positions, but not the timestamp of each pass. For game-state filters,
per-90 windows, xT per pass, or clip/video sync, derive the event-level subset from
`matchevent` and accept that receiver edges are inferred unless you have a richer
licensed feed.

## Event-level xT and progressive passes

For event-level charts, use the F24 event stream:

| Field | Meaning |
|---|---|
| `typeId = 1` | pass event |
| `outcome = 1` | successful pass |
| event `x`, `y` | pass origin on Opta's 0-100 pitch |
| qualifier `140` | pass end X coordinate |
| qualifier `141` | pass end Y coordinate |
| qualifier `196` | switch of play |
| qualifier `4` | through ball |
| qualifier `2` | cross |

Only calculate xT, progressive passes, or pass vectors when both start coordinates
and qualifiers `140`/`141` are present. Missing end coordinates should make the
derived metric unavailable for that event rather than defaulting to zero.

## Formation and lineup joins

Use `matchstats` player rows for stable lineup context:

| Field or qualifier | Use |
|---|---|
| `player.playerId` | Opta player ID for joins |
| `matchName` | display label |
| `position` / `positionSide` | role and side labels |
| `formationPlace` | starter slot, usually `"1"` through `"11"` |
| substitute `playerOnId`, `playerOffId`, `timeMin` | substitution timing |
| qualifier `130` | team formation on setup events |
| qualifier `131` | player positions 1-11 on setup events |
| qualifier `145` | formation slot for a player coming on |

Keep the source of each field visible in code: connection weights from
`passmatrix`, event timing and xT from `matchevent`, and lineup roles from
`matchstats`.
