---
source_url: https://proud-island-049eed003.2.azurestaticapps.net/
source_type: crawled
upstream_version: null
crawled_at: 2026-08-31
---

# TransferRoom API Endpoints

## Endpoint inventory

All endpoint examples use the base path `https://apiprod.transferroom.com/api/external`.

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/login` | API credentials | Returns a bearer token. |
| `GET` | `/competitions` | Package-dependent | Returns domestic league competitions with team lists and ratings. |
| `GET` | `/players` | Package-dependent | Returns players and player data. |
| `GET` | `/coaches` | Package-dependent | Returns head coaches and their performance data. |
| `GET` | `/teams` | Package-dependent | Returns team data and analytics. |
| `GET` | `/transfers` | Package-dependent | Returns player transfer history data. |
| `GET` | `/pitches` | Club users only | Returns inbound player pitches submitted to your club. |
| `GET` | `/requirements` | Club users only | Returns your club's active transfer requirements. |
| `GET` | `/injuries/competitions` | Injury packages | Returns injury history for all players in a competition. |
| `GET` | `/injuries/players` | Injury packages | Returns injury risk and availability data per player. |

"Package-dependent" is per data point, not per endpoint: the documentation gives
each endpoint a data-availability table mapping every response field to the
packages that carry it. See "Access packages" in [api-access.md](api-access.md).

## Authentication endpoint

`POST /login`

Query parameters shown in the public example:

| Parameter | Type | Notes |
|---|---|---|
| `email` | string | TransferRoom account email. |
| `password` | string | TransferRoom account password. |

Sample success response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
}
```

## Competitions

`GET /competitions`

Returns competition records. The public sample includes:

| Field | Meaning |
|---|---|
| `Id` | TransferRoom competition ID. |
| `CompetitionName` | Competition name. |
| `Country` | Competition country. |
| `CountryId` | Country ID. |
| `DivisionLevel` | League/division level. |
| `Teams` | Team IDs in the competition. |
| `TransferWindows` | Transfer window dates for the competition. |
| `AvgTeamRating` | Average team rating. |
| `AvgStarterRating` | Average starter rating. |

## Players

`GET /players`

Common query parameters:

| Parameter | Type | Notes |
|---|---|---|
| `position` | integer | Starting point in list for pagination. Default `0`. |
| `amount` | integer | Number of results to return. Default `1000`, maximum `10000`. |
| `competitionid` | integer | Filter by competition ID. Specify `-1` for free agents. |
| `playerid` | integer | Filter by TransferRoom player ID. |
| `myshortlist` | bit | Filter to players on your TransferRoom shortlist; docs show `true`. Club users only. |
| `mysquad` | bit | Filter to players in your team; docs show `true`. Club users only. |

Sample response fields include:

- `TR_ID`, `Name`, `BirthDate`, `Height`
- `ParentTeamId`, `CurrentTeamId`, `ParentTeam`, `CurrentTeam`, `TeamHistory`
- `Country`, `CountryId`, `CompetitionId`, `Competition`, `DivisionLevel`
- `ParentCountry`, `ParentCountryId`, `ParentCompetition`, `ParentCompetitionId`, `ParentDivisionLevel`
- `Nationality1`, `Nationality1CountryId`, `Nationality2`, `Nationality2CountryId`
- `FirstPosition`, `SecondPosition`, `PlayingStyle`, `PreferredFoot`
- `ContractExpiry`
- `Agency`, `AgencyVerified`
- `Shortlisted`
- `CurrentClubRecentMinsPerc`
- `GBEScore`, `GBEResult`, `GBEIntAppPts`, `GBEDomMinsPts`, `GBEContMinsPts`, `GBELeaguePosPts`, `GBEContProgPts`, `GBELeagueStdPts`
- `Rating`, `Potential`, `PointsAdded`
- `xTV`, `xTVChange6mPerc`, `xTVChange12mPerc`, `xTVHistory`
- `BaseValue`, `BaseValueHistory`, `BookValue`, `BookValueHistory`
- `EstimatedSalary`, `EstimatedNetSalary`
- `AvailableSale`, `AvailableAskingPrice`, `AvailableSellOn`, `AvailableLoan`, `AvailableMonthlyLoanFee`, `AvailableCurrency`

## Head coaches

`GET /coaches`

Common query parameters:

| Parameter | Type | Notes |
|---|---|---|
| `position` | integer | Starting point in list for pagination. Default `0`. |
| `amount` | integer | Number of results to return. Default `1000`, maximum `10000`. |
| `competitionid` | integer | Filter by competition ID. |
| `coachid` | integer | Filter by coach ID. |

Sample response fields include:

- `TR_ID`, `Name`, `BirthDate`
- `Nationality1`, `Nationality2`
- `CurrentTeam`, `CurrentRole`
- `CareerHistory`
- `Country`, `Competition`, `DivisionLevel`
- `PreviousTeam`, `ContractExpiry`
- `Agency`, `AgencyVerified`
- `Rating`, `RatingChange12m`
- `TacticalStyle`, `Suitability`, `TeamRatingImpact`
- `TrustInYouth`, `PreferredFormation`, `SquadRotation`
- `ThreeSeasonAvgSpend`
- `Language`

`Suitability` is documented as available to club users only.

## Teams

`GET /teams`

Documented query parameters:

| Parameter | Type | Notes |
|---|---|---|
| `competitionid` | integer | **Required.** Filter by competition ID. |
| `teamid` | integer | Filter by team ID. |

Sample response fields include:

- `TR_ID`
- `Team`
- `Country`, `CountryId`
- `CompetitionId`
- `Competition`
- `CompetitionDivisionLevel`
- `HeadCoachID`
- `TotalxTV`
- `TotalBaseValue`, `TotalBookValue`
- `AverageStarterRating`
- `TeamRating`
- `TeamRatingHistory`
- `PredictedRequirements`
- `OneYearTransferSpend`, `ThreeYearTransferSpend`
- `SalaryBenchmarks`

## Transfers

`GET /transfers`

Documented query parameters:

| Parameter | Type | Notes |
|---|---|---|
| `competitionid` | integer | **Required.** Filter by competition ID. |
| `teamid` | integer | Filter by team ID. |
| `playerid` | integer | Filter by player ID. |
| `UpdatedSince` | date | Return records updated since this date. |

Sample response fields include:

- `PlayerId`, `Player`
- `FromTeamId`, `FromTeam`
- `ToTeamId`, `ToTeam`
- `FromCompetitionId`, `ToCompetitionId`
- `Date`, `EndDate`
- `TransferType`
- `TransferFee`
- `xTVatDate`
- `xTVatEnd`

## Pitches

`GET /pitches`

The public docs describe this as a club-user endpoint that returns inbound player pitches submitted to your club.

Sample response fields include:

- `PitchType`
- `RequirementID`
- `Player`, `PlayerId`
- `HeadCoach`, `StaffId`
- `PitchDate`
- `PitchedByTeam`, `PitchedByTeamID`
- `PitchedByAgency`, `PitchedbyAgencyID`
- `PitchCurrency`
- `PitchTransferFee`
- `PitchGrossAnnualSalary`
- `PitchLoanFee`
- `PitchSellOnPerc`
- `PitchMessage`
- `PitchStatus`

## Requirements

`GET /requirements`

Returns your club's active transfer requirements. The docs mark it as club users only.

Sample response fields include:

- `TR_ID`
- `Active`
- `UpdatedAt`
- `TransferType`
- `Position`
- `Foot`
- `PlayingStyle`
- `PreferredNationality`
- `FromAge`, `ToAge`
- `MinHeight`
- `TransferFee`
- `GrossAnnualSalary`
- `MonthlyLoanFee`

## Injuries by competition

`GET /injuries/competitions`

Query parameters:

| Parameter | Type | Required | Notes |
|---|---|---|---|
| `competitionid` | integer | yes | Filter by competition ID. |
| `seasonstartyear` | integer | no | Filter to a specific season. |

Sample response fields include:

- `TR_ID`, `Name`
- `TeamId`, `Team`
- `CompetitionId`, `Competition`, `DivisionLevel`, `Country`
- `Injury`, `BodyPart`, `BodyPartSide`, `InjuryType`
- `StartDate`, `ReturnDate`, `DaysOut`, `MatchesMissed`, `ExpectedReturnDate`
- `Training`, `SurgeryRequired`, `Recurrence`
- `EventDescription`, `PrognosisDescription`
- `Source_1`, `Source_2`, `Source_3`
- `InjuryAverageLengthDays`, `InjuryMedianLength`, `InjuryLowerQuartileLength`, `InjuryUpperQuartileLength`
- `TwoYearOccurenceRate`, `TwoYearRecurrenceRate`, `IncreasedTwoYearRecurranceRisk`

The field names above preserve the public documentation spelling, including `Occurence` and `Recurrance`.

## Injuries by player

`GET /injuries/players`

Query parameters:

| Parameter | Type | Notes |
|---|---|---|
| `position` | integer | Starting point in list for pagination. Default `0`. |
| `amount` | integer | Number of results to return. Default `1000`, maximum `10000`. |
| `competitionid` | integer | Filter by competition ID. |
| `playerid` | integer | Filter by player ID. |
| `myshortlist` | bit | Filter to players on your TransferRoom shortlists; docs show `true`. |
| `mysquad` | bit | Filter to players in your team; docs show `true`. |

Sample response fields include:

- `TR_ID`, `Name`, `BirthDate`
- `MatchesMissed5yrsPercentage`
- `TotalMins3Months`, `MinsPlayed3MonthsPercentile`
- `TotalMins6Months`, `MinsPlayed6MonthsPercentile`
- `TotalMins12Months`, `MinsPlayed12MonthsPercentile`
- `InjuryRiskRating`
- `xAvailability`
- `CurrentWorkload`
- `PlayerInjuries`

