"""Reference implementations for the xt metric card (metrics/cards/xt.toml).

xt_singh_open_surface values a team's ball-progressing actions with Karun
Singh's published 12 x 8 xT surface (open_xt_12x8_v1.json), choosing actions
the way socceraction's ExpectedThreat.rate does, and returns the team's total
xT added in the match.

Action value (Singh, 2019): moving the ball from zone (x, y) to zone (z, w) is
worth xT[z, w] - xT[x, y]. Backward moves are negative.

Actions valued, after socceraction (which works on SPADL actions):
- successful moves only: a StatsBomb Pass with no pass.outcome, or a Carry
  (socceraction's StatsBomb converter turns carries into SPADL "dribble");
- passes and crosses, but not set pieces: passes whose pass.type is Free
  Kick, Corner, Throw-in or Goal Kick become SPADL set-piece actions, which
  socceraction does not rate. A kick-off stays an ordinary SPADL pass.
- not the synthetic dribbles socceraction's converter inserts between two
  consecutive actions of the same team; StatsBomb's own Carry events stand
  for them here, so this is an approximation of socceraction's pipeline.
The penalty shoot-out (period 5) is never counted.

Zones: StatsBomb locations are on a 120 x 80 pitch, from the acting team's
point of view attacking towards x = 120. Column = int(x / 120 * 12), row from
the top = 7 - int(y / 80 * 8), both clipped to the grid, as socceraction does
on its 105 x 68 pitch. The published surface is symmetric top to bottom.
"""

from __future__ import annotations

SET_PIECES = {"Free Kick", "Corner", "Throw-in", "Goal Kick"}


def _zone(surface, x, y):
    rows, cols = len(surface), len(surface[0])
    col = min(max(int(x / 120 * cols), 0), cols - 1)
    row = min(max(int(y / 80 * rows), 0), rows - 1)
    return surface[rows - 1 - row][col]


def _move(event):
    kind = event["type"]["name"]
    if kind == "Pass":
        details = event.get("pass", {})
        if "outcome" in details or details.get("type", {}).get("name") in SET_PIECES:
            return None
        return event["location"], details.get("end_location")
    if kind == "Carry":
        return event["location"], event.get("carry", {}).get("end_location")
    return None


def xt_singh_open_surface(events, team, singh_open_xt_12x8):
    """Total xT added by a team's successful open-play passes, crosses and carries."""
    surface = singh_open_xt_12x8
    total = 0.0
    for event in events:
        if event.get("period") == 5 or event["team"]["name"] != team:
            continue
        move = _move(event)
        if not move or not move[0] or not move[1]:
            continue
        (x0, y0), (x1, y1) = move[0][:2], move[1][:2]
        total += _zone(surface, x1, y1) - _zone(surface, x0, y0)
    return round(total, 4)
