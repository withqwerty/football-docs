---
source_url: https://developer.sportradar.com/soccer/docs/soccer-ig-api-basics
source_type: api_docs
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-07-09
---

# Sportradar Soccer API Access

## Overview

Sportradar Soccer is a commercial B2B REST API for global soccer data. The
current soccer product is v4, with two closely related surfaces:

| Product | Use it for |
|---|---|
| Soccer API | schedules, summaries, timelines, team/player data, standings, transfers, live scores |
| Soccer Extended API | deeper match and season statistics, event coordinates, player and team period stats, probabilities, insights, momentum, and push feeds |

Responses can be requested as JSON or XML. Data availability depends on
competition coverage tier and the customer's subscription package.

## Authentication

Requests use Sportradar API credentials configured in the customer's account.
Interactive docs and MCP examples use an `x-api-key` header.

```http
GET /soccer/trial/v4/en/sport_events/{sport_event_id}/timeline.json HTTP/1.1
Host: api.sportradar.com
x-api-key: <api-key>
```

Do not hard-code the key in project source. In AI-agent or MCP clients, pass the
key as a secure header or environment-managed secret.

## Base URL Pattern

Soccer and Soccer Extended endpoints use path parameters for package, access
level, version, language, resource IDs, and response format.

```text
https://api.sportradar.com/soccer/{access_level}/v4/{language_code}/...
https://api.sportradar.com/soccer-extended/{access_level}/v4/{language_code}/...
```

Common path values:

| Parameter | Notes |
|---|---|
| `access_level` | Usually `trial` or `production`, tied to the API key |
| `language_code` | Localised response language such as `en`, `de`, `es`, `fr`, `it`, `pt` |
| `format` | `json` or `xml` |

## Technical Requirements

- Support TLS 1.2 or higher.
- Follow HTTP redirects where required, especially around push and media flows.
- Handle both JSON and XML if the integration needs flexible feed formats.
- Build around unique Sportradar IDs (`sr:*`) rather than names.
- Check season/competition coverage before assuming extended stats, lineups,
  probabilities, or timelines are populated.

## Official MCP Server

Sportradar also documents an official hosted MCP endpoint at:

```text
https://developer.sportradar.com/mcp
```

Use football-docs for documentation lookup and integration planning. Use the
official Sportradar MCP, with customer credentials, when an agent needs to fetch
licensed live or historical Sportradar data.

