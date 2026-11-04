---
source_type: curated
source_url: https://docs.aiontheball.nl/
upstream_version: API v1
crawled_at: 2026-11-04
---

# AI on the Ball data provenance

## AI on the Ball data sources

**Category:** first-party.

AI on the Ball produces all of its data itself, with computer vision on the match
video the customer uploads. No data is licensed from leagues or other providers.
Events, tracking, reports and player identities are all derived from that one
video.

Source: [AI on the Ball API](https://docs.aiontheball.nl/): "Upload one video and
the API detects players, ball and teams, and returns every pass, carry, shot and
goal as timed events." Checked 2026-11-04.

## AI on the Ball coverage

Coverage is whatever the customer films. There is no fixed list of competitions,
seasons or matches, and no pre-collected match database to query. A match exists
in the API only after its video is uploaded and analysed, which takes 2 to 6 hours.

Footage can be a TV broadcast or a single club camera at an amateur or youth match.
What the camera does not show is not tracked: positions and events come only from
players and ball visible in the video. See the recording guidelines
(`guides-recording-guidelines`) for what footage works.

## AI on the Ball output licence

The Terms of Service at <https://aiontheball.nl/terms> are the binding text. The
public docs summarise them as: the customer gets a perpetual, royalty-free licence
to use the output, commercially too; the raw output may not be resold as a dataset
or used to train machine-learning models. Checked 2026-11-04.

## AI on the Ball identifiers

IDs hold within one analysis only. A player is `{team}-{jersey}` (for example
`0-10`), where `team` is the engine's shirt-cluster label `0` or `1`, not a club.
There is no persistent player or club ID across analyses, and no mapping to
StatsBomb, Opta, Wyscout or Reep IDs. See `concepts-player-ids` and
`concepts-teams-and-sides`.
