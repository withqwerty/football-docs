"""Reference implementations for the xg and npxg metric cards
(metrics/cards/xg.toml, metrics/cards/npxg.toml).

Each function takes the events of one match in StatsBomb's open-data format
(a list of event dicts, as in data/events/<match_id>.json) and the name of the
shooting team, and returns that team's total for the match, rounded to 4
decimals. A team with no counted shot has a total of 0.0.

The functions do not model anything: they read the provider's own shot value,
shot.statsbomb_xg, and add it up. They show how a total is built, not how a
shot is valued.

The penalty shoot-out (period 5) is never counted: its kicks are shot events in
the open data, each with a penalty xG value, but they are not part of match xG.
Extra time (periods 3 and 4) is counted. Own goals are not shots and carry no
xG, so they add nothing.
"""

from __future__ import annotations

from math import prod


def _shots(events, team):
    return [
        event
        for event in events
        if event["type"]["name"] == "Shot" and event["team"]["name"] == team and event.get("period") != 5
    ]


def _xg(shot):
    return shot["shot"]["statsbomb_xg"]


def _is_penalty(shot):
    return shot["shot"]["type"]["name"] == "Penalty"


def xg_statsbomb_hudl(events, team):
    """xg.statsbomb-hudl: the sum of shot.statsbomb_xg over the team's shots.

    Penalties are included: this is the "Count of shot_xg (for)" term of Hudl
    StatsBomb's "xG Difference Inclusive". Penalty shoot-out kicks (period 5)
    are excluded.
    """
    return round(sum(_xg(shot) for shot in _shots(events, team)), 4)


def xg_statsbomb_cumulative(events, team):
    """xg.statsbomb-cumulative: Hudl StatsBomb's cumulative xG.

    Within each possession, the team's shots count as
    1 - (1 - xG of shot 1) * (1 - xG of shot 2) * ..., so one possession is
    worth at most 1 goal; the possession values are then added up. A
    possession is the event's `possession` number in the open data. Every
    shot counts, penalties included. Penalty shoot-out kicks (period 5) are
    excluded.
    """
    by_possession = {}
    for shot in _shots(events, team):
        by_possession.setdefault(shot["possession"], []).append(_xg(shot))
    total = sum(1 - prod(1 - value for value in values) for values in by_possession.values())
    return round(total, 4)


def npxg_statsbomb_hudl(events, team):
    """npxg.statsbomb-hudl: Hudl StatsBomb's team "xG" (NP xG).

    "Count of shot_xg where shot type≠penalty": the sum of shot.statsbomb_xg
    over the team's shots whose shot.type.name is not "Penalty". Shots after a
    penalty (a rebound) count, as their type is not Penalty. Penalty shoot-out
    kicks (period 5) are excluded.
    """
    return round(sum(_xg(shot) for shot in _shots(events, team) if not _is_penalty(shot)), 4)
