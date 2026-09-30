---
source_type: curated
source_url: https://connect.hawkindynamics.com/api
upstream_version: null
crawled_at: 2026-09-30
---

# Hawkin Dynamics data provenance

## Hawkin Dynamics data sources

**Category:** first-party.

The data comes from Hawkin Dynamics' own force plates. A customer's athletes do
tests on the plates, and the API returns that customer's test results, metrics and
force-time data.

Sources, checked 2026-09-30:

- [API reference](https://connect.hawkindynamics.com/api): the Force Platform API
  gives "Programmatic access to your athlete test data, force-time curves, metrics,
  and athlete management."
- The spec describes `eid` as the "Equipment ID of the hardware that produced the
  test", and `GET /api/v1/forcetime/{test_id}` as returning force-time series
  "sampled at 1ms intervals".

Hawkin defines each metric (jump height, RSI, force, power and others) in its
`description` in `metrics.json`; see Hawkin Dynamics test metrics.

## What the data is and is not

- It is data about a customer's own athletes. It is not league-wide or match data.
- It holds personal data and health data (names, dates of birth, height, body
  weight, force and power measures). Under UK and EU GDPR, health data is special
  category data. A user needs their own lawful basis to process it.
- The docs here describe the API surface only. They contain no athlete data.
