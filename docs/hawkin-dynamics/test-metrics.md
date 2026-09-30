---
source_type: curated
source_url: https://connect.hawkindynamics.com/assets/metrics.json
upstream_version: metrics.json as published 2026-09-30
crawled_at: 2026-09-30
---

# Hawkin Dynamics Test Metrics

## About the metrics list

Hawkin publishes its metric vocabulary as
`https://connect.hawkindynamics.com/assets/metrics.json`, the file the "Metrics"
section of https://connect.hawkindynamics.com/api loads. The same shape comes from
the authenticated `GET /api/v1/metrics` endpoint. Each test type has a
`canonicalTestTypeId`, a `testTypeName` and a list of metrics with `id`, `label`,
`units` and `description`.

This page lists every metric of the 13 test types the reference page shows,
535 rows in all, with `id`, `label`, `units` and `description` copied as published.
An empty unit cell means the file gives an empty `units` string. The same `id` can
appear under several test types, sometimes with a different description.

The file also has five test types the reference page leaves out on purpose. Its
script says: "Two test types in metrics.json are missing testTypeName and are
intentionally excluded from the docs until the data is corrected. Clean / Snatch /
Overhead Lift are excluded by product decision." This page leaves them out too:

| `canonicalTestTypeId` | Name | Metrics in the file |
|---|---|---|
| `zwGhMmCVKKrf8Fgccg23` | (no `testTypeName`) | 19 |
| `2jNA63KIvQcqKlxo63we` | (no `testTypeName`) | 122 |
| `cloaBt6gXbKvsrDcqNAs` | Clean | 44 |
| `HWI4BzMSq0S0HFjWPIeC` | Snatch | 44 |
| `3HKDlteQolAUXmEKKWoT` | Overhead Lift | 46 |

Metric naming patterns in the file: many asymmetry metrics have an `id` starting
`lr` with units `%`, next to `left...` and `right...` metrics (for example
`lrPeakBrakingForce`, `leftPeakBrakingForce`, `rightPeakBrakingForce`). Check each
metric's own description for its definition.

**Personal data.** Test results describe an identifiable athlete's body and
performance, including body weight (`weight`, "System Weight"). Treat them as
personal data, and as health data where they describe the body.

## CMJ Rebound metrics

`canonicalTestTypeId`: `pqgf2TPUOQOQs6r0HQWb`. 115 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `avgCmjBrakingForce` | CMJ Avg. Braking Force | N | The average vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump. |
| `avgCmjPropulsiveForce` | CMJ Avg. Propulsive Force | N | The average vertical ground reaction force applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `avgCmjRelativeBrakingForce` | CMJ Avg. Relative Braking Force | % | The average vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump as a percentage of system weight. |
| `avgCmjRelativePropulsiveForce` | CMJ Avg. Relative Propulsive Force | % | The average vertical ground reaction force applied to the system center of mass during the propulsion phase of the countermovement jump as a percentage of system weight. |
| `avgLandingForce` | Avg. Landing Force | N | The average vertical ground reaction force applied to the system center of mass during the landing phase. |
| `avgReboundBrakingForce` | Rebound Avg. Braking Force | N | The average vertical ground reaction force applied to the system center of mass during the braking phase of the rebound. |
| `avgReboundPropulsiveForce` | Rebound Avg. Propulsive Force | N | The average vertical ground reaction force applied to the system center of mass during the propulsion phase of the rebound. |
| `avgReboundRelativeBrakingForce` | Rebound Avg. Relative Braking Force | % | The average vertical ground reaction force applied to the system center of mass during the braking phase of the rebound as a percentage of system weight. |
| `avgReboundRelativePropulsiveForce` | Rebound Avg. Relative Propulsive Force | % | The average vertical ground reaction force applied to the system center of mass during the propulsive phase of the rebound as a percentage of system weight. |
| `cmjAvgBrakingPower` | CMJ Avg. Braking Power | W | The average mechanical power applied to the system center of mass during the braking phase of the countermovement jump. |
| `cmjAvgPropulsivePower` | CMJ Avg. Propulsive Power | W | The average mechanical power applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `cmjAvgRelativeBrakingPower` | CMJ Avg. Relative Braking Power | W/kg | The average mechanical power applied to the system center of mass during the braking phase of the countermovement jump relative to system mass. |
| `cmjAvgRelativePropulsivePower` | CMJ Avg. Relative Propulsive Power | W/kg | The average mechanical power applied to the system center of mass during the propulsion phase of the countermovement jump relative to system mass. |
| `cmjBrakingImpulse` | CMJ Braking Impulse | N.s | The vertical impulse applied to the system center of mass during the braking phase of the countermovement jump. |
| `cmjBrakingNetImpulse` | CMJ Braking Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the braking phase of the countermovement jump. |
| `cmjBrakingRFD` | CMJ Braking RFD | N/s | The average slope of the vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump. |
| `cmjCounterDepth` | CMJ Depth | m | The peak negative vertical displacement of the system center of mass of the of the countermovement jump. |
| `cmjForceAtMinDisplacement` | CMJ Force At Min Displacement | N | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass during the countermovement jump. |
| `cmjImpulseRatio` | Impulse Ratio |  | The ratio between the net vertical impulse applied to the system center of mass during the braking phase and the net vertical impulse applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `cmjJumpHeight` | CMJ Jump Height | m | The change in system center of mass position between the instant of take-off and peak positive vertical displacement of the system center of mass during the countermovement jump, calculated using the vertical velocity of the system center of mass at the instant of take-off and the equations of uniformly accelerated motion. |
| `cmjJumpMomentum` | CMJ Jump Momentum | kg.m/s | The vertical momentum of the system center of mass at the instant of take-off during the countermovement jump. |
| `cmjModifiedRsi` | CMJ Modified RSI |  | The jump height calculated using the vertical velcity of the system center of mass at the instant of take-off divided by the total time taken from the initiation of movement to the instant of take-off (i.e. Time to Take-off) during the countermovement jump. |
| `cmjPeakBrakingPower` | CMJ Peak Braking Power | W | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase of the countermovement jump. |
| `cmjPeakPropulsivePower` | CMJ Peak Propulsive Power | W | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `cmjPeakRelativeBrakingPower` | CMJ Peak Relative Braking Power | W/kg | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase of the countermovement jump relative to system mass. |
| `cmjPeakRelativePropulsivePower` | CMJ Peak Relative Propulsive Power | W/kg | The peak instantaneous mechanical power applied to the system center of mass during the propulsion of the countermovement jump phase relative to system mass. |
| `cmjPositiveImpulse` | Positive Impulse | N.s | The total vertical impulse applied to the system center of mass during the braking phase and the propulsion phase of the countermovement jump. |
| `cmjPositiveNetImpulse` | Positive Net Impulse | N.s | The total vertical impulse above bodyweight applied to the system center of mass during the braking phase and the propulsion phase of the countermovement jump. |
| `cmjPropulsiveImpulse` | CMJ Propulsive Impulse | N.s | The vertical impulse applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `cmjPropulsiveNetImpulse` | CMJ Propulsive Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `cmjRelativeBrakingImpulse` | CMJ Relative Braking Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the braking phase of the countermovement jump relative to system mass. |
| `cmjRelativeForceAtMinDisplacement` | CMJ Relative Force At Min Displacement | % | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass as a percentage of system weight. |
| `cmjRelativeNetBrakingImpulse` | CMJ Relative Braking Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the braking phase of the countermovement jump relative to system mass. |
| `cmjRelativeNetPropulsiveImpulse` | CMJ Relative Propulsive Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the propulsion phase of the countermovement jump relative to system mass. |
| `cmjRelativePropulsiveImpulse` | CMJ Relative Propulsive Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the propulsion phase of the countermovement jump relative to system mass. |
| `cmjRsi` | CMJ RSI |  | The time taken to complete the flight phase divided by the total time taken from the initiation of movement to the instant of take-off (i.e. Time to Take-off) during the countermovement jump. |
| `contactTime` | Rebound Contact Time | ms | Contact time during rebound jump. |
| `flightTime` | Rebound Flight Time | ms | The time taken to complete the flight phase of the rebound. |
| `landingStiffness` | Landing Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass during the landing phase. |
| `landingHeight` | Landing Height | m | The vertical free fall height of the system centre of mass between apex of the preceding jump and the instant they make contact with the force plate(s) to commence the landing phase. |
| `landingPerformanceIndex` | Landing Performance Index |  | The landing height divided by the landing time. |
| `landingTime` | Landing Phase | s | The time taken to complete the landing phase (starting at the instant of touchdown and ending at the first instant that center of mass velocity equals zero). |
| `leftAvgLandingForce` | Left Avg. Landing Force | N | The average left vertical ground reaction force applied to the system center of mass during the landing phase. |
| `leftCmjAvgBrakingForce` | Left CMJ Avg. Braking Force | N | The average left vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump. |
| `leftCmjAvgPropulsiveForce` | Left CMJ Avg. Propulsive Force | N | The average left vertical ground reaction force applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `leftPeakLandingForce` | Left Force at Peak Landing Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `leftReboundAvgBrakingForce` | Left Rebound Avg. Braking Force | N | The average left vertical ground reaction force applied to the system center of mass during the braking phase of the rebound. |
| `leftReboundAvgPropulsiveForce` | Left Rebound Avg. Propulsive Force | N | The average left vertical ground reaction force applied to the system center of mass during the propulsion phase of the rebound. |
| `lrAvgLandingForce` | L\|R Avg. Landing Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the landing phase. |
| `lrCmjAvgBrakingForce` | CMJ L\|R Avg. Braking Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the braking phase of the countermovement jump. |
| `lrCmjAvgPropulsiveForce` | CMJ L\|R Avg. Propulsive Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `lrCmjBrakingImpulseIndex` | CMJ L\|R Braking Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the braking phase of the countermovement jump. |
| `lrCmjPropulsiveImpulseIndex` | CMJ L\|R Propulsive Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `lrLandingImpulseIndex` | L\|R Landing Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the landing phase. |
| `lrPeakLandingForce` | L\|R Peak Landing Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the landing phase. |
| `lrReboundAvgBrakingForce` | Rebound L\|R Avg. Braking Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the braking phase of the rebound. |
| `lrReboundAvgPropulsiveForce` | Rebound L\|R Avg. Propulsive Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the propulsion phase of the rebound. |
| `lrReboundBrakingImpulseIndex` | Rebound L\|R Braking Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the braking phase of the rebound. |
| `lrReboundPropulsiveImpulseIndex` | Rebound L\|R Propulsive Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the propulsion phase of the rebound. |
| `peakCmjBrakingForce` | CMJ Peak Braking Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump. |
| `peakCmjPropulsiveForce` | CMJ Peak Propulsive Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `peakCmjRelativeBrakingForce` | CMJ Peak Relative Braking Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump as a percentage of system weight. |
| `peakCmjRelativePropulsiveForce` | CMJ Peak Relative Propulsive Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase of the countermovement jump as a percentage of system weight. |
| `peakLandingForce` | Peak Landing Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `peakReboundBrakingForce` | Rebound Peak Braking Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase of the rebound. |
| `peakReboundPropulsiveForce` | Rebound Peak Propulsive Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase of the rebound. |
| `peakReboundRelativeBrakingForce` | Rebound Peak Relative Braking Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase of the rebound as a percentage of system weight. |
| `peakReboundRelativePropulsiveForce` | Rebound Peak Relative Propulsive Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase of the rebound as a percentage of system weight. |
| `reboundAvgBrakingPower` | Rebound Avg. Braking Power | W | The average mechanical power applied to the system center of mass during the braking phase of the rebound. |
| `reboundAvgPropulsivePower` | Rebound Avg. Propulsive Power | W | The average mechanical power applied to the system center of mass during the propulsion phase of the rebound. |
| `reboundAvgRelativeBrakingPower` | Rebound Avg. Relative Braking Power | W/kg | The average mechanical power applied to the system center of mass during the braking phase of the rebound relative to system mass. |
| `reboundAvgRelativePropulsivePower` | Rebound Avg. Relative Propulsive Power | W/kg | The average mechanical power applied to the system center of mass during the propulsion phase of the rebound relative to system mass. |
| `reboundBrakingImpulse` | Rebound Braking Impulse | N.s | The vertical impulse applied to the system center of mass during the braking phase of the rebound. |
| `reboundBrakingNetImpulse` | Rebound Braking Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the braking phase of the rebound. |
| `reboundCounterDepth` | Rebound Depth | m | The peak negative vertical displacement of the system center of mass during the rebound. |
| `reboundForceAtMinDisplacement` | Rebound Force At Min Displacement | N | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass during the rebound. |
| `reboundImpactPeak` | Rebound Impact Peak | Yes/No | An impact peak is said to have occured if the peak instantaneous vertical ground reaction force applied to the system center of mass occurs within the first 20% of ground contact of the rebound. |
| `reboundImpulseRatio` | Rebound Impulse Ratio |  | The ratio between the net vertical impulse applied to the system center of mass during the braking phase and the net veritcal impulse applied to the system center of mass during the propulsion phase of the rebound. |
| `reboundJumpHeight` | Rebound Jump Height | m | The change in system center of mass position between the instant of take-off and peak positive vertical displacement of the system center of mass during the rebound, calculated using the vertical velocity of the system center of mass at the instant of take-off and the equations of uniformly accelerated motion. |
| `reboundJumpMomentum` | Rebound Jump Momentum | kg.m/s | The vertical momentum of the system center of mass at the instant of take-off of the rebound. |
| `reboundModifiedRsi` | Rebound Modified RSI |  | The jump height of the rebound calculated using the vertical velcity of the system center of mass at the instant of take-off divided by the total time taken from initial contact to the instant of take-off (i.e. Time to Take-off) of the rebound. |
| `reboundPeakBrakingPower` | Rebound Peak Braking Power | W | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase of the rebound. |
| `reboundPeakPropulsivePower` | Rebound Peak Propulsive Power | W | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase of the rebound. |
| `reboundPeakRelativeBrakingPower` | Rebound Peak Relative Braking Power | W/kg | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase of the rebound relative to system mass. |
| `reboundPeakRelativePropulsivePower` | Rebound Peak Relative Propulsive Power | W/kg | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase of the rebound relative to system mass. |
| `reboundPositiveImpulse` | Rebound Positive Impulse | N.s | The total vertical impulse applied to the system center of mass during the braking phase and the propulsion phase of the rebound. |
| `reboundPositiveNetImpulse` | Rebound Positive Net Impulse | N.s | The total vertical impulse above bodyweight applied to the system center of mass during the braking phase and the propulsion phase of the rebound. |
| `reboundPropulsiveImpulse` | Rebound Propulsive Impulse | N.s | The vertical impulse applied to the system center of mass during the propulsion phase of the rebound. |
| `reboundPropulsiveNetImpulse` | Rebound Propulsive Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the propulsion phase of the rebound. |
| `reboundRelativeBrakingImpulse` | Rebound Relative Braking Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the braking phase of the rebound relative to system mass. |
| `reboundRelativeForceAtMinDisplacement` | Rebound Relative Force At Min Displacement | % | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass during the rebound as a percentage of system weight. |
| `reboundRelativeNetBrakingImpulse` | Rebound Relative Braking Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the braking phase of the rebound relative to system mass. |
| `reboundRelativeNetPropulsiveImpulse` | Rebound Relative Propulsive Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the propulsion phase of the rebound relative to system mass. |
| `reboundRelativePropulsiveImpulse` | Rebound Relative Propulsive Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the propulsion phase of the rebound relative to system mass. |
| `reboundRsi` | Rebound RSI |  | The time taken to complete the flight phase of the rebound divided by the total time taken from initial contact to the instant of take-off (i.e. Time to Take-off) of the rebound. |
| `reboundSpringLikeCorrelation` | Rebound Spring Like Correlation |  | A Pearson product-moment correlation between the vertical ground reaction force applied to the system center of mass and the vertical displacement of the system center of mass of the rebound. |
| `reboundStiffness` | Rebound Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass during the rebound. |
| `reboundTimeToPeakBrakingForce` | Rebound Time to Peak Braking Force | ms | The time taken from initial contact to the instant of the peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase of the rebound. |
| `relativePeakLandingForce` | Relative Peak Landing Force | % | The average vertical ground reaction force applied to the system center of mass during the landing phase as a percentage of system weight. |
| `rightAvgLandingForce` | Right Avg. Landing Force | N | The average right vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightCmjAvgBrakingForce` | Right CMJ Avg. Braking Force | N | The average right vertical ground reaction force applied to the system center of mass during the braking phase of the countermovement jump. |
| `rightCmjAvgPropulsiveForce` | Right CMJ Avg. Propulsive Force | N | The average right vertical ground reaction force applied to the system center of mass during the propulsion phase of the countermovement jump. |
| `rightPeakLandingForce` | Right Force at Peak Landing Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightReboundAvgBrakingForce` | Right Rebound Avg. Braking Force | N | The average right vertical ground reaction force applied to the system center of mass during the braking phase of the rebound. |
| `rightReboundAvgPropulsiveForce` | Right Rebound Avg. Propulsive Force | N | The average right vertical ground reaction force applied to the system center of mass during the propulsion phase of the rebound. |
| `timeToStabilization` | Time to Stabilization | ms | The time taken for the vertical ground reaction force applied to the system center of mass to remain within 5% of system weight for 1s. |
| `timeToTakeoff` | CMJ Time To Takeoff | s | The total time taken from the initiation of movement to the instant of take-off of the countermovement jump. |
| `reboundTimeToTakeoff` | Rebound Time To Takeoff | s | The total time taken from initial contact the instant of take-off of the rebound. |
| `weight` | System Weight | N | The lowest 1 s average of the vertical ground reaction force applied to the system center of mass during the weighting phase, identified by an optimization loop. |
| `cmjP1PropulsiveImpulse` | CMJ P1 Propulsive Impulse | N.s | The propulsive impulse applied during the first half of the propulsive phase of the CMJ. |
| `cmjP2PropulsiveImpulse` | CMJ P2 Propulsive Impulse | N.s | The propulsive impulse applied during the second half of the propulsive phase of the CMJ. |
| `reboundP1PropulsiveImpulse` | Rebound P1 Propulsive Impulse | N.s | The propulsive impulse applied during the first half of the propulsive phase of the rebound jump. |
| `reboundP2PropulsiveImpulse` | Rebound P2 Propulsive Impulse | N.s | The propulsive impulse applied during the second half of the propulsive phase of the rebound jump. |
| `cmjP1p2PropulsiveImpulseIndex` | CMJ P1\|P2 Propulsive Impulse Index |  | The ratio of the propulsive impulse applied during the first half of the propulsive phase to the propulsive impulse applied during the second half of the propulsive phase of the CMJ. |
| `reboundP1p2PropulsiveImpulseIndex` | Rebound P1\|P2 Propulsive Impulse Index |  | The ratio of the propulsive impulse applied during the first half of the propulsive phase to the propulsive impulse applied during the second half of the propulsive phase of the rebound jump. |

## Countermovement Jump metrics

`canonicalTestTypeId`: `7nNduHeM5zETPjHxvm7s`. 85 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `weight` | System Weight | N | The lowest 1s average of the vertical ground reaction force applied to the system center of mass during the weighting phase, identified by an optimization loop. |
| `jumpHeight` | Jump Height | m | The change in system center of mass position between the instant of take-off and peak positive vertical displacement of the system center of mass, calculated using the vertical velocity of the system center of mass at the instant of take-off and the equations of uniformly accelerated motion. |
| `jumpMomentum` | Jump Momentum | kg.m/s | The vertical momentum (m * velocity) of the system center of mass at the instant of take-off. |
| `counterDepth` | Countermovement Depth | m | The peak negative vertical displacement of the system center of mass. |
| `brakingRFD` | Braking RFD | N/s | The average slope of the vertical ground reaction force applied to the system center of mass during the braking phase. |
| `stiffness` | Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass. |
| `forceAtMinDisplacement` | Force at Min Displacement | N | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass. |
| `relativeForceAtMinDisplacement` | Relative Force at Min Displacement | % | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass as a percentage of system weight. |
| `avgBrakingForce` | Avg. Braking Force | N | The average vertical ground reaction force applied to the system center of mass during the braking phase. |
| `avgRelativeBrakingForce` | Avg. Relative Braking Force | % | The average vertical ground reaction force applied to the system center of mass during the braking phase as a percentage of system weight. |
| `peakBrakingForce` | Peak Braking Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `peakRelativeBrakingForce` | Peak Relative Braking Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase as a percentage of system weight. |
| `avgPropulsiveForce` | Avg. Propulsive Force | N | The average vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `avgRelativePropulsiveForce` | Avg. Relative Propulsive Force | % | The average vertical ground reaction force applied to the system center of mass during the propulsion phase as a percentage of system weight. |
| `peakPropulsiveForce` | Peak Propulsive Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `peakRelativePropulsiveForce` | Peak Relative Propulsive Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase as a percentage of system weight. |
| `unweightingPhase` | Unweighting Phase | s | The time taken to complete the unweighting phase. |
| `unweightingPhasePercentage` | Unweighting Phase % | % | The time taken to complete the unweighting phase relative to the time taken to complete the movement. |
| `brakingPhase` | Braking Phase | s | The time taken to complete the braking phase. |
| `brakingPhasePercentage` | Braking Phase % | % | The time taken to complete the braking phase relative to the time taken to complete the movement. |
| `propulsivePhase` | Propulsive Phase | s | The time taken to complete the propulsion phase. |
| `propulsivePhasePercentage` | Propulsive Phase % | % | The time taken to complete the propulsion phase relative to the time taken to complete the movement. |
| `flightTime` | Flight Time | s | The time taken to complete the flight phase. |
| `timeToTakeoff` | Time To Takeoff | s | The total time taken from the initiation of movement to the instant of take-off. |
| `brakingNetImpulse` | Braking Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the braking phase. |
| `propulsiveNetImpulse` | Propulsive Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the propulsion phase. |
| `totalPositiveImpulse` | Positive Impulse | N.s | The total vertical impulse applied to the system center of mass during the braking phase and the propulsion phase. |
| `positiveImpulse` | Positive Net Impulse | N.s | The total vertical impulse above bodyweight applied to the system center of mass during the braking phase and the propulsion phase. |
| `impulseRatio` | Impulse Ratio |  | The ratio between the net vertical impulse applied to the system center of mass during the braking phase and the net vertical impulse applied to the system center of mass during the propulsion phase. |
| `avgBrakingVelocity` | Avg. Braking Velocity | m/s | The average vertical velocity of the system center of mass during the braking phase. |
| `peakBrakingVelocity` | Peak Braking Velocity | m/s | The peak negative instantaneous vertical velocity of the system center of mass during the braking phase. |
| `avgPropulsiveVelocity` | Avg. Propulsive Velocity | m/s | The average vertical velocity of the system center of mass during the propulsion phase. |
| `takeoffVelocity` | Takeoff Velocity | m/s | The vertical velocity of the system center of mass at the instant of take-off. |
| `peakVelocity` | Peak Velocity | m/s | The peak instantaneous vertical velocity of the center of mass. |
| `avgBrakingPower` | Avg. Braking Power | W | The average mechanical power applied to the system center of mass during the braking phase. |
| `avgRelativeBrakingPower` | Avg. Relative Braking Power | W/kg | The average mechanical power applied to the system center of mass during the braking phase relative to system mass. |
| `peakBrakingPower` | Peak Braking Power | W | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase. |
| `peakRelativeBrakingPower` | Peak Relative Braking Power | W/kg | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase relative to system mass. |
| `avgPropulsivePower` | Avg. Propulsive Power | W | The average mechanical power applied to the system center of mass during the propulsion phase. |
| `avgRelativePropulsivePower` | Avg. Relative Propulsive Power | W/kg | The average mechanical power applied to the system center of mass during the propulsion phase relative to system mass. |
| `peakPropulsivePower` | Peak Propulsive Power | W | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase. |
| `peakRelativePropulsivePower` | Peak Relative Propulsive Power | W/kg | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase relative to system mass. |
| `lrPeakBrakingForce` | L\|R Peak Braking Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the braking phase. |
| `leftPeakBrakingForce` | Left Force at Peak Braking Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `rightPeakBrakingForce` | Right Force at Peak Braking Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `lrAvgBrakingForce` | L\|R Avg. Braking Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the braking phase. |
| `leftAvgBrakingForce` | Left Avg. Braking Force | N | The average left vertical ground reaction force applied to the system center of mass during the braking phase. |
| `rightAvgBrakingForce` | Right Avg. Braking Force | N | The average right vertical ground reaction force applied to the system center of mass during the braking phase. |
| `lrPeakPropulsiveForce` | L\|R Peak Propulsive Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the propulsion phase. |
| `leftPeakPropulsiveForce` | Left Force at Peak Propulsive Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `rightPeakPropulsiveForce` | Right Force at Peak Propulsive Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `lrAvgPropulsiveForce` | L\|R Avg. Propulsive Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the propulsion phase. |
| `leftAvgPropulsiveForce` | Left Avg. Propulsive Force | N | The average left vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `rightAvgPropulsiveForce` | Right Avg. Propulsive Force | N | The average right vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `lrAvgBrakingRFD` | L\|R Avg. Braking RFD | % | The asymmetry between the left and right average slope of the vertical ground reaction forces applied to the system center of mass during the braking phase. |
| `leftAvgBrakingRFD` | Left Avg. Braking RFD | N/s | The average slope of the left vertical ground reaction force applied to the system center of mass during the braking phase. |
| `rightAvgBrakingRFD` | Right Avg. Braking RFD | N/s | The average slope of the right vertical ground reaction force applied to the system center of mass during the braking phase. |
| `lrBrakingImpulseIndex` | L\|R Braking Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the braking phase. |
| `lrPropulsiveImpulseIndex` | L\|R Propulsive Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the propulsion phase. |
| `timeToStabilization` | Time to Stabilization | ms | The time taken for the vertical ground reaction force applied to the system center of mass to remain within 5% of system weight for 1s. |
| `landingHeight` | Landing Height | m | The vertical free fall height of the system centre of mass between apex of the preceding jump and the instant they make contact with the force plate(s) to commence the landing phase |
| `landingPerformanceIndex` | Landing Performance Index |  | The landing height divided by the landing time. |
| `landingTime` | Landing Phase | s | The time taken to complete the landing phase (starting at the instant of touchdown and ending at the first instant that center of mass velocity equals zero). |
| `landingStiffness` | Landing Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass during the landing phase. |
| `peakLandingForce` | Peak Landing Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `avgLandingForce` | Avg. Landing Force | N | The average vertical ground reaction force applied to the system center of mass during the landing phase. |
| `relativePeakLandingForce` | Relative Peak Landing Force | % | The average vertical ground reaction force applied to the system center of mass during the landing phase as a percentage of system weight. |
| `lrPeakLandingForce` | L\|R Peak Landing Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the landing phase. |
| `leftPeakLandingForce` | Left Force at Peak Landing Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightPeakLandingForce` | Right Force at Peak Landing Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `lrAvgLandingForce` | L\|R Avg. Landing Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the landing phase. |
| `leftAvgLandingForce` | Left Avg. Landing Force | N | The average left vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightAvgLandingForce` | Right Avg. Landing Force | N | The average right vertical ground reaction force applied to the system center of mass during the landing phase. |
| `lrLandingImpulseIndex` | L\|R Landing Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the landing phase. |
| `rsi` | RSI |  | The time taken to complete the flight phase divided by the total time taken from the initiation of movement to the instant of take-off (i.e. Time to Take-off). |
| `mRsi` | mRSI |  | The jump height calculated using the vertical velocity of the system center of mass at the instant of take-off divided by the total time taken from the initiation of movement to the instant of take-off (i.e. Time to Take-off). |
| `totalBrakingImpulse` | Braking Impulse | N.s | The vertical impulse applied to the system center of mass during the braking phase. |
| `totalRelativeBrakingImpulse` | Relative Braking Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the braking phase relative to system mass. |
| `relativeBrakingImpulse` | Relative Braking Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the braking phase relative to system mass. |
| `totalPropulsiveImpulse` | Propulsive Impulse | N.s | The vertical impulse applied to the system center of mass during the propulsion phase. |
| `totalRelativePropulsiveImpulse` | Relative Propulsive Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the propulsion phase relative to system mass. |
| `relativePropulsiveImpulse` | Relative Propulsive Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the propulsion phase relative to system mass. |
| `p1PropulsiveImpulse` | P1 Propulsive Impulse | N.s | The propulsive impulse applied during the first half of the propulsive phase. |
| `p2PropulsiveImpulse` | P2 Propulsive Impulse | N.s | The propulsive impulse applied during the second half of the propulsive phase. |
| `p1p2PropulsiveImpulseIndex` | P1\|P2 Propulsive Impulse Index |  | The ratio of the propulsive impulse applied during the first half of the propulsive phase to the propulsive impulse applied during the second half of the propulsive phase. |

## Drop Jump metrics

`canonicalTestTypeId`: `gyBETpRXpdr63Ab2E0V8`. 85 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `weight` | System Weight | N | The lowest 1s average of the vertical ground reaction force applied to the system centre of mass during the weighting phase, identified by an optimization loop. |
| `fallHeight` | Drop Height | m | The vertical free fall height of the system center of mass between the instant the athlete drops off the box or platform and the instant they make contact with the force plate(s). |
| `dropHeight` | Box Height | m | The user inputted box height. |
| `jumpHeight` | Jump Height | m | The change in system center of mass position between the instant of take-off and peak positive vertical displacement of the system center of mass, calculated using the vertical velocity of the system center of mass at the instant of take-off and the equations of uniformly accelerated motion. |
| `springLikeCorrelation` | Spring Like Correlation |  | A Pearson product-moment correlation between the vertical ground reaction force applied to the system center of mass and the vertical displacement of the system center of mass. |
| `impactPeak` | Impact Peak | Yes/No | An impact peak is said to have occured if the peak instantaneous vertical ground reaction force applied to the system center of mass occurs within the first 20% of ground contact. |
| `timeToPeakBrakingForce` | Time to Peak Braking Force | ms | The time taken from initial contact to the instant of the peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `stiffness` | Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass. |
| `modifiedReactivityIndex` | mRSI |  | The jump height calculated using the vertical velcity of the system center of mass at the instant of take-off divided by the total time taken from initial contact to the instant of take-off (i.e. Time to Take-off). |
| `reactivityIndex` | RSI |  | The time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off (i.e. Time to Take-off). |
| `jumpMomentum` | Jump Momentum | kg.m/s | The vertical momentum of the system center of mass at the instant of take-off. |
| `peakBrakingForce` | Peak Braking Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `peakRelativeBrakingForce` | Peak Relative Braking Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase as a percentage of system weight |
| `avgBrakingForce` | Avg. Braking Force | N | The average vertical ground reaction force applied to the system center of mass during the braking phase. |
| `avgRelativeBrakingForce` | Avg. Relative Braking Force | % | The average vertical ground reaction force applied to the system center of mass during the braking phase as a percentage of system weight. |
| `brakingImpulse` | Braking Impulse | N.s | The vertical impulse applied to the system center of mass during the braking phase. |
| `relativeBrakingImpulse` | Relative Braking Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the braking phase relative to system mass. |
| `brakingNetImpulse` | Braking Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the braking phase. |
| `relativeBrakingNetImpulse` | Relative Braking Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the braking phase relative to system mass. |
| `peakPropulsiveForce` | Peak Propulsive Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `peakRelativePropulsiveForce` | Peak Relative Propulsive Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase as a percentage of system weight. |
| `avgPropulsiveForce` | Avg. Propulsive Force | N | The average vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `avgRelativePropulsiveForce` | Avg. Relative Propulsive Force | % | The average vertical ground reaction force applied to the system center of mass during the propulsive phase as a percentage of system weight. |
| `propulsiveImpulse` | Propulsive Impulse | N.s | The vertical impulse applied to the system center of mass during the propulsion phase. |
| `relativePropulsiveImpulse` | Relative Propulsive Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the propulsion phase relative to system mass. |
| `propulsiveNetImpulse` | Propulsive Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the propulsion phase. |
| `relativePropulsiveNetImpulse` | Relative Propulsive Net Impulse | N.s/kg | The net vertical impulse applied to the system center of mass during the propulsion phase relative to system mass. |
| `brakingPhase` | Braking Phase | s | The time taken to complete the braking phase. |
| `brakingPhasePercentage` | Braking Phase % | % | The time taken to complete the braking phase relative to the time taken to complete the movement. |
| `propulsivePhase` | Propulsive Phase | s | The time taken to complete the propulsion phase. |
| `propulsivePhasePercentage` | Propulsive Phase % | % | The time taken to complete the propulsion phase relative to the time taken to complete the movement. |
| `timeToTakeoff` | Time To Takeoff | s | The total time taken from initial contact the instant of take-off. |
| `flightTime` | Flight Time | s | The time taken to complete the flight phase. |
| `contactTime` | Contact Time | s | Combined time of braking and propulsive phase. |
| `positiveImpulse` | Positive Impulse | N.s | The total vertical impulse applied to the system center of mass during the braking phase and the propulsion phase. |
| `positiveNetImpulse` | Positive Net Impulse | N.s | The total vertical impulse above bodyweight applied to the system center of mass during the braking phase and the propulsion phase. |
| `impulseRatio` | Net Impulse Ratio |  | The ratio between the net vertical impulse applied to the system center of mass during the braking phase and the net veritcal impulse applied to the system center of mass during the propulsion phase. |
| `forceAtMinDisplacement` | Force At Min Displacement | N | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass. |
| `relativeForceAtMinDisplacement` | Relative Force At Min Displacement | % | The vertical ground reaction force applied to the system center of mass at the point of the peak negative vertical displacement of the system center of mass as a percentage of system weight. |
| `peakVelocity` | Peak Velocity | m/s | The peak instantaneous vertical velocity of the system center of mass. |
| `takeoffVelocity` | Takeoff Velocity | m/s | The vertical velocity of the system center of mass at the instant of take-off. |
| `avgBrakingPower` | Avg. Braking Power | W | The average mechanical power applied to the system center of mass during the braking phase. |
| `avgRelativeBrakingPower` | Avg. Relative Braking Power | W/kg | The average mechanical power applied to the system center of mass during the braking phase relative to system mass. |
| `peakBrakingPower` | Peak Braking Power | W | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase. |
| `peakRelativeBrakingPower` | Peak Relative Braking Power | W/kg | The peak negative instantaneous mechanical power applied to the system center of mass during the braking phase relative to system mass. |
| `avgPropulsivePower` | Avg. Propulsive Power | W | The average mechanical power applied to the system center of mass during the propulsion phase. |
| `avgRelativePropulsivePower` | Avg. Relative Propulsive Power | W/kg | The average mechanical power applied to the system center of mass during the propulsion phase relative to system mass. |
| `peakPropulsivePower` | Peak Propulsive Power | W | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase. |
| `peakRelativePropulsivePower` | Peak Relative Propulsive Power | W/kg | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase relative to system mass. |
| `lrRatioPeakBrakingForce` | L\|R Peak Braking Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the braking phase. |
| `lrAvgBrakingForce` | L\|R Avg. Braking Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the braking phase. |
| `leftAvgBrakingForce` | Left Avg. Braking Force | N | The average left vertical ground reaction force applied to the system center of mass during the braking phase. |
| `rightAvgBrakingForce` | Right Avg. Braking Force | N | The average right vertical ground reaction force applied to the system center of mass during the braking phase. |
| `lrPeakPropulsiveForce` | L\|R Peak Propulsive Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the propulsion phase. |
| `leftPeakPropulsiveForce` | Left Force at Peak Propulsive Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `rightPeakPropulsiveForce` | Right Force at Peak Propulsive Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `lrAvgPropulsiveForce` | L\|R Avg. Propulsive Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the propulsion phase. |
| `leftAvgPropulsiveForce` | Left Avg. Propulsive Force | N | The average left vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `rightAvgPropulsiveForce` | Right Avg. Propulsive Force | N | The average right vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `avgBrakingRFD` | Avg. Braking RFD | N/s | The average slope of the vertical ground reaction force applied to the system center of mass during the braking phase. |
| `lrAvgBrakingRFD` | L\|R Avg. Braking RFD | % | The asymmetry between the left and right average slope of the vertical ground reaction forces applied to the system center of mass during the braking phase. |
| `leftAvgBrakingRFD` | Left Avg. Braking RFD | N/s | The average slope of the left vertical ground reaction force applied to the system center of mass during the braking phase. |
| `rightAvgBrakingRFD` | Right Avg. Braking RFD | N/s | The average slope of the right vertical ground reaction force applied to the system center of mass during the braking phase. |
| `lrBrakingImpulseIndex` | L\|R Braking Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the braking phase. |
| `lrPropulsiveImpulseIndex` | L\|R Propulsive Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the propulsion phase. |
| `timeToStabilization` | Time to Stabilization | ms | The time taken for the vertical ground reaction force applied to the system center of mass to remain within 5% of system weight for 1s. |
| `landingStiffness` | Landing Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass during the landing phase. |
| `peakLandingForce` | Peak Landing Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `avgLandingForce` | Avg. Landing Force | N | The average vertical ground reaction force applied to the system center of mass during the landing phase. |
| `relativePeakLandingForce` | Relative Peak Landing Force | % | The average vertical ground reaction force applied to the system center of mass during the landing phase as a percentage of system weight. |
| `lrPeakLandingForce` | L\|R Peak Landing Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the landing phase. |
| `leftPeakLandingForce` | Left Force at Peak Landing Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightPeakLandingForce` | Right Force at Peak Landing Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `lrAvgLandingForce` | L\|R Avg. Landing Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the landing phase. |
| `leftAvgLandingForce` | Left Avg. Landing Force | N | The average left vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightAvgLandingForce` | Right Avg. Landing Force | N | The average right vertical ground reaction force applied to the system center of mass during the landing phase. |
| `lrLandingImpulseIndex` | L\|R Landing Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the landing phase. |
| `avgBrakingVelocity` | Avg. Braking Velocity | m/s | The average vertical velocity of the system center of mass during the braking phase. |
| `avgPropulsiveVelocity` | Avg. Propulsive Velocity | m/s | The average vertical velocity of the system center of mass during the propulsion phase. |
| `counterDepth` | Countermovement Depth | m | The peak negative vertical displacement of the system center of mass. |
| `rightPeakBrakingForce` | Right Force at Peak Braking Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `leftPeakBrakingForce` | Left Force at Peak Braking Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the braking phase. |
| `landingHeight` | Landing Height | m | The vertical free fall height of the system centre of mass between apex of the preceding jump and the instant they make contact with the force plate(s) to commence the landing phase. |
| `landingPerformanceIndex` | Landing Performance Index |  | The landing height divided by the landing time. |
| `landingTime` | Landing Phase | s | The time taken to complete the landing phase (starting at the instant of touchdown and ending at the first instant that center of mass velocity equals zero). |

## Drop Landing metrics

`canonicalTestTypeId`: `rKgI4y3ItTAzUekTUpvR`. 41 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `timeToStabilization` | Time To Stabilization | ms | The time taken for the vertical ground reaction force applied to the system center of mass to remain within 5% of system weight for 1s. |
| `dropHeight` | Box Height | m | The user input box height which is used to estimate the initial contact velocity of the system center of mass. |
| `weight` | System Weight | N | The lowest 1 s average of the vertical ground reaction force applied to the system center of mass during the weighting phase, identified by an optimization loop. |
| `peakForce` | Peak Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the drop landing. |
| `peakRelativeForce` | Peak Relative Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the drop landing as a percentage of system weight. |
| `leftPeakForce` | Left Force at Peak Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the drop landing. |
| `rightPeakForce` | Right Force at Peak Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the drop landing. |
| `avgImpactForce` | Avg. Impact Force | N | The average vertical ground reaction force applied to the system center of mass during the impact phase. |
| `avgRelativeImpactForce` | Avg. Relative Impact Force | % | The average vertical ground reaction force applied to the system center of mass during the impact phase as a percentage of system weight. |
| `leftAvgImpactForce` | Left Avg. Impact Force | N | The average left vertical ground reaction force applied to the system center of mass during the impact phase. |
| `rightAvgImpactForce` | Right Avg. Impact Force | N | The average right vertical ground reaction force applied to the system center of mass during the impact phase. |
| `avgStabilizationForce` | Avg. Stabilization Force | N | The average vertical ground reaction force applied to the system center of mass during the stabilization phase. |
| `leftAvgStabilizationForce` | Left Avg. Stabilization Force | N | The average left vertical ground reaction force applied to the system center of mass during the stabilization phase. |
| `rightAvgStabilizationForce` | Right Avg. Stabilization Force | N | The average right vertical ground reaction force applied to the system center of mass during the stabilization phase. |
| `depth` | Stability Depth | m | The negative vertical displacement of the system center of mass at the instant that the athlete has stabilized, which is defined as the first frame of the time to stabilization. |
| `impactRFD` | Impact RFD | N/s | The average slope of the vertical ground reaction force applied to the system center of mass during the impact phase. |
| `leftImpactRFD` | Left Impact RFD | N/s | The average slope of the left vertical ground reaction force applied to the system center of mass during the impact phase. |
| `rightImpactRFD` | Right Impact RFD | N/s | The average slope of the right vertical ground reaction force applied to the system center of mass during the impact phase. |
| `lrImpactRFD` | L\|R Impact RFD | % | The asymmetry between the left and right average slope of the vertical ground reaction forces applied to the system center of mass during the impact phase. |
| `stiffness` | Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass. |
| `lrPeakForce` | L\|R Peak Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the drop landing. |
| `lrAvgImpactForce` | L\|R Avg. Impact Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the impact phase. |
| `lrAvgStabilizationForce` | L\|R Avg. Stabilization Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the stabilization phase. |
| `avgImpactPower` | Avg. Impact Power | W | The average mechanical power applied to the system center of mass during the impact phase. |
| `avgRelativeImpactPower` | Avg. Relative Impact Power | W/kg | The average mechanical power applied to the system center of mass during the impact phase relative to system mass. |
| `peakImpactPower` | Peak Impact Power | W | The peak negative instantaneous mechanical power applied to the system center of mass during the impact phase. |
| `peakRelativeImpactPower` | Peak Relative Impact Power | W/kg | The peak negative instantaneous mechanical power applied to the system center of mass during the Impact phase relative to system mass. |
| `avgStabilizationPower` | Avg. Stabilization Power | W | The average mechanical power applied to the system center of mass during the stabilization phase. |
| `avgRelativeStabilizationPower` | Avg. Relative Stabilization Power | W/kg | The average mechanical power applied to the system center of mass during the stabilization phase relative to system mass. |
| `peakStabilizationPower` | Peak Stabilization Power | W | The peak instantaneous mechanical power applied to the system center of mass during the stabilization phase. |
| `peakRelativeStabilizationPower` | Peak Relative Stabilization Power | W/kg | The peak instantaneous mechanical power applied to the system center of mass during the stabilization phase relative to system mass. |
| `contactVelocity` | Contact Velocity | m/s | The vertical velocity of the system center of mass at the instant of contact. |
| `avgImpactVelocity` | Avg. Impact Velocity | m/s | The average vertical velocity of the system center of mass during the impact phase. |
| `avgStabilizationVelocity` | Avg. Stabilization Velocity | m/s | The average vertical velocity of the system center of mass during the stabilization phase |
| `impactPhase` | Impact Phase | s | The time taken to complete the impact phase. |
| `impactPhasePercentage` | Impact Phase % | % | The time taken to complete the impact phase relative to the time taken to complete the movement. |
| `stabilizationPhase` | Stabilization Phase | s | The time taken to complete the stabilization phase. |
| `stabilizationPhasePercentage` | Stabilization Phase % | % | The time taken to complete the stabilization phase relative to the time taken to complete the movement. |
| `landingHeight` | Drop Height | m | The vertical free fall height of the system center of mass between the instant the athlete drops off the box or platform and the instant they make contact with the force plate(s). |
| `landingPerformanceIndex` | Landing Performance Index |  | The drop height divided by the landing time. |
| `landingTime` | Landing Phase | s | The time taken to complete the landing phase (starting at the instant of touchdown and ending at the first instant that center of mass velocity equals zero). |

## Free Run metrics

`canonicalTestTypeId`: `5pRSUQVSJVnxijpPMck3`. 29 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `avgForce` | Avg. Force | N | The average vertical ground reaction force applied during the free run. |
| `peakForce` | Peak Force | N | The peak instantaneous vertical ground reaction force applied during the free run. |
| `leftAvgForce` | Avg. Left Force | N | The average left vertical ground reaction force applied during the free run. |
| `rightAvgForce` | Avg. Right Force | N | The average right vertical ground reaction force applied during the free run. |
| `leftPeakForce` | Peak Left Force | N | The peak instantaneous left vertical ground reaction force applied during the free run. |
| `rightPeakForce` | Peak Right Force | N | The peak instantaneous right vertical ground reaction force applied during the free run. |
| `leftStdDev` | SD Left Force | N | The standard deviation of the left vertical ground reaction force applied during the free run. |
| `rightStdDev` | SD Right Force | N | Standard deviation of the right force during the test |
| `totalStdDev` | SD Total Force | N | The standard deviation of the vertical ground reaction force applied during the free run. |
| `lrAvgForce` | L\|R Avg. Force | % | The asymmetry between the left and right average vertical ground reaction forces applied during the free run. |
| `lrPeakForce` | L\|R Peak Force | % | The asymmetry between the left and right peak instantaneous vertical ground reaction forces applied during the free run. |
| `leftMLSwayLength` | Left ML Sway Length | cm | The total distance of medial-lateral sway on the left plate during the free run. |
| `rightMLSwayLength` | Right ML Sway Length | cm | The total distance of medial-lateral sway on the right plate during the free run. |
| `leftAPSwayLength` | Left AP Sway Length | cm | The total distance of anterior-posterior sway on the left plate during the free run. |
| `rightAPSwayLength` | Right AP Sway Length | cm | The total distance of anterior-posterior sway on the right plate during the free run. |
| `leftSwayLength` | Left Sway Length | cm | The total distance of sway on the left plate during the free run. |
| `rightSwayLength` | Right Sway Length | cm | The total distance of sway on the right plate during the free run. |
| `leftMLSwayRange` | Left ML Sway Range | cm | The amplitude of medial-lateral sway on the left plate during the free run. |
| `rightMLSwayRange` | Right ML Sway Range | cm | The amplitude of medial-lateral sway on the right plate during the free run. |
| `leftAPSwayRange` | Left AP Sway Range | cm | The amplitude of anterior-posterior sway on the left plate during the free run. |
| `rightAPSwayRange` | Right AP Sway Range | cm | The amplitude of anterior-posterior sway on the right plate during the free run. |
| `leftSwayRange` | Left Sway Range | cm | The amplitude of sway on the left plate during the free run. |
| `rightSwayRange` | Right Sway Range | cm | The amplitude of sway on the right plate during the free run. |
| `leftAvgMLSwayVelocity` | Left Avg. ML Sway Velocity | cm/s | The average medial-lateral sway velocity on the left plate during the free run. |
| `rightAvgMLSwayVelocity` | Right Avg. ML Sway Velocity | cm/s | The average medial-lateral sway velocity on the right plate during the free run. |
| `leftAvgAPSwayVelocity` | Left Avg. AP Sway Velocity | cm/s | The average anterior-posterior sway velocity on the left plate during the free run. |
| `rightAvgAPSwayVelocity` | Right Avg. AP Sway Velocity | cm/s | The average anterior-posterior sway velocity on the right plate during the free run. |
| `leftAvgSwayVelocity` | Left Sway Velocity | cm/s | The average sway velocity on the left plate during the free run. |
| `rightAvgSwayVelocity` | Right Sway Velocity | cm/s | The average sway velocity on the right plate during the free run. |

## Isometric Test metrics

`canonicalTestTypeId`: `2uS5XD5kXmWgIZ5HhQ3A`. 62 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `forceAt0` | Force at 0 ms | N | The peak instantaneous vertical ground reaction force applied at the initiation of the isometric test. |
| `forceAt100` | Force at 100 ms | N | The peak instantaneous vertical ground reaction force applied at 100 ms during the isometric test. |
| `forceAt150` | Force at 150 ms | N | The peak instantaneous vertical ground reaction force applied at 150 ms during the isometric test. |
| `forceAt200` | Force at 200 ms | N | The peak instantaneous vertical ground reaction force applied at 200 ms during the isometric test. |
| `forceAt250` | Force at 250 ms | N | The peak instantaneous vertical ground reaction force applied at 250 ms during the isometric test. |
| `forceAt50` | Force at 50 ms | N | The peak instantaneous vertical ground reaction force applied at 50 ms during the isometric test. |
| `impulse100` | Impulse 0-100ms | N.s | The vertical impulse applied during the isometric test between 0 and 100ms. |
| `impulse150` | Impulse 0-150ms | N.s | The vertical impulse applied during the isometric test between 0 and 150ms. |
| `impulse200` | Impulse 0-200ms | N.s | The vertical impulse applied during the isometric test between 0 and 200ms. |
| `impulse250` | Impulse 0-250ms | N.s | The vertical impulse applied during the isometric test between 0 and 250ms. |
| `impulse50` | Impulse 0-50ms | N.s | The vertical impulse applied during the isometric test between 0 and 50ms. |
| `initiationThreshold` | Initiation Threshold | N | 3 standard deviations of the quiet period. This can be used to determine the quality of the test. A lower number means less movement during the quiet period. |
| `lForceAt0` | Left Force at 0 ms | N | The peak instantaneous left vertical ground reaction force applied at the initiation of the isometric test. |
| `lForceAt100` | Left Force at 100 ms | N | The peak instantaneous left vertical ground reaction force applied at 100 ms during the isometric test. |
| `lForceAt150` | Left Force at 150 ms | N | The peak instantaneous left vertical ground reaction force applied at 150 ms during the isometric test. |
| `lForceAt200` | Left Force at 200 ms | N | The peak instantaneous left vertical ground reaction force applied at 200 ms during the isometric test. |
| `lForceAt250` | Left Force at 250 ms | N | The peak instantaneous left vertical ground reaction force applied at 250 ms during the isometric test. |
| `lForceAt50` | Left Force at 50 ms | N | The peak instantaneous left vertical ground reaction force applied at 50 ms during the isometric test. |
| `lPeakForce` | Left Peak Force | N | The peak instantaneous left vertical ground reaction force applied during the isometric test. |
| `lengthOfPull` | Length of Pull | s | The time taken from the initiation of the pull to the return of system weight to baseline. |
| `lrPeakForce` | L\|R Peak Force | % | The asymmetry between the left and right vertical ground reaction forces applied during the isometric test at the instant of peak vertical ground reaction force. |
| `netForceAt0` | Net Force at 0 ms | N | The peak instantaneous net vertical ground reaction force applied at the initiation of the isometric test. |
| `netForceAt100` | Net Force at 100 ms | N | The peak instantaneous net vertical ground reaction force applied at 100 ms during the isometric test. |
| `netForceAt150` | Net Force at 150 ms | N | The peak instantaneous net vertical ground reaction force applied at 150 ms during the isometric test. |
| `netForceAt200` | Net Force at 200 ms | N | The peak instantaneous net vertical ground reaction force applied at 200 ms during the isometric test. |
| `netForceAt250` | Net Force at 250 ms | N | The peak instantaneous net vertical ground reaction force applied at 250 ms during the isometric test. |
| `netForceAt50` | Net Force at 50 ms | N | The peak instantaneous net vertical ground reaction force applied at 50 ms during the isometric test. |
| `netImpulse100` | Net Impulse 0-100ms | N.s | The net vertical impulse applied during the isometric test between 0 and 100 ms. |
| `netImpulse150` | Net Impulse 0-150ms | N.s | The net vertical impulse applied during the isometric test between 0 and 150ms. |
| `netImpulse200` | Net Impulse 0-200ms | N.s | The net vertical impulse applied during the isometric test between 0 and 200 ms. |
| `netImpulse250` | Net Impulse 0-250ms | N.s | The net vertical impulse applied during the isometric test between 0 and 250 ms. |
| `netImpulse50` | Net Impulse 0-50ms | N.s | The net vertical impulse applied during the isometric test between 0 and 50ms. |
| `netPeakForce` | Net Peak Force | N | The peak instantaneous net vertical ground reaction force applied during the isometric test. |
| `peakForce` | Peak Force | N | The peak instantaneous vertical ground reaction force applied during the isometric test. |
| `rForceAt0` | Right Force at 0 ms | N | The peak instantaneous right vertical ground reaction force applied at initiation of the isometric test. |
| `rForceAt100` | Right Force at 100 ms | N | The peak instantaneous right vertical ground reaction force applied at 100 ms during the isometric test. |
| `rForceAt150` | Right Force at 150 ms | N | The peak instantaneous right vertical ground reaction force applied at 150 ms during the isometric test. |
| `rForceAt200` | Right Force at 200 ms | N | The peak instantaneous right vertical ground reaction force applied at 200 ms during the isometric test. |
| `rForceAt250` | Right Force at 250 ms | N | The peak instantaneous right vertical ground reaction force applied at 250 ms during the isometric test. |
| `rForceAt50` | Right Force at 50 ms | N | The peak instantaneous right vertical ground reaction force applied at 50 ms during the isometric test. |
| `rPeakForce` | Right Peak Force | N | The peak instantaneous right vertical ground reaction force applied during the isometric test. |
| `relativeForceAt0` | Relative Force at 0 ms | % | The peak instantaneous vertical ground reaction force applied at initiation of the isometric test as a percentage of system weight. |
| `relativeForceAt0Bw` | Relative Force at 0 ms (BW) | N/kg | The peak instantaneous vertical ground reaction force applied at initiation of the isometric test as a percentage of last known bodyweight. |
| `relativeForceAt100` | Relative Force at 100 ms | % | The peak instantaneous vertical ground reaction force applied at 100 ms during the isometric test as a percentage of system weight. |
| `relativeForceAt100Bw` | Relative Force at 100 ms (BW) | N/kg | The peak instantaneous vertical ground reaction force applied at 100 ms during the isometric test as a percentage of last known bodyweight. |
| `relativeForceAt150` | Relative Force at 150 ms | % | The peak instantaneous vertical ground reaction force applied at 150 ms during the isometric test as a percentage of system weight. |
| `relativeForceAt150Bw` | Relative Force at 150 ms (BW) | N/kg | The peak instantaneous vertical ground reaction force applied at 150 ms during the isometric test as a percentage of last known bodyweight. |
| `relativeForceAt200` | Relative Force at 200 ms | % | The peak instantaneous vertical ground reaction force applied at 200 ms during the isometric test as a percentage of system weight. |
| `relativeForceAt200Bw` | Relative Force at 200 ms (BW) | N/kg | The peak instantaneous vertical ground reaction force applied at 200 ms during the isometric test as a percentage of last known bodyweight. |
| `relativeForceAt250` | Relative Force at 250 ms | % | The peak instantaneous vertical ground reaction force applied at 250 ms during the isometric test as a percentage of system weight. |
| `relativeForceAt250Bw` | Relative Force at 250 ms (BW) | N/kg | The peak instantaneous vertical ground reaction force applied at 250 ms during the isometric test as a percentage of last known bodyweight. |
| `relativeForceAt50` | Relative Force at 50 ms | % | The peak instantaneous vertical ground reaction force applied at 50 ms during the isometric test as a percentage of system weight. |
| `relativeForceAt50Bw` | Relative Force at 50 ms (BW) | N/kg | The peak instantaneous vertical ground reaction force applied at 50 ms during the isometric test as a percentage of last known bodyweight. |
| `relativePeakForce` | Relative Peak Force | % | The peak instantaneous vertical ground reaction force applied during the isometric test as a percentage of system weight. |
| `relativePeakForceBw` | Relative Peak Force (BW) | N/kg | The peak instantaneous vertical ground reaction force applied during the isometric test relative to the last known bodyweight |
| `rfd100` | RFD 0-100 ms | N/s | The average slope of the vertical ground reaction force applied during the isometric test between 0 and 100 ms. |
| `rfd150` | RFD 0-150 ms | N/s | The average slope of the vertical ground reaction force applied during the isometric test between 0 and 150 ms. |
| `rfd200` | RFD 0-200 ms | N/s | The average slope of the vertical ground reaction force applied during the isometric test between 0 and 200 ms. |
| `rfd250` | RFD 0-250 ms | N/s | The average slope of the vertical ground reaction force applied during the isometric test between 0 and 250ms. |
| `rfd50` | RFD 0-50 ms | N/s | The average slope of the vertical ground reaction force applied during the isometric test between 0 and 50 ms. |
| `systemWeight` | System Weight | N | The lowest 1s average of the vertical ground reaction force applied to the system center of mass during the weighting phase, identified by an optimization loop. |
| `timeToPeak` | Time to Peak Force | s | The time taken from the initiation of the pull to the instant of peak verical ground reaction force during the isometric test. |

## Multi Rebound metrics

`canonicalTestTypeId`: `r4fhrkPdYlLxYQxEeM78`. 29 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `avgForce` | Avg. Force | N | The average vertical ground reaction force applied to the system center of mass during the multi rebound. |
| `avgJumpHeight` | Avg. Jump Height | m | The average of all the jump heights identified during the multi rebound, calculated using time in the air and the equations of uniformly accelerated motion. |
| `avgMRsi` | Avg. mRSI |  | The average mRSI (jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of all of the jumps identified during the multi rebound. |
| `avgRsi` | Avg. RSI |  | The average RSI (time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of all of the jumps identified during the multi rebound. |
| `jumpCount` | Number of Jumps | Count | The total number of jumps performed during the multi rebound. |
| `lrAvgForce` | L\|R Avg. Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the multi rebound. |
| `lrPeakForce` | L\|R Peak Force | % | The asymmetry between the left and right peak instantaneous vertical ground reaction forces applied to the system center of mass during the multi rebound. |
| `peakForce` | Peak Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the multi rebound. |
| `peakJumpHeight` | Peak Jump Height | m | The highest jump height identified during the multi rebound, calculated using time in the air and the equations of uniformly accelerated motion. |
| `peakJumpMRsi` | Peak Jump mRSI |  | The jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off (i.e. Time to Take-off) of the highest jump height identified during the multi rebound. |
| `peakJumpRsi` | Peak Jump RSI |  | The time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off (i.e. Time to Take-off) of the highest jump height identified during the multi rebound. |
| `peakMRsi` | Peak mRSI |  | The highest mRSI (jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) identified during the multi rebound. |
| `peakRsi` | Peak RSI |  | The highest RSI (time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) identified during the multi rebound. |
| `top3AvgJumpHeight` | Top 3 Jumps Avg. Jump Height | m | The average of highest three jump heights identified during the multi rebound, calculated using time in the air and the equations of uniformly accelerated motion. |
| `top3AvgMRsi` | Top 3 Jumps Avg. mRSI |  | The average mRSI (jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the three highest jumps identified during the multi rebound. |
| `top3AvgRsi` | Top 3 Jumps Avg. RSI |  | The average RSI (time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the three highest jumps identified during the multi rebound. |
| `top3PeakMRsi` | Top 3 Jumps Peak mRSI |  | The highest mRSI (jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the three highest jumps identified during the multi rebound. |
| `top3PeakRsi` | Top 3 Jumps Peak RSI |  | The highest RSI (time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the three highest jumps identified during the multi rebound. |
| `top5AvgJumpHeight` | Top 5 Jumps Avg. Jump Height | m | The average of highest five jump heights identified during the multi rebound, calculated using time in the air and the equations of uniformly accelerated motion. |
| `top5AvgMRsi` | Top 5 Jumps Avg. mRSI |  | The average mRSI (jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the five highest jumps identified during the multi rebound. |
| `top5AvgRsi` | Top 5 Jumps Avg. RSI |  | The average RSI (time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the five highest jumps identified during the multi rebound. |
| `top5PeakMRsi` | Top 5 Jumps Peak mRSI |  | The highest mRSI (jump height calculated using time in the air divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the five highest jumps identified during the multi rebound. |
| `top5PeakRsi` | Top 5 Jumps Peak RSI |  | The highest RSI (time taken to complete the flight phase divided by the total time taken from initial contact to the instant of take-off [i.e. Time to Take-off]) of the five highest jumps identified during the multi rebound. |
| `totalContactTime` | Total Contact Time | s | The summed contact time of all the jumps performed during the multi rebound. |
| `totalFlightTime` | Total Flight Time | s | The summed time in the air of all the jumps performed during the multi rebound. |
| `top3AvgContactTime` | Top 3 Jumps Avg. Contact Time | s | The average contact time of the three highest jumps identified during the multi rebound, calculated using the time from initial contact to the instant of take-off (i.e. Time to Take-off). |
| `top5AvgContactTime` | Top 5 Jumps Avg. Contact Time | s | The average contact time of the five highest jumps identified during the multi rebound, calculated using the time from initial contact to the instant of take-off (i.e. Time to Take-off). |
| `avgContactTime` | Avg. Contact Time | s | The average contact time of all the jumps performed during the multi rebound, calculated using the time from initial contact to the instant of take-off (i.e. Time to Take-off). |
| `weight` | System Weight | N | The lowest 1 s average of the vertical ground reaction force applied to the system center of mass during the weighting phase, identified by an optimization loop. |

## Squat Jump metrics

`canonicalTestTypeId`: `QEG7m7DhYsD6BrcQ8pic`. 47 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `avgLandingForce` | Avg. Landing Force | N | The average vertical ground reaction force applied to the system center of mass during the landing phase. |
| `landingHeight` | Landing Height | m | The vertical free fall height of the system centre of mass between apex of the preceding jump and the instant they make contact with the force plate(s) to commence the landing phase. |
| `landingPerformanceIndex` | Landing Performance Index |  | The free fall height divided by the landing time. |
| `landingTime` | Landing Phase | s | The time taken to complete the landing phase (starting at the instant of touchdown and ending at the first instant that center of mass velocity equals zero). |
| `avgPropulsiveForce` | Avg. Propulsive Force | N | The average vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `avgPropulsivePower` | Avg. Propulsive Power | W | The average mechanical power applied to the system center of mass during the propulsion phase. |
| `avgPropulsiveVelocity` | Avg. Propulsive Velocity | m/s | The average vertical velocity of the system center of mass during the propulsion phase. |
| `avgRelativePropulsiveForce` | Avg. Relative Propulsive Force | % | The average vertical ground reaction force applied to the system center of mass during the propulsive phase as a percentage of system weight. |
| `avgRelativePropulsivePower` | Avg. Relative Propulsive Power | W/kg | The average mechanical power applied to the system center of mass during the propulsion phase relative to system mass. |
| `flightTime` | Flight Time | s | The time taken to complete the flight phase. |
| `jumpHeight` | Jump Height | m | The change in system center of mass position between the instant of take-off and peak positive vertical displacement of the system center of mass, calculated using the vertical velocity of the system center of mass at the instant of take-off and the equations of uniformly accelerated motion. |
| `jumpMomentum` | Jump Momentum | kg.m/s | The vertical momentum of the system center of mass at the instant of take-off. |
| `landingStiffness` | Landing Stiffness | N/m | The vertical ground reaction force applied to the system center of mass at the instant of peak negative vertical displacement of the system center of mass divided by the peak negative vertical displacement of the system center of mass during the landing phase. |
| `leftAvgLandingForce` | Left Avg. Landing Force | N | The average left vertical ground reaction force applied to the system center of mass during the landing phase. |
| `leftAvgPropulsiveForce` | Left Avg. Propulsive Force | N | The average left vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `leftPeakLandingForce` | Left Force at Peak Landing Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `leftPeakPropulsiveForce` | Left Force at Peak Propulsive Force | N | The left vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `lrAvgLandingForce` | L\|R Avg. Landing Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the landing phase. |
| `lrAvgPropulsiveForce` | L\|R Avg. Propulsive Force | % | The asymmetry between the left and right average vertical ground reaction forces applied to the system center of mass during the propulsion phase. |
| `lrLandingImpulseIndex` | L\|R Landing Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the landing phase. |
| `lrPeakLandingForce` | L\|R Peak Landing Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the landing phase. |
| `lrPeakPropulsiveForce` | L\|R Peak Propulsive Force | % | The asymmetry between the left and right vertical ground reaction forces applied to the system center of mass at the instant of peak vertical ground reaction force during the propulsion phase. |
| `lrPropulsiveImpulseIndex` | L\|R Propulsive Impulse Index | % | The asymmetry between the left and right vertical impulses applied to the system center of mass during the propulsion phase. |
| `peakLandingForce` | Peak Landing Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `peakPropulsiveForce` | Peak Propulsive Force | N | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `peakPropulsivePower` | Peak Propulsive Power | W | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase. |
| `peakRelativePropulsiveForce` | Peak Relative Propulsive Force | % | The peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase as a percentage of system weight. |
| `peakRelativePropulsivePower` | Peak Relative Propulsive Power | W/kg | The peak instantaneous mechanical power applied to the system center of mass during the propulsion phase relative to system mass. |
| `peakVelocity` | Peak Velocity | m/s | The peak instantaneous vertical velocity of the system center of mass. |
| `propulsiveNetImpulse` | Propulsive Net Impulse | N.s | The net vertical impulse applied to the system center of mass during the propulsion phase. |
| `propulsivePhase` | Propulsive Phase | s | The time taken to complete the propulsion phase. |
| `propulsiveRFD` | Propulsive RFD | N/s | The rate of force development for onset of test to peak force - higher is typically better for explosive athletes |
| `relativePeakLandingForce` | Relative Peak Landing Force | % | The average vertical ground reaction force applied to the system center of mass during the landing phase as a percentage of system weight. |
| `relativePropulsiveImpulse` | Relative Propulsive Net Impulse | N.s/kg | The vertical impulse applied to the system center of mass during the propulsion phase relative to system mass. |
| `rightAvgLandingForce` | Right Avg. Landing Force | N | The average right vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightAvgPropulsiveForce` | Right Avg. Propulsive Force | N | The average right vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `rightPeakLandingForce` | Right Force at Peak Landing Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the landing phase. |
| `rightPeakPropulsiveForce` | Right Force at Peak Propulsive Force | N | The right vertical ground reaction force applied to the system center of mass at the point of the peak instantaneous vertical ground reaction force applied to the system center of mass during the propulsion phase. |
| `takeoffVelocity` | Takeoff Velocity | m/s | The vertical velocity of the system center of mass at the instant of take-off. |
| `timeToStabilization` | Time to Stabilization | ms | The time taken for the vertical ground reaction force applied to the system center of mass to remain within 5% of system weight for 1s. |
| `timeToTakeoff` | Time To Takeoff | s | The total time taken from the initiation of movement to the instant of take-off. |
| `totalPropulsiveImpulse` | Propulsive Impulse | N.s | The vertical impulse applied to the system center of mass during the propulsion phase. |
| `totalRelativePropulsiveImpulse` | Relative Propulsive Impulse | N.s/kg | Impulse per kilo the subject generated during the propulsive phase. |
| `weight` | System Weight | N | The lowest 1 s average of the vertical ground reaction force applied to the system center of mass during the weighting phase, identified by an optimization loop. |
| `p1PropulsiveImpulse` | P1 Propulsive Impulse | N.s | The propulsive impulse applied during the first half of the propulsive phase. |
| `p2PropulsiveImpulse` | P2 Propulsive Impulse | N.s | The propulsive impulse applied during the second half of the propulsive phase. |
| `p1p2PropulsiveImpulseIndex` | P1\|P2 Propulsive Impulse Index |  | The ratio of the propulsive impulse applied during the first half of the propulsive phase to the propulsive impulse applied during the second half of the propulsive phase. |

## TS Free Run metrics

`canonicalTestTypeId`: `4KlQgKmBxbOY6uKTLDFL`. 17 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `peakForce` | Peak Force | N | The peak instantaneous force applied during the repetition. |
| `peakNetForce` | Peak Net Force | N | The net peak instantaneous force applied during the repetition. |
| `avgForce` | Avg. Force | N | The mean force applied during the repetition. |
| `avgNetForce` | Avg. Net Force | N | The mean net force applied during the repetition. |
| `impulse` | Total Impulse | N.s | The total impulse (area under the force-time curve) applied during the repetition. |
| `netImpulse` | Net Impulse | N.s | The net total impulse (area under the force-time curve to the pretension line) applied during the repetition. |
| `peakRFD` | Peak RFD | N/s | The peak instantaneous RFD applied during the repetition. |
| `duration` | Duration | s | The time between the start and the end of the repetition. |
| `pretension` | Pretension | N | The force threshold that determines when a repetition begins and ends. |
| `target` | Target | N | The target force for the repetition. |
| `timeToPeakForce` | Time to Peak Force | s | The time from the beginning of the repetition until peak force was acheived. |
| `explosiveStrengthIndex` | Explosive Strength Index |  | The net peak force over the time to peak force. |
| `netForceAt50` | Net Force at 50 ms | N | The net instantaneous force applied at 50 ms during the repetition. |
| `netForceAt100` | Net Force at 100 ms | N | The net instantaneous force applied at 100 ms during the repetition. |
| `netForceAt150` | Net Force at 150 ms | N | The net instantaneous force applied at 150 ms during the repetition. |
| `netForceAt200` | Net Force at 200 ms | N | The net instantaneous force applied at 200 ms during the repetition. |
| `netForceAt250` | Net Force at 250 ms | N | The net instantaneous force applied at 250 ms during the repetition. |

## TS Isometric Test metrics

`canonicalTestTypeId`: `umnEZPgi6zaxuw0KhUpM`. 17 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `peakForce` | Peak Force | N | The peak instantaneous force applied during the repetition. |
| `peakNetForce` | Peak Net Force | N | The net peak instantaneous force applied during the repetition. |
| `avgForce` | Avg. Force | N | The mean force applied during the repetition. |
| `avgNetForce` | Avg. Net Force | N | The mean net force applied during the repetition. |
| `impulse` | Total Impulse | N.s | The total impulse (area under the force-time curve) applied during the repetition. |
| `netImpulse` | Net Impulse | N.s | The net total impulse (area under the force-time curve to the pretension line) applied during the repetition. |
| `peakRFD` | Peak RFD | N/s | The peak instantaneous RFD applied during the repetition. |
| `duration` | Duration | s | The time between the start and the end of the repetition. |
| `pretension` | Pretension | N | The force threshold that determines when a repetition begins and ends. |
| `target` | Target | N | The target force for the repetition. |
| `timeToPeakForce` | Time to Peak Force | s | The time from the beginning of the repetition until peak force was acheived. |
| `explosiveStrengthIndex` | Explosive Strength Index |  | The net peak force over the time to peak force. |
| `netForceAt50` | Net Force at 50 ms | N | The net instantaneous force applied at 50 ms during the repetition. |
| `netForceAt100` | Net Force at 100 ms | N | The net instantaneous force applied at 100 ms during the repetition. |
| `netForceAt150` | Net Force at 150 ms | N | The net instantaneous force applied at 150 ms during the repetition. |
| `netForceAt200` | Net Force at 200 ms | N | The net instantaneous force applied at 200 ms during the repetition. |
| `netForceAt250` | Net Force at 250 ms | N | The net instantaneous force applied at 250 ms during the repetition. |

## TS Multi Strike Test metrics

`canonicalTestTypeId`: `lTxe8g3IvOmRTtM0JpFE`. 2 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `peakForce` | Peak Strike Force | N | The peak force achieved during the test. |
| `relativePeakForce` | Relative Peak Strike Force | N/kg | The highest peak force achieved during the test relative to bodyweight. |

## TS Strike Test metrics

`canonicalTestTypeId`: `iwRh0Pzy5xUxz5nqLYij`. 2 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `peakForce` | Peak Strike Force | N | The peak force achieved during the test. |
| `relativePeakForce` | Relative Peak Strike Force | N/kg | The highest peak force achieved during the test relative to bodyweight. |

## Weigh In metrics

`canonicalTestTypeId`: `ubeWMPN1lJFbuQbAM97s`. 4 metrics.

| `id` | Label | Units | Description |
|---|---|---|---|
| `weight` | Weight in Newtons | N | Weight in Newtons. |
| `weightKgs` | Weight | kgs | Weight in Kilograms |
| `weightLbs` | Weight | lbs | Weight in Pounds |
| `standardDeviation` | Standard Deviation | N | The standard deviation of the weighing period. Can be used to determine if the subject was moving too much. |
