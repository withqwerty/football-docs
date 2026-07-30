# kloppy Provider Mapping

## How Mapping Works

kloppy maps each provider's native event types to its 19 canonical event types. When a provider event has no clean canonical match, it becomes a `GenericEvent` with the original type preserved in `raw_event`.

Each provider has a **deserializer** class (e.g., `StatsPerformDeserializer` for Opta, `StatsBombDeserializer`) that handles the translation. The mapping is deterministic -- the same provider event always produces the same kloppy event type.

## Mapping Tables

### Opta / WhoScored to kloppy

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
| 10 | Save | `GOALKEEPER` | With `SAVE` qualifier |
| 11 | Claim | `GOALKEEPER` | With `CLAIM` qualifier |
| 12 | Clearance | `CLEARANCE` | |
| 13 | Miss | `SHOT` | Result: `OFF_TARGET` |
| 14 | Post | `SHOT` | Result: `OFF_TARGET` |
| 15 | Attempt Saved | `SHOT` | Result: `SAVED` |
| 16 | Goal | `SHOT` | Result: `GOAL` |
| 17 | Card | `CARD` | |
| 18 | Player Off | `PLAYER_OFF` | |
| 19 | Player On | `PLAYER_ON` | Also read as the replacement in a substitution |
| 27 | Start Delay | — | Treated as a dead-ball event |
| 28 | End Delay | — | Treated as a dead-ball event |
| 30 | End Period | — | Sets the period end timestamp |
| 32 | Start Period | — | Sets the period start timestamp |
| 34 | Team Set Up | — | Starting formations and line-ups |
| 40 | Formation Change | `FORMATION_CHANGE` | |
| 41 | Punch | `GOALKEEPER` | With `PUNCH` qualifier |
| 43 | Deleted Event | — | Filtered out before parsing |
| 44 | Aerial | `DUEL` | With `AERIAL` duel qualifier |
| 45 | Challenge | — | Read as look-ahead context for take-ons |
| 49 | Ball Recovery | `RECOVERY` | |
| 52 | Keeper Pick-up | `GOALKEEPER` | With `PICK_UP` qualifier |
| 54 | Smother | `GOALKEEPER` | With `SMOTHER` qualifier |
| 55 | Offside Provoked | — | Treated as a dead-ball event |
| 61 | Ball Touch | `MISCONTROL` | Only when `outcome == 0` |
| 67 | 50/50 | `DUEL` | With `LOOSE_BALL` and `GROUND` qualifiers |
| 74 | Blocked Pass | `PASS` | |

These are the 35 Opta type IDs kloppy's `StatsPerformDeserializer` names explicitly;
IDs it does not name are not silently mapped, so check the deserializer source before
relying on any other ID.

### StatsBomb to kloppy

| StatsBomb Type | kloppy Event Type | Notes |
|---|---|---|
| Pass | `PASS` | Rich pass subtypes preserved as qualifiers |
| Shot | `SHOT` | xG available in `raw_event` |
| Dribble | `TAKE_ON` | |
| Carry | `CARRY` | StatsBomb provides explicit carries |
| Duel | `DUEL` | |
| Interception | `INTERCEPTION` | |
| Clearance | `CLEARANCE` | |
| Miscontrol | `MISCONTROL` | |
| Ball Receipt* | `GENERIC` | Pass receipt, not a canonical type |
| Ball Recovery | `GENERIC` | |
| Block | `GENERIC` | Defensive block (not a shot block) |
| Dispossessed | `GENERIC` | |
| Dribbled Past | `GENERIC` | |
| Error | `MISCONTROL` | |
| Foul Committed | `FOUL_COMMITTED` | |
| Foul Won | `GENERIC` | Foul suffered |
| Goal Keeper | `GOALKEEPER` | |
| Half End | `GENERIC` | |
| Half Start | `GENERIC` | |
| Injury Stoppage | `GENERIC` | |
| Offside | `GENERIC` | |
| Own Goal Against | `SHOT` | Result: `GOAL`, own goal qualifier |
| Own Goal For | `GENERIC` | |
| Player Off | `GENERIC` | Substitution |
| Player On | `GENERIC` | Substitution |
| Pressure | `GENERIC` | Pressing event |
| Referee Ball-Drop | `GENERIC` | |
| Shield | `GENERIC` | |
| Starting XI | `FORMATION_CHANGE` | Initial formation |
| Substitution | `GENERIC` | |
| Tactical Shift | `FORMATION_CHANGE` | |
| 50/50 | `DUEL` | |

### Wyscout to kloppy

| Wyscout v3 Primary | kloppy Event Type | Notes |
|---|---|---|
| `pass` | `PASS` | All pass secondary types map here |
| `shot` | `SHOT` | |
| `duel` (ground attacking) | `TAKE_ON` | Attacking ground duel = take-on |
| `duel` (ground defending) | `DUEL` | |
| `duel` (aerial) | `DUEL` | |
| `duel` (ground loose ball) | `DUEL` | |
| `free_kick` (free kick) | `PASS` | With `FREE_KICK` set piece qualifier |
| `free_kick` (corner) | `PASS` | With `CORNER_KICK` set piece qualifier |
| `free_kick` (throw in) | `PASS` | With `THROW_IN` set piece qualifier |
| `free_kick` (goal kick) | `PASS` | With `GOAL_KICK` set piece qualifier |
| `free_kick` (penalty) | `SHOT` | With `PENALTY` set piece qualifier |
| `free_kick` (free kick shot) | `SHOT` | With `FREE_KICK` set piece qualifier |
| `touch` (clearance) | `CLEARANCE` | |
| `touch` (interception) | `INTERCEPTION` | |
| `touch` (acceleration) | `CARRY` | Ball carry |
| `touch` (touch) | `GENERIC` | |
| `goalkeeper` | `GOALKEEPER` | |
| `infraction` (foul) | `FOUL_COMMITTED` | |
| `others_on_the_ball` | `GENERIC` | |
| `game_interruption` | `GENERIC` | |

## What Maps Cleanly

These event types have strong, consistent mappings across all providers:

| kloppy Type | Opta | StatsBomb | Wyscout | Notes |
|---|---|---|---|---|
| `PASS` | Type 1 | Pass | `pass` | All providers have rich pass data |
| `SHOT` | Types 13-16 | Shot | `shot` | Goal/saved/blocked/off-target |
| `CLEARANCE` | Type 12 | Clearance | `touch.clearance` | Clean 1:1 mapping |
| `FOUL_COMMITTED` | Type 4 | Foul Committed | `infraction.foul` | Clean 1:1 mapping |
| `GOALKEEPER` | Types 10, 11, 41 | Goal Keeper | `goalkeeper` | Subtypes via qualifiers |
| `FORMATION_CHANGE` | Type 40 | Tactical Shift | N/A | Wyscout lacks formation changes |

## What Becomes GenericEvent

Events that don't have a canonical kloppy type. These are common across providers but not standardised:

| Provider Event | Why Generic | Access via |
|---|---|---|
| Ball Recovery | No canonical type | `raw_event["type"]["name"]` |
| Pressure | StatsBomb-specific concept | `raw_event` |
| Ball Receipt | Implicit in pass events | `raw_event` |
| Substitution | Not an on-ball action | `raw_event` |
| Cards | Attached as qualifiers, not standalone events | `CardQualifier` |
| Offside | Attached to pass result | `PassResult.OFFSIDE` |
| Half Start/End | Match structure, not action | `raw_event` |
| Referee Stop | Match structure | `raw_event` |
| Shield | Rare, provider-specific | `raw_event` |

## Coverage Gaps

### Carries

| Provider | Status |
|---|---|
| StatsBomb | Explicit `Carry` events -- maps to `CARRY` |
| Opta | No carry events; kloppy can **infer** carries from consecutive events |
| Wyscout v3 | `touch.acceleration` maps to `CARRY` |
| Wyscout v2 | No carry data |

To enable carry inference for Opta:

```python
dataset = opta.load(f24_data="f24.xml", f7_data="f7.xml")
# Carries are inferred between consecutive events by the same player
```

### xG

| Provider | xG Available | Access |
|---|---|---|
| StatsBomb | Yes (all shots) | `event.raw_event["shot"]["statsbomb_xg"]` |
| Wyscout v3 | Yes (all shots) | `event.raw_event["shot"]["xg"]` |
| Opta | Yes (if licensed) | `event.raw_event` qualifiers |
| WhoScored | No | N/A |

### Pressure Events

| Provider | Status |
|---|---|
| StatsBomb | Explicit pressure events (maps to `GENERIC`) |
| Wyscout v3 | `groundPressure: true` flag on events |
| Opta | No pressure data |

### Possession Sequences

| Provider | Status |
|---|---|
| StatsBomb | Possession chain via `possession` field in raw data |
| Wyscout v3 | Full `possession` object with attack type classification |
| Opta | No structured possession sequences |

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
            # Opta stores xG in qualifier ID 321 (if available)
            qualifiers = event.raw_event.get("qualifier", [])
            xg_qual = next((q for q in qualifiers if q.get("qualifierId") == 321), None)
            xg = float(xg_qual["value"]) if xg_qual else None
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
