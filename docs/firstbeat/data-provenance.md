---
source_type: curated
source_url: https://apidocs.firstbeat.com/basic-concepts/
upstream_version: null
crawled_at: 2026-09-30
---

# Firstbeat data provenance

## Firstbeat data sources

**Category:** first-party.

The data comes from Firstbeat's own devices and analysis. A customer's athletes wear
Firstbeat sensors; Firstbeat Sports Cloud analyses the recordings. The API returns
that customer's own data.

Source: [Basic Concepts](https://apidocs.firstbeat.com/basic-concepts/): "A
measurement (Athlete Measurement) is training data recorded using some device or a
record that has been created manually. In Firstbeat Sports, the device is typically
the Sports Sensor that records heart rate and movement data." Checked 2026-09-30.

The variables (TRIMP, EPOC, training effect, HRV measures and others) are Firstbeat's
own calculations on that data. The "Available Variables" page says, for example,
that `vo2max` and `respirationRateAverage` are "Calculated from the heart rate
variability data".

## What the data is and is not

- It is data about a customer's own athletes. It is not league-wide or match data.
- `manual` measurements hold no device data. The "Basic Concepts" page calls them
  "A manually added measurement by coach without recorded sensor data".
- It holds personal data and health data (names, email addresses, heart rate, HRV,
  sleep and recovery measures). Under UK and EU GDPR, health data is special
  category data. A user needs their own lawful basis to process it.
- The docs here describe the API surface only. They contain no athlete data.
