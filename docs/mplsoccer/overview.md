# mplsoccer

## Overview

mplsoccer is a Python library for plotting soccer/football charts using Matplotlib and loading StatsBomb open data. Created by Andrew Rowlinson and Anmol Durgapal, licensed under MIT. Current version: 1.6.1.

- **Install**: `pip install mplsoccer` or `conda install -c conda-forge mplsoccer`
- **Dependencies**: matplotlib>=3.6, numpy, pandas, pillow, requests, scipy, seaborn

## Key Features

**Pitch-based visualizations**: scatter plots, heatmaps, hexbin, KDE plots, arrows (pass maps), comet lines, flow maps, Voronoi diagrams, Delaunay tessellation, convex hulls, polygons, goal angle visualization, pass networks, shot freeze frames, formations, Juego de Posición heatmaps, pass sonars, animations.

**Non-pitch chart types**: radar charts (`Radar`), pizza/Nightingale charts (`PyPizza`), bumpy charts (`Bumpy`), turbine charts.

**Utilities**: `FontManager` (Google Fonts), `Standardizer` (coordinate conversion), `add_image`/`inset_image`, `grid()`/`jointgrid()` layout helpers, `Sbopen`/`Sbapi`/`Sblocal` (StatsBomb data loading).

## Limitations and Caveats

- **Y-axis inversion varies by provider**: StatsBomb, Wyscout, and Metrica have inverted y-axes. mplsoccer handles this internally.
- **Tracking data pitch types require explicit dimensions**: `tracab`, `metricasports`, `skillcorner`, `secondspectrum`, and `custom` all need `pitch_length` and `pitch_width`.
- **Wyscout goal width discrepancy**: mplsoccer uses ggsoccer's 12 units (vs socceraction's 10 units).
- **Opta vs Wyscout**: Both use 0-100 coordinates but Wyscout has inverted y-axis. Easy to mix up.
- **Matplotlib-based**: Performance for very large datasets or interactive use can be limited.
- **No built-in data fetching beyond StatsBomb**: For Opta, Wyscout, etc., load data yourself; mplsoccer only handles visualization and coordinate standardization.
