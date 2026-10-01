---
source_type: curated
source_url: https://statsportsproseries.com/thirdpartyapi/swagger/v7/swagger.json
upstream_version: STATSports 3rd Party API v5, v6 and v7 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# STATSports Drill KPI Metrics

## About the drill KPI schemas

Each drill in a STATSports session response carries a `drillKpi` object. The spec
defines three versions of it: `DrillKpiV5` (219 fields), `DrillKpiV6` (230 fields,
all 219 v5 fields plus 11) and `DrillKpiV7` (319 fields). v7 responses use
`DrillKpiV7`.

What the spec gives for these fields, and what it does not:

- Every field is a `number` with format `double`, or an `integer` with format
  `int32`, except `customMetrics`. The tables give the type of each field.
- No field has a description, and the spec gives no units. This page adds none.
- No field is marked nullable, except `customMetrics`.
- `customMetrics` (v6 and v7) is a nullable `object` whose values are nullable
  `number` (`double`); its keys are not listed in the spec.
- `GET /api/thirdPartyData/getAvailableMetrics` returns an array of strings. The
  spec does not list the values or say how they relate to these field names.

The field groups below are by field-name prefix, for navigation only. The spec
does not group the fields. Abbreviations such as `hmld`, `dsl`, `emd`, `edi` and
`hibs` are not expanded in the spec, and this page does not expand them.

## Absolute (Abs) and relative (Rel) fields

Many `DrillKpiV7` field names end in `Abs` or `Rel`. The spec does not define
these suffixes. STATSports' article "Absolute and Relative Metric Options Added To
Improve Individual Athlete Monitoring" (30 April 2024,
https://statsports.com/article/absolute-and-relative-metric-options-added-to-improve-individual-athlete-monitoring)
describes the two kinds of metric in its Sonra software:

> Absolute Metrics are metrics calculated using group or squad zone definitions.
>
> Relative Metrics are metrics calculated using individualised player zone definitions.

The article names the zone-based metric categories as speed, heart rate,
accelerations, decelerations, metabolic power and impacts. It does not name API
fields; matching the article's metrics to the `Abs` and `Rel` fields is an
inference, not a statement in the spec.

## DrillKpiV7 fields: duration and total distance

<!-- generated:statsports-drillkpi-v7-duration start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `totalTime` | `number` | `double` | yes | yes |
| `distanceTotal` | `number` | `double` | yes | yes |
| `distancePerMin` | `number` | `double` | yes | yes |
<!-- generated:statsports-drillkpi-v7-duration end -->

## DrillKpiV7 fields: distance in speed zones and high-speed running

High-speed running (HSR) appears as `highSpeedRunningAbs`, `highSpeedRunningRel`, `hsrAbsPerMin` and `hsrRelPerMin`. The spec gives no speed threshold for high-speed running or for any zone `Z1` to `Z6`, and no unit.

<!-- generated:statsports-drillkpi-v7-speed-zones start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `distanceZ1Rel` | `number` | `double` | yes | yes |
| `distanceZ2Rel` | `number` | `double` | yes | yes |
| `distanceZ3Rel` | `number` | `double` | yes | yes |
| `distanceZ4Rel` | `number` | `double` | yes | yes |
| `distanceZ5Rel` | `number` | `double` | yes | yes |
| `distanceZ6Rel` | `number` | `double` | yes | yes |
| `highSpeedRunningRel` | `number` | `double` | yes | yes |
| `hsrRelPerMin` | `number` | `double` | yes | yes |
| `distanceZ1Abs` | `number` | `double` | yes | yes |
| `distanceZ2Abs` | `number` | `double` | yes | yes |
| `distanceZ3Abs` | `number` | `double` | yes | yes |
| `distanceZ4Abs` | `number` | `double` | yes | yes |
| `distanceZ5Abs` | `number` | `double` | yes | yes |
| `distanceZ6Abs` | `number` | `double` | yes | yes |
| `highSpeedRunningAbs` | `number` | `double` | yes | yes |
| `hsrAbsPerMin` | `number` | `double` | yes | yes |
| `distanceZ2Z6Abs` | `number` | `double` | yes | yes |
| `distanceZ2Z6Rel` | `number` | `double` | yes | yes |
| `distanceZ3Z6Abs` | `number` | `double` | yes | yes |
| `distanceZ3Z6Rel` | `number` | `double` | yes | yes |
| `distanceZ4Z6Abs` | `number` | `double` | yes | yes |
| `distanceZ4Z6Rel` | `number` | `double` | yes | yes |
<!-- generated:statsports-drillkpi-v7-speed-zones end -->

## DrillKpiV7 fields: time in speed zones

<!-- generated:statsports-drillkpi-v7-time-in-speed-zones start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `timeZ1Rel` | `number` | `double` | yes | yes |
| `timeZ2Rel` | `number` | `double` | yes | yes |
| `timeZ3Rel` | `number` | `double` | yes | yes |
| `timeZ4Rel` | `number` | `double` | yes | yes |
| `timeZ5Rel` | `number` | `double` | yes | yes |
| `timeZ6Rel` | `number` | `double` | yes | yes |
| `timeZ1Abs` | `number` | `double` | yes | yes |
| `timeZ2Abs` | `number` | `double` | yes | yes |
| `timeZ3Abs` | `number` | `double` | yes | yes |
| `timeZ4Abs` | `number` | `double` | yes | yes |
| `timeZ5Abs` | `number` | `double` | yes | yes |
| `timeZ6Abs` | `number` | `double` | yes | yes |
<!-- generated:statsports-drillkpi-v7-time-in-speed-zones end -->

## DrillKpiV7 fields: metabolic power and hml

<!-- generated:statsports-drillkpi-v7-metabolic start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `emd` | `number` | `double` | yes | yes |
| `metabolicDistanceZ1Rel` | `number` | `double` |  |  |
| `metabolicDistanceZ2Rel` | `number` | `double` |  |  |
| `metabolicDistanceZ3Rel` | `number` | `double` |  |  |
| `metabolicDistanceZ4Rel` | `number` | `double` |  |  |
| `metabolicDistanceZ5Rel` | `number` | `double` |  |  |
| `metabolicDistanceZ6Rel` | `number` | `double` |  |  |
| `metabolicTimeZ1Rel` | `number` | `double` |  |  |
| `metabolicTimeZ2Rel` | `number` | `double` |  |  |
| `metabolicTimeZ3Rel` | `number` | `double` |  |  |
| `metabolicTimeZ4Rel` | `number` | `double` |  |  |
| `metabolicTimeZ5Rel` | `number` | `double` |  |  |
| `metabolicTimeZ6Rel` | `number` | `double` |  |  |
| `metabolicDistanceZ1Abs` | `number` | `double` |  |  |
| `metabolicDistanceZ2Abs` | `number` | `double` |  |  |
| `metabolicDistanceZ3Abs` | `number` | `double` |  |  |
| `metabolicDistanceZ4Abs` | `number` | `double` |  |  |
| `metabolicDistanceZ5Abs` | `number` | `double` |  |  |
| `metabolicDistanceZ6Abs` | `number` | `double` |  |  |
| `metabolicTimeZ1Abs` | `number` | `double` |  |  |
| `metabolicTimeZ2Abs` | `number` | `double` |  |  |
| `metabolicTimeZ3Abs` | `number` | `double` |  |  |
| `metabolicTimeZ4Abs` | `number` | `double` |  |  |
| `metabolicTimeZ5Abs` | `number` | `double` |  |  |
| `metabolicTimeZ6Abs` | `number` | `double` |  |  |
| `hmld` | `number` | `double` | yes | yes |
| `hmltime` | `number` | `double` | yes | yes |
| `totalMetabolicPower` | `number` | `double` | yes | yes |
| `averageMetabolicPower` | `number` | `double` | yes | yes |
| `metabolicDistanceRel` | `number` | `double` |  |  |
| `metabolicTimeRel` | `number` | `double` |  |  |
| `metabolicDistanceAbs` | `number` | `double` |  |  |
| `metabolicTimeAbs` | `number` | `double` |  |  |
| `hmldPerMin` | `number` | `double` | yes | yes |
| `numberOfHmlEfforts` | `number` | `double` | yes | yes |
| `hmlEffortsMaxSpeed` | `number` | `double` | yes | yes |
| `hmlEffortsTotalDistance` | `number` | `double` | yes | yes |
| `averageTimeSinceLastHmlEffort` | `number` | `double` | yes | yes |
<!-- generated:statsports-drillkpi-v7-metabolic end -->

## DrillKpiV7 fields: speed and speed intensity

<!-- generated:statsports-drillkpi-v7-speed start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `maxSpeed` | `number` | `double` | yes | yes |
| `averageSpeed` | `number` | `double` | yes | yes |
| `speedIntensity` | `number` | `double` | yes | yes |
| `speedIntensityZ1Rel` | `number` | `double` | yes | yes |
| `speedIntensityZ2Rel` | `number` | `double` | yes | yes |
| `speedIntensityZ3Rel` | `number` | `double` | yes | yes |
| `speedIntensityZ4Rel` | `number` | `double` | yes | yes |
| `speedIntensityZ5Rel` | `number` | `double` | yes | yes |
| `speedIntensityZ6Rel` | `number` | `double` | yes | yes |
| `speedIntensityZ1Abs` | `number` | `double` | yes | yes |
| `speedIntensityZ2Abs` | `number` | `double` | yes | yes |
| `speedIntensityZ3Abs` | `number` | `double` | yes | yes |
| `speedIntensityZ4Abs` | `number` | `double` | yes | yes |
| `speedIntensityZ5Abs` | `number` | `double` | yes | yes |
| `speedIntensityZ6Abs` | `number` | `double` | yes | yes |
<!-- generated:statsports-drillkpi-v7-speed end -->

## DrillKpiV7 fields: impacts and dynamic stress load

<!-- generated:statsports-drillkpi-v7-impacts start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `dsl` | `number` | `double` | yes | yes |
| `dslZ1` | `number` | `double` | yes | yes |
| `dslZ2` | `number` | `double` | yes | yes |
| `dslZ3` | `number` | `double` | yes | yes |
| `dslZ4` | `number` | `double` | yes | yes |
| `dslZ5` | `number` | `double` | yes | yes |
| `dslZ6` | `number` | `double` | yes | yes |
| `dslZ1Time` | `number` | `double` | yes | yes |
| `dslZ2Time` | `number` | `double` | yes | yes |
| `dslZ3Time` | `number` | `double` | yes | yes |
| `dslZ4Time` | `number` | `double` | yes | yes |
| `dslZ5Time` | `number` | `double` | yes | yes |
| `dslZ6Time` | `number` | `double` | yes | yes |
| `impactsRel` | `integer` | `int32` |  |  |
| `impactsZ1Rel` | `integer` | `int32` |  |  |
| `impactsZ2Rel` | `integer` | `int32` |  |  |
| `impactsZ3Rel` | `integer` | `int32` |  |  |
| `impactsZ4Rel` | `integer` | `int32` |  |  |
| `impactsZ5Rel` | `integer` | `int32` |  |  |
| `impactsZ6Rel` | `integer` | `int32` |  |  |
| `impactsAbs` | `integer` | `int32` |  |  |
| `impactsZ1Abs` | `integer` | `int32` |  |  |
| `impactsZ2Abs` | `integer` | `int32` |  |  |
| `impactsZ3Abs` | `integer` | `int32` |  |  |
| `impactsZ4Abs` | `integer` | `int32` |  |  |
| `impactsZ5Abs` | `integer` | `int32` |  |  |
| `impactsZ6Abs` | `integer` | `int32` |  |  |
| `dslZ3Z6` | `number` | `double` | yes | yes |
| `dslZ4Z6` | `number` | `double` | yes | yes |
| `dslZ5Z6` | `number` | `double` | yes | yes |
| `impactsZ3Z6Rel` | `number` | `double` |  |  |
| `impactsZ4Z6Rel` | `number` | `double` |  |  |
| `impactsZ5Z6Rel` | `number` | `double` |  |  |
| `impactsZ3Z6Abs` | `number` | `double` |  |  |
| `impactsZ4Z6Abs` | `number` | `double` |  |  |
| `impactsZ5Z6Abs` | `number` | `double` |  |  |
<!-- generated:statsports-drillkpi-v7-impacts end -->

## DrillKpiV7 fields: accelerations

<!-- generated:statsports-drillkpi-v7-accelerations start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `accelerationsRel` | `integer` | `int32` |  |  |
| `accelerationsZ1Rel` | `integer` | `int32` |  |  |
| `accelerationsZ2Rel` | `integer` | `int32` |  |  |
| `accelerationsZ3Rel` | `integer` | `int32` |  |  |
| `accelerationsZ4Rel` | `integer` | `int32` |  |  |
| `accelerationsZ5Rel` | `integer` | `int32` |  |  |
| `accelerationsZ6Rel` | `integer` | `int32` |  |  |
| `accelerationDistanceZ1Rel` | `number` | `double` |  |  |
| `accelerationDistanceZ2Rel` | `number` | `double` |  |  |
| `accelerationDistanceZ3Rel` | `number` | `double` |  |  |
| `accelerationDistanceZ4Rel` | `number` | `double` |  |  |
| `accelerationDistanceZ5Rel` | `number` | `double` |  |  |
| `accelerationDistanceZ6Rel` | `number` | `double` |  |  |
| `accelerationTimeZ1Rel` | `number` | `double` |  |  |
| `accelerationTimeZ2Rel` | `number` | `double` |  |  |
| `accelerationTimeZ3Rel` | `number` | `double` |  |  |
| `accelerationTimeZ4Rel` | `number` | `double` |  |  |
| `accelerationTimeZ5Rel` | `number` | `double` |  |  |
| `accelerationTimeZ6Rel` | `number` | `double` |  |  |
| `maxAcceleration` | `number` | `double` | yes | yes |
| `accelImpulseTotal` | `number` | `double` | yes | yes |
| `totalAccelLoading` | `number` | `double` | yes | yes |
| `accelerationsZ3Z6Rel` | `number` | `double` |  |  |
| `accelerationsZ4Z6Rel` | `number` | `double` |  |  |
| `accelerationsZ5Z6Rel` | `number` | `double` |  |  |
| `averageTimeSinceLastAccel` | `number` | `double` | yes | yes |
| `accelerationSymmetry` | `number` | `double` | yes |  |
| `accelsPerMinRel` | `number` | `double` |  |  |
| `accelerationsAbs` | `integer` | `int32` |  |  |
| `accelerationsZ1Abs` | `integer` | `int32` |  |  |
| `accelerationsZ2Abs` | `integer` | `int32` |  |  |
| `accelerationsZ3Abs` | `integer` | `int32` |  |  |
| `accelerationsZ4Abs` | `integer` | `int32` |  |  |
| `accelerationsZ5Abs` | `integer` | `int32` |  |  |
| `accelerationsZ6Abs` | `integer` | `int32` |  |  |
| `accelerationDistanceZ1Abs` | `number` | `double` |  |  |
| `accelerationDistanceZ2Abs` | `number` | `double` |  |  |
| `accelerationDistanceZ3Abs` | `number` | `double` |  |  |
| `accelerationDistanceZ4Abs` | `number` | `double` |  |  |
| `accelerationDistanceZ5Abs` | `number` | `double` |  |  |
| `accelerationDistanceZ6Abs` | `number` | `double` |  |  |
| `accelerationTimeZ1Abs` | `number` | `double` |  |  |
| `accelerationTimeZ2Abs` | `number` | `double` |  |  |
| `accelerationTimeZ3Abs` | `number` | `double` |  |  |
| `accelerationTimeZ4Abs` | `number` | `double` |  |  |
| `accelerationTimeZ5Abs` | `number` | `double` |  |  |
| `accelerationTimeZ6Abs` | `number` | `double` |  |  |
| `accelsPerMinAbs` | `number` | `double` |  |  |
| `accelerationsZ3Z6Abs` | `number` | `double` |  |  |
| `accelerationsZ4Z6Abs` | `number` | `double` |  |  |
| `accelerationsZ5Z6Abs` | `number` | `double` |  |  |
<!-- generated:statsports-drillkpi-v7-accelerations end -->

## DrillKpiV7 fields: decelerations

<!-- generated:statsports-drillkpi-v7-decelerations start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `decelerationsRel` | `integer` | `int32` |  |  |
| `decelerationsZ1Rel` | `integer` | `int32` |  |  |
| `decelerationsZ2Rel` | `integer` | `int32` |  |  |
| `decelerationsZ3Rel` | `integer` | `int32` |  |  |
| `decelerationsZ4Rel` | `integer` | `int32` |  |  |
| `decelerationsZ5Rel` | `integer` | `int32` |  |  |
| `decelerationsZ6Rel` | `integer` | `int32` |  |  |
| `decelerationDistanceZ1Rel` | `number` | `double` |  |  |
| `decelerationDistanceZ2Rel` | `number` | `double` |  |  |
| `decelerationDistanceZ3Rel` | `number` | `double` |  |  |
| `decelerationDistanceZ4Rel` | `number` | `double` |  |  |
| `decelerationDistanceZ5Rel` | `number` | `double` |  |  |
| `decelerationDistanceZ6Rel` | `number` | `double` |  |  |
| `decelerationTimeZ1Rel` | `number` | `double` |  |  |
| `decelerationTimeZ2Rel` | `number` | `double` |  |  |
| `decelerationTimeZ3Rel` | `number` | `double` |  |  |
| `decelerationTimeZ4Rel` | `number` | `double` |  |  |
| `decelerationTimeZ5Rel` | `number` | `double` |  |  |
| `decelerationTimeZ6Rel` | `number` | `double` |  |  |
| `maxDeceleration` | `number` | `double` | yes | yes |
| `totalDecelLoading` | `number` | `double` | yes | yes |
| `decelerationsZ3Z6Rel` | `number` | `double` |  |  |
| `decelerationsZ4Z6Rel` | `number` | `double` |  |  |
| `decelerationsZ5Z6Rel` | `number` | `double` |  |  |
| `averageTimeSinceLastDecel` | `number` | `double` | yes | yes |
| `decelsPerMinRel` | `number` | `double` |  |  |
| `decelerationsAbs` | `integer` | `int32` |  |  |
| `decelerationsZ1Abs` | `integer` | `int32` |  |  |
| `decelerationsZ2Abs` | `integer` | `int32` |  |  |
| `decelerationsZ3Abs` | `integer` | `int32` |  |  |
| `decelerationsZ4Abs` | `integer` | `int32` |  |  |
| `decelerationsZ5Abs` | `integer` | `int32` |  |  |
| `decelerationsZ6Abs` | `integer` | `int32` |  |  |
| `decelerationDistanceZ1Abs` | `number` | `double` |  |  |
| `decelerationDistanceZ2Abs` | `number` | `double` |  |  |
| `decelerationDistanceZ3Abs` | `number` | `double` |  |  |
| `decelerationDistanceZ4Abs` | `number` | `double` |  |  |
| `decelerationDistanceZ5Abs` | `number` | `double` |  |  |
| `decelerationDistanceZ6Abs` | `number` | `double` |  |  |
| `decelerationTimeZ1Abs` | `number` | `double` |  |  |
| `decelerationTimeZ2Abs` | `number` | `double` |  |  |
| `decelerationTimeZ3Abs` | `number` | `double` |  |  |
| `decelerationTimeZ4Abs` | `number` | `double` |  |  |
| `decelerationTimeZ5Abs` | `number` | `double` |  |  |
| `decelerationTimeZ6Abs` | `number` | `double` |  |  |
| `decelsPerMinAbs` | `number` | `double` |  |  |
| `decelerationsZ3Z6Abs` | `number` | `double` |  |  |
| `decelerationsZ4Z6Abs` | `number` | `double` |  |  |
| `decelerationsZ5Z6Abs` | `number` | `double` |  |  |
<!-- generated:statsports-drillkpi-v7-decelerations end -->

## DrillKpiV7 fields: sprints, high-intensity bursts and zone entries

<!-- generated:statsports-drillkpi-v7-sprints start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `sprints` | `integer` | `int32` | yes | yes |
| `sprintDistance` | `number` | `double` | yes | yes |
| `entriesZ3Rel` | `integer` | `int32` | yes | yes |
| `entriesZ4Rel` | `integer` | `int32` | yes | yes |
| `entriesZ5Rel` | `integer` | `int32` | yes | yes |
| `entriesZ6Rel` | `integer` | `int32` | yes | yes |
| `entriesZ3Abs` | `integer` | `int32` | yes | yes |
| `entriesZ4Abs` | `integer` | `int32` | yes | yes |
| `entriesZ5Abs` | `integer` | `int32` | yes | yes |
| `entriesZ6Abs` | `integer` | `int32` | yes | yes |
| `explosiveDistanceRel` | `number` | `double` | yes | yes |
| `explosiveDistanceAbs` | `number` | `double` | yes | yes |
| `hibsNumber` | `integer` | `int32` | yes | yes |
| `hibsDuration` | `number` | `double` | yes | yes |
| `hibsDistance` | `number` | `double` | yes | yes |
| `hibsMaxSpeed` | `number` | `double` | yes | yes |
| `averageTimeSinceHib` | `number` | `double` | yes | yes |
| `averageTimeSinceSprint` | `number` | `double` | yes | yes |
<!-- generated:statsports-drillkpi-v7-sprints end -->

## DrillKpiV7 fields: heart rate

**Personal data.** These fields are heart rate data about an identifiable athlete, which is health data (special category data under UK and EU GDPR).

<!-- generated:statsports-drillkpi-v7-heart-rate start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `maxHeartrate` | `number` | `double` | yes | yes |
| `hrexertion` | `number` | `double` | yes | yes |
| `timeHeartRateZ1Rel` | `number` | `double` |  |  |
| `timeHeartRateZ2Rel` | `number` | `double` |  |  |
| `timeHeartRateZ3Rel` | `number` | `double` |  |  |
| `timeHeartRateZ4Rel` | `number` | `double` |  |  |
| `timeHeartRateZ5Rel` | `number` | `double` |  |  |
| `timeHeartRateZ6Rel` | `number` | `double` |  |  |
| `timeInRedZoneRel` | `number` | `double` |  |  |
| `timeHeartRateZ1Abs` | `number` | `double` |  |  |
| `timeHeartRateZ2Abs` | `number` | `double` |  |  |
| `timeHeartRateZ3Abs` | `number` | `double` |  |  |
| `timeHeartRateZ4Abs` | `number` | `double` |  |  |
| `timeHeartRateZ5Abs` | `number` | `double` |  |  |
| `timeHeartRateZ6Abs` | `number` | `double` |  |  |
| `timeInRedZoneAbs` | `number` | `double` |  |  |
| `hrLoad` | `number` | `double` | yes | yes |
| `hrv` | `number` | `double` | yes | yes |
| `hrrPercent` | `number` | `double` | yes | yes |
| `hrrBeats` | `integer` | `int32` | yes | yes |
| `percentTimeInRedZoneAbs` | `number` | `double` |  |  |
| `timeHeartRateZ2Z6Abs` | `number` | `double` |  |  |
| `timeHeartRateZ3Z6Abs` | `number` | `double` |  |  |
| `timeHeartRateZ4Z6Abs` | `number` | `double` |  |  |
| `percentTimeInRedZoneRel` | `number` | `double` |  |  |
| `timeHeartRateZ2Z6Rel` | `number` | `double` |  |  |
| `timeHeartRateZ3Z6Rel` | `number` | `double` |  |  |
| `timeHeartRateZ4Z6Rel` | `number` | `double` |  |  |
| `averageHeartRate` | `number` | `double` | yes | yes |
| `minimumHeartrate` | `number` | `double` |  |  |
<!-- generated:statsports-drillkpi-v7-heart-rate end -->

## DrillKpiV7 fields: load, work and other

<!-- generated:statsports-drillkpi-v7-load start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `fatigueIndex` | `number` | `double` | yes | yes |
| `externalWork` | `number` | `double` | yes | yes |
| `energyExpenditure` | `number` | `double` | yes | yes |
| `acute` | `number` | `double` | yes | yes |
| `chronic` | `number` | `double` | yes | yes |
| `acuteChronicRatio` | `number` | `double` | yes | yes |
| `ballInPlayTime` | `number` | `double` | yes |  |
| `collisionLoad` | `number` | `double` | yes |  |
| `collisions` | `number` | `double` | yes |  |
| `mechanicalWork` | `number` | `double` | yes |  |
| `scrumLoad` | `number` | `double` | yes |  |
| `scrums` | `number` | `double` | yes |  |
| `ballInPlayTimePercent` | `number` | `double` | yes |  |
| `edi` | `number` | `double` |  |  |
| `mechanicalLoad` | `number` | `double` |  |  |
<!-- generated:statsports-drillkpi-v7-load end -->

## DrillKpiV7 fields: steps, step impacts and dynamic load

<!-- generated:statsports-drillkpi-v7-steps start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `stepBalance` | `number` | `double` | yes | yes |
| `dynamicLoadVert` | `number` | `double` | yes | yes |
| `dynamicLoadLat` | `number` | `double` | yes | yes |
| `dynamicLoadAnt` | `number` | `double` | yes | yes |
| `dynamicLoadMag` | `number` | `double` | yes | yes |
| `dynamicLoadSlow` | `number` | `double` | yes | yes |
| `totalRightSteps` | `integer` | `int32` | yes | yes |
| `rightVerticalImpact` | `number` | `double` | yes | yes |
| `rightLateralImpact` | `number` | `double` | yes | yes |
| `rightAntPostImpact` | `number` | `double` | yes | yes |
| `rightMagImpact` | `number` | `double` | yes | yes |
| `rightAverageVertImpact` | `number` | `double` | yes | yes |
| `totalLeftSteps` | `integer` | `int32` | yes | yes |
| `leftVerticalImpact` | `number` | `double` | yes | yes |
| `leftLateralImpact` | `number` | `double` | yes | yes |
| `leftAntPostImpact` | `number` | `double` | yes | yes |
| `leftMagImpact` | `number` | `double` | yes | yes |
| `leftAverageVertImpact` | `number` | `double` | yes | yes |
| `runningSymmetry` | `number` | `double` | yes |  |
<!-- generated:statsports-drillkpi-v7-steps end -->

## DrillKpiV7 fields: goalkeeper

<!-- generated:statsports-drillkpi-v7-goalkeeper start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `averageGoalkeeperPower` | `number` | `double` | yes | yes |
| `dives` | `number` | `double` | yes | yes |
| `divesLeft` | `number` | `double` | yes | yes |
| `divesRight` | `number` | `double` | yes | yes |
| `goalkeeperLoad` | `number` | `double` | yes | yes |
| `averageTimeSinceLastDive` | `number` | `double` | yes | yes |
| `averageDiveImpact` | `number` | `double` | yes |  |
<!-- generated:statsports-drillkpi-v7-goalkeeper end -->

## DrillKpiV7 fields: change of direction

<!-- generated:statsports-drillkpi-v7-change-of-direction start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `changeOfDirectionRight` | `integer` | `int32` |  |  |
| `changeOfDirectionLeft` | `integer` | `int32` |  |  |
| `changeOfDirectionTotal` | `integer` | `int32` |  |  |
<!-- generated:statsports-drillkpi-v7-change-of-direction end -->

## DrillKpiV7 fields: custom metrics

<!-- generated:statsports-drillkpi-v7-custom-metrics start -->
| Field | Type | Format | In `DrillKpiV6` | In `DrillKpiV5` |
|---|---|---|---|---|
| `customMetrics` | object (map of `number`) |  | yes |  |
<!-- generated:statsports-drillkpi-v7-custom-metrics end -->

## DrillKpiV6 fields not in DrillKpiV7

These 79 `DrillKpiV6` field names do not appear in `DrillKpiV7`. Many look like the unsuffixed forms of v7 `Rel` and `Abs` fields (for example `accelerations` in v6, and `accelerationsRel` and `accelerationsAbs` in v7), but the spec does not map one to the other. The v6 heart-rate zone fields are spelled `timeHeartrateZ1` to `timeHeartrateZ6` (lower-case `r`).

<!-- generated:statsports-drillkpi-v6-not-in-v7 start -->
| Field | Type | Format | In `DrillKpiV5` |
|---|---|---|---|
| `metabolicDistanceZ1` | `number` | `double` | yes |
| `metabolicDistanceZ2` | `number` | `double` | yes |
| `metabolicDistanceZ3` | `number` | `double` | yes |
| `metabolicDistanceZ4` | `number` | `double` | yes |
| `metabolicDistanceZ5` | `number` | `double` | yes |
| `metabolicDistanceZ6` | `number` | `double` | yes |
| `metabolicTimeZ1` | `number` | `double` | yes |
| `metabolicTimeZ2` | `number` | `double` | yes |
| `metabolicTimeZ3` | `number` | `double` | yes |
| `metabolicTimeZ4` | `number` | `double` | yes |
| `metabolicTimeZ5` | `number` | `double` | yes |
| `metabolicTimeZ6` | `number` | `double` | yes |
| `impacts` | `integer` | `int32` | yes |
| `impactsZ1` | `integer` | `int32` | yes |
| `impactsZ2` | `integer` | `int32` | yes |
| `impactsZ3` | `integer` | `int32` | yes |
| `impactsZ4` | `integer` | `int32` | yes |
| `impactsZ5` | `integer` | `int32` | yes |
| `impactsZ6` | `integer` | `int32` | yes |
| `accelerations` | `integer` | `int32` | yes |
| `accelerationsZ1` | `integer` | `int32` | yes |
| `accelerationsZ2` | `integer` | `int32` | yes |
| `accelerationsZ3` | `integer` | `int32` | yes |
| `accelerationsZ4` | `integer` | `int32` | yes |
| `accelerationsZ5` | `integer` | `int32` | yes |
| `accelerationsZ6` | `integer` | `int32` | yes |
| `accelerationDistanceZ1` | `number` | `double` | yes |
| `accelerationDistanceZ2` | `number` | `double` | yes |
| `accelerationDistanceZ3` | `number` | `double` | yes |
| `accelerationDistanceZ4` | `number` | `double` | yes |
| `accelerationDistanceZ5` | `number` | `double` | yes |
| `accelerationDistanceZ6` | `number` | `double` | yes |
| `accelerationTimeZ1` | `number` | `double` | yes |
| `accelerationTimeZ2` | `number` | `double` | yes |
| `accelerationTimeZ3` | `number` | `double` | yes |
| `accelerationTimeZ4` | `number` | `double` | yes |
| `accelerationTimeZ5` | `number` | `double` | yes |
| `accelerationTimeZ6` | `number` | `double` | yes |
| `decelerations` | `integer` | `int32` | yes |
| `decelerationsZ1` | `integer` | `int32` | yes |
| `decelerationsZ2` | `integer` | `int32` | yes |
| `decelerationsZ3` | `integer` | `int32` | yes |
| `decelerationsZ4` | `integer` | `int32` | yes |
| `decelerationsZ5` | `integer` | `int32` | yes |
| `decelerationsZ6` | `integer` | `int32` | yes |
| `decelerationDistanceZ1` | `number` | `double` | yes |
| `decelerationDistanceZ2` | `number` | `double` | yes |
| `decelerationDistanceZ3` | `number` | `double` | yes |
| `decelerationDistanceZ4` | `number` | `double` | yes |
| `decelerationDistanceZ5` | `number` | `double` | yes |
| `decelerationDistanceZ6` | `number` | `double` | yes |
| `decelerationTimeZ1` | `number` | `double` | yes |
| `decelerationTimeZ2` | `number` | `double` | yes |
| `decelerationTimeZ3` | `number` | `double` | yes |
| `decelerationTimeZ4` | `number` | `double` | yes |
| `decelerationTimeZ5` | `number` | `double` | yes |
| `decelerationTimeZ6` | `number` | `double` | yes |
| `timeHeartrateZ1` | `number` | `double` | yes |
| `timeHeartrateZ2` | `number` | `double` | yes |
| `timeHeartrateZ3` | `number` | `double` | yes |
| `timeHeartrateZ4` | `number` | `double` | yes |
| `timeHeartrateZ5` | `number` | `double` | yes |
| `timeHeartrateZ6` | `number` | `double` | yes |
| `timeInRedZone` | `number` | `double` | yes |
| `percentTimeInRedZone` | `number` | `double` | yes |
| `timeHeartRateZ2Z6` | `number` | `double` | yes |
| `timeHeartRateZ3Z6` | `number` | `double` | yes |
| `timeHeartRateZ4Z6` | `number` | `double` | yes |
| `accelerationsZ3Z6` | `number` | `double` | yes |
| `accelerationsZ4Z6` | `number` | `double` | yes |
| `accelerationsZ5Z6` | `number` | `double` | yes |
| `decelerationsZ3Z6` | `number` | `double` | yes |
| `decelerationsZ4Z6` | `number` | `double` | yes |
| `decelerationsZ5Z6` | `number` | `double` | yes |
| `impactsZ3Z6` | `number` | `double` | yes |
| `impactsZ4Z6` | `number` | `double` | yes |
| `impactsZ5Z6` | `number` | `double` | yes |
| `metabolicDistance` | `number` | `double` | yes |
| `metabolicTime` | `number` | `double` | yes |
<!-- generated:statsports-drillkpi-v6-not-in-v7 end -->

## DrillKpiV6 fields not in DrillKpiV5

`DrillKpiV6` has every `DrillKpiV5` field, with the same type, plus these 11:

<!-- generated:statsports-drillkpi-v6-not-in-v5 start -->
| Field | Type | Format | In `DrillKpiV7` |
|---|---|---|---|
| `accelerationSymmetry` | `number` | `double` | yes |
| `averageDiveImpact` | `number` | `double` | yes |
| `ballInPlayTime` | `number` | `double` | yes |
| `collisionLoad` | `number` | `double` | yes |
| `collisions` | `number` | `double` | yes |
| `mechanicalWork` | `number` | `double` | yes |
| `runningSymmetry` | `number` | `double` | yes |
| `scrumLoad` | `number` | `double` | yes |
| `scrums` | `number` | `double` | yes |
| `ballInPlayTimePercent` | `number` | `double` | yes |
| `customMetrics` | object (map of `number`) |  | yes |
<!-- generated:statsports-drillkpi-v6-not-in-v5 end -->
