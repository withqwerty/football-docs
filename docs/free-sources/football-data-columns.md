---
source_type: curated
source_url: https://www.football-data.co.uk/notes.txt
upstream_version: null
crawled_at: 2026-10-04
---

# football-data.co.uk CSV columns

football-data.co.uk publishes a key to every column in its CSV files at
https://www.football-data.co.uk/notes.txt. The tables below repeat that key
word for word; they are generated from a copy of the file
(`specs/football-data/notes.txt`) and checked in CI. Where a row lists two
columns, notes.txt gives both names for the same value (for example `FTHG` and
`HG`).

The CSV files are at `https://www.football-data.co.uk/mmz4281/{season}/{league}.csv`;
see [Free Football Data Sources](overview.md) for the season and league codes.

## Which columns a file has

Not every file has every column. notes.txt says that "some abbreviations are no
longer in use (in particular odds from specific bookmakers no longer used) and
refer to data collected in earlier seasons", and that match statistics are
included "where available". Read the header row of each file rather than
assuming a column exists. For the bookmakers in the current files, notes.txt
points to https://www.football-data.co.uk/matches.php.

## Results

<!-- generated:football-data-results start -->
| Column | Meaning |
|---|---|
| `Div` | League Division |
| `Date` | Match Date (dd/mm/yy) |
| `Time` | Time of match kick off |
| `HomeTeam` | Home Team |
| `AwayTeam` | Away Team |
| `FTHG`, `HG` | Full Time Home Team Goals |
| `FTAG`, `AG` | Full Time Away Team Goals |
| `FTR`, `Res` | Full Time Result (H=Home Win, D=Draw, A=Away Win) |
| `HTHG` | Half Time Home Team Goals |
| `HTAG` | Half Time Away Team Goals |
| `HTR` | Half Time Result (H=Home Win, D=Draw, A=Away Win) |
<!-- generated:football-data-results end -->

## Match statistics (where available)

<!-- generated:football-data-match-statistics start -->
| Column | Meaning |
|---|---|
| `Attendance` | Crowd Attendance |
| `Referee` | Match Referee |
| `HS` | Home Team Shots |
| `AS` | Away Team Shots |
| `HST` | Home Team Shots on Target |
| `AST` | Away Team Shots on Target |
| `HHW` | Home Team Hit Woodwork |
| `AHW` | Away Team Hit Woodwork |
| `HC` | Home Team Corners |
| `AC` | Away Team Corners |
| `HF` | Home Team Fouls Committed |
| `AF` | Away Team Fouls Committed |
| `HFKC` | Home Team Free Kicks Conceded |
| `AFKC` | Away Team Free Kicks Conceded |
| `HO` | Home Team Offsides |
| `AO` | Away Team Offsides |
| `HY` | Home Team Yellow Cards |
| `AY` | Away Team Yellow Cards |
| `HR` | Home Team Red Cards |
| `AR` | Away Team Red Cards |
| `HBP` | Home Team Bookings Points (10 = yellow, 25 = red) |
| `ABP` | Away Team Bookings Points (10 = yellow, 25 = red) |
<!-- generated:football-data-match-statistics end -->

Two notes from notes.txt on these columns:

- Free kicks conceded (`HFKC`, `AFKC`) include fouls, offsides and any other
  offence, so they are always equal to or higher than fouls. They are shown when
  specific data on fouls is not available (France 2nd, Belgium 1st and Greece
  1st divisions).
- English and Scottish yellow cards do not include the first yellow card when a
  second yellow turns into a red; in European games that card is counted as a
  yellow (plus red).

## Betting odds

### Pre-closing and closing odds

The odds columns below are pre-closing odds. notes.txt: "For the closing odds,
as below but with an additional "C" character following the bookmaker
abbreviation/Max/Avg (e.g. B365CH = closing Bet365 home win odds)."

By that rule, for example:

| Pre-closing | Closing | Meaning of the closing column |
|---|---|---|
| `B365H` | `B365CH` | closing Bet365 home win odds (the example notes.txt gives) |
| `PSH` | `PSCH` | closing Pinnacle home win odds |
| `PSD` | `PSCD` | closing Pinnacle draw odds |
| `PSA` | `PSCA` | closing Pinnacle away win odds |
| `MaxH` | `MaxCH` | closing market maximum home win odds |
| `AvgH` | `AvgCH` | closing market average home win odds |

Only the `B365CH` row is spelt out in notes.txt; the others follow its rule.
A file has a closing column only if its header row lists it.

notes.txt also says when the odds were collected: "Betting odds for weekend
games are collected Friday afternoons, and on Tuesday afternoons for midweek
games."

### Match odds (home win, draw, away win)

<!-- generated:football-data-match-odds start -->
| Column | Meaning |
|---|---|
| `1XBH` | 1XBet home win odds |
| `1XBD` | 1XBet draw odds |
| `1XBA` | 1XBet away win odds |
| `B365H` | Bet365 home win odds |
| `B365D` | Bet365 draw odds |
| `B365A` | Bet365 away win odds |
| `BFH` | Betfair home win odds |
| `BFD` | Betfair draw odds |
| `BFA` | Betfair away win odds |
| `BFDH` | Betfred home win odds |
| `BFDD` | Betfred draw odds |
| `BFDA` | Betfred away win odds |
| `BMGMH` | BetMGM home win odds |
| `BMGMD` | BetMGM draw odds |
| `BMGMA` | BetMGM away win odds |
| `BVH` | Betvictor home win odds |
| `BVD` | Betvictor draw odds |
| `BVA` | Betvictor away win odds |
| `BSH` | Blue Square home win odds |
| `BSD` | Blue Square draw odds |
| `BSA` | Blue Square away win odds |
| `BWH` | Bet&Win home win odds |
| `BWD` | Bet&Win draw odds |
| `BWA` | Bet&Win away win odds |
| `CLH` | Coral home win odds |
| `CLD` | Coral draw odds |
| `CLA` | Coral away win odds |
| `GBH` | Gamebookers home win odds |
| `GBD` | Gamebookers draw odds |
| `GBA` | Gamebookers away win odds |
| `IWH` | Interwetten home win odds |
| `IWD` | Interwetten draw odds |
| `IWA` | Interwetten away win odds |
| `LBH` | Ladbrokes home win odds |
| `LBD` | Ladbrokes draw odds |
| `LBA` | Ladbrokes away win odds |
| `PPH` | Paddy Power home win odds |
| `PPD` | Paddy Power draw odds |
| `PPA` | Paddy Power away win odds |
| `PSH`, `PH` | Pinnacle home win odds |
| `PSD`, `PD` | Pinnacle draw odds |
| `PSA`, `PA` | Pinnacle away win odds |
| `SKH` | Skybet home win odds |
| `SKD` | Skybet draw odds |
| `SKA` | Skybet away win odds |
| `SOH` | Sporting Odds home win odds |
| `SOD` | Sporting Odds draw odds |
| `SOA` | Sporting Odds away win odds |
| `SBH` | Sportingbet home win odds |
| `SBD` | Sportingbet draw odds |
| `SBA` | Sportingbet away win odds |
| `SJH` | Stan James home win odds |
| `SJD` | Stan James draw odds |
| `SJA` | Stan James away win odds |
| `SYH` | Stanleybet home win odds |
| `SYD` | Stanleybet draw odds |
| `SYA` | Stanleybet away win odds |
| `VCH` | VC Bet home win odds (now BetVictor, see above) |
| `VCD` | VC Bet draw odds (now BetVictor, see above) |
| `VCA` | VC Bet away win odds (now BetVictor, see above) |
| `WHH` | William Hill home win odds |
| `WHD` | William Hill draw odds |
| `WHA` | William Hill away win odds |
| `Bb1X2` | Number of BetBrain bookmakers used to calculate match odds averages and maximums |
| `BbMxH` | Betbrain maximum home win odds |
| `BbAvH` | Betbrain average home win odds |
| `BbMxD` | Betbrain maximum draw odds |
| `BbAvD` | Betbrain average draw win odds |
| `BbMxA` | Betbrain maximum away win odds |
| `BbAvA` | Betbrain average away win odds |
| `MaxH` | Market maximum home win odds |
| `MaxD` | Market maximum draw win odds |
| `MaxA` | Market maximum away win odds |
| `AvgH` | Market average home win odds |
| `AvgD` | Market average draw win odds |
| `AvgA` | Market average away win odds |
| `BFEH` | Betfair Exchange home win odds |
| `BFED` | Betfair Exchange draw odds |
| `BFEA` | Betfair Exchange away win odds |
<!-- generated:football-data-match-odds end -->

The `Bb` columns are averages and maximums across the bookmakers on Betbrain;
`Bb1X2` is how many bookmakers they were calculated from. `Max` and `Avg` are
the market maximum and average.

### Total goals odds (over and under 2.5 goals)

<!-- generated:football-data-total-goals-odds start -->
| Column | Meaning |
|---|---|
| `BbOU` | Number of BetBrain bookmakers used to calculate over/under 2.5 goals (total goals) averages and maximums |
| `BbMx>2.5` | Betbrain maximum over 2.5 goals |
| `BbAv>2.5` | Betbrain average over 2.5 goals |
| `BbMx<2.5` | Betbrain maximum under 2.5 goals |
| `BbAv<2.5` | Betbrain average under 2.5 goals |
| `GB>2.5` | Gamebookers over 2.5 goals |
| `GB<2.5` | Gamebookers under 2.5 goals |
| `B365>2.5` | Bet365 over 2.5 goals |
| `B365<2.5` | Bet365 under 2.5 goals |
| `P>2.5` | Pinnacle over 2.5 goals |
| `P<2.5` | Pinnacle under 2.5 goals |
| `Max>2.5` | Market maximum over 2.5 goals |
| `Max<2.5` | Market maximum under 2.5 goals |
| `Avg>2.5` | Market average over 2.5 goals |
| `Avg<2.5` | Market average under 2.5 goals |
<!-- generated:football-data-total-goals-odds end -->

### Asian handicap odds

<!-- generated:football-data-asian-handicap-odds start -->
| Column | Meaning |
|---|---|
| `BbAH` | Number of BetBrain bookmakers used to Asian handicap averages and maximums |
| `BbAHh` | Betbrain size of handicap (home team) |
| `AHh` | Market size of handicap (home team) (since 2019/2020) |
| `BbMxAHH` | Betbrain maximum Asian handicap home team odds |
| `BbAvAHH` | Betbrain average Asian handicap home team odds |
| `BbMxAHA` | Betbrain maximum Asian handicap away team odds |
| `BbAvAHA` | Betbrain average Asian handicap away team odds |
| `GBAHH` | Gamebookers Asian handicap home team odds |
| `GBAHA` | Gamebookers Asian handicap away team odds |
| `GBAH` | Gamebookers size of handicap (home team) |
| `LBAHH` | Ladbrokes Asian handicap home team odds |
| `LBAHA` | Ladbrokes Asian handicap away team odds |
| `LBAH` | Ladbrokes size of handicap (home team) |
| `B365AHH` | Bet365 Asian handicap home team odds |
| `B365AHA` | Bet365 Asian handicap away team odds |
| `B365AH` | Bet365 size of handicap (home team) |
| `PAHH` | Pinnacle Asian handicap home team odds |
| `PAHA` | Pinnacle Asian handicap away team odds |
| `MaxAHH` | Market maximum Asian handicap home team odds |
| `MaxAHA` | Market maximum Asian handicap away team odds |
| `AvgAHH` | Market average Asian handicap home team odds |
| `AvgAHA` | Market average Asian handicap away team odds |
<!-- generated:football-data-asian-handicap-odds end -->

## Sources football-data.co.uk names

notes.txt acknowledges these sources for its files:

- Current results (full time, half time): XScores.
- Match statistics: BBC, Flashscore, ESPN Soccer, Bundesliga.de, Gazzetta.it and
  Football.fr.
- Bookmakers' betting odds: Betbrain.com, Oddsportal.com and individual
  bookmakers.
- Additional match statistics (corners, shots, bookings, referee and others) for
  the 2000/01 and 2001/02 English, Scottish and German leagues: Sports.com.

See [Free sources data provenance](data-provenance.md) for how this fits with the
other free sources.
