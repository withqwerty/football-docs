---
source_url: https://www.thesportsdb.com/docs_api_guide
source_type: api_docs
upstream_version: "1 / 2"
crawled_at: 2026-07-09
---

# TheSportsDB Identity Surfaces

## Entity IDs

TheSportsDB uses numeric IDs for its public entities.

| Entity | ID field |
|---|---|
| League | `idLeague` |
| Event / match | `idEvent` |
| Team | `idTeam`, plus home/away fields in livescore payloads |
| Player | `idPlayer` |
| Venue | venue lookup IDs where available |

When building football products, store these IDs alongside canonical team/player
IDs from your own register. Names are display labels, not reliable identity keys.

## Team Names And Artwork

Teams can include:

- `strTeam`;
- alternate names;
- country and league metadata;
- badges, logos, jerseys, banners, fanart, and other artwork URLs.

Because TheSportsDB is crowd-sourced and display-oriented, name variants are
normal. Project code should maintain explicit mappings for club names that are
known to differ from local canonical labels.

## Good Fit

TheSportsDB is a good fit for:

- live football scores;
- fixture/event lookup;
- broad team and league metadata;
- public artwork and badges;
- simple bots and side projects where free or low-cost public data is enough.

It is not a replacement for event-level providers such as Opta, Wyscout,
StatsBomb, SkillCorner, Sportradar Extended, or Impect.
