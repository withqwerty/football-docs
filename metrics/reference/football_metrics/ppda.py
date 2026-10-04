"""Reference implementations for the ppda metric card (metrics/cards/ppda.toml).

Each function takes the events of one match in StatsBomb's open-data format
(a list of event dicts, as in data/events/<match_id>.json) and the name of the
pressing team, and returns that team's PPDA for the match, or None when the
team made no counted defensive action.

StatsBomb gives every location from the point of view of the team that made the
event, attacking towards x = 120 on a 120 x 80 pitch. So "the pressing team's
attacking 60%" is x >= 48 for its own events and x < 72 for the opponent's.

The penalty shoot-out (period 5) is never counted. Extra time (periods 3 and 4)
is counted, as the definitions do not exclude it.

Only ppda_statsbomb_hudl implements its source's own formula on its own data.
The others read StatsBomb events as an approximation of definitions written for
Opta events; the card says so and lists the mapping.
"""

from __future__ import annotations

PITCH_LENGTH = 120.0


def _in_play(events):
    return [event for event in events if event.get("period") != 5]


def _x(event):
    location = event.get("location")
    return location[0] if location else None


def _ratio(passes, actions):
    return round(passes / actions, 4) if actions else None


def _type(event):
    return event["type"]["name"]


def ppda_statsbomb_hudl(events, team):
    """ppda.statsbomb-hudl: Hudl StatsBomb's published formula.

    "Count of opposition event name = pass and pass outcome = completed and
    start_location_x<72 / count of (event_name = tackle or interception
    (including pass type = interception) or dribbled past or foul) and
    event_x>=48". A StatsBomb tackle is a Duel of type Tackle; a foul is Foul
    Committed; a completed pass has no pass.outcome.
    """
    events = _in_play(events)
    passes = sum(
        1
        for event in events
        if _type(event) == "Pass"
        and event["team"]["name"] != team
        and "outcome" not in event.get("pass", {})
        and _x(event) is not None
        and _x(event) < 72
    )
    actions = 0
    for event in events:
        if event["team"]["name"] != team or _x(event) is None or _x(event) < 48:
            continue
        kind = _type(event)
        if (
            (kind == "Duel" and event.get("duel", {}).get("type", {}).get("name") == "Tackle")
            or kind in ("Interception", "Dribbled Past", "Foul Committed")
            or (kind == "Pass" and event.get("pass", {}).get("type", {}).get("name") == "Interception")
        ):
            actions += 1
    return _ratio(passes, actions)


def ppda_trainor_2014(events, team):
    """ppda.trainor-2014, approximated on StatsBomb events.

    Trainor (2014) counts every opposition pass, completed or not, and the
    pressing team's tackles, interceptions, challenges (failed tackles) and
    fouls, all beyond Opta's x = 40 of 100 in the pressing team's direction.
    On StatsBomb's 120-long pitch that is x > 48 for the pressing team and
    x < 72 for the opponent. Mapping: tackle = Duel of type Tackle (any
    outcome), challenge = Dribbled Past, interception = Interception, foul =
    Foul Committed.
    """
    events = _in_play(events)
    passes = sum(
        1
        for event in events
        if _type(event) == "Pass" and event["team"]["name"] != team and _x(event) is not None and _x(event) < 72
    )
    actions = sum(
        1
        for event in events
        if event["team"]["name"] == team
        and _x(event) is not None
        and _x(event) > 48
        and (
            (_type(event) == "Duel" and event.get("duel", {}).get("type", {}).get("name") == "Tackle")
            or _type(event) in ("Interception", "Dribbled Past", "Foul Committed")
        )
    )
    return _ratio(passes, actions)


def ppda_opta_analyst(events, team):
    """ppda.opta-analyst, approximated on StatsBomb events.

    Opta Analyst counts opposition passes and the pressing team's fouls,
    tackles, interceptions, challenges and blocked passes "outside of the
    pressing team's own defensive third": x > 40 for the pressing team and
    x < 80 for the opponent on a 120-long pitch. Opta's blocked pass has no
    StatsBomb event of its own; a Block is the nearest, and it also covers
    blocked shots and clearances. The page does not say whether failed passes
    count; all passes are counted here.
    """
    third = PITCH_LENGTH / 3
    events = _in_play(events)
    passes = sum(
        1
        for event in events
        if _type(event) == "Pass"
        and event["team"]["name"] != team
        and _x(event) is not None
        and _x(event) < PITCH_LENGTH - third
    )
    actions = sum(
        1
        for event in events
        if event["team"]["name"] == team
        and _x(event) is not None
        and _x(event) > third
        and (
            (_type(event) == "Duel" and event.get("duel", {}).get("type", {}).get("name") == "Tackle")
            or _type(event) in ("Interception", "Dribbled Past", "Foul Committed", "Block")
        )
    )
    return _ratio(passes, actions)
