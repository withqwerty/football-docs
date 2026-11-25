---
source_url: https://www.skillcorner.com/apidocs.json
archived_url: https://web.archive.org/web/20261125124623/https://www.skillcorner.com/apidocs.json
source_type: crawled
upstream_version: SkillCorner API (OpenAPI 3.1)
crawled_at: 2026-08-31
---

# SkillCorner Physical Data

`GET /physical/` returns aggregated physical metrics per match-player (and rolls up via `group_by`). Each row carries identity fields (`player_id`, `player_name`, `team_id`, `match_id`, `match_date`, `competition_id`, `season_id`, `competition_edition_id`, `position`, `position_group`), playing-time fields, and a large set of physical metrics following a strict **naming convention**.

## Player workload table recipe

Use this recipe when an agent asks for a physical table, player workload view,
high-speed running leaderboard, sprint chart, or top-speed comparison from
SkillCorner-style physical data.

| Display field | SkillCorner source | Notes |
|---|---|---|
| minutes observed | `minutes_full_all` or the relevant split | Show the denominator next to rate metrics; do not compare tiny samples to full-match workloads without a minutes filter. |
| distance | `total_distance_full_all` | Values are metres. Convert to kilometres for display, but keep raw metres in data exports. |
| metres per minute | `total_metersperminute_full_all` or derived from distance/minutes | Useful when comparing players with different minutes; state whether it is all time or ball-in-play. |
| HSR distance/count | `hsr_distance_*`, `hsr_count_*` | HSR thresholds come from the SkillCorner glossary and may differ from Wyscout or a custom tracking pipeline. |
| sprint distance/count | `sprint_distance_*`, `sprint_count_*` | Counts are efforts, not metres; keep count and distance separate. |
| high-intensity output | `hi_distance_*`, `hi_count_*` | HI combines HSR and sprint bands. Avoid double-counting it with HSR/sprint components in totals. |
| top-speed proxy | `psv99` or `psv99_top5` | Peak/time metrics are bare fields, not split fields. Do not construct `psv99_full_all`. |
| acceleration load | `medaccel_count_*`, `highaccel_count_*`, `meddecel_count_*`, `highdecel_count_*` | Treat acceleration/deceleration counts as a separate load family from distance. |
| quality status | `physical_check_passed`, `count_match`, `count_match_failed` | Filter or flag rows that fail QC before ranking players. |

Choose one comparison basis before plotting:

- absolute match output: `*_full_all` values, best for "what did this player do
  today?";
- per-90: `*_p90`, best for season/competition leaderboards with minutes
  thresholds;
- ball-in-play: `*_p60bip`, best when comparing intensity independent of dead
  time;
- possession phase: `*_p30tip` / `*_p30otip`, best for in-possession versus
  out-of-possession physical profiles.

Do not mix providers' speed bands silently. SkillCorner HSR/sprint thresholds are
defined in its glossary; Wyscout exposes similar labels with km/h thresholds, and
custom tracking pipelines often use local m/s cut-offs. When joining physical
data to event or video views, keep `match_id`, `player_id`, `team_id`, period,
minutes basis, units, and QC flags in the exported data.

## Metric naming convention

Most physical fields are named:

```
{metric}_{period}_{possession}[_{normalisation}]
```

- **period** — `full`, `h1` (first half), `h2` (second half)
- **possession** — `all`, `bip` (ball in play), `tip` (team in possession), `otip` (opponent team in possession)
- **normalisation** (optional suffix) — `p90` (per 90 min), `p60bip` (per 60 min ball-in-play), `p30tip` (per 30 min team-in-possession), `p30otip` (per 30 min opp-in-possession)

Examples: `total_distance_full_all` (total distance, full match, all phases), `sprint_count_full_tip` (sprints while team in possession), `hsr_distance_h2_otip_…`, `total_distance_full_all_p90` (per-90 normalised). Playing time is given as `minutes_{period}_{possession}` (e.g. `minutes_full_tip`).

The split metrics repeat across every period × possession × normalisation combination — so to read a value, pick the base metric below and append the suffixes for the split you want.

**Exception — peak/time metrics are single fields with no splits:** `psv99`, `psv99_top5`, `timetohsr`, `timetohsr_top3`, `timetosprint`, `timetosprint_top3` appear only as bare fields (they are max/peak values, not accumulable totals). Do **not** construct `psv99_full_tip` etc. — those fields don't exist.

## Base metrics

| Metric stem | Meaning |
|---|---|
| `total_distance` | Total distance covered (m) |
| `total_metersperminute` | Distance per minute (m/min) |
| `running_distance` | Distance in the running speed band |
| `hsr_distance` / `hsr_count` | High Speed Running distance / number of efforts |
| `sprint_distance` / `sprint_count` | Sprinting distance / number of sprints |
| `hi_distance` / `hi_count` | High Intensity distance / efforts (HSR + sprint band) |
| `medaccel_count` / `highaccel_count` | Medium / high acceleration counts |
| `meddecel_count` / `highdecel_count` | Medium / high deceleration counts |
| `explacceltohsr_count` | Explosive accelerations leading into HSR |
| `explacceltosprint_count` | Explosive accelerations leading into a sprint |
| `timetohsr` / `timetohsr_top3` | Time to reach HSR (and top-3 average) |
| `timetosprint` / `timetosprint_top3` | Time to reach sprint speed (and top-3 average) |
| `psv99` / `psv99_top5` | Peak Sprint Velocity (99th percentile) and top-5 average — a max-speed proxy robust to outliers |

(Speed-band thresholds — what counts as running / HSR / sprint — are defined in the SkillCorner glossary: <https://skillcorner.crunch.help/en>.)

## Aggregation & normalisation params

| Param | Values |
|---|---|
| `group_by` | `player`, `match`, `team`, `position_group`, `position`, `season`, `competition` (comma-combinable) |
| `average_per` | `match` (default), `p90`, `p60bip`, `p30tip`, `p30otip`, `p5phase` (data_version 4.0 only, with a phase breakdown) |
| `period` | `full` (default), `h1`, `h2`, `et1`, `et2` (data_version 4.0 only, "only returned for a match that went to extra time") |
| `possession` | `all`, `tip`, `otip` |
| `venue` | `home`, `away` |
| `results` | `win`, `lose`, `draw` |
| `position_group` | `CentralDefender`, `FullBack`, `Midfield`, `WideAttacker`, `CenterForward` |
| `physical_check_passed` | `true` → only performances passing SkillCorner's physical QC; `false` → only failed; `true,false` → both. "Not available in data_version 4.0, where the Physical Quality Index replaces it." |
| `response_format` | `json` (default), `small_json` (data_version 3.x only), `csv`, `nested_json` (data_version 4.0 only) |
| `data_version` | `3.0.2`, `3.0.3` (default), `4.0` |
| `order_by` | a metric name; prefix `-` for descending |

## Filtering

Entity filters (comma-combinable lists): `season`, `competition`, `competition_edition`, `match`, `team`, `player`, `position`, `position_group`. Plus `date__gte`/`date__lte`, `age__gte`/`age__lte`, `playing_time__gte`, `count_match__gte` (exclude aggregates built on too few matches). Paginate large pulls with the `after` cursor.

## Quality flag

`physical_check_passed` (boolean, per row) indicates whether the performance passed SkillCorner's automated physical-data quality check. `count_match` / `count_match_failed` report how many matches fed an aggregate and how many were excluded. Filter on `physical_check_passed=true` for analysis-grade data. This applies to data_version 3.x: in 4.0 the spec replaces it with the Physical Quality Index (see below).

## Physical v4.0

The spec fetched on 2026-11-24 adds `data_version=4.0` to `/physical/` (the default stays `3.0.3`). The spec's own descriptions:

- **`phase`** — "data_version=4.0 only. The phases of play to return metrics for at full time (phase mode). Cannot be combined with a period, subperiod or possession breakdown." Values: `all` (default), `buildup`, `create`, `finish`, `direct`, `transition`, `attackingother`, `lowblock`, `mediumblock`, `highblock`, `defendingdirectplay`, `defendingtransition`, `defendingother`. `average_per=p5phase` goes with a phase breakdown.
- **`subperiod`** — "data_version=4.0 only. The 15-minute subperiods to return metrics for (subperiod mode), counted from the start of each half". Values: `full` (default), `h1s1`, `h1s2`, `h1s3`, `h2s1`, `h2s2`, `h2s3`, `et1s1`, `et2s1`. `h1s3` and `h2s3` appear only when a half lasts more than 30 minutes; `et1s1` and `et2s1` only after extra time. "Cannot be combined with a period or phase breakdown. A request with subperiods reads at most 1 competition edition(s), unless narrowed to teams, players or matches."
- **`period`** adds `et1` and `et2`.
- **Quality:** `physical_check_passed` is "Not available in data_version 4.0, where the Physical Quality Index replaces it". Data-collection records carry `physical_v4_0_quality_index` (a number).

The spec does not list the v4.0 field names for `/physical/`: its response schema is the same as for 3.x. Do not assume that the v3 `{metric}_{period}_{possession}` names cover the new phase and subperiod breakdowns.

### Main referee (`GET /physical/referee/`)

"Physical v4 main-referee metrics: one record per main referee and match (data_version 4.0 only). A request reads at most 10 competition editions, unless narrowed to matches." It takes `competition`, `competition_edition`, `season`, `match`, `date__gte`, `date__lte`, `period`, `subperiod`, `average_per` (`match`, `p90`, `p60bip`), `order_by`, `response_format` (`json` default, `csv`, `nested_json`) and the `after` cursor. The response is a page (`count`, `next`, `cursor_after`, `results`). Each result, for the default breakdown (full, all, match), has `match_id`, `match_name`, `match_date`, `competition_id`, `competition_name`, `competition_edition_id`, `season_id`, `season_name`, `minutes_full_all`, `total_distance_full_all`, `total_metersperminute_full_all`, `running_distance_full_all`, `hsr_distance_full_all`, `hsr_count_full_all`, `sprint_distance_full_all`, `sprint_count_full_all`, `hi_distance_full_all`, `hi_count_full_all`, `medaccel_count_full_all`, `highaccel_count_full_all`, `meddecel_count_full_all`, `highdecel_count_full_all`, `psv99`, `peak_velocity` and `physical_quality_index`.

`GET /match/{match_id}/custom/physical/referee/` returns the main referee of one match from the custom feed, "with every breakdown at once and no normalisation", as one CSV line by default.

### Physical events (`GET /match/{match_id}/physical_events/`)

"Physical v4: the physical events of one match (data_version 4.0 only), as a CSV or JSON file (frames at 10 or 25 fps), or for video analysis tools (Sportscode XML, MatchTracker XML, Focus JSON)." `file_format` ∈ `csv` (default), `json`, `sportscode-xml`, `matchtracker-xml`, `focus-json`. `frame_rate` ∈ `10` (default), `25`: "The frame rate of the frame fields (frame_start, frame_end, frame_peak): csv and json only." `period_starts` gives "The video start second of each period (two, or four with extra time), separated by commas" for the video formats. The spec gives no schema for the file's rows. `GET /match/{match_id}/custom/physical_events/` serves the same from the custom provider's feed.
