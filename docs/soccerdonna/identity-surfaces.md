---
source_type: curated
source_url: null
upstream_version: null
crawled_at: null
---

# Soccerdonna Identity Surfaces

Soccerdonna is a public website covering women's football teams,
competitions, player profiles, staff pages, and match reports.

## Entity ID fields

| Entity | Common surface |
|---|---|
| Competition | competition page ID or slug |
| Season | season-scoped competition URL parameters |
| Stage or round | match-report round labels |
| Match | match-report or `spielbericht` ID |
| Team | team profile ID |
| Player | player profile ID |
| Coach or staff | staff profile ID |

URL slugs are handles, not IDs. Season and competition URL parameters
describe the page scope rather than a separate ID field.

## Other fields

- Match reports: date, home team, away team, score, competition, round label,
  lineups, substitutions, and staff.
- Player and coach profiles: full name, display name, date of birth,
  nationality, position or role, profile URL, and career memberships.
- Team pages: official name, competition entries, country, gender context, and
  match participation.

DOB coverage on player profiles varies by era and competition.
