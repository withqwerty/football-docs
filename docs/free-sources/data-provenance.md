---
source_type: curated
source_url: https://football-data.co.uk/notes.txt
upstream_version: null
crawled_at: 2026-09-24
---

# Free sources data provenance

Each free source has its own origin. Check it before you build on the data.

## StatsBomb Open Data data sources

**Category:** first-party.

StatsBomb Open Data is a subset of StatsBomb's own collected event data,
exported from the StatsBomb Data API. Credit StatsBomb as the source when you
publish work based on it.

Source: [hudl/open-data README](https://github.com/hudl/open-data): the data are
"JSON files exported from the StatsBomb Data API". Checked 2026-09-24.

## FBref data sources

**Category:** licensed (until January 2026).

FBref's advanced statistics came from a licensed feed (Opta, from Stats
Perform), which ended in January 2026. See `fbref.md`. FBref does not publicly
document the source of the basic results and statistics it still shows.

## Understat data sources

**Category:** derived (xG model); not publicly documented (shot data).

Understat's xG values come from its own neural-network model, trained on more
than 100,000 shots. Understat does not say where the underlying match and shot
data comes from.

Source: [Understat](https://understat.com/): "we trained neural network
prediction algorithms with the large dataset (>100,000 shots, over 10 parameters
for each)". Checked 2026-09-24.

## ClubElo data sources

**Category:** derived.

ClubElo computes its own Elo ratings from match results. Its pages show each
rating change per match. The site does not currently publish a methodology page
or name its source of results.

Source: [ClubElo](https://clubelo.com/). Checked 2026-09-24.

## football-data.co.uk data sources

**Category:** aggregated.

football-data.co.uk compiles its files from named public sources: XScores for
results, and the BBC, Flashscore, ESPN Soccer, Bundesliga.de, Gazzetta.it and
Football.fr for match statistics.

Source: [football-data.co.uk notes](https://football-data.co.uk/notes.txt).
Checked 2026-09-24.

## engsoccerdata data sources

**Category:** aggregated.

engsoccerdata is compiled by James Curley from sources listed in its README,
including footballcsv, Wikipedia, RSSSF, 11v11, worldfootball.net and
football-data.co.uk.

Source: [jalapic/engsoccerdata README](https://github.com/jalapic/engsoccerdata)
("List of Sources", "Compiled by James Curley"). Checked 2026-09-24.

## European Football Statistics data sources

**Category:** aggregated; sources not publicly documented.

The site collects European football statistics "which are not easily found on
internet", but does not name its sources.

Source: [european-football-statistics.co.uk](https://www.european-football-statistics.co.uk/).
Checked 2026-09-24.
