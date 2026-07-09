---
source_url: https://www.thesportsdb.com/docs_api_guide
source_type: api_docs
upstream_version: "1 / 2"
crawled_at: 2026-07-09
---

# TheSportsDB Endpoint Families

## v1 Endpoints

v1 endpoints are PHP-style JSON methods under `/api/v1/json/{api_key}/...`.
They are easy to test in a browser and useful for metadata lookup.

| Family | Examples |
|---|---|
| Search | `searchteams.php?t=Arsenal`, `searchevents.php?e=Arsenal_vs_Chelsea`, `searchplayers.php?p=Danny_Welbeck` |
| Lookup | `lookupevent.php?id={idEvent}`, plus team, player, league, venue, and table lookups |
| List | list leagues, seasons, teams, countries, sports, honours, and related catalogue data |
| Schedule | previous/next events, events by date, events by league, events by round |
| Video | event highlight/video methods where available |

For football metadata tasks, a common chain is:

1. Find the league/team/player with a search/list endpoint.
2. Store TheSportsDB IDs such as `idLeague`, `idTeam`, and `idEvent`.
3. Use lookup or schedule endpoints by ID for stable polling.

## v2 Endpoints

v2 endpoints are premium and use `X-API-KEY` header authentication.

| Family | Purpose |
|---|---|
| Search | modern search endpoints |
| Lookup | entity and event lookup by ID |
| List | league/sport/team catalogues |
| Filter | filtered entity/event collections |
| All | full catalogue-style responses such as `/all/leagues` |
| Schedule | fixtures and schedules |
| Livescores | live-score endpoints, including soccer livescore |

The documented soccer livescore example is:

```bash
curl -X GET https://www.thesportsdb.com/api/v2/json/livescore/soccer \
  -H "X-API-KEY: <api-key>" \
  -L
```

## API Extras

TheSportsDB docs also link to ReadMe.io docs, Swagger/OpenAPI, a Postman
collection, and an AI/MCP integration. Use those for complete method inventories
when implementing against a customer key.
