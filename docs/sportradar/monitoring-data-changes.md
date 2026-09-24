---
source_url: https://developer.sportradar.com/soccer/docs/monitoring-data-changes
source_type: llms_txt
upstream_version: Soccer v4 / Soccer Extended v4
crawled_at: 2026-09-24T09:30:51.194Z
---
# Monitoring Data Changes

This integration scenario explains how to efficiently monitor updates across Soccer data using the **Sport Events Created, Updated, and Removed** endpoints in conjunction with the **Season Schedule** feed.

Instead of repeatedly polling full schedule or match endpoints, applications can use these change-tracking feeds to detect when matches are added, modified, or removed, and then selectively refresh only the affected data.

This approach is especially useful for keeping fixtures, match statuses, and tournament structures up to date while conserving API usage.

This scenario is commonly used to:

* Detect newly scheduled matches or late additions
* Identify updates to match start times, status, or participants
* Remove canceled or deleted matches from applications
* Keep fixture lists and schedules synchronized
* Reduce unnecessary polling of full schedule feeds
* Detect when upcoming seasons become available

<br />

***

## Overview

The **Sport Events Created, Updated, and Removed** endpoints act as a **change detection layer** for match-level data.

They do not return full match details. Instead, they provide:

* `sport_event.id`
* Timestamps indicating when a change occurred
* The type of change (created, updated, removed)

Your application can then use those IDs to call the appropriate Soccer feeds (such as **Season Schedule** or **Sport Event endpoints**) to retrieve the latest data only where needed.

A typical workflow looks like this:

**Sport Event Change Feeds → Identify affected sport\_event IDs → Refresh Season Schedule or Sport Event feeds**

<br />

***

## Relevant Feeds

The following feeds are commonly used when monitoring Soccer data changes:

| Feed                                                                                                                      | Purpose                                                               |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Sport Events Created | Identify newly added matches                                          |
| Sport Events Updated | Detect updates to existing matches (time, status, participants)       |
| [Sport Events Removed](https://developer.sportradar.com/soccer/reference/soccer-sport-events-removed)                                                                   | Detect removed or canceled matches                                    |
| [Season Schedule](https://developer.sportradar.com/soccer/reference/soccer-season-schedule)                                                                             | Retrieve full fixture list for a season                               |
| [Sport Event Summary](https://developer.sportradar.com/soccer/reference/soccer-sport-event-summary)                                                                     | Retrieve match details and status                                     |
| [Sport Event Timeline](https://developer.sportradar.com/soccer/reference/soccer-sport-event-timeline)                                                                   | Retrieve play-by-play updates for matches                             |
| [Season Links](https://developer.sportradar.com/soccer/reference/soccer-season-links)                                                                                   | Maintain tournament structure and match relationships                 |
| [Seasons Disabled](https://developer.sportradar.com/soccer/reference/soccer-seasons-disabled)                                                                           | Identify disabled seasons, including upcoming seasons not yet enabled |

<br />

***

## High-Level Workflow

A typical data monitoring integration follows this flow:

1. Call Sport Events Created, Updated, and Removed endpoints
2. Capture affected `sport_event.id` values
3. Identify the type of change (new, updated, removed)
4. Refresh only the necessary feeds (Season Schedule or Sport Event endpoints)
5. Update cached or displayed data accordingly

<br />

***

## Integration Steps

<br />

### 1. Call Sport Event Change Endpoints

Start by polling the following endpoints:

* **Sport Events Created**
* **Sport Events Updated**
* [**Sport Events Removed**](https://developer.sportradar.com/soccer/reference/soccer-sport-events-removed)

Each response includes:

* Lists of `sport_event.id`
* Timestamps of when the change occurred

These feeds indicate **what changed**, not the full updated data.

```json Sport Events Created (json)
{
  "generated_at": "2026-04-08T11:13:58+00:00",
  "sport_events_created": [
    {
      "id": "sr:sport_event:70636272",
      "created_at": "2026-04-07T11:30:55+00:00"
    },
    {
      "id": "sr:sport_event:70636274",
      "created_at": "2026-04-07T11:31:13+00:00"
    },
    {
      "id": "sr:sport_event:70636276",
      "created_at": "2026-04-07T11:31:25+00:00"
    },
```
```json Sports Events Updated (json)
{
  "generated_at": "2026-04-08T11:23:48+00:00",
  "sport_events_updated": [
    {
      "id": "sr:sport_event:69283622",
      "updated_at": "2026-04-08T11:23:16+00:00"
    },
    {
      "id": "sr:sport_event:70408532",
      "updated_at": "2026-04-08T11:23:06+00:00"
    },
    {
      "id": "sr:sport_event:69280534",
      "updated_at": "2026-04-08T11:23:05+00:00"
    },
```
```json Sports Events Removed (json)
{
  "generated_at": "2026-04-06T01:22:40+00:00",
  "sport_events_removed": [
    {
      "id": "sr:sport_event:45756218"
    },
    {
      "id": "sr:sport_event:45756220"
    },
    {
      "id": "sr:sport_event:45756222"
    },
```

<br />

### 2. Identify Change Type

Handle each endpoint independently:

* **Created**

  * A new match has been added to the schedule
  * Example: newly scheduled fixture, added competition match

* **Updated**

  * An existing match has changed
  * Examples:

    * Start time changes
    * Status updates (scheduled → live → closed)
    * Venue or participant updates

* **Removed**

  * A match has been removed from the schedule
  * Example: cancellations, data corrections

Your application should branch logic based on the change type.

<br />

### 3. Refresh Affected Feeds

Use the returned `sport_event.id` values to selectively refresh data.

**Recommended refresh logic:**

* **Created**

  * Re-call **Season Schedule** to include the new fixture
  * Optionally call **Sport Event Summary** for match details

* **Updated**

  * Call **Sport Event Summary** for fixture updates and revisions to statistics post match
  * Call **Sport Event Timeline** for fixture updates and revisions to events and statistics post match
  * Optionally refresh **Season Schedule** if fixture-level changes impact listings

* **Removed**

  * Remove the match from your application
  * Re-sync with **Season Schedule** to confirm current state

  ### Refresh Schedule and Match Feeds Together

  When a match is updated, changes may impact both fixture-level and match-level data.

  To ensure consistency:

  * Use **Season Schedule** for fixture updates (date, time, participants)
  * Use **Sport Event Summary** and **Timeline** for match-level updates

  Combining both ensures your application reflects the latest official data.

<br />

### 4. Maintain Tournament Structure (If Applicable)

For tournament-based competitions:

* Use **Season Links** to maintain bracket structure
* When matches are:

  * **Created** → Add to bracket structure
  * **Updated** → Update match metadata
  * **Removed** → Remove or re-map bracket nodes

After major updates (especially match completion), re-pull **Season Links** to ensure:

* Correct advancement of teams
* Updated future matchups

<br />

### 5. Track Season Availability

The change feeds above cover sport events in seasons that already exist. To see which seasons are loaded but not yet active, call [Seasons Disabled](https://developer.sportradar.com/soccer/reference/soccer-seasons-disabled): it lists currently disabled seasons, including future editions of covered competitions that have not yet been enabled. The response below is trimmed to its first three entries:

```json Seasons Disabled (json)
{
  "generated_at": "2026-07-28T08:55:15+00:00",
  "seasons_disabled": [
    {
      "id": "sr:season:144336",
      "name": "FIFA World Cup 2030",
      "start_date": "2030-06-08",
      "end_date": "2030-07-21",
      "year": "2030",
      "competition_id": "sr:competition:16",
      "disabled": true
    },
    {
      "id": "sr:season:143520",
      "name": "FA Cup 26/27",
      "start_date": "2026-08-08",
      "end_date": "2027-05-22",
      "year": "26/27",
      "competition_id": "sr:competition:19",
      "disabled": true
    },
    {
      "id": "sr:season:143796",
      "name": "Cyprus Cup 26/27",
      "start_date": "2026-10-01",
      "end_date": "2027-05-29",
      "year": "26/27",
      "competition_id": "sr:competition:315",
      "disabled": true
    }
  ]
}
```

* Each entry carries the season `id`, `name`, `start_date` and `end_date`, `year`, its parent `competition_id`, and `disabled: true`
* Seasons drop off the list once they are enabled
* The feed is available on both the Soccer and Soccer Extended base URLs; poll it on an as-needed basis

<br />

### 6. Handle Timing and Frequency

Change endpoints should be polled based on your application needs.

Best practices:

* Poll frequently during active match periods
* Poll less frequently during off-hours
* Combine with documented **update frequencies** for Soccer feeds
* Use timestamps to avoid reprocessing duplicate updates

<br />

***

## Common Use Cases

Monitoring Soccer data changes supports many platform features, including:

* Keeping fixture lists up to date
* Detecting late schedule changes or postponements
* Updating match status in real time
* Managing tournament brackets dynamically
* Powering live match dashboards and alerts

<br />

## Best Practices

* Use Sport Event change feeds as a **trigger**, not a data source
* Always retrieve full data from **Season Schedule** or **Sport Event endpoints**
* Handle Created, Updated, and Removed events independently
* Avoid polling full schedule feeds unnecessarily
* Re-sync tournament structure using **Season Links** when needed
* Combine change detection with feed update frequency guidance
