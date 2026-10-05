"""Reference implementations for the progressive_passes and progressive_carries
metric cards (metrics/cards/progressive_passes.toml and progressive_carries.toml).

Each function takes the events of one match in StatsBomb's open-data format
(a list of event dicts, as in data/events/<match_id>.json) and a team name, and
returns how many progressive passes or carries that team made in the match, as
a float.

Coordinates. StatsBomb gives every location from the point of view of the team
that made the event, attacking towards x = 120 on a 120 x 80 pitch. The units
are yards on a fixed pitch: the real pitch size does not change them. The
centre of the opponent's goal is (120, 40). A source threshold in metres is
converted to yards (1 yard = 0.9144 m), so 10 m is 10.94 units.

Geometry. Where a source says "closer to the goal" or "towards the centre of
the goal", the code uses the straight-line distance to (120, 40). Where a
source says "upfield" or "towards the opponent's goal line", it uses the gain
along x only.

Events. A pass is a Pass event, from location to pass.end_location; it is
completed when it has no pass.outcome. A carry is a Carry event, from location
to carry.end_location. Set pieces are passes whose pass.type is Corner, Free
Kick, Throw-in, Goal Kick or Kick Off; "open play" means none of these. The
penalty area is x >= 102 and 18 <= y <= 62.

The penalty shoot-out (period 5) is never counted. Extra time (periods 3 and
4) is counted, as no definition excludes it.

None of these functions is a provider's own code on the provider's own data.
Each reads StatsBomb events as an approximation of a published rule; the cards
say so and give the mapping.
"""

from __future__ import annotations

from math import hypot

GOAL = (120.0, 40.0)
HALFWAY = 60.0
METRE = 1 / 0.9144  # StatsBomb units (yards) per metre
SET_PIECES = {"Corner", "Free Kick", "Throw-in", "Goal Kick", "Kick Off"}


def _in_play(events):
    return [event for event in events if event.get("period") != 5]


def _type(event):
    return event["type"]["name"]


def _passes(events, team):
    return [
        event
        for event in _in_play(events)
        if _type(event) == "Pass" and event["team"]["name"] == team and event.get("pass", {}).get("end_location")
    ]


def _carries(events, team):
    return [
        event
        for event in _in_play(events)
        if _type(event) == "Carry" and event["team"]["name"] == team and event.get("carry", {}).get("end_location")
    ]


def _completed(event):
    return "outcome" not in event["pass"]


def _open_play(event):
    return event["pass"].get("type", {}).get("name") not in SET_PIECES


def _end(event):
    return event["pass"]["end_location"] if _type(event) == "Pass" else event["carry"]["end_location"]


def _to_goal(point):
    return hypot(GOAL[0] - point[0], GOAL[1] - point[1])


def _in_box(point):
    return point[0] >= 102 and 18 <= point[1] <= 62


def _share_closer(event, share=0.25):
    """True when the action moves the ball at least `share` of the remaining
    straight-line distance to the centre of the goal."""
    return _to_goal(_end(event)) <= (1 - share) * _to_goal(event["location"])


def _wyscout_zone_rule(event):
    """Wyscout's 30 / 15 / 10 m rule on the straight-line distance to goal."""
    start, end = event["location"], _end(event)
    gain = (_to_goal(start) - _to_goal(end)) / METRE  # metres
    start_own, end_own = start[0] < HALFWAY, end[0] < HALFWAY
    if start_own and end_own:
        return gain >= 30
    if start_own != end_own:
        return gain >= 15
    return gain >= 10


def _fbref_reference_x(events, team, event):
    """The ball's furthest x in the team's last six completed passes.

    FBref compares the end of the action with the ball's "furthest point in
    the last six passes". This reads that as the largest x among the start and
    end locations of the team's previous six completed passes in the same
    StatsBomb possession, and the start of the current action.
    """
    furthest = event["location"][0]
    earlier = [
        other
        for other in _passes(events, team)
        if other["possession"] == event["possession"] and other["index"] < event["index"] and _completed(other)
    ]
    for other in earlier[-6:]:
        furthest = max(furthest, other["location"][0], other["pass"]["end_location"][0])
    return furthest


def _fbref_rule(events, team, event):
    start, end = event["location"], _end(event)
    if _in_box(end) and not _in_box(start):
        return True
    return end[0] - _fbref_reference_x(events, team, event) >= 10


# --- Progressive passes -------------------------------------------------------


def progressive_passes_wyscout(events, team):
    """progressive_passes.wyscout, approximated on StatsBomb events.

    Every open-play Pass event, completed or not (the glossary counts
    unsuccessful progressive passes). The glossary lists set pieces (corner
    kick, free kick, throw-in) under their own heading, apart from passes, so
    set-piece passes are left out. pass.end_location stands for Wyscout's
    "next touch". The pass must be at
    least 30 m closer to goal when it starts and ends in the team's own half
    (x < 60), 15 m when it crosses halfway, and 10 m when it starts and ends
    in the opponent's half; distances are straight-line distances to (120, 40)
    converted from yards to metres.
    """
    return float(sum(1 for event in _passes(events, team) if _open_play(event) and _wyscout_zone_rule(event)))


def progressive_passes_fbref(events, team):
    """progressive_passes.fbref-opta, approximated on StatsBomb events.

    Completed passes that start outside the defending 40% (x >= 48) and either
    end in the penalty area from outside it, or end at least 10 yards further
    along x than the ball's furthest point in the team's last six completed
    passes (see _fbref_reference_x for how that point is read). Set pieces are
    counted, as the definition does not exclude them.
    """
    return float(
        sum(
            1
            for event in _passes(events, team)
            if _completed(event) and event["location"][0] >= 48 and _fbref_rule(events, team, event)
        )
    )


def progressive_passes_opta_analyst(events, team):
    """progressive_passes.opta-analyst, approximated on StatsBomb events.

    Completed open-play passes that start in the attacking two-thirds
    (x >= 40) and end at least 25% closer to the centre of the goal.
    """
    return float(
        sum(
            1
            for event in _passes(events, team)
            if _completed(event) and _open_play(event) and event["location"][0] >= 40 and _share_closer(event)
        )
    )


def progressive_passes_asa(events, team):
    """progressive_passes.asa, approximated on StatsBomb events.

    Completed open-play passes that start in the attacking 60% (x >= 48) and
    move the ball at least 25% of the remaining distance to the centre of the
    goal.
    """
    return float(
        sum(
            1
            for event in _passes(events, team)
            if _completed(event) and _open_play(event) and event["location"][0] >= 48 and _share_closer(event)
        )
    )


def progressive_passes_statsbomb_blog(events, team):
    """progressive_passes.statsbomb-blog-2023 on StatsBomb events.

    Completed passes, set pieces excluded, that move the ball at least 25% of
    the remaining distance towards the centre of the goal. No zone limit.
    """
    return float(
        sum(1 for event in _passes(events, team) if _completed(event) and _open_play(event) and _share_closer(event))
    )


# --- Progressive carries ------------------------------------------------------


def progressive_carries_wyscout(events, team):
    """progressive_carries.wyscout, approximated on StatsBomb events.

    Every Carry event, with Wyscout's progressive run thresholds: at least
    30 m closer to goal within the own half (x < 60), 15 m across halfway,
    10 m within the opponent's half; straight-line distances to (120, 40)
    converted from yards to metres. carry.end_location stands for the
    player's last touch.
    """
    return float(sum(1 for event in _carries(events, team) if _wyscout_zone_rule(event)))


def progressive_carries_fbref(events, team):
    """progressive_carries.fbref-opta, approximated on StatsBomb events.

    Carry events that end outside the defending 50% (x >= 60) and either end
    in the penalty area from outside it, or end at least 10 yards further
    along x than the ball's furthest point in the team's last six completed
    passes (see _fbref_reference_x).
    """
    return float(
        sum(
            1
            for event in _carries(events, team)
            if event["carry"]["end_location"][0] >= HALFWAY and _fbref_rule(events, team, event)
        )
    )


def progressive_carries_opta_analyst(events, team):
    """progressive_carries.opta-analyst, approximated on StatsBomb events.

    Carry events that move the ball more than 5 m upfield (gain along x of
    more than 5 m, in yards 5 / 0.9144). Opta's carry is a movement of five
    metres or more, which such a gain always meets.
    """
    return float(
        sum(
            1
            for event in _carries(events, team)
            if event["carry"]["end_location"][0] - event["location"][0] > 5 * METRE
        )
    )


def progressive_carries_stats_perform_2019(events, team):
    """progressive_carries.stats-perform-2019, approximated on StatsBomb events.

    Carry events longer than 5 m that end in the opposition half (x > 60) and
    end at least 5 m closer to the centre of the goal (straight-line). The
    article says the carries "occur in the opposition half" but also counts
    defenders' carries that start in their own half and end in the opposition
    half, so the code tests where the carry ends.
    """
    count = 0
    for event in _carries(events, team):
        start, end = event["location"], event["carry"]["end_location"]
        length = hypot(end[0] - start[0], end[1] - start[1])
        if length > 5 * METRE and end[0] > HALFWAY and _to_goal(start) - _to_goal(end) >= 5 * METRE:
            count += 1
    return float(count)


def progressive_carries_statsbomb_blog(events, team):
    """progressive_carries.statsbomb-blog-2023 on StatsBomb events.

    Every Carry event that moves the ball at least 25% of the remaining
    distance towards the centre of the goal. No zone limit. StatsBomb carries
    have no outcome, so none is filtered out as unsuccessful.
    """
    return float(sum(1 for event in _carries(events, team) if _share_closer(event)))
