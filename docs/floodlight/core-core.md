---
source_url: https://floodlight.readthedocs.io/en/latest/modules/core/core.html
source_type: crawled
upstream_version:
crawled_at: 2026-08-11T09:08:54.622Z
---
Collection of core data structures. Each class is designed to contain one type of sports data where each individual object contains data for _one_ team and _one_ time segment.

Data-level Core Objects

|  |  |
| --- | --- |
| `xy.XY` | Spatio-temporal data fragment. |
| `events.Events` | Event data fragment. |
| `pitch.Pitch` | Pitch and coordinate system specifications. |
| `code.Code` | Fragment of continuous signal encoding one game state. |
| `property.DyadicProperty` | Fragment of one continuous property per player dyad. |
| `property.PlayerProperty` | Fragment of one continuous property per player. |
| `property.TeamProperty` | Fragment of one continuous team property. |

Observation-level Core Objects