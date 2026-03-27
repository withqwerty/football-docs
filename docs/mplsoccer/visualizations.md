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

Two-step workflow: bin the data, then plot.

```python
# Step 1: Bin the data
bin_statistic = pitch.bin_statistic(x, y, statistic='count', bins=(25, 25))

# Optional: Gaussian smoothing
from scipy.ndimage import gaussian_filter
bin_statistic['statistic'] = gaussian_filter(bin_statistic['statistic'], sigma=1)

# Step 2: Plot
pcm = pitch.heatmap(bin_statistic, ax=ax, cmap='hot', edgecolors='#22312b')

# Optional: Add labels
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

```python
bin_statistic = pitch.bin_statistic_sonar(x, y, angle, bins=(6, 4, 8))
pitch.sonar(bin_statistic, ax=ax, fc='cornflowerblue')
pitch.sonar_grid(bin_statistic, ax=ax)
```

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
