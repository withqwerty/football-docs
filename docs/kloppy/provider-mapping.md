---
source_url: https://github.com/PySport/kloppy/blob/v3.19.1/kloppy/infra/serializers/event/statsperform/deserializer.py
archived_url: https://github.com/PySport/kloppy/blob/bd68afcca659989da7ab41c5f5d6304bd5a6ac9d/kloppy/infra/serializers/event/statsperform/deserializer.py
source_type: curated
---

# kloppy Provider Mapping

## How Mapping Works

kloppy maps each provider's native event types to its 19 canonical event types. When a provider event has no clean canonical match, it becomes a `GenericEvent` with the original type preserved in `raw_event`.

Each provider has a **deserializer** class (e.g., `StatsPerformDeserializer` for Opta, `StatsBombDeserializer`) that handles the translation. The mapping is deterministic -- the same provider event always produces the same kloppy event type.

## Mapping Tables

### Opta to kloppy

| Opta Type ID | Opta Name | kloppy Event Type | Notes |
|---|---|---|---|
| 1 | Pass | `PASS` | Subtypes preserved as qualifiers |
| 2 | Offside Pass | `PASS` | Result set to `OFFSIDE` |
| 3 | Take On | `TAKE_ON` | |
| 4 | Foul Committed | `FOUL_COMMITTED` | Only when `outcome == 0` |
| 5 | Out | `BALL_OUT` | |
| 6 | Corner Awarded | `BALL_OUT` | |
| 7 | Tackle | `DUEL` | With `GROUND` duel qualifier |
| 8 | Interception | `INTERCEPTION` | |
| 10 | Save | `GOALKEEPER` | With `SAVE` qualifier; a `GENERIC` `block` event when qualifier 94 is present (applies to all keeper types) |
| 11 | Claim | `GOALKEEPER` | With `CLAIM` qualifier |
| 12 | Clearance | `CLEARANCE` | |
| 13 | Miss | `SHOT` | Result: `OFF_TARGET` (`BLOCKED` with qualifier 82) |
| 14 | Post | `SHOT` | Result: `OFF_TARGET` (`BLOCKED` with qualifier 82) |
| 15 | Attempt Saved | `SHOT` | Result: `SAVED` (`BLOCKED` with qualifier 82) |
| 16 | Goal | `SHOT` | Result: `GOAL` (`OWN_GOAL` with qualifier 28) |
| 17 | Card | `CARD` | |
| 18 | Player Off | `SUBSTITUTION` | Replacement player read from the next event when it is type 19 |
| 19 | Player On | — | Skipped; read as the replacement in the preceding type 18 substitution |
| 27 | Start Delay | `GENERIC` | Ball state set to `DEAD` |
| 28 | End Delay | `GENERIC` | Ball state set to `DEAD` |
| 30 | End Period | — | Sets the period end timestamp |
| 32 | Start Period | — | Sets the period start timestamp |
| 34 | Team Set Up | `GENERIC` | Named but has no dedicated handling |
| 40 | Formation Change | `FORMATION_CHANGE` | |
| 41 | Punch | `GOALKEEPER` | With `PUNCH` qualifier |
| 43 | Deleted Event | — | Filtered out before parsing |
| 44 | Aerial | `DUEL` | With `LOOSE_BALL` and `AERIAL` duel qualifiers |
| 45 | Challenge | `GENERIC` | Skipped over when kloppy looks ahead for a pass receiver |
| 49 | Ball Recovery | `RECOVERY` | |
| 52 | Keeper Pick-up | `GOALKEEPER` | With `PICK_UP` qualifier |
| 54 | Smother | `GOALKEEPER` | With `SMOTHER` qualifier |
| 55 | Offside Provoked | `GENERIC` | Ball state set to `DEAD` |
| 61 | Ball Touch | `MISCONTROL` | Only when `outcome == 0` |
| 67 | 50/50 | `DUEL` | With `LOOSE_BALL` and `GROUND` qualifiers |
| 74 | Blocked Pass | `INTERCEPTION` | |

These are the 35 Opta type IDs kloppy's `StatsPerformDeserializer` names explicitly.
Any other type ID becomes a `GenericEvent` whose `event_name` comes from the
deserializer's `event_type_names` lookup (`"unknown"` if the ID is not listed).

### StatsBomb to kloppy

| StatsBomb Type | kloppy Event Type | Notes |
|---|---|---|
| Pass | `PASS` | Rich pass subtypes preserved as qualifiers |
| Shot | `SHOT` | xG also stored as an `ExpectedGoals` statistic |
| Dribble | `TAKE_ON` | |
| Carry | `CARRY` | StatsBomb provides explicit carries |
| Duel | `DUEL` | |
| Interception | `INTERCEPTION` | |
| Clearance | `CLEARANCE` | |
| Miscontrol | `MISCONTROL` | |
| Ball Receipt* | `GENERIC` | Pass receipt, not a canonical type |
| Ball Recovery | `RECOVERY` | `DUEL` (`LOST`, `LOOSE_BALL`) when `recovery_failure` is set |
| Block | `GENERIC` | Defensive block (not a shot block) |
| Dispossessed | `GENERIC` | |
| Dribbled Past | `GENERIC` | |
| Bad Behaviour | `CARD` | `GENERIC` when no card is given |
| Error | `GENERIC` | |
| Foul Committed | `FOUL_COMMITTED` | Plus a `CARD` event when a card is given |
| Foul Won | `GENERIC` | Foul suffered |
| Goal Keeper | `GOALKEEPER` | Some keeper-sweeper events become `RECOVERY` or `CLEARANCE`; `GENERIC` when no keeper qualifier applies |
| Half End | `GENERIC` | |
| Half Start | `GENERIC` | |
| Injury Stoppage | `GENERIC` | |
| Offside | `GENERIC` | |
| Own Goal Against | `SHOT` | Result: `OWN_GOAL` |
| Own Goal For | — | Dropped: kloppy creates no event |
| Player Off | `PLAYER_OFF` | |
| Player On | `PLAYER_ON` | |
| Pressure | `PRESSURE` | |
| Referee Ball-Drop | `GENERIC` | |
| Shield | `GENERIC` | |
| Starting XI | `GENERIC` | Teams, line-ups and starting formations are read from these events |
| Substitution | `SUBSTITUTION` | |
| Tactical Shift | `FORMATION_CHANGE` | |
| 50/50 | `DUEL` | |

### Wyscout to kloppy

| Wyscout v3 Primary | kloppy Event Type | Notes |
|---|---|---|
| `shot` | `SHOT` | |
| `own_goal` | `SHOT` | Result: `OWN_GOAL` |
| `pass` | `PASS` | `KICK_OFF` set piece qualifier on the first pass of a period or after a goal |
| `duel` (with `dribble` secondary) | `TAKE_ON` | |
| `duel` (other) | `DUEL` | Duel qualifiers from the `ground_duel`, `aerial_duel`, `loose_ball_duel` and `sliding_tackle` secondary types |
| `clearance` | `CLEARANCE` | |
| `interception` | `INTERCEPTION` | |
| `shot_against` (with `save` secondary) | `GOALKEEPER` | With `SAVE` qualifier |
| `goal_kick` | `PASS` | With `GOAL_KICK` set piece qualifier |
| `throw_in` | `PASS` | With `THROW_IN` set piece qualifier and `HAND_PASS` pass qualifier |
| `free_kick` | `PASS` | With `FREE_KICK` set piece qualifier |
| `free_kick` (with `free_kick_shot` secondary) | `SHOT` | With `FREE_KICK` set piece qualifier |
| `corner` | `PASS` | With `CORNER_KICK` set piece qualifier |
| `corner` (with `shot` secondary) | `SHOT` | With `CORNER_KICK` set piece qualifier |
| `penalty` | `SHOT` | With `PENALTY` set piece qualifier |
| `infraction` (with `foul` secondary) | `FOUL_COMMITTED` | |
| `infraction` (with `yellow_card` or `red_card` secondary) | `CARD` | |
| Any other primary with a `carry` secondary | `CARRY` | End location from `carry.endLocation` |
| Any other primary | `GENERIC` | `event_name` is the primary type |

kloppy also adds synthetic `FORMATION_CHANGE` events when a team's formation differs
between consecutive Wyscout v3 events.

## What Maps Cleanly

These event types have strong, consistent mappings across all providers:

| kloppy Type | Opta | StatsBomb | Wyscout | Notes |
|---|---|---|---|---|
| `PASS` | Type 1 | Pass | `pass` | All providers have rich pass data |
| `SHOT` | Types 13-16 | Shot | `shot` | Goal/saved/blocked/off-target |
| `CLEARANCE` | Type 12 | Clearance | `clearance` | Clean 1:1 mapping |
| `FOUL_COMMITTED` | Type 4 | Foul Committed | `infraction` + `foul` | Clean 1:1 mapping |
| `GOALKEEPER` | Types 10, 11, 41, 52, 54 | Goal Keeper | `shot_against` + `save` | Subtypes via qualifiers |
| `FORMATION_CHANGE` | Type 40 | Tactical Shift | Synthetic (v3) | Wyscout v3 changes are inferred between consecutive events |

## What Becomes GenericEvent

Events that don't have a canonical kloppy type. These are common across providers but not standardised:

| Provider Event | Why Generic | Access via |
|---|---|---|
| Ball Receipt | Implicit in pass events | `raw_event` |
| Offside (StatsBomb) | No canonical type; Opta offside passes get `PassResult.OFFSIDE` instead | `raw_event` |
| Half Start/End | Match structure, not action | `raw_event` |
| Referee Ball-Drop | Match structure | `raw_event` |
| Shield | Rare, provider-specific | `raw_event` |

## Coverage Gaps

### Carries

| Provider | Status |
|---|---|
| StatsBomb | Explicit `Carry` events -- maps to `CARRY` |
| Opta | No carry events; the deserializer does not infer carries |
| Wyscout v3 | Events with a `carry` secondary type map to `CARRY` |
| Wyscout v2 | No carry data |

### xG

| Provider | xG Available | Access |
|---|---|---|
| StatsBomb | Yes (all shots) | `event.raw_event["shot"]["statsbomb_xg"]` |
| Wyscout v3 | Yes (all shots) | `event.raw_event["shot"]["xg"]` |
| Opta | When qualifier 321 is present | `ExpectedGoals` statistic, or qualifier 321 in `event.raw_event.qualifiers` |

### Pressure Events

| Provider | Status |
|---|---|
| StatsBomb | Explicit pressure events (maps to `PRESSURE`) |
| Wyscout v3 | kloppy builds no `PRESSURE` events |
| Opta | kloppy builds no `PRESSURE` events |

### Possession Sequences

| Provider | Status |
|---|---|
| StatsBomb | Raw `possession_team` is read as `ball_owning_team` |
| Wyscout v3 | Raw `possession` object: its team is read as `ball_owning_team`, and `counterattack` in `possession.types` sets `CounterAttackQualifier` |
| Opta | kloppy reads no possession field; `ball_owning_team` follows the team of the last ball-owning event type |

### Expected Threat (xT) / VAEP

Not provided by any raw data source. Must be computed from event sequences using third-party models.

## Accessing Raw Provider Data

Every kloppy event preserves the original provider data:

```python
for event in dataset.events:
    if event.event_type == EventType.SHOT:
        # Access StatsBomb-specific xG
        if dataset.metadata.provider.value == "statsbomb":
            xg = event.raw_event.get("shot", {}).get("statsbomb_xg")

        # Access Wyscout-specific xG
        elif dataset.metadata.provider.value == "wyscout":
            xg = event.raw_event.get("shot", {}).get("xg")

        # Access Opta qualifier
        elif dataset.metadata.provider.value == "opta":
            # raw_event is an OptaEvent; qualifiers is a dict keyed by qualifier ID
            # Opta stores xG in qualifier ID 321 (if available)
            xg_value = event.raw_event.qualifiers.get(321)
            xg = float(xg_value) if xg_value else None
```

## Provider Detection

```python
from kloppy.domain import Provider

if dataset.metadata.provider == Provider.STATSBOMB:
    print("StatsBomb data")
elif dataset.metadata.provider == Provider.OPTA:
    print("Opta data")
elif dataset.metadata.provider == Provider.WYSCOUT:
    print("Wyscout data")
```

Available providers (`kloppy.domain.Provider`, 17 members): `DATAFACTORY`, `HAWKEYE`, `IMPECT`, `KLOPPY`, `METRICA`, `OPTA`, `OTHER`, `PFF`, `SECONDSPECTRUM`, `SIGNALITY`, `SKILLCORNER`, `SPORTEC`, `SPORTVU`, `STATSBOMB`, `STATSPERFORM`, `TRACAB`, `WYSCOUT`.
