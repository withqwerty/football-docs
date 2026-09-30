---
source_type: curated
source_url: https://prd-euw-api-extforcedecks.valdperformance.com/swagger/v2019q3/swagger.json
upstream_version: null
crawled_at: 2026-09-30
---

# VALD data provenance

## VALD data sources

**Category:** first-party.

The data comes from VALD's own testing devices and software. A customer's athletes
are tested on VALD devices (ForceDecks, NordBord, ForceFrame, SmartSpeed, DynaMo,
HumanTrak), and each product's API returns that customer's own test data.

Sources, checked 2026-09-30:

- The eight VALD external API specifications, one per product (see VALD API
  access). The ForceDecks spec has `recordingId`, recording endpoints
  (`/v2019q3/teams/{teamId}/tests/{testId}/recording`) and trial records; NordBord
  and ForceFrame have force-trace endpoints (`/tests/{testId}/nordbordtrace`,
  `/tests/{testId}/forceframetrace`).
- `valdr` 4.0.0, VALD's R package on CRAN: "Provides helper functions and wrappers
  to simplify authentication, data retrieval, and result processing from the
  'VALD' 'APIs'."

ForceDecks result definitions come from the authenticated
`GET /resultdefinitions` endpoint (`resultId`, `resultIdString`,
`resultName`, `resultDescription`, `resultGroup`, `resultUnit` and others). The
list itself is not public, so these docs do not include it.

## What the data is and is not

- It is data about a customer's own athletes. It is not league-wide or match data.
- It holds personal data and health data (names, dates of birth, sex, body weight
  and height, strength and movement measures). Under UK and EU GDPR, health data is
  special category data. A user needs their own lawful basis to process it.
- The docs here describe the API surface only. They contain no athlete data.
