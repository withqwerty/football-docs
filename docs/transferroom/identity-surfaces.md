---
source_url: https://v0-simple-api-documentation-templat.vercel.app/
source_type: crawled
upstream_version: null
crawled_at: 2026-07-09
---

# TransferRoom Identity Surfaces

## Primary IDs

The public docs use `TR_ID` as the primary TransferRoom identifier on several entity types:

- Players: `TR_ID`
- Head coaches: `TR_ID`
- Teams: `TR_ID`
- Requirements: `TR_ID`

Some endpoint-specific fields use entity-specific names:

- `CompetitionId` or `Id` for competitions.
- `PlayerId` for player references in transfers, pitches, and injury records.
- `HeadCoachID` or `HeadCoachId` for coach references.
- `TeamId`, `FromTeamId`, `ToTeamId`, `PitchedByTeamID`, and similar fields for team references.
- `RequirementID` for linking a pitch to a posted recruitment requirement.

Store IDs with entity namespaces. For example, do not assume that player `TR_ID=123` and team `TR_ID=123` refer to the same object.

## Player identity fields

The player surface includes:

- `TR_ID`
- `Name`
- `BirthDate`
- `Nationality1`
- `Nationality2`
- `ParentTeamId`, `ParentTeam`
- `CurrentTeamId`, `CurrentTeam`
- `TeamHistory`
- `CompetitionId`, `Competition`
- `FirstPosition`, `SecondPosition`
- `PreferredFoot`

For matching players to another provider, use `TR_ID` as the TransferRoom key and combine name, birth date, nationality, current/parent teams, positions, and team history as disambiguation evidence.

## Coach identity fields

The coach surface includes:

- `TR_ID`
- `Name`
- `BirthDate`
- `Nationality1`
- `Nationality2`
- `CurrentTeam`
- `CurrentRole`
- `CareerHistory`
- `PreviousTeam`
- `ContractExpiry`
- `Agency`

Coach identity should be treated separately from player identity even if the person is historically both a former player and a coach.

## Team and competition identity fields

Team fields include:

- `TR_ID`
- `Team`
- `Country`
- `CompetitionId`
- `Competition`
- `CompetitionDivisionLevel`
- `HeadCoachID`

Competition fields include:

- `Id`
- `CompetitionName`
- `Country`
- `DivisionLevel`
- `Teams`

For local mirrors, store a stable competition table before consuming team, transfer, and injury feeds. Several endpoints use `competitionid` as a query parameter.

## Transfer linkage fields

The transfer surface links players and clubs through:

- `PlayerId`
- `Player`
- `FromTeamId`, `FromTeam`
- `ToTeamId`, `ToTeam`
- `Date`
- `TransferType`

Use `PlayerId`, `FromTeamId`, and `ToTeamId` for identity joins. Team and player names should be treated as display or fallback matching fields.

## Pitch and requirement linkage

Pitches can link back to requirements and to the pitched subject:

- `RequirementID`
- `PlayerId`
- `HeadCoachId`
- `PitchedByTeamID`
- `PitchedByAgencyID`

If `RequirementID` is null, the pitch was not tied to a posted requirement in the public sample. A pitch may concern either a player or a head coach, so code should tolerate one subject being null.

## Injury identity fields

Competition injury records use:

- `TR_ID` for the player
- `Name`
- `TeamId`, `Team`
- `CompetitionId`, `Competition`

Player injury records use:

- `TR_ID`
- `Name`
- `BirthDate`
- `PlayerInjuries`

For injury joins, prefer `TR_ID`/`PlayerId` over names. Injury records include current team context at the time of injury, which can differ from current club context in `/players`.

## Cross-provider caveat

The public docs do not show explicit third-party IDs such as Wyscout, StatsBomb, Transfermarkt, or Football Manager IDs. Treat TransferRoom identity as its own namespace and build cross-provider matches from names, birth dates, team history, nationality, competition context, and dates unless TransferRoom provides additional private mapping fields under contract.
