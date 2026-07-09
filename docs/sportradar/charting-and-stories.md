---
source_url: https://developer.sportradar.com/soccer/reference/soccer-extended-overview
source_type: api_docs
upstream_version: Soccer Extended v4
crawled_at: 2026-07-09
---

# Sportradar Charting And Story Surfaces

## Match Story Pages

For public match pages and live story surfaces, the useful feed chain is:

1. Daily Schedules or Season Schedule to find `sport_event_id`.
2. Sport Event Summary for score, status, teams, and available coverage.
3. Sport Event Timeline for core play-by-play events.
4. Sport Event Extended Timeline when passes, tackles, dribbles, interceptions,
   event coordinates, and xG values are needed.
5. Sport Event Lineups for formations, starters, substitutions, and squads.
6. Sport Event Momentum or probability feeds when building momentum, win
   probability, or game-state charts.

## Event And Shot Charts

Extended timeline fields support common editorial football charts:

| Chart | Sportradar fields |
|---|---|
| Shot map | `type`, `x`, `y`, `xg_value`, `outcome`, `body_type`, `type_of_play`, `competitor`, player details |
| Goal-mouth chart | `goalface_x`, `goalface_y`, `outcome`, `additional_outcome` |
| Pass map | pass events with `x`, `y`, `destination_x`, `destination_y`, `direction`, `passing_range`, `trajectory` where populated |
| Momentum chart | Sport Event Momentum minute values |
| Win-probability chart | Sport Event Probabilities or Timeline Probabilities |
| Game-state heatmap | score fields plus timeline event clocks; probabilities if subscribed |
| Lineup/formation view | Sport Event Lineups formation type, starters, substitutions |

## Extended Statistics

Use Sport Event Extended Summary for match-level player and team stats by period.
Use Seasonal Competitor Extended Statistics for season-level player and team
stats. The extended product is the better fit for scouting/radar pages than the
basic Soccer API because it adds a broader statistical surface.

## Caveats For Project Use

- `xg_value` is an event-level shot value; do not treat it as post-shot xG or
  xGOT unless the feed explicitly documents such a field.
- Some pass-detail fields are competition-dependent; the docs note examples
  where fields such as pass direction/range/trajectory are only available for
  specific competitions.
- Coordinates are 0-100 and home-goal oriented. Convert before overlaying with
  StatsBomb 120x80, Opta 0-100, Wyscout percentages, or tracking-space metres.
- AI-generated previews, summaries, and insights are helpful narrative inputs
  but should be labelled separately from measured event data.
- Probability feeds require the probabilities plan; build fallbacks for accounts
  without that subscription.

