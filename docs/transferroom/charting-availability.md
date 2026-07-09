# TransferRoom Availability and Injury Story Charts

## Build an availability story

Use this recipe when an agent asks for a player availability story, injury-burden
heatmap, missing-player timeline, squad risk view, preventable-injury split, or
injury-risk scouting chart from TransferRoom data.

| Story need | TransferRoom surface | Implementation note |
|---|---|---|
| Historical injury events | `GET /injuries/competitions` | Competition-level injury records include player/team context, injury type, body part, start/return dates, days out, matches missed, recurrence, surgery/training flags, and source fields. |
| Player risk and availability | `GET /injuries/players` | Player-level records expose `MatchesMissed5yrsPercentage`, recent minutes percentiles, `InjuryRiskRating`, `xAvailability`, workload, and embedded `PlayerInjuries`. |
| Squad value and context | `/teams`, `/players`, `/transfers` | Use team/player value and contract fields as controls or context, not as a replacement for injury-event denominators. |
| Identity joins | `TR_ID` / `PlayerId`, `TeamId`, `CompetitionId` | Prefer provider IDs over names; injury team context may reflect the club at the time of injury rather than the player's current team. |

The injury endpoints require Advanced Injury Data access. If access is missing,
make the chart state unavailable rather than falling back to scraping or mixing
unverified public pages into the same series.

## Injury-burden metrics

TransferRoom exposes injury records and availability/risk features, but an
editorial injury-burden metric still needs an explicit denominator.

| Metric | Recommended definition |
|---|---|
| `days_out_burden` | injured days in the season divided by player-days in the selected squad |
| `matches_missed_burden` | matches missed divided by possible player-matchdays |
| `squad_unavailable_share` | unavailable squad members divided by selected squad size at each date |
| `risk_weighted_availability` | aggregate `xAvailability` or risk buckets, labelled as predictive rather than historical |

For heatmaps or trend charts, keep historical absence (`StartDate`, `ReturnDate`,
`DaysOut`, `MatchesMissed`) separate from predictive fields such as
`InjuryRiskRating`, `xAvailability`, and workload. A season with high historical
injury burden and a player with low predicted availability are related concepts,
not the same metric.

## Injury type and source caveats

For preventable-versus-bad-luck stories, derive the split from explicit fields
such as `Injury`, `BodyPart`, `InjuryType`, `Training`, `SurgeryRequired`,
`Recurrence`, and source/prognosis fields. Keep the classification table versioned
and visible in methodology notes.

Recommended chart labels:

| Output | Label requirement |
|---|---|
| muscle / soft-tissue burden | state the injury-type mapping |
| impact on points | state the performance model and controls separately from TransferRoom raw fields |
| recurrence risk | state whether it uses TransferRoom benchmark fields or a custom model |
| missing players | state whether suspensions, illness, national-team duty, and not-in-squad states are included |

Do not infer causality from injury endpoints alone. Regression, residual, or
forest-plot charts should state the external controls used, such as squad value,
league, season, promoted status, or manager changes, and should identify whether
those controls came from TransferRoom, another licensed source, or a public
source.

## Chart outputs

Useful public chart shapes:

| Chart | Data contract |
|---|---|
| injury-burden heatmap | `{competition, team, season, burden, denominator, source}` |
| player availability timeline | `{player_id, team_id, start_date, return_date, injury_type, status, source}` |
| risk scatter | `{player_id, minutes_window, workload, injury_risk_rating, xAvailability}` |
| coefficient / forest plot | model output plus source-labelled injury-burden features |
| residual ranking | observed performance, expected performance, residual, injury burden, controls |

Always store the source endpoint and access tier with derived availability
features. TransferRoom's public docs describe field names and access levels, but
the exact full response schema can vary by subscription.
