---
source_url: https://skillcorner.com/api/docs/
source_type: crawled
upstream_version: SkillCorner API (Swagger 2.0)
crawled_at: 2026-06-03
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
| `average_per` | `match`, `p90`, `p60bip`, `p30tip`, `p30otip` |
| `period` | `full`, `h1`, `h2` |
| `possession` | `all`, `tip`, `otip` |
| `venue` | `home`, `away` |
| `results` | `win`, `lose`, `draw` |
| `position_group` | `CentralDefender`, `FullBack`, `Midfield`, `WideAttacker`, `CenterForward` |
| `physical_check_passed` | `true` → only performances passing SkillCorner's physical QC; `false` → only failed |
| `response_format` | `json`, `small_json`, `csv` |
| `order_by` | a metric name; prefix `-` for descending |

## Filtering

Entity filters (comma-combinable lists): `season`, `competition`, `competition_edition`, `match`, `team`, `player`, `position`, `position_group`. Plus `date__gte`/`date__lte`, `age__gte`/`age__lte`, `playing_time__gte`, `count_match__gte` (exclude aggregates built on too few matches). Paginate large pulls with the `after` cursor.

## Quality flag

`physical_check_passed` (boolean, per row) indicates whether the performance passed SkillCorner's automated physical-data quality check. `count_match` / `count_match_failed` report how many matches fed an aggregate and how many were excluded. Filter on `physical_check_passed=true` for analysis-grade data.
