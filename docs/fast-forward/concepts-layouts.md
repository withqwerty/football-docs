---
source_url: https://fast-forward.readthedocs.io/en/latest/concepts/layouts/
source_type: crawled
upstream_version: 0.2.0
crawled_at: 2026-07-31T18:45:12.332Z
---
fast-forward supports three DataFrame layouts that determine how tracking data is structured. Choose based on your analysis needs.

## Long Layout (default)

`layout="long"`

Each row represents **one object (player or ball) in one frame**. The ball is included as a row with `team_id="ball"` and `player_id="ball"`.

```
┌──────────┬───────────┬───────────┬─────────────┬─────────┬────────────┬──────┬──────┬──────┐
│ frame_id ┆ period_id ┆ timestamp ┆ ball_state  ┆ team_id ┆ player_id  ┆ x    ┆ y    ┆ z    │
│ u32      ┆ i32       ┆ dur[ms]   ┆ str         ┆ str     ┆ str        ┆ f32  ┆ f32  ┆ f32  │
╞══════════╪═══════════╪═══════════╪═════════════╪═════════╪════════════╪══════╪══════╪══════╡
│ 1        ┆ 1         ┆ 0ms       ┆ alive       ┆ ball    ┆ ball       ┆ 0.5  ┆ 0.0  ┆ 0.1  │
│ 1        ┆ 1         ┆ 0ms       ┆ alive       ┆ T01     ┆ P001       ┆ -20  ┆ 5.0  ┆ 0.0  │
│ 1        ┆ 1         ┆ 0ms       ┆ alive       ┆ T01     ┆ P002       ┆ -15  ┆ -3.0 ┆ 0.0  │
│ 1        ┆ 1         ┆ 0ms       ┆ alive       ┆ T02     ┆ P011       ┆ 10   ┆ 2.0  ┆ 0.0  │
│ 2        ┆ 1         ┆ 40ms      ┆ alive       ┆ ball    ┆ ball       ┆ 1.2  ┆ 0.3  ┆ 0.2  │
│ ...      ┆ ...       ┆ ...       ┆ ...         ┆ ...     ┆ ...        ┆ ...  ┆ ...  ┆ ...  │
└──────────┴───────────┴───────────┴─────────────┴─────────┴────────────┴──────┴──────┴──────┘
```

**Best for:** Most analysis workflows. Easy to filter by player, team, or frame. Group-by operations are straightforward.

```
import polars as pl

# Average position per player
dataset.tracking.filter(
    pl.col("team_id") != "ball"
).group_by("player_id").agg(
    pl.col("x").mean(),
    pl.col("y").mean(),
)
```

## Long Ball Layout

`layout="long_ball"`

Each row represents **one player in one frame**. Ball coordinates are in **separate columns** on every row (not as a separate row). No ball rows exist.

```
┌──────────┬───────────┬───────────┬────────┬────────┬────────┬─────────┬────────────┬──────┬──────┬──────┐
│ frame_id ┆ period_id ┆ timestamp ┆ ball_x ┆ ball_y ┆ ball_z ┆ team_id ┆ player_id  ┆ x    ┆ y    ┆ z    │
│ u32      ┆ i32       ┆ dur[ms]   ┆ f32    ┆ f32    ┆ f32    ┆ str     ┆ str        ┆ f32  ┆ f32  ┆ f32  │
╞══════════╪═══════════╪═══════════╪════════╪════════╪════════╪═════════╪════════════╪══════╪══════╪══════╡
│ 1        ┆ 1         ┆ 0ms       ┆ 0.5    ┆ 0.0    ┆ 0.1    ┆ T01     ┆ P001       ┆ -20  ┆ 5.0  ┆ 0.0  │
│ 1        ┆ 1         ┆ 0ms       ┆ 0.5    ┆ 0.0    ┆ 0.1    ┆ T01     ┆ P002       ┆ -15  ┆ -3.0 ┆ 0.0  │
│ 1        ┆ 1         ┆ 0ms       ┆ 0.5    ┆ 0.0    ┆ 0.1    ┆ T02     ┆ P011       ┆ 10   ┆ 2.0  ┆ 0.0  │
│ 2        ┆ 1         ┆ 40ms      ┆ 1.2    ┆ 0.3    ┆ 0.2    ┆ T01     ┆ P001       ┆ -19  ┆ 5.2  ┆ 0.0  │
│ ...      ┆ ...       ┆ ...       ┆ ...    ┆ ...    ┆ ...    ┆ ...     ┆ ...        ┆ ...  ┆ ...  ┆ ...  │
└──────────┴───────────┴───────────┴────────┴────────┴────────┴─────────┴────────────┴──────┴──────┴──────┘
```

**Best for:** Analyses that need both player and ball positions simultaneously without joining. Calculating distances to ball, for example.

```
import polars as pl

# Distance from each player to the ball
dataset.tracking.with_columns(
    ((pl.col("x") - pl.col("ball_x"))**2 +
     (pl.col("y") - pl.col("ball_y"))**2).sqrt().alias("dist_to_ball")
)
```

## Wide Layout

`layout="wide"`

Each row represents **one frame**. Player coordinates are stored in columns named `{player_id}_x`, `{player_id}_y`, `{player_id}_z`.

```
┌──────────┬───────────┬───────────┬────────┬────────┬────────┬──────────┬──────────┬──────────┬──────────┬─────┐
│ frame_id ┆ period_id ┆ timestamp ┆ ball_x ┆ ball_y ┆ ball_z ┆ P001_x   ┆ P001_y   ┆ P001_z   ┆ P002_x   ┆ ... │
│ u32      ┆ i32       ┆ dur[ms]   ┆ f32    ┆ f32    ┆ f32    ┆ f32      ┆ f32      ┆ f32      ┆ f32      ┆     │
╞══════════╪═══════════╪═══════════╪════════╪════════╪════════╪══════════╪══════════╪══════════╪══════════╪═════╡
│ 1        ┆ 1         ┆ 0ms       ┆ 0.5    ┆ 0.0    ┆ 0.1    ┆ -20.0    ┆ 5.0      ┆ 0.0      ┆ -15.0    ┆ ... │
│ 2        ┆ 1         ┆ 40ms      ┆ 1.2    ┆ 0.3    ┆ 0.2    ┆ -19.0    ┆ 5.2      ┆ 0.0      ┆ -14.8    ┆ ... │
│ ...      ┆ ...       ┆ ...       ┆ ...    ┆ ...    ┆ ...    ┆ ...      ┆ ...      ┆ ...      ┆ ...      ┆ ... │
└──────────┴───────────┴───────────┴────────┴────────┴────────┴──────────┴──────────┴──────────┴──────────┴─────┘
```

**Best for:** Frame-level operations, matrix computations, Voronoi diagrams, and convex hull calculations where you need all positions in a single row.

Warning

Wide layout produces DataFrames with many columns (3 per player + shared columns). Column names are game-specific (player IDs), which means the schema varies between matches.

## Comparison

| Aspect | Long | Long Ball | Wide |
| --- | --- | --- | --- |
| Rows per frame | ~23 (22 players + ball) | ~22 (players only) | 1 |
| Ball data | Row with `team_id="ball"` | Columns: `ball_x/y/z` | Columns: `ball_x/y/z` |
| Schema | Fixed | Fixed | Varies per match |
| Group-by player | Easy | Easy | Not applicable |
| Frame-level ops | Needs pivot | Needs pivot | Native |
| Memory | Moderate | Moderate | Compact |