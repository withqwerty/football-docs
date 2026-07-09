# Contextual Story Joins

Use free and public sources to enrich football fixture data with context that
commercial event feeds do not always provide: opponent strength, travel distance,
weather, venue geography, historical baselines, and independent xG.

## Base fixture authority

Choose one provider as the authority for fixture identity, final scores, and match
status before joining context.

| Need | Good base source |
|---|---|
| in-season fixture ids and live status | SportMonks, Opta, TheSportsDB, Sportradar |
| historical result grids | football-data.co.uk, engsoccerdata |
| shot-level xG enrichment | Understat, StatsBomb Open Data where covered |
| broad season stats | FBref / soccerdata |

Do not let an enrichment source silently override the base fixture score or status.
If an enrichment feed lags behind the fixture authority, preserve the base fixture
and mark the enrichment fields unavailable.

## Strength controls with ClubElo

ClubElo is useful for match-day team-strength controls and fixture-difficulty
stories. Join by the fixture date and a maintained team-name map:

```text
home_elo = ClubElo(home_team, fixture_date)
away_elo = ClubElo(away_team, fixture_date)
elo_diff = home_elo - away_elo
```

ClubElo names are not guaranteed to match provider team labels. Keep the alias
map in project code, and treat promoted, renamed, and abbreviated clubs as normal
data-quality cases.

## Weather and climate context

Weather can be joined at venue and kickoff time:

| Field | Join key |
|---|---|
| observed match weather | venue latitude/longitude + kickoff timestamp |
| climate normal | venue latitude/longitude + month |
| weather anomaly | observed value minus climate normal |
| condition bucket | rain, snow, fog, clear, wind, heat, cold |

For public weather APIs, store the fetched timestamp, timezone, and units. Weather
observations are contextual features, not football-provider facts, so label them
separately from official match data.

## Travel and venue geography

For travel-distance stories, maintain a venue table with club, stadium,
latitude/longitude, city, and country. Calculate away travel with a geodesic
distance such as haversine:

```text
away_travel_km = distance(away_venue_lat_lon, home_venue_lat_lon)
```

Use travel bands for stable charts, for example `<50 km`, `50-100 km`, `100-200 km`,
`200-300 km`, and `300+ km`. Distances are approximations of geography, not actual
team travel logistics.

## Independent xG enrichment

Understat can add independent xG to result stories for the top European leagues.
Join by date plus home/away team aliases, not by Understat match id alone. Keep
fields such as:

| Field | Meaning |
|---|---|
| `xg` | team's Understat expected goals |
| `xga` | opponent Understat expected goals |
| `xg_model` | `understat` |
| `xg_join_status` | exact, alias, manual, missing |

If the base provider also supplies expected goals, do not average the values unless
the chart explicitly describes a blended model. Expose both model names instead.

## Prediction-market context

Prediction markets can add public expectation and attention signals to football
stories, especially around title races, top-four races, relegation, transfers,
manager markets, and major tournaments. Treat these as market context, not as
official football facts.

For Polymarket-style public market APIs, keep this data contract:

| Field | Meaning | Notes |
|---|---|---|
| `market_id` / `market_slug` | stable market identity | Keep separate from the fixture or competition id. |
| `market_type` | title, top-four, relegation, match winner, transfer, manager, other | Use a local taxonomy; market question text changes over time. |
| `outcome` | team, player, yes/no, or other outcome label | Preserve the displayed label and any mapped canonical entity id. |
| `price` | current outcome price / implied probability in `[0, 1]` | Label as market-implied probability, not model probability. |
| `volume` / `volume_24h` | total or rolling traded volume | Store currency and fetch date; volume is attention/liquidity, not confidence. |
| `snapshot_date` | date/time of the observation | Needed for odds history and movement charts. |
| `source_tag` | league, sport, or topic tag used to fetch markets | For example, Premier League, La Liga, Bundesliga, Soccer, or Sports. |

Useful chart outputs:

| Output | Rule |
|---|---|
| odds card | latest price, previous price, percentage-point change, market type, volume |
| swing detector | flag absolute moves such as `abs(delta) >= 0.05`, plus ratio moves such as halving/doubling |
| volume comparison | sum event or market volume by source tag, but keep tag ids and fetch date |
| story join | join to fixtures, clubs, or competitions by maintained aliases; never by fuzzy names only |

Implementation notes:

- Prediction-market APIs and bookmaker-odds CSVs are different sources. Do not
  mix exchange prices, bookmaker odds, and model probabilities in one field.
- Market prices can be illiquid or stale. Surface volume, last updated time, and
  minimum-history requirements before showing a "biggest mover" card.
- Many football markets are season or proposition markets rather than match
  fixtures. Store the market question and market type so agents do not force a
  fixture schema onto title, top-four, relegation, or transfer markets.
- When using public tags or topic ids to fetch markets, keep those ids in config
  and cache responses. Tag taxonomies can change independently of football
  provider ids.
- For regulated or user-facing products, add jurisdiction and availability
  checks outside the data pipeline. The football-docs guidance is only about
  data joins and chart semantics.

## Additive factor stories

For home-advantage, away-day, and match-context stories, build factors from
explicit rules:

| Factor | Example rule |
|---|---|
| long away trip | `away_travel_km >= 300` |
| local derby | `away_travel_km < 30` |
| evening kickoff | kickoff hour `>= 18` |
| midweek fixture | Tuesday, Wednesday, or Thursday |
| severe weather | heavy rain, snow, fog, high wind, or extreme heat/cold |
| strength control | Elo difference at fixture date |

Keep the raw fields and the factor flags. This lets users inspect the story logic
and lets agents reproduce the chart without guessing which thresholds were used.

## Join hygiene

For public data-story pipelines:

- keep provider ids, team aliases, and venue aliases as explicit mapping tables;
- record whether each joined field came from exact id, alias, date/team match, or
  manual override;
- never overwrite official scores with scraped enrichment data;
- cache public-source responses and respect rate limits;
- label sample-size limits when slicing by rare conditions such as snow or fog;
- separate observed facts from modelled controls such as Elo-adjusted residuals.
