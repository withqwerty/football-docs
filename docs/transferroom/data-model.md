---
source_url: https://v0-simple-api-documentation-templat.vercel.app/
source_type: crawled
upstream_version: null
crawled_at: 2026-07-09
---

# TransferRoom Data Model

## Entity families

TransferRoom's public API docs show a recruitment and transfer-market data model rather than an event-data or tracking-data model.

| Family | Endpoint | Main use |
|---|---|---|
| Competitions | `/competitions` | Competition IDs, country, division level, team membership, and average ratings. |
| Players | `/players` | Player identity, team context, market value, agency, contract, availability, GBE, ratings, and shortlisting/squad flags. |
| Head coaches | `/coaches` | Coach identity, career history, tactical profile, ratings, contract, agency, and team-impact fields. |
| Teams | `/teams` | Team identity, competition context, head coach, squad value, team rating, and predicted requirements. |
| Transfers | `/transfers` | Player movement records with from/to teams, date, type, fee, and xTV at date/end. |
| Pitches | `/pitches` | Pitches and plus pitches received by a club on TransferRoom. |
| Requirements | `/requirements` | Club recruitment requirements, including position, age, height, foot, style, fee, and salary ranges. |
| Injuries | `/injuries/competitions`, `/injuries/players` | Injury histories, sources, return dates, recurrence/occurrence rates, workload, and risk/availability metrics. |

## Player model

The player object centres on recruitment decision support. Public sample fields include:

| Area | Fields |
|---|---|
| Identity | `TR_ID`, `Name`, `BirthDate`. |
| Club context | `ParentTeamId`, `CurrentTeamId`, `ParentTeam`, `CurrentTeam`, `TeamHistory`. |
| Competition context | `Country`, `CompetitionId`, `Competition`, `DivisionLevel`, `ParentCountry`, `ParentCompetition`, `ParentDivisionLevel`. |
| Nationality and role | `Nationality1`, `Nationality2`, `FirstPosition`, `SecondPosition`, `PlayingStyle`, `PreferredFoot`. |
| Contract and agency | `ContractExpiry`, `Agency`, `AgencyVerified`. |
| Workflow flags | `Shortlisted`, `AvailableSale`, `AvailableLoan`, asking-price and loan-fee fields. |
| GBE | `GBEScore`, `GBEResult`, and point-breakdown fields such as international appearances, domestic minutes, continental minutes, league position, continental progression, and league standard. |
| Value and rating | `xTV`, xTV change/history fields, `BaseValue`, `EstimatedSalary`, `Rating`, `Potential`. |

`TeamHistory`, `xTVHistory`, and `BaseValueHistory` are shown as JSON-encoded history strings in the public samples.

## Coach model

Head coach data includes:

- `TR_ID`, `Name`, `BirthDate`
- `Nationality1`, `Nationality2`
- `CurrentTeam`, `CurrentRole`
- `CareerHistory`
- `Country`, `Competition`, `DivisionLevel`
- `PreviousTeam`
- `ContractExpiry`
- `Agency`, `AgencyVerified`
- `Rating`, `RatingChange12m`
- `TacticalStyle`
- `Suitability`
- `TeamRatingImpact`
- `TrustInYouth`
- `PreferredFormation`
- `SquadRotation`
- `ThreeSeasonAvgSpend`

This makes TransferRoom useful for both player recruitment and head-coach succession/replacement workflows.

## Team model

Team data includes:

- `TR_ID`
- `Team`
- `Country`
- `CompetitionId`
- `Competition`
- `CompetitionDivisionLevel`
- `HeadCoachID`
- `TotalxTV`
- `TotalBaseValue`
- `AverageStarterRating`
- `TeamRating`
- `TeamRatingHistory`
- `PredictedRequirements`

`TeamRatingHistory` is shown as a JSON-encoded time series in the public sample.

## Transfer model

Transfer records include:

- `PlayerId`
- `Player`
- `FromTeamId`, `FromTeam`
- `ToTeamId`, `ToTeam`
- `Date`
- `TransferType`
- `TransferFee`
- `xTVatDate`
- `xTVatEnd`

This is a historical movement surface rather than a live rumour feed.

## Pitch and requirement model

`/pitches` describes inbound market activity to a club:

- Pitch subject: `Player`, `PlayerId`, `HeadCoach`, `HeadCoachId`
- Sender: `PitchedByTeam`, `PitchedByTeamID`, `PitchedByAgency`, `PitchedByAgencyID`
- Commercial terms: `PitchCurrency`, `PitchTransferFee`, `PitchGrossAnnualSalary`, `PitchLoanFee`, `PitchSellOnPerc`
- Workflow: `PitchType`, `RequirementID`, `PitchDate`, `PitchMessage`, `PitchStatus`

`/requirements` describes the club's posted recruitment need:

- `Active`, `UpdatedAt`
- `TransferType`
- `Position`, `Foot`, `PlayingStyle`, `PreferredNationality`
- `FromAge`, `ToAge`, `MinHeight`
- `TransferFee`, `GrossAnnualSalary`, `MonthlyLoanFee`

Together, pitches and requirements represent a club-specific workflow surface. They are not general public market data.

## Injury model

The injury products have two levels:

- Competition-level injury records: individual injury events with injury type, body part, start/return dates, sources, recurrence, surgery/training flags, and cohort recurrence/occurrence benchmarks.
- Player-level injury and availability records: recent minutes, minutes percentiles, match-missed percentage, injury risk rating, xAvailability, workload, and embedded player injury history.

The public docs say Advanced Injury Data covers 50 leagues, has historical data back to 2017, and includes recurrence risk, player injury risk rating, and fatigue/workload-style predictive metrics.

## Values and ratings

Important proprietary/derived metrics in the public docs:

| Field | Meaning |
|---|---|
| `xTV` | Expected Transfer Value. |
| `xTVChange6mPerc`, `xTVChange12mPerc` | Recent xTV percentage movement. |
| `xTVHistory` | xTV history time series. |
| `BaseValue`, `BaseValueHistory` | Base value and history. |
| `EstimatedSalary` | Salary estimate range. |
| `Rating`, `Potential` | Player/coach evaluation fields. |
| `TeamRating`, `AverageStarterRating` | Team-level rating fields. |
| `xAvailability` | Predicted future injury availability percentage. |

