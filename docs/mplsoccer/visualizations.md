# mplsoccer Visualizations

## Drawing a Pitch

```python
from mplsoccer import Pitch, VerticalPitch

pitch = Pitch()
fig, ax = pitch.draw()

# Grid of pitches
fig, axs = pitch.draw(nrows=2, ncols=3)

# On existing axes
pitch.draw(ax=existing_ax)
```

All plotting methods are called on the pitch object, passing `ax=ax` as a parameter.

## Scatter Plots (Shot Maps, Player Positions)

```python
pitch.scatter(x, y, ax=ax, s=100, c='red', edgecolors='black', zorder=2)

# With rotation (e.g., for player orientation arrows)
pitch.scatter(x, y, rotation_degrees=angle, ax=ax)

# Football marker
pitch.scatter(x, y, marker='football', ax=ax)
```

## Heatmaps (Binned Statistics)

Two-step workflow: normalise the event coordinates, bin the data, then plot.
Use this recipe for touch-density charts, defensive-action density, pass-origin
density, reception maps, and other located-event surfaces.

| Field | Heatmap use | Notes |
|---|---|---|
| `x`, `y` | bin assignment | Use one pitch type and orientation for the selected events before binning. |
| `event_type` | event selection | State whether the heatmap counts all located touches, only passes, defensive actions, receptions, shots, or another subset. |
| `team_id` / `player_id` | subject filter | Filter upstream; an empty selection should render an honest empty state rather than fake zero-density cells. |
| `value` / `weight` | weighted heatmap | Counts are safest. If weighting by xT, OBV, pressure, or another metric, label the value source and units. |
| `period` / `minute` | phase filters | Apply game-state or time-window filters before binning so the scale bar matches the plotted selection. |

Choose the chart type deliberately:

| Need | mplsoccer surface | Use when |
|---|---|---|
| inspectable event-density grid | `bin_statistic` + `heatmap` | You need transparent rectangular bins and tooltip/table-friendly counts or shares. |
| fixed editorial zone read | `bin_statistic_positional` + `heatmap_positional` | You want Juego de Posición or territory zones with readable labels. |
| smoothed local density | `kdeplot` | You want a visual concentration surface and can tolerate smoothing/interpolation. |
| xT or value overlay | `heatmap` over a value grid | You are plotting a model grid; do not describe it as raw touch density. |

For public charts, label the denominator: raw counts, share of selected events,
relative frequency, or metric sum. Zero-event selections should be marked
unavailable or empty; do not divide by zero or colour an all-zero chart as if it
contains signal.

```python
bin_statistic = pitch.bin_statistic(x, y, statistic='count', bins=(25, 25))

from scipy.ndimage import gaussian_filter
bin_statistic['statistic'] = gaussian_filter(bin_statistic['statistic'], sigma=1)

pcm = pitch.heatmap(bin_statistic, ax=ax, cmap='hot', edgecolors='#22312b')

pitch.label_heatmap(bin_statistic, ax=ax, str_format='{:.0f}', color='white',
                     fontsize=8, exclude_zeros=True)
```

## Juego de Posición Heatmaps

Positional play zones (used by Pep Guardiola-style analysis):

```python
bin_statistic = pitch.bin_statistic_positional(x, y, statistic='count')
pitch.heatmap_positional(bin_statistic, ax=ax, cmap='coolwarm', edgecolors='#22312b')
pitch.label_heatmap(bin_statistic, ax=ax, str_format='{:.0f}')
```

## Hexbin Plots

```python
pitch.hexbin(x, y, ax=ax, gridsize=20, cmap='Reds', edgecolors='grey')
```

NaN values are filtered out internally.

## KDE Plots (Kernel Density Estimation)

Uses seaborn internally, auto-clipped to pitch boundaries.

```python
pitch.kdeplot(x, y, ax=ax, fill=True, levels=100, cmap='Reds', thresh=0)
```

## Arrows (Pass Maps)

```python
pitch.arrows(xstart, ystart, xend, yend, ax=ax,
             color='blue', width=2, headwidth=5, headlength=5)
```

## Lines and Comet Lines

```python
# Standard lines
pitch.lines(xstart, ystart, xend, yend, ax=ax, lw=2, color='blue')

# Comet lines (transparency gradient from start to end)
pitch.lines(xstart, ystart, xend, yend, ax=ax, comet=True,
            transparent=True, alpha_start=0.01, alpha_end=1.0)

# Comet with colormap
pitch.lines(xstart, ystart, xend, yend, ax=ax, comet=True,
            cmap='plasma', n_segments=100)
```

Note: comet lines split each line into `n_segments` (default 100). Large datasets may be slow.

## Flow Maps

Binned average direction and distance as arrows:

```python
pitch.flow(xstart, ystart, xend, yend, ax=ax,
           bins=(6, 4), arrow_type='same', arrow_length=10, color='blue')
```

## Voronoi Diagrams

```python
team1, team2 = pitch.voronoi(x, y, teams)
pitch.polygon(team1, ax=ax, fc='red', alpha=0.3, ec='black')
pitch.polygon(team2, ax=ax, fc='blue', alpha=0.3, ec='black')
```

Uses a reflection trick to extend Voronoi cells to pitch edges. Players outside pitch boundaries are clipped.

## Convex Hulls

```python
hull = pitch.convexhull(x, y)
pitch.polygon(hull, ax=ax, facecolor='cornflowerblue', alpha=0.3)
```

## Delaunay Tessellation

```python
pitch.triplot(x, y, ax=ax, color='blue', linewidth=2)
```

## Goal Angle Visualization

```python
pitch.goal_angle(x, y, ax=ax, goal='right', alpha=0.3, color='red')
```

## Pass Sonars

Pass sonars and pass-flow charts need event-level pass vectors, not just pass
counts. Prepare the pass stream before calling mplsoccer:

| Field | Sonar / flow use | Notes |
|---|---|---|
| `x`, `y` | pass-origin binning | Normalise every provider to one pitch frame before mixing teams or sources. |
| `end_x`, `end_y` | direction vector | Do not infer a direction when destination coordinates are missing. |
| `angle` | sonar wedge assignment | Prefer recomputing from start/end coordinates after standardisation unless the provider angle convention is known. |
| `outcome` | completed-only filters and completion rings | State whether the chart uses attempted passes, completed passes, or both. |
| `player_id` / `team_id` | subject filter | A player sonar should use one filtered player; a team flow map should use one team or one phase of play. |
| `minute` / `period` | game-state or phase filters | Use expanded minutes if stoppage-time filters matter. |

Provider caveats:

- StatsBomb exposes `pass_end_location`, `pass_angle`, `pass_length`,
  `pass_recipient`, and `outcome` in event data. Its angles are radians, but a
  charting adapter should still standardise coordinates first.
- Opta F24 pass events need qualifiers `140` and `141` for end coordinates.
  `passmatrix` is useful for player-to-player connection counts, but it is not
  enough for directional sonars or flow fields because it lacks event-level
  vectors.
- Wyscout pass `angle` is degrees with `0°` as forward, positive values to the
  right, negative values to the left, and `180°` as straight back. Recompute or
  convert angles carefully when plotting in a different visual frame.
- Kloppy can normalise many providers into `event.coordinates` and
  `event.raw_event`; use that normalised layer rather than mixing raw coordinate
  conventions in a plotting function.

For flow maps, aggregate origins into spatial bins and compute the mean
direction with circular statistics (`sin`/`cos` components), not a plain
arithmetic mean of degrees. This avoids broken averages at the `-180°` / `180°`
boundary. Sparse bins should show no arrow or a low-confidence marker rather
than a misleading direction from one pass.

```python
bin_statistic = pitch.bin_statistic_sonar(x, y, angle, bins=(6, 4, 8))
pitch.sonar(bin_statistic, ax=ax, fc='cornflowerblue')
pitch.sonar_grid(bin_statistic, ax=ax)
```

## Player Profile Radar and Pizza Data Prep

`Radar` and `PyPizza` are chart renderers, not metric engines. Prepare aggregate
rows before plotting:

| Field | Radar / pizza use | Notes |
|---|---|---|
| `metric` / `params` | axis or slice label | Order metrics by football meaning, not alphabetically. |
| `raw_value` | badge, tooltip, or display text | Keep the original unit, such as per 90, percentage, or total. |
| `percentile` | pizza slice length or radar value in percentile mode | Calculate against a named cohort: league, season, position group, age band, and minimum minutes. |
| `min_range` / `max_range` | `Radar` range mode | Use defensible bounds; do not mix raw totals and per-90 values on the same range. |
| `lower_is_better` | inverted radar axes | Mark turnover, loss, goals conceded, or fouls-style metrics explicitly. |
| `category` | grouped colours/legend | Use stable attacking, progression, defending, physical, or goalkeeping buckets. |

Provider data is usually not ready for these charts directly. Wyscout and
StatsBomb expose many per-90 player metrics, SkillCorner exposes physical and
Game Intelligence metrics with `p90`/`p60bip`/possession normalisations, and
FMDB Pro exposes attributes plus percentile groups. Choose one normalisation
contract before combining sources.

For public scouting profiles, include methodology next to the chart:

- cohort definition and sample size;
- minutes threshold, especially when using per-90 rates;
- whether percentiles are position-specific;
- whether lower-is-better metrics were inverted;
- source of each metric family when mixing providers.

Do not treat a radar or pizza chart as proof of player quality by itself. It is
a profile view over pre-selected metrics; the comparison logic lives in the
cohort, metric set, and normalisation.

## Player Baseline Percentile Bars

Use this recipe when an agent asks for player dossier baseline bars, percentile
benchmarks, p50/p80 reference markers, peer-group comparison strips, or compact
cross-match benchmark panels.

| Field | Meaning | Display rule |
|---|---|---|
| `metric_id` / `metric_label` | stable metric key and label | Keep metric identity separate from display copy. |
| `player_value` | the player's raw or per-90 value | Show with units, but do not place it on the percentile axis. |
| `percentile` | rank of `player_value` within the named cohort | Bar fill / marker position on a fixed 0-100 percentile axis. |
| `corpus_p50` / `corpus_p80` | raw-value benchmarks from the cohort | Draw as labelled reference values, not as axis positions unless explicitly converted to percentiles. |
| `population_size` | number of comparable rows | Surface weak samples; do not hide the denominator. |
| `sufficient` | whether the cohort passes the sample rule | When false, hide percentile, p50, and p80 together. |

Implementation notes:

- A percentile-bar track is a 0-100 percentile axis, not a raw metric-value
  axis. Place the player marker at `percentile`, not at `player_value`.
- Calculate `corpus_p50` and `corpus_p80` from the same filtered cohort used for
  the percentile: league, season, position group, age band, and minutes floor.
- If the cohort is too small, return `percentile`, `corpus_p50`, and
  `corpus_p80` as unavailable together. A fake 0th percentile is worse than no
  benchmark.
- Store the raw value and percentile together so tooltips can say both, for
  example `0.42 xG/90, 82nd percentile`.
- For lower-is-better metrics, document whether the percentile has been inverted
  so higher always reads better, or leave it uninverted and label that clearly.

## Radar Charts

```python
from mplsoccer import Radar

radar = Radar(
    params=['Goals', 'Assists', 'xG', 'xA', 'Passes'],
    min_range=[0, 0, 0, 0, 0],
    max_range=[30, 20, 25, 15, 3000],
    lower_is_better=['Miscontrol'],  # invert specific params
    num_rings=4,
    ring_width=1,
    center_circle_radius=2,
)

fig, ax = radar.setup_axis()
radar.draw_circles(ax=ax)
rings_inner, rings_outer, vertices = radar.draw_radar(
    values, ax=ax, kwargs_radar={'facecolor': '#aa65b2', 'alpha': 0.6}
)
radar.draw_range_labels(ax=ax)
radar.draw_param_labels(ax=ax)

# Comparison radar (two players)
radar.draw_radar_compare(values1, values2, ax=ax)

# Multi-player (3+) -- stacked solid fills
radar.draw_radar_solid(values_list, ax=ax)
```

## Pizza Charts (Percentile Ranks)

```python
from mplsoccer import PyPizza

baker = PyPizza(
    params=params,
    straight_line_color="#000000",
    straight_line_lw=1,
    last_circle_lw=1,
    other_circle_lw=1,
    other_circle_ls="-.",
    inner_circle_size=20,
)

fig, ax = baker.make_pizza(
    values, figsize=(8, 8), param_location=110,
    kwargs_slices=dict(facecolor='cornflowerblue', edgecolor='black'),
    kwargs_params=dict(color='black', fontsize=12),
    kwargs_values=dict(color='black', fontsize=12),
)
```

## Bumpy Charts (Rank Changes)

`Bumpy` expects already-prepared rank snapshots. Use this recipe for league-table
bump charts, title-race trackers, relegation-race trackers, or form-table rank
stories:

| Field | Bumpy use | Notes |
|---|---|---|
| `timepoint` / `x_list` | matchweek, round, season, or snapshot label | Keep discrete labels ordered; do not use match dates if several teams have played different numbers of matches unless that is the intended story. |
| `rank` / `y_list` | ordinal position | Rank `1` belongs at the top. Preserve ties and tie-break rules from the standings source. |
| `entity` / `values` | team or player label | Use stable IDs internally and display names only for labels. |
| `value` | tooltip enrichment | Points, goal difference, expected points, or projected finish can be shown, but the line position should remain rank. |
| `highlight_dict` | editorial emphasis | Highlight the story teams and dim the field rather than assigning unrelated colours to every club. |

Provider surfaces:

- SportMonks: `GET /standings/rounds/{roundId}?include=participant;details`
  gives round standings after fetching season rounds.
- Wyscout: `/seasons/{wyId}/standings` and `/seasons/{wyId}/career` can supply
  standings and gameweek-filtered history where licensed.
- Opta: `/standings/{token}?tmcl={seasonId}` gives league-table views; a
  rank-over-time chart still needs snapshots per round or a local history table.
- soccerdata/Sofascore can provide season schedule plus final/current league
  table, but round-by-round reconstruction may need completed fixtures and
  tie-break logic.

For public charts, state whether each rank is a provider standings snapshot,
live/current table, reconstructed table from completed fixtures, or projected
simulation output. If a round is missing for an entity, break or mark the line
rather than silently interpolating through an unavailable rank.

```python
from mplsoccer import Bumpy

bumpy = Bumpy(
    scatter_color='#282828',
    line_color='#252525',
    rotate_xticks=90,
    ticklabel_size=12,
)

fig, ax = bumpy.plot(
    x_list=matchweeks, y_list=rankings, values=team_names,
    highlight_dict={'Arsenal': 'red'},
    figsize=(16, 10),
)
```

## Layout Helpers

### Grid (title + pitch + endnote)

```python
fig, axs = pitch.grid(figheight=10, title_height=0.06, endnote_height=0.03)
# axs is a dict: axs['pitch'], axs['title'], axs['endnote']
axs['title'].text(0.5, 0.5, 'My Title', ha='center', va='center')
```

### Joint Grid (pitch + marginal axes)

```python
fig, axs = pitch.jointgrid(ax_top=True, ax_right=True)
# axs['pitch'], axs['top'], axs['right'], axs['title'], axs['endnote']
```

## StatsBomb Data Loading

```python
from mplsoccer import Sbopen

parser = Sbopen()

# Browse available data
df_competition = parser.competition()
df_match = parser.match(competition_id=11, season_id=1)

# Load match data
df_lineup = parser.lineup(match_id)
df_event, df_related, df_freeze, df_tactics = parser.event(match_id)

# StatsBomb 360 data
frames, visible = parser.frame(match_id)
```

Also available: `Sbapi` (for API access with credentials) and `Sblocal` (for local files).

## Utility Functions

```python
from mplsoccer import FontManager, add_image

# Load Google Fonts
fm = FontManager('https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto-Regular.ttf')

# Add image/logo to plot
add_image(image, fig, left=0.1, bottom=0.9, width=0.1)

# Inset axes on pitch (e.g., for mini charts at player positions)
inset_ax = pitch.inset_axes(x, y, width=10, height=10, ax=ax)

# Inset image on pitch
pitch.inset_image(x, y, image, width=10, ax=ax)

# Flip coordinates to other half
x_flip, y_flip = pitch.flip_side(x, y, flip=True)

# Calculate angle and distance
angle, distance = pitch.calculate_angle_and_distance(x1, y1, x2, y2, degrees=True)
```
