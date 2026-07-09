---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Transfermarkt Identity Surfaces

Transfermarkt is valuable for cross-provider corroboration and public entity
pages, especially player biographical attributes and competition/team history.
Its public website shape should not be copied blindly into a register ontology.

## Access Surface

Transfermarkt is primarily a public website surface, not an official public API.
Use public entity pages, match reports, or licence-safe community exports as
evidence, and record the public URL plus snapshot date. Do not publish
collection state, bypass details, or non-public mirror paths.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | `wettbewerb` code | Competition pages can model provider-specific containers that should map into a different canonical structure. |
| Season | competition code plus season year | Usually one page per competition year. Split phases may not have distinct Transfermarkt season IDs. |
| Match | match or game ID | Strong match bridge where coverage exists. Use date, teams, score, and competition for corroboration. |
| Team | `verein` ID | Same real team can sometimes appear under multiple provider IDs. Distinguish supplier segmentation from real succession. |
| Player | `spieler` ID | Useful public player bridge. Strong corroborator when DOB, nationality, birthplace, position, and career context agree. |
| Coach | staff or manager profile ID | Treat as a person surface with role-specific career evidence, not a separate human identity. |

## ID Scheme Notes

The numeric IDs embedded in public URLs are the bridge surfaces. URL slugs are
handles and can change without changing the underlying provider ID. Common URL
families include `spieler` for players, `verein` for teams, `wettbewerb` for
competitions, and match or game IDs for fixtures. Season query parameters and
display labels are context, not independent canonical IDs.

## Useful Matching Fields

- Player: name variants, date of birth, birth place, citizenship, height,
  position, foot, profile aliases, current club, historical clubs, and
  national-team profile surfaces where available.
- Team: official name, historical names, country, city, gender where inferable,
  competition participation, and successor or predecessor context.
- Match: date, home and away teams, score, attendance, competition, season, and
  round label.
- Season: competition code, season year, display label, and match membership.

## Known Quirks

- Transfermarkt sometimes models playoffs, cups, or provider-maintained
  containers differently from a canonical match feed. For example, a playoff
  container can corroborate stages without becoming a separate canonical
  competition.
- Same-provider duplicate player pages exist. Do not merge by name alone.
- Team pages can represent supplier-side segmentation, historical successors,
  phoenix clubs, youth sides, reserve sides, women's teams, or genuine
  duplicates. Preserve relationship evidence when flattening would make history
  ambiguous.
- URL slugs are handles. Numeric IDs are the bridge surface.

## Implementation Notes

Use this page as the public provider-fact reference for Transfermarkt identity
surfaces: URL families, ID scheme notes, and matching quirks. Keep register
decisions, salt or key material, review outcomes, non-public mirrors, and scraping
implementation details outside football-docs.
