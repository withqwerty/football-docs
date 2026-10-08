"""Reference implementation for the xg_assisted metric card (metrics/cards/xg_assisted.toml).

xG assisted is the xG of the shots that a team's (or a player's) passes led to.
It is the shot-linked metric that Hudl StatsBomb calls xG Assisted, FBref
called xAG, and Understat, Wyscout and American Soccer Analysis label xA. It is
not the pass-level expected assists model of Opta / Stats Perform (card xa).

Each function takes the events of one match in StatsBomb's open-data format
(a list of event dicts, as in data/events/<match_id>.json).

A shot is assisted when it has shot.key_pass_id: the ID of the pass that led to
it (the same pass carries pass.assisted_shot_id and pass.shot_assist or
pass.goal_assist). The shot's shot.statsbomb_xg goes to the team and the player
that made that pass.

Penalties are never credited: a penalty has no key pass. Direct free kicks and
shots with no linked pass (rebounds, own dribbles) are not credited either.
The penalty shoot-out (period 5) is excluded; its shots are all penalties and
have no key pass, so this changes nothing, but the rule is explicit. Extra time
(periods 3 and 4) is counted.
"""

from __future__ import annotations


def _assisted_shots(events):
    """Yield (pass event, shot event) for every assisted shot outside the shoot-out."""
    by_id = {event["id"]: event for event in events}
    for event in events:
        if event["type"]["name"] != "Shot" or event.get("period") == 5:
            continue
        key_pass = by_id.get(event.get("shot", {}).get("key_pass_id"))
        if key_pass is not None:
            yield key_pass, event


def xg_assisted_statsbomb_hudl(events, team):
    """xg_assisted.statsbomb-hudl: the team's total xG Assisted for the match.

    Hudl StatsBomb: "Count of shot _xG for shots that the player assisted",
    summed here over the team's players. The value is the sum of
    shot.statsbomb_xg over the shots whose key pass the team made.
    Returns 0.0 for a team with no assisted shot.
    """
    total = sum(
        shot["shot"]["statsbomb_xg"]
        for key_pass, shot in _assisted_shots(events)
        if key_pass["team"]["name"] == team
    )
    return round(total, 4)


def xg_assisted_by_player(events, team):
    """xG Assisted per player of the team, as {player name: value}.

    The same rule as xg_assisted_statsbomb_hudl, credited to the player who
    made the key pass. Players with no assisted shot are not listed.
    """
    totals = {}
    for key_pass, shot in _assisted_shots(events):
        if key_pass["team"]["name"] != team:
            continue
        player = key_pass["player"]["name"]
        totals[player] = totals.get(player, 0.0) + shot["shot"]["statsbomb_xg"]
    return {player: round(value, 4) for player, value in totals.items()}
