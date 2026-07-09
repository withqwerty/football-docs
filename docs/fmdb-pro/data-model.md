---
source_url: https://api.fmdb.pro/api/openapi
source_type: crawled
upstream_version: latest (full OpenAPI)
crawled_at: 2026-07-09
---

# FMDB Pro Data Model

## Entity families

FMDB Pro is entity-first rather than match-event-first. The OpenAPI spec exposes these major families:

| Family | Main endpoints | Notes |
|---|---|---|
| Players and people | `/api/players`, `/api/persons` | Player/person identity, attributes, contracts, career history, values, availability, GBE fields, and external IDs. |
| Clubs and competitions | `/api/clubs`, `/api/clubsCompetitions` | Club metadata, competitions, stadiums, kits, reputation, facilities, finances, rules, and squad constraints. |
| Nations and geography | `/api/nations`, `/api/nationsCompetitions`, `/api/countries`, `/api/continents`, `/api/regions` | International-team, country, continent, region, and competition geography. |
| Staff and officials | `/api/persons`, `/api/officials` | Non-playing people, staff attributes, officials, categories, and reputation fields. |
| Performance summaries | `/api/playerAppearances`, `/api/nationPlayerAppearances` | Season/team aggregates, national appearances, and last-12-month nation appearance data. |
| Values | `/api/historicalValues` | Historical player value trends. |
| Coverage and docs | `/api/coverage`, `/api/status`, `/api/openapi` | Coverage discovery, version discovery, and machine-readable documentation. |
| Assets | `/api/kit/{encryptedKey}.svg` | Kit SVG retrieval from encrypted kit keys. |

## Player object

The `Players` response is the richest entity surface. Important first-level fields include:

| Area | Fields |
|---|---|
| Identity | `id`, `faId`, `fmId`, `externalIds`, `name`, `firstName`, `secondName`, `commonName`, `fullName`, `kitName`, `nickName`, `dateOfBirth`, `latestDateOfBirth`, `yearOfBirth`, `sex`. |
| Nationality and place | `country`, `nationalityInfo`, `secondCountry`, `thirdCountry`, `declaredNation`, `residentNation`, `cityOfBirth`, `regionOfBirth`. |
| Club state | `basedClub`, `permanentClub`, `loanClub`, `clubCompetition`, `clubNation`, `contractedNation`, `inBasedClubFirstTeam`. |
| Contracts | `permanentClubContractId`, `loanClubContractId`, `permanentClubContract`, `loanClubContract`, `clubContracts`, `nationContracts`. |
| Ability and roles | `currentAbility`, `recommendedCurrentAbility`, `potentialAbility`, `expectedPotentialAbility`, `position`, `positions`, `bestPosition`, `bestPositions`, `bestRole`. |
| Attributes | `mentalTraits`, `mentalAttributes`, `physicalAttributes`, `technicalAttributes`, `goalkeeperAttributes`, plus percentile groups for each. |
| Value and availability | `estimatedPlayerValues`, `availabilityIntelligence`, `injuries`, `unavailabilities`, `history`, `moves`, `retirements`. |
| Regulatory/scouting | `gbe`, `tags`, `homegrownStatus`, `clubCompetitionExperience`, `reputation`. |

Use `includeFields` aggressively when fetching players, because a full player object can be wide and deeply nested.

## Person object

The `Persons` response overlaps with players but is broader for staff and non-playing people. It includes identity, nationality, club/nation relationships, contracts, histories, GBE fields, and reputation, plus staff-specific fields:

- `currentJob`
- `coaching`
- `coachingStyle`
- `dataAnalyst`
- `knowledge`
- `management`
- `medical`
- `qualification`
- `preferredFormations`
- `preferredRolesInPossession`
- `preferredRolesOutOfPossession`
- `preferredTactics`
- `tacticalTendencies`
- `tactics`
- `tendencies`
- `chairperson`

Use `/api/persons` when the target can be a coach, scout, official-like staff member, director, or other non-playing football person. Use `/api/players` when the target should have player-specific fields such as positions, playing attributes, preferred moves, player values, and playing career history.

## Club object

The `Clubs` response includes:

- Identity fields: `id`, `faId`, `fmId`, `name`, `officialName`, `nameShort`, `officialThreeLetterName`, `city`, `country`.
- Competition and squad state: `competition`, `lastCompetition`, `regionalDivision`, `teams`, `playerCount`.
- Facilities and stadiums: `stadium`, `reserveStadium`, `youthStadium`, `trainingGround`, `trainingFacilities`.
- People relationships: `captain`, `viceCaptain`, `chairmanTitle`.
- Commercial and operational fields: `finances`, `income`, `wageHistory`, `reputation`, `potentialReputation`, `professionalStatus`.
- Presentation and assets: `kits`, `currentKit`, `genericLogoId`, colours, hashtags, and nicknames.

## Nation and competition objects

Nations include national-team and football-governance fields such as:

- `id`, `fmId`, `name`, `nameThreeLetter`, `internationalCode`
- `country`, `continent`, `footballingContinent`, `footballingRegion`, `worldRegion`
- `nationalTeamStadium`, `captain`, `viceCaptain`, `kits`
- `fifaCoefficient`, `fifaFullMember`, `reputation`, `youthRating`
- `gameImportance`, `leagueStandard`, `seasonTypeId`

Club and nation competition endpoints expose competition identity, host/geography, colours, age limits, trophy and pitch flags, reputation, VAR/goal-line flags, squads/teams, rules, and GBE-related bands where applicable.

## Attribute and percentile groups

Player technical, mental, physical, goalkeeper, and mental-trait attributes use Football Manager-style names such as:

- Technical: `corners`, `crossing`, `dribbling`, `finishing`, `firstTouch`, `freeKicks`, `heading`, `longShots`, `longThrows`, `marking`, `passing`, `penalties`, `tackling`, `technique`, `versatility`.
- Mental: `aggression`, `anticipation`, `bravery`, `composure`, `concentration`, `consistency`, `decisions`, `flair`, `importantMatches`, `leadership`, `offTheBall`, `positioning`, `teamWork`, `vision`, `workRate`.
- Physical: `acceleration`, `agility`, `balance`, `jumpingReach`, `naturalFitness`, `pace`, `stamina`, `strength`.
- Goalkeeper: `aerialAbility`, `commandOfArea`, `communication`, `gkEccentricity`, `handling`, `kicking`, `oneOnOnes`, `reflexes`, `rushingOut`, `tendencyToPunch`, `throwing`.

Percentile groups repeat many of these names with comparison scopes such as absolute, by age, by role, by league, and by league role.

## GBE fields

Player and person surfaces can include a `gbe` object. The player full spec exposes fields such as:

- `gbe.status`
- `gbe.exemptionReason`
- `gbe.qualified`
- `gbe.qualifiedOrPanel`
- `gbe.accuracy.level`
- `gbe.accuracy.percentage`
- `gbe.detail.status.totalPoints`
- `gbe.detail.status.maxPoints`
- `gbe.detail.status.outcome`
- `gbe.detail.status.pointsBreakdown.*`
- `gbe.detail.internationalAppearances.*`
- `gbe.detail.domesticMinutes.*`
- `gbe.detail.continentalMinutes.*`
- `gbe.detail.lastClub.*`
- `gbe.detail.currentClub.*`

These fields are useful for UK Governing Body Endorsement checks and scouting workflows. Treat them as derived policy/scouting fields rather than raw match-event data.

## Update timestamps

Most response objects include an `updated` field. The OpenAPI spec documents field-level filters for `updated`, so local mirrors can query changed entities by date/time comparison. There is no separate update-feed endpoint in the current spec; use endpoint-level `updated` filters plus continuation pagination for synchronisation.

