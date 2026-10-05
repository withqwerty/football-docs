"""Reference implementations for the field_tilt and pass_completion metric cards
(metrics/cards/field_tilt.toml and metrics/cards/pass_completion.toml).

Each function takes the events of one match in StatsBomb's open-data format
(a list of event dicts, as in data/events/<match_id>.json) and the name of a
team, and returns a share from 0 to 1, rounded to 4 decimals, or None when the
denominator is zero.

StatsBomb gives every location from the point of view of the team that made the
event, attacking towards x = 120 on a 120 x 80 pitch. So "the final third" is
x >= 80 for every event of either team, each in its own attacking direction.

The penalty shoot-out (period 5) is never counted. Extra time (periods 3 and 4)
is counted, as the definitions do not exclude it.

A StatsBomb pass is completed when it has no pass.outcome. The outcomes
Incomplete, Out, Pass Offside and Unknown all count as attempted and not
completed.

Only pass_completion_statsbomb_hudl implements its source's own formula on its
own data. The others read StatsBomb events as an approximation of definitions
written for other providers' events; the cards say so and list the mapping.
"""

from __future__ import annotations

FINAL_THIRD_X = 80.0

# Wyscout: "Goal Kicks, Corner Kicks, Free Kick Crosses and Throw-ins are not
# included in the pass statistics."
WYSCOUT_EXCLUDED_PASS_TYPES = ("Goal Kick", "Corner", "Throw-in")

# Hudl StatsBomb's own list of touches, from its "Touches in Box" formula:
# "pass ... (excludes incomplete passes but does include offside passes),
# dribble (excludes failed ones), tackle (excludes lost tackles), interception,
# save, claim, clearance, shot, punch, keeper pickup, smother, keeper sweeper,
# block, receipt, save". Goalkeeper events lie in the keeper's own third, so
# they never reach the final third; they are listed for completeness.
TACKLE_LOST = ("Lost", "Lost In Play", "Lost Out")
KEEPER_TOUCHES = (
    "Shot Saved",
    "Shot Saved Off T",
    "Shot Saved To Post",
    "Saved To Post",
    "Penalty Saved",
    "Penalty Saved To Post",
    "Save",
    "Collected",
    "Punch",
    "Smother",
    "Keeper Sweeper",
)


def _in_play(events):
    return [event for event in events if event.get("period") != 5]


def _type(event):
    return event["type"]["name"]


def _x(event):
    location = event.get("location")
    return location[0] if location else None


def _in_final_third(event):
    x = _x(event)
    return x is not None and x >= FINAL_THIRD_X


def _share(part, whole):
    return round(part / whole, 4) if whole else None


def _sub(event, key, field):
    return (event.get(key, {}).get(field) or {}).get("name")


def _completed(event):
    return "outcome" not in event.get("pass", {})


def _is_pass(event):
    return _type(event) == "Pass"


def _is_opta_pass(event):
    """A StatsBomb pass that Opta's definitions would also log as a pass.

    Opta: "Crosses, keeper throws, and throw ins do not count as a pass."
    Cross = pass.cross is true; keeper throw = pass.body_part Keeper Arm;
    throw-in = pass.type Throw-in. Corners and free kicks stay in unless
    StatsBomb sets pass.cross on them; in the 2022 World Cup final no Corner
    pass has pass.cross set, so crossed corners (crosses to Opta) stay in.
    """
    if not _is_pass(event):
        return False
    detail = event.get("pass", {})
    return not (
        detail.get("cross")
        or _sub(event, "pass", "type") == "Throw-in"
        or _sub(event, "pass", "body_part") == "Keeper Arm"
    )


def _is_wyscout_pass(event):
    """A StatsBomb pass that Wyscout would include in its pass statistics.

    Wyscout leaves out goal kicks, corner kicks, free-kick crosses and
    throw-ins, and keeps crosses, head passes and hand passes.
    """
    if not _is_pass(event):
        return False
    kind = _sub(event, "pass", "type")
    if kind in WYSCOUT_EXCLUDED_PASS_TYPES:
        return False
    return not (kind == "Free Kick" and event["pass"].get("cross"))


def _is_touch(event):
    """Hudl StatsBomb's touch list (from its "Touches in Box" formula)."""
    kind = _type(event)
    if kind == "Pass":
        return _sub(event, "pass", "outcome") in (None, "Pass Offside")
    if kind == "Dribble":
        return _sub(event, "dribble", "outcome") == "Complete"
    if kind == "Duel":
        return _sub(event, "duel", "type") == "Tackle" and _sub(event, "duel", "outcome") not in TACKLE_LOST
    if kind == "Ball Receipt*":
        return "outcome" not in event.get("ball_receipt", {})
    if kind == "Goal Keeper":
        return _sub(event, "goalkeeper", "type") in KEEPER_TOUCHES
    return kind in ("Interception", "Clearance", "Shot", "Block")


def _tilt(events, team, counted):
    events = _in_play(events)
    counted_events = [event for event in events if counted(event) and _in_final_third(event)]
    own = sum(1 for event in counted_events if event["team"]["name"] == team)
    return _share(own, len(counted_events))


def _completion(events, team, counted):
    passes = [event for event in _in_play(events) if event["team"]["name"] == team and counted(event)]
    return _share(sum(1 for event in passes if _completed(event)), len(passes))


# Field tilt


def field_tilt_opta_passes(events, team):
    """field_tilt.stats-perform-2016 and field_tilt.opta-analyst, approximated.

    "team final third passes / team and opponent final third passes". The
    sources say neither whether failed passes count nor where the final third
    starts. Here: every pass Opta would log as a pass (no crosses, keeper
    throws or throw-ins), completed or not, that starts at x >= 80 in the
    passing team's direction (Opta's final third, x >= 66.7 of 100).
    """
    return _tilt(events, team, _is_opta_pass)


def field_tilt_touches(events, team):
    """field_tilt.touches (Cannon Stats), approximated.

    "the ratio of each team's final third touches compared to the total final
    third touches". The source does not list which events are touches; this
    uses Hudl StatsBomb's own touch list (see _is_touch), with the event
    location at x >= 80 in the acting team's direction.
    """
    return _tilt(events, team, _is_touch)


# Pass completion


def pass_completion_statsbomb_hudl(events, team):
    """pass_completion.statsbomb-hudl: Hudl StatsBomb's published formula.

    "Count of passes where pass outcome = completed / Count of all passes".
    Every Pass event counts, set pieces, goal kicks, throw-ins, crosses and
    keeper throws included.
    """
    return _completion(events, team, _is_pass)


def pass_completion_opta(events, team):
    """pass_completion.opta, approximated on StatsBomb events.

    Opta's pass event leaves out crosses, keeper throws and throw-ins (see
    _is_opta_pass), and its pass completion "usually" leaves out crosses.
    Opta's completed pass goes to a teammate "directly without a touch from
    an opposition player"; here a pass with no pass.outcome stands for it.
    """
    return _completion(events, team, _is_opta_pass)


def pass_completion_wyscout(events, team):
    """pass_completion.wyscout, approximated on StatsBomb events.

    Wyscout leaves out goal kicks, corner kicks, free-kick crosses and
    throw-ins (see _is_wyscout_pass). Its success rule is that the next touch
    of the ball is by a teammate; StatsBomb has no field for that, so a pass
    with no pass.outcome stands for it.
    """
    return _completion(events, team, _is_wyscout_pass)
