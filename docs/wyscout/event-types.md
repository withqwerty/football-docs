---
source_url: https://apidocs.wyscout.com/
source_type: crawled
upstream_version: v3 2024-03-12 / v4 2024-05-09
crawled_at: 2026-06-03
---

# Wyscout Event Types

The event taxonomy used by `GET /matches/{wyId}/events`. **Identical in v3 and v4.** Each event is identified by a `type` object with a single `primary` type and zero or more `secondary` types:

```json
"type": {
  "primary": "pass",
  "secondary": ["cross", "assist", "key_pass"]
}
```

- **`primary`** is guaranteed present and holds exactly **one** value.
- **`secondary`** is an array (possibly empty) of additional tags describing the same event.

For prose definitions of what each tag means (e.g. what counts as a "cross" or a "key pass"), see [glossary-events.md](glossary-events.md). For the full per-event payload (locations, pass/shot/duel detail), see [data-model.md](data-model.md).

## Primary event types (22)

`acceleration`, `clearance`, `corner`, `duel`, `fairplay`, `free_kick`, `game_interruption`, `goal_kick`, `goalkeeper_exit`, `infraction`, `interception`, `offside`, `own_goal`, `pass`, `penalty`, `pressing_attempt`, `received_pass`, `shot_against`, `throw_in`, `touch`, `postmatch_penalty`, `postmatch_penalty_faced`

Notes:
- `postmatch_penalty` / `postmatch_penalty_faced` are penalty-shootout events (distinct from in-play `penalty`).
- `shot_against` and `goalkeeper_exit` are goalkeeper-perspective primaries.
- `received_pass` marks the reception side of a pass (the receiving player's event).

## Secondary event types (62)

Tags that decorate a primary event. A single event commonly carries several (e.g. a `pass` that is also `cross`, `assist`, `key_pass`).

`aerial_duel`, `assist`, `back_pass`, `ball_out`, `carry`, `conceded_goal`, `counterpressing_recovery`, `cross`, `cross_blocked`, `deep_completed_cross`, `deep_completition`, `defensive_duel`, `dribble`, `dribbled_past_attempt`, `forward_pass`, `foul`, `foul_suffered`, `free_kick_cross`, `free_kick_shot`, `goal`, `ground_duel`, `hand_pass`, `head_pass`, `head_shot`, `key_pass`, `lateral_pass`, `linkup_play`, `long_pass`, `loose_ball_duel`, `loss`, `offensive_duel`, `opportunity`, `pass_into_penalty_area`, `pass_to_final_third`, `penalty_conceded_goal`, `penalty_foul`, `penalty_goal`, `penalty_save`, `pressing_duel`, `progressive_pass`, `progressive_run`, `recovery`, `red_card`, `save`, `save_with_reflex`, `second_assist`, `short_or_medium_pass`, `shot_after_corner`, `shot_after_free_kick`, `shot_after_throw_in`, `shot_assist`, `shot_block`, `sliding_tackle`, `smart_pass`, `third_assist`, `through_pass`, `touch_in_box`, `under_pressure`, `whistle`, `yellow_card`, `postmatch_penalty_saved`, `conceded_postmatch_penalty`

Note: `deep_completition` is spelled as shown in the API (a misspelling of "deep completion" that is part of the contract — do not "correct" it when matching tags).

### Grouped for orientation

These groupings are for human navigation only; the API does not nest them.

- **Passing** — `forward_pass`, `back_pass`, `lateral_pass`, `long_pass`, `short_or_medium_pass`, `head_pass`, `hand_pass`, `progressive_pass`, `smart_pass`, `through_pass`, `cross`, `free_kick_cross`, `cross_blocked`, `pass_into_penalty_area`, `pass_to_final_third`, `deep_completition`, `deep_completed_cross`, `key_pass`, `shot_assist`, `assist`, `second_assist`, `third_assist`, `linkup_play`
- **Shooting** — `goal`, `head_shot`, `free_kick_shot`, `shot_block`, `opportunity`, `shot_after_corner`, `shot_after_free_kick`, `shot_after_throw_in`, `conceded_goal`, `penalty_goal`, `penalty_conceded_goal`
- **Duels & carrying** — `duel`, `ground_duel`, `aerial_duel`, `defensive_duel`, `offensive_duel`, `loose_ball_duel`, `pressing_duel`, `sliding_tackle`, `dribble`, `dribbled_past_attempt`, `carry`, `progressive_run`, `touch_in_box`, `under_pressure`
- **Defending & transitions** — `recovery`, `counterpressing_recovery`, `loss`, `ball_out`
- **Goalkeeping** — `save`, `save_with_reflex`, `penalty_save`
- **Fouls & cards** — `foul`, `foul_suffered`, `penalty_foul`, `yellow_card`, `red_card`
- **Shootout** — `postmatch_penalty_saved`, `conceded_postmatch_penalty`
- **Other** — `whistle`

## Possession types (12)

Each event may carry a `possession` object whose `types` array describes the possession it belongs to:

`corner`, `counterattack`, `set_piece_attack`, `attack`, `free_kick`, `direct_free_kick`, `penalty`, `throw_in`, `free_kick_cross`, `transition_low`, `transition_medium`, `transition_high`

The `transition_low` / `transition_medium` / `transition_high` values grade transition speed/threat. See `possession` in [data-model.md](data-model.md) for the full object (start/end location, duration, attack flag).

## Match periods

The `matchPeriod` field on each event:

| Code | Period |
|---|---|
| `1H` | First half |
| `2H` | Second half |
| `E1` | First extra time |
| `E2` | Second extra time |
| `P` | Penalty shootout |
