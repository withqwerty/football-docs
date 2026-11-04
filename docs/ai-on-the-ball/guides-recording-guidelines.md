---
source_url: https://docs.aiontheball.nl/versions/v1/guides/recording-guidelines/
source_type: llms_txt
upstream_version: API v1
crawled_at: 2026-11-04T10:39:54.559Z
---
# Recording guidelines

What footage the analysis needs, and what quality to expect from it. Footage outside these guidelines is still analysed and uses a credit, but expect a lower quality grade (`quality.grade` on the analysis: `good`, `fair`, `degraded`, `unreliable`). A video in which no match is found returns its credit.

## In short

A full football match on a full-size pitch, filmed from an elevated position at the halfway line, following the ball, with the pitch markings, the ball and the shirt numbers clearly visible.

## What to expect per camera type

| Camera type                                                                                       | Expected quality                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Broadcast footage                                                                                 | Best. Replays, close-ups and cut-aways are not analysed, so those moments are missing from the results.                                                                     |
| Elevated camera following the ball, framed wide around play                                       | Good. Most footage we receive is filmed this way.                                                                                                                           |
| Tight framing (only the player on the ball), or a fixed wide or panoramic view of the whole pitch | Lowest. Tight framing misses the players around the ball; in a whole-pitch view players are small, so shirt numbers are often unreadable and player identification suffers. |

## The match

- **Football on a full-size pitch.** Small-sided games and futsal are not supported. The number of players per side does not have to be 11, but the game must be a match: two teams playing each other on the whole pitch.
- **One ball in play** and no people on the pitch who are not part of the match, such as a training session or another game on the same pitch.
- **Clearly different kits.** Both teams in clearly different colours, and goalkeepers distinct from both teams. Shirt numbers on the back.

## The camera

- **Elevated, at the halfway line.** At least 3 m high, 4 to 7 m is better, at the halfway line and aimed straight across the pitch. Higher is better: from low down, players block each other and the far side of the pitch is compressed.
- **Stable.** On a tripod, mast or fixed mount, not handheld. Pans and zooms should be smooth.
- **Following the ball,** wide enough to show play around the ball, not just the player on it, and close enough that shirt numbers are readable. With the whole pitch in frame, players are too small for that.
- **Pitch markings visible.** The lines are how the analysis positions players on the pitch. Footage where most of the markings are hidden or faded is analysed poorly.
- **Unobstructed.** No fences, nets, poles or spectators in front of the lens.
- **Good light and a clean lens.** Daylight or proper floodlights. No sun shining into the lens, no rain drops or dirt on it, no heavy fog.
- **No large overlays.** A scoreboard is fine. Graphics or picture-in-picture covering the pitch are not.

## The file

|            |                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Length     | At least 2 minutes. A full match, or one file per half. Clips shorter than 10 minutes identify fewer players.                   |
| Size       | Up to 30 GB                                                                                                                     |
| Resolution | 1080p recommended. Higher resolutions are scaled down to 1080p. Lower resolutions are analysed, but shirt numbers suffer first. |
| Frame rate | At least 25 fps. Any common frame rate works (25, 30, 50, 60); the analysis runs at 25 fps.                                     |
| Format     | MP4 (H.264 or H.265) recommended. Other common formats that ffmpeg can read also work.                                          |
| Recording  | One continuous recording, without gaps or edits within a half                                                                   |

## Metadata

None is required. Team names, date and sides are optional (see [Teams and sides](https://docs.aiontheball.nl/versions/v1/concepts/teams-and-sides/index.md)). Adding them improves how the results are labelled, not the analysis itself.
