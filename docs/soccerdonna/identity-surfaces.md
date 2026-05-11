---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Soccerdonna Identity Surfaces

Soccerdonna is a useful public corroborator for women's football, particularly
for teams, competitions, player profiles, staff pages, and match reports. Treat
it as a public evidence provider whose coverage and structure vary by
competition and era.

## Stable Identity Surfaces

| Entity | Common surface | Notes |
|---|---|---|
| Competition | competition page ID or slug | Useful corroborator. Canonical competition shape should still follow the chosen match feed. |
| Season | season-scoped competition URL parameters | Can corroborate season membership but may not match a register season hierarchy exactly. |
| Stage or round | match-report round labels | Useful for stage naming after normalisation. Raw labels should not be minted directly. |
| Match | match-report or `spielbericht` ID | Strong public match corroborator when date, teams, and score align. |
| Team | team profile ID | Useful for women's clubs and competition participation. Check gender and side type explicitly. |
| Player | player profile ID | Useful for names, DOB where present, nationality, position, and career/team membership evidence. |
| Coach or staff | staff profile ID | Useful for coaching roles, but role labels need a normalised public vocabulary. |

## Useful Matching Fields

- Match reports: date, home team, away team, score, competition, round label,
  lineups, substitutions, and staff.
- Player and coach profiles: full name, display name, date of birth,
  nationality, position or role, profile URL, and career memberships.
- Team pages: official name, competition entries, country, gender context, and
  match participation.

## Quirks

- DOB coverage varies by era and competition. Missing DOB should create review
  residue rather than forcing a weak name-only bridge.
- Round labels need normalisation before stage minting. Preserve the raw label
  as evidence where useful.
- Soccerdonna can expose people through match reports before profile data has
  enough identity attributes to bridge safely.
- Some pages are better corroborators than canonical mint sources because their
  season and competition hierarchy can differ from the schedule feed.

## Reep-Derived Provenance Rules

Curated Soccerdonna notes should distinguish profile evidence from match-report
evidence and record the scrape date or source snapshot when possible. Do not
publish private scraping state, retry logs, or local mirror paths.
