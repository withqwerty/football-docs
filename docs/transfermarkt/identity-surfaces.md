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

## Squad effective-age story recipe

Use this recipe when an agent asks for a squad effective-age story,
minutes-weighted age profile, football-mileage chart, age-curve comparison, or
squad-planning view from Transfermarkt-style public squad, profile, and career
surfaces.

| Output field | Source fields | Rule |
|---|---|---|
| `player_id` | public `spieler` ID | Keep the numeric provider ID separate from the URL slug. |
| `team_id` / `season` | squad page, competition season, match/appearance source | Use one season scope before aggregating. Do not mix current squad lists with historical minutes silently. |
| `date_of_birth` / `calendar_age` | player profile DOB plus analysis date | Compute age as of a declared date, not the crawl date by accident. |
| `career_minutes` | career appearances, competition filters, minutes played | Sum senior minutes from explicit appearance rows. Keep the included competition set in metadata. |
| `minutes_weight` | season appearances or trusted match feed minutes | Weight club aggregates by actual season minutes played, not squad registration alone. |
| `effective_age` | `career_minutes` plus fitted age curve | Fit an age-to-minutes curve on the chosen comparison cohort, then invert the player's career-minute total onto that curve. |
| `weighted_effective_age` | player `effective_age` and `minutes_weight` | Aggregate as a minutes-weighted mean across the selected squad slice. |
| toggles / cohorts | position, promoted-club flag, goalkeeper flag | Expose whether goalkeepers, promoted clubs, loanees, or low-minute players are included. |

Core model: fit an age-to-minutes curve on the declared comparison cohort.

Implementation notes:

- Separate identity evidence from the model. Transfermarkt profile pages can
  provide DOBs, public IDs, club history, and career appearances; the
  effective-age curve is a derived analysis layer.
- Do not treat market value as playing load. Market value can be shown as a
  separate recruitment context field, but it should not drive `career_minutes`
  or `minutes_weight`.
- Use explicit competition filters for career minutes: for example top-flight,
  second tier, domestic cups, continental senior competition, or a stated
  custom set. Store the filter name with the output.
- Fit the comparison curve on a declared cohort such as active top-league
  players, position group, or league/season. Do not reuse a curve across women's
  football, youth football, lower divisions, or different eras without labelling
  that choice.
- Treat promoted clubs and goalkeepers as normal sensitivity toggles. They can
  materially change squad-age rankings, so keep both the default view and the
  inclusion flags inspectable.
- Preserve low-minute and missing-career-data flags. A squad table should show
  whether a player's effective age is observed, estimated, or excluded from the
  weighted aggregate.
- Cache public pages and record snapshot dates. Transfermarkt page structures
  and public values can change; downstream charts should be reproducible from a
  saved extract, not a live scrape.

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
