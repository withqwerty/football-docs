---
source_url: https://v0-simple-api-documentation-templat.vercel.app/
source_type: crawled
upstream_version: null
crawled_at: 2026-07-09
---

# TransferRoom API Endpoints

## Endpoint inventory

All endpoint examples use the base path `https://apiprod.transferroom.com/api/external`.

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/login` | API credentials | Returns a bearer token. |
| `GET` | `/competitions` | Documented API access | Returns competitions and team membership. |
| `GET` | `/players` | Lite API / Advanced API | Returns player identity, club, agency, value, rating, contract, GBE, and availability fields depending on access tier. |
| `GET` | `/coaches` | Advanced API | Returns head coach identity, career, contract, agency, rating, tactical, and team-impact fields. |
| `GET` | `/teams` | Advanced API | Returns team identity, competition, head coach, squad value, rating, and predicted requirement fields. |
| `GET` | `/transfers` | Advanced API | Returns player transfer movements and value-at-date fields. |
| `GET` | `/pitches` | Advanced API, club users only | Returns pitches and plus pitches received on TransferRoom. |
| `GET` | `/requirements` | Advanced API | Returns club recruitment requirements posted on TransferRoom. |
| `GET` | `/injuries/competitions` | Advanced Injury Data | Returns injury records by competition. |
| `GET` | `/injuries/players` | Advanced Injury Data | Returns player injury and predictive availability data. |

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
| `DivisionLevel` | League/division level. |
| `Teams` | Team IDs in the competition. |
| `AvgTeamRating` | Average team rating. |
| `AvgStarterRating` | Average starter rating. |

## Players

`GET /players`

Common query parameters:

| Parameter | Type | Notes |
|---|---|---|
| `position` | integer | Starting point in list for pagination. |
| `amount` | integer | Number of results to return. |
| `playerid` | integer | Filter by TransferRoom player ID where available. |
| `myshortlist` | bit/string | Filter to players on your TransferRoom shortlists; docs show `true`. |
| `mysquad` | bit/string | Filter to players in your team; docs show `true`. |

Sample response fields include:

- `TR_ID`, `Name`, `BirthDate`
- `ParentTeamId`, `CurrentTeamId`, `ParentTeam`, `CurrentTeam`, `TeamHistory`
- `Country`, `CompetitionId`, `Competition`, `DivisionLevel`
- `Nationality1`, `Nationality2`
- `FirstPosition`, `SecondPosition`, `PlayingStyle`, `PreferredFoot`
- `ContractExpiry`
- `Agency`, `AgencyVerified`
- `Shortlisted`
- `CurrentClubRecentMinsPerc`
- `GBEScore`, `GBEResult`, `GBEIntAppPts`, `GBEDomMinsPts`, `GBEContMinsPts`, `GBELeaguePosPts`, `GBEContProgPts`, `GBELeagueStdPts`
- `xTV`, `xTVChange6mPerc`, `xTVChange12mPerc`, `xTVHistory`
- `BaseValue`, `BaseValueHistory`
- `EstimatedSalary`
- `Rating`, `Potential`
- `AvailableSale`, `AvailableAskingPrice`, `AvailableSellOn`, `AvailableLoan`, `AvailableMonthlyLoanFee`, `AvailableCurrency`

## Head coaches

`GET /coaches`

Common query parameters follow the same list pattern as players: `position`, `amount`, and coach-specific filters where enabled by account access.

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

## Teams

`GET /teams`

Documented query parameter:

| Parameter | Type | Notes |
|---|---|---|
| `competitionid` | integer | Filter teams by competition ID. |

Sample response fields include:

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

## Transfers

`GET /transfers`

Documented query parameter:

| Parameter | Type | Notes |
|---|---|---|
| `competitionid` | integer | Filter transfers by competition ID. |

Sample response fields include:

- `PlayerId`, `Player`
- `FromTeamId`, `FromTeam`
- `ToTeamId`, `ToTeam`
- `Date`
- `TransferType`
- `TransferFee`
- `xTVatDate`
- `xTVatEnd`

## Pitches

`GET /pitches`

The public docs describe this as a club-user endpoint that returns pitches and plus pitches received on TransferRoom.

Sample response fields include:

- `PitchType`
- `RequirementID`
- `Player`, `PlayerId`
- `HeadCoach`, `HeadCoachId`
- `PitchDate`
- `PitchedByTeam`, `PitchedByTeamID`
- `PitchedByAgency`, `PitchedByAgencyID`
- `PitchCurrency`
- `PitchTransferFee`
- `PitchGrossAnnualSalary`
- `PitchLoanFee`
- `PitchSellOnPerc`
- `PitchMessage`
- `PitchStatus`

## Requirements

`GET /requirements`

Returns recruitment requirements posted on TransferRoom.

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
- `Injury`, `BodyPart`, `InjuryType`
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
| `position` | integer | Starting point in list for pagination. |
| `amount` | integer | Number of results to return. |
| `playerid` | integer | Filter by player ID. |
| `myshortlist` | bit/string | Filter to players on your TransferRoom shortlists; docs show `true`. |
| `mysquad` | bit/string | Filter to players in your team; docs show `true`. |

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

