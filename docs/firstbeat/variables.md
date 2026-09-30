---
source_type: curated
source_url: https://apidocs.firstbeat.com/variables/
upstream_version: Firstbeat Cloud API 1.1.0 (OpenAPI 3.0.1)
crawled_at: 2026-09-30
---

# Firstbeat Variables

## About Firstbeat variables

Analysis results (the `/results` endpoints) return `variables`: scalars (`Variable`:
`name`, `unit`, `value`) and time series (`TimeSeriesVariable`: `name`, `unit`,
`samplingRate`, `type`, `bits`, `value`). The OpenAPI spec does not list the
variable names. Firstbeat lists them on its "Available Variables" page,
https://apidocs.firstbeat.com/variables/, checked 2026-09-30: 100 scalars and
17 time series. The tables here copy that page's names, units and
descriptions as published, grouped for navigation. The page does not group them.

Request variables by name with the `var` query parameter, as a comma-separated
list, for example `?var=trimp,trimpPerMinute,heartRateAverage`.

**Personal data.** These variables are heart rate, heart rate variability,
respiration, sleep and recovery measures of an identifiable athlete. They are health
data, which is special category data under UK and EU GDPR.

The page's warning on heart rate zone names, verbatim: "Due to technical and
historical reasons, names of the heart rate zone variables are different than in
the rest of the system! In the Cloud API, zone1 is highest zone (high intensity)."

"Data Export variable name" is the page's name for the same value in the Sports
Cloud data export (MS Excel export).

## Scalar variables: heart rate and heart rate zones

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `heartRateAverage` | 1/min | The average heart rate value for the measurement. | Average HR (bpm) |
| `heartRatePeak` | 1/min | The highest heart rate value achieved during the measurement. | Peak HR (bpm) |
| `heartRateLowest` | 1/min | The lowest heart rate value achieved during the measurement. | Minimum Heart rate |
| `heartRateAveragePercentage` | % | Average %HRmax from the recorded measurement. Calculated based on the maximum heart rate value set to the profile. | Average %HRmax (%) |
| `heartRatePeakPercentage` | % | Peak value of %HRmax. Calculated based on the set maximum heart rate. | Peak HR (bpm) |
| `heartRateMinimumPercentage` | % | Minimum value of %HRmax. Calculated based on the set maximum heart rate value. | Minimum HR (bpm) |
| `zone1Time` | min | The overall time spent in heart rate zone1 during the measurement. The exercise intensities are categorized into different zones based on the percentage of personal maximal heart rate (%Hrmax). | High intensity training (hh:mm:ss) |
| `zone2Time` | min | The overall time spent in heart rate zone2 during the measurement. | Anaerobic threshold zone (hh:mm:ss) |
| `zone3Time` | min | The overall time spent in heart rate zone3 during the measurement. | Aerobic zone 2 (hh:mm:ss) |
| `zone4Time` | min | The overall time spent in heart rate zone4 during the measurement. | Aerobic zone 1 (hh:mm:ss) |
| `zone5Time` | min | The overall time spent in heart rate zone5 during the measurement. | Recovery training (hh:mm:ss) |
| `underZonesTime` | min | The overall time spent below the set heart rate zones during the measurement. | Time Under Zones (hh:mm:ss) |

## Scalar variables: trimp and training load

TRIMP is Firstbeat's training impulse value. `acuteTrainingLoad` and `chronicTrainingLoad` are TRIMP sums, per the descriptions below.

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `trimp` | index | Training Impulse value. A cumulative variable illustrating training load | TRIMP (Index) |
| `trimpPerMinute` | 1/min | Average TRIMP accumulation per minute in the recorded measurement. | TRIMP/min (Index) |
| `acuteTrainingLoad` | index | The TRIMP sum from the past 7 days. | Acute Training Load |
| `chronicTrainingLoad` | index | The TRIMP sum from the past 28 days divided by 4. | Chronic Training Load |
| `acwr` | (ratio) | Acute and chronic working load ratio. | ACWR |

## Scalar variables: epoc, vo2 and training effect

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `epocPeak` | ml/kg | The highest EPOC (Excess Post-Exercise Oxygen Consumption) value achieved during the measurement. | EPOC Peak (ml/kg) |
| `epocFinal` | ml/kg | The last value of EPOC (Excess Post-Exercise Oxygen Consumption) at the end of the measurement. | EPOC (ml/kg) |
| `vo2max` | ml/kg/min | Maximal amount of oxygen in milliliters per kilogram the athlete can utilize over one minute during an intense, maximal effort. Calculated from the heart rate variability data. | VO2max (ml/kg/min) |
| `oxygenConsumptionAverage` | ml/kg/min | The average rate of oxygen consumption achieved during the measurement. | Average VO2 (ml/kg/min) |
| `oxygenConsumptionPeak` | ml/kg/min | The highest rate of oxygen consumption achieved (VO2max) during the measurement. Oxygen consumption is calculated in proportion to the person's weight. The higher the value, the higher the peak intensity of exercise. | Peak VO2 (ml/kg/min) |
| `oxygenConsumptionMaximumPercentage` | % | Peak value of %VO2max. Calculated based on the set VO2max value. | Peak %VO2max (%) |
| `oxygenConsumptionAveragePercentage` | % | Average %VO2max from the recorded measurement. | Average %VO2max (%) |
| `aerobicTrainingEffect` | 0.0 - 5.0 | The 0-5 score of the personalized impact of the training measurement on aerobic fitness development. A score 0-0.9 is defined as "no effect", 1.0-1.9 as "minor effect", 2.0-2.9 as "maintaining effect", 3.0-3.9 as "improving effect", 4.0-4.9 as "highly improving effect", and 5.0 as "overreaching effect". Not available for laps and sessions | Aerobic TE (0.0 - 5.0) |
| `anaerobicTrainingEffect` | 0.0 - 5.0 | Anaerobic Training Effect. See aerobicTrainingEffect for results scale. Not available for laps and sessions | Anaerobic TE (0.0 - 5.0) |

## Scalar variables: respiration, ventilation and energy

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `respirationRateAverage` | 1/min | Average respiration rate in times per minute. Calculated from the heart rate variability data. | Average RespR (times/min) |
| `respirationRatePeak` | 1/min | Peak value of respiration rate in times per minute | Peak RespR (times/min) |
| `energyConsumptionCarbs` | kcal | Shows the carbohydrate energy expenditure in the recorded measurement in kcal. | EE Carbohydrates (kcal) |
| `energyConsumptionFats` | kcal | Shows the fat energy expenditure in recorded measurement in kcal. | EE Fats (kcal) |
| `energyConsumptionTotal` | kcal | The overall energy (kilocalorie) consumption during the measurement. | EE Total (kcal) |
| `ventilationAverage` | liter/min | Average rate of air intake | Average VE (liter/min) |
| `ventilationPeak` | liter/min | Highest rate of air intake | Peak VE (liter/min) |

## Scalar variables: movement load

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `movementLoad` | index | Total accumulated movement load. | Movement load |
| `averageMovementIntensity` | index | Average of the accumulation rate of movement load. | Average movement intensity. This is a Premium+ feature |

## Scalar variables: recovery, hrv and sleep

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `quickRecoveryTestScore` | index | The 0-100% score of the personalized result of the Quick Recovery Test (QRT). Only available for quick recovery tests | Quick recovery test (Index) |
| `quickRecoveryScaledScore` | % | Scaled quick recovery index calculated based on the athlete's minimum and maximum quick recovery test index value. Only available for quick recovery tests | Scaled Quick Recovery Test (%) |
| `scaledQrtWeeklyMean` | % | Athlete's individual quick recovery test 7-day average. Only available for quick recovery tests | - |
| `playerStatusScore` | 0-100 | Training status describes the balance of training for an individual athlete. Scale: well balanced: over 70, moderately balanced: 30-70, out of balance: below 30. This is a Premium+ feature | Training status |
| `rmssd` | ms | Root Mean Square of Successive Differences on the RR interval series, value that indicates quality of recovery. | RMSSD (ms) |
| `rmssdSleepAverage` | ms | Root Mean Square of Successive Differences on the RR interval series, during sleep. Only available for stress & recovery measurements | RMSSD Sleep (ms) |
| `rmssdNonSleepAverage` | ms | Root Mean Square of Successive Differences on the RR interval series, during time spent awake. Only available for stress & recovery measurements | RMSSD Awake (ms) |
| `sdnn` | ms | Standard deviation of normal to normal RR intervals in milliseconds. | SDNN (ms) |
| `lfHfRatio` | % | Ratio between the high frequency and low frequency heart rate variability power during the recorded measurement. | LF/HF (%) |
| `lfAverage` | ms^2 | Mean of the low frequency heart rate variability power during the recorded measurement. | LF Average (ms^2) |
| `hfAverage` | ms^2 | Mean of the high frequency heart rate variability power during the recorded measurement. | HF Average (ms^2) |
| `vlfAverage` | ms^2 | Mean of the very low frequency heart rate variability power during the recorded measurement. | VLF Average (ms^2) |
| `recoveryStateTime` | min | The overall time spent in recovery state during the measurement. Only available for stress & recovery measurements | Relaxation time (hh:mm:ss) |
| `stressStateTime` | min | The overall time spent in stress state during the measurement. Only available for stress & recovery measurements | Stress time (hh:mm:ss) |
| `sleepStateTime` | min | Athletes's sleep duration in hours, minutes and seconds. Only available for stress & recovery measurements | Sleep duration (hh:mm:ss) |
| `sleepRecoveryIndexAbsolute` | index | An index of the athlete's recovery during sleep from the 4-hour window starting 30 minutes after going to bed. Only available for stress & recovery measurements | Recovery Index (absolute) |
| `daysSinceLastGoodRecovery` | days | Athletes's time since good recovery in days. Only available for quick recovery tests | Quick recovery test (Time since good recovery) (Days) |
| `measurementError` | % | Average percentage of RR intervals recognized as artifacts after the artifact correction has corrected the data. If the measurement is a result of merging two or more measurements, any gaps between data is counted to this. | Missing or poor quality data (%) |
| `perceivedRecovery` | 1-5 | Perceived recovery value from athlete. Not available for laps and sessions | Perceived recovery |
| `firstbeatPointsStressBalance` | 0-100 | A score ranging from 0 to 100 that evaluates the balance between stress and recovery responses over a 24-hour cycle, including both day and sleep | 24h stress & recovery balance (%) |

## Scalar variables: heart rate recovery

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `heartRateRecoveryRelative30s` | % | The largest drop in heart rate level over a 30 second window relative to athlete's personal maximum heart rate. This is a Premium+ feature | HR Recovery (30s, %) |
| `heartRateRecoveryRelative60s` | % | The largest drop in heart rate level over a 60 second window relative to athlete's personal maximum heart rate. This is a Premium+ feature | HR Recovery (60s, %) |
| `heartRateRecoveryRelative120s` | % | The largest drop in heart rate level over a 120 second window relative to athlete's personal maximum heart rate. This is a Premium+ feature | HR Recovery (120s, %) |
| `heartRateRecoveryAbsolute30s` | 1/min | The largest drop in heart rate level over a 30 second window. This is a Premium+ feature | HR Recovery (30s, bpm) |
| `heartRateRecoveryAbsolute60s` | 1/min | The largest drop in heart rate level over a 60 second window. This is a Premium+ feature | HR Recovery (60s, bpm) |
| `heartRateRecoveryAbsolute120s` | 1/min | The largest drop in heart rate level over a 120 second window. This is a Premium+ feature | HR Recovery (120s, bpm) |

## Scalar variables: distance, speed, power and cadence

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `distance` | m | Not available for laps and sessions | Distance (m) |
| `speedAverage` | km/h | Not available for laps and sessions | Average Speed (km/h) |
| `pace` | min/km | Not available for laps and sessions | Pace (min/km) |
| `powerAverage` | W | Not available for laps and sessions | Power (W) |
| `cadenceAverage` | 1/min | Not available for laps and sessions | Cadence (rpm) |
| `ascent` | m | Not available for laps and sessions | Ascent (m) |
| `descent` | m | Not available for laps and sessions | Descent (m) |

## Scalar variables: maximal intensity periods: movement intensity

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `movementIntensityHighest5s` | kicks/min | The highest increase in movement load over a 5 second window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 5s |
| `movementIntensityHighest10s` | kicks/min | The highest increase in movement load over a 10 second window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 10s |
| `movementIntensityHighest15s` | kicks/min | The highest increase in movement load over a 15 second window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 15s |
| `movementIntensityHighest20s` | kicks/min | The highest increase in movement load over a 20 second window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 20s |
| `movementIntensityHighest30s` | kicks/min | The highest increase in movement load over a 30 second window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 30s |
| `movementIntensityHighest45s` | kicks/min | The highest increase in movement load over a 45 second window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 45s |
| `movementIntensityHighest1min` | kicks/min | The highest increase in movement load over a 1 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 1min |
| `movementIntensityHighest2min` | kicks/min | The highest increase in movement load over a 2 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 2min |
| `movementIntensityHighest3min` | kicks/min | The highest increase in movement load over a 3 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 3min |
| `movementIntensityHighest4min` | kicks/min | The highest increase in movement load over a 4 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 4min |
| `movementIntensityHighest5min` | kicks/min | The highest increase in movement load over a 5 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 5min |
| `movementIntensityHighest10min` | kicks/min | The highest increase in movement load over a 10 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 10min |
| `movementIntensityHighest15min` | kicks/min | The highest increase in movement load over a 15 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 15min |
| `movementIntensityHighest20min` | kicks/min | The highest increase in movement load over a 20 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 20min |
| `movementIntensityHighest30min` | kicks/min | The highest increase in movement load over a 30 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 30min |
| `movementIntensityHighest45min` | kicks/min | The highest increase in movement load over a 45 minute window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 45min |
| `movementIntensityHighest1h` | kicks/min | The highest increase in movement load over a 1 hour window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 1h |
| `movementIntensityHighest2h` | kicks/min | The highest increase in movement load over a 2 hour window. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period MI 2h |

## Scalar variables: maximal intensity periods: trimp per minute

| API variable name | Unit | Description | Data Export variable name |
|---|---|---|---|
| `trimpPerMinHighest30s` | 1/min | The highest increase in TRIMP (Training impulse) over a 30 second period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 30s |
| `trimpPerMinHighest45s` | 1/min | The highest increase in TRIMP (Training impulse) over a 45 second period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 45s |
| `trimpPerMinHighest1min` | 1/min | The highest increase in TRIMP (Training impulse) over a 1 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 1min |
| `trimpPerMinHighest2min` | 1/min | The highest increase in TRIMP (Training impulse) over a 2 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 2min |
| `trimpPerMinHighest3min` | 1/min | The highest increase in TRIMP (Training impulse) over a 3 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 3min |
| `trimpPerMinHighest4min` | 1/min | The highest increase in TRIMP (Training impulse) over a 4 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 4min |
| `trimpPerMinHighest5min` | 1/min | The highest increase in TRIMP (Training impulse) over a 5 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 5min |
| `trimpPerMinHighest10min` | 1/min | The highest increase in TRIMP (Training impulse) over a 10 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 10min |
| `trimpPerMinHighest15min` | 1/min | The highest increase in TRIMP (Training impulse) over a 15 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 15min |
| `trimpPerMinHighest20min` | 1/min | The highest increase in TRIMP (Training impulse) over a 20 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 20min |
| `trimpPerMinHighest30min` | 1/min | The highest increase in TRIMP (Training impulse) over a 30 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 30min |
| `trimpPerMinHighest45min` | 1/min | The highest increase in TRIMP (Training impulse) over a 45 minute period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 45min |
| `trimpPerMinHighest1h` | 1/min | The highest increase in TRIMP (Training impulse) over a 1 hour period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 1h |
| `trimpPerMinHighest2h` | 1/min | The highest increase in TRIMP (Training impulse) over a 2 hour period. Only available for exercise measurements. This is a Premium+ feature | Maximal Intensity Period TRIMP/min 2h |

## Time series variables

The page says: "Time Series variables marked with an 1) need to be explicitly requested from the /results endpoints due to their data-heavy nature. To request them, use the ?var= query parameter." The "Explicit request" column below records that mark. The "Querying the API" page says time series `value` is zlib compressed and Base64-encoded by default, and `format=list` returns JSON lists of numbers instead.

| API variable name | Explicit request | Unit | Sampling Rate (Hz) | Type | Bits | Description |
|---|---|---|---|---|---|---|
| `rmssd1MinSeries` | yes | ms | 0.02 | Float | 64 | RMSSD series, 5min sample rate |
| `vlfSeries` | yes | ms^2 | 1 | Float | 64 | Time series data for the mean of the very low frequency heart rate variability. |
| `lfSeries` | yes | ms^2 | 1 | Float | 64 | Time series data for the mean of the low frequency heart rate variability. |
| `hfSeries` | yes | ms^2 | 1 | Float | 64 | Time series data for the mean of the high frequency heart rate variability. |
| `artifactCorrectedRrVector` | yes | ms |  | Float | 64 | Artifact corrected RR interval series. |
| `rriSeries` | yes | ms |  | Unsigned | 16 | Uncorrected RR interval series. Not available for laps and sessions |
| `heartRateSeries` |  | 1/min | 0.2 | Unsigned | 8 | HR time series with 5s sampling rate. |
| `heartRateSeries1s` | yes | 1/min | 1 | Unsigned | 8 | HR time series with 1s sampling rate. |
| `heartRatePercentageSeries` | yes | 1/min | 0.2 | Float | 64 | Heart rate percentage series. |
| `epocSeries` |  | ml/kg | 0.2 | Float | 64 | EPOC series |
| `energyConsumptionSeries` |  | kcal/h | 0.2 | Unsigned | 16 | Energy (kilocalorie) consumption rate as kcal/h series. |
| `trimpSeries` |  |  | 0.2 | Float | 64 | TRIMP series. |
| `trimpPerMinuteSeries` | yes | 1/min | 0.2 | Float | 64 | TRIMP per minute time series. |
| `movementLoadAccumulationRate` | yes | 1/min | 0.2 | Float | 64 | Movement Load Accumulation Rate. series. This is a Premium+ feature |
| `movementLoadSeries` | yes |  | 0.2 | Float | 64 | Accumulated movement load. Not available for laps and sessions. This is a Premium+ feature |
| `energyConsumptionRelativeFatSeries` | yes | % | 0.2 | Unsigned | 8 | The relative share of total energy expenditure that comes from fats |
| `artifactPercentageSeries` | yes | % | 0.2 | Unsigned | 8 | Percentage of rejected RR intervals within each 5 second period |
