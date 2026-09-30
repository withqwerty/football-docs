---
source_type: curated
source_url: https://statsports.com/article/sonra-desktop-updates
upstream_version: null
crawled_at: 2026-09-30
---

# STATSports data provenance

## STATSports data sources

**Category:** first-party.

The data comes from STATSports' own devices and software: Apex wearable trackers
worn by a customer's athletes, processed in the Sonra software. The API returns
that customer's own data.

Sources:

- [Sonra](https://statsports.com/sonra): "Introducing Apex 2.0 The next generation
  of STATSports wearable technology". Checked 2026-09-30.
- [Sonra desktop updates](https://statsports.com/article/sonra-desktop-updates)
  (14 April 2022): "Sonra now has the ability to send the full Raw Data via API,
  including 10hz GNSS data and 100Hz Accelerometer & Gyroscope data. In addition,
  Sonra's API now also provides all metrics from the software including user
  created metrics from the Custom Metric Calculator." Checked 2026-09-30.

## What the data is and is not

- It is data about a customer's own athletes, recorded in that customer's sessions.
  It is not league-wide or match data about other teams.
- It holds personal data and health data (names, date of birth, body measures,
  heart rate). Under UK and EU GDPR, health data is special category data. A user
  needs their own lawful basis to process it.
- The docs here describe the API surface only. They contain no athlete data.
